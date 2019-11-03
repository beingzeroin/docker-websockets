module.exports = function(io){

    io.on('connection', function(socket){
        console.log('NEW CLIENT CONNECTED ');

        socket.on('draw', function(message) {
            console.log('Broadcasting draw message');
            io.emit('draw', message);
        });
          
        socket.on('clear', function(message) {
            console.log('Broadcasting clear message');
            io.emit('clear', message);
        });
    });
}