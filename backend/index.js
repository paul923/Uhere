const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const dotenv = require('dotenv');

const eventRouter = require('./routes/event');
const userRouter = require('./routes/user');
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
const server = require('http').Server(app);

const io = require('socket.io')(server);
io.on('connection', (socket) => {
  io.clients((error, clients) => {
    if (error) throw error;
    console.log(clients); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
  });

  socket.on('position', (position) => {
    console.log('position with id -----------------\n', position)
    socket.emit('otherPositions', position);
  })

  socket.on('disconnect', () => {
    console.log(`Connection ${socket.id} has left the building`)
  })

});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/event', eventRouter);
app.use('/user', userRouter);



// Starting our server.
server.listen(3000, () => {
 console.log('Listening on Port 3000');
});
