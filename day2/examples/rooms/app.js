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
  // once a client has connected, we expect to get a ping from them saying what room they want to join
  socket.on('room', function(room) {
    socket.join(room);
  });
});

// now, it's easy to send a message to just the clients in a given room
room = "roomone";
io.sockets.in(room).emit('message', 'what is going on, party people?');

// this message will NOT go to the client defined above
io.sockets.in('foobar').emit('message', 'anyone in this room yet?');

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
