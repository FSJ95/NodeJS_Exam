const fullUrl = window.location.href;
const recieverId = fullUrl.substr(fullUrl.lastIndexOf("/") + 1);
var socket;

// Fetches all users and draws the users in the chat.
$.get('/api/users', (data) => {
    for (i = 0; i < data.length; i++) {
        // Ikke nødvendligt hvis friends implementeres
        if (data[i].id !== user.id) {
            $('.chat .user-wrapper').append(`<a class="row user rounded" href="/chat/${data[i].id}">
            <div class="col-md-auto">
              <center>
                <img src="/${data[i].avatar}" alt="avatar" class="avatar border rounded-circle border-dark">
                <span class="messageUsername">${data[i].username}</span>
              </center>
            </div>
          </a>`);
        };

        // If a chat user is clicked.
        if (recieverId) {
            // Change the chatwindow to the current user.
            if (parseInt(recieverId) === data[i].id) {
                $('.chat .titleUsername').text(data[i].username);
                $('.right .avatar').attr('src', '/' + data[i].avatar)
                $('.chat #recieverID').val(recieverId);
            }

            // Fetch all the messages with current user.
            $.get(`/api/messages/${recieverId}`, function (data) {

                for (i = 0; i < data.length; i++) {

                    if (parseInt(recieverId) == data[i].recieverId) {

                        $('.message-wrapper').append(`<div class="col-md-12" style="text-align:right;">
                        <span>${data[i].message}</span> <span><b class="sender-username">(${data[i].sender[0].username})</b></span>
                      </div>`)


                    } else {
                        $('.message-wrapper').append(`<div class="col-md-12">
                        <span><b class="receiver-username">(${data[i].sender[0].username})</b></span> <span>${data[i].message}</span>
                      </div>`)


                    }

                    scrollDown();

                }
            });

            // Start up the sockets
            $.get('/api/status', function (status) {

                socket = io.connect("13.48.70.165:9090");

                // Send logged in userID and Username when socket is connected.
                socket.on('connect', function (data) {
                    socket.emit('saveConnection', {
                        userID: status.user.id,
                        username: status.user.username
                    });
                });

                // When a message is recieved create it in the chat window.
                socket.on("recieveMessage", data => {
                    if (data.senderID == user.id) {

                        $('.message-wrapper').append(`<div class="col-md-12" style="text-align:right;">
                        <span>${data.message}</span> <span><b class="sender-username">(${data.senderUsername})</b></span>
                      </div>`)

                    } else {
                        $('.message-wrapper').append(`<div class="col-md-12">
                        <span><b class="receiver-username">(${data.senderUsername})</b></span> <span>${data.message}</span>
                      </div>`)

                    }

                    scrollDown();
                });
            });
        }
    }
});

// Get rid of typed message when sent
function cleanMessageField() {
    $('.chat #message').val('');

}

// Scroll to the bottom of the messages.
function scrollDown() {
    $(".chat .messages").scrollTop($(".chat .messages")[0].scrollHeight);
};

// Function for sending message
function sendMessage() {
    if ($('.chat #message').val() && $('.chat #recieverID').val()) {

        // Saves the message to the database.
        $.post('/api/messages/send', {
            message: $('.chat #message').val(),
            recieverID: $('.chat #recieverID').val()
        });

        // Sends the message to the socket.
        socket.emit("sendMessage", {
            message: $('.chat #message').val(),
            senderID: user.id,
            senderUsername: user.username,
            recieverID: $('.chat #recieverID').val()
        });

        cleanMessageField();
    }
}