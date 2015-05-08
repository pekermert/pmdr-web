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
    gpio.setup(user.pin,gpio.DIR_OUT, function(){led_on(user.pin);});
 });

  socket.on('reset-timer', function(user){
    console.log('reset '+user.pin);
    socket.broadcast.emit('resetTimer', user);
    gpio.setup(user.pin,gpio.DIR_OUT, function(){led_off(user.pin)});
  });

  socket.on('logout', function (data) {
    socket.broadcast.emit('out-user',data);
  });

});


////////////GPIO/////////////
function led_off(pin){
	gpio.write(pin,false,function(err){
		if (err) throw err;
		console.log(pin+'off');
	});
}
function led_on(pin){
	gpio.write(pin,true,function(err){
		if (err) throw err;
		console.log(pin+'on');
	});
}
/////////// HTTP/////////////
http.listen(3300, function(){
  console.log('listening on *:3300');
});

