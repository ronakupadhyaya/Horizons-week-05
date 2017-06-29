var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();

var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', (socket) => {
	console.log('established connection');

	socket.on('newUser', function(username) {
		socket.username = username;
		socket.broadcast.emit('joinedRoom', username + ' has joined the room.');
	})
	
	socket.on('newMessage', function(data) {
		console.log(data);
		if (socket.username) {
			io.emit('appendMessage', socket.username + ": " + data + '\n');
		}
	})
})

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
