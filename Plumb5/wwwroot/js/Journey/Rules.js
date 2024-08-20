var RuleName = null;
$(document).ready(function () {
    ExportFunctionName = "ExportRules";
    initLoad();
});

function initLoad() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    MaxCount();
}
function CallBackFunction() {
    CurrentRowCount = 0;
    GetReport();
}

function CallBackPaging() {
    CurrentRowCount = 0;
    GetReport();
}


function MaxCount() {
    RuleName = $("#txt_SearchBy").val();

    $.ajax({
        url: "/Journey/Rules/GetMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'RuleName': RuleName }),
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
        url: "/Journey/Rules/GetRulesData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'OffSet': OffSet, 'FetchNext': FetchNext, 'RuleName': RuleName }),
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

            var status = this.TriggerStatus == 1 ? "Active" : "In-Active";
            var statuscolor = this.TriggerStatus == 1 ? "activ" : "inactiv";

            reportTableTrs += ' <tr><td><div class="groupnamewrap">' +
                '<div class="nameTxtWrap">' +
                '<span>' + this.TriggerHeading + '</span>' +
                '</div>' +
                '<div class="tdcreatedraft">' +
                '<div class="dropdown">' +
                '<button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>' +
                '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="filterbycontacts" x-placement="top-end" style="position: absolute; transform: translate3d(3px, 1px, 0px); top: 0px; left: 0px; will-change: transform;">' +
                '<a class="dropdown-item ContributePermission" href="/Journey/CreateRule?Action=Edit&Id=' + this.RuleId + '">Edit</a>' +
                '<a class="dropdown-item ContributePermission" href="javascript:void(0)" onclick="ChangeStatus(' + this.RuleId + ',' + this.TriggerStatus + ')">Change Status</a>' +
                '<div class="dropdown-divider"></div>' +
                '<a id="dvRules" data-toggle="modal" data-target="#deletegroups" data-groupid="' + this.RuleId + '" data-grouptype="groupDelete" class="dropdown-item FullControlPermission" href="javascript:void(0)">Delete</a>' +
                '</div></div></div></div></td>' +
                '<td class="text-center ' + statuscolor + '">' + status + '</td>' +
                '<td>' + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.TriggerCreateDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.TriggerCreateDate)) + '</td>' +
                '</tr>';


        });


        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
    } else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
    CheckAccessPermission("Journey");
}

ChangeStatus = function (RuleId, status) {

    var IsStop = status == 1 ? false : true;

    $.ajax({
        url: "/Journey/Rules/UpdateRulesStatus",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'RuleId': RuleId, 'Status': IsStop }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response)
                ShowSuccessMessage(GlobalErrorList.Journey_Rules.Success_ChangeStatus);
            else
                ShowErrorMessge(GlobalErrorList.Journey_Rules.Error_ChangeStatus);
            initLoad();
        },
        error: ShowAjaxError
    });
};

var RulesId = 0;
$(document).on('click', "#dvRules", function () {
    RulesId = parseInt($(this).attr("data-groupid"));
});

$("#deleteRowConfirm").click(function () {
    $.ajax({
        url: "/Journey/Rules/DeleteRules",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'RuleId': RulesId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.Journey_Rules.Success_Delete);
                initLoad();
            }
            else
                ShowErrorMessge(GlobalErrorList.Journey_Rules.Error_Delete);

        },
        error: ShowAjaxError
    });
});


$(document).ready(function () {
    
    $("#txt_SearchBy").keydown(function (event) {
        if (event.keyCode == 13) {
            if ($("#txt_SearchBy").val().length == 0) {
                return false;
            }

            initLoad();
            event.preventDefault();
            return false;
        }
    });
});

$("#txt_SearchBy").keyup(function () {
    const key = event.key;
    if (key === "Backspace") {
        if (CleanText($.trim($("#txt_SearchBy").val())).length == 0) {
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
