const fetch = require('node-fetch');
var pool = require('./db').pool;
var mysql = require('./db').mysql;

module.exports.sendPushNotification = function(message) {
  return fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
  .then(res => res.json())
  .then(json => json);
}


module.exports.sendInvitePushNotification = function(users, eventId) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "SELECT * FROM ?? WHERE UserId IN (?) ";
    var parameters = ['User_Justin'];
    sql = mysql.format(sql, parameters);
    connection.query(sql, [users], function (error, results, fields) {
      connection.release();
      if (results.length > 0) {
        results.forEach(user => {
          const message = {
            to: user.PushToken,
            sound: 'default',
            title: 'Event Invite',
            body: 'You are invited to Event ',
            data: { eventId },
          };
          console.log(message);

          fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Accept-encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
          })
        })
      }
    });
  });

}

module.exports.sendBeforePushNotification = function(users, eventId) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "SELECT * FROM ?? WHERE UserId IN (?) ";
    var parameters = ['User_Justin'];
    sql = mysql.format(sql, parameters);
    connection.query(sql, [users], function (error, results, fields) {
      connection.release();
      if (results.length > 0) {
        results.forEach(user => {
          const message = {
            to: user.PushToken,
            sound: 'default',
            title: 'Event Start',
            body: 'Event ' + eventId + ' will start soon!',
            data: { eventId },
          };
          fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Accept-encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
          })
        })
      }
    });
  });

}

module.exports.sendStartPushNotification = function(users, eventId) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "SELECT * FROM ?? WHERE UserId IN (?) ";
    var parameters = ['User_Justin'];
    sql = mysql.format(sql, parameters);
    connection.query(sql, [users], function (error, results, fields) {
      connection.release();
      if (results.length > 0) {
        results.forEach(user => {
          const message = {
            to: user.PushToken,
            sound: 'default',
            title: 'Event Start',
            body: 'Event ' + eventId + ' is started!',
            data: { eventId },
          };
          console.log(message);

          fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Accept-encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
          })
        })
      }
    });
  });

}
module.exports.sendResultPushNotification = function(users, eventId) {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    var sql = "SELECT * FROM ?? WHERE UserId IN (?) ";
    var parameters = ['User_Justin'];
    sql = mysql.format(sql, parameters);
    connection.query(sql, [users], function (error, results, fields) {
      connection.release();
      if (results.length > 0) {
        results.forEach(user => {
          const message = {
            to: user.PushToken,
            sound: 'default',
            title: 'Event Result',
            body: 'Event ' + eventId + ' is finished!',
            data: { eventId },
          };
          console.log(message);

          fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Accept-encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
          })
        })
      }
    });
  });

}
