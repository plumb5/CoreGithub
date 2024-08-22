
var ruleConditions = {
    IsLead: -1,
    SocialStatusIs: 0,
    NotConnectedSocially: 0,
    GenderIs: null,
    MaritalStatusIs: 0,
    ProfessionIs: null,
    OverAllTimeSpentInSite: 0,
    TotalPurchaseQtyConditon: 0,
    CustomerTotalPurchase1: 0,
    CustomerTotalPurchase2: 0,
    TotalPurchaseAmtCondition: 0,
    CustomerCurrentValue1: 0,
    CustomerCurrentValue2: 0,
    InfluentialScoreCondition: 0,
    InfluentialScore1: 0,
    InfluentialScore2: 0,
    LastPurchaseIntervalCondition: 0,
    LastPurchaseIntervalRange1: 0,
    LastPurchaseIntervalRange2: 0,
    BehavioralScoreCondition: 0,
    BehavioralScore1: 0,
    BehavioralScore2: 0,
    SessionConditionIsTrueOrIsFalse: false,
    SessionIs: 0,
    PageViewConditionIsTrueOrIsFalse: false,
    NPageVisited: 0,
    MailRespondentConditionIsTrueOrIsFalse: false,
    IsMailIsRespondent: false,
    MailCampignResponsiveStage: 0,
    IsVisitorRespondedChat: false,
    IsBelong: 0,
    BelongsToGroup: null,
    NurtureStatusIs: 0,
    AddedProductsToCart: null,
    DroppedProductsFromCart: null,
    ViewedButNotAddedProductsToCart: null,
    AddedProductsCategoriesToCart: null,
    NotAddedProductsCategoriesToCart: null,
    AddedProductsSubCategoriesToCart: null,
    NotAddedProductsSubCategoriesToCart: null,
    PurchasedProducts: null,
    NotPurchasedProducts: null,
    IsRespondedForm: 0,
    IsNotRespondedForm: 0,  
    DependencyFormId: 0,
    DependencyFormField: 0,
    DependencyFormCondition: 0,
    DependencyFormAnswer1: null,
    DependencyFormAnswer2: null,
    ImpressionEventCountCondition: 0,
    ImpressionEventForFormId: 0,
    CloseEventCountCondition: 0,
    CloseEventForFormId: 0,
    ResponsesEventCountCondition: 0,
    ResponsesEventForFormId: 0,
    LoyaltyPointsCondition: 0,
    LoyaltyPointsRange1: 0,
    LoyaltyPointsRange2: 0,
    City: null,
    CityConditionIsTrueOrIsFalse: false,
    Country: null,
    CountryConditionIsTrueOrIsFalse: false,
    IsClickedSpecificButtons: null,
    IsNotClickedSpecificButtons: null,
    ClickedPriceRangeProduct: null,
    PageDepthIs: 0,
    PageDepthConditionIsTrueOrIsFalse: false,
    FrequencyIs: 0,
    FrequencyConditionIsTrueOrIsFalse: false,  
    IsReferrer: 0,
    ReferrerUrl: null,
    CheckSourceDomainOnly: false,
    SearchString: null,
    AlreadyVisitedPages: null,
    IsMobileDevice: 0,
    AlreadyVisitedPagesConditionIsTrueOrIsFalse: false,
    ClickedRecentButtonOrOverAll: false
}


var countryList = new Array("AFGHANISTAN", "ALAND ISLANDS", "ALBANIA", "ALGERIA", "AMERICAN SAMOA", "ANDORRA", "ANGOLA", "ANGUILLA", "ANTARCTICA", "ANTIGUA AND BARBUDA", "ARGENTINA", "ARMENIA", "ARUBA", "AUSTRALIA", "AUSTRIA", "AZERBAIJAN", "BAHAMAS", "BAHRAIN", "BANGLADESH", "BARBADOS", "BELARUS", "BELGIUM", "BELIZE", "BENIN", "BERMUDA", "BHUTAN", "BOLIVIA", "BOSNIA AND HERZEGOVINA", "BOTSWANA", "BRAZIL", "BRITISH INDIAN OCEAN TERRITORY", "BRUNEI DARUSSALAM", "BULGARIA", "BURKINA FASO", "BURUNDI", "CAMBODIA", "CAMEROON", "CANADA", "CAPE VERDE", "CAYMAN ISLANDS", "CENTRAL AFRICAN REPUBLIC", "CHAD", "CHILE", "CHINA", "CHRISTMAS ISLAND", "COLOMBIA", "COMOROS", "CONGO", "CONGO, THE DEMOCRATIC REPUBLIC OF THE", "COOK ISLANDS", "COSTA RICA", "COTE D'IVOIRE", "CROATIA", "CUBA", "CURAA‡AO", "CURAÃ‡AO", "CYPRUS", "CZECH REPUBLIC", "DEMOCRATIC PEOPLE'S REPUBLIC OF KOREA", "DENMARK", "DJIBOUTI", "DOMINICA", "DOMINICAN REPUBLIC", "ECUADOR", "EGYPT", "EL SALVADOR", "EQUATORIAL GUINEA", "ERITREA", "ESTONIA", "ETHIOPIA", "FALKLAND ISLANDS (MALVINAS)", "FAROE ISLANDS", "FIJI", "FINLAND", "FRANCE", "FRENCH GUIANA", "FRENCH POLYNESIA", "FRENCH SOUTHERN TERRITORIES", "GABON", "GAMBIA", "GEORGIA", "GERMANY", "GHANA", "GIBRALTAR", "GREECE", "GREENLAND", "GRENADA", "GUADELOUPE", "GUAM", "GUATEMALA", "GUERNSEY", "GUINEA", "GUINEA-BISSAU", "GUYANA", "HAITI", "HEARD ISLAND AND MCDONALD ISLANDS", "HOLY SEE (VATICAN CITY STATE)", "HONDURAS", "HONG KONG", "HUNGARY", "ICELAND", "INDIA", "INDONESIA", "IRAN, ISLAMIC REPUBLIC OF", "IRAQ", "IRELAND", "ISLE OF MAN", "ISRAEL", "ITALY", "JAMAICA", "JAPAN", "JORDAN", "KAZAKHSTAN", "KENYA", "KIRIBATI", "KOREA, REPUBLIC OF", "KUWAIT", "KYRGYZSTAN", "LAO PEOPLE'S DEMOCRATIC REPUBLIC", "LATVIA", "LEBANON", "LESOTHO", "LIBERIA", "LIBYAN ARAB JAMAHIRIYA", "LIECHTENSTEIN", "LITHUANIA", "LUXEMBOURG", "MACAO", "MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF", "MADAGASCAR", "MALAWI", "MALAYSIA", "MALDIVES", "MALI", "MALTA", "MARSHALL ISLANDS", "MARTINIQUE", "MAURITANIA", "MAURITIUS", "MAYOTTE", "MEXICO", "MICRONESIA, FEDERATED STATES OF", "MOLDOVA, REPUBLIC OF", "MONACO", "MONGOLIA", "MONTENEGRO", "MONTSERRAT", "MOROCCO", "MOZAMBIQUE", "MYANMAR", "NAMIBIA", "NAURU", "NEPAL", "NETHERLANDS", "NETHERLANDS ANTILLES", "NEW CALEDONIA", "NEW ZEALAND", "NICARAGUA", "NIGER", "NIGERIA", "NIUE", "NORFOLK ISLAND", "NORTHERN MARIANA ISLANDS", "NORWAY", "OMAN", "PAKISTAN", "PALAU", "PALESTINIAN TERRITORY, OCCUPIED", "PANAMA", "PAPUA NEW GUINEA", "PARAGUAY", "PERU", "PHILIPPINES", "POLAND", "PORTUGAL", "PUERTO RICO", "QATAR", "REUNION", "ROMANIA", "RUSSIAN FEDERATION", "RWANDA", "SAINT HELENA", "SAINT KITTS AND NEVIS", "SAINT LUCIA", "SAINT MARTIN", "SAINT PIERRE AND MIQUELON", "SAINT VINCENT AND THE GRENADINES", "SAMOA", "SAN MARINO", "SAO TOME AND PRINCIPE", "SAUDI ARABIA", "SENEGAL", "SERBIA", "SEYCHELLES", "SIERRA LEONE", "SINGAPORE", "SLOVAKIA", "SLOVENIA", "SOLOMON ISLANDS", "SOMALIA", "SOUTH AFRICA", "SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS", "SPAIN", "SRI LANKA", "SUDAN", "SURINAME", "SWAZILAND", "SWEDEN", "SWITZERLAND", "SYRIAN ARAB REPUBLIC", "TAIWAN, PROVINCE OF CHINA", "TAJIKISTAN", "TANZANIA, UNITED REPUBLIC OF", "THAILAND", "TOGO", "TOKELAU", "TONGA", "TRINIDAD AND TOBAGO", "TUNISIA", "TURKEY", "TURKMENISTAN", "TURKS AND CAICOS ISLANDS", "TUVALU", "UGANDA", "UKRAINE", "UNITED ARAB EMIRATES", "UNITED KINGDOM", "UNITED STATES", "UNITED STATES MINOR OUTLYING ISLANDS", "URUGUAY", "UZBEKISTAN", "VANUATU", "VENEZUELA", "VIET NAM", "VIRGIN ISLANDS, BRITISH", "VIRGIN ISLANDS, U.S.", "WALLIS AND FUTUNA", "YEMEN", "YUGOSLAVIA", "ZAMBIA", "ZIMBABWE", "Great Britain (UK)");

var templateDetails = { TemplateId: 0, TempName: "" };
var templateList = Array();
var SmsTemplateList = new Array();

ValidationOfRules = function () {
    // $('.rule input:checked').length > 0
    var len = jQuery('#inner-content-div input[type=checkbox]:checked').length;
    if (len > 0) {
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
    }
    else {
        ShowErrorMessage("please set rule(s).");
        return false;
    }
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
    if ($("#ui_chkNotClickedButton").is(":checked") && $("#ui_txtNotClickButton_values").children().length == 0) {
        ShowErrorMessage("Display Rules -> Interaction -> Please enter select Button tag names");
        $("#ui_txtNotClickButton").focus();
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
    if ($("#ui_chkViewedNotAddedToCart").is(":checked") && $("#ui_txtViewedNotAddedToCartProducts_values").children().length == 0) {
        ShowErrorMessage("Display Rules -> Interaction -> Please select products");
        $("#ui_txtViewedNotAddedToCartProducts").focus();
        return false;
    }
    if ($("#ui_chkDropedFromCart").is(":checked") && $("#ui_txtDropedFromCartProducts_values").children().length == 0) {
        ShowErrorMessage("Display Rules -> Interaction -> Please select products");
        $("#ui_txtDropedFromCartProducts").focus();
        return false;
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
    if ($("#ui_chkTotalPurchaseIs").is(":checked")) {
        if ($("#ui_txtCustomerTotalQtyPurchase1").val().length == 0) {
            ShowErrorMessage("Display Rules -> Interaction -> Please enter customer total purchase");
            $("#ui_txtCustomerTotalQtyPurchase1").focus();
            return false;
        }
        else if ($("#ui_ddlTotalPurchaseQtyCondition").val() == "3" && $("#ui_txtCustomerTotalQtyPurchase2").val().length == 0) {
            ShowErrorMessage("Display Rules -> Profile -> Please enter customer total purchase range correctly");
            $("#ui_txtCustomerTotalQtyPurchase2").focus();
            return false;
        }
        else if ($("#ui_ddlTotalPurchaseQtyCondition").val() == "3" && parseInt($("#ui_txtCustomerTotalQtyPurchase1").val()) > parseInt($("#ui_txtCustomerTotalQtyPurchase2").val())) {
            ShowErrorMessage("Display Rules -> Profile -> Please enter customer total purchase range correctly");
            $("#ui_txtCustomerTotalQtyPurchase2").focus();
            return false;
        }
    }
    if ($("#ui_chkCustomerCurrectValue").is(":checked")) {
        if ($("#ui_txtCustomerCurrentValue1").val().length == 0) {
            ShowErrorMessage("Display Rules -> Interaction -> Please enter customer current value");
            $("#ui_txtCustomerCurrentValue1").focus();
            return false;
        }
        else if ($("#ui_ddlTotalPurchaseAmountCondition").val() == "3" && $("#ui_txtCustomerCurrentValue2").val().length == 0) {
            ShowErrorMessage("Display Rules -> Profile -> Please enter customer current value range correctly");
            $("#ui_txtCustomerCurrentValue2").focus();
            return false;
        }
        else if ($("#ui_ddlTotalPurchaseAmountCondition").val() == "3" && parseInt($("#ui_txtCustomerCurrentValue1").val()) > parseInt($("#ui_txtCustomerCurrentValue2").val())) {
            ShowErrorMessage("Display Rules -> Profile -> Please enter customer current value range correctly");
            $("#ui_txtCustomerCurrentValue2").focus();
            return false;
        }
    }
    if ($("#ui_chkCategoriesAddedToCart").is(":checked") && $("#ui_txtAddedToCartProductsCategories_values").children().length == 0) {
        ShowErrorMessage("Display Rules -> Interaction -> Please select products categories");
        $("#ui_chkCategoriesAddedToCart").focus();
        return false;
    }
    if ($("#ui_chkCategoriesNotAddedToCart").is(":checked") && $("#ui_txtNotAddedToCartProductsCategories_values").children().length == 0) {
        ShowErrorMessage("Display Rules -> Interaction -> Please select products categories");
        $("#ui_chkCategoriesNotAddedToCart").focus();
        return false;
    }
    if ($("#ui_chkSubCategoriesAddedToCart").is(":checked") && $("#ui_txtAddedToCartProductsSubCategories_values").children().length == 0) {
        ShowErrorMessage("Display Rules -> Interaction -> Please select products subcategories");
        $("#ui_chkSubCategoriesAddedToCart").focus();
        return false;
    }
    if ($("#ui_chkSubCategoriesNotAddedToCart").is(":checked") && $("#ui_txtNotAddedToCartProductsSubCategories_values").children().length == 0) {
        ShowErrorMessage("Display Rules -> Interaction -> Please select products subcategories");
        $("#ui_chkSubCategoriesNotAddedToCart").focus();
        return false;
    }
    if ($("#ui_chkCustomerLastPurchase").is(":checked")) {
        if ($('#ui_ddlLastPurchaseCondition option:selected').val() != "3" && $("#ui_txtLastPurchaseRange1").val().length == 0) {
            ShowErrorMessage("Display Rules -> Interaction -> Please enter customer last purchased day");
            $("#ui_txtCustomerTotalPurchase2").focus();
            return false;
        }
        else if ($('#ui_ddlLastPurchaseCondition option:selected').val() == "3") {

            if ($("#ui_txtLastPurchaseRange1").val().length == 0 || $("#ui_txtLastPurchaseRange2").val().length == 0) {
                ShowErrorMessage("Display Rules -> Interaction -> Please enter customer last purchased day");
                return false;
            } else {
                if (parseInt($("#ui_txtLastPurchaseRange2").val()) <= parseInt($("#ui_txtLastPurchaseRange1").val())) {
                    ShowErrorMessage("Display Rules -> Interaction -> Please enter customer last purchased day range correctly");
                    return false;
                }
            }
        }
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

   
    return true;
};
$(".rule").click(function () {

    if ($("#" + $(this).attr("id") + "Td").is(":visible")) {
        $("#" + $(this).attr("id") + "Td").hide();
        $("#" + $(this).attr("id") + "Td input[type='text']").val("");        
        $("#" + $(this).attr("id") + "Td select").find('option:eq(0)').prop("selected", "selected");       
    }
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

$("#ui_ddlTotalPurchaseQtyCondition").change(function () {
    if ($(this).val() == "3")
        $("#ui_txtCustomerTotalQtyPurchase2").show();
    else
        $("#ui_txtCustomerTotalQtyPurchase2").hide();
});

$("#ui_ddlTotalPurchaseAmountCondition").change(function () {
    if ($(this).val() == "3")
        $("#ui_txtCustomerCurrentValue2").show();
    else
        $("#ui_txtCustomerCurrentValue2").hide();
});

$(".ruleSeparator > img ").click(function () {

    if ($("#dv" + $(this).attr("id")).is(":visible")) {
        $("#dv" + $(this).attr("id")).hide();       
        $(this).removeClass("CollapseImg").addClass("ExpandImage");
        //if (($(this).attr("id")) != "ui_imgAudience" && ($(this).attr("id")) != "ui_imgInteractionEvent") {
        //    $("#dv" + $(this).attr("id")).slimScroll({
        //        destroy: true
        //    });
        //}
        
    }
    else {
        $("#dv" + $(this).attr("id")).show();
        $(this).removeClass("ExpandImage").addClass("CollapseImg");
        //if (($(this).attr("id")) != "ui_imgAudience" && ($(this).attr("id")) != "ui_imgInteractionEvent") {
        //    SetslimScroll("#dv" + $(this).attr("id"));
        //}

       
       
    }
});

$(".ruleSeparator > label ").click(function () {
    $("#" + $(this).attr("for")).click();
});

$("input:radio[name=ReportMail]").click(function () {
    if ($("#dvReportToMailConditionalFields"))
        $("#dvReportToMailConditionalFields").empty();
    if ($("#dvReportToMailConditionalOptions"))
        $("#dvReportToMailConditionalOptions").empty();

    if ($("#ui_chkReportMail").is(":checked"))
        $("#ReportMail_Tr").show();

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

function BindFields() {
    var dropDownFields = new Array("Mobile", "LandLine", "Fax", "Letter");
}
IntializeAutoComplete =function (fieldId, methodUrl, minLength, appendObject, extraFieldId) {

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
    removeDiv.setAttribute("onclick", "RemoveData('" + fieldId + "_" + data.item.value.replace(/[ ,:/]+/g, "_") + "');");

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

BindAudienceData = function (ruleConditions) {

    if (ruleConditions.IsLead > -1) {
        $("input:radio[name='VisitorType'][value='" + ruleConditions.IsLead + "']").prop('checked', true);
        $("#ui_chkVisitorType").click().prop("checked",true);
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

BindBehaviorData = function (ruleConditions) {

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

BindInteractionData = function (ruleConditions) {
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
    if (ruleConditions.IsNotClickedSpecificButtons != null && ruleConditions.IsNotClickedSpecificButtons.length > 0) {
        needToOpendDiv = true;
        var clickedTags = ruleConditions.IsNotClickedSpecificButtons.split(",");
        for (var i = 0; i < clickedTags.length; i++) {

            var idAndLabel = clickedTags[i]
            var data = new Array();
            data["item"] = new Array();
            data.item.value = idAndLabel;
            data.item.label = idAndLabel;
            AppendSelected("ui_txtNotClickButton_values", data, "clkBtn");

        }
        $("#ui_chkNotClickedButton").click();
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
            var idAndLabel = products[i].split("->");
            var data = new Array();
            data["item"] = new Array();
            data.item.value = idAndLabel[0];
            data.item.label = idAndLabel[1];

            AppendSelected("ui_txtAddedToCartProducts_values", data, "AddedToCart");
        }

        $("#ui_chkAddedToCart").click();

    }
    if (ruleConditions.ViewedButNotAddedProductsToCart != null && ruleConditions.ViewedButNotAddedProductsToCart.length > 0) {
        needToOpendDiv = true;
        var products = ruleConditions.ViewedButNotAddedProductsToCart.split("@#");
        for (var i = 0; i < products.length; i++) {
            var idAndLabel = products[i].split("-");
            var data = new Array();
            data["item"] = new Array();
            data.item.value = idAndLabel[0];
            data.item.label = idAndLabel[1];

            AppendSelected("ui_txtViewedNotAddedToCartProducts_values", data, "NotAddedToCart");
        }
        $("#ui_chkViewedNotAddedToCart").click();

    }
    if (ruleConditions.DroppedProductsFromCart != null && ruleConditions.DroppedProductsFromCart.length > 0) {
        needToOpendDiv = true;
        var products = ruleConditions.DroppedProductsFromCart.split("@#");
        for (var i = 0; i < products.length; i++) {
            var idAndLabel = products[i].split("-");
            var data = new Array();
            data["item"] = new Array();
            data.item.value = idAndLabel[0];
            data.item.label = idAndLabel[1];

            AppendSelected("ui_txtDropedFromCartProducts_values", data, "DropFromCart");
        }
        $("#ui_chkDropedFromCart").click();

    }
    if (ruleConditions.PurchasedProducts != null && ruleConditions.PurchasedProducts.length > 0) {

        needToOpendDiv = true;
        var products = ruleConditions.PurchasedProducts.split("@#");
        for (var i = 0; i < products.length; i++) {
            var idAndLabel = products[i].split("-");
            var data = new Array();
            data["item"] = new Array();
            data.item.value = idAndLabel[0];
            data.item.label = idAndLabel[1];

            AppendSelected("ui_txtCustomerPurchasedProducts_values", data, "Purchase");
        }
        $("#ui_chkCustomerPurchased").click();

    }
    if (ruleConditions.NotPurchasedProducts != null && ruleConditions.NotPurchasedProducts.length > 0) {

        needToOpendDiv = true;
        var products = ruleConditions.NotPurchasedProducts.split("@#");
        for (var i = 0; i < products.length; i++) {
            var idAndLabel = products[i].split("-");
            var data = new Array();
            data["item"] = new Array();
            data.item.value = idAndLabel[0];
            data.item.label = idAndLabel[1];
            AppendSelected("ui_txtCustomerNotPurchasedProducts_values", data, "NotPurchase");
        }
        $("#ui_chkCustomerNotPurchased").click();
    }
    if (ruleConditions.TotalPurchaseQtyConditon > 0) {
        needToOpendDiv = true;
        $("#ui_ddlTotalPurchaseQtyCondition").val(ruleConditions.TotalPurchaseQtyConditon);
        $("#ui_txtCustomerTotalQtyPurchase1").val(ruleConditions.CustomerTotalPurchase1);
        if ($("#ui_ddlTotalPurchaseQtyCondition").val() == "3") {
            $("#ui_txtCustomerTotalQtyPurchase2").val(ruleConditions.CustomerTotalPurchase2);
            $("#ui_ddlTotalPurchaseQtyCondition").change();
        }
        $("#ui_chkTotalPurchaseIs").click();
    }
    if (ruleConditions.TotalPurchaseAmtCondition > 0) {
        needToOpendDiv = true;
        $("#ui_ddlTotalPurchaseAmountCondition").val(ruleConditions.TotalPurchaseAmtCondition);
        $("#ui_txtCustomerCurrentValue1").val(ruleConditions.CustomerCurrentValue1);
        if ($("#ui_ddlTotalPurchaseAmountCondition").val() == "3") {
            $("#ui_txtCustomerCurrentValue2").val(ruleConditions.CustomerCurrentValue2);
            $("#ui_ddlTotalPurchaseAmountCondition").change();
        }
        $("#ui_chkCustomerCurrectValue").click();
    }
    if (ruleConditions.AddedProductsCategoriesToCart != null && ruleConditions.AddedProductsCategoriesToCart.length > 0) {

        needToOpendDiv = true;
        var products = ruleConditions.AddedProductsCategoriesToCart.split("|");
        for (var i = 0; i < products.length; i++) {         
            var data = new Array();
            data["item"] = new Array();
            data.item.value = products[i];
            data.item.label = products[i];

            AppendSelected("ui_txtAddedToCartProductsCategories_values", data, "CategoriesAddedToCart");
        }

        $("#ui_chkCategoriesAddedToCart").click();

    }
    if (ruleConditions.NotAddedProductsCategoriesToCart != null && ruleConditions.NotAddedProductsCategoriesToCart.length > 0) {

        needToOpendDiv = true;
        var products = ruleConditions.NotAddedProductsCategoriesToCart.split("|");
        for (var i = 0; i < products.length; i++) {
            var data = new Array();
            data["item"] = new Array();
            data.item.value = products[i];
            data.item.label = products[i];

            AppendSelected("ui_txtNotAddedToCartProductsCategories_values", data, "CategoriesnotAddedToCart");
        }

        $("#ui_chkCategoriesNotAddedToCart").click();

    }
    if (ruleConditions.AddedProductsSubCategoriesToCart != null && ruleConditions.AddedProductsSubCategoriesToCart.length > 0) {
        needToOpendDiv = true;
        var products = ruleConditions.AddedProductsSubCategoriesToCart.split("|");
        for (var i = 0; i < products.length; i++) {
            var data = new Array();
            data["item"] = new Array();
            data.item.value = products[i];
            data.item.label = products[i];

            AppendSelected("ui_txtAddedToCartProductsSubCategories_values", data, "SubCategoriesAddedToCart");
        }

        $("#ui_chkSubCategoriesAddedToCart").click();

    }
    if (ruleConditions.NotAddedProductsSubCategoriesToCart != null && ruleConditions.NotAddedProductsSubCategoriesToCart.length > 0) {
        needToOpendDiv = true;
        var products = ruleConditions.NotAddedProductsSubCategoriesToCart.split("|");
        for (var i = 0; i < products.length; i++) {
            var data = new Array();
            data["item"] = new Array();
            data.item.value = products[i];
            data.item.label = products[i];

            AppendSelected("ui_txtNotAddedToCartProductsSubCategories_values", data, "SubCategoriesnotAddedToCart");
        }

        $("#ui_chkSubCategoriesNotAddedToCart").click();

    }
    if (ruleConditions.LastPurchaseIntervalCondition > 0) {
        needToOpendDiv = true;
        if (ruleConditions.LastPurchaseIntervalCondition == 1) {
            $("#ui_txtLastPurchaseRange1").val(ruleConditions.LastPurchaseIntervalRange1);
        } else if (ruleConditions.LastPurchaseIntervalCondition == 2) {
            $("#ui_txtLastPurchaseRange1").val(ruleConditions.LastPurchaseIntervalRange1);
        } else if (ruleConditions.LastPurchaseIntervalCondition == 3) {
            $("#ui_txtLastPurchaseRange1").val(ruleConditions.LastPurchaseIntervalRange1);
            $("#ui_txtLastPurchaseRange2").val(ruleConditions.LastPurchaseIntervalRange2);
        }
        else if (ruleConditions.LastPurchaseIntervalCondition == 4) {
            $("#ui_txtLastPurchaseRange1").val(ruleConditions.LastPurchaseIntervalRange1);
        }
        $("#ui_ddlLastPurchaseCondition").val(ruleConditions.LastPurchaseIntervalCondition).change();

        $("#ui_chkCustomerLastPurchase").click();
    }
    if (needToOpendDiv) {
        $("#ui_imgInteraction").removeClass("ExpandImage").addClass("CollapseImg");
        $("#dvui_imgInteraction").show();
    }

};

BindInteractionEventData = function (ruleConditions) {

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

BindProfileData = function (ruleConditions) {
    var needToOpendDiv = false;
   
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
   
    if (ruleConditions.NurtureStatusIs > 0) {
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
  
    if (needToOpendDiv) {
        $("#ui_imgProfile").removeClass("ExpandImage").addClass("CollapseImg");
        $("#dvui_imgProfile").show();
    }
};
RulesData = function () {
    ruleConditions = {};
    AssignAudienceData();
    BehaviorData();
    InteractionData();
    InteractionEventData();
    ProfileData();
};
AssignAudienceData = function () {

    if ($("#ui_chkVisitorType").is(":checked")) {
        ruleConditions.IsLead = $("input:radio[name='VisitorType']:checked").val();
    }
    else {
        ruleConditions.IsLead = -1;
    }

    if ($("#ui_chkSegment").is(":checked")) {
        ruleConditions.IsBelong = $("input:radio[name='BelongsGroup']:checked").val();
        ruleConditions.BelongsToGroup = GetListDataBySpanId($("#ui_txtGroups_values"), "value", "").join(",");
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
    }
    else {
        ruleConditions.SessionIs = 0;
        ruleConditions.SessionConditionIsTrueOrIsFalse = null;
    }

    if ($("#ui_chkPageDepthIs").is(":checked")) {

        ruleConditions.PageDepthIs = $("#ui_txtPageDepthIs").val();
        if ($("#ui_radPageDepthIsFalse").is(":checked"))
            ruleConditions.PageDepthConditionIsTrueOrIsFalse = false;
        else
            ruleConditions.PageDepthConditionIsTrueOrIsFalse = true;
    }
    else {
        ruleConditions.PageDepthIs = 0;
        ruleConditions.PageDepthConditionIsTrueOrIsFalse = null;
    }
    if ($("#ui_chkPageViewIs").is(":checked")) {

        ruleConditions.NPageVisited = $("#ui_txtPageViewIs").val();
        if ($("#ui_radPageViewIsFalse").is(":checked"))
            ruleConditions.PageViewConditionIsTrueOrIsFalse = false;
        else
            ruleConditions.PageViewConditionIsTrueOrIsFalse = true;
    }
    else {
        ruleConditions.NPageVisited = 0;
        ruleConditions.PageViewConditionIsTrueOrIsFalse = null;
    }
    if ($("#ui_chkFrequencyIs").is(":checked")) {
        ruleConditions.FrequencyIs = $("#ui_txtFrequencyIs").val();
        if ($("#ui_radFrequencyIsFalse").is(":checked"))
            ruleConditions.FrequencyConditionIsTrueOrIsFalse = false;
        else
            ruleConditions.FrequencyConditionIsTrueOrIsFalse = true;
    }
    else {
        ruleConditions.FrequencyIs = 0;
        ruleConditions.FrequencyConditionIsTrueOrIsFalse = null;
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
            else
                ruleConditions.CheckSourceDomainOnly = false;
        }
    }
    else {
        ruleConditions.IsReferrer = 0;
        ruleConditions.CheckSourceDomainOnly = null;
        ruleConditions.ReferrerUrl = "";
    }
    if ($("#ui_chkIsMailRespondent").is(":checked")) {
        ruleConditions.IsMailIsRespondent = 1;
        if ($("#ui_radMailRespondentIsFalse").is(":checked"))
            ruleConditions.MailRespondentConditionIsTrueOrIsFalse = false;
        else
            ruleConditions.MailRespondentConditionIsTrueOrIsFalse = true;
    }
    else {
        ruleConditions.IsMailIsRespondent = 0;
        ruleConditions.MailRespondentConditionIsTrueOrIsFalse = null;
    }

    if ($("#ui_chkSearchKeywordIs").is(":checked")) {
        ruleConditions.SearchString = $("#ui_txtSearchKeyword").val();
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
    }
    else {

        ruleConditions.AlreadyVisitedPages = "";
        ruleConditions.AlreadyVisitedPagesConditionIsTrueOrIsFalse = null;
    }
    if ($("#ui_chkTimeSpentInSite").is(":checked")) {
        ruleConditions.OverAllTimeSpentInSite = $("#ui_txtTimeSpentInSite").val();
    }
    else {
        ruleConditions.OverAllTimeSpentInSite = 0;
    }


    if ($("#ui_chkIsAndriodMobile").is(":checked")) {

        if ($("#ui_radMobileDeviceConditionIsTrue").is(":checked"))
            ruleConditions.IsMobileDevice = 1;
        else
            ruleConditions.IsMobileDevice = 2;
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
    }
    else {
        ruleConditions.IsClickedSpecificButtons = "";
    }
    if ($("#ui_chkNotClickedButton").is(":checked")) {
        ruleConditions.IsNotClickedSpecificButtons = GetListDataBySpanId($("#ui_txtNotClickButton_values"), "id", "clkNotBtn_").join(",");
    }
    else {
        ruleConditions.IsNotClickedSpecificButtons = "";
    }
    if ($("#ui_chkClickedPriceRange").is(":checked")) {
        ruleConditions.ClickedPriceRangeProduct = GetListDataBySpanId($("#ui_txtPriceRangeProducts_values"), "value", "").join(",");
        ruleConditions.IsClickedPriceRangeCondition = 1;
    }
    else {
        ruleConditions.ClickedPriceRangeProduct = "";
    }
    if ($("#ui_chkRespondedInChat").is(":checked")) {
        ruleConditions.IsVisitorRespondedChat = 1;
    }
    else {
        ruleConditions.IsVisitorRespondedChat = null;
    }

    if ($("#ui_chkMailResponseStage").is(":checked")) {
        ruleConditions.MailCampignResponsiveStage = $("#ui_ddlMailScore").val();
    }
    else {
        ruleConditions.MailCampignResponsiveStage = 0;
    }

    if ($("#ui_chkRespondedForm").is(":checked")) {
        ruleConditions.IsRespondedForm = $("#ui_ddlRespondedFroms").val();
    }
    else {
        ruleConditions.IsRespondedForm = 0;
    }

    if ($("#ui_chkNotRespondedForm").is(":checked")) {
        ruleConditions.IsNotRespondedForm = $("#ui_ddlNotRespondedFroms").val();
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
    }
    else {
        ruleConditions.DependencyFormId = 0;
    }

    if ($("#ui_chkClosedNTimes").is(":checked")) {
        ruleConditions.CloseCount = $("#ui_txtClosedNTimes").val();
        ruleConditions.CloseCountSessionWiseOrOverAll = $("input:radio[name='CloseCountSessionWiseOrOverAll']:checked").val();
    }
    else {
        ruleConditions.CloseCount = 0;
    }

    if ($("#ui_chkAddedToCart").is(":checked")) {
        ruleConditions.AddedProductsToCart = GetListProductDataBySpanId($("#ui_txtAddedToCartProducts_values"), "value", "").join("@#");
    }
    else {
        ruleConditions.AddedProductsToCart = "";
    }

    if ($("#ui_chkViewedNotAddedToCart").is(":checked")) {
        ruleConditions.ViewedButNotAddedProductsToCart = GetListDataBySpanId($("#ui_txtViewedNotAddedToCartProducts_values"), "value", "").join(",");
    }
    else {
        ruleConditions.ViewedButNotAddedProductsToCart = "";
    }

    if ($("#ui_chkDropedFromCart").is(":checked")) {
        ruleConditions.DroppedProductsFromCart = GetListDataBySpanId($("#ui_txtDropedFromCartProducts_values"), "value", "").join(",");
    }
    else {
        ruleConditions.DroppedProductsFromCart = "";
    }

    if ($("#ui_chkCustomerPurchased").is(":checked")) {
        ruleConditions.PurchasedProducts = GetListDataBySpanId($("#ui_txtCustomerPurchasedProducts_values"), "value", "").join(",");
    }
    else {
        ruleConditions.PurchasedProducts = "";
    }
    if ($("#ui_chkCustomerNotPurchased").is(":checked")) {
        ruleConditions.NotPurchasedProducts = GetListDataBySpanId($("#ui_txtCustomerNotPurchasedProducts_values"), "value", "").join(",");
    }
    else {
        ruleConditions.NotPurchasedProducts = "";
    }

    if ($("#ui_chkTotalPurchaseIs").is(":checked")) {
        ruleConditions.TotalPurchaseQtyConditon = $("#ui_ddlTotalPurchaseQtyCondition").val();
        ruleConditions.CustomerTotalPurchase1 = $("#ui_txtCustomerTotalQtyPurchase1").val();

        if ($("#ui_ddlTotalPurchaseQtyCondition").val() == "3")
            ruleConditions.CustomerTotalPurchase2 = $("#ui_txtCustomerTotalQtyPurchase2").val();
        else
            ruleConditions.CustomerTotalPurchase2 = 0;
    }
    else {
        ruleConditions.TotalPurchaseQtyConditon = ruleConditions.CustomerTotalPurchase1 = ruleConditions.CustomerTotalPurchase2 = 0;
    }

    if ($("#ui_chkCustomerCurrectValue").is(":checked")) {
        ruleConditions.TotalPurchaseAmtCondition = $("#ui_ddlTotalPurchaseAmountCondition").val();
        ruleConditions.CustomerCurrentValue1 = $("#ui_txtCustomerCurrentValue1").val();

        if ($("#ui_ddlTotalPurchaseAmountCondition").val() == "3")
            ruleConditions.CustomerCurrentValue2 = $("#ui_txtCustomerCurrentValue2").val();
        else
            ruleConditions.CustomerCurrentValue2 = 0;
    }
    else {
        ruleConditions.TotalPurchaseAmtCondition = ruleConditions.CustomerCurrentValue1 = ruleConditions.CustomerCurrentValue2 = 0;
    }

    if ($("#ui_chkCategoriesAddedToCart").is(":checked")) {
        ruleConditions.AddedProductsCategoriesToCart = GetListDataBySpanId($("#ui_txtAddedToCartProductsCategories_values"), "value", "").join("|");
    }
    else {
        ruleConditions.AddedProductsCategoriesToCart = "";
    }

    if ($("#ui_chkCategoriesNotAddedToCart").is(":checked")) {
        ruleConditions.NotAddedProductsCategoriesToCart = GetListDataBySpanId($("#ui_txtNotAddedToCartProductsCategories_values"), "value", "").join("|");
    }
    else {
        ruleConditions.NotAddedProductsCategoriesToCart = "";
    }

    if ($("#ui_chkSubCategoriesAddedToCart").is(":checked")) {
        ruleConditions.AddedProductsSubCategoriesToCart = GetListDataBySpanId($("#ui_txtAddedToCartProductsSubCategories_values"), "value", "").join("|");
    }
    else {
        ruleConditions.AddedProductsSubCategoriesToCart = "";
    }

    if ($("#ui_chkSubCategoriesNotAddedToCart").is(":checked")) {
        ruleConditions.NotAddedProductsSubCategoriesToCart = GetListDataBySpanId($("#ui_txtNotAddedToCartProductsSubCategories_values"), "value", "").join("|");
    }
    else {
        ruleConditions.NotAddedProductsSubCategoriesToCart = "";
    }
    if ($("#ui_chkCustomerLastPurchase").is(":checked")) {
        ruleConditions.LastPurchaseIntervalCondition = $("#ui_ddlLastPurchaseCondition").val();
        ruleConditions.LastPurchaseIntervalRange1 = $("#ui_txtLastPurchaseRange1").val();

        if ($("#ui_txtLastPurchaseRange2").is(":visible"))
            ruleConditions.LastPurchaseIntervalRange2 = $("#ui_txtLastPurchaseRange2").val();
        else
            ruleConditions.LastPurchaseIntervalRange2 = 0;
    }
    else {
        ruleConditions.LastPurchaseIntervalCondition = 0;
        ruleConditions.LastPurchaseIntervalRange1 = 0;
        ruleConditions.LastPurchaseIntervalRange2 = 0;
    }
    return ruleConditions;
};

InteractionEventData = function () {
    if ($("#ui_chkFormImpression").is(":checked")) {
        ruleConditions.ImpressionEventForFormId = $("#ui_ddlFormImpression").val();
        ruleConditions.ImpressionEventCountCondition = $("#ui_txtFormImpressionCount").val();
    }
    else {
        ruleConditions.ImpressionEventForFormId = -1;
    }

    if ($("#ui_chkFormCloseEvent").is(":checked")) {
        ruleConditions.CloseEventForFormId = $("#ui_ddlFormCloseEvent").val();
        ruleConditions.CloseEventCountCondition = $("#ui_txtFormCloseEventCount").val();
    }
    else {
        ruleConditions.CloseEventForFormId = -1;
    }

    if ($("#ui_chkResponseCountEvent").is(":checked")) {
        ruleConditions.ResponsesEventForFormId = $("#ui_ddlResponseCountEvent").val();
        ruleConditions.ResponsesEventCountCondition = $("#ui_txtResponseCountEventCount").val();
    }
    else {
        ruleConditions.ResponsesEventForFormId = -1;
    }

    if ($("#ui_chkShowFormAtNTime").is(":checked")) {
        ruleConditions.ShowFormOnlyNthTime = $("#ui_txtShowFormAtNTime").val();
    }
    else {
        ruleConditions.ShowFormOnlyNthTime = 0;
    }

    return ruleConditions;
};

ProfileData = function () {

    

    if ($("#ui_chkSocialStatusIs").is(":checked")) {
        ruleConditions.SocialStatusIs = $("#ui_ddlSocialStatus").val();
    }
    else {
        ruleConditions.SocialStatusIs = 0;
    }

    if ($("#ui_chkInfluentialScoreIs").is(":checked")) {
        ruleConditions.InfluentialScoreCondition = $("#ui_ddlInfluentialScoreIs").val();
        ruleConditions.InfluentialScore1 = $("#ui_txtInfluentialScore1").val();
        if ($("#ui_ddlInfluentialScoreIs").val() == "3")
            ruleConditions.InfluentialScore2 = $("#ui_txtInfluentialScore2").val();
    }
    else {
        ruleConditions.InfluentialScoreCondition = 0;
    }

   

 

    if ($("#ui_chkProspectStatusIs").is(":checked")) {
        ruleConditions.NurtureStatusIs = $("#ui_ddlProspectStatus").val();
    }
    else {
        ruleConditions.NurtureStatusIs = -1;
    }

    if ($("#ui_chkProspectGenderIs").is(":checked")) {
        ruleConditions.GenderIs = $("#ui_ddlProspectGender").val();
    }
    else {
        ruleConditions.GenderIs = "";
    }
    if ($("#ui_chkMartialStatus").is(":checked")) {
        ruleConditions.MaritalStatusIs = $("#ui_ddlMartialStatus").val();
    }
    else {
        ruleConditions.MaritalStatusIs = 0;
    }
    if ($("#ui_chkIndustryIs").is(":checked")) {
        ruleConditions.ProfessionIs = $("#ui_txtIndustryIs").val();
    }
    else {
        ruleConditions.ProfessionIs = "";
    }
    if ($("#ui_chkIsConnectedSocially").is(":checked")) {
        ruleConditions.NotConnectedSocially = $("#ui_ddlConnectedSocially").val();
    }
    else {
        ruleConditions.NotConnectedSocially = 0;
    }

    if ($("#ui_chkProspectLoyaltyIs").is(":checked")) {
        ruleConditions.LoyaltyPointsCondition = $("#ui_ddlProspectLoyaltyIs").val();
        ruleConditions.LoyaltyPointsRange1 = $("#ui_txtProspectLoyalty1").val();
        if ($("#ui_ddlProspectLoyaltyIs").val() == "3")
            ruleConditions.LoyaltyPointsRange2 = $("#ui_txtProspectLoyalty2").val();
    }
    else {
        ruleConditions.LoyaltyPointsCondition = 0;
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

GetListProductDataBySpanId = function (spanTag, valueType, replaceId) {

    var objectValues = new Array();
    spanTag.children().each(function () {

        var value = "";
        if (replaceId.length > 0)
            value = $(this).attr(valueType).replace(replaceId, "") +'->'+$(this)[0].textContent;
        else
            value = $(this).attr(valueType) + '->' + $(this)[0].textContent;

        objectValues.push(value);
       
    });
    return objectValues;
};
function SetslimScroll(ControlId) {
    $(ControlId).slimScroll({
        destroy: true
    });
    $(ControlId).slimscroll({
        height: '450px',
        railVisible: false,
        alwaysVisible: true,
        railOpacity: 0.5,
        color: '#73A00D',
        allowPageScroll: true

    });
}

$("#ui_ddlLastPurchaseCondition").change(function () {
    if ($(this).val() == "3")
        $("#ui_txtLastPurchaseRange2").show();
    else
        $("#ui_txtLastPurchaseRange2").hide();
});
