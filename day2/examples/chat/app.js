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
  console.log('connected');
  socket.on('message',function(msg){
    if (socket.username && socket.room){
      io.to(socket.room).emit('sendBack', socket.username+' says: "'+msg+'"');
    }
  })
  socket.on('login',function(username, room){
    if (!socket.username && !socket.room){
      socket.username = username;
      socket.room = room;
      // socket.broadcast.emit('sendBack',username + " has joined the chatroom")
      socket.join(room)
      socket.emit('sendBack', "Welcome to " +room+ ' '+ username)
      io.to(room).emit('sendBack',socket.username + " has joined" )
    }
  })
  // socket.on('room',function(room){
  //   if (!socket.room){
  //     socket.room = room
  //     io.to(room).emit('sendBack',socket.username + " has joined" )
  //     socket.emit('sendBack', "Welcome to " + socket.room)
  //   }
  // })
});


var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
