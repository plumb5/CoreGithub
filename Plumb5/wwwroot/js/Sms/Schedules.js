var CampaignName = null;

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

    $.ajax({
        url: "/Sms/Schedules/GetMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'CampignName': CampaignName }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response != undefined && response != null) {
                TotalRowCount = response;
            }

            if (TotalRowCount > 0) {
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}
function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/Sms/Schedules/ShowSetSchedule",
        type: 'Post',
        data: JSON.stringify({ 'OffSet': OffSet, 'FetchNext': FetchNext, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'CampignName': CampaignName }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}
function BindReport(response) {

    SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');
    if (response != undefined && response != null) {
        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);


        var reportTableTrs;

        $.each(response, function () {
            let statusAndEditOption = GetStatus(this.ScheduledStatus, this.StoppedReason);
            let content = "";
            let groupName = this.GroupName != null && this.GroupName != undefined ? this.GroupName : "NA";
            if (this.ScheduleBatchType != null && this.ScheduleBatchType.toLowerCase() == "multiple") {
                content = '<a data-grouptype="groupedit" class="dropdown-item ContributePermission" href="/Sms/ScheduleCampaign/?Action=Edit&Id=' + this.SmsSendingSettingId + '">Edit</a>';
                statusAndEditOption.label = '<p class="mb-0 text-color-queued font-11">Multiple</p>';
            } else {
                if (statusAndEditOption.IsEditable) {
                    content = '<a data-grouptype="groupedit" class="dropdown-item ContributePermission" href="/Sms/ScheduleCampaign/?Action=Edit&Id=' + this.SmsSendingSettingId + '">Edit</a>';
                }
            }

            reportTableTrs += '<tr><td><div class="groupnamewrap">' +
                '<div class="nameTxtWrap">' + this.SmsCampaignName + '</div>' +
                '<div class="tddropmenuWrap">' +
                '<div class="dropdown">' +
                '<button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>' +
                '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="filterbycontacts">' +
                content +
                '<a data-grouptype="groupduplicate" class="dropdown-item ContributePermission" href="/Sms/ScheduleCampaign/?Action=Copy&Id=' + this.SmsSendingSettingId + '">Duplicate</a>' +
                '<div class="dropdown-divider"></div>' +
                '<a data-toggle="modal" data-target="#deletegroups" data-grouptype="groupDelete" class="dropdown-item FullControlPermission" href="javascript:void(0);" onclick="AssignDeleteValue(' + this.SmsSendingSettingId + ')">Delete</a>' +
                '</div></div></div></div>' + statusAndEditOption.label + '</td>' +
                '<td class="td-wid-10 wordbreak">' + this.CampaignDescription + '</td>' +
                '<td>' + groupName + '</td>' +
                '<td>' + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.UpdatedDate)) + '</td>' +
                '<td>' + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.ScheduledDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.ScheduledDate)) + '</td>' +
                '</tr>';

        });


        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        $(".creditalertblink").popover();
        ShowExportDiv(true);
    } else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
    CheckAccessPermission("Sms");
}


$(document).ready(function () {

    $("#txt_SearchBy").keydown(function (event) {
        if (event.keyCode == 13) {

            if (CleanText($.trim($("#txt_SearchBy").val())).length == 0) {
                ShowErrorMessage(GlobalErrorList.SmsSchedule.CampaignIdentifierError);
                return false;
            }

            var e_i = $("#txt_SearchBy").val();
            CampaignName = e_i.length > 0 ? e_i : null;
            CallBackFunction();

            event.preventDefault();
            return false;
        }
    });

});

var SmsSendingSettingId = 0;
function AssignDeleteValue(Id) {
    SmsSendingSettingId = Id;
}

$("#deleteRowConfirm").click(function () {
    $.ajax({
        url: "/Sms/ScheduleCampaign/DeleteCampaign",
        type: 'Post',
        data: JSON.stringify({ "accountId": Plumb5AccountId, "SmsSendingSettingId": SmsSendingSettingId }),
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

function GetStatus(ScheduledStatus, StoppedReason) {

    if (ScheduledStatus == 0) {
        return { label: '<p class="mb-0 text-color-success font-11">Completed</p>', IsEditable: false };
    } else if (ScheduledStatus == 2) {
        return { label: '<p class="mb-0 text-color-progress font-11">In-Progress</p>', IsEditable: false };
    } else if (ScheduledStatus == 1) {
        return { label: '<p class="mb-0 text-color-queued font-11">Yet to go</p>', IsEditable: true };
    } else {
        return { label: '<p class="mb-0 text-color-error font-11" title="Stoped :' + StoppedReason + ' ">Stopped <i class="icon ion-ios-information creditalertblink" data-toggle="popover" data-trigger="hover" data-content="' + StoppedReason + '"></i></p>', IsEditable: false };
    }
}

$("#ui_SearchbyCampaign").click(function () {
    if (CleanText($.trim($("#txt_SearchBy").val())).length == 0) {
        ShowErrorMessage(GlobalErrorList.SmsSchedule.CampaignIdentifierError);
        return false;
    }
    CampaignName = CleanText($.trim($("#txt_SearchBy").val()));
    CallBackFunction();
});

$("#txt_SearchBy").keyup(function () {
    const key = event.key;
    if (key === "Backspace") {
        if (CleanText($.trim($("#txt_SearchBy").val())).length == 0) {
            CampaignName = CleanText($.trim($("#txt_SearchBy").val()));
            CallBackFunction();
        }
        return false;
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

