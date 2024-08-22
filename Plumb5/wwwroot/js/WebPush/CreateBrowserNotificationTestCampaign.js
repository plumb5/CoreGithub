var templateId = 0;
var WebPushTemplateCounselorTags = false;

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
    $("#ui_txt_WebPushMachineId").val("");
    $("#testcampgroupname").select2().val(0).trigger('change');
});

var CreateBrowserNotificationTestCampaign = {
    ClearTestTemplatePopUp: function () {
        $("#ui_txt_CampaignIdentifier, #ui_txt_WebPushMachineId").val("");
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

        CreateBrowserNotificationTestCampaign.CheckCounselorTags(Id);
        CreateBrowserNotificationTestCampaign.ClearTestTemplatePopUp();
        CreateBrowserNotificationTestCampaign.CreateUniqueIdentifier();

        if ($("#ui_a_TestWebPush_" + Id).attr("data-icon") != null && $("#ui_a_TestWebPush_" + Id).attr("data-icon") != "null" && $("#ui_a_TestWebPush_" + Id).attr("data-icon") != "undefined" && $("#ui_a_TestWebPush_" + Id).attr("data-icon").length != 0)
            $(".notificonwrp").css("background-image", "url(" + $("#ui_a_TestWebPush_" + Id).attr("data-icon") + ")");

        if ($("#ui_a_TestWebPush_" + Id).attr("data-banner") != null && $("#ui_a_TestWebPush_" + Id).attr("data-banner") != "null" && $("#ui_a_TestWebPush_" + Id).attr("data-banner") != "undefined" && $("#ui_a_TestWebPush_" + Id).attr("data-banner").length != 0) {
            $(".notifbanwrp").show();
            $(".notifbanwrp").css("background-image", "url(" + $("#ui_a_TestWebPush_" + Id).attr("data-banner") + ")");
        }
        else
            $(".notifbanwrp").hide();

        $("#ui_test_notifsubbtn").hide();
        $("#ui_test_notifcanbtn").hide();
        $(".notiftitle").html($("#ui_a_TestWebPush_" + Id).attr("data-title"));
        $(".notifdescript").html($("#ui_a_TestWebPush_" + Id).attr("data-desc"));
        if ($("#ui_a_TestWebPush_" + Id).attr("data-btn1") != null && $("#ui_a_TestWebPush_" + Id).attr("data-btn1") != "null" && $("#ui_a_TestWebPush_" + Id).attr("data-btn1") != "undefined" && $("#ui_a_TestWebPush_" + Id).attr("data-btn1").length != 0) {
            $("#ui_test_notifsubbtn").show();
            $(".bnotbtn1").html($("#ui_a_TestWebPush_" + Id).attr("data-btn1"));
        }
        if ($("#ui_a_TestWebPush_" + Id).attr("data-btn2") != null && $("#ui_a_TestWebPush_" + Id).attr("data-btn2") != "null" && $("#ui_a_TestWebPush_" + Id).attr("data-btn2") != "undefined" && $("#ui_a_TestWebPush_" + Id).attr("data-btn2").length != 0) {
            $("#ui_test_notifcanbtn").show();
            $(".bnotbtn2").html($("#ui_a_TestWebPush_" + Id).attr("data-btn2"));
        }

        $(".popupsubtitle").html(Name);
        $("#ui_div_CreateTestWebPushCampaign .popuptitle .popuptitlwrp h6").html("TEST CAMPAIGN");
        $("#ui_div_CreateTestWebPushCampaign").removeClass("hideDiv");
        templateId = Id;
    },
    CreateUniqueIdentifier: function () {
        var today = new Date();
        var strYear = today.getFullYear().toString() + today.getMonth().toString() + 1 + today.getDate().toString() + today.getMilliseconds().toString();
        $("#ui_txt_CampaignIdentifier").val("Web Push Campaign Identifier -" + strYear);
    },
    ValidateTestWebPushTemplateCampaignCreation: function () {
        if (WebPushTemplateCounselorTags) {
            ShowErrorMessage(GlobalErrorList.WebPushSchedule.CounselorTags);
            return false;
        }

        if (CleanText($.trim($("#ui_txt_CampaignIdentifier").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateWebPushTestCampaign.CampaignIdentifierError);
            return false;
        }
        if ($('input[type="radio"][name="testcampaignType"]:checked').val().toLowerCase() == "indivcampaign" && CleanText($.trim($("#ui_txt_WebPushMachineId").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateWebPushTestCampaign.TestMachineIdError);
            return false;
        }
        if ($('input[type="radio"][name="testcampaignType"]:checked').val().toLowerCase() == "groupcampaign" && $("#testcampgroupname").val() == 0) {
            ShowErrorMessage(GlobalErrorList.CreateWebPushTestCampaign.TestGroupError);
            return false;
        }
        return true;
    },
    TestIndividualCampaign: function () {
        $.ajax({
            url: "/WebPush/ScheduleCampaign/SendIndividualTest",
            type: 'POST',
            data: JSON.stringify({ 'WebpushTemplateId': templateId, 'MachineId': CleanText($.trim($("#ui_txt_WebPushMachineId").val())) }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    if (response.SentStatus == true)
                        ShowSuccessMessage(GlobalErrorList.CreateWebPushTestCampaign.TestMessageSuccess);
                    else
                        ShowErrorMessage(GlobalErrorList.CreateWebPushTestCampaign.TestMessageError);
                }
                $("#close-popup").click();
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    TestGroupCampaign: function () {
        var SendingSetting = { Id: 0, WebPushTemplateId: templateId, GroupId: parseInt($("#testcampgroupname").val()) };
        $.ajax({
            url: "/WebPush/ScheduleCampaign/SendGroupTest",
            type: 'POST',
            data: JSON.stringify({ 'webpushSendingSetting': SendingSetting }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    if (response.SentStatus == true)
                        ShowSuccessMessage(GlobalErrorList.CreateWebPushTestCampaign.TestMessageSuccess);
                    else
                        ShowErrorMessage(GlobalErrorList.CreateWebPushTestCampaign.TestMessageError);
                }
                $("#close-popup").click();
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    CheckCounselorTags: function (TemplateId) {
        WebPushTemplateCounselorTags = false;
        var WebpushTemplate = { Id: TemplateId };
        $.ajax({
            url: "/WebPush/Template/CheckCounselorTags",
            type: 'POST',
            data: JSON.stringify({ 'webpushTemplate': WebpushTemplate }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (response) {
                    WebPushTemplateCounselorTags = true;
                    ShowErrorMessage(GlobalErrorList.WebPushSchedule.CounselorTags);
                }              
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
};


$("#ui_a_CreateTestCampaign").click(function () {
    if (!CreateBrowserNotificationTestCampaign.ValidateTestWebPushTemplateCampaignCreation())
        return false;

    ShowPageLoading();
    if ($('input[type="radio"][name="testcampaignType"]:checked').val().toLowerCase() == "indivcampaign")
        CreateBrowserNotificationTestCampaign.TestIndividualCampaign();
    else
        CreateBrowserNotificationTestCampaign.TestGroupCampaign();
});