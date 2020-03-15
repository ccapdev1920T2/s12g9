$(document).ready(function() {
    $(document).scroll(function() {
        var nav = $("header .navbar");
        nav.toggleClass('scrolled', $(this).scrollTop() > 50);
    });

    var submit = $("#signIn");
    var password = $("#password");

    submit.click(function() {
        if ((email).val() == "") {
            email.css("border-color", "#8D1515");
            $("#email-error").html("<i>*Required field</i>");
        } else {
            email.css("border-color", "#eee");
            $("#email-error").html("");
        }

        if ((password).val() == "") {
            password.css("border-color", "#8D1515");
            $("#password-error").html("<i>*Required field</i>");
        } else {
            password.css("border-color", "#eee");
            $("#password-error").html("");
        }
    });
});