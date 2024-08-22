
$(document).ready(function () {
    HidePageLoading();
    GetLmsNotificationSchedular();
});

function GetLmsNotificationSchedular() {
    $.ajax({
        url: "/Prospect/InactiveNotification/GetInactiveNotification",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (LmsNotification) {

            if (LmsNotification.IsSalesPersonNotification == 1) {
                $("#ui_radNotInteractedNotificationYes").prop("checked", true);
                $("#dvSales").show();
            }
            else
                $("#dvSales").hide();

            $('#ui_ddlNotInteractedTimeOfSalesPerson').val(LmsNotification.SalesPersonNotificationHours);

            if (LmsNotification.SalesPersonNotificationMail == 1)
                $("#ui_radNotInteractedSendMail").prop("checked", true);

            if (LmsNotification.SalesPersonNotificationSms == 1)
                $("#ui_radNotInteractedSendSMS").prop("checked", true);

            if (LmsNotification.SalesPersonNotificationWhatsapp == 1)
                $("#ui_radNotInteractedSendWhatsapp").prop("checked", true);



            if (LmsNotification.IsReportingPersonNotification == 1) {
                $("#ui_radNotInteractedNotificationYesOfReporting").prop("checked", true);
                $("#dvReport").show();
            }
            else
                $("#dvReport").hide();

            $('#ui_ddlNotInteractedTimeOfReportingPerson').val(LmsNotification.ReportingPersonNotificationHours);

            if (LmsNotification.ReportingPersonNotificationMail == 1)
                $("#ui_radNotInteractedSendMailOfReportingPerson").prop("checked", true);

            if (LmsNotification.ReportingPersonNotificationSms == 1)
                $("#ui_radNotInteractedSendSMSOfReportingPerson").prop("checked", true);

            if (LmsNotification.ReportingPersonNotificationWhatsapp == 1)
                $("#ui_radNotInteractedSendWhatsappOfReportingPerson").prop("checked", true);

            if (LmsNotification.IsReportingPersonNotificationGroup == 1)
                $("#ui_IsGroup").prop("checked", true);

            if (LmsNotification.IsReportingPersonNotificationSenior == 1)
                $("#ui_schsenior").attr('checked', true);

            $('#ui_dllgrpsch').val(LmsNotification.ReportingPersonNotificationGroupId);


        },
        error: ShowAjaxError
    });
}

$("#ui_btnSaveNotification").click(function () {
    var LmsInactiveNotification = {
        IsSalesPersonNotification: $("input[name=SalesPersonNotification]:checked").val() == "1" ? true : false,
        SalesPersonNotificationHours: parseInt($("#ui_ddlNotInteractedTimeOfSalesPerson").val()),
        SalesPersonNotificationMail: $('#ui_radNotInteractedSendMail:checked').length,
        SalesPersonNotificationSms: $('#ui_radNotInteractedSendSMS:checked').length,
        SalesPersonNotificationWhatsapp: $('#ui_radNotInteractedSendWhatsapp:checked').length,

        IsReportingPersonNotification: $("input[name=ReportingPersonNotification]:checked").val() == "1" ? true : false,
        ReportingPersonNotificationHours: parseInt($("#ui_ddlNotInteractedTimeOfReportingPerson").val()),
        ReportingPersonNotificationMail: $('#ui_radNotInteractedSendMailOfReportingPerson:checked').length,
        ReportingPersonNotificationSms: $('#ui_radNotInteractedSendSMSOfReportingPerson:checked').length,
        ReportingPersonNotificationWhatsapp: $('#ui_radNotInteractedSendWhatsappOfReportingPerson:checked').length,

        IsReportingPersonNotificationSenior: $('#ui_schsenior:checked').length == 1 ? true : false,
        IsReportingPersonNotificationGroup: $('#ui_IsGroup:checked').length == 1 ? true : false,
        ReportingPersonNotificationGroupId: parseInt($("#ui_dllgrpsch").val())
    };

    if (LmsInactiveNotification.IsSalesPersonNotification == 1 && LmsInactiveNotification.SalesPersonNotificationMail != 1 && LmsInactiveNotification.SalesPersonNotificationSms != 1 && LmsInactiveNotification.SalesPersonNotificationWhatsapp != 1) {
        ShowErrorMessage(GlobalErrorList.LmsInactiveNotification.SalesPersonNotification);
        return false;
    }
    if (LmsInactiveNotification.IsReportingPersonNotification == 1 && LmsInactiveNotification.ReportingPersonNotificationMail != 1 && LmsInactiveNotification.ReportingPersonNotificationSms != 1 && LmsInactiveNotification.ReportingPersonNotificationWhatsapp != 1) {
        ShowErrorMessage(GlobalErrorList.LmsInactiveNotification.ReportingPersonNotification);
        return false;
    }

    if (LmsInactiveNotification.IsReportingPersonNotification == 1 && LmsInactiveNotification.IsReportingPersonNotificationSenior != 1 && LmsInactiveNotification.IsReportingPersonNotificationGroup != 1) {
        ShowErrorMessage(GlobalErrorList.LmsInactiveNotification.ReportingPersonNotificationSenior);
        return false;
    }

    if (LmsInactiveNotification != undefined) {
        $.ajax({
            url: "/Prospect/InactiveNotification/StoreInactiveNotification",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'lmsNotification': LmsInactiveNotification }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Id > 0) {
                    ShowSuccessMessage(GlobalErrorList.LmsInactiveNotification.SuccessMessage);
                }
                else if (response.Id <= 0 && response.error != null && response.error != "") {
                    ShowAjaxError(response.error);
                }
            },
            error: ShowAjaxError
        });
    }
});

$("input[name=SalesPersonNotification]").click(function () {
    if ($("input[name=SalesPersonNotification]:checked").val() == "1")
        $("#dvSales").show();
    else
        $("#dvSales").hide();
});

$("input[name=ReportingPersonNotification]").click(function () {
    if ($("input[name=ReportingPersonNotification]:checked").val() == "1")
        $("#dvReport").show();
    else
        $("#dvReport").hide();
});
