﻿
$(document).ready(function () {
    GetUTCDateTimeRange(2);
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    GetReport();
}
$(document).ready(function () {
    ExportFunctionName = "SiteSearchTermExport";
});


function GetReport() {
    SetNoRecordContent('ui_tableReport', 3, 'ui_tbodyReportData');
    $.ajax({
        url: "/Analytics/SiteSearchTerms/GetSearchTerm",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    if (response != undefined && response != null && response.Table != undefined && response.Table != null && response.Table.length > 0) {
        CurrentRowCount = response.Table.length;
        $("#ui_tbodyReportData").html('');
        $("#ui_tableReport").removeClass('no-data-records');
        ShowExportDiv(true);

        $.each(response.Table, function () {
            BindEachReport(this);
        });

    } else {
        ShowExportDiv(false);
    }
    HidePageLoading();
}

function BindEachReport(eachData) {
    let reportTablerows = `<tr>
                                    <td class="td-wid-20">${eachData.SearchedData}</td>
                                    <td class="td-wid-10">${eachData.UniqueSearch}</td>
                                    <td class="td-wid-15">${eachData.PageViews}</td>
                                </tr>`;
    $("#ui_tbodyReportData").append(reportTablerows);
}