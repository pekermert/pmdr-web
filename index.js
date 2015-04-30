var express = require('express')
  , app = express();
 
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static(__dirname));

// Enables CORS
var enableCORS = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
 
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
 
// enable CORS!
app.use(enableCORS);

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

http.listen(3300, function(){
  console.log('listening on *:3300');
});

