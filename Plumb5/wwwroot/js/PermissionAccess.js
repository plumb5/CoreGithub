var PermissionAreas;
var IsEmailViewPermission = false, IsSmsViewPermission = false, IsCallViewPermission = false, IsNoteViewPermission = false,
    IsWhatsAppViewPermission = false;

$(document).ready(function () {
    var re = /[^/]*/g;
    PermissionAreas = window.location.href.match(re)[5];

    CheckAccessPermission("CaptureForm");
    CheckAccessPermission("Chat");
    CheckAccessPermission("Mail");
    CheckAccessPermission("Sms");
    CheckAccessPermission("Prospect");
    CheckAccessPermission("ManageUsers");
    CheckAccessPermission("Journey");
    CheckAccessPermission("WebPush");
    CheckAccessPermission("ManageContact");
    CheckAccessPermission("Analytics");
    CheckAccessPermission("MobilePushNotification");
    CheckAccessPermission("MobileInApp");
    CheckAccessPermission("MobileAnalytics");
    CheckAccessPermission("FacebookPage");
    CheckAccessPermission("WhatsApp");
});

function CheckAccessPermission(Areas) {

    if ($("#permissionsList_IsSuperAdmin").val() == "False") {

        if (Areas == "CaptureForm")
            CheckAccessPermissionForForms();
        else if (Areas == "Chat")
            CheckAccessPermissionForChat();
        else if (Areas == "Mail")
            CheckAccessPermissionForMail();
        else if (Areas == "Sms")
            CheckAccessPermissionForSMS();
        else if (Areas == "Prospect")
            CheckAccessPermissionForLMS();
        else if (Areas == "ManageUsers")
            CheckAccessPermissionForUser();
        else if (Areas == "Journey")
            CheckAccessPermissionForWorkFlow();
        else if (Areas == "WebPush")
            CheckAccessPermissionForWebPush();
        else if (Areas == "ManageContact")
            CheckAccessPermissionForContacts();
        else if (Areas == "Analytics")
            CheckAccessPermissionForAnalytics();
        else if (Areas == "MobilePushNotification")
            CheckAccessPermissionForMobilePushNotification();
        else if (Areas == "MobileInApp")
            CheckAccessPermissionForMobileInApp();
        else if (Areas == "MobileAnalytics")
            CheckAccessPermissionForMobileAnalytics();
        else if (Areas == "FacebookPage")
            CheckAccessPermissionForFacebookPage();
        else if (Areas == "WhatsApp")
            CheckAccessPermissionForWhatsApp();

        //Permission Only for admin
        $("#ui_lnkMailConfigration,#ui_lnkSMSConfigration,#ui_lnkWhatsAppSettings").hide();
    }
}

function CheckAccessPermissionForForms() {
    if ($("#permissionsList_Forms").val() == "True") {

        if ($("#permissionsList_FormsHasFullControl").val() == "False") {

            $("#ui_lnkFormSetting").hide();

            if ($("#permissionsList_FormsView").val() == "True" && $("#permissionsList_FormsDesign").val() == "False")
                $("#ui_lnkFormCreateNew").hide();

            if ($("#permissionsList_FormsView").val() == "False" && $("#permissionsList_FormsDesign").val() == "True")
                $("#ui_lnkFormDashboard,#ui_lnkFormResponse,#ui_lnkFormCustomReport,#ui_lnkFormBannerResponse,#ui_lnkFormAllInteraction,#ui_lnkFormSetting,#ui_lnkFormCoupon,#ui_lnkInpageConfiguration").hide();

            if (PermissionAreas != "Chat" && PermissionAreas != "Sms" && PermissionAreas != "Mail" && PermissionAreas != "Prospect" && PermissionAreas != "ManageUsers" && PermissionAreas != "Journey" && PermissionAreas != "WebPush" && PermissionAreas != "ManageContact" && PermissionAreas != "Analytics" && PermissionAreas != "MobileInApp" && PermissionAreas != "MobilePushNotification" && PermissionAreas != "MobileAnalytics" && PermissionAreas != "FacebookPage" && PermissionAreas != "WhatsApp") {
                $(".FullControlPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                $(".FullControlPermission").removeAttr("data-target");

                $('.FullControlPermission').unbind().click(function (event) {
                    AccessDeniedPermission();

                    if (event.preventDefault)
                        event.preventDefault();
                    else
                        event.returnValue = false;
                });

                if ($("#permissionsList_FormsContribute").val() == "False") {

                    if ($("#ui_exportOrDownloadAll").length > 0) { $("#ui_exportOrDownloadAll").removeAttr("data-target"); }

                    $(".ContributePermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    $(".ContributePermission:not(input[type='button'])").attr('disabled', true);
                    $(".ContributePermission.ion-ios-download-outline").prop("disabled", true);

                    $('.ContributePermission').unbind().click(function (event) {
                        AccessDeniedPermission();

                        if (event.preventDefault)
                            event.preventDefault();
                        else
                            event.returnValue = false;
                    });

                    if ($("#permissionsList_FormsView").val() == "True" && $("#permissionsList_FormsDesign").val() == "False") {
                        $(".DesignPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");

                        $('.DesignPermission').unbind().click(function (event) {
                            AccessDeniedPermission();

                            if (event.preventDefault)
                                event.preventDefault();
                            else
                                event.returnValue = false;
                        });
                    }
                    else if ($("#permissionsList_FormsView").val() == "False" && $("#permissionsList_FormsDesign").val() == "True") {
                        $(".ViewPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    }
                }
            }
        }
    }
    else {
        $("#ui_lnkFormDashboard,#ui_lnkFormAllForms,#ui_lnkFormResponse,#ui_lnkFormCustomReport,#ui_lnkFormBannerResponse,#ui_lnkFormAllInteraction,#ui_lnkFormCreateNew,#ui_lnkFormSetting").hide();
    }
}

function CheckAccessPermissionForChat() {
    if ($("#permissionsList_SiteChat").val() == "True") {

        if ($("#permissionsList_SiteChatHasFullControl").val() == "False") {

            if ($("#permissionsList_SiteChatView").val() == "True" && $("#permissionsList_SiteChatDesign").val() == "False")
                $("#ui_lnkChatNew").hide();

            if ($("#permissionsList_SiteChatView").val() == "False" && $("#permissionsList_SiteChatDesign").val() == "True")
                $("#ui_lnkChatDashboard,#ui_lnkChatResponses,#ui_lnkChatCustomReport,#ui_lnkChatAgentReport").hide();

            if (PermissionAreas != "CaptureForm" && PermissionAreas != "Sms" && PermissionAreas != "Mail" && PermissionAreas != "Prospect" && PermissionAreas != "ManageUsers" && PermissionAreas != "Journey" && PermissionAreas != "WebPush" && PermissionAreas != "ManageContact" && PermissionAreas != "Analytics" && PermissionAreas != "MobileInApp" && PermissionAreas != "MobilePushNotification" && PermissionAreas != "MobileAnalytics" && PermissionAreas != "FacebookPage" && PermissionAreas != "WhatsApp") {
                $(".FullControlPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                $(".FullControlPermission").removeAttr("data-target");

                if ($("#permissionsList_SiteChatContribute").val() == "False") {

                    $(".ContributePermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    $(".ContributePermission:not(input[type='button'])").attr('disabled', true);
                    $(".ContributePermission.ion-ios-download-outline").prop("disabled", true);
                    $(".ContributePermission").removeAttr("data-target");

                    $('.ContributePermission').unbind().click(function (event) {
                        AccessDeniedPermission();

                        if (event.preventDefault)
                            event.preventDefault();
                        else
                            event.returnValue = false;
                    });

                    if ($("#permissionsList_SiteChatView").val() == "True" && $("#permissionsList_SiteChatDesign").val() == "False") {
                        $(".DesignPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");

                        $('.DesignPermission').unbind().click(function (event) {
                            AccessDeniedPermission();

                            if (event.preventDefault)
                                event.preventDefault();
                            else
                                event.returnValue = false;
                        });
                    }
                    else if ($("#permissionsList_SiteChatView").val() == "False" && $("#permissionsList_SiteChatDesign").val() == "True") {
                        $(".ViewPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    }
                }
            }
        }
    }
    else {
        $("#ui_lnkChatDashboard,#ui_lnkChatAllChat,#ui_lnkChatResponses,#ui_lnkChatCustomReport,#ui_lnkChatAgentReport,#ui_lnkChatNew").hide();
    }
}

function CheckAccessPermissionForSMS() {
    if ($("#permissionsList_SMS").val() == "True") {

        if ($("#permissionsList_SMSHasFullControl").val() == "False") {

            $("#ui_lnkSMSConfigration").hide();

            if ($("#permissionsList_SMSContribute").val() == "False")
                $("#ui_lnkSmsCreateSmsTrigger,#ui_lnkSMSSend").hide();

            if ($("#permissionsList_SMSView").val() == "False" && $("#permissionsList_SMSDesign").val() == "True")
                $("#ui_lnkSMSDashboard,#ui_lnkSMSReport,#ui_lnkSMSGroups,#ui_lnkSMSContacts,#ui_lnkSMSSend,#ui_lnkSmsTriggerDashboard,#ui_lnkSmsTriggerReport,#ui_lnkSmsCreateSmsTrigger,#ui_lnkSMSConfigration,#ui_lnkSmsSchedules").hide();

            if (PermissionAreas != "CaptureForm" && PermissionAreas != "Chat" && PermissionAreas != "Mail" && PermissionAreas != "Prospect" && PermissionAreas != "ManageUsers" && PermissionAreas != "Journey" && PermissionAreas != "WebPush" && PermissionAreas != "ManageContact" && PermissionAreas != "Analytics" && PermissionAreas != "MobileInApp" && PermissionAreas != "MobilePushNotification" && PermissionAreas != "MobileAnalytics" && PermissionAreas != "FacebookPage" && PermissionAreas != "WhatsApp") {
                $(".FullControlPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);").attr('disabled', true);
                $(".FullControlPermission").removeAttr("data-target");

                if ($("#permissionsList_SMSContribute").val() == "False") {
                    IsSmsViewPermission = true;
                    $(".ContributePermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    $(".ContributePermission:not(input[type='button'])").attr('disabled', true);
                    $(".ContributePermission.ion-ios-download-outline").prop("disabled", true);

                    $('.ContributePermission').unbind().click(function (event) {
                        AccessDeniedPermission();

                        if (event.preventDefault)
                            event.preventDefault();
                        else
                            event.returnValue = false;
                    });

                    if ($("#permissionsList_SMSView").val() == "True" && $("#permissionsList_SMSDesign").val() == "False") {
                        $(".DesignPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);").attr('disabled', true);
                    }
                    else if ($("#permissionsList_SMSView").val() == "False" && $("#permissionsList_SMSDesign").val() == "True") {
                        $(".ViewPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);").attr('disabled', true);
                    }
                }
            }
            else {
                if ($("#permissionsList_SMSContribute").val() == "False")
                    IsSmsViewPermission = true;
            }
        }
    }
    else {
        IsSmsViewPermission = true;
        $("#ui_lnkSMSDashboard,#ui_lnkSMSReport,#ui_lnkSMSGroups,#ui_lnkSMSContacts,#ui_lnkSMSTemplate,#ui_lnkSMSSend,#ui_lnkSmsTriggerDashboard,#ui_lnkSmsTriggerReport,#ui_lnkSmsCreateSmsTrigger,#ui_lnkSMSConfigration").hide();
    }
}

function CheckAccessPermissionForMail() {
    if ($("#permissionsList_EmailMarketing").val() == "True") {

        if ($("#permissionsList_EmailMarketingHasFullControl").val() == "False") {

            $("#ui_lnkMailConfigration,#ui_lnkMailConfigForSending").hide();

            if ($("#permissionsList_EmailMarketingContribute").val() == "False")
                $("#ui_lnkMailCreateMailTrigger,#ui_lnkMailSend,#ui_lnkMailShuffle").hide();

            if ($("#permissionsList_EmailMarketingView").val() == "False" && $("#permissionsList_EmailMarketingDesign").val() == "True")
                $("#ui_lnkMailDashboard,#ui_lnkMailResponses, #ui_lnkMailEffectiveness,#ui_lnkMailContacts, #ui_lnkMailGroupNew, #ui_lnkMailShuffle,#ui_lnkMailSchedules,#ui_lnkMailSplitTest,#ui_lnkMailHistory,#ui_lnkMailBounced,#ui_lnkMailTriggerDashboard,#ui_lnkMailTriggerReport").hide();

            if (PermissionAreas != "CaptureForm" && PermissionAreas != "Chat" && PermissionAreas != "Sms" && PermissionAreas != "Prospect" && PermissionAreas != "ManageUsers" && PermissionAreas != "Journey" && PermissionAreas != "WebPush" && PermissionAreas != "ManageContact" && PermissionAreas != "Analytics" && PermissionAreas != "MobileInApp" && PermissionAreas != "MobilePushNotification" && PermissionAreas != "MobileAnalytics" && PermissionAreas != "FacebookPage" && PermissionAreas != "WhatsApp") {

                $(".FullControlPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);").attr('disabled', true);
                $(".FullControlPermission").removeAttr("data-target");

                if ($("#permissionsList_EmailMarketingContribute").val() == "False") {
                    IsEmailViewPermission = true;
                    $(".ContributePermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    $(".ContributePermission:not(input[type='button'])").attr('disabled', true);
                    $(".ContributePermission.ion-ios-download-outline").prop("disabled", true);
                    $(".ContributePermission").removeAttr("data-target");

                    $('.ContributePermission').unbind().click(function (event) {
                        AccessDeniedPermission();

                        if (event.preventDefault)
                            event.preventDefault();
                        else
                            event.returnValue = false;
                    });


                    if ($("#permissionsList_EmailMarketingView").val() == "True" && $("#permissionsList_EmailMarketingDesign").val() == "False") {
                        $(".DesignPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);").attr('disabled', true);
                    }
                    else if ($("#permissionsList_EmailMarketingView").val() == "False" && $("#permissionsList_EmailMarketingDesign").val() == "True") {
                        $(".ViewPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);").attr('disabled', true);
                    }
                }
            } else {
                if ($("#permissionsList_EmailMarketingContribute").val() == "False")
                    IsEmailViewPermission = true;
            }
        }
    }
    else {
        IsEmailViewPermission = true;
        $("#ui_lnkMailDashboard,#ui_lnkMailResponses, #ui_lnkMailEffectiveness,#ui_lnkMailContacts, #ui_lnkMailGroupNew, #ui_lnkMailShuffle,#ui_lnkMailSend,#ui_lnkMailSchedules,#ui_lnkMailSplitTest,#ui_lnkMailHistory,#ui_lnkMailBounced,#ui_lnkMailTriggerDashboard,#ui_lnkMailTriggerReport,#ui_lnkMailCreateMailTrigger,#ui_lnkMailConfigration,#ui_lnkMailConfigForSending,#ui_lnkMailTemplates").hide();
    }
}

function CheckAccessPermissionForLMS() {
    if ($("#permissionsList_LeadManagement").val() == "True") {

        IsEmailViewPermission = false;
        IsSmsViewPermission = false;

        SubAccessPermission("AddSource");
        SubAccessPermission("AddLead");
        SubAccessPermission("EditLead");
        SubAccessPermission("GroupManage");
        SubAccessPermission("AddCustomeFields");
        SubAccessPermission("ImportLead");

        SubAccessPermission("SendMail");
        SubAccessPermission("SendSms");
        SubAccessPermission("MakeaCall");
        SubAccessPermission("DeleteLead");

        if ($("#permissionsList_LeadManagementHasFullControl").val() == "False") {

            if (PermissionAreas != "CaptureForm" && PermissionAreas != "Chat" && PermissionAreas != "Sms" && PermissionAreas != "Mail" && PermissionAreas != "ManageUsers" && PermissionAreas != "Journey" && PermissionAreas != "WebPush" && PermissionAreas != "ManageContact" && PermissionAreas != "Analytics" && PermissionAreas != "MobileInApp" && PermissionAreas != "MobilePushNotification" && PermissionAreas != "MobileAnalytics" && PermissionAreas != "FacebookPage" && PermissionAreas != "WhatsApp") {

                $(".FullControlPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);").attr('disabled', true);
                $(".FullControlPermission").removeAttr("data-target");
                $(".FullControlPermission:not(button[type='button'])").removeAttr('disabled');

                $('.FullControlPermission').unbind().click(function (event) {
                    AccessDeniedPermission();

                    if (event.preventDefault)
                        event.preventDefault();
                    else
                        event.returnValue = false;
                });



                if ($("#permissionsList_LeadManagementContribute").val() == "False") {
                    IsCallViewPermission = true; IsNoteViewPermission = true;
                    $(".ContributePermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);")
                    //$(".ContributePermission:not(input[type='button'])").attr('disabled', true);
                    $(".ContributePermission.ion-ios-download-outline").prop("disabled", true);

                    $('.ContributePermission').unbind().click(function (event) {
                        AccessDeniedPermission();

                        if (event.preventDefault)
                            event.preventDefault();
                        else
                            event.returnValue = false;
                    });
                }

            }
            else {
                if ($("#permissionsList_LeadManagementContribute").val() == "False")//for UCP
                { IsCallViewPermission = true; IsNoteViewPermission = true; }
            }
        }
    }
    else {
        IsCallViewPermission = true; IsNoteViewPermission = true;
        $("#ui_lnkLmsDashboard,#ui_lnkLmsGroups,#ui_lnkLmsContacts,#ui_lnkLmsManageGroups,#ui_lnkLmsTemplate").hide();
    }
}

function SubAccessPermission(RemoveAddSource) {
    if ($("#" + RemoveAddSource).val() != "True") {
        if (RemoveAddSource == "ImportLead") { $("#dvLmsContactImport").addClass("hideDiv"); }
        $("." + RemoveAddSource).attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);")
        $("." + RemoveAddSource + ".ion-ios-download-outline").prop("disabled", true);

        $('.' + RemoveAddSource).unbind().click(function (event) {
            AccessDeniedPermission();

            if (event.preventDefault)
                event.preventDefault();
            else
                event.returnValue = false;
        });
    }
}

function CheckAccessPermissionForUser() {
    if ($("#permissionsList_UserRole").val() == "True") {

        if ($("#permissionsList_UserRoleHasFullControl").val() == "False") {

            if (PermissionAreas != "CaptureForm" && PermissionAreas != "Chat" && PermissionAreas != "Sms" && PermissionAreas != "Mail" && PermissionAreas != "Prospect" && PermissionAreas != "Journey" && PermissionAreas != "WebPush" && PermissionAreas != "ManageContact" && PermissionAreas != "Analytics" && PermissionAreas != "MobileInApp" && PermissionAreas != "MobilePushNotification" && PermissionAreas != "MobileAnalytics" && PermissionAreas != "FacebookPage" && PermissionAreas != "WhatsApp") {

                $(".FullControlPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                $(".FullControlPermission").removeAttr("data-target");

                $('.FullControlPermission').unbind().click(function (event) {
                    AccessDeniedPermission();

                    if (event.preventDefault)
                        event.preventDefault();
                    else
                        event.returnValue = false;
                });

                if ($("#permissionsList_UserRoleContribute").val() == "False") {

                    $(".ContributePermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    $(".ContributePermission.ion-ios-download-outline").prop("disabled", true);

                    $('.ContributePermission').unbind().click(function (event) {
                        AccessDeniedPermission();

                        if (event.preventDefault)
                            event.preventDefault();
                        else
                            event.returnValue = false;
                    });

                    if ($("#permissionsList_UserRoleView").val() == "False") {
                        $(".ViewPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    }
                }
            }
        }
    }
}

function CheckAccessPermissionForWorkFlow() {
    if ($("#permissionsList_WorkFlow").val() == "True") {

        if ($("#permissionsList_WorkFlowHasFullControl").val() == "False") {

            if (PermissionAreas != "CaptureForm" && PermissionAreas != "Chat" && PermissionAreas != "Sms" && PermissionAreas != "Mail" && PermissionAreas != "Prospect" && PermissionAreas != "ManageUsers" && PermissionAreas != "WebPush" && PermissionAreas != "ManageContact" && PermissionAreas != "Analytics" && PermissionAreas != "MobileInApp" && PermissionAreas != "MobilePushNotification" && PermissionAreas != "MobileAnalytics" && PermissionAreas != "FacebookPage" && PermissionAreas != "WhatsApp") {

                $(".FullControlPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);").attr('disabled', true);
                $(".FullControlPermission").removeAttr("data-target");

                if ($("#permissionsList_WorkFlowContribute").val() == "False") {

                    $(".ContributePermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    $(".ContributePermission:not(input[type='button'])").attr('disabled', true);
                    $(".ContributePermission.ion-ios-download-outline").prop("disabled", true);

                    $('.ContributePermission').unbind().click(function (event) {
                        AccessDeniedPermission();

                        if (event.preventDefault)
                            event.preventDefault();
                        else
                            event.returnValue = false;
                    });

                    if ($("#permissionsList_WorkFlowView").val() == "True" && $("#permissionsList_WorkFlowDesign").val() == "False") {
                        $(".DesignPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                        $("#ui_lnkWorkFlowCreate").hide();

                        if (($('#ui_a_CreateWorkflowBtn').length > 0) && $('#ui_a_CreateWorkflowBtn').attr("onclick").indexOf("AccessDeniedPermission()") > -1)
                            $("#ui_a_CreateWorkflowBtn").removeAttr("data-target");


                    }
                    else if ($("#permissionsList_WorkFlowView").val() == "False") {
                        $(".ViewPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                        $("#ui_lnkWorkFlowDashboard,#ui_lnkWorkFlowCreate,#ui_lnkWorkFlowHistory,#ui_lnkWorkFlowRule").hide();
                    }
                }
            }
        }
    }
    else {
        $("#ui_lnkWorkFlowDashboard,#ui_lnkWorkFlowCreate,#ui_lnkWorkFlowHistory,#ui_lnkWorkFlowRule").hide();
    }
}

function CheckAccessPermissionForWebPush() {
    if ($("#permissionsList_WebPushNotification").val() == "True") {

        if ($("#permissionsList_WebPushNotificationHasFullControl").val() == "False") {

            if (PermissionAreas != "CaptureForm" && PermissionAreas != "Chat" && PermissionAreas != "Sms" && PermissionAreas != "Mail" && PermissionAreas != "Prospect" && PermissionAreas != "ManageUsers" && PermissionAreas != "Journey" && PermissionAreas != "ManageContact" && PermissionAreas != "Analytics" && PermissionAreas != "MobileInApp" && PermissionAreas != "MobilePushNotification" && PermissionAreas != "MobileAnalytics" && PermissionAreas != "FacebookPage" && PermissionAreas != "WhatsApp") {

                $(".FullControlPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);").attr('disabled', true);
                $(".FullControlPermission").removeAttr("data-target");

                if ($("#permissionsList_WebPushNotificationContribute").val() == "False") {

                    $(".ContributePermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    $(".ContributePermission:not(input[type='button'])").attr('disabled', true);
                    $(".ContributePermission.ion-ios-download-outline").prop("disabled", true);

                    $('.ContributePermission').unbind().click(function (event) {
                        AccessDeniedPermission();

                        if (event.preventDefault)
                            event.preventDefault();
                        else
                            event.returnValue = false;
                    });

                    if ($("#permissionsList_WebPushNotificationView").val() == "True") {
                        $(".DesignPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    }
                    else if ($("#permissionsList_WebPushNotificationView").val() == "False") {
                        $(".ViewPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                        $("#ui_lnkWebPushSubTabs").hide();
                    }
                }
            }
        }
    }
    else {
        $("#ui_lnkWebPushSubTabs").hide();
    }
}

function CheckAccessPermissionForContacts() {
    if ($("#permissionsList_Contacts").val() == "True") {

        if ($("#permissionsList_ContactsHasFullControl").val() == "False") {

            if (PermissionAreas != "CaptureForm" && PermissionAreas != "Chat" && PermissionAreas != "Sms" && PermissionAreas != "Mail" && PermissionAreas != "Prospect" && PermissionAreas != "ManageUsers" && PermissionAreas != "Journey" && PermissionAreas != "WebPush" && PermissionAreas != "Analytics" && PermissionAreas != "MobileInApp" && PermissionAreas != "MobilePushNotification" && PermissionAreas != "MobileAnalytics" && PermissionAreas != "FacebookPage" && PermissionAreas != "WhatsApp") {

                $(".FullControlPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);").attr('disabled', true);
                $(".FullControlPermission").removeAttr("data-target");

                $('.FullControlPermission').unbind().click(function (event) {
                    AccessDeniedPermission();

                    if (event.preventDefault)
                        event.preventDefault();
                    else
                        event.returnValue = false;
                });

                if ($("#permissionsList_ContactsContribute").val() == "False") {

                    $(".ContributePermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    $(".ContributePermission.ion-ios-download-outline").prop("disabled", true);
                    $(".tddropmenuWrap .dropdown-menu a.dropdown-item").prop("disabled", true);

                    $('.ContributePermission').unbind().click(function (event) {
                        AccessDeniedPermission();

                        if (event.preventDefault)
                            event.preventDefault();
                        else
                            event.returnValue = false;
                    });

                    if ($("#permissionsList_ContactsView").val() == "True") {
                        $(".DesignPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    }
                    else if ($("#permissionsList_ContactsView").val() == "False") {
                        $(".ViewPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                        $("#dvManageContacts,#dvManageGroup,#dvContactImport").hide();
                    }
                }
            }
        }
    }
    else {
        $("#dvManageContacts,#dvManageGroup,#dvContactImport").hide();
    }
}

function CheckAccessPermissionForAnalytics() {
    if ($("#permissionsList_Analytics").val() == "True") {

        if ($("#permissionsList_AnalyticsHasFullControl").val() == "False") {

            if (PermissionAreas != "CaptureForm" && PermissionAreas != "Chat" && PermissionAreas != "Sms" && PermissionAreas != "Mail" && PermissionAreas != "Prospect" && PermissionAreas != "ManageUsers" && PermissionAreas != "Journey" && PermissionAreas != "WebPush" && PermissionAreas != "ManageContact" && PermissionAreas != "MobileInApp" && PermissionAreas != "MobilePushNotification" && PermissionAreas != "MobileAnalytics" && PermissionAreas != "FacebookPage" && PermissionAreas != "WhatsApp") {

                $(".FullControlPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                $(".FullControlPermission").removeAttr("data-target");

                if ($("#permissionsList_AnalyticsContribute").val() == "False") {

                    $(".ContributePermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    $(".ContributePermission.ion-ios-download-outline").prop("disabled", true);

                    $('.ContributePermission').unbind().click(function (event) {
                        AccessDeniedPermission();

                        if (event.preventDefault)
                            event.preventDefault();
                        else
                            event.returnValue = false;
                    });

                    if ($("#permissionsList_AnalyticsView").val() == "True") {
                        $(".DesignPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    }
                    else if ($("#permissionsList_AnalyticsView").val() == "False") {
                        $(".ViewPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                        $("#ui_lnkAnalyticsSubTabs").hide();
                    }
                }
            }
        }
    }
}

function CheckAccessPermissionForMobilePushNotification() {
    if ($("#permissionsList_MobilePushNotification").val() == "True") {

        if ($("#permissionsList_MobilePushNotificationHasFullControl").val() == "False") {

            if (PermissionAreas != "CaptureForm" && PermissionAreas != "Chat" && PermissionAreas != "Sms" && PermissionAreas != "Mail" && PermissionAreas != "Prospect" && PermissionAreas != "ManageUsers" && PermissionAreas != "Journey" && PermissionAreas != "WebPush" && PermissionAreas != "Analytics" && PermissionAreas != "MobileInApp" && PermissionAreas != "MobileAnalytics" && PermissionAreas != "FacebookPage" && PermissionAreas != "WhatsApp") {

                $(".FullControlPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);").attr('disabled', true);
                $(".FullControlPermission").removeAttr("data-target");

                $('.FullControlPermission').unbind().click(function (event) {
                    AccessDeniedPermission();

                    if (event.preventDefault)
                        event.preventDefault();
                    else
                        event.returnValue = false;
                });

                if ($("#permissionsList_MobilePushNotificationContribute").val() == "False") {

                    $(".ContributePermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    $(".ContributePermission.ion-ios-download-outline").prop("disabled", true);
                    $(".tddropmenuWrap .dropdown-menu a.dropdown-item").prop("disabled", true);

                    $('.ContributePermission').unbind().click(function (event) {
                        AccessDeniedPermission();

                        if (event.preventDefault)
                            event.preventDefault();
                        else
                            event.returnValue = false;
                    });

                    if ($("#permissionsList_MobilePushNotificationView").val() == "True") {
                        $(".DesignPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    }
                    else if ($("#permissionsList_MobilePushNotificationView").val() == "False") {
                        $(".ViewPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                        $("#ui_lnkMobilePushDashboard,#ui_lnkMobilePushManageCampaigns,#ui_lnkMobilePushTemplates,#ui_lnkMobilePushSubscribers,#ui_lnkMobilePushReports").hide();
                    }
                }
            }
        }
    }
    else {
        $("#ui_lnkMobilePushDashboard,#ui_lnkMobilePushManageCampaigns,#ui_lnkMobilePushTemplates,#ui_lnkMobilePushSubscribers,#ui_lnkMobilePushReports").hide();
    }
}

function CheckAccessPermissionForMobileInApp() {
    if ($("#permissionsList_MobileEngagement").val() == "True") {

        if ($("#permissionsList_MobileEngagementHasFullControl").val() == "False") {

            if (PermissionAreas != "CaptureForm" && PermissionAreas != "Chat" && PermissionAreas != "Sms" && PermissionAreas != "Mail" && PermissionAreas != "Prospect" && PermissionAreas != "ManageUsers" && PermissionAreas != "Journey" && PermissionAreas != "WebPush" && PermissionAreas != "Analytics" && PermissionAreas != "MobilePushNotification" && PermissionAreas != "MobileAnalytics" && PermissionAreas != "FacebookPage" && PermissionAreas != "WhatsApp") {

                $(".FullControlPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);").attr('disabled', true);
                $(".FullControlPermission").removeAttr("data-target");

                $('.FullControlPermission').unbind().click(function (event) {
                    AccessDeniedPermission();

                    if (event.preventDefault)
                        event.preventDefault();
                    else
                        event.returnValue = false;
                });

                if ($("#permissionsList_MobileEngagementContribute").val() == "False") {

                    $(".ContributePermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    $(".ContributePermission.ion-ios-download-outline").prop("disabled", true);
                    $(".tddropmenuWrap .dropdown-menu a.dropdown-item").prop("disabled", true);

                    $('.ContributePermission').unbind().click(function (event) {
                        AccessDeniedPermission();

                        if (event.preventDefault)
                            event.preventDefault();
                        else
                            event.returnValue = false;
                    });

                    if ($("#permissionsList_MobileEngagementView").val() == "True") {
                        $(".DesignPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    }
                    else if ($("#permissionsList_MobileEngagementView").val() == "False") {
                        $(".ViewPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                        $("#ui_lnkMobileInAppDashboard,#ui_lnkMobileInAppManageCampaigns,#ui_lnkMobileInAppReports").hide();
                    }
                }
            }
        }
    }
    else {
        $("#ui_lnkMobileInAppDashboard,#ui_lnkMobileInAppManageCampaigns,#ui_lnkMobileInAppReports").hide();
    }
}

function CheckAccessPermissionForMobileAnalytics() {
    if ($("#permissionsList_Mobile").val() == "True") {

        if ($("#permissionsList_MobileHasFullControl").val() == "False") {

            if (PermissionAreas != "CaptureForm" && PermissionAreas != "Chat" && PermissionAreas != "Sms" && PermissionAreas != "Mail" && PermissionAreas != "Prospect" && PermissionAreas != "ManageUsers" && PermissionAreas != "Journey" && PermissionAreas != "WebPush" && PermissionAreas != "Analytics" && PermissionAreas != "MobilePushNotification" && PermissionAreas != "FacebookPage" && PermissionAreas != "WhatsApp") {

                $(".FullControlPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);").attr('disabled', true);
                $(".FullControlPermission").removeAttr("data-target");

                $('.FullControlPermission').unbind().click(function (event) {
                    AccessDeniedPermission();

                    if (event.preventDefault)
                        event.preventDefault();
                    else
                        event.returnValue = false;
                });

                if ($("#permissionsList_MobileContribute").val() == "False") {

                    $(".ContributePermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    $(".ContributePermission.ion-ios-download-outline").prop("disabled", true);
                    $(".tddropmenuWrap .dropdown-menu a.dropdown-item").prop("disabled", true);

                    $('.ContributePermission').unbind().click(function (event) {
                        AccessDeniedPermission();

                        if (event.preventDefault)
                            event.preventDefault();
                        else
                            event.returnValue = false;
                    });

                    if ($("#permissionsList_MobileView").val() == "True") {
                        $(".DesignPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    }
                    else if ($("#permissionsList_MobileView").val() == "False") {
                        $(".ViewPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                        $("#ui_lnkMobileAnalyticsSessions,#ui_lnkMobileAnalyticsVisitors,#ui_lnkMobileAnalyticsGeography,#ui_lnkMobileAnalyticsBehaviour,#ui_lnkMobileAnalyticsTechnology,#ui_lnkMobileAnalyticsPopularPages,#ui_lnkMobileAnalyticsEventTracking").hide();
                    }
                }
            }
        }
    }
    else {
        $("#ui_lnkMobileAnalyticsSessions,#ui_lnkMobileAnalyticsVisitors,#ui_lnkMobileAnalyticsGeography,#ui_lnkMobileAnalyticsBehaviour,#ui_lnkMobileAnalyticsTechnology,#ui_lnkMobileAnalyticsPopularPages,#ui_lnkMobileAnalyticsEventTracking").hide();
    }
}

function CheckAccessPermissionForFacebookPage() {
    if ($("#permissionsList_Social").val() == "True") {

        if ($("#permissionsList_SocialHasFullControl").val() == "False") {

            $("#ui_lnkFacebookPageSettings").hide();

            if (PermissionAreas != "CaptureForm" && PermissionAreas != "Chat" && PermissionAreas != "Sms" && PermissionAreas != "Mail" && PermissionAreas != "Prospect" && PermissionAreas != "ManageUsers" && PermissionAreas != "Journey" && PermissionAreas != "WebPush" && PermissionAreas != "Analytics" && PermissionAreas != "MobilePushNotification" && PermissionAreas != "MobileAnalytics" && PermissionAreas != "WhatsApp") {

                $(".FullControlPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);").attr('disabled', true);
                $(".FullControlPermission").removeAttr("data-target");

                $('.FullControlPermission').unbind().click(function (event) {
                    AccessDeniedPermission();

                    if (event.preventDefault)
                        event.preventDefault();
                    else
                        event.returnValue = false;
                });

                if ($("#permissionsList_SocialContribute").val() == "False") {

                    $(".ContributePermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    $(".ContributePermission.ion-ios-download-outline").prop("disabled", true);
                    $(".tddropmenuWrap .dropdown-menu a.dropdown-item").prop("disabled", true);

                    $('.ContributePermission').unbind().click(function (event) {
                        AccessDeniedPermission();

                        if (event.preventDefault)
                            event.preventDefault();
                        else
                            event.returnValue = false;
                    });

                    if ($("#permissionsList_SocialView").val() == "True") {
                        $(".DesignPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    }
                    else if ($("#permissionsList_SocialView").val() == "False") {
                        $(".ViewPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                        $("#ui_lnkFacebookPageDashboard,#ui_lnkFacebookPageScheduledPosts,#ui_lnkFacebookPageManageContacts,#ui_lnkFacebookPageSettings").hide();
                    }
                }
            }
        }
    }
    else {
        $("#ui_lnkFacebookPageDashboard,#ui_lnkFacebookPageScheduledPosts,#ui_lnkFacebookPageManageContacts,#ui_lnkFacebookPageSettings").hide();
    }
}

function CheckAccessPermissionForWhatsApp() {
    if ($("#permissionsList_Whatsapp").val() == "True") {

        if ($("#permissionsList_WhatsappHasFullControl").val() == "False") {

            $("#ui_lnkWhatsAppSettings").hide();

            if (PermissionAreas != "CaptureForm" && PermissionAreas != "Chat" && PermissionAreas != "Mail" && PermissionAreas != "Prospect" && PermissionAreas != "ManageUsers" && PermissionAreas != "Journey" && PermissionAreas != "WebPush" && PermissionAreas != "ManageContact" && PermissionAreas != "Analytics" && PermissionAreas != "MobileInApp" && PermissionAreas != "MobilePushNotification" && PermissionAreas != "MobileAnalytics" && PermissionAreas != "FacebookPage" && PermissionAreas != "Sms") {
                $(".FullControlPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);").attr('disabled', true);
                $(".FullControlPermission").removeAttr("data-target");

                if ($("#permissionsList_WhatsappContribute").val() == "False") {
                    IsWhatsAppViewPermission = true;
                    $(".ContributePermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);");
                    $(".ContributePermission:not(input[type='button'])").attr('disabled', true);
                    $(".ContributePermission.ion-ios-download-outline").prop("disabled", true);

                    $('.ContributePermission').unbind().click(function (event) {
                        AccessDeniedPermission();

                        if (event.preventDefault)
                            event.preventDefault();
                        else
                            event.returnValue = false;
                    });

                    if ($("#permissionsList_WhatsappView").val() == "True" && $("#permissionsList_WhatsappDesign").val() == "False") {
                        $(".DesignPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);").attr('disabled', true);
                    }
                    else if ($("#permissionsList_WhatsappView").val() == "False" && $("#permissionsList_WhatsappDesign").val() == "True") {
                        $(".ViewPermission").attr("onclick", "AccessDeniedPermission();").attr("href", "javascript:void(0);").attr('disabled', true);
                    }
                }
            }
            else {
                if ($("#permissionsList_WhatsappContribute").val() == "False")
                    IsWhatsAppViewPermission = true;
            }
        }
    }
    else {
        IsWhatsAppViewPermission = true;
        $("#ui_lnkWhatsAppDashboard,#ui_lnkWhatsAppCampaign,#ui_lnkWhatsAppTemplate,#ui_lnkWhatsAppCampaignResponses,#ui_lnkWhatsAppAlertResponses,#ui_lnkWhatsAppSettings").hide();
    }
}

function AccessDeniedPermission() {
    $("#dv_permissiondenied").modal();
    setTimeout(function () { $("#dv_permissiondenied").modal('hide'); }, 10000);

    if (event.preventDefault)
        event.preventDefault();
    else
        event.returnValue = false;
}




