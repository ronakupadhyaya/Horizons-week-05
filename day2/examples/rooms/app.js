/*jshint esversion: 6 */
/*jslint node: true */
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

app.use(express.static(path.join(__dirname, 'public')));


var users = {};
var rooms = ["room1", "room2"];

io.on('connection', function(socket){
  console.log("Connected to socket!");


  

  socket.on("message", (msg) => {
    var userSocket = socket.id;
    if (users[userSocket]) {
      io.emit("serverMessage", users[userSocket] + " said: " + msg);
    }
    console.log(users);
  });

  socket.on("login", (username) => {
    var userSocket = socket.id;
    if (!users[userSocket]) {
      users[userSocket] = username;
      socket.emit("joinedRoom", "Welcome to the chat room, " + username);
      socket.broadcast.emit("joinedRoom", username + " has joined the room!");
    }
  });
});

// Logging
app.use(morgan('combined'));

app.get('/', function(req, res) {
  res.render('index');
});


app.get('/room1', function(req, res) {
  res.render('room');
});

app.get('/room2', function(req, res) {
  res.render('room');
});

io.on('connection', function(socket) {
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
