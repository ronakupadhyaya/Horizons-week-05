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

// Logging
app.use(morgan('combined'));

app.get('/', function(req, res) {
  res.render('index');
});
var connectUser = 0;
io.on('connection', function(socket){
  socket.on('newConnection',function(){
    connectUser++;
    if (connectUser%2 === 0 && !socket.room){
      console.log('Inside first if ' + connectUser);
      socket.room = connectUser;
      socket.join(connectUser);
      socket.emit('sendBack','You have joined room ' + (connectUser).toString())
      io.to(connectUser).emit('sendBack','A user has joined');
    }else if (!socket.room){
      console.log('Inside second if ' + connectUser-1);
      socket.room = connectUser-1;
      socket.join(connectUser-1);
      socket.emit('sendBack','You have joined room ' + (connectUser-1).toString())
      io.to(connectUser-1).emit('sendBack','A user has joined');
    }
  })
})

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
