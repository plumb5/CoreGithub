
var PermissionLevel = {
    Id: 0, Name: "", PermissionDescription: "", IsSuperAdmin: 0,
    //Developer
    Developer: 0,
    //UserRoles
    UserRole: 0, UserRoleHasFullControl: 0, UserRoleView: 0, UserRoleContribute: 0,
    //Analytics
    Analytics: 0, AnalyticsHasFullControl: 0, AnalyticsView: 0, AnalyticsContribute: 0, AnalyticsGuest: 0, AnalyticsDesign: 0,
    //Forms
    Forms: 0, FormsHasFullControl: 0, FormsView: 0, FormsContribute: 0, FormsDesign: 0, FormsGuest: 0,
    //EmailMarketing
    EmailMarketing: 0, EmailMarketingHasFullControl: 0, EmailMarketingView: 0, EmailMarketingContribute: 0, EmailMarketingDesign: 0, EmailMarketingGuest: 0,
    //LeadManagement
    LeadManagement: 0, LeadManagementHasFullControl: 0, LeadManagementView: 0, LeadManagementContribute: 0, LeadManagementGuest: 0,
    
    //Social
    Social: 0, SocialHasFullControl: 0, SocialView: 0, SocialContribute: 0, SocialDesign: 0, SocialGuest: 0,
    //DataManagement
    DataManagement: 0, DataManagementHasFullControl: 0, DataManagementView: 0, DataManagementContribute: 0, DataManagementDesign: 0, DataManagementGuest: 0,
    //Mobile
    Mobile: 0, MobileHasFullControl: 0, MobileView: 0, MobileContribute: 0, MobileDesign: 0, MobileGuest: 0,
    
    //SMS
    SMS: 0, SMSHasFullControl: 0, SMSView: 0, SMSContribute: 0, SMSDesign: 0, SMSGuest: 0,
    //SiteChat
    SiteChat: 0, SiteChatHasFullControl: 0, SiteChatView: 0, SiteChatContribute: 0, SiteChatDesign: 0, SiteChatGuest: 0,
   
    //WorkFlow
    WorkFlow: 0, WorkFlowHasFullControl: 0, WorkFlowView: 0, WorkFlowContribute: 0, WorkFlowDesign: 0, WorkFlowGuest: 0,
    //WebPushNotification
    WebPushNotification: 0, WebPushNotificationHasFullControl: 0, WebPushNotificationView: 0, WebPushNotificationContribute: 0, WebPushNotificationDesign: 0, WebPushNotificationGuest: 0,
    //MobileEngagement
    MobileEngagement: 0, MobileEngagementHasFullControl: 0, MobileEngagementView: 0, MobileEngagementContribute: 0, MobileEngagementDesign: 0, MobileEngagementGuest: 0
};


$(document).ready(function () {
    $("#dvLoading").css("display", "none");
    EnableClickForAllCheckbox();
    PermissionLevel.Id = urlParam("Id");
    if (PermissionLevel.Id > 0) {
        BindPermissionsLevels();
    }
});

function EnableClickForAllCheckbox() {
    $(".checkbox").on("click", function () {
        var div = $(this).closest("div");
        var firstCheckbox = div.find(' :checkbox:enabled').first();
        if ($(this)[0].nextSibling.nodeValue.trim() == "Adminisitrator" || $(this)[0].nextSibling.nodeValue.trim() == "Select All") {
            if ($(this)[0].nextSibling.nodeValue.trim() == "Adminisitrator") {
                div = div.parent().parent();
            }
            if ($(this).is(':checked')) {
                div.find(' :checkbox:enabled').prop('checked', true);
            }
            else {
                div.find(' :checkbox:enabled').prop('checked', false);
                $("#chk_SelectAll").prop('checked', false);
            }
        }
        else {
            if (!$(this).is(':checked')) {
                firstCheckbox.prop('checked', false);
                $("#chk_SelectAll").prop('checked', false);
            }
            else {
                if (div.find(' input:checkbox:checked').length == div.find(' input[type="checkbox"]').length - 1) {
                    firstCheckbox.prop('checked', true);
                }
            }
        }
    });
}

$("#btnAdd").click(function () {
    $("#dvLoading").show();

    if ($("#name").val().length == 0) {
        ShowErrorMessage("Please enter the name.");
        $("#name").focus();
        $("#dvLoading").hide();
        return;
    }

    if ($("#message").val().length == 0) {
        ShowErrorMessage("Please enter the description.");
        $("#message").focus();
        $("#dvLoading").hide();
        return;
    }

    PermissionLevel.Name = CleanText($("#name").val());
    PermissionLevel.PermissionDescription = CleanText($("#message").val());

    if ($("#chk_SelectAll").is(':checked')) {
        PermissionLevel.IsSuperAdmin = 1;

        //Developer
        PermissionLevel.Developer = 1;
        //User Role
        PermissionLevel.UserRole = 1;
        PermissionLevel.UserRoleHasFullControl = 1;
        PermissionLevel.UserRoleView = 1;
        PermissionLevel.UserRoleContribute = 1;

        //Analytics 
        PermissionLevel.Analytics = 1;
        PermissionLevel.AnalyticsHasFullControl = 1;
        PermissionLevel.AnalyticsView = 1;
        PermissionLevel.AnalyticsContribute = 1;
        PermissionLevel.AnalyticsGuest = 1;
        PermissionLevel.AnalyticsDesign = 1;

        //Forms
        PermissionLevel.Forms = 1;
        PermissionLevel.FormsHasFullControl = 1;
        PermissionLevel.FormsView = 1;
        PermissionLevel.FormsContribute = 1;
        PermissionLevel.FormsDesign = 1;
        PermissionLevel.FormsGuest = 1;

        //Email Marketing 

        PermissionLevel.EmailMarketing = 1;
        PermissionLevel.EmailMarketingHasFullControl = 1;
        PermissionLevel.EmailMarketingView = 1;
        PermissionLevel.EmailMarketingContribute = 1;
        PermissionLevel.EmailMarketingDesign = 1;
        PermissionLevel.EmailMarketingGuest = 1;

        //Lead Engagement Saving

        PermissionLevel.LeadManagement = 1;
        PermissionLevel.LeadManagementHasFullControl = 1;
        PermissionLevel.LeadManagementView = 1;
        PermissionLevel.LeadManagementContribute = 1;
        PermissionLevel.LeadManagementGuest = 1;

        

        //Social Saving
        PermissionLevel.Social = 1;
        PermissionLevel.SocialHasFullControl = 1;
        PermissionLevel.SocialView = 1;
        PermissionLevel.SocialContribute = 1;
        PermissionLevel.SocialDesign = 1;
        PermissionLevel.SocialGuest = 1;

        //Data Management Saving

        PermissionLevel.DataManagement = 1;
        PermissionLevel.DataManagementHasFullControl = 1;
        PermissionLevel.DataManagementView = 1;
        PermissionLevel.DataManagementContribute = 1;
        PermissionLevel.DataManagementDesign = 1;
        PermissionLevel.DataManagementGuest = 1;

        //Mobile

        PermissionLevel.Mobile = 1;
        PermissionLevel.MobileHasFullControl = 1;
        PermissionLevel.MobileView = 1;
        PermissionLevel.MobileContribute = 1;
        PermissionLevel.MobileDesign = 1;
        PermissionLevel.MobileGuest = 1;

        

        //Sms

        PermissionLevel.SMS = 1;
        PermissionLevel.SMSHasFullControl = 1;
        PermissionLevel.SMSView = 1;
        PermissionLevel.SMSContribute = 1;
        PermissionLevel.SMSDesign = 1;
        PermissionLevel.SMSGuest = 1;

        //SiteChat
        PermissionLevel.SiteChat = 1;
        PermissionLevel.SiteChatHasFullControl = 1;
        PermissionLevel.SiteChatView = 1;
        PermissionLevel.SiteChatContribute = 1;
        PermissionLevel.SiteChatDesign = 1;
        PermissionLevel.SiteChatGuest = 1;

        //WorkFlow

        PermissionLevel.WorkFlow = 1;
        PermissionLevel.WorkFlowHasFullControl = 1;
        PermissionLevel.WorkFlowView = 1;
        PermissionLevel.WorkFlowContribute = 1;
        PermissionLevel.WorkFlowDesign = 1;
        PermissionLevel.WorkFlowGuest = 1;

        //WebPushNotification

        PermissionLevel.WebPushNotification = 1;
        PermissionLevel.WebPushNotificationHasFullControl = 1;
        PermissionLevel.WebPushNotificationView = 1;
        PermissionLevel.WebPushNotificationContribute = 1;
        PermissionLevel.WebPushNotificationDesign = 1;
        PermissionLevel.WebPushNotificationGuest = 1;

        //MobileEngagement

        PermissionLevel.MobileEngagement = 1;
        PermissionLevel.MobileEngagementHasFullControl = 1;
        PermissionLevel.MobileEngagementView = 1;
        PermissionLevel.MobileEngagementContribute = 1;
        PermissionLevel.MobileEngagementDesign = 1;
        PermissionLevel.MobileEngagementGuest = 1;
    }
    else {
        //Developer Role Saving
        if ($("#chk_Developer").is(':checked'))
            PermissionLevel.Developer = 1;

        //User Role Saving

        if ($("#chk_UserRoleHasFullControl").is(':checked'))
            PermissionLevel.UserRoleHasFullControl = 1;
        if ($("#chk_UserRoleView").is(':checked'))
            PermissionLevel.UserRoleView = 1;
        if ($("#chk_UserRoleContribute").is(':checked'))
            PermissionLevel.UserRoleContribute = 1;

        if ($("#chk_UserRoleHasFullControl").is(':checked') || $("#chk_UserRoleView").is(':checked') || $("#chk_UserRoleContribute").is(':checked'))
            PermissionLevel.UserRole = 1;

        //Analytics Saving

        if ($("#chk_AnalyticsHasFullControl").is(':checked'))
            PermissionLevel.AnalyticsHasFullControl = 1;
        if ($("#chk_AnalyticsView").is(':checked'))
            PermissionLevel.AnalyticsView = 1;
        if ($("#chk_AnalyticsContribute").is(':checked'))
            PermissionLevel.AnalyticsContribute = 1;
        if ($("#chk_AnalyticsGuest").is(':checked'))
            PermissionLevel.AnalyticsGuest = 1;
        if ($("#chk_AnalyticsDesign").is(':checked'))
            PermissionLevel.AnalyticsDesign = 1;


        if ($("#chk_AnalyticsHasFullControl").is(':checked') || $("#chk_AnalyticsView").is(':checked') || $("#chk_AnalyticsContribute").is(':checked') || $("#chk_AnalyticsGuest").is(':checked') || $("#chk_AnalyticsDesign").is(':checked'))
            PermissionLevel.Analytics = 1;

        //Forms Saving

        if ($("#chk_FormsHasFullControl").is(':checked'))
            PermissionLevel.FormsHasFullControl = 1;
        if ($("#chk_FormsView").is(':checked'))
            PermissionLevel.FormsView = 1;
        if ($("#chk_FormsContribute").is(':checked'))
            PermissionLevel.FormsContribute = 1;
        if ($("#chk_FormsDesign").is(':checked'))
            PermissionLevel.FormsDesign = 1;
        if ($("#chk_FormsGuest").is(':checked'))
            PermissionLevel.FormsGuest = 1;

        if ($("#chk_FormsHasFullControl").is(':checked') || $("#chk_FormsView").is(':checked') || $("#chk_FormsContribute").is(':checked') || $("#chk_FormsDesign").is(':checked') || $("#chk_FormsGuest").is(':checked'))
            PermissionLevel.Forms = 1;

        //Email Marketing Saving

        if ($("#chk_EmailMarketingHasFullControl").is(':checked'))
            PermissionLevel.EmailMarketingHasFullControl = 1;
        if ($("#chk_EmailMarketingView").is(':checked'))
            PermissionLevel.EmailMarketingView = 1;
        if ($("#chk_EmailMarketingContribute").is(':checked'))
            PermissionLevel.EmailMarketingContribute = 1;
        if ($("#chk_EmailMarketingDesign").is(':checked'))
            PermissionLevel.EmailMarketingDesign = 1;
        if ($("#chk_EmailMarketingGuest").is(':checked'))
            PermissionLevel.EmailMarketingGuest = 1;


        if ($("#chk_EmailMarketingHasFullControl").is(':checked') || $("#chk_EmailMarketingView").is(':checked') || $("#chk_EmailMarketingContribute").is(':checked') || $("#chk_EmailMarketingDesign").is(':checked') || $("#chk_EmailMarketingGuest").is(':checked'))
            PermissionLevel.EmailMarketing = 1;

        //Lead Engagement Saving

        if ($("#chk_LeadManagementHasFullControl").is(':checked'))
            PermissionLevel.LeadManagementHasFullControl = 1;
        if ($("#chk_LeadManagementView").is(':checked'))
            PermissionLevel.LeadManagementView = 1;
        if ($("#chk_LeadManagementContribute").is(':checked'))
            PermissionLevel.LeadManagementContribute = 1;
        if ($("#chk_LeadManagementGuest").is(':checked'))
            PermissionLevel.LeadManagementGuest = 1;

        if ($("#chk_LeadManagementHasFullControl").is(':checked') || $("#chk_LeadManagementView").is(':checked') || $("#chk_LeadManagementContribute").is(':checked') || $("#chk_LeadManagementGuest").is(':checked'))
            PermissionLevel.LeadManagement = 1;

        

        //Social Saving

        if ($("#chk_SocialHasFullControl").is(':checked'))
            PermissionLevel.SocialHasFullControl = 1;
        if ($("#chk_SocialView").is(':checked'))
            PermissionLevel.SocialView = 1;
        if ($("#chk_SocialContribute").is(':checked'))
            PermissionLevel.SocialContribute = 1;
        if ($("#chk_SocialDesign").is(':checked'))
            PermissionLevel.SocialDesign = 1;
        if ($("#chk_SocialGuest").is(':checked'))
            PermissionLevel.SocialGuest = 1;

        if ($("#chk_SocialHasFullControl").is(':checked') || $("#chk_SocialView").is(':checked') || $("#chk_SocialContribute").is(':checked') || $("#chk_SocialDesign").is(':checked') || $("#chk_SocialGuest").is(':checked'))
            PermissionLevel.Social = 1;

        //Data Management Saving

        if ($("#chk_DataManagementHasFullControl").is(':checked'))
            PermissionLevel.DataManagementHasFullControl = 1;
        if ($("#chk_DataManagementView").is(':checked'))
            PermissionLevel.DataManagementView = 1;
        if ($("#chk_DataManagementContribute").is(':checked'))
            PermissionLevel.DataManagementContribute = 1;
        if ($("#chk_DataManagementDesign").is(':checked'))
            PermissionLevel.DataManagementDesign = 1;
        if ($("#chk_DataManagementGuest").is(':checked'))
            PermissionLevel.DataManagementGuest = 1;

        if ($("#chk_DataManagementHasFullControl").is(':checked') || $("#chk_DataManagementView").is(':checked') || $("#chk_DataManagementContribute").is(':checked') || $("#chk_DataManagementDesign").is(':checked') || $("#chk_DataManagementGuest").is(':checked'))
            PermissionLevel.DataManagement = 1;

        //Mobile
        if ($("#chk_MobileAnalyticsHasFullControl").is(':checked'))
            PermissionLevel.MobileHasFullControl = 1;
        if ($("#chk_MobileAnalyticsView").is(':checked'))
            PermissionLevel.MobileView = 1;
        if ($("#chk_MobileAnalyticsContribute").is(':checked'))
            PermissionLevel.MobileContribute = 1;
        if ($("#chk_MobileAnalyticsDesign").is(':checked'))
            PermissionLevel.MobileDesign = 1;
        if ($("#chk_MobileAnalyticsGuest").is(':checked'))
            PermissionLevel.MobileGuest = 1;

        if ($("#chk_MobileAnalyticsHasFullControl").is(':checked') || $("#chk_MobileAnalyticsView").is(':checked') || $("#chk_MobileAnalyticsContribute").is(':checked') || $("#chk_MobileAnalyticsDesign").is(':checked') || $("#chk_MobileAnalyticsGuest").is(':checked'))
            PermissionLevel.Mobile = 1;

        //SMS

        if ($("#chk_SMSHasFullControl").is(':checked'))
            PermissionLevel.SMSHasFullControl = 1;
        if ($("#chk_SMSView").is(':checked'))
            PermissionLevel.SMSView = 1;
        if ($("#chk_SMSContribute").is(':checked'))
            PermissionLevel.SMSContribute = 1;
        if ($("#chk_SMSDesign").is(':checked'))
            PermissionLevel.SMSDesign = 1;
        if ($("#chk_SMSGuest").is(':checked'))
            PermissionLevel.SMSGuest = 1;

        if ($("#chk_SMSHasFullControl").is(':checked') || $("#chk_SMSView").is(':checked') || $("#chk_SMSContribute").is(':checked') || $("#chk_SMSDesign").is(':checked') || $("#chk_SMSGuest").is(':checked'))
            PermissionLevel.SMS = 1;

        

        //SiteChat

        if ($("#chk_SiteChatHasFullControl").is(':checked'))
            PermissionLevel.SiteChatHasFullControl = 1;
        if ($("#chk_SiteChatView").is(':checked'))
            PermissionLevel.SiteChatView = 1;
        if ($("#chk_SiteChatContribute").is(':checked'))
            PermissionLevel.SiteChatContribute = 1;
        if ($("#chk_SiteChatDesign").is(':checked'))
            PermissionLevel.SiteChatDesign = 1;
        if ($("#chk_SiteChatGuest").is(':checked'))
            PermissionLevel.SiteChatGuest = 1;

        if ($("#chk_SiteChatHasFullControl").is(':checked') || $("#chk_SiteChatView").is(':checked') || $("#chk_SiteChatContribute").is(':checked') || $("#chk_SiteChatDesign").is(':checked') || $("#chk_SiteChatGuest").is(':checked'))
            PermissionLevel.SiteChat = 1;

        

       
        //WorkFlow

        if ($("#chk_WorkFlowHasFullControl").is(':checked'))
            PermissionLevel.WorkFlowHasFullControl = 1;
        if ($("#chk_WorkFlowView").is(':checked'))
            PermissionLevel.WorkFlowView = 1;
        if ($("#chk_WorkFlowContribute").is(':checked'))
            PermissionLevel.WorkFlowContribute = 1;
        if ($("#chk_WorkFlowDesign").is(':checked'))
            PermissionLevel.WorkFlowDesign = 1;
        if ($("#chk_WorkFlowGuest").is(':checked'))
            PermissionLevel.WorkFlowGuest = 1;

        if ($("#chk_WorkFlowHasFullControl").is(':checked') || $("#chk_WorkFlowView").is(':checked') || $("#chk_WorkFlowContribute").is(':checked') || $("#chk_WorkFlowDesign").is(':checked') || $("#chk_WorkFlowGuest").is(':checked'))
            PermissionLevel.WorkFlow = 1;

        //WebPushNotification

        if ($("#chk_WebPushNotificationHasFullControl").is(':checked'))
            PermissionLevel.WebPushNotificationHasFullControl = 1;
        if ($("#chk_WebPushNotificationView").is(':checked'))
            PermissionLevel.WebPushNotificationView = 1;
        if ($("#chk_WebPushNotificationContribute").is(':checked'))
            PermissionLevel.WebPushNotificationContribute = 1;
        if ($("#chk_WebPushNotificationDesign").is(':checked'))
            PermissionLevel.WebPushNotificationDesign = 1;
        if ($("#chk_WebPushNotificationGuest").is(':checked'))
            PermissionLevel.WebPushNotificationGuest = 1;

        if ($("#chk_WebPushNotificationHasFullControl").is(':checked') || $("#chk_WebPushNotificationView").is(':checked') || $("#chk_WebPushNotificationContribute").is(':checked') || $("#chk_WebPushNotificationDesign").is(':checked') || $("#chk_WebPushNotificationGuest").is(':checked'))
            PermissionLevel.WebPushNotification = 1;

        //MobileEngagement

        if ($("#chk_MobileEngagementHasFullControl").is(':checked'))
            PermissionLevel.MobileEngagementHasFullControl = 1;
        if ($("#chk_MobileEngagementView").is(':checked'))
            PermissionLevel.MobileEngagementView = 1;
        if ($("#chk_MobileEngagementContribute").is(':checked'))
            PermissionLevel.MobileEngagementContribute = 1;
        if ($("#chk_MobileEngagementDesign").is(':checked'))
            PermissionLevel.MobileEngagementDesign = 1;
        if ($("#chk_MobileEngagementGuest").is(':checked'))
            PermissionLevel.MobileEngagementGuest = 1;

        if ($("#chk_MobileEngagementHasFullControl").is(':checked') || $("#chk_MobileEngagementView").is(':checked') || $("#chk_MobileEngagementContribute").is(':checked') || $("#chk_MobileEngagementDesign").is(':checked') || $("#chk_MobileEngagementGuest").is(':checked'))
            PermissionLevel.MobileEngagement = 1;
    }

    if ($("#btnAdd").attr("PermissionLevelId") != undefined) {
        PermissionLevel.Id = $("#btnAdd").attr("PermissionLevelId");
    }

    $.ajax({
        url: "/User/SaveOrUpdateDetails",
        type: 'POST',
        data: JSON.stringify({ 'permissionslevel': PermissionLevel }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var Status = false;

            if ($("#btnAdd").attr("PermissionLevelId") != undefined) {
                if (response.PermissionsLevel.Id > 0) {
                    Status = true;
                    ShowErrorMessage("Updated Succesfully");
                }
                else {
                    ShowErrorMessage("Unable to update as the name already exists.");
                }
            }
            else if (response.PermissionsLevel.Id > 0) {
                Status = true;
                ShowErrorMessage("Saved");
            }
            else if (response.PermissionsLevel.Id <= 0) {
                ShowErrorMessage("This permission name already exists. Please enter a different name.");
            }

            if (Status)
                setTimeout(function () { window.location.href = "/User/PermissionLevels"; }, 3000);

            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
});

function BindPermissionsLevels() {

    $.ajax({
        url: "/User/GetPermission",
        type: 'POST',
        data: JSON.stringify({ 'permissionslevel': PermissionLevel }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.Id > 0) {
                $("#name").val(response.Name);
                $("#message").val(response.PermissionDescription);

                if (response.IsSuperAdmin == true) {
                    $('.checkbox:input:checkbox').prop('checked', true);
                }
                else {
                    //Developer
                    if (response.Developer == true)
                        $("#chk_Developer").prop("checked", true);

                    //UserRole Binding

                    if (response.UserRoleHasFullControl == true)
                        $("#chk_UserRoleHasFullControl").prop("checked", true);
                    if (response.UserRoleView == true)
                        $("#chk_UserRoleView").prop("checked", true);
                    if (response.UserRoleContribute == true)
                        $("#chk_UserRoleContribute").prop("checked", true);

                    //Analytics Binding

                    if (response.AnalyticsHasFullControl == true)
                        $("#chk_AnalyticsHasFullControl").prop("checked", true);
                    if (response.AnalyticsView == true)
                        $("#chk_AnalyticsView").prop("checked", true);
                    if (response.AnalyticsContribute == true)
                        $("#chk_AnalyticsContribute").prop("checked", true);
                    if (response.AnalyticsGuest == true)
                        $("#chk_AnalyticsGuest").prop("checked", true);
                    if (response.AnalyticsDesign == true)
                        $("#chk_AnalyticsDesign").prop("checked", true);

                    //Forms Binding

                    if (response.FormsHasFullControl == true)
                        $("#chk_FormsHasFullControl").prop("checked", true);
                    if (response.FormsView == true)
                        $("#chk_FormsView").prop("checked", true);
                    if (response.FormsContribute == true)
                        $("#chk_FormsContribute").prop("checked", true);
                    if (response.FormsDesign == true)
                        $("#chk_FormsDesign").prop("checked", true);
                    if (response.FormsGuest == true)
                        $("#chk_FormsGuest").prop("checked", true);

                    //EmailMarketing Binding

                    if (response.EmailMarketingHasFullControl == true)
                        $("#chk_EmailMarketingHasFullControl").prop("checked", true);
                    if (response.EmailMarketingView == true)
                        $("#chk_EmailMarketingView").prop("checked", true);
                    if (response.EmailMarketingContribute == true)
                        $("#chk_EmailMarketingContribute").prop("checked", true);
                    if (response.EmailMarketingDesign == true)
                        $("#chk_EmailMarketingDesign").prop("checked", true);
                    if (response.EmailMarketingGuest == true)
                        $("#chk_EmailMarketingGuest").prop("checked", true);

                    //LeadManagement Binding

                    if (response.LeadManagementHasFullControl == true)
                        $("#chk_LeadManagementHasFullControl").prop("checked", true);
                    if (response.LeadManagementView == true)
                        $("#chk_LeadManagementView").prop("checked", true);
                    if (response.LeadManagementContribute == true)
                        $("#chk_LeadManagementContribute").prop("checked", true);
                    if (response.LeadManagementGuest == true)
                        $("#chk_LeadManagementGuest").prop("checked", true);

                    

                    //Social Binding

                    if (response.SocialHasFullControl == true)
                        $("#chk_SocialHasFullControl").prop("checked", true);
                    if (response.SocialView == true)
                        $("#chk_SocialView").prop("checked", true);
                    if (response.SocialContribute == true)
                        $("#chk_SocialContribute").prop("checked", true);
                    if (response.SocialDesign == true)
                        $("#chk_SocialDesign").prop("checked", true);
                    if (response.SocialGuest == true)
                        $("#chk_SocialGuest").prop("checked", true);

                    //DataManagement Binding

                    if (response.DataManagementHasFullControl == true)
                        $("#chk_DataManagementHasFullControl").prop("checked", true);
                    if (response.DataManagementView == true)
                        $("#chk_DataManagementView").prop("checked", true);
                    if (response.DataManagementContribute == true)
                        $("#chk_DataManagementContribute").prop("checked", true);
                    if (response.DataManagementDesign == true)
                        $("#chk_DataManagementDesign").prop("checked", true);
                    if (response.DataManagementGuest == true)
                        $("#chk_DataManagementGuest").prop("checked", true);

                    //Mobile

                    if (response.MobileHasFullControl == true)
                        $("#chk_MobileAnalyticsHasFullControl").prop("checked", true);
                    if (response.MobileView == true)
                        $("#chk_MobileAnalyticsView").prop("checked", true);
                    if (response.MobileContribute == true)
                        $("#chk_MobileAnalyticsContribute").prop("checked", true);
                    if (response.MobileDesign == true)
                        $("#chk_MobileAnalyticsDesign").prop("checked", true);
                    if (response.MobileGuest == true)
                        $("#chk_MobileAnalyticsGuest").prop("checked", true);

                    //Sms

                    if (response.SMSHasFullControl == true)
                        $("#chk_SMSHasFullControl").prop("checked", true);
                    if (response.SMSView == true)
                        $("#chk_SMSView").prop("checked", true);
                    if (response.SMSContribute == true)
                        $("#chk_SMSContribute").prop("checked", true);
                    if (response.SMSDesign == true)
                        $("#chk_SMSDesign").prop("checked", true);
                    if (response.SMSGuest == true)
                        $("#chk_SMSGuest").prop("checked", true);

                    

                    //SiteChat

                    if (response.SiteChatHasFullControl == true)
                        $("#chk_SiteChatHasFullControl").prop("checked", true);
                    if (response.SiteChatView == true)
                        $("#chk_SiteChatView").prop("checked", true);
                    if (response.SiteChatContribute == true)
                        $("#chk_SiteChatContribute").prop("checked", true);
                    if (response.SiteChatDesign == true)
                        $("#chk_SiteChatDesign").prop("checked", true);
                    if (response.SiteChatGuest == true)
                        $("#chk_SiteChatGuest").prop("checked", true);

                    

                    
                    //WorkFlow

                    if (response.WorkFlowHasFullControl == true)
                        $("#chk_WorkFlowHasFullControl").prop("checked", true);
                    if (response.WorkFlowView == true)
                        $("#chk_WorkFlowView").prop("checked", true);
                    if (response.WorkFlowContribute == true)
                        $("#chk_WorkFlowContribute").prop("checked", true);
                    if (response.WorkFlowDesign == true)
                        $("#chk_WorkFlowDesign").prop("checked", true);
                    if (response.WorkFlowGuest == true)
                        $("#chk_WorkFlowGuest").prop("checked", true);

                    //WebPushNotification

                    if (response.WebPushNotificationHasFullControl == true)
                        $("#chk_WebPushNotificationHasFullControl").prop("checked", true);
                    if (response.WebPushNotificationView == true)
                        $("#chk_WebPushNotificationView").prop("checked", true);
                    if (response.WebPushNotificationContribute == true)
                        $("#chk_WebPushNotificationContribute").prop("checked", true);
                    if (response.WebPushNotificationDesign == true)
                        $("#chk_WebPushNotificationDesign").prop("checked", true);
                    if (response.WebPushNotificationGuest == true)
                        $("#chk_WebPushNotificationGuest").prop("checked", true);

                    //MobileEngagement

                    if (response.MobileEngagementHasFullControl == true)
                        $("#chk_MobileEngagementHasFullControl").prop("checked", true);
                    if (response.MobileEngagementView == true)
                        $("#chk_MobileEngagementView").prop("checked", true);
                    if (response.MobileEngagementContribute == true)
                        $("#chk_MobileEngagementContribute").prop("checked", true);
                    if (response.MobileEngagementDesign == true)
                        $("#chk_MobileEngagementDesign").prop("checked", true);
                    if (response.MobileEngagementGuest == true)
                        $("#chk_MobileEngagementGuest").prop("checked", true);
                }
                $("#btnAdd").val("Update").attr("PermissionLevelId", response.Id);
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
}

$("#btnUserGrpBack").click(function () {
    window.history.back();
});


