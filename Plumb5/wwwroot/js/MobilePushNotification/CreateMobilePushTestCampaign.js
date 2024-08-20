var templateId = 0;
var MobilePushTemplateCounselorTags = false;

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
    $("#ui_txt_MobilePushDeviceId").val("");
    $("#testcampgroupname").select2().val(0).trigger('change');
});

var CreatePushNotificationTestCampaign = {
    ClearTestTemplatePopUp: function () {
        $("#ui_txt_CampaignIdentifier, #ui_txt_MobilePushDeviceId").val("");
        $("#testcampgroupname").select2().val(0).trigger('change');
        $("#testcampaigngroup").prop('checked', false);
        $("#testcampaignindiv").prop('checked', true);
        $("#groupdropdownbox").addClass("hideDiv");
        $("#indivtxtbox").removeClass("hideDiv");
        if (!$(".previewtempsidewrp").hasClass("hideDiv"))
            $(".previewtempsidewrp").addClass("hideDiv");
        templateId = 0;
    },
    OpenTestCampaignPopUp: function (Id, Name) {
        CreatePushNotificationTestCampaign.CheckCounselorTags(Id);
        CreatePushNotificationTestCampaign.ClearTestTemplatePopUp();
        CreatePushNotificationTestCampaign.CreateUniqueIdentifier();

        if ($("#ui_a_MobilePush_" + Id).attr("data-icon") != null && $("#ui_a_MobilePush_" + Id).attr("data-icon") != "null" && $("#ui_a_MobilePush_" + Id).attr("data-icon") != "undefined" && $("#ui_a_MobilePush_" + Id).attr("data-icon").length != 0)
            $(".pushnotiflogowrp").css("background-image", "url(" + $("#ui_a_MobilePush_" + Id).attr("data-icon") + ")");

        if ($("#ui_a_MobilePush_" + Id).attr("data-banner") != null && $("#ui_a_MobilePush_" + Id).attr("data-banner") != "null" && $("#ui_a_MobilePush_" + Id).attr("data-banner") != "undefined" && $("#ui_a_MobilePush_" + Id).attr("data-banner").length != 0) {
            $(".pushnotifbanwrp").removeClass("hideDiv");
            $(".pushnotifbanwrp").css("background-image", "url(" + $("#ui_a_MobilePush_" + Id).attr("data-banner") + ")");
        }
        else
            $(".pushnotifbanwrp").addClass("hideDiv");

        $(".notiftitle").html($("#ui_a_MobilePush_" + Id).attr("data-title"));
        $(".notifdescript").html($("#ui_a_MobilePush_" + Id).attr("data-desc"));
        $(".notifsubtitle").html($("#ui_a_MobilePush_" + Id).attr("data-subdesc") != "null" && $("#ui_a_MobilePush_" + Id).attr("data-subdesc") != "undefined" ? $("#ui_a_MobilePush_" + Id).attr("data-subdesc") : "");

        $(".popupsubtitle").html(Name);
        $("#ui_div_CreateTestMobilePushCampaign .popuptitle .popuptitlwrp h6").html("TEST CAMPAIGN");
        $("#ui_div_CreateTestMobilePushCampaign").removeClass("hideDiv");
        templateId = Id;
    },
    CreateUniqueIdentifier: function () {
        var today = new Date();
        var strYear = today.getFullYear().toString() + today.getMonth().toString() + 1 + today.getDate().toString() + today.getMilliseconds().toString();
        $("#ui_txt_CampaignIdentifier").val("Mobile Push Campaign Identifier -" + strYear);
    },
    ValidateTestMobilePushTemplateCampaignCreation: function () {
        if (MobilePushTemplateCounselorTags) {
            ShowErrorMessage(GlobalErrorList.MobilePushSchedule.CounselorTags);
            return false;
        }

        if (CleanText($.trim($("#ui_txt_CampaignIdentifier").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateMobilePushTestCampaign.CampaignIdentifierError);
            return false;
        }
        if ($('input[type="radio"][name="testcampaignType"]:checked').val().toLowerCase() == "indivcampaign" && CleanText($.trim($("#ui_txt_MobilePushDeviceId").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateMobilePushTestCampaign.TestDeviceIdError);
            return false;
        }
        if ($('input[type="radio"][name="testcampaignType"]:checked').val().toLowerCase() == "groupcampaign" && $("#testcampgroupname").val() == 0) {
            ShowErrorMessage(GlobalErrorList.CreateMobilePushTestCampaign.TestGroupError);
            return false;
        }
        return true;
    },
    TestIndividualCampaign: function () {
        $.ajax({
            url: "/MobilePushNotification/CampaignSchedule/SendIndividualTest",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'MobilePushTemplateId': templateId, 'DeviceId': $("#ui_txt_MobilePushDeviceId").val() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    if (response.SentStatus == true)
                        ShowSuccessMessage(response.Message);
                    else
                        ShowErrorMessage(response.Message);
                }
                $("#close-popup").click();
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    TestGroupCampaign: function () {
        var SendingSetting = { Id: 0, MobilePushTemplateId: templateId, GroupId: parseInt($("#testcampgroupname").val()) };

        $.ajax({
            url: "/MobilePushNotification/CampaignSchedule/SendGroupTest",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mobilepushSendingSetting': SendingSetting }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    if (response.SentStatus == true)
                        ShowSuccessMessage(response.Message);
                    else
                        ShowErrorMessage(response.Message);
                }
                $("#close-popup").click();
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    CheckCounselorTags: function (TemplateId) {
        MobilePushTemplateCounselorTags = false;
        var MobilepushTemplate = { Id: TemplateId };
        $.ajax({
            url: "/MobilePushNotification/MobilePushTemplate/CheckCounselorTags",
            type: 'POST',
            data: JSON.stringify({ 'mobilepushTemplate': MobilepushTemplate }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (response) {
                    MobilePushTemplateCounselorTags = true;
                    ShowErrorMessage(GlobalErrorList.MobilePushSchedule.CounselorTags);
                }                
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
};


$("#ui_a_CreateTestCampaign").click(function () {
    if (!CreatePushNotificationTestCampaign.ValidateTestMobilePushTemplateCampaignCreation())
        return false;

    ShowPageLoading();
    if ($('input[type="radio"][name="testcampaignType"]:checked').val().toLowerCase() == "indivcampaign")
        CreatePushNotificationTestCampaign.TestIndividualCampaign();
    else
        CreatePushNotificationTestCampaign.TestGroupCampaign();
});