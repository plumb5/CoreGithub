
function LoadDefaultWorkFlow() {

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

        $stateElement.append($("<ul class='" + classNameForTag + "' style='height: 0px;width: 0px;position: absolute;left: 10px;color:#fff;'><li style='height: 50px;'><i style='cursor: default;' class='" + getclass + "' aria-hidden='true' title='Event'></i></li></ul>"));

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

        $stateElement.append($("<ul class='" + classNameForTag + "' style='height: 0px;width: 0px;position: absolute;left: 10px;color:#fff;'><li style='height: 50px;'><i style='cursor: default;' class='" + getclass + "' aria-hidden='true' title='Event'></i></li></ul>"));
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
        } else if (stateId.match(/(mail|sms|ussd|obd|push|banner|form|chat|broadcast|alert|webhook|whatsapp)/)) {
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

                if (dataconnections.filter(x => x.TargetId === connection.targetId).length == 0) {
                    dataconnections.push({
                        connectionId: connection.id,
                        SourceId: connection.sourceId,
                        TargetId: connection.targetId,
                        anchor: connection.endpoints[0].anchor.type,
                        RelationWithParent: text
                    });
                }
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

        if ($.urlParam("Type").length > 0) {
            WorkFlow.FlowContent = DefaultWorkflowTemplateJson[$.urlParam("Type")];
            builder.initializeData(WorkFlow.FlowContent);
        }
        else if ($.urlParam("WorkflowId") > 0) {

            $.ajax({
                url: "/Journey/CreateWorkflow/GetWorkFlowById",
                type: 'POST',
                async: false,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WorkflowId': parseInt($.urlParam("WorkFlowId")) }),
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
        }

        //Make element draggable
        var x = null;
        var addchk = 0;//to check 1st time drag and drop
        $(".dragnode").draggable({
            containment: '#flowchart',
            drag: function () {
                addchk = 1;
            },
            helper: 'clone',
            cursor: 'move',
            tolerance: 'fit'
        });

        $("#flowchart").droppable({
            drop: function (e, ui) {

                x = ui.helper.clone();
                var e = x[0];
                var getleft = e.style.left.replace("px", "");
                var gettop = e.style.top.replace("px", "");
                window.console.log(getleft);
                window.console.log(gettop);



                if (addchk == 1) {
                    addchk = 0;
                    var dragdv = $(ui.draggable).attr("typeof");
                    var label = $(ui.draggable)[0].title;
                    if (dragdv != "") {

                        var achorList = workflowUtil.GetAnchorList(dragdv);

                        numberOfElements = numberOfElements + 1;
                        builder.addData(dragdv, label, getleft - 250, gettop - 40, achorList);
                    }
                }

            },
            out: function (e, ui) {
                var getleft = ui.position.left;
                var gettop = ui.position.top;
                if (getleft < 0 || gettop < 0 || ui.offset.left > $("#flowchart").width()) {
                    $(ui.draggable).trigger("mouseup");
                }
            }
        });
        //end of draggable

    });

}