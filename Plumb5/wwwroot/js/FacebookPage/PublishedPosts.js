
var getDuration = 'last7d';
$(document).ready(function () {
    GetPages();
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
function GetPages() {
    $.ajax({
        url: "/FacebookPage/PublishedPosts/GetFacebookPages",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            let SelectedPageIndex = result.SelectedPageIndex != undefined && result.SelectedPageIndex != null ? result.SelectedPageIndex : 0;
            pageIndex = SelectedPageIndex;
            if (result.fbPages != undefined && result.fbPages != null) {
                $.each(result.fbPages, function (i) {
                    if (i == SelectedPageIndex) {
                        $("#dropdownMenuButton").html('<span id="spnSelectPage" data-index=' + i + ' class="fbclntnametxt">' + $(this)[0].PageName + '</span> <i class="fbclientlogo" style="background-image: url(\'' + $(this)[0].ImageUrl + '\')"></i>');
                        SelectPage(i, $(this)[0].PageName, $(this)[0].ImageUrl);
                    }
                    $("#ddlPages").append('<a onclick="SelectPage(' + i + ',\'' + $(this)[0].PageName + '\',\'' + $(this)[0].ImageUrl + '\')" class="dropdown-item" data-fbclientname="Plumb5" data-fbclientlogo="https://www.plumb5.com/favicon.ico" href="#"><i class="fa fa-file-o mr-2"></i>' + $(this)[0].PageName + '</a>');
                });

            }
            //CallBackFunction();

        },
        error: ShowAjaxError
    });
}

function SelectPage(index, page, image) {
    $("#dropdownMenuButton").html('<span  id="spnSelectPage" data-index=' + index + ' class="fbclntnametxt">' + page + '</span> <i class="fbclientlogo" style="background-image: url(\'' + image + '\')"></i>');
    ShowPageLoading();
    CallBackFunction();
}

function MaxCount() {
    pageIndex = $("#spnSelectPage").attr("data-index");
    $.ajax({
        url: "/FacebookPage/PublishedPosts/GetMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'PageIndex': pageIndex, 'Duration': getDuration }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response != undefined && response != null) {
                TotalRowCount = response.Count;
            }

            if (TotalRowCount > 0) {
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 8, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReport() {
    pageIndex = $("#spnSelectPage").attr("data-index");
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/FacebookPage/PublishedPosts/GetScheduledPosts",
        type: 'Post',
        data: JSON.stringify({ 'PageIndex': pageIndex, 'Duration': getDuration, 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {

    SetNoRecordContent('ui_tblReportData', 8, 'ui_tbodyReportData');
    if (response != undefined && response != null) {
        CurrentRowCount = response.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

        var reportTableTrs;

        $.each(response, function () {


            //var getdata = this.CreatedDate.split("-");
            //var month = parseInt(getdata[1], 10)-1;
            //var postdate = GetMonthName(month) + ' ' + getdata[0] + ' ' + getdata[2]


            var dataMsg = this.Message != null ? this.Message : this.postURL;

            reportTableTrs += `<tr>
                                    <td>
                                        <div class="groupnamewrap">
                                            <div class="nameTxtWrap">
                                                ${dataMsg}
                                            </div>
                                            <div class="tdcreatedraft">
                                                <div class="dropdown">
                                                    <button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>
                                                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="filterbycontacts">
                                                        <a class ="dropdown-item" onClick="PreviewPublishedPost('${this.postURL}')" href="javascript:void(0)">View Post</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>${this.CreatedDate}</td>
                                    <td>${this.Clicks}</td>
                                    <td>${this.Likes}</td>
                                    <td>${this.Comments}</td>
                                    <td>${this.TotalImpressions}</td>
                                    <td>${this.PaidImpressions}</td>
                                    <td>${this.EngagementRate_prc}%</td>
                                </tr>`;

        });

        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
    }
    else {
        ShowExportDiv(false);

        ShowPagingDiv(false);
    }
    HidePageLoading();
}

function GetMonthName(monthnumber) {
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    var n = month[monthnumber];
    return n;
}

var selectDate, selctcustrangdate;
$(".datedropdown > .dropdown-menu a").click(function () {
    selectDate = $(this).text();
    getDuration = $(this).attr("dataid");
    CallBackFunction();
    $("#selectdateDropdown").html($.trim(selectDate.replace(/\s+/g, " ")));
    if ($.trim(selectDate.replace(/\s+/g, " ")) == "Custom Date Range") {
        $(".dateBoxWrap").addClass("showFlx");
    } else {
        $(".dateBoxWrap").removeClass("showFlx");
    }
});


function PreviewPublishedPost(postUrl) {
    pageIndex = $("#spnSelectPage").attr("data-index");
    $.ajax({
        url: "/FacebookPage/PublishedPosts/GetPostPreview",
        type: 'POST',
        data: JSON.stringify({ 'PageIndex': pageIndex, 'PostLink': '' + postUrl + '' }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result != undefined && result != null) {

                if (result.PreviewData.length > 0) {
                    $(".popupcontainer").addClass("hideDiv");
                    $("#fbPostPreview").removeClass("hideDiv");
                    $('#ifrmPreviewPost').width($('#ifrmPreviewPost').parent().width()-10);
                    $('#ifrmPreviewPost').height($('#ifrmPreviewPost').parent().parent().height());
                    $('#ifrmPreviewPost').attr('srcdoc', result.PreviewData)
                } else {
                    ShowErrorMessage(GlobalErrorList.CreateFacebookPost.EmptyPostPreview);
                }

            }

        },
        error: ShowAjaxError
    });
}