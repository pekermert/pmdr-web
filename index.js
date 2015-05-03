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
 
var Gpio = require('onoff').Gpio, // Constructor function for Gpio objects. 
  led = new Gpio(14, 'out');      // Export GPIO #14 as an output. 
 
// Toggle the state of the LED on GPIO #14 every 200ms 'count' times. 
// Here asynchronous methods are used. Synchronous methods are also available. 
(function blink(count) {
  if (count <= 0) {
    return led.unexport();
  }
 
  led.read(function (err, value) { // Asynchronous read. 
    if (err) {
      throw err;
    }
 
    led.write(value ^ 1, function (err) { // Asynchronous write. 
      if (err) {
        throw err;
      }
    });
  });
 
  setTimeout(function () {
    blink(count - 1);
  }, 200);
}(25));
/////////// HTTP/////////////
http.listen(3300, function(){
  console.log('listening on *:3300');
});

