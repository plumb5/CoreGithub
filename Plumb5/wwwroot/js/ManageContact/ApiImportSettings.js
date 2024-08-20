var QuickFilterBy = '', DataFieldCount = 0, HeaderFieldCount = 0, URLParameterFieldCount = 0, ContactFieldList = [], P5ContactFieldListDropDownValue = "", WebhookList = [], ApiImportResponseList = [];
var ApiImportResponseSettingId = 0;
var checkdataerror = 0;
var lmsSoures = [];
var lmsSourceCount = 1;
var assignsalespersonSourceCount = 1;
var sendmailoutresponercount = 1;
var sendsmsoutresponercount = 1;
var sendwhatsappoutresponercount = 1;
var isincludedleadscount = 1;
var isexcludedleadscount = 1;
var lmsSourceCountArray = [1];
var assignsalesSourceCountArray = [1];
var sendmailoutresponerArray = [1];
var sendsmsoutresponerArray = [1];
var sendwhatsappoutresponerArray = [1];
var IsIncludedLeadArray = [1];
var IsExcludedLeadArray = [1];
var contactproperties = [];
var assignsalespersonuserlist = [];
var assignsalespersongrouplist = [];
var mailoutrespoTemplatelist = [];
var smsoutrespoTemplatelist = [];
var whatsappoutrespoTemplatelist = [];
var mailoutrespofromemaillist = [];
var mailSettingList = new Array();
var smsSettingList = new Array();
var whatsappSettingList = new Array();
var MailOutResponderList = new Array();
var SmsOutResponderList = new Array();
var WhatsappOutResponderList = new Array();
var IsincludedleadsList = new Array();
var IsexcludedleadsList = new Array();
var Mailsendingsettingjson = "";
var MailsendingsettingList = [];
var SmssendingsettingList = [];
var WhatsappsendingsettingList = [];
var editeddataMailsendingsettingList = [];
var editeddataSmssendingsettingList = [];
var editeddatawhatsappsendingsettingList = [];
var editIsIncludedleadList = [];
var editIsExcludedleadList = [];
var editeddataAssignStageList = [];
var editeddataAssignGroupList = [];
var assignstagecount = 1;
var assignstageArray = [1];
var AssignStageLists = new Array();
var assignGroupcount = 1;
var assignGroupArray = [1];
var AssignGroupLists = new Array();
var StageList = [];
var GroupList = [];

$(document).ready(function () {
    DragDroReportUtil.Getlmscustomfields();
    ApiImportResponsesSettingUtil.IntializeMailTemplate();
    $("#dvConditionalmailoutresp").hide();
    $("#dvConditionalsmsoutresp").hide();
    $("#dvConditionalwhatsappoutresp").hide();
    $("#dvConditionalAssignGroup").hide();
    ApiImportResponsesSettingUtil.GetLmsStage(1);
    ApiImportResponsesSettingUtil.BindMailSendingSettingsValue(0);
    ApiImportResponsesSettingUtil.BindSmsSendingSettingsValue(0);
    ApiImportResponsesSettingUtil.BindWhatsAppSendingSettingsValue(0);
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    ApiImportResponsesSettingUtil.MaxCount();
    DragDroReportUtil.BindUrlEventMappingDetails('');
    GetContactFielddragdrop('');
    DragDroReportUtil.GetReport();
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    ApiImportResponsesSettingUtil.GetReport();
}

var ApiImportResponsesSettingUtil = {
    IntializeMailTemplate: function () {
        $.ajax({
            url: "/CaptureForm/CommonDetailsForForms/GetTemplate",
            type: 'Post',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (TemplateList) {
                mailoutrespoTemplatelist = TemplateList.Data;
                if (TemplateList.Data != undefined && TemplateList.Data != null && TemplateList.Data.length > 0) {
                    ApiImportResponsesSettingUtil.BindSendMailOutResponderTemp(1);
                    $.each(TemplateList.Data, function () {
                        $("#ui_drpdwn_MailTemplate").append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");
                    });
                }

                ApiImportResponsesSettingUtil.InitializeActiveEmailId();
            },
            error: ShowAjaxError
        });
    },
    InitializeActiveEmailId: function () {
        $.ajax({
            url: "/CaptureForm/CommonDetailsForForms/GetActiveEmailIds",
            type: 'Post',
            data: JSON.stringify({}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

                if (response != undefined && response != null) {
                    mailoutrespofromemaillist = response;
                    ApiImportResponsesSettingUtil.BindSendfromemail(1);
                    $.each(response, function (i) {
                        $("#ui_ddlFromEmailSender").append("<option value='" + response[i] + "'>" + response[i] + "</option>");
                    });
                }

                ApiImportResponsesSettingUtil.IntializeSmsTemplate();
            },
            error: ShowAjaxError
        });
    },
    IntializeSmsTemplate: function () {
        $.ajax({
            url: "/CaptureForm/CommonDetailsForForms/GetSmsTemplate",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

                if (response.Data != undefined && response.Data != null && response.Data.length > 0) {
                    smsoutrespoTemplatelist = response.Data;
                    ApiImportResponsesSettingUtil.BindSendSmsOutResponderTemp(1);
                    $.each(response.Data, function () {
                        $("#ui_ddlSmsTemplate").append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");
                    });
                }

                ApiImportResponsesSettingUtil.IntializeWhatsAppTemplate();
            },
            error: ShowAjaxError
        });
    },
    IntializeWhatsAppTemplate: function () {
        $.ajax({
            url: "/CaptureForm/CommonDetailsForForms/GetWhatsAppTemplate",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Data != undefined && response.Data != null && response.Data.length > 0) {
                    whatsappoutrespoTemplatelist = response.Data;
                    ApiImportResponsesSettingUtil.BindSendwhatsappOutResponderTemp(1);
                    $.each(response.Data, function () {
                        $("#ui_ddlWhatsAppTemplate").append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");
                    });
                }

                ApiImportResponsesSettingUtil.InitializeUsersList();
                ApiImportResponsesSettingUtil.GetGroupDetails();
            },
            error: ShowAjaxError
        });
    },
    InitializeUsersList: function () {
        $.ajax({
            url: "/ManageContact/ApiImportSettings/GetUser",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            dataFilter: function (data) { return data; },
            success: function (response) {
                assignsalespersonuserlist = response;
                if (response != undefined && response != null) {
                    ApiImportResponsesSettingUtil.BinduesrlistProperties(1);
                    $.each(response, function () {
                        if ($(this)[0].ActiveStatus) {
                            $("#ui_ddlUserList").append("<option value='" + $(this)[0].UserInfoUserId + "'>" + $(this)[0].FirstName + "</option>")
                        }
                    });
                }

                ApiImportResponsesSettingUtil.InitializeGroupList();
            },
            error: ShowAjaxError
        });
    },
    InitializeGroupList: function () {
        $.ajax({
            url: "/ManageContact/Group/GetGroupsByStaticOrDynamic",
            dataType: "json",
            type: "POST",
            data: JSON.stringify({ 'accountId': Plumb5AccountId, GroupType: 1 }),
            contentType: "application/json; charset=utf-8",
            dataFilter: function (data) { return data; },
            success: function (response) {
                GroupList = response.GroupDetails;
                if (response != undefined && response != null && response.GroupDetails != null) {
                    $.each(response.GroupDetails, function () {
                        $('#ui_ddlGroupList').append($("<option></option>").attr("value", $(this)[0].Id).text($(this)[0].Name));
                        $('#ui_ddl_conAssignGroup_1').append($("<option></option>").attr("value", $(this)[0].Id).text($(this)[0].Name));
                    });
                }
                ApiImportResponsesSettingUtil.BindLmsSource();

            },
            error: ShowAjaxError
        });
    },
    GetGroupDetails: function () {

        $.ajax({
            url: "/ManageContact/Group/GetUserGroupList",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataFilter: function (data) { return data; },
            success: function (response) {

                assignsalespersongrouplist = response;
                if (response != undefined && response != null) {

                    ApiImportResponsesSettingUtil.BindgrouplistProperties(1)
                    $.each(response, function () {
                        $("#ui_ddlusergroupList").append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");
                    });
                }
            },
            error: ShowAjaxError
        });
    },
    InitializeWebHookDetails: function () {

        SetNoRecordContent('ui_tbl_WebHookReportData', 5, 'ui_tbody_WebHookReportData');
        ApiImportResponsesSettingUtil.InitializeContactFields();
    },
    InitializeContactFields: function () {
        $.ajax({
            url: "/CaptureForm/CommonDetailsForForms/GetAllFieldDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && response.length > 0) {
                    ContactFieldList = response;
                }

                ApiImportResponsesSettingUtil.InitializeContactFieldListDropDownValue();
            },
            error: ShowAjaxError
        });
    },
    InitializeContactFieldListDropDownValue: function () {
        P5ContactFieldListDropDownValue = `<option value="0">Select</option>`;

        if (ContactPropertyList != null && ContactPropertyList.length > 0) {
            for (var i = 0; i < ContactPropertyList.length; i++)
                P5ContactFieldListDropDownValue += `<option value="${ContactPropertyList[i].P5ColumnName}">${ContactPropertyList[i].FrontEndName}</option>`;

        }

        if (ContactFieldList != null && ContactFieldList.length > 0) {
            for (var i = 0; i < ContactFieldList.length; i++)
                P5ContactFieldListDropDownValue += `<option datatype="varchar" value="CustomField${i + 1}" >${ContactFieldList[i].FieldName}</option>`;

        }

        ApiImportResponsesSettingUtil.InitializeDropDowns();
    },
    InitializeContactFieldListpersonalize: function () {
        for (var i = 0; i < ContactPropertyList.length; i++) {
            $('[id^="draganddrop"]').append("<option value='" + ContactPropertyList[i].P5ColumnName + "'>" + ContactPropertyList[i].FrontEndName + "</option>");

        }
        for (var i = 0; i < TaggingLmsCustomFields.length; i++) {

            $('[id^="draganddrop"]').append("<option value='" + TaggingLmsCustomFields[i].FieldDisplayName + "'>" + TaggingLmsCustomFields[i].FieldDisplayName + "</option>");

        }
    },
    InitializeEventNameFieldListpersonalize: function () {
        for (var i = 0; i < customeventNameFieldList.length; i++) {
            $('[id^="eventname"]').append('<option attr_id="' + customeventNameFieldList[i].Id + '" value="' + customeventNameFieldList[i].EventName + '">' + customeventNameFieldList[i].EventName + '</option>');
        }
    },
    InitializeDropDowns: function () {
        $('#ui_drpdwn_MailTemplate, #ui_ddlFromEmailSender, #ui_ddlSmsTemplate, #ui_ddlWhatsAppTemplate, #ui_ddlUserList, #ui_ddlGroupList, #methodwebhook, #contentTypewebhook, #filtapiresp,#ui_ddlIsoverridesourceList,#ui_ddlUserListcon_1,#ui_ddlusergroupListcon_1,#ui_assignsalescontactfields_1,#ui_sendmailoutrespcontactfields_1,#ui_drpdwn_conMailTemplate_1,#ui_conddlFromEmailSender_1').select2({
            minimumResultsForSearch: '',
            dropdownAutoWidth: false
        });

        CallBackFunction();
    },
    ValidateSaveOrUpdateSettings: function () {
        if ($("#apirespnametext").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.ApiImportResponses.ResponseNameError);
            $("#apirespnametext").focus();
            return false;
        }

        if ($(".frmrepresmain:checked").length == 0 && $(".frmrepmobnotiweb:checked").length == 0) {
            ShowErrorMessage(GlobalErrorList.ApiImportResponses.SelectSettingsError);
            return false;
        }

        if ($("#frmrepemail:checked").length > 0 && $("#ui_txtArea_ReportByEmail").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.ApiImportResponses.ReportByEmailError);
            $("#ui_txtArea_ReportByEmail").focus();
            return false;
        }

        if ($("#frmrepsms:checked").length > 0 && $("#ui_txtArea_ReportBySms").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.ApiImportResponses.ReportBySmsError);
            $("#ui_txtArea_ReportBySms").focus();
            return false;
        }

        if ($("#frmrepwa:checked").length > 0 && $("#ui_txtArea_ReportByWA").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.ApiImportResponses.ReportByWAError);
            $("#ui_txtArea_ReportByWA").focus();
            return false;
        }

        if ($("#ui_chkSendMailOut:checked").length > 0) {

            if ($("#ui_chkUnConditionalmailoutresp").is(":checked")) {
                if (parseInt($("#ui_drpdwn_MailTemplate").val()) == 0) {
                    ShowErrorMessage(GlobalErrorList.ApiImportResponses.SelectMailTemplateError);
                    return false;
                }

                if ($("#ui_txt_MailSubject").val().length == 0) {
                    ShowErrorMessage(GlobalErrorList.ApiImportResponses.EnterSubjectError);
                    return false;
                }

                if ($("#ui_txt_MailFromName").val().length == 0) {
                    ShowErrorMessage(GlobalErrorList.ApiImportResponses.FromNameError);
                    return false;
                }

                if (parseInt($("#ui_ddlFromEmailSender").val()) == 0) {
                    ShowErrorMessage(GlobalErrorList.ApiImportResponses.ActiveEmailError);
                    return false;
                }
            }
            else {
                for (let i = 0; i < sendmailoutresponerArray.length; i++) {
                    if ($(`#ui_sendmailoutrespcontactfields_${sendmailoutresponerArray[i]} :selected`).val() === "0") {
                        ShowErrorMessage("Please select contact properties");
                        return false;
                    }

                    else if ($(`#ui_sendmailoutresponvalue_${sendmailoutresponerArray[i]}`).val().length == 0) {
                        ShowErrorMessage("Please select values");
                        return false;
                    }
                    if (parseInt($(`#ui_drpdwn_conMailTemplate_${sendmailoutresponerArray[i]}`).val()) == 0) {
                        ShowErrorMessage(GlobalErrorList.ApiImportResponses.SelectMailTemplateError);
                        return false;
                    }

                    if ($(`#ui_txt_conMailSubject_${sendmailoutresponerArray[i]}`).val().length == 0) {
                        ShowErrorMessage(GlobalErrorList.ApiImportResponses.EnterSubjectError);
                        return false;
                    }

                    if ($(`#ui_txt_conMailFromName_${sendmailoutresponerArray[i]}`).val().length == 0) {
                        ShowErrorMessage(GlobalErrorList.ApiImportResponses.FromNameError);
                        return false;
                    }

                    if (parseInt($(`#ui_conddlFromEmailSender_${sendmailoutresponerArray[i]}`).val()) == 0) {
                        ShowErrorMessage(GlobalErrorList.ApiImportResponses.ActiveEmailError);
                        return false;
                    }


                }
            }
        }

        if ($("#ui_chkSendSmsOut:checked").length > 0) {
            if ($("#ui_chkUnConditionalsmsoutresp").is(":checked")) {
                if (parseInt($("#ui_ddlSmsTemplate").val()) == 0) {
                    ShowErrorMessage(GlobalErrorList.ApiImportResponses.SelectSmsTemplateError);
                    return false;
                }
            }
            else {
                for (let i = 0; i < sendsmsoutresponerArray.length; i++) {
                    if ($(`#ui_sendsmsoutrespcontactfields_${sendsmsoutresponerArray[i]} :selected`).val() === "0") {
                        ShowErrorMessage("Please select contact properties");
                        return false;
                    }

                    else if ($(`#ui_sendsmsoutresponvalue_${sendsmsoutresponerArray[i]}`).val().length == 0) {
                        ShowErrorMessage("Please select values");
                        return false;
                    }
                    if (parseInt($(`#ui_ddl_conSmsTemplate_${sendsmsoutresponerArray[i]}`).val()) == 0) {
                        ShowErrorMessage(GlobalErrorList.ApiImportResponses.SelectSmsTemplateError);
                        return false;
                    }

                }
            }
        }
        if ($("#ui_chkSendWhatsAppOut:checked").length > 0) {
            if ($("#ui_chkUnConditionalwhatsappoutresp").is(":checked")) {
                if (parseInt($("#ui_ddlWhatsAppTemplate").val()) == 0) {
                    ShowErrorMessage(GlobalErrorList.ApiImportResponses.SelectWATemplateError);
                    return false;
                }
            }
            else {
                for (let i = 0; i < sendwhatsappoutresponerArray.length; i++) {
                    if ($(`#ui_sendwhatsappoutrespcontactfields_${sendwhatsappoutresponerArray[i]} :selected`).val() === "0") {
                        ShowErrorMessage("Please select contact properties");
                        return false;
                    }

                    else if ($(`#ui_sendwhatsappoutresponvalue_${sendwhatsappoutresponerArray[i]}`).val().length == 0) {
                        ShowErrorMessage("Please select values");
                        return false;
                    }
                    if (parseInt($(`#ui_ddl_conwhatsappTemplate_${sendwhatsappoutresponerArray[i]}`).val()) == 0) {
                        ShowErrorMessage(GlobalErrorList.ApiImportResponses.SelectWATemplateError);
                        return false;
                    }

                }
            }
        }

        if ($("#ui_chkAssignStage:checked").length > 0) {
            if ($("#ui_chkUnConditionalAssignStage").is(":checked")) {
                if (parseInt($("#ui_ddlAssignStage").val()) == 0) {
                    ShowErrorMessage(GlobalErrorList.ApiImportResponses.SelectStageError);
                    return false;
                }
            }
            else {
                for (let i = 0; i < assignstageArray.length; i++) {
                    if ($(`#ui_AssignStagefields_${assignstageArray[i]} :selected`).val() === "0") {
                        ShowErrorMessage("Please select contact properties");
                        return false;
                    }

                    else if ($(`#ui_AssignStagevalue_${assignstageArray[i]}`).val().length == 0) {
                        ShowErrorMessage("Please select values");
                        return false;
                    }
                    if (parseInt($(`#ui_ddl_conAssignStage_${assignstageArray[i]}`).val()) == 0) {
                        ShowErrorMessage(GlobalErrorList.ApiImportResponses.SelectStageError);
                        return false;
                    }

                }
            }
        }
        if ($("#ui_chkAssignGroup:checked").length > 0) {
            if ($("#ui_chkUnConditionalAssignGroup").is(":checked")) {
                if (parseInt($("#ui_ddlGroupList").val()) == 0) {
                    ShowErrorMessage(GlobalErrorList.ApiImportResponses.SelectGroupError);
                    return false;
                }
            }
            else {
                for (let i = 0; i < assignGroupArray.length; i++) {
                    if ($(`#ui_AssignGroupfields_${assignGroupArray[i]} :selected`).val() === "0") {
                        ShowErrorMessage("Please select contact properties");
                        return false;
                    }

                    else if ($(`#ui_AssignGroupvalue_${assignGroupArray[i]}`).val().length == 0) {
                        ShowErrorMessage("Please select values");
                        return false;
                    }
                    if (parseInt($(`#ui_ddl_conAssignGroup_${assignGroupArray[i]}`).val()) == 0) {
                        ShowErrorMessage(GlobalErrorList.ApiImportResponses.SelectGroupError);
                        return false;
                    }

                }
            }
        }
        if ($("#frmrepautassgngrp:checked").length > 0 && parseInt($("#ui_ddlGroupList").val()) == 0) {
            ShowErrorMessage(GlobalErrorList.ApiImportResponses.AssignGroupError);
            return false;
        }

        if ($("#ui_chkConditionaloverridesource").is(":checked") && lmsSourceCountArray.length > 0) {
            for (let i = 0; i < lmsSourceCountArray.length; i++) {
                if ($(`#ui_contactfields_${lmsSourceCountArray[i]} :selected`).val() === "0") {
                    ShowErrorMessage("Please select contact properties");
                    return false;
                }

                if ($(`#ui_value_${lmsSourceCountArray[i]}`).val().length == 0) {
                    ShowErrorMessage("Please select values");
                    return false;
                }

                if ($(`#ui_lmssourece_${lmsSourceCountArray[i]} :selected`).val().length === "0") {
                    ShowErrorMessage("Please select sources");
                    return false;
                }
            }
        }
        if ($("#ui_chkUnConditionalsalesperson").is(":checked")) {
            if ($("#frmrepassgnsalper:checked").length > 0) {
                if (parseInt($("#ui_ddlUserList").val()) > 0 && parseInt($("#ui_ddlusergroupList").val()) > 0) {
                    ShowErrorMessage(GlobalErrorList.ApiImportResponses.AssignUserError);
                    return false;
                }
                else if (parseInt($("#ui_ddlUserList").val()) == 0 && parseInt($("#ui_ddlusergroupList").val()) == 0) {
                    ShowErrorMessage(GlobalErrorList.ApiImportResponses.AssignUserError);
                    return false;
                }
            }
        }
        else if ($("#ui_chkConditionalsalesperson").is(":checked") && assignsalesSourceCountArray.length > 0) {
            for (let i = 0; i < assignsalesSourceCountArray.length; i++) {
                if ($(`#ui_assignsalescontactfields_${assignsalesSourceCountArray[i]} :selected`).val() === "0") {
                    ShowErrorMessage("Please select contact properties");
                    return false;
                }

                else if ($(`#ui_assignsalesvalue_${assignsalesSourceCountArray[i]}`).val().length == 0) {
                    ShowErrorMessage("Please select values");
                    return false;
                }
                if ($(`#ui_ddlUserListcon_${assignsalesSourceCountArray[i]} :selected`).val() > 0 && $(`#ui_ddlusergroupListcon_${assignsalesSourceCountArray[i]} :selected`).val() > 0) {
                    $(`#ui_ddlUserListcon_${assignsalesSourceCountArray[i]}`).focus();
                    $(`#ui_ddlusergroupListcon_${assignsalesSourceCountArray[i]}`).focus();
                    ShowErrorMessage(GlobalErrorList.ApiImportResponses.AssignUserError);
                    return false;
                }

                else if ($(`#ui_ddlUserListcon_${assignsalesSourceCountArray[i]} :selected`).val() == "0" && $(`#ui_ddlusergroupListcon_${assignsalesSourceCountArray[i]} :selected`).val() == "0") {
                    ShowErrorMessage(GlobalErrorList.ApiImportResponses.AssignUserError);
                    return false;
                }
            }
        }
        if ($("#frmrepmobnotiwbhk:checked").length > 0 && !$("#webhookeditoption").hasClass("hideDiv")) {
            ShowErrorMessage(GlobalErrorList.ApiImportResponses.WebHookSaveEditError);
            return false;
        }

        if ($("#frmrepmobnotiwbhk:checked").length > 0 && ApiImportResponsesSettingUtil.GetWebhookIds() == "") {
            ShowErrorMessage(GlobalErrorList.ApiImportResponses.WebHookNotPresentError);
            return false;
        }

        if ($("#frmrepwebhookresp:checked").length > 0 && URLParameterFieldCount == 0) {
            ShowErrorMessage(GlobalErrorList.ApiImportResponses.URLParameterError);
            return false;
        }

        if ($("#frmrepwebhookresp:checked").length > 0 && URLParameterFieldCount > 0) {
            for (var i = 0; i < URLParameterFieldCount; i++) {
                if (parseInt(document.getElementById("ui_drpdwn_URLParameterField1_" + i).value) == 0 || document.getElementById("ui_txt_URLParameterField2_" + i).value.length == 0) {
                    ShowErrorMessage(GlobalErrorList.ApiImportResponses.URLParameterError);
                    return false;
                }
            }
        }
        if ($("#ui_chkIncluded:checked").length > 0) {
            for (let i = 0; i < IsIncludedLeadArray.length; i++) {
                if ($(`#ui_Includedcontactfields_${IsIncludedLeadArray[i]} :selected`).val() === "0") {
                    ShowErrorMessage("Please select contact properties");
                    return false;
                }

                else if ($(`#ui_Includedvalue_${IsIncludedLeadArray[i]}`).val().length == 0) {
                    ShowErrorMessage("Please select values");
                    return false;
                }

            }
        }
        if ($("#ui_chkExcluded:checked").length > 0) {
            for (let i = 0; i < IsExcludedLeadArray.length; i++) {
                if ($(`#ui_Excludedcontactfields_${IsExcludedLeadArray[i]} :selected`).val() === "0") {
                    ShowErrorMessage("Please select contact properties");
                    return false;
                }

                else if ($(`#ui_Excludedvalue_${IsExcludedLeadArray[i]}`).val().length == 0) {
                    ShowErrorMessage("Please select values");
                    return false;
                }

            }
        }
        return true;
    },
    ValidateSaveOrUpdateWebhooks: function () {
        if ($("#requestUrlWebhook").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.ApiImportResponses.RequestURLError);
            $("#requestUrlWebhook").focus();
            return false;
        }

        if (!regExpUrl.test($.trim($("#requestUrlWebhook").val()))) {
            ShowErrorMessage(GlobalErrorList.ApiImportResponses.RequestUrl_error);
            $("#requestUrlWebhook").focus();
            return false;
        }

        if (parseInt($("#methodwebhook").val()) == 0) {
            ShowErrorMessage(GlobalErrorList.ApiImportResponses.SelectMethodError);
            return false;
        }

        if (parseInt($("#contentTypewebhook").val()) == 0) {
            ShowErrorMessage(GlobalErrorList.ApiImportResponses.SelectContentTypeError);
            return false;
        }

        if ($("#contentTypewebhook").val().toLowerCase() == 'form' && DataFieldCount == 0) {
            ShowErrorMessage(GlobalErrorList.ApiImportResponses.WebHookDataError);
            return false;
        }

        if ($("#contentTypewebhook").val().toLowerCase() == 'form' && DataFieldCount > 0) {
            for (var i = 0; i < DataFieldCount; i++) {
                if (document.getElementById("ui_div_data_p5field_" + i) != null) {
                    if (parseInt(document.getElementById("ui_drpdwn_DataField1_" + i).value) == 0 || document.getElementById("ui_txt_DataField1_" + i).value.length == 0) {
                        ShowErrorMessage(GlobalErrorList.ApiImportResponses.WebHookDataError);
                        return false;
                    }
                }

                if (document.getElementById("ui_div_data_custfild_" + i) != null) {
                    if (document.getElementById("ui_txt_DataField2_" + i).value.length == 0 || document.getElementById("ui_txt_DataField3_" + i).value.length == 0) {
                        ShowErrorMessage(GlobalErrorList.ApiImportResponses.WebHookDataError);
                        return false;
                    }
                }
            }
        }

        if ($("#contentTypewebhook").val().toLowerCase() == 'raw body' && $("#ui_txtRequestBody").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.ApiImportResponses.SelectContentTypeRawBodyError);
            $("#ui_txtRequestBody").focus();
            return false;
        }

        //if (HeaderFieldCount == 0) {
        //    ShowErrorMessage(GlobalErrorList.ApiImportResponses.WebHookHeaderError);
        //    return false;
        //}

        //if (HeaderFieldCount > 0) {
        //    for (var i = 0; i < HeaderFieldCount; i++) {
        //        if (document.getElementById("ui_txt_HeaderField1_" + i).value.length == 0 || document.getElementById("ui_txt_HeaderField2_" + i).value.length == 0) {
        //            ShowErrorMessage(GlobalErrorList.ApiImportResponses.WebHookHeaderError);
        //            return false;
        //        }
        //    }
        //}

        //if (($("#ui_txt_Authentication1").val().length == 0 || $("#ui_txt_Authentication2").val().length == 0)) {
        //    ShowErrorMessage(GlobalErrorList.ApiImportResponses.BasicAuthenticationError);
        //    return false;
        //}

        return true;
    },
    MaxCount: function () {

        ShowPageLoading();
        $.ajax({
            url: "/ManageContact/ApiImportSettings/MaxCount",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Name': $("#ui_txtSearchBy").val() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

                TotalRowCount = response.returnVal;

                if (TotalRowCount > 0)
                    ApiImportResponsesSettingUtil.GetReport();
                else {
                    SetNoRecordContent('ui_tableReport', 3, 'ui_tbodyReportData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetReport: function () {
        ShowPageLoading();
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/ManageContact/ApiImportSettings/GetDetails",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'OffSet': OffSet, 'FetchNext': FetchNext, 'Name': $("#ui_txtSearchBy").val() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: ApiImportResponsesSettingUtil.BindReport,
            error: ShowAjaxError
        });
    },
    BindReport: function (response) {
        SetNoRecordContent('ui_tblReportData', 3, 'ui_tbodyReportData');
        if (response != undefined && response != null && response.length > 0) {
            ApiImportResponseList = response;

            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

            var reportTableTrs;
            $.each(response, function () {
                var WebHookIds = this.WebHookId === "null" || this.WebHookId == null ? "0" : this.WebHookId;

                var tdContentBasedOnStatus = this.Status != null && this.Status ? `<td id="ui_td_Status_${this.Id}" class="text-color-success">Active</td>` : `<td id="ui_td_Status_${this.Id}" class="text-color-error">In-Active</td>`;

                var hrefContentBasedOnStatus = this.Status != null && this.Status ? `<a id="ui_a_Status_${this.Id}" class="dropdown-item" href="javascript:void(0);" onclick="ApiImportResponsesSettingUtil.ToggleStatus(${this.Id},false);">Change Status</a>` : `<a id="ui_a_Status_${this.Id}" class="dropdown-item" href="javascript:void(0);" onclick="ApiImportResponsesSettingUtil.ToggleStatus(${this.Id},true);">Change Status</a>`;

                var UpdateDate = this.UpdatedDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.UpdatedDate)) + ' ' + PlumbTimeFormat(GetJavaScriptDateObj(this.UpdatedDate)) : "NA";

                reportTableTrs += `<tr>
                                    <td class="text-left h-100">
                                        <div class="groupnamewrap">
                                            <div class="nameTxtWrap">${this.Name}</div>
                                            <div class="tddropmenuapires">
                                                <div class="dropdown">
                                                    <button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true"
                                                            aria-expanded="false">
                                                      <i class="icon ion-android-more-vertical mr-0"></i>
                                                    </button>
                                                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="filterbycontacts">
                                                        <a class="dropdown-item" href="javascript:void(0);" onclick="ApiImportResponsesSettingUtil.EditApiImportResponse(${this.Id},'Edit');">Edit</a>
                                                        <a class="dropdown-item" href="javascript:void(0);" onclick="ApiImportResponsesSettingUtil.EditApiImportResponse(${this.Id},'Duplicate');">Duplicate</a>

                                                        ${hrefContentBasedOnStatus}
                                                        <a class="dropdown-item viewapiresp" href="javascript:void(0);" onclick='apisettingtWebhookResponseUtil.GetMaxCount(${this.Id},"${this.Name}");'>View Response </a>
                                                        <a class="dropdown-item viewapiresp" href="javascript:void(0);" onclick='formChatWebhookResponseUtil.GetMaxCount(0,"${this.Name}","${WebHookIds}");'>Web Hook Response </a>
                                                        <div class="dropdown-divider"></div>
                                                        <a data-toggle="modal" data-target="#delete" data-grouptype="groupDelete"
                                                           class="dropdown-item" href="javascript:void(0);" onclick="ApiImportResponsesSettingUtil.DeleteApi(${this.Id});">Delete</a>
                                                    </div>
                                                </div>
                                            </div>
                                    </td>
                                    ${tdContentBasedOnStatus}
                                    <td>${UpdateDate}</td>
                                </tr>`;
            });
            $("#ui_tblReportData").removeClass('no-data-records');
            $("#ui_tbodyReportData").html(reportTableTrs);
            HidePageLoading();
        }
        else {
            ShowPagingDiv(false);
        }

    },
    ResetSaveOrUpdatePopUpFields: function () {
        ShowPageLoading();
        ApiImportResponseSettingId = 0;
        $("#apirespnametext, #ui_txtArea_ReportByEmail, #ui_txtArea_ReportBySms, #ui_txtArea_ReportByWA, #ui_txt_MailSubject, #ui_txt_MailFromName,#ui_assignsalesvalue_1,#ui_value_1,#ui_sendmailoutresponvalue_1,#ui_txt_conMailSubject_1,#ui_txt_conMailFromName_1,#ui_sendsmsoutresponvalue_1,#ui_sendwhatsappoutresponvalue_1,#ui_AssignStagevalue_1,#ui_Includedvalue_1,#ui_Excludedvalue_1,#ui_AssignGroupvalue_1").val("");
        $(".frmrepresmain, .frmrepmobnotiweb, #ui_chkIsOverrideAssignment,#ui_chkIsUnconditionalGroupSticky").prop('checked', false);
        $("#ui_drpdwn_MailTemplate, #ui_ddlFromEmailSender, #ui_ddlSmsTemplate, #ui_ddlWhatsAppTemplate, #ui_ddlUserList, #ui_ddlGroupList,#ui_ddlIsoverridesourceList, #ui_assignsalescontactfields_1,#ui_ddlUserListcon_1, #ui_ddlusergroupListcon_1,#ui_contactfields_1,#ui_lmssourece_1,#ui_sendmailoutrespcontactfields_1,#ui_drpdwn_conMailTemplate_1,#ui_conddlFromEmailSender_1,#ui_sendsmsoutrespcontactfields_1,#ui_ddl_conSmsTemplate_1,#ui_sendwhatsappoutrespcontactfields_1,#ui_ddl_conwhatsappTemplate_1,#ui_ddlAssignStage,#ui_ddl_conAssignStage_1,#ui_Includedcontactfields_1,#ui_Excludedcontactfields_1,#ddlassignGroup,#ui_ddl_conAssignGroup_1,#ui_AssignStagefields_1,#ui_AssignGroupfields_1").val("0").trigger('change');
        $(".frmresoptwrp").addClass("hideDiv");
        $("#ui_btn_SaveOrUpdateSettings").html('Save Settings');
        $("#ui_btn_SaveOrUpdateSettings").removeAttr('EditId');
        $("#ui_chkUnConditionalsalesperson").prop('checked', true);
        $("#ui_chkUnConditionaloverridesource").prop('checked', true);
        $("#dvConditionalSettingsforsalesperson").hide();
        $("#dvUnConditionalSettingsforsalesperson").show();
        $("#ui_chkUnConditionalmailoutresp").prop('checked', true);
        $("#ui_chkUnConditionalsmsoutresp").prop('checked', true);
        $("#ui_chkUnConditionalwhatsappoutresp").prop('checked', true);
        $("#ui_chkUnConditionalAssignStage").prop('checked', true);
        $("#ui_chkUnConditionalAssignGroup").prop('checked', true);
        $("#dvUnConditionalSettings").show();
        $("#dvConditionalSettings").hide();
        $("#dvConditionalmailoutresp").hide();
        $("#dvUnConditionalmailoutresp").show();
        $("#dvConditionalsmsoutresp").hide();
        $("#dvUnConditionalsmsoutresp").show();
        $("#dvConditionalwhatsappoutresp").hide();
        $("#dvUnConditionalwhatsappoutresp").show();
        $("#ui_chkSendrepeatmail_1").prop('checked', false);
        $("#ui_chkSendrepeatsms_1").prop('checked', false);
        $("#ui_chkSendrepeatwhatsapp_1").prop('checked', false);
        $("#ui_chkUnCon_Sendrepeatmail").prop('checked', false);
        $("#ui_chkUnCon_Sendrepeatsms").prop('checked', false);
        $("#ui_chkUnCon_Sendrepeatwhatsapp").prop('checked', false);
        $("#ui_chkUnCon_Sendrepeatcall").prop('checked', false);
        $("#dvConditionalAssignStage").hide();
        $("#dvUnConditionalAssignStage").show();
        $("#ui_chkUnConditionalAssignGroup").prop('checked', true);
        $("#ui_chkUnConditionalAssignGroup").prop('checked', true);
        $("#dvConditionalAssignGroup").hide();
        $("#dvUnConditionalAssignGroup").show();
        $("#ui_checkboxIsGroupSticky_1").prop('checked', false);

        WebhookList = [];
        ApiImportResponsesSettingUtil.ResetAddWebHookFields();
        ApiImportResponsesSettingUtil.ResetSaveOrUpdatePopUpAddURLParameterResponseFields();
    },
    ResetAddWebHookFields: function () {
        ShowPageLoading();
        $("#webhookeditoption, #rawbodytxtinpt, #formtxtinput").addClass("hideDiv");
        $("#requestUrlWebhook, #ui_txt_Authentication1, #ui_txt_Authentication2, #ui_txtRequestBody").val("");
        $("#methodwebhook, #contentTypewebhook").val("0").trigger('change');
        $(".adddatafildwrp").html("");
        for (var i = 0; i < HeaderFieldCount; i++)
            $(".addheaderfild").prev('div').remove();
        DataFieldCount = 0, HeaderFieldCount = 0;
        $("#savewebhook").html("Save");
        HidePageLoading();
    },
    ResetSaveOrUpdatePopUpAddURLParameterResponseFields: function () {
        ShowPageLoading();
        for (var i = 0; i < URLParameterFieldCount; i++)
            $(".addwebhooksreps").prev('div').remove();
        URLParameterFieldCount = 0;
    },
    //ResetQuickFilterBy: function () {
    //    QuickFilterBy = "";
    //    $("#ui_txtSearchBy").val("");
    //    //$("#filtapiresp").val("0").trigger('change');
    //},
    SaveOrUpdateSettings: function () {
        ShowPageLoading();

        var MailSendingSettingId = 0, SMSSendingSettingId = 0, WASendingSettingId = 0, IsVerifiedEmail = false, IsAutoWhatsApp = false, IsAutoClickCall = false,
            IsMailconditional = false, IsSmsconditional = false, Iswhatsappconditional = false, ismailrepeatconditional = false, issmsrepeatconditional = false, iswhatsapprepeatconditional = false, iscallrepeatconditional = false;

        if ($("#ui_chkSendMailOut").is(":checked")) {

            if ($("#ui_chkUnConditionalmailoutresp").is(":checked")) {
                mailSettingList = new Array();
                MailOutResponderList = new Array();
                var mailSettings = { Id: 0, UserInfoUserId: Plumb5UserId, Name: "", MailTemplateId: parseInt($("#ui_drpdwn_MailTemplate").val()), GroupId: 0, Subject: AppendCustomField(CleanText($("#ui_txt_MailSubject").val())), FromName: CleanText($("#ui_txt_MailFromName").val()), FromEmailId: $("#ui_ddlFromEmailSender").val(), Subscribe: false, Forward: false, IsSchedule: false, ReplyTo: $("#ui_ddlFromEmailSender").val(), ScheduledStatus: 0, ScheduledDate: null };
                mailSettingList.push(mailSettings);
                var MailOutResponderLists = { Dependencyfield: "", Value: "", SendingSettingId: "0" };
                MailOutResponderList.push(MailOutResponderLists);
                ismailrepeatconditional = $("#ui_chkUnCon_Sendrepeatmail").is(":checked");

            }

            else {
                IsMailconditional = $("#ui_chkUnConditionalmailoutresp").is(":checked") ? false : $("#ui_chkConditionalmailoutresp").is(":checked") ? true : null;
                mailSettingList = new Array();
                MailOutResponderList = new Array();
                var mailSettings = {};
                for (let m = 0; m < sendmailoutresponerArray.length; m++) {
                    mailSettings = { Id: 0, UserInfoUserId: Plumb5UserId, Name: "", MailTemplateId: parseInt($(`#ui_drpdwn_conMailTemplate_${sendmailoutresponerArray[m]}`).val()), GroupId: 0, Subject: AppendCustomField(CleanText($(`#ui_txt_conMailSubject_${sendmailoutresponerArray[m]}`).val())), FromName: CleanText($(`#ui_txt_conMailFromName_${sendmailoutresponerArray[m]}`).val()), FromEmailId: $(`#ui_conddlFromEmailSender_${sendmailoutresponerArray[m]}`).val(), Subscribe: false, Forward: false, IsSchedule: false, ReplyTo: $(`#ui_conddlFromEmailSender_${sendmailoutresponerArray[m]}`).val(), ScheduledStatus: 0, ScheduledDate: null };
                    if (editeddataMailsendingsettingList[m] != null)
                        mailSettings = { Id: editeddataMailsendingsettingList[m].SendingSettingId, UserInfoUserId: Plumb5UserId, Name: $(`apirespnametext`).val(), MailTemplateId: $(`#ui_drpdwn_conMailTemplate_${sendmailoutresponerArray[m]}`).val(), GroupId: 0, Subject: AppendCustomField(CleanText($(`#ui_txt_conMailSubject_${sendmailoutresponerArray[m]}`).val())), FromName: CleanText($(`#ui_txt_conMailFromName_${sendmailoutresponerArray[m]}`).val()), FromEmailId: $(`#ui_conddlFromEmailSender_${sendmailoutresponerArray[m]}`).val(), Subscribe: false, Forward: false, IsSchedule: false, ReplyTo: $(`#ui_conddlFromEmailSender_${sendmailoutresponerArray[m]}`).val(), ScheduledStatus: 0, ScheduledDate: null };

                    var MailOutResponderLists = { Dependencyfield: $(`#ui_sendmailoutrespcontactfields_${sendmailoutresponerArray[m]}`).val(), Value: $(`#ui_sendmailoutresponvalue_${sendmailoutresponerArray[m]}`).val(), SendingSettingId: "0", IsRepeatCommunication: $(`#ui_chkSendrepeatmail_${sendmailoutresponerArray[m]}`).is(":checked") };

                    mailSettingList.push(mailSettings);
                    MailOutResponderList.push(MailOutResponderLists);
                }
                /* ApiImportResponsesSettingUtil.SaveMailSendingSetting(mailSettingList, MailOutResponderList);*/
            }
        }

        if ($("#ui_chkSendSmsOut").is(":checked")) {
            if ($("#ui_chkUnConditionalsmsoutresp").is(":checked")) {
                smsSettingList = new Array();
                SmsOutResponderList = new Array();
                var smsSettings = { Id: 0, UserInfoUserId: Plumb5UserId, Name: $("#apirespnametext").val(), SmsTemplateId: parseInt($("#ui_ddlSmsTemplate").val()), UserGroupId: 0, GroupId: 0 };
                smsSettingList.push(smsSettings);
                var SMSOutResponderLists = { Dependencyfield: "", Value: "", SendingSettingId: "0" };
                SmsOutResponderList.push(SMSOutResponderLists);
                issmsrepeatconditional = $("#ui_chkUnCon_Sendrepeatsms").is(":checked");
                //SMSSendingSettingId = ApiImportResponsesSettingUtil.SaveSMSSendingSetting(smsSettings);
            }
            else {
                IsSmsconditional = $("#ui_chkUnConditionalsmsoutresp").is(":checked") ? false : $("#ui_chkConditionalsmsoutresp").is(":checked") ? true : null;
                smsSettingList = new Array();
                SmsOutResponderList = new Array();
                var smsSettings = {};
                for (let m = 0; m < sendsmsoutresponerArray.length; m++) {
                    smsSettings = { Id: 0, UserInfoUserId: Plumb5UserId, Name: $(`#apirespnametext`).val(), SmsTemplateId: parseInt($(`#ui_ddl_conSmsTemplate_${sendsmsoutresponerArray[m]}`).val()), UserGroupId: 0, GroupId: 0 };
                    if (editeddataSmssendingsettingList[m] != null)
                        smsSettings = { Id: editeddataSmssendingsettingList[m].SendingSettingId, UserInfoUserId: Plumb5UserId, Name: $(`#apirespnametext`).val(), SmsTemplateId: $(`#ui_ddl_conSmsTemplate_${sendsmsoutresponerArray[m]}`).val(), UserGroupId: 0, GroupId: 0 };

                    var SMSOutResponderLists = {
                        Dependencyfield: $(`#ui_sendsmsoutrespcontactfields_${sendsmsoutresponerArray[m]}`).val(), Value: $(`#ui_sendsmsoutresponvalue_${sendsmsoutresponerArray[m]}`).val(), SendingSettingId: "0", IsRepeatCommunication: $(`#ui_chkSendrepeatsms_${sendsmsoutresponerArray[m]}`).is(":checked")
                    };

                    smsSettingList.push(smsSettings);
                    SmsOutResponderList.push(SMSOutResponderLists);
                }
            }

        }
        if ($("#ui_chkSendWhatsAppOut").is(":checked")) {
            if ($("#ui_chkUnConditionalwhatsappoutresp").is(":checked")) {
                whatsappSettingList = new Array();
                whatsappOutResponderList = new Array();
                var WhatsAppSettings = { Id: 0, UserInfoUserId: Plumb5UserId, Name: "", WhatsAppTemplateId: parseInt($("#ui_ddlWhatsAppTemplate").val()), UserGroupId: 0, GroupId: 0 };
                whatsappSettingList.push(WhatsAppSettings);
                var WhatsappOutResponderLists = { Dependencyfield: "", Value: "", SendingSettingId: "0" };
                WhatsappOutResponderList.push(WhatsappOutResponderLists);
                iswhatsapprepeatconditional = $("#ui_chkUnCon_Sendrepeatwhatsapp").is(":checked");
            }
            else {
                Iswhatsappconditional = $("#ui_chkUnConditionalwhatsappoutresp").is(":checked") ? false : $("#ui_chkConditionalwhatsappoutresp").is(":checked") ? true : null;
                whatsappSettingList = new Array();
                WhatsappOutResponderLists = new Array();
                var whatsappSettings = {};
                for (let m = 0; m < sendwhatsappoutresponerArray.length; m++) {
                    whatsappSettings = { Id: 0, UserInfoUserId: Plumb5UserId, Name: "", WhatsAppTemplateId: parseInt($(`#ui_ddl_conwhatsappTemplate_${sendwhatsappoutresponerArray[m]}`).val()), UserGroupId: 0, GroupId: 0 };
                    if (editeddatawhatsappsendingsettingList[m] != null)
                        whatsappSettings = { Id: editeddatawhatsappsendingsettingList[m].SendingSettingId, UserInfoUserId: Plumb5UserId, Name: $(`#apirespnametext`).val(), WhatsAppTemplateId: $(`#ui_ddl_conwhatsappTemplate_${sendwhatsappoutresponerArray[m]}`).val(), UserGroupId: 0, GroupId: 0 };

                    var WhatsappOutResponderLists = { Dependencyfield: $(`#ui_sendwhatsappoutrespcontactfields_${sendwhatsappoutresponerArray[m]} `).val(), Value: $(`#ui_sendwhatsappoutresponvalue_${sendwhatsappoutresponerArray[m]}`).val(), SendingSettingId: "0", IsRepeatCommunication: $(`#ui_chkSendrepeatwhatsapp_${sendwhatsappoutresponerArray[m]}`).is(":checked") };

                    whatsappSettingList.push(whatsappSettings);
                    WhatsappOutResponderList.push(WhatsappOutResponderLists);
                }
            }

        }
        if ($("#ui_chkIncluded").is(":checked")) {

            IsincludedleadsList = new Array();
            for (let m = 0; m < IsIncludedLeadArray.length; m++) {

                var isincludedleadsLists = {
                    Key: $(`#ui_Includedcontactfields_${IsIncludedLeadArray[m]}`).val(), Value: $(`#ui_Includedvalue_${IsIncludedLeadArray[m]}`).val()
                };
                IsincludedleadsList.push(isincludedleadsLists);
            }


        }
        if ($("#ui_chkExcluded").is(":checked")) {

            IsexcludedleadsList = new Array();
            for (let m = 0; m < IsExcludedLeadArray.length; m++) {

                var isexcludedleadsLists = {
                    Key: $(`#ui_Excludedcontactfields_${IsExcludedLeadArray[m]}`).val(), Value: $(`#ui_Excludedvalue_${IsExcludedLeadArray[m]}`).val()
                };
                IsexcludedleadsList.push(isexcludedleadsLists);
            }


        }
        var getAssignStageId = -1;
        if ($("#ui_chkAssignStage").is(":checked")) {
            if ($("#ui_chkUnConditionalAssignStage").is(":checked")) {
                getAssignStageId = $("#ui_ddlAssignStage").val();

            }
            else {
                var getAssignStageJson = new Array();
                for (let m = 0; m < assignstageArray.length; m++) {
                    getAssignStageJson = { Dependencyfield: $(`#ui_AssignStagefields_${assignstageArray[m]} `).val(), Value: $(`#ui_AssignStagevalue_${assignstageArray[m]}`).val(), AssignStage: $(`#ui_ddl_conAssignStage_${assignstageArray[m]}`).val() };
                    AssignStageLists.push(getAssignStageJson);
                }
            }

        }
        var getAssignGroupId = 0;
        if ($("#ui_chkAssignGroup").is(":checked")) {
            if ($("#ui_chkUnConditionalAssignGroup").is(":checked")) {
                getAssignGroupId = $("#ui_ddlGroupList").val();

            }
            else {
                var getAssignGroupJson = new Array();
                for (let m = 0; m < assignGroupArray.length; m++) {
                    getAssignGroupJson = { Dependencyfield: $(`#ui_AssignGroupfields_${assignGroupArray[m]} `).val(), Value: $(`#ui_AssignGroupvalue_${assignGroupArray[m]}`).val(), AssignGroup: $(`#ui_ddl_conAssignGroup_${assignGroupArray[m]}`).val() };
                    AssignGroupLists.push(getAssignGroupJson);
                }
            }

        }
        if ($("#chkboxVerifiedEmail").is(":checked")) {
            IsVerifiedEmail = true;
        }

        if ($("#chkboxAutoWhatsApp").is(":checked")) {
            IsAutoWhatsApp = true;
        }

        if ($("#chkboxClickToCall").is(":checked")) {
            IsAutoClickCall = true;
            iscallrepeatconditional = $("#ui_chkUnCon_Sendrepeatcall").is(":checked");
        }

        var conditionaljson = [];
        var userassigmentjson = [];

        if ($("#ui_chkConditionaloverridesource").is(":checked")) {
            for (let i = 0; i < lmsSourceCountArray.length; i++) {
                let lmsData = {
                    contactfieldproperty: $(`#ui_contactfields_${lmsSourceCountArray[i]} :selected`).val(),
                    contactfieldvalue: $(`#ui_value_${lmsSourceCountArray[i]}`).val(),
                    lmssource: $(`#ui_lmssourece_${lmsSourceCountArray[i]} :selected`).val()
                };

                conditionaljson.push(lmsData);
            }
        }
        if ($("#ui_chkConditionalsalesperson").is(":checked")) {
            for (let i = 0; i < assignsalesSourceCountArray.length; i++) {
                let _contactfieldproperty = $(`#ui_assignsalescontactfields_${assignsalesSourceCountArray[i]} :selected`).val();
                let _contactfieldvalue = $(`#ui_assignsalesvalue_${assignsalesSourceCountArray[i]}`).val();
                let _userassignment = $(`#ui_ddlUserListcon_${assignsalesSourceCountArray[i]} :selected`).val() > 0 ? $(`#ui_ddlUserListcon_${assignsalesSourceCountArray[i]} :selected`).val() : $(`#ui_ddlusergroupListcon_${assignsalesSourceCountArray[i]} :selected`).val();
                let _individual = $(`#ui_ddlUserListcon_${assignsalesSourceCountArray[i]} :selected`).val() > 0 ? 0 : 1;
                let _isGroupSticky = $(`#ui_checkboxIsGroupSticky_${assignsalesSourceCountArray[i]}:checked`).length > 0 && $(`#ui_checkboxIsGroupSticky_${assignsalesSourceCountArray[i]}:checked`).length > 0 ? true : false;
                let assignsalespersonconData = {
                    contactfieldproperty: _contactfieldproperty,
                    contactfieldvalue: _contactfieldvalue,
                    userassignment: _userassignment,
                    individual: _individual,
                    isgroupsticky: _isGroupSticky
                };

                userassigmentjson.push(assignsalespersonconData);
            }
        }
        var SourceType = 0;
        if ($("#lmsStaySource").is(":checked")) {
            SourceType = 0;
        }
        else if ($("#lmsOverrideSource").is(":checked")) {
            SourceType = 1;
        }
        else if ($("#lmsNewSource").is(":checked")) {
            SourceType = 2;
        }

        var apiImportResponseSetting = {
            Id: ApiImportResponseSettingId,
            Name: $("#apirespnametext").val(),
            Status: true,
            ReportToDetailsByMail: $("#frmrepemail:checked").length > 0 && $("#ui_txtArea_ReportByEmail").val().length > 0 ? $("#ui_txtArea_ReportByEmail").val() : "",
            ReportToDetailsBySMS: $("#frmrepsms:checked").length > 0 && $("#ui_txtArea_ReportBySms").val().length > 0 ? $("#ui_txtArea_ReportBySms").val() : "",
            ReportToDetailsByWhatsApp: $("#frmrepwa:checked").length > 0 && $("#ui_txtArea_ReportByWA").val().length > 0 ? $("#ui_txtArea_ReportByWA").val() : "",
            MailSendingSettingId: 0,
            SmsSendingSettingId: SMSSendingSettingId,
            WhatsAppSendingSettingId: WASendingSettingId,
            AssignLeadToUserInfoUserId: $("#frmrepassgnsalper:checked").length > 0 && parseInt($("#ui_ddlUserList").val()) > 0 ? parseInt($("#ui_ddlUserList").val()) : 0,
            IsOverrideAssignment: $("#frmrepassgnsalper:checked").length > 0 && $("#ui_chkIsOverrideAssignment:checked").length > 0 ? 1 : 0,
            IsUnConditionalGroupSticky: $("#ui_chkIsUnconditionalGroupSticky:checked").length > 0 && $("#ui_chkIsUnconditionalGroupSticky:checked").length > 0 ? true : false,
            AssignToGroupId: getAssignGroupId,
            IsOverRideSource: $("#frmrepoverridesource:checked").length > 0 && parseInt($("#ui_ddlIsoverridesourceList").val()) > 0 ? parseInt($("#ui_ddlIsoverridesourceList").val()) : 0,
            WebHookId: ApiImportResponsesSettingUtil.GetWebhookIds(),
            URLParameterResponses: ApiImportResponsesSettingUtil.GetURLParametersResponseValues(),

            IsVerifiedEmail: IsVerifiedEmail,
            IsAutoWhatsApp: IsAutoWhatsApp,
            IsAutoClickToCall: IsAutoClickCall,
            AssignUserGroupId: $("#frmrepassgnsalper:checked").length > 0 && parseInt($("#ui_ddlusergroupList").val()) > 0 ? parseInt($("#ui_ddlusergroupList").val()) : 0,
            IsConditional: $("#ui_chkConditionaloverridesource").is(":checked") ? true : $("#ui_chkUnConditionaloverridesource").is(":checked") ? false : null,
            IsUserAssignmentConditional: $("#ui_chkConditionalsalesperson").is(":checked") ? true : $("#ui_chkUnConditionalsalesperson").is(":checked") ? false : null,
            ConditionalJson: JSON.stringify(conditionaljson) == '[]' ? '' : JSON.stringify(conditionaljson),
            UserAssigmentJson: JSON.stringify(userassigmentjson) == '[]' ? '' : JSON.stringify(userassigmentjson),
            SourceType: SourceType,
            MailSendingConditonalJson: "",
            SmsSendingConditonalJson: "",
            WhatsAppSendingConditonalJson: "",
            IsMailRepeatCon: ismailrepeatconditional,
            IsSmsRepeatCon: issmsrepeatconditional,
            IsWhatsappRepeatCon: iswhatsapprepeatconditional,
            IsCallRepeatCon: iscallrepeatconditional,
            AssignStage: getAssignStageId,
            AssignStageConditonalJson: JSON.stringify(AssignStageLists) == '[]' ? '' : JSON.stringify(AssignStageLists),
            IsIncludedLeads: $("#ui_chkIncluded").is(":checked"),
            IncludedLeadsJson: JSON.stringify(IsincludedleadsList) == '[]' ? '' : JSON.stringify(IsincludedleadsList),
            IsExcludedLeads: $("#ui_chkExcluded").is(":checked"),
            ExcludedLeadsJson: JSON.stringify(IsexcludedleadsList) == '[]' ? '' : JSON.stringify(IsexcludedleadsList),
            AssignToGroupConditonalJson: JSON.stringify(AssignGroupLists) == '[]' ? '' : JSON.stringify(AssignGroupLists),
            LastAssignUserInfoUserId: 0
        };



        $.ajax({
            url: "/ManageContact/ApiImportSettings/SaveOrUpdateDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'apiImportResponseSetting': apiImportResponseSetting, 'mailSendingSetting': mailSettingList, 'MailOutResponderList': MailOutResponderList, "IsMailConditional": IsMailconditional, 'smsSendingSetting': smsSettingList, 'SmsOutResponderList': SmsOutResponderList, "IsSmsconditional": IsSmsconditional, 'whatsappSendingSetting': whatsappSettingList, 'WhatsappOutResponderList': WhatsappOutResponderList, "Iswhatsappconditional": Iswhatsappconditional }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    $(".setfrmrulewrp").addClass("hideDiv");
                    if (apiImportResponseSetting.Id > 0)
                        ShowSuccessMessage(GlobalErrorList.ApiImportResponses.UpdateSuccess);
                    else
                        ShowSuccessMessage(GlobalErrorList.ApiImportResponses.SaveSuccess);

                    //CallBackFunction();

                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.ApiImportResponses.ApiNameExists);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    ToggleStatus: function (Id, Status) {
        ShowPageLoading();
        $.ajax({
            url: "/ManageContact/ApiImportSettings/ToggleStatus",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': Id, 'Status': Status }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.ApiImportResponses.ToggleSuccess);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.ApiImportResponses.ToggleError);
                }

                if (Status) {
                    $("#ui_td_Status_" + Id).removeClass('text-color-error');
                    $("#ui_td_Status_" + Id).addClass('text-color-success');
                    $("#ui_td_Status_" + Id).html("Active");
                    $("#ui_a_Status_" + Id).attr("onclick", `ApiImportResponsesSettingUtil.ToggleStatus(${Id},false);`);
                } else {
                    $("#ui_td_Status_" + Id).removeClass('text-color-success');
                    $("#ui_td_Status_" + Id).addClass('text-color-error');
                    $("#ui_td_Status_" + Id).html("In-Active");
                    $("#ui_a_Status_" + Id).attr("onclick", `ApiImportResponsesSettingUtil.ToggleStatus(${Id},true);`);
                }

                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    DeleteApi: function (Id) {
        $("#deleteRowConfirm").attr("DeleteId", Id);
    },
    DeleteApiImportResponse: function (Id) {
        ShowPageLoading();
        $.ajax({
            url: "/ManageContact/ApiImportSettings/Delete",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.ApiImportResponses.DeleteSettingsSuccess);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.ApiImportResponses.DeleteSettingsError);
                }

                $("#deleteRowConfirm").removeAttr("DeleteId");

                CallBackFunction();
            },
            error: ShowAjaxError
        });
    },
    SaveMailSendingSetting: function (mailSendingSetting, mailOutresponderlists) {
        Mailsendingsettingjson = "";
        $.ajax({
            url: "/ManageContact/ApiImportSettings/SaveMailSendingSetting",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'mailSendingSetting': mailSendingSetting, 'MailOutResponderList': mailOutresponderlists }),
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    Mailsendingsettingjson = response;
                }
            },
            error: ShowAjaxError
        });

    },
    SaveSMSSendingSetting: function (smsSendingSetting) {
        var Id = 0;
        $.ajax({
            url: "/ManageContact/ApiImportSettings/SaveSMSSendingSetting",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'smsSendingSetting': smsSendingSetting }),
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response > 0) {
                    Id = response;
                }
            },
            error: ShowAjaxError
        });

        return Id;
    },
    SaveWASendingSetting: function (waSendingSetting) {
        var Id = 0;
        $.ajax({
            url: "/ManageContact/ApiImportSettings/SaveWASendingSetting",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'waSendingSetting': waSendingSetting }),
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response > 0) {
                    Id = response;
                }
            },
            error: ShowAjaxError
        });

        return Id;
    },
    GetURLParametersResponseValues: function () {
        if ($("#frmrepwebhookresp").is(":checked")) {
            //Data values
            var URLParametersResponsedata = new Array();

            var URLParametersResponsefieldtrList = $('[id^=ui_div_URLParameter_]');

            for (var i = 0; i < URLParametersResponsefieldtrList.length; i++) {
                var URLParametersResponseValue = { Key: "", Value: "" };

                var rowId = URLParametersResponsefieldtrList[i].id.substring(20);
                if ($("#ui_drpdwn_URLParameterField1_" + rowId + " option:selected").val() != undefined) {
                    URLParametersResponseValue.Key = $("#ui_drpdwn_URLParameterField1_" + rowId + " option:selected").val();
                    URLParametersResponseValue.Value = CleanText($("#ui_txt_URLParameterField2_" + rowId).val());
                    URLParametersResponsedata.push(URLParametersResponseValue);
                }
            }
            return JSON.stringify(URLParametersResponsedata);
        }
        else {
            return "";
        }
    },
    SaveOrUpdateWebhookDetails: function (webHookDetails) {
        $.ajax({
            url: "/ManageContact/ApiImportSettings/SaveOrUpdateWebhook",
            dataType: "json",
            type: "POST",
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'webHookDetails': webHookDetails }),
            contentType: "application/json; charset=utf-8",
            dataFilter: function (data) { return data; },
            success: function (response) {
                ApiImportResponsesSettingUtil.ResetAddWebHookFields();
                $("#webhookeditoption").addClass("hideDiv");

                if (response.Result) {
                    if (response.IsSavedOrUpdated == 0)
                        ShowSuccessMessage(GlobalErrorList.ApiImportResponses.UpdateWebhookSuccess);
                    else if (response.IsSavedOrUpdated == -2)
                        ShowErrorMessage(GlobalErrorList.ApiImportResponses.UpdateWebhookError);
                    else if (response.IsSavedOrUpdated > 0)
                        ShowSuccessMessage(GlobalErrorList.ApiImportResponses.SaveWebhookSuccess);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.ApiImportResponses.SaveOrUpdateError);
                }

                if (response.WebhookDetails.WebHookId > 0) {
                    if (response.IsSavedOrUpdated > 0)
                        WebhookList.push(response.WebhookDetails);
                    if (response.IsSavedOrUpdated == 0) {
                        $("#savewebhook").removeAttr('EditId');
                        ApiImportResponsesSettingUtil.RemoveWebhook(response.WebhookDetails.WebHookId);
                        WebhookList.push(response.WebhookDetails);
                    }
                    ApiImportResponsesSettingUtil.BindWebhookDetails();
                }

                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    BindWebhookDetails: function () {
        ShowPageLoading();
        $("#ui_tbody_WebHookReportData").empty();
        if (WebhookList.length > 0) {
            for (var i = 0; i < WebhookList.length; i++) {
                let reportTablerows = `<tr>
                                        <td>
                                            <div class="landurlcont">
                                                <div class="landurlwrp">
                                                    <div class="landurl">
                                                       ${WebhookList[i].RequestURL}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="text-center">${WebhookList[i].MethodType}</td>
                                        <td class="text-center">${WebhookList[i].ContentType}</td>
                                        <td>
                                            <div class="editwebhookwrp" onclick="ApiImportResponsesSettingUtil.SetEditWebhook(${WebhookList[i].WebHookId});">
                                                <i class="icon ion-edit editwebhook"></i>
                                            </div>
                                        </td>
                                        <td><div class="delwebhookwrp" data-toggle="modal" data-target="#deletewebhook" onclick="ApiImportResponsesSettingUtil.SetDeleteWebhook(${WebhookList[i].WebHookId});"><i class="icon ion-trash-b delwebhook"></i></div></td>
                                    </tr>`;
                $("#ui_tbody_WebHookReportData").append(reportTablerows);
            };
            HidePageLoading();

        }
        else {
            SetNoRecordContent('ui_tbl_WebHookReportData', 5, 'ui_tbody_WebHookReportData');
        }

    },
    BindLmsSource: function () {
        $.ajax({
            url: "/ManageContact/ApiImportSettings/GetLMSGroupList",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            dataType: "json",
            success: function (response) {

                if (response != undefined && response != null) {
                    lmsSoures = response;
                    $.each(response, function (i) {
                        $("#ui_ddlIsoverridesourceList").append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>")
                    });

                    ApiImportResponsesSettingUtil.BindEachLmsSources(1);
                }
                ApiImportResponsesSettingUtil.GetLeadProperties();
                ApiImportResponsesSettingUtil.InitializeWebHookDetails();
            },
            error: ShowAjaxError
        });
    },
    SetDeleteWebhook: function (deleteId) {
        $("#deletewebhookRowConfirm").attr("deleteId", parseInt(deleteId));
    },
    GetWebhookIds: function () {
        let webhookIds = "";
        if (WebhookList.length > 0) {
            let idList = [];
            for (var i = 0; i < WebhookList.length; i++) {
                idList.push(WebhookList[i].WebHookId);
            }
            webhookIds = idList.join(",");
        }

        return webhookIds;
    },
    RemoveWebhook: function (deleteId) {
        let oldList = WebhookList;
        if (oldList.length > 0) {
            WebhookList = [];
            for (var i = 0; i < oldList.length; i++) {
                if (oldList[i].WebHookId != deleteId)
                    WebhookList.push(oldList[i]);
            }
        }
        HidePageLoading();
    },
    //DecideQuickFilterBy: function () {
    //    let OldQuickFilterBy = QuickFilterBy;
    //    let value = $("#filtapiresp").val();
    //    let Condition = "";

    //    if (value != null && value == "Response Name")
    //        Condition += " Name LIKE '%" + CleanText($("#ui_txtSearchBy").val()) + "%'";

    //    if (value != null && value == "Active")
    //        Condition += " Status = 1";

    //    if (value != null && value == "In-Active")
    //        Condition += " Status = 0";

    //    QuickFilterBy = Condition;

    //    ApiImportResponsesSettingUtil.MaxCount();
    //},
    SetEditWebhook: function (Id) {
        ShowPageLoading();
        checkdataerror = 1;
        ApiImportResponsesSettingUtil.ResetAddWebHookFields();

        let selectedwebhook;
        for (var i = 0; i < WebhookList.length; i++) {
            if (WebhookList[i].WebHookId == Id)
                selectedwebhook = WebhookList[i];
        }

        var webHookDetails =
        {
            WebHookId: Id,
            RequestURL: selectedwebhook.RequestURL,
            MethodType: selectedwebhook.MethodType,
            ContentType: selectedwebhook.ContentType,
            FieldMappingDetails: selectedwebhook.FieldMappingDetails,
            Headers: selectedwebhook.Headers,
            BasicAuthentication: selectedwebhook.BasicAuthentication,
            RawBody: selectedwebhook.RawBody
        };

        $("#requestUrlWebhook").val(webHookDetails.RequestURL);
        $("#methodwebhook").val(webHookDetails.MethodType).trigger('change');
        $("#contentTypewebhook").val(webHookDetails.ContentType.toLowerCase()).trigger('change');

        let ContentType = $("#contentTypewebhook option:selected").text().toLowerCase();
        if (ContentType == 'form') {
            if (webHookDetails.FieldMappingDetails != null && webHookDetails.FieldMappingDetails != "") {
                var FieldMappingConditionDetail = webHookDetails.FieldMappingDetails;

                $.each(JSON.parse(FieldMappingConditionDetail), function (i, obj) {

                    //if (i == 0) {
                    //    trelementcount = 0;
                    //}
                    if (obj.IsPlumb5OrCustomField == "Plumb5Field") {

                        $(".dropdown-item.drpdowndatafield").click();
                        $("#ui_txt_DataField1_" + i).val(obj.Key);
                        $("#ui_drpdwn_DataField1_" + i).select2().val(obj.Value).change();

                    }
                    else if (obj.IsPlumb5OrCustomField == "StaticField") {
                        $(".adddatacustfild").click();
                        $("#ui_txt_DataField2_" + i).val(obj.Key);
                        $("#ui_txt_DataField3_" + i).val(obj.Value);
                    }
                });
            }
        }
        else if (ContentType == 'raw body') {
            $("#ui_txtRequestBody").val(webHookDetails.RawBody);
        }

        if (webHookDetails.Headers != null && webHookDetails.Headers != "" && webHookDetails.Headers != "[]") {
            var HeaderConditionDetail = webHookDetails.Headers;
            $.each(JSON.parse(HeaderConditionDetail), function (i, obj) {
                $(".addheaderfild").click();
                $("#ui_txt_HeaderField1_" + i).val(obj.Key);
                $("#ui_txt_HeaderField2_" + i).val(obj.Value);
            });
        }

        if (webHookDetails.BasicAuthentication != null && webHookDetails.BasicAuthentication != "") {
            var basicauthdetails = JSON.parse(webHookDetails.BasicAuthentication);
            $("#ui_txt_Authentication1").val(basicauthdetails.AuthenticationKey);
            $("#ui_txt_Authentication2").val(basicauthdetails.AuthenticationValue);
        }

        $("#savewebhook").html("Update");
        $("#savewebhook").attr("EditId", webHookDetails.WebHookId);
        $("#webhookeditoption").removeClass("hideDiv");
        //$("#webhookeditoption").addClass("hideDiv");
        HidePageLoading();
        checkdataerror = 0;
    },

    //    SetEditWebhook:function(id) {
    //        $("#webhookeditoption").removeClass("hideDiv");
    //webhookrowid = id
    //$("#btnsavewebhook").html("Update");
    //$("#btnsavewebhook").val("update");
    //$(".adddatafildwrp").empty();
    //$(".addheaderfildwrp").empty();

    //if (Webhookloopdetals != null) {
    //    $("#ui_chkWebHooks").prop("checked", true)
    //    $("#ui_trWebHooks").removeClass("hideDiv");
    //    if (Webhookloopdetals[id].RequestURL != null && Webhookloopdetals[id].RequestURL != "")
    //        $("#ui_txtRequestUrl").val(Webhookloopdetals[id].RequestURL);

    //    if (Webhookloopdetals[id].MethodType != null && Webhookloopdetals[id].MethodType != "")
    //        $("#ui_ddl_MethodType").val(Webhookloopdetals[id].MethodType);

    //    if (Webhookloopdetals[id].ContentType != null && Webhookloopdetals[id].ContentType != "")
    //        $("#ui_ddl_ContentType").val(Webhookloopdetals[id].ContentType.toLowerCase()).change();

    //    let ContentType = $("#ui_ddl_ContentType option:selected").text().toLowerCase();
    //    if (ContentType == 'form') {
    //        if (Webhookloopdetals[id].FieldMappingDetails != null && Webhookloopdetals[id].FieldMappingDetails != "") {
    //            var FieldMappingConditionDetail = Webhookloopdetals[id].FieldMappingDetails;

    //            $.each(JSON.parse(FieldMappingConditionDetail), function (i, obj) {

    //                if (i == 0) {
    //                    trelementcount = 0;
    //                }
    //                if (obj.IsPlumb5OrCustomField == "Plumb5Field") {
    //                    $(".dropdown-item.adddatafild").click();
    //                    $("#txtFieldAnswer_" + i).val(obj.Key);
    //                    $("#drpFields_" + i).select2().val(obj.Value).change();
    //                }
    //                else if (obj.IsPlumb5OrCustomField == "StaticField") {
    //                    $(".adddatacustfild").click();
    //                    $("#txtFieldKey_" + i).val(obj.Key);
    //                    $("#txtFieldAnswer_" + i).val(obj.Value);
    //                }
    //            });
    //        }
    //    }
    //    else if (ContentType == 'raw body') {
    //        $("#ui_txtRequestBody").val(Webhookloopdetals[id].RawBody);
    //    }

    //    if (Webhookloopdetals[id].Headers != null && Webhookloopdetals[id].Headers != "" && Webhookloopdetals[id].Headers != "[]") {
    //        var HeaderConditionDetail = Webhookloopdetals[id].Headers;
    //        $.each(JSON.parse(HeaderConditionDetail), function (i, obj) {

    //            if (i == 0) {
    //                trheaderelementcount = 0;
    //            }

    //            $(".addheaderfild").click();
    //            $("#txtheaderKey_" + i).val(obj.Key);
    //            $("#txtheaderValue_" + i).val(obj.Value);
    //        });
    //    }

    //    if (Webhookloopdetals[id].BasicAuthentication != null && Webhookloopdetals[id].BasicAuthentication != "") {
    //        var basicauthdetails = JSON.parse(Webhookloopdetals[id].BasicAuthentication);
    //        $("#ui_txt_BasicAuthenticationKey").val(basicauthdetails.AuthenticationKey);
    //        $("#ui_txt_BasicAuthenticationValue").val(basicauthdetails.AuthenticationValue);
    //    }
    //}
    //},
    EditApiImportResponse: function (Id, EditDuplicate) {
        ShowPageLoading();
        setTimeout(function () {
            bindeditdetails();
        }, 1000);
        function bindeditdetails() {
            ApiImportResponseSettingId = 0;
            editeddataMailsendingsettingList = [];
            editeddataSmssendingsettingList = [];
            editeddatawhatsappsendingsettingList = [];
            editeddataAssignStageList = [];
            editeddataAssignGroupList = [];
            $(".removesalescusteventrepfild").click();
            $(".remvecusteventrepfild").click();
            $(".removesendmailoutresp").click();
            $(".removesendsmsoutresp").click();
            $(".removesendwhatsappoutresp").click();
            $(".removeisincludedleads").click();
            $(".removeisexcludedleads").click();
            $(".removeAssignStage").click();
            $(".removeAssignGroup").click();
            $(".salescusteventrepfields").removeClass("hideDiv");
            $(".custeventrepfields").removeClass("hideDiv");
            $(".divconsendoutmailresp").removeClass("hideDiv");
            $(".divconsendoutsmsresp").removeClass("hideDiv");
            $(".divconsendoutwhatsappresp").removeClass("hideDiv");
            $(".divincludedlead").removeClass("hideDiv");
            $(".divExcludedlead").removeClass("hideDiv");
            $(".divconAssignStage").removeClass("hideDiv");
            $(".divconAssignGroup").removeClass("hideDiv");

            ApiImportResponsesSettingUtil.ResetSaveOrUpdatePopUpFields();
            ShowPageLoading();
            let selectedItem;
            for (var i = 0; i < ApiImportResponseList.length; i++) {
                if (ApiImportResponseList[i].Id == Id)
                    selectedItem = ApiImportResponseList[i];
            }


            if (EditDuplicate == 'Edit') {
                ApiImportResponseSettingId = Id;
                $("#ui_btn_SaveOrUpdateSettings").html('Update Settings');
                $("#ui_btn_SaveOrUpdateSettings").attr('EditId', selectedItem.Id);

                $("#apirespnametext").val(selectedItem.Name);
            }
            else {
                $("#apirespnametext").val(selectedItem.Name + "_Copy");
            }
            if (selectedItem.ReportToDetailsByMail != null && selectedItem.ReportToDetailsByMail != undefined && selectedItem.ReportToDetailsByMail.length > 0) {
                $("#frmrepemail").prop('checked', true);
                $("#ui_txtArea_ReportByEmail").val(selectedItem.ReportToDetailsByMail);
                $("#ui_div_ReportEmail").removeClass("hideDiv");

            }

            if (selectedItem.ReportToDetailsBySMS != null && selectedItem.ReportToDetailsBySMS != undefined && selectedItem.ReportToDetailsBySMS.length > 0) {
                $("#frmrepsms").prop('checked', true);
                $("#ui_txtArea_ReportBySms").val(selectedItem.ReportToDetailsBySMS);
                $("#ui_div_ReportSMS").removeClass("hideDiv");
            }

            if (selectedItem.ReportToDetailsByWhatsApp != null && selectedItem.ReportToDetailsByWhatsApp != undefined && selectedItem.ReportToDetailsByWhatsApp.length > 0) {
                $("#frmrepwa").prop('checked', true);
                $("#ui_txtArea_ReportByWA").val(selectedItem.ReportToDetailsByWhatsApp);
                $("#ui_div_ReportWA").removeClass("hideDiv");
            }

            if (selectedItem.MailSendingSettingId > 0 || (selectedItem.MailSendingConditonalJson != null && selectedItem.MailSendingConditonalJson != "")) {

                $("#ui_chkSendMailOut").prop('checked', true);

                $("#ui_div_sendmailoutresponder").removeClass("hideDiv");
                if (selectedItem.MailSendingSettingId > 0) {

                    ApiImportResponsesSettingUtil.BindMailSendingSettingsValue(selectedItem.MailSendingSettingId);
                    ShowPageLoading();
                    Bindsendmailoutresponder();
                    if (selectedItem.IsMailRepeatCon)
                        $("#ui_chkUnCon_Sendrepeatmail").prop('checked', true);
                }
                else {
                    $("#ui_chkConditionalmailoutresp").prop('checked', true);
                    Bindsendmailoutresponder();
                    ShowPageLoading();
                    if (selectedItem.MailSendingConditonalJson != null && selectedItem.MailSendingConditonalJson.length > 0) {
                        let _Mailsendingsettingjson = JSON.parse(selectedItem.MailSendingConditonalJson);
                        let arrraydata = _Mailsendingsettingjson;
                        if (EditDuplicate == 'Edit')
                            editeddataMailsendingsettingList = _Mailsendingsettingjson;
                        for (let i = 0; i < arrraydata.length; i++) {
                            let mailsendingsettingid = arrraydata[i].SendingSettingId;
                            var MailTemplateid = JSLINQ(MailsendingsettingList).Where(function () {
                                return (this.Id == mailsendingsettingid);
                            });
                            if (i == 0) {
                                $(`#ui_sendmailoutrespcontactfields_${i + 1}`).val(arrraydata[i].Dependencyfield).trigger('change');
                                $(`#ui_sendmailoutresponvalue_${i + 1}`).val(arrraydata[i].Value);
                                if (arrraydata[i].IsRepeatCommunication)
                                    $(`#ui_chkSendrepeatmail_${i + 1}`).prop('checked', true);


                                if (MailTemplateid.items[0] != null && MailTemplateid.items[0] != "" && MailTemplateid.items[0] != undefined) {
                                    $(`#ui_conddlFromEmailSender_${i + 1}`).val(MailTemplateid.items[0].FromEmailId).trigger('change');
                                    $(`#ui_drpdwn_conMailTemplate_${i + 1}`).val(MailTemplateid.items[0].MailTemplateId).trigger('change');
                                    $(`#ui_txt_conMailSubject_${i + 1}`).val(ReplaceCustomFields(MailTemplateid.items[0].Subject != "null" ? MailTemplateid.items[0].Subject : ""));
                                    $(`#ui_txt_conMailFromName_${i + 1}`).val(MailTemplateid.items[0].FromName);
                                }


                            } else {
                                $("#addsendmailoutresp").click();
                                $(`#ui_sendmailoutrespcontactfields_${i + 1}`).val(arrraydata[i].Dependencyfield).trigger('change');
                                $(`#ui_sendmailoutresponvalue_${i + 1}`).val(arrraydata[i].Value);
                                if (arrraydata[i].IsRepeatCommunication == true)
                                    $(`#ui_chkSendrepeatmail_${i + 1}`).prop('checked', true);
                                if (MailTemplateid.items[0] != null && MailTemplateid.items[0] != "" && MailTemplateid.items[0] != undefined) {
                                    $(`#ui_conddlFromEmailSender_${i + 1}`).val(MailTemplateid.items[0].FromEmailId).trigger('change');
                                    $(`#ui_drpdwn_conMailTemplate_${i + 1}`).val(MailTemplateid.items[0].MailTemplateId).trigger('change');
                                    $(`#ui_txt_conMailSubject_${i + 1}`).val(ReplaceCustomFields(MailTemplateid.items[0].Subject != "null" ? MailTemplateid.items[0].Subject : ""));
                                    $(`#ui_txt_conMailFromName_${i + 1}`).val(MailTemplateid.items[0].FromName);
                                }


                            }
                        }
                    }
                }

            }

            if (selectedItem.SmsSendingSettingId > 0 || (selectedItem.SmsSendingConditonalJson != null && selectedItem.SmsSendingConditonalJson != "")) {

                $("#ui_chkSendSmsOut").prop('checked', true);
                $("#ui_div_sendsmsoutresponder").removeClass("hideDiv");
                if (selectedItem.SmsSendingSettingId > 0) {
                    ApiImportResponsesSettingUtil.BindSmsSendingSettingsValue(selectedItem.SmsSendingSettingId);
                    ShowPageLoading();
                    Bindsendsmsoutresponder();
                    if (selectedItem.IsSmsRepeatCon)
                        $("#ui_chkUnCon_Sendrepeatsms").prop('checked', true);
                }
                else {
                    $("#ui_chkConditionalsmsoutresp").prop('checked', true);
                    Bindsendsmsoutresponder();
                    ShowPageLoading();
                    if (selectedItem.SmsSendingConditonalJson != null && selectedItem.SmsSendingConditonalJson.length > 0) {
                        let _Smssendingsettingjson = JSON.parse(selectedItem.SmsSendingConditonalJson);
                        let arrraydata = _Smssendingsettingjson;
                        if (EditDuplicate == 'Edit')
                            editeddataSmssendingsettingList = _Smssendingsettingjson;
                        for (let i = 0; i < arrraydata.length; i++) {
                            let smssendingsettingid = arrraydata[i].SendingSettingId;
                            var SmsTemplateid = JSLINQ(SmssendingsettingList).Where(function () {
                                return (this.Id == smssendingsettingid);
                            });
                            if (i == 0) {
                                $(`#ui_sendsmsoutrespcontactfields_${i + 1}`).val(arrraydata[i].Dependencyfield).trigger('change');
                                $(`#ui_sendsmsoutresponvalue_${i + 1}`).val(arrraydata[i].Value);
                                if (arrraydata[i].IsRepeatCommunication == true)
                                    $(`#ui_chkSendrepeatsms_${i + 1}`).prop('checked', true);
                                if (SmsTemplateid.items[0] != null && SmsTemplateid.items[0] != "" && SmsTemplateid.items[0] != undefined) {
                                    $(`#ui_ddl_conSmsTemplate_${i + 1}`).val(SmsTemplateid.items[0].SmsTemplateId).trigger('change');
                                }


                            } else {
                                $("#addsendsmsoutresp").click();
                                $(`#ui_sendsmsoutrespcontactfields_${i + 1}`).val(arrraydata[i].Dependencyfield).trigger('change');
                                $(`#ui_sendsmsoutresponvalue_${i + 1}`).val(arrraydata[i].Value);
                                if (arrraydata[i].IsRepeatCommunication == true)
                                    $(`#ui_chkSendrepeatsms_${i + 1}`).prop('checked', true);
                                if (SmsTemplateid.items[0] != null && SmsTemplateid.items[0] != "" && SmsTemplateid.items[0] != undefined) {
                                    $(`#ui_ddl_conSmsTemplate_${i + 1}`).val(SmsTemplateid.items[0].SmsTemplateId).trigger('change');
                                }


                            }
                        }
                    }
                }

            }
            if (selectedItem.WhatsAppSendingSettingId > 0 || (selectedItem.WhatsAppSendingConditonalJson != null && selectedItem.WhatsAppSendingConditonalJson != "")) {

                $("#ui_chkSendWhatsAppOut").prop('checked', true);
                $("#ui_div_sendwhatsappoutresponder").removeClass("hideDiv");
                if (selectedItem.WhatsAppSendingSettingId > 0) {
                    ApiImportResponsesSettingUtil.BindWhatsAppSendingSettingsValue(selectedItem.WhatsAppSendingSettingId);
                    ShowPageLoading();
                    Bindsendwhatsappoutresponder();
                    if (selectedItem.IsWhatsappRepeatCon)
                        $("#ui_chkUnCon_Sendrepeatwhatsapp").prop('checked', true);
                }
                else {
                    $("#ui_chkConditionalwhatsappoutresp").prop('checked', true);
                    Bindsendwhatsappoutresponder();
                    ShowPageLoading();
                    if (selectedItem.WhatsAppSendingConditonalJson != null && selectedItem.WhatsAppSendingConditonalJson.length > 0) {
                        let _whatsappsendingsettingjson = JSON.parse(selectedItem.WhatsAppSendingConditonalJson);
                        let arrraydata = _whatsappsendingsettingjson;
                        if (EditDuplicate == 'Edit')
                            editeddatawhatsappsendingsettingList = _whatsappsendingsettingjson;
                        for (let i = 0; i < arrraydata.length; i++) {
                            let whatsappsendingsettingid = arrraydata[i].SendingSettingId;
                            var WhatsappTemplateid = JSLINQ(WhatsappsendingsettingList).Where(function () {
                                return (this.Id == whatsappsendingsettingid);
                            });
                            if (i == 0) {
                                $(`#ui_sendwhatsappoutrespcontactfields_${i + 1}`).val(arrraydata[i].Dependencyfield).trigger('change');
                                $(`#ui_sendwhatsappoutresponvalue_${i + 1}`).val(arrraydata[i].Value);
                                if (arrraydata[i].IsRepeatCommunication == true)
                                    $(`#ui_chkSendrepeatwhatsapp_${i + 1}`).prop('checked', true);
                                if (WhatsappTemplateid.items[0] != null && WhatsappTemplateid.items[0] != "" && WhatsappTemplateid.items[0] != undefined) {
                                    $(`#ui_ddl_conwhatsappTemplate_${i + 1}`).val(WhatsappTemplateid.items[0].WhatsAppTemplateId).trigger('change');
                                }


                            } else {
                                $("#addsendwhatsappoutresp").click();
                                $(`#ui_sendwhatsappoutrespcontactfields_${i + 1}`).val(arrraydata[i].Dependencyfield).trigger('change');
                                $(`#ui_sendwhatsappoutresponvalue_${i + 1}`).val(arrraydata[i].Value);
                                if (arrraydata[i].IsRepeatCommunication == true)
                                    $(`#ui_chkSendrepeatwhatsapp_${i + 1}`).prop('checked', true);
                                if (WhatsappTemplateid.items[0] != null && WhatsappTemplateid.items[0] != "" && WhatsappTemplateid.items[0] != undefined) {
                                    $(`#ui_ddl_conwhatsappTemplate_${i + 1}`).val(WhatsappTemplateid.items[0].WhatsAppTemplateId).trigger('change');
                                }


                            }
                        }
                    }
                }

            }

            if (selectedItem.AssignStage > 0 || ((selectedItem.AssignStageConditonalJson != null && selectedItem.AssignStageConditonalJson != "") && JSON.parse(selectedItem.AssignStageConditonalJson).length > 0)) {
                $("#ui_chkAssignStage").prop('checked', true);
                $("#ui_div_AssignStage").removeClass("hideDiv");
                if (selectedItem.AssignStage > 0) {

                    ApiImportResponsesSettingUtil.BindStagelistProperties(1);
                    $(`#ui_ddlAssignStage`).val(selectedItem.AssignStage).trigger('change');
                    BindAssignStage();
                }
                else {
                    $("#ui_chkConditionalAssignStage").prop('checked', true);
                    BindAssignStage();
                    ShowPageLoading();
                    if (selectedItem.AssignStageConditonalJson != null && JSON.parse(selectedItem.AssignStageConditonalJson).length > 0) {
                        let _assignstagejson = JSON.parse(selectedItem.AssignStageConditonalJson);
                        let arrraydata = _assignstagejson;
                        if (EditDuplicate == 'Edit')
                            editeddataassignstageList = _assignstagejson;
                        for (let i = 0; i < arrraydata.length; i++) {

                            if (i == 0) {
                                $(`#ui_AssignStagefields_${i + 1}`).val(arrraydata[i].Dependencyfield).trigger('change');
                                $(`#ui_AssignStagevalue_${i + 1}`).val(arrraydata[i].Value);

                                if (arrraydata[i].AssignStage != null && arrraydata[i].AssignStage != "" && arrraydata[i].AssignStage != undefined) {
                                    $(`#ui_ddl_conAssignStage_${i + 1}`).val(arrraydata[i].AssignStage).trigger('change');
                                }
                            } else {
                                $("#addAssignStage").click();

                                $(`#ui_AssignStagefields_${i + 1}`).val(arrraydata[i].Dependencyfield).trigger('change');
                                $(`#ui_AssignStagevalue_${i + 1}`).val(arrraydata[i].Value);
                                if (arrraydata[i].AssignStage != null && arrraydata[i].AssignStage != "" && arrraydata[i].AssignStage != undefined) {
                                    $(`#ui_ddl_conAssignStage_${i + 1}`).val(arrraydata[i].AssignStage).trigger('change');
                                }
                            }


                        }
                    }
                }
            }
            if (selectedItem.AssignToGroupId > 0 || ((selectedItem.AssignToGroupConditonalJson != null && selectedItem.AssignToGroupConditonalJson != "") && JSON.parse(selectedItem.AssignToGroupConditonalJson).length > 0)) {
                $("#ui_chkAssignGroup").prop('checked', true);
                $("#ui_div_AssignGroup").removeClass("hideDiv");
                if (selectedItem.AssignToGroupId > 0) {

                    ApiImportResponsesSettingUtil.BindgrouplistProperties(1);
                    $(`#ui_ddlGroupList`).val(selectedItem.AssignToGroupId).trigger('change');
                    BindAssignGroup();
                }
                else {
                    $("#ui_chkConditionalAssignGroup").prop('checked', true);
                    BindAssignGroup();
                    ShowPageLoading();
                    if (selectedItem.AssignToGroupConditonalJson != null && JSON.parse(selectedItem.AssignToGroupConditonalJson).length > 0) {
                        let _assignGroupjson = JSON.parse(selectedItem.AssignToGroupConditonalJson);
                        let arrraydata = _assignGroupjson;
                        if (EditDuplicate == 'Edit')
                            editeddataassignGroupList = _assignGroupjson;
                        for (let i = 0; i < arrraydata.length; i++) {

                            if (i == 0) {
                                $(`#ui_AssignGroupfields_${i + 1}`).val(arrraydata[i].Dependencyfield).trigger('change');
                                $(`#ui_AssignGroupvalue_${i + 1}`).val(arrraydata[i].Value);

                                if (arrraydata[i].AssignGroup != null && arrraydata[i].AssignGroup != "" && arrraydata[i].AssignGroup != undefined) {
                                    $(`#ui_ddl_conAssignGroup_${i + 1}`).val(arrraydata[i].AssignGroup).trigger('change');
                                }
                            } else {
                                $("#addAssignGroup").click();

                                $(`#ui_AssignGroupfields_${i + 1}`).val(arrraydata[i].Dependencyfield).trigger('change');
                                $(`#ui_AssignGroupvalue_${i + 1}`).val(arrraydata[i].Value);
                                if (arrraydata[i].AssignGroup != null && arrraydata[i].AssignGroup != "" && arrraydata[i].AssignGroup != undefined) {
                                    $(`#ui_ddl_conAssignGroup_${i + 1}`).val(arrraydata[i].AssignGroup).trigger('change');
                                }
                            }


                        }
                    }
                }
            }

            ////IsIncludedLead////
            if (selectedItem.IsIncludedLeads > 0 || (selectedItem.IncludedLeadsJson != null && selectedItem.IncludedLeadsJson != "")) {

                $("#ui_chkIncluded").prop('checked', true);
                $("#ui_div_Included").removeClass("hideDiv");
                ShowPageLoading();
                if (selectedItem.IsIncludedLeads != null && selectedItem.IncludedLeadsJson.length > 0) {
                    let _Includedleadsjson = JSON.parse(selectedItem.IncludedLeadsJson);
                    let arrraydata = _Includedleadsjson;
                    if (EditDuplicate == 'Edit')
                        editIsIncludedleadList = _Includedleadsjson;
                    for (let i = 0; i < arrraydata.length; i++) {
                        if (i == 0) {
                            $(`#ui_Includedcontactfields_${i + 1}`).val(arrraydata[i].Key).trigger('change');
                            $(`#ui_Includedvalue_${i + 1}`).val(arrraydata[i].Value);
                        } else {
                            $("#addisincludedleads").click();
                            $(`#ui_Includedcontactfields_${i + 1}`).val(arrraydata[i].Key).trigger('change');
                            $(`#ui_Includedvalue_${i + 1}`).val(arrraydata[i].Value);
                        }
                    }
                }
            }
            if (selectedItem.IsExcludedLeads > 0 || (selectedItem.ExcludedLeadsJson != null && selectedItem.ExcludedLeadsJson != "")) {

                $("#ui_chkExcluded").prop('checked', true);
                $("#ui_div_Excluded").removeClass("hideDiv");
                ShowPageLoading();
                if (selectedItem.IsExcludedLeads != null && selectedItem.ExcludedLeadsJson.length > 0) {
                    let _Excludedleadsjson = JSON.parse(selectedItem.ExcludedLeadsJson);
                    let arrraydata = _Excludedleadsjson;
                    if (EditDuplicate == 'Edit')
                        editIsExcludedleadList = _Excludedleadsjson;
                    for (let i = 0; i < arrraydata.length; i++) {
                        if (i == 0) {
                            $(`#ui_Excludedcontactfields_${i + 1}`).val(arrraydata[i].Key).trigger('change');
                            $(`#ui_Excludedvalue_${i + 1}`).val(arrraydata[i].Value);
                        } else {
                            $("#addis_Excludedleads").click();
                            $(`#ui_Excludedcontactfields_${i + 1}`).val(arrraydata[i].Key).trigger('change');
                            $(`#ui_Excludedvalue_${i + 1}`).val(arrraydata[i].Value);
                        }
                    }
                }
            }
            if (selectedItem.IsConditional != null && selectedItem.IsConditional == false) {
                if (selectedItem.IsOverRideSource > 0) {
                    $("#frmrepoverridesource").prop('checked', true);
                    $("#ui_ddlIsoverridesourceList").val(selectedItem.IsOverRideSource).trigger('change');
                    $("#ui_div_overridesource").removeClass("hideDiv");

                    $("#ui_chkUnConditionaloverridesource").prop('checked', true);
                    BindOverridesourceDetails();
                    ShowPageLoading();
                }
            } else if (selectedItem.IsConditional != null && selectedItem.IsConditional == true) {
                $("#frmrepoverridesource").prop('checked', true);
                $("#ui_div_overridesource").removeClass("hideDiv");
                $("#ui_chkConditionaloverridesource").prop('checked', true);
                BindOverridesourceDetails();
                ShowPageLoading();
                if (selectedItem.ConditionalJson != null && selectedItem.ConditionalJson.length > 0) {
                    let conditionalJson = JSON.parse(selectedItem.ConditionalJson);
                    let arrraydata = conditionalJson;
                    for (let i = 0; i < arrraydata.length; i++) {
                        if (i == 0) {
                            $(`#ui_contactfields_${i + 1}`).val(arrraydata[i].contactfieldproperty).trigger('change');
                            $(`#ui_value_${i + 1}`).val(arrraydata[i].contactfieldvalue);
                            $(`#ui_lmssourece_${i + 1}`).val(arrraydata[i].lmssource).trigger('change');
                        } else {
                            $("#addcusteventnamerep").click();
                            $(`#ui_contactfields_${i + 1}`).val(arrraydata[i].contactfieldproperty).trigger('change');
                            $(`#ui_value_${i + 1}`).val(arrraydata[i].contactfieldvalue);
                            $(`#ui_lmssourece_${i + 1}`).val(arrraydata[i].lmssource).trigger('change');
                        }
                    }
                }
            }
            if (selectedItem.IsUserAssignmentConditional != null && selectedItem.IsUserAssignmentConditional == false) {
                if (selectedItem.AssignLeadToUserInfoUserId > 0 || selectedItem.AssignUserGroupId > 0) {
                    $("#frmrepassgnsalper").prop('checked', true);
                    $("#ui_ddlUserList").val(selectedItem.AssignLeadToUserInfoUserId).trigger('change');
                    $("#ui_ddlusergroupList").val(selectedItem.AssignUserGroupId).trigger('change');
                    if (selectedItem.IsOverrideAssignment > 0)
                        $("#ui_chkIsOverrideAssignment").prop('checked', true);

                    if (selectedItem.IsUnConditionalGroupSticky > 0)
                        $("#ui_chkIsUnconditionalGroupSticky").prop('checked', true);

                    $("#ui_div_AssignSales").removeClass("hideDiv");
                }
            }
            else if (selectedItem.IsUserAssignmentConditional != null && selectedItem.IsUserAssignmentConditional == true) {
                ShowPageLoading();
                $("#frmrepassgnsalper").prop('checked', true);
                $("#ui_div_AssignSales").removeClass("hideDiv");
                $("#ui_chkConditionalsalesperson").prop('checked', true);
                BindassignsalespersonDetails();
                ShowPageLoading();
                if (selectedItem.UserAssigmentJson != null && selectedItem.UserAssigmentJson.length > 0) {
                    let userassigmentjson = JSON.parse(selectedItem.UserAssigmentJson);
                    let arrraydata = userassigmentjson;
                    for (let i = 0; i < arrraydata.length; i++) {
                        if (i == 0) {
                            $(`#ui_assignsalescontactfields_${i + 1}`).val(arrraydata[i].contactfieldproperty).trigger('change');
                            $(`#ui_assignsalesvalue_${i + 1}`).val(arrraydata[i].contactfieldvalue);
                            if (arrraydata[i].individual == 0)
                                $(`#ui_ddlUserListcon_${i + 1}`).val(arrraydata[i].userassignment).trigger('change');
                            else
                                $(`#ui_ddlusergroupListcon_${i + 1}`).val(arrraydata[i].userassignment).trigger('change');
                        } else {
                            $("#addsalescusteventnamerep").click();
                            $(`#ui_assignsalescontactfields_${i + 1}`).val(arrraydata[i].contactfieldproperty).trigger('change');
                            $(`#ui_assignsalesvalue_${i + 1}`).val(arrraydata[i].contactfieldvalue);
                            if (arrraydata[i].individual == 0)
                                $(`#ui_ddlUserListcon_${i + 1}`).val(arrraydata[i].userassignment).trigger('change');
                            else
                                $(`#ui_ddlusergroupListcon_${i + 1}`).val(arrraydata[i].userassignment).trigger('change');
                        }

                        if (arrraydata[i].isgroupsticky) {
                            $(`#ui_checkboxIsGroupSticky_${i + 1}`).prop('checked', true);
                        }
                    }
                }
            }
            if (selectedItem.IsVerifiedEmail > 0) {
                $("#chkboxVerifiedEmail").prop('checked', true);
            } else {
                $("#chkboxVerifiedEmail").prop('checked', false);
            }

            if (selectedItem.IsAutoWhatsApp > 0) {
                $("#chkboxAutoWhatsApp").prop('checked', true);
            } else {
                $("#chkboxAutoWhatsApp").prop('checked', false);
            }

            if (selectedItem.IsAutoClickToCall > 0) {
                $("#ui_div_ClickToCall").removeClass("hideDiv");
                $("#chkboxClickToCall").prop('checked', true);
                {
                    if (selectedItem.IsCallRepeatCon)
                        $("#ui_chkUnCon_Sendrepeatcall").prop('checked', true);
                }
                ;
            } else {
                $("#chkboxClickToCall").prop('checked', false);
            }

            if (selectedItem.WebHookId != null && selectedItem.WebHookId != "" && selectedItem.WebHookId != undefined && selectedItem.WebHookId.length > 0) {
                ShowPageLoading();
                $("#frmrepmobnotiwbhk").prop('checked', true);

                if (selectedItem.WebHookId.includes(",")) {
                    let idList = selectedItem.WebHookId.split(",");
                    for (var i = 0; i < idList.length; i++) {
                        ApiImportResponsesSettingUtil.GetWebhookDetails(parseInt(idList[i]));

                    }
                }
                else {
                    ApiImportResponsesSettingUtil.GetWebhookDetails(parseInt(selectedItem.WebHookId));
                }
                ShowPageLoading();
                ApiImportResponsesSettingUtil.BindWebhookDetails();
                $("#ui_div_Webhooks").removeClass("hideDiv");
            }
            ShowPageLoading();
            if (selectedItem.URLParameterResponses != null && selectedItem.URLParameterResponses != undefined && selectedItem.URLParameterResponses.length > 0) {
                $("#frmrepwebhookresp").prop('checked', true);
                var URLParameterResponsesDetail = selectedItem.URLParameterResponses;
                $.each(JSON.parse(URLParameterResponsesDetail), function (i, obj) {
                    $(".addwebhooksreps").click();
                    $("#ui_drpdwn_URLParameterField1_" + i).val(obj.Key).trigger('change');
                    $("#ui_txt_URLParameterField2_" + i).val(obj.Value);
                });

                $("#ui_div_URLParameters").removeClass("hideDiv");
            }

            if (selectedItem.SourceType == 0)
                $('#lmsStaySource').attr('checked', true);
            else if (selectedItem.SourceType == 1)
                $('#lmsOverrideSource').attr('checked', true);
            else if (selectedItem.SourceType == 2)
                $('#lmsNewSource').attr('checked', true);


            setTimeout(function () {
                $(".setfrmrulewrp").removeClass('hideDiv');
            }, 1000);
            setTimeout(function () {
                HidePageLoading();
            }, 3000);
        }

        ShowPageLoading();
    },
    BindMailSendingSettingsValue: function (Id) {
        ShowPageLoading();

        $.ajax({
            url: "/ManageContact/ApiImportSettings/GetMailSendingSettingDetail",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'MailSendingSettingId': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

                if (response != null && response != undefined) {
                    if (Id == 0)
                        MailsendingsettingList = response;
                    $("#ui_drpdwn_MailTemplate").val(response[0].MailTemplateId).trigger('change');
                    $("#ui_txt_MailSubject").val(ReplaceCustomFields(response[0].Subject != "null" ? response[0].Subject : ""));
                    $("#ui_txt_MailFromName").val(response[0].FromName);
                    $("#ui_ddlFromEmailSender").val(response[0].FromEmailId).trigger('change');
                }
            },
            error: ShowAjaxError
        });
        HidePageLoading()
    },
    BindSmsSendingSettingsValue: function (Id) {
        ShowPageLoading();
        $.ajax({
            url: "/ManageContact/ApiImportSettings/GetSMSSendingSettingDetail",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'SmsSendingSettingId': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && response != undefined) {
                    if (Id == 0)
                        SmssendingsettingList = response;
                    $("#ui_ddlSmsTemplate").val(response[0].SmsTemplateId).trigger('change');
                }
            },
            error: ShowAjaxError
        });
        /*HidePageLoading()*/
    },
    BindWhatsAppSendingSettingsValue: function (Id) {
        ShowPageLoading();
        $.ajax({
            url: "/ManageContact/ApiImportSettings/GetWASendingSettingDetail",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WASendingSettingId': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && response != undefined) {
                    if (Id == 0)
                        WhatsappsendingsettingList = response;
                    $("#ui_ddlWhatsAppTemplate").val(response[0].WhatsAppTemplateId).trigger('change');
                }
            },
            error: ShowAjaxError
        });
        /*   HidePageLoading()*/
    },
    GetWebhookDetails: function (Id) {
        ShowPageLoading();
        $.ajax({
            url: "/ManageContact/ApiImportSettings/GetWebhookDetail",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WebhookId': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && response != undefined) {

                    WebhookList.push(response);
                    ShowPageLoading();
                    ApiImportResponsesSettingUtil.BindWebhookDetails();
                    HidePageLoading();
                }

            },
            error: ShowAjaxError
        });

    },
    BindEachLmsSources: (i) => {
        if (lmsSoures != undefined && lmsSoures != null && lmsSoures.length >> 0) {
            $.each(lmsSoures, function () {
                $(`#ui_lmssourece_${i}`).append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");
            });
        }
    },
    GetLeadProperties: function () {
        /*   ShowPageLoading();*/
        $.ajax({
            url: "/Prospect/LeadProperties/GetAllProperty",
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    contactproperties = response;
                    ApiImportResponsesSettingUtil.BindLeadProperties(1);
                    ApiImportResponsesSettingUtil.InitialDropDownSearchBox(1);
                    ApiImportResponsesSettingUtil.SalespersonInitialDropDownSearchBox(1);
                }
            },
            error: ShowAjaxError
        });
    },
    BindLeadProperties: function (i) {
        $.each(contactproperties, function () {
            $(`#ui_contactfields_${i}`).append("<option value='" + $(this)[0].PropertyName + "'>" + $(this)[0].DisplayName + "</option>");
            $(`#ui_assignsalescontactfields_${i}`).append("<option value='" + $(this)[0].PropertyName + "'>" + $(this)[0].DisplayName + "</option>");
            $(`#ui_sendmailoutrespcontactfields_${i}`).append("<option value='" + $(this)[0].PropertyName + "'>" + $(this)[0].DisplayName + "</option>");
            $(`#ui_sendsmsoutrespcontactfields_${i}`).append("<option value='" + $(this)[0].PropertyName + "'>" + $(this)[0].DisplayName + "</option>");
            $(`#ui_sendwhatsappoutrespcontactfields_${i}`).append("<option value='" + $(this)[0].PropertyName + "'>" + $(this)[0].DisplayName + "</option>");
            $(`#ui_AssignStagefields_${i}`).append("<option value='" + $(this)[0].PropertyName + "'>" + $(this)[0].DisplayName + "</option>");
            $(`#ui_Includedcontactfields_${i}`).append("<option value='" + $(this)[0].PropertyName + "'>" + $(this)[0].DisplayName + "</option>");
            $(`#ui_Excludedcontactfields_${i}`).append("<option value='" + $(this)[0].PropertyName + "'>" + $(this)[0].DisplayName + "</option>");
            $(`#ui_AssignGroupfields_${i}`).append("<option value='" + $(this)[0].PropertyName + "'>" + $(this)[0].DisplayName + "</option>");

        });
        if (TaggingLmsCustomFields != null) {
            $.each(TaggingLmsCustomFields, function () {
                $(`#ui_sendmailoutrespcontactfields_${i}`).append("<option value='" + $(this)[0].FieldName + "'>" + $(this)[0].FieldDisplayName + "</option>");
                $(`#ui_sendsmsoutrespcontactfields_${i}`).append("<option value='" + $(this)[0].FieldName + "'>" + $(this)[0].FieldDisplayName + "</option>");
                $(`#ui_sendwhatsappoutrespcontactfields_${i}`).append("<option value='" + $(this)[0].FieldName + "'>" + $(this)[0].FieldDisplayName + "</option>");
                $(`#ui_assignsalescontactfields_${i}`).append("<option value='" + $(this)[0].FieldName + "'>" + $(this)[0].FieldDisplayName + "</option>");
                $(`#ui_contactfields_${i}`).append("<option value='" + $(this)[0].FieldName + "'>" + $(this)[0].FieldDisplayName + "</option>");
                $(`#ui_AssignStagefields_${i}`).append("<option value='" + $(this)[0].FieldName + "'>" + $(this)[0].FieldDisplayName + "</option>");
                $(`#ui_Includedcontactfields_${i}`).append("<option value='" + $(this)[0].FieldName + "'>" + $(this)[0].FieldDisplayName + "</option>");
                $(`#ui_Excludedcontactfields_${i}`).append("<option value='" + $(this)[0].FieldName + "'>" + $(this)[0].FieldDisplayName + "</option>");
                $(`#ui_AssignGroupfields_${i}`).append("<option value='" + $(this)[0].FieldName + "'>" + $(this)[0].FieldDisplayName + "</option>");

            });
        }
    },
    //Get Lms Stage
    GetLmsStage: function () {
        $.ajax({
            url: "/Prospect/Leads/GetStageScore",
            type: "POST",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: ApiImportResponsesSettingUtil.BindLmsStage,
            error: ShowAjaxError
        });
    },
    BindLmsStage: function (response) {
        if (response.StagesList != null && response.StagesList.length > 0) {
            StageList = response.StagesList;

            $.each(StageList, function (i) {
                var opt = document.createElement('option');
                opt.value = $(this)[0].Score;
                opt.text = $(this)[0].Stage;
                opt.setAttribute("style", "background-color:" + $(this)[0].IdentificationColor + ";");
                $('#ui_ddlAssignStage').append($("<option></option>").attr({ value: opt.value, style: "background-color:" + $(this)[0].IdentificationColor + ";" }).text(opt.text));

                $(`#ui_ddl_conAssignStage_1`).append($("<option></option>").attr({ value: opt.value, style: "background-color:" + $(this)[0].IdentificationColor + ";" }).text(opt.text));

            });
        }
    },
    BinduesrlistProperties: function (i) {
        $.each(assignsalespersonuserlist, function () {

            $(`#ui_ddlUserListcon_${i}`).append("<option value='" + $(this)[0].UserInfoUserId + "'>" + $(this)[0].FirstName + "</option>");
        });
    },
    BindgrouplistProperties: function (i) {
        $.each(assignsalespersongrouplist, function () {

            $(`#ui_ddlusergroupListcon_${i}`).append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");
        });
    },
    BindSendMailOutResponderTemp: function (i) {
        $.each(mailoutrespoTemplatelist, function () {

            $(`#ui_drpdwn_conMailTemplate_${i}`).append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");
        });
    },
    BindSendSmsOutResponderTemp: function (i) {
        $.each(smsoutrespoTemplatelist, function () {

            $(`#ui_ddl_conSmsTemplate_${i}`).append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");
        });
    },
    BindSendwhatsappOutResponderTemp: function (i) {
        $.each(whatsappoutrespoTemplatelist, function () {

            $(`#ui_ddl_conwhatsappTemplate_${i}`).append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");
        });
    },
    BindSendfromemail: function (i) {

        for (var a = 0; a < mailoutrespofromemaillist.length; a++) {

            $(`#ui_conddlFromEmailSender_${i}`).append("<option value='" + mailoutrespofromemaillist[a] + "'>" + mailoutrespofromemaillist[a] + "</option>");
        }
    },

    InitialDropDownSearchBox: function (i) {
        $(`#ui_contactfields_${i},#ui_lmssourece_${i}`).select2({
            minimumResultsForSearch: '',
            dropdownAutoWidth: false
        });

    },
    SalespersonInitialDropDownSearchBox: function (i) {
        $(`#ui_contactfields_${i},#ui_lmssourece_${i}`).select2({
            minimumResultsForSearch: '',
            dropdownAutoWidth: false
        });
    },
    BinduesrlistProperties: function (i) {
        $.each(assignsalespersonuserlist, function () {

            $(`#ui_ddlUserListcon_${i}`).append("<option value='" + $(this)[0].UserInfoUserId + "'>" + $(this)[0].FirstName + "</option>");
        });
    },
    BindStagelistProperties: function (i) {
        $.each(StageList, function () {

            var opt = document.createElement('option');
            opt.value = $(this)[0].Score;
            opt.text = $(this)[0].Stage;
            opt.setAttribute("style", "background-color:" + $(this)[0].IdentificationColor + ";");
            $(`#ui_ddl_conAssignStage_${i}`).append($("<option></option>").attr({ value: opt.value, style: "background-color:" + $(this)[0].IdentificationColor + ";" }).text(opt.text));

        });
    },
    BindGrouplist: function (i) {
        $.each(GroupList, function () {
            $(`#ui_ddl_conAssignGroup_${i}`).append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");

        });
    }
};

//Add Api Import Response Button
$("#addnewapiresp").click(function () {
    ApiImportResponsesSettingUtil.ResetSaveOrUpdatePopUpFields();
    $(".setfrmrulewrp").removeClass("hideDiv");
    HidePageLoading();
});

$("#close-response").click(function () {

    ShowPageLoading();
    $(this).parent().parent().addClass("hideDiv");
    setTimeout(function () {
        resetall();
    }, 1000);
    function resetall() {
        $(this).parent().parent().addClass("hideDiv");
        $(".salescusteventrepfields").empty();
        $(".custeventrepfields").empty();
        $(".divconsendoutmailresp").empty();
        $(".divconsendoutsmsresp").empty();
        $(".divconsendoutwhatsappresp").empty();
        $(".divincludedlead").empty();
        $(".divExcludedlead").empty();
        $(".divconAssignStage").empty();
        $(".divconAssignGroup").empty();
        assignsalespersonSourceCount = 1;
        assignsalesSourceCountArray = [1];
        lmsSourceCountArray = [1];
        sendmailoutresponerArray = [1];
        sendsmsoutresponerArray = [1];
        sendwhatsappoutresponerArray = [1];
        IsIncludedLeadArray = [1];
        IsExcludedLeadArray = [1];
        lmsSourceCount = 1;
        sendmailoutresponercount = 1;
        sendsmsoutresponercount = 1;
        sendwhatsappoutresponercount = 1;
        isincludedleadscount = 1;
        isexcludedleadscount = 1;
        assignstageArray = [1];
        assignstagecount = 1;
        assignGroupcount = 1;
        assignGroupArray = [1];
    }
    setTimeout(function () {
        HidePageLoading();
    }, 2000);
});

//Api Import Pop Up Checkbox
$(".frmrepresmain").click(function () {
    $(this).parent().parent().next().toggleClass("hideDiv");
});

$(".frmrepmobnotiweb").click(function () {
    if ($(this).is(":checked")) {
        if (this.name == 'frmrepmobnotiwbhk') {
            ApiImportResponsesSettingUtil.ResetAddWebHookFields();
        }
        if (this.name == 'frmrepwebhookresp') {
            ApiImportResponsesSettingUtil.ResetSaveOrUpdatePopUpAddURLParameterResponseFields();
        }
        $(this).parent().parent().next().removeClass("hideDiv");
        $(".frmrepreswebhook").prop("checked", true);
        if ($(".frmrepreswebhook").is(":checked")) {
            $(".frmrepreswebhook").parent().next().removeClass("hideDiv");
        }
    } else {
        $(this).parent().parent().next().addClass("hideDiv");
        $(".frmrepreswebhook").prop("checked", false);
        $(".frmrepreswebhook").parent().next().addClass("hideDiv");
    }
});

//Api Import Pop Up Save Or Update
$("#ui_btn_SaveOrUpdateSettings").click(function () {
    ShowPageLoading();
    if (!ApiImportResponsesSettingUtil.ValidateSaveOrUpdateSettings()) {
        HidePageLoading();
        return false;
    }
    ApiImportResponsesSettingUtil.SaveOrUpdateSettings();
});

//Web Hook
$("#addwebhookbtn").click(function () {
    ApiImportResponsesSettingUtil.ResetAddWebHookFields();
    $("#webhookeditoption").removeClass("hideDiv");
});

$("#savewebhook").click(function () {
    if (!ApiImportResponsesSettingUtil.ValidateSaveOrUpdateWebhooks())
        return false;

    ShowPageLoading();

    var webHookDetails = { WebHookId: 0, RequestURL: $("#requestUrlWebhook").val(), MethodType: $("#methodwebhook").val(), ContentType: $("#contentTypewebhook").val(), FieldMappingDetails: "", Headers: "", BasicAuthentication: 0, RawBody: "" };

    if ($("#savewebhook").attr('EditId') != null) {
        webHookDetails.WebHookId = parseInt($("#savewebhook").attr('EditId'));
    }

    if (webHookDetails.ContentType == "form") {
        var datamappingdetails = new Array();

        var p5fieldDivList = $('[id^=ui_div_data_p5field_]');
        for (var i = 0; i < p5fieldDivList.length; i++) {
            var filterConditions = { Key: "", Value: "", IsPlumb5OrCustomField: "" };

            var rowId = p5fieldDivList[i].id.substring(20);

            if ($("#ui_drpdwn_DataField1_" + rowId + " option:selected").val() != undefined) {
                filterConditions.Key = CleanText($("#ui_txt_DataField1_" + rowId).val());
                filterConditions.Value = $("#ui_drpdwn_DataField1_" + rowId + " option:selected").val();
                filterConditions.IsPlumb5OrCustomField = "Plumb5Field";

                datamappingdetails.push(filterConditions);
            }
        }

        var custfieldDivList = $('[id^=ui_div_data_custfild_]');
        for (var i = 0; i < custfieldDivList.length; i++) {
            var filterConditions = { Key: "", Value: "", IsPlumb5OrCustomField: "" };

            var rowId = fieldtrList[i].id.substring(20);

            if ($("#ui_txt_DataField2_" + rowId).val() != null && $("#ui_txt_DataField2_" + rowId).val() != "" && $("#ui_txt_DataField2_" + rowId).val().length > 0) {
                filterConditions.Key = CleanText($("#ui_txt_DataField2_" + rowId).val());
                filterConditions.Value = CleanText($("#ui_txt_DataField3_" + rowId).val());

                filterConditions.IsPlumb5OrCustomField = "StaticField";

                datamappingdetails.push(filterConditions);
            }
        }

        webHookDetails.FieldMappingDetails = JSON.stringify(datamappingdetails);
    }

    if (webHookDetails.ContentType == "raw body") {
        webHookDetails.RawBody = $.trim($("#ui_txtRequestBody").val());
    }

    //Headers values
    var headerdetails = new Array();
    var headertrList = $('[id^=ui_div_header_]');
    for (var i = 0; i < headertrList.length; i++) {
        var headerfilterConditions = { Key: "", Value: "" };
        var rowId = headertrList[i].id.substring(14);
        if ($("#ui_txt_HeaderField1_" + rowId + "").val() != "") {
            headerfilterConditions.Key = CleanText($("#ui_txt_HeaderField1_" + rowId).val());
            headerfilterConditions.Value = CleanText($("#ui_txt_HeaderField2_" + rowId).val());

            headerdetails.push(headerfilterConditions);
        }
    }
    /*var headertrList = $('[id^=trheader]');*/
    //var headerdrpoption = new Array();
    //var headeranswer = new Array();

    //for (var j = 0; j < headertrList.length; j++) {
    //    var rowId = headertrList[j].id.substring(8);

    //    if (ValidateWebHookHeaderFieldsAndValues(rowId)) {
    //        if ($.inArray($("#ui_txt_HeaderField1_" + rowId).val(), headerdrpoption) > -1 && $.inArray($("#ui_txt_HeaderField2_" + rowId).val(), headeranswer) > -1) {
    //            $("#ui_txt_HeaderField1_" + rowId).focus();
    //            ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.DuplicateHeaderKeyfields_ErrorMessage);
    //            return false;
    //        }
    //        else {
    //            headerdrpoption.push($("#ui_txt_HeaderField1_" + rowId).val());
    //            headeranswer.push($("#ui_txt_HeaderField1_" + rowId).val());
    //        }
    //    }
    //    else {
    //        return false;
    //    }
    //}


    webHookDetails.Headers = JSON.stringify(headerdetails);

    //Authentication
    var basicauthenticationdetails = { AuthenticationKey: "", AuthenticationValue: "" };
    if ($('#ui_txt_Authentication1').val().length > 0 && $('#ui_txt_Authentication1').val().length > 0) {
        basicauthenticationdetails.AuthenticationKey = $('#ui_txt_Authentication1').val();
        basicauthenticationdetails.AuthenticationValue = $('#ui_txt_Authentication2').val();
    }
    webHookDetails.BasicAuthentication = JSON.stringify(basicauthenticationdetails);
    ApiImportResponsesSettingUtil.SaveOrUpdateWebhookDetails(webHookDetails);
});
function ValidateWebHookHeaderFieldsAndValues(Id) {

    if ($("#ui_txt_HeaderField1_" + Id).val() == "" && $("#txtheaderValue_" + Id).val() == "") {
        ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.HeaderFieldKeyValue_ErrorMessage);
        return false;
    }

    if ($("#ui_txt_HeaderField1_" + Id).val() == "" && $("#ui_txt_HeaderField2_" + Id).val() != "") {
        $("#ui_txt_HeaderField1_" + Id).focus();
        ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.HeaderFieldKey_ErrorMessage);
        return false;
    }
    if ($("#ui_txt_HeaderField1_" + Id).val() != "" && $("#ui_txt_HeaderField2_" + Id).val() == "") {
        $("#ui_txt_HeaderField2_" + Id).focus();
        ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.HeaderFieldValue_ErrorMessage);
        return false;
    }
    return true;
}
$("#deletewebhookRowConfirm").click(function () {
    ShowPageLoading();
    ApiImportResponsesSettingUtil.RemoveWebhook($("#deletewebhookRowConfirm").attr("deleteId"));
    ApiImportResponsesSettingUtil.BindWebhookDetails();
    HidePageLoading();
});

$("#cancelwebhook").click(function () {
    ApiImportResponsesSettingUtil.ResetAddWebHookFields();
    $("#webhookeditoption").addClass("hideDiv");
});

$(".drpdowndatafield").click(function () {

    if (DataFieldCount > 0) {
        if (document.getElementById("ui_div_data_p5field_" + (DataFieldCount - 1)) != null) {
            if (parseInt($("#ui_drpdwn_DataField1_" + (DataFieldCount - 1)).val()) == 0 || $("#ui_txt_DataField1_" + (DataFieldCount - 1)).val().length == 0) {
                if (checkdataerror == 0)
                    ShowErrorMessage(GlobalErrorList.ApiImportResponses.WebHookDataError);
                return false;

            }

        }

        if (document.getElementById("ui_div_data_custfild_" + (DataFieldCount - 1)) != null) {
            if ($("#ui_txt_DataField2_" + (DataFieldCount - 1)).val().length == 0 || $("#ui_txt_DataField3_" + (DataFieldCount - 1)).val().length == 0) {
                if (checkdataerror == 0)
                    ShowErrorMessage(GlobalErrorList.ApiImportResponses.WebHookDataError);
                return false;

            }
        }

    }

    let getdatafielddrpval = $(this).text();

    if (CleanText(getdatafielddrpval) == "Add Plumb5 Field" || CleanText(getdatafielddrpval) == "Add") {
        let getdatafildhmtl = `<div id="ui_div_data_p5field_${DataFieldCount}" class="datawrkflwinpt mb-3">
                                    <div class="datainptitemwrp w-45 mr-2">
                                      <input type="text" name="" class="form-control h-30" id="ui_txt_DataField1_${DataFieldCount}">
                                  </div>
                                  <div class="datainptitemwrp w-45">
                                  <select name="" class="form-control" id="ui_drpdwn_DataField1_${DataFieldCount}">
                                      ${P5ContactFieldListDropDownValue}
                                  </select>
                                  </div>
                                  
                                  <i class="icon ion-ios-close-outline clsedatawrkflw closedatafield"></i>
                               </div>`;
        $(".adddatafildwrp").append(getdatafildhmtl);
    }
    else {
        let adddatafildtxtbx = `<div id="ui_div_data_custfild_${DataFieldCount}" class="datawrkflwinpt mb-3">
                                    <div class="datainptitemwrp w-45 mr-2">
                                        <input type="text" name="" class="form-control" id="ui_txt_DataField2_${DataFieldCount}">
                                                                    </div>
                                        <div class="datainptitemwrp w-45">
                                            <input type="text" name="" class="form-control" id="ui_txt_DataField3_${DataFieldCount}">
                                                                    </div>
                                            <i class="icon ion-ios-close-outline clsedatawrkflw closedatafield"></i>
                                </div>`;
        $(".adddatafildwrp").append(adddatafildtxtbx);
    }
    DataFieldCount++;
    CloseDataField();
});

function CloseDataField() {
    $(".closedatafield").click(function () {
        DataFieldCount--;
        $(this).parent().remove();
    });
}

$(".addheaderfild").click(function () {
    if (HeaderFieldCount > 0) {
        if ($("#ui_txt_HeaderField1_" + (HeaderFieldCount - 1)).val().length == 0 || $("#ui_txt_HeaderField2_" + (HeaderFieldCount - 1)).val().length == 0) {
            ShowErrorMessage(GlobalErrorList.ApiImportResponses.WebHookHeaderError);
            return false;
        }
    }

    let getheaderfilditem = `<div id="ui_div_header_${HeaderFieldCount}" class="datawrkflwinpt mb-3">
            <div class="datainptitemwrp w-45 mr-2">
                <input type="text" name="" class="form-control" id="ui_txt_HeaderField1_${HeaderFieldCount}">
                                  </div>
                <div class="datainptitemwrp w-45">
                    <input type="text" name="" class="form-control" id="ui_txt_HeaderField2_${HeaderFieldCount}">
                                  </div>
                    <i class="icon ion-ios-close-outline clsedatawrkflw closeheaderfield"></i>
                </div>`;
    $(getheaderfilditem).insertBefore(this);
    HeaderFieldCount++;
    CloseHeaderField();
});

function CloseHeaderField() {
    $(".closeheaderfield").click(function () {
        HeaderFieldCount--;
        $(this).parent().remove();
    });
}

$("#contentTypewebhook").change(function () {
    let checkcontypeval = $("#contentTypewebhook option:selected").text().toLowerCase();
    if (checkcontypeval == "raw body") {
        $("#rawbodytxtinpt").removeClass("hideDiv");
        $("#formtxtinput").addClass("hideDiv");
    } else if (checkcontypeval == "form") {
        $("#formtxtinput").removeClass("hideDiv");
        $("#rawbodytxtinpt").addClass("hideDiv");
    } else {
        $("#rawbodytxtinpt").addClass("hideDiv");
        $("#formtxtinput").addClass("hideDiv");
    }
});

//URL Parameter
$(".addwebhooksreps").click(function () {
    if (URLParameterFieldCount > 0) {
        if (parseInt($("#ui_drpdwn_URLParameterField1_" + (URLParameterFieldCount - 1)).val()) == 0 || $("#ui_txt_URLParameterField2_" + (URLParameterFieldCount - 1)).val().length == 0) {
            ShowErrorMessage(GlobalErrorList.ApiImportResponses.URLParameterError);
            return false;
        }
    }

    let getwebhooksrespfilditem = `<div id="ui_div_URLParameter_${URLParameterFieldCount}" class="datawrkflwinpt mb-3">
                    <div class="datainptitemwrp w-45 mr-2">
                        <select name="" class="form-control form-control-sm" id="ui_drpdwn_URLParameterField1_${URLParameterFieldCount}">
                            ${P5ContactFieldListDropDownValue}
                        </select>
                    </div>
                    <div class="datainptitemwrp w-45">
                        <input type="text" name="" class="form-control" id="ui_txt_URLParameterField2_${URLParameterFieldCount}">
                                      </div>
                        <i class="icon ion-ios-close-outline clsedatawrkflw closeurlparameterfield"></i>
                    </div>`;
    $(getwebhooksrespfilditem).insertBefore(this);
    InitializeURLParametersDropDowns();
    CloseURLParameterField();
    URLParameterFieldCount++;
});

function CloseURLParameterField() {
    $(".closeurlparameterfield").click(function () {
        URLParameterFieldCount--;
        $(this).parent().remove();
    });
}

function InitializeURLParametersDropDowns() {
    $("#ui_drpdwn_URLParameterField1_" + URLParameterFieldCount).select2({
        minimumResultsForSearch: '',
        dropdownAutoWidth: false
    });
}

//Delete API Import Responses Settings
$("#deleteRowConfirm").click(function () {
    ApiImportResponsesSettingUtil.DeleteApiImportResponse(parseInt($("#deleteRowConfirm").attr("DeleteId")));
});

//Filter By Name
//$("#ui_i_SearchBy").click(function () {
//    ShowPageLoading();
//    if ($.trim($("#ui_txtSearchBy").val()).length == 0) {
//        ShowErrorMessage(GlobalErrorList.ApiImportResponses.APIResponseNameSearchError);
//        $("#ui_txtSearchBy").focus();
//        setTimeout(function () { HidePageLoading(); }, 500);
//        return false;
//    }
//    else {
//        ApiImportResponsesSettingUtil.DecideQuickFilterBy();
//    }
//});

//$("#ui_txtSearchBy").keypress(function (e) {
//    if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
//        if (CleanText($.trim($("#ui_txtSearchBy").val())).length == 0) {
//            ShowErrorMessage(GlobalErrorList.ApiImportResponses.SearchErrorValue);
//            HidePageLoading();
//            return false;
//        }
//        ShowPageLoading();
//        ApiImportResponsesSettingUtil.DecideQuickFilterBy();
//    }
//});

//$("#ui_txtSearchBy").keyup(function (e) {
//    if (e.which && e.which === 8 || e.keyCode && e.keyCode === 46)
//        if ($("#ui_txtSearchBy").val().length === 0) {
//            ShowPageLoading();
//            ApiImportResponsesSettingUtil.DecideQuickFilterBy();
//        }
//});

//Search text
$(".contsearchfocus")
    .on("focus", function () {
        $(this).parent().addClass("w-300");
    })
    .on("blur", function () {
        if ($(".contsearchfocus").val().length < 15)
            $(this).parent().removeClass("w-300");
    });

//---------------------------------------------------------------------------

$("#SearchByIdentifierName").click(function () {
    ShowPageLoading();
    if ($.trim($("#ui_txtSearchBy").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.ApiImportResponses.ResponseAPISearch_error);
        $("#ui_txtSearchBy").focus();
        setTimeout(function () { HidePageLoading(); }, 500);
        return false;
    }
    else {
        OffSet = 0;
        CallBackFunction();
    }
});

$("#ui_txtSearchBy").keypress(function (e) {
    if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
        if (CleanText($.trim($("#ui_txtSearchBy").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.ApiImportResponses.SearchErrorValue);
            HidePageLoading();
            return false;
        }
        ShowPageLoading();
        OffSet = 0;
        CallBackFunction();
    }
});

$("#ui_txtSearchBy").keyup(function (e) {
    if (e.which && e.which === 8 || e.keyCode && e.keyCode === 46)
        if ($("#ui_txtSearchBy").val().length === 0) {
            ShowPageLoading();
            ApiImportResponsesSettingUtil.MaxCount();
        }
});


//-----------------------------------------------------------------------------------------------------------------

var responseMaxCount = 0, responseOffSet = 0, responseFetchNext = 0, responseCurrentRowCount = 0, callingSource = "";

var apisettingtWebhookResponseUtil = {
    GetMaxCount: function (ApiImportResponseSettingId, APIResponseName) {
        ShowPageLoading();
        responseMaxCount = 0, responseOffSet = 0, responseFetchNext = 0, responseCurrentRowCount = 0, callingSource = "";
        $("#ui_subtitle_smalls").html(APIResponseName);

        $.ajax({
            url: "/ManageContact/ApiImportSettings/GetMaxCountAPILogs",
            type: 'Post',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'ApiImportResponseSettingId': ApiImportResponseSettingId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                responseMaxCount = response.returnVal;
                $("#ui_div_ResponseJsons").html('');
                if (responseMaxCount > 0) {
                    InitializeResponsePaging(ApiImportResponseSettingId, APIResponseName);
                    $("#ui_Paggingdivs, #ui_div_ResponseJsons").removeClass('hideDiv');
                    $("#ui_tbl_ResponseReportDatas").addClass("hideDiv");
                    apisettingtWebhookResponseUtil.GetResponseDetails(ApiImportResponseSettingId);
                }
                else {
                    $("#ui_tbl_ResponseReportDatas").removeClass("hideDiv");
                    $("#ui_Paggingdivs, #ui_div_ResponseJsons").addClass('hideDiv');
                    $("#ui_div_FormChatWebHookResponses").removeClass("hideDiv");
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetResponseDetails: function (ApiImportResponseSettingId) {
        responseFetchNext = $("#ui_drpdwn_NumberOfRecordss").val();
        $.ajax({
            url: "/ManageContact/ApiImportSettings/GetDetailsAPILogs",
            type: 'Post',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'ApiImportResponseSettingId': ApiImportResponseSettingId, 'OffSet': responseOffSet, 'FetchNext': responseFetchNext }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var responseArrayList = [];
                if (response != null && response.length > 0) {
                    responseCurrentRowCount = response.length;
                    ResponsePagingPrevNext(responseOffSet, responseCurrentRowCount, responseMaxCount);
                    $.each(response, function () {
                        var responsecontent = { IsContactSuccess: this.IsContactSuccess, ContactErrorMessage: this.ContactErrorMessage, IsLmsSuccess: this.IsLmsSuccess, LmsErrorMessage: this.LmsErrorMessage, P5UniqueId: this.P5UniqueId, ErrorMessage: this.ErrorMessage, SourceType: this.SourceType };
                        var responseBody = { CreatedDate: $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.CreatedDate)), RequestContent: apisettingtWebhookResponseUtil.GetJsonData(this.RequestContent), ResponseContent: apisettingtWebhookResponseUtil.GetJsonData(responsecontent) };
                        responseArrayList.push(responseBody);
                    });
                    new JsonEditor('#ui_div_ResponseJsons', apisettingtWebhookResponseUtil.GetJsonData(responseArrayList));
                    $("ul>li>a.json-toggle").click();
                    $("#ui_div_FormChatWebHookResponses").removeClass("hideDiv");
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    GetJsonData: function (LogContent) {
        var parsedData;
        try {
            parsedData = JSON.parse(LogContent);
        } catch (e) {
            // is not a valid JSON string
            parsedData = LogContent;
        }

        return parsedData;
    }
};

function ResponsePagingPrevNext(DataOffSet, DataCount, TotalData) {
    if ((DataOffSet != undefined && DataOffSet != null && DataOffSet > -1) && (DataCount != undefined && DataCount != null && DataCount > -1) && (TotalData != undefined && TotalData != null && TotalData > -1)) {

        ShowPagingDiv(true);
        $("#ui_div_BackPopPaging").removeClass('disableDiv');
        $("#ui_div_NextPopPaging").removeClass('disableDiv');

        if (DataOffSet == 0) {
            $("#ui_lbl_Pagings").html((DataOffSet + 1) + ' - ' + DataCount + ' of ' + TotalData);
            $("#ui_div_BackPopPagings").addClass('disableDiv');
        }
        else {
            $("#ui_lbl_Pagings").html((DataOffSet + 1) + ' - ' + (DataOffSet + DataCount) + ' of ' + TotalData);
        }

        if ((DataOffSet + DataCount) >= TotalData) {
            $("#ui_div_NextPopPaging").addClass('disableDiv');
        }
    }
}

function InitializeResponsePaging(Id, FormIdentifier) {
    $(document.body).on('click', '#ui_div_BackPopPagings', function (event) {
        responseOffSet = responseOffSet - parseInt($("#ui_drpdwn_NumberOfRecordss").val());
        responseOffSet <= 0 ? 0 : responseOffSet;
        ResponseCallBackPaging(Id);
    });

    $(document.body).on('click', '#ui_div_NextPopPagings', function (event) {
        responseOffSet = responseOffSet + parseInt($("#ui_drpdwn_NumberOfRecordss").val());
        ResponseCallBackPaging(Id);
    });

    $(document.body).on('change', '#ui_drpdwn_NumberOfRecordss', function (event) {
        responseOffSet = 0;
        responseFetchNext = parseInt($("#ui_drpdwn_NumberOfRecordss").val());
        ResponseCallBackFunction(Id, FormIdentifier);
    });
}

function ResponseCallBackFunction(Id, FormIdentifier) {
    ShowPageLoading();
    responseMaxCount = 0;
    responseCurrentRowCount = 0;
    apisettingtWebhookResponseUtil.GetMaxCount(Id, FormIdentifier);
}

function ResponseCallBackPaging(Id) {
    responseCurrentRowCount = 0;
    apisettingtWebhookResponseUtil.GetResponseDetails(Id);
}

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
    $(".errmsgemlvalidwrp .ion-ios-information").popover("hide");

});
$('#draganddropcutomre').on('change', function () {
    if (this.value != "Select") {
        let input = $('#ui_txt_MailSubject')[0]; // get the input element
        let cursorPos = input.selectionStart; // get the current cursor position
        let currentValue = input.value; // get the current input value
        let newValue = currentValue.substring(0, cursorPos) + `[{*${this.value}*}]` + currentValue.substring(cursorPos); // insert the new data at the cursor position
        input.value = newValue; // set the updated value

        //$("#ui_txtSubjectLine").val($("#ui_txtSubjectLine").val() + " [{*" + this.value + "*}]");
    }
});


$('#eventitemsmessage').on('change', function () {
    if (this.value != "Select") {
        let input = $('#ui_txt_MailSubject')[0]; // get the input element
        let cursorPos = input.selectionStart; // get the current cursor position
        let currentValue = input.value; // get the current input value
        let newValue = currentValue.substring(0, cursorPos) + `{{*[${eventname}]~[${this.value}]~[TOP1.DESC]~[fallbackdata]*}}` + currentValue.substring(cursorPos); // insert the new data at the cursor position
        input.value = newValue; // set the updated value

        //$("#ui_txtSubjectLine").val($("#ui_txtSubjectLine").val() + " {{*[" + eventname + "]~[" + this.value + "]~[TOP1.DESC]~[fallbackdata]*}}");
    }
});


BindOverridesourceDetails();
$("#addcusteventnamerep").click(function () {
    lmsSourceCount++;
    lmsSourceCountArray.push(lmsSourceCount);
    let addfieldsinput = `<div class="row position-relative">
  <div class="col">
    <div class="form-group">
      <label for="" class="frmlbltxt">Fields</label>
      <select class="form-control select2drpdwnbrd" name="" id="ui_contactfields_${lmsSourceCount}" data-placeholder="Add Fields">
        <option value="0">Select</option>        
      </select>
    </div>
  </div>
  <div class="col">
    <div class="form-group">
      <label for="" class="frmlbltxt">Value</label>
      <input type="text" name="" class="form-control form-control-sm" id="ui_value_${lmsSourceCount}">
    </div>
  </div>
  <div class="col">
    <div class="form-group">
      <label for="" class="frmlbltxt">Source</label>
      <select class="form-control select2drpdwnbrd" name=""  id="ui_lmssourece_${lmsSourceCount}" data-placeholder="Add Fields">
        <option value="0">Select</option>        
      </select>
    </div>
  </div>
 
  <i class="ion ion-ios-close-outline font-18 mr-20 cursor-pointer remvecusteventrepfild" id=${lmsSourceCount}></i>
</div>`;
    $(".custeventrepfields").append(addfieldsinput);



    $(".remvecusteventrepfild").click(function () {
        let id = parseInt($(this).attr("id"));
        lmsSourceCountArray = lmsSourceCountArray.filter(item => item !== id);
        $(this).parent().remove();
    });

    ApiImportResponsesSettingUtil.BindLeadProperties(lmsSourceCount);
    ApiImportResponsesSettingUtil.BindEachLmsSources(lmsSourceCount);
    ApiImportResponsesSettingUtil.InitialDropDownSearchBox(lmsSourceCount);
});

$("#addsalescusteventnamerep").click(function () {
    assignsalespersonSourceCount++;
    assignsalesSourceCountArray.push(assignsalespersonSourceCount);
    let addfieldsinput = `<div class="row position-relative">
  <div class="col-sm-2">
    <div class="form-group">
      <label for="" class="frmlbltxt">Fields</label>
      <select class="form-control select2drpdwnbrd" name="" id="ui_assignsalescontactfields_${assignsalespersonSourceCount}" data-placeholder="Add Fields">
        <option value="0">Select</option>        
      </select>
    </div>
  </div>
  <div class="col-sm-2">
    <div class="form-group">
      <label for="" class="frmlbltxt">Value</label>
      <input type="text" name="" class="form-control form-control-sm" id="ui_assignsalesvalue_${assignsalespersonSourceCount}">
    </div>
  </div>
    <div class="col-sm-2">
        <div class="form-group">
            <label for="" class="frmlbltxt">Sales Person's Name</label>
             <select class="form-control select2drpdwnbrd" name=""  id="ui_ddlUserListcon_${assignsalespersonSourceCount}" data-placeholder="Add Fields">
                <option value="0">Select User</option>
            </select>
        </div>
    </div>
   

    <div class="col-sm-0 col-md-0 col-lg-1 col-xl-0">
        <div class="form-group">
            <label for="" class="frmlbltxt">OR</label>
        </div>
    </div>
    <div class="col-sm-2">
        <div class="form-group">
            <label for="" class="frmlbltxt">Select User Groups</label>
             <select class="form-control form-control-sm notspecificbtn select2" id="ui_ddlusergroupListcon_${assignsalespersonSourceCount}">
                <option value="0">Select Group</option>
             </select>
        </div>
    </div>
        <div class="col-sm-2">
                <div class="form-group">
                    <label for="" class="frmlbltxt">Group Stickyness</label>
                    <input type="checkbox" id="ui_checkboxIsGroupSticky_${assignsalespersonSourceCount}" name="ui_checkboxIsGroupSticky_${assignsalespersonSourceCount}">
               </div>
        </div>
<i class="ion ion-ios-close-outline font-18 mr-20 cursor-pointer removesalescusteventrepfild" closeid="Closecondsalesdiv" id=${assignsalespersonSourceCount}></i>
  </div>
 
  
</div>`;
    $(".salescusteventrepfields").append(addfieldsinput);



    $(".removesalescusteventrepfild").click(function () {

        let id = parseInt($(this).attr("id"));
        assignsalesSourceCountArray = assignsalesSourceCountArray.filter(item => item !== id);
        $(this).parent().remove();
    });

    $('#ui_ddlusergroupListcon_' + assignsalespersonSourceCount + ', #ui_ddlUserListcon_' + assignsalespersonSourceCount + ', #ui_assignsalescontactfields_' + assignsalespersonSourceCount).select2({
        minimumResultsForSearch: '',
        dropdownAutoWidth: false,
        containerCssClass: "border"
    });
    ApiImportResponsesSettingUtil.BindLeadProperties(assignsalespersonSourceCount);
    ApiImportResponsesSettingUtil.BinduesrlistProperties(assignsalespersonSourceCount);
    ApiImportResponsesSettingUtil.BindgrouplistProperties(assignsalespersonSourceCount);

});
$("input:radio[name=Isassignsalesperson]").click(function () {
    BindassignsalespersonDetails();
});

function BindassignsalespersonDetails() {
    $("#dvConditionalSettingsforsalesperson").hide();
    $("#dvUnConditionalSettingsforsalesperson").hide();

    if ($("#ui_chkUnConditionalsalesperson").is(":checked")) {
        $("#dvUnConditionalSettingsforsalesperson").show();
        $("#dvConditionalSettingsforsalesperson").hide();
    }
    else {
        $("#dvConditionalSettingsforsalesperson").show();
        $("#dvUnConditionalSettingsforsalesperson").hide();
    }
}
$("input:radio[name=Isoverridesource]").click(function () {
    BindOverridesourceDetails();
});

function BindOverridesourceDetails() {
    $("#dvConditionalSettings").hide();
    $("#dvUnConditionalSettings").hide();

    if ($("#ui_chkUnConditionaloverridesource").is(":checked")) {
        $("#dvUnConditionalSettings").show();
        $("#dvConditionalSettings").hide();
    }
    else {
        $("#dvConditionalSettings").show();
        $("#dvUnConditionalSettings").hide();
    }
}
$("#addsendmailoutresp").click(function () {

    sendmailoutresponercount++;
    sendmailoutresponerArray.push(sendmailoutresponercount);
    let addfieldsinput = `<div class="row position-relative">
   <div class="col-sm-2">
                            <div class="form-group">
                                <label for="" class="frmlbltxt">Fields</label>
                                <select class="form-control select2drpdwnbrd select2drpdwnbrdfield" name="" id="ui_sendmailoutrespcontactfields_${sendmailoutresponercount}" data-placeholder="Add Fields">
                                    <option value="0">Select</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-1.8">
                            <div class="form-group">
                                <label for="" class="frmlbltxt">Value</label>
                                <input type="text" name="" class="form-control form-control-sm frmlbltxtvalue" id="ui_sendmailoutresponvalue_${sendmailoutresponercount}">
                            </div>
                        </div>
                        <div class="col-sm-2">
                            <div class="form-group">
                                <label class="frmlbltxt" for="">Template Name</label>

                                <select class="form-control form-control-sm notspecificbtn select2" id="ui_drpdwn_conMailTemplate_${sendmailoutresponercount}">
                                    <option value="0">Select</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-sm-2">
                             <div class="form-group">
                                <label class="frmlbltxt" for="">Mail Subject</label>
                                <div class="postion-relative">
                                    <input type="text" class="form-control" id="ui_txt_conMailSubject_${sendmailoutresponercount}">
                                    <div class="mailsubiconuncondi zindex10">
                                        <div class="mailsubuserattwrp dropdown">
                                            <i class="icon ion-android-person mailsubdrp top-40"></i>
                                            <div class="browse-dropdown-menu top-70">
                                                <div class="dropdwntabwrap border bg-white">
                                                    <div class="dropdwntabitem">
                                                        <div data-tabcontid="userattr_${sendmailoutresponercount}" class="dropdwntabs3 active" id="userattrheader_${sendmailoutresponercount}">
                                                            User Attributes
                                                        </div>
                                                        <div data-tabcontid="customeve_${sendmailoutresponercount}" class="dropdwntabs3" id="customeveheader_${sendmailoutresponercount}">
                                                            Custom Events
                                                        </div>
                                                    </div>

                                                    <div class="dropdwntabcontwrap">
                                                        <div id="userattr_${sendmailoutresponercount}" class="userattribwrap2">
                                                            <h6 class="dropdown-title">
                                                                User Attribute
                                                            </h6>
                                                            <select  id='draganddropuncustomtitle'
                                                                    class="form-control addCampName select2drpdwnbrd select2drpdwnbrdfield"
                                                                    data-index='${sendmailoutresponercount}'
                                                                    data-placeholder="Select Group(s)">
                                                                <option value="0">Select</option>

                                                            </select>
                                                        </div>
                                                        <div id="customeve_${sendmailoutresponercount}" class="userattribwrap2 hideDiv">
                                                            <h6 class="dropdown-title">
                                                                Custom Events
                                                            </h6>
                                                            <select id="eventnameconditionalsubject"
                                                                    class="form-control addCampName select2drpdwnbrd select2drpdwnbrdfield"
                                                                    data-placeholder="Select Group(s)">
                                                                <option label="Events Name">
                                                                    Select Event Name
                                                                </option>

                                                            </select>
                                                            <div class="mt-3">
                                                                <select id="eventitemsconditionalsubject_${sendmailoutresponercount}"
                                                                        class="form-control addCampName select2drpdwnbrd select2drpdwnbrdfield"
                                                                        data-index='${sendmailoutresponercount}'
                                                                        data-placeholder="Select Group(s)">
                                                                    <option label="Events Items">
                                                                        Select Event Items
                                                                    </option>

                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <i class="icon ion-close-circled"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-0">
                            <div class="form-group">
                                <label for="" class="frmlbltxt">From Name</label>

                                <input type="text" name="" class="form-control" id="ui_txt_conMailFromName_${sendmailoutresponercount}" autocomplete="off">

                            </div>
                        </div>
                        <div class="col-sm-1 col-md-2">
                            <div class="form-group">
                                <label class="frmlbltxt" for="">From Email Id</label>

                                        <select class="form-control form-control-sm notspecificbtn select2" id="ui_conddlFromEmailSender_${sendmailoutresponercount}">
                                            <option value="0">Select</option>
                                        </select>
                        </div>
                        </div>
                        <div class="col-sm-0.6">

                            <div class="form-group">
                                <label class="frmlbltxt" for="ui_chkSendrepeatmail">IsRepeat</label>
                                <input type="checkbox" class="form-control form-control-sm notspecificbtn" id="ui_chkSendrepeatmail_${sendmailoutresponercount}" name="">

                            </div>
                        </div>
                <i class=" col-sm-0.6 ion ion-ios-close-outline font-18 mr-20 cursor-pointer removesendmailoutresp" id=${sendmailoutresponercount}></i>
                  
            
 
  
</div>`;
    $(".divconsendoutmailresp").append(addfieldsinput);



    $(".removesendmailoutresp").click(function () {

        let id = parseInt($(this).attr("id"));
        sendmailoutresponerArray = sendmailoutresponerArray.filter(item => item !== id);
        $(this).parent().remove();
    });
    $('#ui_sendmailoutrespcontactfields_' + sendmailoutresponercount + ', #ui_drpdwn_conMailTemplate_' + sendmailoutresponercount + ', #ui_conddlFromEmailSender_' + sendmailoutresponercount + ', #eventitemsconditionalsubject_' + sendmailoutresponercount + ', #draganddropuncustomtitle,#eventnameconditionalsubject').select2({
        minimumResultsForSearch: '',
        dropdownAutoWidth: false,
        containerCssClass: "border"
    });

    ApiImportResponsesSettingUtil.BindLeadProperties(sendmailoutresponercount);
    ApiImportResponsesSettingUtil.BindSendMailOutResponderTemp(sendmailoutresponercount);
    ApiImportResponsesSettingUtil.BindSendfromemail(sendmailoutresponercount);
    ApiImportResponsesSettingUtil.InitializeEventNameFieldListpersonalize();
    ApiImportResponsesSettingUtil.InitializeContactFieldListpersonalize();
    /* HidePageLoading();*/
});
$("input:radio[name=Ismailoutresp]").click(function () {
    Bindsendmailoutresponder();
});
$("input:radio[name=Issmsoutresp]").click(function () {
    Bindsendsmsoutresponder();
});
$("input:radio[name=Iswhatsappoutresp]").click(function () {
    Bindsendwhatsappoutresponder();
});
$("input:radio[name=IsAssignStage]").click(function () {
    BindAssignStage();
});
$("input:radio[name=IsAssignGroup]").click(function () {
    BindAssignGroup();
});
$("#addsendsmsoutresp").click(function () {

    sendsmsoutresponercount++;
    sendsmsoutresponerArray.push(sendsmsoutresponercount);
    let addfieldsinput = `<div class="row position-relative">
    <div class="col-sm-2">
                            <div class="form-group">
                                <label for="" class="frmlbltxt">Fields</label>
                                <select class="form-control select2drpdwnbrd select2drpdwnbrdfield" name="" id="ui_sendsmsoutrespcontactfields_${sendsmsoutresponercount}" data-placeholder="Add Fields">
                                    <option value="0">Select</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-2">
                            <div class="form-group">
                                <label for="" class="frmlbltxt">Value</label>
                                <input type="text" name="" class="form-control form-control-sm frmlbltxtvalue" id="ui_sendsmsoutresponvalue_${sendsmsoutresponercount}">
                            </div>
                        </div>
                        <div class="col-sm-2">
                            <div class="form-group">
                                <label class="frmlbltxt" for="">Template Name</label>

                                <select class="form-control form-control-sm notspecificbtn select2" id="ui_ddl_conSmsTemplate_${sendsmsoutresponercount}">
                                    <option value="0">Select</option>
                                </select>
                            </div>
                        </div>
                    <div class="col-sm-0 mr-30">
                            <div class="form-group">
                                <label class="frmlbltxt" for="ui_chkSendrepeatsms_${sendsmsoutresponercount}">IsRepeat</label>
                                <input type="checkbox" class="form-control form-control-sm notspecificbtn" id="ui_chkSendrepeatsms_${sendsmsoutresponercount}" name="">

                            </div>
                        </div> 
                <i class="ion ion-ios-close-outline font-18 mr-20 cursor-pointer removesendsmsoutresp" id=${sendsmsoutresponercount}></i> 
                  
            
 
  
</div>`;
    $(".divconsendoutsmsresp").append(addfieldsinput);



    $(".removesendsmsoutresp").click(function () {

        let id = parseInt($(this).attr("id"));
        sendsmsoutresponerArray = sendsmsoutresponerArray.filter(item => item !== id);
        $(this).parent().remove();
    });
    $('#ui_sendsmsoutrespcontactfields_' + sendsmsoutresponercount + ', #ui_ddl_conSmsTemplate_' + sendsmsoutresponercount).select2({
        minimumResultsForSearch: '',
        dropdownAutoWidth: false,
        containerCssClass: "border"
    });

    ApiImportResponsesSettingUtil.BindLeadProperties(sendsmsoutresponercount);
    ApiImportResponsesSettingUtil.BindSendSmsOutResponderTemp(sendsmsoutresponercount);

    /*HidePageLoading();*/
});
$("#addsendwhatsappoutresp").click(function () {

    sendwhatsappoutresponercount++;
    sendwhatsappoutresponerArray.push(sendwhatsappoutresponercount);
    let addfieldsinput = `<div class="row position-relative">
    <div class="col-sm-2">
                            <div class="form-group">
                                <label for="" class="frmlbltxt">Fields</label>
                                <select class="form-control select2drpdwnbrd select2drpdwnbrdfield" name="" id="ui_sendwhatsappoutrespcontactfields_${sendwhatsappoutresponercount}" data-placeholder="Add Fields">
                                    <option value="0">Select</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-2">
                            <div class="form-group">
                                <label for="" class="frmlbltxt">Value</label>
                                <input type="text" name="" class="form-control form-control-sm frmlbltxtvalue" id="ui_sendwhatsappoutresponvalue_${sendwhatsappoutresponercount}">
                            </div>
                        </div>
                        <div class="col-sm-2">
                            <div class="form-group">
                                <label class="frmlbltxt" for="">Template Name</label>

                                <select class="form-control form-control-sm notspecificbtn select2" id="ui_ddl_conwhatsappTemplate_${sendwhatsappoutresponercount}">
                                    <option value="0">Select</option>
                                </select>
                            </div>
                        </div>
                    <div class="col-sm-0 mr-30">
                    <div class="form-group">
                            <label class="frmlbltxt" for="ui_chkSendrepeatwhatsapp_${sendwhatsappoutresponercount}">IsRepeat</label>
                            <input type="checkbox" class="form-control form-control-sm notspecificbtn" id="ui_chkSendrepeatwhatsapp_${sendwhatsappoutresponercount}"" name="">

                        </div>
                    </div>
                 <i class="ion ion-ios-close-outline font-18 mr-20 cursor-pointer removesendwhatsappoutresp" id=${sendwhatsappoutresponercount}></i>  
  
</div>`;
    $(".divconsendoutwhatsappresp").append(addfieldsinput);



    $(".removesendwhatsappoutresp").click(function () {

        let id = parseInt($(this).attr("id"));
        sendwhatsappoutresponerArray = sendwhatsappoutresponerArray.filter(item => item !== id);
        $(this).parent().remove();
    });
    $('#ui_sendwhatsappoutrespcontactfields_' + sendwhatsappoutresponercount + ', #ui_ddl_conwhatsappTemplate_' + sendwhatsappoutresponercount).select2({
        minimumResultsForSearch: '',
        dropdownAutoWidth: false,
        containerCssClass: "border"
    });

    ApiImportResponsesSettingUtil.BindLeadProperties(sendwhatsappoutresponercount);
    ApiImportResponsesSettingUtil.BindSendwhatsappOutResponderTemp(sendwhatsappoutresponercount);

    //HidePageLoading();
});
$("#addAssignStage").click(function () {

    assignstagecount++;
    assignstageArray.push(assignstagecount);
    let addfieldsinput = `<div class="row position-relative">
    <div class="col-sm-2">
                            <div class="form-group">
                                <label for="" class="frmlbltxt">Fields</label>
                                <select class="form-control select2drpdwnbrd select2drpdwnbrdfield" name="" id="ui_AssignStagefields_${assignstagecount}" data-placeholder="Add Fields">
                                    <option value="0">Select</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-2">
                            <div class="form-group">
                                <label for="" class="frmlbltxt">Value</label>
                                <input type="text" name="" class="form-control form-control-sm frmlbltxtvalue" id="ui_AssignStagevalue_${assignstagecount}">
                            </div>
                        </div>
                        <div class="col-sm-2">
                            <div class="form-group">
                                <label class="frmlbltxt" for="">Stage</label>

                                <select class="form-control form-control-sm notspecificbtn select2 ddlassignstage" id="ui_ddl_conAssignStage_${assignstagecount}">
                                    <option value="0">Select</option>
                                </select>
                            </div>
                        </div>
                    
                  <i class="ion ion-ios-close-outline font-18 mr-20 cursor-pointer removeAssignStage" id=${assignstagecount}></i>   
  
</div>`;
    $(".divconAssignStage").append(addfieldsinput);



    $(".removeAssignStage").click(function () {

        let id = parseInt($(this).attr("id"));
        assignstageArray = assignstageArray.filter(item => item !== id);
        $(this).parent().remove();
    });
    $('#ui_AssignStagefields_' + assignGroupcount + ', #ui_ddl_conAssignStage_' + assignGroupcount).select2({
        minimumResultsForSearch: '',
        dropdownAutoWidth: false,
        containerCssClass: "border"
    });

    ApiImportResponsesSettingUtil.BindLeadProperties(assignstagecount);
    ApiImportResponsesSettingUtil.BindStagelistProperties(assignstagecount);
    //HidePageLoading();
});
$("#addAssignGroup").click(function () {

    assignGroupcount++;
    assignGroupArray.push(assignGroupcount);
    let addfieldsinput = `<div class="row position-relative">
    <div class="col-sm-2">
                            <div class="form-group">
                                <label for="" class="frmlbltxt">Fields</label>
                                <select class="form-control select2drpdwnbrd select2drpdwnbrdfield" name="" id="ui_AssignGroupfields_${assignGroupcount}" data-placeholder="Add Fields">
                                    <option value="0">Select</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-2">
                            <div class="form-group">
                                <label for="" class="frmlbltxt">Value</label>
                                <input type="text" name="" class="form-control form-control-sm frmlbltxtvalue" id="ui_AssignGroupvalue_${assignGroupcount}">
                            </div>
                        </div>
                        <div class="col-sm-2">
                            <div class="form-group">
                                <label class="frmlbltxt" for="">Group</label>

                                <select class="form-control form-control-sm notspecificbtn select2 ddlassignGroup" id="ui_ddl_conAssignGroup_${assignGroupcount}">
                                    <option value="0">Select</option>
                                </select>
                            </div>
                        </div>
                    
                  <i class="ion ion-ios-close-outline font-18 mr-20 cursor-pointer removeAssignGroup" id=${assignGroupcount}></i>   
  
</div>`;
    $(".divconAssignGroup").append(addfieldsinput);



    $(".removeAssignGroup").click(function () {

        let id = parseInt($(this).attr("id"));
        assignGroupArray = assignGroupArray.filter(item => item !== id);
        $(this).parent().remove();
    });
    $('#ui_AssignGroupfields_' + assignGroupcount + ', #ui_ddl_conAssignGroup_' + assignGroupcount).select2({
        minimumResultsForSearch: '',
        dropdownAutoWidth: false,
        containerCssClass: "border"
    });

    ApiImportResponsesSettingUtil.BindLeadProperties(assignGroupcount);
    ApiImportResponsesSettingUtil.BindGrouplist(assignGroupcount);
    //HidePageLoading();
});
$("#addisincludedleads").click(function () {

    isincludedleadscount++;
    IsIncludedLeadArray.push(isincludedleadscount);
    let addfieldsinput = `<div class="row position-relative">
    <div class="col-sm-2">
                            <div class="form-group">
                                <label for="" class="frmlbltxt">Fields</label>
                                <select class="form-control select2drpdwnbrd select2drpdwnbrdfield" name="" id="ui_Includedcontactfields_${isincludedleadscount}" data-placeholder="Add Fields">
                                    <option value="0">Select</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-2">
                            <div class="form-group">
                                <label for="" class="frmlbltxt">Value</label>
                                <input type="text" name="" class="form-control form-control-sm frmlbltxtvalue" id="ui_Includedvalue_${isincludedleadscount}">
                            </div>
                        </div>
                          
                        <i class="ion ion-ios-close-outline font-18 mr-20 cursor-pointer removeisincludedleads" id=${isincludedleadscount}></i>
            </div>`;
    $(".divincludedlead").append(addfieldsinput);



    $(".removeisincludedleads").click(function () {

        let id = parseInt($(this).attr("id"));
        IsIncludedLeadArray = IsIncludedLeadArray.filter(item => item !== id);
        $(this).parent().remove();
    });
    $('#ui_Includedcontactfields_' + isincludedleadscount).select2({
        minimumResultsForSearch: '',
        dropdownAutoWidth: false,
        containerCssClass: "border"
    });

    ApiImportResponsesSettingUtil.BindLeadProperties(isincludedleadscount);

    /*HidePageLoading();*/
});
$("#addis_Excludedleads").click(function () {

    isexcludedleadscount++;
    IsExcludedLeadArray.push(isexcludedleadscount);
    let addfieldsinput = `<div class="row position-relative">
    <div class="col-sm-2">
                            <div class="form-group">
                                <label for="" class="frmlbltxt">Fields</label>
                                <select class="form-control select2drpdwnbrd select2drpdwnbrdfield" name="" id="ui_Excludedcontactfields_${isexcludedleadscount}" data-placeholder="Add Fields">
                                    <option value="0">Select</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-2">
                            <div class="form-group">
                                <label for="" class="frmlbltxt">Value</label>
                                <input type="text" name="" class="form-control form-control-sm frmlbltxtvalue" id="ui_Excludedvalue_${isexcludedleadscount}">
                            </div>
                        </div>
                          
                        <i class="ion ion-ios-close-outline font-18 mr-20 cursor-pointer removeisexcludedleads" id=${isexcludedleadscount}></i>
            </div>`;
    $(".divExcludedlead").append(addfieldsinput);



    $(".removeisexcludedleads").click(function () {

        let id = parseInt($(this).attr("id"));
        IsExcludedLeadArray = IsExcludedLeadArray.filter(item => item !== id);
        $(this).parent().remove();
    });
    $('#ui_Excludedcontactfields_' + isexcludedleadscount).select2({
        minimumResultsForSearch: '',
        dropdownAutoWidth: false,
        containerCssClass: "border"
    });

    ApiImportResponsesSettingUtil.BindLeadProperties(isexcludedleadscount);

    /*HidePageLoading();*/
});

function Bindsendmailoutresponder() {
    $("#dvConditionalmailoutresp").hide();
    $("#dvUnConditionalmailoutresp").hide();

    if ($("#ui_chkUnConditionalmailoutresp").is(":checked")) {
        $("#dvUnConditionalmailoutresp").show();
        $("#dvConditionalmailoutresp").hide();
    }
    else {
        $("#dvConditionalmailoutresp").show();
        $("#dvUnConditionalmailoutresp").hide();
    }
}
function Bindsendsmsoutresponder() {
    $("#dvConditionalsmsoutresp").hide();
    $("#dvUnConditionalsmsoutresp").hide();

    if ($("#ui_chkUnConditionalsmsoutresp").is(":checked")) {
        $("#dvUnConditionalsmsoutresp").show();
        $("#dvConditionalsmsoutresp").hide();
    }
    else {
        $("#dvConditionalsmsoutresp").show();
        $("#dvUnConditionalsmsoutresp").hide();
    }
}
function Bindsendwhatsappoutresponder() {
    $("#dvConditionalwhatsappoutresp").hide();
    $("#dvUnConditionalwhatsappoutresp").hide();

    if ($("#ui_chkUnConditionalwhatsappoutresp").is(":checked")) {
        $("#dvUnConditionalwhatsappoutresp").show();
        $("#dvConditionalwhatsappoutresp").hide();
    }
    else {
        $("#dvConditionalwhatsappoutresp").show();
        $("#dvUnConditionalwhatsappoutresp").hide();
    }
}
function BindAssignStage() {
    $("#dvConditionalAssignStage").hide();
    $("#dvUnConditionalAssignStage").hide();

    if ($("#ui_chkUnConditionalAssignStage").is(":checked")) {
        $("#dvUnConditionalAssignStage").show();
        $("#dvConditionalAssignStage").hide();
    }
    else {
        $("#dvConditionalAssignStage").show();
        $("#dvUnConditionalAssignStage").hide();
    }
}
function BindAssignGroup() {
    $("#dvConditionalAssignGroup").hide();
    $("#dvUnConditionalAssignGroup").hide();

    if ($("#ui_chkUnConditionalAssignGroup").is(":checked")) {
        $("#dvUnConditionalAssignGroup").show();
        $("#dvConditionalAssignGroup").hide();
    }
    else {
        $("#dvConditionalAssignGroup").show();
        $("#dvUnConditionalAssignGroup").hide();
    }
}
$('#frmrepassgnsalper').click(function () {
    if ($('#frmrepassgnsalper').prop('checked') == true && $('#frmrepoverridesource').prop('checked') == false) {
        $('#frmrepoverridesource').click();
    }
    else if ($('#frmrepassgnsalper').prop('checked') == false && $('#frmrepoverridesource').prop('checked') == true) {
        $('#frmrepoverridesource').click();
    }
});

$('#frmrepoverridesource').click(function () {

    if ($('#frmrepassgnsalper').prop('checked') == true && $('#frmrepoverridesource').prop('checked') == false) {
        $('#frmrepassgnsalper').click();
    }
    else if ($('#frmrepassgnsalper').prop('checked') == false && $('#frmrepoverridesource').prop('checked') == true) {
        $('#frmrepassgnsalper').click();
    }
    GetLmssourcetype();
});


function GetLmssourcetype() {
    $.ajax({
        url: "/Prospect/LeadSource/GetLmsSorceType",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var data = response[0];
            if (data !== undefined) {
                if (data.Type == 0)
                    $('#lmsStaySource').attr('checked', true);
                else if (data.Type == 1)
                    $('#lmsOverrideSource').attr('checked', true);
                else if (data.Type == 2)
                    $('#lmsNewSource').attr('checked', true);
            }
        },
        error: function (error) {
            HidePageLoading();
        }
    });
}

$(document).on('click', '.dropdwntabs3', function () {
    /*$('.dropdwntabs3').click(function () {*/
    let attrbidval = $(this).attr("data-tabcontid");
    if (attrbidval.indexOf("userattr") > -1) {
        $("#userattrheader_" + attrbidval.slice(-1) + "").addClass("active");
        $("#customeveheader_" + attrbidval.slice(-1) + "").removeClass("active");
    }
    else {
        $("#userattrheader_" + attrbidval.slice(-1) + "").removeClass("active");
        $("#customeveheader_" + attrbidval.slice(-1) + "").addClass("active");
    }
    $("#userattr_" + attrbidval.slice(-1) + "").addClass("hideDiv");
    $("#customeve_" + attrbidval.slice(-1) + "").addClass("hideDiv");

    $("#" + attrbidval).removeClass("hideDiv");

});
$(document).on('change', '#draganddropuncustomtitle', function () {
    var id = $(this).attr("data-index");
    if (this.value != "Select") {
        let cursorPos = $('#ui_txt_conMailSubject_' + id).prop('selectionStart');
        let MessageContent = $('#ui_txt_conMailSubject_' + id).val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let customField = "[{*" + this.value + "*}]";
        let newMessageContent = textBefore + customField + textAfter;
        $('#ui_txt_conMailSubject_' + id).val(newMessageContent);

    }
}
);

$(document).on('change', '[id^="eventitemsconditionalsubject"]', function () {
    var id = $(this).attr("data-index");
    if (this.value != "Select") {
        let cursorPos = $('#ui_txt_conMailSubject_' + id).prop('selectionStart');
        let MessageContent = $('#ui_txt_conMailSubject_' + id).val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let customField = " {{*[" + eventname + "]~[" + this.value + "]~[TOP1.DESC]~[fallbackdata]*}} ";
        let newMessageContent = textBefore + customField + textAfter;
        $('#ui_txt_conMailSubject_' + id).val(newMessageContent);

    }
});
function Intializedropdownselect() {

    $(".addCampName").select2({
        minimumResultsForSearch: "",
        dropdownAutoWidth: false,
    });

}
$(document).on('click', '.mailsubdrp', function () {
    $(this).next(".browse-dropdown-menu").addClass("showDiv");
}
);
$(document).on('click', '.mailsubiconuncondi .ion-close-circled', function () {

    $(this).parent().removeClass("showDiv");
});
$("#ui_ddl_conAssignGroup_1,#ui_ddl_conAssignStage_1,#ui_ddl_conSmsTemplate_1,#ui_ddl_conwhatsappTemplate_1").select2({
    minimumResultsForSearch: "",
    dropdownAutoWidth: false,
});