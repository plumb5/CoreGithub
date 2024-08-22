
$(document).ready(function () {
    GetUTCDateTimeRangeForNext(1);
    ExportFunctionName = "ExportScheduleCampaign";
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
    var getName = $("#txt_SearchBy").val();
    $.ajax({
        url: "/WebPush/ManageBrowserNotifications/GetScheduledMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'Name': getName }),
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
                SetNoRecordContent('ui_tableReport', 4, 'ui_tbodyReportData');
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
    var getName = $("#txt_SearchBy").val();
    $.ajax({
        url: "/WebPush/ManageBrowserNotifications/GetScheduledData",
        type: 'Post',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext, 'Name': getName }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    SetNoRecordContent('ui_tableReport', 4, 'ui_tbodyReportData');
    if (response.webPushSendingSettings !== undefined && response.webPushSendingSettings !== null && response.webPushSendingSettings.length > 0) {
        CurrentRowCount = response.webPushSendingSettings.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        var reportTableTrs;
        $.each(response.webPushSendingSettings, function () {

            let statusAndEditOption = GetStatus(this.ScheduledStatus, this.StoppedReason);

            var editpush = "";
            var deletetext = "";
            if (statusAndEditOption.IsEditable) {
                editpush = "<a class='dropdown-item ContributePermission' href='/WebPush/ScheduleCampaign?SettingsId=" + this.Id + "'>Edit</a>";
                deletetext = "<div class='dropdown-divider'></div><a data-toggle='modal' data-target='#deletegroups' data-grouptype='groupDelete' class='dropdown-item FullControlPermission' href='javascript:void(0);' onclick='AssignDeleteValue(" + this.Id + ")'>Delete</a>";
            }

            reportTableTrs += "<tr>" +
                "<td><div class='groupnamewrap'><div class='nameTxtWrap'>" + this.Name + "</div>" +
                "<div class='tdcreatedraft'><div class='dropdown'><button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='icon ion-android-more-vertical mr-0'></i></button>" +
                "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='filterbycontacts'>" + editpush + "" +
                "<a class='dropdown-item ContributePermission' href='/WebPush/ScheduleCampaign?Action=Copy&SettingsId=" + this.Id + "'>Duplicate</a> " +
                //"<a class='dropdown-item testrestpop' href='javascript:void(0);'>Last Test Results</a>" +
                "" + deletetext + "</div></div></div></div>" +
                "" + statusAndEditOption.label + "</td>" +
                "<td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.UpdatedDate)) + "</td> " +
                "<td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.ScheduledDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.ScheduledDate)) + "</td> " +
                "</tr>";
        });
        ShowExportDiv(true);
        ShowPagingDiv(true);
        $("#ui_tableReport").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        $(".creditalertblink").popover();
    }
    else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
    CheckAccessPermission("WebPush");
}

var PushSendingSettingId = 0;
function AssignDeleteValue(Id) {
    PushSendingSettingId = Id;
}

$("#deleteRowConfirmpush").click(function () {
    $.ajax({
        url: "/WebPush/ManageBrowserNotifications/DeleteScheduled",
        type: 'Post',
        data: JSON.stringify({ "accountId": Plumb5AccountId, "Id": PushSendingSettingId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.SmsSchedule.SmsScheduleDeleteSuccess);
                CallBackFunction();
            } else {
                ShowErrorMessage(GlobalErrorList.SmsSchedule.SmsScheduleDeleteError);
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


function GetStatus(ScheduledStatus, StoppedReason) {

    if (ScheduledStatus === 0) {
        return { label: '<p class="mb-0 text-color-success font-11">Completed</p>', IsEditable: false };
    } else if (ScheduledStatus == 2) {
        return { label: '<p class="mb-0 text-color-progress font-11">In-Progress</p>', IsEditable: false };
    } else if (ScheduledStatus == 1) {
        return { label: '<p class="mb-0 text-color-queued font-11">Yet to go</p>', IsEditable: true };
    } else {
        return { label: '<p class="mb-0 text-color-error font-11">Stopped <i class="icon ion-ios-information creditalertblink" data-toggle="popover" data-trigger="hover" data-content="' + StoppedReason + '"></i></p>', IsEditable: false };
    }
}