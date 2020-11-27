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

router.get('/types/:userId/:userName', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = `
    SELECT User.*, 
      (SELECT COUNT(UserId2) 
      FROM UserRelationship 
      WHERE UserId1 = '${req.params.userId}' 
        AND UserId2 = User.UserId 
        AND IsDeleted = 0) HasRelationship,
      (SELECT COUNT(IsDeleted) 
      FROM UserRelationship 
      WHERE UserId1 = '${req.params.userId}' 
        AND UserId2 = User.UserId) HadRelationship 
    FROM User 
    WHERE Username = '${req.params.userName}'
    `;
    // Executing the MySQL query (select relationship type from the 'UserRelationship' table).
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        res.status(500).send({
          success: false,
          error: {
            message: "Database Error"
          }
        });
      }
      if (results.length > 0) {
        res.status(200).send({
          success: true,
          body: {
            results
          }
        });
      } else {
        res.status(404).send({
          success: false,
          error: {
            message: "User Not Found with Username: " + req.params.userName
          }
        })
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
