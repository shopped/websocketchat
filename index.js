var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('static'));

var users = [];
var lobbies = ["Default"];

///// EXPRESS URL ROUTING

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/lobby.html');
});

app.get('/*?', function(req, res) {
	res.sendFile(__dirname + '/chatroom.html');
});

////// WEBSOCKETS LOGIC

io.on('connection', onLobby); 

function onLobby(socket) {
	socket.emit('populate', lobbies)
	socket.on('addLobby', function(lob) {
		lobbies.push(lob);
	})
}

function onRoom(socket) {
	var userName = "Unnamed"
	socket.on('message', function(msg) {
		io.emit('done typing', userName);
		socket.broadcast.emit('message', msg);
	})
	socket.on('bulletin', function(msg) {
		socket.broadcast.emit('bulletin', msg);
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
		io.emit('bulletin', userName + ' has disconnected.');
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

////// LISTEN ON PORT 3000

http.listen(3000, function() {
	console.log('Initialized on localhost:3000');
});