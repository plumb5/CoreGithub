
var SmsReminderDetails = {
    Id: 0, ContactId: 0, ScheduleType: 'Sms', Name: '', EmailId: '', PhoneNumber: '', ReminderDate: null, ToReminderEmailId: '', ToReminderPhoneNumber: null, ReminderStatus: 0,
    FromEmailId: "", Subject: "", FromName: "", AlertScheduleStatus: "", AlertScheduleDate: null, UserInfoUserId: 0,
    TemplateName: "", TemplateContent: "", MailReplyEmailId: "", IsPromotionalOrTransnational: false, TemplateId: 0
};

var SmsContact = { ContactId: 0 };
var lmsgroupid = 0;
var SmsLmsGroupMemberId = 0;
var SmsLmsScore = 0;
var SmsLmsPublisher = "";
var SmsLmsLeadLabel = "";
//function SendSms(ContactId) {
//    ShowPageLoading();
//    $(".dropdown-menu").removeClass("show");
//    $(".popuptitle h6").html("Send SMS");
//    $("#dv_AssignSalesPerson,#dv_LmsNotes,#dv_LmsSource,#dv_AddFollowUp,#dv_AssignStage,#ui_divSendCallPopUp,#dv_CreateLead,#ui_divSendMailPopUp,#dv_FilterContacts,#dv_ViewFollowUpDetails").addClass("hideDiv");
//    SendSMSToContactUtil.ResetSMSDetails();
//    SendSMSToContactUtil.GetDetailsForSMS(ContactId);
//}

var SendSMSToContactUtil = {
    SendSms: function (ContactId, LmsGroupId, LmsGroupMemberId, Userinfouserid, Score, Publisher, LeadLabel) {
        //if (Plumb5UserId == Userinfouserid || LmsPermissionlevelSeniorUserID == 0) {
            $("#ui_div_" + LmsGroupMemberId).addClass("activeBgRow");
            lmsgroupid = LmsGroupId;
            SmsLmsGroupMemberId = 0;
            SmsLmsGroupMemberId = LmsGroupMemberId;
        SmsLmsScore = Score;
            SmsLmsPublisher = Publisher;
            SmsLmsLeadLabel = LeadLabel;
            ShowPageLoading();
            $(".dropdown-menu").removeClass("show");
            $(".popuptitle h6").html("Send SMS");
            ////Removed LmsSource By Arnab - 2021-02-13 10:13:53.170 P5-507
            //$("#dv_AssignSalesPerson,#dv_LmsNotes,#dv_LmsSource,#dv_AddFollowUp,#dv_AssignStage,#ui_divSendCallPopUp,#dv_CreateLead,#ui_divSendMailPopUp,#dv_FilterContacts").addClass("hideDiv");
            //$("#dv_AssignSalesPerson,#dv_LmsNotes,#dv_AddFollowUp,#dv_AssignStage,#ui_divSendCallPopUp,#dv_CreateLead,#ui_divSendMailPopUp,#dv_FilterContacts").addClass("hideDiv");
            ////Removed LmsSource By Arnab - 2021-02-13 10:13:53.170 P5-507
            SendSMSToContactUtil.ResetSMSDetails();
            SendSMSToContactUtil.GetDetailsForSMS(ContactId);
        
    },
    BindTemplateContent: function () {
        var SelectedTemplateId = $("#ui_ddlSmsTemplate option:selected").val();
        $("#ui_divSmsTemplatePreview").addClass("hideDiv");
        $("#ui_txtareaTemplateSmsBody").val('');
        $("#ui_spanTotalSmsMessageLength").html("0");
        if (parseInt(SelectedTemplateId) > 0) {
            for (var i = 0; i < SmsTemplateList.length; i++) {
                if (SelectedTemplateId == SmsTemplateList[i].Id) {
                    $("#ui_txtareaTemplateSmsBody").val(SmsTemplateList[i].MessageContent);
                    $("#ui_divSmsTemplatePreview").removeClass("hideDiv");
                    $("#ui_spanTotalSmsMessageLength").html(SmsTemplateList[i].MessageContent.length);
                    break;
                }
            }
        }
        HidePageLoading();
    },
    ResetSMSDetails: function () {
        $("#ui_smallContactName").html('');
        $("#ui_ddlContactSMSPhoneNumbers").empty();
        //$("#ui_rdbtnSmsTypeCustom").prop("checked", true);
        $("#ui_divSmsCustom").removeClass("hideDiv");
        //$("#ui_divSmsTemplate").addClass("hideDiv");
        $("#ui_ddlSmsTemplate").val("0").trigger('change');
        $("#ui_divSMSScheduleLaterTime").addClass("hideDiv");
        $("#ui_rdbtnSMSScheduleNow").prop("checked", true);
        //$("#ui_txtareaCustomSmsBody").val('');
        $("#ui_txtSMSScheduleDate").val('');
        $("#ui_ddlSMSScheduleTime").val('10:00');
        //$('#ui_ddlSmsTemplate option:not(:first)').remove();
        //$("#ui_ddlSmsTemplate").html(`<option value="0">Select Template</option>`);
        $("#ui_rdbtnSmsSchedulePromotional,#ui_rdbtnSmsScheduleTransactional").prop('checked', false);
    },
    GetDetailsForSMS: function (ContactId) {
        $.ajax({
            url: "/SendSMSToContact/GetContactDetails",
            type: 'POST',
            data: JSON.stringify({
                'accountId': Plumb5AccountId, 'ContactId': ContactId
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    SendSMSToContactUtil.BindContactDetails(response);
                } else {
                    ShowErrorMessage(GlobalErrorList.SendSmsToContact.NoContactFound);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    BindContactDetails: function (response) {
        $("#ui_smallSMSContactName").html(response.Name);
        if (response.PhoneNumber != undefined && response.PhoneNumber != null && response.PhoneNumber.length > 0) {
            $("#ui_ddlContactSMSPhoneNumbers").append(`<option value="${response.PhoneNumber}">${response.PhoneNumber}</option>`);
        }

        if (response.AlternatePhoneNumbers != undefined && response.AlternatePhoneNumbers != null && response.AlternatePhoneNumbers.length > 0) {
            var AlternatePhoneNumbersList = response.AlternatePhoneNumbers.split(',');

            for (var i = 0; i < AlternatePhoneNumbersList.length; i++) {
                $("#ui_ddlContactSMSPhoneNumbers").append(`<option value="${AlternatePhoneNumbersList[i]}">${AlternatePhoneNumbersList[i]}</option>`);
            }
        }

        if ($("#ui_ddlContactSMSPhoneNumbers option").length == 0) {
            ShowErrorMessage(GlobalErrorList.SendSmsToContact.NoContactFound);
            $("#ui_div_" + SmsLmsGroupMemberId).removeClass("activeBgRow");
            HidePageLoading();
        } else {
            SmsContact = response;
            $("#ui_divSendSMSPopUp").removeClass("hideDiv");
            $("#ui_div_" + SmsLmsGroupMemberId).removeClass("activeBgRow");
            HidePageLoading();
        }
    },
    ValidateSendSms: function () {

        //if ($('input[name="SmsSendingType"]:checked').val() == 0 && $("#ui_txtareaCustomSmsBody").val().length == 0) {
        //    ShowErrorMessage(GlobalErrorList.SendSmsToContact.NoMessageContent);
        //    return false;
        //}

        //if ($('input[name="SmsSendingType"]:checked').val() == 1 && $("#ui_ddlSmsTemplate option:selected").val() == 0) {
        //    ShowErrorMessage(GlobalErrorList.SendSmsToContact.NoTemplate);
        //    return false;
        //}

        if (!$("input[name='SmsScheduleCampaignType']").is(':checked')) {
            ShowErrorMessage(GlobalErrorList.SendSmsToContact.NoCampaignType);
            return false;
        }

        if ($("#ui_ddlSmsTemplate").val() == null || $("#ui_ddlSmsTemplate").val() == "" || $("#ui_ddlSmsTemplate").val() == "0") {
            ShowErrorMessage(GlobalErrorList.SendSmsToContact.NoTemplate);
            return false;
        }

        if ($('input[name="SMSScheduleNowLater"]:checked').val() == 1) {
            if ($("#ui_txtSMSScheduleDate").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.SendSmsToContact.NoScheduleDate);
                return false;
            }

            let ScheduledDateString = $("#ui_txtSMSScheduleDate").val().split("/");
            let ScheduledTimeString = $("#ui_ddlSMSScheduleTime").val().split(":");

            var ScheduledDate = new Date(ScheduledDateString[2], parseInt(ScheduledDateString[0]) - 1, ScheduledDateString[1], ScheduledTimeString[0], ScheduledTimeString[1]);

            if (ScheduledDate <= new Date()) {
                ShowErrorMessage(GlobalErrorList.SendSmsToContact.ScheduleDateWrong);
                return false;
            }
        }

        return true;
    },
    AddingPrefixZero: function (n) {
        return (n < 10) ? ("0" + n) : n;
    },
    ScheduleOrSendSms: function () {
        let SendType = $('input[name="SMSScheduleNowLater"]:checked').val();
        let TemplateId = 0;

        if ($('input[name="SMSScheduleNowLater"]:checked').val() == 1) {
            TemplateId = $("#ui_ddlSmsTemplate option:selected").val();
            SmsReminderDetails.TemplateId = parseInt(TemplateId);
            SmsReminderDetails.TemplateName = $("#ui_ddlSmsTemplate option:selected").text();
            SmsReminderDetails.TemplateContent = $("#ui_txtareaTemplateSmsBody").val();
        }
        else {
            TemplateId = parseInt($("#ui_ddlSmsTemplate option:selected").val());
            SmsReminderDetails.TemplateName = $("#ui_ddlSmsTemplate option:selected").text();
            //SmsReminderDetails.TemplateContent = $("#ui_txtareaCustomSmsBody").val();
        }

        if (SmsContact != undefined && SmsContact.ContactId != undefined && SmsContact.ContactId != null && SmsContact.ContactId > 0) {
            SmsReminderDetails.ContactId = SmsContact.ContactId;
        } else {
            SmsReminderDetails.ContactId = 0;
        }

        if (SmsContact != undefined && SmsContact.Name != undefined && SmsContact.Name != null && SmsContact.Name.length > 0) {
            SmsReminderDetails.Name = SmsContact.Name;
        } else {
            SmsReminderDetails.Name = "";
        }

        SmsReminderDetails.PhoneNumber = $("#ui_ddlContactSMSPhoneNumbers").val();
        SmsReminderDetails.IsPromotionalOrTransnational = parseInt($('input[name="SmsScheduleCampaignType"]:checked').val()) == 0 ? false : true;

        if (SendType == 1) {
            let ScheduledDateString = $("#ui_txtSMSScheduleDate").val().split("/");
            let ScheduledTimeString = $("#ui_ddlSMSScheduleTime").val().split(":");

            let ScheduledDate = `${ScheduledDateString[2]}-${ScheduledDateString[0]}-${ScheduledDateString[1]} ${ScheduledTimeString[0]}:${ScheduledTimeString[1]}:00`;

            ScheduledDate = ConvertDateTimeToUTC(ScheduledDate);
            SmsReminderDetails.AlertScheduleDate = ScheduledDate.getFullYear() + '-' + SendSMSToContactUtil.AddingPrefixZero((ScheduledDate.getMonth() + 1)) + '-' + SendSMSToContactUtil.AddingPrefixZero(ScheduledDate.getDate()) + " " + SendSMSToContactUtil.AddingPrefixZero(ScheduledDate.getHours()) + ":" + SendSMSToContactUtil.AddingPrefixZero(ScheduledDate.getMinutes()) + ":" + SendSMSToContactUtil.AddingPrefixZero(ScheduledDate.getSeconds());
            SmsReminderDetails.AlertScheduleStatus = 'Scheduled';
        }
         
        
        SmsContacts = new Object();
        const nonNullObject = Object.entries(SmsContact).reduce((acc, [key, value]) => {
            if (value !== null) {
                acc[key] = value;
            }
            return acc;
        }, {});

        SmsContacts = nonNullObject;  
        var CampaignJobName = window.location.href.includes("Prospect") ? "LMS" : "campaign";
        SmsReminderDetails.LmsGroupId = lmsgroupid;
        $.ajax({
            url: "/SendSMSToContact/ScheduleOrSendSms",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'SmsContact': SmsContacts, 'ReminderDetails': SmsReminderDetails, 'TemplateId': TemplateId, 'SendType': SendType, 'CampaignJobName': CampaignJobName, 'lmsgroupmemberid': SmsLmsGroupMemberId, 'Score': SmsLmsScore, 'Publisher': SmsLmsPublisher, 'LeadLabel': SmsLmsLeadLabel }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    if (response.Result) {
                        SendSMSToContactUtil.ResetSMSDetails();
                        if (SmsReminderDetails.Id > 0) {
                            ShowSuccessMessage(GlobalErrorList.SendSmsToContact.SmsScheduledAlert_UpdateSuccessMessage);
                            GetReport();
                        }
                        else {
                            if (SendType == 1)
                                ShowSuccessMessage(GlobalErrorList.SendSmsToContact.SmsScheduled_SuccessMessage);
                            else
                                ShowSuccessMessage(GlobalErrorList.SendSmsToContact.SmsSent_SuccessMessage);
                        }
                    }
                    else {
                        if (SmsReminderDetails.Id > 0)
                            ShowErrorMessage(GlobalErrorList.SendSmsToContact.SmsScheduled_failedMessage);
                        else
                            ShowErrorMessage(GlobalErrorList.SendSmsToContact.SmsSent_failedMessage);
                    }
                }
                $("#ui_divSendSMSPopUp").addClass("hideDiv");

                if (SmsContact != undefined && SmsContact.ContactId != undefined && SmsContact.ContactId != null && SmsContact.ContactId > 0)
                    $("#ui_div_" + SmsContact.ContactId).removeClass("activeBgRow");

                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
}

$("#ui_txtSMSScheduleDate").datepicker({
    defaultDate: "+1d",
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: false,
    minDate: new Date()
}).attr('readonly', 'readonly');

$('#ui_ddlSmsTemplate').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$("#ui_ddlSmsTemplate").change(function () {
    ShowPageLoading();
    SendSMSToContactUtil.BindTemplateContent();
});

//$('input[name="SmsSendingType"]').click(function () {
//    $("#ui_divSmsCustom").addClass("hideDiv");
//    $("#ui_divSmsTemplate").addClass("hideDiv");
//    var msgcontent = '';
//    // $("#ui_txtareaCustomSmsBody").val('');

//    let SendType = $('input[name="SmsSendingType"]:checked').val();
//    if (SendType == "0") {
//        //msgcontent = $('#ui_txtareaCustomSmsBody').val();
//        $("#ui_divSmsCustom").removeClass("hideDiv");
//    } else {
//        msgcontent = $('#ui_txtareaTemplateSmsBody').val();
//        $("#ui_divSmsTemplate").removeClass("hideDiv");
//    }
//    $("#ui_spanTotalSmsMessageLength").html(msgcontent.length);
//});

$('input[name="SMSScheduleNowLater"]').click(function () {
    let SendType = $('input[name="SMSScheduleNowLater"]:checked').val();
    if (SendType == "1") {
        $("#ui_divSMSScheduleLaterTime").removeClass("hideDiv");
    } else {
        $("#ui_divSMSScheduleLaterTime").addClass("hideDiv");
    }
});

$("#ui_btnSendSMS").click(function () {
    ShowPageLoading();
    if (!SendSMSToContactUtil.ValidateSendSms()) {
        HidePageLoading();
        return false;
    }
    SendSMSToContactUtil.ScheduleOrSendSms();
});

$("#ui_iconCloseSMSPopUp, #ui_btnCancelSMS").click(function () {
    SendSMSToContactUtil.ResetSMSDetails();
    $("#ui_divSendSMSPopUp").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
});

//$("#ui_txtareaCustomSmsBody").keyup(function () {
//    let MessageContent = $("#ui_txtareaCustomSmsBody").val();
//    $("#ui_spanTotalSmsMessageLength").html(MessageContent.length);
//});

function BindScheduledSmsAlertDetails(responsetr, Id, TemplateId, ContactId, IsPromotionalOrTransnational, SmsAlertScheduleDate) {
    ////Removed LmsSource By Arnab - 2021-02-13 10:13:53.170 P5-507
    //$("#dv_AssignSalesPerson,#dv_LmsNotes,#dv_LmsSource,#dv_AddFollowUp,#dv_AssignStage,#ui_divSendCallPopUp,#dv_CreateLead,#ui_divSendMailPopUp,#dv_FilterContacts").addClass("hideDiv");
    //$("#dv_AssignSalesPerson,#dv_LmsNotes,#dv_AddFollowUp,#dv_AssignStage,#ui_divSendCallPopUp,#dv_CreateLead,#ui_divSendMailPopUp,#dv_FilterContacts").addClass("hideDiv");
    ////Removed LmsSource By Arnab - 2021-02-13 10:13:53.170 P5-507
    $("#ui_divSendSMSPopUp").removeClass("hideDiv");
    SendSMSToContactUtil.GetDetailsForSMS(ContactId);
    SmsReminderDetails.Id = Id;
    var SmsScheduleAlerttr = responsetr.closest("tr");
    var ScheduledSmsPhoneNumber = SmsScheduleAlerttr.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.innerText;
    //var SmsScheduledAlertScheduledDate = SmsScheduleAlerttr.firstElementChild.nextElementSibling.nextElementSibling.
    //    nextElementSibling.nextElementSibling.innerText;
    var ScheduledSmsContent = SmsScheduleAlerttr.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.
        firstElementChild.innerText;

    if (IsPromotionalOrTransnational == true)
        $('#ui_rdbtnSmsScheduleTransactional').prop('checked', true);
    else
        $('#ui_rdbtnSmsSchedulePromotional').prop('checked', true);
    if (TemplateId == 0) {
        //$('#ui_rdbtnSmsTypeCustom').attr('checked', true);
        //$("#ui_divSmsTemplate").addClass("hideDiv");
        //$("#ui_divSmsCustom").removeClass("hideDiv");
        //$('#ui_txtareaCustomSmsBody').val(ScheduledSmsContent);
        $("#ui_spanTotalSmsMessageLength").html(ScheduledSmsContent.length);
    }
    else {

        //$('#ui_rdbtnSmsTypeTemplate').prop('checked', true);
        //$("#ui_divSmsCustom").addClass("hideDiv");
        //$("#ui_divSmsTemplate").removeClass("hideDiv");
        //$('#ui_txtareaCustomSmsBody').val('');
        $("#ui_ddlSmsTemplate").val(TemplateId).trigger('change');
    }



    // var SmsScheduledDate = new Date(SmsScheduledAlertScheduledDate);
    var SmsScheduledDate = GetJavaScriptDateObj(SmsAlertScheduleDate);
    var ScheduledTime = (SmsScheduledDate.getHours() < 10 ? '0' + SmsScheduledDate.getHours() : SmsScheduledDate.getHours()) + ':'
        + (SmsScheduledDate.getMinutes() < 10 ? '0' + SmsScheduledDate.getMinutes() : SmsScheduledDate.getMinutes());
    var ScheduledDate = (((SmsScheduledDate.getMonth() + 1) < 10) ? ('0' + (SmsScheduledDate.getMonth() + 1) + '/') : ((SmsScheduledDate.getMonth() + 1) + '/')) +
        (SmsScheduledDate.getDate() < 10 ? '0' + SmsScheduledDate.getDate() + '/' : SmsScheduledDate.getDate() + '/') + SmsScheduledDate.getFullYear();
    $('#ui_txtSMSScheduleDate').val(ScheduledDate);
    $('#ui_ddlSMSScheduleTime').val(ScheduledTime);
    $('#ui_ddlContactSMSPhoneNumbers').val(ScheduledSmsPhoneNumber);

    $('#ui_rdbtnSMSScheduleLater').prop('checked', true);
    $("#ui_divSMSScheduleLaterTime").removeClass("hideDiv");

}

$('input[type=radio][name=SmsScheduleCampaignType]').change(function () {
    ShowPageLoading();
    BindTemplate();
});

function BindTemplate() {
    $("#ui_ddlSmsTemplate").html(`<option value="0">Select Template</option>`);

    if ($("input[name='SmsScheduleCampaignType']:checked").val() === "1") {
        $.each(SmsTemplateList, function () {
            if ($(this)[0].IsPromotionalOrTransactionalType) {
                $("#ui_ddlSmsTemplate").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
            }
        });
    }
    else if ($("input[name='SmsScheduleCampaignType']:checked").val() === "0") {
        $.each(SmsTemplateList, function () {
            if ((!$(this)[0].IsPromotionalOrTransactionalType)) {
                $("#ui_ddlSmsTemplate").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
            }
        });
    }

    HidePageLoading();
}