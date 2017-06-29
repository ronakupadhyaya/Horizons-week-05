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

app.get('/room1',function(req,res){
  res.render('room1')
})
app.get('/room2',function(req,res){
  res.render('room1')
})

var roomArr=[];
io.on('connection', function(socket) {
  socket.on('room',function(room){
    if(roomArr.indexOf(room)===-1){
      roomArr.push(room);
    }
    socket.join(room);

  })
  //emit to some room
  // io.to('some room').emit('some event');
  // io.sockets.in(room).emit('message', 'what is going on, party people?');

});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
