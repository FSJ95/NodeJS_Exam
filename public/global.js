$(document).ready(function () {

    // Fetching session status
    fetch('/status').then(function (response) {
        if (response.status !== 200) {
            console.log('There was a problem: ' + response.status);
            return;
        } else {
            response.json().then(function (data) {

                // Showing/Hiding elements based on if the user is logged in.
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

                // Showing the logged in users info relevant places (Top right corner etc.).
                if (data.user) {
                    $('.currentUsername').text(data.user.username);
                }
            });
        }
    });

});

function generatePosts(list) {

    for (i = 0; i < postList.length; i++) {

        $('#post-wrapper').append(`<div class="post">
          <div class="row justify-content-md-center">
            <!-- POINTS -->
            <div class="col-md-auto post-points">
      
              <div class="voting">
                <a><i class="fas fa-chevron-up"></i></a>
                <span>${postList[i].points}</span>
                <a><i class="fas fa-chevron-down"></i></a>
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
    }

}

function sortListByPoints() {
    $('#post-wrapper').empty();
    $('.points-button').removeClass('btn-outline-secondary');
    $('.points-button').addClass('btn-secondary');
    $('.date-button').removeClass('btn-secondary');
    $('.date-button').addClass('btn-outline-secondary');
    generatePosts(postList.sort((a, b) => {
        return b['points'] - a['points'];
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