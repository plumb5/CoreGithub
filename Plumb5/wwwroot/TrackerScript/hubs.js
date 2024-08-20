/*!
 * ASP.NET SignalR JavaScript Library v2.2.1
 * http://signalr.net/
 *
 * Copyright (c) .NET Foundation. All rights reserved.
 * Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
 *
 */

/// <reference path="..\..\SignalR.Client.JS\Scripts\jquery-1.6.4.js" />
/// <reference path="jquery.signalR.js" />
(function ($, window, undefined) {
    /// <param name="$" type="jQuery" />
    "use strict";

    if (typeof ($.signalR) !== "function") {
        throw new Error("SignalR: SignalR is not loaded. Please ensure jquery.signalR-x.js is referenced before ~/signalr/js.");
    }

    var signalR = $.signalR;

    function makeProxyCallback(hub, callback) {
        return function () {
            // Call the client hub method
            callback.apply(hub, $.makeArray(arguments));
        };
    }

    function registerHubProxies(instance, shouldSubscribe) {
        var key, hub, memberKey, memberValue, subscriptionMethod;

        for (key in instance) {
            if (instance.hasOwnProperty(key)) {
                hub = instance[key];

                if (!(hub.hubName)) {
                    // Not a client hub
                    continue;
                }

                if (shouldSubscribe) {
                    // We want to subscribe to the hub events
                    subscriptionMethod = hub.on;
                } else {
                    // We want to unsubscribe from the hub events
                    subscriptionMethod = hub.off;
                }

                // Loop through all members on the hub and find client hub functions to subscribe/unsubscribe
                for (memberKey in hub.client) {
                    if (hub.client.hasOwnProperty(memberKey)) {
                        memberValue = hub.client[memberKey];

                        if (!$.isFunction(memberValue)) {
                            // Not a client hub function
                            continue;
                        }

                        subscriptionMethod.call(hub, memberKey, makeProxyCallback(hub, memberValue));
                    }
                }
            }
        }
    }

    $.hubConnection.prototype.createHubProxies = function () {
        var proxies = {};
        this.starting(function () {
            // Register the hub proxies as subscribed
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, true);

            this._registerSubscribedHubs();
        }).disconnected(function () {
            // Unsubscribe all hub proxies when we "disconnect".  This is to ensure that we do not re-add functional call backs.
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, false);
        });

        proxies['P5Chat'] = this.createHubProxy('P5Chat'); 
        proxies['P5Chat'].client = { };
        proxies['P5Chat'].server = {
            acceptChatTransfer: function (agent, toAgent, visitorId) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["AcceptChatTransfer"], $.makeArray(arguments)));
             },

            agentIdleNotificationToVisitor: function (agent, message) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["agentIdleNotificationToVisitor"], $.makeArray(arguments)));
             },

            banVisitor: function (visitor) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["BanVisitor"], $.makeArray(arguments)));
             },

            beforeCallingAllVisitorsDisconnectOldVisitor: function (adsId, chatId) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["BeforeCallingAllVisitorsDisconnectOldVisitor"], $.makeArray(arguments)));
             },

            chatEndedForToday: function (visitor) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["ChatEndedForToday"], $.makeArray(arguments)));
             },

            chatTransferAgentBusy: function (toAgent, visitorId) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["ChatTransferAgentBusy"], $.makeArray(arguments)));
             },

            checkForOnlineContact: function (adsId, chatId) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["CheckForOnlineContact"], $.makeArray(arguments)));
             },

            connectAgent: function (agent) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["ConnectAgent"], $.makeArray(arguments)));
             },

            connectVisitor: function (visitor) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["ConnectVisitor"], $.makeArray(arguments)));
             },

            getAllAgent: function (agentId, adsId, chatId) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["GetAllAgent"], $.makeArray(arguments)));
             },

            getAllOnlineAgents: function (agentId, adsId, chatId) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["getAllOnlineAgents"], $.makeArray(arguments)));
             },

            getVisitorDetails: function (visitor) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["GetVisitorDetails"], $.makeArray(arguments)));
             },

            inactiveNotification: function (visitor) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["InactiveNotification"], $.makeArray(arguments)));
             },

            rejectChatTransfer: function (toAgent, visitorId) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["RejectChatTransfer"], $.makeArray(arguments)));
             },

            removeAllMySessionAgents: function () {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["RemoveAllMySessionAgents"], $.makeArray(arguments)));
             },

            sendBanner: function (bannerContent, redirectUrl, toVisitorId, chatAgent) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["SendBanner"], $.makeArray(arguments)));
             },

            sendBannerClickedEvent: function (agentId, banner, AdsId, UserId) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["SendBannerClickedEvent"], $.makeArray(arguments)));
             },

            sendBannerClosedEvent: function (agentId, banner, AdsId, UserId) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["SendBannerClosedEvent"], $.makeArray(arguments)));
             },

            sendInActiveAutoMessage: function (from, adsId, chatId, UserId, message, currentUrl) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["SendInActiveAutoMessage"], $.makeArray(arguments)));
             },

            sendMessageToAgent: function (visitor, message, agent) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["SendMessageToAgent"], $.makeArray(arguments)));
             },

            sendMessageToIMChatBot: function (agent, visitor, message) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["SendMessageToIMChatBot"], $.makeArray(arguments)));
             },

            sendMessageToVisitor: function (agent, visitorId, message) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["SendMessageToVisitor"], $.makeArray(arguments)));
             },

            transferChatSendRequest: function (fromAgent, toAgent, visitorId, reason, CurrentVistorPath) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["TransferChatSendRequest"], $.makeArray(arguments)));
             },

            typingEventToAgent: function (visitor) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["TypingEventToAgent"], $.makeArray(arguments)));
             },

            typingEventToVisitor: function (visitorId) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["TypingEventToVisitor"], $.makeArray(arguments)));
             },

            updateAgentName: function (agent, name) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["UpdateAgentName"], $.makeArray(arguments)));
             },

            updateVisitorSummary: function (visitor, name, emailId, contactNumber, comment, contactId) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["UpdateVisitorSummary"], $.makeArray(arguments)));
             },

            visitorResponseForAutoPing: function (visitor, url) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["VisitorResponseForAutoPing"], $.makeArray(arguments)));
             },

            xmppCon_OnPresenceFB: function (sender, pres) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["xmppCon_OnPresenceFB"], $.makeArray(arguments)));
             },

            xmppCon_OnPresenceGtalk: function (sender, pres) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["xmppCon_OnPresenceGtalk"], $.makeArray(arguments)));
             },

            xmppCon_ReceiveFacebook: function (sender, msg, data) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["xmppCon_ReceiveFacebook"], $.makeArray(arguments)));
             },

            xmppCon_ReceiveGtalk: function (sender, msg, data) {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["xmppCon_ReceiveGtalk"], $.makeArray(arguments)));
             },

            yesIamOnline: function () {
                return proxies['P5Chat'].invoke.apply(proxies['P5Chat'], $.merge(["YesIamOnline"], $.makeArray(arguments)));
             }
        };

        return proxies;
    };

    signalR.hub = $.hubConnection("/ChatApp/signalr", { useDefaultPath: false });
    $.extend(signalR, signalR.hub.createHubProxies());

}(window.jQuery, window));