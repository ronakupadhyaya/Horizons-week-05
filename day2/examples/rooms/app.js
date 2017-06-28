var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Set View Engine
app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'main'
}));
app.set('view engine', 'hbs');

// Logging
app.use(morgan('combined'));

app.get('/', function(req, res) {
  res.render('index');
});

io.on('connection', function(socket) {
  socket.on('room', function(room) {
    if (!socket.room) {
      socket.join(room);
      socket.room = room;
    } else {
      socket.leave(socket.room, function() {
        socket.join(room);
        socket.room = room;
      });
    }
  });

  socket.on('message', function(msg){
    io.sockets.in(socket.room).emit('serverMessage', socket.username + ' said: ' + msg)
  })

  socket.on('login', function(username){
    if (!socket.username) {
      socket.username = username;
      io.sockets.in(socket.room).emit('joinedRoom', `new user, ${username}, has joined the room!`);
      socket.emit('welcomeUser', `welcome to the room, ${username}`);
    }
  })

  socket.on('poke', function(){
    console.log(`poke was emitted`);
    io.sockets.in(socket.room).emit('pokeMessage', `${socket.room} has been poked!`)
  })
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
