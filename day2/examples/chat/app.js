var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();
// io stuff
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connect', function(socket){
  socket.on('username',function(name){
    socket.username = name;
    socket.emit('welcomeUser',"Welcome to the Chatroom "+name);
    socket.broadcast.emit('joinNoti',name+" has joined the chatroom")
  });
  socket.on('msg',function(msg){
    if(!socket.username){
      // $('section').append('<script>alert("Please put in your username first!")</script>');
    } else {
    io.emit('serverMsg',socket.username+" sent: "+msg);
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
