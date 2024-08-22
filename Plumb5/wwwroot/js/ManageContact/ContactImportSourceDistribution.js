var ContactImportOverViewId = 0;

$(document).ready(function () {
    TotalRowCount = 0;
    CurrentRowCount = 0;
    ContactImportOverViewId = parseInt(urlParam("ImportId"));
    SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');
    if (ContactImportOverViewId > 0) {
        GetSourceWiseData();
    }
    else {
        HidePageLoading();
    }
});


function GetSourceWiseData() {
    $.ajax({
        url: "/ManageContact/ContactImportSourceDistribution/GetContactImportSourceWiseData",
        type: 'Post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ 'accountId': Plumb5AccountId, "ContactImportOverviewId": ContactImportOverViewId }),
        success: BindSourceImportOverView,
        error: ShowAjaxError
    });
}

function BindSourceImportOverView(response) {
    SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');
    if (response != undefined && response != null && response.length > 0) {
        CurrentRowCount = response.length;

        var reportTableTrs = "";

        $.each(response, function () {
            let GroupName = $(this)[0].GroupName == null || $(this)[0].GroupName == "" ? "NA" : $(this)[0].GroupName != null && $(this)[0].GroupName.length > 15 ? $(this)[0].GroupName.substring(0, 15) + ".." : $(this)[0].GroupName;

            var rejectLink = $(this)[0].RejectedCount;
            if ($(this)[0].RejectedCount > 0) {
                rejectLink = "<a href='javascript:void(0);' data-toggle='modal' data-target='#ui_divSourceLevelRejectFileType' onClick='SourceLevelRejectDownLoad(" + $(this)[0].LmsGroupId + "," + $(this)[0].ContactImportOverviewId + ");'>" + $(this)[0].RejectedCount + "<i class='icon ion-android-arrow-down'></i></a>";
            }

            var contactLevelRejectLink = $(this)[0].ContactErrorRejectedCount;
            if ($(this)[0].ContactErrorRejectedCount > 0) {
                contactLevelRejectLink = "<a href='javascript:void(0);' data-toggle='modal' data-target='#ui_divContactLevelRejectFileType' onClick='ContactLevelRejectDownLoad(" + $(this)[0].LmsGroupId + "," + $(this)[0].ContactImportOverviewId + ");'>" + $(this)[0].ContactErrorRejectedCount + "<i class='icon ion-android-arrow-down'></i></a>";
            }

            reportTableTrs += "<tr>" +
                "<td title='" + $(this)[0].GroupName + "'>" + GroupName + "</td>" +
                "<td>" + $(this)[0].SuccessCount + "</td>" +
                "<td>" + rejectLink + "</td>" +
                "<td>" + contactLevelRejectLink + "</td>" +
                "<td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].CreatedDate)) + "</td>" +
                "</tr>";
        });

        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
    }
    HidePageLoading();
}


function ContactLevelRejectDownLoad(SourceId, ImportId) {
    $("#ui_btnContactLevelRejectDataExport").prop("SourceId", SourceId);
    $("#ui_btnContactLevelRejectDataExport").prop("ImportId", ImportId);
    $("#ui_ddl_ContactLevelRejectExportFileType").val('csv');
    $("#ui_divContactLevelRejectFileType").modal('toggle');
}

$("#ui_btnContactLevelRejectDataExport").click(function () {
    ShowPageLoading();
    var ExportFileType = $("#ui_ddl_ContactLevelRejectExportFileType").val();
    var ImportId = $("#ui_btnContactLevelRejectDataExport").prop("ImportId");
    var SourceId = $("#ui_btnContactLevelRejectDataExport").prop("SourceId");

    $.ajax({
        url: "/ManageContact/ContactImportSourceDistribution/ContactLevelRejectFileExport",
        type: 'POST',
        data: JSON.stringify({
            'AccountId': Plumb5AccountId, 'ImportId': ImportId, 'GroupId': SourceId, 'FileType': ExportFileType
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status) {
                $("#ui_btnContactLevelRejectDataExport").removeProp("ImportId");
                $("#ui_btnContactLevelRejectDataExport").removeProp("SourceId");
                window.location.assign(response.MainPath);
                $('#ui_divContactLevelRejectFileType').modal('toggle');
            }
            else {
                ShowErrorMessage(GlobalErrorList.ExportData.session_expired);
                setTimeout(function () { window.location.href = "/Login"; }, 3000);
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});


function SourceLevelRejectDownLoad(SourceId, ImportId) {
    $("#ui_btnSourceLevelRejectDataExport").prop("SourceId", SourceId);
    $("#ui_btnSourceLevelRejectDataExport").prop("ImportId", ImportId);
    $("#ui_ddl_SourceLevelRejectExportFileType").val('csv');
    $("#ui_divSourceLevelRejectFileType").modal('toggle');
}

$("#ui_btnSourceLevelRejectDataExport").click(function () {
    ShowPageLoading();
    var ExportFileType = $("#ui_ddl_SourceLevelRejectExportFileType").val();
    var ImportId = $("#ui_btnSourceLevelRejectDataExport").prop("ImportId");
    var SourceId = $("#ui_btnSourceLevelRejectDataExport").prop("SourceId");

    $.ajax({
        url: "/ManageContact/ContactImportSourceDistribution/SourceLevelRejectFileExport",
        type: 'POST',
        data: JSON.stringify({
            'AccountId': Plumb5AccountId, 'ImportId': ImportId, 'GroupId': SourceId, 'FileType': ExportFileType
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status) {
                $("#ui_btnSourceLevelRejectDataExport").removeProp("ImportId");
                $("#ui_btnSourceLevelRejectDataExport").removeProp("SourceId");
                window.location.assign(response.MainPath);
                $('#ui_divSourceLevelRejectFileType').modal('toggle');
            }
            else {
                ShowErrorMessage(GlobalErrorList.ExportData.session_expired);
                setTimeout(function () { window.location.href = "/Login"; }, 3000);
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});