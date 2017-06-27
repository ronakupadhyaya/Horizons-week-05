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

app.get('/', function(req, res) {
  res.render('index');
});

//functions for when server connected to browser
io.on('connection', function(socket) {
  //receive message from browser, send back msg to browser if logged in
  socket.on('message', function(msg) {
    if (socket.username) {
      var serverMsg = "> "+socket.username+":  "+msg;
      io.emit('serverMsg', serverMsg);
    }
  });
  //receive login from browser
  socket.on('login', function(username) {
    if(!socket.username) {
      socket.username = username;
      var msgToAll = username+" has joined the room.";
      var msgToOne = "Welcome to the chat room, "+username+".";
      socket.broadcast.emit('loginResponse', msgToAll);
      socket.emit('loginResponse', msgToOne)
    }
  });

});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
