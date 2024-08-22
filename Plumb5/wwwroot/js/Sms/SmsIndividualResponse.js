var SMSTemplateId = 0;
var SmsCampaignId = 0;

var timeduration = 0;
var rfromdate, rtodate = "";
var tophonenumber = "";
$(document).ready(function () {

    timeduration = parseInt($.urlParam("duration"));
    SmsCampaignId = parseInt($.urlParam("campid"));
    SMSTemplateId = parseInt($.urlParam("tempid"));
    rfromdate = $.urlParam("frmdate");
    rtodate = $.urlParam("todate");

    ExportFunctionName = "ExportSmsAlertNotification";

    if (parseInt(timeduration) > 0 && parseInt(SmsCampaignId) > 0 && parseInt(SMSTemplateId) > 0) {
        if (parseInt(timeduration) == 5 && rfromdate != "" && rtodate != "") {
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
    $.ajax({
        url: "/Sms/SmsIndividualResponse/IndividualMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'Phonenumber': tophonenumber }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response !== undefined && response !== null) {
                TotalRowCount = response.returnVal;
            }

            if (TotalRowCount > 0)
                GetReport();
            else {
                SetNoRecordContent('ui_tableReport', 5, 'ui_tbodyReportData');
                ShowExportDiv(false);
                ShowPagingDiv(false);
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/Sms/SmsIndividualResponse/GetIndividualResponseData",
        type: 'Post',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext, 'Phonenumber': tophonenumber }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    SetNoRecordContent('ui_tableReport', 5, 'ui_tbodyReportData');
    if (response !== undefined && response !== null) {
        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        var reportTableTrs;
        $.each(response, function () {
            let ContentType = "NA";
            if (!(this.IsPromotionalOrTransactionalType)) {
                ContentType = "Promotional";
            } else if (this.IsPromotionalOrTransactionalType) {
                ContentType = "Transactional";
            }

            let IsDelivered_Bounced_Error = "";

            if (this.Sent == 1)
                IsDelivered_Bounced_Error = `<i class='icon ion-android-done-all text-color-success'  title='Sent'></i> `;
            if (this.Delivered == 1)
                IsDelivered_Bounced_Error = `<i class="icon ion-android-done-all text-color-success"  title="Delivered"></i> `;
            if (this.NotDeliverStatus == 1)
                IsDelivered_Bounced_Error = `<i class="icon ion-alert-circled text-color-error" title="Bounce : ${this.ErrorMessage} "></i>`;
            if (this.Sent == 4 || this.Sent == 0)
                IsDelivered_Bounced_Error = `<i class="icon ion-ios-close text-color-error" title="Error : ${this.ErrorMessage} "></i>`;
             
            reportTableTrs += '<tr>' +
                '<td class="text-center">' +
                '<div class="smsprevwrap"><i class="icon ion-ios-eye-outline"></i><div class="smsprevItemwrap"><div class="chat"><div class="yours messages"><div class="message last">' + this.MessageContent + '</div></div></div></div></div></td>' +
                '<td class="text-left wordbreak"><div class="nametitWrap"><span class="groupNameTxt">' + this.TemplateName + '</span><span class="createdDateTd">' + this.CampaignJobName + " " + IsDelivered_Bounced_Error + '</span></div></td>' +
                '<td>' + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.SentDate)) + '</td>' +
                '<td>' + this.PhoneNumber + '</td>' +
                '<td class="text-left">' + ContentType + '</td>' +
                '</tr>';
        });
        ShowExportDiv(true);
        ShowPagingDiv(true);
        $("#ui_tableReport").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
    }
    else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
}

$('#ui_div_SearchIcon').click(function () {
    tophonenumber = "";
      tophonenumber = CleanText($('#ui_txt_Search').val());
    if (tophonenumber === '') {
        ShowErrorMessage(GlobalErrorList.SMSNotificationTemplate.PhoneNumberError);
        return false;
    }
    CallBackFunction();
});

document.getElementById("ui_txt_Search").addEventListener("keyup", function (event) {
    tophonenumber = "";
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("ui_div_SearchIcon").click();
    }
    else {
        tophonenumber = CleanText($('#ui_txt_Search').val());
        if (tophonenumber === '') {
            CallBackFunction();
        }
    }
});