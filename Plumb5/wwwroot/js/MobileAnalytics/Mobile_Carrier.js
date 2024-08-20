
$(document).ready(function () {
    ExportFunctionName = "CarrierExport";
    RemoveExportDataRange();
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
        url: "/MobileAnalytics/MobileApp/CarrierReportCount",
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
        url: "/MobileAnalytics/MobileApp/CarrierReport",
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
    if (response != undefined && response != null && response.Table != undefined && response.Table != null && response.Table.length > 0) {
        CurrentRowCount = response.Table.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs = "";

        $.each(response.Table, function () {
            var currentDateData = ConvertDateObjectToDateTime(this.LocalDate);

            var startdate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 00:00:00";
            var enddate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 23:59:59";

            var fromdate = ConvertDateTimeToUTC(startdate);
            fromdate = fromdate.getFullYear() + '-' + PrefixZero((fromdate.getMonth() + 1)) + '-' + PrefixZero(fromdate.getDate()) + " " + PrefixZero(fromdate.getHours()) + ":" + PrefixZero(fromdate.getMinutes()) + ":" + PrefixZero(fromdate.getSeconds());

            var todate = ConvertDateTimeToUTC(enddate);
            todate = todate.getFullYear() + '-' + PrefixZero((todate.getMonth() + 1)) + '-' + PrefixZero(todate.getDate()) + " " + PrefixZero(todate.getHours()) + ":" + PrefixZero(todate.getMinutes()) + ":" + PrefixZero(todate.getSeconds());

            reportTableTrs += "<tr>" +
                /*"<td>" + monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate() + "</td>" +*/
                "<td class='text-left'>" + (this.Carrier != '' && this.Carrier != undefined ? (this.Carrier.length > 50 ? "<span title='" + this.Carrier + "'>" + this.Carrier.toString().substring(0, 50) + "..</span>" : this.Carrier) : "Unknown") + "</td>" +
                "<td>" + fn_AverageTime(this.AvgTime) + "</td>" +
                "<td>" + (this.UniqueVisits != "0" ? "<a class='ViewPermission' href='/MobileAnalytics/MobileApp/UniqueVisits?dur=0&Frm=" + fromdate + "&To=" + todate + "&Carrier=" + (this.Carrier != "" && this.Carrier && this.Carrier != undefined ? this.Carrier.replace("'", "^") : "unknown") + "'>" + this.UniqueVisits + "</a>" : this.UniqueVisits) + "</td>" +
                "<td>" + this.PageViews + "</td>" +
                "<td>" + this.Session + "</td>" +
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