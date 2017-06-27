var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();

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

//SOCKETS
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){

  socket.on('message', function(msg){
    if(socket.username){
      io.emit('message', socket.username + ': ' +  msg)
    }
  })

  socket.on('username', function(user){
    if(!socket.username && user){
      socket.username = user
      socket.broadcast.emit('joinedroomall', user)
      socket.emit('joinedroompersonal', user)
    }
  })

});



var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
