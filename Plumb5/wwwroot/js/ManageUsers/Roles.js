var UserRoleIdForDelete = 0;

var SubRoles = { AreaName: "ManageContact", ControllerName: "ContactImport", ActionName: "InitiateImport", SubFeatureName: "RetainAssignment", SubFeatureDisplayName: "Retain Assignment" };

var PermissionSubLevelsList = [];
var PermissionSubLevels = { Id: 0, PermissionLevelId: 0, AreaName: "", ControllerName: "", ActionName: "", FeatureName: "", HasPermission: false };

var Roles = {
    Id: 0,
    Name: "",
    PermissionDescription: "",
    IsSuperAdmin: false,
    Developer: false,
    Export: false,
    MaskData: false,

    //ManageUser
    UserRole: false,
    UserRoleHasFullControl: false,
    UserRoleView: false,
    UserRoleContribute: false,

    //End

    //Dashboard
    Dashboard: false,
    DashboardHasFullControl: false,
    DashboardView: false,
    DashboardContribute: false,
    DashboardGuest: false,
    DashboardDesign: false,
    //End

    //Contacts
    Contacts: false,
    ContactsHasFullControl: false,
    ContactsView: false,
    ContactsContribute: false,
    ContactsGuest: false,
    ContactsDesign: false,
    //End

    //Analytics 
    Analytics: false,
    AnalyticsHasFullControl: false,
    AnalyticsView: false,
    AnalyticsContribute: false,
    AnalyticsGuest: false,
    AnalyticsDesign: false,
    //End

    //Forms
    Forms: false,
    FormsHasFullControl: false,
    FormsView: false,
    FormsContribute: false,
    FormsDesign: false,
    FormsGuest: false,
    //End

    //Mobile Analytics
    Mobile: false,
    MobileHasFullControl: false,
    MobileView: false,
    MobileContribute: false,
    MobileDesign: false,
    MobileGuest: false,
    //End

    //Mobile Engagement
    MobileEngagement: false,
    MobileEngagementHasFullControl: false,
    MobileEngagementView: false,
    MobileEngagementContribute: false,
    MobileEngagementDesign: false,
    MobileEngagementGuest: false,
    //End

    //Email
    EmailMarketing: false,
    EmailMarketingHasFullControl: false,
    EmailMarketingView: false,
    EmailMarketingContribute: false,
    EmailMarketingDesign: false,
    EmailMarketingGuest: false,
    //End

    //Sms
    SMS: false,
    SMSHasFullControl: false,
    SMSView: false,
    SMSContribute: false,
    SMSDesign: false,
    SMSGuest: false,
    //End

    //Chat
    SiteChat: false,
    SiteChatHasFullControl: false,
    SiteChatView: false,
    SiteChatContribute: false,
    SiteChatDesign: false,
    SiteChatGuest: false,
    //End

    //Web Push
    WebPushNotification: false,
    WebPushNotificationHasFullControl: false,
    WebPushNotificationView: false,
    WebPushNotificationContribute: false,
    WebPushNotificationDesign: false,
    WebPushNotificationGuest: false,
    //End

    //Lead Management
    LeadManagement: false,
    LeadManagementHasFullControl: false,
    LeadManagementView: false,
    LeadManagementContribute: false,
    LeadManagementDesign: false,
    LeadManagementGuest: false,
    UserGroupId: 0,
    //End

    //Social
    Social: false,
    SocialHasFullControl: false,
    SocialView: false,
    SocialContribute: false,
    SocialDesign: false,
    SocialGuest: false,
    //End

    //WorkFlow
    WorkFlow: false,
    WorkFlowHasFullControl: false,
    WorkFlowView: false,
    WorkFlowContribute: false,
    WorkFlowDesign: false,
    WorkFlowGuest: false,
    //End

    //Segmentation
    Segmentation: false,
    SegmentationHasFullControl: false,
    SegmentationView: false,
    SegmentationContribute: false,
    SegmentationDesign: false,
    SegmentationGuest: false,



    //MobilePushNotification
    MobilePushNotification: false,
    MobilePushNotificationHasFullControl: false,
    MobilePushNotificationView: false,
    MobilePushNotificationContribute: false,
    MobilePushNotificationDesign: false,
    MobilePushNotificationGuest: false,
    //End

    //LeadScoring
    LeadScoring: false,
    LeadScoringHasFullControl: false,
    LeadScoringView: false,
    LeadScoringContribute: false,
    LeadScoringDesign: false,
    LeadScoringGuest: false,

    //Whatsapp
    Whatsapp: false,
    WhatsappHasFullControl: false,
    WhatsappView: false,
    WhatsappContribute: false,
    WhatsappDesign: false,
    WhatsappGuest: false,

    //CustomEvents
    CustomEvents: false,
    CustomEventsHasFullControl: false,
    CustomEventsView: false,
    CustomEventsContribute: false,
    CustomEventsDesign: false,
    CustomEventsGuest: false,
};

$(document).ready(function () {
    userRoles.GetGroupDetails();
});

var userRoles = {
    GetRolesMaxCount: function () {
        let RolesName = CleanText($.trim($("#ui_RolesSerach").val()));
        $.ajax({
            url: "/ManageUsers/Roles/GetMaxCount",
            type: 'Post',
            data: JSON.stringify({ 'RolesName': RolesName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = 0;
                if (response != undefined && response != null) {
                    TotalRowCount = response;
                }

                if (TotalRowCount > 0) {
                    userRoles.GetRolesDetails();
                }
                else {
                    SetNoRecordContent('ui_tbRolesDetails', 3, 'ui_tdbodyRolesData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetRolesDetails: function () {
        let RolesName = CleanText($.trim($("#ui_RolesSerach").val()));
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/ManageUsers/Roles/GetPermissionsList",
            type: 'Post',
            data: JSON.stringify({ 'RolesName': RolesName, 'Offset': OffSet, 'FetchNext': FetchNext }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                SetNoRecordContent('ui_tbRolesDetails', 3, 'ui_tdbodyRolesData');
                if (response != undefined && response != null && response.length > 0) {
                    CurrentRowCount = response.length;
                    PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
                    $("#ui_tdbodyRolesData").html('');
                    $("#ui_tbRolesDetails").removeClass('no-data-records');
                    ShowPagingDiv(true);

                    $.each(response, function () {
                        userRoles.BindRoleDetails(this);
                    });

                } else {
                    ShowPagingDiv(false);
                }
                HidePageLoading();
                CheckAccessPermission("ManageUsers");
            },
            error: ShowAjaxError
        });
    },
    BindRoleDetails: function (RoleDetails) {
        let Date = RoleDetails.CreatedDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(RoleDetails.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(RoleDetails.CreatedDate)) : "NA";

        let htmlContent = `<tr>
                                <td>
                                    <div class="groupnamewrap">
                                        <div class="nameTxtWrap">
                                            ${RoleDetails.Name}
                                        </div>
                                        <div class="tdcreatedraft">
                                            <div class="dropdown">
                                                <button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>
                                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="filterbycontacts">
                                                    <a data-grouptype="groupedit" class="dropdown-item ContributePermission" href="javascript:void(0)" onclick="userRoles.EditRoles(${RoleDetails.Id})">Edit</a>
                                                    <div class="dropdown-divider"></div>
                                                    <a data-toggle="modal" data-target="#deletegroups" data-grouptype="groupDelete" class="dropdown-item FullControlPermission" href="javascript:void(0)" onclick="userRoles.AssignDeleteRole(${RoleDetails.Id})">Delete</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="td-wid-10 text-muted">${RoleDetails.PermissionDescription}</td>
                                <td>
                                     <span class="groupNameTxt">${RoleDetails.CreatedEmailId}</span>
                                     <span class="templatenametxt">${Date}</span>
                                </td>
                        </tr>`;
        $("#ui_tdbodyRolesData").append(htmlContent);
    },
    SearchByRoleName: function () {
        if (CleanText($.trim($("#ui_RolesSerach").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.UserManage.SerachByRoleNameError);
            return false;
        }
        ShowPageLoading();
        userRoles.GetRolesMaxCount();
    },
    AssignDeleteRole: function (RoleId) {
        UserRoleIdForDelete = RoleId;
    },
    Delete: function (RoleId) {
        $.ajax({
            url: "/ManageUsers/Roles/Delete",
            type: 'Post',
            data: JSON.stringify({ 'Id': RoleId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                ShowSuccessMessage(GlobalErrorList.UserManage.DeleteRoleSuccess);
                setTimeout(function () { userRoles.GetRolesMaxCount(); }, 1000);
            },
            error: ShowAjaxError
        });
    },
    ClearFields: function () {
        $("#ui_inpRoleName,#ui_txtRoleDescription,#ui_RolesSerach").val("");
        $("#ui_ddlusergroupList").val("select");

        let checkedElements = $("input[type='checkbox']:checked");
        $.each(checkedElements, function () {
            $(this).prop("checked", false);
        });
    },
    ShowCreateRolePopUp: function (Action) {
        $(".pagetitle").html(`${Action} Roles`);
        $(".settcontainer").addClass("hideDiv");
        $(".mainpaneloverlap").removeClass("hideDiv");
    },
    SaveRoleDetails: function () {
        ShowPageLoading();

        var IsViewOnly = false;
        //For LMS sub permission
        if ($("#leadmanageedit").is(':checked') == false && $("#leadmanagecontman").is(':checked') == false) {
            $("#ui_chkSubRoleRetainAssignment").prop("checked", false);
            $("#ui_chkSubRoleRetainSource").prop("checked", false);
            $("#ui_chkSubAddSource").prop("checked", false);
            $("#ui_chkSubAddLead").prop("checked", false);
            $("#ui_chkSubEditLead").prop("checked", false);
            $("#ui_chkSubGroupManage").prop("checked", false);
            $("#ui_chkSubAddCustomeFields").prop("checked", false);
            $("#ui_chkSubImportLead").prop("checked", false);
            $("#ui_chkSubSendSms").prop("checked", false);
            $("#ui_chkSubSendMail").prop("checked", false);
            $("#ui_chkSubSendWhatsApp").prop("checked", false);
            $("#ui_chkSubMakeaCall").prop("checked", false);
            $("#ui_chkSubDeleteLead").prop("checked", false);
            IsViewOnly = true;
        }

        if (!userRoles.ValidateRoleDetails()) {
            HidePageLoading();
            return false;
        }

        Roles.Name = CleanText($.trim($("#ui_inpRoleName").val()));
        Roles.PermissionDescription = CleanText($.trim($("#ui_txtRoleDescription").val()));
        userRoles.AssignRolesDetails();

        let RoleId = $("#ui_SaveRoleDetails").attr("RoleId");
        Roles.Id = 0;
        if (RoleId != undefined && RoleId != null && RoleId != "") {
            Roles.Id = parseInt(RoleId);
            //PermissionSubLevels.PermissionLevelId = Roles.Id;
        }


        $.ajax({
            url: "/ManageUsers/Roles/SaveOrUpdateDetails",
            type: 'Post',
            data: JSON.stringify({
                'permissionsleveldata': Roles, 'permissionSubLevelsListData': PermissionSubLevelsList, 'PermissionLevelId': Roles.Id, 'IsViewOnly': IsViewOnly
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.PermissionsLevel != null) {
                    if (response.PermissionsLevel.Id > 0) {
                        if (Roles.Id > 0) {
                            ShowSuccessMessage(GlobalErrorList.UserManage.UpdatedRoles);
                        } else {
                            ShowSuccessMessage(GlobalErrorList.UserManage.RoledSavedSuccess);
                        }
                        userRoles.ShowRolesOnceSaved();
                    } else if (response.PermissionsLevel.Id == -1) {
                        ShowErrorMessage(GlobalErrorList.UserManage.RoleAlreadyExists);
                    } else {
                        ShowErrorMessage(GlobalErrorList.UserManage.UnableToSaveRole);
                    }
                } else {
                    ShowErrorMessage(GlobalErrorList.UserManage.UnableToSaveRole);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    ShowRolesOnceSaved: function () {
        setTimeout(function () {
            userRoles.ClearFields();
            $(".mainpaneloverlap").addClass("hideDiv");
            $(".settcontainer").removeClass("hideDiv");
            userRoles.GetRolesMaxCount();
        }, 1000);
    },
    ValidateRoleDetails: function () {
        if (CleanText($.trim($("#ui_inpRoleName").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.UserManage.RoleNameError);
            $("#ui_inpRoleName").focus();
            return false;
        }

        if (CleanText($.trim($("#ui_txtRoleDescription").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.UserManage.RoleDescriptionError);
            $("#ui_txtRoleDescription").focus();
            return false;
        }

        if ($("input[type='checkbox']:checked").length == 0) {
            ShowErrorMessage(GlobalErrorList.UserManage.SelectRoleError);
            return false;
        }

        //if ($("input[type='checkbox']:checked").length > 0) {
        //    if ($("#whatsappmod").is(':checked') && !$("#whatsappview").is(":checked") && !$("#whatsappedit").is(":checked") && !$("#whatsappcontman").is(":checked")) {
        //        ShowErrorMessage(GlobalErrorList.UserManage.SelectPermissionError + " Whats App");
        //        return false;
        //    }
        //}

        return true;
    },
    AssignRolesDetails: function () {
        if ($("#adminmod").is(":checked")) {
            Roles.IsSuperAdmin = true;
        } else {
            Roles.IsSuperAdmin = false;
        }

        if ($("#devmod").is(":checked")) {
            Roles.Developer = true;
        } else {
            Roles.Developer = false;
        }

        if ($("#exportmod").is(":checked")) {
            Roles.Export = true;
        } else {
            Roles.Export = false;
        }

        if ($("#maskdatamod").is(":checked")) {
            Roles.MaskData = true;
        } else {
            Roles.MaskData = false;
        }



        //Start of Saving For ManageUser
        if ($("#Usersview").is(':checked'))
            Roles.UserRoleView = true;
        else
            Roles.UserRoleView = false;
        if ($("#Usersedit").is(':checked'))
            Roles.UserRoleContribute = true;
        else
            Roles.UserRoleContribute = false;

        if ($("#Users").is(":checked"))
            Roles.UserRole = true;
        else
            Roles.UserRole = false;

        if ($("#Usersview").is(":checked") && $("#Usersedit").is(":checked"))
            Roles.UserRoleHasFullControl = true;
        else
            Roles.UserRoleHasFullControl = false;

        //End of Saving For ManageUser


        //Start of Saving For Dashboard
        if ($("#Dashboardview").is(':checked'))
            Roles.DashboardView = true;
        else
            Roles.DashboardView = false;

        if ($("#Dashboardedit").is(':checked'))
            Roles.DashboardContribute = true;
        else
            Roles.DashboardContribute = false;

        if ($("#Dashboardcontman").is(':checked'))
            Roles.DashboardDesign = true;
        else
            Roles.DashboardDesign = false;

        if ($("#Dashboard").is(":checked"))
            Roles.Dashboard = true;
        else
            Roles.Dashboard = false;

        if ($("#Dashboardview").is(":checked") && $("#Dashboardedit").is(":checked"))
            Roles.DashboardHasFullControl = true;
        else
            Roles.DashboardHasFullControl = false;

        //End of Saving For Dashboard



        //Start of Saving For Contact
        if ($("#Contactsview").is(':checked'))
            Roles.ContactsView = true;
        else
            Roles.ContactsView = false;

        if ($("#Contactsedit").is(':checked'))
            Roles.ContactsContribute = true;
        else
            Roles.ContactsContribute = false;

        if ($("#Contactscontman").is(':checked'))
            Roles.ContactsDesign = true;
        else
            Roles.ContactsDesign = false;

        if ($("#Contacts").is(":checked"))
            Roles.Contacts = true;
        else
            Roles.Contacts = false;

        if ($("#Contactsview").is(":checked") && $("#Contactsedit").is(":checked"))
            Roles.ContactsHasFullControl = true;
        else
            Roles.ContactsHasFullControl = false;

        //End of Saving For Contact


        //Start of Saving For Web Analytics
        if ($("#WebAnalview").is(':checked'))
            Roles.AnalyticsView = true;
        else
            Roles.AnalyticsView = false;

        if ($("#WebAnaledit").is(':checked'))
            Roles.AnalyticsContribute = true;
        else
            Roles.AnalyticsContribute = false;

        if ($("#WebAnalcontman").is(':checked'))
            Roles.AnalyticsDesign = true;
        else
            Roles.AnalyticsDesign = false;

        if ($("#WebAnalytics").is(":checked"))
            Roles.Analytics = true;
        else
            Roles.Analytics = false;


        if ($("#WebAnalview").is(":checked") && $("#WebAnaledit").is(":checked"))
            Roles.AnalyticsHasFullControl = true;
        else
            Roles.AnalyticsHasFullControl = false;

        //End of Saving For Web Analytics

        //Start of Saving For Web Engagement
        if ($("#WebEngview").is(':checked'))
            Roles.FormsView = true;
        else
            Roles.FormsView = false;

        if ($("#WebEngedit").is(':checked'))
            Roles.FormsContribute = true;
        else
            Roles.FormsContribute = false;

        if ($("#WebEngcontman").is(':checked'))
            Roles.FormsDesign = true;
        else
            Roles.FormsDesign = false;

        if ($("#WebEngment").is(":checked"))
            Roles.Forms = true;
        else
            Roles.Forms = false;

        if ($("#WebEngview").is(":checked") && $("#WebEngedit").is(":checked") && $("#WebEngcontman").is(":checked"))
            Roles.FormsHasFullControl = true;
        else
            Roles.FormsHasFullControl = false;

        //End of Saving For  Web Engagement

        //Start of Saving For Mobile Analytics 
        if ($("#mobanalview").is(':checked'))
            Roles.MobileView = true;
        else
            Roles.MobileView = false;

        if ($("#mobanaledit").is(':checked'))
            Roles.MobileContribute = true;
        else
            Roles.MobileContribute = false;

        if ($("#mobanalcontman").is(':checked'))
            Roles.MobileDesign = true;
        else
            Roles.MobileDesign = false;

        if ($("#mobanaltics").is(":checked"))
            Roles.Mobile = true;
        else
            Roles.Mobile = false;

        if ($("#mobanalview").is(":checked") && $("#mobanaledit").is(":checked"))
            Roles.MobileHasFullControl = true;
        else
            Roles.MobileHasFullControl = false;

        //End of Saving For Mobile Analytics

        //Start of Saving For Mobile Engagement 
        if ($("#mobengview").is(':checked'))
            Roles.MobileEngagementView = true;
        else
            Roles.MobileEngagementView = false;

        if ($("#mobengedit").is(':checked'))
            Roles.MobileEngagementContribute = true;
        else
            Roles.MobileEngagementContribute = false;

        if ($("#mobengecontman").is(':checked'))
            Roles.MobileEngagementDesign = true;
        else
            Roles.MobileEngagementDesign = false;

        if ($("#mobengment").is(":checked"))
            Roles.MobileEngagement = true;
        else
            Roles.MobileEngagement = false;

        if ($("#mobengview").is(":checked") && $("#mobengedit").is(":checked") && $("#mobengecontman").is(":checked"))
            Roles.MobileEngagementHasFullControl = true;
        else
            Roles.MobileEngagementHasFullControl = false;

        //End of Saving For Mobile Engagement

        //Start of Saving For Email
        if ($("#modemailview").is(':checked'))
            Roles.EmailMarketingView = true;
        else
            Roles.EmailMarketingView = false;

        if ($("#modemailedit").is(':checked'))
            Roles.EmailMarketingContribute = true;
        else
            Roles.EmailMarketingContribute = false;
        if ($("#modemailcontman").is(':checked'))
            Roles.EmailMarketingDesign = true;
        else
            Roles.EmailMarketingDesign = false;

        if ($("#modemail").is(":checked"))
            Roles.EmailMarketing = true;
        else
            Roles.EmailMarketing = false;

        if ($("#modemailview").is(":checked") && $("#modemailedit").is(":checked") && $("#modemailcontman").is(":checked"))
            Roles.EmailMarketingHasFullControl = true;
        else
            Roles.EmailMarketingHasFullControl = false;

        //End of Saving For Email

        //Start of Saving For SMS
        if ($("#modsmsview").is(':checked'))
            Roles.SMSView = true;
        else
            Roles.SMSView = false;
        if ($("#modsmsedit").is(':checked'))
            Roles.SMSContribute = true;
        else
            Roles.SMSContribute = false;

        if ($("#modsmscontman").is(':checked'))
            Roles.SMSDesign = true;
        else
            Roles.SMSDesign = false;

        if ($("#modsms").is(":checked"))
            Roles.SMS = true;
        else
            Roles.SMS = false;

        if ($("#modsmsview").is(":checked") && $("#modsmsedit").is(":checked") && $("#modsmscontman").is(":checked"))
            Roles.SMSHasFullControl = true;
        else
            Roles.SMSHasFullControl = false;

        //End of Saving For SMS

        //Start of Saving For Chat
        if ($("#modchatview").is(':checked'))
            Roles.SiteChatView = true;
        else
            Roles.SiteChatView = false;
        if ($("#modchatedit").is(':checked'))
            Roles.SiteChatContribute = true;
        else
            Roles.SiteChatContribute = false;
        if ($("#modchatcontaman").is(':checked'))
            Roles.SiteChatDesign = true;
        else
            Roles.SiteChatDesign = false;

        if ($("#modchat").is(":checked"))
            Roles.SiteChat = true;
        else
            Roles.SiteChat = false;

        if ($("#modchatview").is(":checked") && $("#modchatedit").is(":checked") && $("#modchatcontaman").is(":checked"))
            Roles.SiteChatHasFullControl = true;
        else
            Roles.SiteChatHasFullControl = false;

        //End of Saving For Chat

        //Start of Saving For WebPush
        if ($("#webpushview").is(':checked'))
            Roles.WebPushNotificationView = true;
        else
            Roles.WebPushNotificationView = false;
        if ($("#webpushedit").is(':checked'))
            Roles.WebPushNotificationContribute = true;
        else
            Roles.WebPushNotificationContribute = false;
        if ($("#webpushcontman").is(':checked'))
            Roles.WebPushNotificationDesign = true;
        else
            Roles.WebPushNotificationDesign = false;

        if ($("#webpushmod").is(":checked"))
            Roles.WebPushNotification = true;
        else
            Roles.WebPushNotification = false;

        if ($("#webpushview").is(":checked") && $("#webpushedit").is(":checked") && $("#webpushcontman").is(":checked"))
            Roles.WebPushNotificationHasFullControl = true;
        else
            Roles.WebPushNotificationHasFullControl = false;

        //End of Saving For WebPush

        //Start of Saving For WhatsApp
        if ($("#whatsappview").is(':checked'))
            Roles.WhatsappView = true;
        else
            Roles.WhatsappView = false;
        if ($("#whatsappedit").is(':checked'))
            Roles.WhatsappContribute = true;
        else
            Roles.WhatsappContribute = false;
        if ($("#whatsappcontman").is(':checked'))
            Roles.WhatsappDesign = true;
        else
            Roles.WhatsappDesign = false;

        if ($("#whatsappmod").is(":checked"))
            Roles.Whatsapp = true;
        else
            Roles.Whatsapp = false;

        if ($("#whatsappview").is(":checked") && $("#whatsappedit").is(":checked") && $("#whatsappcontman").is(":checked"))
            Roles.WhatsappHasFullControl = true;
        else
            Roles.WhatsappHasFullControl = false;

        //End of Saving For WhatsApp


        //Start of Saving For CustomEvents
        if ($("#customeventsview").is(':checked'))
            Roles.CustomEventsView = true;
        else
            Roles.CustomEventsView = false;

        if ($("#customeventsedit").is(':checked'))
            Roles.CustomEventsContribute = true;
        else
            Roles.CustomEventsContribute = false;

        if ($("#customeventsmod").is(':checked'))
            Roles.CustomEvents = true;
        else
            Roles.CustomEvents = false;

        if ($("#customeventscontman").is(":checked"))
            Roles.CustomEventsDesign = true;
        else
            Roles.CustomEventsDesign = false;

        if ($("#customeventsview").is(":checked") && $("#customeventsedit").is(":checked") && $("#customeventscontman").is(":checked"))
            Roles.CustomEventsHasFullControl = true;
        else
            Roles.CustomEventsHasFullControl = false;

        //End of Saving For CustomEvents





        //Start of Saving For Lead Management
        if ($("#leadmanageview").is(':checked'))
            Roles.LeadManagementView = true;
        else
            Roles.LeadManagementView = false;
        if ($("#leadmanageedit").is(':checked'))
            Roles.LeadManagementContribute = true;
        else
            Roles.LeadManagementContribute = false;
        if ($("#leadmanagecontman").is(':checked'))
            Roles.LeadManagementDesign = true;
        else
            Roles.LeadManagementDesign = false;

        if ($("#leadmanagemod").is(":checked"))
            Roles.LeadManagement = true;
        else
            Roles.LeadManagement = false;

        if ($("#leadmanageview").is(":checked") && $("#leadmanageedit").is(":checked"))
            Roles.LeadManagementHasFullControl = true;
        else
            Roles.LeadManagementHasFullControl = false;
        Roles.UserGroupId = $("#ui_ddlusergroupList").val() != null ? parseInt($("#ui_ddlusergroupList").val()) : 0;

        PermissionSubLevelsList = [];
        if ($("#ui_chkSubRoleRetainAssignment").is(":checked")) {
            PermissionSubLevels = { Id: 0, PermissionLevelId: 0, AreaName: "", ControllerName: "", ActionName: "", FeatureName: "", HasPermission: false };
            PermissionSubLevels.HasPermission = true;
            PermissionSubLevels.AreaName = $("#ui_chkSubRoleRetainAssignment").attr("AreaName");
            PermissionSubLevels.ControllerName = $("#ui_chkSubRoleRetainAssignment").attr("ControllerName");
            PermissionSubLevels.ActionName = $("#ui_chkSubRoleRetainAssignment").attr("ActionName");
            PermissionSubLevels.FeatureName = $("#ui_chkSubRoleRetainAssignment").attr("SubFeatureName");
            PermissionSubLevelsList.push(PermissionSubLevels);
        }
        if ($("#ui_chkSubRoleRetainSource").is(":checked")) {
            PermissionSubLevels = { Id: 0, PermissionLevelId: 0, AreaName: "", ControllerName: "", ActionName: "", FeatureName: "", HasPermission: false };
            PermissionSubLevels.HasPermission = true;
            PermissionSubLevels.AreaName = $("#ui_chkSubRoleRetainSource").attr("AreaName");
            PermissionSubLevels.ControllerName = $("#ui_chkSubRoleRetainSource").attr("ControllerName");
            PermissionSubLevels.ActionName = $("#ui_chkSubRoleRetainSource").attr("ActionName");
            PermissionSubLevels.FeatureName = $("#ui_chkSubRoleRetainSource").attr("SubFeatureName");
            PermissionSubLevelsList.push(PermissionSubLevels);
        }
        if ($("#ui_chkSubAddSource").is(":checked")) {
            PermissionSubLevels = { Id: 0, PermissionLevelId: 0, AreaName: "", ControllerName: "", ActionName: "", FeatureName: "", HasPermission: false };
            PermissionSubLevels.HasPermission = true;
            PermissionSubLevels.AreaName = $("#ui_chkSubAddSource").attr("AreaName");
            PermissionSubLevels.ControllerName = $("#ui_chkSubAddSource").attr("ControllerName");
            PermissionSubLevels.ActionName = $("#ui_chkSubAddSource").attr("ActionName");
            PermissionSubLevels.FeatureName = $("#ui_chkSubAddSource").attr("SubFeatureName");
            PermissionSubLevelsList.push(PermissionSubLevels);
        }
        if ($("#ui_chkSubAddLead").is(":checked")) {
            PermissionSubLevels = { Id: 0, PermissionLevelId: 0, AreaName: "", ControllerName: "", ActionName: "", FeatureName: "", HasPermission: false };
            PermissionSubLevels.HasPermission = true;
            PermissionSubLevels.AreaName = $("#ui_chkSubAddLead").attr("AreaName");
            PermissionSubLevels.ControllerName = $("#ui_chkSubAddLead").attr("ControllerName");
            PermissionSubLevels.ActionName = $("#ui_chkSubAddLead").attr("ActionName");
            PermissionSubLevels.FeatureName = $("#ui_chkSubAddLead").attr("SubFeatureName");
            PermissionSubLevelsList.push(PermissionSubLevels);
        }
        if ($("#ui_chkSubImportLead").is(":checked")) {
            PermissionSubLevels = { Id: 0, PermissionLevelId: 0, AreaName: "", ControllerName: "", ActionName: "", FeatureName: "", HasPermission: false };
            PermissionSubLevels.HasPermission = true;
            PermissionSubLevels.AreaName = $("#ui_chkSubImportLead").attr("AreaName");
            PermissionSubLevels.ControllerName = $("#ui_chkSubImportLead").attr("ControllerName");
            PermissionSubLevels.ActionName = $("#ui_chkSubImportLead").attr("ActionName");
            PermissionSubLevels.FeatureName = $("#ui_chkSubImportLead").attr("SubFeatureName");
            PermissionSubLevelsList.push(PermissionSubLevels);
        }
        if ($("#ui_chkSubEditLead").is(":checked")) {
            PermissionSubLevels = { Id: 0, PermissionLevelId: 0, AreaName: "", ControllerName: "", ActionName: "", FeatureName: "", HasPermission: false };
            PermissionSubLevels.HasPermission = true;
            PermissionSubLevels.AreaName = $("#ui_chkSubEditLead").attr("AreaName");
            PermissionSubLevels.ControllerName = $("#ui_chkSubEditLead").attr("ControllerName");
            PermissionSubLevels.ActionName = $("#ui_chkSubEditLead").attr("ActionName");
            PermissionSubLevels.FeatureName = $("#ui_chkSubEditLead").attr("SubFeatureName");
            PermissionSubLevelsList.push(PermissionSubLevels);
        }
        if ($("#ui_chkSubGroupManage").is(":checked")) {
            PermissionSubLevels = { Id: 0, PermissionLevelId: 0, AreaName: "", ControllerName: "", ActionName: "", FeatureName: "", HasPermission: false };
            PermissionSubLevels.HasPermission = true;
            PermissionSubLevels.AreaName = $("#ui_chkSubGroupManage").attr("AreaName");
            PermissionSubLevels.ControllerName = $("#ui_chkSubGroupManage").attr("ControllerName");
            PermissionSubLevels.ActionName = $("#ui_chkSubGroupManage").attr("ActionName");
            PermissionSubLevels.FeatureName = $("#ui_chkSubGroupManage").attr("SubFeatureName");
            PermissionSubLevelsList.push(PermissionSubLevels);
        }
        if ($("#ui_chkSubAddCustomeFields").is(":checked")) {
            PermissionSubLevels = { Id: 0, PermissionLevelId: 0, AreaName: "", ControllerName: "", ActionName: "", FeatureName: "", HasPermission: false };
            PermissionSubLevels.HasPermission = true;
            PermissionSubLevels.AreaName = $("#ui_chkSubAddCustomeFields").attr("AreaName");
            PermissionSubLevels.ControllerName = $("#ui_chkSubAddCustomeFields").attr("ControllerName");
            PermissionSubLevels.ActionName = $("#ui_chkSubAddCustomeFields").attr("ActionName");
            PermissionSubLevels.FeatureName = $("#ui_chkSubAddCustomeFields").attr("SubFeatureName");
            PermissionSubLevelsList.push(PermissionSubLevels);
        }
        if ($("#ui_chkSubSendSms").is(":checked")) {
            PermissionSubLevels = { Id: 0, PermissionLevelId: 0, AreaName: "", ControllerName: "", ActionName: "", FeatureName: "", HasPermission: false };
            PermissionSubLevels.HasPermission = true;
            PermissionSubLevels.AreaName = $("#ui_chkSubSendSms").attr("AreaName");
            PermissionSubLevels.ControllerName = $("#ui_chkSubSendSms").attr("ControllerName");
            PermissionSubLevels.ActionName = $("#ui_chkSubSendSms").attr("ActionName");
            PermissionSubLevels.FeatureName = $("#ui_chkSubSendSms").attr("SubFeatureName");
            PermissionSubLevelsList.push(PermissionSubLevels);
        }
        if ($("#ui_chkSubSendMail").is(":checked")) {
            PermissionSubLevels = { Id: 0, PermissionLevelId: 0, AreaName: "", ControllerName: "", ActionName: "", FeatureName: "", HasPermission: false };
            PermissionSubLevels.HasPermission = true;
            PermissionSubLevels.AreaName = $("#ui_chkSubSendMail").attr("AreaName");
            PermissionSubLevels.ControllerName = $("#ui_chkSubSendMail").attr("ControllerName");
            PermissionSubLevels.ActionName = $("#ui_chkSubSendMail").attr("ActionName");
            PermissionSubLevels.FeatureName = $("#ui_chkSubSendMail").attr("SubFeatureName");
            PermissionSubLevelsList.push(PermissionSubLevels);
        }
        if ($("#ui_chkSubSendWhatsApp").is(":checked")) {
            PermissionSubLevels = { Id: 0, PermissionLevelId: 0, AreaName: "", ControllerName: "", ActionName: "", FeatureName: "", HasPermission: false };
            PermissionSubLevels.HasPermission = true;
            PermissionSubLevels.AreaName = $("#ui_chkSubSendWhatsApp").attr("AreaName");
            PermissionSubLevels.ControllerName = $("#ui_chkSubSendWhatsApp").attr("ControllerName");
            PermissionSubLevels.ActionName = $("#ui_chkSubSendWhatsApp").attr("ActionName");
            PermissionSubLevels.FeatureName = $("#ui_chkSubSendWhatsApp").attr("SubFeatureName");
            PermissionSubLevelsList.push(PermissionSubLevels);
        }
        if ($("#ui_chkSubMakeaCall").is(":checked")) {
            PermissionSubLevels = { Id: 0, PermissionLevelId: 0, AreaName: "", ControllerName: "", ActionName: "", FeatureName: "", HasPermission: false };
            PermissionSubLevels.HasPermission = true;
            PermissionSubLevels.AreaName = $("#ui_chkSubMakeaCall").attr("AreaName");
            PermissionSubLevels.ControllerName = $("#ui_chkSubMakeaCall").attr("ControllerName");
            PermissionSubLevels.ActionName = $("#ui_chkSubMakeaCall").attr("ActionName");
            PermissionSubLevels.FeatureName = $("#ui_chkSubMakeaCall").attr("SubFeatureName");
            PermissionSubLevelsList.push(PermissionSubLevels);
        }
        if ($("#ui_chkSubDeleteLead").is(":checked")) {
            PermissionSubLevels = { Id: 0, PermissionLevelId: 0, AreaName: "", ControllerName: "", ActionName: "", FeatureName: "", HasPermission: false };
            PermissionSubLevels.HasPermission = true;
            PermissionSubLevels.AreaName = $("#ui_chkSubDeleteLead").attr("AreaName");
            PermissionSubLevels.ControllerName = $("#ui_chkSubDeleteLead").attr("ControllerName");
            PermissionSubLevels.ActionName = $("#ui_chkSubDeleteLead").attr("ActionName");
            PermissionSubLevels.FeatureName = $("#ui_chkSubDeleteLead").attr("SubFeatureName");
            PermissionSubLevelsList.push(PermissionSubLevels);
        }
        //else {
        //    PermissionSubLevels.HasPermission = false;
        //    PermissionSubLevels.AreaName = $("#ui_chkSubRoleRetainAssignment").attr("AreaName");
        //    PermissionSubLevels.ControllerName = $("#ui_chkSubRoleRetainAssignment").attr("ControllerName");
        //    PermissionSubLevels.ActionName = $("#ui_chkSubRoleRetainAssignment").attr("ActionName");
        //    PermissionSubLevels.FeatureName = $("#ui_chkSubRoleRetainAssignment").attr("SubFeatureName");
        //}

        //End of Saving For Lead Management

        //Start of Saving For Social
        if ($("#socialview").is(':checked'))
            Roles.SocialView = true;
        else
            Roles.SocialView = false;
        if ($("#socialedit").is(':checked'))
            Roles.SocialContribute = true;
        else
            Roles.SocialContribute = false;
        if ($("#socialcontaman").is(':checked'))
            Roles.SocialDesign = true;
        else
            Roles.SocialDesign = false;

        if ($("#socialmod").is(":checked"))
            Roles.Social = true;
        else
            Roles.Social = false;

        if ($("#socialview").is(":checked") && $("#socialedit").is(":checked"))
            Roles.SocialHasFullControl = true;
        else
            Roles.SocialHasFullControl = false;

        //End of Saving For Social

        //Start of Saving For WorkFlow
        if ($("#workFlowview").is(':checked'))
            Roles.WorkFlowView = true;
        else
            Roles.WorkFlowView = false;
        if ($("#workFlowedit").is(':checked'))
            Roles.WorkFlowContribute = true;
        else
            Roles.WorkFlowContribute = false;
        if ($("#workFlowcontaman").is(':checked'))
            Roles.WorkFlowDesign = true;
        else
            Roles.WorkFlowDesign = false;

        if ($("#workFlowmod").is(":checked"))
            Roles.WorkFlow = true;
        else
            Roles.WorkFlow = false;

        if ($("#workFlowview").is(":checked") && $("#workFlowedit").is(":checked") && $("#workFlowcontaman").is(":checked"))
            Roles.WorkFlowHasFullControl = true;
        else
            Roles.WorkFlowHasFullControl = false;

        //End of Saving For WorkFlow

        //Start of Saving For Segmentation
        if ($("#advancview").is(':checked'))
            Roles.SegmentationView = true;
        else
            Roles.SegmentationView = false;
        if ($("#advancedit").is(':checked'))
            Roles.SegmentationContribute = true;
        else
            Roles.SegmentationContribute = false;
        if ($("#advanccontman").is(':checked'))
            Roles.SegmentationDesign = true;
        else
            Roles.SegmentationDesign = false;

        if ($("#advancmod").is(":checked"))
            Roles.Segmentation = true;
        else
            Roles.Segmentation = false;

        if ($("#advancview").is(":checked") && $("#advancedit").is(":checked"))
            Roles.SegmentationHasFullControl = true;
        else
            Roles.SegmentationHasFullControl = false;

        //End of Saving For Segmentation

        //Start of Saving For LeadScoring
        if ($("#leadscoreview").is(':checked'))
            Roles.LeadScoringView = true;
        else
            Roles.LeadScoringView = false;
        if ($("#leadscoreedit").is(':checked'))
            Roles.LeadScoringContribute = true;
        else
            Roles.LeadScoringContribute = false;
        if ($("#leadscorecontman").is(':checked'))
            Roles.LeadScoringDesign = true;
        else
            Roles.LeadScoringDesign = false;

        if ($("#leadscoremod").is(":checked"))
            Roles.LeadScoring = true;
        else
            Roles.LeadScoring = false;

        if ($("#leadscoreview").is(":checked") && $("#leadscoreedit").is(":checked") && $("#leadscorecontman").is(":checked"))
            Roles.LeadScoringHasFullControl = true;
        else
            Roles.LeadScoringHasFullControl = false;

        //End of Saving For LeadScoring

        //Start of Saving For Mobile Push Notification
        if ($("#MobilePushNotificationview").is(':checked'))
            Roles.MobilePushNotificationView = true;
        else
            Roles.MobilePushNotificationView = false;

        if ($("#MobilePushNotificationedit").is(':checked'))
            Roles.MobilePushNotificationContribute = true;
        else
            Roles.MobilePushNotificationContribute = false;

        if ($("#MobilePushNotificationcontman").is(':checked'))
            Roles.MobilePushNotificationDesign = true;
        else
            Roles.MobilePushNotificationDesign = false;

        if ($("#MobilePushNotificationmod").is(":checked"))
            Roles.MobilePushNotification = true;
        else
            Roles.MobilePushNotification = false;

        if ($("#MobilePushNotificationview").is(":checked") && $("#MobilePushNotificationedit").is(":checked") && $("#MobilePushNotificationcontman").is(":checked"))
            Roles.MobilePushNotificationHasFullControl = true;
        else
            Roles.MobilePushNotificationHasFullControl = false;

        //End of Saving For Mobile Push Notification
    },
    EditRoles: function (RoleId) {
        ShowPageLoading();
        userRoles.ShowCreateRolePopUp("Edit");
        $("#ui_SaveRoleDetails").removeAttr("RoleId").attr("RoleId", RoleId.toString()).html("Update");
        $("#ui_inpRoleName").addClass("disableDiv");

        let permissionslevel = new Object();
        permissionslevel.Id = RoleId;

        $.ajax({
            url: "/ManageUsers/Roles/GetPermission",
            type: 'Post',
            data: JSON.stringify({ 'permissionsleveldata': permissionslevel }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                userRoles.AssignRolesToEdit(response);
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },

    AssignRolesToEdit: function (response) {
        var responseRole = response.permissionslevel;
        var responseSubRoleList = response.responseSubRoleList;

        $("#ui_inpRoleName").val(responseRole.Name);
        $("#ui_txtRoleDescription").val(responseRole.PermissionDescription);

        let userGroupId = responseRole.UserGroupId;

        $("#ui_ddlusergroupList").val(userGroupId);

        if (responseRole.IsSuperAdmin)
            $("#adminmod").prop("checked", true);
        else
            $("#adminmod").prop("checked", false);

        if (responseRole.Developer)
            $("#devmod").prop("checked", true);
        else
            $("#devmod").prop("checked", false);

        if (responseRole.Export)
            $("#exportmod").prop("checked", true);
        else
            $("#exportmod").prop("checked", false);

        if (responseRole.MaskData)
            $("#maskdatamod").prop("checked", true);
        else
            $("#maskdatamod").prop("checked", false);

        if (responseRole.UserRole) {
            $("#Users").prop("checked", true);

            if (responseRole.UserRoleHasFullControl) {
                $("#Usersview").prop("checked", true);
                $("#Usersedit").prop("checked", true);

            } else {
                if (responseRole.UserRoleView)
                    $("#Usersview").prop("checked", true);
                else
                    $("#Usersview").prop("checked", false);

                if (responseRole.UserRoleContribute)
                    $("#Usersedit").prop("checked", true);
                else
                    $("#Usersedit").prop("checked", false);
            }
        }

        if (responseRole.Dashboard) {
            $("#Dashboard").prop("checked", true);

            if (responseRole.DashboardHasFullControl) {
                $("#Dashboardview").prop("checked", true);
                $("#Dashboardedit").prop("checked", true);
                $("#Dashboardcontman").prop("checked", true);
            } else {
                if (responseRole.DashboardView)
                    $("#Dashboardview").prop("checked", true);
                else
                    $("#Dashboardview").prop("checked", false);

                if (responseRole.DashboardContribute)
                    $("#Dashboardedit").prop("checked", true);
                else
                    $("#Dashboardedit").prop("checked", false);


                if (responseRole.DashboardDesign)
                    $("#Dashboardcontman").prop("checked", true);
                else
                    $("#Dashboardcontman").prop("checked", false);
            }
        }

        if (responseRole.Contacts) {
            $("#Contacts").prop("checked", true);

            if (responseRole.ContactsHasFullControl) {
                $("#Contactsview").prop("checked", true);
                $("#Contactsedit").prop("checked", true);
                $("#Contactscontman").prop("checked", true);
            } else {
                if (responseRole.ContactsView)
                    $("#Contactsview").prop("checked", true);
                else
                    $("#Contactsview").prop("checked", false);

                if (responseRole.ContactsContribute)
                    $("#Contactsedit").prop("checked", true);
                else
                    $("#Contactsedit").prop("checked", false);


                if (responseRole.ContactsDesign)
                    $("#Contactscontman").prop("checked", true);
                else
                    $("#Contactscontman").prop("checked", false);
            }
        }


        if (responseRole.Analytics) {
            $("#WebAnalytics").prop("checked", true);

            if (responseRole.AnalyticsHasFullControl) {
                $("#WebAnalview").prop("checked", true);
                $("#WebAnaledit").prop("checked", true);
                $("#WebAnalcontman").prop("checked", true);
            } else {
                if (responseRole.AnalyticsView)
                    $("#WebAnalview").prop("checked", true);
                else
                    $("#WebAnalview").prop("checked", false);


                if (responseRole.AnalyticsContribute)
                    $("#WebAnaledit").prop("checked", true);
                else
                    $("#WebAnaledit").prop("checked", false);

                if (responseRole.AnalyticsDesign)
                    $("#WebAnalcontman").prop("checked", true);
                else
                    $("#WebAnalcontman").prop("checked", false);


            }
        }

        if (responseRole.Forms) {
            $("#WebEngment").prop("checked", true);

            if (responseRole.FormsHasFullControl) {
                $("#WebEngview").prop("checked", true);
                $("#WebEngedit").prop("checked", true);
                $("#WebEngcontman").prop("checked", true);
            } else {
                if (responseRole.FormsView)
                    $("#WebEngview").prop("checked", true);
                else
                    $("#WebEngview").prop("checked", false);

                if (responseRole.FormsContribute)
                    $("#WebEngedit").prop("checked", true);
                else
                    $("#WebEngedit").prop("checked", false);

                if (responseRole.FormsDesign)
                    $("#WebEngcontman").prop("checked", true);
                else
                    $("#WebEngcontman").prop("checked", false);



            }
        }

        if (responseRole.Mobile) {
            $("#mobanaltics").prop("checked", true);

            if (responseRole.MobileHasFullControl) {
                $("#mobanalview").prop("checked", true);
                $("#mobanaledit").prop("checked", true);
                $("#mobanalcontman").prop("checked", true);
            } else {
                if (responseRole.MobileView)
                    $("#mobanalview").prop("checked", true);
                else
                    $("#mobanalview").prop("checked", false);


                if (responseRole.MobileContribute)
                    $("#mobanaledit").prop("checked", true);
                else
                    $("#mobanaledit").prop("checked", false);

                if (responseRole.MobileDesign)
                    $("#mobanalcontman").prop("checked", true);
                else
                    $("#mobanalcontman").prop("checked", false);


            }
        }

        if (responseRole.MobileEngagement) {
            $("#mobengment").prop("checked", true);

            if (responseRole.MobileEngagementHasFullControl) {
                $("#mobengview").prop("checked", true);
                $("#mobengedit").prop("checked", true);
                $("#mobengecontman").prop("checked", true);
            } else {
                if (responseRole.MobileEngagementView)
                    $("#mobengview").prop("checked", true);
                else
                    $("#mobengview").prop("checked", false);

                if (responseRole.MobileEngagementContribute)
                    $("#mobengedit").prop("checked", true);
                else
                    $("#mobengedit").prop("checked", false);


                if (responseRole.MobileEngagementDesign)
                    $("#mobengecontman").prop("checked", true);
                else
                    $("#mobengecontman").prop("checked", false);


            }
        }

        if (responseRole.EmailMarketing) {
            $("#modemail").prop("checked", true);

            if (responseRole.EmailMarketingHasFullControl) {
                $("#modemailview").prop("checked", true);
                $("#modemailedit").prop("checked", true);
                $("#modemailcontman").prop("checked", true);
            } else {
                if (responseRole.EmailMarketingView)
                    $("#modemailview").prop("checked", true);
                else
                    $("#modemailview").prop("checked", false);

                if (responseRole.EmailMarketingContribute)
                    $("#modemailedit").prop("checked", true);
                else
                    $("#modemailedit").prop("checked", false);

                if (responseRole.EmailMarketingDesign)
                    $("#modemailcontman").prop("checked", true);
                else
                    $("#modemailcontman").prop("checked", false);
            }
        }

        if (responseRole.SMS) {
            $("#modsms").prop("checked", true);

            if (responseRole.SMSHasFullControl) {
                $("#modsmsview").prop("checked", true);
                $("#modsmsedit").prop("checked", true);
                $("#modsmscontman").prop("checked", true);
            } else {
                if (responseRole.SMSView)
                    $("#modsmsview").prop("checked", true);
                else
                    $("#modsmsview").prop("checked", false);

                if (responseRole.SMSContribute)
                    $("#modsmsedit").prop("checked", true);
                else
                    $("#modsmsedit").prop("checked", false);


                if (responseRole.SMSDesign)
                    $("#modsmscontman").prop("checked", true);
                else
                    $("#modsmscontman").prop("checked", false);


            }
        }


        if (responseRole.SiteChat) {
            $("#modchat").prop("checked", true);

            if (responseRole.SiteChatHasFullControl) {
                $("#modchatview").prop("checked", true);
                $("#modchatedit").prop("checked", true);
                $("#modchatcontaman").prop("checked", true);
            } else {
                if (responseRole.SiteChatView)
                    $("#modchatview").prop("checked", true);
                else
                    $("#modchatview").prop("checked", false);

                if (responseRole.SiteChatContribute)
                    $("#modchatedit").prop("checked", true);
                else
                    $("#modchatedit").prop("checked", false);

                if (responseRole.SiteChatDesign)
                    $("#modchatcontaman").prop("checked", true);
                else
                    $("#modchatcontaman").prop("checked", false);



            }
        }


        if (responseRole.WebPushNotification) {
            $("#webpushmod").prop("checked", true);

            if (responseRole.WebPushNotificationHasFullControl) {
                $("#webpushview").prop("checked", true);
                $("#webpushedit").prop("checked", true);
                $("#webpushcontman").prop("checked", true);
            } else {
                if (responseRole.WebPushNotificationView)
                    $("#webpushview").prop("checked", true);
                else
                    $("#webpushview").prop("checked", false);

                if (responseRole.WebPushNotificationContribute)
                    $("#webpushedit").prop("checked", true);
                else
                    $("#webpushedit").prop("checked", false);

                if (responseRole.WebPushNotificationDesign)
                    $("#webpushcontman").prop("checked", true);
                else
                    $("#webpushcontman").prop("checked", false);
            }
        }


        if (responseRole.Whatsapp) {
            $("#whatsappmod").prop("checked", true);

            if (responseRole.WhatsappHasFullControl) {
                $("#whatsappview").prop("checked", true);
                $("#whatsappedit").prop("checked", true);
                $("#whatsappcontman").prop("checked", true);
            }
            else {
                if (responseRole.WhatsappView)
                    $("#whatsappview").prop("checked", true);
                else
                    $("#whatsappview").prop("checked", false);

                if (responseRole.WhatsappContribute)
                    $("#whatsappedit").prop("checked", true);
                else
                    $("#whatsappedit").prop("checked", false);

                if (responseRole.WhatsappDesign)
                    $("#whatsappcontman").prop("checked", true);
                else
                    $("#whatsappcontman").prop("checked", false);
            }
        }

        if (responseRole.CustomEvents) {
            $("#customeventsmod").prop("checked", true);

            if (responseRole.CustomEventsHasFullControl) {
                $("#customeventsview").prop("checked", true);
                $("#customeventsedit").prop("checked", true);
                $("#customeventscontman").prop("checked", true);
            }
            else {
                if (responseRole.CustomEvents)
                    $("#customeventsview").prop("checked", true);
                else
                    $("#customeventsview").prop("checked", false);

                if (responseRole.CustomEventsContribute)
                    $("#customeventsedit").prop("checked", true);
                else
                    $("#customeventsedit").prop("checked", false);

                if (responseRole.CustomEventsDesign)
                    $("#customeventscontman").prop("checked", true);
                else
                    $("#customeventscontman").prop("checked", false);
            }
        }

        $("#ui_chkSubRoleRetainAssignment").prop("checked", false);
        $("#ui_chkSubRoleRetainSource").prop("checked", false);
        if (responseRole.LeadManagement) {
            $("#leadmanagemod").prop("checked", true);

            if (responseRole.LeadManagementHasFullControl) {
                $("#leadmanageview").prop("checked", true);
                $("#leadmanageedit").prop("checked", true);
                $("#leadmanagecontman").prop("checked", true);
            }
            else {
                if (responseRole.LeadManagementView)
                    $("#leadmanageview").prop("checked", true);
                else
                    $("#leadmanageview").prop("checked", false);

                if (responseRole.LeadManagementContribute)
                    $("#leadmanageedit").prop("checked", true);
                else
                    $("#leadmanageedit").prop("checked", false);

                if (responseRole.LeadManagementDesign)
                    $("#leadmanagecontman").prop("checked", true);
                else
                    $("#leadmanagecontman").prop("checked", false);
            }

            if (responseSubRoleList != undefined && responseSubRoleList != null) {
                $(".subPermission").prop("checked", false);
                for (var p = 0; p < responseSubRoleList.length; p++) {
                    var responseSubRole = responseSubRoleList[p];


                    if (responseSubRole.FeatureName == "RetainAssignment") {
                        $("#ui_chkSubRoleRetainAssignment").prop("checked", true);
                    }
                    else if (responseSubRole.FeatureName == "RetainSource") {
                        $("#ui_chkSubRoleRetainSource").prop("checked", true);
                    }
                    else if (responseSubRole.FeatureName == "AddSource") {
                        $("#ui_chkSubAddSource").prop("checked", true);
                    }
                    else if (responseSubRole.FeatureName == "AddLead") {
                        $("#ui_chkSubAddLead").prop("checked", true);
                    }
                    else if (responseSubRole.FeatureName == "ImportLead") {
                        $("#ui_chkSubImportLead").prop("checked", true);
                    }
                    else if (responseSubRole.FeatureName == "EditLead") {
                        $("#ui_chkSubEditLead").prop("checked", true);
                    }
                    else if (responseSubRole.FeatureName == "GroupManage") {
                        $("#ui_chkSubGroupManage").prop("checked", true);
                    }
                    else if (responseSubRole.FeatureName == "AddCustomeFields") {
                        $("#ui_chkSubAddCustomeFields").prop("checked", true);
                    }
                    else if (responseSubRole.FeatureName == "SendSms") {
                        $("#ui_chkSubSendSms").prop("checked", true);
                    }
                    else if (responseSubRole.FeatureName == "SendMail") {
                        $("#ui_chkSubSendMail").prop("checked", true);
                    }
                    else if (responseSubRole.FeatureName == "SendWhatsApp") {
                        $("#ui_chkSubSendWhatsApp").prop("checked", true);
                    }
                    else if (responseSubRole.FeatureName == "MakeaCall") {
                        $("#ui_chkSubMakeaCall").prop("checked", true);
                    }
                    else if (responseSubRole.FeatureName == "DeleteLead") {
                        $("#ui_chkSubDeleteLead").prop("checked", true);
                    }
                }

            }
        }

        if (responseRole.Social) {
            $("#socialmod").prop("checked", true);

            if (responseRole.SocialHasFullControl) {
                $("#socialview").prop("checked", true);
                $("#socialedit").prop("checked", true);
                $("#socialcontaman").prop("checked", true);
            }
            else {
                if (responseRole.SocialView)
                    $("#socialview").prop("checked", true);
                else
                    $("#socialview").prop("checked", false);

                if (responseRole.SocialContribute)
                    $("#socialedit").prop("checked", true);
                else
                    $("#socialedit").prop("checked", false);

                if (responseRole.SocialDesign)
                    $("#socialcontaman").prop("checked", true);
                else
                    $("#socialcontaman").prop("checked", false);
            }
        }

        if (responseRole.WorkFlow) {
            $("#workFlowmod").prop("checked", true);

            if (responseRole.WorkFlowHasFullControl) {
                $("#workFlowview").prop("checked", true);
                $("#workFlowedit").prop("checked", true);
                $("#workFlowcontaman").prop("checked", true);
            }
            else {
                if (responseRole.WorkFlowView)
                    $("#workFlowview").prop("checked", true);
                else
                    $("#workFlowview").prop("checked", false);

                if (responseRole.WorkFlowContribute)
                    $("#workFlowedit").prop("checked", true);
                else
                    $("#workFlowedit").prop("checked", false);

                if (responseRole.WorkFlowDesign)
                    $("#workFlowcontaman").prop("checked", true);
                else
                    $("#workFlowcontaman").prop("checked", false);
            }
        }

        if (responseRole.Segmentation) {
            $("#advancmod").prop("checked", true);

            if (responseRole.SegmentationHasFullControl) {
                $("#advancview").prop("checked", true);
                $("#advancedit").prop("checked", true);
                $("#advanccontman").prop("checked", true);
            }
            else {
                if (responseRole.SegmentationView)
                    $("#advancview").prop("checked", true);
                else
                    $("#advancview").prop("checked", false);

                if (responseRole.SegmentationContribute)
                    $("#advancedit").prop("checked", true);
                else
                    $("#advancedit").prop("checked", false);

                if (responseRole.SegmentationDesign)
                    $("#advanccontman").prop("checked", true);
                else
                    $("#advanccontman").prop("checked", false);
            }
        }

        if (responseRole.LeadScoring) {
            $("#leadscoremod").prop("checked", true);

            if (responseRole.LeadScoringHasFullControl) {
                $("#leadscoreview").prop("checked", true);
                $("#leadscoreedit").prop("checked", true);
                $("#leadscorecontman").prop("checked", true);
            }
            else {
                if (responseRole.LeadScoringView)
                    $("#leadscoreview").prop("checked", true);
                else
                    $("#leadscoreview").prop("checked", false);

                if (responseRole.LeadScoringContribute)
                    $("#leadscoreedit").prop("checked", true);
                else
                    $("#leadscoreedit").prop("checked", false);

                if (responseRole.LeadScoringDesign)
                    $("#leadscorecontman").prop("checked", true);
                else
                    $("#leadscorecontman").prop("checked", false);
            }
        }

        if (responseRole.MobilePushNotification) {
            $("#MobilePushNotificationmod").prop("checked", true);

            if (responseRole.MobilePushNotificationHasFullControl) {
                $("#MobilePushNotificationview").prop("checked", true);
                $("#MobilePushNotificationedit").prop("checked", true);
                $("#MobilePushNotificationcontman").prop("checked", true);
            }
            else {
                if (responseRole.MobilePushNotificationView)
                    $("#MobilePushNotificationview").prop("checked", true);
                else
                    $("#MobilePushNotificationview").prop("checked", false);

                if (responseRole.MobilePushNotificationContribute)
                    $("#MobilePushNotificationedit").prop("checked", true);
                else
                    $("#MobilePushNotificationedit").prop("checked", false);

                if (responseRole.MobilePushNotificationDesign)
                    $("#MobilePushNotificationcontman").prop("checked", true);
                else
                    $("#MobilePushNotificationcontman").prop("checked", false);
            }
        }
    },
    GetGroupDetails: function () {

        $.ajax({
            url: "/ManageContact/Group/GetUserGroupList",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataFilter: function (data) { return data; },
            success: function (response) {
                if (response != undefined && response != null) {

                    $.each(response, function () {

                        $("#ui_ddlusergroupList").append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");

                    });

                }
            },
            error: ShowAjaxError
        });
    },
    CloseSubRolePopUp: function () {
        $("#ui_divSubRolePopUp").addClass("hideDiv");
    }
};

$(document).ready(function () {
    HidePageLoading();
    $("#ui_divSubRolePopUp").addClass("hideDiv");
    userRoles.GetRolesMaxCount();
});

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    userRoles.GetRolesDetails();
}

$("#deleteRowConfirm").click(function () {
    userRoles.Delete(UserRoleIdForDelete);
});

$('#ui_RolesSerach').keypress(function (e) {
    var key = e.which;
    if (key == 13) {
        userRoles.SearchByRoleName();
        return false;
    }
});

$("#ui_RolesSerach").keyup(function () {
    if (CleanText($.trim($("#ui_RolesSerach").val())).length == 0) {
        ShowPageLoading();
        userRoles.GetRolesMaxCount();
    }
});

$("#ui_btnRoleName").click(function () {
    userRoles.SearchByRoleName();
});


$(".createrolebtn").click(function () {
    userRoles.ClearFields();
    userRoles.ShowCreateRolePopUp("Create");
    $("#ui_SaveRoleDetails").removeAttr("RoleId").html("Save");
    $("#ui_inpRoleName").removeClass("disableDiv");
});

$('.clserolewrp .fa-times,.clsepopup').click(function () {
    userRoles.ClearFields();
    $(".pagetitle").html("Manage Roles");
    $(".mainpaneloverlap").addClass("hideDiv");
    $(".settcontainer").removeClass("hideDiv");
});

$("#ui_SaveRoleDetails").click(function () {
    userRoles.SaveRoleDetails();
});

$("#adminmod").change(function () {
    if (this.checked) {
        $("#ui_divUserRoleList").find(':checkbox').prop("checked", true);
        $(".subPermission").prop("checked", true);
    }
    else {
        $("#ui_divUserRoleList").find(':checkbox').prop("checked", false);
        $(".subPermission").prop("checked", false);
    }
});

$("#ui_divUserRoleList input[type=checkbox]").change(function () {
    if (!this.checked) {
        $("#adminmod").prop("checked", false);
    }
});

$("#ui_aLeadSubRole").click(function () {
    $("#ui_divSubRolePopUp").removeClass("hideDiv");
});

$("#ui_iCloseSubRole").click(function () {
    userRoles.CloseSubRolePopUp();
});

$("#ui_chkSubRoleRetainAssignment").change(function () {
    if (!this.checked) {
        $("#adminmod").prop("checked", false);
    }
});

$("#ui_chkSubRoleRetainSource").change(function () {
    if (!this.checked) {
        $("#adminmod").prop("checked", false);
    }
});

$("#leadmanageview").click(function () {
    if ($(this).is(":checked")) {
        $(".subPermission").prop("checked", false).attr("disabled", true);
    }
});

$("#leadmanageedit,#leadmanagecontman").click(function () {
    if ($(this).is(":checked")) {
        $(".subPermission").prop("checked", true).removeAttr("disabled");
    }
    else if ($("#leadmanageedit").is(':checked') == false && $("#leadmanagecontman").is(':checked') == false) {
        $(".subPermission").prop("checked", false).attr("disabled", true);
    }
});

//Click functions for Modules
$("#Users").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#Usersview").is(":checked"))
            $("#Usersview").prop('checked', true);
    }
    else {
        if ($("#Usersview").is(":checked"))
            $("#Usersview").prop('checked', false);
        if ($("#Usersedit").is(":checked"))
            $("#Usersedit").prop('checked', false);
    }
});

$("#Usersview").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#Users").is(":checked"))
            $("#Users").prop('checked', true);
    }
    else {
        if ($("#Users").is(":checked"))
            $("#Users").prop('checked', false);
        if ($("#Usersedit").is(":checked"))
            $("#Usersedit").prop('checked', false);
    }
});

$("#Usersedit").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#Users").is(":checked"))
            $("#Users").prop('checked', true);
        if (!$("#Usersview").is(":checked"))
            $("#Usersview").prop('checked', true);
    }
});

$("#Dashboard").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#Dashboardview").is(":checked"))
            $("#Dashboardview").prop('checked', true);
    }
    else {
        if ($("#Dashboardview").is(":checked"))
            $("#Dashboardview").prop('checked', false);
        if ($("#Dashboardedit").is(":checked"))
            $("#Dashboardedit").prop('checked', false);
    }
});

$("#Dashboardview").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#Dashboard").is(":checked"))
            $("#Dashboard").prop('checked', true);
    }
    else {
        if ($("#Dashboard").is(":checked"))
            $("#Dashboard").prop('checked', false);
        if ($("#Dashboardedit").is(":checked"))
            $("#Dashboardedit").prop('checked', false);
    }
});

$("#Dashboardedit").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#Dashboard").is(":checked"))
            $("#Dashboard").prop('checked', true);
        if (!$("#Dashboardview").is(":checked"))
            $("#Dashboardview").prop('checked', true);
    }
});

$("#Contacts").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#Contactsview").is(":checked"))
            $("#Contactsview").prop('checked', true);
    }
    else {
        if ($("#Contactsview").is(":checked"))
            $("#Contactsview").prop('checked', false);
        if ($("#Contactsedit").is(":checked"))
            $("#Contactsedit").prop('checked', false);
    }
});

$("#Contactsview").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#Contacts").is(":checked"))
            $("#Contacts").prop('checked', true);
    }
    else {
        if ($("#Contacts").is(":checked"))
            $("#Contacts").prop('checked', false);
        if ($("#Contactsedit").is(":checked"))
            $("#Contactsedit").prop('checked', false);
    }
});

$("#Contactsedit").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#Contacts").is(":checked"))
            $("#Contacts").prop('checked', true);
        if (!$("#Contactsview").is(":checked"))
            $("#Contactsview").prop('checked', true);
    }
});

$("#WebAnalytics").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#WebAnalview").is(":checked"))
            $("#WebAnalview").prop('checked', true);
    }
    else {
        if ($("#WebAnalview").is(":checked"))
            $("#WebAnalview").prop('checked', false);
        if ($("#WebAnaledit").is(":checked"))
            $("#WebAnaledit").prop('checked', false);
    }
});

$("#WebAnalview").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#WebAnalytics").is(":checked"))
            $("#WebAnalytics").prop('checked', true);
    }
    else {
        if ($("#WebAnalytics").is(":checked"))
            $("#WebAnalytics").prop('checked', false);
        if ($("#WebAnaledit").is(":checked"))
            $("#WebAnaledit").prop('checked', false);
    }
});

$("#WebAnaledit").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#WebAnalytics").is(":checked"))
            $("#WebAnalytics").prop('checked', true);
        if (!$("#WebAnalview").is(":checked"))
            $("#WebAnalview").prop('checked', true);
    }
});

$("#WebEngment").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#WebEngview").is(":checked"))
            $("#WebEngview").prop('checked', true);
    }
    else {
        if ($("#WebEngview").is(":checked"))
            $("#WebEngview").prop('checked', false);
        if ($("#WebEngedit").is(":checked"))
            $("#WebEngedit").prop('checked', false);
        if ($("#WebEngcontman").is(":checked"))
            $("#WebEngcontman").prop('checked', false);
    }
});

$("#WebEngview").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#WebEngment").is(":checked"))
            $("#WebEngment").prop('checked', true);
    }
    else {
        if ($("#WebEngment").is(":checked"))
            $("#WebEngment").prop('checked', false);
        if ($("#WebEngedit").is(":checked"))
            $("#WebEngedit").prop('checked', false);
        if ($("#WebEngcontman").is(":checked"))
            $("#WebEngcontman").prop('checked', false);
    }
});

$("#WebEngedit").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#WebEngment").is(":checked"))
            $("#WebEngment").prop('checked', true);
        if (!$("#WebEngview").is(":checked"))
            $("#WebEngview").prop('checked', true);
    }
});

$("#WebEngcontman").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#WebEngment").is(":checked"))
            $("#WebEngment").prop('checked', true);
        if (!$("#WebEngview").is(":checked"))
            $("#WebEngview").prop('checked', true);
        if (!$("#WebEngedit").is(":checked"))
            $("#WebEngedit").prop('checked', true);
    }
});

$("#mobanaltics").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#mobanalview").is(":checked"))
            $("#mobanalview").prop('checked', true);
    }
    else {
        if ($("#mobanalview").is(":checked"))
            $("#mobanalview").prop('checked', false);
        if ($("#mobanaledit").is(":checked"))
            $("#mobanaledit").prop('checked', false);
    }
});

$("#mobanalview").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#mobanaltics").is(":checked"))
            $("#mobanaltics").prop('checked', true);
    }
    else {
        if ($("#mobanaltics").is(":checked"))
            $("#mobanaltics").prop('checked', false);
        if ($("#mobanaledit").is(":checked"))
            $("#mobanaledit").prop('checked', false);
    }
});

$("#mobanaledit").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#mobanaltics").is(":checked"))
            $("#mobanaltics").prop('checked', true);
        if (!$("#mobanalview").is(":checked"))
            $("#mobanalview").prop('checked', true);
    }
});

$("#mobengment").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#mobengview").is(":checked"))
            $("#mobengview").prop('checked', true);
    }
    else {
        if ($("#mobengview").is(":checked"))
            $("#mobengview").prop('checked', false);
        if ($("#mobengedit").is(":checked"))
            $("#mobengedit").prop('checked', false);
        if ($("#mobengecontman").is(":checked"))
            $("#mobengecontman").prop('checked', false);
    }
});

$("#mobengview").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#mobengment").is(":checked"))
            $("#mobengment").prop('checked', true);
    }
    else {
        if ($("#mobengment").is(":checked"))
            $("#mobengment").prop('checked', false);
        if ($("#mobengedit").is(":checked"))
            $("#mobengedit").prop('checked', false);
        if ($("#mobengecontman").is(":checked"))
            $("#mobengecontman").prop('checked', false);
    }
});

$("#mobengedit").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#mobengment").is(":checked"))
            $("#mobengment").prop('checked', true);
        if (!$("#mobengview").is(":checked"))
            $("#mobengview").prop('checked', true);
    }
});

$("#mobengecontman").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#mobengment").is(":checked"))
            $("#mobengment").prop('checked', true);
        if (!$("#mobengview").is(":checked"))
            $("#mobengview").prop('checked', true);
        if (!$("#mobengedit").is(":checked"))
            $("#mobengedit").prop('checked', true);
    }
});

$("#MobilePushNotificationmod").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#MobilePushNotificationview").is(":checked"))
            $("#MobilePushNotificationview").prop('checked', true);
    }
    else {
        if ($("#MobilePushNotificationview").is(":checked"))
            $("#MobilePushNotificationview").prop('checked', false);
        if ($("#MobilePushNotificationedit").is(":checked"))
            $("#MobilePushNotificationedit").prop('checked', false);
        if ($("#MobilePushNotificationcontman").is(":checked"))
            $("#MobilePushNotificationcontman").prop('checked', false);
    }
});

$("#MobilePushNotificationview").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#MobilePushNotificationmod").is(":checked"))
            $("#MobilePushNotificationmod").prop('checked', true);
    }
    else {
        if ($("#MobilePushNotificationmod").is(":checked"))
            $("#MobilePushNotificationmod").prop('checked', false);
        if ($("#MobilePushNotificationedit").is(":checked"))
            $("#MobilePushNotificationedit").prop('checked', false);
        if ($("#MobilePushNotificationcontman").is(":checked"))
            $("#MobilePushNotificationcontman").prop('checked', false);
    }
});

$("#MobilePushNotificationedit").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#MobilePushNotificationmod").is(":checked"))
            $("#MobilePushNotificationmod").prop('checked', true);
        if (!$("#MobilePushNotificationview").is(":checked"))
            $("#MobilePushNotificationview").prop('checked', true);
    }
});

$("#MobilePushNotificationcontman").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#MobilePushNotificationmod").is(":checked"))
            $("#MobilePushNotificationmod").prop('checked', true);
        if (!$("#MobilePushNotificationview").is(":checked"))
            $("#MobilePushNotificationview").prop('checked', true);
        if (!$("#MobilePushNotificationedit").is(":checked"))
            $("#MobilePushNotificationedit").prop('checked', true);
    }
});

$("#modemail").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#modemailview").is(":checked"))
            $("#modemailview").prop('checked', true);
    }
    else {
        if ($("#modemailview").is(":checked"))
            $("#modemailview").prop('checked', false);
        if ($("#modemailedit").is(":checked"))
            $("#modemailedit").prop('checked', false);
        if ($("#modemailcontman").is(":checked"))
            $("#modemailcontman").prop('checked', false);
    }
});

$("#modemailview").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#modemail").is(":checked"))
            $("#modemail").prop('checked', true);
    }
    else {
        if ($("#modemail").is(":checked"))
            $("#modemail").prop('checked', false);
        if ($("#modemailedit").is(":checked"))
            $("#modemailedit").prop('checked', false);
        if ($("#modemailcontman").is(":checked"))
            $("#modemailcontman").prop('checked', false);
    }
});

$("#modemailedit").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#modemail").is(":checked"))
            $("#modemail").prop('checked', true);
        if (!$("#modemailview").is(":checked"))
            $("#modemailview").prop('checked', true);
    }
});

$("#modemailcontman").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#modemail").is(":checked"))
            $("#modemail").prop('checked', true);
        if (!$("#modemailview").is(":checked"))
            $("#modemailview").prop('checked', true);
        if (!$("#modemailedit").is(":checked"))
            $("#modemailedit").prop('checked', true);
    }
});

$("#modsms").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#modsmsview").is(":checked"))
            $("#modsmsview").prop('checked', true);
    }
    else {
        if ($("#modsmsview").is(":checked"))
            $("#modsmsview").prop('checked', false);
        if ($("#modsmsedit").is(":checked"))
            $("#modsmsedit").prop('checked', false);
        if ($("#modsmscontman").is(":checked"))
            $("#modsmscontman").prop('checked', false);
    }
});

$("#modsmsview").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#modsms").is(":checked"))
            $("#modsms").prop('checked', true);
    }
    else {
        if ($("#modsms").is(":checked"))
            $("#modsms").prop('checked', false);
        if ($("#modsmsedit").is(":checked"))
            $("#modsmsedit").prop('checked', false);
        if ($("#modsmscontman").is(":checked"))
            $("#modsmscontman").prop('checked', false);
    }
});

$("#modsmsedit").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#modsms").is(":checked"))
            $("#modsms").prop('checked', true);
        if (!$("#modsmsview").is(":checked"))
            $("#modsmsview").prop('checked', true);
    }
});

$("#modsmscontman").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#modsms").is(":checked"))
            $("#modsms").prop('checked', true);
        if (!$("#modsmsview").is(":checked"))
            $("#modsmsview").prop('checked', true);
        if (!$("#modsmsedit").is(":checked"))
            $("#modsmsedit").prop('checked', true);
    }
});

$("#modchat").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#modchatview").is(":checked"))
            $("#modchatview").prop('checked', true);
    }
    else {
        if ($("#modchatview").is(":checked"))
            $("#modchatview").prop('checked', false);
        if ($("#modchatedit").is(":checked"))
            $("#modchatedit").prop('checked', false);
        if ($("#modchatcontaman").is(":checked"))
            $("#modchatcontaman").prop('checked', false);
    }
});

$("#modchatview").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#modchat").is(":checked"))
            $("#modchat").prop('checked', true);
    }
    else {
        if ($("#modchat").is(":checked"))
            $("#modchat").prop('checked', false);
        if ($("#modchatedit").is(":checked"))
            $("#modchatedit").prop('checked', false);
        if ($("#modchatcontaman").is(":checked"))
            $("#modchatcontaman").prop('checked', false);
    }
});

$("#modchatedit").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#modchat").is(":checked"))
            $("#modchat").prop('checked', true);
        if (!$("#modchatview").is(":checked"))
            $("#modchatview").prop('checked', true);
    }
});

$("#modchatcontaman").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#modchat").is(":checked"))
            $("#modchat").prop('checked', true);
        if (!$("#modchatview").is(":checked"))
            $("#modchatview").prop('checked', true);
        if (!$("#modchatedit").is(":checked"))
            $("#modchatedit").prop('checked', true);
    }
});

$("#webpushmod").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#webpushview").is(":checked"))
            $("#webpushview").prop('checked', true);
    }
    else {
        if ($("#webpushview").is(":checked"))
            $("#webpushview").prop('checked', false);
        if ($("#webpushedit").is(":checked"))
            $("#webpushedit").prop('checked', false);
        if ($("#webpushcontman").is(":checked"))
            $("#webpushcontman").prop('checked', false);
    }
});

$("#webpushview").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#webpushmod").is(":checked"))
            $("#webpushmod").prop('checked', true);
    }
    else {
        if ($("#webpushmod").is(":checked"))
            $("#webpushmod").prop('checked', false);
        if ($("#webpushedit").is(":checked"))
            $("#webpushedit").prop('checked', false);
        if ($("#webpushcontman").is(":checked"))
            $("#webpushcontman").prop('checked', false);
    }
});

$("#webpushedit").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#webpushmod").is(":checked"))
            $("#webpushmod").prop('checked', true);
        if (!$("#webpushview").is(":checked"))
            $("#webpushview").prop('checked', true);
    }
});

$("#webpushcontman").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#webpushmod").is(":checked"))
            $("#webpushmod").prop('checked', true);
        if (!$("#webpushview").is(":checked"))
            $("#webpushview").prop('checked', true);
        if (!$("#webpushedit").is(":checked"))
            $("#webpushedit").prop('checked', true);
    }
});

$("#leadmanagemod").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#leadmanageview").is(":checked"))
            $("#leadmanageview").prop('checked', true);
    }
    else {
        if ($("#leadmanageview").is(":checked"))
            $("#leadmanageview").prop('checked', false);
        if ($("#leadmanageedit").is(":checked"))
            $("#leadmanageedit").prop('checked', false);
    }
});

$("#leadmanageview").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#leadmanagemod").is(":checked"))
            $("#leadmanagemod").prop('checked', true);
    }
    else {
        if ($("#leadmanagemod").is(":checked"))
            $("#leadmanagemod").prop('checked', false);
        if ($("#leadmanageedit").is(":checked"))
            $("#leadmanageedit").prop('checked', false);
    }
});

$("#leadmanageedit").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#leadmanagemod").is(":checked"))
            $("#leadmanagemod").prop('checked', true);
        if (!$("#leadmanageview").is(":checked"))
            $("#leadmanageview").prop('checked', true);
    }
});

$("#socialmod").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#socialview").is(":checked"))
            $("#socialview").prop('checked', true);
    }
    else {
        if ($("#socialview").is(":checked"))
            $("#socialview").prop('checked', false);
        if ($("#socialedit").is(":checked"))
            $("#socialedit").prop('checked', false);
    }
});

$("#socialview").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#socialmod").is(":checked"))
            $("#socialmod").prop('checked', true);
    }
    else {
        if ($("#socialmod").is(":checked"))
            $("#socialmod").prop('checked', false);
        if ($("#socialedit").is(":checked"))
            $("#socialedit").prop('checked', false);
    }
});

$("#socialedit").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#socialmod").is(":checked"))
            $("#socialmod").prop('checked', true);
        if (!$("#socialview").is(":checked"))
            $("#socialview").prop('checked', true);
    }
});

$("#workFlowmod").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#workFlowview").is(":checked"))
            $("#workFlowview").prop('checked', true);
    }
    else {
        if ($("#workFlowview").is(":checked"))
            $("#workFlowview").prop('checked', false);
        if ($("#workFlowedit").is(":checked"))
            $("#workFlowedit").prop('checked', false);
        if ($("#workFlowcontaman").is(":checked"))
            $("#workFlowcontaman").prop('checked', false);
    }
});

$("#workFlowview").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#workFlowmod").is(":checked"))
            $("#workFlowmod").prop('checked', true);
    }
    else {
        if ($("#workFlowmod").is(":checked"))
            $("#workFlowmod").prop('checked', false);
        if ($("#workFlowedit").is(":checked"))
            $("#workFlowedit").prop('checked', false);
        if ($("#workFlowcontaman").is(":checked"))
            $("#workFlowcontaman").prop('checked', false);
    }
});

$("#workFlowedit").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#workFlowmod").is(":checked"))
            $("#workFlowmod").prop('checked', true);
        if (!$("#workFlowview").is(":checked"))
            $("#workFlowview").prop('checked', true);
    }
});

$("#workFlowcontaman").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#workFlowmod").is(":checked"))
            $("#workFlowmod").prop('checked', true);
        if (!$("#workFlowview").is(":checked"))
            $("#workFlowview").prop('checked', true);
        if (!$("#workFlowedit").is(":checked"))
            $("#workFlowedit").prop('checked', true);
    }
});

$("#advancmod").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#advancview").is(":checked"))
            $("#advancview").prop('checked', true);
    }
    else {
        if ($("#advancview").is(":checked"))
            $("#advancview").prop('checked', false);
        if ($("#advancedit").is(":checked"))
            $("#advancedit").prop('checked', false);
    }
});

$("#advancview").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#advancmod").is(":checked"))
            $("#advancmod").prop('checked', true);
    }
    else {
        if ($("#advancmod").is(":checked"))
            $("#advancmod").prop('checked', false);
        if ($("#advancedit").is(":checked"))
            $("#advancedit").prop('checked', false);
    }
});

$("#advancedit").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#advancmod").is(":checked"))
            $("#advancmod").prop('checked', true);
        if (!$("#advancview").is(":checked"))
            $("#advancview").prop('checked', true);
    }
});

$("#leadscoremod").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#leadscoreview").is(":checked"))
            $("#leadscoreview").prop('checked', true);
    }
    else {
        if ($("#leadscoreview").is(":checked"))
            $("#leadscoreview").prop('checked', false);
        if ($("#leadscoreedit").is(":checked"))
            $("#leadscoreedit").prop('checked', false);
        if ($("#leadscorecontman").is(":checked"))
            $("#leadscorecontman").prop('checked', false);
    }
});

$("#leadscoreview").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#leadscoremod").is(":checked"))
            $("#leadscoremod").prop('checked', true);
    }
    else {
        if ($("#leadscoremod").is(":checked"))
            $("#leadscoremod").prop('checked', false);
        if ($("#leadscoreedit").is(":checked"))
            $("#leadscoreedit").prop('checked', false);
        if ($("#leadscorecontman").is(":checked"))
            $("#leadscorecontman").prop('checked', false);
    }
});

$("#leadscoreedit").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#leadscoremod").is(":checked"))
            $("#leadscoremod").prop('checked', true);
        if (!$("#leadscoreview").is(":checked"))
            $("#leadscoreview").prop('checked', true);
    }
});

$("#leadscorecontman").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#leadscoremod").is(":checked"))
            $("#leadscoremod").prop('checked', true);
        if (!$("#leadscoreview").is(":checked"))
            $("#leadscoreview").prop('checked', true);
        if (!$("#leadscoreedit").is(":checked"))
            $("#leadscoreedit").prop('checked', true);
    }
});

$("#whatsappmod").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#whatsappview").is(":checked"))
            $("#whatsappview").prop('checked', true);
    }
    else {
        if ($("#whatsappview").is(":checked"))
            $("#whatsappview").prop('checked', false);
        if ($("#whatsappedit").is(":checked"))
            $("#whatsappedit").prop('checked', false);
        if ($("#whatsappcontman").is(":checked"))
            $("#whatsappcontman").prop('checked', false);
    }
});

$("#customeventsmod").click(function () {
    if ($(this).is(":checked")) {
        if (!$("#customeventsview").is(":checked"))
            $("#customeventsview").prop('checked', true);
    }
    else {
        if ($("#customeventsview").is(":checked"))
            $("#customeventsview").prop('checked', false);
        if ($("#customeventsedit").is(":checked"))
            $("#customeventsedit").prop('checked', false);
        if ($("#customeventscontman").is(":checked"))
            $("#customeventscontman").prop('checked', false);
    }
});

//End of checkbox click for modules
//**NOTE : What's app module not added
//Not there in UI Dashboardcontman, Contactscontman, WebAnalcontman, mobanalcontman, leadmanagecontman, socialcontaman, advanccontman