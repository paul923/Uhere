const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const dotenv = require('dotenv');
dotenv.config();
const pool = mysql.createPool({
  connectionLimit : 5,
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_SCHEMA,
  ssl: "Amazon RDS"
});
// Starting our app.
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function formatEventList(list) {
  console.log(list);
}

// Creating a GET route that returns data from the 'users' table.
app.get('/event/pending', function (req, res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    var sql = "SELECT * FROM ?? WHERE STATUS = ?";
    var parameters = ['Event', 'PENDING'];
    sql = mysql.format(sql, parameters);
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql, function (error, results, fields) {
      connection.release();
      // If some error occurs, we throw an error.
      if (error) throw error;
      // Getting the 'response' from the database and sending it to our route. This is were the data is.
      res.send(results)
    });
  });
});

// Creating a GET route that returns data from the 'users' table.
app.get('/event/on-going', function (req, res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    var sql = "SELECT * FROM ?? WHERE STATUS = ?";
    var parameters = ['Event', 'ONGOING'];
    sql = mysql.format(sql, parameters);
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql, function (error, results, fields) {
      connection.release();
      // If some error occurs, we throw an error.
      if (error) throw error;

      // Getting the 'response' from the database and sending it to our route. This is were the data is.
      res.send(results)
    });
  });
});

app.post('/event/insert', function (req,res) {
  // Connecting to the database.
  pool.getConnection(function (err, connection) {
    var event = {
      ...req.body,
      DateTime: new Date(req.body.DateTime)
    }
    var sql = "INSERT INTO ?? SET ?";
    var parameters = ['Event'];
    sql = mysql.format(sql, parameters);
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(sql, event, function (error, results, fields) {
      connection.release();
      // If some error occurs, we throw an error.
      if (error) throw error;

      // Getting the 'response' from the database and sending it to our route. This is were the data is.
      res.send(results)
    });
  });
})


// Starting our server.
app.listen(3000, () => {
 console.log('Listening on Port 3000');
});
