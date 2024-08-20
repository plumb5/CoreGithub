
var getWebHookSendingSettingId = 0; var getSUcess = 1;

function getWebHookUsers(action, id, WfId) {
    getWebHookSendingSettingId = parseInt(id);
    $("#dvwebhookUsers").removeClass('hideDiv');

    action = action.toLowerCase();
    if (action == 'sucess') {
        getSUcess = 1;
        $("#thSucess").show();
        $("#thError").hide();
        $("#spnWebHookResponsesHead").html("Sucess DETAILS");
    }
    else if (action == "failure") {
        getSUcess = 0;
        $("#thSucess").hide();
        $("#thError").show();
        $("#spnWebHookResponsesHead").html("Failure DETAILS");
    }



    var webUrl = window.location.href.toLowerCase();
    if (webUrl.indexOf('journey') == -1) {
        FromDateTime = null; ToDateTime = null;
    }

    ShowPageLoading();
    WebhookTotalInnerRowCount = 0;
    WebhookCurrentInnerRowCount = 0;
    MaxWebhookInnerCount();
}

function CallBackWebhookInnerPaging() {
    WebhookCurrentInnerRowCount = 0;
    GetWebhookInnerReport();
}

function MaxWebhookInnerCount() {

    $.ajax({
        url: "/Journey/WebHook/MaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WebHookSendingSettingId': getWebHookSendingSettingId, 'Sucess': getSUcess, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            WebhookTotalInnerRowCount = response;

            if (WebhookTotalInnerRowCount > 0) {
                GetWebhookInnerReport();
            }
            else {

                if (getSUcess == 1) {
                    SetNoRecordContent('ui_tblWebhookInnerReportData', 3, 'ui_tbodyWeebhookInnerReportData');
                } else {
                    SetNoRecordContent('ui_tblWebhookInnerReportData', 4, 'ui_tbodyWeebhookInnerReportData');
                }

                ShowWebhookInnerPagingDiv(false);
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetWebhookInnerReport() {
    WebhookInnerFetchNext = GetInnerWebhookNumberOfRecordsPerPage();

    $.ajax({
        url: "/Journey/WebHook/GetReportDetails",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WebHookSendingSettingId': getWebHookSendingSettingId, 'Sucess': getSUcess, 'OffSet': WebhookInnerOffSet, 'FetchNext': WebhookInnerFetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindWebhookInnerReport,
        error: ShowAjaxError
    });


}

function BindWebhookInnerReport(response) {
    if (getSUcess == 1) {
        SetNoRecordContent('ui_tblWebhookInnerReportData', 3, 'ui_tbodyWeebhookInnerReportData');
    } else {
        SetNoRecordContent('ui_tblWebhookInnerReportData', 4, 'ui_tbodyWeebhookInnerReportData');
    }
    if (response != undefined && response != null) {
        WebhookCurrentInnerRowCount = response.length;
        InnerWebhookPagingPrevNext(WebhookInnerOffSet, WebhookCurrentInnerRowCount, WebhookTotalInnerRowCount);

        var reportTableTrs = "";
        $("#ui_tbodyWeebhookInnerReportData").html("");
        $.each(response, function (m) {
            let SentDate = this.SentDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.SentDate)) : "NA";

            var getMsg = removeTags(this.ErrorMessage);
            var ErrorMsg = getSUcess != 1 && this.ErrorMessage != null ? '<td><i id="error-' + m + '" class="icon ion-ios-information" data-toggle="popover" data-trigger="hover" data-content="' + getMsg + '" data-original-title="" title="" aria-describedby="popover841577"></i></td>' : "";

            reportTableTrs = '<tr><td class="text-left td-icon">' + (this.EmailId != null ? this.EmailId : 'NA') + '</td>' +
                '<td>' + (this.PhoneNumber != null ? this.PhoneNumber : 'NA') + '</td>' +
                ErrorMsg +
                '<td>' + SentDate + '</td>' +
                '</tr>';
            $("#ui_tbodyWeebhookInnerReportData").append(reportTableTrs);
            $('#error-' + m).popover();

        });

        ShowWebhookInnerPagingDiv(true);
    }
    else {
        ShowWebhookInnerPagingDiv(false);
    }
    HidePageLoading();
}

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
});

function removeTags(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();
    return str.replace(/(<([^>]+)>)/ig, '');
}

