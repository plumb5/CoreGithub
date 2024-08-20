var contactRule = { Id: 0, Name: "", Mail: false, Sms: false, WhatsApp: false, Conditions: "", AssignUserInfoUserId: 0, AssignUserGroupId: 0, Status: false, AutoMailSendingSettingId: 0, AutoSmsSendingSettingId: 0, AutoWhatsAppSendingSettingId: 0, AutoAssignToGroupId: 0, AutoAssignToLmsSourceId: 0 };
var mailSendingSetting = { Name: "", MailTemplateId: 0, GroupId: 0, Subject: "", FromName: "", FromEmailId: "", IsPromotionalOrTransactionalType: true, Subscribe: true, Forward: false, ReplyTo: "", ScheduledStatus: 10 };
var smsSendingSetting = { Name: "", SmsTemplateId: 0, GroupId: 0, IsPromotionalOrTransactionalType: true, ScheduledStatus: 10 };
var waSendingSetting = { Name: "", WhatsAppTemplateId: 0, GroupId: 0, ScheduledStatus: 10 };
var SelectedField = { FieldName: "", Condition: "", FieldAnswer: "" };
var Conditions = [];
var FieldRequird = ["FirstName", "LastName"];
var contactProperties = [];
var NoOFFieldAddedAndRemoved = 1;
var AnswerFields = [];
var RuleList = [];
var QueryNewList = [];

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

var loadingDataValues = { BindRules: false, BindContactProperties: false, BindAssignUserEmailds: false, BindUserGroup: false, BindGroups: false, BindMailTemplate: false, BindSmsTemplate: false, BindWATemplate: false };

var notifyruleUtil = {
    LoadingSymbol: function () {
        LoadingTimeInverval = setInterval(function () {
            if (loadingDataValues.BindRules && loadingDataValues.BindContactProperties && loadingDataValues.BindAssignUserEmailds && loadingDataValues.BindUserGroup && loadingDataValues.BindMailTemplate && loadingDataValues.BindSmsTemplate && loadingDataValues.BindWATemplate) {
                NotificationRulesUtil.GetMaxCount();
                clearInterval(LoadingTimeInverval);
            }
        }, 300);
    },
    BindRulesList: function () {
        $.ajax({
            url: "/Prospect/NotificationRules/GetRules",
            type: 'POST',
            data: JSON.stringify({ "AccountId": Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (rules) {
                RuleList.length = 0;
                if (rules != null && rules.length > 0) {
                    $.each(rules, function () {
                        let obj = {
                            Name: $(this)[0].Name, Status: $(this)[0].Status, Query: []
                        };

                        let query = JSON.parse($(this)[0].Conditions);
                        for (let i = 0; i < query.length; i++) {
                            let queryObj = { FieldName: query[i].FieldName, ConditionType: query[i].ConditionType, QueryType: query[i].QueryType };
                            obj.Query.push(queryObj);
                        }

                        RuleList.push(obj);
                    });
                }
                loadingDataValues.BindRules = true;

            },
            error: ShowAjaxError
        });
    },
    BindContactProperties: function () {
        $.ajax({
            url: "/Prospect/LeadProperties/GetAllProperty",
            type: 'POST',
            data: JSON.stringify({ "AccountId": Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (properties) {
                if (properties != null && properties.length > 0) {
                    contactProperties = properties;
                    notifyruleUtil.BindEachProp(contactProperties, 1);
                    notifyruleUtil.BindDropDownClass();
                }
                loadingDataValues.BindContactProperties = true;
                notifyruleUtil.BindAssignUserEmailds();
            },
            error: ShowAjaxError
        });
    },
    BindEachProp: function (properties, index) {
        if (properties != null && properties.length > 0) {
            let DropDownValue;
            $.each(properties, function () {
                DropDownValue += `<option value="${this.PropertyName}">${this.DisplayName}</option>`;
            });
            DropDownValue += `<option value="SearchKeyword">Search Keyword</option>`;
            DropDownValue += `<option value="PageUrl">Page Url</option>`;
            DropDownValue += `<option value="ReferrerUrl">Referrer Url</option>`;
            DropDownValue += `<option value="IsAdSenseOrAdWord">IsAdSenseOrAdWord</option>`;
            DropDownValue += `<option value="Place">Place</option>`;
            DropDownValue += `<option value="CityCategory">City</option>`;
            $(`#FieldType_${index}`).append(DropDownValue);
        }
    },
    BindAssignUserEmailds: function () {
        $.ajax({
            url: "/Prospect/Settings/GetUser",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'UserId': Plumb5UserId }),
            dataType: "json",
            success: function (userList) {
                userInfoList = userList;
                $.each(userList, function (i) {
                    if ($(this)[0].ActiveStatus) {
                        let option = `<option value='${$(this)[0].UserInfoUserId}'>${$(this)[0].FirstName} (${$(this)[0].EmailId})</option>`;
                        $('#ui_sltUserInfo').append(option);
                    }
                });
                loadingDataValues.BindAssignUserEmailds = true;
                notifyruleUtil.BindUserGroup();
            },
            error: ShowAjaxError
        });
    },
    BindUserGroup: function () {
        $.ajax({
            url: "/Prospect/Settings/GetUserGroups",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            dataType: "json",
            success: function (userList) {
                userGroupList = userList;
                $.each(userList, function (i) {
                    let option = `<option value='${$(this)[0].Id}'>${$(this)[0].Name}</option>`;
                    $('#ui_sltUserInfoGroups').append(option);
                });
                loadingDataValues.BindUserGroup = true;
                notifyruleUtil.BindGroups();
                notifyruleUtil.BindLmsSource();
            },
            error: ShowAjaxError
        });
    },
    BindGroups: function () {
        $.ajax({
            url: "/Mail/Group/GetGroupList",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            dataType: "json",
            success: function (groupList) {
                contactGroupList = groupList;
                $.each(groupList, function (i) {
                    let option = `<option value='${$(this)[0].Id}'>${$(this)[0].Name}</option>`;
                    $('#ui_sltGroups').append(option);
                });
                loadingDataValues.BindGroups = true;
                notifyruleUtil.BindMailTemplate();
            },
            error: ShowAjaxError
        });
    },
    BindLmsSource: function () {
        $.ajax({
            url: "/Prospect/NotificationRules/GetLMSGroupList",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            dataType: "json",
            success: function (groupList) {
                contactGroupList = groupList;
                $.each(groupList, function (i) {
                    let option = `<option value='${$(this)[0].Id}'>${$(this)[0].Name}</option>`;
                    $('#ui_sltSource').append(option);
                });
                loadingDataValues.BindLmsSource = true;

            },
            error: ShowAjaxError
        });
    },
    BindMailTemplate: function () {
        $.ajax({
            url: "/Mail/MailTemplate/GetAllTemplateList",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (TemplateList) {
                if (TemplateList != undefined && TemplateList != null && TemplateList.length > 0) {
                    $.each(TemplateList, function () {
                        let option = `<option value='${$(this)[0].Id}'>${$(this)[0].Name}</option>`;
                        $('#ui_sltMailTemplate').append(option);
                    });
                }
                loadingDataValues.BindMailTemplate = true;
                notifyruleUtil.BindSmsTemplate();
            },
            error: ShowAjaxError
        });
    },
    BindSmsTemplate: function () {
        $.ajax({
            url: "/Sms/ScheduleCampaign/GetTemplateList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (SMSList) {
                if (SMSList != undefined && SMSList != null && SMSList.length > 0) {
                    $.each(SMSList, function () {
                        let option = `<option value='${$(this)[0].Id}'>${$(this)[0].Name}</option>`;
                        $('#ui_sltSmsTemplate').append(option);
                    });
                }
                loadingDataValues.BindSmsTemplate = true;
                notifyruleUtil.BindWATemplate();
            },
            error: ShowAjaxError
        });
    },
    SaveRuleDetails: function () {
        ShowPageLoading();
        if (!notifyruleUtil.ValidateRuleDetails()) {
            HidePageLoading();
            return false;
        }

        let contactRule = notifyruleUtil.AssignValueToContactRule();

        if (contactRule != null) {
            $.ajax({
                url: "/Prospect/NotificationRules/SaveContactNotificationRule",
                type: 'POST',
                data: JSON.stringify({ "AccountId": Plumb5AccountId, "contactNotificationrule": contactRule, "mailSendingSetting": mailSendingSetting, 'smsSendingSetting': smsSendingSetting, 'whatsAppSendingSetting': waSendingSetting }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response > 0) {
                        ShowSuccessMessage(GlobalErrorList.ContactRuleNotification.RuleSaved);
                        notifyruleUtil.BindRulesList();
                        $(".lmsclseaddrule").click();
                        try {
                            NotificationRulesUtil.RedirectToPage();
                        } catch { }

                    } else if (response == -1) {
                        ShowErrorMessage(GlobalErrorList.ContactRuleNotification.RuleAlreadyExists);
                    } else {
                        ShowErrorMessage(GlobalErrorList.ContactRuleNotification.RuleNotSaved);
                    }
                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        } else {
            ShowErrorMessage(GlobalErrorList.ContactRuleNotification.RuleNotSaved);
        }
    },
    ValidateRuleDetails: function () {
        if ($("#lmsaddrulautonotifeml").is(":checked")) {
            if ($("#ui_sltMailTemplate").val() == "0") {
                ShowErrorMessage(GlobalErrorList.ContactRuleNotification.MailTemplateError);
                return false;
            }

            if (CleanText($.trim($("#ui_MailFromName").val())).length == "0") {
                ShowErrorMessage(GlobalErrorList.ContactRuleNotification.MailFromNameError);
                return false;
            }

            if (CleanText($.trim($("#ui_MailSubject").val())).length == 0) {
                ShowErrorMessage(GlobalErrorList.ContactRuleNotification.MailSubjectError);
                return false;
            }

            if (CleanText($.trim($("#ui_FromEmail").val())).length == 0) {
                ShowErrorMessage(GlobalErrorList.ContactRuleNotification.MailFromEmailError);
                return false;
            }

            if (!regExpEmail.test(CleanText($.trim($("#ui_FromEmail").val())))) {
                ShowErrorMessage(GlobalErrorList.ContactRuleNotification.MailFromEmailIdError);
                return false;
            }
        }

        if ($("#lmsaddrulautonotifsms").is(":checked")) {
            if ($("#ui_sltSmsTemplate").val() == "0") {
                ShowErrorMessage(GlobalErrorList.ContactRuleNotification.SmsTemplateError);
                return false;
            }
        }

        if ($("#lmsaddrulautonotifwa").is(":checked")) {
            if ($("#ui_sltWhatsAppTemplate").val() == "0") {
                ShowErrorMessage(GlobalErrorList.ContactRuleNotification.WATemplateError);
                return false;
            }
        }

        if ($("#lmsaddrulasgnindiv").is(":checked")) {
            if ($("#ui_sltUserInfo").val() == "0") {
                ShowErrorMessage(GlobalErrorList.ContactRuleNotification.UsersError);
                return false;
            }
        }

        if ($("#lmsaddrulasgnrrbin").is(":checked")) {
            if ($("#ui_sltUserInfoGroups").val() == "0") {
                ShowErrorMessage(GlobalErrorList.ContactRuleNotification.UserGroupsError);
                return false;
            }
        }

        if ($("#lmsaddrulautoassigngroup").is(":checked")) {
            if ($("#ui_sltGroups").val() == "0") {
                ShowErrorMessage(GlobalErrorList.ContactRuleNotification.NoGroupSelected);
                return false;
            }
        }
        if ($("#lmsaddrulautoassignsource").is(":checked")) {
            if ($("#ui_sltSource").val() == "0") {
                ShowErrorMessage(GlobalErrorList.ContactRuleNotification.NoLmssourceSelected);
                return false;
            }
        }
        if (CleanText($.trim($("#ui_RuleName").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.ContactRuleNotification.RuleNameError);
            return false;
        }

        for (let i = 1; i <= NoOFFieldAddedAndRemoved; i++) {
            if ($(`#FieldType_${i} option:selected`).val() == "0") {
                ShowErrorMessage(GlobalErrorList.ContactRuleNotification.FieldNameError);
                return false;
            }

            if ($(`#Condition_FieldType_${i} option:selected`).val() == "0") {
                ShowErrorMessage(GlobalErrorList.ContactRuleNotification.ConditionError);
                return false;
            }

            if ($(`#Answer_FieldType_${i}`).is(":visible")) {
                if (CleanText($.trim($(`#Answer_FieldType_${i}`).val())).length == 0) {
                    ShowErrorMessage(GlobalErrorList.ContactRuleNotification.AnswerFieldInputError);
                    return false;
                }
            }

            if ($(`#AnswerDpBn_FieldType_${i}`).is(":visible")) {
                if ($(`#AnswerDpBn_FieldType_${i} option:selected`).val() == "0") {
                    ShowErrorMessage(GlobalErrorList.ContactRuleNotification.AnswerFieldError);
                    return false;
                }
            }
        }

        return true;
    },
    AssignValueToContactRule: function () {
        Conditions.length = 0;
        contactRule.Name = $("#ui_RuleName").val();

        if ($("#lmsaddrulnotifeml").is(":checked")) {
            contactRule.Mail = true;
        }
        else {
            contactRule.Mail = false;
        }

        if ($("#lmsaddrulnotifsms").is(":checked")) {
            contactRule.Sms = true;
        }
        else {
            contactRule.Sms = false;
        }

        if ($("#lmsaddrulnotifwa").is(":checked")) {
            contactRule.WhatsApp = true;
        }
        else {
            contactRule.WhatsApp = false;
        }

        if ($("#lmsaddrulautonotifeml").is(":checked")) {
            mailSendingSetting.Name = notifyruleUtil.CreateUniqueIdentifier();
            mailSendingSetting.MailTemplateId = $("#ui_sltMailTemplate option:selected").val();
            mailSendingSetting.FromEmailId = $("#ui_FromEmail").val();
            mailSendingSetting.FromName = $("#ui_MailFromName").val();
            mailSendingSetting.Subject = $("#ui_MailSubject").val();
            mailSendingSetting.ReplyTo = $("#ui_FromEmail").val();
        }
        else {
            mailSendingSetting.Name = "";
            mailSendingSetting.MailTemplateId = 0;
            mailSendingSetting.FromEmailId = "";
            mailSendingSetting.FromName = "";
            mailSendingSetting.Subject = "";
            mailSendingSetting.ReplyTo = "";
        }

        if ($("#lmsaddrulautonotifsms").is(":checked")) {
            smsSendingSetting.Name = notifyruleUtil.CreateUniqueIdentifier();
            smsSendingSetting.SmsTemplateId = $("#ui_sltSmsTemplate option:selected").val();
        }
        else {
            smsSendingSetting.Name = "";
            smsSendingSetting.SmsTemplateId = 0;
        }

        if ($("#lmsaddrulautonotifwa").is(":checked")) {
            waSendingSetting.Name = notifyruleUtil.CreateUniqueIdentifier();
            waSendingSetting.WhatsAppTemplateId = $("#ui_sltWhatsAppTemplate option:selected").val();
        }
        else {
            waSendingSetting.Name = "";
            waSendingSetting.WhatsAppTemplateId = 0;
        }

        if ($("#lmsaddrulasgnindiv").is(":checked")) {
            contactRule.AssignUserInfoUserId = $("#ui_sltUserInfo option:selected").val();
        }
        else {
            contactRule.AssignUserInfoUserId = 0;
        }

        if ($("#lmsaddrulasgnrrbin").is(":checked")) {
            contactRule.AssignUserGroupId = $("#ui_sltUserInfoGroups option:selected").val();
        }
        else {
            contactRule.AssignUserGroupId = 0;
        }

        if ($("#lmsaddrulautoassigngroup").is(":checked")) {
            contactRule.AutoAssignToGroupId = $("#ui_sltGroups option:selected").val();
        }
        else {
            contactRule.AutoAssignToGroupId = 0;
        }
        if ($("#lmsaddrulautoassignsource").is(":checked")) {
            contactRule.AutoAssignToLmsSourceId = $("#ui_sltSource option:selected").val();
        }
        else {
            contactRule.AutoAssignToLmsSourceId = 0;
        }

        for (let i = 1; i <= NoOFFieldAddedAndRemoved; i++) {
            let ConditionFieldQuery = { FieldName: "", ConditionType: "", AnswerValue: "", QueryType: "" };
            if (i != 1) {
                ConditionFieldQuery.QueryType = $(`input[name='lmsaddrulfilcndtype_${i}']:checked`).val();
            }

            ConditionFieldQuery.FieldName = $(`#FieldType_${i} option:selected`).val();
            ConditionFieldQuery.ConditionType = $(`#Condition_FieldType_${i} option:selected`).val();

            if ($(`#Answer_FieldType_${i}`).is(":visible")) {
                ConditionFieldQuery.AnswerValue = CleanText($.trim($(`#Answer_FieldType_${i}`).val()));
            }

            if ($(`#AnswerDpBn_FieldType_${i}`).is(":visible")) {
                ConditionFieldQuery.AnswerValue = $(`#AnswerDpBn_FieldType_${i} option:selected`).val();
            }

            Conditions.push(ConditionFieldQuery);
        }

        contactRule.Conditions = JSON.stringify(Conditions);

        return contactRule;
    },
    BindDropDownClass: function () {
        $(".selectDropdown").select2({
            minimumResultsForSearch: "",
            dropdownAutoWidth: false,
            containerCssClass: "border",
        });
    },
    BindSubDropDownClass: function () {
        $(".selectField").select2({
            minimumResultsForSearch: "",
            dropdownAutoWidth: false,
            containerCssClass: "border",
        });
    },
    BindDateFormat: function (index) {
        $(`#Answer_FieldType_${index}`).datepicker({
            prevText: "click for previous months",
            nextText: "click for next months",
            showOtherMonths: true,
            selectOtherMonths: false
        });
    },
    BindEachField: function (index) {
        let addlmsfildval = `<div class="lmsfildvalmore"> 
                            <div class="lmsconditypwrp">
                                <label class="frmlbltxt w-100">Condition Type</label>
                                <div class="custom-control custom-radio custom-control-inline">
                                    <input type="radio" class="custom-control-input" id="lmsaddrulfldcndand_${index}" name="lmsaddrulfilcndtype_${index}" value="AND" checked="checked">
                                    <label class="custom-control-label" for="lmsaddrulfldcndand_${index}">AND</label>
                                </div>
                                <div class="custom-control custom-radio custom-control-inline">
                                    <input type="radio" class="custom-control-input" id="lmsaddrulfldcndor_${index}" name="lmsaddrulfilcndtype_${index}" value="OR">
                                    <label class="custom-control-label" for="lmsaddrulfldcndor_${index}">OR</label>
                                </div>
                            </div>
                            <div class="row mt-2">
                                <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                    <div class="form-group">
                                    <label class="frmlbltxt">Field Name</label>
                                    <select class="form-control selectDropdown selectFiledNamedrpdwn" name="" id="FieldType_${index}" data-placeholder="Add Fields" fieldindex="${index}">
                                        <option value="0">Select</option>                                        
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-group"> <label class="frmlbltxt">Condition</label>
                                <select class="form-control selectDropdown conditionrule" name="" id="Condition_FieldType_${index}" data-placeholder="Add Fields">
                                    <option value="0">Select</option>
                                    <option value="Equal">Equal</option>
                                    <option value="Is not Equal">Is not Equal</option>
                                    <option value="Greater Than">Greater Than</option>
                                    <option value="Less Than">Less Than</option>
                                    <option value="Contains">Contains</option>
                                    <option value="Not Contains">Not Contains</option>
                                </select>
                            </div>
                       </div>
                       <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div class="d-flex align-items-center">
                                <div class="form-group" id="ui_inputdropdowndiv_${index}">   
                                    <label class="frmlbltxt">Field Answer</label>
                                    <input type="text" name="" class="form-control form-control-sm" id="Answer_FieldType_${index}">
                            </div>
                            <i class="fa fa-trash lmsaddfilddel" fieldindex="${index}"></i>
                      </div>
                </div>
            </div>
        </div>`;
        $(".lmsfildvaladdwrp").append(addlmsfildval);
        notifyruleUtil.BindDropDownClass();
        notifyruleUtil.BindEachProp(contactProperties, index);
    },
    BindConditionField: function (contactField) {
        if (contactField != null && contactField.FieldIndex != undefined) {
            $(`#ui_inputdropdowndiv_${contactField.FieldIndex}`).empty();
            switch (contactField.FieldType.toLowerCase()) {
                case "enum":
                    notifyruleUtil.ClearFields(contactField.FieldIndex);
                    let aswerField = contactField.FieldValue.split(',');
                    notifyruleUtil.BindDropDownDiv(aswerField, contactField.FieldIndex);
                    break;
                case "string":
                    notifyruleUtil.ClearFields(contactField.FieldIndex);
                    notifyruleUtil.BindInputDiv(contactField.FieldIndex);
                    break;
                case "datetime":
                    notifyruleUtil.ClearFields(contactField.FieldIndex);
                    notifyruleUtil.BindInputDiv(contactField.FieldIndex);
                    notifyruleUtil.BindDateFormat(contactField.FieldIndex);
                    break;
            }
        }
    },
    BindDropDownDiv: function (aswerField, index) {
        let option = "";
        for (let i = 0; i < aswerField.length; i++) {
            option += `<option value"${aswerField[i]}">${aswerField[i]}</option>`;
        }
        let dropdown = `   <label class="frmlbltxt">Field Answer</label>
                           <select class="form-control selectField" name="" id="AnswerDpBn_FieldType_${index}" data-placeholder="Add Fields">
                              <option value="0">Select</option>
                              ${option}
                           </select>
                       `;
        $(`#ui_inputdropdowndiv_${index}`).append(dropdown);
        notifyruleUtil.BindSubDropDownClass();
    },
    BindInputDiv: function (index) {
        let inpt = `
                    <label class="frmlbltxt">Field Answer</label>
                    <input type="text" name="" class="form-control form-control-sm" id="Answer_FieldType_${index}">
                   `;
        $(`#ui_inputdropdowndiv_${index}`).append(inpt);
    },
    ClearFields: function (Index) {
        $(`#AnswerDpBn_FieldType_${Index}`).empty();
        $(`#Answer_FieldType_${Index}`).val();
    },
    CreateUniqueIdentifier: function () {
        var today = new Date();
        var strYear = today.getMonth().toString() + 1 + today.getDate().toString() + today.getMilliseconds().toString();
        return "Contact Rule Identifier -" + strYear;
    },
    GetSelectedFields: function () {
        let conditionArray = [];
        for (let i = 1; i <= NoOFFieldAddedAndRemoved; i++) {
            let ConditionFieldQuery = { FieldName: "", ConditionType: "", QueryType: "" };
            if (i != 1) {
                ConditionFieldQuery.QueryType = $(`input[name='lmsaddrulfilcndtype_${i}']:checked`).val();
            }

            ConditionFieldQuery.FieldName = $(`#FieldType_${i} option:selected`).val();
            ConditionFieldQuery.ConditionType = $(`#Condition_FieldType_${i} option:selected`).val();
            conditionArray.push(ConditionFieldQuery);
        }

        return conditionArray;
    },
    GetMatchedRules: function () {
        let matchedRule = [];
        let conditionArray = notifyruleUtil.GetSelectedFields();
        if (conditionArray != null && conditionArray.length > 0) {
            if (RuleList != null && RuleList.length > 0) {
                for (let i = 0; i < RuleList.length; i++) {
                    if (RuleList[i].Query.length == conditionArray.length) {
                        let status = notifyruleUtil.CheckEachMatchRule(RuleList[i], conditionArray);
                        if (status) {
                            matchedRule.push(RuleList[i]);
                        }
                    }
                }
            } else {
                matchedRule.length = 0;
            }
        }

        return matchedRule;
    },
    CheckEachMatchRule: function (EachRule, SelectedRule) {
        let totalLength = EachRule.Query.length;
        let MatchedLength = 0;
        let status = false;
        for (let i = 0; i < EachRule.Query.length; i++) {
            if (JSON.stringify(EachRule.Query[i]) === JSON.stringify(SelectedRule[i])) {
                MatchedLength++;
            }
        }

        if (totalLength == MatchedLength) {
            status = true;
        }

        return status;
    },
    BindMatchedRule: function (Matceddata) {
        $("#ui_MatchedRule").empty();
        if (Matceddata != null && Matceddata.length > 0) {
            $.each(Matceddata, function () {
                let status = $(this)[0].Status == true ? { Color: "success", Result: "Active" } : { Color: "error", Result: "Inactive" };
                let content = `
                        <tr class="bg-white">
                            <td class="td-wid-70 m-p-w-250">
                                ${$(this)[0].Name}
                            </td>
                            <td class="td-wid-30 m-p-w-190 text-color-${status.Color}">
                                ${status.Result}
                            </td>
                        </tr>
                      `;
                $("#ui_MatchedRule").append(content);
            });
        } else {
            $("#ui_MatchedRule").append(`<tr><td colspan="2"><div class="no-data">There is no data matching the rule.</div></td></tr>`);
        }
    },
    GetRuleDetailsForEdit: function (RuleId) {
        $.ajax({
            url: "/Prospect/NotificationRules/GetRulesForEdit",
            type: 'POST',
            data: JSON.stringify({ "AccountId": Plumb5AccountId, "RuleId": RuleId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (rules) {
                $(".lmsfildvaladdwrp").empty();
                if (rules != null && rules.ContactNotificationRule != null && rules.ContactNotificationRule.length > 0) {
                    $(".lmsaddrulewrp").removeClass("hideDiv");
                    notifyruleUtil.BindRuleDetailsForEdit(rules.ContactNotificationRule[0], rules.mailSendingSetting, rules.smsSendingSetting, rules.wasendingsetting);
                }
                else
                    ShowErrorMessage(GlobalErrorList.ContactRuleNotification.NoDataFoundForEdit);
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    BindRuleDetailsForEdit: function (contactRule, mailsendingsetting, smssendingsetting, wasendingsetting) {
        $("#ui_RuleName").val(contactRule.Name);

        if (contactRule.Mail) {
            $("#lmsaddrulnotifeml").prop("checked", true);
        }

        if (contactRule.Sms) {
            $("#lmsaddrulnotifsms").prop("checked", true);
        }

        if (contactRule.WhatsApp) {
            $("#lmsaddrulnotifwa").prop("checked", true);
        }

        if (contactRule.AutoMailSendingSettingId > 0) {
            if (mailsendingsetting != null && mailsendingsetting.MailTemplateId > 0) {
                $("#ui_sltMailTemplate").select2().val(mailsendingsetting.MailTemplateId).trigger('change');
                $("#ui_FromEmail").val(mailsendingsetting.FromEmailId);
                $("#ui_MailFromName").val(mailsendingsetting.FromName);
                $("#ui_MailSubject").val(mailsendingsetting.Subject);
                $("#lmsaddrulautonotifeml").click();
            }
        }

        if (contactRule.AutoSmsSendingSettingId > 0) {
            if (smssendingsetting != null && smssendingsetting.SmsTemplateId > 0) {
                $("#ui_sltSmsTemplate").select2().val(smssendingsetting.SmsTemplateId).trigger('change');
                $("#lmsaddrulautonotifsms").click();
            }
        }

        if (contactRule.AutoWhatsAppSendingSettingId > 0) {
            if (wasendingsetting != null && wasendingsetting.WhatsAppTemplateId > 0) {
                $("#ui_sltWhatsAppTemplate").select2().val(wasendingsetting.WhatsAppTemplateId).trigger('change');
                $("#lmsaddrulautonotifwa").click();
            }
        }

        if (contactRule.AssignUserInfoUserId > 0) {
            $("#ui_sltUserInfo").select2().val(contactRule.AssignUserInfoUserId).trigger('change');
            $("#lmsaddrulasgnindiv").click();
        }

        if (contactRule.AssignUserGroupId > 0) {
            $("#ui_sltUserInfoGroups").select2().val(contactRule.AssignUserGroupId).trigger('change');
            $("#lmsaddrulasgnrrbin").click();
        }

        if (contactRule.AutoAssignToGroupId > 0) {
            $("#ui_sltGroups").select2().val(contactRule.AutoAssignToGroupId).trigger('change');
            $("#lmsaddrulautoassigngroup").click();
        }
        if (contactRule.AutoAssignToLmsSourceId > 0) {
            $("#ui_sltSource").select2().val(contactRule.AutoAssignToLmsSourceId).trigger('change');
            $("#lmsaddrulautoassignsource").click();
        }
        let QueryList = JSON.parse(contactRule.Conditions);
        let j = 1;
        for (let i = 0; i < QueryList.length; i++) {
            let ConditionFieldQuery = { FieldName: QueryList[i].FieldName, ConditionType: QueryList[i].ConditionType, AnswerValue: QueryList[i].AnswerValue, QueryType: QueryList[i].QueryType };
            if (j != 1) {
                $(".lmsaddfildval").click();
                if (ConditionFieldQuery.QueryType == "AND") {
                    $(`#lmsaddrulfldcndand_${j}`).prop("checked", true);
                } else {
                    $(`#lmsaddrulfldcndor_${j}`).prop("checked", true);
                }
            }

            $(`#FieldType_${j}`).select2().val(ConditionFieldQuery.FieldName).trigger('change');
            $(`#Condition_FieldType_${j}`).select2().val(ConditionFieldQuery.ConditionType).trigger('change');

            if ($(`#Answer_FieldType_${j}`).is(":visible")) {
                $(`#Answer_FieldType_${j}`).val(ConditionFieldQuery.AnswerValue);
            }

            if ($(`#AnswerDpBn_FieldType_${j}`).is(":visible")) {
                $(`#AnswerDpBn_FieldType_${j}`).select2().val(ConditionFieldQuery.AnswerValue).trigger('change');
            }

            j++;
        }
    },
    ClearAllFields: function () {
        $("#ui_RuleName").val("");

        if ($("#lmsaddrulnotifeml").is(":checked")) {
            $("#lmsaddrulnotifeml").prop("checked", false);
        }

        if ($("#lmsaddrulnotifsms").is(":checked")) {
            $("#lmsaddrulnotifsms").prop("checked", false);
        }

        if ($("#lmsaddrulnotifwa").is(":checked")) {
            $("#lmsaddrulnotifwa").prop("checked", false);
        }

        if ($("#lmsaddrulautonotifeml").is(":checked"))
            $("#lmsaddrulautonotifeml").click();

        $("#ui_sltMailTemplate").select2().val("0").trigger('change');
        $("#ui_FromEmail").val("");
        $("#ui_MailFromName").val("");
        $("#ui_MailSubject").val("");


        if ($("#lmsaddrulautonotifsms").is(":checked"))
            $("#lmsaddrulautonotifsms").click();

        $("#ui_sltSmsTemplate").select2().val("0").trigger('change');

        if ($("#lmsaddrulautonotifwa").is(":checked"))
            $("#lmsaddrulautonotifwa").click();

        $("#ui_sltWhatsAppTemplate").select2().val("0").trigger('change');

        if ($("#lmsaddrulasgnindiv").is(":checked"))
            $("#lmsaddrulasgnindiv").click();

        $("#ui_sltUserInfo").select2().val("0").trigger('change');

        if ($("#lmsaddrulasgnrrbin").is(":checked"))
            $("#lmsaddrulasgnrrbin").click();

        $("#ui_sltUserInfoGroups").select2().val("0").trigger('change');

        $("#lmsaddrulautoassigngroup").prop("checked", false);
        $("#ui_sltGroups").select2().val("0").trigger('change');
        $("#lmsaddrulautoassignsource").prop("checked", false);
        $("#ui_sltSource").select2().val("0").trigger('change');
        for (let i = 1; i <= NoOFFieldAddedAndRemoved; i++) {

            if (i == 1) {
                $(`#FieldType_${i}`).select2().val("0").trigger('change');
                $(`#Condition_FieldType_${i}`).select2().val("0").trigger('change');
                $(`#Answer_FieldType_${i}`).val("");
                $(`#AnswerDpBn_FieldType_${i}`).select2().val("0").trigger('change');
            } else {
                $(".lmsaddfilddel").click();
            }
        }

        NoOFFieldAddedAndRemoved = 1;
    },
    AssignIdToZero: () => Id = 0,
    BindDisplayField: function (FieldName, FieldType, index) {
        let ischeck = false;
        for (let i = 0; i < ContactPropertyList.length; i++) {
            if (ContactPropertyList[i].FrontEndName == FieldName) {
                ischeck = true;
                let prop = `<option value="${ContactPropertyList[i].P5ColumnName}" FieldType="${FieldType}">${ContactPropertyList[i].FrontEndName}</option>`;
                $(`#FieldType_${index}`).append(prop);
                return ischeck;
            }
        }
        return ischeck;
    },
    BindRuleForEdit: function (QueryNewList) {
        let j = 2;
        for (let i = 0; i < QueryNewList.length; i++) {
            let ConditionFieldQuery = { FieldName: QueryNewList[i].FieldName, ConditionType: QueryNewList[i].ConditionType, AnswerValue: QueryNewList[i].AnswerValue, QueryType: QueryNewList[i].QueryType };
            if (j != 1) {
                if (ConditionFieldQuery.QueryType == "AND") {
                    $(`#lmsaddrulfldcndand_${j}`).prop("checked", true);
                } else {
                    $(`#lmsaddrulfldcndor_${j}`).prop("checked", true);
                }
            }

            $(`#FieldType_${j}`).select2().val(ConditionFieldQuery.FieldName).trigger('change');
            $(`#Condition_FieldType_${j}`).select2().val(ConditionFieldQuery.ConditionType).trigger('change');

            if ($(`#Answer_FieldType_${j}`).is(":visible")) {
                $(`#Answer_FieldType_${j}`).val(ConditionFieldQuery.AnswerValue);
            }

            if ($(`#AnswerDpBn_FieldType_${j}`).is(":visible")) {
                $(`#AnswerDpBn_FieldType_${j}`).select2().val(ConditionFieldQuery.AnswerValue).trigger('change');
            }

            j++;
        }
    },
    PushToList: function (index) {
        index == 0 ? 0 : index;
        QueryNewList.length = 0;
        for (let i = 2; i <= NoOFFieldAddedAndRemoved; i++) {
            let ConditionFiedQuery = { FieldName: "", ConditionType: "", AnswerValue: "", QueryType: "" };
            if (i != 1) {
                ConditionFiedQuery.QueryType = $(`input[name='lmsaddrulfilcndtype_${i}']:checked`).val();
            }

            ConditionFiedQuery.FieldName = $(`#FieldType_${i} option:selected`).val();
            ConditionFiedQuery.ConditionType = $(`#Condition_FieldType_${i} option:selected`).val();

            if ($(`#Answer_FieldType_${i}`).is(":visible")) {
                ConditionFiedQuery.AnswerValue = CleanText($.trim($(`#Answer_FieldType_${i}`).val()));
            }

            if ($(`#AnswerDpBn_FieldType_${i}`).is(":visible")) {
                ConditionFiedQuery.AnswerValue = $(`#AnswerDpBn_FieldType_${i} option:selected`).val();
            }
            if (index == 0) {
                QueryNewList.push(ConditionFiedQuery);
            } else if (index != i) {
                QueryNewList.push(ConditionFiedQuery);
            }
        }

        return QueryNewList;
    },
    BindWATemplate: function () {
        $("#ui_sltWhatsAppTemplate").html(`<option value="0">Select Template</option>`);
        $.ajax({
            url: "/WhatsApp/ScheduleCampaign/GetTemplateList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (WATemplateList) {
                if (WATemplateList != undefined && WATemplateList != null && WATemplateList.length > 0) {
                    $.each(WATemplateList, function () {
                        $("#ui_sltWhatsAppTemplate").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    });
                }
                loadingDataValues.BindWATemplate = true;
            },
            error: ShowAjaxError
        });
    }
};

//$(document).ready(() => {
//    notifyruleUtil.BindRulesList();
//    notifyruleUtil.BindContactProperties();
//    notifyruleUtil.BindAssignUserEmailds();
//    notifyruleUtil.BindUserGroup();
//    notifyruleUtil.BindGroups();
//    notifyruleUtil.BindMailTemplate();
//    notifyruleUtil.BindSmsTemplate();
//});

$(".lmsaddruletab").click(function () {
    contactRule.Id = notifyruleUtil.AssignIdToZero();
    $(".lmsaddrulewrp").removeClass("hideDiv");
});

$(".lmsclseaddrule").click(function () {
    contactRule.Id = notifyruleUtil.AssignIdToZero();
    $(".lmsaddrulewrp").addClass("hideDiv");
    notifyruleUtil.ClearAllFields();
});

$("#lmsaddrulasgnindiv").change(function () {
    if ($("#lmsaddrulasgnrrbin").is(":checked")) {
        $("#lmsaddrulasgnrrbin").prop("checked", false);
    }

    if ($(this).is(":checked")) {
        $(".lmsaddrulselgrp").addClass("hideDiv");
        $(".lmsaddrulselusrs").removeClass("hideDiv");
    } else {
        $(".lmsaddrulselusrs").addClass("hideDiv");
    }
});

$("#lmsaddrulasgnrrbin").change(function () {
    if ($("#lmsaddrulasgnindiv").is(":checked")) {
        $("#lmsaddrulasgnindiv").prop("checked", false);
    }

    if ($(this).is(":checked")) {
        $(".lmsaddrulselusrs").addClass("hideDiv");
        $(".lmsaddrulselgrp").removeClass("hideDiv");
    } else {
        $(".lmsaddrulselgrp").addClass("hideDiv");
    }
});

$(".select2drpdwnbrd").select2({
    minimumResultsForSearch: "",
    dropdownAutoWidth: false,
    containerCssClass: "border",
});

$('input[name="lmsaddrulautoassigngroup"]').click(function () {
    if ($("#lmsaddrulautoassigngroup").is(":checked")) {
        $(this).parent().next().removeClass("hideDiv");
    } else {
        $(this).parent().next().addClass("hideDiv");
    }
});

$('input[name="lmsaddrulautoassignsource"]').click(function () {
    if ($("#lmsaddrulautoassignsource").is(":checked")) {
        $(this).parent().next().removeClass("hideDiv");
    } else {
        $(this).parent().next().addClass("hideDiv");
    }
});

$(".lmsaddfildval").click(function () {
    let queryList = notifyruleUtil.PushToList(0);
    $(".lmsfildvaladdwrp").removeClass("hideDiv");
    NoOFFieldAddedAndRemoved++;

    if (NoOFFieldAddedAndRemoved != 1) {
        notifyruleUtil.BindEachField(NoOFFieldAddedAndRemoved);
    }

    // $(".lmsfildvaladdwrp").empty();


    // for (let i = 1; i <= NoOFFieldAddedAndRemoved; i++) {
    // if (i != 1) {
    // notifyruleUtil.BindEachField(i);
    // }
    // }
    notifyruleUtil.BindRuleForEdit(queryList);
});

$(".lmsfildvaladdwrp").on("click", ".lmsaddfilddel", function () {

    let fieldIndex = parseInt($(this).attr("fieldindex"));
    let queryList = notifyruleUtil.PushToList(fieldIndex);
    NoOFFieldAddedAndRemoved--;
    $(".lmsfildvaladdwrp").empty();
    for (let i = 1; i <= NoOFFieldAddedAndRemoved; i++) {
        if (i != 1) {
            notifyruleUtil.BindEachField(i);
        }
    }

    notifyruleUtil.BindRuleForEdit(queryList);
    let matchedRule = notifyruleUtil.GetMatchedRules();
    notifyruleUtil.BindMatchedRule(matchedRule);
});

$(document).on('change', '.selectFiledNamedrpdwn', function () {
    let FieldName = $('option:selected', this).val();
    let FieldIndex = $(this).attr('fieldindex');
    let contactSelectedFields = JSLINQ(contactProperties).Where(function () {
        return (this.FieldName == FieldName);
    });

    let contactField;
    if (contactSelectedFields.items != null && contactSelectedFields.items.length > 0) {
        if (FieldRequird.indexOf(contactSelectedFields.items[0].FieldName) > -1) {
            contactField = { FieldName: contactSelectedFields.items[0].FieldName, FieldType: "string", FieldValue: contactSelectedFields.items[0].FieldValue, FieldIndex: FieldIndex };
        } else {
            contactField = { FieldName: contactSelectedFields.items[0].FieldName, FieldType: contactSelectedFields.items[0].FieldType, FieldValue: contactSelectedFields.items[0].FieldValue, FieldIndex: FieldIndex };
        }
    } else {
        let contactSelectField = JSLINQ(contactProperties).Where(function () {
            return (this.CustomFieldName == FieldName);
        });
        if (contactSelectField.items != null && contactSelectField.items.length > 0) {
            contactField = { FieldName: contactSelectField.items[0].FieldName, FieldType: contactSelectField.items[0].FieldType, FieldValue: contactSelectField.items[0].FieldValue, FieldIndex: FieldIndex };
        }
    }

    notifyruleUtil.BindConditionField(contactField);
    let matchedRule = notifyruleUtil.GetMatchedRules();
    notifyruleUtil.BindMatchedRule(matchedRule);
});

$(document).on('change', '.conditionrule', function () {
    let matchedRule = notifyruleUtil.GetMatchedRules();
    notifyruleUtil.BindMatchedRule(matchedRule);
});

$(document).on('click', 'input[type="radio"]', function () {
    let matchedRule = notifyruleUtil.GetMatchedRules();
    notifyruleUtil.BindMatchedRule(matchedRule);
});

$('input[name="lmsaddrulautonotifeml"]').click(function () {
    $(".lmsaddrulautoemlbdy").toggleClass("hideDiv");
});

$('input[name="lmsaddrulautonotifsms"]').click(function () {
    $(".lmsaddrulautosmsbdy").toggleClass("hideDiv");
});

$('input[name="lmsaddrulautonotifwa"]').click(function () {
    $(".lmsaddrulautowhtsapbdy").toggleClass("hideDiv");
});

$("#ui_SaveRule").click(function () {
    notifyruleUtil.SaveRuleDetails();
});

function EditRuleContact(RuleId) {
    ShowPageLoading();
    contactRule.Id = RuleId;
    notifyruleUtil.ClearAllFields();
    notifyruleUtil.GetRuleDetailsForEdit(RuleId);
}
