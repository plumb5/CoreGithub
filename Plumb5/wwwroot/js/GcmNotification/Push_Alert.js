'use strict';
var UserId, AccountId;
function webpush(getAccountId, getUserId) {
    if (Notification.permission == 'granted') {
        alert("You are already subscribed for push notifications.");
    }
    else {
        AccountId = getAccountId;
        UserId = getUserId;
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('P5_Sw_Alert.js')
                    .then(initialiseState)
                    .catch(function (error) {
                        printMsg('<span style="color:#D67C7C;">Your browser is not supporting this feature, please get chrome (42+) or firefox (44+) </span>' + error)
                    });
        } else {
            printMsg('Service workers aren\'t supported in this browser.');
            redirectToParent(2000);
        }
    }
}

function initialiseState() {

    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
        printMsg('Notifications aren\'t supported.');
        return;
    }


    if (Notification.permission === 'denied') {
        printMsg('You have blocked notifications for this site.allow notification permission and refresh this page.');
    }

    if (!('PushManager' in window)) {
        printMsg('Push messaging isn\'t supported.');
        return;
    }


    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
        // Do we already have a push message subscription?
        serviceWorkerRegistration.pushManager.getSubscription()
                .then(function (subscription) {

                    var msg = '';
                    if (!subscription) {
                        p5PushSubscribe();
                        return true;
                    }
                    else {
                        //window.close();
                    }

                })
                .catch(function (err) {
                    printMsg('Error during getSubscription()', err);
                    return;
                });
    }).catch(function (error) {
        printMsg('Your browser is not supporting this feature, please get chrome (42+) or firefox (44+) ' + error);
    });
}


function p5PushSubscribe() {

    //Notification.permission
    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {

        serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true })
                .then(function (subscription) {

                    JSON.stringify(subscription);
                    var ep = P5GetEndPoint(subscription);
                    var regid = ep.id;

                    console.log(regid);
                    var clickDeliveryURL = "//mtrackerbeta.plumb5.com/mTracker.svc/RegisterLeadNotification?UserId=" + UserId + "&GcmId=" + regid + "&Browser=Browser&AccountId=" + AccountId;
                    fetch(clickDeliveryURL).then(function (response) {
                    }).catch(function (err) {
                        console.error('Unable to retrieve data', err);
                    })


                    var obj = {};
                    obj.Title = "You have successfully subscribed";
                    obj.Message = "Base on response you will get alert",
                    obj.ImageUrl = "push-logo.png"

                    P5RegisterNotify(serviceWorkerRegistration, obj);
                    return true;
                })
                .catch(function (e) {
                    console.log("error" + Notification.permission);
                });
    });
}



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
            'browser': 'firefox1',
            'id': parts[1]
        };
    }
    return '';
}


function printMsg(msg) {
    console.log(msg);
}



function P5RegisterNotify(reg, obj) {
    try {
        var notification = reg.showNotification(obj.Title, {
            body: obj.Message,
            icon: obj.ImageUrl,
            tag: 'plumb5',
            data: obj
        });
    } catch (err) {/*log this error alert(err.message)*/
    }
}