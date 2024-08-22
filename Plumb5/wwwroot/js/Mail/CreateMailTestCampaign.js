var mailTemplateId = 0;
var mailCampaignId = 0;
var MailContainsCounselorTags = false;

var CreateMailTemplateTestCampaign = {
    OpenTestTemplatePopUp: function (Id, SpamScore, Name, MailCampaignId, SubjectLine) {

        if (SpamScore > 5 || parseInt($("#ui_SpamScoreUpdate_" + Id).html()) > 5) {

            CreateMailTemplateTestCampaign.CheckForCounselorTags(Id);

            CreateMailTemplateTestCampaign.RefreshTestTemplatePopUp();
            CreateMailTemplateTestCampaign.CreateUniqueIdentifier();
            mailTemplateId = Id;
            mailCampaignId = MailCampaignId;
            $(".popupsubtitle").html(Name);
            PreinitalizeValue({ "FirstName": "ui_txt_MailFromName" });
            $("#ui_div_MailTemplatePreview").append(`<iframe src="https://${TemplatePath}Campaign-${Plumb5AccountId}-${Id}/TemplateContent.html" frameborder="0"></iframe>`);
            $("#ui_div_TestMailTemplatePopUp").removeClass("hideDiv");
            $("#ui_txt_MailSubject").val(SubjectLine != null ? SubjectLine : "");
        }
        else
            ShowErrorMessage(GlobalErrorList.CreateMailTestCampaign.MailTemplateSpamScore);
    },
    CreateUniqueIdentifier: function () {
        var today = new Date();
        var strYear = today.getFullYear().toString() + today.getMonth().toString() + 1 + today.getDate().toString() + today.getMilliseconds().toString();
        $("#ui_txt_MailCampaignIdentifier").val("Mail Campaign Identifier -" + strYear);
    },
    RefreshTestTemplatePopUp: function () {
        $("#ui_txt_MailCampaignIdentifier, #ui_txt_MailFromName, #ui_txt_MailReplyTo, #ui_txt_MailSubject, #ui_txt_MailIndividualId").val("");
        $("#ui_drpdwn_ContactGroups").select2().val(0).trigger('change');
        $("#ui_rad_MailPromotional, #testcampaigngroup, #ui_check_MailForward").prop('checked', false);
        $("#ui_rad_MailTransactional, #testcampaignindiv, #ui_check_MailUnsubscribe").prop('checked', true);
        $("#ui_drpdwn_MailFromAddress").select2().val("NULL").trigger('change');
        $("#groupdropdownbox").addClass("hideDiv");
        $("#indivtxtbox").removeClass("hideDiv");
        if (!$(".previewtempsidewrp").hasClass("hideDiv"))
            $(".previewtempsidewrp").addClass("hideDiv");
        $("#ui_div_MailTemplatePreview").empty();
        mailTemplateId = 0;
        $("#ui_ConfigurationName").select2().val(DefaultConfigurationNameId).change();
    },
    ValidateTestMailTemplate: function () {
        if (MailContainsCounselorTags) {
            ShowErrorMessage(GlobalErrorList.MailScheduleError.MailTemplateCounselorTags);
            return false;
        }

        if (CleanText($.trim($("#ui_txt_MailCampaignIdentifier").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateMailTestCampaign.CampaignIdentifier);
            return false;
        }
        if (CleanText($.trim($("#ui_txt_MailFromName").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateMailTestCampaign.FromName);
            return false;
        }
        if ($("#ui_drpdwn_MailFromAddress").val() == "NULL") {
            ShowErrorMessage(GlobalErrorList.CreateMailTestCampaign.FromActiveEmailid);
            return false;
        }
        if (CleanText($.trim($("#ui_txt_MailReplyTo").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateMailTestCampaign.ReplyToError);
            return false;
        }
        if (CleanText($.trim($("#ui_txt_MailSubject").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateMailTestCampaign.Subject);
            return false;
        }
        if ($('input[type="radio"][name="testcampaignType"]:checked').val().toLowerCase() == "indivcampaign" && CleanText($.trim($("#ui_txt_MailIndividualId").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateMailTestCampaign.TestEmailIdError);
            return false;
        }
        if ($('input[type="radio"][name="testcampaignType"]:checked').val().toLowerCase() == "indivcampaign" && CleanText($.trim($("#ui_txt_MailIndividualId").val())).length > 0 && !regExpEmail.test($("#ui_txt_MailIndividualId").val())) {
            ShowErrorMessage(GlobalErrorList.CreateMailTestCampaign.ValidTestEmailIdError);
            return false;
        }
        if ($('input[type="radio"][name="testcampaignType"]:checked').val().toLowerCase() == "groupcampaign" && $("#ui_drpdwn_ContactGroups").val() == 0) {
            ShowErrorMessage(GlobalErrorList.CreateMailTestCampaign.SentToGroup);
            return false;
        }
        if ($("#ui_ConfigurationName option:selected").val() == undefined || $("#ui_ConfigurationName option:selected").val() == null || $("#ui_ConfigurationName option:selected").val() == "" || $("#ui_ConfigurationName option:selected").val() == "0") {
            ShowErrorMessage(GlobalErrorList.MailScheduleError.ConfigurationName);
            return false;
        }
        return true;
    },
    SendGroupTestMail: function (mailSendingSetting) {
        $.ajax({
            url: "/Mail/Send/SendGroupTestMail",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'mailSendingSetting': mailSendingSetting }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result != undefined && result != null) {
                    if (result.SentCount > 0 || result.FailureCount > 0)
                        ShowSuccessMessage(GlobalErrorList.CreateMailTestCampaign.GroupTestResultSuccessMessage);
                    else
                        ShowErrorMessage(result.Message);
                }
                else
                    ShowErrorMessage(GlobalErrorList.CreateMailTestCampaign.GroupTestResultErrorMessage);
                $("#close-popup").click();
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    SendIndividaulTestMail: function (mailSendingSetting, testemailid) {
        $.ajax({
            url: "/Mail/Send/SendTestMail",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'mailSendingSetting': mailSendingSetting, 'emailId': testemailid, 'Areas': 'Mail' }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result.Status)
                    ShowSuccessMessage(result.Message);
                else
                    ShowErrorMessage(result.Message);
                $("#close-popup").click();
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    CheckForCounselorTags: function (mailTemplateId) {
        ShowPageLoading();
        MailContainsCounselorTags = false;
        $.ajax({
            url: "/Mail/MailTemplate/CheckCounselorTags",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'MailTemplateId': mailTemplateId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result) {
                    MailContainsCounselorTags = true;
                    ShowErrorMessage(GlobalErrorList.MailScheduleError.MailTemplateCounselorTags);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
};

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
    } else {
        $("#groupdropdownbox").addClass("hideDiv");
        $("#indivtxtbox").removeClass("hideDiv");
    }
    $("#ui_txt_MailIndividualId").val("");
    $("#ui_drpdwn_ContactGroups").select2().val(0).trigger('change');
});

$('#ui_drpdwn_MailFromAddress, #ui_drpdwn_ContactGroups, #ui_ConfigurationName').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$("#ui_drpdwn_MailFromAddress").on('change', function () {
    var value = $("#ui_drpdwn_MailFromAddress").val();
    if (value == "NULL")
        $("#ui_txt_MailReplyTo").val("");
    else
        $("#ui_txt_MailReplyTo").val(value);
});

$("#ui_a_TestMailTemplate").click(function () {
    if (!CreateMailTemplateTestCampaign.ValidateTestMailTemplate())
        return false;

    ShowPageLoading();
    let mailSendingSettingtest = new Object();
    mailSendingSettingtest.MailTemplateId = mailTemplateId;
    mailSendingSettingtest.CampaignId = mailCampaignId;
    mailSendingSettingtest.Name = CleanText($.trim($("#ui_txt_MailCampaignIdentifier").val()));
    mailSendingSettingtest.Subject = CleanText($.trim($("#ui_txt_MailSubject").val()));
    mailSendingSettingtest.FromName = CleanText($.trim($("#ui_txt_MailFromName").val()));
    mailSendingSettingtest.FromEmailId = $("#ui_drpdwn_MailFromAddress").val();
    mailSendingSettingtest.ReplyTo = $("#ui_txt_MailReplyTo").val();
    mailSendingSettingtest.Subscribe = $('input[type="checkbox"][name="MailUnsubscribe"]').is(":checked") ? true : false;
    mailSendingSettingtest.Forward = $('input[type="checkbox"][name="MailForward"]').is(":checked") ? true : false;
    mailSendingSettingtest.ScheduledDate = new Date();

    if ($("#ui_rad_SmsPromotional").is(":checked"))
        mailSendingSettingtest.IsPromotionalOrTransactionalType = false;
    else
        mailSendingSettingtest.IsPromotionalOrTransactionalType = true;

    mailSendingSettingtest.MailConfigurationNameId = parseInt($("#ui_ConfigurationName option:selected").val());

    if ($('input[type="radio"][name="testcampaignType"]:checked').val().toLowerCase() == "indivcampaign")
        CreateMailTemplateTestCampaign.SendIndividaulTestMail(mailSendingSettingtest, CleanText($.trim($("#ui_txt_MailIndividualId").val())));
    else {
        mailSendingSettingtest.GroupId = $('#ui_drpdwn_ContactGroups').val();
        CreateMailTemplateTestCampaign.SendGroupTestMail(mailSendingSettingtest);
    }
});