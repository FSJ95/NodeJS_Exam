const fullUrl = window.location.href;
const recieverId = fullUrl.substr(fullUrl.lastIndexOf("/") + 1);
var socket;

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

        if (recieverId) {
            if (parseInt(recieverId) === data[i].id) {
                $('.chat .titleUsername').text(data[i].username);
                $('.right .avatar').attr('src', '/' + data[i].avatar)
                $('.chat #recieverID').val(recieverId);
            }

        }
    }
});

if (recieverId) {
    $.get(`/api/messages/${recieverId}`, function (data) {
        console.log(data);

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

        }
    });

    $.get('/api/status', function (status) {

        socket = io.connect("localhost:9090");

        socket.on('connect', function (data) {
            socket.emit('saveConnection', {
                userID: status.user.id
            });
        });

        socket.on("recieveMessage", data => {
            console.log(data);
            if (data.senderID == user.id) {

                $('.message-wrapper').append(`<div class="col-md-12" style="text-align:right;">
                <span>${data.message}</span> <span><b class="sender-username">(${data.senderID})</b></span>
              </div>`)

            } else {
                $('.message-wrapper').append(`<div class="col-md-12">
                <span><b class="receiver-username">(${data.senderID})</b></span> <span>${data.message}</span>
              </div>`)

            }
        });
    });
}

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
        $.post('/api/messages/send', {
            message: $('.chat #message').val(),
            recieverID: $('.chat #recieverID').val()
        });

        socket.emit("sendMessage", {
            message: $('.chat #message').val(),
            senderID: user.id,
            recieverID: $('.chat #recieverID').val()
        });

        cleanMessageField();
    }
}

scrollDown();