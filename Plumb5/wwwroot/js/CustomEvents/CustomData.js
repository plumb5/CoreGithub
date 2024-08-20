var SearchName = "";

$(document).ready(function () {
    CustomDataUtil.GetMaxCount();
    ExportFunctionName = "CustomDataExport";
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    CustomDataUtil.GetMaxCount();
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    CustomDataUtil.GetReport();
}

var CustomDataUtil = {
    GetMaxCount: function () {
        SearchName = CleanText($.trim($('#ui_txt_DataSearch').val()));
        SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
        $.ajax({
            url: "/CustomEvents/CustomData/GetMaxCount",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'SearchName': SearchName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                TotalRowCount = result.returnVal;
                if (TotalRowCount > 0)
                    CustomDataUtil.GetReport();
                else
                    HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    GetReport: function () {
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/CustomEvents/CustomData/GetAllDetails",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'OffSet': OffSet, 'FetchNext': FetchNext, 'SearchName': SearchName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: CustomDataUtil.BindReport,
            error: ShowAjaxError
        });
    },
    BindReport: function (response) {
        SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
        if (response != undefined && response != null) {
            CurrentRowCount = response.length;
            $("#ui_tbodyReportData").empty();
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            $("#ui_tblReportData").removeClass('no-data-records');
            $.each(response, function (index) {
                CustomDataUtil.BindingContent(this, index);
            });

            ShowExportDiv(true);
        }
        else {
            $('.searchCampWrap').hide();
            ShowExportDiv(false);
        }
        HidePageLoading();
    },
    BindingContent: function (response, i) {
        var Status = response.IsCompleted == 0 ? "Queued" : response.IsCompleted == 3 ? "Failed" : response.IsCompleted == 1 ? "Completed" : "Running";
        var StatusClass = response.IsCompleted == 3 ? "text-color-error" : response.IsCompleted == 1 ? "text-color-success" : "text-color-blue";

        var failedReason = "";
        if (response.IsCompleted == 3 && response.ErrorMessage != null) {
            failedReason = `<i id="creditalerticn_${i}" class="icon ion-ios-information creditalertblink" data-toggle="popover" data-trigger="hover" data-content="${response.ErrorMessage}" data-original-title="" title=""></i>`;
        }

        var RejectCountTd = response.RejectedCount == 0 ? `<a href="javascript:void(0);">0 <i class="icon ion-android-arrow-down"></i></a>` : `<a href='javascript:void(0);' data-toggle='modal' data-target='#downloadRejectfile' onClick='CustomDataRejectDownLoad(${response.Id});'>${response.RejectedCount}<i class='icon ion-android-arrow-down'></i></a>`;

        var content = `<tr>
                            <td>
                                <div class="groupnamewrap">
                                    <div class="nameTxtWrap">
                                       ${response.ImportedFileName}
                                    </div>
                                </div>
                            </td>
                            <td class="text-center ${StatusClass}">${Status} ${failedReason}</td>                            
                            <td class="text-center">${response.TotalInputRow}</td>
                            <td class="text-center">${response.SuccessCount}</td>
                            <td>${RejectCountTd}</td>
                            <td>${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response.UpdatedDate)) + ' ' + PlumbTimeFormat(GetJavaScriptDateObj(response.UpdatedDate))}</td>
                        </tr>`;

        $("#ui_tbodyReportData").append(content);
        $(`#creditalerticn_${i}`).popover();
        //return content;
    }
};

function CustomDataRejectDownLoad(ImportId) {
    //$($(this)).attr("ImportId");
    $("#ui_btnRejectDataExport").prop("ImportId", ImportId);
    $("#ui_ddl_RejectExportFileType").val('csv');
    $('#downloadRejectfile').modal('toggle');
}


$(document).on('click', "#ui_btnRejectDataExport", function () {
    ShowPageLoading();
    var ExportFileType = $("#ui_ddl_RejectExportFileType").val();
    var ImportId = $("#ui_btnRejectDataExport").prop("ImportId");

    $.ajax({
        url: "/CustomEvents/CustomData/RejectFileExport",
        type: 'POST',
        data: JSON.stringify({
            'AccountId': Plumb5AccountId, 'ImportId': ImportId, 'FileType': ExportFileType
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status) {
                $("#ui_btnRejectDataExport").removeProp("ImportId");
                window.location.assign(response.MainPath);
                $('#downloadRejectfile').modal('toggle');
            }
            else {
                ShowErrorMessage(GlobalErrorList.ExportData.session_expired);
                setTimeout(function () { window.location.href = "/Login"; }, 3000);
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});

$("#ui_txt_DataSearch").keydown(function (event) {
    if (event.keyCode == 13) {
        if (CleanText($.trim($('#ui_txt_DataSearch').val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.CustomData.ErrorFileName);
            return false;
        }

        CallBackFunction();
        event.preventDefault();
        return false;
    }
});

document.getElementById("ui_txt_DataSearch").addEventListener("keyup", function (event) {
    const key = event.key;
    if (key === "Backspace") {
        if (CleanText($.trim($('#ui_txt_DataSearch').val())).length == 0) {
            SearchName = "";
            CallBackFunction();
        }
    }
    event.preventDefault();
    return false;
});

$(".serchicon").click(function () {
    if (CleanText($.trim($('#ui_txt_DataSearch').val())).length == 0) {
        ShowErrorMessage(GlobalErrorList.CustomData.ErrorFileName);
        return false;
    }
    CallBackFunction();
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