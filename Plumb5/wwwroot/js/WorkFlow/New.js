
function CreateWorkFlow(FlowType) {
    workFlowType = FlowType;
    $("#ui_ddlNode").val("1");
    $(".bgShadedDiv").show();
    $("#ui_dvCustomPopUpNodeCount").show();
}

$('#ui_btnNext').on('click', function () {
    $("#ui_dvCustomPopUpNodeCount").hide();
    $("#ui_txtWorkFlowTitle").val('');
    $("#ui_dllWorkFlowCampaign").val('0');
    $("#ui_txtScheduleFromDate").val('');
    $("#ui_txtScheduleToDate").val('');
    $("#ui_dllScheduleFromTime").val('10');
    $("#ui_dllScheduleToTime").val('10');
    $('input[name=ui_rdbtnWorkTimer][value=1]').prop('checked', true);
    $("#ui_trOnceInAdayTime").show();
    $("#ui_trInterval").hide();
    $("#ui_txtInterval").val('');
    $("#ui_dllOnceInAdayTime").val('10');
    $(".bgShadedDiv").show();
    $("#ui_dvCustomPopUpWorkFlowBasic").show();
});

$('#ui_btnNextCancel').on('click', function () {
    $("#ui_ddlNode").val("1");
    $(".bgShadedDiv").hide();
    $(".CustomPopUp").hide("fast");
});
