var leadNotification = { Id: 0, Mail: false, Sms: false, WhatsApp: false };

var leadNotificationUtil = {
    SaveNotification: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Prospect/AgentNotification/SaveLeadAssign",
            type: 'POST',
            data: JSON.stringify({ "AccountId": Plumb5AccountId, 'leadNotification': leadNotification }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Id) {
                if (Id > 0) {
                    ShowSuccessMessage(GlobalErrorList.AgentNotification.SavedSuccessfully);
                } else {
                    ShowErrorMessage(GlobalErrorList.AgentNotification.UnableToSave);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    GetNotification: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Prospect/AgentNotification/GetNotificationForLead",
            type: 'POST',
            data: JSON.stringify({ "AccountId": Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (leadNotification) {
                if (leadNotification != null) {
                    if (leadNotification.Mail == true) {
                        $("#ui_checkautoNotificationMail").prop("checked", true);
                    }

                    if (leadNotification.Sms == true) {
                        $("#ui_checkautoNotificationSms").prop("checked", true);
                    }

                    if (leadNotification.WhatsApp == true)
                        $("#ui_checkautoNotificationWA").prop("checked", true);
                } else {
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
    if ($("#ui_checkautoNotificationMail").is(":checked")) {
        leadNotification.Mail = true;
    } else {
        leadNotification.Mail = false;
    }

    if ($("#ui_checkautoNotificationSms").is(":checked")) {
        leadNotification.Sms = true;
    } else {
        leadNotification.Sms = false;
    }

    if ($("#ui_checkautoNotificationWA").is(":checked"))
        leadNotification.WhatsApp = true;
    else
        leadNotification.WhatsApp = false;

    leadNotificationUtil.SaveNotification();
});

$(".leadnotiftabname").click(function () {
    let getbtntabname = $(this).attr("data-tabcontname");
    $(".leadnofittabcont").addClass("hideDiv");
    $(".leadnotiftabname").removeClass("active");
    $(this).addClass("active");
    $(".leadnofittabcont").addClass("hideDiv");
    $("#" + getbtntabname).removeClass("hideDiv");
});