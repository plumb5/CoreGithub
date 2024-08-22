var TemplateDetails = { Id: 0, SmsCampaignId: 0, Name: "" };
var CampList = [];
var templateList = [];
var templateUrlsList = Array();
let DefaultConfigurationNameId = 0;

$(document).ready(function () {
    BindCampaign();
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

function MaxCount() {

    if ($("#ui_txtSearchTemplate").val().length > 0) {
        var selCamp = CampList.filter(function (obj) { return (obj.Name === $("#ui_txtSearchTemplate").val()); })[0];

        TemplateDetails.Name = $("#ui_txtSearchTemplate").val();
        TemplateDetails.SmsCampaignId = selCamp != undefined ? selCamp.Id : 0;
    } else { TemplateDetails = { Id: 0, SmsCampaignId: 0, Name: "" }; }

    $.ajax({
        url: "/Sms/Template/GetMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'smsTemplateData': TemplateDetails }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response != undefined && response != null) {
                TotalRowCount = response.returnVal;
            }

            if (TotalRowCount > 0) {
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/Sms/Template/GetTemplateList",
        type: 'Post',
        data: JSON.stringify({ 'smsTemplateData': TemplateDetails, 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {

    SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');
    if (response != undefined && response != null) {
        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);


        var reportTableTrs;

        $.each(response, function () {
            let TemplateName = this.TemplateName;// ReplaceSingleQuote(this.TemplateName);
            let TemplateDescription = this.TemplateDescription;// ReplaceSingleQuote(this.TemplateDescription);
            let ContentType = "NA";
            if (!(this.IsPromotionalOrTransactionalType)) {
                ContentType = "Promotional";
            } else if (this.IsPromotionalOrTransactionalType) {
                ContentType = "Transactional";
            }


            //reportTableTrs += `<tr>
            //                      <td class="text-center">
            //                         <div class="smsprevwrap">
            //                         <i class="icon ion-ios-eye-outline"></i>
            //                         <div class="smsprevItemwrap bubbrep"><div class="chat">
            //                         <div class="yours messages"><div class="message last" style="white-space: pre-wrap; width: auto;text-align: initial;">${this.MessageContent}</div></div></div></div></div></td>
            //                         <td class="text-left">
            //                         <div class="groupnamewrap"><div class="nametitWrap">
            //                         <span class="groupNameTxt">${this.TemplateName}</span>
            //                         </div><div class="tdcreatedraft"><div class="dropdown">
            //                         <button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>
            //                         <div class="dropdown-menu dropdown-menu-right" aria-labelledby="filterbycontacts">
            //                         <a class="dropdown-item smstemplate DesignPermission" onclick="CreateEditTemplate(${this.Id},${this.SmsCampaignId},"${TemplateName.replace(/"/g, "&#34")}","${TemplateDescription.replace(/"/g, "&#34")}","${this.DLTUploadMessageFile}",${this.IsPromotionalOrTransactionalType});" href="javascript:void(0)">Edit</a>
            //                         <a class="dropdown-item ContributePermission" onclick="DuplicateTemplate(${this.Id},${this.SmsCampaignId},"${TemplateName.replace(/"/g, "&#34")}","${TemplateDescription.replace(/"/g, "&#34")}","${this.DLTUploadMessageFile}",${this.IsPromotionalOrTransactionalType});" href="javascript:void(0);">Duplicate</a>
            //                         <a id="ui_a_TestSMS_${this.Id}" class="dropdown-item smstemplate ContributePermission" data-SmsContent="${this.MessageContent}" onclick="CreateSMSTestCampaign.TestTemplate(${this.Id}, ${this.SmsCampaignId}, "${TemplateName}", ${this.IsPromotionalOrTransactionalType});" href="javascript:void(0);">Test</a>
            //                         <div class="dropdown-divider"></div>
            //                         <a class="dropdown-item FullControlPermission" data-toggle="modal" data-groupid="${this.Id}" id="deletetemp" data-target="#deleterow" href="javascript:void(0)">Archive</a>
            //                         </div></div></div></div></td>
            //                         <td class="text-left">
            //                         <div class="groupnamewrap"><div class="nameTxtWrap">
            //                         <span>${this.CampaignName}</span>
            //                         </div></div></td><td class="text-left">${ContentType}</td><td>${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.CreatedDate))}</td></tr>
            //                         `;



            reportTableTrs += '<tr><td class="text-center">' +
                '<div class="smsprevwrap">' +
                ' <i class="icon ion-ios-eye-outline"></i>' +
                '<div class="smsprevItemwrap bubbrep"><div class="chat">' +
                '<div class="yours messages"><div class="message last" style="white-space: pre-wrap; width: auto;text-align: initial;">' + this.MessageContent + '</div></div></div></div></div></td>' +
                '<td class="text-left">' +
                '<div class="groupnamewrap"><div class="nametitWrap">' +
                '<span class="groupNameTxt">' + this.TemplateName + '</span>' +
                '</div><div class="tdcreatedraft"><div class="dropdown">' +
                '<button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>' +
                '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="filterbycontacts">' +
                '<a class="dropdown-item smstemplate DesignPermission" onclick="CreateEditTemplate(' + this.Id + ',' + this.SmsCampaignId + ',\'' + TemplateName.replace(/"/g, "&#34") + '\',\'' + TemplateDescription.replace(/"/g, "&#34") + '\',\'' + this.DLTUploadMessageFile + '\',' + this.IsPromotionalOrTransactionalType + ');" href="javascript:void(0)">Edit</a>' +
                '<a class="dropdown-item ContributePermission" onclick="DuplicateTemplate(' + this.Id + ',' + this.SmsCampaignId + ',\'' + TemplateName.replace(/"/g, "&#34") + '\',\'' + TemplateDescription.replace(/"/g, "&#34") + '\',\'' + this.DLTUploadMessageFile + '\',' + this.IsPromotionalOrTransactionalType + ');"href="javascript:void(0);">Duplicate</a>' +
                '<a id="ui_a_TestSMS_' + this.Id + '" class="dropdown-item smstemplate ContributePermission" data-SmsContent="\'' + this.MessageContent + '\'" onclick="CreateSMSTestCampaign.TestTemplate(' + this.Id + ',' + this.SmsCampaignId + ',\'' + TemplateName + '\',' + this.IsPromotionalOrTransactionalType + ');" href="javascript:void(0);">Test</a>' +
                '<div class="dropdown-divider"></div>' +
                '<a class="dropdown-item FullControlPermission" data-toggle="modal" data-groupid="' + this.Id + '" id="deletetemp" data-target="#deleterow" href="javascript:void(0)">Archive</a>' +
                '</div></div></div></div></td>' +
                '<td class="text-left">' +
                '<div class="groupnamewrap"><div class="nameTxtWrap">' +
                '<span>' + this.CampaignName + '</span>' +
                '</div></div></td><td class="text-left">' + ContentType + '</td><td>' + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.CreatedDate)) + '</td></tr>';
        });
        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
    } else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
    CheckAccessPermission("Sms");
}

function BindCampaign() {
    $.ajax({
        url: "/Sms/Template/GetSmsCampaign",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != undefined && response != null) {
                $.each(response, function () {
                    CampList.push({
                        Id: $(this)[0].Id,
                        Name: $(this)[0].Name
                    });

                    optlist = document.createElement('option');
                    optlist.value = $(this)[0].Id;
                    optlist.text = $(this)[0].Name;
                    document.getElementById("ui_dllCampaign").options.add(optlist);
                });
            }
            GetGroupList();
        },
        error: ShowAjaxError
    });
}

function GetGroupList() {
    $.ajax({
        url: "/Sms/ScheduleCampaign/GetGroupList",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != undefined && response != null) {
                $.each(response, function () {
                    $("#testcampgroupname").append(`<option value="${$(this)[0].Id}">${$(this)[0].Name}</option>`);
                });
            }
            GetSmsConfigurationNames();
        },
        error: ShowAjaxError
    });
}

function GetSmsConfigurationNames() {
    $('#ui_ddlCampaignSmsSettings').select2({
        minimumResultsForSearch: '',
        dropdownAutoWidth: false
    });

    $.ajax({
        url: "/Sms/SmsSettings/GetConfigurationNameList",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != undefined && response != null) {
                $("#ui_ddlCampaignSmsSettings").empty();
                $("#ui_ddlCampaignSmsSettings").append(`<option value="0">Select Configuration Name</option>`);
                $.each(response, function (i) {
                    $("#ui_ddlCampaignSmsSettings").append("<option value='" + response[i].Id + "'>" + response[i].ConfigurationName + "</option>");
                    if (response[i].IsDefaultProvider)
                        DefaultConfigurationNameId = response[i].Id;
                });
                $("#ui_ddlCampaignSmsSettings").select2().val(DefaultConfigurationNameId).change();
            }
            CallBackFunction();
        },
        error: ShowAjaxError
    });
}

$(document).ready(function () {
    $("#ui_txtSearchTemplate").keydown(function (event) {
        if (event.keyCode == 13) {
            if ($("#ui_txtSearchTemplate").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.SmsTemplate.TemplateNameOrCampaign);
                return false;
            }
            CallBackFunction();
            event.preventDefault();
            return false;
        }
    });
});

var tempId = 0;
$(document).on('click', "#deletetemp", function () {
    tempId = parseInt($(this).attr("data-groupid"));
});

$("#deleteRowConfirm").click(function () {
    DeleteFormWithConform(tempId);
});

DeleteFormWithConform = function (Id) {

    $.ajax({
        url: "/Sms/Template/Delete",
        type: 'POST',
        data: JSON.stringify({ 'Id': Id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.SmsTemplate.DeleteTemplate);
                CallBackFunction();
            }
        },
        error: ShowAjaxError
    });
};

$("#ui_SearchbyTemplate").click(function () {
    if ($("#ui_txtSearchTemplate").val().length == 0) {
        ShowErrorMessage(GlobalErrorList.SmsTemplate.TemplateNameOrCampaign);
        return false;
    }
    CallBackFunction();
    event.preventDefault();
    return false;
});

$("#ui_txtSearchTemplate").keyup(function () {
    const key = event.key;
    if (key === "Backspace") {
        if (CleanText($.trim($("#ui_txtSearchTemplate").val())).length == 0) {
            CallBackFunction();
        }
        return false;
    }
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
