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

// Logging
app.use(morgan('combined'));

app.get('/', function(req, res) {
  res.render('index');
});

io.on('connection', function(socket) {
  console.log('connected on server side')
  //when someone tries to join a room
  socket.on('room', function(room){
    //if there is a socket room leave it
    if(socket.room){
      socket.leave(socket.room)
    }
    //set socket.room to be the room chose
    socket.room = room
    //then join it
    socket.join(room)
  })

  //on poked event 
  socket.on('poked', function(poke){
    console.log(socket.room)
    //emit an event to all sockets in that room and pass in room in msg
    io.sockets.to(socket.room).emit('poke',socket.room + poke);
  })
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
