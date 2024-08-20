var AllTemplateList;
$(document).ready(function () {
    ExportFunctionName = "ScheduledWhatsappAlertsExport";
    LmsDefaultInitialiseUtil.GetLmsGroupList();
    GetUTCDateTimeRangeForNext(1);
    IntializeWhatsappTemplate();
});

function CallBackFunction() {
    ShowPageLoading();
    CurrentRowCount = TotalRowCount = 0;

    MaxCount();
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    GetReport();
}

function IntializeWhatsappTemplate() {
    $.ajax({
        url: "/General/GetTemplateList",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            AllTemplateList = response;
            if (response != undefined && response != null && response.length > 0) {
                $.each(response, function () {
                    $("#ui_ddlWhatsappTemplate").append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");
                });
            }
        },
        error: ShowAjaxError
    });
}
function MaxCount() {
    $.ajax({
        url: "/Prospect/Reports/GetScheduledWhatsappAlertMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'UserId': Plumb5UserId, 'Fromdate': FromDateTime, 'Todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = response.returnVal;

            if (TotalRowCount > 0) {
                setTimeout(function () { GetReport(); }, 500);

            }
            else {
                SetNoRecordContent('ui_tblReportData', 7, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/Prospect/Reports/GetScheduledWhatsappAlertDetails",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'UserId': Plumb5UserId, 'Fromdate': FromDateTime, 'Todate': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: BindReport,
        error: ShowAjaxError
    });
}
function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 7, 'ui_tbodyReportData');
    if (response != undefined && response != null && response.length > 0) {

        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs, statusclass, EditContentdisplay;

        $.each(response, function () {
            var lmsgroupid = this.LmsGroupId
            var sourcename = "NA";
            var sourcesample = JSLINQ(SourceList).Where(function () {
                return (this.LmsGroupId == lmsgroupid);

            });
            if (sourcesample.items[0] != null && sourcesample.items[0] != "" && sourcesample.items[0] != undefined) {
                sourcename = `${sourcesample.items[0].Name}`;
            }
            if (this.AlertScheduleStatus == 'Scheduled') {
                EditContentdisplay = "";
                statusclass = 'text-color-queued';
            }
            else if (this.AlertScheduleStatus == 'Completed') {
                EditContentdisplay = 'style=\'display:none\'';
                statusclass = 'text-color-success';
            }
            else if (this.AlertScheduleStatus == 'InProgress') {
                EditContentdisplay = 'style=\'display:none\'';
                statusclass = 'text-color-progress';
            }

            let name = this.Name != null && this.Name != undefined ? this.Name : "NA";

            reportTableTrs +=
                "<tr>" +
                "<td class='text-center'>" +
                "<div class='smsprevwrap'><i class='icon ion-ios-eye-outline'></i>" +
                "<div class='smsprevItemwrap bubbrep'>" +
                "<div class='chat'>" +
                "<div class='yours messages'>" +
                "<div class='message last'style='white-space:pre-wrap; width:auto; text-align:initial;'>" + this.TemplateContent + "" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</td>" +
                "<td class='frmresucp' onclick='ShowContactUCP(null,null," + this.ContactId + ");'><i class='fa fa-address-card-o'></i></td>" +
                "<td class='m-p-w-140 text-left'>" +
                "<div class='groupnamewrap'>" +
                "<div class='nameTxtWrap'>" + this.TemplateName + "</div>" +
                "<div class='tdcreatedraft'>" +
                "<div class='dropdown'>" +
                "<button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='icon ion-android-more-vertical mr-0'></i></button>" +
                "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='filterbycontacts'>" +
                "<a data-chatpop='chattransdet' " + EditContentdisplay + " class='dropdown-item chatrepvist ContributePermission' href='javascript:void(0)' onclick=\"BindScheduledWhatsappAlertDetails(this," + this.Id + "," + this.TemplateId + "," + this.ContactId + "," + this.IsPromotionalOrTransnational + ",'" + this.AlertScheduleDate + "')\">Edit</a>" +
                "<div class='dropdown-divider' " + EditContentdisplay + "></div>" +
                "<a data-toggle='modal' data-target='#deleterow' class='dropdown-item FullControlPermission' href='javascript:void(0)' onclick=\"DeleteScheduledWhatsappAlertsConfirm(" + this.Id + ");\">Delete</a>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</td>" +
                "<td>" + sourcename + "</td>" +
                "<td>" + name + "</td>" +
                "<td>" + this.PhoneNumber + "</td>" +
                "<td><span class='" + statusclass + "'> " + this.AlertScheduleStatus + "</span ></td>" +
                "<td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.AlertScheduleDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.AlertScheduleDate)) + "</td>" +
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
    CheckAccessPermission("Prospect");
}
function DeleteScheduledWhatsappAlertsConfirm(Id) {
    $("#deleteRowConfirmwhatsapp").attr("onclick", "DeleteScheduledWhatsappAlerts(" + Id + ");");
}
function DeleteScheduledWhatsappAlerts(Id) {
    ShowPageLoading();
    $.ajax({
        url: "/Prospect/Reports/DeleteScheduledWhatsappAlerts",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'Id': Id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.ScheduledWhatsappAlerts.Delete_SuccessMessage);
                GetReport();
            }
        },
        error: ShowAjaxError
    });
}