var DeletepostId = "0";

$(document).ready(function () {
    FbSchedule.GetPages();   
});



var FbSchedule = {

    GetPages: function () {
        $.ajax({
            url: "/FacebookPage/ScheduledPosts/GetFacebookPages",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                let SelectedPageIndex = result.SelectedPageIndex != undefined && result.SelectedPageIndex != null ? result.SelectedPageIndex : 0;

                if (result.fbPages != undefined && result.fbPages != null) {

                    $.each(result.fbPages, function (i) {
                        if (i == SelectedPageIndex) {
                            $("#dropdownMenuButton").html('<span id="spnSelectPage" data-index=' + i + ' class="fbclntnametxt">' + $(this)[0].PageName + '</span> <i class="fbclientlogo" style="background-image: url(\'' + $(this)[0].ImageUrl + '\')"></i>');
                            FbSchedule.SelectPage(i, $(this)[0].PageName, $(this)[0].ImageUrl);
                        }
                        $("#ddlPages").append('<a onclick="FbSchedule.SelectPage(' + i + ',\'' + $(this)[0].PageName + '\',\'' + $(this)[0].ImageUrl + '\')" class="dropdown-item" data-fbclientname="Plumb5" data-fbclientlogo="https://www.plumb5.com/favicon.ico" href="#"><i class="fa fa-file-o mr-2"></i>' + $(this)[0].PageName + '</a>');
                    });

                }
                //FbSchedule.SchedulePost();
               
            },
            error: ShowAjaxError
        });
    },
    SelectPage: function (index, page, image) {
        $("#dropdownMenuButton").html('<span  id="spnSelectPage" data-index=' + index + ' class="fbclntnametxt">' + page + '</span> <i class="fbclientlogo" style="background-image: url(\'' + image + '\')"></i>');
        ShowPageLoading();
        FbSchedule.SchedulePost();
    },
    SchedulePost: function () {
        pageIndex = $("#spnSelectPage").attr("data-index");
        $.ajax({
            url: "/FacebookPage/ScheduledPosts/GetScheduledPosts",
            type: 'POST',
            data: JSON.stringify({ 'PageIndex': '' + pageIndex + '' }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {

                var reportTableTrs;
                if (result != undefined && result != null) {

                    var getData = JSON.parse(result.PostData);
                    if (getData.length > 0) {
                        for (var p = 0; p < getData.length; p++) {

                            var d = new Date(getData[p].ScheduledDate);
                            var date = FbSchedule.GetMonthName(d.getMonth()) + ' ' + d.getDate() + ' ' + d.getFullYear() + ' ' + (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ':00';


                            var dataMsg = getData[p].Message != null ? getData[p].Message : getData[p].postURL;
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
                                                        <a class ="dropdown-item ContributePermission" onClick="UpdatePost('${getData[p].ID}','${getData[p].Message}','${getData[p].ScheduledDate}','${getData[p].mediaURL}')" href="javascript:void(0)">Edit</a>
                                                        <div class="dropdown-divider"></div>
                                                        <a data-toggle="modal" data-target="#deletegroups" data-groupid=${getData[p].ID} id="deletepost" data-grouptype="groupDelete" class ="dropdown-item FullControlPermission" href="javascript:void(0)">Delete</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>${date}</td>
                                </tr>`;
                        }

                        $("#ui_tbodyReportData").html(reportTableTrs);
                        HidePageLoading();
                        CheckAccessPermission("FacebookPage");
                    }
                    else {
                        $("#ui_tbodyReportData").html('<tr><td colspan="6" class="border-bottom-none"><div class="no-data">There is no data for this view</div></td></tr>');
                        HidePageLoading();
                    }
                }
                else {
                    $("#ui_tbodyReportData").html('<tr><td colspan="6" class="border-bottom-none"><div class="no-data">There is no data for this view</div></td></tr>');
                    HidePageLoading();
                }

            },
            error: ShowAjaxError
        });
    }
    ,
    GetMonthName: function (monthnumber)
    {
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
    },
    DeletePost: function (Id) {
        pageIndex = $("#spnSelectPage").attr("data-index");
        $.ajax({
            url: "/FacebookPage/ScheduledPosts/DeleteScheduledPost",
            type: 'POST',
            data: JSON.stringify({'PageIndex': '' + pageIndex + '','Id': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    if (response.Result == true) {
                        ShowSuccessMessage(GlobalErrorList.CreateFacebookPost.SucessDelete);
                        FbSchedule.SchedulePost();
                    }else
                    {
                        ShowSuccessMessage(GlobalErrorList.CreateFacebookPost.UnableToDelete);
                    }
                }
            },
            error: ShowAjaxError
        });
    }
};


$(document).on('click', "#deletepost", function () {
    DeletepostId = $(this).attr("data-groupid");
});

$("#deleteRowConfirm").click(function () {
    FbSchedule.DeletePost(DeletepostId);
});

