var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket) {
  // On the server, listen for the message event
  socket.on('message', function(msg){
    // Emit the message event from the server to the client(s)
    console.log("Username on Server-side: " + socket.username);
    io.emit('serverMessage', socket.username + ": " + msg)
  })

  socket.on('username', function(username) {
    if(username) {
      socket.username = username;
      socket.broadcast.emit('serverMessage', socket.username + " has joined the Chatroom!")
    }
  })


})
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

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
