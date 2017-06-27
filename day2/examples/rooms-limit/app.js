var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var r = 1;
var curr = 0;

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

io.on('connection', function(socket) {
  socket.on('join', function() {
    var room = null;
    if (curr < 2) {
      console.log("space left");
      curr++;
    } else {
      console.log("no space, create new room");
      r++;
      curr=1;
    }
    socket.join(r);
    socket.emit('joined', r);
    console.log('emitted joineds');
  });
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
