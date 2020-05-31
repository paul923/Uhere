var express = require('express');
var router = express.Router();
var pool = require('../db').pool;
var mysql = require('../db').mysql;


router.get('/:userId', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "select User.* from UserRelationship, User where UserId1 = ? and User.UserId = UserRelationship.UserId2 and UserRelationship.IsDeleted = '0'";
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

router.get('/type/:uid/:userName', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = `select User.*, (select COUNT(UserId2) from UserRelationship where UserId1 = '${req.params.uid}' and UserId2 = User.UserId and IsDeleted = 0) HasRelationship, (select COUNT(IsDeleted) from UserRelationship where UserId1 = 'O1BDrdaufPcrbKaKt4v1w8Bz0Zl1' and UserId2 = User.UserId) WasDeleted from User where Username = '${req.params.userName}'`;
    // Executing the MySQL query (select relationship type from the 'UserRelationship' table).
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

router.delete('/', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = `UPDATE UserRelationship SET IsDeleted = '1' WHERE UserId1 = '${req.body.DeleteFriend.UserId1}' AND UserId2 = '${req.body.DeleteFriend.UserId2}'`;
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        throw error;
      }
      console.log(results);
      res.json({"status": 200, "response": 'deleted'});
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

router.put('/', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = `UPDATE UserRelationship SET IsDeleted = 0 WHERE UserId1 = '${req.body.AddFriend.UserId1}' AND UserId2 = '${req.body.AddFriend.UserId2}'`;
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if(error){
        throw error;
        connection.release();
      }
      console.log(results);
      res.json({"status": 200, "response": "updated"});
    });
  });
})

module.exports = router;
