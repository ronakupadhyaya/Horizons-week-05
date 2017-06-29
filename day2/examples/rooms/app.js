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
  socket.on('room', function(room){
    console.log("received 'room' with value: ", room);
    if(socket.room!==room){
      socket.leave(socket.room)
      socket.join(room);
      socket.room = room; //saving room in socket
      io.in(socket.room).emit('serverMessage', 'Welcome to Room ' + room + "!");
    }
  })

  socket.on('message', function(msg){
    socket.in(socket.room).emit('serverMessage', socket.username + "said: " + msg);
  })

  socket.on('poke', function(){
    console.log("socket.room", socket.room);
    io.in(socket.room).emit('serverMessage', "Room " + socket.room + " has been poked!");
  })
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
