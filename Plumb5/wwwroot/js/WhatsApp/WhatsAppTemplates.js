var deleteId = 0;
var CampaignIdentifierList = [];
var whatsappTemplateId = 0, whatsappCampaignId = 0;
var TemplateCounselorTags = false;
let DefaultConfigurationNameId = 0;
var TempId = 0;
var CopyTempId = 0;
$(document).ready(function () {
    WhatsAppTemplateUtil.GetCampaign();
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    WhatsAppTemplateUtil.MaxCount();
}

function CallBackPaging() {
    CurrentRowCount = 0;
    WhatsAppTemplateUtil.MaxCount();
}


var WhatsAppTemplateUtil = {
    GetCampaign: function () {
        $.ajax({
            url: "/WhatsApp/WhatsAppTemplates/GetCampaignList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function () {
                    CampaignIdentifierList.push({ Name: $(this)[0].Name, Id: $(this)[0].Id });
                });
                WhatsAppTemplateUtil.BindCampaign();
            },
            error: ShowAjaxError
        });
    },
    BindCampaign: function () {
        $("#ui_ddlTemplateCampaign, #ui_ddl_TemplateCampaign").append(`<option value="0">Select Campaign</option>`);

        for (var i = 0; i < CampaignIdentifierList.length; i++) {
            $("#ui_ddlTemplateCampaign, #ui_ddl_TemplateCampaign").append(`<option value="${CampaignIdentifierList[i].Id}">${CampaignIdentifierList[i].Name}</option>`);
        }

        WhatsAppTemplateUtil.GetWAConfigurations();
    },
    GetWAConfigurations: function () {
        $.ajax({
            url: "/WhatsApp/WhatsAppSettings/GetConfigurationNames",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    $("#ui_ConfigurationName").empty();
                    $("#ui_ConfigurationName").append(`<option value="0">Select Configuration Name</option>`);
                    $.each(response, function (i) {
                        $("#ui_ConfigurationName").append("<option value='" + response[i].Id + "'>" + response[i].ConfigurationName + "</option>");
                        if (response[i].IsDefaultProvider)
                            DefaultConfigurationNameId = response[i].Id;
                    });
                    $("#ui_ConfigurationName").select2().val(DefaultConfigurationNameId).change();
                }
                WhatsAppTemplateUtil.BindGroups();
            },
            error: ShowAjaxError
        });
    },
    BindGroups: function () {
        $.ajax({
            url: "/WhatsApp/WhatsAppTemplates/GetGroupList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    $.each(response, function () {
                        $("#ui_drpdwn_ContactGroups").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                        $("#testcampgroupname").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    });
                }
                WhatsAppTemplateUtil.LoadPage();
            },
            error: ShowAjaxError
        });
    },
    LoadPage: function () {
        ShowPageLoading();
        TotalRowCount = 0;
        CurrentRowCount = 0;
        WhatsAppTemplateUtil.MaxCount();
    },
    MaxCount: function () {
        var whatsAppTemplate = { Name: "" };
        whatsAppTemplate.Name = $('#ui_txt_TemplateSearch').val();

        $.ajax({
            url: "/WhatsApp/WhatsAppTemplates/GetMaxCount",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'whatsAppTemplate': whatsAppTemplate }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = response.returnVal;
                if (TotalRowCount > 0) {
                    $("#ui_tbodyReportData").html('');
                    WhatsAppTemplateUtil.GetReport();
                }
                else {
                    SetNoRecordContent('ui_tableReport', 4, 'ui_tbodyReportData');
                    ShowExportDiv(false);
                    ShowPagingDiv(false);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetReport: function () {
        FetchNext = GetNumberOfRecordsPerPage();
        var whatsAppTemplate = { Name: "" };
        whatsAppTemplate.Name = $('#ui_txt_TemplateSearch').val();

        $.ajax({
            url: "/WhatsApp/WhatsAppTemplates/GetReport",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'whatsAppTemplate': whatsAppTemplate, 'OffSet': OffSet, 'FetchNext': FetchNext }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: WhatsAppTemplateUtil.BindTemplateDetails,
            error: ShowAjaxError
        });
    },
    BindTemplateDetails: function (responsedata) {
        var response = responsedata.Data;
        if (response !== undefined && response !== null && response.length > 0) {
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

            ShowExportDiv(true);
            ShowPagingDiv(true);
            $("#ui_tableReport").removeClass('no-data-records');

            $("#ui_tbodyReportData").empty();
            $.each(response, function () {
                WhatsAppTemplateUtil.BindEachReport(this);
            });
            /*SetPreview();*/
        }
        else {
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
        CheckAccessPermission("WhatsApp");
    },
    BindEachReport: function (eachData) {

        let reportTablerows = `<tr id="ui_tr_WATemplate_${eachData.Id}">
                                    <td class="text-center">
                                        <div class="smsprevwrap prevwhatsapp" onclick="WhatsAppTemplateUtil.PreviewTemplate('${eachData.Name.replace(/%20/g, ' ')}', '${eachData.TemplateContent.replace(/\n/g, '~n~')}', '${eachData.ButtonOneText}', '${eachData.ButtonOneType}', '${eachData.ButtonTwoText}', '${eachData.ButtonTwoType}', '${eachData.MediaFileURL}', '${eachData.TemplateType}');">
                                                <i class="icon ion-ios-eye-outline"></i>
                                        </div>
                                    </td>
                                    <td class="text-left">
                                        <div class="groupnamewrap">
                                            <div class="nametitWrap">
                                                <span class="groupNameTxt">${eachData.Name.replace(/%20/g, ' ')}</span>
                                            </div>
                                            <div class="tdcreatedraft">
                                                <div class="dropdown">
                                                    <button type="button" class="verticnwrp"
                                                        data-toggle="dropdown" aria-haspopup="true"
                                                        aria-expanded="false"><i
                                                            class="icon ion-android-more-vertical mr-0"></i></button>
                                                    <div id="mailtempaction"
                                                        class="dropdown-menu dropdown-menu-right"
                                                        aria-labelledby="filterbycontacts">
                                                        <a class="dropdown-item whatsappedit DesignPermission"
                                                            href="javascript:void(0);" onclick="WhatsAppTemplateUtil.EditTemplate(${eachData.Id},${eachData.WhatsAppCampaignId},'${eachData.Name.replace(/%20/g, ' ')}','${eachData.TemplateDescription.replace(/%20/g, ' ')}');">Edit</a>
                                                        <a class="dropdown-item ContributePermission"
                                                            href="javascript:void(0);" onclick="WhatsAppTemplateUtil.DuplicateTemplate(${eachData.Id},${eachData.WhatsAppCampaignId},'${eachData.Name.replace(/%20/g, ' ')}','${eachData.TemplateDescription.replace(/%20/g, ' ')}');">Duplicate</a>
                                                        <a class="dropdown-item whatsapptest ContributePermission"
                                                            href="javascript:void(0);" onclick="WhatsAppTemplateUtil.TestTemplate(${eachData.Id},${eachData.WhatsAppCampaignId},'${eachData.Name.replace(/%20/g, ' ')}');">Test</a>
                                                        <div class="dropdown-divider"></div>
                                                        <a class="dropdown-item FullControlPermission" data-toggle="modal"
                                                            data-target="#ui_divDeleteDialog"
                                                            href="javascript:void(0);" onclick="WhatsAppTemplateUtil.ShowDeletePopUp(${eachData.Id});">Archive</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td class="text-left">
                                        <div class="groupnamewrap">
                                            <div class="nametitWrap">
                                                <span>${eachData.CampaignName}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-left">
                                        <div class="groupnamewrap">
                                            <div class="nametitWrap">
                                                <span> ${eachData.TemplateType[0].toUpperCase() + eachData.TemplateType.slice(1)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(eachData.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(eachData.CreatedDate))}</td>
                                </tr>`;

        $("#ui_tbodyReportData").append(reportTablerows);
    },
    ShowDeletePopUp: function (Id) {
        $("#ui_tr_WATemplate_" + Id).addClass('activeBgRow');
        deleteId = Id;
    },
    DeleteTemplate: function () {
        ShowPageLoading();
        $.ajax({
            url: "/WhatsApp/WhatsAppTemplates/Delete",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'Id': deleteId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    deleteId = 0;
                    ShowSuccessMessage(GlobalErrorList.WhatsAppTemplate.DeleteTemplate);
                    WhatsAppTemplateUtil.LoadPage();
                }
                else {
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    RefreshCreateTemplatePopUp: function () {
        $("#ui_ddlTemplateCampaign").attr('disabled', false);
        $("#ui_btn_next_whats").attr('templateid', 0);
        $("#ui_btn_next_whats").attr('actiontype', 'save');
        $("#ui_ddlTemplateCampaign").select2().val("0").trigger('change');
        $("#ui_txt_WATemplateName").val("");
        $("#ui_txt_WATemplateDESC").val("");
        $("#ui_ConfigurationName").select2().val(DefaultConfigurationNameId).change();
    },
    ValidateCreateTemplatePopUp: function () {
        var TemplateName = $.trim($("#ui_txt_WATemplateName").val());
        var TemplateDesc = $.trim($("#ui_txt_WATemplateDESC").val());
        var CampaignId = $("#ui_ddlTemplateCampaign").val();

        if (CampaignId == undefined || CampaignId == null || CampaignId == "0") {
            ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.SelectCampaign);
            return false;
        }

        if (TemplateName.length == 0) {
            ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.EnterTemplateName);
            return false;
        }

        if (TemplateDesc.length == 0) {
            ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.EnterTemplateDescription);
            return false;
        }

        return true;
    },
    EditTemplate: function (TemplateId, CampaignId, TemplateName, TemplateDesc) {
        WhatsAppTemplateUtil.RefreshCreateTemplatePopUp();
        TempId = TemplateId;
        $("#ui_ddlTemplateCampaign").select2().val(CampaignId).trigger('change');
        $("#ui_ddlTemplateCampaign").attr('disabled', true);

        $("#ui_txt_WATemplateName").val(TemplateName);
        $("#ui_txt_WATemplateDESC").val(TemplateDesc);

        $("#ui_btn_next_whats").attr('actiontype', 'edit');
        $("#ui_btn_next_whats").attr('templateid', TemplateId);

        $('#whatsappEditInfo .popuptitle h6').html('EDIT TEMPLATE');

        $("#whatsappEditInfo").removeClass("hideDiv");
    },
    DuplicateTemplate: function (TemplateId, CampaignId, TemplateName, TemplateDesc) {
        $("#ui_ddlTemplateCampaign").select2().val(CampaignId).trigger('change');
        $("#ui_ddlTemplateCampaign").attr('disabled', true);

        $("#ui_txt_WATemplateName").val(TemplateName + "_Copy");
        $("#ui_txt_WATemplateDESC").val(TemplateDesc);

        $("#ui_btn_next_whats").attr('actiontype', 'duplicate');
        $("#ui_btn_next_whats").attr('templateid', TemplateId);

        $('#whatsappEditInfo .popuptitle h6').html('DUPLICATE TEMPLATE');

        $("#whatsappEditInfo").removeClass("hideDiv");
        CopyTempId = TemplateId;
    },
    TestTemplate: function (TemplateId, CampaignId, TemplateName) {
        WhatsAppTemplateUtil.ClearTestTemplatePopUp();
        WhatsAppTemplateUtil.CreateUniqueIdentifier();
        $("#ui_txt_WhatsAppTemplateName").html(TemplateName);
        $("#whatsapptestcamp").removeClass("hideDiv");
        whatsappTemplateId = TemplateId;
        whatsappCampaignId = CampaignId;
    },
    ClearTestTemplatePopUp: function () {
        $("#ui_txt_WhatsAppCampaignIdentifier, #ui_txt_WhatsAppIndividualPhoneNumber").val("");
        $("#testcampgroupname").select2().val(0).trigger('change');
        $("#groupdropdownbox").addClass("hideDiv");
        $("#indivtxtbox").removeClass("hideDiv");
        whatsappTemplateId = 0, whatsappCampaignId = 0;
    },
    CreateUniqueIdentifier: function () {
        var today = new Date();
        var strYear = today.getFullYear().toString() + today.getMonth().toString() + 1 + today.getDate().toString() + today.getMilliseconds().toString();
        $("#ui_txt_WhatsAppCampaignIdentifier").val("WhatsApp Campaign Identifier -" + strYear);
    },
    ValidateTestWhatsAppTemplateCampaignCreation: function () {
        //if (TemplateCounselorTags) {
        //    ShowErrorMessage(GlobalErrorList.SmsSchedule.CounselorTags);
        //    return false;
        //}

        if (CleanText($.trim($("#ui_txt_WhatsAppCampaignIdentifier").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateWhatsAppTestCampaign.CampaignIdentifierError);
            return false;
        }
        if ($('input[type="radio"][name="testcampaignType"]:checked').val().toLowerCase() == "indivcampaign" && CleanText($.trim($("#ui_txt_WhatsAppIndividualPhoneNumber").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateWhatsAppTestCampaign.TestPhoneNumberError);
            return false;
        }
        if ($('input[type="radio"][name="testcampaignType"]:checked').val().toLowerCase() == "groupcampaign" && $("#testcampgroupname").val() == 0) {
            ShowErrorMessage(GlobalErrorList.CreateWhatsAppTestCampaign.TestGroupError);
            return false;
        }
        if (parseInt($("#ui_ConfigurationName").val()) == 0) {
            ShowErrorMessage(GlobalErrorList.WhatsAppSchedule.ConfigurationName);
            HidePageLoading();
            return false;
        }
        return true;
    },
    SendIndividualTestWhatsApp: function () {
        $.ajax({
            url: "/WhatsApp/WhatsAppTemplates/SendIndividualTestWhatsAapp",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'WhatsAppTemplateId': whatsappTemplateId, 'PhoneNumber': $.trim($("#ui_txt_WhatsAppIndividualPhoneNumber").val()), 'WhatsAppConfigurationNameId': $("#ui_ConfigurationName option:selected").val() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.SentStatus)
                    ShowSuccessMessage(GlobalErrorList.CreateWhatsAppTestCampaign.TestMessageSuccess);
                else
                    ShowErrorMessage(response.Message);
                $("#close-popup").click();
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    SendGroupTestWhatsApp: function () {
        var WhatsAPPSendingSetting = {
            GroupId: $("#testcampgroupname").val(),
            Name: $.trim($("#ui_txt_WhatsAppCampaignIdentifier").val()),
            WhatsAppTemplateId: whatsappTemplateId,
            CampaignId: whatsappCampaignId,
            WhatsAppConfigurationNameId: $("#ui_ConfigurationName").val()
        };

        $.ajax({
            url: "/WhatsApp/WhatsAppTemplates/SendGroupTestWhatsAapp",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'whatsappSendingSetting': WhatsAPPSendingSetting }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    if (response.SentCount > 0 || response.FailureCount > 0 || response.UnsubscribedCount > 0)
                        ShowSuccessMessage(response.Message);
                    else
                        ShowErrorMessage(response.Message);
                }
                else
                    ShowErrorMessage(GlobalErrorList.CreateWhatsAppTestCampaign.GroupTestMessageError);
                $("#close-popup").click();
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    CheckTemplateContainsCounselorTags(SmsTemplateId) {
        ShowPageLoading();
        TemplateCounselorTags = false;
        var SmsTemplate = { Id: SmsTemplateId };
        $.ajax({
            url: "/SMS/Template/CheckCounselorTags",
            type: 'POST',
            data: JSON.stringify({ 'smsTemplate': SmsTemplate }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (response) {
                    TemplateCounselorTags = true;
                    ShowErrorMessage(GlobalErrorList.SmsSchedule.CounselorTags);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    PreviewTemplate: function (TempName, TemplateContent, ButtonOneText, ButtonOneType, ButtonTwoText, ButtonTwoType, MediaFileURL, templtypeItem) {
        WhatsAppTemplateUtil.RefreshPreviewPopUp();
        $(".popupsubtitle").text(TempName);
        $("#addwhatsapptext, #addwhatsapptextios").text(TemplateContent.replace(/~n~/g, "\n"));

        if (ButtonOneText != null && ButtonOneText != '' && ButtonOneText != "null") {
            $("#spn_whatsvisitwebsite, #spn_whatsvisitwebsiteios").text(ButtonOneText);
            $("#ui_div_AndrButtn, #ui_div_IosButtn, #whatsvisitwebsite, #whatsvisitwebsiteios").removeClass("hideDiv");
            if (ButtonOneType != null && ButtonOneType != '' && ButtonOneType != "null") {
                if (ButtonOneType == "Website") {
                    $("#imgBtn1, #imgBtn1ios").addClass("fa fa-external-link");
                    if ($("#imgBtn1, #imgBtn1ios").hasClass("fa-phone"))
                        $("#imgBtn1, #imgBtn1ios").removeClass("fa-phone");
                } else if (ButtonOneType == "Call") {
                    $("#imgBtn1, #imgBtn1ios").addClass("fa fa-phone");
                    if ($("#imgBtn1, #imgBtn1ios").hasClass("fa-external-link"))
                        $("#imgBtn1, #imgBtn1ios").removeClass("fa-external-link");
                }
            }
        }

        if (ButtonTwoText != null && ButtonTwoText != '' && ButtonTwoText != "null") {
            $("#spn_whatscallphone, #spn_whatscallphoneios").text(ButtonTwoText);
            $("#whatscallphone, #whatscallphoneios").removeClass("hideDiv");
            if (ButtonTwoType != null && ButtonTwoType != '' && ButtonTwoType != "null") {
                if (ButtonTwoType == "Website") {
                    $("#imgBtn2, #imgBtn2ios").addClass("fa fa-external-link");
                    if ($("#imgBtn2, #imgBtn2ios").hasClass("fa-phone"))
                        $("#imgBtn2, #imgBtn2ios").removeClass("fa-phone");
                } else if (ButtonTwoType == "Call") {
                    $("#imgBtn2, #imgBtn2ios").addClass("fa fa-phone");
                    if ($("#imgBtn2, #imgBtn2ios").hasClass("fa-external-link"))
                        $("#imgBtn2, #imgBtn2ios").removeClass("fa-external-link");
                }
            }
        }

        if (MediaFileURL != null && MediaFileURL != '' && MediaFileURL != "null") {
            //$("#addwhatsappimage, #addwhatsappimageIos").attr("src", MediaFileURL);

            if (templtypeItem == "text") {
                $("#whatsappuploadtype, #mediaurlmain, #mediauploadfiles, .whatsappimgwrp").addClass("hideDiv");

            } else if (templtypeItem == "image") {
                $("#whatsappuploadtype, #mediaurlmain, .whatsappimgwrp").removeClass("hideDiv");
                $("#addwhatsappimage, #addwhatsappimageIos").attr(
                    "src",
                    "/Content/images/white_image.png"
                );
            } else if (templtypeItem == "video") {
                $("#whatsappuploadtype, #mediaurlmain, .whatsappimgwrp").removeClass(
                    "hideDiv"
                );
                $("#addwhatsappimage, #addwhatsappimageIos").attr(
                    "src",
                    "/Content/images/white_video.png"
                );
            } else if (templtypeItem == "document") {
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

            $(".whatsappimgwrp").removeClass("hideDiv");
        }

        $(".popuptitlwrp h6").text("Preview Template");

        $("#whatsappprevpopup").removeClass("hideDiv");
    },
    RefreshPreviewPopUp: function () {
        $("#ui_div_AndrButtn, #ui_div_IosButtn, #whatsvisitwebsite, #whatsvisitwebsiteios, #whatscallphone, #whatscallphoneios, .whatsappimgwrp").addClass("hideDiv");
    }
};

$(document).on("click", "#ui_btntestwhatsapp", function () {
    if (!WhatsAppTemplateUtil.ValidateTestWhatsAppTemplateCampaignCreation())
        return false;

    ShowPageLoading();
    if ($('input[type="radio"][name="testcampaignType"]:checked').val().toLowerCase() == "indivcampaign")
        WhatsAppTemplateUtil.SendIndividualTestWhatsApp();
    else
        WhatsAppTemplateUtil.SendGroupTestWhatsApp();
});

$('#ui_div_SearchIcon').click(function () {
    var templateName = CleanText($('#ui_txt_TemplateSearch').val());
    if (templateName === '') {
        ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.SearchTemplate);
        return false;
    }
    WhatsAppTemplateUtil.LoadPage();
});

document.getElementById("ui_txt_TemplateSearch").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("ui_div_SearchIcon").click();
    }
    else {
        var templateName = CleanText($('#ui_txt_TemplateSearch').val());
        if (templateName === '') {
            WhatsAppTemplateUtil.LoadPage();
        }
    }
});

$('.whatsapptemplate').click(function () {
    WhatsAppTemplateUtil.RefreshCreateTemplatePopUp();
    $("#whatsappEditInfo .popuptitlwrp h6").html('Create Template');
    $('#whatsappEditInfo').removeClass("hideDiv");
});

//Search text
$(".contsearchfocus")
    .on("focus", function () {
        $(this).parent().addClass("w-300");
    })
    .on("blur", function () {
        if ($(".contsearchfocus").val().length < 15)
            $(this).parent().removeClass("w-300");
    });

$(".ion-close, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    //$("tr").removeClass("activeBgRow");
    //$(".errmsgemlvalidwrp .ion-ios-information").popover("hide");
});

$('#ui_btn_next_whats').click(function () {
    if (!WhatsAppTemplateUtil.ValidateCreateTemplatePopUp())
        return false;

    var TemplateName = $.trim($("#ui_txt_WATemplateName").val());
    var TemplateDesc = $.trim($("#ui_txt_WATemplateDESC").val());
    var CampaignId = $("#ui_ddlTemplateCampaign").val();
    var TemplateId = $("#ui_btn_next_whats").attr('templateid');
    var actionType = $("#ui_btn_next_whats").attr('actiontype');

    window.location.href = "/WhatsApp/WhatsAppTemplates/CreateWhatsAppTemplates?TempId=" + TemplateId + "&CampaignId=" + CampaignId + "&TemplateName=" + TemplateName + "&TemplateDesc=" + TemplateDesc + "&actionType=" + actionType + "";
});

$('#ui_ddlTemplateCampaign').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$("#ui_btnDeleteConfirm").click(function () {
    WhatsAppTemplateUtil.DeleteTemplate();
});

$('input[name="testcampaignType"]').click(function () {
    var gettestcampval = $('input[name="testcampaignType"]:checked').val();
    if (gettestcampval == "groupcampaign") {
        $("#indivtxtbox").addClass("hideDiv");
        $("#groupdropdownbox").removeClass("hideDiv");
    }
    else {
        $("#groupdropdownbox").addClass("hideDiv");
        $("#indivtxtbox").removeClass("hideDiv");
    }
    $("#ui_txt_WhatsAppIndividualPhoneNumber").val("");
    $("#testcampgroupname").select2().val(0).trigger('change');
});

$('#testcampgroupname, #ui_ConfigurationName').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$(".devwrphvr").click(function () {
    var checkdevictabconid = $(this).attr("data-devtabcont");
    $(".devwrphvr").removeClass("active");
    $(".devsmsprev").addClass("hideDiv");
    $(".notifprevmain, .brwsnotifdevice").addClass("hideDiv");
    $(this).addClass("active");
    $("#" + checkdevictabconid).removeClass("hideDiv");
});

function CreateTemplateNext() {
    if (TempId > 0 || CopyTempId > 0) {
        CreateTemplate();
    } else {
        CheckWhatsappTemplateExists();
    }
}
function CheckWhatsappTemplateExists() {

    if ($("#ui_ddlTemplateCampaign").val() == "0") {
        ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.SelectCampaign);
        return false;
    }

    if ($.trim($("#ui_txt_WATemplateName").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.EnterTemplateName);
        return false;
    }

    if ($.trim($("#ui_txt_WATemplateDESC").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.WhatsAppTemplate.EnterTemplateDescription);
        return false;
    }
    ShowPageLoading();
    $.ajax({
        url: "/WhatsApp/WhatsAppTemplates/GetTemplate",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'TemplateName': $("#ui_txt_WATemplateName").val() }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: CheckandPop,
        error: ShowAjaxError
    });
}
var ExistingData;
function CheckandPop(response) {
    if (response != undefined && response != null) {
        ExistingData = response;
        HidePageLoading();
        $("#tempexistmod").modal("show");
        TempId = 0;
        CopyTempId = 0;

    } else {
        CreateTemplate();
    }
}
$(document).on('click', '#archiverestore', function () {
    TempId = ExistingData.Id;
    if (ExistingData.WhatsAppCampaignId > 0) {
        $("#ui_ddlTemplateCampaign").val(ExistingData.WhatsAppCampaignId).change();
    } else {
        $("#ui_ddlTemplateCampaign").val("0").change();
    }

    if (ExistingData.Name != undefined && ExistingData.Name != null && ExistingData.Name != "") {
        $("#ui_txt_WATemplateName").val(ExistingData.Name);
    } else {
        $("#ui_txt_WATemplateName").val("");
    }

    if (ExistingData.TemplateDescription != undefined && ExistingData.TemplateDescription != null && ExistingData.TemplateDescription != "") {
        $("#ui_txt_WATemplateDESC").val(ExistingData.TemplateDescription);
    } else {
        $("#ui_txt_WATemplateDESC").val("");
    }


    UpdateTemplateStatus(ExistingData.Id);
});

function UpdateTemplateStatus(TemplateId) {
    ShowPageLoading();
    $.ajax({
        url: "/WhatsApp/WhatsAppTemplates/UpdateTemplateStatus",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'TemplateId': TemplateId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                $("#tempexistmod").modal("hide");
                ShowSuccessMessage(GlobalErrorList.WhatsAppTemplate.TemplateRestoredSuccess);
            } else {
                $("#tempexistmod").modal("hide");
                ShowSuccessMessage(GlobalErrorList.WhatsAppTemplate.TemplateRestoredSuccess)
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}

function CreateTemplate() {

    if (!WhatsAppTemplateUtil.ValidateCreateTemplatePopUp())
        return false;

    var TemplateName = $.trim($("#ui_txt_WATemplateName").val());
    var TemplateDesc = $.trim($("#ui_txt_WATemplateDESC").val());
    var CampaignId = $("#ui_ddlTemplateCampaign").val();
    var TemplateId = TempId;
    var actionType = 'edit';
    if (TemplateId == 0)
        actionType = 'save';
    if (CopyTempId != 0)
        TemplateId = CopyTempId;
    window.location.href = "/WhatsApp/WhatsAppTemplates/CreateWhatsAppTemplates?TempId=" + TemplateId + "&CampaignId=" + CampaignId + "&TemplateName=" + TemplateName + "&TemplateDesc=" + TemplateDesc + "&actionType=" + actionType + "";

}
