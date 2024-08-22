var customFieldList = [];
var MobilePushContactCustomFieldList = [];
var banner = "";
var urlregex = new RegExp("^(http:\/\/|https:\/\/){1}([0-9A-Za-z]+\.)");

var MobilePushTemplate = { Id: 0, CampaignId: 0, TemplateName: "", TemplateDescription: "" };
var MobilePushTempId = 0;
var MobilePushDuplicate = false;
var NotificationType = 'longtextstyle';
var ActionType = 'navigatescreen';
var ActionTypeButton1 = 'navigatescreen';
var ActionTypeButton2 = 'navigatescreen';

var ExistingData;
$(document).ready(function () {
    GetScreenList();

    MobilePushCreateTemplateUtil.GetContactExtraFields();
    MobilePushTemplate.Id = MobilePushTempId = urlParam("TemplateId");
    MobilePushCreateTemplateUtil.GetCampaignList();
    if (MobilePushTemplate.Id != 0) {
        $(".pagetitle").html("Update Template");
        if (urlParam("Duplicate") == "true") {
            $('.pagetitle').html("Enter Duplicate Template Information");
            MobilePushDuplicate = true;
        }
    }
    HidePageLoading();
});

var MobilePushCreateTemplateUtil = {
    GetContactExtraFields: function () {
        $.ajax({
            url: "/MobilePushNotification/DesignMobilePushTemplate/GetContactExtraFieldDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: MobilePushCreateTemplateUtil.BindContactExtraFields,
            error: ShowAjaxError
        });
    },
    BindContactExtraFields: function (fieldList) {
        if (fieldList != undefined && fieldList != null && fieldList.length > 0) {
            $.each(fieldList, function (i) {
                $("#draganddropcutomrenew").append('<option value="' + $(this)[0].FieldName + '">' + $(this)[0].FieldName + '</option>');
                $("#draganddropcutomre").append('<option value="' + $(this)[0].FieldName + '">' + $(this)[0].FieldName + '</option>');

                MobilePushContactCustomFieldList.push($(this)[0].FieldName);
            });
        }
    },
    GetCampaignList: function () {
        $.ajax({
            url: "/MobilePushNotification/DesignMobilePushTemplate/GetCampaignList",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function () {
                    $("#ui_dllMobilePushTemplateCampaign").append('<option value="' + $(this)[0].Id + '">' + $(this)[0].Name + '</option>');

                    $("#ui_dllMobilePushTemplateCampaign").select2({
                        placeholder: 'This is my placeholder',
                        minimumResultsForSearch: '',
                        dropdownAutoWidth: false,
                        containerCssClass: 'dropdownactiv'
                    });
                });
            },
            error: ShowAjaxError
        });
    },
    CreateTemplateNext: function () {

        if ($("#ui_dllMobilePushTemplateCampaign").val() == "0") {
            ShowErrorMessage(GlobalErrorList.MobilePushTemplate.NoCampaignId);
            HidePageLoading();
            return false;
        }

        if ($.trim($("#ui_txtMobilePushTemplateName").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.MobilePushTemplate.NoTemplateName);
            HidePageLoading();
            return false;
        }

        if ($.trim($("#ui_txtMobilePushTemplateDescription").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.MobilePushTemplate.NoTemplateDescription);
            HidePageLoading();
            return false;
        }


        if ((MobilePushTempId > 0 && MobilePushDuplicate == true) || MobilePushTempId > 0) {
            MobilePushCreateTemplateUtil.CreateTemplate();
        } else {
            MobilePushCreateTemplateUtil.CheckTemplateExists();
        }

    },
    CreateTemplate: function () {
        ShowPageLoading();
        if ($("#ui_dllMobilePushTemplateCampaign").val() == "0") {
            ShowErrorMessage(GlobalErrorList.MobilePushTemplate.NoCampaignId);
            HidePageLoading();
            return false;
        }

        if ($.trim($("#ui_txtMobilePushTemplateName").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.MobilePushTemplate.NoTemplateName);
            HidePageLoading();
            return false;
        }

        if ($.trim($("#ui_txtMobilePushTemplateDescription").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.MobilePushTemplate.NoTemplateDescription);
            HidePageLoading();
            return false;
        }

        MobilePushTemplate.Id = MobilePushTempId;
        MobilePushTemplate.CampaignId = $("#ui_dllMobilePushTemplateCampaign").val();
        MobilePushTemplate.TemplateName = $.trim($("#ui_txtMobilePushTemplateName").val());
        MobilePushTemplate.TemplateDescription = $.trim($("#ui_txtMobilePushTemplateDescription").val());

        $.ajax({
            url: "/MobilePushNotification/DesignMobilePushTemplate/CreateTemplateNext",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'mobilePushTemplate': MobilePushTemplate }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var data = MobilePushTempId != 0 ? "?TemplateId=" + MobilePushTempId : "";
                    data += MobilePushDuplicate == true ? "&Duplicate=true" : "";

                    window.location.href = '/MobilePushNotification/DesignMobilePushTemplate' + data;
                } else {
                    ShowErrorMessage(GlobalErrorList.MobilePushTemplate.TemplateNameExists);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    CheckTemplateExists: function () {
        ShowPageLoading();
        $.ajax({
            url: "/MobilePushNotification/MobilePushTemplate/GetArchiveTemplate",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'TemplateName': $("#ui_txtMobilePushTemplateName").val() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: MobilePushCreateTemplateUtil.CheckandPop,
            error: ShowAjaxError
        });
    },
    CheckandPop: function (response) {
        if (response != undefined && response != null && response.Template != null) {
            ExistingData = response.Template;
            HidePageLoading();
            $("#tempexistmod").modal("show");

        } else {
            MobilePushCreateTemplateUtil.CreateTemplate();
        }
    },
    UpdateTemplateStatus: function (TemplateId) {
        ShowPageLoading();
        $.ajax({
            url: "/MobilePushNotification/MobilePushTemplate/UpdateArchiveStatus",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': TemplateId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("#tempexistmod").modal("hide");
                ShowSuccessMessage(GlobalErrorList.MobilePushTemplate.TemplateRestoredSuccess);
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
}

$(document).on('click', '#archiverestore', function () {
    MobilePushTempId = ExistingData.Id;
    if (ExistingData.CampaignId > 0) {
        $("#ui_dllMobilePushTemplateCampaign").val(ExistingData.CampaignId).change();
    } else {
        $("#ui_dllMobilePushTemplateCampaign").val("0").change();
    }

    if (ExistingData.TemplateName != undefined && ExistingData.TemplateName != null && ExistingData.TemplateName != "") {
        $("#ui_txtMobilePushTemplateName").val(ExistingData.TemplateName);
    } else {
        $("#ui_txtMobilePushTemplateName").val("");
    }

    if (ExistingData.TemplateDescription != undefined && ExistingData.TemplateDescription != null && ExistingData.TemplateDescription != "") {
        $("#ui_txtMobilePushTemplateDescription").val(ExistingData.TemplateDescription);
    } else {
        $("#ui_txtMobilePushTemplateDescription").val("");
    }

    MobilePushCreateTemplateUtil.UpdateTemplateStatus(ExistingData.Id);
});

$("#ui_iMobilePushTemplateBasicPopUpClose,#ui_btnMobilePushTemplateBasicPopUpClose").click(function () {
    ShowPageLoading();

    $("#ui_dllMobilePushTemplateCampaign").select2().val(0).trigger('change');
    $('#ui_divMobilePushTemplateBasicPopUp .popuptitle h6').html("Create Template");
    $("#ui_txtMobilePushTemplateName").val("");
    $("#ui_txtMobilePushTemplateDescription").val("");

    $("#ui_divMobilePushTemplateBasicPopUp").addClass("hideDiv");
    HidePageLoading();
});

function CreateEditTemplate(Id, CampaignId, Name, Description) {
    ShowPageLoading();
    MobilePushTempId = Id;

    if (MobilePushTempId > 0) {
        $("#ui_dllMobilePushTemplateCampaign").select2().val(CampaignId).trigger('change');
        $('#ui_divMobilePushTemplateBasicPopUp .popuptitle h6').html("Edit Template");
        $("#ui_txtMobilePushTemplateName").val(Name);
        $("#ui_txtMobilePushTemplateDescription").val(Description == 'null' ? "" : Description);
    } else {
        $("#ui_dllMobilePushTemplateCampaign").select2().val(0).trigger('change');
        $('#ui_divMobilePushTemplateBasicPopUp .popuptitle h6').html("Create Template");
        $("#ui_txtMobilePushTemplateName").val("");
        $("#ui_txtMobilePushTemplateDescription").val("");
    }

    $("#ui_divMobilePushTemplateBasicPopUp").removeClass("hideDiv");
    HidePageLoading();
}

function DuplicateTemplate(id, CampaignId, name, description) {
    MobilePushTempId = id; MobilePushDuplicate = true;
    $("#ui_divMobilePushTemplateBasicPopUp").removeClass("hideDiv");
    $("#ui_dllMobilePushTemplateCampaign").select2().val(CampaignId).trigger('change');
    $('#ui_divMobilePushTemplateBasicPopUp .popuptitle h6').html("Duplicate Template");
    $("#ui_txtMobilePushTemplateName").val(name + "_Copy");
    $("#ui_txtMobilePushTemplateDescription").val(description == 'null' ? "" : description);
}

$("#ui_btnCreateTemplate").click(function () {

    if (!Validate()) {
        return;
    }

    ShowPageLoading();

    MobilePushTemplate.NotificationType = NotificationType;
    MobilePushTemplate.Title = $.trim($("#ui_txtTitleTemplate").val());
    MobilePushTemplate.MessageContent = $.trim($("#ui_txtMessageTemplate").val());
    MobilePushTemplate.SubTitle = $.trim($("#ui_txtSubMessageTemplate").val());
    MobilePushTemplate.ClickActionType = ActionType;

    var redirect = ActionType == 'navigatescreen' ? $("#ui_ddlScreen option:selected").val() : ActionType == 'deeplinking' ? $.trim($("#ui_txtDeepLinking").val()) : ActionType == 'browserurl' ? $.trim($("#ui_txtBrowserUrl").val()) : '';
    MobilePushTemplate.ClickActionURL = redirect;
    MobilePushTemplate.ClickKeyPairValue = getKeyPairValue('');

    var iosredirect = ActionType == 'navigatescreen' ? $("#ui_ddlIosScreen option:selected").val() : '';
    MobilePushTemplate.ClickIosActionURL = iosredirect;
    MobilePushTemplate.ClickIosKeyPairValue = '';

    if (NotificationType == 'picturestyle') { MobilePushTemplate.ImageURL = banner; } else { MobilePushTemplate.ImageURL = ""; }
    if ($("#dvButtons").is(":visible")) {

        var redirect = ActionTypeButton1 == 'navigatescreen' ? $("#ui_ddlScreenButton1 option:selected").val() : ActionTypeButton1 == 'deeplinking' ? $.trim($("#ui_txtDeepLinkingButton1").val()) : ActionTypeButton1 == 'browserurl' ? $.trim($("#ui_txtBrowserUrlButton1").val()) : '';
        MobilePushTemplate.Button1Name = $.trim($("#ui_txtButton1").val());
        MobilePushTemplate.Button1ActionType = ActionTypeButton1;
        MobilePushTemplate.Button1ActionURL = redirect;
        MobilePushTemplate.Button1ClickKeyPairValue = getKeyPairValue('1');
        var iosredirect1 = ActionTypeButton1 == 'navigatescreen' ? $("#ui_ddlIosScreenButton1 option:selected").val() : '';
        MobilePushTemplate.Button1IosActionURL = iosredirect1;

        if ($("#btnTab2").is(":visible")) {
            var redirect = ActionTypeButton2 == 'navigatescreen' ? $("#ui_ddlScreenButton2 option:selected").val() : ActionTypeButton2 == 'deeplinking' ? $.trim($("#ui_txtDeepLinkingButton2").val()) : ActionTypeButton2 == 'browserurl' ? $.trim($("#ui_txtBrowserUrlButton2").val()) : '';
            MobilePushTemplate.Button2Name = $.trim($("#ui_txtButton2").val());
            MobilePushTemplate.Button2ActionType = ActionTypeButton2;
            MobilePushTemplate.Button2ActionURL = redirect;
            MobilePushTemplate.Button2ClickKeyPairValue = getKeyPairValue('2');
            var iosredirect2 = ActionTypeButton2 == 'navigatescreen' ? $("#ui_ddlIosScreenButton2 option:selected").val() : '';
            MobilePushTemplate.Button2IosActionURL = iosredirect2;
        } else {
            MobilePushTemplate.Button2Name = "";
            MobilePushTemplate.Button2ActionType = "";
            MobilePushTemplate.Button2ActionURL = "";
            MobilePushTemplate.Button2ClickKeyPairValue = "";
            MobilePushTemplate.Button2IosActionURL = "";
            MobilePushTemplate.Button2IosClickKeyPairValue = "";
        }
    } else {
        MobilePushTemplate.Button1Name = "";
        MobilePushTemplate.Button1ActionType = "";
        MobilePushTemplate.Button1ActionURL = "";
        MobilePushTemplate.Button1ClickKeyPairValue = "";
        MobilePushTemplate.Button1IosActionURL = "";
        MobilePushTemplate.Button1IosClickKeyPairValue = "";

        MobilePushTemplate.Button2Name = "";
        MobilePushTemplate.Button2ActionType = "";
        MobilePushTemplate.Button2ActionURL = "";
        MobilePushTemplate.Button2ClickKeyPairValue = "";
        MobilePushTemplate.Button2IosActionURL = "";
        MobilePushTemplate.Button2IosClickKeyPairValue = "";
    }


    if (MobilePushDuplicate == true) { MobilePushTemplate.Id = 0; }
    $.ajax({
        url: "/MobilePushNotification/DesignMobilePushTemplate/SaveOrUpdateTemplate",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'MobilePushTemplate': MobilePushTemplate }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            if (MobilePushTempId > 0) {
                ShowSuccessMessage(GlobalErrorList.MobilePushTemplate.Update);
            }
            else if (response.Id > 0) {
                setTimeout(function () { window.location.href = "/mobilepushnotification/MobilePushTemplate"; }, 500);
            }
            else if (response.Id == -1) {
                ShowErrorMessage(GlobalErrorList.MobilePushTemplate.TemplateExists);
            }

            HidePageLoading();
        },
        error: ShowAjaxError
    });
});

function Validate() {

    if ($.trim($("#ui_txtTitleTemplate").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.MobilePushTemplate.Title);
        return false;
    }

    if ($.trim($("#ui_txtMessageTemplate").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.MobilePushTemplate.MessageContent);
        return false;
    }

    if (NotificationType == 'picturestyle' && banner.length == 0) {
        ShowErrorMessage(GlobalErrorList.MobilePushTemplate.BannerImage);
        return false;
    }

    //DEFAULT ACTIONS---------------------------
    if (ActionType == 'navigatescreen' && $("#ui_ddlScreen option:selected").val() == 'select') {
        ShowErrorMessage(GlobalErrorList.MobilePushTemplate.NavigateScreen);
        return false;
    }

    if (ActionType == 'navigatescreen' && $("#ui_ddlIosScreen option:selected").val() == 'select') {
        ShowErrorMessage(GlobalErrorList.MobilePushTemplate.IosNavigateScreen);
        return false;
    }

    if (ActionType == 'deeplinking' && $.trim($("#ui_txtDeepLinking").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.MobilePushTemplate.Deeplinking);
        return false;
    }

    if (ActionType == 'browserurl' && $.trim($("#ui_txtBrowserUrl").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.MobilePushTemplate.Browserurl);
        return false;
    }
    if (ActionType == 'browserurl' && urlregex.test($("#ui_txtBrowserUrl").val()) == false) {
        ShowErrorMessage(GlobalErrorList.MobilePushTemplate.BrowserurlValidUrl);
        return false;
    }

    //BUTTONS 1 ----------------------------------
    if ($("#dvButtons").is(":visible") && $.trim($("#ui_txtButton1").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.MobilePushTemplate.Btn1Lbl);
        return false;
    }

    if ($("#dvButtons").is(":visible") && ActionTypeButton1 == 'navigatescreen' && $("#ui_ddlScreenButton1 option:selected").val() == 'select') {
        ShowErrorMessage(GlobalErrorList.MobilePushTemplate.Btn1NavigateScreen);
        return false;
    }

    if ($("#dvButtons").is(":visible") && ActionTypeButton1 == 'navigatescreen' && $("#ui_ddlIosScreenButton1 option:selected").val() == 'select') {
        ShowErrorMessage(GlobalErrorList.MobilePushTemplate.IosBtn1NavigateScreen);
        return false;
    }

    if ($("#dvButtons").is(":visible") && ActionTypeButton1 == 'deeplinking' && $.trim($("#ui_txtDeepLinkingButton1").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.MobilePushTemplate.Btn1Deeplinking);
        return false;
    }

    if ($("#dvButtons").is(":visible") && ActionTypeButton1 == 'browserurl' && $.trim($("#ui_txtBrowserUrlButton1").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.MobilePushTemplate.Btn1Browserurl);
        return false;
    }
    if ($("#dvButtons").is(":visible") && ActionTypeButton1 == 'browserurl' && urlregex.test($("#ui_txtBrowserUrlButton1").val()) == false) {
        ShowErrorMessage(GlobalErrorList.MobilePushTemplate.Btn1BrowserurlValidUrl);
        return false;
    }

    //BUTTONS 2 ----------------------------------
    if ($("#btnTab2").is(":visible") && $.trim($("#ui_txtButton2").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.MobilePushTemplate.Btn2Lbl);
        return false;
    }

    if ($("#btnTab2").is(":visible") && ActionTypeButton2 == 'navigatescreen' && $("#ui_ddlScreenButton2 option:selected").val() == 'select') {
        ShowErrorMessage(GlobalErrorList.MobilePushTemplate.Btn2NavigateScreen);
        return false;
    }

    if ($("#btnTab2").is(":visible") && ActionTypeButton2 == 'navigatescreen' && $("#ui_ddlIosScreenButton2 option:selected").val() == 'select') {
        ShowErrorMessage(GlobalErrorList.MobilePushTemplate.IosBtn2NavigateScreen);
        return false;
    }

    if ($("#btnTab2").is(":visible") && ActionTypeButton2 == 'deeplinking' && $.trim($("#ui_txtDeepLinkingButton2").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.MobilePushTemplate.Btn2Deeplinking);
        return false;
    }

    if ($("#btnTab2").is(":visible") && ActionTypeButton2 == 'browserurl' && $.trim($("#ui_txtBrowserUrlButton2").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.MobilePushTemplate.Btn2Browserurl);
        return false;
    }
    if ($("#btnTab2").is(":visible") && ActionTypeButton2 == 'browserurl' && urlregex.test($("#ui_txtBrowserUrlButton2").val()) == false) {
        ShowErrorMessage(GlobalErrorList.MobilePushTemplate.Btn2BrowserurlValidUrl);
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
                ShowErrorMessage(GlobalErrorList.MobilePushTemplate.MaxTag);
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
                ShowErrorMessage(GlobalErrorList.MobilePushTemplate.TemplateTag);
                return false;
            }
        }
    }

    return true;
}

$('input[name="mobnotiftype"]').click(function () {
    let getmobnotiftpeval = $('input[name="mobnotiftype"]:checked').val();
    NotificationType = getmobnotiftpeval;
    if (getmobnotiftpeval == "inboxstyle") {
        $(".subtxtpara, .pushnotifbanwrp, .mobprofstylewrp, .imgoptns").addClass(
            "hideDiv"
        );
        $(".inboxstylepara").removeClass("hideDiv");
    } else if (getmobnotiftpeval == "picturestyle") {
        $(".inboxstylepara, .mobprofstylewrp").addClass("hideDiv");
        $(".pushnotifbanwrp, .subtxtpara, .imgoptns").removeClass("hideDiv");
    } else if (getmobnotiftpeval == "profilestyle") {
        $(".subtxtpara, .pushnotifbanwrp, .inboxstylepara, .imgoptns").addClass(
            "hideDiv"
        );
        $(".mobprofstylewrp").removeClass("hideDiv");
    } else {
        $(
            ".inboxstylepara, .pushnotifbanwrp, .mobprofstylewrp, .imgoptns"
        ).addClass("hideDiv");
        $(".subtxtpara").removeClass("hideDiv");
    }
});

$(".addmobvalpair").click(function () {
    let getmobvalfldmoreval = `<div class="mobvalpairitem">
  <input type="text" class="form-control" name=""
      placeholder="Name" id="">
  <input type="text"
      class="form-control mr-2 border-left-0"
      placeholder="Data" name="" id="">
  <button type="button"
      class="btn btn-outline-danger btn-sm delmobvalpair"><i
          class="fa fa-trash"></i></button>
</div>`;
    $(".mobvalpairmore").append(getmobvalfldmoreval);
});


if ($(".bnotibtnoption").length) {
    $(".bnotibtnoption").toggles({
        on: false,
        height: 22
    });
}

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
})

$(".minusbtnwrp").click(function () {
    $(this).addClass("hideDiv");
    $(this).prev().prev().addClass("hideDiv");
    $(this).prev().removeClass("hideDiv");
    $(".btn-notisecondary").addClass("hideDiv");
    $("#button2").fadeIn("slow").addClass("hideDiv");
    $("#button1").fadeIn("slow").removeClass("hideDiv");
    $(".nextbutton").addClass("hideDiv");
});

$("#mobdefclickact").change(function () {
    let getmobdefclcktype = $("#mobdefclickact option:selected").val();
    ActionType = getmobdefclcktype;
    if (getmobdefclcktype == "deeplinking") {
        $(".naviscreen, .richlandingpage").addClass("hideDiv");
        $(".deeplinkingfild, .mobnotifvalpair").removeClass("hideDiv");
    } else if (getmobdefclcktype == "browserurl") {
        $(".naviscreen, .deeplinkingfild, .mobnotifvalpair").addClass("hideDiv");
        $(".richlandingpage").removeClass("hideDiv");
    } else if (getmobdefclcktype == "Dismiss") {
        $(
            ".naviscreen, .deeplinkingfild, .mobnotifvalpair, .richlandingpage"
        ).addClass("hideDiv");
    } else {
        $(".richlandingpage, .deeplinkingfild").addClass("hideDiv");
        $(".naviscreen, .mobnotifvalpair").removeClass("hideDiv");
    }
});

$("#mobdefclickactbtn1").change(function () {
    let getmobdefbtn1val = $("#mobdefclickactbtn1 option:selected").val();
    ActionTypeButton1 = getmobdefbtn1val;
    if (getmobdefbtn1val == "deeplinking") {
        $(".naviscreenbtn1, .brwserurlbtn1").addClass("hideDiv");
        $(".deeplinkingfildbtn1, .mobnotifvalpairbtn1").removeClass("hideDiv");
    } else if (getmobdefbtn1val == "browserurl") {
        $(".naviscreenbtn1, .deeplinkingfildbtn1, .mobnotifvalpairbtn1").addClass(
            "hideDiv"
        );
        $(".brwserurlbtn1").removeClass("hideDiv");
    } else if (getmobdefbtn1val == "Dismiss") {
        $(
            ".naviscreenbtn1, .deeplinkingfildbtn1, .mobnotifvalpairbtn1, .brwserurlbtn1"
        ).addClass("hideDiv");
    } else {
        $(".deeplinkingfildbtn1, .brwserurlbtn1").addClass("hideDiv");
        $(".naviscreenbtn1, .mobnotifvalpairbtn1").removeClass("hideDiv");
    }
});

$("#mobdefclickactbtn2").change(function () {
    let getmobdefbtn2val = $("#mobdefclickactbtn2 option:selected").val();
    ActionTypeButton2 = getmobdefbtn2val;
    if (getmobdefbtn2val == "deeplinking") {
        $(".naviscreenbtn2, .brwserurlbtn2").addClass("hideDiv");
        $(".deeplinkingfildbtn2, .mobnotifvalpairbtn2").removeClass("hideDiv");
    } else if (getmobdefbtn2val == "browserurl") {
        $(".naviscreenbtn2, .deeplinkingfildbtn2, .mobnotifvalpairbtn2").addClass(
            "hideDiv"
        );
        $(".brwserurlbtn2").removeClass("hideDiv");
    } else if (getmobdefbtn2val == "Dismiss") {
        $(
            ".naviscreenbtn2, .deeplinkingfildbtn2, .mobnotifvalpairbtn2, .brwserurlbtn2"
        ).addClass("hideDiv");
    } else {
        $(".deeplinkingfildbtn2, .brwserurlbtn2").addClass("hideDiv");
        $(".naviscreenbtn2, .mobnotifvalpairbtn2").removeClass("hideDiv");
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

        if (fileid == "fileUploadBanner") {
            fromdata.append('width', 720); fromdata.append('height', 480);
        }

        var choice = {};
        choice.url = "/MobilePushNotification/DesignMobilePushTemplate/SaveImage",
            choice.type = "POST";
        choice.data = fromdata;
        choice.contentType = false;
        choice.processData = false;
        choice.async = false;
        choice.success = function (response) {
            var status = response;
            if (response == 0) {
                ShowErrorMessage(GlobalErrorList.WebpushTemplate.FileFormat);
            }
            else if (uploadFile["id"] == "fileUploadBanner") {
                banner = response;
                $(".pushnotifbanwrp").css("background-image", "url(" + banner + ")");
            }
            HidePageLoading();

            $(".chosefile").val('');
        };
        choice.error = function (result) {
            ShowErrorMessage(GlobalErrorList.WebpushTemplate.FileFormat);
        };
        $.ajax(choice);
        event.preventDefault();
    }
}

function GetTemplateDetail() {

    var mobilepushTemplate = MobilePushTemplate;
    $.ajax({
        url: "/MobilePushNotification/MobilePushTemplate/GetTemplateDetails",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'MobilePushTemplate': mobilepushTemplate }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.Id > 0) {

                NotificationType = response.NotificationType;
                if (NotificationType == 'picturestyle') {
                    $("#rdoBigPicture").prop("checked", true);
                    $("#mobnotiaddimg").prop("checked", true);

                    //$(".box-whitebdr.imgoptns, .notifbanwrp").removeClass('hideDiv');
                    //$(".brwsnotifilupl").addClass('hideDiv');
                    //$('.bwsnotiimgurl').removeClass('hideDiv');
                }

                var MessageBody = ReplaceCustomFields(response.Title);
                $("#ui_txtTitleTemplate").val(MessageBody);
                var MessageBody = ReplaceCustomFields(response.MessageContent);
                $("#ui_txtMessageTemplate").val(MessageBody);


                banner = response.ImageURL != null ? response.ImageURL : "";
                if (banner.length > 0) {
                    $(".pushnotifbanwrp").css("background-image", "url(" + banner + ")");
                    $(".inboxstylepara, .mobprofstylewrp").addClass("hideDiv");
                    $(".pushnotifbanwrp, .subtxtpara, .imgoptns").removeClass("hideDiv");
                    $("#txtBannerImage").val(banner);
                    $(".brwsnotifilupl").addClass("hideDiv");
                    $(".bwsnotiimgurl").removeClass("hideDiv");
                }

                $("#ui_txtSubMessageTemplate").val(response.SubTitle);

                $("#mobdefclickact").select2().val(response.ClickActionType).trigger('change');
                if (response.ClickActionType == 'navigatescreen') {
                    $("#ui_ddlScreen").select2().val(response.ClickActionURL).trigger('change');
                    $("#ui_ddlIosScreen").select2().val(response.ClickIosActionURL).trigger('change');
                }
                if (response.ClickActionType == 'deeplinking')
                    $("#ui_txtDeepLinking").val(response.ClickActionURL);
                if (response.ClickActionType == 'browserurl')
                    $("#ui_txtBrowserUrl").val(response.ClickActionURL);

                setKeyPairValue('', response.ClickKeyPairValue);

                if ((response.Button1Name != null) && response.Button1Name != "") {
                    $(".bnotibtnoption").trigger("click");
                    $("#ui_txtButton1").val(response.Button1Name);
                    $(".bnotbtn1").html(response.Button1Name);
                    $(".bwnotilbl").html(response.Button1Name.length);

                    var navType = response.Button1ActionType == null || response.Button1ActionType == '' ? 'navigatescreen' : response.Button1ActionType;
                    ActionTypeButton1 = navType;
                    $("#mobdefclickactbtn1").select2().val(navType).trigger('change');
                    if (navType == 'navigatescreen') {
                        $("#ui_ddlScreenButton1").select2().val(response.Button1ActionURL).trigger('change');
                        $("#ui_ddlIosScreenButton1").select2().val(response.Button1IosActionURL).trigger('change');
                    }
                    if (navType == 'deeplinking')
                        $("#ui_txtDeepLinkingButton1").val(response.Button1ActionURL);
                    if (navType == 'browserurl')
                        $("#ui_txtBrowserUrlButton1").val(response.Button1ActionURL);

                    setKeyPairValue('1', response.Button1ClickKeyPairValue);
                    //$(".bnotbtn1").html(response.Button1_Label);
                    //$(".bwnotilbl").html(response.Button1_Label.length);

                    if ((response.Button2Name != null) && response.Button2Name != "") {
                        $(".plusbtnwrp").trigger("click");
                        $("#ui_txtButton2").val(response.Button2Name);
                        $(".bnotbtn2").html(response.Button2Name);
                        $(".bwnotilbl2").html(response.Button2Name.length);

                        var navType = response.Button2ActionType == null || response.Button2ActionType == '' ? 'navigatescreen' : response.Button2ActionType;
                        ActionTypeButton2 = navType;
                        $("#mobdefclickactbtn2").select2().val(navType).trigger('change');
                        if (navType == 'navigatescreen') {
                            $("#ui_ddlScreenButton2").select2().val(response.Button2ActionURL).trigger('change');
                            $("#ui_ddlIosScreenButton2").select2().val(response.Button2IosActionURL).trigger('change');
                        }
                        if (navType == 'deeplinking')
                            $("#ui_txtDeepLinkingButton2").val(response.Button2ActionURL);
                        if (navType == 'browserurl')
                            $("#ui_txtBrowserUrlButton2").val(response.Button2ActionURL);

                        setKeyPairValue('2', response.Button2ClickKeyPairValue);
                        //$(".bnotbtn2").html(response.Button2_Label);
                        //$(".bwnotilb2").html(response.Button2_Label.length);
                    }
                }





                var str = PreviewSupport($("#ui_txtTitleTemplate").val());
                $(".notiftitle").html(str);
                $(".bnottitle").html(str.length);

                var str = PreviewSupport($("#ui_txtMessageTemplate").val());
                $(".notifdescript").html(str);
                $(".bwnotmess").html(str.length);


            }
        },
        error: ShowAjaxError
    });
}

$("#txtBannerImage").keyup(function () {
    banner = $("#txtBannerImage").val();
    //$(".notifbanwrp").css("background-image", "url(" + banner + ")");
});

$('input[name="bwsnotifileuploadtype"]').click(function () {
    let bwsnotifilenamval = $(this).val();
    if (bwsnotifilenamval == "bwsnotiaddimgfild") {
        $(".brwsnotifilupl").addClass("hideDiv");
        $(".bwsnotiimgurl").removeClass("hideDiv");
    } else {
        $(".bwsnotiimgurl").addClass("hideDiv");
        $(".brwsnotifilupl").removeClass("hideDiv");
    }
});

$("#ui_txtTitleTemplate").keyup(function () {
    var str = PreviewSupport($(this).val());
    $(".notiftitle").html(str);
    $(".bnottitle").html(str.length);
});
$("#ui_txtMessageTemplate").keyup(function () {
    var str = PreviewSupport($(this).val());
    $(".notifdescript").html(str);
    $(".notifdescript1").html(str);
    $(".notifdescript2").html(str);
    $(".bwnotmess").html(str.length);
});
$("#ui_txtSubMessageTemplate").keyup(function () {
    var str = PreviewSupport($(this).val());
    $(".notifsubtitle").html(str);
    $(".bnottitle").html(str.length);
});



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
function BindContactFields(fieldList) {

    if (fieldList.length > 0) {
        $.each(fieldList, function (i) {
            $("#draganddropcutomrenew").append('<option value="' + $(this)[0].FieldName + '">' + $(this)[0].FieldName + '</option>');
            $("#draganddropcutomre").append('<option value="' + $(this)[0].FieldName + '">' + $(this)[0].FieldName + '</option>');

            customFieldList.push($(this)[0].FieldName);
        });
    }
}

function GetScreenList() {
    $.ajax({
        type: "POST",
        url: "/MobilePushNotification/DesignMobilePushTemplate/GetScreenList",
        data: "{'accountId':'" + Plumb5AccountId + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response.Table, function () {
                $("#ui_ddlScreen").append('<option value="' + $(this)[0].ScreenName + '">' + $(this)[0].ScreenName + '</option>');
                $("#ui_ddlScreenButton1").append('<option value="' + $(this)[0].ScreenName + '">' + $(this)[0].ScreenName + '</option>');
                $("#ui_ddlScreenButton2").append('<option value="' + $(this)[0].ScreenName + '">' + $(this)[0].ScreenName + '</option>');

                $("#ui_ddlIosScreen").append('<option value="' + $(this)[0].ScreenName + '">' + $(this)[0].ScreenName + '</option>');
                $("#ui_ddlIosScreenButton1").append('<option value="' + $(this)[0].ScreenName + '">' + $(this)[0].ScreenName + '</option>');
                $("#ui_ddlIosScreenButton2").append('<option value="' + $(this)[0].ScreenName + '">' + $(this)[0].ScreenName + '</option>');
            });

            if (MobilePushTemplate.Id != 0) {
                GetTemplateDetail();
            }
        },
        error: ShowAjaxError
    });

}


$('#draganddropcutomrenew').on('change', function () {

    if ((50 - $("#ui_txtTitleTemplate").val().length) > 15 && this.value != "Select") {
        $("#ui_txtTitleTemplate").val($("#ui_txtTitleTemplate").val() + " [{*" + this.value + "*}]");
        var str = PreviewSupport($("#ui_txtTitleTemplate").val());
        $(".notiftitle").html(str);
        $(".bnottitle").html(str.length);
    } else { ShowErrorMessage(GlobalErrorList.WebpushTemplate.TitleLength); }
});
$('#draganddropcutomre').on('change', function () {
    if ((160 - $("#ui_txtTitleTemplate").val().length) > 15 && this.value != "Select") {
        $("#ui_txtMessageTemplate").val($("#ui_txtMessageTemplate").val() + " [{*" + this.value + "*}]");
        var str = PreviewSupport($("#ui_txtMessageTemplate").val());
        $(".notifdescript").html(str);
        $(".bwnotmess").html(str.length);
    } else { ShowErrorMessage(GlobalErrorList.WebpushTemplate.MessageLength); }
});

function AppendCustomField(MessageBody) {
    for (var i = 0; i < customFieldList.length; i++) {
        if (MessageBody.toLowerCase().indexOf("<!--" + customFieldList[i].toLowerCase() + "-->") > -1) {
            var regExp = new RegExp("<!--" + customFieldList[i] + "-->", "ig");  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "[{*CustomField" + (i + 1) + "*}]");
        }

        if (MessageBody.toLowerCase().indexOf("[{*" + customFieldList[i].toLowerCase() + "*}]") > -1) {
            var regExp = new RegExp("\\[\\{\\*" + customFieldList[i] + "\\*\\}\\]", "ig");  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "[{*CustomField" + (i + 1) + "*}]");
        }
    }
    return MessageBody;
}
function ReplaceCustomFields(MessageBody) {

    for (var i = 0; i < customFieldList.length; i++) {
        if (MessageBody.toLowerCase().indexOf(("<!--CustomField" + (i + 1) + "-->").toLowerCase()) > -1) {
            var regExp = new RegExp("<!--CustomField" + (i + 1) + "-->", "ig");  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "[{*" + customFieldList[i] + "*}]");
        }

        if (MessageBody.toLowerCase().indexOf(("[{*CustomField" + (i + 1) + "*}]").toLowerCase()) > -1) {
            var regExp = new RegExp("\\[\\{\\*CustomField" + (i + 1) + "\\*\\}\\]", "ig");  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "[{*" + customFieldList[i] + "*}]");
        }
    }
    return MessageBody;
}



function PreviewSupport(message) {
    var matches = message.match(/\[\{\*(.*?)\*\}\]/g);

    if (matches != null) {
        for (i = 0; i < matches.length; i++) {
            message = message.replace(matches[i], "xxxxxxxxxxxxxx");
        }
    }
    $("#ui_dvMessageContentPreview").html(message);
    return message;
}

function setKeyPairValue(selItem, KeyPairValue) {
    if (KeyPairValue != null && KeyPairValue != '' && KeyPairValue != undefined) {
        var splitVal = KeyPairValue.split(',');
        for (var k = 0; k < splitVal.length; k++) {
            var data = splitVal[k].split('=');
            if (k == 0) {
                $(".KeyPairValue" + selItem + " :input[type='text']").each(function (index) {
                    $(this).val(data[index]);
                });
            }
            else {
                selItem = selItem.length > 0 ? 'btn' + selItem : selItem;
                $(".addmobvalpair" + selItem).click();
                $(".mobvalpairmore" + selItem + " .mobvalpairitem:last-child :input[type='text']").each(function (index) {
                    $(this).val(data[index]);
                });
            }
        }
    }
}

function getKeyPairValue(selItem) {

    var key = ''; var ClickKeyPairValue = '';

    $(".KeyPairValue" + selItem + " :input[type='text']").each(function () {
        if (key.length > 0) {
            ClickKeyPairValue = key + "=" + $(this).val();
            key = '';
        } else {
            key = $(this).val();
        }

    });

    selItem = selItem.length > 0 ? 'btn' + selItem : selItem;
    $(".mobvalpairmore" + selItem + " :input[type='text']").each(function () {

        if (key.length > 0) {
            if (ClickKeyPairValue.length > 0)
                ClickKeyPairValue = ClickKeyPairValue + "," + key + "=" + $(this).val();
            else
                ClickKeyPairValue = key + "=" + $(this).val();

            key = '';
        } else {
            key = $(this).val();
        }

    });

    return ClickKeyPairValue;
}

$(".addmobvalpairbtn1").click(function () {
    let addmobkeyvalbtn1 = `<div class="mobvalpairitem">
  <input type="text" class="form-control" name=""
      placeholder="Name" id="">
  <input type="text"
      class="form-control mr-2 border-left-0"
      placeholder="Data" name="" id="">
  <button type="button"
      class="btn btn-outline-danger btn-sm delmobvalpair"><i
          class="fa fa-trash"></i></button>
</div>`;
    $(".mobvalpairmorebtn1").append(addmobkeyvalbtn1);
});

$(".addmobvalpairbtn2").click(function () {
    let addmobkeyvalbtn2 = `<div class="mobvalpairitem">
  <input type="text" class="form-control" name=""
      placeholder="Name" id="">
  <input type="text"
      class="form-control mr-2 border-left-0"
      placeholder="Data" name="" id="">
  <button type="button"
      class="btn btn-outline-danger btn-sm delmobvalpair"><i
          class="fa fa-trash"></i></button>
</div>`;
    $(".mobvalpairmorebtn2").append(addmobkeyvalbtn2);
});

$(".mobnotifvalpair, .mobnotifvalpairbtn1, .mobnotifvalpairbtn2").on(
    "click",
    ".delmobvalpair",
    function () {
        $(this).parent().remove();
    }
);

$('.addCampName').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$("#ui_txtButton1").keyup(function () {
    let bnotlbltxt = $(this).val();
    $(".bnotbtn1").html(bnotlbltxt);
    $(".bwnotilbl").html(bnotlbltxt.length);
});

$("#ui_txtButton2").keyup(function () {
    let bnotlbltxttwo = $(this).val();
    $(".bnotbtn2").html(bnotlbltxttwo);
    $(".bwnotilbl2").html(bnotlbltxttwo.length);
});