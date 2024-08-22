
function LoadDefaultWorkFlow() {
    var KeyAndValuesOfMenu = {};
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
        //$stateElement.append($("<img id='imgabrule" + stateId + "' src='../../images/abtest.png' title='Rule of A/B testing' class='note' style='cursor: default;display:none;left: 170px;top: 13px;'><span id='winner" + stateId + "' title='Get test & continue result of A/B testing' class='fa-stack' style='z-index: 60;display:none;cursor: pointer;position: absolute;left: 173px;color:#ff9800;top: -2px;'><i class='fa fa-trophy' style='color: rgb(255, 152, 0);'></i> <i class='fa fa-arrow-right fa-sm fa-stack-1x' style='cursor: pointer; color: green;padding-left: 9px;font-size: 10px;top: 3px;'></i></span><i title='Winner of A/B testing' id='winner1" + stateId + "' class='fa fa-trophy' aria-hidden='true' style='display:none;position: absolute;left: 183px;color:#ff9800;    z-index: 60;cursor: default;'></i>"));
        var classNameForTag = workflowUtil.GetClassNameByNodeType(nodeType);

        $stateElement.append($("<ul id='ul_" + stateId + "' class='" + classNameForTag + "' style='height: 0px;width: 0px;position: absolute;left: 7px;color:#fff;'><li id='li_" + stateId + "' style='height: auto;' ><i id='i_" + stateId + "'style='cursor: default;' class='" + getclass + "' aria-hidden='true' title='" + stateInfo.title + "'></i></li></ul>"));

        //$stateElement.append($("<ul class='" + classNameForTag + "' style='height: 0px;width: 0px;position: absolute;left: -25px;color:#fff;'><li style='height: 50px;'><i style='cursor: default;' class='" + getclass + "' aria-hidden='true' title='Event'></i></li></ul>"));
        $stateElement.append($("<span id='title" + stateId + "' style='left: 5%;height:0px;;font-size: 12px;width: 90%;position: absolute;color: #000;top: 12px;padding-top: 2px;'></span>"));

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


        var dataImport = 0;
        var belong = 1;
        if (stateId.indexOf("_segment_") > -1) {//state_segment_570
            $("#title" + stateId).html("Audience");
        }
        else {
            title = title.replace("^0", "").replace("^1", "");
            title = title.charAt(0).toUpperCase() + title.slice(1);
            $("#title" + stateId).text(title.length > 25 ? title.substring(0, 25) + ".." : title);
        }

        $("#" + stateId).attr('title', title);

        if (containsAny("state_" + nodeType + "_", defaultchannels)) {
            $("#ul_" + stateId).css({ top: -14, left: 140 });
            $("#li_" + stateId).css({ width: 35 });
            $("#i_" + stateId).css({ "padding": "6px", "border-radius": "5px" });
            $stateElement.append("<div id='count" + stateId + "'>" + workflowUtil.GetReportByNodeType(nodeType, stateId, 0, 0) + "</div>");

        }
        else {
            var configid = ArrayConfig.filter(x => x.Channel === stateId.toString()).map(x => x.Value)[0];

            var getleft = $("#" + stateId).position().left;
            $("#" + stateId).css({ height: 47, width: 200, "line-height": "0px", left: $("#" + stateId).position().left + 23 });
            $("#ul_" + stateId).css({ top: -2, left: 0 });
            $("#i_" + stateId).css({ "padding": "14px" });
            $("#title" + stateId).css({ top: 20, "cursor": "pointer" });
            var Value = ArrayConfig.filter(x => x.Channel === stateId.toString()).map(x => x.Value);
            if (nodeType == 'segment') {
                $("#title" + stateId).attr('onclick', 'BindWorkFlowGroup("' + Value + '","' + belong + '",0)');
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
                        cssClass: 'endpointSourceLabel wfreport'
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


        connection.getOverlay('label').setLabel(text);

        connection.bind('editCompleted', function (o) {
            if (typeof console != 'undefined') {
                console.log('connection edited. path is now ', o.path);
            }
        });
    };


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
    jsPlumb.ready(function () {

        builder = new jspInstance();
        builder.stateConfiguration.clickHandler = function (e) {
            workflowUtil.ShowConfigurationSettingByNode(e);
        }
        builder.stateConfiguration.dblClickHandler = function (e) { builder.removeState(e); }
        builder.initialize();

        workflowUtil.getWorkflowDetails();


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


    });

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


var zoomin = 1;
function Zooming(type) {
    if (type == 1) { zoomin = zoomin + .1 } else { zoomin = zoomin - .1 }
    $("#flowchart").css({
        "zoom": zoomin
    });
}