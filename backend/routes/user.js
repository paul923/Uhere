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
router.get('/:userId/group', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "SELECT UserGroup.GroupId, UserGroup.UserId, MemberId, GroupName, User.Nickname, User.Username FROM uhere.UserGroup join GroupMember on UserGroup.GroupId = GroupMember.GroupId join User on GroupMember.MemberId = User.UserId WHERE UserGroup.UserId = ? AND UserGroup.IsDeleted = 0 AND GroupMember.IsDeleted = 0";
    var user = req.params.userId;
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql,user, function (error, results, fields) {
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
router.put('/group/name', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "UPDATE UserGroup SET UserGroup.GroupName = ? WHERE UserGroup.GroupId = ?";
    var data = [req.body.group.GroupName, req.body.group.GroupId];
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql,data, function (error, results, fields) {
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
router.get('/:userId/group/:groupId', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = `SELECT UserGroup.GroupId, UserGroup.UserId, GroupName, MemberId, Username, Nickname, AvatarURI, AvatarColor, RegisteredDate, GroupMember.IsDeleted FROM UserGroup join GroupMember on UserGroup.GroupId = GroupMember.GroupId join User on GroupMember.MemberId = User.UserId WHERE UserGroup.UserId = '${req.params.userId}' AND UserGroup.GroupId = ${req.params.groupId} AND GroupMember.IsDeleted = 0 AND UserGroup.IsDeleted = 0`;
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
router.post('/group', function (req,res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    console.log("Connected!");
    var groupSql = "INSERT INTO UserGroup SET ?";
    var data = req.body.group
    connection.query(groupSql, data, function (error, results, fields) {
      if (error) {
        throw error;
        connection.release();
      }
      if (results.insertId) {
        const members = req.body.members.map(member=> [results.insertId, member.UserId, 0]);
        var groupMemberSql = "INSERT INTO GroupMember VALUES ?"
        connection.query(groupMemberSql, [members], function (error, results, fields) {
          if(error){
            throw error;
            connection.release();
          }
          connection.release();
          console.log(results);
          res.json({"status": 200, "response": "Registered"});
        })
      }
    });
  });
})

router.put('/group/member/:groupId', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    console.log("Connected!");
    var sql = `select * from GroupMember where groupId = ${req.params.groupId}`;
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql, function (error, results, fields) {
      if (error) {
        throw error;
      }
      if (results.length > 0) {
        //results = [{GroupId, MemberId, IsDeleted}]
        req.body.newMembers.forEach(newMember => {
          var index = results.indexOf(groupMember => groupMember.MemberId === newMember)
          if (index > -1){
            if (results[index].IsDeleted) {
              //IsDeleted Case SQL add back to group member (change isDeleted to 0)
              var updateSql = `UPDATE GroupMember SET IsDeleted = 0 WHERE MemberId = '${newMember.UserId}'`;
              connection.query(updateSql, function(error,results, fields) {
                if(error) {
                  throw error;
                }
                console.log(results);
                res.json({"status": 200, "response": "inserted"});
              })
            }
          } else {
            //brand new Member
            var insertSql = `INSERT INTO GroupMember SET ?`;
            let memberData = {
              GroupId: req.params.groupId,
              MemberId: newMember.UserId,
              IsDeleted: 0
            }
            connection.query(insertSql, memberData, function(error,results, fields) {
              if(error) {
                throw error;
              }
              console.log(results);
              res.json({"status": 200, "response": "inserted"});
            })
          }
          connection.release();
        })
        res.json({"status": 200, "response": results});
      } else {
      }
    });
  });
})

router.delete('/group/member/:groupId', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    console.log("Connected!");
    var sql = `update GroupMember SET IsDeleted = 1 where GroupId = ${req.params.groupId} AND MemberId = ?`;
    let members = req.body.deleteMembers.map((m) => [m.UserId])
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql, [members], function (error, results, fields) {
      if (error) {
        throw error;
        connection.release();
      }
      if (results.affectedRows > 0) {
        connection.release();
        res.json({"status": 200, "response": "deleted"});
      }
    });
  });
})

router.delete('/:userId/group/:groupId', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    console.log("Connected!");
    var sql = `update UserGroup SET IsDeleted = 1 where GroupId = ${req.params.groupId} AND UserId = '${req.params.userId}'`;
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql, function (error, results, fields) {
      if (error) {
        throw error;
        connection.release();
      }
      if (results.affectedRows > 0) {
        connection.release();
        res.json({"status": 200, "response": "deleted"});
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



module.exports = router;
