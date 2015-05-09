var express = require('express');
var cors = require('cors');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var gpio = require('rpi-gpio');

// USER ID : GPIO PIN NUMBER
var PinArray={1:7,7:11,6:13};

// EXPRESS SET
app.use(express.static(__dirname));
app.use(cors());

app.get('/', function(req, res, next){
  res.sendFile(__dirname + '/index.html');
});
app.get('/dashboard', function(req, res, next){
  res.sendFile(__dirname + '/dashboard.html');
});

// SOCKET IO 
io.on('connection', function(socket){

  socket.on('login', function (data){
    socket.broadcast.emit('new-user',data);
  });

  socket.on('start-timer', function(time,user){
    socket.broadcast.emit('startTimer', {'time_type':time,'username':user.username,'id':user.id});
    console.log('test'+PinArray[user.id]);
    gpio.setup(PinArray[user.id],gpio.DIR_OUT, function(){led_on(PinArray[user.id]);});
  });

  socket.on('reset-timer', function(user){
    socket.broadcast.emit('resetTimer', user);
    gpio.setup(PinArray[user.id],gpio.DIR_OUT, function(){led_off(PinArray[user.id])});
  });

  socket.on('logout', function (data){
    socket.broadcast.emit('out-user',data);
    gpio.setup(PinArray[data],gpio.DIR_OUT, function(){led_off(PinArray[data])});
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
/////////// HTTP SERVER /////////////
http.listen(3300, function(){
  console.log('listening on *:3300');
});

