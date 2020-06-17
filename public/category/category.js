const fullUrl = window.location.href;
const category = fullUrl.substr(fullUrl.lastIndexOf("/") + 1);

sortList('category', 'date');

$.get(`/api/posts/category/${category}`, function (data) {
  $('.category-title').text(category);
});