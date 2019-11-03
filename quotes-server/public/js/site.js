$("document").ready(function() {

    console.log("JQUERY WORKING - DOM IS READY");

    var webSocketServerURL = document.location.origin;

    console.log('CONNECTING TO THE SERVER');
    var clientSocket = io(webSocketServerURL);

    clientSocket.on('next-quote', function(msg){
        console.log("SERVER SENT: " + JSON.stringify(msg));
        $("#idLblQuoteText").text(msg.quoteText);
        $("#idLblQuoteAuthor").text(msg.quoteAuthor);
    })
    
    clientSocket.emit('message-from-client', {message: 'Thanks for welcome'});
});