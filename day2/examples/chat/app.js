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

io.on('connection', function(socket){
  socket.on('login', function(username){
    if(!socket.username){
      socket.username = username;
      socket.emit('welcome', socket.username);
    } else if (socket.username !== username){
      socket.broadcast.emit('nameChange', socket.username + ' has changed their name to: ' + username);
      socket.emit('messageServer', 'You have changed your name to: ' + username);
      socket.username = username;
      socket.emit('welcome', socket.username);
    }
    socket.on('message', function(msg) {
      console.log('This is the message from ' + socket.username + ': ' + msg);
      socket.broadcast.emit('messageServer', socket.username + ': ' + msg);
    });
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
