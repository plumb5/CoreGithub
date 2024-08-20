var countryList = new Array("AFGHANISTAN", "ALAND ISLANDS", "ALBANIA", "ALGERIA", "AMERICAN SAMOA", "ANDORRA", "ANGOLA", "ANGUILLA", "ANTARCTICA", "ANTIGUA AND BARBUDA", "ARGENTINA", "ARMENIA", "ARUBA", "AUSTRALIA", "AUSTRIA", "AZERBAIJAN", "BAHAMAS", "BAHRAIN", "BANGLADESH", "BARBADOS", "BELARUS", "BELGIUM", "BELIZE", "BENIN", "BERMUDA", "BHUTAN", "BOLIVIA", "BOSNIA AND HERZEGOVINA", "BOTSWANA", "BRAZIL", "BRITISH INDIAN OCEAN TERRITORY", "BRUNEI DARUSSALAM", "BULGARIA", "BURKINA FASO", "BURUNDI", "CAMBODIA", "CAMEROON", "CANADA", "CAPE VERDE", "CAYMAN ISLANDS", "CENTRAL AFRICAN REPUBLIC", "CHAD", "CHILE", "CHINA", "CHRISTMAS ISLAND", "COLOMBIA", "COMOROS", "CONGO", "CONGO, THE DEMOCRATIC REPUBLIC OF THE", "COOK ISLANDS", "COSTA RICA", "COTE D'IVOIRE", "CROATIA", "CUBA", "CURAA‡AO", "CURAÃ‡AO", "CYPRUS", "CZECH REPUBLIC", "DEMOCRATIC PEOPLE'S REPUBLIC OF KOREA", "DENMARK", "DJIBOUTI", "DOMINICA", "DOMINICAN REPUBLIC", "ECUADOR", "EGYPT", "EL SALVADOR", "EQUATORIAL GUINEA", "ERITREA", "ESTONIA", "ETHIOPIA", "FALKLAND ISLANDS (MALVINAS)", "FAROE ISLANDS", "FIJI", "FINLAND", "FRANCE", "FRENCH GUIANA", "FRENCH POLYNESIA", "FRENCH SOUTHERN TERRITORIES", "GABON", "GAMBIA", "GEORGIA", "GERMANY", "GHANA", "GIBRALTAR", "GREECE", "GREENLAND", "GRENADA", "GUADELOUPE", "GUAM", "GUATEMALA", "GUERNSEY", "GUINEA", "GUINEA-BISSAU", "GUYANA", "HAITI", "HEARD ISLAND AND MCDONALD ISLANDS", "HOLY SEE (VATICAN CITY STATE)", "HONDURAS", "HONG KONG", "HUNGARY", "ICELAND", "INDIA", "INDONESIA", "IRAN, ISLAMIC REPUBLIC OF", "IRAQ", "IRELAND", "ISLE OF MAN", "ISRAEL", "ITALY", "JAMAICA", "JAPAN", "JORDAN", "KAZAKHSTAN", "KENYA", "KIRIBATI", "KOREA, REPUBLIC OF", "KUWAIT", "KYRGYZSTAN", "LAO PEOPLE'S DEMOCRATIC REPUBLIC", "LATVIA", "LEBANON", "LESOTHO", "LIBERIA", "LIBYAN ARAB JAMAHIRIYA", "LIECHTENSTEIN", "LITHUANIA", "LUXEMBOURG", "MACAO", "MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF", "MADAGASCAR", "MALAWI", "MALAYSIA", "MALDIVES", "MALI", "MALTA", "MARSHALL ISLANDS", "MARTINIQUE", "MAURITANIA", "MAURITIUS", "MAYOTTE", "MEXICO", "MICRONESIA, FEDERATED STATES OF", "MOLDOVA, REPUBLIC OF", "MONACO", "MONGOLIA", "MONTENEGRO", "MONTSERRAT", "MOROCCO", "MOZAMBIQUE", "MYANMAR", "NAMIBIA", "NAURU", "NEPAL", "NETHERLANDS", "NETHERLANDS ANTILLES", "NEW CALEDONIA", "NEW ZEALAND", "NICARAGUA", "NIGER", "NIGERIA", "NIUE", "NORFOLK ISLAND", "NORTHERN MARIANA ISLANDS", "NORWAY", "OMAN", "PAKISTAN", "PALAU", "PALESTINIAN TERRITORY, OCCUPIED", "PANAMA", "PAPUA NEW GUINEA", "PARAGUAY", "PERU", "PHILIPPINES", "POLAND", "PORTUGAL", "PUERTO RICO", "QATAR", "REUNION", "ROMANIA", "RUSSIAN FEDERATION", "RWANDA", "SAINT HELENA", "SAINT KITTS AND NEVIS", "SAINT LUCIA", "SAINT MARTIN", "SAINT PIERRE AND MIQUELON", "SAINT VINCENT AND THE GRENADINES", "SAMOA", "SAN MARINO", "SAO TOME AND PRINCIPE", "SAUDI ARABIA", "SENEGAL", "SERBIA", "SEYCHELLES", "SIERRA LEONE", "SINGAPORE", "SLOVAKIA", "SLOVENIA", "SOLOMON ISLANDS", "SOMALIA", "SOUTH AFRICA", "SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS", "SPAIN", "SRI LANKA", "SUDAN", "SURINAME", "SWAZILAND", "SWEDEN", "SWITZERLAND", "SYRIAN ARAB REPUBLIC", "TAIWAN, PROVINCE OF CHINA", "TAJIKISTAN", "TANZANIA, UNITED REPUBLIC OF", "THAILAND", "TOGO", "TOKELAU", "TONGA", "TRINIDAD AND TOBAGO", "TUNISIA", "TURKEY", "TURKMENISTAN", "TURKS AND CAICOS ISLANDS", "TUVALU", "UGANDA", "UKRAINE", "UNITED ARAB EMIRATES", "UNITED KINGDOM", "UNITED STATES", "UNITED STATES MINOR OUTLYING ISLANDS", "URUGUAY", "UZBEKISTAN", "VANUATU", "VENEZUELA", "VIET NAM", "VIRGIN ISLANDS, BRITISH", "VIRGIN ISLANDS, U.S.", "WALLIS AND FUTUNA", "YEMEN", "YUGOSLAVIA", "ZAMBIA", "ZIMBABWE", "Great Britain (UK)");

var ruleConditions = {
    countOfRules: 0,
    FormId: 0, IsLead: -1, IsBelong: 0, BelongsToGroup: "", BehavioralScoreCondition: 0, BehavioralScore1: 0, BehavioralScore2: 0, SessionIs: 0, SessionConditionIsTrueOrIsFalse: false,
    PageDepthIs: 0, NPageVisited: 0, FrequencyIs: 0, PageUrl: "", IsPageUrlContainsCondition: false, PageParameters: 0, IsReferrer: 0, ReferrerUrl: "", CheckSourceDomainOnly: false, IsMailIsRespondent: false,
    SearchString: "", Country: "", City: "", IsClickedRecentButtons: "", IsClickedSpecificButtons: "", ClickedPriceRangeProduct: "", IsVisitorRespondedChat: false, MailCampignResponsiveStage: 0, IsRespondedForm: 0,
    IsNotRespondedForm: 0, CloseCount: 0, AddedProductsToCart: "", ViewedButNotAddedProductsToCart: "", DroppedProductsFromCart: "", PurchasedProducts: "", NotPurchasedProducts: "",
    CustomerTotalPurchase: 0, CustomerCurrentValue: 0, DependencyFormId: 0, DependencyFormField: 0, DependencyFormCondition: 0, DependencyFormAnswer1: "", DependencyFormAnswer2: "",
    ImpressionEventForFormId: 0, ImpressionEventCountCondition: 0, CloseEventForFormId: 0, CloseEventCountCondition: 0, ResponsesEventForFormId: 0, ResponsesEventCountCondition: 0,
    OnlineSentimentIs: 0, SocialStatusIs: 0, InfluentialScoreCondition: 0, InfluentialScore1: 0, InfluentialScore2: 0, OfflineSentimentIs: 0, ProductRatingIs: 0, GenderIs: "",
    MaritalStatusIs: 0, ProfessionIs: "", NotConnectedSocially: 0, LoyaltyPointsCondition: 0, LoyaltyPointsRange1: 0, LoyaltyPointsRange2: 0, RFMSScoreRangeCondition: 0,
    RFMSScoreRange1: 0, RFMSScoreRange2: 0, ShowFormOnlyNthTime: 0, CloseCountSessionWiseOrOverAll: false, OverAllTimeSpentInSite: 0, AlreadyVisitedPages: "", PageDepthConditionIsTrueOrIsFalse: false,
    PageViewConditionIsTrueOrIsFalse: false, FrequencyConditionIsTrueOrIsFalse: false, MailRespondentConditionIsTrueOrIsFalse: false, CountryConditionIsTrueOrIsFalse: false,
    CityConditionIsTrueOrIsFalse: false, NurtureStatusIs: 0, IsMobileDevice: 0, AlreadyVisitedPagesConditionIsTrueOrIsFalse: true,
    InstantOrOnceInaDay: 0, IsBusinessOrIndividualMember: null, IsOfflineOrOnlinePurchase: null, LastPurchaseIntervalCondition: 0, LastPurchaseIntervalRange1: 0, LastPurchaseIntervalRange2: 0,
    ViewedProductAreInCartOrNot: null, ViewedProductAllProductOrSingle: null, DroppedProductsFromCartIsAllProductOrSingle: null, DroppedProductsFromCartPriceDrop: false,
    DroppedProductsFromCartSlabExists: false, DroppedProductsFromCartFreebieExists: false, CustomerExpirdayIntervalCondition: 0, CustomerExpirdayIntervalRange1: 0, CustomerExpirdayIntervalRange2: 0
};

ValidationOfRules = function () {
    if (!ValidationOfAudience())
        return false;
    if (!ValidateBehavior())
        return false;
    if (!ValidateInteraction())
        return false;
    if (!ValidateInteractionEvent())
        return false;
    if (!ValidateProfile())
        return false;
    return true;
};

ValidationOfAudience = function () {
    if ($("#ui_chkSegment").is(":checked") && $("input[name='BelongsGroup']:checked").val() && $("#ui_txtGroups_values").children().length == 0) {
        ShowErrorMessage("Display Rules -> Audience -> Segment Rule :- There is no groups have been added.");
        $("#ui_txtGroups").focus();
        return false;
    }
    return true;
};

ValidateBehavior = function () {
    if ($("#ui_chkBehavioralScore").is(":checked")) {
        if ($("#ui_VisitorScore1").val().length == 0) {
            ShowErrorMessage("Display Rules -> Behavior -> Please enter behavioural score");
            $("#ui_VisitorScore1").focus();
            return false;
        }
        else if ($("#ui_ddlBehavioralScoreRange").val() == "3" && $("#ui_VisitorScore2").val().length == 0) {
            ShowErrorMessage("Display Rules -> Behavior -> Please enter score range correctly");
            $("#ui_VisitorScore2").focus();
            return false;
        }
        else if ($("#ui_ddlBehavioralScoreRange").val() == "3" && parseInt($("#ui_VisitorScore1").val()) > parseInt($("#ui_VisitorScore2").val())) {
            ShowErrorMessage("Display Rules -> Behavior -> behavioural score range is not correctly");
            $("#ui_VisitorScore2").focus();
            return false;
        }
    }
    if ($("#ui_chkSessionIs").is(":checked") && $("#ui_txtSession").val().length == 0) {
        ShowErrorMessage("Display Rules -> Behavior -> Please enter session value");
        $("#ui_txtSession").focus();
        return false;
    }
    if ($("#ui_chkPageDepthIs").is(":checked") && $("#ui_txtPageDepthIs").val().length == 0) {
        ShowErrorMessage("Display Rules -> Behavior -> Please enter Page Depth value");
        $("#ui_txtPageDepthIs").focus();
        return false;
    }
    if ($("#ui_chkPageViewIs").is(":checked") && $("#ui_txtPageViewIs").val().length == 0) {
        ShowErrorMessage("Display Rules -> Behavior -> Please enter Page View value");
        $("#ui_txtPageViewIs").focus();
        return false;
    }
    if ($("#ui_chkFrequencyIs").is(":checked") && $("#ui_txtFrequencyIs").val().length == 0) {
        ShowErrorMessage("Display Rules -> Behavior -> Please enter frequency");
        $("#ui_txtFrequencyIs").focus();
        return false;
    }
    if ($("#ui_chkOnPageUrl").is(":checked") && $("#ui_txtPageUrl").val().length == 0) {
        ShowErrorMessage("Display Rules -> Behavior -> Please enter page urls");
        $("#ui_txtPageUrl").focus();
        return false;
    }
    if ($("#ui_chkSourceIs").is(":checked") && $("#ui_radSourceIsReferrer").is(":checked") && $("#ui_txtSourceIs").val().length == 0) {
        ShowErrorMessage("Display Rules -> Behavior -> Please enter source url");
        $("#ui_txtSourceIs").focus();
        return false;
    }
    if ($("#ui_chkSearchKeywordIs").is(":checked") && $("#ui_txtSearchKeyword").val().length == 0) {
        ShowErrorMessage("Display Rules -> Behavior -> Please enter Search Keyword");
        $("#ui_txtSearchKeyword").focus();
        return false;
    }
    if ($("#ui_chkCountryIs").is(":checked") && $("#ui_txtCountry_values").children().length == 0) {
        ShowErrorMessage("Display Rules -> Behavior -> Please enter country name");
        $("#ui_txtCountry").focus();
        return false;
    }
    if ($("#ui_chkCityIs").is(":checked") && $("#ui_txtCity_values").children().length == 0) {
        ShowErrorMessage("Display Rules -> Behavior -> Please enter city name");
        $("#ui_txtCity").focus();
        return false;
    }
    if ($("#ui_chkAlreadyVisitedPages").is(":checked") && $("#ui_txtAlreadyVisitedPageUrls").val().length == 0) {
        ShowErrorMessage("Display Rules -> Behavior -> Please enter already visited page urls");
        $("#ui_txtAlreadyVisitedPageUrls").focus();
        return false;
    }
    if ($("#ui_chkTimeSpentInSite").is(":checked") && $("#ui_txtTimeSpentInSite").val().length == 0) {
        ShowErrorMessage("Display Rules -> Behavior -> Please enter over all time spent in site");
        $("#ui_txtTimeSpentInSite").focus();
        return false;
    }
    return true;
};

ValidateInteraction = function () {
    if ($("#ui_chkClickedButton").is(":checked") && $("#ui_txtClickButton_values").children().length == 0) {
        ShowErrorMessage("Display Rules -> Interaction -> Please enter select Button tag names");
        $("#ui_txtClickButton").focus();
        return false;
    }
    if ($("#ui_chkClickedPriceRange").is(":checked")) {
        if ($("#ui_txtPriceRangeProducts_values").children().length == 0) {
            ShowErrorMessage("Display Rules -> Interaction -> Please enter a value for the selected checkbox");
            $("#ui_txtPriceRangeProducts").focus();
            return false;
        }
    }
    if ($("#ui_chkRespondedForm").is(":checked") && $("#ui_ddlRespondedFroms").val() == 0) {
        ShowErrorMessage("Display Rules -> Interaction -> Forms are not created yet");
        $("#ui_ddlRespondedFroms").focus();
        return false;
    }
    if ($("#ui_chkNotRespondedForm").is(":checked") && $("#ui_ddlNotRespondedFroms").val() == 0) {
        ShowErrorMessage("Display Rules -> Interaction -> Forms are not created yet");
        $("#ui_ddlNotRespondedFroms").focus();
        return false;
    }
    if ($("#ui_chkAnswerDependencyForm").is(":checked")) {
        if ($("#ui_ddlAnswerDependencyFroms").val() == "0") {
            ShowErrorMessage("Display Rules -> Interaction -> Please select the form and associated condition");
            $("#ui_ddlAnswerDependencyFroms").focus();
            return false;
        }
        if ($("input:radio[name='AnswerDependencyFieldOption']:checked").val() == undefined) {
            ShowErrorMessage("Display Rules -> Interaction -> Please select the form and associated condition");
            $("#ui_ddlAnswerDependencyFroms").focus();
            return false;
        }
        if ($("#ui_txtAnswerCondition1").val().length == 0) {
            $("#ui_txtAnswerCondition1").focus();
            ShowErrorMessage("Display Rules -> Interaction -> Answer dependency form field answer value");
            return false;
        }
        if ($("#ui_ddlAnswerCondition").val() == "3" && $("#ui_txtAnswerCondition2").val().length == 0) {
            $("#ui_txtAnswerCondition2").focus();
            ShowErrorMessage("Display Rules -> Interaction -> Answer dependency form field, enter correct range value");
            return false;
        }
    }
    if ($("#ui_chkClosedNTimes").is(":checked") && $("#ui_txtClosedNTimes").val().length == 0) {
        ShowErrorMessage("Display Rules -> Interaction -> Please enter visitor closed form nth time value");
        $("#ui_txtClosedNTimes").focus();
        return false;
    }
    if ($("#ui_chkAddedToCart").is(":checked") && $("#ui_txtAddedToCartProducts_values").children().length == 0) {
        ShowErrorMessage("Display Rules -> Interaction -> Please select products");
        $("#ui_txtAddedToCartProducts").focus();
        return false;
    }
    if ($("#hdn_domainName").val().indexOf("bestpricewholesale.co.in") > -1) { // Walmart
        if ($("#ui_chkViewedNotAddedToCart").is(":checked") && $("#ui_radViewedProductSingle").is(":checked") && $("#ui_txtViewedNotAddedToCartProducts_values").children().length == 0) {
            ShowErrorMessage("Display Rules -> Interaction -> Please select products");
            $("#ui_txtViewedNotAddedToCartProducts").focus();
            return false;
        }
        if ($("#ui_chkDropedFromCart").is(":checked") && $("#ui_radDroppedProductSingle").is(":checked") && $("#ui_txtDropedFromCartProducts_values").children().length == 0) {
            ShowErrorMessage("Display Rules -> Interaction -> Please select products");
            $("#ui_txtDropedFromCartProducts").focus();
            return false;
        }
    }
    else {
        if ($("#ui_chkViewedNotAddedToCartAll").is(":checked") && $("#ui_txtViewedNotAddedToCartProductsAll_values").children().length == 0) {
            ShowErrorMessage("Display Rules -> Interaction -> Please select products");
            $("#ui_txtViewedNotAddedToCartProductsAll").focus();
            return false;
        }
        if ($("#ui_chkDropedFromCartAll").is(":checked") && $("#ui_txtDropedFromCartProductsAll_values").children().length == 0) {
            ShowErrorMessage("Display Rules -> Interaction -> Please select products");
            $("#ui_txtDropedFromCartProductsAll").focus();
            return false;
        }
    }
    if ($("#ui_chkCustomerPurchased").is(":checked") && $("#ui_txtCustomerPurchasedProducts_values").children().length == 0) {
        ShowErrorMessage("Display Rules -> Interaction -> Please select products");
        $("#ui_txtCustomerPurchasedProducts").focus();
        return false;
    }
    if ($("#ui_chkCustomerNotPurchased").is(":checked") && $("#ui_txtCustomerNotPurchasedProducts_values").children().length == 0) {
        ShowErrorMessage("Display Rules -> Interaction -> Please select products");
        $("#ui_txtCustomerNotPurchasedProducts").focus();
        return false;
    }
    if ($("#ui_chkTotalPurchaseIs").is(":checked") && $("#ui_txtCustomerTotalPurchase").val().length == 0) {
        ShowErrorMessage("Display Rules -> Interaction -> Please enter customer total purchase");
        $("#ui_txtCustomerTotalPurchase").focus();
        return false;
    }
    if ($("#ui_chkCustomerCurrectValue").is(":checked") && $("#ui_txtCustomerCurrentValue").val().length == 0) {
        ShowErrorMessage("Display Rules -> Interaction -> Please enter customer current value");
        $("#ui_txtCustomerCurrentValue").focus();
        return false;
    }
    if ($("#ui_chkLastPurchase").is(":checked") && $("#ui_ddlchkLastPurchase").val() == 0) {
        ShowErrorMessage("Display Rules -> Interaction -> Please Choose interval");
        $("#ui_ddlchkLastPurchase").focus();
        return false;
    }
    if ($("#ui_chkExpiryday").is(":checked") && $("#ui_ddlExpirydayCondition").val() == 0) {
        ShowErrorMessage("Display Rules -> Interaction -> Please Choose interval");
        $("#ui_ddlExpirydayCondition").focus();
        return false;
    }
    return true;
};

ValidateInteractionEvent = function () {
    if ($("#ui_chkFormImpression").is(":checked")) {
        if ($("#ui_txtFormImpressionCount").val().length == 0) {
            ShowErrorMessage("Display Rules -> Interaction Event -> Please enter Impression Count");
            $("#ui_txtFormImpressionCount").focus();
            return false;
        }
    }
    if ($("#ui_chkFormCloseEvent").is(":checked")) {
        if ($("#ui_txtFormCloseEventCount").val().length == 0) {
            ShowErrorMessage("Display Rules -> Interaction Event -> Please enter form Close Count");
            $("#ui_txtFormCloseEventCount").focus();
            return false;
        }
    }
    if ($("#ui_chkResponseCountEvent").is(":checked")) {
        if ($("#ui_txtResponseCountEventCount").val().length == 0) {
            ShowErrorMessage("Display Rules -> Interaction Event -> Please enter Responses Count");
            $("#ui_txtResponseCountEventCount").focus();
            return false;
        }
    }
    if ($("#ui_chkShowFormAtNTime").is(":checked") && $("#ui_txtShowFormAtNTime").val().length == 0) {
        ShowErrorMessage("Display Rules -> Behavior -> Please enter value for 'Show this form only Nth Time' condition");
        $("#ui_txtShowFormAtNTime").focus();
        return false;
    }
    return true;
};

ValidateProfile = function () {
    if ($("#ui_chkInfluentialScoreIs").is(":checked")) {
        if ($("#ui_txtInfluentialScore1").val().length == 0) {
            ShowErrorMessage("Display Rules -> Profile -> Please enter influential score");
            $("#ui_txtInfluentialScore1").focus();
            return false;
        }
        else if ($("#ui_ddlInfluentialScoreIs").val() == "3" && $("#ui_txtInfluentialScore2").val().length == 0) {
            ShowErrorMessage("Display Rules -> Profile -> Please enter influential range correctly");
            $("#ui_txtInfluentialScore2").focus();
            return false;
        }
        else if ($("#ui_ddlInfluentialScoreIs").val() == "3" && parseInt($("#ui_txtInfluentialScore1").val()) > parseInt($("#ui_txtInfluentialScore2").val())) {
            ShowErrorMessage("Display Rules -> Profile -> influential score range is not correctly");
            $("#ui_txtInfluentialScore2").focus();
            return false;
        }
    }
    if ($("#ui_chkProspectLoyaltyIs").is(":checked")) {
        if ($("#ui_txtProspectLoyalty1").val().length == 0) {
            ShowErrorMessage("Display Rules -> Behavior -> Please enter loyalty score");
            $("#ui_txtProspectLoyalty1").focus();
            return false;
        }
        else if ($("#ui_ddlProspectLoyaltyIs").val() == "3" && $("#ui_txtProspectLoyalty2").val().length == 0) {
            ShowErrorMessage("Display Rules -> Profile -> Please enter loyalty range correctly");
            $("#ui_txtProspectLoyalty2").focus();

            return false;
        }
        else if ($("#ui_ddlProspectLoyaltyIs").val() == "3" && parseInt($("#ui_txtProspectLoyalty1").val()) > parseInt($("#ui_txtProspectLoyalty2").val())) {
            ShowErrorMessage("Display Rules -> Profile -> loyalty range is not correctly");
            $("#ui_txtProspectLoyalty2").focus();
            return false;
        }
    }
    if ($("#ui_chkRFMSScoreIs").is(":checked")) {
        if ($("#ui_txtRFMSScore1").val().length == 0) {
            ShowErrorMessage("Display Rules -> Behavior -> Please enter RFMS score");
            $("#ui_txtRFMSScore1").focus();
            return false;
        }
        else if ($("#ui_ddlRFMSScore").val() == "3" && $("#ui_txtRFMSScore2").val().length == 0) {
            ShowErrorMessage("Display Rules -> Profile -> Please enter RFMS range correctly");
            $("#ui_txtRFMSScore2").focus();
            return false;
        }
        else if ($("#ui_ddlRFMSScore").val() == "3" && parseInt($("#ui_txtRFMSScore1").val()) > parseInt($("#ui_txtRFMSScore2").val())) {
            ShowErrorMessage("Display Rules -> Profile -> RFMS range is not correctly");
            $("#ui_txtRFMSScore2").focus();
            return false;
        }
    }
    return true;
};

$(".rule").click(function () {
    if ($("#" + $(this).attr("id") + "Td").is(":visible"))
        $("#" + $(this).attr("id") + "Td").hide();
    else
        $("#" + $(this).attr("id") + "Td").show();
});

$("input:radio[name=Source]").click(function () {
    if ($("#ui_radSourceIsReferrer").is(":checked"))
        $("#dvSoureReferrer").show();
    else
        $("#dvSoureReferrer").hide();
});

$("input:radio[name='VisitorType']").click(function () {
    if ($("#ui_radUnknown").is(":checked"))
        $(".isKnown").addClass("BlurAndOpacity")
    else
        $(".isKnown").removeClass("BlurAndOpacity")
});

$("#ui_ddlBehavioralScoreRange").change(function () {
    if ($(this).val() == "3")
        $("#ui_VisitorScore2").show();
    else
        $("#ui_VisitorScore2").hide();
});

$("#ui_ddlLastPurchaseCondition").change(function () {
    if ($(this).val() == "3")
        $("#ui_txtLastPurchaseRange2").show();
    else
        $("#ui_txtLastPurchaseRange2").hide();
});

$("#ui_ddlExpirydayCondition").change(function () {
    if ($(this).val() == "3")
        $("#ui_txtExpiryday2").show();
    else
        $("#ui_txtExpiryday2").hide();
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

$(".ruleSeparator > img ").click(function () {
    if ($("#dv" + $(this).attr("id")).is(":visible")) {
        $("#dv" + $(this).attr("id")).hide();
        $(this).removeClass("CollapseImg").addClass("ExpandImage");
    }
    else {
        $("#dv" + $(this).attr("id")).show();
        $(this).removeClass("ExpandImage").addClass("CollapseImg");
    }
});

$(".ruleSeparator > label ").click(function () {
    $("#" + $(this).attr("for")).click();
});

$("input:radio[name=ReportMail]").click(function () {
    if ($("#dvReportToMailConditionalFields")) {
        $("#dvReportToMailConditionalFields").empty();
    }
    if ($("#dvReportToMailConditionalOptions")) {
        $("#dvReportToMailConditionalOptions").empty();
    }
    if ($("#ui_chkReportMail").is(":checked")) {
        $("#ReportMail_Tr").show();
    }
    if ($("#ui_radReportMailUnCondition").is(":checked")) {
        $("#ui_radReportMailUnCondition_dv").show();
        $("#ui_radReportMailCondition_dv").hide();
    }
    else {
        $("#ui_radReportMailUnCondition_dv").hide();
        $("#ui_radReportMailCondition_dv").show();

        BindResponseConditionalFieldList("dvReportToMailConditionalFields", "dvReportToMailConditionalOptions", "ReportToMail");
    }
});

$("input:radio[name=AllDroppedProduct]").click(function () {
    if ($("#ui_radDroppedProductSingle").is(":checked"))
        $("#ui_chkDropedFromCartTd").children('div').show();
    else
        $("#ui_chkDropedFromCartTd").children('div').hide();
});

$("input:radio[name=AllViewedProduct]").click(function () {
    if ($("#ui_radViewedProductSingle").is(":checked"))
        $("#ui_chkViewedNotAddedToCartTd").children('div').show();
    else
        $("#ui_chkViewedNotAddedToCartTd").children('div').hide();
});

function BindFields() {
    var dropDownFields = new Array("Mobile", "LandLine", "Fax", "Letter");
}

$("input:radio[name=ReportSms]").click(function () {
    if ($("#dvReportToSMSConditionalFields")) {
        $("#dvReportToSMSConditionalFields").empty();
    }
    if ($("#dvReportToSMSConditionalOptions")) {
        $("#dvReportToSMSConditionalOptions").empty();
    }
    if ($("#ui_chkReportSMS").is(":checked")) {
        $("#ReportSms_Tr").show();
    }
    if ($("#ui_radReportSMSUnCondition").is(":checked")) {
        $("#ui_radReportSMSUnConditionTd").show();
        $("#ui_radReportSMSConditionTd").hide();
    }
    else {
        $("#ui_radReportSMSUnConditionTd").hide();
        $("#ui_radReportSMSConditionTd").show();
        BindResponseConditionalFieldList("dvReportToSMSConditionalFields", "dvReportToSMSConditionalOptions", "ReportToSMS");
    }
});

$("input:radio[name=MailOut]").click(function () {
    if ($("#dvMailoutConditionalOptions")) {
        $("#dvMailoutConditionalOptions").empty();
    }
    if ($("#dvMailoutConditionalFields")) {
        $("#dvMailoutConditionalFields").empty();
    }
    if ($("#ui_chkSendMailOut").is(":checked")) {
        $("#MailOut_Tr").show();
    }
    if ($("#ui_chkUnConditionalMailOut").is(":checked")) {
        $("#ui_chkUnConditionalMailOutTd").show();
        $("#ui_chkConditionalMailOutTd").hide();
    }
    else {
        $("#ui_chkUnConditionalMailOutTd").hide();
        $("#ui_chkConditionalMailOutTd").show();
        BindResponseConditionalFieldList("dvMailoutConditionalFields", "dvMailoutConditionalOptions", "MailOut");
    }
});

$("input:radio[name=AssignToSales]").click(function () {
    if ($("#dvAssignToSalesConditionalOptions")) {
        $("#dvAssignToSalesConditionalOptions").empty();
    }
    if ($("#dvAssignToSalesConditionalFields")) {
        $("#dvAssignToSalesConditionalFields").empty();
    }
    if ($("#ui_chkSalesPerson").is(":checked")) {
        $("#AssignToSales_Tr").show();
    }
    if ($("#ui_radUnConditionalAssignToSales").is(":checked")) {
        $("#ui_radUnConditionalAssignToSalesTd").show();
        $("#ui_radConditionalAssignToSalesTd").hide();
    }
    else {
        $("#ui_radUnConditionalAssignToSalesTd").hide();
        $("#ui_radConditionalAssignToSalesTd").show();
        BindResponseConditionalFieldList("dvAssignToSalesConditionalFields", "dvAssignToSalesConditionalOptions", "AssignToSales");
    }
});

$("#ui_chkReportMail, #ui_chkReportSMS, #ui_chkSendMailOut, #ui_chkSalesPerson,#ui_chkSendSmsOut").click(function () {
    if ($(this).attr("id") == "ui_chkReportMail") {
        if (!$(this).is(":checked")) {
            $("#ReportMail_Tr").hide();
        }
        else if ($("#ui_chkReportMail").is(":checked")) {
            $("#ReportMail_Tr").show();
        }
    }
    else if ($(this).attr("id") == "ui_chkReportSMS") {
        if (!$(this).is(":checked")) {
            $("#ReportSms_Tr").hide();
        }
        else if ($("#ui_chkReportSMS").is(":checked")) {
            $("#ReportSms_Tr").show();
        }
    }
    else if ($(this).attr("id") == "ui_chkSendMailOut") {
        if (!$(this).is(":checked")) {
            $("#MailOut_Tr").hide();
        }
        else if ($("#ui_chkSendMailOut").is(":checked")) {
            $("#MailOut_Tr").show();
        }
    }
    else if ($(this).attr("id") == "ui_chkSalesPerson") {
        if (!$(this).is(":checked")) {
            $("#AssignToSales_Tr").hide();
        }
        else if ($("#ui_chkSalesPerson").is(":checked")) {
            $("#AssignToSales_Tr").show();
        }
    }
    else if ($(this).attr("id") == "ui_chkSendSmsOut") {
        if (!$(this).is(":checked")) {
            $("#SmsOut_Tr").hide();
        }
        else if ($("#ui_chkSendSmsOut").is(":checked")) {
            $("#SmsOut_Tr").show();
        }
    }
});

IntializeAutoComplete = function (fieldId, methodUrl, minLength, appendObject, extraFieldId) {
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
            AppendSelected(appendObject, selectedItem, extraFieldId);
        },
        close: function (event, ui) {
            $(this).val("");
        }
    });
};

IntializeCountyList = function () {
    $("#ui_txtCountry").autocomplete({
        autoFocus: true,
        minLength: 1, max: 10,
        source: function (request, response) {
            var matches = $.map(countryList, function (countryList) {
                if (countryList.toUpperCase().indexOf(request.term.toUpperCase()) === 0) {
                    return countryList;
                }
            });
            response(matches.slice(0, 10));
        },
        select: function (events, selectedItem) {
            AppendSelected("ui_txtCountry_values", selectedItem, "country");
        },
        close: function (event, ui) {
            $(this).val("");
        }
    });
};

function AppendSelected(appendTo, data, fieldId) {
    var mainDiv = document.createElement("div");
    mainDiv.id = fieldId + "_" + data.item.value.replace(/[ ,:]+/g, "_").replace(/ /g, "_").replace(/,/g, "_").replace(/'/g, "_").replace(/&/g, "_").replace(/\+/g, "_").replace(/\//g, "_").replace(/\)/g, "_").replace(/\(/g, "_").replace(/\./g, "-");
    mainDiv.className = "vrAutocomplete";
    mainDiv.setAttribute("value", data.item.value);
    mainDiv.setAttribute("identifier", data.item.value.replace(/[ ,:]+/g, "_").replace(/ /g, "_").replace(/,/g, "_").replace(/'/g, "_").replace(/&/g, "_").replace(/\+/g, "_").replace(/\//g, "_").replace(/\)/g, "_").replace(/\(/g, "_").replace(/\./g, "-"));

    var span = document.createElement("span");
    span.className = "vnAutocomplete";

    var contentDiv = document.createElement("div");
    contentDiv.className = "vtAutocomplete";
    contentDiv.innerHTML = data.item.label;

    var removeDiv = document.createElement("div");
    removeDiv.className = "vmAutocomplete";
    removeDiv.setAttribute("onclick", "RemoveData('" + fieldId + "_" + data.item.value.replace(/[ ,:]+/g, "_").replace(/ /g, "_").replace(/,/g, "_").replace(/&/g, "_").replace(/\+/g, "_").replace(/\//g, "_").replace(/'/g, "_").replace(/\)/g, "_").replace(/\(/g, "_").replace(/\./g, "-") + "');");

    span.appendChild(contentDiv);
    span.appendChild(removeDiv);
    mainDiv.appendChild(span);

    var isElementIsNotAdded = true;
    $("#" + appendTo).children().each(function () {
        if (data.item.value.replace(/ /g, "_").replace(/,/g, "_").replace(/ /g, "_").replace(/,/g, "_").replace(/'/g, "_").replace(/&/g, "_").replace(/\+/g, "_").replace(/\//g, "_").replace(/\)/g, "_").replace(/\(/g, "_").replace(/\./g, "-") == $(this).attr("identifier")) {
            isElementIsNotAdded = false;
            return false;
        }
    });
    if (isElementIsNotAdded)
        $("#" + appendTo).append(mainDiv);
    else
        ShowErrorMessage("This Item is already added.");
}

function RemoveData(data) {
    data = $.trim(data);
    $("#" + data).remove();
}

$("#ui_ddlAnswerDependencyFroms").change(function (value) {
    $("#trAnswerDependency").show();
    $.ajax({
        url: "/CommonDetailsForForms/GetFields",
        data: JSON.stringify({ 'FormId': $(this).val() }),
        dataType: "json",
        type: "POST",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataFilter: function (data) { return data; },
        success: function (response) {
            var fieldsanswer = "";
            if (response.formFields.length > 0) {
                if (response.formDetails != null && (response.formDetails.FormType == 12 || response.formDetails.FormType == 20)) {
                    $.each(response.formFields, function (i) {
                        if ($(this)[0].Name.length > 0)
                            fieldsanswer += "<input type='radio' class='rad' name='AnswerDependencyFieldOption' id='ui_radAnswerDependency" + i + "' value='" + $(this)[0].Id + "' /><label for='ui_radAnswerDependency" + i + "'>" + $(this)[0].Name + "</label>";
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
                                fieldsanswer += "<input type='radio' class='rad' name='AnswerDependencyFieldOption' id='ui_radAnswerDependency" + j + "' value='" + j + "' /><label for='ui_radAnswerDependency" + j + "'>" + subFields[j] + "</label>";
                        }
                    });
                }
            }
            else {
                for (var j = 1; j <= 5; j++)
                    fieldsanswer += "<input type='radio' class='rad' name='AnswerDependencyFieldOption' id='ui_radAnswerDependency" + j + "' value='" + j + "' /><label for='ui_radAnswerDependency" + j + "'>Ratted - " + j + "</label>";
            }
            $("#ui_dvAnswerDependencyFields").html(fieldsanswer);
        },
        error: ShowAjaxError
    });
});

$("#ui_ddlAnswerCondition").change(function () {
    if ($(this).val() == "3")
        $("#ui_txtAnswerCondition2").show();
    else
        $("#ui_txtAnswerCondition2").hide();
});

BindAudienceData = function () {
    if (ruleConditions.IsLead > -1) {
        $("input:radio[name='VisitorType'][value='" + ruleConditions.IsLead + "']").prop('checked', true);
        $("#ui_chkVisitorType").click();
    }
    if (ruleConditions.IsBelong > 0) {
        $("input:radio[name='BelongsGroup'][value='" + ruleConditions.IsBelong + "']").prop('checked', true);
        var groupsList = ruleConditions.BelongsToGroup.split("@#");
        for (var i = 0; i < groupsList.length; i++) {
            var idAndLabel = groupsList[i].split("-");
            var data = new Array();
            data["item"] = new Array();
            data.item.value = idAndLabel[0];
            data.item.label = idAndLabel[1];
            AppendSelected("ui_txtGroups_values", data, "group");
        }
        $("#ui_chkSegment").click();
    }
};

BindBehaviorData = function () {
    var needToOpendDiv = false;
    if (ruleConditions.BehavioralScoreCondition > 0) {
        $("#ui_ddlBehavioralScoreRange").val(ruleConditions.BehavioralScoreCondition);
        $("#ui_VisitorScore1").val(ruleConditions.BehavioralScore1);
        if ($("#ui_ddlBehavioralScoreRange").val() == "3") {
            $("#ui_VisitorScore2").val(ruleConditions.BehavioralScore2);
            $("#ui_ddlBehavioralScoreRange").change();
        }
        $("#ui_chkBehavioralScore").click();
        needToOpendDiv = true;
    }
    if (ruleConditions.SessionIs > 0) {
        $("#ui_txtSession").val(ruleConditions.SessionIs);
        if (ruleConditions.SessionConditionIsTrueOrIsFalse == false)
            $("#ui_radSessionIsFalse").prop('checked', true);
        else
            $("#ui_radSessionIsTrue").prop('checked', true);
        $("#ui_chkSessionIs").click();
        needToOpendDiv = true;
    }
    if (ruleConditions.PageDepthIs > 0) {
        $("#ui_txtPageDepthIs").val(ruleConditions.PageDepthIs);
        if (ruleConditions.PageDepthConditionIsTrueOrIsFalse == false)
            $("#ui_radPageDepthIsFalse").prop('checked', true);
        else
            $("#ui_radPageDepthIsTrue").prop('checked', true);
        $("#ui_chkPageDepthIs").click();
        needToOpendDiv = true;
    }
    if (ruleConditions.NPageVisited > 0) {
        $("#ui_txtPageViewIs").val(ruleConditions.NPageVisited);
        if (ruleConditions.PageViewConditionIsTrueOrIsFalse == false)
            $("#ui_radPageViewIsFalse").prop('checked', true);
        else
            $("#ui_radPageViewIsTrue").prop('checked', true);
        $("#ui_chkPageViewIs").click();
        needToOpendDiv = true;
    }
    if (ruleConditions.FrequencyIs > 0) {
        $("#ui_txtFrequencyIs").val(ruleConditions.FrequencyIs);
        if (ruleConditions.FrequencyConditionIsTrueOrIsFalse == false)
            $("#ui_radFrequencyIsFalse").prop('checked', true);
        else
            $("#ui_radFrequencyIsTrue").prop('checked', true);
        $("#ui_chkFrequencyIs").click();
        needToOpendDiv = true;
    }
    if (ruleConditions.PageUrl != null && ruleConditions.PageUrl.length > 0) {
        $("#ui_txtPageUrl").val(ruleConditions.PageUrl);
        $("#ui_chkOnPageUrl").click();
        if (ruleConditions.IsPageUrlContainsCondition == 1)
            $("#ui_PageUrlCheckContains").prop("checked", true);
        needToOpendDiv = true;
    }
    if (ruleConditions.IsReferrer > 0) {
        $("#ui_chkSourceIs").click();
        if (ruleConditions.IsReferrer == 1) {
            $("#ui_radSourceIsDirect").prop("checked", true);
        }
        else if (ruleConditions.IsReferrer == 2) {
            $("#ui_radSourceIsReferrer").prop("checked", true);
            $("#dvSoureReferrer").show();
            $("#ui_txtSourceIs").val(ruleConditions.ReferrerUrl);
            if (ruleConditions.CheckSourceDomainOnly == 1)
                $("#ui_chkCheckSourceDomainOnly").click();
        }
        needToOpendDiv = true;
    }
    if (ruleConditions.IsMailIsRespondent == 1) {
        if (ruleConditions.MailRespondentConditionIsTrueOrIsFalse == false)
            $("#ui_radMailRespondentIsFalse").prop('checked', true);
        else
            $("#ui_radMailRespondentIsTrue").prop('checked', true);
        $("#ui_chkIsMailRespondent").click();
        needToOpendDiv = true;
    }
    if (ruleConditions.SearchString != null && ruleConditions.SearchString.length > 0) {
        $("#ui_txtSearchKeyword").val(ruleConditions.SearchString);
        $("#ui_chkSearchKeywordIs").click();
        needToOpendDiv = true;
    }
    if (ruleConditions.Country != null && ruleConditions.Country.length > 0) {
        var countryList = ruleConditions.Country.split("@$");
        for (var i = 0; i < countryList.length; i++) {
            var data = new Array();
            data["item"] = new Array();
            data.item.value = countryList[i];
            data.item.label = countryList[i];
            AppendSelected("ui_txtCountry_values", data, "country");
        }
        if (ruleConditions.CountryConditionIsTrueOrIsFalse == false)
            $("#ui_radCountryIsFalse").prop('checked', true);
        else
            $("#ui_radCountryIsTrue").prop('checked', true);
        $("#ui_chkCountryIs").click();
        needToOpendDiv = true;
    }
    if (ruleConditions.City != null && ruleConditions.City.length > 0) {
        var cityList = ruleConditions.City.split("@$");
        for (var i = 0; i < cityList.length; i++) {
            var data = new Array();
            data["item"] = new Array();
            data.item.value = cityList[i];
            data.item.label = cityList[i];
            AppendSelected("ui_txtCity_values", data, "");
        }
        if (ruleConditions.CityConditionIsTrueOrIsFalse == false)
            $("#ui_radCityIsFalse").prop('checked', true);
        else
            $("#ui_radCityIsTrue").prop('checked', true);
        $("#ui_chkCityIs").click();
        needToOpendDiv = true;
    }
    if (ruleConditions.AlreadyVisitedPages != null && ruleConditions.AlreadyVisitedPages.length > 0) {
        $("#ui_txtAlreadyVisitedPageUrls").val(ruleConditions.AlreadyVisitedPages);
        $("#ui_chkAlreadyVisitedPages").click();
        if (ruleConditions.AlreadyVisitedPagesConditionIsTrueOrIsFalse == 1)
            $("#ui_radAlreadyVisitedPagesIsTrue").prop('checked', true);
        else
            $("#ui_radAlreadyVisitedPagesIsFalse").prop('checked', true);
        needToOpendDiv = true;
    }
    if (ruleConditions.OverAllTimeSpentInSite > 0) {
        $("#ui_txtTimeSpentInSite").val(ruleConditions.OverAllTimeSpentInSite);
        $("#ui_chkTimeSpentInSite").click();
        needToOpendDiv = true;
    }
    if (ruleConditions.IsMobileDevice > 0) {
        if (ruleConditions.IsMobileDevice == 1)
            $("#ui_radMobileDeviceConditionIsTrue").prop('checked', true);
        else
            $("#ui_radMobileDeviceConditionIsFalse").prop('checked', true);
        $("#ui_chkIsAndriodMobile").click();
        needToOpendDiv = true;
    }
    if (needToOpendDiv) {
        $("#ui_imgBehavior").removeClass("ExpandImage").addClass("CollapseImg");
        $("#dvui_imgBehavior").show();
    }
};

BindInteractionData = function () {
    var needToOpendDiv = false;
    if (ruleConditions.IsClickedSpecificButtons != null && ruleConditions.IsClickedSpecificButtons.length > 0) {
        if (ruleConditions.ClickedRecentButtonOrOverAll == 1)
            $("#ui_radClickedRecentBtn").prop('checked', true);
        else
            $("#ui_radClickedOverAll").prop('checked', true);
        needToOpendDiv = true;
        var clickedTags = ruleConditions.IsClickedSpecificButtons.split(",");
        for (var i = 0; i < clickedTags.length; i++) {
            var idAndLabel = clickedTags[i]
            var data = new Array();
            data["item"] = new Array();
            data.item.value = idAndLabel;
            data.item.label = idAndLabel;
            AppendSelected("ui_txtClickButton_values", data, "clkBtn");
        }
        $("#ui_chkClickedButton").click();
    }
    if (ruleConditions.ClickedPriceRangeProduct != null && ruleConditions.ClickedPriceRangeProduct.length > 0) {
        needToOpendDiv = true;
        var products = ruleConditions.ClickedPriceRangeProduct.split(",");
        for (var i = 0; i < products.length; i++) {
            var idAndLabel = products[i]
            var data = new Array();
            data["item"] = new Array();
            data.item.value = idAndLabel
            data.item.label = idAndLabel
            AppendSelected("ui_txtPriceRangeProducts_values", data, "ClickProduct");
        }
        $("#ui_chkClickedPriceRange").click();
    }
    if (ruleConditions.IsVisitorRespondedChat == true) {
        needToOpendDiv = true;
        $("#ui_chkRespondedInChat").click();
    }
    if (ruleConditions.MailCampignResponsiveStage > 0) {
        needToOpendDiv = true;
        $("#ui_ddlMailScore").val(ruleConditions.MailCampignResponsiveStage);
        $("#ui_chkMailResponseStage").click();
    }
    if (ruleConditions.IsRespondedForm > 0) {
        needToOpendDiv = true;
        $("#ui_ddlRespondedFroms").val(ruleConditions.IsRespondedForm);
        $("#ui_chkRespondedForm").click();
    }
    if (ruleConditions.IsNotRespondedForm > 0) {
        needToOpendDiv = true;
        $("#ui_ddlNotRespondedFroms").val(ruleConditions.IsNotRespondedForm);
        $("#ui_chkNotRespondedForm").click();
    }
    if (ruleConditions.DependencyFormId > 0) {
        needToOpendDiv = true;
        $("#ui_ddlAnswerDependencyFroms").val(ruleConditions.DependencyFormId).change();
        $("input:radio[name='AnswerDependencyFieldOption'][value='" + ruleConditions.DependencyFormField + "']").prop("checked", true);
        $("#ui_ddlAnswerCondition").val(ruleConditions.DependencyFormCondition).change();
        $("#ui_txtAnswerCondition1").val(ruleConditions.DependencyFormAnswer1);
        $("#ui_txtAnswerCondition2").val(ruleConditions.DependencyFormAnswer2);
        $("#ui_chkAnswerDependencyForm").click();
    }
    if (ruleConditions.CloseCount > 0) {
        needToOpendDiv = true;
        $("#ui_txtClosedNTimes").val(ruleConditions.CloseCount);
        if (ruleConditions.CloseCountSessionWiseOrOverAll == 1)
            $("#ui_radCloseCountOverAll").prop('checked', true);
        else
            $("#ui_radCloseCountSessionWise").prop('checked', true);
        $("#ui_chkClosedNTimes").click();
    }
    if (ruleConditions.AddedProductsToCart != null && ruleConditions.AddedProductsToCart.length > 0) {
        needToOpendDiv = true;
        var products = ruleConditions.AddedProductsToCart.split("@#");
        for (var i = 0; i < products.length; i++) {
            var idAndLabel = products[i];//.split("-");
            var data = new Array();
            data["item"] = new Array();
            data.item.value = idAndLabel;//[0];
            data.item.label = idAndLabel;//[0];
            AppendSelected("ui_txtAddedToCartProducts_values", data, "AddedToCart");
        }
        $("#ui_chkAddedToCart").click();
    }
    //// Walmart Start
    if ($("#hdn_domainName").val().indexOf("bestpricewholesale.co.in") > -1) { // Walmart
        if (ruleConditions.ViewedProductAreInCartOrNot != null) {
            needToOpendDiv = true;
            if (ruleConditions.ViewedProductAreInCartOrNot == false)
                $("#ui_radNotInCart").prop('checked', true);
            else
                $("#ui_radInCart").prop('checked', true);

            if (ruleConditions.ViewedProductAllProductOrSingle == false) {
                $("#ui_radViewedProductSingle").prop('checked', true);
                $("#ui_chkViewedNotAddedToCartTd").children('div').show();
            }
            else {
                $("#ui_radViewedProductAll").prop('checked', true);
                $("#ui_chkViewedNotAddedToCartTd").children('div').hide();
            }
            if (ruleConditions.ViewedButNotAddedProductsToCart != null && ruleConditions.ViewedButNotAddedProductsToCart.length > 0) {
                needToOpendDiv = true;
                var products = ruleConditions.ViewedButNotAddedProductsToCart.split("@#");
                for (var i = 0; i < products.length; i++) {
                    var idAndLabel = products[i];//.split("-");
                    var data = new Array();
                    data["item"] = new Array();
                    data.item.value = idAndLabel;//[0];
                    data.item.label = idAndLabel;//[0];
                    AppendSelected("ui_txtViewedNotAddedToCartProducts_values", data, "NotAddedToCart");
                }
            }
            $("#ui_chkViewedNotAddedToCart").click();
        }
        if (ruleConditions.DroppedProductsFromCartIsAllProductOrSingle != null) {
            needToOpendDiv = true;

            if (ruleConditions.DroppedProductsFromCartIsAllProductOrSingle == false) {
                $("#ui_radDroppedProductSingle").prop('checked', true);
                $("#ui_chkDropedFromCartTd").children('div').show();
            }
            else {
                $("#ui_radDroppedProductAll").prop('checked', true);
                $("#ui_chkDropedFromCartTd").children('div').hide();
            }

            if (ruleConditions.DroppedProductsFromCartPriceDrop == false)
                $("#ui_chkPriceDropCart").prop('checked', false);
            else
                $("#ui_chkPriceDropCart").prop('checked', true);

            if (ruleConditions.DroppedProductsFromCartSlabExists == false)
                $("#ui_chkSlabCart").prop('checked', false);
            else
                $("#ui_chkSlabCart").prop('checked', true);

            if (ruleConditions.DroppedProductsFromCartFreebieExists == false)
                $("#ui_chkFreeBieCart").prop('checked', false);
            else
                $("#ui_chkFreeBieCart").prop('checked', true);

            if (ruleConditions.DroppedProductsFromCart != null && ruleConditions.DroppedProductsFromCart.length > 0) {
                needToOpendDiv = true;
                var products = ruleConditions.DroppedProductsFromCart.split("@#");
                for (var i = 0; i < products.length; i++) {
                    var idAndLabel = products[i].split("-");
                    var data = new Array();
                    data["item"] = new Array();
                    data.item.value = idAndLabel;//[0];
                    data.item.label = idAndLabel;//[0];
                    AppendSelected("ui_txtDropedFromCartProducts_values", data, "DropFromCart");
                }
            }
            $("#ui_chkDropedFromCart").click();
        }
    }
    else {
        if (ruleConditions.ViewedButNotAddedProductsToCart != null && ruleConditions.ViewedButNotAddedProductsToCart.length > 0) {
            needToOpendDiv = true;
            var products = ruleConditions.ViewedButNotAddedProductsToCart.split("@#");
            for (var i = 0; i < products.length; i++) {
                var idAndLabel = products[i];//.split("-");
                var data = new Array();
                data["item"] = new Array();
                data.item.value = idAndLabel;//[0];
                data.item.label = idAndLabel;//[0];
                AppendSelected("ui_txtViewedNotAddedToCartProductsAll_values", data, "NotAddedToCartAll");
            }
            $("#ui_chkViewedNotAddedToCartAll").click();
        }
        if (ruleConditions.DroppedProductsFromCart != null && ruleConditions.DroppedProductsFromCart.length > 0) {
            needToOpendDiv = true;
            var products = ruleConditions.DroppedProductsFromCart.split("@#");
            for (var i = 0; i < products.length; i++) {
                var idAndLabel = products[i].split("-");
                var data = new Array();
                data["item"] = new Array();
                data.item.value = idAndLabel;//[0];
                data.item.label = idAndLabel;//[0];
                AppendSelected("ui_txtDropedFromCartProductsAll_values", data, "DropFromCartAll");
            }
            $("#ui_chkDropedFromCartAll").click();
        }
    }
    //// Walmart end
    if (ruleConditions.PurchasedProducts != null && ruleConditions.PurchasedProducts.length > 0) {
        needToOpendDiv = true;
        var products = ruleConditions.PurchasedProducts.split("@#");
        for (var i = 0; i < products.length; i++) {
            var idAndLabel = products[i];//.split("-");
            var data = new Array();
            data["item"] = new Array();
            data.item.value = idAndLabel;//[0];
            data.item.label = idAndLabel;//[0];
            AppendSelected("ui_txtCustomerPurchasedProducts_values", data, "Purchase");
        }
        $("#ui_chkCustomerPurchased").click();
    }
    if (ruleConditions.NotPurchasedProducts != null && ruleConditions.NotPurchasedProducts.length > 0) {
        needToOpendDiv = true;
        var products = ruleConditions.NotPurchasedProducts.split("@#");
        for (var i = 0; i < products.length; i++) {
            var idAndLabel = products[i];//.split("-");
            var data = new Array();
            data["item"] = new Array();
            data.item.value = idAndLabel;//[0];
            data.item.label = idAndLabel;//[0];
            AppendSelected("ui_txtCustomerNotPurchasedProducts_values", data, "NotPurchase");
        }
        $("#ui_chkCustomerNotPurchased").click();
    }
    if (ruleConditions.CustomerTotalPurchase > 0) {
        needToOpendDiv = true;
        $("#ui_txtCustomerTotalPurchase").val(ruleConditions.CustomerTotalPurchase);
        $("#ui_chkTotalPurchaseIs").click();
    }
    if (ruleConditions.CustomerCurrentValue > 0) {
        needToOpendDiv = true;
        $("#ui_txtCustomerCurrentValue").val(ruleConditions.CustomerCurrentValue);
        $("#ui_chkCustomerCurrectValue").click();
    }
    if ($("#hdn_domainName").val().indexOf("bestpricewholesale.co.in") > -1) {
        if (ruleConditions.IsBusinessOrIndividualMember != null) {

            if (ruleConditions.IsBusinessOrIndividualMember == false)
                $("#ui_radIndividual").prop('checked', true);
            else
                $("#ui_radBusiness").prop('checked', true);

            $("#ui_chkIsBusinerOrIndividualMem").click();
            needToOpendDiv = true;
        }
        if (ruleConditions.IsOfflineOrOnlinePurchase != null) {

            if (ruleConditions.IsOfflineOrOnlinePurchase == false)
                $("#ui_radOnline").prop('checked', true);
            else
                $("#ui_radOffline").prop('checked', true);

            $("#ui_chkIsOfflineOrOnlineMem").click();
            needToOpendDiv = true;
        }
        if (ruleConditions.LastPurchaseIntervalCondition > 0) {

            $("#ui_ddlLastPurchaseCondition").val(ruleConditions.LastPurchaseIntervalCondition);
            $("#ui_txtLastPurchaseRange1").val(ruleConditions.LastPurchaseIntervalRange1);
            if ($("#ui_ddlLastPurchaseCondition").val() == "3") {
                $("#ui_txtLastPurchaseRange2").val(ruleConditions.LastPurchaseIntervalRange2);
                $("#ui_ddlLastPurchaseCondition").change();
            }
            $("#ui_chkLastPurchase").click();
            needToOpendDiv = true;
        }
        if (ruleConditions.CustomerExpirdayIntervalCondition > 0) {

            $("#ui_ddlExpirydayCondition").val(ruleConditions.CustomerExpirdayIntervalCondition);
            $("#ui_txtExpirydayRange1").val(ruleConditions.CustomerExpirdayIntervalRange1);
            if ($("#ui_ddlExpirydayCondition").val() == "3") {
                $("#ui_txtExpiryday2").val(ruleConditions.CustomerExpirdayIntervalRange2);
                $("#ui_ddlExpirydayCondition").change();
            }
            $("#ui_chkExpiryday").click();
            needToOpendDiv = true;
        }
    }

    if (needToOpendDiv) {
        $("#ui_imgInteraction").removeClass("ExpandImage").addClass("CollapseImg");
        $("#dvui_imgInteraction").show();
    }
};

BindInteractionEventData = function () {
    var needToOpendDiv = false;
    if (ruleConditions.ImpressionEventForFormId > -1) {
        needToOpendDiv = true;
        $("#ui_ddlFormImpression").val(ruleConditions.ImpressionEventForFormId);
        $("#ui_txtFormImpressionCount").val(ruleConditions.ImpressionEventCountCondition);
        $("#ui_chkFormImpression").click();
    }
    if (ruleConditions.CloseEventForFormId > -1) {
        needToOpendDiv = true;
        $("#ui_ddlFormCloseEvent").val(ruleConditions.CloseEventForFormId);
        $("#ui_txtFormCloseEventCount").val(ruleConditions.CloseEventCountCondition);
        $("#ui_chkFormCloseEvent").click();
    }
    if (ruleConditions.ResponsesEventForFormId > -1) {
        needToOpendDiv = true;
        $("#ui_ddlResponseCountEvent").val(ruleConditions.ResponsesEventForFormId);
        $("#ui_txtResponseCountEventCount").val(ruleConditions.ResponsesEventCountCondition);
        $("#ui_chkResponseCountEvent").click();
    }
    if (ruleConditions.ShowFormOnlyNthTime > 0) {
        needToOpendDiv = true;
        $("#ui_txtShowFormAtNTime").val(ruleConditions.ShowFormOnlyNthTime);
        $("#ui_chkShowFormAtNTime").click();
    }
    if (needToOpendDiv) {
        $("#ui_imgInteractionEvent").removeClass("ExpandImage").addClass("CollapseImg");
        $("#dvui_imgInteractionEvent").show();
    }
};

BindProfileData = function () {
    var needToOpendDiv = false;
    if (ruleConditions.OnlineSentimentIs > 0) {
        $("#ui_ddlOnlineSentimentIs").val(ruleConditions.OnlineSentimentIs);
        $("#ui_chkOnlineSentimentIs").click();
        needToOpendDiv = true;
    }
    if (ruleConditions.SocialStatusIs > 0) {
        $("#ui_ddlSocialStatus").val(ruleConditions.SocialStatusIs);
        $("#ui_chkSocialStatusIs").click();
        needToOpendDiv = true;
    }
    if (ruleConditions.InfluentialScoreCondition > 0) {
        $("#ui_ddlInfluentialScoreIs").val(ruleConditions.InfluentialScoreCondition);
        $("#ui_txtInfluentialScore1").val(ruleConditions.InfluentialScore1);
        if ($("#ui_ddlInfluentialScoreIs").val() == "3") {
            $("#ui_txtInfluentialScore2").val(ruleConditions.InfluentialScore2);
            $("#ui_ddlInfluentialScoreIs").change();
        }
        $("#ui_chkInfluentialScoreIs").click();
        needToOpendDiv = true;
    }
    if (ruleConditions.OfflineSentimentIs > 0) {
        $("#ui_ddlOfflineSentiment").val(ruleConditions.OfflineSentimentIs);
        $("#ui_chkOfflineSentimentIs").click();
        needToOpendDiv = true;
    }
    if (ruleConditions.ProductRatingIs > 0) {
        $("#ui_ddlRating").val(ruleConditions.ProductRatingIs);
        $("#ui_chkProductRatingIs").click();
        needToOpendDiv = true;
    }
    if (ruleConditions.NurtureStatusIs >= 0) {
        $("#ui_ddlProspectStatus").val(ruleConditions.NurtureStatusIs);
        $("#ui_chkProspectStatusIs").click();
        needToOpendDiv = true;
    }
    if (ruleConditions.GenderIs != null && ruleConditions.GenderIs.length > 0) {
        $("#ui_ddlProspectGender").val(ruleConditions.GenderIs);
        $("#ui_chkProspectGenderIs").click();
        needToOpendDiv = true;
    }
    if (ruleConditions.MaritalStatusIs != null && ruleConditions.MaritalStatusIs > 0) {
        $("#ui_ddlMartialStatus").val(ruleConditions.MaritalStatusIs);
        $("#ui_chkMartialStatus").click();
        needToOpendDiv = true;
    }
    if (ruleConditions.ProfessionIs != null && ruleConditions.ProfessionIs.length > 0) {
        $("#ui_txtIndustryIs").val(ruleConditions.ProfessionIs);
        $("#ui_chkIndustryIs").click();
        needToOpendDiv = true;
    }
    if (ruleConditions.NotConnectedSocially > 0) {
        $("#ui_ddlConnectedSocially").val(ruleConditions.NotConnectedSocially);
        $("#ui_chkIsConnectedSocially").click();
        needToOpendDiv = true;
    }
    if (ruleConditions.LoyaltyPointsCondition > 0) {
        $("#ui_ddlProspectLoyaltyIs").val(ruleConditions.LoyaltyPointsCondition);
        $("#ui_txtProspectLoyalty1").val(ruleConditions.LoyaltyPointsRange1);
        if ($("#ui_ddlProspectLoyaltyIs").val() == "3") {
            $("#ui_txtProspectLoyalty2").val(ruleConditions.LoyaltyPointsRange2);
            $("#ui_ddlProspectLoyaltyIs").change();
        }
        $("#ui_chkProspectLoyaltyIs").click();
        needToOpendDiv = true;
    }
    if (ruleConditions.RFMSScoreRangeCondition > 0) {
        $("#ui_ddlRFMSScore").val(ruleConditions.RFMSScoreRangeCondition);
        $("#ui_txtRFMSScore1").val(ruleConditions.RFMSScoreRange1);
        if ($("#ui_ddlRFMSScore").val() == "3") {
            $("#ui_txtRFMSScore2").val(ruleConditions.RFMSScoreRange2);
            $("#ui_ddlRFMSScore").change();
        }
        $("#ui_chkRFMSScoreIs").click();
        needToOpendDiv = true;
    }
    if (needToOpendDiv) {
        $("#ui_imgProfile").removeClass("ExpandImage").addClass("CollapseImg");
        $("#dvui_imgProfile").show();
    }
};

RulesData = function (id) {
    ruleConditions.FormId = id;
    ruleConditions.countOfRules = 0;
    AssignAudienceData();
    BehaviorData();
    InteractionData();
    InteractionEventData();
    ProfileData();
};

AssignAudienceData = function () {
    if ($("#ui_chkVisitorType").is(":checked")) {
        ruleConditions.IsLead = $("input:radio[name='VisitorType']:checked").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.IsLead = -1;
    }
    if ($("#ui_chkSegment").is(":checked")) {
        ruleConditions.IsBelong = $("input:radio[name='BelongsGroup']:checked").val();
        ruleConditions.BelongsToGroup = GetListDataBySpanId($("#ui_txtGroups_values"), "value", "").join(",");
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.IsBelong = 0;
        ruleConditions.BelongsToGroup = "";
    }
    return ruleConditions;
};

BehaviorData = function () {
    if ($("#ui_chkBehavioralScore").is(":checked")) {
        ruleConditions.BehavioralScoreCondition = $("#ui_ddlBehavioralScoreRange").val();
        ruleConditions.BehavioralScore1 = $("#ui_VisitorScore1").val();
        if ($("#ui_ddlBehavioralScoreRange").val() == "3")
            ruleConditions.BehavioralScore2 = $("#ui_VisitorScore2").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.BehavioralScoreCondition = ruleConditions.BehavioralScore1 = ruleConditions.BehavioralScore2 = 0;
    }
    if ($("#ui_chkSessionIs").is(":checked")) {
        ruleConditions.SessionIs = $("#ui_txtSession").val();
        if ($("#ui_radSessionIsFalse").is(":checked"))
            ruleConditions.SessionConditionIsTrueOrIsFalse = false;
        else
            ruleConditions.SessionConditionIsTrueOrIsFalse = true;
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.SessionIs = 0;
        ruleConditions.SessionConditionIsTrueOrIsFalse = true;
    }
    if ($("#ui_chkPageDepthIs").is(":checked")) {
        ruleConditions.PageDepthIs = $("#ui_txtPageDepthIs").val();
        if ($("#ui_radPageDepthIsFalse").is(":checked"))
            ruleConditions.PageDepthConditionIsTrueOrIsFalse = false;
        else
            ruleConditions.PageDepthConditionIsTrueOrIsFalse = true
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.PageDepthIs = 0;
    }
    if ($("#ui_chkPageViewIs").is(":checked")) {
        ruleConditions.NPageVisited = $("#ui_txtPageViewIs").val();
        if ($("#ui_radPageViewIsFalse").is(":checked"))
            ruleConditions.PageViewConditionIsTrueOrIsFalse = false;
        else
            ruleConditions.PageViewConditionIsTrueOrIsFalse = true;
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.NPageVisited = 0;
    }
    if ($("#ui_chkFrequencyIs").is(":checked")) {
        ruleConditions.FrequencyIs = $("#ui_txtFrequencyIs").val();
        if ($("#ui_radFrequencyIsFalse").is(":checked"))
            ruleConditions.FrequencyConditionIsTrueOrIsFalse = false;
        else
            ruleConditions.FrequencyConditionIsTrueOrIsFalse = true;
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.FrequencyIs = 0;
    }
    if ($("#ui_chkOnPageUrl").is(":checked")) {
        ruleConditions.PageUrl = $("#ui_txtPageUrl").val();
        if ($("#ui_PageUrlCheckContains").is(":checked"))
            ruleConditions.IsPageUrlContainsCondition = 1;
        else
            ruleConditions.IsPageUrlContainsCondition = 0;
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.PageUrl = "";
    }
    if ($("#ui_chkSourceIs").is(":checked")) {
        if ($("#ui_radSourceIsDirect").is(":checked")) {
            ruleConditions.IsReferrer = 1;
        }
        else if ($("#ui_radSourceIsReferrer").is(":checked")) {
            ruleConditions.IsReferrer = 2
            ruleConditions.ReferrerUrl = $("#ui_txtSourceIs").val();
            if ($("#ui_chkCheckSourceDomainOnly").is(":checked"))
                ruleConditions.CheckSourceDomainOnly = true;
        }
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.IsReferrer = 0;
        ruleConditions.CheckSourceDomainOnly = false;
    }
    if ($("#ui_chkIsMailRespondent").is(":checked")) {
        ruleConditions.IsMailIsRespondent = 1;
        if ($("#ui_radMailRespondentIsFalse").is(":checked"))
            ruleConditions.MailRespondentConditionIsTrueOrIsFalse = false;
        else
            ruleConditions.MailRespondentConditionIsTrueOrIsFalse = true;
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.IsMailIsRespondent = 0;
    }
    if ($("#ui_chkSearchKeywordIs").is(":checked")) {
        ruleConditions.SearchString = $("#ui_txtSearchKeyword").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.SearchString = "";
    }
    if ($("#ui_chkCountryIs").is(":checked")) {
        ruleConditions.Country = GetListDataBySpanId($("#ui_txtCountry_values"), "value", "").join("@$");
        if ($("#ui_radCountryIsFalse").is(":checked"))
            ruleConditions.CountryConditionIsTrueOrIsFalse = false;
        else
            ruleConditions.CountryConditionIsTrueOrIsFalse = true;
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.Country = "";
    }
    if ($("#ui_chkCityIs").is(":checked")) {
        ruleConditions.City = GetListDataBySpanId($("#ui_txtCity_values"), "value", "").join("@$");
        if ($("#ui_radCityIsFalse").is(":checked"))
            ruleConditions.CityConditionIsTrueOrIsFalse = false;
        else
            ruleConditions.CityConditionIsTrueOrIsFalse = true;
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.City = "";
    }
    if ($("#ui_chkAlreadyVisitedPages").is(":checked")) {
        ruleConditions.AlreadyVisitedPages = $("#ui_txtAlreadyVisitedPageUrls").val();
        if ($("#ui_radAlreadyVisitedPagesIsTrue").is(":checked"))
            ruleConditions.AlreadyVisitedPagesConditionIsTrueOrIsFalse = true;
        else
            ruleConditions.AlreadyVisitedPagesConditionIsTrueOrIsFalse = false;
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.AlreadyVisitedPages = "";
    }
    if ($("#ui_chkTimeSpentInSite").is(":checked")) {
        ruleConditions.OverAllTimeSpentInSite = $("#ui_txtTimeSpentInSite").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.OverAllTimeSpentInSite = 0;
    }
    if ($("#ui_chkIsAndriodMobile").is(":checked")) {
        if ($("#ui_radMobileDeviceConditionIsTrue").is(":checked"))
            ruleConditions.IsMobileDevice = 1;
        else
            ruleConditions.IsMobileDevice = 2;
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.IsMobileDevice = 0;
    }
    return ruleConditions;
};

InteractionData = function () {
    if ($("#ui_chkClickedButton").is(":checked")) {
        if ($("#ui_radClickedRecentBtn").is(":checked"))
            ruleConditions.ClickedRecentButtonOrOverAll = 1;
        else
            ruleConditions.ClickedRecentButtonOrOverAll = 0;
        ruleConditions.IsClickedSpecificButtons = GetListDataBySpanId($("#ui_txtClickButton_values"), "value", "clkBtn_").join(",");
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.IsClickedSpecificButtons = "";
    }
    if ($("#ui_chkClickedPriceRange").is(":checked")) {
        ruleConditions.ClickedPriceRangeProduct = GetListDataBySpanId($("#ui_txtPriceRangeProducts_values"), "value", "").join(",");
        ruleConditions.IsClickedPriceRangeCondition = 1;
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.ClickedPriceRangeProduct = "";
    }
    if ($("#ui_chkRespondedInChat").is(":checked")) {
        ruleConditions.IsVisitorRespondedChat = 1;
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.IsVisitorRespondedChat = 0;
    }
    if ($("#ui_chkMailResponseStage").is(":checked")) {
        ruleConditions.MailCampignResponsiveStage = $("#ui_ddlMailScore").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.MailCampignResponsiveStage = 0;
    }
    if ($("#ui_chkRespondedForm").is(":checked")) {
        ruleConditions.IsRespondedForm = $("#ui_ddlRespondedFroms").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.IsRespondedForm = 0;
    }
    if ($("#ui_chkNotRespondedForm").is(":checked")) {
        ruleConditions.IsNotRespondedForm = $("#ui_ddlNotRespondedFroms").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.IsNotRespondedForm = 0;
    }
    if ($("#ui_chkAnswerDependencyForm").is(":checked")) {
        ruleConditions.DependencyFormId = $("#ui_ddlAnswerDependencyFroms").val();
        ruleConditions.DependencyFormField = $("input:radio[name='AnswerDependencyFieldOption']:checked").val();
        ruleConditions.DependencyFormAnswer1 = CleanText($("#ui_txtAnswerCondition1").val());
        ruleConditions.DependencyFormAnswer2 = CleanText($("#ui_txtAnswerCondition2").val());
        ruleConditions.DependencyFormCondition = $("#ui_ddlAnswerCondition").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.DependencyFormId = 0;
    }
    if ($("#ui_chkClosedNTimes").is(":checked")) {
        ruleConditions.CloseCount = $("#ui_txtClosedNTimes").val();
        ruleConditions.CloseCountSessionWiseOrOverAll = $("input:radio[name='CloseCountSessionWiseOrOverAll']:checked").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.CloseCount = 0;
    }
    if ($("#ui_chkAddedToCart").is(":checked")) {
        ruleConditions.AddedProductsToCart = GetListDataBySpanId($("#ui_txtAddedToCartProducts_values"), "value", "").join(",");
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.AddedProductsToCart = "";
    }
    ////Walmart Starts
    if ($("#hdn_domainName").val().indexOf("bestpricewholesale.co.in") > -1) {
        if ($("#ui_chkViewedNotAddedToCart").is(":checked")) {
            if ($("#ui_radNotInCart").is(":checked"))
                ruleConditions.ViewedProductAreInCartOrNot = false;
            else
                ruleConditions.ViewedProductAreInCartOrNot = true;

            if ($("#ui_radViewedProductSingle").is(":checked")) {
                ruleConditions.ViewedProductAllProductOrSingle = false;
                ruleConditions.ViewedButNotAddedProductsToCart = GetListDataBySpanId($("#ui_txtViewedNotAddedToCartProducts_values"), "value", "").join(",");
            } else {
                ruleConditions.ViewedProductAllProductOrSingle = true;
                ruleConditions.ViewedButNotAddedProductsToCart = "";
            }
            ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
        }
        else {
            ruleConditions.ViewedProductAreInCartOrNot = 0;
            ruleConditions.ViewedProductAllProductOrSingle = 0;
            ruleConditions.ViewedButNotAddedProductsToCart = "";
        }
        if ($("#ui_chkDropedFromCart").is(":checked")) {
            if ($("#ui_radDroppedProductSingle").is(":checked")) {
                ruleConditions.DroppedProductsFromCartIsAllProductOrSingle = false;
                ruleConditions.DroppedProductsFromCart = GetListDataBySpanId($("#ui_txtDropedFromCartProducts_values"), "value", "").join(",");
            } else {
                ruleConditions.DroppedProductsFromCartIsAllProductOrSingle = true;
                ruleConditions.DroppedProductsFromCart = "";
            }
            if ($("#ui_chkPriceDropCart").is(":checked"))
                ruleConditions.DroppedProductsFromCartPriceDrop = true;
            else
                ruleConditions.DroppedProductsFromCartPriceDrop = false;
            if ($("#ui_chkSlabCart").is(":checked"))
                ruleConditions.DroppedProductsFromCartSlabExists = true;
            else
                ruleConditions.DroppedProductsFromCartSlabExists = false;

            if ($("#ui_chkFreeBieCart").is(":checked"))
                ruleConditions.DroppedProductsFromCartFreebieExists = true;
            else
                ruleConditions.DroppedProductsFromCartFreebieExists = false;

            ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
        }
        else {
            ruleConditions.DroppedProductsFromCartIsAllProductOrSingle = 0;
            ruleConditions.DroppedProductsFromCartPriceDrop = false;
            ruleConditions.DroppedProductsFromCartSlabExists = false;
            ruleConditions.DroppedProductsFromCartFreebieExists = false;
            ruleConditions.DroppedProductsFromCart = "";
        }
    }
    else {
        if ($("#ui_chkViewedNotAddedToCartAll").is(":checked")) {
            ruleConditions.ViewedButNotAddedProductsToCart = GetListDataBySpanId($("#ui_txtViewedNotAddedToCartProductsAll_values"), "value", "").join(",");
            ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
        }
        else {
            ruleConditions.ViewedButNotAddedProductsToCart = "";
        }
        if ($("#ui_chkDropedFromCartAll").is(":checked")) {
            ruleConditions.DroppedProductsFromCart = GetListDataBySpanId($("#ui_txtDropedFromCartProductsAll_values"), "value", "").join(",");
            ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
        }
        else {
            ruleConditions.DroppedProductsFromCart = "";
        }
    }
    ////Walmart Ends

    if ($("#ui_chkCustomerPurchased").is(":checked")) {
        ruleConditions.PurchasedProducts = GetListDataBySpanId($("#ui_txtCustomerPurchasedProducts_values"), "value", "").join(",");
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.PurchasedProducts = "";
    }
    if ($("#ui_chkCustomerNotPurchased").is(":checked")) {
        ruleConditions.NotPurchasedProducts = GetListDataBySpanId($("#ui_txtCustomerNotPurchasedProducts_values"), "value", "").join(",");
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.NotPurchasedProducts = "";
    }
    if ($("#ui_chkTotalPurchaseIs").is(":checked")) {
        ruleConditions.CustomerTotalPurchase = $("#ui_txtCustomerTotalPurchase").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.CustomerTotalPurchase = 0;
    }
    if ($("#ui_chkCustomerCurrectValue").is(":checked")) {
        ruleConditions.CustomerCurrentValue = $("#ui_txtCustomerCurrentValue").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.CustomerCurrentValue = 0;
    }

    if ($("#ui_chkIsBusinerOrIndividualMem").is(":checked")) {
        if ($("#ui_radBusiness").is(":checked"))
            ruleConditions.IsBusinessOrIndividualMember = true;
        else
            ruleConditions.IsBusinessOrIndividualMember = false;
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.IsBusinessOrIndividualMember = 0;
    }
    if ($("#ui_chkIsOfflineOrOnlineMem").is(":checked")) {
        if ($("#ui_radOffline").is(":checked"))
            ruleConditions.IsOfflineOrOnlinePurchase = true;
        else
            ruleConditions.IsOfflineOrOnlinePurchase = false;
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.IsOfflineOrOnlinePurchase = 0;
    }
    if ($("#ui_chkLastPurchase").is(":checked")) {
        ruleConditions.LastPurchaseIntervalCondition = $("#ui_ddlLastPurchaseCondition").val();
        ruleConditions.LastPurchaseIntervalRange1 = $("#ui_txtLastPurchaseRange1").val();
        if ($("#ui_ddlLastPurchaseCondition").val() == "3")
            ruleConditions.LastPurchaseIntervalRange2 = $("#ui_txtLastPurchaseRange2").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.LastPurchaseIntervalCondition = ruleConditions.LastPurchaseIntervalRange1 = ruleConditions.LastPurchaseIntervalRange2 = 0
    }
    if ($("#ui_chkExpiryday").is(":checked")) {
        ruleConditions.CustomerExpirdayIntervalCondition = $("#ui_ddlExpirydayCondition").val();
        ruleConditions.CustomerExpirdayIntervalRange1 = $("#ui_txtExpirydayRange1").val();
        if ($("#ui_ddlExpirydayCondition").val() == "3")
            ruleConditions.LastPurchaseIntervalRange2 = $("#ui_txtExpiryday2").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.CustomerExpirdayIntervalCondition = ruleConditions.CustomerExpirdayIntervalRange1 = ruleConditions.CustomerExpirdayIntervalRange2 = 0
    }

    return ruleConditions;
};

InteractionEventData = function () {
    if ($("#ui_chkFormImpression").is(":checked")) {
        ruleConditions.ImpressionEventForFormId = $("#ui_ddlFormImpression").val();
        ruleConditions.ImpressionEventCountCondition = $("#ui_txtFormImpressionCount").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.ImpressionEventForFormId = -1;
    }
    if ($("#ui_chkFormCloseEvent").is(":checked")) {
        ruleConditions.CloseEventForFormId = $("#ui_ddlFormCloseEvent").val();
        ruleConditions.CloseEventCountCondition = $("#ui_txtFormCloseEventCount").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.CloseEventForFormId = -1;
    }
    if ($("#ui_chkResponseCountEvent").is(":checked")) {
        ruleConditions.ResponsesEventForFormId = $("#ui_ddlResponseCountEvent").val();
        ruleConditions.ResponsesEventCountCondition = $("#ui_txtResponseCountEventCount").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.ResponsesEventForFormId = -1;
    }
    if ($("#ui_chkShowFormAtNTime").is(":checked")) {
        ruleConditions.ShowFormOnlyNthTime = $("#ui_txtShowFormAtNTime").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.ShowFormOnlyNthTime = 0;
    }
    return ruleConditions;
};

ProfileData = function () {
    if ($("#ui_chkOnlineSentimentIs").is(":checked")) {
        ruleConditions.OnlineSentimentIs = $("#ui_ddlOnlineSentimentIs").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.OnlineSentimentIs = 0;
    }
    if ($("#ui_chkSocialStatusIs").is(":checked")) {
        ruleConditions.SocialStatusIs = $("#ui_ddlSocialStatus").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.SocialStatusIs = 0;
    }
    if ($("#ui_chkInfluentialScoreIs").is(":checked")) {
        ruleConditions.InfluentialScoreCondition = $("#ui_ddlInfluentialScoreIs").val();
        ruleConditions.InfluentialScore1 = $("#ui_txtInfluentialScore1").val();
        if ($("#ui_ddlInfluentialScoreIs").val() == "3")
            ruleConditions.InfluentialScore2 = $("#ui_txtInfluentialScore2").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.InfluentialScoreCondition = 0;
    }
    if ($("#ui_chkOfflineSentimentIs").is(":checked")) {
        ruleConditions.OfflineSentimentIs = $("#ui_ddlOfflineSentiment").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.OfflineSentimentIs = 0;
    }
    if ($("#ui_chkProductRatingIs").is(":checked")) {
        ruleConditions.ProductRatingIs = $("#ui_ddlRating").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.ProductRatingIs = 0;
    }
    if ($("#ui_chkProspectStatusIs").is(":checked")) {
        ruleConditions.NurtureStatusIs = $("#ui_ddlProspectStatus").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.NurtureStatusIs = -1;
    }
    if ($("#ui_chkProspectGenderIs").is(":checked")) {
        ruleConditions.GenderIs = $("#ui_ddlProspectGender").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.GenderIs = "";
    }
    if ($("#ui_chkMartialStatus").is(":checked")) {
        ruleConditions.MaritalStatusIs = $("#ui_ddlMartialStatus").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.MaritalStatusIs = "";
    }
    if ($("#ui_chkIndustryIs").is(":checked")) {
        ruleConditions.ProfessionIs = $("#ui_txtIndustryIs").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.ProfessionIs = "";
    }
    if ($("#ui_chkIsConnectedSocially").is(":checked")) {
        ruleConditions.NotConnectedSocially = $("#ui_ddlConnectedSocially").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.NotConnectedSocially = 0;
    }
    if ($("#ui_chkProspectLoyaltyIs").is(":checked")) {
        ruleConditions.LoyaltyPointsCondition = $("#ui_ddlProspectLoyaltyIs").val();
        ruleConditions.LoyaltyPointsRange1 = $("#ui_txtProspectLoyalty1").val();
        if ($("#ui_ddlProspectLoyaltyIs").val() == "3")
            ruleConditions.LoyaltyPointsRange2 = $("#ui_txtProspectLoyalty2").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.LoyaltyPointsCondition = 0;
    }
    if ($("#ui_chkRFMSScoreIs").is(":checked")) {
        ruleConditions.RFMSScoreRangeCondition = $("#ui_ddlRFMSScore").val();
        ruleConditions.RFMSScoreRange1 = $("#ui_txtRFMSScore1").val();
        if ($("#ui_ddlRFMSScore").val() == "3")
            ruleConditions.RFMSScoreRange2 = $("#ui_txtRFMSScore2").val();
        ruleConditions.countOfRules = ruleConditions.countOfRules + 1;
    }
    else {
        ruleConditions.RFMSScoreRangeCondition = 0;
    }
    return ruleConditions;
};

GetListDataBySpanId = function (spanTag, valueType, replaceId) {
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
};
/// For Rules
////// Groups
$("#ui_txtGroups").autocomplete({
    autoFocus: true,
    minLength: 0, max: 10,
    source: function (request, response) {
        GetValues(request, response, 'GetGroups')
    },
    select: function (events, selectedItem) {
        AppendSelected("ui_txtGroups_values", selectedItem, "group");
    },
    close: function (event, ui) {
        $(this).val("");
    }
});
/// Country
$("#ui_txtCountry").autocomplete({
    autoFocus: true,
    minLength: 1, max: 10,
    source: function (request, response) {
        var matches = $.map(countryList, function (countryList) {
            if (countryList.toUpperCase().indexOf(request.term.toUpperCase()) === 0) {
                return countryList;
            }
        });
        response(matches.slice(0, 10));
    },
    select: function (events, selectedItem) {
        AppendSelected("ui_txtCountry_values", selectedItem, "country");
    },
    close: function (event, ui) {
        $(this).val("");
    }
});
/// City Names
$("#ui_txtCity").autocomplete({
    autoFocus: true,
    minLength: 0, max: 10,
    source: function (request, response) {
        GetValues(request, response, 'GetCityName')
    },
    select: function (events, selectedItem) {
        AppendSelected("ui_txtCity_values", selectedItem, "cityName");
    },
    close: function (event, ui) {
        $(this).val("");
    }
});
/// Event
$("#ui_txtRecentClickButton").autocomplete({
    autoFocus: true,
    minLength: 0, max: 10,
    source: function (request, response) {
        GetValues(request, response, 'GetEvetList')
    },
    select: function (events, selectedItem) {
        AppendSelected("ui_txtRecentClickButton_values", selectedItem, "recentclkBtn");
    },
    close: function (event, ui) {
        $(this).val("");
    }
});

$("#ui_txtClickButton").autocomplete({
    autoFocus: true,
    minLength: 0, max: 10,
    source: function (request, response) {
        GetValues(request, response, 'GetEvetList')
    },
    select: function (events, selectedItem) {
        AppendSelected("ui_txtClickButton_values", selectedItem, "clkBtn");
    },
    close: function (event, ui) {
        $(this).val("");
    }
});

$("#ui_txtPriceRangeProducts").autocomplete({
    autoFocus: true,
    minLength: 0, max: 10,
    source: function (request, response) {
        GetValues(request, response, 'GetEvetList')
    },
    select: function (events, selectedItem) {
        AppendSelected("ui_txtPriceRangeProducts_values", selectedItem, "ClickProduct");
    },
    close: function (event, ui) {
        $(this).val("");
    }
});
// Products
$("#ui_txtCustomerNotPurchasedProducts").autocomplete({
    autoFocus: true,
    minLength: 0, max: 10,
    source: function (request, response) {
        GetValues(request, response, 'GetProductList')
    },
    select: function (events, selectedItem) {
        AppendSelected("ui_txtCustomerNotPurchasedProducts_values", selectedItem, "NotPurchase");
    },
    close: function (event, ui) {
        $(this).val("");
    }
});

$("#ui_txtCustomerPurchasedProducts").autocomplete({
    autoFocus: true,
    minLength: 0, max: 10,
    source: function (request, response) {
        GetValues(request, response, 'GetProductList')
    },
    select: function (events, selectedItem) {
        AppendSelected("ui_txtCustomerPurchasedProducts_values", selectedItem, "Purchase");
    },
    close: function (event, ui) {
        $(this).val("");
    }
});

$("#ui_txtDropedFromCartProducts").autocomplete({
    autoFocus: true,
    minLength: 0, max: 10,
    source: function (request, response) {
        GetValues(request, response, 'GetProductList')
    },
    select: function (events, selectedItem) {
        AppendSelected("ui_txtDropedFromCartProducts_values", selectedItem, "DropFromCart");
    },
    close: function (event, ui) {
        $(this).val("");
    }
});

$("#ui_txtDropedFromCartProductsAll").autocomplete({
    autoFocus: true,
    minLength: 0, max: 10,
    source: function (request, response) {
        GetValues(request, response, 'GetProductList')
    },
    select: function (events, selectedItem) {
        AppendSelected("ui_txtDropedFromCartProductsAll_values", selectedItem, "DropFromCartAll");
    },
    close: function (event, ui) {
        $(this).val("");
    }
});

$("#ui_txtViewedNotAddedToCartProducts").autocomplete({
    autoFocus: true,
    minLength: 0, max: 10,
    source: function (request, response) {
        GetValues(request, response, 'GetProductList')
    },
    select: function (events, selectedItem) {
        AppendSelected("ui_txtViewedNotAddedToCartProducts_values", selectedItem, "NotAddedToCart");
    },
    close: function (event, ui) {
        $(this).val("");
    }
});

$("#ui_txtViewedNotAddedToCartProductsAll").autocomplete({
    autoFocus: true,
    minLength: 0, max: 10,
    source: function (request, response) {
        GetValues(request, response, 'GetProductList')
    },
    select: function (events, selectedItem) {
        AppendSelected("ui_txtViewedNotAddedToCartProductsAll_values", selectedItem, "NotAddedToCartAll");
    },
    close: function (event, ui) {
        $(this).val("");
    }
});

$("#ui_txtAddedToCartProducts").autocomplete({
    autoFocus: true,
    minLength: 0, max: 10,
    source: function (request, response) {
        GetValues(request, response, 'GetProductList')
    },
    select: function (events, selectedItem) {
        AppendSelected("ui_txtAddedToCartProducts_values", selectedItem, "AddedToCart");
    },
    close: function (event, ui) {
        $(this).val("");
    }
});
////
function GetValues(request, response, method) {
    if (request != "" && method != "") {
        $.ajax({
            url: "FacebookRuleAutoSuggest",
            data: "{ 'action':'" + method + "','q': '" + request.term + "'}",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data.Table.length === 0) {
                    response({ label: 'No matches found' });
                }
                else {
                    response($.map(data.Table, function (item) {
                        switch (method) {
                            case 'GetCityName':
                                return {
                                    label: item.CityName,
                                    value: item.CityName + ""
                                };
                                break;
                            case 'GetEvetList':
                                return {
                                    label: item.label,
                                    value: item.label + ""
                                };
                                break;
                            case 'GetProductList':
                                return {
                                    label: item.label,
                                    value: item.label + ""
                                };
                            case 'GetScreen':
                                return {
                                    label: item.label,
                                    value: item.label + ""
                                };
                            default:
                                return {
                                    label: item.label,
                                    value: item.value + ""
                                };
                                break;
                        }
                    }))
                }
            },
            error: function (xmlHttpRequest) {
                //alert(xmlHttpRequest.responseText);
            }
        });
    }
}