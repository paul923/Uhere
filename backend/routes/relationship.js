var express = require('express');
var router = express.Router();
var pool = require('../db').pool;
var mysql = require('../db').mysql;


router.get('/:userId', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "select User.* from UserRelationship, User where UserId1 = ? and User.UserId = UserRelationship.UserId2";
    var parameters = [req.params.userId];
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

router.post('/', function(req, res) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "insert into UserRelationship set ?";
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql, req.body.AddFriend, function (error, results, fields) {
      if (error) {
        throw error;
        connection.release();
      }
      connection.release();
      console.log(results);
      res.json({"status": 200, "response": 'inserted'});
    });
  });
})

module.exports = router;
