var SmsSendingSettingList = [];
var checkBoxClickCount, addGroupNameList;


$(document).ready(function () {
    ExportFunctionName = "ContactArchiveExport";
    ShowPageLoading();
    HidePageLoading();
    GetUTCDateTimeRange(2);
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    ContactReportUtil.MaxCount();
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    ContactReportUtil.GetReport();
}



var ContactReportUtil = {
    MaxCount: function () {
        $.ajax({
            url: "/Prospect/ContactArchive/GetMaxCount",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'UserId': Plumb5UserId , 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = 0;
                if (response != undefined && response != null && response.returnVal > 0) {
                    TotalRowCount = response.returnVal;
                }

                if (TotalRowCount > 0) {
                    ContactReportUtil.GetReport();
                }
                else {
                    SetNoRecordContent('ui_tableReport', 7, 'ui_tbodyReportData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },

    GetReport: function () {
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/Prospect/ContactArchive/GetReportData",
            data: JSON.stringify({ 'accountId': Plumb5AccountId,'UserId': Plumb5UserId , 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext}),
            type: 'Post',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: ContactReportUtil.BindReport,
            error: ShowAjaxError
        });
    },


    BindReport: function (response) {

        SetNoRecordContent('ui_tableReport', 7, 'ui_tbodyReportData');
        if (response != undefined && response != null) {
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            var reportTableTrs;

            $.each(response, function () {

                var getStatus = $(this)[0].IsCompleted === 0 ? '<p class="mb-0 text-color-queued font-11 pt-1">Queued</p>' : $(this)[0].IsCompleted === 1 ? '<p class="mb-0 text-color-success font-11 pt-1">Completed</p>' : $(this)[0].IsCompleted === 2 ? '<p class="mb-0 text-color-progress font-11 pt-1">In-Progress</p>' : '<p class="mb-0 text-color-error font-11 pt-1">Error</p>';
                
                var progressContent = ContactReportUtil.GetProgressContent($(this)[0].TotalInputRow, $(this)[0].TotalCompletedRow);

                reportTableTrs += '<tr><td class="text-left">'+
                    '<div class="td-actionFlexSB"><div class="nametitWrap"><span class="groupNameTxt">' + $(this)[0].ImportedFileName + '</span>'+
                     '<span class="createdDateTd">' + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.CreatedDate)) + '</span>'+
                     '</div><div class="actionEclip"><a href="javascript:void(0)" onclick="ContactReportUtil.ExportArchive(' + $(this)[0].Id + ',\'' + $(this)[0].ImportedFileName + '\')"><i class="icon ion-ios-download-outline" title="Download Now"></i></a></div>' +
                     '</div></td>'+
                    '<td>' + $(this)[0].TotalInputRow + '</td>' +
                    '<td>' + $(this)[0].TotalCompletedRow + '</td>' +
                    '<td>' + $(this)[0].SuccessCount + '</td>' +
                    '<td>' + $(this)[0].RejectedCount + '</td>' +
                    '<td>' + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.UpdatedDate)) + '</td>' +
                    '<td class=""><div class="progress w-100" id="dvProgress' + $(this)[0].Id + '">' +
                    '' + progressContent + '' +
                    '</div><div id="dvProgressStatus' + $(this)[0].Id + '">' +
                    '' + getStatus + '</div></td></tr>';

                    setInterval(ContactReportUtil.UpdateOverViewProcess, 5000, $(this)[0].Id);
            });

            $("#ui_tblReportData").removeClass('no-data-records');
            $("#ui_tbodyReportData").html(reportTableTrs);
            ShowExportDiv(true);
        } else {
            ShowPagingDiv(false);
            ShowExportDiv(false);
        }
        HidePageLoading();
    },
    GetProgressContent: function (Total, Completed) {
        var content = '<div class="progress-bar bg-light" role="progressbar" style="width: 0%;" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">0%</div>';
        if (Total === 0) {
            content = '<div class="progress-bar bg-light" role="progressbar" style="width: 0%;" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">0%</div>';
        }
        else if (Total === Completed) {
            content = '<div class="progress-bar bg-success" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">100%</div>';
        } else {
            var percentage = ((Completed * 100) / Total).toFixed(2);
            content = '<div class="progress-bar bg-light" role="progressbar" style="width: ' + Math.round(percentage) + '%;" aria-valuenow="58" aria-valuemin="0" aria-valuemax="100">' + Math.round(percentage) + '%</div>';
        }
        return content;
    },
    UpdateOverViewProcess:function(id)
    {
        $.ajax({
            url: "/Prospect/ContactArchive/GetContactImportOverViewDetails",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'LmsContactRemoveOverviewId': id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response !== null) {
                    var progressContent = ContactReportUtil.GetProgressContent(response.TotalInputRow, response.TotalCompletedRow);
                    $("#dvProgress" + id).html(progressContent);

                    var getStatus = response.IsCompleted === 0 ? '<p class="mb-0 text-color-queued font-11 pt-1">Queued</p>' : response.IsCompleted === 1 ? '<p class="mb-0 text-color-success font-11 pt-1">Completed</p>' : response.IsCompleted === 2 ? '<p class="mb-0 text-color-progress font-11 pt-1">In-Progress</p>' : '<p class="mb-0 text-color-error font-11 pt-1">Error</p>';
                    $("#dvProgressStatus" + id).html(getStatus);
                }
            },
            error: ShowAjaxError
        });
    },
    ExportArchive: function (LmsContactRemoveOverviewId, ImportedFileName) {
        $.ajax({
            url: "/Prospect/ContactArchive/DownloadArchive",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'LmsContactRemoveOverviewId': LmsContactRemoveOverviewId, 'ImportedFileName': ImportedFileName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response !== null) {
                    window.open(response.File);
                }
            },
            error: ShowAjaxError
        });
    }

}


$("#BtnUpload").click(function () {
    $("#uploadtemplatefile.popupcontainer").removeClass("hideDiv");
});

$(".clseuploadpopup,#close-popup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
});


function SaveFile() {
    var fileid = "fileContact";
    ShowPageLoading();
    if ($("#" + fileid).val() != "") {
        var uploadFile = $("#" + fileid).get(0);
        var uploadedfile = uploadFile.files;
        var fromdata;
        if (typeof window.FormData == "undefined")
            fromdata = [];
        else
            fromdata = new window.FormData();
        for (var i = 0; i < uploadedfile.length; i++) {
            if (typeof window.FormData == "undefined")
                fromdata.push(uploadedfile[i].name, uploadedfile[i]);
            else
                fromdata.append(uploadedfile[i].name, uploadedfile[i]);
        }


        var choice = {};
        choice.url = "/Prospect/ContactArchive/ImportFile",
        choice.type = "POST";
        choice.data = fromdata;
        choice.contentType = false;
        choice.processData = false;
        choice.async = false;
        choice.success = function (response) {
            if (response.Status == true) {
                CallBackFunction();
                $(".popupcontainer").addClass("hideDiv");
                HidePageLoading();
            } else {
                ShowErrorMessage(response.Message);
                HidePageLoading();
            }
           
        };
        choice.error = function (result) {
            ShowErrorMessage(GlobalErrorList.ContactArchive.UploadError);
            HidePageLoading();
        };
        $.ajax(choice);
       
    }
}

$("#ui_lnkSampleFileCSV").click(function () {
    var listColumns = ["EmailId", "PhoneNumber"];

    $.ajax({
        url: "/Prospect/ContactArchive/SampleCSVFileForImport",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'Columns': listColumns }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status) {
                window.location.assign(response.MainPath);
            }
        },
        error: ShowAjaxError
    });
});