 
var DynamicClearTimeOutVars = {};
var TimeOutImportIdList = [];
var ftpFiles = [];

var contactimport = {
    ConnectionId: 0,
    Path: '',
    Files: [],
    GroupId: 0,
    LmsGroupId: 0,
    OverrideAssignment: null,
    OverrideSources: null,
    UserIdList: '',
    AssociateContactsToGrp: true,
    RemoveOldContactsFromTheGroup: false,
    ImportSource: 'FTP'
};


$(document).ready(function () {
    ExportFunctionName = "ContactImportOverViewsExport";
    $("#ui_divStartImport").addClass("hideDiv");
    GetUTCDateTimeRange(2);
    if ((window.location.href).indexOf("/ManageContact/ContactImportOverViews") != -1) {
        $("#ui_divStartImport").removeClass("hideDiv"); 
    }
    if ((window.location.href).indexOf("/Prospect/ContactImportOverViews") == -1) {
        SpreadsheetsImportDataUtil.GetAPIIRN();
    } 
    GetFTPDetails();
    BindGroupName();
    GetUserList();
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    GetMaxCount();
}

function CallBackPaging() {
    CurrentRowCount = 0;
    GetAllDetails();
}

function GetMaxCount() {
    $.ajax({
        url: "/ManageContact/ContactImportOverViews/GetMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = response;

            if (TotalRowCount > 0) {
                GetAllDetails();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 8, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetAllDetails() {
    FetchNext = GetNumberOfRecordsPerPage();
    if (TimeOutImportIdList != undefined && TimeOutImportIdList != null && TimeOutImportIdList.length > 0) {
        $.each(TimeOutImportIdList, function (i) {
            clearTimeout(DynamicClearTimeOutVars["UpdateOverViewProcess" + TimeOutImportIdList[i]]);
        });
    }

    TimeOutImportIdList = [];

    $.ajax({
        url: "/ManageContact/ContactImportOverViews/GetAllDetails",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'OffSet': OffSet, 'FetchNext': FetchNext, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindDetails,
        error: ShowAjaxError
    });
}

function BindDetails(response) {
    SetNoRecordContent('ui_tblReportData', 8, 'ui_tbodyReportData');
    if (response != undefined && response != null && response.length > 0) {
        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs = "";

        $.each(response, function () {
            let ImportedFileName = $(this)[0].ImportedFileName == null || $(this)[0].ImportedFileName == "" ? "NA" : $(this)[0].ImportedFileName.length > 45 ? $(this)[0].ImportedFileName.substring(0, 45) + ".." : $(this)[0].ImportedFileName;
            var progressContent = GetProgressContent($(this)[0].TotalInputRow, $(this)[0].TotalCompletedRow);
            var rejectLink = $(this)[0].RejectedCount;
            if ($(this)[0].RejectedCount > 0) {
                rejectLink = "<a href='javascript:void(0);' data-toggle='modal' data-target='#ui_divContactRejectFileType' onClick='ContactRejectDownLoad(" + $(this)[0].Id + ");'>" + $(this)[0].RejectedCount + "<i class='icon ion-android-arrow-down'></i></a>";
            }

            var mergeLink = $(this)[0].MergeCount;
            if ($(this)[0].MergeCount > 0) {
                mergeLink = "<a href='javascript:void(0);' data-toggle='modal' data-target='#ui_divContactMergeFileType' onClick='ContactMergeDownLoad(" + $(this)[0].Id + ");'>" + $(this)[0].MergeCount + "<i class='icon ion-android-arrow-down'></i></a>";
            }

            var Status = "";

            if ($(this)[0].IsCompleted == 0) {
                TimeOutImportIdList.push($(this)[0].Id);
                DynamicClearTimeOutVars["UpdateOverViewProcess" + $(this)[0].Id] = setTimeout(UpdateOverViewProcess, 61000, $(this)[0].Id);
                Status = "<p class='mb-0 text-color-queued font-11 pt-1'>Queued</p>";
            }
            else if ($(this)[0].IsCompleted == 1) {
                Status = "<p class='mb-0 text-color-success font-11 pt-1'>Completed</p>";
            }
            else if ($(this)[0].IsCompleted == 2) {
                TimeOutImportIdList.push($(this)[0].Id);
                DynamicClearTimeOutVars["UpdateOverViewProcess" + $(this)[0].Id] = setTimeout(UpdateOverViewProcess, 11000, $(this)[0].Id);
                Status = "<p class='mb-0 text-color-progress font-11 pt-1'>In-Progress</p>";
            }
            else if ($(this)[0].IsCompleted == 3) {
                var ErrorMessage = $(this)[0].ErrorMessage == "" ? "NA" : $(this)[0].ErrorMessage;
                Status = "<p class='mb-0 text-color-error font-11 pt-1' title='" + ErrorMessage + "'>Error</p>";
            }

            //Areas Coming from AccountMaster.js global variable 
            reportTableTrs += "<tr id='ui_tr_" + $(this)[0].Id + "'>" +
                "<td class='text-left'>" +
                "<div class='td-actionFlexSB'>" +
                "<div class='nametitWrap' title='" + $(this)[0].ImportedFileName + "'>" +
                "<span class='groupNameTxt w-150'>" + ImportedFileName + "</span>" +
                "<span class='createdDateTd'>" + $.datepicker.formatDate("M dd", GetJavaScriptDateObj($(this)[0].CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].CreatedDate)) + "</span>" +
                "</div>" +
                "<div class='actionEclip'>" +
                "<a href='/" + Areas + "/ContactImportGroupDistribution?ImportId=" + $(this)[0].Id + "'><i class='icon ion-android-people' title='Group Wise'></i></a>" +
                "<a href='/" + Areas + "/ContactImportSourceDistribution?ImportId=" + $(this)[0].Id + "'><i class='icon ion-arrow-shrink' title='Source Wise'></i></a>" +
                "</div></div></td>" +
                "<td>" + $(this)[0].TotalInputRow + "</td>" +
                "<td>" + $(this)[0].TotalCompletedRow + "</td>" +
                "<td>" + $(this)[0].SuccessCount + "</td>" +
                "<td>" + mergeLink + "</td>" +
                "<td>" + rejectLink + "</td>" +
                "<td>" + $.datepicker.formatDate("M dd", GetJavaScriptDateObj($(this)[0].UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].UpdatedDate)) + "</td>" +
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
}

function UpdateOverViewProcess(ContactImportOverviewId) {
    ShowPageLoading();
    TimeOutImportIdList = arrayRemove(TimeOutImportIdList, ContactImportOverviewId);
    clearTimeout(DynamicClearTimeOutVars["UpdateOverViewProcess" + ContactImportOverviewId]);
    $.ajax({
        url: "/ManageContact/ContactImportOverViews/GetContactImportOverViewDetails",
        type: 'Post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ 'accountId': Plumb5AccountId, "ContactImportOverviewId": ContactImportOverviewId }),
        success: function (response) {
            if (response != null) {
                var progressContent = GetProgressContent(response.TotalInputRow, response.TotalCompletedRow);

                var rejectLink = response.RejectedCount;
                if (response.RejectedCount > 0) {
                    rejectLink = "<a href='javascript:void(0);' data-toggle='modal' data-target='#ui_divContactRejectFileType' onClick='ContactRejectDownLoad(" + response.Id + ");'>" + response.RejectedCount + "<i class='icon ion-android-arrow-down'></i></a>";
                }

                var mergeLink = response.MergeCount;
                if (response.MergeCount > 0) {
                    mergeLink = "<a href='javascript:void(0);' data-toggle='modal' data-target='#ui_divContactMergeFileType' onClick='ContactMergeDownLoad(" + response.Id + ");'>" + response.MergeCount + "<i class='icon ion-android-arrow-down'></i></a>";
                }

                var Status = "";

                if (response.IsCompleted == 0) {
                    TimeOutImportIdList.push(response.Id);
                    DynamicClearTimeOutVars["UpdateOverViewProcess" + response.Id] = setTimeout(UpdateOverViewProcess, 61000, response.Id);
                    Status = "<p class='mb-0 text-color-queued font-11 pt-1'>Queued</p>";
                }
                else if (response.IsCompleted == 1) {
                    Status = "<p class='mb-0 text-color-success font-11 pt-1'>Completed</p>";
                }
                else if (response.IsCompleted == 2) {
                    TimeOutImportIdList.push(response.Id);
                    DynamicClearTimeOutVars["UpdateOverViewProcess" + response.Id] = setTimeout(UpdateOverViewProcess, 11000, response.Id);
                    Status = "<p class='mb-0 text-color-progress font-11 pt-1'>In-Progress</p>";
                }
                else if (response.IsCompleted == 3) {
                    var ErrorMessage = response.ErrorMessage == "" ? "NA" : response.ErrorMessage;
                    Status = "<p class='mb-0 text-color-error font-11 pt-1' title='" + ErrorMessage + "'>Error</p>";
                }

                $("#ui_tr_" + ContactImportOverviewId + " td:nth-child(2)").html(response.TotalInputRow);
                $("#ui_tr_" + ContactImportOverviewId + " td:nth-child(3)").html(response.TotalCompletedRow);
                $("#ui_tr_" + ContactImportOverviewId + " td:nth-child(4)").html(response.SuccessCount);
                $("#ui_tr_" + ContactImportOverviewId + " td:nth-child(5)").html(mergeLink);
                $("#ui_tr_" + ContactImportOverviewId + " td:nth-child(6)").html(rejectLink);
                $("#ui_tr_" + ContactImportOverviewId + " td:nth-child(7)").html($.datepicker.formatDate("M dd", GetJavaScriptDateObj(response.UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(response.UpdatedDate)));
                $("#ui_tr_" + ContactImportOverviewId + " td:nth-child(8)").html(progressContent + Status);
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetProgressContent(Total, Completed) {
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
}

function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele != value;
    });
}

//$("#ui_btnContactSampleDownLoad").click(function () {
//    $("#ui_ddl_SampleExportFileType").val('csv');
//    $('#ui_divContactSampleFileType').modal('toggle');
//});

$("#ui_btnContactSampleDownLoad").click(function () {
    ShowPageLoading();
    //var ExportFileType = $("#ui_ddl_SampleExportFileType").val();
    var ColumnsList = [];
    for (var i = 0; i < ContactPropertyList.length; i++) {
        ColumnsList.push(ContactPropertyList[i].FrontEndName);
    }

    $.ajax({
        url: "/ManageContact/ContactImportOverViews/SampleContactFileForImport",
        type: 'POST',
        data: JSON.stringify({
            'AccountId': Plumb5AccountId, 'Columns': ColumnsList, 'IsExtraFieldNeed': true
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

function ContactRejectDownLoad(ImportId) {
    //$($(this)).attr("ImportId");
    $("#ui_btnRejectDataExport").prop("ImportId", ImportId);
    $("#ui_ddl_RejectExportFileType").val('csv');
    $('#ui_divContactRejectFileType').modal('toggle');
}

$("#ui_btnRejectDataExport").click(function () {
    ShowPageLoading();
    var ExportFileType = $("#ui_ddl_RejectExportFileType").val();
    var ImportId = $("#ui_btnRejectDataExport").prop("ImportId");

    $.ajax({
        url: "/ManageContact/ContactImportOverViews/ContactRejectFileExport",
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
                $('#ui_divContactRejectFileType').modal('toggle');
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

function ContactMergeDownLoad(ImportId) {
    $("#ui_btnMergeDataExport").prop("ImportId", ImportId);
    $("#ui_ddl_MergeExportFileType").val('csv');
    $('#ui_divContactMergeFileType').modal('toggle');
}

$("#ui_btnMergeDataExport").click(function () {
    ShowPageLoading();
    var ExportFileType = $("#ui_ddl_MergeExportFileType").val();
    var ImportId = $("#ui_btnMergeDataExport").prop("ImportId");

    $.ajax({
        url: "/ManageContact/ContactImportOverViews/ContactMergeFileExport",
        type: 'POST',
        data: JSON.stringify({
            'AccountId': Plumb5AccountId, 'ImportId': ImportId, 'FileType': ExportFileType
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status) {
                $("#ui_btnMergeDataExport").removeProp("ImportId");
                window.location.assign(response.MainPath);
                $('#ui_divContactMergeFileType').modal('toggle');
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

$("#ui_aStartImport").click(function () {
    ShowPageLoading();
    $.ajax({
        url: "/ManageContact/ContactImportOverViews/CheckContactSetting/",
        type: 'POST',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != undefined && response != null && response.Status != undefined && response.Status != null && response.Status) {
                //Areas Coming from AccountMaster.js global variable 
                window.location.href = "/" + Areas + "/ContactImport/";
            }
            else {
                $('#ui_divContactSetting').modal('show');
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});



//FTP
function GetFTPDetails() {
    $.ajax({
        url: "/ManageContact/FtpImportSettings/GetFTPConnectionList",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response && response.length > 0) {
                $.each(response, function () {
                    $("#ui_connectionnames").append($('<option value="' + this.Id + '" >' + this.ConnectionName + '</option>'));
                });
            }
        },
        error: ShowAjaxError
    });
}


$("#ui_aviaftpbtn").click(function () {
    $("#dvFTPcontact").removeClass("hideDiv");
    $(".popuptitle h6").html("Select FTP Connection");
});

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
    $(".errmsgemlvalidwrp .ion-ios-information").popover("hide");
});


$("#testFtpConnect").click(function () {
    $(".spinnerftpwrp").removeClass("hideDiv");
    setTimeout(function () {
        $(".spinnerftpwrp").addClass("hideDiv");
        $(".ftpsuccesswrp").removeClass("hideDiv");
        $("#addconnectbtn").removeAttr("disabled");
    }, 2000);
    setTimeout(function () {
        $(".ftpsuccesswrp").addClass("hideDiv");
    }, 4000);
});

$("#ftpconnectbtn").click(function () {
    if ($("#ui_connectionnames").val() == "0") {
        ShowErrorMessage(GlobalErrorList.ExportData.FtpSelectConnectionName);
        return false;
    }

    let path = "";
    if ($("#ftpeditfldinpt").val() != undefined && $("#ftpeditfldinpt").val() != null && $("#ftpeditfldinpt").val() != "") {
        let dir = $("#ftpeditfldinpt").val();
        path = dir.substring(dir.indexOf('/') + 1);
    }


    $(".spinnerftpwrp").removeClass("hideDiv");

    $.ajax({
        url: "/ManageContact/FtpImportSettings/GetFtpDirectory",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'connectionId': $("#ui_connectionnames").val(), 'path': path }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response && response.result) {

                if (response.directories != undefined && response.directories != null && response.directories.length > 0) {
                    $("#ui_filesdata").empty();

                    $("#ftpeditfldinpt").val($("#ui_connectionnames :selected").text() + "/" + path);

                    ftpFiles.length = 0;
                    for (let i = 0; i < response.directories.length; i++) {
                        if (response.directories[i] != null && response.directories[i] != "" && response.directories[i].length > 0) {
                            let data = response.directories[i];
                            data = data.substring(data.lastIndexOf("/") + 1);
                            ftpFiles.push(data);
                            bindfilesdata(i, data);
                            LoadIndividualUser();
                        }
                    }

                } else {
                    ShowErrorMessage(GlobalErrorList.ExportData.FtpNoFiles);
                }

                $(".spinnerftpwrp").addClass("hideDiv");
                $("#ftpfilecontactlist, .inptftpwrp").removeClass("hideDiv");

            } else {
                $(".spinnerftpwrp").addClass("hideDiv");
                ShowErrorMessage(response.result.message);
            }
        },
        error: function (error) {
            $(".spinnerftpwrp").addClass("hideDiv");
            ShowAjaxError(error);
        }
    });

});


function bindfilesdata(i, data) {
    let datas = `<tr>
                    <td class="text-center">
                        <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input lmsleadpropSelIndiv" id="leadpropone_${i}" value="${data}"
                                    name="example1">
                            <label class="custom-control-label" for="leadpropone_${i}"></label>
                        </div>
                    </td>
                    <td class="text-left">${data}</td>
                    <td class="text-left hideDiv">0</td>
                </tr>`;

    $("#ui_filesdata").append(datas);
}

function BindGroupName() {
    $.ajax({
        url: "/ManageContact/Group/GetGroupsByStaticOrDynamic",
        type: "POST",
        data: JSON.stringify({ 'accountId': Plumb5AccountId, GroupType: 1 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null && response.GroupDetails != null) {
                $.each(response.GroupDetails, function () {
                    $("#ui_addgroupdetails, #ui_drpdwn_GroupName,#ui_drpdwn_GroupNameadwords").append($('<option value="' + this.Id + '" >' + this.Name + '</option>'));
                });
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}

$('#ui_addgroupdetails,#ui_connectionnames').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$(".filesearchicn").click(function () {
    BindSearchedData();
});

$("#protocolnum").keyup(function (e) {
    if (e.which && e.which === 8 || e.keyCode && e.keyCode === 46) {
        if ($("#protocolnum").val() == "" && $("#protocolnum").val().length == 0) {
            $("#ui_filesdata").empty();
            if (ftpFiles != null && ftpFiles.length > 0) {
                for (let i = 0; i < ftpFiles.length; i++) {
                    if (ftpFiles[i] != null && ftpFiles[i] != "" && ftpFiles[i].length > 0) {
                        bindfilesdata(i, ftpFiles[i]);
                    }
                }
            } else {
                $("#ui_filesdata").append(`<tr><td colspan="2" class="border-bottom-0"><div class="no-data ">There is no data for this view.</div></td></tr>`);
            }
        }
    }
});


$("#protocolnum").keypress(function (e) {
    if (e.which == 13) {
        BindSearchedData();
    }
});

function BindSearchedData() {
    let searchkeywords = [];
    searchkeywords.push($("#protocolnum").val());
    let regex = new RegExp(searchkeywords.join("|"));
    result = $.grep(ftpFiles, function (s) { return s.match(regex) });

    $("#ui_filesdata").empty();
    if (result != null && result.length > 0) {
        for (let i = 0; i < result.length; i++) {
            if (result[i] != null && result[i] != "" && result[i].length > 0) {
                bindfilesdata(i, result[i]);
            }
        }
    } else {
        $("#ui_filesdata").append(`<tr><td colspan="2" class="border-bottom-0"><div class="no-data ">There is no data for this view.</div></td></tr>`);
    }
}


$(".lmsleadpropAll").click(function () {
    if ($(".lmsleadpropAll").is(":checked")) {
        $(".lmsleadpropSelIndiv").prop("checked", true);
    } else {
        $(".lmsleadpropSelIndiv").prop("checked", false);
    }
});

$("#ftprooteditfld").click(function () {
    if ($("#ftpeditfldinpt").hasClass("inptftp")) {
        $("#ftpeditfldinpt").removeClass("inptftp");
        $("#ftprootclsefld").removeClass("hideDiv");
        $("#ftprooteditfld").addClass("hideDiv");
    } else {
        $("#ftpeditfldinpt").addClass("inptftp");
        $("#ftprootclsefld").addClass("hideDiv");
        $("#ftprooteditfld").removeClass("hideDiv");
    }
});

$("#ftprootclsefld").click(function () {
    $("#ftpeditfldinpt").addClass("inptftp");
    $("#ftprootclsefld").addClass("hideDiv");
    $("#ftprooteditfld").removeClass("hideDiv");
});

function LoadIndividualUser() {
    $("#ui_chkAssignUser").click(function () {
        let IsAssignUserChecked = $('input[id="ui_chkAssignUser"]').prop('checked');
        if (IsAssignUserChecked == true) {
            $('#ui_divUserPopUp').modal();
        }
    });

    $("#ui_btnCloseUserPopUp,#ui_btnTopCloseUserPopUp").click(function () {
        $('input[id="ui_chkAssignUser"]').prop('checked', false);
        $("#ui_divUserPopUp").modal('hide');
    });
}

GetUserList = function () {
    $.ajax({
        url: "/Prospect/Leads/GetUser",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (userDetails) {
            $.each(userDetails, function (i) {
                if ($(this)[0].ActiveStatus) {
                    $('#ui_ddlUserList').append($("<option></option>").attr("value", $(this)[0].UserInfoUserId).text($(this)[0].FirstName));
                }
            });
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}

$("#ui_ddlUserList").select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$("#ui_btnSaveUserData").click(function () {
    var SelectedUserList = $('#ui_ddlUserList').val();

    if (SelectedUserList == null) {
        ShowErrorMessage(GlobalErrorList.ContactImport.NoUserSelected);
        return;
    } else {
        $("#ui_divUserPopUp").modal('hide');
    }
});

$("#startImprtbtn").click(function () {
    if ($("#ui_addgroupdetails :selected").val() == "0") {
        ShowErrorMessage(GlobalErrorList.Manage_Group.name_error);
        return false;
    }

    contactimport.GroupId = $("#ui_addgroupdetails :selected").val();

    if ($("#existContacts").is(":checked")) {
        contactimport.AssociateContactsToGrp = false;
    }

    if ($("#removeContacts").is(':checked')) {
        contactimport.RemoveOldContactsFromTheGroup = true;
    }

    if ($("#retainassignconts").is(':checked')) {
        contactimport.OverrideAssignment = true;
    }

    if ($("#retainassignconts").is(':checked')) {
        contactimport.OverrideAssignment = true;
    }

    if ($("#ui_chkAssignUser").is(':checked')) {
        var SelectedUserList = $('#ui_ddlUserList').val();
        if (SelectedUserList != null) {
            contactimport.UserIdList = SelectedUserList.join(",");
        }
    }

    if ($("#overridesources").is(':checked')) {
        contactimport.OverrideSources = true;
    }

    let filedata = new Array();
    let isfilechecked = true;
    $(".lmsleadpropSelIndiv:checked").each(function () {
        if ($(this).val().includes("csv") || $(this).val().includes("xlsx") || $(this).val().includes("xls")) {
            filedata.push($(this).val());
        } else {
            isfilechecked = false;
        }
    });

    if (!isfilechecked) {
        ShowErrorMessage(GlobalErrorList.Manage_Group.SelectCsvOrXlsOrXlxsFile);
        return;
    }

    contactimport.Files = filedata;
    contactimport.ConnectionId = $("#ui_connectionnames").val();

    if ($("#ftpeditfldinpt").val() != undefined && $("#ftpeditfldinpt").val() != null && $("#ftpeditfldinpt").val() != "") {
        let dir = $("#ftpeditfldinpt").val();
        contactimport.Path = dir.substring(dir.indexOf('/') + 1);
    }

    if (contactimport.Files != null && contactimport.Files.length > 0) {
        ShowPageLoading();
        $.ajax({
            url: "/ManageContact/ContactImport/FTPInitiateImport",
            type: 'POST',
            data: JSON.stringify({ 'accountid': Plumb5AccountId, 'ftpContactImport': contactimport, 'ContactPropertyList': ContactPropertyList }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status) {
                    ShowSuccessMessage(response.Message);
                    setTimeout(function () { location.reload(); }, 3000);
                } else {
                    ShowErrorMessage(response.Message);
                }

                HidePageLoading();
            },
            error: ShowAjaxError
        });
    } else {
        ShowErrorMessage(GlobalErrorList.Manage_Group.FTPNotSelected);
    }
});

$("#ui_aviaapibtn").click(function () {
    $("#dvAPIcontact").removeClass("hideDiv");
});

$('#ui_btn_CopyScript').click(function () {
    var range = document.createRange();
    range.selectNode(document.getElementById('ui_code_AccountScriptDetails'));
    window.getSelection().addRange(range);
    document.execCommand("copy");
});

$("#ui_aviagooglesheetbtn").click(function () {
    SpreadsheetsImportDataUtil.GetLiveSheetDetails('bulkimport');
    $("#dvGScontact").removeClass("hideDiv");
    $("#dvgoogleadwords").addClass("hideDiv");
    $(".popuptitle h6").html("GOOGLE LIVE SHEET CONNECTION");
   
}); 
$("#ui_aviagoogleadwordsbtn").click(function () {
    AdwordsImportDataUtil.GetLeadProperties();
    AdwordsImportDataUtil.Getlmscustomfields();
    AdwordsImportDataUtil.BindLmsSource();
    AdwordsImportDataUtil.GetadwordDetails();
    $("#dvgoogleadwords").removeClass("hideDiv");
    $("#dvGScontact").addClass("hideDiv");
    $(".popuptitle h6").html("GOOGLE ADWORDS");
});
