var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();
var server = require('http').createServer(app);
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

//Server
io.on('connection', function(socket){
	socket.on('username', function(username){
		socket.username = username;
		
		socket.broadcast.emit('joinedroom', socket.username)
	})
	socket.on('message', function(msg){
		io.emit('serverMessage', socket.username + ' : ' + msg);
	})

});

app.get('/', function(req, res) {
  res.render('index');
});



var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
