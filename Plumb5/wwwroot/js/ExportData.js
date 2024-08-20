
var ExportFileType = "", ExportFunctionName = "Export";

function RemoveExportDataRange() {
    $("#ui_ddl_ExportDataRange option[value=2]").remove();
    $("#ui_ddl_ExportDataRange option[value=3]").remove();
}

function ShowExportDiv(IsVisible) {
    $("#ui_divReportExport").removeClass('hideDiv');
    $("#ui_divReportExport").removeClass('showDiv');
    if (IsVisible != undefined && IsVisible != null && (IsVisible == true || IsVisible == "True" || IsVisible == "true" || IsVisible)) {
        $("#ui_divReportExport").addClass('showDiv');
    }
    else {
        $("#ui_divReportExport").addClass('hideDiv');
    }
}

$("#ui_ddl_ExportDataRange").on('change', function () {
    $("#ui_divExportInput").removeClass("hideDiv").addClass("hideDiv");
    if ($("#ui_ddl_ExportDataRange").val() == "3") {
        $("#ui_divExportInput").removeClass("hideDiv");
    }
});

function ResetExportValues() {
    $("#ui_ddl_ExportFileType").val('csv');
    $("#ui_divExportInput").removeClass("hideDiv").addClass("hideDiv");
    $("#ui_ddl_ExportDataRange").val('1');
    $("#ui_txtFromRange").val('');
    $("#ui_txToRange").val('');
}

function ExportValidation() {
    ExportFileType = $("#ui_ddl_ExportFileType").val();
    if (ExportFileType != "csv" && ExportFileType != "xls" && ExportFileType != "xlsx") {
        ShowErrorMessage(GlobalErrorList.ExportData.file_selection_error);
        HidePageLoading();
        return true;
    }

    if ($("#ui_ddl_ExportDataRange").val() == "3") {
        if ($.trim($("#ui_txtFromRange").val()).length === 0) {
            ShowErrorMessage(GlobalErrorList.ExportData.nostartindex);
            $("#ui_txtFromRange").focus();
            HidePageLoading();
            return true;
        }

        if ($.trim($("#ui_txToRange").val()).length === 0) {
            ShowErrorMessage(GlobalErrorList.ExportData.noendindex);
            $("#ui_txToRange").focus();
            HidePageLoading();
            return true;
        }

        if (!($.isNumeric($("#ui_txtFromRange").val()))) {
            ShowErrorMessage(GlobalErrorList.ExportData.nonnumeric);
            $("#ui_txtFromRange").focus();
            HidePageLoading();
            return true;
        }

        if (!($.isNumeric($("#ui_txToRange").val()))) {
            ShowErrorMessage(GlobalErrorList.ExportData.nonnumeric);
            $("#ui_txToRange").focus();
            HidePageLoading();
            return true;
        }

        if ((parseInt($("#ui_txToRange").val()) - parseInt($("#ui_txtFromRange").val())) <= 0) {
            ShowErrorMessage(GlobalErrorList.ExportData.DifferenceZero);
            $("#ui_txToRange").focus();
            HidePageLoading();
            return true;
        }
    }

    return false;
}

function StartDataExport() {
    ExportFileType = "";
    ShowPageLoading();

    if (!ExportValidation()) {
        if (ExportFunctionName == undefined || ExportFunctionName == null || ExportFunctionName == '') {
            ExportFunctionName = "Export";
        }

        var ExportOffSet = OffSet;
        var ExportFetchNext = FetchNext;

        if ($("#ui_ddl_ExportDataRange").val() == "1") {
            ExportOffSet = OffSet;
            ExportFetchNext = FetchNext;
        }
        else if ($("#ui_ddl_ExportDataRange").val() == "2") {
            ExportOffSet = 0;
            ExportFetchNext = TotalRowCount;
        }
        else if ($("#ui_ddl_ExportDataRange").val() == "3") {
            ExportOffSet = parseInt($("#ui_txtFromRange").val());
            ExportFetchNext = parseInt($("#ui_txToRange").val());

            ExportFetchNext = (ExportFetchNext - ExportOffSet);
        }

        if ((ExportFunctionName != undefined || ExportFunctionName != null || ExportFunctionName != "") && (ExportFunctionName == "FormResponseAllExport")) {
            ExportOffSet = ExportFetchNext = 0;
        }

        if (ExportFunctionName == "GetCampaignResponseData" && Areas == "Mail") {
            var SendingSettingIdList = GetSelectedCampaignIds();
        }

        if (ExportFunctionName == "GetCampaignResponseData" && Areas == "Sms") {
            var SendingSettingIdList = smsReportUtil.GetSelectedCampaignIds();
        }

        if (ExportFunctionName == "GetWhatsAppCampaignResponseData") {
            ExportFunctionName = "GetCampaignResponseData"
            var SendingSettingIdList = WhatsAppReportUtil.GetSelectedCampaignIds();
        }
        if (ExportFunctionName == "GetWebpushCampaignResponseData") {
            ExportFunctionName = "GetCampaignResponseData"
            var SendingSettingIdList = webpushReportUtil.GetSelectedCampaignIds();
        }
        if (ExportFunctionName == "ContactImportOverViewsExport" && Areas == "Prospect") {
            Areas ="ManageContact";
        }
        var getData = "";
        if (ExportFunctionName == "ExportCustomViewFilterReport") {
            if ($("#txtStartDate").val() != "" && $("#txtEndDate").val() != "") {
                var fromdate, todate;

                let LocalFromdate = CustomEventsCustomReportPopUpUtil.ReturnDateInFormat($("#txtStartDate").val()) + " 00:00:00";
                let LocalTodate = CustomEventsCustomReportPopUpUtil.ReturnDateInFormat($("#txtEndDate").val()) + " 23:59:59";

                fromdate = ConvertDateTimeToUTC(LocalFromdate);
                todate = ConvertDateTimeToUTC(LocalTodate);

                var startdate = fromdate.getFullYear() + '-' + PrefixZero((fromdate.getMonth() + 1)) + '-' + PrefixZero(fromdate.getDate()) + " " + PrefixZero(fromdate.getHours()) + ":" + PrefixZero(fromdate.getMinutes()) + ":" + PrefixZero(fromdate.getSeconds());;
                var enddate = todate.getFullYear() + '-' + PrefixZero((todate.getMonth() + 1)) + '-' + PrefixZero(todate.getDate()) + " " + PrefixZero(todate.getHours()) + ":" + PrefixZero(todate.getMinutes()) + ":" + PrefixZero(todate.getSeconds());;

                filterEventData.StartDate = startdate;
                filterEventData.EndDate = enddate;

                getData = JSON.stringify({ 'AccountId': Plumb5AccountId, 'Duration': duration, 'FromDateTime': filterEventData.StartDate, 'TodateTime': filterEventData.EndDate, 'OffSet': ExportOffSet, 'FetchNext': ExportFetchNext, 'FileType': ExportFileType });

                ExportFunctionName = "ExportCustomViewReport";
            }
        }
        
        else {
            getData = ExportFunctionName != "GetCampaignResponseData" ? JSON.stringify({ 'AccountId': Plumb5AccountId, 'Duration': duration, 'FromDateTime': FromDateTime, 'TodateTime': ToDateTime, 'OffSet': ExportOffSet, 'FetchNext': ExportFetchNext, 'FileType': ExportFileType }) : JSON.stringify({ 'AdsId': Plumb5AccountId, 'SendingSettingId': parseInt(SendingSettingIdList[0]), 'FileType': ExportFileType });
        }

        //var getData = ExportFunctionName != "GetCampaignResponseData" ? JSON.stringify({ 'AccountId': Plumb5AccountId, 'Duration': duration, 'FromDateTime': FromDateTime, 'TodateTime': ToDateTime, 'OffSet': ExportOffSet, 'FetchNext': ExportFetchNext, 'FileType': ExportFileType }) : JSON.stringify({ 'AdsId': Plumb5AccountId, 'SendingSettingId': parseInt(SendingSettingIdList[0]), 'FileType': ExportFileType });

        $.ajax({
            url: "/" + Areas + "/" + MainControlerUrl + "/" + ExportFunctionName,
            type: 'POST',
            data: getData,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status) {
                    SaveToDisk(response.MainPath);
                    ResetExportValues();
                    setTimeout(function () { DeleteFile(response.MainPath); }, 5000);
                    $("#downloadModal").modal('hide');
                }
                else {
                    ShowErrorMessage(GlobalErrorList.ExportData.session_expired);
                    setTimeout(function () { window.location.href = "/Login"; }, 3000);
                }

                //Hide page loading
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
}

$("#ui_btnDataExport").click(function () {
    StartDataExport();
});

function SaveToDisk(fileURL) {
    window.location.assign(fileURL);
}

function DeleteFile(url) {
    var filename = url.substring(url.lastIndexOf('/') + 1);
    $.ajax({
        url: "/Analytics/Dashboard/ExportFileDelete",
        type: 'POST',
        data: JSON.stringify({
            'FileName': filename
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status) {

            }

        },
        error: ShowAjaxError
    });
}