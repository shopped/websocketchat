$(function() {
	//// SOCKET FUNCTIONS
	var socket = io();
	var clientLobbies = [];
	socket.on('populate', function(serverLobbies) {
		clientLobbies = serverLobbies;
		clientLobbies.forEach(function (lobby) {
			var row = $('<tr>');
			row.append($('<td>').text(lobby));
			$('#t').append(row);
		});
	});
	//// FRONTEND STUFF
	$('#create').click(function() {
		$('.modal').css('display', 'flex');
		$('#text').focus();
	});
	$('#modal-back').click(function() {
		$('.modal').css('display', 'none');
	});
	$('form').submit(function() {
		console.log('form submit');
		let x = $('#text').val();
		if (clientLobbies.indexOf(x) > -1) {
			alert("Lobby already exists");
		} else {
			clientLobbies.push(x);
			var row = $('<tr>');
			row.append($('<td>').text($('#text').val()));
			$('#t').append(row);
			$('.modal').css('display', 'none');
			socket.emit('addLobby', x);
		}
		return false;
	});
});