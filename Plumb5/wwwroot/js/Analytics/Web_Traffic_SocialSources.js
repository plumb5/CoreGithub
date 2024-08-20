$(document).ready(function () {
    GetUTCDateTimeRange(2);
    ExportFunctionName = "SocialSourceReportExport";
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    MaxCount();
}
function MaxCount() {
    $.ajax({
        url: "/Analytics/Traffic/SocialTrafficReportCount",
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
                SetNoRecordContent('ui_tableReport', 5, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}


function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/Analytics/Traffic/SocialSourceReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'start': OffSet, 'end': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    SetNoRecordContent('ui_tableReport', 5, 'ui_tbodyReportData');
    if (response !== undefined && response !== null && response.SocialSourceData.Table1 !== undefined && response.SocialSourceData.Table1 !== null && response.SocialSourceData.Table1.length > 0) {

        CurrentRowCount = response.SocialSourceData.Table1.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs;
        $.each(response.SocialSourceData.Table1, function () {
            //**** For Output Cache ToDateTime *******
            if (duration == 1)
                ToDateTime = response.CurrentUTCDateTimeForOutputCache;
            //**** For Output Cache ToDateTime *******
            reportTableTrs += "<tr>" +
                "<td class='text-left'>" + this.Source + "</td>" +
                "<td>" + (this.UniqueVisits != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=" + duration + "&Frm=" + FromDateTime + "&To=" + ToDateTime + "&Social=" + this.Source.toString().replace(/&/g, '~').replace('?', '$') + "'>" + this.UniqueVisits + "</a>" : this.UniqueVisits) + "</td> " +
                "<td>" + this.Session + "</td>" +
                "<td>" + fn_AverageTime(this.AvgTime) + "</td>" +
                //"<td><a href='SourcePages?type=social&domain=" + this.Source + "&P5Duration=" + duration + (duration === 5 ? "&FromDate=" + FromDateTime + "&ToDate=" + ToDateTime : "") + "'>View</a></td>" +
                "<td><a class='popViewHref' href='javascript:void(0)' data-colheadtitle='Page Visits' onclick=ViewPageVisited('" + this.Source + "','Social');>View</a></td>" +
                "</tr> ";
        });
        $("#ui_tableReport").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
    } else {
        ShowExportDiv(false);
    }

    HidePageLoading();
}

function ViewPageVisited(domain, type) {
    ShowPageLoading();
    $("#ui_trsourcereport").html('');

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
    $(".rightPopupwrap").addClass('showFlx');
    $(".popupslideItem").addClass('show');

    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
        $.each(response.Table1, function () {
            BindEachSourceReport(this);
        });
    }
    else {
        $("#ui_trsourcereport").html(GlobalErrorList.Web_Traffic_Referral.no_data_error);
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

