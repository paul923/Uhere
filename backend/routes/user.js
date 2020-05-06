var express = require('express');
var router = express.Router();
var pool = require('../db').pool;
var mysql = require('../db').mysql;


router.get('/:userId', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "SELECT * FROM ?? WHERE UserId = ?";
    var parameters = ['User', req.params.userId];
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
router.get('/username/:username', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "SELECT * FROM ?? WHERE Username = ?";
    var parameters = ['User', req.params.username];
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
    var user = req.body.user;
    var sql = "INSERT INTO ?? SET ?";
    var parameters = ['User'];
    sql = mysql.format(sql, parameters);
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql, user, function (error, results, fields) {
      if (error) {
        throw error;
        connection.release();
      }
      if (results.affectedRows > 0) {
        connection.release();
        res.json({"status": 200, "response": "Registered"});
      }
    });
  });
})

router.post('/group/', function (req,res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    console.log("Connected!");
    var sql = "INSERT INTO UserGroup (UserId1, UserId2, GroupName) VALUES ?";
    var data = req.body.group
    connection.query(sql, [data], function (error, results, fields) {
      if (error) {
        throw error;
        connection.release();
      }
      if (results.affectedRows > 0) {
        connection.release();
        res.json({"status": 200, "response": "Registered"});
      }
    });
  });
})

module.exports = router;
