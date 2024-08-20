var FormDetails = { Id: 0, FormType: 0, FormIdentifier: "", Heading: "", FormCampaignId: 0, FormStatus: null, OnPageOrInPage: null, IsWebOrMobileForm: null, AppearOnLoadOnExitOnScroll: 0, IsOtpForm: false, OTPFormId: 0, FormPriority: 0, IsClickToCallForm: false, IsVerifiedEmail: false, IsAutoWhatsApp: false };
var FormStatus;
var IsOtpForm = false, OTPFormId = 0;
var formBasicDetails, formDesign, formFields, formBannerList, formFieldsBindingDetails;

$(document).ready(function () {
    ExportFunctionName = "PopUpFormsExport";
    BindOTPForms();
    CallBackFunction();
});

function CallBackFunction() {
    ShowPageLoading();
    CurrentRowCount = TotalRowCount = 0;
    MaxCount();
}

function CallBackPaging() {
    CurrentRowCount = 0;
    GetReport();
}

function MaxCount() {
    FormDetails.FormIdentifier = $("#ui_txtSearchBy").val();
    FormDetails.FormStatus = null;
    if ($("#ui_ddlFormStatus").val() != "-1") {
        FormDetails.FormStatus = $("#ui_ddlFormStatus").val() === "true" ? true : false;
    }
    FormDetails.FormType = parseInt($("#ui_ddlFormType").val());


    $.ajax({
        url: "/CaptureForm/ManagePopUpForms/GetMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'formDetails': FormDetails }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = response.returnVal;

            if (TotalRowCount > 0) {
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/CaptureForm/ManagePopUpForms/GetAllDetails",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'formDetails': FormDetails, 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
    if (response != undefined && response != null && response.length > 0) {

        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs, formidentifername;

        $.each(response, function () {
            formidentifername = this.FormIdentifier;
            if (formidentifername.length > 50) {
                formidentifername = formidentifername.substring(0, 50) + "..";
            }

            var FormstatusValue = "";

            if (this.FormStatus == true)
                FormstatusValue = "<td id='Status_" + this.Id + "' class='text-color-success'>Active</td>"
            else if (this.FormStatus == false)
                FormstatusValue = "<td id='Status_" + this.Id + "' class='text-color-error'>In-Active</td>"

            let FormType = this.FormType == 1 ? "Lead Generation" : this.FormType == 2 ? "Custom HTML" : this.FormType == 3 ? "Custom IFRAMES" : this.FormType == 4 ? "Custom Banner" : this.FormType == 5 ? "Video" : "NA";
            let FormHeading = this.Heading != undefined && this.Heading != null && this.Heading != "" ? this.Heading : "NA";

            reportTableTrs +=
                "<tr id='ui_div_" + this.Id + "' priorityinfo=" + this.FormPriority + " value=" + this.Id + ">" +
                "<td>" +
                "<div class='groupnamewrap'>" +
                "<div class='frmnametxt'>" +
                "<i class='griddragicn'></i><div class='frmidntwrp'><span class='wordbreak'>" + formidentifername + "</span>" +
                "<p class='frmnamenme m-0'> " + PreviewSupport(FormHeading) + "</p>" +
                "</div></div>" +
                "<div class='tdcreatedraft'>" +
                "<div class='dropdown'>" +
                "<button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='icon ion-android-more-vertical mr-0'></i></button>" +
                "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='filterbycontacts'>" +
                "<a class='dropdown-item DesignPermission' href='javascript:void(0)' onclick='EditDetails(" + this.FormType + "," + this.Id + ");'>Edit</a>" +
                "<a id='dv_duplicatePopUpForm' data-toggle='modal' data-target='#duplicateconfirmation' data-PopUpDuplicateformid=" + this.Id + " data-grouptype='groupDelete' class='dropdown-item ContributePermission' href='javascript:void(0)'>Duplicate</a>" +
                "<a class='dropdown-item embfrmlist ContributePermission' href='javascript:void(0)' onclick='ManageCampaignDetails(" + this.Id + ");'>Settings</a>" +
                "<a class='dropdown-item embfrmpreview' href='javascript:void(0)' onclick='ManagePreviewDetails(" + this.Id + "," + this.FormType + ",\"" + this.FormIdentifier + "\");'>Preview</a>" +
                "<a id='changeStatus_" + this.Id + "' class='dropdown-item ContributePermission' onclick='ChangeStatus(" + this.Id + ", " + this.FormStatus + ");' href='javascript: void (0)'>Changes Status</a>" +
                "<a class='dropdown-item wehookresp' href='javascript:void(0);' onclick='formChatWebhookResponseUtil.GetMaxCount(" + this.Id + ",\"" + this.FormIdentifier + "\");'>Webhook Response</a>" +
                "<div class='dropdown-divider'></div>" +
                "<a id='dv_deletePopUpForm' data-toggle='modal' data-target='#deletegroups' data-PopUpformid=" + this.Id + " data-grouptype='groupDelete' class='dropdown-item FullControlPermission' href='javascript:void(0)'>Delete</a>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</td>" +
                "<td>" + FormType + "</td>" +
                "" + FormstatusValue + "" +
                "<td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.UpdatedDate)) + "</td>" +
                "</tr>";
        });
        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
        $('.searchCampWrap').show();
    } else {
        $('.searchCampWrap').hide();
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
    CheckAccessPermission("CaptureForm");
}

$("#SearchByIdentifierName").click(function () {
    ShowPageLoading();
    if ($.trim($("#ui_txtSearchBy").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.ManagePopUpForm.FormIdentiferSearch_error);
        $("#ui_txtSearchBy").focus();
        setTimeout(function () { HidePageLoading(); }, 500);
        return false;
    }
    else {
        OffSet = 0;
        CallBackFunction();
    }
});

$("#ui_txtSearchBy").keypress(function (e) {
    if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
        if (CleanText($.trim($("#ui_txtSearchBy").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.ManagePopUpForm.SearchErrorValue);
            HidePageLoading();
            return false;
        }
        ShowPageLoading();
        OffSet = 0;
        CallBackFunction();
    }
});

$("#ui_txtSearchBy").keyup(function (e) {
    if (e.which && e.which === 8 || e.keyCode && e.keyCode === 46)
        if ($("#ui_txtSearchBy").val().length === 0) {
            ShowPageLoading();
            MaxCount();
        }
});

var selectDate;
$(".datedropdown > .dropdown-menu a").click(function () {
    selectDate = $(this).text();
    $('#selectdateDropdown').html(selectDate);
    if (selectDate == "Custom Date Range") {
        $(".dateBoxWrap").addClass('showFlx');
    } else {
        $(".dateBoxWrap").removeClass('showFlx');
    }
});

$(".embfrmlist").click(function () {
    $(".popupcontainer").removeClass("hideDiv");
    $("#multivariatefrm").addClass("hideDiv");
    $(".popupItem").addClass('popup-tbl-trans');
    $(".popuptitle h6").html("Settings");
    $("#embdfrmssettings").removeClass("hideDiv");
});

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    document.body.style.overflow = "";
});

$(".dateclseWrap").on('click', function () {
    $(this).parents('.dateBoxWrap').removeClass('showFlx');
});

$("#startdate").datepicker({
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: false
});

$("#enddate").datepicker({
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: true
});

ChangeStatus = function (Id, status) {

    FormDetails.Id = Id;

    if (status == false)
        FormDetails.FormStatus = true;
    else
        FormDetails.FormStatus = false;

    $.ajax({
        url: "/CaptureForm/ManagePopUpForms/ToogleStatus",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': Id, 'formDetails': FormDetails }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                $("#changeStatus_" + Id).removeAttr("onclick");

                if (FormDetails.FormStatus == 1) {
                    $("#Status_" + Id).removeClass("text-color-error").addClass("text-color-success").attr("title", "toogle to inactive").html("").html("Active");
                    $("#changeStatus_" + Id).attr('onClick', 'ChangeStatus(' + Id + ', true);');
                }
                else {
                    $("#Status_" + Id).removeClass("text-color-success").addClass("text-color-error").attr("title", "toogle to active").html("").html("In-Active");
                    $("#changeStatus_" + Id).attr('onClick', 'ChangeStatus(' + Id + ', false);');
                }

                ShowSuccessMessage(GlobalErrorList.ManagePopUpForm.ToggleSuccessStatus);
            }
            else {
                ShowErrorMessage(GlobalErrorList.ManagePopUpForm.ToggleFailureStatus);
            }
            FormDetails.Id = 0;
            FormDetails.FormStatus = null;
        },
        error: ShowAjaxError
    });
};

var FormId = 0;
$(document).on('click', "#dv_deletePopUpForm", function () {
    FormId = parseInt($(this).attr("data-PopUpformid"));
});

$("#deleteRowConfirm").click(function () {

    $.ajax({
        url: "/CaptureForm/ManagePopUpForms/Delete",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': FormId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                --CurrentRowCount;
                --TotalRowCount;
                $("#ui_div_" + FormId).hide("slow");
                PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
                ShowSuccessMessage(GlobalErrorList.ManagePopUpForm.DeleteSuccessStatus);
                BindOTPForms();
                if (CurrentRowCount <= 0 && TotalRowCount <= 0) {
                    $('.searchCampWrap').hide();
                    ShowExportDiv(false);
                    ShowPagingDiv(false);
                    SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
                }
                else if (CurrentRowCount <= 0 && TotalRowCount > 0) {
                    //CallBackFunction();
                }
            }
            else {
                ShowErrorMessage(GlobalErrorList.ManagePopUpForm.DeleteFailureStatus);
            }
        },
        error: ShowAjaxError
    });
});

var DuplicateFormId = 0;
$(document).on('click', "#dv_duplicatePopUpForm", function () {
    DuplicateFormId = parseInt($(this).attr("data-PopUpDuplicateformid"));
});

$("#confirmduplicate").click(function () {
    CopyFormDetails(DuplicateFormId);
});

function CopyFormDetails(Id) {
    ShowPageLoading();
    $.ajax({
        url: "/CaptureForm/ManagePopUpForms/CopyFormDetails",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': Id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response > 0) {
                ShowSuccessMessage(GlobalErrorList.ManagePopUpForm.DuplicateFormSuccessStatus);
                CallBackFunction();
            }
            else {
                ShowErrorMessage(GlobalErrorList.ManagePopUpForm.DuplicateFormFailureStatus);
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}

function ManageCampaignDetails(Id) {
    document.body.style.overflow = "hidden";
    ShowPageLoading();
    $("#ui_mobileno").prop("checked", true);
    $("#ui_ctcno").prop("checked", true);
    $("#ui_isemail_No").prop("checked", true);
    $("#ui_isautowhatsappno").prop("checked", true);
    $("#dvCampaignSettings").removeClass("hideDiv");
    $("#dvPreview").addClass("hideDiv");
    $(".popuptitle h6").html("Settings");
    $('#ddlOtpform  > option[selected="selected"]').removeAttr('selected');

    $.ajax({
        url: "/CaptureForm/CommonDetailsForForms/GetFormDetails",
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'FormId': Id }),
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataFilter: function (data) { return data; },
        success: function (response) {
            if (!response.Status) {
                ShowErrorMessage(GlobalErrorList.ManagePopUpForm.FormCampaignIdentiferErrorDetails);
                HidePageLoading();
            }
            else if (response.Status) {
                formDetails = response.savedFormdetails;
                if (formDetails != null && formDetails != "") {
                    var FormIdentifier = formDetails.FormIdentifier.length > 50 ? formDetails.FormIdentifier.substring(0, 50) + ".." : formDetails.FormIdentifier;
                    $(".embedcampname").attr('title', formDetails.FormIdentifier).html(unescape(FormIdentifier));
                    $('#ui_txtCampaignIdentifier_values').children('div').remove();
                    $("#txtClientCampaignIdentifier,#ui_txtblockemailids").val("");
                    $("#btnSaveCampaignDetails").removeAttr("FormId").attr("FormId", Id);

                    if (formDetails.ClientCampaignIdentifier != null && formDetails.ClientCampaignIdentifier != "" && formDetails.CampaignIdentifier != null && formDetails.CampaignIdentifier != "") {
                        $("#txtClientCampaignIdentifier").val(formDetails.ClientCampaignIdentifier);
                        var data = new Array();
                        data["item"] = new Array();
                        data.item.value = formDetails.CampaignIdentifierName;
                        data.item.label = formDetails.CampaignIdentifierName;
                        data.item.assignedValue = formDetails.CampaignIdentifier;
                        AppendSelected("ui_txtCampaignIdentifier_values", data, "CampaignIdentifier");

                        if (formDetails.IsWebOrMobileForm == 1) {
                            $("#ui_mobileyes").prop("checked", true);
                        }

                        if (formDetails.IsClickToCallForm == 1) {
                            $("#ui_ctcyes").prop("checked", true);
                        }
                        if (formDetails.IsVerifiedEmail == 1) {
                            $("#ui_isemail_yes").prop("checked", true);
                        }
                        if (formDetails.IsAutoWhatsApp == 1) {
                            $("#ui_isautowhatsappyes").prop("checked", true);
                        }
                        $("#ui_txtblockemailids").val(formDetails.BlockEmailIds);
                    }
                    if (formDetails.IsOTPForm == 1) {
                        $('#ui_OTPyes').prop("checked", true);
                        //$("#ddlOtpform option[value='" + formDetails.OTPFormId + "']").attr("selected", "selected");
                        $("#ddlOtpform").val(formDetails.OTPFormId);
                        $("#ui_OTPgeneratelimit").val(formDetails.OTPGenerationLimits);
                        if (formDetails.OTPPageRestrictions) {
                            $("#otpevrypge").click();
                        } else {
                            $("#otpallpgecomb").click();
                        }
                        $(".otpdropdwnwrp").removeClass('hideDiv');
                    }
                    else {
                        $('#ui_OTPyes').prop("checked", false);
                        //$("#ddlOtpform option[value='0']").attr("selected", "selected");
                        $("#ddlOtpform").val(0);
                        $("#ui_OTPgeneratelimit").val("1");
                        $("#otpevrypge").click();
                        $(".otpdropdwnwrp").addClass('hideDiv');
                    }
                    HidePageLoading();
                }
            }
            else if (resultValue == -10) {
                ShowErrorMessage(GlobalErrorList.ManagePopUpForm.SessionExpired);
                HidePageLoading();
            }
            else {
                ShowErrorMessage(GlobalErrorList.ManagePopUpForm.FormCampaignIdentiferErrorDetails);
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

$("#txtCampaignIdentifier").autocomplete({
    autoFocus: true,
    minLength: 1, max: 10,
    source: function (request, response) {
        var value = $("#txtCampaignIdentifier").val();
        $.ajax({
            url: "/CaptureForm/CommonDetailsForForms/GetCampaignIdentifierDetails",
            data: JSON.stringify({ 'value': value }),
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataFilter: function (data) { return data; },
            success: function (data) {
                if (data.length > 0) {
                    response($.map(data, function (item) {
                        return {
                            label: item.label,
                            assignedValue: item.assignedValue,
                            value: item.value + ""
                        }
                    }))
                }
            }
        });
    },
    select: function (events, selectedItem) {
        if ($('#ui_txtCampaignIdentifier_values').children('div').length < 1)
            AppendSelected("ui_txtCampaignIdentifier_values", selectedItem, "CampaignIdentifier");
        else
            ShowErrorMessage(GlobalErrorList.ManagePopUpForm.CampaignIdentifierErrorItem);
    },
    close: function (event, ui) {
        $(this).val("");
    }
});

function AppendSelected(appendTo, data, fieldId) {
    var mainDiv = document.createElement("div");
    mainDiv.id = fieldId + "_" + data.item.value.replace(/[ ,:/]+/g, "_");
    mainDiv.className = "vrAutocomplete";
    mainDiv.setAttribute("value", data.item.value);
    mainDiv.setAttribute("CampaignId", data.item.assignedValue);
    mainDiv.setAttribute("identifier", data.item.value.replace(/[ ,:/]+/g, "_"));
    var span = document.createElement("span");
    span.className = "vnAutocomplete";

    var contentDiv = document.createElement("div");
    contentDiv.className = "vtAutocomplete";

    var label = data.item.label.length > 25 ? data.item.label.substring(0, 25) + ".." : data.item.label;

    contentDiv.innerHTML = label;
    contentDiv.title = data.item.label;

    var removeDiv = document.createElement("div");
    removeDiv.className = "vmAutocomplete";
    removeDiv.setAttribute("onclick", "RemoveData('" + fieldId + "_" + data.item.value.replace(/[ ,:/]+/g, "_") + "');");

    span.appendChild(contentDiv);
    span.appendChild(removeDiv);
    mainDiv.appendChild(span);

    var isElementIsNotAdded = true;

    $("#" + appendTo).children().each(function () {
        if (data.item.value.replace(/ /g, "_").replace(/,/g, "_") == $(this).attr("identifier")) {
            isElementIsNotAdded = false;
            return false;
        }
    });

    if (isElementIsNotAdded)
        $("#" + appendTo).append(mainDiv);
    else
        ShowErrorMessage(GlobalErrorList.ManagePopUpForm.ItemAlreadyAdded);
}

$("#btnSaveCampaignDetails").click(function () {
    ShowPageLoading();

    if (!ValidateCampaignDetails()) {
        HidePageLoading();
        return;
    }
    var Id = 0;
    var ClientCampaignIdentifier = $.trim($("#txtClientCampaignIdentifier").val());
    var CampaignIdentiferName = GetListDataBySpanId($("#ui_txtCampaignIdentifier_values"), "value", "").join(",");
    var CampaignIdentifer = GetListDataBySpanId($("#ui_txtCampaignIdentifier_values"), "CampaignId", "").join(",");
    var IsWebOrMobileForm = false, IsClickToCallForm = false, IsVerifiedEmail = false, IsAutoWhatsApp = false;
    var BlockEmailIds = $.trim($("#ui_txtblockemailids").val());

    if ($("input[name='IsMobileForm']:checked").val() == "1") {
        IsWebOrMobileForm = true;
    }

    if ($("input[name='IsCTCForm']:checked").val() == "1") {
        IsClickToCallForm = true;
    }

    if ($("input[name='isemail']:checked").val() == "1") {
        IsVerifiedEmail = true;
    }
    if ($("input[name='IsAutoWhatsApp']:checked").val() == "1") {
        IsAutoWhatsApp = true;
    }
    let OTPGenerateLimit = 1, OTPPageRestrict = 0;
    if ($("input[name='IsOTPForm']:checked").val() == "1") {
        IsOtpForm = true;
        OTPFormId = $("#ddlOtpform option:selected").val();

        if ($("#ui_OTPgeneratelimit").val() != "") {
            OTPGenerateLimit = $("#ui_OTPgeneratelimit").val();
        } else {
            OTPGenerateLimit = 1;
        }

        if ($("input[name='otppgerestrict']:checked").val() == "1")
            OTPPageRestrict = 1;
        else
            OTPPageRestrict = 0;

    }
    else {
        IsOtpForm = false;
        OTPFormId = 0;
        OTPGenerateLimit = 0;
        OTPPageRestrict = 0;
    }

    if ($("#btnSaveCampaignDetails").attr("FormId") != undefined) {
        Id = $("#btnSaveCampaignDetails").attr("FormId");
    }

    if (Id > 0) {
        $.ajax({
            url: "/CaptureForm/CommonDetailsForForms/SaveOrUpdateCampaignDetails",
            type: 'POST',
            data: JSON.stringify({ 'Id': Id, 'ClientCampaignIdentifier': ClientCampaignIdentifier, 'CamapignId': CampaignIdentifer, 'CampaignIdentiferName': CampaignIdentiferName, 'IsOtpForm': IsOtpForm, 'OTPFormId': OTPFormId, 'IsWebOrMobileForm': IsWebOrMobileForm, 'OTPGenerationLimits': OTPGenerateLimit, 'OTPPageRestrictions': OTPPageRestrict, 'IsClickToCallForm': IsClickToCallForm, 'IsVerifiedEmail': IsVerifiedEmail, 'IsAutoWhatsApp': IsAutoWhatsApp, 'BlockEmailIds': BlockEmailIds }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage("Campaign Identifier Details saved successfully.");
                    HidePageLoading();
                    $("#dvCampaignSettings").addClass("hideDiv");
                    document.body.style.overflow = "";
                }
                else {
                    ShowErrorMessage(GlobalErrorList.ManagePopUpForm.CampaignIdentifierFailureStatus);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    }
    else {
        ShowErrorMessage(GlobalErrorList.ManagePopUpForm.CampaignIdentifierFailureStatus);
        HidePageLoading();
        $("#dvCampaignSettings").addClass("hideDiv");
        document.body.style.overflow = "";
    }
});

ValidateCampaignDetails = function () {

    if ($.trim($("#txtClientCampaignIdentifier").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.ManagePopUpForm.EnterClientCampaignIdentifer);
        return false;
    }

    if ($('#ui_txtCampaignIdentifier_values').children('div').length <= 0) {
        ShowErrorMessage(GlobalErrorList.ManagePopUpForm.EnterCampaignIdentifer);
        return false;
    }

    if ($('#ui_OTPyes').is(":checked") && $("#ddlOtpform").get(0).selectedIndex <= 0) {
        ShowErrorMessage(GlobalErrorList.ManagePopUpForm.SelectOTPForm);
        return false;
    }

    return true;
};

GetListDataBySpanId = function (spanTag, valueType, replaceId) {

    var objectValues = new Array();
    spanTag.children().each(function () {

        var value = "";
        if (replaceId.length > 0)
            value = $(this).attr(valueType).replace(replaceId, "");
        else
            value = $(this).attr(valueType);

        objectValues.push(value);
    });
    return objectValues;
};

function BindOTPForms() {
    $('#ddlOtpform option:not(:first)').remove();
    $.ajax({
        url: "/CaptureForm/CommonDetailsForForms/GetOTPForms",
        type: 'POST',
        data: JSON.stringify({ 'FormType': "PopUpForm" }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response, function () {
                $("#ddlOtpform").append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].FormIdentifier + "</option>");
            });
        },
        error: ShowAjaxError
    });
};

$('input[name="IsOTPForm"]').click(function () {
    let setotpfrmval = $(this).val();
    if (setotpfrmval == "1") {
        $(".otpdropdwnwrp").removeClass('hideDiv');
    } else {
        $(".otpdropdwnwrp").addClass('hideDiv');
    }
});

function RemoveData(obj) {
    $("#" + obj).remove();
}

$('.sorted_table').sortable({
    handle: '.griddragicn',
    containerSelector: 'table',
    itemPath: '> tbody',
    itemSelector: 'tr',
    placeholder: '<tr class="placeholder"/>',
    onDrop: function ($item, container, _super) {

        _super($item, container);

        var newIndex = $item.index();
        var col1 = $item.find("td:eq(0)").text();

        var formids = [];
        var FormIdValues = [];
        var FormPriorities = [];
        var FormDetailsList = new Array();

        $("#ui_tbodyReportData tr").each(function () {
            formids.push(this.id);
        });

        for (var i = 0; i < formids.length; i++) {
            if ($("#" + formids[i]).attr('value') != undefined && $("#" + formids[i]).attr('value') != null && $("#" + formids[i]).attr('value') != "") {
                FormIdValues.push($("#" + formids[i]).attr('value'));
            }

            if ($("#" + formids[i]).attr('priorityinfo') != undefined && $("#" + formids[i]).attr('priorityinfo') != null && $("#" + formids[i]).attr('priorityinfo') != "") {
                FormPriorities.push($("#" + formids[i]).attr('priorityinfo'));
            }
        }

        //This i am doing to re-arrange the form priorities in  ascending order
        FormPriorities = FormPriorities.sort(function (a, b) {
            return parseInt(a) - parseInt(b);
        });


        for (var i = 0; i < FormIdValues.length; i++) {
            var formdetails = { Id: 0, FormPriority: 0 };

            formdetails.Id = FormIdValues[i];
            formdetails.FormPriority = FormPriorities[i];

            window.console.log("FormId-" + formdetails.Id + "," + "FormPriority-" + formdetails.FormPriority);
            FormDetailsList.push(formdetails);
        }

        $.ajax({
            url: "/CaptureForm/ManagePopUpForms/ChangePriority",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'formdetails': FormDetailsList }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.ManagePopUpForm.PrioritySuccessStatus);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.ManagePopUpForm.PriorityFailureStatus);
                }
            },
            error: ShowAjaxError
        });
    }
});

$("#ui_aCreatePopUpForm").click(function () {
    ShowPageLoading();
    $.ajax({
        url: "/ManageContact/ContactImportOverViews/CheckContactSetting/",
        type: 'POST',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != undefined && response != null && response.Status != undefined && response.Status != null && response.Status) {
                window.location.href = "/CaptureForm/Create?FormType=PopUpForm";
            }
            else {
                $('#ui_divContactSetting').modal('show');
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});

function EditDetails(FormType, FormId) {
    window.location.href = "/CaptureForm/Create/PopUpForm?FormType=" + FormType + "&FormId=" + FormId + "";
}

function ManagePreviewDetails(formId, FormType, FormIdentifier) {
    $(".addpreviewhtml").contents().find("body").html("");

    ShowPageLoading();
    $("#dvPreview").removeClass("hideDiv");
    $("#dvCampaignSettings,#dvMultiConditionalForm").addClass("hideDiv");
    $(".popuptitle h6").html("PREVIEW" + "(" + FormIdentifier + ")");

    $(".addpreviewhtml").contents().find("head").append('<link rel="stylesheet" href="/Content/css/form-editor-main-style.css">');
    $(".addpreviewhtml").contents().find("head").append('<link rel="stylesheet" href="/Content/css/all.css">');
    $(".addpreviewhtml").contents().find("head").append('<link rel="stylesheet" href="/Content/ionicons/css/ionicons.css">');
    $(".addpreviewhtml").contents().find("head").append('<link rel="stylesheet" href="//fonts.googleapis.com/css?family=Source+Sans+Pro|Cantora+One|Cabin+Condensed:400,500,600|Francois+One|Homenaje|Allerta|Allerta+Stencil|PT+Sans+Caption">');
    $(".addpreviewhtml").contents().find("head").append('<link rel="stylesheet" href="//code.jquery.com/ui/1.11.1/themes/smoothness/jquery-ui.css">');
    $(".addpreviewhtml").contents().find("head").append('<link rel="stylesheet" href="/Content/css/bootstrap.min.css">');

    var myIframe = document.getElementById("Plumb5FromCampaign");
    var mainContentDiv = getDiv("dvMainContentDiv", "simpleForm");
    myIframe.contentWindow.document.body.appendChild(mainContentDiv);

    var script = document.createElement("script");
    script.textContent = 'function intializeCalender() {try {$(".calender").datepicker({showOtherMonths: true,selectOtherMonths: true,dateFormat: "dd-mm-yy"});}catch (Err){ }try {$(".calenderWithoutPastDates").datepicker({showOtherMonths: true,selectOtherMonths: true,dateFormat: "dd-mm-yy"});}catch (Err){ }try {$(".calenderWithoutFutureDates").datepicker({showOtherMonths: true,selectOtherMonths: true,dateFormat: "dd-mm-yy" });} catch (Err){ }}';
    myIframe.contentWindow.document.head.appendChild(script);

    var urlFetchDetails = "";
    if (FormType == 1)
        urlFetchDetails = "/CaptureForm/ManageEmbeddedForms/GetFormDetails";
    else if (FormType == 2 || FormType == 3 || FormType == 4 || FormType == 5)
        urlFetchDetails = "/CaptureForm/Create/GetFormDetails";

    $.ajax({
        url: urlFetchDetails,
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'FormId': formId }),
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataFilter: function (data) { return data; },
        success: function (response) {
            if (!response.Status) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.GetErrorDetails);
            }
            else if (response.Status) {
                if (FormType == 1)
                    BindFormPreview(response, "Plumb5FromCampaign", FormType);
                else if (FormType == 2 || FormType == 3 || FormType == 4 || FormType == 5)
                    BindFormPreview(response, "Plumb5FromCampaign", FormType);
            }
            else if (resultValue == -10) {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.SessionExpiryError);
                HidePageLoading();
            }
            else {
                ShowErrorMessage(GlobalErrorList.CreateEmbeddedForm.FormBindingProblem);
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
    HidePageLoading();
}

function getDiv(divId, ClassName) {
    var divTag = document.createElement("div");
    if (divId.length > 0) {
        if (!document.getElementById(divId)) {
            divTag.id = divId;
            divTag.className = ClassName;
            return divTag;
        }
    }
    else {
        return divTag;
    }
    return null;
}

function BindFormPreview(ResponseDetails, IframeId, FormType) {
    var iframeid = IframeId;

    formBasicDetails = formDesign = ResponseDetails.savedFormdetails;
    formFields = ResponseDetails.savedFormField;

    if (ResponseDetails.savedFormBanner != null) {
        formBannerList = ResponseDetails.savedFormBanner[0];
    }

    formFieldsBindingDetails = ResponseDetails.savedFormFieldBindingDetails;

    if (formBasicDetails.FormType == 1)
        BindForms(iframeid, formBasicDetails.FormType);
    else if (formBasicDetails.FormType == 2)
        BindCustomHtmlForms(iframeid, formBasicDetails.FormType);
    else if (formBasicDetails.FormType == 3)
        BindCustomIframeForms(iframeid);
    else if (formBasicDetails.FormType == 4)
        BindCustomBanner(iframeid, formBasicDetails.FormType);
    else if (formBasicDetails.FormType == 5)
        BindVideoForm(iframeid);
}

function BindForms(iframeid, FormType) {
    BindFormDesignStyle(iframeid);

    appendCloseButton(iframeid);

    if (formBasicDetails.IsNewDivOrOldTable == 0)
        formFieldAppendInTableFormat(iframeid);
    else
        formFieldAppendInDivFormat(iframeid, FormType);

    setHeightWidth(iframeid);
}

function BindCustomBanner(iframeid, FormType) {
    BindFormDesignStyle(iframeid);

    var bannerheight = 0;
    var bancontent = formDesign.MainBackgroundDesign;
    var firstContent;

    if (bancontent.indexOf("height") > -1) {
        firstContent = bancontent.substring(bancontent.indexOf("height") + 7, bancontent.length);
        bannerheight = firstContent.substring(0, firstContent.indexOf(";")).replace("px", "");
        bannerheight = bannerheight.trim();
        bannerheight = parseInt(bannerheight);
    }

    bannerImageAppend(iframeid, FormType, bannerheight);

    appendCloseButton(iframeid);

    setHeightWidth(iframeid);
}

function BindCustomHtmlForms(iframeid, FormType) {
    BindFormDesignStyle(iframeid);
    htmlAppend(iframeid, FormType);
    appendCloseButton(iframeid);
    setHeightWidth(iframeid);
}

function BindCustomIframeForms(iframeid) {
    BindFormDesignStyle(iframeid);
    IframeAppend(iframeid);
    appendCloseButton(iframeid);
    setHeightWidth(iframeid);
}

function BindVideoForm(iframeid) {
    videoAppend(iframeid);
    BindFormDesignStyle(iframeid);
    appendCloseButton(iframeid);
    setHeightWidth(iframeid);
}

function bannerImageAppend(iframeid, FormType, banheight) {
    var IframeElement = document.getElementById(iframeid);
    var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

    //var anchorTag = document.createElement("a");
    //anchorTag.style.textDecoration = "none";
    //if (formBannerList.RedirectUrl != null && formBannerList.RedirectUrl.length > 0)
    //    anchorTag.href = formBannerList.RedirectUrl, anchorTag.target = "_parent";

    //var myImage = document.createElement("img");
    //myImage.style.width = "100%";
    //myImage.style.height = (banheight - 25) + "px";
    //myImage.setAttribute("src", formBannerList.BannerContent);
    //anchorTag.appendChild(myImage);

    var div = getDiv("");
    div.className = "dvbannerimg";
    div.style.width = "100%";
    div.style.backgroundImage = "url(" + formBannerList.BannerContent + ")";
    div.style.backgroundRepeat = "no-repeat";
    //div.append(anchorTag);

    if (innerDoc != undefined) {
        //innerDoc.getElementById("dvMainContentDiv").style.backgroundImage = "url(" + formBannerList.BannerContent + ")";
        //innerDoc.getElementById("dvMainContentDiv").style.backgroundRepeat = "no-repeat";
        //innerDoc.getElementById("dvMainContentDiv").style.backgroundPosition = "center";
        innerDoc.getElementById("dvMainContentDiv").appendChild(div);
    }
}

function htmlAppend(iframeid, FormType) {
    var div = getDiv("");
    div.className = "dvhtmlcontent";
    div.innerHTML = formBannerList.BannerContent;

    var IframeElement = document.getElementById(iframeid);
    var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

    if (innerDoc != undefined) {
        innerDoc.getElementById("dvMainContentDiv").appendChild(div);
    }
}

function IframeAppend(iframeid) {
    var div = getDiv("");
    div.className = "dviframecontent";
    div.innerHTML = formBannerList.BannerContent;

    var IframeElement = document.getElementById(iframeid);
    var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

    if (innerDoc != undefined) {
        innerDoc.getElementById("dvMainContentDiv").appendChild(div);
    }
}

function videoAppend(iframeid) {

    var IframeElement = document.getElementById(iframeid);
    var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

    if (formBannerList.BannerContent.indexOf("embed") > -1) {

        var div = getDiv("");
        div.className = "dvvideocontent";
        div.innerHTML = formBannerList.BannerContent;

        if (innerDoc != undefined) {
            innerDoc.getElementById("dvMainContentDiv").appendChild(div);
        }
    }
    else if (formBannerList.BannerContent.indexOf("iframe") < 0) {

        formBannerList.BannerContent = "//" + formBannerList.BannerContent.replace("watch?v=", "embed/").replace("http://", "").replace("https://", "");

        if (formBannerList.BannerContent.indexOf("embed") > -1) {
            var contentFrame = document.createElement("iframe");
            contentFrame.className = "dvvideocontent";
            contentFrame.id = "iframeContent"; contentFrame.scrolling = "no"; contentFrame.frameborder = "0"; contentFrame.marginwidth = "0"; contentFrame.marginheight = "0"; contentFrame.allowtransparency = true;
            contentFrame.style.border = "none";
            contentFrame.setAttribute("src", formBannerList.BannerContent);
            contentFrame.style.height = formDesign.Height - 26 + "px";
            contentFrame.style.width = "100%";
            contentFrame.style.height = "100%";

            if (innerDoc != undefined) {
                innerDoc.getElementById("dvMainContentDiv").appendChild(contentFrame);
            }
        }
    }
    else if (formBannerList.BannerContent.indexOf("iframe") > -1) {
        var div = getDiv("");
        div.className = "dvvideocontent";
        div.innerHTML = formBannerList.BannerContent;

        if (innerDoc != undefined) {
            innerDoc.getElementById("dvMainContentDiv").appendChild(div);
        }
    }
}

function BindFormDesignStyle(IframeId) {
    var IframeElement = document.getElementById(IframeId);
    var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

    if (innerDoc != undefined) {
        if (formBasicDetails.MainBackgroundDesign != null && formBasicDetails.MainBackgroundDesign.length > 0) {
            if (innerDoc.getElementById('ui_MainBodyDesignCss') != undefined) {
                innerDoc.getElementById('ui_MainBodyDesignCss').remove();
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_MainBodyDesignCss";
            style.appendChild(document.createTextNode(".simpleForm {" + formBasicDetails.MainBackgroundDesign + "}"));
            IframeElement.contentDocument.head.appendChild(style);
        }

        if (formBasicDetails.TitleCss != null && formBasicDetails.TitleCss.length > 0) {
            if (innerDoc.getElementById('ui_TitleCss') != undefined) {
                innerDoc.getElementById('ui_TitleCss').remove();
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_TitleCss";
            style.appendChild(document.createTextNode(".headTitOne {" + formBasicDetails.TitleCss + "}"));
            IframeElement.contentDocument.head.appendChild(style);
        }

        if (formBasicDetails.DescriptionCss != null && formBasicDetails.DescriptionCss.length > 0) {

            var descriptionDesignData = formBasicDetails.DescriptionCss.split("@$@");

            var descriptionDesignDataFirstCss = descriptionDesignData[0];
            var descriptionDesignDataSecondCss = descriptionDesignData[1];

            if (innerDoc.getElementById('ui_formDescripTxt') != undefined) {
                innerDoc.getElementById('ui_formDescripTxt').remove();
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_formDescripTxt";
            style.appendChild(document.createTextNode(".formDescripTxt {" + descriptionDesignDataFirstCss + "}"));
            IframeElement.contentDocument.head.appendChild(style);

            if (innerDoc.getElementById('ui_formDescript') != undefined) {
                innerDoc.getElementById('ui_formDescript').remove();
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_formDescript";
            style.appendChild(document.createTextNode(".formDescriptwrp {" + descriptionDesignDataSecondCss + "}"));
            IframeElement.contentDocument.head.appendChild(style);
        }

        if (formBasicDetails.TextboxDropCss != null && formBasicDetails.TextboxDropCss.length > 0) {

            if (innerDoc.getElementById('ui_TextboxDropCss') != undefined) {
                innerDoc.getElementById('ui_TextboxDropCss').remove();
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_TextboxDropCss";
            style.appendChild(document.createTextNode(".input-form-control {" + formBasicDetails.TextboxDropCss + "}"));
            IframeElement.contentDocument.head.appendChild(style);
        }

        if (formBasicDetails.LabelCss != null && formBasicDetails.LabelCss.length > 0) {

            var labelDesignData = formBasicDetails.LabelCss.split("@$@");

            var labelDesignDataFirstCss = labelDesignData[0];
            var labelDesignDataSecondCss = labelDesignData[1];
            var labelDesignDataThirdCss = labelDesignData[2];
            var labelDesignDataFourthCss = labelDesignData[3];

            if (innerDoc.getElementById('ui_labelCssWrp') != undefined) {
                innerDoc.getElementById('ui_labelCssWrp').remove()
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_labelCssWrp";
            style.appendChild(document.createTextNode(".labelStyle, .labelWrap, .labelWrapradio, .labelWrapcheck {" + labelDesignDataFirstCss + "}"));
            IframeElement.contentDocument.head.appendChild(style);

            if (innerDoc.getElementById('ui_labelStyleCss') != undefined) {
                innerDoc.getElementById('ui_labelStyleCss').remove()
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_labelStyleCss";
            style.appendChild(document.createTextNode(".labelStyle {" + labelDesignDataSecondCss + "}"));
            IframeElement.contentDocument.head.appendChild(style);

            if (innerDoc.getElementById('ui_labelStyleRadioFontCss') != undefined) {
                innerDoc.getElementById('ui_labelStyleRadioFontCss').remove()
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_labelStyleRadioFontCss";
            style.appendChild(document.createTextNode(".simpleForm .labelWrapradio {" + labelDesignDataThirdCss + "}"));
            IframeElement.contentDocument.head.appendChild(style);

            if (innerDoc.getElementById('ui_labelStyleCheckBoxFontCss') != undefined) {
                innerDoc.getElementById('ui_labelStyleCheckBoxFontCss').remove()
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_labelStyleCheckBoxFontCss";
            style.appendChild(document.createTextNode(".simpleForm .labelWrapcheck {" + labelDesignDataFourthCss + "}"));
            IframeElement.contentDocument.head.appendChild(style);
        }

        if (formBasicDetails.CloseCss != null && formBasicDetails.CloseCss.length > 0) {

            var closeDesignData = formBasicDetails.CloseCss.split("@$@");

            var closeDesignDataFirstCss = closeDesignData[0];
            var closeDesignDataSecondCss = closeDesignData[1];
            var closeDesignDataThirdCss = closeDesignData[2];

            if (innerDoc.getElementById('ui_CloseCssWrp') != undefined) {
                innerDoc.getElementById('ui_CloseCssWrp').remove()
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_CloseCssWrp";
            style.appendChild(document.createTextNode(".clsWrap {" + closeDesignDataFirstCss + "}"));
            IframeElement.contentDocument.head.appendChild(style);


            if (innerDoc.getElementById('ui_CloseStyleAlignCss') != undefined) {
                innerDoc.getElementById('ui_CloseStyleAlignCss').remove()
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_CloseStyleAlignCss";
            style.appendChild(document.createTextNode(".clsleftalign {" + closeDesignDataSecondCss + "}"));
            IframeElement.contentDocument.head.appendChild(style);

            if (innerDoc.getElementById('ui_CloseMinimiseWrpCss') != undefined) {
                innerDoc.getElementById('ui_CloseMinimiseWrpCss').remove()
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_CloseMinimiseWrpCss";
            style.appendChild(document.createTextNode(".clsminimsewrp {" + closeDesignDataThirdCss + "}"));
            IframeElement.contentDocument.head.appendChild(style);
        }

        if (formBasicDetails.IsMinimiseButton == 1 && formBasicDetails.MinimiseCss != null && formBasicDetails.MinimiseCss.length > 0) {

            var minimiseDesignData = formBasicDetails.MinimiseCss;

            if (innerDoc.getElementById('ui_MinimiseCssWrp') != undefined) {
                innerDoc.getElementById('ui_MinimiseCssWrp').remove()
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_MinimiseCssWrp";
            style.appendChild(document.createTextNode(".minimsebtnwrp {" + minimiseDesignData + "}"));
            IframeElement.contentDocument.head.appendChild(style);
        }

        if (formBasicDetails.ButtonCss != null && formBasicDetails.ButtonCss.length > 0) {

            var buttonDesignData = formBasicDetails.ButtonCss.split("@$@");

            var buttonDesignDataFirstCss = buttonDesignData[0];
            var buttonDesignDataSecondCss = buttonDesignData[1];
            var buttonDesignDataThirdCss = buttonDesignData[2];
            var buttonDesignDataFourthCss = buttonDesignData[3];

            if (innerDoc.getElementById('ui_parSubBtn') != undefined) {
                innerDoc.getElementById('ui_parSubBtn').remove()
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_parSubBtn";
            style.appendChild(document.createTextNode(".parSubBtn {" + buttonDesignDataFirstCss + "}"));
            IframeElement.contentDocument.head.appendChild(style);


            if (innerDoc.getElementById('ui_childSubBtn') != undefined) {
                innerDoc.getElementById('ui_childSubBtn').remove()
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_childSubBtn";
            style.appendChild(document.createTextNode(".childSubBtn {" + buttonDesignDataSecondCss + "}"));
            IframeElement.contentDocument.head.appendChild(style);

            if (innerDoc.getElementById('ui_btnstyle') != undefined) {
                innerDoc.getElementById('ui_btnstyle').remove()
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_btnstyle";
            style.appendChild(document.createTextNode(".btn-style {" + buttonDesignDataThirdCss + "}"));
            IframeElement.contentDocument.head.appendChild(style);

            if (innerDoc.getElementById('ui_btnstyleHover') != undefined) {
                innerDoc.getElementById('ui_btnstyleHover').remove()
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_btnstyleHover";
            style.appendChild(document.createTextNode(".btn-style:hover {" + buttonDesignDataFourthCss + "}"));
            IframeElement.contentDocument.head.appendChild(style);
        }

        if (formBasicDetails.PlaceHolderClass != null && formBasicDetails.PlaceHolderClass.length > 0) {
            if (innerDoc.getElementById('ui_PlaceholderClass') != undefined) {
                innerDoc.getElementById('ui_PlaceholderClass').remove()
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_PlaceholderClass";
            style.appendChild(document.createTextNode(formDesign.PlaceHolderClass));
            IframeElement.contentDocument.head.appendChild(style);
        }

        if (formBasicDetails.GeneralCss != null && formBasicDetails.GeneralCss.length > 0) {
            if (innerDoc.getElementById('ui_GeneralCssClass') != undefined) {
                innerDoc.getElementById('ui_GeneralCssClass').remove()
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_GeneralCssClass";
            style.appendChild(document.createTextNode(formBasicDetails.GeneralCss));
            IframeElement.contentDocument.head.appendChild(style);
        }

        if (formBasicDetails.BannerImageDesignCss != null && formBasicDetails.BannerImageDesignCss.length > 0) {
            if (innerDoc.getElementById('ui_BannerImageDesignCss') != undefined) {
                innerDoc.getElementById('ui_BannerImageDesignCss').remove();
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_BannerImageDesignCss";
            style.appendChild(document.createTextNode(".bgAppend {" + formBasicDetails.BannerImageDesignCss + "}"));
            IframeElement.contentDocument.head.appendChild(style);
        }

        if (formBasicDetails.RadioCheckBoxFieldsCss != null && formBasicDetails.RadioCheckBoxFieldsCss.length > 0) {

            var RadioCheckBoxDesignData = formBasicDetails.RadioCheckBoxFieldsCss.split("@$@");

            var RadioCheckBoxDesignDataFirstCss = RadioCheckBoxDesignData[0];
            var RadioCheckBoxDesignDataSecondCss = RadioCheckBoxDesignData[1];

            if (innerDoc.getElementById('ui_labelRadioCheckBox') != undefined) {
                innerDoc.getElementById('ui_labelRadioCheckBox').remove()
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_labelRadioCheckBox";
            style.appendChild(document.createTextNode(".simpleForm .label-check {" + RadioCheckBoxDesignDataFirstCss + "}"));
            IframeElement.contentDocument.head.appendChild(style);

            if (innerDoc.getElementById('ui_labelRadioCheckBoxFieldCss') != undefined) {
                innerDoc.getElementById('ui_labelRadioCheckBoxFieldCss').remove()
            }

            style = document.createElement('STYLE');
            style.type = 'text/css';
            style.id = "ui_labelRadioCheckBoxFieldCss";
            style.appendChild(document.createTextNode(".simpleForm .check-container .input-check, .simpleForm .radio-container .input-check {" + RadioCheckBoxDesignDataSecondCss + "}"));
            IframeElement.contentDocument.head.appendChild(style);
        }
    }

    if (formBasicDetails.GeneralParentCss != null && formBasicDetails.GeneralParentCss.length > 0) {
        if (document.getElementById('ui_GeneralMediaCssClass') != undefined) {
            document.getElementById('ui_GeneralMediaCssClass').remove()
        }

        style = document.createElement('STYLE');
        style.type = 'text/css';
        style.id = "ui_GeneralMediaCssClass";
        style.appendChild(document.createTextNode(formDesign.GeneralParentCss));
        document.head.appendChild(style);
    }
}

function setHeightWidth(iframeid) {
    var heightWidth = GetHeightWidthFromCustomStyle(iframeid);

    captureFormDiv = parent.window.document.getElementById(iframeid);

    var IsPixceOrPercent = formBasicDetails.BackgroundPxOPer ? "%" : "px";

    if (formBasicDetails.IsMainBackgroundDesignCustom) {
        captureFormDiv.height = heightWidth.ActualHeightValue + IsPixceOrPercent;
        captureFormDiv.width = heightWidth.ActualWidthValue + IsPixceOrPercent;
    }
    else {
        captureFormDiv.height = heightWidth.Height + IsPixceOrPercent;
        captureFormDiv.width = heightWidth.Width + IsPixceOrPercent;
    }
}

function GetHeightWidthFromCustomStyle(iframeid) {
    var height = 0, width = 0, actualWidthValue, actualHeightValue;
    var content = formDesign.MainBackgroundDesign;
    var firstContent;
    if (content.indexOf("width") > -1) {
        firstContent = content.substring(content.indexOf("width") + 6, content.length);
        actualWidthValue = firstContent.substring(0, firstContent.indexOf(";"));
        width = firstContent.substring(0, firstContent.indexOf(";")).replace("px", "");
        width = width.trim();
        width = parseInt(width);
    }
    if (content.indexOf("height") > -1) {
        firstContent = content.substring(content.indexOf("height") + 7, content.length);
        actualHeightValue = firstContent.substring(0, firstContent.indexOf(";"));
        height = firstContent.substring(0, firstContent.indexOf(";")).replace("px", "");
        height = height.trim();
        height = parseInt(height);
    }
    return { Width: width, Height: height, ActualWidthValue: actualWidthValue, ActualHeightValue: actualHeightValue }
}

function formFieldAppendInDivFormat(iframeid, FormType) {

    var IframeElement = document.getElementById(iframeid);
    var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

    var plachoderisNeeded = formDesign.AppearEffectOfFields;

    var rowContent = "";
    var imagerowcontent = "";
    for (var i = 0; i < formFieldsBindingDetails.length; i++) {

        if (formFieldsBindingDetails[i].FormLayoutOrder == 1) {
            if (formFieldsBindingDetails[i].FieldType == 1 || formFieldsBindingDetails[i].FieldType == 2 || formFieldsBindingDetails[i].FieldType == 3 || formFieldsBindingDetails[i].FieldType == 5 || formFieldsBindingDetails[i].FieldType == 6 || formFieldsBindingDetails[i].FieldType == 21 || formFieldsBindingDetails[i].FieldType == 22 || formFieldsBindingDetails[i].FieldType == 23) {

                if (plachoderisNeeded == 1)
                    rowContent += "<div class='frminputWrap del'><div class='frmeditrow lblTxtBox'><div id='ui_dvplaceholder" + i + "' class='form-col-4  labelStyle lblAlignPlaceholder adCol-100' style='display: flex;'><label>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8  txtBox adCol-100'><input type='text' autocomplete='off' id='ui_Field" + i + "' class='input-form-control' /><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please enter your " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
                else if (plachoderisNeeded == 0)
                    rowContent += "<div class='frminputWrap del'><div class='frmeditrow lblTxtBox'><div class='form-col-4  labelStyle'><label>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8  txtBox'><input id='ui_Field" + i + "' type='text' autocomplete='off' class='input-form-control' /><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please enter your " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
                else if (plachoderisNeeded == 2)
                    rowContent += "<div class='frminputWrap del'><div class='frmeditrow lblTxtBox'><div class='form-col-4  labelStyle adCol-100'><label>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8  txtBox adCol-100'><input type='text' autocomplete='off' id='ui_Field" + i + "' class='input-form-control' /><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please enter your " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
            }
            else if (formFieldsBindingDetails[i].FieldType == 4) {

                var ClassName = "";

                if (formFieldsBindingDetails[i].CalendarDisplayType == 0)
                    ClassName = " calender";
                else if (formFieldsBindingDetails[i].CalendarDisplayType == 1)
                    ClassName = " calenderWithoutPastDates";
                else if (formFieldsBindingDetails[i].CalendarDisplayType == 2)
                    ClassName = " calenderWithoutFutureDates";

                if (plachoderisNeeded == 1)
                    rowContent += "<div class='frminputWrap del'><div class='frmeditrow dateBoxWrap'><div id='ui_dvplaceholder" + i + "' class='form-col-4 labelStyle adCol-100 lblAlignPlaceholder' style='display: flex;'><label>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8  dateWrap adCol-100'><input autocomplete='off' id='ui_Field" + i + "' class='input-form-control prevdtpickrinpt hasDatepicker " + ClassName + "' type='text'><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please enter " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
                else if (plachoderisNeeded == 0)
                    rowContent += "<div class='frminputWrap del'><div class='frmeditrow dateBoxWrap'><div class='form-col-4  labelStyle' style='display:flex;'><label>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8  dateWrap'><input id='ui_Field" + i + "' class='input-form-control prevdtpickrinpt hasDatepicker " + ClassName + "' type='text' autocomplete='off' placeholder='" + formFieldsBindingDetails[i].Name + " (dd-mm-yy)'><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please enter " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
                else if (plachoderisNeeded == 2)
                    rowContent += "<div class='frminputWrap del'><div class='frmeditrow dateBoxWrap'><div class='form-col-4  labelStyle adCol-100'><label>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8  dateWrap adCol-100'><input id='ui_Field" + i + "' class='input-form-control prevdtpickrinpt hasDatepicker " + ClassName + "' type='text' autocomplete='off' placeholder='" + formFieldsBindingDetails[i].Name + " (dd-mm-yy)'><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please enter " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
            }
            else if (formFieldsBindingDetails[i].FieldType == 7) {
                if (plachoderisNeeded == 1)
                    rowContent += "<div class='frminputWrap del'><div class='frmeditrow messBox'><div id='ui_dvplaceholder" + i + "' class='form-col-4 labelStyle adCol-100 lblAlignPlaceholder' style='display: flex;'><label>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8  textMessWrap adCol-100'><textarea id='ui_Field" + i + "' class='input-form-control'></textarea><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please enter your " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
                else if (plachoderisNeeded == 0)
                    rowContent += "<div class='frminputWrap del'><div class='frmeditrow messBox'><div class='form-col-4  labelStyle'><label>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8  textMessWrap'><textarea id='ui_Field" + i + "' class='input-form-control'></textarea><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please enter your " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
                else if (plachoderisNeeded == 2)
                    rowContent += "<div class='frminputWrap del'><div class='frmeditrow messBox'><div class='form-col-4  labelStyle adCol-100'><label>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8  textMessWrap adCol-100'><textarea id='ui_Field" + i + "' class='input-form-control'></textarea><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please enter your " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
            }
            else if (formFieldsBindingDetails[i].FieldType == 8) {

                var options = "";

                if (plachoderisNeeded != 1)
                    options = "<option value='0'>Select</option>";
                else
                    options = "<option value='0'>Select " + formFieldsBindingDetails[i].Name + "</option>";

                if (formFieldsBindingDetails[i].RelationField == 0) {
                    var subFieldList = formFieldsBindingDetails[i].SubFields.split(",");
                    for (var j = 0; j < subFieldList.length; j++)
                        options += "<option value='" + subFieldList[j] + "'>" + subFieldList[j] + "</option>"
                }

                if (plachoderisNeeded == 1)
                    rowContent += "<div class='frminputWrap del'><div class='frmeditrow selectDropPar'><div class='form-col-4  labelStyle' style='display: none;'><label>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8  SelectDropId adCol-100'><select id='ui_Field" + i + "' class='input-form-control'>" + options + "</select><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please select your " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
                else if (plachoderisNeeded == 0)
                    rowContent += "<div class='frminputWrap del'><div class='frmeditrow selectDropPar'><div class='form-col-4  labelStyle'><label class='labelName'>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8  SelectDropId'><select id='ui_Field" + i + "' class='input-form-control'>" + options + "</select><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please select your " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
                else if (plachoderisNeeded == 2)
                    rowContent += "<div class='frminputWrap del'><div class='frmeditrow selectDropPar'><div class='form-col-4  labelStyle adCol-100'><label>" + formFieldsBindingDetails[i].Name + "</label></div><div class='form-col-8  SelectDropId adCol-100'><select id='ui_Field" + i + "' class='input-form-control'>" + options + "</select><small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please select your " + formFieldsBindingDetails[i].Name.toLowerCase() + "</small></div></div></div>";
            }
            else if (formFieldsBindingDetails[i].FieldType == 9) {

                var alignclassname = "";

                if (formDesign.RadioCheckBoxFieldsCss != null && formDesign.RadioCheckBoxFieldsCss.length > 0) {

                    var RadioCheckBoxDesignData = formDesign.RadioCheckBoxFieldsCss.split("@$@");

                    var RadioCheckBoxDesignDataFirstCss = RadioCheckBoxDesignData[0];

                    RadioCheckBoxDesignDataFirstCss = RadioCheckBoxDesignDataFirstCss.split(";");

                    if (RadioCheckBoxDesignDataFirstCss[0].indexOf("justify-content") > -1) {
                        var TextAlign = RadioCheckBoxDesignDataFirstCss[0].split(":")[1];

                        if (TextAlign != null && TextAlign != "" && TextAlign != undefined && TextAlign.length > 0) {
                            if (TextAlign == "left")
                                alignclassname = "";
                            else if (TextAlign == "center")
                                alignclassname = "chkbxradialigncenter";
                            else if (TextAlign == "right")
                                alignclassname = "chkbxradialignright";
                        }
                        else {
                            alignclassname = "";
                        }
                    }
                }

                var options = "";
                var subFieldList = formFieldsBindingDetails[i].SubFields.split(",");

                var labelclassname = "";

                if (formFieldsBindingDetails[i].FieldShowOrHide) {
                    labelclassname = "hideradiolbl";
                }

                var ClassName = "inline-check";
                var placeholderClassName = "";

                if (formFieldsBindingDetails[i].FieldDisplay != undefined && formFieldsBindingDetails[i].FieldDisplay != null && formFieldsBindingDetails[i].FieldDisplay != "" && formFieldsBindingDetails[i].FieldDisplay.length > 0) {
                    if (formFieldsBindingDetails[i].FieldDisplay == "Vertical") {
                        ClassName = "";
                    }
                }

                for (var j = 0; j < subFieldList.length; j++)
                    options += "<div class='radio-container " + ClassName + "'><input type='radio' class='input-check checkId' id='ui_rad" + j + "' value='" + subFieldList[j] + "' name='ui_Field" + i + "'><label for='ui_rad" + j + "' class='label-check'>" + subFieldList[j] + "</label></div>";

                if (plachoderisNeeded == 1 || plachoderisNeeded == 2) {
                    placeholderClassName = "adCol-100";
                }

                rowContent += "<div class='form-radio-wrapee del'><div class='frmeditrow labelTopBot'><div class='form-col-4  w-100 " + placeholderClassName + "'><div class='labelWrap labelWrapradio " + labelclassname + "'><label>" + formFieldsBindingDetails[i].Name + "</label></div></div><div class='form-col-8  w-100 addradioBtn " + placeholderClassName + " " + alignclassname + "'>" + options + "<small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please check the " + formFieldsBindingDetails[i].Name.toLowerCase() + " field</small></div></div></div>";
            }
            else if (formFieldsBindingDetails[i].FieldType == 10) {

                var alignclassname = "";

                if (formDesign.RadioCheckBoxFieldsCss != null && formDesign.RadioCheckBoxFieldsCss.length > 0) {

                    var RadioCheckBoxDesignData = formDesign.RadioCheckBoxFieldsCss.split("@$@");

                    var RadioCheckBoxDesignDataFirstCss = RadioCheckBoxDesignData[0];

                    RadioCheckBoxDesignDataFirstCss = RadioCheckBoxDesignDataFirstCss.split(";");

                    if (RadioCheckBoxDesignDataFirstCss[0].indexOf("justify-content") > -1) {
                        var TextAlign = RadioCheckBoxDesignDataFirstCss[0].split(":")[1];

                        if (TextAlign != null && TextAlign != "" && TextAlign != undefined && TextAlign.length > 0) {
                            if (TextAlign == "left")
                                alignclassname = "";
                            else if (TextAlign == "center")
                                alignclassname = "chkbxradialigncenter";
                            else if (TextAlign == "right")
                                alignclassname = "chkbxradialignright";
                        }
                        else {
                            alignclassname = "";
                        }
                    }
                }

                var labelclassname = "";

                if (formFieldsBindingDetails[i].FieldShowOrHide) {
                    labelclassname = "hidecheckbxlbl";
                }

                var ClassName = "inline-check";
                var placeholderClassName = "";

                if (formFieldsBindingDetails[i].FieldDisplay != undefined && formFieldsBindingDetails[i].FieldDisplay != null && formFieldsBindingDetails[i].FieldDisplay != "" && formFieldsBindingDetails[i].FieldDisplay.length > 0) {
                    if (formFieldsBindingDetails[i].FieldDisplay == "Vertical") {
                        ClassName = "";
                    }
                }

                if (plachoderisNeeded == 1 || plachoderisNeeded == 2) {
                    placeholderClassName = "adCol-100";
                }

                var options = "";
                var subFieldList = formFieldsBindingDetails[i].SubFields.split(",");
                for (var j = 0; j < subFieldList.length; j++)
                    options += "<div class='check-container " + ClassName + "'><input type='checkbox' class='input-check checkId' name='ui_Field" + i + "' id='ui_Field" + i + "_chk" + j + "' value='" + subFieldList[j] + "'><label for='ui_Field" + i + "_chk" + j + "' class='label-check'>" + subFieldList[j] + "</label></div>"

                rowContent += "<div class='form-check-wrapee del'><div class='frmeditrow labelTopBot'><div class='form-col-4  w-100 " + placeholderClassName + "'><div class='labelWrap labelWrapcheck " + labelclassname + "'><label>" + formFieldsBindingDetails[i].Name + "</label></div></div><div class='form-col-8  w-100 addcheckbox " + placeholderClassName + " " + alignclassname + "'>" + options + "<small id='uilblError" + i + "' class='frmvaliderr' style='display:none;'>Please check the " + formFieldsBindingDetails[i].Name.toLowerCase() + " field</small></div></div></div>";
            }
            else if (formFieldsBindingDetails[i].FieldType == 24) {
                if (formBasicDetails.ButtonPxOrPer)
                    rowContent += "<div id='submitWrap' class='btnWrapee del'><div id='btnRow' class='frmeditrow parSubBtn'><div class='childSubBtn btn-100'>" + submitButton("ui_btnSave", '' + formFieldsBindingDetails[i].Name + '') + "</div></div></div>";
                else
                    rowContent += "<div id='submitWrap' class='btnWrapee del'><div id='btnRow' class='frmeditrow parSubBtn'><div class='childSubBtn'>" + submitButton("ui_btnSave", '' + formFieldsBindingDetails[i].Name + '') + "</div></div></div>";
            }
            else if (formFieldsBindingDetails[i].FieldType == 25) {

                var classname = "";
                if (formFieldsBindingDetails[i].FieldShowOrHide)
                    classname = "hideTitTxt";

                rowContent += "<div id='formTitle' class='formTitle del editor " + classname + "'><h1 class='headTitOne' id='formHeadOne'>" + formFieldsBindingDetails[i].Name + "</h1></div>";
            }
            else if (formFieldsBindingDetails[i].FieldType == 26) {

                var classname = "";
                if (formFieldsBindingDetails[i].FieldShowOrHide)
                    classname = "hideDesTxt";

                rowContent += "<div id='formDescript' class='formDescriptwrp del " + classname + "'><h4 class='formDescripTxt' id='desCripText'>" + formFieldsBindingDetails[i].Name + "</h4></div>";
            }
            else if (formFieldsBindingDetails[i].FieldType == 27) {
                if (formDesign.IsBannerImageHidden)
                    imagerowcontent += "<div id='formBanBg' class='bgWrap bgAppend hidebanmob del'><img id='bgimg' src='" + formFieldsBindingDetails[i].Name + "'/></div>";
                else if (!formDesign.IsBannerImageHidden)
                    imagerowcontent += "<div id='formBanBg' class='bgWrap bgAppend del'><img id='bgimg' src='" + formFieldsBindingDetails[i].Name + "'/></div>";
            }
        }
        else if (formFieldsBindingDetails[i].FormLayoutOrder == 2) {

            var FieldOneDetails = formFieldsBindingDetails[i];
            var FieldTwoDetails = formFieldsBindingDetails[i + 1];

            var FirstContent = "";
            var SecondContent = "";

            if (FieldOneDetails.FieldType == 1 || FieldOneDetails.FieldType == 2 || FieldOneDetails.FieldType == 3 || FieldOneDetails.FieldType == 5 || FieldOneDetails.FieldType == 6 || FieldOneDetails.FieldType == 21 || FieldOneDetails.FieldType == 22 || FieldOneDetails.FieldType == 23) {
                if (plachoderisNeeded == 1)
                    FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div id="ui_dvplaceholder' + i + '" class="form-col-4 form-mb-col-12 labelStyle adCol-100 lblAlignPlaceholder" style="display:flex;"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><input autocomplete="off" id="ui_Field' + i + '" type="text" class="input-form-control txtBx"/><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
                else if (plachoderisNeeded == 0)
                    FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div class="form-col-4 form-mb-col-12 labelStyle lblAlignCheck"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox"><input autocomplete="off" id="ui_Field' + i + '" type="text" class="input-form-control txtBx"/><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
                else if (plachoderisNeeded == 2)
                    FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div class="form-col-4 form-mb-col-12 labelStyle lblAlignCheck adCol-100"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><input autocomplete="off" id="ui_Field' + i + '" type="text" class="input-form-control txtBx" /><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
            }
            else if (FieldOneDetails.FieldType == 4) {

                var ClassName = "";

                if (FieldOneDetails.CalendarDisplayType == 0)
                    ClassName = " calender";
                else if (FieldOneDetails.CalendarDisplayType == 1)
                    ClassName = " calenderWithoutPastDates";
                else if (FieldOneDetails.CalendarDisplayType == 2)
                    ClassName = " calenderWithoutFutureDates";

                if (plachoderisNeeded == 1)
                    FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div id="ui_dvplaceholder' + i + '" class="form-col-4 form-mb-col-12 labelStyle adCol-100 lblAlignPlaceholder" style="display:flex;"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><input autocomplete="off" id="ui_Field' + i + '" type="text" class="input-form-control txtBx calender"/><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
                else if (plachoderisNeeded == 0)
                    FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div class="form-col-4 form-mb-col-12 labelStyle lblAlignCheck"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox"><input autocomplete="off" id="ui_Field' + i + '" type="text" class="input-form-control txtBx calender"/><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
                else if (plachoderisNeeded == 2)
                    FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div class="form-col-4 form-mb-col-12 labelStyle lblAlignCheck adCol-100"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><input autocomplete="off" id="ui_Field' + i + '" type="text" class="input-form-control txtBx calender" /><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
            }
            else if (FieldOneDetails.FieldType == 7) {
                if (plachoderisNeeded == 1)
                    FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div id="ui_dvplaceholder' + i + '" class="form-col-4 form-mb-col-12 labelStyle adCol-100 lblAlignPlaceholder" style="display:flex;"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><textarea id="ui_Field' + i + '" class="input-form-control txtBx"></textarea><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
                else if (plachoderisNeeded == 0)
                    FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div class="form-col-4 form-mb-col-12 labelStyle lblAlignCheck"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox"><textarea id="ui_Field' + i + '" class="input-form-control txtBx"></textarea><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
                else if (plachoderisNeeded == 2)
                    FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div class="form-col-4 form-mb-col-12 labelStyle lblAlignCheck adCol-100"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><textarea id="ui_Field' + i + '" class="input-form-control txtBx"></textarea><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
            }
            else if (FieldOneDetails.FieldType == 8) {

                var options = "";

                if (plachoderisNeeded != 1)
                    options = "<option value='0'>Select</option>";
                else
                    options = "<option value='0'>Select " + FieldOneDetails.Name + "</option>";

                if (FieldOneDetails.RelationField == 0) {
                    var subFieldList = FieldOneDetails.SubFields.split(",");
                    for (var j = 0; j < subFieldList.length; j++)
                        options += "<option value='" + subFieldList[j] + "'>" + subFieldList[j] + "</option>"
                }

                if (plachoderisNeeded == 1)
                    FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div id="ui_dvplaceholder' + i + '" class="form-col-4 form-mb-col-12 labelStyle adCol-100 lblAlignPlaceholder" style="display: none;"><label></label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><select id="ui_Field' + i + '" class="input-form-control txtBx">' + options + '</select><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
                else if (plachoderisNeeded == 0)
                    FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div class="form-col-4 form-mb-col-12 labelStyle" style="display: flex;"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox"><select id="ui_Field' + i + '" class="input-form-control txtBx">' + options + '</select><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
                else if (plachoderisNeeded == 2)
                    FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div class="form-col-4 form-mb-col-12 labelStyle adCol-100" style="display: flex;"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><select id="ui_Field' + i + '" class="input-form-control txtBx">' + options + '</select><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
            }
            else if (FieldOneDetails.FieldType == 9) {

                var options = "";
                var subFieldList = FieldOneDetails.SubFields.split(",");

                var ClassName = "inline-check";
                var placeholderClassName = "";

                if (FieldOneDetails.FieldDisplay != undefined && FieldOneDetails.FieldDisplay != null && FieldOneDetails.FieldDisplay != "" && FieldOneDetails.FieldDisplay.length > 0) {
                    if (FieldOneDetails.FieldDisplay == "Vertical") {
                        ClassName = "";
                    }
                }

                for (var j = 0; j < subFieldList.length; j++)
                    options += "<div class='radio-container " + ClassName + "'><input type='radio' class='input-check checkId' id='ui_rad" + j + "' value='" + subFieldList[j] + "' name='ui_Field" + i + "'><label for='ui_rad" + j + "' class='label-check'>" + subFieldList[j] + "</label></div>";

                if (plachoderisNeeded == 1 || plachoderisNeeded == 2) {
                    placeholderClassName = "adCol-100";
                }

                FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div class="form-col-4 form-mb-col-12 labelStyle ' + placeholderClassName + '"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox ' + placeholderClassName + '">' + options + '<small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div >'
            }
            else if (FieldOneDetails.FieldType == 10) {
                var ClassName = "inline-check";
                var placeholderClassName = "";

                if (FieldOneDetails.FieldDisplay != undefined && FieldOneDetails.FieldDisplay != null && FieldOneDetails.FieldDisplay != "" && FieldOneDetails.FieldDisplay.length > 0) {
                    if (FieldOneDetails.FieldDisplay == "Vertical") {
                        ClassName = "";
                    }
                }

                if (plachoderisNeeded == 1 || plachoderisNeeded == 2) {
                    placeholderClassName = "adCol-100";
                }

                var options = "";
                var subFieldList = FieldOneDetails.SubFields.split(",");
                for (var j = 0; j < subFieldList.length; j++)
                    options += "<div class='check-container " + ClassName + "'><input type='checkbox' class='input-check checkId' name='ui_Field" + i + "' id='ui_Field" + i + "_chk" + j + "' value='" + subFieldList[j] + "'><label for='ui_Field" + i + "_chk" + j + "' class='label-check'>" + subFieldList[j] + "</label></div>"

                FirstContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow positionRel parName"><div class="form-col-4 form-mb-col-12 labelStyle ' + placeholderClassName + '"><label>' + FieldOneDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox ' + placeholderClassName + '">' + options + '<small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldOneDetails.Name.toLowerCase() + '</small></div></div></div>'
            }

            //this is for second content binding-----------------

            if (FieldTwoDetails.FieldType == 1 || FieldTwoDetails.FieldType == 2 || FieldTwoDetails.FieldType == 3 || FieldTwoDetails.FieldType == 5 || FieldTwoDetails.FieldType == 6 || FieldTwoDetails.FieldType == 21 || FieldTwoDetails.FieldType == 22 || FieldTwoDetails.FieldType == 23) {
                if (plachoderisNeeded == 1)
                    SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div id="ui_dvplaceholder' + (i + 1) + '" class="form-col-4 form-mb-col-12 labelStyle adCol-100 lblAlignPlaceholder" style="display:flex;"><label>' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><input id="ui_Field' + (i + 1) + '" type="text" class="input-form-control txtBx"/><small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
                else if (plachoderisNeeded == 0)
                    SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div class="form-col-4 form-mb-col-12 labelStyle"><label>' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox"><input id="ui_Field' + (i + 1) + '" type="text" class="input-form-control txtBx" /><small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
                else if (plachoderisNeeded == 2)
                    SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div class="form-col-4 form-mb-col-12 labelStyle adCol-100"><label>' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><input id="ui_Field' + (i + 1) + '" type="text" class="input-form-control txtBx" /><small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
            }
            else if (FieldTwoDetails.FieldType == 4) {
                if (plachoderisNeeded == 1)
                    SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div id="ui_dvplaceholder' + (i + 1) + '" class="form-col-4 form-mb-col-12 labelStyle adCol-100 lblAlignPlaceholder" style="display:flex;"><label>' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><input id="ui_Field' + (i + 1) + '" type="text" class="input-form-control txtBx calender"/><small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
                else if (plachoderisNeeded == 0)
                    SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div class="form-col-4 form-mb-col-12 labelStyle"><label>' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox"><input id="ui_Field' + (i + 1) + '" type="text" class="input-form-control txtBx calender" /><small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
                else if (plachoderisNeeded == 2)
                    SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div class="form-col-4 form-mb-col-12 labelStyle adCol-100"><label>' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><input id="ui_Field' + (i + 1) + '" type="text" class="input-form-control txtBx calender" /><small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
            }
            else if (FieldTwoDetails.FieldType == 7) {
                if (plachoderisNeeded == 1)
                    SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div id="ui_dvplaceholder' + (i + 1) + '" class="form-col-4 form-mb-col-12 labelStyle adCol-100 lblAlignPlaceholder" style="display:flex;"><label>' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><textarea id="ui_Field' + (i + 1) + '" class="input-form-control txtBx"></textarea><small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
                else if (plachoderisNeeded == 0)
                    SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div class="form-col-4 form-mb-col-12 labelStyle"><label>' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox"><textarea id="ui_Field' + (i + 1) + '" class="input-form-control txtBx"></textarea><small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
                else if (plachoderisNeeded == 2)
                    SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div class="form-col-4 form-mb-col-12 labelStyle adCol-100"><label>' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><textarea id="ui_Field' + (i + 1) + '" class="input-form-control txtBx"></textarea><small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
            }
            else if (FieldTwoDetails.FieldType == 8) {

                var options = "";

                if (plachoderisNeeded != 1)
                    options = "<option value='0'>Select</option>";
                else
                    options = "<option value='0'>Select " + FieldTwoDetails.Name + "</option>";

                if (FieldTwoDetails.RelationField == 0) {
                    var subFieldList = FieldTwoDetails.SubFields.split(",");
                    for (var j = 0; j < subFieldList.length; j++)
                        options += "<option value='" + subFieldList[j] + "'>" + subFieldList[j] + "</option>"
                }

                if (plachoderisNeeded == 1)
                    SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div id="ui_dvplaceholder' + (i + 1) + '" class="form-col-4 form-mb-col-12 labelStyle adCol-100 lblAlignPlaceholder" style="display: none;"><label></label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><select id="ui_Field' + i + '" class="input-form-control txtBx">' + options + '</select><small id="uilblError' + (i + 1) + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
                else if (plachoderisNeeded == 0)
                    SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div class="form-col-4 form-mb-col-12 labelStyle" style="display: flex;"><label style="display: block;">' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox"><select id="ui_Field' + i + '" class="input-form-control txtBx">' + options + '</select><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
                else if (plachoderisNeeded == 2)
                    SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div class="form-col-4 form-mb-col-12 labelStyle adCol-100" style="display: flex;"><label style="display: block;">' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox adCol-100"><select id="ui_Field' + i + '" class="input-form-control txtBx">' + options + '</select><small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
            }
            else if (FieldTwoDetails.FieldType == 9) {

                var options = "";
                var subFieldList = FieldTwoDetails.SubFields.split(",");

                var ClassName = "inline-check";
                var placeholderClassName = "";

                if (FieldTwoDetails.FieldDisplay != undefined && FieldTwoDetails.FieldDisplay != null && FieldTwoDetails.FieldDisplay != "" && FieldTwoDetails.FieldDisplay.length > 0) {
                    if (FieldTwoDetails.FieldDisplay == "Vertical") {
                        ClassName = "";
                    }
                }

                for (var j = 0; j < subFieldList.length; j++)
                    options += "<div class='radio-container " + ClassName + "'><input type='radio' class='input-check checkId' id='ui_rad" + j + "' value='" + subFieldList[j] + "' name='ui_Field" + i + "'><label for='ui_rad" + j + "' class='label-check'>" + subFieldList[j] + "</label></div>";

                if (plachoderisNeeded == 1 || plachoderisNeeded == 2) {
                    placeholderClassName = "adCol-100";
                }

                SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div class="form-col-4 form-mb-col-12 labelStyle ' + placeholderClassName + '"><label>' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox ' + placeholderClassName + '">' + options + '<small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
            }
            else if (FieldTwoDetails.FieldType == 10) {
                var ClassName = "inline-check";
                var placeholderClassName = "";

                if (FieldTwoDetails.FieldDisplay != undefined && FieldTwoDetails.FieldDisplay != null && FieldTwoDetails.FieldDisplay != "" && FieldTwoDetails.FieldDisplay.length > 0) {
                    if (FieldTwoDetails.FieldDisplay == "Vertical") {
                        ClassName = "";
                    }
                }

                if (plachoderisNeeded == 1 || plachoderisNeeded == 2) {
                    placeholderClassName = "adCol-100";
                }

                var options = "";
                var subFieldList = FieldTwoDetails.SubFields.split(",");
                for (var j = 0; j < subFieldList.length; j++)
                    options += "<div class='check-container " + ClassName + "'><input type='checkbox' class='input-check checkId' name='ui_Field" + i + "' id='ui_Field" + i + "_chk" + j + "' value='" + subFieldList[j] + "'><label for='ui_Field" + i + "_chk" + j + "' class='label-check'>" + subFieldList[j] + "</label></div>"

                SecondContent += '<div class="form-col-6 form-mb-col-12"><div class="frmeditrow parName"><div class="form-col-4 form-mb-col-12 labelStyle ' + placeholderClassName + '"><label>' + FieldTwoDetails.Name + '</label></div><div class="form-col-8 form-mb-col-12 editDblTextBox ' + placeholderClassName + '">' + options + '<small id="uilblError' + i + '" class="frmvaliderr" style="display: none;">Please enter your ' + FieldTwoDetails.Name.toLowerCase() + '</small></div></div></div>'
            }

            rowContent += '<div class="frmeditrow del doubleWrap positionRel padTopBot">' + FirstContent + '' + SecondContent + '</div>'
            i = i + 1;
        }
    }

    if (formDesign.ThankYouMessage != null && formDesign.ThankYouMessage.length > 0)
        rowContent += "<div id='lbldivthankyou_" + formDesign.Id + "' class='frmthankwrp' style='display:none'><div class='succwrp'><p id='ui_lblThankYouSuccErrIcon_" + formDesign.Id + "'><i class='icon ion-ios-checkmark-outline'></i></p><p id='ui_lblThankYou_" + formDesign.Id + "'>" + formDesign.ThankYouMessage + "</p></div></div>";
    else
        rowContent += "<div id='lbldivthankyou_" + formDesign.Id + "' class='frmthankwrp' style='display:none'><div class='succwrp'><p id='ui_lblThankYouSuccErrIcon_" + formDesign.Id + "'><i class='icon ion-ios-checkmark-outline'></i></p><p id='ui_lblThankYou_" + formDesign.Id + "'>Thank you for showing interest with us.</p></div></div>";

    var imagealignmentclassname = "";
    if (formDesign.ImageAppearanceAlignment != null && formDesign.ImageAppearanceAlignment != "" && formDesign.ImageAppearanceAlignment.length > 0) {
        if (formDesign.ImageAppearanceAlignment == "top") {
            imagealignmentclassname = "";
        }
        else if (formDesign.ImageAppearanceAlignment == "left") {
            imagealignmentclassname = "formlayoutRow";
        }
        else if (formDesign.ImageAppearanceAlignment == "right") {
            imagealignmentclassname = "formlayoutRowrevrse";
        }
        else if (formDesign.ImageAppearanceAlignment == "bottom") {
            imagealignmentclassname = "formlayoutColrevrse";
        }
        else if (formDesign.ImageAppearanceAlignment == "leftbgimg") {
            imagealignmentclassname = "lftrghtewid";

            if (innerDoc != undefined) {
                innerDoc.getElementById("dvMainContentDiv").className += " df-jc-fstart";
            }
        }
        else if (formDesign.ImageAppearanceAlignment == "rightbgimg") {
            imagealignmentclassname = "lftrghtewid";

            if (innerDoc != undefined) {
                innerDoc.getElementById("dvMainContentDiv").className += " df-jc-fend";
            }
        }
    }

    var div = getDiv("");

    if (imagealignmentclassname != "lftrghtewid") {
        div.style.width = "100%";
    }

    div.className = "frmlayoutwrap " + imagealignmentclassname + "";
    rowContent = "<div class='frmfeildwrap'>" + rowContent + "</div>";
    div.innerHTML = imagerowcontent + rowContent;

    var IframeElement = document.getElementById(iframeid);
    var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

    if (innerDoc != undefined) {
        innerDoc.getElementById("dvMainContentDiv").appendChild(div);
    }

    if (innerDoc != undefined) {
        var alldivs = innerDoc.querySelectorAll(".lblAlignPlaceholder");
        var allinputs = innerDoc.querySelectorAll(".input-form-control");

        if (alldivs != null && alldivs.length > 0) {
            for (index = 0; index < alldivs.length; ++index) {
                innerDoc.querySelector("#" + alldivs[index].id + "", parent.window.document).addEventListener("click", function (event) {
                    hideoption(iframeid, event.currentTarget.id, event.currentTarget.nextSibling.firstChild.id);
                });
            }
        }

        if (allinputs != null && allinputs.length > 0) {
            for (index = 0; index < allinputs.length; ++index) {

                innerDoc.querySelector("#" + allinputs[index].id + "", parent.window.document).addEventListener("blur", function (event) {
                    myBlurFunction(iframeid, event.currentTarget.id);
                });

                innerDoc.querySelector("#" + allinputs[index].id + "", parent.window.document).addEventListener("focus", function (event) {
                    myFocusFunction(iframeid, event.currentTarget.id);
                });
            }
        }
    }
}

function submitButton(tagId, SubmitButtonValue) {
    if (formBasicDetails.ButtonPxOrPer)
        return "<button type='submit' class='btn-style savebtn btn-100' id='" + tagId + "'>" + SubmitButtonValue + "</button>";
    else
        return "<button type='submit' class='btn-style savebtn' id='" + tagId + "'>" + SubmitButtonValue + "</button>";
}

function hideoption(iframeid, divid, fieldid) {
    var IframeElement = document.getElementById(iframeid);
    var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

    if (innerDoc != undefined) {
        innerDoc.getElementById(divid).style.display = 'none';
        innerDoc.getElementById(fieldid).focus();
    }
}

function myBlurFunction(iframeid, divid) {
    var IframeElement = document.getElementById(iframeid);
    var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

    if (innerDoc != undefined) {
        var dvvalue = divid.substring(8);
        innerDoc.getElementById("ui_dvplaceholder" + dvvalue + "").style.display = 'flex';
    }
}

function myFocusFunction(iframeid, divid) {

    var IframeElement = document.getElementById(iframeid);
    var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

    if (innerDoc != undefined) {
        var dvvalue = divid.substring(8);
        innerDoc.getElementById("ui_dvplaceholder" + dvvalue + "").style.display = 'none';
    }
}

function appendCloseButton(IframeId) {

    var IframeElement = document.getElementById(IframeId);
    var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

    if (innerDoc != undefined) {

        var closeMinimiseMainDiv = document.createElement("div", "");
        closeMinimiseMainDiv.className = "clsminimsewrp showflex";

        if (formDesign != null && formDesign.CloseAlignmentSetting != null && formDesign.CloseAlignmentSetting != "" && formDesign.CloseAlignmentSetting == "clsleft") {
            closeMinimiseMainDiv.className = "clsminimsewrp clsleftalign showflex";
        }

        //Minimise button

        if (formDesign != null && formDesign.IsMinimiseButton == 1 && formDesign.MinimiseCss != "" && formDesign.MinimiseCss != null && formDesign.MinimiseCss.length > 0) {
            var minimiseButtonDiv = document.createElement("div", "");

            var minimiseclassname = "minimsebtnwrp";

            if (formDesign != null && formDesign.CloseDesignType != null && formDesign.CloseDesignType != "" && formDesign.CloseDesignType == "round") {
                minimiseclassname = "minimsebtnwrp clsRound";
            }

            if (formDesign != null && formDesign.CloseAlignmentSetting != null && formDesign.CloseAlignmentSetting != "" && formDesign.CloseAlignmentSetting == "clsleft") {
                if (formDesign != null && formDesign.CloseDesignType != null && formDesign.CloseDesignType != "" && formDesign.CloseDesignType == "round") {
                    minimiseclassname = "minimsebtnwrp clsRound";
                }
                else if (formDesign != null && formDesign.CloseDesignType != null && formDesign.CloseDesignType != "" && formDesign.CloseDesignType == "square") {
                    minimiseclassname = "minimsebtnwrp";
                }
            }

            minimiseButtonDiv.className = minimiseclassname;
            minimiseButtonDiv.title = "Minimise";
            minimiseButtonDiv.style.cursor = "pointer";
            minimiseButtonDiv.innerHTML = "<i class='fas fa-minus' id='btnplusminus'></i>";
            minimiseButtonDiv.onclick = function () { minimiseCaptureFormDiv(IframeId); };
            closeMinimiseMainDiv.appendChild(minimiseButtonDiv);
        }

        var closeButtonDiv = document.createElement("div", "");

        var classname = "clsWrap";

        if (formDesign != null && formDesign.CloseDesignType != null && formDesign.CloseDesignType != "" && formDesign.CloseDesignType == "round") {
            classname = "clsWrap clsRound";
        }

        if (formDesign != null && formDesign.CloseAlignmentSetting != null && formDesign.CloseAlignmentSetting != "" && formDesign.CloseAlignmentSetting == "clsleft") {
            if (formDesign != null && formDesign.CloseDesignType != null && formDesign.CloseDesignType != "" && formDesign.CloseDesignType == "round") {
                classname = "clsWrap clsRound";
            }
            else if (formDesign != null && formDesign.CloseDesignType != null && formDesign.CloseDesignType != "" && formDesign.CloseDesignType == "square") {
                classname = "clsWrap";
            }
        }

        closeButtonDiv.className = classname;
        closeButtonDiv.title = "Close";
        closeButtonDiv.style.cursor = "pointer";
        closeButtonDiv.innerHTML = "<i class='fas fa-times'></i>";
        closeButtonDiv.id = "dvCloseBtn";
        closeButtonDiv.onclick = function () { FormUtil.removeCaptureFormDiv(IframeId); };
        closeMinimiseMainDiv.appendChild(closeButtonDiv);
        innerDoc.getElementById("dvMainContentDiv").appendChild(closeMinimiseMainDiv);
    }
}

function minimiseCaptureFormDiv(IframeId) {

    var IframeElement = document.getElementById(IframeId);
    var innerDoc = IframeElement.contentDocument || IframeElement.contentWindow.document;

    if (innerDoc != undefined) {
        if (innerDoc.getElementById("btnplusminus").classList.contains('fa-minus')) {
            var formmaincontent = innerDoc.getElementById("dvMainContentDiv");
            formmaincontent.classList.add("h-auto");

            innerDoc.body.style.backgroundColor = "";

            var testarray = innerDoc.getElementsByClassName("frminputWrap");
            for (var i = 0; i < testarray.length; i++) {
                testarray[i].className += " hideDiv";
            }

            var testarray = innerDoc.getElementsByClassName("doubleWrap");
            for (var i = 0; i < testarray.length; i++) {
                testarray[i].className += " hideDiv";
            }

            var testarray = innerDoc.getElementsByClassName("bgWrap");
            for (var i = 0; i < testarray.length; i++) {
                testarray[i].className += " hideDiv";
            }

            var testarray = innerDoc.getElementsByClassName("form-radio-wrapee");
            for (var i = 0; i < testarray.length; i++) {
                testarray[i].className += " hideDiv";
            }

            var testarray = innerDoc.getElementsByClassName("form-check-wrapee");
            for (var i = 0; i < testarray.length; i++) {
                testarray[i].className += " hideDiv";
            }

            var testarray = innerDoc.getElementsByClassName("btnWrapee");
            for (var i = 0; i < testarray.length; i++) {
                testarray[i].className += " hideDiv";
            }

            var testarray = innerDoc.getElementsByClassName("frmthankwrp");
            for (var i = 0; i < testarray.length; i++) {
                testarray[i].className += " hideDiv";
            }

            var testarray = innerDoc.getElementsByClassName("dvbannerimg");
            for (var i = 0; i < testarray.length; i++) {
                testarray[i].className += " hideDiv";
            }

            var testarray = innerDoc.getElementsByClassName("dvvideocontent");
            for (var i = 0; i < testarray.length; i++) {
                testarray[i].className += " hideDiv";
            }

            var testarray = innerDoc.getElementsByClassName("dviframecontent");
            for (var i = 0; i < testarray.length; i++) {
                testarray[i].className += " hideDiv";
            }

            var testarray = innerDoc.getElementsByClassName("dvhtmlcontent");
            for (var i = 0; i < testarray.length; i++) {
                testarray[i].className += " hideDiv";
            }

            var ielement = innerDoc.getElementById("btnplusminus");
            ielement.classList.remove("fa-minus");
            ielement.classList.add("fa-plus");
        }
        else {
            var formmaincontent = innerDoc.getElementById("dvMainContentDiv");
            formmaincontent.classList.remove("h-auto");

            //var formdetailscontent = innerDoc.getElementById("dvFormDetails");
            //formdetailscontent.classList.remove("hideDiv");

            var testarray = innerDoc.getElementsByClassName("frminputWrap");
            for (var i = 0; i < testarray.length; i++) {
                testarray[i].classList.remove("hideDiv");
            }

            var testarray = innerDoc.getElementsByClassName("doubleWrap");
            for (var i = 0; i < testarray.length; i++) {
                testarray[i].classList.remove("hideDiv");
            }

            var testarray = innerDoc.getElementsByClassName("bgWrap");
            for (var i = 0; i < testarray.length; i++) {
                testarray[i].classList.remove("hideDiv");
            }

            var testarray = innerDoc.getElementsByClassName("form-radio-wrapee");
            for (var i = 0; i < testarray.length; i++) {
                testarray[i].classList.remove("hideDiv");
            }

            var testarray = innerDoc.getElementsByClassName("form-check-wrapee");
            for (var i = 0; i < testarray.length; i++) {
                testarray[i].classList.remove("hideDiv");
            }

            var testarray = innerDoc.getElementsByClassName("btnWrapee");
            for (var i = 0; i < testarray.length; i++) {
                testarray[i].classList.remove("hideDiv");
            }

            var testarray = innerDoc.getElementsByClassName("frmthankwrp");
            for (var i = 0; i < testarray.length; i++) {
                testarray[i].classList.remove("hideDiv");
            }

            var testarray = innerDoc.getElementsByClassName("dvbannerimg");
            for (var i = 0; i < testarray.length; i++) {
                testarray[i].classList.remove("hideDiv");
            }

            var testarray = innerDoc.getElementsByClassName("dvvideocontent");
            for (var i = 0; i < testarray.length; i++) {
                testarray[i].classList.remove("hideDiv");
            }

            var testarray = innerDoc.getElementsByClassName("dviframecontent");
            for (var i = 0; i < testarray.length; i++) {
                testarray[i].classList.remove("hideDiv");
            }

            var testarray = innerDoc.getElementsByClassName("dvhtmlcontent");
            for (var i = 0; i < testarray.length; i++) {
                testarray[i].classList.remove("hideDiv");
            }

            var ielement = innerDoc.getElementById("btnplusminus");
            ielement.classList.remove("fa-plus");
            ielement.classList.add("fa-minus");
        }
    }
}

//Search text
$(".contsearchfocus")
    .on("focus", function () {
        $(this).parent().addClass("w-300");
    })
    .on("blur", function () {
        if ($(".contsearchfocus").val().length < 15)
            $(this).parent().removeClass("w-300");
    });

//Form status filter
$("#ui_ddlFormStatus").change(function () {
    $(".badgewrpfrmstatus").addClass("hideDiv");
    let checkbadglnth = $(".mgefrmfiltwrp .hideDiv").length;
    if (checkbadglnth == 2) {
        $(".subdivWrap-one").removeClass("df-flex-end");
    }
    if ($("#ui_ddlFormStatus").val() != "-1") {
        let filtfrmstatusval = $("#ui_ddlFormStatus option:selected").text();
        $(".subdivWrap-one").addClass("df-flex-end");
        $(".badgewrpfrmstatus").removeClass("hideDiv");
        $(".frmfilstatus").text(filtfrmstatusval);
    }
    OffSet = 0;
    ShowPageLoading();
    MaxCount();
});

//Form type filter
$("#ui_ddlFormType").change(function () {
    $(".badgewrpfrmtype").addClass("hideDiv");
    let checkbadglnth = $(".mgefrmfiltwrp .hideDiv").length;
    if (checkbadglnth == 2) {
        $(".subdivWrap-one").removeClass("df-flex-end");
    }
    if ($("#ui_ddlFormType").val() != "0") {
        let filtfrmtypeval = $("#ui_ddlFormType option:selected").text();
        $(".subdivWrap-one").addClass("df-flex-end");
        $(".badgewrpfrmtype").removeClass("hideDiv");
        $(".frmfilstype").text(filtfrmtypeval);
    }
    OffSet = 0;
    ShowPageLoading();
    MaxCount();
});

//close filter

$("#ui_formstatusclose").click(function () {
    let checkbadglnth = $(".mgefrmfiltwrp .hideDiv").length;
    if (checkbadglnth == 1) {
        $(".subdivWrap-one").removeClass("df-flex-end");
    }
    $("#ui_ddlFormStatus").val("-1").change();
});

$("#ui_formtypeclose").click(function () {
    let checkbadglnth = $(".mgefrmfiltwrp .hideDiv").length;
    if (checkbadglnth == 1) {
        $(".subdivWrap-one").removeClass("df-flex-end");
    }
    $("#ui_ddlFormType").val("0").change();
});

function PreviewSupport(message) {
    var matches = message.match(/\[\{\*(.*?)\*\}\]/g);

    if (matches != null) {
        for (i = 0; i < matches.length; i++) {
            var id = matches[i].replace("[{*", "").replace("*}]", "");
            var isnum = /^\d+$/.test(id);
            if (isnum && JSLINQ(templateUrlsList).Any(function (P) { return P.Id == id })) {
                message = message.replace(matches[i], `${SMSCLICKURL}bl-`);
            }
            else {
                message = message.replace(matches[i], "xxxxxxxxxxxxxx");
            }

        }
    }
    var matchescstevents = message.match(/\{{.*?}\}/gi);

    if (matchescstevents != null) {
        for (i = 0; i < matchescstevents.length; i++) {
            message = message.replace(matchescstevents[i], "xxxxxxxxxxxxxx");
        }
    }

    return message;
}