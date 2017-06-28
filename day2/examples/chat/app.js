var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection',function(socket){
  socket.join('room1');
  socket.on('username',function(username){
    socket.username=username
    socket.broadcast.emit('joinedRoom', username)
    socket.emit('meRoom',username)
  })
  socket.on('message',function(msg){
    console.log(msg)
    if(!socket.username){
      socket.emit('errorMsg', "Please enter a username")
      // socket.username= "newMember"
    } else {
      io.emit('serverMessage', socket.username + ' said: '+ msg)
    }
  })
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
