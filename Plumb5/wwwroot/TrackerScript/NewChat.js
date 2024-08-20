
var machineId, chatDetails, showOptions = false, regExpEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,10}(?:\.[a-z]{2})?)$/i, OrginalPageTitle = parent.document.title, seenNewMesg = false, IsAmAuthorized = false, chatExtraLinksList, ShowAutoMessageMobile = false;
var regExpUrl = /^((http|https|ftp):\/\/)?(\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
var CloseIconColor = "";
var serviceDomain = parent.TrackerUrl.plumb5ChatDomain + "";
$(".chatmesscontainer").css("width", "300px");
$(".chatclsewrp").css("top", "5px");
$.connection.hub.url = serviceDomain + "signalr", P5Chat = $.connection.P5Chat;
//$.connection.hub.logging = true;
//$.connection.hub.transportConnectTimeout = 30000;

var MximisedChat = 0;
var defaultLoad = 1;
var _agent;
var visitorDetails = { UserId: "", PageUrl: unescape(parent.document.URL), Referrer: unescape(parent.document.referrer), Domain: parent.document.domain, RefferDomain: "", MachineId: "", SessionRefeer: "", AdsId: parent.MainVisitorDetails.AccountId, ChatId: 0, Name: "", EmailId: "", Browser: "", Platform: "", Privacy: false, TrackIp: parent.MainVisitorDetails.BasicDetails.VisitorIp, UtmTagSource: parent.MainVisitorDetails.UtmTagDetails.utm_source, UtmMedium: parent.MainVisitorDetails.UtmTagDetails.utm_medium, UtmCampaign: parent.MainVisitorDetails.UtmTagDetails.utm_campaign, UtmTerm: parent.MainVisitorDetails.UtmTagDetails.utm_term };
var isAutoPingDoneByAgent = { Status: false, Url: null };
var p5ChatDeviceId = parent.p5deviceid;

var chatUtil = {
    Start: function () {
        chatUtil.SignalRFunctions();

        $.connection.hub.qs = { UserId: visitorDetails.UserId, Visitor: JSON.stringify(visitorDetails) };
        setTimeout(function () {
            $.connection.hub.start({ jsonp: true }, { transport: ["webSockets", "serverSentEvents", "longPolling"] }).fail(function (e) {
                if (window.console) console.log(e);
            }).done(function () {

            });
        }, 0);
    },
    ConnectVisitor: function () {
        P5Chat.server.connectVisitor(visitorDetails).fail(function (e) {
            console.log(e);
        }).done(function () {
            if (!_agent || _agent.UserId == undefined || _agent.UserId.length == 0) {
                chatBasicUtil.StatusChange(false);
            };
        });
    },
    StopConnection: function () {
        $.connection.hub.stop();
        setTimeout(function () {
            $("#plumb5ChatIframe", window.parent.document).remove();
            $("#P5MMmainDiv", window.parent.document).remove();
        }, 2000);
    },
    SignalRFunctions: function () {
        P5Chat.client.isAuthorized = function (visitor) {
            visitorDetails = chatBasicUtil.UpdateVisitorMessageDate(visitor);
            if (!IsAmAuthorized) {
                chatUtil.ConnectVisitor();
                chatBasicUtil.TodayPastMessage();
                IsAmAuthorized = true;
            }
        };
        P5Chat.client.notAuthorized = function () {
            $.connection.hub.stop();
        };
        P5Chat.client.isPrivacyAuthorized = function (isAnyAgentOnline) {

            if (isAnyAgentOnline == 1) {
                showOptions = false;
                chatBasicUtil.StatusChange(true);
            }
            else
                chatBasicUtil.StatusChange(false);
            $.connection.hub.stop();
        };
        P5Chat.client.agentConnected = function (agent) {
            if (agent != null) {
                if (_agent == undefined || _agent.UserId != agent.UserId) {

                    visitorDetails.AgentId = agent.UserId;
                    visitorDetails.LastAgentId = agent.UserId;
                    if (chatDetails.ShowEngagedMsg == 1) {
                        if (chatDetails.DesignType == 10) {
                            chatBasicUtil.SpecialNotificationMessage("<span>" + agent.Name + " in online</span>");
                        }
                        else
                            chatBasicUtil.SpecialNotificationMessage("You are currently being served by " + agent.Name + "");
                    }



                    if (visitorDetails.Name != null && visitorDetails.Name != undefined && visitorDetails.Name.toLowerCase().indexOf('visitor') < 0) {
                        if (visitorDetails.Messages == undefined || visitorDetails.Messages.Name == null || visitorDetails.Messages.Name.length == 0)
                            chatBasicUtil.SpecialNotificationMessage("Welcome " + visitorDetails.Name + " ! </label>");
                    }
                }
                //chatBasicUtil.ScrollMessageDiv();
                _agent = agent;
            }
            if (!_agent || _agent.UserId == undefined || _agent.UserId.length == 0) {
                showOptions = false; chatBasicUtil.StatusChange(false);
            }
            else if (chatDetails.Privacy == 0 && _agent && _agent.UserId != undefined && _agent.UserId.length > 0)
                showOptions = true;
            if (showOptions) {
                if ($(".chatmediawrp").hasClass("hideDiv")) {
                    $(".chatfrmwrp").addClass("hideDiv");
                    if (!$(".chatboxcontainer").hasClass("hideDiv")) { $(".chatboxtypewrp").removeClass("hideDiv"); }
                    $(".chatmediawrp").removeClass("hideDiv");
                    $(".chatboxcontainer").removeClass("df-ac-jcenter");
                    chatBasicUtil.ScrollMessageDiv();
                }
                chatBasicUtil.StatusChange(true);
            }
            $("#txtP5ChatMessage").prop("disabled", false);
        };
        P5Chat.client.updateVisitor = function (visitor) {
            visitorDetails = chatBasicUtil.UpdateVisitorMessageDate(visitor);
        };

        P5Chat.client.agentDisconnected = function (agent) {
            if (agent.UserId == _agent.UserId) {

                if (chatDetails.AgentOfflineMsg == null)
                    chatBasicUtil.SpecialNotificationMessage("Now away : " + agent.Name + "");
                else
                    chatBasicUtil.AppendMessage(chatDetails.AgentOfflineMsg, agent.Name, true);

                chatBasicUtil.ScrollMessageDiv();
                _agent = agent = null;
                $("#txtP5ChatMessage").prop("disabled", true);
            }
            if (!_agent || _agent.UserId == undefined || _agent.UserId.length == 0) {
                showOptions = false; chatBasicUtil.StatusChange(false);
            }
        };
        P5Chat.client.messageFromAgent = function (agent, message) {
            chatBasicUtil.AppendMessage(message, agent.Name);
        };
        P5Chat.client.myMessage = function (message) {
            chatBasicUtil.AppendMessage(message);
        };
        P5Chat.client.agentIsTyping = function () {
            chatBasicUtil.ShowTyping();
        };
        P5Chat.client.newAgentAllocated = function (agent) {
            if (agent != null) {
                if (_agent.UserId != agent.UserId) {
                    visitorDetails.AgentId = agent.UserId;
                    visitorDetails.LastAgentId = agent.UserId;
                    if (chatDetails.ShowEngagedMsg == 1) {
                        if (chatDetails.DesignType == 10) {
                            chatBasicUtil.SpecialNotificationMessage("<span>" + agent.Name + " in online</span>");
                        }
                        else
                            chatBasicUtil.SpecialNotificationMessage("You are currently being served by " + agent.Name + "");
                    }
                }
                chatBasicUtil.ScrollMessageDiv();
                _agent = agent;
            }
            if (!_agent || _agent.UserId == undefined || _agent.UserId.length == 0) {
                showOptions = false; chatBasicUtil.StatusChange(false);
            }
            else if (chatDetails.Privacy == 0 && _agent && _agent.UserId != undefined && _agent.UserId.length > 0)
                showOptions = true;
            if (showOptions) {
                if ($(".chatmediawrp").hasClass("hideDiv")) {
                    $(".chatfrmwrp").addClass("hideDiv");
                    $(".chatmediawrp").removeClass("hideDiv");
                    //$(".chatboxtypewrp").removeClass("hideDiv");
                    $(".chatboxcontainer").removeClass("df-ac-jcenter");
                }
                chatBasicUtil.StatusChange(true);
            }
            $("#txtP5ChatMessage").prop("disabled", false);
        };
        P5Chat.client.pushBanner = function (bannerContent, redirectUrl, chatBannerId, bannerTitle) {
            var extension = bannerContent.split('.').pop().split(/\#|\?/)[0].toLowerCase();
            var FileName = bannerContent.substring(bannerContent.lastIndexOf('/') + 1);
            if (extension == 'pdf') {
                $("#ulMesg").append("<div class='media mb-4'><div class='agentimgwrp'></div><div class='media-body'><div class='msgagent'><div class='chatpdfimgban border'><a href='javascript:void(0);' target='_blank' onclick=\"SaveToDisk('" + bannerContent + "','" + redirectUrl + "','" + chatBannerId + "','" + bannerTitle + "');\" title='" + FileName + "'><img src='" + parent.TrackerUrl.MainUrl + "/images/pdf-img.jpg' alt='pdf-img' /></a></div><p class='chatPicdescrp' style='background-color:" + chatDetails.VisitorMessageBgColor + ";color:" + chatDetails.VisitorMessageForeColor + ";'>" + bannerTitle + "</p></div></div></div>");
            }
            else {
                var imagePreviewUrl = bannerContent.replace("https:", "").replace("http:", "");
                var redirectUrlTag = regExpUrl.test(redirectUrl) ? "href = '" + redirectUrl + "'" : "";
                $("#ulMesg").append("<div class='media mb-4'><div class='agentimgwrp'></div><div class='media-body'><div class='msgagent'><div class='chatimgban'><a " + redirectUrlTag + " target='_blank' title='" + FileName + "'><img src='" + imagePreviewUrl + "' alt='" + FileName + "' onclick=\"chatUtil.SendBannerClickedEvent('" + bannerContent + "','" + redirectUrl + "','" + chatBannerId + "','" + bannerTitle + "');\" /></a></div><p class='chatPicdescrp' style='background-color:" + chatDetails.VisitorMessageBgColor + ";color:" + chatDetails.VisitorMessageForeColor + ";'>" + bannerTitle + "</p></div></div></div>");
            }
            chatBasicUtil.ScrollMessageDiv();
        };
        P5Chat.client.agentBannedForEver = function () {
            chatBasicUtil.setCookie("ChatBan" + visitorDetails.AdsId, "Ban", 365);
            chatUtil.StopConnection();
        };
        P5Chat.client.endedChatForToday = function () {
            if (chatDetails.ChatEndMesg != null && chatDetails.ChatEndMesg.length > 0)
                chatBasicUtil.SpecialNotificationMessage(chatDetails.ChatEndMesg);
            chatBasicUtil.setCookie("ChatEnd" + visitorDetails.AdsId, "End");
            setTimeout(function () { chatUtil.StopConnection(); }, 5000);
        };
        P5Chat.client.areYouOnline = function () {
            P5Chat.server.yesIamOnline().fail(function (e) {
                console.log(e);
            });
        };
        P5Chat.client.inActiveAutoMessage = function (from, message, url) {

            isAutoPingDoneByAgent.Status = true;
            isAutoPingDoneByAgent.Url = url;
            chatBasicUtil.AppendMessage(message, from, true);
        };
        P5Chat.client.idleNotificationToVisitor = function (from, message) {
            var messageDetails = visitorDetails.Messages;
            if (messageDetails != undefined && messageDetails.ChatText.length > 0) {
                if (messageDetails.ChatText[messageDetails.ChatText.length - 1] != message)
                    chatBasicUtil.AppendMessage(message, from, true);
            }
        };
    },
    SendMessage: function (message) {
        P5Chat.server.sendMessageToAgent(visitorDetails, message, _agent).fail(function (e) {
            console.log(e);
        });
    },
    VisitorResponseForAutoPing: function (url) {
        P5Chat.server.visitorResponseForAutoPing(visitorDetails, url).fail(function (e) {
            console.log(e);
        });
    },
    TypingEvent: function () {
        P5Chat.server.typingEventToAgent(visitorDetails).fail(function (e) {
            console.log(e);
        });
    },
    SendBannerClickedEvent: function (banner, redirectUrl, chatBannerId, bannerTitle) {
        P5Chat.server.sendBannerClickedEvent(_agent.UserId, banner, visitorDetails.AdsId, visitorDetails.UserId, redirectUrl, chatBannerId, bannerTitle).fail(function (e) {
            console.log(e);
        });
    },
    SendBannerClosedEvent: function (banner, redirectUrl, chatBannerId, bannerTitle) {
        if (_agent != null)
            P5Chat.server.sendBannerClosedEvent(_agent.UserId, banner, visitorDetails.AdsId, visitorDetails.UserId, redirectUrl, chatBannerId, bannerTitle).fail(function (e) {
                console.log(e);
            });
    },
    VisitorDetailsUpdate: function (name, emailId, contactNumber, contactId) {

        name = (name && name.length > 0) ? name : visitorDetails.Name;
        emailId = (emailId && emailId.length > 0) ? emailId : visitorDetails.EmailId;
        contactNumber = (contactNumber && contactNumber.length > 0) ? contactNumber : visitorDetails.ContactNumber;
        contactId = (contactId && contactId > 0) ? contactId : visitorDetails.ContactId;

        P5Chat.server.updateVisitorSummary(visitorDetails, name, emailId, contactNumber, "", contactId).fail(function (e) {
            console.log(e);
        }).done(function () {
            visitorDetails.Name = name;
            visitorDetails.EmailId = emailId;
            visitorDetails.ContactNumber = contactNumber;
            visitorDetails.ContactId = contactId;
        });
    },
    IdleNotification: function () {
        if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.connected) {
            if (visitorDetails.AgentId && visitorDetails.AgentId != null && visitorDetails.AgentId.length > 0) {
                P5Chat.server.inactiveNotification(visitorDetails).fail(function (e) {
                    console.log(e);
                });
            }
        }
    }
};

var chatBasicUtil = {
    getUniqueNumber: function () {
        var today = new Date();
        var iMonth = (today.getMonth() + 1 < 10) ? "0" + (today.getMonth() + 1).toString() : (today.getMonth() + 1).toString();
        var iDay = (today.getDate() < 10) ? "0" + today.getDate() : today.getDate();
        return iDay.toString() + iMonth.toString() + today.getFullYear().toString() + today.getHours().toString() + today.getMinutes().toString() + today.getSeconds().toString() + today.getMilliseconds().toString() + (Math.floor(Math.random() * 12345678910)).toString();
    },
    GetTodayDateTime: function () {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hour = '' + d.getHours(),
            minute = '' + d.getMinutes(),
            second = '' + d.getSeconds();

        month = (month.length < 2) ? ('0' + month) : month;
        day = (day.length < 2) ? ('0' + day) : day;

        return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':');
    },
    MakeDateFormat: function (dateString) {
        var dbDate = dateString;

        if (dateString.indexOf("T") > -1) {
            dbDate = dateString.split('T');
        }
        else if (dateString.indexOf(" ") > -1) {
            dbDate = dateString.split(' ');
        }

        var datePart = dbDate[0].split('-');
        var timePart = dbDate[1].split(':');

        var milSec = [];
        if (timePart[2].toString().indexOf(".") > 0) {
            milSec = timePart[2].split('.');
        } else if (timePart[2].toString().indexOf("+") > 0) {
            milSec = timePart[2].split('+');
        }
        else {
            milSec.push(timePart[2]);
        }

        return [datePart[0], datePart[1], datePart[2]].join('-') + ' ' + [timePart[0], timePart[1], milSec[0]].join(':');

    },
    UpdateVisitorMessageDate: function (VisitorDetailsForUpdate) {
        if (VisitorDetailsForUpdate.Messages != undefined && VisitorDetailsForUpdate.Messages != null && VisitorDetailsForUpdate.Messages.ChatDate.length > 0) {
            for (var i = 0; i < VisitorDetailsForUpdate.Messages.ChatDate.length; i++) {
                VisitorDetailsForUpdate.Messages.ChatDate[i] = chatBasicUtil.MakeDateFormat(VisitorDetailsForUpdate.Messages.ChatDate[i]);
            }
        }
        return VisitorDetailsForUpdate;
    },
    initializeMachineIdAndSessionRefeer: function () {
        var machineId = parent.MainVisitorDetails.BasicDetails.Machineid;
        visitorDetails.UserId = visitorDetails.MachineId = parent.MainVisitorDetails.BasicDetails.Machineid;

        //Session
        var sessionCookieValue = parent.MainVisitorDetails.BasicDetails.Session;
        visitorDetails.SessionRefeer = parent.MainVisitorDetails.BasicDetails.Session;

        //Forms
        var formCookieName = "pfiveCampaignIdNew" + visitorDetails.AdsId;
        var previousForms = chatBasicUtil.getCookie(formCookieName);
        if (previousForms != undefined)
            visitorDetails.CaptureFormFilledIds = previousForms.split(",");

        // RefferDomain
        visitorDetails.RefferDomain = visitorDetails.Referrer != undefined && visitorDetails.Referrer.length > 0 && visitorDetails.Referrer.indexOf(document.domain) < 0 ? visitorDetails.Referrer : "Direct";

        visitorDetails.Name = "Visitor - " + machineId.substring(machineId.length - 4, machineId.length);
        chatBasicUtil.BrowserAndPlatformDetails();
    },
    BrowserAndPlatformDetails: function () {

        var browVersion = "";
        var browType = "";
        var opSystem = "";

        var agt = navigator.userAgent.toLowerCase();

        if (!!navigator.userAgent.match(/Trident.*rv[ :]*11\./)) {
            browType = "IE";
            browVersion = "11";
        }
        else if (agt.indexOf("msie") != -1) {
            browType = "IE";
            var temp365 = agt.split("msie")
            browVersion = parseFloat(temp365[1])
        }
        else if (navigator.userAgent.indexOf("Firefox") != -1) {
            browType = "Firefox";
            var mvar = agt.split("firefox/")
            browVersion = mvar[1]
        }
        else if (agt.indexOf("netscape") != -1) {
            browType = "Netscape";
            var nvar = agt.split("netscape/")
            browVersion = nvar[1]
        }
        else if (agt.indexOf("opr") != -1) {
            browType = "Opera";
            var ovar = agt.split("opr/")
            browVersion = ovar[1]
        }
        else if (agt.indexOf("chrome") != -1) {
            browType = "Chrome";
            try {
                var nvar = agt.split("chrome/")
                if (nvar[1].indexOf(" ") > 0) {
                    var newVe = nvar[1].split(" ");
                    browVersion = newVe[0];
                }
                else {
                    browVersion = nvar[1];
                }
            } catch (Err) {
            }
        }
        else if (agt.indexOf("safari") != -1) {
            browType = "safari";
        }
        else if (agt.indexOf("opera") != -1) {
            browType = "Opera";
            var ovar = agt.split("opera/")
            var ovar1 = ovar[1]
            var ovar2 = ovar1.split("(")
            browVersion = ovar2[0]
        }
        var is_winxp = ((agt.indexOf("winxp") != -1) || (agt.indexOf("windows nt 5.1") != -1));
        if (is_winxp) {
            opSystem = "Windows xp"
        }

        var is_winvista = agt.indexOf("windows nt 6.0") != -1;
        if (is_winvista) {
            opSystem = "Windows Vista"
        }

        var is_win7 = agt.indexOf("windows nt 6.1") != -1;
        if (is_win7) {
            opSystem = "Windows 7"
        }

        var is_win8 = ((agt.indexOf("windows nt 6.2") != -1) || (agt.indexOf("windows nt 6.3") != -1));
        if (is_win8) {
            opSystem = "Windows 8"
        }

        var is_win10 = ((agt.indexOf("windows nt 10.0") != -1) || (agt.indexOf("windows nt 6.4") != -1));
        if (is_win10) {
            opSystem = "Windows 10"
        }

        var isMac = agt.indexOf("mac os") != -1;
        if (isMac) {
            opSystem = "Mac OS"
        }

        var isiphone = agt.indexOf("iphone") != -1;
        if (isiphone) {
            opSystem = "iPhone"
        }

        var isipad = agt.indexOf("ipad") != -1;
        if (isipad) {
            opSystem = "iPad"
        }

        var isandroid = agt.indexOf("android") != -1;
        if (isandroid) {
            opSystem = "Android"
        }

        var isBlackBerry = agt.indexOf("blackberry") != -1;
        if (isBlackBerry) {
            opSystem = "BlackBerry"
        }

        var isubuntu = agt.indexOf("ubuntu") != -1;
        if (isubuntu) {
            opSystem = "Ubuntu"
        }

        var is_win95 = ((agt.indexOf("win95") != -1) || (agt.indexOf("windows 95") != -1));
        if (is_win95) { opSystem = "Windows 95" }

        var is_winme = ((agt.indexOf("win 9x 4.90") != -1));
        if (is_winme) {
            opSystem = "Windows me"
        }

        var is_win2k = ((agt.indexOf("windows nt 5.0") != -1));
        if (is_win2k) {
            opSystem = "Windows 2000"
        }

        var is_win98 = ((agt.indexOf("win98") != -1) || (agt.indexOf("windows 98") != -1));
        if (is_win98) {
            opSystem = "Windows 98"
        }

        var is_linux = (agt.indexOf("inux") != -1);
        if (is_linux) {
            opSystem = "linex"
        }

        var is_sun = (agt.indexOf("sunos") != -1);
        if (is_sun) { opSystem = "sun" }

        var is_hpux = (agt.indexOf("hp-ux") != -1);
        if (is_sun) {
            opSystem = "hp"
        }

        if (is_linux) {
            opSystem = "Unix"
        }

        visitorDetails.Browser = browType + " " + browVersion;
        if (opSystem)
            visitorDetails.Platform = opSystem;
    },
    SoundDesktopNotificationSetting: function () {
        if (chatDetails.DesktopNotificationVisitor == 1) {
            $("#dvDesktopNoti").show();
            desktopNotificationVisitor = true;
            if (parent.plumb5DesktopNoti)
                $("#imgDesktopStatus").attr("src", parent.TrackerUrl.plumb5ChatDomain + "images/chatDesktopNotiActive.png");

            if (chatBasicUtil.CheckDesktopPermission())
                $("#imgDesktopStatus").attr("src", parent.TrackerUrl.plumb5ChatDomain + "images/chatDesktopNotiActive.png");
        }

        if (chatDetails.SoundNotificationVisitor && chatDetails.SoundNotificationVisitor.length > 1) {
            $("#dvSound").show();
            soundNotifyName = chatDetails.SoundNotificationVisitor;
        }
    },
    getCookie: function (cookieName) {
        return parent.TrackingUtil.GetCookie(cookieName);
    },
    setCookie: function (cookieName, value, exdays) {
        parent.TrackingUtil.SetCookie(cookieName, value, exdays);
    },
    ChangePropertyValue: function (objectProperty) {
        try {
            if (objectProperty != null && objectProperty != undefined) {
                var names = Object.getOwnPropertyNames(objectProperty);
                for (var i = 0; i < names.length; i++) {
                    if (names[i] != null && names[i].length > 0 && objectProperty[names[i]] != undefined && objectProperty[names[i]].length > 0 && names[i] != "CaptureFormFilledIds")
                        objectProperty[names[i]] = objectProperty[names[i]].replace(/&/g, "$@").replace(/#/g, "@$@");
                }
            }
        }
        catch (Error) {
            console.log(Error);
        }
    },
    ChangePropertyValueObject: function (objectProperty) {
        try {
            if (objectProperty != null && objectProperty != undefined) {
                for (var a = 0; a < objectProperty.length; a++) {
                    var names = Object.getOwnPropertyNames(objectProperty[a]);
                    for (var i = 0; i < names.length; i++) {
                        if (names[i] != null && names[i].length > 0 && objectProperty[a][names[i]] != undefined && objectProperty[a][names[i]].length > 0 && names[i] != "CaptureFormFilledIds")
                            objectProperty[a][names[i]] = objectProperty[a][names[i]].replace(/&/g, "$@").replace(/#/g, "@$@");
                    }
                }
            }
        }
        catch (Error) { console.log(Error); }
    },
    StyleAppend: function () {

        //New design

        $("#ui_ChatHeader").html(chatDetails.Header);

        if (chatDetails.BackgroundColor != null && chatDetails.BackgroundColor != undefined) {
            $("#chateventbtn").addClass('chatbubwrp');
            $("#ui_chatboxtpbar").removeClass().addClass('chatboxtpbar');
            if (chatDetails.BackgroundColor.substring(0, 1) == "#") {
                $(".chatboxtpbar").css("background-color", chatDetails.BackgroundColor);
                $("#chateventbtn").css("background-color", chatDetails.BackgroundColor);
                $(".chatusericn").css("background-color", chatDetails.BackgroundColor);
                $(".chatbtnfrmbgcol").css("background-color", chatDetails.BackgroundColor);

                $(".chatusericn").removeClass("bg-reef");
                $(".chatusericn").css("background-color", chatDetails.BackgroundColor);

                $("#BtnSubOffDet,.chatbtnfrmbgcol").removeClass("bg-reef");
            }
            else {
                $(".chatboxtpbar").addClass(chatDetails.BackgroundColor);
                $(".chatbubwrp").addClass(chatDetails.BackgroundColor);
                $(".chatusericn").addClass(chatDetails.BackgroundColor);
                $(".chatbtnfrmbgcol").addClass(chatDetails.BackgroundColor);
            }

        }
        if (chatDetails.MinimisedWindow == 1) {
            $(".chatboxwrp").addClass("border-radius-10");
            $(".chatboxtpbar").addClass("chatboxbar-radius");
            $(".chatboxtpbar").addClass("chatboxbar-radius");
        }

        if (chatDetails.ForegroundColor != null && chatDetails.ForegroundColor != undefined) {
            CloseIconColor = chatDetails.ForegroundColor;
            $("#ui_ChatHeader").css("color", "#" + chatDetails.ForegroundColor);


            $(".chatusericn").find('i').css("color", "#" + chatDetails.ForegroundColor);
            $(".chatbtnfrmbgcol").css("color", "#" + chatDetails.ForegroundColor);

            $(".ion-chatboxes").css("color", "#" + chatDetails.ForegroundColor);
            $(".ion-android-more-vertical").css("color", "#" + chatDetails.ForegroundColor);
            $("#chateventbtn i").css("color", "#" + chatDetails.ForegroundColor);
        }

        $("#txtP5ChatMessage").attr('maxlength', '800');


        if (chatDetails.Position == 0) {
            $(".chatprevwrp").removeClass("align-items-start");
            $("#plumb5ChatIframe", window.parent.document).css({
                left: "", right: ""
            }).attr("style", $("#plumb5ChatIframe", window.parent.document).attr("style") + ";right: 1.5%;").show();
        }
        else {
            $("#plumb5ChatIframe", window.parent.document).css({
                left: "", right: ""
            }).attr("style", $("#plumb5ChatIframe", window.parent.document).attr("style") + ";left: 1.5%;").show();
            $(".chatprevwrp").addClass("align-items-start");
        }

        if (chatExtraLinksList && chatExtraLinksList != null) {

            for (var i = 0; i < chatExtraLinksList.length; i++) {
                if (chatExtraLinksList[i].LinkType == 1)
                    chatBasicUtil.ChatAppendJavascriptIframes(document, chatExtraLinksList[i].LinkUrl, "chatCustomScript" + i);
                else
                    chatBasicUtil.ChatAppendStyleIframes(document, chatExtraLinksList[i].LinkUrl);
            }
        }

        if (chatDetails.IsPreChatSurvey) {
            if (chatDetails.NamePlaceholderText != null)
                $("#txtUpOffVisitorName").attr("placeholder", chatDetails.NamePlaceholderText);

            if (chatDetails.EmailPlaceholderText != null)
                $("#txtUpOffEmailId").attr("placeholder", chatDetails.EmailPlaceholderText);

            if (chatDetails.PhonePlaceholderText != null)
                $("#txtUpOffPhoneNumber").attr("placeholder", chatDetails.PhonePlaceholderText);

            if (chatDetails.PrivacyContent != null)
                $("#txtUpOffrivacyContent").html(chatDetails.PrivacyContent);

            if (chatDetails.ButtonText != null)
                $("#btnUpSubmit").html(chatDetails.ButtonText);
        }

        if (chatDetails.ChatBodyBackgroundColor != null)
            $(".chatboxcontainer").css('background-color', chatDetails.ChatBodyBackgroundColor);
    },
    StatusChange: function (isOnline) {
        $(".chatmesscontainer>p").html('&nbsp;');
        if (isOnline) {// online
            if (chatDetails.FormOnlineTitle && chatDetails.FormOnlineTitle.length > 0) {
                $("#FormTitle").text(chatDetails.FormOnlineTitle);
            }
            if (chatDetails.CustomTitle && chatDetails.CustomTitle.length > 0) {
                if (MximisedChat == 0) { $(".chatmesscontainer").removeClass("hideDiv"); }
                $(".chatmesscontainer>p").html(chatDetails.CustomTitle);
            }
            else {
                $(".chatmesscontainer").addClass("hideDiv");
            }

            $(".tdcreatedraft").removeClass("hideDiv")
        }
        else {// offline
            if (chatDetails.FormOfflineTitle && chatDetails.FormOfflineTitle.length > 0) {
                $(".headingClass").removeClass("message").addClass("CustomMessage");
                $("#FormTitle").text(chatDetails.FormOfflineTitle);
            }
            if (chatDetails.OfflineTitle && chatDetails.OfflineTitle.length > 0) {
                if (MximisedChat == 0) { $(".chatmesscontainer").removeClass("hideDiv"); }
                $(".chatmesscontainer>p").html(chatDetails.OfflineTitle);
            }
            else {
                $(".chatmesscontainer").addClass("hideDiv");
            }

            $(".tdcreatedraft").addClass("hideDiv")
        }
    },
    TodayPastMessage: function () {
        try {
            if (chatDetails.ShowGreetingMsg == 1) {
                var today = new Date();
                if (today.getHours() >= 16) {
                    if ($("#ui_liWishMesg").length == 0)
                        $("#ulMesg").append("<div class='media mb-4' id='ui_liWishMesg'><div class='media-body'><div class='msgagent'><p style='background-color:" + chatDetails.AgentMessageBgColor + ";color:" + chatDetails.AgentMessageForeColor + ";'>Hi, Good Evening</p></div></div></div>");
                }
                else if (today.getHours() >= 12) {
                    if ($("#ui_liWishMesg").length == 0)
                        $("#ulMesg").append("<div class='media mb-4' id='ui_liWishMesg'><div class='media-body'><div class='msgagent'><p style='background-color:" + chatDetails.AgentMessageBgColor + ";color:" + chatDetails.AgentMessageForeColor + ";'>Hi, Good Afternoon</p></div></div></div>");
                }
                else {
                    if ($("#ui_liWishMesg").length == 0)
                        $("#ulMesg").append("<div class='media mb-4' id='ui_liWishMesg'><div class='media-body'><div class='msgagent'><p style='background-color:" + chatDetails.AgentMessageBgColor + ";color:" + chatDetails.AgentMessageForeColor + ";'>Hi, Good Morning</p></div></div></div>");
                }
            }

            var messageDetails = visitorDetails.Messages;
            if (messageDetails != undefined && messageDetails.Name.length > 0) {
                for (var i = 0; i < messageDetails.Name.length; i++) {
                    if (messageDetails.IsAgent[i] == 1) {
                        $("#ulMesg").append("<div class='media mb-4'><div class='agentimgwrp' ></div><div class='media-body'><div class='msgagent'><p style='background-color:" + chatDetails.AgentMessageBgColor + ";color:" + chatDetails.AgentMessageForeColor + ";'>" + linkifyHtml(messageDetails.ChatText[i].replace("<", "&lt;").replace(">", "&gt;")) + "</p></div></div></div>");
                    }

                    else {
                        $("#ulMesg").append("<div class='media mb-4'><div class='media-body reverse'><div class='msgagent'><p style='background-color:" + chatDetails.VisitorMessageBgColor + ";color:" + chatDetails.VisitorMessageForeColor + ";'>" + linkifyHtml(messageDetails.ChatText[i].replace("<", "&lt;").replace(">", "&gt;")) + "</p></div></div><div class='chatuserimgwrp'></div></div>");
                    }
                }
            }
            chatBasicUtil.ScrollMessageDiv();
        }
        catch (Error) { }
    },

    AppendMessage: function (message, from, IsMaximizeCheck) {

        message = message.replace("<", "&lt;").replace(">", "&gt;");
        if (!$(".chatfrmwrp").hasClass("hideDiv")) { ShowOffLineDiv(); }
        if (from) {
            $('.chatAgentNmwrp').removeClass('hideDiv');
            $('#ui_agentName').html(from);
            $("#ulMesg").append("<div class='media mb-4'><div class='agentimgwrp' title='" + from + "'></div><div class='media-body'><div class='msgagent'><p style='background-color:" + chatDetails.AgentMessageBgColor + ";color:" + chatDetails.AgentMessageForeColor + ";'>" + linkifyHtml(message) + "</p></div></div></div>");

            if (chatDetails.DesktopNotificationVisitor) {
                chatBasicUtil.NotificationAndSound(from, message);
            }
            chatBasicUtil.ClearChatTyping();
            seenNewMesg = false;
            chatBasicUtil.ChatMessageTitleToogle();

            if (!$("#ulMesg").is(":visible")) {
                if (IsMaximizeCheck) {
                    if (ShowAutoMessageMobile == true) {
                        if (p5ChatDeviceId == 0)
                            ShowchatWindow();
                    }
                    else {
                        ShowchatWindow();
                    }
                }
                else {
                    ShowchatWindow();
                }
            }
            chatBasicUtil.AppendMessageToList(from, message, 1);
        }
        else {
            var isLeadClass = "unknowMesgStyle";
            if (visitorDetails.IsLeadType == 1) isLeadClass = "leadMesgStyle";
            else if (visitorDetails.IsLeadType == 2) isLeadClass = "CustomerMesgStyle";
            $("#ulMesg").append("<div class='media mb-4'><div class='media-body reverse'><div class='msgagent'><p style='background-color:" + chatDetails.VisitorMessageBgColor + ";color:" + chatDetails.VisitorMessageForeColor + ";'>" + linkifyHtml(message) + "</p></div></div><div class='chatuserimgwrp'></div></div>");

            //$("#ulMesg").append("<li><label class='VisitorPlaceStyle'><label class='" + isLeadClass + "'>Me<label class='ColonStyle'>&nbsp;:</label></label><label class='VisitorMessageStyle VisitorChatBubble'>" + linkifyHtml(message) + "</label</label></li>").trigger("DomChanged");
            chatBasicUtil.AppendMessageToList(visitorDetails.Name, message, 0);
        }
        chatBasicUtil.ScrollMessageDiv();
        chatBasicUtil.UpdateSessionCookie();
    },
    AppendMessageToList: function (Name, ChatText, IsAgent) {

        if (visitorDetails.Messages == undefined) {
            visitorDetails.Messages = new Object();
            visitorDetails.Messages.Name = [];
            visitorDetails.Messages.ChatText = [];
            visitorDetails.Messages.ChatDate = [];
            visitorDetails.Messages.IsAgent = [];
        }

        visitorDetails.Messages.Name.push(Name);
        visitorDetails.Messages.ChatText.push(ChatText);
        visitorDetails.Messages.ChatDate.push(chatBasicUtil.GetTodayDateTime());
        visitorDetails.Messages.IsAgent.push(IsAgent);
    },
    SpecialNotificationMessage: function (message) {
        $("#ulMesg").append("<div class='media mb-4' id='ui_liWishMesg'><div class='media-body'><div class='msgagent'><p>" + message + "</p></div></div></div>");
    },
    ScrollMessageDiv: function () {
        //var elm = document.getElementById("dvMessagesId");
        //var heigtOfSlim = elm.scrollHeight + 'px';
        //$("#dvMessagesId").slimScroll({
        //    scroll: heigtOfSlim
        //});
        $(".chatboxcontainer").animate({ scrollTop: $(".chatboxcontainer").get(0).scrollHeight }, 500);
    },
    ShowTyping: function () {
        $("#dvTypingMesg").css({ 'display': 'none' })
        $("#dvTypingMesg").css({ 'display': 'block' })
        setTimeout(function () { chatBasicUtil.ClearChatTyping(); }, 6000);
    },
    ClearChatTyping: function () {
        $("#dvTypingMesg").css({ 'display': 'none' })
    },
    RequestForDesktopNotification: function () {
        if (window.webkitNotifications && navigator.userAgent.indexOf("Chrome") > -1) {
            if (webkitNotifications.checkPermission() == 1)
                webkitNotifications.requestPermission();
        } else if (window.Notification) {
            if (typeof window.Notification.permissionLevel === 'function') {
                if (Notification.permissionLevel() === 'default')
                    Notification.requestPermission(function () {
                        chatBasicUtil.SendDesktopNotification("Chat", "You have activated desktop notification");
                    });
            }
            else if (window.Notification.permission)
                Notification.requestPermission(function () {
                    chatBasicUtil.SendDesktopNotification("Chat", "You have activated desktop notification");
                });
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
    SendDesktopNotification: function (title, details) {
        if (window.webkitNotifications && navigator.userAgent.indexOf("Chrome") > -1) {
            if (webkitNotifications.checkPermission() == 0) {
                var n = webkitNotifications.createNotification('images/P5.jpg', title, details);
                n.show();
            }
        } else if (window.Notification) {
            if (typeof window.Notification.permissionLevel === 'function') {
                if (Notification.permissionLevel() === 'granted')
                    new Notification(title, { 'body': details });

            }
            else if (window.Notification.permission) {
                if (Notification.permission === 'granted')
                    new Notification(title, {
                        'body': details
                    });
            }
        }
    },
    NotificationAndSound: function (from, message) {

        if (chatBasicUtil.CheckDesktopPermission()) {
            if (!parent.window.document.hasFocus())
                chatBasicUtil.SendDesktopNotification(from, message);
        }
        if ($("#imgSound").attr("src").indexOf("volume_loud.png") > -1) {
            if (chatDetails.SoundNotificationVisitor && chatDetails.SoundNotificationVisitor.length > 1) {
                //var soundPlayer = "<embed id='embdPlumbSound' src='" + parent.plumb5ChatDomain + "ChatDesign/P5Notification.swf' width='1' height='1' wmode='transparent' flashvars='autoplay=1&url=" + parent.plumb5ChatDomain + "ChatDesign/Audio/" + chatDetails.SoundNotificationVisitor + "'></embed>";
                var soundPlayer = "<audio style='display:none' id='ui_playAudio' src='" + parent.TrackerUrl.plumb5ChatDomain + "ChatDesign/Audio/" + chatDetails.SoundNotificationVisitor + "' preload='auto' controls></audio>"
                $("#dvSoundPlay").html(soundPlayer);
                var oAudio = document.getElementById('ui_playAudio');
                oAudio.play();
            }
        }

    },
    NewMesgNotification: function (fromName) {
        window.setTimeout(chatBasicUtil.ChatMessageTitleToogle, 1000);
        parent.document.title = OrginalPageTitle;
    },
    ChatMessageTitleToogle: function () {
        if (!seenNewMesg && _agent != null && _agent.Name.length > 0) {
            parent.document.title = _agent.Name + " says...";
            window.setTimeout(chatBasicUtil.NewMesgNotification, 1000);
        }
        else {
            parent.document.title = OrginalPageTitle;
        }
    },
    validateMobilNo: function (mobno) {
        var mlen = mobno.length;
        var regNumber = /^\d{10,20}$/;
        var regAnotherNumber = /^\+[0-9]{2,3}-[0-9]\d{10}$/;
        var regNumberPlus = /^\+\d{10,20}$/;
        var regNumberPlus91 = /^\+91\d{10,20}$/;
        var regNumberPlus91Minus = /^\+91-\d{10,20}$/;
        if (regNumber.test(mobno))
            return true;
        if (regNumberPlus.test(mobno))
            return true;
        if (regNumberPlus91.test(mobno))
            return true;
        if (regNumberPlus91Minus.test(mobno))
            return true;
        else if (regAnotherNumber.test(mobno))
            return true;
        else if (mobno.charAt(0) != '+' && mlen == 10)
            return true;
        else if (mobno.charAt(0) == '+') {
            if (mobno.substr(0, 3) == '+91' && mobno.length == 13) {
                return true;
            }
        }
        else if (mobno.indexOf("-") < 0 && mobno.length == 12 && mobno.substr(0, 2) == '91')
            return true;
        return false;
    },
    BindVisitorDetailsToChatForm: function () {
        if (visitorDetails.EmailId != null && visitorDetails.EmailId.length > 0) {
            $("#txtUpOffEmailId").val(visitorDetails.EmailId);
            $("#txtUpOffVisitorName").val(visitorDetails.Name);
        }
        if (visitorDetails.ContactNumber != null && visitorDetails.ContactNumber.length > 0) {
            $("#txtUpOffPhoneNumber").val(visitorDetails.ContactNumber);
            $("#txtUpOffVisitorName").val(visitorDetails.Name);
        }
    },

    AppendChatHtml: function () {
        var minimizeDiv = document.createElement("div");
        minimizeDiv.id = "ui_dvChatMini";
        minimizeDiv.className = "headingClass";
        minimizeDiv.innerHTML = '<div></div><div class="minimizeImage"><img src="' + parent.TrackerUrl.MainUrl + '/img_trans.gif" alt="" /></div>';
        minimizeDiv.style.display = 'none';
        document.body.appendChild(minimizeDiv);

        parent.P5AppendJavascriptIframes(parent.myChatIframe.contentWindow.document, parent.TrackerUrl.MainUrl + "/text_linkify.js?ver=1.0", "linkifyJs");
        //parent.P5AppendJavascriptIframes(parent.myChatIframe.contentWindow.document, "https://pgsrc.plumb5.com" + "/text_linkify.js?ver=1.0", "linkifyJs");
    },
    UpdateSessionCookie: function () {
        var p5cur = parent.TrackingUtil.plumbfivegetdate("CurrentTime");
        parent.TrackingUtil.SetCookie("p5PrevTimeNew" + parent.p5accountid, p5cur, 36500);
    },
    ChatAppendJavascriptIframes: function (iframeDocumnet, url, scriptId) {
        var js, headTag = iframeDocumnet.getElementsByTagName("head")[0];
        js = iframeDocumnet.createElement('script');
        js.src = url;
        js.setAttribute("id", scriptId);
        if (!iframeDocumnet.getElementById(scriptId)) {
            headTag.appendChild(js);
        }
    },
    ChatAppendStyleIframes: function (iframeDocumnet, url) {
        var p5linktag, headTag = iframeDocumnet.getElementsByTagName("head")[0];
        p5linktag = iframeDocumnet.createElement('link');
        p5linktag.type = 'text/css'; p5linktag.rel = "stylesheet";
        p5linktag.href = url;
        headTag.appendChild(p5linktag);
    }
};

chatBasicUtil.initializeMachineIdAndSessionRefeer();
GetColorDetails();
function GetColorDetails() {

    if (chatBasicUtil.getCookie("ChatEnd" + visitorDetails.AdsId)) {
        $("#plumb5ChatIframe", window.parent.document).remove();
        return;
    }

    chatBasicUtil.ChangePropertyValue(visitorDetails);

    chatBasicUtil.AppendChatHtml();

    var url = serviceDomain + "Handler/ChatConditions.ashx?callback=?&Action=1&visitorInfo=" + JSON.stringify(visitorDetails) + "";
    $.getJSON(url, function (json) {


        if (!json.IsConditionSatisfied) {
            $("#plumb5ChatIframe", window.parent.document).remove();
            return;
        }

        chatDetails = json.ChatDetails;
        chatExtraLinksList = json.chatExtraLinksList;

        visitorDetails.ChatId = chatDetails.Id;
        ShowAutoMessageMobile = chatDetails.ShowAutoMessageMobile;





        if (chatDetails.DesktopNotificationVisitor) {
            chatBasicUtil.SoundDesktopNotificationSetting();
        }

        //Default maximized 
        if (chatDetails.MinimisedWindow == 0 && defaultLoad == 1) {
            $(".chatprevwrp").addClass("justify-content-end");
            $("#ui_chatboxtpbar").css("cursor", "pointer");
            $(".chattitlwrp").css({ "width": "100%", "height": "50px" });

            $("#chateventbtn").find('i').remove();
            //if ((chatDetails.CustomTitle && chatDetails.CustomTitle.length > 0) || (chatDetails.OfflineTitle && chatDetails.OfflineTitle.length > 0)) {$(".chatmesscontainer").removeClass("hideDiv");}
            $(".chatboxcontainer,.chatoptionwrp,.chatboxtypewrp").addClass("hideDiv");
            $(".chatcontainer").removeClass("min-h-500").css("cursor", "pointer");
            $("#chateventbtn").addClass("hideDiv");
            $(".chatprevwrp").addClass("justify-content-end");
            $('#plumb5ChatIframe', window.parent.document).css({ height: 200 });
        } else if (defaultLoad == 1) {
            $(".chatcontainer").addClass("hideDiv");
            //if ((chatDetails.CustomTitle && chatDetails.CustomTitle.length > 0) || (chatDetails.OfflineTitle && chatDetails.OfflineTitle.length > 0)) {$(".chatmesscontainer").removeClass("hideDiv");}
            $("#chateventbtn").find('i').remove();
            $("#chateventbtn").append("<i class='icon font-28 ion-ios-chatbubble-outline'></i>");
            $(".chatprevwrp").addClass("justify-content-end");
            $('#plumb5ChatIframe', window.parent.document).css({ height: 200 });
        }
        defaultLoad = 0;

        chatDetails.Privacy = json.IsPrivacy;
        if (json.IsPrivacy == 1)
            visitorDetails.Privacy = true;

        if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.connected) {
            $.connection.hub.stop();
        }
        chatBasicUtil.StyleAppend();
        chatUtil.Start();
        //chatBasicUtil.ChatMinimizeDesign(true);
        if (chatDetails.WelcomeMesg && chatDetails.WelcomeMesg.length > 0)
            chatBasicUtil.SpecialNotificationMessage(chatDetails.WelcomeMesg);


    });



}


$(document.body).on('keypress', '#txtUpOffPhoneNumber', function (event) {
    if ($("#txtUpOffPhoneNumber").val().length < 12)
        return onlyPhoneNumbersDetails(event);
    return false;
});

function onlyNumbers(event) {
    var charCode = window.event ? window.event.keyCode : event.which; //firefox    
    if (charCode == 0)
        charCode = event.keyCode;
    if (charCode == 8 || charCode == 46)
        return true;
    if ((charCode < 48 || charCode > 57) || (((charCode < 48 || charCode > 57) && charCode < 96) || ((charCode < 48 || charCode > 57) && charCode > 105))) return false;
    return true;
}

function onlyPhoneNumbersDetails(event) {
    var charCode = window.event ? window.event.keyCode : event.which; //firefox    
    if (charCode == 0)
        charCode = event.keyCode;
    if (charCode == 8 || charCode == 43)
        return true;
    if ((charCode < 48 || charCode > 57) || (((charCode < 48 || charCode > 57) && charCode < 96) || ((charCode < 48 || charCode > 57) && charCode > 105))) return false;
    return true;
}

ScrollMessageDiv = function () {
    //var elm = document.getElementById("dvMessagesId");
    //var heigtOfSlim = elm.scrollHeight + 'px';
    //$("#dvMessagesId").slimScroll({ scroll: heigtOfSlim });
    $(".chatboxcontainer").animate({ scrollTop: $(".chatboxcontainer").get(0).scrollHeight }, 500);
};

$(".btImgBor").click(function () {
    if ($(this).hasClass("active")) {
        $(this).removeClass("active"); $(".dvSettingMain").hide("fast");
    }
    else {
        $(this).addClass("active"); $(".dvSettingMain").show("fast");
    }
});

// Transcript setting
//$("#btImgBorRt").click(function () {
//    TranscriptHideShow();
//});

TranscriptHideShow = function () {
    if (showOptions) {
        if (!$(".btImgBorRt").hasClass("active")) {
            $(".dvcontent > div").removeClass("active");
            $(".dvTranscript, .btImgBorRt").addClass("active");
            if (visitorDetails.EmailId != null && visitorDetails.EmailId.length > 0) {
                $("#txtEmailTranscript").val(visitorDetails.EmailId);
            }
        }
        else {
            $(".dvcontent > div, .btImgBorRt").removeClass("active");
            $(".chatmediawrp").removeClass("hideDiv");
            $(".chatboxtypewrp").removeClass("hideDiv");
        }
    }
    $(".dvSettingMain").hide("fast");
    $(".btImgBor").removeClass("active");
};

$("#btnTranscriptCancel").click(function () {
    TranscriptHideShow();
});

$("#btnTranscript").click(function () {
    if ($.trim($("#txtEmailTranscript").val()).length == 0) {
        $("#lblTranscript").html("Please enter an Email-Id to get transcript");
        setTimeout(function () {
            $("#lblTranscript").html("")
        }, 5000);

        return;
    }

    if (!regExpEmail.test($("#txtEmailTranscript").val())) {
        $("#lblTranscript").html("Please enter correct Email-ID to get transcript");
        setTimeout(function () {
            $("#lblTranscript").html("")
        }, 5000);

        return;
    }

    var emailId = $("#txtEmailTranscript").val();
    if (visitorDetails.Messages != undefined && visitorDetails.Messages.Name != null && visitorDetails.Messages.Name.length > 0) {
        if (visitorDetails.Messages.ChatDate != null && visitorDetails.Messages.ChatDate.length > 0) {
            visitorDetails.Messages.ChatDate = [];
        }
    }
    var url = serviceDomain + "Handler/SendReceiveDetails.ashx?callback=?&emailId=" + emailId + "&visitorDetails=" + JSON.stringify(visitorDetails) + "";
    $.getJSON(url, function (json) {
        if (json != undefined && json != null) {
            if (!json) {
                $("#lblTranscript").html("Oops! We apologize. Something went wrong and your transcript could not be emailed to you");
                setTimeout(function () {
                    $("#lblTranscript").html("");
                    TranscriptHideShow();
                }, 5000);
            }
            else
                $("#lblTranscript").html("Mail has been successfully sent");
            setTimeout(function () {
                $("#lblTranscript").html("");
                TranscriptHideShow();
            }, 5000);
        }
    });

});

//End Of Transcript

function ShowOffLineDiv() {
    if (showOptions) {

        if ($(".chatmediawrp").hasClass("hideDiv")) {
            RemoveOfflineForm();
        }
        else {
            chatBasicUtil.BindVisitorDetailsToChatForm();
            $(".chatmediawrp").addClass("hideDiv");
            $(".chatfrmwrp").removeClass("hideDiv");
            $(".chatboxtypewrp").addClass("hideDiv");
            $(".chatboxcontainer").addClass("df-ac-jcenter");
            $("#txtP5ChatMessage").prop("disabled", true);
            $("#lblThankYou").html("");
            $(".chatAgentNmwrp").addClass("hideDiv");
        }
    }
}


function RemoveOfflineForm() {
    if (showOptions) {
        $(".chatmediawrp").removeClass("hideDiv");
        $(".chatfrmwrp").addClass("hideDiv");
        $(".chatboxtypewrp").removeClass("hideDiv");
        $(".chatboxcontainer").removeClass("df-ac-jcenter");
        $("#txtP5ChatMessage").prop("disabled", false);
        $('.chatAgentNmwrp').removeClass('hideDiv');
        chatBasicUtil.ScrollMessageDiv();
    }

}


function DivInactive() {
    seenNewMesg = false;
}

//$("#BtnSubOffDet").click(function () {
$(document.body).on('click', '#BtnSubOffDet', function () {

    if (($("#txtUpOffVisitorName").val()).length == 0) {
        $("#lblThankYou").html("Please enter your name");
        return false;
    }

    if (!regExpEmail.test($("#txtUpOffEmailId").val())) {
        $("#lblThankYou").html("Please enter valid email id");
        return false;
    }

    if (!chatBasicUtil.validateMobilNo($("#txtUpOffPhoneNumber").val())) {
        $("#lblThankYou").html("Please enter valid phone number");
        return false;
    }

    //if ($.trim($("#txtUpOffPrivatMsg").val()).length == 0) {
    // $("#lblThankYou").html("Please enter your message.");
    //return false;
    // }

    if (!($("#cont_1").is(":checked"))) {
        $("#lblThankYou").html("Please agree to the conditions");
        return false;
    }

    if (chatDetails.IsPreChatSurvey) {
        if (chatDetails.ResponseMessage != null)
            $(".prechatErrorMess").html(chatDetails.ResponseMessage);

        if (chatDetails.ResponseMessageTextColor != null)
            $(".prechatErrorMess").css('color', chatDetails.ResponseMessageTextColor);
    }

    $("#btnUpSubmit").attr("disabled", true);

    $("#lblThankYou").html("Updating...");

    var chatBasicDetails = {
        Name: "", EmailId: "", PhoneNumber: "", Message: "", Location: ""
    };
    chatBasicDetails.Name = $.trim($("#txtUpOffVisitorName").val()).length > 0 ? $.trim($("#txtUpOffVisitorName").val()) : visitorDetails.Name;
    chatBasicDetails.EmailId = $.trim($("#txtUpOffEmailId").val());
    if (document.getElementById("txtUpOffPhoneNumber"))
        chatBasicDetails.PhoneNumber = $.trim($("#txtUpOffPhoneNumber").val());
    chatBasicDetails.Message = $.trim($("#txtUpOffPrivatMsg").val());

    //Get the custom data requested by client
    var otherCustomDetails = $(".chatfrmwrp input:not([id])");
    if (otherCustomDetails && otherCustomDetails.length > 0) {
        for (var i = 0; i < otherCustomDetails.length; i++) {
            var element = $(otherCustomDetails[i]);
            if (element.attr('plumbId') != undefined)
                chatBasicDetails[element.attr('plumbId')] = element.val();
        }
    }

    chatBasicUtil.ChangePropertyValue(chatBasicDetails);
    chatBasicUtil.ChangePropertyValue(visitorDetails);
    if (visitorDetails.Messages != undefined && visitorDetails.Messages.Name != null && visitorDetails.Messages.Name.length > 0) {
        if (visitorDetails.Messages.ChatDate != null && visitorDetails.Messages.ChatDate.length > 0) {
            visitorDetails.Messages.ChatDate = [];
        }
    }
    var url = serviceDomain + "Handler/UpdateBasicDetails.ashx?callback=?&basicDetails=" + JSON.stringify(chatBasicDetails) + "&visitorDetails=" + JSON.stringify(visitorDetails) + "";
    $.getJSON(url, function (json) {
        if (json != undefined && json != null) {
            if (json != "0") {

                $("#lblThankYou").html("Thank you, we will get back to you shortly");
                setTimeout(function () {
                    $("#lblThankYou").html('');
                }, 60000);

                chatDetails.Privacy = 0;
                visitorDetails.Privacy = false;
                if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.disconnected) {
                    chatUtil.Start();
                }
                else {
                    if (_agent && _agent != null) {
                        $(".chatmediawrp").removeClass("hideDiv");
                        $(".chatboxtypewrp").removeClass("hideDiv");
                        $(".chatfrmwrp").addClass("hideDiv");
                        $(".chatboxcontainer").removeClass("df-ac-jcenter");
                        $("#txtP5ChatMessage").prop("disabled", false);
                        if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.connected) {
                            chatUtil.VisitorDetailsUpdate(chatBasicDetails.Name, chatBasicDetails.EmailId, chatBasicDetails.PhoneNumber, json);
                        }
                    }
                    else if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.connected) {
                        chatUtil.VisitorDetailsUpdate(chatBasicDetails.Name, chatBasicDetails.EmailId, chatBasicDetails.PhoneNumber, json);
                        GetColorDetails();
                    }
                    chatBasicUtil.ScrollMessageDiv();
                }
                setTimeout(function () {
                    if ($("#dvcontentId").is(":visible") && !_agent && _agent == null) {
                        //HidechatWindow();
                    }
                }, 1000);
                //Chandan please check and make only first time binding.
                visitorDetails.Name = chatBasicDetails.Name;
                visitorDetails.EmailId = chatBasicDetails.EmailId;
                visitorDetails.ContactNumber = chatBasicDetails.PhoneNumber;
            }
            else {
                $("#lblThankYou").html("Oops! We apologize. Something went wrong, please try again");
                setTimeout(function () {
                    $("#lblThankYou").html('');
                }, 5000);
            }
        }
        else {
            $("#lblThankYou").html("Oops! We apologize. Something went wrong, please try again");
            setTimeout(function () {
                $("#lblThankYou").html('');
            }, 5000);
        }
    });


    $("#BtnSubOffDet").attr("disabled", false);
});


$("#BtnSubOffDetCanel").click(function () {
    CancleOffLineData();
});

function CancleOffLineData() {

    if (showOptions) {
        $(".chatmediawrp").removeClass("hideDiv");
        $(".chatboxtypewrp").removeClass("hideDiv");
        $(".chatfrmwrp").addClass("hideDiv");
    } else {
        HideChat();
    }
    $("#lblThankYou").html("");
}

$(".btImgBorLt").click(function () {
    if ($("#P5MMdiv_1", window.parent.document).contents().length > 0) {
        if ($("#P5MMmainDiv", window.parent.document).is(":visible")) {
            $("#P5MMmainDiv", window.parent.document).hide();
        }
        else {
            $("#P5MMmainDiv", window.parent.document).show();
        }
    }
});

// dvChangeName
function updateName() {
    if (showOptions)
        $("#dvChangeName").html("Enter Name : <input type='text' style='width: 50%;' class='inputbox' id='txtVisitorName' onkeydown='return p5UpdateVistorName(event)' value='" + visitorDetails.Name + "' /><span style='float:right;padding-right:3px;width:10%' onclick='UpdateVisitorName();'>Save</span>");
}

function p5UpdateVistorName(event) {
    var key;
    if (window.event)
        key = window.event.keyCode; //IE
    else
        key = event.which; //firefox

    if (key == 13 && document.getElementById("txtVisitorName").value.length > 0) {
        UpdateVisitorName();
    }
    return (key != 13);
}

function UpdateVisitorName() {
    if (document.getElementById("txtVisitorName").value.length > 0) {
        chatUtil.VisitorDetailsUpdate(document.getElementById("txtVisitorName").value, "", "", 0);
        $("#dvChangeName").html("<span id='spanChangeName' onclick='updateName()'>Change Name</span>");
        if ($(".btImgBor").hasClass("active")) {
            $(".btImgBor").removeClass("active");
            $(".dvSettingMain").hide("fast");
        }
    }
}

function HideChat() {
    $('.chatmediawrp').after("<div class='dvChatexitMain'>You will be unable to chat with an agent until next session.<br/><span style='color: #fe9500;font-weight: bold;'>Do you want to disable chat?</span><br/><span>Note:- If you want to ping our agent again. Please close your current browser and come again.</span><br/><input type='button' value='YES' class='inputee' id='ui_btnPlumbChatClose' onclick='ExitChat();'>&nbsp;&nbsp;&nbsp;<input type='button' value='NO' class='inputee' onclick='HideExitChat();'></div>");
    $('.dvChatexitMain').show("fast");
}

function HideExitChat() {
    $('.dvChatexitMain').remove();
}

function ExitChat() {

    if (visitorDetails.Messages != undefined && visitorDetails.Messages.Name != null && visitorDetails.Messages.Name.length > 0) {
        if (visitorDetails.Messages.ChatDate != null && visitorDetails.Messages.ChatDate.length > 0) {
            visitorDetails.Messages.ChatDate = [];
        }
    }
    var url = serviceDomain + "Handler/ChatConditions.ashx?callback=?&Action=2&visitorInfo=" + JSON.stringify(visitorDetails) + "";
    $.getJSON(url, function (json) {
        $.each(json, function (i, loadingDetails) {
            chatBasicUtil.setCookie("ChatEnd" + visitorDetails.AdsId, "End");
            $('#plumb5ChatIframe', window.parent.document).remove();
            $("#P5MMmainDiv").hide();
        });
    });
}


$('#txtP5ChatMessage').keydown(function (e) {

    if ($.trim($(this).val()).length % 10 == 0)
        chatUtil.TypingEvent();

    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
        var message = $.trim($(this).val());
        if (message.length > 0) {
            $(this).val("");
            chatUtil.SendMessage(message);

            if (isAutoPingDoneByAgent.Status) {
                isAutoPingDoneByAgent.Status = false;
                chatUtil.VisitorResponseForAutoPing(isAutoPingDoneByAgent.Url);
            }
        }
        return false;
    }
});

$("#P5ChatMessageSend").click(function () {
    var message = $.trim($("#txtP5ChatMessage").val());
    if (message.length > 0) {
        $("#txtP5ChatMessage").val("");
        chatUtil.SendMessage(message);

        if (isAutoPingDoneByAgent.Status) {
            isAutoPingDoneByAgent.Status = false;
            chatUtil.VisitorResponseForAutoPing(isAutoPingDoneByAgent.Url);
        }
    }
    return false;
});

// Desktop Notification
$("#dvDesktopNoti").click(function () {
    chatBasicUtil.RequestForDesktopNotification();
});

//SoundNotification
//$("#dvSound").click(function () {
//    if ($("#imgSound").attr("src").indexOf("volume_loud.png") > -1) {
//        $("#imgSound").attr("src", parent.TrackerUrl.plumb5ChatDomain + "ChatDesign/volume_off.png");
//    }
//    else if ($("#imgSound").attr("src").indexOf("volume_off.png") > -1) {
//        $("#imgSound").attr("src", parent.TrackerUrl.plumb5ChatDomain + "ChatDesign/volume_loud.png");
//    }
//});

//Idle Notification For agent
var IDLE_TIMEOUT = 120; //seconds
var _idleSecondsCounter = 0;
ClearIdleData = function () {
    seenNewMesg = true;
    _idleSecondsCounter = 0;
};
parent.document.onclick = parent.document.onmousemove = parent.document.onkeypress = ClearIdleData;
document.onclick = document.onmousemove = document.onkeypress = ClearIdleData;
window.setInterval(CheckIdleTime, 1000);
function CheckIdleTime() {
    _idleSecondsCounter++;
    if (_idleSecondsCounter >= IDLE_TIMEOUT) {
        _idleSecondsCounter = 0;
        chatUtil.IdleNotification();
    }
}
//End of Idle Notification For agent
function DivActiveCall() {
    // Remove this function later on.. Before that remove from html content. 
}

function SaveToDisk(fileURL, redirectUrl, chatBannerId, bannerTitle) { // for non-IE

    chatUtil.SendBannerClickedEvent(fileURL, redirectUrl, chatBannerId, bannerTitle);

    var fileName = fileURL.substring(fileURL.lastIndexOf('/') + 1);
    fileName = fileName.substring(0, fileName.lastIndexOf('?'));

    if (!window.ActiveXObject) {
        var save = document.createElement('a');
        save.href = fileURL;
        save.target = '_blank';
        save.download = fileName || 'unknown';

        var event = document.createEvent('Event');
        event.initEvent('click', true, true);
        save.dispatchEvent(event);

        if (navigator.product == 'Gecko') {
            window.open(fileURL, '_blank');
        }
        else {
            (window.URL || window.webkitURL).revokeObjectURL(save.href);
        }
    }
    else if (!!window.ActiveXObject && document.execCommand) { // for IE
        var _window = window.open(fileURL, '_blank');
        _window.document.close();
        _window.document.execCommand('SaveAs', true, fileName || fileURL)
        _window.close();
    }
}


function HidechatWindow() {
    $("#chateventbtn").find('i').remove();
    $("#chateventbtn").css('margin-top', '');
    if ((chatDetails.CustomTitle && chatDetails.CustomTitle.length > 0) || (chatDetails.OfflineTitle && chatDetails.OfflineTitle.length > 0)) { $(".chatmesscontainer").removeClass("hideDiv").css("width", "99%"); }
    $(".chatboxcontainer,.chatoptionwrp,.chatboxtypewrp").addClass("hideDiv");
    $(".chatcontainer").removeClass("min-h-500");
    $("#chateventbtn").append("<i class='icon font-28 ion-ios-chatbubble-outline'></i>");
    //$('#plumb5ChatIframe', window.parent.document).css({ height: 280 });
}

function ShowchatWindow() {
    $("#chateventbtn").find('i').remove();
    $("#chateventbtn").css('margin-top', '');
    $("#chateventbtn").append("<i class='icon ion-android-close font-28'></i>");
    $(".chatmesscontainer").addClass("hideDiv");
    $(".chatboxcontainer,.chatcontainer,.chatoptionwrp,.chatboxtypewrp").removeClass("hideDiv");
    $(".chatcontainer").addClass("min-h-500");
    $('#plumb5ChatIframe', window.parent.document).css({ height: 600 });
};

//$("#chateventbtn").click(function () {
//    if ($(".chatbubwrp").find('i').hasClass("ion-ios-chatbubble-outline")) {
//        ShowchatWindow();
//    }
//    else if ($(".chatbubwrp").find('i').hasClass("icon ion-android-close font-28")) {
//        HidechatWindow();
//    }
//});


$("#chateventbtn").click(function () {
    if ((chatDetails.MinimisedWindow == 1)) {
        if ($("#chateventbtn").find('i').hasClass("icon font-28 ion-ios-chatbubble-outline")) {
            $(".chatmesscontainer").addClass("hideDiv");
            $(".chatcontainer").removeClass("hideDiv");
            $("#chateventbtn").find('i').remove();
            $("#chateventbtn").append("<i class='icon ion-android-close font-28'></i>");
            $(".chatprevwrp").removeClass("justify-content-end");
            chatBasicUtil.ScrollMessageDiv();
            $('#plumb5ChatIframe', window.parent.document).css({ height: 600 });
            if (!$(".chatfrmwrp").hasClass("hideDiv")) { $(".chatboxtypewrp").addClass("hideDiv"); }
            MximisedChat = 1;
        }
        else {
            $(".chatcontainer").addClass("hideDiv");
            if ($(".chatmesscontainer>p").html() != '&nbsp;') { $(".chatmesscontainer").removeClass("hideDiv"); }
            $("#chateventbtn").find('i').remove();
            $("#chateventbtn").append("<i class='icon font-28 ion-ios-chatbubble-outline'></i>");
            $(".chatprevwrp").addClass("justify-content-end");
            $('#plumb5ChatIframe', window.parent.document).css({ height: 200 });
            MximisedChat = 0;
        }
    }
    else if ($(".chatmesscontainer").hasClass("hideDiv") && (chatDetails.MinimisedWindow == 0)) {
        $("#chateventbtn").find('i').remove();
        if ($(".chatmesscontainer>p").html() != '&nbsp;') { $(".chatmesscontainer").removeClass("hideDiv"); }
        $(".chatboxcontainer,.chatoptionwrp,.chatboxtypewrp").addClass("hideDiv");
        $(".chatcontainer").removeClass("min-h-500").css("cursor", "pointer");
        $("#chateventbtn").addClass("hideDiv");
        $(".chatprevwrp").addClass("justify-content-end");
        $('#plumb5ChatIframe', window.parent.document).css({ height: 200 });
    }
    else {
        $(".chatmesscontainer").addClass("hideDiv");
        $(".chatcontainer").removeClass("hideDiv");
        $("#chateventbtn").find('i').remove();
        $("#chateventbtn").append("<i class='icon ion-android-close font-28'></i>");
        $(".chatprevwrp").removeClass("justify-content-end");
        $('#plumb5ChatIframe', window.parent.document).css({ height: 600 });
    }
    $("#chateventbtn i").css("color", "#" + CloseIconColor);
});
$(".chattitlwrp").click(function () {
    if ($(".chatboxcontainer").hasClass("hideDiv")) {
        $(".chatmesscontainer").addClass("hideDiv");
        $(".chatboxcontainer,.chatoptionwrp").removeClass("hideDiv");
        $(".chatcontainer").addClass("min-h-500").css("cursor", "default");
        //$("#chateventbtn").removeClass("hideDiv");
        //$("#chateventbtn").append("<i class='icon ion-android-close font-28'></i>");
        $('#plumb5ChatIframe', window.parent.document).css({ height: 600 });
        if ($(".chatfrmwrp").hasClass("hideDiv")) { $(".chatboxtypewrp").removeClass("hideDiv"); }
        MximisedChat = 1;
    }
    else if ($(".chatmesscontainer").hasClass("hideDiv") && (chatDetails.MinimisedWindow == 0)) {
        $("#chateventbtn").find('i').remove();
        if ($(".chatmesscontainer>p").html() != '&nbsp;') { $(".chatmesscontainer").removeClass("hideDiv"); }
        $(".chatboxcontainer,.chatoptionwrp,.chatboxtypewrp").addClass("hideDiv");
        $(".chatcontainer").removeClass("min-h-500").css("cursor", "pointer");
        $("#chateventbtn").addClass("hideDiv");
        $(".chatprevwrp").addClass("justify-content-end");
        $('#plumb5ChatIframe', window.parent.document).css({ height: 200 });
        MximisedChat = 0;
    }
    chatBasicUtil.ScrollMessageDiv();
});

$(".chatclsewrp").click(function () {
    $(".chatmesscontainer").addClass("hideDiv");
    if ($("#chateventbtn").hasClass("hideDiv")) {
        $(".chattitlwrp").click();
    }
    else {
        $("#chateventbtn").click();
    }
});


//SoundNotification
$(".muteevent").click(function () {
    let checkmuteicn = $(".muteevent i").hasClass("ion-android-volume-up");
    if (checkmuteicn == true) {
        $("#imgSound").attr("src", parent.TrackerUrl.MainUrl + "/volume_off.png");

        $(".chatoptionwrp .tdcreatedraft a.muteevent i")
            .removeClass("ion-android-volume-up")
            .addClass("ion-android-volume-off");
        $(".chatoptionwrp .tdcreatedraft a.muteevent span").text("mute");
    } else {
        $("#imgSound").attr("src", parent.TrackerUrl.MainUrl + "/volume_loud.png");
        $(".chatoptionwrp .tdcreatedraft a.muteevent i")
            .removeClass("ion-android-volume-off")
            .addClass("ion-android-volume-up");
        $(".chatoptionwrp .tdcreatedraft a.muteevent span").text("Unmute");
    }
});

