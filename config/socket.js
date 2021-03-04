const express = require('express');
const socketio = require('socket.io');



exports.setSocket = (...server) => {

    const io = socketio(server);

    // io.on('connection', (socket) => {
       

    // })
    
}