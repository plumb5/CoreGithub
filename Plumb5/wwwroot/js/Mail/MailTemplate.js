var deleteId = 0;
var TemplateDetails = { Name: "" };
var CampaignIdentifierList = [];
let DefaultConfigurationNameId = 0;

$(document).ready(function () {
    DragDroReportUtil.Getlmscustomfields();
    DragDroReportUtil.BindUrlEventMappingDetails('');
    GetContactFielddragdrop('');
    DragDroReportUtil.GetReport();
    MailTemplateUtil.GetCampaign();
    GetLoggedInUserInfo();
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    MailTemplateUtil.MaxCount();
}

function CallBackPaging() {
    CurrentRowCount = 0;
    MailTemplateUtil.MaxCount();
}

var MailTemplateUtil = {
    GetCampaign: function () {
        $.ajax({
            url: "/Mail/MailTemplate/GetMailCampaignList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function () {
                    CampaignIdentifierList.push({ Name: $(this)[0].Name, Id: $(this)[0].Id });
                });
                MailTemplateUtil.BindCampaign();
            },
            error: ShowAjaxError
        });
    },
    BindCampaign: function () {
        $("#ui_ddlTemplateCampaign").append(`<option value="0">Select Campaign</option>`);

        for (var i = 0; i < CampaignIdentifierList.length; i++) {
            $("#ui_ddlTemplateCampaign").append(`<option value="${CampaignIdentifierList[i].Id}">${CampaignIdentifierList[i].Name}</option>`);
        }

        MailTemplateUtil.BindFromActiveEmailId();
    },
    BindFromActiveEmailId: function () {
        $.ajax({
            url: "/Mail/MailSchedule/GetActiveEmailIds",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (FromEmailActive) {
                if (FromEmailActive != undefined && FromEmailActive != null) {
                    $.each(FromEmailActive, function (i) {
                        $("#ui_drpdwn_MailFromAddress").append(`<option value="${FromEmailActive[i]}">${FromEmailActive[i]}</option>`);
                    });
                }
                MailTemplateUtil.GetMailConfigurationName();
            },
            error: ShowAjaxError
        });
    },
    GetMailConfigurationName: function () {
        $.ajax({
            url: "/Mail/MailSettings/GetConfigurationNames",
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
                MailTemplateUtil.BindGroups();
            },
            error: ShowAjaxError
        });
    },
    BindGroups: function () {
        $.ajax({
            url: "/Mail/Group/GetGroupList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    $.each(response, function () {
                        $("#ui_drpdwn_ContactGroups").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                    });
                }
                MailTemplateUtil.LoadPage();
            },
            error: ShowAjaxError
        });
    },
    LoadPage: function () {
        ShowPageLoading();
        TotalRowCount = 0;
        CurrentRowCount = 0;
        MailTemplateUtil.MaxCount();
    },
    MaxCount: function () {
        TemplateDetails.Name = $('#ui_txt_TemplateSearch').val();

        $.ajax({
            url: "/Mail/MailTemplate/GetMaxCount",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'mailTemplate': TemplateDetails }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = response.returnVal;
                if (TotalRowCount > 0) {
                    $("#ui_tbodyReportData").html('');
                    MailTemplateUtil.GetReport();
                }
                else {
                    SetNoRecordContent('ui_tableReport', 5, 'ui_tbodyReportData');
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
        $.ajax({
            url: "/Mail/MailTemplate/GetTemplateList",
            type: 'Post',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'mailTemplate': TemplateDetails, 'FetchNext': FetchNext, 'OffSet': OffSet }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: MailTemplateUtil.BindTemplateDetails,
            error: ShowAjaxError
        });
    },
    BindTemplateDetails: function (response) {
        if (response !== undefined && response !== null && response.length > 0) {
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

            ShowExportDiv(true);
            ShowPagingDiv(true);
            $("#ui_tableReport").removeClass('no-data-records');

            $("#ui_tbodyReportData").empty();
            $.each(response, function () {
                MailTemplateUtil.BindEachReport(this);
            });
            SetPreview();
        }
        else {
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
        CheckAccessPermission("Mail");
    },
    BindEachReport: function (eachData) {
        let TemplateName = ReplaceSingleQuote(eachData.Name);
        let TemplateDescription = ReplaceSingleQuote(eachData.TemplateDescription);
        let SubjectLine = ReplaceSingleQuote(eachData.SubjectLine);
        SubjectLine = SubjectLine != null ? SubjectLine.replace(/"/g, "&#34") : SubjectLine;

        let reportTablerows = `<tr id="ui_tr_MailTemplate_${eachData.Id}">
                                    <td class="text-center temppreveye">
                                        <i class="icon ion-ios-eye-outline position-relative">
                                            <div class="previewtabwrp">
                                                <div class="thumbnail-container">
                                                    <a href="https://${TemplatePath}Campaign-${Plumb5AccountId}-${eachData.Id}/TemplateContent.html" target="_blank">
                                                        <div class="thumbnail">
                                                            <iframe class="uitemplatepreview"  src="https://${TemplatePath}Campaign-${Plumb5AccountId}-${eachData.Id}/TemplateContent.html" frameborder="0" onload="this.style.opacity = 1"></iframe>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </i>
                                    </td>
                                    <td class="text-left">
                                        <div class="groupnamewrap">
                                            <div class="nametitWrap">
                                                <span class="groupNameTxt">${eachData.Name}</span>
                                                <span class="createdDateTd">${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(eachData.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(eachData.CreatedDate))}</span>
                                            </div>
                                            <div class="tdcreatedraft">
                                                <div class="dropdown">
                                                    <button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>
                                                    <div id="mailtempaction" class="dropdown-menu dropdown-menu-right" aria-labelledby="filterbycontacts">
                                                        <a class ="dropdown-item DesignPermission" href="javascript:void(0);" onclick="MailTemplateUtil.EditTemplate(${eachData.Id},${eachData.IsBeeTemplate},${eachData.MailCampaignId},'${TemplateName.replace(/"/g, "&#34")}','${TemplateDescription.replace(/"/g, "&#34")}','${SubjectLine}');">Edit</a>
                                                        <a class ="dropdown-item ContributePermission" href="javascript:void(0);" onclick="MailTemplateUtil.DuplicateTemplate(${eachData.Id},${eachData.IsBeeTemplate},${eachData.MailCampaignId},'${TemplateName}','${TemplateDescription}','${SubjectLine}');">Duplicate</a>
                                                        <a class="dropdown-item ContributePermission" href="/Mail/DownloadTemplate?accountId=${Plumb5AccountId}&TemplateId=${eachData.Id}" target="_blank">Download</a>
                                                        <a class="dropdown-item ContributePermission" href="javascript:void(0);" onclick="CheckTemplateSpamScore(${eachData.Id});">Spam score</a>
                                                        <a class ="dropdown-item spamscorepopup ContributePermission" href="javascript:void(0);" onclick="CreateMailTemplateTestCampaign.OpenTestTemplatePopUp(${eachData.Id},${eachData.SpamScore},'${TemplateName}',${eachData.MailCampaignId},'${SubjectLine}');">Test</a>
                                                        <div class="dropdown-divider"></div>
                                                        <a class="dropdown-item FullControlPermission" data-toggle="modal" data-target="#ui_divDeleteDialog" href="javascript:void(0)" onclick="MailTemplateUtil.ShowDeletePopUp(${eachData.Id});">Archive</a>
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
                                    <td id="ui_SpamScoreUpdate_${eachData.Id}">${eachData.SpamScore}</td>
                                    <td>${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(eachData.UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(eachData.UpdatedDate))}</td>
                                </tr>`;
        $("#ui_tbodyReportData").append(reportTablerows);
    },
    ShowDeletePopUp: function (Id) {
        $("#ui_tr_MailTemplate_" + Id).addClass('activeBgRow');
        deleteId = Id;
    },
    DeleteTemplate: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Mail/MailTemplate/Delete",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'Id': deleteId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    deleteId = 0;
                    ShowSuccessMessage(GlobalErrorList.MailTemplate.DeleteTemplate);
                    MailTemplateUtil.LoadPage();
                }
                else {
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    EditTemplate: function (TemplateId, IsBeeTemplate, CampaignId, TemplateName, TemplateDesc, SubjectLine) {
        $("#ui_ddlTemplateCampaign").val(CampaignId).change();
        $("#ui_ddlTemplateCampaign").attr('disabled', true);

        $("#ui_txtTemplateName").val(TemplateName);
        $("#ui_txtareaTemplateDesc").val(TemplateDesc);
        $("#ui_txtSubjectLine").val(ReplaceCustomFields(SubjectLine != "null" ? SubjectLine : ""));

        $("#ui_btnTemplateNext").attr('actiontype', 'edit');
        $("#ui_btnTemplateNext").attr('templateid', TemplateId);
        $("#ui_btnTemplateNext").attr('beetemplate', IsBeeTemplate == true ? 'yes' : 'no');

        $('#ui_divTemplatePopUp .popuptitle h6').html('EDIT TEMPLATE');

        $("#ui_divTemplatePopUp").removeClass("hideDiv");
    },
    DuplicateTemplate: function (TemplateId, IsBeeTemplate, CampaignId, TemplateName, TemplateDesc, SubjectLine) {
        $("#ui_ddlTemplateCampaign").val(CampaignId);
        $("#ui_ddlTemplateCampaign").attr('disabled', true);

        $("#ui_txtTemplateName").val(TemplateName + "_Copy");
        $("#ui_txtareaTemplateDesc").val(TemplateDesc);
        $("#ui_txtSubjectLine").val(ReplaceCustomFields(SubjectLine != "null" ? SubjectLine : ""));

        $("#ui_btnTemplateNext").attr('actiontype', 'duplicate');
        $("#ui_btnTemplateNext").attr('templateid', TemplateId);
        $("#ui_btnTemplateNext").attr('beetemplate', IsBeeTemplate == true ? 'yes' : 'no');

        $('#ui_divTemplatePopUp .popuptitle h6').html('DUPLICATE TEMPLATE');

        $("#ui_divTemplatePopUp").removeClass("hideDiv");
    },
    CloseEditTemplatePopUp: function () {
        $("#ui_divTemplatePopUp").addClass("hideDiv");

        $("#ui_btnTemplateNext").removeAttr('actiontype');
        $("#ui_btnTemplateNext").removeAttr('templateid');
        $("#ui_btnTemplateNext").removeAttr('beetemplate');
        $("#ui_ddlTemplateCampaign").val("0");
        $("#ui_txtTemplateName").val("");
        $("#ui_txtareaTemplateDesc").val("");
    },
    SaveDuplicateAndEditedTemplate: function () {
        ShowPageLoading();

        var actionType = $("#ui_btnTemplateNext").attr('actiontype');
        var TemplateId = $("#ui_btnTemplateNext").attr('templateid');
        var IsBeeTemplate = $("#ui_btnTemplateNext").attr('beetemplate');

        var TemplateName = $.trim($("#ui_txtTemplateName").val());
        var TemplateDesc = $.trim($("#ui_txtareaTemplateDesc").val());
        var CampaignId = $("#ui_ddlTemplateCampaign").val();

        if (CampaignId == undefined || CampaignId == null || CampaignId == "0") {
            ShowErrorMessage(GlobalErrorList.MailTemplate.SelectCampaign);
            HidePageLoading();
            return;
        }

        if (TemplateName.length == 0) {
            ShowErrorMessage(GlobalErrorList.MailTemplate.EnterTemplateName);
            HidePageLoading();
            return;
        }

        if (TemplateDesc.length == 0) {
            ShowErrorMessage(GlobalErrorList.MailTemplate.EnterTemplateDescription);
            HidePageLoading();
            return;
        }

        var mailTemplate = {
            Id: TemplateId,
            MailCampaignId: CampaignId,
            Name: TemplateName,
            TemplateDescription: TemplateDesc,
            SubjectLine: AppendCustomField($("#ui_txtSubjectLine").val()),
            TemplateStatus: true,
            IsBeeTemplate: IsBeeTemplate == 'yes' ? true : false
        };

        if (actionType == "edit") {
            $.ajax({
                url: "/Mail/MailTemplate/SaveEditedTemplate",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'mailTemplate': mailTemplate }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response != undefined && response != undefined && response.Id > 0) {
                        if (IsBeeTemplate == 'yes') {
                            ShowSuccessMessage(GlobalErrorList.MailTemplate.TemplateUpdated);
                            setTimeout(function () { window.location.href = "/Mail/DesignTemplateWithP5Editor/?TemplateId=" + response.Id + "&TemplateName=" + encodeURI(response.Name); }, 3000);
                        } else {
                            ShowSuccessMessage(GlobalErrorList.MailTemplate.TemplateUpdated);
                            setTimeout(function () { window.location.href = "/Mail/DesignUploadTemplateWithEditor/?TemplateId=" + response.Id; }, 3000);
                        }
                    } else {
                        ShowErrorMessage(GlobalErrorList.MailTemplate.TemplateNameExists);
                        HidePageLoading();
                    }
                },
                error: ShowAjaxError
            });
        } else {
            $.ajax({
                url: "/Mail/MailTemplate/DuplicateTemplate",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'SourceTemplateId': TemplateId, 'mailTemplate': mailTemplate }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response != undefined && response != undefined && response.Id > 0) {
                        if (IsBeeTemplate == 'yes') {
                            ShowSuccessMessage(GlobalErrorList.MailTemplate.TemplateUpdated);
                            setTimeout(function () { window.location.href = "/Mail/DesignTemplateWithP5Editor/?TemplateId=" + response.Id + "&TemplateName=" + encodeURI(response.Name); }, 3000);
                        } else {
                            ShowSuccessMessage(GlobalErrorList.MailTemplate.TemplateUpdated);
                            setTimeout(function () { window.location.href = "/Mail/DesignUploadTemplateWithEditor/?TemplateId=" + response.Id; }, 3000);
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
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    MailTemplateUtil.GetReport();
}

$('#ui_div_SearchIcon').click(function () {
    var templateName = CleanText($('#ui_txt_TemplateSearch').val());
    if (templateName === '') {
        ShowErrorMessage(GlobalErrorList.MailTemplate.SearchTemplate);
        return false;
    }
    MailTemplateUtil.LoadPage();
});

document.getElementById("ui_txt_TemplateSearch").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("ui_div_SearchIcon").click();
    }
    else {
        var templateName = CleanText($('#ui_txt_TemplateSearch').val());
        if (templateName === '') {
            MailTemplateUtil.LoadPage();
        }
    }
});

$("#ui_iconCloseTemplatePopup").click(function () {
    MailTemplateUtil.CloseEditTemplatePopUp();
});

$("#ui_btnCloseTemplatePopup").click(function () {
    MailTemplateUtil.CloseEditTemplatePopUp();
});

$("#ui_btnTemplateNext").click(function () {
    MailTemplateUtil.SaveDuplicateAndEditedTemplate();
});

$("#ui_btnDeleteConfirm").click(function () {
    MailTemplateUtil.DeleteTemplate();
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

function SetPreview() {
    let checktablerowlenth = $("table.temppreveye-tbl >tbody >tr").length;
    if (checktablerowlenth <= 4) {
        $("table.temppreveye-tbl >tbody >tr").addClass("prevpopupdefault");
    } else {
        $("table.temppreveye-tbl >tbody >tr").removeClass("prevpopupdefault");
    }
}
$('#draganddropcutomre').on('change', function () {
    if (this.value != "Select") {
        let input = $('#ui_txtSubjectLine')[0]; // get the input element
        let cursorPos = input.selectionStart; // get the current cursor position
        let currentValue = input.value; // get the current input value
        let newValue = currentValue.substring(0, cursorPos) + `[{*${this.value}*}]` + currentValue.substring(cursorPos); // insert the new data at the cursor position
        input.value = newValue; // set the updated value

        //$("#ui_txtSubjectLine").val($("#ui_txtSubjectLine").val() + " [{*" + this.value + "*}]");
    }
});


$('#eventitemsmessage').on('change', function () {
    if (this.value != "Select") {
        let input = $('#ui_txtSubjectLine')[0]; // get the input element
        let cursorPos = input.selectionStart; // get the current cursor position
        let currentValue = input.value; // get the current input value
        let newValue = currentValue.substring(0, cursorPos) + `{{*[${eventname}]~[${this.value}]~[TOP1.DESC]~[fallbackdata]*}}` + currentValue.substring(cursorPos); // insert the new data at the cursor position
        input.value = newValue; // set the updated value

        //$("#ui_txtSubjectLine").val($("#ui_txtSubjectLine").val() + " {{*[" + eventname + "]~[" + this.value + "]~[TOP1.DESC]~[fallbackdata]*}}");
    }
});
