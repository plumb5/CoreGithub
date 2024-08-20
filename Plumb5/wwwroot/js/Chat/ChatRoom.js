
var ValidRecommendationsFileTypes = ['tiff', 'pjp', 'jfif', 'bmp', 'gif', 'svg', 'png', 'xbm', 'dib', 'jxl', 'jpeg', 'svgz', 'jpg', 'webp', 'ico', 'tif', 'pjpeg', 'avif', 'pdf'];
var SoundNotificationErrormsg = "";
var adsId = 0, chatId = 0;
var OnlineClicked = false, SignOutClicked = false, TransferStatus = false;
var chatRoom = {
    UserId: "", ChatId: 0, MachineId: "", Name: "", EmailId: "", IsAdmin: 0, ChatRepeatTime: 0, IsBlockUser: 0, Comments: "",
    SoundNotify: "", SoundNewVisitorNotify: "", SoundNotificationOnVisitorConnect: "", DesktopNotifyForNewVisitor: 0, InstantMesgOption: 0, IMNetWork: "", IMEmailId: "", IMVerfication: 0,
    City: "", StateName: "", Country: "", WhoBlocked: 0
};
var CustomFields = [];

var UserId = "", Name = "", SoundNotify = "", SoundNewVisitorNotify = "", SoundNotificationOnVisitorConnect = "", DesktopNotifyForNewVisitor = 0, InstantMesgOption = 0, IMNetWork = "", IMEmailId = "", IMVerfication = 0, City = "", AgentAwayMesg = "", ShowIfAgentOnline = false;
var messageList = new Array();
var ChatDetails = { Id: 0, Name: "" };

var EndchatId = 0, BanVisitorId = 0;
var EmployeeCode = "";

$(document).ready(function () {
    ShowPageLoading();
    adsId = $("#hdnAdsId").val();
    chatRoom.ChatId = chatId = parseInt($.urlParam("ChatId"));
    UserId = chatRoom.UserId = $("#hdnAgentId").val();
    Name = chatRoom.Name = $("#hdnAgentUserName").val();
    EmployeeCode = $("#hdnEmployeeCode").val();

    chatRoomUtil.BindAgentDetails();
    chatRoomUtil.GetChatDetails();
    chatRoomUtil.GetExtraFiels();
    RecommendationUtil.GetRecommendationList(-1, 0);
});

var chatRoomUtil = {
    LogIn: function () {
        try {
            ChatStartFromAgent();
            OnlineClicked = true;
        }
        catch (Error) {
            ShowErrorMessage(GlobalErrorList.ChatRoom.AgenLogin_Waiting);
        }
    },
    GetChatDetails: function () {
        ChatDetails.Id = chatRoom.ChatId;

        $.ajax({
            url: "/Chat/AllChat/GetDetails",
            type: 'Post',
            data: JSON.stringify({ 'chat': ChatDetails }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("#ui_ChatRoomName").html(response.Name);
            },
            error: ShowAjaxError
        });
    },
    UpdateBrowserNotification: function () {

        if (($("input:radio[name='chatsendnotif']").is(":checked")) == false) {
            ShowErrorMessage(GlobalErrorList.ChatRoom.BrowserNotificationSelect_Error);
            return false;
        }
        ShowPageLoading();

        let DesktopNotifyValue = $("input:radio[name='chatsendnotif']:checked").val();
        chatRoom.DesktopNotifyForNewVisitor = DesktopNotifyValue;
        DesktopNotifyForNewVisitor = DesktopNotifyValue;
        $.ajax({
            url: "/Chat/ChatRoom/DesktopNotification",
            type: 'POST',
            data: JSON.stringify({ 'chatRoom': chatRoom }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.ChatRoom.DesktopNotificationSave_Success);
                    chatHelper.RequestDesktopPermission();
                    chatRoomUtil.CheckNotifyIfthere();

                }
                else {
                    ShowSuccessMessage(GlobalErrorList.ChatRoom.DesktopNotificationSave_Error);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    UpdateSoundNotification: function () {
        if (!chatRoomUtil.ValidateSoundNotification()) {
            return false;
        }
        ShowPageLoading();
        chatRoom.SoundNotify = "0";
        SoundNotify = 0;

        chatRoom.SoundNewVisitorNotify = "0";
        SoundNewVisitorNotify = 0;

        chatRoom.SoundNotificationOnVisitorConnect = "0";
        SoundNotificationOnVisitorConnect = 0;

        if ($("#chatsoundoneverymess").is(":checked") && $("#dllSoundNotificationOnEveryMessage").get(0).selectedIndex > 0) {
            chatRoom.SoundNotify = $("#dllSoundNotificationOnEveryMessage").val();
            SoundNotify = $("#dllSoundNotificationOnEveryMessage").val();
        }

        if ($("#chatsoundonnewmess").is(":checked") && $("#dllSoundNotiAgentOnVisitorMesg").get(0).selectedIndex > 0) {
            chatRoom.SoundNewVisitorNotify = $("#dllSoundNotiAgentOnVisitorMesg").val();
            SoundNewVisitorNotify = $("#dllSoundNotiAgentOnVisitorMesg").val();
        }

        if ($("#chatsoundonvisitmess").is(":checked") && $("#dllSoundNotificationOnVisitorConnect").get(0).selectedIndex > 0) {
            chatRoom.SoundNotificationOnVisitorConnect = $("#dllSoundNotificationOnVisitorConnect").val();
            SoundNotificationOnVisitorConnect = $("#dllSoundNotificationOnVisitorConnect").val();
        }


        $.ajax({
            url: "/Chat/ChatRoom/SoundNotify",
            type: 'POST',
            data: JSON.stringify({ 'chatRoom': chatRoom }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.ChatRoom.SoundNotifySave_Success);
                    //ShowSuccessMessage("Sound Notification saved");
                }
                else {
                    ShowErrorMessage(GlobalErrorList.ChatRoom.SoundNotifySave_Error);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });

    },
    ValidateSoundNotification: function () {

        if ($("#chatsoundoneverymess").is(":checked") && $("#dllSoundNotificationOnEveryMessage").get(0).selectedIndex == 0) {
            ShowErrorMessage(GlobalErrorList.ChatRoom.ValidateSoundNotifyNewMsg_Error);
            return false;
        }

        if ($("#chatsoundonnewmess").is(":checked") && $("#dllSoundNotiAgentOnVisitorMesg").get(0).selectedIndex == 0) {
            ShowErrorMessage(GlobalErrorList.ChatRoom.ValidateSoundNotifyVisitorMsg_Error);
            return false;
        }

        if ($("#chatsoundonvisitmess").is(":checked") && $("#dllSoundNotificationOnVisitorConnect").get(0).selectedIndex == 0) {
            ShowErrorMessage(GlobalErrorList.ChatRoom.ValidateSoundNotifyVisitorConnect_Error);
            return false;
        }

        return true;

    },
    BindAgentDetails: function () {
        $.ajax({
            url: "/Chat/ChatRoom/GetAgentData",
            data: JSON.stringify({ 'chatRoom': chatRoom }),
            dataType: "json",
            type: "POST",
            async: false,
            contentType: "application/json; charset=utf-8",
            dataFilter: function (data) { return data; },
            success: function (response) {
                chatRoomUtil.BindVisitorDetails(response);
            },
            error: ShowAjaxError
        });
    },
    BindVisitorDetails: function (agentDetails) {
        Name = agentDetails.Name;
        City = agentDetails.City;
        SoundNotify = agentDetails.SoundNotify;
        SoundNewVisitorNotify = agentDetails.SoundNewVisitorNotify;
        SoundNotificationOnVisitorConnect = agentDetails.SoundNotificationOnVisitorConnect;
        AgentAwayMesg = agentDetails.AgentAwayMesg;
        DesktopNotifyForNewVisitor = agentDetails.DesktopNotifyForNewVisitor;
        IMNetWork = agentDetails.IMNetWork;
        IMEmailId = agentDetails.IMEmailId;
        ShowIfAgentOnline = agentDetails.ShowIfAgentOnline;
        var SuggestionMesg = agentDetails.SuggestionMesg;
        if (agentDetails.AutoMessageToVisitor != null && agentDetails.AutoMessageToVisitor.length > 0) {
            messageList = JSON.parse(agentDetails.AutoMessageToVisitor);
        }
        $("#lblAgentName").html(Name);

        $("input:radio[name='chatsendnotif'][value='" + DesktopNotifyForNewVisitor + "']").prop('checked', true);

        if (SoundNotify != null && SoundNotify != 0) {
            $("#chatsoundoneverymess").prop('checked', true);
            $("#dllSoundNotificationOnEveryMessage").val(SoundNotify).trigger("change");
            $("#ui_divchatsoundoneverymess").removeClass("hideDiv");
        }
        if (SoundNewVisitorNotify != null && SoundNewVisitorNotify != 0) {
            $("#chatsoundonnewmess").prop('checked', true);
            $("#dllSoundNotiAgentOnVisitorMesg").val(SoundNewVisitorNotify).trigger("change");
            $("#ui_divchatsoundonnewmess").removeClass("hideDiv");
        }
        if (SoundNotificationOnVisitorConnect != null && SoundNotificationOnVisitorConnect != 0) {
            $("#chatsoundonvisitmess").prop('checked', true);
            $("#dllSoundNotificationOnVisitorConnect").val(SoundNotificationOnVisitorConnect).trigger("change");
            $("#ui_divchatsoundonvisitmess").removeClass("hideDiv");
        }


        $("#ddlImNetwork").val(IMNetWork);
        $("#txtImEmailId").val(IMEmailId);

        if (City && City.length > 0) {
            var cityList = City.split(",");
            for (var i = 0; i < cityList.length; i++) {
                var data = new Array();
                data["item"] = new Array();
                data.item.value = cityList[i];
                data.item.label = cityList[i];
                AppendSelected("ui_txtCity_values", data, "ChatCity");
            }
            $("#ui_agentCityFilter").html(" * Only visitiors form " + City + " will assign to you");
        }

        if (SuggestionMesg && SuggestionMesg.length > 0) {
            var eachSuggestion = SuggestionMesg.split("|");

            $("#P5txtChat").autocomplete({ source: eachSuggestion });
        }
    },
    GetExtraFiels: function () {
        $.ajax({
            url: "/Chat/ChatRoom/GetContactExtraField",
            type: 'Post',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (response) {
                $.each(response, function () {
                    CustomFields.push($(this)[0].FieldName);
                });
            },
            error: ShowAjaxError
        });
    },
    GetExtension: function (fileName) {
        return GetFileExtension(fileName)[0].toLowerCase();
    },
    UpdateVisitoDetails: function () {
        ShowPageLoading();
        var userId = toVisitorId;
        var name = $.trim($("#ui_txtVisitorName").val());
        var emailId = $.trim($("#ui_txtVisitorContactMailId").val());
        var contactNumber = $.trim($("#ui_txtVisitorContactNumber").val());
        var comment = $.trim($("#ui_txtVisitorsNote").val());

        $.ajax({
            url: "../Chat/ChatRoom/UpdateVisitorSummary",
            type: 'POST',
            data: JSON.stringify({ 'chatId': chatId, 'UserId': userId, 'name': name, 'emailId': emailId, 'phoneNumber': contactNumber, 'comment': comment }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                HidePageLoading();
                if (response.Status) {
                    chatUtil.UpdateVisitorSummary(name, emailId, contactNumber, comment, response.ContactId);
                    ShowSuccessMessage(GlobalErrorList.ChatRoom.UpdateVisitor_Success);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.ChatRoom.UpdateVisitor_Error);
                }

            },
            error: ShowAjaxError
        });

    },
    ValidateContactUpdate: function () {
        if ($.trim($("#ui_txtVisitorContactMailId").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.ChatRoom.ValidateEmail_Error);
            return false;
        }

        if ($.trim($("#ui_txtVisitorContactMailId").val()).length > 0 && !regExpEmail.test($.trim($("#ui_txtVisitorContactMailId").val()))) {
            ShowErrorMessage(GlobalErrorList.ChatRoom.ValidateEmailValid_Error);
            return false;
        }

        if ($.trim($("#ui_txtVisitorContactNumber").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.ChatRoom.ValidatePhoneNumber_Error);
            return false;
        }

        if ($.trim($("#ui_txtVisitorContactNumber").val()).length > 0 && !ValidateMobilNo($.trim($("#ui_txtVisitorContactNumber").val()))) {
            ShowErrorMessage(GlobalErrorList.ChatRoom.ValidatePhoneNumberValid_Error);
            return false;
        }

        return true;
    },
    SendTranscriptMail: function () {
        ShowPageLoading();
        var tranUserId = $("#btnExportTrans").attr("visitorId");
        var emailId = $.trim($("#txtSendEmailId").val());
        $.ajax({
            url: "/Chat/ChatRoom/SendTranscriptMail",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': adsId, 'chatId': chatId, 'userId': tranUserId, 'emailId': emailId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (responce) {
                if (responce == 1)
                    ShowErrorMessage(GlobalErrorList.ChatRoom.SendTranscriptMail_Error);
                else {
                    ShowSuccessMessage(GlobalErrorList.ChatRoom.SendTranscriptMail_Success);
                }
                HidePageLoading();
            },
            error: ShowAjaxError,
        });
    },
    BlockVisitor: function (visitorId) {
        $.ajax({
            url: "../Chat/ChatRoom/BlockParticularUser",
            type: 'POST',
            data: JSON.stringify({ 'chatId': chatId, 'ChatUserId': visitorId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response == 1) {
                    ShowSuccessMessage(GlobalErrorList.ChatRoom.BlockVisitor_Success);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.ChatRoom.BlockVisitor_Error);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });

    },
    UpdateAgentName: function () {
        if ($.trim($("#txtName").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.ChatRoom.ValidateAgentName_Error);
            return;
        }

        Name = chatRoom.Name = $.trim($("#txtName").val());

        $.ajax({
            url: "../Chat/ChatRoom/CityAndNameSetting",
            type: 'POST',
            data: JSON.stringify({ 'chatRoom': chatRoom }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    chatAgent.Name = Name;
                    if (OnlineClicked) {
                        chatUtil.UpdateAgentName(Name);
                    }
                    $("#ui_txtAgentName").text(Name);
                    $("#ui_txtAgent").html(Name);
                    $("#ui_divAgentNamePopUp").modal('hide');
                    ShowSuccessMessage(GlobalErrorList.ChatRoom.UpdateAgentName_Success);
                    HidePageLoading();
                }
                else {
                    ShowErrorMessage(GlobalErrorList.ChatRoom.UpdateAgentName_Error);
                }
            },
            error: ShowAjaxError
        });
    },
    CheckNotifyIfthere: function () {
        var isChrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());

        if (window.webkitNotifications == undefined && !isChrome) {
            window.open("https://addons.mozilla.org/en-US/firefox/addon/html-notifications/");
        }

        if (window.webkitNotifications) {
            var havePermission = window.webkitNotifications.checkPermission();
            if (havePermission != 0) {

                window.webkitNotifications.requestPermission();
            }
        }
    },
    ClearVisitorDetails: function () {
        $("#ui_Location,#ui_State,#ui_Country,#ui_Platform,#ui_Browser,#ui_IPAddress,#ui_ChatLoaded,#ui_ChatInitiated,#ui_SiteVisits,#ui_TimeonChat,#ui_TimeonSite,#ui_PageVisits,#ui_LastPage,#ui_Source").html('');
        $("#ui_txtVisitorsNote,#ui_txtVisitorName,#ui_txtVisitorContactMailId,#ui_txtVisitorContactNumber,#ui_txtVisitorsNote").val('');
    },
    CloseAcceptTransferPopUp: function () {
        $("#dvAcceptTransferChat").modal('hide');
        TransferStatus = false;
    },
    CloseChatTransferPopUp: function () {
        $("#ui_btnTransfer").removeAttr("agentId");
        $("#ui_btnTransfer").removeAttr("visitorId");
        $("#ui_btnTransfer").removeAttr("visitorname");
        $("#ui_btnTransfer").addClass("hideDiv");
        $("#ui_txtReasonForTransfer").val('');
        $("#chattransfer").modal('hide');
    }
}


$("#ui_dvActiveAgents").click(function () {
    ShowPageLoading();
    $("#ui_dvActiveVisitors").removeClass("active");
    $("#ui_dvActiveAgents").addClass("active"); ui_txtVisitorContactMailId
    $("#dvContacts").addClass("hideDiv");
    $("#ui_divActiveAgents").removeClass("hideDiv");
    chatUtil.GetAllOnlineAgents();
    HidePageLoading();
});
$("#ui_dvActiveVisitors").click(function () {
    ShowPageLoading();
    $("#ui_dvActiveVisitors").addClass("active");
    $("#ui_dvActiveAgents").removeClass("active");
    $("#dvContacts").removeClass("hideDiv");
    $("#ui_divActiveAgents").addClass("hideDiv");
    ChatStartFromAgent();
    HidePageLoading();
});


$("#ui_btnbrowserNotifySave").click(function () {
    chatRoomUtil.UpdateBrowserNotification();

});

$("#ui_btnsoundNotifySave").click(function () {
    chatRoomUtil.UpdateSoundNotification();
});

$("#ui_divlivechat").click(function () {
    ClearActiveDiv();
    $("#ui_divlivechat").addClass("active");
    $("#livechat").removeClass("hideDiv");
});

$("#ui_divpastchat").click(function () {
    ClearActiveDiv();
    $("#ui_divpastchat").addClass("active");
    $("#pastchat").removeClass("hideDiv");
});

$("#ui_divchatvisitordetails").click(function () {
    ClearActiveDiv();
    $("#ui_divchatvisitordetails").addClass("active");
    $("#chatvisitordetails").removeClass("hideDiv");

});

$("#ui_divchatbanreport").click(function () {
    ClearActiveDiv();
    $("#ui_divchatbanreport").addClass("active");
    $("#chatbanreport").removeClass("hideDiv");

});

$("#ui_divchatrecommendat").click(function () {
    ClearActiveDiv();
    $("#ui_divchatrecommendat").addClass("active");
    $("#chatrecommendat").removeClass("hideDiv");
});

$("#ui_divchatagentprofile").click(function () {
    ClearActiveDiv();
    $("#ui_divchatagentprofile").addClass("active");
    $("#chatagentprofile").removeClass("hideDiv");
    $("#ui_txtAgentName").text(Name);
    $("#ui_txtAgent").html(Name);

    if (EmployeeCode != null && EmployeeCode != "")
        $("#ui_txtAgentCode").html(EmployeeCode);
    else
        $("#ui_txtAgentCode").html("NA");
});

$("#ui_divchatnotificat").click(function () {
    ClearActiveDiv();
    $("#ui_divchatnotificat").addClass("active");
    $("#chatnotificat").removeClass("hideDiv");
});


function ClearActiveDiv() {
    $("#ui_divlivechat,#ui_divpastchat,#ui_divchatvisitordetails,#ui_divchatbanreport,#ui_divchatrecommendat,#ui_divchatagentprofile,#ui_divchatnotificat").removeClass("active");
    $("#livechat,#pastchat,#chatvisitordetails,#chatbanreport,#chatrecommendat,#chatagentprofile,#chatnotificat").addClass("hideDiv");

}

$("#chatsoundoneverymess, #chatsoundonnewmess,#chatsoundonvisitmess").click(function () {

    if ($("#chatsoundoneverymess").is(":checked"))
        $("#ui_divchatsoundoneverymess").removeClass("hideDiv");
    else {
        $("#dllSoundNotificationOnEveryMessage").get(0).selectedIndex = 0;
        $("#ui_divchatsoundoneverymess").addClass("hideDiv");
    }

    if ($("#chatsoundonnewmess").is(":checked"))
        $("#ui_divchatsoundonnewmess").removeClass("hideDiv");
    else {
        $("#dllSoundNotiAgentOnVisitorMesg").get(0).selectedIndex = 0;
        $("#ui_divchatsoundonnewmess").addClass("hideDiv");
    }

    if ($("#chatsoundonvisitmess").is(":checked"))
        $("#ui_divchatsoundonvisitmess").removeClass("hideDiv");
    else {
        $("#dllSoundNotificationOnVisitorConnect").get(0).selectedIndex = 0;
        $("#ui_divchatsoundonvisitmess").addClass("hideDiv");
    }

});


//Update Contact Visitor's details
$("#ui_btnUpdateContact").click(function () {
    var userId = toVisitorId;
    if (userId != "0") {
        if (chatRoomUtil.ValidateContactUpdate())
            chatRoomUtil.UpdateVisitoDetails();
    }
});


function GetPastChatMessage(newVisitorId) {
    $.ajax({
        url: "../Chat/ChatRoom/GetPastChat",
        type: 'POST',
        data: JSON.stringify({ 'chatId': chatId, 'UserId': newVisitorId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null) {
                var messageDetails = response
                PastMessageDetails[messageDetails.UserId] = messageDetails;
            }
        },
        error: ShowAjaxError
    });
}

function GetPastEvents(visitorId) {
    $.ajax({
        url: "/Chat/ChatRoom/GetPastEvent",
        type: 'POST',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'ChatUserId': visitorId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null) {
                var eventDetails = response.EventData;
                EventOfVisitor[response.UserId] = eventDetails;
            }
        },
        error: ShowAjaxError
    });
}

//Ban Visitor

$(document).on('click', "#dv_BanVisitor", function () {
    BanVisitorId = $(this).attr("data-BanVisitorId");
    var visitor = chatHelper.GetVisitorFromList(BanVisitorId);
    $("#ui_banVisitorId").html(visitor.UserId);
});

$("#banVisitorConfirm").click(function () {
    ShowPageLoading();
    chatHelper.BanVisitorChat(BanVisitorId);
    chatRoomUtil.BlockVisitor(BanVisitorId);

});

//End Visitor
$(document).on('click', "#dv_EndChat", function () {
    EndchatId = $(this).attr("data-EndChatId");
    var visitor = chatHelper.GetVisitorFromList(EndchatId);
    $("#ui_endVisitorId").html(visitor.UserId);
});

$("#endChatConfirm").click(function () {
    ShowPageLoading();
    chatHelper.EndVisitorChat(EndchatId);
    HidePageLoading();
})


//Transfer Visitor

$(document).on('click', "#dv_TransferChat", function () {
    $(".chattranviswrp").removeClass("hideDiv");
    $(".lvechattransfrm").addClass("hideDiv");
    var TranscriptId = $(this).attr("data-TransferChatId");
    var visitor = chatHelper.GetVisitorFromList(TranscriptId);
    $("#ui_btnTransfer").attr("visitorname", visitor.Name.toString())
    $("#ui_btnTransfer").attr("visitorId", visitor.UserId.toString());
    chatUtil.GetAllAgentStatus();
});

//Mail Transcript

$(document).on('click', "#dv_Transcript", function () {
    $("#txtSendEmailId").val('');
    var TranscriptId = $(this).attr("data-TranscriptId");
    $("#btnExportTrans").attr("visitorId", TranscriptId);
});


$("#btnExportTrans").click(function () {
    if (regExpEmail.test($("#txtSendEmailId").val())) {
        chatRoomUtil.SendTranscriptMail();
    }
    else {
        ShowErrorMessage(GlobalErrorList.ChatRoom.ValidateTranscriptMail_Error);
    }
});

var listOfVisitor = [];
function CheckForSendingAutoMessage(UserId, message, callback, AutoPingUrlCondition, IsAutoPingMessage) {
    var AutoMessageEventName = "AutoMessageEvent" + GetTodayDateAsNumber();
    if (localStorage.getItem(AutoMessageEventName) != undefined) {
        var jsonContent = localStorage.getItem(AutoMessageEventName);
        listOfVisitor = JSON.parse(jsonContent);
    }
    var conditionState = false;

    var visitorLogInformation = AutoMessageGetValuesOfKey(UserId);

    if (IsAutoPingMessage && message != null && message.length > 0) {

        if (AutoPingUrlCondition == null || AutoPingUrlCondition.length < 2 || visitorLogInformation.Content.ChatInitiatedUrl.indexOf(ActualUrlWithOutHttpWww(AutoPingUrlCondition.replace(/\/$/, ""), true)) < 0)
            if (visitorLogInformation.Content.AutoMessages.indexOf(message) < 0) {
                visitorLogInformation.Content.AutoMessages.push(message);
                AutoMessageUpdateValuesOfKey(UserId, visitorLogInformation);
                conditionState = true;
            }
        if (conditionState)
            callback();
    }
    else if (!IsAutoPingMessage && AutoPingUrlCondition != undefined && AutoPingUrlCondition.length > 0) {

        AutoPingUrlCondition = ActualUrlWithOutHttpWww(AutoPingUrlCondition.replace(/\/$/, ""), true);

        if (visitorLogInformation.Content.ChatInitiatedUrl.indexOf(AutoPingUrlCondition) < 0) {
            visitorLogInformation.Content.ChatInitiatedUrl.push(AutoPingUrlCondition);
            AutoMessageUpdateValuesOfKey(UserId, visitorLogInformation);
        }
    }
    var jsonContent = JSON.stringify(listOfVisitor);
    localStorage.setItem(AutoMessageEventName, jsonContent);
}

function AutoMessageGetValuesOfKey(key) {
    for (var i = 0; i < listOfVisitor.length; i++)
        if (listOfVisitor[i].UserId == key) {
            return listOfVisitor[i].Content;
        }
    return { UserId: key, Content: { AutoMessages: [], ChatInitiatedUrl: [] } };
}

function AutoMessageUpdateValuesOfKey(key, visitorMessageAndUrlDetails) {
    var updated = false;
    for (var i = 0; i < listOfVisitor.length; i++)
        if (listOfVisitor[i].UserId == key) {
            updated = true;
            listOfVisitor[i].Content.visitorMessageAndUrlDetails;
        }
    if (!updated) {
        var newUserContent = { UserId: key, Content: visitorMessageAndUrlDetails };
        listOfVisitor.push(newUserContent);
    }
}

function GetTodayDateAsNumber() {
    var d = new Date();
    return d.getYear() + '' + d.getMonth() + '' + d.getDate();
}

//Update Agent Name

$("#ui_iAgentNameChange").click(function () {
    $("#txtName").val($("#ui_txtAgentName").text());
    $('#ui_divAgentNamePopUp').modal();
});

$("#ui_btnCloseAgentNamePopUp,#ui_btnTopCloseAgentNamePopUp").click(function () {
    $("#txtName").val('');
    $("#ui_divAgentNamePopUp").modal('hide');
});

$("#btn_UpdateName").click(function () {
    ShowPageLoading();
    chatRoomUtil.UpdateAgentName();
});

//on window close
window.onbeforeunload = function () {
    if (OnlineClicked && !SignOutClicked) {
        return "Please Sign Out before leaving Chat Room";
    }
}

$(window).on('beforeunload', function (e) {
    if (OnlineClicked && !SignOutClicked) {
        return "Please Sign Out before leaving Chat Room";
    }
});

//Sound play
ListenSound = function (SoundNotify) {
    if (SoundNotify && SoundNotify.length > 1) {
        if (window.HTMLAudioElement) {
            try {
                var oAudio = document.getElementById('ui_playAudio');
                oAudio.src = "../images/Audio/" + SoundNotify + "";
                oAudio.play();
            }
            catch (e) {
                if (window.console && console.error("Error:" + e));
            }
        }
    }
};

//Close Transfer chat popup
$('#ui_trnsferchatClose,#ui_cncelTrnsferchat').click(function () {
    chatRoomUtil.CloseChatTransferPopUp();
});


//*************Chat Recommendation Start***************

var RecommendationList = [];
var RecommendationUtil = {
    GetRecommendationList: function (OffSet, FetchNext) {
        $.ajax({
            url: "/Chat/ChatRoom/GetBannerList",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'OffSet': OffSet, 'FetchNext': FetchNext }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    RecommendationUtil.BindBannerData(response);
                }
                else if ($("#ui_BannerImages").children().length == 0) {
                    $("#ui_BannerImages").append("<div id='nobanner'>No data</div>");
                }
            },
            error: ShowAjaxError
        });
    },
    BindBannerData: function (response) {
        $.each(response, function () {
            var BannerContent = $(this)[0].BannerContent;
            var BannerTitle = $(this)[0].BannerTitle;
            var RedirectUrl = $(this)[0].RedirectUrl;
            var BannerId = $(this)[0].Id;
            var BannerExtension = chatRoomUtil.GetExtension(BannerContent);
            var BannerPreviewSrc = "";
            if (BannerExtension == "pdf") {
                BannerPreviewSrc = "/Content/images/pdf-img.jpg";
            } else {
                BannerPreviewSrc = BannerContent;
            }

            var ShowBannerTitle = "NA";
            if (BannerTitle != undefined && BannerTitle != null && BannerTitle.length > 0) {
                ShowBannerTitle = BannerTitle;
            }

            var BannerDivContent = `<div class="gall-col-4 gall-col-lmob-6 gall-col-pmob-12 p-gut mb-2" id="ui_divEachBanned_${BannerId}">
                                        <div class="chatbangalwrp">
                                            <img data-toggle="modal" class="addchatoffbanbtn" src="${BannerPreviewSrc}" alt="BannerPreview" title="${ShowBannerTitle}" onclick="RecommendationUtil.OpenUpdatePopUp(${BannerId},'${BannerContent}','${BannerTitle}','${RedirectUrl}');" />
                                            <div class="chatbancaptwrp">
                                                <div class="w-75 text-truncate" title="${ShowBannerTitle}">${ShowBannerTitle}</div>
                                                <div class="sharebtnwrp">
                                                    <button type="button" class="btn btn-purple" onclick="RecommendationUtil.SendBannerToVisitor(${BannerId},'${BannerContent}','${BannerTitle}','${RedirectUrl}');"><i class="fa fa-paper-plane"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;

            $("#ui_DivBannerImages").append(BannerDivContent);
        });
    },
    OpenUpdatePopUp: function (BannerId, BannerContent, BannerTitle, RedirectUrl) {
        RecommendationUtil.ClearRecommendationsPopUp();
        var BannerExtension = chatRoomUtil.GetExtension(BannerContent);
        $("#ui_h5RecommendationPopUpHeading").html("Edit Recommendations Banner");
        $("#ui_divRecommendationsUploadType").addClass("hideDiv");
        $("#ui_btnSaveRecommendationFile").html("Update");
        $("#ui_btnSaveRecommendationFile").prop("BannerId", BannerId);
        $("#ui_btnSaveRecommendationFile").prop("BannerContent", BannerContent);

        $("#ui_btnShowDeleteRecommendationPopUp").removeClass("hideDiv");
        $("#ui_btnShowDeleteRecommendationPopUp").prop("BannerId", BannerId);
        $("#ui_btnShowDeleteRecommendationPopUp").prop("BannerContent", BannerContent);

        $("#ui_txtRecommendationsFileRedirectUrl").prop('disabled', false);
        $("#ui_txtRecommendationsFileRedirectUrl").val('');
        $("#ui_divRecommendationsFileDefaultPreview").addClass("hideDiv");
        if (BannerExtension == "pdf") {
            $("#ui_imgRecommendationsFilePreviewUrl").attr('src', '/Content/images/pdf-img.jpg');
            $("#ui_txtRecommendationsFileRedirectUrl").prop('disabled', true);
        } else {
            $("#ui_imgRecommendationsFilePreviewUrl").attr('src', BannerContent);
            if (RedirectUrl != undefined && RedirectUrl != null && RedirectUrl != 'null' && RedirectUrl.length > 0) {
                $("#ui_txtRecommendationsFileRedirectUrl").val(RedirectUrl);
            }
        }
        $("#ui_divRecommendationsFileActualPreview").removeClass("hideDiv");
        $("#ui_txtRecommendationsFileTitle").val('');
        if (BannerTitle != undefined && BannerTitle != null && BannerTitle != 'null' && BannerTitle.length > 0) {
            $("#ui_txtRecommendationsFileTitle").val(BannerTitle);
        }
        $("#ui_divRecommendationPopUp").modal("show");
    },
    OpenDeletePopUp: function (BannerId, BannerContent) {
        $("#ui_divRecommendationPopUp").modal("hide");
        RecommendationUtil.ClearRecommendationsPopUp();
        var BannerExtension = chatRoomUtil.GetExtension(BannerContent);
        if (BannerExtension == "pdf") {
            $("#ui_imgDeleteRecommendationsFilePreviewUrl").attr('src', '/Content/images/pdf-img.jpg');
        } else {
            $("#ui_imgDeleteRecommendationsFilePreviewUrl").attr('src', BannerContent);
        }
        $("#ui_btnDeleteRecommendationConfirm").prop("BannerId", BannerId);
        $("#ui_btnDeleteRecommendationConfirm").prop("BannerContent", BannerContent);
        $("#ui_divRecommendationDeletePopUp").modal("show");
        HidePageLoading();
    },
    ClearRecommendationsPopUp: function () {
        $("#ui_h5RecommendationPopUpHeading").html("Add Recommendations Banner");
        $("#ui_btnShowDeleteRecommendationPopUp").addClass("hideDiv");
        $("#ui_btnSaveRecommendationFile").html("Save");
        $("#ui_btnSaveRecommendationFile").removeProp("BannerId");
        $("#ui_btnSaveRecommendationFile").removeProp("BannerContent");
        $("#ui_btnShowDeleteRecommendationPopUp").removeProp("BannerId");
        $("#ui_btnShowDeleteRecommendationPopUp").removeProp("BannerContent");
        $("#ui_btnDeleteRecommendationConfirm").removeProp("BannerId");
        $("#ui_btnDeleteRecommendationConfirm").removeProp("BannerContent");
        $("#ui_divRecommendationsTypeOnline,#ui_divRecommendationsTypeUpload,#ui_divRecommendationsFileBrowseShow,#ui_divRecommendationsFileDefaultPreview,#ui_divRecommendationsFileActualPreview").addClass("hideDiv");
        $("#ui_txtRecommendationsOnlineUrl").val('');
        $("#ui_fileRecommendationsFileBrowse").val('');
        $("#ui_divRecommendationsFileBrowseFileName").html('');
        $("#ui_imgRecommendationsFilePreviewUrl").attr('src', '');
        $("#ui_imgDeleteRecommendationsFilePreviewUrl").attr('src', '');
        $("#ui_txtRecommendationsFileTitle").val('');
        $("#ui_txtRecommendationsFileRedirectUrl").val('');
        $("#ui_txtRecommendationsFileRedirectUrl").prop('disabled', false);
    },
    GetUrlFileExtension: function (url) {
        url = url.toLowerCase();
        return (url = url.substr(1 + url.lastIndexOf("/")).split('?')[0]).substr(1 + url.lastIndexOf("."));
    },
    ValidateFileOnlineUrl: function () {
        if ($("#ui_txtRecommendationsOnlineUrl").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.ChatRoom.ValidateUrl_Error);
            $("#ui_txtRecommendationsOnlineUrl").focus();
            return false;
        }

        if (!regExpUrl.test($("#ui_txtRecommendationsOnlineUrl").val())) {
            ShowErrorMessage(GlobalErrorList.ChatRoom.ValidateValidUrl_Error);
            $("#ui_txtRecommendationsOnlineUrl").focus();
            return false;
        }

        var ResourceUrl = $.trim($("#ui_txtRecommendationsOnlineUrl").val());
        ResourceUrl = ResourceUrl.replace("https://", "").replace("http://", "").replace("//", "");

        if (ResourceUrl.indexOf("/") <= -1) {
            ShowErrorMessage(GlobalErrorList.ChatRoom.ValidateValidUrl_Error);
            $("#ui_txtRecommendationsOnlineUrl").focus();
            return false;
        }

        var FileExtension = RecommendationUtil.GetUrlFileExtension(ResourceUrl);

        if (ValidRecommendationsFileTypes.indexOf(FileExtension) <= -1) {
            ShowErrorMessage(GlobalErrorList.ChatRoom.ValidateValidUrl_Error);
            $("#ui_txtRecommendationsOnlineUrl").focus();
            return false;
        }

        $("#ui_txtRecommendationsFileRedirectUrl").prop('disabled', false);
        $("#ui_divRecommendationsFileDefaultPreview").addClass("hideDiv");
        if (FileExtension == "pdf") {
            $("#ui_imgRecommendationsFilePreviewUrl").attr('src', '/Content/images/pdf-img.jpg');
            $("#ui_txtRecommendationsFileRedirectUrl").val('');
            $("#ui_txtRecommendationsFileRedirectUrl").prop('disabled', true);
        } else {
            $("#ui_imgRecommendationsFilePreviewUrl").attr('src', $("#ui_txtRecommendationsOnlineUrl").val());
        }
        $("#ui_divRecommendationsFileActualPreview").removeClass("hideDiv");

        return true;
    },
    ValidateFileUpload: function () {
        var UpLoadedFile = $("#ui_fileRecommendationsFileBrowse").get(0).files;
        if (UpLoadedFile.length <= 0) {
            ShowErrorMessage(GlobalErrorList.ChatRoom.FileNotSelect_Error);
            return false;
        }

        var UpLoadedFileExtension = GetFileExtension(UpLoadedFile[0].name)[0].toLowerCase();

        if (ValidRecommendationsFileTypes.indexOf(UpLoadedFileExtension) <= -1) {
            ShowErrorMessage(GlobalErrorList.ChatRoom.FileType_Error);
            return false;
        }

        var UpLoadedFileSize = (((UpLoadedFile[0].size) / 1024) / 1024);
        if (UpLoadedFileSize > 20) {
            ShowErrorMessage(GlobalErrorList.ChatRoom.FileSize_Error);
            return false;
        }

        $("#ui_txtRecommendationsFileRedirectUrl").prop('disabled', false);
        $("#ui_divRecommendationsFileDefaultPreview").addClass("hideDiv");
        if (UpLoadedFileExtension == "pdf") {
            $("#ui_imgRecommendationsFilePreviewUrl").attr('src', '/Content/images/pdf-img.jpg');
            $("#ui_txtRecommendationsFileRedirectUrl").val('');
            $("#ui_txtRecommendationsFileRedirectUrl").prop('disabled', true);
        } else {
            $("#ui_imgRecommendationsFilePreviewUrl").attr('src', URL.createObjectURL(UpLoadedFile[0]));
        }
        $("#ui_divRecommendationsFileActualPreview").removeClass("hideDiv");

        return true;
    },
    ValidateUpdateBanner: function () {
        if ($("#ui_txtRecommendationsFileTitle").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.ChatRoom.ValidateUrl_Error);
            $("#ui_txtRecommendationsFileTitle").focus();
            return false;
        }

        if (!($("#ui_txtRecommendationsFileRedirectUrl").prop('disabled'))) {
            if ($("#ui_txtRecommendationsFileRedirectUrl").val().length > 0) {
                if (!regExpUrl.test($("#ui_txtRecommendationsFileRedirectUrl").val())) {
                    ShowErrorMessage(GlobalErrorList.ChatRoom.ValidRedirectUrl_Error);
                    $("#ui_txtRecommendationsFileRedirectUrl").focus();
                    return false;
                }
            }
        }

        return true;
    },
    SaveRecommendation: function () {
        if (!$("input[name='RecommendationsUploadType']:checked").val()) {
            ShowErrorMessage(GlobalErrorList.ChatRoom.FileNotSelect_Error);
            HidePageLoading();
            return false;
        }
        else if ($('#ui_rdbtnRecommendationsTypeOnline').is(':checked') && !RecommendationUtil.ValidateFileOnlineUrl()) {
            HidePageLoading();
            return false;
        }
        else if ($('#ui_rdbtnRecommendationsTypeUpload').is(':checked') && !RecommendationUtil.ValidateFileUpload()) {
            HidePageLoading();
            return false;
        }

        if (!RecommendationUtil.ValidateUpdateBanner()) {
            HidePageLoading();
            return false;
        }

        var UploadType = "";
        var RedirectUrl = $("#ui_txtRecommendationsFileRedirectUrl").val();
        var BannerTitle = $("#ui_txtRecommendationsFileTitle").val();

        if ($('#ui_rdbtnRecommendationsTypeUpload').is(':checked')) {
            UploadType = "Upload";
            var UpLoadedFile = $("#ui_fileRecommendationsFileBrowse").get(0).files;
            var uploadedFormData = typeof window.FormData == "undefined" ? [] : new window.FormData();

            if (typeof window.FormData == "undefined") {
                uploadedFormData.push('UploadedBanner', UpLoadedFile[0]);
            }
            else {
                uploadedFormData.append('UploadedBanner', UpLoadedFile[0]);
            }
            


            $.ajax({
                url: "/Chat/ChatRoom/SaveBanner?AccountId=" + Plumb5AccountId + "&UserId=" + Plumb5UserId + "&UploadType=" + UploadType + "&BannerContent=" + null + "&RedirectUrl=" + RedirectUrl + "&BannerTitle=" + BannerTitle + "",
                type: 'POST',
                data: uploadedFormData,
                contentType: false,
                processData: false,
                dataType: "json",
                success: function (response) {
                    if (response.Status) {
                        RecommendationUtil.ReBindBannerData(response.ChatBanner, 'Save');
                        ShowSuccessMessage(GlobalErrorList.ChatRoom.SaveBanner_Success);
                        RecommendationUtil.CloseRecommendationPopUp();
                    }
                    else {
                        ShowErrorMessage(response.Message);
                        HidePageLoading();
                    }
                },
                error: ShowAjaxError
            });
        } else if ($('#ui_rdbtnRecommendationsTypeOnline').is(':checked')) {
            UploadType = "Online";
            var BannerContent = $("#ui_txtRecommendationsOnlineUrl").val();

            $.ajax({
                url: "/Chat/ChatRoom/SaveBanner?AccountId=" + Plumb5AccountId + "&UserId=" + Plumb5UserId + "&UploadType=" + UploadType + "&BannerContent=" + BannerContent + "&RedirectUrl=" + RedirectUrl + "&BannerTitle=" + BannerTitle + "",
                type: 'POST',
                //data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'UserId': Plumb5UserId, 'UploadType': UploadType, 'BannerContent': BannerContent, 'RedirectUrl': RedirectUrl, 'BannerTitle': BannerTitle }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response.Status) {
                        RecommendationUtil.ReBindBannerData(response.ChatBanner, 'Save');
                        ShowSuccessMessage(GlobalErrorList.ChatRoom.SaveBanner_Success);
                        RecommendationUtil.CloseRecommendationPopUp();
                    }
                    else {
                        ShowErrorMessage(response.Message);
                        HidePageLoading();
                    }
                },
                error: ShowAjaxError
            });
        }
    },
    UpdateRecommendation: function (BannerId, BannerContent) {
        if (!RecommendationUtil.ValidateUpdateBanner()) {
            HidePageLoading();
            return true;
        }

        var ChatBannerData = { Id: BannerId, BannerContent: BannerContent, RedirectUrl: $("#ui_txtRecommendationsFileRedirectUrl").val(), UserInfoUserId: Plumb5UserId, BannerTitle: $("#ui_txtRecommendationsFileTitle").val() };

        $.ajax({
            url: "/Chat/ChatRoom/UpdateBanner",
            type: 'POST',
            data: JSON.stringify({
                'AccountId': Plumb5AccountId, 'ChatBannerData': ChatBannerData
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response == true) {
                    RecommendationUtil.ReBindBannerData(ChatBannerData, 'Update');
                    ShowSuccessMessage(GlobalErrorList.ChatRoom.UpdateBanner_Success);
                    RecommendationUtil.CloseRecommendationPopUp();
                }
                else {
                    ShowErrorMessage(GlobalErrorList.ChatRoom.UpdateBanner_Error);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    DeleteRecommendation: function (BannerId, BannerContent) {
        $.ajax({
            url: "/Chat/ChatRoom/DeleteBanner",
            type: 'POST',
            data: JSON.stringify({
                'AccountId': Plumb5AccountId, 'UserId': Plumb5UserId, 'BannerId': BannerId, 'BannerContent': BannerContent
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response == true) {
                    $("#ui_divEachBanned_" + BannerId).remove();
                    ShowSuccessMessage(GlobalErrorList.ChatRoom.DeleteBanner_Success);
                    RecommendationUtil.CloseRecommendationPopUp();
                }
                else {
                    ShowErrorMessage(GlobalErrorList.ChatRoom.DeleteBanner_Error);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    ReBindBannerData: function (ChatBannerData, BindType) {
        var BannerContent = ChatBannerData.BannerContent;
        var BannerTitle = ChatBannerData.BannerTitle;
        var RedirectUrl = ChatBannerData.RedirectUrl;
        var BannerId = ChatBannerData.Id;
        var BannerExtension = chatRoomUtil.GetExtension(BannerContent);
        var BannerPreviewSrc = "";
        if (BannerExtension == "pdf") {
            BannerPreviewSrc = "/Content/images/pdf-img.jpg";
        } else {
            BannerPreviewSrc = BannerContent;
        }

        var BannerDivContent = `<div class="gall-col-4 gall-col-lmob-6 gall-col-pmob-12 p-gut mb-2" id="ui_divEachBanned_${BannerId}">
                                        <div class="chatbangalwrp">
                                            <img data-toggle="modal" class="addchatoffbanbtn" src="${BannerPreviewSrc}" alt="BannerPreview" title="${BannerTitle}" onclick="RecommendationUtil.OpenUpdatePopUp(${BannerId},'${BannerContent}','${BannerTitle}','${RedirectUrl}');" />
                                            <div class="chatbancaptwrp">
                                                <div class="w-75 text-truncate" title="${BannerTitle}">${BannerTitle}</div>
                                                <div class="sharebtnwrp">
                                                    <button type="button" class="btn btn-purple" onclick="RecommendationUtil.SendBannerToVisitor(${BannerId},'${BannerContent}','${BannerTitle}','${RedirectUrl}');"><i class="fa fa-paper-plane"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
        if (BindType == 'Update') {
            $("#ui_divEachBanned_" + BannerId).remove();
        }
        $("#ui_DivBannerImages").prepend(BannerDivContent);
    },
    CloseRecommendationPopUp: function () {
        $("#ui_divRecommendationPopUp").modal("hide");
        $("#ui_divRecommendationDeletePopUp").modal("hide");
        RecommendationUtil.ClearRecommendationsPopUp();
        HidePageLoading();
    },
    SendBannerToVisitor: function (BannerId, BannerContent, BannerTitle, RedirectUrl) {
        ShowPageLoading();
        if (toVisitorId == "0") {
            ShowErrorMessage(GlobalErrorList.ChatRoom.VistorNotSelect_Error);
            HidePageLoading();
            return false;
        }

        if (BannerContent == undefined || BannerContent == null || BannerContent == 'null' || BannerContent == "" || BannerContent.length == 0) {
            ShowErrorMessage(GlobalErrorList.ChatRoom.BannerNotSelect_Error);
            HidePageLoading();
            return false;
        }

        if (BannerTitle == undefined || BannerTitle == null || BannerTitle == 'null' || BannerTitle == "" || BannerTitle.length == 0) {
            ShowErrorMessage(GlobalErrorList.ChatRoom.BannerTitleNot_Error);
            HidePageLoading();
            return false;
        }

        chatUtil.PushBanner(BannerContent, RedirectUrl, BannerId, BannerTitle);
        chatHelper.BannerActionsByVisitor(BannerContent, 0, BannerId, BannerTitle, RedirectUrl);

        ShowSuccessMessage(GlobalErrorList.ChatRoom.BannerSent_Success);
        HidePageLoading();
    }
}

$("#ui_btnAddRecommendation").click(function () {
    RecommendationUtil.ClearRecommendationsPopUp();
    $("#ui_rdbtnRecommendationsTypeOnline").prop('checked', true);
    $("#ui_divRecommendationsUploadType,#ui_divRecommendationsTypeOnline,#ui_divRecommendationsFileDefaultPreview").removeClass("hideDiv");
    $("#ui_divRecommendationPopUp").modal("show");
});

$("#ui_btnCloseRecommendationPopUp, #ui_btnCancelRecommendationPopUp,#ui_btnDeleteRecommendationClose,#ui_btnDeleteRecommendationCancel").click(function () {
    RecommendationUtil.CloseRecommendationPopUp();
});

$("#ui_btnSaveRecommendationFile").click(function () {
    ShowPageLoading();
    var BannerId = $("#ui_btnSaveRecommendationFile").prop("BannerId");
    var BannerContent = $("#ui_btnSaveRecommendationFile").prop("BannerContent");
    if (BannerId != typeof undefined && BannerContent != typeof undefined && BannerId != undefined && BannerContent != undefined && BannerId != 0 && BannerContent.length > 0 && parseInt(BannerId) > 0) {
        RecommendationUtil.UpdateRecommendation(BannerId, BannerContent);
    } else {
        RecommendationUtil.SaveRecommendation();
    }
});

$('input[type=radio][name=RecommendationsUploadType]').change(function () {
    RecommendationUtil.ClearRecommendationsPopUp();
    $("#ui_divRecommendationsFileDefaultPreview").removeClass("hideDiv");

    if ($('#ui_rdbtnRecommendationsTypeOnline').is(':checked')) {
        $("#ui_divRecommendationsTypeOnline").removeClass("hideDiv");
    } else if ($('#ui_rdbtnRecommendationsTypeUpload').is(':checked')) {
        $("#ui_divRecommendationsTypeUpload").removeClass("hideDiv");
    }
});

$("#ui_btnRecommendationsOnlineUrlOk").click(function () {
    ShowPageLoading();
    RecommendationUtil.ValidateFileOnlineUrl();
    HidePageLoading();
});

$("#ui_btnRecommendationsFileBrowseOk").click(function () {
    ShowPageLoading();
    RecommendationUtil.ValidateFileUpload();
    HidePageLoading();
});

$("#ui_fileRecommendationsFileBrowse").change(function (y) {
    var UpLoadedFileName = y.target.files[0].name;
    $("#ui_divRecommendationsFileBrowseShow").removeClass("hideDiv");
    $("#ui_divRecommendationsFileBrowseFileName").html(UpLoadedFileName);
});

$("#ui_iconRecommendationsFileBrowseFileClose").click(function () {
    $("#ui_divRecommendationsFileBrowseFileName").html('');
    $("#ui_divRecommendationsFileBrowseShow").addClass("hideDiv");
    $("#ui_fileRecommendationsFileBrowse").val('');

    $("#ui_divRecommendationsFileActualPreview").addClass("hideDiv");
    $("#ui_divRecommendationsFileDefaultPreview").removeClass("hideDiv");
    $("#ui_imgRecommendationsFilePreviewUrl").attr('src', '');
});

$("#ui_btnShowDeleteRecommendationPopUp").click(function () {
    ShowPageLoading();
    var BannerId = $("#ui_btnShowDeleteRecommendationPopUp").prop("BannerId");
    var BannerContent = $("#ui_btnShowDeleteRecommendationPopUp").prop("BannerContent");
    if (BannerId != typeof undefined && BannerContent != typeof undefined && BannerId != undefined && BannerContent != undefined && BannerId != 0 && BannerContent.length > 0 && parseInt(BannerId) > 0) {
        RecommendationUtil.OpenDeletePopUp(BannerId, BannerContent);
    }
});

$("#ui_btnDeleteRecommendationConfirm").click(function () {
    ShowPageLoading();
    var BannerId = $("#ui_btnDeleteRecommendationConfirm").prop("BannerId");
    var BannerContent = $("#ui_btnDeleteRecommendationConfirm").prop("BannerContent");
    if (BannerId != typeof undefined && BannerContent != typeof undefined && BannerId != undefined && BannerContent != undefined && BannerId != 0 && BannerContent.length > 0 && parseInt(BannerId) > 0) {
        RecommendationUtil.DeleteRecommendation(BannerId, BannerContent);
    }
});