$(document).ready(function() {
    $(document).scroll(function() {
        var nav = $(".HomePageMain .navbar");
        nav.toggleClass('scrolled', $(this).scrollTop() > 50);
    });
});