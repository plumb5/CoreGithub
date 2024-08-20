
var mobilepushReportRequest = { MobilePushSendingSettingId: 0, Sent: 0, IsViewed: 0, IsClicked: 0, IsClosed: 0, IsUnsubscribed: 0, NotSent: 0, WorkFlowId: 0 };
var Action = "";
$(document).on('click', '.sentpopup', function () {
    var campsenddets = $(this).attr("data-sentdetail");
    $(".camppopupwrppr").addClass("hideDiv");
    $("#ui_exportClickDownload").addClass("hideDiv");
    if (campsenddets != "Error") {
        $("#dvappcampaignUsers").removeClass('hideDiv');
        $(".popupbodycont").removeClass("pad-10");
        $(".popupItem").addClass("popup-tbl").removeClass('w-650').addClass("w-450");
        $(".popuptitle h6").html(`${campsenddets} Details`);
        $("#ui_Paggingdiv").show(); $("#ui_Groupsdiv").addClass("hideDiv");
        $("#MobileSent").removeClass('hideDiv');
        $("#ui_exportClickDownload").addClass("hideDiv");
    } else if (campsenddets == "Error") {
        $("#dvappcampaignUsers").removeClass('hideDiv');
        $(".popupbodycont").removeClass("pad-10");
        $(".popupItem").addClass("popup-tbl").removeClass('w-450').addClass("w-650");
        $(".popuptitle h6").html(`${campsenddets} Details`);
        $("#ui_Paggingdiv").show(); $("#ui_Groupsdiv").addClass("hideDiv");
        $("#MobileError").removeClass('hideDiv');
        $("#ui_exportClickDownload").addClass("hideDiv");
    }
});

function getAppCampaignUsers(action, id, WfId) {
    mobilepushReportRequest = { MobilePushSendingSettingId: 0, Sent: 0, IsViewed: 0, IsClicked: 0, IsClosed: 0, IsUnsubscribed: 0, NotSent: 0, WorkFlowId: 0 };
    mobilepushReportRequest.MobilePushSendingSettingId = id;
    mobilepushReportRequest.WorkFlowId = WfId;
    $("#dvappcampaignUsers").removeClass('hideDiv');

    Action = action = action.toLowerCase();
    if (action == 'sent') {
        mobilepushReportRequest.Sent = 1;
        $("#spnAppResponsesHead").html("SENT DETAILS");
    }
    else if (action == "view") {
        mobilepushReportRequest.IsViewed = 1;
        $("#spnAppResponsesHead").html("Viewed DETAILS");
    }
    else if (action == "click") {
        mobilepushReportRequest.IsClicked = 1;
        $("#spnAppResponsesHead").html("Clicked DETAILS");
    }
    else if (action == "close") {
        mobilepushReportRequest.IsClosed = 1;
        $("#spnAppResponsesHead").html("Closed DETAILS");
    }

    else if (action == "unsubscrib" || action == "bounce") {
        mobilepushReportRequest.IsUnsubscribed = 1;
        if (WfId == 0)
            $("#spnAppResponsesHead").html("UNSUBSCRIBED DETAILS");
        else
            $("#spnAppResponsesHead").html("BOUNCED DETAILS");
    }
    else if (action == "notsent") {
        mobilepushReportRequest.NotSent = 1;
        $("#spnAppResponsesHead").html("Error DETAILS");
    }
    else if (action == "not clicked") {
        mobilepushReportRequest.IsViewed = 1;
        mobilepushReportRequest.IsClicked = -1;
        $("#spnAppResponsesHead").html("Not Clicked DETAILS");
    }


    var webUrl = window.location.href.toLowerCase();
    if (webUrl.indexOf('journey') == -1) {
        FromDateTime = null; ToDateTime = null;
    }

    ShowPageLoading();
    MobilePushTotalInnerRowCount = 0;
    MobilePushCurrentInnerRowCount = 0;
    MaxMobilePushInnerCount(action);
}

function CallBackMobilePushInnerPaging() {
    MobilePushCurrentInnerRowCount = 0;
    GetMobilePushInnerReport();
}

function MaxMobilePushInnerCount(action) {

    $.ajax({
        url: "/mobilepushnotification/MobilePushCampaignResponseReport/MaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'mobpushReport': mobilepushReportRequest, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            MobilePushTotalInnerRowCount = response.returnVal;


            if (window.location.href.toLowerCase().indexOf('journey') > -1) {
                if (Action == 'sent' || Action == 'view' || Action == 'click' || Action == 'close' || Action == 'not clicked') {
                    $("#MobileError").addClass('hideDiv');
                    $("#MobileSent").removeClass('hideDiv');
                } else {
                    $("#MobileSent").addClass('hideDiv');
                    $("#MobileError").removeClass('hideDiv');
                }
            }

            if (MobilePushTotalInnerRowCount > 0) {
                GetMobilePushInnerReport(action);
            }
            else {
                SetNoRecordContent('ui_tblMobilePushInnerReportData', 3, 'ui_tbodyMobilePushInnerReportData');
                SetNoRecordContent('ui_tblMobilePushInnerReportErrorData', 4, 'ui_tbodyMobilePushInnerReportErrorData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetMobilePushInnerReport(action) {
    MobilePushInnerFetchNext = GetInnerMobilePushNumberOfRecordsPerPage();

    $.ajax({
        url: "/mobilepushnotification/MobilePushCampaignResponseReport/GetReportDetails",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'mobpushReport': mobilepushReportRequest, 'OffSet': MobilePushInnerOffSet, 'FetchNext': MobilePushInnerFetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) { BindMobilePushInnerReport(response, action) },

        error: ShowAjaxError
    });


}

function BindMobilePushInnerReport(response, action) {
    SetNoRecordContent('ui_tblMobilePushInnerReportData', 3, 'ui_tbodyMobilePushInnerReportData');
    SetNoRecordContent('ui_tblMobilePushInnerReportErrorData', 4, 'ui_tbodyMobilePushInnerReportErrorData');
    if (response != undefined && response != null) {
        MobilePushCurrentInnerRowCount = response.length;
        InnerMobilePushPagingPrevNext(MobilePushInnerOffSet, MobilePushCurrentInnerRowCount, MobilePushTotalInnerRowCount);

        var reportTableTrs = "";
        if (action != 'notsent' && action != 'bounce') {
            $.each(response, function (m) {
                let SentDate = this.Date != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.Date)) : "NA";
                reportTableTrs += '<tr><td class="text-left td-icon">' + this.DeviceId + '</td>' +
                    '<td>' + this.P5UniqueId + '</td>' +
                    '<td>' + SentDate + '</td>' +
                    '</tr>';


            });
            $("#ui_tbodyMobilePushInnerReportData").html(reportTableTrs);
            ShowMobilePushInnerPagingDiv(true);
        }
        else {
            $.each(response, function (m) {
                let ErrorMessage = this.ErrorMessage != undefined && this.ErrorMessage != null ? this.ErrorMessage : "NA";
                let SentDate = this.Date != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.Date)) : "NA";
                reportTableTrs += '<tr><td class="text-left td-icon">' + this.DeviceId + '</td>' +
                    '<td>' + this.P5UniqueId + '</td>' +
                    '<td>' + SentDate + '</td>' +
                    '<td>' + ErrorMessage + '</td>' +
                    '</tr>';


            });
            $("#ui_tbodyMobilePushInnerReportErrorData").html(reportTableTrs);
            ShowMobilePushInnerPagingDiv(true);
        }
    }
    else {
        ShowMobilePushInnerPagingDiv(false);
    }
    HidePageLoading();
}

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
});