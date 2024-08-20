$(document).ready(function () {
    ExportFunctionName = "PopularPageExport";
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
        url: "GetPopularPagesCount",
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
                SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "GetPopularPages",
        type: 'Post',
        data: "{'accountId':'" + Plumb5AccountId + "','duration':'" + duration + "','fromdate':'" + FromDateTime + "','todate':'" + ToDateTime + "','start':'" + OffSet + "','end':'" + FetchNext + "','channel':'App'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}
function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');
    if (response != undefined && response != null && response.Table != undefined && response.Table != null && response.Table.length > 0) {
        CurrentRowCount = response.Table.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs;

        $.each(response.Table, function () {
            var url = this.PageName;
            var onlineUrlIndex, lastcontent;
            //if (url.substring(url.length - 1) == "/")
            //    url = url.slice(0, -1);
            onlineUrlIndex = url.lastIndexOf("/");
            lastcontent = url.substring(onlineUrlIndex, url.length);
            if (lastcontent.length > 30)
                lastcontent = lastcontent.substring(0, 30) + "..";

            reportTableTrs += "<tr><td class='text-left'>" + lastcontent + "</td>" +
                "<td>" + fn_AverageTime(this.AvgTime) + "</td>" +
                "<td>" + this.PageViews + "</td>" +
                "<td>" + (this.UniqueVisits != "0" ? "<a class='ViewPermission' href='/MobileAnalytics/MobileApp/UniqueVisits?dur=0&Frm=" + FromDateTime + "&To=" + ToDateTime + "&PageName=" + this.PageName.toString().replace(/&/g, '~').replace('?', '$').replace('#', '^') + "&Channel=App'>" + this.UniqueVisits + "</a>" : this.UniqueVisits) + "</td>" +
                "<td>" + (this.City == null || this.City == "" ? 'Unknown City' : this.City) + "</td></tr>";
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
