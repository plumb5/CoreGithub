$(document).ready(function () {
    GetUnserInfoUserId();
});

function GetUnserInfoUserId() {
    $.ajax({
        url: "/Form/Base/GetEncryptedOfUserInfoUserId",
        type: 'POST',       
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status) {
                //$("tab6").append('<a style="color: #666666; text-decoration :none;" href="' + url + '">' + text + '</a>');
                //$("#link_apidatasync").attr('href', "/APIDataSync/?Id=" + response.UserInfoUserId);
            }
            else {

            }
        },
        error: ShowAjaxError
    });
}