var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server)

// Set View Engine
app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'main'
}));
app.set('view engine', 'hbs');

// Static assets
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket) {
  socket.on('username', function(username) {
    socket.username = username;
    socket.broadcast.emit('joinedRoom', {username: socket.username})
  })
  socket.on('message', function(message) {
    socket.broadcast.emit('serverMessage', {username: socket.username, message: message, sender: false})
    socket.emit('serverMessage', {username: socket.username, message: message, sender: true})
  })
  socket.on('typing', function() {
    socket.broadcast.emit('typingResponse', {username: socket.username})
  })
})

// Logging
app.use(morgan('combined'));

app.get('/', function(req, res) {
  res.render('index');
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
