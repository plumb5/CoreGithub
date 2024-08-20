let Id = 0, PageName = "", IsNew = true;
var ContactMergeTagList = [];
var ContactCustomFieldList = [];

$(document).ready(function () {
    Id = $.urlParam("Id");
    PageName = decodeURI(location.href.split("PageName").slice(1)[0].replace("=", ""));
    IsNew = $.urlParam("IsNew");
    if (Id > 0) {
        $("#ui_span_PageName").html(PageName);
        landingPageEditorUtil.GetBeeDetails();
    }
});

var landingPageEditorUtil = {
    GetContactFields: function () {
        $.ajax({
            url: "/Mail/DesignTemplateWithEditor/GetContactCustomField",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: landingPageEditorUtil.BindContactFields,
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

        landingPageEditorUtil.GetBeeDetails();
    },
    GetBeeDetails: function () {
        if (BeeEditorAuthUrl != null && BeeEditorAuthUrl != "" && BeeEditorClientId != null && BeeEditorClientId != "" && BeeEditorClientSecret != null && BeeEditorClientSecret != "") {
            request('POST', BeeEditorAuthUrl, 'grant_type=password&client_id=' + BeeEditorClientId + '&client_secret=' + BeeEditorClientSecret + '', 'application/x-www-form-urlencoded',
                function (token) {
                    BeeTokenVal = token;
                    landingPageEditorUtil.GetTemplateJsonFile();
                });
        }
        else {
            ShowErrorMessage(GlobalErrorList.MailTemplate.BeeEditorNotConfigured);
        }
    },
    GetTemplateJsonFile: function () {
        $.ajax({
            url: "/Analytics/LandingPageEditor/GetJsonContent",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'TemplateId': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: landingPageEditorUtil.InitialiseBeeDetails,
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
    UpdateTemplate: function (content, jsonContent) {
        ShowPageLoading();

        if (content != null && content.length > 0) {
            var htmlContent = content.replace(/&lt;/g, "<").replace(/&gt;/g, ">");

            var temp = htmlContent;
            var count = (temp.match(/p5form_submit/g) || []).length;

            if (count > 1) {
                ShowErrorMessage(GlobalErrorList.LandingPage.FormOutOfNumber);
                HidePageLoading();
            }
            else {
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

                htmlContent = landingPageEditorUtil.ReplaceCustomFields(htmlContent);

                $.ajax({
                    url: "/Analytics/LandingPageEditor/UpdateTemplateContent",
                    type: 'POST',
                    data: JSON.stringify({ 'accountId': Plumb5AccountId, 'TemplateId': Id, 'HtmlContent': htmlContent, 'JsonContent': jsonContent, 'pageName': PageName, 'UserId': Plumb5UserId, 'ThankYouMessage': 'Thank You' }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        if (!response.Status) {
                            ShowErrorMessage(response.Message);
                        }
                        else if (response.Status) {
                            if (IsNew == "true") {
                                ShowSuccessMessage(GlobalErrorList.MailTemplate.TemplateCreatedSuccess);
                                setTimeout(function () { window.location.href = "/Analytics/LandingPage"; }, 3000);
                            }
                            else
                                ShowSuccessMessage(GlobalErrorList.MailTemplate.TemplateUpdatedSuccess);
                        }
                        HidePageLoading();
                    },
                    error: ShowAjaxError
                });
            }
        }
    },
    ReplaceCustomFields: function (htmlContent) {
        for (var i = 0; i < ContactCustomFieldList.length; i++) {
            if (htmlContent.indexOf(ContactCustomFieldList[i]) > -1) {
                htmlContent = htmlContent.replace("[{*" + ContactCustomFieldList[i] + "*}]", "[{*CustomField" + (i + 1) + "*}]");
            }
        }
        return htmlContent;
    }
};

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
};


var beeConfig = {
    uid: 'Campaign_' + Plumb5AccountId + '_' + ClientServerName,
    container: 'bee-plugin-container',
    autosave: 15,
    language: 'en-US',
    mergeTags: ContactMergeTagList,
    preventClose: false,
    defaultForm: {
        structure: {
            title: 'Form title',
            fields: {
                p5form_name: { type: 'text', label: 'Name', canBeRemovedFromLayout: true, itemid: 'suki' },
                p5form_email: { type: 'email', label: 'Email', canBeRemovedFromLayout: true },
                p5form_mobile: { type: 'text', label: 'Mobile', canBeRemovedFromLayout: true },
                p5form_query: { type: 'textarea', label: 'Query', canBeRemovedFromLayout: true },
                p5form_website: { type: 'text', label: 'Website URL', removeFromLayout: true, canBeRemovedFromLayout: true },
                p5form_city: { type: 'text', label: 'City', removeFromLayout: true, canBeRemovedFromLayout: true },
                p5form_company: { type: 'text', label: 'Company Name', removeFromLayout: true, canBeRemovedFromLayout: true },
                p5form_role: { type: 'text', label: 'Role', removeFromLayout: true, canBeRemovedFromLayout: true },
                p5form_department: { type: 'text', label: 'Department', removeFromLayout: true, canBeRemovedFromLayout: true },
                p5form_privacy: { type: 'checkbox', label: 'Accept privacy policy. [Read it here](http://example.com)', canBeRemovedFromLayout: true, attributes: { required: true } },

                p5form_customfield1: { type: 'text', label: 'CustomField1', removeFromLayout: true, canBeRemovedFromLayout: true },
                p5form_customfield2: { type: 'text', label: 'CustomField2', removeFromLayout: true, canBeRemovedFromLayout: true },
                p5form_customfield3: { type: 'text', label: 'CustomField3', removeFromLayout: true, canBeRemovedFromLayout: true },
                p5form_customfield4: { type: 'text', label: 'CustomField4', removeFromLayout: true, canBeRemovedFromLayout: true },
                p5form_customfield5: { type: 'text', label: 'CustomField5', removeFromLayout: true, canBeRemovedFromLayout: true },

                p5form_customfield6: { type: 'text', label: 'customfield6(layout-2)', removeFromLayout: true, canBeRemovedFromLayout: true },
                p5form_customfield7: { type: 'text', label: 'customfield7(layout-2)', removeFromLayout: true, canBeRemovedFromLayout: true },
                p5form_customfield8: { type: 'text', label: 'customfield8(layout-2)', removeFromLayout: true, canBeRemovedFromLayout: true },
                p5form_customfield9: { type: 'text', label: 'customfield9(layout-2)', removeFromLayout: true, canBeRemovedFromLayout: true },
                p5form_customfield10: { type: 'text', label: 'customfield10(layout-2)', removeFromLayout: true, canBeRemovedFromLayout: true },
                p5form_customfield11: { type: 'text', label: 'customfield11(layout-2)', removeFromLayout: true, canBeRemovedFromLayout: true },

                p5form_customfield12: { type: 'text', label: 'customfield12(layout-3)', removeFromLayout: true, canBeRemovedFromLayout: true },
                p5form_customfield13: { type: 'text', label: 'customfield13(layout-3)', removeFromLayout: true, canBeRemovedFromLayout: true },
                p5form_customfield14: { type: 'text', label: 'customfield14(layout-3)', removeFromLayout: true, canBeRemovedFromLayout: true },
                p5form_customfield15: { type: 'text', label: 'customfield15(layout-3)', removeFromLayout: true, canBeRemovedFromLayout: true },
                p5form_customfield16: { type: 'text', label: 'customfield16(layout-3)', removeFromLayout: true, canBeRemovedFromLayout: true },
                p5form_customfield17: { type: 'text', label: 'customfield17(layout-3)', removeFromLayout: true, canBeRemovedFromLayout: true },
                p5form_submit: { type: 'submit', label: ' ', attributes: { value: 'Submit' } },
            }
            ,
            layout: [
                ['p5form_name'],
                ['p5form_email'],
                ['p5form_mobile'],
                ['p5form_query'],
                ['p5form_website'],
                ['p5form_city'],
                ['p5form_company'],
                ['p5form_role'],
                ['p5form_department'],
                ['p5form_privacy'],
                ['p5form_customfield1'],
                ['p5form_customfield2'],
                ['p5form_customfield3'],
                ['p5form_customfield4'],
                ['p5form_customfield5'],
                ['p5form_customfield6', 'p5form_customfield7'],
                ['p5form_customfield8', 'p5form_customfield9'],
                ['p5form_customfield10', 'p5form_customfield11'],
                ['p5form_customfield12', 'p5form_customfield13', 'p5form_customfield14'],
                ['p5form_customfield15', 'p5form_customfield16', 'p5form_customfield17'],
                ['p5form_submit']
            ]
        }
    },
    manageForm: {
        label: 'Change form'
        //,
        //handler: async(resolve, reject, args) => { 
        //    // Your function
        //} 
    },
    onSave: function (jsonFile, htmlFile) {
        landingPageEditorUtil.UpdateTemplate(htmlFile, jsonFile);
    },
    onSaveAsTemplate: function (jsonFile, htmlFile) { // + thumbnail?
        landingPageEditorUtil.UpdateTemplate(htmlFile, jsonFile);
    },
    onSend: function (htmlFile) {
        window.console.log("Will send later");
    },
    onError: function (errorMessage) {
        console.log('onError ', errorMessage);
    }
};