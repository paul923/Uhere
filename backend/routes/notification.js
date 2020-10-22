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
      sql = "select * from Notification where UserId = ? and Type = ?";
      parameters = [req.params.userId, req.query.type];
    } else {
      sql = "select * from Notification where UserId = ?";
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
        res.json({"status": 200, "response": results});
      } else {
        res.json({"status": 204, "response": "Not Found"})
      }
    });
  });
})

module.exports = router;
