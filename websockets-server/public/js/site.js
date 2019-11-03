$("document").ready(function() {

    console.log("JQUERY WORKING - DOM IS READY");

    var webSocketServerURL = 'http://localhost:3000';

    console.log('CONNECTING TO THE SERVER');
    var clientSocket = io(webSocketServerURL);

    clientSocket.on('message-from-server', function(msg){
        console.log("SERVER SENT: " + JSON.stringify(msg));
        $("#idLblServerMsg").text(msg.greetings);
    })

    clientSocket.on('log-out', function(msg){
        console.log("SERVER SENT: " + JSON.stringify(msg));
        $("#idLblServerMsg").text(msg.kickout);
    })
    
    clientSocket.emit('message-from-client', {message: 'Thanks for welcome'});
});