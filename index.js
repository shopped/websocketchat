var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('static'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/lobby.html');
});

app.get('/chat', function(req, res) {
	res.sendFile(__dirname + '/chatroom.html');
});

io.on('connection', onConnect); 
var users = [];

function onConnect(socket) {
	var userName = "Unnamed"
	socket.on('chat message', function(msg) {
		socket.broadcast.emit('chat message', msg);
		io.emit('done typing', userName);
	})
	socket.on('username given', function(username) {
		userName = username;

		users.push(userName);
		socket.emit('populate', users);
		socket.broadcast.emit('populate', users);
	})
	socket.on('disconnect', function(socket){
		if (userName === "Unnamed")
			return
		io.emit('chat message', userName + ' has disconnected.');
		users.splice(users.indexOf(userName), 1);
		io.emit('populate', users);
	})
	socket.on('starttyping', function() {
		io.emit('started typing', userName);
	})
	socket.on('stoptyping', function() {
		io.emit('done typing', userName);
	})
}

http.listen(3000, function() {
	console.log('Initialized on localhost:3000');
});