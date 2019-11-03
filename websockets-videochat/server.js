const express = require('express');

const app = express();
const httpServer = require('http').Server(app);

const socketIO = require('socket.io');

require("./db/db.js")



// This io object lets us do all the input output communication with front end
const io = socketIO(httpServer);
require('./ioevents.js')(io);


var port = process.env.WEB_PORT || 3000;

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname+'/public/index.html');
})


httpServer.listen(port, ()=> console.log(`Started server on ${port}`));

