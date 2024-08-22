var WorkflowId = 0;
var WorkFlow = { Id: 0, Name: null, CampaignId: 0, IsActive: null, OneceInaDay: null, Interval: 0, FlowContent: null }
var ArrayConfig = [], ArrayChannelResponses = [];
var channel = {};
var defaultchannels = ["state_mail_", "state_sms_", "state_webpush_", "state_apppush_", "state_webhook_", "state_whatsapp_"];
var builder = null, countresult = "";
var EmailId = null, PhoneNumber = null, MachineId = null, DeviceId = null;
var IsLoading = { IsReportByNodeType: false, IsNodeConfigurationId: false, Isdefaultworkflowdefaultload: false };
var clearTimeInterval = null;
var flowchartChild = null;
var IsClickLinkShown = false;
$("#wrkflowreportprint").click(function () {
    $("#wrkflowprintview")
        .addClass("col-lg-12")
        .removeClass("col-lg-10 col-xl-10");
    window.print();
});

$(document).ready(function () {
    WorkflowId = $.urlParam("WorkFlowId");
    let SelectedFromDate = $.urlParam("frmdate").toString().replace(/%20/g, " ");
    let SelectedToDate = $.urlParam("todate").toString().replace(/%20/g, " ");

    if (WorkflowId > 0 && SelectedFromDate != "0" && SelectedFromDate.length > 0 && SelectedToDate != "0" && SelectedToDate.length > 0) {
        $('#selectdateDropdown').text('Custom Date Range');
        $('.dateBoxWrap').addClass('showFlx');

        let fromyear = SelectedFromDate.split('-')[0];
        let frommonth = SelectedFromDate.split('-')[1];
        let fromday = SelectedFromDate.split('-')[2].substring(0, 2);

        let toyear = SelectedToDate.split('-')[0];
        let tomonth = SelectedToDate.split('-')[1];
        let today = SelectedToDate.split('-')[2].substring(0, 2);

        $('#ui_txtStartDate').val(frommonth + "/" + fromday + "/" + fromyear);
        $('#ui_txtEndDate').val(tomonth + "/" + today + "/" + toyear);

        $('#ui_txtStartDate').prop("disabled", true);
        $('#ui_txtEndDate').prop("disabled", true);
        workflowUtil.GetNodeConfigurationId();
        GetUTCDateTimeRange(5);
    }
    else if (WorkflowId > 0) {
        workflowUtil.GetNodeConfigurationId();
        GetUTCDateTimeRange(2);
    }

    setTimeInteralForLoading();
});

function CallBackFunction() {

    ArrayChannelResponses = [];
    for (var n = 0; n < ArrayConfig.length; n++) {
        var node = containsAny(ArrayConfig[n].Channel, defaultchannels);
        if (node) {
            $("#count" + ArrayConfig[n].Channel).html(workflowUtil.GetReportByNodeType(node.replace("state_", "").replace("_", ""), ArrayConfig[n].Channel, 0, 0));
        }
    }
}


function IsStillLoading() {
    if (IsLoading.IsReportByNodeType && IsLoading.IsNodeConfigurationId && IsLoading.Isdefaultworkflowdefaultload && document.getElementById("flowchart").hasChildNodes()) {
        clearInterval(clearTimeInterval);
        HidePageLoading();
    }
}

var workflowUtil = {
    GetAnchorList: function (NodeType, state) {

        var NodesAndItsAnchors = {
            "sms": ["Send", "Deliver", "Click", "Not Click", "Bounce"], //connection node
            "smsreport": ["sent", "Delivered", "Clicked", "Not Clicked", "Bounce", "Error"], //report count

            "mail": ["Deliver", "Open", "Not Open", "Click", "Not Click", "Bounce"],
            "mailreport": ["sent", "Delivered", "opened", "clicked", "Not Clicked", "Not opened", "bounced", "Error", "OptOut"],

            "webpush": ["Push", "View", "Click", "Not Click", "Dismiss", "Bounce"],
            "webpushreport": ["sent", "view", "click", "close", "Not Clicked", "Bounce", "notsent"],

            "apppush": ["Push", "View", "Click", "Not Click", "Dismiss", "Bounce"],
            "apppushreport": ["sent", "view", "click", "close", "Not Clicked", "Bounce", "notsent"],

            "webhook": ["Sucess", "Failure"],
            "webhookreport": ["sucess", "failure"],

            "whatsapp": ["Delivered", "Read", "Not Read", "Clicked", "Not Clicked", "Failed"],
            "whatsappreport": ["Delivered", "Read", "Not Read", "Clicked", "Not Clicked", "Failed"],

            "rule": ["Satisfy", "Not Satisfy"],
            "dateandtime": ["Satisfy"],
            "segment": ["Satisfy"]
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
            "whatsapp": "actions_icons",
        }
        return NodesAndItsClass[NodeType]
    },
    GetIconNameByNodeType: function (NodeType) {

        var NodesAndItsClass = {
            "sms": "fa fa-commenting",
            "mail": "fa fa-envelope",
            "webpush": "fa fa-bell-o",
            "apppush": "fa fa-bell",
            "rule": "fa fa-check-square-o",
            "dateandtime": "fa fa-calendar",
            "segment": "fa fa-users",
            "webhook": "icon-webhook",
            "whatsapp": "icon ion-social-whatsapp-outline",
        }
        return NodesAndItsClass[NodeType]
    },
    GetReportKeyList: function (NodeType) {

        var ReportKey = {
            "sms": ["SentCount", "DeliverCount", "ClickCount", "NotClickCount", "BouncedCount", "NotSentCount"],
            "mail": ["SentCount", "DeliveredCount", "ViewCount", "ResponseCount", "NotResponseCount", "NotViewCount", "BounceCount", "NotSentCount", "OptOutCount"],
            "webpush": ["SentCount", "ViewCount", "ClickCount", "CloseCount", "NotClickCount", "BounceCount", "NotSentCount"],
            "apppush": ["SentCount", "ViewCount", "ClickCount", "CloseCount", "NotClickCount", "BounceCount", "NotSentCount"],
            "webhook": ["TotalContactPost", "TotalContactNotPost"],
            "whatsapp": ["DeliverCount", "ReadCount", "NotReadCount", "ClickCount", "NotClickCount", "FailedCount"]
        }
        return ReportKey[NodeType]
    },

    GetNodeConfigurationId: function () {
        $.ajax({
            url: "/Journey/CreateWorkflow/GetWrokflowNodes",
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkflowId': WorkflowId }),
            contentType: "application/json; charset=utf-8",
            success: function (json) {
                IsLoading.IsNodeConfigurationId = true;
                $.each(json, function (i) {
                    workflowUtil.SetNodeConfigArray(json[i].Channel, json[i].SegmentId, json[i].ConfigName, json[i].ChannelStatus);
                });

                workflowUtil.calldefaultworkflowdefaultload();
            },
            error: ShowAjaxError
        });
    },
    calldefaultworkflowdefaultload: function () {
        $.ajax({
            url: "/Journey/CreateWorkflow/GetWorkflowByWorkflowId",
            type: 'POST',
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkflowId': WorkflowId }),
            success: function (response) {
                IsLoading.Isdefaultworkflowdefaultload = true;
                $('#ui_spnWorkFlowName').html(response.Title);
                LoadDefaultWorkFlow();
            },
            error: ShowAjaxError
        });
    },
    SetNodeConfigArray: function (nodeid, value, title, Status) {
        channel = {
            "Channel": nodeid.toString(),
            "Value": value,
            "Title": title,
            "ChannelStatus": Status
        }

        var found = ArrayConfig.filter(function (item) { return item.Channel === nodeid.toString(); });
        if (found.length == 0) {
            ArrayConfig.push(channel);
        }
    },
    GetReportByNodeType: function (NodeType, state, getwinnercampid, step) {
        ShowPageLoading();
        var MailType = NodeType + "report";//NodeType == 'mail' ? 'mailreport' : NodeType;
        var nodes = workflowUtil.GetAnchorList(MailType);
        var width = {
            "1": [265, 99, 0],
            "2": [265, 48, 0],
            "3": [265, 32, 0],
            "4": [265, 23, 0],
            "5": [265, 23, 99],
            "6": [265, 23, 45],
            "7": [265, 23, 30],
            "8": [265, 23, 23],
            "9": [265, 23, 23]
        };
        var getwidth = width[nodes.length.toString()];
        var Nodesreport = "", SubNodesreport = "", winnercampid = 0;
        var count = 0;
        var configid = workflowUtil.getchannelvalue(ArrayConfig, state);
        $.ajax({
            url: "/Journey/Responses/GetWorkFlowAllResponces",
            type: 'POST',
            async: false,
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ConfigureId': configid, 'ChannelName': NodeType, 'FromDate': FromDateTime, 'ToDate': ToDateTime, 'IsSplitTested': step, 'EmailId': EmailId, 'PhoneNumber': PhoneNumber, 'MachineId': MachineId, 'DeviceId': DeviceId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                IsLoading.IsReportByNodeType = true;
                var notopen = 0, notclick = 0;
                for (var k = 0; k < nodes.length; k++) {

                    if (k == 0) {
                        var countdiv = state;
                        var dvextra = "", style = "padding-top: 25px;", extrastyle = "top: 80px;", closestyle = "position: absolute;";

                        if (getwidth[2] != 0) {
                            dvextra = "<div onclick=workflowUtil.hidecontent('" + countdiv + "'); style='" + closestyle + "cursor: pointer;font-weight: bold;font-size: 26px;bottom: 1px;color: #bfbaba;z-index: 30;left: 115px;' id='spnhide" + countdiv + "'>▾</div>";
                        }

                        $("#" + state).css({ height: 85, width: getwidth[0], "line-height": "20px" });
                        Nodesreport = "<div id='" + countdiv + "' style='" + style + ";width:" + getwidth[0] + "px'>";
                        SubNodesreport = "<div id='divExtraResult" + countdiv + "' class='rcontainer1' style='" + extrastyle + "z-index: 30;display:none;width:" + getwidth[0] + "px;'>";
                    }
                    count = 0;
                    var column = workflowUtil.GetReportKeyList(NodeType)[k];

                    if (response != null && response != undefined) {
                        count = response[column] != undefined ? response[column] : 0;
                    }

                    if (response != null && response["TemplateName"] != undefined) {
                        var title = response["TemplateName"];
                        title = title.charAt(0).toUpperCase() + title.slice(1);
                        $("#title" + state).text(title.length > 25 ? title.substring(0, 25) + ".." : title);
                    }

                    let openpopupreport = (IsClickLinkShown == false ? "openpopupreport" : "openpopupreportNotToShow");
                    //count = count == 0 && nodes[k].toLowerCase().indexOf('not') > -1 ? response["DeliverCount"] - response[column] : 0;
                    var id = configid + nodes[k].replace(/ /g, '') + step;
                    var ahref = "<a data-channel='" + NodeType + "' data-detail='" + nodes[k] + "' data-id='" + configid + "' class='" + openpopupreport + "' id='" + id + "' href='javascript:void(0)' title='" + nodes[k] + "' style='font-size:12px;color:#000;cursor: pointer;'>" + count + "</a>";


                    if (nodes.length > 4 && (column.toString().toLowerCase().indexOf('error') > -1 || column.toString().toLowerCase().indexOf('not') > -1 || ((column.toString().toLowerCase().indexOf('optout') > -1 || column.toString().toLowerCase().indexOf('bounce') > -1) && (NodeType == 'webpush' || NodeType == 'apppush' || NodeType == 'mail')))) {
                        SubNodesreport += "<div class='rsquare' style='width:" + getwidth[2] + "%;text-transform: capitalize;'>" + nodes[k].replace(" ", "&nbsp;") + "<br />" + ahref + "</div>";
                    }
                    else {
                        Nodesreport += "<div class='rsquare' style='width:" + getwidth[1] + "%;text-transform: capitalize;'>" + nodes[k].replace(" ", "&nbsp;") + "<br />" + ahref + "</div>";
                    }
                }

                var Responses = {
                    "channelid": state,
                    "configid": configid,
                    "notopen": notopen,
                    "notclick": notclick
                }
                ArrayChannelResponses.push(Responses);
                countresult = Nodesreport + "</div>" + SubNodesreport + "</div>" + dvextra;

                HidePageLoading();
            }
        });


        return countresult;
    },
    getchannelvalue: function (allchannel, channel) {
        var gettype = channel.split('_')[1].toString();
        var configid = ArrayConfig.filter(x => x.Channel === channel.toString()).map(x => x.Value)[0];

        var r = ArrayConfig.filter(x => x.Channel === channel.toString()).map(x => x.Value);
        if (channel.indexOf("dateandtime") > -1) { return (r != "" ? r : "0").toString(); }
        else { return parseInt(r != "" ? r : 0); }
    },
    hidecontent: function (contentid) {
        var getextra = contentid;
        var mcontentid = contentid.replace("_F", "").replace("_S", "").replace("_I", "");
        if ($("#divExtraResult" + contentid).css('display') == 'none') {
            $("#divExtraResult" + contentid).css("display", "block");
            $("#spnhide" + contentid).html("▴");
            $("#" + mcontentid).css({ height: contentid.match(/(_F|_S)/) ? 250 : 160, "z-index": 30 });

        }
        else { $("#spnhide" + contentid).html("▾"); $("#divExtraResult" + contentid).css("display", "none"); $("#" + mcontentid).css({ height: contentid.match(/(_F|_S)/) ? 265 : 85 }); }
    },
    getWorkflowDetails: function () {
        Type = $.urlParam("Type");
        NodeCount = $.urlParam("NodeCount");

        $.ajax({
            url: "/Journey/CreateWorkflow/GetWorkFlowById",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkflowId': WorkflowId }),
            success: function (json) {
                WorkFlow.FlowContent = json.Flowchart;
                builder.initializeData(WorkFlow.FlowContent);
            }
        });
    }
};


//partial view Pop-up open and close

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
});

$(document).on('click', '.openpopupreport', function () {
    $(".popupcontainer").addClass("hideDiv");

    var WfId = WorkflowId;
    var channel = $(this).attr("data-channel");
    var action = $(this).attr("data-detail");
    var id = $(this).attr("data-id");

    if (channel == 'mail') {
        action = action.replace("opened", "open").replace("Error", "notsent");
        getMailCampaignContacts(action.toLowerCase(), id, WfId);
    }
    else if (channel == 'sms') {

        action = action.toLowerCase().replace("opened", "open").replace("Error", "notsent");
        if (action == "sent" || action == "delivered" || action == "pending" || action == "optout" || action == "not clicked") {
            $(".popupItem").addClass("popup-tbl").removeClass('w-650').addClass("w-450");
            $(".popuptitle h6").html(`${action} Details`);
            $("#Error").addClass('hideDiv');
            $("#SmsTotalClick").addClass('hideDiv');
            $("#Sent").removeClass('hideDiv');
        } else if (action == "error" || action == "bounce") {
            $(".popupItem").addClass("popup-tbl").removeClass('w-450').addClass("w-650");
            $(".popupcontainer").removeClass('hideDiv');
            $(".popuptitle h6").html(`${action} Details`);
            $("#Sent").addClass('hideDiv');
            $("#SmsTotalClick").addClass('hideDiv');
            $("#Error").removeClass('hideDiv');
        } else if (action == "clicked") {
            $(".popupItem").addClass("popup-tbl").removeClass('w-450').addClass("w-650");
            $(".popupcontainer").removeClass('hideDiv');
            $(".popuptitle h6").html(`${action} Details`);
            $("#Sent").addClass('hideDiv');
            $("#Error").addClass('hideDiv');
            $("#SmsTotalClick").removeClass('hideDiv');
        }

        $(".popupcontainer").removeClass('hideDiv');
        $(".popupbodycont").removeClass("pad-10");
        $("#ui_Paggingdiv").show();
        $("#ui_Groupsdiv").addClass("hideDiv");
        $("#dvcampaignContacts").addClass('hideDiv');
        $("#dvcampaignUsers").addClass('hideDiv');
        $("#dvcustompopupsegment").addClass('hideDiv');
        $("#dvappcampaignUsers").addClass('hideDiv');
        $("#remvgrupcont").addClass("hideDiv");
        $("#dvwebhookUsers").addClass('hideDiv');
        $("#SmsEffectivenessURL").addClass("hideDiv");
        $("#SmsUniqueClick").addClass("hideDiv");
        $("#dvwacampaignContacts").addClass('hideDiv');

        var getAct = action == "sent" ? 0 : action == "delivered" ? 1 : action == "clicked" ? 2 : action == "bounce" ? 3 : action == "not clicked" ? 7 : action == "error" ? 5 : 0;
        smsPopReportUtil.InitialCampaignFilterValues(id, getAct, WfId);
    }
    else if (channel == 'webpush') { getCampaignUsers(action, id, WfId); }
    else if (channel == 'apppush') { getAppCampaignUsers(action, id, WfId); }
    else if (channel == 'webhook') { getWebHookUsers(action, id, WfId); }
    else if (channel == 'whatsapp') {
        action = action.toLowerCase().replace("opened", "open").replace("Error", "notsent");
        if (action == "sent" || action == "delivered" || action == "clicked" || action == "optout" || action == "not clicked" || action == "read" || action == "not read") {
            $(".popupItem").addClass("popup-tbl").removeClass('w-650').addClass("w-450");
            $(".popuptitle h6").html(`${action} Details`);
            $("#WAError").addClass('hideDiv');
            $("#WASent").removeClass('hideDiv');
        } else if (action == "error" || action == "failed") {
            $(".popupItem").addClass("popup-tbl").removeClass('w-450').addClass("w-650");
            $(".popupcontainer").removeClass('hideDiv');
            $(".popuptitle h6").html(`${action} Details`);
            $("#WASent").addClass('hideDiv');
            $("#WAError").removeClass('hideDiv');
        }

        $("#dvwacampaignContacts").removeClass('hideDiv');
        $(".popupbodycont").removeClass("pad-10");
        $("#ui_Paggingdiv").show();
        $("#ui_Groupsdiv").addClass("hideDiv");
        $("#dvcampaignContacts").addClass('hideDiv');
        $("#dvcampaignUsers").addClass('hideDiv');
        $("#dvcustompopupsegment").addClass('hideDiv');
        $("#dvappcampaignUsers").addClass('hideDiv');
        $("#remvgrupcont").addClass("hideDiv");
        $("#dvwebhookUsers").addClass('hideDiv');
        $("#WhatsAppEffectivenessURL").addClass("hideDiv");
        $("#WhatsAppUniqueClick").addClass("hideDiv");
        $("#dvsmscampaignContacts").addClass('hideDiv');

        switch (action) {
            case "delivered":
                action = 1;
                break;
            case "read":
                action = 2;
                break;
            case "failed":
                action = 3;
                break;
            case "clicked":
                action = 5;
                break;
            case "not clicked":
                action = 6;
                break;
            case "not read":
                action = 7;
                break;
        }

        WhatsAppPopReportUtil.InitialCampaignFilterValues(id, action, WfId);
    }
});

var searchBy = "All";
$(".startwith a.dropdown-item").click(function () {
    IsLoading.IsReportByNodeType = false; IsLoading.IsNodeConfigurationId = false; IsLoading.Isdefaultworkflowdefaultload = false;
    $("#searchFilterBox").val("");
    let flwstartwithval = $(this).text();
    searchBy = flwstartwithval;
    $(".addstartfiltr span").html("Search By " + flwstartwithval);
    $(".addstartfiltr").addClass("active");
    $("#searchFilterBox").attr("placeholder", flwstartwithval);
    if (flwstartwithval != "All") {
        IsClickLinkShown = true;
        $(".subdivFiltWrap").removeClass("hideDiv").addClass("showDiv");
    } else {
        IsClickLinkShown = false;
        ShowPageLoading();
        EmailId = null; PhoneNumber = null; MachineId = null; DeviceId = null;
        $(".subdivFiltWrap").removeClass("showDiv").addClass("hideDiv");
        $("#flowchart").empty();
        setTimeInteralForLoading();
        setTimeout(function () { workflowUtil.GetNodeConfigurationId(); GetUTCDateTimeRange(duration); }, 1000);
    }
});

$("#ui_btnSearch").click(function () {
    if (CleanText($.trim($("#searchFilterBox").val())).length == 0) {
        ShowErrorMessage(GlobalErrorList.WorkFlowReport.SearchByError.replace("{*0*}", searchBy));
        return false;
    }

    if (searchBy.toLowerCase() == "emailid") {
        if (!regExpEmail.test(CleanText($.trim($("#searchFilterBox").val())))) {
            ShowErrorMessage(GlobalErrorList.WorkFlowReport.CorrectEmailId);
            return false;
        }
    }

    switch (searchBy.toLowerCase()) {
        case "emailid":
            EmailId = CleanText($.trim($("#searchFilterBox").val()));
            PhoneNumber = null; MachineId = null; DeviceId = null;
            break;
        case "phone number":
            PhoneNumber = CleanText($.trim($("#searchFilterBox").val()));
            EmailId = null; MachineId = null; DeviceId = null;
            break;
        case "machineid":
            MachineId = CleanText($.trim($("#searchFilterBox").val()));
            EmailId = null; PhoneNumber = null; DeviceId = null;
            break;
        case "deviceid":
            DeviceId = CleanText($.trim($("#searchFilterBox").val()));
            EmailId = null; PhoneNumber = null; MachineId = null;
            break;
        default:
            EmailId = null; PhoneNumber = null; MachineId = null; DeviceId = null;
            break;
    }

    ShowPageLoading();
    $.ajax({
        url: "/Journey/Responses/GetContactDetails",
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'EmailId': EmailId, 'PhoneNumber': PhoneNumber, 'MachineId': MachineId, 'DeviceId': DeviceId }),
        contentType: "application/json; charset=utf-8",
        success: function (contactDetails) {
            if (contactDetails != null) {
                AssignFilterValue(contactDetails);
            } else {
                AssignFilterValue(null);
            }
            $("#flowchart").empty();
            workflowUtil.GetNodeConfigurationId();
            GetUTCDateTimeRange(duration);
            setTimeInteralForLoading();
        },
        error: ShowAjaxError
    });
});

function AssignFilterValue(contactDetails) {
    if (contactDetails != null) {
        switch (searchBy.toLowerCase()) {
            case "emailid":
                EmailId = CleanText($.trim($("#searchFilterBox").val()));
                PhoneNumber = CleanText($.trim(contactDetails.PhoneNumber)).length > 0 ? contactDetails.PhoneNumber : "0";
                MachineId = CleanText($.trim(contactDetails.MachineId)).length > 0 ? contactDetails.MachineId : "0";
                DeviceId = CleanText($.trim(contactDetails.DeviceId)).length > 0 ? contactDetails.DeviceId : "0";
                break;
            case "phone number":
                PhoneNumber = CleanText($.trim($("#searchFilterBox").val()));
                EmailId = CleanText($.trim(contactDetails.EmailId)).length > 0 ? contactDetails.EmailId : "0";
                MachineId = CleanText($.trim(contactDetails.MachineId)).length > 0 ? contactDetails.MachineId : "0";
                DeviceId = CleanText($.trim(contactDetails.DeviceId)).length > 0 ? contactDetails.DeviceId : "0";
                break;
            case "machineid":
                MachineId = CleanText($.trim($("#searchFilterBox").val()));
                EmailId = CleanText($.trim(contactDetails.EmailId)).length > 0 ? contactDetails.EmailId : "0";
                PhoneNumber = CleanText($.trim(contactDetails.PhoneNumber)).length > 0 ? contactDetails.PhoneNumber : "0";
                DeviceId = CleanText($.trim(contactDetails.DeviceId)).length > 0 ? contactDetails.DeviceId : "0";
                break;
            case "deviceid":
                DeviceId = CleanText($.trim($("#searchFilterBox").val()));
                EmailId = CleanText($.trim(contactDetails.EmailId)).length > 0 ? contactDetails.EmailId : "0";
                PhoneNumber = CleanText($.trim(contactDetails.PhoneNumber)).length > 0 ? contactDetails.PhoneNumber : "0";
                MachineId = CleanText($.trim(contactDetails.MachineId)).length > 0 ? contactDetails.MachineId : "0";
                break;
            default:
                EmailId = null; PhoneNumber = null; MachineId = null; DeviceId = null;
                break;
        }
    } else {
        switch (searchBy.toLowerCase()) {
            case "emailid":
                EmailId = CleanText($.trim($("#searchFilterBox").val()));
                PhoneNumber = "0"; MachineId = "0"; DeviceId = "0";
                break;
            case "phone number":
                PhoneNumber = CleanText($.trim($("#searchFilterBox").val()));
                EmailId = "0"; MachineId = "0"; DeviceId = "0";
                break;
            case "machineid":
                MachineId = CleanText($.trim($("#searchFilterBox").val()));
                EmailId = "0"; PhoneNumber = "0"; DeviceId = "0";
                break;
            case "deviceid":
                DeviceId = CleanText($.trim($("#searchFilterBox").val()));
                EmailId = "0"; PhoneNumber = "0"; MachineId = "0";
                break;
            default:
                EmailId = null; PhoneNumber = null; MachineId = null; DeviceId = null;
                break;
        }
    }
}

function setTimeInteralForLoading() {
    clearTimeInterval = setInterval(IsStillLoading, 1000);
}