var express = require('express');
var cors = require('cors');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));
app.use(cors());

app.get('/', function(req, res, next){
  res.sendFile(__dirname + '/index.html');
});
app.get('/dashboard', function(req, res, next){
  res.sendFile(__dirname + '/dashboard.html');
});

io.on('connection', function(socket){

  socket.on('login', function (data) {
    socket.broadcast.emit('new-user',data);

  });

  socket.on('start-timer', function(time,user){
    console.log('start '+time);
    socket.broadcast.emit('startTimer', {'time_type':time,'username':user.username,'id':user.id});
  });

  socket.on('reset-timer', function(user){
    console.log('reset '+user);
    socket.broadcast.emit('resetTimer', user);
  });

  socket.on('logout', function (data) {
    socket.broadcast.emit('out-user',data);
  });

});

///RASPBERRY GPIO///
var wpi = require('wiring-pi');
wpi.setup();
var pin = 4; //Change pin number according to your wiring
wpi.pinMode(pin, wpi.OUTPUT);
var value = 1;
setInterval(function() {
  wpi.digitalWrite(pin, value);
  value = +!value;
}, 500);
/////////// HTTP/////////////
http.listen(3300, function(){
  console.log('listening on *:3300');
});

