
$(document).ready(function () {
    BindAccounts();
});

function BindAccounts() {
    $.ajax({
        url: "/Preference/IpRestrictions/GetAccounts",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response, function () {
                $('#ddlAccount').append('<option value=' + $(this)[0].AccountId + '>' + $(this)[0].AccountName + '</option>');
            });

            GetChannelCreditDetails();
        },
        error: ShowAjaxError
    });
};

function GetChannelCreditDetails() {
    ShowPageLoading();
    $.ajax({
        url: "/Preference/ChannelCredits/GetChannelCreditDetails",
        type: 'POST',
        data: JSON.stringify({ 'accountId': $("#ddlAccount").val() }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindCreditDetails,
        error: ShowAjaxError
    });
}

function BindCreditDetails(response) {
    if (response != undefined && response != null) {
        $("#ui_h1ChannelEmailTotal").html(response.TotalMailAllocated);
        $("#ui_h1ChannelEmailAvailable").html(response.TotalMailRemaining);
        $("#ui_h1ChannelEmailUsed").html(response.TotalMailConsumed);
        $("#ui_h1ChannelSmsTotal").html(response.TotalSmsAllocated);
        $("#ui_h1ChannelSmsAvailable").html(response.TotalSmsRemaining);
        $("#ui_h1ChannelSmsUsed").html(response.TotalSmsConsumed);
        $("#ui_h1ChannelEmailVerificationTotal").html(response.TotalEmailVerifiedAllocated);
        $("#ui_h1ChannelEmailVerificationAvailable").html(response.TotalEmailVerifiedRemaining);
        $("#ui_h1ChannelEmailVerificationUsed").html(response.TotalEmailVerifiedConsumed);
        $("#ui_h1ChannelSpamScoreTotal").html(response.TotalSpamCheckAllocated);
        $("#ui_h1ChannelSpamScoreAvailable").html(response.TotalSpamCheckRemaining);
        $("#ui_h1ChannelSpamScoreUsed").html(response.TotalSpamCheckConsumed);
        $("#ui_h1ChannelMobilePushTotal").html(response.TotalMobilePushAllocated);
        $("#ui_h1ChannelMobilePushAvailable").html(response.TotalMobilePushRemaining);
        $("#ui_h1ChannelMobilePushUsed").html(response.TotalMobilePushConsumed);
        $("#ui_h1ChannelWebPushTotal").html(response.TotalWebPushAllocated);
        $("#ui_h1ChannelWebPushAvailable").html(response.TotalWebPushRemaining);
        $("#ui_h1ChannelWebPushUsed").html(response.TotalWebPushConsumed);
        $("#ui_h1ChannelWhatsappTotal").html(response.TotalWhatsAppAllocated);
        $("#ui_h1ChannelWhatsappAvailable").html(response.TotalWhatsAppRemaining);
        $("#ui_h1ChannelWhatsappUsed").html(response.TotalWhatsappConsumed);
    }
    HidePageLoading();
}

$("#ddlAccount").change(function () {
    GetChannelCreditDetails();
});