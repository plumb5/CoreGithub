let expression = /^(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/;

var regex = new RegExp(expression);
var smsTemplateUrl = { Id: 0, SmsTemplateId: 0, UrlContent: "" };
var SMSTemplateId = 0;
var templateUrlsList = [];
var smsUrlId = 0;
var EditSmsURL = 0;

let csteventregex = /\{{.*?}\}/gi;
let cstuserregex = /\[{.*?}\]/gi;
var smsUrlUtil = {

    GetSmsUrl: function (SmsTemplateId) {
        $.ajax({
            url: "/SMS/UploadTemplate/GetSmsTemplateUrl",
            type: 'POST',
            data: JSON.stringify({ 'SmsTemplateId': SmsTemplateId }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                HidePageLoading();
                templateUrlsList = response;
                //if (response.length > 0)
                //{

                //    DragDroReportUtil.Getdistincturleventname(response);

                //}

                smsUrlUtil.BindTemplateUrls(templateUrlsList);
            },
            error: ShowAjaxError
        });
    },
    GetTemplateDetail: function (SmsTemplateId) {
        if (SmsTemplateId != null && SmsTemplateId > 0) {
            var SmsUploadTemplate = { ConvertLinkToShortenUrl: false, Id: parseInt(SmsTemplateId), SmsCampaignId: 0, Name: "", MessageContent: "", LandingPageType: "", ProductGroupName: "" };
            $.ajax({
                url: "/SMS/Template/GetTemplateDetails",
                type: 'POST',
                data: JSON.stringify({ 'smsTemplate': SmsUploadTemplate }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                    if (response != null && response.Id > 0) {
                        var MessageBody = urlParam("DltNewFile") != 0 ? ReplaceCustomFields($("#ui_txtMessageTemplate").val()) : ReplaceCustomFields(response.MessageContent);

                        $("#ui_txtMessageTemplate").val(MessageBody);
                        calculatelength($("#ui_txtMessageTemplate").val(), "N");

                        if (urlParam("DltNewFile") == 0)
                            BindDltTagging(MessageBody);
                    }
                },
                error: ShowAjaxError
            });
        }
    },

    BindTemplateUrls: function (templateUrlsList) {
        SetNoRecordContent("ui_tbSmsTemplateUrl", 4, "ui_tbodySmsTemplateUrl");
        if (templateUrlsList != null && templateUrlsList.length > 0) {
            $("#ui_tbodySmsTemplateUrl").empty();
            $.each(templateUrlsList, function () {
                let urlContent = `<tr>
                                        <td class="text-center addurl" id><i class="icon ion-ios-plus-outline fa-2x" onclick="smsUrlUtil.AddUrlToSmsContent(${$(this)[0].Id})"></i></td>
                                        <td>${$(this)[0].Id}</td>
                                        <td>
                                            <div class="landurlcont">
                                                <div class="landurlwrp">
                                                    <div class="landurl">
                                                       ${ReplaceCustomFields($(this)[0].UrlContent)};
                                                    </div>
                                                    <div class="urledit">
                                                        <i class="icon ion-edit" onclick="smsUrlUtil.EditUrl(${$(this)[0].Id});"></i>
                                                    </div>
                                                </div>
                                                <div class="landurlInpwrp hideDiv">
                                                    <div class="inputwrp w-100">
                                                        <input type="text" name="" class="form-control whitespacenowrp" id="landingpageurl">
                                                    </div>
                                                    <div class="editclswrp">
                                                        <i class="icon ion-ios-checkmark-outline"></i>
                                                        <i class="icon ion-ios-close-outline"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="text-center"><i class="icon ion-trash-b landfnt" data-toggle="modal" data-target="#deleterow" onclick=smsUrlUtil.SetDeleteValue(${$(this)[0].Id});></i></td>
                                    </tr>`;

                $("#ui_tbodySmsTemplateUrl").append(urlContent);


                $("#draganddropcutomre_dlt").append('<option value=' + $(this)[0].Id + '>[{*' + $(this)[0].Id + '*}]</option>');
            });
        }
    },

    AddUrlToSmsContent: function (Id) {
        if (CleanText($("#ui_txtMessageTemplate").val()).indexOf("[{*" + Id + "*}]") < 0) {
            let cursorPos = $('#ui_txtMessageTemplate').prop('selectionStart');
            let MessageContent = $("#ui_txtMessageTemplate").val();
            let textBefore = MessageContent.substring(0, cursorPos);
            let textAfter = MessageContent.substring(cursorPos, MessageContent.length);
            let str = PreviewSupport(MessageContent);
            if (str != null && str.length > 1500) {
                ShowErrorMessage(GlobalErrorList.SmsTemplateURL.ThousandFiveHundredError);
                return false;
            }
            let urlField = `[{*${Id}*}]`;
            let messageContent = textBefore + urlField + textAfter;
            let newStr = PreviewSupport(messageContent);

            if (newStr != null && newStr.length > 1500) {
                ShowErrorMessage(GlobalErrorList.SmsTemplateURL.AfterReplacingContent);
                return false;
            } else {
                $('#ui_txtMessageTemplate').val(messageContent);
                calculatelength($("#ui_txtMessageTemplate").val(), "N");
            }
        }
        else {
            ShowErrorMessage(GlobalErrorList.SmsTemplateURL.UrlAlreadyAppend);
        }
    },

    EditUrl: function (Id) {
        EditSmsURL = Id;
        let smsUrldata;
        for (let i = 0; i < templateUrlsList.length; i++) {
            if (templateUrlsList[i].Id == Id) {
                smsUrldata = templateUrlsList[i];
            }
        }

        if (smsUrldata != undefined) {
            $("#txtShortenUrl").val("").val(ReplaceCustomFields(smsUrldata.UrlContent));
            $("#addlandpage").click();
        }
    },
    SaveSmsTemplateUrl: function () {
        if (CleanText($("#txtShortenUrl").val()).length <= 0) {
            ShowErrorMessage(GlobalErrorList.SmsTemplateURL.URL);
            return false;
        }
        if (csteventregex.test($("#txtShortenUrl").val()) == false) {
            if (cstuserregex.test($("#txtShortenUrl").val()) == false) {
                if ($("#txtShortenUrl").val().indexOf("http://") == 0 || $("#txtShortenUrl").val().indexOf("https://") == 0) {
                    var getURL = new URL($("#txtShortenUrl").val());
                    var getURLdomain = getURL.origin;
                    if (!regex.test(getURLdomain)) {
                        ShowErrorMessage(GlobalErrorList.SmsTemplateURL.CorrectURL);
                        return false;
                    }
                } else {
                    ShowErrorMessage(GlobalErrorList.SmsTemplateURL.CorrectURL);
                    return false;
                }
            }
        }



        for (let i = 0; i < templateUrlsList.length; i++) {
            if (templateUrlsList[i].UrlContent == CleanText(AppendCustomField($("#txtShortenUrl").val()))) {
                ShowErrorMessage(GlobalErrorList.SmsTemplateURL.AlreadyExists);
                return;
            }
        }

        if (EditSmsURL > 0)
            smsTemplateUrl.Id = EditSmsURL;
        else
            smsTemplateUrl.Id = 0;


        smsTemplateUrl.SmsTemplateId = SMSTemplateId;
        smsTemplateUrl.UrlContent = AppendCustomField(CleanText($("#txtShortenUrl").val()));

        $.ajax({
            url: "/SMS/UploadTemplate/SaveSmsTemplateUrl",
            type: 'POST',
            data: JSON.stringify({ 'smsTemplateUrlData': smsTemplateUrl }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                var response = data.smsTemplateUrl;
                smsUrlUtil.ClearField();
                if (response != null) {
                    if (smsTemplateUrl.Id > 0) {
                        for (let i = 0; i < templateUrlsList.length; i++) {
                            if (templateUrlsList[i].Id == smsTemplateUrl.Id) {
                                templateUrlsList[i].UrlContent = response.UrlContent;
                                break;
                            }
                        }

                        ShowSuccessMessage(GlobalErrorList.SmsTemplateURL.SmsURLUpdated);

                    } else {
                        templateUrlsList.push(response);
                        ShowSuccessMessage(GlobalErrorList.SmsTemplateURL.SmsURLUpdated);
                    }

                    $("#ui_tbodySmsTemplateUrl").empty();
                    smsUrlUtil.BindTemplateUrls(templateUrlsList);
                    $("#addlandpage").click();
                }
            },
            error: ShowAjaxError
        });
    },


    SetDeleteValue: function (Id) {
        smsUrlId = Id;
    },

    DeleteURL: function () {
        ShowPageLoading();
        $.ajax({
            url: "/SMS/UploadTemplate/Delete",
            type: 'POST',
            data: JSON.stringify({ 'SmsTemplateUrlId': smsUrlId }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (response == true) {
                    ShowSuccessMessage(GlobalErrorList.SmsTemplateURL.DeletedSuccess);
                    for (index = 0; index < templateUrlsList.length; index++) {
                        if (templateUrlsList[index].Id == smsUrlId) {
                            templateUrlsList.splice(index, 1);
                            break;
                        }
                    }
                    smsUrlUtil.UrlIsDeletedRemoveFromMessage(smsUrlId);
                    calculatelength($("#ui_txtMessageTemplate").val(), "N");
                    if (templateUrlsList.length <= 0) {
                        SetNoRecordContent("ui_tbSmsTemplateUrl", 4, "ui_tbodySmsTemplateUrl");
                    } else {
                        smsUrlUtil.BindTemplateUrls(templateUrlsList);
                    }
                }

                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },

    UrlIsDeletedRemoveFromMessage: function (Id) {
        var removeUrl = "[{*" + Id + "*}]";
        var messageContent = $("#ui_txtMessageTemplate").val().replace(removeUrl, "");
        $("#ui_txtMessageTemplate").val(messageContent);
    },

    ClearField: function () {
        smsUrlId = 0; EditSmsURL = 0;
        $("#txtShortenUrl").val('');
    }
};


$(document).ready(function () {
    ShowPageLoading();

    SMSTemplateId = urlParam("TemplateId");
    smsUrlUtil.GetTemplateDetail(SMSTemplateId);
    //smsUrlUtil.GetSmsUrl(SMSTemplateId);

});


$("#ui_btnSaveUrl").click(function () {
    smsUrlUtil.SaveSmsTemplateUrl();
});


$("#addlandpage,.clsediv").click(function () {
    if ($(".addlandfieldwrp").is(":visible")) {
        smsUrlUtil.ClearField();
        $(".addlandfieldwrp").hide(1000);
    } else {
        $(".addlandfieldwrp").show(1000);
    }
});
