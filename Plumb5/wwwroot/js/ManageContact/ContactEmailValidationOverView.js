var EmailValidationGroupId;
function GetEmailValidationOverViewDetails(GroupId) {
    ShowPageLoading();
    TotalInnerRowCount = 0;
    CurrentInnerRowCount = 0;
    EmailValidationGroupId = GroupId;
    MaxInnerCount();
}

function CallBackInnerPaging() {
    CurrentInnerRowCount = 0;
    GetInnerReport();
}

function MaxInnerCount() {
    $.ajax({
        url: "/ManageContact/ContactEmailValidationOverView/GetMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'GroupId': EmailValidationGroupId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalInnerRowCount = response.returnVal;

            if (TotalInnerRowCount > 0) {
                GetInnerReport();
            }
            else {
                $("#ui_tbodyValidationOverviewReportData").empty().append('<tr><td colspan="6" class="border-bottom-none"><div class="no-data">There is no data for this view</div></td></tr>');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetInnerReport() {
    InnerFetchNext = GetInnerNumberOfRecordsPerPage();
    $.ajax({
        url: "/ManageContact/ContactEmailValidationOverView/BindContactEmailValidationOverView",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'GroupId': EmailValidationGroupId, 'OffSet': InnerOffSet, 'FetchNext': InnerFetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: BindInnerReport,
        error: ShowAjaxError
    });
}

function BindInnerReport(response) {
    $("#ui_tbodyValidationOverviewReportData").empty().append('<tr><td colspan="6" class="border-bottom-none"><div class="no-data">There is no data for this view</div></td></tr>');

    if (response != undefined && response != null && response.length > 0) {

        CurrentInnerRowCount = response.length;
        InnerPagingPrevNext(InnerOffSet, CurrentInnerRowCount, TotalInnerRowCount);
        var reportTableTrs, Progressbarpercentage, progressbarclass, statusclass, StatusText;
        
        $.each(response, function () {
            var errormessageicon = "", filedetailicon = "";
            if (this.ErrorMessage != "" && this.ErrorMessage != null) {
                progressbarclass = 'progress-bar bg-light';
                Progressbarpercentage = 0;
                statusclass = 'text-color-queued';
                StatusText = 'In-Queue';
                //errormessageicon = '<i class="icon ion-ios-information creditalertblink" data-toggle="popover" data-trigger="hover" data-content="' + this.ErrorMessage + '" data-original-title="" title="" aria-describedby="popover111460"></i
                errormessageicon = "<p class='insufficred'>"+ this.ErrorMessage +"</p>";
            }
            else if (this.Unique_emails == 0) {
                progressbarclass = 'progress-bar bg-light';
                Progressbarpercentage = 0;
                statusclass = 'text-color-queued';
                StatusText = 'In-Queue';
            }
            else if (this.Unique_emails == this.GroupUniqueCount) {
                progressbarclass = 'progress-bar bg-success';
                Progressbarpercentage = 100;
                statusclass = 'text-color-success';
                StatusText = 'Completed';
                filedetailicon = "<i class='icon ion-ios-information' data-toggle='popover' onmouseover=ShowFileDetail('" + this.Id + "') ></i>";
            }
            else if (this.Unique_emails == 1 && this.Name == 'NA' && this.Status=='finished') {
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
                statusclass = 'text-color-progress';
                StatusText = 'In-Progress';
                filedetailicon = "<i class='icon ion-ios-information' data-toggle='popover' onmouseover=ShowFileDetail('" + this.Id + "') ></i>";
            }

            reportTableTrs +=
                "<tr>" +
                "<td>" +
                "<div class='nametitWrap'>" +
                "<span class='groupNameTxt'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.CreatedDate)) + "</span>" +
                "</div>" +
                "</td>" +
                "<td><span class='" + statusclass + "'> " + StatusText + "</span ></td>" +
                "<td>" + this.Unique_emails + "</td>" +
                "<td>" + this.Ok + "</td>" +
                "<td>" + this.Invalid + "</td>" +
                "<td>" +
                "<div class='errmsgemlvalidwrp'>"+filedetailicon+"<div class='progress w-100'>" +
            "<div class='" + progressbarclass + "' role='progressbar'style='width: " + Progressbarpercentage + "%;' aria-valuenow='40' aria-valuemin='0'aria-valuemax='100'>" + Progressbarpercentage + "%</div></div></div>" + errormessageicon +
            "<td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.UpdatedDate)) +  "</span ></td>" +
                "</td>"+
                "</tr>";
        });

        $("#ui_tblValidationOverviewReportData").removeClass('no-data-records');
        $("#ui_tbodyValidationOverviewReportData").html(reportTableTrs);
        ShowInnerPagingDiv(true);
        //$('.creditalertblink').popover();
    }
    else {
        ShowInnerPagingDiv(false);
    }
    HidePageLoading();
}


//File Details

function ShowFileDetail(ContactEmailValidationOverViewId) {

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

                    reportTableTrs += "<div class='emlvalidflewrp'> <h6>" + this.File_Name + "</h6>" + StatusReport + "</div>";
                })
              
            }
            else
                reportTableTrs += "<div class='emlvalidflewrp'> <h6>No file found</h6></div>";
            $("#ui_filedetails").append(reportTableTrs);
            BindFileDetail();
        },
        error: ShowAjaxError
    });

};


function BindFileDetail() {
    $(".errmsgemlvalidwrp .ion-ios-information").popover({
        html: true,
        trigger: "click",
        placement: "left",
        content: function () {
            return $(".emlvalidfilewrp").html();
        },
    });

}

