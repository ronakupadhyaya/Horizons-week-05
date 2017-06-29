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

io.on('connection', function(socket){
  socket.on('username', function(user){
    if(!socket.username){
      socket.username = user;
      socket.broadcast.emit('joinedroom', socket.username)
    }else{
      socket.on('message', function(msg){
        console.log(msg)
        io.emit('serverMessage', socket.username + ' says:' + msg)
      })
    }
  })
  socket.on('message', function(msg){
    if(socket.username){
      console.log(msg)
      io.emit('serverMessage', socket.username + ' says:' + msg)
    } else{
      console.log("login needed")
    }
  })

});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
