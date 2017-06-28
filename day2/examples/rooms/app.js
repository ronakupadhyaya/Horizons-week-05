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

var room1 = "a"
var room2 = "b"

io.on('connection', function(socket) {
  socket.on('room1', function(room1){
    socket.join(room1)
    socket.emit('welcome', "welcome to room 1")
    io.sockets.in(room1).emit('joinedroom', "someone joined room 1")
  })
  socket.on('room2', function(room2){
    socket.join(room2)
    socket.emit('welcome', "welcome to room 2")
    io.sockets.in(room2).emit('joinedroom', "someone joined room 2")
  })
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
