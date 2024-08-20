$(document).ready(function () {
    //CheckSiteSearchConfiguration();
    HidePageLoading();
});
//function CheckSiteSearchConfiguration() {
//    $.ajax({
//        url: "/Analytics/SiteSearch/CheckSiteSearchConfigurationExist",
//        type: 'Post',
//        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (response) {
//            if (response.returnVal == 0)
//                $('#dvSiteSearchNotConfig').show();
//            else
//                $('#dvSiteSearchRequestReceived').show();
//            HidePageLoading();
//        },
//        error: ShowAjaxError
//    });
//}
$('#btn_ContactSupport').click(function () {
    ShowPageLoading();
    var SiteSearchUrl = $('#txtSiteUrl').val();
    if (SiteSearchUrl == '') {
        ShowErrorMessage(GlobalErrorList.SiteSearch.siteurl_error);
        HidePageLoading();
        return;
    }
    if (!regExpUrl.test($.trim(SiteSearchUrl))) {
        $("#txtSiteUrl").focus();
        ShowErrorMessage(GlobalErrorList.SiteSearch.url_errormsg);
        HidePageLoading();
        return;
    }
    
    
    $.ajax({
        url: "/Analytics/SiteSearchConfiguration/SendSiteSearchRequestMail",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Plumb5AccountName': Plumb5AccountName, 'Plumb5AccountDomain': Plumb5AccountDomain, 'SiteSearchUrl': SiteSearchUrl }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            
            if (response) {
                ShowSuccessMessage(GlobalErrorList.SiteSearch.MailSent_Success);
                //    $('#dvSiteSearchRequestReceived').show();
                //    $('#dvSiteSearchNotConfig').hide();
            }
            else {
                ShowErrorMessage(GlobalErrorList.SiteSearch.MailSent_failed);
            }
            $('#txtSiteUrl').val('');
            HidePageLoading();
        },
        error: ShowAjaxError
    });

});