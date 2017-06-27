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
  //receive join room from browser; send welcome back to browser
  socket.on('join', function(room) {
    socket.join(room);
    socket.room = room;
    console.log('client joined: '+socket.room);
    socket.emit('joinedRoom', room);
  });
  //receive poke
  socket.on('poke', function() {
    console.log('client poked: '+socket.room);
    var pokeMsg = socket.room+" has been poked!";
    io.to(socket.room).emit('poked', pokeMsg);
  });
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
