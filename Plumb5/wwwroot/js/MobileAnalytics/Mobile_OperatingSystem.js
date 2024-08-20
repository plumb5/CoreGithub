$(document).ready(function () {
    ShowPageLoading();
    ExportFunctionName = "ExportOSReport";
    GetUTCDateTimeRange(2);
});

function CallBackFunction() {
    ShowPageLoading();
    OffSet = 0;
    OldOffset = 0;
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
        url: "/MobileAnalytics/MobileApp/OSReportCount",
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
                SetNoRecordContent('ui_tableReport', 4, 'ui_trbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}


function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();

    $.ajax({
        url: "/MobileAnalytics/MobileApp/OSReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'start': OffSet, 'end': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    $("#ui_trbodyReportData").html('');
    SetNoRecordContent('ui_tableReport', 4, 'ui_trbodyReportData');
    if (response != undefined && response != null && response.Table != undefined && response.Table != null && response.Table.length > 0) {
        CurrentRowCount = response.Table.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        $("#ui_tableReport").removeClass('no-data-records');
        $("#ui_trbodyReportData").html('');
        ShowExportDiv(true);
        ShowPagingDiv(true);

        $.each(response.Table, function () {
            BindEachReport(this);
        });

    } else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
}

function BindEachReport(operatingSystem) {
    /** Template string literal has been implement */
    let UniqueVisits = (operatingSystem.UniqueVisit != "0" ? "<a class='ViewPermission' href='/MobileAnalytics/MobileApp/UniqueVisits?dur=0&Frm=" + FromDateTime + "&To=" + ToDateTime + "&OS=" + operatingSystem.OSName + "'>" + operatingSystem.UniqueVisit + "[View]</a>" : operatingSystem.UniqueVisit);
    let TotalTime = (operatingSystem.AvgTime == null || operatingSystem.AvgTime == "0" ? "0d 0h 0m 0s" : fn_AverageTime(operatingSystem.AvgTime))
    let reportTablerows = `<tr>
                                <td class="text-left">${operatingSystem.OSName}</td>
                                <td>${operatingSystem.Session}</td>
                                <td>${UniqueVisits}</td>                                
                                <td>${TotalTime}</td>
                           </tr>`;
    $("#ui_trbodyReportData").append(reportTablerows);
}