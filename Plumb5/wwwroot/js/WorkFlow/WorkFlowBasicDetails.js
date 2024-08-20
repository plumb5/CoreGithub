
var WorkflowId = 0;
var WorkFlowBasicDetails = { Name: "" };
$(document).ready(function () {
    GetworkFlowMaxCount();
    $(".bgShadedDiv").show();
    $("#ui_dvCustomPopUpWorkFlowBasic").show();
});
GetworkFlowMaxCount = function () {
    var WorkFlowCampaign = { Id: 0, Name: "" };
    $.ajax({
        url: "/WorkFlow/Create/GetMaxCountOfWorkflow",
        type: 'POST',
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var Count = parseInt(response) + 1;
            $('#ui_txtWorkFlowTitle').val("WorkFlow" + Count);
        },
        error: ShowAjaxError
    });
};


$('input[type=radio][name=ui_rdbtnWorkTimer]').change(function () {
    if ($(this).val() == 1) {
        $("#ui_trInterval").hide();
        $("#ui_trOnceInAdayTime").show();
    }
    else if ($(this).val() == 2) {
        $("#ui_trOnceInAdayTime").hide();
        $("#ui_trInterval").show();
    }
});

$('#ui_btnProceedCancel').on('click', function () {
    $(".bgShadedDiv").hide();
    $(".CustomPopUp").hide("fast");
});

$('#ui_btnProceed').on('click', function () {
    $("#dvLoading").show();
    if (ValidateBasicDetails()) {
        WorkFlowBasicDetails.Title = CleanText($("#ui_txtWorkFlowTitle").val());
        if ($.trim($("#txtFromDate").val()).length > 0 && $.trim($("#txtToDate").val()).length > 0) {
            WorkFlowBasicDetails.FromDate = $("#txtFromDate").val();
            WorkFlowBasicDetails.ToDate = $("#txtToDate").val();
        }
        else {
            WorkFlowBasicDetails.FromDate = null;
            WorkFlowBasicDetails.ToDate = null;
        }
        if ($('input[name=workflowsendoption]:checked').val() == "0") {
            WorkFlowBasicDetails.IsInstantOrSchedule = parseInt($("#radinstant").val());
        }
        else if ($('input[name=workflowsendoption]:checked').val() == "1") {
            WorkFlowBasicDetails.IsInstantOrSchedule = parseInt($("#radsechedule").val());
        }

        if (WorkflowId != 0)
        { WorkFlowBasicDetails.WorkflowId = WorkflowId; }
        else { WorkFlowBasicDetails.WorkflowId = 0; }

        $.ajax({
            url: "/WorkFlow/New/StoreBasicDetails",
            type: 'POST',
            data: JSON.stringify({ 'WorkFlowBasicDetails': WorkFlowBasicDetails }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response == -1)
                { ShowErrorMessage("This Workflow title already exist!"); } else { WorkflowId = response; $(".bgShadedDiv").hide(); $(".CustomPopUp").hide("slow"); $("#dvLoading").hide(); }
            },
            error: ShowAjaxError
        });

    }
});

function ValidateBasicDetails() {
    if (CleanText($("#ui_txtWorkFlowTitle").val()).length == 0) {
        $('#ui_txtWorkFlowTitle').focus();
        ShowErrorMessage("Please enter workflow title");
        $("#dvLoading").hide();
        return false;
    }
    return true;
}



function EditBasicDetails() {
   // GetStoredBasicDetails();
    $(".bgShadedDiv").show();
    $("#ui_dvCustomPopUpWorkFlowBasic").show();
}
