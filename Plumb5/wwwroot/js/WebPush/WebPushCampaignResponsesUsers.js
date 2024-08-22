
var webpushReportRequest = { WebPushSendingSettingId: 0, Sent: 0, IsViewed: 0, IsClicked: 0, IsClosed: 0, IsUnsubscribed: 0, NotSent: 0, WorkFlowId: 0 };

function getCampaignUsers(action, id, WfId) {

    $("#ui_exportWebPushDownload").removeClass("hideDiv");

    webpushReportRequest = { WebPushSendingSettingId: 0, Sent: 0, IsViewed: 0, IsClicked: 0, IsClosed: 0, IsUnsubscribed: 0, NotSent: 0, WorkFlowId: 0 };
    webpushReportRequest.WebPushSendingSettingId = id;
    webpushReportRequest.WorkFlowId = WfId;
    $("#dvcampaignUsers").removeClass('hideDiv');

    action = action.toLowerCase();

    if (action == 'sent') {
        webpushReportRequest.Sent = 1;
        $("#spnWebResponsesHead").html("SENT DETAILS");
    }
    else if (action == "view") {
        webpushReportRequest.IsViewed = 1;
        $("#spnWebResponsesHead").html("Viewed DETAILS");
    }
    else if (action == "click") {
        webpushReportRequest.IsClicked = 1;
        $("#spnWebResponsesHead").html("Clicked DETAILS");
    }
    else if (action == "close") {
        webpushReportRequest.IsClosed = 1;
        $("#spnWebResponsesHead").html("Closed DETAILS");
    }

    else if (action == "unsubscrib" || action == "bounce") {
        webpushReportRequest.IsUnsubscribed = 1;
        if (WfId == 0)
            $("#spnWebResponsesHead").html("UNSUBSCRIBED DETAILS");
        else
            $("#spnWebResponsesHead").html("BOUNCED DETAILS");
    }
    else if (action == "notsent") {
        webpushReportRequest.NotSent = 1;
        $("#spnWebResponsesHead").html("Error DETAILS");
    }
    else if (action == "not clicked") {
        webpushReportRequest.IsViewed = 1;
        webpushReportRequest.IsClicked = -1;
        $("#spnWebResponsesHead").html("Not Clicked DETAILS");
    }

    if (webpushReportRequest.NotSent == 1) {
        $("#ui_divsentview").addClass("hideDiv");
        $("#ui_divsenterror").removeClass("hideDiv");
    } else {
        $("#ui_divsenterror").addClass("hideDiv");
        $("#ui_divsentview").removeClass("hideDiv");
    }


    //var webUrl = window.location.href.toLowerCase();
    //if (webUrl.indexOf('journey') == -1) {
    //    FromDateTime = null; ToDateTime = null;
    //}

    ShowPageLoading();
    WebPushTotalInnerRowCount = 0;
    WebPushCurrentInnerRowCount = 0;
    MaxWebPushInnerCount();

    InnerOffSet = 0;
    InnerFetchNext = 0;
}

function CallBackWebPushInnerPaging() {
    WebPushCurrentInnerRowCount = 0;
    GetWebPushInnerReport();
}

function MaxWebPushInnerCount() {

    $.ajax({
        url: "/WebPush/WebPushCampaignResponseReport/MaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'webpushReport': webpushReportRequest, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            WebPushTotalInnerRowCount = response.returnVal;
            TotalInnerRowCount = response.returnVal;
            if (WebPushTotalInnerRowCount > 0) {
                GetWebPushInnerReport();
            }
            else {
                $("#ui_exportWebPushDownload").addClass("hideDiv");
                SetNoRecordContent('ui_tblWebPushInnerReportData', 2, 'ui_tbodyWebPushInnerReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetWebPushInnerReport() {
    WebPushInnerFetchNext = GetInnerWebPushNumberOfRecordsPerPage();
    InnerOffSet = WebPushInnerOffSet;
    InnerFetchNext = WebPushInnerFetchNext;
    $.ajax({
        url: "/WebPush/WebPushCampaignResponseReport/GetReportDetails",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'webpushReport': webpushReportRequest, 'OffSet': WebPushInnerOffSet, 'FetchNext': WebPushInnerFetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindWebPushInnerReport,
        error: ShowAjaxError
    });


}

function BindWebPushInnerReport(response) {
    SetNoRecordContent('ui_tblWebPushInnerReportData', 2, 'ui_tbodyWebPushInnerReportData');
    if (response != undefined && response != null) {

        //CurrentInnerRowCount = response.length;
        //InnerPagingPrevNext(InnerOffSet, CurrentInnerRowCount, TotalInnerRowCount);

        WebPushCurrentInnerRowCount = response.length;
        InnerWebPushPagingPrevNext(WebPushInnerOffSet, WebPushCurrentInnerRowCount, WebPushTotalInnerRowCount);

        var reportTableTrs = "";

        $.each(response, function (m) {
            let SentDate = this.Date != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.Date)) : "NA";

            if (webpushReportRequest.NotSent == 1) {
                reportTableTrs += '<tr><td class="text-left td-icon">' + this.MachineId + '</td>' +
                    '<td>' + this.P5UniqueId + '</td>' +
                    '<td>' + this.ErrorMessage + '</td>' +
                    '<td>' + SentDate + '</td>' +
                    '</tr>';
            } else {
                reportTableTrs += '<tr><td class="text-left td-icon">' + this.MachineId + '</td>' +
                    '<td>' + this.P5UniqueId + '</td>' +
                    '<td>' + SentDate + '</td>' +
                    '</tr>';
            }
        });

        $("#ui_tbodyWebPushInnerReportData").html(reportTableTrs);
        ShowWebPushInnerPagingDiv(true);
    }
    else {
        $("#ui_exportWebPushDownload").addClass("hideDiv");
        ShowWebPushInnerPagingDiv(false);
    }
    HidePageLoading();
}

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
});
$(document.body).on('click', '#ui_exportWebPushDownload', function (event) {
    ExportFunctionNameInnerPage = "/WebPush/WebPushCampaignResponseReport/Export";
    ExportChannel = "WebPush";
    $("#ui_ContactdownloadModal").modal('show');
});