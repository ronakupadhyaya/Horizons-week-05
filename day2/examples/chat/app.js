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

// Static assets
app.use(express.static(path.join(__dirname, 'public')));

// Logging
app.use(morgan('combined'));

// Websocket connection
io.on('connection', function(socket){
  console.log('connect2');

  // assigning a username
  socket.on('login', function(username){
    console.log("Username inputed: " + username);
    if (!socket.username) {
      socket.username = username;
    }
    console.log("socket.username is " + socket.username);
    io.sockets.in(socket.room).emit('joinedroom', socket.username); // socket.broadcast.emit so we don't see that we joined the room but everyone else does
    socket.emit('welcome', socket.username);
  });

  socket.on('message', function(msg) {
    console.log("Message sent: " + msg);
    io.sockets.in(socket.room).emit('recievedMessage', socket.username + " said: " + msg )
  });


  // entering Chatroom
  socket.on('enterroom', function(room){
    if (!socket.room) {
      socket.room = room;
      socket.join(socket.room);
    } else {
      socket.leave(socket.room, function(){
        socket.room = room;
        socket.join(socket.room);
      })
    }
    console.log("You have entered: " + socket.room);
    io.sockets.in(socket.room).emit('recievedMessage', socket.username + " has joined: " + room);
  });


});




app.get('/', function(req, res) {
  res.render('index');
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
