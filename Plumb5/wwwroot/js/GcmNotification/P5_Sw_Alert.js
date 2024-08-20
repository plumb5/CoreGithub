self.addEventListener('install', function (event) {
    self.skipWaiting();
    //console.log('Installed', event);
});

self.addEventListener('activate', function (event) {
    //console.log('Activated', event); //yes
});


self.addEventListener('push', function (event) {

    p5Domain = self.location.hostname.toLowerCase().replace(".plumb5.in", "").replace(/\./g, '');
    event.waitUntil(
        self.registration.pushManager.getSubscription()
            .then(function (subscription) {

                var ep = P5GetEndPoint(subscription);
                p5RegId = ep.id; p5Browser = ep.browser;

                var url = "//mtrackerbeta.plumb5.com/mTracker.svc/GetLeadNotification?GcmRegId=" + p5RegId;
                console.log(url);
                return fetch(url).then(function (response) {
                    var notificationDetails = {};

                    if (response.status !== 200) {
                        throw new Error();
                    }

                    return response.json().then(function (data) {

                        var obj = JSON.parse(data);

                        notificationDetails.title = obj.Title;
                        notificationDetails.message = obj.Message;                 

                        return showNotification(notificationDetails.title, notificationDetails.message);


                    });
                }).catch(function (err) {

                });
            })
    );
});

function showNotification(title, body) {
    return self.registration.showNotification(title, {
        body: body,
        icon: "push-logo.png",
        tag: "P5 Notification"
    }).then(() => self.registration.getNotifications())
                      .then(notifications => {
                          setTimeout(() => notifications.forEach(notification => notification.close()), 500 * 1000);
                      });

}

self.addEventListener('notificationclick', function (event) {
    return clients.openWindow("https://www.plumb5.com/Account/register");
});


function P5GetEndPoint(pushSubscription) {
    if (pushSubscription.subscriptionId) {
        return pushSubscription.subscriptionId;
    }
    var endpoint = 'https://android.googleapis.com/gcm/send/';
    var parts = pushSubscription.endpoint.split(endpoint);
    if (parts.length > 1) {
        return {
            'browser': 'chrome',
            'id': parts[1]
        };
    }
    endpoint = 'https://updates.push.services.mozilla.com/push/';
    parts = pushSubscription.endpoint.split(endpoint);
    if (parts.length > 1) {
        return {
            'browser': 'firefox',
            'id': parts[1]
        };
    }

    endpoint = 'https://updates.push.services.mozilla.com/wpush/';
    parts = pushSubscription.endpoint.split(endpoint);
    if (parts.length > 1) {
        return {
            'browser': 'firefox',
            'id': parts[1]
        };
    }
    return '';
}