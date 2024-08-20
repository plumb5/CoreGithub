var leadAssignmentAgentNotification = { Id: 0, Mail: false, Sms: false, WhatsApp: false };

var leadNotificationUtil = {
    SaveNotification: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Prospect/LeadAssignNotificationSetting/SaveLeadAssignmentAgentNotification",
            type: 'POST',
            data: JSON.stringify({ "AccountId": Plumb5AccountId, 'leadAssignmentAgentNotification': leadAssignmentAgentNotification }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Id) {
                if (Id > 0) {
                    ShowSuccessMessage(GlobalErrorList.LeadAssignmentNotificationToAgent.SavedSuccessfully);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.LeadAssignmentNotificationToAgent.UnableToSave);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    GetNotification: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Prospect/LeadAssignNotificationSetting/GetLeadAssignmentAgentNotification",
            type: 'POST',
            data: JSON.stringify({ "AccountId": Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (leadAssignmentAgentNotification) {
                if (leadAssignmentAgentNotification != null) {
                    if (leadAssignmentAgentNotification.Mail == true)
                        $("#ui_checkautoNotificationMail").prop("checked", true);

                    if (leadAssignmentAgentNotification.Sms == true)
                        $("#ui_checkautoNotificationSms").prop("checked", true);

                    if (leadAssignmentAgentNotification.WhatsApp == true)
                        $("#ui_checkautoNotificationWA").prop("checked", true);
                }
                else {
                    $("#ui_checkautoNotificationMail").prop("checked", false);
                    $("#ui_checkautoNotificationSms").prop("checked", false);
                    $("#ui_checkautoNotificationWA").prop("checked", false);
                }

                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
};

$(document).ready(function () {
    leadNotificationUtil.GetNotification();
});

$("#ui_btnSaveAutoNotification").click(function () {

    if ($("#ui_checkautoNotificationMail").is(":checked"))
        leadAssignmentAgentNotification.Mail = true;
    else
        leadAssignmentAgentNotification.Mail = false;

    if ($("#ui_checkautoNotificationSms").is(":checked"))
        leadAssignmentAgentNotification.Sms = true;
    else
        leadAssignmentAgentNotification.Sms = false;

    if ($("#ui_checkautoNotificationWA").is(":checked"))
        leadAssignmentAgentNotification.WhatsApp = true;
    else
        leadAssignmentAgentNotification.WhatsApp = false;

    leadNotificationUtil.SaveNotification();
});