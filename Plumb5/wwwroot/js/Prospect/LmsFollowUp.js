var UserId = 0;
var Userinfolist = new Array();
var Finalresponsedetails = [];

$(document).ready(function () {
    GetUTCDateTimeRange(2);
});
function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    LMSFallowUpReportUtil.GetMaxCount();
}
var LMSFallowUpReportUtil = {
    GetUsers: function () {
        $.ajax({
            url: "/Prospect/LmsFollowUp/GetUsers",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'UserId': Plumb5UserId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    Userinfolist.push(response);
                }
            },
            error: ShowAjaxError
        });
    },
    GetMaxCount: function () {
        SetNoRecordContent('ui_tblReportData', 0, 'ui_tbodyReportData');

        $.ajax({
            url: "/Prospect/LmsFollowUp/GetMaxCount",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'UserId': 0, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'UserinfoName': $("#txtlmsfollowupsearchbyname").val().toLowerCase() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                TotalRowCount = result;
                if (TotalRowCount > 0) {
                    $("#ExportDivFollowup").removeClass("hideDiv");
                    ShowPagingDiv(true);
                    LMSFallowUpReportUtil.GetReport();
                }

                else {
                    $("#ExportDivFollowup").addClass("hideDiv");
                    ShowPagingDiv(false);
                    SetNoRecordContent('ui_tableReport', 5, 'ui_tbodyReportData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetReport: function () {

        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/Prospect/LmsFollowUp/GetReport",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'UserId': 0, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext, 'UserinfoName': $("#txtlmsfollowupsearchbyname").val().toLowerCase() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            //success: LMSCampaignReportUtil.BindReport,
            success: function (response) {
                if (response != null && response != undefined) {
                    LMSFallowUpReportUtil.BindReport(response)
                }
                else {

                    $("#ui_tableReport").addClass('no-data-records');
                    SetNoRecordContent('ui_tableReport', 5, 'ui_tbodyReportData');
                }
            },

            error: ShowAjaxError
        });
    },
    BindReport: function (response) {
        SetNoRecordContent('ui_tableReport', 5, 'ui_trbodyReportData');
        if (response != undefined && response != null && response.length > 0) {
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            var reportTableTrs = "";
            for (var i = 0; i < response.length; i++) {
                reportTableTrs += '<tr>' +
                    '<td>' + response[i].UserinfoName + '</td>' +
                    '<td><a href="javascript:void(0)">' + response[i].PlannedCount + '</a></td>' +
                    '<td><a href="javascript:void(0)">' + response[i].MissedCount + '</a></td>' +
                    '<td><a href="javascript:void(0)">' + response[i].CompleteCount + '</a></td>' +
                    '</tr>';
            }
            ShowExportDiv(true);
            ShowPagingDiv(true);
            $("#ui_tableReport").removeClass('no-data-records');
            $("#ui_tbodyReportData").html(reportTableTrs);
            HidePageLoading();
        }

    },
}
$("#ui_exportOrDownload").click(function () {
    ExportFunctionName = "ExportLmsFallowUpReport";
    $("#ui_ddl_ExportDataRange").attr("disabled", false);
});

$(document).ready(function () {
    $("#txtlmsfollowupsearchbyname").keydown(function (event) {
        if (event.keyCode == 13) {
            if ($("#txtlmsfollowupsearchbyname").val().length == 0) {
                return false;
            }

            CallBackFunction();
            event.preventDefault();
            return false;
        }
    });
});
$("#txtlmsfollowupsearchbyname").keyup(function () {
    const key = event.key;
    if (key === "Backspace") {
        if (CleanText($.trim($("#txtlmsfollowupsearchbyname").val())).length == 0) {
            CallBackFunction();
        }
        return false;
    }
});