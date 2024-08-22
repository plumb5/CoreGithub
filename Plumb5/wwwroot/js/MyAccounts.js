
var userDetails;
$(document).ready(function () {
    if ($("#divmsgs").is(":visible")) {
        $(".bgShadedPassword").show();
    }
    else
        $(".bgShadedPassword").hide();
});

$("#dvLoading").hide();
setTimeout(function () {
    $(".EachAccount:first").click();
}, 500);



$(".EachAccount").click(function () {
    var tagId = $(this).attr("tagId");
    if (!$("#feature-" + tagId).is(":visible")) {
        $(".EachAccountDetails").hide("fast");
        $("#feature-" + tagId).show("fast");
    }
});


$(".idSelectAcc").click(function () {

    var DomainInfo = { AdsId: $(this).attr("accountid"), AccountName: $(this).attr("accountname"), DomainName: $(this).attr("domain"), AccessType: 0, TrackerDomain: $(this).attr("trackerdomain") };
    var continueurl = $(this).attr("continueurl");

    $.ajax({
        url: "/Account/SetAccountDetails",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ 'domainInfo': DomainInfo }),
        success: function (response) {
            console.log(response);
            if (response) {
                window.location.href = "ActiveAccount";//continueurl;
            }
            else {
                ShowErrorMessage("Unable to delete");
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
});

function UpdateFirstTimePasswordReset() {
    $("#dvLoading").show();
    if (!ValidatePassword()) {
        $("#dvLoading").hide();
        return false;
    }

    var NewPassword = CleanText($("#ui_Password").val());

    if (UserId != null && UserId != undefined) {
        if (parseInt(UserId) > 0) {
            $.ajax({
                url: "../Account/FirstTimePasswordReset",
                type: 'POST',
                data: JSON.stringify({ 'UserId': UserId, 'NewPassword': NewPassword }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response.Status) {
                        $("#divmsgs,.bgShadedPassword").hide();
                        ShowErrorMessage("Password Updated Successfully");
                    }
                    else if (response.Message.length > 0) {
                        ShowErrorMessage(response.Message);
                    }
                    else {
                        ShowErrorMessage("Password Not Updated");
                    }
                    $("#dvLoading").hide();
                },
                error: ShowAjaxError
            });
        }
    }
}

function ValidatePassword() {
    if ($.trim($("#ui_Password").val()).length == 0) {
        ShowErrorMessage("Please enter the new password");
        $("#ui_txtNewPassword").focus();
        return false;
    }

    if ($.trim($("#ui_ConfirmPassword").val()).length == 0) {
        ShowErrorMessage("Please enter the confirm password");
        $("#ui_txtConfirmPassword").focus();
        return false;
    }

    if (!ValidateAdvPasswordSymbol($.trim($("#ui_Password").val()))) {
        ShowErrorMessage("The New Password entered does not meet the password policy requirements.");
        $("#ui_txtNewPassword").focus();
        return false;
    }

    if (!($("#ui_Password").val() == $("#ui_ConfirmPassword").val())) {
        ShowErrorMessage("Passwords do not match");
        $("#ui_txtNewPassword").focus();
        return false;
    }

    return true;
}

ValidatePasswordSymbol = function (content) {
    var regExpPassword = /^(?=.*\d)(?=(.*[a-z]){3})(?=(.*[A-Z]){3})(?=(.*[0-9]){3})(?=(.*[!@@#\$%\_^&\`-~()*]){3})(?!.*\s).{12,}$/;
    return regExpPassword.test(content);
}

ValidateAdvPasswordSymbol = function (content) {
    var regExpPassword = /^(?=.*\d)(?=(.*[a-z]){3})(?=(.*[A-Z]){3})(?=(.*[0-9]){3})(?=(.*[!@@#\$%\_^&\`-~()*]){3})(?!.*\s).{12,}$/;
    return regExpPassword.test(content);
}