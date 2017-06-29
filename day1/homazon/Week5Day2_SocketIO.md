Week 5 Day 2  Socket.IO
- is a wrapper around an existing technology called Web Sockets
- web sockets allow you to send data between client and web server

Web Socket: How it works
Step 1. Handshake
	Establishing a connection (Client sends something to the server and server sends acknowledgement back)

Now bi-directional messages established: client AND server can send requests without waiting for initial request

If one side closes the connection, the connection is closed

Why care about them?
- real time bidirectional data flow(Twitter feeds, chat applications)

Websockets EMIT and LISTEN for events 