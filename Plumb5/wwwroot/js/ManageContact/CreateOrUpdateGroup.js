var ContactPropertyList = [
    { FrontEndName: 'FirstName', P5ColumnName: 'Name' },
    { FrontEndName: 'UtmSource', P5ColumnName: 'UtmTagSource' },
    { FrontEndName: 'UtmMedium', P5ColumnName: 'FirstUtmMedium' },
    { FrontEndName: 'UtmCampaign', P5ColumnName: 'FirstUtmCampaign' },
    { FrontEndName: 'UtmTerm', P5ColumnName: 'FirstUtmTerm' },
    { FrontEndName: 'UtmContent', P5ColumnName: 'FirstUtmContent' },
    { FrontEndName: 'MailSubscribe', P5ColumnName: 'Unsubscribe' },
    { FrontEndName: 'SmsSubscribe', P5ColumnName: 'IsSmsUnsubscribe' }
];

var Fields = new Array();
var IsRequiredFieldsValues = [];

$(document).ready(function () {
    GetPropertiesFields();
    InitialiseDatePicker();
});

function GetPropertiesFields() {
    $.ajax({
        url: "/ManageContact/Group/GetProperties",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            Fields = response;
            for (var i = 0; i < Fields.length; i++) {
                AppendFieldToTable(Fields[i].FieldName, Fields[i].FieldType, Fields[i].FieldValue, Fields[i].CustomFieldName);
            }
            GetLmsSources();
        },
        error: ShowAjaxError
    });
}
function AppendFieldToTable(FieldName, FieldType, FieldValue, CustomFieldName) {
    var ContactField = '', drpOption = '', nameattribute = '', IdentifierValue = "";

    if (CustomFieldName != null && CustomFieldName != "")
        IdentifierValue = CustomFieldName;
    else
        IdentifierValue = FieldName;

    for (var a = 0; a < ContactPropertyList.length; a++) {
        if (ContactPropertyList[a].FrontEndName == IdentifierValue) {
            IdentifierValue = ContactPropertyList[a].P5ColumnName;
            break;
        }
    }

    if (FieldType === 'String') {
        ContactField = `<div class="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                           <div class="form-group">
                              <label class="frmlbltxt" for="">${FieldName}</label>
                              <input type="text" class="form-control form-control-sm" id="ui_txt${IdentifierValue}">
                           </div>
                         </div>`;
    }
    else if (FieldType === 'Int32') {
        ContactField = `<div class="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                           <div class="form-group">
                              <label class="frmlbltxt" for="">${FieldName}</label>
                              <input type="number" class="form-control form-control-sm numbervalues" id="ui_txt${IdentifierValue}">
                           </div>
                         </div>`;

    }
    else if (FieldType === 'DateTime') {
        ContactField = `<div class="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div class="form-group">
                                <label class="frmlbltxt" for="">${FieldName}</label>
                                <input type="email" class="form-control form-control-sm" id="ui_txt${IdentifierValue}">
                            </div>
                         </div>`;
    }
    //For dropdown Binding
    else if (FieldType === 'enum') {
        var BindingType = "";

        if (IsRequiredFieldsValues != null && IsRequiredFieldsValues.length > 0) {
            for (var s = 0; s < IsRequiredFieldsValues.length; s++) {
                if (IsRequiredFieldsValues[s] == IdentifierValue) {
                    BindingType = "EmptyTextBox";
                    break;
                }
            }
        }

        if (BindingType != null && BindingType != "" && BindingType == "EmptyTextBox") {
            ContactField = `<div class="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                           <div class="form-group">
                              <label class="frmlbltxt" for="">${FieldName}</label>
                              <input type="text" class="form-control form-control-sm" id="ui_txt${IdentifierValue}">
                           </div>
                         </div>`;

        }
        else {
            ContactField = `<div class="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                            <div class="form-group">
                                                <label class="frmlbltxt" for="">${FieldName}</label>
                                                <select class="form-control form-control-sm" name="${nameattribute}" id="ui_ddl${IdentifierValue}">
                                                    <option value="-1">Select Option</option>
                                                </select>
                                            </div>
                                        </div>`;
            drpOption = FieldValue.split(",");
        }
    }
    //For  Radio button Binding
    else if (FieldType === 'Boolean') {
        ContactField = `<div class="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                            <label class="frmlbltxt" for="">${FieldName}</label>
                                            <div class="radioBtn mb-3">
                                                <div class="custom-control custom-radio custom-control-inline">
                                                    <input type="radio" class="custom-control-input" id="ui_rdbtn${IdentifierValue}True" name="${IdentifierValue}" value="1">
                                                    <label class="custom-control-label" for="ui_rdbtn${IdentifierValue}True">True</label>
                                                  </div>
                                                  <div class="custom-control custom-radio custom-control-inline">
                                                    <input type="radio" class="custom-control-input" id="ui_rdbtn${IdentifierValue}false" name="${IdentifierValue}" value="0">
                                                    <label class="custom-control-label" for="ui_rdbtn${IdentifierValue}false">False</label>
                                                  </div>
                                            </div>
                                        </div>`;
    }

    $("#dvField1").append(ContactField);
    for (var a in drpOption) {
        $("#ui_ddl" + IdentifierValue + "").append("<option value='" + a + "'>" + drpOption[a] + "</option>");
    }

    if (FieldType === 'DateTime') {
        $("#ui_txt" + IdentifierValue).datepicker({
            prevText: "click for previous months",
            nextText: "click for next months",
            showOtherMonths: true,
            selectOtherMonths: false,
            maxDate: "0"
        });
    }
}
$("#addcontactcheck").click(function () {
    if ($(this).is(":checked")) {
        $("#dvAddcontact").removeClass("hideDiv");
    } else {
        $("#dvAddcontact").addClass("hideDiv");
    }
});

function InitialiseDatePicker() {
    $("#ui_txtFromDate").datepicker({
        prevText: "click for previous months",
        nextText: "click for next months",
        showOtherMonths: true,
        selectOtherMonths: false,
        maxDate: "0"
    });

    $("#ui_txtToDate").datepicker({
        prevText: "click for previous months",
        nextText: "click for next months",
        showOtherMonths: true,
        selectOtherMonths: false,
        maxDate: "0"
    });
}

function GetLmsSources() {
    $.ajax({
        url: "/Prospect/Leads/LmsGroupsList",
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var optValue = [], optName = [];
            if (response != undefined && response != null && response.length > 0) {
                $.each(response, function () {
                    optValue.push($(this)[0].LmsGroupId);
                    optName.push($(this)[0].Name);
                });
            }
            BindLmsFields("Sources", optValue, optName);
            GetLmsStages();
        },
        error: ShowAjaxError
    });
}

function GetLmsStages() {
    $.ajax({
        url: "/Prospect/Leads/GetStageScore",
        dataType: "json",
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataFilter: function (data) { return data; },
        success: function (response) {
            //if (response.AllStages != null && response.AllStages.length > 0) {
            //    allStageDetails = response.AllStages;
            //}
            var optValue = [], optName = [];
            if (response.StagesList != null && response.StagesList.length > 0) {
                $.each(response.StagesList, function (i) {
                    optValue.push($(this)[0].Score);
                    optName.push($(this)[0].Stage);
                });
            }
            BindLmsFields("Stages", optValue, optName);
            GetLmsUsers();
        },
        error: ShowAjaxError
    });
}

function GetLmsUsers() {
    $.ajax({
        url: "/Prospect/Leads/GetUser",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (userDetails) {
            var optValue = [], optName = [];
            if (userDetails != null && userDetails != null && userDetails.length > 0) {
                $.each(userDetails, function (i) {
                    optValue.push($(this)[0].UserInfoUserId);
                    optName.push($(this)[0].FirstName + " (" + $(this)[0].EmailId + ")");

                });
            }
            BindLmsFields("HandledBy", optValue, optName);
        },
        error: ShowAjaxError
    });
}

function BindLmsFields(FieldName, OptionValue, OptionName) {
    var LmsField = '', IdentifierValue = FieldName;
    if (FieldName.toLowerCase() == 'sources') {
        LmsField = `<div class="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                            <div class="form-group">
                                                <label class="frmlbltxt" for="">${FieldName}</label>
                                                <select class="form-control form-control-sm" id="ui_ddl${FieldName}">
                                                    <option value="0">Select Source</option>
                                                </select>
                                            </div>
                                        </div>`;
    }
    else if (FieldName.toLowerCase() == 'stages') {
        LmsField = `<div class="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                            <div class="form-group">
                                                <label class="frmlbltxt" for="">${FieldName}</label>
                                                <select class="form-control form-control-sm" id="ui_ddl${FieldName}">
                                                    <option value="-1">Select Stage</option>
                                                </select>
                                            </div>
                                        </div>`;
    }
    else {
        LmsField = `<div class="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                            <div class="form-group">
                                                <label class="frmlbltxt" for="">${FieldName}</label>
                                                <select class="form-control form-control-sm" id="ui_ddl${FieldName}">
                                                    <option value="0">Select Handled By</option>
                                                </select>
                                            </div>
                                        </div>`;
    }
    $("#dvField1").append(LmsField);

    if (OptionName != null && OptionName.length > 0) {
        for (var i = 0; i < OptionName.length; i++) {
            $("#ui_ddl" + IdentifierValue).append("<option value='" + OptionValue[i] + "'>" + OptionName[i] + "</option>");
        }
    }

    $("#ui_ddl" + IdentifierValue).select2({
        minimumResultsForSearch: '',
        dropdownAutoWidth: false,
        containerCssClass: "border"
    });
}