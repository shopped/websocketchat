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
      var url = window.location.href;
      var lobby = url.substring(url.lastIndexOf('/') + 1);
      socket.emit('change room', lobby)
      $('form').submit(function() {
          $('#modal-front').css("display", "none");
          $('#modal-back').css("display", "none");
          chatName = $('#n').val();
          socket.emit('bulletin', chatName + ' has connected.',lobby)
          socket.emit('username given', chatName, lobby)
          $('#m').val('');
          $('#m').focus();
          return false;
      });
      $('#s').click(function() {
          usr = chatName;
          msg = $('#m').val();
          user = $('<span>').text(usr + ' ');
          user.css('color', color);
          message = $('<span>').text(msg);
          $('#messages').append($('<li>').append(user).append(message));
          socket.emit('message', msg, lobby);
        $('#m').val('');
        return false;
      });
      $('#d').click(function() {
        let x = $('#d').text();
        $('#d').text(x !== 'Draw' ? 'Draw' : 'Erase')
        return false;
      });
			socket.on('message', function(msg, usr){
        user = $('<span>').text(usr + ' ');
        user.css('color', color);
        message = $('<span>').text(msg);
        $('#messages').append($('<li>').append(user).append(message));
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
        $('#users').append($('<li>').text(userlist.length));
        $('#users').append($('<li>').append($('<strong>').text(lobby)));
        userlist.forEach(function(user) {
          $('#users').append($('<li>').text(user));
        });
      });
      $('#m').on('input', function() {
        if (chatName) {
          if ($('#m').val()) {
            socket.emit("starttyping", chatName, lobby);
          } else {
            socket.emit("stoptyping", chatName, lobby);
          }
        }
      });
});