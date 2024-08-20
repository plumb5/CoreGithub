var WorkflowName = null;

$(document).ready(function () {
    ExportFunctionName = "ExportWorkflow";
    CallBackFunction();
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
    WorkflowName = $("#txt_SearchBy").val();

    $.ajax({
        url: "/Journey/Workflows/GetMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkflowName': WorkflowName }),
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
                SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/Journey/Workflows/GetWorkflowData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'OffSet': OffSet, 'FetchNext': FetchNext, 'WorkflowName': WorkflowName }),
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

        $.each(response, function () {

            var status = this.Status == 1 ? "Running" : this.Status == 2 ? "Draft" : "Stopped";
            var statuscolor = this.Status == 1 ? "activ" : this.Status == 2 ? "" : "inactiv";

            //var date1 = new Date();// for current date
            //var date2 = new Date($.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.LastUpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.LastUpdatedDate)));
            //var days = Math.round((date1 - date2) / (1000 * 60 * 60 * 24));
            //var dayDiff = days == 0 ? "Today by " : days == 1 ? "Yesterday by " : days + " days ago by ";

            var statuschange = this.Status != 2 ? '<a class="dropdown-item ContributePermission" href="javascript:void(0)" onclick="ChangeStatus(' + this.WorkFlowId + ',' + this.Status + ')">Change Status</a>' : '';
            var viewreport = this.Status != 2 ? '<a class="dropdown-item" href="/Journey/Responses?WorkFlowId=' + this.WorkFlowId + '">View Report</a>' : '';

            var StatusTitle = "";
            if (this.StoppedReason != undefined && this.StoppedReason != null && this.StoppedReason.length > 0) {
                StatusTitle = this.StoppedReason;
            }


            reportTableTrs += '<tr><td><div class="groupnamewrap"><div class="nameTxtWrap">' + this.Title + '' +
                '</div><div class="tdcreatedraft"><div class="dropdown">' +
                '<button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>' +
                '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="filterbycontacts">' +
                '<a class="dropdown-item DesignPermission" href="/Journey/CreateWorkflow?WorkFlowId=' + this.WorkFlowId + '">Edit</a>' +
                '' + statuschange + '' +
                '' + viewreport + '' +
                '<a id="dvWorkflowDuplicate" class="dropdown-item ContributePermission" data-toggle="modal" data-target="#duplicateconfirmation" data-duplicate="' + this.WorkFlowId + '" data-grouptype="confirmduplicate" href="javascript:void(0)">Duplicate</a>' +
                '<div class="dropdown-divider"></div>' +
                '<a id="dvWorkflow" data-toggle="modal" data-target="#deletegroups" data-groupid="' + this.WorkFlowId + '" data-grouptype="groupDelete" class="dropdown-item FullControlPermission" href="javascript:void(0)">Delete</a>' +
                '</div></div></div></div></td><td title="' + StatusTitle + '" class="text-center ' + statuscolor + '">' + status + '</td><td class="text-center" id="spnEnter' + this.WorkFlowId + '">0</td>' +
                '<td>' + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.LastUpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.LastUpdatedDate)) + '</td></tr>';

            getEnteredCount(this.WorkFlowId, this.Status);
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

ChangeStatus = function (WorkFlowId, status) {

    var IsStop = status == 1 ? 0 : 1;

    $.ajax({
        url: "/Journey/Workflows/UpdateWorkflowStatus",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkflowId': WorkFlowId, 'IsStop': IsStop }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            ShowSuccessMessage(GlobalErrorList.WorkflowJourney.Success_StatusChange);
            CallBackFunction();
        },
        error: ShowAjaxError
    });
};

function getEnteredCount(wfid, workflowstatuss) {
    if (workflowstatuss != 2) {
        $.ajax({
            url: "/Journey/Workflows/GetConfigDetailByWorkFlowId",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'WorkflowId': wfid }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    if (response > 0)
                        $("#spnEnter" + wfid).html(response);
                }
            },

            error: ShowAjaxError
        });
    }



}

function CopyofWorkflow(workflowid) {
    setTimeout(function () { ShowPageLoading() }, 100);
    $.ajax({
        url: "/Journey/Workflows/CreateDuplicateWorkFlow",
        type: 'POST',
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'WorkflowId': workflowid }),
        success: function (response) {
            if (response.Result) {
                ShowSuccessMessage(response.ErrorMessage);
                CallBackFunction();
            } else {
                ShowErrorMessage(response.ErrorMessage);
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}

var WorkflowId = 0;
$(document).on('click', "#dvWorkflow", function () {
    WorkflowId = parseInt($(this).attr("data-groupid"));
});

$("#deleteRowConfirm").click(function () {

    $.ajax({
        url: "/Journey/Workflows/DeleteWorkflow",
        type: 'POST',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'WorkflowId': WorkflowId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                if (response)
                    ShowSuccessMessage(GlobalErrorList.WorkflowJourney.Success_Delete);
                else
                    ShowErrorMessage(GlobalErrorList.WorkflowJourney.Error_Delete);

                CallBackFunction();
            }
        },
        error: ShowAjaxError
    });
});

var WorkflowduplicateId = 0;
$(document).on('click', "#dvWorkflowDuplicate", function () {
    WorkflowduplicateId = parseInt($(this).attr("data-duplicate"));
});


$("#confirmduplicate").click(function () {
    CopyofWorkflow(WorkflowduplicateId);
});


$(document).ready(function () {
    $("#txt_SearchBy").keydown(function (event) {
        if (event.keyCode == 13) {
            if ($("#txt_SearchBy").val().length == 0) {
                return false;
            }

            CallBackFunction();
            event.preventDefault();
            return false;
        }
    });
});

$("#txt_SearchBy").keyup(function () {
    const key = event.key;
    if (key === "Backspace") {
        if (CleanText($.trim($("#txt_SearchBy").val())).length == 0) {
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


//Create workflow based on type
var dataForRedirect = "Scratch";
$("#ui_a_CreateWorkflowBtn").click(function () {
    $(".createwrkflwwrp ul li a").removeClass("active");
    $('.crtewrkflwmedbg').find('li').find('a').first().addClass("active");
    dataForRedirect = "Scratch";
});

$(".createwrkflwwrp ul li a").click(function () {
    $(".createwrkflwwrp ul li a").removeClass("active");
    $(this).addClass("active");
    dataForRedirect = $(this).attr("data-createworkflowtype");
});

$("#ui_btn_CreateWorkflowContinue").click(function () {
    if (dataForRedirect.toLowerCase() == 'scratch')
        window.location.href = "/Journey/CreateWorkflow/?Action=Create";
    else
        window.location.href = "/Journey/CreateWorkflow/?Action=Create&Type=" + dataForRedirect;
});
