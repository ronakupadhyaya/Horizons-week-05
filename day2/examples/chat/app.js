var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);


io.on('connection', function(socket){
  console.log('client is connected!');
  socket.on('login', function(username){
    if(!username || username === ' ') {
      console.log("pls login")
  } else if (!socket.username && username) {
    socket.username = username;
    socket.emit('localWelcome', '*** welcome ' + socket.username + '! ***')
    io.emit('globalWelcome', socket.username + ' has joined the chat')
  } else {
    var old = socket.username;
    socket.username = username;
    io.emit('globalWelcome', old + ' changed their name to ' + socket.username)
  }
  })
  socket.on('message', function(msg){
    if(socket.username){
  	console.log("your message was: " + msg)
  	io.emit('serverMessage', socket.username + ': ' + msg)
  } else {
    io.emit('warning', "please login")
  }
  })
});



// Set View Engine
app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'main'
}));
app.set('view engine', 'hbs');

// Static assets
app.use(express.static(path.join(__dirname, 'public')));

// Logging
app.use(morgan('combined'));

app.get('/', function(req, res) {
  res.render('index');
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
