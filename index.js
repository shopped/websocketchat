var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('static'));

var users = [];
var lobbies = [];

///// EXPRESS URL ROUTING

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/lobby.html');
});

app.get('/*?', function(req, res) {
	res.sendFile(__dirname + '/chatroom.html');
});

////// WEBSOCKETS LOGIC

io.on('connection', onConnection);

function onConnection(socket) {
	onLobby(socket);
}

function onLobby(socket) {
	socket.emit('populateLobbies', lobbies.map(function(lobby){return lobby[0]}));
	
	socket.on('addLobby', function(name) {
		var nsp = io.of('/'+name);
		lobbies.push([name , nsp]);
		socket.broadcast.emit('populateLobbies', lobbies.map(function(lobby){return lobby[0]}));
	})
	socket.on('change room', function(name) {
		socket.join(name);
		console.log("after",socket.adapter.rooms[name])
	})

	var userName = "Unnamed"
		
	socket.on('message', function(msg, lobby) {
		socket.emit('done typing', userName);
		socket.broadcast.emit('message', msg);
	})
	socket.on('bulletin', function(msg, lobby) {
		socket.broadcast.emit('bulletin', msg);
	})
	socket.on('username given', function(username, lobby) {
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
	socket.on('starttyping', function(lobby) {
		socket.emit('started typing', userName);
	})
	socket.on('stoptyping', function(lobby) {
		socket.emit('done typing', userName);
	})
}

////// LISTEN ON PORT 3000

http.listen(3000, function() {
	console.log('Initialized on localhost:3000');
});