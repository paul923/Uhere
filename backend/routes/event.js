var express = require('express');
var router = express.Router();
var pool = require('../db').pool;
var mysql = require('../db').mysql;

// Creating a GET route that returns data from the 'users' table.
router.get('/:type', function (req, res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = `select Event.*, COUNT(EventUser.UserId) MemberCount
    from uhere.Event LEFT JOIN uhere.EventUser on Event.EventId = EventUser.EventId
    where Event.STATUS = '${req.params.type}'
    group by Event.EventId`;
    connection.query(sql, function (error, results, fields) {
      connection.release();
      // If some error occurs, we throw an error.
      if (error) throw error;
      // Getting the 'response' from the database and sending it to our route. This is were the data is.
      res.send(results)
    });
  });
});


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
        const users = req.body.users.map(x => [results.insertId, x.userId, 'PENDING']);
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
