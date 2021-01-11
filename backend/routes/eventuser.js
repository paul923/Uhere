var express = require('express');
var router = express.Router();
var pool = require('../db').pool;
var mysql = require('../db').mysql;

router.patch('/:eventId/:userId', function (req, res) {
    // Connecting to the database.
    pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).send({
                success: false,
                error: {
                    message: "Database Error"
                }
            })
        }
        var sql = "UPDATE ?? SET ArrivedTime = ? WHERE UserId = ? AND EventId = ? AND IsDeleted = false";
        var parameters = ['EventUser', req.body.ArrivedTime , req.params.userId, req.params.eventId];
        sql = mysql.format(sql, parameters);
        console.log(sql);
        // Executing the MySQL query (select all data from the 'users' table).
        connection.query(sql, function (error, results, fields) {
            connection.release();
            if (error) {
                res.status(500).send({
                    success: false,
                    error: {
                        message: "Database Error"
                    }
                })
            }
            if (results.affectedRows > 0) {
                res.status(200).send({
                    success: true,
                    body: {
                        message: "Arrived Time Updated"
                    }
                })
            } else {
                res.status(404).send({
                    success: false,
                    error: {
                        message: "Not Found"
                    }
                })
            }
        });
    });
})
module.exports = router;