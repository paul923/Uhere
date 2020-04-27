const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const dotenv = require('dotenv');

const eventRouter = require('./routes/event');
const userRouter = require('./routes/user');
const relationshipRouter = require('./routes/relationship');
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
  // Join Handler
  socket.on('join', ({event}) => {
    socket.join(event);
    console.log("Someone Joined Event - Requesting location updates");
    io.in(event).emit('requestPosition');
  })
  socket.on('leave', ({event}) => {
    socket.leave(event);
  })

  // Update Position
  socket.on('position', ({user, position, event}) => {
    console.log('Update position of user in event with values: ');
    console.log(`Event: ${event}`);
    console.log(`User: ${user}`);
    console.log(`Position: ${position}`);
    if (!socket.currentPosition){
      socket.currentPosition = {};
    }
    socket.currentPosition.user = position;
    socket.broadcast.to(event).emit('updatePosition', {
      user,
      position
    });
  })

  socket.on('disconnect', () => {
    console.log(`Connection ${socket.id} has left the building`)
  })

});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/event', eventRouter);
app.use('/user', userRouter);
app.use('/relationship', relationshipRouter);



// Starting our server.
server.listen(3000, () => {
 console.log('Listening on Port 3000');
});
