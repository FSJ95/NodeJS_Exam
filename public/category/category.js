const fullUrl = window.location.href;
const category = fullUrl.substr(fullUrl.lastIndexOf("/") + 1);

var postList;

$.get(`/api/posts/category/${category}`, function (data) {
  postList = data;
  sortListByDate();
  $('.category-title').text(category);
});