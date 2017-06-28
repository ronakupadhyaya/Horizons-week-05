var express = require('express');
var app = express();

// include 'http' from node and call the method createServer() on app
var server = require('http').createServer(app);
// include 'socket.io' from node and create and io object by passing in our server
var io = require('socket.io')(server)

// This allows us to applicaiton that has a server socket that is listening on the server side


// Now we make you we 'use' the public directory as a static directory that allows you to serve html files from here
app.use(express.static('public'))

// this line must be after var io = require('socket.io')(server)
// the on method indicates that we are going to listen for events and attach an event listener to that events
// so in this case when our server socket, our var io, recieves a 'connection' event, we re going to respond with this function
// When there is an connection we are able to execute the code in the event handler (the function). We have the server socket(var io)
// which listens for events using the on method that takes in 2 paramaters - the name of the event and the event handler associated with that event


// LISTENING FOR EVENT EMIITTED FROM THE CLIENT SIDE
io.on('connection', function(socket){ // this 'socket' represents the client - (one browser tab)
  // the socket passed into the function is the specific socket (object) on the client side
  // the socket arguments allows us to listen for events that are emitted by the client
  // has a pair on the client side(index.html) called socket.emit('newEvent') that is going to emit an event to the server side

  socket.on('newEvent', function(){
    console.log("a new event has been emitted ");
  });

  console.log("a new client has connected!");

  // sending a message that is written on the client side (that was passed in data as the second argument of socket.emit)
  socket.on('specificMessage', function(data){
    console.log(data);
  });

  // sending a message written in the 'message' input field
  socket.on('message', function(msg){
    console.log(msg);
  });

  // Now we want to be able to EMIT EVENTS TO BE LISTENED ON THE CLIENT SIDE

  // Emitting an event to the client side letting them know we received their message (msg)
  // pair on client side: 'socket.on('serverMessage', function(serverMessage){})'
  socket.on('message', function(msg){
    console.log(msg);
    socket.emit('serverMessage', 'Server received your message: ' + msg)
  });

  // by using io.on instead of socket.on all tabs will recieve the messages
  // socket referred to a very specific socket that we specified when establishing our connection
  // io.on('connection', function(socket){});
  // io says when we change socket.emit to io.emit we are not sending messages to all websockets that are connected instead of a specfic one
  socket.on('message', function(msg){
    console.log(msg);
    io.emit('serverMessage', 'Server received your message: ' + msg)
  });

});




// when we get the '/' route the index.html file will be sent
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
});


// notice how it is not app.listen (which is internal)

// But because we want to use io we needed to create the server and io separtely
server.listen(3000);

//  We need socket.io and jquery on our html page you can get this from cdnjs.com

// We need socket.io on both the client side and the server side because there are 2 websockets, one that sits on the client side (browser) and one on the server side

// This gives us a bidirectional flow, the browser can send data to our server and the server can send data to the browser using the 2 websockets over the socket connection

// web socket 1 : listens to event on the server side
// web socket 2 : listens to event on the client side

// Both these web sockets can listen and emit events
