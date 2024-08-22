let Id = 0, PageName = "", IsNew = true;
var TemplateImageNameList = [];
//var ContactMergeTagList = "";

$(document).ready(function () {
    Id = $.urlParam("Id");
    PageName = decodeURI(location.href.split("PageName").slice(1)[0].replace("=", ""));
    IsNew = $.urlParam("IsNew");
    if (Id > 0) {
        $("#ui_span_PageName").html(PageName);
        landingPageUploadEditorUtil.GetLandingPageDetails();
    }
});

var landingPageUploadEditorUtil = {
    GetLandingPageDetails: function () {
        $.ajax({
            url: "/Analytics/LandingPageUploadDesign/GetTemplateDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'LandingPageId': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: landingPageUploadEditorUtil.InitialiseEditor,
            error: ShowAjaxError
        });
    },
    InitialiseEditor: function (response) {
        if (response != undefined && response != null && response.Status != '') {
            var HtmlContent = response.HtmlContent.replace(/&amp;/g, '&');
            HtmlContent = landingPageUploadEditorUtil.ReplaceImageUrlLocalToOnline(HtmlContent);

            HtmlContent = HtmlContent.replaceAll('<tbody></tbody>', '').replaceAll('<TBODY></TBODY>', '');
            HtmlContent = HtmlContent.replace(/<html/g, '<p5html').replace(/<body/g, '<p5body').replace(/<head/g, '<p5head');
            HtmlContent = HtmlContent.replace(/<HTML/g, '<P5HTML').replace(/<BODY/g, '<P5BODY').replace(/<HEAD/g, '<P5HEAD');
            HtmlContent = HtmlContent.replace('</html>', '</p5html>').replace('</body>', '</p5body>').replace('</head>', '</p5head>');
            HtmlContent = HtmlContent.replace('</HTML>', '</P5HTML>').replace('</BODY>', '</P5BODY>').replace('</HEAD>', '</P5HEAD>');


            $("#summernote").html(HtmlContent);
            landingPageUploadEditorUtil.DrawEditor();
            HidePageLoading();
        }
        else {
            setTimeout(function () { window.location.href = "/Analytics/LandingPage"; }, 3000);
        }
    },
    DrawEditor: function () {
        var MergeTagsButton = function (context) {
            var ui = $.summernote.ui;
            var button = ui.buttonGroup([
                ui.button({
                    className: 'dropdown-toggle btn-variable',
                    tooltip: "User Attributes",
                    contents: '<span class="fa fa-user"></span> <span class="caret"></span>',
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
        }

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
                ['view', ['fullscreen', 'codeview', 'undo', 'redo']]
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
        TemplateContent = landingPageUploadEditorUtil.ReplaceImageOnlineToLocal(TemplateContent, OnlineUrl, Plumb5AccountId);
        TemplateContent = landingPageUploadEditorUtil.ReplaceAmpersand(TemplateContent);
        TemplateContent = TemplateContent.replace(/p5html/g, 'html').replace(/p5body/g, 'body').replace(/p5head/g, 'head');
        TemplateContent = TemplateContent.replace(/P5HTML/g, 'HTML').replace(/P5BODY/g, 'BODY').replace(/P5HEAD/g, 'HEAD');
        TemplateContent = TemplateContent.replaceAll('<tbody></tbody>', '').replaceAll('<TBODY></TBODY>', '');

        $.ajax({
            url: "/Analytics/LandingPageUploadDesign/UpdateEditContent",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'LandingPageId': Id, 'HtmlContent': TemplateContent, 'PageName': PageName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    if (response.Status) {
                        ShowSuccessMessage(response.Message);
                        setTimeout(() => { window.location.href = "/Analytics/LandingPage" }, 1000);
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
    }
};

$("#ui_btnSaveTemplate").click(function () {
    ShowPageLoading();
    landingPageUploadEditorUtil.SaveTemplate();
});