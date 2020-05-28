var express = require('express');
var router = express.Router();
var pool = require('../db').pool;
var mysql = require('../db').mysql;
var CronJob = require('cron').CronJob;

// Creating a GET route that returns data from the 'users' table.
router.get('/pending/:userId', function (req, res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = `SELECT Event.*, COUNT(EventUser.UserId) MemberCount
    FROM Event, EventUser
    where 1=1
    AND Event.EventID = EventUser.EventID
    AND EXISTS (
    	SELECT 1
        FROM EventUser
        WHERE 1=1
        AND Event.EventID = EventUser.EventID
        and EventUser.Status = 'PENDING'
        and EventUser.UserId = '${req.params.userId}'
    )
    GROUP BY Event.EventId`
    connection.query(sql, function (error, results, fields) {
      connection.release();
      // If some error occurs, we throw an error.
      if (error) throw error;
      // Getting the 'response' from the database and sending it to our route. This is were the data is.
      res.send(results)
    });
  });
});

// Creating a GET route that returns data from the 'users' table.
router.get('/accepted/:userId', function (req, res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = `SELECT Event.*, COUNT(EventUser.UserId) MemberCount
    FROM Event, EventUser
    where 1=1
    AND Event.EventID = EventUser.EventID
    AND EXISTS (
    	SELECT 1
        FROM EventUser
        WHERE 1=1
        AND Event.EventID = EventUser.EventID
        and EventUser.Status != 'PENDING'
        and EventUser.UserId = '${req.params.userId}'
    )
    GROUP BY Event.EventId`
    connection.query(sql, function (error, results, fields) {
      connection.release();
      // If some error occurs, we throw an error.
      if (error) throw error;
      // Getting the 'response' from the database and sending it to our route. This is were the data is.
      res.send(results)
    });
  });
});

// Creating a GET route that returns data from the 'users' table.
router.get('/ongoing/:userId', function (req, res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = `SELECT EventId
    FROM Event
    WHERE 1=1
    AND NOW() Between DATE_SUB(Event.DateTime, INTERVAL 5000 MINUTE) AND Event.DateTime
    AND EventID IN (
    	SELECT EventUser.EventID FROM EventUser
        where EventUser.UserId = '${req.params.userId}'
    );`
    connection.query(sql, function (error, results, fields) {
      connection.release();
      // If some error occurs, we throw an error.
      if (error) throw error;
      // Getting the 'response' from the database and sending it to our route. This is were the data is.
      res.send(results)
    });
  });
});

router.get('/detail/:eventId', function(req, res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = `select * FROM ?? WHERE EventId = ?`;
    var parameters = ['Event', req.params.eventId];
    sql = mysql.format(sql, parameters);
    connection.query(sql, function (error, results, fields) {
      connection.release();
      // If some error occurs, we throw an error.
      if (error) throw error;
      // Getting the 'response' from the database and sending it to our route. This is were the data is.
      res.send(results)
    });
  });
})

router.get('/users/:EventId', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "SELECT * FROM ?? WHERE EventId = ?";
    var parameters = ['EventUser', req.params.EventId];
    sql = mysql.format(sql, parameters);
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        throw error;
      }
      if (results.length > 0) {
        res.json({"status": 200, "response": results});
      } else {
        res.json({"status": 204, "response": "Not Found"})
      }
    });
  });
})

router.post('/accept', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "UPDATE ?? SET STATUS = 'ACCEPTED' WHERE UserId = ? AND EventId = ?";
    var parameters = ['EventUser', req.body.UserId, req.body.EventId];
    sql = mysql.format(sql, parameters);
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        throw error;
      }
      if (results.affectedRows > 0) {
        res.json({"status": 200, "response": "Accepted Event"});
      } else {
        res.json({"status": 204, "response": "Error Occurred during Process"})
      }
    });
  });
})

router.post('/decline', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "UPDATE ?? SET STATUS = 'DECLINED' WHERE UserId = ? AND EventId = ?";
    var parameters = ['EventUser', req.body.UserId, req.body.EventId];
    sql = mysql.format(sql, parameters);
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        throw error;
      }
      if (results.affectedRows > 0) {
        res.json({"status": 200, "response": "Declined Event"});
      } else {
        res.json({"status": 204, "response": "Error Occurred during Process"})
      }
    });
  });
})


router.post('/', function (req,res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
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
        throw error;
        connection.release();
      }
      if (results.insertId) {
        const users = req.body.users.map(x => [results.insertId, x.UserId, 'PENDING', false]);
        const eventId = results.insertId;
        users.push([results.insertId, req.body.host, 'ACCEPTED', true]);
        var eventUserSql = "INSERT INTO ?? VALUES ?";
        var parameters = ['EventUser'];
        eventUserSql = mysql.format(eventUserSql, parameters);
        connection.query(eventUserSql, [users], function (error, eventUserResults, fields) {
          if (error) {
            throw error;
            connection.release();
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
            connection.release();
            if (error) {
              throw error;
            }
            console.log(eventJobResult);
            var cronJobTime = new Date(req.body.event.DateTime);
            var job = new CronJob(
            	new Date(cronJobTime.setMinutes(cronJobTime.getMinutes() - 30)),
            	function() {
            		console.log(`Cron Job For ${eventId} Started`);
                pool.getConnection(function (err, connection) {
                  var sql = `select UserId FROM EventUser where EventID = '${eventId}'`
                  connection.query(sql, function (error, userResults, fields) {
                    if (error) {
                      throw error;
                      connection.release();
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
                        throw error;
                      }
                    })
                  });
                })
            	},
            	null,
            	true,
            	null
            );
            res.json({"status": 200, "response": "Inserted"});
          })
        })
      }
    });
  });
})

module.exports = router;
