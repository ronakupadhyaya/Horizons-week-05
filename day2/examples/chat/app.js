var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server); // adds socket io to server, socket.io.js is available


// socket stuff
io.on('connection', function(socket) { // new connection that comes in, waiting to listen
  //console.log('connected');
  socket.on('message', function(msg) {
    if (socket.username) {
      socket.emit('myMsg', socket.username + ' said: ' + msg)
      socket.broadcast.emit('myMsgToOther', socket.name + ' said: ' + msg)
    }
    // socket.emit('message', 'You are..'); // yourself
    // socket.broadcast.emit('message', 'username is...') // everyone but you
  })
  socket.on('login', function(username) {
    if (!socket.username) {
      socket.username = username
      console.log(username)
      socket.broadcast.emit('otherJoined', socket.username + ' just joined the room!')
      socket.emit('iJoined', 'Welcome to the room, ' + socket.username)
    }
  })
  socket.on('disconnect', function(msg) {
    console.log('disconnected');
  })
})

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

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
