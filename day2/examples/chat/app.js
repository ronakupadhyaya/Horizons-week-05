var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

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

io.on('connection', function (socket) {
  socket.on('message', function (text) {
    if (socket.username) {
      io.to(socket.room).emit('serverMessage', socket.username + ' said: ' + text);
    }
  })
  socket.on('newUser', function (name) {
    if (socket.username) {
      return;
    } else {
      socket.username = name;
      if (socket.room) {
        socket.emit('serverMessage', 'Welcome to the room ' + socket.username + '!')
        socket.broadcast.to(socket.room).emit('serverMessage', socket.username + ' has joined the Chatroom!')
      }
    }
  })

  socket.on('roomSelect', function (room) {
    if (socket.room !== room) {
      socket.room = room;
      socket.join(socket.room);
      if (socket.username) {
        socket.emit('serverMessage', 'Welcome to the room ' + socket.username + '!')
        socket.broadcast.to(socket.room).emit('serverMessage', socket.username + ' has joined the Chatroom!')
      }
    }
  })
})

app.get('/', function (req, res) {
  res.render('index');
});



var port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log('Express started. Listening on %s', port);
});