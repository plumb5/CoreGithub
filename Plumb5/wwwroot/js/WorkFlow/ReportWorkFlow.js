var WorkflowId = 0;
var WorkFlowBasicDetails = { Name: "" };

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
var timeouts = [];
var ArrayConfig = [], ArrayChannelResponses = [];
var channel = {};
var ConfigValue = 0;
var MailSendingSetting = { MessageType: 0, MailTemplateId: 0, Subject: null, FromName: null, FromEmailId: null, ReplyToEmailId: null, Unsubscribe: false, Forward: false }

var defaultchannels = ["state_mail_", "state_sms_", "state_form_", "state_chat_", "state_webpush_", "state_inappbanner_", "state_apppush_", "state_fbpush_", "state_ussd_", "state_obd_", "state_broadcast_"];
var chkchannel = 0;
var allchannel = [];
var allprechannel = [];
var Segment = "0", Rule = "0", Goal = "0", DateTime = "0", Alert = "0";
var PreNode = "0", Condition = "0"; DateCondition = 0; DateValue = "0";
$('#iframe_report').height($(window).height() - 75);
var builder = null, countresult = "", precountchannel = "", precountstate = "", winnercount = 0;
var grouptitle = "";

function GetWfLocalTimeFromGMT(sTime) {
    if (sTime.length > 0) {
        var dbDate = sTime.split(' ');
        var year = dbDate[0].split('-');
        sTime = new Date(year[0], year[1] - 1, year[2]);
        sTime.setTime(sTime.getTime() - sTime.getTimezoneOffset() * 60 * 1000);
        return sTime.toGMTString().substring(4, 17);
    }
}


function CallBackFunction() {
    stopTimer();
    ArrayChannelResponses = [];
    for (var n = 0; n < ArrayConfig.length; n++) {
        var node = containsAny(ArrayConfig[n].Channel, defaultchannels);
        if (node) {
            $("#count" + ArrayConfig[n].Channel).html(workflowUtil.GetReportByNodeType(node.replace("state_", "").replace("_", ""), ArrayConfig[n].Channel, 0, 0));
        }
    }
    AdvancedSearch();
}


$(document).ready(function () {
    workflowUtil.GetNodeConfigurationId();
    OverAllCount();
});

var zoomin = 1;
function Zooming(type) {
    if (type == 1) { zoomin = zoomin + .1 } else { zoomin = zoomin - .1 }
    $("#flowchart").css({
        "zoom": zoomin
    });
}

function LoadDefaultWorkFlow() {


    $('#btnSave').on('click', function () { workflowUtil.SaveFlowchart(); });



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
                ["Arrow", { width: 12, length: 16, location: 0.9 }],
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
            //strokeStyle: me.connectorSettings.colourHover,
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
            isTarget: false,
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

    }

    jspInstance.prototype.updateState = function (stateInfo) {

        var me = this;

        var nodeType = stateInfo.typeId;
        var getclass = workflowUtil.GetIconNameByNodeType(nodeType);//$('#' + nodeType).attr('class').replace("ui-draggable", "").replace(" dragnode", "");
        var stateId = stateInfo.id;

        var border = "1px solid #66BB6A";
        if (nodeType.match(/(segment|goal|alert|rule|dateandtime|end)/)) { border = "1px solid #57ADD6"; }

        var $stateElement = $('<div/>', { id: stateId, title: stateInfo.title }).addClass(me.stateConfiguration.className).css({ left: stateInfo.location[0] + 'px', top: stateInfo.location[1] + 'px', border: border }).attr("nodetype", nodeType);
        $stateElement.append($("<img id='imgabrule" + stateId + "' src='../../images/abtest.png' title='Rule of A/B testing' class='note' style='cursor: default;display:none;left: 170px;top: 13px;'><span id='winner" + stateId + "' title='Get test & continue result of A/B testing' class='fa-stack' style='z-index: 60;display:none;cursor: pointer;position: absolute;left: 173px;color:#ff9800;top: -2px;'><i class='fa fa-trophy' style='color: rgb(255, 152, 0);'></i> <i class='fa fa-arrow-right fa-sm fa-stack-1x' style='cursor: pointer; color: green;padding-left: 9px;font-size: 10px;top: 3px;'></i></span><i title='Winner of A/B testing' id='winner1" + stateId + "' class='fa fa-trophy' aria-hidden='true' style='display:none;position: absolute;left: 183px;color:#ff9800;    z-index: 60;cursor: default;'></i>"));
        var classNameForTag = workflowUtil.GetClassNameByNodeType(nodeType);

        $stateElement.append($("<ul id='ul_" + stateId + "' class='" + classNameForTag + "' style='height: 0px;width: 0px;position: absolute;left: 7px;color:#fff;'><li id='li_" + stateId + "' style='height: auto;' ><i id='i_" + stateId + "'style='cursor: default;' class='" + getclass + "' aria-hidden='true' title='" + stateInfo.title + "'></i></li></ul>"));

        //$stateElement.append($("<ul class='" + classNameForTag + "' style='height: 0px;width: 0px;position: absolute;left: -25px;color:#fff;'><li style='height: 50px;'><i style='cursor: default;' class='" + getclass + "' aria-hidden='true' title='Event'></i></li></ul>"));
        $stateElement.append($("<a id='title" + stateId + "' style='left: 10%;height:0px;;font-size: 12px;width: 90%;position: absolute;color: #000;top: 12px;padding-top: 2px;'></a>"));

        //$stateElement.append($('<span style="color: #666666;"/>').text(stateInfo.title));
        $stateElement.appendTo($('.' + me.containerId));

        //Make it draggable:
        me.instance.draggable($stateElement, { grid: me.connectorSettings.grid });

        //add :
        me.addStateEndpoints(stateId, stateInfo.sn);

        var status = ArrayConfig.filter(x => x.Channel === stateId.toString()).map(x => x.ChannelStatus);
        if ((status != undefined) && status[0] == false) {
            $('#' + stateId + ' ul li i').css({ 'background': "#ab4848", });
            $('#' + stateId).css({ 'border': "1px solid #ab4848", });
        }
        var title = ArrayConfig.filter(x => x.Channel === stateId.toString()).map(x => x.Title);
        if (nodeType.indexOf('end') > -1) { title = "End Workflow"; } else { if (title[0] != undefined || title[0] != null) { title = title[0].toString(); } else { title = ""; } }


        dataconnections.map(x => x.SourceId).toString().indexOf("state_alert_") > -1
        var dataImport = 0;
        var belong = 1;
        if (title.indexOf("~") > -1) {

            $stateElement.append("<div id='groupcount" + stateId + "'></div>");

            belong = title.indexOf('not') == -1 ? 1 : 0;
            var value = ArrayConfig.filter(x => x.Channel === stateId.toString()).map(x => x.Value)[0];
            getGroupCount(value, title, stateId);
        }
        else if (dataconnections.map(x => x.SourceId).toString().indexOf("state_alert_") > -1) { $("#title" + stateId).text("Import Response"); dataImport = 1; }
        else { if (title.indexOf("^1") > -1) { $('#imgabrule' + stateId).css("display", "block"); } title = title.replace("^0", "").replace("^1", ""); title = title.charAt(0).toUpperCase() + title.slice(1); $("#title" + stateId).text(title.length > 25 ? title.substring(0, 25) + ".." : title); }

        $("#" + stateId).attr('title', title);

        if (containsAny("state_" + nodeType + "_", defaultchannels)) {
            $("#ul_" + stateId).css({ top: -14, left: 115 });
            $("#li_" + stateId).css({ width: 35 });
            $("#i_" + stateId).css({ "padding": "3px", "border-radius": "5px" });
            $stateElement.append("<div id='count" + stateId + "'>" + workflowUtil.GetReportByNodeType(nodeType, stateId, 0, 0) + "</div>");
        }
        else {
            var configid = ArrayConfig.filter(x => x.Channel === stateId.toString()).map(x => x.Value)[0];
            var redirect = {
                "segment": "../../WorkFlow/Groups?",
                "alert": "../../WorkFlow/AlertResponsesReport?WorkFlowId=" + $.urlParam("WorkFlowId") + "&ConfigId=" + configid + "&FromDate=" + FromDateTime + "&ToDate=" + ToDateTime + "&Import=" + dataImport
            };

            var getleft = $("#" + stateId).position().left;
            $("#" + stateId).css({ height: 30, width: 165, "line-height": "0px", left: $("#" + stateId).position().left + 23 });
            $("#ul_" + stateId).css({ top: -2, left: -25 });
            $("#i_" + stateId).css({ "padding": "14px" });
            var Value = ArrayConfig.filter(x => x.Channel === stateId.toString()).map(x => x.Value);
            if (nodeType == 'segment' && title.toLocaleLowerCase().indexOf('allusers') == -1) {
                $("#title" + stateId).css({ top: 20, "cursor": "pointer" }).attr('onclick', 'openreport("' + redirect[nodeType] + (title.toString().toLowerCase().indexOf('group') > -1 ? 'GroupIds=' : 'ContactIds=') + Value + '&belongs=' + belong + '")');
            }
            else if (redirect[nodeType] == undefined || title.toLocaleLowerCase().indexOf('allusers') > -1) {
                $("#title" + stateId).css({ top: 20, "text-decoration": "none" });
            }
            else {
                $("#title" + stateId).css({ top: 20, "cursor": "pointer" }).attr('onclick', 'openreport("' + redirect[nodeType] + '")');
            }


        }
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
                    strokeStyle: '#fff',
                    fillStyle: '#fff',
                    radius: 4,//me.endpointSettings.size-2,
                    lineWidth: 2

                },
                isSource: true,
                maxConnections: -1,
                connector: ["Straight"],
                connectorStyle: connectorPaintStyle,
                hoverPaintStyle: endpointHoverStyle,
                //connectorHoverStyle: connectorHoverStyle,
                dragOptions: {},
                overlays: [
                    ['Label', {
                        location: [0.5, 1.5],
                        label: sourceTxt[i],
                        id: 'myLabel',
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
        $.map(me.dataset.states, function (s) { me.addState(s); });
        //if (confirm('Delete connection from ' + conn.sourceId + ' to ' + conn.targetId + '?')) jsPlumb.detach(conn);

    };
    //==========================================================
    jspInstance.prototype.attachEventHandlers = function () {

        var me = this;
        result = me;

        // listen for clicks on connections, and offer to delete connections on click.
        me.instance.bind('click', function (conn, originalEvent) {

            ShowErrorMessage("Sorry, you can't delete connection(s)");

            //if (Id == null || Id == undefined || Id == "" || Id <= 0) {
            //    if (confirm('Remove this connection?')) {
            //        jsPlumb.detach(conn);
            //        dataconnections = $.grep(dataconnections, function (e) {
            //            return e.connectionId != conn.id;
            //        });

            //    }
            //}
            //else {
            //    ShowErrorMessage("Sorry, you can't delete connection(s)");
            //}

        });

        // listen for new connections; initialise them the same way we initialise the connections at startup.
        me.instance.bind('connection', function (connInfo, originalEvent) {

            me.createOverlaysOnConnector(connInfo.connection);
        });

        me.instance.bind('connectionDrag', function (connection) {

            console.log('connection ' + connection.id + ' is being dragged. suspendedElement is ', connection.suspendedElement, ' of type ', connection.suspendedElementType);
        });

        me.instance.bind('connectionDragStop', function (connection) {
            var text = connection.endpoints[0].getOverlay("myLabel").getLabel();
            //if (text == "Fwd") {
            //    text = "Forward";
            //}
            //else if (text == "Unsub") {
            //    text = "Unsubscribe";
            //}
            dataconnections.push({
                connectionId: connection.id,
                SourceId: connection.sourceId,
                TargetId: connection.targetId,
                anchor: connection.endpoints[0].anchor.type,
                RelationWithParent: text
            });


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


        connection.getOverlay('label').setLabel(text);

        connection.bind('editCompleted', function (o) {
            if (typeof console != 'undefined') {
                console.log('connection edited. path is now ', o.path);
            }
        });
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
        //initobj = jQuery.parseJSON('{"nodes":[{"blockId":"state_segment_523","positionX":414,"positionY":18,"label":"Audience"},{"blockId":"state_mail_467","positionX":435,"positionY":153,"label":"Send Mail"},{"blockId":"state_sms_158","positionX":281,"positionY":286,"label":"Date & Time"}],"connections":[{"connectionId":"con_31","SourceId":"state_segment_523","TargetId":"state_sms_467","anchor":"Bottom3","RelationWithParent":"Satisfy"},{"connectionId":"con_32","SourceId":"state_sms_467","TargetId":"state_sms_158","anchor":"Bottom2","RelationWithParent":"Bounce"}],"numberOfElements":3}');
        console.log(workflowcontent);

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
            });
            var con = [];
            dataconnections = initobj.connections;
            $.each(initobj.connections, function (index, elem) {
                con.push({
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
        builder = new jspInstance();

        builder.stateConfiguration.clickHandler = function (e) {

            workflowUtil.ShowConfigurationSettingByNode(e);
        }
        builder.stateConfiguration.dblClickHandler = function (e) { builder.removeState(e); }
        builder.initialize();


        $.ajax({
            url: "/WorkFlow/Create/GetWorkFlowById?WorkflowId=" + $.urlParam("WorkflowId"),
            type: 'post',
            dataType: 'json',
            success: function (json) {

                WorkFlow.FlowContent = json.Flowchart;
                builder.initializeData(WorkFlow.FlowContent);
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
        //var achorList = workflowUtil.GetAnchorList("mail");
        //builder.addData("mail", "fffff", 350, 140, achorList);


        //var constr = '{"connections":[{"connectionId":"con_39","SourceId":"state_segment_991","TargetId":"mail","anchor":"Bottom3","RelationWithParent":"Satisfy"}],"numberOfElements":4}';
        //var initobj = jQuery.parseJSON(constr);

        //var con = [];
        //$.each(initobj.connections, function (index, elem) {
        //    con.push({
        //        s: [elem.SourceId.replace("state_", ""), elem.anchor],
        //        t: [elem.TargetId.replace("state_", ""), 'TopCenter']
        //    });
        //});

        //var getstate = [];
        //getstate.push({
        //    id: "11",
        //    //nodetype: initobj.nodes[index].NodeType,
        //    typeId: "mail",
        //    title: "jkl",
        //    location: [350, 140],
        //    sn: achorList
        //});

        //builder.dataset =
        //            {
        //                template: 1,
        //                instance: 123,
        //                states: getstate,
        //                connections: con

        //            };
        //builder.instance.doWhileSuspended(
        //            function () {
        //                $.map(builder.dataset.connections, function (c) {
        //                    builder.addConnection(c);
        //                });
        //            });

    });

    //builder = new jspInstance();


    //builder.initialize();
    //var achorList = workflowUtil.GetAnchorList("mail");
    //builder.addData("mail", "fffff", 250, 40, achorList);

}
var workflowUtil = {
    GetAnchorList: function (NodeType, state) {

        var NodesAndItsAnchors = {
            "sms": ["Send", "Deliver", "Click", "Not Click", "Bounce", "Error"],
            "mail": ["Deliver", "Open", "Not Open", "Click", "Not Click", "Bounce"],
            "mailreport": ["Send", "Deliver", "Open", "Not Open", "Click", "Not Click", "Bounce", "Error"],
            "form": ["View", "Response", "Dismiss"],
            "chat": ["View", "Response", "Dismiss"],

            "webpush": ["Push", "View", "Click", "Not Click", "Dismiss", "Bounce", "Error"],
            "inappbanner": ["View", "Click", "Not Click", "Dismiss"],

            "apppush": ["Push", "View", "Click", "Not Click", "Dismiss", "Bounce", "Error"],
            "fbpush": ["Push", "Click", "Not Click", "Unsubscribe"],
            "ussd": ["Deliver", "Click", "Not Click"],
            "obd": ["Deliver", "Picked", "Reject"],
            "broadcast": ["Deliver"],

            "rule": ["Satisfy", "Not Satisfy"],
            "dateandtime": ["Satisfy"],
            "segment": ["Satisfy"],
            "alert": ["Satisfy"],
            "goal": ["Satisfy"],
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
    GetIconNameByNodeType: function (NodeType) {

        var NodesAndItsClass = {
            "sms": "fa fa-commenting",
            "mail": "fa fa-envelope",
            "form": "fa fa-wpforms",
            "chat": "fa fa-weixin",
            "webpush": "fa fa-bell-o",
            "inappbanner": "fa fa-mobile",

            "apppush": "fa fa-bell",
            "fbpush": "fa fa-facebook",
            "ussd": "fa fa-commenting",
            "obd": "fa fa-phone",
            "broadcast": "fa fa-bullhorn",

            "rule": "fa fa-check-square-o",
            "dateandtime": "fa fa-calendar",
            "segment": "fa fa-users",
            "alert": "fa fa-bell-o",
            "goal": "fa fa-dot-circle-o",
            "end": "fa fa-power-off"
        }
        return NodesAndItsClass[NodeType]
    },
    GetReportKeyList: function (NodeType) {

        var ReportKey = {
            "sms": ["SentCount", "DeliverCount", "ClickCount", "NotClickCount", "BouncedCount", "NotSentCount"],
            "smsredirect": ["../../WorkFlow/CampaignSmsReport?WorkFlowId=<wfid>&ConfigId=<cfid>&action=8&FromDate=<fdate>&ToDate=<tdate>"],
            "smsurls": ["../../WorkFlow/CampaignSmsReport?WorkFlowId=<wfid>&ConfigId=<cfid>&action=0&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/CampaignSmsReport?WorkFlowId=<wfid>&ConfigId=<cfid>&action=1&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/CampaignSmsReport?WorkFlowId=<wfid>&ConfigId=<cfid>&action=2&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/CampaignSmsReport?WorkFlowId=<wfid>&ConfigId=<cfid>&action=7&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/CampaignSmsReport?WorkFlowId=<wfid>&ConfigId=<cfid>&action=3&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/CampaignSmsReport?WorkFlowId=<wfid>&ConfigId=<cfid>&action=9&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>"],

            "mail": ["SentCount", "DeliveredCount", "ViewCount", "NotViewCount", "ResponseCount", "NotResponseCount", "BounceCount", "NotSentCount"],
            "mailredirect": ["../../WorkFlow/CampaignResponseReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Action=allsent&FromDate=<fdate>&ToDate=<tdate>"],
            "mailurls": ["../../WorkFlow/CampaignResponseReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Action=sent&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/CampaignResponseReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Action=deliver&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/CampaignResponseReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Action=open&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/CampaignResponseReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Action=notopen&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/CampaignResponseReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Action=clicked&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/CampaignResponseReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Action=notclicked&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/CampaignResponseReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Action=bounced&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/CampaignResponseReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Action=error&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>"],

            "form": ["ViewedCount", "ResponseCount", "ClosedCount"],
            "formredirect": [""],
            "formurls": ["../../Form/Response", "../../Form/Response", "../../Form/Response"], //Form/BannerResponse

            "chat": ["ViewedCount", "ResponseCount", "ClosedCount"],
            "chatredirect": [""],
            "chaturls": ["../../Chat/Responses", "../../Chat/Responses", "../../Chat/Responses"],

            "webpush": ["SentCount", "ViewCount", "ClickCount", "NotClickCount", "CloseCount", "BounceCount", "NotSentCount"],
            "webpushredirect": ["../../workflow/WebPushReport/WebPushCampaignReport?WorkFlowId=<wfid>&ConfigId=<cfid>&FromDate=<fdate>&ToDate=<tdate>"],
            "webpushurls": ["../../WorkFlow/WebPushReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Type=Sent&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/WebPushReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Type=View&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/WebPushReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Type=Click&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/WebPushReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Type=NotClick&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/WebPushReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Type=Close&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/WebPushReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Type=Bounce&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/WebPushReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Type=Error&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>"],



            "apppush": ["SentCount", "ViewCount", "ClickCount", "NotClickCount", "CloseCount", "BounceCount", "NotSentCount"],
            "apppushredirect": ["../../workflow/MobileAppReport/AppPushCampaignReport?WorkFlowId=<wfid>&ConfigId=<cfid>&FromDate=<fdate>&ToDate=<tdate>"],
            "apppushurls": ["../../WorkFlow/MobileAppReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Type=Sent&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/MobileAppReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Type=View&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/MobileAppReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Type=Click&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/MobileAppReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Type=NotClick&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/MobileAppReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Type=Close&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/MobileAppReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Type=Bounce&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/MobileAppReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Type=Error&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>"],

            "inappbanner": ["View", "Click", "NotClickCount", "Dismiss"],
            "inappbannerredirect": [""],
            "inappbannerurls": ["", "", "", ""],

            "obd": ["DeliveredCount", "PickedCount", "RejectedCount"],
            "obdredirect": ["../../workflow/OBDResponseReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Action=1&FromDate=<fdate>&ToDate=<tdate>"],
            "obdurls": ["../../workflow/OBDResponseReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Action=2&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../workflow/OBDResponseReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Action=3&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../workflow/OBDResponseReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Action=4&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>"],

            "broadcast": ["Deliver"],
            "broadcastredirect": [""],
            "broadcasturls": [""],

            "fbpush": ["SentCount", "ClickCount", "NotClickCount", "Unsubscribe"],
            "fbpushredirect": ["../../workflow/FacebookPushReport/FacebookPushCampaignReport?WorkFlowId=<wfid>&ConfigId=<cfid>&FromDate=<fdate>&ToDate=<tdate>"],
            "fbpushurls": ["../../WorkFlow/FacebookPushReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Type=Sent&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/FacebookPushReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Type=Click&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/FacebookPushReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Type=NotClick&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>", "../../WorkFlow/FacebookPushReport?WorkFlowId=<wfid>&ConfigId=<cfid>&Type=Unsubscribe&FromDate=<fdate>&ToDate=<tdate>&IsSplitTested=<step>"],

            "ussd": ["Deliver", "Click", "NotClickCount"],
            "ussdredirect": [""],
            "ussdurls": ["", "", ""]
        }
        return ReportKey[NodeType]
    },

    GetReportByNodeType: function (NodeType, state, getwinnercampid, step) {

        var MailType = NodeType == 'mail' ? 'mailreport' : NodeType;
        var nodes = workflowUtil.GetAnchorList(MailType);
        var width = {
            "1": [250, 99, 0],
            "2": [250, 48, 0],
            "3": [250, 32, 0],
            "4": [250, 23, 0],
            "5": [250, 23, 99],
            "6": [250, 23, 45],
            "7": [250, 23, 30],
            "8": [250, 23, 23]
        };
        var getwidth = width[nodes.length.toString()];
        var Nodesreport = "", notsent = "", SubNodesreport = "", winnercampid = 0;
        var count = 0;
        var configid = getwinnercampid > 0 ? getwinnercampid : getchannelvalue(ArrayConfig, state);
        $.ajax({
            url: "/WorkFlow/Dashboard/GetWorkFlowAllResponces",
            type: 'POST',
            async: false,
            data: JSON.stringify({ 'ConfigureId': configid, 'ChannelName': NodeType, 'FromDate': FromDateTime, 'ToDate': ToDateTime, 'IsSplitTested': step }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

                //console.log(response);

                var notopen = 0, notclick = 0;
                for (var k = 0; k < nodes.length; k++) {

                    if (k == 0) {
                        var countdiv = state;
                        var dvextra = "", style = "padding-top: 25px;", extrastyle = "top: 80px;", closestyle = "position: absolute;";

                        winner = step == 0 && response != null ? response.IsSplitTestWinner : 0


                        if (winner > 0) {
                            winnercount = 1;
                            countdiv = countdiv + "_I";
                            $('#winner1' + state).css("display", "block");
                            precountchannel = NodeType; precountstate = state;
                            winnercampid = winner > 1 ? configid : 0;
                        }

                        if (step == 1) {
                            style = "padding-top: 30px;display:none;border-bottom: 1px solid #bfbaba;";
                            countdiv = countdiv + "_F";
                            extrastyle = "top: 50px;background: #fff;"
                            closestyle = "position: initial;";
                        }
                        else if (step == 2) {
                            countdiv = countdiv + "_S";
                            style = "padding-top: 5px;display:none;";
                            extrastyle = "top: 50px;background: #fff;"
                            closestyle = "position: initial;";
                            $('#winner1' + state).css("display", "none");
                            $('#winner' + state).css("display", "block");
                            $('#winner' + state).attr("onclick", 'winnercontent("' + state + '")');
                        }

                        if (getwidth[2] != 0) {
                            dvextra = "<div onclick=hidecontent('" + countdiv + "'); style='" + closestyle + "cursor: pointer;font-weight: bold;font-size: 26px;bottom: 1px;color: #bfbaba;z-index: 30;left: 115px;' id='spnhide" + countdiv + "'>▾</div>";
                        }

                        $("#" + state).css({ height: 68, width: getwidth[0], "line-height": "20px" });
                        Nodesreport = "<div id='" + countdiv + "' style='" + style + ";width:" + getwidth[0] + "px'>";
                        SubNodesreport = "<div id='divExtraResult" + countdiv + "' class='rcontainer1' style='" + extrastyle + "z-index: 30;display:none;width:" + getwidth[0] + "px;'>";
                    }
                    count = 0;
                    var column = workflowUtil.GetReportKeyList(NodeType)[k];
                    var redirecturl = workflowUtil.GetReportKeyList(NodeType + "urls")[k].replace("<wfid>", $.urlParam("WorkFlowId")).replace("<cfid>", configid).replace("<fdate>", FromDateTime).replace("<tdate>", ToDateTime).replace("<step>", step);
                    if (response != null && response != undefined) {
                        if (column == "NotViewCount") { count = response["NotViewCount"]; notopen = count; }//{ count = response["DeliveredCount"] - response["ViewCount"]; notopen = count; }//mail
                        else if (column == "NotResponseCount") { count = response["ViewCount"] != 0 ? response["ViewCount"] - response["ResponseCount"] : 0; notclick = count; }//mail
                        else if (column == "NotClickCount" && NodeType.indexOf("push") > -1) { count = response["NotClickCount"]; notclick = count; }//push
                        else if (column == "NotClickCount") { count = response["DeliverCount"] - response["ClickCount"]; notclick = count; }//sms

                        else {
                            count = response[column] != undefined ? response[column] : 0;
                        }
                    }


                    var getresult = "";
                    if (column == "SentCount") {
                        var getvalue = 0;
                        var getdata = dataconnections.filter(x => x.TargetId === state && x.RelationWithParent === "Not Open").map(x => x.SourceId);
                        if (getdata[0] != undefined) {
                            getvalue = ArrayChannelResponses.filter(x => x.channelid === getdata[0].toString()).map(x => x.notopen)[0];
                            getresult = count > getvalue ? "<span class='pow' title='Previous Drip Message Opened by user after this drip was sent'>" + (count - getvalue) + "</span>" : "";
                        }

                        getdata = dataconnections.filter(x => x.TargetId === state && x.RelationWithParent === "Not Click").map(x => x.SourceId);
                        if (getdata[0] != undefined) {
                            getvalue = ArrayChannelResponses.filter(x => x.channelid === getdata[0].toString()).map(x => x.notclick)[0];
                            getresult = count > getvalue ? "<span class='pow' title='Previous Drip Message clicked by user after this drip was sent'>" + (count - getvalue) + "</span>" : "";
                        }

                        if ((response != null) && NodeType.indexOf("push") > -1 && response.MachinesCount != undefined) {
                            var repeatuser = response.MachinesCount;
                            getresult = repeatuser > 0 ? "<span class='pow' title='This Contacts having multiple machine-ids'>" + repeatuser + "</span>" : "";

                        }

                        getresult = "";
                        getdata = dataconnections.filter(x => x.TargetId === state && x.SourceId.match(/(mail|sms)/)).map(x => x.SourceId);
                        ////if (getdata[0] != undefined && getresult.length == 0) {
                        ////    getvalue = ArrayChannelResponses.filter(x => x.channelid === getdata[0].toString()).map(x => x.notclick)[0];
                        ////    var channeltypetext = NodeType.indexOf('mail') > -1 && getdata[0].toString().indexOf('mail') > -1 ? "No of unsubscribe" : "";
                        ////    channeltypetext = channeltypetext.length == 0 && NodeType.indexOf('mail') > -1 && getdata[0].toString().indexOf('sms') > -1 ? "This contacts dont have email-id or unsuscribe" : channeltypetext;
                        ////    channeltypetext = channeltypetext.length == 0 && NodeType.indexOf('sms') > -1 && getdata[0].toString().indexOf('sms') > -1 ? "No of DND" : channeltypetext;
                        ////    channeltypetext = channeltypetext.length == 0 && NodeType.indexOf('sms') > -1 && getdata[0].toString().indexOf('mail') > -1 ? "This contacts dont have mobile number or DND" : channeltypetext;
                        ////    getresult = count < getvalue && count != 0 ? "<span class='pow' title='" + channeltypetext + "'>" + (getvalue - count) + "</span>" : "";
                        ////}



                        //if ((response != null) && response.NotSentCount != 0 && response.NotSentCount != undefined) {
                        //    notsent = "<span class='pow' style='top: 7px;left: 10px;color: #f31a0a;' title='This Contacts do not have custom field data'>" + response.NotSentCount + "</span>";
                        //}


                    }


                    if (response != null && response["TemplateName"] != undefined) {
                        var title = response["TemplateName"];
                        title = title.charAt(0).toUpperCase() + title.slice(1);
                        $("#title" + state).text(title.length > 25 ? title.substring(0, 25) + ".." : title);
                    }

                    var id = configid + nodes[k].replace(/ /g, '') + step;

                    var ahref = "<a id='" + id + "' href='javascript:void(0)' onclick='openreport(\"" + redirecturl.replace(/ /g, '~') + "\")' title='" + nodes[k] + "' style='font-size:12px;color:#000;cursor: pointer;'>" + animateNumber(count, id) + "</a>";
                    if (redirecturl == "") {
                        ahref = "<span id='" + id + "' href='javascript:void(0);' title='" + nodes[k] + "' style='font-size:12px;color:#000;'>" + animateNumber(count, id) + "</span>";
                    }

                    if (nodes.length > 4 && (column.toString().toLowerCase().indexOf('error') > -1 || column.toString().toLowerCase().indexOf('not') > -1 || (column.toString().toLowerCase().indexOf('bounce') > -1 && (NodeType == 'webpush' || NodeType == 'apppush' || NodeType == 'mail')))) {
                        SubNodesreport += "<div class='rsquare' style='width:" + getwidth[2] + "%'>" + nodes[k].replace(" ", "&nbsp;") + "<br />" + ahref + getresult + "</div>";
                    }
                    else {
                        Nodesreport += "<div class='rsquare' style='width:" + getwidth[1] + "%'>" + nodes[k].replace(" ", "&nbsp;") + "<br />" + ahref + getresult + "</div>";
                    }
                }

                var Responses = {
                    "channelid": state,
                    "configid": configid,
                    "notopen": notopen,
                    "notclick": notclick
                }
                ArrayChannelResponses.push(Responses);





                if (winnercampid > 0 || getwinnercampid > 0) {
                    if (winnercampid > 0 && winnercount == 1) {
                        countresult = Nodesreport + notsent + SubNodesreport + "</div>" + dvextra + "</div>";
                        workflowUtil.GetReportByNodeType(precountchannel, precountstate, winnercampid, 1);
                        winnercampid = 0;
                    }
                    else if (getwinnercampid > 0 && winnercount == 1) {
                        winnercount = 0;
                        countresult += Nodesreport + notsent + SubNodesreport + "</div>" + dvextra + "</div>";
                        workflowUtil.GetReportByNodeType(precountchannel, precountstate, getwinnercampid, 2);
                    }
                    else { countresult += Nodesreport + notsent + SubNodesreport + "</div>" + dvextra + "</div>"; }
                }
                else {
                    countresult = Nodesreport + notsent + "</div>" + SubNodesreport + "</div>" + dvextra;
                }
            }
        });






        return countresult;
    },
  
    GetNodeConfigurationId: function () {
        $.ajax({
            url: "/WorkFlow/Dashboard/GetWrokflowNodes",
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({ 'WorkflowId': $.urlParam("WorkFlowId") }),
            contentType: "application/json; charset=utf-8",
            success: function (json) {
                $.each(json, function (i) {
                    SetNodeConfigArray(json[i].Channel, json[i].SegmentId, json[i].ConfigName, json[i].ChannelStatus);
                });

                workflowUtil.calldefaultworkflowdefaultload();
            },
            error: ShowAjaxError
        });
    },
    calldefaultworkflowdefaultload: function () {
        $.ajax({
            url: "/WorkFlow/Create/GetWorkflowByWorkflowId",
            type: 'POST',
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ 'WorkflowId': $.urlParam("WorkFlowId") }),
            success: function (response) {
                $('#ui_spnWorkFlowName').html(response.Title);
                if (response.Status == 2) { $("#dvDefault").show(); }
                else {
                    LoadDefaultWorkFlow();
                }
                $("#dvLoadingImg").hide();
            },
            error: ShowAjaxError
        });
    },
    GetUniqueIdForNode: function (state, Id) {
        return state + "_" + Id + "_" + (new Date()).getMilliseconds();
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

    },
    SaveFlowchart: function () {

    }
};

function hidecontent(contentid) {
    var getextra = contentid;
    var mcontentid = contentid.replace("_F", "").replace("_S", "").replace("_I", "");
    if ($("#divExtraResult" + contentid).css('display') == 'none') {
        $("#divExtraResult" + contentid).css("display", "block");
        $("#spnhide" + contentid).html("▴");
        $("#" + mcontentid).css({ height: contentid.match(/(_F|_S)/) ? 250 : 130, "z-index": 30 });

    }
    else { $("#spnhide" + contentid).html("▾"); $("#divExtraResult" + contentid).css("display", "none"); $("#" + mcontentid).css({ height: contentid.match(/(_F|_S)/) ? 250 : 68 }); }
}
//supporting arrange nodes function


function SetNodeConfigArray(nodeid, value, title, Status) {
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
}
function getchannelvalue(allchannel, channel) {
    var gettype = channel.split('_')[1].toString();
    var configid = ArrayConfig.filter(x => x.Channel === channel.toString()).map(x => x.Value)[0];
    var redirecturl = workflowUtil.GetReportKeyList(gettype + "redirect")[0].replace("<wfid>", $.urlParam("WorkFlowId")).replace("<cfid>", configid).replace("<fdate>", FromDateTime).replace("<tdate>", ToDateTime);
    $("#title" + channel).css({ top: 14, "cursor": "pointer" }).on("click", function () { openreport(redirecturl.replace(/ /g, '~')); });

    var r = ArrayConfig.filter(x => x.Channel === channel.toString()).map(x => x.Value);
    if (channel.indexOf("dateandtime") > -1)
    { return (r != "" ? r : "0").toString(); }
    else { return parseInt(r != "" ? r : 0); }
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

function animateNumber(val, counter) {

    var endVal = parseInt(val);
    if (endVal <= 0 || val == undefined || val == null || val == NaN) {
        return "00";
    }
    else {
        var count = endVal > 9 ? endVal : "0" + endVal;
        return count;
    }


    //var endVal = parseInt(val);
    //if (endVal <= 0 || val == undefined || val == null || val == NaN) { $("#" + counter).html("<span style='color:#666'>00</span>"); return "00"; }
    //else {
    //    this.disabled = true;
    //    var currentVal = endVal > 8 ? endVal - 5 : 0;
    //    var i = setInterval(function () {
    //        if (currentVal === endVal) {
    //            var count = currentVal > 9 ? currentVal : "0" + currentVal;
    //            $("#" + counter).html(count);
    //            clearInterval(i);
    //        }
    //        else {
    //            currentVal++;
    //            //console.log(currentVal);
    //            var count = currentVal > 9 ? currentVal : "0" + currentVal;
    //            $("#" + counter).html("<span style='color:#666'>" + count + "</span>");
    //        }
    //    }, 500);
    //    timeouts.push(i);
       // return currentVal;
    //}
}
function openreport(geturl) {
    if ($.trim($("#ui_txtSearchEmailId").val()).length == '0') {
        if (geturl.toLowerCase().indexOf('group') == -1) {
            $("#iframeback").css("display", "none");
        } else { $("#iframeback").css("display", "block"); }
        $('#iframe_report').attr('src', geturl.replace(/~/g, ' '));
        $("body").css("overflow", "hidden");
        $(".bgShadedDiv").show();
        $("#dvreport").css("display", "block");
    }
}
function closereport() {
    $('#iframe_report').attr('src', "");
    $("body").css("overflow-y", "scroll");
    $("#dvreport").hide("fast");
    $(".bgShadedDiv").hide();
}

function ownBack() {

    if (document.getElementById('iframe_report').contentWindow.location.href.toLowerCase().indexOf('action') > -1)
    { document.getElementById('iframe_report').contentWindow.history.back(); }
    else {
        closereport();
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
            var obj = $.parseJSON(json)[0];
            var gtext = title.toString().split('~');
            showTitle = title.toString().split('~')[1] + " to " + title.toString().split('~')[0] + " - " + obj.Name;
            showTitle = showTitle.charAt(0).toUpperCase() + showTitle.slice(1);

            var email = obj.TotalEmailVerified > 9 ? obj.TotalEmailVerified : "0" + obj.TotalEmailVerified;
            var mobile = obj.TotalPhoneNumber > 9 ? obj.TotalPhoneNumber : "0" + obj.TotalPhoneNumber;
            var optout = obj.TotalEmailUnsubscribed > 9 ? obj.TotalEmailUnsubscribed : "0" + obj.TotalEmailUnsubscribed;
            var dnd = obj.TotalPhoneNumberDnd > 9 ? obj.TotalPhoneNumberDnd : "0" + obj.TotalPhoneNumberDnd;

            var Nodesreport = "<div id='dvGroupCount' class='rcontainer' style='line-height: 16px;top: 50px;left: 0px;width: 186px;display:none;'>";
            Nodesreport += "<div class='rsquare' style='width:25%'>EmailId<br /><span style='font-size: 20px;color: #000;'>" + email + "</span></div>";
            Nodesreport += "<div class='rsquare' style='width:23%'>Mobile<br /><span style='font-size: 20px;color: #000;'>" + mobile + "</span></div>";
            Nodesreport += "<div class='rsquare' style='width:23%'>Optout<br /><span style='font-size: 20px;color: #000;'>" + optout + "</span></div>";
            Nodesreport += "<div class='rsquare' style='width:23%'>DND<br /><span style='font-size: 20px;color: #000;'>" + dnd + "</span></div>";
            Nodesreport += "</div>";

            var dvextra = "";//"<span onclick=hidegroupcontent('" + nodeid + "'); style='position: absolute;cursor: pointer;font-weight: bold;font-size: 24px;left: 82px;color: #bfbaba;top: 38px;' id='spcount'>▾</span>";

            $("#groupcount" + nodeid).html(Nodesreport + dvextra);
            $("#title" + nodeid).html(showTitle.length > 25 ? showTitle.substring(0, 25) + ".." : showTitle);
            grouptitle = "#title" + nodeid + "|" + $("#title" + nodeid).html();
        },
        error: ShowAjaxError
    });
}

function hidegroupcontent(contentid) {
    if ($("#dvGroupCount").css('display') == 'none') {
        $("#dvGroupCount").css("display", "block");
        $("#spcount").html("▴"); $("#spcount").css({ top: 85 });
        $("#" + contentid).css({ height: 80, "z-index": 30 });

    }
    else { $("#spcount").html("▾"); $("#spcount").css({ top: 38 }); $("#dvGroupCount").css("display", "none"); $("#" + contentid).css({ height: 30 }); }
}

function winnercontent(state) {
    $('#divExtraResult' + state + "_I").css("display", "none");
    $("#spnhide" + state + "_I").html("▾");

    if ($('#' + state + "_I").css('display') == 'block') {
        $('#' + state + "_I").css("display", "none");
        $('#' + state + "_F").css("display", "block");
        $('#' + state + "_S").css("display", "block");
        $("#" + state).css({ height: 250, "z-index": 30 });
    }
    else {
        $('#' + state + "_I").css("display", "block");
        $('#' + state + "_F").css("display", "none");
        $('#' + state + "_S").css("display", "none");
        $("#" + state).css({ height: 68, "z-index": 30 });
    }

}
function AdvancedSearch() {

    if ($.trim($("#ui_txtSearchEmailId").val()).length != '0') {
        stopTimer();
        for (var n = 0; n < ArrayConfig.length; n++) {
            var node = containsAny(ArrayConfig[n].Channel, defaultchannels);
            if (node) {
                var email = "", mobile = "";
                var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
                if (filter.test($.trim($("#ui_txtSearchEmailId").val()))) {
                    email = $.trim($("#ui_txtSearchEmailId").val());
                    BindUserEnteredChannel(email, "", node.replace("state_", "").replace("_", ""), ArrayConfig[n].Channel);
                } else {
                    if ($.trim($("#ui_txtSearchEmailId").val()).length <= 10) {
                        if (/^[0-9]*$/.test($.trim($("#ui_txtSearchEmailId").val()))) {
                            mobile = $.trim($("#ui_txtSearchEmailId").val());
                            BindUserEnteredChannel("", mobile, node.replace("state_", "").replace("_", ""), ArrayConfig[n].Channel);
                        }
                    }
                }
            }
            else if (ArrayConfig[n].Channel.indexOf('_segment_') > -1) {
                var contactinfo = $.trim($("#ui_txtSearchEmailId").val());
                $("#title" + ArrayConfig[n].Channel).text(contactinfo.length > 20 ? contactinfo.substring(0, 20) + ".." : contactinfo);
                $('#spcount').css("display", "none");
                $('#dvGroupCount').css("visibility", "hidden");
                $("#" + ArrayConfig[n].Channel).css({ height: 30 });
            }
        }
    }
    else {
        var gtitle = grouptitle.split('|');
        if (gtitle.length > 0) { $(gtitle[0]).text(gtitle[1]); }
        $('#spcount').css("display", "block");
        $('#dvGroupCount').css("visibility", "visible");
        $("#ui_txtSearchEmailId").val("");
        $("div[type='remove']").css({ "backgroundColor": "#fff", "border": "1px solid #66BB6A" });
        $("div[type='remove1']").css({ "backgroundColor": "#fff", "border": "1px solid #57ADD6" });
        $("i[type='remove']").css({ "backgroundColor": "#66BB6A" });
    }
}
function CancelFilter() {
    var gtitle = grouptitle.split('|');
    if (gtitle.length > 0) { $(gtitle[0]).text(gtitle[1]); } $('#spcount').css("display", "block");
    $('#dvGroupCount').css("visibility", "visible");
    $("#spcount").html("▾"); $("#spcount").css({ top: 38 }); $("#dvGroupCount").css("display", "none");
    $("#ui_txtSearchEmailId").val("");
    $("div[type='remove']").css({ "backgroundColor": "#fff", "border": "1px solid #66BB6A" });
    $("div[type='remove1']").css({ "backgroundColor": "#fff", "border": "1px solid #57ADD6" });
    $("i[type='remove']").css({ "backgroundColor": "#66BB6A" });

    for (var n = 0; n < ArrayConfig.length; n++) {
        var node = containsAny(ArrayConfig[n].Channel, defaultchannels);
        if (node) {
            $("#count" + ArrayConfig[n].Channel).html(workflowUtil.GetReportByNodeType(node.replace("state_", "").replace("_", ""), ArrayConfig[n].Channel, 0, 0));
        }
    }

}

function BindUserEnteredChannel(Email, Mobile, NodeType, state) {

    var MailType = NodeType == 'mail' ? 'mailreport' : NodeType;
    var nodes = workflowUtil.GetAnchorList(MailType);
    var Nodesreport = "", SubNodesreport = "", winnercampid = 0;
    var count = 0, step = 0;
    var configid = getchannelvalue(ArrayConfig, state);
    var nodes = workflowUtil.GetAnchorList(MailType);
    var ReportParam = { WorkFlowId: $.urlParam("WorkFlowId"), ConfigId: configid, 'ChannelType': NodeType, EmailId: Email, PhoneNumber: Mobile };

    $("#title" + state).css({ "cursor": "default", "text-decoration": "none" });
    $.ajax({
        url: "/WorkFlow/History/GetOverAllCount",
        type: 'POST',
        async: false,
        data: JSON.stringify({ 'history': ReportParam, 'FromDate': FromDateTime, 'ToDate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {

            var obj = JSON.parse(response)[0];
            if (obj != undefined) {

                for (var k = 0; k < nodes.length; k++) {
                    var column = nodes[k].replace(/ /g, '');
                    var id = configid + column + step;
                    $("#" + id).attr("onclick", "javascript:void(0);");
                    $("#" + id).css({ "cursor": "default", "text-decoration": "none" });
                    if (column.toLowerCase().match(/(send|sent)/)) {
                        animateNumber(obj.TotalSent, id);
                    } else if (column.toLowerCase().match(/(notopen)/)) {
                        animateNumber(obj.TotalNotViewed, id);
                    } else if (column.toLowerCase().match(/(notclick)/)) {
                        animateNumber(obj.TotalNotResponsed, id);
                    } else if (column.toLowerCase().match(/(deliver)/)) {
                        animateNumber(obj.TotalDelivered, id);
                    } else if (column.toLowerCase().match(/(click)/)) {
                        animateNumber(obj.TotalResponsed, id);
                    } else if (column.toLowerCase().match(/(bounce)/)) {
                        animateNumber(obj.TotalBounced, id);
                    } else if (column.toLowerCase().match(/(view|open)/)) {
                        animateNumber(obj.TotalViewed, id);
                    }
                }

                var time = 1000;
                if (obj.GroupId != 0) {
                    $("#" + obj.GroupId).attr("type", "remove1");
                    $("#" + obj.GroupId).animate({
                        backgroundColor: '#d2ebf7',
                    }, time);
                }
                if (obj.RuleId != 0) {
                    $("#" + obj.RuleId).attr("type", "remove1");
                    $("#" + obj.RuleId).animate({
                        backgroundColor: '#d2ebf7',
                    }, time);
                }
                if (obj.DateId != 0) {
                    $("#" + obj.DateId).attr("type", "remove1");
                    $("#" + obj.DateId).animate({
                        backgroundColor: '#d2ebf7',
                    }, time);
                }
                if (obj.SentCount != 0) {
                    $("#" + state).css({ "border": "1px solid #66BB6A" });
                    $("#i_" + state).css({ "backgroundColor": "#66BB6A" });
                    $("#" + state).attr("type", "remove");
                    $("#" + state).animate({
                        backgroundColor: '#c5f3c7',
                    }, time);
                }

            } else {
                for (var k = 0; k < nodes.length; k++) {
                    var column = nodes[k].replace(/ /g, '');
                    var id = configid + column + step;
                    $("#" + id).html("00");
                    $("#" + id).css({ "cursor": "default", "text-decoration": "none" });
                }

                $("#i_" + state).attr("type", "remove");
                $("#" + state).attr("type", "remove");
                $("#" + state).css({ "background-color": "#f3f1f1", "border": "1px solid #c1c0c0" });
                $("#i_" + state).css("background-color", "#d4d2d2");
            }
        }
    });

}

function stopTimer() {
    for (var i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
    }

    timeouts = [];
}

function OverAllCount() {
    $(".button").attr("class", "button1");
    $("#btn3").attr("class", "button buttonWithourCurve");
    $("#btn3").attr("GraphBindingId", 3);
    FromDateTime = null, ToDateTime = null;
    CallBackFunction();
}