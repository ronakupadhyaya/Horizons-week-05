var express = require('express')
var app = express()
//how we can create an application in express AND have a server socket listening from the server side
var server = require('http').createServer(app)
var io = require('socket.io')(server)

//able to serve HTML files from here
app.use(express.static('public'));

//listen for an event and attach an event listener to that event
//when the server socket (io) receives a connection event, we are going to respond with function(socket)
//THIS socket is a very specific socket that represents the client
io.on('connection', function(socket){
	socket.on('message', function(msg){
		if(!socket.username){
			socket.username = msg;
			//everyone but the one that emitted the event
			socket.broadcast.emit('joinedroom', socket.username)
		} else{
			//only works for that specific socket
			//socket.emit('serverMessage', 'Server received your message: ' + msg)
			//io makes it so that every socket get it
			io.emit('serverMessage', socket.username + ' said: ' + msg)
		}
		

		
	})
})

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

//usually we did app.listen. This time the server is on port 3000
server.listen(3000)