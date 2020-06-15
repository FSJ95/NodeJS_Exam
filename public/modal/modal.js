// Bootstrap show event.
$('#createPostModal').on('show.bs.modal', function (event) {
    const fullUrl = window.location.href;
    const category = fullUrl.substr(fullUrl.lastIndexOf("/") + 1);

    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    $.get(`/api/categories`, function (data) {
        for (var i = 0; i < data.length; i++) {
            if (category === data[i].category) {
                $('#createPostModal #category').append(`<option selected="selected" value="${data[i].id}">${data[i].category}</option>`);
                $('#createPostModal form').append(`<input type="hidden" name="category" value="${data[i].id}" />`);
                $('#createPostModal #category').attr("disabled", true);
            } else {
                $('#createPostModal #category').append(`<option value="${data[i].id}">${data[i].category}</option>`);
            }

        }
    });
})