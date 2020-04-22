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
var rooms = [];

io.on('connection', function(socket){
  console.log("user " + socket.id + " connected.");

  let gamecode = Math.floor(Math.random() * (10000000000 - 1000000000) ) + 1000000000;
  while (gamecodes.find(e => e === gamecode)) {
    gamecode = Math.floor(Math.random() * (10000000000 - 1000000000) ) + 1000000000;
  }
  gamecodes.push(gamecode);
  socket.emit('gamecode', gamecode);

  socket.join(gamecode);

  socket.on('join room', (room, user) => {
    socket.join(room);
    console.log("user " + socket.id + " joined room " + room);
    socket.to(room).emit('joined', room, user);
  })

  socket.on('set username', (room, user) => {
    io.in(room).emit('set username', user);
  })

  socket.on('update room', (room, state) => {
    socket.to(room).emit('network state', state);
  })

  socket.on('clear', (room, state) => {
    socket.to(room).emit('clear');
  })

  socket.on('random', (room) => {
    if (rooms.length === 0){
      rooms.push(room);
    } else {
      socket.emit('join', rooms[0]);
      rooms = rooms.filter(e => e !== rooms[0]);
    }
  })
  
  socket.on('disconnect', () => {
    gamecodes = gamecodes.filter(e => e !== gamecode);
    console.log("user " + socket.id + " disconnected");
  })
});

http.listen(port, function(){
  console.log('listening on :' + port);
});