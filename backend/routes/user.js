var express = require('express');
var router = express.Router();
var pool = require('../db').pool;
var mysql = require('../db').mysql;

// GET
router.get('/:userId', function(req, res) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "SELECT * FROM ?? WHERE UserId = ? and IsDeleted = false";
    var parameters = ['User', req.params.userId];
    sql = mysql.format(sql, parameters);
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        res.status(500).send(error);
      }
      else if (results.length > 0) {
        res.status(200).send(results);
      } else {
        res.status(404).send()
      }
    });
  });
})

router.get('/username/:username', function(req, res) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "SELECT * FROM ?? WHERE Username = ? and IsDeleted = false";
    var parameters = ['User', req.params.username];
    sql = mysql.format(sql, parameters);
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        res.status(500).send(error);
      }
      else if (results.length > 0) {
        res.status(200).send(results);
      } else {
        res.status(404).send()
      }
    });
  });
})

router.get('/:userId/groups', function (req, res) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = 'SELECT * FROM uhere.UserGroup where UserId = ? and IsDeleted = false';
    var user = req.params.userId;
    connection.query(sql, user, function (error, results, fields) {
      if (error) {
        res.status(500).send(error);
      }
      else if (results.length > 0) {
        // GET members for each group
        const promises = []
        results.forEach(result => {
          var sql = `SELECT User.*
          FROM uhere.GroupMember 
          left join uhere.User on GroupMember.MemberId = User.UserId
          WHERE 1=1
          AND GroupMember.GroupId = ?
          AND GroupMember.IsDeleted = false
          AND User.IsDeleted = false`;
          const promise = new Promise((resolve, reject) => {
            connection.query(sql, result.GroupId, function (error, results, fields) {
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
          res.status(200).send(results);
        })
      } else {
        res.status(404).send()
      }
    });
  });
})

router.get('/:userId/relationships', function (req, res) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "SELECT * FROM ?? WHERE UserId1 = ? and IsDeleted = false";
    var parameters = ['UserRelationship', req.params.userId];
    sql = mysql.format(sql, parameters);
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        res.status(500).send(error);
      }
      else if (results.length > 0) {
        res.status(200).send(results);
      } else {
        res.status(404).send()
      }
    });
  });
})

router.get('/:userId/relationships/:username', function (req, res) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = `SELECT UserRelationship.* 
    FROM UserRelationship
    left join User on UserRelationship.UserId2 = User.UserId
    WHERE 1=1
    AND Userid1 = ?
    AND Username = ?
    AND UserRelationship.IsDeleted = false
    AND User.IsDeleted = false`;
    var parameters = [req.params.userId, req.params.username];
    sql = mysql.format(sql, parameters);
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        res.status(500).send(error);
      }
      else if (results.length > 0) {
        res.status(200).send(results);
      } else {
        res.status(404).send()
      }
    });
  });
})

// TODO: handle error on creating record with existing primary key
// POST
router.post('/', function (req, res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var user = req.body;
    var sql = "INSERT INTO ?? SET ?";
    var parameters = ['User'];
    sql = mysql.format(sql, parameters);
    connection.query(sql, user, function (error, results, fields) {
      connection.release();
      if (error) {
        res.status(500).send(error);
      }
      else if (results.affectedRows > 0) {
        res.status(201).send();
      }
    });
  });
})

router.post('/:userId/relationships', function (req, res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var userRelationship = req.body;
    var sql = "INSERT INTO ?? SET ?";
    var parameters = ['UserRelationship'];
    sql = mysql.format(sql, parameters);
    connection.query(sql, userRelationship, function (error, results, fields) {
      connection.release();
      if (error) {
        res.status(500).send(error);
      }
      else if (results.affectedRows > 0) {
        res.status(201).send();
      }
    });
  });
})

// PATCH
router.patch('/:userId', function (req, res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "UPDATE ?? SET ? WHERE UserId = ?";
    var parameters = ['User', req.body, req.params.userId];
    sql = mysql.format(sql, parameters);
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        res.status(500).send(error);
      }
      else if (results.affectedRows > 0) {
        res.status(200).send();
      } else {
        res.status(404).send();
      }
    });
  });
})

// DELETE
router.delete('/:userId', function (req, res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "UPDATE ?? SET isDeleted = ? WHERE UserId = ?";
    var parameters = ['User', true, req.params.userId];
    sql = mysql.format(sql, parameters);
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        res.status(500).send(error);
      }
      else if (results.affectedRows > 0) {
        // TODO: 200 or 204?
        res.status(204).send();
      } else {
        res.status(404).send();
      }
    });
  });
})

module.exports = router;
