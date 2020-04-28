import { backend } from 'constants/Environment';
var socket = require('socket.io-client')(`http://${backend}:3000`, { forceNode: true });
export default socket;
