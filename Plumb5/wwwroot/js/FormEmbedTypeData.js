
var formId = 0, campaignId = 1, formType = 0;

//----- New
var formDetails = {
    Id: 0, UserGroupId: 0, UserInfoUserId: 0, FormCampaignId: 0, FormType: 0, FormStatus: false, FormPriority: 0, Heading: "", SubHeading: "", PageContentForEmbed: "", IsMainBackgroundDesignCustom: false,
    MainBackgroundDesign: "", TitleCss: "", IsTitleCssCustom: false, DescriptionCss: "", IsDescriptionCustomCss: false, LabelCss: "", IsLabelCustomCss: false, TextboxDropCss: "",
    IsTextboxDropCustomCss: false, ButtonCss: "", IsButtonCustomCss: false, ErrorCss: "", IsErrorCustomCss: false, CloseCss: "", IsCloseCustomCss: false, ButtonName: "",
    OnPageOrInPage: false, AppearenceEffect: 0, PositionAlign: 0, AppearenceSpeed: 0, TopOrBottomPadding: 0, RightOrLeftPadding: 0, TimeDelay: 0, AppearSound: "", ThankYouMessage: "",
    HideEffect: 0, BackgroundPxOPer: false, PlaceHolderClass: "", BackgroundFadeColor: "", AppearOnLoadOnExitOnScroll: 0, ShowOnScrollDownHeight: 0, AppearEffectOfFields: 0,
    GeneralCss: ""
};

var ruleConditions = {

    FormId: 0, IsLead: -1, IsBelong: 0, BelongsToGroup: "", BehavioralScoreCondition: 0, BehavioralScore1: 0, BehavioralScore2: 0, SessionIs: 0, SessionConditionIsTrueOrIsFalse: false,
    PageDepthIs: 0, NPageVisited: 0, FrequencyIs: 0, PageUrl: "", IsPageUrlContainsCondition: false, IsReferrer: 0, ReferrerUrl: "", CheckSourceDomainOnly: false, IsMailIsRespondent: false,
    SearchString: "", Country: "", City: "", IsClickedSpecificButtons: "", ClickedPriceRangeProduct: "", IsVisitorRespondedChat: false, MailCampignResponsiveStage: 0, IsRespondedForm: 0,
    IsNotRespondedForm: 0, CloseCount: 0, AddedProductsToCart: "", ViewedButNotAddedProductsToCart: "", DroppedProductsFromCart: "", PurchasedProducts: "", NotPurchasedProducts: "",
    CustomerTotalPurchase: 0, CustomerCurrentValue: 0, DependencyFormId: 0, DependencyFormField: 0, DependencyFormCondition: 0, DependencyFormAnswer1: "", DependencyFormAnswer2: "",
    ImpressionEventForFormId: 0, ImpressionEventCountCondition: 0, CloseEventForFormId: 0, CloseEventCountCondition: 0, ResponsesEventForFormId: 0, ResponsesEventCountCondition: 0,
    OnlineSentimentIs: 0, SocialStatusIs: 0, InfluentialScoreCondition: 0, InfluentialScore1: 0, InfluentialScore2: 0, OfflineSentimentIs: 0, ProductRatingIs: 0, GenderIs: "",
    MaritalStatusIs: 0, ProfessionIs: "", NotConnectedSocially: 0, LoyaltyPointsCondition: 0, LoyaltyPointsRange1: 0, LoyaltyPointsRange2: 0, RFMSScoreRangeCondition: 0,
    RFMSScoreRange1: 0, RFMSScoreRange2: 0, ShowFormOnlyNthTime: 0, CloseCountSessionWiseOrOverAll: false, OverAllTimeSpentInSite: 0, AlreadyVisitedPages: "", PageDepthConditionIsTrueOrIsFalse: false,
    PageViewConditionIsTrueOrIsFalse: false, FrequencyConditionIsTrueOrIsFalse: false, MailRespondentConditionIsTrueOrIsFalse: false, CountryConditionIsTrueOrIsFalse: false,
    CityConditionIsTrueOrIsFalse: false, NurtureStatusIs: 0, IsMobileDevice: 0, AlreadyVisitedPagesConditionIsTrueOrIsFalse: true
};

var FormResponseSetting =
{
    ReportToFormsMailFieldId: 0, ReportToDetailsByMail: "", ReportToFormsSMSFieldId: 0, ReportToDetailsBySMS: "", MailOutDependencyFieldId: 0, MailIdList: "",
    RedirectUrl: "", AccesLeadToUserId: "", ReportToDetailsByPhoneCall: "", GroupGroupId: ""
};

//----- Old

$(document).ready(function () {
    formId = $.urlParam("FormId");
    formType = $.urlParam("FormType");
    InitializeDefault();
});

InitializeDefault = function () {

    formDetails.CampaignId = campaignId;
    formDetails.FormType = formType;

    GetFlashImageUploaded("btnUploadDiv", BackGroundUploadedData);
    GetFlashImageUploaded("ui_lblBgCustom", BgCustomImage);
    GetFlashImageUploaded("ui_lblCloseBtnUpload", CloseBtnImage);

    if (document.getElementById("ui_txtButtonImgUpload"))
        GetFlashImageUploaded("ui_txtButtonImgUpload", ButtonStandardImage);

    if (document.getElementById("ui_txtButtonOpacityValue"))
        Slider("ui_txtButtonOpacityValue");
    if (document.getElementById("ui_txBackGroundFadeOpacityValue"))
        Slider("ui_txBackGroundFadeOpacityValue");

    IntializeAutoComplete("ui_txtClickButton", "/CommonDetailsForForms/GetEvetList", 2, "ui_txtClickButton_values", "clkBtn");
    IntializeAutoComplete("ui_txtPriceRangeProducts", "/CommonDetailsForForms/GetEvetList", 2, "ui_txtPriceRangeProducts_values", "ClickProduct");
    IntializeAutoComplete("ui_txtCustomerNotPurchasedProducts", "/CommonDetailsForForms/GetProductList", 2, "ui_txtCustomerNotPurchasedProducts_values", "NotPurchase");
    IntializeAutoComplete("ui_txtCustomerPurchasedProducts", "/CommonDetailsForForms/GetProductList", 2, "ui_txtCustomerPurchasedProducts_values", "Purchase");
    IntializeAutoComplete("ui_txtDropedFromCartProducts", "/CommonDetailsForForms/GetProductList", 2, "ui_txtDropedFromCartProducts_values", "DropFromCart");
    IntializeAutoComplete("ui_txtViewedNotAddedToCartProducts", "/CommonDetailsForForms/GetProductList", 2, "ui_txtViewedNotAddedToCartProducts_values", "NotAddedToCart");
    IntializeAutoComplete("ui_txtAddedToCartProducts", "/CommonDetailsForForms/GetProductList", 2, "ui_txtAddedToCartProducts_values", "AddedToCart");

    IntializeAutoComplete("ui_txtCity", "/CommonDetailsForForms/GetCityName", 2, "ui_txtCity_values", "cityName");

    IntializeCountyList();
};



var move = function () {
    var st = $(window).scrollTop();
    var s = $("#dvSliderSaveButton");
    var ot = s.children()[0].offsetTop;
    if (st < 150) {
        s.css({ position: "", display: "inline", top: "", paddingTop: "0px" });
    }
    else {
        s.css({ position: "fixed", top: "0px", paddingTop: "0px" });
    }
};
$(window).scroll(move);


$("#ui_chkAnswerDependencyForm").click(function () {

    if (!$(this).is(":checked"))
        $("#trAnswerDependency").hide();

});



IntializeFromsListAndMailGroupList = function () {

    $.ajax({
        url: "/CommonDetailsForForms/GetFormsList",
        dataType: "json",
        async: false,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataFilter: function (data) { return data; },
        success: BindAllFormsToDropDown,
        error: ShowAjaxError
    });
};

BindAllFormsToDropDown = function (formsList) {

    if (formsList.length > 0) {
        $.each(formsList, function () {
            if ($(this)[0].FormType != 19) {
                if ($(this)[0].FormType == 12 || $(this)[0].FormType == 18 || $(this)[0].FormType == 9 || $(this)[0].FormType == 16)
                    AddOptionToDropDown(["ui_ddlRespondedFroms", "ui_ddlNotRespondedFroms", "ui_ddlAnswerDependencyFroms", "ui_ddlFormCloseEvent", "ui_ddlFormImpression", "ui_ddlResponseCountEvent"], $(this)[0].Id, $(this)[0].Heading, "");

                else if ($(this)[0].FormType != 4 && $(this)[0].FormType != 1 && $(this)[0].FormType != 5 && $(this)[0].FormType != 17 && $(this)[0].FormType != 6 && $(this)[0].FormType != 2 && $(this)[0].FormType != 3)
                    AddOptionToDropDown(["ui_ddlFormCloseEvent", "ui_ddlFormImpression", "ui_ddlResponseCountEvent"], $(this)[0].Id, $(this)[0].Heading, "");
                else
                    AddOptionToDropDown(["ui_ddlFormCloseEvent", "ui_ddlFormImpression"], $(this)[0].Id, $(this)[0].Heading, "");
            }
        });
    }
    else {
        AddOptionToDropDown(["ui_ddlRespondedFroms", "ui_ddlNotRespondedFroms", "ui_ddlAnswerDependencyFroms", "ui_ddlFormCloseEvent", "ui_ddlFormImpression", "ui_ddlResponseCountEvent"], "0", "No froms have been added yet", "red");
    }
    InitializeGroupList();
};

InitializeGroupList = function () {

    $.ajax({
        url: "../Form/CommonDetailsForForms/GetGroups",
        dataType: "json",
        type: "POST",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataFilter: function (data) { return data; },
        success: BindAllGroupList,
        error: ShowAjaxError
    });
};

BindAllGroupList = function (ListOfGroup) {

    var groupList = new Array();
    if (ListOfGroup.length > 0) {
        $.each(ListOfGroup, function () {
            groupList.push({ value: $(this)[0].Id.toString(), label: $(this)[0].Name });

            $('#ui_ddlGroupList').append($("<option></option>").attr("value", $(this)[0].Id).text($(this)[0].Name));

        });
    }
    $("#ui_txtGroups").autocomplete({
        autoFocus: true,
        minLength: 0, max: 10,
        source: groupList,
        select: function (events, selectedItem) {
            AppendSelected("ui_txtGroups_values", selectedItem, "group");
        },
        close: function (event, ui) {
            $(this).val("");
        }
    });

    InitializeUsersList();

};

IntializeTemplate = function () {

    $.ajax({
        url: "../Form/CommonDetailsForForms/GetTemplate",
        dataType: "json",
        type: "POST",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataFilter: function (data) { return data; },
        success: BindAllTemplates,
        error: ShowAjaxError
    });
};

BindAllTemplates = function (listOfTemplate) {

    if (listOfTemplate.length > 0) {
        $.each(listOfTemplate, function () {
            AddOptionToDropDown(["ui_ddlMailUnConditionTemplate"], $(this)[0].Id.toString(), $(this)[0].Name, "");

            var templateDetailsObject = new Object();
            templateDetailsObject.TemplateId = $(this)[0].Id;
            templateDetailsObject.TempName = $(this)[0].Name;
            templateList.push(templateDetailsObject);
        });
    }
    else {
        $("#ui_ddlMailUnConditionTemplate option[value='0']").remove();
        AddOptionToDropDown(["ui_ddlMailUnConditionTemplate"], "0", "No Template have been added yet", "red");
    }
};

InitializeUsersList = function () {
    $.ajax({
        url: "/CommonDetailsForForms/UserNameList",
        dataType: "json",
        type: "POST",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataFilter: function (data) { return data; },
        success: UserListBind,
        error: ShowAjaxError
    });
};

UserListBind = function (userList) {
    $.each(userList, function () {
        $("#ui_ddlUserList").append("<option value='" + $(this)[0].UserId + "'>" + $(this)[0].FirstName + "</option>")
    });
    InitializeLmsStage();
};

InitializeLmsStage = function () {
    $.ajax({
        url: "/CommonDetailsForForms/LmsStage",
        dataType: "json",
        type: "POST",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataFilter: function (data) { return data; },
        success: BindLmsStage,
        error: ShowAjaxError
    });
};

BindLmsStage = function (lmsStageList) {

    if (lmsStageList.length > 0) {
        $.each(lmsStageList, function () {
            $("#ui_ddlProspectStatus").append("<option style='color:" + $(this)[0].IdentificationColor + ";' value='" + $(this)[0].Id.toString() + "'>" + $(this)[0].Stage + "</option>");
        });
    }
    else {
        AddOptionToDropDown(["ui_ddlProspectStatus"], "0", "No Lms Stage", "red");
    }
    $("#dvLoading").hide();
};


function AddOptionToDropDown(dropDownTag, value, text, uiStyle) {

    for (var index = 0; index < dropDownTag.length; index++) {
        $("#" + dropDownTag[index]).append("<option value='" + value + "'>" + text + "</option>");
        if (uiStyle.length > 0)
            $("#" + dropDownTag[index]).css("color", uiStyle);
    }
}