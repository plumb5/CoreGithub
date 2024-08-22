
var webpushTemplate = { Id: 0, CampaignId: 0 };
var TempId = 0, TemplateName = "";
var txtMsgType = 1, CustomBadge = 0;
var icon = "", banner = "", badgeimage = "";
var urlregex = new RegExp("^(http:\/\/|https:\/\/){1}([0-9A-Za-z]+\.)");
let csteventregex = /\{{.*?}\}/gi;
let cstuserregex = /\[{.*?}\]/gi;
var duplicate = false;


$(document).ready(function () {
    DragDroReportUtil.BindUrlEventMappingDetails('');
    GetContactFielddragdrop('');
    DragDroReportUtil.GetReport();

    //GetContactFields();
    webpushTemplate.Id = urlParam("TemplateId");
    if (typeof DefaultIconfilePath != 'undefined') { icon = DefaultIconfilePath; }

    if (webpushTemplate.Id != 0) {
        $(".pagetitle").html("Update Template");
        if (urlParam("Duplicate") == "true") { $('.pagetitle').html("Enter Duplicate Template Information"); duplicate = true; }
        GetTemplateDetail();
    }

    if (urlParam("TemplateName") != null && urlParam("TemplateName") != undefined && urlParam("TemplateName").length > 0)
        $("#ui_span_TemplateName").text(decodeURI(urlParam("TemplateName")).replace("=", ""));

    BindAccountDomain();
    //HidePageLoading();
});

function CreateEditTemplate(id, CampaignId, name, description) {
    TempId = id, TemplateName = name;
    $("#ui_div_CreateEditTemplate").removeClass("hideDiv");

    if (id == 0) {
        $("#ui_dllCampaign").select2().val(0).trigger('change');
        $('#ui_div_CreateEditTemplate .popuptitle h6').html("Create Template");
        $("#txtTemplatName").val("");
        $("#txtTemplatDescription").val("");
    } else if (id > 0) {
        $("#ui_dllCampaign").select2().val(CampaignId).trigger('change');
        $('#ui_div_CreateEditTemplate .popuptitle h6').html("Edit Template");
        $("#txtTemplatName").val(name);
        $("#txtTemplatDescription").val(description == 'null' ? "" : description.replace(/%20/g, '\n'));
    }
}

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
});

function CreateTemplateNext() {

    if ($("#ui_dllCampaign").val() == "0") {
        ShowErrorMessage(GlobalErrorList.WebpushTemplate.campaignList);
        return false;
    }

    if ($.trim($("#txtTemplatName").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.WebpushTemplate.TemplateName);
        return false;
    }

    TemplateName = CleanText($("#txtTemplatName").val());

    if ((TempId > 0 && duplicate == true) || TempId > 0) {
        CreateTemplate();
    } else {
        CheckTemplateExists();
    }
}

function CreateTemplate() {
    ShowPageLoading();

    let webpushTemplate = {
        Id: TempId,
        CampaignId: parseInt($("#ui_dllCampaign").val()),
        TemplateName: $("#txtTemplatName").val(),
        TemplateDescription: $("#txtTemplatDescription").val()
    };

    $.ajax({
        url: "/WebPush/CreateTemplate/CreateTemplateNext",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'webpushTemplate': webpushTemplate }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status == true) {
                var data = TempId != 0 ? "?TemplateId=" + TempId + "&TemplateName=" + TemplateName : "";
                data += duplicate == true ? "&Duplicate=true" : "";

                window.location.href = '/WebPush/CreateTemplate' + data;
            } else {
                ShowErrorMessage(GlobalErrorList.WebpushTemplate.TemplateExists);
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}

function CheckTemplateExists() {
    ShowPageLoading();
    $.ajax({
        url: "/WebPush/Template/GetArchiveTemplate",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'TemplateName': $("#txtTemplatName").val() }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: CheckandPop,
        error: ShowAjaxError
    });
}

var ExistingData;
function CheckandPop(response) {
    if (response != undefined && response != null && response.Template != null) {
        ExistingData = response.Template;
        HidePageLoading();
        $("#tempexistmod").modal("show");

    } else {
        CreateTemplate();
    }
}

$(document).on('click', '#archiverestore', function () {
    TempId = ExistingData.Id;
    if (ExistingData.CampaignId > 0) {
        $("#ui_dllCampaign").val(ExistingData.CampaignId).change();
    } else {
        $("#ui_dllCampaign").val("0").change();
    }

    if (ExistingData.TemplateName != undefined && ExistingData.TemplateName != null && ExistingData.TemplateName != "") {
        $("#txtTemplatName").val(ExistingData.TemplateName);
    } else {
        $("#txtTemplatName").val("");
    }

    if (ExistingData.TemplateDescription != undefined && ExistingData.TemplateDescription != null && ExistingData.TemplateDescription != "") {
        $("#txtTemplatDescription").val(ExistingData.TemplateDescription);
    } else {
        $("#txtTemplatDescription").val("");
    }

    UpdateTemplateStatus(ExistingData.Id);
});

function UpdateTemplateStatus(TemplateId) {
    ShowPageLoading();
    $.ajax({
        url: "/WebPush/Template/UpdateArchiveStatus",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': TemplateId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                $("#tempexistmod").modal("hide");
                ShowSuccessMessage(GlobalErrorList.WebpushTemplate.TemplateRestoredSuccess);
            } else {
                ShowErrorMessage(GlobalErrorList.WebpushTemplate.TemplateRestored);
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}


function DuplicateTemplate(id, CampaignId, name, description) {
    TempId = id; duplicate = true;
    $("#ui_div_CreateEditTemplate").removeClass("hideDiv");
    $("#ui_dllCampaign").select2().val(CampaignId).trigger('change');
    $('#ui_div_CreateEditTemplate .popuptitle h6').html("Duplicate Template");
    $("#txtTemplatName").val(name + "_Copy");
    $("#txtTemplatDescription").val(description == 'null' ? "" : description.replace(/%20/g, '\n'));
}

$("#ui_btnCreateTemplate").click(function () {

    if (!Validate()) {
        return;
    }

    ShowPageLoading();

    webpushTemplate.NotificationType = txtMsgType;
    webpushTemplate.Title = AppendCustomField($.trim($("#ui_txtTitleTemplate").val()));
    webpushTemplate.MessageContent = AppendCustomField($.trim($("#ui_txtMessageTemplate").val().replace(/\n|\r/g, "").replace(/"/g, "“")));//replace(/\n|\r/g, "").replace(/"/g, "“"));dont remove this replace part
    webpushTemplate.IconImage = icon;
    webpushTemplate.OnClickRedirect = $.trim(AppendCustomField($("#txtRedirectUrl").val()));

    if (txtMsgType == 2) { webpushTemplate.BannerImage = banner; } else { webpushTemplate.BannerImage = ""; }
    if ($("#dvButtons").is(":visible")) {
        webpushTemplate.Button1_Label = $.trim($("#ui_txtButtonOne").val());
        webpushTemplate.Button1_Redirect = $.trim(AppendCustomField($("#ui_txtButtonOneRedirect").val()));
        if ($("#btnTab2").is(":visible")) {
            webpushTemplate.Button2_Label = $.trim($("#ui_txtButtonTwo").val());
            webpushTemplate.Button2_Redirect = $.trim(AppendCustomField($("#ui_txtButtonTwoRedirect").val()));
        } else {
            webpushTemplate.Button2_Label = ""; webpushTemplate.Button2_Redirect = "";
        }
    } else {
        webpushTemplate.Button1_Label = ""; webpushTemplate.Button1_Redirect = "";
        webpushTemplate.Button2_Label = ""; webpushTemplate.Button2_Redirect = "";
    }

    if ($("#dvAdvanced").is(":visible")) {
        webpushTemplate.IsAutoHide = $("#chkAutoHide").is(':checked');
        webpushTemplate.IsCustomBadge = CustomBadge;
        webpushTemplate.BadgeImage = badgeimage;
    } else { webpushTemplate.IsAutoHide = false; webpushTemplate.IsCustomBadge = false; webpushTemplate.BadgeImage = ""; }

    if (duplicate == true) { webpushTemplate.Id = 0; }
    $.ajax({
        url: "/WebPush/CreateTemplate/SaveOrUpdateTemplate",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'webpushTemplate': webpushTemplate }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.Status == true) {
                var response = data.Result;
                if (response.Id > 0) {
                    if (webpushTemplate.Id > 0)
                        ShowSuccessMessage(GlobalErrorList.WebpushTemplate.TemplateUpdateSuccess);
                    else {
                        ShowSuccessMessage(GlobalErrorList.WebpushTemplate.TemplateCreationSuccess);
                        setTimeout(function () { window.location.href = "/webpush/Template"; }, 500);
                    }
                }
                else if (response.Id == -1) {
                    ShowErrorMessage(GlobalErrorList.WebpushTemplate.TemplateExists);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.WebpushTemplate.UpdateIssue);
                }
            } else {
                ShowAjaxError(data.Error);
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});


function Validate() {

    if ($.trim($("#ui_txtTitleTemplate").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.WebpushTemplate.Title);
        return false;
    }

    if ($.trim($("#ui_txtMessageTemplate").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.WebpushTemplate.MessageContent);
        return false;
    }

    if ($.trim(icon).length == 0) {
        ShowErrorMessage(GlobalErrorList.WebpushTemplate.TemplateIcon);
        return false;
    }

    if ($.trim($("#txtRedirectUrl").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.WebpushTemplate.RedirectUrl);
        return false;
    }
    if (csteventregex.test($("#txtRedirectUrl").val()) == false) {
        if (cstuserregex.test($("#txtRedirectUrl").val()) == false) {
            if (urlregex.test($("#txtRedirectUrl").val()) == false) {
                ShowErrorMessage(GlobalErrorList.WebpushTemplate.RedirectUrlValidUrl);
                return false;
            }
        }
    }

    if (txtMsgType == 2 && banner.length == 0) {
        ShowErrorMessage(GlobalErrorList.WebpushTemplate.BannerImage);
        return false;
    }

    if ($("#dvButtons").is(":visible") && $.trim($("#ui_txtButtonOne").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.WebpushTemplate.Btn1Lbl);
        return false;
    }
    if ($("#dvButtons").is(":visible") && $.trim($("#ui_txtButtonOneRedirect").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.WebpushTemplate.Btn1Redirect);
        return false;
    }

    if ($("#dvButtons").is(":visible") && csteventregex.test($("#ui_txtButtonOneRedirect").val()) == false) {
        if (csteventregex.test($("#ui_txtButtonOneRedirect").val()) == false) {
            if (cstuserregex.test($("#ui_txtButtonOneRedirect").val()) == false) {
                if (urlregex.test($("#ui_txtButtonOneRedirect").val()) == false) {
                    ShowErrorMessage(GlobalErrorList.WebpushTemplate.Btn1RedirectValidUrl);
                    return false;
                }
            }
        }
    }

    if ($("#btnTab2").is(":visible") && $.trim($("#ui_txtButtonTwo").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.WebpushTemplate.Btn2Lbl);
        return false;
    }
    if ($("#btnTab2").is(":visible") && $.trim($("#ui_txtButtonTwoRedirect").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.WebpushTemplate.Btn2Redirect);
        return false;
    }

    //if ($("#btnTab2").is(":visible") && urlregex.test($("#ui_txtButtonTwoRedirect").val()) == false) {
    //    ShowErrorMessage(GlobalErrorList.WebpushTemplate.Btn2RedirectValidUrl);
    //    return false;
    //}

    if ($("#btnTab2").is(":visible") && csteventregex.test($("#ui_txtButtonTwoRedirect").val()) == false) {
        if (csteventregex.test($("#ui_txtButtonTwoRedirect").val()) == false) {
            if (cstuserregex.test($("#ui_txtButtonTwoRedirect").val()) == false) {
                if (urlregex.test($("#ui_txtButtonTwoRedirect").val()) == false) {
                    ShowErrorMessage(GlobalErrorList.WebpushTemplate.Btn2RedirectValidUrl);
                    return false;
                }
            }
        }
    }
    if ($("#dvAdvanced").is(":visible") && CustomBadge == 1 && (badgeimage.length == 0 || $("#txtCustomeBadge").val().length != 0 && urlregex.test($("#txtCustomeBadge").val()) == false)) {
        ShowErrorMessage(GlobalErrorList.WebpushTemplate.BadgeImage);
        return false;
    }


    var htmlContent = $.trim($("#ui_txtMessageTemplate").val());
    if (htmlContent != null) {
        var contactmatchrecord = [];
        var matches = htmlContent.match(/\[\{\*(.*?)\*\}\]/g);
        var maxindex = 0;
        if (matches != null) {
            for (i = 0; i < matches.length; i++) {
                var replctxt = matches[i].replace("[{*", "").replace("*}]", "");
                if (matches[i].includes("_")) {

                    var txt = replctxt.split('_');
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


            }


            if (parseInt(maxindex) > 8) {
                ShowErrorMessage(GlobalErrorList.WebpushTemplate.MaxTag);
                return false;
            }
            //----check contact tag should be genuine------//
            var IsContactTagGenuine = true;
            var CList = JSLINQ($('#draganddropcutomre option')).Select(function (P) { return $.trim(P.innerText).toLowerCase().replace("[{*", "").replace("*}]", ""); }).ToArray();
            for (var i = 0; i < contactmatchrecord.length; i++) {
                if (CList.indexOf(contactmatchrecord[i].toLowerCase()) < 0) {
                    IsContactTagGenuine = false;
                    break;
                }

            }
            var CList = JSLINQ($('#draganddropcutomrenew option')).Select(function (P) { return $.trim(P.innerText).toLowerCase().replace("[{*", "").replace("*}]", ""); }).ToArray();
            for (var i = 0; i < contactmatchrecord.length; i++) {
                if (CList.indexOf(contactmatchrecord[i].toLowerCase()) < 0) {
                    IsContactTagGenuine = false;
                    break;
                }

            }

            if (!IsContactTagGenuine) {
                ShowErrorMessage(GlobalErrorList.WebpushTemplate.TemplateTag);
                return false;
            }
        }
    }

    return true;
}
function GetTemplateDetail() {

    $.ajax({
        url: "/WebPush/Template/GetTemplateDetails",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WebPushTemplate': webpushTemplate }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.Id > 0) {

                txtMsgType = response.NotificationType;
                if (response.NotificationType == 2) {
                    $("#textbanner").prop("checked", true); $("#textbanner").prop("checked", true);
                    $("#bwsnotiaddimg").prop("checked", true);
                    $(".box-whitebdr.imgoptns, .notifbanwrp").removeClass('hideDiv');
                    $(".brwsnotifilupl").addClass('hideDiv');
                    $('.bwsnotiimgurl').removeClass('hideDiv');
                }
                DragDroReportUtil.Getdistincteventname(response.Title, response.MessageContent, 'Web')
                //DragDroReportUtil.BindALLEventMappingDetails(response.Title, response.MessageContent);

                icon = response.IconImage;
                $(".notificonwrp").css("background-image", "url(" + icon + ")");
                ShowFileName(response.IconImage);

                $("#txtRedirectUrl").val(ReplaceCustomFields(response.OnClickRedirect));

                banner = response.BannerImage != null ? response.BannerImage : "";
                $(".notifbanwrp").css("background-image", "url(" + banner + ")");
                $("#txtBannerImage").val(banner);

                if ((response.Button1_Label != null) && response.Button1_Label != "") {
                    $(".bnotibtnoption").trigger("click");
                    $("#ui_txtButtonOne").val(response.Button1_Label);
                    $("#ui_txtButtonOneRedirect").val(ReplaceCustomFields(response.Button1_Redirect));
                    $(".bnotbtn1").html(response.Button1_Label);
                    $(".bwnotilbl").html(response.Button1_Label.length);

                    if ((response.Button2_Label != null) && response.Button2_Label != "") {
                        $(".plusbtnwrp").trigger("click");
                        $("#ui_txtButtonTwo").val(response.Button2_Label);
                        $("#ui_txtButtonTwoRedirect").val(ReplaceCustomFields(response.Button2_Redirect));
                        $(".bnotbtn2").html(response.Button2_Label);
                        $(".bwnotilb2").html(response.Button2_Label.length);
                    }
                }

                if (response.IsAutoHide == true || response.IsCustomBadge == true) {
                    $(".bnotiadvanOptions").trigger("click");
                    $("#chkAutoHide").prop("checked", true);
                    if (response.IsCustomBadge == true) {
                        $("#advcustbadge").prop("checked", true);
                        $(".advbrowsewrap").slideDown(); CustomBadge = 1;
                        badgeimage = response.BadgeImage != null ? response.BadgeImage : "";
                        $("#txtCustomeBadge").val(badgeimage);
                    }
                }



                //var str = PreviewSupport($("#ui_txtTitleTemplate").val());
                //$(".notiftitle").html(str);
                //$(".bnottitle").html(str.length);

                //var str = PreviewSupport($("#ui_txtMessageTemplate").val());
                //$(".notifdescript").html(str);
                //$(".bwnotmess").html(str.length);
            }
        },
        error: ShowAjaxError
    });
}

$("#ui_txtTitleTemplate").keyup(function () {
    var str = PreviewSupport($(this).val());
    $(".notiftitle").html(str);
    $(".bnottitle").html(str.length);
});
$("#ui_txtMessageTemplate").keyup(function () {
    var str = PreviewSupport($(this).val());
    $(".notifdescript").html(str);
    $(".bwnotmess").html(str.length);
});


function GetContactFields() {
    $.ajax({
        url: "/WebPush/CreateTemplate/GetAllFieldDetails",
        type: 'Post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        success: BindContactFields,
        error: ShowAjaxError
    });
}
BindContactFields = function (fieldList) {

    if (fieldList.length > 0) {
        $.each(fieldList, function (i) {
            $("#draganddropcutomrenew").append('<option value="' + $(this)[0].FieldName + '">' + $(this)[0].FieldName + '</option>');
            $("#draganddropcutomre").append('<option value="' + $(this)[0].FieldName + '">' + $(this)[0].FieldName + '</option>');

            customFieldList.push($(this)[0].FieldName);

        });
    }

}

$('#eventitemsmessage').on('change', function () {
    //messagetextboxvalue = " { { [" + eventname + "][" + this.value + "][TOP1.DSC]~[fallbackdata] } }";
    if ((160 - $("#ui_txtMessageTemplate").val().length) > 15 && this.value != "Select") {
        let cursorPos = $('#ui_txtMessageTemplate').prop('selectionStart');
        let MessageContent = $("#ui_txtMessageTemplate").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let customField = " {{*[" + eventname + "]~[" + this.value + "]~[TOP1.DESC]~[fallbackdata]*}} ";
        let newMessageContent = textBefore + customField + textAfter;
        $('#ui_txtMessageTemplate').val(newMessageContent);
        var str = PreviewSupport($("#ui_txtMessageTemplate").val());
        $(".notifdescript").html(str);
        $(".bwnotmess").html(str.length);
    } else { ShowErrorMessage(GlobalErrorList.WebpushTemplate.TitleLength); }

});

$('#draganddropcustommessage').on('change', function () {
    if ((160 - $("#ui_txtMessageTemplate").val().length) > 15 && this.value != "Select") {
        let cursorPos = $('#ui_txtMessageTemplate').prop('selectionStart');
        let MessageContent = $("#ui_txtMessageTemplate").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let customField = ` [{*${this.value}*}] `;
        let newMessageContent = textBefore + customField + textAfter;
        $('#ui_txtMessageTemplate').val(newMessageContent);
        var str = PreviewSupport($("#ui_txtMessageTemplate").val());
        $(".notifdescript").html(str);
        $(".bwnotmess").html(str.length);
    } else { ShowErrorMessage(GlobalErrorList.WebpushTemplate.MessageLength); }
});
$('#draganddropcustomtitle').on('change', function () {
    if ((90 - $("#ui_txtTitleTemplate").val().length) > 15 && this.value != "Select") {
        let cursorPos = $('#ui_txtTitleTemplate').prop('selectionStart');
        let MessageContent = $("#ui_txtTitleTemplate").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let customField = ` [{*${this.value}*}] `;
        let newMessageContent = textBefore + customField + textAfter;
        $('#ui_txtTitleTemplate').val(newMessageContent);
        var str = PreviewSupport($("#ui_txtTitleTemplate").val());
        $(".notiftitle").html(str);
        $(".bwnotmess").html(str.length);
    } else { ShowErrorMessage(GlobalErrorList.WebpushTemplate.MessageLength); }
});
$('#eventitemstitle').on('change', function () {

    if ((90 - $("#ui_txtTitleTemplate").val().length) > 15 && this.value != "Select") {
        let cursorPos = $('#ui_txtTitleTemplate').prop('selectionStart');
        let MessageContent = $("#ui_txtTitleTemplate").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let customField = " {{*[" + eventname + "]~[" + this.value + "]~[TOP1.DESC]~[fallbackdata]*}} ";
        let newMessageContent = textBefore + customField + textAfter;
        $('#ui_txtTitleTemplate').val(newMessageContent);
        var str = PreviewSupport($("#ui_txtTitleTemplate").val());
        $(".notiftitle").html(str);
        $(".bnottitle").html(str.length);
    } else { ShowErrorMessage(GlobalErrorList.WebpushTemplate.TitleLength); }
});
$('#eventitemstitleurl').on('change', function () {
    if (this.value != "Select") {
        let cursorPos = $('#txtRedirectUrl').prop('selectionStart');
        let MessageContent = $("#txtRedirectUrl").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let customField = " {{*[" + eventname + "]~[" + this.value + "]~[TOP1.DESC]~[fallbackdata]*}} ";
        let newMessageContent = textBefore + customField + textAfter;
        $('#txtRedirectUrl').val(newMessageContent);

    }
});
$('#draganddropcustomtitleurl').on('change', function () {
    if (this.value != "Select") {
        let cursorPos = $('#txtRedirectUrl').prop('selectionStart');
        let MessageContent = $("#txtRedirectUrl").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let customField = " [{*" + this.value + "*}] ";
        let newMessageContent = textBefore + customField + textAfter;
        $('#txtRedirectUrl').val(newMessageContent);
    }

});
$('#eventitemstitlebtnurl').on('change', function () {
    if (this.value != "Select") {
        let cursorPos = $('#ui_txtButtonOneRedirect').prop('selectionStart');
        let MessageContent = $("#ui_txtButtonOneRedirect").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let customField = " {{*[" + eventname + "]~[" + this.value + "]~[TOP1.DESC]~[fallbackdata]*}} ";
        let newMessageContent = textBefore + customField + textAfter;
        $('#ui_txtButtonOneRedirect').val(newMessageContent);
    }

});
$('#draganddropcustomtitlebtnurl').on('change', function () {
    if (this.value != "Select") {
        let cursorPos = $('#ui_txtButtonOneRedirect').prop('selectionStart');
        let MessageContent = $("#ui_txtButtonOneRedirect").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let customField = " [{*" + this.value + "*}] ";
        let newMessageContent = textBefore + customField + textAfter;
        $('#ui_txtButtonOneRedirect').val(newMessageContent);
    }

});
$('#eventitemstitlebtn2url').on('change', function () {
    if (this.value != "Select") {
        let cursorPos = $('#ui_txtButtonTwoRedirect').prop('selectionStart');
        let MessageContent = $("#ui_txtButtonTwoRedirect").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let customField = " {{*[" + eventname + "]~[" + this.value + "]~[TOP1.DESC]~[fallbackdata]*}} ";
        let newMessageContent = textBefore + customField + textAfter;
        $('#ui_txtButtonTwoRedirect').val(newMessageContent);
    }

});
$('#draganddropcustomtitlebtn2url').on('change', function () {
    if (this.value != "Select") {
        let cursorPos = $('#ui_txtButtonTwoRedirect').prop('selectionStart');
        let MessageContent = $("#ui_txtButtonTwoRedirect").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let customField = " [{*" + this.value + "*}] ";
        let newMessageContent = textBefore + customField + textAfter;
        $('#ui_txtButtonTwoRedirect').val(newMessageContent);
    }
});
$('#eventitemstitlebanner').on('change', function () {
    if (this.value != "Select") {
        let cursorPos = $('#txtBannerImage').prop('selectionStart');
        let MessageContent = $("#txtBannerImage").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let customField = " {{*[" + eventname + "]~[" + this.value + "]~[TOP1.DESC]~[fallbackdata]*}} ";
        let newMessageContent = textBefore + customField + textAfter;
        $('#txtBannerImage').val(newMessageContent);
    }
});
$('#draganddropcustomtitlebanner').on('change', function () {
    if (this.value != "Select") {
        let cursorPos = $('#txtBannerImage').prop('selectionStart');
        let MessageContent = $("#txtBannerImage").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let customField = " [{*" + this.value + "*}] ";
        let newMessageContent = textBefore + customField + textAfter;
        $('#txtBannerImage').val(newMessageContent);
    }

});
$("#ui_txtButtonOne").keyup(function () {
    let bnotlbltxt = $(this).val();
    $(".bnotbtn1").html(bnotlbltxt);
    $(".bwnotilbl").html(bnotlbltxt.length);
});

$("#ui_txtButtonTwo").keyup(function () {
    let bnotlbltxttwo = $(this).val();
    $(".bnotbtn2").html(bnotlbltxttwo);
    $(".bwnotilbl2").html(bnotlbltxttwo.length);
});



function PreviewSupport(message) {
    var matches = message.match(/\[\{\*(.*?)\*\}\]/g);

    if (matches != null) {
        for (i = 0; i < matches.length; i++) {
            message = message.replace(matches[i], "xxxxxxxxxxxxxx");
        }
    }
    var matches = message.match(/\{{.*?}\}/gi);

    if (matches != null) {
        for (i = 0; i < matches.length; i++) {
            message = message.replace(matches[i], "xxxxxxxxxxxxxx");
        }
    }
    $("#ui_dvMessageContentPreview").html($("#ui_dvMessageContentPreview").message);

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



$('input[name="notiftype"]').click(function () {
    let creatnotitype = $(this).val();
    if (creatnotitype == "notiftextbann") {
        txtMsgType = 2;
        $(".box-whitebdr.imgoptns, .notifbanwrp").removeClass('hideDiv');
    } else {
        txtMsgType = 1;
        $(".box-whitebdr.imgoptns, .notifbanwrp").addClass('hideDiv');
    }
});

$(".bnotibtnoption").click(function () {
    if ($("#dvButtons").is(":visible")) {
        $("#ui_txtButtonOne").val("");
        $("#ui_txtButtonOneRedirect").val("");
        $("#ui_txtButtonTwo").val("");
        $("#ui_txtButtonTwoRedirect").val("");
    }
    $(".bnotbtn1").html("Button1");
    $(".bnotbtn2").html("Button2");

    $(".notifbtnwrp").toggleClass("hideDiv");
    $(this).parents(".rsscontwrp").next().slideToggle();

    $(".bwsnotibtnwrp").toggleClass("hideDiv");
});


$(".plusbtnwrp").click(function () {
    $(this).addClass("hideDiv");
    $(this).prev().removeClass("hideDiv");
    $(this).next().removeClass("hideDiv")
    $(".btn-notisecondary").removeClass("hideDiv");

    $(".nextbutton").removeClass("hideDiv");
});

$(".minusbtnwrp").click(function () {
    $(this).addClass("hideDiv");
    $(this).prev().prev().addClass("hideDiv");
    $(this).prev().removeClass("hideDiv");
    $(".btn-notisecondary").addClass("hideDiv");
    $("#button2").fadeIn("slow").addClass("hideDiv");
    $("#button1").fadeIn("slow").removeClass("hideDiv");
    $(".nextbutton").addClass("hideDiv");
});

$(".bnotiadvanOptions").click(function () {
    $(this).parents(".rsscontwrp").next().slideToggle();
    $("#txtCustomeBadge").val("");
    $('#chkAutoHide').prop('checked', false);
    $('#advdefaultbadge').prop('checked', true);
    $(".advbrowsewrap").slideUp();
});

$('input[name="advbadgetype"]').click(function () {
    var advbadgeval = $(this).val();
    if (advbadgeval == "advcustbadge") {
        $(".advbrowsewrap").slideDown(); CustomBadge = 1;
    } else {
        $(".advbrowsewrap").slideUp(); CustomBadge = 0;
    }
});
$(".devwrphvr").click(function () {
    var checkdevictabconid = $(this).attr("data-devtabcont");
    $(".devwrphvr").removeClass("active");
    $(".devsmsprev").addClass("hideDiv");
    $(".notifprevmain, .brwsnotifdevice").addClass("hideDiv");
    $(this).addClass("active");
    $("#" + checkdevictabconid).removeClass("hideDiv");
});
$(".bnotbtnwrp").click(function () {
    $(".bnotbtncontwrp").addClass("hideDiv");
    $(".bnotbtnwrp").removeClass("active");
    $(this).addClass("active");
    var bnotbtntab = $(this).attr("data-btntab");
    $("#" + bnotbtntab).fadeIn("slow").removeClass("hideDiv");
});

$('input[name="bwsnotifileuploadtype"]').click(function () {
    let bwsnotifilenamval = $(this).val();
    if (bwsnotifilenamval == "bwsnotiaddimgfild") {
        $(".brwsnotifilupl").addClass('hideDiv');
        $('.bwsnotiimgurl').removeClass('hideDiv');
    } else {
        $('.bwsnotiimgurl').addClass('hideDiv');
        $(".brwsnotifilupl").removeClass('hideDiv');
    }
});

function SaveImage(fileid) {
    ShowPageLoading();
    if ($("#" + fileid).val() != "") {
        var uploadFile = $("#" + fileid).get(0);
        var uploadedfile = uploadFile.files;
        var fromdata;
        if (typeof window.FormData == "undefined")
            fromdata = [];
        else
            fromdata = new window.FormData();
        for (var i = 0; i < uploadedfile.length; i++) {
            if (typeof window.FormData == "undefined")
                fromdata.push(uploadedfile[i].name, uploadedfile[i]);
            else
                fromdata.append(uploadedfile[i].name, uploadedfile[i]);
        }

        if (fileid == "fileUploadIcon") {
            fromdata.append('width', 192); fromdata.append('height', 192);
        } else if (fileid == "fileUploadBanner") {
            fromdata.append('width', 720); fromdata.append('height', 480);
        } else if (fileid == "fileUploadBadgeImage") {
            fromdata.append('width', 72); fromdata.append('height', 72);
        }

        var choice = {};
        choice.url = "/WebPush/CreateTemplate/SaveImage",
            choice.type = "POST";
        choice.data = fromdata;
        choice.contentType = false;
        choice.processData = false;
        choice.async = false;
        choice.success = function (responseData) {

            response = responseData.getdata;
            var status = response;
            if (response == 0) {
                ShowErrorMessage(GlobalErrorList.WebpushTemplate.FileFormat);
            }
            else {
                if (uploadFile["id"] == "fileUploadIcon") {
                    icon = response;
                    $(".notificonwrp").css("background-image", "url(" + icon + ")");
                }
                else if (uploadFile["id"] == "fileUploadBanner") {
                    banner = response;
                    $(".notifbanwrp").css("background-image", "url(" + banner + ")");
                }
                else if (uploadFile["id"] == "fileUploadBadgeImage") {
                    badgeimage = response;
                    $(".bwsnotichrmeicon").css("background-image", "url(" + badgeimage + ")");
                }

                $(".appndfile").html(uploadedfile[0].name);
                $(".brwsfilename").removeClass("hideDiv");
            }
            HidePageLoading();

            $(".chosefile").val('');
        };
        choice.error = function (result) {
            HidePageLoading();
            ShowErrorMessage(GlobalErrorList.WebpushTemplate.FileFormat);
        };
        $.ajax(choice);
        event.preventDefault();
    }
}

$("#txtBannerImage").keyup(function () {
    banner = $("#txtBannerImage").val();
    $(".notifbanwrp").css("background-image", "url(" + banner + ")");
});

$("#txtCustomeBadge").keyup(function () {
    badgeimage = $("#txtCustomeBadge").val();
    $(".bwsnotichrmeicon").css("background-image", "url(" + badgeimage + ")");
});

if ($(".bnotiadvanOptions").length) {
    $(".bnotiadvanOptions").toggles({
        on: false,
        height: 22
    });
}

if ($(".bnotibtnoption").length) {
    $(".bnotibtnoption").toggles({
        on: false,
        height: 22
    });
}

//close Icon Image file
$(".brwsfileremove").click(function () {
    icon = DefaultIconfilePath;
    $(".appndfile").html("");
    $(".brwsfilename").addClass("hideDiv");
    $(".notificonwrp").css("background-image", "url(" + icon + ")");
});

//close file name
function ShowFileName(filename) {
    if (filename != undefined && filename != null) {
        filename = filename.split('/').pop();
        let extension = filename.split('.').pop();
        let name = filename.lastIndexOf('_') > 0 ? filename.substring(0, filename.lastIndexOf('_')) : filename.substring(0, filename.lastIndexOf('.'));
        $(".appndfile").html(name + '.' + extension);
        $(".brwsfilename").removeClass("hideDiv");

    }
}

//Line break not allowed in webpush messages
$("#ui_txtMessageTemplate").keypress(function (event) {
    if (event.which == 13) {
        event.preventDefault();
    }
});

function BindAccountDomain() {
    if (Plumb5AccountDomain != null && Plumb5AccountDomain.length > 0) {
        $("#ui_accountdomain").html(Plumb5AccountDomain);
    } else {
        $("#ui_accountdomain").html("yourwebsitedomain.com");
    }
}
var getFromBetween = {
    results: [],
    string: "",
    getFromBetween: function (sub1, sub2) {
        if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var SP = this.string.indexOf(sub1) + sub1.length;
        var string1 = this.string.substr(0, SP);
        var string2 = this.string.substr(SP);
        var TP = string1.length + string2.indexOf(sub2);
        return this.string.substring(SP, TP);
    },
    removeFromBetween: function (sub1, sub2) {
        if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var removal = sub1 + this.getFromBetween(sub1, sub2) + sub2;
        this.string = this.string.replace(removal, "");
    },
    getAllResults: function (sub1, sub2) {
        // first check to see if we do have both substrings
        if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

        // find one result
        var result = this.getFromBetween(sub1, sub2);
        // push it to the results array
        this.results.push(result);
        // remove the most recently found one from the string
        this.removeFromBetween(sub1, sub2);

        // if there's more substrings
        if (this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
            this.getAllResults(sub1, sub2);
        }
        else return;
    },
    get: function (string, sub1, sub2) {
        this.results = [];
        this.string = string;
        this.getAllResults(sub1, sub2);
        return this.results;
    }
};
$("#webpushuserattr").click(function () {
    let attrbidval = $(this).attr("data-tabcontid");
    let attrid = 'userattr';
    if (attrbidval.indexOf('userattr') > -1)
        attrid = 'cstevent';

    $("#whatsappcstattr,#whatsappuserattr,#smsuserattr,#smscstattr,#webpushuserattr,#webpushcstattr,#cpformsuserattr,#webpushcstattr,#cpformscstuserattr,#cpformsevntattr,#cpformscsteventattr").removeClass("active");
    $(this).addClass("active");
    //$("#userattr,#customeve,#customeve2,#userattr2,#userattrurl,#customeveurl,#userattrbtnurl,#customevebtnurl,#userattrbtn2url,#customevebtn2url").addClass("hideDiv");

    $("#" + attrid + attrbidval.substring(8)).addClass("hideDiv");
    $("#" + attrbidval).removeClass("hideDiv");
    //if (templatename=='sms')
    //BindDltTagging($("#ui_txtMessageTemplate").val());

});
$("#webpushcstattr").click(function () {
    let attrbidval = $(this).attr("data-tabcontid");
    let attrid = 'userattr';
    if (attrbidval.indexOf('userattr') > -1)
        attrid = 'cstevent';

    $("#whatsappcstattr,#whatsappuserattr,#smsuserattr,#smscstattr,#webpushuserattr,#webpushcstattr,#cpformsuserattr,#webpushcstattr,#cpformscstuserattr,#cpformsevntattr,#cpformscsteventattr").removeClass("active");
    $(this).addClass("active");
    //$("#userattr,#customeve,#customeve2,#userattr2,#userattrurl,#customeveurl,#userattrbtnurl,#customevebtnurl,#userattrbtn2url,#customevebtn2url").addClass("hideDiv");

    $("#" + attrid + attrbidval.substring(8)).addClass("hideDiv");
    $("#" + attrbidval).removeClass("hideDiv");
    //if (templatename=='sms')
    //BindDltTagging($("#ui_txtMessageTemplate").val());

});