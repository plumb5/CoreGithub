var Action = 0;
var pending = 0;
var maxRowCount = 0, Offset = 0, rowIndex = 0;
var IsCampaignOrUrlOrUnique = 1;
var SmsSendingSetting = {};
var SmstriggerEffectivenessReport = {};
var Triggerclicks = {};

var PopOverUtil = {
    PopMaxCount: function (action, sentContactDetails) {
        maxRowCount = 0, Offset = 0, rowIndex = 0;
        $.ajax({
            url: "/Sms/TriggerEachReport/GetMaxCount",
            type: 'POST',
            data: JSON.stringify({ 'triggerEachReport': sentContactDetails, 'pending': pending, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                maxRowCount = response.returnVal;
                if (maxRowCount == 0) {
                    $(".popupfooter").hide();
                    $("#ui_trSentdata,#ui_trBounced,#ui_trtriggerEffectivenessUrl,#ui_trTriggerUniqueClickdata").empty().append(`<tr><td colspan="10" class="border-bottom-none"><div class="no-data">There is no data for this view</div></td></tr>`);
                    HidePageLoading();
                }
                else if (maxRowCount > 0) {
                    $(".popupfooter").show();
                    let numberOfRecords = 15;
                    PopOverUtil.CreateTable(numberOfRecords, action, sentContactDetails);
                }
            },
            error: ShowAjaxError
        });
    },
    CreateTable: function (numberOfRecords, action, sentContactDetails) {
        SmsSendingSetting = sentContactDetails;
        Action = action;
        let OffSet = rowIndex;
        let FetchNext = numberOfRecords;

        $.ajax({
            url: "/Sms/TriggerEachReport/GetSentContacts",
            type: 'Post',
            data: JSON.stringify({ 'OffSet': OffSet, 'FetchNext': FetchNext, 'triggerEachReport': sentContactDetails, 'pending': pending, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) { PopOverUtil.BindReportDetails(response, action) },
            error: ShowAjaxError
        });
    },
    BindReportDetails: function (response, action) {
        HidePageLoading();
        currentTotalRow = response.length;
        PopOverUtil.ShowPaging(currentTotalRow);

        $("#ui_trSentdata,#ui_trBounced").empty();
        if (action == 0 || action == 1 || action == 4 || action == 2 || action == 6) {
            $.each(response, function () {

                let Date = action == 1 ? $(this)[0].DeliveryTime : action == 2 ? $(this)[0].ClickDate : $(this)[0].SentDate;
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
                let BouncedDate = $(this)[0].BouncedDate != null ? $(this)[0].BouncedDate : $(this)[0].SentDate;
                BouncedDate = BouncedDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(BouncedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(BouncedDate)) : "NA";

                let trtablerow = ` <tr>
                                <td class="text-left td-icon">${$(this)[0].PhoneNumber}</td>
                                <td>${$(this)[0].ResponseId != undefined && $(this)[0].ResponseId != null && $(this)[0].ResponseId.length > 0 ? $(this)[0].ResponseId : "NA"}</td>
                                <td>${$(this)[0].ReasonForNotDelivery != undefined && $(this)[0].ReasonForNotDelivery != null && $(this)[0].ReasonForNotDelivery.length > 0 ? $(this)[0].ReasonForNotDelivery : "NA"}</td>
                                <td>${BouncedDate}</td>
                              </tr>`;

                $("#ui_trBounced").append(trtablerow);

            });
        }
    },

    InitialUniqueEffectivenessReport: function (TriggerMailSmsId, IsUniqe) {
        let triggerEffectivenessReport = { TriggerMailSmsId: 0, IsUniqe: 0, UrlLink: "" };
        triggerEffectivenessReport.TriggerMailSmsId = TriggerMailSmsId;
        triggerEffectivenessReport.IsUniqe = IsUniqe;

        PopOverUtil.UniqueMaxCount(triggerEffectivenessReport);
    },
    UniqueMaxCount: function (triggerEffectivenessReport) {
        ShowPageLoading();
        maxRowCount = 0, Offset = 0, rowIndex = 0;
        $.ajax({
            url: "/SMS/TriggerSmsEffectivenessReport/MaxCount",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'smstriggerEffectivenessReport': triggerEffectivenessReport }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                maxRowCount = response.returnVal;
                if (maxRowCount == 0) {
                    $(".popupfooter").hide();
                    $("#ui_trSentdata,#ui_trBounced,#ui_trtriggerEffectivenessUrl,#ui_trTriggerUniqueClickdata").empty().append(`<tr><td colspan="10" class="border-bottom-none"><div class="no-data">There is no data for this view</div></td></tr>`);
                    HidePageLoading();
                }
                else if (maxRowCount > 0) {
                    $(".popupfooter").show();
                    let numberOfRecords = 10;
                    PopOverUtil.BindUniqueClicks(numberOfRecords, triggerEffectivenessReport);
                }
            },
            error: ShowAjaxError
        });
    },
    BindUniqueClicks: function (numberRowsCount, triggerEffectivenessReport) {
        SmstriggerEffectivenessReport = triggerEffectivenessReport;
        let OffSet = rowIndex;
        let FetchNext = numberRowsCount;

        $.ajax({
            url: "/Sms/TriggerSmsEffectivenessReport/GetReportDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'smstriggerEffectivenessReport': triggerEffectivenessReport, 'OffSet': OffSet, 'FetchNext': FetchNext }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                HidePageLoading();
                currentTotalRow = response.length;
                PopOverUtil.ShowPaging(currentTotalRow);
                $("#ui_trTriggerUniqueClickdata").empty();
                $.each(response, function () {
                    let trtablerow = `<tr>
                                        <td class="text-left td-icon">${$(this)[0].PhoneNumber}</td>                                        
                                      </tr>`;

                    $("#ui_trTriggerUniqueClickdata").append(trtablerow);
                });
            },
            error: ShowAjaxError
        });
    },

    InitialURLEffectivenessReport: function (TriggerMailSmsId) {
        let triggerclicks = { TriggerMailSmsId: 0 };
        triggerclicks.TriggerMailSmsId = TriggerMailSmsId;
        PopOverUtil.URLMaxCount(triggerclicks);
    },
    URLMaxCount: function (triggerclicks) {
        ShowPageLoading();
        maxRowCount = 0, Offset = 0, rowIndex = 0;
        $.ajax({
            url: "/SMS/TriggerClickUrl/MaxCount",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'triggerDrips': triggerclicks }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                maxRowCount = response.returnVal;
                if (maxRowCount == 0) {
                    $(".popupfooter").hide();
                    $("#ui_trSentdata,#ui_trBounced,#ui_trtriggerEffectivenessUrl,#ui_trTriggerUniqueClickdata").empty().append(`<tr><td colspan="10" class="border-bottom-none"><div class="no-data">There is no data for this view</div></td></tr>`);
                    HidePageLoading();
                }
                else if (maxRowCount > 0) {
                    $(".popupfooter").show();
                    let numberOfRecords = 15;
                    PopOverUtil.BindURLClicks(numberOfRecords, triggerclicks);
                }
            },
            error: ShowAjaxError
        });
    },
    BindURLClicks: function (numberOfRecords, triggerclicks) {
        Triggerclicks = triggerclicks;
        let OffSet = rowIndex;
        let FetchNext = numberOfRecords;

        $.ajax({
            url: "/SMS/TriggerClickUrl/GetResponseData",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'triggerDrips': triggerclicks, 'OffSet': OffSet, 'FetchNext': FetchNext }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                HidePageLoading();
                currentTotalRow = response.length;
                PopOverUtil.ShowPaging(currentTotalRow);
                $("#ui_trtriggerEffectivenessUrl").empty();
                $.each(response, function () {
                    let trtablerow = `<td class="text-left td-icon">${$(this)[0].ClickURL}</td>
                                    <td>${$(this)[0].TotalClick}</td>
                                    <td>${$(this)[0].TotalUniqueClick}</td>`;

                    $("#ui_trtriggerEffectivenessUrl").append(trtablerow);
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
    },
    CallPopBackPaging: function (IsCampaignOrUrlOrUnique) {
        ShowPageLoading();
        if (IsCampaignOrUrlOrUnique == 1)
            PopOverUtil.BindReportDetails(15, Action, SmsSendingSetting);
        else if (IsCampaignOrUrlOrUnique == 2)
            PopOverUtil.BindUniqueClicks(15, SmstriggerEffectivenessReport);
        else if (IsCampaignOrUrlOrUnique == 3)
            PopOverUtil.BindURLClicks(15, Triggerclicks);
    }
};

function GetEachReport(TriggerMailSmsId, action) {
    ShowPageLoading();

    let triggerEachReport = { TriggerMailSmsId: 0, TriggerSMSDripsId: 0, SDelivered: 0, SClicked: 0, SendStatus: null, IsUnsubscribed: 0, NotDeliverStatus: 0, PhoneNumber: "", ReasonForNotDelivery: "" };

    triggerEachReport.TriggerMailSmsId = TriggerMailSmsId;
    pending = 0;
    if (action == 0) {
        triggerEachReport.SendStatus = 1;
    } else if (action == 1) {
        triggerEachReport.SDelivered = 1;
    } else if (action == 2) {
        triggerEachReport.SClicked = 1;
    } else if (action == 3) {
        triggerEachReport.NotDeliverStatus = 1;
    } else if (action == 4) {
        pending = 1;
    } else if (action == 6) {
        triggerEachReport.IsUnsubscribed = 1;
    } else if (action == 5) {
        triggerEachReport.SendStatus = 0;
    } else if (action == 7) {
        triggerEachReport.SendStatus = 0;
    } else if (action == 8) {
        triggerEachReport.SendStatus = 0;
    }

    PopOverUtil.PopMaxCount(action, triggerEachReport);
}

function GetURLEffectivenessReport(TriggerMailSmsId) {
    IsCampaignOrUrlOrUnique = 3;
    PopOverUtil.InitialURLEffectivenessReport(TriggerMailSmsId);
}

function GetUniqueEffectivenessReport(TriggerMailSmsId, IsUniqe) {
    IsCampaignOrUrlOrUnique = 2;
    PopOverUtil.InitialUniqueEffectivenessReport(TriggerMailSmsId, IsUniqe);
}


$(document).on('click', '.sentpopup', function () {
    var campsenddets = $(this).attr("data-sentdetail");
    $(".camppopupwrppr").addClass("hideDiv");
    if (campsenddets == "Sent" || campsenddets == "Delivered" || campsenddets == "Pending" || campsenddets == "Clicked" || campsenddets == "Optout") {
        $(".popupcontainer").removeClass('hideDiv');
        $(".popupbodycont").removeClass("pad-10");
        $(".popupItem").addClass("popup-tbl").removeClass('w-650').addClass("w-450");
        $(".popuptitle h6").html(`${campsenddets} Details`);
        $("#ui_Paggingdiv").show(); $("#ui_Groupsdiv").addClass("hideDiv");
        $("#Sent").removeClass('hideDiv');
    } else if (campsenddets == "Error" || campsenddets == "Bounce") {
        $(".popupcontainer").removeClass('hideDiv');
        $(".popupbodycont").removeClass("pad-10");
        $(".popupItem").addClass("popup-tbl").removeClass('w-450').addClass("w-650");
        $(".popuptitle h6").html(`${campsenddets} Details`);
        $("#ui_Paggingdiv").show(); $("#ui_Groupsdiv").addClass("hideDiv");
        $("#Error").removeClass('hideDiv');
    } else if (campsenddets == "UniqueClick") {
        $(".popupcontainer").removeClass('hideDiv');
        $(".popupbodycont").removeClass("pad-10");
        $(".popupItem").addClass("popup-tbl").removeClass('w-650').addClass("w-450");
        $(".popuptitle h6").html(`Effectiveness Reports`);
        $("#ui_Paggingdiv").show(); $("#ui_Groupsdiv").addClass("hideDiv");
        $("#TriggerUniqueClick").removeClass('hideDiv');
    } else if (campsenddets == "EffectivenessURL") {
        $(".popupcontainer").removeClass('hideDiv');
        $(".popupbodycont").removeClass("pad-10");
        $(".popupItem").addClass("popup-tbl").removeClass('w-450').addClass("w-650");
        $(".popuptitle h6").html(`Effectiveness Reports`);
        $("#ui_Paggingdiv").show(); $("#ui_Groupsdiv").addClass("hideDiv");
        $("#TriggerEffectivenessURL").removeClass('hideDiv');
    }
});

$(document.body).on('click', '#ui_BackpopPaging', function (event) {
    rowIndex = rowIndex - 15;
    rowIndex <= 0 ? 0 : rowIndex;
    PopOverUtil.CallPopBackPaging(IsCampaignOrUrlOrUnique);
});

$(document.body).on('click', '#ui_NextPopPaging', function (event) {
    rowIndex = rowIndex + 15;
    PopOverUtil.CallPopBackPaging(IsCampaignOrUrlOrUnique);
});