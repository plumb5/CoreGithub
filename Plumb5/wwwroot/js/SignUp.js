

var regExpPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

var userDetails = {
    FirstName: ""
};

function OpenRegister() {
    $("#ui_tblSignUp,#ui_HeaderSignUp").show();
    $("#ui_tblSignIn,#ui_HeaderSignIn").hide();
}
function OpenSignin() {
    $("#ui_tblSignIn,#ui_HeaderSignIn").show();
    $("#ui_tblSignUp,#ui_HeaderSignUp").hide();
}

$("#ui_btnSignUp").click(function () {

    if (!Validation()) {
        return;
    }

    userDetails.FirstName = CleanText($("#txtFirstName").val());
    userDetails.LastName = CleanText($("#txtLastName").val());
    userDetails.EmailId = CleanText($("#txtNewEmailId").val());
    userDetails.Password = CleanText($("#txtNewPassword").val());
    userDetails.DomainForTrack = CleanText($("#ui_txtDomainForTrack").val());
    userDetails.CompanyName = CleanText($("#txtCompanyName").val());
    userDetails.AddressDetails = CleanText($("#txtAddressMain").val());
    userDetails.SecondaryAddress = CleanText($("#txtAddressSecondary").val());
    userDetails.City = CleanText($("#txtCity").val());
    userDetails.StateDetail = CleanText($("#txtState").val());
    userDetails.Country = CleanText($("#txtCountry").val());
    userDetails.ZipPostalCode = CleanText($("#txtzipCode").val());
    userDetails.BusinessPhone = CleanText($("#txtBusinessPhone").val());
    userDetails.MobilePhone = CleanText($("#txtMobileNumber").val());

    $.ajax({
        url: "../SignUpSignIn/SignUpUserDetails",
        type: 'Post',
        data: JSON.stringify({ 'userDetails': userDetails }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var result = response.d;
            if (result.ErrorMessage.length > 0) {
                $("#ermess").html(result.ErrorMessage).show();
            }
            else {
                window.location.href = "/Pricing/Payment";
            }
        },
        error: ShowAjaxError
    });

});

function Validation() {

    $(".errMessg.zoomIn").empty().hide();
    if ($("#txtFirstName").val().length == 0) {
        $("#txtFirstName").focus();
        $("#lbl_FirstName").html("Please enter first name").show();
        return false;
    }

    if ($("#txtLastName").val().length == 0) {
        $("#txtLastName").focus();
        $("#lbl_LastName").html("Please enter last name").show();
        return false;
    }
    if ($("#txtNewEmailId").val().length == 0) {
        $("#txtNewEmailId").focus();
        $("#lbl_NewEmailId").html("Please enter Email Id").show();
        return false;
    }

    if (!regExpEmail.test($("#txtNewEmailId").val())) {
        $("#txtNewEmailId").focus();
        $("#lbl_NewEmailId").html("Please enter correct Email Id").show();
        return false;
    }
    if ($("#txtNewPassword").val().length == 0) {
        $("#txtNewPassword").focus();
        $("#lbl_NewPassword").html("Please enter password").show();
        return false;
    }
    if (!regExpPassword.test($("#txtNewPassword").val())) {
        $("#txtNewPassword").focus();
        $("#lbl_NewPassword").html("Password should contain at least UpperCase, Numeric, Special Character and 8-15 Characters").show();
        return false;
    }
    if ($("#txtNewPassword").val() !== $("#txtConformPassword").val()) {
        $("#txtConformPassword").focus();
        $("#lbl_ConformPassword").html("Password did not match").show();
        return false;
    }

    if ($("#txtCompanyName").val().length == 0) {
        $("#txtCompanyName").focus();
        $("#lbl_CompanyName").html("Please enter company name").show();
        return false;
    }

    if ($("#ui_txtDomainForTrack").val().length == 0) {
        $("#ui_txtDomainForTrack").focus();
        $("#lbl_DomainForTrack").html("Please enter domain which you need to analyze").show();
        return false;
    }

    if (!regExpDomain.test($("#ui_txtDomainForTrack").val())) {
        $("#ui_txtDomainForTrack").focus();
        $("#lbl_DomainForTrack").html("Please enter correct domain").show();
        return false;
    }

    if ($("#txtAddressMain").val().length == 0) {
        $("#txtAddressMain").focus();
        $("#lbl_AddressMain").html("Please enter Address").show();
        return false;
    }

    if ($("#txtAddressSecondary").val().length == 0) {
        $("#txtAddressSecondary").focus();
        $("#lbl_AddressSecondary").html("Please enter Address").show();
        return false;
    }
    if ($("#txtCity").val().length == 0) {
        $("#txtCity").focus();
        $("#lbl_City").html("Please enter City").show();
        return false;
    }
    if ($("#txtState").val().length == 0) {
        $("#txtState").focus();
        $("#lbl_State").html("Please enter State").show();
        return false;
    }
    if ($("#txtCountry").get(0).selectedIndex == 0) {
        $("#txtCountry").focus();
        $("#lbl_Country").html("Please select Country").show();
        return false;
    }
    if ($("#txtzipCode").val().length == 0) {
        $("#txtzipCode").focus();
        $("#lbl_zipCode").html("Please enter zip code").show();
        return false;
    }
    if ($("#txtBusinessPhone").val().length == 0) {
        $("#txtBusinessPhone").focus();
        $("#lbl_BusinessPhone").html("Please enter Business Phone Number").show();
        return false;
    }

    $(".error").empty();
    return true;
}


$("#ui_btnLogin").click(function () {

    $("#ermess_signin").empty().hide();
    if (CleanText($("#txtEmailId").val()).length == 0) {
        $("#ermess_signin").show().html("Please enter Email-Id");
        return;
    }

    if (!regExpEmail.test($("#txtEmailId").val())) {
        $("#ermess_signin").show().html("Please enter correct Email-Id");
        return;
    }

    if (CleanText($("#txtLoginPassword").val()).length == 0) {
        $("#ermess_signin").show().html("Please enter password");
        return;
    }

    userDetails.EmailId = CleanText($("#txtEmailId").val());
    userDetails.Password = $("#txtLoginPassword").val();

    $.ajax({
        url: "../SignUpSignIn/SignIn",
        type: 'Post',
        data: JSON.stringify({ 'userDetails': userDetails }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var result = response.d;
            if (result.LoginStatus == 0 && result.ErrorMessage.length > 0) {
                $("#ermess_signin").show().html(result.ErrorMessage);
            }
            else if (result.LoginStatus == 1) {
                window.location.href = "/Pricing/Payment";
            }
        },
        error: ShowAjaxError
    });

});

