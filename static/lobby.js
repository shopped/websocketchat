$(function() {
	//// IMPORTANT OBJECTS
	var socket = io();
	//// HELPER FUNCTIONS
	function clearLobby() {
		$('#t').empty();
		$('#t').append($('<li>').append($('<strong>').text("Public Lobbies")));
	}
	function createLobbyEntry(name, num) {
		let item = $('<li>');
		let link = $('<a>').text(name).attr('href', name);
		let pop = $('<em>').text(num).attr('id', name);
		item.append(link);
		item.append('\t');
		item.append(pop);
		link.click(function() {
			socket.emit("change room", name)
			return true;
		});
		$('#t').append(item);
	}
	//// SOCKET FUNCTIONS
	var clientLobbies = [];
	socket.on('populateLobbies', function(serverLobbies, userList) {
		clientLobbies = serverLobbies;
		console.log(serverLobbies, userList)
		clearLobby();
		clientLobbies.forEach(function (lobby, index) {
			createLobbyEntry(lobby, userList[index]);
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
		$('#text').val('')
		if (clientLobbies.indexOf(x) > -1) {
			alert("Lobby already exists");
		} else {
			clientLobbies.push(x);
			createLobbyEntry(x, 0);
			$('.modal').css('display', 'none');
			socket.emit('addLobby', x);
		}
		return false;
	});
});