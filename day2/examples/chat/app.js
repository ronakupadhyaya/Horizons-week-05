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

io.on('connection', function(socket){
  socket.on('message', function(message) {
    console.log(socket.username)
    // socket.broadcast.emit('joinedroom', socket.username)
    io.emit('serverMessage1', socket.username + ": " + message)

    //io.emit send to everyone including yourself
    // socket.emit send to hjust myself
    // socket.broadcast.emit send to eveyone except myself
  })
  socket.on('Login', function(username) {
    socket.username = username
    console.log(socket.username)
  })
});


app.get('/', function(req, res) {
  res.render('index');
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
