var actionType, TempId, TemplateName, TemplateDesc, CampaignId, customFieldList = [], ddlContactFields = ""; totalAttr1 = 0; totalAttr = 0; UrlList = [];
defaultFields = ["Name", "LastName", "EmailId", "PhoneNumber", "Location", "Gender", "MaritalStatus", "Education", "Occupation", "Interests", "CustomerScore", "AccountNumber"];
var getAttrVal = [];
var ddldata = '';
var checkforreturningtype = 0;
$(document).ready(function () {

    actionType = $.urlParam("actionType");
    TempId = $.urlParam("TempId");
    TemplateName = urlparamwithoutlowercase("TemplateName");
    TemplateDesc = $.urlParam("TemplateDesc");
    CampaignId = $.urlParam("CampaignId");
    $("#spnName").html(TemplateName);
    for (var k = 0; k < defaultFields.length; k++) {
        ddlContactFields += '<option value="' + defaultFields[k] + '">' + defaultFields[k] + '</option>';
    }
    DragDroReportUtil.Getlmscustomfields();
    DragDroReportUtil.GetReport();
    DragDroReportUtil.BindUrlEventMappingDetails('');
    GetContactFielddragdrop('Whatsapp');
    //CreateWhatsAppTemplateUtil.GetUserAttributes();
});

var CreateWhatsAppTemplateUtil = {
    GetTemplateUrls: function () {
        $.ajax({
            url: "/WhatsApp/WhatsAppTemplates/GetTemplateUrlList",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'WhatsAppTemplatesId': TempId }),
            success: CreateWhatsAppTemplateUtil.BindUrls,
            error: ShowAjaxError
        });
    },
    BindUrls: function (BindUrlsList) {
        if (BindUrlsList.length > 0) {
            $.each(BindUrlsList, function (i) {
                UrlList.push({ url: $(this)[0].UrlContent, id: '' + $(this)[0].Id + '' });
            });
        }

    },
    GetUserAttributes: function () {
        $.ajax({
            url: "/WhatsApp/WhatsAppTemplates/GetUserAttributes",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            success: CreateWhatsAppTemplateUtil.BindContactFields,
            error: ShowAjaxError
        });
    },
    BindContactFields: function (fieldList) {
        if (fieldList.length > 0) {
            $.each(fieldList, function (i) {
                $("#ddlDynamicValueBtn1, #ddlDynamicValueBtn2").append('<option value="' + $(this)[0].FieldName + '">' + $(this)[0].FieldName + '</option>');
                ddlContactFields += '<option value="' + $(this)[0].FieldName + '">' + $(this)[0].FieldName + '</option>';
                customFieldList.push($(this)[0].FieldName);
            });

            CreateWhatsAppTemplateUtil.GetTemplateUrls();
        }
        if (TaggingLmsCustomFields.length > 0) {
            ddlContactFields += '<option value="UserInfo^firstname">UserInfoName</option>';
            ddlContactFields += '<option value="UserInfo^lastname">UserInfoLastName</option>';
            ddlContactFields += '<option value="UserInfo^emailid">UserInfoEmailId</option>';
            ddlContactFields += '<option value="UserInfo^mobilephone">UserInfoPhoneNumber</option>';
            $.each(TaggingLmsCustomFields, function (i) {
                ddlContactFields += '<option value="' + $(this)[0].FieldDisplayName + '">' + $(this)[0].FieldDisplayName + '</option>';

            });

            CreateWhatsAppTemplateUtil.GetTemplateUrls();
        }
        if (parseInt(TempId) > 0) {
            $("#ui_a_ButnHtml").html(actionType == "edit" ? "Update" : "Duplicate");
            CreateWhatsAppTemplateUtil.GetSingle(TempId);
        }
        else
            HidePageLoading();
    },
    GetSingle: function (Id) {

        $.ajax({
            url: "/WhatsApp/WhatsAppTemplates/GetSingle",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'Id': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: CreateWhatsAppTemplateUtil.BindTemplateDetails,
            error: ShowAjaxError
        });
    },
    BindTemplateDetails: function (responsedata) {
        response = responsedata.Data;
        if (response != null) {

            $("input[name=templatetype][value=" + response.TemplateType + "]").attr('checked', 'checked');
            $("#ui_txt_WhiteListedTempName").val(response.WhitelistedTemplateName);

            $("#ui_txtArea_whatsapptxtmess").val(response.TemplateContent);
            var whatsappmessval = response.TemplateContent;
            $("#addwhatsapptext, #addwhatsapptextios").text(whatsappmessval);
            $(".whatsappmesscount").html(whatsappmessval.length);

            changeCategory(response.TemplateType);
            $("#whatsappimgurl").val(response.MediaFileURL);

            $("#ui_txt_Footer").val(response.TemplateFooter)

            $("#dvUserAttributes").html("");
            $("#addwhatsattruser").addClass("hideDiv");
            if (whatsappmessval != "") {
                BindVariableTagging(whatsappmessval);
                if ($("#dvUserAttributes").html() != '') {
                    $("#addwhatsattruser").removeClass("hideDiv");
                    var getAtrDataChk = response.UserAttributes;
                    if (getAtrDataChk != null) {
                        var getAtrData = getAtrDataChk.split('$@$');
                        for (var k = 0; k < getAtrData.length; k++) {
                            var len = k + 1;
                            var ddldata = ReplaceCustomFields(getAtrData[k]).replace('[{*', '').replace('*}]', '');

                            if (ContactPropertyList.indexOf(ddldata) || defaultFields.indexOf(ddldata) > -1 || customFieldList.indexOf(ddldata) > -1 || ddldata.indexOf("{{*[") > -1 || Lmscustomfielddetailstagging.indexOf(ddldata) > -1) {
                                var getDisplayCol = ddldata;
                                if (ddldata.indexOf("{{*[") > -1) {
                                    $("#txt_" + len).val(getDisplayCol);
                                    $("#ddlAttr_" + len).val(getDisplayCol).trigger('change');
                                }
                                else {
                                    $("#txt_" + len).val('[{*' + getDisplayCol + '*}]');
                                    $("#ddlAttr_" + len).val(getDisplayCol).trigger('change');
                                }
                            }
                            else {
                                if (UrlList.find(record => record.id === getAtrData[k].replace('[{*', '').replace('*}]', '')) != undefined)
                                    $("#txt_" + len).val(UrlList.find(record => record.id === getAtrData[k].replace('[{*', '').replace('*}]', '')).url);
                                else
                                    $("#txt_" + len).val(getAtrData[k]);
                            }



                        }
                    }
                }
            }

            $("#ui_drpdwn_TempLang").val(response.TemplateLanguage);

            if (response.ConvertLinkToShortenUrl != null && response.ConvertLinkToShortenUrl)
                $("#ui_chkConvertLinkToShortenUrl").prop("checked", true);
            else
                $("#ui_chkConvertLinkToShortenUrl").prop("checked", false);

            if (response.IsButtonAdded) {
                if (!$(".toggle-on").hasClass("active")) {
                    $(".whatsappbtnsett").trigger("click");
                }

                $(".rsscontItem").slideDown(500);
                $(".btnwhatsappwrp").removeClass("hideDiv");

                $("#selectactiontype").val(response.ButtonOneAction).trigger("change");
                $("#txtBtnText1").val(response.ButtonOneText);
                $("#spn_whatsvisitwebsite, #spn_whatsvisitwebsiteios").text(response.ButtonOneText);
                if (!$("#btnonetype").hasClass("hideDiv"))
                    $("#btnonetypeselect").val(response.ButtonOneType).trigger("change");
                if (!$("#btnoneurltype").hasClass("hideDiv"))
                    $("#btnurllink").val(response.ButtonOneURLType).trigger("change");
                if (!$("#dynamicurlwrp").hasClass("hideDiv")) {
                    if (UrlList.find(record => record.id === response.ButtonOneDynamicURLSuffix.replace('[{*', '').replace('*}]', '')) != undefined) {
                        let txtDynamicValueBtn1content = UrlList.find(record => record.id === response.ButtonOneDynamicURLSuffix.replace('[{*', '').replace('*}]', '')).url;
                        $("#txtDynamicValueBtn1").val(ReplaceCustomFields(txtDynamicValueBtn1content));
                    }
                    else
                        $("#txtDynamicValueBtn1").val(ReplaceCustomFields(response.ButtonOneDynamicURLSuffix));

                }

                if (response.ButtonTwoAction != null && response.ButtonTwoText != null) {
                    $(".plusbtnwhats").click();
                    $("#selectactiontypedrp").val(response.ButtonTwoAction).trigger("change");
                    $("#txtBtnText2").val(response.ButtonTwoText);
                    $("#spn_whatscallphone, #spn_whatscallphoneios").text(response.ButtonTwoText);

                    if (!$("#btntypetwo").hasClass("hideDiv"))
                        $("#btntypetwoseldrp").val(response.ButtonTwoType).trigger("change");
                    if (!$("#btnurltypetwo").hasClass("hideDiv"))
                        $("#btnurllink2").val(response.ButtonTwoURLType).trigger("change");
                    if (!$("#dynamicurlwrp2").hasClass("hideDiv")) {
                        if (UrlList.find(record => record.id === response.ButtonTwoDynamicURLSuffix.replace('[{*', '').replace('*}]', '')) != undefined) {
                            let txtDynamicValueBtn2content = UrlList.find(record => record.id === response.ButtonTwoDynamicURLSuffix.replace('[{*', '').replace('*}]', '')).url;

                            $("#txtDynamicValueBtn2").val(ReplaceCustomFields(txtDynamicValueBtn2content));
                        }
                        else
                            $("#txtDynamicValueBtn2").val(ReplaceCustomFields(response.ButtonTwoDynamicURLSuffix));
                    }
                }
            }
        }
        TempId = actionType == "duplicate" ? "0" : TempId;

        bindattrOnChange();

        HidePageLoading();
    },
    ValidateCreateWhatsAppTemplate: function () {
        var WhitelistedTemplateName = $.trim($("#ui_txt_WhiteListedTempName").val());
        if (WhitelistedTemplateName.length == 0) {
            ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.EnterWhitelistedTemplateName);
            return false;
        }

        var TemplateText = $.trim($("#ui_txtArea_whatsapptxtmess").val());
        if (TemplateText.length == 0) {
            ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.EnterTemplateText);
            return false;
        }


        if ($("#whatsapptext").is(":checked") == false && $("#whatsappimgurl").val() == '') {
            ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.TemplateMediaUrl);
            return false;
        }

        if ($(".toggle-on").hasClass("active")) {
            if ($("#selectactiontype").val() == "select") {
                ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.EnterButnOneActionType);
                return false;
            }

            var ButnOneText = $.trim($("#txtBtnText1").val());
            if (ButnOneText.length == 0) {
                ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.EnterButnOneText);
                return false;
            }

            if (!$("#btnonetype").hasClass("hideDiv")) {
                if ($("#btnonetypeselect").val() == "select") {
                    ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.EnterButnOneType);
                    return false;
                }
            }

            if (!$("#btnoneurltype").hasClass("hideDiv")) {
                if ($("#btnurllink").val() == "select") {
                    ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.EnterButnOneUrlLink);
                    return false;
                }
            }
            let csteventregex = /\{{.*?}\}/gi;
            let cstuserregex = /\[{.*?}\]/gi;
            if (!$("#dynamicurlwrp").hasClass("hideDiv")) {
                var ButnOneDynamicURLSufix = $.trim($("#txtDynamicValueBtn1").val());
                if (csteventregex.test($("#txtDynamicValueBtn1").val()) == false) {
                    if (cstuserregex.test($("#txtDynamicValueBtn1").val()) == false) {
                        if (ButnOneDynamicURLSufix.length == 0 || ButnOneDynamicURLSufix.indexOf('http') == -1) {
                            ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.EnterButnOneDynamicURLSuffix);
                            return false;
                        }
                    }
                }
            }


            if (!$("#ui_btn_Button2").hasClass("hideDiv")) {
                if ($("#selectactiontypedrp").val() == "select") {
                    ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.EnterButnTwoActionType);
                    return false;
                }

                var ButnTwoText = $.trim($("#txtBtnText2").val());
                if (ButnTwoText.length == 0) {
                    ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.EnterButnTwoText);
                    return false;
                }

                if (!$("#btntypetwo").hasClass("hideDiv")) {
                    if ($("#btntypetwoseldrp").val() == "select") {
                        ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.EnterButnTwoType);
                        return false;
                    }
                }

                if (!$("#btnurltypetwo").hasClass("hideDiv")) {
                    if ($("#btnurllink2").val() == "select") {
                        ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.EnterButnTwoUrlLink);
                        return false;
                    }
                }
                if (!$("#dynamicurlwrp2").hasClass("hideDiv")) {
                    var ButnTwoDynamicURLSufix = $.trim($("#txtDynamicValueBtn2").val());
                    if (csteventregex.test($("#txtDynamicValueBtn2").val()) == false) {
                        if (cstuserregex.test($("#txtDynamicValueBtn2").val()) == false) {
                            if (ButnTwoDynamicURLSufix.length == 0 || ButnTwoDynamicURLSufix.indexOf('http') == -1) {
                                ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.EnterButnTwoDynamicURLSuffix);
                                return false;
                            }
                        }
                    }
                }

            }

        }

        return true;
    },
    SaveWhatsAppTemplate: function (whatsAppTemplate) {
        $.ajax({
            url: "/WhatsApp/WhatsAppTemplates/SaveTemplate",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'whatsAppTemplate': whatsAppTemplate }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                let TemplateID = response.returnVal;
                if (TemplateID > 0) {
                    if (actionType == "save")
                        ShowSuccessMessage(GlobalErrorList.WhatsAppTemplate.TemplateSaved);
                    else
                        ShowSuccessMessage(GlobalErrorList.WhatsAppTemplate.TemplateDuplicated);

                    setTimeout(function () { CreateWhatsAppTemplateUtil.RelocateToTemplate(); }, 3000);
                }
                else if (TemplateID == -1) {
                    ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.TemplateSavedFalseNameExist);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.TemplateSavedFalse);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    UpdateWhatsAppTemplate: function (whatsAppTemplate) {
        $.ajax({
            url: "/WhatsApp/WhatsAppTemplates/UpdateTemplate",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'whatsAppTemplate': whatsAppTemplate }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.returnVal) {
                    ShowSuccessMessage(GlobalErrorList.WhatsAppTemplate.TemplateUpdated);
                    //setTimeout(function () { CreateWhatsAppTemplateUtil.RelocateToTemplate(); }, 3000);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.TemplateUpdatedFalse);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    RelocateToTemplate: function () {
        window.location.href = "/WhatsApp/WhatsAppTemplates/Index";
    },
    SaveUploadFile: function (fileid) {
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


            var fileExtension = ['jpg', 'png'];
            if ($.inArray(uploadedfile[0].name.split('.').pop().toLowerCase(), fileExtension) == -1 && $("input[type='radio'][name='templatetype']:checked").val() == 'image') {
                ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.FileFormat);
                HidePageLoading();
                return false;
            }
            fileExtension = ['mp4'];
            if ($.inArray(uploadedfile[0].name.split('.').pop().toLowerCase(), fileExtension) == -1 && $("input[type='radio'][name='templatetype']:checked").val() == 'video') {
                ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.FileFormat);
                HidePageLoading();
                return false;
            }
            fileExtension = ['pdf'];
            if ($.inArray(uploadedfile[0].name.split('.').pop().toLowerCase(), fileExtension) == -1 && $("input[type='radio'][name='templatetype']:checked").val() == 'document') {
                ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.FileFormat);
                HidePageLoading();
                return false;
            }

            var choice = {};
            choice.url = "/WhatsApp/WhatsAppTemplates/SaveUploadFile";
            choice.type = "POST";
            choice.data = fromdata;
            choice.contentType = false;
            choice.processData = false;
            choice.async = false;
            choice.success = function (response) {
                var status = response;
                if (response == 0) {
                    ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.FileFormat);
                }
                else {

                    $("#whatsappimgurl").val(response);
                    $(".appndfile").html(uploadedfile[0].name);
                    $(".brwsfilename").removeClass("hideDiv");
                }
                HidePageLoading();
                $(".chosefile").val('');
            };
            choice.error = function (result) {
                ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.FileFormat);
            };
            $.ajax(choice);
            event.preventDefault();
        }
    }
};


$('.brwsfileremove').click(function () {
    $(".brwsfilename").addClass("hideDiv");
    $("#whatsappimgurl").val('');
});

$('#ui_btn_SaveTemplate').click(function () {
    if (!CreateWhatsAppTemplateUtil.ValidateCreateWhatsAppTemplate())
        return false;

    var getAttrVal = [];
    if (totalAttr != 0) {
        for (var i = 1; i <= totalAttr; i++) {

            var getAttrColumn = AppendCustomField($("#txt_" + i).val());
            if (getAttrColumn != '') {
                if (getAttrColumn.indexOf('http') > -1) {
                    if (!isValidURL(getAttrColumn)) {
                        ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.EnterAttributesURL, i);
                        $("#txt_" + i).focus();
                        return false;
                    }
                }
            }
            else {
                ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.EnterAttributes, i);
                $("#txt_" + i).focus();
                return false;
            }
            getAttrVal.push(getAttrColumn);
        }
    }

    ShowPageLoading();
    if (parseInt(TempId) == 0 && actionType == "duplicate" || actionType == "save") {
        let whatsAppTemplate = {
            Id: 0,
            UserInfoUserId: 0,
            UserGroupId: 0,
            WhatsAppCampaignId: parseInt(CampaignId),
            Name: TemplateName,
            TemplateDescription: TemplateDesc,
            TemplateType: $.trim($("input[type='radio'][name='templatetype']:checked").val()),
            WhitelistedTemplateName: $.trim($("#ui_txt_WhiteListedTempName").val()),
            TemplateContent: $.trim($("#ui_txtArea_whatsapptxtmess").val()),
            TemplateLanguage: $.trim($("#ui_drpdwn_TempLang").val()),
            UserAttributes: getAttrVal.join('$@$'),
            IsButtonAdded: $(".toggle-on").hasClass("active") ? true : false,
           
            CreatedDate: null,
            UpdatedDate: null,
            MediaFileURL: $("#whatsappimgurl").val().length > 0 ? $.trim($("#whatsappimgurl").val()) : "",
            TemplateFooter: $.trim($("#ui_txt_Footer").val()),
            ConvertLinkToShortenUrl: $("#ui_chkConvertLinkToShortenUrl").is(":checked") ? true : false
        };
        if ($(".toggle-on").hasClass("active")) {
            whatsAppTemplate.ButtonOneAction = $("#selectactiontype").val() != "select" ? $.trim($("#selectactiontype").val()) : "";
            whatsAppTemplate.ButtonOneText = $("#txtBtnText1").val().length > 0 ? $.trim($("#txtBtnText1").val()) : "";
            whatsAppTemplate.ButtonOneType = $("#btnonetypeselect").val() != "select" ? $.trim($("#btnonetypeselect").val()) : "";
            whatsAppTemplate.ButtonOneURLType = $("#btnurllink").val() != "select" ? $.trim($("#btnurllink").val()) : "";
            whatsAppTemplate.ButtonOneDynamicURLSuffix = $("#txtDynamicValueBtn1").val().length > 0 ? AppendCustomField($.trim($("#txtDynamicValueBtn1").val())) : "";
        }
        if (!$("#ui_btn_Button2").hasClass("hideDiv")) {
            whatsAppTemplate.ButtonTwoAction = $("#selectactiontypedrp").val() != "select" ? $.trim($("#selectactiontypedrp").val()) : "";
            whatsAppTemplate.ButtonTwoText = $("#txtBtnText2").val().length > 0 ? $.trim($("#txtBtnText2").val()) : "";
            whatsAppTemplate.ButtonTwoType = $("#btntypetwoseldrp").val() != "select" ? $.trim($("#btntypetwoseldrp").val()) : "";
            whatsAppTemplate.ButtonTwoURLType = $("#btnurllink2").val() != "select" ? $.trim($("#btnurllink2").val()) : "";
            whatsAppTemplate.ButtonTwoDynamicURLSuffix = $("#txtDynamicValueBtn2").val().length > 0 ? AppendCustomField($.trim($("#txtDynamicValueBtn2").val())) : "";
        }
        CreateWhatsAppTemplateUtil.SaveWhatsAppTemplate(whatsAppTemplate);
    }
    else if (actionType == "edit") {
        let whatsAppTemplate = {
            Id: parseInt(TempId),
            UserInfoUserId: 0,
            UserGroupId: 0,
            WhatsAppCampaignId: parseInt(CampaignId),
            Name: TemplateName,
            TemplateDescription: TemplateDesc,
            TemplateType: $.trim($("input[type='radio'][name='templatetype']:checked").val()),
            WhitelistedTemplateName: $.trim($("#ui_txt_WhiteListedTempName").val()),
            TemplateContent: $.trim($("#ui_txtArea_whatsapptxtmess").val()),
            TemplateLanguage: $.trim($("#ui_drpdwn_TempLang").val()),
            UserAttributes: getAttrVal.join('$@$'),
            IsButtonAdded: $(".toggle-on").hasClass("active") ? true : false,
          
            CreatedDate: null,
            UpdatedDate: null,
            MediaFileURL: $("#whatsappimgurl").val().length > 0 ? $.trim($("#whatsappimgurl").val()) : "",
            TemplateFooter: $.trim($("#ui_txt_Footer").val()),
            ConvertLinkToShortenUrl: $("#ui_chkConvertLinkToShortenUrl").is(":checked") ? true : false
        };
        if ($(".toggle-on").hasClass("active")) {
            whatsAppTemplate.ButtonOneAction = $("#selectactiontype").val() != "select" ? $.trim($("#selectactiontype").val()) : "";
            whatsAppTemplate.ButtonOneText = $("#txtBtnText1").val().length > 0 ? $.trim($("#txtBtnText1").val()) : "";
            whatsAppTemplate.ButtonOneType = $("#btnonetypeselect").val() != "select" ? $.trim($("#btnonetypeselect").val()) : "";
            whatsAppTemplate.ButtonOneURLType = $("#btnurllink").val() != "select" ? $.trim($("#btnurllink").val()) : "";
            whatsAppTemplate.ButtonOneDynamicURLSuffix = $("#txtDynamicValueBtn1").val().length > 0 ? AppendCustomField($.trim($("#txtDynamicValueBtn1").val())) : "";
        }
        if (!$("#ui_btn_Button2").hasClass("hideDiv")) {
            whatsAppTemplate.ButtonTwoAction = $("#selectactiontypedrp").val() != "select" ? $.trim($("#selectactiontypedrp").val()) : "";
            whatsAppTemplate.ButtonTwoText = $("#txtBtnText2").val().length > 0 ? $.trim($("#txtBtnText2").val()) : "";
            whatsAppTemplate.ButtonTwoType = $("#btntypetwoseldrp").val() != "select" ? $.trim($("#btntypetwoseldrp").val()) : "";
            whatsAppTemplate.ButtonTwoURLType = $("#btnurllink2").val() != "select" ? $.trim($("#btnurllink2").val()) : "";
            whatsAppTemplate.ButtonTwoDynamicURLSuffix = $("#txtDynamicValueBtn2").val().length > 0 ? AppendCustomField($.trim($("#txtDynamicValueBtn2").val())) : "";
        }
        CreateWhatsAppTemplateUtil.UpdateWhatsAppTemplate(whatsAppTemplate);
    }
});


$('.addCampName').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$(".bnotiadvanOptions").toggles({
    on: false,
    height: 22
});

$(".whatsappbtnsett").toggles({
    on: false,
    height: 22
});

$('.whatsappbtnsett').on('toggle', function (e, active) {
    if (active) {
        $(".rsscontItem").slideDown(500);
        $(".btnwhatsappwrp").removeClass("hideDiv");
    } else {
        $(".rsscontItem").slideUp(500);
        $(".btnwhatsappwrp").addClass("hideDiv");
    }
});

$(".bnotiadvanOptions").on('toggle', function (e, active) {
    if (active) {
        $(".whatsconvers").slideDown(500);
        $(".btnwhatsappwrp").removeClass("hideDiv");
    } else {
        $(".whatsconvers").slideUp(500);
        $(".btnwhatsappwrp").addClass("hideDiv");
    }
});


$("input[name='templatetype']").click(function () {
    var templtypeIschecked = $(this).is(":checked");
    var templtypeItem = $("input[name=templatetype]:checked").val();

    changeCategory(templtypeItem);

    $(".appndfile").html('');
    $(".brwsfilename").addClass("hideDiv");
    $("#whatsappimgurl").val('');
    $("#whatsappmediaurl").prop("checked", true);
    $("#mediauploadfiles").addClass("hideDiv");
    /* $("#mediaurlmain").removeClass("hideDiv");*/
});

function changeCategory(templtypeItem) {
    $(".mediaexp").text("");
    if (templtypeItem == "text") {
        $(
            "#whatsappuploadtype, #mediaurlmain, #mediauploadfiles, .whatsappimgwrp"
        ).addClass("hideDiv");
        $("#whatsappmediaurl").prop("checked", true);
    } else if (templtypeItem == "image") {
        $(".mediaexp").text("(jpg or png)");
        $("#whatsappuploadtype, #mediaurlmain, .whatsappimgwrp").removeClass(
            "hideDiv"
        );
        $("#addwhatsappimage, #addwhatsappimageIos").attr(
            "src",
            "/Content/images/white_image.png"
        );
    } else if (templtypeItem == "video") {
        $(".mediaexp").text("(mp4)");
        $("#whatsappuploadtype, #mediaurlmain, .whatsappimgwrp").removeClass(
            "hideDiv"
        );
        $("#addwhatsappimage, #addwhatsappimageIos").attr(
            "src",
            "/Content/images/white_video.png"
        );
    } else if (templtypeItem == "document") {
        $(".mediaexp").text("(pdf)");
        $("#whatsappuploadtype, #mediaurlmain, .whatsappimgwrp").removeClass(
            "hideDiv"
        );
        $("#addwhatsappimage, #addwhatsappimageIos").attr(
            "src",
            "/Content/images/white_document.png"
        );
    } else {
        $("#whatsappuploadtype, #mediaurlmain, .whatsappimgwrp").removeClass(
            "hideDiv"
        );
        $("#addwhatsappimage, #addwhatsappimageIos").attr(
            "src",
            "/Content/images/white_location.png"
        );
    }
}

$("input[name='whatsappmediatype']").click(function () {
    let whatsmedtypeval = $("input[name=whatsappmediatype]:checked").val();
    if (whatsmedtypeval == "mediauploadfile") {
        $("#mediaurlmain").addClass("hideDiv");
        $("#mediauploadfiles").removeClass("hideDiv");
    } else {
        $("#mediauploadfiles").addClass("hideDiv");
        $("#mediaurlmain").removeClass("hideDiv");
    }
});

$(".plusbtnwhats").click(function () {
    $(this).addClass("hideDiv");
    $(this).prev().removeClass("hideDiv");
    $(this).next().removeClass("hideDiv");
    $("#whatscallphone, #whatscallphoneios").removeClass("hideDiv");
});

$(".minusbtnwhats").click(function () {
    $(this).addClass("hideDiv");
    $(this).prev().prev().addClass("hideDiv");
    $(this).prev().removeClass("hideDiv");
    $("#whatscallphone, #whatscallphoneios").addClass("hideDiv");
    $("#button2").fadeIn("slow").addClass("hideDiv");
    $("#button1").fadeIn("slow").removeClass("hideDiv");
});

$(".whatsappedit").click(function () {
    $(".popupcontainer, #btn-next-whats").removeClass("hideDiv");
    $("#whatsappEditInfo, .popupfooter").removeClass("hideDiv");
    $("#whatsappprevpopup, #whatsbtnsub").addClass("hideDiv");
    $(".popuptitlwrp h6").text("Edit Template");
    $("#whatsappNamesms option[value='test Alex']").attr("selected", true);
    $("#whatsappNamesms option[value='test Alex']").val("test Alex");
    $("#smstempName").val("Festival Offer Template and new year");
    $("#smstempdes").val("Festival Offer Template and new year");
});

$(".prevwhatsapp").click(function () {
    $(".popupcontainer, #btn-next-whats").removeClass("hideDiv");
    $(
        "#whatsappEditInfo, .popupfooter, #whatsbtnsub, #whatsappTestTemp"
    ).addClass("hideDiv");
    $(".popuptitlwrp h6").text("Preview Template");
    $("#whatsappprevpopup").removeClass("hideDiv");
});

$(".whatsapptest").click(function () {
    $(
        ".popupcontainer, #whatsappTestTemp, .popupfooter, #whatsbtnsub"
    ).removeClass("hideDiv");
    $("#whatsappEditInfo, #whatsappprevpopup, #btn-next-whats").addClass(
        "hideDiv"
    );
    $(".popuptitlwrp h6").text("Test Campaign Template");
});

$("#pushnotiprevpopup").click(function () {
    $(".popupcontainer").removeClass("hideDiv");
});

$("#selectactiontype").change(function () {
    var actiontypeval = $("#selectactiontype option:selected").val();
    if (actiontypeval == "Call") {
        $("#btnonetype").removeClass("hideDiv");
    } else {
        $('#btnonetypeselect').val('select');
        $("#btnonetype, #btnoneurltype, #dynamicurlwrp").addClass("hideDiv");
        $("#imgBtn1,#imgBtn1ios").removeClass();
    }
});

$("#btnonetypeselect").change(function () {
    var btnonetypeselval = $("#btnonetypeselect option:selected").val();
    $("#imgBtn1,#imgBtn1ios").removeClass();
    $('#btnurllink').val('select');
    if (btnonetypeselval == "Website") {
        $("#btnoneurltype").removeClass("hideDiv");
        $("#imgBtn1,#imgBtn1ios").addClass("fa fa-external-link");
    } else if (btnonetypeselval == "Call") {
        $("#btnoneurltype, #dynamicurlwrp").addClass("hideDiv");
        $("#imgBtn1,#imgBtn1ios").addClass("fa fa-phone");
    } else {
        $("#btnoneurltype, #dynamicurlwrp").addClass("hideDiv");
    }
});

$("#selectactiontypedrp").change(function () {
    var btnselctactiontypetwoval = $("#selectactiontypedrp option:selected").val();
    if (btnselctactiontypetwoval == "Call") {
        $("#btntypetwo").removeClass("hideDiv");
    } else {
        $('#btntypetwoseldrp').val('select');
        $("#btntypetwo, #btnurltypetwo, #dynamicurlwrp2").addClass("hideDiv");
        $("#imgBtn2,#imgBtn2ios").removeClass();
    }
});

$("#btntypetwoseldrp").change(function () {
    var btntypetwoseltwoval = $("#btntypetwoseldrp option:selected").val();
    $("#imgBtn2,#imgBtn2ios").removeClass();
    $('#btnurllink2').val('select');
    if (btntypetwoseltwoval == "Website") {
        $("#btnurltypetwo").removeClass("hideDiv");
        $("#imgBtn2,#imgBtn2ios").addClass("fa fa-external-link");
    } else if (btntypetwoseltwoval == "Call") {
        $("#btnurltypetwo,#dynamicurlwrp2").addClass("hideDiv");
        $("#imgBtn2,#imgBtn2ios").addClass("fa fa-phone");
    } else {
        $("#btnurltypetwo,#dynamicurlwrp2").addClass("hideDiv");

    }
});

$("#btnurllink").change(function () {
    var btnurllinkval = $("#btnurllink option:selected").val();
    if (btnurllinkval == "Dynamic") {
        $("#dynamicurlwrp").removeClass("hideDiv");
    } else {
        $("#dynamicurlwrp").addClass("hideDiv");
    }
});

$("#btnurllink2").change(function () {
    var btnurllinkval2 = $("#btnurllink2 option:selected").val();
    if (btnurllinkval2 == "Dynamic") {
        $("#dynamicurlwrp2").removeClass("hideDiv");
    } else {
        $("#dynamicurlwrp2").addClass("hideDiv");
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
    $("#" + bnotbtntab)
        .fadeIn("slow")
        .removeClass("hideDiv");
});



function BindUserAttributesValues() {
    if (getAttrVal != null) {
        var getAtrData = getAttrVal.toString().split(',');
        for (var k = 0; k < getAtrData.length; k++) {
            var len = k + 1;

            var ddldata = ReplaceCustomFields(getAtrData[k]).replace('[{*', '').replace('*}]', '');
            if (defaultFields.indexOf(ddldata) > -1 || customFieldList.indexOf(ddldata) > -1 || customeventFieldList.indexOf(ddldata) > -1) {
                var getDisplayCol = ddldata;
                $("#txt_" + len).val('[{*' + getDisplayCol + '*}]');
                $("#ddlAttr_" + len).val(getDisplayCol).trigger('change');
            }
            else {
                if (UrlList.find(record => record.id === getAtrData[k].replace('[{*', '').replace('*}]', '')) != undefined)
                    $("#txt_" + len).val(UrlList.find(record => record.id === getAtrData[k].replace('[{*', '').replace('*}]', '')).url);
                else
                    $("#txt_" + len).val(getAtrData[k]);
            }

        }
        bindattrOnChange();
    }

    getAttrVal = [];

}
function Rebinddetailsofuserattribute(MessageBody) {
    totalAttr1 = 0;
    var getAttribute = "";
    var MessageBodyList = MessageBody.split(' ');
    for (var i = 0; i < MessageBodyList.length; i++) {
        if (MessageBodyList[i].indexOf("<") > -1 || MessageBodyList[i].indexOf("{") > -1 || MessageBodyList[i].indexOf("[") > -1) {

            var splCharcter = MessageBodyList[i].indexOf("<") > -1 ? ">" : MessageBodyList[i].indexOf("{") > -1 ? "}" : "]";
            var lstIndex = MessageBodyList[i].lastIndexOf(splCharcter) + 1;

            totalAttr1 = totalAttr1 + 1;

            getAttribute = '<div class="whatsuserattrwrp"><div class="userattrvar mr-2"> {{' + totalAttr1 + '}} </div >' +
                '<div class="userattrvar mr-2"> = </div>' +
                '<div class="userattrlist w-90 position-relative">' +
                '<input type="text" class="form-control" id = "txt_' + totalAttr1 + '">' +
                '<div class="whatsuserartribwrp dropdown">' +
                '<div class="drpicon" title="User Attributes" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                '<i class="icon ion-android-person"></i>' +
                '</div>' +
                '<div class="dropdown-menu dropdown-menu-right keepopen p-0" aria-labelledby="filterTags" x-placement="bottom-end" style="position: absolute; transform: translate3d(12px, 24px, 0px); top: 0px; left: 0px; will-change: transform;">' +
                '<div class="dropdwntabwrap">' +
                '<div class="dropdwntabitem">' +
                '<div id="divuserattr' + totalAttr1 + '"  dataidheader="drpuserattr' + totalAttr + '" class="dropdwntabs active ddlAttribute">User Attribute</div>' +
                '<div id="divcustomeve' + totalAttr1 + '"   dataidheader="drpcustomeve' + totalAttr + '" class="dropdwntabs  ddlAttribute">Custom Events</div>' +
                '</div>' +
                '<div class="dropdwntabcontwrap">' +
                '<div   id="drpuserattr' + totalAttr1 + '" class="userattribwrap ddlAttribute">' +
                '<h6 class="dropdown-title">User Attribute</h6>' +
                '<select  dataid="' + totalAttr1 + '" id = "ddlAttr_' + totalAttr1 + '" class="form-control addCampName select2-hidden-accessible ddlAttribute" data-placeholder="Select User Attributes" tabindex="-1" aria-hidden="true">' +
                '<option value = "select"> select</option>' + ddlContactFields + '' +
                '</select>' +
                '</div>' +

                '<div   id="drpdivcustomeve' + totalAttr1 + '" class="userattribwrap hideDiv ddlAttribute">' +
                '<h6 class="dropdown-title">Custom Events</h6>' +
                '<select dataid="' + totalAttr1 + '" id="eventnamemessage' + totalAttr1 + '" class="form-control addCampName select2-hidden-accessible" data-placeholder="Select Group(s)" tabindex="-1" aria-hidden="true">' +
                '<option value = "select"> select</option>' + ddlContacteventFields + '' +

                '</select>' +
                '<div class="mt-3">' +
                '<select dataiditem="' + totalAttr1 + '" id="eventitems' + totalAttr1 + '" class="form-control addCampName select2-hidden-accessible ddlAttribute" data-placeholder="Select Group(s)" tabindex="-1" aria-hidden="true">' +
                '<option value = "select"> select</option>' + ddlContacteventFields + '' +

                '</select>' +
                '</div>' +

                '</div>' +

                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div >';


            //$("#dvUserAttributes").append(getAttribute);
            //$("#ddlAttr_" + totalAttr1).select2().trigger('change');

        }
        $(".dropdown-menu.keepopen").click(function (e) {
            e.stopPropagation();
        });
    }
    if (totalAttr1 != 0) {

        for (var i = 1; i <= totalAttr1; i++) {
            var getAttrColumn = '';
            if ($("#txt_" + i).val() != undefined) {
                getAttrColumn = AppendCustomField($("#txt_" + i).val());
            }
            getAttrVal.push(getAttrColumn);
        }

    }
}
function BindUserAttributes(MessageBody) {
    Rebinddetailsofuserattribute(MessageBody);
    $("#dvUserAttributes").html("");
    BindVariableTagging(MessageBody);
    BindUserAttributesValues();
}


function BindVariableTagging(MessageBody) {

    totalAttr = 0;
    var getAttribute = "";
    var MessageBodyList = MessageBody.split(' ');
    $("#dvUserAttributes").html("");
    for (var i = 0; i < MessageBodyList.length; i++) {
        if (MessageBodyList[i].indexOf("<") > -1 || MessageBodyList[i].indexOf("{") > -1 || MessageBodyList[i].indexOf("[") > -1) {

            var splCharcter = MessageBodyList[i].indexOf("<") > -1 ? ">" : MessageBodyList[i].indexOf("{") > -1 ? "}" : "]";
            var lstIndex = MessageBodyList[i].lastIndexOf(splCharcter) + 1;

            totalAttr = totalAttr + 1;

            getAttribute = '<div class="whatsuserattrwrp"><div class="userattrvar mr-2"> {{' + totalAttr + '}} </div >' +
                '<div class="userattrvar mr-2"> = </div>' +
                '<div class="userattrlist w-90 position-relative">' +
                '<input type="text" class="form-control" id = "txt_' + totalAttr + '">' +
                '<div class="whatsuserartribwrp dropdown">' +
                '<div class="drpicon" title="User Attributes" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                '<i class="icon ion-android-person"></i>' +
                '</div>' +
                '<div class="dropdown-menu dropdown-menu-right keepopen p-0" aria-labelledby="filterTags" x-placement="bottom-end" style="position: absolute; transform: translate3d(12px, 24px, 0px); top: 0px; left: 0px; will-change: transform;">' +
                '<div class="dropdwntabwrap">' +
                '<div class="dropdwntabitem">' +
                '<div id="divuserattr' + totalAttr + '"  dataidheader="drpuserattr' + totalAttr + '" class="dropdwntabs active ddlAttribute">User Attribute</div>' +
                '<div id="divcustomeve' + totalAttr + '"   dataidheader="drpcustomeve' + totalAttr + '" class="dropdwntabs  ddlAttribute">Custom Events</div>' +
                '</div>' +
                '<div class="dropdwntabcontwrap">' +
                '<div   id="drpuserattr' + totalAttr + '" class="userattribwrap ddlAttribute">' +
                '<h6 class="dropdown-title">User Attribute</h6>' +
                '<select  dataid="' + totalAttr + '" id = "ddlAttr_' + totalAttr + '" class="form-control addCampName select2-hidden-accessible ddlAttribute" data-placeholder="Select User Attributes" tabindex="-1" aria-hidden="true">' +
                '<option value = "select"> select</option>' + ddlContactFields + '' +
                '</select>' +
                '</div>' +

                '<div   id="drpcustomeve' + totalAttr + '" class="userattribwrap hideDiv ddlAttribute">' +
                '<h6 class="dropdown-title">Custom Events</h6>' +
                '<select dataid="' + totalAttr + '" id="eventnamemessage' + totalAttr + '" class="form-control addCampName select2-hidden-accessible" data-placeholder="Select Group(s)" tabindex="-1" aria-hidden="true">' +
                '<option value = "select"> select</option>' + ddlContacteventFields + '' +

                '</select>' +
                '<div class="mt-3">' +
                '<select dataiditem="' + totalAttr + '" id="eventitems' + totalAttr + '" class="form-control addCampName select2-hidden-accessible ddlAttribute" data-placeholder="Select Group(s)" tabindex="-1" aria-hidden="true">' +
                '<option value = "select"> select</option>' + ddlContacteventFields + '' +

                '</select>' +
                '</div>' +

                '</div>' +

                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div >';

            $("#dvUserAttributes").append(getAttribute);
            $("#ddlAttr_" + totalAttr).select2().trigger('change');
            $("#eventnamemessage" + totalAttr).select2().trigger('change');
            $("#eventitems" + totalAttr).select2().trigger('change');
        }

    }

    $(".dropdown-menu.keepopen").click(function (e) {
        e.stopPropagation();
    });
}
var eventname;
function bindattrOnChange() {

    $('.ddlAttribute').on('change', function () {

        var ctrId = ''
        let newMessageContent = '';
        if (this.value != "Select") {
            ctrId = $(this).attr('dataid');
            if (ctrId == '' || ctrId == undefined) {
                ctrId = $(this).attr('dataiditem');

                newMessageContent = "{{*[" + eventname + "]~[" + this.value + "]~[TOP1.DESC]~[fallbackdata]*}}";
            }
            else
                newMessageContent = `[{*${this.value}*}]`;
            $('#txt_' + ctrId).val(newMessageContent);
        }
    });
    $('[id^="eventname"]').on('change', function () {
        eventname = '';
        eventname = this.value;
        var customEventOverViewId = this.options[this.selectedIndex].getAttribute('attr_id');


        $('[id^="eventitems"]').empty();
        $('[id^="eventitems"]').append('<option value="Select">Select Event Items</option>');
        DragDroReportUtil.EventMappingDetails(customEventOverViewId, eventname);
    });
    $(".dropdwntabs").click(function () {


        let attrbidval = $(this).attr("dataidheader");
        if (attrbidval.indexOf("userattr") > -1) {
            $("#divcustomeve" + attrbidval.slice(-1) + "").removeClass("active");
            $("#divuserattr" + attrbidval.slice(-1) + "").addClass("active");
        }
        else {
            $("#divuserattr" + attrbidval.slice(-1) + "").removeClass("active");
            $("#divcustomeve" + attrbidval.slice(-1) + "").addClass("active");
        }
        //$(".dropdwntabs").removeClass("active");
        //$(this).addClass("active");
        $("#drpuserattr" + attrbidval.slice(-1) + "").addClass("hideDiv");
        $("#drpcustomeve" + attrbidval.slice(-1) + "").addClass("hideDiv");

        $("#" + attrbidval).removeClass("hideDiv");
    });
}



$("#ui_txtArea_whatsapptxtmess").keyup(function () {
    var whatsappmessval = $(this).val();
    $("#addwhatsapptext, #addwhatsapptextios").text(whatsappmessval);
    $(".whatsappmesscount").html($(this).val().length);

    // $("#dvUserAttributes").html("");
    //$("#addwhatsattruser").addClass("hideDiv");

    if (whatsappmessval != "") {

        BindUserAttributes(whatsappmessval);
        if ($("#dvUserAttributes").html() != '')
            $("#addwhatsattruser").removeClass("hideDiv");

    }
});

$("#txtBtnText1").keyup(function () {
    var whatsappmessval = $(this).val();
    if (whatsappmessval != null && whatsappmessval != "")
        $("#spn_whatsvisitwebsite, #spn_whatsvisitwebsiteios").text(whatsappmessval);
    else
        $("#spn_whatsvisitwebsite, #spn_whatsvisitwebsiteios").text("Buy Now");
});

$("#txtBtnText2").keyup(function () {
    var whatsappmessval = $(this).val();
    if (whatsappmessval != null && whatsappmessval != "")
        $("#spn_whatscallphone, #spn_whatscallphoneios").text(whatsappmessval);
    else
        $("#spn_whatscallphone, #spn_whatscallphoneios").text("Call Support");
});


$('#eventitemstitle').on('change', function () {

    if (this.value != "Select") {
        let cursorPos = $('#txtDynamicValueBtn1').prop('selectionStart');
        let MessageContent = $("#txtDynamicValueBtn1").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let customField = " {{*[" + eventname + "]~[" + this.value + "]~[TOP1.DESC]~[fallbackdata]*}}";
        let newMessageContent = textBefore + customField + textAfter;
        $('#txtDynamicValueBtn1').val(newMessageContent);
    }
});
$('#eventitemstitlebtn2').on('change', function () {

    if (this.value != "Select") {
        let cursorPos = $('#txtDynamicValueBtn2').prop('selectionStart');
        let MessageContent = $("#txtDynamicValueBtn2").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let customField = " {{*[" + eventname + "]~[" + this.value + "]~[TOP1.DESC]~[fallbackdata]*}}";
        let newMessageContent = textBefore + customField + textAfter;
        $('#txtDynamicValueBtn2').val(newMessageContent);
    }
});
$('#draganddropcustomtitlebtn2').on('change', function () {

    if (this.value != "Select") {
        let cursorPos = $('#txtDynamicValueBtn2').prop('selectionStart');
        let MessageContent = $("#txtDynamicValueBtn2").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let customField = "[{*" + this.value + "*}]";
        let newMessageContent = textBefore + customField + textAfter;
        $('#txtDynamicValueBtn2').val(newMessageContent);
    }
});
$('#draganddropcustomtitle').on('change', function () {


    if (this.value != "Select") {
        let cursorPos = $('#txtDynamicValueBtn1').prop('selectionStart');
        let MessageContent = $("#txtDynamicValueBtn1").val();
        let textBefore = MessageContent.substring(0, cursorPos);
        let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
        let customField = "[{*" + this.value + "*}]";
        let newMessageContent = textBefore + customField + textAfter;
        $('#txtDynamicValueBtn1').val(newMessageContent);
    }
});