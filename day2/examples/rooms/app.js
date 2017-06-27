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
// Static assets
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index');
});

io.on('connection', function(socket) {
 socket.on('room',function(rm){
   socket.join(rm)
   socket.rm= rm;
   console.log('joined',rm)
 })

 socket.on('poke',function(pk){
   console.log('poked')
   io.sockets.in(socket.rm).emit('message','Room #'+socket.rm + 'has been poked')
 })



});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
