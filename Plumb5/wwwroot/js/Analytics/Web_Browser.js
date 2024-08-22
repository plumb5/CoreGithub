
$(document).ready(function () {
    ExportFunctionName = "BrowserExport";
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
        url: "/Analytics/Audience/BrowserReportCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime }),
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
                SetNoRecordContent('ui_tblReportData', 3, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}
function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/Analytics/Audience/BrowserReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'duration': duration, 'start': OffSet, 'end': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}
function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 3, 'ui_tbodyReportData');
    if (response != undefined && response != null && response.BrowserData.Table1 != undefined && response.BrowserData.Table1 != null && response.BrowserData.Table1.length > 0) {
        CurrentRowCount = response.BrowserData.Table1.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);


        var reportTableTrs;

        $.each(response.BrowserData.Table1, function () {
            //**** For Output Cache ToDateTime *******
            ToDateTime = response.CurrentUTCDateTimeForOutputCache;
            //**** For Output Cache ToDateTime *******

            reportTableTrs += "<tr>" +

                "<td class='td-wid-20'>" + this.Browser + "</td>" +
                "<td class='td-wid-10'>" + this.PageViews + "</td>" +
                //"<td class='td-wid-15'>" + this.UniqueVisitors + "</td>" +
                "<td class='td-wid-15'>" + fn_AverageTime(this.AvgTime) + "</td>" +
                "</tr>";
        });


        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
    } else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
}
