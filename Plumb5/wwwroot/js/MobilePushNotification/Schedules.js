var mobileSchedule = {
    MaxCount: function () {
        let getName = $("#txt_SearchBy").val();
        $.ajax({
            url: "/MobilePushNotification/Schedules/GetScheduledMaxCount",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'Name': getName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = 0;
                if (response !== undefined && response !== null) {
                    TotalRowCount = response.returnVal;
                }

                if (TotalRowCount > 0) {
                    mobileSchedule.GetReport();
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
    },
    GetReport: function () {
        FetchNext = GetNumberOfRecordsPerPage();
        let getName = $("#txt_SearchBy").val();
        $.ajax({
            url: "/MobilePushNotification/Schedules/GetScheduledData",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext, 'Name': getName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: mobileSchedule.BindReport,
            error: ShowAjaxError
        });
    },
    BindReport: function (response) {
        SetNoRecordContent('ui_tableReport', 3, 'ui_tbodyReportData');
        if (response.mobilePushSendingSettings !== undefined && response.mobilePushSendingSettings !== null && response.mobilePushSendingSettings.length > 0) {
            CurrentRowCount = response.mobilePushSendingSettings.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            $("#ui_tbodyReportData").empty();
            ShowExportDiv(true);
            ShowPagingDiv(true);

            $.each(response.mobilePushSendingSettings, function () {
                let Status = this.ScheduledStatus === 0 ? `<p class="mb-0 text-color-success font-11">Completed</p>` : (this.ScheduledStatus === 4 ? `<p class="mb-0 text-color-error font-11">Stopped</p>` : `<p class="mb-0 text-color-error font-11">Pending</p>`);
                let Editable = this.ScheduledStatus === 1 ? `<a class="dropdown-item" href="/MobilePushNotification/CampaignSchedule?SettingsId=${this.Id}">Edit</a>` : ``;
                reportTableTrs = `
                                   <tr>
                                        <td>
                                            <div class="groupnamewrap">
                                                <div class="nameTxtWrap">
                                                    ${this.Name}
                                                </div>
                                                <div class="tddropmenuWrap">
                                                    <div class="dropdown">
                                                        <button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>
                                                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="filterbycontacts">
                                                            ${Editable}
                                                            <a class="dropdown-item ContributePermission" href="/MobilePushNotification/CampaignSchedule?Action=Copy&SettingsId=${this.Id}">Duplicate</a>                                                            
                                                            <div class="dropdown-divider"></div>
                                                            <a data-toggle="modal" data-target="#deletegroups" data-grouptype="groupDelete" class="dropdown-item FullControlPermission" href="javascript:void(0)" onclick='AssignDeleteValue(${this.Id})'>Delete</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            ${Status}
                                        </td>                                        
                                        <td>${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.UpdatedDate))}</td>
                                        <td>${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.ScheduledDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.ScheduledDate))} </td>
                                    </tr>
                                 `;
                $("#ui_tbodyReportData").append(reportTableTrs);
            });
        }
        else {
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
        CheckAccessPermission("MobilePushNotification");
    },
    DeleteScheduled: function (PushSendingSettingId) {
        ShowPageLoading();
        $.ajax({
            url: "/MobilePushNotification/Schedules/DeleteScheduled",
            type: 'Post',
            data: JSON.stringify({ "AccountId": Plumb5AccountId, "Id": PushSendingSettingId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.MobilePushSchedule.ScheduleDeleteSuccess);
                    CallBackFunction();
                } else {
                    ShowErrorMessage(GlobalErrorList.MobilePushSchedule.ScheduleDeleteError);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
};

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    mobileSchedule.MaxCount();
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    mobileSchedule.GetReport();
}

var PushSendingSettingId = 0;
function AssignDeleteValue(Id) {
    PushSendingSettingId = Id;
}

$("#deleteRowConfirmpush").click(function () {
    mobileSchedule.DeleteScheduled(PushSendingSettingId);
});


$(document).ready(function () {
    GetUTCDateTimeRangeForNext(1);
    ExportFunctionName = "ExportScheduleCampaign";
});


$(".serchicon").click(function () {
    if (CleanText($.trim($('#txt_SearchBy').val())).length == 0) {
        ShowErrorMessage(GlobalErrorList.MobilePushSchedule.CampaignsName);
        return false;
    }
    CallBackFunction();
});

$("#txt_SearchBy").keydown(function (event) {
    if (event.keyCode == 13) {
        if (CleanText($.trim($('#txt_SearchBy').val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.MobilePushSchedule.CampaignsName);
            return false;
        }

        CallBackFunction();
        event.preventDefault();
        return false;
    }
});

document.getElementById("txt_SearchBy").addEventListener("keyup", function (event) {
    const key = event.key;
    if (key === "Backspace") {
        if (CleanText($.trim($('#txt_SearchBy').val())).length == 0) {
            CallBackFunction();
        }
    }
    event.preventDefault();
    return false;

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
