$(function() {
	$('#create').click(function() {
		$('.modal').css('display', 'flex');
	});
	$('#modal-back').click(function() {
		$('.modal').css('display', 'none');
	});

	$('form').submit(function() {
		var row = $('<tr>');
		row.append($('<td>').text($('#text').val()));
		$('#t').append(row);
		$('.modal').css('display', 'none');
		return false;
	});
});