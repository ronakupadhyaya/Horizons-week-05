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

app.get('/', function (req, res) {
  res.render('index');
});

io.on('connection', function (socket) {

  socket.on('r1', function (room) {
    socket.join(room);
    socket.room = room;
    socket.emit("room", "r1");
  });

  socket.on('r2', function (room) {
    socket.join(room);
    socket.room = room;
    socket.emit("room", "r2");
  });

  socket.on("poke", function (room) {
    io.sockets.in(room).emit('message', 'what is going on, party people?');
  })
});

var port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log('Express started. Listening on %s', port);
});
