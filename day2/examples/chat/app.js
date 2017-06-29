var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();

var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){
  socket.on('username', function(name){
    socket.username = name;
    socket.broadcast.emit('joinedRoom', socket.username);
    socket.emit('iJoinedRoom', socket.username);
  })
  socket.on('message', function(msg){
    if(!socket.username){
      socket.emit('loginStatus', 'You must be logged in!');
    }
    else{
      io.emit('serverMessage', socket.username + ' said: ' + msg);
    }
  })
  console.log('A user has connected!');
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

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
