
$(document).ready(function () {
    ExportFunctionName = "NetworkExport";
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
        url: "/Analytics/Audience/NetworkReportCount",
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
        url: "/Analytics/Audience/NetworkReport",
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
    if (response != undefined && response != null && response.NetworkData.Table1 != undefined && response.NetworkData.Table1 != null && response.NetworkData.Table1.length > 0) {
        CurrentRowCount = response.NetworkData.Table1.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs = "", UniqueVisitorLink = "";

        $.each(response.NetworkData.Table1, function () {
            var currentDateData = ConvertDateObjectToDateTime(this.LocalDate);

            var startdate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 00:00:00";
            var enddate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 23:59:59";

            var fromdate = ConvertDateTimeToUTC(startdate);
            fromdate = fromdate.getFullYear() + '-' + PrefixZero((fromdate.getMonth() + 1)) + '-' + PrefixZero(fromdate.getDate()) + " " + PrefixZero(fromdate.getHours()) + ":" + PrefixZero(fromdate.getMinutes()) + ":" + PrefixZero(fromdate.getSeconds());

            var todate = ConvertDateTimeToUTC(enddate);
            todate = todate.getFullYear() + '-' + PrefixZero((todate.getMonth() + 1)) + '-' + PrefixZero(todate.getDate()) + " " + PrefixZero(todate.getHours()) + ":" + PrefixZero(todate.getMinutes()) + ":" + PrefixZero(todate.getSeconds());

            if (duration == 1) {
                ToDateTime = response.CurrentUTCDateTimeForOutputCache;
                UniqueVisitorLink = "<td>" + (this.UniqueVisits != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=" + duration + "&Frm=" + FromDateTime + "&To=" + ToDateTime + "&Network=" + encodeURIComponent(this.Network) + "'>" + this.UniqueVisits + "</a>" : this.UniqueVisits) + "</td>";
            }
            else
                UniqueVisitorLink = "<td class='tdiconwrap'><i class='icon ion-ios-information uniqueicon' onclick='LoadCachedUniqueVisits(\"Network\",\"" + this.Network + "\",\"" + FromDateTime + "\",\"" + ToDateTime + "\");'></i>" + (this.UniqueVisits != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur="+duration+"&Frm=" + FromDateTime + "&To=" + ToDateTime + "&Network=" + encodeURIComponent(this.Network) + "'>" + this.UniqueVisits + "</a>" : this.UniqueVisits) + "</td>";
            reportTableTrs += "<tr>" +
               // "<td>" + monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate() + "</td>" +
                "<td class='text-left'>" + (this.Network.length > 50 ? "<span title='" + this.Network + "'>" + this.Network.toString().substring(0, 50) + "..</span>" : (this.Network.length != 0 || this.Network != '' ? this.Network : "unknown")) + "</td>" +
                "<td>" + fn_AverageTime(this.AvgTime) + "</td>" +
                "<td>" + this.PageViews + "</td>" +
               // "<td>" + (this.UniqueVisits != "0" ? "<a class='ViewPermission' href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + fromdate + "&To=" + todate + "&Network=" + encodeURIComponent(this.Network) + "'>" + this.UniqueVisits + " </a> <i class='icon ion-ios-information infocampresponse' onclick='LoadCachedUniqueVisits(\"Network\",\"" + this.Network + "\",\"" + fromdate + "\",\"" + todate + "\");'></i>"  : this.UniqueVisits) + "</td>" +
                "" + UniqueVisitorLink+" " +
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