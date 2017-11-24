function getColor() {
  var letters = '0123456789AB'
  var color = '#'
  for (var i=0; i<6; i++){
    color += letters[Math.floor(Math.random() * 12)]
  }
  return color;
}

$(function () {
			var socket = io();
      var chatName = null;
      var color = getColor();
      $('form').submit(function() {
        if (!chatName) {
          $('#b').html("Send");
          chatName = $('#m').val();
          socket.emit('username given', chatName)
          socket.emit('bulletin', chatName + ' has connected.')
        } else {
          usr = $('<span>').text(chatName + ': ');
          msg = $('<span>').text($('#m').val());
          $('#messages').append($('<li>').append(usr).append(msg));
          socket.emit('message', msg);
        }
        $('#m').val('');
        return false;
      });
			socket.on('message', function(msg){
				$('#messages').append($('<li>').text(msg));
			});
      socket.on('bulletin', function(msg){
        let b = $('<li>').text(msg);
        b.css('color', 'gray');
        $('#messages').append(b);
      })
      socket.on('started typing', function(user){
        if ($('#'+user).length === 0) {
          var x = $('<li>').text(user + ' is typing...');
          x.attr('id', user);
          $('#messages').append(x);
          $('#'+user).hide();
          $('#'+user).fadeIn();
        }
      });
      socket.on('done typing', function(user){
        if ($('#'+user).length !== 0) {
            $('#'+user).remove();
        }
      });
      socket.on('populate', function(userlist){
        $('#users').empty();
        userlist.forEach(function(user) {
          $('#users').append($('<li>').text(user));
        });
      });
      $('#m').on('input', function() {
        if (chatName) {
          if ($('#m').val()) {
            socket.emit("starttyping", chatName );
          } else {
            socket.emit("stoptyping", chatName );
          }
        }
      });
});