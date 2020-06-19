const express = require('express');
const bodyParser = require('body-parser');
var pool = require('./db').pool;
var mysql = require('./db').mysql;
var CronJob = require('cron').CronJob;
const dotenv = require('dotenv');

const eventRouter = require('./routes/event');
const userRouter = require('./routes/user');
const relationshipRouter = require('./routes/relationship');
dotenv.config();




// Starting our app.
const app = express();
const server = require('http').Server(app);

const io = require('socket.io')(server);
app.set('io', io);

pool.getConnection(function (err, connection) {
  if (err) throw err; // not connected!
  var sql = "SELECT * FROM EventJob where IsProcessed = false and IsDeleted = false";
  // Executing the MySQL query (select all data from the 'users' table).
  connection.query(sql, function (error, results, fields) {
    connection.release();
    if (error) {
      throw error;
    }
    results.forEach(function(event){
      console.log(event);
      var thirtyMinutesBeforeEvent = new Date(event.DateTime.setMinutes(event.DateTime.getMinutes() - 30));
      var jobDate = thirtyMinutesBeforeEvent > new Date() ? thirtyMinutesBeforeEvent : new Date();
      console.log(new Date());
      console.log(jobDate);
      var job = new CronJob(
        jobDate,
        function() {
          console.log("test");
          console.log(`Cron Job For ${event.EventId} Started`);
          var sql = `select UserId FROM EventUser where EventID = '${event.EventId}'`
          pool.getConnection(function (err, connection) {
            connection.query(sql, function (error, userResults, fields) {
              if (error) {
                throw error;
                connection.release();
              }
              io.in('lobby').clients(function(error, clients) {
                clients.forEach(function(socketId){
                  const socket = io.sockets.connected[socketId];
                  if (socket.events){
                    socket.events.push(event.EventId)
                  } else {
                    socket.events = [event.EventId]
                  }
                  if (userResults.some(user => {
                    return user.UserId === socket.userId
                  })){
                    console.log(`${socket.userId} Joined Room ${event.EventId}`)
                    socket.join(eventId);
                  }
                })
              })
              eventJobSql = "UPDATE ?? SET IsProcessed = 1 WHERE EventId = ?";
              parameters = ['EventJob', event.EventId]
              eventJobSql = mysql.format(eventJobSql, parameters);
              connection.query(eventJobSql, function (error, eventJobResult, fields) {
                connection.release();
                if (error) {
                  throw error;
                }
              })
            });
          })
        },
        null,
        true,
        null
      );
    })
  });
});

io.on('connection', (socket) => {
  // Join Lobby
  socket.on('joinLobby', ({userId}) => {
    socket.join('lobby');
    socket.userId = userId
    console.log(`User ${userId} Joined Lobby`);
    // Connecting to the database.
    pool.getConnection(function (err, connection) {
      if (err) throw err; // not connected!
      var sql = `SELECT EventId
      FROM Event
      WHERE 1=1
      AND NOW() Between DATE_SUB(Event.DateTime, INTERVAL 5000 MINUTE) AND Event.DateTime
      AND EventID IN (
      	SELECT EventUser.EventID FROM EventUser
          where EventUser.UserId = '${userId}'
      );`
      connection.query(sql, function (error, results, fields) {
        connection.release();
        // If some error occurs, we throw an error.
        if (error) throw error;
        // Getting the 'response' from the database and sending it to our route. This is were the data is.
        socket.events = results.map(event => event.EventId);
        results.forEach(result => {
          console.log(`${userId} Joined Room ${result.EventId}`)
          socket.join(result.EventId);
        })
      });
    });

  })

  socket.on('requestPosition', ({event}) => {
    io.in(event).emit('requestPosition');
  })

  socket.on('leave', ({event}) => {
    socket.leave(event);
  })

  // Update Position
  socket.on('position', ({user, position}) => {
    if (!socket.currentPosition){
      socket.currentPosition = {};
    }
    socket.currentPosition.user = position;
    if (socket.events){
      socket.events.forEach((event) => {
        console.log('Update position of user in event with values: ');
        console.log(`Event: ${event}`);
        console.log(`User: ${user}`);
        console.log(`Position: ${position}`);
        io.in(event).emit('updatePosition', {
          user,
          position
        });
      })
    }
  })

  socket.on('disconnect', () => {
    console.log(`Connection ${socket.id} has left the building`)
  })

});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/events', eventRouter);
app.use('/users', userRouter);
app.use('/relationship', relationshipRouter);



// Starting our server.
server.listen(3000, () => {
 console.log('Listening on Port 3000');
});

module.exports = server;
