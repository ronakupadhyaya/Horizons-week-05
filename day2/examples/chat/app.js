var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();
// allow for socket.io
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){
  // listen for message event
  socket.on('message', function(msg){
    console.log(msg);
    // reply with a mimic of the same reply
    io.emit('message', msg);
  });
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
