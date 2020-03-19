$(document).ready(function() {
    $(document).scroll(function() {
        var nav = $(".HomePageMain .navbar");
        nav.toggleClass('scrolled', $(this).scrollTop() > 50);
    });

    $('.selection').hide();
});

$(function() {
    $('#dropDownMenu').change(function() {
        $('.selection').hide();
        $('#' + $(this).val()).show();
        console.log($(this).val());
    });
});