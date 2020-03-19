$(document).ready(function() {
    $(document).scroll(function() {
        var nav = $("header .navbar");
        nav.toggleClass('scrolled', $(this).scrollTop() > 50);
    });

    var submit = $("#signUp");
    var firstName = $("#firstName");
    var lastName = $("#lastName");
    var email = $("#email");
    var password = $("#password");
    var confirm = $("#confirmPassword");

    submit.click(function(e) {

        if ((firstName).val() === "") {
            requiredField(firstName);
        } else {
            reset("#firstName-error", firstName);
        }

        if ((lastName).val() == "") {
            requiredField(lastName);
        } else {
            reset("#lastName-error", lastName);
        }

        if ((email).val() == "") {
            requiredField(email);
        } else {
            reset("#email-error", email);
        }

        if ((password).val() == "") {
            requiredField(password);
        } else {
            reset("#password-error", password);
        }

        if ((confirm).val() == "") {
            requiredField(confirm);
        } else {
            reset("#confirmPassword-error", confirm);
        }

        if (password.val() != confirm.val()) {
            $("#confirmPassword-error").html("<i>*Passwords don't match</i>");
            password.css("border-color", "#8D1515");
            confirm.css("border-color", "#8D1515");
        } else {
            reset(null, password);
            reset("#confirmPassword-error", confirm);
        }
    });

    function requiredField(form) {
        form.css("border-color", "#8D1515");
    }

    function reset(string, form) {
        $(string).html("");
        form.css("border-color", "#eee");
    };
});