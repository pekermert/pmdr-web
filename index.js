var express = require('express');
var cors = require('cors');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var gpio = require("pi-gpio");


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
 
gpio.open(16, "output", function(err) {     // Open pin 16 for output 
    gpio.write(16, 1, function() {          // Set pin 16 high (1) 
        gpio.close(16);                     // Close pin 16 
    });
});
/////////// HTTP/////////////
http.listen(3300, function(){
  console.log('listening on *:3300');
});

