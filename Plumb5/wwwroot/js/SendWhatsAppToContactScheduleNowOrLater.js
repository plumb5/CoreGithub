
var WhatsAppReminderDetails = {
    Id: 0, ContactId: 0, ScheduleType: 'WhatsApp', Name: '', EmailId: '', PhoneNumber: '', ReminderDate: null, ToReminderEmailId: '', ToReminderPhoneNumber: "", ReminderStatus: 0,
    FromEmailId: "", Subject: "", FromName: "", AlertScheduleStatus: "", AlertScheduleDate: null, UserInfoUserId: 0,
    TemplateName: "", TemplateContent: "", MailReplyEmailId: "", IsPromotionalOrTransnational: false, TemplateId: 0
};

var WhatsAppContact = { ContactId: 0 };
var lmsgroupid = 0;
var WhatsAppLmsGroupMemberId = 0;
var WhatsAppLmsScore = 0;
var WhatsAppLmsPublisher = "";
var WhatsAppLmsLeadLabel = "";

var SendWhatsAppToContactUtil = {
    SendWhatsApp: function (ContactId, LmsGroupId, LmsGroupMemberId, Userinfouserid, Score, Publisher, LeadLabel) {
        $("#ui_div_" + LmsGroupMemberId).addClass("activeBgRow");
        lmsgroupid = LmsGroupId;
        WhatsAppLmsGroupMemberId = 0;
        WhatsAppLmsGroupMemberId = LmsGroupMemberId;
        WhatsAppLmsScore = Score;
        WhatsAppLmsPublisher = Publisher;
        WhatsAppLmsLeadLabel = LeadLabel;
        ShowPageLoading();
        $(".dropdown-menu").removeClass("show");
        $(".popuptitle h6").html("Send Whats App");
       
        SendWhatsAppToContactUtil.ResetWhatsAppDetails();
        SendWhatsAppToContactUtil.GetDetailsForWhatsApp(ContactId);
    },
    BindTemplateContent: function () {
        var SelectedTemplateId = $("#ui_ddlwhatsappTemplate option:selected").val();
        $("#ui_divwhatsappTemplatePreview").addClass("hideDiv");
        $("#ui_txtareaTemplatewhatsappBody").val('');
        $("#ui_spanTotalwhatsappMessageLength").html("0");
        if (parseInt(SelectedTemplateId) > 0) {
            for (var i = 0; i < WhatsAppTemplateList.length; i++) {
                if (SelectedTemplateId == WhatsAppTemplateList[i].Id) {
                    $("#ui_txtareaTemplatewhatsappBody").val(WhatsAppTemplateList[i].TemplateContent);
                    $("#ui_divwhatsappTemplatePreview").removeClass("hideDiv");
                    $("#ui_spanTotalwhatsappMessageLength").html(WhatsAppTemplateList[i].TemplateContent.length);
                    break;
                }
            }
        }
        HidePageLoading();
    },
    ResetWhatsAppDetails: function () {
        $("#ui_smallWhatsAppContactName").html('');
        $("#ui_ddlContactWhatsAppPhoneNumbers").empty();
        //$("#ui_divSmsCustom").removeClass("hideDiv");
       
        $("#ui_ddlwhatsappTemplate").val("0").trigger('change');
        $("#ui_divWhatsAppScheduleLaterTime").addClass("hideDiv");
        $("#ui_rdbtnWhatsAppScheduleNow").prop("checked", true);
       
        $("#ui_txtWhatsAppScheduleDate").val('');
        $("#ui_ddlWhatsAppScheduleTime").val('10:00');
        //$('#ui_ddlwhatsappTemplate option:not(:first)').remove();
    },
    GetDetailsForWhatsApp: function (ContactId) {
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
                    SendWhatsAppToContactUtil.BindContactDetails(response);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.SendWhatsAppToContact.NoContactFound);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    BindContactDetails: function (response) {
        $("#ui_smallWhatsAppContactName").html(response.Name);
        if (response.PhoneNumber != undefined && response.PhoneNumber != null && response.PhoneNumber.length > 0) {
            $("#ui_ddlContactWhatsAppPhoneNumbers").append(`<option value="${response.PhoneNumber}">${response.PhoneNumber}</option>`);
        }

        if (response.AlternatePhoneNumbers != undefined && response.AlternatePhoneNumbers != null && response.AlternatePhoneNumbers.length > 0) {
            var AlternatePhoneNumbersList = response.AlternatePhoneNumbers.split(',');

            for (var i = 0; i < AlternatePhoneNumbersList.length; i++) {
                $("#ui_ddlContactWhatsAppPhoneNumbers").append(`<option value="${AlternatePhoneNumbersList[i]}">${AlternatePhoneNumbersList[i]}</option>`);
            }
        }

        if ($("#ui_ddlContactWhatsAppPhoneNumbers option").length == 0) {
            ShowErrorMessage(GlobalErrorList.SendWhatsAppToContact.NoContactFound);
            $("#ui_div_" + WhatsAppLmsGroupMemberId).removeClass("activeBgRow");
            HidePageLoading();
        } else {
            WhatsAppContact = response;
            $("#ui_divSendWhatsappPopUplater").removeClass("hideDiv");
            $("#ui_div_" + WhatsAppLmsGroupMemberId).removeClass("activeBgRow");
            HidePageLoading();
        }
    },
    ValidateSendWhatsApp: function () {

        if ($("#ui_ddlwhatsappTemplate").val() == null || $("#ui_ddlwhatsappTemplate").val() == "" || $("#ui_ddlwhatsappTemplate").val() == "0") {
            ShowErrorMessage(GlobalErrorList.SendWhatsAppToContact.NoTemplate);
            return false;
        }

        if ($('input[name="WhatsAppScheduleNowLater"]:checked').val() == 1) {
            if ($("#ui_txtWhatsAppScheduleDate").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.SendWhatsAppToContact.NoScheduleDate);
                return false;
            }

            let ScheduledDateString = $("#ui_txtWhatsAppScheduleDate").val().split("/");
            let ScheduledTimeString = $("#ui_ddlWhatsAppScheduleTime").val().split(":");

            var ScheduledDate = new Date(ScheduledDateString[2], parseInt(ScheduledDateString[0]) - 1, ScheduledDateString[1], ScheduledTimeString[0], ScheduledTimeString[1]);

            if (ScheduledDate <= new Date()) {
                ShowErrorMessage(GlobalErrorList.SendWhatsAppToContact.ScheduleDateWrong);
                return false;
            }
        }

        return true;
    },
    AddingPrefixZero: function (n) {
        return (n < 10) ? ("0" + n) : n;
    },
    ScheduleOrSendWhatsApp: function () {
        let SendType = $('input[name="WhatsAppScheduleNowLater"]:checked').val();
        let TemplateId = 0; 
        
        if ($('input[name="WhatsAppScheduleNowLater"]:checked').val() == 1) {
            TemplateId = $("#ui_ddlwhatsappTemplate option:selected").val();
            WhatsAppReminderDetails.TemplateId = parseInt(TemplateId);
            WhatsAppReminderDetails.TemplateName = $("#ui_ddlwhatsappTemplate option:selected").text();
            WhatsAppReminderDetails.TemplateContent = $("#ui_txtareaTemplatewhatsappBody").val();
        }
        else {
            TemplateId = parseInt($("#ui_ddlwhatsappTemplate option:selected").val());
            WhatsAppReminderDetails.TemplateName = $("#ui_ddlwhatsappTemplate option:selected").text();
            //WhatsAppReminderDetails.TemplateContent = $("#ui_txtareaCustomSmsBody").val();
        }

        if (WhatsAppContact != undefined && WhatsAppContact.ContactId != undefined && WhatsAppContact.ContactId != null && WhatsAppContact.ContactId > 0) {
            WhatsAppReminderDetails.ContactId = WhatsAppContact.ContactId;
        }
        else {
            WhatsAppReminderDetails.ContactId = 0;
        }

        if (WhatsAppContact != undefined && WhatsAppContact.Name != undefined && WhatsAppContact.Name != null && WhatsAppContact.Name.length > 0) {
            WhatsAppReminderDetails.Name = WhatsAppContact.Name;
        }
        else {
            WhatsAppReminderDetails.Name = "";
        }

        WhatsAppReminderDetails.PhoneNumber = $("#ui_ddlContactWhatsAppPhoneNumbers").val();
        //WhatsAppReminderDetails.IsPromotionalOrTransnational = parseInt($('input[name="SmsScheduleCampaignType"]:checked').val()) == 0 ? false : true;

        if (SendType == 1) {
            let ScheduledDateString = $("#ui_txtWhatsAppScheduleDate").val().split("/");
            let ScheduledTimeString = $("#ui_ddlWhatsAppScheduleTime").val().split(":");

            let ScheduledDate = `${ScheduledDateString[2]}-${ScheduledDateString[0]}-${ScheduledDateString[1]} ${ScheduledTimeString[0]}:${ScheduledTimeString[1]}:00`;

            ScheduledDate = ConvertDateTimeToUTC(ScheduledDate);
            WhatsAppReminderDetails.AlertScheduleDate = ScheduledDate.getFullYear() + '-' + SendWhatsAppToContactUtil.AddingPrefixZero((ScheduledDate.getMonth() + 1)) + '-' + SendWhatsAppToContactUtil.AddingPrefixZero(ScheduledDate.getDate()) + " " + SendWhatsAppToContactUtil.AddingPrefixZero(ScheduledDate.getHours()) + ":" + SendWhatsAppToContactUtil.AddingPrefixZero(ScheduledDate.getMinutes()) + ":" + SendWhatsAppToContactUtil.AddingPrefixZero(ScheduledDate.getSeconds());
            WhatsAppReminderDetails.AlertScheduleStatus = 'Scheduled';
        }

        var CampaignJobName = window.location.href.includes("Prospect") ? "LMS" : "campaign";
        WhatsAppReminderDetails.LmsGroupId = lmsgroupid;
        
        WhatsAppContacts = new Object();
        const nonNullObject = Object.entries(WhatsAppContact).reduce((acc, [key, value]) => {
            if (value !== null) {
                acc[key] = value;
            }
            return acc;
        }, {});

        WhatsAppContacts = nonNullObject;  
        $.ajax({
            url: "/SendWhatsAppToContact/ScheduleOrSendWhatsApp",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WhatsAppContact': WhatsAppContacts, 'ReminderDetails': WhatsAppReminderDetails, 'TemplateId': TemplateId, 'SendType': SendType, 'CampaignJobName': CampaignJobName, 'lmsgroupmemberid': WhatsAppLmsGroupMemberId, 'Score': WhatsAppLmsScore, 'Publisher': WhatsAppLmsPublisher, 'LeadLabel': WhatsAppLmsLeadLabel }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    if (response.Result) {
                        SendWhatsAppToContactUtil.ResetWhatsAppDetails();
                        if (WhatsAppReminderDetails.Id > 0) {
                            ShowSuccessMessage(GlobalErrorList.SendWhatsAppToContact.WhatsAppScheduledAlert_UpdateSuccessMessage);
                            GetReport();
                        }
                        else {
                            if (SendType == 1)
                                ShowSuccessMessage(GlobalErrorList.SendWhatsAppToContact.WhatsAppScheduled_SuccessMessage);
                            else
                                ShowSuccessMessage(GlobalErrorList.SendWhatsAppToContact.WhatsAppSent_SuccessMessage);
                        }
                    }
                    else {
                        if (WhatsAppReminderDetails.Id > 0)
                            ShowErrorMessage(GlobalErrorList.SendWhatsAppToContact.WhatsAppScheduled_failedMessage);
                        else
                            ShowErrorMessage(GlobalErrorList.SendWhatsAppToContact.WhatsAppSent_failedMessage);
                    }
                }
                $("#ui_divSendWhatsappPopUplater").addClass("hideDiv");

                if (WhatsAppContact != undefined && WhatsAppContact.ContactId != undefined && WhatsAppContact.ContactId != null && WhatsAppContact.ContactId > 0)
                    $("#ui_div_" + WhatsAppContact.ContactId).removeClass("activeBgRow");

                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
}

$("#ui_txtWhatsAppScheduleDate").datepicker({
    defaultDate: "+1d",
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: false,
    minDate: new Date()
}).attr('readonly', 'readonly');

$('#ui_ddlwhatsappTemplate').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$("#ui_ddlwhatsappTemplate").change(function () {
    ShowPageLoading();
    SendWhatsAppToContactUtil.BindTemplateContent();
});

$('input[name="WhatsAppScheduleNowLater"]').click(function () {
    let SendType = $('input[name="WhatsAppScheduleNowLater"]:checked').val();
    if (SendType == "1") {
        $("#ui_divWhatsAppScheduleLaterTime").removeClass("hideDiv");
    }
    else {
        $("#ui_divWhatsAppScheduleLaterTime").addClass("hideDiv");
    }
});

$("#ui_btnSendWhatsappNL").click(function () {
    ShowPageLoading();
    if (!SendWhatsAppToContactUtil.ValidateSendWhatsApp()) {
        HidePageLoading();
        return false;
    }
    SendWhatsAppToContactUtil.ScheduleOrSendWhatsApp();
});

$("#ui_iconCloseWhatsappPopUp, #ui_btnCancelWhatsapp").click(function () {
    SendWhatsAppToContactUtil.ResetWhatsAppDetails();
    $("#ui_divSendWhatsappPopUplater").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
});

function BindScheduledWhatsappAlertDetails(responsetr, Id, TemplateId, ContactId, IsPromotionalOrTransnational, SmsAlertScheduleDate) {

    $("#ui_divSendWhatsappPopUplater").removeClass("hideDiv");
    SendWhatsAppToContactUtil.GetDetailsForWhatsApp(ContactId);
    WhatsAppReminderDetails.Id = Id;
    var SmsScheduleAlerttr = responsetr.closest("tr");
    var ScheduledSmsPhoneNumber = SmsScheduleAlerttr.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.innerText;
  
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
        $("#ui_spanTotalwhatsappMessageLength").html(ScheduledSmsContent.length);
    }
    else {

        //$('#ui_rdbtnSmsTypeTemplate').prop('checked', true);
        //$("#ui_divSmsCustom").addClass("hideDiv");
        //$("#ui_divSmsTemplate").removeClass("hideDiv");
        //$('#ui_txtareaCustomSmsBody').val('');
        $("#ui_ddlwhatsappTemplate").val(TemplateId).trigger('change');
    }



    // var SmsScheduledDate = new Date(SmsScheduledAlertScheduledDate);
    var SmsScheduledDate = GetJavaScriptDateObj(SmsAlertScheduleDate);
    var ScheduledTime = (SmsScheduledDate.getHours() < 10 ? '0' + SmsScheduledDate.getHours() : SmsScheduledDate.getHours()) + ':'
        + (SmsScheduledDate.getMinutes() < 10 ? '0' + SmsScheduledDate.getMinutes() : SmsScheduledDate.getMinutes());
    var ScheduledDate = (((SmsScheduledDate.getMonth() + 1) < 10) ? ('0' + (SmsScheduledDate.getMonth() + 1) + '/') : ((SmsScheduledDate.getMonth() + 1) + '/')) +
        (SmsScheduledDate.getDate() < 10 ? '0' + SmsScheduledDate.getDate() + '/' : SmsScheduledDate.getDate() + '/') + SmsScheduledDate.getFullYear();
    $('#ui_txtWhatsAppScheduleDate').val(ScheduledDate);
    $('#ui_ddlWhatsAppScheduleTime').val(ScheduledTime);
    $('#ui_ddlContactWhatsAppPhoneNumbers').val(ScheduledSmsPhoneNumber);

    $('#ui_rdbtnWhatsAppScheduleLater').prop('checked', true);
    $("#ui_divWhatsAppScheduleLaterTime").removeClass("hideDiv");

}
