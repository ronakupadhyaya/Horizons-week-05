var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log("SERVER SOCKET CONNECTED");
  socket.on('message', function(msg) {
    if (socket.username) {
      console.log(msg);
      io.emit('serverMessage', socket.username + '  said: ' + msg);
    }
  });
  socket.on('login', function(username) {
    if (!socket.username) {
      console.log(username);
      socket.username = username;
      socket.emit('serverMessage', socket.username + ', welcome to the chatroom!');
      socket.broadcast.emit('serverMessage', socket.username + ' has joined the chatroom!');
    }
  });
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
  console.log('SERVER LISTENING ON PORT', port);
});
