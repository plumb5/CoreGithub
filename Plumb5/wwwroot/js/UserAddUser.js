

$("#dvLoading").hide();

$("#ui_btnCreateAccount").click(function () {

    if (!ValidateField())
        return false;

});

ValidateField = function () {

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

    if (!regExpEmail.test($("#ui_txtEmailId").val())) {
        ShowErrorMessage("Please enter the valid Email ID");
        $("#ui_txtEmailId").focus();
        return false;
    }

    if ($.trim($("#ui_txtMobilePhone").val()).length == 0) {
        ShowErrorMessage("Please enter the mobile number");
        $("#ui_txtMobilePhone").focus();
        return false;
    }

    if (!ValidateMobilNo($.trim($("#ui_txtMobilePhone").val()))) {
        ShowErrorMessage("Please enter the valid mobile number");
        $("#ui_txtMobilePhone").focus();
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

    if ($.trim($("#ui_txtCity").val()).length == 0) {
        ShowErrorMessage("Please enter the city");
        $("#ui_txtCity").focus();
        return false;
    }

    if ($.trim($("#ui_txtStateDetail").val()).length == 0) {
        ShowErrorMessage("Please enter the state");
        $("#ui_txtStateDetail").focus();
        return false;
    }

    if ($("#ui_ddlCountry").get(0).selectedIndex == 0) {
        ShowErrorMessage("Please select the country");
        $("#ui_ddlCountry").focus();
        return false;
    }

    if ($.trim($("#ui_txtZipPostalCode").val()).length == 0) {
        ShowErrorMessage("Please enter your Zip/Postal Code");
        $("#ui_txtZipPostalCode").focus();
        return false;
    }

    if ($.trim($("#ui_txtCompanyName").val()).length == 0) {
        ShowErrorMessage("Please enter company name");
        $("#ui_txtCompanyName").focus();
        return false;
    }

    if ($.trim($("#ui_txtCompanyWebUrl").val()).length == 0) {
        ShowErrorMessage("Please enter the company URL");
        $("#ui_txtCompanyWebUrl").focus();
        return false;
    }

    if (!regExpUrl.test($("#ui_txtCompanyWebUrl").val())) {
        ShowErrorMessage("Please enter correct URL");
        $("#ui_txtCompanyWebUrl").focus();
        return false;
    }

    if ($.trim($("#ui_txtBusinessPhone").val()).length == 0) {
        ShowErrorMessage("Please enter the business number");
        $("#ui_txtBusinessPhone").focus();
        return false;
    }
    return true;
};
