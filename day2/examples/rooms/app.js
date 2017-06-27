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
  socket.on('joinRoom', function(room) {
    socket.join(room);
    console.log("socket", socket);
  });

  // socket.on('poke', function() {
  //   io.to(socket.room).emit('pokedMessage', socket.room + " has been poked");
  // });

  // var roomOne = io.of('roomOne');
  // roomOne.on('connection', function(socket) {
  //   console.log("connected to room 1");
  // });
  // roomOne.emit('welcome', "hello in room 1");
  //
  // var roomTwo = io.of('roomTwo');
  // roomTwo.on('connection', function(socket) {
  //   console.log("connected to room 2");
  // });
  // roomOne.emit('welcome', "hello in room 2");
});

var port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log('Express started. Listening on %s', port);
});
