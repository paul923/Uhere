var express = require('express');
const { reject } = require('lodash');
var router = express.Router();
var pool = require('../db').pool;
var mysql = require('../db').mysql;

// '/groups'
// POST
// Create new group
router.post('/', function (req,res) {
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
      else if(req.body.members.length > 0){
        // GroupMember query is invoked if UserGroup.GroupId is created
        if (results.insertId) {
          const members = req.body.members.map(member=> [results.insertId, member.UserId, 0]);
          var groupMemberSql = "INSERT INTO GroupMember VALUES ?"
          connection.query(groupMemberSql, [members], function (error, results, fields) {
            connection.release();
            if(error){
              res.status(500).send(error)
            }
            res.status(201).send(results);
          })
        } else {
          res.status(400).send();
        }
      } else {
        res.status(201).send(results);
      }
    });
  });
})

// Path: '/groups/:groupId'
// GET
// Get Group by Id
router.get('/:groupId', function(req, res, next) {
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
      AND UserGroup.IsDeleted = 0
    `;
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql, function (error, results, fields) {
      connection.release();
      if (error) {
        res.status(500).send(error);
      } else if (results.length > 0) {
        res.status(200).send(results);
      } else {
        res.status(404).send();
      }
    });
  });
})

// PATCH
// Update Group Information by groupId(GroupName, GroupMembers)
router.patch('/:groupId', function(req, res, next) {
  var groupId = req.params.groupId;
  var groupName = req.body.groupName;
  var groupMemberArr = req.body.groupMembers;
  
  pool.getConnection(function(error, connection){
    connection.beginTransaction(function (err) {
      if (err){
        res.status(500).send(err);
      }
      // Update Group Name
      var groupNameSql = `
        UPDATE UserGroup
        SET GroupName = '${groupName}'
        WHERE 1 = 1
          AND GroupId = ${groupId}
      ;`;
      connection.query(groupNameSql, function(error, results, fields){
        if(error){
          return conneciton.rollback(function() {
            res.status(500).send(error);
          })
        } else if(results.affectedRows > 0){
          // Switch all member's IsDeleted to 1 within that groupId
          var isDeletedSql = `
            UPDATE GroupMember
            SET IsDeleted = 1
            WHERE 1 = 1
              AND GroupId = ${groupId}
          ;`;
          connection.query(isDeletedSql, function(error, results, fields) {
            if(error){
              return connection.rollback(function(){
                res.status(500).send(error);
              })
            } else if(results.affectedRows > 0) {
              const promises = [];
              groupMemberArr.forEach(member => {
                // Returns user object if member exist in GroupMembers
                var doesExistSql = `
                SELECT *
                FROM GroupMember
                WHERE 1 = 1
                  AND GroupId = ${groupId}
                  AND MemberId = '${member.UserId}'
                ;`;
                const promise = new Promise((resolve, reject) => {
                  connection.query(doesExistSql, function (error, results, fields) {
                    if (error) {
                      return connection.rollback(function () {
                        reject();
                        // res.status(500).send(error);
                      })
                    } else if (results.length > 0) {
                      var userId = results[0].MemberId;
                      // Updating User's IsDeleted to 0
                      var restoreUserSql = `
                      UPDATE GroupMember
                      SET IsDeleted = 0
                      WHERE 1 = 1
                        AND GroupId = ${groupId}
                        AND MemberId = '${userId}'
                    ;`;
                      connection.query(restoreUserSql, function (error, results, fields) {
                        if (error) {
                          return connection.rollback(function () {
                            reject();
                            // res.status(500).send(error);
                          })
                        } else if (results.affectedRows > 0) {
                          resolve();
                          // res.status(200).send(results);
                        } else {
                          reject();
                          // res.status(404).send();
                        }
                      })
                    } else {
                      // Inserting new row to GroupMember
                      var newRowSql = `
                      INSERT INTO GroupMember(GroupId, MemberId, IsDeleted)
                      VALUES(${groupId}, '${member.UserId}', 0)
                    `;
                      connection.query(newRowSql, function (error, results, fields) {
                        if (error) {
                          return connection.rollback(function () {
                            reject();
                            // res.status(500).send(error);
                          })
                        } else if (results.affectedRows) {
                          resolve();
                          // res.status(200).send(results);
                        } else {
                          return connection.rollback(function () {
                            reject();
                            // res.status(404).send(error);
                          })
                        }
                      })
                    }
                  })
                })
                promises.push(promise)
              })
              Promise.all(promises).then(results => {
                //Commit
                connection.commit(function (err) {
                  if (err) {
                    return connection.rollback(function () {
                      res.status(500).send(error);
                    });
                  }
                  res.status(200).send();
                });
              }).catch(err => {
                console.log("Error occurred: ", err);
              })
              
            } else {
              //No member exists in the table
              // Inserting new row to GroupMember
              const promises = [];
              groupMemberArr.forEach(member => {
                var newRowSql = `
                  INSERT INTO GroupMember(GroupId, MemberId, IsDeleted)
                  VALUES(${groupId}, '${member.UserId}', 0)
                `;
                const promise = new Promise((resolve, reject) => {
                  connection.query(newRowSql, function(error, results, fields){
                    if(error){
                      return connection.rollback(function(){
                        // res.status(500).send(error);
                        reject();
                      })
                    } else if(results.affectedRows){
                      resolve();
                      // res.status(200).send(results);
                    } else {
                      return connection.rollback(function(){
                        reject();
                        // res.status(404).send(error);
                      })
                    }
                  })
                })
                promises.push(promise)
              })
              Promise.all(promises).then(results => {
                //Commit
                connection.commit(function (err) {
                  if (err) {
                    return connection.rollback(function () {
                      res.status(500).send(error);
                    });
                  }
                  res.status(200).send();
                });
              }).catch(err => {
                console.log("Error occurred: ", err);
              })
            }
          })
        } else {
          return conneciton.rollback(function() {
            res.status(404).send(error);
          })
        }
      })
    })
  })
})


// DELETE
// Delete Group by Id
router.delete('/:groupId', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    console.log("Connected!");
    var sql = `update UserGroup 
    SET IsDeleted = 1 
    WHERE 1=1 
    AND IsDeleted = 0
    AND GroupId = ${req.params.groupId}
    `;
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql, function (error, results, fields) {
      if (error) {
        connection.release();
        res.status(500).send();
      } else if (results.affectedRows > 0) {
        connection.release();
        res.status(204).send();
      } else {
        res.status(404).send();
      }
    });
  });
})



module.exports = router;