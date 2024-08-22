var userInfo = { FirstName: "", LastName: "", EmailId: "", MobilePhone: 0, BusinessPhone: 0, CompanyName: "", CompanyWebUrl: "", AddressDetails: "", SecondaryAddress: "", ZipPostalCode: 0, Country: "", State: "", City: "", Password: "", EmployeeCode: "" };
var userDetails;
$(document).ready(function () {
    $("#dvLoading").hide();
    $("#dvProfileBasicInfo").show();
});

function SavePassword() {

    if (!ValidatePassword()) {
        return false;
    }

    var userId = parseInt($.urlParam("UserId"));

    if (userId > 0)
        userInfo.UserId = userId;

    userInfo.Password = CleanText($("#ui_txtNewPassword").val());

    $.ajax({
        url: "../Account/UpdatePassword",
        type: 'POST',
        data: JSON.stringify({ 'userInfo': userInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status) {
                ShowErrorMessage("Password Updated Successfully");
            }
            else if (response.Message.length > 0) {
                ShowErrorMessage(response.Message);
            }
            else {
                ShowErrorMessage("Password Not Updated");
            }
        },
        error: ShowAjaxError
    });
}

function UpdateProfile() {

    if (!ValidateUpdateForm()) {
        return false;
    }
    var userId = parseInt($.urlParam("UserId"));

    if (userId > 0) {
        userInfo.UserId = userId;
    }

    userInfo.FirstName = CleanText($("#ui_txtFirstName").val());
    userInfo.LastName = CleanText($("#ui_txtLastName").val());
    userInfo.EmailId = CleanText($("#ui_txtEmailId").val());
    userInfo.MobilePhone = $("#ui_txtMobilePhone").val();
    userInfo.BusinessPhone = $("#ui_txtBusinessPhone").val();
    userInfo.CompanyName = CleanText($("#ui_txtCompanyName").val());
    userInfo.CompanyWebUrl = CleanText($("#ui_txtCompanyWebUrl").val());
    userInfo.AddressDetails = CleanText($("#ui_txtAddressDetails").val());
    userInfo.SecondaryAddress = CleanText($("#ui_txtSecondaryAddress").val());
    userInfo.ZipPostalCode = $("#ui_txtZipPostalCode").val();
    userInfo.Country = $("#ui_ddlCountry :selected").val();
    userInfo.StateDetail = CleanText($("#ui_txtStateDetail").val());
    userInfo.City = CleanText($("#ui_txtCity").val());
    userInfo.EmployeeCode = CleanText($("#ui_txtEmployeeCode").val());

    $.ajax({
        url: "../Account/UpdateDetails",
        type: 'POST',
        data: JSON.stringify({ 'userInfo': userInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowErrorMessage("Profile Updated Successfully");
            }
            else {
                ShowErrorMessage("Profile Not Updated Properly");
            }
        },
        error: ShowAjaxError
    });
}

$("#ui_btnCancelPassword").click(function () {
    $("#dvProfileBasicInfo").show();
    $("#dvContentHeader").show();
    $("#dvMyProfile").hide();
    $("#dvContentPassword").hide();
    $("#dvChangePassword").hide();
});

$("#a_ChangePassword").click(function () {

    $("#dvProfileBasicInfo").hide();
    $("#dvContentHeader").hide();
    $("#dvMyProfile").hide();
    $("#dvContentPassword").show();
    $("#dvChangePassword").show();
});

$("#a_BackToProfile").click(function () {

    $("#dvMyProfile").hide();
    $("#dvContentPassword").hide();
    $("#dvChangePassword").hide();
    $("#dvProfileBasicInfo").show();
    $("#dvContentHeader").show();
});

$("#a_BackToEdit").click(function () {

    $("#dvProfileBasicInfo").hide();
    $("#dvContentPassword").hide();
    $("#dvChangePassword").hide();
    $("#dvContentHeader").show();
    $("#dvMyProfile").show();
});

$("#a_EditProfile").click(function () {

    $("#dvProfileBasicInfo").hide();
    $("#dvContentPassword").hide();
    $("#dvChangePassword").hide();
    $("#dvContentHeader").show();
    $("#dvMyProfile").show();
});



function ValidatePassword() {
    if ($.trim($("#ui_txtNewPassword").val()).length == 0) {
        ShowErrorMessage("Please enter the new password");
        $("#ui_txtNewPassword").focus();
        return false;
    }

    if ($.trim($("#ui_txtConfirmPassword").val()).length == 0) {
        ShowErrorMessage("Please enter the confirm password");
        $("#ui_txtConfirmPassword").focus();
        return false;
    }

    if (!ValidatePasswordSymbol($.trim($("#ui_txtNewPassword").val()))) {
        ShowErrorMessage("The New Password entered does not meet the password policy requirements.");
        $("#ui_txtNewPassword").focus();
        return false;
    }

    if (!($("#ui_txtNewPassword").val() == $("#ui_txtConfirmPassword").val())) {
        ShowErrorMessage("Passwords do not match");
        $("#ui_txtNewPassword").focus();
        return false;
    }

    return true;
}

function ValidateUpdateForm() {
    if ($.trim($("#ui_txtFirstName").val()).length == 0) {
        ShowErrorMessage("Please enter the First name");
        $("#ui_txtFirstName").focus();
        return false;
    }

    if ($.trim($("#ui_txtLastName").val()).length == 0) {
        ShowErrorMessage("Please enter the Last name");
        $("#ui_txtLastName").focus();
        return false;
    }

    if ($.trim($("#ui_txtEmailId").val()).length == 0) {
        ShowErrorMessage("Please enter the Email ID");
        $("#ui_txtEmailId").focus();
        return false;
    }

    if (!ValidateEmailId($.trim($("#ui_txtEmailId").val()))) {
        ShowErrorMessage("Please enter the valid Email ID");
        $("#ui_txtEmailId").focus();
        return false;
    }

    if ($.trim($("#ui_txtMobilePhone").val()).length == 0) {
        ShowErrorMessage("Please enter the mobile number");
        $("#ui_txtMobilePhone").focus();
        return false;
    }

    if (!validateMobilNo($.trim($("#ui_txtMobilePhone").val()))) {
        ShowErrorMessage("Please enter the valid mobile number");
        $("#ui_txtMobilePhone").focus();
        return false;
    }

    if ($.trim($("#ui_txtBusinessPhone").val()).length == 0) {
        ShowErrorMessage("Please enter the business phone number");
        $("#ui_txtBusinessPhone").focus();
        return false;
    }
    if ($.trim($("#ui_txtCompanyName").val()).length == 0) {
        ShowErrorMessage("Please enter the company name");
        $("#ui_txtCompanyName").focus();
        return false;
    }

    if ($.trim($("#ui_txtCompanyWebUrl").val()).length == 0) {
        ShowErrorMessage("Please enter the company web URL");
        $("#ui_txtCompanyWebUrl").focus();
        return false;
    }

    if (!regExpUrl.test($("#ui_txtCompanyWebUrl").val())) {
        ShowErrorMessage("Please enter correct company web URL");
        $("#ui_txtCompanyWebUrl").focus();
        return false;
    }

    if ($.trim($("#ui_txtAddressDetails").val()).length == 0) {
        ShowErrorMessage("Please enter the address details");
        $("#ui_txtAddressDetails").focus();
        return false;
    }

    if ($.trim($("#ui_txtSecondaryAddress").val()).length == 0) {
        ShowErrorMessage("Please enter secondary address details");
        $("#ui_txtSecondaryAddress").focus();
        return false;
    }

    if ($.trim($("#ui_txtZipPostalCode").val()).length == 0) {
        ShowErrorMessage("Please enter Zip/Postal Code");
        $("#ui_txtZipPostalCode").focus();
        return false;
    }

    if ($.trim($("#ui_txtStateDetail").val()).length == 0) {
        ShowErrorMessage("Please enter the state");
        $("#ui_txtState").focus();
        return false;
    }

    if ($.trim($("#ui_txtCity").val()).length == 0) {
        ShowErrorMessage("Please enter the city");
        $("#ui_txtCity").focus();
        return false;
    }

    if ($("#ui_ddlCountry").get(0).selectedIndex == 0) {
        ShowErrorMessage("Please select the country");
        $("#ui_ddlCountry").focus();
        return false;
    }

    return true;
}


ValidateEmailId = function (content) {
    return regExpEmail.test(content);
}


ValidatePasswordSymbol = function (content) {
    var regExpPassword = /^(?=.*\d)(?=(.*[a-z]){3})(?=(.*[A-Z]){3})(?=(.*[0-9]){3})(?=(.*[!@@#\$%\_^&\`-~()*]){3})(?!.*\s).{12,}$/;
    return regExpPassword.test(content);
}

validateMobilNo = function (mobno) {
    var mlen = mobno.length;
    var regNumber = /^\d{10,20}$/;
    var regAnotherNumber = /^\+[0-9]{2,3}-[0-9]\d{10}$/;
    var regNumberPlus = /^\+\d{10,20}$/;
    var regNumberPlus91 = /^\+91\d{10,20}$/;
    var regNumberPlus91Minus = /^\+91-\d{10,20}$/;
    if (regNumber.test(mobno))
        return true;
    if (regNumberPlus.test(mobno))
        return true;
    if (regNumberPlus91.test(mobno))
        return true;
    if (regNumberPlus91Minus.test(mobno))
        return true;
    if (regAnotherNumber.test(mobno))
        return true;
    if (mobno.charAt(0) != '+' && mlen == 10)
        return true;
    if (mobno.charAt(0) == '+') {
        if (mobno.substr(0, 3) == '+91' && mobno.length == 13) {
            return true;
        }
    }
    if (mobno.indexOf("-") < 0 && mobno.length == 12 && mobno.substr(0, 2) == '91')
        return true;

    return false;
}

$("#btnUserGrpBack").click(function () {
    window.history.back();
})