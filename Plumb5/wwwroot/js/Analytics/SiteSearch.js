$(document).ready(function () {
    CheckSiteSearchConfiguration();
});
function CheckSiteSearchConfiguration() {
    $.ajax({
        url: "/Analytics/SiteSearch/CheckSiteSearchConfigurationExist",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.returnVal == 0)
                $('#dvSiteSearchNotConfig').show();
            else
                $('#dvSiteSearchRequestReceived').show();
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}
$('#btn_ContactSupport').click(function () {
    ShowPageLoading();
    $.ajax({
        url: "/Analytics/SiteSearch/SendSiteSearchRequestMail",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Plumb5AccountName': Plumb5AccountName, 'Plumb5AccountDomain': Plumb5AccountDomain }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                $('#dvSiteSearchRequestReceived').show();
                $('#dvSiteSearchNotConfig').hide();
            }
                

            HidePageLoading();
        },
        error: ShowAjaxError
    });

});