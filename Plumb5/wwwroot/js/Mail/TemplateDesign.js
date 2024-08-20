
var CampaignIdentifierList = [];
var allUploadedFilesList = [];
var fileNames = [];
var ExistingData;
var TempId = 0;
var BeeTemplate = true;
$(document).ready(function () {
    DragDroReportUtil.BindUrlEventMappingDetails('');
    GetContactFielddragdrop('');
    DragDroReportUtil.GetReport();
    TemplateDesignUtil.Initialization();
});

var TemplateDesignUtil = {
    Initialization: function () {
        TemplateDesignUtil.GetCampaign();
    },
    GetCampaign: function () {
        $.ajax({
            url: "/Mail/TemplateDesign/GetMailCampaignList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function () {
                    CampaignIdentifierList.push({ Name: $(this)[0].Name, Id: $(this)[0].Id });
                });
                TemplateDesignUtil.BindCampaign();
            },
            error: ShowAjaxError
        });
    },
    BindCampaign: function () {
        $("#ui_ddlUploadTemplateCampaign").append(`<option value="0">Select Campaign</option>`);
        $("#ui_ddlDesignTemplateCampaign").append(`<option value="0">Select Campaign</option>`);

        for (var i = 0; i < CampaignIdentifierList.length; i++) {
            $("#ui_ddlUploadTemplateCampaign").append(`<option value="${CampaignIdentifierList[i].Id}">${CampaignIdentifierList[i].Name}</option>`);
            $("#ui_ddlDesignTemplateCampaign").append(`<option value="${CampaignIdentifierList[i].Id}">${CampaignIdentifierList[i].Name}</option>`);
        }

        $('.addCampName').select2({
            placeholder: 'This is my placeholder',
            minimumResultsForSearch: '',
            dropdownAutoWidth: false,
            containerCssClass: 'dropdownactiv'
        });

        TemplateDesignUtil.GetStaticTemplates();
    },
    GetStaticTemplates: function () {
        $.ajax({
            url: "/Mail/TemplateDesign/GetStaticTemplates",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: TemplateDesignUtil.BindStaticTemplates,
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
        $("#ui_btnDesignTemplateNext").attr("DataTemplateOrder", TemplateOrder);
        $("#ui_btnDesignTemplateNext").attr("DataJsonPath", JsonPath);
        $("#ui_divDesignTemplate").removeClass('hideDiv');
    },
    CloseDesignTemplatePopup: function () {
        $("#ui_ddlDesignTemplateCampaign").val("0");
        $("#ui_txtDesignTemplateName").val('');
        $("#ui_txtareaDesignTemplateDesc").val('');
        $("#ui_txtSubjectLine").val('');
        $("#ui_btnDesignTemplateNext").removeAttr("DataTemplateOrder");
        $("#ui_btnDesignTemplateNext").removeAttr("DataJsonPath");
        $("#ui_divDesignTemplate").addClass('hideDiv');
    },
    ValidateDesignTemplate: function () {

        var MailCampaignId = $("#ui_ddlDesignTemplateCampaign").val();
        var TemplateName = $.trim($("#ui_txtDesignTemplateName").val());
        var TemplateDescription = $.trim($("#ui_txtareaDesignTemplateDesc").val());

        if (MailCampaignId == "0") {
            ShowErrorMessage(GlobalErrorList.MailTemplate.SelectCampaign);
            return false;
        }

        if (TemplateName.length == 0) {
            ShowErrorMessage(GlobalErrorList.MailTemplate.EnterTemplateName);
            return false;
        }

        if (TemplateDescription.length == 0) {
            ShowErrorMessage(GlobalErrorList.MailTemplate.EnterTemplateDescription);
            return false;
        }

        if (!($("#ui_btnDesignTemplateNext")[0].hasAttribute('DataTemplateOrder'))) {
            ShowErrorMessage(GlobalErrorList.MailTemplate.NoDataTemplateOrderAttribute);
            return false;
        }

        var GalleryTemplateId = $("#ui_btnDesignTemplateNext").attr("DataTemplateOrder");
        if (GalleryTemplateId == undefined || GalleryTemplateId == null || GalleryTemplateId == '' || GalleryTemplateId <= 0) {
            ShowErrorMessage(GlobalErrorList.MailTemplate.NoPredefinedTemplateId);
            return false;
        }

        return true;
    },
    SaveDesignTemplate: function () {
        var MailCampaignId = $("#ui_ddlDesignTemplateCampaign").val();
        var TemplateName = $.trim($("#ui_txtDesignTemplateName").val());
        var TemplateDescription = $.trim($("#ui_txtareaDesignTemplateDesc").val());
        var GalleryTemplateId = $("#ui_btnDesignTemplateNext").attr("DataTemplateOrder");
        var SubjectLine = AppendCustomField($.trim($("#ui_txtSubjectLine").val()));

        var mailTemplate = { MailCampaignId: MailCampaignId, Name: TemplateName, TemplateDescription: TemplateDescription, TemplateStatus: true, IsBeeTemplate: true, SubjectLine: SubjectLine };

        $.ajax({
            url: "/Mail/TemplateDesign/SaveStaticTemplate",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'mailTemplate': mailTemplate, 'GalleryTemplateId': GalleryTemplateId }),
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.Id > 0) {
                    ShowSuccessMessage(GlobalErrorList.MailTemplate.TemplateCreated);
                    setTimeout(function () { window.location.href = "/Mail/DesignTemplateWithP5Editor/?TemplateId=" + response.Id + "&IsNew=true&TemplateName=" + encodeURI(response.Name); }, 3000);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.MailTemplate.TemplateNameExists);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    CloseUploadTemplatePopup: function () {
        $("#ui_ddlUploadTemplateCampaign").val("0");
        $("#ui_txtUploadTemplateName").val('');
        $("#ui_txtareaUploadTemplateDesc").val('');
        $("#ui_txtUploadTSubjectLine").val('');
        $("#ui_divUploadTemplate").addClass('hideDiv');
    },
    CheckHtmlImageTag: function (files, filename) {
        ShowPageLoading();
        var fromdata = new FormData();
        fromdata.append(filename, files);

        $.ajax({
            url: "/Mail/TemplateDesign/CheckHtmlImageTag",
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
                    ShowErrorMessage(GlobalErrorList.MailTemplate.TemplateHtmlWrongImagePath);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    ValidateUploadTemplate: function () {

        if ($("#ui_ddlUploadTemplateCampaign").val() == "0") {
            ShowErrorMessage(GlobalErrorList.MailTemplate.SelectCampaign);
            return false;
        }

        if ($.trim($("#ui_txtUploadTemplateName").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.MailTemplate.EnterTemplateName);
            return false;
        }

        if ($.trim($("#ui_txtareaUploadTemplateDesc").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.MailTemplate.EnterTemplateDescription);
            return false;
        }

        if (allUploadedFilesList.length == 0) {
            ShowErrorMessage(GlobalErrorList.MailTemplate.NoTemplateFile);
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
            ShowErrorMessage(GlobalErrorList.MailTemplate.NoTemplateHtmlFile);
            return false;
        }

        if (HtmlFileCount > 1) {
            ShowErrorMessage(GlobalErrorList.MailTemplate.MoreTemplateHtmlFile);
            return false;
        }

        var checkFilesFor = ["jpg", "gif", "png", "bmp", "html", "htm", "JPG", "GIF", "PNG", "BMP", "HTML", "HTM"];
        for (var i = 0; i < allUploadedFilesList.length; i++) {
            var fileExtension = GetFileExtension(allUploadedFilesList[i].name)[0];

            if (checkFilesFor.indexOf(fileExtension) < 0) {
                ShowErrorMessage(GlobalErrorList.MailTemplate.InvalidTemplateFile);
                return false;
            }
        }
        return true;
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

        var mailTemplate = {
            MailCampaignId: $("#ui_ddlUploadTemplateCampaign").val(),
            Name: $.trim($("#ui_txtUploadTemplateName").val()),
            TemplateDescription: $.trim($("#ui_txtareaUploadTemplateDesc").val()),
            SubjectLine: ReplaceHtmlUrl($.trim($("#ui_txtUploadTSubjectLine").val())),
            TemplateStatus: true,
            IsBeeTemplate: false
        };

        $.ajax({
            url: "/Mail/TemplateDesign/SaveUploadedTemplate?accountId=" + Plumb5AccountId + "&mailTemplate=" + JSON.stringify(mailTemplate),
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
                    ShowSuccessMessage(GlobalErrorList.MailTemplate.TemplateCreated);
                    setTimeout(function () { window.location.href = "/Mail/DesignUploadTemplateWithEditor/?TemplateId=" + response.MailTemplateId + "&IsNew=true"; }, 3000);
                }
            },
            error: ShowAjaxError
        });
    },
    CheckTemplateExists: function () {
        let TemplateName;
        if (BeeTemplate == true) {
            TemplateName = $("#ui_txtDesignTemplateName").val();
        } else {
            TemplateName = $("#ui_txtUploadTemplateName").val();
        }

        ShowPageLoading();
        $.ajax({
            url: "/Mail/MailTemplate/GetArchiveTemplate",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'TemplateName': TemplateName, "IsBeeTemplate": BeeTemplate }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: TemplateDesignUtil.CheckandPop,
            error: ShowAjaxError
        });
    },
    CheckandPop: function (response) {
        if (response != undefined && response != null && response.Template != null) {
            ExistingData = response.Template;
            HidePageLoading();
            $("#tempexistmod").modal("show");

        } else {
            if (BeeTemplate == true) {
                TemplateDesignUtil.SaveDesignTemplate();
            } else {
                TemplateDesignUtil.SaveUploadTemplate();
            }
        }
    },
    UpdateTemplateStatus: function (TemplateId) {
        ShowPageLoading();
        $.ajax({
            url: "/Mail/MailTemplate/UpdateArchiveStatus",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': TemplateId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("#tempexistmod").modal("hide");
                ShowSuccessMessage(GlobalErrorList.WebpushTemplate.TemplateRestoredSuccess);
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    EditedTemplate: function (TemplateId) {
        var mailTemplate;

        if (BeeTemplate == true) {
            mailTemplate = {
                Id: TemplateId,
                MailCampaignId: $("#ui_ddlDesignTemplateCampaign").val(),
                Name: $.trim($("#ui_txtDesignTemplateName").val()),
                TemplateDescription: $.trim($("#ui_txtareaDesignTemplateDesc").val()),
                SubjectLine: $.trim(ReplaceCustomFields($("#ui_txtSubjectLine").val())),
                TemplateStatus: true,
                IsBeeTemplate: true
            };
        } else {
            mailTemplate = {
                Id: TemplateId,
                MailCampaignId: $("#ui_ddlUploadTemplateCampaign").val(),
                Name: $.trim($("#ui_txtUploadTemplateName").val()),
                TemplateDescription: $.trim($("#ui_txtareaUploadTemplateDesc").val()),
                SubjectLine: $.trim($("#ui_txtUploadTSubjectLine").val()),
                TemplateStatus: true,
                IsBeeTemplate: false
            }
        }


        $.ajax({
            url: "/Mail/MailTemplate/SaveEditedTemplate",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'mailTemplate': mailTemplate }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != undefined && response.Id > 0) {
                    if (BeeTemplate == true) {
                        ShowSuccessMessage(GlobalErrorList.MailTemplate.TemplateUpdated);
                        setTimeout(function () { window.location.href = "/Mail/DesignTemplateWithEditor/?TemplateId=" + response.Id + "&IsNew=false&TemplateName=" + encodeURI(response.Name); }, 3000);
                    } else {
                        ShowSuccessMessage(GlobalErrorList.MailTemplate.TemplateUpdated);
                        setTimeout(function () { window.location.href = "/Mail/DesignUploadTemplateWithEditor/?TemplateId=" + response.Id + "&IsNew=false"; }, 3000);
                    }
                } else {
                    ShowErrorMessage(GlobalErrorList.MailTemplate.TemplateNameExists);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    }
}

$(document).on('click', '#archiverestore', function () {
    TempId = ExistingData.Id;

    if (BeeTemplate == true) {
        if (ExistingData.MailCampaignId > 0) {
            $("#ui_ddlDesignTemplateCampaign").val(ExistingData.MailCampaignId).change();
        } else {
            $("#ui_ddlDesignTemplateCampaign").val("0").change();
        }

        if (ExistingData.Name != undefined && ExistingData.Name != null && ExistingData.Name != "") {
            $("#ui_txtDesignTemplateName").val(ExistingData.Name);
        } else {
            $("#ui_txtDesignTemplateName").val("");
        }

        if (ExistingData.TemplateDescription != undefined && ExistingData.TemplateDescription != null && ExistingData.TemplateDescription != "") {
            $("#ui_txtareaDesignTemplateDesc").val(ExistingData.TemplateDescription);
        } else {
            $("#ui_txtareaDesignTemplateDesc").val("");
        }

        if (ExistingData.SubjectLine != undefined && ExistingData.SubjectLine != null && ExistingData.SubjectLine != "") {
            $("#ui_txtSubjectLine").val(ReplaceCustomFields(ExistingData.SubjectLine));
        } else {
            $("#ui_txtSubjectLine").val("");
        }
    } else {
        if (ExistingData.MailCampaignId > 0) {
            $("#ui_ddlUploadTemplateCampaign").val(ExistingData.MailCampaignId).change();
        } else {
            $("#ui_ddlUploadTemplateCampaign").val("0").change();
        }

        if (ExistingData.Name != undefined && ExistingData.Name != null && ExistingData.Name != "") {
            $("#ui_txtUploadTemplateName").val(ExistingData.Name);
        } else {
            $("#ui_txtUploadTemplateName").val("");
        }

        if (ExistingData.TemplateDescription != undefined && ExistingData.TemplateDescription != null && ExistingData.TemplateDescription != "") {
            $("#ui_txtareaUploadTemplateDesc").val(ExistingData.TemplateDescription);
        } else {
            $("#ui_txtareaUploadTemplateDesc").val("");
        }

        if (ExistingData.SubjectLine != undefined && ExistingData.SubjectLine != null && ExistingData.SubjectLine != "") {
            $("#ui_txtUploadTSubjectLine").val(ExistingData.SubjectLine);
        } else {
            $("#ui_txtUploadTSubjectLine").val("");
        }
    }

    TemplateDesignUtil.UpdateTemplateStatus(ExistingData.Id);
});

//#region UploadTemplate

$("#ui_btnUploadTemplate").click(function () {
    $("#ui_divUploadTemplate").removeClass('hideDiv');
});

$("#ui_btnCloseUploadTemplatePopup").click(function () {
    TemplateDesignUtil.CloseUploadTemplatePopup();
});

$("#ui_iconCloseUploadTemplatePopup").click(function () {
    TemplateDesignUtil.CloseUploadTemplatePopup();
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
                        TemplateDesignUtil.CheckHtmlImageTag(uploadfiles.files[i], uploadfiles.files[i].name);
                    }
                    else {
                        ShowErrorMessage(GlobalErrorList.MailTemplate.TemplateHtmlWrongImagePath);
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

$("#ui_btnCreateTemplate").click(function () {
    BeeTemplate = false;
    ShowPageLoading();

    if (!TemplateDesignUtil.ValidateUploadTemplate()) {
        HidePageLoading();
        return true;
    }

    if (TempId > 0) {
        TemplateDesignUtil.EditedTemplate(TempId);
    } else {
        TemplateDesignUtil.CheckTemplateExists();
    }
});

//#endregion UploadTemplate

//#region StaticTemplate

$(document).on("click", ".UseThisTemplate", function () {
    var TemplateOrder = $(this).attr('DataTemplateOrder');
    var JsonPath = $(this).attr('DataJsonPath');
    TemplateDesignUtil.UseThisTemplate(TemplateOrder, JsonPath);
});

$("#ui_btnCloseDesignTemplatePopup").click(function () {
    TemplateDesignUtil.CloseDesignTemplatePopup();
});

$("#ui_iconCloseDesignTemplatePopup").click(function () {
    TemplateDesignUtil.CloseDesignTemplatePopup();
});

$(document).on("click", ".PreviewThisTemplate", function () {
    $("#ui_sectionTemplateDesign").addClass('hideDiv');
    $("#ui_sectionTemplatePreview").removeClass('hideDiv');
    var TemplateHtmlPath = $(this).attr('DataHtmlPath');
    var TemplateOrder = $(this).attr('DataTemplateOrder');
    var JsonPath = $(this).attr('DataJsonPath');
    var TemplateHeading = $(this).attr('TemplateHeading');
    $("#ui_SampleTemplate").html(`(${TemplateHeading})`);

    $("#ui_btnPreviewUseThisTemplate").attr("DataTemplateOrder", TemplateOrder);
    $("#ui_btnPreviewUseThisTemplate").attr("DataJsonPath", JsonPath);

    $("#ui_iframeWebTemplate").removeAttr("src").attr("src", TemplateHtmlPath);
    $("#ui_iframeMobileTemplate").removeAttr("src").attr("src", TemplateHtmlPath);
});

$("#ui_btnPreviewBack").click(function () {
    $("#ui_iframeWebTemplate").removeAttr("src");
    $("#ui_iframeMobileTemplate").removeAttr("src");
    $("#ui_btnPreviewUseThisTemplate").removeAttr("DataTemplateOrder");
    $("#ui_btnPreviewUseThisTemplate").removeAttr("DataJsonPath");
    $("#ui_sectionTemplatePreview").addClass('hideDiv');
    $("#ui_sectionTemplateDesign").removeClass('hideDiv');
});

$("#ui_btnPreviewUseThisTemplate").click(function () {
    var TemplateOrder = $("#ui_btnPreviewUseThisTemplate").attr('DataTemplateOrder');
    var JsonPath = $("#ui_btnPreviewUseThisTemplate").attr('DataJsonPath');
    TemplateDesignUtil.UseThisTemplate(TemplateOrder, JsonPath);
});

$("#ui_btnDesignTemplateNext").click(function () {
    BeeTemplate = true;
    ShowPageLoading();

    if (!TemplateDesignUtil.ValidateDesignTemplate()) {
        HidePageLoading();
        return true;
    }

    if (TempId > 0) {
        TemplateDesignUtil.EditedTemplate(TempId);
    } else {
        TemplateDesignUtil.CheckTemplateExists();
    }
});
$('#draganddropcutomre').on('change', function () {
 if (this.value != "Select") {
    let input = $('#ui_txtSubjectLine')[0]; // get the input element
    let cursorPos = input.selectionStart; // get the current cursor position
    let currentValue = input.value; // get the current input value
    let newValue = currentValue.substring(0, cursorPos) + `[{*${this.value}*}]` + currentValue.substring(cursorPos); // insert the new data at the cursor position
    input.value = newValue; // set the updated value
 }
    //$("#ui_txtSubjectLine").val($("#ui_txtSubjectLine").val() + " [{*" + this.value + "*}]");
});


$('#eventitemsmessage').on('change', function () {
if (this.value != "Select") {
    let input = $('#ui_txtSubjectLine')[0]; // get the input element
    let cursorPos = input.selectionStart; // get the current cursor position
    let currentValue = input.value; // get the current input value
    let newValue = currentValue.substring(0, cursorPos) + `{{*[${eventname}]~[${this.value}]~[TOP1.DESC]~[fallbackdata]*}}` + currentValue.substring(cursorPos); // insert the new data at the cursor position
    input.value = newValue; // set the updated value
}
    //$("#ui_txtSubjectLine").val($("#ui_txtSubjectLine").val() + " {{*[" + eventname + "]~[" + this.value + "]~[TOP1.DESC]~[fallbackdata]*}}");
});
//#endregion StaticTemplate