// Fetches categories then draws the sidebar.
$.get('/api/categories', function (data) {
    for (var i = 0; i < data.length; i++) {
        if (i < data.length - 1) {
            $('#category-wrapper').append(`<a href="/category/${data[i].category}" id="${data[i].category}Button" class="nav-link category-link">
            <center> ${data[i].category} </center> </a>`);
        } else {
            $('#category-wrapper').append(`<a href="/category/${data[i].category}"  id="${data[i].category}Button" class="nav-link category-link rounded-bottom">
            <center> ${data[i].category} </center> </a>`);
        }
    }
    $('#sidebarCategoriesButton').append(`<i class="fas fa-caret-right push-right"></i>`);
    $('#category-wrapper').hide();
    drawSidebar();
});

// Function for toggeling the categoy sidebar menu.
function toggleCategoriesMenu() {
    if ($('#category-wrapper').is(":hidden") == true) {
        $('#category-wrapper').show();
        $('#sidebarCategoriesButton .fa-caret-right').remove();
        $('#sidebarCategoriesButton .fa-caret-down').remove();
        $('#sidebarCategoriesButton').append(`<i class="fas fa-caret-down push-right"></i>`);
        $('#sidebarCategoriesButton').addClass('open');
    } else {
        $('#category-wrapper').hide();
        $('#sidebarCategoriesButton .fa-caret-down').remove();
        $('#sidebarCategoriesButton .fa-caret-right').remove();
        $('#sidebarCategoriesButton').append(`<i class="fas fa-caret-right push-right"></i>`);
        $('#sidebarCategoriesButton').removeClass('open');
    }
}

// Change the sidebar item to be active according to the right pathname.
function drawSidebar() {
    var pathname = window.location.pathname;
    var path = pathname.split('/');
    console.log(path);
    switch (path[1]) {
        case 'category':
            $('#sidebarCategoriesButton').addClass('open');
            $('#category-wrapper').show();
            $('#sidebarCategoriesButton .fa-caret-right').remove();
            $('#sidebarCategoriesButton .fa-caret-down').remove();
            $('#sidebarCategoriesButton').append(`<i class="fas fa-caret-down push-right"></i>`);
            $(`#${path[2]}Button`).addClass('active');
            break;
        case 'favorites':
            $('#sidebarFavoritesButton').addClass('active');
            break;
        case 'profile':
            $('#sidebarProfileButton').addClass('active');
            break;
        case 'settings':
            $('#sidebarSettingsButton').addClass('active');
            break;
        default:
            $('#sidebarHomeButton').addClass('active');
            break;
    }
}