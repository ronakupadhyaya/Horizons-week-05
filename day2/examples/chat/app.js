var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();

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
  console.log('connected user!');

  socket.on('userName', function(userName) {
    console.log(userName);
    socket.username = userName;
    socket.loggedIn = true;
    socket.name = userName;
    socket.emit('usernameSet', socket);
  })


  socket.on('message', function(msg) {
    console.log('Message:', msg);
    io.emit('msgFlow', msg)
  })

});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
