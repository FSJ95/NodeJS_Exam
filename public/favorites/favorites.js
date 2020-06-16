var postList;

$.get('/api/posts/favorites', function (data) {
    postList = data;
    console.log(data)
    sortListByDate();
});