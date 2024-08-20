var triggerDetails = { Id: 0, TriggerStatus: 0 };
var TriggerName = null;
$(document).ready(function () {
    ExportFunctionName = "ExportTriggerCampaign";
    initLoad();
});

function initLoad() {
    CampaignIdentifier = {};
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
        url: "/Sms/TriggerDashboard/GetMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'TriggerName': TriggerName }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response != undefined && response != null) {
                TotalRowCount = response.returnVal;
            }

            if (TotalRowCount > 0) {
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 3, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}
function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/Sms/TriggerDashboard/GetAllTrigger",
        type: 'Post',
        data: JSON.stringify({ 'OffSet': OffSet, 'FetchNext': FetchNext, 'TriggerName': TriggerName }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}
function BindReport(response) {

    SetNoRecordContent('ui_tblReportData', 3, 'ui_tbodyReportData');
    if (response != undefined && response != null) {
        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);


        var reportTableTrs;

        $.each(response, function () {

            var status = this.TriggerStatus == true ? "Active" : "Inactive";
            var statuscolor = this.TriggerStatus == true ? "activ" : "inactiv";

            var StatusTitle = "";
            if (this.StoppedReason != undefined && this.StoppedReason != null && this.StoppedReason.length > 0) {
                StatusTitle = this.StoppedReason;
            }

            reportTableTrs += '<tr><td><div class="groupnamewrap">' +
                '<div class="nameTxtWrap">' + this.TriggerHeading + '</div>' +
                '<div class="tddropmenuWrap">' +
                '<div class="dropdown">' +
                '<button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>' +
                '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="filterbycontacts">' +
                '<a data-grouptype="groupedit" class="dropdown-item ContributePermission" href="../Sms/CreateSmsTrigger?TriggerMailSmsId=' + this.Id + '">Edit</a>' +
                '<a data-grouptype="groupduplicate" class="dropdown-item ContributePermission" href="../Sms/CreateSmsTrigger?TriggerMailSmsId=' + this.Id + '&IsDuplicate=1">Duplicate</a>' +
                '<a data-grouptype="groupduplicate" class="dropdown-item ContributePermission" href="../Sms/CreateSmsTrigger?TriggerMailSmsId=' + this.Id + '&action=test">Test</a>' +
                '<a data-grouptype="groupduplicate" class="dropdown-item ContributePermission" onclick="ChangeStatus(' + this.Id + ',' + this.TriggerStatus + ');" href="javascript:void(0)">Change Status</a>' +
                '<div class="dropdown-divider"></div>' +
                '<a id="dvTrigger" data-toggle="modal" data-target="#deletegroups" data-groupid="' + this.Id + '"   data-grouptype="groupDelete" class="dropdown-item FullControlPermission" href="javascript:void(0)">Delete</a>' +
                '</div></div></div></div>' +
                '</td><td title="' + StatusTitle + '" class="td-wid-10 wordbreak ' + statuscolor + '">' + status + '</td><td>' + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.TriggerCreateDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.TriggerCreateDate)) + '</td> </tr>';

        });


        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
    } else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
    CheckAccessPermission("SMS");
}

ChangeStatus = function (TriggerId, ststus) {

    triggerDetails.Id = TriggerId;

    if (ststus == false)
        triggerDetails.TriggerStatus = 1;
    else
        triggerDetails.TriggerStatus = 0;

    $.ajax({
        url: "/Sms/TriggerDashboard/ToogleStatus",
        type: 'POST',
        data: JSON.stringify({ 'triggerDetails': triggerDetails }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.MailTrigger.UpdateStatus);
                initLoad();
            }
        },
        error: ShowAjaxError
    });
};



$(document).ready(function () {
    $("#txt_SearchBy").keydown(function (event) {
        if (event.keyCode == 13) {

            if (CleanText($.trim($("#txt_SearchBy").val())).length == 0) {
                ShowErrorMessage(GlobalErrorList.MailTrigger.SearchCampaignError);
                return false;
            }

            var e_i = $("#txt_SearchBy").val();
            TriggerName = e_i.length > 0 ? e_i : null;
            initLoad();

            event.preventDefault();
            return false;
        }
    });
});

var TriggerId = 0;
$(document).on('click', "#dvTrigger", function () {
    TriggerId = parseInt($(this).attr("data-groupid"));
});

$("#deleteRowConfirm").click(function () {

    $.ajax({
        url: "/Sms/TriggerDashboard/Delete",
        type: 'POST',
        data: JSON.stringify({ 'Id': TriggerId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.MailTrigger.DeleteTrigger);
                initLoad();
            }
        },
        error: ShowAjaxError
    });
});

$("#ui_TriggerSearch").click(function () {
    if (CleanText($.trim($("#txt_SearchBy").val())).length == 0) {
        ShowErrorMessage(GlobalErrorList.MailTrigger.SearchCampaignError);
        return false;
    }
    TriggerName = CleanText($.trim($("#txt_SearchBy").val()));
    initLoad();
});

$("#txt_SearchBy").keyup(function () {
    const key = event.key;
    if (key === "Backspace") {
        if (CleanText($.trim($("#txt_SearchBy").val())).length == 0) {
            TriggerName = CleanText($.trim($("#txt_SearchBy").val()));
            initLoad();
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
