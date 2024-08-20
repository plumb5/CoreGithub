$(document).ready(function () {
    ExportFunctionName = "MobileDevicesExport";
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
        url: "/MobileAnalytics/MobileApp/BindDeviceCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response !== undefined && response !== null && response.Table !== undefined && response.Table !== null && response.Table.length > 0) {
                $.each(response.Table, function () {
                    TotalRowCount = this.TotalRows;
                });
            }

            if (TotalRowCount > 0) {
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
                ShowExportDiv(false);
                ShowPagingDiv(false);
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/MobileAnalytics/MobileApp/DeviceReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'start': OffSet, 'end': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
    if (response !== undefined && response !== null && response.Table !== undefined && response.Table !== null && response.Table.length > 0) {
        CurrentRowCount = response.Table.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        var reportTableTrs;
        $.each(response.Table, function (m) {
            var DeviceName = (this.Manufacturer === "" || this.Manufacturer === "unknown" ? "" : this.Manufacturer) + " " + (this.DeviceName === null ? "Unknown" : this.DeviceName);

            reportTableTrs += "<tr>" +
                "<td class='text-left'>" + DeviceName.trim() + "</td>" +
                "<td>" + this.Session + "</td>" +
                "<td>" + (this.UniqueVisit != "0" ? "<a class='ViewPermission' href ='/MobileAnalytics/MobileApp/UniqueVisits?dur=0&Frm=" + FromDateTime + "&To=" + ToDateTime + " &Device=" + this.DeviceId + "&Name=" + this.DeviceName + "'>" + this.UniqueVisit + "</a>" : this.UniqueVisit) + "</td>" +
                "<td>" + fn_AverageTime(this.TotalTime) + "</td>" +
                "</tr>";
        });
        ShowExportDiv(true);
        ShowPagingDiv(true);
        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
    }
    else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
}
