
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
        url: "/Analytics/Content/GetPopularPagesCount",
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
        url: "/Analytics/Content/GetPopularPages",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'start': OffSet, 'end': FetchNext,'channel':'Web'}),
         
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}
function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
    if (response != undefined && response != null && response.PopularPageData.Table1 != undefined && response.PopularPageData.Table1 != null && response.PopularPageData.Table1.length > 0) {

        CurrentRowCount = response.PopularPageData.Table1.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs;

        $.each(response.PopularPageData.Table1, function () {
            var url = this.PageName;
            var onlineUrlIndex, lastcontent;
            if (url.substring(url.length - 1) == "/")
                url = url.slice(0, -1);
            onlineUrlIndex = url.lastIndexOf("/");
            lastcontent = url.substring(onlineUrlIndex, url.length);
            if (lastcontent.length > 30)
                lastcontent = lastcontent.substring(0, 30) + "..";

            var page = (this.P.replace(/\plumb5email=/g, 'p5redirectemail=').replace(/\p5contactid=/g, 'p5redirectcontact='));

            //**** For Output Cache ToDateTime *******
            if (duration == 1)
                ToDateTime = response.CurrentUTCDateTimeForOutputCache;
            //**** For Output Cache ToDateTime *******

           // var exHtml = '<td class="text-center temppreveye"><i class="icon ion-ios-eye-outline position-relative">' + templatepreview + '</i></td>';
            reportTableTrs += "<tr>" +
                "<td class='text-center'><a href='" + page + "' target='_blank' title='Click to open the page in a new tab'><i class='icon ion-android-open'></i></a></td>" +
                "<td class='text-left'><a title='" + this.PageName + "' href='PageAnalysis?page=" + this.PageName.replaceAll('&', '@@@@') + "&popular=1' target=\"_blank\">" + lastcontent + "</a></td>" +
                "<td>" + fn_AverageTime(this.AvgTime) + "</td>" +
                "<td>" + this.PageViews + "</td>" +
                "<td>" + (this.UniqueVisits != "0" ? "<a class='ViewPermission' href='/Analytics/Uniques/UniqueVisits?dur="+duration+"&Frm=" + FromDateTime + "&To=" + ToDateTime + "&PageName=" + this.PageName.toString().replace(/&/g, '~').replace('?', '$').replace('#', '^') + "&Channel=Web'>" + this.UniqueVisits + "</a>" : this.UniqueVisits) + "</td>" +
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