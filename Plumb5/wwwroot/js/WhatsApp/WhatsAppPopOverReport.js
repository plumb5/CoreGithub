var Action = 0;
var currentTotalRow = 1;
var WhatsAppSendingSetting = {};
var WhatsAppCampaignEffectivenessReport = {};
var WhatsAppclicks = {};
var maxRowCount = 0, Offset = 0, rowIndex = 0;
var IsCampaignOrUrlOrUnique = 1;
var FromDateTimes;
var ToDateTimes;
var reportnewwdtoexport;
var WhatsAppPopReportUtil = {

    InitialCampaignFilterValues: function (WhatsAppSendingSettingId, action, WfId) {
        ShowPageLoading();
        let sentContactDetails = { WhatsAppSendingSettingId: 0, IsDelivered: 0, IsRead: 0, IsClicked: 0, IsFailed: 0, SendStatus: 0 };

        sentContactDetails.WhatsAppSendingSettingId = WhatsAppSendingSettingId;
        sentContactDetails.WorkFlowId = WfId;

        if (action == 0) {
            sentContactDetails.SendStatus = 1;
            reportnewwdtoexport = 'Sent';
        } else if (action == 1) {
            sentContactDetails.IsDelivered = 1;
            reportnewwdtoexport = 'IsDelivered';
        } else if (action == 2) {
            sentContactDetails.IsRead = 1;
            reportnewwdtoexport = 'IsRead';
        } else if (action == 3) {
            sentContactDetails.IsFailed = 1;
            reportnewwdtoexport = 'IsFailed';
        } else if (action == 4) {
            sentContactDetails.IsUnsubscribed = 1;
            reportnewwdtoexport = ''
        } else if (action == 5) {
            sentContactDetails.IsClicked = 1;
            reportnewwdtoexport = 'clicked';
        } else if (action == 6) {
            sentContactDetails.IsClicked = -1;
            reportnewwdtoexport = 'Notclicked';
        } else if (action == 7) {
            sentContactDetails.IsDelivered = 1;
            sentContactDetails.IsRead = -1;
            reportnewwdtoexport = 'Isnotread';
        }

        else if (action == 8) {
            sentContactDetails.IsDelivered = 1;
            sentContactDetails.IsRead = -1;
        }
        else if (action == 9) {
            sentContactDetails.IsClicked = 1;
            reportnewwdtoexport = 'clicked';
        }

        //var webUrl = window.location.href.toLowerCase();
        //if (webUrl.indexOf('journey') == -1) {
        //    FromDateTimes = FromDateTime;
        //    ToDateTimes = ToDateTime;
        //    FromDateTime = null; ToDateTime = null;

        //}

        if (action != 9) {
            WhatsAppPopReportUtil.PopMaxCount(action, sentContactDetails);
        }
        else {
            IsCampaignOrUrlOrUnique = 4;
            WhatsAppPopReportUtil.PopclickMaxCount(sentContactDetails);
        }

    },

    PopMaxCount: function (action, sentContactDetails) {
        maxRowCount = 0, Offset = 0, rowIndex = 0;
        $.ajax({
            url: "/WhatsApp/WhatsAppReport/MaxCount",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'sentContactDetails': sentContactDetails, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                maxRowCount = response;
                if (maxRowCount == 0) {
                    $(".popupfooter").hide();
                    $("#ui_exportDownloadwhatsappdetails").addClass("hideDiv");
                    $("#ui_trSentdata,#ui_trBounced,#ui_trWhatsAppEffectivenessUrl,#ui_trWhatsAppEffectivenessContact,#ui_trTotalclick,#ui_trWASentdata,#ui_trWABounced").empty().append(`< tr > <td colspan="10" class="border-bottom-none"><div class="no-data">There is no data for this view</div></td></tr >`);
                    HidePageLoading();
                }
                else if (maxRowCount > 0) {
                    $("#ui_exportDownloadwhatsappdetails").removeClass("hideDiv");
                    $(".popupfooter").show();
                    let numberOfRecords = 10;
                    WhatsAppPopReportUtil.BindPopReport(numberOfRecords, action, sentContactDetails);
                }
            },
            error: ShowAjaxError
        });

    },

    BindPopReport: function (numberRowsCount, action, sentContactDetails) {
        WhatsAppSendingSetting = sentContactDetails;
        Action = action;
        let OffSet = rowIndex;
        let FetchNext = numberRowsCount;

        $.ajax({
            url: "/WhatsApp/WhatsAppReport/GetReportDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'sentContactDetails': sentContactDetails, 'OffSet': OffSet, 'FetchNext': FetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) { WhatsAppPopReportUtil.BindPopReportDetails(response, action) },
            error: ShowAjaxError
        });
        //FromDateTime = FromDateTimes;
        //ToDateTime = ToDateTimes;
    },

    BindPopReportDetails: function (response, action) {
        HidePageLoading();
        $("#ui_trSentdata").empty();
        $("#ui_trBounced").empty();
        currentTotalRow = response.length;
        WhatsAppPopReportUtil.ShowPaging(currentTotalRow);

        if (action == 0 || action == 1 || action == 2 || action == 4 || action == 5 || action == 6 || action == 7) {
            $.each(response, function () {

                let Date = action == 1 ? $(this)[0].DeliveredDate : $(this)[0].SentDate;
                Date = Date != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(Date)) : "NA";
                let trtablerow = ` <tr>
                                <td class="text-left td-icon">${$(this)[0].PhoneNumber}</td>
                                <td>${$(this)[0].ResponseId != undefined && $(this)[0].ResponseId != null && $(this)[0].ResponseId.length > 0 ? $(this)[0].ResponseId : "NA"}</td>
                                <td>${Date}</td>
                                </tr>`;

                $("#ui_trSentdata,#ui_trWASentdata").append(trtablerow);

            });
        } else {

            $.each(response, function () {
                let SentDate = $(this)[0].SentDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].SentDate)) : "NA";
                let trtablerow = ` <tr>
                                    <td class="text-left td-icon">${$(this)[0].PhoneNumber}</td>
                                    <td>${$(this)[0].ResponseId != undefined && $(this)[0].ResponseId != null && $(this)[0].ResponseId.length > 0 ? $(this)[0].ResponseId : "NA"}</td>
                                    <td>${$(this)[0].ErrorMessage != undefined && $(this)[0].ErrorMessage != null && $(this)[0].ErrorMessage.length > 0 ? $(this)[0].ErrorMessage : "NA"}</td>
                                    <td>${SentDate}</td>
                              </tr>`;

                $("#ui_trBounced,#ui_trWABounced").append(trtablerow);
            });
        }
    },
    PopclickMaxCount: function (sentContactDetails) {
        maxRowCount = 0, Offset = 0, rowIndex = 0;
        $.ajax({
            url: "/WhatsApp/WhatsAppReport/GetMaxClickCount",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'sentContactDetails': sentContactDetails, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                maxRowCount = response;
                if (maxRowCount == 0) {
                    $(".popupfooter").hide();
                    $("#ui_exportDownloadwhatsappdetails").addClass("hideDiv");
                    $("#ui_trSentdata,#ui_trBounced,#ui_trWhatsAppEffectivenessUrl,#ui_trWhatsAppEffectivenessContact,#ui_trTotalclick").empty().append(`<tr><td colspan="10" class="border-bottom-none"><div class="no-data">There is no data for this view</div></td></tr>`);
                    HidePageLoading();
                }
                else if (maxRowCount > 0) {
                    $(".popupfooter").show();
                    $("#ui_exportDownloadwhatsappdetails").removeClass("hideDiv");
                    let numberOfRecords = 10;
                    WhatsAppPopReportUtil.BindPopClickReport(numberOfRecords, sentContactDetails);
                }
            },
            error: ShowAjaxError
        });
    },

    BindPopClickReport: function (numberRowsCount, sentContactDetails) {
        WhatsAppSendingSetting = sentContactDetails;
        let OffSet = rowIndex;
        let FetchNext = numberRowsCount;

        $.ajax({
            url: "/WhatsApp/WhatsAppReport/GetClickReportDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'sentContactDetails': sentContactDetails, 'OffSet': OffSet, 'FetchNext': FetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) { WhatsAppPopReportUtil.BindPopClickReportDetails(response) },
            error: ShowAjaxError
        });
    },

    BindPopClickReportDetails: function (response) {
        HidePageLoading();
        currentTotalRow = response.length;
        WhatsAppPopReportUtil.ShowPaging(currentTotalRow);

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

    InitialUniqueEffectivenessReport: function (WhatsAppSendingSettingId, IsUniqe) {
        let WhatsAppCampaignEffectivenessReport = { WhatsAppSendingSettingId: 0, IsUniqe: 0, UrlLink: "" };
        WhatsAppCampaignEffectivenessReport.WhatsAppSendingSettingId = WhatsAppSendingSettingId;
        WhatsAppCampaignEffectivenessReport.IsUniqe = IsUniqe;

        WhatsAppPopReportUtil.UniqueMaxCount(WhatsAppCampaignEffectivenessReport);
    },

    UniqueMaxCount: function (WhatsAppCampaignEffectivenessReport) {
        ShowPageLoading();
        maxRowCount = 0, Offset = 0, rowIndex = 0;
        $.ajax({
            url: "/WhatsApp/WhatsAppEffectivenessReport/MaxCount",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WhatsAppCampaignEffectivenessReport': WhatsAppCampaignEffectivenessReport }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                maxRowCount = response.returnVal;
                if (maxRowCount == 0) {
                    $(".popupfooter").hide();
                    $("#ui_trWASentdata,#ui_trWABounced,#ui_trWhatsAppEffectivenessUrl,#ui_trWhatsAppEffectivenessContact,#ui_trTotalclick").empty().append(`<tr><td colspan="10" class="border-bottom-none"><div class="no-data">There is no data for this view</div></td></tr>`);
                    HidePageLoading();
                }
                else if (maxRowCount > 0) {
                    $(".popupfooter").show();
                    let numberOfRecords = 10;
                    WhatsAppPopReportUtil.BindUniqueClicks(numberOfRecords, WhatsAppCampaignEffectivenessReport);
                }
            },
            error: ShowAjaxError
        });
    },

    BindUniqueClicks: function (numberRowsCount, WhatsAppCampaignEffectivenessReport) {
        WhatsAppCampaignEffectivenessReport = WhatsAppCampaignEffectivenessReport;
        let OffSet = rowIndex;
        let FetchNext = numberRowsCount;

        $.ajax({
            url: "/WhatsApp/WhatsAppEffectivenessReport/GetReportDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WhatsAppCampaignEffectivenessReport': WhatsAppCampaignEffectivenessReport, 'OffSet': OffSet, 'FetchNext': FetchNext }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                HidePageLoading();
                currentTotalRow = response.length;
                WhatsAppPopReportUtil.ShowPaging(currentTotalRow);
                $("#ui_trWhatsAppEffectivenessContact").empty();
                $.each(response, function () {
                    let trtablerow = `<tr>
                                        <td class="text-left td-icon">${$(this)[0].PhoneNumber}</td>                                        
                                      </tr>`;

                    $("#ui_trWhatsAppEffectivenessContact").append(trtablerow);
                });
            },
            error: ShowAjaxError
        });
    },

    InitialURLEffectivenessReport: function (WhatsAppSendingSettingId) {
        let WhatsAppclicks = { WhatsAppSendingSettingId: 0 };
        WhatsAppclicks.WhatsAppSendingSettingId = WhatsAppSendingSettingId;
        WhatsAppPopReportUtil.URLMaxCount(WhatsAppclicks);
    },

    URLMaxCount: function (WhatsAppclicks) {
        ShowPageLoading();
        maxRowCount = 0, Offset = 0, rowIndex = 0;
        $.ajax({
            url: "/WhatsApp/ClickUrl/MaxCount",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WhatsAppSendingSettingId': WhatsAppclicks }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                maxRowCount = response.returnVal;
                if (maxRowCount == 0) {
                    $(".popupfooter").hide();
                    $("#ui_trWASentdata,#ui_trWABounced,#ui_trWhatsAppEffectivenessUrl,#ui_trWhatsAppEffectivenessContact,#ui_trTotalclick").empty().append(`<tr><td colspan="10" class="border-bottom-none"><div class="no-data">There is no data for this view</div></td></tr>`);
                    HidePageLoading();
                }
                else if (maxRowCount > 0) {
                    $(".popupfooter").show();
                    let numberOfRecords = 10;
                    WhatsAppPopReportUtil.BindURLClicks(numberOfRecords, WhatsAppclicks);
                }
            },
            error: ShowAjaxError
        });
    },

    BindURLClicks: function (numberRowsCount, WhatsAppclicks) {
        WhatsAppclicks = WhatsAppclicks;
        let OffSet = rowIndex;
        let FetchNext = numberRowsCount;

        $.ajax({
            url: "/WhatsApp/ClickUrl/GetResponseData",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WhatsAppSendingSettingId': WhatsAppclicks, 'OffSet': OffSet, 'FetchNext': FetchNext }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                HidePageLoading();
                currentTotalRow = response.length;
                WhatsAppPopReportUtil.ShowPaging(currentTotalRow);
                $("#ui_trWhatsAppEffectivenessUrl").empty();
                $.each(response, function () {
                    let trtablerow = `<tr><td class="text-left td-icon">${$(this)[0].ClickURL}</td>
                                    <td>${$(this)[0].TotalClick}</td>
                                    <td>${$(this)[0].TotalUniqueClick}</td></tr>`;

                    $("#ui_trWhatsAppEffectivenessUrl").append(trtablerow);
                });
            },
            error: ShowAjaxError
        });
    },

    ShowPaging: function (currentTotalRow) {

        if (rowIndex == 0) {
            $("#ui_WAPaging").html((rowIndex + 1) + ' - ' + currentTotalRow + ' of ' + maxRowCount);
            $("#ui_WABackpopPaging").addClass('disableDiv');
        }
        else {
            $("#ui_WAPaging").html((rowIndex + 1) + ' - ' + (rowIndex + currentTotalRow) + ' of ' + maxRowCount);
            $("#ui_WABackpopPaging").removeClass('disableDiv');
        }

        if ((rowIndex + currentTotalRow) >= maxRowCount) {
            $("#ui_WANextPopPaging").addClass('disableDiv');
        } else {
            $("#ui_WANextPopPaging").removeClass('disableDiv');
        }

        $("#ui_trWASentdata,#ui_trWABounced,#ui_trWhatsAppEffectivenessUrl,#ui_trWhatsAppEffectivenessContact,#ui_trTotalclick").empty();
    },

    CallPopBackPaging: function (IsCampaignOrUrlOrUnique) {
        ShowPageLoading();
        if (IsCampaignOrUrlOrUnique == 1)
            WhatsAppPopReportUtil.BindPopReport(10, Action, WhatsAppSendingSetting);
        else if (IsCampaignOrUrlOrUnique == 2)
            WhatsAppPopReportUtil.BindUniqueClicks(10, WhatsAppCampaignEffectivenessReport);
        else if (IsCampaignOrUrlOrUnique == 3)
            WhatsAppPopReportUtil.BindURLClicks(10, WhatsAppclicks);
        else if (IsCampaignOrUrlOrUnique == 4)
            WhatsAppPopReportUtil.BindPopClickReport(10, WhatsAppSendingSetting);
    },
};

function GetEachReport(WhatsAppSendingSettingId, action) {
    WhatsAppPopReportUtil.InitialCampaignFilterValues(WhatsAppSendingSettingId, action, 0);
}

function GetUniqueEffectivenessReport(WhatsAppSendingSettingId, IsUniqe) {
    IsCampaignOrUrlOrUnique = 2;
    WhatsAppPopReportUtil.InitialUniqueEffectivenessReport(WhatsAppSendingSettingId, IsUniqe);
}

function GetURLEffectivenessReport(WhatsAppSendingSettingId) {
    IsCampaignOrUrlOrUnique = 3;
    WhatsAppPopReportUtil.InitialURLEffectivenessReport(WhatsAppSendingSettingId);
}


var campsenddets;
$(document).on('click', '.sentpopup', function () {
    campsenddets = $(this).attr("data-sentdetail");
    $(".camppopupwrppr").addClass("hideDiv");
    $("#ui_exportClickDownload").addClass("hideDiv");
    if (campsenddets == "Sent" || campsenddets == "Delivered" || campsenddets == "Read" || campsenddets == "Optout") {
        $(".popupcontainer").removeClass('hideDiv');
        $(".popupbodycont").removeClass("pad-10");
        $(".popupItem").addClass("popup-tbl").removeClass('w-650').addClass("w-450");
        $(".popuptitle h6").html(`${campsenddets} Details`);
        $("#ui_Paggingdiv").show(); $("#ui_Groupsdiv").addClass("hideDiv");
        $("#Sent").removeClass('hideDiv');
        $("#ui_exportClickDownload").removeClass("hideDiv");
    } else if (campsenddets == "Error" || campsenddets == "Failed") {
        $(".popupcontainer").removeClass('hideDiv');
        $(".popupbodycont").removeClass("pad-10");
        $(".popupItem").addClass("popup-tbl").removeClass('w-450').addClass("w-650");
        $(".popuptitle h6").html(`${campsenddets} Details`);
        $("#ui_Paggingdiv").show(); $("#ui_Groupsdiv").addClass("hideDiv");
        $("#Error").removeClass('hideDiv');
        $("#ui_exportClickDownload").removeClass("hideDiv");
    } else if (campsenddets == "UniqueClick") {
        reportnewwdtoexport = 'UniqueClick';
        $(".popupcontainer").removeClass('hideDiv');
        $(".popupbodycont").removeClass("pad-10");
        $(".popupItem").addClass("popup-tbl").removeClass('w-650').addClass("w-450");
        $(".popuptitle h6").html(`Effectiveness Reports`);
        $("#ui_Paggingdiv").show(); $("#ui_Groupsdiv").addClass("hideDiv");
        $("#WhatsAppUniqueClick").removeClass('hideDiv');
        $("#ui_exportClickDownload").removeClass("hideDiv");
    } else if (campsenddets == "EffectivenessURL") {
        reportnewwdtoexport = 'ClickedUrl';
        $(".popupcontainer").removeClass('hideDiv');
        $(".popupbodycont").removeClass("pad-10");
        $(".popupItem").addClass("popup-tbl").removeClass('w-450').addClass("w-650");
        $(".popuptitle h6").html(`Campaign Reports by Clicks`);
        $("#ui_Paggingdiv").show(); $("#ui_Groupsdiv").addClass("hideDiv");
        $("#WhatsAppEffectivenessURL").removeClass('hideDiv');
    }
    else if (campsenddets == "Clicked") {
        $(".popupcontainer").removeClass('hideDiv');
        $(".popupbodycont").removeClass("pad-10");
        $(".popupItem").addClass("popup-tbl").removeClass('w-450').addClass("w-650");
        $(".popuptitle h6").html(`${campsenddets} Details`);
        $("#ui_Paggingdiv").show(); $("#ui_Groupsdiv").addClass("hideDiv");
        $("#WhatsAppTotalClick").removeClass('hideDiv');
        $("#ui_exportClickDownload").removeClass("hideDiv");
    }
});

$(document.body).on('click', '#ui_WABackpopPaging', function (event) {
    rowIndex = rowIndex - 10;
    rowIndex <= 0 ? 0 : rowIndex;
    WhatsAppPopReportUtil.CallPopBackPaging(IsCampaignOrUrlOrUnique);
});

$(document.body).on('click', '#ui_WANextPopPaging', function (event) {
    rowIndex = rowIndex + 10;
    WhatsAppPopReportUtil.CallPopBackPaging(IsCampaignOrUrlOrUnique);
});
$(document.body).on('click', '#ui_exportClickDownload', function (event) {
    WhatsAppClickDataExport();
});
$(document.body).on('click', '#ui_exportDownloadwhatsappdetails', function (event) {
     
    ExportFunctionNameInnerPage = "/WhatsApp/WhatsAppReport/ExportClickReport";
    ExportChannel = "WhatsApp";
    ExportDataOF = reportnewwdtoexport
    $("#ui_ContactdownloadModal").modal('show');

});
//$(document.body).on('click', '#ui_exportDownloadwhatsappdetails', function (event) {
//    WhatsAppClickDataExport();
//});
function WhatsAppClickDataExport() {
    ShowPageLoading();
    var datareuired = '';
    var datacount = 0;
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

    else if ($("#ui_trWhatsAppEffectivenessUrl > tr").length) {
        reportnewwdtoexport = 'uniqueclicks';
        datacount = $("#ui_trWhatsAppEffectivenessUrl > tr").length;
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
        url: "/WhatsApp/WhatsAppReport/ExportClickReport",
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
