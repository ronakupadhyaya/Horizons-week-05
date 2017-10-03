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
  socket.on('room', (room) => {
    if(!socket.room) {
      socket.room = room;
      socket.join(room);
      socket.emit('message', 'Welcome to ' + room);
    } else {
      socket.emit('message', "You're already in a room: " + socket.room);
    }
  });
  socket.on('message', (msg) => {
    if(!socket.room) {
      io.to(socket.room).emit('message', msg);
    } else {
      socket.emit('message', 'You must be a room to chat!');
    }
  });
  socket.on('poke', () => {
    if(!socket.room) {
      socket.emit('message', 'You must be in a room to poke!');
    } else {
      io.to(socket.room).emit('poke', socket.room);
    }
  });
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
