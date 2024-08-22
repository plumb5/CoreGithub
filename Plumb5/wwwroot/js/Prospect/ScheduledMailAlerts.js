var TemplateList;
$(document).ready(function () {
    ExportFunctionName = "ScheduledMailAlertsExport";
    GetUTCDateTimeRangeForNext(1); 
    LmsDefaultInitialiseUtil.GetLmsGroupList();
    ScheduledMailAlertsUtil.BindActiveEmailId();
});
function CallBackFunction() {
    ShowPageLoading();
    CurrentRowCount = TotalRowCount = 0;
    ScheduledMailAlertsUtil.MaxCount();
}
function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    ScheduledMailAlertsUtil.GetReport();
}
var ScheduledMailAlertsUtil = {
    BindActiveEmailId: function () {
        $.ajax({
            url: "/General/GetActiveEmailIds",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

                if (response != undefined && response != null) {
                    $.each(response, function (i) {
                        $("#ui_ddlFromEmailId").append("<option value='" + response[i] + "'>" + response[i] + "</option>");
                    });
                }
                ScheduledMailAlertsUtil.IntializeMailTemplate();
            },
            error: ShowAjaxError
        });
    },
    IntializeMailTemplate: function () {
        $.ajax({
            url: "/General/GetAllTemplateList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (TemplateList) {
                if (TemplateList != undefined && TemplateList != null && TemplateList.length > 0) {
                    MailTemplatesList = TemplateList;
                    $.each(TemplateList, function () {
                        $("#ui_ddlMailTemplate").append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");
                    });
                }
            },
            error: ShowAjaxError
        });
    },
    MaxCount: function () {
        $.ajax({
            url: "/Prospect/Reports/GetScheduledMailAlertMaxCount",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'UserId': Plumb5UserId, 'Fromdate': FromDateTime, 'Todate': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = response.returnVal;

                if (TotalRowCount > 0) {
                    setTimeout(function () { ScheduledMailAlertsUtil.GetReport(); }, 500);
                }
                else {
                    SetNoRecordContent('ui_tblReportData', 8, 'ui_tbodyReportData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetReport: function () {
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/Prospect/Reports/GetScheduledMailAlertDetails",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'UserId': Plumb5UserId, 'Fromdate': FromDateTime, 'Todate': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: ScheduledMailAlertsUtil.BindReport,
            error: ShowAjaxError
        });
    },
    BindReport: function (response) {
        SetNoRecordContent('ui_tblReportData', 8, 'ui_tbodyReportData');
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


                reportTableTrs +=
                    "<tr>" +
                    "<td class='text-center temppreveye'><i class='icon ion-ios-eye-outline position-relative' onmouseover='ScheduledMailAlertsUtil.BindMailTemplate(\"" + this.TemplateName + "\"," + this.Id + ")' onmouseout='ScheduledMailAlertsUtil.ClearIFrameContent(" + this.Id + ")'>" + // 
                    "<div class='previewtabwrp' >" +
                    "<div class='thumbnail-container'>" +
                    "<a href='https://" + TemplatePath + "Campaign-" + Plumb5AccountId + "-" + this.Id + "/TemplateContent.html' target='_blank'>" +
                    "<div class='thumbnail'><iframe  id='dvIframe" + this.Id + "' frameborder='0' onload='this.style.opacity = 1'></iframe>" +//<div id='dvIframe" + this.Id + "' frameborder='0'></div>  //src='https://p5email-email-template-images.s3.amazonaws.com/allimages/Campaign-1-19/TemplateContent.html" + this.Id + "'
                    "</div></a>" +
                    "</div>" +
                    "</div>" +
                    "</i>" +
                    "</td>" +
                    "<td class='frmresucp' onclick='ShowContactUCP(null,null," + this.ContactId + ");'><i class='fa fa-address-card-o'></i></td>" +
                    "<td class='m-p-w-140 text-left'>" +
                    "<div class='groupnamewrap'>" +
                    "<div class='nameTxtWrap'>" + this.TemplateName + "</div>" +
                    "<div class='tdcreatedraft'>" +
                    "<div class='dropdown'>" +
                    "<button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='icon ion-android-more-vertical mr-0'></i></button>" +
                    "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='filterbycontacts'>" +
                    "<a data-chatpop='chattransdet' " + EditContentdisplay + " class='dropdown-item chatrepvist ContributePermission' href='javascript:void(0)' onclick=\"BindScheduledMailAlertDetails(this," + this.Id + "," + this.TemplateId + "," + this.ContactId + ",'" + this.Subject + "','" + this.MailReplyEmailId + "'," + this.IsPromotionalOrTransnational + ",'" + this.AlertScheduleDate + "','" + this.FromName + "','" + this.CCEmailId + "')\">Edit</a>" +
                    "<div class='dropdown-divider' " + EditContentdisplay + "></div>" +
                    "<a data-toggle='modal' data-target='#deleterow' class='dropdown-item FullControlPermission' href='javascript:void(0)' onclick=\"ScheduledMailAlertsUtil.DeleteScheduledMailAlertsConfirm(" + this.Id + ");\">Delete</a>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</td>" +
                    "<td>" + sourcename + "</td>" +
                    "<td>" + this.FromEmailId + "</td>" +
                    "<td>" + this.FromName + "</td>" +
                    "<td>" + this.EmailId + "</td>" +
                    "<td><span class='" + statusclass + "'> " + this.AlertScheduleStatus + "</span ></td>" +
                    "<td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.AlertScheduleDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.AlertScheduleDate)) + "</td>" +
                    "</tr>";
            });
            $("#ui_tblReportData").removeClass('no-data-records');
            $("#ui_tbodyReportData").html(reportTableTrs);
            // BindIframe1();
            ShowExportDiv(true);

        } else {

            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
        CheckAccessPermission("Prospect");
    },
    BindMailTemplate: function (MailTemplateName, Id) {
        $.ajax({
            url: "/Prospect/Reports/GetMailTemplateContent",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'MailTemplateName': MailTemplateName, 'Id': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (response) {

                // $('#dvIframe' + response.mailSchedulelaterdetails[0].Id).html(response.mailSchedulelaterdetails[0].MailContent);

                $('#dvIframe' + response.mailSchedulelaterdetails[0].Id).contents().find("body").html(response.mailSchedulelaterdetails[0].TemplateContent);

                //var myFrame = $("#dvIframe"+Id+"").contents().find('body');
                //var HtmlContent = response.mailSchedulelaterdetails[0].MailContent;
                //myFrame.html(HtmlContent); 
            },
            error: ShowAjaxError
        });
    },
    ClearIFrameContent: function (Id) {
        $('#dvIframe' + Id).contents().find("body").html('');
    },
    DeleteScheduledMailAlertsConfirm: function (Id) {
        $("#deleteRowConfirmMail").attr("onclick", "ScheduledMailAlertsUtil.DeleteScheduledMailAlerts(" + Id + ");");
    },
    DeleteScheduledMailAlerts: function (Id) {
        ShowPageLoading();
        $.ajax({
            url: "/Prospect/Reports/DeleteScheduledMailAlerts",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'Id': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.ScheduledMailAlerts.Delete_SuccessMessage);
                    ScheduledMailAlertsUtil.GetReport();
                }
            },
            error: ShowAjaxError
        });
    }
};










