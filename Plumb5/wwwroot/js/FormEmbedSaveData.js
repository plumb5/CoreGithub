
var regExpEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
var bannerDetails = { Id: 0, FormId: 0, Name: "", BannerContent: "", RedirectUrl: "", BannerPriority: 0, Impression: 0, BannerStatus: true };

$(document).ready(function () {
    Initialize();
});

Initialize = function () {

    IntializeFromsListAndMailGroupList();
    IntializeTemplate();
    if (formId <= 0)
        IfNewIntializeDefault();
    else if (formId > 0) {
        BindSavedData(formId);
    }
    IfNewIntializeOtherBasicValues();
};

$("#ui_lnkSaveDetails").click(function () {

    $("#dvLoading").show();

    if (!ValidateVideoAllDatas())
        return;

    SaveOneByOneAllDetails();

});

SaveOneByOneAllDetails = function () {

    formId = formDetails.Id = $.urlParam("FormId");
    GetBasicData();
    GetBanners();
    GetDesignValues();
    RulesData();
    GetResponseSettingData();

    $.ajax({
        url: "/ManageEmbedForm/SaveFormDetails",
        data: JSON.stringify({ 'formDetails': formDetails, 'rulesData': ruleConditions, 'bannerDetails': bannerDetails, 'responseSettings': responseSettings, 'mailSettings': mailSettings }),
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataFilter: function (data) { return data; },
        success: function (response) {

            if (response.Status) {
                ShowErrorMessage("Saved");
                formId = response.FormId;
                var isInpage = $("#ui_radInPage").is(":checked");
                ShowScript(formId, isInpage);

                if ($.urlParam("FormId") == 0) {
                    window.history.pushState('', '', UpdateQueryString("FormId", formId));
                }
                $("#dvLoading").hide();
            }
            else if (!response.Status) {
                ShowErrorMessage(response.ErrorMessage);
                $("#dvLoading").hide();
            }
        },
        error: ShowAjaxError
    });

};

GetBanners = function (formId) {

    bannerDetails.FormId = formId;
    bannerDetails.Name = CleanText($("#ui_txtFormTitle").val());
    var content = $("#ui_txtContent").val().replace(/'/g, "‘");
    content = $.trim(content);
    bannerDetails.BannerContent = content;
};

GetBasicData = function () {
    formDetails.Heading = $("#ui_txtFormTitle").val().replace(/'/g, "‘");
    formDetails.SubHeading = "";
    formDetails.FormType = formType;

    return formDetails;
};

GetDesignValues = function (formId) {


    if ($("#ui_radBgOnpixel").is(":checked"))
        formDetails.BackgroundPxOPer = 0;
    else
        formDetails.BackgroundPxOPer = 1;

    var bg = GetOnlyBackgroundDesign();
    formDetails.IsMainBackgroundDesignCustom = bg.IsCustomBgDesign;
    formDetails.MainBackgroundDesign = bg.bgContent;

    formDetails.BackgroundFadeColor = bg.backgroundFadeColor;

    var closeCss = CloseButtondDesign();
    formDetails.CloseCss = closeCss.cssContent;
    formDetails.IsCloseCustomCss = closeCss.IsCustomDesign;

    if ($("#ui_radOnPage").is(":checked")) {
        formDetails.OnPageOrInPage = true;
        formDetails.AppearenceEffect = $("#ui_ddlEffect").val();
        formDetails.PositionAlign = $("#ui_ddlPosition").val();
        formDetails.TopOrBottomPadding = $("#ui_txtBottomPadding").val();
        formDetails.RightOrLeftPadding = $("#ui_txtPadding").val();

        if ($("#ui_ddlAudio").get(0).selectedIndex > 0)
            formDetails.AppearSound = $("#ui_ddlAudio").val();
        else
            formDetails.AppearSound = "";

        formDetails.TimeDelay = $("#ui_txtTimeDelay").val().length == 0 ? 0 : $("#ui_txtTimeDelay").val();
        formDetails.HideEffect = $("#ui_ddlHideEffect").val();
    }
    else {
        formDetails.OnPageOrInPage = false;
    }

    formDetails.AppearOnLoadOnExitOnScroll = $("input:radio[name='PageLoadOrOnExitOrOnScroll']:checked").val();
    if (formDetails.AppearOnLoadOnExitOnScroll == 2) {
        formDetails.ShowOnScrollDownHeight = $("#ui_txtShowOnScrollDownHeight").val();
    }

    formDetails.GeneralCss = $("#ui_txtGeneralCssClass").val();

    return formDetails;
};

ValidateVideoAllDatas = function () {

    if (!ValidateBasicContents()) {
        $("#dvLoading").hide();
        return false;
    }
    if (!ValidateSettings()) {
        $("#dvLoading").hide();
        return false;
    }
    if (!ValidationOfRules()) {
        $("#dvLoading").hide();
        return false;
    }
    if (!ValidationOfResponseSetting()) {
        $("#dvLoading").hide();
        return false;
    }

    return true;
}

ValidateBasicContents = function () {

    if (CleanText($("#ui_txtFormTitle").val()).length == 0) {
        ShowErrorMessage("Please enter form name.");
        $("#ui_txtFormTitle").focus();
        return false
    }
    if (CleanText($("#ui_txtContent").val()).length == 0) {
        ShowErrorMessage("Please enter video embed.");
        $("#ui_txtContent").focus();
        return false
    }
    if (CleanText($("#ui_txtHeight").val()).length == 0) {
        ShowErrorMessage("Please enter from height.");
        $("#ui_txtHeight").focus();
        return false
    }
    if (CleanText($("#ui_txtWidth").val()).length == 0) {
        ShowErrorMessage("Please enter from width.");
        $("#ui_txtWidth").focus();
        return false
    }
    return true;
};

ValidateSettings = function () {

    if ($("#ui_chkThankUMessage").is(":checked") && CleanText($("#ui_txtThankYouMessage").val()).length == 0) {
        ShowErrorMessage("Please enter - Thank You Message.");
        $("#ui_txtThankYouMessage").focus();
        return false
    }
    return true;
};

function BindSavedData(formId) {

    formDetails.FormId = formId;

    $.ajax({
        url: "/ManageEmbedForm/GetFormDetails",
        data: JSON.stringify({ 'FormId': formId }),
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataFilter: function (data) { return data; },
        success: function (response) {
            if (!response.Status) {
                ShowErrorMessage("Problem in binding data");
            }
            else if (response.Status) {

                formDetails = response.savedFormdetails;
                ruleConditions = response.savedFormRules;
                bannerDetails = response.savedFormBanner[0];
                responseSettings = response.savedresponseSettings;
                if (response.savedMailSetting != null && response.savedMailSetting.length > 0)
                    mailSettings = response.savedMailSetting[0];

                OnBindData();
                BindSaveResponseDetails();
                BindSingleBannerDetails();
            }
            else if (resultValue == -10) {
                ShowErrorMessage("Session is expired, please <a href='Register.aspx' style='color:#38898E;font-size: 15px;font-family: Allerta,sans-serif;'>Click here to login</a>");
            }
            else {
                ShowErrorMessage("Problem in binding data");
            }
        },
        error: ShowAjaxError
    });
}

OnBindData = function () {
    $("#ui_txtFormTitle").val(formDetails.Heading);
    if (formDetails.SubHeading != null && formDetails.SubHeading.length > 0) {
        $("#ui_txtFormDescription").val(formDetails.SubHeading);
        $("#ui_chkDescriptionMessage").prop("checked", true);
    }
    else {
        $("#ui_chkDescriptionMessage").prop("checked", false);
    }

    if (formDetails.IsMainBackgroundDesignCustom == false) {
        BindBackgroundDesginData();
        if (formDetails.BackgroundPxOPer == false)
            $("#ui_radBgOnpixel").prop("checked", true);
        else
            $("#ui_radBgOnpercent").prop("checked", true);
    }
    else if (formDetails.IsMainBackgroundDesignCustom == true) {

        $("#dvBgStandardCss").hide();
        $("#dvBgCustomCss").show();
        $("#ui_radBgCustom").attr("checked", true);
        $("#ui_bgCustomStyle").val(formDetails.MainBackgroundDesign.replace(/\s{2,}/g, ' '));


        var BackgroundDesignFadeColor = "";
        if (formDetails.BackgroundFadeColor != null && formDetails.BackgroundFadeColor.length > 0) {
            $("#ui_chkBackGroundFadeColorOpacity").prop("checked", true);

            BackgroundDesignFadeColor = formDetails.BackgroundFadeColor.split(";");

            if (BackgroundDesignFadeColor[0].indexOf("background-color") > -1) {
                var backgroundfadecolor = BackgroundDesignFadeColor[0].split(":")[1];
                $("#ui_txtBackGroundFadeColorOpacity").val(backgroundfadecolor);
            }
            if (BackgroundDesignFadeColor[1].indexOf("opacity") > -1) {
                var Opacity = BackgroundDesignFadeColor[1].split(":")[1];
                $("#ui_txBackGroundFadeOpacityValue").slider('option', { value: Opacity * 10 });
            }
        }
    }

    if (formDetails.IsCloseCustomCss == false) {
        BindCloseCss();
    }
    else if (formDetails.IsCloseCustomCss == true) {
        $("#dvCloseStandardDesign").hide();
        $("#dvCloseCustomDesign").show();
        $("#ui_radCloseCustome").attr("checked", true);
        $("#ui_txtCloseCustomeDesign").val(formDetails.CloseCss);
    }

    if (formDetails.OnPageOrInPage == true) {
        $("#ui_radOnPage").prop("checked", true);
        $(".settingEffect").removeClass("BlurAndOpacity");
        $("#ui_trRedirectUrl").hide();
    }
    else if (formDetails.OnPageOrInPage == false) {
        $("#ui_radInPage").prop("checked", true);
        $(".settingEffect").addClass("BlurAndOpacity");
        $("#ui_trRedirectUrl").show();
    }

    $("#ui_ddlEffect").val(formDetails.AppearenceEffect);
    $("#ui_ddlPosition").val(formDetails.PositionAlign);
    $("#ui_txtBottomPadding").val(formDetails.TopOrBottomPadding);
    $("#ui_txtPadding").val(formDetails.RightOrLeftPadding);
    $("#ui_txtTimeDelay").val(formDetails.TimeDelay);
    $("#ui_ddlAudio").val(formDetails.AppearSound);

    $("#ui_ddlHideEffect").val(formDetails.HideEffect);

    if (formDetails.ThankYouMessage != null && formDetails.ThankYouMessage.length > 0) {
        $("#ui_chkThankUMessage").attr("checked", true);
        $("#ui_txtThankYouMessage").val(formDetails.ThankYouMessage);
    }

    if (formDetails.AppearOnLoadOnExitOnScroll == 0) {
        $("#ui_radAppearOnPageLoad").prop("checked", true);
        $("#ui_txtShowOnScrollDownHeight").addClass("tdHide");
    }
    else if (formDetails.AppearOnLoadOnExitOnScroll == 1) {
        $("#ui_radAppearOnPageExit").prop("checked", true);
        $("#ui_txtShowOnScrollDownHeight").addClass("tdHide");
    }
    else {
        $("#ui_radAppearOnScroll").prop("checked", true);
        $("#ui_txtShowOnScrollDownHeight").val(formDetails.ShowOnScrollDownHeight).removeClass("tdHide");
    }
 
    if (formDetails.GeneralCss != null)
        $("#ui_txtGeneralCssClass").val(formDetails.GeneralCss);

    BindAudienceData();
    BindBehaviorData();
    BindInteractionData();
    BindInteractionEventData();
    BindProfileData();
};

BindSingleBannerDetails = function () {
    $("#ui_txtContent").val(bannerDetails.BannerContent);
};

GetFormType = function (formType) {
    var formTypeData = "";
    if (formType == 1)
        formTypeData = "Video";
    else if (formType == 2)
        formTypeData = "Facebook Audience";
    else if (formType == 3)
        formTypeData = "Presentation";
    else if (formType == 4)
        formTypeData = "Flash";
    else if (formType == 5)
        formTypeData = "Custom HTML";
    else if (formType == 6)
        formTypeData = "Tweets";
    else if (formType == 7)
        formTypeData = "Custom Banner";
    else if (formType == 8)
        formTypeData = "";
    else if (formType == 9)
        formTypeData = "Polls";
    else if (formType == 10)
        formTypeData = "Test an Offer";
    else if (formType == 12)
        formTypeData = "Lead Generation";
    else if (formType == 16)
        formTypeData = "Ratings";
    else if (formType == 17)
        formTypeData = "RSS Feeds";
    else if (formType == 18)
        formTypeData = "Question";

    return formTypeData;
};