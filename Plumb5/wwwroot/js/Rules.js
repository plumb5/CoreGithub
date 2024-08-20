
var countryList = new Array("AFGHANISTAN", "ALAND ISLANDS", "ALBANIA", "ALGERIA", "AMERICAN SAMOA", "ANDORRA", "ANGOLA", "ANGUILLA", "ANTARCTICA", "ANTIGUA AND BARBUDA", "ARGENTINA", "ARMENIA", "ARUBA", "AUSTRALIA", "AUSTRIA", "AZERBAIJAN", "BAHAMAS", "BAHRAIN", "BANGLADESH", "BARBADOS", "BELARUS", "BELGIUM", "BELIZE", "BENIN", "BERMUDA", "BHUTAN", "BOLIVIA", "BOSNIA AND HERZEGOVINA", "BOTSWANA", "BRAZIL", "BRITISH INDIAN OCEAN TERRITORY", "BRUNEI DARUSSALAM", "BULGARIA", "BURKINA FASO", "BURUNDI", "CAMBODIA", "CAMEROON", "CANADA", "CAPE VERDE", "CAYMAN ISLANDS", "CENTRAL AFRICAN REPUBLIC", "CHAD", "CHILE", "CHINA", "CHRISTMAS ISLAND", "COLOMBIA", "COMOROS", "CONGO", "CONGO, THE DEMOCRATIC REPUBLIC OF THE", "COOK ISLANDS", "COSTA RICA", "COTE D'IVOIRE", "CROATIA", "CUBA", "CURAA‡AO", "CURAÃ‡AO", "CYPRUS", "CZECH REPUBLIC", "DEMOCRATIC PEOPLE'S REPUBLIC OF KOREA", "DENMARK", "DJIBOUTI", "DOMINICA", "DOMINICAN REPUBLIC", "ECUADOR", "EGYPT", "EL SALVADOR", "EQUATORIAL GUINEA", "ERITREA", "ESTONIA", "ETHIOPIA", "FALKLAND ISLANDS (MALVINAS)", "FAROE ISLANDS", "FIJI", "FINLAND", "FRANCE", "FRENCH GUIANA", "FRENCH POLYNESIA", "FRENCH SOUTHERN TERRITORIES", "GABON", "GAMBIA", "GEORGIA", "GERMANY", "GHANA", "GIBRALTAR", "GREECE", "GREENLAND", "GRENADA", "GUADELOUPE", "GUAM", "GUATEMALA", "GUERNSEY", "GUINEA", "GUINEA-BISSAU", "GUYANA", "HAITI", "HEARD ISLAND AND MCDONALD ISLANDS", "HOLY SEE (VATICAN CITY STATE)", "HONDURAS", "HONG KONG", "HUNGARY", "ICELAND", "INDIA", "INDONESIA", "IRAN, ISLAMIC REPUBLIC OF", "IRAQ", "IRELAND", "ISLE OF MAN", "ISRAEL", "ITALY", "JAMAICA", "JAPAN", "JORDAN", "KAZAKHSTAN", "KENYA", "KIRIBATI", "KOREA, REPUBLIC OF", "KUWAIT", "KYRGYZSTAN", "LAO PEOPLE'S DEMOCRATIC REPUBLIC", "LATVIA", "LEBANON", "LESOTHO", "LIBERIA", "LIBYAN ARAB JAMAHIRIYA", "LIECHTENSTEIN", "LITHUANIA", "LUXEMBOURG", "MACAO", "MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF", "MADAGASCAR", "MALAWI", "MALAYSIA", "MALDIVES", "MALI", "MALTA", "MARSHALL ISLANDS", "MARTINIQUE", "MAURITANIA", "MAURITIUS", "MAYOTTE", "MEXICO", "MICRONESIA, FEDERATED STATES OF", "MOLDOVA, REPUBLIC OF", "MONACO", "MONGOLIA", "MONTENEGRO", "MONTSERRAT", "MOROCCO", "MOZAMBIQUE", "MYANMAR", "NAMIBIA", "NAURU", "NEPAL", "NETHERLANDS", "NETHERLANDS ANTILLES", "NEW CALEDONIA", "NEW ZEALAND", "NICARAGUA", "NIGER", "NIGERIA", "NIUE", "NORFOLK ISLAND", "NORTHERN MARIANA ISLANDS", "NORWAY", "OMAN", "PAKISTAN", "PALAU", "PALESTINIAN TERRITORY, OCCUPIED", "PANAMA", "PAPUA NEW GUINEA", "PARAGUAY", "PERU", "PHILIPPINES", "POLAND", "PORTUGAL", "PUERTO RICO", "QATAR", "REUNION", "ROMANIA", "RUSSIAN FEDERATION", "RWANDA", "SAINT HELENA", "SAINT KITTS AND NEVIS", "SAINT LUCIA", "SAINT MARTIN", "SAINT PIERRE AND MIQUELON", "SAINT VINCENT AND THE GRENADINES", "SAMOA", "SAN MARINO", "SAO TOME AND PRINCIPE", "SAUDI ARABIA", "SENEGAL", "SERBIA", "SEYCHELLES", "SIERRA LEONE", "SINGAPORE", "SLOVAKIA", "SLOVENIA", "SOLOMON ISLANDS", "SOMALIA", "SOUTH AFRICA", "SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS", "SPAIN", "SRI LANKA", "SUDAN", "SURINAME", "SWAZILAND", "SWEDEN", "SWITZERLAND", "SYRIAN ARAB REPUBLIC", "TAIWAN, PROVINCE OF CHINA", "TAJIKISTAN", "TANZANIA, UNITED REPUBLIC OF", "THAILAND", "TOGO", "TOKELAU", "TONGA", "TRINIDAD AND TOBAGO", "TUNISIA", "TURKEY", "TURKMENISTAN", "TURKS AND CAICOS ISLANDS", "TUVALU", "UGANDA", "UKRAINE", "UNITED ARAB EMIRATES", "UNITED KINGDOM", "UNITED STATES", "UNITED STATES MINOR OUTLYING ISLANDS", "URUGUAY", "UZBEKISTAN", "VANUATU", "VENEZUELA", "VIET NAM", "VIRGIN ISLANDS, BRITISH", "VIRGIN ISLANDS, U.S.", "WALLIS AND FUTUNA", "YEMEN", "YUGOSLAVIA", "ZAMBIA", "ZIMBABWE", "Great Britain (UK)");

var loadingDataValues = { ActiveEmailIds: false, FormsList: false, GroupsList: false, LmsStageList: false, MailTemplates: false, SmsTemplates: false, UsersList: false };
var groupList = new Array();
var usersListDetails = new Array();

var templateDetails = { TemplateId: 0, TempName: "" };
var templateList = Array();
var SmsTemplateList = new Array();


var ruleConditions = {
    FormId: 0, IsLead: -1, IsBelong: 0, BelongsToGroup: "", BehavioralScoreCondition: 0, BehavioralScore1: 0, BehavioralScore2: 0, SessionIs: 0, SessionConditionIsTrueOrIsFalse: false,
    PageDepthIs: 0, NPageVisited: 0, FrequencyIs: 0, PageUrl: "", IsPageUrlContainsCondition: false, IsReferrer: 0, ReferrerUrl: "", CheckSourceDomainOnly: false, IsMailIsRespondent: false,
    SearchString: "", Country: "", City: "", IsClickedSpecificButtons: "", ClickedPriceRangeProduct: "", IsVisitorRespondedChat: false, MailCampignResponsiveStage: 0, IsRespondedForm: 0,
    IsNotRespondedForm: 0, CloseCount: 0, AddedProductsToCart: "", ViewedButNotAddedProductsToCart: "", DroppedProductsFromCart: "", PurchasedProducts: "", NotPurchasedProducts: "",
    TotalPurchaseQtyConditon: 0, CustomerTotalPurchase1: 0, CustomerTotalPurchase2: 0, TotalPurchaseAmtCondition: 0, CustomerCurrentValue1: 0, CustomerCurrentValue2: 0, LastPurchaseIntervalCondition: 0, LastPurchaseIntervalRange1: 0, LastPurchaseIntervalRange2: 0, DependencyFormId: 0, DependencyFormField: 0, DependencyFormCondition: 0, DependencyFormAnswer1: "", DependencyFormAnswer2: "",
    ImpressionEventForFormId: 0, ImpressionEventCountCondition: 0, CloseEventForFormId: 0, CloseEventCountCondition: 0, ResponsesEventForFormId: 0, ResponsesEventCountCondition: 0,
    OnlineSentimentIs: 0, SocialStatusIs: 0, InfluentialScoreCondition: 0, InfluentialScore1: 0, InfluentialScore2: 0, OfflineSentimentIs: 0, ProductRatingIs: 0, GenderIs: "",
    MaritalStatusIs: 0, ProfessionIs: "", NotConnectedSocially: 0, LoyaltyPointsCondition: 0, LoyaltyPointsRange1: 0, LoyaltyPointsRange2: 0, RFMSScoreRangeCondition: 0,
    RFMSScoreRange1: 0, RFMSScoreRange2: 0, ShowFormOnlyNthTime: 0, CloseCountSessionWiseOrOverAll: false, OverAllTimeSpentInSite: 0, AlreadyVisitedPages: "", PageDepthConditionIsTrueOrIsFalse: false,
    PageViewConditionIsTrueOrIsFalse: false, FrequencyConditionIsTrueOrIsFalse: false, MailRespondentConditionIsTrueOrIsFalse: false, CountryConditionIsTrueOrIsFalse: false,
    CityConditionIsTrueOrIsFalse: false, NurtureStatusIs: 0, IsMobileDevice: 0, AlreadyVisitedPagesOverAllOrSessionWise: false, ClickedRecentButtonOrOverAll: false,
    AddedProductsCategoriesToCart: "", NotAddedProductsCategoriesToCart: "", AddedProductsSubCategoriesToCart: "", NotAddedProductsSubCategoriesToCart: "", MailRespondentTemplates: "0",
    IsSmsIsRespondent: false, SmsRespondentConditionIsTrueOrIsFalse: false, SmsRespondentTemplates: "0", IsMailRespondentClickCondition: false, IsBirthDay: false, IsDOBTodayOrMonth: 0,
    NotAlreadyVisitedPages: "", NotAlreadyVisitedPagesOverAllOrSessionWise: false, DOBFromDate: null, DOBToDate: null, DOBDaysDiffernce: 0, IsDOBIgnored: false, IsDOBIgnoreCondition: 0,
    IsVisitedPagesContainsCondition: false, IsNotVisitedPagesContainsCondition: false, PageUrlParameters: "", AlreadyVisitedWithPageUrlParameters: "", NotAlreadyVisitedWithPageUrlParameters: "",
    IsVisitorVisitedPagesWithPageUrlParameter: false, IsVisitorsSource: false, ExceptionPageUrl: "", IsExceptionPageUrlContainsCondition: false, StateName: "", StateConditionIsTrueOrIsFalse: false, ExcludeIpList: "", IsNotClickedSpecificButtons: ""
};


$(document).ready(function () {
    ShowPageLoading();
    formruleUtil.InitializeDefaultValues();
    HidePageLoading();
});

var formruleUtil = {
    InitializeDefaultValues: function () {
        formruleUtil.LoadingSymbol();

        formruleUtil.IntializeAutoComplete("ui_txtClickButton", "../CaptureForm/CommonDetailsForForms/GetEvetList", 2, "ui_txtClickButton_values", "clkBtn");
        formruleUtil.IntializeAutoComplete("ui_txtPriceRangeProducts", "../CaptureForm/CommonDetailsForForms/GetEvetList", 2, "ui_txtPriceRangeProducts_values", "ClickProduct");
        formruleUtil.IntializeAutoComplete("ui_txtCustomerNotPurchasedProducts", "../CaptureForm/CommonDetailsForForms/GetProductList", 2, "ui_txtCustomerNotPurchasedProducts_values", "NotPurchase");
        formruleUtil.IntializeAutoComplete("ui_txtCustomerPurchasedProducts", "../CaptureForm/CommonDetailsForForms/GetProductList", 2, "ui_txtCustomerPurchasedProducts_values", "Purchase");
        formruleUtil.IntializeAutoComplete("ui_txtDropedFromCartProducts", "../CaptureForm/CommonDetailsForForms/GetProductList", 2, "ui_txtDropedFromCartProducts_values", "DropFromCart");
        formruleUtil.IntializeAutoComplete("ui_txtViewedNotAddedToCartProducts", "../CaptureForm/CommonDetailsForForms/GetProductList", 2, "ui_txtViewedNotAddedToCartProducts_values", "NotAddedToCart");
        formruleUtil.IntializeAutoComplete("ui_txtAddedToCartProducts", "../CaptureForm/CommonDetailsForForms/GetProductList", 2, "ui_txtAddedToCartProducts_values", "AddedToCart");
        formruleUtil.IntializeAutoComplete("ui_txtAddedToCartProductsCategories", "../CaptureForm/CommonDetailsForForms/GetProductCategoryList", 2, "ui_txtAddedToCartProductsCategories_values", "CategoriesAddedToCart");
        formruleUtil.IntializeAutoComplete("ui_txtNotAddedToCartProductsCategories", "../CaptureForm/CommonDetailsForForms/GetProductCategoryList", 2, "ui_txtNotAddedToCartProductsCategories_values", "CategoriesnotAddedToCart");
        formruleUtil.IntializeAutoComplete("ui_txtAddedToCartProductsSubCategories", "../CaptureForm/CommonDetailsForForms/GetProductSubCategoryList", 2, "ui_txtAddedToCartProductsSubCategories_values", "SubCategoriesAddedToCart");
        formruleUtil.IntializeAutoComplete("ui_txtNotAddedToCartProductsSubCategories", "../CaptureForm/CommonDetailsForForms/GetProductSubCategoryList", 2, "ui_txtNotAddedToCartProductsSubCategories_values", "SubCategoriesnotAddedToCart");
        formruleUtil.IntializeAutoComplete("ui_txtCity", "../CaptureForm/CommonDetailsForForms/GetCityName", 2, "ui_txtCity_values", "cityName");
        formruleUtil.IntializeAutoComplete("ui_txtState", "../CaptureForm/CommonDetailsForForms/GetStateName", 2, "ui_txtState_values", "stateName");

        formruleUtil.BindFormActiveEmailId();
    },
    IntializeAutoComplete: function (fieldId, methodUrl, minLength, appendObject, extraFieldId) {
        $("#" + fieldId).autocomplete({
            autoFocus: true,
            minLength: minLength,
            source: function (request, response) {
                var value = $("#" + fieldId).val();
                ShowPageLoading();
                $.ajax({
                    url: methodUrl,
                    data: JSON.stringify({ 'value': value }),
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataFilter: function (data) { return data; },
                    success: function (data) {
                        HidePageLoading();
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
                formruleUtil.AppendSelected(appendObject, selectedItem, extraFieldId);
            },
            close: function (event, ui) {
                $(this).val("");
            }
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
        removeDiv.setAttribute("onclick", "formruleUtil.RemoveData('" + fieldId + "_" + data.item.value.replace(/[ ,:/]+/g, "_") + "');");

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
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.ItemAlreadyAdded);
    },
    RemoveData: function (data) {
        data = $.trim(data);
        $("#" + data).remove();
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
        Todate = new Date(dates[0], dates[1] - 1, dates[2]);

        var PastDateOrFutureDate = $("#txtDiffDate").val();
        var dates1 = PastDateOrFutureDate.split('-');
        var PastDateOrFutureDate1 = new Date(dates1[0], dates1[1] - 1, dates1[2]);

        diffDays = (PastDateOrFutureDate1.getTime() - Todate.getTime()) / (24 * 60 * 60 * 1000);
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

    LoadingSymbol: function () {
        LoadingTimeInverval = setInterval(function () {
            if (loadingDataValues.ActiveEmailIds && loadingDataValues.FormsList && loadingDataValues.GroupsList && loadingDataValues.LmsStageList && loadingDataValues.MailTemplates && loadingDataValues.SmsTemplates) {
                HidePageLoading();
                clearInterval(LoadingTimeInverval);
            }
        }, 300);
    },
    BindFormActiveEmailId: function () {
        $.ajax({
            url: "../CaptureForm/CommonDetailsForForms/GetActiveEmailIds",
            type: 'Post',
            data: JSON.stringify({}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                loadingDataValues.ActiveEmailIds = true;

                if (response != undefined && response != null) {
                    $.each(response, function (i) {
                        $("#txtfromEmailSender").append("<option value='" + response[i] + "'>" + response[i] + "</option>");
                    });
                }
                formruleUtil.IntializeCountyList();
            },
            error: ShowAjaxError
        });
    },
    IntializeCountyList: function () {
        $('#ui_txtCountry')[0].options.length = 0;

        if (countryList != null && countryList.length > 0) {
            $.each(countryList, function (i) {
                $("#ui_txtCountry").append("<option value='" + countryList[i] + "'>" + countryList[i] + "</option>");
            });
        }
        formruleUtil.IntializeDOBCalender();
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
                    formruleUtil.DaysDifference();
            }
        });
        formruleUtil.IntializeFromsListAndMailGroupList();
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
                        if ($(this)[0].FormType == 1)
                            formruleUtil.AddOptionToDropDown(["ui_ddlRespondedFroms", "ui_ddlNotRespondedFroms", "ui_ddlAnswerDependencyFroms", "ui_ddlFormCloseEvent", "ui_ddlFormImpression", "ui_ddlResponseCountEvent"], $(this)[0].Id, $(this)[0].FormIdentifier, "");
                        else if ($(this)[0].FormType != 4 && $(this)[0].FormType != 5 && $(this)[0].FormType != 2 && $(this)[0].FormType != 3)
                            formruleUtil.AddOptionToDropDown(["ui_ddlFormCloseEvent", "ui_ddlFormImpression", "ui_ddlResponseCountEvent"], $(this)[0].Id, $(this)[0].FormIdentifier, "");
                        else
                            formruleUtil.AddOptionToDropDown(["ui_ddlFormCloseEvent", "ui_ddlFormImpression"], $(this)[0].Id, $(this)[0].FormIdentifier, "");
                    });
                }
                else {
                    formruleUtil.AddOptionToDropDown(["ui_ddlRespondedFroms", "ui_ddlNotRespondedFroms", "ui_ddlAnswerDependencyFroms", "ui_ddlFormCloseEvent", "ui_ddlFormImpression", "ui_ddlResponseCountEvent"], "0", "No froms have been added yet", "red");
                }
                formruleUtil.InitializeGroupList();
            },
            error: ShowAjaxError
        });
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
                    $.each(response, function () {
                        groupList.push({ value: $(this)[0].Id.toString(), label: $(this)[0].Name });
                        $('#ui_ddlGroupList').append($("<option></option>").attr("value", $(this)[0].Id).text($(this)[0].Name));
                        $("#ui_ddlGroupList_MailSpecificOptinYes,#ui_ddlGroupList_MailSpecificOptinNo,#ui_ddlGroupList_SmsSpecificOptinYes,#ui_ddlGroupList_SmsSpecificOptinNo,#ui_ddlGroupList_WhatsAppOptinYes,#ui_ddlGroupList_WhatsAppOptinNo,#ui_ddlGroupList_SmsOverallOptinYes,#ui_ddlGroupList_SmsOverallOptinNo").append($("<option></option>").attr("value", $(this)[0].Id).text($(this)[0].Name));
                    });
                }

                $("#ui_txtGroups").autocomplete({
                    autoFocus: true,
                    minLength: 0, max: 10,
                    source: groupList,
                    select: function (events, selectedItem) {
                        formruleUtil.AppendSelected("ui_txtGroups_values", selectedItem, "group");
                    },
                    close: function (event, ui) {
                        $(this).val("");
                    }
                });
                formruleUtil.InitializeUsersList();
            },
            error: ShowAjaxError
        });
    },
    InitializeUsersList: function () {
        $.ajax({
            url: "../CaptureForm/CommonDetailsForForms/UserNameList",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataFilter: function (data) { return data; },
            success: function (responsedata) {
                loadingDataValues.UsersList = true;

                var response = responsedata.Data;
                if (response != undefined && response != null) {
                    $.each(response, function () {
                        if ($(this)[0].ActiveStatus) {
                            usersListDetails.push({ UserInfoUserId: $(this)[0].UserInfoUserId, FirstName: $(this)[0].FirstName });
                            $("#ui_ddlUserList").append("<option value='" + $(this)[0].UserInfoUserId + "'>" + $(this)[0].FirstName + "</option>")
                        }
                    });
                }
                formruleUtil.InitializeLmsStage();
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
                    formruleUtil.AddOptionToDropDown(["ui_ddlProspectStatus"], "0", "No Lms Stage", "red");
                }

                formruleUtil.IntializeMailTemplate();
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
                        formruleUtil.AddOptionToDropDown(["selectemailtemp"], $(this)[0].Id.toString(), $(this)[0].Name, "");
                        $("#ui_ddlMailRespondentTemplate").append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");
                        $("#ui_ddlMailUnConditionTemplate").append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");

                        var templateDetailsObject = new Object();
                        templateDetailsObject.TemplateId = $(this)[0].Id;
                        templateDetailsObject.TempName = $(this)[0].Name;
                        templateList.push(templateDetailsObject);
                    });
                }

                formruleUtil.IntializeSmsTemplate();
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

                        //optlist = document.createElement('option');
                        //optlist.value = $(this)[0].Id;
                        //optlist.text = $(this)[0].Name;
                        //document.getElementById("ui_ddlSmsTemplate").options.add(optlist);

                        var SmstemplateDetailsObject = new Object();
                        SmstemplateDetailsObject.TemplateId = $(this)[0].Id;
                        SmstemplateDetailsObject.TempName = $(this)[0].Name;
                        SmsTemplateList.push(SmstemplateDetailsObject);
                    });
                }
                // formruleUtil.IfNewIntializeDefault();
            },
            error: ShowAjaxError
        });
    },
    BindFormFields: function (FormId) {
        $.ajax({
            url: "../CaptureForm/CommonDetailsForForms/GetFields",
            data: JSON.stringify({ 'FormId': FormId }),
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataFilter: function (data) { return data; },
            success: function (response) {
                var fieldsanswer = "";
                if (response.formFields.length > 0) {
                    if (response.formDetails != null && (response.formDetails.FormType == 1)) {
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

                if ($("#ui_dvAnswerDependencyFields > div").length > 0 && ruleConditions.DependencyFormField > 0) {
                    $("input:radio[name='AnswerDependencyFieldOption'][value='" + ruleConditions.DependencyFormField + "']").prop("checked", true);
                }
            },
            error: ShowAjaxError
        });
    },
    BindAudienceData: function () {
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

                formruleUtil.AppendSelected("ui_txtGroups_values", data, "group");
            }
            $("#ui_chkSegment").click();
        }
    },
    BindBehaviorData: function () {

        if (ruleConditions.BehavioralScoreCondition > 0) {
            $("#ui_ddlBehavioralScoreRange").val(ruleConditions.BehavioralScoreCondition);
            $("#ui_VisitorScore1").val(ruleConditions.BehavioralScore1);
            if ($("#ui_ddlBehavioralScoreRange").val() == "3") {
                $("#ui_VisitorScore2").val(ruleConditions.BehavioralScore2);
                $("#ui_ddlBehavioralScoreRange").change();
            }
            $("#ui_chkBehavioralScore").click();
        }

        if (ruleConditions.SessionIs > 0) {
            $("#ui_txtSession").val(ruleConditions.SessionIs);

            if (ruleConditions.SessionConditionIsTrueOrIsFalse == false)
                $("#ui_radSessionIsFalse").prop('checked', true);
            else
                $("#ui_radSessionIsTrue").prop('checked', true);

            $("#ui_chkSessionIs").click();
        }

        if (ruleConditions.PageDepthIs > 0) {
            $("#ui_txtPageDepthIs").val(ruleConditions.PageDepthIs);

            if (ruleConditions.PageDepthConditionIsTrueOrIsFalse == false)
                $("#ui_radPageDepthIsFalse").prop('checked', true);
            else
                $("#ui_radPageDepthIsTrue").prop('checked', true);

            $("#ui_chkPageDepthIs").click();
        }

        if (ruleConditions.NPageVisited > 0) {
            $("#ui_txtPageViewIs").val(ruleConditions.NPageVisited);

            if (ruleConditions.PageViewConditionIsTrueOrIsFalse == false)
                $("#ui_radPageViewIsFalse").prop('checked', true);
            else
                $("#ui_radPageViewIsTrue").prop('checked', true);

            $("#ui_chkPageViewIs").click();
        }

        if (ruleConditions.FrequencyIs > 0) {
            $("#ui_txtFrequencyIs").val(ruleConditions.FrequencyIs);

            if (ruleConditions.FrequencyConditionIsTrueOrIsFalse == false)
                $("#ui_radFrequencyIsFalse").prop('checked', true);
            else
                $("#ui_radFrequencyIsTrue").prop('checked', true);

            $("#ui_chkFrequencyIs").click();
        }

        if (ruleConditions.PageUrl != null && ruleConditions.PageUrl.length > 0) {
            $("#ui_txtPageUrl").val(ruleConditions.PageUrl);
            $("#ui_chkOnPageUrl").click();

            if (ruleConditions.IsPageUrlContainsCondition == 1)
                $("#ui_PageUrlCheckContains").prop("checked", true);
        }

        if (ruleConditions.ExceptionPageUrl != null && ruleConditions.ExceptionPageUrl.length > 0) {
            $("#ui_txtNotPageUrl").val(ruleConditions.ExceptionPageUrl);
            $("#ui_chkNotOnPageUrl").click();

            if (ruleConditions.IsExceptionPageUrlContainsCondition == true)
                $("#ui_PageNotUrlCheckContains").prop("checked", true);
        }

        if (ruleConditions.PageUrlParameters != null && ruleConditions.PageUrlParameters.length > 0) {
            $("#ui_txtVisitorsVisitedPagesWithPageUrlParameter").val(ruleConditions.PageUrlParameters);

            if (ruleConditions.IsVisitorVisitedPagesWithPageUrlParameter == false)
                $("#ui_radPageUrlParamFalse").prop('checked', true);
            else
                $("#ui_radPageUrlParamIsTrue").prop('checked', true);

            $("#ui_chkVisitorsVisitedPagesWithPageUrlParameter").click();
        }

        if (ruleConditions.IsReferrer > 0) {

            if (ruleConditions.IsVisitorsSource == false)
                $("#ui_radSourceIsFalse").prop('checked', true);
            else
                $("#ui_radSourceIsTrue").prop('checked', true);

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

                $("#dv_txtSoureReferrer").show();
                $("#dv_chkSoureReferrer").show();
            }
        }

        if (ruleConditions.IsMailIsRespondent == true) {
            if (ruleConditions.MailRespondentConditionIsTrueOrIsFalse == false) {
                $("#ui_radMailRespondentIsFalse").prop('checked', true);
                $("#ui_MailResponsedSpan").hide();
            }
            else {
                $("#ui_radMailRespondentIsTrue").prop('checked', true);
                $("#ui_MailResponsedSpan").show();
            }

            if (ruleConditions.IsMailRespondentClickCondition)
                $("#ui_chkMailRespondentClick").prop('checked', true);
            else
                $("#ui_chkMailRespondentClick").prop('checked', false);

            var MailTemplateIdValues = [];

            if (ruleConditions.MailRespondentTemplates != undefined && ruleConditions.MailRespondentTemplates != null && ruleConditions.MailRespondentTemplates != "") {
                var mailvalues = ruleConditions.MailRespondentTemplates.split(",");
                for (var i = 0; i < mailvalues.length; i++) {
                    MailTemplateIdValues.push(mailvalues[i]);
                }
                $("#ui_ddlMailRespondentTemplate").val(MailTemplateIdValues).trigger("change");
            }

            $("#ui_chkIsMailRespondent").click();
        }

        if (ruleConditions.IsSmsIsRespondent == true) {
            if (ruleConditions.SmsRespondentConditionIsTrueOrIsFalse == false)
                $("#ui_radSmsRespondentIsFalse").prop('checked', true);
            else
                $("#ui_radSmsRespondentIsTrue").prop('checked', true);

            var SmsTemplateIdValues = [];

            if (ruleConditions.SmsRespondentTemplates != undefined && ruleConditions.SmsRespondentTemplates != null && ruleConditions.SmsRespondentTemplates != "") {
                var smsvalues = ruleConditions.SmsRespondentTemplates.split(",");
                for (var i = 0; i < smsvalues.length; i++) {
                    SmsTemplateIdValues.push(smsvalues[i]);
                }
                $("#ui_ddlSmsRespondentTemplate").val(SmsTemplateIdValues).trigger("change");
            }

            $("#ui_chkIsSmsRespondent").click();
        }

        if (ruleConditions.SearchString != null && ruleConditions.SearchString.length > 0) {
            $("#ui_txtSearchKeyword").val(ruleConditions.SearchString);
            $("#ui_chkSearchKeywordIs").click();
        }

        if (ruleConditions.Country != null && ruleConditions.Country.length > 0) {
            var countryList = ruleConditions.Country.split("@$");

            var CountryIdValues = [];

            for (var i = 0; i < countryList.length; i++) {
                CountryIdValues.push(countryList[i]);
            }

            $("#ui_txtCountry").val(CountryIdValues).trigger("change");

            if (ruleConditions.CountryConditionIsTrueOrIsFalse == false)
                $("#ui_radCountryIsFalse").prop('checked', true);
            else
                $("#ui_radCountryIsTrue").prop('checked', true);

            $("#ui_chkCountryIs").click();
        }

        if (ruleConditions.StateName != null && ruleConditions.StateName.length > 0) {
            var stateList = ruleConditions.StateName.split("@$");
            for (var i = 0; i < stateList.length; i++) {

                var data = new Array();
                data["item"] = new Array();
                data.item.value = stateList[i];
                data.item.label = stateList[i];
                formruleUtil.AppendSelected("ui_txtState_values", data, "");
            }

            if (ruleConditions.StateConditionIsTrueOrIsFalse == false)
                $("#ui_radStateIsFalse").prop('checked', true);
            else
                $("#ui_radStateIsTrue").prop('checked', true);

            $("#ui_chkStateIs").click();
        }

        if (ruleConditions.City != null && ruleConditions.City.length > 0) {
            var cityList = ruleConditions.City.split("@$");
            for (var i = 0; i < cityList.length; i++) {

                var data = new Array();
                data["item"] = new Array();
                data.item.value = cityList[i];
                data.item.label = cityList[i];
                formruleUtil.AppendSelected("ui_txtCity_values", data, "");
            }

            if (ruleConditions.CityConditionIsTrueOrIsFalse == false)
                $("#ui_radCityIsFalse").prop('checked', true);
            else
                $("#ui_radCityIsTrue").prop('checked', true);

            $("#ui_chkCityIs").click();
        }

        if (ruleConditions.AlreadyVisitedPages != null && ruleConditions.AlreadyVisitedPages.length > 0) {
            $("#ui_txtAlreadyVisitedPageUrls").val(ruleConditions.AlreadyVisitedPages);
            $("#ui_chkAlreadyVisitedPages").click();

            if (ruleConditions.IsVisitedPagesContainsCondition == 1)
                $("#ui_AlreadyPageUrlCheckContains").prop("checked", true);


            if (ruleConditions.AlreadyVisitedPagesOverAllOrSessionWise == 0)
                $("#ui_radPageViewOverAll").prop('checked', true);
            else
                $("#ui_radPageViewSessionWise").prop('checked', true);
        }

        if (ruleConditions.AlreadyVisitedWithPageUrlParameters != null && ruleConditions.AlreadyVisitedWithPageUrlParameters.length > 0) {
            $("#ui_txtVisitorsAlreadyVisitedPagesWithPageUrlParameter").val(ruleConditions.AlreadyVisitedWithPageUrlParameters);
            $("#ui_chkVisitorsAlreadyVisitedPagesWithPageUrlParameter").click();
        }

        if (ruleConditions.NotAlreadyVisitedPages != null && ruleConditions.NotAlreadyVisitedPages.length > 0) {
            $("#ui_txtNotAlreadyVisitedPageUrls").val(ruleConditions.NotAlreadyVisitedPages);
            $("#ui_chkNotAlreadyVisitedPages").click();

            if (ruleConditions.IsNotVisitedPagesContainsCondition == 1)
                $("#ui_NotAlreadyPageUrlCheckContains").prop("checked", true);

            if (ruleConditions.NotAlreadyVisitedPagesOverAllOrSessionWise == 0)
                $("#ui_radNotPageViewOverAll").prop('checked', true);
            else
                $("#ui_radNotPageViewSessionWise").prop('checked', true);
        }

        if (ruleConditions.NotAlreadyVisitedWithPageUrlParameters != null && ruleConditions.NotAlreadyVisitedWithPageUrlParameters.length > 0) {
            $("#ui_txtVisitorsNotAlreadyVisitedPagesWithPageUrlParameter").val(ruleConditions.NotAlreadyVisitedWithPageUrlParameters);
            $("#ui_chkVisitorsNotAlreadyVisitedPagesWithPageUrlParameter").click();
        }

        if (ruleConditions.OverAllTimeSpentInSite > 0) {
            $("#ui_txtTimeSpentInSite").val(ruleConditions.OverAllTimeSpentInSite);
            $("#ui_chkTimeSpentInSite").click();
        }

        if (ruleConditions.IsMobileDevice > 0) {

            if (ruleConditions.IsMobileDevice == 1)
                $("#ui_radMobileDeviceConditionIsTrue").prop('checked', true);
            else
                $("#ui_radMobileDeviceConditionIsFalse").prop('checked', true);

            $("#ui_chkIsAndriodMobile").click();
        }
    },
    BindInteractionData: function () {

        if (ruleConditions.IsClickedSpecificButtons != null && ruleConditions.IsClickedSpecificButtons.length > 0) {

            var clickedTags = ruleConditions.IsClickedSpecificButtons.split(",");
            for (var i = 0; i < clickedTags.length; i++) {

                var idAndLabel = clickedTags[i]
                var data = new Array();
                data["item"] = new Array();
                data.item.value = idAndLabel;
                data.item.label = idAndLabel;
                formruleUtil.AppendSelected("ui_txtClickButton_values", data, "clkBtn");
            }
            $("#ui_chkClickedButton").click();
        }

        if (ruleConditions.IsNotClickedSpecificButtons != null && ruleConditions.IsNotClickedSpecificButtons.length > 0) {

            var clickedTags = ruleConditions.IsNotClickedSpecificButtons.split(",");
            for (var i = 0; i < clickedTags.length; i++) {

                var idAndLabel = clickedTags[i]
                var data = new Array();
                data["item"] = new Array();
                data.item.value = idAndLabel;
                data.item.label = idAndLabel;
                formruleUtil.AppendSelected("ui_txtNotClickButton_values", data, "clkBtn");
            }
            $("#ui_chkNotClickedButton").click();
        }

        if (ruleConditions.ClickedPriceRangeProduct != null && ruleConditions.ClickedPriceRangeProduct.length > 0) {

            var products = ruleConditions.ClickedPriceRangeProduct.split(",");
            for (var i = 0; i < products.length; i++) {
                var idAndLabel = products[i]
                var data = new Array();
                data["item"] = new Array();
                data.item.value = idAndLabel
                data.item.label = idAndLabel

                formruleUtil.AppendSelected("ui_txtPriceRangeProducts_values", data, "ClickProduct");
            }
            $("#ui_chkClickedPriceRange").click();
        }

        if (ruleConditions.IsVisitorRespondedChat == true)
            $("#ui_chkRespondedInChat").click();

        if (ruleConditions.MailCampignResponsiveStage > 0) {
            $("#ui_ddlMailScore").val(ruleConditions.MailCampignResponsiveStage);
            $("#ui_chkMailResponseStage").click();
        }

        if (ruleConditions.IsRespondedForm > 0) {
            $("#ui_ddlRespondedFroms").select2().val(ruleConditions.IsRespondedForm).change();
            $("#ui_chkRespondedForm").click();
        }

        if (ruleConditions.IsNotRespondedForm > 0) {
            $("#ui_ddlNotRespondedFroms").select2().val(ruleConditions.IsNotRespondedForm).change();
            $("#ui_chkNotRespondedForm").click();
        }

        if (ruleConditions.DependencyFormId > 0) {
            $("#ui_ddlAnswerDependencyFroms").select2().val(ruleConditions.DependencyFormId).change();
            $("#ui_ddlAnswerCondition").val(ruleConditions.DependencyFormCondition)
            $("#ui_txtAnswerCondition1").val(ruleConditions.DependencyFormAnswer1);

            if ($("#ui_ddlAnswerCondition").val() == "3") {
                $("#ui_txtAnswerCondition2").val(ruleConditions.DependencyFormAnswer2);
                $("#ui_ddlAnswerCondition").change();
            }
            $("#ui_chkAnswerDependencyForm").click();
        }

        if (ruleConditions.CloseCount > 0) {
            $("#ui_txtClosedNTimes").val(ruleConditions.CloseCount);

            if (ruleConditions.CloseCountSessionWiseOrOverAll == 1)
                $("#ui_radCloseCountOverAll").prop('checked', true);
            else
                $("#ui_radCloseCountSessionWise").prop('checked', true);

            $("#ui_chkClosedNTimes").click();
        }

        if (ruleConditions.AddedProductsToCart != null && ruleConditions.AddedProductsToCart.length > 0) {

            var products = ruleConditions.AddedProductsToCart.split("@#");
            for (var i = 0; i < products.length; i++) {
                var idAndLabel = products[i].split("-");
                var data = new Array();
                data["item"] = new Array();
                data.item.value = idAndLabel[0];
                data.item.label = idAndLabel[1];
                formruleUtil.AppendSelected("ui_txtAddedToCartProducts_values", data, "AddedToCart");
            }
            $("#ui_chkAddedToCart").click();
        }

        if (ruleConditions.ViewedButNotAddedProductsToCart != null && ruleConditions.ViewedButNotAddedProductsToCart.length > 0) {

            var products = ruleConditions.ViewedButNotAddedProductsToCart.split("@#");
            for (var i = 0; i < products.length; i++) {
                var idAndLabel = products[i].split("-");
                var data = new Array();
                data["item"] = new Array();
                data.item.value = idAndLabel[0];
                data.item.label = idAndLabel[1];

                formruleUtil.AppendSelected("ui_txtViewedNotAddedToCartProducts_values", data, "NotAddedToCart");
            }
            $("#ui_chkViewedNotAddedToCart").click();
        }

        if (ruleConditions.DroppedProductsFromCart != null && ruleConditions.DroppedProductsFromCart.length > 0) {

            var products = ruleConditions.DroppedProductsFromCart.split("@#");
            for (var i = 0; i < products.length; i++) {
                var idAndLabel = products[i].split("-");
                var data = new Array();
                data["item"] = new Array();
                data.item.value = idAndLabel[0];
                data.item.label = idAndLabel[1];

                formruleUtil.AppendSelected("ui_txtDropedFromCartProducts_values", data, "DropFromCart");
            }
            $("#ui_chkDropedFromCart").click();
        }

        if (ruleConditions.PurchasedProducts != null && ruleConditions.PurchasedProducts.length > 0) {
            var products = ruleConditions.PurchasedProducts.split("@#");
            for (var i = 0; i < products.length; i++) {
                var idAndLabel = products[i].split("-");
                var data = new Array();
                data["item"] = new Array();
                data.item.value = idAndLabel[0];
                data.item.label = idAndLabel[1];

                formruleUtil.AppendSelected("ui_txtCustomerPurchasedProducts_values", data, "Purchase");
            }
            $("#ui_chkCustomerPurchased").click();
        }

        if (ruleConditions.NotPurchasedProducts != null && ruleConditions.NotPurchasedProducts.length > 0) {

            var products = ruleConditions.NotPurchasedProducts.split("@#");
            for (var i = 0; i < products.length; i++) {
                var idAndLabel = products[i].split("-");
                var data = new Array();
                data["item"] = new Array();
                data.item.value = idAndLabel[0];
                data.item.label = idAndLabel[1];
                formruleUtil.AppendSelected("ui_txtCustomerNotPurchasedProducts_values", data, "NotPurchase");
            }
            $("#ui_chkCustomerNotPurchased").click();
        }

        if (ruleConditions.TotalPurchaseQtyConditon > 0) {
            $("#ui_ddlCustomerTotalPurchase").val(ruleConditions.TotalPurchaseQtyConditon);
            $("#ui_txtCustomerTotalPurchase1").val(ruleConditions.CustomerTotalPurchase1);
            if ($("#ui_ddlCustomerTotalPurchase").val() == "3") {
                $("#ui_txtCustomerTotalPurchase2").val(ruleConditions.CustomerTotalPurchase2);
                $("#ui_ddlCustomerTotalPurchase").change();
            }
            $("#ui_chkTotalPurchaseIs").click();
        }

        if (ruleConditions.TotalPurchaseAmtCondition > 0) {
            $("#ui_ddlCustomerCurrentValue").val(ruleConditions.TotalPurchaseAmtCondition);
            $("#ui_txtCustomerCurrentValue1").val(ruleConditions.CustomerCurrentValue1);
            if ($("#ui_ddlCustomerCurrentValue").val() == "3") {
                $("#ui_txtCustomerCurrentValue2").val(ruleConditions.CustomerCurrentValue2);
                $("#ui_ddlCustomerCurrentValue").change();
            }
            $("#ui_chkCustomerCurrectValue").click();
        }

        if (ruleConditions.LastPurchaseIntervalCondition > 0) {
            $("#ui_ddlLastPurchaseCondition").val(ruleConditions.LastPurchaseIntervalCondition);
            $("#ui_txtLastPurchaseRange1").val(ruleConditions.LastPurchaseIntervalRange1);
            if ($("#ui_ddlLastPurchaseCondition").val() == "3") {
                $("#ui_txtLastPurchaseRange2").val(ruleConditions.LastPurchaseIntervalRange2);
                $("#ui_ddlLastPurchaseCondition").change();
            }
            $("#ui_chkCustomerLastPurchase").click();
        }

        if (ruleConditions.AddedProductsCategoriesToCart != null && ruleConditions.AddedProductsCategoriesToCart.length > 0) {

            var products = ruleConditions.AddedProductsCategoriesToCart.split("|");
            for (var i = 0; i < products.length; i++) {
                var data = new Array();
                data["item"] = new Array();
                data.item.value = products[i];
                data.item.label = products[i];

                formruleUtil.AppendSelected("ui_txtAddedToCartProductsCategories_values", data, "CategoriesAddedToCart");
            }
            $("#ui_chkCategoriesAddedToCart").click();
        }

        if (ruleConditions.NotAddedProductsCategoriesToCart != null && ruleConditions.NotAddedProductsCategoriesToCart.length > 0) {

            var products = ruleConditions.NotAddedProductsCategoriesToCart.split("|");
            for (var i = 0; i < products.length; i++) {
                var data = new Array();
                data["item"] = new Array();
                data.item.value = products[i];
                data.item.label = products[i];

                formruleUtil.AppendSelected("ui_txtNotAddedToCartProductsCategories_values", data, "CategoriesnotAddedToCart");
            }

            $("#ui_chkCategoriesNotAddedToCart").click();
        }

        if (ruleConditions.AddedProductsSubCategoriesToCart != null && ruleConditions.AddedProductsSubCategoriesToCart.length > 0) {

            var products = ruleConditions.AddedProductsSubCategoriesToCart.split("|");
            for (var i = 0; i < products.length; i++) {
                var data = new Array();
                data["item"] = new Array();
                data.item.value = products[i];
                data.item.label = products[i];

                formruleUtil.AppendSelected("ui_txtAddedToCartProductsSubCategories_values", data, "SubCategoriesAddedToCart");
            }
            $("#ui_chkSubCategoriesAddedToCart").click();
        }

        if (ruleConditions.NotAddedProductsSubCategoriesToCart != null && ruleConditions.NotAddedProductsSubCategoriesToCart.length > 0) {

            var products = ruleConditions.NotAddedProductsSubCategoriesToCart.split("|");
            for (var i = 0; i < products.length; i++) {
                var data = new Array();
                data["item"] = new Array();
                data.item.value = products[i];
                data.item.label = products[i];

                formruleUtil.AppendSelected("ui_txtNotAddedToCartProductsSubCategories_values", data, "SubCategoriesnotAddedToCart");
            }
            $("#ui_chkSubCategoriesNotAddedToCart").click();
        }
    },
    BindInteractionEventData: function () {

        if (ruleConditions.ImpressionEventForFormId > -1) {
            $("#ui_ddlFormImpression").select2().val(ruleConditions.ImpressionEventForFormId).change();
            $("#ui_txtFormImpressionCount").val(ruleConditions.ImpressionEventCountCondition);
            $("#ui_chkFormImpression").click();
        }

        if (ruleConditions.CloseEventForFormId > -1) {
            $("#ui_ddlFormCloseEvent").select2().val(ruleConditions.CloseEventForFormId).change();
            $("#ui_txtFormCloseEventCount").val(ruleConditions.CloseEventCountCondition);
            $("#ui_chkFormCloseEvent").click();
        }

        if (ruleConditions.ResponsesEventForFormId > -1) {
            $("#ui_ddlResponseCountEvent").select2().val(ruleConditions.ResponsesEventForFormId).change();
            $("#ui_txtResponseCountEventCount").val(ruleConditions.ResponsesEventCountCondition);
            $("#ui_chkResponseCountEvent").click();
        }

        if (ruleConditions.ShowFormOnlyNthTime > 0) {
            $("#ui_txtShowFormAtNTime").val(ruleConditions.ShowFormOnlyNthTime);
            $("#ui_chkShowFormAtNTime").click();
        }
    },
    BindProfileData: function () {

        if (ruleConditions.OnlineSentimentIs > 0) {
            $("#ui_ddlOnlineSentimentIs").val(ruleConditions.OnlineSentimentIs);
            $("#ui_chkOnlineSentimentIs").click();
        }

        if (ruleConditions.SocialStatusIs > 0) {
            $("#ui_ddlSocialStatus").val(ruleConditions.SocialStatusIs);
            $("#ui_chkSocialStatusIs").click();
        }

        if (ruleConditions.InfluentialScoreCondition > 0) {
            $("#ui_ddlInfluentialScoreIs").val(ruleConditions.InfluentialScoreCondition);
            $("#ui_txtInfluentialScore1").val(ruleConditions.InfluentialScore1);
            if ($("#ui_ddlInfluentialScoreIs").val() == "3") {
                $("#ui_txtInfluentialScore2").val(ruleConditions.InfluentialScore2);
                $("#ui_ddlInfluentialScoreIs").change();
            }
            $("#ui_chkInfluentialScoreIs").click();
        }

        if (ruleConditions.OfflineSentimentIs > 0) {
            $("#ui_ddlOfflineSentiment").val(ruleConditions.OfflineSentimentIs);
            $("#ui_chkOfflineSentimentIs").click();
        }

        if (ruleConditions.ProductRatingIs > 0) {
            $("#ui_ddlRating").val(ruleConditions.ProductRatingIs);
            $("#ui_chkProductRatingIs").click();
        }

        if (ruleConditions.NurtureStatusIs > -1) {
            $("#ui_ddlProspectStatus").val(ruleConditions.NurtureStatusIs).change();
            $("#ui_chkProspectStatusIs").click();
        }

        if (ruleConditions.GenderIs != null && ruleConditions.GenderIs.length > 0) {
            $("#ui_ddlProspectGender").val(ruleConditions.GenderIs);
            $("#ui_chkProspectGenderIs").click();
        }

        if (ruleConditions.MaritalStatusIs != null && ruleConditions.MaritalStatusIs > 0) {
            $("#ui_ddlMartialStatus").val(ruleConditions.MaritalStatusIs);
            $("#ui_chkMartialStatus").click();
        }

        if (ruleConditions.ProfessionIs != null && ruleConditions.ProfessionIs.length > 0) {
            $("#ui_txtIndustryIs").val(ruleConditions.ProfessionIs);
            $("#ui_chkIndustryIs").click();
        }

        if (ruleConditions.NotConnectedSocially > 0) {
            $("#ui_ddlConnectedSocially").val(ruleConditions.NotConnectedSocially);
            $("#ui_chkIsConnectedSocially").click();
        }

        if (ruleConditions.LoyaltyPointsCondition > 0) {
            $("#ui_ddlProspectLoyaltyIs").val(ruleConditions.LoyaltyPointsCondition);
            $("#ui_txtProspectLoyalty1").val(ruleConditions.LoyaltyPointsRange1);
            if ($("#ui_ddlProspectLoyaltyIs").val() == "3") {
                $("#ui_txtProspectLoyalty2").val(ruleConditions.LoyaltyPointsRange2);
                $("#ui_ddlProspectLoyaltyIs").change();
            }
            $("#ui_chkProspectLoyaltyIs").click();
        }

        if (ruleConditions.RFMSScoreRangeCondition > 0) {
            $("#ui_ddlRFMSScore").val(ruleConditions.RFMSScoreRangeCondition);
            $("#ui_txtRFMSScore1").val(ruleConditions.RFMSScoreRange1);
            if ($("#ui_ddlRFMSScore").val() == "3") {
                $("#ui_txtRFMSScore2").val(ruleConditions.RFMSScoreRange2);
                $("#ui_ddlRFMSScore").change();
            }
            $("#ui_chkRFMSScoreIs").click();
        }

        if (ruleConditions.IsBirthDay == true) {

            if (ruleConditions.IsDOBTodayOrMonth == 0) {
                $("#ui_rdbtnDay").prop('checked', true);
            }
            else if (ruleConditions.IsDOBTodayOrMonth == 1) {
                $("#ui_rdbtnMonth").prop('checked', true);
                $("#ui_rdbtnMonth").click();
            }
            else if (ruleConditions.IsDOBTodayOrMonth == 2 && ruleConditions.DOBFromDate != null && ruleConditions.DOBFromDate != "" && ruleConditions.DOBFromDate.length > 0 && ruleConditions.DOBToDate != null && ruleConditions.DOBToDate != "" && ruleConditions.DOBToDate.length > 0) {
                $("#ui_rdbtnDates").prop('checked', true);
                $("#ui_rdbtnDates").click();
                var FromDate = GetJavaScriptDateObj(ruleConditions.DOBFromDate)
                FromDate = FromDate.getFullYear() + "-" + ((FromDate.getMonth() + 1).toString().length == 1 ? "0" + (FromDate.getMonth() + 1) : (FromDate.getMonth() + 1)) + "-" + (FromDate.getDate().toString().length == 1 ? "0" + FromDate.getDate() : FromDate.getDate());
                $("#txtFromDate").val(FromDate);
                var ToDate = GetJavaScriptDateObj(ruleConditions.DOBToDate)
                ToDate = ToDate.getFullYear() + "-" + ((ToDate.getMonth() + 1).toString().length == 1 ? "0" + (ToDate.getMonth() + 1) : (ToDate.getMonth() + 1)) + "-" + (ToDate.getDate().toString().length == 1 ? "0" + ToDate.getDate() : ToDate.getDate());
                $("#txtToDate").val(ToDate);
            }
            else if (ruleConditions.IsDOBTodayOrMonth == 3 && ruleConditions.DOBDaysDiffernce != null && ruleConditions.DOBDaysDiffernce != "" && ruleConditions.DOBDaysDiffernce != undefined && ruleConditions.DOBDaysDiffernce != 0) {
                $("#ui_rdbtnDayDiff").prop('checked', true);
                $("#ui_rdbtnDayDiff").click();
                var DiffDate = formruleUtil.GetDifferenceDateValue(new Date(), ruleConditions.DOBDaysDiffernce)
                $("#ui_txtDOBNoofDays").val(ruleConditions.DOBDaysDiffernce);
                $("#txtDiffDate").val(DiffDate);
            }

            if (ruleConditions.IsDOBIgnored == true) {
                $("#chk_IgnoreDOB").prop('checked', true);
                $("#ui_ddlIgnoreDOB").val(ruleConditions.IsDOBIgnoreCondition);
            }

            $("#dv_IgnoreCondition").show();
            $("#ui_chkDOBIs").click();
        }
    },
    ValidateDisplayRules: function () {

        if (!formruleUtil.ValidationOfAudience())
            return false;
        if (!formruleUtil.ValidateBehavior())
            return false;
        if (!formruleUtil.ValidateInteraction())
            return false;
        if (!formruleUtil.ValidateInteractionEvent())
            return false;
        if (!formruleUtil.ValidateProfile())
            return false;
        return true;

    },
    ValidationOfAudience: function () {
        if ($("#ui_chkSegment").is(":checked") && $("input[name='BelongsGroup']:checked").val() && $("#ui_txtGroups_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.SelectGroup);
            $("#ui_txtGroups").focus();
            return false;
        }
        return true;
    },
    ValidateBehavior: function () {

        if ($("#ui_chkBehavioralScore").is(":checked")) {
            if ($("#ui_VisitorScore1").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterBehaviouralScore);
                $("#ui_VisitorScore1").focus();
                return false;
            }
            else if ($("#ui_ddlBehavioralScoreRange").val() == "3" && $("#ui_VisitorScore2").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterBehaviouralScoreRange);
                $("#ui_VisitorScore2").focus();
                return false;
            }
            else if ($("#ui_ddlBehavioralScoreRange").val() == "3" && parseInt($("#ui_VisitorScore1").val()) > parseInt($("#ui_VisitorScore2").val())) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterValidBehaviouralScoreRange);
                $("#ui_VisitorScore2").focus();
                return false;
            }
        }
        if ($("#ui_chkSessionIs").is(":checked") && $("#ui_txtSession").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterSessionValue);
            $("#ui_txtSession").focus();
            return false;
        }
        if ($("#ui_chkPageDepthIs").is(":checked") && $("#ui_txtPageDepthIs").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterPageDepth);
            $("#ui_txtPageDepthIs").focus();
            return false;
        }
        if ($("#ui_chkPageViewIs").is(":checked") && $("#ui_txtPageViewIs").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterPageView);
            $("#ui_txtPageViewIs").focus();
            return false;
        }

        if ($("#ui_chkIsMailRespondent").is(":checked")) {
            if ($("#ui_ddlMailRespondentTemplate option").length <= 1) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.AddTemplate);
                $("#ui_ddlMailRespondentTemplate").focus();
                return false;
            }

            if ($('#ui_ddlMailRespondentTemplate').select2().val() == undefined || $('#ui_ddlMailRespondentTemplate').select2().val() == null || $('#ui_ddlMailRespondentTemplate').select2().val().toString() == "" || $('#ui_ddlMailRespondentTemplate').select2().val().toString().length == "0") {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.SelectMailRespondedTemplates);
                $("#ui_ddlMailRespondentTemplate").focus();
                return false;
            }

            if ($('#ui_ddlMailRespondentTemplate').select2().val() != undefined && $('#ui_ddlMailRespondentTemplate').select2().val() != null && $('#ui_ddlMailRespondentTemplate').select2().val().toString().split(',').length > 1) {
                var MailTempNames = [];
                $.each($('#ui_ddlMailRespondentTemplate').select2('data'), function () {
                    MailTempNames.push($(this)[0].text);
                });

                if (jQuery.inArray("All", MailTempNames) !== -1) {
                    ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.DefaultSMSRespondedTemplates);
                    $("#ui_ddlMailRespondentTemplate").focus();
                    return false;
                }
            }
        }

        if ($("#ui_chkIsSmsRespondent").is(":checked")) {
            if ($("#ui_ddlSmsRespondentTemplate option").length <= 1) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.AddTemplate);
                $("#ui_ddlSmsRespondentTemplate").focus();
                return false;
            }

            if ($('#ui_ddlSmsRespondentTemplate').select2().val() == undefined || $('#ui_ddlSmsRespondentTemplate').select2().val() == null || $('#ui_ddlSmsRespondentTemplate').select2().val().toString() == "" || $('#ui_ddlSmsRespondentTemplate').select2().val().toString().length == "0") {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.SelectSMSRespondedTemplates);
                $("#ui_ddlSmsRespondentTemplate").focus();
                return false;
            }

            if ($('#ui_ddlSmsRespondentTemplate').select2().val() != undefined && $('#ui_ddlSmsRespondentTemplate').select2().val() != null && $('#ui_ddlSmsRespondentTemplate').select2().val().toString().split(',').length > 1) {
                var SmsTempNames = [];
                $.each($('#ui_ddlSmsRespondentTemplate').select2('data'), function () {
                    SmsTempNames.push($(this)[0].text);
                });

                if (jQuery.inArray("All", SmsTempNames) !== -1) {
                    ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.DefaultSMSRespondedTemplates);
                    $("#ui_ddlSmsRespondentTemplate").focus();
                    return false;
                }
            }
        }

        if ($("#ui_chkFrequencyIs").is(":checked") && $("#ui_txtFrequencyIs").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterFrequency);
            $("#ui_txtFrequencyIs").focus();
            return false;
        }

        if ($("#ui_chkOnPageUrl").is(":checked") && $("#ui_txtPageUrl").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterPageUrl);
            $("#ui_txtPageUrl").focus();
            return false;
        }

        if ($("#ui_chkNotOnPageUrl").is(":checked") && $("#ui_txtNotPageUrl").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterExceptPageUrls);
            $("#ui_txtNotPageUrl").focus();
            return false;
        }

        if ($("#ui_chkVisitorsVisitedPagesWithPageUrlParameter").is(":checked") && $("#ui_txtVisitorsVisitedPagesWithPageUrlParameter").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterPageUrlParameter);
            $("#ui_txtVisitorsVisitedPagesWithPageUrlParameter").focus();
            return false;
        }

        if ($("#ui_chkSourceIs").is(":checked") && $("#ui_radSourceIsReferrer").is(":checked") && $("#ui_txtSourceIs").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterSourceUrl);
            $("#ui_txtSourceIs").focus();
            return false;
        }
        if ($("#ui_chkSearchKeywordIs").is(":checked") && $("#ui_txtSearchKeyword").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterSearchKeyword);
            $("#ui_txtSearchKeyword").focus();
            return false;
        }

        if ($("#ui_chkCountryIs").is(":checked")) {
            if ($('#ui_txtCountry').select2().val() == undefined || $('#ui_txtCountry').select2().val() == null || $('#ui_txtCountry').select2().val().toString() == "" || $('#ui_txtCountry').select2().val().toString().length == "0") {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterCountryName);
                $("#ui_txtCountry").focus();
                return false;
            }
        }

        if ($("#ui_chkStateIs").is(":checked") && $("#ui_txtState_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterStateName);
            $("#ui_txtState").focus();
            return false;
        }

        if ($("#ui_chkCityIs").is(":checked") && $("#ui_txtCity_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterCityName);
            $("#ui_txtCity").focus();
            return false;
        }

        if ($("#ui_chkAlreadyVisitedPages").is(":checked") && $("#ui_txtAlreadyVisitedPageUrls").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterAlreadyVisitedPageUrls);
            $("#ui_txtAlreadyVisitedPageUrls").focus();
            return false;
        }

        if ($("#ui_chkVisitorsAlreadyVisitedPagesWithPageUrlParameter").is(":checked") && $("#ui_txtVisitorsAlreadyVisitedPagesWithPageUrlParameter").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterAlreadyVisitedPageUrlsParameter);
            $("#ui_txtVisitorsAlreadyVisitedPagesWithPageUrlParameter").focus();
            return false;
        }

        if ($("#ui_chkNotAlreadyVisitedPages").is(":checked") && $("#ui_txtNotAlreadyVisitedPageUrls").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterAlreadyNotVisitedPageUrls);
            $("#ui_txtNotAlreadyVisitedPageUrls").focus();
            return false;
        }

        if ($("#ui_chkVisitorsNotAlreadyVisitedPagesWithPageUrlParameter").is(":checked") && $("#ui_txtVisitorsNotAlreadyVisitedPagesWithPageUrlParameter").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterAlreadyNotVisitedPageUrlsParameter);
            $("#ui_txtVisitorsNotAlreadyVisitedPagesWithPageUrlParameter").focus();
            return false;
        }

        if ($("#ui_chkTimeSpentInSite").is(":checked") && $("#ui_txtTimeSpentInSite").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterOverAllTimeSpentInSite);
            $("#ui_txtTimeSpentInSite").focus();
            return false;
        }

        return true;
    },
    ValidateInteraction: function () {

        if ($("#ui_chkClickedButton").is(":checked") && $("#ui_txtClickButton_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterClickedButtonTagName);
            $("#ui_txtClickButton").focus();
            return false;
        }

        if ($("#ui_chkNotClickedButton").is(":checked") && $("#ui_txtNotClickButton_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterNotClickedButtonTagName);
            $("#ui_txtNotClickButton").focus();
            return false;
        }

        if ($("#ui_chkClickedPriceRange").is(":checked")) {

            if ($("#ui_txtPriceRangeProducts_values").children().length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.Enterclickedtag);
                $("#ui_txtPriceRangeProducts").focus();
                return false;
            }
        }

        if ($("#ui_chkRespondedForm").is(":checked")) {

            if ($("#ui_ddlRespondedFroms option").length <= 1) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.CreateForms);
                $("#ui_ddlRespondedFroms").focus();
                return false;
            }

            if ($("#ui_ddlRespondedFroms").val() == 0) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.SelectForms);
                $("#ui_ddlRespondedFroms").focus();
                return false;
            }
        }

        if ($("#ui_chkNotRespondedForm").is(":checked")) {
            if ($("#ui_ddlNotRespondedFroms option").length <= 1) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.CreateForms);
                $("#ui_ddlNotRespondedFroms").focus();
                return false;
            }

            if ($("#ui_ddlNotRespondedFroms").val() == 0) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.SelectForms);
                $("#ui_ddlNotRespondedFroms").focus();
                return false;
            }
        }

        if ($("#ui_chkAnswerDependencyForm").is(":checked")) {
            if ($("#ui_ddlAnswerDependencyFroms").val() == "0") {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.SelectAnswerDependency);
                $("#ui_ddlAnswerDependencyFroms").focus();
                return false;
            }
            if ($("input:radio[name='AnswerDependencyFieldOption']:checked").val() == undefined) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.SelectAnswerDependencyFormField);
                $("#ui_ddlAnswerDependencyFroms").focus();
                return false;
            }
            if ($("#ui_txtAnswerCondition1").val().length == 0) {
                $("#ui_txtAnswerCondition1").focus();
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.SelectAnswerDependencyFormFieldAnswerValue);
                return false;
            }
            if ($("#ui_ddlAnswerCondition").val() == "3" && $("#ui_txtAnswerCondition2").val().length == 0) {
                $("#ui_txtAnswerCondition2").focus();
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterAnswerDependencyFormFieldCorrectRange);
                return false;
            }
        }

        if ($("#ui_chkClosedNTimes").is(":checked") && $("#ui_txtClosedNTimes").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterVisitorClosedFormNthTime);
            $("#ui_txtClosedNTimes").focus();
            return false;
        }
        if ($("#ui_chkAddedToCart").is(":checked") && $("#ui_txtAddedToCartProducts_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterAddedToCartProducts);
            $("#ui_txtAddedToCartProducts").focus();
            return false;
        }
        if ($("#ui_chkViewedNotAddedToCart").is(":checked") && $("#ui_txtViewedNotAddedToCartProducts_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterViewedButNotAddedToCartProducts);
            $("#ui_txtViewedNotAddedToCartProducts").focus();
            return false;
        }
        if ($("#ui_chkDropedFromCart").is(":checked") && $("#ui_txtDropedFromCartProducts_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterDroppedCartProducts);
            $("#ui_txtDropedFromCartProducts").focus();
            return false;
        }
        if ($("#ui_chkCustomerPurchased").is(":checked") && $("#ui_txtCustomerPurchasedProducts_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.SelectCustomerPurchasedProducts);
            $("#ui_txtCustomerPurchasedProducts").focus();
            return false;
        }
        if ($("#ui_chkCustomerNotPurchased").is(":checked") && $("#ui_txtCustomerNotPurchasedProducts_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.SelectCustomerNotPurchasedProducts);
            $("#ui_txtCustomerNotPurchasedProducts").focus();
            return false;
        }
        if ($("#ui_chkTotalPurchaseIs").is(":checked")) {
            if ($('#ui_ddlCustomerTotalPurchase option:selected').val() != "3" && $("#ui_txtCustomerTotalPurchase1").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterCustomerTotalTransaction);
                $("#ui_txtCustomerTotalPurchase2").focus();
                return false;
            }
            else if ($('#ui_ddlCustomerTotalPurchase option:selected').val() == "3") {

                if ($("#ui_txtCustomerTotalPurchase1").val().length == 0 || $("#ui_txtCustomerTotalPurchase2").val().length == 0) {
                    ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterCustomerTotalTransaction);
                    return false;
                } else {
                    if (parseInt($("#ui_txtCustomerTotalPurchase2").val()) <= parseInt($("#ui_txtCustomerTotalPurchase1").val())) {
                        ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterCustomerTotalTransactionRange);
                        return false;
                    }
                }
            }
        }


        if ($("#ui_chkCustomerCurrectValue").is(":checked")) {
            if ($('#ui_ddlCustomerCurrentValue option:selected').val() != "3" && $("#ui_txtCustomerCurrentValue1").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterCustomerCurrentValue);
                $("#ui_txtCustomerTotalPurchase2").focus();
                return false;
            }
            else if ($('#ui_ddlCustomerCurrentValue option:selected').val() == "3") {

                if ($("#ui_txtCustomerCurrentValue1").val().length == 0 || $("#ui_txtCustomerCurrentValue2").val().length == 0) {
                    ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterCustomerCurrentValue);
                    return false;
                } else {
                    if (parseInt($("#ui_txtCustomerCurrentValue2").val()) <= parseInt($("#ui_txtCustomerCurrentValue1").val())) {
                        ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterCustomerCurrentRange);
                        return false;
                    }
                }
            }
        }

        if ($("#ui_chkCustomerLastPurchase").is(":checked")) {
            if ($('#ui_ddlLastPurchaseCondition option:selected').val() != "3" && $("#ui_txtLastPurchaseRange1").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterCustomerLastPurchased);
                $("#ui_txtCustomerTotalPurchase2").focus();
                return false;
            }
            else if ($('#ui_ddlLastPurchaseCondition option:selected').val() == "3") {

                if ($("#ui_txtLastPurchaseRange1").val().length == 0 || $("#ui_txtLastPurchaseRange2").val().length == 0) {
                    ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterCustomerLastPurchased);
                    return false;
                } else {
                    if (parseInt($("#ui_txtLastPurchaseRange2").val()) <= parseInt($("#ui_txtLastPurchaseRange1").val())) {
                        ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterCustomerLastPurchasedRange);
                        return false;
                    }
                }
            }
        }

        if ($("#ui_chkCategoriesAddedToCart").is(":checked") && $("#ui_txtAddedToCartProductsCategories_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.SelectAddedToCartProductCategories);
            $("#ui_chkCategoriesAddedToCart").focus();
            return false;
        }
        if ($("#ui_chkCategoriesNotAddedToCart").is(":checked") && $("#ui_txtNotAddedToCartProductsCategories_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.SelectNotAddedToCartProductCategories);
            $("#ui_chkCategoriesNotAddedToCart").focus();
            return false;
        }
        if ($("#ui_chkSubCategoriesAddedToCart").is(":checked") && $("#ui_txtAddedToCartProductsSubCategories_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.SelectAddedToCartProductSubCategories);
            $("#ui_chkSubCategoriesAddedToCart").focus();
            return false;
        }
        if ($("#ui_chkSubCategoriesNotAddedToCart").is(":checked") && $("#ui_txtNotAddedToCartProductsSubCategories_values").children().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.SelectNotAddedToCartProductSubCategories);
            $("#ui_chkSubCategoriesNotAddedToCart").focus();
            return false;
        }

        return true;
    },
    ValidateInteractionEvent: function () {

        if ($("#ui_chkFormImpression").is(":checked")) {

            if ($("#ui_txtFormImpressionCount").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterFormImpressionCount);
                $("#ui_txtFormImpressionCount").focus();
                return false;
            }
        }

        if ($("#ui_chkFormCloseEvent").is(":checked")) {

            if ($("#ui_txtFormCloseEventCount").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterFormCloseCount);
                $("#ui_txtFormCloseEventCount").focus();
                return false;
            }
        }

        if ($("#ui_chkResponseCountEvent").is(":checked")) {

            if ($("#ui_txtResponseCountEventCount").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterFormResponsesCount);
                $("#ui_txtResponseCountEventCount").focus();
                return false;
            }
        }

        if ($("#ui_chkShowFormAtNTime").is(":checked") && $("#ui_txtShowFormAtNTime").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterFormNthTimeCondition);
            $("#ui_txtShowFormAtNTime").focus();
            return false;
        }

        return true;
    },
    ValidateProfile: function () {
        if ($("#ui_chkInfluentialScoreIs").is(":checked")) {
            if ($("#ui_txtInfluentialScore1").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterInfluentialScore);
                $("#ui_txtInfluentialScore1").focus();
                return false;
            }
            else if ($("#ui_ddlInfluentialScoreIs").val() == "3" && $("#ui_txtInfluentialScore2").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterInfluentialScoreRange);
                $("#ui_txtInfluentialScore2").focus();
                return false;
            }
            else if ($("#ui_ddlInfluentialScoreIs").val() == "3" && parseInt($("#ui_txtInfluentialScore1").val()) > parseInt($("#ui_txtInfluentialScore2").val())) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterCorrectInfluentialScorerange);
                $("#ui_txtInfluentialScore2").focus();
                return false;
            }
        }

        if ($("#ui_chkIndustryIs").is(":checked")) {
            if ($("#ui_txtIndustryIs").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterProspectProfessionRange);
                $("#ui_txtIndustryIs").focus();
                return false;
            }
        }

        if ($("#ui_chkProspectLoyaltyIs").is(":checked")) {
            if ($("#ui_txtProspectLoyalty1").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterLoyaltyScore);
                $("#ui_txtProspectLoyalty1").focus();
                return false;
            }
            else if ($("#ui_ddlProspectLoyaltyIs").val() == "3" && $("#ui_txtProspectLoyalty2").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterLoyaltyRange);
                $("#ui_txtProspectLoyalty2").focus();

                return false;
            }
            else if ($("#ui_ddlProspectLoyaltyIs").val() == "3" && parseInt($("#ui_txtProspectLoyalty1").val()) > parseInt($("#ui_txtProspectLoyalty2").val())) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterCorrectloyaltyRange);
                $("#ui_txtProspectLoyalty2").focus();
                return false;
            }
        }

        if ($("#ui_chkRFMSScoreIs").is(":checked")) {
            if ($("#ui_txtRFMSScore1").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterRFMSScore);
                $("#ui_txtRFMSScore1").focus();
                return false;
            }
            else if ($("#ui_ddlRFMSScore").val() == "3" && $("#ui_txtRFMSScore2").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterRFMSRange);
                $("#ui_txtRFMSScore2").focus();
                return false;
            }
            else if ($("#ui_ddlRFMSScore").val() == "3" && parseInt($("#ui_txtRFMSScore1").val()) > parseInt($("#ui_txtRFMSScore2").val())) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterCorrectRFMSRange);
                $("#ui_txtRFMSScore2").focus();
                return false;
            }
        }

        if ($("#ui_chkDOBIs").is(":checked")) {

            if ($("#chk_IgnoreDOB").is(":checked") && $("#ui_ddlIgnoreDOB").get(0).selectedIndex == 0) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterIgnoreDOB);
                $("#ui_ddlIgnoreDOB").focus();
                return false;
            }

            if ($("#ui_rdbtnDates").is(":checked")) {
                if ($("#txtFromDate").val().length == 0) {
                    ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterFromrange);
                    $("#txtFromDate").focus();
                    return false;
                }
                if ($("#txtToDate").val().length == 0) {
                    ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterToDate);
                    $("#txtToDate").focus();
                    return false;
                }

                var dates = $("#txtFromDate").val().split('-');
                var FromDate = new Date(dates[0], dates[1] - 1, dates[2]);

                var dates = $("#txtToDate").val().split('-');
                var ToDate = new Date(dates[0], dates[1] - 1, dates[2]);

                if (FromDate.getTime() > ToDate.getTime()) {
                    ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterCorrectDateRange);
                    $("#txtToDate").focus();
                    return false;
                }
            }

            if ($("#ui_rdbtnDayDiff").is(":checked")) {
                if ($("#ui_txtDOBNoofDays").val() != null && $("#ui_txtDOBNoofDays").val() == 0) {
                    ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterCorrectDays);
                    $("#ui_txtDOBNoofDays").focus();
                    return false;
                }

                if (($("#txtDiffDate").val().length == 0) || ($("#ui_txtDOBNoofDays").val().length == 0)) {
                    ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.EnterCorrectDateValue);
                    $("#txtDiffDate").focus();
                    return false;
                }
            }
        }
        return true;
    },

    AssignDisplayRules: function () {
        formruleUtil.AssignAudienceData();
        formruleUtil.AssignBehaviorData();
        formruleUtil.AssignInteractionData();
        formruleUtil.AssignInteractionEventData();
        formruleUtil.AssignProfileData();

    },
    AssignAudienceData: function () {

        if ($("#ui_chkVisitorType").is(":checked"))
            ruleConditions.IsLead = $("input:radio[name='VisitorType']:checked").val();
        else
            ruleConditions.IsLead = -1;

        if ($("#ui_chkSegment").is(":checked")) {
            ruleConditions.IsBelong = $("input:radio[name='BelongsGroup']:checked").val();
            ruleConditions.BelongsToGroup = formruleUtil.GetListDataBySpanId($("#ui_txtGroups_values"), "value", "").join(",");
        }
        else {
            ruleConditions.IsBelong = 0;
            ruleConditions.BelongsToGroup = "";
        }
        return ruleConditions;
    },
    AssignBehaviorData: function () {

        if ($("#ui_chkBehavioralScore").is(":checked")) {
            ruleConditions.BehavioralScoreCondition = $("#ui_ddlBehavioralScoreRange").val();
            ruleConditions.BehavioralScore1 = $("#ui_VisitorScore1").val();

            if ($("#ui_ddlBehavioralScoreRange").val() == "3")
                ruleConditions.BehavioralScore2 = $("#ui_VisitorScore2").val();
            else
                ruleConditions.BehavioralScore2 = 0;
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
            ruleConditions.SessionConditionIsTrueOrIsFalse = true;
        }

        if ($("#ui_chkPageDepthIs").is(":checked")) {
            ruleConditions.PageDepthIs = $("#ui_txtPageDepthIs").val();

            if ($("#ui_radPageDepthIsFalse").is(":checked"))
                ruleConditions.PageDepthConditionIsTrueOrIsFalse = false;
            else
                ruleConditions.PageDepthConditionIsTrueOrIsFalse = true
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
        }
        else {
            ruleConditions.PageUrl = "";
        }

        if ($("#ui_chkNotOnPageUrl").is(":checked")) {
            ruleConditions.ExceptionPageUrl = $("#ui_txtNotPageUrl").val();

            if ($("#ui_PageNotUrlCheckContains").is(":checked"))
                ruleConditions.IsExceptionPageUrlContainsCondition = true;
            else
                ruleConditions.IsExceptionPageUrlContainsCondition = false;
        }
        else {
            ruleConditions.ExceptionPageUrl = "";
            ruleConditions.IsExceptionPageUrlContainsCondition = false;
        }

        if ($("#ui_chkVisitorsVisitedPagesWithPageUrlParameter").is(":checked")) {

            if ($("#ui_radPageUrlParamFalse").is(":checked"))
                ruleConditions.IsVisitorVisitedPagesWithPageUrlParameter = false;
            else
                ruleConditions.IsVisitorVisitedPagesWithPageUrlParameter = true;

            ruleConditions.PageUrlParameters = $("#ui_txtVisitorsVisitedPagesWithPageUrlParameter").val();
        }
        else
            ruleConditions.PageUrlParameters = "";


        if ($("#ui_chkSourceIs").is(":checked")) {

            if ($("#ui_radSourceIsFalse").is(":checked"))
                ruleConditions.IsVisitorsSource = false;
            else
                ruleConditions.IsVisitorsSource = true;

            if ($("#ui_radSourceIsDirect").is(":checked")) {
                ruleConditions.IsReferrer = 1;
            }
            else if ($("#ui_radSourceIsReferrer").is(":checked")) {
                ruleConditions.IsReferrer = 2
                ruleConditions.ReferrerUrl = $("#ui_txtSourceIs").val();
                if ($("#ui_chkCheckSourceDomainOnly").is(":checked"))
                    ruleConditions.CheckSourceDomainOnly = true;
            }
        }
        else {
            ruleConditions.IsReferrer = 0;
            ruleConditions.CheckSourceDomainOnly = false;
        }

        if ($("#ui_chkIsMailRespondent").is(":checked")) {
            ruleConditions.IsMailIsRespondent = true;

            if ($("#ui_radMailRespondentIsFalse").is(":checked"))
                ruleConditions.MailRespondentConditionIsTrueOrIsFalse = false;
            else
                ruleConditions.MailRespondentConditionIsTrueOrIsFalse = true;

            var SelectedTemplateIdValues = [];
            $.each($('#ui_ddlMailRespondentTemplate').select2('data'), function () {
                SelectedTemplateIdValues.push($(this)[0].id);
            });

            ruleConditions.MailRespondentTemplates = SelectedTemplateIdValues.join();

            if ($("#ui_chkMailRespondentClick").is(":checked"))
                ruleConditions.IsMailRespondentClickCondition = true;
            else
                ruleConditions.IsMailRespondentClickCondition = false;
        }
        else {
            ruleConditions.IsMailIsRespondent = false;
            ruleConditions.MailRespondentTemplates = "0";
            ruleConditions.IsMailRespondentClickCondition = true;
        }

        if ($("#ui_chkIsSmsRespondent").is(":checked")) {
            ruleConditions.IsSmsIsRespondent = true;

            if ($("#ui_radSmsRespondentIsFalse").is(":checked"))
                ruleConditions.SmsRespondentConditionIsTrueOrIsFalse = false;
            else
                ruleConditions.SmsRespondentConditionIsTrueOrIsFalse = true;

            var SelectedSmsTemplateIds = [];
            $.each($('#ui_ddlSmsRespondentTemplate').select2('data'), function () {
                SelectedSmsTemplateIds.push($(this)[0].id);
            });
            ruleConditions.SmsRespondentTemplates = SelectedSmsTemplateIds.join();
        }
        else {
            ruleConditions.IsSmsIsRespondent = false;
            ruleConditions.SmsRespondentTemplates = "0";
        }

        if ($("#ui_chkSearchKeywordIs").is(":checked"))
            ruleConditions.SearchString = $("#ui_txtSearchKeyword").val();
        else
            ruleConditions.SearchString = "";

        if ($("#ui_chkCountryIs").is(":checked")) {
            var CountryValues = [];
            $.each($('#ui_txtCountry').select2('data'), function () {
                CountryValues.push($(this)[0].text);
            });

            ruleConditions.Country = CountryValues.join("@$");

            if ($("#ui_radCountryIsFalse").is(":checked"))
                ruleConditions.CountryConditionIsTrueOrIsFalse = false;
            else
                ruleConditions.CountryConditionIsTrueOrIsFalse = true;
        }
        else {
            ruleConditions.Country = "";
        }

        if ($("#ui_chkStateIs").is(":checked")) {
            ruleConditions.StateName = formruleUtil.GetListDataBySpanId($("#ui_txtState_values"), "value", "").join("@$");
            if ($("#ui_radStateIsFalse").is(":checked"))
                ruleConditions.StateConditionIsTrueOrIsFalse = false;
            else
                ruleConditions.StateConditionIsTrueOrIsFalse = true;
        }
        else {
            ruleConditions.StateName = "";
        }

        if ($("#ui_chkCityIs").is(":checked")) {
            ruleConditions.City = formruleUtil.GetListDataBySpanId($("#ui_txtCity_values"), "value", "").join("@$");
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

            if ($("#ui_AlreadyPageUrlCheckContains").is(":checked"))
                ruleConditions.IsVisitedPagesContainsCondition = 1;
            else
                ruleConditions.IsVisitedPagesContainsCondition = 0;

            if ($("#ui_radPageViewOverAll").is(":checked"))
                ruleConditions.AlreadyVisitedPagesOverAllOrSessionWise = false;
            else
                ruleConditions.AlreadyVisitedPagesOverAllOrSessionWise = true;
        }
        else {
            ruleConditions.AlreadyVisitedPages = "";
            ruleConditions.AlreadyVisitedPagesOverAllOrSessionWise = false;
            ruleConditions.IsVisitedPagesContainsCondition = false;
        }
        if ($("#ui_chkVisitorsAlreadyVisitedPagesWithPageUrlParameter").is(":checked"))
            ruleConditions.AlreadyVisitedWithPageUrlParameters = $("#ui_txtVisitorsAlreadyVisitedPagesWithPageUrlParameter").val();
        else
            ruleConditions.AlreadyVisitedWithPageUrlParameters = "";


        if ($("#ui_chkNotAlreadyVisitedPages").is(":checked")) {
            ruleConditions.NotAlreadyVisitedPages = $("#ui_txtNotAlreadyVisitedPageUrls").val();

            if ($("#ui_NotAlreadyPageUrlCheckContains").is(":checked"))
                ruleConditions.IsNotVisitedPagesContainsCondition = 1;
            else
                ruleConditions.IsNotVisitedPagesContainsCondition = 0;

            if ($("#ui_radNotPageViewOverAll").is(":checked"))
                ruleConditions.NotAlreadyVisitedPagesOverAllOrSessionWise = false;
            else
                ruleConditions.NotAlreadyVisitedPagesOverAllOrSessionWise = true;
        }
        else {
            ruleConditions.NotAlreadyVisitedPages = "";
            ruleConditions.NotAlreadyVisitedPagesOverAllOrSessionWise = false;
            ruleConditions.IsNotVisitedPagesContainsCondition = false;
        }

        if ($("#ui_chkVisitorsNotAlreadyVisitedPagesWithPageUrlParameter").is(":checked"))
            ruleConditions.NotAlreadyVisitedWithPageUrlParameters = $("#ui_txtVisitorsNotAlreadyVisitedPagesWithPageUrlParameter").val();
        else
            ruleConditions.NotAlreadyVisitedWithPageUrlParameters = "";

        if ($("#ui_chkTimeSpentInSite").is(":checked"))
            ruleConditions.OverAllTimeSpentInSite = $("#ui_txtTimeSpentInSite").val();
        else
            ruleConditions.OverAllTimeSpentInSite = 0;

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
    },
    AssignInteractionData: function () {

        if ($("#ui_chkClickedButton").is(":checked"))
            ruleConditions.IsClickedSpecificButtons = formruleUtil.GetListDataBySpanId($("#ui_txtClickButton_values"), "id", "clkBtn_").join(",");
        else
            ruleConditions.IsClickedSpecificButtons = "";

        if ($("#ui_chkNotClickedButton").is(":checked"))
            ruleConditions.IsNotClickedSpecificButtons = formruleUtil.GetListDataBySpanId($("#ui_txtNotClickButton_values"), "id", "clkNotBtn_").join(",");
        else
            ruleConditions.IsNotClickedSpecificButtons = "";

        if ($("#ui_chkClickedPriceRange").is(":checked"))
            ruleConditions.ClickedPriceRangeProduct = formruleUtil.GetListDataBySpanId($("#ui_txtPriceRangeProducts_values"), "value", "").join(",");
        else
            ruleConditions.ClickedPriceRangeProduct = "";

        if ($("#ui_chkRespondedInChat").is(":checked"))
            ruleConditions.IsVisitorRespondedChat = true;
        else
            ruleConditions.IsVisitorRespondedChat = false;

        if ($("#ui_chkMailResponseStage").is(":checked"))
            ruleConditions.MailCampignResponsiveStage = $("#ui_ddlMailScore").val();
        else
            ruleConditions.MailCampignResponsiveStage = 0;

        if ($("#ui_chkRespondedForm").is(":checked"))
            ruleConditions.IsRespondedForm = $("#ui_ddlRespondedFroms").val();
        else
            ruleConditions.IsRespondedForm = 0;

        if ($("#ui_chkNotRespondedForm").is(":checked"))
            ruleConditions.IsNotRespondedForm = $("#ui_ddlNotRespondedFroms").val();
        else
            ruleConditions.IsNotRespondedForm = 0;

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

        if ($("#ui_chkAddedToCart").is(":checked"))
            ruleConditions.AddedProductsToCart = formruleUtil.GetListDataBySpanId($("#ui_txtAddedToCartProducts_values"), "value", "").join(",");
        else
            ruleConditions.AddedProductsToCart = "";

        if ($("#ui_chkViewedNotAddedToCart").is(":checked"))
            ruleConditions.ViewedButNotAddedProductsToCart = formruleUtil.GetListDataBySpanId($("#ui_txtViewedNotAddedToCartProducts_values"), "value", "").join(",");
        else
            ruleConditions.ViewedButNotAddedProductsToCart = "";

        if ($("#ui_chkDropedFromCart").is(":checked"))
            ruleConditions.DroppedProductsFromCart = formruleUtil.GetListDataBySpanId($("#ui_txtDropedFromCartProducts_values"), "value", "").join(",");
        else
            ruleConditions.DroppedProductsFromCart = "";

        if ($("#ui_chkCustomerPurchased").is(":checked"))
            ruleConditions.PurchasedProducts = formruleUtil.GetListDataBySpanId($("#ui_txtCustomerPurchasedProducts_values"), "value", "").join(",");
        else
            ruleConditions.PurchasedProducts = "";

        if ($("#ui_chkCustomerNotPurchased").is(":checked"))
            ruleConditions.NotPurchasedProducts = formruleUtil.GetListDataBySpanId($("#ui_txtCustomerNotPurchasedProducts_values"), "value", "").join(",");
        else
            ruleConditions.NotPurchasedProducts = "";

        if ($("#ui_chkTotalPurchaseIs").is(":checked")) {
            ruleConditions.TotalPurchaseQtyConditon = $("#ui_ddlCustomerTotalPurchase").val();
            ruleConditions.CustomerTotalPurchase1 = $("#ui_txtCustomerTotalPurchase1").val();

            if ($("#ui_ddlCustomerTotalPurchase").val() == "3")
                ruleConditions.CustomerTotalPurchase2 = $("#ui_txtCustomerTotalPurchase2").val();
            else
                ruleConditions.CustomerTotalPurchase2 = 0;
        }
        else {
            ruleConditions.CustomerTotalPurchase1 = ruleConditions.TotalPurchaseQtyConditon = ruleConditions.CustomerTotalPurchase2 = 0;
        }

        if ($("#ui_chkCustomerCurrectValue").is(":checked")) {
            ruleConditions.TotalPurchaseAmtCondition = $("#ui_ddlCustomerCurrentValue").val();
            ruleConditions.CustomerCurrentValue1 = $("#ui_txtCustomerCurrentValue1").val();

            if ($("#ui_ddlCustomerCurrentValue").val() == "3")
                ruleConditions.CustomerCurrentValue2 = $("#ui_txtCustomerCurrentValue2").val();
            else
                ruleConditions.CustomerCurrentValue2 = 0;
        }
        else {
            ruleConditions.CustomerCurrentValue1 = ruleConditions.TotalPurchaseAmtCondition = ruleConditions.CustomerCurrentValue2 = 0;
        }

        if ($("#ui_chkCustomerLastPurchase").is(":checked")) {
            ruleConditions.LastPurchaseIntervalCondition = $("#ui_ddlLastPurchaseCondition").val();
            ruleConditions.LastPurchaseIntervalRange1 = $("#ui_txtLastPurchaseRange1").val();

            if ($("#ui_ddlLastPurchaseCondition").val() == "3")
                ruleConditions.LastPurchaseIntervalRange2 = $("#ui_txtLastPurchaseRange2").val();
            else
                ruleConditions.LastPurchaseIntervalRange2 = 0;
        }
        else {
            ruleConditions.LastPurchaseIntervalCondition = ruleConditions.LastPurchaseIntervalRange1 = ruleConditions.LastPurchaseIntervalRange2 = 0;
        }

        if ($("#ui_chkCategoriesAddedToCart").is(":checked"))
            ruleConditions.AddedProductsCategoriesToCart = formruleUtil.GetListDataBySpanId($("#ui_txtAddedToCartProductsCategories_values"), "value", "").join("|");
        else
            ruleConditions.AddedProductsCategoriesToCart = "";

        if ($("#ui_chkCategoriesNotAddedToCart").is(":checked"))
            ruleConditions.NotAddedProductsCategoriesToCart = formruleUtil.GetListDataBySpanId($("#ui_txtNotAddedToCartProductsCategories_values"), "value", "").join("|");
        else
            ruleConditions.NotAddedProductsCategoriesToCart = "";

        if ($("#ui_chkSubCategoriesAddedToCart").is(":checked"))
            ruleConditions.AddedProductsSubCategoriesToCart = formruleUtil.GetListDataBySpanId($("#ui_txtAddedToCartProductsSubCategories_values"), "value", "").join("|");
        else
            ruleConditions.AddedProductsSubCategoriesToCart = "";

        if ($("#ui_chkSubCategoriesNotAddedToCart").is(":checked"))
            ruleConditions.NotAddedProductsSubCategoriesToCart = formruleUtil.GetListDataBySpanId($("#ui_txtNotAddedToCartProductsSubCategories_values"), "value", "").join("|");
        else
            ruleConditions.NotAddedProductsSubCategoriesToCart = "";

        return ruleConditions;
    },
    AssignInteractionEventData: function () {
        if ($("#ui_chkFormImpression").is(":checked")) {
            ruleConditions.ImpressionEventForFormId = $("#ui_ddlFormImpression").val();
            ruleConditions.ImpressionEventCountCondition = $("#ui_txtFormImpressionCount").val();
        }
        else {
            ruleConditions.ImpressionEventForFormId = -1;
            ruleConditions.ImpressionEventCountCondition = 0;
        }

        if ($("#ui_chkFormCloseEvent").is(":checked")) {
            ruleConditions.CloseEventForFormId = parseInt($("#ui_ddlFormCloseEvent").val());
            ruleConditions.CloseEventCountCondition = $("#ui_txtFormCloseEventCount").val();
        }
        else {
            ruleConditions.CloseEventForFormId = -1;
            ruleConditions.CloseEventCountCondition = 0;
        }

        if ($("#ui_chkResponseCountEvent").is(":checked")) {
            ruleConditions.ResponsesEventForFormId = $("#ui_ddlResponseCountEvent").val();
            ruleConditions.ResponsesEventCountCondition = $("#ui_txtResponseCountEventCount").val();
        }
        else {
            ruleConditions.ResponsesEventForFormId = -1;
            ruleConditions.ResponsesEventCountCondition = 0;
        }

        if ($("#ui_chkShowFormAtNTime").is(":checked"))
            ruleConditions.ShowFormOnlyNthTime = $("#ui_txtShowFormAtNTime").val();
        else
            ruleConditions.ShowFormOnlyNthTime = 0;

        return ruleConditions;
    },
    AssignProfileData: function () {

        if ($("#ui_chkOnlineSentimentIs").is(":checked"))
            ruleConditions.OnlineSentimentIs = $("#ui_ddlOnlineSentimentIs").val();
        else
            ruleConditions.OnlineSentimentIs = 0;

        if ($("#ui_chkSocialStatusIs").is(":checked"))
            ruleConditions.SocialStatusIs = $("#ui_ddlSocialStatus").val();
        else
            ruleConditions.SocialStatusIs = 0;

        if ($("#ui_chkInfluentialScoreIs").is(":checked")) {
            ruleConditions.InfluentialScoreCondition = $("#ui_ddlInfluentialScoreIs").val();
            ruleConditions.InfluentialScore1 = $("#ui_txtInfluentialScore1").val();

            if ($("#ui_ddlInfluentialScoreIs").val() == "3")
                ruleConditions.InfluentialScore2 = $("#ui_txtInfluentialScore2").val();
        }
        else {
            ruleConditions.InfluentialScoreCondition = ruleConditions.InfluentialScore2 = ruleConditions.InfluentialScore1 = 0;
        }

        if ($("#ui_chkOfflineSentimentIs").is(":checked"))
            ruleConditions.OfflineSentimentIs = $("#ui_ddlOfflineSentiment").val();
        else
            ruleConditions.OfflineSentimentIs = 0;

        if ($("#ui_chkProductRatingIs").is(":checked"))
            ruleConditions.ProductRatingIs = $("#ui_ddlRating").val();
        else
            ruleConditions.ProductRatingIs = 0;

        if ($("#ui_chkProspectStatusIs").is(":checked"))
            ruleConditions.NurtureStatusIs = $("#ui_ddlProspectStatus").val();
        else
            ruleConditions.NurtureStatusIs = -1;

        if ($("#ui_chkProspectGenderIs").is(":checked"))
            ruleConditions.GenderIs = $("#ui_ddlProspectGender").val();
        else
            ruleConditions.GenderIs = "";

        if ($("#ui_chkMartialStatus").is(":checked"))
            ruleConditions.MaritalStatusIs = parseInt($("#ui_ddlMartialStatus").val());
        else
            ruleConditions.MaritalStatusIs = 0;

        if ($("#ui_chkIndustryIs").is(":checked"))
            ruleConditions.ProfessionIs = $("#ui_txtIndustryIs").val();
        else
            ruleConditions.ProfessionIs = "";

        if ($("#ui_chkIsConnectedSocially").is(":checked"))
            ruleConditions.NotConnectedSocially = $("#ui_ddlConnectedSocially").val();
        else
            ruleConditions.NotConnectedSocially = 0;

        if ($("#ui_chkProspectLoyaltyIs").is(":checked")) {
            ruleConditions.LoyaltyPointsCondition = $("#ui_ddlProspectLoyaltyIs").val();
            ruleConditions.LoyaltyPointsRange1 = $("#ui_txtProspectLoyalty1").val();

            if ($("#ui_ddlProspectLoyaltyIs").val() == "3")
                ruleConditions.LoyaltyPointsRange2 = $("#ui_txtProspectLoyalty2").val();
        }
        else {
            ruleConditions.LoyaltyPointsCondition = ruleConditions.LoyaltyPointsRange1 = ruleConditions.LoyaltyPointsRange2 = 0;
        }

        if ($("#ui_chkRFMSScoreIs").is(":checked")) {
            ruleConditions.RFMSScoreRangeCondition = $("#ui_ddlRFMSScore").val();
            ruleConditions.RFMSScoreRange1 = $("#ui_txtRFMSScore1").val();

            if ($("#ui_ddlRFMSScore").val() == "3")
                ruleConditions.RFMSScoreRange2 = $("#ui_txtRFMSScore2").val();
        }
        else {
            ruleConditions.RFMSScoreRangeCondition = ruleConditions.RFMSScoreRange1 = ruleConditions.RFMSScoreRange2 = 0;
        }

        if ($("#ui_chkDOBIs").is(":checked")) {
            ruleConditions.IsBirthDay = true;

            if ($("#chk_IgnoreDOB").is(":checked")) {
                ruleConditions.IsDOBIgnored = true;
                ruleConditions.IsDOBIgnoreCondition = parseInt($("#ui_ddlIgnoreDOB").val());
            }
            else {
                ruleConditions.IsDOBIgnored = ruleConditions.IsDOBIgnoreCondition = 0 ? false : true;
            }

            if ($('input[name=DOB]:checked').val() == "0") {
                ruleConditions.IsDOBTodayOrMonth = 0;
            }
            else if ($('input[name=DOB]:checked').val() == "1") {
                ruleConditions.IsDOBTodayOrMonth = 1;
            }
            else if ($('input[name=DOB]:checked').val() == "2") {
                ruleConditions.IsDOBTodayOrMonth = 2;
                ruleConditions.DOBFromDate = $("#txtFromDate").val();
                ruleConditions.DOBToDate = $("#txtToDate").val();
                ruleConditions.DOBDaysDiffernce = 0;
            }
            else if ($('input[name=DOB]:checked').val() == "3") {
                ruleConditions.IsDOBTodayOrMonth = 3;
                ruleConditions.DOBFromDate = ruleConditions.DOBToDate = null;
                ruleConditions.DOBDaysDiffernce = parseInt($("#ui_txtDOBNoofDays").val());
            }
        }
        else {
            ruleConditions.IsBirthDay = false;//ruleConditions.IsDOBTodayOrMonth = ruleConditions.DOBDaysDiffernce = false;
            ruleConditions.DOBFromDate = null;//ruleConditions.DOBToDate = ruleConditions.IsDOBIgnored = ruleConditions.IsDOBIgnoreCondition = "";
        }

        return ruleConditions;
    }
}

//DropDowm Select Values
$(".addtemprulemail,.addtemprulesms,.addtemprulecountry,.addtemprulecity,.specificbtn,.notspecificbtn,.dropdownselcom").select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$("#ui_ddlSmsRespondentTemplate,#ui_ddlMailRespondentTemplate,#ui_ddlProspectStatus").select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

//Bind Rules

function BindRulesDetails() {
    ShowPageLoading();
    formruleUtil.BindAudienceData();
    formruleUtil.BindBehaviorData();
    formruleUtil.BindInteractionData();
    formruleUtil.BindInteractionEventData();
    formruleUtil.BindProfileData();
    HidePageLoading();
};

// Validate Rules

function ValidateRulesDetails() {
    ShowPageLoading();
    if (!formruleUtil.ValidationOfAudience())
        return false;
    if (!formruleUtil.ValidateBehavior())
        return false;
    if (!formruleUtil.ValidateInteraction())
        return false;
    if (!formruleUtil.ValidateInteractionEvent())
        return false;
    if (!formruleUtil.ValidateProfile())
        return false;
    return true;
    HidePageLoading();
};

// Assign Rules
function AssignRulesDetails() {
    ShowPageLoading();
    formruleUtil.AssignAudienceData();
    formruleUtil.AssignBehaviorData();
    formruleUtil.AssignInteractionData();
    formruleUtil.AssignInteractionEventData();
    formruleUtil.AssignProfileData();
    HidePageLoading();
};

//Rules Part
var checkbyaudicount, checkbybehcount, checkbyintercount, checkbyeventcount, checkbyprofcount;
$(".checkrulqus").click(function () {
    $(this).parents(".rulemainchkbxWrap").next().toggleClass('hideDiv');
    checkbyaudicount = $('#byaduience .checkrulqus').filter(':checked').length;
    checkbybehcount = $('#bybehaviour .checkrulqus').filter(':checked').length;
    checkbyintercount = $('#byinteraction .checkrulqus').filter(':checked').length;
    checkbyeventcount = $('#byevent .checkrulqus').filter(':checked').length;
    checkbyprofcount = $('#byprofile .checkrulqus').filter(':checked').length;
    $('.rulecountaudi').html(checkbyaudicount);
    $(".rulecountbeh").html(checkbybehcount);
    $(".rulecountinteract").html(checkbyintercount);
    $(".rulecountevnt").html(checkbyeventcount);
    $(".rulecountprof").html(checkbyprofcount);
});

$(".trigrultabitem").click(function () {
    $(".trigrultabitem").removeClass("active");
    $(this).addClass("active");
    var tabtit = $(this).attr("data-ruletab");
    $(".ruletabdetWrap").addClass("hideDiv");
    $("#" + tabtit).removeClass("hideDiv");
});

$(".dtpickr").datepicker({
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: false
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
        formruleUtil.BindFormFields(FormId);
    }
});

$("#ui_ddlAnswerCondition").change(function () {
    if ($(this).val() == "3")
        $("#ui_txtAnswerCondition2").show();
    else
        $("#ui_txtAnswerCondition2").hide();
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
        var pastorfuturedate = formruleUtil.GetDifferenceDateValue(utcdate, $("#ui_txtDOBNoofDays").val());
        $("#txtDiffDate").val(pastorfuturedate);
    }
    else {
        $("#txtDiffDate").val("");
    }
});
//************ Mobile In App Campaign Rules *****************
$('#ddlInappgroup').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});
$(".addcalend").datepicker({
    defaultDate: "+1d",
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: false,
    minDate: new Date()
});
//************ Mobile In App Campaign Rules *****************

