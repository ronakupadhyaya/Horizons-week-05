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

io.on('connection', function(socket){ //socket here represent the same socket connect from client side
  socket.on('login',function(username){
    socket.username = username;
    socket.emit('welcome','welcome to the Chatroom '+username);
    socket.broadcast.emit('joinChat', username+' has joind the Chatroom!');
  })
  socket.on('message',function(msg){
    // socket.emit("serverMessage","Sever captured your message: "+msg); //emit to that particular socket
    if(socket.username){
      io.emit("serverMessage", socket.username+': '+msg) //emit to all websockets
    }
  })
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});

// var port = process.env.PORT || 3000;
// app.listen(port, function(){
//   console.log('Express started. Listening on %s', port);
// });
