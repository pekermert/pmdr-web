var express = require('express');
var cors = require('cors');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var gpio = require('rpi-gpio');

// USER ID : GPIO PIN NUMBER

var PinArray={1:7,7:11,6:13};
var pinNum;
/*
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
*/
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
    pinNum = parseInt(PinArray[user.id]);
    //gpio.setup(pinNum,gpio.DIR_OUT, function(){led_on(pinNum);});
  });

  socket.on('reset-timer', function(user){
    socket.broadcast.emit('resetTimer', user);
    pinNum = parseInt(PinArray[user.id]);
    //gpio.setup(pinNum,gpio.DIR_OUT, function(){led_off(pinNum)});
  });

  socket.on('logout', function (data){
    socket.broadcast.emit('out-user',data);
    pinNum = parseInt(PinArray[data]);
    //gpio.setup(pinNum,gpio.DIR_OUT, function(){led_off(pinNum)});
  });

});


/////////// HTTP SERVER /////////////
http.listen(3300, function(){
  console.log('listening on *:3300');
});

