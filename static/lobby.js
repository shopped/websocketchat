$(function() {
	$('#create').click(function() {
		$('.modal').css('display', 'flex');
	});
	$('#modal-back').click(function() {
		$('.modal').css('display', 'none');
	});
	var lobbies = [];
	$('form').submit(function() {
		let x = $('#text').val();
		console.log(x);
		console.log(lobbies);
		if (lobbies.indexOf(x) > -1) {
			alert("Lobby already exists");
			return false;
		} else {
			lobbies.push(x);
			var row = $('<tr>');
			row.append($('<td>').text($('#text').val()));
			$('#t').append(row);
			$('.modal').css('display', 'none');
			return true;
		}
	});
});