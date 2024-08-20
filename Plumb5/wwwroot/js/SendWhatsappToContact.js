var WhatsappContact = { ContactId: 0 };

$(document).ready(function () {
    SendWhatsappToContactUtil.GetTemplateList();
});

var SendWhatsappToContactUtil = {
    ResetWhatsappDetails: function () {
        $("#addlmsuserwhatsappnumb").val("");
        $("#ui_whatsappUCPtemp").val("0").change();
    },
    GetTemplateList: function () {
        ShowPageLoading();
        $.ajax({
            url: "/WhatsApp/ScheduleCampaign/GetTemplateList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (AllTemplateList) {
                if (AllTemplateList != undefined && AllTemplateList != null && AllTemplateList.length > 0) {
                    $.each(AllTemplateList, function () {
                        $("#ui_whatsappUCPtemp").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    });
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
}

$("#ui_iconCloseWhatsappPopUp, #ui_btnCancelWhatsapp").click(function () {
    SendWhatsappToContactUtil.ResetWhatsappDetails();
    $("#ui_divSendWhatsappPopUp").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
});

$('#ui_whatsappUCPtemp').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$(document).on("click", "#ui_btnSendWhatsapp", function () {
    if (CleanText($.trim($("#addlmsuserwhatsappnumb").val())).length == 0) {
        ShowErrorMessage(GlobalErrorList.CreateWhatsAppTestCampaign.TestPhoneNumberError);
        return false;
    }

    if ($("#ui_whatsappUCPtemp").val() == "0") {
        ShowErrorMessage(GlobalErrorList.WhatsAppSchedule.NoTemplate);
        return false;
    }

    let TemplateId = $("#ui_whatsappUCPtemp").val();
    let PhoneNumber = $("#addlmsuserwhatsappnumb").val();

    ShowPageLoading();

    $.ajax({
        url: "/WhatsApp/WhatsAppTemplates/SendIndividualTestWhatsAapp",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WhatsAppTemplateId': TemplateId, 'PhoneNumber': PhoneNumber }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.SentStatus)
                ShowSuccessMessage(GlobalErrorList.CreateWhatsAppTestCampaign.TestMessageSuccess);
            else
                ShowErrorMessage(response.Message);
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});