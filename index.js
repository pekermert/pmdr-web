var express = require('express');
var cors = require('cors');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var gpio = require('rpi-gpio');


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
var pin   = 7;
var delay = 2000;
var count = 0;
var max   = 3;
gpio.setup(pin, gpio.DIR_OUT, on);

function on() {
    if (count >= max) {
        gpio.destroy(function() {
            console.log('Closed pins, now exit');
            return process.exit(0);
        });
        return;
    }
 
    setTimeout(function() {
        gpio.write(pin, 1, off);
        count += 1;
    }, delay);
}
 
function off() {
    setTimeout(function() {
        gpio.write(pin, 0, on);
    }, delay);
}
/////////// HTTP/////////////
http.listen(3300, function(){
  console.log('listening on *:3300');
});

