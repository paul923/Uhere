var express = require('express');
var router = express.Router();
var pool = require('../db').pool;
var mysql = require('../db').mysql;
var CronJob = require('cron').CronJob;


//TODO: Apply sort filter
router.get('/', function (req, res) {
  if (!req.query.acceptStatus) {
    res.status(400).send({
      success: false,
      error: {
        message: "Please specify acceptStatus as query parameter"
      }
    })
  }
  if (!req.query.userId) {
    res.status(400).send({
      success: false,
      error: {
        message: "Please specify userId as query parameter"
      }
    })
  }
  var acceptStatus = req.query.acceptStatus;
    var history = req.query.history ? req.query.history : 'false';
  var userId = req.query.userId;
  var limit = req.query.limit ? req.query.limit : 20;
  var offset = req.query.offset ? req.query.offset : 0;
  var sort = req.query.sort;
  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).send({
        success: false,
        error: {
          message: "Database Error"
        }
      })
    }
    if (history === 'true') {
      var sql = `SELECT Event.*, COUNT(EventUser.UserId) MemberCount
      FROM Event, EventUser
      where 1=1
      AND Event.DateTime < NOW()
      AND Event.EventID = EventUser.EventID
      AND Event.IsDeleted = false
      AND EXISTS (
      	SELECT 1
          FROM EventUser
          WHERE 1=1
          AND Event.EventID = EventUser.EventID
          and EventUser.Status = '${acceptStatus}'
          and EventUser.UserId = '${userId}'
      )
      GROUP BY Event.EventId
      LIMIT ${limit} OFFSET ${offset}`
    } else {
      var sql = `SELECT Event.*, COUNT(EventUser.UserId) MemberCount
      FROM Event, EventUser
      where 1=1
      AND Event.DateTime > NOW()
      AND Event.EventID = EventUser.EventID
      AND Event.IsDeleted = false
      AND EXISTS (
      	SELECT 1
          FROM EventUser
          WHERE 1=1
          AND Event.EventID = EventUser.EventID
          and EventUser.Status = '${acceptStatus}'
          and EventUser.UserId = '${userId}'
      )
      GROUP BY Event.EventId
      LIMIT ${limit} OFFSET ${offset}`
    }
    connection.query(sql, function (error, results, fields) {
      // If some error occurs, we throw an error.
      if (error) {
        res.status(500).send({
          success: false,
          error: {
            message: "Database Error"
          }
        })
      }
      // Getting the 'response' from the database and sending it to our route. This is were the data is.
      if (results.length > 0) {
        const promises = []
        results.forEach(result => {
          var sql = `select User.* from User, EventUser where EventId = '${result.EventId}'
          AND User.UserId = EventUser.UserId
          AND EventUser.Status = 'ACCEPTED';`;
          console.log(sql);
          const promise = new Promise((resolve, reject) => {
            connection.query(sql, function (error, results, fields) {
              if (error) {
                res.status(500).send(error);
              } else {
                result.Members = results;
                resolve()
              }
            });
          })
          promises.push(promise)
        });
        Promise.all(promises).then(() => {
          connection.release();
          res.status(200).send({
            success: true,
            body: {
              results
            }
          })
        })

      } else {
        res.status(404).send({
          success: false,
          error: {
            message: "Not Found"
          }
        })
      }
    });
  });
})

router.get('/:eventId', function (req, res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).send({
        success: false,
        error: {
          message: "Database Error"
        }
      })
    }
    var sql = `select * FROM ?? WHERE EventId = ? and IsDeleted = false`;
    var parameters = ['Event', req.params.eventId];
    sql = mysql.format(sql, parameters);
    connection.query(sql, function (error, results, fields) {
      // If some error occurs, we throw an error.
      if (error) {
        res.status(500).send({
          success: false,
          error: {
            message: "Database Error"
          }
        })
      }
      // Getting the 'response' from the database and sending it to our route. This is were the data is.
      if (results.length > 0) {
        sql = `SELECT * FROM EventUser
        left join User on EventUser.UserId = User.UserId
          WHERE 1=1
          AND EventUser.EventId = ${req.params.eventId}
          AND EventUser.IsDeleted = false
          AND User.IsDeleted = false`;
        // Executing the MySQL query (select all data from the 'users' table).
        connection.query(sql, function (error, eventUsers, fields) {
          connection.release();
          if (error) {
            res.status(500).send({
              success: false,
              error: {
                message: "Database Error"
              }
            })
          }
          results[0].eventUsers = eventUsers
          res.status(200).send({
            success: true,
            body: {
              results
            }
          })
        });
      } else {
        res.status(404).send({
          success: false,
          error: {
            message: "Not Found"
          }
        })
      }
    });
  });
})

router.patch('/:eventId/users/:userId', function (req, res) {
  if (!req.body.status) {
    res.status(400).send({
      success: false,
      error: {
        message: "Please specify status as body parameter"
      }
    })
  }
  if (req.body.status !== "ACCEPTED" && req.body.status !== "DECLINED") {
    res.status(400).send({
      success: false,
      error: {
        message: "Valid values for status are 'ACCEPTED' or 'DECLINED'"
      }
    })
  }
  var status = req.body.status;

  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).send({
        success: false,
        error: {
          message: "Database Error"
        }
      })
    }
    var sql = "UPDATE ?? SET STATUS = ? WHERE UserId = ? AND EventId = ? AND IsDeleted = false";
    var parameters = ['EventUser', status, req.params.userId, req.params.eventId];
    sql = mysql.format(sql, parameters);
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        res.status(500).send({
          success: false,
          error: {
            message: "Database Error"
          }
        })
      }
      if (results.affectedRows > 0) {
        if (req.body.status === "ACCEPTED") {
          res.status(200).send({
            success: true,
            body: {
              message: "Event is Accepted"
            }
          })
        } else {
          res.status(200).send({
            success: true,
            body: {
              message: "Event is Declined"
            }
          })
        }
      } else {
        res.status(404).send({
          success: false,
          error: {
            message: "Event Not Found"
          }
        })
      }
    });
  });
})

router.delete('/:eventId', function (req, res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).send({
        success: false,
        error: {
          message: "Database Error"
        }
      })
    }
    var sql = "UPDATE ?? SET isDeleted = ? WHERE EventId = ? AND IsDeleted = false";
    var parameters = ['Event', true, req.params.eventId];
    sql = mysql.format(sql, parameters);
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql, function (error, results, fields) {
      if (err) {
        res.status(500).send({
          success: false,
          error: {
            message: "Database Error"
          }
        })
      }
      if (results.affectedRows > 0) {
        sql = "UPDATE ?? SET isDeleted = ? WHERE EventId = ?";
        parameters = ['EventJob', true, req.params.eventId];
        sql = mysql.format(sql, parameters);
        connection.query(sql, function (error, results, fields) {
          if (err) {
            res.status(500).send({
              success: false,
              error: {
                message: "Database Error"
              }
            })
          }
          res.status(204).send({
            success: true,
            body: {
              message: "Event is Deleted"
            }
          })
        })
      } else {
        res.status(404).send({
          success: false,
          error: {
            message: "Not Found"
          }
        })
      }
    });
  });
})

router.post('/', function (req,res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    if (error) {
      res.status(500).send({
        success: false,
        error: {
          message: "Database Error"
        }
      })
    }
    var event = {
      ...req.body.event,
      DateTime: new Date(req.body.event.DateTime)
    }
    var eventSql = "INSERT INTO ?? SET ?";
    var parameters = ['Event'];
    eventSql = mysql.format(eventSql, parameters);
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(eventSql, event, function (error, results, fields) {
      // If some error occurs, we throw an error.
      if (error) {
        connection.release();
        res.status(500).send({
          success: false,
          error: {
            message: "Database Error"
          }
        })
      }
      if (results.insertId) {
        let users = [];
        if (req.body.users){
          users = req.body.users.map(x => [results.insertId, x.UserId, 'PENDING', false, null, 0]);
        }
        users.push([results.insertId, req.body.host, 'ACCEPTED', true, null, 0]);
        const eventId = results.insertId;
        var eventUserSql = "INSERT INTO ?? VALUES ?";
        var parameters = ['EventUser'];
        eventUserSql = mysql.format(eventUserSql, parameters);
        connection.query(eventUserSql, [users], function (error, eventUserResults, fields) {
          //TODO: Handle the case that event is inserted, but eventUsers are not inserted
          if (error) {
            connection.release();
            res.status(500).send({
              success: false,
              error: {
                message: "Database Error"
              }
            })
          }
          var eventJob = {
            EventId: results.insertId,
            DateTime: new Date(req.body.event.DateTime),
            IsProcessed: 0
          }
          var eventJobSql = "INSERT INTO ?? SET ?";
          parameters = ['EventJob']
          eventJobSql = mysql.format(eventJobSql, parameters);
          connection.query(eventJobSql, eventJob, function (error, eventJobResult, fields) {
            if (error) {
              connection.release();
              res.status(500).send({
                success: false,
                error: {
                  message: "Database Error"
                }
              })
            }
            console.log(eventJobResult);
            var thirtyMinutesBeforeEvent = new Date(event.DateTime.setMinutes(event.DateTime.getMinutes() - 30));
            var jobDate = thirtyMinutesBeforeEvent > new Date() ? thirtyMinutesBeforeEvent : new Date();
            var job = new CronJob(
            	jobDate,
            	function() {
            		console.log(`Cron Job For ${eventId} Started`);
                pool.getConnection(function (err, connection) {
                  var sql = `select UserId FROM EventUser where EventID = '${eventId}'`
                  connection.query(sql, function (error, userResults, fields) {
                    if (error) {
                      connection.release();
                      res.status(500).send({
                        success: false,
                        error: {
                          message: "Database Error"
                        }
                      })
                    }
                    req.app.get('io').in('lobby').clients(function(error, clients) {
                      clients.forEach(function(socketId){
                        const socket = req.app.get('io').sockets.connected[socketId];
                        if (socket.events){
                          socket.events.push(eventId)
                        } else {
                          socket.events = [eventId]
                        }
                        if (userResults.some(user => {
                          return user.UserId === socket.userId
                        })){
                          console.log(`${socket.userId} Joined Room ${eventId}`)
                          socket.join(eventId);
                        }
                      })
                    })
                    eventJobSql = "UPDATE ?? SET IsProcessed = 1 WHERE EventId = ?";
                    parameters = ['EventJob', eventId]
                    eventJobSql = mysql.format(eventJobSql, parameters);
                    connection.query(eventJobSql, function (error, eventJobResult, fields) {
                      connection.release();
                      if (error) {
                        res.status(500).send({
                          success: false,
                          error: {
                            message: "Database Error"
                          }
                        })
                      }
                    })
                  });
                })
            	},
            	null,
            	true,
            	null
            );
            res.status(201).send({
              success: true,
              body: {
                message: "Event is Created"
              }
            })
          })
        })
      } else {
        res.status(400).send({
          success: false,
          error: {
            message: "Event Not Created"
          }
        })
      }
    });
  });
})

module.exports = router;
