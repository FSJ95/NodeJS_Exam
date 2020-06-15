var loggedIn = false;
var user;
$.get('/status', function (data) {
    user = data.user;
    loggedIn = data.isLoggedIn;

    if (data.isLoggedIn) {
        $('.isLoggedIn').show();

    } else {
        $('.isNotLoggedIn').show();
    }

    // Showing flash messages is any is included in the session status.
    if (data.flashMessage) {
        $('.flashMessage').addClass('alert-' + data.flashMessage.type);
        $('#flashMessageType').text(data.flashMessage.type + '!');
        $('#flashMessageMessage').text(data.flashMessage.message);
        $('.flashMessage').show();
    }

    if (data.user) {
        user = data.user;
        $('.currentUsername').text(data.user.username);
    }
});

// GIVE OR TAKE POST POINTS
// Think about cleaning up this shitshow xD
function likePost(elem, postID) {
    // SET TO loggedIn
    if (loggedIn) {
        if ($(elem).css("color") === "rgb(0, 128, 0)") {
            $('#post-' + postID + '-points').text((parseInt($('#post-' + postID + '-points').text()) - 1));
            $(elem).css({
                "color": "black",
            });
            $(elem).find('svg').remove();
            $(elem).append('<i class="fas fa-chevron-up like' + postID + '"></i>');
        } else {
            $.post('/api/posts/like/' + postID);
            $('#post-' + postID + '-points').text((parseInt($('#post-' + postID + '-points').text()) + 1));

            // Change green
            $(elem).css({
                "color": "green",
            });
            $(elem).find('svg').remove();
            $(elem).append('<i class="fas fa-chevron-circle-up like' + postID + '"></i>');

            // Change red if clicked
            if ($('.voting .dislike-button' + postID).css("color") === "rgb(255, 0, 0)") {
                $('#post-' + postID + '-points').text((parseInt($('#post-' + postID + '-points').text()) + 1));
                $('.voting .dislike-button' + postID).css({
                    "color": "black",
                });
                $('.voting .dislike' + postID).remove();
                $('.voting .dislike-button' + postID).append('<i class="fas fa-chevron-down dislike' + postID + '"></i>');
            }
        }
    }
}

function dislikePost(elem, postID) {

    // SET TO loggedIn
    if (true) {
        if ($(elem).css("color") === "rgb(255, 0, 0)") {
            $('#post-' + postID + '-points').text((parseInt($('#post-' + postID + '-points').text()) + 1));
            $(elem).css({
                "color": "black",
            });
            $(elem).find('svg').remove();
            $(elem).append('<i class="fas fa-chevron-down dislike"></i>');
        } else {
            $.post('/api/posts/dislike/' + postID);
            $('#post-' + postID + '-points').text((parseInt($('#post-' + postID + '-points').text()) - 1));

            // Change red
            $(elem).css({
                "color": "red",
            });
            $(elem).find('svg').remove();
            $(elem).append('<i class="fas fa-chevron-circle-down dislike' + postID + '"></i>');

            // Change green if clicked
            if ($('.voting .like-button' + postID).css("color") === "rgb(0, 128, 0)") {
                $('#post-' + postID + '-points').text((parseInt($('#post-' + postID + '-points').text()) - 1));
                $('.voting .like-button' + postID).css({
                    "color": "black",
                });
                $('.voting .like' + postID).remove();
                $('.voting .like-button' + postID).append('<i class="fas fa-chevron-up like' + postID + '"></i>');

            }
        }
    }
}


// POST GENERATION
function generatePosts(list) {

    for (i = 0; i < postList.length; i++) {

        var points = 0;

        for (j = 0; j < postList[i].points.length; j++) {
            points = points + postList[i].points[j].points;
        }
        console.log(points)


        $('#post-wrapper').append(`<div class="post">
          <div class="row justify-content-md-center">
            <!-- POINTS -->
            <div class="col-md-auto post-points">
      
              <div class="voting">
                <a onclick="likePost(this, ${postList[i].id})" class="like-button${postList[i].id}"><i class="fas fa-chevron-up like${postList[i].id}"></i></a>
                <span id="post-${postList[i].id}-points">${points}</span>
                <a onclick="dislikePost(this, ${postList[i].id})" class="dislike-button${postList[i].id}"><i class="fas fa-chevron-down dislike${postList[i].id}"></i></a>
              </div>
      
            </div>
            <!-- CONTENT -->
            <div class="col-11 post-content border rounded">
              <div class="row post-title">
                <h5>${postList[i].title}<a href="/category/${postList[i].category.category}"><span class="badge badge-primary post-category">${postList[i].category.category}</span></a></h5>
              </div>
              <div class="row post-text">
              ${postList[i].content}
              </div>
              <hr>
              <!-- FOOTER -->
              <div class="row justify-content-between post-footer">
                <div class="col-md-auto">
                    <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-2.jpg" alt="avatar" class="avatar border rounded-circle border-dark">
                    <span class="post-footer-text">Posted by</span>  
                    <a href="/profile/${postList[i].user.username}"><span class="username text-primary">${postList[i].user.username}</span>  </a>
                  
                </div>
                <div class="col-md-auto">
                  <span class="post-footer-text">${parseDate(postList[i].createdAt)}</span> 
                </div> 
                
              </div>
            </div>
          </div>
        </div>`);

        if (loggedIn) {
            for (j = 0; j < postList[i].points.length; j++) {
                var postID = postList[i].id

                if (user.id === postList[i].points[j].userId) {
                    if (postList[i].points[j].points === 1) {
                        $('.voting .like-button' + postID).css({
                            "color": "green",
                        });
                        $('.voting .like' + postID).remove();
                        $('.voting .like-button' + postID).append('<i class="fas fa-chevron-circle-up like' + postID + '"></i>');

                    } else if (postList[i].points[j].points === -1) {
                        $('.voting .dislike-button' + postID).css({
                            "color": "red",
                        });
                        $('.voting .dislike' + postID).remove();
                        $('.voting .dislike-button' + postID).append('<i class="fas fa-chevron-circle-down dislike' + postID + '"></i>');
                    }
                }
            }
        }

    }
}

function sortListByPoints() {
    $('#post-wrapper').empty();
    $('.points-button').removeClass('btn-outline-secondary');
    $('.points-button').addClass('btn-secondary');
    $('.date-button').removeClass('btn-secondary');
    $('.date-button').addClass('btn-outline-secondary');
    generatePosts(postList.sort((a, b) => {
        return b['totalPoints'] - a['totalPoints'];
    }));
}

function sortListByDate() {
    $('#post-wrapper').empty();
    $('.date-button').removeClass('btn-outline-secondary');
    $('.date-button').addClass('btn-secondary');
    $('.points-button').removeClass('btn-secondary');
    $('.points-button').addClass('btn-outline-secondary');
    generatePosts(postList.sort((a, b) => {
        return b['createdAt'] > a['createdAt'];
    }));
}

function parseDate(dateString) {
    d = dateString.split(/[- T . :]/);
    return `${d[3]}:${d[4]}:${d[5]} ${d[2]}/${d[1]}/${d[0]}`;
}