var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server)

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

io.on('connection', function(socket) {
  socket.on('message', function(msg) {
    console.log(msg);
    if (!socket.username) {
      socket.username = msg
      socket.emit('welcome', socket.username)
      socket.broadcast.emit('joinedroom', socket.username)
    } else {
      io.emit('servermessage', socket.username +" said: " + msg)
    }
  })
  // console.log('new clined connect');
})

var port = process.env.PORT || 3000;

server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});

// app.listen(port, function(){
//   console.log('Express started. Listening on %s', port);
// });
