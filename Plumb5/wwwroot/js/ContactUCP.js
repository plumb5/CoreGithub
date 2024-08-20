var excludePropertyName = ["neworrepeat", "machineid", "deviceid", "lastweblocation", "lastmobilelocation", "lastwebvisiteddate", "lastmobilevisiteddate", "assignedgroups", "name", "emailid", "phonenumber", "userinfouserid", "contactid", "lmsgroupid", "score", "formid", "lastname", "lmsassignedgroups", "pageurl", "scoreupdateddate", "lastpurchase", "totallifetimetrancount", "totallifetimepurchasevalue", "memberid", "createddate", "formname", "purchaseplandate"];
var DateFieldFormate = ["createddate", "fblastupdates", "lastpurchase", "lastmessagesent", "recentonlinevisit", "subscribeddate", "updateddate", "smssubscribeddate", "ussdsubscribeddate", "appdownloadeddate", "appregistereddate", "lastactivitylogindate", "projectdate", "loyaltypointsperiod", "tcsversionaccepted", "reminderdate", "mailalertscheduledate", "smsalertscheduledate", "mailunsubscribedate", "smsunsubscribedate", "ussdunsubscribedate", "sitevisitdate", "purchaseplandate", "scoreupdateddate", "followupdate", "followupupdateddate", "leadlabelupdateddate", "followupcreateddate"];
var ContactCustomFields = ["customfield1", "customfield2", "customfield3", "customfield4", "customfield5", "customfield6", "customfield7", "customfield8", "customfield9", "customfield10", "customfield11", "customfield12", "customfield13", "customfield14", "customfield15", "customfield16", "customfield17", "customfield18", "customfield19", "customfield20", "customfield21", "customfield22", "customfield23", "customfield24", "customfield25", "customfield26", "customfield27", "customfield28", "customfield29", "customfield30", "customfield31", "customfield32", "customfield33", "customfield34", "customfield35", "customfield36", "customfield37", "customfield38", "customfield39", "customfield40", "customfield41", "customfield42", "customfield43", "customfield44", "customfield45", "customfield46", "customfield47", "customfield48", "customfield49", "customfield50", "customfield51", "customfield52", "customfield53", "customfield54", "customfield55", "customfield56", "customfield57", "customfield58", "customfield59", "customfield60", "customfield61", "customfield62", "customfield63", "customfield64", "customfield65", "customfield66", "customfield67", "customfield68", "customfield69", "customfield70", "customfield71", "customfield72", "customfield73", "customfield74", "customfield75", "customfield76", "customfield77", "customfield78", "customfield79", "customfield80", "customfield81", "customfield82", "customfield83", "customfield84", "customfield85", "customfield86", "customfield87", "customfield88", "customfield89", "customfield90", "customfield91", "customfield92", "customfield93", "customfield94", "customfield95", "customfield96", "customfield97", "customfield98", "customfield99", "customfield100"];
var ContactDate = ["age"];
var ContactExtraFieldsForUCP = [];
var mLUCPVisitor = { MachineId: "", DeviceId: "", ContactId: 0, FromDate: null, ToDate: null };
var customeventoverviewid = 0;
var UCPEventExtraFiledsName = [];
var customeventoverviewidfortriffer = 0;
var dropdowntriggerstatus = 0;
var clearTimeIntervalofUCP;
var ContactidForNote = 0;
var IsUCPLoading = {
    IsCustomDateAndBindLoading: false,
    IsMchineIdsByContactId: false,
    IsDeviceIdsByContactId: false,
    IsAbout: false,
    IsUserName: false,
    IsWebSummaryLoading: false,
    IsMobileSummaryLoading: false,

    IsUserJourneyLoading: false,
    IsClickStream: false,
    IsWebLoading: false,
    IsEmailsLoading: false,
    IsSmsLoading: false,
    IsCallsLoading: false,
    IsTransactionsLoading: false,
    IsMobileappLoading: false,
    IsNotesLoading: false,
    IsLeadHistoryLoading: false,
    IsChatHistoryLoading: false,
    IsWebPushLoading: false,
    IsMobilePushLoading: false,
    IsWhatsappLoading: false
};
var allStageDetails = [];
var step = 0;
var checkconttab = "UserJourney";
var UserInfoList = [{ CreatedUserInfoUserId: 0, CreatedByUserName: "CreatedByUserName" }, { LastModifyByUserId: 0, LastModifyByUser: "LastModifyByUser" }];
var GobleMachineId = "";
var GobleDeviceId = "";
var GobleContactId = 0;
var leadHistoryFields = ["UserName", "Score", "LmsGroupName", "Remarks", "PageUrl", "Place", "ReferrerUrl", "Name", "EmailId", "PhoneNumber", "Address1", "Address2", "CompanyName", "CompanyWebUrl", "DomainName",
    "CompanyAddress", "Projects", "State", "PostalCode", "Religion", "MaritalStatus", "Country", "Age", "Gender", "Education", "Occupation", "Location", "Interests", "LastName", "Label",
    "CustomField1", "CustomField2", "CustomField3", "CustomField4", "CustomField5", "CustomField6", "CustomField7", "CustomField8", "CustomField9", "CustomField10",
    "CustomField11", "CustomField12", "CustomField13", "CustomField14", "CustomField15", "CustomField16", "CustomField17", "CustomField18", "CustomField19", "CustomField20",
    "CustomField21", "CustomField22", "CustomField23", "CustomField24", "CustomField25", "CustomField26", "CustomField27", "CustomField28", "CustomField29", "CustomField30",
    "CustomField31", "CustomField32", "CustomField33", "CustomField34", "CustomField35", "CustomField36", "CustomField37", "CustomField38", "CustomField39", "CustomField40",
    "CustomField41", "CustomField42", "CustomField43", "CustomField44", "CustomField45", "CustomField46", "CustomField47", "CustomField48", "CustomField49", "CustomField50",
    "CustomField51", "CustomField52", "CustomField53", "CustomField54", "CustomField55", "CustomField56", "CustomField57", "CustomField58", "CustomField59", "CustomField60",
    "ReminderDate", "FollowUpDate", "RepeatLeadCount"];

var UCPUtil = {
    GetContactExtraField: function () {
        $.ajax({
            url: "/ManageContact/ContactField/GetAllFieldDetails",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    $.each(response, (key, value) => { ContactExtraFieldsForUCP.push(value.FieldName) });
                }
            },
            error: ShowAjaxError
        });
    },
    GetStageScore: function () {
        $.ajax({
            url: "/Prospect/Leads/GetStageScore",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.AllStages != null && response.AllStages.length > 0) {
                    allStageDetails = response.AllStages;
                }
            },
            error: ShowAjaxError
        });
    },
    GetMchineIdsByContactId: function (mLUCPVisitor) {
        $.ajax({
            url: "/ManageContact/UCP/GetMchineIdsByContactId",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': mLUCPVisitor }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                IsUCPLoading.IsMchineIdsByContactId = true;
                $("#ui_machinIdclick,#ui_machinIdweb,#ui_machinIdjour,#ui_machinIdwebform").empty();
                $("#ui_machinIdclick,#ui_machinIdweb,#ui_machinIdjour,#ui_machinIdwebform").append(`<option value="0">select</option>`);

                if (response != undefined && response != null && response.Table1 != null && response.Table1.length > 0) {
                    $.each(response.Table1, function () {
                        let option = `<option value="${$(this)[0].MachineId}">${"Mac-" + $(this)[0].MachineId.substring($(this)[0].MachineId.length - 4, $(this)[0].MachineId.length)}</option>`;
                        $("#ui_machinIdclick,#ui_machinIdweb,#ui_machinIdjour,#ui_machinIdwebform").append(option);
                    });
                } else {
                    if (GobleMachineId != null && GobleMachineId != "") {
                        let option = `<option value="${GobleMachineId}">${"Mac-" + GobleMachineId.substring(GobleMachineId.length - 4, GobleMachineId.length)}</option>`;
                        $("#ui_machinIdclick,#ui_machinIdweb,#ui_machinIdjour,#ui_machinIdwebform").append(option);
                    }
                }

                if (GobleMachineId != null && GobleMachineId != "") {
                    $("#ui_machinIdclick,#ui_machinIdweb,#ui_machinIdjour,#ui_machinIdwebform").val(GobleMachineId).change();
                } else {
                    if (response != undefined && response != null && response.Table1 != null && response.Table1.length > 0) {
                        $("#ui_machinIdclick,#ui_machinIdweb,#ui_machinIdjour,#ui_machinIdwebform").val(response.Table1[0].MachineId).change();
                    }
                }
            },
            error: ShowAjaxError
        });
    },
    GetDeviceIdsByContactId: function (mLUCPVisitor) {
        $.ajax({
            url: "/ManageContact/UCP/GetDevicedsByContactId",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': mLUCPVisitor }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                IsUCPLoading.IsDeviceIdsByContactId = true;
                $("#ui_deviceappId,#ui_devicepushId").empty();
                $("#ui_deviceappId,#ui_devicepushId").append(`<option value="0">select</option>`);

                if (response != undefined && response != null && response.Table1 != null && response.Table1.length > 0) {
                    $.each(response.Table1, function () {
                        let option = `<option value="${$(this)[0].DeviceId}">${"Dev-" + $(this)[0].DeviceId.substring($(this)[0].DeviceId.length - 4, $(this)[0].DeviceId.length)}</option>`;
                        $("#ui_deviceappId,#ui_devicepushId").append(option);
                    });
                } else {
                    if (GobleDeviceId != null && GobleDeviceId.length > 0) {
                        let option = `<option value="${GobleDeviceId}">${"Dev-" + GobleDeviceId.substring(GobleDeviceId.length - 4, GobleDeviceId.length)}</option>`;
                        $("#ui_deviceappId,#ui_devicepushId").append(option);
                    }
                }

                if (GobleDeviceId != null && GobleDeviceId != "") {
                    $("#ui_deviceappId,#ui_devicepushId").val(GobleDeviceId).change();
                } else {
                    if (response != undefined && response != null && response.Table1 != null && response.Table1.length > 0) {
                        $("#ui_deviceappId,#ui_devicepushId").val(response.Table1[0].DeviceId).change();
                    }
                }
            },
            error: ShowAjaxError
        });
    },
    NoDataFound: function (columns) {
        return `<tr><td colspan="${columns}" class="border-bottom-0"><div class="no-data ">There is no data for this view.</div></td></tr>`;
    },

    ShowContactUCP: function (mLUCPVisitor) {
        if ((mLUCPVisitor.MachineId != null && mLUCPVisitor.MachineId.length > 0) || (mLUCPVisitor.DeviceId != null && mLUCPVisitor.DeviceId.length > 0) || (mLUCPVisitor.ContactId != null && $.isNumeric(mLUCPVisitor.ContactId) && mLUCPVisitor.ContactId > 0)) {
            if (checkconttab.toLowerCase() == "userjourney") {
                UCPUtil.SetTabLoading(checkconttab.toLowerCase());
                UCPUtil.BindUserJourney();
                $("#ui_divContactUCPScreen").addClass("show-UCP");
                $(".container").addClass("position-relative");
                $("#ui_UCPJourneyData").parent().addClass("active");
                $("div[class^='tables-']").addClass("hideDiv");
                $(".tables-UserJourney").removeClass("hideDiv");
            } else {
                $("#ui_divContactUCPScreen").addClass("show-UCP");
                $(".container").addClass("position-relative");
                $("div[class^='tables-']").addClass("hideDiv");
                $(`.tables-${checkconttab}`).removeClass("hideDiv");
                UCPUtil.SetTabLoading(checkconttab.toLowerCase());
                UCPUtil.DecideAndBindUcpTab(checkconttab);
            }

            if (step == 0) {
                step++;
                setTimeout(UCPUtil.AdpotTabMore, 500);
            }

            //UCPUtil.AnimateToTop();
        } else {
            HidePageLoading();
            ShowErrorMessage(GlobalErrorList.UCPMessage.ContactNotFoundForUCP);
        }
    },

    DecideAndBindUcpTab: function (tab) {
        UCPUtil.SetTabLoading(tab.toLowerCase());
        switch (tab.toLowerCase()) {
            case "userjourney":
                UCPUtil.BindUserJourney();
                break;
            case "clickstream":
                UCPUtil.BindClickStream(mLUCPVisitor);
                break;
            case "web":
                UCPUtil.BindWeb();
                break;
            case "emails":
                UCPUtil.BindEmail();
                break;
            case "sms":
                UCPUtil.BindSMS();
                break;
            case "whatsapp":
                UCPUtil.BindWhatsapp();
                break;
            case "calls":
                UCPUtil.BindCalls();
                break;
            case "transactions":
                UCPUtil.BindTransactions();
                break;
            case "mobileapp":
                UCPUtil.BindMobileApp(mLUCPVisitor);
                break;
            case "reverselookup":
                UCPUtil.BindReverseLookUp();
                break;
            case "notes":
                UCPUtil.BindNotes();
                break;
            case "leadhistory":
                UCPUtil.BindLeadHistory();
                break;
            case "chathistory":
                UCPUtil.BindChatHistory();
                break;
            case "webpush":
                UCPUtil.BindWebPush(mLUCPVisitor);
                break;
            case "mobilepush":
                UCPUtil.BindMobilePush(mLUCPVisitor);
                break;
            case "custevents":
                UCPUtil.CustomeventsGetReport(customeventoverviewid);
                UCPUtil.GetCstEventsData();
                break;

        }
    },

    SetTabLoading: function (tab) {
        switch (tab) {
            case "userjourney":
                IsUCPLoading.IsUserJourneyLoading = false;
                IsUCPLoading.IsClickStream = true;
                IsUCPLoading.IsWebLoading = true;
                IsUCPLoading.IsEmailsLoading = true;
                IsUCPLoading.IsSmsLoading = true;
                IsUCPLoading.IsCallsLoading = true;
                IsUCPLoading.IsTransactionsLoading = true;
                IsUCPLoading.IsMobileappLoading = true;
                IsUCPLoading.IsNotesLoading = true;
                IsUCPLoading.IsLeadHistoryLoading = true;
                IsUCPLoading.IsChatHistoryLoading = true;
                IsUCPLoading.IsWebPushLoading = true;
                IsUCPLoading.IsMobilePushLoading = true;
                IsUCPLoading.IsWhatsappLoading = true;
                break;
            case "clickstream":
                IsUCPLoading.IsUserJourneyLoading = true;
                IsUCPLoading.IsClickStream = false;
                IsUCPLoading.IsWebLoading = true;
                IsUCPLoading.IsEmailsLoading = true;
                IsUCPLoading.IsSmsLoading = true;
                IsUCPLoading.IsCallsLoading = true;
                IsUCPLoading.IsTransactionsLoading = true;
                IsUCPLoading.IsMobileappLoading = true;
                IsUCPLoading.IsNotesLoading = true;
                IsUCPLoading.IsLeadHistoryLoading = true;
                IsUCPLoading.IsChatHistoryLoading = true;
                IsUCPLoading.IsWebPushLoading = true;
                IsUCPLoading.IsMobilePushLoading = true;
                IsUCPLoading.IsWhatsappLoading = true;
                break;
            case "web":
                IsUCPLoading.IsUserJourneyLoading = true;
                IsUCPLoading.IsClickStream = true;
                IsUCPLoading.IsWebLoading = false;
                IsUCPLoading.IsEmailsLoading = true;
                IsUCPLoading.IsSmsLoading = true;
                IsUCPLoading.IsCallsLoading = true;
                IsUCPLoading.IsTransactionsLoading = true;
                IsUCPLoading.IsMobileappLoading = true;
                IsUCPLoading.IsNotesLoading = true;
                IsUCPLoading.IsLeadHistoryLoading = true;
                IsUCPLoading.IsChatHistoryLoading = true;
                IsUCPLoading.IsWebPushLoading = true;
                IsUCPLoading.IsMobilePushLoading = true;
                IsUCPLoading.IsWhatsappLoading = true;
                break;
            case "emails":
                IsUCPLoading.IsUserJourneyLoading = true;
                IsUCPLoading.IsClickStream = true;
                IsUCPLoading.IsWebLoading = true;
                IsUCPLoading.IsEmailsLoading = false;
                IsUCPLoading.IsSmsLoading = true;
                IsUCPLoading.IsCallsLoading = true;
                IsUCPLoading.IsTransactionsLoading = true;
                IsUCPLoading.IsMobileappLoading = true;
                IsUCPLoading.IsNotesLoading = true;
                IsUCPLoading.IsLeadHistoryLoading = true;
                IsUCPLoading.IsChatHistoryLoading = true;
                IsUCPLoading.IsWebPushLoading = true;
                IsUCPLoading.IsMobilePushLoading = true;
                IsUCPLoading.IsWhatsappLoading = true;
                break;
            case "sms":
                IsUCPLoading.IsUserJourneyLoading = true;
                IsUCPLoading.IsClickStream = true;
                IsUCPLoading.IsWebLoading = true;
                IsUCPLoading.IsEmailsLoading = true;
                IsUCPLoading.IsSmsLoading = false;
                IsUCPLoading.IsCallsLoading = true;
                IsUCPLoading.IsTransactionsLoading = true;
                IsUCPLoading.IsMobileappLoading = true;
                IsUCPLoading.IsNotesLoading = true;
                IsUCPLoading.IsLeadHistoryLoading = true;
                IsUCPLoading.IsChatHistoryLoading = true;
                IsUCPLoading.IsWebPushLoading = true;
                IsUCPLoading.IsMobilePushLoading = true;
                IsUCPLoading.IsWhatsappLoading = true;
                break;
            case "whatsapp":
                IsUCPLoading.IsUserJourneyLoading = true;
                IsUCPLoading.IsClickStream = true;
                IsUCPLoading.IsWebLoading = true;
                IsUCPLoading.IsEmailsLoading = true;
                IsUCPLoading.IsSmsLoading = true;
                IsUCPLoading.IsWhatsappLoading = false;
                IsUCPLoading.IsTransactionsLoading = true;
                IsUCPLoading.IsCallsLoading = true;
                IsUCPLoading.IsMobileappLoading = true;
                IsUCPLoading.IsNotesLoading = true;
                IsUCPLoading.IsLeadHistoryLoading = true;
                IsUCPLoading.IsChatHistoryLoading = true;
                IsUCPLoading.IsWebPushLoading = true;
                IsUCPLoading.IsMobilePushLoading = true;
                break;
            case "calls":
                IsUCPLoading.IsUserJourneyLoading = true;
                IsUCPLoading.IsClickStream = true;
                IsUCPLoading.IsWebLoading = true;
                IsUCPLoading.IsEmailsLoading = true;
                IsUCPLoading.IsSmsLoading = true;
                IsUCPLoading.IsCallsLoading = false;
                IsUCPLoading.IsTransactionsLoading = true;
                IsUCPLoading.IsMobileappLoading = true;
                IsUCPLoading.IsNotesLoading = true;
                IsUCPLoading.IsLeadHistoryLoading = true;
                IsUCPLoading.IsChatHistoryLoading = true;
                IsUCPLoading.IsWebPushLoading = true;
                IsUCPLoading.IsMobilePushLoading = true;
                IsUCPLoading.IsWhatsappLoading = true;
                break;
            case "transactions":
                IsUCPLoading.IsUserJourneyLoading = true;
                IsUCPLoading.IsClickStream = true;
                IsUCPLoading.IsWebLoading = true;
                IsUCPLoading.IsEmailsLoading = true;
                IsUCPLoading.IsSmsLoading = true;
                IsUCPLoading.IsCallsLoading = true;
                IsUCPLoading.IsTransactionsLoading = false;
                IsUCPLoading.IsMobileappLoading = true;
                IsUCPLoading.IsNotesLoading = true;
                IsUCPLoading.IsLeadHistoryLoading = true;
                IsUCPLoading.IsChatHistoryLoading = true;
                IsUCPLoading.IsWebPushLoading = true;
                IsUCPLoading.IsMobilePushLoading = true;
                IsUCPLoading.IsWhatsappLoading = true;
                break;
            case "mobileapp":
                IsUCPLoading.IsUserJourneyLoading = true;
                IsUCPLoading.IsClickStream = true;
                IsUCPLoading.IsWebLoading = true;
                IsUCPLoading.IsEmailsLoading = true;
                IsUCPLoading.IsSmsLoading = true;
                IsUCPLoading.IsCallsLoading = true;
                IsUCPLoading.IsTransactionsLoading = true;
                IsUCPLoading.IsMobileappLoading = false;
                IsUCPLoading.IsNotesLoading = true;
                IsUCPLoading.IsLeadHistoryLoading = true;
                IsUCPLoading.IsChatHistoryLoading = true;
                IsUCPLoading.IsWebPushLoading = true;
                IsUCPLoading.IsMobilePushLoading = true;
                IsUCPLoading.IsWhatsappLoading = true;
                break;
            case "notes":
                IsUCPLoading.IsUserJourneyLoading = true;
                IsUCPLoading.IsClickStream = true;
                IsUCPLoading.IsWebLoading = true;
                IsUCPLoading.IsEmailsLoading = true;
                IsUCPLoading.IsSmsLoading = true;
                IsUCPLoading.IsCallsLoading = true;
                IsUCPLoading.IsTransactionsLoading = true;
                IsUCPLoading.IsMobileappLoading = true;
                IsUCPLoading.IsNotesLoading = false;
                IsUCPLoading.IsLeadHistoryLoading = true;
                IsUCPLoading.IsChatHistoryLoading = true;
                IsUCPLoading.IsWebPushLoading = true;
                IsUCPLoading.IsMobilePushLoading = true;
                IsUCPLoading.IsWhatsappLoading = true;
                break;
            case "leadhistory":
                IsUCPLoading.IsUserJourneyLoading = true;
                IsUCPLoading.IsClickStream = true;
                IsUCPLoading.IsWebLoading = true;
                IsUCPLoading.IsEmailsLoading = true;
                IsUCPLoading.IsSmsLoading = true;
                IsUCPLoading.IsCallsLoading = true;
                IsUCPLoading.IsTransactionsLoading = true;
                IsUCPLoading.IsMobileappLoading = true;
                IsUCPLoading.IsNotesLoading = true;
                IsUCPLoading.IsLeadHistoryLoading = false;
                IsUCPLoading.IsChatHistoryLoading = true;
                IsUCPLoading.IsWebPushLoading = true;
                IsUCPLoading.IsMobilePushLoading = true;
                IsUCPLoading.IsWhatsappLoading = true;
                break;
            case "chathistory":
                IsUCPLoading.IsUserJourneyLoading = true;
                IsUCPLoading.IsClickStream = true;
                IsUCPLoading.IsWebLoading = true;
                IsUCPLoading.IsEmailsLoading = true;
                IsUCPLoading.IsSmsLoading = true;
                IsUCPLoading.IsCallsLoading = true;
                IsUCPLoading.IsTransactionsLoading = true;
                IsUCPLoading.IsMobileappLoading = true;
                IsUCPLoading.IsNotesLoading = true;
                IsUCPLoading.IsLeadHistoryLoading = true;
                IsUCPLoading.IsChatHistoryLoading = false;
                IsUCPLoading.IsWebPushLoading = true;
                IsUCPLoading.IsMobilePushLoading = true;
                IsUCPLoading.IsWhatsappLoading = true;
                break;
            case "webpush":
                IsUCPLoading.IsUserJourneyLoading = true;
                IsUCPLoading.IsClickStream = true;
                IsUCPLoading.IsWebLoading = true;
                IsUCPLoading.IsEmailsLoading = true;
                IsUCPLoading.IsSmsLoading = true;
                IsUCPLoading.IsCallsLoading = true;
                IsUCPLoading.IsTransactionsLoading = true;
                IsUCPLoading.IsMobileappLoading = true;
                IsUCPLoading.IsNotesLoading = true;
                IsUCPLoading.IsLeadHistoryLoading = true;
                IsUCPLoading.IsChatHistoryLoading = true;
                IsUCPLoading.IsWebPushLoading = false;
                IsUCPLoading.IsMobilePushLoading = true;
                IsUCPLoading.IsWhatsappLoading = true;
                break;
            case "mobilepush":
                IsUCPLoading.IsUserJourneyLoading = true;
                IsUCPLoading.IsClickStream = true;
                IsUCPLoading.IsWebLoading = true;
                IsUCPLoading.IsEmailsLoading = true;
                IsUCPLoading.IsSmsLoading = true;
                IsUCPLoading.IsCallsLoading = true;
                IsUCPLoading.IsTransactionsLoading = true;
                IsUCPLoading.IsMobileappLoading = true;
                IsUCPLoading.IsNotesLoading = true;
                IsUCPLoading.IsLeadHistoryLoading = true;
                IsUCPLoading.IsChatHistoryLoading = true;
                IsUCPLoading.IsWebPushLoading = true;
                IsUCPLoading.IsMobilePushLoading = false;
                IsUCPLoading.IsWhatsappLoading = true;
                break;
            case "CustEvents":
                IsUCPLoading.IsUserJourneyLoading = true;
                IsUCPLoading.IsClickStream = true;
                IsUCPLoading.IsWebLoading = true;
                IsUCPLoading.IsEmailsLoading = true;
                IsUCPLoading.IsSmsLoading = true;
                IsUCPLoading.IsCallsLoading = true;
                IsUCPLoading.IsTransactionsLoading = true;
                IsUCPLoading.IsMobileappLoading = false;
                IsUCPLoading.IsNotesLoading = true;
                IsUCPLoading.IsLeadHistoryLoading = true;
                IsUCPLoading.IsChatHistoryLoading = true;
                IsUCPLoading.IsWebPushLoading = true;
                IsUCPLoading.IsMobilePushLoading = true;
                IsUCPLoading.IsWhatsappLoading = true;
                break;
        }
    },
    SetFalseTabLoading: function (tab) {
        IsUCPLoading.IsUserJourneyLoading = false;
        IsUCPLoading.IsClickStream = false;
        IsUCPLoading.IsWebLoading = false;
        IsUCPLoading.IsEmailsLoading = false;
        IsUCPLoading.IsSmsLoading = false;
        IsUCPLoading.IsCallsLoading = false;
        IsUCPLoading.IsTransactionsLoading = false;
        IsUCPLoading.IsMobileappLoading = false;
        IsUCPLoading.IsNotesLoading = false;
        IsUCPLoading.IsLeadHistoryLoading = false;
        IsUCPLoading.IsChatHistoryLoading = false;
        IsUCPLoading.IsWebPushLoading = false;
        IsUCPLoading.IsMobilePushLoading = false;
        IsUCPLoading.IsWhatsappLoading = false;
    },
    setTabAbount: function () {
        IsUCPLoading.IsMchineIdsByContactId = true;
        IsUCPLoading.IsDeviceIdsByContactId = true;
        IsUCPLoading.IsAbout = true;
        IsUCPLoading.IsUserName = true;
        IsUCPLoading.IsWebSummaryLoading = true;
        IsUCPLoading.IsMobileSummaryLoading = true;
    },

    /** About*/
    GetBasicDetails: function (mLUCPVisitor) {
        $.ajax({
            url: "/ManageContact/UCP/GetBasicDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': mLUCPVisitor }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: UCPUtil.BindBasicDetails,
            error: ShowAjaxError
        });
    },
    BindBasicDetails: function (ContactDetails) {
        if (ContactDetails != undefined && ContactDetails != null && ContactDetails.Table1 != undefined && ContactDetails.Table1 != null && ContactDetails.Table1.length > 0) {
            let contact = ContactDetails.Table1[0];
            ContactidForNote = ContactDetails.Table1[0].ContactId == undefined ? 0 : ContactDetails.Table1[0].ContactId;
            if (!jQuery.isEmptyObject(contact)) {
                UCPUtil.BindBasicDetailVisitor(contact);
            }
        }
        IsUCPLoading.IsAbout = true;
    },
    BindBasicDetailVisitor: function (basicObject) {
        if (!jQuery.isEmptyObject(basicObject)) {

            if (basicObject.Name != undefined && basicObject.Name != null && basicObject.Name.length > 0) {
                $(".editucpname").removeClass("hideDiv");
            } else {
                $(".editucpname").addClass("hideDiv");
            }

            basicObject.Name != undefined && basicObject.Name != null && basicObject.Name.length > 0 ? $("#ui_visitorNameOrMacOrDeviceId").html(basicObject.Name) : (basicObject.MachineId != undefined && basicObject.MachineId != null && basicObject.MachineId.length > 0 ? $("#ui_visitorNameOrMacOrDeviceId").html("Mac-" + basicObject.MachineId.substring(basicObject.MachineId.length - 4, basicObject.MachineId.length)) : (basicObject.DeviceId != undefined && basicObject.DeviceId != null && basicObject.DeviceId.length > 0 ? $("#ui_visitorNameOrMacOrDeviceId").html("Device-" + basicObject.DeviceId.substring(basicObject.DeviceId.length - 4, basicObject.DeviceId.length)) : "NA"));
            basicObject.NewOrRepeat != undefined && basicObject.NewOrRepeat != null && basicObject.NewOrRepeat.length > 0 ? $("#ui_visitorNeworRepeat").html(basicObject.NewOrRepeat) : $("#ui_visitorNeworRepeat").html("NA");
            basicObject.EmailId != undefined && basicObject.EmailId != null && basicObject.EmailId.length > 0 ? $("#ui_visitorEmailId").attr("data-content", `<span id="ui_sendmailpopvr" class="sendmailpopvr ContributePermission">${basicObject.EmailId}</span>`) : $("#ui_visitorEmailId").attr("data-content", "NA");
            basicObject.EmailId != undefined && basicObject.EmailId != null && basicObject.EmailId.length > 0 ? $("#ui_visitorEmailId").attr("contactemail", `${basicObject.EmailId}`) : $("#ui_visitorEmailId").attr("contactemail", "NA");
            basicObject.PhoneNumber != undefined && basicObject.PhoneNumber != null && basicObject.PhoneNumber.length > 0 ? $("#ui_visitorPhoneNumber").attr("data-content", `<span id="ui_calluserpopvr" class="calluserpopvr ContributePermission">${basicObject.PhoneNumber} </span>`) : $("#ui_visitorPhoneNumber").attr("data-content", "NA");
            basicObject.PhoneNumber != undefined && basicObject.PhoneNumber != null && basicObject.PhoneNumber.length > 0 ? $("#ui_visitorPhoneNumber").attr("contactcall", `${basicObject.PhoneNumber}`) : $("#ui_visitorPhoneNumber").attr("contactcall", "NA");
            basicObject.PhoneNumber != undefined && basicObject.PhoneNumber != null && basicObject.PhoneNumber.length > 0 ? $("#ui_visitorSmsPhoneNumber").attr("data-content", `<span id="ui_sendsmspopvr" class='sendsmspopvr ContributePermission'>${basicObject.PhoneNumber}</span>`) : $("#ui_visitorSmsPhoneNumber").attr("data-content", "NA");
            basicObject.PhoneNumber != undefined && basicObject.PhoneNumber != null && basicObject.PhoneNumber.length > 0 ? $("#ui_visitorSmsPhoneNumber").attr("contactsms", `${basicObject.PhoneNumber}`) : $("#ui_visitorSmsPhoneNumber").attr("contactsms", "NA");
            basicObject.PhoneNumber != undefined && basicObject.PhoneNumber != null && basicObject.PhoneNumber.length > 0 ? $("#ui_visitorWhatsappPhoneNumber").attr("data-content", `<span id="ui_sendwhatsapppopvr" class='sendwhatsapppopvr ContributePermission'>${basicObject.PhoneNumber}</span>`) : $("#ui_visitorWhatsappPhoneNumber").attr("data-content", "NA");
            basicObject.PhoneNumber != undefined && basicObject.PhoneNumber != null && basicObject.PhoneNumber.length > 0 ? $("#ui_visitorWhatsappPhoneNumber").attr("contactwhatsapp", `${basicObject.PhoneNumber}`) : $("#ui_visitorWhatsappPhoneNumber").attr("contactwhatsapp", "NA");


            basicObject.Name != undefined && basicObject.Name != null && basicObject.Name.length > 0 ? $("#ui_visitorFirstName").html(basicObject.Name) : $("#ui_visitorFirstName").html("NA");
            basicObject.LastName != undefined && basicObject.LastName != null && basicObject.LastName.length > 0 ? $("#ui_visitorLastName").html(basicObject.LastName) : $("#ui_visitorLastName").html("NA");
            basicObject.AssignedGroups != undefined && basicObject.AssignedGroups != null && basicObject.AssignedGroups.length > 0 ? $("#ui_visitorAssociatedGroups").html(basicObject.AssignedGroups) : $("#ui_visitorAssociatedGroups").html("NA");
            basicObject.PageUrl != undefined && basicObject.PageUrl != null && basicObject.PageUrl.length > 0 ? $("#ui_visitorPageUrl").html(`<a href="${OnlineUrl}Analytics/Content/PageAnalysis?page=${basicObject.PageUrl}" target="_blank">${basicObject.PageUrl}</a>`) : $("#ui_visitorPageUrl").html("NA");
            basicObject.PageUrl != undefined && basicObject.PageUrl != null && basicObject.PageUrl.length > 0 ? $("#ui_visitvisitorPageUrl").html(`<a href="${basicObject.PageUrl}" target="_blank">${basicObject.PageUrl}</a>`) : $("#ui_visitvisitorPageUrl").html("NA");
            basicObject.FormName != undefined && basicObject.FormName != null && basicObject.FormName.length > 0 ? $("#ui_visitorFormName").html(basicObject.FormName) : $("#ui_visitorFormName").html("NA");
            basicObject.CreatedDate != undefined && basicObject.CreatedDate != null ? $("#ui_visitorCreatedDate").html($.datepicker.formatDate("dd M yy", GetJavaScriptDateObj(basicObject.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(basicObject.CreatedDate))) : $("#ui_visitorCreatedDate").html("NA");
            basicObject.UpdatedDate != undefined && basicObject.UpdatedDate != null ? $("#ui_visitorUpdatedDate").html($.datepicker.formatDate("dd M yy", GetJavaScriptDateObj(basicObject.UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(basicObject.UpdatedDate))) : $("#ui_visitorUpdatedDate").html("NA");
            basicObject.LastWebVisitedDate != undefined && basicObject.LastWebVisitedDate != null && basicObject.LastWebVisitedDate.length > 0 ? $("#ui_visitorLastWebVisited").html($.datepicker.formatDate("dd M yy", GetJavaScriptDateObj(basicObject.LastWebVisitedDate)) + " at " + PlumbTimeFormat(GetJavaScriptDateObj(basicObject.LastWebVisitedDate))) : $("#ui_visitorLastWebVisited").html("NA");
            basicObject.LastMobileVisitedDate != undefined && basicObject.LastMobileVisitedDate != null && basicObject.LastMobileVisitedDate.length > 0 ? $("#ui_visitorLastMobileVisited").html($.datepicker.formatDate("dd M yy", GetJavaScriptDateObj(basicObject.LastMobileVisitedDate)) + " at " + PlumbTimeFormat(GetJavaScriptDateObj(basicObject.LastMobileVisitedDate))) : $("#ui_visitorLastMobileVisited").html("NA");
            basicObject.LastWebLocation != undefined && basicObject.LastWebLocation != null && basicObject.LastWebLocation.length > 0 ? $("#ui_visitorWebLocation").html(basicObject.LastWebLocation) : $("#ui_visitorWebLocation").html("NA");
            basicObject.LastMobileLocation != undefined && basicObject.LastMobileLocation != null && basicObject.LastMobileLocation.length > 0 ? $("#ui_visitorMobileLocation").html(basicObject.LastMobileLocation) : $("#ui_visitorMobileLocation").html("NA");
            basicObject.LmsAssignedGroups != undefined && basicObject.LmsAssignedGroups != null && basicObject.LmsAssignedGroups.length > 0 ? $("#ui_visitorLmsAssignedGroups").html(basicObject.LmsAssignedGroups) : $("#ui_visitorLmsAssignedGroups").html("NA");





            //basicObject.MachineId != undefined && basicObject.MachineId != null && basicObject.MachineId.length > 0 ? $("#ui_visitorMachineId").html("Mac-" + basicObject.MachineId.substring(basicObject.MachineId.length - 4, basicObject.MachineId.length)) : $("#ui_visitorMachineId").html("NA");
            //basicObject.DeviceId != undefined && basicObject.DeviceId != null && basicObject.DeviceId.length > 0 ? $("#ui_visitorDeviceId").html("Device-" + basicObject.DeviceId.substring(basicObject.DeviceId.length - 4, basicObject.DeviceId.length)) : $("#ui_visitorDeviceId").html("NA");







            UserInfoList[0].CreatedUserInfoUserId = basicObject.CreatedUserInfoUserId > 0 ? basicObject.CreatedUserInfoUserId : 0;
            UserInfoList[1].LastModifyByUserId = basicObject.LastModifyByUserId > 0 ? basicObject.LastModifyByUserId : 0;
            $("#ui_visitorAddNotes").attr("contactid", `${GobleContactId}`).attr("name", `${basicObject.Name != undefined && basicObject.Name != null && basicObject.Name.length > 0 ? basicObject.Name : "NA"}`).attr("emailid", `${basicObject.EmailId != undefined && basicObject.EmailId != null && basicObject.EmailId.length > 0 ? basicObject.EmailId : "NA"}`);
            $("#ui_VisitorContactDetails").empty();
            $.map(basicObject, function (value, propertyName) {
                if (propertyName != undefined && propertyName != null && value != undefined && value != null) {
                    if (!excludePropertyName.includes(propertyName.toLowerCase())) {

                        if (DateFieldFormate.includes(propertyName.toLowerCase())) {
                            value = $.datepicker.formatDate("dd M yy", GetJavaScriptDateObj(value)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value));
                        }

                        if (ContactDate.includes(propertyName.toLowerCase())) {
                            value = $.datepicker.formatDate("dd M yy", GetJavaScriptDateObj(value));
                        }

                        if (ContactCustomFields.includes(propertyName.toLowerCase())) {
                            if (ContactExtraFieldsForUCP != undefined && ContactExtraFieldsForUCP != null && ContactExtraFieldsForUCP.length > 0) {
                                let cutomFieldIndex = propertyName.length == 12 ? propertyName.substring(propertyName.length - 1, propertyName.length) : propertyName.substring(propertyName.length - 2, propertyName.length);
                                propertyName = ContactExtraFieldsForUCP[cutomFieldIndex - 1];
                            }
                        }

                        let html = ``;
                        if (propertyName != undefined && propertyName != null) {
                            if (propertyName.toLowerCase().includes("createduserinfouserid")) {
                                html = `<div class="row pb-2">
                                    <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                        <strong>Created By UserName:</strong>
                                    </div>
                                    <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6" id="ui_createduserinfouserid">NA</div>
                                 </div>`;
                            } else if (propertyName.toLowerCase().includes("lastmodifybyuserid")) {
                                html = `<div class="row pb-2">
                                    <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                        <strong>Last Modify By User:</strong>
                                    </div>
                                    <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6" id="ui_lastmodifybyuserid">NA</div>
                                 </div>`;
                            } else {
                                html = `<div class="row pb-2">
                                    <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                        <strong>${propertyName}:</strong>
                                    </div>
                                    <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6">${value}</div>
                                 </div>`;
                            }

                            $("#ui_VisitorContactDetails").append(html);
                        }
                    }
                }
            });
            UCPUtil.GetUserName(UserInfoList);
        }
    },
    /** About*/

    /**Web Summary*/
    BindWebSummary: function (mLUCPVisitor) {
        //mLUCPVisitor.FromDate = new Date(mLUCPVisitor.FromDate);
        //mLUCPVisitor.ToDate = new Date(mLUCPVisitor.ToDate);
        $.ajax({
            url: "/ManageContact/UCP/GetWebSummary",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': mLUCPVisitor }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (webSummary) => {
                IsUCPLoading.IsWebSummaryLoading = true;
                if (webSummary != undefined && webSummary != null && webSummary.Table1 != undefined && webSummary.Table1 != null && webSummary.Table1.length > 0) {
                    let webSummaryDetails = webSummary.Table1[0];
                    let AvgTime = webSummaryDetails.WebAvgTimeSpent === '0' ? '0d 0h 0m 0s' : fn_AverageTime(webSummaryDetails.WebAvgTimeSpent);
                    $("#ui_webTotalPageViews").html(webSummaryDetails.WebTotalPageViews);
                    $("#ui_webTotalPurchases").html(webSummaryDetails.TotalPurchases);
                    $("#ui_webAvgTimeSpent").html(AvgTime);
                    $("#ui_webBounceRate").html(webSummaryDetails.BounceRate);
                    $("#ui_webMostVisitedLocation").html(webSummaryDetails.WebMostVisitedLocation);
                    $("#ui_webBrowser").html(webSummaryDetails.WebBrowser);
                    $("#ui_webNetwork").html(webSummaryDetails.Network);
                }
            },
            error: ShowAjaxError
        });
    },

    /**Mobile Summary*/
    BindMobileSummary: function (mLUCPVisitor) {
        //mLUCPVisitor.FromDate = new Date(mLUCPVisitor.FromDate);
        //mLUCPVisitor.ToDate = new Date(mLUCPVisitor.ToDate);
        $.ajax({
            url: "/ManageContact/UCP/GetMobileSummary",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': mLUCPVisitor }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (mobileSummary) => {
                IsUCPLoading.IsMobileSummaryLoading = true;
                if (mobileSummary != undefined && mobileSummary != null && mobileSummary.Table1 != undefined && mobileSummary.Table1 != null && mobileSummary.Table1.length > 0) {
                    let mobileSummaryDetails = mobileSummary.Table1[0];
                    let AvgTime = mobileSummaryDetails.MobileAvgTimeSpent === '0' ? '0d 0h 0m 0s' : fn_AverageTime(mobileSummaryDetails.MobileAvgTimeSpent);
                    $("#ui_mobileTotalPageViews").html(mobileSummaryDetails.MobileTotalPageViews);
                    $("#ui_mobileTotalPurchases").html(mobileSummaryDetails.TotalPurchases);
                    $("#ui_mobileAvgTimeSpent").html(AvgTime);
                    $("#ui_mobileBounceRate").html(mobileSummaryDetails.MobileBounceRate);
                    $("#ui_mobileVisitedLocation").html(mobileSummaryDetails.MobileMostVisitedLocation);
                    $("#ui_mobileDevice").html(mobileSummaryDetails.MobileDevice);
                    $("#ui_mobileNetWork").html(mobileSummaryDetails.Network);
                }
            },
            error: ShowAjaxError
        });
    },

    /**User Journey*/
    BindUserJourney: function () {
        //if (mLUCPVisitor.FromDate != null) {
        //    mLUCPVisitor.FromDate = new Date(mLUCPVisitor.FromDate);
        //    mLUCPVisitor.ToDate = new Date(mLUCPVisitor.ToDate);
        //}

        $.ajax({
            url: "/ManageContact/UCP/GetUserJourney",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': mLUCPVisitor }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (userJourney) => {
                if (userJourney != undefined && userJourney != null && userJourney.length > 0) {
                    $("#userjourneydata").empty();
                    let journey = [];
                    userJourney.forEach((node) => {
                        if (node.SourceName.toLowerCase() != node.PageName.toLowerCase()) {
                            journey.push(node);
                        }
                    });

                    if (journey != null && journey.length > 0) {
                        UCPUtil.DrawSankey(journey);
                    } else {
                        const NoData = `<div class="no-data">There is no data for this view.</div>`;
                        $("#userjourneydata").empty().append(NoData);
                    }
                }
                else {
                    const NoData = `<div class="no-data">There is no data for this view.</div>`;
                    $("#userjourneydata").empty().append(NoData);
                }
                IsUCPLoading.IsUserJourneyLoading = true;
            },
            error: ShowAjaxError
        });
    },
    DrawSankey: function (jsonSankey) {
        var units = "Page Views";
        d3.selectAll("#userjourneydata > *").remove();

        var chartWidth = d3.select("#userjourneydata")
            .style('width')
            .slice(0, -2)
        chartWidth = Math.round(Number(chartWidth))

        var margin = { top: 5, right: 5, bottom: 5, left: 5 },
            width = chartWidth - margin.left - margin.right,
            height = Math.round(Number(chartWidth * .5)) - margin.top - margin.bottom;

        var formatNumber = d3.format(",.0f"),    // zero decimal places
            format = function (d) { return formatNumber(d) + " " + units; },
            color = d3.scale.category20();

        //append the svg canvas to the page
        var svg = d3.select("#userjourneydata").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Set the sankey diagram properties
        var sankey = d3.sankey()
            .nodeWidth(36)
            .nodePadding(10)
            .size([width, height]);

        var path = sankey.link();

        graph = { "nodes": [], "links": [] };

        let distinctNodes = [];
        jsonSankey.forEach(function (node, i) {
            var source = { "name": node.SourceName },
                target = { "name": node.PageName };

            if (distinctNodes.indexOf(node.SourceName) == -1) {
                distinctNodes.push(node.SourceName);
                graph.nodes.push(source);
            }

            if (distinctNodes.indexOf(node.PageName) == -1) {
                distinctNodes.push(node.PageName);
                graph.nodes.push(target);
            }

            graph.links.push({
                "source": distinctNodes.indexOf(node.SourceName),
                "target": distinctNodes.indexOf(node.PageName),
                "value": node.Count
            });
        });

        //graph.nodes = Array.from(new Set(jsonSankey.map(s => s.PageName))).map(source => { return { "name": jsonSankey.find(s => s.PageName === source).PageName } });
        //graph.nodes.push() = Array.from(new Set(jsonSankey.map(s => s.PageName))).map(source => { return { "name": jsonSankey.find(s => s.PageName === source).PageName } });

        sankey
            .nodes(graph.nodes)
            .links(graph.links)
            .layout(32);

        // add in the links
        var link = svg.append("g").selectAll(".link")
            .data(graph.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", path)
            .style("stroke-width", function (d) { return Math.max(1, d.dy); })
            .sort(function (a, b) { return b.dy - a.dy; });

        // add the link titles
        link.append("title")
            .text(function (d) {
                return d.source.name + " > " +
                    d.target.name + "\n" + format(d.value);
            });

        // add in the nodes
        var node = svg.append("g").selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .call(d3.behavior.drag()
                .origin(function (d) { return d; })
                .on("dragstart", function () {
                    this.parentNode.appendChild(this);
                })
                .on("drag", dragmove));

        // add the rectangles for the nodes
        node.append("rect")
            .attr("height", function (d) { return d.dy; })
            .attr("width", sankey.nodeWidth())
            .style("fill", function (d) {
                return d.color = color(d.name.replace(/ .*/, ""));
            })
            .style("stroke", function (d) {
                return d3.rgb(d.color).darker(2);
            })
            .append("title")
            .text(function (d) {
                return d.name + "\n" + format(d.value);
            });

        // add in the title for the nodes
        node.append("text")
            .attr("x", -6)
            .attr("y", function (d) { return d.dy / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function (d) { return d.name; })
            .filter(function (d) { return d.x < width / 2; })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");

        // the function for moving the nodes
        function dragmove(d) {
            d3.select(this).attr("transform",
                "translate(" + (
                    d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
                ) + "," + (
                    d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
                ) + ")");
            sankey.relayout();
            link.attr("d", path);
        }
    },
    /**User Journey*/

    /**Click Stream*/
    BindClickStream: function (mLUCPVisitor) {
        //mLUCPVisitor.FromDate = new Date(mLUCPVisitor.FromDate);
        //mLUCPVisitor.ToDate = new Date(mLUCPVisitor.ToDate);
        $.ajax({

            url: "/ManageContact/UCP/GetClickStreamDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': mLUCPVisitor }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (ClickStreamList) => {

                if (ClickStreamList != undefined && ClickStreamList != null && ClickStreamList.Table1 != undefined && ClickStreamList.Table1 != null && ClickStreamList.Table1.length > 0) {
                    $("#ui_divtableSession").empty();
                    const distinctSessionId = [...new Set(ClickStreamList.Table1.map(x => x.SessionId))];
                    let SessionCount = distinctSessionId.length;
                    $.each(distinctSessionId, (key, value) => {
                        let ClickStrmData = '';
                        var eventIcon = "";
                        var emailIcon = "";
                        var smsIcon = "";
                        var whatsappIcon = "";
                        var weppushIcon = "";
                        var customenentIcon = "";
                        var captureformIcon = "";
                        var fst_source = 0;
                        var total_session_itm = ClickStreamList.Table1.filter(o => o.SessionId == value).length;

                        ClickStreamList.Table1.forEach(function (item, i) {

                            if (item.SessionId == value) {

                                if (item.IsEventTriggered == true)
                                    eventIcon = `<div class="iconsessitem clickeventbtn"><i onclick=EventTrackerGetDetails('${item.SessionId}','${mLUCPVisitor.MachineId}') class="ion ion-mouse" title="Event Tracking"  > </i> </div>`;
                                if (item.P5MailUniqueID != null && item.P5MailUniqueID != '' && item.P5MailUniqueID != '0')
                                    emailIcon = `<div dataP5UniqueID='${item.P5MailUniqueID}' startdate="${item.Date}" enddate="${item.TimeEnd}" class="iconsessitem clickstreammail"><i  class="ion ion-ios-email font-20" title="Mail" > </i> </div>`;
                                if (item.P5SMSUniqueID != null && item.P5SMSUniqueID != '' && item.P5SMSUniqueID != '0')
                                    smsIcon = `<div  dataP5UniqueID='${item.P5SMSUniqueID}' startdate="${item.Date}" enddate="${item.TimeEnd}" class="iconsessitem clickstreamSms"><i  class="ion ion-chatbubble-working" title="SMS"  > </i></div>`;
                                if (item.P5WhatsAppUniqueID != null && item.P5WhatsAppUniqueID != '' && item.P5WhatsAppUniqueID != '0')
                                    whatsappIcon = `<div  dataP5UniqueID='${item.P5WhatsAppUniqueID}'  startdate="${item.Date}" enddate="${item.TimeEnd}" class="iconsessitem clickstreamwhatsapp"><i class="ion ion-social-whatsapp" title="WhatsApp" > </i> </div>`;
                                if (item.P5WebPushUniqueID != null && item.P5WebPushUniqueID != '' && item.P5WebPushUniqueID != '0')
                                    weppushIcon = `<div dataP5UniqueID='${item.P5WebPushUniqueID}' datamachineid='${mLUCPVisitor.MachineId}' datasessionid="${item.SessionId}" class="iconsessitem clickstreamwebpush"><i  class="ion ion-android-notifications" title="Webpush"  > </i> </div>`;
                                if (item.IsCustomEventSource == true)
                                    customenentIcon = `<div datamachineid='${mLUCPVisitor.MachineId}' datasessionid="${item.SessionId}"  class="iconsessitem clickstreamcustevnt"><i class="ion ion-social-buffer" title="Custom Events"  > </i> </div>`;

                                if (item.IsFormSource == true)
                                    captureformIcon = `<div datamachineid='${mLUCPVisitor.MachineId}' datasessionid="${item.SessionId}" class="iconsessitem clickstreamform"><i class="ion ion-android-list" title="Form"  > </i> </div>`;

                                fst_source = fst_source + 1;

                                ClickStrmData += `<tr>
                                                <td class="text-left">
                                                    <div class="eventtrackwrap">
                                                      <span>${total_session_itm == fst_source ? item.ReferType : ""} </span>

                                                    </div>
                                                  </td>
                                                    <td class ="text-left">${(item.City != undefined && item.City != null && item.City != "") ? item.City : "NA"}</td>
                                                    <td class="text-left"><a href="${item.PageName}">${item.PageName} </a></td>
                                                    <td>${(item.PageTitle != undefined && item.PageTitle != null && item.PageTitle != "") ? item.PageTitle : "NA"}</td>
                                                    <td>${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(item.Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(item.Date))}</td>
                                                    </tr>`;
                            }
                        });

                        const clickStream = `<div class="sessionheadUCP border-top-0">
                                    <h6>Sessions ${SessionCount}</h6>
                                    <div class="sessioniconwrp">
                                        <div class="iconswrapUCP"> 
                                                 ${eventIcon}

                                                 ${emailIcon}

                                                 ${smsIcon}

                                                 ${whatsappIcon}

                                                 ${weppushIcon}

                                                ${customenentIcon}

                                               ${captureformIcon}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <table class="table mb-0" id="ui_ClickStreamtable">
                                           
                                            <thead>
                                             
                                                <th class ="helpIcon m-p-w-190 td-wid-20" scope="col">Source</th>
                                                <th class="helpIcon m-p-w-150 td-wid-15" scope="col">City</th>
                                                <th class="helpIcon m-p-w-190 td-wid-30" scope="col">Flow Analysis</th>
                                                <th class="helpIcon m-p-w-190 td-wid-20" scope="col">Tags</th>
                                                <th class="helpIcon m-p-w-190 td-wid-15" scope="col">Date</th>
                                             
                                            </thead>
                                            <tbody id="ui_tbodyUCPclickstreamDetails">
                                                ${ClickStrmData}
                                            </tbody>
                                    </table>`;
                        $("#ui_divtableSession").append(clickStream);
                        SessionCount--;
                    });
                }
                else {
                    const NoData = `<table class="table mb-0">
                                        <thead>
                                            <tr>
                                                <th class="helpIcon m-p-w-190 td-wid-20" scope="col">Last Session</th>
                                                <th class="helpIcon m-p-w-150 td-wid-15" scope="col">City</th>
                                                <th class="helpIcon m-p-w-190 td-wid-30" scope="col">Flow Analysis</th>
                                                <th class="helpIcon m-p-w-190 td-wid-20" scope="col">Tags</th>
                                                <th class="helpIcon m-p-w-190 td-wid-15" scope="col">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td colspan="5" class="border-bottom-0">
                                                    <div class="no-data">There is no data for this view.</div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>`;
                    $("#ui_divtableSession").empty().append(NoData);
                }

                IsUCPLoading.IsClickStream = true;
            },
            error: ShowAjaxError
        });
    },

    /**Web*/
    BindWeb: function () {
        //mLUCPVisitor.FromDate = new Date(mLUCPVisitor.FromDate);
        //mLUCPVisitor.ToDate = new Date(mLUCPVisitor.ToDate);
        $.ajax({
            url: "/ManageContact/UCP/GetFormDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': mLUCPVisitor }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (FormList) => {

                if (FormList != undefined && FormList != null && FormList.Table1 != undefined && FormList.Table1 != null && FormList.Table1.length > 0) {
                    $("#ui_tbodyUCPWebDetails").empty();
                    $.each(FormList.Table1, (key, value) => {
                        const WebData = `<tr>
                                        <td class="text-left">${value.FormName}</td>
                                        <td class="text-left">${value.EmbeddedFormOrPopUpFormOrTaggedForm}</td>
                                        <td class="text-left">${value.ViewedCount}</td>
                                        <td>${value.ResponseCount}</td>
                                        <td>${value.ClosedCount}</td>
                                        <td>${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(value.RecentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.RecentDate))}</td>
                                      </tr>`
                        $("#ui_tbodyUCPWebDetails").append(WebData);
                    });
                }
                else {
                    $("#ui_tbodyUCPWebDetails").empty().append(UCPUtil.NoDataFound(6));
                }

                IsUCPLoading.IsWebLoading = true;
            },
            error: ShowAjaxError
        });
    },

    /**Email*/
    BindEmail: function () {
        //mLUCPVisitor.FromDate = new Date(mLUCPVisitor.FromDate);
        //mLUCPVisitor.ToDate = new Date(mLUCPVisitor.ToDate);
        $.ajax({
            url: "/ManageContact/UCP/GetMailDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': mLUCPVisitor }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (MailList) => {

                if (MailList != undefined && MailList != null && MailList.Table1 != undefined && MailList.Table1 != null && MailList.Table1.length > 0) {
                    $("#ui_tbodyUCPMailDetails").empty();
                    $.each(MailList.Table1, (key, value) => {
                        let TemplatePaths = "";
                        let opendate = "";
                        let clickeddate = "";
                        if (value.TemplataId > 0)
                            TemplatePaths = `https://${TemplatePath}Campaign-${Plumb5AccountId}-${value.TemplataId}/TemplateContent.html`;
                        else
                            TemplatePaths = `${OnlineUrl}Template/no-template-available.html`;
                        if (value.Opened > 0) {
                            opendate = `<i class="icon ion-android-calendar" title="${$.datepicker.formatDate(" M dd yy", GetJavaScriptDateObj(value.OpenDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.OpenDate))}"></i>`;
                        }
                        else {
                            opendate = "";

                        }
                        if (value.Clicked > 0) {
                            clickeddate = `<i class="icon ion-android-calendar" title="${$.datepicker.formatDate(" M dd yy", GetJavaScriptDateObj(value.ClickDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.ClickDate))}"></i>`;

                        }
                        else {

                            clickeddate = "";
                        }
                        const MailData = `<tr>
                                            <td class="text-center temppreveye">
                                                  <i class="icon ion-ios-eye-outline position-relative">
                                                        <div class="previewtabwrp">
                                                            <div class="thumbnail-container">
                                                                 <a href="${TemplatePaths}" target="_blank">
                                                                    <div class="thumbnail">
                                                                        <iframe src="${TemplatePaths}" frameborder="0" onload="this.style.opacity = 1"></iframe>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                        </div>
                                                  </i>
                                            </td>
                                            <td class="text-left">${(value.TemplateName != undefined && value.TemplateName != null && value.TemplateName != "") ? value.TemplateName : "NA"}</td>
                                            <td class="text-left">${(value.Subject != undefined && value.Subject != null && value.Subject != "") ? value.Subject : "NA"}</td>
                                            <td> <div class="df-ac-sbet openrep">
                                            <span>${value.Opened}</span> ${opendate}</div></td>
                                            <td>
                                            <div class="df-ac-sbet openrep">
                                            <span>${value.Clicked}</span>${clickeddate}
                                            </div>
                                            </td> 
                                            <td class="text-left">${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(value.SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.SentDate))}</td>
                                     </tr>`
                        $("#ui_tbodyUCPMailDetails").append(MailData);
                    });
                }
                else {
                    $("#ui_tbodyUCPMailDetails").empty().append(UCPUtil.NoDataFound(7));
                }

                IsUCPLoading.IsEmailsLoading = true;
                UCPUtil.SetPreview();
            },
            error: ShowAjaxError
        });
    },

    SetPreview: function () {
        let checktablerowlenth = $("table.temppreveye-tbl >tbody >tr").length;
        if (checktablerowlenth <= 4) {
            $("table.temppreveye-tbl >tbody >tr").addClass("prevpopupdefault");
        } else {
            $("table.temppreveye-tbl >tbody >tr").removeClass("prevpopupdefault");
        }
    },

    /**Sms*/
    BindSMS: function () {
        //mLUCPVisitor.FromDate = new Date(mLUCPVisitor.FromDate);
        //mLUCPVisitor.ToDate = new Date(mLUCPVisitor.ToDate);
        $.ajax({
            url: "/ManageContact/UCP/GetSmsDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': mLUCPVisitor }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (SMSList) => {

                if (SMSList != undefined && SMSList != null && SMSList.Table1 != undefined && SMSList.Table1 != null && SMSList.Table1.length > 0) {
                    $("#ui_tbodyUCPSmsDetails").empty();
                    $.each(SMSList.Table1, (key, value) => {
                        let delivereddatetime = "";
                        let smsclickeddatetime = "";

                        if (value.IsDelivered > 0) {
                            delivereddatetime = `<i class="icon ion-android-calendar" title="${$.datepicker.formatDate(" M dd yy", GetJavaScriptDateObj(value.DeliveryTime)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.DeliveryTime))}"></i>`;
                        }
                        else {
                            delivereddatetime = "";

                        }
                        if (value.IsClicked > 0) {
                            smsclickeddatetime = `<i class="icon ion-android-calendar" title="${$.datepicker.formatDate(" M dd yy", GetJavaScriptDateObj(value.ClickDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.ClickDate))}"></i>`;
                        }
                        else {
                            smsclickeddatetime = "";

                        }
                        const SMSData = `<tr>
                                            <td class="text-center">
                                                  <div class="smsprevwrap"><i class="icon ion-ios-eye-outline"></i>
                                                    <div class="smsprevItemwrap bubbrep">
                                                      <div class="chat">
                                                        <div class="yours messages">
                                                          <div class="message last">
                                                           ${value.MessageContent}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                            </td>
                                            <td class="text-left">${(value.TemplateName != undefined && value.TemplateName != null && value.TemplateName != "") ? value.TemplateName : "NA"}</td>
                                            <td class="text-right">${(value.PhoneNumber != undefined && value.PhoneNumber != null && value.PhoneNumber != "") ? value.PhoneNumber : "NA"}</td>
                                            <td> <div class="df-ac-sbet openrep">
                                            <span>${value.IsDelivered}</span> ${delivereddatetime}</div></td>
                                            <td>
                                            <div class="df-ac-sbet openrep">
                                            <span>${value.IsClicked}</span>${smsclickeddatetime}
                                            </div>
                                            </td>
 
                                            <td class="text-left">${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(value.SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.SentDate))}</td>
                                        </tr>`;
                        $("#ui_tbodyUCPSmsDetails").append(SMSData);
                    });
                }
                else {
                    $("#ui_tbodyUCPSmsDetails").empty().append(UCPUtil.NoDataFound(6));
                }

                IsUCPLoading.IsSmsLoading = true;
            },
            error: ShowAjaxError
        });
    },

    BindWhatsapp: function () {
        //mLUCPVisitor.FromDate = new Date(mLUCPVisitor.FromDate);
        //mLUCPVisitor.ToDate = new Date(mLUCPVisitor.ToDate);
        $.ajax({
            url: "/ManageContact/UCP/GetWhatsappDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': mLUCPVisitor }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (WhatsappList) => {

                if (WhatsappList != undefined && WhatsappList != null && WhatsappList.Table1 != undefined && WhatsappList.Table1 != null && WhatsappList.Table1.length > 0) {
                    $("#ui_tbodyUCPWhatsappDetails").empty();
                    $.each(WhatsappList.Table1, (key, value) => {
                        let delivereddatetime = "";
                        let clickeddatetime = "";
                        let readdatetime = "";

                        if (value.IsDelivered > 0 && value.DeliveryTime != undefined && value.DeliveryTime != null) {
                            delivereddatetime = `<i class="icon ion-android-calendar" title="${$.datepicker.formatDate(" M dd yy", GetJavaScriptDateObj(value.DeliveryTime)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.DeliveryTime))}"></i>`;
                        }
                        else {
                            delivereddatetime = "";

                        }
                        if (value.IsClicked > 0 && value.ClickDate != undefined && value.ClickDate != null) {
                            clickeddatetime = `<i class="icon ion-android-calendar" title="${$.datepicker.formatDate(" M dd yy", GetJavaScriptDateObj(value.ClickDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.ClickDate))}"></i>`;
                        }
                        else {
                            clickeddatetime = "";

                        }

                        if (value.IsRead > 0 && value.ReadDate != undefined && value.ReadDate != null) {
                            readdatetime = `<i class="icon ion-android-calendar" title="${$.datepicker.formatDate(" M dd yy", GetJavaScriptDateObj(value.ReadDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.ReadDate))}"></i>`;
                        }
                        else {
                            readdatetime = "";

                        }
                        const WhatsappData = `<tr>
                                            <td class="text-center">
                                                <div class="smsprevwrap prevwhatsapp" onclick="UCPUtil.PreviewTemplate('${value.TemplateName}', '${value.MessageContent.replace(/\n/g, '~n~')}', '${value.ButtonOneText}', '${value.ButtonOneType}', '${value.ButtonTwoText}', '${value.ButtonTwoType}', '${value.MediaFileURL}', '${value.TemplateType}');">
                                                        <i class="icon ion-ios-eye-outline"></i>
                                                </div>
                                            </td>
                                            <td class="text-left">${(value.TemplateName != undefined && value.TemplateName != null && value.TemplateName != "") ? value.TemplateName : "NA"}</td>
                                            <td class="text-right">${(value.PhoneNumber != undefined && value.PhoneNumber != null && value.PhoneNumber != "") ? value.PhoneNumber : "NA"}</td>
                                            <td> <div class="df-ac-sbet openrep"> <span>${value.IsDelivered}</span> ${delivereddatetime}</div> </td>
                                            <td> <div class="df-ac-sbet openrep"> <span>${value.IsRead}</span> ${readdatetime}</div></td>
                                            <td> <div class="df-ac-sbet openrep"> <span>${value.IsClicked}</span>${clickeddatetime} </div> </td>
                                            <td class="text-left">${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(value.SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.SentDate))}</td>
                                        </tr>`;
                        $("#ui_tbodyUCPWhatsappDetails").append(WhatsappData);
                    });
                }
                else {
                    $("#ui_tbodyUCPWhatsappDetails").empty().append(UCPUtil.NoDataFound(7));
                }

                IsUCPLoading.IsWhatsappLoading = true;
            },
            error: ShowAjaxError
        });
    },

    /**Web Push*/
    BindWebPush: function (mLUCPVisitor) {
        //mLUCPVisitor.FromDate = new Date(mLUCPVisitor.FromDate);
        //mLUCPVisitor.ToDate = new Date(mLUCPVisitor.ToDate);
        $.ajax({
            url: "/ManageContact/UCP/GetWebPushDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': mLUCPVisitor }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (WebPushList) => {
                if (WebPushList != undefined && WebPushList != null && WebPushList.Table1 != undefined && WebPushList.Table1 != null && WebPushList.Table1.length > 0) {
                    $("#ui_tbodyUCPWebPushDetails").empty();
                    $.each(WebPushList.Table1, (key, value) => {
                        const WebPushData = `<tr>
                                                <td class="text-center">
                                                    <div class="bnotifprevwrap"><i data-title="${value.Title}" data-desc="${value.MessageContent}"  data-icon="${value.IconImage}" data-banner="${value.BannerImage}" data-btn1="${value.Button1_Label}"  data-btn2="${value.Button2_Label}" class="icon ion-ios-eye-outline bnotiftemplate" data-toggle="popover" data-original-title="" title="" aria-describedby="popover76680"></i></div>
                                                </td>
                                                <td class="text-left">${value.TemplateName}</td>
                                                <td class="text-right">${value.Viewed}</td>
                                                <td class="text-right">${value.Clicked}</td>
                                                <td class="text-right">${value.Closed}</td>
                                                <td class="text-left">${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(value.SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.SentDate))}</td>
                                             </tr>`
                        $("#ui_tbodyUCPWebPushDetails").append(WebPushData);
                    });
                    UCPUtil.BindPreview();
                }
                else {
                    $("#ui_tbodyUCPWebPushDetails").empty().append(UCPUtil.NoDataFound(6));
                }
                IsUCPLoading.IsWebPushLoading = true;
            },
            error: ShowAjaxError
        });
    },
    /**Mobile Push*/
    BindMobilePush: function (mLUCPVisitor) {
        //mLUCPVisitor.FromDate = new Date(mLUCPVisitor.FromDate);
        //mLUCPVisitor.ToDate = new Date(mLUCPVisitor.ToDate);
        $.ajax({
            url: "/ManageContact/UCP/GetMobilePushDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': mLUCPVisitor }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (WebPushList) => {

                if (WebPushList != undefined && WebPushList != null && WebPushList.Table1 != undefined && WebPushList.Table1 != null && WebPushList.Table1.length > 0) {
                    $("#ui_tbodyUCPMoiblePushDetails").empty();
                    $.each(WebPushList.Table1, (key, value) => {
                        const WebPushData = `<tr>
                                                <td class="text-center">
                                                      <div class="bnotifprevwrap"><i data-title="${value.Title}" data-desc="${value.MessageContent}" data-subdesc="${value.SubTitle}" data-icon="" data-banner="${value.ImageURL}" data-btn1="${value.Button1Name}" data-btn2="${value.Button2Name}" class="icon ion-ios-eye-outline bnotiftemplate" data-toggle="popover" data-original-title="" title="" aria-describedby="popover76680"></i></div>
                                                </td>
                                                <td class="text-left">${value.TemplateName}</td>
                                                <td>${value.Viewed}</td>
                                                <td>${value.Clicked}</td>
                                                <td>${value.Closed}</td>
                                                <td>${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(value.SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.SentDate))}</td>
                                            </tr>`
                        $("#ui_tbodyUCPMoiblePushDetails").append(WebPushData);
                    });
                    UCPUtil.BindPreview();
                }
                else {
                    $("#ui_tbodyUCPMoiblePushDetails").empty().append(UCPUtil.NoDataFound(6));
                }

                IsUCPLoading.IsMobilePushLoading = true;
            },
            error: ShowAjaxError
        });
    },
    /**Common for both Web Push and Mobile Push */
    BindPreview: function () {

        $('.bnotiftemplate').click(function () {
            $(".bnotiftemplate").not(this).popover("hide");
        });

        $('.bnotiftemplate').popover({
            html: true,
            trigger: "hover",
            placement: "left",
            content: function () {

                if ($(this).attr("data-icon") != null && $(this).attr("data-icon") != "null" && $(this).attr("data-icon").length != 0) {
                    $(".notificonwrp").css("background-image", "url(" + $(this).attr("data-icon") + ")");
                }

                if ($(this).attr("data-banner") != null && $(this).attr("data-banner") != "null" && $(this).attr("data-banner").length != 0) {
                    $(".notifbanwrp").show(); $(".notifbanwrp").css("background-image", "url(" + $(this).attr("data-banner") + ")");
                } else { $(".notifbanwrp").hide(); }

                $("#notifsubbtn").hide(); $("#notifcanbtn").hide();
                $(".notiftitle").html($(this).attr("data-title"));
                $(".notifdescript").html($(this).attr("data-desc"));
                if ($(this).attr("data-btn1") != null && $(this).attr("data-btn1") != "null" && $(this).attr("data-btn1").length != 0) { $("#notifsubbtn").show(); $(".bnotbtn1").html($(this).attr("data-btn1")); }
                if ($(this).attr("data-btn2") != null && $(this).attr("data-btn2") != "null" && $(this).attr("data-btn2").length != 0) { $("#notifcanbtn").show(); $(".bnotbtn2").html($(this).attr("data-btn2")); }
                setInterval(function () { $(".popover-header").hide(); }, 100);
                return $(".bnotiftempwrp").html();
            }
        });

    },

    /**Calls*/
    BindCalls: function () {
        //mLUCPVisitor.FromDate = new Date(mLUCPVisitor.FromDate);
        //mLUCPVisitor.ToDate = new Date(mLUCPVisitor.ToDate);
        $.ajax({
            url: "/ManageContact/UCP/GetCallDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': mLUCPVisitor }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (CallList) => {

                if (CallList != undefined && CallList != null && CallList.Table1 != undefined && CallList.Table1 != null && CallList.Table1.length > 0) {
                    $("#ui_tbodyUCPCallDetails").empty();
                    $.each(CallList.Table1, (key, value) => {
                        let audiofile = `<audio controls><source src="${value.RecordedFileUrl}" type="audio/mpeg">Your browser does not support the audio element.</audio>`;
                        if (value.DownLoadStatus == false)
                            audiofile = `<audio controls><source src="${OnlineUrl}/TempFiles/VoiceCallRecorded/${value.Called_Sid}.mp3" type="audio/mpeg">Your browser does not support the audio element.</audio>`;
                        var UserName = "NA";
                        var _callednumber = value.CalledNumber;
                        var _username = JSLINQ(UserList).Where(function () {
                            return (this.MobilePhone == _callednumber);
                        });
                        if (_username.items[0] != null && _username.items[0] != "" && _username.items[0] != undefined) {
                            UserName = `${_username.items[0].FirstName}`;
                        }
                        const CallData = `<tr>
                                        <td class="text-left">${UserName}</td>
                                          <td>${value.CalledStatus == null ? "NA" : value.CalledStatus}</td>
                                        <td>${value.TotalCallDuration == null ? "NA" : value.TotalCallDuration}</td>
                                        <td>${value.Pickduration == null ? "NA" : value.Pickduration}</td>
                                        <td class="text-left">${audiofile}</td>
                                        <td>${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(value.CalledDate)) + " " + PlumbTimeFormat(value.CalledDate)}</td>
                                     </tr>`
                        $("#ui_tbodyUCPCallDetails").append(CallData);
                    });
                }
                else {
                    $("#ui_tbodyUCPCallDetails").empty().append(UCPUtil.NoDataFound(6));
                }

                IsUCPLoading.IsCallsLoading = true;
            },
            error: ShowAjaxError
        });
    },

    /**Transactions*/
    BindTransactions: function () {
        $.ajax({
            url: "/ManageContact/UCP/GetTransactionDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': mLUCPVisitor }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (TransactionList) => {
                if (TransactionList != undefined && TransactionList != null && TransactionList.Table1 != undefined && TransactionList.Table1 != null && TransactionList.Table1.length > 0) {
                    $("#ui_tbodyUCPTransactionDetails").empty();
                    $.each(TransactionList.Table1, (key, value) => {
                        const CallData = `<tr>
                                        <td class="text-left">${value.ProductName}</td>
                                        <td>${value.SuccessQty}</td>
                                        <td class="text-left">${value.SuccessPrice}</td>
                                        <td>${value.OrderId}</td>
                                        <td>${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(value.Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.Date))}</td>
                                      </tr>`
                        $("#ui_tbodyUCPTransactionDetails").append(CallData);
                    });
                }
                else {
                    $("#ui_tbodyUCPTransactionDetails").empty().append(UCPUtil.NoDataFound(5));
                }

                IsUCPLoading.IsTransactionsLoading = true;
            },
            error: ShowAjaxError
        });
    },

    /**Mobile App*/
    BindMobileApp: function (mLUCPVisitor) {
        //mLUCPVisitor.FromDate = new Date(mLUCPVisitor.FromDate);
        //mLUCPVisitor.ToDate = new Date(mLUCPVisitor.ToDate);
        $.ajax({
            url: "/ManageContact/UCP/GetMobileAppDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': mLUCPVisitor }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (MobileAppList) => {

                if (MobileAppList != undefined && MobileAppList != null && MobileAppList.Table1 != undefined && MobileAppList.Table1 != null && MobileAppList.Table1.length > 0) {
                    $("#ui_divtableMobileSession").empty();
                    const distinctSessionId = [...new Set(MobileAppList.Table1.map(x => x.SessionId))];
                    let SessionCount = distinctSessionId.length;

                    $.each(distinctSessionId, (key, value) => {
                        let MobileClickStrmData = '';
                        MobileAppList.Table1.forEach(function (item, i) {
                            if (item.SessionId == value) {
                                MobileClickStrmData += `<tr>
                                                            <td class="text-left">${item.ScreenName}</td>
                                                            <td class ="text-left">${item.Manufacturer}</td>
                                                            <td class ="text-left">${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(item.TrackerDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(item.TrackerDate))}</td>
                                                       </tr>`
                            }
                        });
                        const MobileClickStrmDatas = `<table class="table mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th class="m-p-w-150 td-wid-20" scope="col">Last Session ${SessionCount}</th>
                                                            <th class="m-p-w-150 td-wid-20" scope="col">Device Name</th>
                                                            <th class="m-p-w-130 td-wid-18" scope="col">Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="ui_tbodyUCPMobileAppDetails">
                                                        ${MobileClickStrmData}
                                                    </tbody>
                                                </table>`;
                        $("#ui_divtableMobileSession").append(MobileClickStrmDatas);
                        SessionCount--;
                    });
                }
                else {
                    const NoData = `<table class="table mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th class="m-p-w-150 td-wid-20" scope="col">Last Session</th>
                                                            <th class="m-p-w-150 td-wid-20" scope="col">Device Name</th>
                                                            <th class="m-p-w-130 td-wid-18" scope="col">Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="ui_tbodyUCPMobileAppDetails">
                                                          <td colspan="3" class="border-bottom-0">
                                                            <div class="no-data">There is no data for this view.</div>
                                                          </td>
                                                    </tbody>
                                                </table>`;
                    $("#ui_divtableSession").empty().append(NoData);
                }

                IsUCPLoading.IsMobileappLoading = true;
            },
            error: ShowAjaxError
        });
    },

    /**Reverse Look Up*/
    BindReverseLookUp: function () {
        HidePageLoading();
    },

    /**Notes*/
    BindNotes: function () {
        //mLUCPVisitor.FromDate = new Date(mLUCPVisitor.FromDate);
        //mLUCPVisitor.ToDate = new Date(mLUCPVisitor.ToDate);
        $.ajax({
            url: "/ManageContact/UCP/GetNoteList",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': mLUCPVisitor }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (NoteList) => {

                if (NoteList != undefined && NoteList != null && NoteList.length > 0) {
                    $("#ui_tbodyUPCNotes").empty();
                    $.each(NoteList, (key, value) => {
                        let Url = `${ClientImagePath}/ClientImages/${value.Attachment}`;
                        let attachment = value.Attachment != null && value.Attachment != undefined && value.Attachment.length > 0 ? `<a href="javascript:void(0)" onclick="forceDownload('${Url}','${value.Attachment}');">${value.Attachment}</a>` : "NA";
                        let UserName = value.UserInfoUserId != null && value.UserInfoUserId > 0 ? LmsDefaultFunctionUtil.GetAgentNameByUserId(value.UserInfoUserId) : "NA";
                        const NotesData = `<tr>
                                    <td class="text-left">${value.Content}</td>
                                    <td class="text-left">${UserName}</td>
                                    <td class="text-left">${attachment}</td>
                                    <td class="text-left">${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(value.Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.Date))}</td>
                                 </tr>`
                        $("#ui_tbodyUPCNotes").append(NotesData);
                    });

                }
                else {
                    $("#ui_tbodyUPCNotes").empty().append(UCPUtil.NoDataFound(3));
                }

                IsUCPLoading.IsNotesLoading = true;
            },
            error: ShowAjaxError
        });
    },

    /**Save Note*/
    SaveNotes: function () {
        ShowPageLoading();
        if (mLUCPVisitor.ContactId > 0) {
            let notesContent = CleanText($.trim($(".popover-body textarea[name='notes']").val()));
            if (CleanText($.trim(notesContent)).length > 0) {
                $.ajax({
                    url: "/ManageContact/UCP/SaveNotes",
                    type: 'POST',
                    data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'ContactId': mLUCPVisitor.ContactId, 'Notes': CleanText($.trim(notesContent)) }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: (response) => {
                        if (response != undefined && response != null && response.result) {
                            ShowSuccessMessage(GlobalErrorList.UCPMessage.Success);
                            if ($(".tables-Notes").is(":visible")) {
                                let totalRows = $("#ui_tbodyUPCNotes").length;
                                if (totalRows > 10) {
                                    $('#ui_tbodyUPCNotes:last-child').remove();
                                } else if (totalRows == 1) {
                                    let html = $("#ui_tbodyUPCNotes").html();
                                    if (html.toString().includes("There is no data for this view.")) {
                                        $("#ui_tbodyUPCNotes").empty();
                                    }
                                }

                                const NotesData = `<tr>
                                    <td class="text-left">${response.notes.Content}</td>
                                    <td class="text-left">${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response.notes.Date)) + " " + PlumbTimeFormat(response.notes.Date)}</td>
                                 </tr>`
                                $('#ui_tbodyUPCNotes').append(NotesData);
                            }
                            else {
                                $("#ui_anchorNoteUcpTab").click();
                            }

                            if ($(".popover-header").is(":visible")) {
                                $(".noteaccpopvr").click();
                            }

                            HidePageLoading();
                        }
                        else {
                            HidePageLoading();
                            ShowErrorMessage(GlobalErrorList.UCPMessage.Failed);
                        }
                    },
                    error: ShowAjaxError
                });
            }
            else {
                HidePageLoading();
                ShowErrorMessage(GlobalErrorList.UCPMessage.EnterNote);
            }
        }
        else {
            HidePageLoading();
            ShowErrorMessage(GlobalErrorList.UCPMessage.ContactNotFound);
        }
    },

    /**Lead History*/
    BindLeadHistory: function () {
        //mLUCPVisitor.FromDate = new Date(mLUCPVisitor.FromDate);
        //mLUCPVisitor.ToDate = new Date(mLUCPVisitor.ToDate);
        $('#ui_drpdwn_SelectHistoryFilters').selectpicker("deselectAll", true).selectpicker("refresh");
        $.ajax({
            url: "/ManageContact/UCP/GetLmsAuditDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': mLUCPVisitor }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (lmsHistory) => {

                if (lmsHistory.Status == true) {
                    if (lmsHistory.LeadsData != undefined && lmsHistory.LeadsData != null && lmsHistory.LeadsData.length > 1) {
                        $("#ui_UCPlmshistory").empty();
                        var dataBinded = false;
                        let filterLeadHistory = $('.filter-option-inner-inner').text().toLowerCase().replaceAll('nothing selected', '') != '' ? $('.filter-option-inner-inner').text().toLowerCase().replaceAll('nothing selected', '') : '';
                        for (var i = 1; i < lmsHistory.LeadsData.length; i++) {
                            for (var j = 0; j < leadHistoryFields.length; j++) {
                                if (lmsHistory.LeadsData[i - 1][leadHistoryFields[j]] != lmsHistory.LeadsData[i][leadHistoryFields[j]]) {
                                    var columnName = leadHistoryFields[j];
                                    var currentValue = lmsHistory.LeadsData[i - 1][leadHistoryFields[j]] != null && lmsHistory.LeadsData[i - 1][leadHistoryFields[j]] != undefined ? lmsHistory.LeadsData[i - 1][leadHistoryFields[j]] : "NA";
                                    var oldValue = lmsHistory.LeadsData[i][leadHistoryFields[j]] != null && lmsHistory.LeadsData[i][leadHistoryFields[j]] != undefined ? lmsHistory.LeadsData[i][leadHistoryFields[j]] : "NA";
                                    var updatedDate = lmsHistory.LeadsData[i - 1].UpdatedDate != null && lmsHistory.LeadsData[i - 1].UpdatedDate != undefined ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(lmsHistory.LeadsData[i - 1].UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(lmsHistory.LeadsData[i - 1].UpdatedDate)) : "NA";

                                    if (columnName.toLowerCase() == "username")
                                        columnName = "Handled By";
                                    else if (columnName.toLowerCase() == "score") {
                                        columnName = "Stage";
                                        oldValue = oldValue != null ? UCPUtil.FindStageBasedOnScore(oldValue) : "NA";
                                        currentValue = currentValue != null ? UCPUtil.FindStageBasedOnScore(currentValue) : "NA";
                                    }
                                    else if (columnName.toLowerCase() == "lmsgroupname")
                                        columnName = "Source";
                                    else if (columnName.toLowerCase().includes("customfield")) {
                                        if (ContactExtraFieldsForUCP != undefined && ContactExtraFieldsForUCP != null && ContactExtraFieldsForUCP.length > 0) {
                                            let cutomFieldIndex = columnName.length == 12 ? columnName.substring(columnName.length - 1, columnName.length) : columnName.substring(columnName.length - 2, columnName.length);
                                            columnName = ContactExtraFieldsForUCP[cutomFieldIndex - 1];
                                        }
                                    }
                                    else if (columnName.toLowerCase() == "reminderdate") {
                                        columnName = "Reminder Date";
                                        currentValue = currentValue != "NA" ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(currentValue)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(currentValue)) : "NA";
                                        oldValue = oldValue != "NA" ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(oldValue)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(oldValue)) : "NA";
                                    }
                                    else if (columnName.toLowerCase() == "followupdate") {
                                        columnName = "Follow-Up Date";
                                        currentValue = currentValue != "NA" ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(currentValue)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(currentValue)) : "NA";
                                        oldValue = oldValue != "NA" ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(oldValue)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(oldValue)) : "NA";
                                    } else if (columnName.toLowerCase() == "age") {
                                        columnName = "Age";
                                        currentValue = currentValue != "NA" ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(currentValue)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(currentValue)) : "NA";
                                        oldValue = oldValue != "NA" ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(oldValue)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(oldValue)) : "NA";
                                    } else if (columnName.toLowerCase() == "repeatleadcount") {
                                        columnName = "Repeat Lead";
                                        currentValue = updatedDate;
                                        oldValue = lmsHistory.LeadsData[i]["UpdatedDate"] != null && lmsHistory.LeadsData[i]["UpdatedDate"] != undefined ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(lmsHistory.LeadsData[i]["UpdatedDate"])) + " " + PlumbTimeFormat(GetJavaScriptDateObj(lmsHistory.LeadsData[i]["UpdatedDate"])) : "NA";
                                    }

                                    let historyHandledBy = lmsHistory.LeadsData[i - 1]["UserName"] != null ? lmsHistory.LeadsData[i - 1]["UserName"] : "NA";
                                    let historyStage = lmsHistory.LeadsData[i - 1]["Score"] != null ? UCPUtil.FindStageBasedOnScore(lmsHistory.LeadsData[i - 1]["Score"]) : "NA";
                                    let historySource = lmsHistory.LeadsData[i - 1]["LmsGroupName"] != null ? lmsHistory.LeadsData[i - 1]["LmsGroupName"] : "NA";
                                    let historyNotes = lmsHistory.LeadsData[i - 1]["Remarks"] != null ? lmsHistory.LeadsData[i - 1]["Remarks"] : "NA";

                                    if (filterLeadHistory != '') {
                                        if (filterLeadHistory.includes(columnName.toLowerCase())) {
                                            dataBinded = true;
                                            UCPUtil.AppendLeadHistory(columnName, currentValue, oldValue, updatedDate, historyHandledBy, historyStage, historySource, historyNotes);
                                        }
                                        else {
                                            if (filterLeadHistory.includes('contact') && columnName != 'Source' && columnName != 'Stage' && columnName != 'Handled By' && columnName != 'Repeat Lead') {
                                                dataBinded = true;
                                                UCPUtil.AppendLeadHistory(columnName, currentValue, oldValue, updatedDate, historyHandledBy, historyStage, historySource, historyNotes);
                                            }
                                        }
                                    }
                                    else {
                                        dataBinded = true;
                                        UCPUtil.AppendLeadHistory(columnName, currentValue, oldValue, updatedDate, historyHandledBy, historyStage, historySource, historyNotes);
                                    }
                                    UCPUtil.BindHistoryInfo();
                                }
                            }
                        }
                        if (!dataBinded)
                            $("#ui_UCPlmshistory").empty().append(UCPUtil.NoDataFound(4));
                    }
                    else {
                        $("#ui_UCPlmshistory").empty().append(UCPUtil.NoDataFound(4));
                    }
                } else {
                    $("#ui_UCPlmshistory").empty().append(UCPUtil.NoDataFound(4));
                }

                IsUCPLoading.IsLeadHistoryLoading = true;
            },
            error: ShowAjaxError
        });
    },
    BindHistoryInfo: function () {
        $('.inficon').popover({
            html: true,
            trigger: "hover",
            placement: "right",
            content: function () {
                $("#ui_small_HistoryHandledBy").html($(this).attr("data-handledBy"));
                $("#ui_small_HistoryStage").html($(this).attr("data-Stage"));
                $("#ui_small_HistorySource").html($(this).attr("data-Source"));
                $("#ui_small_HistoryNotes").html($(this).attr("data-Notes"));
                return $(".leadhistmore").html();
            }
        });
    },
    FindStageBasedOnScore: function (Score) {
        let currentSample = JSLINQ(allStageDetails).Where(function () {
            return (this.Score == Score);
        });
        let currentValue = currentSample.items[0] != undefined && currentSample.items[0].Stage.length > 0 ? currentSample.items[0].Stage : "NA";
        return currentValue;
    },
    AppendLeadHistory: function (columnName, currentValue, oldValue, updatedDate, historyHandledBy, historyStage, historySource, historyNotes) {
        const HistoryData = `<tr>
                                <td class="text-left">
                                    ${columnName}
                                    <i class="icon ion-ios-information inficon" data-toggle="popover" data-trigger="hover" data-handledBy="${historyHandledBy}" data-Stage="${historyStage}" data-Source="${historySource}" data-Notes="${historyNotes}"></i>
                                </td>
                                <td class="text-left"><p class="text-color-blue mb-0">${currentValue}</p></td>
                                <td class="text-left">${oldValue}</td>
                                <td class="text-left">${updatedDate}</td>
                            </tr>`;
        $("#ui_UCPlmshistory").append(HistoryData);
    },
    /**Chat History*/
    BindChatHistory: function () {
        //mLUCPVisitor.FromDate = new Date(mLUCPVisitor.FromDate);
        //mLUCPVisitor.ToDate = new Date(mLUCPVisitor.ToDate);
        $.ajax({
            url: "/ManageContact/UCP/GetPastChatDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': mLUCPVisitor }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (responce) => {
                $("#ui_chattextdetails").empty();
                if (responce != null && responce.dates && responce.chatTranscript != null) {
                    let dates = responce.dates;
                    let transcript = responce.chatTranscript;
                    let chatArray = [];
                    for (let i = 0; i < dates.length; i++) {
                        chatArray.length = 0;
                        for (let j = 0; j < transcript.length; j++) {
                            if (transcript[j].ChatDateString == dates[i].ChatDate) {
                                chatArray.push(transcript[j]);
                            }
                        }
                        UCPUtil.BindChatTranscript(chatArray);
                    }
                } else {
                    const NoData = `<div class="no-data">There is no data for this view.</div>`;
                    $("#ui_chattextdetails").empty().append(NoData);
                }

                IsUCPLoading.IsChatHistoryLoading = true;
            },
            error: ShowAjaxError
        });
    },
    BindChatTranscript: function (chatArray) {
        let textChat = ``;
        $.each(chatArray, function () {
            if ($(this)[0].IsAdmin == 1) {
                textChat += `
                            <div class="media mb-4">
                                <div class="agentimgwrp" title="chat agent"></div>
                                <div class="media-body">
                                    <div class="msgagent">
                                        <p>${$(this)[0].ChatText}</p>
                                    </div>
                                </div>
                            </div>
                          `;
            } else {
                textChat += `
                         <div class="media mb-4">
                                <div class="media-body reverse">
                                    <div class="msgagent">
                                        <p>
                                            ${$(this)[0].ChatText}
                                        </p>
                                    </div>
                                </div>
                             <div class="chatuserimgwrp" title="visitor"></div>
                        </div>
                       `;
            }
        });

        let mailContent = `<div class="chatmediawrp p-3">
                                 ${textChat}
                                <div class="chatdatewrp text-center">
                                    <p class="chatdate">${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(chatArray[0].ChatDate))}</p>
                                </div>
                           </div>
                          `;

        $("#ui_chattextdetails").append(mailContent);
    },
    /**Chat History*/

    /**Adpot UI tab*/
    AdpotTabMore: function () {
        const container = document.querySelector(".tabs");
        const primary = container.querySelector(".-primary");
        const primaryItems = container.querySelectorAll(".-primary > li:not(.-more)");
        container.classList.add("--jsfied");
        const morebutton = `<li class="-more">
                        <button type="button" aria-haspopup="true" aria-expanded="false">More <span>&darr;</span></button>
                        <ul class="-secondary">${primary.innerHTML}</ul>
                    </li>`;
        // insert "more" button and duplicate the list
        primary.insertAdjacentHTML("beforeend", morebutton);
        const secondary = container.querySelector(".-secondary");
        const secondaryItems = secondary.querySelectorAll("li");
        const allItems = container.querySelectorAll("li");
        const moreLi = primary.querySelector(".-more");
        const moreBtn = moreLi.querySelector("button");
        moreBtn.addEventListener("click", (e) => {
            e.preventDefault();
            container.classList.toggle("--show-secondary");
            moreBtn.setAttribute("aria-expanded", container.classList.contains("--show-secondary"));
        });

        // adapt tabs

        const doAdapt = () => {
            // reveal all items for the calculation
            allItems.forEach((item) => {
                item.classList.remove("--hidden");
            });

            // hide items that won't fit in the Primary
            let stopWidth = moreBtn.offsetWidth;
            let hiddenItems = [];
            const primaryWidth = primary.offsetWidth;
            primaryItems.forEach((item, i) => {
                if (primaryWidth >= stopWidth + item.offsetWidth) {
                    stopWidth += item.offsetWidth;
                } else {
                    item.classList.add("--hidden");
                    hiddenItems.push(i);
                }
            });

            // toggle the visibility of More button and items in Secondary
            if (!hiddenItems.length) {
                moreLi.classList.add("--hidden");
                container.classList.remove("--show-secondary");
                moreBtn.setAttribute("aria-expanded", false);
            } else {
                secondaryItems.forEach((item, i) => {
                    if (!hiddenItems.includes(i)) {
                        item.classList.add("--hidden");
                    }
                });
            }
        };

        doAdapt();
        window.addEventListener("resize", doAdapt); // adapt on window resize

        // hide Secondary on the outside click

        document.addEventListener("click", (e) => {
            let el = e.target;
            while (el) {
                if (el === secondary || el === moreBtn) {
                    return;
                }
                el = el.parentNode;
            }
            container.classList.remove("--show-secondary");
            moreBtn.setAttribute("aria-expanded", false);
        });
    },

    /**Header Date*/
    GetUTCDateTimeRangeForUCP: function (dateDuration) {
        let fromdate, todate;

        if (dateDuration == 1) {
            fromdate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));
            todate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));
        }
        else if (dateDuration == 2) {
            fromdate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));
            todate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));

            fromdate.setDate(todate.getDate() - 6);

        }
        else if (dateDuration == 3) {
            fromdate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));
            todate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));

            fromdate.setMonth(todate.getMonth() - 1);
            fromdate.setDate(fromdate.getDate() + 1);

        }
        else if (dateDuration == 5) {
            if ($("#ui_txtStartDateUCP").val().length == 0 && $("#ui_txtEndDateUCP").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.daterange_error);
                $("#ui_txtStartDateUCP").focus();
                return false;
            }

            if ($("#ui_txtStartDateUCP").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.from_date_range_error);
                $("#ui_txtStartDateUCP").focus();
                return false;
            }

            if ($("#ui_txtEndDateUCP").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.to_date_range_error);
                $("#ui_txtEndDateUCP").focus();
                return false;
            }

            LocalFromdate = $("#ui_txtStartDateUCP").val();
            LocalTodate = $("#ui_txtEndDateUCP").val();

            if (UCPUtil.IsGreaterThanTodayDate(LocalFromdate)) {
                ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.from_date_Exceeded_error);
                $("#ui_txtStartDateUCP").focus();
                return false;
            }

            if (UCPUtil.IsGreaterThanTodayDate(LocalTodate)) {
                ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.to_date_Exceeded_error);
                $("#ui_txtEndDateUCP").focus();
                return false;
            }

            if (UCPUtil.isFromBiggerThanTo(LocalFromdate, LocalTodate)) {
                ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.from_date_less_then_error);
                $("#ui_txtStartDateUCP").focus();
                return false;
            }

            fromdate = new Date(LocalFromdate);
            todate = new Date(LocalTodate);
        }
        else {
            ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.selection_error);
            return false;
        }

        let FromDateTime_JsDate = fromdate;
        let ToDateTime_JsDate = todate;

        let startdate = fromdate.getFullYear() + '-' + UCPUtil.AddingPrefixZeroDayMonth((fromdate.getMonth() + 1)) + '-' + UCPUtil.AddingPrefixZeroDayMonth(fromdate.getDate()) + " 00:00:00";
        let enddate = todate.getFullYear() + '-' + UCPUtil.AddingPrefixZeroDayMonth((todate.getMonth() + 1)) + '-' + UCPUtil.AddingPrefixZeroDayMonth(todate.getDate()) + " 23:59:59";


        fromdate = ConvertDateTimeToUTC(startdate);
        fromdate = fromdate.getFullYear() + '-' + UCPUtil.AddingPrefixZeroDayMonth((fromdate.getMonth() + 1)) + '-' + UCPUtil.AddingPrefixZeroDayMonth(fromdate.getDate()) + " " + UCPUtil.AddingPrefixZeroDayMonth(fromdate.getHours()) + ":" + UCPUtil.AddingPrefixZeroDayMonth(fromdate.getMinutes()) + ":" + UCPUtil.AddingPrefixZeroDayMonth(fromdate.getSeconds());

        todate = ConvertDateTimeToUTC(enddate);
        todate = todate.getFullYear() + '-' + UCPUtil.AddingPrefixZeroDayMonth((todate.getMonth() + 1)) + '-' + UCPUtil.AddingPrefixZeroDayMonth(todate.getDate()) + " " + UCPUtil.AddingPrefixZeroDayMonth(todate.getHours()) + ":" + UCPUtil.AddingPrefixZeroDayMonth(todate.getMinutes()) + ":" + UCPUtil.AddingPrefixZeroDayMonth(todate.getSeconds());

        FromDateTime = fromdate;
        ToDateTime = todate;
        CallBackUPCFunction(FromDateTime, ToDateTime);
    },

    AddingPrefixZeroDayMonth: function (n) {
        return (n < 10) ? ("0" + n) : n;
    },
    IsGreaterThanTodayDate: function (chkdate) {
        var todayDate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] })).toISOString().slice(0, 10);
        var from = new Date(chkdate).getTime();
        var to = new Date(todayDate).getTime();
        return from > to;
    },
    isFromBiggerThanTo: function (dtmfrom, dtmto) {
        var from = new Date(dtmfrom).getTime();
        var to = new Date(dtmto).getTime();
        return from > to;
    },
    AnimateToTop: function () {
        $("html, body").animate({
            scrollTop: 0
        }, "slow");
        return false;
    },
    GetUserName: function (UserInfoList) {
        var UserIds = [UserInfoList[0].CreatedUserInfoUserId, UserInfoList[1].LastModifyByUserId];
        $.ajax({
            url: "/ManageUsers/Users/GetUser",
            type: 'POST',
            data: JSON.stringify({ 'UserIds': UserIds }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (responce) => {
                IsUCPLoading.IsUserName = true;
                if (responce != null && responce.length > 0) {

                    let UserInfoUser = JSLINQ(responce).Where(function () {
                        return (this.UserId == UserInfoList[0].CreatedUserInfoUserId);
                    });

                    if (UserInfoUser != null && UserInfoUser.items.length > 0) {
                        $("#ui_createduserinfouserid").html(UserInfoUser.items[0].FirstName);
                        //UCPUtil.BindBasicDetailsHtml(UserInfoList[0].CreatedByUserName, UserInfoUser.items[0].FirstName);
                    } else {
                        $("#ui_createduserinfouserid").html("NA");
                        //UCPUtil.BindBasicDetailsHtml(UserInfoList[0].CreatedByUserName, "NA");
                    }


                    let LastModifiedUserInfo = JSLINQ(responce).Where(function () {
                        return (this.UserId == UserInfoList[1].LastModifyByUserId);
                    });
                    if (LastModifiedUserInfo != null && LastModifiedUserInfo.items.length > 0) {
                        $("#ui_lastmodifybyuserid").html(LastModifiedUserInfo.items[0].FirstName);
                        //UCPUtil.BindBasicDetailsHtml(UserInfoList[1].LastModifyByUser, LastModifiedUserInfo.items[0].FirstName);
                    } else {
                        //$("#ui_lastmodifybyuserid").html(LastModifiedUserInfo.items[0].FirstName);
                        UCPUtil.BindBasicDetailsHtml(UserInfoList[1].LastModifyByUser, "NA");
                    }
                }
            },
            error: ShowAjaxError
        });
    },
    BindBasicDetailsHtml: function (propertyName, value) {
        const html = `<div class="row pb-2">
                                    <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                        <strong>${propertyName}:</strong>
                                    </div>
                                    <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6">${value}</div>
                                 </div>`;
        $("#ui_VisitorContactDetails").append(html);
    },

    GetCustomDateAndBind: function (checkconttab, FirstTime) {
        //mLUCPVisitor.FromDate = new Date(mLUCPVisitor.FromDate);
        //mLUCPVisitor.ToDate = new Date(mLUCPVisitor.ToDate);
        $.ajax({
            url: "/ManageContact/UCP/GetFromAndToDate",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': mLUCPVisitor, 'Module': checkconttab.toLowerCase() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                IsUCPLoading.IsCustomDateAndBindLoading = true;

                if (FirstTime) {
                    UCPUtil.GetMchineIdsByContactId(mLUCPVisitor);
                    UCPUtil.GetDeviceIdsByContactId(mLUCPVisitor);
                }

                if (response != undefined && response != null && response.Table1 != null && response.Table1.length > 0) {
                    let DateTime = response.Table1[0];
                    if (DateTime.FromDate != null && DateTime.ToDate != null) {
                        mLUCPVisitor.FromDate = DateTime.FromDate.replace("T", " "); //`${DateTime.FromDate.split('T')[0]} 18:30:00`;
                        mLUCPVisitor.ToDate = DateTime.ToDate.replace("T", " "); //`${DateTime.ToDate.split('T')[0]} 18:29:59`;
                        $('.selectdateDropdownUCP').html("Custom Date Range");
                        $(".dateBoxWrapUCP").addClass("showFlx");
                        let UCPFromDay = DateTime.FromDate.split('T')[0].split('-')[2];
                        let UCPFromMonth = DateTime.FromDate.split('T')[0].split('-')[1];
                        let UCPFromYear = DateTime.FromDate.split('T')[0].split('-')[0];
                        $("#ui_txtStartDateUCP").val(`${UCPFromMonth}/${UCPFromDay}/${UCPFromYear}`);
                        let UCPToDay = DateTime.ToDate.split('T')[0].split('-')[2];
                        let UCPToMonth = DateTime.ToDate.split('T')[0].split('-')[1];
                        let UCPToYear = DateTime.ToDate.split('T')[0].split('-')[0];
                        $("#ui_txtEndDateUCP").val(`${UCPToMonth}/${UCPToDay}/${UCPToYear}`);
                        if (FirstTime) {
                            UCPUtil.ShowContactUCP(mLUCPVisitor);
                        } else {
                            UCPUtil.setTabAbount();
                            UCPUtil.DecideAndBindUcpTab(checkconttab);
                            UCPUtil.BindWebSummary(mLUCPVisitor);
                            UCPUtil.BindMobileSummary(mLUCPVisitor);
                        }
                    } else {
                        $(".dateBoxWrapUCP").removeClass("showFlx");
                        $('.selectdateDropdownUCP').html("This Month");
                        UCPUtil.GetUTCDateTimeRangeForUCP(3);
                    }
                } else {
                    $(".dateBoxWrapUCP").removeClass("showFlx");
                    $('.selectdateDropdownUCP').html("This Month");
                    UCPUtil.GetUTCDateTimeRangeForUCP(3);
                }
            },
            error: ShowAjaxError
        });
    },
    ShowAllUCPDetails: function (MachineId, DeviceId, ContactId) {
        ShowPageLoading();
        UCPUtil.SetFalseTabLoading();
        $(".ucpnameclse").click();
        $("#ui_divContactUCPScreen").removeClass("hideDiv");
        mLUCPVisitor.MachineId = MachineId; mLUCPVisitor.DeviceId = DeviceId == null ? "" : DeviceId; mLUCPVisitor.ContactId = ContactId == null ? 0 : ContactId;
        GobleMachineId = MachineId;
        GobleDeviceId = DeviceId;
        GobleContactId = ContactId;
        UCPUtil.GetBasicDetails(mLUCPVisitor);
        $("#ui_anchorUcpTab_1").click();
        UCPUtil.BindWebSummary(mLUCPVisitor);
        UCPUtil.BindMobileSummary(mLUCPVisitor);
        $("#ui_UCPJourneyData").parent().addClass("active");
        checkconttab = $(".tab-ucp-links").attr("data-ucpconttab");
        if (checkconttab != undefined && checkconttab != null && checkconttab.length > 0) {
            $(`a[data-ucpconttab=${checkconttab}]`).parent().addClass("active");
            UCPUtil.GetCustomDateAndBind(checkconttab.toLowerCase(), true);
        }
        else {
            ShowErrorMessage(GlobalErrorList.UCPMessage.PermissionDenied);
            HidePageLoading();
        }
        clearTimeIntervalofUCP = setInterval(IsUCPLoadingToHide, 1000);
        $(".dateclseWrapUCP").click();
    },
    SaveNameDetails: function (Name) {
        ShowPageLoading();
        if (mLUCPVisitor.ContactId > 0) {
            $.ajax({
                url: "/ManageContact/UCP/SaveContactName",
                type: 'POST',
                data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'ContactId': mLUCPVisitor.ContactId, 'Name': Name }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: (response) => {
                    if (response > 0) {
                        ShowSuccessMessage(GlobalErrorList.UCPMessage.ContactName);
                    }
                    else {
                        ShowErrorMessage(GlobalErrorList.UCPMessage.UnableToSave);
                    }
                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        }
    },
    PreviewTemplate: function (TempName, TemplateContent, ButtonOneText, ButtonOneType, ButtonTwoText, ButtonTwoType, MediaFileURL, templtypeItem) {
        UCPUtil.RefreshPreviewPopUp();
        $(".popupsubtitle").text(TempName);
        $("#addwhatsapptext, #addwhatsapptextios").text(TemplateContent.replace(/~n~/g, "\n"));

        if (ButtonOneText != null && ButtonOneText != '' && ButtonOneText != "null") {
            $("#spn_whatsvisitwebsite, #spn_whatsvisitwebsiteios").text(ButtonOneText);
            $("#ui_div_AndrButtn, #ui_div_IosButtn, #whatsvisitwebsite, #whatsvisitwebsiteios").removeClass("hideDiv");
            if (ButtonOneType != null && ButtonOneType != '' && ButtonOneType != "null") {
                if (ButtonOneType == "Website") {
                    $("#imgBtn1, #imgBtn1ios").addClass("fa fa-external-link");
                    if ($("#imgBtn1, #imgBtn1ios").hasClass("fa-phone"))
                        $("#imgBtn1, #imgBtn1ios").removeClass("fa-phone");
                } else if (ButtonOneType == "Call") {
                    $("#imgBtn1, #imgBtn1ios").addClass("fa fa-phone");
                    if ($("#imgBtn1, #imgBtn1ios").hasClass("fa-external-link"))
                        $("#imgBtn1, #imgBtn1ios").removeClass("fa-external-link");
                }
            }
        }

        if (ButtonTwoText != null && ButtonTwoText != '' && ButtonTwoText != "null") {
            $("#spn_whatscallphone, #spn_whatscallphoneios").text(ButtonTwoText);
            $("#whatscallphone, #whatscallphoneios").removeClass("hideDiv");
            if (ButtonTwoType != null && ButtonTwoType != '' && ButtonTwoType != "null") {
                if (ButtonTwoType == "Website") {
                    $("#imgBtn2, #imgBtn2ios").addClass("fa fa-external-link");
                    if ($("#imgBtn2, #imgBtn2ios").hasClass("fa-phone"))
                        $("#imgBtn2, #imgBtn2ios").removeClass("fa-phone");
                } else if (ButtonTwoType == "Call") {
                    $("#imgBtn2, #imgBtn2ios").addClass("fa fa-phone");
                    if ($("#imgBtn2, #imgBtn2ios").hasClass("fa-external-link"))
                        $("#imgBtn2, #imgBtn2ios").removeClass("fa-external-link");
                }
            }
        }

        if (MediaFileURL != null && MediaFileURL != '' && MediaFileURL != "null") {
            //$("#addwhatsappimage, #addwhatsappimageIos").attr("src", MediaFileURL);

            if (templtypeItem == "text") {
                $("#whatsappuploadtype, #mediaurlmain, #mediauploadfiles, .whatsappimgwrp").addClass("hideDiv");

            } else if (templtypeItem == "image") {
                $("#whatsappuploadtype, #mediaurlmain, .whatsappimgwrp").removeClass("hideDiv");
                $("#addwhatsappimage, #addwhatsappimageIos").attr(
                    "src",
                    "/Content/images/white_image.png"
                );
            } else if (templtypeItem == "video") {
                $("#whatsappuploadtype, #mediaurlmain, .whatsappimgwrp").removeClass(
                    "hideDiv"
                );
                $("#addwhatsappimage, #addwhatsappimageIos").attr(
                    "src",
                    "/Content/images/white_video.png"
                );
            } else if (templtypeItem == "document") {
                $("#whatsappuploadtype, #mediaurlmain, .whatsappimgwrp").removeClass(
                    "hideDiv"
                );
                $("#addwhatsappimage, #addwhatsappimageIos").attr(
                    "src",
                    "/Content/images/white_document.png"
                );
            } else {
                $("#whatsappuploadtype, #mediaurlmain, .whatsappimgwrp").removeClass(
                    "hideDiv"
                );
                $("#addwhatsappimage, #addwhatsappimageIos").attr(
                    "src",
                    "/Content/images/white_location.png"
                );
            }

            $(".whatsappimgwrp").removeClass("hideDiv");
        }

        $(".popuptitlwrp h6").text("Preview Template");

        $("#whatsappprevpopup").removeClass("hideDiv");
    },
    RefreshPreviewPopUp: function () {
        $("#ui_div_AndrButtn, #ui_div_IosButtn, #whatsvisitwebsite, #whatsvisitwebsiteios, #whatscallphone, #whatscallphoneios, .whatsappimgwrp").addClass("hideDiv");
    },

    CustomeventsGetReport: function (customeventoverviewid) {

        if (cstmachineid == "")
            cstmachineid = mLUCPVisitor.MachineId;
        var contactDetailscustevents = {
            ContactId: 0, EmailId: "", PhoneNumber: "", Name: ""
        };
        if (mLUCPVisitor.ContactId == null)
            mLUCPVisitor.ContactId = 0;
        var filterEventData = { EventData1: "" };
        //BindFilterContents();
        /*$("#custeventdropdowns").append(' <option value="select">Select</option>');*/
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/CustomEvents/ViewCustomEventData/UCPGetEventsReportData",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'OffSet': OffSet, 'FetchNext': FetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'customeventoverviewid': customeventoverviewid, 'ContactId': mLUCPVisitor.ContactId, 'contact': contactDetailscustevents, 'machineid': cstmachineid, 'customevents': filterEventData }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: UCPUtil.CustomEventsBindReport,
            error: ShowAjaxError
        });
    },

    CustomEventsBindReport: function (response) {
        if (response != undefined && response.length > 0 && response != null) {
            //UCPUtil.GetCstEventsData();
            UCPUtil.UCPEventMappingDetails(response[0].CustomEventOverViewId);
            customeventoverviewidfortriffer = response[0].CustomEventOverViewId;
            $("#ui_trheadReportDatacstevents").empty();
            SetNoRecordContent('ui_tableReport', 12, 'cstevents');
            if (response != undefined && response != null && response.length > 0) {

                CustomEventsReport = response;

                CurrentRowCount = response.length;
                PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

                $("#tblbodycstevents").html('');
                $("#tblbodycstevents").empty();
                $("#ui_tableReport").removeClass('no-data-records');

                let reportTableheaderstatic = `<th class="helpIcon m-p-w-190 td-wid-30" scope="col">
                                            Purchased Date</th>
                                            <th scope="col" class="helpIcon m-p-w-190 td-wid-30">Product Name</th>`
                let reportTableheader = "";
                for (let i = 0; i < UCPEventExtraFiledsName.length; i++) {
                    reportTableheader += "<th class='helpIcon m - p - w - 150 td - wid - 15' scope='col'>" + UCPEventExtraFiledsName[i].FieldName + "</th >";
                    if (i == 3)
                        break;
                }
                var finaltable = reportTableheaderstatic + reportTableheader;

                $("#ui_trheadReportDatacstevents").append("<tr>" + finaltable + "</tr>");


                $.each(response, function (i) {
                    UCPUtil.CustomeventsBindEachReport(this, i);
                });

            }


        }
        else {

            $("#tblbodycstevents").empty();
            const NoData = `<table class="table mb-0">
                                        <thead>
                                            <tr>
                                                <th class="helpIcon m-p-w-190 td-wid-30" scope="col">
                                                Product Name</th>
                                                <th scope="col" class="helpIcon m-p-w-190 td-wid-30"> 
                                                Total Quantity</th>
                                                <th class="helpIcon m-p-w-150 td-wid-15" scope="col">
                                                Total Price</th>
                                                <th class="helpIcon m-p-w-160 td-wid-20" scope="col">
                                                Order Id</th>
                                                <th class="helpIcon m-p-w-190 td-wid-20" scope="col">
                                                Purchased Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td colspan="5" class="border-bottom-0">
                                                    <div class="no-data">There is no data for this view.</div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>`;
            $("#ui_trheadReportDatacstevents").empty().append(NoData);
            //$("#custeventdropdowns").empty();

            $("#custeventdropdowns").select2().val('Select').trigger('change');
        }


    },

    CustomeventsBindEachReport: function (CustomEventsReport, index) {
        if (UCPEventExtraFiledsName.length > 0) {
            var ucplengthofheader = 4;
            if (UCPEventExtraFiledsName.length < 4)
                ucplengthofheader = UCPEventExtraFiledsName.length;

            let tablerow = '';
            for (let i = 0; i < ucplengthofheader; i++) {
                tablerow += `<td>${CustomEventsReport["EventData" + (i + 1)] == null ? "NA" : CustomEventsReport["EventData" + (i + 1)]}</td>;`
            }
            ShowExportDiv(true);
            ShowPagingDiv(true);
            let reportTable = `<tr>
                                 <td>
                                <div class="machidcopywrp">
                                <p class="pushmachidtxt">
                                ${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj((CustomEventsReport.EventTime))) + " " + PlumbTimeFormat(GetJavaScriptDateObj((CustomEventsReport.EventTime)))}
                                  </p>
                                 <i class="icon ion-ios-information  viewcustdata"  onclick='UCPUtil.BindIndividualEventDetails(${CustomEventsReport.CustomEventOverViewId},${CustomEventsReport.ContactId},${CustomEventsReport.Id});'></i>
                                     </div>
                                </td>
                                     <td class="text-left">
                                        <div class="nameTxtWrap custeventname">
                                        <span> ${CustomEventsReport.EventName}</span>
                                        
                                    </td>
                                ${tablerow}
                                </tr>`;
            $("#tblbodycstevents").append(reportTable);
        }
        HidePageLoading();
    },
    UCPEventMappingDetails: function (ucpcustomEventOverViewId) {
        UCPEventExtraFiledsName = [];

        $.ajax({
            url: "/CustomEvents/CustomEventsOverview/UCPGetEventExtraFieldData",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'customEventOverViewId': ucpcustomEventOverViewId, 'fromDateTime': null, 'toDateTime': null, 'contactid': 0 }),

            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (response) {
                UCPEventExtraFiledsName = response;


            },

            error: ShowAjaxError
        });
    },
    GetCstEventsData: function () {
        CustomEventName = CleanText($.trim($('#txt_SearchBy').val()));
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/CustomEvents/ViewCustomEventData/UCPGetEventnames",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'OffSet': OffSet, 'FetchNext': FetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'CustomEventName': '', 'contactid': mLUCPVisitor.ContactId, 'customeventoverviewid': 0, 'machineid': cstmachineid }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: UCPUtil.CstEventsDropDownData,
            error: ShowAjaxError
        });
    },
    CstEventsDropDownData: function (response) {
        $("#custeventdropdowns").empty();
        $("#custeventdropdowns").append(' <option value="select">Select</option>');

        ShowExportDiv(true);
        if (response != undefined && response != null && response.length > 0) {
            CustomEventsReport = response;
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);


            $.each(response, function () {
                $("#custeventdropdowns").append('<option value="' + this.CustomEventOverViewId + '">' + this.EventName + '</option>');
            });
            dropdowntriggerstatus = 1;
            $("#custeventdropdowns").select2().val(customeventoverviewidfortriffer).trigger('change');
        }
        else
            $("#custeventdropdowns").select2().val('Select').trigger('change');
        HidePageLoading();

    },
    BindIndividualEventDetails: function (CustomEventOverViewIds, ContactId, cstId) {
        ShowPageLoading();

        $("#ui_tblReportDataPopUp").empty();
        $(".popuptitlwrp h6").text("Event Details");
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/CustomEvents/ViewCustomEventData/GetEventsDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'OffSet': OffSet, 'FetchNext': FetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'customeventoverviewid': parseInt(CustomEventOverViewIds), 'ContactId': ContactId, 'id': cstId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response.length != 0 && response != null) {
                    var fieldsContent = "";
                    $(".popupsubtitle").html(response[0].EventName);
                    $.each(response, function () {
                        for (var a = 0; a < UCPEventExtraFiledsName.length; a++) {
                            fieldsContent += "<tr><td>" + UCPEventExtraFiledsName[a].FieldName + "</td> <td>" + ($(this)[0]["EventData" + (a + 1)] == null ? "NA" : $(this)[0]["EventData" + (a + 1)]) + "</td></tr>";
                        }
                    });

                    $("#ui_tblReportDataPopUp").append(fieldsContent);
                    $("#viewcustdatapop").removeClass("hideDiv");
                    $("#dvAddOrUpdateReports").addClass('hideDiv')
                }
                else {
                    SetNoRecordContent('ui_tblReportDataPopUp', 2, 'cstevents');
                }
                HidePageLoading();

            },
            error: ShowAjaxError
        });

    },
};

function CallBackUPCFunction() {
    mLUCPVisitor.FromDate = FromDateTime;
    mLUCPVisitor.ToDate = ToDateTime;
    UCPUtil.ShowContactUCP(mLUCPVisitor);
}


$(document).ready(() => {
    UCPUtil.GetContactExtraField();
    UCPUtil.GetStageScore();
    LeadsPageDocumentReadyUtil.UCPInitialTemp();

    $('.contEmailId .ion-ios-email').popover({
        trigger: 'click',
        placement: "bottom"
    });

    $('.contPhoneNum .ion-ios-telephone').popover({
        trigger: 'click',
        trigger: 'click',
        placement: "bottom"
    });

    $('.contcompose .ion-android-textsms').popover({
        trigger: 'click',
        trigger: 'click',
        placement: "bottom"
    });

    $('.contcompose .ion-social-whatsapp-outline').popover({
        trigger: 'click',
        trigger: 'click',
        placement: "bottom"
    });

    $(".accpopvr").click(function () {
        $(".accpopvr").not(this).popover("hide");
    });

    $('.contcompose .ion-compose').popover({
        html: true,
        trigger: "click",
        placement: "bottom",
        content: function () {
            return $(".contNoteWrap").html();
        }
    });
});
var cstmachineid = "";
function cstShowContactUCP(MachineId, DeviceId, ContactId) {
    cstmachineid = MachineId;
    if (ContactId != "")
        ShowContactUCP("", DeviceId, ContactId)
    else
        ShowContactUCP(MachineId, DeviceId, ContactId)
}
function ShowContactUCP(MachineId, DeviceId, ContactId, Permission) {
    UCPUtil.ShowAllUCPDetails(MachineId, DeviceId, ContactId);
    if (Permission != null) {
        IsEmailViewPermission = Permission.IsEmailViewPermission;
        IsSmsViewPermission = Permission.IsSmsViewPermission;
        IsCallViewPermission = Permission.IsCallViewPermission;
        IsWhatsAppViewPermission = Permission.IsWhatsAppViewPermission;
    }
}


function IsUCPLoadingToHide() {
    if (IsUCPLoading.IsCustomDateAndBindLoading && IsUCPLoading.IsMchineIdsByContactId && IsUCPLoading.IsDeviceIdsByContactId && IsUCPLoading.IsAbout
        && IsUCPLoading.IsUserName && IsUCPLoading.IsWebSummaryLoading && IsUCPLoading.IsMobileSummaryLoading
        && IsUCPLoading.IsUserJourneyLoading && IsUCPLoading.IsClickStream && IsUCPLoading.IsWebLoading && IsUCPLoading.IsEmailsLoading && IsUCPLoading.IsSmsLoading
        && IsUCPLoading.IsCallsLoading && IsUCPLoading.IsTransactionsLoading && IsUCPLoading.IsMobileappLoading && IsUCPLoading.IsNotesLoading && IsUCPLoading.IsLeadHistoryLoading
        && IsUCPLoading.IsChatHistoryLoading && IsUCPLoading.IsWebPushLoading && IsUCPLoading.IsMobilePushLoading && IsUCPLoading.IsWhatsappLoading) {

        clearInterval(clearTimeIntervalofUCP);
        HidePageLoading();
    }
}

$("#ui_divCloseUCP").click(function () {
    checkconttab = "userjourney";
    $("#ui_divContactUCPScreen").removeClass("show-UCP").addClass("hideDiv");
    $(".accpopvr").popover("hide");
    $('.selectdateDropdownUCP').html("This Month");
    $(".dateclseWrapUCP").parents('.dateBoxWrapUCP').removeClass('showFlx');
    $(".-primary li").removeClass("active");
});

$(".readmoreabt").click(function () {
    if ($(this).html() == "Read More +") {
        $(this).prev(".aboutcontmoreWrap").removeClass("h-0");
        $(this).html("Read Less -");
    } else {
        $(this).prev(".aboutcontmoreWrap").addClass("h-0");
        $(this).html("Read More +");
    }
});

$(document).on('click', '#ui_saveNote', () => {
    UCPUtil.SaveNotes();
});

$(document).on("click", ".tab-ucp-links", function () {
    checkconttab = $(this).attr("data-ucpconttab");
    $("div[class^='tables-']").addClass("hideDiv");
    $(".-primary li").removeClass("active");
    $(this).parent().addClass("active");
    $(".tables-" + checkconttab).removeClass("hideDiv");
    //UCPUtil.DecideAndBindUcpTab(checkconttab);
    ShowPageLoading();
    UCPUtil.SetFalseTabLoading();
    clearTimeIntervalofUCP = setInterval(IsUCPLoadingToHide, 1000);
    UCPUtil.GetCustomDateAndBind(checkconttab, false);
});


$(".datedropdownUCP > .dropdown-menuUCP a").click(function () {
    let SelectedDateDropDownUCP = $(this).text();
    $('.selectdateDropdownUCP').html(SelectedDateDropDownUCP);
    $(".dateBoxWrapUCP").removeClass('showFlx');

    if (SelectedDateDropDownUCP == "Today") {
        ShowPageLoading();
        UCPUtil.GetUTCDateTimeRangeForUCP(1);
    }
    else if (SelectedDateDropDownUCP == "This Week") {
        ShowPageLoading();
        UCPUtil.GetUTCDateTimeRangeForUCP(2);
    }
    else if (SelectedDateDropDownUCP == "This Month") {
        ShowPageLoading();
        UCPUtil.GetUTCDateTimeRangeForUCP(3);
    }
    else if (SelectedDateDropDownUCP == "Custom Date Range") {
        $("#ui_txtStartDateUCP").val('');
        $("#ui_txtEndDateUCP").val('');
        $(".dateBoxWrapUCP").addClass('showFlx');
    }
    clearTimeIntervalofUCP = setInterval(IsUCPLoadingToHide, 1000);
});

$("#ui_txtStartDateUCP").datepicker({
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: false,
    maxDate: "0",
    changeMonth: true,
    changeYear: true
});

$("#ui_txtEndDateUCP").datepicker({
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: true,
    maxDate: "0",
    changeMonth: true,
    changeYear: true
});

$("#ui_btnCustomDateApplyUCP").click(function () {
    ShowPageLoading();
    UCPUtil.GetUTCDateTimeRangeForUCP(5);
    clearTimeIntervalofUCP = setInterval(IsUCPLoadingToHide, 1000);
});

$(".dateclseWrapUCP").on('click', function () {
    $(this).parents('.dateBoxWrapUCP').removeClass('showFlx');
});

$("#ui_machinIdjour").change(function () {
    if ($(this).val() != "0") {
        ShowPageLoading();
        mLUCPVisitor.MachineId = $(this).val();
        UCPUtil.GetCustomDateAndBind(checkconttab, false);
        clearTimeIntervalofUCP = setInterval(IsUCPLoadingToHide, 1000);
    }
});

function MaxCount() {
    ShowPageLoading();
    //Group.Name = $("#ui_txtSearchBy").val();
    $.ajax({
        url: "/Content/GetEventMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'group': Group }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = response.returnVal;
            $('#TotalGroupCount').text(TotalRowCount);
            if (TotalRowCount > 0) {
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });

    function GetReport() {
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/ManageContact/Group/BindGroupDetails",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'group': Group, 'OffSet': OffSet, 'FetchNext': FetchNext }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: BindReport,
            error: ShowAjaxError
        });
    }

}
$("#ui_machinIdclick").change(function () {
    if ($(this).val() != "0") {
        ShowPageLoading();
        mLUCPVisitor.MachineId = $(this).val();
        UCPUtil.GetCustomDateAndBind(checkconttab, false);
        clearTimeIntervalofUCP = setInterval(IsUCPLoadingToHide, 1000);
    }
});

$("#ui_machinIdweb").change(function () {
    if ($(this).val() != "0") {
        ShowPageLoading();
        mLUCPVisitor.MachineId = $(this).val();
        UCPUtil.GetCustomDateAndBind(checkconttab, false);
        clearTimeIntervalofUCP = setInterval(IsUCPLoadingToHide, 1000);
    }
});

$("#ui_machinIdwebform").change(function () {
    if ($(this).val() != "0") {
        ShowPageLoading();
        mLUCPVisitor.MachineId = $(this).val();
        UCPUtil.GetCustomDateAndBind(checkconttab, false);
        clearTimeIntervalofUCP = setInterval(IsUCPLoadingToHide, 1000);
    }
});

$("#ui_devicepushId").change(function () {
    if ($(this).val() != "0") {
        ShowPageLoading();
        mLUCPVisitor.DeviceId = $(this).val();
        UCPUtil.GetCustomDateAndBind(checkconttab, false);
        clearTimeIntervalofUCP = setInterval(IsUCPLoadingToHide, 1000);
    }
});
$('.addselect2drpdwn').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
    containerCssClass: "selectdrpdwnbrdcol",
});
$("#ui_deviceappId").change(function () {
    if ($(this).val() != "0") {
        ShowPageLoading();
        mLUCPVisitor.DeviceId = $(this).val();
        UCPUtil.GetCustomDateAndBind(checkconttab, false);
        clearTimeIntervalofUCP = setInterval(IsUCPLoadingToHide, 1000);
    }
});


$(document).on('click', '#ui_sendmailpopvr', function () {
    if (IsEmailViewPermission == true)
        AccessDeniedPermission();
    else {
        $(".contEmailId .ion-ios-email").popover("hide");
        let emailId = $("#ui_visitorEmailId").attr("contactemail");
        MailContact.ContactId = GobleContactId;
        $("#ui_ddlContactEmailIds").empty();
        $("#ui_ddlContactEmailIds").append(`<option value="${emailId}">${emailId}</option>`);
        $("#ui_divSendMailPopUp,#ui_divSendSMSPopUp,#ui_divSendCallPopUp,#ui_divSendWhatsappPopUp").addClass("hideDiv");
        $(".popuptitle h6").html("SEND MAIL");
        $("#ui_divSendMailPopUp").removeClass("hideDiv");
    }
});

$(document).on('click', '#ui_calluserpopvr', function () {
    if (IsCallViewPermission == true)
        AccessDeniedPermission();
    else {
        $(".contPhoneNum .ion-ios-telephone").popover("hide");
        let callPhone = $("#ui_visitorPhoneNumber").attr("contactcall");
        CallPhoneNumber.ContactId = GobleContactId;
        $("#ui_ddlContactCallPhoneNumbers").empty();
        $("#ui_ddlContactCallPhoneNumbers").append(`<option value="${callPhone}">${callPhone}</option>`);
        $("#ui_divSendMailPopUp,#ui_divSendSMSPopUp,#ui_divSendCallPopUp,#ui_divSendWhatsappPopUp").addClass("hideDiv");
        $(".popuptitle h6").html("MAKE CALL");
        $("#ui_divSendCallPopUp").removeClass("hideDiv");
        SendCallToContactUtil.SendCall(GobleContactId, callPhone);
    }
});

$(document).on('click', '#ui_sendsmspopvr', function () {
    if (IsSmsViewPermission == true)
        AccessDeniedPermission();
    else {
        $(".contcompose .ion-android-textsms").popover("hide");
        let smsPhone = $("#ui_visitorSmsPhoneNumber").attr("contactsms");
        SmsContact.ContactId = GobleContactId;
        $("#ui_ddlContactSMSPhoneNumbers").empty();
        $("#ui_ddlContactSMSPhoneNumbers").append(`<option value="${smsPhone}">${smsPhone}</option>`);
        $("#ui_divSendMailPopUp,#ui_divSendSMSPopUp,#ui_divSendCallPopUp,#ui_divSendWhatsappPopUp").addClass("hideDiv");
        $(".popuptitle h6").html("Send SMS");
        $("#ui_divSendSMSPopUp").removeClass("hideDiv");
    }
});

$(document).on('click', '#ui_sendwhatsapppopvr', function () {
    if (IsWhatsAppViewPermission == true)
        AccessDeniedPermission();
    else {
        $(".contcompose .ion-social-whatsapp-outline").popover("hide");
        let whatsappPhone = $("#ui_visitorWhatsappPhoneNumber").attr("contactwhatsapp");
        WhatsappContact.ContactId = GobleContactId;
        $("#addlmsuserwhatsappnumb").empty();
        $("#addlmsuserwhatsappnumb").val(whatsappPhone).prop("disabled", true);
        $("#ui_divSendMailPopUp,#ui_divSendSMSPopUp,#ui_divSendCallPopUp,#ui_divSendWhatsappPopUp").addClass("hideDiv");
        $(".popuptitle h6").html("WhatsApp");
        $("#ui_divSendWhatsappPopUp").removeClass("hideDiv");
    }
});

$("#ui_visitorAddNotes").click(function () {
    if (IsNoteViewPermission == true)
        AccessDeniedPermission();
    else {
        let contactid = parseInt($("#ui_visitorAddNotes").attr("contactid"));
        let name = $("#ui_visitorAddNotes").attr("name");
        let emailid = $("#ui_visitorAddNotes").attr("emailid");
        if (ContactidForNote > 0)
            LeadsReportDetailsUtil.ShowNotesPopUp(ContactidForNote, name, emailid);
        $("#ui_visitorAddNotes").attr("data-content", "NA");
        $("#ui_visitorAddNotes").attr("contactnote", "NA");

    }
    //$(".accpopvr").popover("hide");
});

var getucpnameval;
$(".editucpname").click(function () {
    $(".ucpeditorwrp").removeClass("hideDiv");
    $("#ucpnameupt").focus();
});

$(".ucpnameupdt").click(function () {
    getucpnameval = $("#ucpnameupt").val();
    if (getucpnameval != undefined && getucpnameval != null && getucpnameval.length > 0) {
        $("#ui_visitorNameOrMacOrDeviceId").html(getucpnameval);
        UCPUtil.SaveNameDetails(getucpnameval);
        $(".ucpeditorwrp").addClass("hideDiv");
        $("#ucpnameupt").val("");
    } else {
        ShowErrorMessage(GlobalErrorList.UCPMessage.EnterName);
    }
});

$(".ucpnameclse").click(function () {
    $(this).parent().parent().parent().addClass("hideDiv");
    $("#ucpnameupt").val("");
});

$("#ui_drpdwn_UCPSelectHistoryFilters").change(function () {
    ShowPageLoading();
    clearTimeIntervalofUCP = setInterval(IsUCPLoadingToHide, 1000);
    UCPUtil.DecideAndBindUcpTab("leadhistory");
});

$('#custeventdropdowns').on('change', function () {
    ShowPageLoading();
    customEventOverViewId = this.value;
    if (customEventOverViewId == "") {
        customEventOverViewId = 0;
    }
    if (dropdowntriggerstatus == 0)
        UCPUtil.CustomeventsGetReport(customEventOverViewId);
    dropdowntriggerstatus = 0;
});
function EventTrackerGetDetails(SessionId, MachineId) {
    ShowPageLoading();
    var Eventtracker = { SessionId: SessionId, MachineId: MachineId };
    $(
        "#makecallUCP, #sendsmsUCP, #sendmailUCP, #lmsUcpaddnotes"
    ).addClass("hideDiv");
    $("#popupeventTrackingUCP").removeClass("hideDiv");
    $(".popupItem").removeClass("w-450").addClass("w-650");
    $("#eventTrackingUCP").removeClass("hideDiv");
    $(".popuptitle h6").html("Event Tracking");
    $(".sendemailpop .ion-ios-email").popover("hide");
    $(".accpopvr").popover("hide");

    $.ajax({
        url: "/ManageContact/UCP/GetEventTrackerDetails",
        type: 'Post',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'eVenttracker': Eventtracker }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var eventtracker = $('#tbleventtracker');
            eventtracker.empty();
            if (response != null && response.length > 0) {
                $.each(response, function () {
                    var table = "";
                    table += "<tr>" +
                        "<td class='text-left'>" + this.Name + "</td>" +
                        "<td class='wordbreak'>" + this.EventValue + "</td>" +
                        "<td class='wordbreak'>" + this.PageName + "</td>" +
                        "<td class='text-left'>" + $.datepicker.formatDate("M dd yy", ConvertUTCDateTimeToLocal($(this)[0].Date)) + " " + PlumbTimeFormat(ConvertUTCDateTimeToLocal($(this)[0].Date)) + "</td>" +
                        "</tr>";
                    eventtracker += table;

                });
            }
            else
                $("#tbleventtracker").html('<tr><td colspan="4" class="border-bottom-none"><div class="no-data">There is no data for this view</div></td></tr>');

            $("#tbleventtracker").append(eventtracker);
            HidePageLoading();
        }
    });
}

function GetMailDetailsclickstream(SessionId, MailP5UniqueID, startdate, timeenddate) {

    $.ajax({
        url: "/ManageContact/UCP/GetMailDetailsClickStream",
        type: 'Post',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'MailP5UniqueID': MailP5UniqueID, 'startdatetime': startdate, 'enddatetime': timeenddate }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindTemplateDetails,
        error: ShowAjaxError

    });
}
function BindTemplateDetails(response) {
    $("#ui_tbodyMailReportData").empty();
    ShowPageLoading();
    if (response !== undefined && response !== null && response.length > 0) {

        $("#ui_tableReport").removeClass('no-data-records');

        $("#ui_tbodyReportData").empty();
        $.each(response, function () {
            BindEachReport(this);
        });
        SetPreview();
    }
    else {
        SetNoRecordContent('ui_tblReportData', 3, 'ui_tbodyMailReportData');
    }
    HidePageLoading();
    CheckAccessPermission("Mail");
}
function BindEachReport(eachData) {
    let TemplateName = ReplaceSingleQuote(eachData.Name);
    let TemplateDescription = ReplaceSingleQuote(eachData.TemplateDescription);
    let SubjectLine = ReplaceSingleQuote(eachData.SubjectLine);


    let reportTablerows = `<tr id="ui_tr_MailTemplate_${eachData.Id}">
                                    <td class="text-center temppreveye">
                                        <i class="icon ion-ios-eye-outline position-relative">
                                            <div class="previewtabwrp">
                                                <div class="thumbnail-container">
                                                    <a href="https://${TemplatePath}Campaign-${Plumb5AccountId}-${eachData.Id}/TemplateContent.html" target="_blank">
                                                        <div class="thumbnail">
                                                            <iframe class="uitemplatepreview"  src="https://${TemplatePath}Campaign-${Plumb5AccountId}-${eachData.Id}/TemplateContent.html" frameborder="0" onload="this.style.opacity = 1"></iframe>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </i>
                                    </td>
                                    <td class="text-left">
                                        <div class="groupnamewrap">
                                            <div class="nametitWrap">
                                                <span class="groupNameTxt">${eachData.Name}</span>
                                                   </div>
                                                 </div>
                                           
                                    </td>
                                    <td class="text-left">
                                        <div class="groupnamewrap">
                                            <div class="nametitWrap">
                                                <span>${eachData.SubjectLine}</span>
                                            </div>
                                        </div>
                                    </td>
                                    </tr>`;
    $("#ui_tbodyMailReportData").append(reportTablerows);
}

function SetPreview() {
    let checktablerowlenth = $("table.temppreveye-tbl >tbody >tr").length;
    if (checktablerowlenth <= 4) {
        $("table.temppreveye-tbl >tbody >tr").addClass("prevpopupdefault");
    } else {
        $("table.temppreveye-tbl >tbody >tr").removeClass("prevpopupdefault");
    }
}
$("#close-popup, .clsepopup").click(function () {
    $(this).parents("#eventTrackingUCP").addClass("hideDiv");
    $(this).parents("#clickstreampopupcontainerUCP").addClass("hideDiv");
});

$(".devwrphvr").click(function () {
    var checkdevictabconid = $(this).attr("data-devtabcont");
    $(".devwrphvr").removeClass("active");
    $(".devsmsprev").addClass("hideDiv");
    $(".notifprevmain, .brwsnotifdevice").addClass("hideDiv");
    $(this).addClass("active");
    $("#" + checkdevictabconid).removeClass("hideDiv");
});




$(document).on("click", ".clickstreammail", function () {
    ShowPageLoading();

    let attrP5UniqueID = $(this).attr("dataP5UniqueID");
    let startdate = $(this).attr("startdate").replace('T', ' ');
    let timeenddate = $(this).attr("enddate").replace('T', ' ');
    $(".clickeventbtn, .clickstreamSms, .clickstreamwhatsapp, .clickstreamwebpush, .clickstreamcustevnt").removeClass("active");
    $(this).addClass("active");
    $(
        "#makecallUCP, #sendsmsUCP, #sendmailUCP, #lmsUcpaddnotes, #eventTrackingUCP,#clickstreamcaptureform, #clickstreamSMSUCP, #clickstreamwhatsappUCP, .popupfooter, #clickstreamcustevntUCP, #clickstreamwebpushUCP, #addtocartUcppopup"
    ).addClass("hideDiv");
    $("#clickstreampopupcontainerUCP").removeClass("hideDiv");
    $(".popupItem").removeClass("w-450").addClass("w-650");
    $("#clickstreamMailUCP").removeClass("hideDiv");
    $(".popuptitle h6").html("Email Campaign");
    $(".sendemailpop .ion-ios-email").popover("hide");
    $(".accpopvr").popover("hide");
    GetMailDetailsclickstream('', attrP5UniqueID, startdate, timeenddate);
})

$(document).on("click", ".clickstreamSms", function () {

    ShowPageLoading();
    let attrP5UniqueID = $(this).attr("dataP5UniqueID");
    let startdate = $(this).attr("startdate").replace('T', ' ');
    let timeenddate = $(this).attr("enddate").replace('T', ' ');
    $(".clickeventbtn, .clickstreammail, .clickstreamwhatsapp, .clickstreamwebpush, .clickstreamcustevnt").removeClass("active");
    $(this).addClass("active");
    $(
        "#makecallUCP, #sendsmsUCP, #sendmailUCP, #lmsUcpaddnotes, #eventTrackingUCP,#clickstreamcaptureform, #clickstreamMailUCP, #clickstreamwhatsappUCP, .popupfooter, #clickstreamcustevntUCP, #clickstreamwebpushUCP, #addtocartUcppopup"
    ).addClass("hideDiv");
    $("#clickstreampopupcontainerUCP").removeClass("hideDiv");
    $(".popupItem").removeClass("w-450").addClass("w-650");
    $("#clickstreamSMSUCP").removeClass("hideDiv");
    $(".popuptitle h6").html("SMS Campaign");
    $(".sendemailpop .ion-ios-email").popover("hide");
    $(".accpopvr").popover("hide");
    clickstreamsmsGetReport(attrP5UniqueID, startdate, timeenddate);
})

$(document).on("click", ".clickstreamwhatsapp", function () {

    ShowPageLoading();
    $(".clickeventbtn, .clickstreammail, .clickstreamSms, .clickstreamwebpush, .clickstreamcustevnt").removeClass("active");

    let attrP5UniqueID = $(this).attr("dataP5UniqueID");
    let startdate = $(this).attr("startdate").replace('T', ' ');
    let timeenddate = $(this).attr("enddate").replace('T', ' ');

    $(this).addClass("active");
    $(
        "#makecallUCP, #sendsmsUCP, #sendmailUCP, #lmsUcpaddnotes, #eventTrackingUCP,#clickstreamcaptureform, #clickstreamMailUCP, #clickstreamSMSUCP, #whatsappprevUcppopup, .popupfooter, #clickstreamwhatsappprevUcp, #clickstreamcustevntUCP, #clickstreamwebpushUCP, #addtocartUcppopup"
    ).addClass("hideDiv");
    $("#clickstreampopupcontainerUCP").removeClass("hideDiv");
    $(".popupItem").removeClass("w-450").addClass("w-650");
    $("#clickstreamwhatsappUCP").removeClass("hideDiv");
    $(".popuptitle h6").html("WhatsApp Campaign");
    $(".sendemailpop .ion-ios-email").popover("hide");
    $(".accpopvr").popover("hide");
    GetReportclickstreamwhatsapp(attrP5UniqueID, startdate, timeenddate)
})

$(document).on("click", ".clickstreamwebpush", function () {

    ShowPageLoading();
    let attrP5UniqueID = $(this).attr("dataP5UniqueID");
    let attrmachineid = $(this).attr("datamachineid");
    let attrsessionid = $(this).attr("datasessionid");

    $(".clickeventbtn, .clickstreammail, .clickstreamSms, .clickstreamwhatsapp, .clickstreamcustevnt").removeClass("active");
    $(this).addClass("active");
    $(
        "#makecallUCP, #sendsmsUCP, #sendmailUCP, #lmsUcpaddnotes, #eventTrackingUCP,#clickstreamcaptureform, #clickstreamMailUCP, #clickstreamSMSUCP, #whatsappprevUcppopup, .popupfooter, #clickstreamwhatsappprevUcp, #clickstreamcustevntUCP, #addtocartUcppopup, #clickstreamwhatsappUCP"
    ).addClass("hideDiv");
    $("#clickstreampopupcontainerUCP").removeClass("hideDiv");
    $(".popupItem").removeClass("w-450").addClass("w-650");
    $("#clickstreamwebpushUCP").removeClass("hideDiv");
    $(".popuptitle h6").html("Webpush Notification");
    $(".sendemailpop .ion-ios-email").popover("hide");
    $(".accpopvr").popover("hide");
    ClickstreamGetwebpushData(attrP5UniqueID)
})

$(document).on("click", ".clickstreamcustevnt", function () {

    ShowPageLoading();
    $(".clickeventbtn, .clickstreammail, .clickstreamSms, .clickstreamwhatsapp, .clickstreamwebpush").removeClass("active");
    let attrmachineid = $(this).attr("datamachineid");
    let attrsessionid = $(this).attr("datasessionid");
    $(this).addClass("active");
    $(
        "#makecallUCP, #sendsmsUCP, #sendmailUCP, #lmsUcpaddnotes, #clickstreamcaptureform,#eventTrackingUCP, #clickstreamMailUCP, #clickstreamSMSUCP, #whatsappprevUcppopup, .popupfooter,#clickstreamwhatsappUCP, #clickstreamwhatsappprevUcp, #clickstreamwebpushUCP, #addtocartUcppopup"
    ).addClass("hideDiv");
    $("#clickstreampopupcontainerUCP").removeClass("hideDiv");
    $(".popupItem").removeClass("w-450").addClass("w-650");
    $("#clickstreamcustevntUCP").removeClass("hideDiv");
    $(".popuptitle h6").html("Custom Event");
    $(".sendemailpop .ion-ios-email").popover("hide");
    $(".accpopvr").popover("hide");
    ClickstreamGetCstEventsData(attrmachineid, attrsessionid);

});

$("#ui_iconCloseWhatsappPopUp, #ui_btnCancelWhatsapp").click(function () {
    SendWhatsappToContactUtil.ResetWhatsappDetails();
    $("#ui_divSendWhatsappPopUp").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
});
$(document).on("click", ".clickstreamform", function () {
    ShowPageLoading();
    $(".clickeventbtn, .clickstreammail, .clickstreamSms, .clickstreamwhatsapp, .clickstreamwebpush").removeClass("active");
    let attrmachineid = $(this).attr("datamachineid");
    let attrsessionid = $(this).attr("datasessionid");
    $(this).addClass("active");
    $(
        "#makecallUCP, #sendsmsUCP, #sendmailUCP, #lmsUcpaddnotes, #clickstreamcaptureform,#clickstreamcustevntUCP,#eventTrackingUCP, #clickstreamMailUCP, #clickstreamSMSUCP, #whatsappprevUcppopup, .popupfooter, #clickstreamwhatsappprevUcp, #clickstreamwebpushUCP, #addtocartUcppopup"
    ).addClass("hideDiv");
    $("#clickstreampopupcontainerUCP").removeClass("hideDiv");
    $(".popupItem").removeClass("w-450").addClass("w-650");
    $("#clickstreamcaptureform").removeClass("hideDiv");
    $(".popuptitle h6").html("Capture Form");
    $(".sendemailpop .ion-ios-email").popover("hide");
    $(".accpopvr").popover("hide");
    BindCaptureformclickstream(attrmachineid, attrsessionid);

});


function clickstreamsmsGetReport(SMSP5UniqueID, startdate, timeenddate) {

    $.ajax({
        url: "/ManageContact/UCP/GetsmsDetailsClickStream",
        type: 'Post',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'SMSP5UniqueID': SMSP5UniqueID, 'startdatetime': startdate, 'enddatetime': timeenddate }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: cliskstreamsmsBindReport,
        error: ShowAjaxError
    });
}

function cliskstreamsmsBindReport(response) {

    ShowPageLoading();
    $("#ui_smsclickstreamtbodyReportData").empty();

    if (response != undefined && response != null && response.length > 0) {

        var reportTableTrs;

        $.each(response, function () {

            reportTableTrs += '<tr><td class="text-center">' +
                '<div class="smsprevwrap">' +
                '<i class="icon ion-ios-eye-outline"></i>' +
                '<div class="smsprevItemwrap bubbrep"><div class="chat">' +
                '<div class="yours messages"><div class="message last">' + this.MessageContent + '</div></div></div></div></div></td>' +
                '<td class="text-left">' + this.Name + '</td>' +
                '<td class="wordbreak text-left">' + this.Description + '</td>' +
                '</tr>';
        });
        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_smsclickstreamtbodyReportData").html(reportTableTrs);

    }
    else
        SetNoRecordContent('ui_tblReportData', 3, 'ui_smsclickstreamtbodyReportData');

    HidePageLoading();

}
function GetReportclickstreamwhatsapp(WhatsAppP5UniqueID, startdate, timeenddate) {

    $.ajax({
        url: "/ManageContact/UCP/GetWhatsappDetailsClickStream",
        type: 'Post',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'WhatsAppP5UniqueID': WhatsAppP5UniqueID, 'startdatetime': startdate, 'enddatetime': timeenddate }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindWhatsappTemplateDetails,
        error: ShowAjaxError
    });
}
function BindWhatsappTemplateDetails(response) {
    $("#ui_whatsappstreamtbodyReportData").empty();
    ShowPageLoading();
    if (response !== undefined && response !== null && response.length > 0) {

        $.each(response, function () {
            let reportTablerows = `<tr id="ui_tr_WATemplate_${this.Id}">
                                    <td class="text-center">
                                        <div class="smsprevwrap prevwhatsapp" onclick="UCPUtil.PreviewTemplate('${this.Name.replace(/%20/g, ' ')}', '${this.TemplateContent.replace(/\n/g, '~n~')}', '${this.ButtonOneText}', '${this.ButtonOneType}', '${this.ButtonTwoText}', '${this.ButtonTwoType}', '${this.MediaFileURL}', '${this.TemplateType}');">
                                                <i class="icon ion-ios-eye-outline"></i>
                                        </div>
                                    </td>
                                    <td class="text-left">
                                        <div class="groupnamewrap">
                                            <div class="nametitWrap">
                                                <span class="groupNameTxt">${this.Name.replace(/%20/g, ' ')}</span>
                                            </div>
                                            
                                        </div>
                                    </td>
                                    
                                    <td class="text-left">
                                        <div class="groupnamewrap">
                                            <div class="nametitWrap">
                                                <span>${this.CampaignName}</span>
                                            </div>
                                        </div>
                                    </td>
                                    </tr>`;

            $("#ui_whatsappstreamtbodyReportData").append(reportTablerows);
        });

    }
    else {
        SetNoRecordContent('ui_tblReportData', 3, 'ui_whatsappstreamtbodyReportData');
    }
    HidePageLoading();
}
function ClickstreamGetCstEventsData(cstmachineid, cstsessionid) {

    $.ajax({
        url: "/ManageContact/UCP/GetEventdetailsClickStream",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'machineid': cstmachineid, 'sessionid': cstsessionid }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: ClickstreamCstEventsbinddetails,
        error: ShowAjaxError
    });
}
function ClickstreamCstEventsbinddetails(response) {
    ShowPageLoading();
    $("#ui_CsteventsclickstreamtbodyReportData").empty();

    if (response != undefined && response != null && response.length > 0) {

        $.each(response, function () {
            let reportTableTrs = '<tr><td class="text-center">' + this.EventName + '</td >' +
                '<td class="text-left">' + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.CreatedDate)) + '</td>' +
                '</tr>';
            $("#ui_CsteventsclickstreamtbodyReportData").append(reportTableTrs);
        });

    }
    else
        SetNoRecordContent('ui_tblReportData', 2, 'ui_CsteventsclickstreamtbodyReportData');

    HidePageLoading();

}
function ClickstreamGetwebpushData(P5WebPushUniqueID) {
    /*CustomEventName = CleanText($.trim($('#txt_SearchBy').val()));*/

    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/ManageContact/UCP/GetWebPushClickStream",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'P5WebPushUniqueID': P5WebPushUniqueID }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: Clickstreamwebpushbinddetails,
        error: ShowAjaxError
    });
}
function Clickstreamwebpushbinddetails(response) {
    $("#ui_webpushclickstreamtbodyReportData").empty();
    ShowPageLoading();

    if (response != undefined && response != null && response.length > 0) {


        var reportTableTrs;

        $.each(response, function () {

            reportTableTrs += '<tr><td class="text-center">' +
                '<div class="bnotifprevwrap"><i data-title="' + this.Title + '" data-desc=\'' + this.MessageContent + '\'  data-icon="' + this.IconImage + '" data-banner="' + this.BannerImage + '" data-btn1="' + this.Button1_Label + '"  data-btn2="' + this.Button2_Label + '" class="icon ion-ios-eye-outline bnotiftemplate" data-toggle="popover" data-original-title="" title="" aria-describedby="popover76680"></i></div>' +
                '</td>' +
                '<td class="wordbreak text-left">' + this.TemplateName + '</td >' +
                '<td class="wordbreak text-left">' + this.TotalView + '</td>' +
                '<td class="text-left">' + this.TotalClick + '</td>' +
                '<td class="wordbreak text-left">' + this.TotalClose + '</td></tr>';

        }
        );

        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_webpushclickstreamtbodyReportData").html(reportTableTrs);
        PreviewClick();
        ShowExportDiv(true);
    }
    else
        SetNoRecordContent('ui_tblReportData', 5, 'ui_webpushclickstreamtbodyReportData');


    HidePageLoading();

}
function PreviewClick() {
    $('.bnotiftemplate').click(function () {
        $(".bnotiftemplate").not(this).popover("hide");
    });

    $('.bnotiftemplate').popover({
        html: true,
        trigger: "hover",
        placement: "left",
        content: function () {

            if ($(this).attr("data-icon") != null && $(this).attr("data-icon") != "null" && $(this).attr("data-icon").length != 0) {
                $(".notificonwrp").css("background-image", "url(" + $(this).attr("data-icon") + ")");
            }

            if ($(this).attr("data-banner") != null && $(this).attr("data-banner") != "null" && $(this).attr("data-banner").length != 0) {
                $(".notifbanwrp").show(); $(".notifbanwrp").css("background-image", "url(" + $(this).attr("data-banner") + ")");
            } else { $(".notifbanwrp").hide(); }

            $("#notifsubbtn").hide(); $("#notifcanbtn").hide();
            $(".notiftitle").html($(this).attr("data-title"));
            $(".notifdescript").html($(this).attr("data-desc"));
            if ($(this).attr("data-btn1") != null && $(this).attr("data-btn1") != "null" && $(this).attr("data-btn1").length != 0) { $("#notifsubbtn").show(); $(".bnotbtn1").html($(this).attr("data-btn1")); }
            if ($(this).attr("data-btn2") != null && $(this).attr("data-btn2") != "null" && $(this).attr("data-btn2").length != 0) { $("#notifcanbtn").show(); $(".bnotbtn2").html($(this).attr("data-btn2")); }
            setInterval(function () { $(".popover-header").hide(); }, 100);
            return $(".bnotiftempwrp").html();
        }
    });
}

function BindCaptureformclickstream(machineid, sessionid) {
    $("#ui_captureformclickstreamtbodyReportData").empty();
    ShowPageLoading();
    $.ajax({
        url: "/ManageContact/UCP/GetCaptureFormDetailsClickStream",
        type: 'POST',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'machineid': machineid, 'sessionid': sessionid }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: (FormList) => {

            if (FormList != undefined && FormList != null && FormList.Table1 != undefined && FormList.Table1 != null && FormList.Table1.length > 0) {
                $("#ui_tbodyUCPWebDetails").empty();
                $.each(FormList.Table1, (key, value) => {
                    const WebData = `<tr>
                                        <td class="text-left">${value.FormName}</td>
                                        <td class="text-left">${value.EmbeddedFormOrPopUpFormOrTaggedForm}</td>
                                        <td>${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(value.RecentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.RecentDate))}</td>
                                      </tr>`
                    $("#ui_captureformclickstreamtbodyReportData").append(WebData);
                });
            }
            else {
                $("#ui_captureformclickstreamtbodyReportData").empty().append(UCPUtil.NoDataFound(3));
            }
            HidePageLoading();
            IsUCPLoading.IsWebLoading = true;
        },
        error: ShowAjaxError
    });
}