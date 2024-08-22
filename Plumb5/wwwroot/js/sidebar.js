$(document).ready(function () {
    $("#ui_mainpanel").removeClass("lmsreportwid");
    var pageURL = window.location.href.toLowerCase();

    //DASHBOARD MENU START
    if (pageURL.indexOf("/dashboard/dashboardoverview") != -1) {
        $(".dashboardmenu").css('display', 'block');
        $(".dashboardmenu").prev().addClass('active');
        $(".dashboardmenu a[href='/Dashboard/DashboardOverview']").addClass("active");
    }
    if (pageURL.indexOf("/dashboard/realtime") != -1) {
        $(".dashboardmenu").css('display', 'block');
        $(".dashboardmenu").prev().addClass('active');
        $(".dashboardmenu a[href='/Dashboard/Realtime']").addClass("active");
    }
    if (pageURL.indexOf("/dashboard/campaigncalendar") != -1) {
        $(".dashboardmenu").css('display', 'block');
        $(".dashboardmenu").prev().addClass('active');
        $(".dashboardmenu a[href='/Dashboard/CampaignCalendar']").addClass("active");
    }
    if (pageURL.indexOf("/dashboard/campaignoverview") != -1) {
        $(".dashboardmenu").css('display', 'block');
        $(".dashboardmenu").prev().addClass('active');
        $(".dashboardmenu a[href='/Dashboard/CampaignOverView']").addClass("active");
    }
    //DASHBOARD MENU END

    //CONTACT MENU START
    else if ((pageURL.indexOf("/managecontact/contactimportoverviews") != -1)
        || (pageURL.indexOf("/managecontact/contactimport") != -1)
        || (pageURL.indexOf("/managecontact/contactimportgroupdistribution") != -1)) {
        $(".contactGroup").css('display', 'block');
        $(".contactGroup").prev().addClass('active');
        $(".contactGroup a[href='/ManageContact/ContactImportOverViews']").addClass("active");
    } else if (pageURL.indexOf("/managecontact/contact?groupid") != -1 || pageURL.indexOf("/managecontact/pushsubscribers") != -1 || pageURL.indexOf("/managecontact/mobilepushsubscribers") != -1) {
        $(".contactGroup").css('display', 'block');
        $(".contactGroup").prev().addClass('active');
        $(".contactGroup a[href='/ManageContact/Group']").addClass("active");
    } else if (pageURL.indexOf("/managecontact/contactdeduplicateoverview") != -1) {
        $(".contactGroup").css('display', 'block');
        $(".contactGroup").prev().addClass('active');
        $(".contactGroup a[href='/ManageContact/ContactDeDuplicateOverView']").addClass("active");
    } else if (pageURL.indexOf("/managecontact/contactemailvalidationoverview") != -1) {
        $(".contactGroup").css('display', 'block');
        $(".contactGroup").prev().addClass('active');
        $(".contactGroup a[href='/ManageContact/ContactEmailValidationOverView']").addClass("active");
    } else if (pageURL.indexOf("/managecontact/contactproperties") != -1) {
        $(".contactGroup").css('display', 'block');
        $(".contactGroup").prev().addClass('active');
        $(".contactGroup a[href='/ManageContact/Settings']").addClass("active");
    } else if (pageURL.indexOf("/managecontact/contact") != -1) {
        $(".contactGroup").css('display', 'block');
        $(".contactGroup").prev().addClass('active');
        $(".contactGroup a[href='/ManageContact/Contact']").addClass("active");
    } else if (pageURL.indexOf("/managecontact/group") != -1) {
        $(".contactGroup").css('display', 'block');
        $(".contactGroup").prev().addClass('active');
        $(".contactGroup a[href='/ManageContact/Group']").addClass("active");
    } else if (pageURL.indexOf("/managecontact/settings") != -1 || pageURL.indexOf("/managecontact/ftpimportsettings") != -1 || pageURL.indexOf("/managecontact/apiimportsettings") != -1 || pageURL.indexOf("/managecontact/apiimportrequest") != -1) {
        $(".contactGroup").css('display', 'block');
        $(".contactGroup").prev().addClass('active');
        $(".contactGroup a[href='/ManageContact/Settings']").addClass("active");
    }
    //CONTACT MENU END

    //WEB MENU START

    //ANALYTICS OVERVIEW START
    else if (pageURL.indexOf("/analytics/dashboard/visits") != -1 || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("from=session") > -1)) {
        $(".nav-sub-anlyover, .nav-sub-realtime").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-realtime a[href='/Analytics/Dashboard/Visits']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/analytics/audience/visitors") != -1) {
        $(".nav-sub-anlyover, .nav-sub-realtime").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-realtime a[href='/Analytics/Audience/Visitors']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/analytics/audience/cities") != -1 || pageURL.indexOf("/analytics/dashboard/countries") != -1 || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("city=") > -1) || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("country=") > -1)) {
        $(".nav-sub-anlyover, .nav-sub-realtime").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-realtime a[href='/Analytics/Audience/Cities']").addClass("sub-men active");
    }
    else if ((pageURL.indexOf("/analytics/dashboard/newreturn") != -1)
        || (pageURL.indexOf("/analytics/dashboard/timeonsite") != -1)
        || (pageURL.indexOf("/analytics/dashboard/timetrends") != -1)
        || (pageURL.indexOf("/analytics/audience/frequency") != -1)
        || (pageURL.indexOf("/analytics/audience/recency") != -1)
        || (pageURL.indexOf("/analytics/audience/timespend") != -1)
        || (pageURL.indexOf("/analytics/audience/pagedepth") != -1)
        || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("type=") > -1)
        || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("redirectedfrom=timeonsite") > -1)
        || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("redirectedfrom=timetrends") > -1)
        || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("frequency=") > -1)
        || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("recency=") > -1)
        || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("time=") > -1)
        || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("depth=") > -1)

    ) {
        $(".nav-sub-anlyover, .nav-sub-realtime").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-realtime a[href='/Analytics/Dashboard/NewReturn']").addClass("sub-men active");
    }
    else if ((pageURL.indexOf("/analytics/audience/browser") != -1)
        || (pageURL.indexOf("/analytics/audience/devices") != -1)
        || (pageURL.indexOf("/analytics/audience/network") != -1)
        || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("device=") > -1)
        || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("network=") > -1)

    ) {
        $(".nav-sub-anlyover, .nav-sub-realtime").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-realtime a[href='/Analytics/Audience/Browser']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/analytics/analyticreports") != -1 || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("from=myreport") > -1)) {
        $(".nav-sub-anlyover, .nav-sub-realtime").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-realtime a[href='/Analytics/AnalyticReports']").addClass("sub-men active");
    }
    //ANALYTICS OVERVIEW END

    //SITE SEARCH START
    else if ((pageURL.indexOf("/analytics/sitesearchconfiguration") != -1) || (pageURL.indexOf("/analytics/sitesearchoverview") != -1)
        || (pageURL.indexOf("/analytics/sitesearchterms") != -1)
        || (pageURL.indexOf("/analytics/sitesearchpages") != -1)) {
        $(".nav-sub-anlyover").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-anlyover a[href='/Analytics/SiteSearchOverView']").addClass("sub-men active");
    }
    //SITE SEARCH END

    //Traffic Sources START
    else if (pageURL.indexOf("/analytics/traffic/allsources") != -1 || (pageURL.indexOf("/analytics/uniques/unique") > -1 && (pageURL.indexOf("allsource=") > -1))) {
        $(".nav-sub-anlyover, .nav-sub-allSources").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-allSources a[href='/Analytics/Traffic/AllSources']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/analytics/traffic/referral") != -1 || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("refer=") > -1)) {
        $(".nav-sub-anlyover, .nav-sub-allSources").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-allSources a[href='/Analytics/Traffic/Referral']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/analytics/traffic/organicsearch") != -1 || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("search=") > -1)) {
        $(".nav-sub-anlyover, .nav-sub-allSources").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-allSources a[href='/Analytics/Traffic/OrganicSearch']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/analytics/traffic/paidcampaigns") != -1 || pageURL.indexOf("/analytics/traffic/adwords") != -1 ||
        pageURL.indexOf("/analytics/traffic/adsense") != -1 || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("adwords=") > -1)
        || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("adsense=") > -1) ||
        (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("utm=") > -1)) {
        $(".nav-sub-anlyover, .nav-sub-allSources").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-allSources a[href='/Analytics/Traffic/PaidCampaigns']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/analytics/traffic/socialsources") != -1 || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("social=") > -1)) {
        $(".nav-sub-anlyover, .nav-sub-allSources").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-allSources a[href='/Analytics/Traffic/SocialSources']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/analytics/traffic/emailsources") != -1 || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("source=email") > -1)) {
        $(".nav-sub-anlyover, .nav-sub-allSources").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-allSources a[href='/Analytics/Traffic/EmailSources']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/analytics/traffic/smssources") != -1 || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("source=sms") > -1)) {
        $(".nav-sub-anlyover, .nav-sub-allSources").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-allSources a[href='/Analytics/Traffic/SmsSources']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/analytics/traffic/visitorsflow") != -1) {
        $(".nav-sub-anlyover, .nav-sub-allSources").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-allSources a[href='/Analytics/Traffic/VisitorsFlow']").addClass("sub-men active");
    }
    //TRAFFIC SOURCES END  


    //CONVERSIONS START
    else if (pageURL.indexOf("/analytics/conversions/goal") != -1) {
        $(".nav-sub-anlyover, .nav-sub-conversions").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-conversions a[href='/Analytics/Conversions/Goal']").addClass("sub-men active");
    }

    else if (pageURL.indexOf("/analytics/conversions/attributionmodel") != -1) {
        $(".nav-sub-anlyover, .nav-sub-conversions").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-conversions a[href='/Analytics/Conversions/AttributionModel']").addClass("sub-men active");
    }

    //CONVERSIONS END

    //CONTENT ANALYSIS START
    else if (pageURL.indexOf("/analytics/content/popularpages") != -1 || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("pagename=") > -1 && pageURL.indexOf("channel=web") > -1) || (pageURL.indexOf("/analytics/content/pageanalysis?page=") > -1 && pageURL.indexOf("popular=1") > -1)
        || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("pageanalysis=true") > -1 && pageURL.indexOf("popular=1") > -1)) {
        $(".nav-sub-anlyover, .nav-sub-contAnalysis").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-contAnalysis a[href='/Analytics/Content/PopularPages']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/analytics/content/topentrypages") != -1 || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("entry=") > -1) || (pageURL.indexOf("/analytics/content/pageanalysis?page=") > -1 && pageURL.indexOf("entry=1") > -1)) {
        $(".nav-sub-anlyover, .nav-sub-contAnalysis").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-contAnalysis a[href='/Analytics/Content/TopEntryPages']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/analytics/content/topexitpages") != -1 || (pageURL.indexOf("/analytics/uniques/unique") > -1 && pageURL.indexOf("exit=") > -1) || (pageURL.indexOf("/analytics/content/pageanalysis?page=") > -1 && pageURL.indexOf("exit=1") > -1)) {
        $(".nav-sub-anlyover, .nav-sub-contAnalysis").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-contAnalysis a[href='/Analytics/Content/TopExitPages']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/analytics/content/eventtracking") != -1 || (pageURL.indexOf("/analytics/uniques/unique") > -1) && pageURL.indexOf("events=") > -1) {
        $(".nav-sub-anlyover, .nav-sub-contAnalysis").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-contAnalysis a[href='/Analytics/Content/EventTracking']").addClass("sub-men active");
    } else if (pageURL.indexOf("/webpush/dashboard") != -1) {
        $(".nav-sub-anlyover, .nav-sub-brwsenotif").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-anlyover a[href='/WebPush/Dashboard']").addClass("sub-men active");
    }

    //CONTENT ANALYSIS END

    //FORM START
    else if (pageURL.indexOf("/captureform/dashboard") != -1) {
        $(".nav-sub-anlyover, .nav-sub-frmbaners").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-anlyover a[href='/CaptureForm/Dashboard']").addClass("sub-men active");
    }
    else if ((pageURL.indexOf("/captureform/manageembeddedforms") != -1)
        || (pageURL.indexOf("/captureform/managepopupforms") != -1) ||
        (pageURL.indexOf("/captureform/managetaggedforms") != -1) || (pageURL.indexOf("/captureform/create") != -1)) {
        $(".nav-sub-anlyover, .nav-sub-frmbaners").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-anlyover a[href='/CaptureForm/ManageEmbeddedForms']").addClass("sub-men active");
    }
    else if ((pageURL.indexOf("/captureform/response/embeddedforms") != -1) || (pageURL.indexOf("/captureform/response/popupforms") != -1) || (pageURL.indexOf("/captureform/response/taggedforms") != -1)) {
        $(".nav-sub-anlyover, .nav-sub-frmbaners").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-anlyover a[href='/CaptureForm/Response/EmbeddedForms']").addClass("sub-men active");
    }
    else if ((pageURL.indexOf("/captureform/settings") != -1) || (pageURL.indexOf("/captureform/notificationrules") != -1) || (pageURL.indexOf("/captureform/leadassignnotificationsetting") != -1)) {
        $(".nav-sub-anlyover, .nav-sub-frmbaners").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-anlyover a[href='/CaptureForm/Settings']").addClass("sub-men active");
    }

    //BROWSER NOTIFICATIONS START
    else if (pageURL.indexOf("/webpush/setting") != -1) {
        $(".nav-sub-anlyover, .nav-sub-brwsenotif").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-brwsenotif a[href='/WebPush/Setting']").addClass("sub-men active");
    } else if (pageURL.indexOf("/webpush/template") != -1 || pageURL.indexOf("/webpush/createtemplate") != -1 || pageURL.indexOf("/webpush/templatearchive") != -1) {
        $(".nav-sub-anlyover, .nav-sub-brwsenotif").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-anlyover a[href='/WebPush/Template']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/webpush/report") != -1) {
        $(".nav-sub-anlyover, .nav-sub-brwsenotif").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-anlyover a[href='/WebPush/Report']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/webpush/managebrowsernotifications/scheduled") != -1 || pageURL.indexOf("/webpush/managebrowsernotifications/rss") != -1 || pageURL.indexOf("/webpush/managebrowsernotifications/draft") != -1 || pageURL.indexOf("/webpush/schedulecampaign") != -1 || pageURL.indexOf("/webpush/rssfeed") != -1) {
        $(".nav-sub-anlyover, .nav-sub-brwsenotif").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-anlyover a[href='/WebPush/ManageBrowserNotifications/Scheduled']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/webpush/subscribers") != -1) {
        $(".nav-sub-anlyover, .nav-sub-brwsenotif").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-anlyover a[href='/WebPush/Subscribers']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/webpush/webpushindividualresponse") != -1) {
        $(".nav-sub-anlyover, .nav-sub-brwsenotif").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-anlyover a[href='/WebPush/WebPushIndividualResponse']").addClass("sub-men active");
    }
    //BROWSER NOTIFICATIONS END

    //LANDING PAGE START
    else if ((pageURL.indexOf("/analytics/landingpage") != -1) || (pageURL.indexOf("/analytics/landingpageeditor") != -1)
        || (pageURL.indexOf("/analytics/landingpagetemplate") != -1)) {
        $(".nav-sub-anlyover").css('display', 'block');
        $(".nav-sub-anlyover").prev().addClass('active');
        $(".nav-sub-anlyover a[href='/Analytics/LandingPage']").addClass("sub-men active");
    }
    //LANDING PAGE END

    //WEB MENU END

    //MOBILE MENU START
    //ANALYTICS OVERVIEW START
    else if (pageURL.indexOf("/mobileanalytics/mobileapp/visits") != -1 || (pageURL.indexOf("/mobileanalytics/mobileapp/uniquevisits") > -1 && pageURL.indexOf("cat=visits") > -1)) {
        $(".nav-sub-anlyovermob, .nav-sub-realtimemob").css('display', 'block');
        $(".nav-sub-anlyovermob").prev().addClass('active');
        $(".nav-sub-realtimemob a[href='/MobileAnalytics/MobileApp/Visits']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/mobileanalytics/mobileapp/visitors") != -1) {
        $(".nav-sub-anlyovermob, .nav-sub-realtimemob").css('display', 'block');
        $(".nav-sub-anlyovermob").prev().addClass('active');
        $(".nav-sub-realtimemob a[href='/MobileAnalytics/MobileApp/Visitors']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/mobileanalytics/mobileapp/cities") != -1
        || pageURL.indexOf("/mobileanalytics/mobileapp/countries") != -1
        || (pageURL.indexOf("/mobileanalytics/mobileapp/uniquevisits") > -1 && pageURL.indexOf("city=") > -1)
        || (pageURL.indexOf("/mobileanalytics/mobileapp/uniquevisits") > -1 && pageURL.indexOf("country=") > -1)) {
        $(".nav-sub-anlyovermob, .nav-sub-realtimemob").css('display', 'block');
        $(".nav-sub-anlyovermob").prev().addClass('active');
        $(".nav-sub-realtimemob a[href='/MobileAnalytics/MobileApp/Cities']").addClass("sub-men active");
    }
    else if ((pageURL.indexOf("/mobileanalytics/mobileapp/newreturn") != -1)
        || (pageURL.indexOf("/mobileanalytics/mobileapp/timeonmobile") != -1)
        || (pageURL.indexOf("/mobileanalytics/mobileapp/frequency") != -1)
        || (pageURL.indexOf("/mobileanalytics/mobileapp/recency") != -1)
        || (pageURL.indexOf("/mobileanalytics/mobileapp/timespend") != -1)
        || (pageURL.indexOf("/mobileanalytics/mobileapp/uniquevisits") > -1 && pageURL.indexOf("type=0") > -1)
        || (pageURL.indexOf("/mobileanalytics/mobileapp/uniquevisits") > -1 && pageURL.indexOf("redirectedfrom=timeonsite") > -1)
        || (pageURL.indexOf("/mobileanalytics/mobileapp/uniquevisits") > -1 && pageURL.indexOf("frequency=") > -1)
        || (pageURL.indexOf("/mobileanalytics/mobileapp/uniquevisits") > -1 && pageURL.indexOf("recency=") > -1)
        || (pageURL.indexOf("/mobileanalytics/mobileapp/uniquevisits") > -1 && pageURL.indexOf("time=") > -1)) {
        $(".nav-sub-anlyovermob, .nav-sub-realtimemob").css('display', 'block');
        $(".nav-sub-anlyovermob").prev().addClass('active');
        $(".nav-sub-realtimemob a[href='/MobileAnalytics/MobileApp/NewReturn']").addClass("sub-men active");
    }
    else if ((pageURL.indexOf("/mobileanalytics/mobileapp/operatingsystem") != -1)
        || (pageURL.indexOf("/mobileanalytics/mobileapp/screenresolution") != -1)
        || (pageURL.indexOf("/mobileanalytics/mobileapp/device") != -1)
        || (pageURL.indexOf("/mobileanalytics/mobileapp/carrier") != -1)
        || (pageURL.indexOf("/mobileanalytics/mobileapp/uniquevisits") > -1 && pageURL.indexOf("&os=") > -1)
        || (pageURL.indexOf("/mobileanalytics/mobileapp/uniquevisits") > -1 && pageURL.indexOf("&resolution=") > -1)
        || (pageURL.indexOf("/mobileanalytics/mobileapp/uniquevisits") > -1 && pageURL.indexOf("&device=") > -1)
        || (pageURL.indexOf("/mobileanalytics/mobileapp/uniquevisits") > -1 && pageURL.indexOf("&carrier=") > -1)
    ) {
        $(".nav-sub-anlyovermob, .nav-sub-realtimemob").css('display', 'block');
        $(".nav-sub-anlyovermob").prev().addClass('active');
        $(".nav-sub-realtimemob a[href='/MobileAnalytics/MobileApp/OperatingSystem']").addClass("sub-men active");
    } else if ((pageURL.indexOf("/mobilepushnotification/schedules") != -1) || (pageURL.indexOf("/mobilepushnotification/campaignschedule") != -1)) {
        $(".nav-sub-anlyovermob, .nav-sub-contPushnotifmob").css("display", "block");
        $(".nav-sub-anlyovermob").prev().addClass("active");
        $(".nav-sub-contPushnotifmob a[href='/MobilePushNotification/Schedules']").addClass("sub-men active");
    } else if ((pageURL.indexOf("/mobilepushnotification/dashboard") != -1) || (pageURL.indexOf("/mobilepushnotification/campaignschedule") != -1)) {
        $(".nav-sub-anlyovermob, .nav-sub-contPushnotifmob").css("display", "block");
        $(".nav-sub-anlyovermob").prev().addClass("active");
        $(".nav-sub-contPushnotifmob a[href='/MobilePushNotification/Dashboard']").addClass("sub-men active");
    } else if ((pageURL.indexOf("/mobilepushnotification/mobiledeviceinfo") != -1)) {
        $(".nav-sub-anlyovermob, .nav-sub-contPushnotifmob").css("display", "block");
        $(".nav-sub-anlyovermob").prev().addClass("active");
        $(".nav-sub-contPushnotifmob a[href='/MobilePushNotification/MobileDeviceInfo']").addClass("sub-men active");
    } else if ((pageURL.indexOf("/mobilepushnotification/mobilepushtemplate") != -1) || (pageURL.indexOf("/mobilepushnotification/designmobilepushtemplate") != -1)) {
        $(".nav-sub-anlyovermob, .nav-sub-contPushnotifmob").css("display", "block");
        $(".nav-sub-anlyovermob").prev().addClass("active");
        $(".nav-sub-contPushnotifmob a[href='/MobilePushNotification/MobilePushTemplate']").addClass("sub-men active");
    } else if ((pageURL.indexOf("/mobilepushnotification/report") != -1)) {
        $(".nav-sub-anlyovermob, .nav-sub-contPushnotifmob").css("display", "block");
        $(".nav-sub-anlyovermob").prev().addClass("active");
        $(".nav-sub-contPushnotifmob a[href='/MobilePushNotification/Report']").addClass("sub-men active");
    }
    else if ((pageURL.indexOf("/mobilepushnotification/mobilepushsettings") != -1)) {
        $(".nav-sub-anlyovermob").css("display", "block");
        $(".mobSettings a[href='/MobilePushNotification/MobilePushSettings']").addClass("sub-men active");
    } else if ((pageURL.indexOf("/mobileinapp/dashboard") != -1)) {
        $(".nav-sub-anlyovermob, .nav-sub-continAppnotifmob").css("display", "block");
        $(".nav-sub-anlyovermob").prev().addClass("active");
        $(".nav-sub-continAppnotifmob a[href='/MobileInApp/DashBoard']").addClass("sub-men active");
    }
    else if ((pageURL.indexOf("/mobileinapp/managecampaign") != -1) || (pageURL.indexOf("/mobileinapp/createcampaign") != -1)) {
        $(".nav-sub-anlyovermob, .nav-sub-continAppnotifmob").css("display", "block");
        $(".nav-sub-anlyovermob").prev().addClass("active");
        $(".nav-sub-continAppnotifmob a[href='/MobileInApp/ManageCampaign']").addClass("sub-men active");
    }
    else if ((pageURL.indexOf("/mobileinapp/reports") != -1) || (pageURL.indexOf("/mobileinapp/reports/formresponses") != -1)) {
        $(".nav-sub-anlyovermob, .nav-sub-continAppnotifmob").css("display", "block");
        $(".nav-sub-anlyovermob").prev().addClass("active");
        $(".nav-sub-continAppnotifmob a[href='/MobileInApp/Reports']").addClass("sub-men active");
    }
    //ANALYTICS OVERVIEW END

    //CONTENT ANALYSIS START
    else if (pageURL.indexOf("/mobileanalytics/mobileapp/popularpages") != -1 || (pageURL.indexOf("/analytics/uniques/uniquevisits") > -1 && pageURL.indexOf("pagename=") > -1 && pageURL.indexOf("channel=app") > -1)) {
        $(".nav-sub-anlyovermob, .nav-sub-contAnalysismob").css('display', 'block');
        $(".nav-sub-anlyovermob").prev().addClass('active');
        $(".nav-sub-contAnalysismob a[href='/MobileAnalytics/MobileApp/PopularPages']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/mobileanalytics/mobileapp/eventtracking") != -1) {
        $(".nav-sub-anlyovermob, .nav-sub-contAnalysismob").css('display', 'block');
        $(".nav-sub-anlyovermob").prev().addClass('active');
        $(".nav-sub-contAnalysismob a[href='/MobileAnalytics/MobileApp/EventTracking']").addClass("sub-men active");
    }
    //CONTENT ANALYSIS END
    //MOBILE MENU END

    //MAIL MENU START
    else if (pageURL.indexOf("/mail/maildashboard") != -1) {
        $(".nav-sub-mail").css('display', 'block');
        $(".nav-sub-mail").prev().addClass('active');
        $(".nav-sub-mail a[href='/Mail/MailDashboard']").addClass("active");
    }
    else if ((pageURL.indexOf("/mail/mailtemplate") != -1)
        || (pageURL.indexOf("/mail/templatedesign") != -1)
        || (pageURL.indexOf("/mail/designuploadtemplatewitheditor") != -1)
        || (pageURL.indexOf("/mail/designtemplatewitheditor") != -1)
        || (pageURL.indexOf("/mail/designtemplatewithp5editor") != -1)
        || (pageURL.indexOf("/mail/mailtemplatearchive") != -1)) {
        $(".nav-sub-mail, .nav-sub-mailmanage").css('display', 'block');
        $(".nav-sub-mail").prev().addClass('active');
        $(".nav-sub-mailmanage a[href='/Mail/MailTemplate']").addClass("sub-men active");
    }
    //MAIL CAMPAIGN START
    else if ((pageURL.indexOf("/mail/schedules") != -1)
        || (pageURL.indexOf("/mail/triggerdashboard") != -1)
        || (pageURL.indexOf("/mail/campaign") != -1) || pageURL.indexOf("/mail/mailschedule") != -1 || pageURL.indexOf("/mail/createmailtrigger") != -1) {
        $(".nav-sub-mail, .nav-sub-mailmanage").css('display', 'block');
        $(".nav-sub-mail").prev().addClass('active');
        $(".nav-sub-mailmanage a[href='/Mail/Schedules']").addClass("sub-men active");
    }
    //MAIL CAMPAIGN RESPONSES START
    else if ((pageURL.indexOf("/mail/responses") != -1)
        || (pageURL.indexOf("/mail/triggerreport") != -1)
        || (pageURL.indexOf("/mail/abtestingreport") != -1)) {
        $(".nav-sub-mail, .nav-sub-mailreports").css('display', 'block');
        $(".nav-sub-mail").prev().addClass('active');
        $(".nav-sub-mailreports a[href='/Mail/Responses']").addClass("sub-men active");
    }
    //Bounce Report Start
    else if ((pageURL.indexOf("/mail/bouncedhard") != -1) || (pageURL.indexOf("/mail/bouncedsoft") != -1)) {
        $(".nav-sub-mail, .nav-sub-mailreports").css('display', 'block');
        $(".nav-sub-mail").prev().addClass('active');
        $(".nav-sub-mail a[href='/Mail/BouncedHard']").addClass("sub-men active");
    }
    //MAIL ALERTS START
    else if (pageURL.indexOf("/mail/individualresponse") != -1) {
        $(".nav-sub-mail, .nav-sub-mailreports").css('display', 'block');
        $(".nav-sub-mail").prev().addClass('active');
        $(".nav-sub-mailreports a[href='/Mail/individualResponse']").addClass("sub-men active");
    }
    //MAIL SETTING START
    else if (pageURL.indexOf("/mail/mailsettings") != -1) {
        $(".nav-sub-mail").css('display', 'block');
        $(".nav-sub-mail").prev().addClass('active');
        $(".nav-sub-mail a[href='/Mail/MailSettings']").addClass("active");
    }
    //MAIL SETTING END
    //MAIL MENU END

    //SMS MENU START
    //SMS DASHBOARD START
    else if (pageURL.indexOf("/sms/smsdashboard") != -1) {
        $(".nav-sub-sms").css('display', 'block');
        $(".nav-sub-sms").prev().addClass('active');
        $(".nav-sub-sms a[href='/Sms/SmsDashboard']").addClass("active");
    }
    //SMS DASHBOARD END
    else if (pageURL.indexOf("/sms/report") != -1 || pageURL.indexOf("/sms/triggerreport") != -1) {
        $(".nav-sub-sms,.nav-sub-mailreports").css('display', 'block');
        $(".nav-sub-sms").prev().addClass('active');
        $(".nav-sub-mailreports a[href='/Sms/Report']").addClass("sub-men active");
    } else if (pageURL.indexOf("/sms/smsindividualresponse") != -1) {
        $(".nav-sub-sms,.nav-sub-mailreports").css('display', 'block');
        $(".nav-sub-sms").prev().addClass('active');
        $(".nav-sub-mailreports a[href='/Sms/SmsIndividualResponse']").addClass("sub-men active");
    }
    //SMS CAMPAIGN START
    else if ((pageURL.indexOf("/sms/schedules") != -1)
        || (pageURL.indexOf("/sms/triggerdashboard") != -1)
        || (pageURL.indexOf("/sms/campaign") != -1)
        || (pageURL.indexOf("/sms/schedulecampaign") != -1)
        || pageURL.indexOf("/sms/createsmstrigger") != -1) {
        $(".nav-sub-sms, .nav-sub-mailmanage").css('display', 'block');
        $(".nav-sub-sms").prev().addClass('active');
        $(".nav-sub-mailmanage a[href='/Sms/Schedules']").addClass("sub-men active");
    }
    else if ((pageURL.indexOf("/sms/template") != -1) || (pageURL.indexOf("/sms/smstemplatearchive") != -1) || (pageURL.indexOf("/sms/uploadtemplate") != -1)) {
        $(".nav-sub-sms, .nav-sub-mailmanage").css('display', 'block');
        $(".nav-sub-sms").prev().addClass('active');
        $(".nav-sub-mailmanage a[href='/Sms/Template']").addClass("sub-men active");
    }
    else if ((pageURL.indexOf("/sms/smssettings") != -1)) {
        $(".nav-sub-sms,.nav-sub-mailreports").css('display', 'block');
        $(".nav-sub-sms").prev().addClass('active');
        $(".nav-sub-sms a[href='/Sms/SmsSettings']").addClass("sub-men active");
    }
    //SMS Campaign Responses END
    //SMS MENU END

    //WhatsApp MENU START
    //WhatsApp DASHBOARD START
    else if (pageURL.indexOf("/whatsapp/whatsappdashboard") != -1) {
        $(".nav-sub-whatsapp").css('display', 'block');
        $(".nav-sub-whatsapp").prev().addClass('active');
        $(".nav-sub-whatsapp a[href='/WhatsApp/WhatsAppDashboard']").addClass("active");
    }
    //WhatsApp DASHBOARD END
    //WhatsApp CAMPAIGN START
    else if ((pageURL.indexOf("/whatsapp/schedules") != -1)
        || (pageURL.indexOf("/whatsapp/triggerdashboard") != -1)
        || (pageURL.indexOf("/whatsapp/campaign") != -1)
        || (pageURL.indexOf("/whatsapp/schedulecampaign") != -1)
        || pageURL.indexOf("/whatsapp/createwhatsapptrigger") != -1) {
        $(".nav-sub-whatsapp, .nav-sub-mailmanage").css('display', 'block');
        $(".nav-sub-whatsapp").prev().addClass('active');
        $(".nav-sub-mailmanage a[href='/WhatsApp/Schedules']").addClass("sub-men active");
    }
    //WhatsApp CAMPAIGN  END
    //WhatsApp TEMPLATES  START
    else if ((pageURL.indexOf("/whatsapp/whatsapptemplates") != -1) || (pageURL.indexOf("/whatsapp/uploadtemplate") != -1)) {
        $(".nav-sub-whatsapp, .nav-sub-mailmanage").css('display', 'block');
        $(".nav-sub-whatsapp").prev().addClass('active');
        $(".nav-sub-mailmanage a[href='/WhatsApp/WhatsAppTemplates']").addClass("sub-men active");
    }
    //WhatsApp TEMPLATES  END
    //WhatsApp REPORTS  END
    else if (pageURL.indexOf("/whatsapp/report") != -1 || pageURL.indexOf("/whatsapp/triggerreport") != -1) {
        $(".nav-sub-whatsapp,.nav-sub-mailreports").css('display', 'block');
        $(".nav-sub-whatsapp").prev().addClass('active');
        $(".nav-sub-mailreports a[href='/WhatsApp/Report']").addClass("sub-men active");
    } else if (pageURL.indexOf("/whatsapp/whatsappindividualresponse") != -1) {
        $(".nav-sub-whatsapp,.nav-sub-mailreports").css('display', 'block');
        $(".nav-sub-whatsapp").prev().addClass('active');
        $(".nav-sub-mailreports a[href='/WhatsApp/WhatsAppIndividualResponse']").addClass("sub-men active");
    }
    //WhatsApp SETTINGS  START
    else if ((pageURL.indexOf("/whatsapp/whatsappsettings") != -1)) {
        $(".nav-sub-whatsapp,.nav-sub-mailmanage").css('display', 'block');
        $(".nav-sub-whatsapp").prev().addClass('active');
        $(".nav-sub-whatsapp a[href='/WhatsApp/WhatsAppSettings']").addClass("sub-men active");
    }
    //WhatsApp SETTINGS  END

    //Chat START
    else if (pageURL.indexOf("/chat/dashboard") != -1) {
        $(".nav-sub-livechat").css('display', 'block');
        $(".nav-sub-livechat").prev().addClass('active');
        $(".nav-sub-livechat a[href='/Chat/Dashboard']").addClass("active");
    } else if (pageURL.indexOf("/chat/responses") != -1 || pageURL.indexOf("/chat/agentreport") != -1) {
        $(".nav-sub-livechat").css('display', 'block');
        $(".nav-sub-livechat").prev().addClass('active');
        $(".nav-sub-livechat a[href='/Chat/Responses']").addClass("active");
    }
    else if (pageURL.indexOf("/chat/configuration") != -1) {
        $(".nav-sub-livechat").css('display', 'block');
        $(".nav-sub-livechat").prev().addClass('active');
        $(".nav-sub-livechat a[href='/Chat/Configuration']").addClass("active");
    }
    else if (pageURL.indexOf("/chat/allchat") != -1 ||
        pageURL.indexOf("/chat/newchat") != -1 ||
        pageURL.indexOf("/chat/chatroom") != -1) {
        $(".nav-sub-livechat").css('display', 'block');
        $(".nav-sub-livechat").prev().addClass('active');
        $(".nav-sub-livechat a[href='/Chat/AllChat']").addClass("active");
    }

    //Chat END

    //Lead Management Start
    else if (pageURL.indexOf("/prospect/dashboard") != -1 || pageURL.indexOf("/prospect/hierarchydashboard") != -1) {
        $(".nav-sub-lms").css('display', 'block');
        $(".nav-sub-lms").prev().addClass('active');
        $(".nav-sub-lms a[href='/Prospect/Dashboard']").addClass("active");
    }
    else if (pageURL.indexOf("/prospect/leadscoring") != -1) {
        $(".nav-sub-lms").css('display', 'block');
        $(".nav-sub-lms").prev().addClass('active');
        $(".nav-sub-lms a[href='/Prospect/leadscoring']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/prospect/leads") != -1 || pageURL.indexOf("/prospect/leadsource") != -1) {
        $(".nav-sub-lms").css('display', 'block');
        $(".nav-sub-lms").prev().addClass('active');
        $(".nav-sub-lms a[href='/Prospect/Leads']").addClass("active");
    }
    else if (pageURL.indexOf("/prospect/followups") != -1) {
        $(".nav-sub-lms").css('display', 'block');
        $(".nav-sub-lms").prev().addClass('active');
        $(".nav-sub-lms a[href='/Prospect/FollowUps']").addClass("active");
    }
    else if (pageURL.indexOf("/prospect/reports/myreports") != -1) {
        $(".nav-sub-lms, .nav-sub-leadreports").css('display', 'block');
        $(".nav-sub-lms").prev().addClass('active');
        $(".nav-sub-leadreports a[href='/Prospect/Reports/MyReports']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/prospect/sourcereports") != -1 || pageURL.indexOf("/prospect/stagereports") != -1 || pageURL.indexOf("/prospect/lmsfollowup") != -1 || pageURL.indexOf("/prospect/lmscampaignreport") != -1 || pageURL.indexOf("/prospect/publisherreport") != -1) {
        $(".nav-sub-lms, .nav-sub-leadreports").css('display', 'block');
        $(".nav-sub-lms").prev().addClass('active');
        $(".nav-sub-leadreports a[href='/Prospect/Reports/MyReports']").addClass("sub-men active");
        $("#ui_mainpanel").addClass("lmsreportwid");
    }
    else if (pageURL.indexOf("/prospect/reports/scheduledmailalerts") != -1) {
        $(".nav-sub-lms, .nav-sub-leadreports").css('display', 'block');
        $(".nav-sub-lms").prev().addClass('active');
        $(".nav-sub-leadreports a[href='/Prospect/Reports/ScheduledMailAlerts']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/prospect/reports/scheduledwhatsappalerts") != -1) {
        $(".nav-sub-lms, .nav-sub-leadreports").css('display', 'block');
        $(".nav-sub-lms").prev().addClass('active');
        $(".nav-sub-leadreports a[href='/Prospect/Reports/scheduledwhatsappalerts']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/prospect/reports/scheduledsmsalerts") != -1) {
        $(".nav-sub-lms, .nav-sub-leadreports").css('display', 'block');
        $(".nav-sub-lms").prev().addClass('active');
        $(".nav-sub-leadreports a[href='/Prospect/Reports/ScheduledSmsAlerts']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/prospect/reports/scheduledwhatsappalerts") != -1) {
        $(".nav-sub-lms, .nav-sub-leadreports").css('display', 'block');
        $(".nav-sub-lms").prev().addClass('active');
        $(".nav-sub-leadreports a[href='/Prospect/Reports/ScheduledWhatsappAlerts']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/prospect/contactarchive") != -1) {
        $(".nav-sub-lms, .nav-sub-leadreports").css('display', 'block');
        $(".nav-sub-lms").prev().addClass('active');
        $(".nav-sub-leadreports a[href='/Prospect/ContactArchive']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/prospect/settings") != -1 || pageURL.indexOf("/prospect/notificationrules") != -1 || pageURL.indexOf("/prospect/inactivenotification") != -1 || pageURL.indexOf("/prospect/callsettings") != -1 || pageURL.indexOf("/prospect/agentnotification") != -1 || pageURL.indexOf("/prospect/leadassignnotificationsetting") != -1 || pageURL.indexOf("/prospect/leadproperties") != -1 || pageURL.indexOf("/prospect/advancedsettings") != -1) {
        $(".nav-sub-lms").css('display', 'block');
        $(".nav-sub-lms").prev().addClass('active');
        $(".nav-sub-lms a[href='/Prospect/Settings']").addClass("active");
    }
    else if ((pageURL.indexOf("/prospect/contactimportoverviews") != -1) || (pageURL.indexOf("/prospect/contactimport") != -1) || (pageURL.indexOf("/prospect/contactimportgroupdistribution") != -1)) {
        $(".nav-sub-lms").css('display', 'block');
        $(".nav-sub-lms").prev().addClass('active');
        $(".nav-sub-lms a[href='/Prospect/ContactImportOverViews']").addClass("active");
    }

    //Lead Management End

    //ADVANCED START
    else if (pageURL.indexOf("/journey/workflows") != -1 || pageURL.indexOf("/journey/rules") != -1 || pageURL.indexOf("/journey/createrule") != -1 || pageURL.indexOf("/journey/responses") != -1 || pageURL.indexOf("/journey/responses?workflowid=") != -1) {
        $(".nav-sub-adv").css('display', 'block');
        $(".nav-sub-adv").prev().addClass('active');
        $(".nav-sub-adv a[href='/Journey/Workflows']").addClass("active");
    }
    else if (pageURL.indexOf("/customevents/") != -1) {
        $(".nav-sub-adv").css('display', 'block');
        $(".nav-sub-adv").prev().addClass('active');
        $(".nav-sub-adv a[href='/CustomEvents/CustomEventsOverview/']").addClass("active");
    }
    else if (pageURL.indexOf("/revenue/") != -1) {
        $(".nav-sub-adv").css('display', 'block');
        $(".nav-sub-adv").prev().addClass('active');
        $(".nav-sub-adv a[href='/Revenue/RevenueDashboard/']").addClass("active");
    }
    //ADVANCED END

    //Segment Builder
    else if (pageURL.indexOf("/segmentbuilder/createsegment") != -1) {
        $(".nav-sub-adv").css('display', 'block');
        $(".nav-sub-adv").prev().addClass('active');
        $(".nav-sub-adv a[href='/SegmentBuilder/CreateSegment']").addClass("active");
    }
    //Segment Builder END

    //Social Start
    else if (pageURL.indexOf("/facebookpage/facebooklogin") != -1) {
        $(".nav-sub-social").css("display", "block");
        $(".nav-sub-social").prev().addClass("active");
    }
    else if (pageURL.indexOf("/facebookpage/dashboard") != -1) {
        $(".nav-sub-social").css("display", "block");
        $(".nav-sub-social").prev().addClass("active");
        $(".nav-sub-item a[href='/FacebookPage/Dashboard']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/facebookpage/scheduledposts") != -1 || pageURL.indexOf("/facebookpage/publishedposts") != -1) {
        $(".nav-sub-social").css("display", "block");
        $(".nav-sub-social").prev().addClass("active");
        $(".nav-sub-item a[href='/FacebookPage/ScheduledPosts']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/facebookpage/facebookcontacts") != -1) {
        $(".nav-sub-social").css("display", "block");
        $(".nav-sub-social").prev().addClass("active");
        $(".nav-sub-item a[href='/FacebookPage/FacebookContacts']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/facebookpage/settings") != -1) {
        $(".nav-sub-social").css("display", "block");
        $(".nav-sub-social").prev().addClass("active");
        $(".nav-sub-item a[href='/FacebookPage/Settings']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/googleads/overview") != -1) {
        $(".nav-sub-ads,.nav-sub-adslist").css("display", "block");
        $(".nav-sub-ads").prev().addClass("active");
        $(".nav-sub-link").removeClass("active");
        $(".nav-sub-item a[href='/GoogleAds/OverView']").addClass("sub-men active");
    }
    else if (pageURL.indexOf("/googleads/settings") != -1) {
        $(".nav-sub-ads,.nav-sub-adslist").css("display", "block");
        $(".nav-sub-ads").prev().addClass("active");
        $(".nav-sub-link").removeClass("active");
        $(".nav-sub-item a[href='/GoogleAds/Settings']").addClass("sub-men active");
    }
    //Social End
});


// showing 2nd level sub menu while hiding others
$('.sidebar-nav-link').on('click', function (e) {
    var subMenu = $(this).next();

    $(this).parent().siblings().find('.sidebar-nav-sub').slideUp();
    $('.sub-with-sub ul').slideUp();

    if (subMenu.length) {
        e.preventDefault();
        subMenu.slideToggle();
    }
});

// showing 3rd level sub menu while hiding others
$('.sub-with-sub .nav-sub-link').on('click', function (e) {
    e.preventDefault();
    $(this).parent().siblings().find('ul').slideUp();
    $(this).next().slideToggle();
});