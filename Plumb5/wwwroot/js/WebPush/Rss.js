var CampaignNam = null;
$(document).ready(function () {
    GetUTCDateTimeRange(2);
    ExportFunctionName = "ExportRssCampaign";
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    MaxCount();
}

function CallBackPaging() {
    CurrentRowCount = 0;
    GetReport();
}

function MaxCount() {
    CampaignName = null;
    if ($("#txt_SearchBy").val().length > 0) {
        CampaignName = $("#txt_SearchBy").val();
    }

    $.ajax({
        url: "/WebPush/ManageBrowserNotifications/GetRssMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'CampaignName': CampaignName }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response !== undefined && response !== null) {
                TotalRowCount = response.returnVal;
            }

            if (TotalRowCount > 0) {
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tableReport', 3, 'ui_tbodyReportData');
                ShowExportDiv(false);
                ShowPagingDiv(false);
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/WebPush/ManageBrowserNotifications/GetRssData",
        type: 'Post',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext, 'CampaignName': CampaignName }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    SetNoRecordContent('ui_tableReport', 3, 'ui_tbodyReportData');
    if (response.webPushRssFeeds !== undefined && response.webPushRssFeeds !== null && response.webPushRssFeeds.length > 0) {
        CurrentRowCount = response.webPushRssFeeds.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        var reportTableTrs;
        $.each(response.webPushRssFeeds, function () {
            var status = this.Status == true ? "Active" : "Inactive";
            reportTableTrs += "<tr>" +
                "<td><div class='groupnamewrap'><div class='nameTxtWrap pr-3 wordbreak'>" + this.CampaignName + "</div>" +
                "<div class='tdcreatedraft'><div class='dropdown'><button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='icon ion-android-more-vertical mr-0'></i></button>" +
                " <div class='dropdown-menu dropdown-menu-right' aria-labelledby='filterbycontacts'><a data-grouptype='groupedit' class='dropdown-item ContributePermission' href='/WebPush/RssFeed?WebPushRssFeedId=" + this.Id + "'>Edit</a>" +
                "<a data-grouptype='groupchangestatus' class='dropdown-item ContributePermission' href='javascript:void(0);' onClick='ChangeRssStatus(" + this.Id + "," + this.Status + ");'>Change Status</a>" +
                "<div class='dropdown-divider'></div><a id='ui_aDeleteRss_" + this.Id + "' data-toggle='modal' data-target='#deletegroups' data-groupid='" + this.Id + "' data-grouptype='groupDelete' class='dropdown-item FullControlPermission' href='javascript:void(0);'>Delete</a></div></div></div></div></td>" +
                "<td class='" + (this.Status ? 'td-wid-10 text-color-success' : 'td-wid-10 text-color-error') + "'>" + status + "</td>" +
                "<td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.UpdatedDate)) + "</td>" +
                "</tr>";
        });
        ShowExportDiv(true);
        ShowPagingDiv(true);
        $("#ui_tableReport").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
    }
    else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
    CheckAccessPermission("WebPush");
}

function ChangeRssStatus(RssId, CurrentStatus) {
    ShowPageLoading();
    if (CurrentStatus) {
        CurrentStatus = false;
    } else {
        CurrentStatus = true;
    }

    $.ajax({
        url: "/WebPush/ManageBrowserNotifications/ChangeRssStatus",
        type: 'POST',
        data: JSON.stringify({
            'accountId': Plumb5AccountId, 'Id': RssId, 'Status': CurrentStatus
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.WebPushRssError.UpdateSuccess);
                CallBackFunction();
            } else {
                ShowErrorMessage(GlobalErrorList.WebPushRssError.UpdateError);
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

var DeleteRssId = 0;
$(document).on('click', "[id^='ui_aDeleteRss_']", function () {
    DeleteRssId = parseInt($(this).attr("data-groupid"));
});

$("#deleteRowConfirm").click(function () {
    ShowPageLoading();
    $.ajax({
        url: "/WebPush/ManageBrowserNotifications/DeleteRss",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': DeleteRssId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.WebPushRssError.DeletedSuccess);
                CallBackFunction();
            } else {
                ShowErrorMessage(GlobalErrorList.WebPushRssError.DeletedError);
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
});

document.getElementById("txt_SearchBy").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        CallBackFunction();
        event.preventDefault();
    }
    else {
        var templateName = CleanText($('#txt_SearchBy').val());
        if (templateName === '') {
            CallBackFunction();
        }
    }
});

//Search text
$(".contsearchfocus")
    .on("focus", function () {
        $(this).parent().addClass("w-300");
    })
    .on("blur", function () {
        if ($(".contsearchfocus").val().length < 15)
            $(this).parent().removeClass("w-300");
    });
