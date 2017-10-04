var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var room1 = io.of('/room1');
var room2 = io.of('/room2')

io.on('connection', (socket) => {
  socket.on('room', (room) => {
    socket.join(room);
    socket.emit('message', `Welcome to ${room}`)
  })
  socket.on('room', )
})

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

io.on('connection', function(socket) {});

var port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log('Express started. Listening on %s', port);
});
