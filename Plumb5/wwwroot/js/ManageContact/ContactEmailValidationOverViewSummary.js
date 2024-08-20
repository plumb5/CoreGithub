
$(document).ready(function () {
    ExportFunctionName = "EmailValidationExport";
    GetUTCDateTimeRange(2);
    GetAndBindGroups();
});

function LoadOverViewPage() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    GetMaxCount();
}

function CallBackFunction() {
    LoadOverViewPage();
}

function CallBackPaging() {
    CurrentRowCount = 0;
    GetReportDetails();
}

function GetMaxCount() {
    var GroupName = CleanText($('#ui_txtSearchName').val());

    $.ajax({
        url: "/ManageContact/ContactEmailValidationOverView/GetOverAllMaxCount",
        type: 'Post',
        data: JSON.stringify({
            'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'GroupName': GroupName
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = response;

            if (TotalRowCount > 0) {
                GetReportDetails();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReportDetails() {
    FetchNext = GetNumberOfRecordsPerPage();

    var GroupName = CleanText($('#ui_txtSearchName').val());

    $.ajax({
        url: "/ManageContact/ContactEmailValidationOverView/GetOverAllReportDetails",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'GroupName': GroupName, 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: BindReportDetails,
        error: ShowAjaxError
    });
}

function BindReportDetails(response) {
    SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');

    if (response != undefined && response != null && response.length > 0) {

        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs = "";

        $.each(response, function () {

            var filedetailicon = "";
            var Progressbarpercentage, progressbarclass, Status;
            if (this.ErrorMessage != "" && this.ErrorMessage != null) {
                progressbarclass = 'progress-bar bg-light';
                Progressbarpercentage = 0;
                Status = '<p class="mb-0 text-color-error font-11 pt-1" title="' + this.ErrorMessage + '">Error</p>';
                filedetailicon = "<i class='icon ion-ios-information' title='file details' data-toggle='popover' onclick=ShowFileDetail('" + this.Id + "') ></i>";
            }
            //else if (this.Unique_emails == 0 && this.Status == 'finished') {
            //    progressbarclass = 'progress-bar bg-light';
            //    Progressbarpercentage = 0;
            //    Status = '<p class="mb-0 text-color-queued font-11 pt-1">In-Queue</p>';
            //    filedetailicon = "<i class='icon ion-ios-information' title='file details' data-toggle='popover' onclick=ShowFileDetail('" + this.Id + "') ></i>";
            //}
            else if (this.Status == 'finished') {
                progressbarclass = 'progress-bar bg-success';
                Progressbarpercentage = 100;
                Status = '<p class="mb-0 text-color-success font-11 pt-1">Completed</p>';
                filedetailicon = "<i class='icon ion-ios-information' title='file details' data-toggle='popover' onclick=ShowFileDetail('" + this.Id + "') ></i>";
            }
            else if (this.Unique_emails == 1 && this.Name == 'NA' && this.Status == 'finished') {
                progressbarclass = 'progress-bar bg-success';
                Progressbarpercentage = 100;
                statusclass = 'text-color-success';
                StatusText = 'Completed';
                filedetailicon = "<i class='icon ion-ios-information' data-toggle='popover' onmouseover=ShowFileDetail('" + this.Id + "') ></i>";
            }
            else {
                Progressbarpercentage = Math.round((parseInt(this.Unique_emails) / parseInt(this.GroupUniqueCount)) * 100);
                Progressbarpercentage = isNaN(Progressbarpercentage) ? 0 : parseInt(Progressbarpercentage);
                progressbarclass = 'progress-bar bg-light';
                Status = '<p class="mb-0 text-color-progress font-11 pt-1">In-Progress</p>';
                filedetailicon = "<i class='icon ion-ios-information' title='file details' data-toggle='popover' onclick=ShowFileDetail('" + this.Id + "') ></i>";
            }

            reportTableTrs += '<tr id="ui_tr_' + $(this)[0].Id + '">' +
                '<td class="text-left">' + $(this)[0].Name + '</td>' +
                '<td>' + $.datepicker.formatDate('M dd', GetJavaScriptDateObj($(this)[0].CreatedDate)) + ' ' + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].CreatedDate)) + '</td>' +
                '<td>' + $.datepicker.formatDate('M dd', GetJavaScriptDateObj($(this)[0].UpdatedDate)) + ' ' + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].UpdatedDate)) + '</td>' +
                '<td class="text-center">' + $(this)[0].Unique_emails + '</td>' +
                '<td>' + (Math.abs(GetJavaScriptDateObj($(this)[0].UpdatedDate) - GetJavaScriptDateObj($(this)[0].CreatedDate)) / 1000).toFixed(2) + '</td>' +
                '<td class=""><div class="verifiedgroup">' + filedetailicon + '<div class="progwrp wid-80"><div class="progress w-100"><div class="' + progressbarclass + '" role="progressbar" style="width: ' + Progressbarpercentage + '%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">' + Progressbarpercentage + '%</div></div>' + Status + '</div></div></td>' +
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

function ShowFileDetail(ContactEmailValidationOverViewId) {
    ShowPageLoading();
    $.ajax({
        url: "/ManageContact/ContactEmailValidationOverView/GetFileDetails",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ContactEmailValidationOverViewId': ContactEmailValidationOverViewId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            var reportTableTrs = "", StatusReport = "";
            $("#ui_filedetails").empty();
            if (response != undefined && response != null && response.length > 0) {
                $.each(response, function () {

                    var Status = this.Status;
                    if (Status == 'finished')
                        StatusReport = "<small class='done-txt'>" + Status + "</small>";
                    else
                        StatusReport = "<small class='notdone-txt'>" + Status + "</small>";
                    let Fileidandurls = "<a title='Click to check file status' href='/managecontact/ContactEmailValidationOverView/FileStatus?F_Id=" + this.File_Id + "&AccountID=" + Plumb5AccountId + "' target=\"_blank\">Verified Data</a>";

                    reportTableTrs += "<div class='emlvalidflewrp'> <h6>" + this.File_Name + "</h6>" + StatusReport + "-" + Fileidandurls + "</div>";

                });
            }
            else
                reportTableTrs += "<div class='emlvalidflewrp'> <h6>There is no data to view</h6></div>";
            $("#ui_filedetails").append(reportTableTrs);
            BindFileDetail();
        },
        error: ShowAjaxError
    });
};

function BindFileDetail() {
    $(".verifiedgroup .ion-ios-information").popover({
        html: true,
        trigger: "click",
        placement: "left",
        content: function () {
            return $(".emlvalidfilewrp").html();
        },
    });
    HidePageLoading();
}

$('body').on('click', function (e) {
    $('[data-toggle=popover]').each(function () {
        // hide any open popovers when the anywhere else in the body is clicked
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
        }
    });
});

document.getElementById("ui_txtSearchName").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("ui_div_SearchIcon").click();
    }
    else {
        var GroupName = CleanText($('#ui_txtSearchName').val());
        if (GroupName === '') {
            LoadOverViewPage();
        }
    }
});

$('#ui_div_SearchIcon').click(function () {
    var GroupName = CleanText($('#ui_txtSearchName').val());
    if (GroupName === '') {
        ShowErrorMessage(GlobalErrorList.ContactEmailValidation.NoGroupName);
        return false;
    }
    LoadOverViewPage();
});

function GetAndBindGroups() {
    $("#ui_ddlValidationGroupList").html('');
    $.ajax({
        url: "/ManageContact/ContactEmailValidationOverView/GetAllGroupDetails",
        type: "POST",
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null && response.length > 0) {
                $.each(response, function () {
                    $("#ui_ddlValidationGroupList").append($('<option value="' + this.Id + '" >' + this.Name + '</option>'));
                });
            }

            $('#ui_ddlValidationGroupList').select2({
                minimumResultsForSearch: '',
                dropdownAutoWidth: false
            });
        },
        error: ShowAjaxError
    });
}

$("#ui_btnShowGroupValidationPopUp").click(function () {
    ClearAndHideValidationPopUp();
    $("#ui_divGroupValidationPopUp").modal();
});

$("#ui_btnStartGroupValidation").click(function () {
    ShowPageLoading();

    var SelectedGroupIds = new Array();
    SelectedGroupIds = $("#ui_ddlValidationGroupList").val();
    if (SelectedGroupIds == undefined || SelectedGroupIds == null || SelectedGroupIds.length == 0) {
        ShowErrorMessage(GlobalErrorList.ContactEmailValidation.NoGroupName);
        HidePageLoading();
        return;
    }

    $.ajax({
        url: "/ManageContact/ContactEmailValidationOverView/SaveValidateGroup",
        type: "POST",
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'GroupIds': SelectedGroupIds }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != undefined && response != null && response.TotalSuccessCount != null && response.ErrorMessage != null) {
                if (response.TotalSuccessCount > 0) {
                    ShowSuccessMessage(GlobalErrorList.ContactEmailValidation.validatesuccess_message.replace("{*var*}", response.TotalSuccessCount));
                    ClearAndHideValidationPopUp();
                    LoadOverViewPage();
                } else {
                    ShowErrorMessage(response.ErrorMessage);
                }
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});

$("#ui_btnCloseGroupValidation,#ui_btnCancelGroupValidation").click(function () {
    ClearAndHideValidationPopUp();
});

function ClearAndHideValidationPopUp() {
    $("#ui_ddlValidationGroupList").val([]).change();
    $("#ui_divGroupValidationPopUp").modal('hide');
}