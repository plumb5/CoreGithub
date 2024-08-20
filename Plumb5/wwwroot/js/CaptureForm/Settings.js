var FormExtraLinks = { Id: 0, UserInfoUserId: 0, LinkType: true, LinkUrl: "", ToogleStatus: false, LinkUrlDescription: "", FormId: "" };
var checkFilesFor = [".js", ".JS", ".css", ".CSS"];
var formSettings = [], forms = [];

$(document).ready(function () {
    GetAllForms();
    //GetReport();
});

//**************Get & Bind Report******************//
function GetAllForms() {
    $.ajax({
        url: "/Prospect/Reports/GetAllForms",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            forms = response;
            if (response != null && response.length > 0) {
                BindAllForms();
            }
            GetReport();
        },
        error: ShowAjaxError
    });
}

function BindAllForms() {
    $("#ui_drpdwn_Forms").html('');
    $("#ui_drpdwn_Forms").append(`<option value="0" selected>All Forms [Active + InActive]</option>`);
    if (forms != null && forms.length > 0) {
        $.each(forms, function () {
            var formStatus = this.FormStatus == true ? 'Active' : 'Inactive';
            $("#ui_drpdwn_Forms").append("<option value='" + this.Id + "'>" + this.FormIdentifier + " [ " + formStatus + " ]</option>");
        });
    }
}

function GetReport() {
    $("#ui_tbodyReportData").empty();
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/CaptureForm/Settings/GetList",
        type: 'Post',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    SetNoRecordContent('ui_tableReport', 4, 'ui_tbodyReportData');
    if (response !== undefined && response !== null && response.length > 0) {
        formSettings = response;
        var reportTableTrs;
        $.each(response, function () {
            let Link = this.LinkUrl != null && this.LinkUrl != "" ? this.LinkUrl : "NA";
            reportTableTrs += "<tr id='ui_tr_FormSettings_" + this.Id + "'>" +
                "<td><div class='groupnamewrap'><div class='nameTxtWrap'><span class='" + (this.LinkType ? 'jsicnwrp' : 'css3wrp') + "'><i class='" + (this.LinkType ? 'icon ion-social-javascript' : 'icon ion-social-css3') + "'></i></span>" + (this.LinkType ? 'Javascript Link' : 'Css Link') + "</div>" +
                "<div class='tdcreatedraft'><div class='dropdown'><button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='icon ion-android-more-vertical mr-0'></i></button>" +
                "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='filterbycontacts' x-placement='top-end' style='position: absolute; transform: translate3d(3px, 0px, 0px); top: 0px; left: 0px; will-change: transform;'>" +
                "<a class='dropdown-item DesignPermission' href='javascript:void(0);' onclick=\"EditFormSettings(" + this.Id + ");\">Edit</a>" +
                "<a id='ui_a_FormResourceStatus_" + this.Id + "' class='dropdown-item frmsetchngestatus DesignPermission' href='javascript:void(0);' onclick='ChangeStatus(" + this.Id + "," + this.ToogleStatus + ");'>Change Status</a>" +
                "<div class='dropdown-divider'></div><a data-toggle='modal' data-target='#deletegroups' data-grouptype='groupDelete' class='dropdown-item FullControlPermission' href='javascript:void(0);' onclick=\"DeleteFormSettings(" + this.Id + ",'" + this.LinkUrl + "');\">Delete</a></div></div></div></div></td>" +
                "<td class='wordbreak'>" + this.LinkUrlDescription + "</td>" +
                "<td>" + Link + "</td>" +
                "<td id='ui_td_FormResourceStatus_" + this.Id + "' class='" + (this.ToogleStatus ? 'frmstatus text-color-success' : 'frmstatus text-color-error') + "'>" + (this.ToogleStatus ? 'Active' : 'In-Active') + "</td>" +
                "</tr>";
        });
        $("#ui_tableReport").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
    }
    HidePageLoading();
    CheckAccessPermission("CaptureForm");
}
//**************Get & Bind Report******************//

//**************Add Resources Pop Up******************//
$(".addfrmresourc").click(function () {
    ClearAddResourcesPopUpFields();
    $(".popupcontainer").removeClass('hideDiv');
    $("#frmsetfilupld").prop("disabled", false);
    $("#ui_btn_SaveFormResorces").removeAttr("FormSettingId");
});

$('input[name="linkrestype"]').click(function () {
    let linkrestypval = $(this).val();
    if (linkrestypval === "resourceurl") {
        $(".frmresuplwrp,.AddCssCodediv").addClass('hideDiv');
        $(".frmrestypurlwrp").removeClass('hideDiv');
    } else if (linkrestypval === "resourcecsscode") {
        $(".frmresuplwrp,.frmrestypurlwrp").addClass('hideDiv');
        $(".AddCssCodediv").removeClass('hideDiv');
    }
    else {
        $(".frmrestypurlwrp,.AddCssCodediv").addClass('hideDiv');
        $(".frmresuplwrp").removeClass('hideDiv');
        $("#ui_div_SelectForms").addClass("hideDiv");
    }
    var value = $("#ui_drpcodeplaced").val();
    if (value == "Child")
        $("#ui_div_SelectForms").removeClass("hideDiv");
});

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass('hideDiv');
});

$("#frmsettupldresfile").change(function (f) {
    let frmsetresfilval = f.target.files[0].name;
    var name = frmsetresfilval.split('.');
    if (name[name.length - 1].toLowerCase() !== 'js' && name[name.length - 1].toLowerCase() !== 'css' && name[name.length - 1].toLowerCase() !== 'html' && name[name.length - 1].toLowerCase() !== 'cshtml') {
        ShowErrorMessage(GlobalErrorList.FormSettings.UploadFileFormat_Error);
        return false;
    }
    ShowPageLoading();
    var files = $("#frmsettupldresfile").get(0).files;
    if (files.length > 0) {
        var data = new FormData();
        data.append("UploadedFormFile", files[0]);
        $.ajax({
            type: "POST",
            url: "/CaptureForm/Settings/UploadFormFile",
            contentType: false,
            processData: false,
            data: data,
            success: function (response) {
                if (response !== null && response.filePath !== undefined && response.filePath.length > 0) {
                    ShowSuccessMessage(GlobalErrorList.FormSettings.UploadFileFormat_Success);
                    $("#ui_txt_FormResourceURL").val(response.filePath);
                    $(".frmsetbrwfile").removeClass('hideDiv');
                    $(".appndfrmresfile").html(frmsetresfilval);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
});

$(".frmsetresremove").click(function () {
    $(".appndfrmresfile").html("");
    $(".frmsetbrwfile").addClass('hideDiv');
});

function ClearAddResourcesPopUpFields() {
    BindAllForms();
    $("#frmfilelink").prop('checked', true);
    $(".frmresuplwrp").addClass('hideDiv');
    $("#ui_div_SelectForms").addClass('hideDiv');
    $(".AddCssCodediv").addClass('hideDiv');
    $(".frmrestypurlwrp").removeClass('hideDiv');
    $("#ui_txt_FormResourceURL").val('');
    $("#ui_span_FormUploadFileName").html('');
    $('#ui_div_FormUploadFileName').addClass('hideDiv');
    $("#ui_txtArea_FormResourceDescription").val('');
    $("#ui_drpcodeplaced").val('0');
    $("#ui_dropdwn_FormResourceType").val('select');

    $("#ui_divViewPageContainer .popupcontainer .popuptitle h6").html("Add Resources");
    $("#ui_btn_SaveFormResorces").html("Save File");
    $('input[name="linkrestype"]').prop("disabled", false);
    $("#ui_txtArea_FormResourceDescription").prop("disabled", false);
    $("#ui_dropdwn_FormResourceType").prop("disabled", false);
    $("#ui_txt_FormResourceURL").prop("disabled", false);
}
//**************Add Resources Pop Up******************//

//**************Add Resources Validation******************//
function ValidateAddResourcesPopUp() {

    if ($("#frmfilelink,#frmsetfilupld,#frmsetcsscode").is(":checked") && $.trim($("#ui_drpcodeplaced :selected").val()) === "0") {
        ShowErrorMessage(GlobalErrorList.FormSettings.SelectCodePlaceText_Error);
        return false;
    }

    if ($("#frmfilelink").is(":checked") && $.trim($("#ui_txt_FormResourceURL").val()).length === 0) {
        ShowErrorMessage(GlobalErrorList.FormSettings.FormSourceUrlText_Error);
        return false;
    }

    if ($("#frmsetcsscode").is(":checked") && $.trim($("#ui_textareaaddcode").val()).length === 0) {
        ShowErrorMessage(GlobalErrorList.FormSettings.AddCssCodeText_Error);
        return false;
    }

    if ($("#frmfilelink").is(":checked")) {
        if ($.trim($("#ui_txt_FormResourceURL").val()).length > 0) {
            if (!regExpUrl.test($.trim($("#ui_txt_FormResourceURL").val()))) {
                $("#ui_txt_FormResourceURL").focus();
                ShowErrorMessage(GlobalErrorList.FormSettings.FormSourceUrl_Error);
                return false;
            }

            if ($.trim($("#ui_txt_FormResourceURL").val()).indexOf("/") <= -1) {
                $("#ui_txt_FormResourceURL").focus();
                ShowErrorMessage(GlobalErrorList.FormSettings.UrlFormat_Error);
                return false;
            }

            var ResourceUrl = $.trim($("#ui_txt_FormResourceURL").val());

            if (ResourceUrl.indexOf("https://") > -1 || ResourceUrl.indexOf("http://") > -1 || ResourceUrl.indexOf("//") > -1) {
                ResourceUrl = ResourceUrl.replace("https://", "").replace("http://", "").replace("//", "");
            }

            if (ResourceUrl.indexOf("/") <= -1) {
                $("#ui_txt_FormResourceURL").focus();
                ShowErrorMessage(GlobalErrorList.FormSettings.UrlFormat_Error);
                return false;
            }
            else {
                var DomainName = ResourceUrl.split('/')[0];

                if (!CheckValidDomain($.trim(DomainName))) {
                    $("#ui_txt_FormResourceURL").focus();
                    ShowErrorMessage(GlobalErrorList.FormSettings.FormSettingUrlDomainError);
                    return false;
                }

                //if (!regExpDomain.test($.trim(DomainName))) {
                //    $("#ui_txt_FormResourceURL").focus();
                //    ShowErrorMessage(GlobalErrorList.FormSettings.FormSettingUrlDomainError);
                //    return false;
                //}

                var fileExtension = GetExtensionDetails($.trim($("#ui_txt_FormResourceURL").val()));

                if (fileExtension != null && fileExtension != "") {
                    fileExtension = fileExtension.toLowerCase();
                }

                if (checkFilesFor.indexOf(fileExtension) <= -1) {
                    $("#ui_txt_FormResourceURL").focus();
                    ShowErrorMessage(GlobalErrorList.FormSettings.UrlFormatExtension_Error);
                    return false;
                }

                var filename = GetExtensionFileName($.trim($("#ui_txt_FormResourceURL").val()));

                if (filename != null && filename != "" && filename.indexOf(".js") > -1 && filename.length <= 3) {
                    $("#ui_txt_FormResourceURL").focus();
                    ShowErrorMessage(GlobalErrorList.FormSettings.UrlFormatEmptyFileName_Error);
                    return false;
                }
                else if (filename != null && filename != "" && filename.indexOf(".css") > -1 && filename.length <= 4) {
                    $("#ui_txt_FormResourceURL").focus();
                    ShowErrorMessage(GlobalErrorList.FormSettings.UrlFormatEmptyFileName_Error);
                    return false;
                }

                var specialCharacters = filename.match(/[*\\[\]':"\\|<>\/?]/g);

                if (specialCharacters != undefined && specialCharacters != null && specialCharacters.length) {
                    $("#ui_txt_FormResourceURL").focus();
                    ShowErrorMessage(GlobalErrorList.FormSettings.FileNameSpecialChractersError);
                    return false;
                }
            }
        }
    }

    if ($("#frmsetfilupld").is(":checked") && $("#ui_span_FormUploadFileName").html().length === 0) {
        ShowErrorMessage(GlobalErrorList.FormSettings.FormSourceUrlUpload_Error);
        return false;
    }

    if ($("#ui_txtArea_FormResourceDescription").val().length === 0) {
        ShowErrorMessage(GlobalErrorList.FormSettings.FormSourceUrlDescription_Error);
        return false;
    }

    if ($("#ui_dropdwn_FormResourceType").val() === 'select') {
        ShowErrorMessage(GlobalErrorList.FormSettings.FormSourceUrlType_Error);
        return false;
    }

    var fileExtension = GetExtensionDetails($.trim($("#ui_txt_FormResourceURL").val()));

    if (fileExtension.indexOf(".js") > -1 && $("#ui_dropdwn_FormResourceType option:selected").text().toLowerCase() != "javasctipt link") {
        ShowErrorMessage(GlobalErrorList.FormSettings.InvalidResourceTypeError);
        return false;
    }
    else if (fileExtension.indexOf(".css") > -1 && $("#ui_dropdwn_FormResourceType option:selected").text().toLowerCase() != "css link") {
        ShowErrorMessage(GlobalErrorList.FormSettings.InvalidResourceTypeError);
        return false;
    }



    return true;
}
//**************Add Resources Validation******************//

//**************Add Or Edit Resources******************//
EditFormSettings = function (Id) {
    ClearAddResourcesPopUpFields();
    let item = JSLINQ(formSettings).Where(function () { return (this.Id == Id); }).items[0];
    $("#ui_txt_FormResourceURL").val(item.LinkUrl);
    $("#ui_txtArea_FormResourceDescription").val(item.LinkUrlDescription);
    $("#ui_dropdwn_FormResourceType").val(item.LinkType.toString()).change();
    $("#ui_btn_SaveFormResorces").attr("FormSettingId", Id);
    $("#ui_drpcodeplaced").val(item.LinkPlacecode).change();
    $("#ui_textareaaddcode").val(item.LinkAddCsscode);
    $(".popupcontainer").removeClass('hideDiv');
    if (item.LinkAddCsscode != null && item.LinkAddCsscode.length > 0) {
        $("#frmsetcsscode").prop("checked", true).click();
    } else {
        $("#frmfilelink").prop("checked", true).click();
    }
    if (item.LinkPlacecode != null && item.LinkPlacecode.length > 0 && item.LinkPlacecode == "Child") {
        $("#ui_div_SelectForms").removeClass("hideDiv");
        if (item.FormId != null && item.FormId.includes(",")) {
            var value = item.FormId.split(",");
            $('#ui_drpdwn_Forms').val(value).trigger('change');
        }
        else {
            if (item.FormId == null)
                $('#ui_drpdwn_Forms').val(0).trigger('change');
            else
                $('#ui_drpdwn_Forms').val(item.FormId).trigger('change');
        }
    }

    $("#ui_divViewPageContainer .popupcontainer .popuptitle h6").html("Edit Resources");
    $("#ui_btn_SaveFormResorces").html("Update File");
    //$('input[name="linkrestype"]').prop("disabled", true);
    //$("#ui_txtArea_FormResourceDescription").prop("disabled", true);
    //$("#ui_dropdwn_FormResourceType").prop("disabled", true);
    //$("#ui_txt_FormResourceURL").prop("disabled", true);
};

$("#ui_btn_SaveFormResorces").click(function () {
    if (!ValidateAddResourcesPopUp()) {
        return false;
    }
    ShowPageLoading();
    FormExtraLinks = new Object();
    var Id = $("#ui_btn_SaveFormResorces").attr("FormSettingId");
    if (Id !== null && Id !== undefined && parseInt(Id) > 0) {
        FormExtraLinks.Id = Id;
    }

    FormExtraLinks.LinkUrl = CleanText($("#ui_txt_FormResourceURL").val());
    FormExtraLinks.LinkUrlDescription = CleanText($("#ui_txtArea_FormResourceDescription").val());
    if ($("#ui_dropdwn_FormResourceType").val() === 'true')
        FormExtraLinks.LinkType = true;
    else if ($("#ui_dropdwn_FormResourceType").val() === 'false')
        FormExtraLinks.LinkType = false;
    FormExtraLinks.ToogleStatus = true;

    FormExtraLinks.LinkPlacecode = $.trim($("#ui_drpcodeplaced :selected").val());

    if ($("#frmsetcsscode").is(":checked")) {
        FormExtraLinks.LinkAddCsscode = $("#ui_textareaaddcode").val();
    } else {
        FormExtraLinks.LinkAddCsscode = "";
    }

    var value = $("#ui_drpcodeplaced").val();
    if (value == "Child") {
        if ($("#ui_drpdwn_Forms").val() == undefined || $("#ui_drpdwn_Forms").val() == null || $("#ui_drpdwn_Forms").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.FormSettings.SelectAnyForm);
            HidePageLoading();
            return;
        }
        FormExtraLinks.FormId = $("#ui_drpdwn_Forms").val().join(",");
    } else {
        FormExtraLinks.FormId = "";
    }

    $.ajax({
        url: "/CaptureForm/Settings/SaveOrUpdateDetails",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'UserId': Plumb5UserId, 'formExtraLinks': FormExtraLinks }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#close-popup, .clsepopup").click();
            if (response.isUpdate) {
                if (response.updateStatus) {
                    ShowSuccessMessage(GlobalErrorList.FormSettings.FormSettingsUpdate_Success);
                    GetReport();
                }
                else {
                    HidePageLoading();
                    ShowErrorMessage(GlobalErrorList.FormSettings.FormSettingsUpdate_Error);
                }
                $("#ui_btn_SaveFormResorces").removeAttr("FormSettingId");
            }
            else {
                if (response.formExtraLinks.Id > 0) {
                    ShowSuccessMessage(GlobalErrorList.FormSettings.FormSettingsAdd_Success);
                    GetReport();
                }
                else {
                    HidePageLoading();
                    ShowErrorMessage(GlobalErrorList.FormSettings.FormSettingsAdd_Error);
                }
            }
        }
    });
});
//**************Add Or Edit Resources******************//

//**************Change Status******************//
ChangeStatus = function (Id, ToggleStatus) {
    ShowPageLoading();
    FormExtraLinks = new Object();
    FormExtraLinks.Id = Id;
    if (ToggleStatus)
        FormExtraLinks.ToogleStatus = false;
    else
        FormExtraLinks.ToogleStatus = true;
    $.ajax({
        url: "/CaptureForm/Settings/ToogleStatus",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'UserId': Plumb5UserId, 'formExtraLinks': FormExtraLinks }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                if (ToggleStatus) {
                    $("#ui_td_FormResourceStatus_" + Id).text("In-Active").removeClass('text-color-success').addClass('text-color-error');
                    $("#ui_a_FormResourceStatus_" + Id).attr("onclick", "ChangeStatus(" + Id + ",false);");
                }
                else {
                    $("#ui_td_FormResourceStatus_" + Id).text("Active").removeClass('text-color-error').addClass('text-color-success');
                    $("#ui_a_FormResourceStatus_" + Id).attr("onclick", "ChangeStatus(" + Id + ",true);");
                }
                ShowSuccessMessage(GlobalErrorList.FormSettings.FormSettingsStatusChange_Success);
            }
            else
                ShowErrorMessage(GlobalErrorList.FormSettings.FormSettingsStatusChange_Error);
            HidePageLoading();
        }
    });
};
//**************Change Status******************//

//**************Delete Form Settings******************//
DeleteFormSettings = function (Id, LinkUrl) {
    $("#deleteRowConfirm").attr("onclick", "DeleteFormSettingsConfirm(" + Id + ",'" + LinkUrl + "');");
};

DeleteFormSettingsConfirm = function (Id, LinkUrl) {
    ShowPageLoading();
    $.ajax({
        url: "/CaptureForm/Settings/Delete",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'Id': Id, 'LinkUrl': LinkUrl }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                $('#ui_tr_FormSettings_' + Id).remove();
                ShowSuccessMessage(GlobalErrorList.FormSettings.FormSettingsDelete_Success);
            }
            else
                ShowErrorMessage(GlobalErrorList.FormSettings.FormSettingsDelete_Error);
            $("#ui_tbodyReportData").empty();
            GetReport();
        }
    });
};
//**************Delete Form Settings******************//


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

$("#ui_drpcodeplaced").change(function () {
    var value = $(this).val();
    if (value == "Child")
        $("#ui_div_SelectForms").removeClass("hideDiv");
    else
        $("#ui_div_SelectForms").addClass("hideDiv");
});

$("#ui_drpdwn_Forms").select2({
    minimumResultsForSearch: "",
    dropdownAutoWidth: false,
    containerCssClass: "border",
});
