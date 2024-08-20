
var ReminderDetails = {
    Id: 0, ContactId: 0, ScheduleType: 'Mail', Name: '', EmailId: '', PhoneNumber: '', ReminderDate: null, ToReminderEmailId: '', ToReminderPhoneNumber: "", ReminderStatus: 0,
    FromEmailId: '', Subject: '', FromName: '', AlertScheduleStatus: "", AlertScheduleDate: null, UserInfoUserId: 0,
    TemplateName: '', TemplateContent: '', MailReplyEmailId: '', IsPromotionalOrTransnational: null, TemplateId: null, CCEmailId: ''
};
 
var Lmsgroupid = 0;
var MailContact = { ContactId: 0};
var MailLmsGroupMemberId = 0;
var MailLmsScore = 0;
var MailLmsPublisher = "";
var MailLmsLeadLabel = "";
var MailContacts=[]
//function SendMail(ContactId) {
//    ShowPageLoading();
//    $(".dropdown-menu").removeClass("show");
//    $(".popuptitle h6").html("SEND MAIL");
//    $("#dv_AssignSalesPerson,#dv_LmsNotes,#dv_LmsSource,#dv_AddFollowUp,#dv_AssignStage,#ui_divSendCallPopUp,#dv_CreateLead,#ui_divSendSMSPopUp,#dv_FilterContacts,#dv_ViewFollowUpDetails").addClass("hideDiv");
//    SendMailToContactUtil.ResetMailDetails();
//    SendMailToContactUtil.GetDetailsForMail(ContactId);
//}

var SendMailToContactUtil = {
    SendMail: function (ContactId, LmsGroupId, LmsGroupMemberId, Userinfouserid,Score,Publisher,LeadLabel) {
        //if (Plumb5UserId == Userinfouserid || LmsPermissionlevelSeniorUserID == 0) {
        Lmsgroupid = LmsGroupId;
        MailLmsGroupMemberId = LmsGroupMemberId
        MailLmsScore = Score
        MailLmsPublisher = Publisher
        MailLmsLeadLabel = LeadLabel
        $("#ui_div_" + LmsGroupMemberId).addClass("activeBgRow");
        ShowPageLoading();
        $(".dropdown-menu").removeClass("show");
        $(".popuptitle h6").html("SEND MAIL");
        ////Removed LmsSource By Arnab - 2021-02-13 10:13:53.170 P5-507
        //$("#dv_AssignSalesPerson,#dv_LmsNotes,#dv_LmsSource,#dv_AddFollowUp,#dv_AssignStage,#ui_divSendCallPopUp,#dv_CreateLead,#ui_divSendMailPopUp,#dv_FilterContacts").addClass("hideDiv");
        //$("#dv_AssignSalesPerson,#dv_LmsNotes,#dv_AddFollowUp,#dv_AssignStage,#ui_divSendCallPopUp,#dv_CreateLead,#ui_divSendMailPopUp,#dv_FilterContacts").addClass("hideDiv");
        ////Removed LmsSource By Arnab - 2021-02-13 10:13:53.170 P5-507
        SendMailToContactUtil.ResetMailDetails();
        SendMailToContactUtil.GetDetailsForMail(ContactId);

    },
    ResetMailDetails: function () {
        $("#ui_smallMailContactName").html('');
        $("#ui_ddlContactEmailIds").empty();
        $("#ui_txt_CCEmailId").val('');
        $("#ui_div_CCEmailId").addClass("hideDiv");
        $("#ui_txtMailSubject").val('');
        $("#ui_txtMailFromName").val('');
        $("#ui_ddlFromEmailId").val("0").trigger('change');
        $("#ui_ddlMailTemplate").val("0").trigger('change');
        $("#ui_txtReplyAtEmail").val('');
        $("#ui_divMailScheduleLaterTime").addClass("hideDiv");
        $("#ui_rdbtnMailScheduleNow").prop("checked", true);
        $("#ui_txtMailScheduleDate").val('');
        $("#ui_ddlMailScheduleTime").val('10:00');
    },
    GetDetailsForMail: function (ContactId) {
        $.ajax({
            url: "/SendMailToContact/GetContactDetails",
            type: 'POST',
            data: JSON.stringify({
                'accountId': Plumb5AccountId, 'ContactId': ContactId
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    SendMailToContactUtil.BindContactDetails(response);
                } else {
                    ShowErrorMessage(GlobalErrorList.SendMailToContact.NoContactFound);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    BindContactDetails: function (response) {
        PreinitalizeValue({ "FirstName": "ui_txtMailFromName" });
        $("#ui_smallMailContactName").html(response.Name);
        if (response.EmailId != undefined && response.EmailId != null && response.EmailId.length > 0) {
            $("#ui_ddlContactEmailIds").append(`<option value="${response.EmailId}">${response.EmailId}</option>`);
        }

        if (response.AlternateEmailIds != undefined && response.AlternateEmailIds != null && response.AlternateEmailIds.length > 0) {
            var AlternateEmailIdList = response.AlternateEmailIds.split(',');

            for (var i = 0; i < AlternateEmailIdList.length; i++) {
                $("#ui_ddlContactEmailIds").append(`<option value="${AlternateEmailIdList[i]}">${AlternateEmailIdList[i]}</option>`);
            }
        }

        if ($("#ui_ddlContactEmailIds option").length == 0) {
            ShowErrorMessage(GlobalErrorList.SendMailToContact.NoContactFound);
            HidePageLoading();
        } else {
            MailContact = response;
            MailContacts.push(response);
            $("#ui_divSendMailPopUp").removeClass("hideDiv");
            HidePageLoading();
        }
    },
    ValidateSendMail: function () {
        if ($("#ui_txtMailSubject").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.SendMailToContact.NoSubject);
            return false;
        }

        if (!$("#ui_div_CCEmailId").hasClass("hideDiv") && CleanText($("#ui_txt_CCEmailId").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.SendMailToContact.NoCCEmail);
            return false;
        }

        if (!$("#ui_div_CCEmailId").hasClass("hideDiv") && $("#ui_txt_CCEmailId").val().length > 0 && !regExpEmail.test(CleanText($("#ui_txt_CCEmailId").val()))) {
            ShowErrorMessage(GlobalErrorList.SendMailToContact.ValidCCEmail);
            return false;
        }

        if ($("#ui_txtMailFromName").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.SendMailToContact.NoFromName);
            return false;
        }

        if ($("#ui_ddlFromEmailId").val() == 0) {
            ShowErrorMessage(GlobalErrorList.SendMailToContact.NoFromEmail);
            return false;
        }

        if ($("#ui_ddlMailTemplate option:selected").val() == 0) {
            ShowErrorMessage(GlobalErrorList.SendMailToContact.NoTemplate);
            return false;
        }

        if ($("#ui_txtReplyAtEmail").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.SendMailToContact.NoReplyEmail);
            return false;
        }

        if ($('input[name="MailScheduleNowLater"]:checked').val() == 1) {

            if ($("#ui_txtMailScheduleDate").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.SendMailToContact.NoScheduleDate);
                return false;
            }

            let ScheduledDateString = $("#ui_txtMailScheduleDate").val().split("/");
            let ScheduledTimeString = $("#ui_ddlMailScheduleTime").val().split(":");

            var ScheduledDate = new Date(ScheduledDateString[2], parseInt(ScheduledDateString[0]) - 1, ScheduledDateString[1], ScheduledTimeString[0], ScheduledTimeString[1]);

            if (ScheduledDate <= new Date()) {
                ShowErrorMessage(GlobalErrorList.SendMailToContact.ScheduleDateWrong);
                return false;
            }
        }

        return true;
    },
    AddingPrefixZero: function (n) {
        return (n < 10) ? ("0" + n) : n;
    },
    ScheduleOrSendMail: function () {
        let SendType = parseInt($('input[name="MailScheduleNowLater"]:checked').val());
        let TemplateId = parseInt($("#ui_ddlMailTemplate option:selected").val());
        ReminderDetails.TemplateId = TemplateId;
        if (MailContact != undefined && MailContact.ContactId != undefined && MailContact.ContactId != null && MailContact.ContactId > 0)
            ReminderDetails.ContactId = MailContact.ContactId;
        else
            ReminderDetails.ContactId = "";


        if (MailContact != undefined && MailContact.Name != undefined && MailContact.Name != null && MailContact.Name.length > 0)
            ReminderDetails.Name = MailContact.Name;
        else
            ReminderDetails.Name = "";


        ReminderDetails.EmailId = $("#ui_ddlContactEmailIds").val();
        ReminderDetails.FromEmailId = $("#ui_ddlFromEmailId").val();
        ReminderDetails.FromName = $("#ui_txtMailFromName").val();
        ReminderDetails.Subject = $("#ui_txtMailSubject").val();
        ReminderDetails.TemplateName =  $("#ui_ddlMailTemplate option:selected").text() ;
        ReminderDetails.MailReplyEmailId = $("#ui_txtReplyAtEmail").val();
        ReminderDetails.IsPromotionalOrTransnational = $('input[name="MailScheduleCampaignType"]:checked').val()=="1"?true:false;
        ReminderDetails.LmsGroupId = Lmsgroupid; 
        if (SendType == 1) {
            let ScheduledDateString = $("#ui_txtMailScheduleDate").val().split("/");
            let ScheduledTimeString = $("#ui_ddlMailScheduleTime").val().split(":");

            let ScheduledDate = `${ScheduledDateString[2]}-${ScheduledDateString[0]}-${ScheduledDateString[1]} ${ScheduledTimeString[0]}:${ScheduledTimeString[1]}:00`;

            ScheduledDate = ConvertDateTimeToUTC(ScheduledDate);
            ReminderDetails.AlertScheduleDate = ScheduledDate.getFullYear() + '-' + SendMailToContactUtil.AddingPrefixZero((ScheduledDate.getMonth() + 1)) + '-' + SendMailToContactUtil.AddingPrefixZero(ScheduledDate.getDate()) + " " + SendMailToContactUtil.AddingPrefixZero(ScheduledDate.getHours()) + ":" + SendMailToContactUtil.AddingPrefixZero(ScheduledDate.getMinutes()) + ":" + SendMailToContactUtil.AddingPrefixZero(ScheduledDate.getSeconds());
            ReminderDetails.AlertScheduleStatus = 'Scheduled';
        }

        if (!$("#ui_div_CCEmailId").hasClass("hideDiv") && CleanText($("#ui_txt_CCEmailId").val()).length > 0)
            ReminderDetails.CCEmailId = CleanText($("#ui_txt_CCEmailId").val());
        else
            ReminderDetails.CCEmailId = ""; 

        MailContacts = new Object();
        const nonNullObject = Object.entries(MailContact).reduce((acc, [key, value]) => {
            if (value !== null  ) {
                acc[key] = value;
            }
            return acc;
        }, {});
        

        MailContacts = nonNullObject; 
        $.ajax({
           
            url: "/SendMailToContact/ScheduleOrSendMail",
            type: 'POST',
            data: JSON.stringify({
                'accountId': Plumb5AccountId, 'MailContact': MailContacts, 'ReminderDetails': ReminderDetails, 'TemplateId': TemplateId, 'SendType': SendType, 'lmsgroupmemberid': MailLmsGroupMemberId, 'Score': MailLmsScore, 'Publisher': MailLmsPublisher, 'LeadLabel': MailLmsLeadLabel
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    if (response.Result) {
                        SendMailToContactUtil.ResetMailDetails();
                        if (ReminderDetails.Id > 0) {
                            ShowSuccessMessage(GlobalErrorList.SendMailToContact.MailScheduledAlert_UpdateSuccessMessage);
                            ScheduledMailAlertsUtil.GetReport();
                        }
                        else {
                            if (SendType == 1)
                                ShowSuccessMessage(GlobalErrorList.SendMailToContact.MailScheduled_SuccessMessage);
                            else
                                ShowSuccessMessage(GlobalErrorList.SendMailToContact.MailSent_SuccessMessage);
                        }

                        $("#ui_divSendMailPopUp").addClass("hideDiv");
                    } else {
                        if (ReminderDetails.Id > 0)
                            ShowErrorMessage(GlobalErrorList.SendMailToContact.MailScheduledAlert_UpdateErrorMessage);
                        else
                            ShowErrorMessage(GlobalErrorList.SendMailToContact.MailScheduled_failedMessage);
                    }
                }

                if (MailContact != undefined && MailContact.ContactId != undefined && MailContact.ContactId != null && MailContact.ContactId > 0)
                    $("tr").removeClass("activeBgRow");
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
}

$("#ui_txtMailScheduleDate").datepicker({
    defaultDate: "+1d",
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: false,
    minDate: new Date()
});

$('#ui_ddlMailTemplate,#ui_ddlFromEmailId').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$("#ui_ddlFromEmailId").change(function () {
    if ($("#ui_ddlFromEmailId").val() != "0") {
        let ReplyTo = $("#ui_ddlFromEmailId option:selected").val();
        $("#ui_txtReplyAtEmail").val(ReplyTo);
    }
    else {
        $("#ui_txtReplyAtEmail").val("");
    }
});

$('input[name="MailScheduleNowLater"]').click(function () {
    let SendType = $('input[name="MailScheduleNowLater"]:checked').val();
    if (SendType == "1") {
        $("#ui_divMailScheduleLaterTime").removeClass("hideDiv");
    } else {
        $("#ui_divMailScheduleLaterTime").addClass("hideDiv");
    }
});

$("#ui_btnSendMail").click(function () {
    ShowPageLoading();
    if (!SendMailToContactUtil.ValidateSendMail()) {
        HidePageLoading();
        return false;
    }
    SendMailToContactUtil.ScheduleOrSendMail();
});

$("#ui_iconCloseMailPopUp, #ui_btnCancelMail").click(function () {
    SendMailToContactUtil.ResetMailDetails();
    $("#ui_divSendMailPopUp").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
});

$("#ui_spanMailTemplatePreview").click(function () {
    $("#ui_divMailTemplatePreview").removeClass("hideDiv");
});

$("#ui_ddlMailTemplate").change(function () {
    $("#ui_spanMailTemplatePreview").addClass("hideDiv");
    $("#ui_divMailTemplatePreview").addClass("hideDiv");
    $("#ui_iframeMailTemplatePreview").attr('src', "");
    var TemplateId = $("#ui_ddlMailTemplate option:selected").val();


    if (TemplateId != 0) {
        var SubjectLine = MailTemplatesList.find(o => o.Id === parseInt(TemplateId)).SubjectLine;
        $("#ui_txtMailSubject").val(SubjectLine != null ? SubjectLine : "");

        $("#ui_spanMailTemplatePreview").removeClass("hideDiv");
        $("#ui_iframeMailTemplatePreview").attr('src', `https://${TemplatePath}Campaign-${Plumb5AccountId}-${TemplateId}/TemplateContent.html`);
    }
});

$("#ui_iconMailPreviewClose").click(function () {
    $("#ui_divMailTemplatePreview").addClass("hideDiv");
});

function BindScheduledMailAlertDetails(responsetr, Id, TemplateId, ContactId, Subject, MailReplyEmailId, IsPromotionalOrTransnational, MailAlertScheduledDate, FromName, CCEmailId) {
    ////Removed LmsSource By Arnab - 2021-02-13 10:13:53.170 P5-507
    //$("#dv_AssignSalesPerson,#dv_LmsNotes,#dv_LmsSource,#dv_AddFollowUp,#dv_AssignStage,#ui_divSendCallPopUp,#dv_CreateLead,#ui_divSendMailPopUp,#dv_FilterContacts").addClass("hideDiv");
    //$("#dv_AssignSalesPerson,#dv_LmsNotes,#dv_AddFollowUp,#dv_AssignStage,#ui_divSendCallPopUp,#dv_CreateLead,#ui_divSendMailPopUp,#dv_FilterContacts").addClass("hideDiv");
    ////Removed LmsSource By Arnab - 2021-02-13 10:13:53.170 P5-507
    $("#ui_divSendMailPopUp").removeClass("hideDiv");
    SendMailToContactUtil.GetDetailsForMail(ContactId);
    ReminderDetails.Id = Id;
    if (IsPromotionalOrTransnational == true)
        $('#ui_rdbtnMailSchedulePromotional').attr('checked', true);
    else
        $('#ui_rdbtnMailScheduleTransactional').attr('checked', true);
    if (CCEmailId != "null" && CCEmailId!="") {
        $('#ui_txt_CCEmailId').val(CCEmailId);
        $("#ui_div_CCEmailId").toggleClass("hideDiv");
    }

    var MailScheduleAlerttr = responsetr.closest("tr");
    //var MailScheduledAlertFromEmail = MailScheduleAlerttr.firstElementChild.nextElementSibling.nextElementSibling.innerText;
    //var MailScheduledAlertFromName = MailScheduleAlerttr.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.innerText;
    var MailScheduledAlertToEmail = MailScheduleAlerttr.firstElementChild.nextElementSibling.nextElementSibling.
        nextElementSibling.nextElementSibling.innerText;
    //var MailScheduledAlertScheduledDate = MailScheduleAlerttr.firstElementChild.nextElementSibling.nextElementSibling.
    //   nextElementSibling.nextElementSibling.nextElementSibling.innerText;

    $('#ui_ddlContactEmailIds').val(MailScheduledAlertToEmail);
    $('#ui_txtMailFromName').val(FromName);
    $('#ui_ddlFromEmailId').val(MailReplyEmailId).trigger('change');
    $("#ui_txtReplyAtEmail").val(MailReplyEmailId);
    $("#ui_ddlMailTemplate").val(TemplateId).trigger('change');
    $('#ui_txtMailSubject').val(Subject);


    // var MailScheduledDate = new Date(MailScheduledAlertScheduledDate);
    var MailScheduledDate = GetJavaScriptDateObj(MailAlertScheduledDate);
    var ScheduledTime = (MailScheduledDate.getHours() < 10 ? '0' + MailScheduledDate.getHours() : MailScheduledDate.getHours()) + ':'
        + (MailScheduledDate.getMinutes() < 10 ? '0' + MailScheduledDate.getMinutes() : MailScheduledDate.getMinutes());
    var ScheduledDate = ((MailScheduledDate.getMonth() + 1) < 10 ? '0' + (MailScheduledDate.getMonth() + 1) : (MailScheduledDate.getMonth() + 1)) + '/' +
        (MailScheduledDate.getDate() < 10 ? '0' + MailScheduledDate.getDate() : MailScheduledDate.getDate()) + '/' +
        MailScheduledDate.getFullYear();
    $('#ui_txtMailScheduleDate').val(ScheduledDate);
    $('#ui_ddlMailScheduleTime').val(ScheduledTime);
    $('#ui_rdbtnMailScheduleLater').prop('checked', true);
    $("#ui_divMailScheduleLaterTime").removeClass("hideDiv");
}

$(".emailcc").click(function () {
    $("#ui_div_CCEmailId").toggleClass("hideDiv");
});
