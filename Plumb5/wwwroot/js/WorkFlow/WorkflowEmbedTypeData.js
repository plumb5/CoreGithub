
var groupList = new Array();
var usersListDetails = new Array();

//----- Old

$(document).ready(function () {
    InitializeDefault();
    IntializeFromsListAndMailGroupList();
});

InitializeDefault = function () {
    IntializeAutoComplete("ui_txtClickButton", "/CommonDetailsForForms/GetEvetList", 2, "ui_txtClickButton_values", "clkBtn");
    IntializeAutoComplete("ui_txtNotClickButton", "/Form/CommonDetailsForForms/GetEvetList", 2, "ui_txtNotClickButton_values", "clkNotBtn");
    IntializeAutoComplete("ui_txtPriceRangeProducts", "/CommonDetailsForForms/GetEvetList", 2, "ui_txtPriceRangeProducts_values", "ClickProduct");
    IntializeAutoComplete("ui_txtCustomerNotPurchasedProducts", "/CommonDetailsForForms/GetProductList", 2, "ui_txtCustomerNotPurchasedProducts_values", "NotPurchase");
    IntializeAutoComplete("ui_txtCustomerPurchasedProducts", "/CommonDetailsForForms/GetProductList", 2, "ui_txtCustomerPurchasedProducts_values", "Purchase");
    IntializeAutoComplete("ui_txtDropedFromCartProducts", "/CommonDetailsForForms/GetProductList", 2, "ui_txtDropedFromCartProducts_values", "DropFromCart");
    IntializeAutoComplete("ui_txtViewedNotAddedToCartProducts", "/CommonDetailsForForms/GetProductList", 2, "ui_txtViewedNotAddedToCartProducts_values", "NotAddedToCart");
    IntializeAutoComplete("ui_txtAddedToCartProducts", "/CommonDetailsForForms/GetProductList", 2, "ui_txtAddedToCartProducts_values", "AddedToCart");
    IntializeAutoComplete("ui_txtCity", "/CommonDetailsForForms/GetCityName", 2, "ui_txtCity_values", "cityName");
    IntializeAutoComplete("ui_txtAddedToCartProductsCategories", "/CommonDetailsForForms/GetProductCategoryList", 2, "ui_txtAddedToCartProductsCategories_values", "CategoriesAddedToCart");
    IntializeAutoComplete("ui_txtNotAddedToCartProductsCategories", "/CommonDetailsForForms/GetProductCategoryList", 2, "ui_txtNotAddedToCartProductsCategories_values", "CategoriesnotAddedToCart");
    IntializeAutoComplete("ui_txtAddedToCartProductsSubCategories", "/CommonDetailsForForms/GetProductSubCategoryList", 2, "ui_txtAddedToCartProductsSubCategories_values", "SubCategoriesAddedToCart");
    IntializeAutoComplete("ui_txtNotAddedToCartProductsSubCategories", "/CommonDetailsForForms/GetProductSubCategoryList", 2, "ui_txtNotAddedToCartProductsSubCategories_values", "SubCategoriesnotAddedToCart");
    IntializeCountyList();
    
};


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
                if ($(this)[0].FormType == 12 || $(this)[0].FormType == 18 || $(this)[0].FormType == 9 || $(this)[0].FormType == 16 || $(this)[0].FormType == 20)
                    AddOptionToDropDown(["ui_ddlRespondedFroms", "ui_ddlNotRespondedFroms", "ui_ddlAnswerDependencyFroms", "ui_ddlFormCloseEvent", "ui_ddlFormImpression"], $(this)[0].Id, $(this)[0].Heading, "");

                else if ($(this)[0].FormType != 4 && $(this)[0].FormType != 1 && $(this)[0].FormType != 5 && $(this)[0].FormType != 17 && $(this)[0].FormType != 6 && $(this)[0].FormType != 2 && $(this)[0].FormType != 3)
                    AddOptionToDropDown(["ui_ddlFormCloseEvent", "ui_ddlFormImpression"], $(this)[0].Id, $(this)[0].Heading, "");
                else
                    AddOptionToDropDown(["ui_ddlFormCloseEvent", "ui_ddlFormImpression"], $(this)[0].Id, $(this)[0].Heading, "");
            }
        });
    }
    else {
        AddOptionToDropDown(["ui_ddlRespondedFroms", "ui_ddlNotRespondedFroms", "ui_ddlAnswerDependencyFroms", "ui_ddlFormCloseEvent", "ui_ddlFormImpression"], "0", "No froms have been added yet", "red");
    }
    InitializeGroupList();
};

InitializeGroupList = function () {

    $.ajax({
        url: "/Form/CommonDetailsForForms/GetGroups",
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
        url: "/Form/CommonDetailsForForms/GetTemplate",
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
        if ($(this)[0].ActiveStatus) {
            usersListDetails.push({ UserInfoUserId: $(this)[0].UserInfoUserId, FirstName: $(this)[0].FirstName });
            $("#ui_ddlUserList").append("<option value='" + $(this)[0].UserInfoUserId + "'>" + $(this)[0].FirstName + "</option>")
        }
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
        url: "/Form/CommonDetailsForForms/GetSmsTemplate",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            $.each(response, function () {
                optlist = document.createElement('option');
                optlist.value = $(this)[0].Id;
                optlist.text = $(this)[0].Name;
                document.getElementById("ui_ddlSmsTemplate").options.add(optlist);

                var SmstemplateDetailsObject = new Object();
                SmstemplateDetailsObject.TemplateId = $(this)[0].Id;
                SmstemplateDetailsObject.TempName = $(this)[0].Name;
                SmsTemplateList.push(SmstemplateDetailsObject);
            });
        },
        error: ShowAjaxError
    });
};