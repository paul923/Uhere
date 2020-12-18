const fetch = require('node-fetch');

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
