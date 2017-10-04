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

io.on('connection', function(socket) {
  if(!io.rooms){
    io.roomNum=0;
    io.rooms = {};
  }
  if(io.rooms[`${io.roomNum}`] && io.rooms[`${io.roomNum}`]===1){
    io.rooms[`${io.roomNum}`]++;
  }
  else{
    io.roomNum++;
    io.rooms[`${io.roomNum}`]=1;
  }
  socket.join(io.roomNum);
  socket.emit('setRoom',io.roomNum);
});

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
