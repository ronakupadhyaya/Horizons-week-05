var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', (socket) => {
  socket.on('login', (username) => {
    if (username) {
      socket.emit('alert', `Welcome to the chatroom ${username}!`);
      socket.broadcast.emit('alert', username + ' has joined the chat!');
      socket.username = username;
    }
  })
  socket.on('message', (msg) => {
    if (socket.username) {
      io.emit('message', socket.username + ': ' + msg);
    } else {
      socket.emit('alert', 'YOU MUST BE LOGGED IN TO SEND MESSAGES');
    }
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
server.listen(port, function() {
  console.log('Express started. Listening on %s', port);
});
