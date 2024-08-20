var responseSettings = {
    ReportToDetailsByMail: "", ReportToDetailsBySMS: "", MailTemplateId: 0, Subject: "", FromName: "", FromEmailId: "", SMSName: "", SmsTemplateId: 0, AccesLeadToUserId: "", GroupId: 0
};

function ValidationOfResponseSetting() {
    //Mail
    if ($("#ui_chkReportMail").is(":checked")) {
        if ($("#ui_txtReportThroughEmail").val().length == 0) {
            $("#ui_txtReportThroughEmail").focus();
            ShowErrorMessage("Response Setting -> Report through email -> Please enter email id");
            return false;
        }
        if (!CheckValidEmail("ui_txtReportThroughEmail")) {
            return false;
        }
    }
    //SMS
    if ($("#ui_chkReportSMS").is(":checked")) {
        if ($("#ui_txtReportThroughSMSAlert").val().length == 0) {
            $("#ui_txtReportThroughSMSAlert").focus();
            ShowErrorMessage("Response Setting -> Report through SMS -> Please enter phone numbers to get lead notification.");
            return false;
        }
        if (!CheckPhoneNumbers("ui_txtReportThroughSMSAlert")) {
            return false;
        }
    }
    //Mailout
    if ($("#ui_chkSendMailOut").is(":checked")) {
        if ($("#ui_ddlMailUnConditionTemplate").val() == 0) {
            ShowErrorMessage("Response Setting -> Send email out responder -> Please select mail template");
            $("#ui_ddlMailUnConditionTemplate").focus();
            return false;
        }
        if ($("#ui_txtMailUnConditionSubject").val().length == 0) {
            ShowErrorMessage("Response Setting -> Send email out responder -> Please select mail subject");
            $("#ui_txtMailUnConditionSubject").focus();
            return false;
        }
        if ($("#ui_txtUnConditionalMailFromName").val().length == 0) {
            ShowErrorMessage("Response Setting -> Send email out responder -> Please enter mail from name");
            $("#ui_txtUnConditionalMailFromName").focus();
            return false;
        }
        if ($("#ui_txtUnConditionalMailFromId").val().length == 0) {
            ShowErrorMessage("Response Setting -> Send email out responder -> Please enter mail from email Id");
            $("#ui_txtUnConditionalMailFromId").focus();
            return false;
        }
        if (!regExpEmail.test($("#ui_txtUnConditionalMailFromId").val())) {
            ShowErrorMessage("Response Setting -> Send email out responder -> Please enter valid from email Id");
            $("#ui_txtUnConditionalMailFromId").focus();
            return false;
        }
    }
    //SMS Out
    if ($("#ui_chkSendSmsOut").is(":checked")) {
        if (!ValidateSmsSendOut())
            return false;
    }
    //Assign Lead Validation
    if ($("#ui_chkSalesPerson").is(":checked")) {
        if ($("#ui_ddlUserList").val() == 0) {
            $("#ui_ddlUserList").focus();
            ShowErrorMessage("Response Setting -> Assign Sales Person -> Please select a sales person");
            return false;
        }
    }
    if ($("#ui_chkGroups").is(":checked")) {
        if ($("#ui_ddlGroupList").val() == 0) {
            $("#ui_ddlUserList").focus();
            ShowErrorMessage("Response Setting -> Auto Assign to Group -> Please select the group name");
            return false;
        }
    }
    return true;
}

function ValidateSmsSendOut() {
    if ($("#ui_txtSmsSendOutResponder").val().length == 0) {
        ShowErrorMessage("Response Setting -> Send SMS out responder -> Please enter Name")
        $("#ui_txtSmsSendOutResponder").focus();
        return false;
    }
    if ($("#ui_ddlSmsTemplate").val() == 0) {
        ShowErrorMessage("Response Setting -> Send SMS out responder -> Please select the Sms Template");
        return false;
    }
    return true;
}

function ResponseSettingData() {
    //// Mail
    if ($("#ui_chkReportMail").is(":checked")) {
        responseSettings.ReportToDetailsByMail = CleanText($("#ui_txtReportThroughEmail").val());
    } else {
        responseSettings.ReportToDetailsByMail = "";
    }
    //// SMS
    if ($("#ui_chkReportSMS").is(":checked")) {
        responseSettings.ReportToDetailsBySMS = CleanText($("#ui_txtReportThroughSMSAlert").val());
    } else {
        responseSettings.ReportToDetailsBySMS = "";
    }
    //// Mail Out
    if ($("#ui_chkSendMailOut").is(":checked")) {
        responseSettings.MailTemplateId = $("#ui_ddlMailUnConditionTemplate").val();
        responseSettings.Subject = CleanText($("#ui_txtMailUnConditionSubject").val());
        responseSettings.FromName = CleanText($("#ui_txtUnConditionalMailFromName").val());
        responseSettings.FromEmailId = CleanText($("#ui_txtUnConditionalMailFromId").val());
    }
    else {
        responseSettings.MailTemplateId = 0;
        responseSettings.Subject = "";
        responseSettings.FromName = "";
        responseSettings.FromEmailId = "";
    }
    //// SMS Out
    if ($("#ui_chkSendSmsOut").is(":checked")) {
        responseSettings.SMSName = $("#ui_txtSmsSendOutResponder").val();
        responseSettings.SmsTemplateId = $("#ui_ddlSmsTemplate").val();
    } else {
        responseSettings.SMSName = "";
        responseSettings.SmsTemplateId = 0;
    }
    //// Sales Person
    if ($("#ui_chkSalesPerson").is(":checked")) {
        responseSettings.AccesLeadToUserId = $("#ui_ddlUserList").val();
    } else {
        responseSettings.AccesLeadToUserId = "";
    }
    //// Groups
    if ($("#ui_chkGroups").is(":checked") && $("#ui_ddlGroupList").get(0).selectedIndex > 0) {
        responseSettings.GroupId = $("#ui_ddlGroupList").val();
    }
    else {
        responseSettings.GroupId = 0;
    }
}

function BindResponseSettings() {
    if (responseSettings.ReportToDetailsByMail != null && responseSettings.ReportToDetailsByMail.length > 0) {
        $("#ui_chkReportMail").prop("checked", true);    
        $("#ui_chkReportMailTd").show();
        $("#ui_txtReportThroughEmail").val(responseSettings.ReportToDetailsByMail);
    }
    if (responseSettings.ReportToDetailsBySMS != null && responseSettings.ReportToDetailsBySMS.length > 0) {
        $("#ui_chkReportSMS").prop("checked", true);
        $("#ui_chkReportSMSTd").show();     
        $("#ui_txtReportThroughSMSAlert").val(responseSettings.ReportToDetailsBySMS);
    }
    if (responseSettings.MailTemplateId != 0 && responseSettings.Subject != null && responseSettings.FromName != null && responseSettings.FromEmailId != null) {
        $("#ui_chkSendMailOut").prop("checked", true);
        $("#ui_chkSendMailOutTd").show();

        $("#ui_ddlMailUnConditionTemplate").val(responseSettings.MailTemplateId);
        $("#ui_txtMailUnConditionSubject").val(responseSettings.Subject);
        $("#ui_txtUnConditionalMailFromName").val(responseSettings.FromName);
        $("#ui_txtUnConditionalMailFromId").val(responseSettings.FromEmailId);
    }
    if (responseSettings.SMSName != null && responseSettings.SmsTemplateId != 0) {
        $("#ui_chkSendSmsOut").prop("checked", true);
        $("#ui_chkSendSmsOutTd").show();

        $("#ui_txtSmsSendOutResponder").val(responseSettings.SMSName);
        $("#ui_ddlSmsTemplate").val(responseSettings.SmsTemplateId);
    }
    if (responseSettings.AccesLeadToUserId != null && responseSettings.AccesLeadToUserId.length > 0 && responseSettings.AccesLeadToUserId != "0") {
        $("#ui_chkSalesPerson").prop("checked", true);
        $("#ui_chkSalesPersonTd").show();
        
        $("#ui_ddlUserList").val(responseSettings.AccesLeadToUserId);
    }
    if (responseSettings.GroupId > 0) {
        $("#ui_chkGroups").prop("checked", true);
        $("#ui_chkGroupsTd").show();
        $("#ui_ddlGroupList").val(responseSettings.GroupId);
    }
}

function CheckValidEmail(Id) {
    if ($("#" + Id + "").val() != null && $("#" + Id + "").val() != undefined && $("#" + Id + "").val().length > 0) {
        if ($("#" + Id + "").val().indexOf(",") > -1) {
            var SplitEmailId = $("#" + Id + "").val().split(",");
            for (var i = 0; i < SplitEmailId.length; i++) {
                if (!regExpEmail.test(SplitEmailId[i])) {
                    ShowErrorMessage("Please enter valid email Id");
                    $("#" + Id + "").focus();
                    return false;
                }
            }
        }
        else {
            if (!regExpEmail.test($("#" + Id + "").val())) {
                ShowErrorMessage("Please enter valid email Id");
                $("#" + Id + "").focus();
                return false;
            }
        }
    }
    return true;
}

function CheckPhoneNumbers(Id) {
    if ($("#" + Id + "").val() != null && $("#" + Id + "").val() != undefined && $("#" + Id + "").val().length > 0) {
        if ($("#" + Id + "").val().indexOf(",") > -1) {
            var SplitPhoneNumbers = $("#" + Id + "").val().split(",");
            for (var i = 0; i < SplitPhoneNumbers.length; i++) {
                if (!ValidateMobilNo(SplitPhoneNumbers[i])) {
                    ShowErrorMessage("Please enter valid phone number");
                    $("#" + Id + "").focus();
                    return false;
                }
            }
        }
        else {
            if (!ValidateMobilNo($("#" + Id + "").val())) {
                ShowErrorMessage("Please enter valid phone number");
                $("#" + Id + "").focus();
                return false;
            }
        }
    }
    return true;
}