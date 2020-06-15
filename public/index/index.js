var postList;

$.get('/api/posts', function (data) {
    postList = data;
    sortListByDate();
});