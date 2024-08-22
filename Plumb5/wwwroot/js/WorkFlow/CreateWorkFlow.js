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
var defaultchannels = ["state_mail_", "state_sms_", "state_form_", "state_chat_", "state_webpush_", "state_inappbanner_", "state_apppush_", "state_fbpush_", "state_ussd_", "state_obd_", "state_broadcast_", "state_alert_", "state_goal_"];
var chkchannel = 0;
var allchannel = [];
var allprechannel = [];
var channelName = "", Segment = "0", Rule = "0", Goal = "0", DateTime = "0", Alert = "0";
var PreNode = "0", Condition = "0", DateCondition = 0, DateValue = "0";
var cnt = 0;
/*Groups Part*/


////DropdownPreBind part
var DropdownPreBind = [];
////DropdownpreBind part
var contactDetails = {
    ContactId: 0, ContactIdList: [], EmailId: "", IsVerifiedMailId: null,
    Unsubscribe: null, Location: "", Gender: "", MaritalStatus: "", Education: "", Occupation: "", Interests: "", CustomField1: "", CustomField2: "",
    CustomField3: "", CustomField4: "", CustomField5: "", CustomField6: "", CustomField7: "", CustomField8: "", CustomField9: "", CustomField10: "",
    CustomField11: "", CustomField12: "", CustomField13: "", CustomField14: "", CustomField15: "", CustomField16: "", CustomField17: "",
    CustomField18: "", CustomField19: "", CustomField20: "", UtmTagSource: "", FirstUtmMedium: "", FirstUtmCampaign: "", FirstUtmTerm: "", FirstUtmContent: "",
    OptInOverAllNewsLetter: null, IsSmsUnsubscribe: null, SmsOptInOverAllNewsLetter: null, CreatedDate: null,
    IsAccountHolder: null, AccountType: "", AccountOpenedSource: "", LastActivityLoginDate: null, LastActivityLoginSource: "", CustomerScore: "", AccountAmount: "", IsCustomer: null, IsMoneyTransferCustomer: null, IsGoalSaver: null, IsReferred: null, IsReferredOpenedAccount: null, IsComplaintRaised: null, ComplaintType: ""
};

var maxRowCount = 0;
var rowIndex = 0;
var viewMoreDisable = false;
var ContactDetails = [];
var contactIds = [];

var GroupmaxRowCount = 0, GrouprowIndex = 0; GroupIds = [];
var GroupviewMoreDisable = false;
var Group = { Id: 0, Name: "" };
var GroupDetails = [];
var TargetConnections = [];
var RssExist = 0;
/*End of Groups Part*/


/*Alert Reponses object declaration */
var alterReponses = { ConfigureAlertId: 0, AlertThroughEmail: "", AlertThroughSMS: "", AlertThroughPush: "", AlertThroughCall: "", RedirectUrl: "", GroupId: "", AssignLeadToUserId: "", WebHooksUrl: "", MobileNotificationUrl: "", WebHookMethodType: "", WebHookHeader: "", WebHookParams: "", WebHooksFinalUrl: "", SelectedTab: "", WebHookFinalParams: "", WebPushUsers: "", AppPushUsers: "", WebHookExtraParams: "" };
/*End of Alert Reponses object declaration */
var ContactList = [];


$(document).ready(function () {


    if ($.urlParam("WorkflowId") > 0) {
        WorkflowId = parseInt($.urlParam("WorkflowId"));
        formDetails.GetAllForm();
        $.ajax({
            url: "/WorkFlow/Create/GetWorkflowByWorkflowId",
            type: 'POST',
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ 'WorkflowId': $.urlParam("WorkFlowId") }),
            success: function (response) {
                $("#dvLoading").append('<p id="dvInit" style="padding-left:40px;color:#554408;font-size: 18px;padding-top:75px;">Please wait initialising...</p>');

                $('#ui_spnWorkFlowName').empty();
                $('#ui_spnWorkFlowName').append(response.Title.charAt(0).toUpperCase() + response.Title.slice(1));
                $('#ui_txtWorkFlowTitle').val(response.Title.charAt(0).toUpperCase() + response.Title.slice(1));
                workflowstatus = response.Status;
                ArrayConfig = $.parseJSON(response.ArrayConfig);



                if (response.Status == 1) {

                    //..........................................................

                    $("#btndateandtime").css("display", "none");
                    $("#btnSaveapppush").css("display", "none");
                    $("#btnsavemaildetails").css("display", "none");
                    $("#btnSaveSms").css("display", "none");
                    $("#btnSavewebpush").css("display", "none");



                    //..........................................................
                    $("#divworkflowleft").css("display", "none");
                    $("#dvwSeparate").css("display", "none");

                    $("#btnstop").css("display", "block");
                    $("#btnstart").css("display", "none");
                }
                else if (response.Status == 0) {
                    $("#btnstop").css("display", "none");
                    $("#btnstart").css("display", "block");
                    if (ArrayConfig == null) { $("#btnstart").css("display", "none"); }
                }
                if (response.WorkFlowDataId > 0) {
                    publishstatus = 1;
                    $("#btnSavedraft").css("display", "none");
                    //  $("#btnUpdateworkflow").css("display", "block");
                    $("#btnSave").css("display", "none");

                }
                else {
                    $("#btnSavedraft").css("display", "block");
                    //  $("#btnUpdateworkflow").css("display", "none");
                    $("#btnSave").css("display", "block");

                }

            },
            error: ShowAjaxError
        });
    }
    else { GetworkFlowMaxCount(); }

    workflowUtil.MinimizeMenuContent();
    LoadDefaultWorkFlow();

    setTimeout(initData, 1000);

});


function initData() {

    GetContactColumns();
    GetWebAppPushUsers("web");
    GetWebAppPushUsers("app");
    segmentDetails.GetAllSegment();
    segmentDetails.GetGroups();
    mailDetails.BindActiveEmailIds();

    mailDetails.BindMailTemplates();
    formDetails.GetFormType();
    formDetails.GetAllForm();

    //smsDetails.BindSmsTemplate();
    //formDetails.GetFormType();
    //formDetails.GetAllForm();
    //WebPushDetails.GetWebPushCampaigns();
    //OBDDetails.BindOBDTemplate();
    AppPushDetails.GetPushCampaigns();
    //FacebookPushDetails.GetFacebookPushCampaigns();
    //InAppDetails.GetInAppCampaigns();
    //chatDetails.GetAllChat();
    //BroadcasteDetails.BindBroadcaste();

    RuleDetails.BindRules();
    usersDetails.GetUserNameList();
    GoalDetails.BindGoal();



    $("#dvInit").hide();
    $("#dvLoadingImg").hide();
    $("#first").fadeOut()
}
////////////////////////----------WorkFlowBasicDetails------------/////////////////

GetNodeConfigurationId = function () {
    $.ajax({
        url: "/WorkFlow/Dashboard/GetWrokflowNodes",
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({ 'WorkflowId': $.urlParam("WorkFlowId") }),
        contentType: "application/json; charset=utf-8",
        success: function (json) {
            $.each(json, function (i) {

                if (json[i].ChannelStatus == false && json[i].Channel.match(/(mail|sms|ussd|obd|push|banner|form|chat|broadcast|alert)/)) {
                    $('#stop' + json[i].Channel).css("color", "#66BB6A");
                    $('#' + json[i].Channel + ' ul li i').css({ 'background': "#ab4848", });
                    $('#' + json[i].Channel).css({ 'border': "1px solid #ab4848", });
                    $('#stop' + json[i].Channel).attr('title', "Start this channel");
                    $('#stop' + json[i].Channel).removeClass('fa fa-stop-circle-o').addClass('fa fa-play-circle-o');
                }
                SetNodeConfigArray(json[i].Channel, json[i].SegmentId, json[i].ConfigName, 0, json[i].TitleId);

            });


        },
        error: ShowAjaxError
    });

}

function SetNodeConfigArray(nodeid, value, title, Datecondition, TitleId) {

    var chanelname = nodeid.replace('state_', '').split('_')[0];
    var showTitle = JSLINQ(DropdownPreBind).Where(function (item) { return item.Channel.toLowerCase() == chanelname && item.Id == TitleId; }).Select(function (item) { return item.Text; }).items[0];
    if (showTitle == undefined) {
        showTitle = title; showTitle = showTitle.charAt(0).toUpperCase() + showTitle.slice(1);
        $("#title" + nodeid).text(showTitle.length > 25 ? showTitle.substring(0, 25) + ".." : showTitle);


    }
    if (showTitle.indexOf("~") > -1) {
        getGroupCount(value, title, nodeid);
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
        "TitleId": TitleId
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

function getGroupCount(groupid, title, nodeid) {
    var belong = title.indexOf('not') == -1 ? 'true' : 'false';
    $.ajax({
        url: "/WorkFlow/Groups/BindGropsDetails",
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({ 'groupids': groupid, 'Isbelong': belong, 'actiontype': 2 }),
        contentType: "application/json; charset=utf-8",
        success: function (json) {
            total = $.parseJSON(json)[0].Name;
            var gtext = title.toString().split('~');
            showTitle = title.toString().split('~')[1] + " to " + title.toString().split('~')[0] + " - " + total;
            showTitle = showTitle.charAt(0).toUpperCase() + showTitle.slice(1);
            $("#title" + nodeid).css({ 'text-transform': "initial" }).text(showTitle.length > 25 ? showTitle.substring(0, 25) + ".." : showTitle);

        },
        error: ShowAjaxError
    });
}

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
            if (WorkflowId == 0) {
                $('#ui_txtWorkFlowTitle').val("WorkFlow" + Count);
                $('#ui_spnWorkFlowName').empty();
                $('#ui_spnWorkFlowName').append("WorkFlow" + Count);
                $('#ui_txtWorkFlowTitle').append("WorkFlow" + Count);
            }
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
        WorkFlowBasicDetails.Status = 2;
        if (WorkflowId != 0) { WorkFlowBasicDetails.WorkflowId = WorkflowId; }
        else { WorkFlowBasicDetails.WorkflowId = 0; }

        $.ajax({
            url: "/WorkFlow/Create/StoreBasicDetails",
            type: 'POST',
            data: JSON.stringify({ 'WorkFlowBasicDetails': WorkFlowBasicDetails }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response == -1) { ShowErrorMessage("This Workflow title already exist!"); }
                else if (response == 0) {
                    $('#ui_spnWorkFlowName').empty();
                    $('#ui_spnWorkFlowName').append($("#ui_txtWorkFlowTitle").val());
                    WorkflowId = response;
                    workflowUtil.WorkflowDraft();
                    $(".bgShadedDiv").hide(); $(".CustomPopUp").hide("slow"); $("#dvLoading").hide();
                }
                else {
                    $('#ui_spnWorkFlowName').empty();
                    $('#ui_spnWorkFlowName').append($("#ui_txtWorkFlowTitle").val());
                    WorkflowId = response;
                    workflowUtil.WorkflowDraft();
                    $(".bgShadedDiv").hide(); $(".CustomPopUp").hide("slow"); $("#dvLoading").hide();

                }

                window.history.pushState('', '', UpdateQueryString("WorkFlowId", WorkflowId));
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

    if ($.urlParam("WorkflowId") > 0) {
        $('#ui_txtWorkFlowTitle').val($('#ui_spnWorkFlowName').html());
        $(".bgShadedDiv").show();
        $("#ui_dvCustomPopUpWorkFlowBasic").show();
    }
    else if (WorkflowId == 0) {
        GetworkFlowMaxCount();
        $(".bgShadedDiv").show();
        $("#ui_dvCustomPopUpWorkFlowBasic").show();
    }
    else {
        $(".bgShadedDiv").show();
        $("#ui_dvCustomPopUpWorkFlowBasic").show();
    }
}
/////////////////////------End oF basicDetails-------///////////////


function flowValidation() {
    var result = 1;
    var chk = ArrayConfig.filter(function (item) { return item.Channel.indexOf('_segment_') > -1 && item.Title.toLowerCase() === 'allusers' })[0];
    if (chk != undefined) {
        var schk = dataconnections.filter(function (item) { return item.SourceId === chk.Channel && (item.TargetId.indexOf('_mail_') > -1 || item.TargetId.indexOf('_sms_') > -1) })[0];
        if (schk != undefined) { result = 0; ShowErrorMessage("Please add duration before mail/sms channel."); }
    }

    var abchk = ArrayConfig.filter(function (item) { return item.Channel.indexOf('_rule_') && item.Title.indexOf('^1') > -1 }).map(x => x.Channel)[0]
    if (abchk != undefined) {
        var abchannel = dataconnections.filter(function (item) { return item.SourceId === abchk }).map(x => x.TargetId);
        if (abchannel.length > 2) {
            result = 0; ShowErrorMessage("You can't add more than 2 channel for A/B testing.");
        }
        if (abchannel.length == 1) {
            result = 0; ShowErrorMessage("Please add 1 more channel for A/B testing.");
        }
        else if ((abchannel.length == 2) && abchannel[0].split('_')[1] != abchannel[1].split('_')[1]) {
            result = 0; ShowErrorMessage("Please use same channel for A/B testing.");
        }
    }

    return result;
}

function LoadDefaultWorkFlow() {


    $('#btnSave').on('click', function () {
        if (flowValidation() == 1) {
            $("#btnSave").css("display", "none");
            $("#dvLoading").show();
            $("#btnSavedraft").css("display", "none");
            $("#btnstop").css("display", "block");
            workflowUtil.SaveFlowchart();
        }
    });
    //$('#btnUpdateworkflow').on('click', function () {

    //    workflowUtil.SaveFlowchart();
    //});
    $('#btnSavedraft').on('click', function () {
        workflowUtil.WorkflowDraft();
    });
    $('#btnstart').on('click', function () {

        workflowUtil.UpdateWorkflowStatus(1);
    });
    $('#btnstop').on('click', function () {

        workflowUtil.UpdateWorkflowStatus(0);
    });

    //==========================================================
    var jspInstance = function () {
        this._type = 'jspInstance';
        //jsplumb instance:
        this.instance = null;
        this.containerId = 'flowchart';

        //Default Connector Settings:
        this.connectorSettings = {
            width: 2,
            colour: '#ccc',
            colourHover: '#9d9da0',
            grid: [8, 8],
            arrowSize: 0,
            labelStyle: 'aLabel',
            //cornerRadius: 4,

        };

        //Default Endpoint Settings:
        this.endpointSettings = {
            size: 6,
            //colour: this.connectorSettings.colour,
            //colourHover: this.connectorSettings.colourHover,
            //optional Endpoints label text to describe whether they are sources or targets:
            sourceText: 'Sent',
            //targetText:'Target',
        };


        this.stateConfiguration = {
            className: 'state',
            //Beginning of id used for state divs (eg: 'state_1' and 'state_1_Endpoint_BottomLeft'):
            stateIdPrefix: 'state',
            clickHandler: null,
            dblClickHandler: null,
        };

        this.state = {
            endpoints: {}
        }
    }
    //==========================================================
    jspInstance.prototype.log = function (msg) {
        var me = this;
        console.log(msg);
    }
    //==========================================================
    //Creates new 'instance':
    jspInstance.prototype.create = function () {
        var me = this;
        result = me;
        return me.instance = jsPlumb.getInstance({

            //container id:
            Container: me.containerId,

            // default drag options
            DragOptions: {
                cursor: 'pointer',
                zIndex: 2000
            },

            // the overlays to decorate each connection with.
            //note that the label overlay uses a function to generate the label text; in this
            // case it returns the 'labelText' member that we set on each connection in the 'createOverlaysOnConnector' method below.
            ConnectionOverlays: [
                ["Arrow", { width: 12, length: 16, location: 0.95 }],
                ['Label', {
                    location: 0.5,
                    id: 'label',
                    cssClass: me.connectorSettings.labelStyle
                }]
            ],
        });
    }

    //==========================================================

    jspInstance.prototype.initializeEndpointStyles = function () {
        var me = this;

        // this is the paint style for the connecting lines..
        connectorPaintStyle = {
            lineWidth: 4,
            strokeStyle: me.connectorSettings.colour,
            //joinstyle: 'round',
            //outlineWidth: me.connectorSettings.width / 2,
            //outlineColor: '#2D2D30'
        };
        // .. and this is the hover style.
        connectorHoverStyle = {
            //lineWidth: me.connectorSettings.width,
            strokeStyle: me.connectorSettings.colourHover,
            //outlineWidth: me.connectorSettings.width / 2,
            //outlineColor: '#2D2D30'
        };
        endpointHoverStyle = {
            fillStyle: me.endpointSettings.colourHover,
            //Makes target label jump.
            //Don't know why
            //strokeStyle: me.endpointSettings.colourHover
        };





        // the definition of target endpoints (will appear when the user drags a connection)
        me.targetEndpointConfiguration = {
            endpoint: 'Rectangle',
            paintStyle: {

                //fillStyle: me.endpointSettings.colour,
                radius: me.endpointSettings.size
            },
            hoverPaintStyle: endpointHoverStyle,
            maxConnections: -1,
            dropOptions: {
                hoverClass: 'hover',
                activeClass: 'active'
            },
            isTarget: true,
            overlays: [
                ['Label', {
                    location: [0.5, -0.5],
                    label: this.endpointSettings.targetText,
                    //cssClass: 'endpointTargetLabel'
                }]
            ]
        };


    };
    //==========================================================
    jspInstance.prototype.addState = function (stateInfo) {

        var me = this;

        var nodeType = stateInfo.id;
        var getclass = $('#' + nodeType).attr('class').replace("ui-draggable", "").replace(" dragnode", "");
        var mnodeType = "ui_" + stateInfo.id;

        var stateId = workflowUtil.GetUniqueIdForNode(me.stateConfiguration.stateIdPrefix, stateInfo.id);
        var border = "1px solid #66BB6A";
        if (nodeType.match(/(segment|goal|alert|rule|dateandtime|end)/)) { border = "1px solid #57ADD6"; }

        var $stateElement = $('<div/>', { id: stateId }).addClass(me.stateConfiguration.className).css({ left: stateInfo.location[0] + 'px', top: stateInfo.location[1] + 'px', border: border }).attr("nodetype", nodeType);
        $stateElement.append("<img id='imgabrule" + stateId + "' src='../../images/abtest.png' title='Rule of A/B testing' class='note' style='cursor: default;display:none;left: 195px;top: 22px;'>");
        $stateElement.append($("<i id='delete" + stateId + "' class='fa fa-ban' aria-hidden='true' style='display:none;cursor: pointer;position: absolute;left: 181px;color:#c56767;'></i>"));

        var classNameForTag = workflowUtil.GetClassNameByNodeType(stateInfo.id);

        $stateElement.append($("<ul class='" + classNameForTag + "' style='height: 0px;width: 0px;position: absolute;left: -25px;color:#fff;'><li style='height: 50px;'><i style='cursor: default;' class='" + getclass + "' aria-hidden='true' title='Event'></i></li></ul>"));

        $stateElement.append($('<span/>', { id: "popup" + stateId }).text(stateInfo.title).css({ cursor: stateId.indexOf('state_end_') == -1 ? 'pointer' : 'move', textDecoration: stateId.indexOf('state_end_') == -1 ? '' : 'none' }));
        $stateElement.append($("<div id='title" + stateId + "' style='height:0px;;font-size: 12px;width: 90%;position: absolute;color: #666666;top: 25px;padding-top: 2px;'></div>"));
        $stateElement.appendTo($('.' + me.containerId));

        //Make it draggable:
        me.instance.draggable($stateElement, { grid: me.connectorSettings.grid });

        //add :
        me.addStateEndpoints(stateId, stateInfo.sn);

        //delete node
        $('#delete' + stateId).on('click', function (e) { me.onStateDblClick($(this).parent().attr('id')); });

        //mouseover for end-node
        $("#" + stateId + ",[id=endnode_" + stateId + "]").hover(
            function (event) {

                if (event.currentTarget.id.toString().indexOf('endnode_') == -1) {
                    $('#delete' + stateId).css("display", "block");
                    $("[id=endnode_" + stateId + "]").css("visibility", "visible");
                }
                $("[title=nodelabel_" + stateId + "]").css("color", "#bababa");
                $("[id=endnode_" + stateId + "]").find('svg circle').css({ fill: "rgb(122, 176, 44)", stroke: "rgb(122, 176, 44)" })
            },
            function (event) {
                $('#delete' + stateId).css("display", "none");
                $("[title=nodelabel_" + stateId + "]").css("color", "transparent");
                $("[id=endnode_" + stateId + "]").find('svg circle').css({ "fill": "transparent", stroke: "transparent" })
            }
        );

        //open pop-up
        var lastpos = 0;
        $('#popup' + stateId).mouseover('click', function (e) { lastpos = $(this).offset().left.toFixed(); });
        $('#popup' + stateId).on('click', function (e) { if (lastpos == $(this).offset().left.toFixed() && stateId.indexOf('state_end_') == -1) { me.onStateClick($(this).parent()); } });


        //Attach Event Handler to each div:
        //$stateElement.bind('dblclick',function(e){me.onStateDblClick(e);});
        //$stateElement.bind('click',function(e){me.onStateClick(e);});

        //me.clicks = 0;
        //me.timer = null;
        //$stateElement.on("click", function (e) {
        //    me.clicks++;  //count clicks
        //    if (me.clicks === 1) {
        //        me.timer = setTimeout(function () {

        //            me.onStateClick(e);
        //            me.clicks = 0;             //after action performed, reset counter
        //            clearTimeout(me.timer);
        //        }, 200);
        //    } else {
        //        clearTimeout(me.timer);    //prevent single-click action
        //        me.onStateDblClick(e);
        //        me.clicks = 0;             //after action performed, reset counter

        //    }
        //})
        //.on("dblclick", function (e) {

        //    e.preventDefault();  //cancel system double-click event
        //});

    }

    jspInstance.prototype.updateState = function (stateInfo) {

        var me = this;

        var nodeType = stateInfo.typeId;
        var getclass = $('#' + nodeType).attr('class').replace("ui-draggable", "").replace(" dragnode", "");
        var stateId = stateInfo.id;

        var border = "1px solid #66BB6A";
        if (nodeType.match(/(segment|goal|alert|rule|dateandtime|end)/)) { border = "1px solid #57ADD6"; }

        var $stateElement = $('<div/>', { id: stateId }).addClass(me.stateConfiguration.className).css({ left: stateInfo.location[0] + 'px', top: stateInfo.location[1] + 'px', border: border }).attr("nodetype", nodeType);
        $stateElement.append("<img id='imgabrule" + stateId + "' src='../../images/abtest.png' title='Rule of A/B testing' class='note' style='display:none;left: 195px;top: 22px;position: absolute;cursor: default;'>");
        $stateElement.append($("<i id='delete" + stateId + "' title='Delete this channel' class='fa fa-ban' aria-hidden='true' style='display:none;cursor: pointer;position: absolute;left: 181px;color:#c56767;'></i>"));
        //$stateElement.append($("<i id='stop" + stateId + "' onclick=stopchannel('" + stateId + "') title='Stop this channel' class='fa fa-stop-circle-o' aria-hidden='true' style='display:none;cursor: pointer;position: absolute;left: 181px;color:#c56767;'></i>"));

        var classNameForTag = workflowUtil.GetClassNameByNodeType(nodeType);

        $stateElement.append($("<ul class='" + classNameForTag + "' style='height: 0px;width: 0px;position: absolute;left: -25px;color:#fff;'><li style='height: 50px;'><i style='cursor: default;' class='" + getclass + "' aria-hidden='true' title='Event'></i></li></ul>"));
        $stateElement.append($('<span/>', { id: "popup" + stateId }).text(stateInfo.title).css({ cursor: stateId.indexOf('state_end_') == -1 ? 'pointer' : 'move', textDecoration: stateId.indexOf('state_end_') == -1 ? '' : 'none' }));

        $stateElement.append($("<div id='title" + stateId + "' style='height:0px;;font-size: 12px;width: 90%;position: absolute;color: #666666;top: 25px;padding-top: 2px;'></div>"));
        $stateElement.appendTo($('.' + me.containerId));

        //Make it draggable:
        me.instance.draggable($stateElement, { grid: me.connectorSettings.grid });

        //add :
        me.addStateEndpoints(stateId, stateInfo.sn);

        //delete node
        $('#delete' + stateId).on('click', function (e) { me.onStateDblClick($(this).parent().attr('id')); });

        var stop = 1;
        //mouseover for end-node
        if (publishstatus != 1) {
            $("#" + stateId + ",[id=endnode_" + stateId + "]").hover(
                function (event) {

                    if (event.currentTarget.id.toString().indexOf('endnode_') == -1) {
                        $('#delete' + stateId).css("display", "block");
                        $("[id=endnode_" + stateId + "]").css("visibility", "visible");
                    }
                    $("[title=nodelabel_" + stateId + "]").css("color", "#bababa");
                    $("[id=endnode_" + stateId + "]").find('svg circle').css({ fill: "rgb(122, 176, 44)", stroke: "rgb(122, 176, 44)" })
                },
                function (event) {
                    $('#delete' + stateId).css("display", "none");
                    $("[title=nodelabel_" + stateId + "]").css("color", "transparent");
                    $("[id=endnode_" + stateId + "]").find('svg circle').css({ "fill": "transparent", stroke: "transparent" })
                }
            );
        } else if (stateId.match(/(mail|sms|ussd|obd|push|banner|form|chat|broadcast|alert)/)) {
            $("#" + stateId).hover(
                function (event) {
                    $('#stop' + stateId).css("display", "block");
                },
                function (event) {
                    $('#stop' + stateId).css("display", "none");
                }
            );

        }
        //open pop-up
        var lastpos = 0;
        $('#popup' + stateId).mouseover('click', function (e) { lastpos = $(this).offset().left.toFixed(); });
        $('#popup' + stateId).on('click', function (e) { if (lastpos == $(this).offset().left.toFixed() && stateId.indexOf('state_end_') == -1) { me.onStateClick($(this).parent()); } });

        //Attach Event Handler to each div:
        //$stateElement.bind('dblclick',function(e){me.onStateDblClick(e);});
        //$stateElement.bind('click',function(e){me.onStateClick(e);});

        //me.clicks = 0;
        //me.timer = null;
        //$stateElement.on("click", function (e) {
        //    me.clicks++;  //count clicks
        //    if (me.clicks === 1) {
        //        me.timer = setTimeout(function () {

        //            me.onStateClick(e);
        //            me.clicks = 0;             //after action performed, reset counter
        //            clearTimeout(me.timer);
        //        }, 200);
        //    } else {
        //        clearTimeout(me.timer);    //prevent single-click action
        //        me.onStateDblClick(e);
        //        me.clicks = 0;             //after action performed, reset counter

        //    }
        //})
        //.on("dblclick", function (e) {

        //    e.preventDefault();  //cancel system double-click event
        //});

    }

    //==========================================================
    jspInstance.prototype.removeState = function (stateInfo) {
        var me = this;
        var stateId = stateInfo;
        //var stateId = (stateInfo instanceof jQuery)
        //            ? stateInfo.attr('id')
        //            : (stateInfo.nodeType) ? $(stateInfo).attr('id') : [me.stateConfiguration.stateIdPrefix, stateInfo.id].join('_');

        me.instance.detachAllConnections(stateId);

        //Remove endpoints:
        if (typeof (me.state.endpoints[stateId]) == "undefined") {
            me.state.endpoints[stateId] = {}
        }
        var endpoints = me.state.endpoints[stateId];

        for (var prop in endpoints) {
            me.instance.deleteEndpoint(endpoints[prop]);
        }
        me.state.endpoints[stateId] = {};

        //Remove state:
        $("#" + stateId).remove();
        if (!IsObjectEmpty(KeyAndValuesOfMenu)) {

            delete KeyAndValuesOfMenu[stateId];
        }
        //remove all connection for deleted node
        if (!IsObjectEmpty(dataconnections)) {

            dataconnections = $.grep(dataconnections, function (e) {
                return e.SourceId != stateId;
            });
            dataconnections = $.grep(dataconnections, function (e) {
                return e.TargetId != stateId;
            });
        }

    }
    //==========================================================
    jspInstance.prototype.addStateEndpoints = function (stateId, noSource) {
        var me = this;
        if (noSource.length == 6) {
            me.addStateEndpoints2(stateId, ['Bottom1', 'Bottom2', 'Bottom3', 'Bottom4', 'Bottom5', 'Bottom6'], false, noSource);
        } else if (noSource.length == 5) {
            me.addStateEndpoints2(stateId, ['Bottom1', 'Bottom2', 'Bottom3', 'Bottom4', 'Bottom5'], false, noSource);
        } else if (noSource.length == 4) {
            me.addStateEndpoints2(stateId, ['Bottom1', 'Bottom2', 'Bottom4', 'Bottom5'], false, noSource);
        } else if (noSource.length == 3) {
            me.addStateEndpoints2(stateId, ['Bottom2', 'Bottom3', 'Bottom4'], false, noSource);
        } else if (noSource.length == 2) {
            me.addStateEndpoints2(stateId, ['Bottom2', 'Bottom4'], false, noSource);
        } else if (noSource.length == 1) {
            me.addStateEndpoints2(stateId, ['Bottom3'], false, noSource);
        }
        me.addStateEndpoints2(stateId, ['TopCenter'], true, noSource);


    }
    //==========================================================
    jspInstance.prototype.addStateEndpoints2 = function (stateId, anchors, isTarget, sourceTxt) {
        var me = this;


        if (typeof (me.state.endpoints[stateId]) == "undefined") {
            me.state.endpoints[stateId] = {}
        }

        var endpoints = me.state.endpoints[stateId];



        for (var i = 0; i < anchors.length; i++) {

            var anchor = anchors[i];
            var uuid = [stateId, anchor].join('_');
            me.sourceEndpointConfiguration = {
                endpoint: 'Dot',
                paintStyle: {
                    width: 35,
                    height: 25,
                    strokeStyle: '#7AB02C',
                    fillStyle: '#7AB02C',
                    radius: 8,//me.endpointSettings.size-2,
                    lineWidth: 2
                },
                isSource: true,
                maxConnections: -1,
                connector: ["Straight"],
                connectorStyle: connectorPaintStyle,
                hoverPaintStyle: endpointHoverStyle,
                connectorHoverStyle: connectorHoverStyle,
                dragOptions: {},
                overlays: [
                    ['Label', {
                        location: [0.5, 1.5],
                        label: sourceTxt[i],
                        id: 'myLabel',
                        title: "nodelabel_" + stateId,
                        cssClass: 'endpointSourceLabel'
                    }]
                ]
            };

            var endpoint = me.instance.addEndpoint(stateId, (isTarget) ? me.targetEndpointConfiguration : me.sourceEndpointConfiguration, { anchor: anchor, uuid: uuid });

            endpoints[uuid] = endpoint;
        }





    };
    //==========================================================
    jspInstance.prototype.addConnection = function (connectorInfo) {

        var me = this;
        var sId = [me.stateConfiguration.stateIdPrefix, connectorInfo.s[0], connectorInfo.s[1]].join('_');
        var tId = [me.stateConfiguration.stateIdPrefix, connectorInfo.t[0], connectorInfo.t[1]].join('_');


        me.instance.connect({
            uuids: [
                sId,
                tId,
            ],
            id: connectorInfo.id,
            editable: true
        });

    };

    jspInstance.prototype.addData = function (pid, label, left, top, anchors) {
        var me = this;

        me.dataset =
        {
            template: 1,
            instance: 123,
            states: [
                { id: pid, typeId: 'clientEvent', title: label, location: [left, top], sn: anchors },

            ],
            connections: [
                {}
            ]
        };

        //alert(pid);
        //Add divs, one for each state:
        if (pid == 'segment' && chkGroup == 1) {
            ShowErrorMessage("You can drop only one Audience");
        }
        else if (pid == 'goal' && chkGoal == 1) {
            ShowErrorMessage("You can drop only one Goal");
        }
        else {
            $.map(me.dataset.states, function (s) { me.addState(s); });
            if (pid == 'segment' && chkGroup == 0) { chkGroup = 1; }
            else if (pid == 'goal' && chkGoal == 0) { chkGoal = 1; }
        }

        //if (confirm('Delete connection from ' + conn.sourceId + ' to ' + conn.targetId + '?')) jsPlumb.detach(conn);

    };
    //==========================================================
    jspInstance.prototype.attachEventHandlers = function () {

        var me = this;
        result = me;

        //me.instance.bind('click', function (conn, originalEvent) {

        //    if (confirm('Remove this connection?')) {
        //        jsPlumb.detach(conn);
        //    }
        //});

        // listen for clicks on connections, and offer to delete connections on click.
        me.instance.bind('click', function (conn, originalEvent) {


            if (workflowstatus != 1 && (Id == null || Id == undefined || Id == "" || Id <= 0)) {
                if (confirm('Remove this connection?')) {
                    jsPlumb.detach(conn);

                    //delete from multiple sources to targets
                    var index = TargetConnections.indexOf(conn.targetId);
                    if (index > -1) {
                        TargetConnections.splice(index, 1);
                    }

                    dataconnections = $.grep(dataconnections, function (e) {
                        return e.connectionId != conn.id;
                    });

                }
            }
            else {
                ShowErrorMessage("Sorry, you can't delete connection(s)");
            }

        });

        // listen for new connections; initialise them the same way we initialise the connections at startup.
        me.instance.bind('connection', function (connInfo, originalEvent) {

            me.createOverlaysOnConnector(connInfo.connection);
        });

        me.instance.bind('connectionDrag', function (connection) {

            console.log('connection ' + connection.id + ' is being dragged. suspendedElement is ', connection.suspendedElement, ' of type ', connection.suspendedElementType);
        });

        me.instance.bind('connectionDragStop', function (connection) {

            if (connection.sourceId.indexOf('jsPlumb_') == -1 && connection.targetId.indexOf('jsPlumb_') == -1) {
                var text = connection.endpoints[0].getOverlay("myLabel").getLabel();
                dataconnections.push({
                    connectionId: connection.id,
                    SourceId: connection.sourceId,
                    TargetId: connection.targetId,
                    anchor: connection.endpoints[0].anchor.type,
                    RelationWithParent: text
                });
            }
            if (connection.sourceId.toString().indexOf('state_rule_') > -1 && connection.targetId.toString().indexOf('state_rule_') > -1) {
                jsPlumb.detach(connection);
                ShowErrorMessage("You can't drag connection from rule to rule");
            }
            else if (connection.sourceId.toString().indexOf('state_obd_') > -1) {
                jsPlumb.detach(connection);
                ShowErrorMessage("Due to API responses problem you can't drag connection from OBD");
            }

            $("[id=endnode_" + connection.sourceId + "]").find('svg circle').css({ "fill": "transparent", stroke: "transparent" })
            console.log('connection ' + connection.id + ' was dragged');

        });

        me.instance.bind('connectionMoved', function (params) {

            console.log('connection ' + params.connection.id + ' was moved');
        });


    };


    //==========================================================
    jspInstance.prototype.createOverlaysOnConnector = function (connection) {

        var me = this; result = me;
        var text = connection.endpoints[0].getOverlay("myLabel").getLabel();
        //if (text == "Fwd") {
        //    text = "Forward";
        //}
        //else if (text == "Unsub") {
        //    text = "Unsubscribe";
        //}

        if (TargetConnections.indexOf(connection.targetId) == -1) {
            TargetConnections.push(connection.targetId);

            connection.getOverlay('label').setLabel(text);

            connection.bind('editCompleted', function (o) {
                if (typeof console != 'undefined') {
                    console.log('connection edited. path is now ', o.path);
                }
            });

            connection.bind("mouseenter", function (conn) {
                $("[id=endnode_" + connection.sourceId + "]").find('svg circle').css({ "fill": "transparent", stroke: "transparent" })
            });

            connection.bind("mouseexit", function (conn) {
                $("[id=endnode_" + connection.sourceId + "]").find('svg circle').css({ "fill": "transparent", stroke: "transparent" })
            });
        }
        else {
            jsPlumb.detach(connection);
            alert("Sorry! Multiple flows Target cannot be possible");
        }
    };

    //==========================================================
    //jspInstance.prototype.demoAttachConnectors = function(){

    //	var me = this;
    //	// connect a few up
    //	me.instance.connect({
    //		uuids: [
    //			[me.stateConfiguration.stateIdPrefix,'2','BottomCenter'].join('_'),
    //			[me.stateConfiguration.stateIdPrefix,'3','TopCenter'].join('_')
    //			],
    //		editable: true
    //	});
    //	me.instance.connect({
    //		uuids: [
    //			[me.stateConfiguration.stateIdPrefix,'2','RightMiddle'].join('_'),
    //			[me.stateConfiguration.stateIdPrefix,'4','LeftMiddle'].join('_')
    //			],
    //		editable: true
    //	});
    //};
    //==========================================================

    jspInstance.prototype.initialize = function () {
        var me = this;

        me.initializeEndpointStyles();
        me.create();

        me.attachEventHandlers();
    }


    //==========================================================
    jspInstance.prototype.initializeData = function (workflowcontent) {

        var initobj;
        //initobj = jQuery.parseJSON('{"nodes":[{"blockId":"state_rule_387","positionX":338,"positionY":14,"label":"Rule","NodeType":"rule"},{"blockId":"state_mail_765","positionX":330,"positionY":152,"label":"Send Mail","NodeType":"mail"}],"connections":[{"connectionId":"con_28","SourceId":"state_rule_387","TargetId":"state_mail_765","anchor":"Bottom3","RelationWithParent":"Satisfy"}],"numberOfElements":"1"}');
        //initobj = jQuery.parseJSON('{"nodes":[{"blockId":"state_segment_523","positionX":422,"positionY":58,"label":"Audience"},{"blockId":"state_mail_467","positionX":435,"positionY":209,"label":"Send Mail"}],"connections":[{"connectionId":"con_31","SourceId":"state_segment_523","TargetId":"state_mail_467","anchor":"Bottom3","RelationWithParent":"Satisfy"}],"numberOfElements":"2"}');
        initobj = jQuery.parseJSON(workflowcontent);
        if (initobj != undefined) {


            //numberOfElements = initobj.numberOfElements;
            //var getstate = [];
            //$.each(initobj.nodes, function (index, elem) {
            //    var dragdv = elem.blockId.replace("state_", "").substring(0, 2);
            //    var indx = dragdv.substring(0, 1) == "t" ? 0 : dragdv.substring(0, 1) == "a" ? 1 : dragdv.substring(0, 1) == "r" ? 2 : 0;
            //    getstate.push({
            //        id: elem.blockId.replace("state_", ""), typeId: elem.nodetype, title: elem.label, location: [elem.positionX, elem.positionY], sn: jsonprenode[indx][dragdv]
            //    });
            //});

            //var con = [];
            //$.each(initobj.connections, function (index, elem) {
            //    con.push({
            //        s: [elem.SourceId.replace("state_", ""), elem.anchor], t: [elem.TargetId.replace("state_", ""), 'TopCenter']
            //    });
            //});

            numberOfElements = initobj.numberOfElements;
            var getstate = [];
            $.each(initobj.nodes, function (index, elem) {
                var NodeDetails = {};
                NodeDetails.NodeData = initobj.nodes[index].NodeData;
                KeyAndValuesOfMenu[initobj.nodes[index].blockId] = NodeDetails;
                var type = elem.blockId.toString().split('_');
                var anchorlist = workflowUtil.GetAnchorList(type[1]);
                getstate.push({
                    id: elem.blockId,
                    //nodetype: initobj.nodes[index].NodeType,
                    typeId: type[1],
                    title: elem.label,
                    location: [elem.positionX, elem.positionY],
                    sn: anchorlist
                });

                if (elem.blockId.indexOf('segment') > -1 && chkGroup == 0) { chkGroup = 1; }
                else if (elem.blockId.indexOf('goal') > -1 && chkGoal == 0) { chkGoal = 1; }
            });
            var con = [];
            dataconnections = initobj.connections;
            $.each(initobj.connections, function (index, elem) {
                con.push({
                    id: elem.connectionId,
                    s: [elem.SourceId.replace("state_", ""), elem.anchor],
                    t: [elem.TargetId.replace("state_", ""), 'TopCenter']
                });
            });




            if (getstate.length > 0) {
                var me = this;
                result = me;
                //pretend that we got some json:
                me.dataset =
                {
                    template: 1,
                    instance: 123,
                    states: getstate
                    ,
                    connections: con

                };

                //Add divs, one for each state:
                $.map(me.dataset.states, function (s) { me.updateState(s); });


                //Suspend rendering and add connectors:
                me.instance.doWhileSuspended(
                    function () {
                        $.map(me.dataset.connections, function (c) {
                            me.addConnection(c);
                        });
                    });

                //console.log(jsPlumb.getConnections());
            }
        }
    }


    //==========================================================
    jspInstance.prototype.onStateClick = function (e) {
        var me = this;
        if (me.stateConfiguration.clickHandler) { me.stateConfiguration.clickHandler(e); }
    }
    //==========================================================
    jspInstance.prototype.onStateDblClick = function (e, type) {
        if (Id == null || Id == undefined || Id == "" || Id <= 0) {
            var me = this;
            if (me.stateConfiguration.dblClickHandler) {
                if (confirm('Remove this step?')) {

                    //delete from multiple sources to targets
                    var index = TargetConnections.indexOf(e);
                    if (index > -1) {
                        TargetConnections.splice(index, 1);
                    }

                    var getdata = dataconnections.filter(x => x.SourceId === e).map(x => x.TargetId);
                    if (getdata.length > 0) {
                        for (var k = 0; k < getdata.length; k++) {
                            var index1 = TargetConnections.indexOf(getdata[k]);
                            if (index1 > -1) {
                                TargetConnections.splice(index1, 1);
                            }
                        }
                    }
                    //end...


                    if (e.indexOf('segment') > -1 && chkGroup == 1) { chkGroup = 0; }
                    else if (e.indexOf('goal') > -1 && chkGoal == 1) { chkGoal = 0; }

                    me.stateConfiguration.dblClickHandler(e);
                }

            }
        }
        else {
            ShowErrorMessage("Sorry, you can't delete node(s)");
        }

    }
    //==========================================================





    //==========================================================
    jsPlumb.ready(function () {


        Type = $.urlParam("Type");
        NodeCount = $.urlParam("NodeCount");
        var builder = new jspInstance();

        builder.stateConfiguration.clickHandler = function (e) {

            workflowUtil.ShowConfigurationSettingByNode(e);
        }
        builder.stateConfiguration.dblClickHandler = function (e) { builder.removeState(e); }
        builder.initialize();


        //get workflow
        var EditUrl = "";
        if ($.urlParam("tempid") > 0) {
            EditUrl = "/WorkFlow/Create/GetWorkFlowTemplateById?TemplateId=" + $.urlParam("tempid");
        }
        else if ($.urlParam("WorkflowId") > 0) {

            EditUrl = "/WorkFlow/Create/GetWorkFlowById?WorkflowId=" + $.urlParam("WorkflowId");
        }
        $.ajax({
            url: EditUrl,
            type: 'post',
            dataType: 'json',
            success: function (json) {
                console.log(json.Flowchart);
                WorkFlow.FlowContent = json.Flowchart;
                builder.initializeData(WorkFlow.FlowContent);

                if (workflowstatus == 2 && ArrayConfig != null) {
                    for (i = 0; i < ArrayConfig.length; i++) {
                        var title = ArrayConfig[i].Title;
                        var showTitle = title.indexOf("~") > -1 ? title.toString().split('~')[0] : title;
                        if (showTitle.indexOf("^1") > -1) {
                            $('#imgabrule' + ArrayConfig[i].Channel).css("display", "block");
                        }
                        showTitle = showTitle.replace("^0", "").replace("^1", "");
                        $("#title" + ArrayConfig[i].Channel).text(showTitle.length > 25 ? showTitle.substring(0, 25) + ".." : showTitle);
                    }
                }

            },
        });

        //Make element draggable
        var x = null;
        $(".dragnode").draggable({
            drag: function () {
                addchk = 1;
            },
            helper: 'clone',
            cursor: 'move',
            tolerance: 'fit'
        });

        $("#flowchart").droppable({
            drop: function (e, ui) {

                if (addchk == 1) {
                    addchk = 0;
                    var dragdv = $(ui.draggable).attr("typeof");
                    var label = $(ui.draggable)[0].title;
                    if (dragdv != "") {
                        x = ui.helper.clone();
                        //console.log(x);

                        var e = x[0];
                        var getleft = e.style.left.replace("px", "");
                        var gettop = e.style.top.replace("px", "");

                        window.console.log(getleft);
                        window.console.log(gettop);


                        var achorList = workflowUtil.GetAnchorList(dragdv);

                        numberOfElements = numberOfElements + 1;
                        builder.addData(dragdv, label, getleft - 250, gettop - 40, achorList);
                    }
                }

            }
        });

        //end of draggable

    });

}
var workflowUtil = {
    GetAnchorList: function (NodeType) {

        var NodesAndItsAnchors = {
            "sms": ["Send", "Deliver", "Click", "Not Click", "Bounce"],
            "mail": ["Deliver", "Open", "Not Open", "Click", "Not Click", "Bounce"],
            "form": ["Response", "Not Response", "Dismiss"],
            "chat": ["Response", "Not Response", "Dismiss"],

            "webpush": ["Push", "View", "Click", "Not Click", "Dismiss", "Bounce"],
            "inappbanner": ["View", "Click", "Not Click", "Dismiss"],

            "apppush": ["Push", "View", "Click", "Not Click", "Dismiss", "Bounce"],
            "fbpush": ["Push", "Click", "Not Click", "Unsubscribe"],
            "ussd": ["Deliver", "Click", "Not Click"],
            "obd": ["Deliver", "Picked", "Reject"],
            "broadcast": ["Deliver"],

            "rule": ["Satisfy", "Not Satisfy"],
            "dateandtime": ["Satisfy"],
            "segment": ["Satisfy"],
            "alert": [],
            "goal": [],
            "end": []
        }
        return NodesAndItsAnchors[NodeType]
    },
    GetClassNameByNodeType: function (NodeType) {

        var NodesAndItsClass = {
            "sms": "actions_icons",
            "mail": "actions_icons",
            "form": "actions_icons",
            "chat": "actions_icons",
            "webpush": "actions_icons",
            "inappbanner": "actions_icons",

            "apppush": "actions_icons",
            "fbpush": "actions_icons",
            "ussd": "actions_icons",
            "obd": "actions_icons",
            "broadcast": "actions_icons",

            "rule": "flow_control_icons",
            "dateandtime": "flow_control_icons",
            "segment": "flow_control_icons",
            "alert": "flow_control_icons",
            "goal": "flow_control_icons",
            "end": "flow_control_icons"
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
    ShowConfigurationSettingByNode: function (obj) {

        var nodeType = obj.attr("nodetype");
        NodeText = nodeType.toLowerCase().replace(/ /g, '');
        ClickedNodeId = obj.attr('id');

        if (nodeType == "dateandtime") {
            bindDDl(1);
            var getdata = dataconnections.filter(x => x.TargetId === ClickedNodeId).map(x => x.SourceId);
            if (getdata.length != 0) { if (getdata[0].indexOf("state_mail_") > -1 && getdata.length == 1) { bindDDl(0); } }
        }


        $(".bgShadedDiv").show();
        $("#dvcustompopup" + NodeText).toggle('slow');
        var result = "";
        if (ArrayConfig != null) {
            result = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Value)
        }
        else { result == "" }
        if (result != '') {
            $("#btnsavemaildetails").attr('value', 'Update');
            $("#btnSaveSms").attr('value', 'Update');
            $("#btnSaveform").attr('value', 'Update');
            $("#btnSavechat").attr('value', 'Update');
            $("#btnSaveRule").attr('value', 'Update');
            $("#btnSaveGoal").attr('value', 'Update');
            $("#btnsegment").attr('value', 'Update');
            $("#btnSavewebpush").attr('value', 'Update');
            $("#btnSaveinappbanner").attr('value', 'Update');
            $("#btnSaveapppush").attr('value', 'Update');
            $("#btnSaveobd").attr('value', 'Update');

            if (publishstatus != 1) {
                $("#btngroupdetails").attr('value', 'Update');
                $("#btnsavecontatcs").attr('value', 'Update');
            } else {
                $("#btngroupdetails").css("display", "none");
                $("#btnsavecontatcs").css("display", "none");
                $("#btnallusers").css("display", "none");
            }

            $("#btndateandtime").attr('value', 'Update');
            $("#btnAlterResponsesSave").attr('value', 'Update');
            $("#btnSavefbpush").attr('value', 'Update');
            $("#btnSavebroadcast").attr('value', 'Update');
            if ($.urlParam("WorkflowId") > 0) {
                if (NodeText == 'dateandtime') {
                    var datetime = result.toString().split("`");
                    $.ajax({
                        url: "/WorkFlow/Create/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'ConfigureId': WorkflowId, 'NodeText': ClickedNodeId }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            if ((response.length > 0) && response[0].Time == 0) {
                                $('#radproceed').attr('checked', true);
                                $("#ui_dlltimetype").prop("disabled", true);
                                $("#td_ui_dllworkflowdayofweek,#td_ui_dllworkflowdayofmonth").hide();
                                $("#txtdateandtime1").prop("disabled", false);
                                $("#txtdateandtime2").prop("disabled", true);
                                $("#ddldatecondition").prop("disabled", false);
                                $("#txttime").prop("disabled", true);
                                $("#ui_dllworkflowTime1").prop("disabled", false);
                                var Splitdate = response[0].DateValue.split("T");
                                $("#txtdateandtime1").val(Splitdate[0]);

                                var time = "";
                                if (response[0].DateValue != "") {
                                    var event = new Date(response[0].DateValue);
                                    event.setHours(event.getHours() + 5.3);
                                    event.setMinutes(event.getMinutes() + 30);
                                    time = event.getHours()
                                }

                                $("#ui_dllworkflowTime1").val(time);
                                $("#ddldatecondition").val(response[0].DateCondition).change();

                                if (response[0].DateCondition == 4) {
                                    $('#radproceed').attr('checked', true);
                                    $("#ui_dlltimetype").prop("disabled", true);
                                    $("#txtdateandtime1").prop("disabled", false);
                                    $("#txtdateandtime2").prop("disabled", false);
                                    $("#ddldatecondition").prop("disabled", false);
                                    $("#txttime").prop("disabled", true);
                                    $("#ui_dllworkflowTime1").prop("disabled", false);
                                    $('#radwaitfor').attr('checked', false);
                                    var Splitdate = response[0].DateValueTo.split("T");
                                    $("#txtdateandtime2").val(Splitdate[0]);
                                }
                                else if (response[0].DateCondition == 5) {
                                    $("#ui_dllworkflowTime1").prop("disabled", false);
                                    $("#ui_dllworkflowTime1").val(time);
                                    //$("#ui_dllworkflowTime1").val(Splitdate[1].substring(0, 2));
                                }
                                else if (response[0].DateCondition == 6) {
                                    $("#ui_dllworkflowTime1").prop("disabled", false);
                                    $("#ui_dllworkflowTime1").val(time);
                                    //$("#ui_dllworkflowTime1").val(Splitdate[1].substring(0, 2));
                                    $("#ui_dllworkflowdayofweek").val(response[0].DaysOfWeek);
                                }
                                else if (response[0].DateCondition == 7) {
                                    $("#ui_dllworkflowTime1").prop("disabled", false);
                                    $("#ui_dllworkflowdayofmonth").val(response[0].DaysOfMonth);
                                }
                            }
                            else {

                                var condloop = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Datecondition);
                                if (condloop > 0) {
                                    $('#radproceed').attr('checked', true);
                                    $("#ui_dlltimetype").prop("disabled", true);
                                    $("#txtdateandtime1").prop("disabled", false);
                                    $("#txtdateandtime2").prop("disabled", false);
                                    $("#ddldatecondition").prop("disabled", false);
                                    $("#txttime").prop("disabled", true);
                                    $("#ui_dllworkflowTime1").prop("disabled", false);
                                    $('#radwaitfor').attr('checked', false);
                                    $("#ddldatecondition").val(ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Datecondition));

                                    if (condloop == 1) { $("#txtdateandtime2").prop("disabled", true); }
                                    if (condloop < 4) {
                                        $("#txtdateandtime1").val(datetime[0]);
                                        $("#ui_dllworkflowTime1").val(datetime[1]);
                                    }
                                    if (condloop == 5) {
                                        $("#td_txtdateandtime1,#td_txtdateandtime2,#td_ui_dllworkflowdayofweek,#td_ui_dllworkflowdayofmonth").hide();
                                        $("#td_ui_dllworkflowTime1").show();
                                        $("#ui_dllworkflowTime1").val(datetime[0]);
                                    }
                                    else if (condloop == 6) {
                                        $("#td_txtdateandtime1,#td_txtdateandtime2,#td_ui_dllworkflowdayofmonth").hide();
                                        $("#td_ui_dllworkflowdayofweek,#td_ui_dllworkflowTime1").show();
                                        $("#ui_dllworkflowTime1").val(datetime[1]);
                                        $("#ui_dllworkflowdayofweek").val(datetime[0]);
                                    }
                                    else {
                                        $("#txtdateandtime1").val(datetime[0]);
                                        $("#txtdateandtime2").val(datetime[2]);
                                        $("#ui_dllworkflowTime1").val(datetime[1]);
                                    }
                                }
                                else {
                                    $('#radproceed').attr('checked', false);
                                    $('#radwaitfor').attr('checked', true);
                                    //if ((response.length > 0)) {
                                    //    $("#txttime").val(response[0].TimeType.substring(0, 1));
                                    //} 

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
                        },
                        error: ShowAjaxError
                    });

                }

                if (NodeText == 'segment') {
                    if (ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Title).toString().indexOf("individual") > -1) {
                        selecttab('2', '1', '3');
                        contactIds = result.toString().split(",");
                    }
                    else if (ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Title).toString().indexOf("Allusers") > -1) {
                        selecttab('3', '2', '1');
                        $('#chkallusers').attr('checked', true);

                    }
                    else if (ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Title).toString().indexOf("group~belong") > -1 || ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Title).toString().indexOf("group~notbelong") > -1) {
                        if (ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Title).toString().indexOf("~0") > -1) { $('#chkgrpnotbelongs').attr('checked', true); }

                        selecttab('1', '2', '3');
                        GroupIds = result.toString().split(",");
                        if (workflowstatus != 2) {
                            $.ajax({
                                url: "/WorkFlow/Create/chkbelongstogrp",
                                type: 'POST',
                                data: JSON.stringify({ 'WorkflowId': WorkflowId }),
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function (response) {
                                    if (response[0].IsBelongToGroup == true) {
                                        $('#chkgrpbelongs').attr('checked', true);
                                    }
                                    if (response[0].IsBelongToGroup == false) {
                                        $('#chkgrpnotbelongs').attr('checked', true);
                                    }
                                },
                                error: ShowAjaxError
                            });
                        }
                    }

                }
                if (NodeText == 'alert') {
                    //result = 2;
                    $.ajax({
                        url: "/WorkFlow/Create/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            alterReponses.ConfigureAlertId = parseInt(result);
                            //Alert
                            $("#ui_txtReportThroughEmail").val(response.AlertThroughEmail);
                            $("#ui_txtReportThroughSMS").val(response.AlertThroughSMS);
                            $("#ui_txtReportThroughCall").val(response.AlertThroughCall);

                            if (response.WebPushUsers != null) {
                                var webpususers = response.WebPushUsers.split(',');
                                if (webpususers.length > 0) {
                                    $("#ui_txtWebpush_values").empty();
                                    for (var i = 0; i < webpususers.length; i++) {
                                        var WebPushUsers = JSLINQ(userList).Where(function (item) { return parseInt(item.value) == parseInt(webpususers[i]) });
                                        if (WebPushUsers != null) {
                                            if (WebPushUsers.items.length > 0) {
                                                var data = new Array();
                                                data["item"] = new Array();
                                                data.item.value = WebPushUsers.items[0].value;
                                                data.item.label = WebPushUsers.items[0].label;
                                                AppendSelected("ui_txtWebpush_values", data, "webpush");
                                            }
                                        }

                                    }
                                }
                            }

                            if (response.AppPushUsers != null) {
                                var appPushUsers = response.AppPushUsers.split(',');
                                if (appPushUsers.length > 0) {
                                    $("#ui_txtMobilepush_values").empty();
                                    for (var i = 0; i < appPushUsers.length; i++) {
                                        var AppPushUsers = JSLINQ(groupList).Where(function (item) { return parseInt(item.value) == parseInt(appPushUsers[i]) });
                                        if (AppPushUsers != null) {
                                            if (AppPushUsers.items.length > 0) {
                                                var data = new Array();
                                                data["item"] = new Array();
                                                data.item.value = AppPushUsers.items[0].value;
                                                data.item.label = AppPushUsers.items[0].label;
                                                AppendSelected("ui_txtMobilepush_values", data, "mobilepush");
                                            }
                                        }

                                    }
                                }
                            }

                            //AppendSelected("ui_txtWebpush_values", response.WebPushUsers, "webpush");
                            //AppendSelected("ui_txtMobilepush_values", response.AppPushUsers, "mobilepush");

                            //Plugins
                            $("#ui_txtAlertWebHookUrl").val(response.WebHooksUrl);
                            $("#ui_tblHeader").empty();
                            if (response.WebHookMethodType != null) {
                                $("#ui_ddMethodType").val(response.WebHookMethodType);
                            } else {
                                $("#ui_ddMethodType").val(0);
                            }

                            var Header = JSON.parse(response.WebHookHeader);
                            if (Header.length > 0) {
                                $.each(Header, function (i) {
                                    i = i + 1;
                                    AddNewKeyValue(i);
                                    RemoveKeyValue(1);
                                    i = i + 1;
                                    $("#ui_txtheaderKey" + i).val($(this)[0].Key);
                                    $("#ui_txtheaderValue" + i).val($(this)[0].Value);
                                });
                            }
                            else {
                                AddNewKeyValue(0);
                            }


                            var Params = JSON.parse(response.WebHookParams);
                            if (Params != null && Params.length > 0) {
                                $.each(Params, function (i) {
                                    $("#ui_txtWebhookColumn_" + $(this)[0].ColumnName).val($(this)[0].Value);
                                });
                            }

                            var ParamsExtra = JSON.parse(response.WebHookExtraParams);
                            if (ParamsExtra != null && ParamsExtra.length > 0) {
                                for (var i = 0; i < ParamsExtra.length > 0; i++) {
                                    var j = i + 1;
                                    AddNewParams(1);
                                    $("#ui_tdparams" + j).val(ParamsExtra[i].ColumnName);
                                    $("#ui_tdvalue" + j).val(ParamsExtra[i].Value);
                                }
                            }


                            //others
                            // $("#ui_ddlAlertGroupList option:selected").val(response.GroupId);
                            $("#ui_txtRedirectUrl").val(response.RedirectUrl);

                            if (response.GroupId != null) {
                                setTimeout(function () { $("#ui_ddlAlertGroupList").val(response.GroupId); }, 2000);

                            }
                            else { $("#ui_ddlAlertGroupList").val(0); }

                            if (response.AssignLeadToUserId != null) {
                                setTimeout(function () { $("#ui_ddlAlertUserList").val(response.AssignLeadToUserId); }, 2000);
                            }
                            else { $("#ui_ddlAlertGroupList").val(0); }


                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'sms') {
                    $.ajax({
                        url: "/WorkFlow/Create/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            if (response.IsPromotionalOrTransactionalType == true) { $('#radsmstranmsg').prop('checked', true); }
                            else if (response.IsPromotionalOrTransactionalType == false) { $('#radsmspromomsg').prop('checked', true); }
                            $("#ddlsmstempId").val(response.SmsTemplateId);
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'form') {
                    $.ajax({
                        url: "/WorkFlow/Create/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlformtype").val(response.FormType);
                            var fortmtype = response.FormType;
                            formDetails.BindAllFormsToDropDown(fortmtype, "");
                            $("#ddlactiveform").val(response.FormId);
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'mail') {

                    $.ajax({
                        url: "/WorkFlow/Create/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlmailtempId").val(response.MailTemplateId);
                            $("#txtmailsubject").val(response.MailSubject);
                            $("#txtmailfromname").val(response.FromName);
                            $("#ddlfromemailId").val(response.FromEmailId);
                            $("#txtReplyemailid").val(response.ReplyToEmailId);
                            if (response.IsPromotionalOrTransactionalType == true) { $('#radmailtranmsg').prop('checked', true); }
                            else if (response.IsPromotionalOrTransactionalType == false) { $('#radmailpromomsg').prop('checked', true); }
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'chat') {
                    $.ajax({
                        url: "/WorkFlow/Create/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlchat").val(response.ChatId);
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'rule') {
                    $("#ddlruleId").val(result);
                    $.ajax({
                        url: "/WorkFlow/Create/GetruleforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'workflowId': WorkflowId }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            if (response.length > 0) { $("#btnSaveRule").hide(); }
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'goal') {
                    $("#ddlgoalId").val(result);
                }
                if (NodeText == 'apppush') {
                    $.ajax({
                        url: "/WorkFlow/Create/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlapppush").val(response.MobileCampaignId);
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'webpush') {
                    $.ajax({
                        url: "/WorkFlow/Create/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlwebpush").val(response.CampaignId);
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'obd') {
                    $.ajax({
                        url: "/WorkFlow/Create/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlobd").val(response.AudioTemplateId);
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'inappbanner') {
                    $.ajax({
                        url: "/WorkFlow/Create/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlinappbanner").val(response.MobileCampaignId);
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'fbpush') {
                    $.ajax({
                        url: "/WorkFlow/Create/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlfbpush").val(response.CampaignId);
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'broadcast') {
                    $.ajax({
                        url: "/WorkFlow/Create/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {

                            $("#txtmsg").val(response.Message);
                            if (response.Twitter == 1) {
                                $("#chktwitter").prop('checked', true);
                            } else if (response.Twitter == 0) {
                                $("#chktwitter").prop('checked', false);
                            }
                            if (response.Facebook == 1) {
                                $("#chkfb").prop('checked', true);
                            } else if (response.Facebook == 0) {
                                $("#chkfb").prop('checked', false);
                            }
                            if (response.LinkedIn == 1) {
                                $("#chklnkin").prop('checked', true);
                            } else if (response.LinkedIn == 0) {
                                $("#chklnkin").prop('checked', false);
                            }


                        },
                        error: ShowAjaxError
                    });
                }
            }
            else {
                if (NodeText == 'dateandtime') {
                    var datetime = result.toString().split("`");

                    if (datetime.length == 1) {
                        $('#radproceed').attr('checked', false);
                        $('#radwaitfor').attr('checked', true);
                        $("#ddldatecondition").val(ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Datecondition));
                        if (datetime.indexOf("Min") > -1) {
                            $("#txttime").val(datetime.toString().replace("Min", ""));
                            $("#ui_dlltimetype").val(0);
                        }
                        else if (datetime.indexOf("Hours") > -1) {
                            $("#txttime").val(datetime.toString().replace("Hours", ""));
                            $("#ui_dlltimetype").val(1);
                        }
                        else if (datetime.indexOf("Day") > -1) {
                            $("#txttime").val(datetime.toString().replace("Day", ""));
                            $("#ui_dlltimetype").val(2);
                        }
                    }
                    else if (datetime.length == 2) {
                        $('#radproceed').attr('checked', true); $("#ui_dlltimetype").prop("disabled", true); $("#txtdateandtime1").prop("disabled", false); $("#txtdateandtime2").prop("disabled", true); $("#ddldatecondition").prop("disabled", false); $("#txttime").prop("disabled", true); $("#ui_dllworkflowTime1").prop("disabled", false);
                        $('#radwaitfor').attr('checked', false);
                        $("#ddldatecondition").val(ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Datecondition));
                        $("#txtdateandtime1").val(datetime[0]);
                        $("#ui_dllworkflowTime1").val(datetime[1]);
                    }
                    else if (datetime.length == 3) {
                        $("#ddldatecondition").val(4);
                        $('#radproceed').attr('checked', true); $("#ui_dlltimetype").prop("disabled", true); $("#txtdateandtime1").prop("disabled", false); $("#txtdateandtime2").prop("disabled", false); $("#ddldatecondition").prop("disabled", false); $("#txttime").prop("disabled", true); $("#ui_dllworkflowTime1").prop("disabled", false);
                        $('#radwaitfor').attr('checked', false);
                        $("#txtdateandtime1").val(datetime[0]);
                        $("#txtdateandtime2").val(datetime[2]);
                        $("#ui_dllworkflowTime1").val(datetime[1]);
                    }
                }

                if (NodeText == 'segment') {

                    //var Checkboxname = "";
                    //if (ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Title) == "Individual") {
                    //    Checkboxname = "#chk_";
                    //    selecttab('2', '1');
                    //}
                    //else if (ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Title) == "Group") {
                    //    selecttab('1', '2');
                    //    Checkboxname = "#chkGroup_";
                    //}
                    //selectedsegmentids = result.toString().split(",");

                    if (ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Title).toString().indexOf("individual") > -1) {
                        selecttab('2', '1');
                    }
                    else if (ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Title).toString().indexOf("group") > -1) {
                        selecttab('1', '2');
                    }
                    selectedsegmentids = result.toString().split(",");
                }
                if (NodeText == 'alert') {
                    //result = 2;
                    $.ajax({
                        url: "/WorkFlow/Create/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            alterReponses.ConfigureAlertId = parseInt(result);
                            //Alert
                            $("#ui_txtReportThroughEmail").val(response.AlertThroughEmail);
                            $("#ui_txtReportThroughSMS").val(response.AlertThroughSMS);
                            $("#ui_txtReportThroughCall").val(response.AlertThroughPush);

                            if (response.WebPushUsers != null) {
                                var webpususers = response.WebPushUsers.split(',');
                                if (webpususers.length > 0) {
                                    $("#ui_txtWebpush_values").empty();
                                    for (var i = 0; i < webpususers.length; i++) {
                                        var WebPushUsers = JSLINQ(userList).Where(function (item) { return parseInt(item.value) == parseInt(webpususers[i]) });
                                        if (WebPushUsers != null) {
                                            if (WebPushUsers.items.length > 0) {
                                                var data = new Array();
                                                data["item"] = new Array();
                                                data.item.value = WebPushUsers.items[0].value;
                                                data.item.label = WebPushUsers.items[0].label;
                                                AppendSelected("ui_txtWebpush_values", data, "webpush");
                                            }
                                        }

                                    }
                                }
                            }

                            if (response.AppPushUsers != null) {
                                var appPushUsers = response.AppPushUsers.split(',');
                                if (appPushUsers.length > 0) {
                                    $("#ui_txtMobilepush_values").empty();
                                    for (var i = 0; i < appPushUsers.length; i++) {
                                        var AppPushUsers = JSLINQ(groupList).Where(function (item) { return parseInt(item.value) == parseInt(appPushUsers[i]) });
                                        if (AppPushUsers != null) {
                                            if (AppPushUsers.items.length > 0) {
                                                var data = new Array();
                                                data["item"] = new Array();
                                                data.item.value = AppPushUsers.items[0].value;
                                                data.item.label = AppPushUsers.items[0].label;
                                                AppendSelected("ui_txtMobilepush_values", data, "mobilepush");
                                            }
                                        }

                                    }
                                }
                            }

                            //AppendSelected("ui_txtWebpush_values", response.WebPushUsers, "webpush");
                            //AppendSelected("ui_txtMobilepush_values", response.AppPushUsers, "mobilepush");

                            if (response.MobileNotificationUrl != null) { $("#ui_AppendStaticMobileWebHookUrl").prop("checked", true); $("#ui_txtReportThroughMobileNotifications").val(response.MobileNotificationUrl); }


                            //Plugins
                            $("#ui_txtAlertWebHookUrl").val(response.WebHooksUrl);
                            $("#ui_tblHeader").empty();
                            if (response.WebHookMethodType != null) {
                                $("#ui_ddMethodType option:selected").val(response.WebHookMethodType);
                            } else {
                                $("#ui_ddMethodType option:selected").val(0);
                            }
                            $("#ui_txtheaderKey2").val(response.WebHookHeader);
                            var Header = JSON.parse(response.WebHookHeader);
                            $.each(Header, function (i) {
                                i = i + 1;
                                AddNewKeyValue(i);
                                RemoveKeyValue(1);
                                i = i + 1;
                                $("#ui_txtheaderKey" + i).val($(this)[0].Key);
                                $("#ui_txtheaderValue" + i).val($(this)[0].Value);

                            });

                            var Params = JSON.parse(response.WebHookParams);
                            $.each(Params, function (i) {
                                $("#ui_txtWebhookColumn_" + $(this)[0].ColumnName).val($(this)[0].Value);
                            });

                            //others
                            $("#ui_txtRedirectUrl").val(response.RedirectUrl);
                            if (response.AssignLeadToUserId == null) { $("#ui_ddlAlertGroupList").val(0); }
                            else { $("#ui_ddlAlertGroupList").val(response.GroupId); }
                            if (response.AssignLeadToUserId == null) { $("#ui_ddlAlertUserList").val(0); }
                            else { $("#ui_ddlAlertUserList").val(response.AssignLeadToUserId); }

                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'sms') {
                    $.ajax({
                        url: "/WorkFlow/Create/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            if (response.IsPromotionalOrTransactionalType == true) { $('#radsmstranmsg').prop('checked', true); }
                            else if (response.IsPromotionalOrTransactionalType == false) { $('#radsmspromomsg').prop('checked', true); }
                            $("#ddlsmstempId").val(response.SmsTemplateId);
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'form') {
                    $.ajax({
                        url: "/WorkFlow/Create/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlformtype").val(response.FormType);
                            var fortmtype = response.FormType;
                            formDetails.BindAllFormsToDropDown(fortmtype, "");
                            $("#ddlactiveform").val(response.FormId);
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'mail') {
                    $.ajax({
                        url: "/WorkFlow/Create/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlmailtempId").val(response.MailTemplateId);
                            $("#txtmailsubject").val(response.MailSubject);
                            $("#txtmailfromname").val(response.FromName);
                            $("#ddlfromemailId").val(response.FromEmailId);
                            $("#txtReplyemailid").val(response.ReplyToEmailId);
                            if (response.IsPromotionalOrTransactionalType == true) { $('#radmailtranmsg').prop('checked', true); }
                            else if (response.IsPromotionalOrTransactionalType == false) { $('#radmailpromomsg').prop('checked', true); }
                            if (response.Subscribe == 1) { $('#chkUnsubscribe').prop('checked', true); }
                            else if (response.Subscribe == 0) { $('#chkUnsubscribe').prop('checked', false); }

                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'chat') {
                    $.ajax({
                        url: "/WorkFlow/Create/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlchat").val(response.ChatId);
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'rule') {
                    $("#ddlruleId").val(result);
                }
                if (NodeText == 'apppush') {
                    $.ajax({
                        url: "/WorkFlow/Create/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlapppush").val(response.MobileCampaignId);
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'webpush') {
                    $.ajax({
                        url: "/WorkFlow/Create/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlwebpush").val(response.CampaignId);
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'obd') {
                    $.ajax({
                        url: "/WorkFlow/Create/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlobd").val(response.AudioTemplateId);
                        },
                        error: ShowAjaxError
                    });
                }
                if (NodeText == 'inappbanner') {
                    $.ajax({
                        url: "/WorkFlow/Create/GetTemplateforEdit",
                        type: 'POST',
                        data: JSON.stringify({ 'ConfigureId': parseInt(result), 'NodeText': NodeText }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            $("#ddlinappbanner").val(response.MobileCampaignId);
                        },
                        error: ShowAjaxError
                    });
                }
            }
        }
        else {
            $("#btnsavemaildetails").attr('value', 'Save');
            $("#btnSaveSms").attr('value', 'Save');
            $("#btnSaveform").attr('value', 'Save');
            $("#btnSavechat").attr('value', 'Save');
            $("#btnSaveRule").attr('value', 'Save');
            $("#btnSaveGoal").attr('value', 'Save');
            $("#btnsegment").attr('value', 'Save');
            $("#btnSavewebpush").attr('value', 'Save');
            $("#btnSaveinappbanner").attr('value', 'Save');
            $("#btnSaveapppush").attr('value', 'Save');
            $("#btnSaveobd").attr('value', 'Save');
            $("#btngroupdetails").attr('value', 'Save');
            $("#btnsavecontatcs").attr('value', 'Save');
            $("#btndateandtime").attr('value', 'Save');
            $("#btnAlterResponsesSave").attr('value', 'Save');
            $("#btnSavefbpush").attr('value', 'Save');
            $("#btnSavebroadcast").attr('value', 'Save');
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

        if (WorkflowId == 0) {

            WorkFlowBasicDetails.Title = CleanText($("#ui_txtWorkFlowTitle").val());
            WorkFlowBasicDetails.Status = 2;
            WorkFlowBasicDetails.Flowchart = flowChartJson;
            WorkFlowBasicDetails.ArrayConfig = JSON.stringify(ArrayConfig);
            if (WorkflowId != 0) { WorkFlowBasicDetails.WorkflowId = WorkflowId; }
            else { WorkFlowBasicDetails.WorkflowId = 0; }

            $.ajax({
                url: "/WorkFlow/Create/StoreBasicDetails",
                type: 'POST',
                data: JSON.stringify({ 'WorkFlowBasicDetails': WorkFlowBasicDetails }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: true,
                success: function (response) {
                    if (response == -1) {
                        ShowErrorMessage("This Workflow title already exist!");
                        $("#btnSave").css("display", "block");
                        $("#btnSavedraft").css("display", "block");
                        $("#btnstop").css("display", "none");
                    }
                    else {
                        WorkflowId = response;


                        for (var n = 0; n < flowChartdata.nodes.length; n++) {
                            var value = getchannelvalue(flowChartdata.nodes, flowChartdata.nodes[n].blockId);
                            if (getchannelvalue(flowChartdata.nodes, flowChartdata.nodes[n].blockId) == 0) {
                                var Notconfig = flowChartdata.nodes[n].blockId.split("_");
                                if (Notconfig[1] != "end") { ShowErrorMessage("You have not configured " + Notconfig[1].toUpperCase()); $("#btnSave").css("display", "block"); $("#btnSavedraft").css("display", "block"); $("#btnstop").css("display", "none"); $("#dvLoading").hide(); return; }

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
                            ShowErrorMessage("Please add at least one channel and one flow control to this Work-Flow!");
                        }
                        else if (result == undefined) {
                            ShowErrorMessage("Please add at least one Audience or Rule before your channel!");
                        }
                        else if ((result != undefined) && result.SegmentId == 0 && result.RulesId == 0 && (result.Channel.indexOf('mail') > -1 || result.Channel.indexOf('sms') > -1)) {
                            var getcha = result.Channel.split('_');
                            ShowErrorMessage("Add group before " + getcha[1] + "(" + result.ConfigName + ") channel");
                        }
                        else if (freenode.length > 0) {
                            ShowErrorMessage(freenode);
                        }
                        else {
                            var data = {
                                json: JSON.stringify(allchannel),
                            };

                            $.ajax({
                                url: "/WorkFlow/Create/SaveFlowchart",
                                type: 'post',
                                dataType: 'json',
                                data: data,
                                success: function (json) {
                                    if (json == 0) {
                                        WorkFlowBasicDetails.WorkflowId = WorkflowId;
                                        WorkFlowBasicDetails.Title = $('#ui_spnWorkFlowName').text();
                                        WorkFlowBasicDetails.Status = 1;
                                        WorkFlowBasicDetails.Flowchart = flowChartJson;
                                        WorkFlowBasicDetails.ArrayConfig = JSON.stringify(ArrayConfig);
                                        $.ajax({
                                            url: "/WorkFlow/Create/UpdateWorkflowchart",
                                            type: 'POST',
                                            data: JSON.stringify({ 'WorkFlowBasicDetails': WorkFlowBasicDetails }),
                                            contentType: "application/json; charset=utf-8",
                                            dataType: "json",
                                            success: function (result) {
                                                if (result == 0) {
                                                    $("#dvLoading").hide();
                                                    ShowErrorMessage("Workflow is Created Successfully");
                                                    $("#btnSave").css("display", "none");
                                                    $("#btnSavedraft").css("display", "none");
                                                    $("#btnstop").css("display", "block");
                                                }
                                                else { ShowErrorMessage("Something went Wrong!"); }
                                            },
                                            error: ShowAjaxError
                                        });

                                    } else {
                                        ShowErrorMessage("Something went Wrong!");
                                    }
                                },
                            });
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
                    if (Notconfig[1] != "end") { ShowErrorMessage("You have not configured " + Notconfig[1].toUpperCase()); $("#btnSave").css("display", "block"); $("#btnSavedraft").css("display", "block"); $("#btnstop").css("display", "none"); $("#dvLoading").hide(); return; }

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
                ShowErrorMessage("Please add at least one channel and one flow control to this Work-Flow!");
            }
            else if (result == undefined && flowChartdata.nodes[0].blockId.match(/(mail|sms|ussd|obd)/)) {
                ShowErrorMessage("Please add at least one Audience or Rule before your channel!");
            }
            else if ((result != undefined) && result.SegmentId == 0 && result.RulesId == 0 && (result.Channel.indexOf('mail') > -1 || result.Channel.indexOf('sms') > -1)) {
                var getcha = result.Channel.split('_');
                ShowErrorMessage("Add group before " + getcha[1] + "(" + result.ConfigName + ") channel");
            }
            else if (freenode.length > 0) {
                ShowErrorMessage(freenode);
            }
            else {

                var data = {
                    json: JSON.stringify(allchannel),
                };

                $.ajax({
                    url: "/WorkFlow/Create/SaveFlowchart",
                    type: 'post',
                    dataType: 'json',
                    data: data,
                    success: function (json) {
                        if (json == 0) {
                            WorkFlowBasicDetails.WorkflowId = WorkflowId;
                            WorkFlowBasicDetails.Title = $('#ui_spnWorkFlowName').text();
                            WorkFlowBasicDetails.Status = 1;
                            WorkFlowBasicDetails.Flowchart = flowChartJson;
                            WorkFlowBasicDetails.ArrayConfig = JSON.stringify(ArrayConfig);
                            $.ajax({
                                url: "/WorkFlow/Create/UpdateWorkflowchart",
                                type: 'POST',
                                data: JSON.stringify({ 'WorkFlowBasicDetails': WorkFlowBasicDetails }),
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function (result) {
                                    if (result == 0) {
                                        $("#dvLoading").hide();
                                        ShowErrorMessage("Workflow Published Successfully");
                                        $("#btnSave").css("display", "none");
                                        $("#btnSavedraft").css("display", "none");
                                        $("#btnstop").css("display", "block");
                                    }
                                    else { ShowErrorMessage("Something went Wrong!"); }
                                },
                                error: ShowAjaxError
                            });

                        } else {
                            ShowErrorMessage("Something went Wrong!");
                        }
                    },
                });
            }
        }

        window.history.pushState('', '', UpdateQueryString("WorkFlowId", WorkflowId));
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
        return MailSendingSetting;
    },
    GetsmsPopupDetails: function () {
        var data = {};
        data.SMSTemplateId = $("#ddlsmstempId").val();
        data.messagetype = $('input:radio[name=smsmessagetype]:checked').val();
        return data;
    },
    GetrulePopupDetails: function () {
        var data = {};
        data = null;//ruleConditions;
        return data;
    },
    GetgoalPopupDetails: function () {
        var data = {};
        data = null;//goalConditions;
        return data;
    },
    GetformPopupDetails: function () {
        var data = {};
        data.FormType = $("#ddlformtype").val();
        data.FormId = $('#ddlactiveform').val();
        return data;
    },
    GetchatPopupDetails: function () {
        var data = {};
        data.ChatId = $('#ddlchat').val();
        return data;
    },
    GetintervalPopupDetails: function () {
        var data = {};
        data.Days = $("#txtinterval").val();
        return data;
    },
    GetdateandtimePopupDetails: function () {
        var data = {};
        data.DateTimeValue1 = $("#txtdateandtime1").val() + " " + $("#ui_dllworkflowTime1").val() + ":00:00";
        data.DateTimeValue2 = $("#txtdateandtime2").val() + " " + $("#ui_dllworkflowTime2").val() + ":00:00";
        data.DateTimeType = $("#ui_dlldateandtimetype").val();
        return data;
    },
    GettimePopupDetails: function () {
        var data = {};
        data.Time = $("#dllworkflowTime").val() + ":00:00";
        return data;
    },
    GetsegmentPopupDetails: function () {
        var data = {};
        data.SegmentId = $("#ddlSegment").val();
        return data;
    },
    GetwebpushPopupDetails: function () {
        var data = {};
        data.CampaignId = $("#ddlwebpush").val();
        return data;
    },
    GetinappbannerPopupDetails: function () {
        var data = {};
        data.MobileCampaignId = $("#ddlinappbanner").val();
        return data;
    },
    GetapppushPopupDetails: function () {
        var data = {};
        data.MobileCampaignId = $("#ddlapppush").val();
        return data;
    },
    GetobdPopupDetails: function () {
        var data = {};
        data.AudioTemplateId = $("#ddlobd").val();
        return data;
    },
    GetfbpushPopupDetails: function () {
        var data = {};
        data.AudioTemplateId = $("#ddlfbpush").val();
        return data;
    },
    GetbroadcastPopupDetails: function () {
        var data = {};
        data.Message = $("#txtmsg").val();
        // data.messagetype = $('input:radio[name=chk]:checked').val();
        return data;
    },
    BindmailOnEdit: function (Nodedata) {
        $("#ddlmailtempId").val(Nodedata.MailTemplateId);
        $("#ddlfromemailId").val(Nodedata.FromEmailId);
        $("#txtReplyemailid").val(Nodedata.ReplyToEmailId);
        $("#txtmailfromname").val(Nodedata.FromName);
        $("#txtmailsubject").val(Nodedata.Subject);
        $('#chkUnsubscribe').prop('checked', Nodedata.Unsubscribe);
        $("#chkForward").prop('checked', Nodedata.Forward);
        $('input[type=radio][value=' + Nodedata.MessageType + ']').prop('checked', true);

    },
    BindsmsOnEdit: function (Nodedata) {
        $("#ddlsmstempId").val(Nodedata.SMSTemplateId);
        $('input[type=radio][value=' + Nodedata.messagetype + ']').prop('checked', true);

    },
    BindformOnEdit: function (Nodedata) {
        $("#ddlformtype").val(Nodedata.FormType);
        $("#ddlactiveform").val(Nodedata.FormId);
        $("#trform").show();
    },
    BindchatOnEdit: function (Nodedata) {
        $("#ddlchat").val(Nodedata.ChatId);
    },
    BindintervalOnEdit: function (Nodedata) {
        $("#txtinterval").val(Nodedata.Days);
    },
    BindwebpushOnEdit: function (Nodedata) {
        $("#ddlwebpush").val(Nodedata.CampaignId);
    },
    BindobdOnEdit: function (Nodedata) {
        $("#ddlobd").val(Nodedata.AudioTemplateId);
    },
    BindinappbannerOnEdit: function (Nodedata) {
        $("#ddlinappbanner").val(Nodedata.MobileCampaignId);
    },
    BindapppushOnEdit: function (Nodedata) {
        $("#ddlapppush").val(Nodedata.MobileCampaignId);
    },
    BinddateandtimeOnEdit: function (Nodedata) {
        var datentime = Nodedata.DateTimeValue1.split(' ');
        var time = datentime[1].split(':');
        $("#txtdateandtime1").val(datentime[0]);
        $("#ui_dllworkflowTime1").val(time[0]);
        if (Nodedata.DateTimeType == "3") {
            datentime = Nodedata.DateTimeValue2.split(' ');
            time = datentime[1].split(':');
            $("#txtdateandtime2").val(datentime[0]);
            $("#ui_dllworkflowTime2").val(time[0]);
            $("#trdatetime2").show();
        }
        $("#ui_dlldateandtimetype").val(Nodedata.DateTimeType);


    },
    BindtimeOnEdit: function (Nodedata) {
        var time = Nodedata.Time.split(':');
        $("#dllworkflowTime").val(time[0]);

    },
    BindsegmentOnEdit: function (Nodedata) {
        $("#ddlSegment").val(Nodedata.SegmentId);
    },
    BindruleOnEdit: function (Nodedata) {
        ruleConditions = Nodedata;
        workflowUtil.GetModifiedWorkFlowRule(ruleConditions);
    },
    GetModifiedWorkFlowRule: function (ruleConditions) {
        $.ajax({
            url: "/WorkFlow/Create/GetModifiedWorkFlowRule",
            type: 'POST',
            data: JSON.stringify({ 'workflowrule': ruleConditions }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    ruleConditions = response;
                    BindAudienceData(ruleConditions);
                    BindBehaviorData(ruleConditions);
                    BindInteractionData(ruleConditions);
                    BindInteractionEventData(ruleConditions);
                    BindProfileData(ruleConditions);
                    $("#dvRules").show();
                }

            }
        });
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
    },
    smsClearFields: function () {
        $('#ddlsmstempId').find('option:eq(0)').prop("selected", "selected");
        $("input:radio[name=smsmessagetype][value=" + 1 + "]").prop('checked', 'checked');
    },
    ruleClearFields: function () {
        $('#ddlruleId').find('option:eq(0)').prop("selected", "selected");
    },
    goalClearFields: function () {
        $('#ddlgoalId').find('option:eq(0)').prop("selected", "selected");
    },
    formClearFields: function () {
        $('#ddlformtype').find('option:eq(0)').prop("selected", "selected");
        $('#trform').hide();
    },
    chatClearFields: function () {
        $('#ddlchat').find('option:eq(0)').prop("selected", "selected");

    },
    timeClearFields: function () {
        $('#dllworkflowTime').find('option:eq(10)').prop("selected", "selected");

    },
    segmentClearFields: function () {
        $('#ddlSegment').find('option:eq(0)').prop("selected", "selected");
    },
    webpushClearFields: function () {
        $('#ddlwebpush').find('option:eq(0)').prop("selected", "selected");
    },
    fbpushClearFields: function () {
        $('#ddlfbpush').find('option:eq(0)').prop("selected", "selected");
    },
    broadcastClearFields: function () {
        $("#txtmsg").val("");
        $("#chklnkin").prop('checked', false);
        $("#chkfb").prop('checked', false);
        $("#chktwitter").prop('checked', false);
    },
    obdClearFields: function () {
        $('#ddlobd').find('option:eq(0)').prop("selected", "selected");
    },
    inappbannerClearFields: function () {
        $('#ddlinappbanner').find('option:eq(0)').prop("selected", "selected");
    },
    apppushClearFields: function () {
        $('#ddlapppush').find('option:eq(0)').prop("selected", "selected");
    },
    alertClearFields: function () {
        $("#ui_txtReportThroughEmail").val(""); $("#ui_txtReportThroughSMS").val(""); $("#ui_txtReportThroughCall").val("");
        $("#ui_txtReportThroughMobileNotifications").val(""); $("#ui_txtAlertWebHookUrl").val(""); $("#ui_txtRedirectUrl").val("");
        $('#ui_ddlAlertGroupList').find('option:eq(0)').prop("selected", "selected"); $('#ui_ddlAlertUserList').find('option:eq(0)').prop("selected", "selected");
    },
    intervalClearFields: function () {
        $('#txtinterval').val('');

    },
    dateandtimeClearFields: function () {
        $('#txtdateandtime1').val('');
        $('#txttime').val(1);
        $('#ui_dllworkflowTime1').find('option:eq(10)').prop("selected", "selected");
        $('#txtdateandtime2').val('');
        $('#ui_dllworkflowTime2').find('option:eq(10)').prop("selected", "selected");
        $('#ui_dlldateandtimetype').find('option:eq(6)').prop("selected", "selected");
        $('#ddldatecondition').find('option:eq(0)').prop("selected", "selected");
    },
    GetWorkFlowContentByID: function () {
        $("#btnSave").attr("UpdateId", Id).html("Update");
        WorkFlow.Id = Id;
        $.ajax({
            url: "/WorkFlow/Create/GetDetail",
            type: 'POST',
            data: JSON.stringify({ 'workflowdetails': WorkFlow }),
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && response != undefined && response != "" && response.Id > 0) {
                    WorkFlow = response;
                }
                else {
                    ShowErrorMessage("Workflow is not present");
                }

                $("#dvLoading").hide();
            }
        });
    },
    MinimizeMenuContent: function () {
        if (workflowstatus != 1) {
            $('#dvExpend').animate({ left: '0px' }, { duration: 450 });
            $('#dvMainMenu').hide(1000);
        }
    },
    ValidateWokflow: function () {

    },
    UpdateWorkflowStatus: function (workflowstatus) {

        if (workflowstatus == 0) {
            $("#btnstop").css("display", "none");
            $("#btnstart").css("display", "block");
        }
        if (workflowstatus == 1) {
            $("#btnstop").css("display", "block");
            $("#btnstart").css("display", "none");
        }

        WorkFlowBasicDetails.WorkflowId = WorkflowId;
        WorkFlowBasicDetails.Status = workflowstatus;
        WorkFlowBasicDetails.Title = $('#ui_spnWorkFlowName').text();

        $.ajax({
            url: "/WorkFlow/Create/Updateworkflowstatus",
            type: 'POST',
            data: JSON.stringify({ 'WorkFlowBasicDetails': WorkFlowBasicDetails }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (response) {
                if (workflowstatus == 0) {
                    ShowErrorMessage("Workflow Stopped!");
                }
                if (workflowstatus == 1) {
                    ShowErrorMessage("Workflow Started!");
                }
            },
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


        if (WorkflowId == 0) {
            WorkFlowBasicDetails.Title = CleanText($("#ui_txtWorkFlowTitle").val());
            WorkFlowBasicDetails.Status = 2;
            workflowstatus = 2;
            $.ajax({
                url: "/WorkFlow/Create/StoreBasicDetails",
                type: 'POST',
                data: JSON.stringify({ 'WorkFlowBasicDetails': WorkFlowBasicDetails }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: true,
                success: function (response) {
                    if (response == -1) {
                        ShowErrorMessage("This Workflow title already exist!");
                    }
                    else {
                        WorkflowId = response;
                        if (workflowstatus === 2) { ShowErrorMessage("Your workflow has been drafted!"); }

                    }
                },
            });

        }
        else {
            WorkFlowBasicDetails.WorkflowId = WorkflowId;
            WorkFlowBasicDetails.Title = $('#ui_spnWorkFlowName').text();
            WorkFlowBasicDetails.Status = 2;
            WorkFlowBasicDetails.Flowchart = flowChartJson;
            $.ajax({
                url: "/WorkFlow/Create/UpdateWorkflowchart",
                type: 'POST',
                data: JSON.stringify({ 'WorkFlowBasicDetails': WorkFlowBasicDetails }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    if (result == 0) { ShowErrorMessage("Your workflow has been drafted!"); }
                    else { ShowErrorMessage("Something went Wrong!"); }
                },
                error: ShowAjaxError
            });
        }


        window.history.pushState('', '', UpdateQueryString("WorkFlowId", WorkflowId));
    }
};
//-----------------BFS----------------------//
var size = 0;
var Node = { blockId: "", visited: false };
var queue = [];
var nodesList = new Array();
var parentNode;
var adjMatrix = [];
var BFSTraverse = [];
var GrpahWorkflow = {


    AddNode: function (node) {
        nodesList.push(node);
    },
    SetParentNode: function (node) {
        parentNode = node;
    },
    GetParentNode: function () {
        return parentNode;
    },
    ConnectNode: function (SourceNode, TargetNode, relation) {
        if (adjMatrix.length == 0) {
            size = nodesList.length;
            for (var i = 0; i < size; i++) {
                adjMatrix.push(i);
                adjMatrix[i] = new Array();
                for (var j = 0; j < size; j++) {
                    adjMatrix[i].push(null);
                }
            }
        }

        var startIndex = GrpahWorkflow.GetIndexOfNode(SourceNode);
        var endIndex = GrpahWorkflow.GetIndexOfNode(TargetNode);

        if (startIndex > -1 && endIndex > -1) {
            adjMatrix[startIndex][endIndex] = relation;
            adjMatrix[endIndex][startIndex] = relation;
        }
    },
    bfs: function () {

        var parentnode = GrpahWorkflow.GetParentNode()
        queue.push(parentnode);

        var indexOfRootNode = GrpahWorkflow.GetIndexOfNode(parentnode);
        nodesList[indexOfRootNode].visited = parentnode.visited = true;
        BFSTraverse = [];
        BFSTraverse.push(parentnode);
        window.console.log(parentnode);
        while (queue.length > 0) {
            var n = queue.shift();
            while ((row = GrpahWorkflow.GetUnvisitedChildNode(n)) != null) {
                relation = row.Relation;
                row.Node.visited = true;
                window.console.log(row.Node);
                BFSTraverse.push(row.Node);
                queue.push(row.Node);
            }
        }
        return BFSTraverse;
    },
    GetUnvisitedChildNode: function (Node) {

        var a = GrpahWorkflow.GetIndexOfNode(Node);
        var j = 0;
        while (j < size) {
            if (adjMatrix[a][j] != null && nodesList[j].visited == false) {
                return { Node: nodesList[j], Relation: adjMatrix[a][j] };
            }
            j++;
        }
        return null;
    },
    GetIndexOfNode: function (Node) {
        for (var i = 0; i < nodesList.length; i++)
            if (nodesList[i].blockId == Node.blockId)
                return i;
        return -1;
    }
};
function Start() {
    for (var i = 0; i < flowChartdata.nodes.length; i++) {
        var Node = { blockId: flowChartdata.nodes[i].blockId, visited: false };
        GrpahWorkflow.AddNode(Node);
    }
    parentNode = {
        blockId: workflowUtil.MyFirstNode(),
        visited: false
    }
    for (var relation in flowChartdata.connections) {
        var fromNode = { blockId: flowChartdata.connections[relation].SourceId, visited: false }
        var toNode = { blockId: flowChartdata.connections[relation].TargetId, visited: false }
        GrpahWorkflow.ConnectNode(fromNode, toNode, relation);
    }
    return GrpahWorkflow.bfs();
}

//-----------------BFS----------------------//

function ClosePopup(controldId) {

    $("#divmailtype,#dvSendSmsId,#dvWaitForTimeEvent,#dvWaitForDateEvent").hide("fast");
    $(".bgShadedDiv").hide();
}
$(".closepopup").click(function () {
    $(".bgShadedDiv").hide();
    $(".CustomPopUp").hide("fast");
    //GeneralFunction.ClearCustomPopUpFields();
});
function closeSendMail() {
    $("#dvSendMailId").hide("fast");
    $(".bgShadedDiv").hide();
}
//------------------Mail--------------------//
var mailDetails = {
    BindMailTemplates: function () {
        var found = DropdownPreBind.filter(function (item) { return item.Channel === "Mail"; });
        if (found.length != 0) {
            DropdownPreBind.splice(DropdownPreBind.findIndex(x => x.Channel == "Mail"), found.length)
        }
        $.ajax({
            url: "/Form/CommonDetailsForForms/GetTemplate",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function () {
                    var optlist = document.createElement('option');
                    optlist.value = $(this)[0].Id;
                    optlist.text = $(this)[0].Name;
                    document.getElementById("ddlmailtempId").options.add(optlist);
                    DropdownPreBind.push({ "Channel": "Mail", "Id": $(this)[0].Id, "Text": $(this)[0].Name });
                });
                // GetNodeConfigurationId();
                smsDetails.BindSmsTemplate();
            },
            error: ShowAjaxError
        });
    },
    BindActiveEmailIds: function () {
        $.ajax({
            url: "/Form/CommonDetailsForForms/GetActiveEmailIds",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function (i) {
                    if ($("#ddlfromemailId option[value='" + response[i] + "']").length == 0) {
                        var optlist = document.createElement('option');
                        optlist.value = response[i];
                        optlist.text = response[i];
                        document.getElementById("ddlfromemailId").options.add(optlist);
                    }

                });
            },
            error: ShowAjaxError
        });
    },
    Validation: function () {
        if ($('#ddlmailtempId').get(0).selectedIndex == 0) {
            $('#ddlmailtempId').focus();
            ShowErrorMessage("Please select template.");
            return false;
        }
        else if ($('#txtmailsubject').val().length == 0) {
            $('#txtmailsubject').focus();
            ShowErrorMessage("Please enter mail subject");
            return false;
        }
        else if ($('#txtmailfromname').val().length == 0) {
            $('#txtmailfromname').focus();
            ShowErrorMessage("Please enter from name");
            return false;
        }
        else if ($('#ddlfromemailId').get(0).selectedIndex == 0) {
            $('#ddlfromemailId').focus();
            ShowErrorMessage('Please enter from email address');
            return false;
        }
        else if ($('#txtReplyemailid').val().length == 0) {
            $('#txtmailfromname').focus();
            ShowErrorMessage("Please enter Reply Emailid");
            return false;
        }
        return true;
    }

};
$("#btnsavemaildetails").click(function () {

    if (mailDetails.Validation()) {
        workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
        MailConfig = {};
        var msgtype = 0;
        MailConfig.MailTemplateId = $("#ddlmailtempId").val();
        var title = $("#ddlmailtempId option:selected").text();
        MailConfig.MailSubject = $("#txtmailsubject").val();
        MailConfig.FromName = $("#txtmailfromname").val();
        MailConfig.FromEmailId = $("#ddlfromemailId").val();
        MailConfig.ReplyToEmailId = $("#txtReplyemailid").val();
        MailConfig.Subscribe = $("#chkUnsubscribe").is(':checked');
        MailConfig.WorkflowId = $.urlParam("WorkflowId");
        if ($('#radmailtranmsg').prop('checked')) { msgtype = 1; }
        if ($('#radmailpromomsg').prop('checked')) { msgtype = 0; }
        MailConfig.IsPromotionalOrTransactionalType = msgtype;

        var result = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Value)
        if (result != '') {
            MailConfig.ConfigureMailId = parseInt(result);
        }
        if (!regExpEmail.test($("#txtReplyemailid").val())) {
            $("#txtReplyemailid").focus();
            ShowErrorMessage("Please enter correct email id.");
            return false;
        }
        $.ajax({
            url: "/WorkFlow/SaveConfig/SaveMailConfig",
            type: 'post',
            dataType: 'json',
            data: JSON.stringify({ 'MailConfig': MailConfig }),
            contentType: "application/json; charset=utf-8",
            success: function (ReturnMailConfigId) {
                SetNodeConfigArray(ClickedNodeId.toString(), ReturnMailConfigId, title);
                if ($.urlParam("WorkflowId") > 0) {
                    $.ajax({
                        url: "/WorkFlow/SaveConfig/UpdateDate",
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

        $(".bgShadedDiv").hide();
        $(".CustomPopUp").hide("fast");
        workflowUtil.mailClearFields();

    }

});
//------------------Mail--------------------//
//------------------SMS--------------------//
var smsDetails = {
    Validation: function () {
        if ($('#ddlsmstempId').get(0).selectedIndex == 0) {
            $('#ddlsmstempId').focus();
            ShowErrorMessage("please select template.");
            return false;
        }

        return true;
    },
    BindSmsTemplate: function () {
        var found = DropdownPreBind.filter(function (item) { return item.Channel === "Sms"; });
        if (found.length != 0) {
            DropdownPreBind.splice(DropdownPreBind.findIndex(x => x.Channel == "Sms"), found.length)
        }
        $.ajax({
            url: "/SMS/Template/GetAllTemplate",
            type: 'POST',
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function () {
                    var optlist = document.createElement('option');
                    optlist.value = $(this)[0].Id;
                    optlist.text = $(this)[0].Name;
                    document.getElementById("ddlsmstempId").options.add(optlist);
                    DropdownPreBind.push({ "Channel": "Sms", "Id": $(this)[0].Id, "Text": $(this)[0].Name });
                });
                WebPushDetails.GetWebPushCampaigns();
            }
        });
    }


};
$("#btnSaveSms").click(function () {
    if (smsDetails.Validation()) {
        workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
        SmsConfig = {};
        SmsConfig.SmsTemplateId = $("#ddlsmstempId").val();
        var title = $("#ddlsmstempId option:selected").text();
        if ($('#radsmstranmsg').prop('checked')) { msgtype = 1; }
        if ($('#radsmspromomsg').prop('checked')) { msgtype = 0; }
        SmsConfig.IsPromotionalOrTransactionalType = msgtype;
        var result = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Value)
        if (result != '') {
            SmsConfig.ConfigureSmsId = parseInt(result);
        }
        $.ajax({
            url: "/WorkFlow/SaveConfig/SaveSmsConfig",
            type: 'post',
            dataType: 'json',
            data: JSON.stringify({ 'SmsConfig': SmsConfig }),
            contentType: "application/json; charset=utf-8",
            success: function (ReturnSmsConfigId) {
                SetNodeConfigArray(ClickedNodeId.toString(), ReturnSmsConfigId, title);
                if ($.urlParam("WorkflowId") > 0) {
                    $.ajax({
                        url: "/WorkFlow/SaveConfig/UpdateDate",
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
        $(".bgShadedDiv").hide();
        $(".CustomPopUp").hide("fast");
        workflowUtil.smsClearFields();

    }

});
//------------------SMS--------------------//
//----------Rules-------------------//
$("#btnsavrulesdetails").click(function () {
    if (ValidationOfRules()) {
        RulesData();
        workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
        workflowUtil.ruleClearFields();
        $(".bgShadedDiv").hide();
        $(".CustomPopUp").hide("fast");

    }

});
//-------------Rules----------------//
//--------------Form-----------------//
var formDetails = {
    GetFormType: function () {
        var FormType = {};
        $.ajax({
            dataType: "json",
            url: "/Content/WorkFlow/FormType.json",
            dataType: "json",
            success: function (response) {
                var allfomhtml = "";
                var allforms = {};
                allforms = response.FormTypes;
                formDetails.BindFormTypeToDropDown(allforms);
            },
            error: ShowAjaxError
        });
    },
    BindFormTypeToDropDown: function (allforms) {
        $.each(allforms, function () {
            var optlist = document.createElement('option');
            optlist.value = $(this)[0].Id;
            optlist.text = $(this)[0].Name;
            document.getElementById("ddlformtype").options.add(optlist);
            //DropdownPreBind.push({ "Channel": "Form", "Id": $(this)[0].Id, "Text": $(this)[0].Name });
        });
        formDetails.FormTypeOnChange();
    },
    GetAllForm: function () {
        $.ajax({
            url: "/CommonDetailsForForms/GetFormsList",
            type: 'POST',
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                AllForms = response;
                formDetails.BindAllFormsToDropDown("12", "Forms");
                formDetails.BindAllFormsToDropDown("9", "Polls");
                formDetails.BindAllFormsToDropDown("18", "Questions");
                formDetails.BindAllFormsToDropDown("16", "Ratings");
                formDetails.BindAllFormsToDropDown("5", "Custom HTML");
                formDetails.BindAllFormsToDropDown("17", "WordPress Feed");
                formDetails.BindAllFormsToDropDown("7", "Custom Banner");
                formDetails.BindAllFormsToDropDown("3", "Embed Scripts");
                formDetails.BindAllFormsToDropDown("6", "Tweets");
                formDetails.BindAllFormsToDropDown("4", "SWF Embed");
                formDetails.BindAllFormsToDropDown("2", "Facebook");
                formDetails.BindAllFormsToDropDown("1", "Video");
                formDetails.BindAllFormsToDropDown("20", "Click To Call");
            },
            error: ShowAjaxError
        });
    },
    BindAllFormsToDropDown: function (FormType, PreChannel) {
        var activeforms = JSLINQ(AllForms).Where(function (item) { return item.FormType == FormType && item.FormStatus == 1; }).Select(function (item) { return item; }).items
        $("#ddlactiveform").html("");
        var found = DropdownPreBind.filter(function (item) { return item.PreChannel === PreChannel; });
        if (found.length != 0) {
            DropdownPreBind.splice(DropdownPreBind.findIndex(x => x.PreChannel == PreChannel), found.length)
        }
        if (activeforms.length > 0) {
            $.each(activeforms, function () {
                var optlist = document.createElement('option');
                optlist.value = $(this)[0].Id;
                optlist.text = $(this)[0].Heading;
                document.getElementById("ddlactiveform").options.add(optlist);
                DropdownPreBind.push({ "Channel": "Forms", "Id": $(this)[0].Id, "Text": $(this)[0].Heading, "PreChannel": PreChannel });
            });

            $("#trform").show();
            $("#btnSaveform").show();
        }
        else {
            $("#trform").hide();
            $("#btnSaveform").hide();
            if (PreChannel === "") { ShowErrorMessage("No active form found."); }

        }

    },
    FormTypeOnChange: function () {

        $("#ddlformtype").change(function () {
            var fortmtype = $(this).val();
            formDetails.BindAllFormsToDropDown(fortmtype, "");
        });
    },
    Validation: function () {
        if ($('#ddlformtype').get(0).selectedIndex == 0) {
            $('#ddlformtype').focus();
            ShowErrorMessage("please select form type.");
            return false;
        }

        return true;
    }



};
$("#btnSaveform").click(function () {
    if (formDetails.Validation()) {
        workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
        FormConfig = {};
        FormConfig.FormType = $("#ddlformtype").val();
        FormConfig.FormId = $("#ddlactiveform").val();
        var title = $("#ddlformtype option:selected").text() + ": " + $("#ddlactiveform option:selected").text();
        var result = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Value)
        if (result != '') {
            FormConfig.ConfigureFormId = parseInt(result);
        }
        $.ajax({
            url: "/WorkFlow/SaveConfig/SaveFormConfig",
            type: 'post',
            dataType: 'json',
            data: JSON.stringify({ 'FormConfig': FormConfig }),
            contentType: "application/json; charset=utf-8",
            success: function (ReturnFormConfigId) {
                SetNodeConfigArray(ClickedNodeId.toString(), ReturnFormConfigId, title);
                if ($.urlParam("WorkflowId") > 0) {
                    $.ajax({
                        url: "/WorkFlow/SaveConfig/UpdateDate",
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

        $(".bgShadedDiv").hide();
        $(".CustomPopUp").hide("fast");
        workflowUtil.formClearFields();

    }
});
//--------------Form-----------------//
//--------------Interval------------------------//

var interval = {
    Validation: function () {
        if ($('#txtinterval').val().length == 0) {
            $('#txtinterval').focus();
            ShowErrorMessage("please enter interval");
            return false;
        }
        return true;
    }


};
$("#btninterval").click(function () {
    if (interval.Validation()) {
        workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
        $(".bgShadedDiv").hide();
        $(".CustomPopUp").hide("fast");
        workflowUtil.intervalClearFields();

    }
});
//----------------Interval----------------------//

//--------------Date & Time------------------------//

var dateAndTime = {
    Validation: function () {
        if ($('input[name=datetimetype]:checked').val() == "0") {
            if ($('#txttime').val().length == 0) {
                $('#txttime').focus();
                ShowErrorMessage("please enter value the value");
                return false;
            }
        }
        else if ($('input[name=datetimetype]:checked').val() == "1") {

            if ($("#ddldatecondition").val() <= "4") {
                if ($("#ddldatecondition").val() == "4" && $('#txtdateandtime2').val().length == 0) {
                    $('#txtdateandtime2').focus();
                    ShowErrorMessage("please enter date & time");
                    return false;
                }

                if ($('#txtdateandtime1').val().length == 0) {
                    $('#txtdateandtime1').focus();
                    ShowErrorMessage("please enter date & time");
                    return false;
                }
                var now = new Date();
                var selectedvalue = $('#txtdateandtime1').val() + " " + $('#ui_dllworkflowTime1').val() + ":00:00";
                var selecteddate = new Date(selectedvalue);
                if (selecteddate < now) {
                    ShowErrorMessage("Date and time must be in the future");
                    return false;
                }
                var selectedvalueto = $('#txtdateandtime2').val() + " " + $('#ui_dllworkflowTime1').val() + ":00:00";
                var selecteddateto = new Date(selectedvalueto);
                if (selecteddateto < now) {
                    ShowErrorMessage("Date and time must be in the future");
                    return false;
                }
            }
        }
        return true;
    }

};

$("#ddldatecondition").change(function () {

    $("#td_ui_dllworkflowdayofweek,#td_ui_dllworkflowdayofmonth").hide();

    if (($("#ddldatecondition").val()) == "4") {
        $("#td_txtdateandtime1,#td_txtdateandtime2,#td_ui_dllworkflowTime1").show();
        $("#td_ui_dllworkflowdayofweek,#td_ui_dllworkflowdayofmonth").hide();
        $("#txtdateandtime2").prop("disabled", false);
    }
    else if (($("#ddldatecondition").val()) == "5") {
        $("#td_txtdateandtime1,#td_txtdateandtime2,#td_ui_dllworkflowdayofweek,#td_ui_dllworkflowdayofmonth").hide();
        $("#td_ui_dllworkflowTime1").show();
    }
    else if (($("#ddldatecondition").val()) == "6") {
        $("#td_txtdateandtime1,#td_txtdateandtime2,#td_ui_dllworkflowdayofmonth").hide();
        $("#td_ui_dllworkflowdayofweek,#td_ui_dllworkflowTime1").show();
    }
    else if (($("#ddldatecondition").val()) == "7") {
        $("#td_txtdateandtime1,#td_txtdateandtime2,#td_ui_dllworkflowdayofweek,#td_ui_dllworkflowTime1").hide();
        $("#td_ui_dllworkflowdayofmonth").show();
    }
    else {
        $("#td_txtdateandtime1,#td_txtdateandtime2,#td_ui_dllworkflowTime1").show();
        $("#td_ui_dllworkflowdayofweek,#td_ui_dllworkflowdayofmonth").hide();
        $("#txtdateandtime2").prop("disabled", true);
    }
});

$("input[name$='datetimetype']").click(function () {
    if ($(this).val() == "0") {
        $("#txtdateandtime1").prop("disabled", true);
        $("#ui_dlltimetype").prop("disabled", false);
        $("#ddldatecondition").prop("disabled", true);
        $("#txttime").prop("disabled", false);
        $("#ui_dllworkflowTime1").prop("disabled", true);
    }
    else if ($(this).val() == "1") {
        $("#ui_dlltimetype").prop("disabled", true);
        $("#txtdateandtime1").prop("disabled", false);
        $("#ddldatecondition").prop("disabled", false);
        $("#txttime").prop("disabled", true);
        $("#ui_dllworkflowTime1").prop("disabled", false);
    }
});

$("#btndateandtime").click(function () {
    if (dateAndTime.Validation()) {
        workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
        var GetTimes = "";
        DatetimeConfig = {};
        if ($('input[name=datetimetype]:checked').val() == "0") {
            DateCondition = 0;
            GetTimes = $("#txttime").val() + " " + $("#ui_dlltimetype").find("option:selected").text();
            channel = {
                "Channel": ClickedNodeId.toString(),
                "Value": GetTimes.toString(),
                "DateCondition": DateCondition,
                "Title": GetTimes.toString(),
            }
            if (WorkflowId > 0) {
                DatetimeConfig.Time = $("#txttime").val();
                DatetimeConfig.DateValue = '';
                DatetimeConfig.DateValueTo = '';
                DatetimeConfig.DateCondition = 0;
                DatetimeConfig.TimeType = GetTimes;
                DatetimeConfig.WorkFlowId = WorkflowId;
                DatetimeConfig.Date = ClickedNodeId.toString();

                $.ajax({
                    url: "/WorkFlow/Create/UpdateDateTime",
                    type: 'post',
                    dataType: 'json',
                    data: JSON.stringify({ 'DatetimeConfig': DatetimeConfig }),
                    contentType: "application/json; charset=utf-8",
                    success: function (ReturnDatetimeConfigId) {
                        //if (ReturnDatetimeConfigId == 0) {
                        //    ShowErrorMessage("Time has been updated");
                        //}
                    },
                });
            }
            SetNodeConfigArray(ClickedNodeId.toString(), GetTimes, GetTimes.toString(), DateCondition);
            if ($.urlParam("WorkflowId") > 0) {
                $.ajax({
                    url: "/WorkFlow/SaveConfig/UpdateDate",
                    type: 'post',
                    dataType: 'json',
                    data: JSON.stringify({ 'WorkflowId': WorkflowId }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                    },
                });
            }
        }
        else if ($('input[name=datetimetype]:checked').val() == "1") {
            DateCondition = parseInt($("#ddldatecondition").val());

            if (DateCondition == 1 || DateCondition == 2 || DateCondition == 3) {
                DateValue = $("#txtdateandtime1").val() + "`" + $("#ui_dllworkflowTime1").val();
            }
            else if (DateCondition == 4) {
                DateValue = $("#txtdateandtime1").val() + "`" + $("#ui_dllworkflowTime1").val() + "`" + $("#txtdateandtime2").val();
            }
            else if (DateCondition == 5) {
                DateValue = $("#ui_dllworkflowTime1").val();
            }
            else if (DateCondition == 6) {
                DateValue = $("#ui_dllworkflowdayofweek").val() + "`" + $("#ui_dllworkflowTime1").val();
            }
            else if (DateCondition == 7) {
                DateValue = $("#ui_dllworkflowdayofmonth").val();
            }

            channel = {
                "Channel": ClickedNodeId.toString(),
                "Value": DateValue.toString(),
                "DateCondition": DateCondition,
                "Title": GetTimes.toString(),
            }
            var SetDateTitle = "";
            var frm = new Date($("#txtdateandtime1").val());
            a = new Date(frm);
            var to = new Date($("#txtdateandtime2").val());
            b = new Date(to);
            var monthDetials = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            if (DateCondition == 1) { DatetimeConfig.DateValueTo = ''; SetDateTitle = "On " + a.getDate(frm) + ' ' + monthDetials[a.getMonth(frm)] + ' ' + a.getFullYear(frm); }
            else if (DateCondition == 2) { DatetimeConfig.DateValueTo = ''; SetDateTitle = "Before " + a.getDate(frm) + ' ' + monthDetials[a.getMonth(frm)] + ' ' + a.getFullYear(frm); }
            else if (DateCondition == 3) { DatetimeConfig.DateValueTo = ''; SetDateTitle = "After " + a.getDate(frm) + ' ' + monthDetials[a.getMonth(frm)] + ' ' + a.getFullYear(frm); }
            else if (DateCondition == 4) { DatetimeConfig.DateValueTo = $("#txtdateandtime2").val(); SetDateTitle = "B/w " + a.getDate(frm) + ' ' + monthDetials[a.getMonth(frm)] + " to " + b.getDate(to) + ' ' + monthDetials[b.getMonth(to)] }
            else if (DateCondition == 5) { DatetimeConfig.DateValueTo = ''; SetDateTitle = "Every day " + DateValue; }
            else if (DateCondition == 6) { DatetimeConfig.DateValueTo = ''; SetDateTitle = "Day of Week " + DateValue; }
            else if (DateCondition == 7) { DatetimeConfig.DateValueTo = ''; SetDateTitle = "Day of Month " + DateValue; }

            if (WorkflowId > 0) {
                DatetimeConfig.Time = 0;

                if (DateCondition <= 5) {
                    DatetimeConfig.DateValue = $("#txtdateandtime1").val() + " " + $("#ui_dllworkflowTime1").val() + ":00:00.000";
                    DatetimeConfig.DaysOfWeek = "";
                    DatetimeConfig.DaysOfMonth = 0;
                }
                else if (DateCondition == 6) {
                    var todayTime = new Date();
                    var month = (todayTime.getMonth() + 1);
                    var day = todayTime.getDate();
                    var year = todayTime.getFullYear();

                    if (day < 10)
                        day = "0" + day + "";

                    if (month < 10)
                        month = "0" + month + "";

                    var newvalue = year + "-" + month + "-" + day + " " + $("#ui_dllworkflowTime1").val() + ":00:00.000";
                    DatetimeConfig.DaysOfWeek = $("#ui_dllworkflowdayofweek").val();
                    DatetimeConfig.DateValue = newvalue;
                }
                else if (DateCondition == 7) {
                    DatetimeConfig.DaysOfMonth = $("#ui_dllworkflowdayofmonth").val();
                }

                DatetimeConfig.DateCondition = DateCondition;
                DatetimeConfig.TimeType = SetDateTitle;
                DatetimeConfig.WorkFlowId = WorkflowId;
                DatetimeConfig.Date = ClickedNodeId.toString();

                $.ajax({
                    url: "/WorkFlow/Create/UpdateDateTime",
                    type: 'post',
                    dataType: 'json',
                    data: JSON.stringify({ 'DatetimeConfig': DatetimeConfig }),
                    contentType: "application/json; charset=utf-8",
                    success: function (ReturnDatetimeConfigId) {
                        //if (ReturnDatetimeConfigId == 0) {
                        //    ShowErrorMessage("Date and time has been updated");
                        //}
                    },
                });
            }
            SetNodeConfigArray(ClickedNodeId.toString(), DateValue, SetDateTitle, DateCondition);
            if ($.urlParam("WorkflowId") > 0) {
                $.ajax({
                    url: "/WorkFlow/SaveConfig/UpdateDate",
                    type: 'post',
                    dataType: 'json',
                    data: JSON.stringify({ 'WorkflowId': WorkflowId }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                    },
                });
            }
        }

        $(".bgShadedDiv").hide();
        $(".CustomPopUp").hide("fast");
        workflowUtil.intervalClearFields();
    }
});

//----------------Date & Time----------------------//

//--------------Time------------------------//
$("#btntime").click(function () {
    workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
    $(".bgShadedDiv").hide();
    $(".CustomPopUp").hide("fast");
    workflowUtil.timeClearFields();

});
//----------------Time----------------------//

//--------------Chat-----------------//
var chatDetails = {
    GetAllChat: function () {
        $.ajax({
            url: "/Chat/AllChat/Get",
            type: 'POST',
            async: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ 'OffSet': 0, 'FetchNext': 0 }),
            dataType: "json",
            success: chatDetails.BindAllChatToDropDown,
            error: ShowAjaxError
        });
    },
    BindAllChatToDropDown: function (AllChat) {
        var activechats = JSLINQ(AllChat).Where(function (item) { return item.ChatStatus == 1; }).Select(function (item) { return item; }).items
        var found = DropdownPreBind.filter(function (item) { return item.Channel === "Chat"; });
        if (found.length != 0) {
            DropdownPreBind.splice(DropdownPreBind.findIndex(x => x.Channel == "Chat"), found.length)
        }

        if (activechats.length > 0) {
            $.each(activechats, function () {
                var optlist = document.createElement('option');
                optlist.value = $(this)[0].Id;
                optlist.text = $(this)[0].Name;
                document.getElementById("ddlchat").options.add(optlist);
                DropdownPreBind.push({ "Channel": "Chat", "Id": $(this)[0].Id, "Text": $(this)[0].Name });
            });

        }


    }

};
$("#btnSavechat").click(function () {
    workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
    ChatConfig = {};
    ChatConfig.ChatId = $("#ddlchat").val();
    var title = $("#ddlchat option:selected").text();
    var result = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Value)
    if (result != '') {
        ChatConfig.ConfigureFormId = parseInt(result);
    }
    $.ajax({
        url: "/WorkFlow/SaveConfig/SaveChatConfig",
        type: 'post',
        dataType: 'json',
        data: JSON.stringify({ 'ChatConfig': ChatConfig }),
        contentType: "application/json; charset=utf-8",
        success: function (ReturnChatConfigId) {
            SetNodeConfigArray(ClickedNodeId.toString(), ReturnChatConfigId, title);
            if ($.urlParam("WorkflowId") > 0) {
                $.ajax({
                    url: "/WorkFlow/SaveConfig/UpdateDate",
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
    $(".bgShadedDiv").hide();
    $(".CustomPopUp").hide("fast");
    workflowUtil.chatClearFields();
});
//--------------Chat-----------------//

//--------------Segment------------------------//

var segmentDetails = {
    GetAllSegment: function () {
        BindGroupData();
    },
    Validation: function () {
        if ($('#ddlSegment').get(0).selectedIndex == 0) {
            $('#ddlSegment').focus();
            ShowErrorMessage("please select segment.");
            return false;
        }

        return true;
    },
    BindSegmentDetails: function (GroupDetails) {
        if (GroupDetails.length > 0) {
            $("#segmentdetails").show();
            $("#ui_sengmenttotalcontact").html(GroupDetails[0].Total);

            //PurchaseDetails();
        }
        //$("#dvLoading").hide();
    },
    GetGroups: function () {
        $.ajax({
            url: "/Form/CommonDetailsForForms/GetGroups",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function () {
                    var optlist = document.createElement('option');
                    optlist.value = $(this)[0].Id;
                    optlist.text = $(this)[0].Name;
                    document.getElementById("ui_ddlAlertGroupList").options.add(optlist);
                });
            },
            error: ShowAjaxError
        });
    }
};

//------------UserNameList--------------//

var usersDetails = {
    GetUserNameList: function () {
        $.ajax({
            url: "/CommonDetailsForForms/UserNameList",
            dataType: "json",
            type: "POST",
            async: false,
            contentType: "application/json; charset=utf-8",
            dataFilter: function (data) { return data; },
            success: function (UserListBind) {
                $.each(UserListBind, function () {
                    if ($(this)[0].ActiveStatus) {
                        var optlist = document.createElement('option');
                        optlist.value = $(this)[0].UserInfoUserId;
                        optlist.text = $(this)[0].FirstName;
                        document.getElementById("ui_ddlAlertUserList").options.add(optlist);
                    }
                });
            },
            error: ShowAjaxError
        });
    }
};


$("#btnsegment").click(function () {
    if (segmentDetails.Validation()) {
        workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
        channel = {
            "Channel": ClickedNodeId.toString(),
            "Value": parseInt($("#ddlSegment").val())
        }
        var found = ArrayConfig.filter(function (item) { return item.Channel === ClickedNodeId.toString(); });
        if (found.length == 0) { ArrayConfig.push(channel); }
        // console.log(ArrayConfig);


        $(".bgShadedDiv").hide();
        $(".CustomPopUp").hide("fast");
        workflowUtil.segmentClearFields();
    }
});
$("#ddlSegment").change(function () {
    var Group = { Id: 0, Name: "" };
    Group.Id = parseInt($("#ddlSegment").val());
    if (Group.Id > 0) {
        $("#dvLoading").show();
        // $("#btnsegment").prop('disabled', true);
        var OffSet = 0;
        var FetchNext = 1;
        $.ajax({
            url: "/Sms/Groups/BindGroupsContact",
            type: 'Post',
            data: JSON.stringify({ 'group': Group, 'FetchNext': FetchNext, 'OffSet': OffSet }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: segmentDetails.BindSegmentDetails,
            error: ShowAjaxError
        });
    }
    else {
        $("#segmentdetails").hide();
    }


});
//----------------Segment----------------------//

/////////////---------Rules------------///////////
var RuleDetails = {
    Validation: function () {
        if ($('#ddlruleId').get(0).selectedIndex == 0) {
            $('#ddlruleId').focus();
            ShowErrorMessage("please select Rules.");
            return false;
        }
        return true;
    },
    BindRules: function () {
        $.ajax({
            url: "/WorkFlow/SaveConfig/GetRuleDetails",
            type: 'POST',
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
    }

};
$("#btnSaveRule").click(function () {
    if (RuleDetails.Validation()) {
        workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
        var title = $("#ddlruleId option:selected").text() + "^" + $("#ddlruleId option:selected")[0].title;
        SetNodeConfigArray(ClickedNodeId.toString(), parseInt($("#ddlruleId").val()), title);
        if ($.urlParam("WorkflowId") > 0) {
            $.ajax({
                url: "/WorkFlow/SaveConfig/UpdateDate",
                type: 'post',
                dataType: 'json',
                data: JSON.stringify({ 'WorkflowId': WorkflowId }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                },
            });
        }
        $(".bgShadedDiv").hide();
        $(".CustomPopUp").hide("fast");
        workflowUtil.segmentClearFields();
    }
});

$("#aSpace").click(function () {
    $("#flowchart").height($("#flowchart").height() + 200);
    $("#dvwSeparate").height($("#dvwSeparate").height() + 200);
});

/////////////---------EndRules------------///////////

///////////////////////---------Goal------------///////////////
var GoalDetails = {
    Validation: function () {
        if ($('#ddlgoalId').get(0).selectedIndex == 0) {
            $('#ddlgoalId').focus();
            ShowErrorMessage("please select Rules.");
            return false;
        }
        return true;
    },
    BindGoal: function () {
        $.ajax({
            url: "/WorkFlow/SaveConfig/GetRuleDetails",
            type: 'POST',
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function () {
                    var optlist = document.createElement('option');
                    optlist.value = $(this)[0].RuleId;
                    optlist.text = $(this)[0].TriggerHeading;
                    document.getElementById("ddlgoalId").options.add(optlist);
                });
            },
            error: ShowAjaxError
        });
    }

};
$("#btnSaveGoal").click(function () {
    if (GoalDetails.Validation()) {
        workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
        var title = $("#ddlgoalId option:selected").text();
        SetNodeConfigArray(ClickedNodeId.toString(), parseInt($("#ddlgoalId").val()), title);
        if ($.urlParam("WorkflowId") > 0) {
            $.ajax({
                url: "/WorkFlow/SaveConfig/UpdateDate",
                type: 'post',
                dataType: 'json',
                data: JSON.stringify({ 'WorkflowId': WorkflowId }),
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                },
            });
        }
        $(".bgShadedDiv").hide();
        $(".CustomPopUp").hide("fast");
        workflowUtil.segmentClearFields();
    }
});


/////////////---------EndGoal------------///////////

//supporting arrange nodes function
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
            "Alert": Alert,
            "AlertId": getchannelvalue(ArrayConfig, Alert),
            "AlertName": getchannelTitle(ArrayConfig, Alert),
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


//end of supporting arrange nodes function


//------------------ Web Push Notifications ---------------------

var WebPushDetails = {
    Validation: function () {
        if ($('#ddlwebpush').get(0).selectedIndex == 0) {
            $('#ddlwebpush').focus();
            ShowErrorMessage("Please select Campaign Name.");
            return false;
        }
        return true;
    },
    GetWebPushCampaigns: function () {
        $.ajax({
            url: "/Push/Browser/BrowserNotification",
            type: 'POST',
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                WebPushDetails.BindAllWebPush(response.Table2);
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
        //OBDDetails.BindOBDTemplate();
    }

};
$("#btnSavewebpush").click(function () {
    if (WebPushDetails.Validation()) {
        workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
        WebPushConfig = {};
        WebPushConfig.CampaignId = $("#ddlwebpush").val();
        var title = $("#ddlwebpush option:selected").text();

        if (RssExist == 1) {

            alert("Please configure one RSS campaign for single workflow");
        }
        else {
            RssExist = $("#ddlwebpush option:selected").attr("rss") == undefined ? 0 : $("#ddlwebpush option:selected").attr("rss");

            var result = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Value)
            if (result != '') {
                WebPushConfig.CampaignId = parseInt(result);
            }
            $.ajax({
                url: "/WorkFlow/SaveConfig/SaveWebPushConfig",
                type: 'post',
                dataType: 'json',
                data: JSON.stringify({ 'WebPushConfig': WebPushConfig }),
                contentType: "application/json; charset=utf-8",
                success: function (ReturnWebPushConfigId) {
                    SetNodeConfigArray(ClickedNodeId.toString(), ReturnWebPushConfigId, title);
                    if ($.urlParam("WorkflowId") > 0) {
                        $.ajax({
                            url: "/WorkFlow/SaveConfig/UpdateDate",
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

            $(".bgShadedDiv").hide();
            $(".CustomPopUp").hide("fast");
            workflowUtil.formClearFields();
        }
    }
});

//------------------ Facebook Push Notifications Start---------------------

FacebookPushDetails = {
    Validation: function () {
        if ($('#ddlfbpush').get(0).selectedIndex == 0) {
            $('#ddlfbpush').focus();
            ShowErrorMessage("Please select Campaign Name.");
            return false;
        }
        return true;
    },

    GetFacebookPushCampaigns: function () {
        var inputs = { Action: 'Notification', PushId: 0 };
        $.ajax({
            url: "/Facebook/Notification/BindSendNotification",
            type: 'POST',
            data: JSON.stringify({ 'Data': inputs }),
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                FacebookPushDetails.BindAllFacebookPush(response.Table2);
            },
            error: ShowAjaxError
        });
    },

    BindAllFacebookPush: function (AllCampaigns) {
        var activeCampaigns = JSLINQ(AllCampaigns).Where(function (item) { return item.Status == 1; }).Select(function (item) { return item; }).items
        var found = DropdownPreBind.filter(function (item) { return item.Channel === "FbPush"; });
        if (found.length != 0) {
            DropdownPreBind.splice(DropdownPreBind.findIndex(x => x.Channel == "FbPush"), found.length)
        }
        if (activeCampaigns.length > 0) {
            $.each(activeCampaigns, function () {
                var optlistFb = document.createElement('option');
                optlistFb.value = $(this)[0].Id;
                optlistFb.text = $(this)[0].Name;
                document.getElementById("ddlfbpush").options.add(optlistFb);
                DropdownPreBind.push({ "Channel": "FbPush", "Id": $(this)[0].Id, "Text": $(this)[0].Name });
            });

        }
        InAppDetails.GetInAppCampaigns();
    }
}
$("#btnSavefbpush").click(function () {
    if (FacebookPushDetails.Validation()) {
        workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
        FbConfig = {};
        FbConfig.CampaignId = $("#ddlfbpush").val();
        var title = $("#ddlfbpush option:selected").text();
        $.ajax({
            url: "/WorkFlow/SaveConfig/SaveFbConfig",
            type: 'post',
            dataType: 'json',
            data: JSON.stringify({ 'FbConfig': FbConfig }),
            contentType: "application/json; charset=utf-8",
            success: function (ReturnFbConfigId) {
                SetNodeConfigArray(ClickedNodeId.toString(), ReturnFbConfigId, title);
                if ($.urlParam("WorkflowId") > 0) {
                    $.ajax({
                        url: "/WorkFlow/SaveConfig/UpdateDate",
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

        $(".bgShadedDiv").hide();
        $(".CustomPopUp").hide("fast");
        workflowUtil.formClearFields();

    }
});
//------------------ Facebook Push Notifications End-----------------------


//------------------ OBD ---------------------

var OBDDetails = {
    Validation: function () {
        if ($('#ddlobd').get(0).selectedIndex == 0) {
            $('#ddlobd').focus();
            ShowErrorMessage("Please select template.");
            return false;
        }
        return true;
    },
    BindOBDTemplate: function () {
        $.ajax({
            url: "/Outbound/Call/GetTemplateForJourney",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && response != undefined) {
                    var found = DropdownPreBind.filter(function (item) { return item.Channel === "OBD"; });
                    if (found.length != 0) {
                        DropdownPreBind.splice(DropdownPreBind.findIndex(x => x.Channel == "OBD"), found.length)
                    }
                    $.each(response.Table, function () {
                        var optlist = document.createElement('option');
                        optlist.value = $(this)[0].Id;
                        optlist.text = $(this)[0].TemplateName;
                        document.getElementById("ddlobd").options.add(optlist);
                        DropdownPreBind.push({ "Channel": "OBD", "Id": $(this)[0].Id, "Text": $(this)[0].TemplateName });
                    });

                }
                AppPushDetails.GetPushCampaigns();
            },
            error: ShowAjaxError
        });
    }
};
$("#btnSaveobd").click(function () {
    if (OBDDetails.Validation()) {
        workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
        OBDConfig = {};
        OBDConfig.AudioTemplateId = $("#ddlobd").val();
        var title = $("#ddlobd option:selected").text();
        if ($('input[name=obdtype]:checked').val() == "0") {
            OBDConfig.IsPromotionalOrTransactionalType = parseInt($("#radobdpromo").val());
        }
        else if ($('input[name=obdtype]:checked').val() == "1") {
            OBDConfig.IsPromotionalOrTransactionalType = parseInt($("#radobdtran").val());
        }
        var result = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Value)
        if (result != '') {
            OBDConfig.AudioTemplateId = parseInt(result);
        }
        $.ajax({
            url: "/WorkFlow/SaveConfig/SaveOBDConfig",
            type: 'post',
            dataType: 'json',
            data: JSON.stringify({ 'OBDConfig': OBDConfig }),
            contentType: "application/json; charset=utf-8",
            success: function (ReturnOBDConfigId) {
                SetNodeConfigArray(ClickedNodeId.toString(), ReturnOBDConfigId, title);
                if ($.urlParam("WorkflowId") > 0) {
                    $.ajax({
                        url: "/WorkFlow/SaveConfig/UpdateDate",
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

        $(".bgShadedDiv").hide();
        $(".CustomPopUp").hide("fast");
        workflowUtil.formClearFields();

    }
});
//------------------ App Push ---------------------

var AppPushDetails = {
    Validation: function () {
        if ($('#ddlapppush').get(0).selectedIndex == 0) {
            $('#ddlapppush').focus();
            ShowErrorMessage("Please select Campaign Name.");
            return false;
        }
        return true;
    },
    GetPushCampaigns: function () {
        $.ajax({
            url: "/Mobile/MobileEngagement/GetCampaigns",
            type: 'POST',
            data: JSON.stringify({ 'Action': 'GetPushCampaign' }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    AppPushDetails.BindAppPushCampaigns(response.Table2);
                }
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
        //FacebookPushDetails.GetFacebookPushCampaigns();
    }
};
$("#btnSaveapppush").click(function () {
    if (AppPushDetails.Validation()) {
        workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
        AppPushConfig = {};
        AppPushConfig.MobileCampaignId = $("#ddlapppush").val();
        AppPushConfig.CampaignType = 1;
        var title = $("#ddlapppush option:selected").text();
        var result = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Value)
        if (result != '') {
            AppPushConfig.MobileCampaignId = parseInt(result);
        }
        $.ajax({
            url: "/WorkFlow/SaveConfig/SaveAppPushConfig",
            type: 'post',
            dataType: 'json',
            data: JSON.stringify({ 'AppPushConfig': AppPushConfig }),
            contentType: "application/json; charset=utf-8",
            success: function (ReturnAppPushConfigId) {
                SetNodeConfigArray(ClickedNodeId.toString(), ReturnAppPushConfigId, title);
                if ($.urlParam("WorkflowId") > 0) {
                    $.ajax({
                        url: "/WorkFlow/SaveConfig/UpdateDate",
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

        $(".bgShadedDiv").hide();
        $(".CustomPopUp").hide("fast");
        workflowUtil.formClearFields();

    }
});

//------------------  In App ---------------------
//------------------Broadcaste ------------
var BroadcasteDetails = {
    Validation: function () {
        var fields = $("input[name='Network']").serializeArray();
        if (fields.length === 0) {
            ShowErrorMessage("Please select network");
            return false;
        }
        if ($('#txtmsg').val().length == 0) {
            $('#txtmsg').focus();
            ShowErrorMessage("Please enter message");
            return false;
        }
        return true;
    },
    BindBroadcaste: function () {
        $.ajax({
            url: "/WorkFlow/SaveConfig/GetBroadcasteDetails",
            type: 'POST',
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.FacebookToken != null) {
                    $('#chkfb').prop('disabled', false);
                    $("#defaultmsg").css("display", "none");
                }
                if (response.TwitterToken != null) {
                    $('#chktwitter').prop('disabled', false);
                    $("#defaultmsg").css("display", "none");
                }
                if (response.LinkedinToken != null) {
                    $('#chklnkin').prop('disabled', false);
                    $("#defaultmsg").css("display", "none");
                }
                if (response.LinkedinToken == null && response.TwitterToken == null && response.FacebookToken == null) {
                    $("#divmain").css("display", "none");
                    $("#btnSavebroadcast").css("display", "none");
                    $("#defaultmsg").css("display", "block");
                }
            },
            error: ShowAjaxError
        });
    }

};
$("#btnSavebroadcast").click(function () {
    if (BroadcasteDetails.Validation()) {
        workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
        BroadcasteConfig = {};
        // BroadcasteConfig.ConfigureBroadcasteId = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Value);
        var result = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Value)
        if (result != '') {
            BroadcasteConfig.ConfigureBroadcasteId = parseInt(result);
        }
        var title = "";
        if ($("#chktwitter").prop('checked') == true) {
            title += "Twitter ";
            BroadcasteConfig.Twitter = 1;
        }
        if ($("#chkfb").prop('checked') == true) {
            title += "Facebook ";
            BroadcasteConfig.Facebook = 1;
        }
        if ($("#chklnkin").prop('checked') == true) {
            title += "LinkedIn ";
            BroadcasteConfig.LinkedIn = 1;
        }
        BroadcasteConfig.Message = $('#txtmsg').val();
        $.ajax({
            url: "/WorkFlow/SaveConfig/SaveBroadcasteConfig",
            type: 'post',
            dataType: 'json',
            data: JSON.stringify({ 'BroadcasteConfig': BroadcasteConfig }),
            contentType: "application/json; charset=utf-8",
            success: function (ReturnBroadcasteConfigId) {
                SetNodeConfigArray(ClickedNodeId.toString(), ReturnBroadcasteConfigId, title);
                if ($.urlParam("WorkflowId") > 0) {
                    $.ajax({
                        url: "/WorkFlow/SaveConfig/UpdateDate",
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
        $(".bgShadedDiv").hide();
        $(".CustomPopUp").hide("fast");
        workflowUtil.segmentClearFields();
    }
});


//------------------Broadcaste End------------
var InAppDetails = {
    Validation: function () {
        if ($('#ddlinappbanner').get(0).selectedIndex == 0) {
            $('#ddlinappbanner').focus();
            ShowErrorMessage("Please select Campaign Name.");
            return false;
        }
        return true;
    },
    GetInAppCampaigns: function () {
        $.ajax({
            url: "/Mobile/MobileEngagement/GetCampaigns",
            type: 'POST',
            data: JSON.stringify({ 'Action': 'GetInAppCampaign' }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                InAppDetails.BindInAppCampaigns(response.Table2);
            },
            error: ShowAjaxError
        });
    },

    BindInAppCampaigns: function (AllCampaigns) {
        if (AllCampaigns != null && AllCampaigns != undefined) {


            var activeCampaigns = JSLINQ(AllCampaigns).Where(function (item) { return item.Status == 1; }).Select(function (item) { return item; }).items
            var found = DropdownPreBind.filter(function (item) { return item.Channel === "Inapp"; });
            if (found.length != 0) {
                DropdownPreBind.splice(DropdownPreBind.findIndex(x => x.Channel == "Inapp"), found.length)
            }
            if (activeCampaigns.length > 0) {
                $.each(activeCampaigns, function () {
                    var optlist = document.createElement('option');
                    optlist.value = $(this)[0].Id;
                    optlist.text = $(this)[0].Name;
                    document.getElementById("ddlinappbanner").options.add(optlist);
                    DropdownPreBind.push({ "Channel": "Inapp", "Id": $(this)[0].Id, "Text": $(this)[0].Name });
                });

            }

        }
        GetNodeConfigurationId();
        chatDetails.GetAllChat();
    }
};
$("#btnSaveinappbanner").click(function () {
    if (InAppDetails.Validation()) {
        workflowUtil.GeneralBinding(NodeText, ClickedNodeId);
        InAppConfig = {};
        InAppConfig.MobileCampaignId = $("#ddlinappbanner").val();
        InAppConfig.CampaignType = 2;
        var title = $("#ddlinappbanner option:selected").text();
        InAppConfig.CampaignType = 2;
        var result = ArrayConfig.filter(x => x.Channel === ClickedNodeId).map(x => x.Value)
        if (result != '') {
            InAppConfig.ConfigureMobileId = parseInt(result);
        }
        $.ajax({
            url: "/WorkFlow/SaveConfig/SaveInappbannerConfig",
            type: 'post',
            dataType: 'json',
            data: JSON.stringify({ 'InappConfig': InAppConfig }),
            contentType: "application/json; charset=utf-8",
            success: function (ReturnInappConfigId) {
                SetNodeConfigArray(ClickedNodeId.toString(), ReturnInappConfigId, title);
                if ($.urlParam("WorkflowId") > 0) {
                    $.ajax({
                        url: "/WorkFlow/SaveConfig/UpdateDate",
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

        $(".bgShadedDiv").hide();
        $(".CustomPopUp").hide("fast");
        workflowUtil.formClearFields();

    }
});


/*Groups Part Starts Here*/
function selecttab(tabid, tabid1, tabid2) {
    $('#tbl' + tabid).show();
    $('#tbl' + tabid1).hide();
    $('#tbl' + tabid2).hide();
    $('#tab' + tabid).removeClass("tabhover");
    $('#tab' + tabid).addClass("tabdefault");
    $('#tab' + tabid1).removeClass("tabdefault");
    $('#tab' + tabid1).addClass("tabhover");
    $('#tab' + tabid2).removeClass("tabdefault");
    $('#tab' + tabid2).addClass("tabhover");
    $("#ui_txtSearchgrouporEmailId").val('');
    if (tabid == '2') {
        $('#ui_txtSearchgrouporEmailId').show();
        ContactDetails = []; //contactIds = [];
        $("#ui_txtSearchgrouporEmailId").removeAttr("name").attr("name", "individual").removeAttr("placeholder").attr("placeholder", "Search by email id");
        BindIndividualData();
        setTimeout(function () { checkInput(contactIds); }, 1000);
    }
    else if (tabid == '3') { $('#ui_txtSearchgrouporEmailId').hide(); }
    else {
        $('#ui_txtSearchgrouporEmailId').show();
        GroupDetails = []; //GroupIds = [];
        $("#ui_txtSearchgrouporEmailId").removeAttr("name").attr("name", "group").removeAttr("placeholder").attr("placeholder", "Search by group name");
        BindGroupData();
        setTimeout(function () { checkGroupInput(GroupIds); }, 1000);
    }
}
BindIndividualData = function () {
    ContactDetails = [];
    $("#ui_DataBind").empty();
    contactDetails.EmailId = $("#ui_txtSearchgrouporEmailId").val();
    var AgeRange1 = null, AgeRange2 = null, GroupId = null; rowIndex = 0;
    $.ajax({
        url: "/WorkFlow/Groups/GetContactMaxCount",
        type: 'post',
        dataType: 'json',
        data: JSON.stringify({ 'contact': contactDetails, 'AgeRange1': AgeRange1, 'AgeRange2': AgeRange2, 'GroupId': GroupId }),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            maxRowCount = response.returnVal;
            if (maxRowCount == 0) {
                $("#ui_txtSearchgrouporEmailId").prop("disabled", false);
                $("#ui_divNodata").show();
                $("#div_ViewMore,#ui_divContact").hide();
            }
            else {
                $("#ui_divNodata").hide();
                $("#div_ViewMore").show();

                if (maxRowCount > 20) {
                    $("#ui_spanlinkdata").hide();
                    $("#ui_lnkViewMore").show();
                }
                else {
                    $("#ui_lnkViewMore").hide();
                    $("#ui_spanlinkdata").show();
                }

                var numberOfRecords = GetNumberOfRecordsPerPage();
                CreateTable(numberOfRecords);
            }
        },
    });

};
CreateTable = function (numberRowsCount) {
    var AgeRange1 = null, AgeRange2 = null, GroupId = null;
    var OffSet = rowIndex;
    var FetchNext = numberRowsCount;

    $.ajax({
        url: "/WorkFlow/Groups/GetDetails",
        type: 'Post',
        data: JSON.stringify({ 'contact': contactDetails, 'FetchNext': FetchNext, 'OffSet': OffSet, 'AgeRange1': AgeRange1, 'AgeRange2': AgeRange2, 'GroupId': GroupId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindIndividualContactData,
        error: ShowAjaxError
    });
};

BindIndividualContactData = function (response) {
    if ($.trim($("#ui_txtSearchgrouporEmailId").val()).length == 0) {
        GetSelectedContactDetails(response);
    } else {
        onSuccess(response);
    }
};

function GetSelectedContactDetails(response) {
    if (contactIds.length > 0) {

        var uniqueContactIds = [];
        $.each(contactIds, function (i, el) {
            if ($.inArray(el, uniqueContactIds) === -1) uniqueContactIds.push(el);
        });

        $.ajax({
            url: "/WorkFlow/Groups/GetContacts",
            type: 'Post',
            data: JSON.stringify({ 'ContactIds': uniqueContactIds.toString() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (contactListDetails) {
                if (contactListDetails.length > 0) {
                    for (var i = 0; i < contactListDetails.length; i++) {
                        var IsExists = JSLINQ(response).Where(function () { return (this.ContactId == contactListDetails[i].ContactId); });
                        if (IsExists.items.length > 0) {
                            var index = response.indexOf(IsExists.items[0]);
                            if (index > -1) {
                                response.splice(index, 1);
                                response.unshift(IsExists.items[0]);
                            }
                        }
                        else {
                            response.pop();
                            response.unshift(contactListDetails[i]);
                        }
                    }
                    onSuccess(response);
                }
            },
            error: ShowAjaxError
        });
    }
    else {
        onSuccess(response);
    }
}

onSuccess = function (response) {
    if (response.length > 0) {
        rowIndex = response.length + rowIndex;

        $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");

        if (rowIndex >= maxRowCount) {
            $("#ui_lnkViewMore").hide();
            $("#ui_spanlinkdata").show();
        }


        $("#ui_divContact").show();
        var data = response;
        $.each(data, function (i) {
            ContactDetails.push($(this)[0]);
            var tdContent = "";
            var Name = $(this)[0].Name == null ? "NA" : $(this)[0].Name.length > 15 ? $(this)[0].Name.substring(0, 15) + "..." : $(this)[0].Name;
            var EmailId = $(this)[0].EmailId == null ? "NA" : $(this)[0].EmailId;
            var PhoneNumber = $(this)[0].PhoneNumber == null ? "NA" : $(this)[0].PhoneNumber;
            tdContent += "<div style='float:left;width:30%;' title='" + $(this)[0].Name + "'><input id='chk_" + $(this)[0].ContactId + "' value='" + $(this)[0].ContactId + "' type='checkbox' autocomplete='off' name='contact' />" + Name + "</div>";
            tdContent += "<div style='float:left;width:50%;'>" + EmailId + "</div>";
            tdContent += "<div style='float:left;width:20%;text-align:right;'>" + PhoneNumber + "</div>";
            $("#ui_DataBind").append("<div class='itemStyle'>" + tdContent + "</div>");
        });
        //if (selectedsegmentids.length != 0) {
        //    for (i = 0; i < selectedsegmentids.length; i++) {
        //        $("#chk_" + selectedsegmentids[i]).prop("checked", true);
        //    }
        //}
        setTimeout(function () { checkInput(contactIds); }, 1000);
    }
    else {
        $("#ui_divContact").hide();
        $("#ui_divNodata").show();
    }
    viewMoreDisable = false;
    $("#ui_txtSearchgrouporEmailId").prop('disabled', false);
};
function ViewMore() {
    if (!viewMoreDisable) {

        if (rowIndex == maxRowCount) {
            ShowErrorMessage("No more contact(s) to display.");
            $("#ui_lnkViewMore").hide();
            $("#ui_spanlinkdata").show();
        }
        else {
            $("#dvLoading").show();
            viewMoreDisable = true;
            var numberOfRecords = GetNumberOfRecordsPerPage();
            CreateTable(numberOfRecords);
        }
    }
}
$(document.body).on('click', 'input[type="checkbox"]', function (event) {
    if ($(this).attr('name') == "contact") {
        if (GroupIds.length > 0 || $("#chkallusers").prop("checked")) {
            selectedcount = 0;
            $("#dvtotalindcontacts").empty();
            $("#dvtotalgrpcontacts").empty();
            $("#chkallusers").prop("checked", false);
            ShowErrorMessage("The selected groups and all users will be unchecked");
        }
        UncheckGroupInput(GroupIds);
        GroupIds.length = 0;
        if ($(this).is(":checked")) {
            var contactId = $(this).val();
            var ReplaceContactDetails = new Array();
            ReplaceContactDetails = ContactDetails;
            var IsExist = JSLINQ(ReplaceContactDetails).Where(function () { return (this.ContactId == contactId); });


            for (var i = 0; i < ReplaceContactDetails.length; i++) {
                if (ReplaceContactDetails[i].ContactId == contactId) {
                    selectedcount++;
                    ReplaceContactDetails.splice(i, 1);//removes one item from the given index i
                    break;
                }
            }
            $("#dvtotalindcontacts").html("Total contacts : <b>" + selectedcount + "<b>");
            rowIndex = 0;
            contactIds.push(contactId);
            ContactDetails = [];
            ReplaceContactDetails.unshift(IsExist.items[0]);
            $("#ui_DataBind").empty();
            onSuccess(ReplaceContactDetails);
            checkInput(contactIds);
        }
        else {
            var contactId = $(this).val();
            for (var i = 0; i < contactIds.length; i++) {
                if (contactIds[i] == contactId) {
                    selectedcount--;
                    contactIds.splice(i, 1);//removes one item from the given index i
                    break;
                }
            }
            $("#dvtotalindcontacts").html("Total contacts : <b>" + selectedcount + "<b>");
        }
    }
    else if ($(this).attr('name') == "group") {
        if (contactIds.length > 0 || $("#chkallusers").prop("checked")) {
            selectedcount = 0;
            $("#dvtotalgrpcontacts").empty();
            $("#dvtotalindcontacts").empty();
            $("#chkallusers").prop("checked", false);
            ShowErrorMessage("The selected contacts and all users will be unchecked");
        }

        UncheckInput(contactIds);
        contactIds.length = 0;
        if ($(this).is(":checked")) {
            var groupId = $(this).val();
            var ReplaceGroupDetails = new Array();
            ReplaceGroupDetails = GroupDetails;
            var IsExists = JSLINQ(ReplaceGroupDetails).Where(function () { return (this.Id == groupId); });
            selectedcount += parseInt($(this).attr("totalcontact"));
            $("#dvtotalgrpcontacts").html("Total contacts : <b>" + selectedcount + "<b>");

            for (var i = 0; i < ReplaceGroupDetails.length; i++) {
                if (ReplaceGroupDetails[i].Id == groupId) {
                    ReplaceGroupDetails.splice(i, 1);//removes one item from the given index i
                    break;
                }
            }

            GrouprowIndex = 0;
            GroupIds.push(groupId);
            GroupDetails = [];
            ReplaceGroupDetails.unshift(IsExists.items[0]);
            $("#ui_DataBindGroup").empty();
            BindGroupDetails(ReplaceGroupDetails);
            checkGroupInput(GroupIds);
        }
        else {
            var groupId = $(this).val();
            for (var i = 0; i < GroupIds.length; i++) {
                if (GroupIds[i] == groupId) {
                    ///for adding selected contacts count
                    selectedcount -= parseInt($(this).attr("totalcontact"));
                    $("#dvtotalgrpcontacts").html("Total contacts : <b>" + selectedcount + "<b>");
                    ///End adding selected contacts count
                    GroupIds.splice(i, 1);//removes one item from the given index i
                    break;
                }
            }
        }
    }
});



BindGroupData = function () {
    $("#ui_DataBindGroup").empty();
    Group.Name = $("#ui_txtSearchgrouporEmailId").val();
    GrouprowIndex = 0;
    $.ajax({
        url: "/WorkFlow/Groups/GetMaxCount",
        type: 'POST',
        data: JSON.stringify({ 'groups': Group }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            GroupmaxRowCount = response;
            if (GroupmaxRowCount == 0) {
                $("#ui_txtSearchgrouporEmailId").prop('disabled', false);
                $("#ui_divGroupNodata").show();
                $("#div_ViewGroupMore,#ui_divGroupContact").hide();
            }
            else {

                $("#ui_divGroupNodata").hide();
                $("#div_ViewGroupMore").show();
                if (GroupmaxRowCount > 20) {
                    $("#ui_spanlinkGroupdata").hide();
                    $("#ui_lnkGroupViewMore").show();
                }
                else {
                    $("#ui_lnkGroupViewMore").hide();
                    $("#ui_spanlinkGroupdata").show();
                }

                var numberOfRecords = GetNumberOfRecordsPerPage();
                CreateGroupTable(numberOfRecords);
                $("#ui_txtSearchgrouporEmailId").prop('disabled', false);
            }
        },
        error: ShowAjaxError
    });
};

CreateGroupTable = function (numberOfRecords) {

    var OffSet = GrouprowIndex;
    var FetchNext = numberOfRecords;

    $.ajax({
        url: "/WorkFlow/Groups/BindGroups",
        type: 'Post',
        data: JSON.stringify({ 'groups': Group, 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindGroupsData,
        error: ShowAjaxError
    });

};

BindGroupsData = function (response) {
    if ($.trim($("#ui_txtSearchgrouporEmailId").val()).length == 0) {
        GetSelectedGroupDetails(response);
    } else {
        BindGroupDetails(response);
    }
};

function GetSelectedGroupDetails(response) {
    if (GroupIds.length > 0) {

        var uniqueContactIds = [];
        $.each(GroupIds, function (i, el) {
            if ($.inArray(el, uniqueContactIds) === -1) uniqueContactIds.push(el);
        });

        $.ajax({
            url: "/WorkFlow/Groups/BindGropsDetails",
            type: 'Post',
            data: JSON.stringify({ 'GroupIds': uniqueContactIds.toString(), 'Isbelong': true, 'Offset': 0, 'FetchNext': 0 }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (GroupListDetails) {
                var GroupList = JSON.parse(GroupListDetails);
                if (GroupList.length > 0) {
                    for (var i = 0; i < GroupList.length; i++) {
                        var IsExists = JSLINQ(response).Where(function () { return (this.Id == GroupList[i].Id); });
                        if (IsExists.items.length > 0) {
                            var index = response.indexOf(IsExists.items[0]);
                            if (index > -1) {
                                response.splice(index, 1);
                                response.unshift(IsExists.items[0]);
                            }
                        }
                        else {
                            response.pop();
                            response.unshift(GroupList[i]);
                        }
                    }
                    BindGroupDetails(response);
                }
            },
            error: ShowAjaxError
        });
    }
    else {
        BindGroupDetails(response);
    }

}

BindGroupDetails = function (GroupDetail) {
    if (GroupDetail.length > 0) {
        TotalgroupContacts = 0;
        GrouprowIndex = GroupDetail.length + GrouprowIndex;

        $("#div_GroupRecords").html(GrouprowIndex + " out of " + GroupmaxRowCount + " records");

        if (GrouprowIndex >= GroupmaxRowCount) {
            $("#ui_lnkGroupViewMore").hide();
            $("#ui_spanlinkGroupdata").show();
        }

        $("#ui_divGroupContact").show();

        var data = GroupDetail;
        $.each(data, function (i) {
            GroupDetails.push($(this)[0]);
            if ($(this)[0].Total != 0) { TotalgroupContacts += parseInt($(this)[0].Total); }
            var tdContent = "";
            var Name = $(this)[0].Name == null ? "NA" : $(this)[0].Name.length > 15 ? $(this)[0].Name.substring(0, 15) + "..." : $(this)[0].Name;
            tdContent += "<div style='float:left;width:30%;' title='" + $(this)[0].Name + "'><input id='chkGroup_" + $(this)[0].Id + "' value='" + $(this)[0].Id + "' type='checkbox' autocomplete='off' name='group' totalcontact=" + $(this)[0].Total + " />" + Name + "</div>";
            //tdContent += "<div style='float:left;width:20%;text-align:right;'>" + $(this)[0].Total + "</div>";
            tdContent += "<div style='float:left;width:20%;text-align:right;cursor: pointer;' id='vw_" + $(this)[0].Id + "' onclick='GetDetails(" + $(this)[0].Id + "," + cnt + ");'>View</div>";
            tdContent += "<div style='float:left;width:50%;text-align:right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].CreatedDate)) + "</div>";


            $("#ui_DataBindGroup").append("<div class='itemStyle' id='itemId" + cnt + "'>" + tdContent + "</div>");
            cnt++;
        });
        if (selectedsegmentids.length != 0) {
            for (i = 0; i < selectedsegmentids.length; i++) {
                $("#chkGroup_" + selectedsegmentids[i]).prop("checked", true);
            }
        }
        setTimeout(function () { checkGroupInput(GroupIds); }, 1000);
    }
    else {
        $("#ui_divGroupContact").hide();
        $("#ui_divGroupNodata").show();
    }
    GroupviewMoreDisable = false;
};
//function ArrangeSeleted(GroupContactDetails) {

//    if (GroupIds.length > 0) {
//        for (var i = 0; i < GroupIds.length; i++) {
//            var IsExists = JSLINQ(GroupContactDetails).Where(function () { return (this.Id == GroupIds[i]); });
//            if (IsExists.items.length > 0) {
//                var index = GroupContactDetails.indexOf(IsExists.items[0]);
//                if (index > -1) {
//                    GroupContactDetails.splice(index, 1);
//                    GroupContactDetails.unshift(IsExists.items[0]);
//                }
//            }
//        }

//        return GroupContactDetails;
//    }
//    else {
//        return GroupContactDetails;
//    }

//}

//function ArrangeContactSeleted(ContactDetails) {
//    if (contactIds.length > 0) {

//        var uniqueContactIds = [];
//        $.each(contactIds, function (i, el) {
//            if ($.inArray(el, uniqueContactIds) === -1) uniqueContactIds.push(el);
//        });


//        for (var i = 0; i < uniqueContactIds.length; i++) {
//            var IsExists = JSLINQ(ContactDetails).Where(function () { return (this.ContactId == uniqueContactIds[i]); });
//            if (IsExists.items.length > 0) {
//                var index = ContactDetails.indexOf(IsExists.items[0]);
//                if (index > -1) {
//                    ContactDetails.splice(index, 1);
//                    ContactDetails.unshift(IsExists.items[0]);
//                }
//            }
//        }

//        return ContactDetails;
//    }
//    else {
//        return ContactDetails;
//    }

//}


function GroupViewMore() {
    if (!GroupviewMoreDisable) {

        if (GrouprowIndex == GroupmaxRowCount) {
            ShowErrorMessage("No more group(s) to display.");
            $("#ui_lnkGroupViewMore").hide();
            $("#ui_spanlinkGroupdata").show();
        }
        else {
            $("#dvLoading").show();
            GroupviewMoreDisable = true;
            var numberOfRecords = GetNumberOfRecordsPerPage();
            CreateGroupTable(numberOfRecords);
        }
    }
}
$("#ui_txtSearchgrouporEmailId").keypress(function (e) {
    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {

        if ($(this).attr("name") == "group") {
            GroupDetails = [];
            if ($.trim($(this).val()).length == 0) {
                ShowErrorMessage("Please enter group name to search");
                $("#ui_txtSearchgrouporEmailId").focus();
                return false;
            }
            GrouprowIndex = GroupmaxRowCount = 0;
            $("#ui_lnkGroupViewMore").hide();
            $("#ui_spanlinkGroupdata").show();
            $("#ui_txtSearchgrouporEmailId").prop('disabled', true);
            BindGroupData();
            return false;
        }
        else {
            ContactDetails = [];
            if ($.trim($(this).val()).length == 0) {
                ShowErrorMessage("Please enter email id to search");
                $("#ui_txtSearchgrouporEmailId").focus();
                return false;
            }
            rowIndex = maxRowCount = 0;
            $("#ui_txtSearchgrouporEmailId").prop('disabled', true);
            $("#ui_lnkViewMore").hide();
            $("#ui_spanlinkdata").show();
            BindIndividualData();
            return false;
        }
    }
    return true;
});
$("#ui_txtSearchgrouporEmailId").keyup(function (e) {
    if (e.which && e.which == 8 || e.keyCode && e.keyCode == 46)
        if ($(this).attr("name") == "group") {
            if ($(this).val().length == 0) {
                GroupDetails = [];
                GrouprowIndex = GroupmaxRowCount = 0;
                $("#div_ViewGroupMore").hide();
                $("#ui_txtSearchgrouporEmailId").prop('disabled', true);
                BindGroupData();
                setTimeout(function () { checkGroupInput(GroupIds); }, 1000);
            }
        }
        else {
            ContactDetails = [];
            rowIndex = maxRowCount = 0;
            $("#div_ViewMore").hide();
            $("#ui_txtSearchgrouporEmailId").prop('disabled', true);
            BindIndividualData();
            setTimeout(function () { checkInput(contactIds); }, 1000);
        }
});
checkInput = function (contactIds) {
    for (var i = 0; i < contactIds.length; i++) {
        $("#chk_" + contactIds[i]).prop("checked", true);
    }
}
checkGroupInput = function (GroupIds) {
    for (var i = 0; i < GroupIds.length; i++) {
        $("#chkGroup_" + GroupIds[i]).prop("checked", true);
    }
}

UncheckInput = function (contactIds) {
    for (var i = 0; i < contactIds.length; i++) {
        $("#chk_" + contactIds[i]).prop("checked", false);
    }
}

UncheckGroupInput = function (GroupIds) {
    for (var i = 0; i < GroupIds.length; i++) {
        $("#chkGroup_" + GroupIds[i]).prop("checked", false);
    }
}


//GetSelectedIds = function () {

//    var GroupIdList = [];

//    $("input[name='group']:checkbox:checked").map(function () {
//        GroupIdList.push($(this).val());
//    });

//    return GroupIdList;
//};
GetSelectedIds = function () {
    var GroupIdList = [];
    var datas = $('#ui_txtSearchgrouporEmailId').attr('name') == "group" ? "group" : "contact";
    $("input[name=" + datas + "]:checkbox:checked").map(function () {
        GroupIdList.push($(this).val());
    });
    return GroupIdList;
}
$("#btngroupdetails").click(function () {
    var SelectedSegmentIds = GroupIds;
    if (SelectedSegmentIds == "") {
        ShowErrorMessage("Please select any group!");
    }
    else {
        AudienceConfig = {};
        $.ajax({
            url: "/WorkFlow/Create/GetgroupsCount",
            type: 'POST',
            data: JSON.stringify({ 'GrpIds': SelectedSegmentIds.toString() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if ($("#chkgrpbelongs").prop('checked')) {
                    SegmentName = "group~belong";
                    AudienceConfig.IsBelongToGroup = true;
                }
                else if ($("#chkgrpnotbelongs").prop('checked')) {
                    var Getnotbelongscount = TotalgroupContacts - response;
                    SegmentName = SegmentName = "group~notbelong";
                    AudienceConfig.IsBelongToGroup = false;
                }

                SetNodeConfigArray(ClickedNodeId.toString(), SelectedSegmentIds.toString(), SegmentName);
                if (WorkflowId > 0) {
                    AudienceConfig.SegmentId = SelectedSegmentIds.toString();
                    AudienceConfig.WorkFlowId = WorkflowId;
                    AudienceConfig.SegmentName = SegmentName.toString();
                    AudienceConfig.Segment = ClickedNodeId.toString();
                    AudienceConfig.IsGroupOrIndividual = false;
                    $.ajax({
                        url: "/WorkFlow/Create/UpdateAudience",
                        type: 'post',
                        dataType: 'json',
                        data: JSON.stringify({ 'AudienceConfig': AudienceConfig }),
                        contentType: "application/json; charset=utf-8",
                        success: function (ReturnAudienceConfigId) {
                            //if (ReturnAudienceConfigId == 0) {
                            //    ShowErrorMessage("Audience has been updated");
                            //}
                        },
                    });
                }
            },
            error: ShowAjaxError
        });

        $(".bgShadedDiv").hide();
        $(".CustomWorkFlowPopUp").hide("fast");
    }
});
$("#btnsavecontatcs").click(function () {
    var SelectedSegmentIds = contactIds;
    if (SelectedSegmentIds == "") {
        ShowErrorMessage("Please select any one contact!");
    }
    else {
        SetNodeConfigArray(ClickedNodeId.toString(), SelectedSegmentIds.toString(), "individual (" + SelectedSegmentIds.toString().split(',').length + ")");
        if (WorkflowId > 0) {
            AudienceConfig = {};
            AudienceConfig.SegmentId = SelectedSegmentIds.toString();
            AudienceConfig.WorkFlowId = WorkflowId;
            AudienceConfig.SegmentName = "individual (" + SelectedSegmentIds.toString().split(',').length + ")~0";
            AudienceConfig.Segment = ClickedNodeId.toString();
            AudienceConfig.IsGroupOrIndividual = true;
            $.ajax({
                url: "/WorkFlow/Create/UpdateAudience",
                type: 'post',
                dataType: 'json',
                data: JSON.stringify({ 'AudienceConfig': AudienceConfig }),
                contentType: "application/json; charset=utf-8",
                success: function (ReturnAudienceConfigId) {
                    //if (ReturnAudienceConfigId == 0) {
                    //    ShowErrorMessage("Audience has been updated");
                    //}
                },
            });
        }

    }
    $(".bgShadedDiv").hide();
    $(".CustomWorkFlowPopUp").hide("fast");
});

$("#chkallusers").click(function () {
    if ($(this).is(":checked")) {
        if (contactIds.length > 0 || GroupIds.length > 0) {
            contactIds.length = 0;
            GroupIds.length = 0;
            ShowErrorMessage("The Selected contacts and all groups will be unchecked");
        }
    }
});


$("#btnallusers").click(function () {

    if ($("#chkallusers").is(':checked')) {
        SetNodeConfigArray(ClickedNodeId.toString(), 1, "Allusers", 0);
        AudienceConfig = {};
        AudienceConfig.SegmentId = 0;
        AudienceConfig.WorkFlowId = WorkflowId;
        AudienceConfig.SegmentName = "Allusers";
        AudienceConfig.Segment = ClickedNodeId.toString();
        AudienceConfig.IsGroupOrIndividual = false;
        AudienceConfig.IsBelongToGroup = false;
        if (WorkflowId > 0) {
            $.ajax({
                url: "/WorkFlow/Create/UpdateAudience",
                type: 'post',
                dataType: 'json',
                data: JSON.stringify({ 'AudienceConfig': AudienceConfig }),
                contentType: "application/json; charset=utf-8",
                success: function (ReturnAudienceConfigId) {
                },
            });
        }
        $(".bgShadedDiv").hide();
        $(".CustomWorkFlowPopUp").hide("fast");
    }
    else {
        ShowErrorMessage("Please select allusers !");
    }
});
/*Groups Part Ends Here*/

var FinalUrlToAppend = "";
var staticWebHookUrl = "";
var HeaderIdList = [1];
var HearderKeyValue = [];
var ParamKeyValue = [];
var ParamsValue = [];
var ParamsExtraValue = [];
$("#ui_AppendStaticMobileWebHookUrl").click(function () {
    if ($(this).is(":checked"))
        $("#ui_txtReportThroughMobileNotifications").val(staticWebHookUrl);
    else
        $("#ui_txtReportThroughMobileNotifications").val("");
});

/*Alert Responses Save part*/

$("#btnAlterResponsesSave").click(function () {


    if (!AlertResponsesValidation()) {
        return false;
    }
    alterReponses.AlertThroughEmail = $.trim(CleanText($("#ui_txtReportThroughEmail").val()));
    alterReponses.AlertThroughSMS = $.trim(CleanText($("#ui_txtReportThroughSMS").val()));
    alterReponses.AlertThroughCall = $.trim(CleanText($("#ui_txtReportThroughCall").val()));
    alterReponses.AssignLeadToUserId = $.trim(CleanText($("#ui_ddlAlertUserList option:selected").val())) == "0" ? "" : $.trim(CleanText($("#ui_ddlAlertUserList option:selected").val()));
    alterReponses.GroupId = $.trim(CleanText($("#ui_ddlAlertGroupList option:selected").val())) == "0" ? "" : $.trim(CleanText($("#ui_ddlAlertGroupList option:selected").val()));
    alterReponses.RedirectUrl = $.trim(CleanText($("#ui_txtRedirectUrl").val()));
    alterReponses.MobileNotificationUrl = $.trim(CleanText($("#ui_txtReportThroughMobileNotifications").val()));
    alterReponses.WebHooksUrl = WebHookUrlFilter().toString();
    alterReponses.WebHookMethodType = $.trim(CleanText($("#ui_ddMethodType option:selected").val())) == "0" ? "" : $.trim(CleanText($("#ui_ddMethodType option:selected").val()));



    HearderKeyValue.length = 0;
    ParamKeyValue.length = 0;
    ParamsExtraValue.length = 0;

    for (var i = 0; i < HeaderIdList.length; i++) {
        var JJ = HeaderIdList[i];
        if (JJ != null) {

            if ($("#ui_txtheaderKey" + JJ).val() != null && $("#ui_txtheaderKey" + JJ).val() != undefined) {
                if ($("#ui_txtheaderKey" + JJ).val().length > 0 && $("#ui_txtheaderValue" + JJ).val().length > 0) {
                    var keyValue = new Object();
                    keyValue.Key = $.trim(CleanText($("#ui_txtheaderKey" + JJ).val()));
                    keyValue.Value = $.trim(CleanText($("#ui_txtheaderValue" + JJ).val()));
                    HearderKeyValue.push(keyValue);
                }
            }

            //if ($("#ui_txtheaderKey" + JJ).val().length > 0 && $("#ui_txtheaderValue" + JJ).val().length) {
            //    var keyValue = new Object();
            //    keyValue.Key = $.trim(CleanText($("#ui_txtheaderKey" + JJ).val()));
            //    keyValue.Value = $.trim(CleanText($("#ui_txtheaderValue" + JJ).val()));
            //    HearderKeyValue.push(keyValue);
            //}

            //if ($("#ui_txtheaderKey" + JJ).val() != null && $("#ui_txtheaderKey" + JJ).val() != undefined) {
            //    if ($("#ui_txtheaderKey" + JJ).val().length > 0 && $("#ui_txtheaderValue" + JJ).val().length) {
            //        var keyValue = new Object();
            //        keyValue.Key = $.trim(CleanText($("#ui_txtheaderKey" + JJ).val()));
            //        keyValue.Value = $.trim(CleanText($("#ui_txtheaderValue" + JJ).val()));
            //        HearderKeyValue.push(keyValue);
            //    }
            //}

        }
    }

    for (var i = 0; i < ContactList.length; i++) {
        if ($("#ui_txtWebhookColumn_" + ContactList[i].value).val().length > 0) {
            var ContactField = new Object();
            ContactField.ColumnName = ContactList[i].value;
            ContactField.Value = $.trim(CleanText($("#ui_txtWebhookColumn_" + ContactList[i].value).val()));
            ParamKeyValue.push(ContactField);
        }
    }

    if (ParamsValue.length > 0) {
        for (var i = 0; i < ParamsValue.length; i++) {
            if ($("#ui_tdparams" + ParamsValue[i]).val().length > 0 && $("#ui_tdvalue" + ParamsValue[i]).val().length > 0) {
                var ContactField = new Object();
                ContactField.ColumnName = $.trim(CleanText($("#ui_tdparams" + ParamsValue[i]).val()));
                ContactField.Value = $.trim(CleanText($("#ui_tdvalue" + ParamsValue[i]).val()));
                ParamsExtraValue.push(ContactField);
            }
        }
    }


    if ($.trim(CleanText($("#ui_txtAlertWebHookUrl").val())).length > 0) {
        if (HearderKeyValue.length == 0) {
            ShowErrorMessage("Please enter header feilds.");
            return false;
        }

        if (ParamKeyValue.length == 0) {
            ShowErrorMessage("Please enter params feilds.");
            return false;
        }
    }

    if (HearderKeyValue.length > 0 || ParamKeyValue.length > 0 || $.trim(CleanText($("#ui_ddMethodType option:selected").val())) != "0") {
        if ($.trim(CleanText($("#ui_txtAlertWebHookUrl").val())).length == 0) {
            $("#ui_txtAlertWebHookUrl").focus();
            ShowErrorMessage("Please enter api url.");
            return false;
        }
    }

    if (!CheckValuesIntab()) {
        ShowErrorMessage("Please enter any of the fields.");
        return false;
    }


    alterReponses.WebHookHeader = JSON.stringify(HearderKeyValue);
    alterReponses.SelectedTab = SelectedTabDetails();
    alterReponses.WebHooksFinalUrl = GetFinalUrlReplace(alterReponses.WebHooksUrl, ParamKeyValue, ParamsExtraValue);
    alterReponses.WebHookFinalParams = GetJsonFormat(ParamKeyValue, ParamsExtraValue);
    alterReponses.WebPushUsers = GetListDataBySpanId($("#ui_txtWebpush_values"), "value", "").join(",");
    alterReponses.AppPushUsers = GetListDataBySpanId($("#ui_txtMobilepush_values"), "value", "").join(",");
    alterReponses.WebHookParams = JSON.stringify(ParamKeyValue);
    alterReponses.WebHookExtraParams = JSON.stringify(ParamsExtraValue);

    $.ajax({
        url: "/WorkFlow/SaveConfig/SaveAlertResponsesConfig",
        type: 'Post',
        data: JSON.stringify({ 'alertResponses': alterReponses }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (AlertId) {
            // console.log(AlertId);
            SetNodeConfigArray(ClickedNodeId.toString(), AlertId, alterReponses.SelectedTab);
        },
        error: ShowAjaxError
    });
    $(".bgShadedDiv").hide();
    $(".CustomPopUp").hide("fast");
    workflowUtil.segmentClearFields();

});

function CheckValuesIntab() {
    alterReponses.WebPushUsers = GetListDataBySpanId($("#ui_txtWebpush_values"), "value", "").join(",");
    alterReponses.AppPushUsers = GetListDataBySpanId($("#ui_txtMobilepush_values"), "value", "").join(",");
    if ($("#ui_txtReportThroughEmail").val().length == 0 && $("#ui_txtReportThroughSMS").val().length == 0 && $("#ui_txtReportThroughCall").val().length == 0 && $.trim(CleanText($("#ui_txtAlertWebHookUrl").val())).length == 0 && $("#ui_txtRedirectUrl").val().length == 0 && $("#ui_ddlAlertGroupList option:selected").val() == "0" && $("#ui_ddlAlertUserList option:selected").val() == "0" && alterReponses.WebPushUsers.length == 0 && alterReponses.AppPushUsers.length == 0)
        return false;
    else
        return true;
}


function SelectedTabDetails() {
    alterReponses.WebPushUsers = GetListDataBySpanId($("#ui_txtWebpush_values"), "value", "").join(",");
    alterReponses.AppPushUsers = GetListDataBySpanId($("#ui_txtMobilepush_values"), "value", "").join(",");
    var tabs = "";
    if ($("#ui_txtReportThroughEmail").val().length > 0 || $("#ui_txtReportThroughSMS").val().length > 0 || $("#ui_txtReportThroughCall").val().length > 0 || alterReponses.WebPushUsers.length > 0 || alterReponses.AppPushUsers.length > 0) {
        if (tabs != "")
            tabs = tabs + ",Alert"
        else
            tabs += "Alert"
    }
    if ($.trim(CleanText($("#ui_txtAlertWebHookUrl").val())).length > 0) {
        if (tabs != "")
            tabs = tabs + ",Plugins"
        else
            tabs = "Plugins"
    }

    if ($("#ui_txtRedirectUrl").val().length > 0 || $("#ui_ddlAlertGroupList option:selected").val() != "0" || $("#ui_ddlAlertUserList option:selected").val() != "0") {
        if (tabs != "")
            tabs = tabs + ",Others"
        else
            tabs = "Others"
    }

    return tabs;
}


AlertResponsesValidation = function () {

    if ($("#ui_txtReportThroughEmail").val().length > 0) {
        var ReportThroughEmail = $.trim(CleanText($("#ui_txtReportThroughEmail").val()));
        var ArrayEmailId = ReportThroughEmail.split(',');
        for (var i = 0; i < ArrayEmailId.length > 0; i++) {
            var result = true;
            if (ArrayEmailId[i] == "") {
                result = false;
            }
            else if (!regExpEmail.test(ArrayEmailId[i])) {
                result = false;
            }

            if (!result) {
                $("#ui_txtReportThroughEmail").focus();
                ShowErrorMessage("Please enter correct email id.");
                return false;
            }
        }
    }

    if ($("#ui_txtReportThroughSMS").val().length > 0) {
        var ReportThroughSMS = $.trim(CleanText($("#ui_txtReportThroughSMS").val()));
        var ArrayPhoneNumbers = ReportThroughSMS.split(',');
        for (var i = 0; i < ArrayPhoneNumbers.length > 0; i++) {
            var result = true;

            if (ArrayPhoneNumbers[i] == "") {
                result = false;
            }
            else if (ArrayPhoneNumbers[i].length > 0 && ArrayPhoneNumbers[i].length < 9) {
                result = false;
            }
            if (!result) {
                $("#ui_txtReportThroughSMS").focus();
                ShowErrorMessage("Please enter correct phone numbers for sms");
                return false;
            }
        }
    }

    if ($("#ui_txtReportThroughCall").val().length > 0) {
        var ReportThroughCall = $.trim(CleanText($("#ui_txtReportThroughCall").val()));
        var ArrayPhoneNumbers = ReportThroughCall.split(',');
        for (var i = 0; i < ArrayPhoneNumbers.length > 0; i++) {
            var result = true;

            if (ArrayPhoneNumbers[i] == "") {
                result = false;
            }
            else if (ArrayPhoneNumbers[i].length > 0 && ArrayPhoneNumbers[i].length < 9) {
                result = false;
            }
            if (!result) {
                $("#ui_txtReportThroughCall").focus();
                ShowErrorMessage("Please enter correct phone numbers for call");
                return false;
            }
        }
    }

    if ($("#ui_txtRedirectUrl").val().length > 0) {
        var RedirectUrl = $.trim(CleanText($("#ui_txtRedirectUrl").val()));
        if (!regExpUrl.test(RedirectUrl)) {
            $("#ui_txtRedirectUrl").focus();
            ShowErrorMessage("Please enter correct url");
            return false;
        }
    }


    if ($.trim(CleanText($("#ui_txtAlertWebHookUrl").val())).length > 0) {
        var WebHoobkUrl = $.trim(CleanText($("#ui_txtAlertWebHookUrl").val()));
        var ArrayWebHoobkUrls = WebHoobkUrl.split('||');

        if (WebHoobkUrl.length > 0) {
            for (var i = 0; i < ArrayWebHoobkUrls.length; i++) {
                if (!regExpUrl.test(ArrayWebHoobkUrls[i])) {
                    $("#ui_txtAlertWebHookUrl").focus();
                    ShowErrorMessage("Please enter correct api url");
                    return false;
                }
            }

            if ($("#ui_ddMethodType option:selected").val() == "0") {
                $("#ui_txtAlertWebHookUrl").focus();
                ShowErrorMessage("Please select method type");
                return false;
            }
        }
    }


    return true;
}

function WebHookUrlFilter() {
    var WebHoobkUrl = $.trim(CleanText($("#ui_txtAlertWebHookUrl").val()));
    var ArrayWebHoobkUrls = WebHoobkUrl.split('||');
    return ArrayWebHoobkUrls;
}


/*webHook plugin Header*/
AddNewKeyValue = function (rowindex) {
    var index = rowindex + 1;
    HeaderIdList.push(index);
    if ($("#ui_divHeader").height() >= 100) {
        $("#ui_divHeader").removeAttr("style").css({ "height": "100px", "overflow-y": "auto" });
        $('#ui_divHeader').scrollTop();
        $("#ui_divHeader").animate({ scrollTop: $('#ui_divHeader').get(0).scrollHeight }, 1000);
        $("#dvcustompopupalert").css({ "height": "550px" });
    }
    else {
        $("#dvcustompopupalert").css({ "height": "" });
    }

    $("#ui_tdlink" + rowindex).html("<a onclick='javascript: RemoveKeyValue(" + rowindex + ");' class='tabhover'><label style='cursor:pointer;'>Remove</label></a>");
    var HeaderKeyValue = "";
    HeaderKeyValue += "<td style='padding-bottom:5px;'><input id='ui_txtheaderKey" + index + "' type='text' class='textBox' placeholder='Key' /></td>";
    HeaderKeyValue += "<td><input id='ui_txtheaderValue" + index + "' type='text' class='textBox' placeholder='Value' /></td>";
    HeaderKeyValue += "<td id='ui_tdlink" + index + "'><a onclick='javascript:AddNewKeyValue(" + index + ");' class='tabhover' title='Add another key and value'><label style='cursor:pointer;'>Add</label></a></td>"
    $("#ui_tblHeader").append("<tr id='ui_trRow" + index + "'>" + HeaderKeyValue + "</tr>");
}

RemoveKeyValue = function (rowindex) {
    var index = HeaderIdList.indexOf(rowindex);
    if (index > -1) {
        HeaderIdList.splice(index, 1);
    }
    var Scrollbarheight = $('#ui_divHeader').prop('scrollHeight');
    if (Scrollbarheight <= 136 || Scrollbarheight <= 150) {
        $("#ui_divHeader").removeAttr("style").css({ "height": "auto" });
    }

    $("#ui_trRow" + rowindex).remove();
}

//Add params
AddNewParams = function (rowindex) {
    var index = rowindex + ParamsValue.length;
    ParamsValue.push(index);
    var tr = "<tr id='ui_trparams" + index + "'><td style='padding-bottom:5px;'><input type='text' class='textBox' id='ui_tdparams" + index + "' placeholder='Param' style='width: 146px;'></td><td><input type='text' class='textBox' id='ui_tdvalue" + index + "' placeholder='Value' style='margin-left:66px;width: 146px;'><a onclick='javascript:RemoveParams(" + index + ");' class='tabhover' title='Add another key and value'><label style='cursor:pointer;'>Remove</label></a></td></tr>";
    $("#ui_tblCustomParams").append(tr);

    $('#ui_divParams').scrollTop();
    $("#ui_divParams").animate({ scrollTop: $('#ui_divParams').get(0).scrollHeight }, 1000);
};

//Remove params
RemoveParams = function (rowindex) {
    var index = ParamsValue.indexOf(rowindex);
    if (index > -1) {
        ParamsValue.splice(index, 1);
    }
    $("#ui_trparams" + rowindex).remove();
};

GetContactColumns = function () {
    $.ajax({
        url: "/Mail/Configuration/GetContactColumn",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            for (var i = 0; i < response.length; i++) {
                var option = [];
                option.value = response[i].Name;
                option.text = response[i].Name;
                ContactList.push(option);
            }
            GetContactCustomFields();
        },
        error: ShowAjaxError
    });
}

GetContactCustomFields = function () {
    $.ajax({
        url: "/Mail/ContactField/GetAllFieldDetails",
        type: 'Post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response, function (i) {
                var option = [];
                option.value = "CustomField" + (i + 1);
                option.text = $(this)[0].FieldName;
                ContactList.push(option);
            });
            BindContactTextBox();
        },
        error: ShowAjaxError
    });
}

function BindContactTextBox() {
    if (ContactList != null && ContactList != undefined) {
        for (var i = 0; i < ContactList.length; i++) {

            var ParamKeyValue = "";
            ParamKeyValue += "<td style='padding-bottom:20px;'>" + ContactList[i].text + "</td>";
            ParamKeyValue += "<td><input type='text' class='textBox' id='ui_txtWebhookColumn_" + ContactList[i].value + "' placeholder='Value' /></td>";
            $("#ui_tblParams").append("<tr>" + ParamKeyValue + "</tr>");
        }
    }
}
/*web hook notification*/

function GetFinalUrlReplace(WebHooksUrl, paramvalue, paramsExtraValue) {
    var FinalJson = "";
    var FinalUrl = new Array();
    if (WebHooksUrl.length > 0 && (paramvalue.length > 0 || paramsExtraValue.length > 0)) {
        $.each(paramvalue, function (i) {

            if (i == 0) {
                FinalJson += $(this)[0].Value + "={" + $(this)[0].ColumnName + "}";
            }
            else {
                FinalJson += "&" + $(this)[0].Value + "={" + $(this)[0].ColumnName + "}";
            }
        });

        $.each(paramsExtraValue, function (i) {

            if (FinalJson != null && FinalJson.length > 0) {
                FinalJson += "&" + $(this)[0].ColumnName + "=" + $(this)[0].Value + "";
            }
            else {
                if (i == 0) {
                    FinalJson += $(this)[0].ColumnName + "=" + $(this)[0].Value + "";
                }
                else {
                    FinalJson += "&" + $(this)[0].ColumnName + "=" + $(this)[0].Value + "";
                }
            }
        });

        var Urls = WebHooksUrl.split(',');
        for (var i = 0; i < Urls.length; i++) {
            if (Urls[i].indexOf("?") > -1) {
                FinalUrl.push(Urls[i] + "&" + FinalJson);
            }
            else {
                FinalUrl.push(Urls[i] + "?" + FinalJson);
            }
        }
    }



    return JSON.stringify(FinalUrl);
}

function GetJsonFormat(ParamKeyValue, ParamsExtraValue) {
    var stringJsonArrayFormat = new Array();
    if (ParamKeyValue.length > 0 || ParamsExtraValue.length > 0) {
        var JsonFormat = "";
        var obj = new Object();
        for (var i = 0; i < ParamKeyValue.length; i++) {
            var column = ParamKeyValue[i].Value;
            obj[column] = "{" + ParamKeyValue[i].ColumnName + "}";
            stringJsonArrayFormat.push(obj);
        }
        for (var i = 0; i < ParamsExtraValue.length; i++) {
            var column = ParamsExtraValue[i].ColumnName;
            obj[column] = ParamsExtraValue[i].Value;
            stringJsonArrayFormat.push(obj);
        }
    }
    return JSON.stringify(stringJsonArrayFormat[0]);
}


function GetWebAppPushUsers(Browser) {
    $.ajax({
        url: "/WorkFlow/Create/GetWebAppPushUsers",
        type: 'Post',
        data: JSON.stringify({ "Browser": Browser }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (responses) {
            if (Browser == "web") {
                BindWebpushList(responses);
            }
            else {
                BindMobilepushList(responses);
            }
        },
        error: ShowAjaxError
    });
}

var userList = new Array();
BindWebpushList = function (ListOfUsers) {

    if (ListOfUsers != null && ListOfUsers.length > 0) {
        var Users = JSON.parse(ListOfUsers);
        if (Users.length > 0) {
            $.each(Users, function () {
                userList.push({ value: $(this)[0].UsersId.toString(), label: $(this)[0].Name });
            });
        }

        $("#ui_txtWebpush").autocomplete({
            autoFocus: true,
            minLength: 0, max: 10,
            source: userList,
            select: function (events, selectedItem) {
                AppendSelected("ui_txtWebpush_values", selectedItem, "webpush");
            },
            close: function (event, ui) {
                $(this).val("");
            }
        });
    }
};

var groupList = new Array();
BindMobilepushList = function (ListOfUsers) {
    if (ListOfUsers != null && ListOfUsers.length > 0) {
        var Users = JSON.parse(ListOfUsers);
        if (Users.length > 0) {
            $.each(Users, function () {
                groupList.push({ value: $(this)[0].UsersId.toString(), label: $(this)[0].Name });
            });
        }


        $("#ui_txtMobilepush").autocomplete({
            autoFocus: true,
            minLength: 0, max: 10,
            source: groupList,
            select: function (events, selectedItem) {
                AppendSelected("ui_txtMobilepush_values", selectedItem, "mobilepush");
            },
            close: function (event, ui) {
                $(this).val("");
            }
        });
    }
};



function AppendSelected(appendTo, data, fieldId) {

    var mainDiv = document.createElement("div");
    mainDiv.id = fieldId + "_" + data.item.value.replace(/[ ,:]+/g, "_");
    mainDiv.className = "vrAutocomplete";
    mainDiv.setAttribute("value", data.item.value);
    mainDiv.setAttribute("identifier", data.item.value.replace(/[ ,:]+/g, "_"));

    var span = document.createElement("span");
    span.className = "vnAutocomplete";

    var contentDiv = document.createElement("div");
    contentDiv.className = "vtAutocomplete";
    contentDiv.innerHTML = data.item.label;

    var removeDiv = document.createElement("div");
    removeDiv.className = "vmAutocomplete";
    removeDiv.setAttribute("onclick", "RemoveData('" + fieldId + "_" + data.item.value.replace(/[ ,:]+/g, "_") + "');");

    span.appendChild(contentDiv);
    span.appendChild(removeDiv);
    mainDiv.appendChild(span);

    var isElementIsNotAdded = true;

    $("#" + appendTo).children().each(function () {
        if (data.item.value.replace(/ /g, "_").replace(/,/g, "_") == $(this).attr("identifier")) {
            isElementIsNotAdded = false;
            return false;
        }
    });

    if (isElementIsNotAdded)
        $("#" + appendTo).append(mainDiv);
    else
        ShowErrorMessage("This Item is already added.");
}

function RemoveData(data) {
    data = $.trim(data);
    $("#" + data).remove();
}

GetListDataBySpanId = function (spanTag, valueType, replaceId) {

    var objectValues = new Array();
    spanTag.children().each(function () {

        var value = "";
        if (replaceId.length > 0)
            value = $(this).attr(valueType).replace(replaceId, "");
        else
            value = $(this).attr(valueType);

        objectValues.push(value);
    });
    return objectValues;
};

//push notification
function ShowNotification() {
    var CurrentAdsId = parseInt(AdsId);
    var CurrentUserId = parseInt(UserId);
    if (AdsId > 0 && UserId > 0)
        document.getElementById('pushframe').contentWindow.webpush(CurrentAdsId, CurrentUserName, CurrentUserId);
}


var zoomin = 1;
function Zooming(type) {
    if (type == 1) { zoomin = zoomin + .1 } else { zoomin = zoomin - .1 }
    $("#flowchart").css({
        "zoom": zoomin
    });
}

function stopchannel(stateId) {

    var text = "Stop";
    var Status = 1;
    if ($('#stop' + stateId).attr('class') == 'fa fa-stop-circle-o') {
        Status = 0; text = "Stop";
    }
    else {
        Status = 1; text = "Start";
    }


    if (confirm(text + ' this channel?')) {
        if ($('#stop' + stateId).attr('class') == 'fa fa-stop-circle-o') {
            $('#stop' + stateId).css("color", "#66BB6A");
            $('#' + stateId + ' ul li i').css({ 'background': "#ab4848", });
            $('#' + stateId).css({ 'border': "1px solid #ab4848", });

            $('#stop' + stateId).attr('title', "Start this channel");
            $('#stop' + stateId).removeClass('fa fa-stop-circle-o').addClass('fa fa-play-circle-o');
        }
        else {
            $('#stop' + stateId).css("color", "#c56767");
            $('#' + stateId + ' ul li i').css('background', stateId.indexOf('_alert_') > -1 ? "#57ADD6" : "#66BB6A");
            $('#' + stateId).css({ 'border': stateId.indexOf('_alert_') > -1 ? "1px solid #57ADD6" : "1px solid #66BB6A", });
            $('#stop' + stateId).attr('title', "Stop this channel");
            $('#stop' + stateId).removeClass('fa fa-play-circle-o').addClass('fa fa-stop-circle-o');
        }

        $.ajax({
            url: "/WorkFlow/Create/UpdateChannelStatus",
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({ 'WorkflowId': $.urlParam("WorkFlowId"), 'Channel': stateId, 'ChannelStatus': Status }),
            contentType: "application/json; charset=utf-8",
            success: function (json) {
                $.each(json, function (i) {
                    SetNodeConfigArray(json[i].Channel, json[i].SegmentId, json[i].ConfigName);
                });


            },
            error: ShowAjaxError
        });
    }


}

var Isbelong = true;
function GetDetails(Id, ItemId) {

    var OffSet = 0;
    var FetchNext = 100;

    $("#vw_" + Id).css("cursor", "default");
    $("#vw_" + Id).attr("onclick", "#");


    if (Id > 0) {
        $.ajax({
            url: "/WorkFlow/Groups/BindGropsDetails",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ 'groupids': Id, 'Isbelong': Isbelong, 'Offset': OffSet, 'FetchNext': FetchNext }),
            success: function (response) {
                // $("#dvcustompopupsegment").show();
                if (response.length > 2) {
                    var array = JSON.parse(response);
                    BindResponsesDetails(array, ItemId, Id);
                }

                else {

                    var SubTableContent = "";
                    SubTableContent = "<table align='center' id=td_" + ItemId + " border=0 width='100%' class='itemStyle' style='cursor: pointer;' title='Click to Close'>";
                    SubTableContent += "<tr><td align='center'><b>No Data</b></td></tr>";
                    SubTableContent += "</table>";

                    if (SubTableContent != "") {
                        $("#ui_DataBindGroup #itemId" + ItemId).after(SubTableContent);
                    }

                    var closebtns = document.getElementById("td_" + ItemId);
                    closebtns.addEventListener("click", function () {
                        $("#td_" + ItemId).hide();
                        $("#vw_" + Id).css("cursor", "pointer");
                        $("#vw_" + Id).attr("onclick", "GetDetails(" + Id + "," + ItemId + ")");
                    });
                }
            },

            error: ShowAjaxError
        });


    }
}


BindResponsesDetails = function (responses, ItemId, GroupId) {
    if (responses != null) {
        if (responses.length > 0) {

            RecordCount = responses.length;
            var MailCount = 0, SMSCount = 0, AppPushCount = 0, WePushCount = 0;
            var SMSOptOut = 0, SMSOptIn = 0;
            var MailOptOut = 0, MailOptIn = 0;
            var AppPushOptOut = 0, AppPushOptIn = 0;
            var WebPushOptOut = 0, WebPushOptIn = 0;

            for (var i = 0; i < responses.length; i++) {
                if (responses[i].ReportType == "Mail") {

                    MailOptOut = responses[i].OptOut;
                    MailOptIn = responses[i].OptIn;

                    MailCount = responses[i].Total;
                }
                if (responses[i].ReportType == "SMS") {

                    SMSOptOut = responses[i].OptOut;
                    SMSOptIn = responses[i].OptIn;

                    SMSCount = responses[i].Total;
                }
                if (responses[i].ReportType == "AppPush") {
                    AppPushOptOut = responses[i].OptOut;
                    AppPushOptIn = responses[i].OptIn;

                    AppPushCount = responses[i].TotalVisitor;
                }
                if (responses[i].ReportType == "WebPush") {

                    WebPushOptOut = responses[i].OptOut;
                    WebPushOptIn = responses[i].OptIn;

                    WePushCount = responses[i].TotalVisitor;
                }
            }

            var SubTableContent = "", SMSContent = "", MailContent = "", WebPushContent = "", AppPushContent = "";
            if (SMSCount == 0)
                SMSContent = "<tr><td width='50%'><b>Total SMS </td><td width='50%'>:  " + SMSCount + "   [OptOut-" + SMSOptOut + "]</td></tr>";
            else
                SMSContent = "<tr><td width='50%'><b>Total SMS </td><td width='30%'>: <a href='../Sms/Contacts?GroupId=" + GroupId + "' target='_blank'> " + SMSCount + "   [OptOut-" + SMSOptOut + "]</a><td id=close_" + ItemId + " style='cursor: pointer;' title='Click to Close'>X</td></tr>";
            if (MailCount == 0)
                MailContent = "<tr><td><b>Total Mail</b></td><td>:  " + MailCount + "  [Optout-" + MailOptOut + "]</td></tr>";
            else
                MailContent = "<tr><td><b>Total Mail</b></td><td>: <a href='../Mail/Contacts?GroupId=" + GroupId + "' target='_blank'> " + MailCount + "  [Optout-" + MailOptOut + "]</a></td></tr>";

            if (AppPushCount == 0)
                AppPushContent = "<tr><td><b>Total App Push</b></td><td>:  " + AppPushCount + "   [Optout-" + AppPushOptOut + "]</td></tr>";
            else
                AppPushContent = "<tr><td><b>Total App Push</b></td><td>:<a href='../Mobile/MobileEngagement/Visitors?GroupId=" + GroupId + "' target='_blank'>  " + AppPushCount + "   [Optout-" + AppPushOptOut + "]</a></td></tr>";
            if (WePushCount == 0)
                WebPushContent = "<tr><td><b>Total WebPush </b></td><td>:  " + WePushCount + "  [Optout-" + WebPushOptOut + "]</td></tr>";
            else
                WebPushContent = "<tr><td><b>Total WebPush </b></td><td>:<a href='../Push/Browser/Visitors?GroupId=" + GroupId + "' target='_blank'>  " + WePushCount + "  [Optout-" + WebPushOptOut + "]</a></td></tr>";

            SubTableContent = "<table align='center' id=td_" + ItemId + " border=0 width='100%' class='itemStyle'  >";//title='Click to Close'
            SubTableContent += " " + SMSContent + "";
            SubTableContent += "" + MailContent + "";
            SubTableContent += "" + AppPushContent + "";
            SubTableContent += "" + WebPushContent + "";
            SubTableContent += "</table>";

            if (SubTableContent != "") {
                $("#ui_DataBindGroup #itemId" + ItemId).after(SubTableContent);
            }
            else {
                //this is not the first click, so just toggle the appearance of the element that has already been added to the DOM
                //since we injected the element just after the `#spin` element we can select it relatively to that element by using `.next()`
                $("#ui_DataBindGroup #itemId" + ItemId).next().toggle();
            }

            var closebtns = document.getElementById("close_" + ItemId);
            closebtns.addEventListener("click", function () {

                $("#td_" + ItemId).hide();
                // $("#vw_" + vwId).css("cursor", "pointer");
                $("#vw_" + vwId).attr("onclick", "GetDetails(" + vwId + "," + ItemId + ")");
            });
        }
    }

};