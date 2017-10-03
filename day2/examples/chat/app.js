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

// Socket.io
io.on('connection', function(socket) {
  socket.on('message', (msg) => {
    if(!socket.username) {
      socket.emit('serverMessage', 'You must be logged in to chat!');
    } else {
      console.log(socket.username + ' said: ' + msg);
      io.emit('serverMessage', socket.username + ' said: ' + msg);
    }
  });
  socket.on('login', (username) => {
    if(socket.username) {
      socket.emit('serverMessage', 'You are already logged in as ' + socket.username + '!');
    } else {
      socket.username = username;
      socket.emit('serverMessage', 'You are now logged in as ' + socket.username + '.');
      socket.broadcast.emit('joinRoom', socket.username);
    }
  });
});

// Logging
app.use(morgan('combined'));

app.get('/', function(req, res) {
  res.render('index');
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
