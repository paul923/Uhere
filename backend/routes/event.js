var express = require('express');
var router = express.Router();
var pool = require('../db').pool;
var mysql = require('../db').mysql;

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
router.get('/history/:userId', function (req, res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = `SELECT Event.*, COUNT(EventUser.UserId) MemberCount
    FROM Event, EventUser
    where 1=1
    AND Event.DateTime < NOW()
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
    var sql = `SELECT *
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
        users.push([results.insertId, req.body.host, 'ACCEPTED', true]);
        var eventUserSql = "INSERT INTO ?? VALUES ?";
        var parameters = ['EventUser'];
        eventUserSql = mysql.format(eventUserSql, parameters);
        connection.query(eventUserSql, [users], function (error, results, fields) {
          if (error) {
            throw error;
            connection.release();
          }
          connection.release();
          console.log(results);
          res.json({"status": 200, "response": "Inserted"});
        })
      }
    });
  });
})

module.exports = router;
