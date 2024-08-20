var urlregex = new RegExp("^(http:\/\/|https:\/\/){1}([0-9A-Za-z]+\.)");
var PostId = "0";




var FbPost = {
    ValidateFbPost: function () {

        if (CleanText($.trim($("#txtMessage").val())).length == 0 && CleanText($.trim($("#fblinkurl").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateFacebookPost.MessageAndLink);
            return false;
        }


        if (CleanText($.trim($("#fblinkurl").val())).length != 0 && urlregex.test($("#fblinkurl").val()) == false) {
            ShowErrorMessage(GlobalErrorList.CreateFacebookPost.RedirectUrlValidUrl);
            return false;
        }

        return true;
    },
    ValidateDate: function () {
        if ($("#ui_txtSingleSchedule").val() == "" || $.trim($("#ui_txtSingleSchedule").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.CreateFacebookPost.Date);
            $("#ui_txtSingleSchedule").focus();
            HidePageLoading();
            return false;
        }

        var SelectedDateString = $("#ui_txtSingleSchedule").val().split("/");
        var ScheduleHour = $("#ui_ddlSingleBatchScheduleHour").val();
        var ScheduleMinute = $("#ui_ddlSingleBatchScheduleMinute").val();
        var ScheduleFormart = $("#ui_ddlSingleBatchScheduleAMPM").val();
        if (ScheduleFormart.toUpperCase() == "PM") {
            ScheduleHour = FbPost.ConvertHourTo24HourFormat(ScheduleHour);
        }

        var SelectedDate = new Date(SelectedDateString[2], parseInt(SelectedDateString[0]) - 1, SelectedDateString[1], ScheduleHour, ScheduleMinute, 59);
        if (SelectedDate <= new Date()) {
            ShowErrorMessage(GlobalErrorList.CreateFacebookPost.DateGreaterThan);
            HidePageLoading();
            return false;
        }

        return true;
    },
    ConvertHourTo24HourFormat: function (hourValue) {
        switch (hourValue) {
            case "01":
                hourValue = "13";
                break;
            case "02":
                hourValue = "14";
                break;
            case "03":
                hourValue = "15";
                break;
            case "04":
                hourValue = "16";
                break;
            case "05":
                hourValue = "17";
                break;
            case "06":
                hourValue = "18";
                break;
            case "07":
                hourValue = "19";
                break;
            case "08":
                hourValue = "20";
                break;
            case "09":
                hourValue = "21";
                break;
            case "10":
                hourValue = "22";
                break;
            case "11":
                hourValue = "23";
                break;
        }
        return hourValue;
    },
    CreateFaceBookPost: function () {

        if (FbPost.ValidateFbPost() == true && FbPost.ValidateDate() == true) {

            var SelectedDateString = $("#ui_txtSingleSchedule").val().split("/");
            var ScheduleHour = $("#ui_ddlSingleBatchScheduleHour").val();
            var ScheduleMinute = $("#ui_ddlSingleBatchScheduleMinute").val();
            var ScheduleFormart = $("#ui_ddlSingleBatchScheduleAMPM").val();
            if (ScheduleFormart.toUpperCase() == "PM") {
                ScheduleHour = FbPost.ConvertHourTo24HourFormat(ScheduleHour);
            }

            var SelectedDate = "" + SelectedDateString[1] + "-" + SelectedDateString[0] + "-" + SelectedDateString[2] + " " + ScheduleHour + ":" + ScheduleMinute + ":00";//new Date(SelectedDateString[2], parseInt(SelectedDateString[0]) - 1, SelectedDateString[1], ScheduleHour, ScheduleMinute, 00);

            var pageIndex = parseInt($("#spnSelectPage").attr("data-index"));
            ShowPageLoading();
            $.ajax({
                url: "/FacebookPage/ScheduledPosts/PostFacebook",
                type: 'POST',
                data: JSON.stringify({ 'Id': PostId, 'PageIndex': pageIndex, 'Message': '' + $("#txtMessage").val() + '', 'PostDate': '' + SelectedDate + '', 'Link': '' + $("#fblinkurl").val() + '' }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if (data != undefined && data != null && data.result != "") {
                        if (data.result.indexOf("invalid") > -1) {
                            ShowErrorMessage(data.result);
                        }
                        else {
                            if (PostId == "0" && data.result.length > 0)
                                ShowSuccessMessage(GlobalErrorList.CreateFacebookPost.PostSuccess);
                            else if (PostId != "0" && data.result.toLowerCase() == "true")
                                ShowSuccessMessage(GlobalErrorList.CreateFacebookPost.PostSuccessUpdate);
                            else
                                ShowErrorMessage(GlobalErrorList.CreateFacebookPost.PostFailed);

                            if (window.location.href.toLowerCase().indexOf('publishedposts') == -1) {
                                FbSchedule.SchedulePost();
                            }

                            FbPost.ClearFields();

                            $(".popupcontainer").addClass("hideDiv");
                        }
                    }
                    else
                        ShowErrorMessage(GlobalErrorList.CreateFacebookPost.PostCreateFailed);

                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        }
    }
    ,
    UrlPreview: function () {
        $('.fbconttittxt').html("Loading...");
        $('.fbcontdescrip').html("Please wait.");
        $('.fblogoimg').css('background-image', 'url()');
        $.ajax({
            url: "/FacebookPage/ScheduledPosts/GetMetaTag",
            type: 'POST',
            data: JSON.stringify({ 'Link': '' + $("#fblinkurl").val() + '' }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result != undefined && result != null) {

                    if (JSON.parse(result.PreviewData).Title.length > 0) {
                        $(".fbprievnot").addClass("hideDiv");
                        $(".fbprievcontwrp").removeClass("hideDiv");
                        $('.fblogoimg').css('background-image', 'url(' + JSON.parse(result.PreviewData).ImageUrl + ')');
                        $('.fbconttittxt').html(JSON.parse(result.PreviewData).Title);
                        $('.fbcontdescrip').html(JSON.parse(result.PreviewData).Description);
                    } else {
                        $(".fbprievnot").removeClass("hideDiv");
                        $(".fbprievcontwrp").addClass("hideDiv");
                    }

                }

            },
            error: ShowAjaxError
        });

    },
    ClearFields: function () {
        $(".fbprievnot").removeClass("hideDiv");
        $(".fbprievcontwrp").addClass("hideDiv");
        $("#txtMessage").val("");
        $("#fblinkurl").val("");
        $("#ui_txtSingleSchedule").val("");
        $("#ui_ddlSingleBatchScheduleHour").val("00");
        $("#ui_ddlSingleBatchScheduleMinute").val("00");
        $("#ui_ddlSingleBatchScheduleAMPM").val("AM");
    }

};


$("#btnFbPost").click(function () {
    FbPost.CreateFaceBookPost();
});

$("#fblinkurl").change(function () {
    let fblinkurlval = $(this).val();
    if (fblinkurlval == "") {
        $(".fbprievnot").removeClass("hideDiv");
        $(".fbprievcontwrp").addClass("hideDiv");
    } else {

        FbPost.UrlPreview();

    }
});

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    $("#fbPostPreview").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
});

function UpdatePost(id, message, date,mediaURL) {
    $("#btnFbPost").html("Update Post")
    $("#fbpostiframewrp").addClass("hideDiv");
    $(".popuptitle h6").html("Create Facebook Post");
    $(".popupcontainer, #fbcreateposttab, .createpostbtn").removeClass("hideDiv");

    PostId = id;
    $("#txtMessage").val(message != "null" ? message : "");

    var d = new Date(date);
    var getm = d.getMonth() + 1;
    var month = (getm < 10 ? '0' : '') + getm;
    var dateForPost = parseInt(d.getDate()) < 10 ? '0' + d.getDate() : d.getDate();
    $("#ui_txtSingleSchedule").val(month + '/' + dateForPost + '/' + d.getFullYear());

    var ampm = d.getHours() >= 12 ? 'PM' : 'AM';
    var hours = d.getHours() % 12;
    hours = hours ? hours : 12;
    $("#ui_ddlSingleBatchScheduleHour").val((hours < 10 ? '0' : '') + hours);
    $("#ui_ddlSingleBatchScheduleMinute").val((d.getMinutes() < 10 ? '0' : '') + d.getMinutes());
    $("#ui_ddlSingleBatchScheduleAMPM").val(ampm);
    $("#fblinkurl").val(mediaURL);
    FbPost.UrlPreview();
}

$(".openfbpage").click(function () {
    $("#btnFbPost").html("Create Post")
    FbPost.ClearFields();
    PostId = "0";
    $("#fbpostiframewrp").addClass("hideDiv");
    $(".popuptitle h6").html("Create Facebook Post");
    $(".popupcontainer, #fbcreateposttab, .createpostbtn").removeClass("hideDiv");
});

$(document).ready(function () {
    $("#ui_txtSingleSchedule").datepicker({
        defaultDate: "+1d",
        prevText: "click for previous months",
        nextText: "click for next months",
        showOtherMonths: true,
        selectOtherMonths: false,
        minDate: new Date()
    });
});

