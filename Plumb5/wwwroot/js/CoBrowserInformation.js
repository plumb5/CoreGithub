//setInterval(GetUserCoBrowserInformation, 30000);
//setInterval(UserActiveStatusToCoBrowser, 60000);
//RequestDesktopPermission();

//SendDesktopNotification('Plumb5', 'You have received the Co-Browser request Notification');

var CoBrowserUtill = {
    CheckNotificationPermission: function () {
        if (Notification.permission === "granted") {
            CoBrowserUtill.GetUserCoBrowserInformation();
            console.log("we have notification permission");
        }
        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                console.log(permission);
            });
        }
    },
    GetUserCoBrowserInformation: function () {
        $.ajax({
            url: "/CoBrowserInfo/GetCoBrowserInformation",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                AccountId: Plumb5AccountId,
                UserId: Plumb5UserId
            }),
            success: function (response) {
                if (response != undefined && response != null) {
                    if (Notification.permission === "granted") {
                        CoBrowserUtill.ShowNotification(response);
                        console.log("we have notification permission");
                    }
                    else if (Notification.permission !== "denied") {
                        Notification.requestPermission().then(permission => {
                            console.log(permission);
                        });
                    }
                }
            },
            error: function () {

            }
        });
    },
    UpdateUserLastActiveDateTime: function () {
        $.ajax({
            url: "/CoBrowserInfo/UpdateUserLastActiveDateTime",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ UserId: Plumb5UserId }),
            error: function () {

            }
        });
    },
    ShowNotification: function (response) {
        const notification = new Notification("Plumb5 Cobrowser Notification", {
            body: "You have received CoBrowsing request from " + response.CustomerName + "",
            icon: "/images/logo.png"
        });
        notification.onclick = (e) => {
            window.open(response.CoBrowserLink);
        };
    }
};




setInterval(CoBrowserUtill.UpdateUserLastActiveDateTime, 10000); //Every 10 Seconds Update UserInfo table UserLastActivateDeteTime

setInterval(CoBrowserUtill.CheckNotificationPermission, 10000); //Every 10 seconds get Cobrowser Information for the respective User



