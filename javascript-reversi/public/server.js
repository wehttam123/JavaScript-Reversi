const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
//var http = require('http').Server(app);
//var io = require('socket.io')(http);

app.use(express.static(__dirname));

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.use(express.static('public'));