var contactExtraFields = [], answerList = [], numberOfData = [], columnFieldType = [], lmsGroupId = 0, handledBy = 0;
var contactDetails = {
    UserInfoUserId: 0, LastModifyByUserId: 0, UserGroupId: 0, ContactId: 0, LmsGroupId: 0, CustomField1: "", CustomField2: "", CustomField3: "",
    CustomField4: "", CustomField5: "", CustomField6: "", CustomField7: "", CustomField8: "", CustomField9: "", CustomField10: "", CustomField11: "",
    CustomField12: "", CustomField13: "", CustomField14: "", CustomField15: "", CustomField16: "", CustomField17: "", CustomField18: "", CustomField19: "",
    CustomField20: "", CustomField21: "", CustomField22: "", CustomField23: "", CustomField24: "", CustomField25: "", CustomField26: "",
    CustomField27: "", CustomField28: "", CustomField29: "", CustomField30: "", CustomField31: "", CustomField32: "", CustomField33: "", CustomField34: "",
    CustomField35: "", CustomField36: "", CustomField37: "", CustomField38: "", CustomField39: "", CustomField40: "", CustomField41: "", CustomField42: "",
    CustomField43: "", CustomField44: "", CustomField45: "", CustomField46: "", CustomField47: "", CustomField48: "", CustomField49: "", CustomField50: "",
    CustomField51: "", CustomField52: "", CustomField53: "", CustomField54: "", CustomField55: "", CustomField56: "", CustomField57: "", CustomField58: "",
    CustomField59: "", CustomField60: "", Remarks: "", ReminderDate: "", ToReminderPhoneNumber: "", ToReminderEmailId: "", Score: 0, SearchKeyword: "", PageUrl: "",
    ReferrerUrl: "", IsAdSenseOrAdWord: "", Name: "", EmailId: "", PhoneNumber: "", Location: "", AgeRange: 0, Gender: "", MaritalStatus: "", Education: "", Occupation: "",
    Interests: "", Religion: "", AlternateEmailIds: "", AlternatePhoneNumbers: "", Address1: "", Address2: "", StateName: "", ZipCode: "",
    Country: "", LastName: "", CompanyName: "", CompanyWebUrl: "", CompanyAddress: "", Projects: "", DomainName: "", ContactSource: "", IsVerifiedMailId: -1, IsVerifiedContactNumber: -1,
    LeadLabel: ""
};

$(document).ready(() => {
    GetContactFields();
});

function GetContactFields() {
    $.ajax({
        url: "/ManageContact/ContactField/GetAllFieldDetails",
        type: 'Post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            contactExtraFields = response;
            $.each(response, function (index) {
                numberOfData.push(index);
                columnFieldType.push($(this)[0].FieldType);
                AppendFieldsToTable($(this)[0].FieldName, index, $(this)[0].FieldType, $(this)[0].SubFields, index, $(this)[0].IsEditable, $(this)[0].IsMandatory, $(this)[0].Id);
            });
            if (contactDetails.ContactId > 0) {
                $("#btnSubmit").val("Update");
                BindDetails();
            }
            GetUsersList();
        },
        error: ShowAjaxError
    });
}

function CallBackCustomFieldResponse(CustomFieldDetails) {
    $(".add-custom-fields").click();
    numberOfData.push((numberOfData.length - 1) + 1);
    let index = numberOfData[numberOfData.length - 1];
    Id = index;
    AppendFieldsToTable(CustomFieldDetails.FieldName, index, CustomFieldDetails.FieldType, CustomFieldDetails.SubFields, index, CustomFieldDetails.IsEditable, CustomFieldDetails.IsMandatory, Id);
}

function AppendFieldsToTable(FieldName, row, FieldType, SubFields, insertIdex, IsEditable, IsMandatory, Id) {
    i = insertIdex + 1;
    if (!IsEditable)
        IsEditable = IsEditable === "0" ? `disabled="disabled";` : ``;
    else
        IsEditable = "";

    if (!IsMandatory)
        IsMandatory = "";
    else
        IsMandatory = "<span style='color: red;'>*</span>";

    let ContactField = ``;
    if (FieldType === 1) {
        ContactField = `<div class="form-group" id="tdContent_${row}">
                            <label class="frmlbltxt" for="">${FieldName}${IsMandatory}</label>
                            <input type="text" class="form-control" id="ui_txt_CustomField_${Id}" placeholder="${FieldName}" ${IsEditable}>
                        </div>`;
    }
    else if (FieldType === 2) {
        ContactField = `<div class="form-group" id="tdContent_${row}">
                            <label class="frmlbltxt" for="">${FieldName}${IsMandatory}</label>
                            <textarea name="" class="form-control" id="ui_txtArea_CustomField_${Id}" cols="30" rows="2" placeholder="${FieldName}" ${IsEditable}></textarea>
                        </div>`;

    }
    else if (FieldType === 3) {
        let options = "";
        let subFieldList = SubFields.split(",");
        for (var j = 0; j < subFieldList.length; j++) {
            if (subFieldList[j] !== "")
                options += "<option value='" + subFieldList[j] + "'>" + subFieldList[j] + "</option>";
        }

        ContactField = `<div class="form-group" id="tdContent_${row}">
                            <label class="frmlbltxt" for="">${FieldName}${IsMandatory}</label>
                            <select class="form-control" name="" id="ui_drpdwn_CustomField_${Id}" ${IsEditable}>
                                <option value='0'>Select</option>
                                ${options}
                            </select>
                        </div>`;
    }
    else if (FieldType === 4) {
        let options = "";
        let subFieldList = SubFields.split(",");
        for (var j = 0; j < subFieldList.length; j++) {
            if (subFieldList[j] !== "") {
                options += `<div class="custom-control custom-radio custom-control-inline">
                             <input type="radio" class="custom-control-input" id="ui_rad_${row}_${j}" name="ui_rad_CustomField${Id}" value="${subFieldList[j]}" ${IsEditable}>
                             <label class="custom-control-label" for="ui_rad_${row}_${j}">${subFieldList[j]}</label>
                           </div>`;
            }
        }

        ContactField = `<div class="form-check-custom" id="tdContent_${row}">
                                <div class="checkboxtitle">${FieldName}${IsMandatory}</div>
                                ${options}                              
                        </div>`;
    }
    else if (FieldType === 5) {
        let options = "";
        let subFieldList = SubFields.split(",");
        for (var j = 0; j < subFieldList.length; j++) {
            if (subFieldList[j] !== "") {
                options += `<div class="custom-control custom-checkbox custom-control-inline">
                             <input type="checkbox" class="custom-control-input" id="ui_chk_${row}_${j}" name="ui_chk_CustomField${Id}" value="${subFieldList[j]}" ${IsEditable}>
                             <label class="custom-control-label" for="ui_chk_${row}_${j}">${subFieldList[j]}</label>
                           </div>`;
            }
        }

        ContactField = `<div class="form-check-custom" id="tdContent_${row}">
                                <div class="checkboxtitle">${FieldName}${IsMandatory}</div>
                                ${options}                              
                        </div>`;
    }
    else if (FieldType === 6) {
        ContactField = `<div class="form-group" id="tdContent_${row}">
                            <label class="frmlbltxt" for="">${FieldName}${IsMandatory}</label>
                            <input type="text" class="form-control calender" id="ui_dateTime_CustomField${Id}" placeholder="${FieldName}" ${IsEditable}>
                        </div>`;
    }

    $("#ui_CustomFieldAppend").append(ContactField);

    IntializeCalender();
}

IntializeCalender = function () {
    try {
        $(".calender").datepicker({
            showOtherMonths: true,
            selectOtherMonths: true,
            dateFormat: "dd-mm-yy",
            changeMonth: true,
            changeYear: true
        });
    }
    catch (Err) { }
};

IntializePopUpDropDown = function () {
    $('#ui_drpdwn_Country, #ui_drpdwn_Gender, #ui_drpdwn_MartialStatus, #ui_drpdwn_Stage, #ui_drpdwn_LeadLabel, #ui_drpdwn_HandledBy').select2({
        minimumResultsForSearch: '',
        dropdownAutoWidth: false,
        containerCssClass: "border"
    });
};

GetUsersList = function () {
    $.ajax({
        url: "/Prospect/Leads/GetUser",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (userDetails) {
            if (userDetails != null && userDetails != null && userDetails.length > 0) {
                $.each(userDetails, function (i) {
                    if ($(this)[0].ActiveStatus)
                        $("#ui_drpdwn_HandledBy").append($("<option></option>").attr("value", $(this)[0].UserInfoUserId).text($(this)[0].FirstName + " (" + $(this)[0].EmailId + ")").attr("title", $(this)[0].EmailId));
                });
            }
            GetStage();
        },
        error: ShowAjaxError
    });
};

//For getting all stages and stagewise count for leads
function GetStage() {
    $.ajax({
        url: "/Prospect/Leads/GetStageScore",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        success: BindStage,
        error: ShowAjaxError
    });
}

BindStage = function (response) {
    var tdContentDropDown = "";
    if (response.StagesList != null && response.StagesList.length > 0) {
        $.each(response.StagesList, function (i) {
            //For adding stage list in drop down
            tdContentDropDown += "<option value='" + this.Score + "' style='background-color:" + this.IdentificationColor + ";'>" + this.Stage + "</option>";
        });
    }
    $('#ui_drpdwn_Stage').append(tdContentDropDown);
    IntializePopUpDropDown();
};

$('#ui_btn_SubmitCreateContact').click(function () {
    ShowPageLoading();
    $.ajax({
        url: "/ManageContact/ContactImportOverViews/CheckContactSetting/",
        type: 'POST',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != undefined && response != null && response.Status != undefined && response.Status != null && response.Status) {
                HidePageLoading();
                SaveSingleContact();
            }
            else {
                $('#ui_divContactSetting').modal('show');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
});

function SaveSingleContact() {
    //Validation Part
    if ($("#ui_txt_EmailId").val().length === 0 && $("#ui_txt_PhoneNumber").val().length === 0) {
        ShowErrorMessage(GlobalErrorList.CreateContact.addEmailOrPhone);
        return false;
    }
    if ($("#ui_txt_EmailId").val().length > 0 && !regExpEmail.test($("#ui_txt_EmailId").val())) {
        ShowErrorMessage(GlobalErrorList.CreateContact.validEmail);
        $("#ui_txt_AddLeadEmail").focus();
        return false;
    }
    if ($("#ui_txt_PhoneNumber").val().length > 0 && !ValidateMobilNo($("#ui_txt_PhoneNumber").val())) {
        ShowErrorMessage(GlobalErrorList.CreateContact.validPhone);
        $("#ui_txt_PhoneNumber").focus();
        return false;
    }
    if ($("#ui_txt_DomainName").val().length > 0) {
        if (!parent.regExpDomain.test(CleanText($("#ui_txt_DomainName").val()))) {
            ShowErrorMessage(GlobalErrorList.CreateContact.validDomain);
            $("#ui_txt_DomainName").focus();
            return false;
        }
    }
    if ($("#ui_txt_CompanyWebURL").val().length > 0) {
        if (!regExpUrl.test($("#ui_txt_CompanyWebURL").val())) {
            ShowErrorMessage(GlobalErrorList.CreateContact.validComapnyWebUrl);
            $("#ui_txt_CompanyWebURL").focus();
            return false;
        }
    }
    if ($("#ui_drpdwn_Stage").get(0).selectedIndex == 0) {
        ShowErrorMessage(GlobalErrorList.CreateContact.selectStage);
        return false;
    }
    //if ($("#ui_drpdwn_LeadLabel").get(0).selectedIndex == 0) {
    //    ShowErrorMessage(GlobalErrorList.CreateContact.selectLabel);
    //    return false;
    //}

    //new one for validating the leads
    for (var i = 0; i < contactExtraFields.length; i++) {
        if (contactExtraFields[i].IsMandatory === true) {

            if (contactExtraFields[i].FieldType === 1 || contactExtraFields[i].FieldType === 2 || contactExtraFields[i].FieldType === 6) {
                if (contactExtraFields[i].FieldType === 1 && $("#ui_txt_CustomField_" + contactExtraFields[i].Id).val().length === 0) {
                    $("#ui_txt_CustomField_" + contactExtraFields[i].Id).focus();
                    ShowErrorMessage(GlobalErrorList.CreateContact.MandatoryCustomField.replace('[{FieldName}]', contactExtraFields[i].FieldName));
                    return false;
                }

                if (contactExtraFields[i].FieldType === 2 && $("#ui_txtArea_CustomField_" + contactExtraFields[i].Id).val().length === 0) {
                    $("#ui_txtArea_CustomField_" + contactExtraFields[i].Id).focus();
                    ShowErrorMessage(GlobalErrorList.CreateContact.MandatoryCustomField.replace('[{FieldName}]', contactExtraFields[i].FieldName));
                    return false;
                }

                if (contactExtraFields[i].FieldType === 6 && $("#ui_dateTime_CustomField" + contactExtraFields[i].Id).val().length === 0) {
                    $("#ui_dateTime_CustomField" + contactExtraFields[i].Id).focus();
                    ShowErrorMessage(GlobalErrorList.CreateContact.MandatoryCustomField.replace('[{FieldName}]', contactExtraFields[i].FieldName));
                    return false;
                }
            }
            else if (contactExtraFields[i].FieldType === 3) {
                if ($("#ui_drpdwn_CustomField_" + contactExtraFields[i].Id).get(0).selectedIndex === 0) {
                    $("#ui_drpdwn_CustomField_" + contactExtraFields[i].Id).focus();
                    ShowErrorMessage(GlobalErrorList.CreateContact.MandatoryCustomField.replace('[{FieldName}]', contactExtraFields[i].FieldName));
                    return false;
                }
            }
            else if (contactExtraFields[i].FieldType === 4) {
                if (!$("input:radio[name='ui_rad_CustomField" + contactExtraFields[i].Id + "']:checked").val()) {
                    ShowErrorMessage(GlobalErrorList.CreateContact.MandatoryCustomField.replace('[{FieldName}]', contactExtraFields[i].FieldName));
                    return false;
                }
            }
            else if (contactExtraFields[i].FieldType === 5) {
                if (!$("input:checkbox[name='ui_chk_CustomField" + contactExtraFields[i].Id + "']:checked").val()) {
                    ShowErrorMessage(GlobalErrorList.CreateContact.MandatoryCustomField.replace('[{FieldName}]', contactExtraFields[i].FieldName));
                    return false;
                }
            }
        }
    }

    //Saving Part
    ShowPageLoading();
    var contactId = typeof $('#ui_btn_SubmitCreateContact').attr("ContactId") !== typeof undefined && $('#ui_btn_SubmitCreateContact').attr("ContactId") !== false ? $('#ui_btn_SubmitCreateContact').attr("ContactId") : 0;

    contactDetails.UserInfoUserId = contactDetails.LastModifyByUserId = contactDetails.UserGroupId = contactDetails.ContactId = contactDetails.LmsGroupId = contactDetails.AgeRange = contactDetails.Score = 0;
    contactDetails.CustomField1 = contactDetails.CustomField2 = contactDetails.CustomField3 = contactDetails.CustomField4 = contactDetails.CustomField5 = contactDetails.CustomField6 = contactDetails.CustomField7 = contactDetails.CustomField8 = contactDetails.CustomField9 = contactDetails.CustomField10 = "";
    contactDetails.CustomField11 = contactDetails.CustomField12 = contactDetails.CustomField13 = contactDetails.CustomField14 = contactDetails.CustomField15 = contactDetails.CustomField16 = contactDetails.CustomField17 = contactDetails.CustomField18 = contactDetails.CustomField19 = contactDetails.CustomField20 = "";
    contactDetails.CustomField21 = contactDetails.CustomField22 = contactDetails.CustomField23 = contactDetails.CustomField24 = contactDetails.CustomField25 = contactDetails.CustomField26 = contactDetails.CustomField27 = contactDetails.CustomField28 = contactDetails.CustomField29 = contactDetails.CustomField30 = "";
    contactDetails.CustomField31 = contactDetails.CustomField32 = contactDetails.CustomField33 = contactDetails.CustomField34 = contactDetails.CustomField35 = contactDetails.CustomField36 = contactDetails.CustomField37 = contactDetails.CustomField38 = contactDetails.CustomField39 = contactDetails.CustomField40 = "";
    contactDetails.CustomField41 = contactDetails.CustomField42 = contactDetails.CustomField43 = contactDetails.CustomField44 = contactDetails.CustomField45 = contactDetails.CustomField46 = contactDetails.CustomField47 = contactDetails.CustomField48 = contactDetails.CustomField49 = contactDetails.CustomField50 = "";
    contactDetails.CustomField51 = contactDetails.CustomField52 = contactDetails.CustomField53 = contactDetails.CustomField54 = contactDetails.CustomField55 = contactDetails.CustomField56 = contactDetails.CustomField57 = contactDetails.CustomField58 = contactDetails.CustomField59 = contactDetails.CustomField60 = "";
    contactDetails.Remarks = contactDetails.ReminderDate = contactDetails.ToReminderPhoneNumber = contactDetails.ToReminderEmailId = contactDetails.SearchKeyword = contactDetails.PageUrl = contactDetails.Interests = contactDetails.Religion = contactDetails.AlternateEmailIds = contactDetails.AlternatePhoneNumbers = "";
    contactDetails.ReferrerUrl = contactDetails.IsAdSenseOrAdWord = contactDetails.Name = contactDetails.EmailId = contactDetails.PhoneNumber = contactDetails.Location = contactDetails.Gender = contactDetails.MaritalStatus = contactDetails.Education = contactDetails.Occupation = contactDetails.StateName = "";
    contactDetails.Address1 = contactDetails.Address2 = contactDetails.Country = contactDetails.LastName = contactDetails.CompanyName = contactDetails.CompanyWebUrl = contactDetails.CompanyAddress = contactDetails.Projects = contactDetails.DomainName = contactDetails.ContactSource = contactDetails.ZipCode = "";

    //Personal Info
    contactDetails.ContactId = contactId;
    contactDetails.Name = CleanText($("#ui_txt_FirstName").val());
    contactDetails.LastName = CleanText($("#ui_txt_LastName").val());
    contactDetails.EmailId = CleanText($("#ui_txt_EmailId").val());
    contactDetails.AlternateEmailIds = CleanText($("#ui_txt_AlternateEmailId").val());
    contactDetails.PhoneNumber = CleanText($("#ui_txt_PhoneNumber").val());
    contactDetails.AlternatePhoneNumbers = CleanText($("#ui_txt_AlternatePhoneNumber").val());

    // Address Details
    contactDetails.Address1 = CleanText($("#ui_txt_Address1").val());
    contactDetails.Address2 = CleanText($("#ui_txt_Address2").val());
    contactDetails.StateName = CleanText($("#ui_txt_State").val());
    contactDetails.Country = CleanText($("#ui_drpdwn_Country").val()) !== "NULL" ? CleanText($("#ui_drpdwn_Country").val()) : null;
    contactDetails.ZipCode = CleanText($("#ui_txt_PostalCode").val());

    //Demographic Details
    contactDetails.Age = $("#ui_txt_DateOfBirth").val().length > 0 ? CleanText($("#ui_txt_DateOfBirth").val()) : null;
    contactDetails.Gender = CleanText($("#ui_drpdwn_Gender").val()) !== "NULL" ? CleanText($("#ui_drpdwn_Gender").val()) : null;
    contactDetails.MaritalStatus = CleanText($("#ui_drpdwn_MartialStatus").val()) !== "NULL" ? CleanText($("#ui_drpdwn_MartialStatus").val()) : null;
    contactDetails.Education = CleanText($("#ui_txt_Educaton").val());
    contactDetails.Occupation = CleanText($("#ui_txt_Occupation").val());
    contactDetails.Interests = CleanText($("#ui_txt_Interests").val());
    contactDetails.Location = CleanText($("#ui_txt_Location").val());
    contactDetails.Religion = CleanText($("#ui_txt_Religion").val());
    contactDetails.ContactSource = "LeadManagementSystem";

    //Company Details
    contactDetails.CompanyName = CleanText($("#ui_txt_CompanyName").val());
    contactDetails.CompanyWebUrl = CleanText($("#ui_txt_CompanyWebURL").val());
    contactDetails.DomainName = CleanText($("#ui_txt_DomainName").val());
    contactDetails.CompanyAddress = CleanText($("#ui_txt_CompanyAddress").val());
    contactDetails.Projects = CleanText($("#ui_txt_Projects").val());

    contactDetails.Score = $("#ui_drpdwn_Stage").val();
    contactDetails.Remarks = CleanText($("#ui_txtArea_Notes").val());
    contactDetails.LmsGroupId = lmsGroupId;
    contactDetails.IsVerifiedContactNumber = -1;
    contactDetails.LeadLabel = CleanText($("#ui_drpdwn_LeadLabel").val()) != "0" ? CleanText($("#ui_drpdwn_LeadLabel").val()) : null;

    //if (lmsGroupId > 0 && handledBy == parseInt($("#ui_drpdwn_HandledBy").val()))
    //    contactDetails.UserInfoUserId = handledBy;
    //else
    //contactDetails.UserInfoUserId = parseInt($("#ui_drpdwn_HandledBy").val());

    //Make answer list for custom field
    for (var j = 0; j < contactExtraFields.length; j++) {
        if (contactExtraFields[j].FieldType === 1 || contactExtraFields[j].FieldType === 2 || contactExtraFields[j].FieldType === 6) {
            if (contactExtraFields[j].FieldType === 1)
                contactDetails["CustomField" + (j + 1)] = $("#ui_txt_CustomField_" + contactExtraFields[j].Id).val();
            if (contactExtraFields[j].FieldType === 2)
                contactDetails["CustomField" + (j + 1)] = $("#ui_txtArea_CustomField_" + contactExtraFields[j].Id).val();
            if (contactExtraFields[j].FieldType === 6)
                contactDetails["CustomField" + (j + 1)] = $("#ui_dateTime_CustomField" + contactExtraFields[j].Id).val();
        }
        else if (contactExtraFields[j].FieldType === 3) {
            if (parseInt($("#ui_drpdwn_CustomField_" + contactExtraFields[j].Id).val()) !== 0) {
                contactDetails["CustomField" + (j + 1)] = $("#ui_drpdwn_CustomField_" + contactExtraFields[j].Id).val();
            }
        }
        else if (contactExtraFields[j].FieldType === 4) {
            if ($("input:radio[name='ui_rad_CustomField" + contactExtraFields[j].Id + "']:checked").val()) {
                contactDetails["CustomField" + (j + 1)] = $("input:radio[name='ui_rad_CustomField" + contactExtraFields[j].Id + "']:checked").val();
            }
        }
        else if (contactExtraFields[j].FieldType === 5) {
            if ($("input:checkbox[name='ui_chk_CustomField" + contactExtraFields[j].Id + "']:checked").val()) {
                var allCheckedValues = "";
                $("input:checkbox[name='ui_chk_CustomField" + contactExtraFields[j].Id + "']:checked").map(function (i) {
                    if (i === 0)
                        allCheckedValues = $(this).val();
                    else
                        allCheckedValues += " | " + $(this).val();
                });
                contactDetails["CustomField" + (j + 1)] = allCheckedValues;
            }
        }

        if (contactDetails["CustomField" + (j + 1)] === null || contactDetails["CustomField" + (j + 1)] === undefined) {
            contactDetails["CustomField" + (j + 1)] = "";
        }
        answerList.push(contactDetails["CustomField" + (j + 1)]);
    }

    var UserInfoUserId = parseInt($("#ui_drpdwn_HandledBy").val()) > 0 ? parseInt($("#ui_drpdwn_HandledBy").val()) : Plumb5UserId, OldUserInfoUserId = handledBy, isLeadUpdated = 0;
    contactDetails.UserInfoUserId = UserInfoUserId;
    $.ajax({
        url: "/ManageContact/Contact/AddOrUpdateContact",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'contact': contactDetails, 'UserInfoUserId': UserInfoUserId, 'answerList': answerList, 'OldUserInfoUserId': OldUserInfoUserId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status) {
                if (response.Id === -1)
                    ShowErrorMessage(GlobalErrorList.CreateContact.contactexists);
                else if (response.Id === -2)
                    ShowErrorMessage(GlobalErrorList.CreateContact.invalidDetails);
                else {
                    if (response.UpdatedStatus) {
                        ShowSuccessMessage(GlobalErrorList.CreateContact.updateSuccess);
                        isLeadUpdated = 1;
                    }
                    else {
                        ShowSuccessMessage(GlobalErrorList.CreateContact.addSuccess);
                        TotalRowCount++;
                        $('#spnCount').html(TotalRowCount);
                        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
                    }

                    ClearCreateContactFields();

                    if (lmsGroupId == 0) {
                        $("#close-popup").click();
                        var getFlatter = response.mLContact.Name !== null && response.mLContact.Name !== undefined ? response.mLContact.Name.substring(0, 1) : "";
                        var verificationStatusImg = "", exportVefified = "";
                        if (response.mLContact.IsVerifiedMailId == "-1") {
                            verificationStatusImg = "icon ion-help-circled";
                            exportVefified = "Not Verified";
                        } else if (response.mLContact.IsVerifiedMailId == "0") {
                            verificationStatusImg = "icon ion-android-alert verifalert";
                            exportVefified = "Invalid";
                        }
                        else if (response.mLContact.IsVerifiedMailId == "1") {
                            verificationStatusImg = "icon ion-android-checkmark-circle verifsuccess";
                            exportVefified = "Valid";
                        }
                        var reportTableTrs = '<tr>' +
                            '<td  class="td-wid-5 pl-0"><div class="chbxWrap"><label class="ckbox"><input class="selChk" value="' + response.mLContact.ContactId + '" type="checkbox"><span></span></label></div></td>' +
                            '<td class="text-left h-100">' +
                            '<div class="nameWrap">' +
                            '<div class="nameAlpWrap">' +
                            '<span class="nameAlpha">' + getFlatter + '</span>' +
                            '</div>' +
                            '<div class="nameTxtWrap">' +
                            '<span class="nameTxt">' + (response.mLContact.Name !== null ? response.mLContact.Name : "") + '</span>' +
                            '</div>' +
                            '</div>' +
                            '</td>' +
                            '<td>' + (response.mLContact.EmailId !== null ? response.mLContact.EmailId : "") + '</td>' +
                            '<td>' + (response.mLContact.PhoneNumber !== null ? response.mLContact.PhoneNumber : "") + '</td>' +
                            '<td class="text-center verified"><i title="' + exportVefified + '" class="' + verificationStatusImg + '"></i></td>' +
                            '<td>' + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response.mLContact.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(response.mLContact.CreatedDate)) + '</td>' +
                            '</tr>';
                        $('#ui_tbodyReportData tr:last').remove();
                        $('#ui_tbodyReportData').prepend(reportTableTrs);
                    }
                    else {
                        handledBy = 0;
                        HideCustomPopUp("dv_CreateLead");
                        var reportTableTrs = LeadsUtil.BindingContent(response.mLContact);
                        if (isLeadUpdated == 0 && $("#ui_div_" + response.mLContact.ContactId).length == 0) {
                            $('#ui_tbodyReportData tr:last').remove();
                            $('#ui_tbodyReportData').prepend("<tr id='ui_div_" + response.mLContact.ContactId + "'>" + reportTableTrs + "</tr>");
                        }
                        else if (isLeadUpdated == 1 && $("#ui_div_" + response.mLContact.ContactId).length == 0) {
                            $('#ui_tbodyReportData tr:last').remove();
                            $('#ui_tbodyReportData').prepend("<tr id='ui_div_" + response.mLContact.ContactId + "'>" + reportTableTrs + "</tr>");
                        }
                        else {
                            $("#ui_div_" + response.mLContact.ContactId).removeClass("activeBgRow");
                            $("#ui_div_" + response.mLContact.ContactId).empty();
                            $("#ui_div_" + response.mLContact.ContactId).append(reportTableTrs);
                        }
                        LeadsUtil.InitialiseActionsTabClick();
                        LeadsUtil.InitialiseActionsClick();
                        RowCheckboxClick();
                    }
                }
            }
            else {
                ShowErrorMessage(GlobalErrorList.CreateContact.unknownError);
            }
            $('#ui_btn_SubmitCreateContact').removeAttr("ContactId");
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}

function ClearCreateContactFields() {
    $("#ui_txt_FirstName").val("");
    $("#ui_txt_LastName").val("");
    $("#ui_txt_EmailId").val("");
    $("#ui_txt_AlternateEmailId").val("");
    $("#ui_txt_PhoneNumber").val("");
    $("#ui_txt_AlternatePhoneNumber").val("");
    $("#ui_txt_Address1").val("");
    $("#ui_txt_Address2").val("");
    $("#ui_txt_State").val("");
    $("#ui_drpdwn_Country").select2().val("NULL").trigger('change');
    $("#ui_txt_PostalCode").val("");
    $("#ui_txt_DateOfBirth").val("");
    $("#ui_drpdwn_Gender").select2().val("NULL").trigger('change');
    $("#ui_drpdwn_MartialStatus").select2().val("NULL").trigger('change');
    $("#ui_txt_Educaton").val("");
    $("#ui_txt_Occupation").val("");
    $("#ui_txt_Interests").val("");
    $("#ui_txt_Location").val("");
    $("#ui_txt_Religion").val("");
    $("#ui_txt_CompanyName").val("");
    $("#ui_txt_CompanyWebURL").val("");
    $("#ui_txt_DomainName").val("");
    $("#ui_txt_CompanyAddress").val("");
    $("#ui_txt_Projects").val("");
    $("#ui_drpdwn_Stage").select2().val(-1).trigger('change');
    $("#ui_drpdwn_LeadLabel").select2().val(0).trigger('change');
    $("#ui_drpdwn_HandledBy").select2().val(0).trigger('change');
    $("#ui_txtArea_Notes").val("");
    //Custom field clearing
    if (contactExtraFields.length > 0) {
        for (var i = 0; i < contactExtraFields.length; i++) {
            if (contactExtraFields[i].FieldType === 1)
                $("#ui_txt_CustomField_" + contactExtraFields[i].Id).val("");
            else if (contactExtraFields[i].FieldType === 2)
                $("#ui_txtArea_CustomField_" + contactExtraFields[i].Id).val("");
            else if (contactExtraFields[i].FieldType === 3)
                $("#ui_drpdwn_CustomField_" + contactExtraFields[i].Id).val(0);
            else if (contactExtraFields[i].FieldType === 4)
                $('input:radio[name=ui_rad_CustomField' + contactExtraFields[i].Id + ']').prop('checked', false);
            else if (contactExtraFields[i].FieldType === 5)
                $('input:checkbox[name=ui_chk_CustomField' + contactExtraFields[i].Id + ']').prop('checked', false);
            else if (contactExtraFields[i].FieldType === 6)
                $("#ui_dateTime_CustomField" + contactExtraFields[i].Id).val("");
        }
    }
}

$(".add-custom-fields").click(function () {
    $(".popupbody").toggleClass('addblur');
    $(".addcustomfieldWrap").toggleClass("hideDiv");
});

//$("#btnCustomField").click(function () {
//    $('#ui_radNotMandatory').prop('checked', 'true');
//    $(".popuptitlwrp h6").html("Add Custom Fields");
//    $("#lmscreatelead").hide();
//    BindCustomFields();
//    $("#lmsaddcustfield").removeClass("hideDiv");
//});

$(".addcustomclose").click(function () {
    $(".popuptitlwrp h6").html("Create Lead");
    $("#lmscreatelead").show();
    $("#lmsaddcustfield").addClass("hideDiv");
});

$("#close-popup,#btnCancelCreateContact").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
});
// Email Id Text change to show spinner image
$("#ui_txt_EmailId").on('input', function () {
    $(".lmsemailinptwrp .lmsspinner").removeClass("hideDiv");
    if ($('#ui_txt_EmailId').attr('data-emailedit') == 'false' || $("#ui_txt_EmailId").val() == 0) {
        if ($("#ui_txt_EmailId").val().length == 0) {
            // Clear All fields,Hide extra fields and change heading title
            $('.lmsemailinptwrp .lmsspinner').addClass("hideDiv");
            var phn = $("#ui_txt_PhoneNumber").val();
            if (phn == '') {
                ClearCreateContactFields();
                $("#ui_txt_PhoneNumber").val(phn);
                $(".popuptitle h6,#ui_btn_SubmitCreateContact").html("Create Lead");
                $('.addleadmoredetwrp').addClass("hideDiv");
                $(".lmsbtn-create").attr("disabled", "disabled");
                $(".popupsubtitle").html('');
                $('#ui_txt_EmailId').attr('data-emailedit', 'false');
                $('#ui_txt_PhoneNumber').attr('data-phonenumedit', 'false');
            }

        }
    }

});
// Phone Number Text change to show spinner image
$("#ui_txt_PhoneNumber").on('input', function () {
    $('.lmsphneinptwrp .lmsspinner').removeClass("hideDiv");
    if ($('#ui_txt_PhoneNumber').attr('data-phonenumedit') == 'false' || $("#ui_txt_PhoneNumber").val() == 0) {
        if ($("#ui_txt_PhoneNumber").val().length == 0) {
            $('.lmsphneinptwrp .lmsspinner').addClass("hideDiv");
            var mailvar = $('#ui_txt_EmailId').val();
            if (mailvar == '') {
                ClearCreateContactFields();
                $('#ui_txt_EmailId').val(mailvar);
                $(".popuptitle h6,#ui_btn_SubmitCreateContact").html("Create Lead");
                $('.addleadmoredetwrp').addClass("hideDiv");
                $(".lmsbtn-create").attr("disabled", "disabled");
                $(".popupsubtitle").html('');
                $('#ui_txt_EmailId').attr('data-emailedit', 'false');
                $('#ui_txt_PhoneNumber').attr('data-phonenumedit', 'false');
            }
        }
    }
});

//Email Id Focus out function to check email id exist and email id associate users
$("#ui_txt_EmailId").focusout(function () {
    $(".lmsemailinptwrp  .lmsspinner").addClass("hideDiv");
    var emailid = $('#ui_txt_EmailId').val();

    if ($('#ui_txt_EmailId').attr('data-emailedit') == 'false') {
        ClearCreateContactFields();
        $('#ui_txt_EmailId').val(emailid);
        if ($("#ui_txt_EmailId").val().length > 0 && !regExpEmail.test($("#ui_txt_EmailId").val())) {
            ShowErrorMessage(GlobalErrorList.CreateContact.validEmail);
            $('.addleadmoredetwrp').addClass("hideDiv");
            $(".lmsbtn-create").attr("disabled", "disabled");
            $(".popuptitle h6,#ui_btn_SubmitCreateContact").html("Create Lead");
            $(".popupsubtitle").html('');
        }
        else {
            if ($("#ui_txt_EmailId").val().length > 0)
                CheckContactExistence();
        }
    }
});
$("#ui_txt_PhoneNumber").focusout(function () {
    $(".lmsphneinptwrp  .lmsspinner").addClass("hideDiv");
    var phonenumber = $('#ui_txt_PhoneNumber').val();
    //var email = $('#ui_txt_EmailId').val();

    if ($('#ui_txt_PhoneNumber').attr('data-phonenumedit') == 'false') {
        ClearCreateContactFields();
        $('#ui_txt_PhoneNumber').val(phonenumber);
        //$('#ui_txt_EmailId').val(email);

        if ($("#ui_txt_PhoneNumber").val().length > 0)
            CheckContactExistence();

    }
});

function CheckContactExistence() {
    $('#ui_txt_EmailId').attr('data-emailedit', 'true');
    $('#ui_txt_PhoneNumber').attr('data-phonenumedit', 'true');
    $.ajax({
        url: "/General/GetContactDetails",
        type: 'Post',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'UserId': Plumb5UserId, 'EmailId': $('#ui_txt_EmailId').val(), 'PhoneNumber': $('#ui_txt_PhoneNumber').val() }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.contact != null && response.contact != undefined) {
                var ContactDetails = response.contact.Name != "null" && response.contact.EmailId != "null" ? "" + response.contact.Name + " - (" + response.contact.EmailId + ")" : response.contact.Name != "null" && response.contact.EmailId == "null" ? "" + response.contact.Name + "" : response.contact.Name == "null" && response.contact.EmailId != "null" ? "" + response.contact.EmailId + "" : "";
                $(".popupsubtitle").html(ContactDetails);

                if (window.location.href.indexOf('/ManageContact/Contact') > 0) {
                    $("#ui_btn_SubmitCreateContact").html("Update Contact");
                    $(".popuptitle h6").html("Edit Contact");
                }

                if (window.location.href.indexOf('/Prospect/Leads') > 0) {
                    $("#ui_btn_SubmitCreateContact").html("Update Lead");
                    $(".popuptitle h6").html("Edit Lead");
                }
                $(".lmsbtn-create").removeAttr("disabled");
                $('#ui_btn_SubmitCreateContact').attr("ContactId", response.contact.ContactId);
                $(".addleadmoredetwrp").removeClass("hideDiv");
                $(".ion-ios-checkmark-outline").addClass("hideDiv");

                if (response.contact.Name !== null)
                    $("#ui_txt_FirstName").val(response.contact.Name);
                if (response.contact.LastName !== null)
                    $("#ui_txt_LastName").val(response.contact.LastName);
                if (response.contact.EmailId !== null)
                    $("#ui_txt_EmailId").val(response.contact.EmailId);
                if (response.contact.AlternateEmailIds !== null)
                    $("#ui_txt_AlternateEmailId").val(response.contact.AlternateEmailIds);
                if (response.contact.PhoneNumber !== null)
                    $("#ui_txt_PhoneNumber").val(response.contact.PhoneNumber);
                if (response.contact.AlternatePhoneNumbers !== null)
                    $("#ui_txt_AlternatePhoneNumber").val(response.contact.AlternatePhoneNumbers);
                if (response.contact.Address1 !== null)
                    $("#ui_txt_Address1").val(response.contact.Address1);
                if (response.contact.Address2 !== null)
                    $("#ui_txt_Address2").val(response.contact.Address2);
                if (response.contact.StateName !== null)
                    $("#ui_txt_State").val(response.contact.StateName);
                if (response.contact.Country !== null)
                    $("#ui_drpdwn_Country").select2().val(response.contact.Country).trigger('change');
                if (response.contact.PostalCode !== null)
                    $("#ui_txt_PostalCode").val(response.contact.PostalCode);
                if (response.contact.Age !== null)
                    $("#ui_txt_DateOfBirth").val($.datepicker.formatDate("yy-mm-dd", GetJavaScriptDateObj(response.contact.Age)));
                if (response.contact.Gender !== null)
                    $("#ui_drpdwn_Gender").select2().val(response.contact.Gender).trigger('change');
                if (response.contact.MaritalStatus !== null)
                    $("#ui_drpdwn_MartialStatus").select2().val(response.contact.MaritalStatus).trigger('change');
                if (response.contact.Education !== null)
                    $("#ui_txt_Educaton").val(response.contact.Education);
                if (response.contact.Occupation !== null)
                    $("#ui_txt_Occupation").val(response.contact.Occupation);
                if (response.contact.Interests !== null)
                    $("#ui_txt_Interests").val(response.contact.Interests);
                if (response.contact.Location !== null)
                    $("#ui_txt_Location").val(response.contact.Location);
                if (response.contact.Religion !== null)
                    $("#ui_txt_Religion").val(response.contact.Religion);
                if (response.contact.CompanyName !== null)
                    $("#ui_txt_CompanyName").val(response.contact.CompanyName);
                if (response.contact.CompanyWebUrl !== null)
                    $("#ui_txt_CompanyWebURL").val(response.contact.CompanyWebUrl);
                if (response.contact.DomainName !== null)
                    $("#ui_txt_DomainName").val(response.contact.DomainName);
                if (response.contact.CompanyAddress !== null)
                    $("#ui_txt_CompanyAddress").val(response.contact.CompanyAddress);
                if (response.contact.Projects !== null)
                    $("#ui_txt_Projects").val(response.contact.Projects);
                if (response.contact.Score !== null)
                    $("#ui_drpdwn_Stage").select2().val(response.contact.Score).trigger('change');
                if (response.contact.LeadLabel !== null)
                    $("#ui_drpdwn_LeadLabel").select2().val(response.contact.LeadLabel).trigger('change');
                if (response.contact.UserInfoUserId !== null)
                    $("#ui_drpdwn_HandledBy").select2().val(response.contact.UserInfoUserId).trigger('change');

                if (window.location.href.indexOf('/ManageContact/Contact') > 0)
                    lmsGroupId = 0;
                else {
                    if (response.contact.LmsGroupId != undefined && response.contact.LmsGroupId != null && response.contact.LmsGroupId > 0)
                        lmsGroupId = response.contact.LmsGroupId;
                    else
                        lmsGroupId = 2;
                }


                handledBy = response.contact.UserInfoUserId;

                if (contactExtraFields.length > 0) {
                    for (var j = 0; j < contactExtraFields.length; j++) {
                        if (contactExtraFields[j].FieldType === 1 || contactExtraFields[j].FieldType === 2 || contactExtraFields[j].FieldType === 6) {
                            if (contactExtraFields[j].FieldType === 1 && response.contact["CustomField" + (j + 1)] !== null && response.contact["CustomField" + (j + 1)] !== undefined)
                                $("#ui_txt_CustomField_" + contactExtraFields[j].Id).val(response.contact["CustomField" + (j + 1)]);
                            if (contactExtraFields[j].FieldType === 2 && response.contact["CustomField" + (j + 1)] !== null && response.contact["CustomField" + (j + 1)] !== undefined)
                                $("#ui_txtArea_CustomField_" + contactExtraFields[j].Id).val(response.contact["CustomField" + (j + 1)]);
                            if (contactExtraFields[j].FieldType === 6 && response.contact["CustomField" + (j + 1)] !== null && response.contact["CustomField" + (j + 1)] !== undefined)
                                $("#ui_dateTime_CustomField" + contactExtraFields[j].Id).val(response.contact["CustomField" + (j + 1)]);
                        }
                        else if (contactExtraFields[j].FieldType === 3 && response.contact["CustomField" + (j + 1)] !== null && response.contact["CustomField" + (j + 1)] !== undefined && response.contact["CustomField" + (j + 1)].length > 0) {
                            $("#ui_drpdwn_CustomField_" + contactExtraFields[j].Id).val(response.contact["CustomField" + (j + 1)]);
                        }
                        else if (contactExtraFields[j].FieldType === 4 && response.contact["CustomField" + (j + 1)] !== null && response.contact["CustomField" + (j + 1)] !== undefined && response.contact["CustomField" + (j + 1)].length > 0) {
                            $("input:radio[name='ui_rad_CustomField" + contactExtraFields[j].Id + "']:checked").val(response.contact["CustomField" + (j + 1)]);
                        }
                        else if (contactExtraFields[j].FieldType === 5 && response.contact["CustomField" + (j + 1)] !== null && response.contact["CustomField" + (j + 1)] !== undefined && response.contact["CustomField" + (j + 1)].length > 0) {
                            var checkedData = response.contact["CustomField" + (j + 1)].split("|");
                            for (var a = 0; a < checkedData.length; a++)
                                $("input:checkbox[name='ui_chk_CustomField" + contactExtraFields[j].Id + "'][value='" + $.trim(checkedData[a]) + "']").prop("checked", true);
                        }
                    }
                }
            }
            else {
                handledBy = 0;
                if (response.AssociatedUserStatus == true) {
                    $(".addleadmoredetwrp").removeClass("hideDiv");
                    $(".lmsbtn-create").removeAttr("disabled");
                    $(".popuptitle h6,#ui_btn_SubmitCreateContact").html("Creat Lead");
                    $(".popupsubtitle").html('');
                }
                else {
                    if ($("#ui_txt_EmailId").val().length > 0)
                        ShowErrorMessage(GlobalErrorList.CreateContact.EmailExistAssociateWithOtherUser);

                    if ($("#ui_txt_PhoneNumber").val().length > 0)
                        ShowErrorMessage(GlobalErrorList.CreateContact.PhoneNumExistAssociateWithOtherUser);

                    $(".addleadmoredetwrp").addClass("hideDiv");
                    $(".lmsbtn-create").attr("disabled", "disabled");
                }
            }

        },
        error: ShowAjaxError
    });
}
