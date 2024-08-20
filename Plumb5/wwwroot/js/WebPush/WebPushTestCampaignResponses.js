function getWebPushCampaignResponses() {


    $("#dvcampaignContacts").removeClass('hideDiv');
    $("#thEmail ,#thBounce, #thUrls,#thUnique").addClass('hideDiv');

    $("#dv_campaignContacts").removeClass('w-450').removeClass('w-650');

    GetOnlyUTCDateTimeRange(1);
    ShowPageLoading();
    TotalInnerRowCount = 0;
    CurrentInnerRowCount = 0;
    MaxInnerCount();
}


function CallBackInnerPaging() {
    CurrentInnerRowCount = 0;
    GetInnerReport();
}

function MaxInnerCount() {

    $.ajax({
        url: "/WebPush/ScheduleCampaign/GetMaxCount",
        type: 'Post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        success: function (response) {
            TotalInnerRowCount = response.returnVal;

            if (TotalInnerRowCount > 0) {
                GetInnerReport();
            }
            else {
                SetNoRecordContent('ui_tblInnerReportData', 2, 'ui_tbodyInnerReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetInnerReport() {
    InnerFetchNext = GetInnerNumberOfRecordsPerPage();

    $.ajax({
        url: "/WebPush/ScheduleCampaign/GetCampaignResponses",
        type: 'Post',
        data: JSON.stringify({ 'OffSet': InnerOffSet, 'FetchNext': InnerFetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindInnerReport,
        error: ShowAjaxError
    });


}

function BindInnerReport(response) {
    SetNoRecordContent('ui_tblInnerReportData', 2, 'ui_tbodyInnerReportData');
    if (response != undefined && response != null) {
        CurrentInnerRowCount = response.length;
        InnerPagingPrevNext(InnerOffSet, CurrentInnerRowCount, TotalInnerRowCount);

        var reportTableTrs = "";

        $.each(response, function (m) {

            
            reportTableTrs += '<tr><td class="text-left td-icon">' + this.MachineId + '</td>' +
                                        '<td>' + this.IsViewed + '</td>' +
                                        '<td>' + this.IsClicked + '</td>' +
                                        '<td>' + this.IsClosed + '</td>' +
                                        '<td>' + this.IsUnsubscribed + '</td>' +
            '</tr>';


        });

        $("#ui_tbodyInnerReportData").html(reportTableTrs);
        ShowInnerPagingDiv(true);
    }
    else {
        ShowInnerPagingDiv(false);
    }
    HidePageLoading();
}

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
});

function GetOnlyUTCDateTimeRange(dateDuration) {
    var fromdate, todate;
    duration = dateDuration;


    if (dateDuration == 1) {
        fromdate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));
        todate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));
    }   

    FromDateTime_JsDate = fromdate;
    ToDateTime_JsDate = todate;

    var startdate = fromdate.getFullYear() + '-' + AddingPrefixZeroDayMonth((fromdate.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(fromdate.getDate()) + " 00:00:00";
    var enddate = todate.getFullYear() + '-' + AddingPrefixZeroDayMonth((todate.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(todate.getDate()) + " 23:59:59";

    fromdate = ConvertDateTimeToUTC(startdate);
    fromdate = fromdate.getFullYear() + '-' + AddingPrefixZeroDayMonth((fromdate.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(fromdate.getDate()) + " " + AddingPrefixZeroDayMonth(fromdate.getHours()) + ":" + AddingPrefixZeroDayMonth(fromdate.getMinutes()) + ":" + AddingPrefixZeroDayMonth(fromdate.getSeconds());

    todate = ConvertDateTimeToUTC(enddate);
    todate = todate.getFullYear() + '-' + AddingPrefixZeroDayMonth((todate.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(todate.getDate()) + " " + AddingPrefixZeroDayMonth(todate.getHours()) + ":" + AddingPrefixZeroDayMonth(todate.getMinutes()) + ":" + AddingPrefixZeroDayMonth(todate.getSeconds());

    FromDateTime = fromdate;
    ToDateTime = todate;
}

function AddingPrefixZeroDayMonth(n) {
    return (n < 10) ? ("0" + n) : n;
}