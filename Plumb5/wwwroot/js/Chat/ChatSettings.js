var ChatSetting = { UserLimit: 0 };
var ChatExtraLinks = { Id: 0, UserInfoUserId: 0, LinkType: false, LinkUrl: "", LinkUrlDescription: "", ToogleStatus: 0 };
var LinkUrls = new Array();
var checkFilesFor = [".js", ".JS", ".css", ".CSS"];

$(document).ready(function () {
    ChatSettingUtil.GetReport();
    ChatSettingUtil.GetAgentVisitLimit();
    ChatBotSettingUtil.BindGroupList();
});
var ChatSettingUtil = {
    GetReport: function () {
        $("#ui_tbodyReportData").empty();
        $.ajax({
            url: "/Chat/Configuration/GetChatExtraLinksList",
            data: JSON.stringify({ 'AdsId': Plumb5AccountId }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: ChatSettingUtil.BindReport,
            error: ShowAjaxError
        });
    },
    BindReport: function (response) {
        SetNoRecordContent('ui_tableReport', 4, 'ui_tbodyReportData');
        if (response !== undefined && response !== null && response.length > 0) {
            var reportTableTrs;
            $.each(response, function () {
                reportTableTrs += "<tr id='ui_tr_ChatSettings_" + this.Id + "'>" +
                    "<td><div class='groupnamewrap'><div class='nameTxtWrap'><span class='" + (this.LinkType ? 'jsicnwrp' : 'css3wrp') + "'><i class='" + (this.LinkType ? 'icon ion-social-javascript' : 'icon ion-social-css3') + "'></i></span>" + (this.LinkType ? 'Javascript Link' : 'Css Link') + "</div>" +
                    "<div class='tdcreatedraft'><div class='dropdown'><button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='icon ion-android-more-vertical mr-0'></i></button>" +
                    "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='filterbycontacts' x-placement='top-end' style='position: absolute; transform: translate3d(3px, 0px, 0px); top: 0px; left: 0px; will-change: transform;'>" +
                    "<a class='dropdown-item DesignPermission' href='javascript:void(0);' onclick=\"ChatSettingUtil.EditChatSettings(" + this.Id + ",'" + this.LinkUrl + "','" + this.LinkUrlDescription + "','" + this.LinkType + "');\">Edit</a>" +
                    "<a id='ui_a_ChatResourceStatus_" + this.Id + "' class='dropdown-item frmsetchngestatus DesignPermission' href='javascript:void(0);' onclick='ChatSettingUtil.ChangeStatus(" + this.Id + "," + this.ToogleStatus + ");'>Change Status</a>" +
                    "<div class='dropdown-divider'></div><a data-toggle='modal' data-target='#dvDeleteChatSetting' data-grouptype='groupDelete' class='dropdown-item FullControlPermission' href='javascript:void(0);' onclick=\"ChatSettingUtil.DeleteChatSettings(" + this.Id + ",'" + this.LinkUrl + "');\">Delete</a></div></div></div></div></td>" +
                    "<td class='wordbreak'>" + this.LinkUrlDescription + "</td>" +
                    "<td>" + this.LinkUrl + "</td>" +
                    "<td id='ui_ChatResourceStatus_" + this.Id + "' class='" + (this.ToogleStatus ? 'frmstatus text-color-success' : 'frmstatus text-color-error') + "'>" + (this.ToogleStatus ? 'Active' : 'In-Active') + "</td>" +
                    "</tr>";
            });
            $("#ui_tableReport").removeClass('no-data-records');
            $("#ui_tbodyReportData").html(reportTableTrs);
        }
        HidePageLoading();
        CheckAccessPermission("Chat");
    },
    SaveResource: function () {
        ShowPageLoading();
        if (!ChatSettingUtil.ValidateExtraLinks()) {
            HidePageLoading();
            return false;
        }

        ChatExtraLinks = new Object();
        var Id = $("#ui_btn_SaveResources").attr("ChatSettingId");
        if (Id !== null && Id !== undefined && parseInt(Id) > 0) {
            ChatExtraLinks.Id = Id;
        }

        ChatExtraLinks.LinkUrl = CleanText($("#ui_txtLink").val());
        ChatExtraLinks.LinkUrlDescription = CleanText($("#ui_txtLinkdescription").val());
        if ($("#ui_ddlLinkType").val() == 'true')
            ChatExtraLinks.LinkType = true;
        else if ($("#ui_ddlLinkType").val() == 'false')
            ChatExtraLinks.LinkType = false;
        ChatExtraLinks.ToogleStatus = true;

        $.ajax({
            url: "/Chat/Configuration/SaveOrUpdateChatExtraLinksDetails",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'UserId': Plumb5UserId, 'ChatExtraLinks': ChatExtraLinks }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response == true) {
                    if (ChatExtraLinks.Id > 0) {
                        ShowSuccessMessage(GlobalErrorList.ChatSettings.LinkUpdate_Message);
                        $(".popupcontainer").addClass('hideDiv');
                        ChatSettingUtil.GetReport();
                        $("#ui_btn_SaveFormResorces").removeAttr("ChatSettingId");
                    }
                }
                else {
                    if (response.Id > 0) {
                        ShowSuccessMessage(GlobalErrorList.ChatSettings.LinkAdded_Message);
                        $(".popupcontainer").addClass('hideDiv');
                        //ChatSettingUtil.GetReport();
                    }
                    else {
                        ShowErrorMessage(GlobalErrorList.ChatSettings.ResourceUrlExist_Error);
                        HidePageLoading();
                    }

                }
                location.reload();
            }
        });

    },
    ValidateExtraLinks: function () {

        if ($("#frmfilelink").is(":checked") && $.trim($("#ui_txtLink").val()).length === 0) {
            ShowErrorMessage(GlobalErrorList.ChatSettings.LinkUrl_Error);
            return false;
        }

        if ($("#frmfilelink").is(":checked")) {
            if ($.trim($("#ui_txtLink").val()).length > 0) {
                if (!regExpUrl.test($("#ui_txtLink").val())) {
                    ShowErrorMessage(GlobalErrorList.ChatSettings.CorrectLinkUrl_Error);
                    $("#ui_txtLink").focus();
                    return false;
                }

                if ($.trim($("#ui_txtLink").val()).indexOf("/") <= -1) {
                    $("#ui_txtLink").focus();
                    ShowErrorMessage(GlobalErrorList.ChatSettings.UrlFormat_Error);
                    return false;
                }

                var ResourceUrl = $.trim($("#ui_txtLink").val());

                if (ResourceUrl.indexOf("https://") > -1 || ResourceUrl.indexOf("http://") > -1 || ResourceUrl.indexOf("//") > -1) {
                    ResourceUrl = ResourceUrl.replace("https://", "").replace("http://", "").replace("//", "");
                }

                if (ResourceUrl.indexOf("/") <= -1) {
                    $("#ui_txtLink").focus();
                    ShowErrorMessage(GlobalErrorList.ChatSettings.UrlFormat_Error);
                    return false;
                }
                else {
                    var DomainName = ResourceUrl.split('/')[0];

                    if (!CheckValidDomain($.trim(DomainName))) {
                        $("#ui_txtLink").focus();
                        ShowErrorMessage(GlobalErrorList.ChatSettings.ChatSettingUrlDomainError);
                        return false;
                    }

                    var fileExtension = GetExtensionDetails($.trim($("#ui_txtLink").val()));

                    if (fileExtension != null && fileExtension != "") {
                        fileExtension = fileExtension.toLowerCase();
                    }

                    if (checkFilesFor.indexOf(fileExtension) <= -1) {
                        $("#ui_txtLink").focus();
                        ShowErrorMessage(GlobalErrorList.ChatSettings.UrlFormatExtension_Error);
                        return false;
                    }

                    var filename = GetExtensionFileName($.trim($("#ui_txtLink").val()));

                    if (filename != null && filename != "" && filename.indexOf(".js") > -1 && filename.length <= 3) {
                        $("#ui_txtLink").focus();
                        ShowErrorMessage(GlobalErrorList.ChatSettings.UrlFormatEmptyFileName_Error);
                        return false;
                    }
                    else if (filename != null && filename != "" && filename.indexOf(".css") > -1 && filename.length <= 4) {
                        $("#ui_txtLink").focus();
                        ShowErrorMessage(GlobalErrorList.ChatSettings.UrlFormatEmptyFileName_Error);
                        return false;
                    }

                    var specialCharacters = filename.match(/[*\\[\]':"\\|<>\/?]/g);

                    if (specialCharacters != undefined && specialCharacters != null && specialCharacters.length) {
                        $("#ui_txtLink").focus();
                        ShowErrorMessage(GlobalErrorList.ChatSettings.FileNameSpecialChractersError);
                        return false;
                    }
                }
            }
        }

        if ($("#frmsetfilupld").is(":checked") && $("#ui_span_FormUploadFileName").html().length === 0) {
            ShowErrorMessage(GlobalErrorList.ChatSettings.SourceUrlUpload_Error);
            return false;
        }

        if ($.trim($("#ui_txtLinkdescription").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.ChatSettings.LinkDescription_Error);
            return false;
        }

        if ($("#ui_ddlLinkType").get(0).selectedIndex == 0) {
            ShowErrorMessage(GlobalErrorList.ChatSettings.LinkType_Error);
            return false;
        }

        var fileExtension = GetExtensionDetails($.trim($("#ui_txtLink").val()));

        if (fileExtension.indexOf(".js") > -1 && $("#ui_ddlLinkType option:selected").text().toLowerCase() != "javasctipt link") {
            ShowErrorMessage(GlobalErrorList.ChatSettings.InvalidResourceTypeError);
            return false;
        }
        else if (fileExtension.indexOf(".css") > -1 && $("#ui_ddlLinkType option:selected").text().toLowerCase() != "css link") {
            ShowErrorMessage(GlobalErrorList.ChatSettings.InvalidResourceTypeError);
            return false;
        }

        return true;
    },
    EditChatSettings: function (Id, LinkUrl, LinkUrlDescription, LinkType) {
        ChatSettingUtil.ClearAddResourcesPopUpFields();
        $("#ui_txtLink").val(LinkUrl);
        $("#ui_txtLinkdescription").val(LinkUrlDescription);
        $("#ui_ddlLinkType").val(LinkType);
        $("#ui_btn_SaveResources").attr("ChatSettingId", Id);
        $(".popupcontainer").removeClass('hideDiv');
        $("#frmsetfilupld").prop("disabled", true);
    },
    ClearAddResourcesPopUpFields: function () {
        $("#frmfilelink").prop('checked', true);
        $(".frmresuplwrp").addClass('hideDiv');
        $(".frmrestypurlwrp").removeClass('hideDiv');
        $("#ui_txtLink").val('');
        $("#ui_span_FormUploadFileName").html('');
        $('#ui_div_FormUploadFileName').addClass('hideDiv');
        $("#ui_txtLinkdescription").val('');
        $(".appndfrmresfile").html('');
        $('.frmsetresremove').hide();
        $("#ui_ddlLinkType").val('select');
    },
    DeleteChatSettings: function (Id, LinkUrl) {
        $("#deleteRowConfirm").attr("onclick", "ChatSettingUtil.DeleteChatSettingsConfirm(" + Id + ",'" + LinkUrl + "');");
    },
    DeleteChatSettingsConfirm: function (Id, LinkUrl) {
        ShowPageLoading();
        $.ajax({
            url: "/Chat/Configuration/DeleteChatExtraLinks",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'Id': Id, 'LinkUrl': LinkUrl }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.ChatSettings.ChatSettingDelete_Success);
                    ChatSettingUtil.GetReport();
                }
            }
        });
    },
    ChangeStatus: function (Id, Status) {
        ShowPageLoading();
        ChatExtraLinks.Id = Id;
        if (Status)
            ChatExtraLinks.ToogleStatus = false;
        else
            ChatExtraLinks.ToogleStatus = true;

        $.ajax({
            url: "/Chat/Configuration/ToogleChatExtraLinksStatus",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'UserId': Plumb5UserId, 'ChatExtraLinks': ChatExtraLinks }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    if (Status) {
                        $("#ui_ChatResourceStatus_" + Id).text("In-Active").removeClass('text-color-success').addClass('text-color-error');
                        $("#ui_a_ChatResourceStatus_" + Id).attr("onclick", "ChatSettingUtil.ChangeStatus(" + Id + ",false);");
                    }
                    else {
                        $("#ui_ChatResourceStatus_" + Id).text("Active").removeClass('text-color-error').addClass('text-color-success');
                        $("#ui_a_ChatResourceStatus_" + Id).attr("onclick", "ChatSettingUtil.ChangeStatus(" + Id + ",true);");
                    }
                    ShowSuccessMessage(GlobalErrorList.ChatSettings.ChatSettingsStatusChange_Success);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    UploadFiles: function (f) {
        let frmsetresfilval = f.target.files[0].name;
        var name = frmsetresfilval.split('.');
        if (name[name.length - 1].toLowerCase() !== 'js' && name[name.length - 1].toLowerCase() !== 'css' && name[name.length - 1].toLowerCase() !== 'html' && name[name.length - 1].toLowerCase() !== 'cshtml') {
            ShowErrorMessage(GlobalErrorList.ChatSettings.UploadFileFormat_Error);
            return false;
        }
        ShowPageLoading();
        var files = $("#frmsettupldresfile").get(0).files;
        if (files.length > 0) {
            var data = new FormData();
            data.append("UploadedFormFile", files[0]);
            $.ajax({
                type: "POST",
                url: "/Chat/Configuration/UploadFile",
                contentType: false,
                processData: false,
                data: data,
                success: function (response) {
                    if (response !== null && response.filePath !== undefined && response.filePath.length > 0) {
                        ShowSuccessMessage(GlobalErrorList.ChatSettings.UploadFileFormat_Success);
                        $("#ui_txtLink").val(response.filePath);
                        $(".frmsetbrwfile").removeClass('hideDiv');
                        $(".appndfrmresfile").html(frmsetresfilval);
                    }
                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        }
    },
    GetAgentVisitLimit: function () {
        $("#dvLoading").show();
        $.ajax({
            url: "/Chat/Configuration/GetChatSetting",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: ChatSettingUtil.BindAgentVisitLimit,
            error: ShowAjaxError
        });
    },
    BindAgentVisitLimit: function (response) {
        if (response.UserLimit > 0) {
            $("#ui_ddlVisitorLimit").val(response.UserLimit);
        }
        $("#ui_ddlVisitorLimit").show();
        HidePageLoading();
    },
    SaveOrUpdateAgentVisitorLimit: function () {
        ShowPageLoading();
        if ($("#ui_ddlVisitorLimit").val() > 0) {
            ChatSetting.UserLimit = $("#ui_ddlVisitorLimit").val();
            $.ajax({
                url: "/Chat/Configuration/SaveOrUpdateChatSetting",
                type: 'POST',
                data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'UserId': Plumb5UserId, 'ChatSetting': ChatSetting }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    ShowSuccessMessage(GlobalErrorList.ChatSettings.AgentVisitLimit_Success);

                },
                error: ShowAjaxError
            });
        }
        else {
            ShowErrorMessage(GlobalErrorList.ChatSettings.AgentLimits_Error);
        }
        HidePageLoading();
    }
};
$("#ui_btn_SaveResources").click(function () {
    ChatSettingUtil.SaveResource();
});
$("#btn_SaveAgentLimit").click(function () {
    ChatSettingUtil.SaveOrUpdateAgentVisitorLimit();
});

$(".addfrmresourc").click(function () {
    ChatSettingUtil.ClearAddResourcesPopUpFields();
    $(".popupcontainer").removeClass('hideDiv');
    $("#frmsetfilupld").prop("disabled", false);
    $("#ui_btn_SaveResources").removeAttr("ChatSettingId");
});


$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass('hideDiv');
});

$('input[name="linkrestype"]').click(function () {
    let linkrestypval = $(this).val();
    if (linkrestypval === "resourceurl") {
        $(".frmresuplwrp").addClass('hideDiv');
        $(".frmrestypurlwrp").removeClass('hideDiv');
    }
    else {
        $(".frmrestypurlwrp").addClass('hideDiv');
        $(".frmresuplwrp").removeClass('hideDiv');
    }
});
$("#frmsettupldresfile").change(function (f) {
    ChatSettingUtil.UploadFiles(f);

});

$(".frmsetresremove").click(function () {
    $(".appndfrmresfile").html("");
    $(".frmsetbrwfile").addClass('hideDiv');
});

function GetExtensionDetails(url) {
    return (url = url.substr(1 + url.lastIndexOf("/")).split('?')[0]).substr(url.lastIndexOf("."))
}

function GetExtensionFileName(url) {
    return (url = url.substr(1 + url.lastIndexOf("/")).split('?')[0])
}

function CheckValidDomain(str) {
    regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)) {
        return true;
    }
    else {
        return false;
    }
}

//ChatBot Setting

var ChatBotSettingUtil = {
    BindGroupList: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Chat/Configuration/GetGroupList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("#ui_ddlChatBotAssignGroup").html("<option value='0'>Select Group</option>");
                if (response != undefined && response != null && response.length > 0) {
                    $.each(response, function () {
                        $("#ui_ddlChatBotAssignGroup").append("<option value=" + $(this)[0].Id + ">" + $(this)[0].Name + "</option>");
                    });
                }
                ChatBotSettingUtil.BindUsersList();
            },
            error: ShowAjaxError
        });
    },
    BindUsersList: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Chat/Configuration/GetUserList",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'UserId': Plumb5UserId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("#ui_ddlChatBotAssignSales").html("<option value='0'>Select User</option>");
                if (response != undefined && response != null && response.length > 0) {
                    $.each(response, function () {
                        if ($(this)[0].ActiveStatus) {
                            $("#ui_ddlChatBotAssignSales").append("<option value='" + $(this)[0].UserInfoUserId + "'>" + $(this)[0].FirstName + "</option>")
                        }
                    });
                }
                ChatBotSettingUtil.BindLmsGroupList();
            },
            error: ShowAjaxError
        });
    },
    BindLmsGroupList: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Chat/Configuration/GetLmsGroupsList",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("#ui_ddlChatBotAssignLmsGroup").html("<option value='0'>Select Source</option>");
                if (response != undefined && response != null && response.length > 0) {
                    $.each(response, function () {
                        $("#ui_ddlChatBotAssignLmsGroup").append("<option value=" + $(this)[0].LmsGroupId + ">" + $(this)[0].Name + "</option>");
                    });
                }
                ChatBotSettingUtil.InitializeSelect2();
            },
            error: ShowAjaxError
        });
    },
    InitializeSelect2: function () {
        ShowPageLoading();
        $('#ui_ddlChatBotAssignLmsGroup,#ui_ddlChatBotAssignGroup,#ui_ddlChatBotAssignSales').select2({
            minimumResultsForSearch: '',
            dropdownAutoWidth: false
        });
        ChatBotSettingUtil.GetChatBotSetting();
    },
    ValidateSatting: function () {
        if ($("#ui_chkChatBotReportMail").is(":checked") && $.trim($("#ui_txtChatBotReportMail").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.ChatBotSetting.ReportMail_Error);
            $("#ui_txtChatBotReportMail").focus();
            return false;
        }

        if ($("#ui_chkChatBotReportMail").is(":checked") && !CheckValidEmail("ui_txtChatBotReportMail")) {
            ShowErrorMessage(GlobalErrorList.ChatBotSetting.ValidReportMail_Error);
            return false;
        }

        if ($("#ui_chkChatBotAssignSales").is(":checked") && $("#ui_ddlChatBotAssignSales").get(0).selectedIndex === 0) {
            ShowErrorMessage(GlobalErrorList.ChatBotSetting.SalesPerson_Error);
            return false;
        }

        if ($("#ui_chkChatBotAssignGroup").is(":checked") && $("#ui_ddlChatBotAssignGroup").get(0).selectedIndex === 0) {
            ShowErrorMessage(GlobalErrorList.ChatBotSetting.ValidateGroup_Error);
            return false;
        }

        if ($("#ui_chkChatBotAssignLmsGroup").is(":checked") && $("#ui_ddlChatBotAssignLmsGroup").get(0).selectedIndex === 0) {
            ShowErrorMessage(GlobalErrorList.ChatBotSetting.ValidateLmsGroup_Error);
            return false;
        }

        return true;
    },
    SaveSetting: function () {
        if (!ChatBotSettingUtil.ValidateSatting()) {
            HidePageLoading();
            return;
        }

        var ChatBotResponseSetting = { Id: 0, UserInfoUserId: Plumb5UserId, ChatBotId: 1, ReportToMailIds: "", AssignToUserId: 0, AssignToGroupId: 0, AssignToLmsGroupId: 0, IsAssignIndividualOrBasedOnRule: 0};

        if ($("#ui_chkChatBotReportMail").is(":checked") && $.trim($("#ui_txtChatBotReportMail").val()).length > 0) {
            ChatBotResponseSetting.ReportToMailIds = $("#ui_txtChatBotReportMail").val();
        }
        else {
            ChatBotResponseSetting.ReportToMailIds = "";
        }

        if ($("#ui_chkChatBotAssignSales").is(":checked") && $("#ui_ddlChatBotAssignSales").get(0).selectedIndex > 0) {
            ChatBotResponseSetting.AssignToUserId = $("#ui_ddlChatBotAssignSales").val();
            ChatBotResponseSetting.IsAssignIndividualOrBasedOnRule = 1;
        }
        else if ($("#ui_chkChatBotAssignSalesBasedOnRule").is(":checked")) {
            ChatBotResponseSetting.AssignToUserId = 0;
            ChatBotResponseSetting.IsAssignIndividualOrBasedOnRule = 2;
        }

        if ($("#ui_chkChatBotAssignGroup").is(":checked") && $("#ui_ddlChatBotAssignGroup").get(0).selectedIndex > 0) {
            ChatBotResponseSetting.AssignToGroupId = $("#ui_ddlChatBotAssignGroup").val();
        }
        else {
            ChatBotResponseSetting.AssignToGroupId = 0;
        }

        if ($("#ui_chkChatBotAssignLmsGroup").is(":checked") && $("#ui_ddlChatBotAssignLmsGroup").get(0).selectedIndex > 0) {
            ChatBotResponseSetting.AssignToLmsGroupId = $("#ui_ddlChatBotAssignLmsGroup").val();
            if ($("#lmsStaySource").is(":checked")) {
                ChatBotResponseSetting.SourceType = 0;
            }
            else if ($("#lmsOverrideSource").is(":checked")) {
                ChatBotResponseSetting.SourceType = 1;
            }
            else if ($("#lmsNewSource").is(":checked")) {
                ChatBotResponseSetting.SourceType = 2;
            }
        }
        else {
            ChatBotResponseSetting.AssignToLmsGroupId = 0;
            ChatBotResponseSetting.SourceType = 0;
        }

        if ($('#ui_btnChatBotSettingSave').attr("ChatBotSettingId") != "0") {
            ChatBotResponseSetting.Id = $('#ui_btnChatBotSettingSave').attr("ChatBotSettingId");
        }

        $.ajax({
            url: "/Chat/Configuration/SaveUpdateChatBotSetting",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'responseSetting': ChatBotResponseSetting }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {
                    if (ChatBotResponseSetting.Id <= 0) {
                        if (response.Status) {
                            $('#ui_btnChatBotSettingSave').attr("ChatBotSettingId", response.responseSetting.Id);
                            ShowSuccessMessage(GlobalErrorList.ChatBotSetting.SaveSuccess);
                        } else if (!response.Status) {
                            ShowErrorMessage(GlobalErrorList.ChatBotSetting.Save_Error);
                        }
                    } else {
                        if (response.Status) {
                            ShowSuccessMessage(GlobalErrorList.ChatBotSetting.UpdateSuccess);
                        } else if (!response.Status) {
                            ShowErrorMessage(GlobalErrorList.ChatBotSetting.Update_Error);
                        }
                    }
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    GetChatBotSetting: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Chat/Configuration/GetChatBotSetting",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: ChatBotSettingUtil.BindGetChatBotSetting,
            error: ShowAjaxError
        });
    },
    BindGetChatBotSetting: function (response) {
        ShowPageLoading();
        if (response != undefined && response != null && response.Id > 0) {

            $('#ui_btnChatBotSettingSave').attr("ChatBotSettingId", response.Id);

            if (response.ReportToMailIds != null && response.ReportToMailIds.length > 0) {
                $("#ui_txtChatBotReportMail").val(response.ReportToMailIds);
                $("#ui_chkChatBotReportMail").prop("checked", true);
                $("#ui_divChatBotReportMailBody").removeClass("hideDiv");
            }

            if (response.AssignToUserId != null && response.AssignToUserId > 0) {
                $("#ui_ddlChatBotAssignSales").select2().val(response.AssignToUserId).change();
                $("#ui_chkChatBotAssignSales").prop("checked", true);
                $("#ui_chkChatBotAssignSalesBasedOnRule").prop("checked", false);
                $("#ui_divChatBotAssignSalesBody").removeClass("hideDiv");
            }
            else if (response.IsAssignIndividualOrBasedOnRule != null && response.IsAssignIndividualOrBasedOnRule == 2) {
                $("#ui_ddlChatBotAssignSales").val('0');
                $("#ui_divChatBotAssignSalesBody").addClass("hideDiv");
                $("#ui_chkChatBotAssignSales").prop("checked", false);
                $("#ui_chkChatBotAssignSalesBasedOnRule").prop("checked", true);
            }

            if (response.AssignToGroupId != null && response.AssignToGroupId > 0) {
                $("#ui_ddlChatBotAssignGroup").select2().val(response.AssignToGroupId).change();
                $("#ui_chkChatBotAssignGroup").prop("checked", true);
                $("#ui_divChatBotAssignGroupBody").removeClass("hideDiv");
            }

            if (response.AssignToLmsGroupId != null && response.AssignToLmsGroupId > 0) {
                $("#ui_ddlChatBotAssignLmsGroup").select2().val(response.AssignToLmsGroupId).change();
                $("#ui_chkChatBotAssignLmsGroup").prop("checked", true);
                $("#ui_divChatBotAssignLmsGroupBody").removeClass("hideDiv");

                if (response.SourceType == 0)
                    $('#lmsStaySource').attr('checked', true);
                else if (response.SourceType == 1)
                    $('#lmsOverrideSource').attr('checked', true);
                else if (response.SourceType == 2)
                    $('#lmsNewSource').attr('checked', true);
            }
        }
        HidePageLoading();
    }
};

$("#ui_chkChatBotReportMail").click(function () {
    $("#ui_txtChatBotReportMail").val('');
    $("#ui_divChatBotReportMailBody").toggleClass("hideDiv");
});

$("#ui_chkChatBotAssignSales").click(function () {
    $("#ui_ddlChatBotAssignSales").val('0');
    $("#ui_divChatBotAssignSalesBody").toggleClass("hideDiv");
    $("#ui_chkChatBotAssignSalesBasedOnRule").prop("checked", false);
});

$("#ui_chkChatBotAssignSalesBasedOnRule").click(function () {
    $("#ui_chkChatBotAssignSales").prop("checked", false);
    $("#ui_ddlChatBotAssignSales").val('0');
    $("#ui_divChatBotAssignSalesBody").addClass("hideDiv");

    //if (!$(this).is(":checked")) {
    //    $("#ui_chkChatBotAssignSalesBasedOnRule").prop("checked", false);
    //}
});


$("#ui_chkChatBotAssignGroup").click(function () {
    $("#ui_ddlChatBotAssignGroup").val('0');
    $("#ui_divChatBotAssignGroupBody").toggleClass("hideDiv");
});

$("#ui_chkChatBotAssignLmsGroup").click(function () {
    $("#ui_ddlChatBotAssignLmsGroup").val('0');
    $("#ui_divChatBotAssignLmsGroupBody").toggleClass("hideDiv");
});

$("#ui_btnChatBotSettingSave").click(function () {
    ShowPageLoading();
    ChatBotSettingUtil.SaveSetting();
});