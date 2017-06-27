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

  socket.on('room', function(room) {
    if (socket.inRoom){
      socket.leave(socket.inRoom);
      socket.join(room);
    }
    else{
      socket.join(room);
      socket.inRoom = room;
    }
  });

  socket.on('poke', function(poke){
    socket.emit('pokeResponse', 'Room #' + socket.inRoom + ' has been poked!');
  })

});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
