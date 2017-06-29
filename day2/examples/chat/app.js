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

io.on('connection', function(socket){
  socket.on('setUsername', function(newUsername){
    if(!socket.username){
      socket.username = newUsername;
      socket.emit('serverMessage', "Welcome to that chat room " + socket.username + "!");
      socket.broadcast.emit('serverMessage', socket.username + " has just joined the chatroom")
    } else {
      socket.emit('serverMessage', "you " + socket.username + " are already logged in");
    }
  })
  socket.on('message', function(msg) {
    console.log(msg);
    if(!socket.username){
      console.log("you must log in to send a message");
    } else {
      io.emit('serverMessage', '<li>' + socket.username + ": " + msg + '</li>');
    }
  });
});


// var port = process.env.PORT || 3000;
// app.listen(port, function(){
//   console.log('Express started. Listening on %s', port);
// });


var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
