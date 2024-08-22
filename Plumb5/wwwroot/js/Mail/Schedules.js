var CampaignName = null;

$(document).ready(function () {
    GetUTCDateTimeRangeForNext(1);
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
    CampaignName = CleanText($.trim($('#txt_SearchBy').val()));
    $.ajax({
        url: "/Mail/Schedules/GetMaxCount",
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
                SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReport() {
    CampaignName = CleanText($.trim($('#txt_SearchBy').val()));
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/Mail/Schedules/ShowSetSchedule",
        type: 'Post',
        data: JSON.stringify({ 'OffSet': OffSet, 'FetchNext': FetchNext, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'CampignName': CampaignName }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {

    SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
    if (response != undefined && response != null) {
        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs;
        var ChkIsMailSplitCount = 0; var preCampId = 0;
        $.each(response, function () {
            let statusAndEditOption = GetStatus(this.ScheduledStatus, this.ApprovalStatus, this.IsMailSplit, this.MailSendingSettingId, this.StoppedReason);

            let content = ""; precontent = "";
            if (statusAndEditOption.IsEditable) {
                if (ChkIsMailSplitCount == 2) {
                    precontent = '<a data-grouptype="groupedit" class="dropdown-item" href="/Mail/MailSchedule?MailSendingSettingId=' + preCampId + '">Edit (Variation A)</a>';
                    content = precontent + '<a data-grouptype="groupedit" class="dropdown-item" href="/Mail/MailSchedule?MailSendingSettingId=' + this.MailSendingSettingId + '">Edit (Variation B)</a>';
                } else {
                    content = precontent + '<a data-grouptype="groupedit" class="dropdown-item" href="/Mail/MailSchedule?MailSendingSettingId=' + this.MailSendingSettingId + '">Edit</a>';
                }
            }

            var duplicate = "";

            //var verticnwrpdropdown = '<button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>';
            if (this.IsMailSplit == false) {
                duplicate = '<a data-grouptype="groupduplicate" class="dropdown-item ContributePermission" href="/Mail/MailSchedule?MailSendingSettingId=' + this.MailSendingSettingId + '&IsDuplicate=1">Duplicate</a>';
            }
            //if (this.ScheduledStatus == 8) {
            //    verticnwrpdropdown="";
            //}
            //else {

            //    stopabtest = '<a id="stopabtestcamp"  class="dropdown-item ContributePermission" data-groupid="' + this.MailSendingSettingId + '" href="javascript:void(0)">Stop Campaign</a>';

            //}
            let groupName = this.GroupName != null ? this.GroupName : "NA";

            let UpdateDate = "NA";
            if (this.ScheduledCompletedDate != null) {
                UpdateDate = $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.ScheduledCompletedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.ScheduledCompletedDate));
            }


            reportTableTrs += '<tr><td><div class="groupnamewrap">' +
                '<div class="nameTxtWrap">' + this.MailCampaignName + '</div>' +
                '<div class="tddropmenuWrap">' +
                '<div class="dropdown">' +
                statusAndEditOption.verticnwrpdropdown +
                '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="filterbycontacts">' +
                content +
                duplicate +
                statusAndEditOption.stopabtest +

                '<div class="dropdown-divider"></div>' +
                statusAndEditOption.deletecamp +
                '</div></div></div></div><div class="abtestwrp d-flex align-items-center">' + statusAndEditOption.label + '</div></td>' +
                '<td class="td-wid-10 wordbreak">' + this.CampaignDescription + '</td>' +
                '<td>' + groupName + '</td>' +
                '<td>' + UpdateDate + '</td>' +
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
    CheckAccessPermission("Mail");
}

document.getElementById("txt_SearchBy").addEventListener("keyup", function (event) {
    const key = event.key;
    if (key === "Backspace") {
        if (CleanText($.trim($('#txt_SearchBy').val())).length == 0) {
            CampaignName = "";
            CallBackFunction();
        }
    }
    event.preventDefault();
    return false;

});

$(document).ready(function () {

    $("#txt_SearchBy").keydown(function (event) {
        if (event.keyCode == 13) {
            if (CleanText($.trim($('#txt_SearchBy').val())).length == 0) {
                ShowErrorMessage(GlobalErrorList.MailScheduleError.CampaignsName);
                return false;
            }

            CallBackFunction();
            event.preventDefault();
            return false;
        }
    });
});

var CampId = 0;
$(document).on('click', "#deletecamp", function () {
    CampId = parseInt($(this).attr("data-groupid"));
});

$("#deleteRowConfirm").click(function () {

    $.ajax({
        url: "/Mail/Schedules/Delete",
        type: 'POST',
        data: JSON.stringify({ 'Id': CampId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.MailScheduleError.DeleteScheduled);
                CallBackFunction();
            }
        },
        error: ShowAjaxError
    });
});
$(document).on('click', "#stopabtestcamp", function () {

    StopabtestCampId = parseInt($(this).attr("data-groupid"));
    $.ajax({
        url: "/Mail/Schedules/StopABTestingCamp",
        type: 'POST',
        data: JSON.stringify({ 'Id': StopabtestCampId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.MailScheduleError.StopABCamp);
                CallBackFunction();
            }
        },
        error: ShowAjaxError
    });
});
function GetStatus(ScheduledStatus, ApprovalStatus, IsMailSplit, MailSendingSettingId, StoppedReason) {
    if (IsMailSplit == false) {
        if (ScheduledStatus == 0) {
            return {
                label: '<p class="mb-0 text-color-success font-11">Completed</p>',
                verticnwrpdropdown: '<button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>',
                IsEditable: false,
                stopabtest: "",
                deletecamp: '<a id="deletecamp" data-toggle="modal" data-target="#deletegroups" data-grouptype="groupDelete" data-groupid="' + MailSendingSettingId + '" class="dropdown-item FullControlPermission" href="javascript:void(0)">Delete</a>'

            };
        } else if (ScheduledStatus == 2) {
            return {
                label: '<p class="mb-0 text-color-progress font-11">In-Progress</p>',
                verticnwrpdropdown: '<button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>',
                IsEditable: false, stopabtest: "",
                deletecamp: '<a id="deletecamp" data-toggle="modal" data-target="#deletegroups" data-grouptype="groupDelete" data-groupid="' + MailSendingSettingId + '" class="dropdown-item FullControlPermission" href="javascript:void(0)">Delete</a>'
            };
        } else if (ScheduledStatus == 1) {
            return {
                label: '<p class="mb-0 text-color-queued font-11">Yet to go</p>',
                verticnwrpdropdown: '<button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>',
                IsEditable: true, stopabtest: "",
                deletecamp: '<a id="deletecamp" data-toggle="modal" data-target="#deletegroups" data-grouptype="groupDelete" data-groupid="' + MailSendingSettingId + '" class="dropdown-item FullControlPermission" href="javascript:void(0)">Delete</a>'

            };
        } else {
            return {
                label: '<p class="mb-0 text-color-error font-11" title="Stoped :' + StoppedReason + ' ">Stopped <i class="icon ion-ios-information creditalertblink" data-toggle="popover" data-trigger="hover" data-content="' + StoppedReason + '"></i></p>',
                verticnwrpdropdown: '<button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>',
                IsEditable: false, stopabtest: "",
                deletecamp: '<a id="deletecamp" data-toggle="modal" data-target="#deletegroups" data-grouptype="groupDelete" data-groupid="' + MailSendingSettingId + '" class="dropdown-item FullControlPermission" href="javascript:void(0)">Delete</a>'
            };
        }
    }
    else {
        if (ScheduledStatus == 0) {
            return {
                label: '<i class=""><img src="/Content/images/ab-testing.png" alt="" srcset=""></i><p class="mb-0 text-color-success font-11">Completed</p>',
                verticnwrpdropdown: '<button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>',
                IsEditable: false,
                stopabtest: "",
                deletecamp: '<a id="deletecamp" data-toggle="modal" data-target="#deletegroups" data-grouptype="groupDelete" data-groupid="' + MailSendingSettingId + '" class="dropdown-item FullControlPermission" href="javascript:void(0)">Delete</a>'

            };
        } else if (ScheduledStatus == 2) {
            return {
                label: '<i class=""><img src="/Content/images/ab-testing.png" alt="" srcset=""></i><p class="mb-0 text-color-progress font-11">In-Progress</p>',
                verticnwrpdropdown: ""
                //IsEditable: false,
                //stopabtest: ""
                //,deletecamp: ""
            };

        } else if (ScheduledStatus == 1) {
            return {
                label: '<i class=""><img src="/Content/images/ab-testing.png" alt="" srcset=""></i><p class="mb-0 text-color-queued font-11">Yet to go</p>',
                verticnwrpdropdown: '<button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>',
                IsEditable: true,
                stopabtest: "",
                deletecamp: '<a id="deletecamp" data-toggle="modal" data-target="#deletegroups" data-grouptype="groupDelete" data-groupid="' + MailSendingSettingId + '" class="dropdown-item FullControlPermission" href="javascript:void(0)">Delete</a>'
            };

        } else if (ScheduledStatus == 7) {
            return {
                label: '<i class=""><img src="/Content/images/ab-testing.png" alt="" srcset=""></i><p class="mb-0 text-color-progress font-11">Test result - inprogress</p>',
                verticnwrpdropdown: '<button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>',
                IsEditable: true,
                stopabtest: '<a id="stopabtestcamp"  class="dropdown-item ContributePermission" data-groupid="' + MailSendingSettingId + '" href="javascript:void(0)">Stop winner version</a>'
                , deletecamp: ""
            };

        }
        else if (ScheduledStatus == 8) {
            return {
                label: '<i class=""><img src="/Content/images/ab-testing.png" alt="" srcset=""></i><p class="mb-0 text-color-progress font-11">Test result - inprogress</p>',
                verticnwrpdropdown: ""
                //IsEditable: false,
                //stopabtest: ""
            };

        }
        else if (ScheduledStatus == 9) {
            return {
                label: '<i class=""><img src="/Content/images/ab-testing.png" alt="" srcset=""></i><p class="mb-0 text-color-blue font-11">Test result- indecisive</p>',
                verticnwrpdropdown: '<button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>',
                IsEditable: false,
                stopabtest: "",
                deletecamp: '<a id="deletecamp" data-toggle="modal" data-target="#deletegroups" data-grouptype="groupDelete" data-groupid="' + MailSendingSettingId + '" class="dropdown-item FullControlPermission" href="javascript:void(0)">Delete</a>'

            };

        }
        else {
            return {
                label: '<i class=""><img src="/Content/images/ab-testing.png" alt="" srcset=""></i><p class="mb-0 text-color-error font-11">Stopped</p>',
                verticnwrpdropdown: '<button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>',
                IsEditable: false, stopabtest: "",
                deletecamp: '<a id="deletecamp" data-toggle="modal" data-target="#deletegroups" data-grouptype="groupDelete" data-groupid="' + MailSendingSettingId + '" class="dropdown-item FullControlPermission" href="javascript:void(0)">Delete</a>'
            };
        }
    }
}

$(".serchicon").click(function () {
    if (CleanText($.trim($('#txt_SearchBy').val())).length == 0) {
        ShowErrorMessage(GlobalErrorList.MailScheduleError.CampaignsName);
        return false;
    }
    CallBackFunction();
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
