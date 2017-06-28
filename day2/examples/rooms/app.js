var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//SET UP SOCKET CONNECTION

io.on('connection', function(socket){
  console.log('we have connected')

  socket.on('join_room1', function() {
    //Check if username, if so log msg

      socket.join('room1')
    io.to('room1').emit('joinedroom')

  })

//General poke response
  socket.on('poke', function() {
    io.emit('pokedAll', 'YOUVE BEEN POKED')
  })



})

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
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
