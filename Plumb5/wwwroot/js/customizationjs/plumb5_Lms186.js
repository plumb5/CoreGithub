/*$(document).ready(function () {
    $("a[href^='/Prospect/Leads/NewLead']").attr('href', "/Custom/LmsEditProfile");
});

$(document).on("DOMNodeInserted", "tr.itemStyle", function () {
    $("a[href^='/Prospect/Leads/NewLead']").each(function () {
        this.href = this.href.replace("/Prospect/Leads/NewLead", "/Custom/LmsEditProfile");
    });
});

$("#ui_btnupdatestage").click(function () {
    if ($("#ui_Sourcelist option:selected").text().toLowerCase().indexOf("sql") > 0) {
        var LeadList = GetSelectedIds();
        var MailData = { AdsId: 1586, ToEmailId: "satyampriyas@decisive.in", ToName: "satyam", Subject: "Test", FromName: "sahoo", FromEmailId: "satyampriyas@decisive.in", ReplyToEmailId: "satyampriyas@decisive.in", ContactIds: LeadList };
        $.ajax({
            type: 'GET',
            url: 'http://api.plumb5.com/Customization/SendMail',
            data: { 'AdsId': MailData.AdsId, 'ToEmailId': MailData.ToEmailId, ToName: MailData.ToName, 'Subject': MailData.Subject, 'FromName': MailData.FromName, 'FromEmailId': MailData.FromEmailId, 'ReplyToEmailId': MailData.ReplyToEmailId, 'ContactIds': MailData.ContactIds },
            dataType: "json",
            success: function (data) {
            }
        })
    }
});

*/

$(document).ready(function () {
    setTimeout(function () {
        CheckValuesExists();
    }, 500);
    setTimeout(function () {
        CheckValuesExists();
    }, 1000);
    setTimeout(function () {
        CheckValuesExists();
    }, 2000);
    setTimeout(function () {
        CheckValuesExists();
    }, 3000);
    setTimeout(function () {
        CheckValuesExists();
    }, 6000);
});

function CheckValuesExists() {
    if ($("#txtDomainName").length > 0 && $("#txtDomainName").val().length > 0) {
        $("#txtDomainName").prop("disabled", true);
    }
}

$(document.body).on('change', '#txtDomainName', function (event) {
    $("#dvLoading").show();

    if ($("#txtDomainName").val().length == 0) {
        $("#dvLoading").hide();
        ShowErrorMessage("Please enter domain name");
        return false;
    }

    if (!parent.regExpDomain.test(CleanText($("#txtDomainName").val()))) {
        $("#dvLoading").hide();
        ShowErrorMessage("Please enter valid domain name");
        return false;
    }

    var DomainName = CleanText($("#txtDomainName").val());

    $.ajax({
        url: "/Custom/LmsEditProfile/ValidateDomainName",
        type: 'POST',
        data: JSON.stringify({ 'DomainName': DomainName }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status) {
                $("#btnSubmit").prop("disabled", true);
                ShowErrorMessage("This domain name already exists and is assigned to " + response.AssignedUserName + ".Please contact senior user " + response.SeniorName + " for more details.");
            }
            else if (!response.Status) {
                $("#btnSubmit").prop("disabled", false);
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
});


ValidateLead = function () {

    if ($("#ui_txtContactEmailId").val().length == 0 && $("#ui_txtPhoneNumber").val().length == 0) {
        ShowErrorMessage("Without Email Id or Contact Number, lead can't be updated, it is mandatory field for lead");
        return false;
    }

    if ($("#ui_txtContactEmailId").val().length > 0 && !regExpEmail.test($("#ui_txtContactEmailId").val())) {
        ShowErrorMessage("Please enter valid email Id");
        return false;
    }

    if ($("#ui_txtPhoneNumber").val().length > 0 && !ValidateMobilNo($("#ui_txtPhoneNumber").val())) {
        ShowErrorMessage("Please enter valid phone number");
        return false;
    }

    if ($("#ui_txtAlternateEmailId").val() != null && $("#ui_txtAlternateEmailId").val() != undefined && $("#ui_txtAlternateEmailId").val().length > 0) {
        if (!CheckValidEmail("ui_txtAlternateEmailId"))
            return false;
    }

    if ($("#ui_txtAlternatePhoneNumber").val() != null && $("#ui_txtAlternatePhoneNumber").val() != undefined && $("#ui_txtAlternatePhoneNumber").val().length > 0) {
        if (!CheckPhoneNumbers("ui_txtAlternatePhoneNumber"))
            return false;
    }

    if ($("#txtReminderDate").val() != null && $("#txtReminderDate").val().length > 0) {
        var selectedDate = $("#txtReminderDate").val().split("-");

        var FinalReminderDate = new Date(selectedDate[0], parseInt(selectedDate[1]) - 1, selectedDate[2], $("#ui_dllRemTime").val());

        if (FinalReminderDate <= new Date()) {

            if (!$("#dvlbl_LeadStatus").is(":visible")) 
                $("#lbl_LeadStatus").click();

            ShowErrorMessage("Please set the reminder date and time greater than the present hour.");
            return false;
        }
    }

    if ($("#txtReminderTo").val() != null && $("#txtReminderTo").val().length > 0) {
        if ($("#radMail").is(":checked") && $("#txtReminderTo").val().length > 0 && !regExpEmail.test($("#txtReminderTo").val())) {

            if (!$("#dvlbl_LeadStatus").is(":visible")) {
                $("#lbl_LeadStatus").click();
            }

            ShowErrorMessage("Please enter valid Reminder email Id");
            $("#txtReminderTo").focus();
            return false;
        }

        if ($("#radSms").is(":checked") && $("#txtReminderTo").val().length > 0 && !ValidateMobilNo($("#txtReminderTo").val())) {
            if (!$("#dvlbl_LeadStatus").is(":visible")) {
                $("#lbl_LeadStatus").click();
            }

            ShowErrorMessage("Please enter the valid Reminder phone number");
            $("#txtReminderTo").focus();
            return false;
        }
    }

    if ($("#txtDomainName").val().length == 0) {

        if (!$("#dvlbl_MembershipDetails").is(":visible")) {
            $("#lbl_MembershipDetails").click();
        }
        $("#txtDomainName").focus();

        $("#dvLoading").hide();
        ShowErrorMessage("Please enter domain name");
        return false;
    }

    if (!parent.regExpDomain.test(CleanText($("#txtDomainName").val()))) {


        if (!$("#dvlbl_MembershipDetails").is(":visible")) {
            $("#lbl_MembershipDetails").click();
        }
        $("#txtDomainName").focus();

        $("#dvLoading").hide();
        ShowErrorMessage("Please enter valid domain name");
        return false;
    }

    if ($("#txtCompanyWebURL").val().length > 0) {
        if (!regExpUrl.test($("#txtCompanyWebURL").val())) {

            $("#dvLoading").hide();

            if (!$("#dvlbl_MembershipDetails").is(":visible")) {
                $("#lbl_MembershipDetails").click();
            }
            $("#txtCompanyWebURL").focus();
            ShowErrorMessage("Please enter correct url");
            return false;
        }
    }

    return true;
};

