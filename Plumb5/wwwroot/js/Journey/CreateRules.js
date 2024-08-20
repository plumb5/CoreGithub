var countryList = new Array("AFGHANISTAN", "ALAND ISLANDS", "ALBANIA", "ALGERIA", "AMERICAN SAMOA", "ANDORRA", "ANGOLA", "ANGUILLA", "ANTARCTICA", "ANTIGUA AND BARBUDA", "ARGENTINA", "ARMENIA", "ARUBA", "AUSTRALIA", "AUSTRIA", "AZERBAIJAN", "BAHAMAS", "BAHRAIN", "BANGLADESH", "BARBADOS", "BELARUS", "BELGIUM", "BELIZE", "BENIN", "BERMUDA", "BHUTAN", "BOLIVIA", "BOSNIA AND HERZEGOVINA", "BOTSWANA", "BRAZIL", "BRITISH INDIAN OCEAN TERRITORY", "BRUNEI DARUSSALAM", "BULGARIA", "BURKINA FASO", "BURUNDI", "CAMBODIA", "CAMEROON", "CANADA", "CAPE VERDE", "CAYMAN ISLANDS", "CENTRAL AFRICAN REPUBLIC", "CHAD", "CHILE", "CHINA", "CHRISTMAS ISLAND", "COLOMBIA", "COMOROS", "CONGO", "CONGO, THE DEMOCRATIC REPUBLIC OF THE", "COOK ISLANDS", "COSTA RICA", "COTE D'IVOIRE", "CROATIA", "CUBA", "CURAA‡AO", "CURAÃ‡AO", "CYPRUS", "CZECH REPUBLIC", "DEMOCRATIC PEOPLE'S REPUBLIC OF KOREA", "DENMARK", "DJIBOUTI", "DOMINICA", "DOMINICAN REPUBLIC", "ECUADOR", "EGYPT", "EL SALVADOR", "EQUATORIAL GUINEA", "ERITREA", "ESTONIA", "ETHIOPIA", "FALKLAND ISLANDS (MALVINAS)", "FAROE ISLANDS", "FIJI", "FINLAND", "FRANCE", "FRENCH GUIANA", "FRENCH POLYNESIA", "FRENCH SOUTHERN TERRITORIES", "GABON", "GAMBIA", "GEORGIA", "GERMANY", "GHANA", "GIBRALTAR", "GREECE", "GREENLAND", "GRENADA", "GUADELOUPE", "GUAM", "GUATEMALA", "GUERNSEY", "GUINEA", "GUINEA-BISSAU", "GUYANA", "HAITI", "HEARD ISLAND AND MCDONALD ISLANDS", "HOLY SEE (VATICAN CITY STATE)", "HONDURAS", "HONG KONG", "HUNGARY", "ICELAND", "INDIA", "INDONESIA", "IRAN, ISLAMIC REPUBLIC OF", "IRAQ", "IRELAND", "ISLE OF MAN", "ISRAEL", "ITALY", "JAMAICA", "JAPAN", "JORDAN", "KAZAKHSTAN", "KENYA", "KIRIBATI", "KOREA, REPUBLIC OF", "KUWAIT", "KYRGYZSTAN", "LAO PEOPLE'S DEMOCRATIC REPUBLIC", "LATVIA", "LEBANON", "LESOTHO", "LIBERIA", "LIBYAN ARAB JAMAHIRIYA", "LIECHTENSTEIN", "LITHUANIA", "LUXEMBOURG", "MACAO", "MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF", "MADAGASCAR", "MALAWI", "MALAYSIA", "MALDIVES", "MALI", "MALTA", "MARSHALL ISLANDS", "MARTINIQUE", "MAURITANIA", "MAURITIUS", "MAYOTTE", "MEXICO", "MICRONESIA, FEDERATED STATES OF", "MOLDOVA, REPUBLIC OF", "MONACO", "MONGOLIA", "MONTENEGRO", "MONTSERRAT", "MOROCCO", "MOZAMBIQUE", "MYANMAR", "NAMIBIA", "NAURU", "NEPAL", "NETHERLANDS", "NETHERLANDS ANTILLES", "NEW CALEDONIA", "NEW ZEALAND", "NICARAGUA", "NIGER", "NIGERIA", "NIUE", "NORFOLK ISLAND", "NORTHERN MARIANA ISLANDS", "NORWAY", "OMAN", "PAKISTAN", "PALAU", "PALESTINIAN TERRITORY, OCCUPIED", "PANAMA", "PAPUA NEW GUINEA", "PARAGUAY", "PERU", "PHILIPPINES", "POLAND", "PORTUGAL", "PUERTO RICO", "QATAR", "REUNION", "ROMANIA", "RUSSIAN FEDERATION", "RWANDA", "SAINT HELENA", "SAINT KITTS AND NEVIS", "SAINT LUCIA", "SAINT MARTIN", "SAINT PIERRE AND MIQUELON", "SAINT VINCENT AND THE GRENADINES", "SAMOA", "SAN MARINO", "SAO TOME AND PRINCIPE", "SAUDI ARABIA", "SENEGAL", "SERBIA", "SEYCHELLES", "SIERRA LEONE", "SINGAPORE", "SLOVAKIA", "SLOVENIA", "SOLOMON ISLANDS", "SOMALIA", "SOUTH AFRICA", "SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS", "SPAIN", "SRI LANKA", "SUDAN", "SURINAME", "SWAZILAND", "SWEDEN", "SWITZERLAND", "SYRIAN ARAB REPUBLIC", "TAIWAN, PROVINCE OF CHINA", "TAJIKISTAN", "TANZANIA, UNITED REPUBLIC OF", "THAILAND", "TOGO", "TOKELAU", "TONGA", "TRINIDAD AND TOBAGO", "TUNISIA", "TURKEY", "TURKMENISTAN", "TURKS AND CAICOS ISLANDS", "TUVALU", "UGANDA", "UKRAINE", "UNITED ARAB EMIRATES", "UNITED KINGDOM", "UNITED STATES", "UNITED STATES MINOR OUTLYING ISLANDS", "URUGUAY", "UZBEKISTAN", "VANUATU", "VENEZUELA", "VIET NAM", "VIRGIN ISLANDS, BRITISH", "VIRGIN ISLANDS, U.S.", "WALLIS AND FUTUNA", "YEMEN", "YUGOSLAVIA", "ZAMBIA", "ZIMBABWE");
var loadingDataValues = { FormsList: false, GroupsList: false, LmsStageList: false, MailTemplates: false, SmsTemplates: false };
var action = "";

var triggerMailSms = {
    RuleId:0,Id: 0, UserInfoUserId: 0, UserGroupId: 0, TriggerStatus: false, TriggerHeading: "", IsMailOrSMSTrigger: 1, IsLead: -1, IsBelong: 0, BelongsToGroup: "", BehavioralScoreCondition: 0, BehavioralScore1: 0, BehavioralScore2: 0, SessionIs: 0, SessionConditionIsTrueOrIsFalse: 0,
    PageDepthIs: 0, PageDepthConditionIsTrueOrIsFalse: false, NPageVisited: 0, PageViewConditionIsTrueOrIsFalse: false, FrequencyIs: 0, FrequencyConditionIsTrueOrIsFalse: false, PageUrl: "", IsPageUrlContainsCondition: false, IsReferrer: 0,
    ReferrerUrl: "", CheckSourceDomainOnly: 0, IsMailIsRespondent: false, MailRespondentConditionIsTrueOrIsFalse: false, SearchString: "", Country: "", CountryConditionIsTrueOrIsFalse: false, City: "", CityConditionIsTrueOrIsFalse: false, IsClickedSpecificButtons: 0,
    ClickedPriceRangeProduct: "", IsVisitorRespondedChat: false, MailCampignResponsiveStage: 0, IsRespondedForm: 0, IsNotRespondedForm: 0, CloseCount: 0, AddedProductsToCart: "", ViewedButNotAddedProductsToCart: "", DroppedProductsFromCart: "",
    PurchasedProducts: "", NotPurchasedProducts: "", CustomerTotalPurchase1: 0, CustomerCurrentValue1: 0, DependencyFormId: 0, DependencyFormField: 0, DependencyFormCondition: 0, DependencyFormAnswer1: "", DependencyFormAnswer2: "", ImpressionEventForFormId: 0,
    ImpressionEventCountCondition: 0, CloseEventForFormId: 0, CloseEventCountCondition: 0, ResponsesEventForFormId: 0, ResponsesEventCountCondition: 0, OnlineSentimentIs: 0, SocialStatusIs: 0, InfluentialScoreCondition: 0, InfluentialScore1: 0,
    InfluentialScore2: 0, OfflineSentimentIs: 0, ProductRatingIs: 0, GenderIs: "", MaritalStatusIs: 0, ProfessionIs: "", NotConnectedSocially: 0, LoyaltyPointsCondition: 0, LoyaltyPointsRange1: 0, LoyaltyPointsRange2: 0, RFMSScoreRangeCondition: 0,
    RFMSScoreRange1: 0, RFMSScoreRange2: 0, ShowFormOnlyNthTime: 0, CloseCountSessionWiseOrOverAll: false, OverAllTimeSpentInSite: 0, AlreadyVisitedPages: "", NurtureStatusIs: 0, IsMobileDevice: 0, AlreadyVisitedPagesOverAllOrSessionWise: 0, TriggerCreateDate: null,
    SentCount: 0, ViewCount: 0, ResponseCount: 0, OptOutCount: 0, ForwardCount: 0, BounceCount: 0, InstantOrOnceInaDay: false, LastPurchaseIntervalCondition: 0, LastPurchaseIntervalRange1: 0, LastPurchaseIntervalRange2: 0, IsNotClickedSpecificButtons: "",
    CustomerCurrentValueCondition: 0, CustomerCurrentValue2: 0, CustomerTotalPurchaseCondition: 0, CustomerTotalPurchase2: 0, AddedProductsCategoriesToCart: "", NotAddedProductsCategoriesToCart: "", AddedProductsSubCategoriesToCart: "", NotAddedProductsSubCategoriesToCart: "",
    NotAlreadyVisitedPages: "", NotAlreadyVisitedPagesOverAllOrSessionWise: 0, IsMailRespondentClickCondition: false, IsSmsIsRespondent: false, SmsRespondentConditionIsTrueOrIsFalse: false, SmsRespondentTemplates: "", IsBirthDay: false, IsDOBTodayOrMonth: 0,
    MailRespondentTemplates: "", NotSentCount: 0, DOBFromDate: null, DOBToDate: null, DOBDaysDiffernce: 0, IsDOBIgnored: false, IsDOBIgnoreCondition: 0, IsPromotionalOrTransnational: false, CampaignId: 0, SmsTemplateId: 0, MailTemplateId: 0, MailSubject: "", MailFromName: "",
    MailFromEmailId: "", MailReplyToEmailId: "", MailSubscribe: 0, MailForward: 0, TotalSent: 0, TotalNotSent: 0, TotalOpen: 0, TotalDelivered: 0, TotalNotDeliverStatus: 0, TotalBounced: 0, TotalUnsubscribe: 0, TotalClick: 0, TotalForward: 0,
    IsVisitedPagesContainsCondition: false, IsNotVisitedPagesContainsCondition: false, PageUrlParameters: "", AlreadyVisitedWithPageUrlParameters: "", NotAlreadyVisitedWithPageUrlParameters: "",
    IsVisitorVisitedPagesWithPageUrlParameter: false, IsVisitorsSource: false, StateName: "", StateConditionIsTrueOrIsFalse: false
};

$(document).ready(function () {
    $("#cont_setrules").removeClass("hideDiv");
    action = $.urlParam("Action");
    CreateWorkFlowRulesUtil.LoadingSymbol();
    CreateWorkFlowRulesUtil.InitializeGroupList();
    CreateWorkFlowRulesUtil.IntializeAutoComplete("ui_txtClickButton", "../CaptureForm/CommonDetailsForForms/GetEvetList", 2, "ui_txtClickButton_values", "clkBtn");
    CreateWorkFlowRulesUtil.IntializeAutoComplete("ui_txtNotClickButton", "../CaptureForm/CommonDetailsForForms/GetEvetList", 2, "ui_txtNotClickButton_values", "clkNotBtn");
    CreateWorkFlowRulesUtil.IntializeAutoComplete("ui_txtPriceRangeProducts", "../CaptureForm/CommonDetailsForForms/GetEvetList", 2, "ui_txtPriceRangeProducts_values", "ClickProduct");
    CreateWorkFlowRulesUtil.IntializeAutoComplete("ui_txtCustomerNotPurchasedProducts", "../CaptureForm/CommonDetailsForForms/GetProductList", 2, "ui_txtCustomerNotPurchasedProducts_values", "NotPurchase");
    CreateWorkFlowRulesUtil.IntializeAutoComplete("ui_txtCustomerPurchasedProducts", "../CaptureForm/CommonDetailsForForms/GetProductList", 2, "ui_txtCustomerPurchasedProducts_values", "Purchase");
    CreateWorkFlowRulesUtil.IntializeAutoComplete("ui_txtDropedFromCartProducts", "../CaptureForm/CommonDetailsForForms/GetProductList", 2, "ui_txtDropedFromCartProducts_values", "DropFromCart");
    CreateWorkFlowRulesUtil.IntializeAutoComplete("ui_txtViewedNotAddedToCartProducts", "../CaptureForm/CommonDetailsForForms/GetProductList", 2, "ui_txtViewedNotAddedToCartProducts_values", "NotAddedToCart");
    CreateWorkFlowRulesUtil.IntializeAutoComplete("ui_txtAddedToCartProducts", "../CaptureForm/CommonDetailsForForms/GetProductList", 2, "ui_txtAddedToCartProducts_values", "AddedToCart");
    CreateWorkFlowRulesUtil.IntializeAutoComplete("ui_txtAddedToCartProductsCategories", "../CaptureForm/CommonDetailsForForms/GetProductCategoryList", 2, "ui_txtAddedToCartProductsCategories_values", "CategoriesAddedToCart");
    CreateWorkFlowRulesUtil.IntializeAutoComplete("ui_txtNotAddedToCartProductsCategories", "../CaptureForm/CommonDetailsForForms/GetProductCategoryList", 2, "ui_txtNotAddedToCartProductsCategories_values", "CategoriesnotAddedToCart");
    CreateWorkFlowRulesUtil.IntializeAutoComplete("ui_txtAddedToCartProductsSubCategories", "../CaptureForm/CommonDetailsForForms/GetProductSubCategoryList", 2, "ui_txtAddedToCartProductsSubCategories_values", "SubCategoriesAddedToCart");
    CreateWorkFlowRulesUtil.IntializeAutoComplete("ui_txtNotAddedToCartProductsSubCategories", "../CaptureForm/CommonDetailsForForms/GetProductSubCategoryList", 2, "ui_txtNotAddedToCartProductsSubCategories_values", "SubCategoriesnotAddedToCart");
    CreateWorkFlowRulesUtil.IntializeAutoComplete("ui_txtCity", "../CaptureForm/CommonDetailsForForms/GetCityName", 2, "ui_txtCity_values", "cityName");
    CreateWorkFlowRulesUtil.IntializeAutoComplete("ui_txtState", "../CaptureForm/CommonDetailsForForms/GetStateName", 2, "ui_txtState_values", "stateName");
    if (action === 'save')
        $("#ui_span_EditRuleNmae").click();
    if (action === 'edit') {
        triggerMailSms.Id = parseInt($.urlParam("Id"));
        $("#ui_btn_SaveWorkflowRule").html('Update');
    }
});

var CreateWorkFlowRulesUtil = {
    LoadingSymbol: function () {
        LoadingTimeInverval = setInterval(function () {
            if (loadingDataValues.FormsList && loadingDataValues.GroupsList && loadingDataValues.LmsStageList && loadingDataValues.MailTemplates && loadingDataValues.SmsTemplates) {
                HidePageLoading();
                clearInterval(LoadingTimeInverval);
            }
        }, 300);
    },
    InitializeGroupList: function () {
        $.ajax({
            url: "../CaptureForm/CommonDetailsForForms/GetGroups",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataFilter: function (data) { return data; },
            success: function (response) {
                loadingDataValues.GroupsList = true;
                if (response != undefined && response != null && response.length > 0) {
                    var groupList = new Array();
                    $.each(response, function () {
                        groupList.push({ value: $(this)[0].Id.toString(), label: $(this)[0].Name });
                    });
                }

                $("#ui_txtGroups").autocomplete({
                    autoFocus: true,
                    minLength: 0, max: 10,
                    source: groupList,
                    select: function (events, selectedItem) {
                        CreateWorkFlowRulesUtil.AppendSelected("ui_txtGroups_values", selectedItem, "group");
                    },
                    close: function (event, ui) {
                        $(this).val("");
                    }
                });
                CreateWorkFlowRulesUtil.IntializeCountyList();
            },
            error: ShowAjaxError
        });
    },
    AppendSelected: function (appendTo, data, fieldId) {
        var mainDiv = document.createElement("div");
        mainDiv.id = fieldId + "_" + data.item.value.replace(/[ ,:/]+/g, "_");
        mainDiv.className = "vrAutocomplete";
        mainDiv.setAttribute("value", data.item.value);
        mainDiv.setAttribute("identifier", data.item.value.replace(/[ ,:/]+/g, "_"));

        var span = document.createElement("span");
        span.className = "vnAutocomplete";

        var contentDiv = document.createElement("div");
        contentDiv.className = "vtAutocomplete";
        contentDiv.innerHTML = data.item.label;

        var removeDiv = document.createElement("div");
        removeDiv.className = "vmAutocomplete";
        removeDiv.setAttribute("onclick", "CreateWorkFlowRulesUtil.RemoveData('" + fieldId + "_" + data.item.value.replace(/[ ,:/]+/g, "_") + "');");

        span.appendChild(contentDiv);
        span.appendChild(removeDiv);
        mainDiv.appendChild(span);

        var isElementIsNotAdded = true;

        $("#" + appendTo).children().each(function () {
            if (data.item.value.replace(/ /g, "_").replace(/,/g, "_") == $(this).attr("identifier")) {
                isElementIsNotAdded = false;
                return false;
            }
        });

        if (isElementIsNotAdded)
            $("#" + appendTo).append(mainDiv);
        else
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.ItemAlreadyAdded);
    },
    RemoveData: function (data) {
        data = $.trim(data);
        $("#" + data).remove();
    },
    IntializeCountyList: function () {
        $('#ui_txtCountry')[0].options.length = 0;

        if (countryList != null && countryList.length > 0) {
            $.each(countryList, function (i) {
                $("#ui_txtCountry").append("<option value='" + countryList[i] + "'>" + countryList[i] + "</option>");
            });
        }
        CreateWorkFlowRulesUtil.InitializeLmsStage();
    },
    IntializeCityList: function (cityName) {
        $.ajax({
            url: "../CaptureForm/CommonDetailsForForms/GetCityName",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ "value": cityName }),
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    $.each(response, function (i) {
                        $("#ui_txtCity").append("<option value='" + response[i] + "'>" + response[i] + "</option>");
                    });
                    AutoComplete("#ui_txtCity");
                }
            },
            error: ShowAjaxError
        });
    },
    InitializeLmsStage: function () {
        $.ajax({
            url: "../CaptureForm/CommonDetailsForForms/LmsStage",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataFilter: function (data) { return data; },
            success: function (response) {
                loadingDataValues.LmsStageList = true;
                if (response != undefined && response != null && response.length > 0) {
                    $.each(response, function () {
                        $("#ui_ddlProspectStatus").append("<option style='color:" + $(this)[0].IdentificationColor + ";' value='" + $(this)[0].Score.toString() + "'>" + $(this)[0].Stage + "</option>");
                    });
                }
                else {
                    CreateWorkFlowRulesUtil.AddOptionToDropDown(["ui_ddlProspectStatus"], "0", "No Lms Stage", "red");
                }

                CreateWorkFlowRulesUtil.IntializeMailTemplate();
            },
            error: ShowAjaxError
        });
    },
    IntializeMailTemplate: function () {
        $.ajax({
            url: "../CaptureForm/CommonDetailsForForms/GetTemplate",
            type: 'Post',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (TemplateList) {
                loadingDataValues.MailTemplates = true;
                if (TemplateList != undefined && TemplateList != null && TemplateList.length > 0) {
                    $.each(TemplateList, function () {
                        $("#ui_ddlMailRespondentTemplate").append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");
                    });
                }

                CreateWorkFlowRulesUtil.IntializeSmsTemplate();
            },
            error: ShowAjaxError
        });
    },
    IntializeSmsTemplate: function () {
        $.ajax({
            url: "../CaptureForm/CommonDetailsForForms/GetSmsTemplate",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                loadingDataValues.SmsTemplates = true;
                if (response != undefined && response != null && response.length > 0) {
                    $.each(response, function () {
                        $("#ui_ddlSmsRespondentTemplate").append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");
                    });
                }
                CreateWorkFlowRulesUtil.IntializeDOBCalender();
            },
            error: ShowAjaxError
        });
    },
    IntializeDOBCalender: function () {
        $(".calender").datepicker({
            prevText: "click for previous months",
            nextText: "click for next months",
            showOtherMonths: true,
            selectOtherMonths: false,
            dateFormat: "yy-mm-dd",
            onSelect: function (selected) {
                if ($(this).attr('id') == "txtDiffDate")
                    CreateWorkFlowRulesUtil.DaysDifference();
            }
        });
        CreateWorkFlowRulesUtil.IntializeFromsListAndMailGroupList();
    },
    IntializeFromsListAndMailGroupList: function () {
        $.ajax({
            url: "../CaptureForm/CommonDetailsForForms/GetFormsList",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataFilter: function (data) { return data; },
            success: function (response) {
                loadingDataValues.FormsList = true;
                if (response != undefined && response != null && response.length > 0) {
                    var formsList = response;
                    $.each(formsList, function () {
                        if ($(this)[0].FormType != 19) {
                            if ($(this)[0].FormType == 1)
                                CreateWorkFlowRulesUtil.AddOptionToDropDown(["ui_ddlRespondedFroms", "ui_ddlNotRespondedFroms", "ui_ddlAnswerDependencyFroms", "ui_ddlFormCloseEvent", "ui_ddlFormImpression", "ui_ddlResponseCountEvent"], $(this)[0].Id, $(this)[0].FormIdentifier, "");
                            else if ($(this)[0].FormType != 4 && $(this)[0].FormType != 1 && $(this)[0].FormType != 5 && $(this)[0].FormType != 17 && $(this)[0].FormType != 6 && $(this)[0].FormType != 2 && $(this)[0].FormType != 3)
                                CreateWorkFlowRulesUtil.AddOptionToDropDown(["ui_ddlFormCloseEvent", "ui_ddlFormImpression", "ui_ddlResponseCountEvent"], $(this)[0].Id, $(this)[0].Heading, "");
                            else
                                CreateWorkFlowRulesUtil.AddOptionToDropDown(["ui_ddlFormCloseEvent", "ui_ddlFormImpression"], $(this)[0].Id, $(this)[0].Heading, "");
                        }
                    });
                }
                else {
                    CreateWorkFlowRulesUtil.AddOptionToDropDown(["ui_ddlRespondedFroms", "ui_ddlNotRespondedFroms", "ui_ddlAnswerDependencyFroms", "ui_ddlFormCloseEvent", "ui_ddlFormImpression", "ui_ddlResponseCountEvent"], "0", "No froms have been added yet", "red");
                }
                if (action == 'edit')
                    CreateWorkFlowRulesUtil.GetRuleDetails();
            },
            error: ShowAjaxError
        });
    },
    AddOptionToDropDown: function (dropDownTag, value, text, uiStyle) {
        for (var index = 0; index < dropDownTag.length; index++) {
            $("#" + dropDownTag[index]).append("<option value='" + value + "'>" + text + "</option>");
            if (uiStyle.length > 0)
                $("#" + dropDownTag[index]).css("color", uiStyle);
        }
    },
    DaysDifference: function () {
        var Todate = new Date();
        var customDate = Todate.getFullYear() + "-" + (Todate.getMonth() + 1) + "-" + Todate.getDate().toString();
        var dates = customDate.split('-');
        var Todate = new Date(dates[0], dates[1] - 1, dates[2]);

        var PastDateOrFutureDate = $("#txtDiffDate").val();
        var dates = PastDateOrFutureDate.split('-');
        var PastDateOrFutureDate = new Date(dates[0], dates[1] - 1, dates[2]);

        diffDays = (PastDateOrFutureDate.getTime() - Todate.getTime()) / (24 * 60 * 60 * 1000);
        $("#ui_txtDOBNoofDays").val(diffDays);
    },
    GetDifferenceDateValue: function (DateValue, DaysGap) {
        var dateop = new Date(DateValue);
        var newdate = new Date(dateop);
        newdate.setDate(newdate.getDate() + parseInt(DaysGap));
        var dd = newdate.getDate();
        var mm = newdate.getMonth() + 1;
        var y = newdate.getFullYear();
        if (dd.toString().length == 1) {
            dd = "0" + dd;
        }
        if (mm.toString().length == 1) {
            mm = "0" + mm;
        }
        var someFormattedDate = y + '-' + mm + '-' + dd;
        return someFormattedDate;
    },
    BindFormFields: function (FormId) {
        $.ajax({
            url: "/CaptureForm/CommonDetailsForForms/GetFields",
            data: JSON.stringify({ 'FormId': FormId }),
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataFilter: function (data) { return data; },
            success: function (response) {
                var fieldsanswer = "";
                if (response.formFields.length > 0) {
                    if (response.formDetails != null && (response.formDetails.FormType == 12 || response.formDetails.FormType == 20)) {
                        $.each(response.formFields, function (i) {
                            if ($(this)[0].Name.length > 0)
                                fieldsanswer += "<div class='custom-control custom-radio custom-control-inline'><input type='radio' class='custom-control-input' name='AnswerDependencyFieldOption' id='ui_radAnswerDependency" + i + "' value='" + $(this)[0].Id + "' /><label for='ui_radAnswerDependency" + i + "' class='custom-control-label'>" + $(this)[0].Name + "</label></div>";
                        });
                    }
                    else {
                        $.each(response.formFields, function (i) {
                            if ($(this)[0].SubFields != null && $(this)[0].SubFields.length > 0) {

                                var subFields;

                                if ($(this)[0].SubFields.indexOf("@$") > 0) {
                                    subFields = $(this)[0].SubFields.split("@$");
                                }
                                else {
                                    subFields = $(this)[0].SubFields.split(",");
                                }
                                for (var j = 0; j < subFields.length; j++)
                                    fieldsanswer += "<div class='custom-control custom-radio custom-control-inline'><input type='radio' class='custom-control-input' name='AnswerDependencyFieldOption' id='ui_radAnswerDependency" + j + "' value='" + j + "' /><label for='ui_radAnswerDependency" + j + "' class='custom-control-label'>" + subFields[j] + "</label></div>";
                            }
                        });
                    }
                }
                else {
                    for (var j = 1; j <= 5; j++)
                        fieldsanswer += "<div class='custom-control custom-radio custom-control-inline'><input type='radio' class='custom-control-label' name='AnswerDependencyFieldOption' id='ui_radAnswerDependency" + j + "' value='" + j + "' /><label for='ui_radAnswerDependency" + j + "' class='custom-control-label'>Ratted - " + j + "</label></div>";
                }

                $("#ui_dvAnswerDependencyFields").html(fieldsanswer);

                if ($("#ui_dvAnswerDependencyFields > div").length > 0 && triggerMailSms.DependencyFormField > 0) {
                    $("input:radio[name='AnswerDependencyFieldOption'][value='" + triggerMailSms.DependencyFormField + "']").prop("checked", true);
                }
            },
            error: ShowAjaxError
        });
    },
    ValidateRules: function () {
        if ($("#wrkflwrulename").val().length === 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.AddRuleName_Error);
            $("#ui_span_EditRuleNmae").click();
            return false;
        }
        if (parseInt($(".rulecountaudi").html()) === 0 && parseInt($(".rulecountbeh").html()) === 0 && parseInt($(".rulecountinteract").html()) === 0 && parseInt($(".rulecountevnt").html()) === 0 && parseInt($(".rulecountprof").html()) === 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.SelectRule);
            return false;
        }
        if (!CreateWorkFlowRulesUtil.ValidationOfAudience())
            return false;
        if (!CreateWorkFlowRulesUtil.ValidateBehavior())
            return false;
        if (!CreateWorkFlowRulesUtil.ValidateInteraction())
            return false;
        if (!CreateWorkFlowRulesUtil.ValidateInteractionEvent())
            return false;
        if (!CreateWorkFlowRulesUtil.ValidateProfile())
            return false;
        return true;
    },
    ValidationOfAudience: function () {
        if ($("#ui_chkSegment").is(":checked") && $("input[name='BelongsGroup']:checked").val() && $("#ui_txtGroups_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.SelectGroup);
            $("#ui_txtGroups").focus();
            return false;
        }
        return true;
    },
    ValidateBehavior: function () {

        if ($("#ui_chkBehavioralScore").is(":checked")) {
            if ($("#ui_VisitorScore1").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterBehaviouralScore);
                $("#ui_VisitorScore1").focus();
                return false;
            }
            else if ($("#ui_ddlBehavioralScoreRange").val() == "3" && $("#ui_VisitorScore2").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterBehaviouralScoreRange);
                $("#ui_VisitorScore2").focus();
                return false;
            }
            else if ($("#ui_ddlBehavioralScoreRange").val() == "3" && parseInt($("#ui_VisitorScore1").val()) > parseInt($("#ui_VisitorScore2").val())) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterValidBehaviouralScoreRange);
                $("#ui_VisitorScore2").focus();
                return false;
            }
        }
        if ($("#ui_chkSessionIs").is(":checked") && $("#ui_txtSession").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterSessionValue);
            $("#ui_txtSession").focus();
            return false;
        }
        if ($("#ui_chkPageDepthIs").is(":checked") && $("#ui_txtPageDepthIs").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterPageDepth);
            $("#ui_txtPageDepthIs").focus();
            return false;
        }
        if ($("#ui_chkPageViewIs").is(":checked") && $("#ui_txtPageViewIs").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterPageView);
            $("#ui_txtPageViewIs").focus();
            return false;
        }

        if ($("#ui_chkIsMailRespondent").is(":checked")) {
            if ($("#ui_ddlMailRespondentTemplate option").length <= 1) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.AddTemplate);
                $("#ui_ddlMailRespondentTemplate").focus();
                return false;
            }

            if ($('#ui_ddlMailRespondentTemplate').select2().val() == undefined || $('#ui_ddlMailRespondentTemplate').select2().val() == null || $('#ui_ddlMailRespondentTemplate').select2().val().toString() == "" || $('#ui_ddlMailRespondentTemplate').select2().val().toString().length == "0") {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.SelectMailRespondedTemplates);
                $("#ui_ddlMailRespondentTemplate").focus();
                return false;
            }

            if ($('#ui_ddlMailRespondentTemplate').select2().val() != undefined && $('#ui_ddlMailRespondentTemplate').select2().val() != null && $('#ui_ddlMailRespondentTemplate').select2().val().toString().split(',').length > 1) {
                var MailTempNames = [];
                $.each($('#ui_ddlMailRespondentTemplate').select2('data'), function () {
                    MailTempNames.push($(this)[0].text);
                });

                if (jQuery.inArray("All", MailTempNames) !== -1) {
                    ShowErrorMessage(GlobalErrorList.Journey_CreateRules.DefaultSMSRespondedTemplates);
                    $("#ui_ddlMailRespondentTemplate").focus();
                    return false;
                }
            }
        }

        if ($("#ui_chkIsSmsRespondent").is(":checked")) {
            if ($("#ui_ddlSmsRespondentTemplate option").length <= 1) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.AddTemplate);
                $("#ui_ddlSmsRespondentTemplate").focus();
                return false;
            }

            if ($('#ui_ddlSmsRespondentTemplate').select2().val() == undefined || $('#ui_ddlSmsRespondentTemplate').select2().val() == null || $('#ui_ddlSmsRespondentTemplate').select2().val().toString() == "" || $('#ui_ddlSmsRespondentTemplate').select2().val().toString().length == "0") {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.SelectSMSRespondedTemplates);
                $("#ui_ddlSmsRespondentTemplate").focus();
                return false;
            }

            if ($('#ui_ddlSmsRespondentTemplate').select2().val() != undefined && $('#ui_ddlSmsRespondentTemplate').select2().val() != null && $('#ui_ddlSmsRespondentTemplate').select2().val().toString().split(',').length > 1) {
                var SmsTempNames = [];
                $.each($('#ui_ddlSmsRespondentTemplate').select2('data'), function () {
                    SmsTempNames.push($(this)[0].text);
                });

                if (jQuery.inArray("All", SmsTempNames) !== -1) {
                    ShowErrorMessage(GlobalErrorList.Journey_CreateRules.DefaultSMSRespondedTemplates);
                    $("#ui_ddlSmsRespondentTemplate").focus();
                    return false;
                }
            }
        }

        if ($("#ui_chkFrequencyIs").is(":checked") && $("#ui_txtFrequencyIs").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterFrequency);
            $("#ui_txtFrequencyIs").focus();
            return false;
        }
        if ($("#ui_chkOnPageUrl").is(":checked") && $("#ui_txtPageUrl").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterPageUrl);
            $("#ui_txtPageUrl").focus();
            return false;
        }
        if ($("#ui_chkVisitorsVisitedPagesWithPageUrlParameter").is(":checked") && $("#ui_txtVisitorsVisitedPagesWithPageUrlParameter").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterPageUrlParameter);
            $("#ui_txtVisitorsVisitedPagesWithPageUrlParameter").focus();
            return false;
        }
        if ($("#ui_chkSourceIs").is(":checked") && $("#ui_radSourceIsReferrer").is(":checked") && $("#ui_txtSourceIs").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterSourceUrl);
            $("#ui_txtSourceIs").focus();
            return false;
        }
        if ($("#ui_chkSearchKeywordIs").is(":checked") && $("#ui_txtSearchKeyword").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterSearchKeyword);
            $("#ui_txtSearchKeyword").focus();
            return false;
        }

        if ($("#ui_chkCountryIs").is(":checked")) {
            if ($('#ui_txtCountry').select2().val() == undefined || $('#ui_txtCountry').select2().val() == null || $('#ui_txtCountry').select2().val().toString() == "" || $('#ui_txtCountry').select2().val().toString().length == "0") {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterCountryName);
                $("#ui_txtCountry").focus();
                return false;
            }
        }

        if ($("#ui_chkStateIs").is(":checked") && $("#ui_txtState_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterStateName);
            $("#ui_txtState").focus();
            return false;
        }

        if ($("#ui_chkCityIs").is(":checked") && $("#ui_txtCity_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterCityName);
            $("#ui_txtCity").focus();
            return false;
        }

        if ($("#ui_chkAlreadyVisitedPages").is(":checked") && $("#ui_txtAlreadyVisitedPageUrls").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterAlreadyVisitedPageUrls);
            $("#ui_txtAlreadyVisitedPageUrls").focus();
            return false;
        }
        if ($("#ui_chkVisitorsAlreadyVisitedPagesWithPageUrlParameter").is(":checked") && $("#ui_txtVisitorsAlreadyVisitedPagesWithPageUrlParameter").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterAlreadyVisitedPageUrlsParameter);
            $("#ui_txtVisitorsAlreadyVisitedPagesWithPageUrlParameter").focus();
            return false;
        }

        if ($("#ui_chkNotAlreadyVisitedPages").is(":checked") && $("#ui_txtNotAlreadyVisitedPageUrls").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterAlreadyNotVisitedPageUrls);
            $("#ui_txtNotAlreadyVisitedPageUrls").focus();
            return false;
        }

        if ($("#ui_chkVisitorsNotAlreadyVisitedPagesWithPageUrlParameter").is(":checked") && $("#ui_txtVisitorsNotAlreadyVisitedPagesWithPageUrlParameter").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterAlreadyNotVisitedPageUrlsParameter);
            $("#ui_txtVisitorsNotAlreadyVisitedPagesWithPageUrlParameter").focus();
            return false;
        }

        if ($("#ui_chkTimeSpentInSite").is(":checked") && $("#ui_txtTimeSpentInSite").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterOverAllTimeSpentInSite);
            $("#ui_txtTimeSpentInSite").focus();
            return false;
        }

        return true;
    },
    ValidateInteraction: function () {

        if ($("#ui_chkClickedButton").is(":checked") && $("#ui_txtClickButton_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterClickedButtonTagName);
            $("#ui_txtClickButton").focus();
            return false;
        }

        if ($("#ui_chkNotClickedButton").is(":checked") && $("#ui_txtNotClickButton_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterNotClickedButtonTagName);
            $("#ui_txtNotClickButton").focus();
            return false;
        }

        if ($("#ui_chkClickedPriceRange").is(":checked")) {

            if ($("#ui_txtPriceRangeProducts_values").children().length == 0) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.Enterclickedtag);
                $("#ui_txtPriceRangeProducts").focus();
                return false;
            }
        }

        if ($("#ui_chkRespondedForm").is(":checked")) {

            if ($("#ui_ddlRespondedFroms option").length <= 1) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.CreateForms);
                $("#ui_ddlRespondedFroms").focus();
                return false;
            }

            if ($("#ui_ddlRespondedFroms").val() == 0) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.SelectForms);
                $("#ui_ddlRespondedFroms").focus();
                return false;
            }
        }

        if ($("#ui_chkNotRespondedForm").is(":checked")) {
            if ($("#ui_ddlNotRespondedFroms option").length <= 1) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.CreateForms);
                $("#ui_ddlNotRespondedFroms").focus();
                return false;
            }

            if ($("#ui_ddlNotRespondedFroms").val() == 0) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.SelectForms);
                $("#ui_ddlNotRespondedFroms").focus();
                return false;
            }
        }

        if ($("#ui_chkAnswerDependencyForm").is(":checked")) {
            if ($("#ui_ddlAnswerDependencyFroms").val() == "0") {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.SelectAnswerDependency);
                $("#ui_ddlAnswerDependencyFroms").focus();
                return false;
            }
            if ($("input:radio[name='AnswerDependencyFieldOption']:checked").val() == undefined) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.SelectAnswerDependencyFormField);
                $("#ui_ddlAnswerDependencyFroms").focus();
                return false;
            }
            if ($("#ui_txtAnswerCondition1").val().length == 0) {
                $("#ui_txtAnswerCondition1").focus();
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.SelectAnswerDependencyFormFieldAnswerValue);
                return false;
            }
            if ($("#ui_ddlAnswerCondition").val() == "3" && $("#ui_txtAnswerCondition2").val().length == 0) {
                $("#ui_txtAnswerCondition2").focus();
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterAnswerDependencyFormFieldCorrectRange);
                return false;
            }
        }

        if ($("#ui_chkClosedNTimes").is(":checked") && $("#ui_txtClosedNTimes").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterVisitorClosedFormNthTime);
            $("#ui_txtClosedNTimes").focus();
            return false;
        }
        if ($("#ui_chkAddedToCart").is(":checked") && $("#ui_txtAddedToCartProducts_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterAddedToCartProducts);
            $("#ui_txtAddedToCartProducts").focus();
            return false;
        }
        if ($("#ui_chkViewedNotAddedToCart").is(":checked") && $("#ui_txtViewedNotAddedToCartProducts_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterViewedButNotAddedToCartProducts);
            $("#ui_txtViewedNotAddedToCartProducts").focus();
            return false;
        }
        if ($("#ui_chkDropedFromCart").is(":checked") && $("#ui_txtDropedFromCartProducts_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterDroppedCartProducts);
            $("#ui_txtDropedFromCartProducts").focus();
            return false;
        }
        if ($("#ui_chkCustomerPurchased").is(":checked") && $("#ui_txtCustomerPurchasedProducts_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.SelectCustomerPurchasedProducts);
            $("#ui_txtCustomerPurchasedProducts").focus();
            return false;
        }
        if ($("#ui_chkCustomerNotPurchased").is(":checked") && $("#ui_txtCustomerNotPurchasedProducts_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.SelectCustomerNotPurchasedProducts);
            $("#ui_txtCustomerNotPurchasedProducts").focus();
            return false;
        }
        if ($("#ui_chkTotalPurchaseIs").is(":checked")) {
            if ($('#ui_ddlCustomerTotalPurchase option:selected').val() != "3" && $("#ui_txtCustomerTotalPurchase1").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterCustomerTotalTransaction);
                $("#ui_txtCustomerTotalPurchase2").focus();
                return false;
            }
            else if ($('#ui_ddlCustomerTotalPurchase option:selected').val() == "3") {

                if ($("#ui_txtCustomerTotalPurchase1").val().length == 0 || $("#ui_txtCustomerTotalPurchase2").val().length == 0) {
                    ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterCustomerTotalTransaction);
                    return false;
                } else {
                    if (parseInt($("#ui_txtCustomerTotalPurchase2").val()) <= parseInt($("#ui_txtCustomerTotalPurchase1").val())) {
                        ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterCustomerTotalTransactionRange);
                        return false;
                    }
                }
            }
        }


        if ($("#ui_chkCustomerCurrectValue").is(":checked")) {
            if ($('#ui_ddlCustomerCurrentValue option:selected').val() != "3" && $("#ui_txtCustomerCurrentValue1").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterCustomerCurrentValue);
                $("#ui_txtCustomerTotalPurchase2").focus();
                return false;
            }
            else if ($('#ui_ddlCustomerCurrentValue option:selected').val() == "3") {

                if ($("#ui_txtCustomerCurrentValue1").val().length == 0 || $("#ui_txtCustomerCurrentValue2").val().length == 0) {
                    ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterCustomerCurrentValue);
                    return false;
                } else {
                    if (parseInt($("#ui_txtCustomerCurrentValue2").val()) <= parseInt($("#ui_txtCustomerCurrentValue1").val())) {
                        ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterCustomerCurrentRange);
                        return false;
                    }
                }
            }
        }

        if ($("#ui_chkCustomerLastPurchase").is(":checked")) {
            if ($('#ui_ddlLastPurchaseCondition option:selected').val() != "3" && $("#ui_txtLastPurchaseRange1").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterCustomerLastPurchased);
                $("#ui_txtCustomerTotalPurchase2").focus();
                return false;
            }
            else if ($('#ui_ddlLastPurchaseCondition option:selected').val() == "3") {

                if ($("#ui_txtLastPurchaseRange1").val().length == 0 || $("#ui_txtLastPurchaseRange2").val().length == 0) {
                    ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterCustomerLastPurchased);
                    return false;
                } else {
                    if (parseInt($("#ui_txtLastPurchaseRange2").val()) <= parseInt($("#ui_txtLastPurchaseRange1").val())) {
                        ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterCustomerLastPurchasedRange);
                        return false;
                    }
                }
            }
        }

        if ($("#ui_chkCategoriesAddedToCart").is(":checked") && $("#ui_txtAddedToCartProductsCategories_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.SelectAddedToCartProductCategories);
            $("#ui_chkCategoriesAddedToCart").focus();
            return false;
        }
        if ($("#ui_chkCategoriesNotAddedToCart").is(":checked") && $("#ui_txtNotAddedToCartProductsCategories_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.SelectNotAddedToCartProductCategories);
            $("#ui_chkCategoriesNotAddedToCart").focus();
            return false;
        }
        if ($("#ui_chkSubCategoriesAddedToCart").is(":checked") && $("#ui_txtAddedToCartProductsSubCategories_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.SelectAddedToCartProductSubCategories);
            $("#ui_chkSubCategoriesAddedToCart").focus();
            return false;
        }
        if ($("#ui_chkSubCategoriesNotAddedToCart").is(":checked") && $("#ui_txtNotAddedToCartProductsSubCategories_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.SelectNotAddedToCartProductSubCategories);
            $("#ui_chkSubCategoriesNotAddedToCart").focus();
            return false;
        }

        return true;
    },
    ValidateInteractionEvent: function () {

        if ($("#ui_chkFormImpression").is(":checked")) {

            if ($("#ui_txtFormImpressionCount").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterFormImpressionCount);
                $("#ui_txtFormImpressionCount").focus();
                return false;
            }
        }

        if ($("#ui_chkFormCloseEvent").is(":checked")) {

            if ($("#ui_txtFormCloseEventCount").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterFormCloseCount);
                $("#ui_txtFormCloseEventCount").focus();
                return false;
            }
        }

        if ($("#ui_chkResponseCountEvent").is(":checked")) {

            if ($("#ui_txtResponseCountEventCount").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterFormResponsesCount);
                $("#ui_txtResponseCountEventCount").focus();
                return false;
            }
        }

        if ($("#ui_chkShowFormAtNTime").is(":checked") && $("#ui_txtShowFormAtNTime").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterFormNthTimeCondition);
            $("#ui_txtShowFormAtNTime").focus();
            return false;
        }

        return true;
    },
    ValidateProfile: function () {
        if ($("#ui_chkInfluentialScoreIs").is(":checked")) {
            if ($("#ui_txtInfluentialScore1").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterInfluentialScore);
                $("#ui_txtInfluentialScore1").focus();
                return false;
            }
            else if ($("#ui_ddlInfluentialScoreIs").val() == "3" && $("#ui_txtInfluentialScore2").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterInfluentialScoreRange);
                $("#ui_txtInfluentialScore2").focus();
                return false;
            }
            else if ($("#ui_ddlInfluentialScoreIs").val() == "3" && parseInt($("#ui_txtInfluentialScore1").val()) > parseInt($("#ui_txtInfluentialScore2").val())) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterCorrectInfluentialScorerange);
                $("#ui_txtInfluentialScore2").focus();
                return false;
            }
        }

        if ($("#ui_chkIndustryIs").is(":checked")) {
            if ($("#ui_txtIndustryIs").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterProspectProfessionRange);
                $("#ui_txtIndustryIs").focus();
                return false;
            }
        }

        if ($("#ui_chkProspectLoyaltyIs").is(":checked")) {
            if ($("#ui_txtProspectLoyalty1").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterLoyaltyScore);
                $("#ui_txtProspectLoyalty1").focus();
                return false;
            }
            else if ($("#ui_ddlProspectLoyaltyIs").val() == "3" && $("#ui_txtProspectLoyalty2").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterLoyaltyRange);
                $("#ui_txtProspectLoyalty2").focus();

                return false;
            }
            else if ($("#ui_ddlProspectLoyaltyIs").val() == "3" && parseInt($("#ui_txtProspectLoyalty1").val()) > parseInt($("#ui_txtProspectLoyalty2").val())) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterCorrectloyaltyRange);
                $("#ui_txtProspectLoyalty2").focus();
                return false;
            }
        }

        if ($("#ui_chkRFMSScoreIs").is(":checked")) {
            if ($("#ui_txtRFMSScore1").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterRFMSScore);
                $("#ui_txtRFMSScore1").focus();
                return false;
            }
            else if ($("#ui_ddlRFMSScore").val() == "3" && $("#ui_txtRFMSScore2").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterRFMSRange);
                $("#ui_txtRFMSScore2").focus();
                return false;
            }
            else if ($("#ui_ddlRFMSScore").val() == "3" && parseInt($("#ui_txtRFMSScore1").val()) > parseInt($("#ui_txtRFMSScore2").val())) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterCorrectRFMSRange);
                $("#ui_txtRFMSScore2").focus();
                return false;
            }
        }

        if ($("#ui_chkDOBIs").is(":checked")) {

            if ($("#chk_IgnoreDOB").is(":checked") && $("#ui_ddlIgnoreDOB").get(0).selectedIndex == 0) {
                ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterIgnoreDOB);
                $("#ui_ddlIgnoreDOB").focus();
                return false;
            }

            if ($("#ui_rdbtnDates").is(":checked")) {
                if ($("#txtFromDate").val().length == 0) {
                    ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterFromrange);
                    $("#txtFromDate").focus();
                    return false;
                }
                if ($("#txtToDate").val().length == 0) {
                    ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterToDate);
                    $("#txtToDate").focus();
                    return false;
                }

                var dates = $("#txtFromDate").val().split('-');
                var FromDate = new Date(dates[0], dates[1] - 1, dates[2]);

                var dates = $("#txtToDate").val().split('-');
                var ToDate = new Date(dates[0], dates[1] - 1, dates[2]);

                if (FromDate.getTime() > ToDate.getTime()) {
                    ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterCorrectDateRange);
                    $("#txtToDate").focus();
                    return false;
                }
            }
            if ($("#ui_rdbtnDayDiff").is(":checked")) {
                if ($("#ui_txtDOBNoofDays").val() != null && $("#ui_txtDOBNoofDays").val() == 0) {
                    ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterCorrectDays);
                    $("#ui_txtDOBNoofDays").focus();
                    return false;
                }

                if (($("#txtDiffDate").val().length == 0) || ($("#ui_txtDOBNoofDays").val().length == 0)) {
                    ShowErrorMessage(GlobalErrorList.Journey_CreateRules.EnterCorrectDateValue);
                    $("#txtDiffDate").focus();
                    return false;
                }
            }
        }
        return true;
    },
    SaveBasicDetails: function () {
        triggerMailSms.TriggerHeading = CleanText($("#wrkflwrulename").val());
        $.ajax({
            url: "/Journey/CreateRule/SaveBasicDetails",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'setRules': triggerMailSms }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (!response.Status) {
                    ShowErrorMessage(GlobalErrorList.Journey_CreateRules.RuleNameExists);
                }
                else if (response.Status) {
                    if (action === 'save')
                        ShowSuccessMessage(GlobalErrorList.Journey_CreateRules.RuleSaved);
                    else
                        ShowSuccessMessage(GlobalErrorList.Journey_CreateRules.RuleUpdated);

                    setTimeout(function () { window.location.href = "/Journey/Rules"; }, 3000);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    GetRulesData: function () {
        CreateWorkFlowRulesUtil.AssignAudienceData();
        CreateWorkFlowRulesUtil.AssignBehaviorData();
        CreateWorkFlowRulesUtil.AssignInteractionData();
        CreateWorkFlowRulesUtil.AssignInteractionEventData();
        CreateWorkFlowRulesUtil.AssignProfileData();
        CreateWorkFlowRulesUtil.SaveBasicDetails();
    },
    AssignAudienceData: function () {

        if ($("#ui_chkVisitorType").is(":checked"))
            triggerMailSms.IsLead = parseInt($("input:radio[name='VisitorType']:checked").val());
        else
            triggerMailSms.IsLead = -1;

        if ($("#ui_chkSegment").is(":checked")) {
            triggerMailSms.IsBelong = $("input:radio[name='BelongsGroup']:checked").val();
            triggerMailSms.BelongsToGroup = CreateWorkFlowRulesUtil.GetListDataBySpanId($("#ui_txtGroups_values"), "value", "").join(",");
        }
        else {
            triggerMailSms.IsBelong = 0;
            triggerMailSms.BelongsToGroup = "";
        }
        return triggerMailSms;
    },
    AssignBehaviorData: function () {

        if ($("#ui_chkBehavioralScore").is(":checked")) {
            triggerMailSms.BehavioralScoreCondition = $("#ui_ddlBehavioralScoreRange").val();
            triggerMailSms.BehavioralScore1 = $("#ui_VisitorScore1").val();

            if ($("#ui_ddlBehavioralScoreRange").val() == "3")
                triggerMailSms.BehavioralScore2 = $("#ui_VisitorScore2").val();
            else
                triggerMailSms.BehavioralScore2 = 0;
        }
        else {
            triggerMailSms.BehavioralScoreCondition = triggerMailSms.BehavioralScore1 = triggerMailSms.BehavioralScore2 = 0;
        }

        if ($("#ui_chkSessionIs").is(":checked")) {
            triggerMailSms.SessionIs = $("#ui_txtSession").val();

            if ($("#ui_radSessionIsFalse").is(":checked"))
                triggerMailSms.SessionConditionIsTrueOrIsFalse = false;
            else
                triggerMailSms.SessionConditionIsTrueOrIsFalse = true;
        }
        else {
            triggerMailSms.SessionIs = 0;
            triggerMailSms.SessionConditionIsTrueOrIsFalse = true;
        }

        if ($("#ui_chkPageDepthIs").is(":checked")) {
            triggerMailSms.PageDepthIs = $("#ui_txtPageDepthIs").val();

            if ($("#ui_radPageDepthIsFalse").is(":checked"))
                triggerMailSms.PageDepthConditionIsTrueOrIsFalse = false;
            else
                triggerMailSms.PageDepthConditionIsTrueOrIsFalse = true
        }
        else {
            triggerMailSms.PageDepthIs = 0;
        }

        if ($("#ui_chkPageViewIs").is(":checked")) {
            triggerMailSms.NPageVisited = $("#ui_txtPageViewIs").val();

            if ($("#ui_radPageViewIsFalse").is(":checked"))
                triggerMailSms.PageViewConditionIsTrueOrIsFalse = false;
            else
                triggerMailSms.PageViewConditionIsTrueOrIsFalse = true;
        }
        else {
            triggerMailSms.NPageVisited = 0;
        }

        if ($("#ui_chkFrequencyIs").is(":checked")) {
            triggerMailSms.FrequencyIs = $("#ui_txtFrequencyIs").val();
            if ($("#ui_radFrequencyIsFalse").is(":checked"))
                triggerMailSms.FrequencyConditionIsTrueOrIsFalse = false;
            else
                triggerMailSms.FrequencyConditionIsTrueOrIsFalse = true;
        }
        else {
            triggerMailSms.FrequencyIs = 0;
        }

        if ($("#ui_chkOnPageUrl").is(":checked")) {
            triggerMailSms.PageUrl = $("#ui_txtPageUrl").val();

            if ($("#ui_PageUrlCheckContains").is(":checked"))
                triggerMailSms.IsPageUrlContainsCondition = true;
            else
                triggerMailSms.IsPageUrlContainsCondition = false;
        }
        else {
            triggerMailSms.PageUrl = "";
        }

        if ($("#ui_chkVisitorsVisitedPagesWithPageUrlParameter").is(":checked")) {

            if ($("#ui_radPageUrlParamFalse").is(":checked"))
                triggerMailSms.IsVisitorVisitedPagesWithPageUrlParameter = false;
            else
                triggerMailSms.IsVisitorVisitedPagesWithPageUrlParameter = true;

            triggerMailSms.PageUrlParameters = $("#ui_txtVisitorsVisitedPagesWithPageUrlParameter").val();
        }
        else {
            triggerMailSms.PageUrlParameters = "";
        }



        if ($("#ui_chkSourceIs").is(":checked")) {

            if ($("#ui_radSourceIsFalse").is(":checked"))
                triggerMailSms.IsVisitorsSource = false;
            else
                triggerMailSms.IsVisitorsSource = true;

            if ($("#ui_radSourceIsDirect").is(":checked")) {
                triggerMailSms.IsReferrer = 1;
            }
            else if ($("#ui_radSourceIsReferrer").is(":checked")) {
                triggerMailSms.IsReferrer = 2
                triggerMailSms.ReferrerUrl = $("#ui_txtSourceIs").val();
                if ($("#ui_chkCheckSourceDomainOnly").is(":checked"))
                    triggerMailSms.CheckSourceDomainOnly = true;
            }
        }
        else {
            triggerMailSms.IsReferrer = 0;
            triggerMailSms.CheckSourceDomainOnly = false;
        }

        if ($("#ui_chkIsMailRespondent").is(":checked")) {
            triggerMailSms.IsMailIsRespondent = true;

            if ($("#ui_radMailRespondentIsFalse").is(":checked"))
                triggerMailSms.MailRespondentConditionIsTrueOrIsFalse = false;
            else
                triggerMailSms.MailRespondentConditionIsTrueOrIsFalse = true;

            var SelectedTemplateIdValues = [];
            $.each($('#ui_ddlMailRespondentTemplate').select2('data'), function () {
                SelectedTemplateIdValues.push($(this)[0].id);
            });

            triggerMailSms.MailRespondentTemplates = SelectedTemplateIdValues.join();

            if ($("#ui_chkMailRespondentClick").is(":checked"))
                triggerMailSms.IsMailRespondentClickCondition = true;
            else
                triggerMailSms.IsMailRespondentClickCondition = false;
        }
        else {
            triggerMailSms.IsMailIsRespondent = false;
            triggerMailSms.MailRespondentTemplates = "";
            triggerMailSms.IsMailRespondentClickCondition = false;
        }

        if ($("#ui_chkIsSmsRespondent").is(":checked")) {
            triggerMailSms.IsSmsIsRespondent = true;

            if ($("#ui_radSmsRespondentIsFalse").is(":checked"))
                triggerMailSms.SmsRespondentConditionIsTrueOrIsFalse = false;
            else
                triggerMailSms.SmsRespondentConditionIsTrueOrIsFalse = true;

            var SelectedSmsTemplateIds = [];
            $.each($('#ui_ddlSmsRespondentTemplate').select2('data'), function () {
                SelectedSmsTemplateIds.push($(this)[0].id);
            });
            triggerMailSms.SmsRespondentTemplates = SelectedSmsTemplateIds.join();
        }
        else {
            triggerMailSms.IsSmsIsRespondent = false;
            triggerMailSms.SmsRespondentTemplates = "";
        }

        if ($("#ui_chkSearchKeywordIs").is(":checked"))
            triggerMailSms.SearchString = $("#ui_txtSearchKeyword").val();
        else
            triggerMailSms.SearchString = "";

        if ($("#ui_chkCountryIs").is(":checked")) {
            var CountryValues = [];
            $.each($('#ui_txtCountry').select2('data'), function () {
                CountryValues.push($(this)[0].text);
            });

            triggerMailSms.Country = CountryValues.join("@$");

            if ($("#ui_radCountryIsFalse").is(":checked"))
                triggerMailSms.CountryConditionIsTrueOrIsFalse = false;
            else
                triggerMailSms.CountryConditionIsTrueOrIsFalse = true;
        }
        else {
            triggerMailSms.Country = "";
        }

        if ($("#ui_chkStateIs").is(":checked")) {
            triggerMailSms.StateName = CreateWorkFlowRulesUtil.GetListDataBySpanId($("#ui_txtState_values"), "value", "").join("@$");
            if ($("#ui_radStateIsFalse").is(":checked"))
                triggerMailSms.StateConditionIsTrueOrIsFalse = false;
            else
                triggerMailSms.StateConditionIsTrueOrIsFalse = true;
        }
        else {
            triggerMailSms.StateName = "";
        }

        if ($("#ui_chkCityIs").is(":checked")) {
            triggerMailSms.City = CreateWorkFlowRulesUtil.GetListDataBySpanId($("#ui_txtCity_values"), "value", "").join("@$");
            if ($("#ui_radCityIsFalse").is(":checked"))
                triggerMailSms.CityConditionIsTrueOrIsFalse = false;
            else
                triggerMailSms.CityConditionIsTrueOrIsFalse = true;
        }
        else {
            triggerMailSms.City = "";
        }

        if ($("#ui_chkAlreadyVisitedPages").is(":checked")) {
            triggerMailSms.AlreadyVisitedPages = $("#ui_txtAlreadyVisitedPageUrls").val();

            if ($("#ui_AlreadyPageUrlCheckContains").is(":checked"))
                triggerMailSms.IsVisitedPagesContainsCondition = true;
            else
                triggerMailSms.IsVisitedPagesContainsCondition = false;

            if ($("#ui_radPageViewOverAll").is(":checked"))
                triggerMailSms.AlreadyVisitedPagesOverAllOrSessionWise = false;
            else
                triggerMailSms.AlreadyVisitedPagesOverAllOrSessionWise = true;
        }
        else {
            triggerMailSms.AlreadyVisitedPages = "";
            triggerMailSms.AlreadyVisitedPagesOverAllOrSessionWise = false;
        }

        if ($("#ui_chkVisitorsAlreadyVisitedPagesWithPageUrlParameter").is(":checked"))
            triggerMailSms.AlreadyVisitedWithPageUrlParameters = $("#ui_txtVisitorsAlreadyVisitedPagesWithPageUrlParameter").val();

        else
            triggerMailSms.AlreadyVisitedWithPageUrlParameters = "";

        if ($("#ui_chkNotAlreadyVisitedPages").is(":checked")) {
            triggerMailSms.NotAlreadyVisitedPages = $("#ui_txtNotAlreadyVisitedPageUrls").val();

            if ($("#ui_NotAlreadyPageUrlCheckContains").is(":checked"))
                triggerMailSms.IsNotVisitedPagesContainsCondition = true;
            else
                triggerMailSms.IsNotVisitedPagesContainsCondition = false;

            if ($("#ui_radNotPageViewOverAll").is(":checked"))
                triggerMailSms.NotAlreadyVisitedPagesOverAllOrSessionWise = false;
            else
                triggerMailSms.NotAlreadyVisitedPagesOverAllOrSessionWise = true;
        }
        else {
            triggerMailSms.NotAlreadyVisitedPages = "";
            triggerMailSms.NotAlreadyVisitedPagesOverAllOrSessionWise = false;
        }

        if ($("#ui_chkVisitorsNotAlreadyVisitedPagesWithPageUrlParameter").is(":checked"))
            triggerMailSms.NotAlreadyVisitedWithPageUrlParameters = $("#ui_txtVisitorsNotAlreadyVisitedPagesWithPageUrlParameter").val();

        else
            triggerMailSms.NotAlreadyVisitedWithPageUrlParameters = "";


        if ($("#ui_chkTimeSpentInSite").is(":checked"))
            triggerMailSms.OverAllTimeSpentInSite = $("#ui_txtTimeSpentInSite").val();
        else
            triggerMailSms.OverAllTimeSpentInSite = 0;

        if ($("#ui_chkIsAndriodMobile").is(":checked")) {
            if ($("#ui_radMobileDeviceConditionIsTrue").is(":checked"))
                triggerMailSms.IsMobileDevice = 1;
            else
                triggerMailSms.IsMobileDevice = 2;
        }
        else {
            triggerMailSms.IsMobileDevice = 0;
        }

        return triggerMailSms;
    },
    AssignInteractionData: function () {

        if ($("#ui_chkClickedButton").is(":checked"))
            triggerMailSms.IsClickedSpecificButtons = CreateWorkFlowRulesUtil.GetListDataBySpanId($("#ui_txtClickButton_values"), "id", "clkBtn_").join(",");
        else
            triggerMailSms.IsClickedSpecificButtons = "";

        if ($("#ui_chkNotClickedButton").is(":checked"))
            triggerMailSms.IsNotClickedSpecificButtons = CreateWorkFlowRulesUtil.GetListDataBySpanId($("#ui_txtNotClickButton_values"), "id", "clkNotBtn_").join(",");
        else
            triggerMailSms.IsNotClickedSpecificButtons = "";

        if ($("#ui_chkClickedPriceRange").is(":checked"))
            triggerMailSms.ClickedPriceRangeProduct = CreateWorkFlowRulesUtil.GetListDataBySpanId($("#ui_txtPriceRangeProducts_values"), "value", "").join(",");
        else
            triggerMailSms.ClickedPriceRangeProduct = "";

        if ($("#ui_chkRespondedInChat").is(":checked"))
            triggerMailSms.IsVisitorRespondedChat = true;
        else
            triggerMailSms.IsVisitorRespondedChat = false;

        if ($("#ui_chkMailResponseStage").is(":checked"))
            triggerMailSms.MailCampignResponsiveStage = $("#ui_ddlMailScore").val();
        else
            triggerMailSms.MailCampignResponsiveStage = 0;

        if ($("#ui_chkRespondedForm").is(":checked"))
            triggerMailSms.IsRespondedForm = $("#ui_ddlRespondedFroms").val();
        else
            triggerMailSms.IsRespondedForm = 0;

        if ($("#ui_chkNotRespondedForm").is(":checked"))
            triggerMailSms.IsNotRespondedForm = $("#ui_ddlNotRespondedFroms").val();
        else
            triggerMailSms.IsNotRespondedForm = 0;

        if ($("#ui_chkAnswerDependencyForm").is(":checked")) {
            triggerMailSms.DependencyFormId = $("#ui_ddlAnswerDependencyFroms").val();
            triggerMailSms.DependencyFormField = $("input:radio[name='AnswerDependencyFieldOption']:checked").val();
            triggerMailSms.DependencyFormAnswer1 = CleanText($("#ui_txtAnswerCondition1").val());
            triggerMailSms.DependencyFormAnswer2 = CleanText($("#ui_txtAnswerCondition2").val());
            triggerMailSms.DependencyFormCondition = $("#ui_ddlAnswerCondition").val();
        }
        else {
            triggerMailSms.DependencyFormId = 0;
        }

        if ($("#ui_chkClosedNTimes").is(":checked")) {
            triggerMailSms.CloseCount = $("#ui_txtClosedNTimes").val();
            triggerMailSms.CloseCountSessionWiseOrOverAll = $("input:radio[name='CloseCountSessionWiseOrOverAll']:checked").val() == undefined ? false : true;
        }
        else {
            triggerMailSms.CloseCount = 0;
        }

        if ($("#ui_chkAddedToCart").is(":checked"))
            triggerMailSms.AddedProductsToCart = CreateWorkFlowRulesUtil.GetListDataBySpanId($("#ui_txtAddedToCartProducts_values"), "value", "").join(",");
        else
            triggerMailSms.AddedProductsToCart = "";

        if ($("#ui_chkViewedNotAddedToCart").is(":checked"))
            triggerMailSms.ViewedButNotAddedProductsToCart = CreateWorkFlowRulesUtil.GetListDataBySpanId($("#ui_txtViewedNotAddedToCartProducts_values"), "value", "").join(",");
        else
            triggerMailSms.ViewedButNotAddedProductsToCart = "";

        if ($("#ui_chkDropedFromCart").is(":checked"))
            triggerMailSms.DroppedProductsFromCart = CreateWorkFlowRulesUtil.GetListDataBySpanId($("#ui_txtDropedFromCartProducts_values"), "value", "").join(",");
        else
            triggerMailSms.DroppedProductsFromCart = "";

        if ($("#ui_chkCustomerPurchased").is(":checked"))
            triggerMailSms.PurchasedProducts = CreateWorkFlowRulesUtil.GetListDataBySpanId($("#ui_txtCustomerPurchasedProducts_values"), "value", "").join(",");
        else
            triggerMailSms.PurchasedProducts = "";

        if ($("#ui_chkCustomerNotPurchased").is(":checked"))
            triggerMailSms.NotPurchasedProducts = CreateWorkFlowRulesUtil.GetListDataBySpanId($("#ui_txtCustomerNotPurchasedProducts_values"), "value", "").join(",");
        else
            triggerMailSms.NotPurchasedProducts = "";

        if ($("#ui_chkTotalPurchaseIs").is(":checked")) {
            triggerMailSms.CustomerTotalPurchaseCondition = $("#ui_ddlCustomerTotalPurchase").val();
            triggerMailSms.CustomerTotalPurchase1 = $("#ui_txtCustomerTotalPurchase1").val();

            if ($("#ui_ddlCustomerTotalPurchase").val() == "3")
                triggerMailSms.CustomerTotalPurchase2 = $("#ui_txtCustomerTotalPurchase2").val();
            else
                triggerMailSms.CustomerTotalPurchase2 = 0;
        }
        else {
            triggerMailSms.CustomerTotalPurchase1 = triggerMailSms.CustomerTotalPurchaseCondition = triggerMailSms.CustomerTotalPurchase2 = 0;
        }

        if ($("#ui_chkCustomerCurrectValue").is(":checked")) {
            triggerMailSms.CustomerCurrentValueCondition = $("#ui_ddlCustomerCurrentValue").val();
            triggerMailSms.CustomerCurrentValue1 = $("#ui_txtCustomerCurrentValue1").val();

            if ($("#ui_ddlCustomerCurrentValue").val() == "3")
                triggerMailSms.CustomerCurrentValue2 = $("#ui_txtCustomerCurrentValue2").val();
            else
                triggerMailSms.CustomerCurrentValue2 = 0;
        }
        else {
            triggerMailSms.CustomerCurrentValue1 = triggerMailSms.CustomerCurrentValueCondition = triggerMailSms.CustomerCurrentValue2 = 0;
        }

        if ($("#ui_chkCustomerLastPurchase").is(":checked")) {
            triggerMailSms.LastPurchaseIntervalCondition = $("#ui_ddlLastPurchaseCondition").val();
            triggerMailSms.LastPurchaseIntervalRange1 = $("#ui_txtLastPurchaseRange1").val();

            if ($("#ui_ddlLastPurchaseCondition").val() == "3")
                triggerMailSms.LastPurchaseIntervalRange2 = $("#ui_txtLastPurchaseRange2").val();
            else
                triggerMailSms.LastPurchaseIntervalRange2 = 0;
        }
        else {
            triggerMailSms.LastPurchaseIntervalCondition = triggerMailSms.LastPurchaseIntervalRange1 = triggerMailSms.LastPurchaseIntervalRange2 = 0;
        }

        if ($("#ui_chkCategoriesAddedToCart").is(":checked"))
            triggerMailSms.AddedProductsCategoriesToCart = CreateWorkFlowRulesUtil.GetListDataBySpanId($("#ui_txtAddedToCartProductsCategories_values"), "value", "").join("|");
        else
            triggerMailSms.AddedProductsCategoriesToCart = "";

        if ($("#ui_chkCategoriesNotAddedToCart").is(":checked"))
            triggerMailSms.NotAddedProductsCategoriesToCart = CreateWorkFlowRulesUtil.GetListDataBySpanId($("#ui_txtNotAddedToCartProductsCategories_values"), "value", "").join("|");
        else
            triggerMailSms.NotAddedProductsCategoriesToCart = "";

        if ($("#ui_chkSubCategoriesAddedToCart").is(":checked"))
            triggerMailSms.AddedProductsSubCategoriesToCart = CreateWorkFlowRulesUtil.GetListDataBySpanId($("#ui_txtAddedToCartProductsSubCategories_values"), "value", "").join("|");
        else
            triggerMailSms.AddedProductsSubCategoriesToCart = "";

        if ($("#ui_chkSubCategoriesNotAddedToCart").is(":checked"))
            triggerMailSms.NotAddedProductsSubCategoriesToCart = CreateWorkFlowRulesUtil.GetListDataBySpanId($("#ui_txtNotAddedToCartProductsSubCategories_values"), "value", "").join("|");
        else
            triggerMailSms.NotAddedProductsSubCategoriesToCart = "";

        return triggerMailSms;
    },
    AssignInteractionEventData: function () {
        if ($("#ui_chkFormImpression").is(":checked")) {
            triggerMailSms.ImpressionEventForFormId = $("#ui_ddlFormImpression").val();
            triggerMailSms.ImpressionEventCountCondition = $("#ui_txtFormImpressionCount").val();
        }
        else {
            triggerMailSms.ImpressionEventForFormId = -1;
            triggerMailSms.ImpressionEventCountCondition = 0;
        }

        if ($("#ui_chkFormCloseEvent").is(":checked")) {
            triggerMailSms.CloseEventForFormId = $("#ui_ddlFormCloseEvent").val();
            triggerMailSms.CloseEventCountCondition = $("#ui_txtFormCloseEventCount").val();
        }
        else {
            triggerMailSms.CloseEventForFormId = -1;
            triggerMailSms.CloseEventCountCondition = 0;
        }

        if ($("#ui_chkResponseCountEvent").is(":checked")) {
            triggerMailSms.ResponsesEventForFormId = $("#ui_ddlResponseCountEvent").val();
            triggerMailSms.ResponsesEventCountCondition = $("#ui_txtResponseCountEventCount").val();
        }
        else {
            triggerMailSms.ResponsesEventForFormId = -1;
            triggerMailSms.ResponsesEventCountCondition = 0;
        }

        if ($("#ui_chkShowFormAtNTime").is(":checked"))
            triggerMailSms.ShowFormOnlyNthTime = $("#ui_txtShowFormAtNTime").val();
        else
            triggerMailSms.ShowFormOnlyNthTime = 0;

        return triggerMailSms;
    },
    AssignProfileData: function () {

        if ($("#ui_chkOnlineSentimentIs").is(":checked"))
            triggerMailSms.OnlineSentimentIs = $("#ui_ddlOnlineSentimentIs").val();
        else
            triggerMailSms.OnlineSentimentIs = 0;

        if ($("#ui_chkSocialStatusIs").is(":checked"))
            triggerMailSms.SocialStatusIs = $("#ui_ddlSocialStatus").val();
        else
            triggerMailSms.SocialStatusIs = 0;

        if ($("#ui_chkInfluentialScoreIs").is(":checked")) {
            triggerMailSms.InfluentialScoreCondition = $("#ui_ddlInfluentialScoreIs").val();
            triggerMailSms.InfluentialScore1 = $("#ui_txtInfluentialScore1").val();

            if ($("#ui_ddlInfluentialScoreIs").val() == "3")
                triggerMailSms.InfluentialScore2 = $("#ui_txtInfluentialScore2").val();
        }
        else {
            triggerMailSms.InfluentialScoreCondition = triggerMailSms.InfluentialScore2 = triggerMailSms.InfluentialScore1 = 0;
        }

        if ($("#ui_chkOfflineSentimentIs").is(":checked"))
            triggerMailSms.OfflineSentimentIs = $("#ui_ddlOfflineSentiment").val();
        else
            triggerMailSms.OfflineSentimentIs = 0;

        if ($("#ui_chkProductRatingIs").is(":checked"))
            triggerMailSms.ProductRatingIs = $("#ui_ddlRating").val();
        else
            triggerMailSms.ProductRatingIs = 0;

        if ($("#ui_chkProspectStatusIs").is(":checked"))
            triggerMailSms.NurtureStatusIs = $("#ui_ddlProspectStatus").val();
        else
            triggerMailSms.NurtureStatusIs = -1;

        if ($("#ui_chkProspectGenderIs").is(":checked"))
            triggerMailSms.GenderIs = $("#ui_ddlProspectGender").val();
        else
            triggerMailSms.GenderIs = "";

        if ($("#ui_chkMartialStatus").is(":checked"))
            triggerMailSms.MaritalStatusIs = $("#ui_ddlMartialStatus").val() != undefined ? parseInt($("#ui_ddlMartialStatus").val()) : 0;
        else
            triggerMailSms.MaritalStatusIs = 0;

        if ($("#ui_chkIndustryIs").is(":checked"))
            triggerMailSms.ProfessionIs = $("#ui_txtIndustryIs").val();
        else
            triggerMailSms.ProfessionIs = "";

        if ($("#ui_chkIsConnectedSocially").is(":checked"))
            triggerMailSms.NotConnectedSocially = $("#ui_ddlConnectedSocially").val();
        else
            triggerMailSms.NotConnectedSocially = 0;

        if ($("#ui_chkProspectLoyaltyIs").is(":checked")) {
            triggerMailSms.LoyaltyPointsCondition = $("#ui_ddlProspectLoyaltyIs").val();
            triggerMailSms.LoyaltyPointsRange1 = $("#ui_txtProspectLoyalty1").val();

            if ($("#ui_ddlProspectLoyaltyIs").val() == "3")
                triggerMailSms.LoyaltyPointsRange2 = $("#ui_txtProspectLoyalty2").val();
        }
        else {
            triggerMailSms.LoyaltyPointsCondition = triggerMailSms.LoyaltyPointsRange1 = triggerMailSms.LoyaltyPointsRange2 = 0;
        }

        if ($("#ui_chkRFMSScoreIs").is(":checked")) {
            triggerMailSms.RFMSScoreRangeCondition = $("#ui_ddlRFMSScore").val();
            triggerMailSms.RFMSScoreRange1 = $("#ui_txtRFMSScore1").val();

            if ($("#ui_ddlRFMSScore").val() == "3")
                triggerMailSms.RFMSScoreRange2 = $("#ui_txtRFMSScore2").val();
        }
        else {
            triggerMailSms.RFMSScoreRangeCondition = triggerMailSms.RFMSScoreRange1 = triggerMailSms.RFMSScoreRange2 = 0;
        }

        if ($("#ui_chkDOBIs").is(":checked")) {
            triggerMailSms.IsBirthDay = true;

            if ($("#chk_IgnoreDOB").is(":checked")) {
                triggerMailSms.IsDOBIgnored = true;
                triggerMailSms.IsDOBIgnoreCondition = $("#ui_ddlIgnoreDOB").val() == undefined ? 0 : 1;
            }
            else {
                triggerMailSms.IsDOBIgnored = triggerMailSms.IsDOBIgnoreCondition = 0;
            }

            if ($('input[name=DOB]:checked').val() == "0") {
                triggerMailSms.IsDOBTodayOrMonth = 0;
            }
            else if ($('input[name=DOB]:checked').val() == "1") {
                triggerMailSms.IsDOBTodayOrMonth = 1;
            }
            else if ($('input[name=DOB]:checked').val() == "2") {
                triggerMailSms.IsDOBTodayOrMonth = 2;
                triggerMailSms.DOBFromDate = $("#txtFromDate").val() == '' ? null : $("#txtFromDate").val();
                triggerMailSms.DOBToDate = $("#txtToDate").val() == '' ? null : $("#txtToDate").val();
                triggerMailSms.DOBDaysDiffernce = 0;
            }
            else if ($('input[name=DOB]:checked').val() == "3") {
                triggerMailSms.IsDOBTodayOrMonth = 3;
                triggerMailSms.DOBFromDate = triggerMailSms.DOBToDate = null;
                triggerMailSms.DOBDaysDiffernce = parseInt($("#ui_txtDOBNoofDays").val())
            }
        }
        else {
            triggerMailSms.IsBirthDay = false;
            triggerMailSms.IsDOBTodayOrMonth =triggerMailSms.DOBDaysDiffernce = 0;
            triggerMailSms.DOBFromDate = triggerMailSms.DOBToDate = null;
            triggerMailSms.IsDOBIgnored = false;
            triggerMailSms.IsDOBIgnoreCondition = 0;
        }

        return triggerMailSms;
    },
    GetListDataBySpanId: function (spanTag, valueType, replaceId) {
        var objectValues = new Array();
        spanTag.children().each(function () {
            var value = "";
            if (replaceId.length > 0)
                value = $(this).attr(valueType).replace(replaceId, "");
            else
                value = $(this).attr(valueType);

            objectValues.push(value);
        });
        return objectValues;
    },
    GetRuleDetails: function () {
        $.ajax({
            url: "/Journey/CreateRule/GetRuleDetails",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'RuleId': triggerMailSms.Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response && response.triggerMailSms != null && response.triggerMailSms != undefined) {
                    $(".wrkflweidt").html(response.triggerMailSms.TriggerHeading);
                    $("#wrkflwrulename").val(response.triggerMailSms.TriggerHeading);
                    triggerMailSms = response.triggerMailSms;
                    CreateWorkFlowRulesUtil.BindRuleDetails();
                }
            },
            error: ShowAjaxError
        });
    },
    BindRuleDetails: function () {
        CreateWorkFlowRulesUtil.BindAudienceData();
        CreateWorkFlowRulesUtil.BindBehaviorData();
        CreateWorkFlowRulesUtil.BindInteractionData();
        CreateWorkFlowRulesUtil.BindInteractionEventData();
        CreateWorkFlowRulesUtil.BindProfileData();
    },
    BindAudienceData: function () {
        if (triggerMailSms.IsLead > -1) {
            $("input:radio[name='VisitorType'][value='" + triggerMailSms.IsLead + "']").prop('checked', true);
            $("#ui_chkVisitorType").click();
        }

        if (triggerMailSms.IsBelong > 0) {
            $("input:radio[name='BelongsGroup'][value='" + triggerMailSms.IsBelong + "']").prop('checked', true);

            var groupsList = triggerMailSms.BelongsToGroup.split("@#");
            for (var i = 0; i < groupsList.length; i++) {
                var idAndLabel = groupsList[i].split("-");
                var data = new Array();
                data["item"] = new Array();
                data.item.value = idAndLabel[0];
                data.item.label = idAndLabel[1];

                CreateWorkFlowRulesUtil.AppendSelected("ui_txtGroups_values", data, "group");
            }
            $("#ui_chkSegment").click();
        }
    },
    BindBehaviorData: function () {

        if (triggerMailSms.BehavioralScoreCondition > 0) {
            $("#ui_ddlBehavioralScoreRange").val(triggerMailSms.BehavioralScoreCondition);
            $("#ui_VisitorScore1").val(triggerMailSms.BehavioralScore1);
            if ($("#ui_ddlBehavioralScoreRange").val() == "3") {
                $("#ui_VisitorScore2").val(triggerMailSms.BehavioralScore2);
                $("#ui_ddlBehavioralScoreRange").change();
            }
            $("#ui_chkBehavioralScore").click();
        }

        if (triggerMailSms.SessionIs > 0) {
            $("#ui_txtSession").val(triggerMailSms.SessionIs);

            if (triggerMailSms.SessionConditionIsTrueOrIsFalse == false)
                $("#ui_radSessionIsFalse").prop('checked', true);
            else
                $("#ui_radSessionIsTrue").prop('checked', true);

            $("#ui_chkSessionIs").click();
        }

        if (triggerMailSms.PageDepthIs > 0) {
            $("#ui_txtPageDepthIs").val(triggerMailSms.PageDepthIs);

            if (triggerMailSms.PageDepthConditionIsTrueOrIsFalse == false)
                $("#ui_radPageDepthIsFalse").prop('checked', true);
            else
                $("#ui_radPageDepthIsTrue").prop('checked', true);

            $("#ui_chkPageDepthIs").click();
        }

        if (triggerMailSms.NPageVisited > 0) {
            $("#ui_txtPageViewIs").val(triggerMailSms.NPageVisited);

            if (triggerMailSms.PageViewConditionIsTrueOrIsFalse == false)
                $("#ui_radPageViewIsFalse").prop('checked', true);
            else
                $("#ui_radPageViewIsTrue").prop('checked', true);

            $("#ui_chkPageViewIs").click();
        }

        if (triggerMailSms.FrequencyIs > 0) {
            $("#ui_txtFrequencyIs").val(triggerMailSms.FrequencyIs);

            if (triggerMailSms.FrequencyConditionIsTrueOrIsFalse == false)
                $("#ui_radFrequencyIsFalse").prop('checked', true);
            else
                $("#ui_radFrequencyIsTrue").prop('checked', true);

            $("#ui_chkFrequencyIs").click();
        }

        if (triggerMailSms.PageUrl != null && triggerMailSms.PageUrl.length > 0) {
            $("#ui_txtPageUrl").val(triggerMailSms.PageUrl);
            $("#ui_chkOnPageUrl").click();

            if (triggerMailSms.IsPageUrlContainsCondition == true)
                $("#ui_PageUrlCheckContains").prop("checked", true);
        }

        if (triggerMailSms.PageUrlParameters != null && triggerMailSms.PageUrlParameters.length > 0) {
            $("#ui_txtVisitorsVisitedPagesWithPageUrlParameter").val(triggerMailSms.PageUrlParameters);

            if (triggerMailSms.IsVisitorVisitedPagesWithPageUrlParameter == false)
                $("#ui_radPageUrlParamFalse").prop('checked', true);
            else
                $("#ui_radPageUrlParamIsTrue").prop('checked', true);

            $("#ui_chkVisitorsVisitedPagesWithPageUrlParameter").click();
        }

        if (triggerMailSms.IsReferrer > 0) {

            if (triggerMailSms.IsVisitorsSource == false)
                $("#ui_radSourceIsFalse").prop('checked', true);
            else
                $("#ui_radSourceIsTrue").prop('checked', true);

            $("#ui_chkSourceIs").click();

            if (triggerMailSms.IsReferrer == 1) {
                $("#ui_radSourceIsDirect").prop("checked", true);
            }
            else if (triggerMailSms.IsReferrer == 2) {

                $("#ui_radSourceIsReferrer").prop("checked", true);
                $("#dvSoureReferrer").show();
                $("#ui_txtSourceIs").val(triggerMailSms.ReferrerUrl);

                if (triggerMailSms.CheckSourceDomainOnly == 1)
                    $("#ui_chkCheckSourceDomainOnly").click();

                $("#dv_txtSoureReferrer").show();
                $("#dv_chkSoureReferrer").show();
            }
        }

        if (triggerMailSms.IsMailIsRespondent == true) {
            if (triggerMailSms.MailRespondentConditionIsTrueOrIsFalse == false) {
                $("#ui_radMailRespondentIsFalse").prop('checked', true);
                $("#ui_MailResponsedSpan").hide();
            }
            else {
                $("#ui_radMailRespondentIsTrue").prop('checked', true);
                $("#ui_MailResponsedSpan").show();
            }

            if (triggerMailSms.IsMailRespondentClickCondition)
                $("#ui_chkMailRespondentClick").prop('checked', true);
            else
                $("#ui_chkMailRespondentClick").prop('checked', false);

            var MailTemplateIdValues = [];

            if (triggerMailSms.MailRespondentTemplates != undefined && triggerMailSms.MailRespondentTemplates != null && triggerMailSms.MailRespondentTemplates != "") {
                var mailvalues = triggerMailSms.MailRespondentTemplates.split(",");
                for (var i = 0; i < mailvalues.length; i++) {
                    MailTemplateIdValues.push(mailvalues[i]);
                }
                $("#ui_ddlMailRespondentTemplate").val(MailTemplateIdValues).trigger("change");
            }

            $("#ui_chkIsMailRespondent").click();
        }

        if (triggerMailSms.IsSmsIsRespondent == true) {
            if (triggerMailSms.SmsRespondentConditionIsTrueOrIsFalse == false)
                $("#ui_radSmsRespondentIsFalse").prop('checked', true);
            else
                $("#ui_radSmsRespondentIsTrue").prop('checked', true);

            var SmsTemplateIdValues = [];

            if (triggerMailSms.SmsRespondentTemplates != undefined && triggerMailSms.SmsRespondentTemplates != null && triggerMailSms.SmsRespondentTemplates != "") {
                var smsvalues = triggerMailSms.SmsRespondentTemplates.split(",");
                for (var i = 0; i < smsvalues.length; i++) {
                    SmsTemplateIdValues.push(smsvalues[i]);
                }
                $("#ui_ddlSmsRespondentTemplate").val(SmsTemplateIdValues).trigger("change");
            }

            $("#ui_chkIsSmsRespondent").click();
        }

        if (triggerMailSms.SearchString != null && triggerMailSms.SearchString.length > 0) {
            $("#ui_txtSearchKeyword").val(triggerMailSms.SearchString);
            $("#ui_chkSearchKeywordIs").click();
        }

        if (triggerMailSms.Country != null && triggerMailSms.Country.length > 0) {
            var countryList = triggerMailSms.Country.split("@$");

            var CountryIdValues = [];

            for (var i = 0; i < countryList.length; i++) {
                CountryIdValues.push(countryList[i]);
            }

            $("#ui_txtCountry").val(CountryIdValues).trigger("change");

            if (triggerMailSms.CountryConditionIsTrueOrIsFalse == false)
                $("#ui_radCountryIsFalse").prop('checked', true);
            else
                $("#ui_radCountryIsTrue").prop('checked', true);

            $("#ui_chkCountryIs").click();
        }

        if (triggerMailSms.StateName != null && triggerMailSms.StateName.length > 0) {
            var stateList = triggerMailSms.StateName.split("@$");
            for (var i = 0; i < stateList.length; i++) {

                var data = new Array();
                data["item"] = new Array();
                data.item.value = stateList[i];
                data.item.label = stateList[i];
                CreateWorkFlowRulesUtil.AppendSelected("ui_txtState_values", data, "");
            }

            if (triggerMailSms.StateConditionIsTrueOrIsFalse == false)
                $("#ui_radStateIsFalse").prop('checked', true);
            else
                $("#ui_radStateIsTrue").prop('checked', true);

            $("#ui_chkStateIs").click();
        }

        if (triggerMailSms.City != null && triggerMailSms.City.length > 0) {
            var cityList = triggerMailSms.City.split("@$");
            for (var i = 0; i < cityList.length; i++) {

                var data = new Array();
                data["item"] = new Array();
                data.item.value = cityList[i];
                data.item.label = cityList[i];
                CreateWorkFlowRulesUtil.AppendSelected("ui_txtCity_values", data, "");
            }

            if (triggerMailSms.CityConditionIsTrueOrIsFalse == false)
                $("#ui_radCityIsFalse").prop('checked', true);
            else
                $("#ui_radCityIsTrue").prop('checked', true);

            $("#ui_chkCityIs").click();
        }

        if (triggerMailSms.AlreadyVisitedPages != null && triggerMailSms.AlreadyVisitedPages.length > 0) {
            $("#ui_txtAlreadyVisitedPageUrls").val(triggerMailSms.AlreadyVisitedPages);
            $("#ui_chkAlreadyVisitedPages").click();


            if (triggerMailSms.IsVisitedPagesContainsCondition)
                $("#ui_AlreadyPageUrlCheckContains").prop('checked', true);
            else
                $("#ui_AlreadyPageUrlCheckContains").prop('checked', false);

            if (triggerMailSms.AlreadyVisitedPagesOverAllOrSessionWise == 0)
                $("#ui_radPageViewOverAll").prop('checked', true);
            else
                $("#ui_radPageViewSessionWise").prop('checked', true);
        }

        if (triggerMailSms.AlreadyVisitedWithPageUrlParameters != null && triggerMailSms.AlreadyVisitedWithPageUrlParameters.length > 0) {
            $("#ui_txtVisitorsAlreadyVisitedPagesWithPageUrlParameter").val(triggerMailSms.AlreadyVisitedWithPageUrlParameters);
            $("#ui_chkVisitorsAlreadyVisitedPagesWithPageUrlParameter").click();
        }


        if (triggerMailSms.NotAlreadyVisitedPages != null && triggerMailSms.NotAlreadyVisitedPages.length > 0) {
            $("#ui_txtNotAlreadyVisitedPageUrls").val(triggerMailSms.NotAlreadyVisitedPages);
            $("#ui_chkNotAlreadyVisitedPages").click();

            if (triggerMailSms.IsNotVisitedPagesContainsCondition)
                $("#ui_NotAlreadyPageUrlCheckContains").prop('checked', true);
            else
                $("#ui_NotAlreadyPageUrlCheckContains").prop('checked', false);

            if (triggerMailSms.NotAlreadyVisitedPagesOverAllOrSessionWise == 0)
                $("#ui_radNotPageViewOverAll").prop('checked', true);
            else
                $("#ui_radNotPageViewSessionWise").prop('checked', true);
        }

        if (triggerMailSms.NotAlreadyVisitedWithPageUrlParameters != null && triggerMailSms.NotAlreadyVisitedWithPageUrlParameters.length > 0) {
            $("#ui_txtVisitorsNotAlreadyVisitedPagesWithPageUrlParameter").val(triggerMailSms.NotAlreadyVisitedWithPageUrlParameters);
            $("#ui_chkVisitorsNotAlreadyVisitedPagesWithPageUrlParameter").click();
        }

        if (triggerMailSms.OverAllTimeSpentInSite > 0) {
            $("#ui_txtTimeSpentInSite").val(triggerMailSms.OverAllTimeSpentInSite);
            $("#ui_chkTimeSpentInSite").click();
        }

        if (triggerMailSms.IsMobileDevice > 0) {

            if (triggerMailSms.IsMobileDevice == 1)
                $("#ui_radMobileDeviceConditionIsTrue").prop('checked', true);
            else
                $("#ui_radMobileDeviceConditionIsFalse").prop('checked', true);

            $("#ui_chkIsAndriodMobile").click();
        }
    },
    BindInteractionData: function () {

        if (triggerMailSms.IsClickedSpecificButtons != null && triggerMailSms.IsClickedSpecificButtons.length > 0) {

            var clickedTags = triggerMailSms.IsClickedSpecificButtons.split(",");
            for (var i = 0; i < clickedTags.length; i++) {

                var idAndLabel = clickedTags[i]
                var data = new Array();
                data["item"] = new Array();
                data.item.value = idAndLabel;
                data.item.label = idAndLabel;
                CreateWorkFlowRulesUtil.AppendSelected("ui_txtClickButton_values", data, "clkBtn");
            }
            $("#ui_chkClickedButton").click();
        }

        if (triggerMailSms.IsNotClickedSpecificButtons != null && triggerMailSms.IsNotClickedSpecificButtons.length > 0) {

            var clickedTags = triggerMailSms.IsNotClickedSpecificButtons.split(",");
            for (var i = 0; i < clickedTags.length; i++) {

                var idAndLabel = clickedTags[i]
                var data = new Array();
                data["item"] = new Array();
                data.item.value = idAndLabel;
                data.item.label = idAndLabel;
                CreateWorkFlowRulesUtil.AppendSelected("ui_txtNotClickButton_values", data, "clkBtn");
            }
            $("#ui_chkNotClickedButton").click();
        }

        if (triggerMailSms.ClickedPriceRangeProduct != null && triggerMailSms.ClickedPriceRangeProduct.length > 0) {

            var products = triggerMailSms.ClickedPriceRangeProduct.split(",");
            for (var i = 0; i < products.length; i++) {
                var idAndLabel = products[i]
                var data = new Array();
                data["item"] = new Array();
                data.item.value = idAndLabel
                data.item.label = idAndLabel

                CreateWorkFlowRulesUtil.AppendSelected("ui_txtPriceRangeProducts_values", data, "ClickProduct");
            }
            $("#ui_chkClickedPriceRange").click();
        }

        if (triggerMailSms.IsVisitorRespondedChat == true)
            $("#ui_chkRespondedInChat").click();

        if (triggerMailSms.MailCampignResponsiveStage > 0) {
            $("#ui_ddlMailScore").val(triggerMailSms.MailCampignResponsiveStage);
            $("#ui_chkMailResponseStage").click();
        }

        if (triggerMailSms.IsRespondedForm > 0) {
            $("#ui_ddlRespondedFroms").select2().val(triggerMailSms.IsRespondedForm).change();
            $("#ui_chkRespondedForm").click();
        }

        if (triggerMailSms.IsNotRespondedForm > 0) {
            $("#ui_ddlNotRespondedFroms").select2().val(triggerMailSms.IsNotRespondedForm).change();
            $("#ui_chkNotRespondedForm").click();
        }

        if (triggerMailSms.DependencyFormId > 0) {
            $("#ui_ddlAnswerDependencyFroms").select2().val(triggerMailSms.DependencyFormId).change();
            $("#ui_ddlAnswerCondition").val(triggerMailSms.DependencyFormCondition)
            $("#ui_txtAnswerCondition1").val(triggerMailSms.DependencyFormAnswer1);

            if ($("#ui_ddlAnswerCondition").val() == "3") {
                $("#ui_txtAnswerCondition2").val(triggerMailSms.DependencyFormAnswer2);
                $("#ui_ddlAnswerCondition").change();
            }
            $("#ui_chkAnswerDependencyForm").click();
        }

        if (triggerMailSms.CloseCount > 0) {
            $("#ui_txtClosedNTimes").val(triggerMailSms.CloseCount);

            if (triggerMailSms.CloseCountSessionWiseOrOverAll == true)
                $("#ui_radCloseCountOverAll").prop('checked', true);
            else
                $("#ui_radCloseCountSessionWise").prop('checked', true);

            $("#ui_chkClosedNTimes").click();
        }

        if (triggerMailSms.AddedProductsToCart != null && triggerMailSms.AddedProductsToCart.length > 0) {

            var products = triggerMailSms.AddedProductsToCart.split("@#");
            for (var i = 0; i < products.length; i++) {
                var idAndLabel = products[i].split("-");
                var data = new Array();
                data["item"] = new Array();
                data.item.value = idAndLabel[0];
                data.item.label = idAndLabel[1];
                CreateWorkFlowRulesUtil.AppendSelected("ui_txtAddedToCartProducts_values", data, "AddedToCart");
            }
            $("#ui_chkAddedToCart").click();
        }

        if (triggerMailSms.ViewedButNotAddedProductsToCart != null && triggerMailSms.ViewedButNotAddedProductsToCart.length > 0) {

            var products = triggerMailSms.ViewedButNotAddedProductsToCart.split("@#");
            for (var i = 0; i < products.length; i++) {
                var idAndLabel = products[i].split("-");
                var data = new Array();
                data["item"] = new Array();
                data.item.value = idAndLabel[0];
                data.item.label = idAndLabel[1];

                CreateWorkFlowRulesUtil.AppendSelected("ui_txtViewedNotAddedToCartProducts_values", data, "NotAddedToCart");
            }
            $("#ui_chkViewedNotAddedToCart").click();
        }

        if (triggerMailSms.DroppedProductsFromCart != null && triggerMailSms.DroppedProductsFromCart.length > 0) {

            var products = triggerMailSms.DroppedProductsFromCart.split("@#");
            for (var i = 0; i < products.length; i++) {
                var idAndLabel = products[i].split("-");
                var data = new Array();
                data["item"] = new Array();
                data.item.value = idAndLabel[0];
                data.item.label = idAndLabel[1];

                CreateWorkFlowRulesUtil.AppendSelected("ui_txtDropedFromCartProducts_values", data, "DropFromCart");
            }
            $("#ui_chkDropedFromCart").click();
        }

        if (triggerMailSms.PurchasedProducts != null && triggerMailSms.PurchasedProducts.length > 0) {
            var products = triggerMailSms.PurchasedProducts.split("@#");
            for (var i = 0; i < products.length; i++) {
                var idAndLabel = products[i].split("-");
                var data = new Array();
                data["item"] = new Array();
                data.item.value = idAndLabel[0];
                data.item.label = idAndLabel[1];

                CreateWorkFlowRulesUtil.AppendSelected("ui_txtCustomerPurchasedProducts_values", data, "Purchase");
            }
            $("#ui_chkCustomerPurchased").click();
        }

        if (triggerMailSms.NotPurchasedProducts != null && triggerMailSms.NotPurchasedProducts.length > 0) {

            var products = triggerMailSms.NotPurchasedProducts.split("@#");
            for (var i = 0; i < products.length; i++) {
                var idAndLabel = products[i].split("-");
                var data = new Array();
                data["item"] = new Array();
                data.item.value = idAndLabel[0];
                data.item.label = idAndLabel[1];
                CreateWorkFlowRulesUtil.AppendSelected("ui_txtCustomerNotPurchasedProducts_values", data, "NotPurchase");
            }
            $("#ui_chkCustomerNotPurchased").click();
        }

        if (triggerMailSms.CustomerTotalPurchaseCondition > 0) {
            $("#ui_ddlCustomerTotalPurchase").val(triggerMailSms.CustomerTotalPurchaseCondition);
            $("#ui_txtCustomerTotalPurchase1").val(triggerMailSms.CustomerTotalPurchase1);
            if ($("#ui_ddlCustomerTotalPurchase").val() == "3") {
                $("#ui_txtCustomerTotalPurchase2").val(triggerMailSms.CustomerTotalPurchase2);
                $("#ui_ddlCustomerTotalPurchase").change();
            }
            $("#ui_chkTotalPurchaseIs").click();
        }

        if (triggerMailSms.CustomerCurrentValueCondition > 0) {
            $("#ui_ddlCustomerCurrentValue").val(triggerMailSms.CustomerCurrentValueCondition);
            $("#ui_txtCustomerCurrentValue1").val(triggerMailSms.CustomerCurrentValue1);
            if ($("#ui_ddlCustomerCurrentValue").val() == "3") {
                $("#ui_txtCustomerCurrentValue2").val(triggerMailSms.CustomerCurrentValue2);
                $("#ui_ddlCustomerCurrentValue").change();
            }
            $("#ui_chkCustomerCurrectValue").click();
        }

        if (triggerMailSms.LastPurchaseIntervalCondition > 0) {
            $("#ui_ddlLastPurchaseCondition").val(triggerMailSms.LastPurchaseIntervalCondition);
            $("#ui_txtLastPurchaseRange1").val(triggerMailSms.LastPurchaseIntervalRange1);
            if ($("#ui_ddlLastPurchaseCondition").val() == "3") {
                $("#ui_txtLastPurchaseRange2").val(triggerMailSms.LastPurchaseIntervalRange2);
                $("#ui_ddlLastPurchaseCondition").change();
            }
            $("#ui_chkCustomerLastPurchase").click();
        }

        if (triggerMailSms.AddedProductsCategoriesToCart != null && triggerMailSms.AddedProductsCategoriesToCart.length > 0) {

            var products = triggerMailSms.AddedProductsCategoriesToCart.split("|");
            for (var i = 0; i < products.length; i++) {
                var data = new Array();
                data["item"] = new Array();
                data.item.value = products[i];
                data.item.label = products[i];

                CreateWorkFlowRulesUtil.AppendSelected("ui_txtAddedToCartProductsCategories_values", data, "CategoriesAddedToCart");
            }
            $("#ui_chkCategoriesAddedToCart").click();
        }

        if (triggerMailSms.NotAddedProductsCategoriesToCart != null && triggerMailSms.NotAddedProductsCategoriesToCart.length > 0) {

            var products = triggerMailSms.NotAddedProductsCategoriesToCart.split("|");
            for (var i = 0; i < products.length; i++) {
                var data = new Array();
                data["item"] = new Array();
                data.item.value = products[i];
                data.item.label = products[i];

                CreateWorkFlowRulesUtil.AppendSelected("ui_txtNotAddedToCartProductsCategories_values", data, "CategoriesnotAddedToCart");
            }

            $("#ui_chkCategoriesNotAddedToCart").click();
        }

        if (triggerMailSms.AddedProductsSubCategoriesToCart != null && triggerMailSms.AddedProductsSubCategoriesToCart.length > 0) {

            var products = triggerMailSms.AddedProductsSubCategoriesToCart.split("|");
            for (var i = 0; i < products.length; i++) {
                var data = new Array();
                data["item"] = new Array();
                data.item.value = products[i];
                data.item.label = products[i];

                CreateWorkFlowRulesUtil.AppendSelected("ui_txtAddedToCartProductsSubCategories_values", data, "SubCategoriesAddedToCart");
            }
            $("#ui_chkSubCategoriesAddedToCart").click();
        }

        if (triggerMailSms.NotAddedProductsSubCategoriesToCart != null && triggerMailSms.NotAddedProductsSubCategoriesToCart.length > 0) {

            var products = triggerMailSms.NotAddedProductsSubCategoriesToCart.split("|");
            for (var i = 0; i < products.length; i++) {
                var data = new Array();
                data["item"] = new Array();
                data.item.value = products[i];
                data.item.label = products[i];

                CreateWorkFlowRulesUtil.AppendSelected("ui_txtNotAddedToCartProductsSubCategories_values", data, "SubCategoriesnotAddedToCart");
            }
            $("#ui_chkSubCategoriesNotAddedToCart").click();
        }
    },
    BindInteractionEventData: function () {

        if (triggerMailSms.ImpressionEventForFormId > -1) {
            $("#ui_ddlFormImpression").select2().val(triggerMailSms.ImpressionEventForFormId).change();
            $("#ui_txtFormImpressionCount").val(triggerMailSms.ImpressionEventCountCondition);
            $("#ui_chkFormImpression").click();
        }

        if (triggerMailSms.CloseEventForFormId > -1) {
            $("#ui_ddlFormCloseEvent").select2().val(triggerMailSms.CloseEventForFormId).change();
            $("#ui_txtFormCloseEventCount").val(triggerMailSms.CloseEventCountCondition);
            $("#ui_chkFormCloseEvent").click();
        }

        if (triggerMailSms.ResponsesEventForFormId > -1) {
            $("#ui_ddlResponseCountEvent").select2().val(triggerMailSms.ResponsesEventForFormId).change();
            $("#ui_txtResponseCountEventCount").val(triggerMailSms.ResponsesEventCountCondition);
            $("#ui_chkResponseCountEvent").click();
        }

        if (triggerMailSms.ShowFormOnlyNthTime > 0) {
            $("#ui_txtShowFormAtNTime").val(triggerMailSms.ShowFormOnlyNthTime);
            $("#ui_chkShowFormAtNTime").click();
        }
    },
    BindProfileData: function () {

        if (triggerMailSms.OnlineSentimentIs > 0) {
            $("#ui_ddlOnlineSentimentIs").val(triggerMailSms.OnlineSentimentIs);
            $("#ui_chkOnlineSentimentIs").click();
        }

        if (triggerMailSms.SocialStatusIs > 0) {
            $("#ui_ddlSocialStatus").val(triggerMailSms.SocialStatusIs);
            $("#ui_chkSocialStatusIs").click();
        }

        if (triggerMailSms.InfluentialScoreCondition > 0) {
            $("#ui_ddlInfluentialScoreIs").val(triggerMailSms.InfluentialScoreCondition);
            $("#ui_txtInfluentialScore1").val(triggerMailSms.InfluentialScore1);
            if ($("#ui_ddlInfluentialScoreIs").val() == "3") {
                $("#ui_txtInfluentialScore2").val(triggerMailSms.InfluentialScore2);
                $("#ui_ddlInfluentialScoreIs").change();
            }
            $("#ui_chkInfluentialScoreIs").click();
        }

        if (triggerMailSms.OfflineSentimentIs > 0) {
            $("#ui_ddlOfflineSentiment").val(triggerMailSms.OfflineSentimentIs);
            $("#ui_chkOfflineSentimentIs").click();
        }

        if (triggerMailSms.ProductRatingIs > 0) {
            $("#ui_ddlRating").val(triggerMailSms.ProductRatingIs);
            $("#ui_chkProductRatingIs").click();
        }

        if (triggerMailSms.NurtureStatusIs > -1) {
            $("#ui_ddlProspectStatus").val(triggerMailSms.NurtureStatusIs);
            $("#ui_chkProspectStatusIs").click();
        }

        if (triggerMailSms.GenderIs != null && triggerMailSms.GenderIs.length > 0) {
            $("#ui_ddlProspectGender").val(triggerMailSms.GenderIs);
            $("#ui_chkProspectGenderIs").click();
        }

        if (triggerMailSms.MaritalStatusIs != null && triggerMailSms.MaritalStatusIs > 0) {
            $("#ui_ddlMartialStatus").val(triggerMailSms.MaritalStatusIs);
            $("#ui_chkMartialStatus").click();
        }

        if (triggerMailSms.ProfessionIs != null && triggerMailSms.ProfessionIs.length > 0) {
            $("#ui_txtIndustryIs").val(triggerMailSms.ProfessionIs);
            $("#ui_chkIndustryIs").click();
        }

        if (triggerMailSms.NotConnectedSocially > 0) {
            $("#ui_ddlConnectedSocially").val(triggerMailSms.NotConnectedSocially);
            $("#ui_chkIsConnectedSocially").click();
        }

        if (triggerMailSms.LoyaltyPointsCondition > 0) {
            $("#ui_ddlProspectLoyaltyIs").val(triggerMailSms.LoyaltyPointsCondition);
            $("#ui_txtProspectLoyalty1").val(triggerMailSms.LoyaltyPointsRange1);
            if ($("#ui_ddlProspectLoyaltyIs").val() == "3") {
                $("#ui_txtProspectLoyalty2").val(triggerMailSms.LoyaltyPointsRange2);
                $("#ui_ddlProspectLoyaltyIs").change();
            }
            $("#ui_chkProspectLoyaltyIs").click();
        }

        if (triggerMailSms.RFMSScoreRangeCondition > 0) {
            $("#ui_ddlRFMSScore").val(triggerMailSms.RFMSScoreRangeCondition);
            $("#ui_txtRFMSScore1").val(triggerMailSms.RFMSScoreRange1);
            if ($("#ui_ddlRFMSScore").val() == "3") {
                $("#ui_txtRFMSScore2").val(triggerMailSms.RFMSScoreRange2);
                $("#ui_ddlRFMSScore").change();
            }
            $("#ui_chkRFMSScoreIs").click();
        }

        if (triggerMailSms.IsBirthDay != false) {

            if (triggerMailSms.IsDOBTodayOrMonth == 0) {
                $("#ui_rdbtnDay").prop('checked', true);
            }
            else if (triggerMailSms.IsDOBTodayOrMonth == 1) {
                $("#ui_rdbtnMonth").prop('checked', true);
                $("#ui_rdbtnMonth").click();
            }
            else if (triggerMailSms.IsDOBTodayOrMonth == 2 && triggerMailSms.DOBFromDate != null && triggerMailSms.DOBFromDate != "" && triggerMailSms.DOBFromDate.length > 0 && triggerMailSms.DOBToDate != null && triggerMailSms.DOBToDate != "" && triggerMailSms.DOBToDate.length > 0) {
                $("#ui_rdbtnDates").prop('checked', true);
                $("#ui_rdbtnDates").click();
                var FromDate = GetJavaScriptDateObj(triggerMailSms.DOBFromDate)
                FromDate = FromDate.getFullYear() + "-" + ((FromDate.getMonth() + 1).toString().length == 1 ? "0" + (FromDate.getMonth() + 1) : (FromDate.getMonth() + 1)) + "-" + (FromDate.getDate().toString().length == 1 ? "0" + FromDate.getDate() : FromDate.getDate());
                $("#txtFromDate").val(FromDate);
                var ToDate = GetJavaScriptDateObj(triggerMailSms.DOBToDate)
                ToDate = ToDate.getFullYear() + "-" + ((ToDate.getMonth() + 1).toString().length == 1 ? "0" + (ToDate.getMonth() + 1) : (ToDate.getMonth() + 1)) + "-" + (ToDate.getDate().toString().length == 1 ? "0" + ToDate.getDate() : ToDate.getDate());
                $("#txtToDate").val(ToDate);
            }
            else if (triggerMailSms.IsDOBTodayOrMonth == 3 && triggerMailSms.DOBDaysDiffernce != null && triggerMailSms.DOBDaysDiffernce != "" && triggerMailSms.DOBDaysDiffernce != undefined && triggerMailSms.DOBDaysDiffernce != 0) {
                $("#ui_rdbtnDayDiff").prop('checked', true);
                $("#ui_rdbtnDayDiff").click();
                var DiffDate = CreateWorkFlowRulesUtil.GetDifferenceDateValue(new Date(), triggerMailSms.DOBDaysDiffernce)
                $("#ui_txtDOBNoofDays").val(triggerMailSms.DOBDaysDiffernce);
                $("#txtDiffDate").val(DiffDate);
            }

            if (triggerMailSms.IsDOBIgnored == true) {
                $("#chk_IgnoreDOB").prop('checked', true);
                $("#ui_ddlIgnoreDOB").val(triggerMailSms.IsDOBIgnoreCondition);
            }

            $("#dv_IgnoreCondition").show();
            $("#ui_chkDOBIs").click();
        }
    },
    IntializeAutoComplete: function (fieldId, methodUrl, minLength, appendObject, extraFieldId) {
        $("#" + fieldId).autocomplete({
            autoFocus: true,
            minLength: minLength,
            source: function (request, response) {
                var value = $("#" + fieldId).val()
                $.ajax({
                    url: methodUrl,
                    data: JSON.stringify({ 'value': value }),
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataFilter: function (data) { return data; },
                    success: function (data) {
                        if (data.length > 0) {
                            response($.map(data, function (item) {
                                return {
                                    label: item.label,
                                    value: item.value + ""
                                }
                            }))
                        }
                    }
                });
            },
            select: function (events, selectedItem) {
                CreateWorkFlowRulesUtil.AppendSelected(appendObject, selectedItem, extraFieldId);
            },
            close: function (event, ui) {
                $(this).val("");
            }
        });
    },
}

$("#ui_ddlSmsRespondentTemplate, #ui_ddlMailRespondentTemplate, #ui_txtCountry, #ui_ddlRespondedFroms, #ui_ddlNotRespondedFroms, #ui_ddlAnswerDependencyFroms, #ui_ddlFormCloseEvent, #ui_ddlFormImpression, #ui_ddlResponseCountEvent").select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$("input:radio[name=DOB]").click(function () {
    $("#txtFromDate,#txtToDate,#txtDiffDate,#ui_txtDOBNoofDays").val("");
    $("#ui_ddlIgnoreDOB").val(0);

    if ($("#ui_rdbtnDay").is(":checked")) {
        $("#dv_IgnoreCondition").addClass("hideDiv");
        $("#chk_IgnoreDOB").prop("checked", false);
        $("#dvDOBDayDifference").addClass("hideDiv");
        $("#dvVisitorDateRange").addClass("hideDiv");
    }
    else if ($("#ui_rdbtnMonth").is(":checked")) {
        $("#dvDOBDayDifference").addClass("hideDiv");
        $("#dvVisitorDateRange").addClass("hideDiv");
        $("#dv_IgnoreCondition").removeClass("hideDiv");
    }
    else if ($("#ui_rdbtnDates").is(":checked")) {
        $("#dvVisitorDateRange").removeClass("hideDiv");
        $("#dv_IgnoreCondition").removeClass("hideDiv");
        $("#dvDOBDayDifference").addClass("hideDiv");
    }
    else if ($("#ui_rdbtnDayDiff").is(":checked")) {
        $("#dvVisitorDateRange").addClass("hideDiv");
        $("#dv_IgnoreCondition").removeClass("hideDiv");
        $("#dvDOBDayDifference").removeClass("hideDiv");
    }
});

$("#ui_txtDOBNoofDays").change(function () {
    if ($("#ui_txtDOBNoofDays").val() != null && $("#ui_txtDOBNoofDays").val() != 0 && $("#ui_txtDOBNoofDays").val().length > 0) {
        var utcdate = new Date().toJSON().slice(0, 10);
        var pastorfuturedate = CreateWorkFlowRulesUtil.GetDifferenceDateValue(utcdate, $("#ui_txtDOBNoofDays").val());
        $("#txtDiffDate").val(pastorfuturedate);
    }
    else {
        $("#txtDiffDate").val("");
    }
});

$("#ui_ddlBehavioralScoreRange").change(function () {
    if ($(this).val() == "3")
        $("#ui_VisitorScore2").show();
    else
        $("#ui_VisitorScore2").hide();
});

$("#ui_ddlInfluentialScoreIs").change(function () {
    if ($(this).val() == "3")
        $("#ui_txtInfluentialScore2").show();
    else
        $("#ui_txtInfluentialScore2").hide();
});

$("#ui_ddlProspectLoyaltyIs").change(function () {
    if ($(this).val() == "3")
        $("#ui_txtProspectLoyalty2").show();
    else
        $("#ui_txtProspectLoyalty2").hide();
});

$("#ui_ddlRFMSScore").change(function () {
    if ($(this).val() == "3")
        $("#ui_txtRFMSScore2").show();
    else
        $("#ui_txtRFMSScore2").hide();
});

$("#ui_ddlCustomerTotalPurchase").change(function () {
    if ($(this).val() == "3")
        $("#ui_txtCustomerTotalPurchase2").show();
    else
        $("#ui_txtCustomerTotalPurchase2").hide();
});

$("#ui_ddlCustomerCurrentValue").change(function () {
    if ($(this).val() == "3")
        $("#ui_txtCustomerCurrentValue2").show();
    else
        $("#ui_txtCustomerCurrentValue2").hide();
});

$("#ui_ddlLastPurchaseCondition").change(function () {
    if ($(this).val() == "3")
        $("#ui_txtLastPurchaseRange2").show();
    else
        $("#ui_txtLastPurchaseRange2").hide();
});

$("#ui_ddlAnswerDependencyFroms").change(function (value) {
    $("#trAnswerDependency").removeClass("hideDiv");
    $("#ui_dvAnswerDependencyFields").html("");

    if ($("#ui_ddlAnswerDependencyFroms").get(0).selectedIndex > 0) {
        var FormId = $(this).val();
        CreateWorkFlowRulesUtil.BindFormFields(FormId);
    }
});

$("#ui_ddlAnswerCondition").change(function () {
    if ($(this).val() == "3")
        $("#ui_txtAnswerCondition2").show();
    else
        $("#ui_txtAnswerCondition2").hide();
});

$("input:radio[name=Source]").click(function () {
    if ($("#ui_radSourceIsReferrer").is(":checked")) {
        $("#dv_txtSoureReferrer").show();
        $("#dv_chkSoureReferrer").show();
    }
    else {
        $("#dv_txtSoureReferrer").hide();
        $("#dv_chkSoureReferrer").hide();
    }
});

$("input:radio[name='VisitorType']").click(function () {
    if ($("#ui_radUnknown").is(":checked"))
        $(".isKnown").addClass("BlurAndOpacity")
    else
        $(".isKnown").removeClass("BlurAndOpacity")
});

$("#ui_span_EditRuleNmae").click(function () {
    $(".popupcontainer").removeClass("hideDiv");
});

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
});

$("#ui_btn_AddRuleName").click(function () {
    if ($("#wrkflwrulename").val().length === 0) {
        ShowErrorMessage(GlobalErrorList.Journey_CreateRules.AddRuleName_Error);
        $("#wrkflwrulename").focus();
        return false;
    }
    $(".wrkflweidt").html(CleanText($("#wrkflwrulename").val()));
    $(".popupcontainer").addClass("hideDiv");
});

$(".trigrultabitem").click(function () {
    $(".trigrultabitem").removeClass("active");
    $(this).addClass("active");
    var tabtit = $(this).attr("data-ruletab");
    $(".ruletabdetWrap").addClass("hideDiv");
    $("#" + tabtit).removeClass("hideDiv");
});

$(".checkrulqus").click(function () {
    $(this).parents(".rulemainchkbxWrap").next().toggleClass('hideDiv');
    var checkbyaudicount = $('#byaduience .checkrulqus').filter(':checked').length;
    var checkbybehcount = $('#bybehaviour .checkrulqus').filter(':checked').length;
    var checkbyintercount = $('#byinteraction .checkrulqus').filter(':checked').length;
    var checkbyeventcount = $('#byevent .checkrulqus').filter(':checked').length;
    var checkbyprofcount = $('#byprofile .checkrulqus').filter(':checked').length;
    $('.rulecountaudi').html(checkbyaudicount);
    $(".rulecountbeh").html(checkbybehcount);
    $(".rulecountinteract").html(checkbyintercount);
    $(".rulecountevnt").html(checkbyeventcount);
    $(".rulecountprof").html(checkbyprofcount);
});

$("#ui_btn_SaveWorkflowRule").click(function () {
    ShowPageLoading();
    if (!CreateWorkFlowRulesUtil.ValidateRules()) {
        HidePageLoading();
        return false;
    }
    CreateWorkFlowRulesUtil.GetRulesData();
});

$('#selectrule').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$("#selectrule").change(function () {
    if ($(this).get(0).selectedIndex > 0) {
        var checkedvalue = $("#selectrule option:selected").val();

        var subdetails = checkedvalue.split("$");

        if (subdetails[1] != undefined && subdetails[1] != "" && subdetails[1] != null && subdetails[1].length > 0) {

            $(".trigrultabitem").removeClass("active");
            $(".ruletabdetWrap").addClass("hideDiv");

            if (subdetails[1] == "Category1") {
                $("div[data-ruletab ='byaduience']").addClass('active');
                $("#byaduience").removeClass("hideDiv");
            }
            else if (subdetails[1] == "Category2") {
                $("div[data-ruletab ='bybehaviour']").addClass('active');
                $("#bybehaviour").removeClass("hideDiv");
            }
            else if (subdetails[1] == "Category3") {
                $("div[data-ruletab ='byinteraction']").addClass('active');
                $("#byinteraction").removeClass("hideDiv");
            }
            else if (subdetails[1] == "Category4") {
                $("div[data-ruletab ='byevent']").addClass('active');
                $("#byevent").removeClass("hideDiv");
            }
            else if (subdetails[1] == "Category5") {
                $("div[data-ruletab ='byprofile']").addClass('active');
                $("#byprofile").removeClass("hideDiv");
            }

            $("#cont_setrules").stop().animate({
                scrollTop: ($("#" + subdetails[0]).offset().top - 200)
            }, 1000);

            $("#" + subdetails[0]).effect('highlight', { color: "#1b84e7" }, 5000);
        }
    }
});