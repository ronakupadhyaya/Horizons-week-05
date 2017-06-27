var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 3000;


server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});

io.on('connection', function(socket){

  socket.on('login', function(username){
    // console.log(username, socket.username);
    // if(socket.username){
    socket.username = username;
    
    socket.broadcast.emit('joinedroom', socket.username);
    socket.emit('welcome', 'Welcome to the chatroom, '+socket.username)
  })

  socket.on('message', function(message){
    if(socket.username){

      console.log(message);
      io.emit('messageresponse', socket.username+' said '+message)
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

io.on('connection', function(socket){

})


// var port = process.env.PORT || 3000;


// app.listen(port, function(){
//   console.log('Express started. Listening on %s', port);
// });
