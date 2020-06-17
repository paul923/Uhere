var express = require('express');
var router = express.Router();
var pool = require('../db').pool;
var mysql = require('../db').mysql;

// '/groups'
// POST
// Create new group
router.post('/groups', function (req,res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    console.log("Connected!");
    var groupSql = "INSERT INTO UserGroup SET ?";
    var data = req.body.group
    connection.query(groupSql, data, function (error, results, fields) {
      if (error) {
        connection.release();
        res.status(500).send(error)
      }
      // GroupMember query is invoked if UserGroup.GroupId is created
      if (results.insertId) {
        const members = req.body.members.map(member=> [results.insertId, member.UserId, 0]);
        var groupMemberSql = "INSERT INTO GroupMember VALUES ?"
        connection.query(groupMemberSql, [members], function (error, results, fields) {
          connection.release();
          if(error){
            res.status(500).send(error)
          }
          res.status(201).send();
        })
      } else {
        res.status(400).send();
      }
    });
  });
})

// Path: '/groups/:groupId'
// GET
// Get Group by Id
router.get('/groups/:groupId', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = 
    `SELECT UserGroup.GroupId, UserGroup.UserId, GroupName, MemberId, Username, Nickname, AvatarURI, AvatarColor, RegisteredDate, GroupMember.IsDeleted 
    FROM UserGroup 
      join GroupMember 
        on UserGroup.GroupId = GroupMember.GroupId 
      join User 
        on GroupMember.MemberId = User.UserId 
    WHERE 1=1
      AND UserGroup.GroupId = ${req.params.groupId} 
      AND GroupMember.IsDeleted = 0 
      AND UserGroup.IsDeleted = 0`;
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        res.status(500).send(error);
      }
      if (results.length > 0) {
        res.status(200).send(results);
      } else {
        res.status(404).send();
      }
    });
  });
})

// PATCH
// Update Group Information by groupId(GroupName, GroupMembers)
router.patch('/groups/:groupId', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql =`UPDATE UserGroup 
    SET UserGroup.GroupName = ? 
    WHERE 1=1
    AND UserGroup.GroupId = ${req.params.groupId}`;
    var data = req.body.group.GroupName;
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

// DELETE
// Delete Group by Id
router.delete('/groups/:groupId', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    console.log("Connected!");
    var sql = `update UserGroup 
    SET IsDeleted = 1 
    WHERE 1=1 
    AND GroupId = ${req.params.groupId}`;
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql, function (error, results, fields) {
      if (error) {
        throw error;
        connection.release();
      }
      if (results.affectedRows > 0) {
        connection.release();
        res.status(204).send();
      } else {
        res.status(404).send();
      }
    });
  });
})



router.put('/groups/member/:groupId', function(req, res, next) {
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

router.delete('/groups/member/:groupId', function(req, res, next) {
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

module.exports = router;