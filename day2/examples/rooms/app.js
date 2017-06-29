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

var userCounter = 1;
io.on('connection', function(socket) {
  socket.on('enter',function(data){
    if (socket.room){
      socket.leave(socket.room)
    }
    socket.join(data);
    socket.room = data;

    if (!socket.user){
      socket.user = userCounter;
      userCounter++;
    }
    io.emit('join',socket.user+" has joined " + data)
  });

  socket.on('poke',function(){
    io.sockets.in(socket.room).emit('poke',socket.user);
  });
})

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
