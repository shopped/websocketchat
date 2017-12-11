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

////// SOCKET.IO LOGIC

io.on('connection', onConnection);

function onConnection(socket) {
	/// LOBBY FUNCTIONS
	
	socket.emit('populateLobbies', lobbies);
	////going to use rooms instead of namespaces now
	////socket.emit('populateLobbies', lobbies.map(function(lobby){return lobby[0]}));
	
	socket.on('addLobby', function(name) {
		lobbies.push(name);
		socket.broadcast.emit('populateLobbies', lobbies);
		/////going to use rooms instead of namespaces now
		///var nsp = io.of('/'+name);
		///lobbies.push([name , nsp]);
		///socket.broadcast.emit('populateLobbies', lobbies.map(function(lobby){return lobby[0]}));
	})
	socket.on('change room', function(name) {
		socket.join(name);
		console.log("after",socket.adapter.rooms[name])
	})
	//// ROOM FUNCTIONS
	var userName = "Unnamed"
	socket.on('message', function(msg, lobby) {
		lobby.emit('done typing', userName);
		lobby.broadcast.emit('message', msg);
	})
	socket.on('bulletin', function(msg, lobby) {
		lobby.broadcast.emit('bulletin', msg);
	})
	socket.on('username given', function(username, lobby) {
		userName = username;
		users.push(userName);
		lobby.emit('populate', users);
		lobby.broadcast.emit('populate', users);
	})
	socket.on('disconnect', function(socket, lobby){
		if (userName === "Unnamed")
			return
		lobby.emit('bulletin', userName + ' has disconnected.');
		users.splice(users.indexOf(userName), 1);
		lobby.emit('populate', users);
	})
	socket.on('starttyping', function(lobby) {
		lobby.emit('started typing', userName);
	})
	socket.on('stoptyping', function(lobby) {
		lobby.emit('done typing', userName);
	})
}

////// LISTEN ON PORT 3000

http.listen(3000, function() {
	console.log('Initialized on localhost:3000');
});