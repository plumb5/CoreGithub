var uploadOrSelect = false; // false means upload
var allUploadedFilesList = [], fileNames = [];;
var CNAME = "", LPNAME = "", IsLandingPageConfigEnabled = false;

$(document).ready(function () {
    landingPageTemplate.GetLandingPageConfiguration();
});

var landingPageTemplate = {
    GetLandingPageConfiguration: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Analytics/LandingPageTemplate/GetLandingPageConfiguration",
            type: 'Post',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    LPNAME = response.LandingPageName;
                    CNAME = response.CloudFrontUrl;
                    IsLandingPageConfigEnabled = response.IsLandingPageConfigEnabled;
                    $("#ui_span_LPName").html(response.LandingPageName);
                    $("#ui_span_CName").html(response.CloudFrontUrl);
                    if (!response.IsLandingPageConfigEnabled)
                        $(".btnwrp .errermess").removeClass("hideDiv");
                }
                $("#ui_span_DName").html(Plumb5AccountDomain);
                landingPageTemplate.GetStaticTemplates();
            },
            error: ShowAjaxError
        });
    },
    GetStaticTemplates: function () {
        $.ajax({
            url: "/Analytics/LandingPageTemplate/GetStaticTemplates",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: landingPageTemplate.BindStaticTemplates,
            error: ShowAjaxError
        });
    },
    BindStaticTemplates: function (response) {
        if (response != undefined && response != null && response.BasicTemplateDetailsList != undefined && response.BasicTemplateDetailsList != null && response.BasicTemplateDetailsList.length > 0) {
            var currentRow = 0;
            var reportTableDivs;
            for (var i = 0; i < response.BasicTemplateDetailsList.length; i++) {
                var currentBasicTemplateDetails = response.BasicTemplateDetailsList[i];
                let TemplateHeading = currentBasicTemplateDetails.TemplateHeading != null ? currentBasicTemplateDetails.TemplateHeading : "NA";
                let TemplateDescription = currentBasicTemplateDetails.TemplateDescription != null ? currentBasicTemplateDetails.TemplateDescription : "";

                if (currentRow == 0) {
                    reportTableDivs = $(document.createElement('div'));
                    $(reportTableDivs).addClass('card-group mt-3');

                    let BasicTempData = `<div class="card mr-2 border-left df-19">
                            <div class="templimgwrap" style="background-image: url(${currentBasicTemplateDetails.TemplatePreviewThumbImagePath});">
                                <div class="temppreviewbtnwrap">
                                    <button type="button" class="btn btn-second btn-lg">
                                        <a class="PreviewThisTemplate" href="javasctipt:void(0);" TemplateHeading="${currentBasicTemplateDetails.TemplateHeading}" DataHtmlPath="${currentBasicTemplateDetails.TemplateHtmlPath}" DataTemplateOrder="${currentBasicTemplateDetails.TemplateOrder}" DataJsonPath="${currentBasicTemplateDetails.TemplateJsonPath}">Preview</a>
                                    </button>
                                </div>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">${TemplateHeading}</h5>
                                <p class="card-text">${TemplateDescription}</p>
                            </div>
                            <div class="card-footer">
                                <small class="text-muted usetemppopup">
                                    <a class="UseThisTemplate" href="javasctipt:void(0)" DataTemplateOrder="${currentBasicTemplateDetails.TemplateOrder}" DataJsonPath="${currentBasicTemplateDetails.TemplateJsonPath}">Use this template</a>
                                </small>
                            </div>
                        </div>`;
                    $(reportTableDivs).append(BasicTempData);
                } else {
                    let BasicTempData = `<div class="card mr-2 border-left df-19">
                            <div class="templimgwrap" style="background-image: url(${currentBasicTemplateDetails.TemplatePreviewThumbImagePath});">
                                <div class="temppreviewbtnwrap">
                                    <button type="button" class="btn btn-second btn-lg">
                                        <a class="PreviewThisTemplate" href="javasctipt:void(0);" TemplateHeading="${currentBasicTemplateDetails.TemplateHeading}" DataHtmlPath="${currentBasicTemplateDetails.TemplateHtmlPath}" DataTemplateOrder="${currentBasicTemplateDetails.TemplateOrder}" DataJsonPath="${currentBasicTemplateDetails.TemplateJsonPath}">Preview</a>
                                    </button>
                                </div>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">${TemplateHeading}</h5>
                                <p class="card-text">${TemplateDescription}</p>
                            </div>
                            <div class="card-footer">
                                <small class="text-muted usetemppopup">
                                    <a class="UseThisTemplate" href="javasctipt:void(0)" DataTemplateOrder="${currentBasicTemplateDetails.TemplateOrder}" DataJsonPath="${currentBasicTemplateDetails.TemplateJsonPath}">Use this template</a>
                                </small>
                            </div>
                        </div>`;
                    $(reportTableDivs).append(BasicTempData);
                }

                if (currentRow == 4 || i == (response.BasicTemplateDetailsList.length - 1)) {
                    currentRow = 0;
                    $("#ui_divTempBasic").append(reportTableDivs);
                } else {
                    currentRow++;
                }
            }
        }

        if (response != undefined && response != null && response.PremiumTemplateDetailsList != undefined && response.PremiumTemplateDetailsList != null && response.PremiumTemplateDetailsList.length > 0) {
            var currentRow = 0;
            var reportTableDivs;
            for (var i = 0; i < response.PremiumTemplateDetailsList.length; i++) {
                var currentPremiumTemplateDetails = response.PremiumTemplateDetailsList[i];
                let TemplateHeading = currentPremiumTemplateDetails.TemplateHeading != null ? currentPremiumTemplateDetails.TemplateHeading : "NA";
                let TemplateDescription = currentPremiumTemplateDetails.TemplateDescription != null ? currentPremiumTemplateDetails.TemplateDescription : "";

                if (currentRow == 0) {
                    reportTableDivs = $(document.createElement('div'));
                    $(reportTableDivs).addClass('card-group');

                    let BasicTempData = `<div class="card mr-2 border-left df-19">
                            <div class="templimgwrap" style="background-image: url(${currentPremiumTemplateDetails.TemplatePreviewThumbImagePath});">
                                <div class="temppreviewbtnwrap">
                                    <button type="button" class="btn btn-second btn-lg">
                                        <a class="PreviewThisTemplate" href="javasctipt:void(0);" TemplateHeading="${currentPremiumTemplateDetails.TemplateHeading}" DataHtmlPath="${currentPremiumTemplateDetails.TemplateHtmlPath}" DataTemplateOrder="${currentBasicTemplateDetails.TemplateOrder}" DataJsonPath="${currentPremiumTemplateDetails.TemplateJsonPath}">Preview</a>
                                    </button>
                                </div>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">${TemplateHeading}</h5>
                                <p class="card-text">${TemplateDescription}</p>
                            </div>
                            <div class="card-footer">
                                <small class="text-muted usetemppopup">
                                    <a class="UseThisTemplate" href="javasctipt:void(0)" TemplateHeading="${currentPremiumTemplateDetails.TemplateHeading}" DataTemplateOrder="${currentPremiumTemplateDetails.TemplateOrder}" DataJsonPath="${currentPremiumTemplateDetails.TemplateJsonPath}">Use this template</a>
                                </small>
                            </div>
                        </div>`;
                    $(reportTableDivs).append(BasicTempData);
                } else {
                    let BasicTempData = `<div class="card mr-2 border-left df-19">
                            <div class="templimgwrap" style="background-image: url(${currentPremiumTemplateDetails.TemplatePreviewThumbImagePath});">
                                <div class="temppreviewbtnwrap">
                                    <button type="button" class="btn btn-second btn-lg">
                                        <a class="PreviewThisTemplate" href="javasctipt:void(0);" TemplateHeading="${currentPremiumTemplateDetails.TemplateHeading}" DataHtmlPath="${currentPremiumTemplateDetails.TemplateHtmlPath}" DataTemplateOrder="${currentBasicTemplateDetails.TemplateOrder}" DataJsonPath="${currentPremiumTemplateDetails.TemplateJsonPath}">Preview</a>
                                    </button>
                                </div>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">${TemplateHeading}</h5>
                                <p class="card-text">${TemplateDescription}</p>
                            </div>
                            <div class="card-footer">
                                <small class="text-muted usetemppopup">
                                    <a class="UseThisTemplate" href="javasctipt:void(0)" DataTemplateOrder="${currentPremiumTemplateDetails.TemplateOrder}" DataJsonPath="${currentPremiumTemplateDetails.TemplateJsonPath}">Use this template</a>
                                </small>
                            </div>
                        </div>`;
                    $(reportTableDivs).append(BasicTempData);
                }

                if (currentRow == 4 || i == (response.PremiumTemplateDetailsList.length - 1)) {
                    currentRow = 0;
                    var reportSubDiv = $(document.createElement('div'));
                    $(reportSubDiv).addClass('gallrow mt-3');
                    $(reportSubDiv).append(reportTableDivs);
                    $("#ui_divTempPremium").append(reportSubDiv);
                } else {
                    currentRow++;
                }
            }
        }
        HidePageLoading();
    },
    UseThisTemplate: function (TemplateOrder, JsonPath) {
        $("#ui_btn_LandingPageNext").attr("DataTemplateOrder", TemplateOrder);
        $("#ui_btn_LandingPageNext").attr("DataJsonPath", JsonPath);

        $(".popuptitle h6").html("Create Landing Page");
        $("#ui_divUploadLandingPage").removeClass('hideDiv');
        $("#ui_div_fileuploadwrap").addClass('hideDiv');
        $("#ui_div_uptempnotewrap").addClass('hideDiv');


    },
    CloseUploadTemplatePopup: function () {
        $("#ui_divUploadLandingPage").addClass('hideDiv');
        $("#ui_div_fileuploadwrap").addClass('hideDiv');
        $("#ui_div_uptempnotewrap").addClass('hideDiv');

        $("#ui_btn_LandingPageNext").removeAttr("DataTemplateOrder");
        $("#ui_btn_LandingPageNext").removeAttr("DataJsonPath");
    },
    ResetUploadTemplatePopup: function () {
        $("#editlpagename").val("");
        $("#editlpagedescrpt").val("");
    },
    CheckHtmlImageTag: function (files, filename) {
        ShowPageLoading();
        var fromdata = new FormData();
        fromdata.append(filename, files);

        $.ajax({
            url: "/Analytics/LandingPageTemplate/CheckHtmlImageTag",
            type: 'POST',
            data: fromdata,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function (result) {
                if (result) {
                    allUploadedFilesList.push(files);
                    fileNames.push(filename);
                }
                else {
                    $("#ui_files").val("");
                    ShowErrorMessage(GlobalErrorList.LandingPageTemplate.TemplateHtmlWrongImagePath);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    ValidateUploadLandingPage: function () {

        if ($("#editlpagename").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.LandingPage.PageName_error);
            return false;
        }

        if ($("#editlpagename").val().length > 0 && ($("#editlpagename").val().includes("@") || $("#editlpagename").val().includes(".") || $("#editlpagename").val().includes("#") || $("#editlpagename").val().includes("$") || $("#editlpagename").val().includes("%") || $("#editlpagename").val().includes("*") || $("#editlpagename").val().includes("/") || $("#editlpagename").val().includes("\\") || $("#editlpagename").val().includes("+") || $("#editlpagename").val().includes("-") || $("#editlpagename").val().includes("&") || $("#editlpagename").val().includes(" "))) {
            ShowErrorMessage(GlobalErrorList.LandingPage.PageName_Syntaxerror);
            return false;
        }

        if ($("#editlpagedescrpt").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.LandingPage.PageDescription_error);
            return false;
        }

        if (allUploadedFilesList.length == 0) {
            ShowErrorMessage(GlobalErrorList.LandingPageTemplate.NoTemplateFile);
            return false;
        }

        var isHtmlFileExists = false;
        var HtmlFileCount = 0;

        for (var i = 0; i < allUploadedFilesList.length; i++) {
            var fileExtension = GetFileExtension(allUploadedFilesList[i].name)[0].toLowerCase();

            if (fileExtension.indexOf("html") > -1 || fileExtension.indexOf("htm") > -1) {
                isHtmlFileExists = true;
                HtmlFileCount++;
            }
        }

        if (!isHtmlFileExists) {
            ShowErrorMessage(GlobalErrorList.LandingPageTemplate.NoTemplateHtmlFile);
            return false;
        }

        if (HtmlFileCount > 1) {
            ShowErrorMessage(GlobalErrorList.LandingPageTemplate.MoreTemplateHtmlFile);
            return false;
        }

        var checkFilesFor = ["jpg", "gif", "png", "bmp", "html", "htm", "JPG", "GIF", "PNG", "BMP", "HTML", "HTM"];
        for (var i = 0; i < allUploadedFilesList.length; i++) {
            var fileExtension = GetFileExtension(allUploadedFilesList[i].name)[0];

            if (checkFilesFor.indexOf(fileExtension) < 0) {
                ShowErrorMessage(GlobalErrorList.LandingPageTemplate.InvalidTemplateFile);
                return false;
            }
        }
        return true;
    },
    VerifyLandingPage: function (a, value) {
        ShowPageLoading();
        $.ajax({
            url: "/Analytics/LandingPageTemplate/VerifyLandingPage",
            type: 'Post',
            data: JSON.stringify({ 'CNAME': CNAME, 'LPNAME': LPNAME }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    if (a == 0)
                        ShowSuccessMessage(GlobalErrorList.LandingPage.Verify_success);
                }
                else
                    ShowErrorMessage(GlobalErrorList.LandingPage.Verify_error);
                if (a == 1) {
                    copyToClipboard(value)
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    ValidateBEELandingPage: function () {
        if ($("#editlpagename").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.LandingPage.PageName_error);
            return false;
        }

        if ($("#editlpagename").val().length > 0 && ($("#editlpagename").val().includes("@") || $("#editlpagename").val().includes(".") || $("#editlpagename").val().includes("#") || $("#editlpagename").val().includes("$") || $("#editlpagename").val().includes("%") || $("#editlpagename").val().includes("*") || $("#editlpagename").val().includes("/") || $("#editlpagename").val().includes("\\") || $("#editlpagename").val().includes("+") || $("#editlpagename").val().includes("-") || $("#editlpagename").val().includes("&") || $("#editlpagename").val().includes(" "))) {
            ShowErrorMessage(GlobalErrorList.LandingPage.PageName_Syntaxerror);
            return false;
        }

        if ($("#editlpagedescrpt").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.LandingPage.PageDescription_error);
            return false;
        }

        return true;
    },
    SaveOrUpdateLandingPage: function (LandingPageDetails) {
        ShowPageLoading();
        $.ajax({
            url: "/Analytics/LandingPageTemplate/SaveOrUpdateLandingPage",
            type: 'Post',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'landingPage': LandingPageDetails }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                let id = 0, pagename = LandingPageDetails.PageName;
                if (LandingPageDetails.Id > 0) {
                    id = parseInt(LandingPageDetails.Id);
                    if (response) {
                        ShowSuccessMessage(GlobalErrorList.LandingPage.Update_success);

                        const responseTimeout = setTimeout(function () { ShowPageLoading(); }, 2000);
                        const responseOneTimeout = setTimeout(function () { landingPageTemplate.RedirectToEditor(id, pagename); }, 3000);
                    }
                    else
                        ShowErrorMessage(GlobalErrorList.LandingPage.Update_error);
                }
                else {
                    if (response > 0) {
                        id = parseInt(response);
                        ShowSuccessMessage(GlobalErrorList.LandingPage.Save_success);
                        var TemplateOrder = $("#ui_btn_LandingPageNext").attr('DataTemplateOrder');
                        const responseTimeout = setTimeout(function () { ShowPageLoading(); landingPageTemplate.SaveStaticFiles(id, TemplateOrder, pagename) }, 3000);
                    }
                    else
                        ShowErrorMessage(GlobalErrorList.LandingPage.Save_error);
                }
                $(".popupcontainer").addClass("hideDiv");
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    RedirectToBeeEditor: function (id, pagename) {
        window.location.href = "/Analytics/LandingPageEditor?Id=" + id + "&IsNew=true&PageName=" + encodeURI(pagename);
    },
    RedirectToEditor: function (id, pagename) {
        window.location.href = "/Analytics/LandingPageUploadDesign?Id=" + id + "&IsNew=true&PageName=" + encodeURI(pagename);
    },
    SaveStaticFiles: function (Id, TemplateOrder, PageName) {
        $.ajax({
            url: "/Analytics/LandingPageTemplate/SaveStaticFiles",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'LandingPageId': Id, 'GalleryTemplateId': TemplateOrder }),
            dataType: "json",
            success: function (response) {
                if (response) {
                    const responseOneTimeout = setTimeout(function () { landingPageTemplate.RedirectToBeeEditor(Id, PageName); }, 3000);
                }
            },
            error: ShowAjaxError
        });
    },
    SaveUploadTemplate: function () {
        var fromdata = typeof window.FormData == "undefined" ? [] : new window.FormData();
        for (var i = 0; i < allUploadedFilesList.length; i++) {
            if (typeof window.FormData == "undefined") {
                fromdata.push(allUploadedFilesList[i].name, allUploadedFilesList[i]);
            }
            else {
                fromdata.append(allUploadedFilesList[i].name, allUploadedFilesList[i]);
            }
        }

        var LandingPageDetails = { Id: 0, UserInfoUserId: 0, UserGroupId: 0, PageName: $("#editlpagename").val(), PageDescription: $("#editlpagedescrpt").val(), CreatedDate: "", Content: "", UpdatedDate: "", LandingPageConfigurationId: 0, IsBeeTemplate: false, IsTemplateSaved: false };

        $.ajax({
            url: "/Analytics/LandingPageTemplate/SaveUploadedTemplate?accountId=" + Plumb5AccountId + "&landingPage=" + JSON.stringify(LandingPageDetails),
            type: 'POST',
            data: fromdata,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function (response) {
                if (!response.Status) {
                    ShowErrorMessage(response.Message);
                    HidePageLoading();
                }
                else if (response.Status) {
                    let id = response.LandingPageId, pagename = LandingPageDetails.PageName;
                    ShowSuccessMessage(GlobalErrorList.MailTemplate.TemplateCreated);
                    const responseOneTimeout = setTimeout(function () { landingPageTemplate.RedirectToEditor(id, pagename); }, 3000);
                }
            },
            error: ShowAjaxError
        });
    }
};

$(document).on("click", ".UseThisTemplate", function () {
    landingPageTemplate.ResetUploadTemplatePopup();
    var TemplateOrder = $(this).attr('DataTemplateOrder');
    var JsonPath = $(this).attr('DataJsonPath');
    uploadOrSelect = true;
    landingPageTemplate.UseThisTemplate(TemplateOrder, JsonPath);
});

function copyToClipboard(value) {
    var tempInput = document.createElement("input");
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}

$("#ui_button_CopyClpbrd").click(function () {
    let value = $("#ui_span_CName").html();
    copyToClipboard(value);
});

$("#ui_btnUploadTemplate").click(function () {
    landingPageTemplate.ResetUploadTemplatePopup();
    uploadOrSelect = false;
    $(".popuptitle h6").html("Create Landing Page");
    $("#ui_divUploadLandingPage").removeClass('hideDiv');
    $("#ui_div_fileuploadwrap").removeClass('hideDiv');
    $("#ui_div_uptempnotewrap").removeClass('hideDiv');
});

$(".btnverify").click(function () {
    if (CNAME != "" && LPNAME != "" && IsLandingPageConfigEnabled)
        landingPageTemplate.VerifyLandingPage(0, "");
    else {
        ShowErrorMessage(GlobalErrorList.LandingPage.Configuration_Error);
        return false;
    }
});

$(document.body).on('change', '#ui_files', function () {
    ShowPageLoading();
    var uploadfiles = $(this).get(0);
    if (uploadfiles != null) {
        for (var i = 0; i < uploadfiles.files.length; i++) {
            if (fileNames.indexOf(uploadfiles.files[i].name) < 0) {
                if (uploadfiles.files[i].name.includes("html") || uploadfiles.files[i].name.includes("htm")) {
                    var f = uploadfiles.files[i];
                    if (f) {
                        landingPageTemplate.CheckHtmlImageTag(uploadfiles.files[i], uploadfiles.files[i].name);
                    }
                    else {
                        ShowErrorMessage(GlobalErrorList.LandingPageTemplate.TemplateHtmlWrongImagePath);
                    }
                }
                else {
                    allUploadedFilesList.push(uploadfiles.files[i]);
                    fileNames.push(uploadfiles.files[i].name);
                }
            }
        }
    }
    HidePageLoading();
});

$("#close-popup, .clsepopup").click(function () {
    landingPageTemplate.CloseUploadTemplatePopup();
});

$("#ui_btn_LandingPageNext").click(function () {
    if (uploadOrSelect) {
        if (!landingPageTemplate.ValidateBEELandingPage())
            return false;

        var LandingPageDetails = { Id: 0, UserInfoUserId: 0, UserGroupId: 0, PageName: "", PageDescription: "", CreatedDate: "", Content: "", UpdatedDate: "", LandingPageConfigurationId: 0, IsBeeTemplate: true, IsTemplateSaved: false };

        LandingPageDetails.PageName = $("#editlpagename").val();
        LandingPageDetails.PageDescription = $("#editlpagedescrpt").val();

        landingPageTemplate.SaveOrUpdateLandingPage(LandingPageDetails);
    }
    else {
        if (!landingPageTemplate.ValidateUploadLandingPage())
            return false;

        landingPageTemplate.SaveUploadTemplate();
    }
});