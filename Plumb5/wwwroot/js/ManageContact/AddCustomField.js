var fieldConfig = { Id: 0, FieldName: "", FieldType: 0, SubFields: "", IsEditable: true, IsMandatory: false };
var CustomFields = [];
var CustomFieldsCount = 0;

$(document).ready(function () {
    GetPropertiesCustomFields();
    BindCustomFields();
});

function GetPropertiesCustomFields() {
    $.ajax({
        url: "/ManageContact/ContactField/GetProperties",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            CustomFields = response;
        },
        error: ShowAjaxError
    });
}

$("#ui_btnAddField").click(() => {

    if (CustomFieldsCount >= 100) {
        ShowErrorMessage(GlobalErrorList.ContactCustomField.customfieldlimit);
        return false;
    }

    if ($("#ui_txtFieldName").val().length == 0) {
        ShowErrorMessage(GlobalErrorList.ContactCustomField.fieldname);
        $("#ui_txtFieldName").focus();
        return false;
    }

    if (Fieldvalidation())
        return false;

    if ($("#ui_ddlFieldType").val() == "3" || $("#ui_ddlFieldType").val() == "4" || $("#ui_ddlFieldType").val() == "5") {
        if ($("#ui_txtFieldOptions").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.ContactCustomField.fieldOptions);
            $("#ui_txtFieldOptions").focus();
            return false;
        }
    }

    if ($("#ui_radMandatory").is(":checked"))
        fieldConfig.IsMandatory = true;
    else
        fieldConfig.IsMandatory = false;

    fieldConfig.FieldName = CleanText($("#ui_txtFieldName").val());
    fieldConfig.FieldType = parseInt($("#ui_ddlFieldType").val());
    fieldConfig.SubFields = CleanText($("#ui_txtFieldOptions").val().replace(/\n|\r/g, ""));

    $.ajax({
        url: "/ManageContact/ContactField/SaveOrUpdateDetails",
        type: 'POST',
        data: JSON.stringify({ 'fieldConfig': fieldConfig }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.ContactFields.Id == -1) {
                ShowErrorMessage(GlobalErrorList.ContactCustomField.filedExistsDatabase);
            }
            else if (response.ContactFields.Id > 0) {
                try {
                    ShowSuccessMessage(GlobalErrorList.ContactCustomField.customfieldSuccess);
                    ClearCustomFiledsValues();
                    BindCustomFields();
                    //CallBackCustomFieldResponse(response.ContactFields);

                }
                catch (ex) {
                    console.log(ex);
                }
            }
            fieldConfig.Id = 0;
        },
        error: ShowAjaxError
    });
});

function Fieldvalidation() {
    for (var i = 0; i < CustomFields.length; i++) {
        if ($("#ui_txtFieldName").val().toLowerCase().replace(/ /g, '') == CustomFields[i].toLowerCase()) {
            ShowErrorMessage(GlobalErrorList.ContactCustomField.fieldAlreadyExists);
            $("#ui_txtFieldName").focus();
            return true;
        }
    }
    return false;
}

function BindCustomFields() {
    $.ajax({
        url: "/General/GetContactExtraField",
        type: 'Post',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            var reportTableTrs, FieldType = '';
            if (response != null && response.length > 0) {
                CustomFieldsCount = response.length;
                $.each(response, function (k) {
                    if (this.FieldType == 1)
                        FieldType = 'Text Box';
                    else if (this.FieldType == 2)
                        FieldType = 'Multiline';
                    else if (this.FieldType == 3)
                        FieldType = 'DropDown';
                    else if (this.FieldType == 4)
                        FieldType = 'Radio Button';
                    else if (this.FieldType == 5)
                        FieldType = 'Checkbox';
                    else if (this.FieldType == 6)
                        FieldType = 'Date';

                    var mandatory = this.IsMandatory ? "Yes" : "No";

                    var sl = k + 1;
                    reportTableTrs += "<tr>" +
                        "<td style='cursor: pointer;' title='Copy To Clipboard' onclick='copyToClipboard(\"CustomField" + sl + "\")' class='text-left'>" + sl + "</td>" +
                        "<td class='text-left td-icon'>" + this.FieldName + "</td>" +
                        "<td>" + FieldType + "</td>" +
                        "<td>" + mandatory + "</td>" +
                        "<td><i class='icon ion-edit' onclick='EditCustomFields(\"" + this.FieldName + "\",\"" + this.FieldType + "\"," + this.IsMandatory + "," + this.Id + ",\"" + this.SubFields + "\");'></i></td>" +
                        /* "<td class='unselectable'><i class='icon ion-android-delete' onclick='DeleteCustomFieldConfirm(" + this.Id + ")' ></i></td>" + //*/
                        "<td class='unselectable'><i style = ' cursor: not-allowed' class='icon ion-android-delete'></i></td>" + //
                        "</tr>";
                });
                $("#ui_tblCustomFieldReportData").removeClass('no-data-records');
                $("#ui_tbodyCustomFieldReportData").html(reportTableTrs);
            }
            else
                $("#ui_tbodyCustomFieldReportData").html('<tr><td colspan="4" class="border-bottom-none"><div class="no-data">There is no data for this view</div></td></tr>');
        },
        error: ShowAjaxError
    });
}

function EditCustomFields(FieldName, FieldType, IsMandatory, Id, FieldOptions) {
    $("#ui_txtFieldName").val(FieldName);
    $("#ui_ddlFieldType").val(FieldType);
    if (IsMandatory)
        $('#ui_radMandatory').prop('checked', 'true');
    else
        $('#ui_radNotMandatory').prop('checked', 'true');
    fieldConfig.Id = Id;
    if (FieldType == 3 || FieldType == 4 || FieldType == 5) {
        $(".optionField").removeClass("hideDiv");
        $("#ui_txtFieldOptions").val(FieldOptions);
    }
    else {
        $(".optionField").addClass("hideDiv");
    }

    $(".popupbody").animate({
        scrollTop: 0
    }, "slow");
}

function DeleteCustomFieldConfirm(Id) {
    $("#deleteCustomfield").show();
    $('#deleteCustomfield').css('background-color', 'rgba(0, 0, 0, 0.5)');
    $("#deleteCustomfieldRowConfirm").attr("onclick", "DeleteCustomField(" + Id + ");");
}

function DeleteCustomField(Id) {
    $("#deleteCustomfield").hide();
    ShowPageLoading();
    $.ajax({
        url: "/ManageContact/ContactField/Delete",
        type: 'POST',
        data: JSON.stringify({ 'Id': Id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result) {
                ShowSuccessMessage("Deleted Successfully");

                HidePageLoading();
            }
            BindCustomFields();
        },
        error: ShowAjaxError
    });
}

$('#cancelCustomfieldRowConfirm,#customfieldclose').click(function () {
    $("#deleteCustomfield").hide();
});

$("#ui_ddlFieldType").change(function () {
    if ($(this).val() == "1" || $(this).val() == "2" || $(this).val() == "6")
        $(".optionField").addClass("hideDiv");
    else
        $(".optionField").removeClass("hideDiv");
});

function ClearCustomFiledsValues() {
    fieldConfig.Id = 0;
    $("#ui_txtFieldName,#ui_txtFieldOptions").val("");
    $("#ui_ddlFieldType").val("1");
    $('#ui_radNotMandatory').prop('checked', 'true');
    $(".optionField").addClass("hideDiv");
}

$("#clearCustomFields").click(function () {
    ClearCustomFiledsValues();
})

//Manage Custom Fields
function ShowManageCustomFields() {
    $(".popuptitle h6").html("Manage Custom Fields");
    $("#dv_addcustfield").removeClass("hideDiv");
}

function openManageCustomFields() {
    $(".popuptitle h6").html("Manage Custom Fields");
    $("#dv_addcustfield").removeClass("hideDiv");
}

$("#close-custfieldpopup").click(function () {
    ClearCustomFiledsValues();
    $("#dv_addcustfield").addClass("hideDiv");
})

function copyToClipboard(value) {
    var tempInput = document.createElement("input");
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}