var ConfigDetails = { Id: 0, ProviderName: "", IsDefaultProvider: 0, AccountName: "", ApiKey: "", IsPromotionalOrTransactionalType: 0, ConfigurationUrl: "" };
//$(document).ready(function () {
    GetUnsubscribeUrlDetails();
//});

function GetUnsubscribeUrlDetails (){

    $.ajax({
        url: "/Mail/MailSettings/GetUnsubscribeUrlDetails",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: BindUnsubscribedUrl,
        error: ShowAjaxError
    });
};
function BindUnsubscribedUrl(unsubscribeDetail) {
    $("#dv_MainUnsubscribedTitle").show();
    for (let i = 0; i < unsubscribeDetail.mailConfigurationDetails.length; i++) {
        if (unsubscribeDetail.mailConfigurationDetails[i].UnsubscribeUrl != undefined && unsubscribeDetail.mailConfigurationDetails[i].UnsubscribeUrl != null && unsubscribeDetail.mailConfigurationDetails[i].UnsubscribeUrl != "") {
            $("#ui_txtUnsubscribeUrl").val(unsubscribeDetail.mailConfigurationDetails[i].UnsubscribeUrl);
            $("#ui_txtUnsubscribeUrl").prop("disabled", true);
            $("#ui_chkDescriptionMessage").prop("checked", true);
            $("#lbldesc").attr("title", "Uncheck for editing");
            break;
        }
        else {
            $("#ui_txtUnsubscribeUrl").prop("disabled", false);
            $("#lbldesc").attr("title", "");
            $("#ui_chkDescriptionMessage").prop("checked", false);
            break;
        }
    }
}
$("#ui_chkDescriptionMessage").click(function () {
    if ($("#ui_chkDescriptionMessage").is(":checked")) {
        $("#ui_txtUnsubscribeUrl").prop("disabled", true);
        $("#ui_chkDescriptionMessage").prop("checked", true);
        $("#lbldesc").attr("title", "Uncheck for editing");
    }
    else {
        $("#ui_txtUnsubscribeUrl").prop("disabled", false);
        $("#lbldesc").attr("title", "");
        
    }
});
$("#ui_btnUpdateUnsubscribeUrl").click(function () {
    let RegUrl = /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    ShowPageLoading();
    if ($("#ui_txtUnsubscribeUrl").val().length == 0) {
        ShowErrorMessage(GlobalErrorList.MailSettings.invalidunsubscribeurl_error);
        HidePageLoading();
        return false;
    }
    if (RegUrl.test($("#ui_txtUnsubscribeUrl").val()) == false) {
        ShowErrorMessage(GlobalErrorList.MailSettings.invalidunsubscribeurl_error);
        HidePageLoading();
        return false;
    }
    let UnsubscribeUrl = $("#ui_txtUnsubscribeUrl").val();

    $.ajax({
        url: "/Mail/MailSettings/SaveUnsubscribeUrl",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, "UnsubscribeUrl": UnsubscribeUrl }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                if (UnsubscribeUrl != undefined && UnsubscribeUrl != null && UnsubscribeUrl != "") {
                    $("#ui_txtUnsubscribeUrl").prop("disabled", true);
                    $("#ui_chkDescriptionMessage").prop("checked", true);
                }
                ShowSuccessMessage(GlobalErrorList.MailSettings.unsubscribeurlsaved_message);
            }
            else {
                ShowErrorMessage(GlobalErrorList.MailSettings.unsubscribeurl_error);
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});
