var HistoryParam = { ContactId: 0, Name: "", EmailId: "", PhoneNumber: "", WorkFlowId: 0, TemplateId: 0, MachineId: "" };
$(document).ready(function () {
    ExportFunctionName = "HistoryExport";
    GetUTCDateTimeRange(2);
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
    RuleName = $("#txt_SearchBy").val();
    $.ajax({
        url: "/Journey/History/MaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'history': HistoryParam, 'FromDate': FromDateTime, 'ToDate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response != undefined && response != null) {
                TotalRowCount = response;
            }

            if (TotalRowCount > 0) {
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 9, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/Journey/History/GetAllHistory",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'history': HistoryParam, 'OffSet': OffSet, 'FetchNext': FetchNext, 'FromDate': FromDateTime, 'ToDate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 9, 'ui_tbodyReportData');
    if (response != undefined && response != null) {
        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        var reportTableTrs;
        $.each(response, function () {
            var contact = this.EmailId != null ? this.EmailId : this.PhoneNumber != null ? this.PhoneNumber : "--Na--";
            var UCP = String.raw`ShowContactUCP("","",${this.ContactId});`;
            reportTableTrs += '<tr>' +
                '<td class="frmresucp" onclick=' + UCP + '><i class="fa fa-address-card-o"></i></td>' +
                '<td ><div class="groupnamewrap"><div class="nameTxtWrap">' + contact + '</div><div class="tdcreatedraft"><div class="dropdown">' +
                '<button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>' +
                "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='filterbycontacts'><a onclick=\"ShowUserJourneyHistory(" + this.ContactId + ",'" + contact + "','" + this.EmailId + "','" + this.MachineId + "');\" class='dropdown-item viewuserhist' href='javascript:void(0);'>View Details</a>" +
                '</div></div></div></div></td >' +
                '<td>' + this.TotalWorkFlow + '</td>' +
                '<td>' + this.TotalSent + '</td>' +
                '<td>' + this.TotalDelivered + '</td>' +
                '<td>' + this.TotalViewed + '</td>' +
                '<td>' + this.TotalResponsed + '</td>' +
                '<td>' + this.TotalBounced + '</td>' +
                '<td>' + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.LastSentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.LastSentDate)) + '</td>' +
                '</tr>';
        });
        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
    } else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
}

function BindWorkflow() {
    $.ajax({
        url: "/WorkFlow/Dashboard/GetDashboardData",
        type: 'POST',
        data: JSON.stringify({ 'workflow': { Status: "-1", Title: "" }, 'OffSet': 0, 'FetchNext': 100 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response, function () {
                optlist = document.createElement('option');
                optlist.value = $(this)[0].WorkFlowId;
                optlist.text = $(this)[0].Title;
            });
        },
        error: ShowAjaxError
    });
}

$(document).ready(function () {
    $("#txt_SearchBy").keydown(function (event) {
        if (event.keyCode == 13) {
            $("#ui_btn_txtSearchBy").click();
            event.preventDefault();
            return false;
        }
    });
});

$("#txt_SearchBy").keyup(function () {
    const key = event.key;
    if (key === "Backspace") {
        if (CleanText($.trim($("#txt_SearchBy").val())).length == 0) {
            HistoryParam = new Object();
            CallBackFunction();
        }
        return false;
    }
});

$("#ui_btn_txtSearchBy").click(function () {
    if (CleanText($("#txt_SearchBy").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.Journey_History.Error_SearchBy);
        return false;
    }

    var regNumbers = /^\d+$/;
    HistoryParam = new Object();
    var value = CleanText($("#txt_SearchBy").val());
    if (regExpEmail.test(value)) {
        HistoryParam.EmailId = value;
    }
    else if (regNumbers.test(value)) {
        HistoryParam.PhoneNumber = value;
    }
    CallBackFunction();
});
