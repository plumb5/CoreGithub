
var chatDetails = {
    Id: 0, UserInfoUserId: 0, UserGroupId: 0, Name: "", Header: "", MinimisedWindow: 0, ForegroundColor: "", BackgroundColor: "", ChatPriority: 0, Position: 0, Privacy: false, ChatStatus: false, DesignType: 1, CustomTitle: "", OfflineTitle: "", WelcomeMesg: "", AgentAwayMesg: "", AgentOfflineMsg: "", ChatEndMesg: "", DesktopNotificationVisitor: false,
    SoundNotificationVisitor: "", SuggestionMesg: "", IdleTime: 0, IsNameMandatory: false, IsPhoneMandatory: false, IsQueryMandatory: false, HideShowP5Logo: false, ReportToDetailsByMail: "", WebHooks: "", WebHooksFinalUrl: "", ShowGreetingMsg: false, ShowEngagedMsg: false,
    FormOnlineTitle: "", FormOfflineTitle: "", GroupId: "", AssignToUserId: "", WebHookId: "0", IsPreChatSurvey: false, NamePlaceholderText: "", EmailPlaceholderText: "", PhonePlaceholderText: "", PrivacyContent: "", ButtonText: "", ResponseMessage: "", ResponseMessageTextColor: "",
    IsAgentOnline: false, ShowAutoMessageMobile: false, AgentMessageBgColor: "", AgentMessageForeColor: "", VisitorMessageBgColor: "", VisitorMessageForeColor: "", ChatBodyBackgroundColor: "", MessagePlaceholderText: ""
};

var webhookdetails = { WebHookId: 0, RequestURL: "", MethodType: 0, ContentType: 0, FieldMappingDetails: "", Headers: "", BasicAuthentication: 0, RawBody: "" };

var messageList = new Array();
var webhookFieldList = new Array();
var Webhookloopdetals = Array();
var IsOverRideSourceListDetails = new Array();
var checkwebhookupdatestatus = 0;
var checkupdatedstatus = 0;
//-----Form Design Rules Part End

$(document).ready(function () {
    ShowPageLoading();
    chatDetails.Id = $.urlParam("ChatId");
    CreateChatUtil.BindGroups();
    CreateChatUtil.GetContactProperties();
    InitializeIsoverridesourceList();
    //if (chatDetails.Id > 0) {
    //    setTimeout(function () {
    //        ShowPageLoading();
    //        CreateChatUtil.GetChatSettings(chatDetails.Id);
    //    }, 3000);
    //}
    //else {
    //    CreateChatUtil.CreateUniqueIdentifier();
    //    HidePageLoading();
    //}
});

var CreateChatUtil = {
    GetChatSettings: function (chatId) {
        $.ajax({
            url: "/Chat/NewChat/GetChatDetails",
            type: 'POST',
            data: JSON.stringify({ 'ChatId': chatId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                CreateChatUtil.BindChatSettings(response);
            },
            error: ShowAjaxError
        });
    },
    BindGroups: function () {
        $.ajax({
            url: "/ManageContact/Group/GetGroupsByStaticOrDynamic",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, GroupType: 1 }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.GroupDetails != null) {
                    $.each(response.GroupDetails, function () {
                        $("#ui_ddlGroups").append("<option value=" + $(this)[0].Id + ">" + $(this)[0].Name + "</option>");
                    });
                }
                if (chatDetails.Id > 0) {
                    CreateChatUtil.GetChatSettings(chatDetails.Id);
                }
                else {
                    CreateChatUtil.CreateUniqueIdentifier();
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    BindChatSettings: function (response) {

        chatDetails = response.savedChatDetails;
        ruleConditions = response.savedChatRules;
        if (response.savedwebHookDetails != null) {
            Webhookloopdetals = response.savedwebHookDetails;
        }
        //Design Part

        $("#ui_txtChatRoom").val(chatDetails.Name);

        $("#chattitlebox").val(chatDetails.Header);
        $("#ui_ChatHeader").html(chatDetails.Header);
        if (chatDetails.Header.length > 0)
            $("#ui_span_ChatHeadersTextCount").text(25 - chatDetails.Header.length);

        if (chatDetails.MinimisedWindow == 0) {
            $("#chattopbar").prop("checked", true).change();
            $("#chateventbtn").addClass("hideDiv");
        }
        else if (chatDetails.MinimisedWindow == 1) {
            $("#chattopbarbub").prop("checked", true).change();
            $("#chateventbtn").removeClass("hideDiv");
        }

        if (chatDetails.Position == 0) {
            $("#chatalignright").prop("checked", true);
        }
        else if (chatDetails.Position == 1) {
            $("#chatalignleft").prop("checked", true);
        }

        $("#chattitlecol").val(chatDetails.ForegroundColor).change();

        if (chatDetails.BackgroundColor != null && chatDetails.BackgroundColor != undefined) {
            if (chatDetails.BackgroundColor.substring(0, 1) == "#") {
                $("#chatcustbgbar").val(chatDetails.BackgroundColor).css("background-color", chatDetails.BackgroundColor).change();
            }
            else {
                RemoveCurrentBgClass();
                AppendNewClasstoBg(chatDetails.BackgroundColor);
            }
        };


        if (chatDetails.Privacy == 1) {
            if (chatDetails.IsPreChatSurvey == 1) {
                $("#prechatsurvy").prop("checked", true);

                $("#prechatfrmname").val(chatDetails.NamePlaceholderText);
                $("#prechatfrmemailid").val(chatDetails.EmailPlaceholderText);
                $("#prechatfrmphone").val(chatDetails.PhonePlaceholderText);
                $("#prechatfrmmessage").val(chatDetails.MessagePlaceholderText);
                $("#prechatfrmprivacy").val(chatDetails.PrivacyContent);
                $("#startchataddtext").val(chatDetails.ButtonText);
                $("#prechatrespmesstext").val(chatDetails.ResponseMessage);

                $("#addRespMesTxtcol").css("background-color", chatDetails.ResponseMessageTextColor);
                $("#chatRespMessTxtcol").val(chatDetails.ResponseMessageTextColor).css("background-color", chatDetails.ResponseMessageTextColor);;

                $("#prechatnamefield").attr("placeholder", chatDetails.NamePlaceholderText);
                $("#prechatemailfield").attr("placeholder", chatDetails.EmailPlaceholderText);
                $("#prechatphonefield").attr("placeholder", chatDetails.PhonePlaceholderText);
                $("#prechatmessagefield").attr("placeholder", chatDetails.MessagePlaceholderText);
                $("#prechatprivacytext").html(chatDetails.PrivacyContent);
                $("#startchatbtn").html(chatDetails.ButtonText);
                $(".prechatErrorMess").html(chatDetails.ResponseMessage);
                $(".prechatErrorMess").css("color", chatDetails.ResponseMessageTextColor);
            }


            CreateChatUtil.ShowChatSurvey();
        }

        //change chat color
        $("#chatUserBgcol").val(chatDetails.ChatBodyBackgroundColor).css("background-color", chatDetails.ChatBodyBackgroundColor);
        $("#chatAgentBgcol").val(chatDetails.AgentMessageBgColor).css("background-color", chatDetails.AgentMessageBgColor);
        $("#chatAgentForecol").val(chatDetails.AgentMessageForeColor).css("background-color", chatDetails.AgentMessageForeColor);
        $("#chatVisitorBgcol").val(chatDetails.VisitorMessageBgColor).css("background-color", chatDetails.VisitorMessageBgColor);
        $("#chatVisitorforecol").val(chatDetails.VisitorMessageForeColor).css("background-color", chatDetails.VisitorMessageForeColor);

        $("#chatUserBgcolIcon").css("background-color", "#" + chatDetails.ChatBodyBackgroundColor);
        $("#chatAgentBgcolIcon").css("background-color", "#" + chatDetails.AgentMessageBgColor);
        $("#chatAgentForecolIcon").css("background-color", "#" + chatDetails.AgentMessageForeColor);
        $("#chatVisitorBgcolIcon").css("background-color", "#" + chatDetails.VisitorMessageBgColor);
        $("#chatVisitorforecolIcon").css("background-color", "#" + chatDetails.VisitorMessageForeColor);


        $("#ulMesg").css("background-color", "#" + chatDetails.ChatBodyBackgroundColor);
        $(".chatmediawrp .msgagent p").css("background-color", "#" + chatDetails.AgentMessageBgColor);
        $(".chatmediawrp .msgagent p").css("color", "#" + chatDetails.AgentMessageForeColor);
        $(".msgagentvistor p").css("background-color", "#" + chatDetails.VisitorMessageBgColor);
        $(".msgagentvistor p").css("color", "#" + chatDetails.VisitorMessageForeColor);

        //change chat color


        if (chatDetails.DesktopNotificationVisitor && chatDetails.DesktopNotificationVisitor == 1)
            $("#ui_chkDesktopNotify").prop("checked", true);

        if (chatDetails.SoundNotificationVisitor && chatDetails.SoundNotificationVisitor != 0)
            $("#dllSoundNotificationVisitor").val(chatDetails.SoundNotificationVisitor);

        //Auto Message Binding
        if (chatDetails.AutoMessageToVisitor && chatDetails.AutoMessageToVisitor.length > 0) {
            CreateChatUtil.InitializeSavingFormat(chatDetails.AutoMessageToVisitor);
        }
        //Event Message Part


        if (chatDetails.CustomTitle && chatDetails.CustomTitle.length > 0) {
            $("#ui_txtCustomTitle").val(chatDetails.CustomTitle);
            // $(".chatmesscontainer").removeClass("hideDiv");
            $("#lblBoxText").html(chatDetails.CustomTitle);
        } else {
            $("#ui_txtCustomTitle").val('');
            $(".chatmesscontainer").addClass("hideDiv");
        }

        if (chatDetails.OfflineTitle && chatDetails.OfflineTitle.length > 0)
            $("#ui_txtOfflineTitle").val(chatDetails.OfflineTitle);
        else
            $("#ui_txtOfflineTitle").val('');

        if (chatDetails.FormOnlineTitle && chatDetails.FormOnlineTitle.length > 0) {
            $("#ui_txtFormOnlineTitle").val(chatDetails.FormOnlineTitle);
            $("#lblFormTitle").html(chatDetails.FormOnlineTitle);
        }

        if (chatDetails.FormOfflineTitle && chatDetails.FormOfflineTitle.length > 0)
            $("#ui_txtFormOfflineTitle").val(chatDetails.FormOfflineTitle);

        if (chatDetails.WelcomeMesg && chatDetails.WelcomeMesg.length > 0) {
            $("#ui_chkDefaultMesg").prop("checked", true);
            $("#ui_DvDefaultMesg").removeClass("hideDiv");
            $("#ui_txtWelcomeMesg").val(chatDetails.WelcomeMesg);
        }

        if (chatDetails.AgentAwayMesg && chatDetails.AgentAwayMesg.length > 0) {
            $("#ui_ChkIdelMesg").prop("checked", true);
            $("#ui_DvChkIdelMesg").removeClass("hideDiv");
            $("#txtIdelMesg").val(chatDetails.AgentAwayMesg);
        }

        if (chatDetails.AgentOfflineMsg && chatDetails.AgentOfflineMsg.length > 0) {
            $("#ui_ChkOfflineMesg").prop("checked", true);
            $("#ui_DvChkOfflineMesg").removeClass("hideDiv");
            $("#txtOfflineMesg").val(chatDetails.AgentOfflineMsg);
        }

        if (chatDetails.ChatEndMesg && chatDetails.ChatEndMesg.length > 0) {
            $("#ui_ChkChatEndMesg").prop("checked", true);
            $("#ui_DvChkChatEndMesg").removeClass("hideDiv");
            $("#txtEndMesg").val(chatDetails.ChatEndMesg);
        }

        if (chatDetails.SuggestionMesg && chatDetails.SuggestionMesg.length > 0) {
            $("#ui_ChkMessageHelper").prop("checked", true);
            $("#ui_DvChkMessageHelper").removeClass("hideDiv");
            $("#ui_txtAutoSuggestion").val(chatDetails.SuggestionMesg);
        }


        if (chatDetails.ShowGreetingMsg == 1) {
            $("#ui_chkGreeting").prop("checked", true);
        }

        if (chatDetails.ShowIfAgentOnline == 1) {
            $("#ui_chkAgentOnline").prop("checked", true);
        }

        if (chatDetails.ShowEngagedMsg == 1) {
            $("#ui_chkEngaged").prop("checked", true);
        }
        //Binding Rules
        BindRulesDetails();

        //Response Settings
        if (chatDetails.ReportToDetailsByMail && chatDetails.ReportToDetailsByMail != null && chatDetails.ReportToDetailsByMail.length > 0) {
            $("#ui_chkReportMail").prop("checked", true);
            $("#ui_divReportMail").removeClass("hideDiv");
            $("#ui_txtReportMail").val(chatDetails.ReportToDetailsByMail);
        }

        if (chatDetails.AssignToUserId && chatDetails.AssignToUserId !== null && chatDetails.AssignToUserId.length > 0) {
            $("#ui_chkSalesPerson").prop("checked", true);
            $("#ui_divSalesPerson").removeClass("hideDiv");

            var intervalId = window.setInterval(function () {
                if (loadingDataValues.UsersList == true) {
                    $("#ui_ddlUserList").select2().val(chatDetails.AssignToUserId).change();
                    clearInterval(intervalId);
                }
            }, 5000);

        }

        //OverRide source Conditional and Unconditional
        if (chatDetails.IsOverRideSource != null && chatDetails.IsOverRideSource.length > 0) {
            var Data = JSON.parse(chatDetails.IsOverRideSource);

            $("#ui_chkoverridesource").prop("checked", true);
            $("#IsOverriseSource_Tr").removeClass("hideDiv");
            setTimeout(function () { $("#ui_ddlIsoverridesourceList").select2().val(Data[0].UnconditionalOverSourceId).change(); }, 1000);

            if (chatDetails.SourceType == 0)
                $('#lmsStaySource').attr('checked', true);
            else if (chatDetails.SourceType == 1)
                $('#lmsOverrideSource').attr('checked', true);
            else if (chatDetails.SourceType == 2)
                $('#lmsNewSource').attr('checked', true);
        }

        if (chatDetails.GroupId && chatDetails.GroupId !== null && chatDetails.GroupId.length > 0) {
            $("#ui_chkGroups").prop("checked", true);
            $("#ui_divGroups").removeClass("hideDiv");
            $("#ui_ddlGroups").select2().val(chatDetails.GroupId).change();
        }

        //WebHook Binding
        if (Webhookloopdetals != null && chatDetails.WebHookId != null && chatDetails.WebHookId != "0") {

            $("#ui_chkWebHookUrl").prop("checked", true)
            $("#ui_addwebhookforchats").removeClass("hideDiv");
            $("#ui_divWebHookUrl").addClass("hideDiv");
            $("#webhookeditoption input").val(" ");
            $("#methodwebhook, #ui_ddl_ContentType").val(" ");
            WebhookFieldsToedit();
        }
        HidePageLoading();

    },
    ValidateDesign: function () {
        if ($.trim($("#ui_txtChatRoom").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateChat.Identifier_Error);
            HidePageLoading();
            return false;
        }

        if ($.trim($("#chattitlebox").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateChat.Header_Error);
            HidePageLoading();
            return false;
        }

        if ($("#prechatsurvy").is(":checked")) {
            if ($.trim($("#prechatfrmname").val()).length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateChat.NamePlcHldr_Error);
                HidePageLoading();
                return false;
            }

            if ($.trim($("#prechatfrmemailid").val()).length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateChat.EmailPlcHldr_Error);
                HidePageLoading();
                return false;
            }

            if ($.trim($("#prechatfrmphone").val()).length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateChat.PhonePlcHldr_Error);
                HidePageLoading();
                return false;
            }

            if ($.trim($("#prechatfrmprivacy").val()).length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateChat.PrivacyCntnt_Error);
                HidePageLoading();
                return false;
            }

            if ($.trim($("#startchataddtext").val()).length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateChat.ButtonText_Error);
                HidePageLoading();
                return false;
            }

            if ($.trim($("#prechatrespmesstext").val()).length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateChat.RespMsgTxt_Error);
                HidePageLoading();
                return false;
            }

            if ($.trim($("#chatRespMessTxtcol").val()).length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateChat.RespMsgTxtColor_Error);
                HidePageLoading();
                return false;
            }
        }

        return true;
    },
    AssignDesignValues: function () {

        chatDetails.Name = $.trim($("#ui_txtChatRoom").val());
        chatDetails.Header = $.trim($("#chattitlebox").val());

        if ($("#chattopbar").is(":checked"))
            chatDetails.MinimisedWindow = 0;
        else
            chatDetails.MinimisedWindow = 1;

        if ($("#chatalignleft").is(":checked"))
            chatDetails.Position = 1;
        else
            chatDetails.Position = 0;

        chatDetails.ForegroundColor = null;
        if (($('.chattitcustbgcol').children('i').length > 0)) {
            chatDetails.ForegroundColor = $("#chattitlecol").val();
        }

        chatDetails.BackgroundColor = null;
        if (($('.chatcustbgcol').children('i').length > 0)) {
            var Bgcol = $("#chatcustbgbar").val();
            if (Bgcol.substring(0, 1) == "#")
                chatDetails.BackgroundColor = Bgcol;
            else
                chatDetails.BackgroundColor = "#" + Bgcol;
        }
        else
            chatDetails.BackgroundColor = $(".chatbarcolwrp").find('i').parent().attr("id");


        if ($("#prechatsurvy").is(":checked")) {
            chatDetails.Privacy = true;
            chatDetails.IsNameMandatory = true;
            chatDetails.IsPhoneMandatory = true;
            chatDetails.IsQueryMandatory = true;

            chatDetails.IsPreChatSurvey = true;
            chatDetails.NamePlaceholderText = $("#prechatfrmname").val();
            chatDetails.EmailPlaceholderText = $("#prechatfrmemailid").val();
            chatDetails.PhonePlaceholderText = $("#prechatfrmphone").val();
            chatDetails.MessagePlaceholderText = $("#prechatfrmmessage").val();
            chatDetails.PrivacyContent = $("#prechatfrmprivacy").val();
            chatDetails.ButtonText = $("#startchataddtext").val();
            chatDetails.ResponseMessage = $("#prechatrespmesstext").val();
            chatDetails.ResponseMessageTextColor = $("#chatRespMessTxtcol").val().substring(0, 1) == "#" ? $("#chatRespMessTxtcol").val() : "#" + $("#chatRespMessTxtcol").val();
        }
        else {
            chatDetails.IsQueryMandatory = chatDetails.IsNameMandatory = false;
            chatDetails.IsPhoneMandatory = false;
            chatDetails.Privacy = false;
        }

        chatDetails.ChatBodyBackgroundColor = $("#chatUserBgcol").val().substring(0, 1) == "#" ? $("#chatUserBgcol").val() : "#" + $("#chatUserBgcol").val();
        chatDetails.AgentMessageBgColor = $("#chatAgentBgcol").val().substring(0, 1) == "#" ? $("#chatAgentBgcol").val() : "#" + $("#chatAgentBgcol").val();
        chatDetails.AgentMessageForeColor = $("#chatAgentForecol").val().substring(0, 1) == "#" ? $("#chatAgentForecol").val() : "#" + $("#chatAgentForecol").val();
        chatDetails.VisitorMessageBgColor = $("#chatVisitorBgcol").val().substring(0, 1) == "#" ? $("#chatVisitorBgcol").val() : "#" + $("#chatVisitorBgcol").val();
        chatDetails.VisitorMessageForeColor = $("#chatVisitorforecol").val().substring(0, 1) == "#" ? $("#chatVisitorforecol").val() : "#" + $("#chatVisitorforecol").val();

        if ($("#ui_chkDesktopNotify").is(":checked"))
            chatDetails.DesktopNotificationVisitor = true;
        else
            chatDetails.DesktopNotificationVisitor = false;

        chatDetails.SoundNotificationVisitor = $("#dllSoundNotificationVisitor").val();


        if ($("#ui_ChkAutoMessageForTimeDelay").is(":checked")) {
            chatDetails.AutoMessageToVisitor = JSON.stringify(messageList);
        }
        else {
            chatDetails.AutoMessageToVisitor = "";
        }

        //Assign Auto Message
        if (messageList.length > 0)
            chatDetails.AutoMessageToVisitor = JSON.stringify(messageList);
    },
    MovetoEventMessages: function () {
        HidePageLoading();
        $("#ui_divDesign").addClass("hideDiv");
        $("#ui_divEventMessages").removeClass("hideDiv");
    },
    ValidateEventMessages: function () {
        //if ($.trim($("#ui_txtCustomTitle").val()).length == 0) {
        //    ShowErrorMessage(GlobalErrorList.CreateChat.OnlineTitle_Error);
        //    $("#ui_txtCustomTitle").focus();
        //    return false;
        //}
        //if ($.trim($("#ui_txtOfflineTitle").val()).length == 0) {
        //    ShowErrorMessage(GlobalErrorList.CreateChat.OfflineTitle_Error);
        //    $("#ui_txtOfflineTitle").focus();
        //    return false;
        //}
        if ($.trim($("#ui_txtFormOnlineTitle").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateChat.FormOnlineTitle_Error);
            $("#ui_txtFormOnlineTitle").focus();
            return false;
        }
        if ($.trim($("#ui_txtFormOfflineTitle").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateChat.FormOfflineTitle_Error);
            $("#ui_txtFormOfflineTitle").focus();
            return false;
        }
        if ($("#ui_chkDefaultMesg").is(":checked") && $.trim($("#ui_txtWelcomeMesg").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateChat.MessageOnline_Error);
            $("#ui_txtWelcomeMesg").focus();
            return false;
        }
        if ($("#ui_ChkIdelMesg").is(":checked") && $.trim($("#txtIdelMesg").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateChat.AgentIdleMsg_Error);
            $("#txtIdelMesg").focus();
            return false;
        }
        if ($("#ui_ChkOfflineMesg").is(":checked") && $.trim($("#txtOfflineMesg").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateChat.OfflineMsg_Error);
            $("#txtOfflineMesg").focus();
            return false;
        }
        if ($("#ui_ChkChatEndMesg").is(":checked") && $.trim($("#txtEndMesg").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateChat.ChatEndMsg_Error);
            $("#txtEndMesg").focus();
            return false;
        }
        if ($("#ui_ChkMessageHelper").is(":checked") && $.trim($("#ui_txtAutoSuggestion").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateChat.AutoSuggestionMsg_Error);
            $("#ui_txtAutoSuggestion").focus();
            return false;
        }

        return true;

    },
    AssignEventMessages: function () {
        chatDetails.CustomTitle = $.trim($("#ui_txtCustomTitle").val());
        chatDetails.OfflineTitle = $.trim($("#ui_txtOfflineTitle").val());

        chatDetails.FormOnlineTitle = $.trim($("#ui_txtFormOnlineTitle").val());
        chatDetails.FormOfflineTitle = $.trim($("#ui_txtFormOfflineTitle").val());


        if ($("#ui_chkDefaultMesg").is(":checked"))
            chatDetails.WelcomeMesg = $.trim($("#ui_txtWelcomeMesg").val());
        else
            chatDetails.WelcomeMesg = "";

        if ($("#ui_ChkIdelMesg").is(":checked"))
            chatDetails.AgentAwayMesg = $.trim($("#txtIdelMesg").val());
        else
            chatDetails.AgentAwayMesg = "";
        if ($("#ui_ChkOfflineMesg").is(":checked"))
            chatDetails.AgentOfflineMsg = $.trim($("#txtOfflineMesg").val());
        else
            chatDetails.AgentOfflineMsg = "";
        if ($("#ui_ChkChatEndMesg").is(":checked"))
            chatDetails.ChatEndMesg = $.trim($("#txtEndMesg").val());
        else
            chatDetails.ChatEndMesg = "";
        if ($("#ui_ChkMessageHelper").is(":checked"))
            chatDetails.SuggestionMesg = $.trim($("#ui_txtAutoSuggestion").val());

        if ($("#ui_chkGreeting").is(":checked"))
            chatDetails.ShowGreetingMsg = true;
        else
            chatDetails.ShowGreetingMsg = false;

        if ($("#ui_chkAgentOnline").is(":checked"))
            chatDetails.ShowIfAgentOnline = true;
        else
            chatDetails.ShowIfAgentOnline = false;

        if ($("#ui_chkEngaged").is(":checked"))
            chatDetails.ShowEngagedMsg = true;
        else
            chatDetails.ShowEngagedMsg = false;
    },
    MovetoDisplayRules: function () {

        $("#ui_divDesign").addClass("hideDiv");
        $("#ui_divEventMessages").addClass("hideDiv");
        $("#ui_divDisplayRules").removeClass("hideDiv");
        $("#cont_setrules").removeClass("hideDiv")

    },
    MovetoReponseSettings: function () {
        $("#ui_divDesign").addClass("hideDiv");
        $("#ui_divEventMessages").addClass("hideDiv");
        $("#ui_divDisplayRules").addClass("hideDiv");
        $("#cont_setrules").addClass("hideDiv");
        $("#ui_divResponseSettings").removeClass("hideDiv");
    },
    ValidateResponseSettings: function () {

        if ($("#ui_chkReportMail").is(":checked") && $.trim($("#ui_txtReportMail").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateChat.ReportMail_Error);
            $("#ui_txtReportThroughEmail").focus();
            return false;
        }

        if ($("#ui_chkReportMail").is(":checked") && !CheckValidEmail("ui_txtReportMail")) {
            ShowErrorMessage(GlobalErrorList.CreateChat.ValidReportMail_Error);
            return false;
        }

        if ($("#ui_chkSalesPerson").is(":checked") && $("#ui_ddlUserList").get(0).selectedIndex === 0) {
            ShowErrorMessage(GlobalErrorList.CreateChat.SalesPerson_Error);
            return false;
        }

        if ($("#ui_chkGroups").is(":checked") && $("#ui_ddlGroups").get(0).selectedIndex === 0) {
            ShowErrorMessage(GlobalErrorList.CreateChat.ValidateGroup_Error);
            return false;
        }

        //Web Hooks Validation
        if ($("#ui_chkWebHookUrl").is(":checked")) {
            if (checkwebhookupdatestatus != 3) {

                if ($('#ui_txtRequestUrl').val().length == 0) {
                    $('#ui_txtRequestUrl').focus();
                    ShowErrorMessage(GlobalErrorList.CreateChat.WebHookEmptyRequestUrl);
                    return false;
                }
                if (!regExpUrl.test($.trim($("#ui_txtRequestUrl").val()))) {
                    $("#ui_txtRequestUrl").focus();
                    ShowErrorMessage(GlobalErrorList.CreateChat.RequestUrl_error);
                    return false;
                }
                if ($('#ui_ddl_MethodType').get(0).selectedIndex == 0) {
                    $('#ui_ddl_MethodType').focus();
                    ShowErrorMessage(GlobalErrorList.CreateChat.WebHookSelectMethodType);
                    return false;
                }

                if ($('#ui_ddl_ContentType').get(0).selectedIndex == 0) {
                    $('#ui_ddl_ContentType').focus();
                    ShowErrorMessage(GlobalErrorList.CreateChat.WebHookSelectContentType);
                    return false;
                }

                if ($('#ui_txt_BasicAuthenticationKey').val().length > 0 && $('#ui_txt_BasicAuthenticationValue').val().length == 0) {
                    $('#ui_txt_BasicAuthenticationKey').focus();
                    ShowErrorMessage(GlobalErrorList.CreateChat.WebHookBasicAuthenticationValueError);
                    return false;
                }

                if ($('#ui_txt_BasicAuthenticationKey').val().length == 0 && $('#ui_txt_BasicAuthenticationValue').val().length > 0) {
                    $('#ui_txt_BasicAuthenticationValue').focus();
                    ShowErrorMessage(GlobalErrorList.CreateChat.WebHookBasicAuthenticationKeyError);
                    return false;
                }

                //This is for checking the data field validation key and value are same
                var datafieldtrList = $('[id^=trsearch]');
                var drpoption = new Array();
                var drpanswer = new Array();

                let ContentType = $('#ui_ddl_ContentType option:selected').text().toLowerCase();
                if (ContentType == 'form') {
                    if (datafieldtrList.length <= 0) {
                        ShowErrorMessage(GlobalErrorList.CreateChat.DataFieldEmptyError);
                        return false;
                    }
                }
                else if (ContentType == 'raw body') {
                    if ($.trim($("#ui_txtRequestBody").val()).length == 0) {
                        $('#ui_txtRequestBody').focus();
                        ShowErrorMessage(GlobalErrorList.CreateChat.RequestBodyEmptyError);
                        return false;
                    }
                }

                for (var j = 0; j < datafieldtrList.length; j++) {
                    var rowId = datafieldtrList[j].id.substring(8);

                    if (CreateChatUtil.ValidateWebHookDataFieldsandvalues(parseInt(rowId))) {

                        if ($("#trsearch" + rowId).attr("datatype") == "Plumb5Field") {
                            if ($.inArray($("#drpFields_" + rowId + " option:selected").val(), drpoption) > -1 && $.inArray($("#txtFieldAnswer_" + rowId).val(), drpanswer) > -1) {
                                $("#drpFields_" + rowId).focus();
                                ShowErrorMessage(GlobalErrorList.CreateChat.duplicatedatafields_ErrorMessage);
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
                                ShowErrorMessage(GlobalErrorList.CreateChat.duplicatedatafields_ErrorMessage);
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

                    if (CreateChatUtil.ValidateWebHookHeaderFieldsAndValues(rowId)) {
                        if ($.inArray($("#txtheaderKey_" + rowId).val(), headerdrpoption) > -1 && $.inArray($("#txtheaderValue_" + rowId).val(), headeranswer) > -1) {
                            $("#txtheaderKey_" + rowId).focus();
                            ShowErrorMessage(GlobalErrorList.CreateChat.DuplicateHeaderKeyfields_ErrorMessage);
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
                            ShowErrorMessage(GlobalErrorList.CreateChat.duplicatedatafields_ErrorMessage);
                            return false;
                        }
                        else {
                            drpselectedtext.push($("#drpFields_" + rowId + " option:selected").text());
                        }
                    }
                    else if ($("#trsearch" + rowId).attr("datatype") == "StaticField") {
                        if ($.inArray($.trim($("#txtFieldKey_" + rowId).val()), drpselectedtext) > -1) {
                            $("#txtFieldKey_" + rowId).focus();
                            ShowErrorMessage(GlobalErrorList.CreateChat.duplicatedatafields_ErrorMessage);
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
                        ShowErrorMessage(GlobalErrorList.CreateChat.DuplicateHeaderKeyfields_ErrorMessage);
                        return false;
                    }
                    else {
                        headerKeytext.push($("#txtheaderKey_" + rowId).val());
                    }
                }
            }

        }
        else {
            if ($("#ui_tbodyReportData").length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateChat.WebHookEmptyRequestUrl);
                return false
            }
        }
        return true;
    },

    AssignResponseSettings: function () {
        if ($("#ui_chkReportMail").is(":checked") && $.trim($("#ui_txtReportMail").val()).length > 0) {
            chatDetails.ReportToDetailsByMail = $("#ui_txtReportMail").val();
        }
        else
            chatDetails.ReportToDetailsByMail = "";

        if ($("#ui_chkSalesPerson").is(":checked") && $("#ui_ddlUserList").get(0).selectedIndex > 0) {
            chatDetails.AssignToUserId = $("#ui_ddlUserList").val();
        }
        else
            chatDetails.AssignToUserId = "";

        if ($("#ui_chkoverridesource").is(":checked") && $("#ui_ddlIsoverridesourceList").get(0).selectedIndex > 0) {

            var filterConditions = { DependencyFieldId: "", UnconditionalOverSourceId: 0, FieldName: "", Subfields: "" };
            var FinalArrayValues = new Array();
            filterConditions.DependencyFieldId = "0";
            filterConditions.UnconditionalOverSourceId = $("#ui_ddlIsoverridesourceList").val();
            filterConditions.FieldName = filterConditions.Subfields = "";
            FinalArrayValues.push(filterConditions);
            chatDetails.IsOverRideSource = JSON.stringify(FinalArrayValues);

            if ($("#lmsStaySource").is(":checked")) {
                chatDetails.SourceType = 0;
            }
            else if ($("#lmsOverrideSource").is(":checked")) {
                chatDetails.SourceType = 1;
            }
            else if ($("#lmsNewSource").is(":checked")) {
                chatDetails.SourceType = 2;
            }
        }
        else {
            chatDetails.IsOverRideSource = "";
            chatDetails.SourceType = 0;
        }


        if ($("#ui_chkGroups").is(":checked") && $("#ui_ddlGroups").get(0).selectedIndex > 0) {
            chatDetails.GroupId = $("#ui_ddlGroups").val();
        }
        else
            chatDetails.GroupId = "";
    },
    AssignResponseWebhookSettings: function () {
        if ($("#btnsavewebhook").val() == 'update') {

            webhookdetails = { WebHookId: Webhookloopdetals[webhookrowid].WebHookId, RequestURL: "", MethodType: 0, ContentType: 0, FieldMappingDetails: "", Headers: "", BasicAuthentication: 0, RawBody: "" };

        }


        // else {
        // webhookdetails = { WebHookId: 0, RequestURL: "", MethodType: 0, ContentType: 0, FieldMappingDetails: "", Headers: "", BasicAuthentication: 0, RawBody: "" };
        // } 

        if ($("#ui_chkWebHookUrl").is(":checked")) {
            //Data values
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
            }

            //Headers values
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

            //Autontication
            var basicauthenticationdetails = { AuthenticationKey: "", AuthenticationValue: "" };

            if ($('#ui_txt_BasicAuthenticationKey').val().length > 0 && $('#ui_txt_BasicAuthenticationValue').val().length > 0) {
                basicauthenticationdetails.AuthenticationKey = $('#ui_txt_BasicAuthenticationKey').val();
                basicauthenticationdetails.AuthenticationValue = $('#ui_txt_BasicAuthenticationValue').val();
            }
            //webhookdetails = { WebHookId: 0, RequestURL: "", MethodType: 0, ContentType: 0, FieldMappingDetails: "", Headers: "", BasicAuthentication: 0, RawBody: "" };

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

            webhookdetails.Headers = JSON.stringify(headerdetails);
            webhookdetails.BasicAuthentication = JSON.stringify(basicauthenticationdetails);
        }
        else {
            webhookdetails = null;

            chatDetails.WebHookId = "0";
        }
        if ($("#btnsavewebhook").val() == 'update') {
            Webhookloopdetals.splice(webhookrowid, 1, webhookdetails);

            $("#ui_divWebHookUrl").addClass("hideDiv");
            $("#ui_divWebHookUrl input").val(" ");
            $("#methodwebhook, #ui_ddl_ContentType").val(" ");

        }
        else {
            if (webhookdetails != null)
                Webhookloopdetals.push(webhookdetails);

        }
    },
    SaveChatDetails: function () {

        ruleConditions.IsPageUrlContainsCondition = ruleConditions.IsPageUrlContainsCondition == 1 ? true : false;
        ruleConditions.IsDOBIgnored = (ruleConditions.IsDOBIgnored == 1 || ruleConditions.IsDOBIgnored != "") ? true : false;

        console.log(ruleConditions);
        $.ajax({
            url: "/Chat/NewChat/SaveChatDetails",
            type: 'POST',
            //data: JSON.stringify({ 'rulesData': ruleConditions }),
            data: JSON.stringify({ 'chat': chatDetails, 'rulesData': ruleConditions, 'webHookData': Webhookloopdetals }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    if (response.Status) {
                        ShowSuccessMessage(GlobalErrorList.CreateChat.SaveChat_Success);
                        // setTimeout(function () { ShowSuccessMessage(response.Message) }, 30);
                        setTimeout(function () { window.location.href = "/Chat/AllChat" }, 3000);
                    }
                    else if (!response.Status) {
                        ShowErrorMessage(response.Message);
                        HidePageLoading();
                    }
                }
                else if (!response.Status) {
                    chatDetails.ChatId = 0;// so that it wont pass againg -1
                    ShowErrorMessage(response.ErrorMessage);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    //AutoMessage Part
    AddAutoMessage: function () {
        if (CreateChatUtil.ValiDateAutoMessage()) {
            var EachMessage = { Url: "", Message: "", Min: 0, Sec: 0 };
            var index = CreateChatUtil.CheckItemExists($("#ui_txtTimeMinutes").val(), $("#ui_txtUrl").val());
            if (index > -1) {
                messageList[index].Url = $("#ui_txtUrl").val();
                messageList[index].Message = $("#ui_txtMessage").val();
                messageList[index].Min = $("#ui_txtTimeMinutes").val();
                messageList[index].Sec = $("#ui_txtTimeSec").val();
            }
            else {
                EachMessage.Url = $("#ui_txtUrl").val();
                EachMessage.Message = $("#ui_txtMessage").val();
                EachMessage.Min = $("#ui_txtTimeMinutes").val();
                EachMessage.Sec = $("#ui_txtTimeSec").val();
                messageList.push(EachMessage);
            }
            CreateChatUtil.BindAutoMessage();
            $("#ui_divMessageForm").hide();
            ShowSuccessMessage(GlobalErrorList.CreateChat.AddAutoMessage_Success);
        }
    },
    CheckItemExists: function (timeValue, urlValue) {
        var index = -1;
        if (messageList.length > 0) {
            for (var i = 0; i < messageList.length; i++) {
                if (messageList[i].Time == timeValue) {
                    if ((messageList[i].Url == null || messageList[i].Url == "") && urlValue.length > 0) {
                        index = i;
                        break;
                    }
                    else if (ActualUrlWithOutHttpWww(messageList[i].Url.replace(/\/$/, ""), true) == ActualUrlWithOutHttpWww(urlValue.replace(/\/$/, ""), true)) {
                        index = i;
                        break;
                    }
                    else if (urlValue == null || urlValue == "") {
                        index = i;
                        break;
                    }
                }
            }
        }
        return index;
    },
    ValiDateAutoMessage: function () {

        if ($("#ui_txtTimeMinutes").get(0).selectedIndex == 0 && $("#ui_txtTimeSec").get(0).selectedIndex == 0) {
            ShowErrorMessage(GlobalErrorList.CreateChat.ValidateAutoMessageTime_Error);
            $("#ui_txtTime").focus();
            return false;
        }

        if (CleanText($("#ui_txtMessage").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateChat.ValidateAutoMessage_Error);
            $("#ui_txtMessage").focus();
            return false;
        }
        if (CleanText($("#ui_txtUrl").val()).length > 0 && !regExpUrl.test($("#ui_txtUrl").val())) {
            ShowErrorMessage(GlobalErrorList.CreateChat.ValidateAutoMessageUrl_Error);
            $("#ui_txtUrl").focus();
            return false;
        }
        var parser = document.createElement('a');
        parser.href = "//" + ActualUrlWithOutHttpWww($("#ui_txtUrl").val());

        if (CleanText($("#ui_txtUrl").val()).length > 0 && parser.hostname != ActualUrlWithOutHttpWww(domainName)) {
            ShowErrorMessage(GlobalErrorList.CreateChat.ValidateAutoMessageRegisteredUrl_Error);
            $("#ui_txtUrl").focus();
            return false;
        }


        return true;
    },
    ClearFields: function () {
        $("#ui_txtMessage").val('');
        $("#ui_txtUrl").val('');
        $("#ui_txtTimeMinutes").val('00');
        $("#ui_txtTimeSec").val('00');
        $("[id^='ui_div_']").removeClass("activeBgRow");
        $("#ui_dvAddAutoMessage").hide();
    },

    BindAutoMessage: function () {
        CreateChatUtil.ClearFields();

        if (messageList.length > 0) {
            var reportTableTrs = "";
            messageList.sort(function (a, b) {
                return parseInt(a.Time) - parseInt(b.Time);
            });
            for (i = 0; i < messageList.length; i++) {

                reportTableTrs += "<tr id=ui_div_" + i + " ><td class='m-p-w-140 text-left'><p><span class='timemins'>" + messageList[i].Min + "</span>: <span class='timesecs'>" + messageList[i].Sec + "</span> Secs</p>" +
                    "<div class='editDeleteWrap'><button class='td-edit editchatmess' onclick='CreateChatUtil.EditAutoMessage(" + i + ");'>Edit</button>" +
                    "<button data-toggle='modal'data-target='#removeautomessage'class='td-delete delEventTrack'onclick='CreateChatUtil.DeleteAutoMessageConfirm(" + i + ");'>Delete</button></div></td>" +
                    "<td>" + messageList[i].Message + "</td>" +
                    "<td>" + CreateChatUtil.CheckUndefined(messageList[i].Url) + "</td></tr><tr>;"

            }
            $("#ui_tblReportData").removeClass('no-data-records');
            $("#ui_tbodyAutoMessageData").html(reportTableTrs);
        }
        else {
            SetNoRecordContent('ui_tblReportData', 3, 'ui_tbodyAutoMessageData');
        }
    },
    CheckUndefined: function (content) {
        if (content == null || content == "")
            return "NA";
        else
            return content;
    },
    EditAutoMessage: function (Id) {
        $("[id^='ui_div_']").removeClass("activeBgRow");
        if (messageList.length > 0) {
            $("#ui_div_" + Id).addClass("activeBgRow");
            $("#ui_btnAddMessage").hide();
            $("#ui_btnEditMessage").show();
            $("#ui_dvAddAutoMessage").show();
            $("#ui_txtMessage").val(messageList[Id].Message);
            $("#ui_txtUrl").val(messageList[Id].Url);
            $("#ui_txtTimeMinutes").val(messageList[Id].Min);
            $("#ui_txtTimeSec").val(messageList[Id].Sec);
            $("#ui_btnEditMessage").unbind('click').click(function () {
                CreateChatUtil.UpdateAutoMessage(Id);
            });
        }
    },
    UpdateAutoMessage: function (Id) {
        if (CreateChatUtil.ValiDateAutoMessage()) {
            if (messageList.length > 0) {
                var index = CreateChatUtil.CheckItemExists($("#ui_txtTimeMinutes").val(), $("#ui_txtUrl").val());
                if (index > -1) {
                    messageList[index].Url = $("#ui_txtUrl").val();
                    messageList[index].Message = $("#ui_txtMessage").val();
                    messageList[index].Min = $("#ui_txtTimeMinutes").val();
                    messageList[index].Sec = $("#ui_txtTimeSec").val();
                }
                else {
                    messageList[Id].Url = $("#ui_txtUrl").val();
                    messageList[Id].Message = $("#ui_txtMessage").val();
                    messageList[Id].Min = $("#ui_txtTimeMinutes").val();
                    messageList[Id].Sec = $("#ui_txtTimeSec").val();
                }
                CreateChatUtil.BindAutoMessage();
                $("#ui_btnEditMessage").hide();
                $("#ui_btnAddMessage").show();
                $("#ui_divMessageForm").hide();
                ShowSuccessMessage(GlobalErrorList.CreateChat.UpdateAutoMessage_Success);
            }
        }
    },
    InitializeSavingFormat: function (MessageContent) {
        if (MessageContent.length > 0) {
            try {
                messageList = JSON.parse(MessageContent);
                CreateChatUtil.BindAutoMessage();
            }
            catch (error) {
            }
        }
    },
    DeleteAutoMessageConfirm: function (Id) {
        ShowPageLoading();
        messageId = Id;
        ;
        HidePageLoading();
    },
    DeleteAutoMessage: function () {
        messageList.splice(messageId, 1);
        CreateChatUtil.ClearFields();
        CreateChatUtil.BindAutoMessage();
        ShowSuccessMessage(GlobalErrorList.CreateChat.DeleteAutoMessage_Success);
    },
    ShowChatSurvey: function () {
        $(".chatfrmwrp").removeClass("hideDiv");
        $(".chatmediawrp").addClass("hideDiv");
        $(".chatboxcontainer").addClass("df-ac-jcenter");
        $(".chatAgentNmwrp").addClass("hideDiv");
    },
    HideChatSurvey: function () {
        $(".chatfrmwrp").addClass("hideDiv");
        $(".chatmediawrp").removeClass("hideDiv");
        $(".chatboxcontainer").removeClass("df-ac-jcenter");
        $(".chatAgentNmwrp").removeClass("hideDiv");
    },
    CreateUniqueIdentifier: function () {
        var today = new Date();
        var strYear = today.getMonth().toString() + 1 + today.getDate().toString() + today.getMilliseconds().toString();
        $("#ui_txtChatRoom").val("Chat Campaign Identifier -" + strYear);
    },
    GetContactProperties: function () {
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
                            'P5ColumnName': response[i].FieldName, 'FrontEndName': response[i].FieldName, 'FieldType': response[i].FieldName
                        });
                    }
                }

                if (ContactPropertyList != null && ContactPropertyList.length > 0) {
                    //To sort dropdown by alphabetical order **************
                    let field = 'FrontEndName';
                    ContactPropertyList.sort((a, b) => (a[field] || "").toString().localeCompare((b[field] || "").toString()));
                }
                //HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    ValidateWebHookDataFieldsandvalues: function (Id) {

        if ($("#trsearch" + Id).attr("datatype") == "Plumb5Field") {
            if ($("#drpFields_" + Id).get(0).selectedIndex == 0 && $("#txtFieldAnswer_" + Id).val() == "") {
                ShowErrorMessage(GlobalErrorList.CreateChat.DataFieldValue_ErrorMessage);
                return false;
            }
            if ($("#drpFields_" + Id).get(0).selectedIndex == 0 && $("#txtFieldAnswer_" + Id).val() != "") {
                ShowErrorMessage(GlobalErrorList.CreateChat.MappingField_ErrorMessage);
                return false;
            }
            if ($("#drpFields_" + Id).get(0).selectedIndex != 0 && $("#txtFieldAnswer_" + Id).val() == "") {
                ShowErrorMessage(GlobalErrorList.CreateChat.DataField_ErrorMessage);
                return false;
            }
        }
        else if ($("#trsearch" + Id).attr("datatype") == "StaticField") {
            if ($("#txtFieldKey_" + Id).val() == "" && $("#txtFieldAnswer_" + Id).val() == "") {
                ShowErrorMessage(GlobalErrorList.CreateChat.StaticDataFieldKey_ErrorMessage);
                return false;
            }

            if ($("#txtFieldKey_" + Id).val() == "" && $("#txtFieldAnswer_" + Id).val() != "") {
                $("#txtFieldKey_" + Id).focus();
                ShowErrorMessage(GlobalErrorList.CreateChat.StaticDataFieldKey_ErrorMessage);
                return false;
            }

            if ($("#txtFieldKey_" + Id).val() != "" && $("#txtFieldAnswer_" + Id).val() == "") {
                $("#txtFieldAnswer_" + Id).focus();
                ShowErrorMessage(GlobalErrorList.CreateChat.StaticDataFieldValue_ErrorMessage);
                return false;
            }

            //for (var i = 0; i < ContactPropertyList.length; i++) {
            //    if ($.trim($("#txtFieldKey_" + Id).val()).toLowerCase().replace(/ /g, '') == ContactPropertyList[i].P5ColumnName.toLowerCase()) {
            //        ShowErrorMessage(GlobalErrorList.CreateChat.FieldAlreadyExists);
            //        $("#txtFieldKey_" + Id).focus();
            //        return false;
            //    }
            //}
        }
        return true;
    },
    ValidateWebHookHeaderFieldsAndValues: function (Id) {

        if ($("#txtheaderKey_" + Id).val() == "" && $("#txtheaderValue_" + Id).val() == "") {
            ShowErrorMessage(GlobalErrorList.CreateChat.HeaderFieldKeyValue_ErrorMessage);
            return false;
        }

        if ($("#txtheaderKey_" + Id).val() == "" && $("#txtheaderValue_" + Id).val() != "") {
            $("#txtheaderKey_" + Id).focus();
            ShowErrorMessage(GlobalErrorList.CreateChat.HeaderFieldKey_ErrorMessage);
            return false;
        }
        if ($("#txtheaderKey_" + Id).val() != "" && $("#txtheaderValue_" + Id).val() == "") {
            $("#txtheaderValue_" + Id).focus();
            ShowErrorMessage(GlobalErrorList.CreateChat.HeaderFieldValue_ErrorMessage);
            return false;
        }
        return true;
    }
}

//DropDowm Select Values
$(".addtemprulemail,.addtemprulesms,.addtemprulecountry,.addtemprulecity,.specificbtn,.notspecificbtn,.dropdownselcom").select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});


//Chat-Design Next Click
$("#ui_btnStep1Next").click(function () {
    ShowPageLoading();
    if (!CreateChatUtil.ValidateDesign()) {
        HidePageLoading();
        return true;
    }
    $(".container-page-footer").addClass("hideDiv");
    $("#footer2").removeClass("hideDiv");
    $(".campnav-link").removeClass("active  border-left-0");
    $("#tab2").addClass("active  border-left-0");
    $("#dvChatPreview").removeClass("hideDiv");
    CreateChatUtil.AssignDesignValues();
    CreateChatUtil.MovetoEventMessages();
});

//Chat-Event Messages Next Click
$("#ui_btnStep2Next").click(function () {
    if (!CreateChatUtil.ValidateEventMessages()) {
        HidePageLoading();
        return true;
    }
    $(".container-page-footer").addClass("hideDiv");
    $("#footer3").removeClass("hideDiv");
    $(".campnav-link").removeClass("active  border-left-0");
    $("#tab3").addClass("active  border-left-0");
    $("#dvChatPreview").addClass("hideDiv");
    CreateChatUtil.AssignEventMessages();
    CreateChatUtil.MovetoDisplayRules();
});

//Chat-Display Rules Next Click
$("#ui_btnStep3Next").click(function () {
    //if (!ValidateRulesDetails()) {
    //    HidePageLoading();
    //    return true;
    //}
    $(".container-page-footer").addClass("hideDiv");
    $("#footer4").removeClass("hideDiv");
    $(".campnav-link").removeClass("active  border-left-0");
    $("#tab4").addClass("active  border-left-0");
    $("#dvChatPreview").removeClass("hideDiv");
    AssignRulesDetails();
    CreateChatUtil.MovetoReponseSettings();
});

//Save Caht
$("#ui_lnkSaveDetails").click(function () {
    ShowPageLoading();


    if ($("#ui_chkWebHookUrl").is(":checked")) {
        if (Webhookloopdetals.length == 0) {

            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.WebHookEmptyDetails);
            HidePageLoading();
            return false;
        }
        else if (checkwebhookupdatestatus == 1) {

            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.WebHooksavedetailserror);
            HidePageLoading();
            return false;
        }
        else if (checkwebhookupdatestatus == 2) {

            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.WebHookupdatedetailserror);
            HidePageLoading();
            return false;
        }
    }
    checkwebhookupdatestatus = 3;
    if (!CreateChatUtil.ValidateResponseSettings()) {
        HidePageLoading();
        return true;
    }

    CreateChatUtil.AssignResponseSettings();
    if ($("#ui_chkReportMail").is(":checked") && $.trim($("#ui_txtReportMail").val()).length > 0) {
        chatDetails.ReportToDetailsByMail = $("#ui_txtReportMail").val();
    }
    CreateChatUtil.SaveChatDetails();
});


//Response Settings Back /click
$("#ui_btnStep4Back").click(function () {
    $(".container-page-footer").addClass("hideDiv");
    $("#footer3").removeClass("hideDiv");
    $(".campnav-link").removeClass("active  border-left-0");
    $("#tab3").addClass("active  border-left-0");
    $("#dvChatPreview").addClass("hideDiv");
    ShowPageLoading();
    $("#ui_divDesign").addClass("hideDiv");
    $("#ui_divEventMessages").addClass("hideDiv");
    $("#ui_divResponseSettings").addClass("hideDiv");
    $("#ui_divDisplayRules").removeClass("hideDiv");
    $("#cont_setrules").removeClass("hideDiv");
    HidePageLoading();
});

//Display Rules Back /click
$("#ui_btnStep3Back").click(function () {
    $(".container-page-footer").addClass("hideDiv");
    $("#footer2").removeClass("hideDiv");
    $(".campnav-link").removeClass("active  border-left-0");
    $("#tab2").addClass("active  border-left-0");
    $("#dvChatPreview").removeClass("hideDiv");
    ShowPageLoading();
    $("#ui_divDesign").addClass("hideDiv");
    $("#ui_divResponseSettings").addClass("hideDiv");
    $("#ui_divDisplayRules").addClass("hideDiv");
    $("#cont_setrules").addClass("hideDiv");
    $("#ui_divEventMessages").removeClass("hideDiv");
    HidePageLoading();
})

//Event Messages Back /click
$("#ui_btnStep2Back").click(function () {
    $(".container-page-footer").addClass("hideDiv");
    $("#footer1").removeClass("hideDiv");
    $(".campnav-link").removeClass("active  border-left-0");
    $("#tab1").addClass("active  border-left-0");
    $("#dvChatPreview").removeClass("hideDiv");
    ShowPageLoading();
    $("#ui_divDesign").removeClass("hideDiv");
    $("#ui_divResponseSettings").addClass("hideDiv");
    $("#ui_divDisplayRules").addClass("hideDiv");
    $("#cont_setrules").addClass("hideDiv");
    $("#ui_divEventMessages").addClass("hideDiv");
    HidePageLoading();
})

//Design - Auto Message

$("#headingTwo").click(function () {
    if (messageList.length == 0) {
        SetNoRecordContent('ui_tblReportData', 3, 'ui_tbodyAutoMessageData');
    }
});

$("#addlandpage").click(function () {
    $("#ui_dvAddAutoMessage").show();
});
$("#ui_dvCloseAutoMessage").click(function () {
    $("#ui_dvAddAutoMessage").hide();
    $("[id^='ui_div_']").removeClass("activeBgRow");
});

$("#ui_btnCancelAutoMessage").click(function () {
    CreateChatUtil.ClearFields();
    $("[id^='ui_div_']").removeClass("activeBgRow");
});

$("#ui_btnAddMessage").click(function () {
    CreateChatUtil.AddAutoMessage();
});


//Event Messages Part
$("#ui_chkDefaultMesg,#ui_ChkIdelMesg,#ui_ChkOfflineMesg,#ui_ChkChatEndMesg,#ui_ChkMessageHelper").click(function () {

    if ($("#ui_chkDefaultMesg").is(":checked"))
        $("#ui_DvDefaultMesg").removeClass("hideDiv");
    else
        $("#ui_DvDefaultMesg").addClass("hideDiv");

    if ($("#ui_ChkIdelMesg").is(":checked"))
        $("#ui_DvChkIdelMesg").removeClass("hideDiv");
    else
        $("#ui_DvChkIdelMesg").addClass("hideDiv");

    if ($("#ui_ChkOfflineMesg").is(":checked"))
        $("#ui_DvChkOfflineMesg").removeClass("hideDiv");
    else
        $("#ui_DvChkOfflineMesg").addClass("hideDiv");

    if ($("#ui_ChkChatEndMesg").is(":checked"))
        $("#ui_DvChkChatEndMesg").removeClass("hideDiv");
    else
        $("#ui_DvChkChatEndMesg").addClass("hideDiv");

    if ($("#ui_ChkMessageHelper").is(":checked"))
        $("#ui_DvChkMessageHelper").removeClass("hideDiv");
    else
        $("#ui_DvChkMessageHelper").addClass("hideDiv");
});


//Response Setting Part


$("#ui_chkReportMail, #ui_chkSalesPerson,#ui_chkGroups,#ui_chkoverridesource").click(function () {

    if ($("#ui_chkReportMail").is(":checked"))
        $("#ui_divReportMail").removeClass("hideDiv");
    else
        $("#ui_divReportMail").addClass("hideDiv");

    if ($("#ui_chkSalesPerson").is(":checked"))
        $("#ui_divSalesPerson").removeClass("hideDiv");
    else
        $("#ui_divSalesPerson").addClass("hideDiv");

    if ($("#ui_chkGroups").is(":checked"))
        $("#ui_divGroups").removeClass("hideDiv");
    else
        $("#ui_divGroups").addClass("hideDiv");

    if ($("#ui_chkWebHookUrl").is(":checked"))
        $("#ui_addwebhookforchats").removeClass("hideDiv");
    else
        $("#ui_divWebHookUrl").addClass("hideDiv");

    if ($("#ui_chkoverridesource").is(":checked"))
        $("#IsOverriseSource_Tr").removeClass("hideDiv");

    else
        $("#IsOverriseSource_Tr").addClass("hideDiv");

});
$("#ui_chkWebHookUrl").click(function () {
    if (this.checked) {
        $("#ui_addwebhookforchats").removeClass("hideDiv");
        $("#ui_trWebHooks").removeClass("hideDiv");
        if (Webhookloopdetals.length == 0) {
            SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
            HidePageLoading();
        }
    }

    if (!this.checked) {
        $("#ui_addwebhookforchats").addClass("hideDiv");
        $("#ui_trWebHooks").addClass("hideDiv");
        refreshwebhookfields();
        Webhookloopdetals.length = 0;
    }
});

$("#addwebhookbtn").click(function () {
    checkwebhookupdatestatus = 1;
    $("#ui_divWebHookUrl").removeClass("hideDiv");
    $(".dropdown-item.adddatafild").click(0);
    $("#webhookeditoption").removeClass("hideDiv")

    $("#btnsavewebhook").val("Save");
    $("#btnsavewebhook").html("Save");

    refreshwebhookfields();

});

$("#cancelwebhook, #savewebhook").click(function () {
    $("#ui_divWebHookUrl").addClass("hideDiv");
    $("#webhookeditoption input").val(" ");
    $("#methodwebhook, #contentTypewebhook").val(" ");
    checkwebhookupdatestatus = 0;
});

$("#btnsavewebhook").click(function () {
    if (!CreateChatUtil.ValidateResponseSettings()) {
        HidePageLoading();
        return true;
    }
    checkwebhookupdatestatus = 0;
    CreateChatUtil.AssignResponseWebhookSettings();
    WebhookFieldsToedit();
    refreshwebhookfields();

    $("#ui_divWebHookUrl").addClass("hideDiv");
    $("#ui_divWebHookUrl input").val(" ");
    $("#methodwebhook, #ui_ddl_ContentType").val(" ");

    $(".adddatafildwrp").empty();
    $(".addheaderfildwrp").empty();
    trelementcount = 0;
    trheaderelementcount = 0;

});
function editwebhookdetails() {
    refreshwebhookfields();
}
function refreshwebhookfields() {
    document.getElementById("ui_txtRequestUrl").value = null;
    $("#ui_ddl_MethodType").select().val('select').trigger('change');
    $("#ui_ddl_ContentType").select().val('select').trigger('change');
    $(".adddatafildwrp input").val(" ");
    $(".addheaderfildwrp input").val(" ");
    document.getElementById("ui_txt_BasicAuthenticationKey").value = null;
    document.getElementById("ui_txt_BasicAuthenticationValue").value = null;
    $(".datawrkflwinpt").hide();
    $(".adddatafildwrp").empty();
    $(".addheaderfildwrp").empty();
    trelementcount = 0;
    trheaderelementcount = 0;
}



var webhookrowid;
function EditWebhoodetails(id) {
    checkwebhookupdatestatus = 2;
    $("#ui_divWebHookUrl").removeClass("hideDiv");
    $("#webhookeditoption").removeClass("hideDiv");
    webhookrowid = id
    $("#btnsavewebhook").html("Update");
    $("#btnsavewebhook").val("update");
    $(".adddatafildwrp").empty();
    $(".addheaderfildwrp").empty();

    if (Webhookloopdetals != null) {
        $("#ui_chkWebHookUrl").prop("checked", true)
        $("#ui_trWebHooks").removeClass("hideDiv");
        if (Webhookloopdetals[id].RequestURL != null && Webhookloopdetals[id].RequestURL != "")
            $("#ui_txtRequestUrl").val(Webhookloopdetals[id].RequestURL);

        if (Webhookloopdetals[id].MethodType != null && Webhookloopdetals[id].MethodType != "")
            $("#ui_ddl_MethodType").val(Webhookloopdetals[id].MethodType);

        if (Webhookloopdetals[id].ContentType != null && Webhookloopdetals[id].ContentType != "")
            $("#ui_ddl_ContentType").val(Webhookloopdetals[id].ContentType).change();
        /*WebhookFieldsToedit();*/
        let ContentType = $("#ui_ddl_ContentType option:selected").text().toLowerCase();
        if (ContentType == 'form') {
            if (Webhookloopdetals[id].FieldMappingDetails != null && Webhookloopdetals[id].FieldMappingDetails != "") {
                var FieldMappingConditionDetail = Webhookloopdetals[id].FieldMappingDetails;

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
        }
        else if (ContentType == 'raw body') {
            $("#ui_txtRequestBody").val(Webhookloopdetals[id].RawBody);
        }

        if (Webhookloopdetals[id].Headers != null && Webhookloopdetals[id].Headers != "") {
            var HeaderConditionDetail = Webhookloopdetals[id].Headers;
            $.each(JSON.parse(HeaderConditionDetail), function (i, obj) {

                if (i == 0) {
                    trheaderelementcount = 0;
                }

                $(".addheaderfild").click();
                $("#txtheaderKey_" + i).val(obj.Key);
                $("#txtheaderValue_" + i).val(obj.Value);
            });
        }

        if (Webhookloopdetals[id].BasicAuthentication != null && Webhookloopdetals[id].BasicAuthentication != "") {
            var basicauthdetails = JSON.parse(Webhookloopdetals[id].BasicAuthentication);
            $("#ui_txt_BasicAuthenticationKey").val(basicauthdetails.AuthenticationKey);
            $("#ui_txt_BasicAuthenticationValue").val(basicauthdetails.AuthenticationValue);
        }
    }
}
var deletewebhookid = [];
function DeleteWebhookdetails(rowid, webhookidfordelete) {

    $("#webdeleteRowConfirm").attr("Delete", webhookidfordelete).attr("Rowid", rowid);



}
function WebhookFieldsToedit() {

    $("#ui_tbodyReportData").empty();
    if (Webhookloopdetals.length > 0) {
        for (var i = 0; i < Webhookloopdetals.length; i++) {
            let reportTablerows = `<tr>
                                <td>
                                <div class="landurlcont">
                                <div class="landurlwrp">
                                <div class="landurl">
                                ${Webhookloopdetals[i].RequestURL}
                                </div>
                                </div>
                                </div>
                                </td>

                                <td class="text-center">${Webhookloopdetals[i].MethodType}</td>
                                <td class="text-center">${Webhookloopdetals[i].ContentType}</td> 

                                <td><div class="editwebhookwrp"><i class="icon ion-edit editwebhook"   onclick='EditWebhoodetails(${i})'></i></div></td>

                                <td><div class="delwebhookwrp" data-toggle="modal" data-target="#deleterow"><i class="icon ion-trash-b delwebhook" onclick='DeleteWebhookdetails(${i},${Webhookloopdetals[i].WebHookId});'></i></div></td>
                                <tr>`
                ;
            $("#ui_tbodyReportData").append(reportTablerows);

        };
    }
    else {
        SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
        HidePageLoading();
    }
}
$('#webdeleteRowConfirm').click(function () {
    var deleteid = parseInt($("#webdeleteRowConfirm").attr("Delete"));
    let rowid = parseInt($("#webdeleteRowConfirm").attr("Rowid"));
    if (deleteid > 0) {
        deletewebhookid.push(deleteid)
    }
    Webhookloopdetals.splice(rowid, 1);
    WebhookFieldsToedit();

    $("#ui_divWebHookUrl").addClass("hideDiv");
    $("#ui_divWebHookUrl input").val(" ");
    $("#methodwebhook, #ui_ddl_ContentType").val(" ");
    refreshwebhookfields();
});




//Forehead and Background color


//Play Sound test

function ListenSound(SoundFileName) {
    if (SoundFileName != "0") {
        $("#ui_soundChat").attr("src", '../images/Audio/' + SoundFileName);
        var audio = $("#ui_soundChat").get(0);
        audio.play();
    }
}

$("#ui_btnSoundTest").click(function () {
    ListenSound($("#dllSoundNotificationVisitor").val());
});

//chat preview Bar/Bubble
$('input:radio[name="chattopbartype"]').change(function () {
    if ($(this).val() == '0') {
        $(".chatboxwrp").removeClass("border-radius-10");
        $(".chatboxtpbar").removeClass("chatboxbar-radius");
        $("#chateventbtn").addClass("hideDiv");

        if ($(".chatcontainer").hasClass("hideDiv")) {
            $(".chatmesscontainer").addClass("hideDiv");
            $(".chatboxcontainer,.chatoptionwrp,.chatboxtypewrp").removeClass("hideDiv");
            $(".chatcontainer").removeClass("hideDiv");
            $(".chatcontainer").addClass("min-h-500");
        }

    } else {
        $(".chatboxwrp").addClass("border-radius-10");
        $(".chatboxtpbar").addClass("chatboxbar-radius");
        $("#chateventbtn").removeClass("hideDiv").removeClass().addClass('chatbubwrp');

        if ($(".chatboxcontainer").hasClass("hideDiv")) {
            $(".chatboxcontainer,.chatoptionwrp,.chatboxtypewrp").removeClass("hideDiv");
            $(".chatmesscontainer").addClass("hideDiv");
            $(".chatcontainer").removeClass("hideDiv");
            $("#chateventbtn").html("<i class='icon ion-android-close font-28'></i>");
        }
    }
});

//chat preview bg-color
var BackgroundclrId = '';
$(".chatbgcol").click(function () {
    RemoveCurrentBgClass();
    $(".chatboxtpbar, .chatusericn, .chatbtnfrmbgcol, .chatbubwrp").removeClass(
        "bg-grandeur bg-reef bg-transfile bg-dance bg-flickr bg-mantle bg-neon bg-delicate bg-crystal-clear bg-emerald bg-teal-love bg-mojito"
    );
    BackgroundclrId = $(this).attr('id');
    AppendNewClasstoBg(BackgroundclrId);
})

function AppendNewClasstoBg(bgclr) {
    $("#" + bgclr).append("<i class='icon ion-checkmark-round font-16'></i>");
    $(".chatboxtpbar").addClass(bgclr);
    $(".chatbubwrp").addClass(bgclr);
    $(".chatusericn").addClass(bgclr);
    $(".chatbtnfrmbgcol").addClass(bgclr);
};

function RemoveCurrentBgClass() {
    $('.chatgradwrp').find('i').remove();
    $('.chatcustbgcol').find('i').remove();

    if ($("#chattopbarbub").is(":checked")) {
        $("#chateventbtn").removeClass().addClass('chatbubwrp');
    } else {
        $("#ui_chatboxtpbar").removeClass().addClass('chatboxtpbar');
    }
    $(".chatcustbgcol").removeClass("<i class='icon ion-checkmark-round font-16'></i>");
    $(".chatusericn").removeClass().addClass('chatusericn');
    $(".chatbtnfrmbgcol").removeClass().addClass('btn btn-purple btn-block border-0 chatbtnfrmbgcol');
}


$("#chatcustbgbar").change(function () {
    RemoveCurrentBgClass();
    $(".chatboxtpbar, .chatusericn, .chatbtnfrmbgcol, .chatbubwrp").removeClass(
        "bg-grandeur bg-reef bg-transfile bg-dance bg-flickr bg-mantle bg-neon bg-delicate bg-crystal-clear bg-emerald bg-teal-love bg-mojito"
    );
    let chatcustbgbar = $("#chatcustbgbar").val();
    $(".chatcustbgcol").append("<i class='icon ion-checkmark-round font-16'></i>");
    $(".chatcustbgcol").css("background-color", "#" + chatcustbgbar);

    $(".chatboxtpbar").css("background-color", "#" + chatcustbgbar);
    $("#chateventbtn").css("background-color", "#" + chatcustbgbar);
    $(".chatusericn").css("background-color", "#" + chatcustbgbar);
    $(".chatbtnfrmbgcol").css("background-color", "#" + chatcustbgbar);
});



$("#chattitlecol").change(function () {
    //$('.chattitcustbgcol').find('i').remove();
    let fgcol = $("#chattitlecol").val();
    $("#chattitlecolIcon").css("background-color", "#" + fgcol);
    $(".chattitlwrp i").css("color", "#" + fgcol);
    $("#ui_ChatHeader").css("color", "#" + fgcol);
    $("#chateventbtn").find('i').css("color", "#" + fgcol)
});



$("#chateventbtn").click(function () {
    $("#chateventbtn").find('i').remove();
    if (!$(".chatcontainer").hasClass("hideDiv") && $("#chattopbarbub").is(":checked")) {
        $(".chatcontainer").addClass("hideDiv");
        if ($("#ui_txtCustomTitle").val().length > 0) { $(".chatmesscontainer").removeClass("hideDiv"); }
        $("#chateventbtn").append("<i class='icon font-28 ion-ios-chatbubble-outline'></i>");
        $(".chatoptionwrp").removeClass("hideDiv");
    }
    else if ($(".chatcontainer").hasClass("min-h-500") && $("#chattopbar").is(":checked")) {
        if ($("#ui_txtCustomTitle").val().length > 0) { $(".chatmesscontainer").removeClass("hideDiv"); }
        $(".chatboxcontainer,.chatoptionwrp,.chatboxtypewrp").addClass("hideDiv");
        $(".chatcontainer").removeClass("min-h-500");
        $("#chateventbtn").addClass("hideDiv");
    }
    else {
        $(".chatmesscontainer").addClass("hideDiv");
        $(".chatcontainer").removeClass("hideDiv");
        $("#chateventbtn").append("<i class='icon ion-android-close font-28'></i>");
    }

});


$(".chatboxwrp").click(function () {
    if ($("#chattopbar").is(":checked")) {
        if ($(".chatboxcontainer").hasClass("hideDiv")) {
            $(".chatmesscontainer").addClass("hideDiv");
            $(".chatboxcontainer,.chatoptionwrp,.chatboxtypewrp").removeClass("hideDiv");
            $(".chatcontainer").addClass("min-h-500");
            // $("#chateventbtn").removeClass("hideDiv");
            //$("#chateventbtn").append("<i class='icon ion-android-close font-28'></i>");
        } else {
            if ($("#ui_txtCustomTitle").val().length > 0) { $(".chatmesscontainer").removeClass("hideDiv"); }
            $(".chatboxcontainer,.chatoptionwrp,.chatboxtypewrp").addClass("hideDiv");
            $(".chatcontainer").removeClass("min-h-500");
            $("#chateventbtn").addClass("hideDiv");
        }
    }
});

//Chat Header Count
function chattitcharcount(val, n, id) {
    var chattitcharlength = val.value.length;
    if (chattitcharlength > n) {
        val.value = val.value.substring(0, n);
    } else {
        $("#" + id).text(n - chattitcharlength);
    }
}

$("#chattitlebox").keyup(function () {
    let chattittext = $(this).val();
    $(".chattitlwrp h6").html(chattittext);
});


$('#ui_ddlGroups,#ui_ddlUserList').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

//Web Hooks settings add feilds

var trelementcount = 0;
$(".adddatafild").click(function () {
    if (trelementcount != 0) {
        var trList = $('[id^=trsearch]').last();
        trelementcount = trList[0].id.slice(-1);
        trelementcount = parseInt(trelementcount) + 1;

        if (!CreateChatUtil.ValidateWebHookDataFieldsandvalues(trelementcount - 1)) {
            return;
        }
    }
    var Plumb5FieldDropDown = "<option value='0'>Select</option>";

    for (var i = 0; i < ContactPropertyList.length; i++) {
        Plumb5FieldDropDown = Plumb5FieldDropDown + '<option value="' + ContactPropertyList[i].P5ColumnName + '">' + ContactPropertyList[i].FrontEndName + '</option>';
    }

    let getdatafildhmtl = `<div id="trsearch${trelementcount}" datatype="Plumb5Field" class="datawrkflwinpt mb-3">
                           <div class="datainptitemwrp w-45 mr-2"><input type="text" name="" class="form-control" id="txtFieldAnswer_${trelementcount}"></div>
                           <div class="datainptitemwrp w-45">
                            <select name="" class="form-control addCampName" id="drpFields_${trelementcount}" data-placeholder="Add Fields">${Plumb5FieldDropDown}</select>
                            </div>
                            <i class="icon ion-ios-close-outline clsedatawrkflw"></i></div>`;

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

        if (!CreateChatUtil.ValidateWebHookDataFieldsandvalues(trelementcount - 1)) {
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

    $(".adddatafildwrp").append(getdatafildhmtl);
    clsedatawrkflwfild();

    if (trelementcount == 0) {
        trelementcount = trelementcount + 1;
    }
});

var trheaderelementcount = 0;
$(".addheaderfild").click(function () {

    if (trheaderelementcount != 0) {
        var trList = $('[id^=trheader]').last();
        trheaderelementcount = trList[0].id.slice(-1);
        trheaderelementcount = parseInt(trheaderelementcount) + 1;

        if (!CreateChatUtil.ValidateWebHookHeaderFieldsAndValues(trheaderelementcount - 1)) {
            return;
        }
    }

    let getheaderfilditem = `<div id="trheader${trheaderelementcount}" class="datawrkflwinpt mb-3"><div class="datainptitemwrp w-45 mr-2">
    <input type="text" name="" class="form-control" id="txtheaderKey_${trheaderelementcount}"></div><div class="datainptitemwrp w-45">
    <input type="text" name="" class="form-control" id="txtheaderValue_${trheaderelementcount}"></div> <i class="icon ion-ios-close-outline clsedatawrkflw"></i></div>`;
    $(".addheaderfildwrp").append(getheaderfilditem);
    clsedatawrkflwfild();

    if (trheaderelementcount == 0) {
        trheaderelementcount = trheaderelementcount + 1;
    }
});


function clsedatawrkflwfild() {
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



$("#prechatfrmname").change(function () {
    let getprechatnameval = $(this).val();
    if ($("#prechatsurvy").is(":checked")) {
        $("#prechatnamefield").attr("placeholder", getprechatnameval);
        $("#prechatnamefield").focus();
    } else {
        ShowErrorMessage(GlobalErrorList.CreateChat.SelectPreChatSurvey_ErrorMessage);
        //$(".errMesWrapper").removeClass("hideDiv");
        $(this).val("");
        //setTimeout(function () {
        //    $(".errMesWrapper").addClass("hideDiv");
        //}, 3000);
    }
});

$("#prechatfrmemailid").change(function () {
    let getprechatemailval = $(this).val();
    if ($("#prechatsurvy").is(":checked")) {
        $("#prechatemailfield").attr("placeholder", getprechatemailval);
        $("#prechatemailfield").focus();
    } else {
        ShowErrorMessage(GlobalErrorList.CreateChat.SelectPreChatSurvey_ErrorMessage);
        //$(".errMesWrapper").removeClass("hideDiv");
        $(this).val("");
        //setTimeout(function () {
        //    $(".errMesWrapper").addClass("hideDiv");
        //}, 3000);
    }
});

$("#prechatfrmphone").change(function () {
    let getprechatphoneval = $(this).val();
    if ($("#prechatsurvy").is(":checked")) {
        $("#prechatphonefield").attr("placeholder", getprechatphoneval);
        $("#prechatphonefield").focus();
    } else {
        ShowErrorMessage(GlobalErrorList.CreateChat.SelectPreChatSurvey_ErrorMessage);
        //$(".errMesWrapper").removeClass("hideDiv");
        $(this).val("");
        //setTimeout(function () {
        //    $(".errMesWrapper").addClass("hideDiv");
        //}, 3000);
    }
});
$("#prechatfrmmessage").change(function () {
    let getprechatphoneval = $(this).val();
    if ($("#prechatsurvy").is(":checked")) {
        $("#prechatmessagefield").attr("placeholder", getprechatphoneval);
        $("#prechatmessagefield").focus();
    } else {
        ShowErrorMessage(GlobalErrorList.CreateChat.SelectPreChatSurvey_ErrorMessage);
        //$(".errMesWrapper").removeClass("hideDiv");
        $(this).val("");
        //setTimeout(function () {
        //    $(".errMesWrapper").addClass("hideDiv");
        //}, 3000);
    }
});
$("#prechatfrmprivacy").change(function () {
    let getprechatprivacyval = $(this).val();
    if ($("#prechatsurvy").is(":checked")) {
        $("#prechatprivacytext").html(getprechatprivacyval);
    } else {
        ShowErrorMessage(GlobalErrorList.CreateChat.SelectPreChatSurvey_ErrorMessage);
        //$(".errMesWrapper").removeClass("hideDiv");
        $(this).val("");
        //setTimeout(function () {
        //    $(".errMesWrapper").addClass("hideDiv");
        //}, 3000);
    }
});

$("#startchataddtext").change(function () {
    let getprechatstartchatbtnval = $(this).val();
    if ($("#prechatsurvy").is(":checked")) {
        $("#startchatbtn").html(getprechatstartchatbtnval);
    } else {
        ShowErrorMessage(GlobalErrorList.CreateChat.SelectPreChatSurvey_ErrorMessage);
        //$(".errMesWrapper").removeClass("hideDiv");
        $(this).val("");
        //setTimeout(function () {
        //    $(".errMesWrapper").addClass("hideDiv");
        //}, 3000);
    }
});

$("#prechatrespmesstext").change(function () {
    let getprechatrespmesstxtval = $(this).val();
    if ($("#prechatsurvy").is(":checked")) {
        $(".prechatErrorMess").html(getprechatrespmesstxtval);
    } else {
        ShowErrorMessage(GlobalErrorList.CreateChat.SelectPreChatSurvey_ErrorMessage);
        //$(".errMesWrapper").removeClass("hideDiv");
        $(this).val("");
        //setTimeout(function () {
        //    $(".errMesWrapper").addClass("hideDiv");
        //}, 3000);
    }
});



//**********Text Color Change*******************//
$("#chatRespMessTxtcol").change(function () {
    let resmesscol = $(this).val();
    $(".prechatErrorMess").css("color", "#" + resmesscol);
    $("#addRespMesTxtcol").css("background-color", "#" + resmesscol);
});

$("#chatUserBgcol").change(function () {
    let chatvistbdyBgcolval = $(this).val();
    $(this).parent().next().css("background-color", "#" + chatvistbdyBgcolval);
    $("#ulMesg").css("background-color", "#" + chatvistbdyBgcolval);
});

$("#chatAgentBgcol").change(function () {
    let chatAgntBgcolval = $(this).val();
    $(this).parent().next().css("background-color", "#" + chatAgntBgcolval);
    $(".chatmediawrp .msgagent p").css("background-color", "#" + chatAgntBgcolval);
});

$("#chatAgentForecol").change(function () {
    let chatAgntForecolval = $(this).val();
    $(this).parent().next().css("background-color", "#" + chatAgntForecolval);
    $(".chatmediawrp .msgagent p").css("color", "#" + chatAgntForecolval);
});

$("#chatVisitorBgcol").change(function () {
    let chatvistbgcolval = $(this).val();
    $(this).parent().next().css("background-color", "#" + chatvistbgcolval);
    $(".msgagentvistor p").css("background-color", "#" + chatvistbgcolval);
});

$("#chatVisitorforecol").change(function () {
    let chatvistforecolval = $(this).val();
    $(this).parent().next().css("background-color", "#" + chatvistforecolval);
    $(".msgagentvistor p").css("color", "#" + chatvistforecolval);
});


$("#ui_txtCustomTitle").change(function () {
    let getprechatnameval = $(this).val();
    if ($(".chatcontainer").hasClass("hideDiv") && $("#chattopbarbub").is(":checked") && getprechatnameval.length > 0)
        $(".chatmesscontainer").removeClass("hideDiv");
    else if (!$(".chatcontainer").hasClass("min-h-500") && $("#chattopbar").is(":checked") && getprechatnameval.length > 0)
        $(".chatmesscontainer").removeClass("hideDiv");
    else
        $(".chatmesscontainer").addClass("hideDiv");
    $("#lblBoxText").html(getprechatnameval);
});
$("#ui_txtFormOnlineTitle").change(function () {
    let getprechatnameval = $(this).val();
    $("#lblFormTitle").html(getprechatnameval);
});

$('input[name="prechatpreview"]').click(function () {
    if ($("#prechatpreview").is(":checked")) {
        $(".chatfrmwrp").removeClass("hideDiv");
        $(".chatmediawrp").addClass("hideDiv");
        $(".chatAgentNmwrp").addClass("hideDiv");
        $(".chatboxcontainer").addClass("df-ac-jcenter");
    } else {
        $(".chatfrmwrp").addClass("hideDiv");
        $(".chatmediawrp").removeClass("hideDiv");
        $(".chatAgentNmwrp").removeClass("hideDiv");
        $(".chatboxcontainer").removeClass("df-ac-jcenter");
    }

});

function openForm() {
    $(".chatfrmwrp, .chatmediawrp, .chatAgentNmwrp").toggleClass("hideDiv");
    $(".chatboxcontainer").toggleClass("df-ac-jcenter");
};

$(".chatclsewrp").click(function () {
    if (!$("#chateventbtn").hasClass("hideDiv")) {
        $("#chateventbtn").click();
    }
});

function InitializeIsoverridesourceList() {
    $.ajax({
        url: "/ManageContact/ApiImportSettings/GetLMSGroupList",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        dataFilter: function (data) { return data; },
        success: function (response) {
            loadingDataValues.UsersList = true;

            if (response != undefined && response != null) {
                $.each(response, function () {
                    IsOverRideSourceListDetails.push({ value: $(this)[0].Id, label: $(this)[0].Name });
                    $("#ui_ddlIsoverridesourceList").append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");

                });
            }
        },
        error: ShowAjaxError
    });
}