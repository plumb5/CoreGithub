var smsTemplateId = 0, smsCampaignId = 0;
var TemplateCounselorTags = false;

$('#testcampgroupname').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
});

$(".clseprevtemp").click(function () {
    $(this).parent().addClass("hideDiv");
});

$(".previewthis").click(function () {
    $(".previewtempsidewrp").removeClass("hideDiv");
});

$('input[name="testcampaignType"]').click(function () {
    var gettestcampval = $('input[name="testcampaignType"]:checked').val();
    if (gettestcampval == "groupcampaign") {
        $("#indivtxtbox").addClass("hideDiv");
        $("#groupdropdownbox").removeClass("hideDiv");
    }
    else {
        $("#groupdropdownbox").addClass("hideDiv");
        $("#indivtxtbox").removeClass("hideDiv");
    }
    $("#ui_txt_SmsIndividualPhoneNumber").val("");
    $("#testcampgroupname").select2().val(0).trigger('change');
});

var CreateSMSTestCampaign = {
    ClearTestTemplatePopUp: function () {
        $("#ui_txt_SmsCampaignIdentifier, #ui_txt_SmsIndividualPhoneNumber").val("");
        $("#testcampgroupname").select2().val(0).trigger('change');
        $("#ui_rad_SmsPromotional, #testcampaigngroup").prop('checked', false);
        $("#ui_rad_SmsTransactional, #testcampaignindiv").prop('checked', true);
        $("#groupdropdownbox").addClass("hideDiv");
        $("#indivtxtbox").removeClass("hideDiv");
        if (!$(".previewtempsidewrp").hasClass("hideDiv"))
            $(".previewtempsidewrp").addClass("hideDiv");
        $("#ui_div_SmsMessageContent").html("");
        smsTemplateId = 0, smsCampaignId = 0;
        $("#ui_ddlCampaignSmsSettings").select2().val(DefaultConfigurationNameId).change();
    },
    CreateUniqueIdentifier: function () {
        var today = new Date();
        var strYear = today.getFullYear().toString() + today.getMonth().toString() + 1 + today.getDate().toString() + today.getMilliseconds().toString();
        $("#ui_txt_SmsCampaignIdentifier").val("Sms Campaign Identifier -" + strYear);
    },
    TestTemplate: function (Id, CampaignId, Name, IsPromotionalOrTransactionalType) {
        CreateSMSTestCampaign.CheckTemplateContainsCounselorTags(Id);
        CreateSMSTestCampaign.ClearTestTemplatePopUp();
        CreateSMSTestCampaign.CreateUniqueIdentifier();
        $(".popupsubtitle").html(Name);
        $("#ui_div_SmsMessageContent").html($("#ui_a_TestSMS_" + Id).attr("data-SmsContent"));
        $("#ui_div_TestSmsTemplate").removeClass("hideDiv");
        if (IsPromotionalOrTransactionalType == true) {
            $("#ui_rad_SmsTransactional").prop("checked", true);
        } else {
            $("#ui_rad_SmsPromotional").prop("checked", true);
        }
        smsTemplateId = Id;
        smsCampaignId = CampaignId;
    },
    ValidateTestSMSTemplateCampaignCreation: function () {
        if (TemplateCounselorTags) {
            ShowErrorMessage(GlobalErrorList.SmsSchedule.CounselorTags);
            return false;
        }

        if (CleanText($.trim($("#ui_txt_SmsCampaignIdentifier").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateSMSTestCampaign.CampaignIdentifierError);
            return false;
        }

        if ($('input[type="radio"][name="testcampaignType"]:checked').val().toLowerCase() == "indivcampaign" && CleanText($.trim($("#ui_txt_SmsIndividualPhoneNumber").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateSMSTestCampaign.TestPhoneNumberError);
            return false;
        }

        if ($('input[type="radio"][name="testcampaignType"]:checked').val().toLowerCase() == "groupcampaign" && $("#testcampgroupname").val() == 0) {
            ShowErrorMessage(GlobalErrorList.CreateSMSTestCampaign.TestGroupError);
            return false;
        }

        if (parseInt($("#ui_ddlCampaignSmsSettings").val()) == 0) {
            ShowErrorMessage(GlobalErrorList.SmsSchedule.SelectSmsProvider);
            return false;
        }

        return true;
    },
    SendIndividualTestSMS: function () {
        var IsPromotionalOrTransactionalType;

        if ($("#ui_rad_SmsPromotional").is(":checked"))
            IsPromotionalOrTransactionalType = false;
        else
            IsPromotionalOrTransactionalType = true;

        var SmsTemplateId = smsTemplateId;
        var PhoneNumber = $.trim($("#ui_txt_SmsIndividualPhoneNumber").val());

        $.ajax({
            url: "/Sms/ScheduleCampaign/SendIndividualTestSMS",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'SmsTemplateId': SmsTemplateId, 'PhoneNumber': PhoneNumber, 'IsPromotionalOrTransactionalType': IsPromotionalOrTransactionalType, 'SmsConfigurationNameId': parseInt($("#ui_ddlCampaignSmsSettings").val()) }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.SentStatus)
                    ShowSuccessMessage(GlobalErrorList.CreateSMSTestCampaign.TestMessageSuccess);
                else
                    ShowErrorMessage(response.Message);
                $("#close-popup").click();
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    SendGroupTestSMS: function () {
        var IsPromotionalOrTransactionalType;

        if ($("#ui_rad_SmsPromotional").is(":checked"))
            IsPromotionalOrTransactionalType = 0;
        else
            IsPromotionalOrTransactionalType = 1;

        var smsSendingSetting = {
            IsPromotionalOrTransactionalType: IsPromotionalOrTransactionalType,
            GroupId: $("#testcampgroupname").val(),
            Name: $.trim($("#ui_txt_SmsCampaignIdentifier").val()),
            SmsTemplateId: smsTemplateId,
            CampaignId: smsCampaignId,
            ScheduleBatchType: "SINGLE",
            SmsConfigurationNameId: $("#ui_ddlCampaignSmsSettings").val()
        };

        $.ajax({
            url: "/Sms/ScheduleCampaign/SendGroupTestSMS",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'smsSendingSetting': smsSendingSetting }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    if (response.SentCount > 0 || response.FailureCount > 0 || response.UnsubscribedCount > 0)
                        ShowSuccessMessage(response.Message);
                    else
                        ShowErrorMessage(response.Message);
                }
                else
                    ShowErrorMessage(GlobalErrorList.CreateSMSTestCampaign.GroupTestMessageError);
                $("#close-popup").click();
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    CheckTemplateContainsCounselorTags(SmsTemplateId) {
        ShowPageLoading();
        TemplateCounselorTags = false;
        var SmsTemplate = { Id: SmsTemplateId };
        $.ajax({
            url: "/SMS/Template/CheckCounselorTags",
            type: 'POST',
            data: JSON.stringify({ 'smsTemplate': SmsTemplate }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (response) {
                    TemplateCounselorTags = true;
                    ShowErrorMessage(GlobalErrorList.SmsSchedule.CounselorTags);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
};

$("#ui_a_TestSMSTemplate").click(function () {
    if (!CreateSMSTestCampaign.ValidateTestSMSTemplateCampaignCreation())
        return false;

    ShowPageLoading();
    if ($('input[type="radio"][name="testcampaignType"]:checked').val().toLowerCase() == "indivcampaign")
        CreateSMSTestCampaign.SendIndividualTestSMS();
    else
        CreateSMSTestCampaign.SendGroupTestSMS();
});

