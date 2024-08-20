var responseSettings = {
    ReportToFormsMailFieldId: 0, ReportToDetailsByMail: "", ReportToFormsSMSFieldId: 0, ReportToDetailsBySMS: "", MailOutDependencyFieldId: 0, MailIdList: "",
    RedirectUrl: "", AccesLeadToUserId: "", ReportToDetailsByPhoneCall: "", GroupId: 0
};
var mailSettings = { Id: 0, Name: "", MailTemplateId: 0, GroupId: 0, Subject: "", FromName: "", FromEmailId: "", Subscribe: false, Forward: false, IsSchedule: false, ReplyTo: "" };

ValidationOfResponseSetting = function () {

    if ($("#ui_chkReportMail").is(":checked") && $("#ui_txtReportThroughEmail").val().length == 0) {
        $("#ui_txtReportThroughEmail").focus();
        ShowErrorMessage("Please enter email id");
        return false;
    }
    if ($("#ui_chkReportSMS").is(":checked") && $("#ui_txtReportThroughSMSAlert").val().length == 0) {
        $("#ui_txtReportThroughSMSAlert").focus();
        ShowErrorMessage("Please enter numbers to get lead notification.");
        return false;
    }
    if ($("#ui_chkSendMailOut").is(":checked")) {
        if ($("#ui_ddlMailUnConditionTemplate").val() == 0) {
            ShowErrorMessage("Please select mail template");
            $("#ui_ddlMailUnConditionTemplate").focus();
            return false;
        }
        if ($("#ui_txtMailUnConditionSubject").val().length == 0) {
            ShowErrorMessage("Please select mail subject");
            $("#ui_txtMailUnConditionSubject").focus();
            return false;
        }
        if ($("#ui_txtUnConditionalMailFromName").val().length == 0) {
            ShowErrorMessage("Please enter mail from name");
            $("#ui_txtUnConditionalMailFromName").focus();
            return false;
        }
        if ($("#ui_txtUnConditionalMailFromId").val().length == 0 || !regExpEmail.test($("#ui_txtUnConditionalMailFromId").val())) {
            ShowErrorMessage("Please enter mail from email Id");
            $("#ui_txtUnConditionalMailFromId").focus();
            return false;
        }
    }
    if ($("#ui_chkRedirectUrl").is(":checked") && $("#ui_txtRedirectUrl").val().length == 0) {
        ShowErrorMessage("Please enter redirect url.");
        $("#ui_txtRedirectUrl").focus();
        return false;
    }
    return true;
};

BindSaveResponseDetails = function () {
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
    responseSettings.MailIdList = "";
    if (mailSettings.MailTemplateId != null && mailSettings.MailTemplateId > 0) {
        $("#ui_chkSendMailOut").prop("checked", true);
        $("#ui_chkSendMailOutTd").show();

        $("#ui_ddlMailUnConditionTemplate").val(mailSettings.MailTemplateId);
        $("#ui_txtMailUnConditionSubject").val(mailSettings.Subject);
        $("#ui_txtUnConditionalMailFromName").val(mailSettings.FromName);
        $("#ui_txtUnConditionalMailFromId").val(mailSettings.FromEmailId);
    }
    if (responseSettings.AccesLeadToUserId > 0) {
        $("#ui_chkSalesPerson").prop("checked", true);
        $("#ui_chkSalesPersonTd").show();
        $("#ui_ddlUserList").val(responseSettings.AccesLeadToUserId);
    }
    if (responseSettings.RedirectUrl != null && responseSettings.RedirectUrl.length > 0) {
        $("#ui_trRedirectUrl").show();
        $("#ui_chkRedirectUrl").prop("checked", true);
        $("#ui_chkRedirectUrlTd").show();
        $("#ui_txtRedirectUrl").val(responseSettings.RedirectUrl);
    }
};


GetResponseSettingData = function () {

    if ($("#ui_chkReportMail").is(":checked")) {
        responseSettings.ReportToDetailsByMail = CleanText($("#ui_txtReportThroughEmail").val());
    }
    else {
        responseSettings.ReportToDetailsByMail = "";
    }
    if ($("#ui_chkReportSMS").is(":checked")) {
        responseSettings.ReportToDetailsBySMS = CleanText($("#ui_txtReportThroughSMSAlert").val());
    }
    else {
        responseSettings.ReportToDetailsBySMS = "";
    }
    if ($("#ui_chkSendMailOut").is(":checked")) {

        mailSettings.MailTemplateId = $("#ui_ddlMailUnConditionTemplate").val();
        mailSettings.Subject = CleanText($("#ui_txtMailUnConditionSubject").val());
        mailSettings.FromName = CleanText($("#ui_txtUnConditionalMailFromName").val());
        mailSettings.FromEmailId = CleanText($("#ui_txtUnConditionalMailFromId").val());
    }
    if ($("#ui_chkSalesPerson").is(":checked") && $("#ui_ddlUserList").get(0).selectedIndex > 0) {
        responseSettings.AccesLeadToUserId = $("#ui_ddlUserList").val();
    }
    else {
        responseSettings.AccesLeadToUserId = 0;
    }

    if ($("#ui_radInPage").is(":checked") && $("#ui_chkRedirectUrl").is(":checked")) {
        responseSettings.RedirectUrl = $("#ui_txtRedirectUrl").val();
    }
    else {
        responseSettings.RedirectUrl = "";
    }

    return { responseSettings: responseSettings, mailSettings: mailSettings };
};