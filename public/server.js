const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;

app.use(express.static(__dirname));

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

var gamecodes = [];

io.on('connection', function(socket){
  console.log("user connected.");

  let gamecode = Math.floor(Math.random() * (10000000000 - 1000000000) ) + 1000000000;
  while (gamecodes.find(e => e === gamecode)) {
    gamecode = Math.floor(Math.random() * (10000000000 - 1000000000) ) + 1000000000;
  }
  gamecodes.push(gamecode);
  socket.emit('gamecode', gamecode);

  socket.join(gamecode);
  
  socket.on('disconnect', () => {
    gamecodes = gamecodes.filter(e => e !== gamecode);
    console.log("user disconnected");
  })
});

http.listen(port, function(){
  console.log('listening on :' + port);
});