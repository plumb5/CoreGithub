var adsId, SMSTemplateId;
var templateUrlsList = Array();
var customFieldList = [];
var smsTemplateUrl = { Id: 0, SmsTemplateId: 0, UrlContent: "" };
//var regx_unicode_pattern = '[^a-zA-Z0-9@£$¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&()*+,-.\/:;<=>\?\\¡ÄÖÑÜ§¿äöñüà\^\{\}\[~\]\|€\r\n\']+/u';
var regx_unicode_pattern = '[^\u0000-\u00ff]';
var regex_checkalphabets = /[a-zA-Z]/;
var SmsUploadTemplate = { Id: 0, SmsCampaignId: 0, Name: "", MessageContent: "", LandingPageType: "", ProductGroupName: "", ConvertLinkToShortenUrl: false };
var mailTemplateList = [];
var TempId = 0;
var DLTRequired = false;
var EditCopyAction = "";
var CopyTempId = 0;
var ispromotionalortransactionaltype;
var isConvertLinkToShortenUrl = false;

$(document).ready(function () {
    DragDroReportUtil.Getlmscustomfields();
    DragDroReportUtil.GetReport();
    GetContactFielddragdrop();
    BindUrlEventMappingDetails('');
    templatename = 'sms';
    /*GetContactFields();*/
    SmsUploadTemplate.Id = SMSTemplateId = parseInt(urlParam("TemplateId"));
    SmsUploadTemplate.Name = location.href.split("TemplateName").slice(1)[0];
    if (SmsUploadTemplate.Name != undefined || SmsUploadTemplate.Name != null)
        $("#ui_span_TemplateName").text(decodeURI(SmsUploadTemplate.Name).replace("=", ""));

    //if (SmsUploadTemplate.Id != 0) {
    //    $(".pagetitle").html("Update SMS Template");
    //    $("#ui_span_TemplateName").html(urlParam("TemplateName"));
    //    GetTemplateDetail();
    //}

    if (urlParam("Action") == 'edit') {
        $(".pagetitle").html("Update SMS Template");
        $(".totalCountTitle").removeClass("hideDiv");
        GetTemplateDetail();
    }
    else if (urlParam("Action") == 'copy') {
        $(".pagetitle").html("Duplicate SMS Template");
        $(".totalCountTitle").removeClass("hideDiv");
        GetTemplateDetail();
    }
    else {
        $(".pagetitle").html("Create SMS Template");
        BindDLTRequired();
    }

    HidePageLoading();
});

function CreateEditTemplate(id, CampaignId, name, description, DLTUploadMessageFile, IsPromotionalOrTransactionalType) {
    TempId = id;
    ispromotionalortransactionaltype = IsPromotionalOrTransactionalType;
    $("#ui_div_CreateEditSmsTemplate").removeClass("hideDiv");
    if (id == 0) {
        $("#ui_dllCampaign").attr('disabled', false);
        $("#ui_dllCampaign").select2().val(0).trigger('change');
        $('.popuptitle h6').html("Create Template");
        $("#txtTemplatName").val("");
        $("#txtTemplatDescription").val("");
        $("#txtVendorTemplateId").val("");
    } else if (id > 0) {
        $("#ui_dllCampaign").select2().val(CampaignId).trigger('change');
        $("#ui_dllCampaign").attr('disabled', true);
        $("#ui_div_CreateEditSmsTemplate .popuptitle h6").html("EDIT TEMPLATE");
        $("#txtTemplatName").val(name);
        $("#txtTemplatDescription").val(description == 'null' ? "" : description);
        if (IsPromotionalOrTransactionalType == true) {
            $("#smsmailtrans").prop("checked", true);
        } else {
            $("#smsmailpromo").prop("checked", true);
        }
        $(".appndfile").html(DLTUploadMessageFile == 'null' ? "" : DLTUploadMessageFile);
    }
};

//Duplicate template
function DuplicateTemplate(id, CampaignId, name, description, DLTUploadMessageFile, IsPromotionalOrTransactionalType) {
    CopyTempId = id;
    EditCopyAction = 'Copy';
    ispromotionalortransactionaltype = IsPromotionalOrTransactionalType;
    var templatename = name + "_COPY";
    templatename = templatename.length > 50 ? templatename.substring(0, 50) : templatename;
    $("#ui_div_CreateEditSmsTemplate .popuptitle h6").html("DUPLICATE TEMPLATE");
    $("#ui_div_CreateEditSmsTemplate").removeClass("hideDiv");
    $("#ui_dllCampaign").select2().val(CampaignId).trigger('change');
    $("#txtTemplatName").val(templatename);
    $("#txtTemplatDescription").val(description == 'null' ? "" : description);
    if (IsPromotionalOrTransactionalType == true) {
        $("#smsmailtrans").prop("checked", true);
    } else {
        $("#smsmailpromo").prop("checked", true);
    }
    $(".appndfile").html(DLTUploadMessageFile == 'null' ? "" : DLTUploadMessageFile);
}


$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
});

function CreateTemplateNext() {
    if (TempId > 0 || CopyTempId > 0) {
        CreateTemplate();
    } else {
        CheckSmsTemplateExists();
    }
}

function CreateNewTemplate() {
    TempId = 0; CopyTempId = 0;
    CreateEditTemplate(0);
}

function CheckSmsTemplateExists() {

    if ($("#ui_dllCampaign").val() == "0") {
        ShowErrorMessage(GlobalErrorList.SmsTemplate.campaignList);
        return false;
    }

    if ($.trim($("#txtTemplatName").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.SmsTemplate.TemplateName);
        return false;
    }

    if ($.trim($("#txtTemplatDescription").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.SmsTemplate.TemplateDescription);
        return false;
    }
    ShowPageLoading();
    $.ajax({
        url: "/Sms/Template/GetTemplate",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'TemplateName': $("#txtTemplatName").val() }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: CheckandPop,
        error: ShowAjaxError
    });
}

var ExistingData;
function CheckandPop(response) {
    if (response != undefined && response != null) {
        ExistingData = response;
        HidePageLoading();
        $("#tempexistmod").modal("show");

    } else {
        CreateTemplate();
    }
}

$(document).on('click', '#archiverestore', function () {
    TempId = ExistingData.Id;
    if (ExistingData.SmsCampaignId > 0) {
        $("#ui_dllCampaign").val(ExistingData.SmsCampaignId).change();
    } else {
        $("#ui_dllCampaign").val("0").change();
    }

    if (ExistingData.Name != undefined && ExistingData.Name != null && ExistingData.Name != "") {
        $("#txtTemplatName").val(ExistingData.Name);
    } else {
        $("#txtTemplatName").val("");
    }

    if (ExistingData.Description != undefined && ExistingData.Description != null && ExistingData.Description != "") {
        $("#txtTemplatDescription").val(ExistingData.Description);
    } else {
        $("#txtTemplatDescription").val("");
    }

    if (DLTRequired == false) {
        if (ExistingData.IsPromotionalOrTransactionalType == false) {
            $("#smsmailtrans").prop('checked', false);
            $("#smsmailpromo").prop('checked', true);
        } else {
            $("#smsmailpromo").prop('checked', false);
            $("#smsmailtrans").prop('checked', true);
        }
    }

    UpdateTemplateStatus(ExistingData.Id);
});

function UpdateTemplateStatus(TemplateId) {
    ShowPageLoading();
    $.ajax({
        url: "/Sms/Template/UpdateTemplateStatus",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'TemplateId': TemplateId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                $("#tempexistmod").modal("hide");
                ShowSuccessMessage(GlobalErrorList.SmsTemplate.TemplateRestoredSuccess);
            } else {
                ShowErrorMessage(GlobalErrorList.SmsTemplate.TemplateRestored);
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}

function CreateTemplate() {

    if ($("#ui_dllCampaign").val() == "0") {
        ShowErrorMessage(GlobalErrorList.SmsTemplate.campaignList);
        return false;
    }

    if ($.trim($("#txtTemplatName").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.SmsTemplate.TemplateName);
        return false;
    }

    if ($.trim($("#txtTemplatDescription").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.SmsTemplate.TemplateDescription);
        return false;
    }

    let IsPromotionalOrTransactionalType = null;
    if (DLTRequired == false) {
        if ($('#smsmailpromo').is(':checked')) {
            IsPromotionalOrTransactionalType = false;
        } else {
            IsPromotionalOrTransactionalType = true;
        }
    } else {
        IsPromotionalOrTransactionalType = ispromotionalortransactionaltype;
    }

    let TemplateName = $.trim($("#txtTemplatName").val());
    ShowPageLoading();

    var tmpData = { 'Id': TempId, 'SmsCampaignId': parseInt($("#ui_dllCampaign").val()), 'Name': $("#txtTemplatName").val(), 'Description': $("#txtTemplatDescription").val(), 'VendorTemplateId': $("#txtVendorTemplateId").val() != undefined ? $("#txtVendorTemplateId").val() : "", 'DLTUploadMessageFile': $(".appndfile").html(), 'IsPromotionalOrTransactionalType': IsPromotionalOrTransactionalType };
    $.ajax({
        url: "/Sms/UploadTemplate/CreateTemplate",
        type: 'POST',
        data: JSON.stringify({ 'smsTemplate': tmpData }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status == true) {
                if (DLTRequired == true) {
                    if (TempId > 0) {
                        var data = TempId != 0 ? "?Action=Edit&TemplateId=" + TempId + "&DltNewFile=true&TemplateName=" + TemplateName : "?DltNewFile=true&TemplateName=" + TemplateName;
                        window.location.href = '/Sms/UploadTemplate' + data;
                    } else {
                        if (EditCopyAction == 'Copy') {
                            var data = CopyTempId != 0 ? "?Action=Copy&TemplateId=" + CopyTempId + "&TemplateName=" + encodeURI(TemplateName) : "?TemplateName=" + encodeURI(TemplateName);
                            window.location.href = '/Sms/UploadTemplate' + data;
                        }
                        else {
                            $("#ui_div_CreateEditSmsTemplate").addClass("hideDiv");
                            $("#ui_div_UploadDltSmsTemplate").removeClass("hideDiv");
                        }
                    }
                } else {
                    if (EditCopyAction == 'Copy')
                        var data = CopyTempId != 0 ? "?Action=Copy&TemplateId=" + CopyTempId + "&TemplateName=" + encodeURI(TemplateName) : "?TemplateName=" + encodeURI(TemplateName);
                    else
                        var data = TempId != 0 ? "?Action=Edit&TemplateId=" + TempId + "&TemplateName=" + encodeURI(TemplateName) : "?TemplateName=" + encodeURI(TemplateName);

                    window.location.href = '/Sms/UploadTemplate' + data;
                }

            } else {
                ShowErrorMessage(GlobalErrorList.SmsTemplate.TemplateExists);
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}


$("#ui_btnCreateTemplate").click(function () {
    ShowPageLoading();
    if (!Validate()) {
        HidePageLoading();
        return;
    }
    if (urlParam("Action") == 'copy') {
        SmsUploadTemplate.Id = 0;
    }

    SmsUploadTemplate.SmsCampaignId = $("#ui_txtMailCampaign").attr("mailcampaignid") != undefined ? $("#ui_txtMailCampaign").attr("mailcampaignid") : 0;
    SmsUploadTemplate.Name = $.trim($("#txtTemplatName").val());
    SmsUploadTemplate.MessageContent = AppendCustomField($.trim($("#ui_txtMessageTemplate").val()));

    if ($("#ui_chkConvertLinkToShortenUrl").is(":checked"))
        SmsUploadTemplate.ConvertLinkToShortenUrl = true;
    else
        SmsUploadTemplate.ConvertLinkToShortenUrl = false

    $.ajax({
        url: "/sms/UploadTemplate/SaveOrUpdateTemplate",
        type: 'POST',
        data: JSON.stringify({ 'smsTemplateData': SmsUploadTemplate, 'smsTemplateUrlsData': templateUrlsList }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            var result = response.data;
            if (result.Id > 0 && response.status == true) {

                if (SmsUploadTemplate.Id == 0) {
                    ShowSuccessMessage(GlobalErrorList.SmsTemplate.TemplateCreationSuccess);
                    location.href = '/Sms/Template';
                }
                else {
                    ShowSuccessMessage(GlobalErrorList.SmsTemplate.TemplateUpdateSuccess);
                }

            }
            else if (result.Id == -1) {
                ShowErrorMessage(GlobalErrorList.SmsTemplate.TemplateExists);
            }
            else {
                ShowErrorMessage(GlobalErrorList.SmsTemplate.UpdateIssue);
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});
function Validate() {

    if ($.trim($("#ui_txtMessageTemplate").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.SmsTemplate.Message);
        return false;
    }

    if (!regex_checkalphabets.test($("#ui_txtMessageTemplate").val())) {
        ShowErrorMessage(GlobalErrorList.SmsTemplate.ContentUrl);
        return false;
    }
    var htmlContent = $.trim($("#ui_txtMessageTemplate").val());
    if (htmlContent != null) {
        var contactmatchrecord = [];
        var productmatchrecord = [];
        var matches = htmlContent.match(/\[\{\*(.*?)\*\}\]/g);
        var maxindex = 0;
        if (matches != null) {
            for (i = 0; i < matches.length; i++) {
                var replctxt = matches[i].replace("[{*", "").replace("*}]", "");
                if (matches[i].includes("_")) {

                    var txt = replctxt.split('_');
                    if ((productmatchrecord.indexOf(txt[0])) < 0) {
                        productmatchrecord.push(txt[0]);
                    }
                    var isnum = /^\d+$/.test(txt[1]);
                    if (isnum) {
                        if (parseInt(txt[1]) > parseInt(maxindex)) {
                            maxindex = txt[1];
                        }
                    }
                    else {
                        PindexisonlyNum = false;
                        break;
                    }

                }
                else if (matches[i].includes("-")) {
                    var isnum = /^\d+$/.test(replctxt.split('-')[0].substring(4));
                    if (!isnum) {
                        CouponNum = false;
                    }
                }
                else {
                    var isnum = /^\d+$/.test(replctxt);//check for append url tagging
                    if (!isnum) {
                        if ((contactmatchrecord.indexOf(replctxt)) < 0) {
                            contactmatchrecord.push(replctxt);
                        }
                    }

                }

            }


            if (parseInt(maxindex) > 8) {
                ShowErrorMessage(GlobalErrorList.SmsTemplate.MaxTag);
                return false;
            }
            //----check contact tag should be genuine------//
            var IsContactTagGenuine = true;
            var CList = JSLINQ($('#draganddropcutomre_dlt option')).Select(function (P) { return $.trim(P.innerText).toLowerCase().replace("[{*", "").replace("*}]", ""); }).ToArray();
            for (var i = 0; i < contactmatchrecord.length; i++) {
                if (!(contactmatchrecord[i].toLowerCase().includes("userinfo^firstname")) && !(contactmatchrecord[i].toLowerCase().includes("userinfo^emailid")) && !(contactmatchrecord[i].toLowerCase().includes("userinfo^mobilephone")) && !(contactmatchrecord[i].toLowerCase().includes("userinfo^lastname"))) {
                    var _contactmatchrecord = contactmatchrecord[i].split('&')
                    for (var k = 0; k < _contactmatchrecord.length; k++) {
                        if (CList.indexOf(_contactmatchrecord[k].replace(/\~.*/g, "").toLowerCase()) < 0) {
                            IsContactTagGenuine = false;
                            break;
                        }
                    }

                }

            }
            if (!IsContactTagGenuine) {
                ShowErrorMessage(GlobalErrorList.SmsTemplate.TemplateTag);
                return false;
            }


        }


    }

    return true;
}
function GetTemplateDetail() {
    $.ajax({
        url: "/SMS/Template/GetTemplateDetails",
        type: 'POST',
        data: JSON.stringify({ 'smsTemplate': SmsUploadTemplate }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.Id > 0) {
                var MessageBody = "";
                if (urlParam("DltNewFile") == "true" && SmsUploadTemplate.Id > 0) {
                    MessageBody = ReplaceCustomFields(response.MessageContent);
                } else {

                    MessageBody = urlParam("DltNewFile") != 0 ? ReplaceCustomFields($("#ui_txtMessageTemplate").val()) : ReplaceCustomFields(response.MessageContent);
                }

                $("#ui_txtMessageTemplate").val(MessageBody);
                calculatelength($("#ui_txtMessageTemplate").val(), "N");

                if (response.ConvertLinkToShortenUrl)
                    $("#ui_chkConvertLinkToShortenUrl").prop("checked", true);
                else
                    $("#ui_chkConvertLinkToShortenUrl").prop("checked", false);

                //if (urlParam("DltNewFile") == 0)
                //    BindDltTagging(MessageBody);
            }

            BindDLTRequired();
        },
        error: ShowAjaxError
    });

}

$("#ui_txtMessageTemplate").keyup(function () {
    let MessageContent = $("#ui_txtMessageTemplate").val();
    let str = PreviewSupport(MessageContent);

    if (str.length > 1500) {
        let removeString = str.length - 1500;
        NewMessage = MessageContent.slice(0, -removeString);
        $("#ui_txtMessageTemplate").val(NewMessage);
        ShowErrorMessage(GlobalErrorList.SmsTemplate.ThousandFiveHundredError);
    } else {
        calculatelength($(this).val(), "N");
    }
});
function calculatelength(str, type) {
    str = PreviewSupport(str);
    var patt = new RegExp(regx_unicode_pattern);
    var res = patt.test(str);
    if (res) {
        type = "U";
    }

    var len = str.length;
    var udh = 153,
        sms = 160,
        unicode = false,
        credits = 1;

    if ((res || type == 'U') && type != 'N') {
        udh = 67;
        sms = 70;
        unicode = true
    }

    if (len == 160 && !unicode) {
        credits = Math.ceil(len / sms);
    } else if (len == 70 && unicode) {
        credits = Math.ceil(len / sms);
    } else if (len > sms) {
        credits = Math.ceil(len / udh);
    }

    var d = {
        credits: credits,
        len: len,
        unicode: unicode
    }

    var urlCount = str.match(/<!/g);
    if (urlCount == null)
        urlCount = [];
    $("#ui_lblTotalUrl").html(urlCount.length);
    $("#ui_character").html(d.len);
    $("#ui_MessageCount").html(d.credits);


    //$('.current-count span').text(1500 - d.len);
    $(".mesinbxcont").text(str);
}

function GetContactFields() {
    $.ajax({
        url: "/SMS/ContactField/GetAllFieldDetails",
        type: 'Post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindContactFields,
        error: ShowAjaxError
    });
}
var customeventFieldList = [];
function BindUrlEventMappingDetails() {
    //customeventFieldList = [];
    ShowPageLoading();
    async: true,
        //    $(".popupcontainer").removeClass("hideDiv");
        //$(".popuptitlwrp h6").text("Event Extra Fields Properties");



        $.ajax({
            url: "/CustomEvents/CustomEventsOverview/GetAllEventExtraFieldDataForDragDrop",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'customEventOverViewId': 0, 'fromDateTime': null, 'toDateTime': null, 'contactid': 0 }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var a = JSLINQ(response).Distinct(function (item) { return item.EventName }).items

                for (var i = 0; i < a.length; i++) {
                    var b = JSLINQ(response).Where(function () { return (this.EventName == a[i]); });
                    var eachcolumn = []
                    eachcolumn.push(b.items[0].EventName);
                    for (var j = 0; j < b.items.length; j++) {
                        eachcolumn.push(b.items[j].FieldName)
                    }
                    customeventFieldList.push(eachcolumn);

                }

                smsUrlUtil.GetSmsUrl(SMSTemplateId);
                HidePageLoading();
            },
            error: ShowAjaxError
        });
}
BindContactFields = function (fieldList) {

    if (fieldList.length > 0) {
        $.each(fieldList, function (i) {
            //$("#draganddropcutomre").append('<option value="' + $(this)[0].FieldName + '">' + $(this)[0].FieldName + '</option>');
            $("#draganddropcutomre_dlt").append('<option value="' + $(this)[0].FieldName + '">' + $(this)[0].FieldName + '</option>');
            $("#draganddropcutomrerUrl_dlt").append('<option value="' + $(this)[0].FieldName + '">' + $(this)[0].FieldName + '</option>');
            customFieldList.push($(this)[0].FieldName);

        });
    }

}


function BindDLTRequired() {
    DLTRequired = false;
    $.ajax({
        url: "/SMS/UploadTemplate/CheckDLTRequired",
        type: 'POST',
        data: JSON.stringify({ 'adsId': Plumb5AccountId }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response != null) {
                if (response.Status == true) {
                    DLTRequired = true;
                    $("#ui_divContentType").addClass("hideDiv");
                    $("#ui_txtMessageTemplate").keyup();
                    $("#csvSelect").html("Selected File: ");

                    if (urlParam("DltNewFile") != 0) {
                        BindDltTagging($("#ui_txtMessageTemplate").val());
                        //$("#DltTest").removeClass("hideDiv");
                        $("#DltTag").removeClass("hideDiv");
                        $("#DltTag1").removeClass("hideDiv");

                        $("#dvTag").addClass("hideDiv");
                        $("#ui_btnCreateTemplate").removeClass("hideDiv");
                    }
                } else {
                    $("#ui_divContentType").removeClass("hideDiv");
                }
            } else {
                $("#ui_divContentType").removeClass("hideDiv");
            }
        },
        error: ShowAjaxError
    });
}


$('#draganddropcutomre').on('change', function () {
    if (this.value != "Select") {
        let cursorPos = $('#ui_txtMessageTemplate').prop('selectionStart');
        let MessageContent = $("#ui_txtMessageTemplate").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let str = PreviewSupport(MessageContent);
        if (str != null && str.length > 1500) {
            ShowErrorMessage(GlobalErrorList.SmsTemplate.ThousandFiveHundredError);
            return false;
        }

        let customField = `[{*${this.value}*}]`;
        let newMessageContent = textBefore + customField + textAfter;
        let newStr = PreviewSupport(newMessageContent);

        if (newStr != null && newStr.length > 1500) {
            ShowErrorMessage(GlobalErrorList.SmsTemplate.AfterReplacingContent);
            return false;
        } else {
            $('#ui_txtMessageTemplate').val(newMessageContent);
            calculatelength($("#ui_txtMessageTemplate").val(), "N");
        }
    }
});


$('#draganddropcutomre_dlt').on('change', function () {
    if (this.value != "Select" && $("#replacedraganddroptag_dlt").val() != "Select") {
        // let cursorPos = $('#ui_txtMessageTemplate').prop('selectionStart');
        let MessageContent = $("#ui_txtMessageTemplate").val();

        let str = PreviewSupport(MessageContent);
        if (str != null && str.length > 1500) {
            ShowErrorMessage(GlobalErrorList.SmsTemplate.ThousandFiveHundredError);
            return false;
        }



        let customField = `[{*${this.value}*}]`;
        $("#replacedraganddroptag_dlt").append('<option value="' + customField + '">' + customField + '</option>');
        $("#replacedraganddroptag_dltevent").append('<option value="' + customField + '">' + customField + '</option>');
        let newMessageContent = MessageContent.replace($("#replacedraganddroptag_dlt").val(), customField);
        let newStr = PreviewSupport(newMessageContent);

        if (newStr != null && newStr.length > 1500) {
            ShowErrorMessage(GlobalErrorList.SmsTemplate.AfterReplacingContent);
            return false;
        } else {
            $('#ui_txtMessageTemplate').val(newMessageContent);
            calculatelength($("#ui_txtMessageTemplate").val(), "N");
        }
        var getindx = $("#replacedraganddroptag_dlt option[value='" + $("#replacedraganddroptag_dlt").val() + "']").index()
        $("#replacedraganddroptag_dlt option:eq(" + getindx + ")").remove();
        $("#replacedraganddroptag_dltevent option:eq(" + getindx + ")").remove();

        $("#draganddropcutomre_dlt").select2().val('Select').trigger('change');
    }
});

$('#draganddropcutomrerUrl_dlt').on('change', function () {
    if (this.value != "Select") {
        let cursorPos = $('#txtShortenUrl').prop('selectionStart');
        let MessageContent = $("#txtShortenUrl").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);


        let customField = `[{*${this.value}*}]`;
        let newMessageContent = textBefore + customField + textAfter;

        $('#txtShortenUrl').val(newMessageContent);
    }
});

$('#eventitemsmessage').on('change', function () {
    if (this.value != "Select") {
        let cursorPos = $('#txtShortenUrl').prop('selectionStart');
        let MessageContent = $("#txtShortenUrl").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);


        let customField = " {{*[" + eventname + "]~[" + this.value + "]~[TOP1.DESC]~[fallbackdata]*}}";
        let newMessageContent = textBefore + customField + textAfter;

        $('#txtShortenUrl').val(newMessageContent);
    }

});
$('#eventitemstitle').on('change', function () {

    if (this.value != "Select" && $("#replacedraganddroptag_dltevent").val() != "Select") {

        let MessageContent = $("#ui_txtMessageTemplate").val();


        let str = PreviewSupport(MessageContent);
        if (str != null && str.length > 1500) {
            ShowErrorMessage(GlobalErrorList.SmsTemplate.ThousandFiveHundredError);
            return false;
        }



        let customField = " {{*[" + eventname + "]~[" + this.value + "]~[TOP1.DESC]~[fallbackdata]*}}";
        $("#replacedraganddroptag_dltevent").append('<option value="' + customField + '">' + customField + '</option>');
        $("#replacedraganddroptag_dlt").append('<option value="' + customField + '">' + customField + '</option>');


        let newMessageContent = MessageContent.replace($("#replacedraganddroptag_dltevent").val(), customField);
        let newStr = PreviewSupport(newMessageContent);

        if (newStr != null && newStr.length > 1500) {
            ShowErrorMessage(GlobalErrorList.SmsTemplate.AfterReplacingContent);
            return false;
        } else {
            $('#ui_txtMessageTemplate').val(newMessageContent);
            calculatelength($("#ui_txtMessageTemplate").val(), "N");
        }
        var getindx = $("#replacedraganddroptag_dltevent option[value='" + $("#replacedraganddroptag_dltevent").val() + "']").index()
        $("#replacedraganddroptag_dltevent option:eq(" + getindx + ")").remove();
        $("#replacedraganddroptag_dlt option:eq(" + getindx + ")").remove();
        $("#replacedraganddroptag_dltevent").select2().val('Select').trigger('change');
    }
});

function PreviewSupport(message) {
    var matches = message.match(/\[\{\*(.*?)\*\}\]/g);

    if (matches != null) {
        for (i = 0; i < matches.length; i++) {
            var id = matches[i].replace("[{*", "").replace("*}]", "");
            var isnum = /^\d+$/.test(id);
            if (isnum && JSLINQ(templateUrlsList).Any(function (P) { return P.Id == id })) {
                message = message.replace(matches[i], `${SMSCLICKURL}bl-`);
            }
            else {
                message = message.replace(matches[i], "xxxxxxxxxxxxxx");
            }

        }
    }
    var matchescstevents = message.match(/\{{.*?}\}/gi);

    if (matchescstevents != null) {
        for (i = 0; i < matchescstevents.length; i++) {
            message = message.replace(matchescstevents[i], "xxxxxxxxxxxxxx");
        }
    }
    $("#ui_dvMessageContentPreview").html(message);
    return message;
}



$(".devwrphvr").click(function () {
    var checkdevictabconid = $(this).attr("data-devtabcont");
    $(".devwrphvr").removeClass("active");
    $(".devsmsprev").addClass("hideDiv");
    $(this).addClass("active");
    $("#" + checkdevictabconid).removeClass("hideDiv");
});

$('.addCampName').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});


function selctoptval() {
    $('#ui_dllCampaign').select2({
        minimumResultsForSearch: '',
        dropdownAutoWidth: false
    });
}
function BindDltTagging(MessageBody) {

    var MessageBodyList = '';
    var MessageBodyListfortype2 = '';
    var MessageBodyListfortype3 = '';

    if (MessageBody.indexOf("{*") > -1)
        var MessageBodyList = MessageBody.split('{*');
    if (MessageBody.indexOf("[#") > -1)
        var MessageBodyListfortype2 = MessageBody.split('[#');
    if (MessageBody.indexOf("{#") > -1)
        var MessageBodyListfortype3 = MessageBody.split('{#');

    for (var i = 0; i < MessageBodyList.length; i++) {
        if (MessageBodyList[i].indexOf("<") > -1 || MessageBodyList[i].indexOf("{*") > -1 || MessageBodyList[i].indexOf("*}") > -1) {
            var smsVar = "";
            if (MessageBodyList[i].indexOf("*}]") > -1) {
                smsVar = "[{*" + MessageBodyList[i].substring(MessageBodyList[i].indexOf("*}]"), 0) + "*}]";
            }
            else if (MessageBodyList[i].indexOf("*}}") > -1) {
                smsVar = "{{*" + MessageBodyList[i].substring(MessageBodyList[i].indexOf("*}}"), 0) + "*}}";

            }
            $("#replacedraganddroptag_dlt").append('<option value="' + smsVar + '">' + smsVar + '</option>');

            $("#replacedraganddroptag_dltevent").append('<option value="' + smsVar + '">' + smsVar + '</option>');
        }
    }
    for (var i = 0; i < MessageBodyListfortype2.length; i++) {
        if (MessageBodyListfortype2[i].indexOf("<") > -1 || MessageBodyListfortype2[i].indexOf("#]") > -1) {
            if (MessageBodyListfortype2[i].indexOf("#]") > -1) {
                let smsVar = "[#" + MessageBodyListfortype2[i].substring(MessageBodyListfortype2[i].indexOf("#]"), 0) + "#]";
                $("#replacedraganddroptag_dlt").append('<option value="' + smsVar + '">' + smsVar + '</option>');
                $("#replacedraganddroptag_dltevent").append('<option value="' + smsVar + '">' + smsVar + '</option>');
            }


        }
    }
    for (var i = 0; i < MessageBodyListfortype3.length; i++) {
        if (MessageBodyListfortype3[i].indexOf("<") > -1 || MessageBodyListfortype3[i].indexOf("#}") > -1) {
            if (MessageBodyListfortype3[i].indexOf("#}") > -1) {
                let smsVar = "{#" + MessageBodyListfortype3[i].substring(MessageBodyListfortype3[i].indexOf("#}"), 0) + "#}";
                $("#replacedraganddroptag_dlt").append('<option value="' + smsVar + '">' + smsVar + '</option>');
                $("#replacedraganddroptag_dltevent").append('<option value="' + smsVar + '">' + smsVar + '</option>');

            }

        }
    }

}
function SendIndividualTestSMS() {

    if (CleanText($.trim($("#ui_txt_SmsIndividualPhoneNumber").val())).length == 0) {
        ShowErrorMessage(GlobalErrorList.CreateSMSTestCampaign.TestPhoneNumberError);
        return false;
    }

    var MessageContent = CleanText($.trim($("#ui_txtMessageTemplate").val()));
    if (CleanText($.trim($("#ui_txtMessageTemplate").val())).length == 0) {
        ShowErrorMessage(GlobalErrorList.CreateSMSTestCampaign.TestPhoneNumberError);
        return false;
    }

    var SmsTemplateId = $.urlParam("TemplateId");
    var PhoneNumber = $.trim($("#ui_txt_SmsIndividualPhoneNumber").val());

    MessageContent = AppendCustomField(MessageContent);

    if ($("#ui_chkConvertLinkToShortenUrl").is(":checked"))
        isConvertLinkToShortenUrl = true;
    else
        isConvertLinkToShortenUrl = false;

    ShowPageLoading();
    $.ajax({
        url: "/Sms/ScheduleCampaign/SendIndividualTestSMS",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'SmsTemplateId': SmsTemplateId, 'PhoneNumber': PhoneNumber, 'IsPromotionalOrTransactionalType': false, 'MessageContent': MessageContent, 'smsUrlList': templateUrlsList, 'ConvertLinkToShortenUrl': isConvertLinkToShortenUrl }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.SentStatus) {
                $("#DltTest").addClass("hideDiv");
                $("#ui_btnCreateTemplate").removeClass("hideDiv");
                $("#testdltsms").modal("hide");
                ShowSuccessMessage(GlobalErrorList.CreateSMSTestCampaign.TestDltMessageSuccess);
            }
            else {
                ShowErrorMessage(response.Message);
                $("#testdltsms").modal("hide");
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}
