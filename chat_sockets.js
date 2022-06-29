//observer which recievs the incomming connections

module.exports.chatSockets = function(socketserver){
    let io = require('socket.io')(socketserver);

    io.sockets.on('connection', function(socket){
        console.log('new connection recieved', socket.id)

        socket.on('disconnect', function(){
            console.log('socket disconnected')
        });

        socket.on('join_room', function(data){
            console.log('joining request received', data)
            socket.join(data.chatroom);
            io.in(data.chatroom).emit('user_joined', data)
        })

        socket.on('send_message', function(data){
            io.in(data.chatroom).emit('receive_message', data);
        });
    });

}