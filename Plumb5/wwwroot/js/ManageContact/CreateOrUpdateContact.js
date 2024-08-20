var IsPropertySetting = false;
var ContactPropertyList = [];
var LmsCustomFieldList = [];
var EmailPropertyFieldId = "";
var PhonePropertyFieldId = "";

var LastTimeEmailValue = "";
var LastTimePhoneValue = "";
var AddToGroupId = 0;
var leadresponsedetails = "";

var lmsgroupmemberDetails = {
    lmscustomfield1: "", lmscustomfield2: "", lmscustomfield3: "", lmscustomfield4: "", lmscustomfield5: "",
    lmscustomfield6: "", lmscustomfield7: "", lmscustomfield8: "", lmscustomfield9: "", lmscustomfield10: "",
    lmscustomfield11: "", lmscustomfield12: "", lmscustomfield13: "", lmscustomfield14: "", lmscustomfield15: ""
};

var contactDetails = {
    ContactId: 0, Name: "", LastName: "", AgeRange1: 0, AgeRange2: 0, Education: "", Gender: "", Occupation: "", MaritalStatus: "",
    Location: "", Interests: "", UtmTagSource: "", FirstUtmMedium: "", FirstUtmCampaign: "", FirstUtmTerm: "", FirstUtmContent: "", Unsubscribe: null,
    OptInOverAllNewsLetter: null, IsSmsUnsubscribe: null, SmsOptInOverAllNewsLetter: null, AccountType: "", DateRange1: "", DateRange2: "",
    IsAccountHolder: null, AccountOpenedSource: "", LastActivityLoginDate: null, LastActivityLoginSource: "",
    CustomerScore: "", AccountAmount: "", IsCustomer: null, IsMoneyTransferCustomer: null, IsReferred: null, IsGoalSaver: null, IsReferredOpenedAccount: null,
    IsComplaintRaised: null, ComplaintType: "", CustomField1: "", CustomField2: "", CustomField3: "",
    CustomField4: "", CustomField5: "", CustomField6: "", CustomField7: "", CustomField8: "", CustomField9: "", CustomField10: "", CustomField11: "",
    CustomField12: "", CustomField13: "", CustomField14: "", CustomField15: "", CustomField16: "", CustomField17: "", CustomField18: "", CustomField19: "",
    CustomField20: "", CustomField21: "", CustomField22: "", CustomField23: "", CustomField24: "", CustomField25: "", CustomField26: "",
    CustomField27: "", CustomField28: "", CustomField29: "", CustomField30: "", CustomField31: "", CustomField32: "", CustomField33: "", CustomField34: "",
    CustomField35: "", CustomField36: "", CustomField37: "", CustomField38: "", CustomField39: "", CustomField40: "", CustomField41: "", CustomField42: "",
    CustomField43: "", CustomField44: "", CustomField45: "", CustomField46: "", CustomField47: "", CustomField48: "", CustomField49: "", CustomField50: "",
    CustomField51: "", CustomField52: "", CustomField53: "", CustomField54: "", CustomField55: "", CustomField56: "", CustomField57: "", CustomField58: "",
    CustomField59: "", CustomField60: "", CustomField61: "", CustomField62: "", CustomField63: "", CustomField64: "", CustomField65: "",
    CustomField66: "", CustomField67: "", CustomField68: "", CustomField69: "", CustomField70: "", CustomField71: "", CustomField72: "", CustomField73: "", CustomField74: "", CustomField75: "", CustomField76: "",
    CustomField77: "", CustomField78: "", CustomField79: "", CustomField80: "", CustomField81: "", CustomField82: "", CustomField83: "", CustomField84: "", CustomField85: "", CustomField86: "", CustomField87: "", CustomField88: "",
    CustomField89: "", CustomField90: "", CustomField91: "", CustomField92: "", CustomField93: "", CustomField94: "", CustomField95: "", CustomField96: "", CustomField97: "", CustomField98: "", CustomField99: "", CustomField100: "", Revenue: 0, ClouserDate: null,
    LmsCustomField1: "", LmsCustomField2: "", LmsCustomField3: "", LmsCustomField4: "", LmsCustomField5: "",
    LmsCustomField6: "", LmsCustomField7: "", LmsCustomField8: "", LmsCustomField9: "", LmsCustomField10: "",
    LmsGroupmemberId: 0, Publisher: "", PrimaryPublisher: "", AllPublisher: ""
};

$(document).ready(() => {
    ContactPropertyList.length = 0;
    ContactManageUtil.GetContactPropertyList();
});

var ContactManageUtil = {
    GetContactPropertyList: function () {
        $.ajax({
            url: "/ManageContact/Contact/GetContactPropertyList",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    IsPropertySetting = true;
                    $("#ui_formContactProperty").html('');
                    //ContactPropertyList = response;
                    for (var i = 0; i < response.length; i++) {
                        if (window.location.href.indexOf('/ManageContact/Contact') > 0) {
                            if (response[i].DisplayName.toLowerCase() != "source" && response[i].DisplayName.toLowerCase() != "stage" && response[i].DisplayName.toLowerCase() != "lead label" && response[i].DisplayName.toLowerCase() != "handled by") {
                                ContactPropertyList.push(response[i]);
                                ContactManageUtil.BindContactProperty(response[i]);
                            }
                        }
                        else if (window.location.href.indexOf('/Prospect/Leads') > 0) {

                            if (response[i].PropertyName == "Score") {
                                response[i].IsMandatory = true;
                            }

                            ContactPropertyList.push(response[i]);
                            ContactManageUtil.BindContactProperty(response[i]);
                        }
                        else {
                            ContactPropertyList.push(response[i]);
                            ContactManageUtil.BindContactProperty(response[i]);
                        }
                    }

                    if (window.location.href.indexOf('/Prospect/Leads') > 0) {
                        ContactManageUtil.GetCustomFieldsPropertyList();
                    }

                    ContactManageUtil.IntializeCalender();
                    ContactManageUtil.ClearContactFields();
                    BindSearch();
                }
            },
            error: ShowAjaxError
        });
    },
    BindContactProperty: function (PropertyItem) {
        var MandatoryElement = "";
        var DivElement = "";
        if (PropertyItem.IsMandatory) {
            MandatoryElement = "<span style='color: red;'>*</span>";
        }

        if (PropertyItem.FieldType == 1) {
            DivElement = `<div class="form-group" id="ui_divContactElement${PropertyItem.PropertyId}">
                            <label class="frmlbltxt">${PropertyItem.DisplayName}${MandatoryElement}</label>
                            <input type="text" class="form-control" id="ui_ContactElement${PropertyItem.PropertyId}" placeholder="${PropertyItem.DisplayName}" />
                        </div>`;

            if (PropertyItem.PropertyName == "EmailId" || PropertyItem.PropertyName == "PhoneNumber") {
                if (PropertyItem.PropertyName == "EmailId") {
                    DivElement = `<div class="form-group" id="ui_divContactElement${PropertyItem.PropertyId}">
                                    <label class="frmlbltxt">${PropertyItem.DisplayName}${MandatoryElement}</label>
                                    <div class="lmsemailinptwrp">
                                        <input type="email" class="form-control" id="ui_ContactElement${PropertyItem.PropertyId}" placeholder="${PropertyItem.DisplayName}" data-emailedit="false" />
                                        <div id="ui_divEmailSpinner" class="lmsspinner hideDiv"></div>
                                    </div>
                                    </div>`;
                    $(document).on("input", "#ui_ContactElement" + PropertyItem.PropertyId, function () {
                        ContactManageUtil.EmailTextFocus("ui_ContactElement" + PropertyItem.PropertyId);
                    });

                    $(document).on("focusout", "#ui_ContactElement" + PropertyItem.PropertyId, function () {
                        ContactManageUtil.EmailTextFocusOut("ui_ContactElement" + PropertyItem.PropertyId);
                    });
                    EmailPropertyFieldId = "#ui_ContactElement" + PropertyItem.PropertyId;
                } else {
                    DivElement = `<div class="form-group" id="ui_divContactElement${PropertyItem.PropertyId}">
                                    <label class="frmlbltxt">${PropertyItem.DisplayName}${MandatoryElement}</label>
                                    <div class="lmsphneinptwrp">
                                        <input type="text" class="form-control" id="ui_ContactElement${PropertyItem.PropertyId}" placeholder="${PropertyItem.DisplayName}" data-phonenumedit="false" maxlength="13" onkeydown="if(event.ctrlKey && event.keyCode==86){return false;}" onkeypress="return onlyPhoneNumbersDetails(event);" />
                                        <div id="ui_divSmsSpinner" class="lmsspinner hideDiv"></div>
                                    </div>
                                    </div>`;
                    $(document).on("input", "#ui_ContactElement" + PropertyItem.PropertyId, function () {
                        ContactManageUtil.PhoneTextFocus("ui_ContactElement" + PropertyItem.PropertyId);
                    });

                    $(document).on("focusout", "#ui_ContactElement" + PropertyItem.PropertyId, function () {
                        ContactManageUtil.PhoneTextFocusOut("ui_ContactElement" + PropertyItem.PropertyId);
                    });
                    PhonePropertyFieldId = "#ui_ContactElement" + PropertyItem.PropertyId;
                }
            }
        } else if (PropertyItem.FieldType == 2) {
            DivElement = `<div class="form-group" id="ui_divContactElement${PropertyItem.PropertyId}">
                            <label class="frmlbltxt">${PropertyItem.DisplayName}${MandatoryElement}</label>
                            <textarea class="form-control" id="ui_ContactElement${PropertyItem.PropertyId}" cols="30" rows="2" placeholder="${PropertyItem.DisplayName}"></textarea>
                        </div>`;
        } else if (PropertyItem.FieldType == 3) {
            let SelectOptions = "";
            var FieldOption = JSON.parse(PropertyItem.FieldOption);

            for (var j = 0; j < FieldOption.length; j++) {
                SelectOptions += "<option value='" + FieldOption[j].Value + "'>" + FieldOption[j].Name + "</option>";
            }

            DivElement = `<div class="form-group" id="ui_divContactElement${PropertyItem.PropertyId}">
                            <label class="frmlbltxt">${PropertyItem.DisplayName}${MandatoryElement}</label>
                            <select class="form-control addCampName" id="ui_ContactElement${PropertyItem.PropertyId}">
                                <option value='-1'>Select ${PropertyItem.DisplayName}</option>
                                ${SelectOptions}
                            </select>
                        </div>`;

            if (PropertyItem.PropertyName == "LmsGroupId") {
                DivElement = `<div id='dvSource'>` + DivElement + `<div class="form-group" id="ui_divContactElement_st_${PropertyItem.PropertyId}">
                            <label class="frmlbltxt">Source Type</label>
                            <select class="form-control addCampName addsourceType" disabled="yes" id="ui_ContactElement_st_${PropertyItem.PropertyId}">
                                <option value='0'>Create and Stay</option>
                                <option value='1'>Override</option>
                                <option value='2'>Create New</option>
                            </select>
                        </div><div>`;
            }

        } else if (PropertyItem.FieldType == 4) {
            let SelectOptions = "";
            var FieldOption = JSON.parse(PropertyItem.FieldOption);
            for (var j = 0; j < FieldOption.length; j++) {
                SelectOptions += `<div class="custom-control custom-radio custom-control-inline">
                             <input type="radio" class="custom-control-input" id="ui_ContactElement${PropertyItem.PropertyId}_${j}" name="ui_ContactElement${PropertyItem.PropertyId}" value="${FieldOption[j].Value}">
                             <label class="custom-control-label" for="ui_ContactElement${PropertyItem.PropertyId}_${j}">${FieldOption[j].Name}</label>
                           </div>`;
            }

            DivElement = `<div class="form-check-custom" id="ui_divContactElement${PropertyItem.PropertyId}">
                                <div class="checkboxtitle">${PropertyItem.DisplayName}${MandatoryElement}</div>
                                ${SelectOptions}                          
                            </div>`;
        } else if (PropertyItem.FieldType == 5) {
            let SelectOptions = "";
            var FieldOption = JSON.parse(PropertyItem.FieldOption);
            for (var j = 0; j < FieldOption.length; j++) {
                SelectOptions += `<div class="custom-control custom-checkbox custom-control-inline">
                             <input type="checkbox" class="custom-control-input" id="ui_ContactElement${PropertyItem.PropertyId}_${j}" name="ui_ContactElement${PropertyItem.PropertyId}" value="${FieldOption[j].Value}">
                             <label class="custom-control-label" for="ui_ContactElement${PropertyItem.PropertyId}_${j}">${FieldOption[j].Name}</label>
                           </div>`;
            }

            DivElement = `<div class="form-check-custom" id="ui_divContactElement${PropertyItem.PropertyId}">
                                <div class="checkboxtitle">${PropertyItem.DisplayName}${MandatoryElement}</div>
                                ${SelectOptions}                                 
                        </div>`;
        } else if (PropertyItem.FieldType == 6) {
            DivElement = `<div class="form-group" id="ui_divContactElement${PropertyItem.PropertyId}">
                            <label class="frmlbltxt">${PropertyItem.DisplayName}${MandatoryElement}</label>
                            <input type="text" class="form-control calender" id="ui_ContactElement${PropertyItem.PropertyId}" placeholder="${PropertyItem.DisplayName}" />
                        </div>`;
        }

        $("#ui_formContactProperty").append(DivElement);
    },
    GetCustomFieldsPropertyList: function () {
        $.ajax({
            url: "/ManageContact/Contact/GetLmsCustomFieldList",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (responsedata) {
                var response = responsedata.Data
                if (response != undefined && response != null && response.length > 0) {
                    //ContactPropertyList = response;
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].FieldName.toLowerCase() != "publisher" && response[i].FieldName.toLowerCase() != "primarypublisher" && response[i].FieldName.toLowerCase() != "allpublisher") {
                            if (window.location.href.indexOf('/Prospect/Leads') > 0) {
                                LmsCustomFieldList.push(response[i]);
                                ContactManageUtil.BindLmsCustomProperty(response[i]);
                            }
                        }
                    }
                }
            },
            error: ShowAjaxError
        });
    },
    BindLmsCustomProperty: function (PropertyItem) {

        var DivElement = `<div class="form-group" id="ui_divlmsContactElement${PropertyItem.Id}">
                            <label class="frmlbltxt">${PropertyItem.FieldDisplayName}</label>
                            <input type="text" class="form-control" id="ui_lmsContactElement${PropertyItem.Id}" placeholder="${PropertyItem.FieldDisplayName}" />
                        </div>`;

        $("#ui_formContactProperty").append(DivElement);
    },
    IntializeCalender: function () {
        try {
            $(".calender").datepicker({
                dateFormat: "yy-mm-dd",
                prevText: "click for previous months",
                nextText: "click for next months",
                showOtherMonths: true,
                selectOtherMonths: false
            });
        }
        catch (Err) { }
    },
    ValidateContactFields: function () {
        ShowPageLoading();
        var IsEmailValid = false;
        var IsPhoneValid = false;
        if (ContactPropertyList != undefined && ContactPropertyList != null && ContactPropertyList.length > 0) {
            for (var i = 0; i < ContactPropertyList.length; i++) {
                if (ContactPropertyList[i].PropertyName == "EmailId") {
                    if ($("#ui_ContactElement" + ContactPropertyList[i].PropertyId).val().length == 0) {
                        IsEmailValid = false;
                    }
                    else if ($("#ui_ContactElement" + ContactPropertyList[i].PropertyId).val().length > 0 && !regExpEmail.test($("#ui_ContactElement" + ContactPropertyList[i].PropertyId).val())) {
                        IsEmailValid = false;
                        $("#ui_ContactElement" + ContactPropertyList[i].PropertyId).focus();
                        ShowErrorMessage(GlobalErrorList.CreateContact.validEmail);
                        return false;
                    } else {
                        IsEmailValid = true;
                    }
                } else if (ContactPropertyList[i].PropertyName == "PhoneNumber") {
                    if ($("#ui_ContactElement" + ContactPropertyList[i].PropertyId).val().length == 0) {
                        IsPhoneValid = false;
                    }
                    else if ($("#ui_ContactElement" + ContactPropertyList[i].PropertyId).val().length > 0 && !ValidateMobilNo($("#ui_ContactElement" + ContactPropertyList[i].PropertyId).val())) {
                        IsPhoneValid = false;
                        $("#ui_ContactElement" + ContactPropertyList[i].PropertyId).focus();
                        ShowErrorMessage(GlobalErrorList.CreateContact.validPhone);
                        return false;
                    } else {
                        IsPhoneValid = true;
                    }
                }
                else if (ContactPropertyList[i].PropertyName == "LmsGroupId" && !$("#dvSource").hasClass("hideDiv")) {
                    if ($("#ui_ContactElement" + ContactPropertyList[i].PropertyId).get(0).selectedIndex == 0) {
                        $("#ui_ContactElement" + ContactPropertyList[i].PropertyId).focus();
                        ShowErrorMessage(GlobalErrorList.CreateContact.selectSource);
                        return false;
                    }

                    //if ($('#ui_btn_SubmitCreateContact').attr("LmsGroupId") == undefined || $('#ui_btn_SubmitCreateContact').attr("LmsGroupId") == null) {
                    //    if ($("#ui_ContactElement_st_140").get(0).selectedIndex == 0) {
                    //        $("#ui_ContactElement_st_140").focus();
                    //        ShowErrorMessage(GlobalErrorList.CreateContact.selectSourceType);
                    //        return false;
                    //    }
                    //}
                }
                else if (ContactPropertyList[i].IsMandatory) {
                    if (ContactPropertyList[i].FieldType == 1 || ContactPropertyList[i].FieldType == 2 || ContactPropertyList[i].FieldType == 6) {
                        if ($("#ui_ContactElement" + ContactPropertyList[i].PropertyId).val().length == 0) {
                            $("#ui_ContactElement" + ContactPropertyList[i].PropertyId).focus();
                            ShowErrorMessage(GlobalErrorList.CreateContact.MandatoryCustomField.replace('[{FieldName}]', ContactPropertyList[i].DisplayName));
                            return false;
                        }
                    } else if (ContactPropertyList[i].FieldType == 3) {
                        if ($("#ui_ContactElement" + ContactPropertyList[i].PropertyId).get(0).selectedIndex == 0) {
                            $("#ui_ContactElement" + ContactPropertyList[i].PropertyId).focus();
                            ShowErrorMessage(GlobalErrorList.CreateContact.MandatoryCustomField.replace('[{FieldName}]', ContactPropertyList[i].DisplayName));
                            return false;
                        }
                    } else if (ContactPropertyList[i].FieldType == 4) {
                        if (!$("input:radio[name='ui_ContactElement" + ContactPropertyList[i].PropertyId + "']:checked").val()) {
                            ShowErrorMessage(GlobalErrorList.CreateContact.MandatoryCustomField.replace('[{FieldName}]', ContactPropertyList[i].DisplayName));
                            return false;
                        }
                    } else if (ContactPropertyList[i].FieldType == 5) {
                        if (!$("input:checkbox[name='ui_ContactElement" + ContactPropertyList[i].PropertyId + "']:checked").val()) {
                            ShowErrorMessage(GlobalErrorList.CreateContact.MandatoryCustomField.replace('[{FieldName}]', ContactPropertyList[i].DisplayName));
                            return false;
                        }
                    }
                }
            }
        }
        if (!IsEmailValid && !IsPhoneValid) {
            ShowErrorMessage(GlobalErrorList.CreateContact.addEmailOrPhone);
            return false;
        }
        return true;
    },
    SaveSingleContact: function () {
        ShowPageLoading();
        var lmsgrpdetails = [];
        var IsVerifiedEmail = false;
        var lmsgrpmemberid = 0;

        if (!ContactManageUtil.ValidateContactFields()) {
            HidePageLoading();
            return;
        }

        contactDetails = new Object();
        contactDetails.Score = -1;

        for (var i = 0; i < ContactPropertyList.length; i++) {

            if (ContactPropertyList[i].FieldType == 1 || ContactPropertyList[i].FieldType == 2 || ContactPropertyList[i].FieldType == 6) {
                if ($("#ui_ContactElement" + ContactPropertyList[i].PropertyId).val().length > 0) {
                    contactDetails[ContactPropertyList[i].PropertyName] = $("#ui_ContactElement" + ContactPropertyList[i].PropertyId).val();
                }
            } else if (ContactPropertyList[i].FieldType == 3) {
                if ($("#ui_ContactElement" + ContactPropertyList[i].PropertyId).get(0).selectedIndex != 0) {
                    contactDetails[ContactPropertyList[i].PropertyName] = $("#ui_ContactElement" + ContactPropertyList[i].PropertyId).val();
                }
            } else if (ContactPropertyList[i].FieldType == 4) {
                if ($("input:radio[name='ui_ContactElement" + ContactPropertyList[i].PropertyId + "']:checked").val()) {
                    contactDetails[ContactPropertyList[i].PropertyName] = $("input:radio[name='ui_ContactElement" + ContactPropertyList[i].PropertyId + "']:checked").val();
                }
            } else if (ContactPropertyList[i].FieldType == 5) {
                if ($("input:checkbox[name='ui_ContactElement" + ContactPropertyList[i].PropertyId + "']:checked").val()) {
                    var allCheckedValues = $("input:checkbox[name='ui_ContactElement" + ContactPropertyList[i].PropertyId + "']:checked").map(function () {
                        return this.value;
                    }).get().join("|");

                    contactDetails[ContactPropertyList[i].PropertyName] = allCheckedValues;
                }
            }
        }

        if (window.location.href.toLowerCase().indexOf("/prospect/leads") > 0) {

            lmsgroupmemberDetails = {
                lmscustomfield1: "", lmscustomfield2: "", lmscustomfield3: "", lmscustomfield4: "", lmscustomfield5: "",
                lmscustomfield6: "", lmscustomfield7: "", lmscustomfield8: "", lmscustomfield9: "", lmscustomfield10: "",
                lmscustomfield11: "", lmscustomfield12: "", lmscustomfield13: "", lmscustomfield14: "", lmscustomfield15: ""
            };

            for (var i = 0; i < LmsCustomFieldList.length; i++) {
                if ($("#ui_lmsContactElement" + LmsCustomFieldList[i].Id).val().length > 0) {
                    lmsgroupmemberDetails[LmsCustomFieldList[i].FieldName.toLowerCase()] = $("#ui_lmsContactElement" + LmsCustomFieldList[i].Id).val();
                }
            }

            lmsgrpdetails.push(lmsgroupmemberDetails);
            lmsgrpdetails = JSON.stringify(lmsgrpdetails);
        }
        //contactDetails.UserInfoUserId = contactDetails.UserInfoUserId > 0 ? contactDetails.UserInfoUserId : Plumb5UserId;

        var EditContactId = $('#ui_btn_SubmitCreateContact').attr("ContactId");
        if (EditContactId != undefined && EditContactId != null && EditContactId.length > 0) {
            contactDetails.ContactId = parseInt(EditContactId);
        }

        var OldUserInfoUserId = 0;
        var HandledBy = $('#ui_btn_SubmitCreateContact').attr("UserInfoUserId");
        if (HandledBy != undefined && HandledBy != null && HandledBy.length > 0) {
            OldUserInfoUserId = HandledBy;
        }

        var LmsGroupId = $('#ui_btn_SubmitCreateContact').attr("LmsGroupId");
        var lmssourcetype = -1;

        if (window.location.href.indexOf('/ManageContact/Contact') > 0) {
            contactDetails.UserInfoUserId = contactDetails.LmsGroupId = 0;
        }
        else {

            if ($('#ui_btn_SubmitCreateContact').attr("LmsGrpMemberId") != undefined && $('#ui_btn_SubmitCreateContact').attr("LmsGrpMemberId") != 0) {
                lmsgrpmemberid = $('#ui_btn_SubmitCreateContact').attr("LmsGrpMemberId");
            }
            else
                lmsgrpmemberid = 0;

            var sampleitems = JSLINQ(ContactPropertyList).Where(function () {
                return (this.PropertyName == "LmsGroupId");
            });

            if ($('#ui_btn_SubmitCreateContact').attr("LmsGroupId") != undefined && $('#ui_btn_SubmitCreateContact').attr("LmsGroupId") != null) {
                if (sampleitems != undefined && sampleitems != "" && sampleitems.items.length > 0) {
                    var lmsId = sampleitems.items[0].PropertyId;

                    if ($("#ui_ContactElement_st_" + lmsId + "").get(0).selectedIndex == 1 || $("#ui_ContactElement_st_" + lmsId + "").get(0).selectedIndex == 2) {
                        LmsGroupId = "";
                    }
                }
            }

            if (LmsGroupId != undefined && LmsGroupId != null && LmsGroupId.length > 0) {
                if (parseInt(LmsGroupId) > 0)
                    contactDetails.LmsGroupId = LmsGroupId;
                else
                    contactDetails.LmsGroupId = 2;
            }
            else if (contactDetails.LmsGroupId > 0) {

                if (sampleitems != undefined && sampleitems != "" && sampleitems.items.length > 0) {
                    var lmsId = sampleitems.items[0].PropertyId;

                    if ($("#ui_ContactElement_st_" + lmsId + "").get(0).selectedIndex != -1 && !$("#dvSource").hasClass("hideDiv")) {
                        lmssourcetype = $("#ui_ContactElement_st_" + lmsId + "").val();
                    }
                }
            }
            else {
                contactDetails.LmsGroupId = 2;
            }
        }

        if (typeof GroupId !== 'undefined' && GroupId != undefined && GroupId != null && GroupId != "0" && parseInt(GroupId) > 0) {
            AddToGroupId = GroupId;
        }

        if ($("input[name='isemail']:checked").val() == "1") {
            IsVerifiedEmail = true;
        }

        $.ajax({
            url: "/ManageContact/Contact/SaveOrUpdateContact",
            type: 'POST',
            data: JSON.stringify({
                'AccountId': Plumb5AccountId, 'contact': contactDetails, 'OldUserInfoUserId': parseInt(OldUserInfoUserId), 'GroupId': AddToGroupId,
                'IsVerifiedEmail': IsVerifiedEmail, 'LmsSourceType': lmssourcetype, 'lmsgrpmemberid': lmsgrpmemberid, 'lmsgrpmembers': lmsgrpdetails
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    if (response.UserContactId == -1) {
                        ShowErrorMessage(GlobalErrorList.CreateContact.addEmailOrPhone);
                    }
                    else if (response.UserContactId == -2) {
                        ShowErrorMessage(GlobalErrorList.CreateContact.validEmail);
                    }
                    else if (response.UserContactId == -3) {
                        ShowErrorMessage(GlobalErrorList.CreateContact.validPhone);
                    }
                    else if (response.UserContactId == -4) {
                        ShowErrorMessage(GlobalErrorList.CreateContact.contactexists);
                    }
                    else if (response.UserContactId == -5) {
                        ShowErrorMessage(GlobalErrorList.CreateContact.contactexistswithsamesource);
                    }
                    else {
                        if (contactDetails.ContactId > 0 && response.UserContactId > 0 && contactDetails.ContactId == response.UserContactId) {
                            if (response.oldcontactwithnewsource && lmssourcetype == 2) {
                                ShowSuccessMessage(GlobalErrorList.CreateContact.contactsuccesswithsamesource);
                                ContactManageUtil.ReBindContactReportData(response.ContactDetails, 0, response.lmsid, response.leaddetails);
                                ContactManageUtil.CloseCreateContactPopUp();
                            }
                            else if (response.oldcontactwithnewsource && lmssourcetype == 1) {
                                ShowSuccessMessage(GlobalErrorList.CreateContact.oldcontactsuccesswithsamesource);
                                ContactManageUtil.ReBindContactReportData(response.ContactDetails, -1, response.lmsid, response.leaddetails);
                                ContactManageUtil.CloseCreateContactPopUp();
                            }
                            else {
                                ShowSuccessMessage(GlobalErrorList.CreateContact.updateSuccess);
                                ContactManageUtil.ReBindContactReportData(response.ContactDetails, 1, response.lmsid, response.leaddetails);
                                //ContactManageUtil.CloseCreateContactPopUp();
                            }
                        }
                        else if (response.UserContactId > 0) {
                            ShowSuccessMessage(GlobalErrorList.CreateContact.addSuccess);
                            ContactManageUtil.ReBindContactReportData(response.ContactDetails, 0, response.lmsid, response.leaddetails);
                            ContactManageUtil.CloseCreateContactPopUp();
                        }
                        else {
                            ShowErrorMessage(GlobalErrorList.CreateContact.unknownError);
                        }
                    }
                }
                else {
                    ShowErrorMessage(GlobalErrorList.CreateContact.unknownError);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    ClearContactFields: function () {
        var PreviousEmail = $(EmailPropertyFieldId).val();
        var PreviousPhone = $(PhonePropertyFieldId).val();
        $('#ui_btn_SubmitCreateContact').removeAttr("ContactId");
        $('#ui_btn_SubmitCreateContact').removeAttr("UserInfoUserId");
        $('#ui_btn_SubmitCreateContact').removeAttr("LmsGroupId");
        $('#ui_btn_SubmitCreateContact').removeAttr("LmsGrpMemberId");
        $('#ui_btn_SubmitCreateContact').attr("disabled", "disabled");
        $("#ui_smallContactPopUpSubTitle").text('');

        if (window.location.href.indexOf('/ManageContact/Contact') > 0) {
            $("#ui_btn_SubmitCreateContact").html("Create Contact");
            $("#ui_h6ContactPopUpTitle").html("Create Contact");
        } else {
            $("#ui_btn_SubmitCreateContact").html("Create Lead");
            $("#ui_h6ContactPopUpTitle").html("Create Lead");
            $('[id^=ui_lmsContactElement]').val('');
        }

        $("#ui_divEmailSpinner,#ui_divSmsSpinner").addClass("hideDiv");

        if (ContactPropertyList != undefined && ContactPropertyList != null && ContactPropertyList.length > 0) {
            for (var i = 0; i < ContactPropertyList.length; i++) {
                if (ContactPropertyList[i].FieldType == 1 || ContactPropertyList[i].FieldType == 2 || ContactPropertyList[i].FieldType == 6) {
                    $("#ui_ContactElement" + ContactPropertyList[i].PropertyId).val('');
                } else if (ContactPropertyList[i].FieldType == 3) {
                    $("#ui_ContactElement" + ContactPropertyList[i].PropertyId).select2().val($("#ui_ContactElement" + ContactPropertyList[i].PropertyId + " option:first").val()).trigger('change');
                } else if (ContactPropertyList[i].FieldType == 4) {
                    $("input:radio[name='ui_ContactElement" + ContactPropertyList[i].PropertyId + "']").prop('checked', false);
                } else if (ContactPropertyList[i].FieldType == 5) {
                    $("input:checkbox[name='ui_ContactElement" + ContactPropertyList[i].PropertyId + "']").prop('checked', false);
                }
            }
        }

        $(EmailPropertyFieldId).val(PreviousEmail);
        $(PhonePropertyFieldId).val(PreviousPhone);
        contactDetails = new Object();
    },
    GetContactDetailsForUpdate: function (ContactId, EmailId, PhoneNumber, LmsGroupId) {
        ShowPageLoading();

        if (LmsGroupId == undefined) {
            LmsGroupId = 0;
        }

        ContactManageUtil.ClearContactFields();

        contactDetails = new Object();
        contactDetails.ContactId = ContactId;
        contactDetails.EmailId = EmailId;
        contactDetails.PhoneNumber = PhoneNumber;

        $.ajax({
            url: "/ManageContact/Contact/GetContactDetailsForUpdate/",
            type: 'POST',
            data: JSON.stringify({
                'AccountId': Plumb5AccountId, 'contact': contactDetails, 'LmsGroupId': LmsGroupId
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.contactDetails != null && response.contactDetails != undefined) {
                    response.Remarks = null;
                    var contactresponse = response.contactDetails;

                    if (response.leaddetails != null && response.leaddetails != undefined) {
                        contactresponse.LmsGroupId = response.leaddetails.LmsGroupId;
                        contactresponse.UserInfoUserId = response.leaddetails.UserInfoUserId;
                        leadresponsedetails = response.leaddetails;
                    }

                    ContactManageUtil.BindContactDetailsForUpdate(contactresponse);
                    ContactManageUtil.BindLmsGrpDetailsUpdate(leadresponsedetails);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    GetLmsGrpDetailsForUpdate: function (ContactId, LmsGroupId) {
        ShowPageLoading();

        $.ajax({
            url: "/ManageContact/Contact/GetLmsContactDetailsForUpdate/",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'ContactId': ContactId, 'LmsGroupId': LmsGroupId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (response) {
                if (response != undefined && response != null && response.ContactId > 0) {
                    ContactManageUtil.BindLmsGrpDetailsUpdate(response);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    BindContactDetailsForUpdate: function (ContactDetails) {
        $('#ui_btn_SubmitCreateContact').attr("ContactId", ContactDetails.ContactId);
        $('#ui_btn_SubmitCreateContact').attr("UserInfoUserId", ContactDetails.UserInfoUserId);
        $('#ui_btn_SubmitCreateContact').attr("LmsGroupId", ContactDetails.LmsGroupId);

        if (typeof LmseEditLmsGroupMemberId !== 'undefined') {
            if (LmseEditLmsGroupMemberId != undefined && LmseEditLmsGroupMemberId != 0) {
                $('#ui_btn_SubmitCreateContact').attr("LmsGrpMemberId", LmseEditLmsGroupMemberId);
            }
        }

        if (window.location.href.indexOf('/ManageContact/Contact') > 0) {
            $("#ui_btn_SubmitCreateContact").html("Update Contact");
            //Maintain Manange keywords all over - Arnab
            $("#ui_h6ContactPopUpTitle").html("Manage Contact");
        } else {
            $("#ui_btn_SubmitCreateContact").html("Update Lead");
            //Maintain Manange keywords all over - Arnab
            $("#ui_h6ContactPopUpTitle").html("Manage Lead");
        }

        var ContactTitleDetails = "";

        if (ContactDetails.Name != undefined && ContactDetails.Name != null && ContactDetails.Name != 'null' && ContactDetails.Name.length > 0) {
            ContactTitleDetails = ContactDetails.Name;
        }

        if (ContactDetails.EmailId != undefined && ContactDetails.EmailId != null && ContactDetails.EmailId != 'null' && ContactDetails.EmailId.length > 0) {
            ContactTitleDetails += "(" + ContactDetails.EmailId + ")";
            LastTimeEmailValue = ContactDetails.EmailId;
        }

        if (ContactDetails.PhoneNumber != undefined && ContactDetails.PhoneNumber != null && ContactDetails.PhoneNumber != 'null' && ContactDetails.PhoneNumber.length > 0) {
            ContactTitleDetails += "(" + ContactDetails.PhoneNumber + ")";
            LastTimePhoneValue = ContactDetails.PhoneNumber;
        }

        $("#ui_smallContactPopUpSubTitle,.popupsubtitle").text(ContactTitleDetails);

        if (ContactPropertyList != undefined && ContactPropertyList != null && ContactPropertyList.length > 0) {
            for (var i = 0; i < ContactPropertyList.length; i++) {
                if (ContactDetails[ContactPropertyList[i].PropertyName] != undefined && ContactDetails[ContactPropertyList[i].PropertyName] != null && ContactDetails[ContactPropertyList[i].PropertyName] != 'null' && (ContactDetails[ContactPropertyList[i].PropertyName]).toString().length > 0) {
                    if (ContactPropertyList[i].FieldType == 1 || ContactPropertyList[i].FieldType == 2) {
                        $("#ui_ContactElement" + ContactPropertyList[i].PropertyId).val(ContactDetails[ContactPropertyList[i].PropertyName]);
                    } else if (ContactPropertyList[i].FieldType == 3) {
                        LmsDefaultFunctionUtil.DropDownBinding("ui_ContactElement" + ContactPropertyList[i].PropertyId, (ContactDetails[ContactPropertyList[i].PropertyName]).toString())

                        //if (ContactPropertyList[i].PropertyName.toLocaleLowerCase() == "userinfouserid") {
                        //    $("#ui_ContactElement" + ContactPropertyList[i].PropertyId).prop("disabled", true);
                        //}

                        //$("#ui_ContactElement" + ContactPropertyList[i].PropertyId).select2().val((ContactDetails[ContactPropertyList[i].PropertyName]).toString()).change();
                    } else if (ContactPropertyList[i].FieldType == 4) {
                        $("input:radio[name='ui_ContactElement" + ContactPropertyList[i].PropertyId + "'][value='" + ContactDetails[ContactPropertyList[i].PropertyName] + "']").prop("checked", true);
                    } else if (ContactPropertyList[i].FieldType == 5) {
                        var checkedData = ContactDetails[ContactPropertyList[i].PropertyName].split("|");
                        for (var a = 0; a < checkedData.length; a++) {
                            $("input:checkbox[name='ui_ContactElement" + ContactPropertyList[i].PropertyId + "'][value='" + $.trim(checkedData[a]) + "']").prop("checked", true);
                        }
                    } else if (ContactPropertyList[i].FieldType == 6) {
                        $("#ui_ContactElement" + ContactPropertyList[i].PropertyId).datepicker("setDate", GetJavaScriptDateObj(ContactDetails[ContactPropertyList[i].PropertyName]));
                    }
                }
            }

            if (typeof createandupdatebuttondisable !== 'undefined') {
                if (createandupdatebuttondisable)
                    $('#ui_btn_SubmitCreateContact').removeAttr("disabled");
            }
            else {
                $('#ui_btn_SubmitCreateContact').removeAttr("disabled");
            }

            //$("#tabFollowup").addClass("hideDiv");
            //if (Plumb5UserId == LmseEditFollowupNotesUserinfouserid || editfollowupnotespopup == 1) {
            //   $("#tabFollowup").removeClass("hideDiv");
            //    $('#ui_btn_SubmitCreateContact').removeAttr("disabled");
            // }
        }

        //if (LmsCustomFieldList != undefined && LmsCustomFieldList != null && LmsCustomFieldList.length > 0) {
        //    for (var i = 0; i < LmsCustomFieldList.length; i++) {
        //        if (ContactDetails[ContactPropertyList[i].PropertyName] != undefined && ContactDetails[ContactPropertyList[i].PropertyName] != null && ContactDetails[ContactPropertyList[i].PropertyName] != 'null' && (ContactDetails[ContactPropertyList[i].PropertyName]).toString().length > 0) {
        //            if (ContactPropertyList[i].FieldType == 1 || ContactPropertyList[i].FieldType == 2) {
        //                $("#ui_ContactElement" + ContactPropertyList[i].PropertyId).val(ContactDetails[ContactPropertyList[i].PropertyName]);
        //            }
        //        }
        //    }
        //}

        if (!document.URL.includes("prospect"))
            $("#ui_divContactPopUp").removeClass("hideDiv");
        HidePageLoading();
    },
    BindLmsGrpDetailsUpdate: function (LmsContactDetails) {
        if (LmsCustomFieldList != undefined && LmsCustomFieldList != null && LmsCustomFieldList.length > 0) {
            for (var i = 0; i < LmsCustomFieldList.length; i++) {
                if (LmsContactDetails[LmsCustomFieldList[i].FieldName] != undefined && LmsContactDetails[LmsCustomFieldList[i].FieldName] != null && LmsContactDetails[LmsCustomFieldList[i].FieldName] != 'null' && (LmsContactDetails[LmsCustomFieldList[i].FieldName]).toString().length > 0) {
                    $("#ui_lmsContactElement" + LmsCustomFieldList[i].Id).val(LmsContactDetails[LmsCustomFieldList[i].FieldName]);
                }
            }
        }
        HidePageLoading();
    },
    CheckContactExistence: function (EmailId, PhoneNumber) {
        $.ajax({
            url: "/General/GetContactDetails",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'UserId': Plumb5UserId, 'EmailId': EmailId, 'PhoneNumber': PhoneNumber }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.contact != null && response.contact != undefined) {

                    var sampleitems = JSLINQ(ContactPropertyList).Where(function () {
                        return (this.PropertyName == "LmsGroupId");
                    });

                    ContactManageUtil.ClearContactFields();
                    var contactresponse = response.contact;

                    if (response.leaddetails != null && response.leaddetails != undefined) {
                        contactresponse.LmsGroupId = response.leaddetails.LmsGroupId;
                        leadresponsedetails = response.leaddetails;
                    }

                    if (sampleitems != undefined && sampleitems != "" && sampleitems.items.length > 0) {
                        var lmsId = sampleitems.items[0].PropertyId;

                        if ($("#ui_ContactElement_st_" + lmsId + "").get(0).selectedIndex == 2) {
                            contactresponse.LmsGroupId = 0;
                            contactresponse.Score = -1;
                            contactresponse.LeadLabel = "";
                        }
                    }

                    ContactManageUtil.BindContactDetailsForUpdate(contactresponse);

                    if (sampleitems != undefined && sampleitems != "" && sampleitems.items.length > 0) {
                        var lmsId = sampleitems.items[0].PropertyId;

                        if ($("#ui_ContactElement_st_" + lmsId + "").get(0).selectedIndex == 2) {
                            $("#ui_btn_SubmitCreateContact").html("Create Lead");
                        }

                        if ($("#ui_ContactElement_st_" + lmsId + "").get(0).selectedIndex != 2 && !$("#dvSource").hasClass("hideDiv")) {
                            ContactManageUtil.BindLmsGrpDetailsUpdate(leadresponsedetails);
                        }
                    }
                }
                else {
                    if (response.AssociatedUserStatus == true) {
                        $('#ui_btn_SubmitCreateContact').removeAttr("disabled");
                    }
                    else {
                        if (EmailId.length > 0) {
                            ShowErrorMessage(GlobalErrorList.CreateContact.EmailExistAssociateWithOtherUser);
                        }

                        if (PhoneNumber.length > 0) {
                            ShowErrorMessage(GlobalErrorList.CreateContact.PhoneNumExistAssociateWithOtherUser);
                        }
                    }
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    EmailTextFocus: function (elementId) {
        $("#ui_divEmailSpinner,#ui_divSmsSpinner").addClass("hideDiv");
        if ($('#ui_btn_SubmitCreateContact').attr("BindType") == "NEW") {
            $("#ui_divEmailSpinner").removeClass("hideDiv");
            if ($("#" + elementId).val().length == 0) {
                $("#ui_divEmailSpinner,#ui_divSmsSpinner").addClass("hideDiv");
                //ContactManageUtil.ClearContactFields();
                $('#ui_btn_SubmitCreateContact').attr("BindType", "NEW");
            }
        }
    },
    EmailTextFocusOut: function (elementId) {
        $("#ui_divEmailSpinner,#ui_divSmsSpinner").addClass("hideDiv");
        if ($('#ui_btn_SubmitCreateContact').attr("BindType") == "NEW") {
            if (LastTimeEmailValue != $("#" + elementId).val()) {
                LastTimeEmailValue = $("#" + elementId).val();
                ShowPageLoading();
                var CurrentEmail = $("#" + elementId).val();
                //ContactManageUtil.ClearContactFields();
                $("#" + elementId).val(CurrentEmail);
                if (CurrentEmail.length > 0 && !regExpEmail.test(CurrentEmail)) {
                    ShowErrorMessage(GlobalErrorList.CreateContact.validEmail);
                    HidePageLoading();
                } else if (CurrentEmail.length > 0) {
                    ContactManageUtil.CheckContactExistence(CurrentEmail, '');
                } else {
                    HidePageLoading();
                }
            }
        }
    },
    PhoneTextFocus: function (elementId) {
        $("#ui_divEmailSpinner,#ui_divSmsSpinner").addClass("hideDiv");
        if ($('#ui_btn_SubmitCreateContact').attr("BindType") == "NEW") {
            $("#ui_divSmsSpinner").removeClass("hideDiv");
            if ($("#" + elementId).val().length == 0) {
                $("#ui_divEmailSpinner,#ui_divSmsSpinner").addClass("hideDiv");
                //ContactManageUtil.ClearContactFields();
                $('#ui_btn_SubmitCreateContact').attr("BindType", "NEW");
            }
        }
    },
    PhoneTextFocusOut: function (elementId) {
        $("#ui_divEmailSpinner,#ui_divSmsSpinner").addClass("hideDiv");
        if ($('#ui_btn_SubmitCreateContact').attr("BindType") == "NEW") {
            if (LastTimePhoneValue != $("#" + elementId).val()) {
                LastTimePhoneValue = $("#" + elementId).val();
                ShowPageLoading();
                var CurrentPhone = $("#" + elementId).val();
                //ContactManageUtil.ClearContactFields();
                $("#" + elementId).val(CurrentPhone);
                if (CurrentPhone.length > 0) {
                    ContactManageUtil.CheckContactExistence('', CurrentPhone);
                } else {
                    HidePageLoading();
                }
            }
        }
    },
    CloseCreateContactPopUp: function () {
        LastTimeEmailValue = "";
        LastTimePhoneValue = "";
        $(EmailPropertyFieldId).val('');
        $(PhonePropertyFieldId).val('');
        ContactManageUtil.ClearContactFields();
        $('#ui_btn_SubmitCreateContact').attr("BindType", "NEW");
        $("[id^='ui_div_']").removeClass('activeBgRow');
        $("#ui_divContactPopUp").addClass("hideDiv");
        if (window.location.href.toLowerCase().indexOf("/prospect/leads") > 0)
            $("#div_EditFollowupNote").addClass("hideDiv");
    },
    ReBindContactReportData: function (ContactDetails, IsUpdated, lmsid, leaddetails) {
        if (lmsgroupmemberDetails != null) {
            ContactDetails.LmsCustomField1 = lmsgroupmemberDetails.lmscustomfield1;
            ContactDetails.LmsCustomField2 = lmsgroupmemberDetails.lmscustomfield2;
            ContactDetails.LmsCustomField3 = lmsgroupmemberDetails.lmscustomfield3;
            ContactDetails.LmsCustomField4 = lmsgroupmemberDetails.lmscustomfield4;
            ContactDetails.LmsCustomField5 = lmsgroupmemberDetails.lmscustomfield5;
            ContactDetails.LmsCustomField6 = lmsgroupmemberDetails.lmscustomfield6;
            ContactDetails.LmsCustomField7 = lmsgroupmemberDetails.lmscustomfield7;
            ContactDetails.LmsCustomField8 = lmsgroupmemberDetails.lmscustomfield8;
            ContactDetails.LmsCustomField9 = lmsgroupmemberDetails.lmscustomfield9;
            ContactDetails.LmsCustomField10 = lmsgroupmemberDetails.lmscustomfield10;
            ContactDetails.LmsCustomField11 = lmsgroupmemberDetails.lmscustomfield11;
            ContactDetails.LmsCustomField12 = lmsgroupmemberDetails.lmscustomfield12;
            ContactDetails.LmsCustomField13 = lmsgroupmemberDetails.lmscustomfield13;
            ContactDetails.LmsCustomField14 = lmsgroupmemberDetails.lmscustomfield14;
            ContactDetails.LmsCustomField15 = lmsgroupmemberDetails.lmscustomfield15;
        }

        if (leaddetails != null) {
            if (leaddetails.Publisher != null && leaddetails.Publisher != "" && leaddetails.Publisher != undefined)
                ContactDetails.Publisher = leaddetails.Publisher;

            if (leaddetails.PrimaryPublisher != null && leaddetails.PrimaryPublisher != "" && leaddetails.PrimaryPublisher != undefined)
                ContactDetails.PrimaryPublisher = leaddetails.PrimaryPublisher;

            if (leaddetails.AllPublisher != null && leaddetails.AllPublisher != "" && leaddetails.AllPublisher != undefined)
                ContactDetails.AllPublisher = leaddetails.AllPublisher;
        }

        if (ContactDetails.Revenue == undefined)
            ContactDetails.Revenue = 0;
        if (ContactDetails.ClouserDate == undefined)
            ContactDetails.ClouserDate = null;

        if (IsUpdated == 0) {
            TotalRowCount++;
            $('#spnCount').html(TotalRowCount);
            if (TotalRowCount > 10)
                PagingPrevNext(OffSet, 10, TotalRowCount);
            else
                PagingPrevNext(OffSet, TotalRowCount, TotalRowCount);
        }

        if (IsUpdated == 1) {
            if (TotalRowCount == 0) {
                TotalRowCount++;
                $('#spnCount').html(TotalRowCount);
                PagingPrevNext(OffSet, 10, TotalRowCount);
            }
        }

        if (TotalRowCount == 1 && IsUpdated != -1) {
            $("#ui_tblReportData").removeClass('no-data-records');
            $('#ui_tbodyReportData tr:last').remove();
        }

        if (window.location.href.indexOf('/ManageContact/Contact') > 0 && IsUpdated == 1) {
            $("#name_" + ContactDetails.ContactId).text(ContactDetails.Name != null ? ContactDetails.Name : "");
            $("#email_" + ContactDetails.ContactId).text(ContactDetails.EmailId != null ? ContactDetails.EmailId : "");
            $("#phn_" + ContactDetails.ContactId).text(ContactDetails.PhoneNumber != null ? ContactDetails.PhoneNumber : "");
        }
        else if (window.location.href.indexOf('/ManageContact/Contact') > 0 && IsUpdated == 0) {
            var getFlatter = ContactDetails.Name !== null && ContactDetails.Name !== undefined ? ContactDetails.Name.substring(0, 1) : "?";
            var verificationStatusImg = "", exportVefified = "";
            if (ContactDetails.IsVerifiedMailId == null || ContactDetails.IsVerifiedMailId == "-1") {
                verificationStatusImg = "icon ion-help-circled";
                exportVefified = "Not Verified";
            } else if (ContactDetails.IsVerifiedMailId == "0") {
                verificationStatusImg = "icon ion-android-alert verifalert";
                exportVefified = "Invalid";
            }
            else if (ContactDetails.IsVerifiedMailId == "1") {
                verificationStatusImg = "icon ion-android-checkmark-circle verifsuccess";
                exportVefified = "Valid";
            }
            var reportTableTrs = '<tr>' +
                '<td  class="td-wid-5 pl-0"><div class="chbxWrap"><label class="ckbox"><input class="selChk" value="' + ContactDetails.ContactId + '" type="checkbox"><span></span></label></div></td>' +
                '<td class="text-left h-100">' +
                '<div class="nameWrap">' +
                '<div class="nameAlpWrap">' +
                '<span class="nameAlpha">' + getFlatter + '</span>' +
                '</div>' +
                '<div class="nameTxtWrap">' +
                '<span class="nameTxt">' + (ContactDetails.Name !== null ? ContactDetails.Name : "") + '</span>' +
                '</div>' +
                '</div>' +
                '</td>' +
                '<td>' + (ContactDetails.EmailId !== null ? ContactDetails.EmailId : "") + '</td>' +
                '<td>' + (ContactDetails.PhoneNumber !== null ? ContactDetails.PhoneNumber : "") + '</td>' +
                '<td class="text-center verified"><i title="' + exportVefified + '" class="' + verificationStatusImg + '"></i></td>' +
                '<td>' + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(ContactDetails.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(ContactDetails.CreatedDate)) + '</td>' +
                '</tr>';
            if (TotalRowCount > 10)
                $('#ui_tbodyReportData tr:last').remove();

            $('#ui_tbodyReportData').prepend(reportTableTrs);
            contactDetails = {};
        } else {
            ContactDetails.LmsGroupmemberId = lmsid;

            var reportTableTrs = LeadReportBindingUtil.BindingContent(ContactDetails);
            if (IsUpdated == 0 && $("#ui_div_" + lmsid).length == 0) {
                if (TotalRowCount > 10)
                    $('#ui_tbodyReportData tr:last').remove();
                $('#ui_tbodyReportData').prepend("<tr id='ui_div_" + lmsid + "'>" + reportTableTrs + "</tr>");
            }
            else if (IsUpdated == 1 && $("#ui_div_" + lmsid).length == 0) {
                if (TotalRowCount > 10)
                    $('#ui_tbodyReportData tr:last').remove();
                $('#ui_tbodyReportData').prepend("<tr id='ui_div_" + lmsid + "'>" + reportTableTrs + "</tr>");
            }
            else {
                $("#ui_div_" + lmsid).removeClass("activeBgRow");
                $("#ui_div_" + lmsid).empty();
                $("#ui_div_" + lmsid).append(reportTableTrs);
            }
            LmsDefaultFunctionUtil.InitialiseActionsTabClick();
            LmsDefaultFunctionUtil.InitialiseActionsClick();
            LmsDefaultFunctionUtil.RowCheckboxClick();
        }
    }
}

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
                ContactManageUtil.SaveSingleContact();
            }
            else {
                $('#ui_divContactSetting').modal('show');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
});

$("#ui_btnCancelCreateContact, #ui_iCancelCreateContact").click(function () {
    ShowPageLoading();
    ContactManageUtil.CloseCreateContactPopUp();
    HidePageLoading();
    if (window.location.href.toLowerCase().indexOf("/prospect/") > 0)
        $("#div_EditFollowupNote").addClass("hideDiv");
});

function BindSearch() {
    $(".addCampName").select2({
        minimumResultsForSearch: '',
        dropdownAutoWidth: false
    });
}

$(document).on("change", "[id^=ui_ContactElement_st_]", function () {
    if ($('#ui_btn_SubmitCreateContact').attr('contactid') != undefined) {
        if (this.value != null && this.value != undefined && this.value != null && this.value == 2) {
            $("#ui_btn_SubmitCreateContact").html("Create Lead");
            $('[id^=ui_lmsContactElement]').val('');

            var sampleitems = JSLINQ(ContactPropertyList).Where(function () {
                return (this.PropertyName == "LeadLabel");
            });

            if (sampleitems != undefined && sampleitems != "" && sampleitems.items.length > 0) {
                $("#ui_ContactElement" + sampleitems.items[0].Id + "").val(-1);
                $("#ui_ContactElement" + sampleitems.items[0].Id + "").trigger('change');
            }

            var stageitems = JSLINQ(ContactPropertyList).Where(function () {
                return (this.PropertyName == "Score");
            });

            if (stageitems != undefined && stageitems != "" && stageitems.items.length > 0) {
                $("#ui_ContactElement" + stageitems.items[0].Id + "").val(0);
                $("#ui_ContactElement" + stageitems.items[0].Id + "").trigger('change');
            }
        }
        else {
            $("#ui_btn_SubmitCreateContact").html("Update Lead");

            if (leadresponsedetails != null && leadresponsedetails != "") {
                ContactManageUtil.BindLmsGrpDetailsUpdate(leadresponsedetails);


                if (leadresponsedetails.LeadLabel != null && leadresponsedetails.LeadLabel != undefined && leadresponsedetails.LeadLabel != "") {
                    var sampleitems = JSLINQ(ContactPropertyList).Where(function () {
                        return (this.PropertyName == "LeadLabel");
                    });

                    if (sampleitems != undefined && sampleitems != "" && sampleitems.items.length > 0) {
                        $("#ui_ContactElement" + sampleitems.items[0].Id + "").val(leadresponsedetails.LeadLabel);
                        $("#ui_ContactElement" + sampleitems.items[0].Id + "").trigger('change');
                    }
                }

                if (leadresponsedetails.Score != null && leadresponsedetails.Score != undefined) {
                    var sampleitems = JSLINQ(ContactPropertyList).Where(function () {
                        return (this.PropertyName == "Score");
                    });

                    if (sampleitems != undefined && sampleitems != "" && sampleitems.items.length > 0) {
                        $("#ui_ContactElement" + sampleitems.items[0].Id + "").val(leadresponsedetails.Score);
                        $("#ui_ContactElement" + sampleitems.items[0].Id + "").trigger('change');
                    }
                }
            }
        }
    }
    else {
        $("#ui_btn_SubmitCreateContact").html("Create Lead");


        var sampleitems = JSLINQ(ContactPropertyList).Where(function () {
            return (this.PropertyName == "LmsGroupId");
        });

        if (sampleitems != undefined && sampleitems != "" && sampleitems.items.length > 0) {
            var lmsId = sampleitems.items[0].PropertyId;

            if ($("#ui_ContactElement_st_" + lmsId + "").get(0).selectedIndex != 2 && !$("#dvSource").hasClass("hideDiv")) {
                if (leadresponsedetails != null && leadresponsedetails != "") {
                    ContactManageUtil.BindLmsGrpDetailsUpdate(leadresponsedetails);
                }
            }
        }
    }
});