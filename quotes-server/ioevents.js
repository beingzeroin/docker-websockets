module.exports = function(io){

    var listOfQuotes = require('./quotes-data/quotes.js');

    io.on('connection', function(socket){
        console.log('NEW CLIENT CONNECTED ');

        socket.emit('message-from-server', { greetings: 'Hello from Server'})
        socket.on('message-from-client', function(msg){
            console.log('Client Sent this message: '+ JSON.stringify(msg));
        })
    });

    function getRandomArbitrary(min, max) {
        var min = Math.ceil(min);
        var max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function sendNextQuote(){
        var quoteRandomIdx = getRandomArbitrary(0, listOfQuotes.length);
        console.log("INDEX "+ quoteRandomIdx);
        console.log('Sending Next Quote: ' + JSON.stringify(listOfQuotes[quoteRandomIdx]));
        io.emit('next-quote', listOfQuotes[quoteRandomIdx]);
    }

    setInterval(sendNextQuote, 3000);
}