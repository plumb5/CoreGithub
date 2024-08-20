
var EventPropertyList = [];

//var EventPropertyList = [
//    { P5ColumnName: 'EventName', FrontEndName: 'EventName', FieldMappingType: 'string' },
//    { P5ColumnName: 'EmailId', FrontEndName: 'Email-Id', FieldMappingType: 'string' },
//    { P5ColumnName: 'PhoneNumber', FrontEndName: 'PhoneNumber', FieldMappingType: 'string' },
//    { P5ColumnName: 'EventDate', FrontEndName: 'EventDate', FieldMappingType: 'string' }
//];

var uploadedFormData = typeof window.FormData == "undefined" ? [] : new window.FormData();
var uploadedFileData;
var fileColumnMappingList = [];
var ImportFileColumnMapping = [];

var ddlIdPrefix = "ui_ddl_Match_";
var tdIdPrefix = "ui_td_FileField_Matched_";
var matchIconSpanIdPrefix = "ui_span_FileField_Matched_";
var contactDropDownDivIdPrefix = "ui_div_ContactDropDown_";
var fieldIgnoreDivIdPrefix = "ui_div_IgnoreMap_";
var fieldIgnoreCancelIconIdPrefix = "ui_div_IgnoreCancel_";
var fieldMarkIgnoreIdPrefix = "ui_aMarkFiledIgnore_";
var datatypeDropDownDivIdPrefix = "ui_div_DataTypeDropDown_";
var ddlDataTypeIdPrefix = "ui_ddl_datatype_Match_";
var fresheventorrepeatevent = "";

var matchIconCheckBoxIdPrefix = "ui_chk_FileField_Matched_";

$(document).ready(function () {
    CustomEventImportStep1Util.Initialization();
});

//#region CustomEventImportStart->Step1

var CustomEventImportStep1Util = {
    Initialization: function () {
        $("#ui_h6ImportPagetitle").html("Start Imports");
        $("[id^='ui_sectionCustomEventImport_']").addClass('hideDiv');
        $("#ui_btnCustomEventImport_Start_Next").addClass('disableDiv');
        $("#ui_sectionCustomEventImport_Start").removeClass('hideDiv');
        HidePageLoading();
        //CustomEventImportStep1Util.GetContactProperties();
    },
    GetContactProperties: function () {
        $.ajax({
            url: "/CustomEvents/EventImport/GetCustomEventExtraProperties",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    for (var i = 0; i < response.length; i++) {
                        var ContactPropertyItem = { P5ColumnName: "", FrontEndName: "", FieldMappingType: "", IsNewField: false };
                        ContactPropertyItem.P5ColumnName = response[i].FieldName;
                        ContactPropertyItem.FrontEndName = response[i].FieldName;
                        ContactPropertyItem.FieldMappingType = response[i].FieldMappingType;
                        EventPropertyList.push(ContactPropertyItem);
                    }
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    CreateImportFormData: function (fileData) {
        ShowPageLoading();
        $("#ui_btnCustomEventImport_Start_Next").addClass('disableDiv');
        //$("#ui_divImportFileDetails").addClass('hideDiv');
        uploadedFileData = fileData;
        var fileValidationResult = CustomEventImportStep1Util.validateFile();
        if (fileValidationResult == "success") {
            var uploadedFileName = uploadedFileData.name;
            var uploadedFileSizeInKb = ((uploadedFileData.size) / 1024).toFixed(2);

            $("#ui_pImportFileName").html(uploadedFileName + " has uploaded and the size of file is ");
            $("#ui_pImportFileSize").html(uploadedFileSizeInKb + "KB");

            $("#ui_divImportFileDetails").removeClass('hideDiv');
            $("#ui_btnCustomEventImport_Start_Next").removeClass('disableDiv');
        }
        else {
            ShowErrorMessage(fileValidationResult);
        }

        HidePageLoading();
    },
    validateFile: function () {
        if (uploadedFileData != undefined && uploadedFileData != null) {
            var uploadedFileExtension = uploadedFileData.name.split('.').pop().toLowerCase();
            if (uploadedFileExtension == "csv" || uploadedFileExtension == "xls" || uploadedFileExtension == "xlsx") {
                var uploadedFileSizeInMb = (((uploadedFileData.size) / 1024) / 1024).toFixed(2);
                if (uploadedFileSizeInMb <= 100) {
                    return "success";
                } else {
                    return (GlobalErrorList.CustomEventImport.largeFileSize);
                }
            } else {
                return (GlobalErrorList.CustomEventImport.inValidFileType);
            }
        } else {
            return (GlobalErrorList.CustomEventImport.fileUploadError);
        }
    },
    ContactImportInitiate: function () {
        uploadedFormData = typeof window.FormData == "undefined" ? [] : new window.FormData();

        if (typeof window.FormData == "undefined") {
            uploadedFormData.push('ContactFile', uploadedFileData);
        }
        else {
            uploadedFormData.append('ContactFile', uploadedFileData);
        }

        //Areas Coming from AccountMaster.js global variable 

        $.ajax({
            url: "/CustomEvents/EventImport/InitiateImport?ImportSource=" + Areas + "",
            type: 'POST',
            data: uploadedFormData,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function (response) {
                if (response.Status) {

                    var ContactPropertyItem = { P5ColumnName: "", FrontEndName: "", FieldMappingType: "", IsNewField: false };

                    if (response.eachfieldslist != null && response.eachfieldslist != "" && response.eachfieldslist.length > 0) {
                        for (var i = 0; i < response.eachfieldslist.length; i++) {
                            var ContactPropertyItem = { P5ColumnName: "", FrontEndName: "", FieldMappingType: "", IsNewField: false };
                            ContactPropertyItem.P5ColumnName = response.eachfieldslist[i].P5ColumnName;
                            ContactPropertyItem.FrontEndName = response.eachfieldslist[i].FrontEndName;
                            ContactPropertyItem.FieldMappingType = response.eachfieldslist[i].FieldMappingType;
                            ContactPropertyItem.IsNewField = response.eachfieldslist[i].IsNewField;
                            EventPropertyList.push(ContactPropertyItem);
                        }
                    }
                    CustomEventImportStep2Util.BindImportColumnMapping(response.returnDataSet, response.fresheventorrepeatevent, response.customdatatypelist);
                }
                else {
                    ShowErrorMessage(response.Message);
                    $("#ui_sectionCustomEventImport_Start").removeClass('hideDiv');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    }
}

$('.strtimpinfo').popover({
    trigger: 'hover',
    placement: 'top'
});

$("#ui_divFileImportDrop").on('dragenter', function (e) {
    e.preventDefault();
    $(this).css('background', 'rgb(230, 236, 168)');
});

$("#ui_divFileImportDrop").on('dragover', function (e) {
    e.preventDefault();
});

$("#ui_divFileImportDrop").on('drop', function (e) {
    $(this).css('background', 'rgb(246, 249, 209)');
    e.preventDefault();
    var file = e.originalEvent.dataTransfer.files[0];
    CustomEventImportStep1Util.CreateImportFormData(file);
});

$("#ui_btnFileImportChoose").click(function (e) {
    e.stopPropagation();
    e.preventDefault();
    $("#ui_fileContactImport").click();
});

$("#ui_fileContactImport").change(function () {
    var file = $(this)[0].files[0];
    CustomEventImportStep1Util.CreateImportFormData(file);
});

$("#ui_divCloseImportFileDetails").click(function () {
    $("#ui_btnCustomEventImport_Start_Next").addClass('disableDiv');
    uploadedFileData = null;
    $("#ui_fileContactImport").val('');
    $("#ui_pImportFileName").html('');
    $("#ui_pImportFileSize").html('');
    $("#ui_divImportFileDetails").addClass('hideDiv');
});

$("#ui_btnCustomEventImport_Start_Next").click(function () {
    ShowPageLoading();
    $("[id^='ui_sectionCustomEventImport_']").addClass('hideDiv');
    $("#ui_chkIgnoreUnMatched").prop('checked', false);
    CustomEventImportStep1Util.ContactImportInitiate();
});

$("#ui_btnContactSampleDownLoad").click(function () {
    ShowPageLoading();
    var ColumnsList = [];
    for (var i = 0; i < EventPropertyList.length; i++) {
        ColumnsList.push(EventPropertyList[i].FrontEndName);
    }

    $.ajax({
        url: "/ManageContact/ContactImportOverViews/SampleContactFileForImport",
        type: 'POST',
        data: JSON.stringify({
            'AccountId': Plumb5AccountId, 'Columns': ColumnsList, 'IsExtraFieldNeed': false
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status) {
                window.location.assign(response.MainPath);
            }
            else {
                ShowErrorMessage(GlobalErrorList.ExportData.session_expired);
                setTimeout(function () { window.location.href = "/Login"; }, 3000);
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});

//#endregion CustomEventImportStart->Step1

//#region CustomEventImportMapping->Step2

var CustomEventImportStep2Util = {
    BindImportColumnMapping: function (response, fresheventorrepeatevent, customdatatypelist) {
        fileColumnMappingList = [];

        if (response != undefined && response != null && response.Sheet1 != undefined && response.Sheet1 != null && response.Sheet1.length > 0) {
            var firstRow = response.Sheet1[0];
            $.each(firstRow, function (key, value) {
                var fileColumnMapping = { FileFieldName: "", P5ColumnName: "", FrontEndName: "", IsAutoMatch: false, FieldMappingType: "" };
                fileColumnMapping.FileFieldName = key;
                var matchingDetails = CustomEventImportStep2Util.IsColumnMatching(key);
                fileColumnMapping.IsAutoMatch = matchingDetails[0];
                fileColumnMapping.P5ColumnName = matchingDetails[1];
                fileColumnMapping.FrontEndName = matchingDetails[2];
                fileColumnMapping.FieldMappingType = matchingDetails[3];
                fileColumnMappingList.push(fileColumnMapping);
            });

            var loopCount = response.Sheet1.length > 2 ? 3 : response.Sheet1.length;

            $("#ui_tbodyReportData").html("");
            for (var i = 0; i < fileColumnMappingList.length; i++) {

                var eachFileField = fileColumnMappingList[i].FileFieldName;
                var IsAutoMatch = fileColumnMappingList[i].IsAutoMatch;

                var eachFieldDropDown = CustomEventImportStep2Util.CreatePlumb5FieldDropDown(ddlIdPrefix + i, fileColumnMappingList[i].IsAutoMatch, fileColumnMappingList[i].P5ColumnName, fileColumnMappingList[i].FrontEndName);

                var uploaddatatypevalue = "";
                var existingdatatype = "";
                var IsAutoMatchDataType = false;

                var eventfielddetails = JSLINQ(EventPropertyList).Where(function () {
                    return (this.FrontEndName == eachFileField);
                });

                var drpfielddetails = JSLINQ(customdatatypelist).Where(function () {
                    return (this.FieldName == eachFileField);
                });

                if (drpfielddetails.items[0] != undefined && drpfielddetails.items[0].ExistingDataType != null && drpfielddetails.items[0].ExistingDataType != "" && drpfielddetails.items[0].ExistingDataType.length > 0) {
                    if (drpfielddetails.items[0].ExistingDataType != "NA")
                        existingdatatype = drpfielddetails.items[0].ExistingDataType;
                    else
                        existingdatatype = "";
                }

                if (drpfielddetails.items[0] != undefined && drpfielddetails.items[0].UploadedDataType != null && drpfielddetails.items[0].UploadedDataType != "" && drpfielddetails.items[0].UploadedDataType.length > 0) {
                    if (drpfielddetails.items[0].UploadedDataType != "NA") {
                        uploaddatatypevalue = drpfielddetails.items[0].UploadedDataType;
                        var eachDataTypeDropDown = CustomEventImportStep2Util.CreateUploadedDataTypeDropDown(ddlDataTypeIdPrefix + i, drpfielddetails.items[0].UploadedDataType, true);
                    }
                    else {
                        uploaddatatypevalue = "NA";
                        var eachDataTypeDropDown = CustomEventImportStep2Util.CreateUploadedDataTypeDropDown(ddlDataTypeIdPrefix + i, "", false);
                    }
                }
                else {
                    uploaddatatypevalue = "NA";
                    var eachDataTypeDropDown = CustomEventImportStep2Util.CreateUploadedDataTypeDropDown(ddlDataTypeIdPrefix + i, "", false);
                }

                if (fresheventorrepeatevent) {
                    if (uploaddatatypevalue != "NA")
                        IsAutoMatchDataType = true;
                    else if (uploaddatatypevalue == "NA")
                        IsAutoMatchDataType = false;
                }
                else {
                    if (eventfielddetails.items[0] != undefined && eventfielddetails.items[0].IsNewField != null) {
                        if (eventfielddetails.items[0].IsNewField) {
                            if (uploaddatatypevalue != "NA")
                                IsAutoMatchDataType = true;
                            else if (uploaddatatypevalue == "NA")
                                IsAutoMatchDataType = false;
                        }
                        else {
                            if (existingdatatype == uploaddatatypevalue)
                                IsAutoMatchDataType = true;
                            else if (existingdatatype != uploaddatatypevalue)
                                IsAutoMatchDataType = false;
                        }
                    }
                    else {
                        if (existingdatatype == uploaddatatypevalue)
                            IsAutoMatchDataType = true;
                        else if (existingdatatype != uploaddatatypevalue)
                            IsAutoMatchDataType = false;
                    }
                }

                var previewValue = "";
                for (var j = 0; j < loopCount; j++) {
                    previewValue += response.Sheet1[j][eachFileField] + "<br/>";
                }
                previewValue = previewValue.substring(0, previewValue.lastIndexOf("<br/>"));
                var reportTableTrs = $(document.createElement('tr'));

                if (IsAutoMatch && IsAutoMatchDataType)
                    $(reportTableTrs).append("<td class='text-center'><input style='display: none;' type='checkbox' id='" + matchIconCheckBoxIdPrefix + i + "' readonly='readonly' disabled='disabled' checked /><span id='" + matchIconSpanIdPrefix + i + "' class='circle'></span></td>");
                else
                    $(reportTableTrs).append("<td class='text-center'><input style='display: none;' type='checkbox' id='" + matchIconCheckBoxIdPrefix + i + "' readonly='readonly' disabled='disabled' /><span id='" + matchIconSpanIdPrefix + i + "' class='circle nomatch'></span></td>");

                var NewField = "";
                if (eventfielddetails.items[0] != undefined && eventfielddetails.items[0].IsNewField != null) {
                    if (eventfielddetails.items[0].IsNewField) {
                        NewField = "<sup class='newtext'>New</sup>";
                    }
                }

                $(reportTableTrs).append("<td id='" + tdIdPrefix + i + "'>" + eachFileField + " " + NewField + "</td>");

                //Existing Data Type binding here
                if (fresheventorrepeatevent)
                    $(reportTableTrs).append("<td></td>");
                else
                    $(reportTableTrs).append("<td>" + existingdatatype + "</td>");

                var reportTableTds = $(document.createElement('td'));
                var reportTableDivs = $(document.createElement('div'));
                $(reportTableDivs).prop("id", datatypeDropDownDivIdPrefix + i);
                $(reportTableDivs).addClass('addfieldsWrap');
                $(reportTableDivs).append(eachDataTypeDropDown);
                $(reportTableTds).append(reportTableDivs);
                // $(reportTableTds).append("<div id='" + fieldIgnoreDivIdPrefix + i + "' class='addignorewrap hideDiv'><i id='" + fieldIgnoreCancelIconIdPrefix + i + "' class='icon ion-android-close'></i>Ignore this fields</div>");
                $(reportTableTrs).append(reportTableTds);

                $(reportTableTrs).append("<td>" + previewValue + "</td>");

                var reportTableTds = $(document.createElement('td'));
                var reportTableDivs = $(document.createElement('div'));
                $(reportTableDivs).prop("id", contactDropDownDivIdPrefix + i)
                $(reportTableDivs).addClass('addfieldsWrap');
                $(reportTableDivs).append(eachFieldDropDown);
                $(reportTableTds).append(reportTableDivs);
                $(reportTableTds).append("<div id='" + fieldIgnoreDivIdPrefix + i + "' class='addignorewrap hideDiv'><i id='" + fieldIgnoreCancelIconIdPrefix + i + "' class='icon ion-android-close'></i>Ignore this fields</div>");
                $(reportTableTrs).append(reportTableTds);
                //$(reportTableTrs).append("<td class='text-center addradiusdrop'><div class='dropdown'><i class='icon ion-android-more-horizontal icon-fontsize24' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'></i><div class='dropdown-menu dropdown-menu-right' aria-labelledby='filterTags'><div class='visitfiltWrap'><a class='dropdown-item addcustfields' href='javascript:void(0)'>Add New Fields</a><a  id='" + fieldMarkIgnoreIdPrefix + i + "' class='dropdown-item ignorefields' href='javascript:void(0)'>Ignore Fields</a></div></div></div></td>");
                $(reportTableTrs).append("<td class='text-center addradiusdrop'><div class='dropdown'><i class='icon ion-android-more-horizontal icon-fontsize24' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'></i><div class='dropdown-menu dropdown-menu-right' aria-labelledby='filterTags'><div class='visitfiltWrap'><a id='" + fieldMarkIgnoreIdPrefix + i + "' class='dropdown-item ignorefields' href='javascript:void(0)'>Ignore Fields</a></div></div></div></td>");

                $("#ui_tbodyReportData").append(reportTableTrs);

                if (!fresheventorrepeatevent) {
                    if (uploaddatatypevalue != null && uploaddatatypevalue != "" && uploaddatatypevalue != undefined && uploaddatatypevalue != "NA" && uploaddatatypevalue.length > 0) {
                        $("#" + ddlDataTypeIdPrefix + i).prop("disabled", true);
                    }
                }

                if (eachFileField.toLowerCase() == "eventname")
                    $("#" + ddlDataTypeIdPrefix + i).prop("disabled", true);
                else if (eachFileField.toLowerCase() == "email-id")
                    $("#" + ddlDataTypeIdPrefix + i).prop("disabled", true);
                else if (eachFileField.toLowerCase() == "phonenumber")
                    $("#" + ddlDataTypeIdPrefix + i).prop("disabled", true);
                else if (eachFileField.toLowerCase() == "eventtime")
                    $("#" + ddlDataTypeIdPrefix + i).prop("disabled", true);


                if (IsAutoMatch && eachFileField.toLowerCase() == "eventname")
                    $("#" + ddlIdPrefix + i).prop("disabled", true);
                else if (IsAutoMatch && eachFileField.toLowerCase() == "email-id")
                    $("#" + ddlIdPrefix + i).prop("disabled", true);
                else if (IsAutoMatch && eachFileField.toLowerCase() == "phonenumber")
                    $("#" + ddlIdPrefix + i).prop("disabled", true);
                else if (IsAutoMatch && eachFileField.toLowerCase() == "eventtime")
                    $("#" + ddlIdPrefix + i).prop("disabled", true);
            }

            CustomEventImportStep2Util.initializeContactSelect2();
            $("#ui_sectionCustomEventImport_Mapping").removeClass('hideDiv');
            CustomEventImportStep2Util.CheckAndDecideMapping();
            HidePageLoading();
        }
    },
    IsColumnMatching: function (FileFieldName) {
        for (var i = 0; i < EventPropertyList.length; i++) {
            if (EventPropertyList[i].FrontEndName == FileFieldName) {
                return [true, EventPropertyList[i].P5ColumnName, EventPropertyList[i].FrontEndName, EventPropertyList[i].FieldMappingType];
            }
        }
        return [false, "", ""];
    },
    CreateUploadedDataTypeDropDown: function (id, P5ColumnName, IsAutoMatch) {
        var ddlField = document.createElement('select');
        ddlField.id = id;
        ddlField.className = "form-control form-control-sm addgroupselect w-100";
        ddlField.setAttribute("data-placeholder", "Select Column");

        var optlist = document.createElement('option');
        optlist.value = "0";
        optlist.text = "Select Column";
        ddlField.options.add(optlist);

        optlist = document.createElement('option');
        optlist.value = "string";
        optlist.text = "string";
        ddlField.options.add(optlist);

        optlist = document.createElement('option');
        optlist.value = "number";
        optlist.text = "number";
        ddlField.options.add(optlist);

        optlist = document.createElement('option');
        optlist.value = "boolean";
        optlist.text = "boolean";
        ddlField.options.add(optlist);

        optlist = document.createElement('option');
        optlist.value = "date";
        optlist.text = "date";
        ddlField.options.add(optlist);

        optlist = document.createElement('option');
        optlist.value = "object";
        optlist.text = "object";
        ddlField.options.add(optlist);

        if (IsAutoMatch) {
            $(ddlField).val(P5ColumnName);
        }

        return ddlField;
    },
    CreatePlumb5FieldDropDown: function (id, IsAutoMatch, P5ColumnName, FrontEndName) {
        var ddlField = document.createElement('select');
        ddlField.id = id;
        ddlField.className = "form-control form-control-sm addgroupselect w-100";
        ddlField.setAttribute("data-placeholder", "Select Column");

        var optlist = document.createElement('option');
        optlist.value = "0";
        optlist.text = "Select Column";
        ddlField.options.add(optlist);

        for (var i = 0; i < EventPropertyList.length; i++) {
            optlist = document.createElement('option');
            optlist.value = EventPropertyList[i].P5ColumnName;
            optlist.text = EventPropertyList[i].FrontEndName;
            ddlField.options.add(optlist);
        }

        if (IsAutoMatch) {
            $(ddlField).val(P5ColumnName);
        }

        $(ddlField).on("change", CustomEventImportStep2Util.DropDownChanged);

        return ddlField;
    },
    DropDownChanged: function () {
        var currentSelectedValue = $(this).val();
        var currentSelectedRow = (this.id).replace(ddlIdPrefix, '');
        if (currentSelectedValue != "0") {
            $("#" + matchIconSpanIdPrefix + currentSelectedRow).removeClass('nomatch');
            $("#" + matchIconCheckBoxIdPrefix + currentSelectedRow).prop("checked", true);
            CustomEventImportStep2Util.CheckSameColumnSelection(currentSelectedValue, currentSelectedRow);
        }
        else if (currentSelectedValue == "0") {
            $("#" + matchIconSpanIdPrefix + currentSelectedRow).addClass('nomatch');
            $("#" + matchIconCheckBoxIdPrefix + currentSelectedRow).prop("checked", false);
        }
        CustomEventImportStep2Util.CheckAndDecideMapping();
    },
    initializeContactSelect2: function () {
        if ($('.addgroupselect').hasClass("select2-hidden-accessible")) {
            $('.addgroupselect').select2('destroy');
        }

        $('.addgroupselect').select2({
            placeholder: 'This is my placeholder',
            minimumResultsForSearch: '',
            dropdownAutoWidth: false,
            containerCssClass: 'dropdownactiv'
        });
    },
    CheckAndDecideMapping: function () {
        $("#ui_btnCustomEventImport_Submit").addClass('disableDiv');

        var datatypenotmatched = 0;
        var mappedCount = 0;
        var notMappedCount = 0;
        var ignoredCount = 0;

        for (var i = 0; i < fileColumnMappingList.length; i++) {
            var ddlValue = $("#" + ddlIdPrefix + i).val();
            if (ddlValue != "0") {
                mappedCount++;
            }
            else if (($("#" + ddlIdPrefix + i).is(":visible"))) {
                notMappedCount++;
            }
            else {
                ignoredCount++;
            }
        }

        $("[id^='ui_span_FileField_Matched_']").each(function () {
            if ($(this)[0].className.indexOf("nomatch") > -1) {
                datatypenotmatched++;
            }
        });

        if (notMappedCount == 0 && mappedCount >= 1 && datatypenotmatched == 0) {
            $("#ui_btnCustomEventImport_Submit").removeClass('disableDiv');
        }
    },
    CheckUpdatedColumnMappedvalidation: function () {
        var MappingNotDone = true;
        $("[id^='" + ddlDataTypeIdPrefix + "']").each(function () {
            if ($(this).val() == "0") {
                MappingNotDone = false;
                return false;
            }
        });

        if (MappingNotDone) {
            return true;
        }
        else {
            ShowErrorMessage(GlobalErrorList.CustomEventImport.mapdatatype);
            return false;
        }
    },
    CheckSameColumnSelection: function (currentSelectedValue, currentSelectedRow) {
        $("[id^='" + ddlIdPrefix + "']").each(function () {
            var eachSelectedRow = (this.id).replace(ddlIdPrefix, '');
            var eachSelectedValue = $(this).val();
            if (eachSelectedRow != currentSelectedRow) {
                if (eachSelectedValue == currentSelectedValue) {
                    ShowErrorMessage(GlobalErrorList.ContactImport.duplicateColumnSelection);
                    $("#" + ddlIdPrefix + currentSelectedRow).val("0").trigger("change");
                    $("#" + matchIconSpanIdPrefix + currentSelectedRow).addClass('nomatch');
                    $("#" + matchIconCheckBoxIdPrefix + currentSelectedRow).prop("checked", false);
                }
            }
        });
    },
    CheckEmailOrPhoneColumn: function () {
        var FoundColumn = false;
        $("[id^='" + ddlIdPrefix + "']").each(function () {
            var eachSelectedValue = $(this).val();
            if (eachSelectedValue == "EmailId" || eachSelectedValue == "PhoneNumber") {
                FoundColumn = true;
                return false;
            }
        });

        if (FoundColumn) {
            return true;
        }
        else {
            ShowErrorMessage(GlobalErrorList.ContactImport.mapEmailOrPhone);
            return false;
        }
    },
    MakeColumnReadyForImport: function () {
        ImportFileColumnMapping = [];
        for (var i = 0; i < fileColumnMappingList.length; i++) {
            var fileColumnMapping = { FileFieldName: "", FileFieldIndex: -1, P5ColumnName: "", FrontEndName: "", IsMapped: false, IsNameChanged: false, FieldMappingType: "" };
            var isCheked = $("#" + ddlIdPrefix + i).is(":visible");
            var ddlValue = $("#" + ddlIdPrefix + i).val();
            var ddlText = $("#" + ddlIdPrefix + i + " option:selected").text();
            var datatypetext = $("#" + ddlDataTypeIdPrefix + i + " option:selected").text();

            var fileFieldName = $.trim($("#" + tdIdPrefix + i).html().split(" ")[0]);
            fileColumnMapping.FileFieldName = fileFieldName;
            fileColumnMapping.FileFieldIndex = i;
            fileColumnMapping.P5ColumnName = ddlValue;
            fileColumnMapping.FrontEndName = ddlText;
            fileColumnMapping.FieldMappingType = datatypetext;

            if (isCheked) {
                fileColumnMapping.IsMapped = true;
                if (fileFieldName == ddlValue || fileFieldName == "GroupName") {
                    fileColumnMapping.IsNameChanged = false;
                }
                else {
                    fileColumnMapping.IsNameChanged = true;
                }
            }
            else {
                fileColumnMapping.IsMapped = false;
                fileColumnMapping.IsNameChanged = null;
            }

            ImportFileColumnMapping.push(fileColumnMapping);
        }
    }
}

$(document).on("click", "[id^=" + fieldMarkIgnoreIdPrefix + "]", function () {
    var clickedRowNumber = (this.id).replace(fieldMarkIgnoreIdPrefix, '')
    $("#" + ddlIdPrefix + clickedRowNumber).val("0").trigger("change");
    $("#" + matchIconSpanIdPrefix + clickedRowNumber).removeClass('nomatch');
    $("#" + matchIconCheckBoxIdPrefix + clickedRowNumber).prop("checked", true);
    $("#" + contactDropDownDivIdPrefix + clickedRowNumber).addClass('hideDiv');
    $("#" + fieldIgnoreDivIdPrefix + clickedRowNumber).removeClass('hideDiv');
    CustomEventImportStep2Util.CheckAndDecideMapping();
});

$(document).on("click", "[id^=" + fieldIgnoreCancelIconIdPrefix + "]", function () {
    var clickedRowNumber = (this.id).replace(fieldIgnoreCancelIconIdPrefix, '')
    $("#" + ddlIdPrefix + clickedRowNumber).val("0").trigger("change");
    $("#" + matchIconSpanIdPrefix + clickedRowNumber).addClass('nomatch');
    $("#" + matchIconCheckBoxIdPrefix + clickedRowNumber).prop("checked", false);
    $("#" + fieldIgnoreDivIdPrefix + clickedRowNumber).addClass('hideDiv');
    $("#" + contactDropDownDivIdPrefix + clickedRowNumber).removeClass('hideDiv');
    $("#ui_chkIgnoreUnMatched").prop('checked', false);
    CustomEventImportStep2Util.CheckAndDecideMapping();
});

$(document).on("click", ".addcustfields", function () {
    ClearCustomFiledsValues();
    $("#dv_addcustfield").toggleClass("hideDiv");
});

$(document).on("click", ".addcustomclose", function () {
    ClearCustomFiledsValues();
    $("#dv_addcustfield").toggleClass("hideDiv");
});

function CallBackCustomFieldResponse(CustomFieldDetails) {

    var ContactPropertyItem = { P5ColumnName: "", FrontEndName: "", FieldMappingType: "" };
    ContactPropertyItem.P5ColumnName = CustomFieldDetails.FieldName;
    ContactPropertyItem.FrontEndName = CustomFieldDetails.FieldName;
    EventPropertyList.push(ContactPropertyItem);

    $("[id^='" + ddlIdPrefix + "']").append(new Option(CustomFieldDetails.FieldName, CustomFieldDetails.FieldName))

    $("#dv_addcustfield").toggleClass("hideDiv");
}

$("#ui_btnBackToCustomEventImport_Start").click(function () {
    ShowPageLoading();
    $("[id^='ui_sectionCustomEventImport_']").addClass('hideDiv');
    $("#ui_sectionCustomEventImport_Start").removeClass('hideDiv');
    HidePageLoading();
});

$('#ui_chkIgnoreUnMatched').change(function () {
    if (this.checked) {
        for (var i = 0; i < fileColumnMappingList.length; i++) {
            if ($("#" + ddlIdPrefix + i).val() != "0") {
                //Matched
            }
            else if (($("#" + ddlIdPrefix + i).is(":visible"))) {
                $("#" + fieldMarkIgnoreIdPrefix + i).trigger("click");
            }
        }
    }
    CustomEventImportStep2Util.CheckAndDecideMapping();
});

$("#ui_btnCustomEventImport_Submit").click(function () {
    ShowPageLoading();
    ImportFileColumnMapping = [];
    if (CustomEventImportStep2Util.CheckUpdatedColumnMappedvalidation()) {
        CustomEventImportStep2Util.MakeColumnReadyForImport();

        $("[id^='ui_sectionCustomEventImport_']").addClass('hideDiv');
        var uploadedFileName = uploadedFileData.name;
        $("#ui_txtImportFileName").val(uploadedFileName);
        $("#ui_btnCustomEventImport_Submit").removeClass('hideDiv');
    }
    HidePageLoading();
});

$("#ui_btnCustomEventImport_Submit").click(function () {
    ShowPageLoading();

    $.ajax({
        url: "/CustomEvents/EventImport/ChangeFileAndSendImport",
        type: 'Post',
        data: JSON.stringify({ 'ColumnMappingList': ImportFileColumnMapping }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.CustomEventImport.importSuccess);
                setTimeout(function () {
                    //Areas Coming from AccountMaster.js global variable 
                    window.location.href = "/" + Areas + "/CustomData/";
                }, 3000);
            }
            else {
                ShowErrorMessage(GlobalErrorList.CustomEventImport.importError);
                $("[id^='ui_sectionCustomEventImport_']").addClass('hideDiv');
                $("#ui_sectionCustomEventImport_Start").removeClass('hideDiv');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
});

//#endregion CustomEventImportMapping->Step2