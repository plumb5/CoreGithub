var userGroupList = [], EachUserDetails = [], userList = [];
var stageNameWithScoreOption = "", stageColor = [];
var allStageDetails = [];
var PhoneNumber, EmailId;
var AttachmentFileName = "";
var isClickToCallFromCalledId = false;
var FetchNext = 0;
var AttchmentAllFilesList = [], attchmentFileNames = [];

var lmsorderbyval = 1;
var FilterByScore = "";
var FilterByLmsGrp = "";
var FilterHandledBy = "";
var AllTemplateList = [];
var MailTemplatesList = [];
var myReports = 0;

var contactDetails = {
    UserInfoUserId: 0, LastModifyByUserId: 0, ContactId: 0, UserGroupId: 0, LmsGroupId: 0, Name: "", LastName: "", EmailId: "", PhoneNumber: "", AgeRange1: 0, AgeRange2: 0, Education: "",
    Gender: "", Occupation: "", MaritalStatus: "", Location: "", Interests: "", UtmTagSource: "", FirstUtmMedium: "", FirstUtmCampaign: "", FirstUtmTerm: "", FirstUtmContent: "", Unsubscribe: null,
    OptInOverAllNewsLetter: null, IsSmsUnsubscribe: null, SmsOptInOverAllNewsLetter: null, AccountType: "", DateRange1: "", DateRange2: "", IsAccountHolder: null, AccountOpenedSource: "",
    LastActivityLoginDate: null, LastActivityLoginSource: "", CustomerScore: "", AccountAmount: "", IsCustomer: null, IsMoneyTransferCustomer: null, IsReferred: null, IsGoalSaver: null,
    IsReferredOpenedAccount: null, IsComplaintRaised: null, ComplaintType: "", Remarks: "", ReminderDate: "", ToReminderPhoneNumber: "", ToReminderEmailId: "", Score: 0, SearchKeyword: "", PageUrl: "",
    ReferrerUrl: "", IsAdSenseOrAdWord: "", AgeRange: 0, Religion: "", AlternateEmailIds: "", AlternatePhoneNumbers: "", Address1: "", Address2: "", StateName: "", ZipCode: "", Country: "", CompanyName: "",
    CompanyWebUrl: "", CompanyAddress: "", Projects: "", DomainName: "", ContactSource: "", IsVerifiedMailId: -1, IsVerifiedContactNumber: -1, LeadLabel: "",
    CustomField1: "", CustomField2: "", CustomField3: "", CustomField4: "", CustomField5: "", CustomField6: "", CustomField7: "", CustomField8: "", CustomField9: "", CustomField10: "",
    CustomField11: "", CustomField12: "", CustomField13: "", CustomField14: "", CustomField15: "", CustomField16: "", CustomField17: "", CustomField18: "", CustomField19: "", CustomField20: "",
    CustomField21: "", CustomField22: "", CustomField23: "", CustomField24: "", CustomField25: "", CustomField26: "", CustomField27: "", CustomField28: "", CustomField29: "", CustomField30: "",
    CustomField31: "", CustomField32: "", CustomField33: "", CustomField34: "", CustomField35: "", CustomField36: "", CustomField37: "", CustomField38: "", CustomField39: "", CustomField40: "",
    CustomField41: "", CustomField42: "", CustomField43: "", CustomField44: "", CustomField45: "", CustomField46: "", CustomField47: "", CustomField48: "", CustomField49: "", CustomField50: "",
    CustomField51: "", CustomField52: "", CustomField53: "", CustomField54: "", CustomField55: "", CustomField56: "", CustomField57: "", CustomField58: "", CustomField59: "", CustomField60: ""
};

var LmsGroupId = 0, FollowUpStatus = -1;
var lmsFormFields = [];
var lmsInfo = { Id: 0, IdentifierName: "", DescriptionDetails: "", Idenitifer: "" };
var lead = {
    ContactId: 0, Name: "", EmailId: "", PhoneNumber: "", Remarks: "", ReminderDate: "", ToReminderEmailId: "", ToReminderPhoneNumber: "", Score: 0, SMSTemplateId: 0, SmsAlertScheduleDate: ""
};

var IsCheckBoxRequired = true, noOfColumns = 7;

var loadingDataValues = { ActiveEmailIds: false, LmsStageList: false, UsersList: false, LmsSourceList: false, MailTemplates: false, SmsTemplates: false, UserLoginDetails: false };

var LeadsUtil = {
    LoadingSymbol: function () {
        LoadingTimeInverval = setInterval(function () {
            if (loadingDataValues.ActiveEmailIds && loadingDataValues.LmsStageList && loadingDataValues.UsersList && loadingDataValues.LmsSourceList && loadingDataValues.MailTemplates && loadingDataValues.SmsTemplates && loadingDataValues.UserLoginDetails) {
                //HidePageLoading();
                clearInterval(LoadingTimeInverval);
            }
        }, 300);
    },
    BindActiveEmailId: function () {
        $.ajax({
            url: "/General/GetActiveEmailIds",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                loadingDataValues.ActiveEmailIds = true;

                if (response != undefined && response != null) {
                    $("#drpSendMailFromEmailId_lms, #ui_ddlFromEmailId").empty();
                    $("#drpSendMailFromEmailId_lms, #ui_ddlFromEmailId").append(`<option value="0">Select From EmailId</option>`);
                    $.each(response, function (i) {
                        $("#drpSendMailFromEmailId_lms, #ui_ddlFromEmailId").append("<option value='" + response[i] + "'>" + response[i] + "</option>");
                    });
                }
                LeadsUtil.IntializeMailTemplate();
            },
            error: ShowAjaxError
        });
    },
    IntializeMailTemplate: function () {
        $.ajax({
            url: "/General/GetAllTemplateList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (TemplateList) {
                loadingDataValues.MailTemplates = true;
                if (TemplateList != undefined && TemplateList != null && TemplateList.length > 0) {
                    $("#ui_ddlMailTemplate").empty();
                    $("#ui_ddlMailTemplate").append(`<option value="0">Select Template</option>`);
                    MailTemplatesList = TemplateList;
                    $.each(TemplateList, function () {
                        $("#ui_ddlMailTemplate").append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");
                    });
                }
                LeadsUtil.IntializeSmsTemplate();
            },
            error: ShowAjaxError
        });
    },
    IntializeSmsTemplate: function () {
        $.ajax({
            url: "/General/GetTemplateList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                loadingDataValues.SmsTemplates = true;
                AllTemplateList = response;
                if (response != undefined && response != null && response.length > 0) {
                    $("#ui_ddlSmsTemplate").empty();
                    $("#ui_ddlSmsTemplate").append(`<option value="0">Search Template</option>`);
                    $.each(response, function () {
                        $("#ui_ddlSmsTemplate").append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");
                    });
                }
                LeadsUtil.InitializeLmsStage();
            },
            error: ShowAjaxError
        });
    },
    InitializeLmsStage: function () {
        $.ajax({
            url: "/Prospect/Leads/GetStageScore",
            dataType: "json",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataFilter: function (data) { return data; },
            success: function (response) {
                loadingDataValues.LmsStageList = true;

                if (response.AllStages != null && response.AllStages.length > 0) {
                    allStageDetails = response.AllStages;
                }
                if (response.StagesList != null && response.StagesList.length > 0) {
                    $.each(response.StagesList, function (i) {
                        stageNameWithScoreOption += "<option value='" + $(this)[0].Score + "' style='background-color:" + $(this)[0].IdentificationColor + ";'>" + $(this)[0].Stage + "</option>";
                        stageColor.push($(this)[0].IdentificationColor);
                        var opt = document.createElement('option');
                        opt.value = $(this)[0].Score;
                        opt.text = $(this)[0].Stage;
                        opt.setAttribute("style", "background-color:" + $(this)[0].IdentificationColor + ";");
                        $('#ui_dllStageSort_Assign, #ui_dllStageSort, #ui_drpdwn_AssignStage').append($("<option></option>").attr({ value: opt.value, style: "background-color:" + $(this)[0].IdentificationColor + ";" }).text(opt.text));
                    });
                }
                else {
                    LeadsUtil.AddOptionToDropDown(["ui_dllStageSort"], "0", "No Lms Stage", "red");
                    LeadsUtil.AddOptionToDropDown(["ui_dllStageSort_Assign"], "0", "No Lms Stage", "red");
                    LeadsUtil.AddOptionToDropDown(["ui_drpdwn_AssignStage"], "0", "No Lms Stage", "red");
                }
                LeadsUtil.IntializeLmsGroupList();
            },
            error: ShowAjaxError
        });
    },
    IntializeLmsGroupList: function () {
        $.ajax({
            url: "/Prospect/Leads/LmsGroupsList",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                loadingDataValues.LmsSourceList = true;
                if (response != undefined && response != null && response.length > 0) {
                    $.each(response, function () {
                        $("#ui_Sourcelist").append("<option count=" + $(this).attr('LeadCount') + " grouptype=" + $(this)[0].GroupType + "  value=" + $(this)[0].LmsGroupId + ">" + $(this)[0].Name + "</option>");
                        $("#ui_ddlSourceSort").append("<option value=" + $(this)[0].LmsGroupId + ">" + $(this)[0].Name + "</option>");
                    });
                }
                LeadsUtil.IntializeUserLoginDetails();
            },
            error: ShowAjaxError
        });
    },
    IntializeUserLoginDetails: function () {
        $.ajax({
            url: "/CaptureForm/CommonDetailsForForms/GetUserLoginFullDetails",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                loadingDataValues.UserLoginDetails = true;
                if (response) {
                    EmailId = response.EmailId;
                    PhoneNumber = response.MobilePhone;
                }
                LeadsUtil.InitializeUsersList();
            },
            error: ShowAjaxError
        });
    },
    InitializeUsersList: function () {
        $.ajax({
            url: "/Prospect/Leads/GetUser",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (userDetails) {
                loadingDataValues.UsersList = true;

                if (userDetails != null && userDetails != undefined && userDetails.length > 0) {
                    $.each(userDetails, function (i) {
                        userList.push({ UserInfoUserId: $(this)[0].UserInfoUserId, EmailId: $(this)[0].EmailId, Name: $(this)[0].FirstName, PhoneNumber: $(this)[0].MobilePhone });
                        if ($(this)[0].ActiveStatus) {
                            EachUserDetails.push({ UserInfoUserId: $(this)[0].UserInfoUserId, EmailId: $(this)[0].EmailId, Name: $(this)[0].FirstName });
                            $('#ui_ddlUserList, #ui_drpdwn_AssignLead').append($("<option></option>").attr("value", $(this)[0].UserInfoUserId).text($(this)[0].FirstName + " (" + $(this)[0].EmailId + ")").attr("title", $(this)[0].EmailId));
                            $('#ui_dllHandledByUser, #txtFollowUpSalesPerson').append($("<option></option>").attr("value", $(this)[0].UserInfoUserId).text($(this)[0].FirstName + " (" + $(this)[0].EmailId + ")").attr("title", $(this)[0].EmailId));
                            if (FollowUpStatus > 0)
                                $('#ui_drpdwn_filterbyUser').append($("<option></option>").attr("value", $(this)[0].UserInfoUserId).text($(this)[0].FirstName).attr("title", $(this)[0].EmailId));
                        }
                    });
                }
                LeadsUtil.InitialiseCalenders();
                LeadsUtil.InitializeTableHeader();
            },
            error: ShowAjaxError
        });
    },
    InitialiseCalenders: function () {
        $("#txtFollowUpDate").datepicker({
            defaultDate: "+1d",
            prevText: "click for previous months",
            nextText: "click for next months",
            showOtherMonths: true,
            selectOtherMonths: false,
            minDate: new Date()
        });
        if (myReports == 0) {
            if (window.location.href.indexOf("/Prospect/Leads") > 0)
                LeadsUtil.IfNewIntializeDefault();
        }
    },
    IfNewIntializeDefault: function () {
        if (FollowUpStatus == 1 && !IsCheckBoxRequired && lmsorderbyval == 4)
            GetUTCDateTimeRangeForNext(1);
        else if ($.urlParam("LmsGroupId") != null && parseInt($.urlParam("LmsGroupId")) > 0)
            GetUTCDateTimeRange(5);
        //else if (window.location.href.indexOf("/Prospect/Leads") > 0)
        //    GetUTCDateTimeRange(2);
        else
            GetUTCDateTimeRange(2);
    },
    InitializeTableHeader: function () {
        if (IsCheckBoxRequired) {
            if ($("#dv_CheckBox").hasClass("hideDiv"))
                $("#dv_CheckBox").removeClass("hideDiv");
            noOfColumns = 7;
        }
        else {
            if (!$("#dv_CheckBox").hasClass("hideDiv"))
                $("#dv_CheckBox").addClass("hideDiv");
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
    GetAllStages: function () {
        $.ajax({
            url: "/Prospect/FollowUps/GetLeadCountByScore",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'FollowUpStatus': FollowUpStatus, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LeadsUtil.BindDropDownByScore,
            error: ShowAjaxError
        });
    },
    BindDropDownByScore: function (response) {
        response = JSON.parse(response);
        $('#ui_drpdwn_filterbystages').empty();
        var tdContentDropDown = "";
        if (response.length > 0) {
            $('#ui_StageListCount').empty();
            for (var i = 0; i < response.length; i++) {
                tdContentDropDown += "<option value='" + response[i].Score + "'>" + response[i].Stage + " </option>";
            }
            $('#ui_drpdwn_filterbystages').append("<option value='-1'>Select Stage</option>" + tdContentDropDown);
        }
    },
    GetAgentNameByUserId: function (Id) {
        var userName = "";
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].UserInfoUserId == Id) {
                userName = userList[i].Name.length > 25 ? userList[i].Name.substring(0, 25) + ".." : userList[i].Name;
                break;
            }
        }
        return userName;
    },
    UpdateLeadSeen: function (ContactId, Name) {
        $.ajax({
            url: "/Prospect/Leads/UpdateLeadSeen",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'ContactId': ContactId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    $("#ui_div_ContactName_" + ContactId).empty();
                    $("#ui_div_ContactName_" + ContactId).html("<span class='nameTxt'>" + Name + "</span>");
                }
                ShowContactUCP("", "", ContactId);
            },
            error: ShowAjaxError
        });
    },
    BindingContent: function (response) {
        var checkboxdetails;
        if (IsCheckBoxRequired) {
            checkboxdetails = `<td>
                    <div class='custom-control custom-checkbox'>
                    <input type='checkbox' class='custom-control-input selChk' id='lmscontact_${response.ContactId}' value='${response.ContactId}' lmsgroupid='${response.LmsGroupId}'>
                    <label class='custom-control-label' for='lmscontact_${response.ContactId}'></label>
                    </div>
                    </td>`;
        }

        var LabelStatusValue = "<td id='lblStatus_" + response.ContactId + "' class='text-center'><div id='ui_div_lblStatus_" + response.ContactId + "' class='lmslblwrp'><span></span><span onclick=\"AssignSingleLabel(" + response.ContactId + ",'Select');\" class='icon ion-android-more-vertical lmseditlabel ContributePermission'></span></div></td>";
        if (response.LeadLabel != null && response.LeadLabel != "" && response.LeadLabel.length > 0) {
            if (response.LeadLabel.toLowerCase() == "hot")
                LabelStatusValue = "<td id='lblStatus_" + response.ContactId + "' class='text-center'><div id='ui_div_lblStatus_" + response.ContactId + "' class='lmslblwrp'><span class='lmslabelhot'>" + response.LeadLabel + "</span><span onclick=\"AssignSingleLabel(" + response.ContactId + ",'Hot');\" class='icon ion-android-more-vertical lmseditlabel ContributePermission'></span></div></td>";
            else if (response.LeadLabel.toLowerCase() == "warm")
                LabelStatusValue = "<td id='lblStatus_" + response.ContactId + "' class='text-center'><div id='ui_div_lblStatus_" + response.ContactId + "' class='lmslblwrp'><span class='lmslabelwarm'>" + response.LeadLabel + "</span><span onclick=\"AssignSingleLabel(" + response.ContactId + ",'Warm');\" class='icon ion-android-more-vertical lmseditlabel ContributePermission'></span></div></td>";
            else if (response.LeadLabel.toLowerCase() == "cold")
                LabelStatusValue = "<td id='lblStatus_" + response.ContactId + "' class='text-center'><div id='ui_div_lblStatus_" + response.ContactId + "' class='lmslblwrp'><span class='lmslabelcold'>" + response.LeadLabel + "</span><span onclick=\"AssignSingleLabel(" + response.ContactId + ",'Cold');\" class='icon ion-android-more-vertical lmseditlabel ContributePermission'></span></div></td>";
        }

        var Name = "";
        var NameStartingLetter = "NA";
        if (response.Name != null && response.Name != "" && response.Name.length > 0) {
            Name = response.Name;
            if (Name.length > 25)
                Name = Name.substring(0, 25) + "..";

            NameStartingLetter = Name.charAt(0);
        }

        var UCP = response.IsNewLead == 1 ? `LeadsUtil.UpdateLeadSeen(${response.ContactId},"${Name}");` : `ShowContactUCP("","",${response.ContactId});`;
        var isNewLead = response.IsNewLead == 1 ? `<sup class='newtext'>New</sup>` : ``;
        var leadUserName = ((response.UserName == null) ? LeadsUtil.GetAgentNameByUserId(response.UserInfoUserId) : (response.UserName.length > 30) ? `${response.UserName.substring(0, 30)}..` : `${response.UserName}`);
        var leadEmailId = ((response.EmailId == null) ? `` : (response.EmailId.length > 25) ? `${response.EmailId.substring(0, 25)}..` : `${response.EmailId}`);
        var leadPhoneNumber = ((response.PhoneNumber == null) ? `` : (response.PhoneNumber.length > 25) ? `${response.PhoneNumber.substring(0, 25)}..` : `${response.PhoneNumber}`);

        var stage = response.Score;
        var sample = JSLINQ(allStageDetails).Where(function () {
            return (this.Score == stage);
        });

        var stagestyle = ``, StageName = ``;
        if (sample.items[0] != null && sample.items[0] != "" && sample.items[0] != undefined) {
            StageName = `${sample.items[0].Stage}`;
            stagestyle = "style='background-color:" + sample.items[0].IdentificationColor + "; color:" + getReadableForeColor(sample.items[0].IdentificationColor) + ";'";
        }

        var reminderDate= response.ReminderDate!=null?$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response.ReminderDate))+' '+PlumbTimeFormat(GetJavaScriptDateObj(response.ReminderDate)):'NA';
        var followupdate=response.FollowUpDate!=null?$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response.FollowUpDate))+' ' +PlumbTimeFormat(GetJavaScriptDateObj(response.FollowUpDate)): 'NA';

        var content = `${checkboxdetails}${LabelStatusValue}
                <td class='text-left h-100'><div class='lmsactiondrpdwn'><div class='nameWrap'><div class='nameAlpWrap'>
                <span class='nameAlpha' onclick='${UCP}'>${NameStartingLetter}</span></div>
                <div id='ui_div_ContactName_${response.ContactId}' userid='${response.UserInfoUserId}' class='nameTxtWrap'><span class='nameTxt'>${Name}</span>${isNewLead}</div></div>
                <div class='tdcreatedraft'><div class='dropdown'><button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='icon ion-android-more-vertical mr-0'></i></button>
                <div class='dropdown-menu dropdown-menu-right keepopen' aria-labelledby='filterbycontacts'><div class='lmsdrpdwntabwrp'><div class='lmsdrpdwntab'>
                <div data-lmsactiontab='tabcontent-1' class='lmsdrpdwntabmenu active'>Actions</div><div data-lmsactiontab='tabcontent-2' class='lmsdrpdwntabmenu' >Contact</div></div>
                <div class='lmsactiontabcont'><div class='list-group'>
                <a data-lmspopupswindcont='lmseditlead' onclick='LeadsUtil.EditLeadDetails(${response.ContactId},"${response.Name}","${response.EmailId}","${response.PhoneNumber}");' data-lmspopuswind='Edit Lead' href='javascript:void(0);' class='list-group-item list-group-item-action lmspopuslftwind ContributePermission'>Edit Lead</a>
                <a data-lmspopupswindcont='lmsaddfollowup' onclick='LeadsUtil.AddFollowUp(${response.ContactId},"${response.Name}","${response.EmailId}");' data-lmspopuswind='Add Follow-up' href = 'javascript:void(0);' class='list-group-item list-group-item-action lmspopuslftwind ContributePermission'>Add Follow-Up/Reminder</a>
                <a href='javascript:void(0);' onclick='LeadsUtil.ViewFollowUp(${response.ContactId},"${response.Name}","${response.EmailId}");' class='list-group-item list-group-item-action'>View Follow-Up</a>
                <a href='javascript:void(0);' onclick ='LeadsUtil.UpdateFollowUpCompleted(${response.ContactId});' class='list-group-item list-group-item-action ContributePermission'>Follow-Up Completed</a>
                <a data-lmspopupswindcont='lmsaddnotes' onclick='AddNotes(${response.ContactId},"${response.Name}","${response.EmailId}");' data-lmspopuswind='Add Notes' href='javascript:void(0);' class='list-group-item list-group-item-action lmspopuslftwind ContributePermission'>Add Notes</a>
                <a href='javascript:void(0);' onclick='LeadHistory.History(${response.ContactId},"${response.Name}");' class='list-group-item list-group-item-action lmsuserdelpopus FullControlPermission'>History</a>
                <a href='javascript:void(0);' onclick='Delete(${response.ContactId});' class='list-group-item list-group-item-action lmsuserdelpopus FullControlPermission'>Delete</a>
                </div></div><div class='lmsactiontabcont hideDiv'><div class='list-group'>
                <a data-lmspopupswindcont='lmssendmail' onclick='SendMailToContactUtil.SendMail(${response.ContactId});' data-lmspopuswind='Send Mail' href='javascript:void(0);' class='list-group-item list-group-item-action lmspopuslftwind ContributePermission' ><i class='fa fa-envelope'></i>Send Mail</a>
                <a data-lmspopupswindcont='lmssendsms' onclick ='SendSMSToContactUtil.SendSms(${response.ContactId});' data-lmspopuswind='Send SMS' href='javascript:void(0);' class='list-group-item list-group-item-action lmspopuslftwind ContributePermission' ><i class='fa fa-comment'></i>Send SMS</a>
                <a data-lmspopupswindcont='lmsclicktocall' onclick='SendCallToContactUtil.SendCall(${response.ContactId});' data-lmspopuswind='Make Call' href='javascript:void(0);' class='list-group-item list-group-item-action lmspopuslftwind ContributePermission'><i class='fa fa-phone'></i>Make Call</a>
                </div></div></div></div></div></div></div><div class='lmshandledwrp pt-1'>
                <small class='text-color-queued font-11 mr-2 w-50'>Handled By:</small><p class='mb-0 text-bold' id='ui_p_LeadAgent_${response.ContactId}'>${leadUserName}<i onclick='AssignSingleLead(${response.ContactId},${response.UserInfoUserId});' class='ion ion-ios-compose-outline lmshandlednamedrp ContributePermission'></i></p>
                </div></td><td id='ui_txtEmail_${response.ContactId}'>${leadEmailId}</td><td>${leadPhoneNumber}</td>
                <td class='text-center'><div id='ui_div_LeadStage_${response.ContactId}' class='lmslblwrp'><span class='lmslblstage' ${stagestyle} id='ui_txtStage_${response.ContactId}'>${StageName}</span><span onclick='AssignSingleStage(${response.ContactId},${response.Score});' class='icon ion-android-more-vertical lmschangestage ContributePermission'></span></div></td>
                <td id='ui_td_UpdatedDate_${response.ContactId}'><p class ="m-0">${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response.UpdatedDate))} ${PlumbTimeFormat(GetJavaScriptDateObj(response.UpdatedDate))}
                </p>
                 <small class ="m-0 viewreminddate">Reminder /
                                                            Follow-up<i class ="icon ion-calendar ml-1"></i>
                                                            <div class ="dashtooltipwrp">
                                                                <div class ="dashtooltiptit">Reminder / Follow Up Date
                                                                </div>
                                                                <div class ="dashtooltipbody">
                                                                    <p class ="m-1 font-12"><b>Reminder: </b>
                                                                       ${reminderDate}</p>
                                                                    <p class ="m-1 font-12"><b>Follow-Up: </b>
                                                                    ${followupdate}</p>
                                                                </div>
                                                            </div>
                                                        </small>
                </td>`;
        return content;

    },
    UpdateUpdatedDate: function (ContactId) {
        $("#ui_td_UpdatedDate_" + ContactId).html($.datepicker.formatDate("M dd yy", new Date()) + " " + PlumbTimeFormat(new Date()));
    },
    MaxCount: function () {
        $.ajax({
            url: "/Prospect/Leads/GetMaxCount",
            type: 'Post',
            data: JSON.stringify({ 'contact': contactDetails, 'accountId': Plumb5AccountId, 'OrderBy': lmsorderbyval, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'FilterByScore': FilterByScore, 'FilterByLmsGrp': FilterByLmsGrp, 'FilterHandledBy': FilterHandledBy, 'FollowUpStatus': FollowUpStatus }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = response;
                LeadsUtil.BindFollowUpCount(TotalRowCount);
                if (TotalRowCount > 0) {
                    LeadsUtil.GetReport();
                }
                else {
                    SetNoRecordContent('ui_tblReportData', noOfColumns, 'ui_tbodyReportData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    BindFollowUpCount: function (count) {
        if (FollowUpStatus == 1)
            $("#ui_span_PlanFollowUpsCount").html(count);
        if (FollowUpStatus == 2)
            $("#ui_span_CompFollowUpsCount").html(count);
        if (FollowUpStatus == 3)
            $("#ui_span_MissFollowUpsCount").html(count);
    },
    GetReport: function () {
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/Prospect/Leads/GetLeads",
            type: 'Post',
            data: JSON.stringify({ 'contact': contactDetails, 'OffSet': OffSet, 'FetchNext': FetchNext, 'accountId': Plumb5AccountId, 'OrderBy': lmsorderbyval, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'FilterByScore': FilterByScore, 'FilterByLmsGrp': FilterByLmsGrp, 'FilterHandledBy': FilterHandledBy, 'FollowUpStatus': FollowUpStatus }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                LeadsUtil.BindReport(response);
            },
            error: ShowAjaxError
        });
    },
    BindReport: function (response) {
        SetNoRecordContent('ui_tblReportData', noOfColumns, 'ui_tbodyReportData');
        if (response != undefined && response != null) {
            CurrentRowCount = response.length;

            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            var reportTableTrs = "";
            $.each(response, function () {
                reportTableTrs += "<tr id='ui_div_" + this.ContactId + "'>" + LeadsUtil.BindingContent(this) + "</tr>";
            });
            $("#ui_tblReportData").removeClass('no-data-records');
            $("#ui_tbodyReportData").html(reportTableTrs);
            ShowExportDiv(true);
            ShowPagingDiv(true);
            $('.searchCampWrap').show();
            LeadsUtil.InitialiseActionsTabClick();
            LeadsUtil.InitialiseActionsClick();
            RowCheckboxClick();
        }
        else {
            $('.searchCampWrap').hide();
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
        CheckAccessPermission("Prospect");
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
    GetLeadDetailsForEdit: function (ContactId, EmailId, PhoneNumber) {
        contactDetails = new Object();
        contactDetails.ContactId = ContactId;
        contactDetails.EmailId = EmailId != "null" ? EmailId : null;
        contactDetails.PhoneNumber = PhoneNumber != "null" ? PhoneNumber : null;

        $.ajax({
            url: "/Prospect/Leads/GetLeadDetailsForEdit",
            type: 'POST',
            data: JSON.stringify({ 'contact': contactDetails, 'OffSet': OffSet, 'FetchNext': FetchNext, 'accountId': Plumb5AccountId, 'OrderBy': lmsorderbyval, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'FilterByScore': FilterByScore, 'FilterByLmsGrp': FilterByLmsGrp, 'FilterHandledBy': FilterHandledBy, 'FollowUpStatus': FollowUpStatus }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && response != undefined) {
                    $.each(response, function (i) {
                        if ($(this)[0].Name !== null)
                            $("#ui_txt_FirstName").val($(this)[0].Name);
                        if ($(this)[0].LastName !== null)
                            $("#ui_txt_LastName").val($(this)[0].LastName);
                        if ($(this)[0].EmailId !== null)
                            $("#ui_txt_EmailId").val($(this)[0].EmailId);
                        if ($(this)[0].AlternateEmailIds !== null)
                            $("#ui_txt_AlternateEmailId").val($(this)[0].AlternateEmailIds);
                        if ($(this)[0].PhoneNumber !== null)
                            $("#ui_txt_PhoneNumber").val($(this)[0].PhoneNumber);
                        if ($(this)[0].AlternatePhoneNumbers !== null)
                            $("#ui_txt_AlternatePhoneNumber").val($(this)[0].AlternatePhoneNumbers);
                        if ($(this)[0].Address1 !== null)
                            $("#ui_txt_Address1").val($(this)[0].Address1);
                        if ($(this)[0].Address2 !== null)
                            $("#ui_txt_Address2").val($(this)[0].Address2);
                        if ($(this)[0].StateName !== null)
                            $("#ui_txt_State").val($(this)[0].StateName);
                        if ($(this)[0].Country !== null)
                            $("#ui_drpdwn_Country").select2().val($(this)[0].Country).trigger('change');
                        if ($(this)[0].PostalCode !== null)
                            $("#ui_txt_PostalCode").val($(this)[0].ZipCode);
                        if ($(this)[0].Age !== null)
                            $("#ui_txt_DateOfBirth").val($.datepicker.formatDate("yy-mm-dd", GetJavaScriptDateObj($(this)[0].Age)));
                        if ($(this)[0].Gender !== null)
                            $("#ui_drpdwn_Gender").select2().val($(this)[0].Gender).trigger('change');
                        if ($(this)[0].MaritalStatus !== null)
                            $("#ui_drpdwn_MartialStatus").select2().val($(this)[0].MaritalStatus).trigger('change');
                        if ($(this)[0].Education !== null)
                            $("#ui_txt_Educaton").val($(this)[0].Education);
                        if ($(this)[0].Occupation !== null)
                            $("#ui_txt_Occupation").val($(this)[0].Occupation);
                        if ($(this)[0].Interests !== null)
                            $("#ui_txt_Interests").val($(this)[0].Interests);
                        if ($(this)[0].Location !== null)
                            $("#ui_txt_Location").val($(this)[0].Location);
                        if ($(this)[0].Religion !== null)
                            $("#ui_txt_Religion").val($(this)[0].Religion);
                        if ($(this)[0].CompanyName !== null)
                            $("#ui_txt_CompanyName").val($(this)[0].CompanyName);
                        if ($(this)[0].CompanyWebUrl !== null)
                            $("#ui_txt_CompanyWebURL").val($(this)[0].CompanyWebUrl);
                        if ($(this)[0].DomainName !== null)
                            $("#ui_txt_DomainName").val($(this)[0].DomainName);
                        if ($(this)[0].CompanyAddress !== null)
                            $("#ui_txt_CompanyAddress").val($(this)[0].CompanyAddress);
                        if ($(this)[0].Projects !== null)
                            $("#ui_txt_Projects").val($(this)[0].Projects);
                        if ($(this)[0].Score !== null)
                            $("#ui_drpdwn_Stage").select2().val($(this)[0].Score).trigger('change');
                        if ($(this)[0].LeadLabel !== null)
                            $("#ui_drpdwn_LeadLabel").select2().val($(this)[0].LeadLabel).trigger('change');
                        if ($(this)[0].UserInfoUserId !== null)
                            $("#ui_drpdwn_HandledBy").select2().val($(this)[0].UserInfoUserId).trigger('change');

                        lmsGroupId = $(this)[0].LmsGroupId;
                        handledBy = $(this)[0].UserInfoUserId;

                        if (contactExtraFields.length > 0) {
                            for (var j = 0; j < contactExtraFields.length; j++) {
                                if (contactExtraFields[j].FieldType === 1 || contactExtraFields[j].FieldType === 2 || contactExtraFields[j].FieldType === 6) {
                                    if (contactExtraFields[j].FieldType === 1 && $(this)[0]["CustomField" + (j + 1)] !== null && $(this)[0]["CustomField" + (j + 1)] !== undefined)
                                        $("#ui_txt_CustomField_" + contactExtraFields[j].Id).val($(this)[0]["CustomField" + (j + 1)]);
                                    if (contactExtraFields[j].FieldType === 2 && $(this)[0]["CustomField" + (j + 1)] !== null && $(this)[0]["CustomField" + (j + 1)] !== undefined)
                                        $("#ui_txtArea_CustomField_" + contactExtraFields[j].Id).val($(this)[0]["CustomField" + (j + 1)]);
                                    if (contactExtraFields[j].FieldType === 6 && $(this)[0]["CustomField" + (j + 1)] !== null && $(this)[0]["CustomField" + (j + 1)] !== undefined)
                                        $("#ui_dateTime_CustomField" + contactExtraFields[j].Id).val($(this)[0]["CustomField" + (j + 1)]);
                                }
                                else if (contactExtraFields[j].FieldType === 3 && $(this)[0]["CustomField" + (j + 1)] !== null && $(this)[0]["CustomField" + (j + 1)] !== undefined && $(this)[0]["CustomField" + (j + 1)].length > 0) {
                                    $("#ui_drpdwn_CustomField_" + contactExtraFields[j].Id).val($(this)[0]["CustomField" + (j + 1)]);
                                }
                                else if (contactExtraFields[j].FieldType === 4 && $(this)[0]["CustomField" + (j + 1)] !== null && $(this)[0]["CustomField" + (j + 1)] !== undefined && $(this)[0]["CustomField" + (j + 1)].length > 0) {
                                    $("input:radio[name='ui_rad_CustomField" + contactExtraFields[j].Id + "'][value='" + $(this)[0]["CustomField" + (j + 1)] + "']").prop("checked", true);
                                }
                                else if (contactExtraFields[j].FieldType === 5 && $(this)[0]["CustomField" + (j + 1)] !== null && $(this)[0]["CustomField" + (j + 1)] !== undefined && $(this)[0]["CustomField" + (j + 1)].length > 0) {
                                    var checkedData = $(this)[0]["CustomField" + (j + 1)].split("|");
                                    for (var a = 0; a < checkedData.length; a++)
                                        $("input:checkbox[name='ui_chk_CustomField" + contactExtraFields[j].Id + "'][value='" + $.trim(checkedData[a]) + "']").prop("checked", true);
                                }
                            }
                        }
                    });
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    ValidateFollowUpDetails: function () {
        if (parseInt($("#txtFollowUpSalesPerson").val()) === 0) {
            ShowErrorMessage(GlobalErrorList.Leads.FollowUpUserSelectionError);
            HidePageLoading();
            return false;
        }

        if ($("#txtFollowUpDate").val().length === 0) {
            ShowErrorMessage(GlobalErrorList.Leads.EnterFollowUpDateError);
            HidePageLoading();
            return false;
        }

        var today = new Date();
        var enteredDate = $("#txtFollowUpDate").val() + " " + $("#ui_ddl_FollowUpTime").val() + ":00";
        var currentDate = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        if (Date.parse(enteredDate) < Date.parse(currentDate)) {
            ShowErrorMessage(GlobalErrorList.Leads.FollowUpDateError);
            HidePageLoading();
            return false;
        }

        if ($("#txtFollowUpContent").val().length === 0) {
            ShowErrorMessage(GlobalErrorList.Leads.EnterFollowUpContentError);
            HidePageLoading();
            return false;
        }

        if ($("#ui_setremainderDiv").is(":checked")) {
            if ($("#lmsagntrememl").is(":checked")) {
                if (CleanText($.trim($("#ui_setRemainderEmailId").val())).length == 0) {
                    ShowErrorMessage(GlobalErrorList.Leads.SetRemainderEmailId);
                    HidePageLoading();
                    return false;
                }

                if (!regExpEmail.test(CleanText($.trim($("#ui_setRemainderEmailId").val())))) {
                    ShowErrorMessage(GlobalErrorList.Leads.SetRemainderEmailId);
                    HidePageLoading();
                    return false;
                }

            } else if ($("#lmsagntremsms").is(":checked")) {
                if (CleanText($.trim($("#ui_setRemainderPhoneNumber").val())).length == 0) {
                    ShowErrorMessage(GlobalErrorList.Leads.SetRemainderPhoneNumber);
                    HidePageLoading();
                    return false;
                }
            } else if ($("#lmsagntremboth").is(":checked")) {
                if (CleanText($.trim($("#ui_setRemainderEmailId").val())).length == 0) {
                    ShowErrorMessage(GlobalErrorList.Leads.SetRemainderEmailId);
                    HidePageLoading();
                    return false;
                }

                if (!regExpEmail.test(CleanText($.trim($("#ui_setRemainderEmailId").val())))) {
                    ShowErrorMessage(GlobalErrorList.Leads.SetRemainderEmailId);
                    HidePageLoading();
                    return false;
                }

                if (CleanText($.trim($("#ui_setRemainderPhoneNumber").val())).length == 0) {
                    ShowErrorMessage(GlobalErrorList.Leads.SetRemainderPhoneNumber);
                    HidePageLoading();
                    return false;
                }

            } else {
                ShowErrorMessage(GlobalErrorList.Leads.NoSetRemainderChecked);
                HidePageLoading();
                return false;
            }

            if (CleanText($.trim($("#ui_remainderdate").val())).length > 0) {
                let todayremainder = new Date();
                let enteredremainderDate = $("#ui_remainderdate").val() + " " + $("#ui_remainderdateTime").val() + ":00";
                let currentremainderDate = (todayremainder.getMonth() + 1) + '/' + todayremainder.getDate() + '/' + todayremainder.getFullYear() + " " + todayremainder.getHours() + ":" + todayremainder.getMinutes() + ":" + todayremainder.getSeconds();
                if (Date.parse(enteredremainderDate) < Date.parse(currentremainderDate)) {
                    ShowErrorMessage(GlobalErrorList.Leads.SetRemainderDateTime);
                    HidePageLoading();
                    return false;
                }
            } else {
                ShowErrorMessage(GlobalErrorList.Leads.SetRemainderDateTime);
                HidePageLoading();
                return false;
            }

            var enteredFollowDate = $("#txtFollowUpDate").val() + " " + $("#ui_ddl_FollowUpTime").val() + ":00";
            var enteredRemainderDate = $("#ui_remainderdate").val() + " " + $("#ui_remainderdateTime").val() + ":00";
            if (Date.parse(enteredFollowDate) < Date.parse(enteredRemainderDate)) {
                ShowErrorMessage(GlobalErrorList.Leads.SetRemainderDateTimeLesser);
                HidePageLoading();
                return false;
            }
        }

        return true;
    },
    ViewFollowUp: function (ContactId, Name, EmailId) {
        ////Removed LmsSource By Arnab - 2021-02-13 10:13:53.170 P5-507
        //$("#dv_AssignSalesPerson,#dv_LmsNotes,#dv_LmsSource,#dv_AddFollowUp,#dv_AssignStage,#ui_divSendCallPopUp,#dv_CreateLead,#ui_divSendMailPopUp,#dv_FilterContacts").addClass("hideDiv");
        //$("#dv_AssignSalesPerson,#dv_LmsNotes,#dv_AddFollowUp,#dv_AssignStage,#ui_divSendCallPopUp,#dv_CreateLead,#ui_divSendMailPopUp,#dv_FilterContacts").addClass("hideDiv");
        ////Removed LmsSource By Arnab - 2021-02-13 10:13:53.170 P5-507
        $("#ui_div_" + ContactId).addClass("activeBgRow");
        $(".dropdown-menu").removeClass("show");
        //$("#dv_ViekwFollowUpDetails").removeClass("hideDiv");
        $.ajax({
            url: "/Prospect/Leads/GetLeadFollowUpData",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ContactId': ContactId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status) {
                    $(".popuptitle h6").html("VIEW FOLLOW-UP");
                    ////Removed LmsSource By Arnab - 2021-02-13 10:13:53.170 P5-507
                    //$("#dv_AssignSalesPerson,#dv_LmsNotes,#dv_LmsSource,#dv_AddFollowUp,#dv_AssignStage,#ui_divSendCallPopUp,#dv_CreateLead,#ui_divSendMailPopUp,#dv_FilterContacts").addClass("hideDiv");
                    //$("#dv_AssignSalesPerson,#dv_LmsNotes,#dv_AddFollowUp,#dv_AssignStage,#ui_divSendCallPopUp,#dv_CreateLead,#ui_divSendMailPopUp,#dv_FilterContacts").addClass("hideDiv");
                    ////Removed LmsSource By Arnab - 2021-02-13 10:13:53.170 P5-507
                    var ContactDetails = Name != "null" && EmailId != "null" ? "" + Name + " - (" + EmailId + ")" : Name != "null" && EmailId == "null" ? "" + Name + "" : Name == "null" && EmailId != "null" ? "" + EmailId + "" : "";
                    $(".popupsubtitle").html(ContactDetails);
                    $("#lbl_FollowUpDate,#lbl_FollowUpUserId,#lbl_LeadHandledByUserId,#lbl_FollowUpContent,#lbl_FollowUpUpdatedDate,#lbl_FollowUpCreatedDate,#lbl_FollowUpStatus").html("");

                    LeadsUtil.BindFollowUpDetails(response.contactfollowUpsDetails, ContactId);
                    HidePageLoading();
                }
                else if (!response.Status) {
                    ShowErrorMessage(GlobalErrorList.Leads.NoFollowUpExists);
                    $("#ui_div_" + ContactId).removeClass("activeBgRow");
                    HidePageLoading();
                    return false;
                }
            },
            error: ShowAjaxError
        });
    },
    BindFollowUpDetails: function (response) {
        if (response != null) {
            $("#lbl_FollowUpDate").html($.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response.FollowUpDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(response.FollowUpDate)));

            var userinfouserid = response.UserInfoUserId;

            var sample = JSLINQ(EachUserDetails).Where(function () {
                return (this.UserInfoUserId == userinfouserid);
            });

            if (sample.items[0] != null && sample.items[0] != "" && sample.items[0] != undefined) {
                $("#lbl_LeadHandledByUserId").html(sample.items[0].EmailId);
            }

            var followupuserinfouserid = response.FollowUpUserId;

            var sample = JSLINQ(EachUserDetails).Where(function () {
                return (this.UserInfoUserId == followupuserinfouserid);
            });

            if (sample.items[0] != null && sample.items[0] != "" && sample.items[0] != undefined) {
                $("#lbl_FollowUpUserId").html(sample.items[0].EmailId);
            }

            var FollowUpStatusDetails = response.FollowUpStatus == 1 ? "Planned" : response.FollowUpStatus == 2 ? "Completed" : response.FollowUpStatus == 3 ? "Missed" : "";

            $("#lbl_FollowUpStatus").html(FollowUpStatusDetails);
            $("#lbl_FollowUpContent").html(response.FollowUpContent);
            if (response.FollowUpUpdatedDate != null && response.FollowUpUpdatedDate != undefined)
                $("#lbl_FollowUpUpdatedDate").html($.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response.FollowUpUpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(response.FollowUpUpdatedDate)));
            else
                $("#lbl_FollowUpUpdatedDate").html("NA");
            if (response.FollowUpCreatedDate != null && response.FollowUpCreatedDate != undefined)
                $("#lbl_FollowUpCreatedDate").html($.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response.FollowUpCreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(response.FollowUpCreatedDate)));
            else
                $("#lbl_FollowUpCreatedDate").html("NA");

            $("#dv_ViewFollowUpDetails").removeClass("hideDiv");
        }
    },
    GetLastNotes: function (ContactId) {
        $.ajax({
            url: "/Prospect/Leads/GetNoteList",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'contactId': ContactId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    $("#ui_tbodyNotes").empty();
                    $("#ui_dvLastNotes").removeClass('hideDiv');
                    $.each(response, function (i) {
                        let attachment = this.Attachment != null && this.Attachment != undefined && this.Attachment.length > 0 ? '<a target="_blank" href="https://p5email-email-template-images.s3.ap-south-1.amazonaws.com/ClientImages/' + this.Attachment + '">' + this.Attachment + '</a>' : "";
                        let UserName = this.UserInfoUserId != null && this.UserInfoUserId > 0 ? LeadsUtil.GetAgentNameByUserId(this.UserInfoUserId) : "NA";
                        $("#ui_tbodyNotes").append("<tr><td class='text-left'>" + this.Content + "<p class='lmsdateshow'>" + UserName + "</p>" + "<p class='lmsdateshow'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.Date)) + "</p>" + attachment + "</td></tr>");
                    });
                }
                else
                    $("#ui_dvLastNotes").addClass('hideDiv');
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    AddFollowUp: function (ContactId, Name, EmailId) {
        $("#ui_div_" + ContactId).addClass("activeBgRow");
        $(".dropdown-menu").removeClass("show");
        //$(".popupcontainer").removeClass("hideDiv");
        $(".popuptitle h6").html("ADD FOLLOW-UP");
        $("#dv_AddFollowUp").removeClass("hideDiv");
        ////Removed LmsSource By Arnab - 2021-02-13 10:13:53.170 P5-507
        //$("#dv_AssignSalesPerson,#dv_LmsNotes,#dv_LmsSource,#dv_AddFollowUp,#dv_AssignStage,#ui_divSendCallPopUp,#dv_CreateLead,#ui_divSendMailPopUp,#dv_FilterContacts").addClass("hideDiv");
        //$("#dv_AssignSalesPerson,#dv_LmsNotes,#dv_AddFollowUp,#dv_AssignStage,#ui_divSendCallPopUp,#dv_CreateLead,#ui_divSendMailPopUp,#dv_FilterContacts").addClass("hideDiv");
        ////Removed LmsSource By Arnab - 2021-02-13 10:13:53.170 P5-507
        var ContactDetails = Name != "null" && EmailId != "null" ? "" + Name + " - (" + EmailId + ")" : Name != "null" && EmailId == "null" ? "" + Name + "" : Name == "null" && EmailId != "null" ? "" + EmailId + "" : "";
        $(".popupsubtitle").html(ContactDetails);
        $("#btn_AddFollowUp").removeAttr("ContactId");
        $("#btn_AddFollowUp").attr("ContactId", ContactId);
        $("#txtFollowUpSalesPerson").val(0);
        $("#txtFollowUpDate,#txtFollowUpContent,#ui_setRemainderEmailId,#ui_setRemainderPhoneNumber,#ui_remainderdate").val("");
        $("#ui_ddl_FollowUpTime,#ui_remainderdateTime").val("10:00");
        $("#lmsagntrememl,#lmsagntremsms,#lmsagntremboth").prop("checked", false);
        if ($("#ui_setremainderDiv").is(":checked")) {
            $("#ui_setremainderDiv").click();
        }
    },
    ValidateImageAndContent: function () {
        if ($("#txtRemarks").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.Leads.NotesValidationError);
            $("#txtRemarks").focus();
            return false;
        }
        return true;
    },
    EditLeadDetails: function (ContactId, Name, EmailId, PhoneNumber) {
        $("#ui_div_" + ContactId).addClass("activeBgRow");
        ShowPageLoading();
        $(".dropdown-menu").removeClass("show");
        $('#ui_btn_SubmitCreateContact').attr("BindType", "EDIT");
        ContactManageUtil.GetContactDetailsForUpdate(ContactId, '', '');
    },
    UpdateFollowUpCompleted: function (ContactId) {
        $("#ui_div_" + ContactId).addClass("activeBgRow");
        $("#confirmfollowupcomplete").modal("show");
        $("#submitFollowupCompleted").attr("ContactId", ContactId);
    }
};

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    if (!IsCheckBoxRequired)
        LeadsUtil.GetAllStages();
    LeadsUtil.MaxCount();
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    LeadsUtil.GetReport();
}

var checkBoxClickCount, addGroupNameList;
function RowCheckboxClick() {
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
}

function AssignSingleLabel(ContactId, Label) {
    $("#ui_div_" + ContactId).addClass("activeBgRow");
    $("#ui_drpdwn_AssignLabel").val(Label);
    $("#ui_btn_AssignSingleLabel").attr("ContactId", ContactId);
    $("#lmsAssignlabel").modal();
}

function AssignSingleLead(ContactId, UserId) {
    $("#ui_div_" + ContactId).addClass("activeBgRow");
    $("#ui_drpdwn_AssignLead").val(UserId);
    $("#ui_btn_AssignSingleLead").attr("ContactId", ContactId);
    $("#lmsAssignLead").modal();
}

function AssignSingleStage(ContactId, Score) {
    $("#ui_div_" + ContactId).addClass("activeBgRow");
    $("#ui_drpdwn_AssignStage").val(Score);
    $("#ui_btn_AssignSingleStage").attr("ContactId", ContactId);
    $("#ui_btn_AssignSingleStage").attr("Score", Score);
    $("#lmsAssignStage").modal();
}

$("#ui_btn_AssignSingleLabel").click(function () {
    if ($("#ui_drpdwn_AssignLabel").val() == 'Select') {
        $("#lmsAssignlabel").modal('hide');
        ShowErrorMessage(GlobalErrorList.Leads.AssignLabelSelectionError);
        return false;
    }
    ShowPageLoading();
    var contactId = $("#ui_btn_AssignSingleLabel").attr("ContactId");
    var LeadList = [];
    LeadList.push(contactId);
    var LabelValue = $("#ui_drpdwn_AssignLabel").val();
    $.ajax({
        url: "/Prospect/Leads/UpdateLeadLabel",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ContactIds': LeadList, 'LabelValue': LabelValue }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#lmsAssignlabel").modal('hide');
            if (response.Status) {
                ShowSuccessMessage(GlobalErrorList.Leads.AssignLabelSuccessStatus);
                $("#ui_div_lblStatus_" + contactId).empty();
                var LabelStatusValue = "";
                if (LabelValue.toLowerCase() == "hot")
                    LabelStatusValue = "<span class='lmslabelhot'>" + LabelValue + "</span><span onclick=\"AssignSingleLabel(" + contactId + ",'Hot');\" class='icon ion-android-more-vertical lmseditlabel'></span>";
                else if (LabelValue.toLowerCase() == "warm")
                    LabelStatusValue = "<span class='lmslabelwarm'>" + LabelValue + "</span><span onclick=\"AssignSingleLabel(" + contactId + ",'Warm');\" class='icon ion-android-more-vertical lmseditlabel'></span>";
                else if (LabelValue.toLowerCase() == "cold")
                    LabelStatusValue = "<span class='lmslabelcold'>" + LabelValue + "</span><span onclick=\"AssignSingleLabel(" + contactId + ",'Cold');\" class='icon ion-android-more-vertical lmseditlabel'></span>";
                $("#ui_div_lblStatus_" + contactId).html(LabelStatusValue);
                LeadsUtil.UpdateUpdatedDate(contactId);
            }
            else
                ShowErrorMessage(GlobalErrorList.Leads.AssignLabelFailureStatus);
            $("#ui_div_" + contactId).removeClass("activeBgRow");
            $("#ui_btn_AssignSingleLabel").removeAttr("ContactId");
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});

$("#ui_btn_AssignSingleLead").click(function () {
    if (parseInt($("#ui_drpdwn_AssignLead").val()) === 0) {
        $("#lmsAssignLead").modal('hide');
        ShowErrorMessage(GlobalErrorList.Leads.AssignLeadSelectionError);
        return false;
    }
    ShowPageLoading();
    var contactId = $("#ui_btn_AssignSingleLead").attr("ContactId");
    var LeadList = [];
    LeadList.push(contactId);
    var UserInfoUserId = parseInt($("#ui_drpdwn_AssignLead").val());
    $.ajax({
        url: "/Prospect/Leads/BulkAssignSalesPerson",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ContactIds': LeadList, 'UserInfoUserId': UserInfoUserId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#lmsAssignLead").modal('hide');
            if (response.Status) {
                ShowSuccessMessage(response.TotalAssignmentDone + GlobalErrorList.Leads.AssignLeadSuccessStatus);
                $("#ui_p_LeadAgent_" + contactId).empty();
                var userName = LeadsUtil.GetAgentNameByUserId(UserInfoUserId);
                $("#ui_p_LeadAgent_" + contactId).html(((userName == null) ? "" : (userName.length > 25) ? (userName.substring(0, 25) + "..") : userName) + "<i onclick=\"AssignSingleLead(" + contactId + "," + UserInfoUserId + ");\" class='ion ion-ios-compose-outline lmshandlednamedrp'></i>");
                LeadsUtil.UpdateUpdatedDate(contactId);
            }
            else
                ShowErrorMessage(GlobalErrorList.Leads.AssignLeadFailureStatus);
            $("#ui_div_" + contactId).removeClass("activeBgRow");
            $("#ui_btn_AssignSingleLead").removeAttr("ContactId");
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});

$("#ui_btn_AssignSingleStage").click(function () {

    var contactId = parseInt($("#ui_btn_AssignSingleStage").attr("ContactId"));

    if (parseInt($("#ui_drpdwn_AssignStage").val()) === -1) {
        $("#lmsAssignStage").modal('hide');
        $("#ui_div_" + contactId).removeClass("activeBgRow");
        ShowErrorMessage(GlobalErrorList.Leads.AssignStageSelectionError);
        return false;
    }

    var oldSCore = parseInt($("#ui_btn_AssignSingleStage").attr("Score"));
    var Score = parseInt($("#ui_drpdwn_AssignStage").val());

    if (oldSCore == Score) {
        $("#lmsAssignStage").modal('hide');
        $("#ui_div_" + contactId).removeClass("activeBgRow");
        ShowErrorMessage(GlobalErrorList.Leads.AssignStageAlreadyExisting);
        return false;
    }

    var UserInfoUserId = parseInt($("#ui_div_ContactName_" + contactId).attr('userid'));
    var leademailid = $("#ui_txtEmail_" + contactId).html();

    var stages = new Array();

    var sample = JSLINQ(allStageDetails).Where(function () {
        return (this.Score == oldSCore);
    });

    if (sample.items[0] != null && sample.items[0] != "" && sample.items[0] != undefined)
        stages.push(sample.items[0].Stage);

    stages.push($("#ui_drpdwn_AssignStage option:selected").text());

    ShowPageLoading();

    var lead = new Object();
    lead.ContactId = contactId;
    lead.Score = Score;

    $.ajax({
        url: "/Prospect/Leads/UpdateStage",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'mLContact': lead, 'stages': stages, 'leadEmailId': leademailid, 'UserInfoUserId': UserInfoUserId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#lmsAssignStage").modal('hide');
            if (response.Status) {
                ShowSuccessMessage(GlobalErrorList.Leads.AssignStageSuccessStatus);

                $("#ui_div_LeadStage_" + contactId).empty();

                var sample = JSLINQ(allStageDetails).Where(function () {
                    return (this.Score == Score);
                });
                var stagestyle = "", StageName = "";
                if (sample.items[0] != null && sample.items[0] != "" && sample.items[0] != undefined) {
                    StageName = sample.items[0].Stage;
                    stagestyle = "style='background-color:" + sample.items[0].IdentificationColor + "; color:" + getReadableForeColor(sample.items[0].IdentificationColor) + ";'";
                }

                $("#ui_div_LeadStage_" + contactId).html("<span class='lmslblstage' " + stagestyle + " id = 'ui_txtStage_" + contactId + "' > " + StageName + "</span > <span onclick=\"AssignSingleStage(" + contactId + "," + Score + ");\" class='icon ion-android-more-vertical lmschangestage'></span>");

                if (response.AssignedUserInfoUserId > 0) {
                    $("#ui_p_LeadAgent_" + contactId).empty();
                    var userName = LeadsUtil.GetAgentNameByUserId(response.AssignedUserInfoUserId);
                    $("#ui_p_LeadAgent_" + contactId).html(((userName == null) ? "" : (userName.length > 25) ? (userName.substring(0, 25) + "..") : userName) + "<i onclick=\"AssignSingleLead(" + contactId + "," + response.AssignedUserInfoUserId + ");\" class='ion ion-ios-compose-outline lmshandlednamedrp'></i>");
                }
                LeadsUtil.UpdateUpdatedDate(contactId);
            }
            else
                ShowErrorMessage(GlobalErrorList.Leads.AssignStageFailureStatus);

            $("#ui_div_" + contactId).removeClass("activeBgRow");
            $("#ui_btn_AssignSingleStage").removeAttr("ContactId");
            $("#ui_btn_AssignSingleStage").removeAttr("Score");
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});

$("#submitFollowupCompleted").click(function () {
    ShowPageLoading();
    var ContactId = $("#submitFollowupCompleted").attr("ContactId");
    $(".dropdown-menu").removeClass("show");
    var LeadList = [];
    LeadList.push(ContactId);
    $.ajax({
        url: "/Prospect/Leads/UpdateFollowUpCompleted",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ContactIds': LeadList }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status)
                ShowSuccessMessage(GlobalErrorList.Leads.FollowUpCompletedSuccess);
            else
                ShowErrorMessage(GlobalErrorList.Leads.FollowUpCompletedError);

            $("#ui_div_" + ContactId).removeClass("activeBgRow");
            $("#submitFollowupCompleted").removeAttr("ContactId");
            HidePageLoading();
            if (FollowUpStatus != -1)
                setTimeout(function () { window.location.reload() }, 500);
        },
        error: ShowAjaxError
    });
});

$("#cancelFollowupCompleted").click(function () {
    $("#confirmfollowupcomplete").modal("hide");
    var ContactId = $("#submitFollowupCompleted").attr("ContactId");
    $("#ui_div_" + ContactId).removeClass("activeBgRow");
    $("#submitFollowupCompleted").removeAttr("ContactId");
});

function AddNotes(ContactId, Name, EmailId) {
    $("#ui_div_" + ContactId).addClass("activeBgRow");
    LeadsUtil.GetLastNotes(ContactId);
    $(".dropdown-menu").removeClass("show");
    //$(".popupcontainer").removeClass("hideDiv");
    $(".popuptitle h6").html("ADD NOTES");
    $("#dv_LmsNotes").removeClass("hideDiv");
    ////Removed LmsSource By Arnab - 2021-02-13 10:13:53.170 P5-507
    //$("#dv_AssignSalesPerson,#dv_LmsNotes,#dv_LmsSource,#dv_AddFollowUp,#dv_AssignStage,#ui_divSendCallPopUp,#dv_CreateLead,#ui_divSendMailPopUp,#dv_FilterContacts").addClass("hideDiv");
    //$("#dv_AssignSalesPerson,#dv_LmsNotes,#dv_AddFollowUp,#dv_AssignStage,#ui_divSendCallPopUp,#dv_CreateLead,#ui_divSendMailPopUp,#dv_FilterContacts").addClass("hideDiv");
    ////Removed LmsSource By Arnab - 2021-02-13 10:13:53.170 P5-507
    var ContactDetails = Name != "null" && EmailId != "null" ? "" + Name + " - (" + EmailId + ")" : Name != "null" && EmailId == "null" ? "" + Name + "" : Name == "null" && EmailId != "null" ? "" + EmailId + "" : "";
    $(".popupsubtitle").html(ContactDetails);
    $("#btnSaveNotesDetails").removeAttr("ContactId");
    $("#btnSaveNotesDetails").attr("ContactId", ContactId);
    ClearNotesField();
}

function ClearNotesField() {
    $("#txtRemarks").val("");
    $("#ui_NotesAttachmentfiles").val("");
    $("#ui_lbl_NotesAttachment").html("Choose File");
    AttachmentFileName = "";
}

$("#ui_NotesAttachmentfiles").change(function () {
    ShowPageLoading();
    var files = $("#ui_NotesAttachmentfiles").get(0).files;
    if (files.length > 0) {
        $("#ui_lbl_NotesAttachment").html(files[0].name);
        var data = new FormData();
        data.append("UploadedImage", files[0]);
        $.ajax({
            type: "POST",
            url: "/CaptureForm/Create/UploadFile",
            contentType: false,
            processData: false,
            data: data,
            success: function (response) {
                if (response != undefined && response.filePath != undefined && response.filePath.length > 0) {
                    AttachmentFileName = response.filePath.substring(response.filePath.lastIndexOf('/') + 1);
                    ShowSuccessMessage(GlobalErrorList.Leads.NotesFileUploadSuccess);
                }
                else
                    ShowErrorMessage(GlobalErrorList.Leads.NotesFileUploadError);

                HidePageLoading();
            }
        });
    }
});

$("#btnSaveNotesDetails").click(function () {
    ShowPageLoading();
    if (!LeadsUtil.ValidateImageAndContent()) {
        HidePageLoading();
        return false;
    }
    var leadNotes = { Content: "", ContactId: 0, Attachment: "", UserInfoUserId: 0 };

    leadNotes.ContactId = $("#btnSaveNotesDetails").attr("ContactId");
    leadNotes.Content = $("#txtRemarks").val();
    leadNotes.Attachment = AttachmentFileName;
    leadNotes.UserInfoUserId = Plumb5UserId;

    $.ajax({
        url: "/Prospect/Leads/UpdateNotes",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'notes': leadNotes }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.Leads.NotesSuccessStatus);
                LeadsUtil.GetLastNotes(leadNotes.ContactId);
                //HideCustomPopUp("dv_LmsNotes");
            }
            else
                ShowErrorMessage(GlobalErrorList.Leads.NotesValidationError);
            ClearNotesField();
            //$("#ui_div_" + leadNotes.ContactId).removeClass("activeBgRow");
        },
        error: ShowAjaxError
    });
});

HideCustomPopUp = function (Id) {
    $(".popupcontainer").addClass("hideDiv");
    $("#" + Id).addClass("hideDiv");
};

$("#btn_AddFollowUp").click(function () {
    ShowPageLoading();
    if (!LeadsUtil.ValidateFollowUpDetails()) {
        HidePageLoading();
        return false;
    }
    var LeadList = [];

    if ($("#btn_AddFollowUp").attr("ContactId") != undefined)
        LeadList.push(parseInt($("#btn_AddFollowUp").attr("ContactId")));
    else
        LeadList = GetSelectedContactIds();

    var FollowUpContent = $("#txtFollowUpContent").val();
    var FollowUpUserId = $("#txtFollowUpSalesPerson").val();
    var followUpDate = ReturnDateInFormat($("#txtFollowUpDate").val()) + " " + $("#ui_ddl_FollowUpTime").val().toString() + ":00";
    var followUpDateUTCFormat = ConvertDateTimeToUTC(followUpDate);
    var FollowUpdate = followUpDateUTCFormat.getFullYear() + '-' + AddingPrefixZero((followUpDateUTCFormat.getMonth() + 1)) + '-' + AddingPrefixZero(followUpDateUTCFormat.getDate()) + " " + AddingPrefixZero(followUpDateUTCFormat.getHours()) + ":" + AddingPrefixZero(followUpDateUTCFormat.getMinutes()) + ":" + AddingPrefixZero(followUpDateUTCFormat.getSeconds());
    var FollowUpStatus = 1;

    var remainder = new Object();
    if ($("#ui_setremainderDiv").is(":checked")) {
        remainder.ToReminderEmailId = CleanText($.trim($("#ui_setRemainderEmailId").val()));
        remainder.ToReminderPhoneNumber = CleanText($.trim($("#ui_setRemainderPhoneNumber").val()));
        let remainderDateTime = ReturnDateInFormat($("#ui_remainderdate").val()) + " " + $("#ui_remainderdateTime").val().toString() + ":00";
        let remainderDateTimeUTCFormat = ConvertDateTimeToUTC(remainderDateTime);
        remainder.ReminderDate = remainderDateTimeUTCFormat.getFullYear() + '-' + AddingPrefixZero((remainderDateTimeUTCFormat.getMonth() + 1)) + '-' + AddingPrefixZero(remainderDateTimeUTCFormat.getDate()) + " " + AddingPrefixZero(remainderDateTimeUTCFormat.getHours()) + ":" + AddingPrefixZero(remainderDateTimeUTCFormat.getMinutes()) + ":" + AddingPrefixZero(remainderDateTimeUTCFormat.getSeconds());
    }

    if (LeadList.length > 0) {
        $.ajax({
            url: "/Prospect/Leads/SaveFollowUps",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ContactIds': LeadList, 'FollowUpContent': FollowUpContent, 'FollowUpStatus': FollowUpStatus, 'FollowUpdate': FollowUpdate, 'FollowUpUserId': FollowUpUserId, 'SetRemainder': remainder }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    if (response.SuccessCount > 0 && response.SetRemainderStatus) {
                        ShowSuccessMessage((GlobalErrorList.Leads.FallowUpRemainder).replace("{*1*}", LeadList.length).replace("{*2*}", response.SuccessCount));
                    } else if (response.SuccessCount > 0 && response.SetRemainderStatus == false) {
                        ShowSuccessMessage((GlobalErrorList.Leads.FallowUpAdded).replace("{*1*}", LeadList.length).replace("{*2*}", response.SuccessCount));
                    } else if (response.SuccessCount == 0 && response.SetRemainderStatus) {
                        ShowSuccessMessage(GlobalErrorList.Leads.UnableToAddFollowRmainder);
                    } else {
                        ShowErrorMessage(GlobalErrorList.Leads.FollowUpFailureStatus);
                    }
                }
                else {
                    ShowErrorMessage(GlobalErrorList.Leads.SomethingWentWrong);
                }

                for (var i = 0; i < LeadList.length; i++)
                    $("#ui_div_" + LeadList[i]).removeClass("activeBgRow");

                HideCustomPopUp("dv_AddFollowUp");
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
    clearAll();
});

//Add Follow Up End

GetSelectedContactIds = function () {
    var contactListId = [];
    $(".selChk:checked").each(function () {
        contactListId.push(parseInt($(this).val()));
    });
    return contactListId;
};

//Start Part of Delete Single Leads
var DeleteContactId = 0;
function Delete(ContactId) {
    $("#ui_div_" + ContactId).addClass("activeBgRow");
    DeleteContactId = ContactId;
    $("#deletelmsleads").modal("show");
}

$("#deleteRowConfirm").click(function () {
    var ContactInfo = [];
    ContactInfo.push(DeleteContactId);
    $.ajax({
        url: "/Prospect/Leads/DeleteSelectedLeads",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ContactIds': ContactInfo }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                --CurrentRowCount;
                --TotalRowCount;
                $("#ui_div_" + DeleteContactId).remove();
                PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
                ShowSuccessMessage(GlobalErrorList.Leads.DeleteSuccessStatus);
                if (CurrentRowCount <= 0 && TotalRowCount <= 0) {
                    $('.searchCampWrap').hide();
                    ShowExportDiv(false);
                    ShowPagingDiv(false);
                    SetNoRecordContent('ui_tblReportData', 7, 'ui_tbodyReportData');
                }
                else if (CurrentRowCount <= 0 && TotalRowCount > 0) {
                    //CallBackFunction();
                }
            }
            else {
                ShowErrorMessage(GlobalErrorList.Leads.DeleteFailureStatus);
                $("#ui_div_" + DeleteContactId).removeClass("activeBgRow");
                HidePageLoading();
                return false;
            }
        },
        error: ShowAjaxError
    });
});

//End Part Of Delete Leads
$("#close-popup, #btnCancel, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
});

//Set Remainder
$('input[name="lmsagntremindtype"]').click(function () {
    let getlmsremdval = $('input[name="lmsagntremindtype"]:checked').val();
    $(".lmsremindcontwrp").removeClass("hideDiv");
    if (getlmsremdval == "email") {
        $(".lmssmsremd").addClass("hideDiv");
        $(".lmsemlremd").removeClass("hideDiv");
    } else if (getlmsremdval == "sms") {
        $(".lmsemlremd").addClass("hideDiv");
        $(".lmssmsremd").removeClass("hideDiv");
    } else {
        $(".lmsemlremd, .lmssmsremd").removeClass("hideDiv");
    }
});

$("#ui_setremainderDiv").click(function () {
    $(".lmsremindcontwrp").addClass("hideDiv");
    if ($("#ui_setRemainderDivPop").is(":visible")) {
        $("#ui_setRemainderDivPop").addClass("hideDiv");
    } else {
        $("#ui_setRemainderDivPop").removeClass("hideDiv");
        $("input[name='lmsagntremindtype']").prop("checked", false);
    }
});

$("#ui_remainderdate,#txtFollowUpDate").datepicker({
    defaultDate: "+1d",
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: false,
    minDate: new Date()
});

$("#txtFollowUpSalesPerson").change(function () {
    $("#ui_setRemainderEmailId,#ui_setRemainderPhoneNumber").val('');
    let selectedId = this.value;
    if (selectedId != 0) {
        let eachUser = JSLINQ(userList).Where(function () {
            return (this.UserInfoUserId == selectedId);
        });
        $("#ui_setRemainderEmailId").val(eachUser.items[0].EmailId);
        $("#ui_setRemainderPhoneNumber").val(eachUser.items[0].PhoneNumber);
    }
});

$("#cancelRowConfirm, #cancelBulkLeads, .close, #ui_btn_CancelAssignSingleStage, #ui_btn_CancelAssignSingleLead, #ui_btn_CancelAssignSingleLabel").click(function () {
    $("tr").removeClass("activeBgRow");
});

//Get formatted date
function ReturnDateInFormat(dateValue) {
    var res = dateValue.split("/");
    var newDate = res[2] + '-' + res[0] + '-' + res[1];
    return newDate;
}

function AddingPrefixZero(n) {
    return (n < 10) ? ("0" + n) : n;
}

var dateFrom = "", dateTo = "", stroreOrderByVal = 100;
function HideDateCalenderInLeadPage() {
    //$(".lmscustomdate").addClass("hideDiv");
    //$(".subcustdatewrp").addClass("hideDiv");
    dateFrom = FromDateTime;
    dateTo = ToDateTime;
    stroreOrderByVal = lmsorderbyval;
    FromDateTime = "", ToDateTime = "", lmsorderbyval = 100;
}

function ShowDateCalenderInLeadPage() {
    //$(".lmscustomdate").removeClass("hideDiv");
    //$(".subcustdatewrp").addClass("hideDiv");
    FromDateTime = dateFrom;
    ToDateTime = dateTo;
    lmsorderbyval = stroreOrderByVal;
    dateFrom = "", dateTo = "", stroreOrderByVal = 100;
}

