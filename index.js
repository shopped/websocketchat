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
	
	socket.emit('populateLobbies', lobbies, lobbies.map(function(lobby){return users[lobby].length}));
	
	socket.on('addLobby', function(name) {
		lobbies.push(name)
		users[name]=[]
		io.emit('populateLobbies', lobbies, lobbies.map(function(lobby){return users[lobby].length}))
	})
	var userLobby = "Undefined"
	socket.on('change room', function(name) {
		socket.join(name);
		userLobby = name;
	})
	//// ROOM FUNCTIONS
	var userName = "Unnamed"
	socket.on('username given', function(username, lobby) {
		userName = username;
		users[userLobby].push(userName)
		io.in(userLobby).emit('populate', users[userLobby]);
		io.emit('populateLobbies', lobbies, lobbies.map(function(lobby){return users[lobby].length}));
	})
	socket.on('bulletin', function(msg, lobby) {
		socket.to(lobby).broadcast.emit('bulletin', msg);
	})
	socket.on('message', function(msg, lobby) {
		socket.to(lobby).broadcast.emit('done typing', userName);
		socket.to(lobby).broadcast.emit('message', msg, userName);
	})
	socket.on('disconnect', function(socket){
		if (userName === "Unnamed")
			return
		io.to(userLobby).emit('bulletin', userName + ' has disconnected.');
		users[userLobby].splice(users[userLobby].indexOf(userName), 1);
		io.to(userLobby).emit('populate', users[userLobby]);
		io.emit('populateLobbies', lobbies, lobbies.map(function(lobby){return users[lobby].length}));
	})
	socket.on('starttyping', function(lobby) {
		socket.to(userLobby).broadcast.emit('started typing', userName);
	})
	socket.on('stoptyping', function(lobby) {
		socket.to(userLobby).broadcast.emit('done typing', userName);
	})
}

////// LISTEN ON PORT 3000

http.listen(3000, function() {
	console.log('Initialized on localhost:3000');
});