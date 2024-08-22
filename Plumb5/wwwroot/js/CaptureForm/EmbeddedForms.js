var EmbeddedFormOrPopUpFormOrTaggedForm = 'EmbeddedForm', IsBannerOrForm = false, FormId = 0, VisitorType = 0, reportType = "By Forms", FormResponses = [];
var formResponses = { FormId: 0, TrackIp: "", SearchByText: "", PageUrl: "", SearchKeyword: "", Referrer: "", IsAdSenseOrAdWord: 0, UtmTagSource: "", UtmMedium: "", UtmCampaign: "", UtmTerm: "", UtmContent: "", MailSubscribe: null, MailOverallSubscribe: null, SmsSubscribe: null, SmsOverallSubscribe: null };

$(document).ready(function () {
    ExportFunctionName = "FormReportExport";
    $('.showingWrap').addClass('pt-2').addClass('pb-2');
    GetUTCDateTimeRange(2);
});

$(".frmrepsubmenu").click(function () {
    let frmrestabnam = $(this).text();
    reportType = frmrestabnam;
    $(".frmrepsubmenu").removeClass('active');
    $(this).addClass('active');
    if (frmrestabnam === 'By Response') {
        $('.frmresfunnwrp').removeClass('hideDiv');
        $("#tbl-forms").addClass('hideDiv');
        $("#tbl-response").removeClass('hideDiv');
        $("#ui_exportOrDownloadAll").removeClass('hideDiv');
        formResponses = new Object();
        ExportFunctionName = "FormResponseExport";
    }
    else {
        $('.frmresfunnwrp').addClass('hideDiv');
        $("#tbl-response").addClass('hideDiv');
        $("#ui_exportOrDownloadAll").addClass('hideDiv');
        $("#tbl-forms").removeClass('hideDiv');
        ClearCustoReportFields();
        ExportFunctionName = "FormReportExport";
    }
    $('#ui_drpdwn_AllEmbeddedForms').empty();
    $('#ui_drpdwn_AllEmbeddedForms').append("<option label='All Forms' value='0'>All Forms</option>");
    CallBackFunction();
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;

    if (reportType === 'By Response') {
        GetAllForms();
        GetResponseMaxCount();
    }
    else {
        GetAllFormsByReport();
        GetFormMaxCount();
    }
}

function CallBackPaging() {
    CurrentRowCount = 0;
    if (reportType === 'By Response')
        GetResponseReport();
    else
        GetFormReport();
}

$('#ui_drpdwn_AllEmbeddedForms').on('change', function () {
    ShowPageLoading();

    formResponses.FormId = FormId = $('#ui_drpdwn_AllEmbeddedForms').val();

    if (reportType === 'By Response')
        GetResponseMaxCount();
    else
        GetFormMaxCount();

    // CallBackFunction();
});

//************************************Get all embedded forms**********************************//
function GetAllForms() {
    $.ajax({
        url: "/CaptureForm/Dashboard/GetFormDetailsByReport",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'EmbeddedFormOrPopUpFormOrTaggedForm': EmbeddedFormOrPopUpFormOrTaggedForm }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $('#ui_drpdwn_AllEmbeddedForms').empty();
            $('#ui_drpdwn_AllEmbeddedForms').append("<option label='All Forms' value='0'>All Forms</option>");
            $.each(response, function () {
                optlist = document.createElement('option');
                optlist.value = $(this)[0].Id;
                optlist.text = $(this)[0].FormStatus === true ? $(this)[0].FormIdentifier + " (Active)" : $(this)[0].FormIdentifier + " (Inactive)";
                document.getElementById("ui_drpdwn_AllEmbeddedForms").options.add(optlist);
            });
        },
        error: ShowAjaxError
    });
}

function GetAllFormsByReport() {
    $.ajax({
        url: "/CaptureForm/Dashboard/GetFormDetailsByReport",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'EmbeddedFormOrPopUpFormOrTaggedForm': EmbeddedFormOrPopUpFormOrTaggedForm }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (responsedata) {
            var response = responsedata.Data;
            $('#ui_drpdwn_AllEmbeddedForms').empty();
            $('#ui_drpdwn_AllEmbeddedForms').append("<option label='All Forms' value='0'>All Forms</option>");
            $.each(response, function () {
                optlist = document.createElement('option');
                optlist.value = $(this)[0].Id;
                optlist.text = $(this)[0].FormStatus === true ? $(this)[0].FormIdentifier + " (Active)" : $(this)[0].FormIdentifier + " (Inactive)";
                document.getElementById("ui_drpdwn_AllEmbeddedForms").options.add(optlist);
            });
            $('#ui_drpdwn_CustomReportsByForm').empty();
            $('#ui_drpdwn_CustomReportsByForm').append("<option value='0'>By Forms</option>");
            $.each(response, function () {
                optlist = document.createElement('option');
                optlist.value = $(this)[0].Id;
                optlist.text = $(this)[0].FormStatus === true ? $(this)[0].FormIdentifier + " (Active)" : $(this)[0].FormIdentifier + " (Inactive)";
                document.getElementById("ui_drpdwn_CustomReportsByForm").options.add(optlist);
            });
        },
        error: ShowAjaxError
    });
}
//************************************Get all embedded forms**********************************//

//************************************Form report by form**********************************//
function GetFormMaxCount() {
    $.ajax({
        url: "/CaptureForm/Dashboard/GetFormMaxCountByReport",
        type: 'Post',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'EmbeddedFormOrPopUpFormOrTaggedForm': EmbeddedFormOrPopUpFormOrTaggedForm, 'FormId': FormId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response !== undefined && response !== null) {
                TotalRowCount = response;
            }

            if (TotalRowCount > 0) {
                // GetAllFormsByReport();
                GetFormReport();
            }
            else {
                SetNoRecordContent('tbl-forms', 5, 'ui_tblReportData_EmbeddedForms');
                ShowExportDiv(false);
                ShowPagingDiv(false);
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetFormReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/CaptureForm/Dashboard/GetFormByReport",
        type: 'Post',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'OffSet': OffSet, 'FetchNext': FetchNext, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'EmbeddedFormOrPopUpFormOrTaggedForm': EmbeddedFormOrPopUpFormOrTaggedForm, 'FormId': FormId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindFormReport,
        error: ShowAjaxError
    });
}

function BindFormReport(response) {
    SetNoRecordContent('tbl-forms', 5, 'ui_tblReportData_EmbeddedForms');
    if (response !== undefined && response !== null && response.length > 0) {
        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        var reportTableTrs;
        $.each(response, function () {
            let ConversionRate = parseInt(this.ViewedCount) > 0 ? parseInt(Math.round((this.ResponseCount / this.ViewedCount) * 100).toFixed(2)) : 0;

            reportTableTrs += "<tr>" +
                "<td class='text-left'><div class='td-actionFlexSB'><div class='nametitWrap'><span class='groupNameTxt'>" + this.FormName + "</span>" +
                "<span class='templatenametxt'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.CreatedDate)) + "</span></div><div class='tdiconwrap'><i class='' ></i></div></td>" +
                "<td class='sentpopup'>" + this.ViewedCount + "</td>" +
                "<td class='sentpopup'>" + this.ResponseCount + "</td>" +
                "<td class='sentpopup'>" + this.ClosedCount + "</td>" +
                "<td class='sentpopup'>" + ConversionRate + "%</td>" +
                "</tr>";
        });
        ShowExportDiv(true);
        ShowPagingDiv(true);
        $("#tbl-forms").removeClass('no-data-records');
        $("#ui_tblReportData_EmbeddedForms").html(reportTableTrs);
    }
    else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
}
//************************************Form report by form**********************************//

//************************************Form report by response**********************************//
function GetResponseMaxCount() {
    $.ajax({
        url: "/CaptureForm/Response/GetCustomMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'formResponses': formResponses, 'FromDate': FromDateTime, 'ToDate': ToDateTime, 'EmbeddedFormOrPopUpFormOrTaggedForm': EmbeddedFormOrPopUpFormOrTaggedForm }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response !== undefined && response !== null) {
                TotalRowCount = response;
            }

            if (TotalRowCount > 0) {
                //GetAllForms();
                GetResponseReport();
            }
            else {
                SetNoRecordContent('tbl-response', 4, 'ui_tblReportData_EmbeddedResponse');
                ShowExportDiv(false);
                ShowPagingDiv(false);
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetResponseReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/CaptureForm/Response/GetCustomResponses",
        type: 'Post',
        data: JSON.stringify({ 'formResponses': formResponses, 'OffSet': OffSet, 'FetchNext': FetchNext, 'FromDate': FromDateTime, 'ToDate': ToDateTime, 'EmbeddedFormOrPopUpFormOrTaggedForm': EmbeddedFormOrPopUpFormOrTaggedForm }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindResponseReport,
        error: ShowAjaxError
    });
}

function BindResponseReport(response) {
    SetNoRecordContent('tbl-response', 4, 'ui_tblReportData_EmbeddedResponse');
    if (response !== undefined && response !== null && response.length > 0) {
        FormResponses = response;
        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        var reportTableTrs;
        $.each(response, function () {
            var UCP = String.raw`ShowContactUCP("","",${this.ContactId});`;
            var isNewResponse = !this.LeadSeen ? "<sup class='newtext'>New</sup>" : "";
            reportTableTrs += "<tr>" +
                "<td class='frmresucp' onclick=" + UCP + "><i class='fa fa-address-card-o'></i></td>" +
                "<td id='ui_td_ResponseReport_" + this.FormResponseId + "' onclick=\"ShowData(" + this.FormResponseId + "," + this.FormId + ");\"><a href='javascript:void(0);' class='textprilink'>" + this.Field1 + "</a>" + isNewResponse + "</td>" +
                "<td class='text-color-blue'>" + this.TrackIp + "</td>" +
                "<td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.TrackDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.TrackDate)) + "</td>" +
                "</tr>";
        });
        ShowExportDiv(true);
        ShowPagingDiv(true);
        $("#tbl-response").removeClass('no-data-records');
        $("#ui_tblReportData_EmbeddedResponse").html(reportTableTrs);
    }
    else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
}
//************************************Form report by response**********************************//

//************************************Show more details**********************************//
ShowData = function (Id, formId) {
    ShowPageLoading();
    $.ajax({
        url: "/CaptureForm/CommonDetailsForForms/GetFields",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'FormId': formId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindMoreResponseData(Id, response);
        },
        error: ShowAjaxError
    });
};

function BindMoreResponseData(Id, allFormFields) {
    var responseName = "";
    var LeadSeen = false;

    var responsedetails = $(FormResponses).filter(function (i) {
        return FormResponses[i].FormResponseId === Id;
    });

    $("#ui_tbl_FormResponseDetails tbody").empty();

    let FormHeading = responsedetails[0].Heading !== null ? responsedetails[0].Heading : "NA";
    let FormDescription = responsedetails[0].SubHeading !== null ? responsedetails[0].SubHeading : "NA";
    responseName = responsedetails[0].Field1 !== null ? responsedetails[0].Field1 : "NA";
    let City = responsedetails[0].City !== null ? responsedetails[0].City : "NA";
    let Country = responsedetails[0].Country !== null ? responsedetails[0].Country : "NA";
    let PageURL = responsedetails[0].PageUrl !== null ? responsedetails[0].PageUrl : "NA";
    let ReferrerPage = responsedetails[0].Referrer !== null ? responsedetails[0].Referrer : "NA";
    let SearchKeyword = responsedetails[0].SearchKeyword !== null ? responsedetails[0].SearchKeyword : "NA";
    let UTMTagSource = responsedetails[0].UtmTagSource !== null ? responsedetails[0].UtmTagSource : "NA";
    let UTMMedium = responsedetails[0].UtmMedium !== null ? responsedetails[0].UtmMedium : "NA";
    let UTMCampaign = responsedetails[0].UtmCampaign !== null ? responsedetails[0].UtmCampaign : "NA";
    let UTMTerm = responsedetails[0].UtmTerm !== null ? responsedetails[0].UtmTerm : "NA";
    let UTMContent = responsedetails[0].UtmContent !== null ? responsedetails[0].UtmContent : "NA";
    let MailSubscribe = responsedetails[0].MailSubscribe !== null ? responsedetails[0].MailSubscribe : "NA";
    //let MailOverallSubscribe = responsedetails[0].MailOverallSubscribe !== null ? responsedetails[0].MailOverallSubscribe : "NA";
    let SmsSubscribe = responsedetails[0].SmsSubscribe !== null ? responsedetails[0].SmsSubscribe : "NA";
    //let SmsOverallSubscribe = responsedetails[0].SmsOverallSubscribe !== null ? responsedetails[0].SmsOverallSubscribe : "NA";
    LeadSeen = responsedetails[0].LeadSeen;

    var tdContent = "";
    tdContent += "<tr>" +
        "<td class='text-left td-wid-50 m-p-w-220'>Form Heading</td>" +
        "<td class='text-left td-wid-50 m-p-w-220'>" + FormHeading + "</td>" +
        "</tr>";
    tdContent += "<tr>" +
        "<td class='text-left'>Form Description</td>" +
        "<td>" + FormDescription + "</td>" +
        "</tr>";
    if (allFormFields !== null && allFormFields !== undefined && allFormFields.formFields.length > 0) {
        for (var l = 0; l < allFormFields.formFields.length; l++) {
            var value = responsedetails[0]["Field" + (l + 1)] !== null ? responsedetails[0]["Field" + (l + 1)] : "NA";
            tdContent += "<tr>" +
                "<td class='text-left td-icon'>" + allFormFields.formFields[l].Name + "</td>" +
                "<td class='wordbreak-all'>" + value + "</td>" +
                "</tr>";
        }
    }
    tdContent += "<tr>" +
        "<td class='text-left td-icon'>City</td>" +
        "<td>" + City + "</td>" +
        "</tr>";
    tdContent += "<tr>" +
        "<td class='text-left td-icon'>Country</td>" +
        "<td>" + Country + "</td>" +
        "</tr>";
    tdContent += "<tr>" +
        "<td class='text-left td-icon'>Page URL</td>" +
        "<td class='wordbreak-all'>" + PageURL + "</td>" +
        "</tr>";
    tdContent += "<tr>" +
        "<td class='text-left td-icon'>Referrer Page</td>" +
        "<td class='wordbreak-all'>" + ReferrerPage + "</td>" +
        "</tr>";
    tdContent += "<tr>" +
        "<td class='text-left td-icon'>Search Keyword</td>" +
        "<td>" + SearchKeyword + "</td>" +
        "</tr>";
    tdContent += "<tr>" +
        "<td class='text-left td-icon'>UTM Tag Source</td>" +
        "<td class='wordbreak-all'>" + UTMTagSource + "</td>" +
        "</tr>";
    tdContent += "<tr>" +
        "<td class='text-left td-icon'>UTM Medium</td>" +
        "<td class='wordbreak-all'>" + UTMMedium + "</td>" +
        "</tr>";
    tdContent += "<tr>" +
        "<td class='text-left td-icon'>UTM Campaign</td>" +
        "<td class='wordbreak-all'>" + UTMCampaign + "</td>" +
        "</tr>";
    tdContent += "<tr>" +
        "<td class='text-left td-icon'>UTM Term</td>" +
        "<td class='wordbreak-all'>" + UTMTerm + "</td>" +
        "</tr>";
    tdContent += "<tr>" +
        "<td class='text-left td-icon'>UTM Content</td>" +
        "<td class='wordbreak-all'>" + UTMContent + "</td>" +
        "</tr>";
    tdContent += "<tr>" +
        "<td class='text-left td-icon'>Mail Subscribe</td>" +
        "<td class='wordbreak-all'>" + MailSubscribe + "</td>" +
        "</tr>";
    //tdContent += "<tr>" +
    //    "<td class='text-left td-icon'>Mail Overall Subscribe</td>" +
    //    "<td class='wordbreak-all'>" + MailOverallSubscribe + "</td>" +
    //    "</tr>";
    tdContent += "<tr>" +
        "<td class='text-left td-icon'>Sms Subscribe</td>" +
        "<td class='wordbreak-all'>" + SmsSubscribe + "</td>" +
        "</tr>";
    //tdContent += "<tr>" +
    //    "<td class='text-left td-icon'>Sms Overall Subscribe</td>" +
    //    "<td class='wordbreak-all'>" + SmsOverallSubscribe + "</td>" +
    //    "</tr>";
    $("#ui_tbl_FormResponseDetails tbody").append(tdContent);

    $("#dv_responsedetails").removeClass("hideDiv");
    $(".popupbodycont").removeClass("pad-10");
    $(".popupItem").addClass("popup-tbl").removeClass("w-650").addClass("w-450");
    $(".popuptitle h6").html("Response Details");
    $("#tbl-frmmultivar").addClass("hideDiv");
    $("#tbl-frmresdet").removeClass("hideDiv");
    $(".popupfooter .btnwrp").addClass("hideDiv");
    $(".popupfooter .pagiWraps").removeClass("hideDiv");

    if (!LeadSeen) {
        $.ajax({
            url: "/CaptureForm/Response/Update",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'Id': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(FormResponses, function (i) {
                    if (parseInt($(this)[0].FormResponseId) === parseInt(Id)) {
                        $(this)[0].LeadSeen = true;
                    }
                });
                $('#ui_td_ResponseReport_' + Id).empty();
                $('#ui_td_ResponseReport_' + Id).html("<a href='javascript:void(0);' class='textprilink'>" + responseName + "</a>");
            },
            error: ShowAjaxError
        });
    }
    HidePageLoading();
}

$("#close-popup, .clsepopup").click(function () {
    $(this).parents("#dv_responsedetails").addClass("hideDiv");
});
//************************************Show more details**********************************//

//************************************Custom Report**********************************//
$("#ui_btn_CustomReport").click(function () {
    formResponses = new Object();
    if (!CustomReportValidations()) {
        return;
    }
    ShowPageLoading();
    // CallBackFunction();
    GetResponseMaxCount();
    $("#ui_filter_Dropdown").removeClass("show");
    $("#ui_clear_CustomReport").removeClass("hideDiv");
});

CustomReportValidations = function () {
    //if ($("#ui_drpdwn_CustomReportsByForm").get(0).selectedIndex === 0 && $("#ui_drpdwn_FilterByFields").get(0).selectedIndex === 0 && $("#ui_txt_FilterByFieldsAnswer").val().length === 0 && $("#ui_drpdwn_FilterByFieldsAnswer").get(0).selectedIndex === 0 && $("#ui_txt_FilterByText").val().length === 0) {
    //    ShowErrorMessage(GlobalErrorList.Form_Responses.CustomReport_Condition);
    //    return false;
    //}

    if ($("#ui_drpdwn_CustomReportsByForm").get(0).selectedIndex > 0) {
        formResponses.FormId = $("#ui_drpdwn_CustomReportsByForm").val();
    }

    if ($("#ui_drpdwn_FilterByFields").get(0).selectedIndex > 0) {
        if (($("#ui_drpdwn_FilterByFields").get(0).selectedIndex !== 4 && $("#ui_drpdwn_FilterByFields").get(0).selectedIndex !== 5 && $("#ui_drpdwn_FilterByFields").get(0).selectedIndex !== 11 && $("#ui_drpdwn_FilterByFields").get(0).selectedIndex !== 12 && $("#ui_drpdwn_FilterByFields").get(0).selectedIndex !== 13 && $("#ui_drpdwn_FilterByFields").get(0).selectedIndex !== 14) && $("#ui_txt_FilterByFieldsAnswer").val().length === 0) {
            ShowErrorMessage(GlobalErrorList.Form_Responses.CustomReport_ByFieldAnswer);
            return false;
        }
        if ($("#ui_drpdwn_FilterByFields").get(0).selectedIndex > 10 && $("#ui_drpdwn_FilterByFieldsAnswer").get(0).selectedIndex === 0) {
            ShowErrorMessage(GlobalErrorList.Form_Responses.CustomReport_ByFieldValue);
            return false;
        }
        var value = parseInt($("#ui_drpdwn_FilterByFields").val());
        if (value === 1)
            formResponses.PageUrl = $("#ui_txt_FilterByFieldsAnswer").val();
        else if (value === 2)
            formResponses.SearchKeyword = $("#ui_txt_FilterByFieldsAnswer").val();
        else if (value === 3)
            formResponses.Referrer = $("#ui_txt_FilterByFieldsAnswer").val();
        else if (value === 4)
            formResponses.IsAdSenseOrAdWord = 2;
        else if (value === 5)
            formResponses.IsAdSenseOrAdWord = 1;
        else if (value === 6)
            formResponses.UtmTagSource = $.trim($("#ui_txt_FilterByFieldsAnswer").val());
        else if (value === 7)
            formResponses.UtmMedium = $.trim($("#ui_txt_FilterByFieldsAnswer").val());
        else if (value === 8)
            formResponses.UtmCampaign = $.trim($("#ui_txt_FilterByFieldsAnswer").val());
        else if (value === 9)
            formResponses.UtmTerm = $.trim($("#ui_txt_FilterByFieldsAnswer").val());
        else if (value === 10)
            formResponses.UtmContent = $.trim($("#ui_txt_FilterByFieldsAnswer").val());
        else if (value === 11)
            formResponses.MailSubscribe = parseInt($("#ui_drpdwn_FilterByFieldsAnswer").val()) === 1 ? true : false;
        else if (value === 12)
            formResponses.MailOverallSubscribe = parseInt($("#ui_drpdwn_FilterByFieldsAnswer").val()) === 1 ? true : false;
        else if (value === 13)
            formResponses.SmsSubscribe = parseInt($("#ui_drpdwn_FilterByFieldsAnswer").val()) === 1 ? true : false;
        else if (value === 14)
            formResponses.SmsOverallSubscribe = parseInt($("#ui_drpdwn_FilterByFieldsAnswer").val()) === 1 ? true : false;
    }

    if ($("#ui_txt_FilterByText").val().length > 0) {
        formResponses.Field1 = $("#ui_txt_FilterByText").val();
    }

    return true;
};

$('#ui_drpdwn_FilterByFields').on('change', function () {
    var value = parseInt($('#ui_drpdwn_FilterByFields').val());
    if (value === 4 || value === 5) {
        $('#ui_div_FilterFieldsAnswerByText').removeClass('showDiv').addClass('hideDiv');
        $('#ui_div_FilterFieldsAnswerByDropDown').removeClass('showDiv').addClass('hideDiv');
    }
    else if (value > 10) {
        $('#ui_div_FilterFieldsAnswerByText').removeClass('showDiv').addClass('hideDiv');
        $('#ui_div_FilterFieldsAnswerByDropDown').removeClass('hideDiv').addClass('showDiv');
    }
    else {
        $('#ui_div_FilterFieldsAnswerByText').removeClass('hideDiv').addClass('showDiv');
        $('#ui_div_FilterFieldsAnswerByDropDown').removeClass('showDiv').addClass('hideDiv');
    }
});

$('#ui_drpdwn_CustomReportsByForm').on('change', function () {
    formResponses.FormId = parseInt($('#ui_drpdwn_CustomReportsByForm').val());
    $('#ui_drpdwn_AllEmbeddedForms').val(formResponses.FormId);
});
//************************************Custom Report**********************************//

$("#ui_drpdwn_AllEmbeddedForms,#ui_drpdwn_CustomReportsByForm,#ui_drpdwn_FilterByFields").select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$("#ui_exportOrDownloadAll").click(function () {
    ExportFunctionName = "FormResponseAllExport";
});

$("#ui_exportOrDownload").click(function () {
    let frmrestabnam = $(".frmrepsubmenu.active").text();
    if (frmrestabnam === 'By Response') {
        ExportFunctionName = "FormResponseExport";
    } else {
        ExportFunctionName = "FormReportExport";
    }
});

//clear custom Report

$("#ui_clear_CustomReport").click(function () {
    formResponses = new Object();
    ClearCustoReportFields();
    CallBackFunction();
})

function ClearCustoReportFields() {
    $('#ui_drpdwn_CustomReportsByForm').val('0').change();
    $('#ui_drpdwn_FilterByFields').val('0').change();
    $("#ui_txt_FilterByText").val("");
    $("#ui_txt_FilterByFieldsAnswer").val("");
    $("#ui_clear_CustomReport").addClass("hideDiv");
}

