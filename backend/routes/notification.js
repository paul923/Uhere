var express = require('express');
var router = express.Router();
var pool = require('../db').pool;
var mysql = require('../db').mysql;


router.get('/:userId', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    let sql;
    let parameters;
    if (req.query.type) {
      sql = `select * from Notification left join Event on Notification.EventId = Event.EventId
      left join EventUser on Notification.EventId = EventUser.EventId and Notification.UserId = EventUser.UserId
      where Notification.UserId = ? and Type = ?`;
      parameters = [req.params.userId, req.query.type];
    } else {
      sql = `select * from Notification left join Event on Notification.EventId = Event.EventId
      left join EventUser on Notification.EventId = EventUser.EventId and Notification.UserId = EventUser.UserId
      where Notification.UserId = ?`;
      parameters = [req.params.userId];
    }
    sql = mysql.format(sql, parameters);
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        throw error;
      }
      if (results.length > 0) {
        res.status(200).send({
          success: true,
          body: {
            results
          }
        });
      } else {
        res.status(204).send({
          success: false,
          error: {
            message: "Not Found"
          }
        })
      }
    });
  });
})

router.patch('/:userId/:notificationId', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    let sql;
    let parameters;
    sql = "UPDATE Notification SET isNew = ? WHERE UserId = ? and NotificationId = ?";
    parameters = [req.body.isNew, req.params.userId, req.params.notificationId];
    sql = mysql.format(sql, parameters);
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        throw error;
      }
      if (results.length > 0) {
        res.status(200).send({
          success: true,
          body: {
            message: "Notification is Updated"
          }
        })
      } else {
        res.status(204).send({
          success: false,
          error: {
            message: "Notification Not Found"
          }
        })
      }
    });
  });
})

module.exports = router;
