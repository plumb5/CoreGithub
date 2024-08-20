var WorkflowId = 0;
var WorkFlowBasicDetails = { Name: "" };
var workflowstatus, publishstatus = 0;
var result;
var clickarray = [];
var addchk = 0; numberOfElements = 0;
var flowChartdata = {}; var dataconnections = [];
var connectorPaintStyle, connectorHoverStyle, endpointHoverStyle;
var KeyAndValuesOfMenu = {};
var ClickedNodeId = "";
var NodeText = "";
var WorkFlow = { Id: 0, Name: null, CampaignId: 0, IsActive: null, OneceInaDay: null, Interval: 0, FlowContent: null }
var Id = 0;
var selectedsegmentids = [];
var ArrayConfig = [];
var channel = {};
var ConfigValue = 0;
var MailSendingSetting = { MessageType: 0, MailTemplateId: 0, Subject: null, FromName: null, FromEmailId: null, ReplyToEmailId: null, Unsubscribe: false, Forward: false }
var chkGroup = 0, chkGoal = 0;
var TotalgroupContacts = 0;
var selectedcount = 0;
var defaultchannels = ["state_mail_", "state_sms_", "state_form_", "state_chat_", "state_webpush_", "state_inappbanner_", "state_apppush_", "state_fbpush_", "state_ussd_", "state_obd_", "state_broadcast_", "state_alert_", "state_goal_", "state_webhook_", "state_whatsapp_"];
var chkchannel = 0;
var allchannel = [];
var allprechannel = [];
var channelName = "", Segment = "0", Rule = "0", Goal = "0", DateTime = "0", Alert = "0";
var PreNode = "0", Condition = "0", DateCondition = 0, DateValue = "0";
var cnt = 0;
var DropdownPreBind = [];
var maxRowCount = 0;
var rowIndex = 0;
var viewMoreDisable = false;
var GroupmaxRowCount = 0, GrouprowIndex = 0; GroupIds = [];
var GroupviewMoreDisable = false;
var Group = { Id: 0, Name: "" };
var GroupDetails = [];
var TargetConnections = [];
var RssExist = 0;
var ContactList = [];
var TimeZoneData = ["Asia/Kolkata", -330];
var PreTitle = "";
var final_data, final_flowChartJson, final_ArrayConfig;
var MailTemplateCounselorTags = false;
var SmsTemplateCounselorTags = false;
var WebPushTemplateCounselorTags = false;
var AppPushTemplateCounselorTags = false;
var WhatsappTemplateCounselorTags = false;
var ContactPropertyList = [];
var AllSmsTemplateList = [];
var IsSmsSettingIsDone = false;
var IsMailSettingIsDone = false;
var AllMailTemplateList = [];
var AllContactFieldsColumns = [];
var recurringwhatsappstatus = 0;
var recurringmailstatus = 0;
var recurringsmsstatus = 0;
var recurringwebpushstatus = 0;
var recurringmobileappstatus = 0;

var smsdefconfid = 0, maildefconfid = 0, wadefconfid = 0;


var today = new Date();
var strdate = today.getFullYear().toString() + today.getMonth().toString() + today.getDate().toString() + today.getHours().toString() + today.getMinutes().toString() + today.getSeconds().toString() + today.getMilliseconds().toString();

var DefaultWorkflowTemplateJson = {
    triggermail: '{"nodes":[{"blockId":"state_segment_' + strdate + '","positionX":451,"positionY":107,"label":"Audience"},{"blockId":"state_mail_' + strdate + '1","positionX":461,"positionY":239,"label":"Send Mail"}],"connections":[{"connectionId":"con_31","SourceId":"state_segment_' + strdate + '","TargetId":"state_mail_' + strdate + '1","anchor":"Bottom3","RelationWithParent":"Satisfy"}],"numberOfElements":2}',
    dripmail: '{"nodes":[{"blockId":"state_segment_' + strdate + '","positionX":458,"positionY":63,"label":"Audience"},{"blockId":"state_mail_' + strdate + '1","positionX":455,"positionY":187,"label":"Send Mail"},{"blockId":"state_mail_' + strdate + '2","positionX":306,"positionY":327,"label":"Send Mail"},{"blockId":"state_mail_' + strdate + '3","positionX":592,"positionY":328,"label":"Send Mail"}],"connections":[{"connectionId":"con_31","SourceId":"state_segment_' + strdate + '","TargetId":"state_mail_' + strdate + 1 + '","anchor":"Bottom3","RelationWithParent":"Satisfy"},{"connectionId":"con_75","SourceId":"state_mail_' + strdate + '1","TargetId":"state_mail_' + strdate + '2","anchor":"Bottom2","RelationWithParent":"Open"},{"connectionId":"con_106","SourceId":"state_mail_' + strdate + '1","TargetId":"state_mail_' + strdate + '3","anchor":"Bottom4","RelationWithParent":"Click"}],"numberOfElements":5}',
    triggersms: '{"nodes":[{"blockId":"state_segment_' + strdate + '","positionX":445,"positionY":97,"label":"Audience"},{"blockId":"state_sms_' + strdate + '1","positionX":447,"positionY":223,"label":"Send Sms"}],"connections":[{"connectionId":"con_33","SourceId":"state_segment_' + strdate + '","TargetId":"state_sms_' + strdate + '1","anchor":"Bottom3","RelationWithParent":"Satisfy"}],"numberOfElements":2}',
    dripsms: '{"nodes":[{"blockId":"state_segment_' + strdate + '","positionX":461,"positionY":76,"label":"Audience"},{"blockId":"state_sms_' + strdate + '1","positionX":468,"positionY":186,"label":"Send Sms"},{"blockId":"state_sms_' + strdate + '2","positionX":327,"positionY":338,"label":"Send Sms"},{"blockId":"state_sms_' + strdate + '3","positionX":589,"positionY":335,"label":"Send Sms"}],"connections":[{"connectionId":"con_33","SourceId":"state_segment_' + strdate + '","TargetId":"state_sms_' + strdate + '1","anchor":"Bottom3","RelationWithParent":"Satisfy"},{"connectionId":"con_74","SourceId":"state_sms_' + strdate + '1","TargetId":"state_sms_' + strdate + '2","anchor":"Bottom2","RelationWithParent":"Deliver"},{"connectionId":"con_79","SourceId":"state_sms_' + strdate + '1","TargetId":"state_sms_' + strdate + '3","anchor":"Bottom3","RelationWithParent":"Click"}],"numberOfElements":4}',
    triggerwebpush: '{"nodes":[{"blockId":"state_segment_' + strdate + '","positionX":458,"positionY":82,"label":"Audience"},{"blockId":"state_webpush_' + strdate + '1","positionX":458,"positionY":210,"label":"Web Push"}],"connections":[{"connectionId":"con_36","SourceId":"state_segment_' + strdate + '","TargetId":"state_webpush_' + strdate + '1","anchor":"Bottom3","RelationWithParent":"Satisfy"}],"numberOfElements":2}',
    dripwebpush: '{"nodes":[{"blockId":"state_segment_' + strdate + '","positionX":470,"positionY":35,"label":"Audience"},{"blockId":"state_webpush_' + strdate + '1","positionX":465,"positionY":159,"label":"Web Push"},{"blockId":"state_webpush_' + strdate + '2","positionX":296,"positionY":310,"label":"Web Push"},{"blockId":"state_webpush_' + strdate + '3","positionX":585,"positionY":307,"label":"Web Push"}],"connections":[{"connectionId":"con_31","SourceId":"state_segment_' + strdate + '","TargetId":"state_webpush_' + strdate + '1","anchor":"Bottom3","RelationWithParent":"Satisfy"},{"connectionId":"con_78","SourceId":"state_webpush_' + strdate + '1","TargetId":"state_webpush_' + strdate + '2","anchor":"Bottom2","RelationWithParent":"View"},{"connectionId":"con_83","SourceId":"state_webpush_' + strdate + '1","TargetId":"state_webpush_' + strdate + '3","anchor":"Bottom3","RelationWithParent":"Click"}],"numberOfElements":4}',
    triggermobilepush: '{"nodes":[{"blockId":"state_segment_' + strdate + '","positionX":472,"positionY":97,"label":"Audience"},{"blockId":"state_apppush_' + strdate + '1","positionX":474,"positionY":237,"label":"App Push"}],"connections":[{"connectionId":"con_31","SourceId":"state_segment_' + strdate + '","TargetId":"state_apppush_' + strdate + '1","anchor":"Bottom3","RelationWithParent":"Satisfy"}],"numberOfElements":2}',
    dripmobilepush: '{"nodes":[{"blockId":"state_segment_' + strdate + '","positionX":445,"positionY":31,"label":"Audience"},{"blockId":"state_apppush_' + strdate + '1","positionX":430,"positionY":156,"label":"App Push"},{"blockId":"state_apppush_' + strdate + '2","positionX":280,"positionY":308,"label":"App Push"},{"blockId":"state_apppush_' + strdate + '3","positionX":564,"positionY":302,"label":"App Push"}],"connections":[{"connectionId":"con_36","SourceId":"state_segment_' + strdate + '","TargetId":"state_apppush_' + strdate + '1","anchor":"Bottom3","RelationWithParent":"Satisfy"},{"connectionId":"con_83","SourceId":"state_apppush_' + strdate + '1","TargetId":"state_apppush_' + strdate + '2","anchor":"Bottom2","RelationWithParent":"View"},{"connectionId":"con_88","SourceId":"state_apppush_' + strdate + '1","TargetId":"state_apppush_' + strdate + '3","anchor":"Bottom3","RelationWithParent":"Click"}],"numberOfElements":4}',
    triggermailsms: '{"nodes":[{"blockId":"state_segment_' + strdate + '","positionX":456,"positionY":91,"label":"Audience"},{"blockId":"state_mail_' + strdate + '1","positionX":283,"positionY":238,"label":"Send Mail"},{"blockId":"state_sms_' + strdate + '2","positionX":677,"positionY":232,"label":"Send Sms"}],"connections":[{"connectionId":"con_49","SourceId":"state_segment_' + strdate + '","TargetId":"state_mail_' + strdate + '1","anchor":"Bottom3","RelationWithParent":"Satisfy"},{"connectionId":"con_54","SourceId":"state_segment_' + strdate + '","TargetId":"state_sms_' + strdate + '2","anchor":"Bottom3","RelationWithParent":"Satisfy"}],"numberOfElements":3}'
};

$(document).ready(function () {
    if ($.urlParam("WorkflowId") > 0) {
        WorkFlowBasicUtil.WorkFlowInfo();
    }
    else { WorkFlowBasicUtil.WorkFlowMaxCount(); }
    LoadDefaultWorkFlow();
    setTimeout(initData, 1000);
});

//Bind all pop-up configuration data
function initData() {
    BindWorkFlowGroup('', true, 1);
    mailDetails.BindMailTemplates();
    mailDetails.BindActiveEmailIds();
    smsDetails.BindSmsTemplate();
    WebPushDetails.GetWebPushCampaigns();
    AppPushDetails.GetPushCampaigns();
    webHookDetails.BindContactFields();
    webHookDetails.GetPropertiesCustomFields();
    RuleDetails.BindRules();
    mailDetails.IsMailSettingsChecked();
    smsDetails.IsSmsSettingsChecked();
    WhatsappDetails.GetWhatsappTemplateList();
}

//get workflow info save workflow title and validate
var WorkFlowBasicUtil = {
    WorkFlowInfo: function () {
        WorkflowId = parseInt($.urlParam("WorkflowId"));
        $.ajax({
            url: "/Journey/CreateWorkflow/GetWorkflowByWorkflowId",
            type: 'POST',
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkflowId': $.urlParam("WorkFlowId") }),
            success: function (response) {


                $('.pagetitle').html("Update Workflow");

                PreTitle = response.Title.charAt(0).toUpperCase() + response.Title.slice(1);
                $('#ui_txtWorkFlowTitle').val(PreTitle);
                workflowstatus = response.Status;

                var getArrayConfig = response.ArrayConfig != null ? response.ArrayConfig : "[]";
                ArrayConfig = $.parseJSON(getArrayConfig);

                WorkFlowBasicDetails.Flowchart = response.Flowchart;

                //remove update button once workflow is runing
                if (response.Status == 1) {
                    $("#btndateandtime").css("display", "none");
                    $("#btnSaveapppush").css("display", "none");
                    $("#btnsavemaildetails").css("display", "none");
                    $("#btnSaveSms").css("display", "none");
                    $("#btnSavewebpush").css("display", "none");
                    $("#btnsavewebhookdetails").css("display", "none");
                }

                //hide save and draft buttons once workflow published
                if (response.WorkFlowDataId > 0) {
                    publishstatus = 1;
                    $("#btnSavedraft").css("display", "none");
                    $("#btnSave").css("display", "none");
                }
                else {
                    $("#btnSavedraft").css("display", "block");
                    $("#btnSave").css("display", "block");
                }

            },
            error: ShowAjaxError
        });
    },
    WorkFlowMaxCount: function () {
        var WorkFlowCampaign = { Id: 0, Name: "" };
        $.ajax({
            url: "/Journey/CreateWorkflow/GetMaxCountOfWorkflow",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var Count = parseInt(response) + 1;
                if (WorkflowId == 0) {
                    PreTitle = "WorkFlow" + Count;
                    $('#ui_txtWorkFlowTitle').val("WorkFlow" + Count);
                    $('#ui_txtWorkFlowTitle').append("WorkFlow" + Count);
                }
            },
            error: ShowAjaxError
        });
    },
    ValidateTitle: function () {
        if (CleanText($("#ui_txtWorkFlowTitle").val()).length == 0) {
            $('#ui_txtWorkFlowTitle').focus();
            ShowErrorMessage(GlobalErrorList.WorkFLow.Title);
            return false;
        }
        return true;
    },
    SaveWorkFlowTitle: function () {

        $.ajax({
            url: "/Journey/CreateWorkflow/StoreBasicDetails",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkFlowBasicDetails': WorkFlowBasicDetails }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response == -1) {
                    $("#editicn").removeClass("fa fa-pencil").addClass("fa fa-check");
                    $(".addidentitxtbx").removeAttr("disabled").focus();
                    ShowErrorMessage(GlobalErrorList.WorkFLow.TitleExist);
                }
                else if (response == 0) {
                    ShowSuccessMessage(GlobalErrorList.WorkFLow.TitleSave);
                    //WorkflowId = response;
                    // workflowUtil.WorkflowDraft();
                    PreTitle = $('#ui_txtWorkFlowTitle').val();
                    $(".bgShadedDiv").hide(); $(".CustomPopUp").hide("slow");
                }
                else {
                    ShowSuccessMessage(GlobalErrorList.WorkFLow.TitleSave);
                    WorkflowId = response;
                    // workflowUtil.WorkflowDraft();
                    PreTitle = $('#ui_txtWorkFlowTitle').val();
                    $(".bgShadedDiv").hide(); $(".CustomPopUp").hide("slow");
                }

                window.history.pushState('', '', UpdateQueryString("WorkFlowId", WorkflowId));
            },
            error: ShowAjaxError
        });
    }
}

//Publish and draft workflow 
var workflowUtil = {

    GetAnchorList: function (NodeType) {

        var NodesAndItsAnchors = {
            "sms": ["Send", "Deliver", "Click", "Not Click", "Bounce"],
            "mail": ["Deliver", "Open", "Not Open", "Click", "Not Click", "Bounce"],
            "webpush": ["Push", "View", "Click", "Not Click", "Dismiss", "Bounce"],
            "apppush": ["Push", "View", "Click", "Not Click", "Dismiss", "Bounce"],
            "rule": ["Satisfy", "Not Satisfy"],
            "dateandtime": ["Satisfy"],
            "segment": ["Satisfy"],
            "webhook": [],
            "whatsapp": ["Delivered", "Read", "Not Read", "Clicked", "Not Clicked", "Failed"]
        }
        return NodesAndItsAnchors[NodeType]
    },
    GetClassNameByNodeType: function (NodeType) {

        var NodesAndItsClass = {
            "sms": "actions_icons",
            "mail": "actions_icons",
            "webpush": "actions_icons",
            "apppush": "actions_icons",
            "rule": "flow_control_icons",
            "dateandtime": "flow_control_icons",
            "segment": "flow_control_icons",
            "webhook": "actions_icons",
            "whatsapp": "actions_icons"
        }
        return NodesAndItsClass[NodeType]
    },
    GetUniqueIdForNode: function (state, Id) {
        return state + "_" + Id + "_" + (Math.floor(new Date().valueOf() * Math.random()));
    },
    MyFirstNode: function () {

        for (var i = 0; i < flowChartdata.nodes.length; i++) {
            if (!JSLINQ(flowChartdata.connections).Any(function () { return (this.TargetId == flowChartdata.nodes[i].blockId) })) {
                window.console.log(flowChartdata.nodes[i]);
                return flowChartdata.nodes[i].blockId;
            }
        }
    },
    //open pop-up click on node title ---p5
    ShowConfigurationSettingByNode: function (obj) {

        var nodeType = obj.attr("nodetype");
        NodeText = nodeType.toLowerCase().replace(/ /g, '');
        ClickedNodeId = obj.attr('id');
        $("#dvcustompopup" + NodeText).removeClass('hideDiv');


        var result = "";
        if (ArrayConfig != null) {
            result = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Value)
        }
        else {
            result == ""
        }

        if (result != '') {
            $("#btnsavemaildetails").attr('value', 'Update');
            $("#btnSaveSms").attr('value', 'Update');
            $("#btnSaveRule").attr('value', 'Update');
            $("#btnSavewebpush").attr('value', 'Update');
            $("#btnSaveapppush").attr('value', 'Update');
            $("#btnSavewhatsapp").attr('value', 'Update');

            if (publishstatus != 1) {
                $("#btngroupdetails").attr('value', 'Update');
                $("#btnsavecontatcs").attr('value', 'Update');
            } else {
                $("#btngroupdetails").css("display", "none");
                $("#btnsavecontatcs").css("display", "none");
                $("#btnallusers").css("display", "none");
            }

            $("#btndateandtime").attr('value', 'Update');

            if ($.urlParam("WorkflowId") > 0) {
                if (NodeText == 'dateandtime') {
                    var datetime = result.toString().split("~");
                    $.ajax({
                        url: "/Journey/CreateWorkflow/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ConfigureId': WorkflowId, 'NodeText': ClickedNodeId }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            var condloop = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Datecondition);
                            var CheckIsDynamicGroup = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.IsDynamicGroup);
                            if (CheckIsDynamicGroup == '1') {
                                $('#wrkflwDynaGrp').prop('checked', true);
                            }
                            else {
                                $('#wrkflwstatGrp').prop('checked', true);
                            }
                            if (condloop > 0 && condloop < 8) {
                                $('#radproceed').prop('checked', true);
                                $(".wrkflwwaitforwrp").addClass("hideDiv");
                                $(".wrkflwwaitforslot").addClass("hideDiv");
                                $(".wrkflwproceedstepwrp").removeClass("hideDiv");

                                var myDate1 = ConvertUTCDateTimeToLocal(datetime[0]);
                                var myDate2 = ConvertUTCDateTimeToLocal(datetime[1]);

                                $("#txtdateandtime1").val(workflowUtil.makeDoubleDigit((myDate1.getMonth() + 1)) + "/" + workflowUtil.makeDoubleDigit(myDate1.getDate()) + "/" + myDate1.getFullYear());
                                $("#txtdateandtime2").val(workflowUtil.makeDoubleDigit((myDate2.getMonth() + 1)) + "/" + workflowUtil.makeDoubleDigit(myDate2.getDate()) + "/" + myDate2.getFullYear());

                                $("#ui_dllworkflowTime1").val(workflowUtil.makeDoubleDigit(myDate1.getHours()));
                                $("#ui_dllworkflowMinute1").val(workflowUtil.makeDoubleDigit(myDate1.getMinutes()));

                                $("#ui_dllworkflowTime2").val(workflowUtil.makeDoubleDigit(myDate2.getHours()));
                                $("#ui_dllworkflowMinute2").val(workflowUtil.makeDoubleDigit(myDate2.getMinutes()));

                            }
                            if (condloop == 8) {
                                $('#radwaitforslot').prop('checked', true);
                                $(".wrkflwwaitforwrp").addClass("hideDiv");
                                $(".wrkflwproceedstepwrp").addClass("hideDiv");
                                $(".wrkflwwaitforslot").removeClass("hideDiv");

                                var day = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.DaysOfWeek).toString();
                                $("#ui_dllDay").val(day);

                                var myDate1 = datetime[0].split(':');
                                var myDate2 = datetime[1].split(':');

                                $("#ui_dll_Time1").val(myDate1[0]);
                                $("#ui_dll_Minute1").val(myDate1[1]);

                                $("#ui_dll_Time2").val(myDate2[0]);
                                $("#ui_dll_Minute2").val(myDate2[1]);

                            } else {
                                $('#radwaitfor').prop('checked', true);
                                $(".wrkflwproceedstepwrp").addClass("hideDiv");
                                $(".wrkflwwaitforslot").addClass("hideDiv");
                                $(".wrkflwwaitforwrp").removeClass("hideDiv");

                                if (datetime[0].length > 0) {
                                    var getdate = datetime[0].split(" ");
                                    $("#txttime").val(getdate[0]);
                                }

                                if ((response.length > 0) && response[0].TimeType.indexOf("Hours") > -1) { $("#ui_dlltimetype").val(1); }
                                if (datetime[0].indexOf("Day") > -1) { $("#ui_dlltimetype").val(2); }
                                if (datetime[0].indexOf("Hours") > -1) { $("#ui_dlltimetype").val(1); }
                                if (datetime[0].indexOf("Min") > -1) { $("#ui_dlltimetype").val(0); }
                            }
                        },
                        error: ShowAjaxError
                    });

                }
                if (NodeText == 'segment') {
                    if (ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Title).toString().indexOf("group") > -1 || ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Title).toString().indexOf("group") > -1) {
                        GroupIds = Array.from(result.toString().split(","), Number);
                        WfGroupids = GroupIds;

                        for (var k = 0; k < GroupIds.length; k++)
                            $('#chkGroup_' + GroupIds[k]).attr('checked', true);
                    }

                }
                if (NodeText == 'sms') {
                    $.ajax({
                        url: "/Journey/CreateWorkflow/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            if (response.IsPromotionalOrTransactionalType == true) { $('#radsmstranmsg').prop('checked', true); }
                            else if (response.IsPromotionalOrTransactionalType == false) { $('#radsmspromomsg').prop('checked', true); }
                            if (response.IsTriggerEveryActivity != 0) {
                                $('#Recurringsms').removeClass('hideDiv');
                                $('#ui_ChkRecuringsms').prop('checked', true);
                                if (response.IsTriggerEveryActivity == 1) { $('#lblTriggerDaysms').prop('checked', true); }
                                else if (response.IsTriggerEveryActivity == 2) { $('#lblTriggerHoursms').prop('checked', true); }
                            }
                            else {

                                $('#Recurringsms').addClass('hideDiv');
                                $('#ui_ChkRecuringsms').prop('checked', false);
                                if (response.IsTriggerEveryActivity == 1) { $('#lblTriggerDaysms').prop('checked', false); }
                                else if (response.IsTriggerEveryActivity == 2) { $('#lblTriggerHoursms').prop('checked', false); }

                            }
                            smsDetails.BindSMSTemplateByType();
                            $("#ddlsmstempId").val(response.SmsTemplateId).trigger('change');
                            $("#ui_ddl_SmsConfigName").select2().val(response.SmsConfigurationNameId).change();
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'mail') {
                    $.ajax({
                        url: "/Journey/CreateWorkflow/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlmailtempId").val(response.MailTemplateId).trigger('change');
                            $("#txtmailsubject").val(response.MailSubject);
                            $("#txtmailfromname").val(response.FromName);
                            $("#ddlfromemailId").val(response.FromEmailId);
                            $("#txtReplyemailid").val(response.ReplyToEmailId);
                            $("#ui_MailConfigurationName").select2().val(response.MailConfigurationNameId).change();
                            if (response.IsPromotionalOrTransactionalType == true) { $('#radmailtranmsg').prop('checked', true); }
                            else if (response.IsPromotionalOrTransactionalType == false) { $('#radmailpromomsg').prop('checked', true); }
                            if (response.IsTriggerEveryActivity != 0) {
                                $('#Recurringmail').removeClass('hideDiv');
                                $('#ui_ChkRecuringmail').prop('checked', true);
                                if (response.IsTriggerEveryActivity == 1) { $('#lblTriggerDaymail').prop('checked', true); }
                                else if (response.IsTriggerEveryActivity == 2) { $('#lblTriggerHourmail').prop('checked', true); }
                            }
                            else {

                                $('#Recurringmail').addClass('hideDiv');
                                $('#ui_ChkRecuringmail').prop('checked', false);
                                if (response.IsTriggerEveryActivity == 1) { $('#lblTriggerDaymail').prop('checked', false); }
                                else if (response.IsTriggerEveryActivity == 2) { $('#lblTriggerHourmail').prop('checked', false); }

                            }
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'rule') {
                    $("#ddlruleId").val(result).trigger('change');
                    $.ajax({
                        url: "/Journey/CreateWorkflow/GetruleforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'workflowId': WorkflowId }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            if (response.length > 0) { $("#btnSaveRule").hide(); }
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'apppush') {
                    $.ajax({
                        url: "/Journey/CreateWorkflow/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlapppush").val(response.MobilePushTemplateId).trigger('change');
                            if (response.IsTriggerEveryActivity != 0) {
                                $('#Recurringapppush').removeClass('hideDiv');
                                $('#ui_ChkRecuringmobileapp').prop('checked', true);
                                if (response.IsTriggerEveryActivity == 1) { $('#lblTriggerDaymobileapp').prop('checked', true); }
                                else if (response.IsTriggerEveryActivity == 2) { $('#lblTriggerHourmobileapp').prop('checked', true); }
                            }
                            else {

                                $('#Recurringapppush').addClass('hideDiv');
                                $('#ui_ChkRecuringmobileapp').prop('checked', false);
                                if (response.IsTriggerEveryActivity == 1) { $('#lblTriggerDaymobileapp').prop('checked', false); }
                                else if (response.IsTriggerEveryActivity == 2) { $('#lblTriggerHourmobileapp').prop('checked', false); }

                            }
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'webpush') {
                    $.ajax({
                        url: "/Journey/CreateWorkflow/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlwebpush").val(response.WebPushTemplateId).trigger('change');
                            if (response.IsTriggerEveryActivity != 0) {
                                $('#Recurringwebpush').removeClass('hideDiv');
                                $('#ui_ChkRecuringwebpush').prop('checked', true);
                                if (response.IsTriggerEveryActivity == 1) { $('#lblTriggerDaywebpush').prop('checked', true); }
                                else if (response.IsTriggerEveryActivity == 2) { $('#lblTriggerHourwebpush').prop('checked', true); }
                            }
                            else {

                                $('#Recurringwebpush').addClass('hideDiv');
                                $('#ui_ChkRecuringwebpush').prop('checked', false);
                                if (response.IsTriggerEveryActivity == 1) { $('#lblTriggerDaywebpush').prop('checked', false); }
                                else if (response.IsTriggerEveryActivity == 2) { $('#lblTriggerHourwebpush').prop('checked', false); }

                            }
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'whatsapp') {
                    $.ajax({
                        url: "/Journey/CreateWorkflow/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlwhatsapp").val(response.WhatsAppTemplateId).trigger('change');
                            $("#ui_WAConfigurationName").select2().val(response.WhatsAppConfigurationNameId).change();
                            if (response.IsTriggerEveryActivity != 0) {
                                $('#Recurringwhatsapp').removeClass('hideDiv');
                                $('#ui_ChkRecuringwhatsapp').prop('checked', true);
                                if (response.IsTriggerEveryActivity == 1) { $('#lblTriggerDaywhatsapp').prop('checked', true); }
                                else if (response.IsTriggerEveryActivity == 2) { $('#lblTriggerHourwhatsapp').prop('checked', true); }
                            }
                            else {

                                $('#Recurringwhatsapp').addClass('hideDiv');
                                $('#ui_ChkRecuringwhatsapp').prop('checked', false);
                                if (response.IsTriggerEveryActivity == 1) { $('#lblTriggerDaywhatsapp').prop('checked', false); }
                                else if (response.IsTriggerEveryActivity == 2) { $('#lblTriggerHourwhatsapp').prop('checked', false); }

                            }
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'webhook') {

                    //alert("webhook");

                    $.ajax({
                        url: "/Journey/CreateWorkflow/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            if (response != null) {
                                workflowUtil.webhookClearFields();

                                if (response.RequestURL != null && response.RequestURL != "") {
                                    $("#ui_txtRequestUrl").val(response.RequestURL);
                                }

                                if (response.MethodType != null && response.MethodType != "") {
                                    $("#ui_ddl_MethodType").val(response.MethodType);
                                }

                                if (response.ContentType != null && response.ContentType != "") {
                                    $("#ui_ddl_ContentType").val(response.ContentType).change();
                                }
                                let ContentType = $("#ui_ddl_ContentType option:selected").text().toLowerCase();
                                if (ContentType == 'form') {
                                    var FieldMappingConditionDetail = response.FieldMappingDetails;

                                    $.each(JSON.parse(FieldMappingConditionDetail), function (i, obj) {

                                        if (i == 0) {
                                            trelementcount = 0;
                                        }

                                        if (obj.IsPlumb5OrCustomField == "Plumb5Field") {
                                            $(".dropdown-item.adddatafild").click();
                                            $("#txtFieldAnswer_" + i).val(obj.Key);
                                            $("#drpFields_" + i).select2().val(obj.Value).change();
                                        }
                                        else if (obj.IsPlumb5OrCustomField == "StaticField") {
                                            $(".adddatacustfild").click();
                                            $("#txtFieldKey_" + i).val(obj.Key);
                                            $("#txtFieldAnswer_" + i).val(obj.Value);
                                        }
                                    });
                                }
                                else if (ContentType == 'raw body') {
                                    $("#ui_txtRequestBody").val(response.RawBody);
                                }
                                //$.each(JSON.parse(FieldMappingConditionDetail), function (i, obj) {
                                //    if (i != 0) {
                                //        $(".adddatafild").click();
                                //    }
                                //    $("#drpFields_" + i).val(obj.Key);
                                //    $("#txtFieldAnswer_" + i).val(obj.Value);
                                //});

                                var HeaderConditionDetail = response.Headers;

                                $.each(JSON.parse(HeaderConditionDetail), function (i, obj) {

                                    if (i == 0) {
                                        trheaderelementcount = 0;
                                    }

                                    $(".addheaderfild").click();
                                    $("#txtheaderKey_" + i).val(obj.Key);
                                    $("#txtheaderValue_" + i).val(obj.Value);
                                });

                                if (response.BasicAuthentication != null && response.BasicAuthentication != "") {
                                    var basicauthdetails = JSON.parse(response.BasicAuthentication);
                                    $("#ui_txt_BasicAuthenticationKey").val(basicauthdetails.AuthenticationKey);
                                    $("#ui_txt_BasicAuthenticationValue").val(basicauthdetails.AuthenticationValue);
                                }

                            }
                        },
                        error: ShowAjaxError
                    });
                }
            }
            else {
                if (NodeText == 'dateandtime') {
                    var datetime = result.toString().split("~");

                    var condloop = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Datecondition);
                    var DynamicGroup_chk = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.IsDynamicGroup);
                    if (DynamicGroup_chk == '1') {
                        $('#wrkflwDynaGrp').prop('checked', true);
                    }
                    else {
                        $('#wrkflwstatGrp').prop('checked', true);
                    }

                    if (condloop > 0 && condloop < 8) {
                        $('#radproceed').prop('checked', true);
                        $(".wrkflwwaitforwrp").addClass("hideDiv");
                        $(".wrkflwwaitforslot").addClass("hideDiv");
                        $(".wrkflwproceedstepwrp").removeClass("hideDiv");

                        var myDate1 = ConvertUTCDateTimeToLocal(datetime[0]);
                        var myDate2 = ConvertUTCDateTimeToLocal(datetime[1]);

                        $("#txtdateandtime1").val(workflowUtil.makeDoubleDigit((myDate1.getMonth() + 1)) + "/" + workflowUtil.makeDoubleDigit(myDate1.getDate()) + "/" + myDate1.getFullYear());
                        $("#txtdateandtime2").val(workflowUtil.makeDoubleDigit((myDate2.getMonth() + 1)) + "/" + workflowUtil.makeDoubleDigit(myDate2.getDate()) + "/" + myDate2.getFullYear());

                        $("#ui_dllworkflowTime1").val(workflowUtil.makeDoubleDigit(myDate1.getHours()));
                        $("#ui_dllworkflowMinute1").val(workflowUtil.makeDoubleDigit(myDate1.getMinutes()));

                        $("#ui_dllworkflowTime2").val(workflowUtil.makeDoubleDigit(myDate2.getHours()));
                        $("#ui_dllworkflowMinute2").val(workflowUtil.makeDoubleDigit(myDate2.getMinutes()));
                    }
                    if (condloop == 8) {
                        $('#radwaitforslot').prop('checked', true);
                        $(".wrkflwwaitforwrp").addClass("hideDiv");
                        $(".wrkflwproceedstepwrp").addClass("hideDiv");
                        $(".wrkflwwaitforslot").removeClass("hideDiv");

                        var myDate1 = datetime[0].split(':');
                        var myDate2 = datetime[1].split(':');

                        $("#ui_dll_Time1").val(myDate1[0]);
                        $("#ui_dll_Minute1").val(myDate1[1]);

                        $("#ui_dll_Time2").val(myDate2[0]);
                        $("#ui_dll_Minute2").val(myDate2[1]);

                    }
                    else {
                        $('#radwaitfor').prop('checked', true);
                        $(".wrkflwproceedstepwrp").addClass("hideDiv");
                        $(".wrkflwwaitforslot").addClass("hideDiv");
                        $(".wrkflwwaitforwrp").removeClass("hideDiv");

                        if (datetime[0].length > 0) {
                            var getdate = datetime[0].split(" ");
                            $("#txttime").val(getdate[0]);
                        }

                        if ((response.length > 0) && response[0].TimeType.indexOf("Hours") > -1) { $("#ui_dlltimetype").val(1); }
                        if (datetime[0].indexOf("Day") > -1) { $("#ui_dlltimetype").val(2); }
                        if (datetime[0].indexOf("Hours") > -1) { $("#ui_dlltimetype").val(1); }
                        if (datetime[0].indexOf("Min") > -1) { $("#ui_dlltimetype").val(0); }
                    }
                }
                if (NodeText == 'segment') {
                    //if (ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Title).toString().indexOf("individual") > -1) {
                    //    selecttab('2', '1');
                    //}
                    //else if (ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Title).toString().indexOf("group") > -1) {
                    //    selecttab('1', '2');
                    //}
                    //selectedsegmentids = result.toString().split(",");
                    GroupIds = Array.from(result.toString().split(","), Number);
                    WfGroupids = GroupIds;

                    for (var k = 0; k < GroupIds.length; k++)
                        $('#chkGroup_' + GroupIds[k]).attr('checked', true);
                }
                if (NodeText == 'mail') {
                    $.ajax({
                        url: "/Journey/CreateWorkflow/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlmailtempId").val(response.MailTemplateId).trigger('change');
                            $("#txtmailsubject").val(response.MailSubject);
                            $("#txtmailfromname").val(response.FromName);
                            $("#ddlfromemailId").val(response.FromEmailId);
                            $("#txtReplyemailid").val(response.ReplyToEmailId);
                            $("#ui_MailConfigurationName").select2().val(response.MailConfigurationNameId).change();
                            if (response.IsPromotionalOrTransactionalType == true) { $('#radmailtranmsg').prop('checked', true); }
                            else if (response.IsPromotionalOrTransactionalType == false) { $('#radmailpromomsg').prop('checked', true); }
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'sms') {
                    $.ajax({
                        url: "/Journey/CreateWorkflow/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            if (response.IsPromotionalOrTransactionalType == true) { $('#radsmstranmsg').prop('checked', true); }
                            else if (response.IsPromotionalOrTransactionalType == false) { $('#radsmspromomsg').prop('checked', true); }
                            smsDetails.BindSMSTemplateByType();
                            $("#ddlsmstempId").val(response.SmsTemplateId);
                            $("#ui_ddl_SmsConfigName").select2().val(response.SmsConfigurationNameId).change();
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'rule') {
                    $("#ddlruleId").val(result).trigger('change');
                }
                if (NodeText == 'apppush') {
                    $.ajax({
                        url: "/Journey/CreateWorkflow/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlapppush").val(response.MobilePushTemplateId).trigger('change');
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'webpush') {
                    $.ajax({
                        url: "/Journey/CreateWorkflow/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlwebpush").val(response.WebPushTemplateId).trigger('change');
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'whatsapp') {
                    $.ajax({
                        url: "/Journey/CreateWorkflow/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlwhatsapp").val(response.WhatsAppTemplateId).trigger('change');

                            $("#ui_WAConfigurationName").select2().val(response.WhatsAppConfigurationNameId).change();
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'webhook') {

                    //alert("webhook");

                    $.ajax({
                        url: "/Journey/CreateWorkflow/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            if (response != null) {
                                workflowUtil.webhookClearFields();

                                if (response.RequestURL != null && response.RequestURL != "") {
                                    $("#ui_txtRequestUrl").val(response.RequestURL);
                                }

                                if (response.MethodType != null && response.MethodType != "") {
                                    $("#ui_ddl_MethodType").val(response.MethodType);
                                }

                                if (response.ContentType != null && response.ContentType != "") {
                                    $("#ui_ddl_ContentType").val(response.ContentType).change();
                                }

                                let ContentType = $("#ui_ddl_ContentType option:selected").text().toLowerCase();
                                if (ContentType == 'from') {
                                    var FieldMappingConditionDetail = response.FieldMappingDetails;

                                    $.each(JSON.parse(FieldMappingConditionDetail), function (i, obj) {

                                        if (i == 0) {
                                            trelementcount = 0;
                                        }

                                        if (obj.IsPlumb5OrCustomField == "Plumb5Field") {
                                            $(".dropdown-item.adddatafild").click();
                                            $("#txtFieldAnswer_" + i).val(obj.Key);
                                            $("#drpFields_" + i).select2().val(obj.Value).change();
                                        }
                                        else if (obj.IsPlumb5OrCustomField == "StaticField") {
                                            $(".adddatacustfild").click();
                                            $("#txtFieldKey_" + i).val(obj.Key);
                                            $("#txtFieldAnswer_" + i).val(obj.Value);
                                        }

                                        //if (i != 0) {
                                        //    $(".adddatafild").click();
                                        //}
                                    });
                                }
                                else if (ContentType == 'raw body') {
                                    $("#ui_txtRequestBody").val(response.RawBody);
                                }

                                var HeaderConditionDetail = response.Headers;

                                $.each(JSON.parse(HeaderConditionDetail), function (i, obj) {
                                    if (i == 0) {
                                        trheaderelementcount = 0;
                                    }

                                    $(".addheaderfild").click();
                                    $("#txtheaderKey_" + i).val(obj.Key);
                                    $("#txtheaderValue_" + i).val(obj.Value);
                                });

                                if (response.BasicAuthentication != null && response.BasicAuthentication != "") {
                                    var basicauthdetails = JSON.parse(response.BasicAuthentication);
                                    $("#ui_txt_BasicAuthenticationKey").val(basicauthdetails.AuthenticationKey);
                                    $("#ui_txt_BasicAuthenticationValue").val(basicauthdetails.AuthenticationValue);
                                }

                            }
                        },
                        error: ShowAjaxError
                    });
                }
            }
        }
        else {
            $("#btnsavemaildetails").attr('value', 'Save');
            $("#btnSaveSms").attr('value', 'Save');
            $("#btnSaveRule").attr('value', 'Save');
            $("#btnsegment").attr('value', 'Save');
            $("#btnSavewebpush").attr('value', 'Save');
            $("#btnSaveapppush").attr('value', 'Save');
            $("#btngroupdetails").attr('value', 'Save');
            $("#btndateandtime").attr('value', 'Save');

            var funcToExecute = "";
            funcToExecute = nodeType + "ClearFields";
            window.workflowUtil[funcToExecute]();
            if (ClickedNodeId.length > 0) {
                var CurrentNodeData = KeyAndValuesOfMenu[ClickedNodeId];
                if (!IsObjectEmpty(CurrentNodeData)) {
                    var funcToExecute = "";
                    funcToExecute = nodeType + "ClearFields";
                    window.workflowUtil[funcToExecute]();
                    if (!IsObjectEmpty(CurrentNodeData.NodeData)) {
                        funcToExecute = "Bind" + CurrentNodeData.NodeType + "OnEdit";
                        window.workflowUtil[funcToExecute](CurrentNodeData.NodeData);
                    }
                }
            }
        }
    },
    makeDoubleDigit: function (n) {
        return (n < 10 ? '0' : '') + n;
    },
    SaveFlowchart: function () {
        var freenode = "";
        var nodes = []
        $(".state").each(function (idx, elem) {
            var $elem = $(elem);
            var endpoints = jsPlumb.getEndpoints($elem.attr('id'));
            //console.log('endpoints of ' + $elem.attr('id'));
            //console.log(endpoints);
            nodes.push({
                blockId: $elem.attr('id'),
                nodetype: $elem.attr('data-nodetype'),
                positionX: parseInt($elem.css("left"), 10),
                positionY: parseInt($elem.css("top"), 10),
                label: $("#popup" + $elem.attr('id')).text()
            });

            var sid = dataconnections.filter(x => x.SourceId === $elem.attr('id')).map(x => x.connectionId)[0];
            var tid = dataconnections.filter(x => x.TargetId === $elem.attr('id')).map(x => x.connectionId)[0];
            if (sid == undefined && tid == undefined) { freenode = "Please connect " + $("#popup" + $elem.attr('id')).text() + " with others"; }
        });


        flowChartdata.nodes = nodes;
        flowChartdata.connections = dataconnections;
        flowChartdata.numberOfElements = numberOfElements;

        var flowChartJson = JSON.stringify(flowChartdata);
        console.log(flowChartJson);

        WorkFlowBasicDetails.Rss = RssExist;

        if (CheckDuplicateConfigIdPresent()) {
            ShowErrorMessage(GlobalErrorList.WorkFLow.Wrong);
            return false;
        }

        if (WorkflowId == 0) {

            WorkFlowBasicDetails.Title = CleanText($("#ui_txtWorkFlowTitle").val());
            WorkFlowBasicDetails.Status = 2;
            WorkFlowBasicDetails.Flowchart = flowChartJson;
            WorkFlowBasicDetails.ArrayConfig = JSON.stringify(ArrayConfig);
            if (WorkflowId != 0) { WorkFlowBasicDetails.WorkflowId = WorkflowId; }
            else { WorkFlowBasicDetails.WorkflowId = 0; }

            $.ajax({
                url: "/Journey/CreateWorkflow/StoreBasicDetails",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkFlowBasicDetails': WorkFlowBasicDetails }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: true,
                success: function (response) {
                    if (response == -1) {
                        ShowErrorMessage(GlobalErrorList.WorkFLow.TitleExist);
                        $("#btnSave").css("display", "block");
                        $("#btnSavedraft").css("display", "block");
                    }
                    else {
                        WorkflowId = response;


                        for (var n = 0; n < flowChartdata.nodes.length; n++) {
                            var value = getchannelvalue(flowChartdata.nodes, flowChartdata.nodes[n].blockId);
                            if (getchannelvalue(flowChartdata.nodes, flowChartdata.nodes[n].blockId) == 0) {
                                var Notconfig = flowChartdata.nodes[n].blockId.split("_");
                                if (Notconfig[1] != "end") { ShowErrorMessage("You have not configured " + Notconfig[1].toUpperCase()); $("#btnSave").css("display", "block"); $("#btnSavedraft").css("display", "block"); $("#btnstop").css("display", "none"); return; }

                            }
                        }

                        chkchannel = 0;
                        allchannel = [];
                        allprechannel = [];
                        Segment = "0", Rule = "0", Time = "0", DateTime = "0", Alert = "0";
                        PreNode = "0", Condition = "0";

                        var found = flowChartdata.connections;
                        for (var n = 0; n < found.length; n++) {
                            if (containsAny(found[n].TargetId, defaultchannels)) {
                                Segment = "0", Rule = "0", RuleType = "0", chkchannel = 0, Goal = "0", DateTime = "0", Alert = "0", PreNode = "0", Condition = "0";
                                allprechannel = [];
                                channelName = found[n].TargetId;
                                var chk = 0;

                                if (containsAny(found[n].SourceId, defaultchannels)) {
                                    PreNode = found[n].SourceId; Condition = found[n].RelationWithParent;
                                }

                                else {
                                    Segment = found[n].SourceId.indexOf("state_segment_") > -1 ? found[n].SourceId : Segment;
                                    Rule = found[n].SourceId.indexOf("state_rule_") > -1 ? found[n].SourceId : Rule;
                                    RuleType = found[n].SourceId.indexOf("state_rule_") > -1 ? found[n].RelationWithParent.toLowerCase().indexOf('not') == -1 ? 1 : 0 : RuleType;

                                    DateTime = found[n].SourceId.indexOf("state_dateandtime_") > -1 ? found[n].SourceId : DateTime;
                                    //Goal = found[n].SourceId.indexOf("state_goal_") > -1 ? found[n].SourceId : Goal;
                                    //Alert = found[n].SourceId.indexOf("state_alert_") > -1 ? found[n].SourceId : Alert;

                                    if (containsAny(found[n].SourceId, defaultchannels)) {
                                        PreNode = found[n].SourceId; Condition = found[n].RelationWithParent;
                                    }
                                    chk = getprenodeinfo(found[n].SourceId);
                                }
                                if (chk == 0) {
                                    bindChannel();
                                }

                            }
                        }

                        console.log(allchannel);


                        //end of arrange nodes

                        var result = allchannel.filter(x => x.PreConfigId === 0)[0];
                        if (dataconnections.length == 0) {
                            ShowErrorMessage(GlobalErrorList.WorkFLow.OneChannel);
                        }
                        else if (result == undefined) {
                            ShowErrorMessage(GlobalErrorList.WorkFLow.AudienceRule);
                        }
                        else if ((result != undefined) && result.SegmentId == 0 && result.RulesId == 0 && (result.Channel.indexOf('mail') > -1 || result.Channel.indexOf('sms') > -1)) {
                            var getcha = result.Channel.split('_');
                            ShowErrorMessage("Add group before " + getcha[1] + "(" + result.ConfigName + ") channel");
                        }
                        else if (freenode.length > 0) {
                            ShowErrorMessage(freenode);
                        }
                        else {
                            final_data = {
                                json: JSON.stringify(allchannel),
                            };
                            final_flowChartJson = flowChartJson;
                            final_ArrayConfig = ArrayConfig;
                            $("#createworkflow").modal("show");

                            //$.ajax({
                            //    url: "/Journey/CreateWorkflow/SaveFlowchart",
                            //    type: 'post',
                            //    dataType: 'json',
                            //    data: data,
                            //    success: function (json) {
                            //        if (json == 0) {
                            //            WorkFlowBasicDetails.WorkflowId = WorkflowId;
                            //            WorkFlowBasicDetails.Title = $('#ui_txtWorkFlowTitle').val();
                            //            WorkFlowBasicDetails.Status = 1;
                            //            WorkFlowBasicDetails.Flowchart = flowChartJson;
                            //            WorkFlowBasicDetails.ArrayConfig = JSON.stringify(ArrayConfig);
                            //            $.ajax({
                            //                url: "/Journey/CreateWorkflow/UpdateWorkflowchart",
                            //                type: 'POST',
                            //                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkFlowBasicDetails': WorkFlowBasicDetails }),
                            //                contentType: "application/json; charset=utf-8",
                            //                dataType: "json",
                            //                success: function (result) {
                            //                    if (result == 0) {

                            //                        ShowSuccessMessage(GlobalErrorList.WorkFLow.SucessMesg);
                            //                        $("#btnSave").css("display", "none");
                            //                        $("#btnSavedraft").css("display", "none");
                            //                    }
                            //                    else { ShowErrorMessage(GlobalErrorList.WorkFLow.Wrong); }
                            //                },
                            //                error: ShowAjaxError
                            //            });

                            //        } else {
                            //            ShowErrorMessage(GlobalErrorList.WorkFLow.Wrong);
                            //        }
                            //    },
                            //});
                        }
                    }
                },
                error: ShowAjaxError
            });
        }
        else {

            var nodes = []
            $(".state").each(function (idx, elem) {
                var $elem = $(elem);
                var endpoints = jsPlumb.getEndpoints($elem.attr('id'));
                //console.log('endpoints of ' + $elem.attr('id'));
                //console.log(endpoints);
                nodes.push({
                    blockId: $elem.attr('id'),
                    nodetype: $elem.attr('data-nodetype'),
                    positionX: parseInt($elem.css("left"), 10),
                    positionY: parseInt($elem.css("top"), 10),
                    label: $("#popup" + $elem.attr('id')).text()
                });
            });


            flowChartdata.nodes = nodes;
            flowChartdata.connections = dataconnections;
            flowChartdata.numberOfElements = numberOfElements;

            var flowChartJson = JSON.stringify(flowChartdata);
            console.log(flowChartJson);
            for (var n = 0; n < flowChartdata.nodes.length; n++) {
                var value = getchannelvalue(flowChartdata.nodes, flowChartdata.nodes[n].blockId);
                if (getchannelvalue(flowChartdata.nodes, flowChartdata.nodes[n].blockId) == 0) {
                    var Notconfig = flowChartdata.nodes[n].blockId.split("_");
                    if (Notconfig[1] != "end") { ShowErrorMessage("You have not configured " + Notconfig[1].toUpperCase()); $("#btnSave").css("display", "block"); $("#btnSavedraft").css("display", "block"); $("#btnstop").css("display", "none"); return; }

                }
            }
            //arrange nodes       

            chkchannel = 0;
            allchannel = [];
            allprechannel = [];
            Segment = "0", Rule = "0", Time = "0", DateTime = "0", Alert = "0";
            PreNode = "0", Condition = "0";

            var found = flowChartdata.connections;
            for (var n = 0; n < found.length; n++) {
                if (containsAny(found[n].TargetId, defaultchannels)) {
                    Segment = "0", Rule = "0", RuleType = "0", chkchannel = 0, Goal = "0", DateTime = "0", Alert = "0", PreNode = "0", Condition = "0";
                    allprechannel = [];
                    channelName = found[n].TargetId;
                    var chk = 0;

                    if (containsAny(found[n].SourceId, defaultchannels)) {
                        PreNode = found[n].SourceId; Condition = found[n].RelationWithParent;
                    }

                    else {
                        Segment = found[n].SourceId.indexOf("state_segment_") > -1 ? found[n].SourceId : Segment;
                        Rule = found[n].SourceId.indexOf("state_rule_") > -1 ? found[n].SourceId : Rule;
                        RuleType = found[n].SourceId.indexOf("state_rule_") > -1 ? found[n].RelationWithParent.toLowerCase().indexOf('not') == -1 ? 1 : 0 : RuleType;

                        DateTime = found[n].SourceId.indexOf("state_dateandtime_") > -1 ? found[n].SourceId : DateTime;
                        //Goal = found[n].SourceId.indexOf("state_goal_") > -1 ? found[n].SourceId : Goal;
                        //Alert = found[n].SourceId.indexOf("state_alert_") > -1 ? found[n].SourceId : Alert;

                        if (containsAny(found[n].SourceId, defaultchannels)) {
                            PreNode = found[n].SourceId; Condition = found[n].RelationWithParent;
                        }
                        chk = getprenodeinfo(found[n].SourceId);
                    }
                    if (chk == 0) {
                        bindChannel();
                    }

                }
            }

            console.log(allchannel);


            //end of arrange nodes

            var result = allchannel.filter(x => x.PreConfigId === 0)[0];
            if (dataconnections.length == 0) {
                ShowErrorMessage(GlobalErrorList.WorkFLow.OneChannel);
            }
            else if ((nodes.length > 0) && nodes.filter(x => x.blockId.indexOf("_segment_") > -1).length == 0) {
                ShowErrorMessage(GlobalErrorList.WorkFLow.AudienceRule);
            }
            else if (result == undefined && flowChartdata.nodes[0].blockId.match(/(mail|sms|webpush|apppush|webhook|whatsapp)/) == null) {
                ShowErrorMessage(GlobalErrorList.WorkFLow.AudienceRule);
            }
            else if ((result != undefined) && result.SegmentId == 0 && result.RulesId == 0 && (result.Channel.indexOf('mail') > -1 || result.Channel.indexOf('sms') > -1)) {
                var getcha = result.Channel.split('_');
                ShowErrorMessage("Add group before " + getcha[1] + "(" + result.ConfigName + ") channel");
            }
            else if (freenode.length > 0) {
                ShowErrorMessage(freenode);
            }
            else {

                final_data = {
                    json: JSON.stringify(allchannel),
                };
                final_flowChartJson = flowChartJson;
                final_ArrayConfig = ArrayConfig;
                $("#createworkflow").modal("show");

                //$.ajax({
                //    url: "/Journey/CreateWorkflow/SaveFlowchart",
                //    type: 'post',
                //    dataType: 'json',
                //    data: data,
                //    success: function (json) {
                //        if (json == 0) {
                //            WorkFlowBasicDetails.WorkflowId = WorkflowId;
                //            WorkFlowBasicDetails.Title = $('#ui_txtWorkFlowTitle').val();
                //            WorkFlowBasicDetails.Status = 1;
                //            WorkFlowBasicDetails.Flowchart = flowChartJson;
                //            WorkFlowBasicDetails.ArrayConfig = JSON.stringify(ArrayConfig);
                //            $.ajax({
                //                url: "/Journey/CreateWorkflow/UpdateWorkflowchart",
                //                type: 'POST',
                //                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkFlowBasicDetails': WorkFlowBasicDetails }),
                //                contentType: "application/json; charset=utf-8",
                //                dataType: "json",
                //                success: function (result) {
                //                    if (result == 0) {

                //                        ShowSuccessMessage(GlobalErrorList.WorkFLow.SucessMesg);
                //                        $("#btnSave").css("display", "none");
                //                        $("#btnSavedraft").css("display", "none");
                //                    }
                //                    else { ShowErrorMessage(GlobalErrorList.WorkFLow.Wrong); }
                //                },
                //                error: ShowAjaxError
                //            });

                //        } else {
                //            ShowErrorMessage(GlobalErrorList.WorkFLow.Wrong);
                //        }
                //    },
                //});
            }
        }

        window.history.pushState('', '', UpdateQueryString("WorkFlowId", WorkflowId));
    },
    SaveFinalPublishData: function (data, flowChartJson, ArrayConfig) {
        $.ajax({
            url: "/Journey/CreateWorkflow/SaveFlowchart",
            type: 'post',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            //data: data,
            data: JSON.stringify(data),
            success: function (json) {
                if (json == 0) {
                    WorkFlowBasicDetails.WorkflowId = WorkflowId;
                    WorkFlowBasicDetails.Title = $('#ui_txtWorkFlowTitle').val();
                    WorkFlowBasicDetails.Status = 1;
                    WorkFlowBasicDetails.Flowchart = flowChartJson;
                    WorkFlowBasicDetails.ArrayConfig = JSON.stringify(ArrayConfig);
                    $.ajax({
                        url: "/Journey/CreateWorkflow/UpdateWorkflowchart",
                        type: 'POST',
                        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkFlowBasicDetails': WorkFlowBasicDetails }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (result) {
                            if (result == 0) {
                                ShowSuccessMessage(GlobalErrorList.WorkFLow.SucessMesg);
                                setTimeout(function () { window.location.href = "/Journey/Workflows"; }, 500);

                                $("#btnSave").css("display", "none");
                                $("#btnSavedraft").css("display", "none");
                            }
                            else { ShowErrorMessage(GlobalErrorList.WorkFLow.Wrong); }
                        },
                        error: ShowAjaxError
                    });

                } else {
                    ShowErrorMessage(GlobalErrorList.WorkFLow.Wrong);
                }
            },
        });
    },
    GeneralBinding: function (NodeText, NodeId) {
        var funcToExecute = "Get" + NodeText + "PopupDetails";
        var data = window.workflowUtil[funcToExecute]();
        var NodeDetails = {};
        NodeDetails.NodeData = data;
        NodeDetails.NodeType = NodeText;
        KeyAndValuesOfMenu[NodeId] = NodeDetails;
        $("#" + NodeId).css({ 'border': '1px solid #66BB6A' });
    },
    GetdateandtimePopupDetails: function () {
        var data = {};
        data.DateTimeValue1 = $("#txtdateandtime1").val() + " " + $("#ui_dllworkflowTime1").val() + ":00:00";
        data.DateTimeValue2 = $("#txtdateandtime2").val() + " " + $("#ui_dllworkflowTime2").val() + ":00:00";
        data.DateTimeType = $("#ui_dlldateandtimetype").val();
        return data;
    },
    GetmailPopupDetails: function () {
        MailSendingSetting = {};
        MailSendingSetting.MessageType = $('input:radio[name=mailmessagetype]:checked').val();
        MailSendingSetting.MailTemplateId = $("#ddlmailtempId").val();
        MailSendingSetting.Subject = $("#txtmailsubject").val();
        MailSendingSetting.FromName = $("#txtmailfromname").val();
        MailSendingSetting.FromEmailId = $("#ddlfromemailId").val();
        MailSendingSetting.ReplyToEmailId = $("#txtReplyemailid").val();
        MailSendingSetting.Unsubscribe = $("#chkUnsubscribe").is(':checked');
        MailSendingSetting.Forward = $("#chkForward").is(':checked');
        MailSendingSetting.MailConfigurationNameId = $("#ui_MailConfigurationName").val();
        return MailSendingSetting;
    },
    GetsmsPopupDetails: function () {
        var data = {};
        data.SMSTemplateId = $("#ddlsmstempId").val();
        data.messagetype = $('input:radio[name=smsmessagetype]:checked').val();
        data.SmsConfigurationNameId = $("#ui_ddl_SmsConfigName").val();
        return data;
    },
    GetrulePopupDetails: function () {
        var data = {};
        data = null;//ruleConditions;
        return data;
    },
    GetwebpushPopupDetails: function () {
        var data = {};
        data.CampaignId = $("#ddlwebpush").val();
        return data;
    },
    GetapppushPopupDetails: function () {
        var data = {};
        data.MobilePushTemplateId = $("#ddlapppush").val();
        return data;
    },
    GetwhatsappPopupDetails: function () {
        var data = {};
        data.WhatsAppTemplateId = $("#ddlwhatsapp").val();
        data.WhatsAppConfigurationNameId = $("#ui_WAConfigurationName").val();
        return data;
    },
    BindmailOnEdit: function (Nodedata) {
        $("#ddlmailtempId").val(Nodedata.MailTemplateId).trigger('change');
        $("#ddlfromemailId").val(Nodedata.FromEmailId);
        $("#txtReplyemailid").val(Nodedata.ReplyToEmailId);
        $("#txtmailfromname").val(Nodedata.FromName);
        $("#txtmailsubject").val(Nodedata.Subject);
        $('#chkUnsubscribe').prop('checked', Nodedata.Unsubscribe);
        $("#chkForward").prop('checked', Nodedata.Forward);
        $('input[type=radio][value=' + Nodedata.MessageType + ']').prop('checked', true);
        $("#ui_MailConfigurationName").val(Nodedata.MailConfigurationNameId).trigger('change');
    },
    BindsmsOnEdit: function (Nodedata) {
        $("#ddlsmstempId").val(Nodedata.SMSTemplateId).trigger('change');
        $('input[type=radio][value=' + Nodedata.messagetype + ']').prop('checked', true);
        $("#ui_ddl_SmsConfigName").val(Nodedata.SmsConfigurationNameId).trigger('change');
    },
    BindwebpushOnEdit: function (Nodedata) {
        $("#ddlwebpush").val(Nodedata.WebPushTemplateId).trigger('change');
    },
    BindapppushOnEdit: function (Nodedata) {
        $("#ddlapppush").val(Nodedata.MobilePushTemplateId);
    },
    BindwhatsappOnEdit: function (Nodedata) {
        $("#ddlwhatsapp").val(Nodedata.WhatsAppTemplateId).trigger('change');
        $("#ui_WAConfigurationName").val(Nodedata.WhatsAppConfigurationNameId).trigger('change');
    },
    mailClearFields: function () {
        // $('.CustomPopUp').find("input:text").val('');
        $("#txtmailsubject").val("");
        $("#txtmailfromname").val("");
        $("#txtReplyemailid").val("");
        $('.CustomPopUp').find("select").each(function () {
            $(this).find('option:eq(0)').prop("selected", "selected");
        });
        $("input:radio[name=mailmessagetype][value=" + 1 + "]").prop('checked', 'checked');
        $('.CustomPopUp').find("input:checkbox").attr('checked', false);

        $("#ddlmailtempId").find('option:eq(0)').prop("selected", "selected").change();
        $("#ddlfromemailId").find('option:eq(0)').prop("selected", "selected");
        $("#ui_MailConfigurationName").select2().val(maildefconfid).change();
    },
    smsClearFields: function () {
        $('#ddlsmstempId').find('option:eq(0)').prop("selected", "selected").change();
        $("input:radio[name=smsmessagetype][value=" + 1 + "]").prop('checked', 'checked');
        $("#ui_ddl_SmsConfigName").select2().val(smsdefconfid).change();
    },
    ruleClearFields: function () {
        $('#ddlruleId').find('option:eq(0)').prop("selected", "selected").change();
    },
    segmentClearFields: function () {
        $('#ddlSegment').find('option:eq(0)').prop("selected", "selected");
    },
    webpushClearFields: function () {
        $('#ddlwebpush').find('option:eq(0)').prop("selected", "selected").change();
    },
    apppushClearFields: function () {
        $('#ddlapppush').find('option:eq(0)').prop("selected", "selected").change();
    },
    dateandtimeClearFields: function () {
        $('#txtdateandtime1').val('');
        $('#txttime').val(1);
        $('#ui_dllworkflowTime1').find('option:eq(10)').prop("selected", "selected");
        $('#txtdateandtime2').val('');
        $('#ui_dllworkflowTime2').find('option:eq(10)').prop("selected", "selected");
        $('#ui_dlldateandtimetype').find('option:eq(6)').prop("selected", "selected");
        $('#ddldatecondition').find('option:eq(0)').prop("selected", "selected");
        $('#wrkflwstatGrp').prop('checked', true);
    },
    webhookClearFields: function () {
        $("#ui_txtRequestUrl,#ui_txt_BasicAuthenticationKey,#ui_txt_BasicAuthenticationValue").val("");
        $('#ui_ddl_MethodType').find('option:eq(0)').prop("selected", "selected");
        $('#ui_ddl_ContentType').find('option:eq(0)').prop("selected", "selected");

        $(".adddatafildwrp").empty();

        //$('[id^=trsearch]').not('#trsearch0').remove();
        //$('#drpFields_0').find('option:eq(0)').prop("selected", "selected");
        //$('#txtFieldAnswer_0').val("");

        $(".addheaderfildwrp").empty();

        //$('[id^=trheader]').not('#trheader0').remove();
        //$('#txtheaderKey_0,#txtheaderValue_0').val("");
    },
    ChangeDateTimeFormat: function (SelectedDate) {
        SelectedDate = ConvertDateTimeToUTC(SelectedDate.getFullYear() + '-' + workflowUtil.makeDoubleDigit((SelectedDate.getMonth() + 1)) + '-' + workflowUtil.makeDoubleDigit(SelectedDate.getDate()) + " " + workflowUtil.makeDoubleDigit(SelectedDate.getHours()) + ":" + workflowUtil.makeDoubleDigit(SelectedDate.getMinutes()) + ":" + workflowUtil.makeDoubleDigit(SelectedDate.getSeconds()));
        var ScheduledDate = SelectedDate.getFullYear() + '-' + workflowUtil.makeDoubleDigit((SelectedDate.getMonth() + 1)) + '-' + workflowUtil.makeDoubleDigit(SelectedDate.getDate()) + " " + workflowUtil.makeDoubleDigit(SelectedDate.getHours()) + ":" + workflowUtil.makeDoubleDigit(SelectedDate.getMinutes()) + ":" + workflowUtil.makeDoubleDigit(SelectedDate.getSeconds());
        return ScheduledDate;
    },
    GetWorkFlowContentByID: function () {
        $("#btnSave").attr("UpdateId", Id).html("Update");
        WorkFlow.Id = Id;
        $.ajax({
            url: "/Journey/CreateWorkflow/GetDetail",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'workflowdetails': WorkFlow }),
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && response != undefined && response != "" && response.Id > 0) {
                    WorkFlow = response;
                }
                else {
                    ShowErrorMessage(GlobalErrorList.WorkFLow.NotExist);
                }


            }
        });
    },
    WorkflowDraft: function () {
        var nodes = []
        $(".state").each(function (idx, elem) {
            var $elem = $(elem);
            var endpoints = jsPlumb.getEndpoints($elem.attr('id'));
            //console.log('endpoints of ' + $elem.attr('id'));
            //console.log(endpoints);
            nodes.push({
                blockId: $elem.attr('id'),
                nodetype: $elem.attr('data-nodetype'),
                positionX: parseInt($elem.css("left"), 10),
                positionY: parseInt($elem.css("top"), 10),
                label: $("#popup" + $elem.attr('id')).text()
            });
        });


        flowChartdata.nodes = nodes;
        flowChartdata.connections = dataconnections;
        flowChartdata.numberOfElements = numberOfElements;
        var flowChartJson = JSON.stringify(flowChartdata);
        //console.log(flowChartJson);

        WorkFlowBasicDetails.Flowchart = flowChartJson;
        WorkFlowBasicDetails.ArrayConfig = JSON.stringify(ArrayConfig);

        if (CheckDuplicateConfigIdPresent()) {
            ShowErrorMessage(GlobalErrorList.WorkFLow.Wrong);
            return false;
        }

        if (WorkflowId == 0) {
            WorkFlowBasicDetails.Title = CleanText($("#ui_txtWorkFlowTitle").val());
            WorkFlowBasicDetails.Status = 2;
            workflowstatus = 2;
            $.ajax({
                url: "/Journey/CreateWorkflow/StoreBasicDetails",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkFlowBasicDetails': WorkFlowBasicDetails }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: true,
                success: function (response) {
                    if (response == -1) {
                        ShowErrorMessage(GlobalErrorList.WorkFLow.TitleExist);
                    }
                    else {
                        WorkflowId = response;
                        if (workflowstatus === 2) { ShowSuccessMessage(GlobalErrorList.WorkFLow.DraftSucessMesg); }

                    }
                    window.history.pushState('', '', UpdateQueryString("WorkFlowId", WorkflowId));
                },
            });

        }
        else {
            WorkFlowBasicDetails.WorkflowId = WorkflowId;
            WorkFlowBasicDetails.Title = $('#ui_txtWorkFlowTitle').val();
            WorkFlowBasicDetails.Status = 2;
            WorkFlowBasicDetails.Flowchart = flowChartJson;
            $.ajax({
                url: "/Journey/CreateWorkflow/UpdateWorkflowchart",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkFlowBasicDetails': WorkFlowBasicDetails }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    if (result == 0) { ShowSuccessMessage(GlobalErrorList.WorkFLow.DraftSucessMesg); }
                    else { ShowErrorMessage(GlobalErrorList.WorkFLow.Wrong); }
                },
                error: ShowAjaxError
            });
        }


        window.history.pushState('', '', UpdateQueryString("WorkFlowId", WorkflowId));
    },
    flowValidation: function () {
        var result = 1;
        if (ArrayConfig != null) {
            var chk = ArrayConfig.filter(function (item) { return item.Channel.indexOf('_segment_') > -1 && item.Title.toLowerCase() === 'allusers' })[0];
            if (chk != undefined) {
                var schk = dataconnections.filter(function (item) { return item.SourceId === chk.Channel && (item.TargetId.indexOf('_mail_') > -1 || item.TargetId.indexOf('_sms_') > -1) })[0];
                if (schk != undefined) {
                    result = 0;
                    ShowErrorMessage(GlobalErrorList.WorkFLow.DateTime);
                }
            }
        }

        return result;
    }
};

//Mail
var mailDetails = {
    IsMailSettingsChecked: function () {
        $.ajax({
            url: "/Mail/MailSettings/CheckMailSettingConfigured",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    IsMailSettingIsDone = true;
                } else {
                    IsMailSettingIsDone = false;
                }
            },
            error: ShowAjaxError
        });
    },
    BindMailTemplates: function () {
        var found = DropdownPreBind.filter(function (item) { return item.Channel === "Mail"; });
        if (found.length != 0) {
            DropdownPreBind.splice(DropdownPreBind.findIndex(x => x.Channel == "Mail"), found.length)
        }
        $.ajax({
            url: "/General/GetAllTemplateList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (responsedata) {
                var response = responsedata.Data;
                if (response != null && response.length > 0) {
                    AllMailTemplateList = response;
                    $.each(response, function () {
                        var optlist = document.createElement('option');
                        optlist.value = $(this)[0].Id;
                        optlist.text = $(this)[0].Name;
                        document.getElementById("ddlmailtempId").options.add(optlist);
                        DropdownPreBind.push({ "Channel": "Mail", "Id": $(this)[0].Id, "Text": $(this)[0].Name });
                    });
                    // GetNodeConfigurationId();
                }
            },
            error: ShowAjaxError
        });
    },
    BindActiveEmailIds: function () {
        $.ajax({
            url: "/General/GetActiveEmailIds",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (responsedata) {
                var response = responsedata.Data;
                $.each(response, function (i) {
                    if ($("#ddlfromemailId option[value='" + response[i] + "']").length == 0) {
                        var optlist = document.createElement('option');
                        optlist.value = response[i];
                        optlist.text = response[i];
                        document.getElementById("ddlfromemailId").options.add(optlist);
                    }

                });
                mailDetails.GetMailConfigurationName();
            },
            error: ShowAjaxError
        });
    },
    GetMailConfigurationName: function () {
        $.ajax({
            url: "/Mail/MailSettings/GetConfigurationNames",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var defaultId = 0;
                if (response != undefined && response != null) {
                    $("#ui_MailConfigurationName").empty();
                    $("#ui_MailConfigurationName").append(`<option value="0">Select Configuration Name</option>`);
                    $.each(response, function (i) {
                        $("#ui_MailConfigurationName").append("<option value='" + response[i].Id + "'>" + response[i].ConfigurationName + "</option>");
                        if (response[i].IsDefaultProvider)
                            defaultId = maildefconfid = response[i].Id;
                    });
                    $("#ui_MailConfigurationName").select2().val(defaultId).change();
                }
            },
            error: ShowAjaxError
        });
    },
    Validation: function () {
        if ($('#ddlmailtempId').get(0).selectedIndex == 0) {
            $('#ddlmailtempId').focus();
            ShowErrorMessage(GlobalErrorList.WorkFLow.MailTemplate);
            return false;
        }
        if (MailTemplateCounselorTags) {
            ShowErrorMessage(GlobalErrorList.WorkFLow.CounselorTags);
            return false;
        }

        else if ($('#txtmailsubject').val().length == 0) {
            $('#txtmailsubject').focus();
            ShowErrorMessage(GlobalErrorList.WorkFLow.MailSubject);
            return false;
        }
        else if ($('#txtmailfromname').val().length == 0) {
            $('#txtmailfromname').focus();
            ShowErrorMessage(GlobalErrorList.WorkFLow.MailFromName);
            return false;
        }
        else if ($('#ddlfromemailId').get(0).selectedIndex == 0) {
            $('#ddlfromemailId').focus();
            ShowErrorMessage(GlobalErrorList.WorkFLow.MailFromEmail);
            return false;
        }
        else if ($('#txtReplyemailid').val().length == 0) {
            $('#txtmailfromname').focus();
            ShowErrorMessage(GlobalErrorList.WorkFLow.MailReplyEmail);
            return false;
        }
        else if ($('#ui_ChkRecuringmail').prop('checked') == true) {
            if ($('#lblTriggerDaymail').prop('checked') != true && $('#lblTriggerHourmail').prop('checked') != true) {
                ShowErrorMessage(GlobalErrorList.WorkFLow.MailReplyRecurring);
                return false;
            }
        }
        if ($('#ui_MailConfigurationName').get(0).selectedIndex == 0) {
            $('#ui_MailConfigurationName').focus();
            ShowErrorMessage(GlobalErrorList.MailScheduleError.ConfigurationName);
            return false;
        }
        return true;
    },
    SaveMailConfig: function () {

        workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
        MailConfig = {};
        var msgtype = 0;
        MailConfig.MailTemplateId = parseInt($("#ddlmailtempId").val());
        var title = $("#ddlmailtempId option:selected").text();
        MailConfig.MailSubject = $("#txtmailsubject").val();
        MailConfig.FromName = $("#txtmailfromname").val();
        MailConfig.FromEmailId = $("#ddlfromemailId").val();
        MailConfig.ReplyToEmailId = $("#txtReplyemailid").val();
        MailConfig.Subscribe = $("#chkUnsubscribe").is(':checked') == true ? 1 : 0;
        MailConfig.WorkflowId = parseInt($.urlParam("WorkflowId"));
        if ($('#radmailtranmsg').prop('checked')) { msgtype = true; }
        if ($('#radmailpromomsg').prop('checked')) { msgtype = false; }
        MailConfig.IsPromotionalOrTransactionalType = msgtype;

        MailConfig.MailConfigurationNameId = parseInt($("#ui_MailConfigurationName option:selected").val());

        var result = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Value)
        if (result != '') {
            MailConfig.ConfigureMailId = parseInt(result);
        }
        if (!regExpEmail.test($("#txtReplyemailid").val())) {
            $("#txtReplyemailid").focus();
            ShowErrorMessage(GlobalErrorList.WorkFLow.MailReplyEmail);
            return false;
        }
        if ($('#ui_ChkRecuringmail').prop('checked') == true) {
            if ($('#lblTriggerDaymail').prop('checked')) { recurringmailstatus = 1; }
            else if ($('#lblTriggerHourmail').prop('checked')) { recurringmailstatus = 2; }
        }
        else recurringmailstatus = 0;

        MailConfig.IsTriggerEveryActivity = recurringmailstatus;
        $.ajax({
            url: "/Journey/SaveConfig/SaveMailConfig",
            type: 'post',
            dataType: 'json',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'MailConfig': MailConfig }),
            contentType: "application/json; charset=utf-8",
            success: function (ReturnMailConfigId) {
                SetNodeConfigArray(ClickedNodeId.toString(), ReturnMailConfigId, title);
                if ($.urlParam("WorkflowId") > 0) {
                    $.ajax({
                        url: "/Journey/SaveConfig/UpdateDate",
                        type: 'post',
                        dataType: 'json',
                        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkflowId': WorkflowId }),
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                        },
                    });
                }
            },
        });
        workflowUtil.mailClearFields();
    },
    CheckForMailCounselorTags: function (templateId) {
        MailTemplateCounselorTags = false;
        ShowPageLoading();
        $.ajax({
            url: "/Mail/MailTemplate/CheckCounselorTags",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'MailTemplateId': templateId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result) {
                    MailTemplateCounselorTags = true;
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }

};

//SMS
var smsDetails = {
    IsSmsSettingsChecked: function () {
        $.ajax({
            url: "/Sms/SmsSettings/CheckSmsSettingConfigured",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    IsSmsSettingIsDone = true;
                } else {
                    response = false;
                }
            },
            error: ShowAjaxError
        });
    },
    Validation: function () {
        if ($('#ddlsmstempId').get(0).selectedIndex == 0) {
            $('#ddlsmstempId').focus();
            ShowErrorMessage(GlobalErrorList.WorkFLow.SmsTemplate);
            return false;
        }
        if ($('#ui_ddl_SmsConfigName').get(0).selectedIndex == 0) {
            $('#ui_ddl_SmsConfigName').focus();
            ShowErrorMessage(GlobalErrorList.SmsSchedule.SelectSmsProvider);
            return false;
        }
        if (SmsTemplateCounselorTags) {
            ShowErrorMessage(GlobalErrorList.WorkFLow.CounselorTags);
            return false;
        }

        else if ($('#ui_ChkRecuringsms').prop('checked') == true) {
            if ($('#lblTriggerDaysms').prop('checked') != true && $('#lblTriggerHoursms').prop('checked') != true) {
                ShowErrorMessage(GlobalErrorList.WorkFLow.SmsRecurring);
                return false;
            }
        }
        return true;
    },
    BindSmsTemplate: function () {
        AllSmsTemplateList = [];
        var found = DropdownPreBind.filter(function (item) { return item.Channel === "Sms"; });
        if (found.length != 0) {
            DropdownPreBind.splice(DropdownPreBind.findIndex(x => x.Channel == "Sms"), found.length)
        }
        $.ajax({
            url: "/SMS/Template/GetAllTemplate",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function () {
                    AllSmsTemplateList.push(this);

                    smsDetails.BindSMSTemplateByType();
                    DropdownPreBind.push({ "Channel": "Sms", "Id": $(this)[0].Id, "Text": $(this)[0].Name });
                });
                smsDetails.GetSmsConfigurations();
            }
        });
    },
    BindSMSTemplateByType: function () {
        $("#ddlsmstempId").html(`<option>Select Template</option>`);

        if ($("input[name='wrkflwsmstype']:checked").val() === "1") {
            $.each(AllSmsTemplateList, function () {
                if ($(this)[0].IsPromotionalOrTransactionalType) {
                    $("#ddlsmstempId").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                }
            });

        }
        else if ($("input[name='wrkflwsmstype']:checked").val() === "2") {
            $.each(AllSmsTemplateList, function () {
                if (!$(this)[0].IsPromotionalOrTransactionalType) {
                    $("#ddlsmstempId").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                }
            });

        }


        HidePageLoading();
    },
    GetSmsConfigurations: function () {
        $.ajax({
            url: "/Sms/SmsSettings/GetConfigurationNameList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var defaultId = 0;
                if (response != undefined && response != null) {
                    $("#ui_ddl_SmsConfigName").empty();
                    $("#ui_ddl_SmsConfigName").append(`<option value="0">Select Configuration Name</option>`);
                    $.each(response, function (i) {
                        $("#ui_ddl_SmsConfigName").append("<option value='" + response[i].Id + "'>" + response[i].ConfigurationName + "</option>");
                        if (response[i].IsDefaultProvider)
                            defaultId = smsdefconfid = response[i].Id;
                    });
                    $("#ui_ddl_SmsConfigName").select2().val(defaultId).change();
                }
            },
            error: ShowAjaxError
        });
    },
    SaveSmsConfig: function () {

        workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
        SmsConfig = {};
        SmsConfig.SmsTemplateId = parseInt($("#ddlsmstempId").val());
        var title = $("#ddlsmstempId option:selected").text();
        if ($('#radsmstranmsg').prop('checked')) { msgtype = true; }
        if ($('#radsmspromomsg').prop('checked')) { msgtype = false; }
        if ($('#ui_ChkRecuringsms').prop('checked') == true) {
            if ($('#lblTriggerDaysms').prop('checked')) { recurringsmsstatus = 1; }
            else if ($('#lblTriggerHoursms').prop('checked')) { recurringsmsstatus = 2; }
        }
        else recurringsmsstatus = 0;
        SmsConfig.IsTriggerEveryActivity = recurringsmsstatus;
        SmsConfig.IsPromotionalOrTransactionalType = msgtype;
        var result = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Value)
        if (result != '') {
            SmsConfig.ConfigureSmsId = parseInt(result);
        }
        SmsConfig.SmsConfigurationNameId = parseInt($("#ui_ddl_SmsConfigName option:selected").val());
        $.ajax({
            url: "/Journey/SaveConfig/SaveSmsConfig",
            type: 'post',
            dataType: 'json',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'SmsConfig': SmsConfig }),
            contentType: "application/json; charset=utf-8",
            success: function (ReturnSmsConfigId) {
                SetNodeConfigArray(ClickedNodeId.toString(), ReturnSmsConfigId, title);
                if ($.urlParam("WorkflowId") > 0) {
                    $.ajax({
                        url: "/Journey/SaveConfig/UpdateDate",
                        type: 'post',
                        dataType: 'json',
                        data: JSON.stringify({ 'WorkflowId': WorkflowId }),
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                        },
                    });
                }
            },
        });
        workflowUtil.smsClearFields();

    },
    CheckForSmsCounselorTags: function (SmsTemplateId) {
        ShowPageLoading();
        SmsTemplateCounselorTags = false;
        var SmsTemplate = { Id: SmsTemplateId };
        $.ajax({
            url: "/SMS/Template/CheckCounselorTags",
            type: 'POST',
            data: JSON.stringify({ 'smsTemplate': SmsTemplate }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (response) {
                    SmsTemplateCounselorTags = true;

                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
};

//Web Push Notifications 
var WebPushDetails = {
    Validation: function () {
        if ($('#ddlwebpush').get(0).selectedIndex == 0) {
            $('#ddlwebpush').focus();
            ShowErrorMessage(GlobalErrorList.WorkFLow.WebPushTemplate);
            return false;
        }

        if (WebPushTemplateCounselorTags) {
            ShowErrorMessage(GlobalErrorList.WorkFLow.CounselorTags);
            return false;
        }

        else if ($('#ui_ChkRecuringwebpush').prop('checked') == true) {
            if ($('#lblTriggerDaywebpush').prop('checked') != true && $('#lblTriggerHourwebpush').prop('checked') != true) {
                ShowErrorMessage(GlobalErrorList.WorkFLow.WebPushRecurring);
                return false;
            }
        }
        return true;
    },
    GetWebPushCampaigns: function () {
        $.ajax({
            url: "/Journey/CreateWorkflow/GetWebPushTemplateList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function () {
                    var optlist = document.createElement('option');
                    optlist.value = $(this)[0].Id;
                    optlist.text = $(this)[0].TemplateName;
                    document.getElementById("ddlwebpush").options.add(optlist);
                    DropdownPreBind.push({ "Channel": "Webpush", "Id": $(this)[0].Id, "Text": $(this)[0].TemplateName, "rss": 0 });
                });
            },
            error: ShowAjaxError
        });
    },

    BindAllWebPush: function (AllCampaigns) {

        if (AllCampaigns != null && AllCampaigns != undefined) {
            var activeCampaigns = JSLINQ(AllCampaigns).Where(function (item) { return item.Status == 1; }).Select(function (item) { return item; }).items
            var found = DropdownPreBind.filter(function (item) { return item.Channel === "Webpush"; });
            if (found.length != 0) {
                DropdownPreBind.splice(DropdownPreBind.findIndex(x => x.Channel == "Webpush"), found.length)
            }
            if (activeCampaigns.length > 0) {
                $.each(activeCampaigns, function () {
                    var getitem = "<option value='" + $(this)[0].Id + "' rss=" + $(this)[0].IsRssFeed + ">" + $(this)[0].Name + "</option>";
                    $('#ddlwebpush').append(getitem);
                    DropdownPreBind.push({ "Channel": "Webpush", "Id": $(this)[0].Id, "Text": $(this)[0].Name, "rss": $(this)[0].IsRssFeed });
                });

            }
        }
    },
    SaveWebPushConfig: function () {

        workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
        WebPushConfig = {};
        WebPushConfig.WebPushTemplateId = $("#ddlwebpush").val();
        var title = $("#ddlwebpush option:selected").text();

        var result = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Value)
        if (result != '') {
            WebPushConfig.ConfigureWebPushId = parseInt(result);
        }
        if ($('#ui_ChkRecuringwebpush').prop('checked') == true) {
            if ($('#lblTriggerDaywebpush').prop('checked')) { recurringwebpushstatus = 1; }
            else if ($('#lblTriggerHourwebpush').prop('checked')) { recurringwebpushstatus = 2; }
        }
        else recurringwebpushstatus = 0;

        WebPushConfig.IsTriggerEveryActivity = recurringwebpushstatus;
        $.ajax({
            url: "/Journey/SaveConfig/SaveWebPushConfig",
            type: 'post',
            dataType: 'json',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WebPushConfig': WebPushConfig }),
            contentType: "application/json; charset=utf-8",
            success: function (ReturnWebPushConfigId) {
                SetNodeConfigArray(ClickedNodeId.toString(), ReturnWebPushConfigId, title);
                if ($.urlParam("WorkflowId") > 0) {
                    $.ajax({
                        url: "/Journey/SaveConfig/UpdateDate",
                        type: 'post',
                        dataType: 'json',
                        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkflowId': WorkflowId }),
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                        },
                    });
                }
            },
        });

    },
    CheckForWebPushCounselorTags: function (TemplateId) {
        WebPushTemplateCounselorTags = false;
        var WebpushTemplate = { Id: TemplateId };
        $.ajax({
            url: "/WebPush/Template/CheckCounselorTags",
            type: 'POST',
            data: JSON.stringify({ 'webpushTemplate': WebpushTemplate }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (response) {
                    WebPushTemplateCounselorTags = true;
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }

};

//App Push 
var AppPushDetails = {
    Validation: function () {
        if ($('#ddlapppush').get(0).selectedIndex == 0) {
            $('#ddlapppush').focus();
            ShowErrorMessage(GlobalErrorList.WorkFLow.AppPushTemplate);
            return false;
        }
        if (AppPushTemplateCounselorTags) {
            ShowErrorMessage(GlobalErrorList.WorkFLow.CounselorTags);
            return false;
        }

        else if ($('#ui_ChkRecuringmobileapp').prop('checked') == true) {
            if ($('#lblTriggerDaymobileapp').prop('checked') != true && $('#lblTriggerHourmobileapp').prop('checked') != true) {
                ShowErrorMessage(GlobalErrorList.WorkFLow.AppPushRecurring);
                return false;
            }
        }
        return true;
    },
    GetPushCampaigns: function () {
        $.ajax({
            url: "/Journey/CreateWorkflow/GetAppPushTemplateList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Action': 'GetPushCampaign' }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function () {
                    var optlist = document.createElement('option');
                    optlist.value = $(this)[0].Id;
                    optlist.text = $(this)[0].TemplateName;
                    document.getElementById("ddlapppush").options.add(optlist);
                    DropdownPreBind.push({ "Channel": "AppPush", "Id": $(this)[0].Id, "Text": $(this)[0].TemplateName });
                });
            },
            error: ShowAjaxError
        });
    },

    BindAppPushCampaigns: function (AllCampaigns) {
        if (AllCampaigns != null && AllCampaigns != undefined) {


            var activeCampaigns = JSLINQ(AllCampaigns).Where(function (item) { return item.Status == 1; }).Select(function (item) { return item; }).items
            var found = DropdownPreBind.filter(function (item) { return item.Channel === "AppPush"; });
            if (found.length != 0) {
                DropdownPreBind.splice(DropdownPreBind.findIndex(x => x.Channel == "AppPush"), found.length)
            }
            if (activeCampaigns.length > 0) {
                $.each(activeCampaigns, function () {
                    var optlist = document.createElement('option');
                    optlist.value = $(this)[0].Id;
                    optlist.text = $(this)[0].Name;
                    document.getElementById("ddlapppush").options.add(optlist);
                    DropdownPreBind.push({ "Channel": "AppPush", "Id": $(this)[0].Id, "Text": $(this)[0].Name });
                });

            }
        }
    },
    SaveAppPushConfig: function () {

        workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
        AppPushConfig = {};
        AppPushConfig.MobilePushTemplateId = $("#ddlapppush").val();
        AppPushConfig.CampaignType = 1;
        var title = $("#ddlapppush option:selected").text();
        var result = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Value)
        if (result != '') {
            AppPushConfig.ConfigureMobileId = parseInt(result);
        }
        if ($('#ui_ChkRecuringmobileapp').prop('checked') == true) {
            if ($('#lblTriggerDaymobileapp').prop('checked')) { recurringmobileappstatus = 1; }
            else if ($('#lblTriggerHourmobileapp').prop('checked')) { recurringmobileappstatus = 2; }
        }
        else recurringmobileappstatus = 0;
        AppPushConfig.IsTriggerEveryActivity = recurringmobileappstatus;
        $.ajax({
            url: "/Journey/SaveConfig/SaveAppPushConfig",
            type: 'post',
            dataType: 'json',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'AppPushConfig': AppPushConfig }),
            contentType: "application/json; charset=utf-8",
            success: function (ReturnAppPushConfigId) {
                SetNodeConfigArray(ClickedNodeId.toString(), ReturnAppPushConfigId, title);
                if ($.urlParam("WorkflowId") > 0) {
                    $.ajax({
                        url: "/Journey/SaveConfig/UpdateDate",
                        type: 'post',
                        dataType: 'json',
                        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkflowId': WorkflowId }),
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                        },
                    });
                }
            },
        });

    },
    CheckForAppPushCounselorTags: function (TemplateId) {
        AppPushTemplateCounselorTags = false;
        var MobilepushTemplate = { Id: TemplateId };
        $.ajax({
            url: "/MobilePushNotification/MobilePushTemplate/CheckCounselorTags",
            type: 'POST',
            data: JSON.stringify({ 'mobilepushTemplate': MobilepushTemplate }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (response) {
                    AppPushTemplateCounselorTags = true;
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
};

var WhatsappDetails = {
    GetWhatsappTemplateList: function () {
        $.ajax({
            url: "/CaptureForm/CommonDetailsForForms/GetWhatsAppTemplate",
            type: 'POST',
            data: JSON.stringify({}),
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response.Data, function () {
                    let optlist = document.createElement('option');
                    optlist.value = $(this)[0].Id;
                    optlist.text = $(this)[0].Name;
                    document.getElementById("ddlwhatsapp").options.add(optlist);
                    DropdownPreBind.push({ "Channel": "Whatsapp", "Id": $(this)[0].Id, "Text": $(this)[0].Name });
                });
                WhatsappDetails.GetWAConfigurations();
            },
            error: ShowAjaxError
        });
    },
    GetWAConfigurations: function () {
        $.ajax({
            url: "/WhatsApp/WhatsAppSettings/GetConfigurationNames",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var defaultId = 0;
                if (response != undefined && response != null) {
                    $("#ui_WAConfigurationName").empty();
                    $("#ui_WAConfigurationName").append(`<option value="0">Select Configuration Name</option>`);
                    $.each(response, function (i) {
                        $("#ui_WAConfigurationName").append("<option value='" + response[i].Id + "'>" + response[i].ConfigurationName + "</option>");
                        if (response[i].IsDefaultProvider)
                            defaultId = response[i].Id;
                    });
                    $("#ui_WAConfigurationName").select2().val(defaultId).change();
                }
            },
            error: ShowAjaxError
        });
    },
    CheckForWhatsappCounselorTags: function (TemplateId) {
        WhatsappTemplateCounselorTags = false;
        var whatsappTemplate = { Id: TemplateId };
        $.ajax({
            url: "/WhatsApp/WhatsAppTemplates/CheckCounselorTags",
            type: 'POST',
            data: JSON.stringify({ 'whatsappTemplate': whatsappTemplate }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (response) {
                    WhatsappTemplateCounselorTags = true;
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },

    Validation: function () {
        if ($('#ddlwhatsapp').get(0).selectedIndex == 0) {
            $('#ddlwhatsapp').focus();
            ShowErrorMessage(GlobalErrorList.WorkFLow.WhatsappTemplate);
            return false;
        }

        if ($('#ui_WAConfigurationName').get(0).selectedIndex == 0) {
            $('#ui_WAConfigurationName').focus();
            ShowErrorMessage(GlobalErrorList.WhatsAppSchedule.ConfigurationName);
            return false;
        }

        if (WhatsappTemplateCounselorTags) {
            ShowErrorMessage(GlobalErrorList.WorkFLow.CounselorTags);
            return false;
        }

        else if ($('#ui_ChkRecuringwhatsapp').prop('checked') == true) {
            if ($('#lblTriggerDaywhatsapp').prop('checked') != true && $('#lblTriggerHourwhatsapp').prop('checked') != true) {
                ShowErrorMessage(GlobalErrorList.WorkFLow.WhatsappRecurring);
                return false;
            }
        }
        return true;
    },
    SaveWhatsappConfig: function () {

        workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
        WhatsappConfig = {};
        WhatsappConfig.WhatsAppTemplateId = $("#ddlwhatsapp").val();
        WhatsappConfig.WhatsAppConfigurationNameId = $("#ui_WAConfigurationName").val();
        var title = $("#ddlwhatsapp option:selected").text();
        if ($('#ui_ChkRecuringwhatsapp').prop('checked') == true) {
            if ($('#lblTriggerDaywhatsapp').prop('checked')) { recurringwhatsappstatus = 1; }
            else if ($('#lblTriggerHourwhatsapp').prop('checked')) { recurringwhatsappstatus = 2; }
        }
        else recurringwhatsappstatus = 0;
        WhatsappConfig.IsTriggerEveryActivity = recurringwhatsappstatus;
        var result = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Value)
        if (result != '') {
            WhatsappConfig.ConfigureWhatsAppId = parseInt(result);
        }
        $.ajax({
            url: "/Journey/SaveConfig/SaveWhatsappConfig",
            type: 'post',
            dataType: 'json',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WhatsappConfig': WhatsappConfig }),
            contentType: "application/json; charset=utf-8",
            success: function (ReturnWhatsappConfigId) {
                SetNodeConfigArray(ClickedNodeId.toString(), ReturnWhatsappConfigId, title);
                if ($.urlParam("WorkflowId") > 0) {
                    $.ajax({
                        url: "/Journey/SaveConfig/UpdateDate",
                        type: 'post',
                        dataType: 'json',
                        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkflowId': WorkflowId }),
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                        },
                    });
                }
            },
            error: ShowAjaxError
        });
    },
};

//Date & Time
var dateAndTime = {
    Validation: function () {
        if ($('input[name=datetimetype]:checked').val() == "0") {
            if ($('#txttime').val().length == 0) {
                $('#txttime').focus();
                ShowErrorMessage(GlobalErrorList.WorkFLow.Interval);
                return false;
            }
        }
        else if ($('input[name=datetimetype]:checked').val() == "1") {

            if ($('#txtdateandtime1').val().length == 0) {
                $('#txtdateandtime1').focus();
                ShowErrorMessage(GlobalErrorList.WorkFLow.StartDate);
                return false;
            }

            if ($('#txtdateandtime2').val().length == 0) {
                $('#txtdateandtime2').focus();
                ShowErrorMessage(GlobalErrorList.WorkFLow.StopDate);
                return false;
            }
            var now = new Date();
            var selectedvalue = $('#txtdateandtime1').val() + " " + $('#ui_dllworkflowTime1').val() + ":" + $('#ui_dllworkflowMinute1').val() + ":00";
            var selecteddate = new Date(selectedvalue);
            if (selecteddate < now) {
                ShowErrorMessage(GlobalErrorList.WorkFLow.FutureStartDate);
                return false;
            }
            var selectedvalueto = $('#txtdateandtime2').val() + " " + $('#ui_dllworkflowTime2').val() + ":" + $('#ui_dllworkflowMinute2').val() + ":00";
            var selecteddateto = new Date(selectedvalueto);
            var diff = selecteddateto.getTime() - selecteddate.getTime();
            var datediff = Math.round(diff / 60000);
            if (selecteddateto < now || datediff < 60) {
                ShowErrorMessage(GlobalErrorList.WorkFLow.FutureStopDate);
                return false;
            }

        }
        else if ($('input[name=datetimetype]:checked').val() == "2") {
            let minutes = (parseInt($("#ui_dll_Time1").val()) * 60) + parseInt($("#ui_dll_Minute1").val());
            let minutes1 = (parseInt($("#ui_dll_Time2").val()) * 60) + parseInt($("#ui_dll_Minute2").val());
            if (minutes1 <= minutes) {
                ShowErrorMessage(GlobalErrorList.WorkFLow.FutureStopDate);
                return false;
            }
        }
        return true;
    },
    SaveDateTimeConfig: function () {
        workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
        var GetTimes = "";
        DatetimeConfig = {};
        var IsDynamicGroup = 0;

        if ($('input[name=datetimetype]:checked').val() == "0") {
            IsDynamicGroup = $('input[name=wrkflwAudiGrp]:checked').val();
            DateCondition = 0;
            GetTimes = $("#txttime").val() + " " + $("#ui_dlltimetype").find("option:selected").text();
            channel = {
                "Channel": ClickedNodeId.toString(),
                "Value": GetTimes.toString(),
                "DateCondition": DateCondition,
                "DaysOfWeek": "",
                "Title": GetTimes.toString(),
                "IsDynamicGroup": IsDynamicGroup,
            }
            if (WorkflowId > 0) {
                DatetimeConfig.Time = $("#txttime").val();
                DatetimeConfig.DateValue = '';
                DatetimeConfig.DateValueTo = '';
                DatetimeConfig.DateCondition = 0;
                DatetimeConfig.TimeType = GetTimes;
                DatetimeConfig.WorkFlowId = WorkflowId;
                DatetimeConfig.Date = ClickedNodeId.toString();
                DatetimeConfig.IsDynamicGroup = IsDynamicGroup;

                $.ajax({
                    url: "/Journey/CreateWorkflow/UpdateDateTime",
                    type: 'post',
                    dataType: 'json',
                    data: JSON.stringify({ 'accountId': Plumb5AccountId, 'DatetimeConfig': DatetimeConfig }),
                    contentType: "application/json; charset=utf-8",
                    success: function (ReturnDatetimeConfigId) {

                    },
                });
            }
            SetNodeConfigArray(ClickedNodeId.toString(), GetTimes, GetTimes.toString(), DateCondition, IsDynamicGroup);
            if ($.urlParam("WorkflowId") > 0) {
                $.ajax({
                    url: "/Journey/SaveConfig/UpdateDate",
                    type: 'post',
                    dataType: 'json',
                    data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkflowId': WorkflowId }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                    },
                });
            }
        }
        else if ($('input[name=datetimetype]:checked').val() == "1") {

            DateCondition = 4;
            DatetimeConfig.DateValue = $("#txtdateandtime1").val() + " " + $("#ui_dllworkflowTime1").val() + ":" + $("#ui_dllworkflowMinute1").val() + ":00";
            DatetimeConfig.DateValueTo = $("#txtdateandtime2").val() + " " + $("#ui_dllworkflowTime2").val() + ":" + $("#ui_dllworkflowMinute2").val() + ":00";


            var monthDetials = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var frm = new Date(DatetimeConfig.DateValue);
            a = new Date(frm);
            var to = new Date(DatetimeConfig.DateValueTo);
            b = new Date(to);

            SetDateTitle = "B/w " + a.getDate(frm) + ' ' + monthDetials[a.getMonth(frm)] + " to " + b.getDate(to) + ' ' + monthDetials[b.getMonth(to)]

            DateValue = workflowUtil.ChangeDateTimeFormat(frm) + "~" + workflowUtil.ChangeDateTimeFormat(to);

            channel = {
                "Channel": ClickedNodeId.toString(),
                "Value": DateValue.toString(),
                "DateCondition": DateCondition,
                "DaysOfWeek": "",
                "Title": GetTimes.toString(),
                "IsDynamicGroup": IsDynamicGroup,
            }
            if (WorkflowId > 0) {
                DatetimeConfig.Time = 0;
                DatetimeConfig.DateCondition = DateCondition;
                DatetimeConfig.TimeType = SetDateTitle;
                DatetimeConfig.WorkFlowId = WorkflowId;
                DatetimeConfig.Date = ClickedNodeId.toString();
                DatetimeConfig.IsDynamicGroup = IsDynamicGroup;
                $.ajax({
                    url: "/Journey/CreateWorkflow/UpdateDateTime",
                    type: 'post',
                    dataType: 'json',
                    data: JSON.stringify({ 'accountId': Plumb5AccountId, 'DatetimeConfig': DatetimeConfig }),
                    contentType: "application/json; charset=utf-8",
                    success: function (ReturnDatetimeConfigId) {
                    },
                });
            }
            SetNodeConfigArray(ClickedNodeId.toString(), DateValue, SetDateTitle, DateCondition, IsDynamicGroup);
            if ($.urlParam("WorkflowId") > 0) {
                $.ajax({
                    url: "/Journey/SaveConfig/UpdateDate",
                    type: 'post',
                    dataType: 'json',
                    data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkflowId': WorkflowId }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                    },
                });
            }
        }
        else if ($('input[name=datetimetype]:checked').val() == "2") {
            IsDynamicGroup = $('input[name=wrkflwAudiGrp]:checked').val();
            DateCondition = 8;
            SetDateTitle = "Slot B/w " + $("#ui_dll_Time1").val() + ":" + $("#ui_dll_Minute1").val() + " to " + $("#ui_dll_Time2").val() + ":" + $("#ui_dll_Minute2").val()

            DateValue = $("#ui_dll_Time1").val() + ":" + $("#ui_dll_Minute1").val() + "~" + $("#ui_dll_Time2").val() + ":" + $("#ui_dll_Minute2").val();

            channel = {
                "Channel": ClickedNodeId.toString(),
                "Value": DateValue.toString(),
                "DateCondition": DateCondition,
                "DaysOfWeek": $("#ui_dllDay").val(),
                "Title": GetTimes.toString(),
                "IsDynamicGroup": IsDynamicGroup,
            }
            if (WorkflowId > 0) {
                DatetimeConfig.Time = 0;
                DatetimeConfig.DateCondition = DateCondition;
                DatetimeConfig.TimeType = SetDateTitle;
                DatetimeConfig.WorkFlowId = WorkflowId;
                DatetimeConfig.Date = ClickedNodeId.toString();
                DatetimeConfig.IsDynamicGroup = IsDynamicGroup;
                DatetimeConfig.DaysOfWeek = $("#ui_dllDay").val();
                $.ajax({
                    url: "/Journey/CreateWorkflow/UpdateDateTime",
                    type: 'post',
                    dataType: 'json',
                    data: JSON.stringify({ 'accountId': Plumb5AccountId, 'DatetimeConfig': DatetimeConfig }),
                    contentType: "application/json; charset=utf-8",
                    success: function (ReturnDatetimeConfigId) {
                    },
                });
            }
            SetNodeConfigArray(ClickedNodeId.toString(), DateValue, SetDateTitle, DateCondition, IsDynamicGroup, '', $("#ui_dllDay").val());
            if ($.urlParam("WorkflowId") > 0) {
                $.ajax({
                    url: "/Journey/SaveConfig/UpdateDate",
                    type: 'post',
                    dataType: 'json',
                    data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkflowId': WorkflowId }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                    },
                });
            }
        }
        workflowUtil.dateandtimeClearFields();
    }
};

//Rules
var RuleDetails = {
    Validation: function () {
        if ($('#ddlruleId').get(0).selectedIndex == 0) {
            $('#ddlruleId').focus();
            ShowErrorMessage(GlobalErrorList.WorkFLow.Rule);
            return false;
        }
        return true;
    },
    BindRules: function () {
        $.ajax({
            url: "/Journey/SaveConfig/GetRuleDetails",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function () {
                    var optlist = document.createElement('option');
                    optlist.value = $(this)[0].RuleId;
                    optlist.text = $(this)[0].TriggerHeading;
                    optlist.title = $(this)[0].IsSplitTester;
                    document.getElementById("ddlruleId").options.add(optlist);
                    DropdownPreBind.push({ "Channel": "Rule", "Id": $(this)[0].RuleId, "Text": $(this)[0].TriggerHeading + "^" + $(this)[0].IsSplitTester });
                });
            },
            error: ShowAjaxError
        });
    },
    SaveRuleConfig: function () {
        workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
        var title = $("#ddlruleId option:selected").text() + "^" + $("#ddlruleId option:selected")[0].title;
        SetNodeConfigArray(ClickedNodeId.toString(), parseInt($("#ddlruleId").val()), title);
        if ($.urlParam("WorkflowId") > 0) {
            $.ajax({
                url: "/Journey/SaveConfig/UpdateDate",
                type: 'post',
                dataType: 'json',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkflowId': WorkflowId }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                },
            });
        }
        workflowUtil.segmentClearFields();
    }
};

var webHookDetails = {
    BindContactFields: function () {
        $.ajax({
            url: "/ManageContact/ContactImport/GetContactProperties",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    for (var i = 0; i < response.length; i++) {
                        ContactPropertyList.push({
                            'P5ColumnName': "CustomField" + (i + 1), 'FrontEndName': response[i].FieldName, 'FieldType': response[i].FieldType
                        });
                    }
                }

                if (ContactPropertyList != null && ContactPropertyList.length > 0) {
                    //To sort dropdown by alphabetical order **************
                    let field = 'FrontEndName';
                    ContactPropertyList.sort((a, b) => (a[field] || "").toString().localeCompare((b[field] || "").toString()));
                    //****************************************
                    for (var i = 0; i < ContactPropertyList.length; i++) {
                        $("#drpFields_0").append("<option value='" + ContactPropertyList[i].P5ColumnName + "'>" + ContactPropertyList[i].FrontEndName + "</option>");
                    }
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    GetPropertiesCustomFields: function () {
        $.ajax({
            url: "/ManageContact/ContactField/GetProperties",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                AllContactFieldsColumns = response;
            },
            error: ShowAjaxError
        });
    },
    ValidateDataFieldsandvalues: function (Id) {

        if ($("#trsearch" + Id).attr("datatype") == "Plumb5Field") {
            if ($("#drpFields_" + Id).get(0).selectedIndex == 0 && $("#txtFieldAnswer_" + Id).val() == "") {
                ShowErrorMessage(GlobalErrorList.WorkFLow.DataFieldValue_ErrorMessage);
                return false;
            }
            if ($("#drpFields_" + Id).get(0).selectedIndex == 0 && $("#txtFieldAnswer_" + Id).val() != "") {
                ShowErrorMessage(GlobalErrorList.WorkFLow.MappingField_ErrorMessage);
                return false;
            }
            if ($("#drpFields_" + Id).get(0).selectedIndex != 0 && $("#txtFieldAnswer_" + Id).val() == "") {
                ShowErrorMessage(GlobalErrorList.WorkFLow.DataField_ErrorMessage);
                return false;
            }
        }
        else if ($("#trsearch" + Id).attr("datatype") == "StaticField") {
            if ($("#txtFieldKey_" + Id).val() == "" && $("#txtFieldAnswer_" + Id).val() == "") {
                ShowErrorMessage(GlobalErrorList.WorkFLow.StaticDataFieldKey_ErrorMessage);
                return false;
            }

            if ($("#txtFieldKey_" + Id).val() == "" && $("#txtFieldAnswer_" + Id).val() != "") {
                $("#txtFieldKey_" + Id).focus();
                ShowErrorMessage(GlobalErrorList.WorkFLow.StaticDataFieldKey_ErrorMessage);
                return false;
            }

            if ($("#txtFieldKey_" + Id).val() != "" && $("#txtFieldAnswer_" + Id).val() == "") {
                $("#txtFieldAnswer_" + Id).focus();
                ShowErrorMessage(GlobalErrorList.WorkFLow.StaticDataFieldValue_ErrorMessage);
                return false;
            }

            //for (var i = 0; i < AllContactFieldsColumns.length; i++) {
            //    if ($.trim($("#txtFieldKey_" + Id).val()).toLowerCase().replace(/ /g, '') == AllContactFieldsColumns[i].toLowerCase()) {
            //        ShowErrorMessage(GlobalErrorList.WorkFLow.FieldAlreadyExists);
            //        $("#txtFieldKey_" + Id).focus();
            //        return false;
            //    }
            //}
        }
        return true;
    },
    ValidateHeaderFieldsAndValues: function (Id) {

        if ($("#txtheaderKey_" + Id).val() == "" && $("#txtheaderValue_" + Id).val() == "") {
            ShowErrorMessage(GlobalErrorList.WorkFLow.HeaderFieldKeyValue_ErrorMessage);
            return false;
        }

        if ($("#txtheaderKey_" + Id).val() == "" && $("#txtheaderValue_" + Id).val() != "") {
            $("#txtheaderKey_" + Id).focus();
            ShowErrorMessage(GlobalErrorList.WorkFLow.HeaderFieldKey_ErrorMessage);
            return false;
        }
        if ($("#txtheaderKey_" + Id).val() != "" && $("#txtheaderValue_" + Id).val() == "") {
            $("#txtheaderValue_" + Id).focus();
            ShowErrorMessage(GlobalErrorList.WorkFLow.HeaderFieldValue_ErrorMessage);
            return false;
        }
        return true;
    },
    Validation: function () {

        if ($('#ui_txtRequestUrl').val().length == 0) {
            $('#ui_txtRequestUrl').focus();
            ShowErrorMessage(GlobalErrorList.WorkFLow.WebHookEmptyRequestUrl);
            return false;
        }

        if (!regExpUrl.test($.trim($("#ui_txtRequestUrl").val()))) {
            $("#ui_txtRequestUrl").focus();
            ShowErrorMessage(GlobalErrorList.WorkFLow.RequestUrl_error);
            return false;
        }

        if ($('#ui_ddl_MethodType').get(0).selectedIndex == 0) {
            $('#ui_ddl_MethodType').focus();
            ShowErrorMessage(GlobalErrorList.WorkFLow.WebHookSelectMethodType);
            return false;
        }

        if ($('#ui_ddl_ContentType').get(0).selectedIndex == 0) {
            $('#ui_ddl_ContentType').focus();
            ShowErrorMessage(GlobalErrorList.WorkFLow.WebHookSelectContentType);
            return false;
        }

        if ($('#ui_txt_BasicAuthenticationKey').val().length > 0 && $('#ui_txt_BasicAuthenticationValue').val().length == 0) {
            $('#ui_txt_BasicAuthenticationKey').focus();
            ShowErrorMessage(GlobalErrorList.WorkFLow.WebHookBasicAuthenticationValueError);
            return false;
        }

        if ($('#ui_txt_BasicAuthenticationKey').val().length == 0 && $('#ui_txt_BasicAuthenticationValue').val().length > 0) {
            $('#ui_txt_BasicAuthenticationValue').focus();
            ShowErrorMessage(GlobalErrorList.WorkFLow.WebHookBasicAuthenticationKeyError);
            return false;
        }

        //This is for checking the data field validation key and value are same
        var datafieldtrList = $('[id^=trsearch]');
        var drpoption = new Array();
        var drpanswer = new Array();

        let ContentType = $('#ui_ddl_ContentType option:selected').text().toLowerCase();
        if (ContentType == 'form') {
            if (datafieldtrList.length <= 0) {
                ShowErrorMessage(GlobalErrorList.WorkFLow.DataFieldEmptyError);
                return false;
            }
        }
        else if (ContentType == 'raw body') {
            if ($.trim($("#ui_txtRequestBody").val()).length == 0) {
                $('#ui_txtRequestBody').focus();
                ShowErrorMessage(GlobalErrorList.WorkFLow.RequestBodyEmptyError);
                return false;
            }
        }

        for (var j = 0; j < datafieldtrList.length; j++) {
            var rowId = datafieldtrList[j].id.substring(8);

            if (webHookDetails.ValidateDataFieldsandvalues(rowId)) {

                if ($("#trsearch" + rowId).attr("datatype") == "Plumb5Field") {
                    if ($.inArray($("#drpFields_" + rowId + " option:selected").val(), drpoption) > -1 && $.inArray($("#txtFieldAnswer_" + rowId).val(), drpanswer) > -1) {
                        $("#drpFields_" + rowId).focus();
                        ShowErrorMessage(GlobalErrorList.WorkFLow.duplicatedatafields_ErrorMessage);
                        return false;
                    }
                    else {
                        drpoption.push($("#drpFields_" + rowId + " option:selected").val());
                        drpanswer.push($("#txtFieldAnswer_" + rowId).val());
                    }
                }
                else if ($("#trsearch" + rowId).attr("datatype") == "StaticField") {
                    if ($.inArray($("#txtFieldKey_" + rowId).val(), drpoption) > -1 && $.inArray($("#txtFieldAnswer_" + rowId).val(), drpanswer) > -1) {
                        $("#txtFieldKey_" + rowId).focus();
                        ShowErrorMessage(GlobalErrorList.WorkFLow.duplicatedatafields_ErrorMessage);
                        return false;
                    }
                    else {
                        drpoption.push($("#txtFieldKey_" + rowId).val());
                        drpanswer.push($("#txtFieldAnswer_" + rowId).val());
                    }
                }
            }
            else {
                return false;
            }
        }

        //This is for checking the header validation
        var headertrList = $('[id^=trheader]');
        var headerdrpoption = new Array();
        var headeranswer = new Array();

        for (var j = 0; j < headertrList.length; j++) {
            var rowId = headertrList[j].id.substring(8);

            if (webHookDetails.ValidateHeaderFieldsAndValues(rowId)) {
                if ($.inArray($("#txtheaderKey_" + rowId).val(), headerdrpoption) > -1 && $.inArray($("#txtheaderValue_" + rowId).val(), headeranswer) > -1) {
                    $("#txtheaderKey_" + rowId).focus();
                    ShowErrorMessage(GlobalErrorList.WorkFLow.DuplicateHeaderKeyfields_ErrorMessage);
                    return false;
                }
                else {
                    headerdrpoption.push($("#txtheaderKey_" + rowId).val());
                    headeranswer.push($("#txtheaderValue_" + rowId).val());
                }
            }
            else {
                return false;
            }
        }

        //This is for checking the data fields key having duplicates
        var trList = $('[id^=trsearch]');
        var drpselectedtext = new Array();

        for (var j = 0; j < trList.length; j++) {
            var rowId = trList[j].id.replace(/[^0-9]/gi, '');

            if ($("#trsearch" + rowId).attr("datatype") == "Plumb5Field") {
                if ($.inArray($("#drpFields_" + rowId + " option:selected").text(), drpselectedtext) > -1) {
                    $("#drpFields_" + rowId).focus();
                    ShowErrorMessage(GlobalErrorList.WorkFLow.duplicatedatafields_ErrorMessage);
                    return false;
                }
                else {
                    drpselectedtext.push($("#drpFields_" + rowId + " option:selected").text());
                }
            }
            else if ($("#trsearch" + rowId).attr("datatype") == "StaticField") {
                if ($.inArray($.trim($("#txtFieldKey_" + rowId).val()), drpselectedtext) > -1) {
                    $("#txtFieldKey_" + rowId).focus();
                    ShowErrorMessage(GlobalErrorList.WorkFLow.duplicatedatafields_ErrorMessage);
                    return false;
                }
                else {
                    drpselectedtext.push($.trim($("#txtFieldKey_" + rowId).val()));
                }
            }
        }

        //This is for checking the header field key having duplicates
        var headertrList = $('[id^=trheader]');
        var headerKeytext = new Array();

        for (var j = 0; j < headertrList.length; j++) {
            var rowId = headertrList[j].id.substring(8);

            if ($.inArray($("#txtheaderKey_" + rowId).val(), headerKeytext) > -1) {
                $("#txtheaderKey_" + rowId).focus();
                ShowErrorMessage(GlobalErrorList.WorkFLow.DuplicateHeaderKeyfields_ErrorMessage);
                return false;
            }
            else {
                headerKeytext.push($("#txtheaderKey_" + rowId).val());
            }
        }

        return true;
    },
    ValidateDuplicateinDropdown: function () {

        var trList = $('[id^=trsearch]');
        var drpselectedtext = new Array();
        var customselectedtext = new Array();

        for (var j = 0; j < trList.length; j++) {
            var rowId = trList[j].id.slice(-1);

            if ($("#trsearch" + rowId).attr("datatype") == "Plumb5Field") {
                if ($.inArray($("#drpFields_" + rowId + " option:selected").text(), drpselectedtext) > -1) {
                    $("#drpFields_" + rowId).focus();
                    ShowErrorMessage(GlobalErrorList.WorkFLow.duplicatedatafields_ErrorMessage);
                    return false;
                }
                else {
                    drpselectedtext.push($("#drpFields_" + rowId + " option:selected").text());
                }
            }
            else if ($("#trsearch" + rowId).attr("datatype") == "StaticField") {
                if ($.inArray($("#txtFieldKey_" + rowId).text(), customselectedtext) > -1) {
                    $("#txtFieldKey_" + rowId).focus();
                    ShowErrorMessage(GlobalErrorList.WorkFLow.duplicatedatafields_ErrorMessage);
                    return false;
                }
                else {
                    customselectedtext.push($("#txtFieldKey_" + rowId).text());
                }
            }
        }
        return true;
    },
    SaveWebHookDetails: function () {

        //workflowUtil.GeneralBinding(NodeText, ClickedNodeId);

        datamappingdetails = new Object();
        headerdetails = new Object();
        var basicauthenticationdetails = { AuthenticationKey: "", AuthenticationValue: "" };
        var webhookdetails = { ConfigureWebHookId: 0, RequestURL: "", MethodType: 0, ContentType: 0, FieldMappingDetails: "", Headers: "", BasicAuthentication: 0, RawBody: "" };

        //if (!webHookDetails.ValidateDuplicateinDropdown()) {
        //    HidePageLoading();
        //    return;
        //}

        var datamappingdetails = new Array();

        var fieldtrList = $('[id^=trsearch]');

        for (var i = 0; i < fieldtrList.length; i++) {
            var filterConditions = { Key: "", Value: "", IsPlumb5OrCustomField: "" };

            var rowId = fieldtrList[i].id.substring(8);

            if ($("#trsearch" + rowId).attr("datatype") == "Plumb5Field") {
                if ($("#drpFields_" + rowId + " option:selected").val() != undefined) {
                    filterConditions.Key = CleanText($("#txtFieldAnswer_" + rowId).val());
                    filterConditions.Value = $("#drpFields_" + rowId + " option:selected").val();
                    filterConditions.IsPlumb5OrCustomField = "Plumb5Field";

                    datamappingdetails.push(filterConditions);
                }
            }
            else if ($("#trsearch" + rowId).attr("datatype") == "StaticField") {
                if ($("#txtFieldKey_" + rowId).val() != null && $("#txtFieldKey_" + rowId).val() != "" && $("#txtFieldKey_" + rowId).val().length > 0) {
                    filterConditions.Key = CleanText($("#txtFieldKey_" + rowId).val());
                    filterConditions.Value = CleanText($("#txtFieldAnswer_" + rowId).val());
                    filterConditions.IsPlumb5OrCustomField = "StaticField";

                    datamappingdetails.push(filterConditions);
                }
            }

            //if ($("#drpFields_" + rowId + " option:selected").val() != undefined) {
            //    filterConditions.Key = $("#drpFields_" + rowId + " option:selected").val();
            //    filterConditions.Value = CleanText($("#txtFieldAnswer_" + rowId).val());

            //    datamappingdetails.push(filterConditions);
            //}
        }

        var headerdetails = new Array();

        var headertrList = $('[id^=trheader]');

        for (var i = 0; i < headertrList.length; i++) {
            var headerfilterConditions = { Key: "", Value: "" };

            var rowId = headertrList[i].id.substring(8);

            if ($("#txtheaderKey_" + rowId + "").val() != "") {
                headerfilterConditions.Key = CleanText($("#txtheaderKey_" + rowId).val());
                headerfilterConditions.Value = CleanText($("#txtheaderValue_" + rowId).val());

                headerdetails.push(headerfilterConditions);
            }
        }

        webhookdetails.Headers = JSON.stringify(headerdetails);

        if ($('#ui_txt_BasicAuthenticationKey').val().length > 0 && $('#ui_txt_BasicAuthenticationValue').val().length > 0) {
            basicauthenticationdetails.AuthenticationKey = $('#ui_txt_BasicAuthenticationKey').val();
            basicauthenticationdetails.AuthenticationValue = $('#ui_txt_BasicAuthenticationValue').val();
        }

        webhookdetails.RequestURL = $.trim($("#ui_txtRequestUrl").val());
        webhookdetails.MethodType = $.trim($("#ui_ddl_MethodType").val());
        webhookdetails.ContentType = $.trim($("#ui_ddl_ContentType").val());

        let contenttype = $('#ui_ddl_ContentType option:selected').text().toLowerCase();
        if (contenttype == 'form') {
            webhookdetails.FieldMappingDetails = JSON.stringify(datamappingdetails);
        }
        else if (contenttype == 'raw body') {
            webhookdetails.RawBody = $.trim($("#ui_txtRequestBody").val());
        }

        webhookdetails.BasicAuthentication = JSON.stringify(basicauthenticationdetails);

        var title = $.trim($("#ui_txtRequestUrl").val());

        if ($.trim($("#ui_txtRequestUrl").val()).length > 50) {
            title = $.trim($("#ui_txtRequestUrl").val()).substring(0, 49);
        }

        var result = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Value)
        if (result != '') {
            webhookdetails.ConfigureWebHookId = parseInt(result);
        }

        window.console.log(webhookdetails);

        $.ajax({
            url: "/Journey/SaveConfig/SaveWebHookConfigDetails",
            type: 'post',
            dataType: 'json',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'webhookConfig': webhookdetails }),
            contentType: "application/json; charset=utf-8",
            success: function (ReturnWebHookConfigId) {
                SetNodeConfigArray(ClickedNodeId.toString(), ReturnWebHookConfigId, title);
                if ($.urlParam("WorkflowId") > 0) {
                    $.ajax({
                        url: "/Journey/SaveConfig/UpdateDate",
                        type: 'post',
                        dataType: 'json',
                        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkflowId': WorkflowId }),
                        contentType: "application/json; charset=utf-8",
                        success: function (result) {
                        },
                    });
                }
            },
        });
        workflowUtil.webhookClearFields();
    },
};

//supporting function for arrangeing nodes 
function bindChannel() {
    if (allchannel.filter(x => x.Channel === channelName && x.Segment == Segment && x.Rules == Rule && x.Date == DateTime).length == 0) {
        var getchannel = {
            "WorkflowId": WorkflowId,
            "Channel": channelName,
            "ConfigId": getchannelvalue(ArrayConfig, channelName),
            "ConfigName": getchannelTitle(ArrayConfig, channelName),
            "Segment": Segment,
            "SegmentId": getchannelvalue(ArrayConfig, Segment),
            "SegmentName": getchannelTitle(ArrayConfig, Segment),
            "Rules": Rule,
            "RulesId": getchannelvalue(ArrayConfig, Rule),
            "RuleType": RuleType,
            "RulestName": getchannelTitle(ArrayConfig, Rule),
            "PreChannel": PreNode,
            "PreConfigId": getchannelvalue(ArrayConfig, PreNode),
            "Condition": Condition,
            "Date": DateTime,
            "DateValue": getchannelvalue(ArrayConfig, DateTime),
            "DateCondition": getDatecondition(ArrayConfig, DateTime),
            "DaysOfWeek": getDaysOfWeek(ArrayConfig, DateTime),
            "IsDynamicGroup": getIsDynamicGroup(ArrayConfig, DateTime)
        }

        allchannel.push(getchannel);
    }
}
function getchannelvalue(allchannel, channelvalue) {
    if (channelvalue != undefined && channelvalue != null) {
        var r = ArrayConfig.filter(x => x.Channel === channelvalue.toString()).map(x => x.Value);
        if (channelvalue.toString().indexOf("dateandtime") > -1 || channelvalue.toString().indexOf("segment") > -1) { return (r != "" ? r : "0").toString(); }
        else { return parseInt(r != "" ? r : 0); }
    } else { return 0; }
}
function getDatecondition(allchannel, channel) {
    var r = ArrayConfig.filter(x => x.Channel === channel.toString()).map(x => x.Datecondition);
    return (r != "" ? r : "0").toString();
}
function getDaysOfWeek(allchannel, channel) {
    var r = ArrayConfig.filter(x => x.Channel === channel.toString()).map(x => x.DaysOfWeek);
    return (r != "" ? r : "0").toString();
}
function getIsDynamicGroup(allchannel, channel) {
    var r = ArrayConfig.filter(x => x.Channel === channel.toString()).map(x => x.IsDynamicGroup);
    return (r != "" ? r : "0").toString();
}
function getchannelTitle(allchannel, channel) {
    var r = ArrayConfig.filter(x => x.Channel === channel.toString()).map(x => x.Title);
    return (r != "" ? r : "0").toString();
}
function getprenodeinfo(node) {
    var result = 0;
    var found = flowChartdata.connections.filter(function (item) { return item.TargetId === node.toString(); });
    for (var n = 0; n < found.length; n++) {
        Segment = found[n].SourceId.indexOf("state_segment_") > -1 ? found[n].SourceId : Segment;
        Rule = found[n].SourceId.indexOf("state_rule_") > -1 ? found[n].SourceId : Rule;
        RuleType = found[n].SourceId.indexOf("state_rule_") > -1 ? found[n].RelationWithParent.toLowerCase().indexOf('not') == -1 ? 1 : 0 : RuleType;
        DateTime = found[n].SourceId.indexOf("state_dateandtime_") > -1 ? found[n].SourceId : DateTime;
        //Goal = found[n].SourceId.indexOf("state_goal_") > -1 ? found[n].SourceId : Goal;
        //Alert = found[n].SourceId.indexOf("state_alert_") > -1 ? found[n].SourceId : Alert;

        if (containsAny(found[n].SourceId, defaultchannels)) {
            PreNode = found[n].SourceId; Condition = found[n].RelationWithParent;
            chkchannel = 1;
        }
        if (chkchannel == 0) { getprenodeinfo(found[n].SourceId); }
        bindChannel();
        result = 1;
    }
    return result;
}
function getprechannelinfo(node, condition) {
    if (containsAny(node, defaultchannels)) {
        return [node, condition];
    }
}
function containsAny(str, substrings) {
    if (str) {
        for (var i = 0; i != substrings.length; i++) {
            var substring = substrings[i];
            if (str.indexOf(substring) != -1) {
                return substring;
            }
        }
    }
    return null;
}
function RemoveData(data) {
    data = $.trim(data);
    $("#" + data).remove();
}
function SetNodeConfigArray(nodeid, value, title, Datecondition, IsDynamicGroup, TitleId, DaysOfWeek) {

    var chanelname = nodeid.replace('state_', '').split('_')[0];
    var showTitle = JSLINQ(DropdownPreBind).Where(function (item) { return item.Channel.toLowerCase() == chanelname && item.Id == TitleId; }).Select(function (item) { return item.Text; }).items[0];
    if (showTitle == undefined) {
        showTitle = title; showTitle = showTitle.charAt(0).toUpperCase() + showTitle.slice(1);
        $("#title" + nodeid).text(showTitle.length > 25 ? showTitle.substring(0, 25) + ".." : showTitle);


    }
    if (showTitle.indexOf("~") > -1) {
        // getGroupCount(value, title, nodeid);
    }
    else {
        showTitle = showTitle.charAt(0).toUpperCase() + showTitle.slice(1);
        if (showTitle.indexOf("^1") > -1) {
            $('#imgabrule' + nodeid).css("display", "block");
        }
        showTitle = showTitle.replace("^0", "").replace("^1", "");
        showTitle = showTitle.charAt(0).toUpperCase() + showTitle.slice(1);
        $("#title" + nodeid).text(showTitle.length > 25 ? showTitle.substring(0, 25) + ".." : showTitle);
    }

    channel = {
        "Channel": nodeid.toString(),
        "Value": value,
        "Title": title,
        "Datecondition": Datecondition,
        "DaysOfWeek": DaysOfWeek,
        "TitleId": TitleId,
        "IsDynamicGroup": IsDynamicGroup
    }

    var found = ArrayConfig.filter(function (item) { return item.Channel === nodeid.toString(); });
    if (found.length == 0) {
        ArrayConfig.push(channel);
    }
    else {
        ArrayConfig.splice(ArrayConfig.findIndex(x => x.Channel == nodeid.toString()), 1)
        ArrayConfig.push(channel);
    }

}

//All click Event 
$("#btnsavemaildetails").click(function () {
    ShowPageLoading();
    if (mailDetails.Validation()) {
        mailDetails.SaveMailConfig();
        $(this).parents(".popupcontainer").addClass("hideDiv");
    }
    HidePageLoading();
});

$("#btnSaveSms").click(function () {
    ShowPageLoading();
    if (smsDetails.Validation()) {
        smsDetails.SaveSmsConfig();
        $(this).parents(".popupcontainer").addClass("hideDiv");
    }
    HidePageLoading();
});

$("#btndateandtime").click(function () {
    ShowPageLoading();
    if (dateAndTime.Validation()) {
        dateAndTime.SaveDateTimeConfig();
        $(this).parents(".popupcontainer").addClass("hideDiv");
    }
    HidePageLoading();
});

$("#btnSaveRule").click(function () {
    ShowPageLoading();
    if (RuleDetails.Validation()) {
        RuleDetails.SaveRuleConfig();
        $(this).parents(".popupcontainer").addClass("hideDiv");
    }
    HidePageLoading();
});

$("#btnSavewebpush").click(function () {
    ShowPageLoading();
    if (WebPushDetails.Validation()) {
        WebPushDetails.SaveWebPushConfig();
        $(this).parents(".popupcontainer").addClass("hideDiv");
    }
    HidePageLoading();
});

$("#btnSaveapppush").click(function () {
    ShowPageLoading();
    if (AppPushDetails.Validation()) {
        AppPushDetails.SaveAppPushConfig();
        $(this).parents(".popupcontainer").addClass("hideDiv");
    }
    HidePageLoading();
});

$("#btnSavewhatsapp").click(function () {
    ShowPageLoading();
    if (WhatsappDetails.Validation()) {
        WhatsappDetails.SaveWhatsappConfig();
        $(this).parents(".popupcontainer").addClass("hideDiv");
    }
    HidePageLoading();
});

$('#btnSave').on('click', function () {
    ShowPageLoading();
    CloseEditTitle();
    if (!CheckMailOrSmsConfiguration()) {
        HidePageLoading();
        return;
    }

    if (workflowUtil.flowValidation() == 1) {
        workflowUtil.SaveFlowchart();
    }
    HidePageLoading();
});

$('#btnSavedraft').on('click', function () {
    ShowPageLoading();
    CloseEditTitle();
    workflowUtil.WorkflowDraft();
    HidePageLoading();
});

function CheckMailOrSmsConfiguration() {
    if (ArrayConfig != undefined && ArrayConfig != null && ArrayConfig.length > 0) {
        for (let i = 0; i < ArrayConfig.length; i++) {
            if (ArrayConfig[i].Channel.toLowerCase().indexOf("sms") > 0) {
                if (!IsSmsSettingIsDone) {
                    ShowErrorMessage("The SMS setting is not configured");
                    return false;
                }
            }

            if (ArrayConfig[i].Channel.toLowerCase().indexOf("mail") > 0) {
                if (!IsMailSettingIsDone) {
                    ShowErrorMessage("The Mail setting is not configured");
                    return false;
                }
            }
        }
    }
    return true;
}

function CloseEditTitle() {
    $('#ui_txtWorkFlowTitle').val(PreTitle);
    $("#editicn").removeClass("fa fa-check").addClass("fa fa-pencil");
    $(".addidentitxtbx").attr("disabled", "disabled");
}

$(".addidentiwrp .fa-pencil").click(function () {
    ShowPageLoading();
    if ($("#editicn").hasClass("fa-check")) {
        if ($('#ui_txtWorkFlowTitle').val() != PreTitle) {
            if (WorkFlowBasicUtil.ValidateTitle()) {
                WorkFlowBasicDetails.Title = CleanText($("#ui_txtWorkFlowTitle").val());
                WorkFlowBasicDetails.Status = 2;
                WorkFlowBasicDetails.ArrayConfig = JSON.stringify(ArrayConfig);
                if (WorkflowId != 0) { WorkFlowBasicDetails.WorkflowId = WorkflowId; }
                else { WorkFlowBasicDetails.WorkflowId = 0; }
                $.ajax({
                    url: "/Journey/CreateWorkflow/CheckWorkflowTitle",
                    type: 'POST',
                    data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkFlowBasicDetails': WorkFlowBasicDetails }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        if (response == 1) {
                            WorkFlowBasicUtil.SaveWorkFlowTitle();
                        } else {
                            ShowErrorMessage(GlobalErrorList.WorkFLow.TitleExist);
                        }
                    }
                });
            }
        }
        $("#editicn").removeClass("fa fa-check").addClass("fa fa-pencil");
        $(".addidentitxtbx").attr("disabled", "disabled");
    } else {
        $("#editicn").removeClass("fa fa-pencil").addClass("fa fa-check");
        $(".addidentitxtbx").removeAttr("disabled").focus();
    }
    HidePageLoading();
});

//Open controls and channels
$(".wrkflwacttabitem").click(function () {
    let checktabcontid = $(this).attr("data-tabcontent");
    $(".wrkflwactcontwrp").addClass("hideDiv");
    $(".wrkflwacttabitem").removeClass("active");
    $(this).addClass("active");
    $("#" + checktabcontid).removeClass("hideDiv");
});

//partial view Pop-up open and close
$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
});

//get selected groups is and assign to variable of GroupIds
$(document.body).on('click', 'input[type="checkbox"]', function (event) {
    if ($(this).attr('name') == "group") {
        if ($(this).is(":checked")) {
            var groupId = $(this).val();
            GroupIds.push(groupId);
        }
    }
});

//open wait for or next one in datetime pop-up
$('input[name="datetimetype"]').click(function () {
    let getwrkflwdatetype = $('input[name="datetimetype"]:checked').val();
    if (getwrkflwdatetype == "1") {
        $(".wrkflwwaitforwrp").addClass("hideDiv");
        $(".wrkflwwaitforslot").addClass("hideDiv");
        $(".wrkflwproceedstepwrp").removeClass("hideDiv");
        $(".staticgroup").addClass("hideDiv");
    }
    else if (getwrkflwdatetype == "2") {
        $(".wrkflwwaitforwrp").addClass("hideDiv");
        $(".wrkflwproceedstepwrp").addClass("hideDiv");
        $(".wrkflwwaitforslot").removeClass("hideDiv");
        $(".staticgroup").removeClass("hideDiv");
    } else {
        $(".wrkflwproceedstepwrp").addClass("hideDiv");
        $(".wrkflwwaitforslot").addClass("hideDiv");
        $(".wrkflwwaitforwrp").removeClass("hideDiv");
        $(".staticgroup").removeClass("hideDiv");
    }
});

$("#txtdateandtime1,#txtdateandtime2").datepicker({
    defaultDate: "+1d",
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: false,
    minDate: new Date()
});

function CheckDuplicateConfigIdPresent() {
    let IsMail = false, IsSms = false, IsWebPush = false, IsAppPush = false, IsWebHook = false;
    if (ArrayConfig != undefined && ArrayConfig != null && ArrayConfig.length > 0) {
        //Mail
        let MailNodes = JSLINQ(ArrayConfig).Where(function (item) { return item.Channel.includes("mail") }).items;
        if (MailNodes != undefined && MailNodes != null && MailNodes.length > 0) {
            for (let i = 0; i < MailNodes.length; i++) {
                let MailDuplicatePresent = JSLINQ(MailNodes).Where(function (item) { return parseInt(item.Value) == parseInt(MailNodes[i].Value) }).items;
                if (MailDuplicatePresent != undefined && MailDuplicatePresent != null && MailDuplicatePresent.length > 1) {
                    IsMail = true;
                    break;
                }
            }
        }

        //Sms
        let SmsNodes = JSLINQ(ArrayConfig).Where(function (item) { return item.Channel.includes("sms") }).items;
        if (SmsNodes != undefined && SmsNodes != null && SmsNodes.length > 0) {
            for (let i = 0; i < SmsNodes.length; i++) {
                let SmsDuplicatePresent = JSLINQ(SmsNodes).Where(function (item) { return parseInt(item.Value) == parseInt(SmsNodes[i].Value) }).items;
                if (SmsDuplicatePresent != undefined && SmsDuplicatePresent != null && SmsDuplicatePresent.length > 1) {
                    IsSms = true;
                    break;
                }
            }
        }

        //WebPush
        let WebPushNodes = JSLINQ(ArrayConfig).Where(function (item) { return item.Channel.includes("webpush") }).items;
        if (WebPushNodes != undefined && WebPushNodes != null && WebPushNodes.length > 0) {
            for (let i = 0; i < WebPushNodes.length; i++) {
                let WebPushDuplicatePresent = JSLINQ(WebPushNodes).Where(function (item) { return parseInt(item.Value) == parseInt(WebPushNodes[i].Value) }).items;
                if (WebPushDuplicatePresent != undefined && WebPushDuplicatePresent != null && WebPushDuplicatePresent.length > 1) {
                    IsWebPush = true;
                    break;
                }
            }
        }

        //AppPush
        let AppPushNodes = JSLINQ(ArrayConfig).Where(function (item) { return item.Channel.includes("apppush") }).items;
        if (AppPushNodes != undefined && AppPushNodes != null && AppPushNodes.length > 0) {
            for (let i = 0; i < AppPushNodes.length; i++) {
                let AppPushDuplicatePresent = JSLINQ(AppPushNodes).Where(function (item) { return parseInt(item.Value) == parseInt(AppPushNodes[i].Value) }).items;
                if (AppPushDuplicatePresent != undefined && AppPushDuplicatePresent != null && AppPushDuplicatePresent.length > 1) {
                    IsAppPush = true;
                    break;
                }
            }
        }

        //WebHook
        let WebHookNodes = JSLINQ(ArrayConfig).Where(function (item) { return item.Channel.includes("webhook") }).items;
        if (WebHookNodes != undefined && WebHookNodes != null && WebHookNodes.length > 0) {
            for (let i = 0; i < WebHookNodes.length; i++) {
                let WebHookDuplicatePresent = JSLINQ(WebHookNodes).Where(function (item) { return parseInt(item.Value) == parseInt(WebHookNodes[i].Value) }).items;
                if (WebHookDuplicatePresent != undefined && WebHookDuplicatePresent != null && WebHookDuplicatePresent.length > 1) {
                    IsWebHook = true;
                    break;
                }
            }
        }
    }

    if (IsMail || IsSms || IsWebPush || IsAppPush || IsWebHook)
        return true;
    else
        return false;
}

var zoomin = 1;
function Zooming(type) {
    if (type == 1) { zoomin = zoomin + .1 } else { zoomin = zoomin - .1 }
    $("#flowchart").css({
        "zoom": zoomin
    });
}



$("#ddlfromemailId").change(function () {
    if ($("#ddlfromemailId option:selected").val() != undefined && $("#ddlfromemailId option:selected").val() != null && $("#ddlfromemailId option:selected").val() != "0") {
        let ReplyTo = $("#ddlfromemailId option:selected").val();
        $("#txtReplyemailid").val(ReplyTo);
    }
    else {
        $("#txtReplyemailid").val("");
    }
});



$("#createConfirm").click(function () {
    workflowUtil.SaveFinalPublishData(final_data, final_flowChartJson, final_ArrayConfig);
});



//Validating Counselor Tags
//Mail
$("#ddlmailtempId").change(function () {
    if ($('#ddlmailtempId').get(0).selectedIndex > 0)
        mailDetails.CheckForMailCounselorTags($('#ddlmailtempId').val())
});

//Sms

$("#ddlsmstempId").change(function () {
    if ($('#ddlsmstempId').get(0).selectedIndex > 0)
        smsDetails.CheckForSmsCounselorTags($('#ddlsmstempId').val())
});

//WebPush
$("#ddlwebpush").change(function () {
    if ($('#ddlwebpush').get(0).selectedIndex > 0)
        WebPushDetails.CheckForWebPushCounselorTags($('#ddlwebpush').val())
});

//AppPush
$("#ddlapppush").change(function () {
    if ($('#ddlapppush').get(0).selectedIndex > 0)
        AppPushDetails.CheckForAppPushCounselorTags($('#ddlapppush').val())
});

//Whatsapp
$("#ddlwhatsapp").change(function () {
    if ($('#ddlwhatsapp').get(0).selectedIndex > 0)
        WhatsappDetails.CheckForWhatsappCounselorTags($('#ddlwhatsapp').val())
});

//WebHook Saving Part

$("#btnsavewebhookdetails").click(function () {
    ShowPageLoading();
    if (webHookDetails.Validation()) {
        webHookDetails.SaveWebHookDetails();
        $(this).parents(".popupcontainer").addClass("hideDiv");
    }
    HidePageLoading();
});

//var trelementcount = 1;
//$(".adddatafild").click(function () {
//    var trList = $('[id^=trsearch]').last();
//    trelementcount = trList[0].id.slice(-1);
//    trelementcount = parseInt(trelementcount) + 1;

//    if (!webHookDetails.ValidateDataFieldsandvalues(trelementcount - 1)) {
//        return;
//    }

//    let lmsaddrepfild = `<div id="trsearch${trelementcount}">
//                         <div class="datawrkflwinpt mb-3">
//                         <div class="datainptitemwrp w-45 mr-2">
//                         <select class="form-control select2p5drpdwn" name="" id="drpFields_${trelementcount}"
//                         data-placeholder="Add Fields">
//                         </select>
//                         </div>
//                         <div class="datainptitemwrp w-45">
//                         <input type="text" name="" class="form-control form-control-sm" id="txtFieldAnswer_${trelementcount}">
//                         </div>
//                         <i class="icon ion-ios-close-outline clsedatawrkflw"></i>
//                         </div>
//                         </div>`;

//    $(lmsaddrepfild).insertBefore(this);
//    $("#drpFields_" + trelementcount).html($('#drpFields_0').html());
//    clsedatawrkflwfild();
//    //myselectdrp();
//});

clsedatawrkflwfild = () => {
    $(".clsedatawrkflw").click(function () {

        $(this).parent().remove();

        if ($(".adddatafildwrp").html().length <= 0) {
            trelementcount = 0;
        }

        if ($(".addheaderfildwrp").html().length <= 0) {
            trheaderelementcount = 0;
        }
    });
};

myselectdrp = function () {
    $(".select2p5drpdwn").select2({
        minimumResultsForSearch: "",
        dropdownAutoWidth: false,
        containerCssClass: "border",
    });
};

var trheaderelementcount = 0;
$(".addheaderfild").click(function () {

    if (trheaderelementcount != 0) {
        var trList = $('[id^=trheader]').last();
        trheaderelementcount = trList[0].id.slice(-1);
        trheaderelementcount = parseInt(trheaderelementcount) + 1;

        if (!webHookDetails.ValidateHeaderFieldsAndValues(trheaderelementcount - 1)) {
            return;
        }
    }

    let getheaderfilditem = `<div id="trheader${trheaderelementcount}" class="datawrkflwinpt mb-3">
                                <div class="datainptitemwrp w-45 mr-2">
                                    <input type="text" name="" class="form-control" id="txtheaderKey_${trheaderelementcount}">
                                </div>
                                <div class="datainptitemwrp w-45">
                                    <input type="text" name="" class="form-control" id="txtheaderValue_${trheaderelementcount}">
                                </div>
                                <i class="icon ion-ios-close-outline clsedatawrkflw"></i>
                            </div>`;


    $(".addheaderfildwrp").append(getheaderfilditem);
    clsedatawrkflwfild();

    if (trheaderelementcount == 0) {
        trheaderelementcount = trheaderelementcount + 1;
    }

    //let getheaderfilditem = `<div id="trheader${trheaderelementcount}">
    //                        <div class="datawrkflwinpt mb-3">
    //                        <div class="datainptitemwrp w-45 mr-2">
    //                        <input type="text" name="" class="form-control" id="txtheaderKey_${trheaderelementcount}">
    //                        </div>
    //                        <div class="datainptitemwrp w-45">
    //                        <input type="text" name="" class="form-control" id="txtheaderValue_${trheaderelementcount}">
    //                        </div>
    //                        <i class="icon ion-ios-close-outline clsedatawrkflw"></i>
    //                        </div>
    //                       </div>`;

    //$(getheaderfilditem).insertBefore(this);
    //clsedatawrkflwfild();
    //myselectdrp();
});

//WebHook End

$('#ddlmailtempId,#ddlsmstempId,#ddlwebpush,#ddlapppush,#ddlruleId,#ddlwhatsapp,#ui_ddl_SmsConfigName,#ui_MailConfigurationName,#ui_WAConfigurationName').select2({
    placeholder: 'This is my placeholder',
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
    containerCssClass: 'dropdownactiv'
});

$('input[type=radio][name=wrkflwsmstype]').change(function () {
    smsDetails.BindSMSTemplateByType();
});

$("#ddlmailtempId").change(function () {
    let MailTemplateId = $(this).val();
    let SubjectLineList = JSLINQ(AllMailTemplateList).Where(function (item) { return item.Id == parseInt(MailTemplateId); }).Select(function (item) { return item; }).items
    if (SubjectLineList != undefined && SubjectLineList != null && SubjectLineList.length > 0) {
        if (SubjectLineList[0].SubjectLine != undefined && SubjectLineList[0].SubjectLine != null && SubjectLineList[0].SubjectLine.length > 0)
            $("#txtmailsubject").val(SubjectLineList[0].SubjectLine);
        else
            $("#txtmailsubject").val("");
    } else {
        $("#txtmailsubject").val("");
    }
});

//Start of Web Hook Implementation Plumb5 Field and Custom Field Add

var trelementcount = 0;
$(".adddatafild").click(function () {
    if (trelementcount != 0) {
        var trList = $('[id^=trsearch]').last();
        trelementcount = trList[0].id.slice(-1);
        trelementcount = parseInt(trelementcount) + 1;

        if (!webHookDetails.ValidateDataFieldsandvalues(trelementcount - 1)) {
            return;
        }
    }

    var Plumb5FieldDropDown = "<option value='0'>Select</option>";

    for (var i = 0; i < ContactPropertyList.length; i++) {
        Plumb5FieldDropDown = Plumb5FieldDropDown + '<option value="' + ContactPropertyList[i].P5ColumnName + '">' + ContactPropertyList[i].FrontEndName + '</option>';
    }

    let getdatafildhmtl = `<div id="trsearch${trelementcount}" datatype="Plumb5Field" class="datawrkflwinpt mb-3">
                                <div class="datainptitemwrp w-45 mr-2">
                                   <input type="text" name="" class="form-control" id="txtFieldAnswer_${trelementcount}">
                                </div>
                                <div class="datainptitemwrp w-45">
                                    <select name="" class="form-control addCampName" id="drpFields_${trelementcount}" data-placeholder="Add Fields">
                                        ${Plumb5FieldDropDown}
                                    </select>                                    
                                </div>
                                <i class="icon ion-ios-close-outline clsedatawrkflw"></i>
                            </div>`;

    //$("#btndatadetails").html("Plumb5 Field");
    $(".adddatafildwrp").append(getdatafildhmtl);
    clsedatawrkflwfild();
    LoadSearchBox(trelementcount);

    if (trelementcount == 0) {
        trelementcount = trelementcount + 1;
    }
});
function LoadSearchBox(serial) {
    $(`#drpFields_${serial}`).select2({
        minimumResultsForSearch: '',
        dropdownAutoWidth: false
    });
}

$(".adddatacustfild").click(function () {
    if (trelementcount != 0) {
        var trList = $('[id^=trsearch]').last();
        trelementcount = trList[0].id.slice(-1);
        trelementcount = parseInt(trelementcount) + 1;

        if (!webHookDetails.ValidateDataFieldsandvalues(trelementcount - 1)) {
            return;
        }
    }

    let getdatafildhmtl = `<div id="trsearch${trelementcount}" datatype="StaticField" class="datawrkflwinpt mb-3">
                                <div class="datainptitemwrp w-45 mr-2">
                                    <input type="text" name="" class="form-control" id="txtFieldKey_${trelementcount}">
                                </div>
                                <div class="datainptitemwrp w-45">
                                    <input type="text" name="" class="form-control" id="txtFieldAnswer_${trelementcount}">
                                </div>
                                <i class="icon ion-ios-close-outline clsedatawrkflw"></i>
                            </div>`;

    // $("#btndatadetails").html("Custom Field");
    $(".adddatafildwrp").append(getdatafildhmtl);
    clsedatawrkflwfild();

    if (trelementcount == 0) {
        trelementcount = trelementcount + 1;
    }
});

//webhook content change
$("#ui_ddl_ContentType").change(function () {
    let checkcontypeval = $("#ui_ddl_ContentType option:selected").text().toLowerCase();
    if (checkcontypeval == "raw body") {
        $("#rawbodytxtinpt").removeClass("hideDiv");
        $("#formtxtinput").addClass("hideDiv");
    } else if (checkcontypeval == "form") {
        $("#formtxtinput").removeClass("hideDiv");
        $("#rawbodytxtinpt").addClass("hideDiv");
    } else {
        $("#rawbodytxtinpt").addClass("hideDiv");
        $("#formtxtinput").addClass("hideDiv");
    }
});
//End of Web Hook Implementation Plumb5 Field and Custom Field Add

$(document).on("click", "#ui_ChkRecuringwhatsapp", function () {
    if ($(this).is(":checked")) {
        $("#Recurringwhatsapp").removeClass('hideDiv')
    }
    else {
        $("#Recurringwhatsapp").addClass('hideDiv')
        recurringwhatsappstatus = 0;
    }
});
$(document).on("click", "#ui_ChkRecuringmail", function () {
    if ($(this).is(":checked")) {
        $("#Recurringmail").removeClass('hideDiv')
    }
    else {
        $("#Recurringmail").addClass('hideDiv')
        recurringmailstatus = 0;
    }
});
$(document).on("click", "#ui_ChkRecuringsms", function () {
    if ($(this).is(":checked")) {
        $("#Recurringsms").removeClass('hideDiv')
    }
    else {
        $("#Recurringsms").addClass('hideDiv')
        recurringsmsstatus = 0;
    }
});
$(document).on("click", "#ui_ChkRecuringwebpush", function () {
    if ($(this).is(":checked")) {
        $("#Recurringwebpush").removeClass('hideDiv')
    }
    else {
        $("#Recurringwebpush").addClass('hideDiv')
        recurringwebpushstatus = 0;
    }
});
$(document).on("click", "#ui_ChkRecuringmobileapp", function () {
    if ($(this).is(":checked")) {
        $("#Recurringapppush").removeClass('hideDiv')
    }
    else {
        $("#Recurringapppush").addClass('hideDiv')
        recurringmobileappstatus = 0;
    }
});