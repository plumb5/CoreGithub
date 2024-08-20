var ExportFileTypeInner = "", ExportFunctionNameInnerPage = "Export", ExportChannel = "";
var ExportDataOF = "";
$("#ui_btnDataExportInnerPage").click(function () {
    StartDataExportInnerPage();
    $(this).parents(".popupcontainer").addClass("hideDiv");
});

function ExportValidationInnerPage() {
    ExportFileTypeInner = $("#ui_ddl_ExportInnerPageFileType").val();
    if (ExportFileTypeInner != "csv" && ExportFileTypeInner != "xls" && ExportFileTypeInner != "xlsx") {
        ShowErrorMessage(GlobalErrorList.ExportData.file_selection_error);
        HidePageLoading();
        return true;
    }

    if ($("#ui_ddl_ExportInnerPageDataRange").val() == "3") {
        if ($.trim($("#ui_txtFromRangeInner").val()).length === 0) {
            ShowErrorMessage(GlobalErrorList.ExportData.nostartindex);
            $("#ui_txtFromRangeInner").focus();
            HidePageLoading();
            return true;
        }

        if ($.trim($("#ui_txToRangeInner").val()).length === 0) {
            ShowErrorMessage(GlobalErrorList.ExportData.noendindex);
            $("#ui_txToRangeInner").focus();
            HidePageLoading();
            return true;
        }

        if (!($.isNumeric($("#ui_ddl_ExportInnerPageDataRange").val()))) {
            ShowErrorMessage(GlobalErrorList.ExportData.nonnumeric);
            $("#ui_ddl_ExportInnerPageDataRange").focus();
            HidePageLoading();
            return true;
        }

        if (!($.isNumeric($("#ui_txToRangeInner").val()))) {
            ShowErrorMessage(GlobalErrorList.ExportData.nonnumeric);
            $("#ui_txToRangeInner").focus();
            HidePageLoading();
            return true;
        }

        if ((parseInt($("#ui_txToRangeInner").val()) - parseInt($("#ui_txtFromRangeInner").val())) <= 0) {
            ShowErrorMessage(GlobalErrorList.ExportData.DifferenceZero);
            $("#ui_txToRangeInner").focus();
            HidePageLoading();
            return true;
        }
    }

    return false;
}



function StartDataExportInnerPage() {
    ExportFileTypeInner = "";
    ShowPageLoading();

    if (!ExportValidationInnerPage()) {
        if (ExportFunctionNameInnerPage == undefined || ExportFunctionNameInnerPage == null || ExportFunctionNameInnerPage == '') {
            ExportFunctionNameInnerPage = "Export";
        }

        let ExportOffSetInner = InnerOffSet;
        let ExportFetchNextInner = InnerFetchNext;

        if ($("#ui_ddl_ExportInnerPageDataRange").val() == "1") {
            ExportOffSetInner = InnerOffSet;
            ExportFetchNextInner = InnerFetchNext;
        }
        else if ($("#ui_ddl_ExportInnerPageDataRange").val() == "2") {
            ExportOffSetInner = 0;
            ExportFetchNextInner = TotalInnerRowCount;
        }
        else if ($("#ui_ddl_ExportInnerPageDataRange").val() == "3") {
            ExportOffSetInner = parseInt($("#ui_txtFromRangeInner").val());
            ExportFetchNextInner = parseInt($("#ui_txToRangeInner").val());

            ExportFetchNextInner = (ExportFetchNextInner - ExportOffSetInner);
        }

        var getData = "";
        if (ExportChannel.indexOf("Mail") > -1) {
            getData = JSON.stringify({ 'AccountId': Plumb5AccountId, 'OffSet': ExportOffSetInner, 'FetchNext': ExportFetchNextInner, 'FileType': ExportFileTypeInner, });
        }
        if (ExportChannel.indexOf("WhatsApp") > -1) {
            getData = JSON.stringify({ 'AccountId': Plumb5AccountId, 'FileType': ExportFileTypeInner, 'requireddata': ExportDataOF, 'OffSet': ExportOffSetInner, 'FetchNext': ExportFetchNextInner, });
        }
        if (ExportChannel.indexOf("SMS") > -1) {
            getData = JSON.stringify({ 'AccountId': Plumb5AccountId, 'FileType': ExportFileTypeInner, 'requireddata': ExportDataOF, 'OffSet': ExportOffSetInner, 'FetchNext': ExportFetchNextInner, });
        }
        if (ExportChannel.indexOf("WebPush") > -1 || ExportChannel.indexOf("ExportGoogleAdsResponses") > -1) {
            getData = JSON.stringify({ 'AccountId': Plumb5AccountId, 'FileType': ExportFileTypeInner, 'requireddata': ExportDataOF, 'OffSet': ExportOffSetInner, 'FetchNext': ExportFetchNextInner, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime});
        }
        if (ExportChannel.indexOf("PublisherSourceReport") > -1 ) {
            getData = JSON.stringify({ 'AccountId': Plumb5AccountId, 'FileType': ExportFileTypeInner, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'OffSet': 0, 'FetchNext': 0, 'FileType': ExportFileTypeInner });
        }
        if (getData != null && ExportFunctionNameInnerPage != null) {
            $.ajax({
                url: ExportFunctionNameInnerPage,
                type: 'POST',
                data: getData,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response.Status) {
                        SaveToDiskInner(response.MainPath);
                        ResetExportValues_inner();
                        setTimeout(function () { DeleteFile(response.MainPath); }, 5000);
                        $("#ui_ContactdownloadModal").modal('hide');
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
        } else {
            HidePageLoading();
            ShowErrorMessage("Endpoint not found");
        }
    }
}

function SaveToDiskInner(fileURL) {
    window.location.assign(fileURL);
}

function ResetExportValues_inner() {
    $("#ui_ddl_ExportInnerPageFileType").val('csv');
    $("#ui_divExportInputInner").removeClass("hideDiv").addClass("hideDiv");
    $("#ui_ddl_ExportInnerPageDataRange").val('1');
    $("#ui_txtFromRangeInner").val('');
    $("#ui_txToRangeInner").val('');
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

$("#ui_ddl_ExportInnerPageDataRange").on('change', function () {
    $("#ui_divExportInputInner").removeClass("hideDiv").addClass("hideDiv");
    if ($("#ui_ddl_ExportInnerPageDataRange").val() == "3") {
        $("#ui_divExportInputInner").removeClass("hideDiv");
    }
});