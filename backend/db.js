const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  connectionLimit : 5,
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_SCHEMA,
  ssl: "Amazon RDS",
  timezone: 'utc'
});
exports.pool = pool
exports.mysql = mysql
