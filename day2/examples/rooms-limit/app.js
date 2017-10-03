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

let currentRoom = 1;
io.on('connection', function(socket) {
  if(!io.sockets.adapter.rooms['Room '+currentRoom]) {
    socket.room = currentRoom;
    socket.join('Room '+currentRoom);
    socket.emit('message', 'You are in Room '+currentRoom);
  } else if(io.sockets.adapter.rooms['Room '+currentRoom].length === 2) {
    currentRoom++;
    socket.room = currentRoom;
    socket.join('Room '+currentRoom);
    socket.emit('message', 'You are in Room '+currentRoom);
  } else {
    socket.room = currentRoom;
    socket.join('Room '+currentRoom);
    socket.emit('message', 'You are in Room '+currentRoom);
  }
});

io.on('check', () => {
  console.log('In room ' + socket.room);
  socket.emit('message', 'You are in Room ' + socket.room);
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
