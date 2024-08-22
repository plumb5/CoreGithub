$(document).ready(function () {
    ShowPageLoading();
    ExportFunctionName = "AdWordsExportReport";
    GetUTCDateTimeRange(2);
});
function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    MaxCount();
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    GetReport();
}
function MaxCount() {
    $.ajax({
        url: "/Analytics/Traffic/PaidCampaignsReportCount",
        type: 'Post',
        data: JSON.stringify({ 'Action': 'GetAdwordsMaxCount', 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
                $.each(response.Table1, function () {
                    TotalRowCount = this.TotalRows;
                });
            }

            if (TotalRowCount > 0) {
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tableReport', 6, 'ui_trbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}
function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();

    $.ajax({
        url: "/Analytics/Traffic/PaidCampaignsReport",
        type: 'Post',
        data: JSON.stringify({ 'Action': 'GetAdwordsDetails', 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'start': OffSet, 'end': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    SetNoRecordContent('ui_tableReport', 6, 'ui_trbodyReportData');
    if (response != undefined && response != null && response.ds.Table1 != undefined && response.ds.Table1 != null && response.ds.Table1.length > 0) {
        CurrentRowCount = response.ds.Table1.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        $("#ui_trbodyReportData").html('');
        $("#ui_tableReport").removeClass('no-data-records');

        var reportTableTrs, UniqueVisits;
        $.each(response.ds.Table1, function () {
            //**** For Output Cache ToDateTime *******
            ToDateTime = response.CurrentUTCDateTimeForOutputCache;
            //**** For Output Cache ToDateTime *******
            UniqueVisits = (this.UniqueVisitors != "0" ? "<a class='ViewPermission' href='/Analytics/Uniques/UniqueVisits?dur=" + duration + "&Frm=" + FromDateTime + "&To=" + ToDateTime + "&AdWords=" + this.PageName.replaceAll('&', '@@@@').toString() + "'>" + this.UniqueVisitors + "</a>" : this.UniqueVisitors);
            reportTableTrs += "<tr>" +
                //"<td class='text-center iframe'><i class='icon ion-ios-eye-outline' data-toggle='popover' data-page=" + this.EntryPage +" ></i></td>" +
                "<td class='text-center'><a href='" + this.EntryPage + "' target='_blank' title='Click to open the page in a new tab'><i class='icon ion-android-open'></i></a></td>" +
                "<td class='text-left'><div class='groupnamewrap'><div class='nametxticnwrp'><span class='pr-4'>" + this.PageName + " </span></div></div></td>" +
                "<td>" + this.PageViews + "</td>" +
                "<td>" + this.Session + "</td>" +
                "<td>" + UniqueVisits + "</td>" +
                "<td>" + $.datepicker.formatDate("M dd yy", ConvertUTCDateTimeToLocal(this.Recency)) + " " + PlumbTimeFormat(ConvertUTCDateTimeToLocal(this.Recency)) + "</td>" +
                "</tr>";
        });
        $("#ui_tableReport").removeClass('no-data-records');
        $("#ui_trbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
        BindIframe();
    } else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
}
