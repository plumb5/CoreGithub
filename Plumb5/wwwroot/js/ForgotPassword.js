$("#txtEmailId,#txtCaptcha").click(function () {
    $('#lblError').html("");
});
function GenerateCaptcha() {
    var alpha = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
                          'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b',
                          'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
                          'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');
    for (var i = 0; i < 6; i++) {
        var a = alpha[Math.floor(Math.random() * alpha.length)];
        var b = alpha[Math.floor(Math.random() * alpha.length)];
        var c = alpha[Math.floor(Math.random() * alpha.length)];
        var d = alpha[Math.floor(Math.random() * alpha.length)];
        var e = alpha[Math.floor(Math.random() * alpha.length)];
        var f = alpha[Math.floor(Math.random() * alpha.length)];
        var g = alpha[Math.floor(Math.random() * alpha.length)];
    }
    var code = a + '' + b + '' + '' + c + '' + d + '' + e + '' + f + '' + g;
    document.getElementById("txtCaptchaDiv").innerHTML = code
}
function fn_toggleControl(flag) {
    if (flag == 1)
        GenerateCaptcha();
    $("#txtEmailId,#txtCaptcha").val('');
    $('#lblError').html('');
    $('#dvforgotPassword').toggle('slow');
    $('#dvLoading').hide();
}
function fn_toggleControl1(flag) {
    $('#dvSuccessMsg').toggle('slow');
    $('#dvLoading').hide();
}
function EmailIdExistance() {
    $('#dvLoading').show();
    $('#lblError').html('');
    $.ajax({
        type: "POST",
        url: "/ForgotPassword/CheckEmailId",
        data: "{'EmailId':'" + $('#txtEmailId').val() + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table1.length > 0) {
                if ($("#txtCaptcha").val() == $("#txtCaptchaDiv").text()) {
                    $('#dvforgotPassword').toggle('slow');
                    InserttoForgotPassword(response.Table1[0].FirstName, response.Table1[0].Password);
                }
                else if ($('#txtCaptcha').val() == '') {
                    $('#lblError').html("Please enter the Security code as shown above");
                }
                else {
                    $('#lblError').html("Security code mismatch!");
                    $('#txtCaptcha').val('');
                }
            }
            else {
                $('#dvError').show();
                $('#lblError').html("Please enter the email address associated with your Plumb5 account");
                $('#txtEmailId').val('');
            }
        }
    });
    $('#dvLoading').hide();
}
function InserttoForgotPassword(FirstName, Password) {
    $('#dvLoading').show();
    $('#lblError').html('');
    $.ajax({
        type: "POST",
        url: "/ForgotPassword/AddToForgotPassword",
        data: "{'EmailId':'" + $('#txtEmailId').val() + "','Password':'" + Password + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response > 0) {
                SendLink(FirstName);
            }
        }
    });
}
function SendLink(FirstName) {
    $('#dvSuccessMsg1').empty();
    $.ajax({
        type: "POST",
        url: "/ForgotPassword/SendLink",
        data: "{'EmailId':'" + $('#txtEmailId').val() + "','Name':'" + FirstName + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $('#dvforgotPassword').hide('slow');
            var messageDiv = $("#dvSuccessMsg");
            $('#dvLoading').hide();
            $('#dvSuccessMsg').toggle('slow');
            $('#dvSuccessMsg1').append("We've sent an email to <b>" + response + "</b>. Click the link in the email to reset your password.");
            setTimeout(function () { messageDiv.fadeOut(500); }, 5000);
        }
    });
}
//To Prevent Copy Paste and drop text
$(document).ready(function () {
    $('#txtCaptcha').bind('paste', function (e) {
        e.preventDefault();
        $('#lblError').html("You cannot paste the text into the textbox!");
        $('#dvError').show();
    });
    $('#txtCaptcha').on('drop', function () {
        return false;
    });
    $('#txtCaptchaDiv').bind('copy', function (e) {
        e.preventDefault();
        return false;
    });
});

$("#ui_btnCallReset").click(function () {
    $("#maincon").hide();
    $("#ui_divForgotPassword").show();
    $("#ui_spanResetErrorMessage").text('');
});

$("#ui_btnCancelResetPassword").click(function () {
    $("#ui_divForgotPassword").hide();
    $("#maincon").show();
});

$("#ui_btnResetPassword").click(function () {

    var regExpEmailReset = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    $("#ui_spanResetErrorMessage").text('');

    if ($("#ui_txtResetEmailId").val().length == 0) {
        $("#ui_spanResetErrorMessage").text('Please enter valid email Id');
        return false;
    }

    if (!regExpEmailReset.test($("#ui_txtResetEmailId").val())) {
        $("#ui_spanResetErrorMessage").text('Please enter valid email Id');
        return false;
    }

    $('#dvLoading').show();

    $.ajax({
        type: "POST",
        url: "/ForgotPassword/CheckEmailAndSendMail",
        data: JSON.stringify({ 'EmailId': $("#ui_txtResetEmailId").val() }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                $("#ui_spanResetErrorMessage").text("We've sent an email to " + $('#ui_txtResetEmailId').val() + ". Click the link in the email to reset your password.");
            }
            else {
                $("#ui_spanResetErrorMessage").text("Please enter the email address associated with your Plumb5 account");
            }
            $('#dvLoading').hide();
        }
    });
});