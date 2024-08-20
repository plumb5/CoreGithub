
self.addEventListener('install', function (event) {
    self.skipWaiting();
    //console.log('Installed', event);
});

self.addEventListener('activate', function (event) {
});

self.addEventListener('push', function (event) {
    var data = {};
    if (event.data) {

        if ((event.data == undefined) || event.data.text() == "" || event.data.text() == " ") {//Test Message
            defaultNotification();
        }
        else if (event.data.text() == "svcinstall") {
            self.skipWaiting();
        } //update service worker
        else {
            try {
                data = event.data.json();
                if (!data.IsWelcomeMessage) {
                    console.log('Notification Received:');
                    console.log(data);
                    event.waitUntil(
                        self.registration.pushManager.getSubscription()
                            .then(function () {
                                var ViewResponseData =
                                {
                                    Action: 'UpdateView',
                                    AdsId: data.AdsId,
                                    P5UniqueId: data.responseid,
                                    MachineId: data.MachineId,
                                    WorkFlowId: parseInt(data.WorkFlowId),
                                    WorkFlowDataId: parseInt(data.WorkFlowDataId)

                                };
                                UpdateWebPushSent(ViewResponseData, data);
                            }).catch(function (err) {
                                console.error('Unable to retrieve data', err);
                                defaultNotification();

                            }));
                }
                else {
                    ShowNotification(data);
                }
            }
            catch (err) {
                defaultNotification();
            }
        }
    }
});
// The user has clicked on the notification ...
self.addEventListener('notificationclick', function (event) {

    var data = event.notification.data;
    if (data.IsWelcomeMessage) {
        clients.openWindow(data.RedirectTo);
    }
    else {
        var p5actionUrl = data.RedirectTo;
        if (event.action.length > 1)
            p5actionUrl = event.action;

        var ClickResponseData =
        {
            Action: 'UpdateClick',
            AdsId: data.AdsId,
            P5UniqueId: data.responseid,
            MachineId: data.MachineId,
            WorkFlowId: data.WorkFlowId,
            WorkFlowDataId: data.WorkFlowDataId

        };
        UpdateWebPushSent(ClickResponseData, data);
        event.waitUntil(clients.openWindow(p5actionUrl));
    }
}, false);


self.addEventListener('notificationclose', function (event) {

    var data = event.notification.data;
    if (!data.IsWelcomeMessage) {
        var CloseResponseData =
        {
            Action: 'UpdateClose',
            AdsId: data.AdsId,
            P5UniqueId: data.responseid,
            MachineId: data.MachineId,
            WorkFlowId: data.WorkFlowId,
            WorkFlowDataId: data.WorkFlowDataId

        };
        UpdateWebPushSent(CloseResponseData, data);//Seperate and in mainscript
    }
});
function UpdateWebPushSent(ResponseData, data) {
    if (ResponseData.Action == 'UpdateView')
        ShowNotification(data);

    fetch('//track.plumb5.com/PushNotification/UpdateWebPushSent', {
        method: 'post',
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(ResponseData)
    }).then(function () {
        console.log(ResponseData.Action);
        //if (ResponseData.Action == 'UpdateView')
        // ShowNotification(data);

    }).catch(function (error) {
        console.log('Notification not sent', error);

    });
}

function ShowNotification(data) {

    if (data != null && data != '') {
        var notificationOptions =
        {
            body: data.message,
            icon: data.Imageurl,
            tag: 'plumb5',
            data: data,
            image: data.BannerImage,
            requireInteraction: true
        };


        if (data.Browser != 'firefox' || data.Browser != 'firefox1') {
            var p5ExtraData = [];
            if (data.Button1_Label != null && data.Button1_Label != "") {
                p5ExtraData.push({
                    action: data.Button1_Redirect,
                    title: data.Button1_Label
                });
            }
            if (data.Button2_Label != null && data.Button2_Label != "") {
                p5ExtraData.push({
                    action: data.Button2_Redirect,
                    title: data.Button2_Label
                });
            }
            notificationOptions.actions = p5ExtraData;
        }

        if (data.IsAutoHide == false) {
            return self.registration.showNotification(data.title, notificationOptions);
        } else {
            return self.registration.showNotification(data.title, notificationOptions).then(() => self.registration.getNotifications())
                .then(notifications => {
                    setTimeout(() => notifications.forEach(notification => notification.close()), 5 * 1000);
                });
        }
    }
    else {
        defaultNotification();
        return false;
    }
}

function defaultNotification() {
    var title = 'New Notification';
    var options = {
        body: 'You have got a new Notification.',
        icon: 'images/icon.png'
    };
    self.registration.showNotification(title, options);
}


