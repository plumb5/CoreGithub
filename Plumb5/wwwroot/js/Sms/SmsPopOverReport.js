var Action = 0;
var currentTotalRow = 1;
var SmsSendingSetting = {};
var SmsCampaignEffectivenessReport = {};
var Smsclicks = {};
var maxRowCount = 0, Offset = 0, rowIndex = 0;
var IsCampaignOrUrlOrUnique = 1;
var reportnewwdtoexport;
var smsPopReportUtil = {

    InitialCampaignFilterValues: function (SMSSendingSettingId, action, WfId) {
        ShowPageLoading();
        let sentContactDetails = { SmsSendingSettingId: 0, IsDelivered: 0, IsClicked: 0, NotDeliverStatus: 0, Pending: 0, MobileNumber: "", Circle: "", Operator: "", SendStatus: null, IsUnsubscribed: false, ReasonForNotDelivery: null, WorkFlowId: 0 };

        sentContactDetails.SmsSendingSettingId = SMSSendingSettingId;
        sentContactDetails.WorkFlowId = WfId;

        if (action == 0) {
            sentContactDetails.SendStatus = 1;
            reportnewwdtoexport = 'Sent';
        } else if (action == 1) {
            sentContactDetails.IsDelivered = 1;
            reportnewwdtoexport = 'IsDelivered';
        } else if (action == 2) {
            sentContactDetails.IsClicked = 1;
            reportnewwdtoexport = 'clicked';
        } else if (action == 3) {
            sentContactDetails.NotDeliverStatus = 1;
            reportnewwdtoexport = 'Bounced';
        } else if (action == 4) {
            sentContactDetails.Pending = 1;
            sentContactDetails.SendStatus = 1;
            reportnewwdtoexport = 'Pending';
        } else if (action == 6) {
            sentContactDetails.IsUnsubscribed = true;
            reportnewwdtoexport = 'OptOut'
        } else if (action == 5) {
            sentContactDetails.SendStatus = 0;
            reportnewwdtoexport = 'Error';
        } else if (action == 7) {
            sentContactDetails.IsDelivered = 1;
            sentContactDetails.IsClicked = -1;
            reportnewwdtoexport = 'Notclicked';
        }


        //var weburl = window.location.href.tolowercase();
        //if (weburl.indexof('journey') == -1) {
        //    fromdatetime = null; todatetime = null;
        //}

        if (action != 2) {
            smsPopReportUtil.PopMaxCount(action, sentContactDetails);
        }
        else {
            IsCampaignOrUrlOrUnique = 4;
            smsPopReportUtil.PopclickMaxCount(sentContactDetails);
        }
    },

    PopMaxCount: function (action, sentContactDetails) {
        maxRowCount = 0, Offset = 0, rowIndex = 0;
        $.ajax({
            url: "/Sms/SmsReport/MaxCount",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'sentContactDetails': sentContactDetails, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                maxRowCount = response;
                if (maxRowCount == 0) {
                    $(".popupfooter").hide();
                    $("#ui_trSentdata,#ui_trBounced,#ui_trSmsEffectivenessUrl,#ui_trSmsEffectivenessContact,#ui_trTotalclick").empty().append(`<tr><td colspan="10" class="border-bottom-none"><div class="no-data">There is no data for this view</div></td></tr>`);
                    HidePageLoading();
                    $("#ui_exportDownloadsmsdetails").addClass("hideDiv");
                }
                else if (maxRowCount > 0) {
                    $("#ui_exportDownloadsmsdetails").removeClass("hideDiv");
                    $(".popupfooter").show();
                    let numberOfRecords = 10;
                    smsPopReportUtil.BindPopReport(numberOfRecords, action, sentContactDetails);
                }
            },
            error: ShowAjaxError
        });
    },

    BindPopReport: function (numberRowsCount, action, sentContactDetails) {
        SmsSendingSetting = sentContactDetails;
        Action = action;
        let OffSet = rowIndex;
        let FetchNext = numberRowsCount;

        $.ajax({
            url: "/Sms/SmsReport/GetReportDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'sentContactDetails': sentContactDetails, 'OffSet': OffSet, 'FetchNext': FetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) { smsPopReportUtil.BindPopReportDetails(response, action) },
            error: ShowAjaxError
        });
    },

    BindPopReportDetails: function (response, action) {
        HidePageLoading();
        currentTotalRow = response.length;
        smsPopReportUtil.ShowPaging(currentTotalRow);

        if (action == 0 || action == 1 || action == 4 || action == 2 || action == 6 || action == 7) {
            $.each(response, function () {

                let Date = action == 1 ? $(this)[0].DeliveryTime : $(this)[0].SentDate;
                Date = Date != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(Date)) : "NA";
                let trtablerow = ` <tr>
                                <td class="text-left td-icon">${$(this)[0].PhoneNumber}</td>
                                <td>${$(this)[0].ResponseId != undefined && $(this)[0].ResponseId != null && $(this)[0].ResponseId.length > 0 ? $(this)[0].ResponseId : "NA"}</td>
                                <td>${Date}</td>
                                </tr>`;

                $("#ui_trSentdata").append(trtablerow);

            });
        } else {
            $.each(response, function () {
                let SentDate = $(this)[0].SentDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].SentDate)) : "NA";
                let trtablerow = ` <tr>
                                    <td class="text-left td-icon">${$(this)[0].PhoneNumber}</td>
                                    <td>${$(this)[0].ResponseId != undefined && $(this)[0].ResponseId != null && $(this)[0].ResponseId.length > 0 ? $(this)[0].ResponseId : "NA"}</td>
                                    <td>${$(this)[0].ReasonForNotDelivery != undefined && $(this)[0].ReasonForNotDelivery != null && $(this)[0].ReasonForNotDelivery.length > 0 ? $(this)[0].ReasonForNotDelivery : "NA"}</td>
                                    <td>${SentDate}</td>
                              </tr>`;

                $("#ui_trBounced").append(trtablerow);
            });
        }
    },

    PopclickMaxCount: function (sentContactDetails) {
        maxRowCount = 0, Offset = 0, rowIndex = 0;
        $.ajax({
            url: "/Sms/SmsReport/GetMaxClickCount",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'sentContactDetails': sentContactDetails, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                maxRowCount = response;
                if (maxRowCount == 0) {
                    $(".popupfooter").hide();
                    $("#ui_exportDownloadsmsdetails").addClass("hideDiv");
                    $("#ui_trSentdata,#ui_trBounced,#ui_trSmsEffectivenessUrl,#ui_trSmsEffectivenessContact,#ui_trTotalclick").empty().append(`<tr><td colspan="10" class="border-bottom-none"><div class="no-data">There is no data for this view</div></td></tr>`);
                    HidePageLoading();
                }
                else if (maxRowCount > 0) {
                    $(".popupfooter").show();
                    $("#ui_exportDownloadsmsdetails").removeClass("hideDiv");
                    let numberOfRecords = 10;
                    smsPopReportUtil.BindPopClickReport(numberOfRecords, sentContactDetails);
                }
            },
            error: ShowAjaxError
        });
    },

    BindPopClickReport: function (numberRowsCount, sentContactDetails) {
        SmsSendingSetting = sentContactDetails;
        let OffSet = rowIndex;
        let FetchNext = numberRowsCount;

        $.ajax({
            url: "/Sms/SmsReport/GetClickReportDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'sentContactDetails': sentContactDetails, 'OffSet': OffSet, 'FetchNext': FetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) { smsPopReportUtil.BindPopClickReportDetails(response) },
            error: ShowAjaxError
        });
    },

    BindPopClickReportDetails: function (response) {
        HidePageLoading();
        currentTotalRow = response.length;
        smsPopReportUtil.ShowPaging(currentTotalRow);

        $.each(response, function () {
            let SentDate = $(this)[0].SentDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].SentDate)) : "NA";
            let trtablerow = ` <tr>
                                    <td class="text-left td-icon">${$(this)[0].PhoneNumber}</td>
                                    <td>${$(this)[0].ResponseId != undefined && $(this)[0].ResponseId != null && $(this)[0].ResponseId.length > 0 ? $(this)[0].ResponseId : "NA"}</td>
                                    <td>${$(this)[0].MessageContent != undefined && $(this)[0].MessageContent != null && $(this)[0].MessageContent.length > 0 ? $(this)[0].MessageContent : "NA"}</td>
                                    <td>${SentDate}</td>
                              </tr>`;

            $("#ui_trTotalclick").append(trtablerow);
        });
    },

    InitialUniqueEffectivenessReport: function (SMSSendingSettingId, IsUniqe) {
        let smsCampaignEffectivenessReport = { SmsSendingSettingId: 0, IsUniqe: 0, UrlLink: "" };
        smsCampaignEffectivenessReport.SmsSendingSettingId = SMSSendingSettingId;
        smsCampaignEffectivenessReport.IsUniqe = IsUniqe;

        smsPopReportUtil.UniqueMaxCount(smsCampaignEffectivenessReport);
    },

    UniqueMaxCount: function (smsCampaignEffectivenessReport) {
        ShowPageLoading();
        maxRowCount = 0, Offset = 0, rowIndex = 0;
        $.ajax({
            url: "/SMS/SmsEffectivenessReport/MaxCount",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'smsCampaignEffectivenessReport': smsCampaignEffectivenessReport }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                maxRowCount = response.returnVal;
                if (maxRowCount == 0) {
                    $(".popupfooter").hide();
                    $("#ui_trSentdata,#ui_trBounced,#ui_trSmsEffectivenessUrl,#ui_trSmsEffectivenessContact,#ui_trTotalclick").empty().append(`<tr><td colspan="10" class="border-bottom-none"><div class="no-data">There is no data for this view</div></td></tr>`);
                    HidePageLoading();
                }
                else if (maxRowCount > 0) {
                    $(".popupfooter").show();
                    let numberOfRecords = 10;
                    smsPopReportUtil.BindUniqueClicks(numberOfRecords, smsCampaignEffectivenessReport);
                }
            },
            error: ShowAjaxError
        });
    },

    BindUniqueClicks: function (numberRowsCount, smsCampaignEffectivenessReport) {
        SmsCampaignEffectivenessReport = smsCampaignEffectivenessReport;
        let OffSet = rowIndex;
        let FetchNext = numberRowsCount;

        $.ajax({
            url: "/Sms/SmsEffectivenessReport/GetReportDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'smsCampaignEffectivenessReport': smsCampaignEffectivenessReport, 'OffSet': OffSet, 'FetchNext': FetchNext }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                HidePageLoading();
                currentTotalRow = response.length;
                smsPopReportUtil.ShowPaging(currentTotalRow);
                $("#ui_trSmsEffectivenessContact").empty();
                $.each(response, function () {
                    let trtablerow = `<tr>
                                        <td class="text-left td-icon">${$(this)[0].PhoneNumber}</td>                                        
                                      </tr>`;

                    $("#ui_trSmsEffectivenessContact").append(trtablerow);
                });
            },
            error: ShowAjaxError
        });
    },

    InitialURLEffectivenessReport: function (SMSSendingSettingId) {
        let smsclicks = { SmsSendingSettingId: 0 };
        smsclicks.SmsSendingSettingId = SMSSendingSettingId;
        reportnewwdtoexport = 'ClickedUrl';
        smsPopReportUtil.URLMaxCount(smsclicks);
    },

    URLMaxCount: function (smsclicks) {
        ShowPageLoading();
        maxRowCount = 0, Offset = 0, rowIndex = 0;
        $.ajax({
            url: "/SMS/ClickUrl/MaxCount",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'smsSendingSettingId': smsclicks }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                maxRowCount = response.returnVal;
                if (maxRowCount == 0) {
                    $(".popupfooter").hide();
                    $("#ui_trSentdata,#ui_trBounced,#ui_trSmsEffectivenessUrl,#ui_trSmsEffectivenessContact,#ui_trTotalclick").empty().append(`<tr><td colspan="10" class="border-bottom-none"><div class="no-data">There is no data for this view</div></td></tr>`);
                    HidePageLoading();
                }
                else if (maxRowCount > 0) {
                    $(".popupfooter").show();
                    let numberOfRecords = 10;
                    smsPopReportUtil.BindURLClicks(numberOfRecords, smsclicks);
                }
            },
            error: ShowAjaxError
        });
    },

    BindURLClicks: function (numberRowsCount, smsclicks) {
        Smsclicks = smsclicks;
        let OffSet = rowIndex;
        let FetchNext = numberRowsCount;

        $.ajax({
            url: "/SMS/ClickUrl/GetResponseData",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'smsSendingSettingId': smsclicks, 'OffSet': OffSet, 'FetchNext': FetchNext }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                HidePageLoading();
                currentTotalRow = response.length;
                smsPopReportUtil.ShowPaging(currentTotalRow);
                $("#ui_trSmsEffectivenessUrl").empty();
                $.each(response, function () {
                    let trtablerow = `<tr><td class="text-left td-icon">${$(this)[0].ClickURL}</td>
                                    <td>${$(this)[0].TotalClick}</td>
                                    <td>${$(this)[0].TotalUniqueClick}</td></tr>`;

                    $("#ui_trSmsEffectivenessUrl").append(trtablerow);
                });
            },
            error: ShowAjaxError
        });
    },

    ShowPaging: function (currentTotalRow) {

        if (rowIndex == 0) {
            $("#ui_Paging").html((rowIndex + 1) + ' - ' + currentTotalRow + ' of ' + maxRowCount);
            $("#ui_BackpopPaging").addClass('disableDiv');
        }
        else {
            $("#ui_Paging").html((rowIndex + 1) + ' - ' + (rowIndex + currentTotalRow) + ' of ' + maxRowCount);
            $("#ui_BackpopPaging").removeClass('disableDiv');
        }

        if ((rowIndex + currentTotalRow) >= maxRowCount) {
            $("#ui_NextPopPaging").addClass('disableDiv');
        } else {
            $("#ui_NextPopPaging").removeClass('disableDiv');
        }

        $("#ui_trSentdata,#ui_trBounced,#ui_trSmsEffectivenessUrl,#ui_trSmsEffectivenessContact,#ui_trTotalclick").empty();
    },

    CallPopBackPaging: function (IsCampaignOrUrlOrUnique) {
        ShowPageLoading();
        if (IsCampaignOrUrlOrUnique == 1)
            smsPopReportUtil.BindPopReport(10, Action, SmsSendingSetting);
        else if (IsCampaignOrUrlOrUnique == 2)
            smsPopReportUtil.BindUniqueClicks(10, SmsCampaignEffectivenessReport);
        else if (IsCampaignOrUrlOrUnique == 3)
            smsPopReportUtil.BindURLClicks(10, Smsclicks);
        else if (IsCampaignOrUrlOrUnique == 4)
            smsPopReportUtil.BindPopClickReport(10, SmsSendingSetting);
    },
};

function GetEachReport(SMSSendingSettingId, action) {
    smsPopReportUtil.InitialCampaignFilterValues(SMSSendingSettingId, action, 0);
}

function GetUniqueEffectivenessReport(SMSSendingSettingId, IsUniqe) {
    IsCampaignOrUrlOrUnique = 2;
    smsPopReportUtil.InitialUniqueEffectivenessReport(SMSSendingSettingId, IsUniqe);
}

function GetURLEffectivenessReport(SMSSendingSettingId) {
    IsCampaignOrUrlOrUnique = 3;
    smsPopReportUtil.InitialURLEffectivenessReport(SMSSendingSettingId);
}
var campsenddets = '';
$(document).on('click', '.sentpopup', function () {
    campsenddets = $(this).attr("data-sentdetail");
    $(".camppopupwrppr").addClass("hideDiv");
    $("#ui_exportClickDownload").addClass("hideDiv");
    if (campsenddets == "Sent" || campsenddets == "Delivered" || campsenddets == "Pending" || campsenddets == "Optout") {
        $(".popupcontainer").removeClass('hideDiv');
        $(".popupbodycont").removeClass("pad-10");
        $(".popupItem").addClass("popup-tbl").removeClass('w-650').addClass("w-450");
        $(".popuptitle h6").html(`${campsenddets} Details`);
        $("#ui_Paggingdiv").show(); $("#ui_Groupsdiv").addClass("hideDiv");
        $("#Sent").removeClass('hideDiv');
        $("#ui_exportClickDownload").removeClass("hideDiv");
    } else if (campsenddets == "Error" || campsenddets == "Bounce") {
        $(".popupcontainer").removeClass('hideDiv');
        $(".popupbodycont").removeClass("pad-10");
        $(".popupItem").addClass("popup-tbl").removeClass('w-450').addClass("w-650");
        $(".popuptitle h6").html(`${campsenddets} Details`);
        $("#ui_Paggingdiv").show(); $("#ui_Groupsdiv").addClass("hideDiv");
        $("#Error").removeClass('hideDiv');
        $("#ui_exportClickDownload").removeClass("hideDiv");
    } else if (campsenddets == "UniqueClick") {
        $(".popupcontainer").removeClass('hideDiv');
        $(".popupbodycont").removeClass("pad-10");
        $(".popupItem").addClass("popup-tbl").removeClass('w-650').addClass("w-450");
        $(".popuptitle h6").html(`Effectiveness Reports`);
        $("#ui_Paggingdiv").show(); $("#ui_Groupsdiv").addClass("hideDiv");
        $("#SmsUniqueClick").removeClass('hideDiv');
        $("#ui_exportClickDownload").removeClass("hideDiv");
    } else if (campsenddets == "EffectivenessURL") {
        $(".popupcontainer").removeClass('hideDiv');
        $(".popupbodycont").removeClass("pad-10");
        $(".popupItem").addClass("popup-tbl").removeClass('w-450').addClass("w-650");
        $(".popuptitle h6").html(`Campaign Reports by Clicks`);
        $("#ui_Paggingdiv").show(); $("#ui_Groupsdiv").addClass("hideDiv");
        $("#SmsEffectivenessURL").removeClass('hideDiv');
        $("#ui_exportClickDownload").removeClass("hideDiv");
    } else if (campsenddets == "Clicked") {
        $(".popupcontainer").removeClass('hideDiv');
        $(".popupbodycont").removeClass("pad-10");
        $(".popupItem").addClass("popup-tbl").removeClass('w-450').addClass("w-650");
        $(".popuptitle h6").html(`Campaign Reports by Clicks`);
        $("#ui_Paggingdiv").show(); $("#ui_Groupsdiv").addClass("hideDiv");
        $("#SmsTotalClick").removeClass('hideDiv');
        $("#ui_exportClickDownload").removeClass("hideDiv");
    }
});

$(document.body).on('click', '#ui_BackpopPaging', function (event) {
    rowIndex = rowIndex - 10;
    rowIndex <= 0 ? 0 : rowIndex;
    smsPopReportUtil.CallPopBackPaging(IsCampaignOrUrlOrUnique);
});

$(document.body).on('click', '#ui_NextPopPaging', function (event) {
    rowIndex = rowIndex + 10;
    smsPopReportUtil.CallPopBackPaging(IsCampaignOrUrlOrUnique);
});

$(document.body).on('click', '#ui_exportClickDownload', function (event) {
    SmsClickDataExport();
});
$(document.body).on('click', '#ui_exportDownloadsmsdetails', function (event) {
    if ($("#ui_trSmsEffectivenessContact > tr").length) {
        reportnewwdtoexport = 'uniqueclicks';
    }

    ExportFunctionNameInnerPage = "/Sms/SmsReport/ExportClickReport";
    ExportChannel = "SMS";
    ExportDataOF = reportnewwdtoexport
    $("#ui_ContactdownloadModal").modal('show');
});


function SmsClickDataExport() {
    ShowPageLoading();
    var datareuired = '';
    var datacount = 0;

    /*if (campsenddets == "Sent" || campsenddets == "Delivered" || campsenddets == "Pending" || campsenddets == "Optout")*/
    if (reportnewwdtoexport == "Sent" || reportnewwdtoexport == "IsDelivered" || reportnewwdtoexport == "Pending" || reportnewwdtoexport == "OptOut") {
        /*datareuired = 'sent'*/
        datacount = $("#ui_trSentdata > tr").length;
    }
    else if (reportnewwdtoexport == "clicked") {
        datacount = $("#ui_trTotalclick > tr").length;
    }
    else if (reportnewwdtoexport == 'Error' || reportnewwdtoexport == 'Bounced') {
        datareuired = 'Bounced'
        datacount = $("#ui_trBounced > tr").length;
    }

    else if ($("#SmsEffectivenessURL > tr").length) {
        datareuired = 'sent'
        datacount = $("#SmsEffectivenessURL > tr").length;
    }
    else if (campsenddets == 'clickeds') {
        datareuired = 'clicked'
        datacount = $("#ui_trSentdata > tr").length;
    }

    else if ($("#ui_trSmsEffectivenessContact > tr").length) {
        reportnewwdtoexport = 'uniqueclicks'
        datacount = $("#ui_trSmsEffectivenessContact > tr").length;
    }

    $.ajax({
        url: "/Sms/SmsReport/ExportClickReport",
        type: 'POST',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'FileType': 'csv', requireddata: reportnewwdtoexport, datacounts: datacount }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status) {
                SaveToDisk(response.MainPath);
                setTimeout(function () { DeleteFile(response.MainPath); }, 5000);
            }
            else {
                ShowErrorMessage(GlobalErrorList.ExportData.session_expired);
                setTimeout(function () { window.location.href = "/Login"; }, 3000);
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });

    reportnewwdtoexport = '';

}


