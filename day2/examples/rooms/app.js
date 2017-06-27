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

  var inRoom = {R1: false, R2: false};

  // join/leave rooms
  socket.on('joinR1', function(){
    if(inRoom.R2){
      socket.leave('R2');
      inRoom.R2 = false;
    }
    socket.join('R1');
    inRoom.R1 = true;
  });

  socket.on('joinR2', function(){
    if(inRoom.R1){
      socket.leave('R1');
      inRoom.R1 = false;
    }
    socket.join('R2');
    inRoom.R2 = true;
  });

  // broadcast the poke
  socket.on('poke', function(id){
    if(inRoom.R1){
      io.to('R1').emit('poke', 'Your Room 1 has been poked!');
    }else{
      io.to('R2').emit('poke', 'Your Room 2 has been poked!');
    }
  });
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});


/*
0) listen on server side
1) add click handlers to join either room on client side
*/
