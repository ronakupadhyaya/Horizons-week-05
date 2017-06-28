var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();
//Part1
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
//Part1
io.on('connection', function(socket){
  socket.on('message', function(msg){
    if(!socket.username){
    io.emit('serverMessage', "PLEASE LOG IN TO CONTINUE")
    } else {
    io.emit('serverMessage', socket.username + " said: " + msg)
  }
  })
  socket.on('submit', function(username){
    socket.username = username;
    socket.emit('loginMessage', "You're logged in as "+socket.username);
    io.emit('broadcast', socket.username +" joined the chatroom!")
    socket.emit('welcome', "Welcome to the chatroom, "+socket.username)
  })
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
