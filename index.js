var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	var userName = "Unnamed"
	socket.on('chat message', function(msg) {
		io.emit('chat message', msg);
	})
	socket.on('username given', function(username) {
		userName = username
	})
	socket.on('disconnect', function(socket){
		io.emit('chat message', userName + ' has disconnected.');
		console.log('a user disconnected');
	})
});

http.listen(3000, function() {
	console.log('INIT');
});
