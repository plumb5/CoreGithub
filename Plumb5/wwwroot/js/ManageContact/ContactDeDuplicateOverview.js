var uploadedFormData = typeof window.FormData == "undefined" ? [] : new window.FormData();
var fileData;
var DynamicClearTimeOutVars = {};
$(document).ready(function () {
    ExportFunctionName = "ManageDuplicateExport";
    GetUTCDateTimeRange(2);
});
function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    ContactDeDuplicateUtill.GetMaxCount();
}
function CallBackPaging() {
    CurrentRowCount = 0;
    ContactDeDuplicateUtill.GetReport();
}
var ContactDeDuplicateUtill =
{
    GetMaxCount: function () {
        $.ajax({
            url: "/ManageContact/ContactDeduplicateOverview/GetMaxCount",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = response;

                if (TotalRowCount > 0) {
                    ContactDeDuplicateUtill.GetReport();
                }
                else {
                    SetNoRecordContent('ui_tblReportData', 8, 'ui_tbodyReportData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetReport: function () {
        FetchNext = GetNumberOfRecordsPerPage();

        $.ajax({
            url: "/ManageContact/ContactDeduplicateOverview/GetDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'OffSet': OffSet, 'FetchNext': FetchNext, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: ContactDeDuplicateUtill.BindReport,
            error: ShowAjaxError
        });
    },
    BindReport: function (response) {
        SetNoRecordContent('ui_tblReportData', 8, 'ui_tbodyReportData');
        if (response != undefined && response != null && response.length > 0) {
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

            var reportTableTrs = "";

            $.each(response, function () {

                var progressContent = ContactDeDuplicateUtill.GetProgressContent(this.TotalCounts, this.TotalCompleted);
                var UniqueCountsLink = this.UniqueCounts;
                var ExistingCountsLink = this.ExistingCounts;
                var DuplicateCountsLink = this.DuplicateCounts;

                var Status = "";
                if (this.IsCompleted == 0) {
                    //TimeOutImportIdList.push($(this)[0].Id);
                    DynamicClearTimeOutVars["UpdateOverViewProcess" + $(this)[0].Id] = setTimeout(ContactDeDuplicateUtill.UpdateOverViewProcess, 61000, $(this)[0].Id);
                    Status = "<p class='mb-0 text-color-queued font-11 pt-1'>Queued</p>";
                }
                else if (this.IsCompleted == 1) {
                    if (this.UniqueCounts > 0)
                        UniqueCountsLink = "<a href='javascript:void(0);' data-toggle='modal' data-target='#ui_divUniqueContactsFileType' onClick='ContactDeDuplicateUtill.DownloadFileContent(" + this.Id + ",\"NewContacts\");'>" + this.UniqueCounts + "<i class='icon ion-android-arrow-down' title='Download File'></i></a>";

                    if (this.ExistingCounts > 0)
                        ExistingCountsLink = "<a href='javascript:void(0);' data-toggle='modal' data-target='#ui_divExistinContactsFileType' onClick='ContactDeDuplicateUtill.DownloadFileContent(" + this.Id + ",\"ExistingContacts\");'>" + this.ExistingCounts + "<i class='icon ion-android-arrow-down' title='Download File'></i></a>";

                    if (this.DuplicateCounts > 0)
                        DuplicateCountsLink = "<a href='javascript:void(0);' data-toggle='modal' data-target='#ui_divExistinContactsFileType' onClick='ContactDeDuplicateUtill.DownloadFileContent(" + this.Id + ",\"DuplicateContacts\");'>" + this.DuplicateCounts + "<i class='icon ion-android-arrow-down' title='Download File'></i></a>";

                    Status = "<p class='mb-0 text-color-success font-11 pt-1'>Completed</p>";
                }
                else if (this.IsCompleted == 2) {
                    // TimeOutImportIdList.push($(this)[0].Id);
                    DynamicClearTimeOutVars["UpdateOverViewProcess" + $(this)[0].Id] = setTimeout(ContactDeDuplicateUtill.UpdateOverViewProcess, 11000, $(this)[0].Id);
                    Status = "<p class='mb-0 text-color-progress font-11 pt-1'>In-Progress</p>";
                }
                else if (this.IsCompleted == 3) {
                    var ErrorMessage = this.ErrorMessage == "" ? "NA" : this.ErrorMessage;
                    Status = "<p class='mb-0 text-color-error font-11 pt-1' title='" + ErrorMessage + "'>Error</p>";
                }
                reportTableTrs += "<tr id='ui_tr_" + this.Id + "'>" +
                    "<td class='text-left'><div class='td-actionFlexSB'><div class='nametitWrap' title='" + this.ImportedFileName + "'><span class='groupNameTxt'>" + this.ImportedFileName + "</span><span class='createdDateTd'>" + $.datepicker.formatDate("M dd", GetJavaScriptDateObj(this.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.CreatedDate)) + "</span></div></div></td>" +
                    "<td>" + this.TotalCounts + "</td>" +
                    "<td>" + UniqueCountsLink + "</td>" +
                    "<td>" + ExistingCountsLink + "</td>" +
                    "<td>" + DuplicateCountsLink + "</td>" +
                    "<td>" + $.datepicker.formatDate("M dd", GetJavaScriptDateObj(this.UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.UpdatedDate)) + "</td>" +
                    "<td>" + progressContent + Status + "</td>" +
                    "</tr>";
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
        var content = "<div class='progress w-100'><div class='progress-bar bg-success' role='progressbar' style='width: 0%;' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100'>0%</div></div>";
        if (Total == 0) {
            content = "<div class='progress w-100'><div class='progress-bar bg-success' role='progressbar' style='width: 0%;' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100'>0%</div></div>";
        }
        else if (Total == Completed) {
            content = "<div class='progress w-100'><div class='progress-bar bg-success' role='progressbar' style='width: 100%;' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100'>100%</div></div>";
        } else {
            var percentage = ((Completed * 100) / Total).toFixed(2);
            content = "<div class='progress w-100'><div class='progress-bar bg-success' role='progressbar' style='width: " + percentage + "%;' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100'>" + percentage + "%</div></div>";
        }
        return content;
    },
    DownloadFileContent: function (Id, ContactFileType) {
        $("#ui_btnContactDataExport").prop("Id", Id);
        $("#ui_btnContactDataExport").prop("ContactFileType", ContactFileType);
        $("#ui_ddl_ContactsExportFileType").val('csv');
        $('#ui_divContactsFileType').modal('toggle');

    },
    DownloadExistinContactsDetails: function () {

    },
    DownloadDuplicateContactsDetails: function () {

    },
    //InitiateImport: function (fileData) {
    //    ShowPageLoading();
    //    if (ContactDeDuplicateUtill.ValidateFile(fileData)) {
    //        uploadedFormData = typeof window.FormData == "undefined" ? [] : new window.FormData();
    //        uploadedFormData.append('ContactFile', fileData);

    //    }
    //    HidePageLoading();
    //},
    SaveFileContent: function () {
        ShowPageLoading();
        if (ContactDeDuplicateUtill.ValidateFile()) {
            $(".popupcontainer").addClass("hideDiv");
            uploadedFormData = typeof window.FormData == "undefined" ? [] : new window.FormData();
            uploadedFormData.append('ContactFile', fileData);

            $.ajax({
                url: "/ManageContact/ContactDeduplicateOverview/SaveImportedFileContent?AccountId=" + Plumb5AccountId + "&UserInfoUserId=" + Plumb5UserId + "",
                type: 'POST',
                data: uploadedFormData,
                contentType: false,
                processData: false,
                dataType: "json",
                success: function (response) {
                    if (response > 0) {
                        $('#ui_btnChooseFile').val('');

                        ContactDeDuplicateUtill.GetMaxCount();
                        ShowSuccessMessage(GlobalErrorList.ManageDuplicates.importSuccess);
                    }
                    else {
                        ShowErrorMessage(GlobalErrorList.ManageDuplicates.fileUploadError);
                    }

                },
                error: ShowAjaxError
            });

        }

        HidePageLoading();
    },
    ValidateFile: function () {
        if ($('#ui_btnChooseFile').val() == '') {
            ShowErrorMessage(GlobalErrorList.ManageDuplicates.fileNotSelected);
            HidePageLoading();
            return false;
        }
        if (fileData != undefined && fileData != null) {
            var uploadedFileExtension = fileData.name.split('.').pop().toLowerCase();
            if (uploadedFileExtension != "csv" && uploadedFileExtension != "xls" && uploadedFileExtension != "xlsx") {
                ShowErrorMessage(GlobalErrorList.ManageDuplicates.inValidFileType);
                $('#ui_btnChooseFile').val('');
                HidePageLoading();
                return false;
            }
        }
        else {
            ShowErrorMessage(GlobalErrorList.ManageDuplicates.fileUploadError);
            HidePageLoading();
            return false;
        }
        return true;
    },
    UpdateOverViewProcess: function (Id) {
        ShowPageLoading();
        //TimeOutImportIdList = arrayRemove(TimeOutImportIdList, ContactImportOverviewId);
        clearTimeout(DynamicClearTimeOutVars["UpdateOverViewProcess" + Id]);
        $.ajax({
            url: "/ManageContact/ContactDeduplicateOverview/GetContactDeDuplicateImportOverViewDetails",
            type: 'Post',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ 'accountId': Plumb5AccountId, "Id": Id }),
            success: function (response) {
                if (response != null) {
                    var progressContent = ContactDeDuplicateUtill.GetProgressContent(response.TotalCounts, response.TotalCompleted);
                    var UniqueCountsLink = response.UniqueCounts;

                    var ExistingCountsLink = response.ExistingCounts;

                    var DuplicateCountsLink = response.DuplicateCounts;


                    var Status = "";

                    if (response.IsCompleted == 0) {
                        //TimeOutImportIdList.push(response.Id);
                        DynamicClearTimeOutVars["UpdateOverViewProcess" + response.Id] = setTimeout(ContactDeDuplicateUtill.UpdateOverViewProcess, 61000, response.Id);

                        Status = "<p class='mb-0 text-color-queued font-11 pt-1'>Queued</p>";
                    }
                    else if (response.IsCompleted == 1) {
                        if (response.UniqueCounts > 0)
                            UniqueCountsLink = "<a href='javascript:void(0);' data-toggle='modal' data-target='#ui_divUniqueContactsFileType' onClick='ContactDeDuplicateUtill.DownloadFileContent(" + response.Id + ",\"NewContacts\");'>" + response.UniqueCounts + "<i class='icon ion-android-arrow-down' title='Download File'></i></a>";

                        if (response.ExistingCounts > 0)
                            ExistingCountsLink = "<a href='javascript:void(0);' data-toggle='modal' data-target='#ui_divExistinContactsFileType' onClick='ContactDeDuplicateUtill.DownloadFileContent(" + response.Id + ",\"ExistingContacts\");'>" + response.ExistingCounts + "<i class='icon ion-android-arrow-down' title='Download File'></i></a>";

                        if (response.DuplicateCounts > 0)
                            DuplicateCountsLink = "<a href='javascript:void(0);' data-toggle='modal' data-target='#ui_divExistinContactsFileType' onClick='ContactDeDuplicateUtill.DownloadFileContent(" + response.Id + ",\"DuplicateContacts\");'>" + response.DuplicateCounts + "<i class='icon ion-android-arrow-down' title='Download File'></i></a>";

                        Status = "<p class='mb-0 text-color-success font-11 pt-1'>Completed</p>";
                        // ContactDeDuplicateUtill.GetMaxCount();
                    }
                    else if (response.IsCompleted == 2) {
                        // TimeOutImportIdList.push(response.Id);
                        DynamicClearTimeOutVars["UpdateOverViewProcess" + response.Id] = setTimeout(ContactDeDuplicateUtill.UpdateOverViewProcess, 11000, response.Id);
                        Status = "<p class='mb-0 text-color-progress font-11 pt-1'>In-Progress</p>";
                    }
                    else if (response.IsCompleted == 3) {
                        var ErrorMessage = response.ErrorMessage == "" ? "NA" : response.ErrorMessage;
                        Status = "<p class='mb-0 text-color-error font-11 pt-1' title='" + ErrorMessage + "'>Error</p>";
                    }

                    $("#ui_tr_" + Id + " td:nth-child(2)").html(response.TotalCounts);
                    $("#ui_tr_" + Id + " td:nth-child(3)").html(UniqueCountsLink);
                    $("#ui_tr_" + Id + " td:nth-child(4)").html(ExistingCountsLink);
                    $("#ui_tr_" + Id + " td:nth-child(5)").html(DuplicateCountsLink);
                    $("#ui_tr_" + Id + " td:nth-child(6)").html($.datepicker.formatDate("M dd", GetJavaScriptDateObj(response.UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(response.UpdatedDate)));
                    $("#ui_tr_" + Id + " td:nth-child(7)").html(progressContent + Status);
                    //$("#ui_tr_" + ContactImportOverviewId + " td:nth-child(8)").html(progressContent + Status);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    CheckColumnNames: function () {
        ShowPageLoading();
        uploadedFormData = typeof window.FormData == "undefined" ? [] : new window.FormData();
        uploadedFormData.append('ContactFile', fileData);
        $.ajax({
            url: "/ManageContact/ContactDeduplicateOverview/CheckForColumns",
            type: 'POST',
            data: uploadedFormData,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function (response) {
                if (!response) {
                    ShowErrorMessage(GlobalErrorList.ManageDuplicates.ColumnsNotMatchingError);
                    $('#ui_btnChooseFile').val('');
                }
            },
            error: ShowAjaxError
        });
        HidePageLoading();
    }

};
//$("#ui_btnContactDeDuplicateSampleDownLoad").click(function () {
//    $("#ui_ddl_DeDuplicateSampleExportFileType").val('csv');
//    $('#ui_divContactDeDuplicateSampleFileType').modal('toggle');
//});

$("#ui_btnContactDeDuplicateSampleDownLoad").click(function () {
    ShowPageLoading();
    //var ExportFileType = $("#ui_ddl_DeDuplicateSampleExportFileType").val();
    $.ajax({
        url: "/ManageContact/ContactDeduplicateOverview/SampleDeDuplicateContactFileForImport",
        type: 'POST',
        data: JSON.stringify({
            'AccountId': Plumb5AccountId
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status) {
                window.location.assign(response.MainPath);
                //$('#ui_divContactSampleFileType').modal('toggle');
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

$("#ui_btnContactDataExport").click(function () {
    ShowPageLoading();
    var ExportFileType = $("#ui_ddl_ContactsExportFileType").val();
    var Id = $("#ui_btnContactDataExport").prop("Id");
    var ContactFileType = $("#ui_btnContactDataExport").prop("ContactFileType");
    $.ajax({
        url: "/ManageContact/ContactDeduplicateOverview/DownLoadFileContent",
        type: 'POST',
        data: JSON.stringify({
            'AccountId': Plumb5AccountId, 'Id': Id, 'FileType': ExportFileType, 'ContactFileType': ContactFileType
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status) {
                $("#ui_btnContactDataExport").removeProp("Id");
                $("#ui_btnContactDataExport").removeProp("ContactFileType");
                window.location.assign(response.MainPath);
            }
            else {
                ShowErrorMessage(GlobalErrorList.ExportData.session_expired);
                setTimeout(function () { window.location.href = "/Login"; }, 3000);
            }
            $('#ui_divContactsFileType').modal('toggle');
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});
$(".uplddupconts").click(function () {
    $(".popupcontainer").removeClass("hideDiv");
});
$("#close-popup, .clsepopup").click(function () {
    $('#ui_btnChooseFile').val('');
    $(this).parents(".popupcontainer").addClass("hideDiv");
});
$("#ui_btnChooseFile").change(function () {
    fileData = $(this)[0].files[0];
    ContactDeDuplicateUtill.ValidateFile();
    ContactDeDuplicateUtill.CheckColumnNames();

});

$("#ui_btnUpload").click(function () {
    ShowPageLoading();
    ContactDeDuplicateUtill.SaveFileContent();
});



