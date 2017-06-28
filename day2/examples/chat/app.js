var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//SET UP CONNECTION SERVER SIDE
io.on('connection', function(socket){
  console.log('we have connected')

  socket.on('register', function(username) {
    if(!socket.username) {
      socket.username = username
      socket.emit('welcome', socket.username)
      socket.broadcast.emit('joinedroom', socket.username)
    }
  })

  // RECEIVE AND RESPOND TO MESSAGE SERVER SIDE
  socket.on('message', function(msg) {
    //Check if username, if so log msg
    if(socket.username) {
      io.emit('serverMessage', socket.username + ' said: ' + msg)
    }
  })

  socket.on('disconnect', function() {
    console.log('client disconnected');
  });
});

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
