
$("#ui_lnkSaveDetails").click(function () {

    if (triggerMailSmsId > 0)
        GetWorkFlowMaxCount(triggerMailSmsId);
    else
        SaveRuleData();

});

function SaveRuleData() {
    $("#dvLoading").show();
    if (!ValidateRules()) {
        $("#dvLoading").hide();
        return;
    }
    SaveOneByOneAllDetails();
}

SaveOneByOneAllDetails = function () {
    triggerMailSms.TriggerHeading = CleanText($("#ui_txtFormIdentifierName").val());
    RulesData();
    $.ajax({
        url: "/Rules/SaveBasicDetails",
        data: JSON.stringify({ 'setRules': triggerMailSms }),
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataFilter: function (data) { return data; },
        success: function (response) {
            if (!response.Status) {
                ShowErrorMessage("With this name already rule exist");
            }
            else if (response.Status) {
                if ($.urlParam("RuleId") == 0) {
                    window.history.pushState('', '', UpdateQueryString("RuleId", response.RuleId));
                    triggerMailSmsId = triggerMailSms.RuleId = response.RuleId;
                    BindSavedData(true);
                    ShowErrorMessage("The rule is saved");
                }
                else
                    ShowErrorMessage("The rule is updated");
            }
        },
        error: ShowAjaxError
    });
    $("#dvLoading").hide();
};

ValidateRules = function () {

    if (CleanText($("#ui_txtFormIdentifierName").val()).length == 0) {
        ShowErrorMessage("Please enter name");
        return false;
    }
    if (!ValidationOfRules()) {
        $("#dvLoading").hide();
        return false;
    }
    return true;
};

/* ValidationOfRules */
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

/* ValidationOfAudience */
ValidationOfAudience = function () {

    if ($("#ui_chkSegment").is(":checked") && $("input[name='BelongsGroup']:checked").val() && $("#ui_txtGroups_values").children().length == 0) {
        ShowErrorMessage("Display Rules -> Audience -> Segment Rule :- There is no groups have been added.");
        $("#ui_txtGroups").focus();
        return false;
    }
    return true;
};

/* ValidateBehavior */
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

    if ($("#ui_chkIsMailRespondent").is(":checked")) {
        if ($("#ui_ddlMailRespondentTemplate option").length <= 1) {
            ShowErrorMessage("Please add the template before setting the rule.");
            $("#ui_ddlMailRespondentTemplate").focus();
            return false;
        }

        if ($("input[name='ddcl-ui_ddlMailRespondentTemplate']:checked").length <= 0) {
            ShowErrorMessage("Display Rules -> Behavior -> Please select Mail Responded Templates");
            $("#ui_ddlMailRespondentTemplate").focus();
            return false;
        }
    }

    if ($("#ui_chkIsSmsRespondent").is(":checked")) {
        if ($("#ui_ddlSmsRespondentTemplate option").length <= 1) {
            ShowErrorMessage("Please add the template before setting the rule.");
            $("#ui_ddlSmsRespondentTemplate").focus();
            return false;
        }

        if ($("input[name='ddcl-ui_ddlSmsRespondentTemplate']:checked").length <= 0) {
            ShowErrorMessage("Display Rules -> Behavior -> Please select Sms Responded Templates");
            $("#ui_ddlSmsRespondentTemplate").focus();
            return false;
        }
    }

    if ($("#ui_chkFrequencyIs").is(":checked") && $("#ui_txtFrequencyIs").val().length == 0) {
        ShowErrorMessage("Display Rules -> Behavior -> Please enter Frequency is");
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

    if ($("#ui_chkNotAlreadyVisitedPages").is(":checked") && $("#ui_txtNotAlreadyVisitedPageUrls").val().length == 0) {
        ShowErrorMessage("Display Rules -> Behavior -> Please enter not already visited page urls");
        $("#ui_txtNotAlreadyVisitedPageUrls").focus();
        return false;
    }

    if ($("#ui_chkTimeSpentInSite").is(":checked") && $("#ui_txtTimeSpentInSite").val().length == 0) {
        ShowErrorMessage("Display Rules -> Behavior -> Please enter over all time spent in site");
        $("#ui_txtTimeSpentInSite").focus();
        return false;
    }

    return true;
};

/* ValidateInteraction */
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
            ShowErrorMessage("Display Rules -> Interaction -> Please enter clicked tag");
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
            ShowErrorMessage("Display Rules -> Interaction -> Answer dependency form not selected");
            $("#ui_ddlAnswerDependencyFroms").focus();
            return false;
        }
        if ($("input:radio[name='AnswerDependencyFieldOption']:checked").val() == undefined) {
            ShowErrorMessage("Display Rules -> Interaction -> Answer dependency form field not selected");
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

        if ($('#ui_ddlCustomerTotalPurchase option:selected').val() != "3" && $("#ui_txtCustomerTotalPurchase1").val().length == 0) {
            ShowErrorMessage("Display Rules -> Interaction -> Please enter customer total transaction value");
            $("#ui_txtCustomerTotalPurchase2").focus();
            return false;
        }
        else if ($('#ui_ddlCustomerTotalPurchase option:selected').val() == "3") {

            if ($("#ui_txtCustomerTotalPurchase1").val().length == 0 || $("#ui_txtCustomerTotalPurchase2").val().length == 0) {
                ShowErrorMessage("Display Rules -> Interaction -> Please enter customer total transaction value");
                return false;
            } else {
                if (parseInt($("#ui_txtCustomerTotalPurchase2").val()) <= parseInt($("#ui_txtCustomerTotalPurchase1").val())) {
                    ShowErrorMessage("Display Rules -> Interaction -> Please enter customer total transaction range correctly");
                    return false;
                }
            }
        }
    }


    if ($("#ui_chkCustomerCurrectValue").is(":checked")) {
        if ($('#ui_ddlCustomerCurrentValue option:selected').val() != "3" && $("#ui_txtCustomerCurrentValue1").val().length == 0) {
            ShowErrorMessage("Display Rules -> Interaction -> Please enter customer current value");
            $("#ui_txtCustomerTotalPurchase2").focus();
            return false;
        }
        else if ($('#ui_ddlCustomerCurrentValue option:selected').val() == "3") {

            if ($("#ui_txtCustomerCurrentValue1").val().length == 0 || $("#ui_txtCustomerCurrentValue2").val().length == 0) {
                ShowErrorMessage("Display Rules -> Interaction -> Please enter customer current value");
                return false;
            } else {
                if (parseInt($("#ui_txtCustomerCurrentValue2").val()) <= parseInt($("#ui_txtCustomerCurrentValue1").val())) {
                    ShowErrorMessage("Display Rules -> Interaction -> Please enter customer current value range correctly");
                    return false;
                }
            }
        }
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

    if ($("#ui_chkUserReachableIs").is(":checked")) {
        if ($("#ui_ddlUserReachableCondition").val() == "0") {
            ShowErrorMessage("Display Rules -> Interaction -> Please select channel name");
            $("#ui_ddlUserReachableCondition").focus();
            return false;
        }
    }

    if ($("#ui_chkUserABTesting").is(":checked")) {
        if ($("#ui_ABTestingTestContinue").is(":checked")) {
            if ($("#ui_ABTestingTestTypeCondition").val() == "0") {
                ShowErrorMessage("Display Rules -> Interaction -> Please select condition");
                return false;
            }
        }
    }

    if ($("#ui_chkResponseduration").is(":checked")) {
        if ($("#ui_drresponseduration").val() == "0") {
            ShowErrorMessage("Display Rules -> Interaction -> visitor recently responded --> Please select the response");
            return false;
        }

        if (parseInt($("#drpFromTime").val()) >= parseInt($("#drpToTime").val()) || parseInt($("#drpToTime").val()) <= parseInt($("#drpFromTime").val())) {
            ShowErrorMessage("Display Rules -> Interaction -> visitor recently responded --> Please select the correct time, from time should less than to time");
            return false;
        }
    }

    if ($("#ui_chkTimeResponseduration").is(":checked")) {
        if ($("#ui_drTimeResponseduration").val() == "0") {
            ShowErrorMessage("Display Rules -> Interaction -> visitor responded --> Please select the response");
            return false;
        }

        if ($("#drpTime").val() == "0") {
            ShowErrorMessage("Display Rules -> Interaction -> visitor responded --> Please select the response duration");
            return false;
        }
    }

    if ($("#ui_chkOBDResponse").is(":checked")) {
        if ($("#ui_txtOBDResponse").val().length == 0) {
            ShowErrorMessage("Display Rules -> Interaction -> visitor has responded the OBD --> Please enter the value");
            return false;
        }
    }

    return true;
};

/* ValidateInteractionEvent */
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

/* ValidateProfile */
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

    if ($("#ui_chkDOBIs").is(":checked")) {

        if ($("#chk_IgnoreDOB").is(":checked") && $("#ui_ddlIgnoreDOB").get(0).selectedIndex == 0) {
            ShowErrorMessage("Display Rules -> By Profile -> Please select the ignore condition");
            $("#ui_ddlIgnoreDOB").focus();
            return false;
        }

        if ($("#ui_rdbtnDates").is(":checked")) {
            if ($("#txtFromDate").val().length == 0) {
                ShowErrorMessage("Display Rules -> By Profile -> Please enter From Date");
                $("#txtFromDate").focus();
                return false;
            }
            if ($("#txtToDate").val().length == 0) {
                ShowErrorMessage("Display Rules -> By Profile -> Please enter To Date");
                $("#txtToDate").focus();
                return false;
            }

            var dates = $("#txtFromDate").val().split('-');
            var FromDate = new Date(dates[0], dates[1] - 1, dates[2]);

            var dates = $("#txtToDate").val().split('-');
            var ToDate = new Date(dates[0], dates[1] - 1, dates[2]);

            if (FromDate.getTime() > ToDate.getTime()) {
                ShowErrorMessage("Display Rules -> By Profile -> Please enter ToDate greater than FromDate");
                $("#txtToDate").focus();
                return false;
            }
        }

        if ($("#ui_rdbtnDayDiff").is(":checked")) {
            if ($("#ui_txtDOBNoofDays").val() != null && $("#ui_txtDOBNoofDays").val() == 0) {
                ShowErrorMessage("Display Rules -> By Profile -> Please enter number of days greater than zero");
                $("#ui_txtDOBNoofDays").focus();
                return false;
            }

            if (($("#txtDiffDate").val().length == 0) || ($("#ui_txtDOBNoofDays").val().length == 0)) {
                ShowErrorMessage("Display Rules -> By Profile -> Please enter date value or enter number of days");
                $("#txtDiffDate").focus();
                return false;
            }
        }
    }

    if ($("#ui_chkVisitorContactCondition").is(":checked")) {
        if ($("#ui_ddlContactFields").get(0).selectedIndex == 0) {
            ShowErrorMessage("Display Rules -> By Profile -> Please select the visitor's customised contact field");
            $("#ui_ddlContactFields").focus();
            return false;
        }

        if ($("#ui_ddlContactCustomisedConditions").get(0).selectedIndex == 0) {
            ShowErrorMessage("Display Rules -> By Profile -> Please select the visitor's customised contact field condition");
            $("#ui_ddlContactCustomisedConditions").focus();
            return false;
        }

        if ($("#txtCustomisedContactFieldAnswer1").val().length == 0) {
            ShowErrorMessage("Display Rules -> Profile -> Please enter the visitor's customised contact field value");
            $("#txtCustomisedContactFieldAnswer1").focus();
            return false;
        }
        else if ($("#ui_ddlContactCustomisedConditions").val() == "10" && $("#txtCustomisedContactFieldAnswer2").val().length == 0) {
            ShowErrorMessage("Display Rules -> Profile -> Please enter the visitor's customised contact field value correctly");
            $("#txtCustomisedContactFieldAnswer2").focus();
            return false;
        }
    }

    if ($("#ui_chkIsVisitorActiveness").is(":checked")) {
        if ($("#ui_txtVisitorActiveness").val().length == 0) {
            ShowErrorMessage("Display Rules -> Profile -> Please enter the visitor's activeness value");
            $("#ui_txtVisitorActiveness").focus();
            return false;
        }

        if (parseInt($("#ui_txtVisitorActiveness").val()) == 0) {
            ShowErrorMessage("Display Rules -> Profile -> Please enter the visitor's activeness value greater than 0");
            $("#ui_txtVisitorActiveness").focus();
            return false;
        }
    }
    return true;
};


RulesData = function () {

    AssignAudienceData();
    BehaviorData();
    InteractionData();
    InteractionEventData();
    ProfileData();
};

/* AssignAudienceData */
AssignAudienceData = function () {

    if ($("#ui_chkVisitorType").is(":checked")) {
        triggerMailSms.IsLead = $("input:radio[name='VisitorType']:checked").val();
    }
    else {
        triggerMailSms.IsLead = -1;
    }

    //if ($("#ui_chkSegment").is(":checked")) {
    //    triggerMailSms.IsBelong = $("input:radio[name='BelongsGroup']:checked").val();
    //    triggerMailSms.BelongsToGroup = GetListDataBySpanId($("#ui_txtGroups_values"), "value", "").join(",");
    //}
    //else {
    //    triggerMailSms.IsBelong = 0;
    //    triggerMailSms.BelongsToGroup = "";
    //}

    return triggerMailSms;
};

/* BehaviorData */
BehaviorData = function () {

    if ($("#ui_chkBehavioralScore").is(":checked")) {
        triggerMailSms.BehavioralScoreCondition = $("#ui_ddlBehavioralScoreRange").val();
        triggerMailSms.BehavioralScore1 = $("#ui_VisitorScore1").val();
        if ($("#ui_ddlBehavioralScoreRange").val() == "3")
            triggerMailSms.BehavioralScore2 = $("#ui_VisitorScore2").val();
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
            triggerMailSms.IsPageUrlContainsCondition = 1;
        else
            triggerMailSms.IsPageUrlContainsCondition = 0;
    }
    else {
        triggerMailSms.PageUrl = "";
    }

    if ($("#ui_chkSourceIs").is(":checked")) {

        if ($("#ui_radSourceIsDirect").is(":checked")) {
            triggerMailSms.IsReferrer = 1;
        }
        else if ($("#ui_radSourceIsReferrer").is(":checked")) {
            triggerMailSms.IsReferrer = 2
            triggerMailSms.ReferrerUrl = $("#ui_txtSourceIs").val();
            if ($("#ui_chkCheckSourceDomainOnly").is(":checked"))
                triggerMailSms.CheckSourceDomainOnly = true;
            else
                triggerMailSms.CheckSourceDomainOnly = false;
        }
    }
    else {
        triggerMailSms.IsReferrer = 0;
        triggerMailSms.CheckSourceDomainOnly = false;
    }
    //if ($("#ui_chkIsMailRespondent").is(":checked")) {
    //    triggerMailSms.IsMailIsRespondent = 1;
    //    if ($("#ui_radMailRespondentIsFalse").is(":checked"))
    //        triggerMailSms.MailRespondentConditionIsTrueOrIsFalse = false;
    //    else
    //        triggerMailSms.MailRespondentConditionIsTrueOrIsFalse = true;
    //}
    //else {
    //    triggerMailSms.IsMailIsRespondent = 0;
    //}

    if ($("#ui_chkIsMailRespondent").is(":checked")) {
        triggerMailSms.IsMailIsRespondent = 1;
        if ($("#ui_radMailRespondentIsFalse").is(":checked"))
            triggerMailSms.MailRespondentConditionIsTrueOrIsFalse = false;
        else
            triggerMailSms.MailRespondentConditionIsTrueOrIsFalse = true;

        var SelectedTemplateIdValues = [];
        $.each($("input[name='ddcl-ui_ddlMailRespondentTemplate']:checked"), function () {
            SelectedTemplateIdValues.push($(this).val());
        });
        triggerMailSms.MailRespondentTemplates = SelectedTemplateIdValues.join();

        if ($("#ui_chkMailRespondentClick").is(":checked"))
            triggerMailSms.IsMailRespondentClickCondition = 1;
        else
            triggerMailSms.IsMailRespondentClickCondition = 0;
    }
    else {
        triggerMailSms.IsMailIsRespondent = 0;
        triggerMailSms.MailRespondentTemplates = 0;
        triggerMailSms.IsMailRespondentClickCondition = 0;
    }

    if ($("#ui_chkIsSmsRespondent").is(":checked")) {
        triggerMailSms.IsSmsIsRespondent = 1;
        if ($("#ui_radSmsRespondentIsFalse").is(":checked"))
            triggerMailSms.SmsRespondentConditionIsTrueOrIsFalse = false;
        else
            triggerMailSms.SmsRespondentConditionIsTrueOrIsFalse = true;

        var SelectedSmsTemplateIds = [];
        $.each($("input[name='ddcl-ui_ddlSmsRespondentTemplate']:checked"), function () {
            SelectedSmsTemplateIds.push($(this).val());
        });
        triggerMailSms.SmsRespondentTemplates = SelectedSmsTemplateIds.join();
    }
    else {
        triggerMailSms.IsSmsIsRespondent = 0;
        triggerMailSms.SmsRespondentTemplates = 0;
    }

    if ($("#ui_chkSearchKeywordIs").is(":checked")) {
        triggerMailSms.SearchString = $("#ui_txtSearchKeyword").val();
    }
    else {
        triggerMailSms.SearchString = "";
    }

    if ($("#ui_chkCountryIs").is(":checked")) {
        triggerMailSms.Country = GetListDataBySpanId($("#ui_txtCountry_values"), "value", "").join("@$");
        if ($("#ui_radCountryIsFalse").is(":checked"))
            triggerMailSms.CountryConditionIsTrueOrIsFalse = false;
        else
            triggerMailSms.CountryConditionIsTrueOrIsFalse = true;
    }
    else {
        triggerMailSms.Country = "";
    }

    if ($("#ui_chkCityIs").is(":checked")) {
        triggerMailSms.City = GetListDataBySpanId($("#ui_txtCity_values"), "value", "").join("@$");
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

        if ($("#ui_radPageViewOverAll").is(":checked"))
            triggerMailSms.AlreadyVisitedPagesOverAllOrSessionWise = false;
        else
            triggerMailSms.AlreadyVisitedPagesOverAllOrSessionWise = true;
    }
    else {

        triggerMailSms.AlreadyVisitedPages = "";
        triggerMailSms.AlreadyVisitedPagesOverAllOrSessionWise = false;
    }

    if ($("#ui_chkNotAlreadyVisitedPages").is(":checked")) {

        triggerMailSms.NotAlreadyVisitedPages = $("#ui_txtNotAlreadyVisitedPageUrls").val();

        if ($("#ui_radNotPageViewOverAll").is(":checked"))
            triggerMailSms.NotAlreadyVisitedPagesOverAllOrSessionWise = false;
        else
            triggerMailSms.NotAlreadyVisitedPagesOverAllOrSessionWise = true;
    }
    else {

        triggerMailSms.NotAlreadyVisitedPages = "";
        triggerMailSms.NotAlreadyVisitedPagesOverAllOrSessionWise = false;
    }

    if ($("#ui_chkTimeSpentInSite").is(":checked")) {
        triggerMailSms.OverAllTimeSpentInSite = $("#ui_txtTimeSpentInSite").val();
    }
    else {
        triggerMailSms.OverAllTimeSpentInSite = 0;
    }


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

};

/* InteractionData */
InteractionData = function () {

    if ($("#ui_chkClickedButton").is(":checked")) {
        triggerMailSms.IsClickedSpecificButtons = GetListDataBySpanId($("#ui_txtClickButton_values"), "id", "clkBtn_").join(",");
    }
    else {
        triggerMailSms.IsClickedSpecificButtons = "";
    }

    if ($("#ui_chkNotClickedButton").is(":checked")) {
        triggerMailSms.IsNotClickedSpecificButtons = GetListDataBySpanId($("#ui_txtNotClickButton_values"), "id", "clkNotBtn_").join(",");
    }
    else {
        triggerMailSms.IsNotClickedSpecificButtons = "";
    }

    if ($("#ui_chkClickedPriceRange").is(":checked")) {
        triggerMailSms.ClickedPriceRangeProduct = GetListDataBySpanId($("#ui_txtPriceRangeProducts_values"), "value", "").join(",");
        //triggerMailSms.IsClickedPriceRangeCondition = 1;
    }
    else {
        triggerMailSms.ClickedPriceRangeProduct = "";
    }
    if ($("#ui_chkRespondedInChat").is(":checked")) {
        triggerMailSms.IsVisitorRespondedChat = 1;
    }
    else {
        triggerMailSms.IsVisitorRespondedChat = 0;
    }

    if ($("#ui_chkMailResponseStage").is(":checked")) {
        triggerMailSms.MailCampignResponsiveStage = $("#ui_ddlMailScore").val();
    }
    else {
        triggerMailSms.MailCampignResponsiveStage = 0;
    }

    if ($("#ui_chkRespondedForm").is(":checked")) {
        triggerMailSms.IsRespondedForm = $("#ui_ddlRespondedFroms").val();
    }
    else {
        triggerMailSms.IsRespondedForm = 0;
    }

    if ($("#ui_chkNotRespondedForm").is(":checked")) {
        triggerMailSms.IsNotRespondedForm = $("#ui_ddlNotRespondedFroms").val();
    }
    else {
        triggerMailSms.IsNotRespondedForm = 0;
    }

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
        triggerMailSms.CloseCountSessionWiseOrOverAll = $("input:radio[name='CloseCountSessionWiseOrOverAll']:checked").val();
    }
    else {
        triggerMailSms.CloseCount = 0;
    }

    if ($("#ui_chkAddedToCart").is(":checked")) {
        triggerMailSms.AddedProductsToCart = GetListDataBySpanId($("#ui_txtAddedToCartProducts_values"), "value", "").join(",");
    }
    else {
        triggerMailSms.AddedProductsToCart = "";
    }

    if ($("#ui_chkViewedNotAddedToCart").is(":checked")) {
        triggerMailSms.ViewedButNotAddedProductsToCart = GetListDataBySpanId($("#ui_txtViewedNotAddedToCartProducts_values"), "value", "").join(",");
    }
    else {
        triggerMailSms.ViewedButNotAddedProductsToCart = "";
    }

    if ($("#ui_chkDropedFromCart").is(":checked")) {
        triggerMailSms.DroppedProductsFromCart = GetListDataBySpanId($("#ui_txtDropedFromCartProducts_values"), "value", "").join(",");
    }
    else {
        triggerMailSms.DroppedProductsFromCart = "";
    }

    if ($("#ui_chkCustomerPurchased").is(":checked")) {
        triggerMailSms.PurchasedProducts = GetListDataBySpanId($("#ui_txtCustomerPurchasedProducts_values"), "value", "").join(",");
    }
    else {
        triggerMailSms.PurchasedProducts = "";
    }
    if ($("#ui_chkCustomerNotPurchased").is(":checked")) {
        triggerMailSms.NotPurchasedProducts = GetListDataBySpanId($("#ui_txtCustomerNotPurchasedProducts_values"), "value", "").join(",");
    }
    else {
        triggerMailSms.NotPurchasedProducts = "";
    }

    if ($("#ui_chkTotalPurchaseIs").is(":checked")) {
        triggerMailSms.CustomerTotalPurchase1 = $("#ui_txtCustomerTotalPurchase1").val();
        triggerMailSms.CustomerTotalPurchaseCondition = $("#ui_ddlCustomerTotalPurchase").val();

        if ($("#ui_txtCustomerTotalPurchase2").is(":visible"))
            triggerMailSms.CustomerTotalPurchase2 = $("#ui_txtCustomerTotalPurchase2").val();
        else
            triggerMailSms.CustomerTotalPurchase2 = 0;
    }
    else {
        triggerMailSms.CustomerTotalPurchase1 = 0;
        triggerMailSms.CustomerTotalPurchaseCondition = 0;
        triggerMailSms.CustomerTotalPurchase2 = 0;
    }

    if ($("#ui_chkCustomerCurrectValue").is(":checked")) {
        triggerMailSms.CustomerCurrentValue1 = $("#ui_txtCustomerCurrentValue1").val();
        triggerMailSms.CustomerCurrentValueCondition = $("#ui_ddlCustomerCurrentValue").val();

        if ($("#ui_txtCustomerCurrentValue2").is(":visible"))
            triggerMailSms.CustomerCurrentValue2 = $("#ui_txtCustomerCurrentValue2").val();
        else
            triggerMailSms.CustomerCurrentValue2 = 0;
    }
    else {
        triggerMailSms.CustomerCurrentValue1 = 0;
        triggerMailSms.CustomerCurrentValueCondition = 0;
        triggerMailSms.CustomerCurrentValue2 = 0;
    }

    if ($("#ui_chkCustomerLastPurchase").is(":checked")) {
        triggerMailSms.LastPurchaseIntervalCondition = $("#ui_ddlLastPurchaseCondition").val();
        triggerMailSms.LastPurchaseIntervalRange1 = $("#ui_txtLastPurchaseRange1").val();

        if ($("#ui_txtLastPurchaseRange2").is(":visible"))
            triggerMailSms.LastPurchaseIntervalRange2 = $("#ui_txtLastPurchaseRange2").val();
        else
            triggerMailSms.LastPurchaseIntervalRange2 = 0;
    }
    else {
        triggerMailSms.LastPurchaseIntervalCondition = 0;
        triggerMailSms.LastPurchaseIntervalRange1 = 0;
        triggerMailSms.LastPurchaseIntervalRange2 = 0;
    }
    if ($("#ui_chkCategoriesAddedToCart").is(":checked")) {
        triggerMailSms.AddedProductsCategoriesToCart = GetListDataBySpanId($("#ui_txtAddedToCartProductsCategories_values"), "value", "").join("|");
    }
    else {
        triggerMailSms.AddedProductsCategoriesToCart = "";
    }

    if ($("#ui_chkCategoriesNotAddedToCart").is(":checked")) {
        triggerMailSms.NotAddedProductsCategoriesToCart = GetListDataBySpanId($("#ui_txtNotAddedToCartProductsCategories_values"), "value", "").join("|");
    }
    else {
        triggerMailSms.NotAddedProductsCategoriesToCart = "";
    }

    if ($("#ui_chkSubCategoriesAddedToCart").is(":checked")) {
        triggerMailSms.AddedProductsSubCategoriesToCart = GetListDataBySpanId($("#ui_txtAddedToCartProductsSubCategories_values"), "value", "").join("|");
    }
    else {
        triggerMailSms.AddedProductsSubCategoriesToCart = "";
    }

    if ($("#ui_chkSubCategoriesNotAddedToCart").is(":checked")) {
        triggerMailSms.NotAddedProductsSubCategoriesToCart = GetListDataBySpanId($("#ui_txtNotAddedToCartProductsSubCategories_values"), "value", "").join("|");
    }
    else {
        triggerMailSms.NotAddedProductsSubCategoriesToCart = "";
    }

    if ($("#ui_chkUserReachableIs").is(":checked")) {
        if ($("#ui_userReachableIsTrue").is(":checked"))
            triggerMailSms.IsUersReachable = 1;
        else if ($("#ui_userReachableIsFalse").is(":checked"))
            triggerMailSms.IsUersReachable = 2;
        else
            triggerMailSms.IsUersReachable = 0;

        if ($("#ui_ddlUserReachableCondition").is(":visible"))
            triggerMailSms.ChannelName = $("#ui_ddlUserReachableCondition").val();
        else
            triggerMailSms.ChannelName = null;
    }
    else {
        triggerMailSms.IsUersReachable = 0;
        triggerMailSms.ChannelName = null;
    }

    if ($("#ui_chkUserABTesting").is(":checked")) {
        if ($("#ui_ABTestingTestStop").is(":checked")) {
            triggerMailSms.IsABTesting = 1;
            triggerMailSms.IsABTestingCondition = null;
        }
        else if ($("#ui_ABTestingTestContinue").is(":checked")) {
            triggerMailSms.IsABTesting = 2;
            triggerMailSms.IsABTestingCondition = $("#ui_ABTestingTestTypeCondition").val();
            triggerMailSms.WaitTime = parseInt($("#drpWaitTime").val());

        }
        else
            triggerMailSms.IsABTesting = 0;

        triggerMailSms.IsABTestingContacts = parseInt($("#NumberOfData").html());
    }
    else {
        triggerMailSms.IsABTesting = 0;
        triggerMailSms.IsABTestingContacts = null;
        triggerMailSms.IsABTestingCondition = null;
    }

    if ($("#ui_chkResponseduration").is(":checked")) {
        triggerMailSms.ResponseCondition = $("#ui_drresponseduration").val();
        triggerMailSms.ResponseFromTime = $("#drpFromTime").val();
        triggerMailSms.ResponseToTime = $("#drpToTime").val();
    }
    else {
        triggerMailSms.ResponseCondition = null;
        triggerMailSms.ResponseFromTime = 0;
        triggerMailSms.ResponseToTime = 0;
    }

    if ($("#ui_chkTimeResponseduration").is(":checked")) {
        triggerMailSms.TimeResponseCondition = $("#ui_drTimeResponseduration").val();
        triggerMailSms.TimeCondition = $("#drpTime").val();
    }
    else {
        triggerMailSms.TimeResponseCondition = null;
        triggerMailSms.TimeCondition = null;
    }

    if ($("#ui_chkOBDResponse").is(":checked")) {
        triggerMailSms.IsOBDResponse = $("#ui_txtOBDResponse").val();
    }
    else {
        triggerMailSms.IsOBDResponse = null;
    }

    return triggerMailSms;
};

/* InteractionEventData */
InteractionEventData = function () {
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

    if ($("#ui_chkShowFormAtNTime").is(":checked")) {
        triggerMailSms.ShowFormOnlyNthTime = $("#ui_txtShowFormAtNTime").val();
    }
    else {
        triggerMailSms.ShowFormOnlyNthTime = 0;
    }

    return triggerMailSms;
};

/* ProfileData */
ProfileData = function () {

    if ($("#ui_chkOnlineSentimentIs").is(":checked")) {
        triggerMailSms.OnlineSentimentIs = $("#ui_ddlOnlineSentimentIs").val();
    }
    else {
        triggerMailSms.OnlineSentimentIs = 0;
    }

    if ($("#ui_chkSocialStatusIs").is(":checked")) {
        triggerMailSms.SocialStatusIs = $("#ui_ddlSocialStatus").val();
    }
    else {
        triggerMailSms.SocialStatusIs = 0;
    }

    if ($("#ui_chkInfluentialScoreIs").is(":checked")) {
        triggerMailSms.InfluentialScoreCondition = $("#ui_ddlInfluentialScoreIs").val();
        triggerMailSms.InfluentialScore1 = $("#ui_txtInfluentialScore1").val();
        if ($("#ui_ddlInfluentialScoreIs").val() == "3")
            triggerMailSms.InfluentialScore2 = $("#ui_txtInfluentialScore2").val();
    }
    else {
        triggerMailSms.InfluentialScoreCondition = 0;
        triggerMailSms.InfluentialScore2 = 0;
        triggerMailSms.InfluentialScore1 = 0;
    }

    if ($("#ui_chkOfflineSentimentIs").is(":checked")) {
        triggerMailSms.OfflineSentimentIs = $("#ui_ddlOfflineSentiment").val();
    }
    else {
        triggerMailSms.OfflineSentimentIs = 0;
    }

    if ($("#ui_chkProductRatingIs").is(":checked")) {
        triggerMailSms.ProductRatingIs = $("#ui_ddlRating").val();
    }
    else {
        triggerMailSms.ProductRatingIs = 0;
    }

    if ($("#ui_chkProspectStatusIs").is(":checked")) {
        triggerMailSms.NurtureStatusIs = $("#ui_ddlProspectStatus").val();
    }
    else {
        triggerMailSms.NurtureStatusIs = -1;
    }

    if ($("#ui_chkProspectGenderIs").is(":checked")) {
        triggerMailSms.GenderIs = $("#ui_ddlProspectGender").val();
    }
    else {
        triggerMailSms.GenderIs = "";
    }
    if ($("#ui_chkMartialStatus").is(":checked")) {
        triggerMailSms.MaritalStatusIs = $("#ui_ddlMartialStatus").val();
    }
    else {
        triggerMailSms.MaritalStatusIs = "";
    }
    if ($("#ui_chkIndustryIs").is(":checked")) {
        triggerMailSms.ProfessionIs = $("#ui_txtIndustryIs").val();
    }
    else {
        triggerMailSms.ProfessionIs = "";
    }
    if ($("#ui_chkIsConnectedSocially").is(":checked")) {
        triggerMailSms.NotConnectedSocially = $("#ui_ddlConnectedSocially").val();
    }
    else {
        triggerMailSms.NotConnectedSocially = 0;
    }

    if ($("#ui_chkProspectLoyaltyIs").is(":checked")) {
        triggerMailSms.LoyaltyPointsCondition = $("#ui_ddlProspectLoyaltyIs").val();
        triggerMailSms.LoyaltyPointsRange1 = $("#ui_txtProspectLoyalty1").val();
        if ($("#ui_ddlProspectLoyaltyIs").val() == "3")
            triggerMailSms.LoyaltyPointsRange2 = $("#ui_txtProspectLoyalty2").val();
    }
    else {
        triggerMailSms.LoyaltyPointsCondition = 0;
        triggerMailSms.LoyaltyPointsRange1 = 0;
        triggerMailSms.LoyaltyPointsRange2 = 0;
    }
    if ($("#ui_chkRFMSScoreIs").is(":checked")) {
        triggerMailSms.RFMSScoreRangeCondition = $("#ui_ddlRFMSScore").val();
        triggerMailSms.RFMSScoreRange1 = $("#ui_txtRFMSScore1").val();
        if ($("#ui_ddlRFMSScore").val() == "3")
            triggerMailSms.RFMSScoreRange2 = $("#ui_txtRFMSScore2").val();
    }
    else {
        triggerMailSms.RFMSScoreRangeCondition = 0;
    }

    if ($("#ui_chkDOBIs").is(":checked")) {
        triggerMailSms.IsBirthDay = 1;

        if ($("#chk_IgnoreDOB").is(":checked")) {
            triggerMailSms.IsDOBIgnored = 1;
            triggerMailSms.IsDOBIgnoreCondition = $("#ui_ddlIgnoreDOB").val();
        }
        else {
            triggerMailSms.IsDOBIgnored = triggerMailSms.IsDOBIgnoreCondition = "";
        }

        if ($('input[name=DOB]:checked').val() == "0") {
            triggerMailSms.IsDOBTodayOrMonth = 0;
        }
        else if ($('input[name=DOB]:checked').val() == "1") {
            triggerMailSms.IsDOBTodayOrMonth = 1;
        }
        else if ($('input[name=DOB]:checked').val() == "2") {
            triggerMailSms.IsDOBTodayOrMonth = 2;
            triggerMailSms.DOBFromDate = $("#txtFromDate").val();
            triggerMailSms.DOBToDate = $("#txtToDate").val();
            triggerMailSms.DOBDaysDiffernce = 0;
        }
        else if ($('input[name=DOB]:checked').val() == "3") {
            triggerMailSms.IsDOBTodayOrMonth = 3;
            triggerMailSms.DOBFromDate = triggerMailSms.DOBToDate = "";
            triggerMailSms.DOBDaysDiffernce = $("#ui_txtDOBNoofDays").val()
        }
    }
    else {
        triggerMailSms.IsBirthDay = triggerMailSms.IsDOBTodayOrMonth = triggerMailSms.DOBDaysDiffernce = 0;
        triggerMailSms.DOBFromDate = triggerMailSms.DOBToDate = triggerMailSms.IsDOBIgnored = triggerMailSms.IsDOBIgnoreCondition = "";
    }


    if ($("#ui_chkVisitorContactCondition").is(":checked")) {
        triggerMailSms.IsCustomisedContactRule = 1;
        triggerMailSms.ContactFieldName = $("#ui_ddlContactFields").val();
        triggerMailSms.ContactFieldCondition = $("#ui_ddlContactCustomisedConditions").val();
        triggerMailSms.ContactFieldValue1 = $("#txtCustomisedContactFieldAnswer1").val();

        if ($("#ui_ddlContactCustomisedConditions").val() == "10")
            triggerMailSms.ContactFieldValue2 = $("#txtCustomisedContactFieldAnswer2").val();
        else
            triggerMailSms.ContactFieldValue2 = "";
    }
    else {
        triggerMailSms.IsCustomisedContactRule = triggerMailSms.ContactFieldCondition = 0;
        triggerMailSms.ContactFieldName = triggerMailSms.ContactFieldValue1 = triggerMailSms.ContactFieldValue2 = "";
    }


    if ($("#ui_chkIsVisitorActiveness").is(":checked")) {

        if ($("#ui_radVisitorActivenessIsTrue").is(":checked"))
            triggerMailSms.VisitorActivenessConditionIsTrueOrIsFalse = 1;
        else if ($("#ui_radVisitorActivenessIsFalse").is(":checked"))
            triggerMailSms.VisitorActivenessConditionIsTrueOrIsFalse = 0;

        triggerMailSms.VisitorActivenessIs = $("#ui_txtVisitorActiveness").val();
    }
    else {
        triggerMailSms.VisitorActivenessIs = 0;
        triggerMailSms.VisitorActivenessConditionIsTrueOrIsFalse = "";
    }

    return triggerMailSms;
};

/* BindSavedData */
function BindSavedData(IsFirstTime) {

    $.ajax({
        url: "/Rules/GetRuleDetails",
        data: JSON.stringify({ 'RuleId': triggerMailSmsId }),
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataFilter: function (data) { return data; },
        success: function (response) {
            if (response.Status) {
                triggerMailSms = response.triggerMailSms;
                $("#ui_txtFormIdentifierName").val(triggerMailSms.TriggerHeading);
                if (IsFirstTime == undefined || !IsFirstTime) {
                    BindAudienceData();
                    BindBehaviorData();
                    BindInteractionData();
                    BindInteractionEventData();
                    BindProfileData();
                }
            }
            else if (!response.Status) {
                ShowErrorMessage("No data to bind.Please create new rule");
                setTimeout(function () { window.location.href = "/WorkFlow/Rules"; }, 3000);
            }
        },
        error: ShowAjaxError
    });
}

/* BindAudienceData */
BindAudienceData = function () {

    if (triggerMailSms.IsLead > -1) {
        $("input:radio[name='VisitorType'][value='" + triggerMailSms.IsLead + "']").prop('checked', true);
        //$("#ui_chkVisitorType").click();
        $("#ui_chkVisitorType").prop('checked', true);

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

            AppendSelected("ui_txtGroups_values", data, "group");
        }
        $("#ui_chkSegment").click();
    }
};

/* BindBehaviorData */
BindBehaviorData = function () {

    var needToOpendDiv = false;

    if (triggerMailSms.BehavioralScoreCondition > 0) {
        $("#ui_ddlBehavioralScoreRange").val(triggerMailSms.BehavioralScoreCondition);
        $("#ui_VisitorScore1").val(triggerMailSms.BehavioralScore1);
        if ($("#ui_ddlBehavioralScoreRange").val() == "3") {
            $("#ui_VisitorScore2").val(triggerMailSms.BehavioralScore2);
            $("#ui_ddlBehavioralScoreRange").change();
        }
        $("#ui_chkBehavioralScore").click();
        needToOpendDiv = true;
    }

    if (triggerMailSms.SessionIs > 0) {
        $("#ui_txtSession").val(triggerMailSms.SessionIs);

        if (triggerMailSms.SessionConditionIsTrueOrIsFalse == false)
            $("#ui_radSessionIsFalse").prop('checked', true);
        else
            $("#ui_radSessionIsTrue").prop('checked', true);

        $("#ui_chkSessionIs").click();
        needToOpendDiv = true;

    }

    if (triggerMailSms.PageDepthIs > 0) {
        $("#ui_txtPageDepthIs").val(triggerMailSms.PageDepthIs);

        if (triggerMailSms.PageDepthConditionIsTrueOrIsFalse == false)
            $("#ui_radPageDepthIsFalse").prop('checked', true);
        else
            $("#ui_radPageDepthIsTrue").prop('checked', true);

        $("#ui_chkPageDepthIs").click();
        needToOpendDiv = true;

    }

    if (triggerMailSms.NPageVisited > 0) {
        $("#ui_txtPageViewIs").val(triggerMailSms.NPageVisited);

        if (triggerMailSms.PageViewConditionIsTrueOrIsFalse == false)
            $("#ui_radPageViewIsFalse").prop('checked', true);
        else
            $("#ui_radPageViewIsTrue").prop('checked', true);

        $("#ui_chkPageViewIs").click();
        needToOpendDiv = true;

    }
    if (triggerMailSms.FrequencyIs > 0) {
        $("#ui_txtFrequencyIs").val(triggerMailSms.FrequencyIs);

        if (triggerMailSms.FrequencyConditionIsTrueOrIsFalse == false)
            $("#ui_radFrequencyIsFalse").prop('checked', true);
        else
            $("#ui_radFrequencyIsTrue").prop('checked', true);

        $("#ui_chkFrequencyIs").click();
        needToOpendDiv = true;
    }
    if (triggerMailSms.PageUrl != null && triggerMailSms.PageUrl.length > 0) {
        $("#ui_txtPageUrl").val(triggerMailSms.PageUrl);
        $("#ui_chkOnPageUrl").click();

        if (triggerMailSms.IsPageUrlContainsCondition == 1)
            $("#ui_PageUrlCheckContains").prop("checked", true);
        needToOpendDiv = true;
    }
    if (triggerMailSms.IsReferrer > 0) {

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
        }
        needToOpendDiv = true;
    }
    if (triggerMailSms.IsMailIsRespondent == 1) {
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

        BindDropDowmCheckListValues(triggerMailSms.MailRespondentTemplates);
        $("#ui_chkIsMailRespondent").click();
        needToOpendDiv = true;
    }

    if (triggerMailSms.IsSmsIsRespondent == 1) {
        if (triggerMailSms.SmsRespondentConditionIsTrueOrIsFalse == false)
            $("#ui_radSmsRespondentIsFalse").prop('checked', true);
        else
            $("#ui_radSmsRespondentIsTrue").prop('checked', true);

        BindSmsDropDowmCheckListValues(triggerMailSms.SmsRespondentTemplates);
        $("#ui_chkIsSmsRespondent").click();
        needToOpendDiv = true;
    }

    if (triggerMailSms.SearchString != null && triggerMailSms.SearchString.length > 0) {
        $("#ui_txtSearchKeyword").val(triggerMailSms.SearchString);
        $("#ui_chkSearchKeywordIs").click();
        needToOpendDiv = true;

    }

    if (triggerMailSms.Country != null && triggerMailSms.Country.length > 0) {
        var countryList = triggerMailSms.Country.split("@$");
        for (var i = 0; i < countryList.length; i++) {

            var data = new Array();
            data["item"] = new Array();
            data.item.value = countryList[i];
            data.item.label = countryList[i];


            AppendSelected("ui_txtCountry_values", data, "country");
        }

        if (triggerMailSms.CountryConditionIsTrueOrIsFalse == false)
            $("#ui_radCountryIsFalse").prop('checked', true);
        else
            $("#ui_radCountryIsTrue").prop('checked', true);

        $("#ui_chkCountryIs").click();
        needToOpendDiv = true;

    }
    if (triggerMailSms.City != null && triggerMailSms.City.length > 0) {
        var cityList = triggerMailSms.City.split("@$");
        for (var i = 0; i < cityList.length; i++) {

            var data = new Array();
            data["item"] = new Array();
            data.item.value = cityList[i];
            data.item.label = cityList[i];
            AppendSelected("ui_txtCity_values", data, "");
        }

        if (triggerMailSms.CityConditionIsTrueOrIsFalse == false)
            $("#ui_radCityIsFalse").prop('checked', true);
        else
            $("#ui_radCityIsTrue").prop('checked', true);

        $("#ui_chkCityIs").click();
        needToOpendDiv = true;
    }

    if (triggerMailSms.AlreadyVisitedPages != null && triggerMailSms.AlreadyVisitedPages.length > 0) {
        $("#ui_txtAlreadyVisitedPageUrls").val(triggerMailSms.AlreadyVisitedPages);
        $("#ui_chkAlreadyVisitedPages").click();

        if (triggerMailSms.AlreadyVisitedPagesOverAllOrSessionWise == 0)
            $("#ui_radPageViewOverAll").prop('checked', true);
        else
            $("#ui_radPageViewSessionWise").prop('checked', true);

        needToOpendDiv = true;
    }

    if (triggerMailSms.NotAlreadyVisitedPages != null && triggerMailSms.NotAlreadyVisitedPages.length > 0) {
        $("#ui_txtNotAlreadyVisitedPageUrls").val(triggerMailSms.NotAlreadyVisitedPages);
        $("#ui_chkNotAlreadyVisitedPages").click();

        if (triggerMailSms.NotAlreadyVisitedPagesOverAllOrSessionWise == 0)
            $("#ui_radNotPageViewOverAll").prop('checked', true);
        else
            $("#ui_radNotPageViewSessionWise").prop('checked', true);

        needToOpendDiv = true;
    }

    if (triggerMailSms.OverAllTimeSpentInSite > 0) {
        $("#ui_txtTimeSpentInSite").val(triggerMailSms.OverAllTimeSpentInSite);
        $("#ui_chkTimeSpentInSite").click();
        needToOpendDiv = true;
    }

    if (triggerMailSms.IsMobileDevice > 0) {

        if (triggerMailSms.IsMobileDevice == 1)
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

/* BindInteractionData */
BindInteractionData = function () {
    var needToOpendDiv = false;

    if (triggerMailSms.IsClickedSpecificButtons != null && triggerMailSms.IsClickedSpecificButtons.length > 0) {
        needToOpendDiv = true;
        var clickedTags = triggerMailSms.IsClickedSpecificButtons.split(",");
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

    if (triggerMailSms.IsNotClickedSpecificButtons != null && triggerMailSms.IsNotClickedSpecificButtons.length > 0) {
        needToOpendDiv = true;
        var clickedTags = triggerMailSms.IsNotClickedSpecificButtons.split(",");
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

    if (triggerMailSms.ClickedPriceRangeProduct != null && triggerMailSms.ClickedPriceRangeProduct.length > 0) {
        needToOpendDiv = true;

        var products = triggerMailSms.ClickedPriceRangeProduct.split(",");
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
    if (triggerMailSms.IsVisitorRespondedChat == true) {
        needToOpendDiv = true;
        $("#ui_chkRespondedInChat").click();
    }
    if (triggerMailSms.MailCampignResponsiveStage > 0) {
        needToOpendDiv = true;
        $("#ui_ddlMailScore").val(triggerMailSms.MailCampignResponsiveStage);
        $("#ui_chkMailResponseStage").click();
    }
    if (triggerMailSms.IsRespondedForm > 0) {
        needToOpendDiv = true;
        $("#ui_ddlRespondedFroms").val(triggerMailSms.IsRespondedForm);
        $("#ui_chkRespondedForm").click();
    }
    if (triggerMailSms.IsNotRespondedForm > 0) {
        needToOpendDiv = true;
        $("#ui_ddlNotRespondedFroms").val(triggerMailSms.IsNotRespondedForm);
        $("#ui_chkNotRespondedForm").click();
    }
    if (triggerMailSms.DependencyFormId > 0) {
        needToOpendDiv = true;
        $("#ui_ddlAnswerDependencyFroms").val(triggerMailSms.DependencyFormId).change();
        $("input:radio[name='AnswerDependencyFieldOption'][value='" + triggerMailSms.DependencyFormField + "']").prop("checked", true);
        $("#ui_ddlAnswerCondition").val(triggerMailSms.DependencyFormCondition).change();
        $("#ui_txtAnswerCondition1").val(triggerMailSms.DependencyFormAnswer1);
        $("#ui_txtAnswerCondition2").val(triggerMailSms.DependencyFormAnswer2);
        $("#ui_chkAnswerDependencyForm").click();
    }

    if (triggerMailSms.CloseCount > 0) {
        needToOpendDiv = true;
        $("#ui_txtClosedNTimes").val(triggerMailSms.CloseCount);

        if (triggerMailSms.CloseCountSessionWiseOrOverAll == 1)
            $("#ui_radCloseCountOverAll").prop('checked', true);
        else
            $("#ui_radCloseCountSessionWise").prop('checked', true);

        $("#ui_chkClosedNTimes").click();
    }
    if (triggerMailSms.AddedProductsToCart != null && triggerMailSms.AddedProductsToCart.length > 0) {

        needToOpendDiv = true;
        var products = triggerMailSms.AddedProductsToCart.split("@#");
        for (var i = 0; i < products.length; i++) {
            var idAndLabel = products[i].split("-");
            var data = new Array();
            data["item"] = new Array();
            data.item.value = idAndLabel[0];
            data.item.label = idAndLabel[1];
            AppendSelected("ui_txtAddedToCartProducts_values", data, "AddedToCart");
        }
        $("#ui_chkAddedToCart").click();

    }
    if (triggerMailSms.ViewedButNotAddedProductsToCart != null && triggerMailSms.ViewedButNotAddedProductsToCart.length > 0) {

        needToOpendDiv = true;
        var products = triggerMailSms.ViewedButNotAddedProductsToCart.split("@#");
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
    if (triggerMailSms.DroppedProductsFromCart != null && triggerMailSms.DroppedProductsFromCart.length > 0) {

        needToOpendDiv = true;
        var products = triggerMailSms.DroppedProductsFromCart.split("@#");
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
    if (triggerMailSms.PurchasedProducts != null && triggerMailSms.PurchasedProducts.length > 0) {

        needToOpendDiv = true;
        var products = triggerMailSms.PurchasedProducts.split("@#");
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
    if (triggerMailSms.NotPurchasedProducts != null && triggerMailSms.NotPurchasedProducts.length > 0) {

        needToOpendDiv = true;
        var products = triggerMailSms.NotPurchasedProducts.split("@#");
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

    if (triggerMailSms.CustomerTotalPurchaseCondition > 0) {
        needToOpendDiv = true;

        if (triggerMailSms.CustomerTotalPurchaseCondition == 1 || triggerMailSms.CustomerTotalPurchaseCondition == 2 || triggerMailSms.CustomerTotalPurchaseCondition == 4) {
            $("#ui_txtCustomerTotalPurchase1").val(triggerMailSms.CustomerTotalPurchase1);
        }
        else {
            $("#ui_txtCustomerTotalPurchase1").val(triggerMailSms.CustomerTotalPurchase1);
            $("#ui_txtCustomerTotalPurchase2").val(triggerMailSms.CustomerTotalPurchase2);
        }
        $("#ui_ddlCustomerTotalPurchase").val(triggerMailSms.CustomerTotalPurchaseCondition).change();

        $("#ui_chkTotalPurchaseIs").click();
    }

    if (triggerMailSms.CustomerCurrentValueCondition > 0) {
        needToOpendDiv = true;

        if (triggerMailSms.CustomerCurrentValueCondition == 1 || triggerMailSms.CustomerCurrentValueCondition == 2 || triggerMailSms.CustomerCurrentValueCondition == 4) {
            $("#ui_txtCustomerCurrentValue1").val(triggerMailSms.CustomerCurrentValue1);
        }
        else {
            $("#ui_txtCustomerCurrentValue1").val(triggerMailSms.CustomerCurrentValue1);
            $("#ui_txtCustomerCurrentValue2").val(triggerMailSms.CustomerCurrentValue2);
        }
        $("#ui_ddlCustomerCurrentValue").val(triggerMailSms.CustomerCurrentValueCondition).change();

        $("#ui_chkCustomerCurrectValue").click();
    }

    if (triggerMailSms.LastPurchaseIntervalCondition > 0) {
        needToOpendDiv = true;
        if (triggerMailSms.LastPurchaseIntervalCondition == 1) {
            $("#ui_txtLastPurchaseRange1").val(triggerMailSms.LastPurchaseIntervalRange1);
        } else if (triggerMailSms.LastPurchaseIntervalCondition == 2) {
            $("#ui_txtLastPurchaseRange1").val(triggerMailSms.LastPurchaseIntervalRange1);
        } else if (triggerMailSms.LastPurchaseIntervalCondition == 3) {
            $("#ui_txtLastPurchaseRange1").val(triggerMailSms.LastPurchaseIntervalRange1);
            $("#ui_txtLastPurchaseRange2").val(triggerMailSms.LastPurchaseIntervalRange2);
        }
        else if (triggerMailSms.LastPurchaseIntervalCondition == 4) {
            $("#ui_txtLastPurchaseRange1").val(triggerMailSms.LastPurchaseIntervalRange1);
        }
        $("#ui_ddlLastPurchaseCondition").val(triggerMailSms.LastPurchaseIntervalCondition).change();

        $("#ui_chkCustomerLastPurchase").click();
    }

    if (triggerMailSms.AddedProductsCategoriesToCart != null && triggerMailSms.AddedProductsCategoriesToCart.length > 0) {

        needToOpendDiv = true;
        var products = triggerMailSms.AddedProductsCategoriesToCart.split("|");
        for (var i = 0; i < products.length; i++) {
            var data = new Array();
            data["item"] = new Array();
            data.item.value = products[i];
            data.item.label = products[i];

            AppendSelected("ui_txtAddedToCartProductsCategories_values", data, "CategoriesAddedToCart");
        }

        $("#ui_chkCategoriesAddedToCart").click();

    }
    if (triggerMailSms.NotAddedProductsCategoriesToCart != null && triggerMailSms.NotAddedProductsCategoriesToCart.length > 0) {

        needToOpendDiv = true;
        var products = triggerMailSms.NotAddedProductsCategoriesToCart.split("|");
        for (var i = 0; i < products.length; i++) {
            var data = new Array();
            data["item"] = new Array();
            data.item.value = products[i];
            data.item.label = products[i];

            AppendSelected("ui_txtNotAddedToCartProductsCategories_values", data, "CategoriesnotAddedToCart");
        }

        $("#ui_chkCategoriesNotAddedToCart").click();

    }
    if (triggerMailSms.AddedProductsSubCategoriesToCart != null && triggerMailSms.AddedProductsSubCategoriesToCart.length > 0) {

        needToOpendDiv = true;
        var products = triggerMailSms.AddedProductsSubCategoriesToCart.split("|");
        for (var i = 0; i < products.length; i++) {
            var data = new Array();
            data["item"] = new Array();
            data.item.value = products[i];
            data.item.label = products[i];

            AppendSelected("ui_txtAddedToCartProductsSubCategories_values", data, "SubCategoriesAddedToCart");
        }

        $("#ui_chkSubCategoriesAddedToCart").click();

    }
    if (triggerMailSms.NotAddedProductsSubCategoriesToCart != null && triggerMailSms.NotAddedProductsSubCategoriesToCart.length > 0) {

        needToOpendDiv = true;
        var products = triggerMailSms.NotAddedProductsSubCategoriesToCart.split("|");
        for (var i = 0; i < products.length; i++) {
            var data = new Array();
            data["item"] = new Array();
            data.item.value = products[i];
            data.item.label = products[i];

            AppendSelected("ui_txtNotAddedToCartProductsSubCategories_values", data, "SubCategoriesnotAddedToCart");
        }

        $("#ui_chkSubCategoriesNotAddedToCart").click();

    }

    if (triggerMailSms.IsUersReachable > 0 && triggerMailSms.ChannelName.length > 0) {

        needToOpendDiv = true;

        if (triggerMailSms.IsUersReachable == 1)
            $("#ui_userReachableIsTrue").prop('checked', true);
        else if (triggerMailSms.IsUersReachable == 2)
            $("#ui_userReachableIsFalse").prop('checked', true);

        $("#ui_ddlUserReachableCondition").val(triggerMailSms.ChannelName);

        $("#ui_chkUserReachableIs").click();

    }

    if (triggerMailSms.IsABTesting > 0) {
        needToOpendDiv = true;
        if (triggerMailSms.IsABTesting == 1) {
            $("#ui_ABTestingTestStop").prop('checked', true);
        }
        else if (triggerMailSms.IsABTesting == 2) {
            $("#ui_ABTestingTestContinue").prop('checked', true);
            $("#ui_ABTestingTestTypeCondition").val(triggerMailSms.IsABTestingCondition);
            if (triggerMailSms.WaitTime.toString().length < 2) {
                var waitTime = "0" + triggerMailSms.WaitTime.toString();
                $("#drpWaitTime").val(waitTime);
            }
            else {
                var waitTime = triggerMailSms.WaitTime.toString();
                $("#drpWaitTime").val(waitTime);
            }
            $("#ui_ABTestingTestTypeFor").show();
        }

        $("#NumberOfData").html(triggerMailSms.IsABTestingContacts);
        Slider("ui_ContactsInPercentage", triggerMailSms.IsABTestingContacts);
        $("#ui_chkUserABTesting").click();
    }


    if (triggerMailSms.ResponseCondition != null && triggerMailSms.ResponseCondition.length > 0) {
        needToOpendDiv = true;
        $("#ui_drresponseduration").val(triggerMailSms.ResponseCondition);

        if (triggerMailSms.ResponseFromTime.toString().length < 2)
            $("#drpFromTime").val("0" + triggerMailSms.ResponseFromTime.toString());
        else
            $("#drpFromTime").val(triggerMailSms.ResponseFromTime.toString());

        if (triggerMailSms.ResponseToTime.toString().length < 2)
            $("#drpToTime").val("0" + triggerMailSms.ResponseToTime.toString());
        else
            $("#drpToTime").val(triggerMailSms.ResponseToTime.toString());

        $("#ui_chkResponseduration").click();
    }

    if (triggerMailSms.TimeResponseCondition != null && triggerMailSms.TimeResponseCondition.length > 0) {
        needToOpendDiv = true;
        $("#ui_drTimeResponseduration").val(triggerMailSms.TimeResponseCondition);
        $("#drpTime").val(triggerMailSms.TimeCondition);
        $("#ui_chkTimeResponseduration").click();
    }

    if (triggerMailSms.IsOBDResponse != null && triggerMailSms.IsOBDResponse.length > 0) {
        needToOpendDiv = true;
        $("#ui_txtOBDResponse").val(triggerMailSms.IsOBDResponse);
        $("#ui_chkOBDResponse").click();
    }

    if (needToOpendDiv) {
        $("#ui_imgInteraction").removeClass("ExpandImage").addClass("CollapseImg");
        $("#dvui_imgInteraction").show();
    }
};

/* BindInteractionEventData */
BindInteractionEventData = function () {

    var needToOpendDiv = false;

    if (triggerMailSms.ImpressionEventForFormId > -1) {
        needToOpendDiv = true;
        $("#ui_ddlFormImpression").val(triggerMailSms.ImpressionEventForFormId);
        $("#ui_txtFormImpressionCount").val(triggerMailSms.ImpressionEventCountCondition);
        $("#ui_chkFormImpression").click();
    }

    if (triggerMailSms.CloseEventForFormId > -1) {
        needToOpendDiv = true;
        $("#ui_ddlFormCloseEvent").val(triggerMailSms.CloseEventForFormId);
        $("#ui_txtFormCloseEventCount").val(triggerMailSms.CloseEventCountCondition);
        $("#ui_chkFormCloseEvent").click();
    }
    if (triggerMailSms.ResponsesEventForFormId > -1) {
        needToOpendDiv = true;
        $("#ui_ddlResponseCountEvent").val(triggerMailSms.ResponsesEventForFormId);
        $("#ui_txtResponseCountEventCount").val(triggerMailSms.ResponsesEventCountCondition);
        $("#ui_chkResponseCountEvent").click();
    }
    if (triggerMailSms.ShowFormOnlyNthTime > 0) {
        needToOpendDiv = true;
        $("#ui_txtShowFormAtNTime").val(triggerMailSms.ShowFormOnlyNthTime);
        $("#ui_chkShowFormAtNTime").click();
    }
    if (needToOpendDiv) {
        $("#ui_imgInteractionEvent").removeClass("ExpandImage").addClass("CollapseImg");
        $("#dvui_imgInteractionEvent").show();
    }
};

/* BindProfileData */
BindProfileData = function () {
    var needToOpendDiv = false;


    if (triggerMailSms.OnlineSentimentIs > 0) {
        $("#ui_ddlOnlineSentimentIs").val(triggerMailSms.OnlineSentimentIs);
        $("#ui_chkOnlineSentimentIs").click();
        needToOpendDiv = true;
    }
    if (triggerMailSms.SocialStatusIs > 0) {
        $("#ui_ddlSocialStatus").val(triggerMailSms.SocialStatusIs);
        $("#ui_chkSocialStatusIs").click();
        needToOpendDiv = true;

    }

    if (triggerMailSms.InfluentialScoreCondition > 0) {
        $("#ui_ddlInfluentialScoreIs").val(triggerMailSms.InfluentialScoreCondition);
        $("#ui_txtInfluentialScore1").val(triggerMailSms.InfluentialScore1);
        if ($("#ui_ddlInfluentialScoreIs").val() == "3") {
            $("#ui_txtInfluentialScore2").val(triggerMailSms.InfluentialScore2);
            $("#ui_ddlInfluentialScoreIs").change();
        }
        $("#ui_chkInfluentialScoreIs").click();
        needToOpendDiv = true;

    }
    if (triggerMailSms.OfflineSentimentIs > 0) {
        $("#ui_ddlOfflineSentiment").val(triggerMailSms.OfflineSentimentIs);
        $("#ui_chkOfflineSentimentIs").click();
        needToOpendDiv = true;

    }
    if (triggerMailSms.ProductRatingIs > 0) {
        $("#ui_ddlRating").val(triggerMailSms.ProductRatingIs);
        $("#ui_chkProductRatingIs").click();
        needToOpendDiv = true;

    }
    if (triggerMailSms.NurtureStatusIs > -1) {
        $("#ui_ddlProspectStatus").val(triggerMailSms.NurtureStatusIs);
        $("#ui_chkProspectStatusIs").click();
        needToOpendDiv = true;
    }
    if (triggerMailSms.GenderIs != null && triggerMailSms.GenderIs.length > 0) {
        $("#ui_ddlProspectGender").val(triggerMailSms.GenderIs);
        $("#ui_chkProspectGenderIs").click();
        needToOpendDiv = true;

    }
    if (triggerMailSms.MaritalStatusIs != null && triggerMailSms.MaritalStatusIs > 0) {
        $("#ui_ddlMartialStatus").val(triggerMailSms.MaritalStatusIs);
        $("#ui_chkMartialStatus").click();
        needToOpendDiv = true;

    }
    if (triggerMailSms.ProfessionIs != null && triggerMailSms.ProfessionIs.length > 0) {
        $("#ui_txtIndustryIs").val(triggerMailSms.ProfessionIs);
        $("#ui_chkIndustryIs").click();
        needToOpendDiv = true;

    }
    if (triggerMailSms.NotConnectedSocially > 0) {
        $("#ui_ddlConnectedSocially").val(triggerMailSms.NotConnectedSocially);
        $("#ui_chkIsConnectedSocially").click();
        needToOpendDiv = true;

    }
    if (triggerMailSms.LoyaltyPointsCondition > 0) {
        $("#ui_ddlProspectLoyaltyIs").val(triggerMailSms.LoyaltyPointsCondition);
        $("#ui_txtProspectLoyalty1").val(triggerMailSms.LoyaltyPointsRange1);
        if ($("#ui_ddlProspectLoyaltyIs").val() == "3") {
            $("#ui_txtProspectLoyalty2").val(triggerMailSms.LoyaltyPointsRange2);
            $("#ui_ddlProspectLoyaltyIs").change();
        }
        $("#ui_chkProspectLoyaltyIs").click();
        needToOpendDiv = true;

    }
    if (triggerMailSms.RFMSScoreRangeCondition > 0) {
        $("#ui_ddlRFMSScore").val(triggerMailSms.RFMSScoreRangeCondition);
        $("#ui_txtRFMSScore1").val(triggerMailSms.RFMSScoreRange1);
        if ($("#ui_ddlRFMSScore").val() == "3") {
            $("#ui_txtRFMSScore2").val(triggerMailSms.RFMSScoreRange2);
            $("#ui_ddlRFMSScore").change();
        }
        $("#ui_chkRFMSScoreIs").click();
        needToOpendDiv = true;
    }


    if (triggerMailSms.IsBirthDay > 0) {

        if (triggerMailSms.IsDOBTodayOrMonth == 0) {
            $("#ui_rdbtnDay").prop('checked', true);
        }
        else if (triggerMailSms.IsDOBTodayOrMonth == 1) {
            $("#ui_rdbtnMonth").prop('checked', true);
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
            var DiffDate = GetDifferenceDateValue(new Date(), triggerMailSms.DOBDaysDiffernce)
            $("#ui_txtDOBNoofDays").val(triggerMailSms.DOBDaysDiffernce);
            $("#txtDiffDate").val(DiffDate);
        }

        if (triggerMailSms.IsDOBIgnored == true) {
            $("#chk_IgnoreDOB").prop('checked', true);
            $("#ui_ddlIgnoreDOB").val(triggerMailSms.IsDOBIgnoreCondition);
        }

        $("#dv_IgnoreCondition").show();
        $("#ui_chkDOBIs").click();
        needToOpendDiv = true;
    }

    if (triggerMailSms.IsCustomisedContactRule > 0) {
        $("#ui_ddlContactFields").val(triggerMailSms.ContactFieldName).change();
        $("#ui_ddlContactCustomisedConditions").val(triggerMailSms.ContactFieldCondition).change();
        $("#txtCustomisedContactFieldAnswer1").val(triggerMailSms.ContactFieldValue1);

        if ($("#ui_ddlContactCustomisedConditions").val() == "10") {
            $("#txtCustomisedContactFieldAnswer2").val(triggerMailSms.ContactFieldValue2);
            $("#ui_ddlContactCustomisedConditions").change();
        }

        $("#ui_chkVisitorContactCondition").click();
        needToOpendDiv = true;
    }

    if (triggerMailSms.VisitorActivenessIs != null && triggerMailSms.VisitorActivenessIs != "" && triggerMailSms.VisitorActivenessIs > 0) {

        if (triggerMailSms.VisitorActivenessConditionIsTrueOrIsFalse == false)
            $("#ui_radVisitorActivenessIsFalse").prop('checked', true);
        else
            $("#ui_radVisitorActivenessIsTrue").prop('checked', true);

        $("#ui_txtVisitorActiveness").val(triggerMailSms.VisitorActivenessIs);

        $("#ui_chkIsVisitorActiveness").click();
        needToOpendDiv = true;
    }

    if (needToOpendDiv) {
        $("#ui_imgProfile").removeClass("ExpandImage").addClass("CollapseImg");
        $("#dvui_imgProfile").show();
    }
};

function BindDropDowmCheckListValues(TemplateIds) {
    if (TemplateIds.indexOf(",") > -1) {
        var SplittedValue = new Array();
        SplittedValue = TemplateIds.split(',');
        var value = "";
        $('input:checkbox[name="ddcl-ui_ddlMailRespondentTemplate"]').prop('checked', false);
        for (var i = 0; i < SplittedValue.length ; i++) {
            $('input:checkbox[name="ddcl-ui_ddlMailRespondentTemplate"][value="' + SplittedValue[i] + '"]').prop('checked', true);
            value += $('input:checkbox[name="ddcl-ui_ddlMailRespondentTemplate"][value="' + SplittedValue[i] + '"]').next().text() + " , ";
        }
        value = value.substring(0, value.length - 2);
        $("#ddcl-ui_ddlMailRespondentTemplate .ui-dropdownchecklist-text").prop('title', '').html("").prop('title', value).append(value);
    }
    else {
        $("#ui_ddlMailRespondentTemplate").val(TemplateIds);
        $("#ui_ddlMailRespondentTemplate").dropdownchecklist("refresh");
    }
}

function BindSmsDropDowmCheckListValues(TemplateIds) {
    if (TemplateIds.indexOf(",") > -1) {
        var SplittedValue = new Array();
        SplittedValue = TemplateIds.split(',');
        var value = "";
        $('input:checkbox[name="ddcl-ui_ddlSmsRespondentTemplate"]').prop('checked', false);
        for (var i = 0; i < SplittedValue.length ; i++) {
            $('input:checkbox[name="ddcl-ui_ddlSmsRespondentTemplate"][value="' + SplittedValue[i] + '"]').prop('checked', true);
            value += $('input:checkbox[name="ddcl-ui_ddlSmsRespondentTemplate"][value="' + SplittedValue[i] + '"]').next().text() + " , ";
        }
        value = value.substring(0, value.length - 2);
        $("#ddcl-ui_ddlSmsRespondentTemplate .ui-dropdownchecklist-text").prop('title', '').html("").prop('title', value).append(value);
    }
    else {
        $("#ui_ddlSmsRespondentTemplate").val(TemplateIds);
        $("#ui_ddlSmsRespondentTemplate").dropdownchecklist("refresh");
    }
}

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
