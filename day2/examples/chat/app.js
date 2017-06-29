var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();

var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){
  socket.on('message', function(data){
    if(socket.username){
      io.emit('serverMessage', socket.username + ": " + data);
    }
  })

  socket.on('login', function(data){
    if(!socket.username){
      socket.username = String(data);
      socket.emit('serverMessage', "Welcome to the chatroom " + socket.username + "!");
      socket.broadcast.emit('serverMessage', socket.username + " has joined the Chatroom!");

    }else{
      socket.emit('serverMessage', "You're already logged in as " + socket.username)
    }
  })
})

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
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
