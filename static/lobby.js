$(function() {
	//// IMPORTANT OBJECTS
	var socket = io();
	//// HELPER FUNCTIONS
	function createLobbyEntry(name) {
		let row = $('<tr>');
		let item = $('<li>');
		let link = $('<a>').text(name).attr('href', name);
		item.append(link);
		link.click(function() {
			socket.emit("change room", name)
			return true;
		});
		row.append(item);
		$('#t').append(row);
	}
	//// SOCKET FUNCTIONS
	var clientLobbies = [];
	socket.on('populateLobbies', function(serverLobbies) {
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