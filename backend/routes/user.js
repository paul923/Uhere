var express = require('express');
var router = express.Router();
var pool = require('../db').pool;
var mysql = require('../db').mysql;

// GET
router.get('/:userId', function (req, res) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "SELECT * FROM ?? WHERE UserId = ? and IsDeleted = false";
    var parameters = ['User', req.params.userId];
    sql = mysql.format(sql, parameters);
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        res.status(500).send({
          success: false,
          error: {
            message: "Database Error"
          }
        });
      } else if (results.length > 0) {
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
            message: "User Not Found with UserId: " + req.params.userId
          }
        })
      }
    });
  });
})

router.get('/username/:username', function (req, res) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "SELECT * FROM ?? WHERE Username = ? and IsDeleted = false";
    var parameters = ['User', req.params.username];
    sql = mysql.format(sql, parameters);
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        res.status(500).send({
          success: false,
          error: {
            message: "Database Error"
          }
        });
      } else if (results.length > 0) {
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
            message: "User Not Found with Username: " + req.params.username
          }
        })
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
      } else if (results.length > 0) {
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
                res.status(500).send({
                  success: false,
                  error: {
                    message: "Database Error"
                  }
                });
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
          res.status(200).send({
            success: true,
            body: {
              results
            }
          });
        })
      } else {
        res.status(404).send({
          success: false,
          error: {
            message: "Groups Not Found with UserId: " + req.params.userId
          }
        })
      }
    });
  });
})

router.get('/:userId/relationships', function (req, res) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = `
    SELECT User.*, UserRelationship.IsDeleted, UserRelationship.Type
    FROM ??, ??
    WHERE UserRelationship.UserId1 = ?
      and User.UserId = UserRelationship.UserId2
      and UserRelationship.IsDeleted = false
      and User.IsDeleted = false
    `;
    var parameters = ['UserRelationship', 'User', req.params.userId];
    sql = mysql.format(sql, parameters);
    connection.query(sql, function (error, results, fields) {
      if (error) {
        res.status(500).send({
          success: false,
          error: {
            message: "Database Error"
          }
        });
      } else if (results.length > 0) {
        // GET user for each relationship
        const promises = []
        results.forEach(result => {
          var sql = `SELECT *
          FROM User
          WHERE 1=1
          AND UserId = ?
          AND IsDeleted = false`;
          const promise = new Promise((resolve, reject) => {
            connection.query(sql, result.UserId, function (error, user) {
              if (error) {
                res.status(500).send({
                  success: false,
                  error: {
                    message: "Database Error2"
                  }
                });
              } else {
                result.User2 = user[0];
                resolve()
              }
            });
          })
          promises.push(promise)
        });
        Promise.all(promises).then(() => {
          connection.release();
          res.status(200).send({
            success: true,
            body: {
              results
            }
          });
        })
      } else {
        res.status(404).send({
          success: false,
          error: {
            message: "Relationship Not Found with UserId: " + req.params.userId
          }
        })
      }
    });
  });
})

router.get('/:userId/relationships/:userName', function (req, res) {
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
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        res.status(500).send({
          success: false,
          error: {
            message: "Database Error"
          }
        });
      } else if (results.length > 0) {
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
            message: "Relationship Not Found between UserId: " + req.params.userId + " and Username: " + req.params.username
          }
        })
      }
    });
  });
})

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
        if(error.code == "ER_DUP_ENTRY"){
          res.status(400).send({
            success: false,
            error: {
              message: error.sqlMessage
            }
          });
        } else {
          res.status(500).send({
            success: false,
            error: {
              message: "User Not Created"
            }
          })
        }
      } else if (results.affectedRows > 0) {
        res.status(201).send({
          success: true,
          body: {
            message: "User Created with UserId: " + user.UserId + " and Username: " + user.Username
          }
        });
      }
    });
  });
})

router.post('/:userId1/relationships/:userId2', function (req, res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "INSERT INTO ?? SET UserId1 = ?, UserId2 = ?, Type = 'Friend'";
    var parameters = ['UserRelationship', req.params.userId1, req.params.userId2];
    sql = mysql.format(sql, parameters);
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        if(error.code == "ER_DUP_ENTRY"){
          res.status(400).send({
            success: false,
            error: {
              message: error.sqlMessage
            }
          });
        } else {
          res.status(500).send({
            success: false,
            error: {
              message: "Database Error"
            }
          })
        }
      } else if (results.affectedRows > 0) {
        res.status(201).send({
          success: true,
          error: {
            message: "Relationship Created between UserId1: " + req.params.userId1 + " and UserId2: " + req.params.userId2
          }
        });
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
        res.status(500).send({
          success: false,
          error: {
            message: "Database Error"
          }
        });
      } else if (results.affectedRows > 0) {
        res.status(200).send({
          success: true,
          body: {
            message: "User Updated"
          }
        });
      } else {
        res.status(404).send({
          success: false,
          error: {
            message: "User Not Found with UserId: " + req.params.userId
          }
        });
      }
    });
  });
})

router.patch('/pushToken/:userId', function (req, res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "UPDATE ?? SET PushToken = ? where UserId = ? AND (PushToken is null OR PushToken <> ?)";
    var parameters = ['User_Justin', req.body.pushToken, req.params.userId, req.body.pushToken];
    sql = mysql.format(sql, parameters);
    console.log(sql);
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        res.status(500).send({
          success: false,
          error: {
            message: "Database Error"
          }
        });
      } else if (results.affectedRows > 0) {
        res.status(200).send({
          success: true,
          body: {
            message: "Push Token Updated"
          }
        });
      } else {
        res.status(304).send({
          success: false,
          error: {
            message: "Push Token Not Updated"
          }
        });
      }
    });
  });
})

router.patch('/:userId1/relationships/:userId2', function (req, res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "UPDATE ?? SET IsDeleted = ? WHERE UserId1 = ? AND UserId2 = ? AND IsDeleted = 1";
    var parameters = ['UserRelationship', 0, req.params.userId1, req.params.userId2];
    sql = mysql.format(sql, parameters);
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        res.status(500).send({
          success: false,
          error: {
            message: error
          }
        });
      } else if (results.affectedRows > 0) {
        res.status(200).send({
          success: true,
          body: {
            message: "Relationship Updated"
          }
        });
      } else {
        res.status(404).send({
          success: false,
          body: {
            message: "Relationship Not Found between UserId1: " + req.params.userId1 + " and UserId2: " + req.params.userId2
          }
        });
      }
    });
  });
})

router.delete('/:userId1/relationships/:userId2', function (req, res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "UPDATE ?? SET IsDeleted = ? WHERE UserId1 = ? AND UserId2 = ? AND IsDeleted = false";
    var parameters = ['UserRelationship', 1, req.params.userId1, req.params.userId2];
    sql = mysql.format(sql, parameters);
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        res.status(500).send({
          success: false,
          error: {
            message: error
          }
        });
      } else if (results.affectedRows > 0) {
        res.status(200).send({
          success: true,
          body: {
            message: "Relationship deleted"
          }
        });
      } else {
        res.status(404).send({
          success: false,
          body: {
            message: "Relationship Not Found between UserId1: " + req.params.userId1 + " and UserId2: " + req.params.userId2
          }
        });
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
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        res.status(500).send({
          success: false,
          error: {
            message: "Database Error"
          }
        });
      } else if (results.affectedRows > 0) {
        res.status(200).send({
          success: true,
          body: {
            message: "User Deleted"
          }
        });
      } else {
        res.status(404).send({
          success: false,
          body: {
            message: "User Not Found with UserId: " + req.params.userId
          }
        });
      }
    });
  });
})

module.exports = router;
