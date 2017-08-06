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

io.on('connection', function(socket){
  console.log('Connection from server side is successful');
  socket.on('username', function(username){
    socket.username = username;
    socket.broadcast.emit('joinedRoom', socket.username);
  })
  socket.on('message', function(msg){
    if(socket.username){
      io.emit('serverMessage', socket.username + ' said ' + msg);
    } else{
      alert('Enter a username');
    }
  })
});

app.get('/', function(req, res) {
  res.render('index');
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
