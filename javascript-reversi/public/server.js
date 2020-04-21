var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 5000;

app.use(express.static(__dirname));

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

io.on('connection', function(socket){

  //let username = getCookie();

  console.log("user connected.");

  //socket.emit('user connected', username);
  
  socket.on('disconnect', () => {
    console.log("user disconnected");
  })
});

http.listen(port, function(){
  console.log('listening on :' + port);
});