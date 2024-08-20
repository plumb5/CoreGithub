
var Notifications = { Id: 0, UserInfoUserId: 0, ContactId: 0, Heading: "", Details: "", PageUrl: "", IsThatSeen: "" };
var NotificationsClearTimeOut;
var FollowUpNotificationClearTimeOut;

$(document).ready(function () {
    //clearTimeout(NotificationsClearTimeOut);
    //clearTimeout(FollowUpNotificationClearTimeOut);
    //NotificationsClearTimeOut = setTimeout(GetNotificationCount, 10000);
    //FollowUpNotificationClearTimeOut = setTimeout(GetFollowUpNotification, 300000);
});

function GetNotificationCount() {
    //clearTimeout(NotificationsClearTimeOut);

    $.ajax({
        url: "/Notifications/GetNotificationCount",
        type: 'Post',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: CheckNotificationsCount,
        error: ShowAjaxError
    });
}

function CheckNotificationsCount(response) {
    $("#ui_notificationDetails").find("span").remove();
    if (response > 0) {
        $("#ui_notificationDetails").append('<span class="spanDot"></span>');
    }
    else {
        $("#ui_notificationDetails").find("span").remove();
    }

    //NotificationsClearTimeOut = setTimeout(GetNotificationCount, 10000);
}


$("#ui_notificationDetails").click(function () {
    ShowPageLoading();
    GetNotificationDetails();
});

function GetNotificationDetails() {
    $.ajax({
        url: "/Notifications/GetNotifications",
        type: 'Post',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindNotificationsDetails,
        error: ShowAjaxError
    });
}

function BindNotificationsDetails(response) {
    $("#ui_dvNotifications").html('');
    var NotificationDetails = "";
    if (response !== undefined && response !== null && response.length > 0) {
        $.each(response, function () {
            UpdateSeenStatus($(this)[0].Id);
            NotificationDetails += "<a href='javascript:void(0)' class='dropdown-link'><div class='activity-item'><div class='row no-gutters'><div class='col-md-12 col-sm-12 col-lg-12 col-xl-12'>" +
                //"<span class='act-Num'>Ticket Reference ID:</span>" +
                "<span class='act-Num pl-1'> " + $(this)[0].Heading + "</span></div>" +
                "<div class='col-md-12 col-sm-12 col-lg-12 col-xl-12'>" +
                "<span class='tktDes'>" + $(this)[0].Details + "</span>" +
                "</div></div></div></a>"
        })
        $("#ui_dvNotifications").html(NotificationDetails);
    }
    else {
        $("#ui_dvNotifications").html("<div class='activity-label'>No Notifications</div>");
    }

    HidePageLoading();
}

function UpdateSeenStatus(Id) {
    Notifications.Id = Id;
    Notifications.IsThatSeen = 1;
    $.ajax({
        url: "/Notifications/UpdateSeenStatus",
        type: 'Post',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'notifications': Notifications }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            console.log(response);
        },
        error: ShowAjaxError
    });
}

function GetFollowUpNotification() {
    clearTimeout(FollowUpNotificationClearTimeOut);

    $.ajax({
        url: "/Prospect/FollowUps/GetFollowUpNotification",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'UserId': Plumb5UserId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            //FollowUpNotificationClearTimeOut = setTimeout(GetFollowUpNotification, 300000);
        },
        error: ShowAjaxError
    });
}