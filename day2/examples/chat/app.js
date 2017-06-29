var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();

//socket stuff
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

//on socket connection this starts our socket connection on server side
io.on('connection', function(socket){
  console.log("connected on server side");

  //this listens for emitted event of username
  socket.on('username', function(user){
    //sets socket username as input parameter
    socket.username = user
    //send this specific socket a welcome event
    socket.emit('welcome', socket.username)
    //sends every other socket a joined event
    socket.broadcast.emit('joinedroom', socket.username)
  })

  //listens for a message event
  socket.on('message', function(msg){
    //if they are logged in
    if(socket.username){
      //emit to every socket the data conaiting that sockets name and their message
      io.emit('message', socket.username + ' said: '+  msg)
    }
  })
});

app.get('/', function(req, res) {
  res.render('index');
});

var port = process.env.PORT || 3000;
//server
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
