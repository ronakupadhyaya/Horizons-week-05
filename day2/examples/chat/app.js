var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//socket.io
io.on('connection', function(socket) {
  socket.on('msg', function(message) {
    if (socket.username) {
      io.emit('serverMessage', socket.username + ': ' + message);
    }
  });
  socket.on('join', function(username) {
    if (!socket.username) {
      socket.username = username;
      socket.emit('serverJoinMessage', 'Welcome to the chatroom ' + username + '!');
      socket.broadcast.emit('serverJoinMessage', username + ' has joined the chat room');
    }
  });
  socket.on('switch-channel', function(channel) {
    socket.channel = channel
    if (channel === 'chat-room-1') {
      socket.join('chat-room-1');
      io.to(socket.channel).emit('serverJoinMessage', 'Welcome to chatroom 1' + socket.username + '!');
      socket.broadcast.to(socket.channel).emit('serverJoinMessage', socket.username + ' has joined the chat room');
      socket.emit('channel-switch', channel);
    } else if (channel === 'chat-room-2') {
      socket.join('chat-room-2');
      io.to(socket.channel).emit('serverJoinMessage', 'Welcome to chatroom 2' + socket.username + '!');
      socket.to(socket.channel).broadcast.emit('serverJoinMessage', socket.username + ' has joined the chat room');
      socket.emit('channel-switch', channel);
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