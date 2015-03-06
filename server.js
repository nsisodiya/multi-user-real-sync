
//Node server which support socket.io
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(8080);
console.log("Server started on port 8080");
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.use(express.static(path.join(__dirname, '')));

var gameData = {
};
io.on('connection', function (socket) {
  socket.on('disconnect', function(){
    console.log(arguments);
    console.log('user disconnected');
  });
  socket.on('getInitialGameData', function(){
    socket.emit('setInitialGameData', gameData);
  });
  socket.on('userAdded', function (userName) {
    console.log("Added a new USer");
    gameData[userName] = {
      userName: userName,
      score: 0
    };
    socket.broadcast.emit('userAdded', userName);
  });
  socket.on('scoreUpdate', function (data) {
    gameData[data.userName].score = data.score;
    socket.broadcast.emit('scoreUpdate', data);
  });
});