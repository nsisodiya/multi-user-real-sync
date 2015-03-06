/**
 * Created by narendra on 6/3/15.
 */


var socket = io('http://localhost');
var Game = function(callback){
  this.callback = callback;
  this.gameData = {};
  this.init();
};
Game.prototype.init = function () {
  var self = this;

  socket.on("setInitialGameData", function (gameData) {
    console.log("updating gameData");
    self.gameData = gameData;
    self.callback();
    self.render();
  });
  socket.on("userAdded", function (userName) {
    self.gameData[userName] = {
      userName: userName,
      score: 0
    };
    self.render();
  });

  socket.on('scoreUpdate', function (data) {
    self.gameData[data.userName].score = data.score;
    self.render();
  });

  socket.emit("getInitialGameData");
};

Game.prototype.setUserName = function () {

  this.userName = window.prompt("What is Your Name");
  document.getElementById("userName").innerHTML = "Your Name is " + this.userName;
  this.gameData[this.userName] = {
    userName: this.userName,
    score: 0
  };
  socket.emit("userAdded", this.userName);
  this.render();
};
Game.prototype.incrementMyScore = function () {
  this.gameData[this.userName].score = this.gameData[this.userName].score+1;
  socket.emit("scoreUpdate", {
    userName : this.userName,
    score:this.gameData[this.userName].score
  });
  this.render();
};

Game.prototype.render = function () {
  //This will be called for rendering
  var str = "";
  for(var user in this.gameData){
    var data = this.gameData[user];
    str = str + '<div class="box"><div>'+data.userName+'</div><div>Score : '+ data.score +'</div></div>';
  }
  str = str + '<div style="clear: both"></div>';
  document.getElementById("lobby").innerHTML = str;
};

var myGame = new Game(function () {
  myGame.setUserName();
});
document.getElementById("mybutton").onclick = function () {
  myGame.incrementMyScore();
};


