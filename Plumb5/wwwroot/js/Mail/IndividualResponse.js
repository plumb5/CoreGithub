var MailCampaignId = 0, MailTemplateId = 0;
var MailTemplatesList = [];

var timeduration = 0;
var rfromdate, rtodate = "";

$(document).ready(function () {
    BindMailTemplate();

    timeduration = $.urlParam("duration");
    MailCampaignId = $.urlParam("campid");
    MailTemplateId = $.urlParam("tempid");
    rfromdate = $.urlParam("frmdate");
    rtodate = $.urlParam("todate");

    //duration = 5 & campid=1 & tempid=114 & frmdate=2021 - 02 - 28 % 2018: 30: 00 & todate=2023-03-12 %2018: 29: 59

    MailCampaignId = parseInt(MailCampaignId);
    MailTemplateId = parseInt(MailTemplateId);

    if (parseInt(timeduration) > 0 && parseInt(MailCampaignId) > 0 && parseInt(MailTemplateId) > 0) {
        if (parseInt(timeduration) == 5 && rfromdate != "" && rtodate != "") {

            //$('#selectdateDropdown').text('Custom Date Range');
            //$('.dateBoxWrap').addClass('showFlx');

            //var SelectedFromDate = $.urlParam("Frmdate").toString().replace(/%20/g, " ");
            //var SelectedToDate = $.urlParam("Todate").toString().replace(/%20/g, " ");

            //var frmdatevalue = $.trim(SelectedFromDate).split(' ');

            //var frmday = $.trim(frmdatevalue[0]).split('-')[2];
            //var frmmonth = $.trim(frmdatevalue[0]).split('-')[1];
            //var frmyear = $.trim(frmdatevalue[0]).split('-')[0];

            //var todatevalue = $.trim(SelectedToDate).split(' ');

            //var tday = $.trim(todatevalue[0]).split('-')[2];
            //var tmonth = $.trim(todatevalue[0]).split('-')[1];
            //var tyear = $.trim(todatevalue[0]).split('-')[0];

            //$('#ui_txtStartDate').val(frmmonth + "/" + frmday + "/" + frmyear);
            //$('#ui_txtEndDate').val(tmonth + "/" + tday + "/" + tyear);

            //$('#ui_txtStartDate').prop("disabled", true);
            //$('#ui_txtEndDate').prop("disabled", true);


            FromDateTime = rfromdate.replace(/%20/g, " ");
            ToDateTime = rtodate.replace(/%20/g, " ");
            $(".showDateWrap").html("");
            CallBackFunction();
        }
        else {
            $(".showDateWrap").html("");
            GetUTCDateTimeRange(parseInt(timeduration));
        }
    }
    else {
        $(".showDateWrap").removeClass("hideDiv");
        GetUTCDateTimeRange(2);
    }
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
    let EmailId = CleanText($.trim($('#txt_SearchBy').val()));
    $.ajax({
        url: "/Mail/IndividualResponse/IndividualMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'mailCampaignId': MailCampaignId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'templateId': MailTemplateId, 'EmailId': EmailId }),
        //data: JSON.stringify({ 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'CampignName': CampaignName }),
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
                SetNoRecordContent('ui_tblReportData', 7, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}
function GetReport() {
    let EmailId = CleanText($.trim($('#txt_SearchBy').val()));
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/Mail/IndividualResponse/GetIndividualResponseData",
        type: 'Post',
        data: JSON.stringify({ 'OffSet': OffSet, 'FetchNext': FetchNext, 'mailCampaignId': MailCampaignId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'templateId': MailTemplateId, 'EmailId': EmailId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}
function BindReport(response) {

    SetNoRecordContent('ui_tblReportData', 7, 'ui_tbodyReportData');
    if (response != undefined && response != null) {
        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);


        var reportTableTrs;

        $.each(response, function () {

            var Template = MailTemplatesList.find(o => o.Id === parseInt(this.MailTemplateId));
            var TemplateName = Template != undefined ? MailTemplatesList.find(o => o.Id === parseInt(this.MailTemplateId)).Name : "NA";

            let TemplatePaths = "";
            if (this.MailTemplateId > 0)
                TemplatePaths = `https://${TemplatePath}Campaign-${Plumb5AccountId}-${this.MailTemplateId}/TemplateContent.html`;
            else
                TemplatePaths = `${OnlineUrl}Template/no-template-available.html`;

            let IsDelivered_Bounced_Error = `<i class="icon ion-android-done-all text-color-error" title="NotSent"></i>`;
            if (this.SendStatus == 1)
                IsDelivered_Bounced_Error = `<i class="icon ion-android-done-all text-color-success" title="Sent"></i>`;
            if (this.IsBounced == 1)
                IsDelivered_Bounced_Error = `<i class="icon ion-alert-circled text-color-error" title="Bounce : ${this.ErrorMessage}"></i>`;
            if (this.SendStatus == 4)
                IsDelivered_Bounced_Error = `<i class="icon ion-ios-close text-color-error" title="Error : ${this.ErrorMessage} "></i>`;
            reportTableTrs += `<tr>
                                    <td class="text-center temppreveye">
                                        <i class="icon ion-ios-eye-outline position-relative" data-toggle="popover" data-content="" data-page=${TemplatePaths}>
                                            <div class="previewtabwrp">
                                                <div class="thumbnail-container">
                                                    <a href="${TemplatePaths}" target="_blank">
                                                        <div class="thumbnail">
                                                            <iframe class="uitemplatepreview"  src="${TemplatePaths}" frameborder="0" onload="this.style.opacity = 1"></iframe>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </i>
                                   </td>
                                   <td class="text-left">
                                        <span class="groupNameTxt">${this.FromName}</span>
                                        <span class="createdDateTd">${this.CampaignJobName} ${IsDelivered_Bounced_Error}</span>
                                   </td>
                                   <td class="text-left">${this.FromEmailId}</td>
                                   <td class="wordbreak text-left">${this.Subject}</td>
                                   <td class="wordbreak text-left">${TemplateName}</td>
                                   <td>${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.SentDate))}</td>
                                   <td class="text-left">${this.EmailId}</td>
                                </tr>`;

        });


        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
        bindIframe();
    } else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
}

function bindIframe() {
    $('.poppage .ion-ios-eye-outline').popover({
        html: true,
        trigger: "hover",
        placement: "right",
        content: function () {
            var datapage = $(this).attr("data-page");

            return '<iframe src="' + datapage + '" style="border:none; width:100%" height="100%" scrolling="no" frameborder="0" onload="adjustPopover(&quot;.pop-right&quot;, this);">' +
                '</iframe>';
        }
    });
}

function BindMailTemplate() {
    $.ajax({
        url: "/Mail/MailTemplate/GetAllTemplateList",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (TemplateList) {
            if (TemplateList != undefined && TemplateList != null && TemplateList.length > 0) {
                MailTemplatesList = TemplateList;
            }
        },
        error: ShowAjaxError
    });
}

$(".searchIcon").click(function () {
    if (CleanText($.trim($('#txt_SearchBy').val())).length == 0) {
        ShowErrorMessage("Enter email to search");
        return false;
    }
    CallBackFunction();
});

$(document).ready(function () {

    $("#txt_SearchBy").keydown(function (event) {
        if (event.keyCode == 13) {
            if (CleanText($.trim($('#txt_SearchBy').val())).length == 0) {
                ShowErrorMessage("Enter email to search");
                return false;
            }

            CallBackFunction();
            event.preventDefault();
            return false;
        }
    });
});

document.getElementById("txt_SearchBy").addEventListener("keyup", function (event) {
    const key = event.key;
    if (key === "Backspace") {
        if (CleanText($.trim($('#txt_SearchBy').val())).length == 0) {
            CampaignName = "";
            CallBackFunction();
        }
    }
    event.preventDefault();
    return false;

});