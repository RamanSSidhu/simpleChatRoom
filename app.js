/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug')('chatroomserver:server');
var http = require('http');
var socket =  require('socket.io');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

/**
 * Globals
 */
let usersMap = new Map();
let colorsMap = new Map();
let numUsers = 0;
let messageList = new Array();

function getColor(number) {
    switch (number % 10) {
        case 0:
            return "maroon";
        case 1:
            return "blue";
        case 2:
            return "green";
        case 3:
            return "purple";
        case 4:
            return "navy";
        case 5:
            return "lime";
        case 6:
            return "black";
        case 7:
            return "teal";
        case 8:
            return "pink";
        case 9:
            return "indigo";
    }
}

/**
 * Socket Setup
 */
// Socket Setup
var io = socket(server);

/**
 * Socket Handling
 */
io.on('connection', (socket) => {
    console.log(`New Connection: ${socket.id}`);
    let userColor = getColor(numUsers);
    let userObject = {
        username: `User${++numUsers}`,
        color: userColor
    };
    colorsMap.set(userObject.username, userObject.color);
    usersMap.set(socket.id, userObject);
    socket.emit('setUser', userObject);

    if (messageList.length != 0) {
        socket.emit(`addMessages`, messageList);
    }

    socket.on('disconnect', (socket) => {
        console.log(`Disconnected.`);
        usersMap.delete(socket.id);
    });

    // Receive Single Message and Broadcast
    socket.on('newMessage', (message) => {
        console.log(`New Message Received: ${message}`);
        let date = new Date();
        let messageObject = {
            username: message.username,
            messageContent: message.messageContent,
            timestamp: date.toLocaleString(),
            color: colorsMap.get(message.username)
        };

        console.log(`Sending Message: 
        Message Content: ${messageObject.messageContent} 
        User: ${messageObject.username}
        TimeStamp: ${messageObject.timestamp}
        Color: ${messageObject.color}`);
        messageList.push(messageObject);
        io.sockets.emit(`addMessages`, [messageObject])
    });
});

