$(function() {
	//// HELPER FUNCTIONS
	function createLobbyEntry(name) {
		let row = $('<tr>');
		let item = $('<td>');
		let link = $('<a>').text(name).attr('href', name);
		row.append(item.append(link));
		$('#t').append(row);
	}
	//// SOCKET FUNCTIONS
	var socket = io();
	var clientLobbies = [];
	socket.on('populate', function(serverLobbies) {
		clientLobbies = serverLobbies;
		clientLobbies.forEach(function (lobby) {
			createLobbyEntry(lobby);
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
		let x = $('#text').val();
		if (clientLobbies.indexOf(x) > -1) {
			alert("Lobby already exists");
		} else {
			clientLobbies.push(x);
			createLobbyEntry(x);
			$('.modal').css('display', 'none');
			socket.emit('addLobby', x);
		}
		return false;
	});
});