var NoColumns = 2;
var sentContactDetails = { MailSendingSettingId: 0, Sent: 0, Opened: 0, Clicked: 0, Forward: 0, Unsubscribe: 0, IsBounced: 0, DripSequence: 0, DripConditionType: 0, NotSent: 0, EmailId: "", BouncedReason: "", WorkFlowId: 0, Delivered: 0 };
var mailclicks = { MailSendingSettingId: 0 };
var mailCampaignEffectivenessReport = { MailSendingSettingId: 0, IsUniqe: 1, UrlLink: "" };

var ActionMail = "";
function getMailCampaignContacts(action, id, WfId) {
    ActionMail = action;
    sentContactDetails = { MailSendingSettingId: 0, Sent: 0, Opened: 0, Clicked: 0, Forward: 0, Unsubscribe: 0, IsBounced: 0, DripSequence: 0, DripConditionType: 0, NotSent: 0, EmailId: "", BouncedReason: "", WorkFlowId: 0 };
    sentContactDetails.MailSendingSettingId = id;
    sentContactDetails.WorkFlowId = WfId;
    mailclicks.MailSendingSettingId = 0;
    mailCampaignEffectivenessReport.MailSendingSettingId = 0;

    $("#ui_exportMailClickDownload,#ui_exportMailSentOpenOptOutBounceError,#ui_exportMailUniqueclick,#ui_exportMailUrls").addClass("hideDiv");
    $("#ui_PNotForDelay").removeClass('hideDiv');
    $("#dvcampaignContacts").removeClass('hideDiv');
    $("#thEmail ,#thBounce, #thUrls,#thUnique,#thClick").addClass('hideDiv');
    $("#ui_tbodyInnerReportData").empty();
    $("#dv_campaignContacts").removeClass('w-450').removeClass('w-650');

    if (action === "bounced" || action === "notsent") {
        NoColumns = 4;
        $("#dv_campaignContacts").addClass('w-650');
        $("#thBounce").removeClass('hideDiv');
    }
    else if (action === "urls") {
        NoColumns = 3;
        $("#dv_campaignContacts").addClass('w-650');
        $("#thUrls").removeClass('hideDiv');
    }
    else if (action === "uniqueclicked") {
        $("#dv_campaignContacts").addClass('w-450');
        $("#thUnique").removeClass('hideDiv');
    }
    else if (action === "clicked") {
        NoColumns = 4;
        $("#ui_exportMailClickDownload").removeClass("hideDiv");
        $("#dv_campaignContacts").addClass('w-450');
        $("#thClick").removeClass('hideDiv');
    }
    else {
        NoColumns = 3;
        $("#dv_campaignContacts").addClass('w-450');
        $("#thEmail").removeClass('hideDiv');
    }

    if (action == 'sent') {
        sentContactDetails.Sent = 1;
        $("#spnResponsesHead").html("SENT DETAILS");
        $("#ui_exportMailSentOpenOptOutBounceError").removeClass("hideDiv");
    } else if (action == "open") {
        sentContactDetails.Opened = 1;
        $("#spnResponsesHead").html("Opened DETAILS");
        $("#ui_exportMailSentOpenOptOutBounceError").removeClass("hideDiv");
    }
    else if (action == "clicked") {
        sentContactDetails.Clicked = 1;
        $("#spnResponsesHead").html("Clicked DETAILS");
    }
    else if (action == "optout") {
        sentContactDetails.Unsubscribe = 1;
        $("#spnResponsesHead").html("Optout DETAILS");
        $("#ui_exportMailSentOpenOptOutBounceError").removeClass("hideDiv");
    }
    else if (action == "forward") {
        sentContactDetails.Forward = 1;
        $("#spnResponsesHead").html("Forward DETAILS");
    }
    else if (action == "bounced") {
        sentContactDetails.IsBounced = 1;
        $("#spnResponsesHead").html("Bounce DETAILS");
        $("#ui_exportMailSentOpenOptOutBounceError").removeClass("hideDiv");
    }
    else if (action == "notsent") {
        sentContactDetails.NotSent = 1;
        $("#spnResponsesHead").html("Error DETAILS");
        $("#ui_exportMailSentOpenOptOutBounceError").removeClass("hideDiv");
    }
    else if (action == "uniqueclicked") {
        mailCampaignEffectivenessReport.MailSendingSettingId = id;
        $("#spnResponsesHead").html("Unique Clicks DETAILS");
        $("#ui_exportMailUniqueclick").removeClass("hideDiv");
    }
    else if (action == "urls") {
        mailclicks.MailSendingSettingId = id;
        $("#spnResponsesHead").html("URL's DETAILS");
        $("#ui_exportMailUrls").removeClass("hideDiv");
    }
    else if (action == "delivered") {
        sentContactDetails.Delivered = 1;
        sentContactDetails.IsBounced = 2;
        $("#spnResponsesHead").html("DELIVERED DETAILS");
        $("#ui_exportMailSentOpenOptOutBounceError").removeClass("hideDiv");
    }
    else if (action == "not clicked") {
        sentContactDetails.Opened = 1;
        sentContactDetails.Clicked = -1;
        $("#spnResponsesHead").html("NOT Clicked DETAILS");
        $("#ui_exportMailSentOpenOptOutBounceError").removeClass("hideDiv");
    }
    else if (action == "not open") {
        sentContactDetails.IsBounced = 2;
        sentContactDetails.Sent = 1;
        sentContactDetails.Opened = -1;
        $("#spnResponsesHead").html("NOT Opened DETAILS");
        $("#ui_exportMailSentOpenOptOutBounceError").removeClass("hideDiv");
    }

    //var webUrl = window.location.href.toLowerCase();
    //if (webUrl.indexOf('journey') == -1) {
    //    FromDateTime = null; ToDateTime = null;
    //}

    ShowPageLoading();
    TotalInnerRowCount = 0;
    CurrentInnerRowCount = 0;
    InnerOffSet = 0;
    MaxMailInnerCount();
}

function CallBackInnerPaging() {
    CurrentInnerRowCount = 0;
    GetMailInnerReport();
}

function MaxMailInnerCount() {
    //var geturl = mailclicks.MailSendingSettingId != 0 ? "/Mail/ClickUrl/MaxCount" : mailCampaignEffectivenessReport.MailSendingSettingId != 0 ? "/Mail/MailEffectivenessReport/MaxCount" : "/Mail/MailCampaignResponseReport/MaxCount";
    //var getdata = mailclicks.MailSendingSettingId != 0 ? JSON.stringify({ 'accountId': Plumb5AccountId, 'mailSendingSettingId': mailclicks, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }) : mailCampaignEffectivenessReport.MailSendingSettingId != 0 ? JSON.stringify({ 'accountId': Plumb5AccountId, 'mailCampaignEffectivenessReport': mailCampaignEffectivenessReport, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }) : JSON.stringify({ 'accountId': Plumb5AccountId, 'sentContactDetails': sentContactDetails, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime });

    var geturl =
        mailclicks.MailSendingSettingId != 0 ? "/Mail/ClickUrl/MaxCount" :
            sentContactDetails.Clicked == 1 ? "/Mail/MailCampaignResponseReport/GetMaxClickCount" :
                mailCampaignEffectivenessReport.MailSendingSettingId != 0 ? "/Mail/MailEffectivenessReport/MaxCount" : "/Mail/MailCampaignResponseReport/MaxCount";

    var getdata =
        mailclicks.MailSendingSettingId != 0 ? JSON.stringify({ 'accountId': Plumb5AccountId, 'mailSendingSettingId': mailclicks, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }) :
            sentContactDetails.Clicked == 1 ? JSON.stringify({ 'accountId': Plumb5AccountId, 'sentContactDetails': sentContactDetails, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }) :
                mailCampaignEffectivenessReport.MailSendingSettingId != 0 ? JSON.stringify({ 'accountId': Plumb5AccountId, 'mailCampaignEffectivenessReport': mailCampaignEffectivenessReport, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }) :
                    JSON.stringify({ 'accountId': Plumb5AccountId, 'sentContactDetails': sentContactDetails, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime });

    $.ajax({
        url: geturl,
        type: 'Post',
        data: getdata,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalInnerRowCount = response.returnVal;

            if (TotalInnerRowCount > 0) {
                GetMailInnerReport();
            }
            else {
                $("#ui_exportMailClickDownload,#ui_exportMailSentOpenOptOutBounceError,#ui_exportMailUniqueclick,#ui_exportMailUrls").addClass("hideDiv");
                SetInnerNoRecordContent('ui_tblMailInnerReportData', NoColumns, 'ui_tbodyMailInnerReportData');
                ShowInnerPagingDiv(false);
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetMailInnerReport() {
    InnerFetchNext = GetInnerNumberOfRecordsPerPage();

    //var geturl = mailclicks.MailSendingSettingId != 0 ? "/Mail/ClickUrl/GetResponseData" : mailCampaignEffectivenessReport.MailSendingSettingId != 0 ? "/Mail/MailEffectivenessReport/GetReportDetails" : "/Mail/MailCampaignResponseReport/GetReportDetails";
    //var getdata = mailclicks.MailSendingSettingId != 0 ? JSON.stringify({ 'accountId': Plumb5AccountId, 'mailSendingSettingId': mailclicks, 'OffSet': InnerOffSet, 'FetchNext': InnerFetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }) : mailCampaignEffectivenessReport.MailSendingSettingId != 0 ? JSON.stringify({ 'accountId': Plumb5AccountId, 'mailCampaignEffectivenessReport': mailCampaignEffectivenessReport, 'OffSet': InnerOffSet, 'FetchNext': InnerFetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }) : JSON.stringify({ 'accountId': Plumb5AccountId, 'sentContactDetails': sentContactDetails, 'OffSet': InnerOffSet, 'FetchNext': InnerFetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime });

    var geturl = mailclicks.MailSendingSettingId != 0 ? "/Mail/ClickUrl/GetResponseData" :
        sentContactDetails.Clicked == 1 ? "/Mail/MailCampaignResponseReport/GetClickReportDetails" :
            mailCampaignEffectivenessReport.MailSendingSettingId != 0 ?
                "/Mail/MailEffectivenessReport/GetReportDetails" : "/Mail/MailCampaignResponseReport/GetReportDetails";

    var getdata = mailclicks.MailSendingSettingId != 0 ? JSON.stringify({ 'accountId': Plumb5AccountId, 'mailSendingSettingId': mailclicks, 'OffSet': InnerOffSet, 'FetchNext': InnerFetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }) :
        sentContactDetails.Clicked == 1 ? JSON.stringify({ 'accountId': Plumb5AccountId, 'sentContactDetails': sentContactDetails, 'OffSet': InnerOffSet, 'FetchNext': InnerFetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }) :
            mailCampaignEffectivenessReport.MailSendingSettingId != 0 ? JSON.stringify({ 'accountId': Plumb5AccountId, 'mailCampaignEffectivenessReport': mailCampaignEffectivenessReport, 'OffSet': InnerOffSet, 'FetchNext': InnerFetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }) : JSON.stringify({ 'accountId': Plumb5AccountId, 'sentContactDetails': sentContactDetails, 'OffSet': InnerOffSet, 'FetchNext': InnerFetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime });

    $.ajax({
        url: geturl,
        type: 'Post',
        data: getdata,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindMailInnerReport,
        error: ShowAjaxError
    });
}

function BindMailInnerReport(response) {
    SetInnerNoRecordContent('ui_tblMailInnerReportData', NoColumns, 'ui_tbodyMailInnerReportData');
    $(".camppopupwrppr").removeClass("hideDiv");
    if (response != undefined && response != null) {
        CurrentInnerRowCount = response.length;
        InnerPagingPrevNext(InnerOffSet, CurrentInnerRowCount, TotalInnerRowCount);

        var reportTableTrs = "";

        if (sentContactDetails.Clicked == 1) {
            $.each(response, function (m) {

                let SentDate = this.Date != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.Date)) : "NA";

                reportTableTrs += '<tr><td class="text-left td-icon">' + this.EmailId + '</td>' +
                    '<td>' + (this.ResponseId != undefined && this.ResponseId != null && this.ResponseId.length > 0 ? this.ResponseId : "NA") + '</td>' +
                    '<td>' + (this.MailContent != undefined && this.MailContent != null && this.MailContent.length > 0 ? this.MailContent : "NA") + '</td>' +
                    '<td>' + SentDate + '</td>' +
                    '</tr>';
            });
        }
        else {
            $.each(response, function (m) {

                var extraTd = sentContactDetails.IsBounced == 1 ? '<td>' + this.BouncedReason + '</td>' : sentContactDetails.NotSent == 1 ? '<td>' + this.ErrorMessage + '</td>' : '';
                let Date = 'NA';
                if (sentContactDetails.IsBounced == 1)
                    Date = this.BouncedDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.BouncedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.BouncedDate)) : "NA";
                else
                    Date = this.Date != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.Date)) : "NA";

                if (mailCampaignEffectivenessReport.MailSendingSettingId != 0) {
                    reportTableTrs += '<tr><td class="text-left td-icon">' + this.EmailId + '</td></tr>';
                } else if (mailclicks.MailSendingSettingId != 0) {
                    reportTableTrs += '<tr><td class="text-left td-icon">' + this.ClickURL + '</td>' +
                        '<td>' + this.TotalClick + '</td>' +
                        '<td>' + this.TotalUniqueClick + '</td>' +
                        '</tr>';
                } else {
                    reportTableTrs += '<tr><td class="text-left td-icon">' + this.EmailId + '</td>' +
                        '<td>' + this.ResponseId + '</td>' +
                        extraTd +
                        '<td>' + Date + '</td>' +
                        '</tr>';
                }
            });
        }
        $("#ui_tbodyMailInnerReportData").html(reportTableTrs);
        ShowInnerPagingDiv(true);
    }
    else {
        ShowInnerPagingDiv(false);
    }
    HidePageLoading();
}

$(document.body).on('click', '#ui_exportMailClickDownload', function (event) {
    ExportFunctionNameInnerPage = "/Mail/MailCampaignResponseReport/ExportClickReport";
    ExportChannel = "Mail";
    $("#ui_ContactdownloadModal").modal('show');
});


$(document.body).on('click', '#ui_exportMailSentOpenOptOutBounceError', function (event) {
    ExportFunctionNameInnerPage = "/Mail/MailCampaignResponseReport/ExportSentOpenOptOutBounceErrorReport";
    ExportChannel = "Mail";
    $("#ui_ContactdownloadModal").modal('show');
});


$(document.body).on('click', '#ui_exportMailUniqueclick', function () {
    ExportFunctionNameInnerPage = "/Mail/MailEffectivenessReport/Export";
    ExportChannel = "Mail";
    $("#ui_ContactdownloadModal").modal('show');
    //UniqueUrlsDataExport("/Mail/MailEffectivenessReport/Export");
});

$(document.body).on('click', '#ui_exportMailUrls', function (event) {
    ExportFunctionNameInnerPage = "/Mail/ClickUrl/Export";
    ExportChannel = "Mail";
    $("#ui_ContactdownloadModal").modal('show');
    //UniqueUrlsDataExport("/Mail/ClickUrl/Export");
});

//function UniqueUrlsDataExport(Url) {
//    ShowPageLoading();

//    if ($("#ui_tbodyMailInnerReportData > tr").length > 1) {
//        $.ajax({
//            url: Url,
//            type: 'POST',
//            data: JSON.stringify({ 'OffSet': 0, 'FetchNext': 0, 'FileType': 'csv' }),
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            success: function (response) {
//                if (response.Status) {
//                    SaveToDisk(response.MainPath);
//                    setTimeout(function () { DeleteFile(response.MainPath); }, 5000);
//                }
//                else {
//                    ShowErrorMessage(GlobalErrorList.ExportData.session_expired);
//                    setTimeout(function () { window.location.href = "/Login"; }, 3000);
//                }
//                HidePageLoading();
//            },
//            error: ShowAjaxError
//        });
//    }
//    else {
//        ShowErrorMessage(GlobalErrorList.ExportData.NoDataFound);
//        HidePageLoading();
//    }
//}



