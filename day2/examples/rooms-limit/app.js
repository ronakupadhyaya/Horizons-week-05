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
  socket.on('room', function(){
    io.sockets.room = []
    console.log(rooms)
    if(io.sockets.room.length === 0){
      io.socket.room = {
        name: '#1',
        num: 1,
      };
      socket.join(io.socket.room.name)
      socket.emit('room',io.socket.room.name )
    } else{
      if(io.sockets.room.hasOwnProperty === '#1'){
        
      }
    }
  })
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
