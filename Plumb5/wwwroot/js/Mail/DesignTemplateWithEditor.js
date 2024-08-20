var bee = null;
var BeeTokenVal = "";
var ContactMergeTagList = [];
//var customeventFieldList = [];
var ContactCustomFieldList = [];
var TemplateId = 0;
var TemplateName = "";
var IsNew = "";
var ReplaceFieldInHtmlContent = [];

var defaultContactFields = ["Name", "EmailId", "PhoneNumber", "Location", "Gender", "MaritalStatus", "Education", "Occupation", "Interests", "Signatory_Name", "Signatory_EmailId", "Signatory_PhoneNumber", "Signatory_BusinessPhoneNumber"];

$(document).ready(function () {
    TemplateId = $.urlParam("TemplateId");
    IsNew = $.urlParam("IsNew");
    TemplateName = decodeURI(location.href.split("TemplateName").slice(1)[0].replace("=", ""));
    if (TemplateId > 0) {
        $("#ui_span_TemplateName").text(TemplateName);
        DragDroReportUtil.BindUrlEventMappingDetails('Email');
        GetContactFielddragdrop('Email');

    }
});

var EditorUtil = {
    GetContactFields: function () {
        $.ajax({
            url: "/Mail/DesignTemplateWithEditor/GetContactCustomField",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: EditorUtil.BindContactFields,
            error: ShowAjaxError
        });
    },
    BindContactFields: function (fieldList) {
        $.each(defaultContactFields, function (i) {
            var CustomFields = { name: '', value: '' };
            CustomFields.name = defaultContactFields[i];
            CustomFields.value = "[{*" + defaultContactFields[i] + "*}]";
            ContactMergeTagList.push(CustomFields);
        });

        if (fieldList != undefined && fieldList != null && fieldList.length > 0) {
            $.each(fieldList, function (i) {
                var CustomFields = { name: '', value: '' };
                CustomFields.name = $(this)[0].FieldName;
                CustomFields.value = "[{*" + $(this)[0].FieldName + "*}]";
                ContactMergeTagList.push(CustomFields);
                ContactCustomFieldList.push($(this)[0].FieldName);
            });
        }

        EditorUtil.GetBeeDetails();
    },
    GetBeeDetails: function () {
        if (BeeEditorAuthUrl != null && BeeEditorAuthUrl != "" && BeeEditorClientId != null && BeeEditorClientId != "" && BeeEditorClientSecret != null && BeeEditorClientSecret != "") {
            request('POST', BeeEditorAuthUrl, 'grant_type=password&client_id=' + BeeEditorClientId + '&client_secret=' + BeeEditorClientSecret + '', 'application/x-www-form-urlencoded',
                function (token) {
                    BeeTokenVal = token;
                    EditorUtil.GetTemplateJsonFile();
                });
        }
        else {
            ShowErrorMessage(GlobalErrorList.MailTemplate.BeeEditorNotConfigured);
        }
    },
    GetTemplateJsonFile: function () {
        $.ajax({
            url: "/Mail/DesignTemplateWithEditor/GetJsonContent",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'TemplateId': TemplateId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: EditorUtil.InitialiseBeeDetails,
            error: ShowAjaxError
        });
    },
    InitialiseBeeDetails: function (JsonContent) {
        if (JsonContent != undefined && JsonContent != null && JsonContent != '') {
            BeePlugin.create(BeeTokenVal, beeConfig, function (beePluginInstance) {
                bee = beePluginInstance;
                data = JsonContent;
                bee.start(data);
            });
        }
        HidePageLoading();
    },
    ReplaceCustomFields: function (htmlContent) {
        for (var i = 0; i < ContactCustomFieldList.length; i++) {
            if (htmlContent.indexOf(ContactCustomFieldList[i]) > -1) {
                htmlContent = htmlContent.replaceAll("[{*" + ContactCustomFieldList[i] + "*}]", "[{*CustomField" + (i + 1) + "*}]");
            }
            if (htmlContent.toLowerCase().indexOf("[{*" + ContactCustomFieldList[i].toLowerCase() + "~") > -1) {
                var regExp = "[{*" + ContactCustomFieldList[i] + "~";  // regex pattern string
                htmlContent = htmlContent.replace(regExp, "[{*CustomField" + (i + 1) + "~");
            }
        }
        var MessageBodysplit = htmlContent.split('{{*');
        for (var i = 0; i < customeventFieldList.length; i++) {
            for (var j = 1; j < customeventFieldList[i].length; j++) {
                if (MessageBodysplit.length == 1) {
                    if (MessageBodysplit[0].toLowerCase().indexOf("[" + customeventFieldList[i][0].toLowerCase() + "]~[") > -1) {
                        if (MessageBodysplit[0].toLowerCase().indexOf("]~[" + customeventFieldList[i][j].toLowerCase() + "]~[") > -1) {

                            var regExp = new RegExp("\\]\\~\\[" + customeventFieldList[i][j] + "\\]\\~\\[", "ig");  // regex pattern string
                            MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "]~[EventData" + (j) + "]~[");
                        }
                        if (MessageBodysplit[0].toLowerCase().indexOf("]~[" + customeventFieldList[i][j].toLowerCase() + "(") > -1) {
                            var regExp = "]~[" + customeventFieldList[i][j] + "(";  // regex pattern string
                            MessageBodysplit[0] = MessageBodysplit[m].replace(regExp, "]~[EventData" + (j) + "(");
                        }
                    }
                }
                else {
                    for (var m = 0; m < MessageBodysplit.length; m++) {
                        if (MessageBodysplit[m].toLowerCase().indexOf("[" + customeventFieldList[i][0].toLowerCase() + "]~[") > -1) {
                            if (MessageBodysplit[m].toLowerCase().indexOf("]~[" + customeventFieldList[i][j].toLowerCase() + "]~[") > -1) {
                                var regExp = new RegExp("\\]\\~\\[" + customeventFieldList[i][j] + "\\]\\~\\[", "ig");  // regex pattern string
                                MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "]~[EventData" + (j) + "]~[");
                            }
                            if (MessageBodysplit[m].toLowerCase().indexOf("]~[" + customeventFieldList[i][j].toLowerCase() + "(") > -1) {
                                var regExp = "]~[" + customeventFieldList[i][j] + "(";  // regex pattern string
                                MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "]~[EventData" + (j) + "(");
                            }
                        }
                    }
                }
            }
        }
        if (MessageBodysplit.length > 1)
            htmlContent = MessageBodysplit.join("{{*");

        return htmlContent;

    },

    GetReplaceFieldsInHtml: function (htmlContent) {
        ReplaceFieldInHtmlContent = [];
        let result = { Status: true, Error: "" };

        if (htmlContent.indexOf("[{*") > -1 && htmlContent.indexOf("*}]") > -1) {
            let content = htmlContent.split("[{");

            if (content != null && content.length > 0) {
                for (let i = 0; i < content.length; i++) {
                    let eachcontent = content[i];

                    if (eachcontent.indexOf("*}]") > -1) {
                        let data = eachcontent.substring(eachcontent.indexOf("*") + 1, eachcontent.indexOf("*}]"));
                        ReplaceFieldInHtmlContent.push(data);
                    }
                }
            }

            if (ReplaceFieldInHtmlContent != null && ReplaceFieldInHtmlContent.length > 0) {
                let contactFields = [...defaultContactFields, ...ContactCustomFieldList];
                for (let i = 0; i < ReplaceFieldInHtmlContent.length; i++) {

                    if (!(ReplaceFieldInHtmlContent[i].toLowerCase().includes("customfield"))) {
                        let defaultdata = JSLINQ(contactFields).Where(function () {
                            return (this.toLowerCase() == ReplaceFieldInHtmlContent[i].split('~')[0].toLowerCase());
                        });

                        if (defaultdata.items.length == 0) {
                            result.Status = false;
                            result.Error = `The given [{*${ReplaceFieldInHtmlContent[i]}*}] dynamic field not found in the custom field list, kindly add and save`;
                            break;
                        }
                    }
                }
            }
        }

        return result;
    },
    UpdateTemplate: function (content, jsonContent) {
        ShowPageLoading();

        if (content != null && content.length > 0) {
            var htmlContent = content.replace(/&lt;/g, "<").replace(/&gt;/g, ">");

            try {
                if (htmlContent.indexOf("<html") < 0 && htmlContent.indexOf("</title>") > 0) {
                    var indexOfTitle = htmlContent.indexOf("</title>");
                    var contentBefore = htmlContent.substring(0, indexOfTitle + 8);
                    var contentAfterTitle = htmlContent.substring(indexOfTitle + 8, htmlContent.length);
                    htmlContent = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head>' +
                        contentBefore + '</head><body>' + contentAfterTitle + '</body></html>';
                }
            }
            catch (error) {
                htmlContent = content.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
            }

            htmlContent = EditorUtil.ReplaceCustomFields(htmlContent);
            let result = EditorUtil.GetReplaceFieldsInHtml(htmlContent);

            if (result.Status) {
                $.ajax({
                    url: "/Mail/DesignTemplateWithEditor/UpdateTemplateContent",
                    type: 'POST',
                    data: JSON.stringify({ 'accountId': Plumb5AccountId, 'TemplateId': TemplateId, 'HtmlContent': htmlContent, 'JsonContent': jsonContent }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        if (!response.Status) {
                            ShowErrorMessage(response.Message);
                        }
                        else if (response.Status) {
                            if (IsNew == "true") {
                                ShowSuccessMessage(GlobalErrorList.MailTemplate.TemplateCreatedSuccess);
                                setTimeout(function () { window.location.href = "/Mail/MailTemplate"; }, 3000);
                            }
                            else
                                ShowSuccessMessage(GlobalErrorList.MailTemplate.TemplateUpdatedSuccess);
                        }
                        HidePageLoading();
                    },
                    error: ShowAjaxError
                });
            } else { HidePageLoading(); ShowErrorMessage(result.Error); }
        }
    }
}

var request = function (method, url, data, type, callback) {
    var req = new XMLHttpRequest();
    //console.log(type);
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            var response = JSON.parse(req.responseText);
            callback(response);
        }
    };
    req.open(method, url, true);
    if (data && type) {
        if (type === 'multipart/form-data') {
            var formData = new FormData();
            for (var key in data) {
                formData.append(key, data[key]);
            }
            data = formData;
        }
        else {
            req.setRequestHeader('Content-type', type);
        }
    }
    req.send(data);
}


//var CustomEventTag = { name: '', value: '' };
//CustomEventTag.name = "viewwcart_product";
//CustomEventTag.value = "{{*[viewwcart]~[product]~[TOP3.DSC]~[fallbackdata]*}}";
//ContactMergeTagList.push(CustomEventTag);



var beeConfig = {
    uid: 'Campaign_' + Plumb5AccountId + '_' + ClientServerName,
    container: 'bee-plugin-container',
    autosave: 15,
    language: 'en-US',
    mergeTags: ContactMergeTagList,
    preventClose: false,
    onSave: function (jsonFile, htmlFile) {
        EditorUtil.UpdateTemplate(htmlFile, jsonFile);
    },
    onSaveAsTemplate: function (jsonFile, htmlFile) { // + thumbnail?
        EditorUtil.UpdateTemplate(htmlFile, jsonFile);
    },
    onSend: function (htmlFile) {
        window.console.log("Will send later");
    },
    onError: function (errorMessage) {
        console.log('onError ', errorMessage);
    }
}
