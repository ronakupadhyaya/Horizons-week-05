var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();

// Socket.io
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){

	socket.on('room', function(newroom) {
		socket.leave(socket.room);
		socket.room = newroom;
		socket.join(newroom);
		console.log("Joined room: " + newroom);
	})
	socket.on('newMessage', function(msg) {
		console.log('Server recieved message: ' + msg);
		if (socket.username) {
			io.sockets.in(socket.room).emit('serverMessage', socket.username + ": " + msg);
		}
		else {
			console.log('Must create new user first');
			socket.emit('warningMessage', "Please create a username first");
		}
	});
	socket.on('newUsername', function(username) {
		console.log('Server set new username: ' + username);
		if (username !== '') {
			socket.username = username;
			io.emit('serverUsername', username);
			socket.emit('welcomeUser', username);
			socket.broadcast.in(socket.room).emit('joinedRoom', username);
		}
		else {
			console.log('Username cannot be empty');
			socket.emit('warningMessage', "Username cannot be empty");
		}
	})
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
