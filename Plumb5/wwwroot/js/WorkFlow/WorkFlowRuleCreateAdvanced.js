var countryList = new Array("AFGHANISTAN", "ALAND ISLANDS", "ALBANIA", "ALGERIA", "AMERICAN SAMOA", "ANDORRA", "ANGOLA", "ANGUILLA", "ANTARCTICA", "ANTIGUA AND BARBUDA", "ARGENTINA", "ARMENIA", "ARUBA", "AUSTRALIA", "AUSTRIA", "AZERBAIJAN", "BAHAMAS", "BAHRAIN", "BANGLADESH", "BARBADOS", "BELARUS", "BELGIUM", "BELIZE", "BENIN", "BERMUDA", "BHUTAN", "BOLIVIA", "BOSNIA AND HERZEGOVINA", "BOTSWANA", "BRAZIL", "BRITISH INDIAN OCEAN TERRITORY", "BRUNEI DARUSSALAM", "BULGARIA", "BURKINA FASO", "BURUNDI", "CAMBODIA", "CAMEROON", "CANADA", "CAPE VERDE", "CAYMAN ISLANDS", "CENTRAL AFRICAN REPUBLIC", "CHAD", "CHILE", "CHINA", "CHRISTMAS ISLAND", "COLOMBIA", "COMOROS", "CONGO", "CONGO, THE DEMOCRATIC REPUBLIC OF THE", "COOK ISLANDS", "COSTA RICA", "COTE D'IVOIRE", "CROATIA", "CUBA", "CURAA‡AO", "CURAÃ‡AO", "CYPRUS", "CZECH REPUBLIC", "DEMOCRATIC PEOPLE'S REPUBLIC OF KOREA", "DENMARK", "DJIBOUTI", "DOMINICA", "DOMINICAN REPUBLIC", "ECUADOR", "EGYPT", "EL SALVADOR", "EQUATORIAL GUINEA", "ERITREA", "ESTONIA", "ETHIOPIA", "FALKLAND ISLANDS (MALVINAS)", "FAROE ISLANDS", "FIJI", "FINLAND", "FRANCE", "FRENCH GUIANA", "FRENCH POLYNESIA", "FRENCH SOUTHERN TERRITORIES", "GABON", "GAMBIA", "GEORGIA", "GERMANY", "GHANA", "GIBRALTAR", "GREECE", "GREENLAND", "GRENADA", "GUADELOUPE", "GUAM", "GUATEMALA", "GUERNSEY", "GUINEA", "GUINEA-BISSAU", "GUYANA", "HAITI", "HEARD ISLAND AND MCDONALD ISLANDS", "HOLY SEE (VATICAN CITY STATE)", "HONDURAS", "HONG KONG", "HUNGARY", "ICELAND", "INDIA", "INDONESIA", "IRAN, ISLAMIC REPUBLIC OF", "IRAQ", "IRELAND", "ISLE OF MAN", "ISRAEL", "ITALY", "JAMAICA", "JAPAN", "JORDAN", "KAZAKHSTAN", "KENYA", "KIRIBATI", "KOREA, REPUBLIC OF", "KUWAIT", "KYRGYZSTAN", "LAO PEOPLE'S DEMOCRATIC REPUBLIC", "LATVIA", "LEBANON", "LESOTHO", "LIBERIA", "LIBYAN ARAB JAMAHIRIYA", "LIECHTENSTEIN", "LITHUANIA", "LUXEMBOURG", "MACAO", "MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF", "MADAGASCAR", "MALAWI", "MALAYSIA", "MALDIVES", "MALI", "MALTA", "MARSHALL ISLANDS", "MARTINIQUE", "MAURITANIA", "MAURITIUS", "MAYOTTE", "MEXICO", "MICRONESIA, FEDERATED STATES OF", "MOLDOVA, REPUBLIC OF", "MONACO", "MONGOLIA", "MONTENEGRO", "MONTSERRAT", "MOROCCO", "MOZAMBIQUE", "MYANMAR", "NAMIBIA", "NAURU", "NEPAL", "NETHERLANDS", "NETHERLANDS ANTILLES", "NEW CALEDONIA", "NEW ZEALAND", "NICARAGUA", "NIGER", "NIGERIA", "NIUE", "NORFOLK ISLAND", "NORTHERN MARIANA ISLANDS", "NORWAY", "OMAN", "PAKISTAN", "PALAU", "PALESTINIAN TERRITORY, OCCUPIED", "PANAMA", "PAPUA NEW GUINEA", "PARAGUAY", "PERU", "PHILIPPINES", "POLAND", "PORTUGAL", "PUERTO RICO", "QATAR", "REUNION", "ROMANIA", "RUSSIAN FEDERATION", "RWANDA", "SAINT HELENA", "SAINT KITTS AND NEVIS", "SAINT LUCIA", "SAINT MARTIN", "SAINT PIERRE AND MIQUELON", "SAINT VINCENT AND THE GRENADINES", "SAMOA", "SAN MARINO", "SAO TOME AND PRINCIPE", "SAUDI ARABIA", "SENEGAL", "SERBIA", "SEYCHELLES", "SIERRA LEONE", "SINGAPORE", "SLOVAKIA", "SLOVENIA", "SOLOMON ISLANDS", "SOMALIA", "SOUTH AFRICA", "SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS", "SPAIN", "SRI LANKA", "SUDAN", "SURINAME", "SWAZILAND", "SWEDEN", "SWITZERLAND", "SYRIAN ARAB REPUBLIC", "TAIWAN, PROVINCE OF CHINA", "TAJIKISTAN", "TANZANIA, UNITED REPUBLIC OF", "THAILAND", "TOGO", "TOKELAU", "TONGA", "TRINIDAD AND TOBAGO", "TUNISIA", "TURKEY", "TURKMENISTAN", "TURKS AND CAICOS ISLANDS", "TUVALU", "UGANDA", "UKRAINE", "UNITED ARAB EMIRATES", "UNITED KINGDOM", "UNITED STATES", "UNITED STATES MINOR OUTLYING ISLANDS", "URUGUAY", "UZBEKISTAN", "VANUATU", "VENEZUELA", "VIET NAM", "VIRGIN ISLANDS, BRITISH", "VIRGIN ISLANDS, U.S.", "WALLIS AND FUTUNA", "YEMEN", "YUGOSLAVIA", "ZAMBIA", "ZIMBABWE");
//----- New
var triggerMailSms = {
    RuleId: 0, UserInfoUserId: 0, TriggerStatus: 0, TriggerHeading: "", IsMailOrSMSTrigger: 1,
    IsLead: -1, IsBelong: 0, BelongsToGroup: "", BehavioralScoreCondition: 0, BehavioralScore1: 0, BehavioralScore2: 0, SessionIs: 0, SessionConditionIsTrueOrIsFalse: false,
    PageDepthIs: 0, NPageVisited: 0, FrequencyIs: 0, PageUrl: "", IsPageUrlContainsCondition: false, IsReferrer: 0, ReferrerUrl: "", CheckSourceDomainOnly: false, IsMailIsRespondent: false,
    SearchString: "", Country: "", City: "", IsClickedSpecificButtons: "", IsNotClickedSpecificButtons: "", ClickedPriceRangeProduct: "", IsVisitorRespondedChat: false, MailCampignResponsiveStage: 0, IsRespondedForm: 0,
    IsNotRespondedForm: 0, CloseCount: 0, AddedProductsToCart: "", ViewedButNotAddedProductsToCart: "", DroppedProductsFromCart: "", PurchasedProducts: "", NotPurchasedProducts: "",
    CustomerTotalPurchase1: 0, CustomerCurrentValue1: 0, DependencyFormId: 0, DependencyFormField: 0, DependencyFormCondition: 0, DependencyFormAnswer1: "", DependencyFormAnswer2: "",
    ImpressionEventForFormId: 0, ImpressionEventCountCondition: 0, CloseEventForFormId: 0, CloseEventCountCondition: 0, ResponsesEventForFormId: 0, ResponsesEventCountCondition: 0,
    OnlineSentimentIs: 0, SocialStatusIs: 0, InfluentialScoreCondition: 0, InfluentialScore1: 0, InfluentialScore2: 0, OfflineSentimentIs: 0, ProductRatingIs: 0, GenderIs: "",
    MaritalStatusIs: 0, ProfessionIs: "", NotConnectedSocially: 0, LoyaltyPointsCondition: 0, LoyaltyPointsRange1: 0, LoyaltyPointsRange2: 0, RFMSScoreRangeCondition: 0,
    RFMSScoreRange1: 0, RFMSScoreRange2: 0, ShowFormOnlyNthTime: 0, CloseCountSessionWiseOrOverAll: false, OverAllTimeSpentInSite: 0, AlreadyVisitedPages: "", PageDepthConditionIsTrueOrIsFalse: false,
    PageViewConditionIsTrueOrIsFalse: false, FrequencyConditionIsTrueOrIsFalse: false, MailRespondentConditionIsTrueOrIsFalse: false, CountryConditionIsTrueOrIsFalse: false,
    CityConditionIsTrueOrIsFalse: false, NurtureStatusIs: 0, IsMobileDevice: 0, AlreadyVisitedPagesOverAllOrSessionWise: false, InstantOrOnceInaDay: 0, LastPurchaseIntervalCondition: 0, LastPurchaseIntervalRange1: 0,
    LastPurchaseIntervalRange2: 0, CustomerTotalPurchase2: 0, CustomerTotalPurchaseCondition: 0, CustomerCurrentValue2: 0, CustomerCurrentValueCondition: 0,
    AddedProductsCategoriesToCart: "", NotAddedProductsCategoriesToCart: "", AddedProductsSubCategoriesToCart: "", NotAddedProductsSubCategoriesToCart: "", MailRespondentTemplates: 0,
    IsSmsIsRespondent: false, SmsRespondentConditionIsTrueOrIsFalse: false, SmsRespondentTemplates: 0, IsMailRespondentClickCondition: false, IsBirthDay: false, IsDOBTodayOrMonth: 0,
    NotAlreadyVisitedPages: "", NotAlreadyVisitedPagesOverAllOrSessionWise: false, DOBFromDate: "", DOBToDate: "", DOBDaysDiffernce: 0, IsDOBIgnored: null, IsDOBIgnoreCondition: 0,
    IsUersReachable: 0, ChannelName: "", IsABTesting: 0, IsABTestingContacts: 0, IsABTestingCondition: "", WaitTime: 0, ResponseCondition: "", ResponseFromTime: 0, ResponseToTime: 0, IsOBDResponse: "",
    TimeResponseCondition: "", TimeCondition: "", ContactFieldName: "", ContactFieldCondition: 0, ContactFieldValue1: "", ContactFieldValue2: "", IsCustomisedContactRule: 0,
    VisitorActivenessConditionIsTrueOrIsFalse: "", VisitorActivenessIs: 0
};

//----- Old
var ContactOptionList = [];
var triggerMailSmsId = 0;
var templateList = Array();
var workFlowDetail = [];
var maxRowCount = 0, Offset = 0, rowIndex = 0;
var viewMoreDisable = false;
$(document).ready(function () {
    $("#dvLoading").show();
    triggerMailSmsId = triggerMailSms.RuleId = urlParam("RuleId");
    Initialize();
    InitializeDefault();
    GetContactColumns();
    Slider("ui_ContactsInPercentage", 10);
});

GetContactColumns = function () {
    $.ajax({
        url: "/WorkFlow/Rules/GetContactColumn",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            for (var i = 0; i < response.length; i++) {
                var optlist = document.createElement('option');
                optlist.value = response[i].Name;
                optlist.text = response[i].Name;
                optlist.setAttribute("datatype", response[i].DataType);
                ContactOptionList.push(optlist);
            }
            GetContactCustomFields();
        },
        error: ShowAjaxError
    });
}

GetContactCustomFields = function () {

    $.ajax({
        url: "/WorkFlow/Rules/GetAllFieldDetails",
        type: 'Post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {

            $.each(response, function (i) {
                var optlist = document.createElement('option');
                optlist.value = "CustomField" + (i + 1);
                optlist.text = $(this)[0].FieldName;
                optlist.setAttribute("datatype", "String");
                optlist.setAttribute("FieldType", $(this)[0].FieldType);
                ContactOptionList.push(optlist);
            });

            ContactOptionList.sort(function (a, b) {

                var nameA = a.text.toLowerCase(), nameB = b.text.toLowerCase();
                if (nameA < nameB)
                    return -1;
                if (nameA > nameB)
                    return 1;
                return 0;
            });
            BindContactDropDown("ui_ddlContactFields");
        },
        error: ShowAjaxError
    });
}

function BindContactDropDown(fieldId) {

    var optlist = document.createElement('option');
    optlist.value = "0";
    optlist.text = "Select Column";
    document.getElementById(fieldId).options.add(optlist);

    if (ContactOptionList != null && ContactOptionList != undefined) {
        $.each(ContactOptionList, function (i) {
            document.getElementById(fieldId).options.add($(this)[0]);
        });
    }
}



Slider = function (tagName, sliderValue) {

    $('#' + tagName).val(sliderValue);
    $('#' + tagName).slider({
        min: 10,
        max: 80,
        value: sliderValue,
        orientation: "horizontal",
        range: "min",
        animate: true,
        slide: function (event, ui) {
            $('#NumberOfData').html(ui.value);
        }
    });
};

Initialize = function () {
    IntializeFromsListAndMailGroupList();
    IntializeTemplate();
    //IfNewIntializeDefault();
    //for (var i = 0; i < templateList.length; i++) {
    //    $("#ui_ddlTemplate").append("<option value='" + templateList[i].TemplateId + "'>" + templateList[i].TempName + "</option>");
    //}
    if (triggerMailSmsId > 0) {
        BindSavedData(false);
    }
};

InitializeDefault = function () {

    IntializeAutoComplete("ui_txtClickButton", "../Form/CommonDetailsForForms/GetEvetList", 2, "ui_txtClickButton_values", "clkBtn");
    IntializeAutoComplete("ui_txtNotClickButton", "../Form/CommonDetailsForForms/GetEvetList", 2, "ui_txtNotClickButton_values", "clkNotBtn");
    IntializeAutoComplete("ui_txtPriceRangeProducts", "../Form/CommonDetailsForForms/GetEvetList", 2, "ui_txtPriceRangeProducts_values", "ClickProduct");
    IntializeAutoComplete("ui_txtCustomerNotPurchasedProducts", "../Form/CommonDetailsForForms/GetProductList", 2, "ui_txtCustomerNotPurchasedProducts_values", "NotPurchase");
    IntializeAutoComplete("ui_txtCustomerPurchasedProducts", "../Form/CommonDetailsForForms/GetProductList", 2, "ui_txtCustomerPurchasedProducts_values", "Purchase");
    IntializeAutoComplete("ui_txtDropedFromCartProducts", "../Form/CommonDetailsForForms/GetProductList", 2, "ui_txtDropedFromCartProducts_values", "DropFromCart");
    IntializeAutoComplete("ui_txtViewedNotAddedToCartProducts", "../Form/CommonDetailsForForms/GetProductList", 2, "ui_txtViewedNotAddedToCartProducts_values", "NotAddedToCart");
    IntializeAutoComplete("ui_txtAddedToCartProducts", "../Form/CommonDetailsForForms/GetProductList", 2, "ui_txtAddedToCartProducts_values", "AddedToCart");
    IntializeAutoComplete("ui_txtAddedToCartProductsCategories", "/CommonDetailsForForms/GetProductCategoryList", 2, "ui_txtAddedToCartProductsCategories_values", "CategoriesAddedToCart");
    IntializeAutoComplete("ui_txtNotAddedToCartProductsCategories", "/CommonDetailsForForms/GetProductCategoryList", 2, "ui_txtNotAddedToCartProductsCategories_values", "CategoriesnotAddedToCart");
    IntializeAutoComplete("ui_txtAddedToCartProductsSubCategories", "/CommonDetailsForForms/GetProductSubCategoryList", 2, "ui_txtAddedToCartProductsSubCategories_values", "SubCategoriesAddedToCart");
    IntializeAutoComplete("ui_txtNotAddedToCartProductsSubCategories", "/CommonDetailsForForms/GetProductSubCategoryList", 2, "ui_txtNotAddedToCartProductsSubCategories_values", "SubCategoriesnotAddedToCart");

    IntializeAutoComplete("ui_txtCity", "../Form/CommonDetailsForForms/GetCityName", 2, "ui_txtCity_values", "cityName");

    IntializeCountyList();
};

/*IntializeAutoComplete*/
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

/*IntializeCountyList*/
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





$("#ui_chkAnswerDependencyForm").click(function () {

    if (!$(this).is(":checked"))
        $("#trAnswerDependency").hide();

});



IntializeFromsListAndMailGroupList = function () {
    IntializeDOBCalender();
    $.ajax({
        url: "../Form/CommonDetailsForForms/GetFormsList",
        dataType: "json",
        async: false,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataFilter: function (data) { return data; },
        success: BindAllFormsToDropDown,
        error: ShowAjaxError
    });
};


IntializeDOBCalender = function () {
    try {
        $(".calender").datepicker({
            showOtherMonths: true,
            selectOtherMonths: true,
            dateFormat: "yy-mm-dd",
            changeMonth: true,
            changeYear: true,
            onSelect: function (selected) {
                if ($(this).attr('id') == "txtDiffDate")
                    DaysDifference();
            }
        });
    }
    catch (Err)
    { }
};

function DaysDifference() {
    var Todate = new Date();
    var customDate = Todate.getFullYear() + "-" + (Todate.getMonth() + 1) + "-" + Todate.getDate().toString();
    var dates = customDate.split('-');
    var Todate = new Date(dates[0], dates[1] - 1, dates[2]);

    var PastDateOrFutureDate = $("#txtDiffDate").val();
    var dates = PastDateOrFutureDate.split('-');
    var PastDateOrFutureDate = new Date(dates[0], dates[1] - 1, dates[2]);

    diffDays = (PastDateOrFutureDate.getTime() - Todate.getTime()) / (24 * 60 * 60 * 1000);
    $("#ui_txtDOBNoofDays").val(diffDays);
}

$("#ui_txtDOBNoofDays").change(function () {
    if ($("#ui_txtDOBNoofDays").val() != null && $("#ui_txtDOBNoofDays").val() != 0 && $("#ui_txtDOBNoofDays").val().length > 0) {
        var utcdate = new Date().toJSON().slice(0, 10);
        var pastorfuturedate = GetDifferenceDateValue(utcdate, $("#ui_txtDOBNoofDays").val());
        $("#txtDiffDate").val(pastorfuturedate);
    }
    else {
        $("#txtDiffDate").val("");
    }
});

function GetDifferenceDateValue(DateValue, DaysGap) {
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
}


$(".calender").mouseover(function () {
    ChangeDatePosition();
});

ChangeDatePosition = function () {
    $("#ui-datepicker-div").css({ height: "218px", marginTop: "0px", top: "661.313px" });
};

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

BindAllFormsToDropDown = function (formsList) {

    if (formsList.length > 0) {
        $.each(formsList, function () {
            if ($(this)[0].FormType != 19) {
                if ($(this)[0].FormType == 12 || $(this)[0].FormType == 18 || $(this)[0].FormType == 9 || $(this)[0].FormType == 16 || $(this)[0].FormType == 20)
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
            $("#ui_ddlMailRespondentTemplate").append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");
        });
        BindDropDownList("ui_ddlMailRespondentTemplate");
    }
    else {
        $("#ui_ddlMailUnConditionTemplate option[value='0']").remove();
        AddOptionToDropDown(["ui_ddlMailUnConditionTemplate"], "0", "No Template have been added yet", "red");
    }
    BindSmsTemplate();
};

InitializeUsersList = function () {
    $.ajax({
        url: "../Form/CommonDetailsForForms/UserNameList",
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
        $("#ui_ddlUserList").append("<option value='" + $(this)[0].UserInfoUserId + "'>" + $(this)[0].FirstName + "</option>")
    });
    InitializeLmsStage();
};

InitializeLmsStage = function () {
    $.ajax({
        url: "../Form/CommonDetailsForForms/LmsStage",
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
            $("#ui_ddlProspectStatus").append("<option style='color:" + $(this)[0].IdentificationColor + ";' value='" + $(this)[0].Score.toString() + "'>" + $(this)[0].Stage + "</option>");
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

function BindSmsTemplate() {
    $.ajax({
        url: "../Form/CommonDetailsForForms/GetSmsTemplate",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            $.each(response, function () {
                $("#ui_ddlSmsRespondentTemplate").append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");
            });
        },
        error: ShowAjaxError
    });

    if ($("#ui_ddlSmsRespondentTemplate option").length > 1)
        BindDropDownList("ui_ddlSmsRespondentTemplate");
};

function BindDropDownList(Id) {
    $("#" + Id).dropdownchecklist({ firstItemChecksAll: 'exclusive', emptyText: "Select Template", explicitClose: 'close', maxDropHeight: 100, width: 296 });
    $("#ddcl-" + Id + "-ddw").css({ width: "300px" });
    $("#ddcl-" + Id + "").css({ display: "" });
    $(".ui-widget-content").css({ "overflow-x": "hidden", height: "64px", marginTop: "-4px" });
    $(".ui-dropdownchecklist-item").css({ padding: "0px" });
    $(".ui-dropdownchecklist-text").css({ marginLeft: "6px", marginTop: "4px" });
    $("#" + Id).val("").dropdownchecklist("refresh");
}

/*General function hide and show div*/

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

$("#ui_ddlContactCustomisedConditions").change(function () {
    if ($(this).val() == "10")
        $("#txtCustomisedContactFieldAnswer2").show();
    else
        $("#txtCustomisedContactFieldAnswer2").hide();
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
        $("#dv_IgnoreCondition").hide();
        $("#dvVisitorDateRange,#dvDOBDayDifference").hide();
    }
    else if ($("#ui_rdbtnMonth").is(":checked")) {
        $("#dvVisitorDateRange,#dvDOBDayDifference").hide();
        $("#dv_IgnoreCondition").show();
    }
    else if ($("#ui_rdbtnDates").is(":checked")) {
        $("#dvVisitorDateRange").show();
        $("#dv_IgnoreCondition").show();
        $("#dvDOBDayDifference").hide();
    }
    else if ($("#ui_rdbtnDayDiff").is(":checked")) {
        $("#dvVisitorDateRange").hide();
        $("#dv_IgnoreCondition").show();
        $("#dvDOBDayDifference").show();
    }
});

/*ReportMail*/
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

$("input:radio[name=ReportSms]").click(function () {

    if ($("#dvReportToSMSConditionalFields"))
        $("#dvReportToSMSConditionalFields").empty();
    if ($("#dvReportToSMSConditionalOptions"))
        $("#dvReportToSMSConditionalOptions").empty();

    if ($("#ui_chkReportSMS").is(":checked"))
        $("#ReportSms_Tr").show();

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

    if ($("#dvMailoutConditionalOptions"))
        $("#dvMailoutConditionalOptions").empty();
    if ($("#dvMailoutConditionalFields"))
        $("#dvMailoutConditionalFields").empty();

    if ($("#ui_chkSendMailOut").is(":checked"))
        $("#MailOut_Tr").show();

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

$("#ui_chkReportMail, #ui_chkReportSMS, #ui_chkSendMailOut").click(function () {

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

});
/*ReportMail*/


/* Hide and Show Div*/
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

$(".rule").click(function () {

    if ($("#" + $(this).attr("id") + "Td").is(":visible"))
        $("#" + $(this).attr("id") + "Td").hide();
    else
        $("#" + $(this).attr("id") + "Td").show();

});

$(".ruleSeparator > label ").click(function () {
    $("#" + $(this).attr("for")).click();
});

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


function GetWorkFlowMaxCount(RuleId) {
    $("#ui_dvData").empty();
    $("#dvLoading").show();
    rowIndex = 0;
    $.ajax({
        url: "/Rules/GetWorkFlowMaxCount",
        data: JSON.stringify({ 'RuleId': RuleId }),
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            maxRowCount = response;
            if (maxRowCount > 0) {
                var numberOfRecords = GetNumberOfRecordsPerPage();
                CreateTable(numberOfRecords, RuleId);
                if (maxRowCount > numberOfRecords) {
                    $("#ui_lnkViewMore").show();
                }
            }
            else {
                SaveRuleData();
            }
        },
        error: ShowAjaxError
    });
}

function CreateTable(numberRowsCount, RuleId) {
    var OffSet = rowIndex;
    var FetchNext = numberRowsCount;

    $.ajax({
        url: "/Rules/GetWorkFlowBasedOnRule",
        data: JSON.stringify({ 'RuleId': RuleId, 'OffSet': OffSet, 'FetchNext': FetchNext }),
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response != null && response.length > 0) {
                BindWorkFlowDetails(response, OffSet, FetchNext);
            }
            else {
                viewMoreDisable = false;
                SaveRuleData();
            }
        },
        error: ShowAjaxError
    });
}

function ViewMore() {
    if (!viewMoreDisable) {
        $("#dvLoading").show();
        viewMoreDisable = true;
        var numberOfRecords = GetNumberOfRecordsPerPage();
        CreateTable(numberOfRecords, triggerMailSmsId);
    }
}

function BindWorkFlowDetails(response, OffSet, FetchNext) {
    rowIndex = response.length + rowIndex;
    $("#ui_divWorkFlowData,#ui_dvContent,.bgShadedDiv").show();
    $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");

    if (rowIndex >= maxRowCount) {
        $("#ui_spanlinkdata").show();
        $("#ui_lnkViewMore").hide();
    }
    else {
        $("#ui_spanlinkdata").hide();
        $("#ui_lnkViewMore").show();
    }

    $.each(response, function (i) {
        var divContent = "<div style='float: left; width: 50%; text-align: left;'>" + $(this)[0].Title + "</div>";
        divContent += "<div id='ui_txtstatusword" + $(this)[0].WorkFlowId + "' style='float: left; width: 30%;'>" + StatusInWords($(this)[0].Status) + "</div> ";
        if ($(this)[0].Status == 1)
            divContent += "<div style='float: right; width: 20%;'><input style='margin-left: 15px;' id='ui_txtStatuschange" + $(this)[0].WorkFlowId + "' type='button' value='Stop' status='" + $(this)[0].Status + "' onclick='ChangeStatus(" + $(this)[0].WorkFlowId + ",\"" + $(this)[0].Title + "\")'></div>";
        else
            divContent += "<div style='float: right; width: 20%;'><input style='margin-left: 15px;' id='ui_txtStatuschange" + $(this)[0].WorkFlowId + "' type='button' value='Start' status='" + $(this)[0].Status + "' onclick='ChangeStatus(" + $(this)[0].WorkFlowId + ",\"" + $(this)[0].Title + "\")'></div>";

        $("#ui_dvData").append("<div class='itemStyle'>" + divContent + "</div>");
    });
    $("#dvLoading").hide();
    viewMoreDisable = false;
}

function StatusInWords(status) {
    if (status == 1)
        return "Running";
    else
        return "Stopped";
}

function ChangeStatus(WorkFlowId, WorkFlowName) {
    $("#dvLoading").show();
    var WorkFlowBasicDetails = {};
    WorkFlowBasicDetails.WorkflowId = WorkFlowId;
    WorkFlowBasicDetails.Status = $("#ui_txtStatuschange" + WorkFlowId).attr("status") == "1" ? 0 : 1;
    WorkFlowBasicDetails.Title = WorkFlowName;
    $.ajax({
        url: "/WorkFlow/Create/Updateworkflowstatus",
        type: 'POST',
        data: JSON.stringify({ 'WorkFlowBasicDetails': WorkFlowBasicDetails }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (response) {
            if ($("#ui_txtStatuschange" + WorkFlowId).attr("status") == "0") {
                $("#ui_txtStatuschange" + WorkFlowId).removeAttr("status").attr("status", "1");
                $("#ui_txtStatuschange" + WorkFlowId).val("Stop");
                $("#ui_txtstatusword" + WorkFlowId).html("Running");
                ShowErrorMessage("Workflow Started!");
            }
            else if ($("#ui_txtStatuschange" + WorkFlowId).attr("status") == "1") {
                $("#ui_txtStatuschange" + WorkFlowId).removeAttr("status").attr("status", "0");
                $("#ui_txtStatuschange" + WorkFlowId).val("Start");
                $("#ui_txtstatusword" + WorkFlowId).html("Stopped");
                ShowErrorMessage("Workflow Stopped!");
            }
            $("#dvLoading").hide();
        },
    });
}


$(document.body).on('keypress', '.Numericswithcomma', function (event) {
    var keyCode = (event.which) ? event.which : event.keyCode;
    if ((keyCode >= 48 && keyCode <= 57) || keyCode == 44)
        return true;
    return false;
});