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

var history = []
io.on('connection', function(socket){
  socket.on('username',function(username){
    if(!socket.username){
      socket.username = username
      socket.emit('joinedRoomA',socket.username)
      io.emit('joinedRoom', socket.username)

    }
  })
  socket.on('message', function(msg){
    if(socket.username){
      var thisM = socket.username+ ' said: '+ msg+' '
      io.emit('serverMessage', thisM)
      history.push(thisM)
    }


  })
 history.forEach(function(message){
   socket.emit('serverMessage', message)
 })
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
