module.exports = function(io){

    
    io.on('connection', function(socket){
        console.log('NEW CLIENT CONNECTED ');
        
        socket.on('chat message', function(msg){
            io.emit('chat message', msg);
        });

    });
}