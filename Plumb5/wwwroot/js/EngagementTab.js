
$(document).ready(function () {
    MenuHideAndShow();
    ExpandDivHeightNavigation();
    NagivationOfMenu();
    NewLeadCount();
});

document.onscroll = function () {
    ExpandDivHeightNavigation();
};

NagivationOfMenu = function () {
    $("#firstpane p.menu_head").click(function () {
        $(this).next("div.menu_body").slideToggle(300).siblings("div.menu_body").slideUp("slow");
    });
};

ExpandDivHeightNavigation = function () {
    if ($("#dvExpend").length > 0) {
        var height = $("#dvControlPanel").height() + 16;
        if ($("#dvExpend").css("left") == "0px")
            height = height - 8;
        $("#dvExpend").css({ 'height': height + 'px' });
    }

    //Contact Info
    if ($(window).scrollTop() == 0) {
        $(".dvContactInfo").css({ 'position': '' })
        $(".dvContactInfo").css({ 'top': '57px' })
    }
    else {
        $(".dvContactInfo").css({ 'position': 'fixed' })
        $(".dvContactInfo").css({ 'top': '0px' })
    }

};


$("#dvExpend").click(function () {
    if ($('#firstpane').is(":visible")) {
        $("#dvExpend").css({ left: '0px', marginTop: "18px", opacity: 1 });
        $('#dvMainMenu').hide("fast", function () { ExpandDivHeightNavigation(); });
    }
    else {

        $('#dvExpend').animate({ left: "190px", marginTop: "11px", opacity: 0.31 }, { duration: 250 });
        $('#dvMainMenu').show("fast", function () { ExpandDivHeightNavigation(); });
    }
});


MenuHideAndShow = function () {

    var pageFullUrl = window.location.href.toString().toLowerCase();
    if (pageFullUrl.indexOf("form/new") > 0 || pageFullUrl.indexOf("form/campaign") > 0 || pageFullUrl.indexOf("form/captureform") > 0 || pageFullUrl.indexOf("form/managepoll") > 0 || pageFullUrl.indexOf("form/managequestion") > 0 || pageFullUrl.indexOf("form/managerating") > 0 || pageFullUrl.indexOf("form/manageembedform") > 0 || pageFullUrl.indexOf("form/managerssfeed") > 0 || pageFullUrl.indexOf("form/managebanner") > 0 || pageFullUrl.indexOf("form/manageclicktocall") > 0 || pageFullUrl.indexOf("form/multiconditionbanner") > 0 || pageFullUrl.indexOf("form/managevariettest") > 0) {
        $("#ui_lnkFormCreateNew").addClass("ActiveTab");
        $("#dvForm").show();
    }
    else if (pageFullUrl.indexOf("form/setting") > 0) {
        $("#ui_lnkFormSetting").addClass("ActiveTab");
        $("#dvForm").show();
    }
    else if (pageFullUrl.indexOf("form/allforms") > 0) {
        $("#ui_lnkFormAllForms").addClass("ActiveTab");
        $("#dvForm").show();
    }
    else if (pageFullUrl.indexOf("form/dashboard") > 0) {//ManageQuestion
        $("#ui_lnkFormDashboard").addClass("ActiveTab");
        $("#dvForm").show();
    }
    else if (pageFullUrl.indexOf("form/response") > 0 || pageFullUrl.indexOf("formresponses") > 0) {
        $("#ui_lnkFormResponse").addClass("ActiveTab");
        $("#dvForm").show();
    }
    else if (pageFullUrl.indexOf("form/bannerresponse") > 0) {
        $("#ui_lnkFormBannerResponse").addClass("ActiveTab");
        $("#dvForm").show();
    }
    else if (pageFullUrl.indexOf("form/allinteraction") > 0) {
        $("#ui_lnkFormAllInteraction").addClass("ActiveTab");
        $("#dvForm").show();
    }
    else if (pageFullUrl.indexOf("form/customreport") > 0) {
        $("#ui_lnkFormCustomReport").addClass("ActiveTab");
        $("#dvForm").show();
    }
        //else if (pageFullUrl.indexOf("campaignnewcustomreport") > 0) {
        //    $("#a_CampaignNewCustomReport").addClass("ActiveTab");
        //    $("#dvForm").show();
        //} // Chat
    else if (pageFullUrl.indexOf("chat/dashboard") > 0) {
        $("#ui_lnkChatDashboard").addClass("ActiveTab");
        $("#dvChat").show();
    }
    else if (pageFullUrl.indexOf("chat/allchat") > 0 || pageFullUrl.indexOf("chatroom") > 0 || pageFullUrl.indexOf("chatdashboard") > 0) {
        $("#ui_lnkChatAllChat").addClass("ActiveTab");
        $("#dvChat").show();
    }
    else if (pageFullUrl.indexOf("chat/responses") > 0) {
        $("#ui_lnkChatResponses").addClass("ActiveTab");
        $("#dvChat").show();
    }
    else if (pageFullUrl.indexOf("chat/customreport") > 0) {
        $("#ui_lnkChatCustomReport").addClass("ActiveTab");
        $("#dvChat").show();
    }
    else if (pageFullUrl.indexOf("chat/agentreport") > 0) {
        $("#ui_lnkChatAgentReport").addClass("ActiveTab");
        $("#dvChat").show();
    }
    else if (pageFullUrl.indexOf("chat/new") > 0) {
        $("#ui_lnkChatNew").addClass("ActiveTab");
        $("#dvChat").show();
    }// Mail
    else if (pageFullUrl.indexOf("mail/dashboard") > 0) {
        $("#ui_lnkMailDashboard").addClass("ActiveTab");
        $("#dvMail").show()
    }
    else if (pageFullUrl.indexOf("mail/responses") > 0 || pageFullUrl.indexOf("mail/mailcampaignresponsereport") > 0) {
        $("#ui_lnkMailResponses").addClass("ActiveTab");
        $("#dvMail").show()
    }
    else if (pageFullUrl.indexOf("mail/effectiveness") > 0 || pageFullUrl.indexOf("mail/maileffectivenessreport") > 0 || pageFullUrl.indexOf("clickurl") > 0) {
        $("#ui_lnkMailEffectiveness").addClass("ActiveTab");
        $("#dvMail").show()
    }
    else if (pageFullUrl.indexOf("mail/template") > 0 || pageFullUrl.indexOf("mail/campaign") > 0) {
        $("#ui_lnkMailTemplates").addClass("ActiveTab");
        $("#dvMail").show()
    }
    else if (pageFullUrl.indexOf("mail/group") > 0 || pageFullUrl.indexOf("createtemp") > 0 || pageFullUrl.indexOf("createtempheaderfotter") > 0 || pageFullUrl.indexOf("mailtemplatedesign") > 0 || pageFullUrl.indexOf("mailthemedesign") > 0) {
        $("#ui_lnkMailGroupNew").addClass("ActiveTab");
        $("#dvMail").show()
    }
    else if ((pageFullUrl.indexOf("mail/shuffle") > 0 && pageFullUrl.indexOf("allcontactlist") < 0)) {
        $("#ui_lnkMailShuffle").addClass("ActiveTab");
        $("#dvMail").show()
    }
    else if (pageFullUrl.indexOf("mail/contacts") > 0 || pageFullUrl.indexOf("updatecontact") > 0 || pageFullUrl.indexOf("mail/contactimport") > 0 || pageFullUrl.indexOf("mail/contactimport") > 0 || pageFullUrl.indexOf("mail/contactfield") > 0) {
        $("#ui_lnkMailContacts").addClass("ActiveTab");
        $("#dvMail").show()
    }
    else if (pageFullUrl.indexOf("mail/send") > 0) {
        $("#ui_lnkMailSend").addClass("ActiveTab");
        $("#dvMail").show()
    }
    else if (pageFullUrl.indexOf("mail/schedules") > 0) {
        $("#ui_lnkMailSchedules").addClass("ActiveTab");
        $("#dvMail").show()
    }
    else if (pageFullUrl.indexOf("mail/splittest") > 0) {
        $("#ui_lnkMailSplitTest").addClass("ActiveTab");
        $("#dvMail").show()
    }
    else if (pageFullUrl.indexOf("mail/history") > 0) {
        $("#ui_lnkMailHistory").addClass("ActiveTab");
        $("#dvMail").show()
    }
    else if (pageFullUrl.indexOf("mail/bounced") > 0) {
        $("#ui_lnkMailBounced").addClass("ActiveTab");
        $("#dvMail").show()
    }
    else if (pageFullUrl.indexOf("mail/configuration") > 0) {
        $("#ui_lnkMailConfigration").addClass("ActiveTab");
        $("#dvMail").show()
    }
        //Trigger  
    else if (pageFullUrl.indexOf("mail/triggerdashboard") > 0) {
        $("#ui_lnkMailTriggerDashboard").addClass("ActiveTab");
        $("#dvMail").show();
    }
    else if (pageFullUrl.indexOf("mail/triggerreport") > 0 || pageFullUrl.indexOf("mail/triggereachreport") > 0) {
        $("#ui_lnkMailTriggerReport").addClass("ActiveTab");
        $("#dvMail").show();
    }
    else if (pageFullUrl.indexOf("mail/createmailtrigger") > 0) {
        $("#ui_lnkMailCreateMailTrigger").addClass("ActiveTab");
        $("#dvMail").show();
    }
   
        //SMS
    else if (pageFullUrl.indexOf("sms/dashboard") > 0 || pageFullUrl.indexOf("smssentdeliverddetails") > 0) {
        $("#ui_lnkSMSDashboard").addClass("ActiveTab");
        $("#dvSMSCampaign").show();
    }
    else if (pageFullUrl.indexOf("sms/groups") > 0) {
        $("#ui_lnkSMSGroups").addClass("ActiveTab");
        $("#dvSMSCampaign").show();
    }
    else if (pageFullUrl.indexOf("sms/contacts") > 0 || pageFullUrl.indexOf("smstemplateupload") > 0) {
        $("#ui_lnkSMSContacts").addClass("ActiveTab");
        $("#dvSMSCampaign").show();
    }
    else if (pageFullUrl.indexOf("sms/template") > 0 || pageFullUrl.indexOf("sms/campaign") > 0 || pageFullUrl.indexOf("sms/uploadtemplate") > 0) {
        $("#ui_lnkSMSTemplate").addClass("ActiveTab");
        $("#dvSMSCampaign").show();
    }
    else if (pageFullUrl.indexOf("sms/send") > 0) {
        $("#ui_lnkSMSSend").addClass("ActiveTab");
        $("#dvSMSCampaign").show();
    }
    else if (pageFullUrl.indexOf("sms/triggerdashboard") > 0) {
        $("#ui_lnkSmsTriggerDashboard").addClass("ActiveTab");
        $("#dvSMSCampaign").show();
    }
    else if (pageFullUrl.indexOf("sms/triggerreport") > 0) {
        $("#ui_lnkSmsTriggerReport").addClass("ActiveTab");
        $("#dvSMSCampaign").show();
    }
    else if (pageFullUrl.indexOf("sms/createsmstrigger") > 0) {
        $("#ui_lnkSmsCreateSmsTrigger").addClass("ActiveTab");
        $("#dvSMSCampaign").show();
    }
    else if (pageFullUrl.indexOf("sms/configuration") > 0) {
        $("#ui_lnkSMSConfigration").addClass("ActiveTab");
        $("#dvSMSCampaign").show();
    }//LMS
    else if (pageFullUrl.indexOf("prospect/dashboard") > 0) {
        $("#ui_lnkLmsDashboard").addClass("ActiveTabLMS");
        $("#dvLms").show();
    }
    else if (pageFullUrl.indexOf("prospect/lmsgroup") > 0) {
        $("#ui_lnkLmsGroups").addClass("ActiveTabLMS");
        $("#dvLms").show();
    }
    else if (pageFullUrl.indexOf("prospect/leads") > 0) {
        $("#ui_lnkLmsContacts").addClass("ActiveTabLMS");
        $("#dvLms").show();
    }
    else if (pageFullUrl.indexOf("prospect/customreport") > 0) {
        $("#ui_lnkLmsTemplate").addClass("ActiveTabLMS");
        $("#dvLms").show();
    }
    else if (pageFullUrl.indexOf("prospect/setting") > 0) {
        $("#ui_lnkLmsSend").addClass("ActiveTabLMS");
        $("#dvLms").show();
    }
    else if (pageFullUrl.indexOf("lmsfieldsconfigure") > 0) {
        $("#a_LmsLeads").addClass("ActiveTab");
        $("#dvLms").show();
    }
    else if (pageFullUrl.indexOf("tab=personalization") > 0) {
        $("#dvForm").show();
    }
    else if (pageFullUrl.indexOf("tab=chat") > 0) {
        $("#dvChat").show();
    }
    else if (pageFullUrl.indexOf("tab=mail") > 0) {
        $("#dvMail").show();
    }
    else if (pageFullUrl.indexOf("tab=lms") > 0) {
        $("#dvLms").show();
    }
    else if (pageFullUrl.indexOf("tab=trigger") > 0) {
        $("#dvTrigger").show();
    }
    else if (pageFullUrl.indexOf("tab=sms") > 0) {
        $("#dvSMSCampaign").show();
    }
	else if (pageFullUrl.indexOf("facebook/notification/dashboard") > 0) {
        $("#ui_lnkFBDashboard").addClass("ActiveTab");
        $("#dvFBPushNotification").show();
}
else if (pageFullUrl.indexOf("facebook/notification/notifications") > 0) {
        $("#ui_lnkFBNotification").addClass("ActiveTab");
        $("#dvFBPushNotification").show();
}
else if (pageFullUrl.indexOf("facebook/notification/notificationresponses") > 0) {
        $("#ui_lnkFBNotificationResponses").addClass("ActiveTab");
       $("#dvFBPushNotification").show();
}
else if (pageFullUrl.indexOf("facebook/notification/setting") > 0) {
        $("#ui_lnkFBPersmissionSetting").addClass("ActiveTab");
        $("#dvFBPushNotification").show();
}
else if (pageFullUrl.indexOf("facebook/notification/sendnotification") > 0) {
        $("#ui_lnkFBSendNotification").addClass("ActiveTab");
       $("#dvFBPushNotification").show();
}
else if (pageFullUrl.indexOf("facebook/notification/visitors") > 0) {
        $("#ui_lnkFBVisitors").addClass("ActiveTab");
        $("#dvFBPushNotification").show();
    }
else if (pageFullUrl.indexOf("facebook/notification/groups") > 0) {
        $("#ui_lnkFBGroups").addClass("ActiveTab");
        $("#dvFBPushNotification").show();
    }
};

function NewLeadCount() {
    var LeadUnSeen;
    $.ajax({
        url: "/Form/CommonDetailsForForms/LeadUnSeenMaxCount",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            $("#spLeadNotification").html(result);
        },
        error: ShowAjaxError
    });
}