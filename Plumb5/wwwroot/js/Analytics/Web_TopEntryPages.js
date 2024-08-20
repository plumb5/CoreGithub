$(document).ready(function () {
    ShowPageLoading();
    ExportFunctionName = "ExportTopEntryExitPages";
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
        url: "/Analytics/Content/GetTopEntryExitPagesCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'key': 'Entry' }),
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
                SetNoRecordContent('ui_tableReport', 5, 'ui_trbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}


function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();

    $.ajax({
        url: "/Analytics/Content/GetTopEntryExitPages",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'key': 'Entry', 'start': OffSet, 'end': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    $("#ui_trbodyReportData").html('');
    SetNoRecordContent('ui_tableReport', 5, 'ui_trbodyReportData');
    if (response != undefined && response != null && response.ds.Table1 != undefined && response.ds.Table1 != null && response.ds.Table1.length > 0) {
        CurrentRowCount = response.ds.Table1.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        $("#ui_tableReport").removeClass('no-data-records');
        $("#ui_trbodyReportData").html('');
        ShowExportDiv(true);
        ShowPagingDiv(true);

        $.each(response.ds.Table1, function () {
            BindEachReport(this, response.CurrentUTCDateTimeForOutputCache);
        });

    } else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
}

function BindEachReport(topEntyPage, CurrentUTCDateTimeForOutputCache) {
    //**** For Output Cache ToDateTime *******
    if (duration == 1)
        ToDateTime = CurrentUTCDateTimeForOutputCache;
    //**** For Output Cache ToDateTime *******
    /** Template string literal has been implement */
    let UniqueVisits = (topEntyPage.UniqueVisits != "0" ? "<a class='ViewPermission' href='/Analytics/Uniques/UniqueVisits?dur=" + duration +"&Frm=" + FromDateTime + "&To=" + ToDateTime + "&Entry=" + topEntyPage.PageName.toString().replace(/&/g, '~').replace('?', '$').replace('#', '^') + "'>" + topEntyPage.UniqueVisits + "</a>" : topEntyPage.UniqueVisits);

    let lastcontent = "",UniqueVisitorLink = "";
    if (topEntyPage.PageName != undefined && topEntyPage.PageName != null && topEntyPage.PageName.length > 0) {
        lastcontent = SubstringPageURL(topEntyPage.PageName);
    }

    let pagName = (topEntyPage.PageName.replace(/\plumb5email=/g, 'p5redirectemail=').replace(/\p5contactid=/g, 'p5redirectcontact='));
    let PageName = "<a title='" + pagName + "' href='PageAnalysis?page=" + pagName.replaceAll('&', '@@@@') + "&entry=1' target=\"_blank\">" + lastcontent + "</a>";
    
    if (duration == 1)
        UniqueVisitorLink = "<td>" + UniqueVisits + "</td>";
    else
        UniqueVisitorLink = "<td class='tdiconwrap'><i class='icon ion-ios-information uniqueicon' onclick='LoadCachedUniqueVisits(\"TopEntry\",\"" + topEntyPage.PageName + "\", \"" + FromDateTime + "\",\"" + ToDateTime + "\");'></i>" + UniqueVisits + "</td>";

    let reportTablerows = "<tr>" +
        "<td class='text-center'><a href='" + topEntyPage.PageName + "' target='_blank' title='Click to open the page in a new tab'><i class='icon ion-android-open'></i></a></td>" +
        "<td class='text-left'>" + PageName + "</td>" +
        "<td>" + topEntyPage.PageViews + "</td>" +
        "" + UniqueVisitorLink+"" +
        "<td>" + topEntyPage.MaxVisitedCity + "</td>" +
        "</tr>";

    $("#ui_trbodyReportData").append(reportTablerows);
}
