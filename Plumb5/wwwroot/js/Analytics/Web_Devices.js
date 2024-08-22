
$(document).ready(function () {
    ExportFunctionName = "DeviceExport";
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
        url: "/Analytics/Audience/DeviceReportCount",
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
        url: "/Analytics/Audience/DeviceReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'start': OffSet, 'end': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });

}

function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');
    if (response != undefined && response != null && response.ReturnDataSet.MLDeviceinfoData.length != undefined) {
        CurrentRowCount = response.ReturnDataSet.MLDeviceinfoData.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs = "";

        $.each(response.ReturnDataSet.MLDeviceinfoData, function () {
            var DeviceNameData = (this.Device == undefined ? "Unknown" : this.Device.trim() == '' ? "Unknown" : this.Device);
            var DeviceName = (this.Device == undefined ? "Unknown" : this.Device.trim() == '' ? "Unknown" : this.Device == "NA NA" ? "NA" : this.Device);
            //**** For Output Cache ToDateTime *******
            ToDateTime = response.CurrentUTCDateTimeForOutputCache;
            //**** For Output Cache ToDateTime *******
            reportTableTrs += "<tr>" +
                "<td>" + DeviceName + "</td>" +
                "<td>" + this.PageViews + "</td>" +
                "<td>" + this.Session + "</td>" +
                "<td>" + (this.UniqueVisitors != "0" ? "<a class='ViewPermission' href ='/Analytics/Uniques/UniqueVisits?dur=" + duration + "&Frm=" + FromDateTime + "&To=" + ToDateTime + "&Device=" + DeviceNameData + "&DeviceId=" + this.DeviceId + "'>" + this.UniqueVisitors + "</a >" : this.UniqueVisitors) + "</td>" +
                "<td>" + fn_AverageTime(this.AvgTime) + "</td>" +
                "</tr>";
        });

        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowPagingDiv(true);
        ShowExportDiv(true);
    }
    else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
}