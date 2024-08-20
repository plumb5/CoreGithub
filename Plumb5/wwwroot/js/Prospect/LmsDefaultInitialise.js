var LoadingDataValues = { ActiveEmailIds: false, MailTemplates: false, SmsTemplates: false, WhatsAppTemplates: false, LmsStageList: false, UsersList: false, LmsSourceList: false, GroupList: false, FormList: false, LeadProperties: false };

var UserList = new Array(), StageList = new Array(), SourceList = new Array(), SmsTemplateList = new Array(), MailTemplatesList = new Array(), LmsStageNotificationList = new Array();
var WhatsAppTemplateList = new Array();
var lmscontactuseridgroupid = [];
var Lmscustomfielddetails = [];
var AdvancedSettingHandledbyStatus = 0;
//var UserListforassign = new Array()
var LeadsPageDocumentReadyUtil = {
    UCPInitialTemp: function () {
        LmsDefaultInitialiseUtil.GetLmsAdvacedSettings();
        LmsDefaultInitialiseUtil.GetUsersfollowupLists();
        LmsDefaultInitialiseUtil.GetActiveEmailId();
        LmsDefaultInitialiseUtil.GetMailTemplate();
        LmsDefaultInitialiseUtil.GetSmsTemplate();
        LmsDefaultInitialiseUtil.GetWhatsAppTemplate();
    },
    LoadingSymbol: function () {
        LoadingTimeInverval = setInterval(function () {
            ShowPageLoading();
            if (LoadingDataValues.ActiveEmailIds && LoadingDataValues.MailTemplates && LoadingDataValues.SmsTemplates && LoadingDataValues.WhatsAppTemplates && LoadingDataValues.LmsStageList && LoadingDataValues.UsersList && LoadingDataValues.LmsSourceList && LoadingDataValues.GroupList && LoadingDataValues.FormList && LoadingDataValues.LeadProperties) {
                LmsDefaultInitialiseUtil.BindLmsStageForAction();
                LmsDefaultInitialiseUtil.BindLmsStageForQuickFilter();
                LmsDefaultInitialiseUtil.BindLmsStageForMasterFilter();
                LmsDefaultInitialiseUtil.BindUserListForMultipleAssign();
                LmsDefaultInitialiseUtil.BindUserListForQuickFilter();
                LmsDefaultInitialiseUtil.BindHandledByForMasterFilter();
                LmsDefaultInitialiseUtil.BindLmsGroupForQuickFilter();

                if ($.urlParam("LmsGroupId") != null && parseInt($.urlParam("LmsGroupId")) > 0) {
                    GetUTCDateTimeRange(5);
                    $('.boxactionWrap, #btnClearValues, .searchCampWrap').addClass("hideDiv");
                }
                else if ($.urlParam("dashboardType") != null && parseInt($.urlParam("dashboardType")) > 0) {
                    $('.boxactionWrap, #btnClearValues, .searchCampWrap').addClass("hideDiv");

                    var dashboardType = $.urlParam("dashboardType");
                    if (parseInt(dashboardType) == 1)
                        filterLead.OrderBy = 0;
                    if (parseInt(dashboardType) == 2) {
                        filterLead.Score = 0;
                        filterLead.OrderBy = 0;
                    }
                    if (parseInt(dashboardType) == 3)
                        filterLead.OrderBy = 1;

                    GetUTCDateTimeRange(5);
                }
                else {
                    IsCheckBoxRequired = true;
                    GetUTCDateTimeRange(2);
                }

                LmsDefaultFunctionUtil.InitializeTableHeader();

                clearInterval(LoadingTimeInverval);
            }
        }, 100);
    },
    DocumentReady: function () {

        LmsDefaultInitialiseUtil.GetActiveEmailId();
        LmsDefaultInitialiseUtil.GetMailTemplate();
        LmsDefaultInitialiseUtil.GetSmsTemplate();
        LmsDefaultInitialiseUtil.GetLmsStage();
        //LmsDefaultInitialiseUtil.GetUsersList();
        LmsDefaultInitialiseUtil.GetLmsGroupList();
        setTimeout(LmsDefaultInitialiseUtil.GetContactGroupName(), 1000);
        LmsDefaultInitialiseUtil.GetAllFormsForMasterFilter();
        LmsDefaultInitialiseUtil.GetLeadProperties();
        LmsDefaultInitialiseUtil.Getlmscustomfields();
        LmsDefaultInitialiseUtil.GetLmsStageNotificationList();

        filterLead.OrderBy = 3;
        GetLoggedInUserInfo();

        LmsDefaultFunctionUtil.InitialiseCalenders();
    }
};

var FollowUpsPageDocumentReadyUtil = {
    LoadingSymbol: function () {
        LoadingTimeInverval = setInterval(function () {
            if (LoadingDataValues.ActiveEmailIds && LoadingDataValues.MailTemplates && LoadingDataValues.SmsTemplates && LoadingDataValues.WhatsAppTemplates && LoadingDataValues.LmsStageList && LoadingDataValues.UsersList && LoadingDataValues.LmsSourceList && LoadingDataValues.GroupList && LoadingDataValues.FormList && LoadingDataValues.LeadProperties) {
                LmsDefaultInitialiseUtil.Getlmscustomfields();
                LmsDefaultInitialiseUtil.BindStageDetailsForFollowUp();
                LmsDefaultInitialiseUtil.BindUserListForFollowUp();
                clearInterval(LoadingTimeInverval);
            }
        }, 100);
    },
    DocumentReady: function () {
        LmsDefaultInitialiseUtil.GetActiveEmailId();
        LmsDefaultInitialiseUtil.GetMailTemplate();
        LmsDefaultInitialiseUtil.GetSmsTemplate();
        LmsDefaultInitialiseUtil.GetLmsStage();
        //LmsDefaultInitialiseUtil.GetUsersList();
        LmsDefaultInitialiseUtil.GetLmsGroupList();
        setTimeout(LmsDefaultFunctionUtil.InitialiseCalenders(), 1000);
        LmsDefaultFunctionUtil.InitializeTableHeader();

        LoadingDataValues.LmsSourceList = LoadingDataValues.GroupList = LoadingDataValues.FormList = LoadingDataValues.LeadProperties = true;
    },
    DocumentReadyPlanned: function () {
        FollowUpsPageDocumentReadyUtil.DocumentReady();
        DataBindingInterval = setInterval(function () {
            if (LoadingDataValues.ActiveEmailIds && LoadingDataValues.MailTemplates && LoadingDataValues.SmsTemplates && LoadingDataValues.WhatsAppTemplates && LoadingDataValues.LmsStageList && LoadingDataValues.UsersList && LoadingDataValues.LmsSourceList && LoadingDataValues.GroupList && LoadingDataValues.FormList && LoadingDataValues.LeadProperties) {
                filterLead.OrderBy = 4;
                GetUTCDateTimeRangeForNext(1);
                clearInterval(DataBindingInterval);
            }
        }, 100);
    },
    DocumentReadyMissed: function () {
        FollowUpsPageDocumentReadyUtil.DocumentReady();
        DataBindingInterval = setInterval(function () {
            if (LoadingDataValues.ActiveEmailIds && LoadingDataValues.MailTemplates && LoadingDataValues.SmsTemplates && LoadingDataValues.WhatsAppTemplates && LoadingDataValues.LmsStageList && LoadingDataValues.UsersList && LoadingDataValues.LmsSourceList && LoadingDataValues.GroupList && LoadingDataValues.FormList && LoadingDataValues.LeadProperties) {
                filterLead.OrderBy = 5;
                GetUTCDateTimeRange(2);
                clearInterval(DataBindingInterval);
            }
        }, 100);
    },
    DocumentReadyCompleted: function () {
        FollowUpsPageDocumentReadyUtil.DocumentReady();
        DataBindingInterval = setInterval(function () {
            if (LoadingDataValues.ActiveEmailIds && LoadingDataValues.MailTemplates && LoadingDataValues.SmsTemplates && LoadingDataValues.WhatsAppTemplates && LoadingDataValues.LmsStageList && LoadingDataValues.UsersList && LoadingDataValues.LmsSourceList && LoadingDataValues.GroupList && LoadingDataValues.FormList && LoadingDataValues.LeadProperties) {
                filterLead.OrderBy = 6;
                GetUTCDateTimeRange(2);
                clearInterval(DataBindingInterval);
            }
        }, 100);
    }
};

var MyReportsPageDocumentReadtUtil = {
    LoadingSymbol: function () {
        LoadingTimeInverval = setInterval(function () {
            if (LoadingDataValues.ActiveEmailIds && LoadingDataValues.MailTemplates && LoadingDataValues.SmsTemplates && LoadingDataValues.WhatsAppTemplates && LoadingDataValues.LmsStageList && LoadingDataValues.UsersList && LoadingDataValues.LmsSourceList && LoadingDataValues.GroupList && LoadingDataValues.FormList && LoadingDataValues.LeadProperties) {
                LmsDefaultInitialiseUtil.BindLmsStageForMasterFilter();
                LmsDefaultInitialiseUtil.BindHandledByForMasterFilter();

                LmsDefaultFunctionUtil.InitializeTableHeader();

                LmsCustomReportPopUpUtil.BindSavedReports();
                MyReportsUtil.GetRecentSavedReportDetails();
                $("#ui_exportOrDownloadAll").removeClass('hideDiv');
                $("#ui_ddl_ExportDataRange").attr("disabled", false);
                clearInterval(LoadingTimeInverval);
            }
        }, 100);
    },
    DocumentReady: function () {
        LmsDefaultInitialiseUtil.GetActiveEmailId();
        LmsDefaultInitialiseUtil.GetMailTemplate();
        LmsDefaultInitialiseUtil.GetSmsTemplate();
        LmsDefaultInitialiseUtil.GetLmsStage();
        //LmsDefaultInitialiseUtil.GetUsersList();
        LmsDefaultInitialiseUtil.GetLmsGroupList();
        LmsDefaultInitialiseUtil.GetContactGroupName();
        LmsDefaultInitialiseUtil.GetAllFormsForMasterFilter();
        LmsDefaultInitialiseUtil.GetLeadProperties();
        LmsDefaultInitialiseUtil.Getlmscustomfields();
    }
};

var LmsDefaultInitialiseUtil = {
    GetLmsStageNotificationList: function () {
        $.ajax({
            url: "/Prospect/Settings/GetStageScore",
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LmsDefaultInitialiseUtil.BindLmsStageNotification,
            error: ShowAjaxError
        });
    },
    BindLmsStageNotification: function (response) {
        if (response != null && response.LmsNotificationList != null)
            LmsStageNotificationList = response.LmsNotificationList;
    },
    //Send Mail Pop Up From Email Id
    GetActiveEmailId: function () {
        $.ajax({
            url: "/General/GetActiveEmailIds",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LmsDefaultInitialiseUtil.BindActiveEmailId,
            error: ShowAjaxError
        });
    },
    //Auto Bind From Email Id For Send Mail Pop Up
    BindActiveEmailId: function (responsedata) {
        var response = responsedata.Data;
        if (response != undefined && response != null) {
            $("#ui_ddlFromEmailId").empty();
            $("#ui_ddlFromEmailId").append(`<option value="0">Select From EmailId</option>`);
            $.each(response, function (i) {
                $("#ui_ddlFromEmailId").append("<option value='" + response[i] + "'>" + response[i] + "</option>");
            });
        }
        LoadingDataValues.ActiveEmailIds = true;
    },
    //Send Mail Pop Up Mail Template
    GetMailTemplate: function () {
        $.ajax({
            url: "/General/GetAllTemplateList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LmsDefaultInitialiseUtil.BindMailTemplate,
            error: ShowAjaxError
        });
    },
    //Auto Bind Mail Template For Send Mail Pop Up
    BindMailTemplate: function (TemplateListdata) {
        var TemplateList = TemplateListdata.Data;
        if (TemplateList != undefined && TemplateList != null && TemplateList.length > 0) {
            MailTemplatesList = TemplateList;
            $("#ui_ddlMailTemplate").empty();
            $("#ui_ddlMailTemplate").append(`<option value="0">Select Template</option>`);
            $.each(TemplateList, function () {
                $("#ui_ddlMailTemplate").append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");
            });
        }
        LoadingDataValues.MailTemplates = true;
    },
    //Send Sms Pop Up Sms Template
    GetSmsTemplate: function () {
        $.ajax({
            url: "/General/GetTemplateList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LmsDefaultInitialiseUtil.BindSmsTemplate,
            error: ShowAjaxError
        });
    },
    //Auto Bind Sms Template For Send Sms Pop Up
    BindSmsTemplate: function (response) {
        
        if (response != undefined && response != null && response.length > 0) {
            SmsTemplateList = response;
            $("#ui_ddlSmsTemplate").empty();
            $("#ui_ddlSmsTemplate").append(`<option value="0">Search Template</option>`);
            $.each(response, function () {
                $("#ui_ddlSmsTemplate").append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");
            });
        }
        LoadingDataValues.SmsTemplates = true;
    },
    //Send Sms Pop Up Sms Template
    GetWhatsAppTemplate: function () {
        $.ajax({
            url: "/CaptureForm/CommonDetailsForForms/GetWhatsAppTemplate",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LmsDefaultInitialiseUtil.BindWhatsAppTemplate,
            error: ShowAjaxError
        });
    },
    //Auto Bind whatsapp Template For Send Sms Pop Up
    BindWhatsAppTemplate: function (responsedata) {
        var response =responsedata.Data;
        if (response != undefined && response != null && response.length > 0) {
            WhatsAppTemplateList = response;
            $("#ui_ddlwhatsappTemplate").empty();
            $("#ui_ddlwhatsappTemplate").append(`<option value="0">Search Template</option>`);
            $.each(response, function () {
                $("#ui_ddlwhatsappTemplate").append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");
            });
        }
        LoadingDataValues.WhatsAppTemplates = true;
    },
    //Get Lms Stage
    GetLmsStage: function () {
        $.ajax({
            url: "/Prospect/Leads/GetStageScore",
            type: "POST",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LmsDefaultInitialiseUtil.BindLmsStageForSingleAssign,
            error: ShowAjaxError
        });
    },
    //Bind Lms Stage for single assign
    BindLmsStageForSingleAssign: function (response) {
        if (response.StagesList != null && response.StagesList.length > 0) {
            StageList = response.StagesList;
            $.each(StageList, function (i) {
                var opt = document.createElement('option');
                opt.value = $(this)[0].Score;
                opt.text = $(this)[0].Stage;
                opt.setAttribute("style", "background-color:" + $(this)[0].IdentificationColor + ";");
                $('#ui_drpdwn_AssignStage').append($("<option></option>").attr({ value: opt.value, style: "background-color:" + $(this)[0].IdentificationColor + ";" }).text(opt.text));
            });
        }
        else
            LmsDefaultFunctionUtil.AddOptionToDropDown(["ui_drpdwn_AssignStage"], "0", "No Lms Stage", "red");
        LoadingDataValues.LmsStageList = true;
    },
    //Bind Lms Stage for multiple assign
    BindLmsStageForAction: function () {
        if (StageList != null && StageList.length > 0) {
            $.each(StageList, function (i) {
                var opt = document.createElement('option');
                opt.value = $(this)[0].Score;
                opt.text = $(this)[0].Stage;
                opt.setAttribute("style", "background-color:" + $(this)[0].IdentificationColor + ";");
                $('#ui_dllStageSort_Assign').append($("<option></option>").attr({ value: opt.value, style: "background-color:" + $(this)[0].IdentificationColor + ";" }).text(opt.text));
            });
        }
        else
            LmsDefaultFunctionUtil.AddOptionToDropDown(["ui_dllStageSort_Assign"], "0", "No Lms Stage", "red");
    },
    //Bind Lms Stage for quick filter
    BindLmsStageForQuickFilter: function () {
        if (StageList != null && StageList.length > 0) {
            $.each(StageList, function (i) {
                var opt = document.createElement('option');
                opt.value = $(this)[0].Score;
                opt.text = $(this)[0].Stage;
                opt.setAttribute("style", "background-color:" + $(this)[0].IdentificationColor + ";");
                $('#ui_dllStageSort').append($("<option></option>").attr({ value: opt.value, style: "background-color:" + $(this)[0].IdentificationColor + ";" }).text(opt.text));
            });
        }
        else
            LmsDefaultFunctionUtil.AddOptionToDropDown(["ui_dllStageSort"], "0", "No Lms Stage", "red");
    },
    //Bind Lms Stage for master filter or custom report
    BindLmsStageForMasterFilter: function () {
        if (StageList != null && StageList.length > 0) {
            $.each(StageList, function (i) {
                var opt = document.createElement('option');
                opt.value = $(this)[0].Score;
                opt.text = $(this)[0].Stage;
                opt.setAttribute("style", "background-color:" + $(this)[0].IdentificationColor + ";");
                $('#drp_Stages').append($("<option></option>").attr({ value: opt.value, style: "background-color:" + $(this)[0].IdentificationColor + ";" }).text(opt.text));
            });
        }
        else
            LmsDefaultFunctionUtil.AddOptionToDropDown(["drp_Stages"], "0", "No Lms Stage", "red");
    },
    //Bind Lms Stage for follow up
    BindStageDetailsForFollowUp: function () {
        if (StageList != null && StageList.length > 0) {
            $('#ui_drpdwn_filterbystages').empty();
            $('#ui_drpdwn_filterbystages').append("<option value='-1'>Select Stage</option>");
            $.each(StageList, function (i) {
                $('#ui_drpdwn_filterbystages').append("<option value='" + this.Score + "'>" + this.Stage + "</option>");
            });
        }
        else
            LmsDefaultFunctionUtil.AddOptionToDropDown(["ui_drpdwn_filterbystages"], "0", "No Lms Stage", "red");
    },
    //Get All Users
    GetUsersList: function () {
        $.ajax({
            url: "/Prospect/Leads/GetUser",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Getallusers': AdvancedSettingHandledbyStatus }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LmsDefaultInitialiseUtil.BindUserListForSingleAssign,
            error: ShowAjaxError
        });
    },
    GetUsersfollowupLists: function () {
        $.ajax({
            url: "/Prospect/Leads/GetUsersList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Getallusers': AdvancedSettingHandledbyStatus }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LmsDefaultInitialiseUtil.BindUserListForFollowUp,
            error: ShowAjaxError
        });
    },
    //Bind users or handled by for single assign
    BindUserListForSingleAssign: function (userDetails) {
        if (userDetails != null && userDetails != undefined && userDetails.length > 0) {
            UserList = userDetails;
            $.each(UserList, function (i) {
                //Binding only active users
                if (this.ActiveStatus) {
                    if (this.SeniorUserId != 0 || Plumb5UserId == this.UserInfoUserId)
                        $('#ui_drpdwn_AssignLead').append("<option value='" + this.UserInfoUserId + "'>" + this.FirstName + " (" + this.EmailId + ")</option>");
                }
            });
        }
        LmsDefaultInitialiseUtil.BindUserListForSingleAndMultipleAddFollowUp();

    },
    //BindUserListForFollowUp: function (userDetails) {
    //    if (userDetails != null && userDetails != undefined && userDetails.length > 0) {
    //        UserListforassign = userDetails;
    //        $.each(UserListforassign, function (i) {
    //            //Binding only active users
    //            if (this.ActiveStatus) {

    //                    $('#ui_drpdwn_AssignLead').append("<option value='" + this.UserInfoUserId + "'>" + this.FirstName + " (" + this.EmailId + ")</option>");
    //            }
    //        });
    //    }

    //},
    //Bind users or handled by for followp adding single or multiple assign
    BindUserListForSingleAndMultipleAddFollowUp: function () {
        if (UserList != null && UserList != undefined && UserList.length > 0) {
            $.each(UserList, function (i) {
                //Binding only active users
                if (this.ActiveStatus) {
                    $('#txtFollowUpSalesPerson').append("<option value='" + this.UserInfoUserId + "'>" + this.FirstName + " (" + this.EmailId + ")</option>");
                }
            });
        }
        LoadingDataValues.UsersList = true;
    },
    //Bind users or handled by for multiple assign
    BindUserListForMultipleAssign: function () {
        if (UserList != null && UserList != undefined && UserList.length > 0) {
            $.each(UserList, function (i) {
                //Binding only active users
                if (this.ActiveStatus) {
                    $('#ui_ddlUserList').append("<option value='" + this.UserInfoUserId + "'>" + this.FirstName + " (" + this.EmailId + ")</option>");
                }
            });
        }
    },
    //Bind users or handled by for Quick Filter
    BindUserListForQuickFilter: function () {
        if (UserList != null && UserList != undefined && UserList.length > 0) {
            //For filter data not checking active users but binding all data
            $.each(UserList, function (i) {
                $('#ui_dllHandledByUser').append("<option value='" + this.UserInfoUserId + "'>" + this.FirstName + " (" + this.EmailId + ")</option>");
            });
        }
    },
    //Bind users or handled by for Master Filter or Custom Report
    BindHandledByForMasterFilter: function () {
        if (UserList != null && UserList != undefined && UserList.length > 0) {
            //For filter data not checking active users but binding all data
            $.each(UserList, function (i) {
                $("#drp_handledBy").append("<option value='" + this.UserInfoUserId + "'>" + this.FirstName + " (" + this.EmailId + ")</option>");
            });
        }
    },
    //Bind users or handled by for Follow Up Page Handled By
    BindUserListForFollowUp: function (UserListforassign) {
        if (UserListforassign != null && UserListforassign != undefined && UserListforassign.length > 0) {
            $.each(UserListforassign, function (i) {
                //Binding only active users
                if (this.ActiveStatus) {
                    $('#ui_drpdwn_filterbyUser').append("<option value='" + this.UserInfoUserId + "'>" + this.FirstName + " (" + this.EmailId + ")</option>");

                }
            });
        }
    },
    //Get Lms Groups
    GetLmsGroupList: function () {
        $.ajax({
            url: "/Prospect/Leads/LmsGroupsList",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LmsDefaultInitialiseUtil.BindLmsGroupForMasterFilter,
            error: ShowAjaxError
        });
    },
    //Bind Lms Group for master filter or custom report
    BindLmsGroupForMasterFilter: function (response) {
        if (response != undefined && response != null && response.length > 0) {
            SourceList = response;
            $.each(SourceList, function () {
                $("#drp_Sources").append("<option value='" + this.LmsGroupId + "'>" + this.Name + "</option>");
            });
        }
        LoadingDataValues.LmsSourceList = true;
    },
    //Bind Lms Group for quick filter
    BindLmsGroupForQuickFilter: function () {
        if (SourceList != undefined && SourceList != null && SourceList.length > 0) {
            $.each(SourceList, function () {
                $("#ui_ddlSourceSort").append("<option value='" + this.LmsGroupId + "'>" + this.Name + "</option>");
            });
        }
    },
    //Get And Bind Contact Groups For Binding in Master Filter or Custom Report
    GetContactGroupName: function () {
        $.ajax({
            type: "POST",
            url: "/ManageContact/Contact/GetGroupName",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function (i) {
                    $("#ui_drp_ContactGroups").append("<option value='" + this.Id + "'>" + this.Name + "</option>");
                });
                LoadingDataValues.GroupList = true;
            },
            error: ShowAjaxError
        });
    },
    //Get And Bind All Forms For Binding in Master Filter or Custom Report
    GetAllFormsForMasterFilter: function () {
        $.ajax({
            url: "/Prospect/Reports/GetAllForms",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && response.length > 0) {
                    $.each(response, function () {
                        var formStatus = this.FormStatus == true ? 'Active' : 'Inactive';
                        $("#ui_drpdwn_Forms").append("<option value='" + this.Id + "'>" + this.FormIdentifier + " [ " + formStatus + " ]</option>");
                    });
                }
                LoadingDataValues.FormList = true;
            },
            error: ShowAjaxError
        });
    },
    //Get All Fields from Lead Properties For Binding in Master Filter or Custom Report
    GetLeadProperties: function () {
        /*   ShowPageLoading();*/
        $.ajax({
            url: "/Prospect/LeadProperties/GetMasterFilterColumns",
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LmsDefaultInitialiseUtil.BindLeadProperties,
            error: ShowAjaxError
        });
    },
    //Bind Fields from Lead Properties For Binding in Master Filter or Custom Report
    BindLeadProperties: function (response) {
        if (response != undefined && response != null && response.length > 0) {
            ContactAllPropertyList = response;
            let DropDownValue = `<option value="0">Select</option>`;
            $.each(response, function () {
                if (this.DisplayName != 'Stage' && this.DisplayName != 'Handled By')
                    DropDownValue += `<option value="${this.PropertyName}">${this.DisplayName}</option>`;
            });
            DropDownValue += `<option value="SearchKeyword">Search Keyword</option>`;
            DropDownValue += `<option value="PageUrl">Page Url</option>`;
            DropDownValue += `<option value="ReferrerUrl">Referrer Url</option>`;
            DropDownValue += `<option value="IsAdSenseOrAdWord">IsAdSenseOrAdWord</option>`;
            DropDownValue += `<option value="Place">Place</option>`;
            DropDownValue += `<option value="CityCategory">City</option>`;
            $("#drpFields_0").append(DropDownValue);
        }
        LoadingDataValues.LeadProperties = true;


        $("#drpFields_0").on("change", function (event) {
            LmsCustomReportPopUpUtil.GetSelectedFieldChange(this, '', 0);
        });
    },
    //Bind lmscustomfields for binding in master filter 
    Getlmscustomfields: function () {
        Lmscustomfielddetails = [];
        $("#drplmsFields_0").empty();
        $.ajax({
            url: "/Prospect/Leads/GetLMSCustomFields",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("#drplmsFields_0").append(`<option value="0">Select</option>`);
                if (response) {
                    Lmscustomfielddetails = response;
                    $.each(response, function () {
                        $("#drplmsFields_0").append(`<option value="${this.FieldName}">${this.FieldDisplayName}</option>`);

                    });
                }
                $("#drplmsFields_0").on("change", function (event) {
                    LmsCustomReportPopUpUtil.GetlmsSelectedFieldChange(this, '', 0);
                });
            },
            error: ShowAjaxError
        });
    },
    //Bind Advanced settings to bind handled by based on condition

    GetLmsAdvacedSettings: function () {
        $.ajax({
            url: "/Prospect/AdvancedSettings/GetLmAdvacedSettings",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'key': "HANDLEBY" }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var data = response[0];
                if (data !== undefined) {
                    AdvancedSettingHandledbyStatus = data.Value;
                }
                LmsDefaultInitialiseUtil.GetUsersList()

            },
            error: function (error) {
                HidePageLoading();
                // Your error handling logic here
            }
        });
    }
};

var PreContactGroupId = [];
var LmsDefaultFunctionUtil = {
    GetContactGroup: function () {

        chkArrayContactId = new Array();
        $(".selChk:checked").each(function () {
            chkArrayContactId.push($(this.getAttribute("lmscontactids")).selector);
        });

        if (chkArrayContactId.length > 0) {
            $.ajax({
                type: "POST",
                url: "/ManageContact/Contact/GetGroupNameByContacts",
                data: JSON.stringify({ 'contact': chkArrayContactId }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    $.each(response, function (i) {
                        if (PreContactGroupId.indexOf($(this)[0].Id) == -1) { PreContactGroupId.push($(this)[0].Id) };
                    });

                    LmsDefaultFunctionUtil.BindGroupName();
                },
                error: ShowAjaxError
            });
        }
    },
    BindGroupName: function () {
        var ulSGrp = $(".select2-selection__rendered");
        ulSGrp.empty();
        var ulGrp = $("#addgroupoperation");
        ulGrp.empty();

        $.ajax({
            type: "POST",
            url: "/ManageContact/Contact/GetGroupName",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function (i) {
                    var select = PreContactGroupId.indexOf(+$(this)[0].Id) > -1 ? "Selected" : "";
                    $("#addgroupoperation").append($('<option value="' + $(this)[0].Id + '" ' + select + '>' + $(this)[0].Name + '</option>'));
                });
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    HideCustomPopUp: function (Id) {
        $(".popupcontainer").addClass("hideDiv");
        $("#" + Id).addClass("hideDiv");
    },
    UpdateUpdatedDate: function (LmsGroupmemberId) {
        $("#ui_p_UpdatedDate_" + LmsGroupmemberId).html($.datepicker.formatDate("M dd yy", new Date()) + " " + PlumbTimeFormat(new Date()));
    },
    InitialiseCalenders: function () {
        $("#txtFollowUpDate").datepicker({
            changeMonth: true,
            changeYear: true,
            defaultDate: "+1d",
            prevText: "click for previous months",
            nextText: "click for next months",
            showOtherMonths: true,
            selectOtherMonths: false,
            minDate: new Date()
        });
    },
    InitializeTableHeader: function () {
        if (IsCheckBoxRequired) {
            //if ($("#dv_CheckBox").hasClass("hideDiv"))
            //    $("#dv_CheckBox").removeClass("hideDiv");
            noOfColumns = 7;
        }
        else {
            //if (!$("#dv_CheckBox").hasClass("hideDiv"))
            //    $("#dv_CheckBox").addClass("hideDiv");
            $("#dv_CheckBox").remove();
            noOfColumns = 6;
        }
    },
    AddOptionToDropDown: function (dropDownTag, value, text, uiStyle) {
        for (var index = 0; index < dropDownTag.length; index++) {
            $("#" + dropDownTag[index]).append("<option value='" + value + "'>" + text + "</option>");
            if (uiStyle.length > 0)
                $("#" + dropDownTag[index]).css("color", uiStyle);
        }
    },
    GetAgentNameByUserId: function (Id) {
        var userName = "NA";
        if (Adminuser == Id)
            userName = "Admin";
        else {
            for (var i = 0; i < UserList.length; i++) {
                if (UserList[i].UserInfoUserId == Id) {
                    userName = UserList[i].FirstName.length > 25 ? UserList[i].FirstName.substring(0, 25) + ".." : UserList[i].FirstName;
                    break;
                }
            }
        }
        return userName;
    },
    GetAgentEmailIdByUserId: function (Id) {
        var userEmailId = "";
        for (var i = 0; i < UserList.length; i++) {
            if (UserList[i].UserInfoUserId == Id) {
                userEmailId = UserList[i].EmailId;
                break;
            }
        }
        return userEmailId;
    },
    GetAgentPhoneNumberByUserId: function (Id) {
        var userPhoneNumber = "";
        for (var i = 0; i < UserList.length; i++) {
            if (UserList[i].UserInfoUserId == Id) {
                userPhoneNumber = UserList[i].MobilePhone;
                break;
            }
        }
        return userPhoneNumber;
    },
    InitialiseActionsTabClick: function () {
        $(".dropdown-menu.keepopen").click(function (e) {
            e.stopPropagation();
        });
    },
    InitialiseActionsClick: function () {
        $(".lmsdrpdwntabmenu").click(function () {
            let gettabcontent = $(this).attr("data-lmsactiontab");
            $(this).addClass("active");
            if (gettabcontent == "tabcontent-1") {
                $(this).siblings().removeClass("active");
                $(this).parent().next().next().addClass("hideDiv");
                $(this).parent().next().removeClass("hideDiv");
            }
            else {
                $(this).siblings().removeClass("active");
                $(this).parent().next().addClass("hideDiv");
                $(this).parent().next().next().removeClass("hideDiv");
            }
        });
    },
    RowCheckboxClick: function () {
        var checkBoxClickCount;
        $('.selChk').click(function () {
            checkBoxClickCount = $('.selChk').filter(':checked').length;

            if (checkBoxClickCount > 0) {
                $(".subdivWrap").addClass('showDiv');
            }
            else if (checkBoxClickCount <= 0 && CleanText($.trim($("#txt_searchemailphone").val())).length == 0 && $(".lmssourcefilterwrp").hasClass("hideDiv") && $(".lmsstagefilterwrp").hasClass("hideDiv") && $(".lmshandledfilterwrp").hasClass("hideDiv") && $(".filtwrpbar").hasClass("hideDiv")) {
                $(".subdivWrap").removeClass('showDiv');
            }
            $(".checkedCount").html(checkBoxClickCount);
        });
    },
    GetSelectedContactIds: function () {
        var contactListId = [];
        $(".selChk:checked").each(function () {
            contactListId.push(parseInt($(this).attr("lmscontactids")));
        });
        return contactListId;
    },
    GetSelectedLmsGroupMemberIds: function () {
        var LmsGroupMemberIds = [];

        $(".selChk:checked").each(function () {
            LmsGroupMemberIds.push(parseInt($(this).val()));
            lmscontactuseridgroupid.push($(this).attr("lmscontactuseridgroupid"));
        });
        return LmsGroupMemberIds;
    },
    GetSelectedLmsGroupId: () => {
        let LmsGroupIds = [];

        $(".selChk:checked").each(function () {
            LmsGroupIds.push(parseInt($(this).attr("lmsgroupids")));
        });
        return LmsGroupIds;
    },
    ClearAllCheckboxDivValues: function () {
        $(".checkedCount").html(0);
        $(".selchbxall,.selChk").prop("checked", false);
        $(".subdivWrap").removeClass("showDiv");
    },
    ReturnDateInFormat: function (dateValue) {
        var res = dateValue.split("/");
        var newDate = res[2] + '-' + res[0] + '-' + res[1];
        return newDate;
    },
    DifferenceOfTwoArrays: function (array1, array2) {
        var temp = [];
        array1 = array1.toString().split(',').map(Number);
        array2 = array2.toString().split(',').map(Number);

        for (var i in array1) {
            if (array2.indexOf(array1[i]) === -1) temp.push(array1[i]);
        }
        for (i in array2) {
            if (array1.indexOf(array2[i]) === -1) temp.push(array2[i]);
        }
        return temp.sort((a, b) => a - b);
    },
    AddDatesQuery: function () {
        filterLead.StartDate = FromDateTime;
        filterLead.EndDate = ToDateTime;
    },
    RemoveDateAndOrderByFilter: function () {
        filterLead.StartDate = filterLead.EndDate = "";
        filterLead.OrderBy = 3;
    },
    RemoveFollowUpClass: function (ContactId) {
        if ($("#ui_small_ViewDate_" + ContactId).hasClass("text-danger"))
            $("#ui_small_ViewDate_" + ContactId).removeClass("text-danger");
        else if ($("#ui_small_ViewDate_" + ContactId).hasClass("text-success"))
            $("#ui_small_ViewDate_" + ContactId).removeClass("text-success");
        else if ($("#ui_small_ViewDate_" + ContactId).hasClass("text-secondary"))
            $("#ui_small_ViewDate_" + ContactId).removeClass("text-secondary");
    },
    DropDownBinding: function (Id, BindValue) {
        var values = $.map($('#' + Id + ' option'), function (option) {
            if (BindValue.toLowerCase() == option.value.toLowerCase())
                return option.value;
        });
        if (values.length > 0)
            $("#" + Id).select2().val(values[0]).change();
    }
};

//Search Box By Email Or Phone Number Starts
var SearchBoxUtil = {
    SearchByEmailOrPhone: function () {
        ShowPageLoading();
        if ($.trim($("#txt_searchemailphone").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.Leads.SearchErrorValue);
            $("#txt_searchemailphone").focus();
            HidePageLoading();
            return false;
        }
        else {
            filterLead = getFilterLeadObject();
            var query = CleanText($.trim($("#txt_searchemailphone").val()));

            let propertynameColumn = $("#txt_searchemailphone").attr("propertyname");

            if (phoneNumberCheck) {
                filterLead.PhoneNumber = query;
            } else {
                filterLead[propertynameColumn] = query;
            }

            OffSet = 0;
            LmsDefaultFunctionUtil.RemoveDateAndOrderByFilter();
            LeadReportBindingUtil.GetMaxCount();
        }
    },
    SearchByEnterEmailOrPhone: function (e) {
        if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
            if (CleanText($.trim($("#txt_searchemailphone").val())).length == 0) {
                ShowErrorMessage(GlobalErrorList.ManageEmbeddedForm.SearchErrorValue);
                return false;
            }
            ShowPageLoading();
            if (window.location.pathname.includes('/Prospect/Leads')) {
                filterLead = getFilterLeadObject();
                var query = CleanText($.trim($("#txt_searchemailphone").val()));

                let propertynameColumn = $("#txt_searchemailphone").attr("propertyname");

                if (phoneNumberCheck) {
                    filterLead.PhoneNumber = query;
                } else {
                    filterLead[propertynameColumn] = query;
                }

                OffSet = 0;
                LmsDefaultFunctionUtil.RemoveDateAndOrderByFilter();
                LeadReportBindingUtil.GetMaxCount();
            }
            else {
                var regex = /^[0-9]+$/;

                //filterLead = getFilterLeadObject();
                var query = CleanText($.trim($("#txt_searchemailphone").val()));
                if (!query.match(regex))
                    filterLead.EmailId = query;
                else
                    filterLead.PhoneNumber = query;


                OffSet = 0;
                //LmsDefaultFunctionUtil.RemoveDateAndOrderByFilter();
                LeadReportBindingUtil.GetMaxCount();
            }

        }
    },
    RemoveSearchByEmailOrPhone: function (e) {
        if (e.which && e.which === 8 || e.keyCode && e.keyCode === 46)
            if ($("#txt_searchemailphone").val().length === 0) {
                ShowPageLoading();
                if (window.location.pathname.includes('/Prospect/Leads')) {
                    filterLead = getFilterLeadObject();
                    filterLead.OrderBy = 3;
                }
                else {
                    filterLead.PhoneNumber = '';
                    filterLead.EmailId = '';
                }

                LmsDefaultFunctionUtil.AddDatesQuery();
                LeadReportBindingUtil.GetMaxCount();
            }
    }
};

$("#SearchByEmailOrPhone").click(function () {
    SearchBoxUtil.SearchByEmailOrPhone();
});

$("#txt_searchemailphone").keypress(function (e) {
    SearchBoxUtil.SearchByEnterEmailOrPhone(e);
});

$("#txt_searchemailphone").keyup(function (e) {
    SearchBoxUtil.RemoveSearchByEmailOrPhone(e);
});
//Search Box By Email Or Phone Number Ends

//Follow Ups Page DropDown For Stage and User Filter Starts
$("#ui_drpdwn_filterbystages").on('change', function () {
    if (parseInt($("#ui_drpdwn_filterbystages").val()) != -1)
        filterLead.Score = $("#ui_drpdwn_filterbystages").val();
    else
        filterLead.Score = -1;
    ShowPageLoading();
    OffSet = 0;
    LeadReportBindingUtil.GetMaxCount();
});

$("#ui_drpdwn_filterbyUser").on('change', function () {
    if (parseInt($("#ui_drpdwn_filterbyUser").val()) > 0) {

        filterLead.UserInfoUserId = $("#ui_drpdwn_filterbyUser").val();
        filterLead.FollowUpUserIdList = $("#ui_drpdwn_filterbyUser").val();
    }
    else
        filterLead.UserInfoUserId = 0;
    ShowPageLoading();
    OffSet = 0;
    LeadReportBindingUtil.GetMaxCount();
});
//Follow Ups Page DropDown For Stage and User Filter Ends

$("#close-popup, #btnCancel, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
});

$("#cancelRowConfirm, #cancelBulkLeads, .close, #ui_btn_CancelAssignSingleStage, #ui_btn_CancelAssignSingleLead, #ui_btn_CancelAssignSingleLabel").click(function () {
    $("tr").removeClass("activeBgRow");
});

//Search text
$(".contsearchfocus")
    .on("focus", function () {
        $(this).parent().addClass("w-300");
    })
    .on("blur", function () {
        if ($(".contsearchfocus").val().length < 15)
            $(this).parent().removeClass("w-300");
    });

