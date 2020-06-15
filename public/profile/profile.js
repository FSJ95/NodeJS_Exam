const fullUrl = window.location.href;
const username = fullUrl.substr(fullUrl.lastIndexOf("/") + 1);

var postList;

fetch(`/fetchuser/${username}`).then(function (response) {
  if (response.status !== 200) {
    console.log('There was a problem: ' + response.status);
    return;
  } else {
    response.json().then(function (data) {

      $('#profileUsername').text(data.username);
    });
  }
});

$.get(`/api/posts/user/${username}`, function (data) {
  postList = data;
  sortListByDate();
});