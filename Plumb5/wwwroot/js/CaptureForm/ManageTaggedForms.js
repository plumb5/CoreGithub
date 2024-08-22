var formScripts = { Id: 0, FormId: 0, FormType: 0, FormScript: "", Description: "", FormScriptType: 0, ConfigurationDetails: "", FormScriptStatus: "", PageUrl: "", AlternatePageUrls: "", FormIdentifier: "" };

$(document).ready(function () {
    ExportFunctionName = "TaggedFormsExport";
    BindOTPForms();
    InitializeCampaign();
    CallBackFunction();
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    MaxCount();
}

function CallBackPaging() {
    CurrentRowCount = 0;
    GetReport();
}

function InitializeCampaign() {
    $.ajax({
        url: "/CaptureForm/CommonDetailsForForms/GetCampaignIdentifierDetailsList",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != undefined && response != null) {
                $.each(response, function () {
                    $("#txtCampaignIdentifier").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                });
            }
        },
        error: ShowAjaxError
    });
}

function BindOTPForms() {
    $('#ddlOtpform option:not(:first)').remove();
    $.ajax({
        url: "/CaptureForm/CommonDetailsForForms/GetOTPForms",
        type: 'POST',
        data: JSON.stringify({ 'FormType': "TaggedForm" }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response, function () {
                optlist = document.createElement('option');
                optlist.value = $(this)[0].Id;
                optlist.text = $(this)[0].FormIdentifier;
                document.getElementById("ddlOtpform").options.add(optlist);
            });
        },
        error: ShowAjaxError
    });
};

function MaxCount() {
    formScripts.FormIdentifier = $("#ui_txtSearchBy").val();
    formScripts.FormScriptType = 1;
    formScripts.FormScriptStatus = null;
    if ($("#ui_ddlFormStatus").val() != "-1") {
        if ($("#ui_ddlFormStatus").val() == "true") {
            formScripts.FormScriptStatus = true;
        }
        else if ($("#ui_ddlFormStatus").val() == "false") {
            formScripts.FormScriptStatus = false;
        }
    }

    $.ajax({
        url: "/CaptureForm/ManageTaggedForms/GetMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'formScripts': formScripts }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = response;

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
        url: "/CaptureForm/ManageTaggedForms/GetAllDetails",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'formScripts': formScripts, 'OffSet': OffSet, 'FetchNext': FetchNext }),
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
            if (formidentifername.length > 25) {
                formidentifername = formidentifername.substring(0, 25) + "..";
            }

            var FormScriptstatusValue = "";

            if (this.FormScriptStatus == true)
                FormScriptstatusValue = "<td id='Status_" + this.Id + "' class='text-color-success'>Active</td>"
            else if (this.FormScriptStatus == false)
                FormScriptstatusValue = "<td id='Status_" + this.Id + "' class='text-color-error'>In-Active</td>"

            let FormHeading = this.Heading != undefined && this.Heading != null && this.Heading != "" ? this.Heading : "NA";

            reportTableTrs +=
                "<tr id='ui_div_" + this.Id + "'>" +
                "<td>" +
                "<div class='groupnamewrap'>" +
                "<div class='frmnametxt'><div class='frmidntwrp'>" +
                "<span class='wordbreak'>" + formidentifername + "</span>" +
                "<p class='frmnamenme m-0'>" + PreviewSupport(FormHeading) + "</p>" +
                "</div></div>" +
                "<div class='tdcreatedraft'>" +
                "<div class='dropdown'>" +
                "<button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='icon ion-android-more-vertical mr-0'></i></button>" +
                "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='filterbycontacts'>" +
                "<a class='dropdown-item DesignPermission' href='javascript:void(0)' onclick=\"EditConfiguration('" + this.PageUrl + "'," + this.FormId + "," + this.Id + ");\">Edit Configuration</a>" +
                "<a class='dropdown-item DesignPermission' href='javascript:void(0)' onclick='EditDetails(1," + this.FormId + ");'>Edit Form Settings</a>" +
                "<a class='dropdown-item embfrmlist ContributePermission' href='javascript:void(0)' onclick=\"ManageCampaignDetails(" + this.FormId + ",'" + this.PageUrl + "','" + this.AlternatePageUrls + "');\">Settings</a>" +
                "<a id='changeStatus_" + this.Id + "' class='dropdown-item ContributePermission' onclick='ChangeStatus(" + this.Id + ", " + this.FormScriptStatus + ");' href='javascript: void (0)'>Changes Status</a>" +
                "<a class='dropdown-item wehookresp' href='javascript:void(0);' onclick='formChatWebhookResponseUtil.GetMaxCount(" + this.FormId + ",\"" + this.FormIdentifier + "\");'>Webhook Response</a>" +
                "<div class='dropdown-divider'></div>" +
                "<a id='dv_deleteFormScript' data-toggle='modal' data-target='#deletegroups' data-formscriptid=" + this.Id + " data-grouptype='groupDelete' class='dropdown-item FullControlPermission' href='javascript:void(0)'>Delete</a>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</td>" +
                "<td>" + this.PageUrl + "</td>" +
                "" + FormScriptstatusValue + "" +
                "<td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.UpdatedDate)) + "</td>" +
                "</tr>";
        });
        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
        $('.searchCampWrap').show();
    }
    else {
        $('.searchCampWrap').hide();
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
    CheckAccessPermission("CaptureForm");
}

function EditDetails(FormType, FormId) {
    window.location.href = "/CaptureForm/Create/TaggedForm?FormType=" + FormType + "&FormId=" + FormId + "";
}

function ExtensionExists() {
    try {
        var http = new XMLHttpRequest();
        http.open('HEAD', "chrome-extension://mkilmbkdaobkmpjhjjhmhcmibneacaib/js/divinject.js", false);
        http.send();
        return http.status != 404;
    }
    catch {
        return false;
    }
}

function EditConfiguration(PageUrl, FormId, Id) {
    if (ExtensionExists())
        CallExtension(PageUrl, FormId, Id);
    else
        ShowErrorMessage(GlobalErrorList.CreateTaggedForm.ChromeExtensionNotExists);
}

function CallExtension(PageUrl, FormId, Id) {
    try {

        var editorExtensionId = "mkilmbkdaobkmpjhjjhmhcmibneacaib";

        var PageUrlDetails = document.location.origin;

        chrome.runtime.sendMessage(editorExtensionId, { AdsId: Plumb5AccountId, FormId: FormId, FormScriptId: Id, PageUrl: PageUrlDetails },
            function (response) {
                if (response != undefined) {
                    if (response.success) {
                        ShowSuccessMessage(GlobalErrorList.CreateTaggedForm.SuccessRedirectToConfiguration);
                        setTimeout(function () { window.open('' + PageUrl + '', '_blank'); }, 1000);
                    }
                    else if (!response.success) {
                        ShowErrorMessage(GlobalErrorList.CreateTaggedForm.ChromeExtensionError);
                    }
                }
                else {
                    ShowErrorMessage(GlobalErrorList.CreateTaggedForm.ChromeExtensionAppNotExists);
                }
            });
    }
    catch {
        return false;
    }
}

$("#SearchByIdentifierName").click(function () {
    ShowPageLoading();
    if ($.trim($("#ui_txtSearchBy").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.ManageTaggedForm.FormIdentiferSearch_error);
        $("#ui_txtSearchBy").focus();
        setTimeout(function () { HidePageLoading(); }, 500);
        return false;
    }
    else {
        MaxCount();
    }
});

$("#ui_txtSearchBy").keypress(function (e) {
    if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
        if (CleanText($.trim($("#ui_txtSearchBy").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.ManageTaggedForm.SearchErrorValue);
            HidePageLoading();
            return false;
        }
        ShowPageLoading();
        MaxCount();
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

    var formstatus = "";
    if (status == false)
        formstatus = 1;
    else
        formstatus = 0;

    $.ajax({
        url: "/CaptureForm/ManageTaggedForms/ToogleStatus",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': Id, 'FormScriptStatus': formstatus }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                $("#changeStatus_" + Id).removeAttr("onclick");

                if (formstatus == 1) {
                    $("#Status_" + Id).removeClass("text-color-error").addClass("text-color-success").attr("title", "toogle to inactive").html("").html("Active");
                    $("#changeStatus_" + Id).attr('onClick', 'ChangeStatus(' + Id + ', true);');
                }
                else {
                    $("#Status_" + Id).removeClass("text-color-success").addClass("text-color-error").attr("title", "toogle to active").html("").html("In-Active");
                    $("#changeStatus_" + Id).attr('onClick', 'ChangeStatus(' + Id + ', false);');
                }

                ShowSuccessMessage(GlobalErrorList.ManageTaggedForm.ToggleSuccessStatus);
            }
            else {
                ShowErrorMessage(GlobalErrorList.ManageTaggedForm.ToggleFailureStatus);
            }
        },
        error: ShowAjaxError
    });
};

var FromScriptId = 0;
$(document).on('click', "#dv_deleteFormScript", function () {
    FromScriptId = parseInt($(this).attr("data-formscriptid"));
});

$("#deleteRowConfirm").click(function () {

    $.ajax({
        url: "/CaptureForm/ManageTaggedForms/Delete",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': FromScriptId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                --CurrentRowCount;
                --TotalRowCount;
                $("#ui_div_" + FromScriptId).hide("slow");
                PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
                ShowSuccessMessage(GlobalErrorList.ManageTaggedForm.DeleteSuccessStatus);
                BindOTPForms();
                if (CurrentRowCount <= 0 || TotalRowCount <= 0) {
                    $('.searchCampWrap').hide();
                    ShowExportDiv(false);
                    ShowPagingDiv(false);
                    SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
                }
            }
            else {
                ShowErrorMessage(GlobalErrorList.ManageTaggedForm.DeleteFailureStatus);
            }
        },
        error: ShowAjaxError
    });
});

$("#ui_aCreateTaggedForm").click(function () {
    ShowPageLoading();
    $.ajax({
        url: "/ManageContact/ContactImportOverViews/CheckContactSetting/",
        type: 'POST',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != undefined && response != null && response.Status != undefined && response.Status != null && response.Status) {
                window.location.href = "/CaptureForm/Create?FormType=TaggedForm";
            }
            else {
                $('#ui_divContactSetting').modal('show');
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});

function ManageCampaignDetails(Id, PageUrl, AlternatePageUrls) {
    ShowPageLoading();
    $("#ui_txtFormUrl").val(PageUrl);
    $("#ui_txtAlternateUrl").val(AlternatePageUrls);
    $("#ui_mobileno").prop("checked", true);
    $("#ui_isemail_No").prop("checked", true);
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
                    var FormIdentifier = formDetails.FormIdentifier.length > 15 ? formDetails.FormIdentifier.substring(0, 15) + ".." : formDetails.FormIdentifier;
                    $(".embedcampname").attr('title', formDetails.FormIdentifier).html(unescape(FormIdentifier));

                    $('#txtCampaignIdentifier').val("0").change();
                    $("#txtClientCampaignIdentifier,#ui_txtblockemailids").val("");
                    $("#btnSaveCampaignDetails").removeAttr("FormId").attr("FormId", Id);

                    if (formDetails.ClientCampaignIdentifier != null && formDetails.ClientCampaignIdentifier != "" && formDetails.CampaignIdentifier != null && formDetails.CampaignIdentifier != "") {
                        $("#txtClientCampaignIdentifier").val(formDetails.ClientCampaignIdentifier);
                        $("#txtCampaignIdentifier").val(formDetails.CampaignIdentifier).change();

                        if (formDetails.IsWebOrMobileForm == 1) {
                            $("#ui_mobileyes").prop("checked", true);
                        }
                        if (formDetails.IsVerifiedEmail == 1) {
                            $("#ui_isemail_yes").prop("checked", true);
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
    var CampaignIdentiferName = $("#txtCampaignIdentifier option:selected").text();
    var CampaignIdentifer = $("#txtCampaignIdentifier").val();
    var IsWebOrMobileForm = false, IsVerifiedEmail = false;
    var BlockEmailIds = $.trim($("#ui_txtblockemailids").val());

    if ($("input[name='IsMobileForm']:checked").val() == "1") {
        IsWebOrMobileForm = true;
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

    if ($("input[name='isemail']:checked").val() == "1") {
        IsVerifiedEmail = true;
    }

    if (Id > 0) {
        UpdateAlternateUrl(Id);
    }

    if (Id > 0) {
        $.ajax({
            url: "/CaptureForm/CommonDetailsForForms/SaveOrUpdateCampaignDetails",
            type: 'POST',
            data: JSON.stringify({ 'Id': Id, 'ClientCampaignIdentifier': ClientCampaignIdentifier, 'CamapignId': CampaignIdentifer, 'CampaignIdentiferName': CampaignIdentiferName, 'IsOtpForm': IsOtpForm, 'OTPFormId': OTPFormId, 'IsWebOrMobileForm': IsWebOrMobileForm, 'OTPGenerationLimits': OTPGenerateLimit, 'OTPPageRestrictions': OTPPageRestrict, 'IsClickToCallForm': false, 'IsVerifiedEmail': IsVerifiedEmail, 'IsAutoWhatsApp': false, 'BlockEmailIds': BlockEmailIds }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage("Campaign Identifier Details saved successfully.");
                    HidePageLoading();
                    $("#dvCampaignSettings").addClass("hideDiv");
                    CallBackFunction();
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
    }
});

ValidateCampaignDetails = function () {

    if ($.trim($("#txtClientCampaignIdentifier").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.ManagePopUpForm.EnterClientCampaignIdentifer);
        return false;
    }


    if ($("#txtCampaignIdentifier option:selected").val() == undefined || $("#txtCampaignIdentifier option:selected").val() == null || $("#txtCampaignIdentifier option:selected").val() == "" || $("#txtCampaignIdentifier option:selected").val() == "0") {
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

//Search text
$(".contsearchfocus")
    .on("focus", function () {
        $(this).parent().addClass("w-300");
    })
    .on("blur", function () {
        if ($(".contsearchfocus").val().length < 15)
            $(this).parent().removeClass("w-300");
    });

function UpdateAlternateUrl(Id) {
    //var AlternateUrl = $.trim($("#ui_txtAlternateUrl").val());

    var FinalAlternatePageUrls = "";

    if ($("#ui_txtAlternateUrl").val() != null && $("#ui_txtAlternateUrl").val() != "" && $("#ui_txtAlternateUrl").val().length > 0) {
        if ($.trim($("#ui_txtAlternateUrl").val()).indexOf(",") > -1) {
            var AlternatePageUrls = $.trim($("#ui_txtAlternateUrl").val()).split(',');

            for (var i = 0; i < AlternatePageUrls.length; i++) {

                if ($.trim(AlternatePageUrls[i]) != null && $.trim(AlternatePageUrls[i]) != "" && $.trim(AlternatePageUrls[i]).length > 0) {

                    var PageUrl = "";
                    if ($.trim(AlternatePageUrls[i]).indexOf("?") > -1)
                        PageUrl = $.trim(AlternatePageUrls[i].split('?')[0].replace(/ /g, "%20"));
                    else
                        PageUrl = $.trim(AlternatePageUrls[i].replace(/ /g, "%20"));

                    var lastLettercheck = PageUrl.charAt(PageUrl.length - 1);

                    if ($.trim(lastLettercheck).indexOf("/") > -1)
                        FinalAlternatePageUrls += PageUrl.substring(0, PageUrl.length - 1) + ",";
                    else
                        FinalAlternatePageUrls += PageUrl + ",";
                }
            }

            if (FinalAlternatePageUrls != null && FinalAlternatePageUrls != "" && FinalAlternatePageUrls.length > 0)
                FinalAlternatePageUrls = FinalAlternatePageUrls.substring(0, FinalAlternatePageUrls.length - 1);
        }
        else {
            var AltPageUrl = $.trim($("#ui_txtAlternateUrl").val());

            if (AltPageUrl.indexOf("?") > -1)
                AltPageUrl = AltPageUrl.split('?')[0].replace(/ /g, "%20");
            else
                AltPageUrl = AltPageUrl.replace(/ /g, "%20");

            var lastLettercheck = AltPageUrl.charAt(AltPageUrl.length - 1);

            if ($.trim(lastLettercheck).indexOf("/") > -1)
                AltPageUrl = AltPageUrl.substring(0, AltPageUrl.length - 1);

            FinalAlternatePageUrls = AltPageUrl;
        }
    }
    else {
        FinalAlternatePageUrls = "";
    }

    $.ajax({
        url: "/CaptureForm/ManageTaggedForms/UpdateAlternateUrl",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'FormId': Id, 'AlternatePageUrls': FinalAlternatePageUrls }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (!response) {
                console.log("Unable to update AlternatePageUrls");
            }
        },
        error: ShowAjaxError
    });
}

//Form status filter
$("#ui_ddlFormStatus").change(function () {
    OffSet = 0;
    ShowPageLoading();
    MaxCount();
});

$('#txtCampaignIdentifier').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
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