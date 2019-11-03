module.exports = function(io){

    io.on('connection', function(socket){
        console.log('NEW CLIENT CONNECTED ');

        socket.emit('message-from-server', { greetings: 'Hello from Server'})
        socket.emit('log-out', { kickout: 'Log out in 5 mins'})
        socket.on('message-from-client', function(msg){
            console.log('Client Sent this message: '+ JSON.stringify(msg));
        })
    });
}