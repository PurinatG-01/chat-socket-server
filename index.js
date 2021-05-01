const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/index.html');
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

io.on('connection', (socket) => {
    
    var userName;

    // set data from client
    if(socket.handshake.query) userName  = socket.handshake.query.userName; 
    if(!userName) userName = 'anonymous'

    console.log(`${userName} joined`)
    io.emit("chat-message", `${userName} joined`)

    // Disconnect Handler
    socket.on('disconnect', () => {
        io.emit("chat-message", `${userName} disconnected`)
    });

    // Chat handler
    socket.on('chat-message', (data) => {
        console.log(`${data.user.name} : ${data.msg}`);
        io.emit('chat-message', `${data.user.name} : ${data.msg}`)
    });
});