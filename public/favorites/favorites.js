var postList;

$.get('/api/posts/favorites', function (data) {
    postList = data;
    sortListByDate();
});