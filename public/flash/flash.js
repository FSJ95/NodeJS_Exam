window.setTimeout(function () {
    if ($(".flashMessage").is(":visible")) {
        $(".flashMessage").fadeTo(500, 0).slideUp(500, function () {
            $(this).remove();
        });
    }
}, 4000);