$(document).ready(function () {
    ShowPageLoading();
    ExportFunctionName = "ExportSearchTrafficReport";
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
        url: "/Analytics/Traffic/SearchTrafficReportCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime }),
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
                SetNoRecordContent('ui_tableReport', 6, 'ui_trbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}


function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();

    $.ajax({
        url: "/Analytics/Traffic/SearchTrafficReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'start': OffSet, 'end': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    SetNoRecordContent('ui_tableReport', 6, 'ui_trbodyReportData');
    if (response != undefined && response != null && response.SearchTrafficData.Table1 != undefined && response.SearchTrafficData.Table1 != null && response.SearchTrafficData.Table1.length > 0) {
        CurrentRowCount = response.SearchTrafficData.Table1.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        $("#ui_trbodyReportData").html('');
        $("#ui_tableReport").removeClass('no-data-records');
        ShowExportDiv(true);
        ShowPagingDiv(true);

        $.each(response.SearchTrafficData.Table1, function () {
            BindEachReport(this, response.CurrentUTCDateTimeForOutputCache);
        });

    } else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
}

function BindEachReport(eachOrgranicSearch, CurrentUTCDateTimeForOutputCache) {
    //**** For Output Cache ToDateTime *******
    ToDateTime = CurrentUTCDateTimeForOutputCache;
    //**** For Output Cache ToDateTime *******
    let UniqueVisits = (eachOrgranicSearch.UniqueVisits != "0" ? "<a class='ViewPermission' href='/Analytics/Uniques/UniqueVisits?dur=" + duration + "&Frm=" + FromDateTime + "&To=" + ToDateTime + "&Search=" + eachOrgranicSearch.Source.toString().replace(/&/g, '~').replace('?', '$') + "'>" + eachOrgranicSearch.UniqueVisits + "</a>" : eachOrgranicSearch.UniqueVisits);
    let AvgTime = fn_AverageTime(eachOrgranicSearch.AvgTime);

    /** Template string literal has been implement */
    let reportTablerows = `<tr>
                                <td class="text-left">${eachOrgranicSearch.Source}</td>
                                <td>${UniqueVisits}</td>
                                <td>${eachOrgranicSearch.Session}</td>
                                <td>${AvgTime}</td>
                                <td><a class="popViewHref" href="javascript:void(0)" data-colheadtitle="Page Visits" onclick="ViewPageVisited('${eachOrgranicSearch.Source}',${duration},'search');">View</a> </td>
                                <td><a class="popViewHref" href="javascript:void(0)" data-colheadtitle="Search Keys" onclick="ViewSearchKeys('${eachOrgranicSearch.Source}',${duration});">View</a> </td>
                           </tr>`;
    $("#ui_trbodyReportData").append(reportTablerows);
}

function ViewPageVisited(domain, duration, type) {
    ShowPageLoading();
    $.ajax({
        url: "/Analytics/Traffic/SearchSourcePages",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'start': 0, 'end': 0, 'Source': domain, 'Type': type }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindSourceReport,
        error: ShowAjaxError
    });
}

function BindSourceReport(response) {
    $("#ui_trsourcereport").html('');

    let colHeadVal = $(this).attr("data-colheadTitle");
    $(".topbandWrap h6").html(colHeadVal);
    $(".rightPopupwrap").addClass('showFlx');
    $(".popupslideItem").addClass('show');
    $(".tbl-searchkey").addClass('hideDiv');
    $(".tbl-pageVisits").removeClass('hideDiv');
    $(".rightPopupwrap").addClass('showFlx');

    var rowCount = $("#ui_tableReport tbody tr").length;
    if (rowCount <= 5) {
        $("#ui_tableReport").parents(".tableWrapper").addClass("h-400");
    }

    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
        $.each(response.Table1, function () {
            BindEachSourceReport(this);
        });
    }
    else {
        $("#ui_trsourcereport").append(GlobalErrorList.Web_Traffic_OrganicSearch.no_data_error);
    }
    HidePageLoading();
}

function BindEachSourceReport(SourceReport) {
    let reportTablerows = `<tr>
                               <td class="text-left">${SourceReport.EntryPage}</td>
                               <td>${SourceReport.Total}</td>
                           </tr>`;
    $("#ui_trsourcereport").append(reportTablerows);
}


function ViewSearchKeys(domain, duration) {
    ShowPageLoading();
    $.ajax({
        url: "/Analytics/Traffic/SearchKeyReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'Source': domain, 'start': 0, 'end': 10, 'page': "0" }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindSearchReport,
        error: ShowAjaxError
    });
}

function BindSearchReport(response) {
    $("#ui_trsearchreport").html('');

    let colHeadVal = $(this).attr("data-colheadTitle");
    $(".topbandWrap h6").html(colHeadVal);
    $(".rightPopupwrap").addClass('showFlx');
    $(".popupslideItem").addClass('show');
    $(".tbl-pageVisits").addClass('hideDiv');
    $(".tbl-searchkey").removeClass('hideDiv');
    $(".rightPopupwrap").addClass('showFlx');

    var rowCount = $("#ui_tableReport tbody tr").length;
    if (rowCount <= 5) {
        $("#ui_tableReport").parents(".tableWrapper").addClass("h-400");
    }


    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
        $.each(response.Table1, function () {
            BindEachSerachReport(this);
        });
    }
    else {
        $("#ui_trsearchreport").append(GlobalErrorList.Web_Traffic_OrganicSearch.no_data_error);
    }
    HidePageLoading();
}

function BindEachSerachReport(SerachReport) {
    var SearchTooltipText = "";
    if (SerachReport.Searchby == "No Search Key") {
        SearchTooltipText = "<i class='icon ion-ios-help-outline' title='Search keyword is encrypted by 127.0.0.1:5500'></i>";
    }
    let reportTablerows = `<tr>
                              <td class="text-left td-icon">
                                    ${SerachReport.Searchby} ${SearchTooltipText}
                              </td>
                              <td>${SerachReport.Total}</td>
                           </tr>`;
    $("#ui_trsearchreport").append(reportTablerows);
}