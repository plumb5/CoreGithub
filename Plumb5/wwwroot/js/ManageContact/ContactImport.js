var AdvancedSettingHandledbyStatus = 0;
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

var matchIconCheckBoxIdPrefix = "ui_chk_FileField_Matched_";

var LmsGroupId = 0;
var LmsGroupName = "";

$(document).ready(function () {
    LmsGroupId = $.urlParam("LmsGroupId");
    LmsGroupName = decodeURIComponent(urlParam("LmsGroupName"));
    ContactImportStep1Util.Initialization();
    if (IsOverrideAssignmentPermission == undefined || IsOverrideAssignmentPermission == null || IsOverrideAssignmentPermission != "True") {
        $("#ui_chkOverrideAssignments").prop("disabled", true);
    }

    if (IsOverrideSourcePermission == undefined || IsOverrideSourcePermission == null || IsOverrideSourcePermission != "True") {
        $("#lmsStaySource,#lmsOverrideSource,#lmsNewSource").prop("disabled", true);
    }
});

//#region ContactImportStart->Step1

var ContactImportStep1Util = {
    Initialization: function () {
        $("#ui_h6ImportPagetitle").html("Start Imports");
        $("[id^='ui_sectionContactImport_']").addClass('hideDiv');
        $("#ui_btnContactImport_Start_Next").addClass('disableDiv');
        $("#ui_sectionContactImport_Start").removeClass('hideDiv');
        $("[id^='ui_divLMSImport']").addClass('hideDiv');
        if (LmsGroupId != undefined && LmsGroupId != null && LmsGroupId != 0 && LmsGroupId > 0) {
            $("[id^='ui_divLMSImport']").removeClass('hideDiv');
            $("#ui_h6ImportPagetitle").html("Start Imports (Source: " + LmsGroupName + ")");
        }
        ContactImportStep1Util.BindGroupsList();
    },
    BindGroupsList: function () {
        $("#ui_ddlContactImportGroup").html($('<option></option>').val(0).html('Select Group'));

        $.ajax({
            url: "/ManageContact/Group/GetGroupsByStaticOrDynamic",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, GroupType: 1 }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && response.GroupDetails != null) {
                    $.each(response.GroupDetails, function () {
                        $("#ui_ddlContactImportGroup").append($('<option></option>').val($(this)[0].Id).html($(this)[0].Name));
                    });
                }
                ContactImportStep1Util.GetContactProperties();
            },
            error: ShowAjaxError
        });
    },
    GetContactProperties: function () {
        $.ajax({
            url: "/ManageContact/ContactImport/GetContactProperties",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    for (var i = 0; i < response.length; i++) {
                        var ContactPropertyItem = { P5ColumnName: "", FrontEndName: "" };
                        ContactPropertyItem.P5ColumnName = response[i].FieldName;
                        ContactPropertyItem.FrontEndName = response[i].FieldName;
                        ContactPropertyList.push(ContactPropertyItem);
                    }
                }

                if (LmsGroupId != undefined && LmsGroupId != null && LmsGroupId != 0 && LmsGroupId > 0) {
                    ContactImportStep1Util.GetLMSContactProperties();
                }
                else {
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetLMSContactProperties: function () {
        $.ajax({
            url: "/ManageContact/ContactImport/GetLMSContactProperties",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    for (var i = 0; i < response.length; i++) {
                        var ContactPropertyItem = { P5ColumnName: "", FrontEndName: "" };
                        ContactPropertyItem.P5ColumnName = response[i].FieldName;
                        ContactPropertyItem.FrontEndName = response[i].FieldDisplayName;
                        ContactPropertyList.push(ContactPropertyItem);
                    }
                }
                if (LmsGroupId != undefined && LmsGroupId != null && LmsGroupId != 0 && LmsGroupId > 0) {
                    ContactImportStep1Util.GetLmsAdvacedSettings();
                }
                else {
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetLmsAdvacedSettings: function () {
        $.ajax({
            url: "/Prospect/AdvancedSettings/GetLmAdvacedSettings",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'key': "HANDLEBY" }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var data = response[0];
                if (data !== undefined) {
                    AdvancedSettingHandledbyStatus = data.Value;
                }
                ContactImportStep1Util.GetUserList();

            },
            error: function (error) {
                HidePageLoading();
                // Your error handling logic here
            }
        });
    },
    GetUserList: function () {
        $.ajax({
            url: "/Prospect/Leads/GetUser",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Getallusers': AdvancedSettingHandledbyStatus }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (userDetails) {
                $.each(userDetails, function (i) {
                    if ($(this)[0].ActiveStatus) {
                        $('#ui_ddlUserList').append($("<option></option>").attr("value", $(this)[0].UserInfoUserId).text($(this)[0].FirstName));
                    }
                });
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    CreateImportFormData: function (fileData) {
        ShowPageLoading();
        $("#ui_btnContactImport_Start_Next").addClass('disableDiv');
        $("#ui_divImportFileDetails").addClass('hideDiv');
        uploadedFileData = fileData;
        var fileValidationResult = ContactImportStep1Util.validateFile();
        if (fileValidationResult == "success") {
            var uploadedFileName = uploadedFileData.name;
            var uploadedFileSizeInKb = ((uploadedFileData.size) / 1024).toFixed(2);

            $("#ui_pImportFileName").html(uploadedFileName + " has uploaded and the size of file is ");
            $("#ui_pImportFileSize").html(uploadedFileSizeInKb + "KB");

            $("#ui_divImportFileDetails").removeClass('hideDiv');

            if (LmsGroupId != undefined && LmsGroupId != null && LmsGroupId != 0 && LmsGroupId > 0) {
                $("#ui_btnContactImport_Start_Next").removeClass('disableDiv');
            } else if ($("#ui_ddlContactImportGroup").val() != "0") {
                $("#ui_btnContactImport_Start_Next").removeClass('disableDiv');
            }
        } else {
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
                    return (GlobalErrorList.ContactImport.largeFileSize);
                }
            } else {
                return (GlobalErrorList.ContactImport.inValidFileType);
            }
        } else {
            return (GlobalErrorList.ContactImport.fileUploadError);
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

        var GroupId = $("#ui_ddlContactImportGroup").val();

        var IgnoreUpdateContact = false;
        var AssociateContactsToGrp = true;
        var RemoveFromGroup = false;
        var OverrideAssignment = false;
        var OverrideSources = false;
        var UserIdList = "0";
        var SourceType = 0;

        if ($("#ui_chkIgnoreUpdateContact").is(':checked')) {
            IgnoreUpdateContact = true;
        }
        if ($("#ui_chkNoExistingContact").is(':checked')) {
            AssociateContactsToGrp = false;
        }
        if ($("#ui_chkRemoveFromGroup").is(':checked')) {
            RemoveFromGroup = true;
        }
        if ($("#ui_chkOverrideAssignments").is(':checked')) {
            OverrideAssignment = true;
        }
        if ($("#ui_chkAssignUser").is(':checked')) {
            var SelectedUserList = $('#ui_ddlUserList').val();
            if (SelectedUserList != null) {
                UserIdList = SelectedUserList.join(",");
            }
        }
        //if ($("#ui_chkOverrideSources").is(':checked')) {
        //    OverrideSources = true;
        //}


        if ($("#lmsStaySource").is(":checked")) {
            SourceType = 0;
        }
        else if ($("#lmsOverrideSource").is(":checked")) {
            SourceType = 1;
        }
        else if ($("#lmsNewSource").is(":checked")) {
            SourceType = 2;
        }


        if ($("#ui_chkNotoptedEmailValidation").is(':checked')) {
            NotoptedforEmailValidation = true;
        } else {
            NotoptedforEmailValidation = false;
        }

        //Areas Coming from AccountMaster.js global variable 

        $.ajax({
            url: "/ManageContact/ContactImport/InitiateImport?GroupId=" + GroupId + "&LmsGroupId=" + LmsGroupId + "&OverrideAssignment=" + OverrideAssignment + "&OverrideSources=" + OverrideSources + "&UserIdList=" + UserIdList + "&AssociateContactsToGrp=" + AssociateContactsToGrp + "&RemoveOldContactsFromTheGroup=" + RemoveFromGroup + "&ImportSource=" + Areas + "&NotoptedforEmailValidation=" + NotoptedforEmailValidation + "&IgnoreUpdateContact=" + IgnoreUpdateContact + "&SourceType=" + SourceType + "",
            type: 'POST',
            data: uploadedFormData,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function (response) {
                if (response.Status) {
                    ContactImportStep2Util.BindImportColumnMapping(response.returnDataSet);
                }
                else {
                    ShowErrorMessage(response.Message);
                    $("#ui_sectionContactImport_Start").removeClass('hideDiv');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    }
}

$(".addgroupNamedrop").select2({
    placeholder: 'This is my placeholder',
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
});

$('.strtimpinfo').popover({
    trigger: 'hover',
    placement: 'top'
});

$("#ui_ddlUserList").select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$('input[id="ui_chkAssignUser"]').on('click', function (e) {
    let IsAssignUserChecked = $('input[id="ui_chkAssignUser"]').prop('checked');
    if (IsAssignUserChecked == true) {
        $('#ui_divUserPopUp').modal();
    }
});

$("#ui_btnCloseUserPopUp,#ui_btnTopCloseUserPopUp").click(function () {
    $('input[id="ui_chkAssignUser"]').prop('checked', false);
    $("#ui_divUserPopUp").modal('hide');
});

$("#ui_btnSaveUserData").click(function () {
    var SelectedUserList = $('#ui_ddlUserList').val();

    if (SelectedUserList == null) {
        ShowErrorMessage(GlobalErrorList.ContactImport.NoUserSelected);
        return;
    } else {
        $("#ui_divUserPopUp").modal('hide');
    }
});

$('#ui_ddlContactImportGroup').change(function () {
    $("#ui_btnContactImport_Start_Next").addClass('disableDiv');
    if (LmsGroupId != undefined && LmsGroupId != null && LmsGroupId != 0 && LmsGroupId > 0) {
        var fileValidationResult = ContactImportStep1Util.validateFile();
        if (fileValidationResult == "success") {
            $("#ui_btnContactImport_Start_Next").removeClass('disableDiv');
        }
    } else {
        if ($("#ui_ddlContactImportGroup").val() != "0") {
            var fileValidationResult = ContactImportStep1Util.validateFile();
            if (fileValidationResult == "success") {
                $("#ui_btnContactImport_Start_Next").removeClass('disableDiv');
            }
        } else {
            ShowErrorMessage(GlobalErrorList.ContactImport.groupNotSelected);
        }
    }
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
    ContactImportStep1Util.CreateImportFormData(file);
});

$("#ui_btnFileImportChoose").click(function (e) {
    e.stopPropagation();
    e.preventDefault();
    $("#ui_fileContactImport").click();
});

$("#ui_fileContactImport").change(function () {
    var file = $(this)[0].files[0];
    ContactImportStep1Util.CreateImportFormData(file);
});

$("#ui_divCloseImportFileDetails").click(function () {
    $("#ui_btnContactImport_Start_Next").addClass('disableDiv');
    uploadedFileData = null;
    $("#ui_fileContactImport").val('');
    $("#ui_pImportFileName").html('');
    $("#ui_pImportFileSize").html('');
    $("#ui_divImportFileDetails").addClass('hideDiv');
});

$("#ui_btnContactImport_Start_Next").click(function () {
    ShowPageLoading();
    $("[id^='ui_sectionContactImport_']").addClass('hideDiv');
    $("#ui_chkIgnoreUnMatched").prop('checked', false);
    ContactImportStep1Util.ContactImportInitiate();
});

$("#ui_btnContactSampleDownLoad").click(function () {
    ShowPageLoading();
    var ColumnsList = [];
    for (var i = 0; i < ContactPropertyList.length; i++) {
        ColumnsList.push(ContactPropertyList[i].FrontEndName);
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

//#endregion ContactImportStart->Step1

//#region ContactImportMapping->Step2

var ContactImportStep2Util = {
    BindImportColumnMapping: function (response) {
        fileColumnMappingList = [];
        if (response != undefined && response != null && response.P5Sheet1 != undefined && response.P5Sheet1 != null && response.P5Sheet1.length > 0) {
            var firstRow = response.P5Sheet1[0];
            $.each(firstRow, function (key, value) {
                var fileColumnMapping = { FileFieldName: "", P5ColumnName: "", FrontEndName: "", IsAutoMatch: false };
                fileColumnMapping.FileFieldName = key;
                var matchingDetails = ContactImportStep2Util.IsColumnMatching(key);
                fileColumnMapping.IsAutoMatch = matchingDetails[0];
                fileColumnMapping.P5ColumnName = matchingDetails[1];
                fileColumnMapping.FrontEndName = matchingDetails[2];
                fileColumnMappingList.push(fileColumnMapping);
            });

            var loopCount = response.P5Sheet1.length > 2 ? 3 : response.P5Sheet1.length;

            $("#ui_tbodyReportData").html("");
            for (var i = 0; i < fileColumnMappingList.length; i++) {
                var eachFileField = fileColumnMappingList[i].FileFieldName;
                var IsAutoMatch = fileColumnMappingList[i].IsAutoMatch;
                if (eachFileField == "GroupName") {
                    IsAutoMatch = true;
                }

                var eachFieldDropDown = ContactImportStep2Util.CreatePlumb5FieldDropDown(ddlIdPrefix + i, fileColumnMappingList[i].IsAutoMatch, fileColumnMappingList[i].P5ColumnName, fileColumnMappingList[i].FrontEndName);
                var previewValue = "";
                for (var j = 0; j < loopCount; j++) {
                    previewValue += response.P5Sheet1[j][eachFileField] + "<br/>";
                }
                previewValue = previewValue.substring(0, previewValue.lastIndexOf("<br/>"));
                var reportTableTrs = $(document.createElement('tr'));
                if (IsAutoMatch) {
                    $(reportTableTrs).append("<td class='text-center'><input style='display: none;' type='checkbox' id='" + matchIconCheckBoxIdPrefix + i + "' readonly='readonly' disabled='disabled' checked /><span id='" + matchIconSpanIdPrefix + i + "' class='circle'></span></td>");
                } else {
                    $(reportTableTrs).append("<td class='text-center'><input style='display: none;' type='checkbox' id='" + matchIconCheckBoxIdPrefix + i + "' readonly='readonly' disabled='disabled' /><span id='" + matchIconSpanIdPrefix + i + "' class='circle nomatch'></span></td>");
                }
                $(reportTableTrs).append("<td id='" + tdIdPrefix + i + "'>" + eachFileField + "</td>");
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

                if (eachFileField == "GroupName") {
                    $(reportTableTrs).addClass('disableDiv');
                }

                $("#ui_tbodyReportData").append(reportTableTrs);
            }

            ContactImportStep2Util.initializeContactSelect2();
            $("#ui_sectionContactImport_Mapping").removeClass('hideDiv');
            ContactImportStep2Util.CheckAndDecideMapping();
            HidePageLoading();
        }
    },
    IsColumnMatching: function (FileFieldName) {
        for (var i = 0; i < ContactPropertyList.length; i++) {
            if (ContactPropertyList[i].FrontEndName == FileFieldName) {
                return [true, ContactPropertyList[i].P5ColumnName, ContactPropertyList[i].FrontEndName];
            }
        }
        return [false, "", ""];
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

        for (var i = 0; i < ContactPropertyList.length; i++) {
            optlist = document.createElement('option');
            optlist.value = ContactPropertyList[i].P5ColumnName;
            optlist.text = ContactPropertyList[i].FrontEndName;
            ddlField.options.add(optlist);
        }

        if (IsAutoMatch) {
            $(ddlField).val(P5ColumnName);
        }

        $(ddlField).on("change", ContactImportStep2Util.DropDownChanged);

        return ddlField;
    },
    DropDownChanged: function () {
        var currentSelectedValue = $(this).val();
        var currentSelectedRow = (this.id).replace(ddlIdPrefix, '');
        if (currentSelectedValue != "0") {
            $("#" + matchIconSpanIdPrefix + currentSelectedRow).removeClass('nomatch');
            $("#" + matchIconCheckBoxIdPrefix + currentSelectedRow).prop("checked", true);
            ContactImportStep2Util.CheckSameColumnSelection(currentSelectedValue, currentSelectedRow);
        }
        else if (currentSelectedValue == "0") {
            $("#" + matchIconSpanIdPrefix + currentSelectedRow).addClass('nomatch');
            $("#" + matchIconCheckBoxIdPrefix + currentSelectedRow).prop("checked", false);
        }
        ContactImportStep2Util.CheckAndDecideMapping();
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
        $("#ui_btnContactImport_Mapping_Next").addClass('disableDiv');
        var mappedCount = 0;
        var notMappedCount = 0;
        var ignoredCount = 0;
        var totalColumn = fileColumnMappingList.length;
        for (var i = 0; i < fileColumnMappingList.length; i++) {
            var fileFieldName = $("#" + tdIdPrefix + i).html();
            var ddlValue = $("#" + ddlIdPrefix + i).val();
            if (ddlValue != "0" || fileFieldName == "GroupName") {
                mappedCount++;
            }
            else if (($("#" + ddlIdPrefix + i).is(":visible"))) {
                notMappedCount++;
            }
            else {
                ignoredCount++;
            }
        }
        $("#ui_labelPendingMatch").html("You have total " + totalColumn + " column present in the file. Out of that " + mappedCount + " mapped, " + notMappedCount + " unmapped and " + ignoredCount + " ignored column(s) for importing.");
        if (notMappedCount == 0 && mappedCount >= 1) {
            $("#ui_btnContactImport_Mapping_Next").removeClass('disableDiv');
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
        } else {
            ShowErrorMessage(GlobalErrorList.ContactImport.mapEmailOrPhone);
            return false;
        }
    },
    MakeColumnReadyForImport: function () {
        ImportFileColumnMapping = [];
        for (var i = 0; i < fileColumnMappingList.length; i++) {
            var fileColumnMapping = { FileFieldName: "", FileFieldIndex: -1, P5ColumnName: "", FrontEndName: "", IsMapped: false, IsNameChanged: false };
            var isCheked = $("#" + ddlIdPrefix + i).is(":visible");
            var ddlValue = $("#" + ddlIdPrefix + i).val();
            var ddlText = $("#" + ddlIdPrefix + i + " option:selected").text();
            var fileFieldName = $("#" + tdIdPrefix + i).html();
            fileColumnMapping.FileFieldName = fileFieldName;
            fileColumnMapping.FileFieldIndex = i;
            fileColumnMapping.P5ColumnName = ddlValue;
            fileColumnMapping.FrontEndName = ddlText;
            if (isCheked) {
                fileColumnMapping.IsMapped = true;
                if (fileFieldName == ddlValue || fileFieldName == "GroupName") {
                    fileColumnMapping.IsNameChanged = false;
                } else {
                    fileColumnMapping.IsNameChanged = true;
                }
            } else {
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
    ContactImportStep2Util.CheckAndDecideMapping();
});

$(document).on("click", "[id^=" + fieldIgnoreCancelIconIdPrefix + "]", function () {
    var clickedRowNumber = (this.id).replace(fieldIgnoreCancelIconIdPrefix, '')
    $("#" + ddlIdPrefix + clickedRowNumber).val("0").trigger("change");
    $("#" + matchIconSpanIdPrefix + clickedRowNumber).addClass('nomatch');
    $("#" + matchIconCheckBoxIdPrefix + clickedRowNumber).prop("checked", false);
    $("#" + fieldIgnoreDivIdPrefix + clickedRowNumber).addClass('hideDiv');
    $("#" + contactDropDownDivIdPrefix + clickedRowNumber).removeClass('hideDiv');
    $("#ui_chkIgnoreUnMatched").prop('checked', false);
    ContactImportStep2Util.CheckAndDecideMapping();
});

$(document).on("click", ".addcustfields", function () {
    ClearCustomFiledsValues();
    $("#dv_addcustfield").toggleClass("hideDiv");
});

$(document).on("click", ".addcustomclose", function () {
    ClearCustomFiledsValues();
    $("#dv_addcustfield").toggleClass("hideDiv");
});

//$(document).on("click", "#close-custfieldpopup", function () {
//    ClearCustomFiledsValues();
//    $("#dv_addcustfield").toggleClass("hideDiv");
//});

function CallBackCustomFieldResponse(CustomFieldDetails) {

    var ContactPropertyItem = { P5ColumnName: "", FrontEndName: "" };
    ContactPropertyItem.P5ColumnName = CustomFieldDetails.FieldName;
    ContactPropertyItem.FrontEndName = CustomFieldDetails.FieldName;
    ContactPropertyList.push(ContactPropertyItem);

    $("[id^='" + ddlIdPrefix + "']").append(new Option(CustomFieldDetails.FieldName, CustomFieldDetails.FieldName))

    $("#dv_addcustfield").toggleClass("hideDiv");
}

$("#ui_btnBackToContactImport_Start").click(function () {
    ShowPageLoading();
    $("[id^='ui_sectionContactImport_']").addClass('hideDiv');
    $("#ui_sectionContactImport_Start").removeClass('hideDiv');
    HidePageLoading();
});

$('#ui_chkIgnoreUnMatched').change(function () {
    if (this.checked) {
        for (var i = 0; i < fileColumnMappingList.length; i++) {
            var fileFieldName = $("#" + tdIdPrefix + i).html();
            var ddlValue = $("#" + ddlIdPrefix + i).val();
            if (ddlValue != "0" || fileFieldName == "GroupName") {
                //Matched
            }
            else if (($("#" + ddlIdPrefix + i).is(":visible"))) {
                $("#" + fieldMarkIgnoreIdPrefix + i).trigger("click");
            }
        }
    }
    ContactImportStep2Util.CheckAndDecideMapping();
});

$("#ui_btnContactImport_Mapping_Next").click(function () {
    ShowPageLoading();
    ImportFileColumnMapping = [];
    if (ContactImportStep2Util.CheckEmailOrPhoneColumn()) {
        ContactImportStep2Util.MakeColumnReadyForImport();

        $("[id^='ui_sectionContactImport_']").addClass('hideDiv');
        var uploadedFileName = uploadedFileData.name;
        $("#ui_txtImportFileName").val(uploadedFileName);
        $("#ui_chkIAgreeImport").prop('checked', true);
        $("#ui_sectionContactImport_Submit").removeClass('hideDiv');
    }
    HidePageLoading();
});

//#endregion ContactImportMapping->Step2

//#region ContactImportSubmit->Step3
$('#ui_chkIAgreeImport').change(function () {
    $("#ui_btnContactImport_Submit").addClass('disableDiv');
    if (this.checked) {
        $("#ui_btnContactImport_Submit").removeClass('disableDiv');
    }
});

$("#ui_btnBackToContactImport_Mapping").click(function () {
    ShowPageLoading();
    $("[id^='ui_sectionContactImport_']").addClass('hideDiv');
    $("#ui_sectionContactImport_Mapping").removeClass('hideDiv');
    HidePageLoading();
});

$("#ui_btnContactImport_Submit").click(function () {
    ShowPageLoading();

    $.ajax({
        url: "/ManageContact/ContactImport/ChangeFileAndSendImport",
        type: 'Post',
        data: JSON.stringify({ 'ColumnMappingList': ImportFileColumnMapping }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.ContactImport.importSuccess);
                setTimeout(function () {
                    //Areas Coming from AccountMaster.js global variable 
                    window.location.href = "/" + Areas + "/ContactImportOverViews/";
                }, 3000);
            }
            else {
                ShowErrorMessage(GlobalErrorList.ContactImport.importError);
                $("[id^='ui_sectionContactImport_']").addClass('hideDiv');
                $("#ui_sectionContactImport_Start").removeClass('hideDiv');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
});

//#endregion ContactImportSubmit->Step3