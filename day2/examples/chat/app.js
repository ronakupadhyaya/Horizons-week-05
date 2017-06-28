var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();

var server = require('http').Server(app);
var io = require('socket.io')(server) //


// Set View Engine
app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'main'
}));
app.set('view engine', 'hbs');

// Static assets
app.use(express.static(path.join(__dirname, 'public'))); //able to serve html files from here

io.on('connection', function(socket) {
  socket.on('login', function(username){
    if (!socket.username) {
      socket.username = username;
      socket.broadcast.emit('joinedRoom', `new user, ${username}, has joined the room!`);
      socket.emit('welcomeUser', `welcome to the room, ${username}`);
    }
  })

  socket.on('message', function(msg){
    io.emit('serverMessage', socket.username + ' said: ' + msg)
  })

}); //

// Logging
app.use(morgan('combined'));

app.get('/', function(req, res) {
  res.render('index');
});

var port = process.env.PORT || 3000;

server.listen(port, function() {
  console.log('Express started, Listening on %s', port);
});

// app.listen(port, function(){
//   console.log('Express started. Listening on %s', port);
// });
