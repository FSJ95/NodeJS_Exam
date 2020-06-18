const fullUrl = window.location.href;
const username = fullUrl.substr(fullUrl.lastIndexOf("/") + 1);

sortList('profile', 'date');

$.get(`/api/users/${username}`, function (data) {
  $('#profileUsername').text(data.username);
  $('#profileAvatar').attr('src', '/' + data.avatar);
  $('#profileCreated').text(parseDate(data.createdAt, false));
  $('.chatButton').attr('href', `/chat/${data.id}`);
});

$.get(`/api/posts/user/${username}`, function (data) {
  $.get('/api/status', (status) => {
    var postCount = 0;
    var pointCount = 0;
    for (i = 0; i < data.length; i++) {
      postCount += 1;
      for (j = 0; j < data[i].points.length; j++) {
        pointCount += data[i].points[j].points;
      }

    }
    $('#profilePosts').text(postCount);
    $('#profilePoints').text(pointCount);

    if (status.user.username === username) {
      $('.ownProfileRemove').remove();
      $('.ownProfileShow').show();

    };
  });

});