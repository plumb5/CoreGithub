var RowId = 0, EventId = 0, dropdownfilterSearchValue = '', SearchTextValue = '';
var fieldType = ["Text Box", "Multiline", "DropDown", "Radio Button", "Checkbox", "Date"];
var fieldConfig = { Id: 0, FieldName: "", FieldType: 0, SubFields: "", IsEditable: 1, IsMandatory: 0 };
var Fields = new Array();
var allContactField = new Array();
var update = 0,UpdateId=0;

$(document).ready(function () {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    GetReport();
    GetPropertiesFields();
});


function GetReport() {

    $.ajax({
        url: "/ManageContact/CustomField/GetAllFieldDetails",
        type: 'Post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(),
        success: BindReport,
        error: ShowAjaxError
    });
}
function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
    if (response != undefined && response != null) {

        var reportTableTrs;
        $.each(response, function () {

            UpdateAllFieldsinJs(this.Id, this.FieldName, this.FieldType, this.SubFields, this.IsEditable, this.IsMandatory);

            reportTableTrs += "<tr id=tr_" + this.Id + ">" +
                "<td class='m-p-w-140 text-left'><p>" + this.FieldName + "</p><div class='editDeleteWrap'><button data-colheadTitle='Edit Custom Field' class='td-edit editEventTrack popViewHref' onclick='ShowEventEditPopup(" + this.Id + "," + this.Id + ");'>Edit</button> <button data-toggle='modal' data-target='#deleterow' class='td-delete delEventTrack' onclick='ShowDeletePopup(" + this.Id + "," + this.Id + ");'>Delete</button></div></td>" +
                "<td class='m-p-w-170'>" + fieldType[parseInt(this.FieldType) - 1] + "</td>" +
                "<td>" + (this.IsMandatory == true ? "Yes" : "No") + "</td>" +
                '<td>' + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.CreateDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.CreateDate)) + '</td>' +
                "</tr>";
        });

        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        //ShowEventEditPopup(1, 1);
    }

    HidePageLoading();
}


$("#btnUpdate").click(function () {
    addUpdateField(1);
});
$("#btnCancel").click(function () {
    $(".rightPopupwrap").removeClass('showFlx');
});

function addUpdateField(getupdate) {

    //update = getupdate;
    if ($("#ui_txtFieldName").val().length == 0) {
        ShowErrorMessage(GlobalErrorList.CustomField.fieldname);
        return;
    }

    if (Fieldvalidation())
        return false;

    if ($("#ui_ddlFieldType").val() == "3" || $("#ui_ddlFieldType").val() == "4" || $("#ui_ddlFieldType").val() == "5") {

        if ($("#ui_txtFieldOptions").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.CustomField.fieldOptions);
            return;
        }
    }


    fieldConfig.Id = UpdateId;
    fieldConfig.FieldName = CleanText($("#ui_txtFieldName").val());
    fieldConfig.FieldType = $("#ui_ddlFieldType").val();
    fieldConfig.SubFields = $("#ui_txtFieldOptions").val();
    fieldConfig.UserInfoUserId = 0;
    fieldConfig.UserGroupId =0;
    fieldConfig.CreateDate = null;
    fieldConfig.IsEditable = false;
    fieldConfig.HideField = 1;
    fieldConfig.IsMandatory = false;

    if ($("#ui_radMandatory").is(":checked"))
        fieldConfig.IsMandatory = 1;
    else
        fieldConfig.IsMandatory = 0;

    $.ajax({
        url: "/ManageContact/CustomField/SaveOrUpdateDetails",
        type: 'POST',
        data: JSON.stringify({ 'fieldConfig': fieldConfig }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.ContactFields.Id == -1) {
                ShowErrorMessage(GlobalErrorList.CustomField.filedExistsDatabase);
            }
            else if (response.ContactFields.Id > 0) {
                if (update == 1) {

                    if (response.Result) {
                        fieldConfig = response.ContactFields;
                        UpdateAllFieldsinJs(fieldConfig.Id, fieldConfig.FieldName, fieldConfig.FieldType, fieldConfig.SubFields, fieldConfig.IsEditable, fieldConfig.IsMandatory);

                        ShowSuccessMessage(GlobalErrorList.CustomField.updatefieldSuccess);
                        $("#btnCancel").click();
                    }
                    else {
                        ShowErrorMessage(GlobalErrorList.CustomField.fieldAlreadyExists);
                    }
                }
                else {
                    fieldConfig = response.ContactFields;
                    UpdateAllFieldsinJs(fieldConfig.Id, fieldConfig.FieldName, fieldConfig.FieldType, fieldConfig.SubFields, fieldConfig.IsEditable, fieldConfig.IsMandatory);
                    ShowSuccessMessage(GlobalErrorList.CustomField.customfieldSuccess);
                    $("#btnCancel").click();
                }

                GetReport();
            }
        },
        error: ShowAjaxError
    });
}

var rowactiveBg;
function ShowEventEditPopup(rowId, eventId) {

    if (rowId == 0) {
        UpdateId = 0;
        update = 0;
        $("#spnTitle").html("ADD CUSTOM FIELD");
        $("#btnUpdate").html("ADD");
    }
    else {
        UpdateId = eventId;
        update = 1;
        $("#spnTitle").html("EDIT CUSTOM FIELD");
        $("#btnUpdate").html("UPDATE");
    }

    $("#ui_txtFieldName").val("");
    $("#ui_ddlFieldType").val(1).change();
    $("#ui_txtFieldOptions").val("");

        var colHeadVal = $(this).attr("data-colheadTitle");
        var checkTableName = $(this).closest('table').attr('id');
        var rowCount = $("#" + checkTableName + " tbody tr").length;


        if (rowCount <= 5) {
            $(".topbandWrap h6").html(colHeadVal);
            $("#" + checkTableName).parents(".tableWrapper").addClass("h-400");
            $(".rightPopupwrap").addClass('showFlx');
            $(".popupslideItem").addClass('show');
            $(".tbl-pageVisits, .tbl-sources, .tbl-searchkey, .tbl-cities").addClass('hideDiv');
            $(".tbl-eventTrack").removeClass('hideDiv');
        } else {
            $(".topbandWrap h6").html(colHeadVal);
            $(".rightPopupwrap").addClass('showFlx');
            $(".popupslideItem").addClass('show');
            $(".tbl-pageVisits, .tbl-sources, .tbl-searchkey, .tbl-cities").addClass('hideDiv');
            $(".tbl-eventTrack").removeClass('hideDiv');
        }
        EditField(eventId);

}

function ShowDeletePopup(rowid, eventid) {
    $("#tr_" + rowid + "").addClass('activeBgRow');
    EventId = eventid;
}

$("#deleteRowConfirm").click(function () {

    $.ajax({
        url: "/ManageContact/CustomField/Delete",
        type: 'POST',
        data: JSON.stringify({ 'Id': EventId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result) {
                $("#tr_" + EventId).hide("slow");
                ShowSuccessMessage(GlobalErrorList.CustomField.deletefieldSuccess);

            }
            else {
                ShowErrorMessage(GlobalErrorList.CustomField.error);
            }

        },
        error: ShowAjaxError
    });
});
$(".topbandWrap i.ion-android-close").click(function () {
    $(this).parents('.rightPopupwrap').removeClass('showFlx');
    $(rowactiveBg).removeClass("activeBgRow");
    if ($(".tableWrapper").hasClass("h-400")) {
        $(".tableWrapper").removeClass("h-400");
    }
});

function GetPropertiesFields() {
    $.ajax({
        url: "/ManageContact/CustomField/GetProperties",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            Fields = response;
        },
        error: ShowAjaxError
    });
}

function Fieldvalidation() {
    for (var i = 0; i < Fields.length; i++) {

        if ($("#ui_txtFieldName").val().toLowerCase().replace(/ /g, '') == Fields[i].toLowerCase()) {
            ShowErrorMessage("This field already exists as a default field.Please create a new field");
            $("#ui_txtFieldName").focus();
            return true;
        }
    }
    return false;
}

function UpdateAllFieldsinJs(Id, FieldName, FieldType, SubFields, IsEditable, IsMandatory) {

    var temField = new Array();
    temField.Id = Id;
    temField.FieldName = FieldName;
    temField.FieldType = FieldType;
    temField.SubFields = SubFields;
    temField.IsEditable = IsEditable;
    temField.IsMandatory = IsMandatory;

    for (var index = 0; index < allContactField.length; index++) {
        if (allContactField[index].Id == Id) {
            allContactField.splice(index, 1);
            break;
        }
    }
    allContactField.push(temField);
}

$("#ui_ddlFieldType").change(function () {

    if ($(this).val() == "1" || $(this).val() == "2" || $(this).val() == "6")
        $("#tr_FieldOptions").hide();
    else
        $("#tr_FieldOptions").show();

});



function EditField(FieldId) {
    var tempData;
    for (var index = 0; index < allContactField.length; index++) {
        if (allContactField[index].Id == FieldId) {
            tempData = allContactField[index];
            break;
        }
    }

    if (tempData) {
        $("#ui_txtFieldName").val(tempData.FieldName);
        $("#ui_ddlFieldType").val(tempData.FieldType).change();
        $("#ui_txtFieldOptions").val(tempData.SubFields);

        if (tempData.IsMandatory)
            $("#ui_radMandatory").prop("checked", true);
        else
            $("#ui_radNotMandatory").prop("checked", true);
    }
}