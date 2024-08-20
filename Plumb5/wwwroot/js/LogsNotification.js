$("#ui_ddlnotification").click(function () {
    GetActivityLogsNotification();
});

function GetActivityLogsNotification() {

    $.ajax({
        url: "/Logs/GetLogsForNotification",
        type: 'Post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindActivityLogsNotificationReport,
        error: ShowAjaxError
    });
}

function BindActivityLogsNotificationReport(response) {
    $("#ui_dvNotificationReport").html('');

    if (response !== undefined && response !== null && response.length > 0) {
        var IsTodayDataBind = false;
        var IsYesterdayDataBind = false;
        var IsOtherdayDataBind = false;
        let today = new Date();
        let yesterday = new Date();
        yesterday = yesterday.setDate(yesterday.getDate() - 1);
        yesterday = new Date(yesterday);
        $.each(response, function () {
            let dayDetails;
            let logDate = $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].CreatedDate));
            CreatedDate = new Date(logDate);

            if (today.getDate() == CreatedDate.getDate() && today.getMonth() == CreatedDate.getMonth() && today.getFullYear() == CreatedDate.getFullYear()) {
                if (!IsTodayDataBind) {
                    IsTodayDataBind = true;
                    dayDetails = "Today, " + logDate;
                    $("#ui_dvNotificationReport").append("<div class='activity-label'>" + dayDetails + "</div>");
                }
            }
            else if (CreatedDate.getDate() == yesterday.getDate() && yesterday.getMonth() == CreatedDate.getMonth() && yesterday.getFullYear() == CreatedDate.getFullYear()) {
                if (!IsYesterdayDataBind) {
                    IsYesterdayDataBind = true;
                    dayDetails = "Yesterday, " + logDate;
                    $("#ui_dvNotificationReport").append("<div class='activity-label'>" + dayDetails + "</div>");
                }
            }
            else {
                if (!IsOtherdayDataBind) {
                    IsOtherdayDataBind = true;
                    dayDetails = logDate;
                    $("#ui_dvNotificationReport").append("<div class='activity-label'>" + dayDetails + "</div>");
                }
            }

            let IpAddress = $(this)[0].IpAddress == null ? 'NA' : $(this)[0].IpAddress.length > 14 ? $(this)[0].IpAddress.substring(0, 14) : $(this)[0].IpAddress;
            let ChannelName = $(this)[0].ChannelName == null ? 'NA' : $(this)[0].ChannelName;
            let ControllerName = $(this)[0].ControllerName == null ? 'NA' : $(this)[0].ControllerName;
            let logtime = PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].CreatedDate)).slice(0, 5) + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].CreatedDate)).slice(9, 11);

            $("#ui_dvNotificationReport").append("<div class='activity-item'><div class='row no-gutters'>" +
                "<div class='col-md-4 col-sm-4 col-lg-4 col-xl-4'><span class='act-Num'>" + IpAddress + "\n" + "</span>" +
                "<span>" + logtime + "</span ></div > " +
                "<div class='col-md-8 col-sm-8 col-lg-8 col-xl-8'><span class='widTitle'>" + ChannelName + "</span>" +
                "<span class='widTitle'>" + ControllerName + "</span></div></div></div>");
        });

        $("#ui_dvNotificationReport").append("<div class='dropdown-list-footer'><a href='/Logs/'><i class='fa fa-angle-down'></i> Show All Activities</a></div>");
    }
}


