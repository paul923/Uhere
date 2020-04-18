var express = require('express');
var router = express.Router();
var pool = require('../db').pool;
var mysql = require('../db').mysql;

router.post('/register', function (req,res) {
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
