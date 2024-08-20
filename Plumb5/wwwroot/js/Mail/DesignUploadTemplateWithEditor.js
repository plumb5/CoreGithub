
var ContactMergeTagList = "";
var ContactCustomFieldList = [];
var customeventFieldList = [];
var TemplateId = 0;
var defaultContactFields = ["Name", "EmailId", "PhoneNumber", "Location", "Gender", "MaritalStatus", "Education", "Occupation", "Interests", "Signatory_Name", "Signatory_EmailId", "Signatory_PhoneNumber", "Signatory_BusinessPhoneNumber"];
var FullTemplatePath = "";
var TemplateImageNameList = [];
var ReplaceFieldInHtmlContent = [];
var UADropDownList = `<option value="0">Select User Attribute</option>`;

$(document).ready(function () {

    async: true,
        $("#ui_divMasterFooter").addClass("editor");
    TemplateId = $.urlParam("TemplateId");
    if (TemplateId > 0) {
        FullTemplatePath = "https://" + TemplatePath + "Campaign-" + Plumb5AccountId + "-" + TemplateId + "/";
        EditorUtil.csteventsFields();

        EditorUtil.GetContactFields();

    }
});

var EditorUtil = {
    csteventsFields: function () {
        ShowPageLoading();
        async: true,

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

                        HidePageLoading();
                    }


                },
                error: ShowAjaxError
            });
    },
    GetContactFields: function () {
        $.ajax({
            url: "/Mail/DesignUploadTemplateWithEditor/GetContactCustomField",
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
            //ContactMergeTagList += "<li data-value='[{*" + defaultContactFields[i] + "*}]'>&nbsp; " + defaultContactFields[i] + "</li>";
            UADropDownList += `<option value="[{*${defaultContactFields[i]}*}]">${defaultContactFields[i]}</option>`;
        });

        if (fieldList != undefined && fieldList != null && fieldList.length > 0) {
            $.each(fieldList, function (i) {
                //ContactMergeTagList += "<li data-value='[{*" + $(this)[0].FieldName + "*}]'>&nbsp; " + $(this)[0].FieldName + "</li>";
                UADropDownList += `<option value="[{*${$(this)[0].FieldName}*}]">${$(this)[0].FieldName}</option>`;
                ContactCustomFieldList.push($(this)[0].FieldName);
            });
        }

        EditorUtil.GetTemplateDetails();
    },
    GetTemplateDetails: function () {
        $.ajax({
            url: "/Mail/DesignUploadTemplateWithEditor/GetTemplateDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'TemplateId': TemplateId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: EditorUtil.InitialiseEditor,
            error: ShowAjaxError
        });
    },
    InitialiseEditor: function (response) {
        if (response != undefined && response != null && response.Status != '') {
            var HtmlContent = EditorUtil.ChangeReplacedFields(response.HtmlContent).replace(/&amp;/g, '&');
            HtmlContent = EditorUtil.ReplaceImageUrlLocalToOnline(HtmlContent);

            HtmlContent = HtmlContent.replaceAll('<tbody></tbody>', '').replaceAll('<TBODY></TBODY>', '');
            HtmlContent = HtmlContent.replace(/<html/g, '<p5html').replace(/<body/g, '<p5body').replace(/<head/g, '<p5head');
            HtmlContent = HtmlContent.replace(/<HTML/g, '<P5HTML').replace(/<BODY/g, '<P5BODY').replace(/<HEAD/g, '<P5HEAD');
            HtmlContent = HtmlContent.replace('</html>', '</p5html>').replace('</body>', '</p5body>').replace('</head>', '</p5head>');
            HtmlContent = HtmlContent.replace('</HTML>', '</P5HTML>').replace('</BODY>', '</P5BODY>').replace('</HEAD>', '</P5HEAD>');


            $("#summernote").html(HtmlContent);
            EditorUtil.DrawEditor();
            HidePageLoading();
        }
        else {
            setTimeout(function () { window.location.href = "/Mail/MailTemplate"; }, 3000);
        }
    },
    InitializeDropDown: function () {
        $('#campNamesms, #eventname, #eventitems').select2({
            minimumResultsForSearch: '',
            dropdownAutoWidth: false
        });

        $(".dropdwntabs").click(function () {
            let attrbidval = $(this).attr("data-tabcontid");
            $(".dropdwntabs").removeClass("active");
            $(this).addClass("active");
            $(".userattribwrap").addClass("hideDiv");
            $("#" + attrbidval).removeClass("hideDiv");
        });

        $(".dropdown-menu.keepopen").click(function (e) {
            e.stopPropagation();
        });

        $("#campNamesms").change(function () {
            let attrbidval = $(this).val();
            if (parseInt(attrbidval) != 0) {
                $('#summernote').summernote('restoreRange');
                $('#summernote').summernote('focus');
                $('#summernote').summernote('insertText', attrbidval);
            }
            //$("#campNamesms").val(0).change();
        });
        $("#eventname").change(function () {
            eventname = '';
            eventname = this.value;
            var customEventOverViewId = this.options[this.selectedIndex].getAttribute('attr_id');


            $('[id^="eventitems"]').empty();
            $('[id^="eventitems"]').append('<option value="Select">Select Event Items</option>');
            DragDroReportUtil.EventMappingDetails(customEventOverViewId, eventname);
        });
        $('#eventitems').on('change', function () {

            if (this.value != "Select") {
                let attrbidval = $(this).val();
                if (parseInt(attrbidval) != 0) {
                    $('#summernote').summernote('restoreRange');
                    $('#summernote').summernote('focus');
                    $('#summernote').summernote('insertText', " {{*[" + eventname + "]~[" + this.value + "]~[TOP1.DESC]~[fallbackdata]*}}");
                }

            }
        });
        DragDroReportUtil.GetReport();
        DragDroReportUtil.BindUrlEventMappingDetails('');
    },
    DrawEditor: function () {
        GetContactFielddragdrop();
        var MergeTagsButton = function (context) {
            var ui = $.summernote.ui;
            var button = ui.buttonGroup([
                ui.button({
                    className: 'dropdown-toggle btn-variable',
                    tooltip: "Personalization",
                    contents: `<span class="fa fa-user"></span> <span class="caret"></span>
                                <div class="dropdown-menu dropdown-menu-right keepopen p-0" aria-labelledby="filterTags">
	                                <div class="dropdwntabwrap">
	                                  <div class="dropdwntabitem">
		                                <div data-tabcontid="userattr" class="dropdwntabs active">User Attribute</div>
		                                <div data-tabcontid="customeve" class="dropdwntabs">Custom Events</div>
	                                  </div>
	                                  <div class="dropdwntabcontwrap">
		                                <div id="userattr" class="userattribwrap">
		                                  <h6 class="dropdown-title">User Attribute</h6>
		                                  <select id="campNamesms" class="form-control addCampName" data-placeholder="Select P5Field(s)">
                                             ${UADropDownList}
		                                  </select>
		                                </div>
		                                <div id="customeve" class="userattribwrap hideDiv">
		                                  <h6 class="dropdown-title">Custom Events</h6>
		                                  <select id="eventname" class="form-control addCampName" data-placeholder="Select Event(s)">
                                            <option label="Events Items">Select</option>
		                                  </select>
		                                  <div class="mt-3">
			                                <select id="eventitems" class="form-control addCampName" data-placeholder="Select Event(s)">
			                                </select>
		                                  </div>
		                                </div>
	                                </div>
                                </div>`,
                    data: {
                        toggle: 'dropdown'
                    }
                })
                //ui.dropdown({
                //    className: 'summernote-list',
                //    contents: ContactMergeTagList,
                //    callback: function ($dropdown) {
                //        $dropdown.find('li').each(function () {
                //            $(this).click(function () {
                //                $('#summernote').summernote('restoreRange');
                //                $('#summernote').summernote('focus');
                //                $('#summernote').summernote('insertText', $(this).data('value'));
                //            });
                //        });
                //    }
                //})
            ]);

            return button.render(); // return button as jquery object
        };

        $('#summernote').summernote({
            focus: true,
            height: 400,
            tooltip: true,
            container: 'body',
            codemirror: { // codemirror options
                mode: 'text/html',
                theme: 'material-darker',
                lineWrapping: true,
            },
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'underline', 'clear', 'superscript', 'subscript']],
                ['fontname', ['fontname']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'hr']],
                ['view', ['fullscreen', 'codeview', 'undo', 'redo']],
                ['User Attributes', ['mergetag']],
            ],
            buttons: {
                mergetag: MergeTagsButton,
            },
            callbacks: {
                onImageUpload: function (image) {
                    ShowPageLoading();
                    editor = $(this);
                    for (let i = 0; i < image.length; i++) {
                        EditorUtil.UploadImage(image[i], editor);
                    }
                },
                onMediaDelete: function (image) {
                    ShowPageLoading();
                    EditorUtil.DeleteImage(image);
                }
            }
        });

        EditorUtil.InitializeDropDown();
    },
    ChangeReplacedFields: function (htmlContent) {
        for (var i = 0; i < ContactCustomFieldList.length; i++) {
            if (htmlContent.toLowerCase().indexOf(("[{*CustomField" + (i + 1) + "*}]").toLowerCase()) > -1) {
                var regExp = new RegExp("\\[\\{\\*CustomField" + (i + 1) + "\\*\\}\\]", "gi");
                htmlContent = htmlContent.replace(regExp, "[{*" + ContactCustomFieldList[i] + "*}]");
            }
            if (htmlContent.toLowerCase().indexOf(("[{*CustomField" + (i + 1) + "~").toLowerCase()) > -1) {
                var regExp = "[{*CustomField" + (i + 1) + "~";  // regex pattern string
                htmlContent = htmlContent.replace(regExp, "[{*" + ContactCustomFieldList[i] + "~");
            }
        }
        var MessageBodysplit = htmlContent.split('{{*');
        for (var i = 0; i < customeventFieldList.length; i++) {
            for (var j = 1; j < customeventFieldList[i].length; j++) {
                if (MessageBodysplit.length == 1) {
                    if (MessageBodysplit[m].toLowerCase().indexOf("[" + customeventFieldList[i][0].toLowerCase() + "]~[") > -1) {
                        if (MessageBodysplit[0].toLowerCase().indexOf(("]~[EventData" + (j) + "]~[").toLowerCase()) > -1) {
                            var regExp = new RegExp("\\]\\~\\[EventData" + (j) + "\\]\\~\\[", "ig");  // regex pattern string
                            MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "]~[" + customeventFieldList[i][j] + "]~[");
                        }
                        if (MessageBodysplit[0].toLowerCase().indexOf(("]~[EventData" + (j) + "(").toLowerCase()) > -1) {
                            var regExp = "]~[EventData" + (j) + "(";  // regex pattern string
                            MessageBodysplit[0] = MessageBodysplit[m].replace(regExp, "]~[" + customeventFieldList[i][j] + "(");
                        }
                    }
                }
                else {
                    for (var m = 0; m < MessageBodysplit.length; m++) {
                        if (MessageBodysplit[m].toLowerCase().indexOf("[" + customeventFieldList[i][0].toLowerCase() + "]~[") > -1) {
                            if (MessageBodysplit[m].toLowerCase().indexOf(("]~[EventData" + (j) + "]~[").toLowerCase()) > -1) {
                                var regExp = new RegExp("\\]\\~\\[EventData" + (j) + "\\]\\~\\[", "ig");  // regex pattern string
                                MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "]~[" + customeventFieldList[i][j] + "]~[");
                            }
                            if (MessageBodysplit[m].toLowerCase().indexOf(("]~[EventData" + (j) + "(").toLowerCase()) > -1) {
                                var regExp = "]~[EventData" + (j) + "(";  // regex pattern string
                                MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "]~[" + customeventFieldList[i][j] + "(");
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
    ReplaceCustomFields: function (htmlContent) {
        for (var i = 0; i < ContactCustomFieldList.length; i++) {
            if (htmlContent.toLowerCase().indexOf("[{*" + ContactCustomFieldList[i].toLowerCase() + "*}]") > -1) {
                regExp = new RegExp("\\[\\{\\*" + ContactCustomFieldList[i] + "\\*\\}\\]", "gi");
                htmlContent = htmlContent.replace(regExp, "[{*CustomField" + (i + 1) + "*}]");
            }
            if (htmlContent.toLowerCase().indexOf("[{*" + ContactCustomFieldList[i].toLowerCase() + "~") > -1) {
                var regExp = "[{*" + ContactCustomFieldList[i] + "~";  // regex pattern string
                htmlContent = htmlContent.replace(regExp, "[{*CustomField" + (i + 1) + "~");
            }

            if (htmlContent.toLowerCase().indexOf("[{*" + ContactCustomFieldList[i].toLowerCase() + "*}]") > -1) {
                var regExp = new RegExp("\\[\\{\\*" + ContactCustomFieldList[i] + "\\*\\}\\]", "ig");  // regex pattern string
                htmlContent = htmlContent.replace(regExp, "[{*CustomField" + (i + 1) + "*}]");
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
    ReplaceImageUrlLocalToOnline: function (htmlContent) {
        var regxForDoubleQuote = /<img[^>]+src\s*=\s*"([^">]+)/g;
        var regxForSingleQuote = /<img[^>]+src\s*=\s*'([^'>]+)/g;

        var ImageNameList = [];
        var each;

        while (each = regxForDoubleQuote.exec(htmlContent)) {
            if (ImageNameList.indexOf(each[1]) < 0) {
                ImageNameList.push(each[1]);
            }
            TemplateImageNameList.push(each[1]);
        }

        while (each = regxForSingleQuote.exec(htmlContent)) {
            if (ImageNameList.indexOf(each[1]) < 0) {
                ImageNameList.push(each[1]);
            }
            TemplateImageNameList.push(each[1]);
        }

        for (var i = 0; i < ImageNameList.length; i++) {
            console.log(ImageNameList[i]);
            var replaceOfImageName = "";
            if (ImageNameList[i].lastIndexOf("http://") > 0 || ImageNameList[i].lastIndexOf("https://") > 0 || ImageNameList[i].lastIndexOf("//") > 0 || ImageNameList[i].lastIndexOf("www") > 0 || ImageNameList[i].lastIndexOf("/") > 0) {
                replaceOfImageName = "";
            }
            else {
                replaceOfImageName = ImageNameList[i];
            }

            if (replaceOfImageName != "") {
                var regexForReplace = new RegExp(replaceOfImageName, "g");
                htmlContent = htmlContent.replace(regexForReplace, FullTemplatePath + replaceOfImageName);
            }
        }

        return htmlContent;
    },
    UploadImage: function (image, editor) {
        var fromdata = typeof window.FormData == "undefined" ? [] : new window.FormData();
        if (typeof window.FormData == "undefined") {
            fromdata.push(image.name, image);
        }
        else {
            fromdata.append(image.name, image);
        }

        $.ajax({
            url: "/Mail/DesignUploadTemplateWithEditor/UploadImage?accountId=" + Plumb5AccountId + "&mailTemplateId=" + TemplateId,
            cache: false,
            contentType: false,
            processData: false,
            data: fromdata,
            type: "post",
            success: function (response) {
                if (response != undefined && response != null && response.Status) {
                    var fullImageUrl = FullTemplatePath + response.ImageName;
                    var image = $('<img>').attr('src', fullImageUrl);
                    $(editor).summernote("insertNode", image[0]);
                    TemplateImageNameList.push(response.ImageName);
                } else {
                    ShowErrorMessage(response.Message);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    DeleteImage: function (image) {
        var imageUrl = $(image[0]).attr('src');
        if (imageUrl.indexOf(FullTemplatePath) > -1) {
            var imageName = imageUrl.replace(FullTemplatePath, '');
            var isDuplicate = false;
            var duplicateIndex = 0;
            TemplateImageNameList = TemplateImageNameList.sort();

            for (var i = 0; i < TemplateImageNameList.length - 1; i++) {
                if (TemplateImageNameList[i + 1] == TemplateImageNameList[i] && TemplateImageNameList[i] == imageName) {
                    isDuplicate = true;
                    duplicateIndex = i;
                    break;
                }
            }

            if (isDuplicate) {
                TemplateImageNameList.splice(duplicateIndex, 1);
                HidePageLoading();
            } else {
                $.ajax({
                    url: "/Mail/DesignUploadTemplateWithEditor/DeleteImage",
                    type: 'Post',
                    data: JSON.stringify({ 'accountId': Plumb5AccountId, 'mailTemplateId': TemplateId, 'imageName': imageName }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        if (response != undefined && response != null && response.Status) {
                            TemplateImageNameList.splice(duplicateIndex, 1);
                        }
                        HidePageLoading();
                    },
                    error: ShowAjaxError
                });
            }
        }
    },
    ReplaceImageOnlineToLocal: function (htmlContent, OnlineApplicationUrl, AccountId) {

        var AppDomain = OnlineApplicationUrl.replace("http://", "").replace("https://", "").replace("www.", "").replace(/\/+$/, '').toLowerCase();
        var m, urls = [], rex = /<img[^>]+src\s*=\s*"([^">]+)/g, rexForSingle = /<img[^>]+src\s*=\s*'([^'>]+)/g;

        while (m = rex.exec(htmlContent)) {
            if (urls.indexOf(m[1]) < 0)
                urls.push(m[1]);
        }

        while (m = rexForSingle.exec(htmlContent)) {
            if (urls.indexOf(m[1]) < 0)
                urls.push(m[1]);
        }

        for (var i = 0; i < urls.length; i++) {
            if (urls[i].toLowerCase().indexOf(AppDomain) > -1) {
                var replaceOfDomainContent = "";
                if (urls[i].lastIndexOf("/") > 0) {
                    replaceOfDomainContent = urls[i].substring(0, urls[i].lastIndexOf("/") + 1);
                }
                var regexForReplace = new RegExp(replaceOfDomainContent, "g");
                htmlContent = htmlContent.replace(regexForReplace, "");
            }
        }
        return htmlContent;
    },
    ReplaceAmpersand: function (htmlContent) {
        return htmlContent.replace(/&amp;/g, '&');
    },
    SaveTemplate: function () {
        var TemplateContent = $('#summernote').summernote('code');
        TemplateContent = EditorUtil.ReplaceCustomFields(TemplateContent);
        TemplateContent = EditorUtil.ReplaceImageOnlineToLocal(TemplateContent, OnlineUrl, Plumb5AccountId);
        TemplateContent = EditorUtil.ReplaceAmpersand(TemplateContent);
        TemplateContent = TemplateContent.replace(/p5html/g, 'html').replace(/p5body/g, 'body').replace(/p5head/g, 'head');
        TemplateContent = TemplateContent.replace(/P5HTML/g, 'HTML').replace(/P5BODY/g, 'BODY').replace(/P5HEAD/g, 'HEAD');
        TemplateContent = TemplateContent.replaceAll('<tbody></tbody>', '').replaceAll('<TBODY></TBODY>', '');

        let result = EditorUtil.GetReplaceFieldsInHtml(TemplateContent);

        if (result.Status) {
            $.ajax({
                url: "/Mail/TemplateDesign/UpdateEditContent",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'TemplateId': TemplateId, 'HtmlContent': TemplateContent }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response != null) {
                        if (response.Status) {
                            ShowSuccessMessage(response.Message);
                            setTimeout(() => { window.location.href = "/Mail/MailTemplate" }, 1000);
                        } else {
                            ShowErrorMessage(response.Message);
                            console.log(response.ExpectionMessage);
                        }
                    }
                    else {
                        ShowErrorMessage(GlobalErrorList.MailDesignUpload.UploadError);
                    }
                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        } else { HidePageLoading(); ShowErrorMessage(result.Error); }
    }
}

$("#ui_btnSaveTemplate").click(function () {
    ShowPageLoading();
    EditorUtil.SaveTemplate();
});
