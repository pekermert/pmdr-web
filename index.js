var express = require('express'),app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/dashboard', function(req, res){
  res.sendFile(__dirname + '/dashboard.html');
});

io.on('connection', function(socket){

  socket.on('login', function (data) {
    socket.broadcast.emit('new-user',data);
  });
  socket.on('logout', function (data) {
    socket.broadcast.emit('out-user',data);
  });

});

http.listen(3300, function(){
  console.log('listening on *:3300');
});
