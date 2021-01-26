var express = require('express');
var router = express.Router();
var pool = require('../db').pool;
var mysql = require('../db').mysql;
var pushModule = require('../push');
var CronJob = require('cron').CronJob;

// Return original date if original date is in future.
// If not, return current date + 30 seconds - This is due to limitation of cron job module
var getCronJobDate = function (originalDate) {
  var dt = new Date();
  dt.setSeconds( dt.getSeconds() + 10 );
  var jobDate = originalDate > new Date() ? originalDate : dt;
  return jobDate;
}

var createGameStartCronJob = function(date, eventId) {
  var job = new CronJob(
    date,
    function() {
      console.log(`Cron Job For Start Notification of Event ${eventId} Started`);
      pool.getConnection(function (err, connection) {
        var sql = `select UserId FROM EventUser where EventID = '${eventId}' and Status = 'ACCEPTED'`

        connection.query(sql, function (error, userResults, fields) {
          if (error) {
            connection.release();
          }
          if (userResults.length > 0) {
            let notifications = [];
            notifications = userResults.map(x => [eventId, x.UserId, 'START', new Date()]);
            const pushNotificationUsers = userResults.map(x => [x.UserId]);
            pushModule.sendStartPushNotification(pushNotificationUsers, eventId)
            var notificationSql = "INSERT INTO ?? (EventId, UserId, Type, DateTime) VALUES ?";
            var parameters = ['Notification'];
            notificationSql = mysql.format(notificationSql, parameters);
            connection.query(notificationSql, [notifications], function (error, results, fields) {
              if (error) {
                connection.release();
                throw error;
              }
              connection.release();
            })
          } else {
            connection.release();
          }
        })
      })
    },
    null,
    true,
    null
  )
}

var createGameNotificationCronJob = function(date, eventId) {
  var job = new CronJob(
    date,
    function() {
      console.log(`Cron Job For Start Notification of Event ${eventId} Started`);
      pool.getConnection(function (err, connection) {
        var sql = `select UserId FROM EventUser where EventID = '${eventId}' and Status = 'ACCEPTED'`
        connection.query(sql, function (error, userResults, fields) {
          if (error) {
            connection.release();
          }
          if (userResults.length > 0) {
            let notifications = [];
            notifications = userResults.map(x => [eventId, x.UserId, 'BEFORE', new Date()]);
            const pushNotificationUsers = userResults.map(x => [x.UserId]);
            pushModule.sendBeforePushNotification(pushNotificationUsers, eventId)
            var notificationSql = "INSERT INTO ?? (EventId, UserId, Type, DateTime) VALUES ?";
            var parameters = ['Notification'];
            notificationSql = mysql.format(notificationSql, parameters);
            connection.query(notificationSql, [notifications], function (error, results, fields) {
              connection.release();
            })
          } else {
            connection.release();
          }
        })
      })
    },
    null,
    true,
    null
  )
}

var createLocationSharingCronJob = function(date, eventId, socketObj) {
  var job = new CronJob(
    date,
    function() {
      console.log(`Cron Job For Location Sharing for Event ${eventId} Started`);
      pool.getConnection(function (err, connection) {
        var sql = `select UserId FROM EventUser where EventID = '${eventId}' and Status = 'ACCEPTED'`
        connection.query(sql, function (error, userResults, fields) {
          if (error) {
            connection.release();
            return;
          }
          socketObj.in('lobby').clients(function(error, clients) {
            clients.forEach(function(socketId){
              const socket = socketObj.sockets.connected[socketId];
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
          })
        });
      })
    },
    null,
    true,
    null
  );
}

router.post('/push-test', function (req, res) {
  const message = {
    to: req.body.expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { data: 'goes here' },
  };


})

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
        res.send({
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

router.post('/:eventId/users/', function (req, res) {
  let users = [];
  if (req.body.users){
    users = req.body.users.map(x => [req.params.eventId, x.UserId, 'PENDING', false, null, 0]);
  }
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
      throw error;
    }
    if (eventUserResults.affectedRows > 0) {
      let notifications = [];
      notifications = req.body.users.map(x => [req.params.eventId, x.UserId, 'INVITE', new Date()]);
      var notificationSql = "INSERT INTO ?? (EventId, UserId, Type, DateTime) VALUES ?";
      var parameters = ['Notification'];
      notificationSql = mysql.format(notificationSql, parameters);
      connection.query(notificationSql, [notifications], function (error, results, fields) {
        if (error) {
          connection.release();
          res.status(500).send({
            success: false,
            error: {
              message: "Database Error"
            }
          })
          throw error;
        }
        if (results.affectedRows > 0) {
          res.status(201).send({
            success: true,
            body: {
              message: "Members are invited"
            }
          })
        }
      })

    } else {
      res.status(400).send({
        success: false,
        error: {
          message: "Members are not invited"
        }
      })
    }
  })
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

router.patch('/:eventId/:userId', function (req, res) {
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
    var sql = "UPDATE ?? SET PenaltyUser = ? WHERE EventId = ? AND IsDeleted = false";
    var parameters = ['Event', req.params.userId, req.params.eventId];
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
        res.status(200).send({
          success: true,
          body: {
            message: "Penalty User Updated"
          }
        })
      } else {
        res.status(404).send({
          success: false,
          error: {
            message: "Penalty User Not Found"
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
          res.send({
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
  pool.getConnection(function (error, connection) {
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
      DateTime: new Date(req.body.event.DateTime),
      isDeleted: 0,
      PenaltyUser: null
    }
    var eventSql = "INSERT INTO Event SET ?";
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
        throw error;
      }
      if (results.insertId) {
        const eventId = results.insertId;
        const pushNotificationUsers = req.body.users.map(x => [x.UserId]);
        pushModule.sendInvitePushNotification(pushNotificationUsers, eventId)
        let users = [];
        if (req.body.users){
          users = req.body.users.map(x => [eventId, x.UserId, 'PENDING', false, null, 0]);
        }
        users.push([eventId, req.body.host, 'ACCEPTED', true, null, 0]);
        pushNotificationUsers.push([req.body.host]);
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
            throw error;
          }
          let notifications = [];
          notifications = req.body.users.map(x => [eventId, x.UserId, 'INVITE', new Date()]);

          var notificationSql = "INSERT INTO ?? (EventId, UserId, Type, DateTime) VALUES ?";
          var parameters = ['Notification'];
          notificationSql = mysql.format(notificationSql, parameters);
          connection.query(notificationSql, [notifications], function (error, results, fields) {
            if (error) {
              connection.release();
              res.status(500).send({
                success: false,
                error: {
                  message: "Database Error"
                }
              })
              throw error;
            }
            var eventJob = {
              EventId: eventId,
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
                throw error;
              }
              console.log('event time: ' + event.DateTime);
              var thirtyMinutesBeforeEvent = new Date(event.DateTime.setMinutes(event.DateTime.getMinutes() - 30));
              // var gameStartJobDate = thirtyMinutesBeforeEvent > new Date() ? thirtyMinutesBeforeEvent : new Date();
              var gameStartJobDate = getCronJobDate(thirtyMinutesBeforeEvent);
              var beforeGameStartNotificationDate = new Date(event.DateTime.setMinutes(event.DateTime.getMinutes() - 15));
              // var beforeJobDate = beforeGameStartNotificationDate > new Date() ? beforeGameStartNotificationDate : new Date();
              var beforeJobDate = getCronJobDate(beforeGameStartNotificationDate);
              var jobDate = getCronJobDate(thirtyMinutesBeforeEvent);
              createGameStartCronJob(gameStartJobDate, eventId);
              createGameNotificationCronJob(beforeJobDate, eventId);
              createLocationSharingCronJob(jobDate, eventId, req.app.get('io'));

              res.status(201).send({
                success: true,
                body: {
                  message: "Event is Created"
                }
              })
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
