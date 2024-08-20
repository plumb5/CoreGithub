var deleteId = 0;
var TemplateDetails = { Name: "" };
var CampaignIdentifierList = [];
let DefaultConfigurationNameId = 0;

$(document).ready(function () {
    MailTemplateUtil.LoadPage();
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
    LoadPage: function () {
        ShowPageLoading();
        TotalRowCount = 0;
        CurrentRowCount = 0;
        MailTemplateUtil.MaxCount();
    },
    MaxCount: function () {
        TemplateDetails.Name = $('#ui_txt_TemplateSearch').val();

        $.ajax({
            url: "/Mail/MailTemplateArchive/GetArchiveMaxCount",
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
            url: "/Mail/MailTemplateArchive/GetArchiveTemplateList",
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
                                                        <a class="dropdown-item FullControlPermission" data-toggle="modal" data-target="#ui_divDeleteDialog" href="javascript:void(0)" onclick="MailTemplateUtil.ShowDeletePopUp(${eachData.Id});">Restore</a>
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
    RestoreTemplate: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Mail/MailTemplateArchive/RestoreMailTemplate",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'Id': deleteId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    deleteId = 0;
                    ShowSuccessMessage("Restored successfully");
                    MailTemplateUtil.LoadPage();
                }
                else {
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
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

$("#ui_btnDeleteConfirm").click(function () {
    MailTemplateUtil.RestoreTemplate();
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
