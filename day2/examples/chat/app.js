//server side
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
  socket.on('message', function(msg){
    if (socket.username){
      io.sockets.in(socket.room).emit('serverMessage', {username: socket.username, text: msg});
    }
  })
  socket.on('login', function(username){
    socket.username = username;
    io.sockets.in(socket.room).emit('joinedroom', socket.username)
  })
  //entering rooms
  socket.on('room', function(roomNum){
    if (!socket.room){
      socket.room = roomNum;
      socket.join(socket.room);
      // io.sockets.in(socket.room).emit('serverMessage', socket.room)
    }
    else{
      socket.leave(socket.room, function(){
        socket.room = roomNum;
        socket.join(socket.room);
      })

    }
  })
});



var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
