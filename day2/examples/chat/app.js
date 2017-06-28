var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();

//server setup
//required modules
var server = require('http').Server(app);
var io = require('socket.io')(server);

//connection point
io.on('connection', function(socket) {
  console.log("Connected on server side!");
  socket.on('username', function(username) {
    socket.username = username;
    socket.emit('joinedroom', "Welcome to the chat " + socket.username);
    socket.broadcast.emit('joinedroom', socket.username + " has joined the chat");
  });
  socket.on('message', function(msg) {
    if (socket.username) {
      io.emit('message', socket.username + ": " + msg);
    } else {
      socket.emit('message', "You must be signed in to chat!");
    }
  });
});


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

app.get('/', function(req, res) {
  res.render('index');
});

//server port setup
var port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log("Express started, listening on %s", port);
});

// app.listen(port, function(){
//   console.log('Express started. Listening on %s', port);
// });
