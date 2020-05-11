import { backend } from 'constants/Environment';
var socket = require('socket.io-client')(`http://${backend}:3000`, { autoConnect: false, reconnectionDelay: 1000, reconnection: true, forceNode: true });
export default socket;
