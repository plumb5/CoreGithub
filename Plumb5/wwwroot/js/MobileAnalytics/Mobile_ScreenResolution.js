
$(document).ready(function () {
    ExportFunctionName = "AppResolutionExport";
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
        url: "/MobileAnalytics/MobileApp/ResolutionReportCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response != undefined && response != null && response.Table != undefined && response.Table != null && response.Table.length > 0) {
                $.each(response.Table, function () {
                    TotalRowCount = this.TotalRows;
                });
            }

            if (TotalRowCount > 0) {
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}


function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();

    $.ajax({
        url: "/MobileAnalytics/MobileApp/ResolutionReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'endcount': FetchNext, 'startcount': OffSet }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });

}


function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');
    if (response != undefined && response != null && response.Table != undefined && response.Table != null && response.Table.length > 0){
        CurrentRowCount = response.Table.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs = "";

        $.each(response.Table, function () {
            reportTableTrs += "<tr>" +
                "<td>" + this.Resolution + "</td>" +
                "<td>" + this.PageViews + "</td>" +
                "<td>" + (this.UniqueVisits != "0" ? "<a class='ViewPermission' href='/MobileAnalytics/MobileApp/UniqueVisits?dur=0&Frm=" + FromDateTime + "&To=" + ToDateTime + "&Resolution=" + this.Resolution + "'>" + this.UniqueVisits + "</a>" : this.UniqueVisits) + "</td>" +
                "<td>" + fn_AverageTime(this.AvgTime) + "</td>" +
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