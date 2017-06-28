var express = require('express');
var app = express();
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
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

io.on('connection', function(socket){     //This socket represents the one on the client side
  socket.on('login', function(username){
  if(!socket.username){
    socket.username = username;
    // console.log("username", socket.username);
    socket.emit('selfJoin', socket.username);
    socket.broadcast.emit('joinedRoom', socket.username);
  }
  })
  socket.on('message', function(msg){
    console.log('Server received msg: ', msg);
    io.emit('serverMessage', socket.username + ' said: ' + msg)
  })
})

var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
