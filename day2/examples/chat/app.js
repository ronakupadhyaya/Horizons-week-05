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

var port = process.env.PORT || 3000;

io.on('connection', function(socket){
  socket.on('message', function(msg) {
    console.log('getting msg from server ' + msg)
    if (socket.username) {
        io.to(socket.room).emit('serverMessage', msg, socket.username)
    }
  })
  socket.on('login', function(usr) {
    console.log(usr)
    console.log("socket room is " + socket.room)
    socket.username = usr
    socket.broadcast.to(socket.room).emit('joiinedroom', socket.username)
  })
  socket.on('room', function(room) {
    socket.room = room;
    socket.join(room);
  })
});

server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
