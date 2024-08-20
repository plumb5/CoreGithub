

var ContactOptionList = [];
var GroupByFilter = { GroupId: 0, IsOtherGroup: null, TimeInterval: null, FilterContent: "", FilterQuery: "", CreatedDate: null };
var GroupId = 0;
var Groups = { Id: 0 }

$(document).ready(function () {

    GroupId = $.urlParam("GroupId");

    if (GroupId > 0) {
        GetGroupName();
        $("#ui_divCreateFilter").show();
        GetContactColumns();
        BindConditionDropDown("ui_ddlFilterCondition_0_0");
        GroupByFilter.GroupId = GroupId;
        GetFilterContent();
    }
    else {
        window.location.href = "/Mail/Group";
    }
});

GetFilterContent = function () {

    $.ajax({
        url: "/Mobile/MobileGroupByFilter/GetFilterContent",
        type: 'POST',
        data: JSON.stringify({ 'groupByFilter': GroupByFilter }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#dvLoading").show();
            if (response.FilterContent != null) {

                var FilterContent = JSON.parse(response.FilterContent);
                if (FilterContent != undefined && FilterContent.length > 0) {

                    if (response.IsOtherGroup == true)
                        $("#ui_chkFilterGroup").prop('checked', true);
                    else
                        $("#ui_chkFilterGroup").prop('checked', false);
                    $('input[name=ui_rdbtnFilterInterval][value=' + response.TimeInterval + ']').prop('checked', true);

                    for (var i = 0; i < FilterContent.length; i++) {
                        if (i != 0)
                            AddNewFilter();
                        if (FilterContent[i].FilterType != 0) {
                            $('input[name=ui_rdbtnFilterQueryType_' + i + '_0][value=' + FilterContent[i].FilterType + ']').prop('checked', true);
                        }
                        $('#ui_ddlFilterContactColumn_' + i).val(FilterContent[i].ColumnName);
                        changeContactToolTip(i);

                        var AllCondition = FilterContent[i].Condition;
                        if (AllCondition.length > 0) {
                            for (var j = 0; j < AllCondition.length; j++) {
                                if (j != 0)
                                    AddNewCondition(i);
                                else {
                                    changeTextBox(i);
                                    changeConditionDropDown("ui_ddlFilterContactColumn_" + i, i);
                                }
                                var elementSuffixId = i + '_' + j;
                                if (AllCondition[j].QueryType != 0)
                                    $('input[name=ui_rdbtnConditionQueryType_' + elementSuffixId + '][value=' + AllCondition[j].QueryType + ']').prop('checked', true);
                                $('#ui_ddlFilterCondition_' + elementSuffixId).val(AllCondition[j].ConditionType);
                                $('#ui_txtFilterConditionValue_' + elementSuffixId).val(AllCondition[j].ConditionValue);
                                ChangeConditionTextBox("ui_ddlFilterCondition_" + elementSuffixId, elementSuffixId);
                            }
                        }
                    }
                    $("#dvLoading").hide();
                    $("#ui_btnFilterSave").val('Update');
                }
            }
            else {
                $("#dvLoading").hide();
            }
        },
        error: ShowAjaxError
    });
}


GetGroupName = function () {

    Groups.Id = GroupId;
    $.ajax({
        url: "/Mobile/MobileGroupByFilter/GetGroupDetails",
        type: 'POST',
        data: JSON.stringify({ 'group': Groups }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {

            $.each(response, function () {
                $("#lblGroupName").html("( Group - " + $(this)[0].Name + " )");
            });

        },
        error: ShowAjaxError
    });
};

GetContactColumns = function () {
    $.ajax({
        url: "/Mobile/MobileGroupByFilter/GetContactColumn",
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
        url: "/Mail/ContactField/GetAllFieldDetails",
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
            BindContactDropDown("ui_ddlFilterContactColumn_0");
        },
        error: ShowAjaxError
    });
}

function AddNewCondition(IdSuffix) {

    var FilterSubContainerId = "ui_divFilterConditionSubContainer_" + IdSuffix;

    var maxElement = $('div[id^=' + FilterSubContainerId + ']');
    var elementSuffixId = IdSuffix + '_' + (maxElement.length);

    var mainConditionDiv = CreateDiv("ui_divFilterConditionSubContainer_" + elementSuffixId, "width:100%;");

    var queryTypeDiv = CreateDiv('', "width: 100%;margin-top:5px;");

    var queryLabelDiv = CreateDiv('', "width: 10%; float: left;");
    queryLabelDiv.className = "TextBoxLabel";
    queryLabelDiv.innerHTML = "Query Type :";

    queryTypeDiv.appendChild(queryLabelDiv);

    var queryConditionDiv = CreateDiv();

    queryConditionDiv.appendChild(CreateRadioButton('ui_rdbtnConditionQueryType_And_' + elementSuffixId, 'ui_rdbtnConditionQueryType_' + elementSuffixId, '1', true));
    queryConditionDiv.appendChild(CreateRadioButtonLabel('ui_rdbtnConditionQueryType_And_' + elementSuffixId, 'And'));
    queryConditionDiv.appendChild(CreateRadioButton('ui_rdbtnConditionQueryType_Or_' + elementSuffixId, 'ui_rdbtnConditionQueryType_' + elementSuffixId, '2', false));
    queryConditionDiv.appendChild(CreateRadioButtonLabel('ui_rdbtnConditionQueryType_Or_' + elementSuffixId, 'Or'));

    queryTypeDiv.appendChild(queryConditionDiv);

    var conditionTypeDiv = CreateDiv('', "width: 100%;margin-top:5px;");

    var conditionLabelDiv = CreateDiv('', "width: 10%; float: left;");
    conditionLabelDiv.className = "TextBoxLabel";
    conditionLabelDiv.innerHTML = "Select Condition :";

    conditionTypeDiv.appendChild(conditionLabelDiv);

    var conditionFilterDiv = CreateDiv();
    conditionFilterDiv.appendChild(createConditionDropDown('ui_ddlFilterCondition_' + elementSuffixId));
    conditionFilterDiv.appendChild(CreateTextBox('ui_txtFilterConditionValue_' + elementSuffixId, 'Filter value'));

    conditionTypeDiv.appendChild(conditionFilterDiv);


    mainConditionDiv.appendChild(queryTypeDiv);
    mainConditionDiv.appendChild(conditionTypeDiv);

    $("#ui_divFilterConditionContainer_" + IdSuffix).append(mainConditionDiv);

    changeTextBox(IdSuffix);
    changeConditionDropDown("ui_ddlFilterContactColumn_" + IdSuffix, IdSuffix);

    $("#ui_ancFilterConditionDelete_" + IdSuffix).show();
}

function RemoveLastCondition(IdSuffix) {
    var FilterSubContainerId = "ui_divFilterConditionSubContainer_" + IdSuffix;

    var maxElement = $('div[id^=' + FilterSubContainerId + ']');

    if (maxElement.length > 1) {
        var elementSuffixId = IdSuffix + '_' + (maxElement.length - 1);
        $("#ui_divFilterConditionSubContainer_" + elementSuffixId).remove();
    }

    maxElement = $('div[id^=' + FilterSubContainerId + ']');
    if (maxElement.length <= 1) {
        $("#ui_ancFilterConditionDelete_" + IdSuffix).hide();
    }
}

function AddNewFilter() {

    var maxFilter = $('div[id^=ui_divFilterContainer_]');

    var IdSuffix = maxFilter.length;

    var FilterSubContainerId = "ui_divFilterConditionSubContainer_" + IdSuffix;

    var maxElement = $('div[id^=' + FilterSubContainerId + ']');
    var elementSuffixId = IdSuffix + '_' + (maxElement.length);

    var mailFilterDiv = CreateDiv('ui_divFilterContainer_' + IdSuffix, "border: 1px solid #CFCFCF;width: 98%;margin-top:15px;padding-top:5px;padding-bottom:10px;");

    var conditionDiv = CreateDiv('ui_divFilterCondition_' + IdSuffix, '');

    var queryTypeDiv = CreateDiv('', "width: 100%;margin-top:5px;");

    var queryLabelDiv = CreateDiv('', "width: 10%; float: left;");
    queryLabelDiv.className = "TextBoxLabel";
    queryLabelDiv.innerHTML = "Filter Type :";

    queryTypeDiv.appendChild(queryLabelDiv);

    var queryConditionDiv = CreateDiv();

    queryConditionDiv.appendChild(CreateRadioButton('ui_rdbtnFilterQueryType_And_' + elementSuffixId, 'ui_rdbtnFilterQueryType_' + elementSuffixId, '1', true));
    queryConditionDiv.appendChild(CreateRadioButtonLabel('ui_rdbtnFilterQueryType_And_' + elementSuffixId, 'And'));
    queryConditionDiv.appendChild(CreateRadioButton('ui_rdbtnFilterQueryType_Or_' + elementSuffixId, 'ui_rdbtnFilterQueryType_' + elementSuffixId, '2', false));
    queryConditionDiv.appendChild(CreateRadioButtonLabel('ui_rdbtnFilterQueryType_Or_' + elementSuffixId, 'Or'));

    queryTypeDiv.appendChild(queryConditionDiv);

    conditionDiv.appendChild(queryTypeDiv);


    var contactDiv = CreateDiv('', "width: 100%;margin-top:5px;");
    var contactLabelDiv = CreateDiv('', "width: 10%; float: left;");
    contactLabelDiv.className = "TextBoxLabel";
    contactLabelDiv.innerHTML = "Select Column :";
    contactDiv.appendChild(contactLabelDiv);
    var contactFieldDiv = CreateDiv('', '');
    contactFieldDiv.appendChild(createContactDropDown('ui_ddlFilterContactColumn_' + IdSuffix));
    contactFieldDiv.append(createToolTip('ui_lblContactToolTip_' + IdSuffix));

    contactDiv.appendChild(contactFieldDiv);

    conditionDiv.appendChild(contactDiv);

    var filterConditionDiv = CreateDiv('ui_divFilterConditionContainer_' + IdSuffix, "width: 100%;margin-top:5px;");

    var filterConditionSubDiv = CreateDiv('ui_divFilterConditionSubContainer_' + elementSuffixId, "width: 100%;");

    var conditionTypeDiv = CreateDiv('', "width: 100%;margin-top:5px;");

    var conditionLabelDiv = CreateDiv('', "width: 10%; float: left;");
    conditionLabelDiv.className = "TextBoxLabel";
    conditionLabelDiv.innerHTML = "Select Condition :";

    conditionTypeDiv.appendChild(conditionLabelDiv);

    var conditionFilterDiv = CreateDiv();
    conditionFilterDiv.appendChild(createConditionDropDown('ui_ddlFilterCondition_' + elementSuffixId));
    conditionFilterDiv.appendChild(CreateTextBox('ui_txtFilterConditionValue_' + elementSuffixId, 'Filter value'));

    conditionTypeDiv.appendChild(conditionFilterDiv);

    filterConditionSubDiv.appendChild(conditionTypeDiv);

    filterConditionDiv.appendChild(filterConditionSubDiv);

    conditionDiv.appendChild(filterConditionDiv);

    var addNewConditionButtonDiv = CreateDiv('', "width: 100%;margin-top:5px;height:25px;");

    var removeConditionTag = CreateAnchorTag("ui_ancFilterConditionDelete_" + IdSuffix);
    removeConditionTag.setAttribute("onclick", "RemoveLastCondition(" + IdSuffix + ")");
    removeConditionTag.style.display = "none";

    var removeConditionImage = CreateImage('DeleteFilterCondition');
    var removeConditionSpan = createSpan("Remove Condition&nbsp;&nbsp;&nbsp;");
    removeConditionTag.appendChild(removeConditionImage);
    removeConditionTag.appendChild(removeConditionSpan);

    addNewConditionButtonDiv.appendChild(removeConditionTag);

    var addConditionTag = CreateAnchorTag("ui_ancFilterConditionAddNew_" + IdSuffix);
    addConditionTag.setAttribute("onclick", "AddNewCondition(" + IdSuffix + ")");

    var addConditionImage = CreateImage('AddFilterCondition');
    var addConditionSpan = createSpan("Add Condition&nbsp;&nbsp;&nbsp;");
    addConditionTag.appendChild(addConditionImage);
    addConditionTag.appendChild(addConditionSpan);

    addNewConditionButtonDiv.appendChild(addConditionTag);

    conditionDiv.appendChild(addNewConditionButtonDiv);

    mailFilterDiv.appendChild(conditionDiv);

    $("#ui_divFilterContainermain").append(mailFilterDiv);
    $("#ui_ancFilterDelete").show();
}

function RemoveLastFilter() {
    var maxFilter = $('div[id^=ui_divFilterContainer_]');

    if (maxFilter.length > 1) {
        $("#ui_divFilterContainer_" + (maxFilter.length - 1)).remove();
    }

    maxFilter = $('div[id^=ui_divFilterContainer_]');
    if (maxFilter.length <= 1) {
        $("#ui_ancFilterDelete").hide();
    }
}

$("#ui_btnFilterCancel").click(function () {
    window.location.href = "/Mail/Group";
});

function validateFilter() {

    var UnSelectedColumn = $('[id^=ui_ddlFilterContactColumn_] option:selected').filter(function () {
        return this.value === '0';
    });

    if (UnSelectedColumn.length > 0) {
        ShowErrorMessage("Please select the filter column");
        $("#dvLoading").hide();
        return false;
    }

    var UnFilledText = $('[id^=ui_txtFilterConditionValue_]').filter(function () {
        return ($.trim(this.value) === '' && !$(this).is(":hidden"));
    });

    if (UnFilledText.length > 0) {
        ShowErrorMessage("Please enter all filter value");
        $("#dvLoading").hide();
        return false;
    }

    var InValidText = $('[id^=ui_txtFilterConditionValue_]').filter(function () {
        return (IsVulnerableContent(this.value) == true && !$(this).is(":hidden"));
    });

    if (InValidText.length > 0) {
        ShowErrorMessage("Please enter valid input texts");
        $("#dvLoading").hide();
        return false;
    }

    return true;
}

//General Functions

$(document.body).on('change', '.filterDropDown', function (e) {
    var optionSelected = $("option:selected", this);
    var ddlId = optionSelected[0].parentElement.id;
    var ddlIdSuffix = ddlId.split('ui_ddlFilterContactColumn_')[1];
    $("[id^=ui_txtFilterConditionValue_" + ddlIdSuffix + "]").val("");
    $("[id^=ui_txtFilterConditionValue_" + ddlIdSuffix + "]").show();
    $("[id^=ui_ddlFilterCondition_" + ddlIdSuffix + "]").val("1");
    changeTextBox(ddlIdSuffix);
    changeContactToolTip(ddlIdSuffix);
    changeConditionDropDown(ddlId, ddlIdSuffix);
});

$(document.body).on('change', '.filterConditionDropDown', function (e) {
    var optionSelected = $("option:selected", this);
    var ddlId = optionSelected[0].parentElement.id;
    var ddlIdSuffix = ddlId.split('ui_ddlFilterCondition_')[1];
    ChangeConditionTextBox(ddlId, ddlIdSuffix);
});

function ChangeConditionTextBox(CurrentDdlId, ddlIdSuffix) {
    var CurrentValue = $("#" + CurrentDdlId).val();
    $("[id=ui_txtFilterConditionValue_" + ddlIdSuffix + "]").show();
    if (CurrentValue == "9" || CurrentValue == "10") {
        $("[id=ui_txtFilterConditionValue_" + ddlIdSuffix + "]").val("");
        $("[id=ui_txtFilterConditionValue_" + ddlIdSuffix + "]").hide();
    }
}

function changeConditionDropDown(CurrentDdlId, ddlIdSuffix) {
    var dataType = $('#ui_ddlFilterContactColumn_' + ddlIdSuffix + ' option:selected')[0].getAttribute("datatype");
    $("[id^=ui_ddlFilterCondition_" + ddlIdSuffix + "] option").show();
    if (dataType == "String") {
        $("[id^=ui_ddlFilterCondition_" + ddlIdSuffix + "] option[value=3]").hide();
        $("[id^=ui_ddlFilterCondition_" + ddlIdSuffix + "] option[value=4]").hide();
        $("[id^=ui_ddlFilterCondition_" + ddlIdSuffix + "] option[value=7]").hide();
        $("[id^=ui_ddlFilterCondition_" + ddlIdSuffix + "] option[value=8]").hide();
    }
    else if (dataType == "DateTime") {
        $("[id^=ui_ddlFilterCondition_" + ddlIdSuffix + "] option[value=5]").hide();
        $("[id^=ui_ddlFilterCondition_" + ddlIdSuffix + "] option[value=6]").hide();
    }
}

function changeContactToolTip(ddlIdSuffix) {

    $("#ui_lblContactToolTip_" + ddlIdSuffix).hide();

    if ($("#ui_ddlFilterContactColumn_" + ddlIdSuffix).get(0).selectedIndex != 0) {

        $("#ui_lblContactToolTip_" + ddlIdSuffix).show();

        var dataType = $('#ui_ddlFilterContactColumn_' + ddlIdSuffix + ' option:selected')[0].getAttribute("datatype");
        var columnName = $('#ui_ddlFilterContactColumn_' + ddlIdSuffix + ' option:selected').val();
        var toolTipText = "DataType : " + dataType + ", Hint : Any " + dataType + " value";

        var toolTipValue = getContactToolTip(columnName);

        if (toolTipValue != undefined && toolTipValue != null && toolTipValue != "") {
            toolTipText = "DataType : " + dataType + ", Hint : " + toolTipValue;
        }

        $("#ui_lblContactToolTip_" + ddlIdSuffix).prop('title', toolTipText);
    }
}
$(document.body).on('focus', '.calender', function (event) {
    showCalendarControl(this);
});

function changeTextBox(textBoxIdSuffix) {

    $("[id^=ui_txtFilterConditionValue_" + textBoxIdSuffix + "]").removeAttr("class");
    $("[id^=ui_txtFilterConditionValue_" + textBoxIdSuffix + "]").addClass("textBox");
    $("[id^=ui_txtFilterConditionValue_" + textBoxIdSuffix + "]").removeAttr("readonly");

    //To remove if autocomplete is added last time
    try {
        $("[id^=ui_txtFilterConditionValue_" + textBoxIdSuffix + "]").autocomplete({ source: [] });
        $("[id^=ui_txtFilterConditionValue_" + textBoxIdSuffix + "]").autocomplete("disable");
        $("[id^=ui_txtFilterConditionValue_" + textBoxIdSuffix + "]").autocomplete("destroy");
        $("[id^=ui_txtFilterConditionValue_" + textBoxIdSuffix + "]").removeData('autocomplete');
    }
    catch (e) {
        console.log('autocomplete destroy error->' + e.message);
    }
    //End remove autocomplete

    if ($("#ui_ddlFilterContactColumn_" + textBoxIdSuffix).get(0).selectedIndex != 0) {

        var dataType = $('#ui_ddlFilterContactColumn_' + textBoxIdSuffix + ' option:selected')[0].getAttribute("datatype");

        var className = "";
        switch (dataType) {
            case "String":
                className = "";
                break;
            case "Int16":
                className = "numberValueWithNegative";
                break;
            case "Int32":
                className = "numbervalues";
                break;
            case "Double":
                className = "numbervalues";
                break;
            case "Byte":
                className = "numbervalues";
                break;
            case "DateTime":
                //className = "calender";
                //$("[id^=ui_txtFilterConditionValue_" + textBoxIdSuffix + "]").prop('readonly', true);
                className = "numberValueWithNegative";
                IntializeAutoComplete(textBoxIdSuffix);
                break;
            case "Boolean":
                className = "numbervalues";
                break;
        }
        if (className.length > 0)
            $("[id^=ui_txtFilterConditionValue_" + textBoxIdSuffix + "]").addClass(className);
    }
}

function CreateDiv(id, attribute) {
    var div = document.createElement('div');
    if (id && id != '')
        div.id = id;
    if (attribute && attribute != '')
        div.setAttribute("style", attribute);
    return div;
}

function CreateRadioButton(id, name, value, isSelected) {
    var rdbtn = document.createElement('input');
    rdbtn.type = "radio";
    rdbtn.className = "radio";
    rdbtn.id = id;
    rdbtn.name = name;
    rdbtn.value = value;
    if (isSelected)
        rdbtn.setAttribute("checked", "checked")
    return rdbtn;
}

function createToolTip(id) {
    var TootlTip = document.createElement('label');
    TootlTip.id = id;
    TootlTip.className = "ruleHelpImage";

    TootlTip.setAttribute("style", "cursor:pointer;display: none;");
    TootlTip.title = "";
    return TootlTip;
}

function CreateRadioButtonLabel(forId, text) {
    var rdLabel = document.createElement("label");
    rdLabel.className = "radioLabel";
    rdLabel.setAttribute("for", forId);
    rdLabel.innerHTML = text;
    return rdLabel;
}

function CreateTextBox(id, placeHolder) {
    var txtBox = document.createElement('input');
    txtBox.type = "text";
    txtBox.id = id;
    txtBox.className = "textBox";
    txtBox.setAttribute("style", "width:25%;margin-left: 2%;");
    txtBox.setAttribute("placeholder", placeHolder);
    return txtBox;
}

function CreateAnchorTag(id) {
    var anchorTag = document.createElement('a');
    anchorTag.id = id;
    anchorTag.setAttribute("style", "text-decoration: none;font-size: 13px;color: #878787;font-family:sans-serif;float:right;");
    anchorTag.href = "javascript:void(0);";
    return anchorTag;
}

function CreateImage(classname) {
    var img = document.createElement('img');
    img.src = "/images/img_trans.gif";
    img.className = classname;
    return img;
}

function createSpan(text) {
    var span = document.createElement('span');
    span.innerHTML = text;
    return span;
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

function createConditionDropDown(id) {

    var ddlCondition = document.createElement('select');
    ddlCondition.id = id;
    ddlCondition.className = "dropdown filterConditionDropDown";
    ddlCondition.setAttribute("style", "width:26.5%;");

    var optlist = document.createElement('option');
    optlist.value = "1";
    optlist.text = "Is Equal To";
    ddlCondition.options.add(optlist);

    optlist = document.createElement('option');
    optlist.value = "2";
    optlist.text = "Is Not Equal To";
    ddlCondition.options.add(optlist);

    optlist = document.createElement('option');
    optlist.value = "3";
    optlist.text = "Is Greater Than";
    ddlCondition.options.add(optlist);

    optlist = document.createElement('option');
    optlist.value = "7";
    optlist.text = "Is Greater Than And Equal To";
    ddlCondition.options.add(optlist);

    optlist = document.createElement('option');
    optlist.value = "4";
    optlist.text = "Is Less Than";
    ddlCondition.options.add(optlist);

    optlist = document.createElement('option');
    optlist.value = "8";
    optlist.text = "Is Less Than And Equal To";
    ddlCondition.options.add(optlist);

    optlist = document.createElement('option');
    optlist.value = "5";
    optlist.text = "Is Contains";
    ddlCondition.options.add(optlist);

    optlist = document.createElement('option');
    optlist.value = "6";
    optlist.text = "Is Not Contains";
    ddlCondition.options.add(optlist);

    optlist = document.createElement('option');
    optlist.value = "9";
    optlist.text = "Is Empty/Null";
    ddlCondition.options.add(optlist);

    optlist = document.createElement('option');
    optlist.value = "10";
    optlist.text = "Is Not Empty/Null";
    ddlCondition.options.add(optlist);

    return ddlCondition;
}

function createContactDropDown(id) {

    var ddlContact = document.createElement('select');
    ddlContact.id = id;
    ddlContact.className = "dropdown filterDropDown";
    ddlContact.setAttribute("style", "width:26.5%;");

    var optlist = document.createElement('option');
    optlist.value = "0";
    optlist.text = "Select Column";
    ddlContact.options.add(optlist);

    for (var i = 0; i < ContactOptionList.length; i++) {
        optlist = document.createElement('option');
        optlist.value = ContactOptionList[i].value;
        optlist.text = ContactOptionList[i].text;
        optlist.setAttribute("datatype", ContactOptionList[i].getAttribute("datatype"));
        ddlContact.options.add(optlist);
    }

    return ddlContact;
}



function BindConditionDropDown(fieldId) {

    var optlist = document.createElement('option');
    optlist.value = "1";
    optlist.text = "Is Equal To";
    document.getElementById(fieldId).options.add(optlist);

    optlist = document.createElement('option');
    optlist.value = "2";
    optlist.text = "Is Not Equal To";
    document.getElementById(fieldId).options.add(optlist);

    optlist = document.createElement('option');
    optlist.value = "3";
    optlist.text = "Is Greater Than";
    document.getElementById(fieldId).options.add(optlist);

    optlist = document.createElement('option');
    optlist.value = "7";
    optlist.text = "Is Greater Than And Equal To";
    document.getElementById(fieldId).options.add(optlist);

    optlist = document.createElement('option');
    optlist.value = "4";
    optlist.text = "Is Less Than";
    document.getElementById(fieldId).options.add(optlist);

    optlist = document.createElement('option');
    optlist.value = "8";
    optlist.text = "Is Less Than And Equal To";
    document.getElementById(fieldId).options.add(optlist);

    optlist = document.createElement('option');
    optlist.value = "5";
    optlist.text = "Is Contains";
    document.getElementById(fieldId).options.add(optlist);

    optlist = document.createElement('option');
    optlist.value = "6";
    optlist.text = "Is Not Contains";
    document.getElementById(fieldId).options.add(optlist);

    optlist = document.createElement('option');
    optlist.value = "9";
    optlist.text = "Is Empty/Null";
    document.getElementById(fieldId).options.add(optlist);

    optlist = document.createElement('option');
    optlist.value = "10";
    optlist.text = "Is Not Empty/Null";
    document.getElementById(fieldId).options.add(optlist);
}

$(document.body).on('keypress', '.numberValueWithNegative', function (event) {

    var charCode = window.event ? window.event.keyCode : event.which; //firefox 

    if (charCode == 45 && $(this).val() == "") {
        return true;
    }
    if (charCode >= 48 && charCode <= 57) {
        return true;
    }
    return false;

});

var ContactToolTipObj = {
    LeadType: "0->Unknown, 1->Lead, 2->Customer",
    IsVerifiedMailId: "-1->Not Validated, 0->InValid, 1->Valid",
    IsVerifiedContactNumber: "-1->Not validated, 0->DnD, 1->Valid, 2->InValid",
    AppType: "0->UnKnown, 1->Analytics, 2->Engagement(Capture Form/Chat/LMS), 3->Community, 4->Social, 5->Mobile Engagement, 6->Connectors, 7->Data management",
    Age: "DateAdd range from -90 to 90(0-> CurrentDate)",
    CreatedDate: "DateAdd range from -90 to 90(0-> CurrentDate)",
    FBLastUpdates: "DateAdd range from -90 to 90(0-> CurrentDate)",
    LastMessageSent: "DateAdd range from -90 to 90(0-> CurrentDate)",
    LastPurchase: "DateAdd range from -90 to 90(0-> CurrentDate)",
    RecentOnlineVisit: "DateAdd range from -90 to 90(0-> CurrentDate)"
};

var getContactToolTip = function (propertyName) {
    return ContactToolTipObj[propertyName];
};

var dateRange =
[
"0",
"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
"21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
"41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60",
"61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80",
"81", "82", "83", "84", "85", "86", "87", "88", "89", "90",
"-1", "-2", "-3", "-4", "-5", "-6", "-7", "-8", "-9", "-10", "-11", "-12", "-13", "-14", "-15", "-16", "-17", "-18", "-19", "-20",
"-21", "-22", "-23", "-24", "-25", "-26", "-27", "-28", "-29", "-30", "-31", "-32", "-33", "-34", "-35", "-36", "-37", "-38", "-39", "-40",
"-41", "-42", "-43", "-44", "-45", "-46", "-47", "-48", "-49", "-50", "-51", "-52", "-53", "-54", "-55", "-56", "-57", "-58", "-59", "-60",
"-61", "-62", "-63", "-64", "-65", "-66", "-67", "-68", "-69", "-70", "-71", "-72", "-73", "-74", "-75", "-76", "-77", "-78", "-79", "-80",
"-81", "-82", "-83", "-84", "-85", "-86", "-87", "-88", "-89", "-90"
];

function IntializeAutoComplete(textBoxIdSuffix) {

    $("[id^=ui_txtFilterConditionValue_" + textBoxIdSuffix + "]").autocomplete({
        autoFocus: true,
        minLength: 1,
        source: dateRange,
        select: function (events, selectedItem) {
            $(this).val(selectedItem.item.value);
        }
    });

    // Overrides the default autocomplete filter function to search only from the beginning of the string
    $.ui.autocomplete.filter = function (array, term) {
        var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
        var results = $.grep(array, function (value) {
            return matcher.test(value.label || value.value || value);
        });
        return results;
        //return results.slice(0, 50);
    };
}



function IsVulnerableContent(inputContent) {
    if (CleanText(inputContent) != "") {
        if (/select|delete|truncate|insert|drop|union|--/ig.test(inputContent.toLowerCase())) {
            return true;
        }
    }
    return false;
}

function EncryptString(inputContent) {
    //Don't Change below values without knowledge
    var key = CryptoJS.enc.Utf8.parse('8080808080808080');
    var iv = CryptoJS.enc.Utf8.parse('8080808080808080');

    var encryptedContent = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(inputContent), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encryptedContent.toString();
}