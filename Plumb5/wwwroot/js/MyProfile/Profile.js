var userInfo = { UserId: 0, FirstName: "", LastName: "", EmailId: "", MobilePhone: "", BusinessPhone: "", CompanyName: "", CompanyWebUrl: "", EmployeeCode: "", AddressDetails: "", SecondaryAddress: "", StateDetail: "", City: "", ZipPostalCode: 0, Country: "", Password: "" };

$(document).ready(function () {
    $(".setttabitem").click(function () {
        var checktabcontname = $(this).attr("data-setttype");
        $(".setttabitem").removeClass("active");
        $(".setttabcontainer").addClass("hideDiv");
        $(this).addClass("active");
        $("#" + checktabcontname).removeClass("hideDiv");

        if (checktabcontname === 'tabcontone') {
            ShowPageLoading();
            GetUserDetails();
        }
        if (checktabcontname === 'tabconttwo') {
            $('#ui_txt_OldPassword').val('');
            $('#ui_txt_NewPassword').val('');
            $('#ui_txt_ConfirmPassword').val('');
        }
        if (checktabcontname === 'tabcontthree') {
            ShowPageLoading();
            GetApiKey();
        }

    });
    GetUserDetails();
});

function ClearProfileFields() {
    $('#ui_txt_FirstName').val('');
    $('#ui_txt_LastName').val('');
    $('#ui_txt_ProfileEmailId').val('');
    $('#ui_txt_MobilePhone').val('');
    $('#ui_txt_BusinessPhone').val('');
    $('#ui_txt_CompanyName').val('');
    $('#ui_txt_CompanyWebURL').val('');
    $('#ui_txt_EmployeeCode').val('');
    $('#ui_txtArea_AddressDetails').val('');
    $('#ui_txtArea_SecondaryAddress').val('');
    $('#ui_txt_State').val('');
    $('#ui_txt_City').val('');
    $('#ui_txt_PostalCode').val('');
    $('#ui_drpdwn_Country').val('Select');
    $('#ui_WorkFromHome').val('0');
}

function GetUserDetails() {
    $.ajax({
        url: "/MyProfile/Profile/GetUserDetails",
        type: 'Post',
        data: JSON.stringify({ 'UserId': Plumb5UserId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            ClearProfileFields();
            if (response !== undefined && response !== null) {
                $('#ui_txt_FirstName').val(response.FirstName);
                $('#ui_txt_LastName').val(response.LastName);
                $('#ui_txt_ProfileEmailId').val(response.EmailId);
                $('#ui_txt_MobilePhone').val(response.MobilePhone);
                $('#ui_txt_BusinessPhone').val(response.BusinessPhone);
                $('#ui_txt_CompanyName').val(response.CompanyName);
                $('#ui_txt_CompanyWebURL').val(response.CompanyWebUrl);
                $('#ui_txt_EmployeeCode').val(response.EmployeeCode);
                $('#ui_txtArea_AddressDetails').val(response.AddressDetails);
                $('#ui_txtArea_SecondaryAddress').val(response.SecondaryAddress);
                $('#ui_txt_State').val(response.StateDetail);
                $('#ui_txt_City').val(response.City);
                $('#ui_txt_PostalCode').val(response.ZipPostalCode);
                $('#ui_drpdwn_Country').val(response.Country);
                if (response.SetPrimaryPhoneNumber != undefined && response.SetPrimaryPhoneNumber != null && response.SetPrimaryPhoneNumber != "") {
                    if ($("#wrkfrmhme").is(":checked")) {
                        $('#ui_WorkFromHome').val(response.SetPrimaryPhoneNumber);
                    } else {
                        $("#wrkfrmhme").click();
                        $('#ui_WorkFromHome').val(response.SetPrimaryPhoneNumber);
                    }
                }

            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}

$('#ui_btn_ProfileUpdate').click(function () {
    if (!ValidateProfileFields()) {
        return false;
    }

    ShowPageLoading();
    userInfo = new Object();
    userInfo.UserId = Plumb5UserId;
    userInfo.FirstName = CleanText($("#ui_txt_FirstName").val());
    userInfo.LastName = CleanText($("#ui_txt_LastName").val());
    userInfo.EmailId = CleanText($("#ui_txt_ProfileEmailId").val());
    userInfo.MobilePhone = CleanText($("#ui_txt_MobilePhone").val());
    userInfo.BusinessPhone = CleanText($("#ui_txt_BusinessPhone").val());
    userInfo.CompanyName = CleanText($("#ui_txt_CompanyName").val());
    userInfo.CompanyWebUrl = CleanText($("#ui_txt_CompanyWebURL").val());
    userInfo.EmployeeCode = CleanText($("#ui_txt_EmployeeCode").val());
    userInfo.AddressDetails = CleanText($("#ui_txtArea_AddressDetails").val());
    userInfo.SecondaryAddress = CleanText($("#ui_txtArea_SecondaryAddress").val());
    userInfo.StateDetail = CleanText($("#ui_txt_State").val());
    userInfo.City = CleanText($("#ui_txt_City").val());
    userInfo.ZipPostalCode = CleanText($("#ui_txt_PostalCode").val());
    userInfo.Country = $("#ui_drpdwn_Country :selected").val();
    if ($("#wrkfrmhme").is(":checked")) {
        userInfo.SetPrimaryPhoneNumber = $("#ui_WorkFromHome :selected").val();
    } else {
        userInfo.SetPrimaryPhoneNumber = null;
    }

    $.ajax({
        url: "/MyProfile/Profile/UpdateProfileDetails",
        type: 'POST',
        data: JSON.stringify({ 'LoginUserId': Plumb5UserId, 'userInfo': userInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response)
                ShowSuccessMessage(GlobalErrorList.MyProfile.MyProfile_Update_Success);
            else
                ShowErrorMessage(GlobalErrorList.MyProfile.MyProfile_Update_Error);
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});

function ValidateProfileFields() {
    if (CleanText($("#ui_txt_FirstName").val()).length === 0) {
        ShowErrorMessage(GlobalErrorList.MyProfile.MyProfile_ValidateFirstName_Error);
        $("#ui_txt_FirstName").focus();
        return false;
    }
    if (CleanText($("#ui_txt_LastName").val()).length === 0) {
        ShowErrorMessage(GlobalErrorList.MyProfile.MyProfile_ValidateLastName_Error);
        $("#ui_txt_LastName").focus();
        return false;
    }
    if (CleanText($("#ui_txt_ProfileEmailId").val()).length === 0) {
        ShowErrorMessage(GlobalErrorList.MyProfile.MyProfile_ValidateEmail_Error);
        $("#ui_txt_ProfileEmailId").focus();
        return false;
    }
    if (!regExpEmail.test(CleanText($("#ui_txt_ProfileEmailId").val()))) {
        ShowErrorMessage(GlobalErrorList.MyProfile.MyProfile_ValidEmail_Error);
        $("#ui_txt_ProfileEmailId").focus();
        return false;
    }
    if (CleanText($("#ui_txt_MobilePhone").val()).length === 0) {
        ShowErrorMessage(GlobalErrorList.MyProfile.MyProfile_ValidateMobile_Error);
        $("#ui_txtMobilePhone").focus();
        return false;
    }
    if (!validateMobilNo(CleanText($("#ui_txt_MobilePhone").val()))) {
        ShowErrorMessage(GlobalErrorList.MyProfile.MyProfile_ValidMobile_Error);
        $("#ui_txt_MobilePhone").focus();
        return false;
    }
    if (CleanText($("#ui_txt_BusinessPhone").val()).length === 0) {
        ShowErrorMessage(GlobalErrorList.MyProfile.MyProfile_ValidateBussinessMobile_Error);
        $("#ui_txt_BusinessPhone").focus();
        return false;
    }
    if (!validateMobilNo(CleanText($("#ui_txt_BusinessPhone").val()))) {
        ShowErrorMessage(GlobalErrorList.MyProfile.MyProfile_ValidBussinessMobile_Error);
        $("#ui_txt_BusinessPhone").focus();
        return false;
    }
    if (CleanText($("#ui_txt_CompanyName").val()).length === 0) {
        ShowErrorMessage(GlobalErrorList.MyProfile.MyProfile_ValidateCompanyName_Error);
        $("#ui_txt_CompanyName").focus();
        return false;
    }
    if (CleanText($("#ui_txt_CompanyWebURL").val()).length === 0) {
        ShowErrorMessage(GlobalErrorList.MyProfile.MyProfile_ValidateCompanyWebUrl_Error);
        $("#ui_txt_CompanyWebURL").focus();
        return false;
    }
    if (!regExpUrl.test(CleanText($("#ui_txt_CompanyWebURL").val()))) {
        ShowErrorMessage(GlobalErrorList.MyProfile.MyProfile_ValidCompanyWebUrl_Error);
        $("#ui_txt_CompanyWebURL").focus();
        return false;
    }
    if (CleanText($("#ui_txtArea_AddressDetails").val()).length === 0) {
        ShowErrorMessage(GlobalErrorList.MyProfile.MyProfile_ValidateCompanyAddress_Error);
        $("#ui_txtArea_AddressDetails").focus();
        return false;
    }
    if (CleanText($("#ui_txtArea_SecondaryAddress").val()).length === 0) {
        ShowErrorMessage(GlobalErrorList.MyProfile.MyProfile_ValidateCompanySecondaryAddress_Error);
        $("#ui_txtArea_SecondaryAddress").focus();
        return false;
    }
    if (CleanText($("#ui_txt_State").val()).length === 0) {
        ShowErrorMessage(GlobalErrorList.MyProfile.MyProfile_ValidateState_Error);
        $("#ui_txt_State").focus();
        return false;
    }
    if (CleanText($("#ui_txt_City").val()).length === 0) {
        ShowErrorMessage(GlobalErrorList.MyProfile.MyProfile_ValidateCity_Error);
        $("#ui_txt_City").focus();
        return false;
    }
    if (CleanText($("#ui_txt_PostalCode").val()).length === 0) {
        ShowErrorMessage(GlobalErrorList.MyProfile.MyProfile_ValidateZIP_Error);
        $("#ui_txt_PostalCode").focus();
        return false;
    }
    if ($("#ui_drpdwn_Country").get(0).selectedIndex === 0) {
        ShowErrorMessage(GlobalErrorList.MyProfile.MyProfile_ValidateCountry_Error);
        return false;
    }

    if ($("#wrkfrmhme").is(":checked")) {
        if ($("#ui_WorkFromHome").val() == "0") {
            ShowErrorMessage(GlobalErrorList.MyProfile.MyProfile_ValidateWFH_Error);
            return false;
        }
    }

    return true;
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
    if (mobno.charAt(0) !== '+' && mlen === 10)
        return true;
    if (mobno.charAt(0) === '+') {
        if (mobno.substr(0, 3) === '+91' && mobno.length === 13) {
            return true;
        }
    }
    if (mobno.indexOf("-") < 0 && mobno.length === 12 && mobno.substr(0, 2) === '91')
        return true;
    return false;
};

$('input[name="wrkfrmhme"]').click(function () {
    let isCheckedwrkfrm = $('input[name="wrkfrmhme"]').prop("checked");
    if (isCheckedwrkfrm == true) {
        $(this).parent().next().removeClass("hideDiv");
    } else {
        $(this).parent().next().addClass("hideDiv");
    }
});