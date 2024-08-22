var PageUrl = "";

$(document).ready(function () {
    HidePageLoading();
});

$("#btnTagForm").click(function () {
    if (ExtensionExists()) {
        ShowPageLoading();

        if ($.trim($("#ui_txtInPageUrl").val()).length == 0) {
            HidePageLoading();
            $("#ui_txtInPageUrl").focus();
            ShowErrorMessage(GlobalErrorList.TaggedFormEditor.PageUrlEmpty);
            return false;
        }

        if ($.trim($("#ui_txtInPageUrl").val()).length > 0) {
            if (!$.trim($("#ui_txtInPageUrl").val()).match(/^http([s]?):\/\/.*/)) {
                HidePageLoading();
                $("#ui_txtInPageUrl").focus();
                ShowErrorMessage(GlobalErrorList.TaggedFormEditor.pageurl_invalid);
                return false;
            }
        }

        if (!regExpUrl.test($.trim($("#ui_txtInPageUrl").val()))) {
            HidePageLoading();
            $("#ui_txtInPageUrl").focus();
            ShowErrorMessage(GlobalErrorList.TaggedFormEditor.correct_pageurl);
            return false;
        }

        HidePageLoading();

        PageUrl = $.trim($("#ui_txtInPageUrl").val());
        CallExtension(PageUrl, Plumb5AccountId);
        //var FinalPageUrl = "" + OnlineUrl + "/FormExt/initextension.html?browseURL=" + PageUrl + "&AdsId=" + Plumb5AccountId + "&FormId=0&FormScriptId=0";
    }
    else {
        ShowErrorMessage(GlobalErrorList.CreateTaggedForm.ChromeExtensionNotExists);
    }
});

function ExtensionExists() {
    try {
        var http = new XMLHttpRequest();
        http.open('HEAD', "chrome-extension://mkilmbkdaobkmpjhjjhmhcmibneacaib/js/divinject.js", false);
        http.send();
        return http.status != 404;
    }
    catch {
        return false;
    }
}

function CallExtension(PageUrl, Plumb5AccountId) {
    try {

        var editorExtensionId = "mkilmbkdaobkmpjhjjhmhcmibneacaib";
        var PageUrlDetails = document.location.origin;

        chrome.runtime.sendMessage(editorExtensionId, { AdsId: Plumb5AccountId, FormId: 0, FormScriptId: 0, PageUrl: PageUrlDetails },
            function (response) {
                if (response != undefined) {
                    if (response.success) {
                        ShowSuccessMessage(GlobalErrorList.CreateTaggedForm.SuccessRedirectToConfiguration);
                        setTimeout(function () { window.open('' + PageUrl + '', '_blank'); }, 1000);
                    }
                    else if (!response.success) {
                        ShowErrorMessage(GlobalErrorList.CreateTaggedForm.ChromeExtensionError);
                    }
                }
                else {
                    ShowErrorMessage(GlobalErrorList.CreateTaggedForm.ChromeExtensionAppNotExists);
                }
            });
    }
    catch {
        ShowErrorMessage(GlobalErrorList.CreateTaggedForm.ChromeExtensionAppNotExists);
        return false;
    }
}