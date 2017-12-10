var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));

io.on('connection', onConnect); 
var users = [];
var lobbies = [];

///// EXPRESS URL ROUTING

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/lobby.html');
});

app.post('/', function(req, res) {
	lobbies.push(req.body.text);
});

app.get('/chat', function(req, res) {
	res.sendFile(__dirname + '/chatroom.html');
});

////// WEBSOCKETS LOGIC

function onConnect(socket) {
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