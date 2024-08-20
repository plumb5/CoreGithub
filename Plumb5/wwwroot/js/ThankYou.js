
$(document).ready(function () {
    BindUserName();
});

function BindUserName() {
    
    $.ajax({
        url: "../SignUpSignIn/LoginDetails",
        type: 'Get',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var result = response.d;
            if (result.UserDetails!=null) {
                $("#ui_lblUserName").html(result.UserDetails.UserName);
            }
        },
        error: function (error) {
            window.console.log(error.responseText);
        }
    });

}