

$.connection.hub.url = chatApp + "signalr";
var toVisitorId = "0", chatRooms = 0, P5Chat = $.connection.P5Chat, VisitorsList = new Array(), VisitorsPath = new Array(), PastMessageDetails = new Array(), EventOfVisitor = new Array(), VisitorUnReadMessage = new Array(), VisitorFirstMessage = new Array(), AgentMsgSent = new Array();
var chatAgent = { AdsId: 0, ChatId: 0, UserId: 0, Name: "", City: [] };

//P5Chat = "http://localhost:4412/";
$.connection.hub.logging = true;
//$.connection.hub.transportConnectTimeout = 30000;

var chatUtil = {
    Start: function () {

        $.connection.hub.qs = { UserId: chatAgent.UserId, Agent: JSON.stringify(chatAgent) };
        setTimeout(function () {
            $.connection.hub.start({ jsonp: true }, { transport: ["webSockets", "serverSentEvents", "longPolling"] }).fail(function (e) {
                if (window.console) console.log(e);
            }).done(function () {
                if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.connected)
                    chatUtil.CheckForOnline();
            });
        }, 0);
    },
    ConnectAgent: function () {
        P5Chat.server.connectAgent(chatAgent).fail(function (e) {
            console.log(e);
        }).done(function () {
            setTimeout(function () {
                $("#ui_btnShowOnlineAgent").removeClass("tdHide");
            }, 2000);
        });

    },
    StopConnection: function () {
        $.connection.hub.stop();
    },
    SignalRFunctions: function () {

        //-----------------------------------------------------Connection and Disconnected-------------------------------------------
        var tryingToReconnect = false;

        $.connection.hub.reconnecting(function () {
            tryingToReconnect = true;
        });

        $.connection.hub.reconnected(function () {
            tryingToReconnect = false;
        });

        $.connection.hub.disconnected(function () {
            if ($.connection.hub.lastError) {
                window.console.log("Disconnected. Reason: " + $.connection.hub.lastError.message);
            }
        });


        //-----------------------------------------------------Connection and Disconnected-------------------------------------------


        P5Chat.client.getAgentSettings = function (chatAgentNew) {
            chatAgent = chatAgentNew;
            chatUtil.ConnectAgent();
            chatHelper.UpdateAgentOnline();
        };

        P5Chat.client.updateAgent = function (chatAgentNew) {
            chatAgent = chatAgentNew;
        };

        P5Chat.client.iAmDisconnecting = function () {

            if (!SignOutClicked) {
                chatHelper.ReLogin();
            }
        };

        P5Chat.client.updateAgentDetails = function (chatAgentNew, allvisitors) {
            chatAgent = chatAgentNew;
            if (allvisitors && allvisitors.length == 0) {
                $("#dvContacts ul").empty();
                $("#dvContacts ul").append("<li id='novisitor'><div class='chatactvisitem'>There are no Visitors on Your Website</div></li>");
            }

            for (var i = 0; allvisitors && i < allvisitors.length; i++)
                chatHelper.AddToContactList(allvisitors[i]);
        };

        P5Chat.client.visitorConnected = function (visitor) {
            chatHelper.AddToContactList(visitor);
        };

        P5Chat.client.visitorDisconnected = function (visitor) {
            chatHelper.RemoveVisitorAction(visitor);
        };

        P5Chat.client.messageFromVisitor = function (visitor, message) {
            chatHelper.AppendMessage(message, visitor);
        };

        P5Chat.client.myMessage = function (message) {
            chatHelper.AppendMessage(message);
        };

        P5Chat.client.visitorIsTyping = function (visitor) {
            chatHelper.ShowTyping(visitor);
        };

        P5Chat.client.agentList = function (allAgents, userInfoList) {
            chatHelper.BindAgentForTransfer(allAgents, userInfoList);
        };

        P5Chat.client.receiveTransferChat = function (fromAgent, visitor, reason, currentVisitorPath) {
            chatHelper.AcceptChatTransfer(fromAgent, visitor, reason, currentVisitorPath);
        };

        P5Chat.client.acceptNotification = function (visitor) {
            ShowSuccessMessage(GlobalErrorList.ChatRoomRoomAgents.AcceptChatTransfer_Success.replace("{*1*}", visitor.Name));
            VisitorsPath[visitor.UserId] = [];
            chatHelper.RemoveVisitorAction(visitor);
        };

        P5Chat.client.rejectNotification = function (visitorId) {
            var currentVisitor = chatHelper.GetVisitorFromList(visitorId);
            if (currentVisitor)
                ShowErrorMessage(GlobalErrorList.ChatRoomRoomAgents.RejectChatTransfer.replace("{*1*}", currentVisitor.Name));
        };

        P5Chat.client.busyNotification = function (visitorId) {
            var currentVisitor = chatHelper.GetVisitorFromList(visitorId);
            if (currentVisitor)
                ShowErrorMessage(GlobalErrorList.ChatRoomRoomAgents.AgentBusy.replace("{*1*}", currentVisitor.Name));
        };

        P5Chat.client.bannerClickedEvent = function (banner, chatBannerId, bannerTitle, redirectUrl) {
            chatHelper.BannerActionsByVisitor(banner, 1, chatBannerId, bannerTitle, redirectUrl);
        };

        P5Chat.client.bannerClosedEvent = function (banner, chatBannerId, bannerTitle, redirectUrl) {
            chatHelper.BannerActionsByVisitor(banner, 3, chatBannerId, bannerTitle, redirectUrl);
        };

        P5Chat.client.updateVisitorDetails = function (visitor, name, emailId, contactNumber, comment, contactId) {
            var currentvisitor = VisitorsList[visitor.UserId];
            if (name && name.length > 0) {
                // $("#" + visitor.UserId + " > a").html(name);
                $("#" + visitor.UserId + " h6").html(name);
                currentvisitor.Name = name;
                if (toVisitorId == visitor.UserId) {
                    //$("#ui_spanCurrentVisitorName").html(name);
                    // $("#" + toVisitorId + " .visitorName").html(name); 
                    $("#" + toVisitorId + " h6").html(name);
                    $("#ui_txtVisitorName").val(name);
                }
            }

            if (emailId && emailId.length > 0) {
                currentvisitor.EmailId = emailId;
                $("#" + visitor.UserId + " .visitorimg").removeClass("unknown").removeClass("customer").addClass("lead").attr("title", "Visitor is lead visitor");
                if (toVisitorId == visitor.UserId) {
                    $("#ui_txtVisitorContactMailId").val(emailId);
                    //$("#ui_spanCurrentVisitorEmailId").html(emailId);
                }
            }

            if (contactNumber && contactNumber.length > 0) {
                currentvisitor.ContactNumber = contactNumber;
                if (toVisitorId == visitor.UserId) {
                    $("#ui_txtVisitorContactNumber").val(contactNumber);
                }
            }

            if (comment && comment.length > 0) {
                currentvisitor.Comments = comment;
                if (toVisitorId == visitor.UserId) {
                    $("#ui_txtVisitorsNote").val(comment);
                }
            }

            if (contactId && contactId > 0) {
                currentvisitor.ContactId = contactId;
                if (toVisitorId == visitor.UserId) {
                    chatHelper.BindVisitorDetails();
                }
            }

            VisitorsList[visitor.UserId] = currentvisitor;
        };

        P5Chat.client.isActiveForAnothorChat = function (agent) {
            chatUtil.StopConnection();
            ShowErrorMessage(GlobalErrorList.ChatRoomRoomAgents.MultipleConnection_Error);
        };

        P5Chat.client.isAlreadyConnectedInDifferentBroswer = function () {
            $("#dvContacts ul").empty();
            if (IsForceFullyConncected)
                $("#dvContacts ul").append("<li id='novisitor' ><div class='chatactvisitem'>Connecting ...</div></li>");
            //$(".noVisitors").html("Connecting ...");          
            else {
                if (!document.getElementById("ui_ForceConnect")) {
                    OnlineClicked = false;
                    chatUtil.StopConnection();
                    ShowErrorMessage(GlobalErrorList.ChatRoomRoomAgents.ForcedConnection_Error);
                    //$(".noVisitors").html("<label id='lbl_startChat' style='cursor: pointer;' onclick='ForceConnect();'><label style='cursor: pointer;' id='ui_ForceConnect'>Click here Force Connect</label></label>").show();
                    $("#dvContacts ul").append("<li id='novisitor'><div class='chatactvisitem' id='lbl_startChat' style='cursor: pointer;' onclick='ForceConnect();'><label style='cursor: pointer;' id='ui_ForceConnect'>Click here Force Connect</label></label></div></li>");
                }
            }
        };

        P5Chat.client.sessionEndedBecauseOfMulitpleUserConnectedWithSameAccount = function () {
            chatUtil.StopConnection();
            ShowErrorMessage(GlobalErrorList.ChatRoomRoomAgents.ConnectionTerminated_Error);
            setTimeout(function () { window.location.reload(); }, 6000);
            SignOutClicked = true;
        };

        P5Chat.client.visitorIsInactive = function (visitorId) {

            if (!$("#" + visitorId + " .chatactvisicn").find('i').hasClass('fa fa-circle idle')) {
                $("#" + visitorId + " .chatactvisicn").find('i').remove();
                $("#" + visitorId + " .chatactvisicn").append("<i class='fa fa-user-o'></i> <i class='fa fa-circle idle'></i>")
            }
        };

        P5Chat.client.onlineAgentList = function (allAgents) {
            chatHelper.BindOnlineAgents(allAgents);
        };

        P5Chat.client.reUpdateVisitorDetails = function (visitor) {
            VisitorsList[visitor.UserId] = visitor;
            chatHelper.BindVisitorDetails();
        };
    },
    InitializeChat: function () {
        chatAgent.AdsId = adsId; chatAgent.ChatId = chatId;
        chatAgent.UserId = $("#hdnAgentId").val();
        chatAgent.Name = Name;
        if (City && City.length > 0)
            chatAgent.City = City.split(",");
    },
    SendMessage: function (message) {
        P5Chat.server.sendMessageToVisitor(chatAgent, toVisitorId, message).fail(function (e) {
            console.log(e);
        });
    },
    TypingEvent: function () {
        P5Chat.server.typingEventToVisitor(toVisitorId).fail(function (e) {
            console.log(e);
        });
    },
    GetAllAgentStatus: function () {
        P5Chat.server.getAllAgent(chatAgent.UserId, chatAgent.AdsId, chatAgent.ChatId).fail(function (e) {
            console.log(e);
        });
    },
    TransferChat: function (toAgentId, visitorId, reason) {

        var CurrentVistorPath = JSON.stringify(VisitorsPath[visitorId]);

        P5Chat.server.transferChatSendRequest(chatAgent, toAgentId, visitorId, reason, CurrentVistorPath).fail(function (e) {
            console.log(e);
        });
    },
    AcceptChatTransfer: function (toAgent, visitorId) {
        P5Chat.server.acceptChatTransfer(chatAgent, toAgent, visitorId).fail(function (e) {
            console.log(e);
        });
    },
    RejectChatTransfer: function (toAgent, visitorId) {
        P5Chat.server.rejectChatTransfer(toAgent, visitorId).fail(function (e) {
            console.log(e);
        });
    },
    ChatTransferAgentBusy: function (toAgent, visitorId) {
        P5Chat.server.chatTransferAgentBusy(toAgent, visitorId).fail(function (e) {
            console.log(e);
        });
    },
    PushBanner: function (bannerContent, redirectUrl, chatBannerId, bannerTitle) {
        P5Chat.server.sendBanner(bannerContent, redirectUrl, toVisitorId, chatAgent, chatBannerId, bannerTitle).fail(function (e) {
            console.log(e);
        });
    },
    BanVisitorForEver: function (visitorId) {
        var banVisitor = chatHelper.GetVisitorFromList(visitorId);
        P5Chat.server.banVisitor(banVisitor).fail(function (e) {
            console.log(e);
        });
    },
    EndVisitorToday: function (visitorId) {
        var endChatVisitor = chatHelper.GetVisitorFromList(visitorId);
        P5Chat.server.chatEndedForToday(endChatVisitor).fail(function (e) {
            console.log(e);
        });
    },
    UpdateVisitorSummary: function (name, emailId, contactNumber, comment, contactId) {
        var visitor = VisitorsList[toVisitorId];
        P5Chat.server.updateVisitorSummary(visitor, name, emailId, contactNumber, comment, contactId).fail(function (e) {
            console.log(e);
        }).done(function () {
            visitor.Name = name;
        });

        VisitorsList[toVisitorId] = visitor;
    },
    CheckForOnline: function () {
        if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.connected) {
            P5Chat.server.checkForOnlineContact(chatAgent.AdsId, chatAgent.ChatId).fail(function (e) {
                console.log(e);
            });
        }

        setTimeout(function () {
            if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.connected) {
                P5Chat.server.checkForOnlineContact(chatAgent.AdsId, chatAgent.ChatId).fail(function (e) {
                    console.log(e);
                });
            }
        }, 30000);


    },
    AutoMessageForInActiveVisitor: function (UserId, message, currentUrl) {
        P5Chat.server.sendInActiveAutoMessage(chatAgent.Name, chatAgent.AdsId, chatAgent.ChatId, UserId, message, currentUrl).fail(function (e) {
            console.log(e);
        });
    },
    RemoveAllMyOtherSession: function () {
        P5Chat.server.removeAllMySessionAgents().fail(function (e) {
            console.log(e);
        }).done(function () {
            chatUtil.StopConnection();

            setTimeout(function () { chatUtil.Start(); }, 400);
        });
        HidePageLoading();
    },
    IdleNotificationToVisitor: function (message) {
        if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.connected) {
            P5Chat.server.agentIdleNotificationToVisitor(chatAgent, message).fail(function (e) {
                console.log(e);
            });
        }
    },
    UpdateAgentName: function (name) {
        P5Chat.server.updateAgentName(chatAgent, name).fail(function (e) {
            console.log(e);
        });
    },
    GetAllOnlineAgents: function () {
        P5Chat.server.getAllOnlineAgents(chatAgent.UserId, chatAgent.AdsId, chatAgent.ChatId).fail(function (e) {
            console.log(e);
        });
    },
    GetVisitorDetails: function (visitor) {
        P5Chat.server.getVisitorDetails(visitor).fail(function (e) {
            console.log(e);
        });
    }
};

var chatHelper = {

    ReLogin: function () {
        chatUtil.StopConnection();
        ShowErrorMessage(GlobalErrorList.ChatRoomRoomAgents.SlowNetwork_Error);
        $("#dvContacts ul").empty();
        $("#dvContacts ul").append("<li id='novisitor'><div class='chatactvisitem'>Connecting ...</div></li>");
        setTimeout(function () {
            chatUtil.Start();
        }, 5000)
    },
    SelectedUser: function (toVisitorId) {
        $("#dvContacts ul li, .chatactvisItemwrp").removeClass("active");
        $("#" + toVisitorId + ", .chatactvisItemwrp").addClass("active");
        $("#spMesgNoti" + toVisitorId).html("").addClass("hideDiv");
        //$("#ulMesg").empty();
        //VisitorUnReadMessage[toVisitorId] = [];
        $('#P5txtChat').focus();
    },
    ShowTyping: function (visitor) {
        if (visitor.UserId == toVisitorId) {
            $("#dvTypingMesg").removeClass("hideDiv");
            setTimeout(function () { chatHelper.ClearChatTyping(); }, 4000);
        }
        else {
            $("#" + visitor.UserId + " .livechatusertype").addClass("hideDiv");
            $("#" + visitor.UserId + " .livechatusertype").removeClass("hideDiv");
            setTimeout(function () { $("#" + visitor.UserId + " .livechatusertype").addClass("hideDiv"); }, 4000);
        }
        chatHelper.ClearIdleStatus(visitor.UserId);
    },
    ClearChatTyping: function () {
        $("#dvTypingMesg").addClass("hideDiv");
    },
    ClearIdleStatus: function (visitorUserId) {
        if ($("#" + visitorUserId + " .chatactvisicn").find('i').hasClass('fa fa-circle idle')) {
            $("#" + visitorUserId + " .chatactvisicn").find('i').remove();
            $("#" + visitorUserId + " .chatactvisicn").append("<i class='fa fa-user-o'></i> <i class='fa fa-circle'></i>");
        }
    },
    AddToContactList: function (visitor) {

        $("#novisitor").hide();

        if ($("#" + visitor.UserId).length == 0) {
            var liList = "<li id='" + visitor.UserId + "'><div class='chatactvisitem' onclick='initiateChat(\"" + visitor.UserId + "\");'><div class='chatactviswrp'><div class='chatactvisicn'><i class='fa fa-user-o'></i>" +
                "<i class='fa fa-circle'></i></div><div class='chatactvisname'>" +
                "<h6>" + visitor.Name + "</h6><small>" + visitor.TrackIp + "</small>" +
                "<div class='livechatusertype hideDiv'><div class='lchat-three-bounce'><div class='lchat-child lchat-bounce1 bg-gray-800'></div><div class='lchat-child lchat-bounce2 bg-gray-800'></div><div class='lchat-child lchat-bounce3 bg-gray-800'></div></div></div>" +
                "</div></div><div class='chatactvissett'><div class='lvechatcount hideDiv' id='spMesgNoti" + visitor.UserId + "'></div><div class='tdcreatedraft'><div class='dropdown'>" +
                "<button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='icon ion-android-more-vertical mr-0'></i></button>" +
                "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='filterbycontacts'>" +
                "<a id='dv_Transcript' class='dropdown-item' data-toggle='modal' data-target='#chatmailtrans' href='javascript:void(0)' data-TranscriptId= \"" + visitor.UserId + "\"'>Mail Transcript</a>" +
                "<a id='dv_BanVisitor' class='dropdown-item banvisendchat' data-toggle='modal' data-target='#banvistormod' class='dropdown-item' href='javascript:void(0)' data-BanVisitorId= \"" + visitor.UserId + "\"'>Ban Visitor</a>" +
                "<a id='dv_TransferChat' data-toggle='modal' data-target='#chattransfer' class='dropdown-item'href='javascript:void(0)' data-TransferChatId= \"" + visitor.UserId + "\"'>TransferChat</a><div class='dropdown-divider'></div>" +
                "<a id='dv_EndChat' data-toggle='modal' data-target='#endchatvistormod' class='dropdown-item visendchat'href = 'javascript:void(0)' data-EndChatId= \"" + visitor.UserId + "\"'>End Chat</a></div></div></div></div></div></li>"


            $("#dvContacts ul").append(liList);

            //$("#ui_dvlivechatuser").removeClass("hideDiv");


            if (visitor.ContactId > 0 && (visitor.LeadType == 1 || visitor.LeadType == 0))
                $("#" + visitor.UserId + " .visitorimg").addClass("lead").attr("title", "Visitor is lead visitor");
            else if (visitor.ContactId > 0 && visitor.LeadType == 2)
                $("#" + visitor.UserId + " .visitorimg").addClass("customer").attr("title", "Visitor is Customer");
            else
                $("#" + visitor.UserId + " .visitorimg").addClass("unknown").attr("title", "Visitor is Unknown");


            if (toVisitorId && toVisitorId == visitor.UserId) {
                $("#" + visitor.UserId).addClass("active");
                VisitorUnReadMessage[visitor.UserId] = [];
            }
            else {
                var unReadMessage = chatHelper.GetUnReadMessageOfVisitor(visitor.UserId);
                if (unReadMessage != undefined && unReadMessage != null && unReadMessage.length > 0)
                    $('#spMesgNoti' + visitor.UserId).html(unReadMessage.length).removeClass("hideDiv");
            }
        }


        var IsTransferChat = false;
        if (visitor.IsTransferd == true) {
            IsTransferChat = true;
            visitor.IsTransferd = null;
        }
        if (VisitorFirstMessage[visitor.UserId] == undefined || VisitorFirstMessage[visitor.UserId] == null)
            VisitorFirstMessage[visitor.UserId] = true;

        if (AgentMsgSent[visitor.UserId] != undefined && AgentMsgSent[visitor.UserId] != null && AgentMsgSent[visitor.UserId] == true) {
            $('#spMesgNoti' + toVisitorId).removeClass("hideDiv");
            $('#spMesgNoti' + toVisitorId).find('i').remove();
            $('#spMesgNoti' + visitor.UserId).addClass("lvechatcountchked").append("<i class='icon ion-checkmark'></i>");
        }


        chatHelper.SetVisitorToList(visitor);
        chatHelper.SoundNotificatioOnVisitorConnected();
        chatHelper.UpdatePageFlowOfVisitor(visitor, IsTransferChat);
        chatHelper.GetPastChatOnConnect(visitor.UserId);
        chatHelper.GetPastEventOnConnect(visitor.UserId);
        AutoMessageEvent(visitor.UserId);
    },
    GetSettinFunctions: function (visitor) {
        var settings = "<label onclick='Transcript(\"" + visitor.UserId + "\");'>Transcript</label>" +
            "<label onclick='BanVisitor(\"" + visitor.UserId + "\");'>Ban Visitor</label>" +
            "<label onclick='EndChat(\"" + visitor.UserId + "\");'>End Chat</label>" +
            "<label onclick='TransferChat(\"" + visitor.UserId + "\");'>Transfer Chat</label>";

        if (visitor.EmailId && visitor.EmailId.length > 0)
            settings += "<label onclick='PushAddToContact(" + visitor.ContactId + ");'>Add to Group</label>";
        return settings;
    },
    AppendMessage: function (message, from) {

        message = message.replace("<", "&lt;").replace(">", "&gt;");

        if (from) {
            if (toVisitorId == from.UserId) {
                var isLeadClass = "unknowMesgStyle";
                if (from.LeadType == 1 || from.LeadType == 0) isLeadClass = "leadMesgStyle";
                else if (from.LeadType == 2) isLeadClass = "CustomerMesgStyle";
                $("#ulMesg").append("<div class='chatdatewrp text-center'><p class='chatdate'>" + GetTime("") + "</p></div><div class='media mb-4'><div class='media-body reverse'><div class='msgagent client'><p>" + linkifyHtml(message) + "</p></div></div><div class='chatuserimgwrp'></div></div>");
                chatHelper.ClearChatTyping();
                chatHelper.ScrollMessageDiv();
            }
            else {
                $("#spMesgNoti" + from.UserId).find('i').remove();
                $("#spMesgNoti" + from.UserId).removeClass("lvechatcountchked");
                var numberNoti = ($('#spMesgNoti' + from.UserId).length > 0 && $('#spMesgNoti' + from.UserId).html().length > 0) ? parseInt($('#spMesgNoti' + from.UserId).html()) : 0;
                $('#spMesgNoti' + from.UserId).html(++numberNoti).removeClass("hideDiv");
                chatHelper.UpdateUnReadMessageOfVisitor(from.UserId);
            }
            chatHelper.UpdateCurrentMessage(from.Name, message, 0, from.UserId);
            chatHelper.NotificationForVisitorMessage(from.Name, message, from.UserId);
            chatHelper.ClearIdleStatus(from.UserId);
            chatHelper.ChatMessagesFromPageUrls(from.UserId);
            VisitorFirstMessage[from.UserId] = false;
            $("#spMesgNoti" + from.UserId).find('i').remove();
            $("#spMesgNoti" + from.UserId).removeClass("lvechatcountchked");
            $('#spMesgNoti' + toVisitorId).addClass("hideDiv");
            AgentMsgSent[from.UserId] = false;
        }
        else {
            $("#ulMesg").append("<div class='chatdatewrp text-center'><p class='chatdate'>" + GetTime("") + "</p></div><div class='media mb-4'><div class='agentimgwrp'></div><div class='media-body'><div class='msgagent'><p>" + linkifyHtml(message) + "</p></div></div></div>");
            chatHelper.ScrollMessageDiv();
            chatHelper.UpdateCurrentMessage(chatAgent.Name, message, 1, toVisitorId);
            VisitorFirstMessage[toVisitorId] = false;
            $('#spMesgNoti' + toVisitorId).removeClass("hideDiv");
            $('#spMesgNoti' + toVisitorId).find('i').remove();
            $('#spMesgNoti' + toVisitorId).addClass("lvechatcountchked").append("<i class='icon ion-checkmark'></i>");
            AgentMsgSent[toVisitorId] = true;
        }
    },
    ScrollMessageDiv: function () {
        //var elm = document.getElementById("P5dvChat");
        //var heigtOfSlim = elm.scrollHeight + 'px';
        //$("#P5dvChat").slimScroll({ scroll: heigtOfSlim });
        $(".chatvismesboxbody").animate({ scrollTop: $(".chatvismesboxbody").get(0).scrollHeight }, 500);
    },
    EndVisitorChat: function (visitorId) {
        chatUtil.EndVisitorToday(visitorId);
    },
    BanVisitorChat: function (visitorId) {
        chatUtil.BanVisitorForEver(visitorId);
    },
    BindAgentForTransfer: function (allAgents, userInfoList) {
        $(".chatrransitemwrp").empty();
        if (allAgents && allAgents.length > 0) {
            for (var i = 0; i < allAgents.length; i++) {

                var EmployeeCode = "NA";

                if (userInfoList != null && userInfoList.length > 0) {
                    var sample = JSLINQ(userInfoList).Where(function () { return (this.UserId == allAgents[i].UserId); });

                    if (sample.items[0] != undefined && (sample.items[0].EmployeeCode != null && sample.items[0].EmployeeCode != ""))
                        EmployeeCode = sample.items[0].EmployeeCode;
                }

                $(".chatrransitemwrp").append("<li> <a><div class='chattransviswrp'><div class='headicn'><i class='fa fa-headphones'></i></div><div class='chatnamcodwrp'><h6>" + allAgents[i].Name + "</h6><small>" + EmployeeCode + "</small></div></div><button type='button' class='btn btn-second transferbtn' onclick='TransferIsAuthenticated(" + allAgents[i].UserId + ");'>Transfer</button></a></li>");
            }
        }
        else {
            $(".chatrransitemwrp").append("<li><a><div class='chattransviswrp'><div class='headicn'></div><div class='chatnamcodwrp'><h6> No agents are available online</h6></div></div></a></li>");
        }
    },


    AcceptChatTransfer: function (fromAgent, visitor, reason, currentVisitorPath) {
        if (TransferStatus) {
            chatUtil.ChatTransferAgentBusy(fromAgent.UserId, visitor.UserId);
        }
        else {
            TransferStatus = true;
            VisitorsPath[visitor.UserId] = JSON.parse(currentVisitorPath);
            // $(".ChatTransferbgShadedDiv").show();
            $("#dvAcceptTransferChat").modal('show');
            $("#ui_lblAcceptTransferVisitorName").html("( " + visitor.Name + " )");
            $("#ui_lblTransferCameFrom").html(fromAgent.Name);
            $("#ui_dvReasonSentByChatAgent").html(reason);
            $("#ui_btnAcceptTransferCall, #ui_btnRejectTransferCall").attr("agentId", fromAgent.UserId).attr("visitorId", visitor.UserId);
        }
    },
    BindVisitorDetails: function () {
        var visitor = chatHelper.GetVisitorFromList(toVisitorId);
        $("#visitorid,#pastchatvisitorid").html(visitor.Name);
        $("#visitorip,#pastchatvisitorip").html(visitor.TrackIp);

        var pageFlow = chatHelper.GetPageFlowOfVisitor(toVisitorId);
        if (visitor) {
            //$("#ui_visitorDetails").html("<li><span style='width:100px;display: inline-block;'>Name</span><span  id='ui_spanCurrentVisitorName'>" + visitor.Name + "</span></li>");
            //$("#ui_visitorDetails").append("<li><span style='width:100px;display: inline-block;' >Email-ID</span><span id='ui_spanCurrentVisitorEmailId'>" + visitor.EmailId + "</span></li>");
            $("#ui_dvvisitorDetails_Nodata").addClass("hideDiv");
            $(".chatvisitdetwrp").removeClass("hideDiv");
            $("#ui_Location").html(visitor.City != "" ? visitor.City : "NA");
            $("#ui_State").html(visitor.State != "" ? visitor.State : "NA");
            $("#ui_Country").html(visitor.Country != "" ? visitor.Country : "NA");
            $("#ui_Platform").html(visitor.Platform != "" ? visitor.Platform : "NA");
            $("#ui_Browser").html(visitor.Browser != "" ? visitor.Browser : "NA");
            $("#ui_IPAddress").html(visitor.TrackIp != "" ? visitor.TrackIp : "NA");
            $("#ui_ChatLoaded").html(visitor.TotalChatCountSessionWise);
            $("#ui_ChatInitiated").html(visitor.ChatRepeatTime);
            $("#ui_SiteVisits").html(visitor.NoOfSession);

            var TimeInSite = "00h 00m 00s";
            if (visitor.OverAllTimeSpentInSiteInSec > 0) {
                var seconds = visitor.OverAllTimeSpentInSiteInSec;
                var hours = Math.floor(seconds / 3600);
                seconds = seconds % 3600;
                var minutes = Math.floor(seconds / 60);
                seconds = seconds % 60;
                TimeInSite = ((hours < 10) ? "0" + hours : hours) + "h " + ((minutes < 10) ? "0" + minutes : minutes) + "m " + ((seconds < 10) ? "0" + seconds : seconds) + "s";
            }
            $("#ui_TimeonSite").html(TimeInSite);
            var TimeInChat = "00h 00m 00s";
            if (visitor.OverAllTimeSpentInChatInSec > 0) {
                var seconds = visitor.OverAllTimeSpentInChatInSec;
                var hours = Math.floor(seconds / 3600);
                seconds = seconds % 3600;
                var minutes = Math.floor(seconds / 60);
                seconds = seconds % 60;
                TimeInChat = ((hours < 10) ? "0" + hours : hours) + "h " + ((minutes < 10) ? "0" + minutes : minutes) + "m " + ((seconds < 10) ? "0" + seconds : seconds) + "s";
            }
            $("#ui_TimeonChat").html(TimeInChat);
            $("#ui_PageVisits").html(visitor.NumOfPageVisited);
            $("#ui_LastPage").html(pageFlow != "" ? pageFlow[pageFlow.length - 1] : "NA");
            $("#ui_Source").html(visitor.RefferDomain != null ? visitor.RefferDomain : "NA");

            $("#ui_txtVisitorsNote").html(visitor.Comments);
            $("#ui_txtVisitorName").html(visitor.Name);
            $("#ui_txtVisitorContactMailId").html(visitor.EmailId);
            $("#ui_txtVisitorContactNumber").html(visitor.ContactNumber);

            $("#ui_aClickStreamPage").attr("href", "javascript:ContactInfo('" + toVisitorId + "','0');");

            $("#ui_VisitorPath").empty();
            for (var i = 0; i < pageFlow.length; i++) {
                chatHelper.VisitorPathAppend(pageFlow[i]);
            }

            var messageDetails = PastMessageDetails[toVisitorId];
            $("#ui_dvpastchat_Nodata").addClass("hideDiv");
            $("#ui_dvpastchat").removeClass("hideDiv");
            $("#ulMesgPastMesg").html('<div class="no-data">Past Chat are not available for selected visitor</div>');

            if (messageDetails != undefined && messageDetails.Name.length > 0) {
                $("#ulMesgPastMesg").empty();
                $("#ui_dvpasthatuser").removeClass("hideDiv");
                for (var i = 0; i < messageDetails.Name.length; i++) {
                    var isAgentClass = "";
                    var datevalues = GetTime(messageDetails.ChatDate[i]);
                    if (messageDetails.IsAgent[i] == 1) {
                        $("#ulMesgPastMesg").append("<div class='chatdatewrp text-center'><p class='chatdate'>" + datevalues + "</p></div><div class='media mb-4'><div class='agentimgwrp'></div><div class='media-body'><div class='msgagent'><p>" + linkifyHtml(messageDetails.ChatText[i].replace("<", "&lt;").replace(">", "&gt;")) + "</p></div></div></div>");

                    }
                    else {
                        if (visitor.LeadType == 1 || visitor.LeadType == 0) isAgentClass = "leadMesgStyle";
                        else if (visitor.LeadType == 2) isAgentClass = "CustomerMesgStyle";
                        else isAgentClass = "unknowMesgStyle";
                        $("#ulMesgPastMesg").append("<div class='chatdatewrp text-center'><p class='chatdate'>" + datevalues + "</p></div><div class='media mb-4'><div class='media-body reverse'><div class='msgagent client'><p>" + linkifyHtml(messageDetails.ChatText[i].replace("<", "&lt;").replace(">", "&gt;")) + "</p></div></div><div class='chatuserimgwrp'></div></div>");
                    }
                }
            }

            var bannerEvent = EventOfVisitor[toVisitorId];
            if (bannerEvent != undefined && bannerEvent.length > 0) {
                $("#ui_tbodyBannerData").empty();
                for (var i = 0; i < bannerEvent.length; i++) {
                    var BannerContent = bannerEvent[i].Url;
                    var BannerTitle = bannerEvent[i].BannerTitle;
                    var ChatBannerId = bannerEvent[i].ChatBannerId;
                    var TotalSent = bannerEvent[i].TotalSent;
                    var TotalClicked = bannerEvent[i].TotalClicked;

                    var extension = "NA";
                    var fileName = "NA";
                    if (BannerContent != undefined && BannerContent != null && BannerContent.length > 0) {
                        extension = BannerContent.split('.').pop().split(/\#|\?/)[0].toLowerCase();
                        fileName = BannerContent.substring(BannerContent.lastIndexOf('/') + 1, BannerContent.length);
                        if (fileName.indexOf("?") > -1)
                            fileName = fileName.substring(0, fileName.indexOf("?"));
                    } else {
                        BannerContent = "NA";
                    }

                    if (BannerTitle == undefined || BannerTitle == null || BannerTitle.length == 0) {
                        BannerTitle = "NA";
                    }

                    var BannerPreview = '/Content/images/no-preview-img.jpg'

                    if (extension != "NA" && extension == 'pdf') {
                        BannerPreview = '/Content/images/pdf-img.jpg'
                    } else if (extension != "NA") {
                        BannerPreview = BannerContent;
                    }

                    content = `<tr id="ui_trEachBannerReport_${ChatBannerId}">
                                <td class="text-center">
                                <i class="icon ion-ios-eye-outline popovercsshvr">
                                    <div class="brwsnotfarrw">
                                        <div class="arrow_box">
                                            <div class="chatbanwrp" style="background-image: url('${BannerPreview}');">
                                            </div>
                                        </div>
                                    </div>
                                </i>
                            </td>
                            <td class="text-left" title="${BannerContent}">${BannerTitle}</td>
                            <td>${TotalSent}</td>
                            <td>${TotalClicked}</td>
                            </tr>`;
                    $("#ui_tbodyBannerData").append(content);
                    $(".chatbanrep").removeClass("hideDiv");
                    $("#ui_dvbannernodata").addClass("hideDiv");
                }
            }

            messageDetails = visitor.Messages;
            if (messageDetails != undefined) {
                $("#ulMesg").empty();
                $("#ui_dvlivechatuser").removeClass("hideDiv");
                for (var i = 0; i < messageDetails.Name.length; i++) {
                    if (IsTodayDate(messageDetails.ChatDate[i])) {
                        var isAgentClass = "";
                        var datevalues = GetTime(messageDetails.ChatDate[i]);
                        if (messageDetails.IsAgent[i] == 1) {
                            $("#ulMesg").append("<div class='chatdatewrp text-center'><p class='chatdate'>" + datevalues + "</p></div><div class='media mb-4'><div class='agentimgwrp'></div><div class='media-body'><div class='msgagent'><p>" + linkifyHtml(messageDetails.ChatText[i].replace("<", "&lt;").replace(">", "&gt;")) + "</p></div></div></div>");
                        }
                        else {
                            $("#ulMesg").append("<div class='chatdatewrp text-center'><p class='chatdate'>" + datevalues + "</p></div><div class='media mb-4'><div class='media-body reverse'><div class='msgagent client'><p>" + linkifyHtml(messageDetails.ChatText[i].replace("<", "&lt;").replace(">", "&gt;")) + "</p></div></div><div class='chatuserimgwrp'></div></div>");
                        }


                        //$("#ulMesg").append("<li><span class='" + isAgentClass + "'>" + messageDetails.Name[i] + "</span> : " + linkifyHtml(messageDetails.ChatText[i].replace("<", "&lt;").replace(">", "&gt;")) + "<span class='chatmesgDate'>" + datevalues + "</span></li>");
                    }
                }
            }



            chatHelper.ScrollMessageDiv();

            //Get Other Contact Details
            if (visitor.ContactId > 0) {
                $.ajax({
                    url: "/Chat/ChatRoom/GetContactDetails",
                    type: 'POST',
                    data: JSON.stringify({ 'ContactId': visitor.ContactId }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: chatHelper.BindVisitorContactDetails,
                    error: ShowAjaxError
                });
            }
            else {
                $("#ui_lnkEditContact").addClass("tdHide");
                $("#ui_divContactDetails").hide();
            }
        }
    },
    BindVisitorContactDetails: function (response) {

        $("#ui_lnkEditContact").removeClass("tdHide");

        if (response.Name != null && response.Name.length > 0)
            $("#ui_txtVisitorName").val(response.Name);
        if (response.EmailId != null && response.EmailId.length > 0)
            $("#ui_txtVisitorContactMailId").val(response.EmailId);
        if (response.PhoneNumber != null && response.PhoneNumber.length > 0)
            $("#ui_txtVisitorContactNumber").val(response.PhoneNumber);

        var AlternateEmailIds = " ";
        if (response.AlternateEmailIds != null && response.AlternateEmailIds.length > 20) {
            AlternateEmailIds = response.AlternateEmailIds.substring(0, 20) + "..";
        }
        else if (response.AlternateEmailIds != null) {
            AlternateEmailIds = response.AlternateEmailIds;
        }

        var AlternatePhoneNumbers = " ";
        if (response.AlternatePhoneNumbers != null && response.AlternatePhoneNumbers.length > 20) {
            AlternatePhoneNumbers = response.AlternatePhoneNumbers.substring(0, 20) + "..";
        }
        else if (response.AlternatePhoneNumbers != null) {
            AlternatePhoneNumbers = response.AlternatePhoneNumbers;
        }
        $("#ui_divContactDetails").show();
        $("#ui_ulContactDetails").html("<li><span style='width:100px;display: inline-block;font-weight: bold'>Alternate (E)</span><span title='" + response.AlternateEmailIds + "'>" + AlternateEmailIds + "</span></li>");
        $("#ui_ulContactDetails").append("<li><span style='width:100px;display: inline-block;font-weight: bold'>Alternate (P)</span><span title='" + response.AlternatePhoneNumbers + "'>" + AlternatePhoneNumbers + "</span></li>");
        //$("#ui_ulContactDetails").append("<li><span style='width:100px;display: inline-block;font-weight: bold'>FacebookUrl</span><span>" + (response.FacebookUrl == null ? " " : response.FacebookUrl) + "</span></li>");
        //$("#ui_ulContactDetails").append("<li><span style='width:100px;display: inline-block;font-weight: bold'>TwitterUrl</span><span>" + (response.TwitterUrl == null ? " " : response.TwitterUrl) + "</span></li>");
        //$("#ui_ulContactDetails").append("<li><span style='width:100px;display: inline-block;font-weight: bold'>LinkedinUrl</span><span>" + (response.LinkedinUrl == null ? " " : response.LinkedinUrl) + "</span></li>");
        //$("#ui_ulContactDetails").append("<li><span style='width:100px;display: inline-block;font-weight: bold'>GoogleplusUrl</span><span>" + (response.GoogleplusUrl == null ? " " : response.GoogleplusUrl) + "</span></li>");
        $("#ui_ulContactDetails").append("<li><span style='width:100px;display: inline-block;font-weight: bold'>Gender</span><span>" + (response.Gender == null ? " " : response.Gender) + "</span></li>");
        $("#ui_ulContactDetails").append("<li><span style='width:100px;display: inline-block;font-weight: bold'>Age</span><span>" + (response.AgeRange == null ? " " : response.AgeRange) + "</span></li>");
        $("#ui_ulContactDetails").append("<li><span style='width:100px;display: inline-block;font-weight: bold'>MaritalStatus</span><span>" + (response.MaritalStatus == null ? " " : response.MaritalStatus) + "</span></li>");
        $("#ui_ulContactDetails").append("<li><span style='width:100px;display: inline-block;font-weight: bold'>Education</span><span>" + (response.Education == null ? " " : response.Education) + "</span></li>");
        $("#ui_ulContactDetails").append("<li><span style='width:100px;display: inline-block;font-weight: bold'>Occupation</span><span>" + (response.Occupation == null ? " " : response.Occupation) + "</span></li>");

        if (CustomFields.length > 0) {
            for (var i = 0; i < CustomFields.length; i++) {
                $("#ui_ulContactDetails").append("<li><span style='width:100px;display: inline-block;font-weight: bold'>" + CustomFields[i] + "</span><span>" + (response["CustomField" + (i + 1)] == null ? " " : response["CustomField" + (i + 1)]) + "</span></li>");
            }
        }
        $("#ui_lnkEditContact").prop('href', '/Chat/UpdateContactDetails?ContactId=' + response.ContactId + '');
    },
    UpdateCurrentMessage: function (fromName, message, isAgent, currentUserId) {

        var visitorDetails = chatHelper.GetVisitorFromList(currentUserId);

        if (visitorDetails.Messages == undefined) {
            visitorDetails.Messages = new Object();
            visitorDetails.Messages.Name = [];
            visitorDetails.Messages.ChatText = [];
            visitorDetails.Messages.ChatDate = [];
            visitorDetails.Messages.IsAgent = [];
        }

        if (visitorDetails != undefined && visitorDetails.Messages != undefined) {
            visitorDetails.Messages.Name.push(fromName);
            visitorDetails.Messages.ChatText.push(message);
            visitorDetails.Messages.ChatDate.push(GetTodayDateTime());
            visitorDetails.Messages.IsAgent.push(isAgent);
            VisitorsList[currentUserId] = visitorDetails;
        }
    },
    ChatMessagesFromPageUrls: function (UserId) {

        var urlList = chatHelper.GetPageFlowOfVisitor(UserId);
        if (urlList != undefined && urlList.length > 0 && urlList[urlList.length - 1] != undefined) {
            CheckForSendingAutoMessage(UserId, null, null, urlList[urlList.length - 1], false);
        }
    },
    VisitorPathAppend: function (pageUrl) {
        var customPageUrl = "";
        if (pageUrl.length > 35) {
            customPageUrl = pageUrl.substring(0, 35) + "...";
        }
        else {
            customPageUrl = pageUrl;
        }
        $("#ui_VisitorPath").append("<li><img src='/images/img_trans.gif' alt='next' class='SortImage' /> <a href='" + pageUrl + "' target='_blank' title='" + pageUrl + "'>" + customPageUrl + "</a></span>");
    },
    GetVisitorFromList: function (visitorId) {
        return VisitorsList[visitorId];
    },
    SetVisitorToList: function (visitor) {
        VisitorsList[visitor.UserId] = visitor;
    },
    UpdatePageFlowOfVisitor: function (visitor, IsTransferChat) {
        var pageFlow = VisitorsPath[visitor.UserId];

        if (!pageFlow)
            pageFlow = new Array();
        if (!IsTransferChat)
            pageFlow.push(visitor.PageUrl);
        VisitorsPath[visitor.UserId] = pageFlow;
        if (toVisitorId == visitor.UserId) {
            if (!IsTransferChat || pageFlow.length == 0)
                chatHelper.VisitorPathAppend(visitor.PageUrl);
        }
    },
    GetPageFlowOfVisitor: function (visitorId) {
        return VisitorsPath[visitorId];
    },
    UpdateUnReadMessageOfVisitor: function (visitorId) {
        var unReadMessage = VisitorUnReadMessage[visitorId];
        if (unReadMessage == undefined || unReadMessage == null || unReadMessage.length == 0) {
            unReadMessage = new Array();
        }
        unReadMessage.push(1);
        VisitorUnReadMessage[visitorId] = unReadMessage;
    },
    GetUnReadMessageOfVisitor: function (visitorId) {
        return VisitorUnReadMessage[visitorId];
    },
    RemoveVisitorAction: function (visitor) {
        $("#" + visitor.UserId).remove();

        //for (var i = 0; i < VisitorsList.length; i++) {
        //    if (VisitorsList[i].UserId == visitor.UserId) {
        //        VisitorsList = VisitorsList.splice(i, 1);
        //        break;
        //    }
        //}

        if (VisitorsList != undefined && Array.visitorsLength(VisitorsList) > 0) {
            delete VisitorsList[visitor.UserId];
        }
        if (Array.visitorsLength(VisitorsList) <= 0) {
            $("#dvContacts ul").empty();
            $("#dvContacts ul").append("<li id='novisitor'><div class='chatactvisitem'>There are no Visitors on Your Website</div></li>");
        }


        setTimeout(function () {
            if (toVisitorId == visitor.UserId && $("#" + visitor.UserId).length == 0) {
                //$(".visitorAnalyticsInfo").removeClass("active");
                toVisitorId = "0";
                $("#ui_dvlivechatuser").addClass("hideDiv");
                $("#ui_dvpasthatuser").addClass("hideDiv");
                $("#ulMesg div").remove();
                $("#ui_dvpastchat_Nodata").removeClass("hideDiv");
                $("#ui_dvpastchat").addClass("hideDiv");
                $("#ui_tbodyBannerData").empty();
                chatRoomUtil.ClearVisitorDetails();
            }
        }, 1000);
    },
    BannerActionsByVisitor: function (banner, action, chatBannerId, bannerTitle, redirectUrl) {
        var bannerEvent = EventOfVisitor[toVisitorId];
        var EventFound = false;
        var EventTotalSent = 0;
        var EventTotalClicked = 0;
        if (bannerEvent == undefined || bannerEvent == null) {
            bannerEvent = new Array();
            EventFound = false;
        } else {
            for (var i = 0; i < bannerEvent.length; i++) {
                if (bannerEvent[i].ChatBannerId == chatBannerId) {
                    EventTotalSent = bannerEvent[i].TotalSent;
                    EventTotalClicked = bannerEvent[i].TotalClicked;
                    if (action == 0) {
                        bannerEvent[i].TotalSent = bannerEvent[i].TotalSent + 1;
                        EventTotalSent = bannerEvent[i].TotalSent;
                    } else if (action == 1) {
                        bannerEvent[i].TotalClicked = bannerEvent[i].TotalClicked + 1;
                        EventTotalClicked = bannerEvent[i].TotalClicked;
                    }
                    EventFound = true;
                    break;
                }
            }
        }

        $(".chatbanrep").removeClass("hideDiv");
        $("#ui_dvbannernodata").addClass("hideDiv");

        if (EventFound) {
            EventOfVisitor[toVisitorId] = bannerEvent;

            $("#ui_trEachBannerReport_" + chatBannerId + " td:nth-child(3)").html(EventTotalSent);
            $("#ui_trEachBannerReport_" + chatBannerId + " td:nth-child(4)").html(EventTotalClicked);

        } else {
            var bannerEventData = { ChatUserId: toVisitorId, ChatBannerId: chatBannerId, Url: banner, BannerTitle: bannerTitle, RedirectUrl: redirectUrl, TotalSent: 0, TotalClicked: 0 };

            if (action == 0) {
                bannerEventData.TotalSent = 1;
                EventTotalSent = 1;
            } else if (action == 1) {
                bannerEventData.TotalClicked = 1;
                EventTotalClicked = 1;
            }
            bannerEvent.push(bannerEventData);
            EventOfVisitor[toVisitorId] = bannerEvent;

            var extension = banner.split('.').pop().split(/\#|\?/)[0].toLowerCase();
            var fileName = banner.substring(banner.lastIndexOf('/') + 1, banner.length);
            if (fileName.indexOf("?") > -1)
                fileName = fileName.substring(0, fileName.indexOf("?"));

            var BannerPreview = banner;
            if (extension == 'pdf') {
                BannerPreview = '/Content/images/pdf-img.jpg'
            }

            var content = `<tr id="ui_trEachBannerReport_${chatBannerId}">
                                <td class="text-center">
                                <i class="icon ion-ios-eye-outline popovercsshvr">
                                    <div class="brwsnotfarrw">
                                        <div class="arrow_box">
                                            <div class="chatbanwrp" style="background-image: url('${BannerPreview}');">
                                            </div>
                                        </div>
                                    </div>
                                </i>
                            </td>
                            <td class="text-left" title="${banner}">${bannerTitle}</td>
                            <td>${EventTotalSent}</td>
                            <td>${EventTotalClicked}</td>
                            </tr>`;
            $("#ui_tbodyBannerData").append(content);
            $(".chatbanrep").removeClass("hideDiv");
            $("#ui_dvbannernodata").addClass("hideDiv");
        }
    },
    SendDesktopNotification: function (title, details) {
        if (window.webkitNotifications && navigator.userAgent.indexOf("Chrome") > -1) {
            if (webkitNotifications.checkPermission() == 0) {
                var n = webkitNotifications.createNotification('images/P5.jpg', title, details);
                n.show();
            }
        } else if (window.Notification) {
            if (typeof window.Notification.permissionLevel === 'function') {
                if (Notification.permissionLevel() === 'granted') {
                    var notification = new Notification(title, { 'body': details });
                    notification.onclick = function () {
                        window.focus();
                        this.cancel();
                    };
                    notification.show()
                }
            }
            else if (window.Notification.permission) {
                if (Notification.permission === 'granted') {
                    new Notification(title, { 'body': details });
                }
            }
        }
    },
    RequestDesktopPermission: function () {
        if (window.webkitNotifications && navigator.userAgent.indexOf("Chrome") > -1) {
            if (webkitNotifications.checkPermission() == 1)
                webkitNotifications.requestPermission();
        } else if (window.Notification) {
            if (typeof window.Notification.permissionLevel === 'function') {
                if (Notification.permissionLevel() === 'default')
                    Notification.requestPermission(function () { chatHelper.SendDesktopNotification(chatAgent.Name, "You have activated desktop notification"); });
            }
            else if (window.Notification.permission)
                Notification.requestPermission(function () { chatHelper.SendDesktopNotification(chatAgent.Name, "You have activated desktop notification"); });
        }
    },
    CheckDesktopPermission: function () {
        var permissionValue = "";
        if (window.webkitNotifications && navigator.userAgent.indexOf("Chrome") > -1) {
            if (webkitNotifications.checkPermission() == 1)
                permissionValue = webkitNotifications.requestPermission();
        } else if (window.Notification) {
            if (typeof window.Notification.permissionLevel === 'function') {
                permissionValue = Notification.permissionLevel();
            }
            else if (window.Notification.permission)
                permissionValue = Notification.permission;
        }

        if (permissionValue == "granted" || permissionValue == "1")
            return true;
        return false;
    },
    GetPastChatOnConnect: function (visitorId) {
        if (PastMessageDetails[visitorId] == undefined) {
            GetPastChatMessage(visitorId);
        }
    },
    GetPastEventOnConnect: function (visitorId) {
        GetPastEvents(visitorId);
    },
    NotificationForVisitorMessage: function (name, message, fromUserId) {
        var visitor = chatHelper.GetVisitorFromList(fromUserId);
        if (chatHelper.CheckDesktopPermission()) {
            if (!parent.window.document.hasFocus()) {
                if (DesktopNotifyForNewVisitor == 2 && visitor.Messages != undefined && visitor.Messages.ChatDate.length > 0 && VisitorFirstMessage[fromUserId])
                    chatHelper.SendDesktopNotification(name, message);
                else if (DesktopNotifyForNewVisitor == 1)
                    chatHelper.SendDesktopNotification(name, message);
            }
        }

        if (SoundNotify && SoundNotify.length > 1) {
            if (window.HTMLAudioElement) {
                try {
                    var oAudio = document.getElementById('ui_playAudio');
                    oAudio.src = "../images/Audio/" + SoundNotify + "";
                    oAudio.play();
                }
                catch (err) {
                    if (window.console) {
                        window.console.log(err);
                    }
                }
            }
        }

        if (SoundNewVisitorNotify && SoundNewVisitorNotify.length > 1 && visitor.Messages != undefined && visitor.Messages.ChatDate.length > 0 && VisitorFirstMessage[fromUserId]) {
            if (window.HTMLAudioElement) {
                try {
                    var oAudio = document.getElementById('ui_playAudio');
                    oAudio.src = "../images/Audio/" + SoundNewVisitorNotify + "";
                    oAudio.play();
                }
                catch (err) {
                    if (window.console) {
                        window.console.log(err);
                    }
                }
            }
        }
    },
    CheckOnlineVisitorsForEveryThirtySec: function () {
        setInterval(function () {
            if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.connected) {
                if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.connected && Array.visitorsLength(VisitorsList) > 0)
                    chatUtil.CheckForOnline();
            }
            else {
                chatUtil.Start();
            }
        }, 300000);// 5 min
    },
    FirstVisitorNotification: function () {

        var anySound = SoundNewVisitorNotify != undefined && SoundNewVisitorNotify.length > 0 ? SoundNewVisitorNotify : (SoundNotify != undefined && SoundNotify.length > 0) ? SoundNotify : "";

        if (anySound.length > 1) {

            try {
                var oAudio = document.getElementById('ui_playAudio');
                oAudio.src = "../images/Audio/" + anySound + "";
                oAudio.play();
            }
            catch (err) {
                if (window.console) {
                    window.console.log(err);
                }
            }
        }
    },
    SoundNotificatioOnVisitorConnected: function () {
        if (SoundNotificationOnVisitorConnect && SoundNotificationOnVisitorConnect.length > 1) {
            if (window.HTMLAudioElement) {
                try {
                    var oAudio = document.getElementById('ui_playAudio');
                    oAudio.src = "../images/Audio/" + SoundNotificationOnVisitorConnect + "";
                    oAudio.play();
                }
                catch (e) {
                    if (window.console && console.error("Error:" + e));
                }
            }
        }
    },
    BindOnlineAgents: function (allAgents) {
        //$(".ulOnlineAgentList").html("<li class='headerstyle'><span style='width: 50%;text-align: left;float:left;'>Name</span><span style='width: 25%;text-align: left;float:left;'>Visitor/Max</span></li>").show();
        $("#ui_divActiveAgents ul").empty();
        if (allAgents && allAgents.length > 0) {
            for (var i = 0; i < allAgents.length; i++) {
                var interactionMemberLength = allAgents[i].IntractionMembers != null ? allAgents[i].IntractionMembers.length : 0;
                $("#ui_divActiveAgents ul").append("<li><div class='media p-2'><div class='chatagentphoto'></div><div class='media-body mt-1'><h6 class='m-0 chatagntname'>" + allAgents[i].Name + "</h6><small class='agntcode'>" + interactionMemberLength + "/" + allAgents[i].MaxIntractionCount + "</small></div></div></li>");
            }
        }
        else {
            $("#ui_divActiveAgents ul").empty();
            $("#ui_divActiveAgents ul").append("<li><div class='media p-2'><div></div><div class='media-body mt-1'><h6 class='m-0 chatagntname'></h6><small class='agntcode'> No agents are available online.</small></div></div></li>");
        }
    },

    UpdateAgentOnline: function () {
        if (ShowIfAgentOnline == true) {
            $.ajax({
                url: "/Chat/ChatRoom/UpdateAgentOnline",
                type: 'POST',
                data: JSON.stringify({ 'ChatId': chatAgent.ChatId, IsOnline: true }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {

                },
                error: ShowAjaxError
            });
        }
    }
};

chatUtil.InitializeChat();
setTimeout(function () { chatUtil.SignalRFunctions(); }, 100);
function ChatStartFromAgent() {

    chatUtil.Start();
    setTimeout(function () {
        $("#ui_SignOutOption").removeClass("hideDiv");
    }, 2000);
}

$('#P5txtChat').keypress(function (e) {

    if (toVisitorId != "0" && toVisitorId.length > 2)
        if ($.trim($(this).val()).length % 10 == 0) {
            chatUtil.TypingEvent();
        }
    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
        var message = $.trim($(this).val());
        if (message.length > 0 && toVisitorId != "0") {
            $(this).val("");
            chatUtil.SendMessage(message);
        }
        else {
            ShowErrorMessage(GlobalErrorList.ChatRoomRoomAgents.SelectVisitor_Error);
        }
        return false;
    }
});




$("#ui_btnSend").click(function () {

    if (toVisitorId != "0") {
        var message = $('#P5txtChat').val();

        if (message.length > 0) {
            $('#P5txtChat').val("").change();
            chatUtil.SendMessage(message);
        }
        else {
            ShowErrorMessage(GlobalErrorList.ChatRoomRoomAgents.EnterMessage_Error);
        }
    }
    else {
        ShowErrorMessage(GlobalErrorList.ChatRoomRoomAgents.SelectVisitor_Error);
    }
});




function initiateChat(visitorId) {
    toVisitorId = visitorId;
    chatRoomUtil.ClearVisitorDetails();
    chatHelper.SelectedUser(visitorId);
    chatHelper.BindVisitorDetails();
}


TransferIsAuthenticated = function (agentId) {
    let getlvechatusername = $("#ui_btnTransfer").attr("visitorname").toString();
    $("#chattransfer .modal-title").html(
        "Transfer Chat of Visitor (" + getlvechatusername + ")"
    );
    $(".chattranviswrp").addClass("hideDiv");
    $(".lvechattransfrm").removeClass("hideDiv");
    $("#ui_btnTransfer").removeClass("hideDiv");
    $("#ui_btnTransfer").attr("agentId", agentId);
};

$("#ui_btnTransfer").click(function () {
    if ($.trim($("#ui_txtReasonForTransfer").val()).length > 0) {
        var reason = $("#ui_txtReasonForTransfer").val();
        var agentId = $("#ui_btnTransfer").attr("agentId");
        var visitorId = $("#ui_btnTransfer").attr("visitorId").toString();
        chatUtil.TransferChat(agentId, visitorId, reason);

        chatRoomUtil.CloseChatTransferPopUp();
    }
    else {
        ShowErrorMessage(GlobalErrorList.ChatRoomRoomAgents.ChatTransferReason_Error);

    }
});

$("#ui_btnAcceptTransferCall").click(function () {
    var agentId = $(this).attr("agentId");
    var visitorId = $(this).attr("visitorId");
    chatUtil.AcceptChatTransfer(agentId, visitorId);

    $(this).removeAttr("agentId");
    $(this).removeAttr("visitorId");
    chatRoomUtil.CloseAcceptTransferPopUp();
});

$("#ui_btnRejectTransferCall").click(function () {
    var agentId = $(this).attr("agentId");
    var visitorId = $(this).attr("visitorId");
    chatUtil.RejectChatTransfer(agentId, visitorId);
    $(this).removeAttr("agentId");
    $(this).removeAttr("visitorId");
    chatRoomUtil.CloseAcceptTransferPopUp();
});

function GetTime(Strdate) {

    var today = new Date();
    var dd = today.getDate();
    var mmo = today.getMonth() + 1;
    var yy = today.getFullYear();

    var todayDate;
    if (Strdate instanceof Date)
        todayDate = Strdate;
    else if ((Strdate.indexOf("/") > -1) || (Strdate.indexOf("T") > 0))
        todayDate = new GetJavaScriptDateObj(Strdate);
    else if ((Strdate.indexOf(" ") > 0))
        todayDate = new Date(Strdate);
    else
        todayDate = new Date();

    var hh = "";
    var tt = " AM";
    if (todayDate.getHours() >= 12) {
        var localHour = todayDate.getHours();
        if (todayDate.getHours() > 12)
            localHour = (todayDate.getHours() - 12);
        hh = (localHour < 10) ? "0" + localHour : localHour;
        tt = " PM";
    }
    else {
        hh = (todayDate.getHours() < 10) ? "0" + todayDate.getHours() : todayDate.getHours();
    }

    var mm = (todayDate.getMinutes() < 10) ? "0" + todayDate.getMinutes() : todayDate.getMinutes();

    if (dd == todayDate.getDate() && mmo == (todayDate.getMonth() + 1) && yy == todayDate.getFullYear()) {
        return hh + ":" + mm + tt;
    }

    var oldDate = todayDate.toString().split(":");
    oldDate = oldDate[0].toString().substring(0, oldDate[0].toString().length - 2);

    return oldDate + " " + hh + ":" + mm + tt;

}

//function GetJavaScriptDateObj(dateString) {
//    var dbDate;
//    if (dateString.indexOf("/") > -1) {
//        var pattern = /Date\(([^)]+)\)/;
//        var results = pattern.exec(dateString);
//        var dt = new Date(parseFloat(results[1]));
//        return dt;
//    }

//    else {
//        if (dateString.indexOf("T") > -1) {
//            dbDate = dateString.split('T');
//        }
//        else if (dateString.indexOf(" ") > -1) {
//            dbDate = dateString.split(' ');
//        }
//        var year = dbDate[0].split('-');
//        var time = dbDate[1].split(':');

//        var milSec = [];
//        if (time[2].toString().indexOf(".") > 0) {
//            milSec = time[2].split('.');
//        } else if (time[2].toString().indexOf("+") > 0) {
//            milSec = time[2].split('+');
//        }
//        else {
//            milSec.push(time[2]);
//        }
//        var createDate = new Date(year[0], year[1] - 1, year[2], time[0], time[1], milSec[0]);
//        return createDate;
//    }
//}

Array.visitorsLength = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function AutoMessageEvent(UserId) {

    for (var a = 0; a < messageList.length; a++) {
        var Min = parseInt($.trim(messageList[a].Min.toString())) * 60;
        var Sec = parseInt($.trim(messageList[a].Sec.toString()));
        var messageContent = $.trim(messageList[a].Message);
        var timeInterval = parseInt(Min + Sec + "000");
        var Url = $.trim(messageList[a].Url);
        setTimeout(SendingMessage, timeInterval, UserId, messageContent, Url);
    }
}

function SendingMessage(UserId, message, Url) {
    var visitor = VisitorsList[UserId];
    var currentVisitorPath = chatHelper.GetPageFlowOfVisitor(UserId);
    var currentUrl = currentVisitorPath[currentVisitorPath.length - 1];

    var callback = function () {
        chatUtil.AutoMessageForInActiveVisitor(UserId, message, Url);
    };

    if (Url == undefined || Url.length == 0 || (Url != undefined && currentUrl != undefined && Url.length > 0 && currentUrl.length > 0 && ActualUrlWithOutHttpWww(currentUrl.replace(/\/$/, "")) == ActualUrlWithOutHttpWww(Url.replace(/\/$/, "")))) {
        CheckForSendingAutoMessage(UserId, message, callback, Url, true);
    }
}

function SignOut() {
    ShowPageLoading();
    chatUtil.StopConnection();
    setTimeout(function () {
        window.location.href = "/Chat/AllChat"
    }, 2000);
    SignOutClicked = true;
}

var IsForceFullyConncected = false;

function ForceConnect() {
    ShowPageLoading();
    $("#dvContacts ul").empty();
    $("#dvContacts ul").append("<li id='novisitor'><div class='chatactvisitem'>Connecting ...</div></li>");
    $.connection.hub.start({ jsonp: true }, { transport: ["webSockets", "serverSentEvents", "longPolling"] }).fail(function (e) {
        if (window.console) console.log(e);
    }).done(function () {
        IsForceFullyConncected = true;
        OnlineClicked = true;
        chatUtil.RemoveAllMyOtherSession();
    });
}

function ShowErrorMessageMoreTime(errMessage) {

    $(".MsgStyle").remove();
    var messageDiv = document.createElement("div");
    messageDiv.className = "MsgStyle";
    messageDiv.style.display = "none";
    messageDiv.style.top = "57px";
    messageDiv.innerHTML = errMessage + '<span class="MsgStyleClose" onclick="RemoveShowErrorMessage();">X</span>';
    document.body.appendChild(messageDiv);
    ScrollShowErrorMessage();

    $(".MsgStyle").fadeIn(500).delay(10000).fadeOut(1000, function () {
        $(this).remove();
    });
}
//Idle Notification For Visitor
var IDLE_TIMEOUT = 300;
var _idleSecondsCounter = 0;
ClearIdleData = function () {
    seenNewMesg = true;
    _idleSecondsCounter = 0;
};
document.onclick = document.onmousemove = document.onkeypress = ClearIdleData;
window.setInterval(CheckIdleTime, 1000);
function CheckIdleTime() {

    _idleSecondsCounter++;
    if (_idleSecondsCounter >= IDLE_TIMEOUT && AgentAwayMesg && AgentAwayMesg.length > 1) {
        _idleSecondsCounter = 0;

        chatUtil.IdleNotificationToVisitor(AgentAwayMesg);
    }
}

//End of Idle Notification For Visitor
//Changes ends

//SetInterval for visitordetails updates

window.setInterval(CallUpdateVisitorDetails, 180000);//3 Minutes

function CallUpdateVisitorDetails() {
    if (toVisitorId != undefined && toVisitorId.length > 1) {
        var currentVisitor = chatHelper.GetVisitorFromList(toVisitorId);
        if (currentVisitor != undefined && currentVisitor != null)
            chatUtil.GetVisitorDetails(currentVisitor);
    }
}

//End SetInterval for visitordetails updates

//Date equal checking

function IsTodayDate(checkDate) {

    if (checkDate.indexOf("T") > 0) {
        if (GetTodayDateTime().split(" ")[0] == checkDate.split("T")[0])
            return true;
    }
    else if (checkDate.indexOf(" ") > 0) {
        if (GetTodayDateTime().split(" ")[0] == checkDate.split(" ")[0])
            return true;
    }
    return false;
}

//SetInterval for session expiry

window.setInterval(CheckSessionExpiry, 30000);

function CheckSessionExpiry() {
    $.ajax({
        url: "/Chat/ChatRoom/CheckSessionTimeOut",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response == false) {
                ShowSessionTimeOutErrorMessage("Your session has expired. Please click here to ");
            }
        },
        error: ShowAjaxError
    });
}


ShowSessionTimeOutErrorMessage = function (errMessage) {
    $(".MsgStyle").remove();
    var messageDiv = document.createElement("div");
    messageDiv.className = "MsgStyle";
    messageDiv.style.display = "none";
    messageDiv.style.top = "57px";
    messageDiv.innerHTML = errMessage + ' <a href="javascript:RemoveSessionTimeOutShowErrorMessage();" >Sign In</a>';
    document.body.appendChild(messageDiv);
    ScrollShowErrorMessage();

    $(".MsgStyle").fadeIn(500).delay(20000).fadeOut(1000, function () {
        RemoveSessionTimeOutShowErrorMessage();
    });
};


RemoveSessionTimeOutShowErrorMessage = function () {
    $(".MsgStyle").remove();
    chatUtil.StopConnection();
    SignOutClicked = true;
    window.location.href = "/Login/SignOut";
};

function BindPreview() {
    $('.ion-ios-eye-outline').popover({
        html: true,
        trigger: "hover",
        placement: "right",
        content: function () {
            var datapage = $(this).attr("data-content");
            return `<iframe src=${datapage} style="border:none; width:100%" height="100%" scrolling="no" frameborder="0"></iframe>`;
        }
    })
};