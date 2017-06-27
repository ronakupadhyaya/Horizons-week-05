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

  socket.on('room1', function(room){
    console.log("socket joining room", room);
    socket.leave('room2')
    socket.join(room);
    socket.emit('welcome', 'welcome to '+room);
  })

  socket.on('room2', function(room){
    console.log("socket joining room", room);
    socket.leave('room1')
    socket.join(room);
    socket.emit('welcome', 'welcome to '+room);
  })


});



var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
