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
app.use(express.static(path.join(__dirname, 'public')));

// Logging
app.use(morgan('combined'));

app.get('/', function(req, res) {
  res.render('index');
});

var roomNumber = "";

io.on('connection', function(socket) {
  socket.on('room',function(roomNum) {
      socket.leave(socket.room, function(){
        socket.join(roomNum, function(){
          socket.room = roomNum;
          io.sockets.in(roomNum).emit('message', 'Welcome to ' + roomNum);
        });
      });
  });

  socket.on('poked',function() {
    //if (roomNumber === roomNum) {
    console.log(socket.room)
      io.sockets.in(socket.room).emit('poking', socket.room + " has been poked");
    //}
  })
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
