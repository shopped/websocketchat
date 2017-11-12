$(function () {
			var socket = io();
      var chatName = null;
      $('form').submit(function() {
        if (!chatName) {
          $('#b').html("Send");
          chatName = $('#m').val();
          socket.emit('username given', chatName)
          socket.emit('chat message', chatName + ' has connected.')
        } else {
          msg = (chatName +': '+ $('#m').val());
          $('#messages').append($('<li>').text(msg));
          socket.emit('chat message', msg);
        }
        $('#m').val('');
        return false;
      });
			socket.on('chat message', function(msg){
				$('#messages').append($('<li>').text(msg));
			});
      socket.on('populate', function(userlist){
        $('#users').empty();
        userlist.forEach(function(user) {
          $('#users').append($('<li>').text(user));
        });
      });
		});