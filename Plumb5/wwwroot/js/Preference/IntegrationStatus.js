$(document).ready(function () {
    BindAccounts();
    HidePageLoading();
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

            GetStatus();
        },
        error: ShowAjaxError
    });
};

function GetStatus() {
    ShowPageLoading();
    $.ajax({
        url: "/Preference/IntegrationStatus/GetWebTracking",
        type: 'POST',
        data: JSON.stringify({ 'AccountId': $("#ddlAccount").val() }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}
function BindReport(response) {
    if (response != undefined && response != null) {

        $(".statuswrp").removeClass("pending").removeClass("success");
        $(".statuswrp").addClass("pending").html('Pending');

        $("#dvClickToCall,#dvWhatsApp").removeClass("pending").html('Coming Soon');

        if (response.WebTracking == true)
            $("#dvWebTracking").removeClass("pending").addClass("success").html('Success');
        if (response.EventTracking == true)
            $("#dvEventTracking").removeClass("pending").addClass("success").html('Success');
        if (response.EmailSetup == true)
            $("#dvEmailSetup").removeClass("pending").addClass("success").html('Success');
        if (response.SiteSearch == true)
            $("#dvSiteSearch").removeClass("pending").addClass("success").html('Success');
        if (response.EmailVerification == true)
            $("#dvEmailVerification").removeClass("pending").addClass("success").html('Success');
        if (response.SpamTester == true)
            $("#dvSpamTester").removeClass("pending").addClass("success").html('Success');
        if (response.SmsSetup == true)
            $("#dvSmsSetup").removeClass("pending").addClass("success").html('Success');
        if (response.WebPushTracking == true)
            $("#dvWebPushTracking").removeClass("pending").addClass("success").html('Success');
        if (response.MobileSdkTracking == true)
            $("#dvMobileSdkTracking").removeClass("pending").addClass("success").html('Success');
        if (response.ClickToCallSetup == true)
            $("#dvClickToCall").removeClass("pending").addClass("success").html('Success');
        if (response.WhatsAppSetup == true)
            $("#dvWhatsApp").removeClass("pending").addClass("success").html('Success');
    }
    HidePageLoading();
}

$("#ddlAccount").change(function () {
    GetStatus();
});

$("#dvEmailSetup").click(function () {
    if ($("#dvEmailSetup").hasClass("pending"))
        window.location.href = "/Mail/MailSettings";
});

$("#dvSmsSetup").click(function () {
    if ($("#dvSmsSetup").hasClass("pending"))
        window.location.href = "/Sms/SmsSettings";
});