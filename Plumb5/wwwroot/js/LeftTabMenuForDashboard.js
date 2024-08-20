//Get value from query string..........

var MaintainKey = 0;

$.urlParam = function (name) {
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (!results) {
        return 0;
    }
    return results[1] || 0;
};
function TabClick(value) {
    $('#' + value + '').slideToggle(300).siblings("div.menu_body").slideUp("slow");
}
// Left Menu Tab...........................
$(document).ready(function () {

    //$("#firstpane p.menu_head").click(function () {
    //    $(this).css({ backgroundImage: "url(down.png)" }).next("div.menu_body").slideToggle(300).siblings("div.menu_body").slideUp("slow");
    //});

    //Start Mobile App 
    if (window.location.href.toLowerCase().indexOf("mobileapp/visits") > -1) {
        $('#dash').css('display', 'block');
        $('#tabVisits').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/timeonmobile") > -1) {
        $('#dash').css('display', 'block');
        $('#tabTimeonSite').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/cities") > -1 || window.location.href.toLowerCase().indexOf("mobileapp/allcities") > -1) {
        $('#MobileApp').css('display', 'block');
        $('#tabMobileCities').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/countries") > -1 || window.location.href.toLowerCase().indexOf("mobileapp/allcountries") > -1) {
        $('#dash').css('display', 'block');
        $('#tabCountries').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/carrier") > -1) {
        $('#MobileApp').css('display', 'block');
        $('#tabMobileNetwork').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/beacon") > -1) {
        $('#MobileApp').css('display', 'block');
        $('#tabMobileBeacon').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/visitors") > -1) {
        $('#MobileApp').css('display', 'block');
        $('#tabMobVisitors').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/frequency") > -1) {
        $('#MobileApp').css('display', 'block');
        $('#tabMobileFrequency').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/recency") > -1) {
        $('#MobileApp').css('display', 'block');
        $('#tabMobileRecency').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/timespend") > -1) {
        $('#MobileApp').css('display', 'block');
        $('#tabMobileTimeSpend').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/eventtracking") > -1 || window.location.href.toLowerCase().indexOf("mobileapp/alleventtrackingmobile") > -1) {
        $('#Cont').css('display', 'block');
        $('#tabEventTracking').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/device") > -1 || window.location.href.toLowerCase().indexOf("mobileapp/alldevicesmobile") > -1) {
        $('#MobileApp').css('display', 'block');
        $('#tabMobileDevice').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/operatingsystem") > -1 || window.location.href.toLowerCase().indexOf("mobileapp/alloperatingsystemmobile") > -1) {
        $('#MobileApp').css('display', 'block');
        $('#tabOperatingSys').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/citi") > -1 || (window.location.href.toLowerCase().indexOf("city=") > -1 && window.location.href.toLowerCase().indexOf("mobileapp/uniquevisits") > -1)) {
        $('#MobileApp').css('display', 'block');
        $('#tabMobileCities').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/countri") > -1 || (window.location.href.toLowerCase().indexOf("country=") > -1 && window.location.href.toLowerCase().indexOf("mobileapp/uniquevisits") > -1)) {
        $('#dash').css('display', 'block');
        $('#tabCountries').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/carrier") > -1 || (window.location.href.toLowerCase().indexOf("carrier=") > -1 && window.location.href.toLowerCase().indexOf("mobileapp/uniquevisits") > -1)) {
        $('#MobileApp').css('display', 'block');
        $('#tabMobileNetwork').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileApp/beacon") > -1 || (window.location.href.toLowerCase().indexOf("beacon=") > -1 && window.location.href.toLowerCase().indexOf("mobileapp/uniquevisits") > -1)) {
        $('#MobileApp').css('display', 'block');
        $('#tabMobileBeacon').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/screenresolution") > -1 || (window.location.href.toLowerCase().indexOf("resolution=") > -1 && window.location.href.toLowerCase().indexOf("mobileapp/uniquevisits") > -1)) {
        $('#MobileApp').css('display', 'block');
        $('#tabMobileResolution').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/geofence") > -1 || (window.location.href.toLowerCase().indexOf("geofence=") > -1 && window.location.href.toLowerCase().indexOf("mobileapp/uniquevisits") > -1) || window.location.href.toLowerCase().indexOf("mobileapp/allgeofence") > -1) {
        $('#MobileApp').css('display', 'block');
        $('#tabMobileGeofence').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/") > -1 && window.location.href.toLowerCase().indexOf("cat=visits") > -1) {
        $('#dash').css('display', 'block');
        $('#tabVisits').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/") > -1 && window.location.href.toLowerCase().indexOf("cat=timeonmobile") > -1) {
        $('#dash').css('display', 'block');
        $('#tabTimeonSite').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/") > -1 && window.location.href.toLowerCase().indexOf("frequency=") > -1) {
        $('#MobileApp').css('display', 'block');
        $('#tabMobileFrequency').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/") > -1 && window.location.href.toLowerCase().indexOf("recency=") > -1) {
        $('#MobileApp').css('display', 'block');
        $('#tabMobileRecency').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/") > -1 && window.location.href.toLowerCase().indexOf("time=") > -1) {
        $('#MobileApp').css('display', 'block');
        $('#tabMobileTimeSpend').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/") > -1 && window.location.href.toLowerCase().indexOf("events=") > -1) {
        $('#Cont').css('display', 'block');
        $('#tabEventTracking').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/") > -1 && window.location.href.toLowerCase().indexOf("device=") > -1) {
        $('#MobileApp').css('display', 'block');
        $('#tabMobileDevice').css('background-color', '#f1f9df');
    }
    else if (window.location.href.toLowerCase().indexOf("mobileapp/") > -1 && window.location.href.toLowerCase().indexOf("&os=") > -1) {
        $('#MobileApp').css('display', 'block');
        $('#tabOperatingSys').css('background-color', '#f1f9df');
    }
    //End Mobile App
    else {
        // 1st Menu Tab...........................
        if (window.location.href.toLowerCase().indexOf("home") > -1) {
            $('#dash').css('display', 'block');
            $('#tabOverview').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("online=") > -1 && window.location.href.toLowerCase().indexOf("refer") == -1) {
            $('#dash').css('display', 'block');
            $('#tabOverview').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("country") > -1) {
            $('#dash').css('display', 'block');
            $('#tabCountries').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("redirectedfrom=city") > -1) {
            $('#Audi').css('display', 'block');
            $('#tabCities').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("redirectedfrom=visits") > -1) {
            $('#dash').css('display', 'block');
            $('#tabVisits').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("redirectedfrom=timeonsite") > -1) {
            $('#dash').css('display', 'block');
            $('#tabTimeonSite').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("redirectedfrom=timetrends") > -1) {
            $('#dash').css('display', 'block');
            $('#tabTimeTrends').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("type=") > -1 && window.location.href.toLowerCase().indexOf("domain") == -1) {
            $('#dash').css('display', 'block');
            $('#tabNewvsRepeat').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("city") > -1 && window.location.href.toLowerCase().indexOf("url=") > -1) {
            $('#Cont').css('display', 'block');
            $('#tabPageAnalysis').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("frequency") > -1) {
            $('#Audi').css('display', 'block');
            $('#tabFrequency').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("recency") > -1) {
            $('#Audi').css('display', 'block');
            $('#tabRecency').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("time") > -1) {
            $('#Audi').css('display', 'block');
            $('#tabTimeSpend').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("depth") > -1) {
            $('#Audi').css('display', 'block');
            $('#tabPageDepth').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("network") > -1) {
            $('#Audi').css('display', 'block');
            $('#tabNetwork').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("device") > -1) {
            $('#Audi').css('display', 'block');
            $('#tabDevices').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("events") > -1) {
            $('#Cont').css('display', 'block');
            $('#tabEventTracking').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("pageanalysis") > -1) {
            $('#Cont').css('display', 'block');
            $('#tabPageAnalysis').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("pagename") > -1 && window.location.href.toLowerCase().indexOf("domain") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabSearch').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("pagename") > -1 && window.location.href.toLowerCase().indexOf("social=") == -1) {
            $('#Cont').css('display', 'block');
            $('#tabPopularPages').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("entry") > -1) {
            $('#Cont').css('display', 'block');
            $('#tabTopEntryPages').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("exit") > -1) {
            $('#Cont').css('display', 'block');
            $('#tabTopExitPages').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("goalid") > -1) {
            $('#Conv').css('display', 'block');
            $('#tabGoals').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("productdetails=") > -1) {
            $('#Conv').css('display', 'block');
            $('#tabProductDetails').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("sales") > -1) {
            $('#Conv').css('display', 'block');
            $('#tabSalePerformance').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("form/product") > -1 || window.location.href.toLowerCase().indexOf("productgroup") > -1 || window.location.href.toLowerCase().indexOf("transactiongroups") > -1 || window.location.href.toLowerCase().indexOf("productwishlistgroups") > -1) {
            $('#Conv').css('display', 'block');
            $('#tabproduct').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("product") > -1) {
            $('#Conv').css('display', 'block');
            $('#tabProductPerformance').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("allsource") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabAllSources').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("refer") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabReferral').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("search") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabSearch').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("social") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabSocialSources').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("=email") > -1 && window.location.href.toLowerCase().indexOf("&utm=") == -1) {
            $('#Traff').css('display', 'block');
            $('#tabEmailSources').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("=sms") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabSmsSources').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("month") > -1) {
            $('#Conv').css('display', 'block');
            $('#tabCohortAnalysis').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("domain") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabSearch').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && (window.location.href.toLowerCase().indexOf("adwords") > -1 || window.location.href.toLowerCase().indexOf("adsense") > -1 || window.location.href.toLowerCase().indexOf("&utm=") > -1 || window.location.href.toLowerCase().indexOf("&yahoo=") > -1)) {
            $('#Traff').css('display', 'block');
            $('#tabPaidCampaigns').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("visits") > -1) {
            $('#dash').css('display', 'block');
            $('#tabVisits').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("newreturn") > -1) {
            $('#dash').css('display', 'block');
            $('#tabNewvsRepeat').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("timeonsite") > -1) {
            $('#dash').css('display', 'block');
            $('#tabTimeonSite').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("timetrends") > -1) {
            $('#dash').css('display', 'block');
            $('#tabTimeTrends').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("createdashboard") > -1 || window.location.href.toLowerCase().indexOf("customdashboard") > -1) {
            $('#dash').css('display', 'block');
            $('#tabCustomDashboard').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("countries") > -1) {
            $('#dash').css('display', 'block');
            $('#tabCountries').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("uniquevisits") > -1 && window.location.href.toLowerCase().indexOf("city") > -1) {
            $('#Audi').css('display', 'block');
            $('#tabCities').css('background-color', '#f1f9df');
        }
        // 2st Menu Tab...........................
        if (window.location.href.toLowerCase().indexOf("visitors") > -1 && window.location.href.toLowerCase().indexOf("allvisitors") == -1 && window.location.href.toLowerCase().indexOf("visitorstages") == -1) {
            $('#Audi').css('display', 'block');
            $('#tabVisitors').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("browser") > -1 && window.location.href.toLowerCase().indexOf("device") == -1) {
            $('#Audi').css('display', 'block');
            $('#tabBrowser').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("frequency") > -1) {
            $('#Audi').css('display', 'block');
            $('#tabFrequency').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("recencyreturning") > -1) {
            $('#Audi').css('display', 'block');
            $('#tabRecencyReturning').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("recency") > -1) {
            $('#Audi').css('display', 'block');
            $('#tabRecency').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("cities") > -1) {
            $('#Audi').css('display', 'block');
            $('#tabCities').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("network") > -1) {
            $('#Audi').css('display', 'block');
            $('#tabNetwork').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("devices") > -1) {
            $('#Audi').css('display', 'block');
            $('#tabDevices').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("timespend") > -1) {
            $('#Audi').css('display', 'block');
            $('#tabTimeSpend').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("pagedepth") > -1) {
            pagetitle.innerHTML = "Page Depth";
            $('#Audi').css('display', 'block');
            $('#tabPageDepth').css('background-color', '#f1f9df');
        }
        // 3rd Menu Tab...........................
        if (window.location.href.toLowerCase().indexOf("allsources") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabAllSources').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("referral") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabReferral').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("sourcepages") > -1 && window.location.href.toLowerCase().indexOf("type=refer") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabReferral').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("sourcepages") > -1 && window.location.href.toLowerCase().indexOf("type=social") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabSocialSources').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("organicsearch") > -1 || window.location.href.toLowerCase().indexOf("sourcepages") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabSearch').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("type=search") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabSearch').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("type=social") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabSocialSources').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("type=refer") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabReferral').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("searchkeysforpage") > -1) {
            $('#Cont').css('display', 'block');
            $('#tabPageAnalysis').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("searchkeys") > -1 && window.location.href.toLowerCase().indexOf("&key=") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabReferral').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("searchkeys") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabSearch').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("paidcampaign") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabPaidCampaigns').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("socialsources") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabSocialSources').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("emailsources") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabEmailSources').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("smssources") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabSmsSources').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("visitorsflow") > -1) {
            $('#Audi').css('display', 'none');
            $('#Traff').css('display', 'block');
            $('#tabVisitorFlows').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("attributionmodel") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabAttributionModel').css('background-color', '#f1f9df');
        }
        // 4th Menu Tab...........................
        if (window.location.href.toLowerCase().indexOf("popularpages") > -1) {
            $('#Cont').css('display', 'block');
            $('#tabPopularPages').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("pageanalysis") > -1) {
            $('#Cont').css('display', 'block');
            $('#tabPageAnalysis').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("topentrypages") > -1) {
            $('#Cont').css('display', 'block');
            $('#tabTopEntryPages').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("topexitpages") > -1) {
            $('#Cont').css('display', 'block');
            $('#tabTopExitPages').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("eventtracking") > -1 || window.location.href.toLowerCase().indexOf("eventtrackinginput.aspx") > -1 || window.location.href.toLowerCase().indexOf("anchorclicktrack.aspx") > -1 || window.location.href.toLowerCase().indexOf("anchorclickuniqueip") > -1 || window.location.href.toLowerCase().indexOf("wheniflytrack.aspx") > -1 || window.location.href.toLowerCase().indexOf("wheniflyuniques.aspx") > -1) {
            $('#Cont').css('display', 'block');
            $('#tabEventTracking').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("heatmap") > -1) {
            $('#Cont').css('display', 'block');
            $('#tabHeatMaps').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("recommendation") > -1) {
            $('#Cont').css('display', 'block');
            $('#tabRecommendation').css('background-color', '#f1f9df');
        }
        // 5th Menu Tab...........................
        else if (window.location.href.toLowerCase().indexOf("transactions") > -1) {
            $('#Conv').css('display', 'block');
            $('#tabTransactions').css('background-color', '#f1f9df');
        } else if (window.location.href.toLowerCase().indexOf("goal") > -1) {
            $('#Conv').css('display', 'block');
            $('#tabGoals').css('background-color', '#f1f9df');
        } else if (window.location.href.toLowerCase().indexOf("productperformance") > -1) {
            $('#Conv').css('display', 'block');
            $('#tabProductPerformance').css('background-color', '#f1f9df');
        } else if (window.location.href.toLowerCase().indexOf("salesperformance") > -1) {
            $('#Conv').css('display', 'block');
            $('#tabSalePerformance').css('background-color', '#f1f9df');
        } else if (window.location.href.toLowerCase().indexOf("productdetails") > -1) {
            $('#Conv').css('display', 'block');
            $('#tabProductDetails').css('background-color', '#f1f9df');
        } else if (window.location.href.toLowerCase().indexOf("cohortanalysis") > -1) {
            $('#Conv').css('display', 'block');
            $('#tabCohortAnalysis').css('background-color', '#f1f9df');
        } else if (window.location.href.toLowerCase().indexOf("visitorstages") > -1 && window.location.href.toLowerCase().indexOf("p5stage=") > -1) {
            $('#Conv').css('display', 'block');
            $('#tabSegmentation').css('background-color', '#f1f9df');
        } else if (window.location.href.toLowerCase().indexOf("visitorstages") > -1) {
            $('#Conv').css('display', 'block');
            $('#tabVisitorStages').css('background-color', '#f1f9df');
        } else if (window.location.href.toLowerCase().indexOf("segmentation") > -1) {
            $('#Conv').css('display', 'block');
            $('#tabSegmentation').css('background-color', '#f1f9df');
        }
        // 6th Menu Tab...........................
        if (window.location.href.toLowerCase().indexOf("allvisitors") > -1) {
            $('#Cust').css('display', 'block');
            $('#tabAllVisitors').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("advanced/groups") > -1 || window.location.href.toLowerCase().indexOf("advanced/contacts") > -1) {
            $('#Cust').css('display', 'block');
            $('#tabGroups').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("managescores") > -1) {
            $('#Cust').css('display', 'block');
            $('#tabManageScores').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("customreporting") > -1) {
            $('#Cust').css('display', 'block');
            $('#tabCustomReporting').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("myreports") > -1) {
            $('#Cust').css('display', 'block');
            $('#tabMyReports').css('background-color', '#f1f9df');
        }
        else if (window.location.href.toLowerCase().indexOf("custom/responsiblemachineschat") > -1 || window.location.href.toLowerCase().indexOf("custom/aggregateunified") > -1 ||
            window.location.href.toLowerCase().indexOf("custom/recentunified") > -1) {
            $('#Cust').css('display', 'block');
            $('#tabMyReports').css('background-color', '#f1f9df');
        }
    }

});
//get Local Time from GMT..........
function GetLocalTimeFromGMT(sTime) {
    sTime = GetJavaScriptDateObj(sTime);
    sTime.setTime(sTime.getTime() - sTime.getTimezoneOffset() * 60 * 1000);
    return sTime.toGMTString().substring(4, 17) + (sTime.getHours() < 10 ? '0' : '') + sTime.getHours() + ":" + (sTime.getMinutes() < 10 ? '0' : '') + sTime.getMinutes() + ":" + (sTime.getSeconds() < 10 ? '0' : '') + sTime.getSeconds();
}
function GetJavaScriptDateObj(dateString) {
    if (dateString.length > 0) {
        if (dateString.indexOf('.') == -1)
            dateString = dateString + ".000";
        var dbDate = dateString.split(' ');
        var year = dbDate[0].split('-');
        var time = dbDate[1].split(':');
        var milSec = 0;
        if (time[2].toString().indexOf(".") > 0) {
            milSec = time[2].split('.');
        } else {
            milSec = time[2].split('+');
        }
        return createDate = new Date(year[0], year[1] - 1, year[2], time[0], time[1], milSec[0]);
    }
}
//show lead count on lead Tab..........
GetNewLeadCount();
function GetNewLeadCount() {
    var LeadUnSeen;
    $.ajax({
        url: "/Form/CommonDetailsForForms/LeadUnSeenMaxCount",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            $("#spLeadNotification").html(result);
        }

    });
}
//show and hide left menu..........
$(document).ready(function () {
    $("#dvExpend").click(function (event) {
        if ($('#dvMainMenu').css('display') == 'block') {
            $("#dvExpend").css('left', '0px');
            $('#dvMainMenu').hide('slow');
        }
        else {
            $('#dvMainMenu').show('slow');
            $('#dvContact').hide('slow');
            $('.itemStyle div a').css('color', '')
            $('.iptxt a').css('color', '');
            $('#dvExpend').animate({ left: '190px' }, { duration: 600 });
        }
    });
});
var moveMenu = function () {
    var windowPosition = $(window).scrollTop();
    var dvExpend = $("#dvExpend");
    if (windowPosition > 128) {
        dvExpend.css({ marginTop: "0px" });
    }
};
document.onscroll = function () {
    onAction();
};
function onAction() {
    $("#dvExpend").css({ 'height': $("#dvControlPanel").height() + 0 + 'px' });
    //error message
    if ($(window).scrollTop() == 0) {
        $(".MsgStyle").css({ 'position': '' });
        $(".MsgStyle").css({ 'top': '57px' });

        $(".dvContactInfo").css({ 'position': '' });
        $(".dvContactInfo").css({ 'top': '57px' });
    }
    else {
        $(".MsgStyle").css({ 'position': 'fixed' });
        $(".MsgStyle").css({ 'top': '0px' });

        $(".dvContactInfo").css({ 'position': 'fixed' });
        $(".dvContactInfo").css({ 'top': '0px' });
    }
    //In Progress
    if ($("#divcontent").height() > screen.height && $(window).scrollTop() > 220 && typeof (imgTop) === "undefined") {
        $("body").append('<img id="imgTop" src="' + cdnpath + 'GoUpGreen.png" title="Go to top" onclick="GoTotop()" style="position: fixed;right: 0.5%;bottom: 35px;width: 50px;cursor:pointer" />');
        p5resetTimer();
    }
    else if ($("#divcontent").height() > screen.height && $(window).scrollTop() > 220 && typeof (imgTop) === "object") {
        $("#imgTop").show();
        p5resetTimer();
    } else if (typeof (imgTop) === "object" && $(window).scrollTop() < 220)
        $("#imgTop").hide();
}
//Go to Top
function GoTotop() {
    $('html, body').animate({ scrollTop: 0 }, 1000);
}
//Idle Time Calculator
var p5timeout, p5Status = 0;
function p5resetTimer() {
    clearTimeout(p5timeout);
    p5timeout = setTimeout(function () {
        $("#imgTop").hide();
        p5Status++;
        if (p5Status === 1) {
            document.onmousemove = function () { onAction(); };
        }
    }, 3000);//3 seconds
}
//...................
function OpenNewWindow(getvalue) {
    window.open(getvalue, 'newwindow');
    return false;
}
function messege(strname) {
    document.getElementById("panel" + strname).style.display = "block";
    document.getElementById("Openpanel" + strname).style.display = "none";
}
function Colapse(strname) {
    document.getElementById("Openpanel" + strname).style.display = "block";
    document.getElementById("panel" + strname).style.display = "none";
}
//sorting report..................................................
CallSort = function (divid) {
    if (divid == null || divid == '')
        divid = "dvReport";
    $('.headerSort').toggle(
        function () {
            $(".headerSort headerSortDown").attr("class", "headerSort");
            var sorttag = $(this).attr("id");
            $(".headerSort").removeClass("headerSortDown").removeClass("headerSortUp");
            $("#" + sorttag).attr("class", "headerSort headerSortDown");
            $('#' + divid + ' div.' + sorttag + '').map(function () {
                return { val: parseFloat($(this).text(), 10), el: this.parentNode };
            }).sort(function (a, b) {
                return a.val - b.val;
            }
                ).map(function () {
                    return this.el;
                }).appendTo('#' + divid + '');
        },
        function () {
            var sorttag = $(this).attr("id");
            $(".headerSort").removeClass("headerSortDown").removeClass("headerSortUp");

            $("#" + sorttag).attr("class", "headerSort headerSortUp");
            $('#' + divid + ' div.' + sorttag + '').map(function () {
                return { val: parseFloat($(this).text(), 10), el: this.parentNode };
            }).sort(function (a, b) {
                return b.val - a.val;
            }
                ).map(function () {
                    return this.el;
                }).appendTo('#' + divid);
        }
    );
};
//custom filter for each page ......
getCustomFilter = function () {
    var compare = "";
    $("#dvCustomFilter").css("z-index", "99999").css("width", "400px");
    setTimeout(function () { $("#CalendarControl").css("z-index", "999999"); }, 1500);

    var filter = "<div id='frmwrp'><input type='text' onfocus='showCalendarControl(this);' placeholder='From Date' readonly='readonly' class='inputees' id='txtDateFrom' style='float: left' /><div style='float: left; padding: 2px;'></div>" +
        "<input onfocus='showCalendarControl(this);' placeholder='To Date' readonly='readonly' style='float: left' type='text' class='inputees' id='txtDateTo' /><img id='btnGo' src='../../images/arrw_btn.jpg' style=' height: 34px;padding: 0 3px;position: relative;top: 0;width: 28px; cursor:pointer;' value='Go' onclick='CheckdateExistance()' disabled='disabled'/></div>" +
        "<div style='font-size: 12px;' class='chk'>" + compare + "" +
        "<div id='chck'>" +
        "<input type='checkbox' id='chk_Maintain' style='position: relative; top: -2px; left: -4px;float:left' disabled='disabled' /><span style='float:left'>Maintain</span></div>" +
        "<div style='float: left; margin-left: 17px;'>" +
        "" +
        "</div>";
    return filter;
};
function CheckdateExistance() {
    if ($('#txtDateFrom').val() == '')
        ShowErrorMessage('Please select From date!');
    else if ($('#txtDateTo').val() == '')
        ShowErrorMessage('Please select To date!');
    else
        Report(5);
}
//close custome filter out side the
$(document).click(function (e) {
    if (window.location.href.toLowerCase().indexOf("home.aspx") < 0 && window.location.href.toLowerCase().indexOf("visitorsloyalty.aspx") < 0
        && window.location.href.toLowerCase().indexOf("/referringtraffic.aspx") < 0 && window.location.href.toLowerCase().indexOf("usertrackingdetails.aspx") < 0
        && window.location.href.toLowerCase().indexOf("eventtrackinginput.aspx") < 0 && window.location.href.toLowerCase().indexOf("createcustom.aspx") < 0) {
        var container = $("#dvCustomFilter");
        var dateObject = $("#CalendarControl");
        if (!container.is(e.target) && container.has(e.target).length === 0 && !dateObject.is(e.target) && dateObject.has(e.target).length === 0) {
            container.hide();
            if (document.getElementById('dvCustomDate') != null && document.getElementById('dvCustomDate').style.display != "none") {
                if (document.getElementById('dvCustomFilter') != null) {
                    if (document.getElementById('dvCustomFilter').style.display == "none") {
                        if (typeof hideCalendarControl === "function")
                            hideCalendarControl();
                    }
                }
            }
        }
    }
});
$(document).ready(function () {
    $("#lnkFilter").click(function (event) {
        event.stopPropagation();
    });
});
//function lnkFilterClick() {
//    event.stopPropagation();
//    lnkFilterClick1();
//}
//Bind Time Duration..................
getDefaultDuration = function () {
    var Duration = "<div style='float: left; '>" +//margin-left: -2px;
        "<input id='btn1' type='button' class='button1' value='Day' onclick='Report(1);' />" +
        "</div>" +
        "<div style='float: left; margin-left: 3px;'>" +
        "<input id='btn2' type='button' class='button1' value='Week' onclick='Report(2);' />" +
        "</div>" +
        "<div style='float: left; margin-left: 3px;'>" +
        "<input id='btn3' type='button' class='button1' value='Month' onclick='Report(3);' />" +
        "</div>" +
        "<div style='float: left; margin-left: 3px;'>" +
        "<input id='btn4' type='button' class='button1' value='Year' onclick='Report(4);' />" +
        "</div>";
    return Duration;
};
//Print and export..................
var relPageName = "";
getPrintExport = function (getPageName, print, viewall, recordsperPage) {
    relPageName = getPageName;
    var getViewAll = "", record = "", AddGroup = "", getShareOptions = "";
    if (viewall == 1) {
        getViewAll = "</div><div style='float: left; margin-left: 5px;'>" +
            "<a href='#' class='info' id='lnkViewall' style='position:relative; top:5px; background-color: transparent;'>" +
            "<img src='" + cdnpath + "viewall.png' border='0' /><span style='width: 60px; right: -0px;top: 19px;'>View All</span></a></div>";
    }
    var getPrint = "";
    if (print == 1) {
        getPrint = "<div style='float: left; margin-left: 5px;'>" +
            "<a  href='javascript:void(0)' class='info' style='background-color: Transparent; float: left;position:relative;top:5px' rel='" + getPageName + "' id='btnPrint' onclick='PrintDiv();'>" +
            "<img src='" + cdnpath + "Print.png' border='0' /><span style='width: 40px; left: -10px; top: 30px;'>Print</span></a>" +
            "</div>";
    }
    if (recordsperPage != null && recordsperPage == 1) {///Records per page
        record = "<div class='chk' style='float: left; margin-left: 0px;margin-top: 2px;width:71%'><span>Records per page&nbsp;&nbsp;</span><select style='position:relative; top:1px; width:70px;' class='drpdwn' id='drp_RecordsPerPage' onchange='fn_ChangeRecordsPerPage()'>" +
            "<option value='20' selected='selected'>20</option>" +
            "<option value='50'>50</option>" +
            "<option value='100'>100</option>" +
            "<option value='500'>500</option>" +
            "<option value='1000'>1000</option>" +
            "<option value='5000'>5000</option>" +
            "<option value='10000'>10000</option>" +
            //"<option value='All'>All</option>" +
            "</select></div>";
    }
    getShareOptions =
        "<div id='dvShare_option' class='ExportOptions' style='display: none; height: 40px; padding-left: 8px; width: 138px;'>" +
        "<span style= 'cursor: pointer'><img id='shareAsImg' src='../../images/imgicon.jpg' style='float: left' alt='Image' onclick='fn_toggleShareOption(2);'/></span>" +
        "<span style='cursor: pointer'><img id='shareAsLnk' src='../../images/linkicon.jpg' style='float: left' alt='Link' onclick='fn_toggleShareOption(1);'/></span>" +
        "</div>";
    var printExport = "" + record + AddGroup +
        ///share Start
        "<div id='dv_shareContent' class='CustomPopUp' style='position: fixed; left: 30%; top:27%;'></div> <div id='dv_Share' style='float: left; margin-left: 5px;'>" +
        "<a href='javascript:void(0)' class='info' style='background-color: Transparent; float: left;position:relative;top: 6px;' rel='" + getPageName + "' id='btnShare' onclick='javascript: fn_toggleControl(1);'>" +
        "<img src='" + cdnpath + "P5_share.png' border='0' /><span style='width: 40px; left: -10px;top: 29px;'>Share</span></a>" +
        "</div>" +
        ///share End
        getPrint + "<div id='dv_PntExp' style='float: left; margin-left: 5px;'>" +
        "<a href='javascript:void(0)' class='info' style='background-color: Transparent; float: left;position:relative;top:5px;' rel='" + getPageName + "' id='btnExport' onclick='P5ExportData(\"#btnExport\");'>" +
        "<img src='" + cdnpath + "export_icon.jpg' border='0' /><span style='width: 50px; left: -28px; top: 30px;'>Export</span></a>" +
        "</div></div>";//+ getViewAll;

    return printExport + getShareOptions + getViewAll;
};
//report a problem.............................
$(function () {
    $("#btnReportProb").click(function () {
        // Print the DIV.
        $("#dvReportList").css("display", "block");
    });
});

//print.............................
function PrintDiv() {
    //if (window.location.href.toLowerCase().indexOf("/countries") > -1 || window.location.href.toLowerCase().indexOf("/cities") > -1) {
    $('#dvContentHeader').hide();
    $('.plumb-main').hide();
    $('#dvPagerHeader').hide();
    $('#dvMainMenu').hide();
    $('#dvDurationPrint').hide();
    $('#divcontent').siblings().hide();
    $('.btnReport').hide();
    $('#dvExpend').hide();
    if (window.location.href.toLowerCase().indexOf("/countries") > -1 || window.location.href.toLowerCase().indexOf("/cities") > -1) {
        var css = '@page { size: landscape; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');
        style.type = 'text/css';
        style.media = 'print';

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
    }
    window.print();
    $('#dvContentHeader').show();
    $('.plumb-main').show();
    $('#dvPagerHeader').show();
    $('#dvMainMenu').show();
    $('#dvDurationPrint').show();
    $('.btnReport').show();
    $('#dvExpend').show();
    //}
    //else {
    //    var divElements = document.getElementById('divcontent').innerHTML;
    //    var oldPage = document.body.innerHTML;
    //    document.body.innerHTML = divElements;
    //    window.print();
    //    document.body.innerHTML = oldPage;
    //}
}

jQuery.fn.print = function () {
    if (this.size() > 1) {
        this.eq(0).print();
        return;
    } else if (!this.size()) {
        return;
    }
    var strFrameName = ("printer-" + (new Date()).getTime());
    var jFrame = $("<iframe target='_blank' name='" + strFrameName + "'>");
    jFrame
        .css("width", "1px")
        .css("height", "1px")
        .css("position", "absolute")
        .css("left", "-9999px")
        .appendTo($("body:first"));
    var objFrame = window.frames[strFrameName];
    var objDoc = objFrame.document;
    var jStyleDiv = $("<div>").append(
        $("style").clone()
    );
    var ReportTitle = $('#btnPrint').attr('rel');
    objDoc.open();
    objDoc.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">");
    objDoc.write("<html><body><center><span style='font-weight:bold; text-align:center;'>" + ReportTitle + "</span></center><head><title>");
    objDoc.write(document.title);
    objDoc.write("</title><link href='//new.plumb5.com/Content/MainStyle.css' rel='stylesheet' type='text/css'>");
    objDoc.write(jStyleDiv.html() + "</head>" + this.html() + "</body></html>");
    objDoc.close();
    objFrame.focus();
    objFrame.print();
    setTimeout(function () { jFrame.remove(); }, (60 * 1000));
};
//export to xls.............................
$(document).ready(function () {
    $("#btnExportNew").click(function () {
        $("#exportAsXls").attr("id", "exportAsXlsNew");
        $("#exportAsTxt").attr("id", "exportAsTxtNew");
    });
});
//Export as Excel file
function P5ExportData(value) {//value
    if (typeof window.dvexport_txtorxlx === "undefined") {
        var txt =
            "<div id='dvexport_txtorxlx' class='ExportOptions' style='display: none; height: 40px; padding-left: 8px; width: 122px;'>" +
            "<span style= 'cursor: pointer'><img id='exportAsXls' src='../../images/xlsicon.jpg' rel='" + relPageName + "' style='float: left' alt='XLS' onclick='ExportXls(this);'/></span>" +
            "<span style='cursor: pointer'><img id='exportAsTxt' src='../../images/txticon.jpg' rel=" + relPageName + " style='float: left' alt='TXT' onclick='ExportTxt(this);'/></span>" +
            "</div>";
        var divExportOption = document.createElement("div");
        divExportOption.id = "dvExportOption";
        divExportOption.innerHTML = txt;
        document.body.appendChild(divExportOption);
        $("#dvexport_txtorxlx").toggle("slow");
        $("#dvexport_option").fadeOut("slow");
        $("#dvShare_option").fadeOut('slow');
        $("#dv_shareContent").fadeOut('slow');
    } else {
        $("#dvexport_txtorxlx").toggle("slow");
        $("#dvexport_option").fadeOut("slow");
        $("#dvShare_option").fadeOut('slow');
        $("#dv_shareContent").fadeOut('slow');
    }
}
var ExpType = "", ExpVal = "";
function ExportXls(value) {
    if (value.id != "exportAsXlsNew")
        P5ExportCall("xls", value);
    else {
        ExpType = "xls";
        ExpVal = value;
        $("#img_move").css("right", "88px");
        $("#dvexport_option").fadeIn("slow");
        $("#dvShare_option").fadeOut('slow');
    }
}
function ExportTxt(value) {
    if (value.id != "exportAsTxtNew")
        P5ExportCall("txt", value);
    else {
        ExpType = "txt";
        ExpVal = value;
        $("#img_move").css("right", "25px");
        $("#dvexport_option").fadeIn("slow");
        $("#dvShare_option").fadeOut('slow');
    }
}
//Main Export Call
function P5ExportCall(type, value) {
    if (type == null || type == undefined && ExpType != "") {
        type = ExpType; value = ExpVal;
    }
    var fileName = $(value).attr("rel").replace(/ /g, "");
    var data = $("#dvExport").html();
    data = escape(data);
    switch (type) {
        case "xls":
            $("body").prepend("<form method='post' action='/ExportToXls/Export?File=" + fileName + "' style='top:-3333333333px;' id='tempForm'><input type='hidden' name='data' value='" + data + "' ></form>");
            break;
        case "txt":
            $("body").prepend("<form method='post' action='/ExportToXls/ExportToTxt?File=" + fileName + "' style='top:-3333333333px;' id='tempForm'><input type='hidden' name='data' value='" + data + "' ></form>");
            break;
    }
    $("#tempForm").submit();
    $("#tempForm").remove();
    return false;
}
$(document).ready(function () {
    $('#btnExport').click(function (event) {
        event.stopPropagation();
    });
});
$(document).click(function (e) {
    var targetbox = $('#dvexport_txtorxlx');
    if (window.location.href.toLowerCase().indexOf("audience/visitors") == -1 && window.location.href.toLowerCase().indexOf("audience/recencyreturning") == -1 &&
        window.location.href.toLowerCase().indexOf("uniques/uniquevisits") == -1 && window.location.href.toLowerCase().indexOf("advanced/allvisitors") == -1
        && window.location.href.toLowerCase().indexOf("advanced/contacts") == -1) {
        if (!targetbox.is(e.target) && targetbox.has(e.target).length === 0) {
            $('#dvexport_txtorxlx').hide('slow');
        }
    }
});
//Check filter settings....................
var breakMaintain = 0;
///Sharing report all variables
var P5ShareFrm = '', P5ShareTo = '', m = 0, Comp = 0, endNo = 0, SFrom = 0, STo = 0, SCom = 0, Sdur = 0, QryId = 0, AdwordOrSense = 0, type = 0, domain = 0, page = 0, key = 0,
    url = 0, country = 0, city = 0, frequency = 0, recency = 0, time = 0, depth = 0, device = 0, network = 0, allsources = 0, refer = 0, adwords = 0, social = 0,
    source = 0, entry = 0, exit = 0, events = 0, product = 0, productid = 0, adsense = 0, yahoo = 0, utm = 0, search = 0, cohortsMonth = 0, cohortsYear = 0, fgoal = 0,
    goalId = 0, pagename = 0, QryModelId = 0, visitorflowKey = 0, qryDashId = 0, drpSearch = 0, txtSearch = 0, deviceName = 0, deviceId = 0, os = 0, online = 0, channel = 0, stage = 0,
    scores = 0, StartScore = 0, EndScore = 0, carrier = 0, resolution = 0, beacon = 0, geofence = 0, Offline = 0, FilterEmail = 0, FilterCity = 0, FilterSessions = 0,
    UTMSource = 0, UTMMedium = 0, UTMCampaign = 0,TimeTrends=0;
///Sharing report all variables ends
var chkMain = 0, Rpr = 0, ChngRpp = 0, Rpr2 = 0, ChngRpp2 = 0;
function CheckFilter(duration) {
    var fromdate = '', todate = '', compare = 0, compareOption = '';
    ///for share
    ///Records per Page
    if (endNo != 0 || endNo != "0") {

        if (endNo != "20" && endNo != "30" && endNo != "40" && endNo != "50" && endNo != "100" && endNo != "All") {
            if ($("#drp_RecordsPerPage").val() != '' && $("#drp_RecordsPerPage").val() != undefined) {
                if ($("#drp_RecordsPerPage").val().indexOf(endNo) == -1)
                    $("#drp_RecordsPerPage").append("<option val='" + endNo + "'>" + endNo + "</option>").val(endNo);
                else
                    $("#drp_RecordsPerPage").val(endNo);
            }
        } else
            $("#drp_RecordsPerPage").val(endNo);
    }
    ///// Calendar Hide
    if (duration == 5) {
        if (document.getElementById('dvCustomDate').style.display != "none") {
            if (document.getElementById('dvCustomFilter').style.display == "none") {
                if (typeof hideCalendarControl === "function")
                    hideCalendarControl();
            }
        }
    }
    ///Records per Page
    if (duration == 5 && $.urlParam("P5Duration") != 0 && $('#txtDateFrom').val() == "" && $.urlParam("FromDate") != 0) {
        fromdate = $.urlParam("FromDate").replace("%20", " ").replace("00:00:00.000", "");
        todate = $.urlParam("ToDate").replace("%20", " ").replace("23:59:59.000", "");
        $('#txtDateFrom').val(fromdate.split(" ")[0]);
        $('#txtDateTo').val(todate.split(" ")[0]);
    }
    else if ((duration == 5 && online != "true") || (online != "true" && duration == 0 && duration != 5 && cohortsMonth == 0 && cohortsYear == 0)) {
        if (p5keyValue != 0 && m == 0) {
            $('#txtDateFrom').val(P5ShareFrm);
            $('#txtDateTo').val(P5ShareTo);
            if (Comp != 0) {
                $("#chk_Compare").prop("checked", true);
                $("#drp_Compare").val(Comp);
            }
        }
        ///for share
        if ($('#txtDateFrom').val() != "") {
            fromdate = $('#txtDateFrom').val();
            todate = $('#txtDateTo').val();
        }
        else {
            fromdate = $.urlParam("Frm") != 0 ? $.urlParam("Frm").replace("%20", " ") : 0;
            todate = $.urlParam("To") != 0 ? $.urlParam("To").replace("%20", " ") : 0;
        }
        ////
        if (Rpr != $("#drp_RecordsPerPage").val())
            ChngRpp2 = 1;

        if ($('#chk_Maintain').attr('checked') == "checked" && MaintainKey == 0) {
            chkMain = 1;
        }
        else if (($('#chk_Maintain').prop('checked') == false && ($('#chk_Maintain').attr('checked') != undefined || ChngRpp2 == 0)) && MaintainKey == 1 && duration != 0 /*&& duration != 5*/) {
            chkMain = 2;
        }
        if (chkMain == 1 || chkMain == 2) {
            $.ajax({
                url: '../../Areas/Analytics/Handlers/SessionSetting.ashx?AccountId=' + parseInt($("#hdn_AccountId").val()) + '&Maintain=' + MaintainKey + '',
                type: 'Post',
                data: '',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                }
            });
        }
        if (fromdate == '' || fromdate == null || fromdate == 'From Date' || todate == '' || todate == null || todate == 'To Date') {
            $("#dvLoading").hide();
            return;
        }
        if ($('#chk_Compare').attr('checked')) {
            compare = 1;
            compareOption = $('#drp_Compare').val();
        }
        //// For Unique visits binding date in custom date box "roja"
        //if (MaintainKey == 1 && window.location.href.toLowerCase().indexOf("/uniques/uniquevisits?") > -1) {
        //    if (fromdate != '' && todate != '') {
        //        if (fromdate.indexOf('/') > -1) {
        //            var f = fromdate.substring(0, fromdate.indexOf(' ')).split("/");
        //            var t = todate.substring(0, todate.indexOf(' ')).split("/");
        //            $('#txtDateFrom').val(f[2] + "-" + (f[0].length == 1 ? "0" + f[0] : f[0]) + "-" + (f[1].length == 1 ? "0" + f[1] : f[1]));
        //            $('#txtDateTo').val(t[2] + "-" + (t[0].length == 1 ? "0" + t[0] : t[0]) + "-" + (t[1].length == 1 ? "0" + t[1] : t[1]));
        //        } else {
        //            $('#txtDateFrom').val(fromdate.split(" ")[0]);
        //            $('#txtDateTo').val(todate.split(" ")[0]);
        //        }
        //        if (chkMain != 2) {
        //            $('#chk_Maintain').attr('checked', true);
        //            $("#chk_Maintain").removeAttr("disabled");
        //        }
        //    }
        //}
    }
    if (window.location.href.toLowerCase().indexOf("/dashboard/visits") > -1 || window.location.href.toLowerCase().indexOf("/dashboard/newreturn") > -1 ||
        window.location.href.toLowerCase().indexOf("/traffic/allsources") > -1) {
        if (MaintainKey == 1) {
            $("#chk_Compare").removeAttr("disabled");
            $("#drp_Compare").removeAttr("disabled");
        }
    }
    if (Rpr == 0)
        Rpr = $("#drp_RecordsPerPage").val();
    if (Rpr != $("#drp_RecordsPerPage").val())
        ChngRpp = 1;
    Rpr = $("#drp_RecordsPerPage").val();
    var startEndDates;
    ////Maintain Setting Up If Maintained
    if (typeof Storage !== "undefined" && localStorage.getItem("P5From") != null && localStorage.getItem("P5To") != null && duration == 2 && breakMaintain == 0 && MaintainKey == 1
        && window.location.href.toLowerCase().indexOf("allcountries") == -1 && window.location.href.toLowerCase().indexOf("allcities") == -1 && window.location.href.toLowerCase().indexOf("alldevices") == -1
        && window.location.href.toLowerCase().indexOf("alleventtracking") == -1 && window.location.href.toLowerCase().indexOf("allpageanalysis") == -1 && window.location.href.toLowerCase().indexOf("allpopularpages") == -1
        && window.location.href.toLowerCase().indexOf("alltopentrypages") == -1 && window.location.href.toLowerCase().indexOf("alltopexitpages") == -1 && window.location.href.toLowerCase().indexOf("allorganicsearch") == -1
        && window.location.href.toLowerCase().indexOf("allreferral") == -1 && window.location.href.toLowerCase().indexOf("allsocialsources") == -1 && window.location.href.toLowerCase().indexOf("alldevicesmobile") == -1
        && window.location.href.toLowerCase().indexOf("alleventtrackingmobile") == -1 && window.location.href.toLowerCase().indexOf("alloperatingsystemmobile") == -1
        && window.location.href.toLowerCase().indexOf("sourcepages") == -1 && window.location.href.toLowerCase().indexOf("searchkeys") == -1
    ) {
        $("#chk_Maintain").removeAttr("disabled");
        $("#btnGo").removeAttr("disabled");
        breakMaintain++;
        startEndDates = BindDate(10, fromdate, todate);
    }
    else if (MaintainKey == 1 && ChngRpp == 1 && (duration == 2 || duration == 5) && chkMain == 0/*window.location.href.toLowerCase().indexOf("audience/visitors") > -1*/) {
        startEndDates = BindDate(10, fromdate, todate);
        ChngRpp = 0;
    }
    else
        startEndDates = BindDate(parseInt(duration), fromdate, todate);
    ////Hide Maintain checkbox
    if (window.location.href.toLowerCase().indexOf("allcountries") > -1 || window.location.href.toLowerCase().indexOf("allcities") > -1 || window.location.href.toLowerCase().indexOf("alldevices") > -1
        || window.location.href.toLowerCase().indexOf("alleventtracking") > -1 || window.location.href.toLowerCase().indexOf("allpageanalysis") > -1 || window.location.href.toLowerCase().indexOf("allpopularpages") > -1
        || window.location.href.toLowerCase().indexOf("alltopentrypages") > -1 || window.location.href.toLowerCase().indexOf("alltopexitpages") > -1 || window.location.href.toLowerCase().indexOf("allorganicsearch") > -1
        || window.location.href.toLowerCase().indexOf("allreferral") > -1 || window.location.href.toLowerCase().indexOf("allsocialsources") > -1 || window.location.href.toLowerCase().indexOf("alldevicesmobile") > -1
        || window.location.href.toLowerCase().indexOf("alleventtrackingmobile") > -1 || window.location.href.toLowerCase().indexOf("alloperatingsystemmobile") > -1
        || window.location.href.toLowerCase().indexOf("sourcepages") > -1 || window.location.href.toLowerCase().indexOf("searchkeys") > -1) {
        $($("#dvCustomFilter .chk")[0].childNodes[0]).hide();
        $($("#dvCustomFilter .chk")[0].childNodes[1]).css("margin-left", "0px");
    }
    if (duration == 0 && window.location.pathname.toString().indexOf("/UniqueVisits") != -1) { } else {
        fromdate = startEndDates[0];
        todate = startEndDates[1];
    }
    SFrom = fromdate;
    STo = todate;
    SCom = compareOption;
    Sdur = duration;
    var result = [fromdate, todate, compare, compareOption, MaintainKey];
    return (result);
}
//Bind selected date(@ 13-2-2014) duration in header........
function BindDate(dur, frm, to) {
    var a = new Date(), b = new Date(), startdate = '', enddate = '';
    switch (dur) {
        case 1:
            startdate = (a.getMonth() + 1) + '/' + a.getDate() + '/' + a.getFullYear() + " 00:00:00.000";
            enddate = (a.getMonth() + 1) + '/' + a.getDate() + '/' + a.getFullYear() + " 23:59:59.000";
            break;
        case 2:
            b.setDate(a.getDate() - 6);
            startdate = (b.getMonth() + 1) + '/' + b.getDate() + '/' + b.getFullYear() + " 00:00:00.000";
            enddate = (a.getMonth() + 1) + '/' + a.getDate() + '/' + a.getFullYear() + " 23:59:59.000";
            break;
        case 3:
            b.setMonth(a.getMonth() - 1);
            b.setDate(b.getDate() + 1);
            startdate = (b.getMonth() + 1) + '/' + b.getDate() + '/' + b.getFullYear() + " 00:00:00.000";
            enddate = (a.getMonth() + 1) + '/' + a.getDate() + '/' + a.getFullYear() + " 23:59:59.000";
            break;
        case 4:
            b.setDate(a.getDate() - 365);
            startdate = (a.getMonth() + 1) + '/' + a.getDate() + '/' + b.getFullYear() + " 00:00:00.000";
            enddate = (a.getMonth() + 1) + '/' + a.getDate() + '/' + a.getFullYear() + " 23:59:59.000";
            break;
        case 5:
            a = new Date(frm);
            b = new Date(to);
            startdate = (a.getMonth(frm) + 1) + '/' + a.getDate(frm) + '/' + a.getFullYear(frm) + " 00:00:00.000";
            enddate = (b.getMonth(to) + 1) + '/' + b.getDate(to) + '/' + b.getFullYear(to) + " 23:59:59.000";
            if ($("#chk_Maintain").is(":checked")) {
                if (typeof Storage !== "undefined") {
                    localStorage.setItem("P5From", frm);
                    localStorage.setItem("P5To", to);
                }
                else
                    ShowErrorMessage("Please update your browser to use this feature.");
            }
            else {
                if (typeof Storage !== "undefined" && (localStorage.getItem("P5From") != null || localStorage.getItem("P5To") != null) && $('#chk_Maintain').attr('checked') != "checked" && chkMain == 2) {
                    localStorage.removeItem("P5From");
                    localStorage.removeItem("P5To");
                }
            }
            break;
        case 10:
            frm = localStorage.getItem("P5From");
            to = localStorage.getItem("P5To");
            $('#txtDateFrom').val(frm);
            $('#txtDateTo').val(to);
            $('#chk_Maintain').attr('checked', true);
            a = new Date(frm);
            b = new Date(to);
            startdate = (a.getMonth(frm) + 1) + '/' + a.getDate(frm) + '/' + a.getFullYear(frm) + " 00:00:00.000";
            enddate = (b.getMonth(to) + 1) + '/' + b.getDate(to) + '/' + b.getFullYear(to) + " 23:59:59.000";
            break;
        default:
            break;
    }
    //P5NoticeCheck(startdate);
    return [startdate, enddate];
}
///Get MonthNames @ 13-2-2014
function GetMonthName(mnth) {
    var month = '';
    switch (mnth) {
        case 1:
            month = 'January';
            break;
        case 2:
            month = 'February';
            break;
        case 3:
            month = 'March';
            break;
        case 4:
            month = 'April';
            break;
        case 5:
            month = 'May';
            break;
        case 6:
            month = 'June';
            break;
        case 7:
            month = 'July';
            break;
        case 8:
            month = 'August';
            break;
        case 9:
            month = 'September';
            break;
        case 10:
            month = 'October';
            break;
        case 11:
            month = 'November';
            break;
        case 12:
            month = 'December';
            break;
        default:
            month = '';
            break;
    }
    return month;
}
function FadeOutDiv(divId) {

    $("#" + divId).fadeOut("slow", function () {
        $("#" + divId).hide();
    });
}
//function fn_AverageTime(Desc) {
//    var secnew = 0;
//    var seconds = 0, days = 0, hours = 0, minutes = 0;
//    var total = '';
//    if (Desc != "undefined" && Desc != "") {
//        seconds = parseInt(Desc);
//        days = Math.round(seconds / 86400);
//        hours = Math.round((seconds / 3600) - (days * 24));
//        minutes = Math.round((seconds / 60) - (days * 1440) - (hours * 60));
//        secnew = Math.round(seconds - (days * 86400) - (hours * 3600) - (minutes * 60));
//    }
//    if (days == 0 && hours == 0 && minutes == 0 && secnew == 0)
//        total = "less than a second";
//    else
//        total = Math.abs(days) + "d " + Math.abs(hours) + "h " + Math.abs(minutes) + "m " + Math.abs(secnew) + "s";
//    return (total);
//}
//New fn for Avg Time Calculation
function fn_AverageTime(Desc) {
    var secnew = 0;
    var seconds = 0, days = 0, hours = 0, minutes = 0;
    var total = '';
    if (Desc != "undefined" && Desc != "") {
        seconds = Desc % 60
        days = Math.floor(Desc / 60 / 60 / 24);
        hours = Math.floor(Desc / 60 / 60) % 24
        minutes = Math.floor(Desc / 60) % 60
        secnew = Math.round(seconds - (days * 86400) - (hours * 3600) - (minutes * 60));
    }
    if (days == 0 && hours == 0 && minutes == 0 && secnew == 0)
        total = "less than a second";
    else
        total = Math.abs(days) + "d " + Math.abs(hours) + "h " + Math.abs(minutes) + "m " + Math.abs(seconds) + "s";
    return (total);
}
function ShowErrorMessage(errMessage) {
    $(".MsgStyle").empty();
    divmsg.innerHTML = errMessage; //+ '<span style="float:right;cursor:pointer;padding-right: 25px;position: absolute;left: 61%;" onclick=javascript:$("#divmsg").hide()>X</span>';
    messageDiv = $(".MsgStyle");
    messageDiv.fadeIn(500);
    //$("#divmsg").width($("#dvControlPanel").width());
    setTimeout(function () { messageDiv.fadeOut(500); }, 2500);
}
function DeleteConfirmation(key) {
    $("#dvDeletePanel").remove();
    var deletemsg = '<div class="bgShadedDiv" style="display: block;"></div><div class="dvdeletepopup"><div class="plumb-frm" style="max-width: 45%;"><div style="float: left;" class="title">Delete Confirmation</div>' +
        '<div style="padding-top: 35px;">This item will be permanently deleted and cannot be recovered. Are you sure?<br /><br />' +
        '<input id="ui_create" type="button" class="button" value="Delete" onclick="ConfirmedDelete(&#39;' + key + '&#39;)" /><span>&nbsp;</span>' +
        '<input id="ui_cancel" type="button" class="button" value="cancel" onclick="ConfirmedCancel()" /></div></div></div>';

    var messageDiv = document.createElement("div");
    messageDiv.id = "dvDeletePanel";
    messageDiv.innerHTML = deletemsg;
    document.body.appendChild(messageDiv);
}
function ConfirmedCancel() {
    $("#dvDeletePanel").hide();
}
function p5commonDateView(fromdate, todate) {
    var removeAr1 = fromdate.split(' ');
    var removeAr2 = todate.split(' ');
    var arSplit1 = removeAr1[0].split('/');
    var arSplit2 = removeAr2[0].split('/');
    var frm1 = arSplit1[2] + "-" + (arSplit1[0].toString().length == 1 ? "0" + arSplit1[0] : arSplit1[0]) + "-" + (arSplit1[1].length == 1 ? "0" + arSplit1[1] : arSplit1[1]);
    var to1 = arSplit2[2] + "-" + (arSplit2[0].length == 1 ? "0" + arSplit2[0] : arSplit2[0]) + "-" + (arSplit2[1].length == 1 ? "0" + arSplit2[1] : arSplit2[1]);
    var a = new Date(frm1);
    var b = new Date(to1);
    lblDate.innerHTML = a.getDate(fromdate) + ' ' + GetMonthName(a.getMonth(fromdate) + 1) + ' ' + a.getFullYear(fromdate) + ' - ' + b.getDate(todate) + ' ' + GetMonthName(b.getMonth(todate) + 1) + ' ' + b.getFullYear(todate);
}
function PlumbTimeFormat(newdate) {
    var date = new Date(newdate);
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    var tt = "AM";
    if (date.getHours() >= 12) {
        tt = "PM";
        if (date.getHours() > 12)
            hh = date.getHours() % 12;
    }
    hh = parseInt(hh) > 9 ? hh : "0" + hh;
    mm = parseInt(mm) > 9 ? mm : "0" + mm;
    ss = parseInt(ss) > 9 ? ss : "0" + ss;
    return hh + ":" + mm + ":" + ss + " " + tt;
}
function GetJavaScriptDateObjNew(dateString) {
    if (dateString.length > 0) {
        if (dateString.indexOf('.') == -1)
            dateString = dateString + ".000";
        var dbDate = dateString.split('T');
        var year = dbDate[0].split('-');
        var time = dbDate[1].split(':');
        var milSec = 0;
        if (time[2].toString().indexOf(".") > 0) {
            milSec = time[2].split('.');
        } else {
            milSec = time[2].split('+');
        }
        var createDate = new Date(year[0], year[1] - 1, year[2], time[0], time[1], milSec[0]);
        return createDate;
    }
    return "";
}
function CaptureImage() {
    $.ajax({
        url: "/Ticket/CaptureImage",
        type: 'Post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            '<%Session["ImageName"] = "' + response + '"; %>';
        }
    });
}
//Alert Notice
function P5NoticeCheck(startdate) {
    try {
        var m = new Date("2015-10-30");
        var o = new Date(startdate.split(" ")[0]);
        if (o < m) {
            if ($("#P5NoticeFrame").length === 0) {
                var msg = "<div id='P5NoticeFrame' style='position: fixed;bottom:0;right:10px;'>" +
                    "<div id='P5Notice' style='border-radius:10px 10px 0 0;width:300px;height:35px;background-color:#8EC510;cursor:pointer'>" +
                    "<span style='position: relative; top: 8px; left: 10px; font-family: &quot;Source Sans Pro&quot;,sans-serif;'>Notice</span><span id='P5NoticeClose' style='float:right;padding:6px 15px'>x</span></div>" +
                    "<div style='height: 85px; display: none; border-width: 0px 1px; border-style: none solid; border-color: #CFCFCF; -moz-border-top-colors: none; -moz-border-right-colors: none; -moz-border-bottom-colors: none; -moz-border-left-colors: none; border-image: none; width: 288px;background-color:white;padding:5px' " +
                    "id='NoticeDiv'>You might face count mismatch issues in the selected duration due to data consolidation from the old version. We apologize for this inconvenience.</div></div>";
                $("body").append(msg);
            } else {
                $("#P5NoticeFrame").show();
                $("#NoticeDiv").hide();
            }
        } else {
            $("#P5NoticeFrame").hide();
        }
        $("#P5Notice").click(function () {
            $("#NoticeDiv").toggle("fast");
        });
        $("#P5NoticeClose").click(function () {
            $("#P5NoticeFrame").hide();
        });
    } catch (e) {
    }
}
//// Page Report Sharing
function getSharePopup() {
    var ShareDiv = "<div class='newTitle'><span id='sp_shareTtl'>Share Report</span>" +
        "<img alt='Close' onclick='javascript: fn_toggleControl(0);' title='Close'" +
        "style='cursor: pointer; float: right' src='" + cdnpath + "Lofinclose.jpg' />" +
        "</div>" +
        " <div style='border-bottom: 1px solid #e8e8e8;'>" +
        "</div>" +
        "<div class='divPadding' style='margin-top: 10px;'>" +
        "<div style='width: 100%; height: 44px;'>" +
        "<div style='float: left; width: 25%; padding-top: 15px;' class='labeldesc'> Enter EmailId :" +
        "</div>" +
        "<div id='dv_txtAuto' style='float: left;'>" +
        "<input style='width: 325px; color: #666666; height: 20px; padding-left: 5px; font-family: Source Sans Pro, sans-serif;' type='text' id='txtmailId' />" +
        "</div>" +
        "<div style='float: left; width: 25%; padding-top: 15px;' class='labeldesc'> Comments :" +
        "</div>" +
        "<div style='float: left;'>" +
        "<textarea style='width: 325px; color: #666666; height: 75px; border-radius: 4px; font-family: Source Sans Pro, sans-serif; padding: 5px 0 0 5px; border: 1px solid #9e9e9e;' type='text' id='txtData' placeholder = 'Please enter the comments'></textarea>" +
        "</div>" +
        "<div id='div_ShareSend' style='float: left; width: 45%; margin: -5px -1px; padding-top: 25px;'>" +
        "<div style='float: left; width: 56%;' class='labeldesc'>" +
        "</div>" +
        "<input id='btnSend' type='button' value='Send' class='button' onclick='fn_SendReport()' />" +
        "</div></div></div>";
    return ShareDiv;
}
var p5keyValue = $.urlParam("P5Value").toString();
if (p5keyValue != 0) {
    var value = p5keyValue.split(";");
    var duration = '';
    for (var i = 0; i < value.length; i++) {
        if (value[i].indexOf("Duration:") != -1)
            duration = value[i].replace("Duration:", "");
        else if (value[i].indexOf("Compare:") != -1)
            Comp = value[i].replace("Compare:", "");
        else if (value[i].indexOf("Fromdate:") != -1)
            fromdate = value[i].replace("Fromdate:", "").replace(/~/g, ' ');
        else if (value[i].indexOf("Todate:") != -1)
            todate = value[i].replace("Todate:", "").replace(/~/g, ' ');
        else if (value[i].indexOf("End:") != -1)
            endNo = value[i].replace("End:", "");
        else if (value[i].indexOf("Channel:") != -1)
            channel = value[i].replace("Channel:", "");
        else if (value[i].indexOf("CustomReportId:") != -1)
            QryId = value[i].replace("CustomReportId:", "");
        else if (value[i].indexOf("PaidCmpMode:") != -1)
            AdwordOrSense = value[i].replace("PaidCmpMode:", "");
        ///// UTM Filters
        else if (value[i].indexOf("FilterUTMSource:") > -1)
            UTMSource = value[i].replace("FilterUTMSource:", "");
        else if (value[i].indexOf("FilterUTMMedium:") > -1)
            UTMMedium = value[i].replace("FilterUTMMedium:", "");
        else if (value[i].indexOf("FilterUTMCampaign:") > -1)
            UTMCampaign = value[i].replace("FilterUTMCampaign:", "");
        /////
        else if (value[i].indexOf("Type:") != -1)
            type = value[i].replace("Type:", "");
        else if (value[i].indexOf("Domain:") != -1)
            domain = value[i].replace("Domain:", "");
        else if (value[i].indexOf("PageName:") != -1)
            page = value[i].replace("PageName:", "");
        else if (value[i].indexOf("VisitorFlowKey:") != -1)
            visitorflowKey = value[i].replace("VisitorFlowKey:", "");
        else if (value[i].indexOf("Key:") != -1)
            key = value[i].replace("Key:", "").replace(/~/g, ' ');
        else if (value[i].indexOf("PageSrc:") != -1)
            pagename = value[i].replace("PageSrc:", "");
        else if (value[i].indexOf("Url:") != -1)
            url = value[i].replace("Url:", "");
        else if (value[i].indexOf("AttributionId:") != -1)
            QryModelId = value[i].replace("AttributionId:", "");
        else if (value[i].indexOf("DashId:") != -1)
            qryDashId = value[i].replace("DashId:", "");
        else if (value[i].indexOf("DrpSearch:") != -1)
            drpSearch = value[i].replace("DrpSearch:", "");
        else if (value[i].indexOf("TxtSearch:") != -1)
            txtSearch = value[i].replace("TxtSearch:", "");
        ///MobileApp Unique Visits
        else if (value[i].indexOf("Name:") != -1)
            deviceName = value[i].replace("Name:", "").replace(/~/g, ' ');
        else if (value[i].indexOf("OS:") != -1)
            os = value[i].replace("OS:", "").replace(/~/g, ' ');
        /// unique visits

        else if (value[i].indexOf("FilterEmail") > -1)
            FilterEmail = value[i].replace("FilterEmail:", "");
        else if (value[i].indexOf("FilterCity") > -1)
            FilterCity = value[i].replace("FilterCity:", "");
        else if (value[i].indexOf("FilterSessions") > -1)
            FilterSessions = value[i].replace("FilterSessions:", "");

        else if (value[i].indexOf("online:") != -1)
            online = value[i].replace("online:", "");
        else if (value[i].indexOf("Country:") != -1)
            country = value[i].replace("Country:", "").replace(/~/g, ' ');
        else if (value[i].indexOf("City:") != -1)
            city = value[i].replace("City:", "").replace(/~/g, ' ');
        else if (value[i].indexOf("Frequency:") != -1)
            frequency = value[i].replace("Frequency:", "").replace(/~/g, ' ');
        else if (value[i].indexOf("Recency:") != -1)
            recency = value[i].replace("Recency:", "");
        else if (value[i].indexOf("Time:") != -1)
            time = value[i].replace("Time:", "").replace(/~/g, ' ');
        else if (value[i].indexOf("Depth:") != -1)
            depth = value[i].replace("Depth:", "").replace(/~/g, ' ');
        else if (value[i].indexOf("Device:") != -1)
            device = value[i].replace("Device:", "").replace(/~/g, ' ');
        else if (value[i].indexOf("Network:") != -1)
            network = value[i].replace("Network:", "").replace(/~/g, ' ');

        //// Mobile
        else if (value[i].indexOf("Carrier:") != -1)
            carrier = value[i].replace("Carrier:", "").replace(/~/g, ' ');
        else if (value[i].indexOf("Resolution:") != -1)
            resolution = value[i].replace("Resolution:", "");
        else if (value[i].indexOf("Geofence:") != -1)
            geofence = value[i].replace("Geofence:", "").replace(/~/g, ' ');
        else if (value[i].indexOf("Beacon:") != -1)
            beacon = value[i].replace("Beacon:", "").replace(/~/g, ' ');
        //// Mobile

        else if (value[i].indexOf("AllSource:") != -1)
            allsources = value[i].replace("AllSource:", "");
        else if (value[i].indexOf("Refer:") != -1)
            refer = value[i].replace("Refer:", "");
        else if (value[i].indexOf("AdWords:") != -1)
            adwords = value[i].replace("AdWords:", "");
        else if (value[i].indexOf("AdSense:") != -1)
            adsense = value[i].replace("AdSense:", "");
        else if (value[i].indexOf("Yahoo:") != -1)
            yahoo = value[i].replace("Yahoo:", "");
        else if (value[i].indexOf("UTM:") != -1)
            utm = value[i].replace("UTM:", "");
        else if (value[i].indexOf("Search:") != -1)
            search = value[i].replace("Search:", "");
        else if (value[i].indexOf("Social:") != -1)
            social = value[i].replace("Social:", "");
        else if (value[i].indexOf("Source:") != -1)
            source = value[i].replace("Source:", "");
        else if (value[i].indexOf("Entry:") != -1)
            entry = value[i].replace("Entry:", "");
        else if (value[i].indexOf("Exit:") != -1)
            exit = value[i].replace("Exit:", "");
        else if (value[i].indexOf("Events:") != -1)
            events = value[i].replace("Events:", "");
        else if (value[i].indexOf("Product:") != -1)
            product = value[i].replace("Product:", "");
        else if (value[i].indexOf("ProductId:") != -1)
            productid = value[i].replace("ProductId:", "");
        else if (value[i].indexOf("Month:") != -1)
            cohortsMonth = value[i].replace("Month:", "");
        else if (value[i].indexOf("Year:") != -1)
            cohortsYear = value[i].replace("Year:", "");
        else if (value[i].indexOf("FGoal:") != -1)
            fgoal = value[i].replace("FGoal:", "");
        else if (value[i].indexOf("GoalId:") != -1)
            goalId = value[i].replace("GoalId:", "");
        else if (value[i].indexOf("Stage:") != -1)
            stage = value[i].replace("Stage:", "");
        else if (value[i].indexOf("Scores:") != -1)
            scores = value[i].replace("Scores:", "");
        else if (value[i].indexOf("StartScore:") != -1)
            StartScore = value[i].replace("StartScore:", "");
        else if (value[i].indexOf("EndScore:") != -1)
            EndScore = value[i].replace("EndScore:", "");
    }
    if (duration == 5 || (window.location.pathname.toString().indexOf("/UniqueVisits") != -1 && duration == 0 && online != "true")) {    //inserting fromdate todate
        var S1 = fromdate.split(" ")[0].split("/");
        var S2 = todate.split(" ")[0].split("/");
        P5ShareFrm = S1[2] + "-" + (S1[0].toString().length == 1 ? "0" + S1[0] : S1[0]) + "-" + (S1[1].toString().length == 1 ? "0" + S1[1] : S1[1]);
        P5ShareTo = S2[2] + "-" + (S2[0].toString().length == 1 ? "0" + S2[0] : S2[0]) + "-" + (S2[1].toString().length == 1 ? "0" + S2[1] : S2[1]);
    }
    CheckFilter(duration);
}
var shareType = "Page";
function fn_toggleControl(flag) {
    $("#txtmailId").val(''); $("#txtData").val('');
    //if ($("#dv_shareContent") != null && $("#dv_shareContent").html() == '') {
    if (flag == 1) {
        if (window.location.href.toLowerCase().indexOf("createdashboard") > -1 || window.location.href.toLowerCase().indexOf("attributionmodelview") > -1 ||
            window.location.href.toLowerCase().indexOf("heatmaps") > -1 || window.location.href.toLowerCase().indexOf("reversegoal") > -1) {

            dv_shareContent.innerHTML = getSharePopup();
            $("#sp_shareTtl").text('Share the report as Link');
            $('#dv_shareContent').toggle('slow');
        } else {
            $("#dvShare_option").toggle('slow');
            $("#dvexport_option").fadeOut('slow');
            $("#dvexport_txtorxlx").fadeOut('slow');
        }
    }
    if (flag == 0)
        $("#dv_shareContent").fadeOut('slow');
}
var svgUrl = "";
function fn_toggleShareOption(flag) {
    if (flag == 1) {
        shareType = "Page";
    }
    else if (flag == 2) {
        shareType = "Template";
        if (window.location.href.toLowerCase().indexOf("audience/cities") > -1 || window.location.href.toLowerCase().indexOf("dashboard/countries") > -1 ||
            window.location.href.toLowerCase().indexOf("content/pageanalysis") > -1 || window.location.href.toLowerCase().indexOf("mobileapp/cities") > -1
            || window.location.href.toLowerCase().indexOf("mobileapp/countries") > -1) {
            mapconvertAsImage();
            $("#map").show();
            if (window.location.href.toLowerCase().indexOf("content/pageanalysis") > -1)
                $("#Pgflashcontent").show();
            $("#dv_bgImg").hide();
        }
        else
            convertAsImage();
    }
    dv_shareContent.innerHTML = getSharePopup();
    if (flag == 1)
        $("#sp_shareTtl").text('Share the report as Link');
    else if (flag == 2)
        $("#sp_shareTtl").text('Share the report as Image');

    $('#dv_shareContent').fadeIn('slow');
    $("#dvShare_option").fadeOut('slow');
    $("#drp_ShareOption").val(0);
    //saveAsImage();
}
$(document).ready(function () {
    $('#dv_Share').click(function (event) {
        event.stopPropagation();
    });
});
$(document).click(function (e) {
    var targetbox = $('#dvShare_option');
    if (!targetbox.is(e.target) && targetbox.has(e.target).length === 0) {
        $('#dvShare_option').hide('slow');
    }
});
$(document).ready(function () {
    $('#lnkFilter').click(function () {
        m = 1;
        $('#dv_shareContent').hide('slow');
        $('#tbleditscore').hide('slow');
        $('#tblAddLandingPage').hide('slow');
        $('#div_AddSegment').hide('slow');
    });
});

function fn_SendReport() {
    var frmto = '', querystringlink = '', srcpath = '', REnd = '', AdvancedFilter = '', FilterEmail1 = 0, FilterCity1 = 0, FilterSessions1 = 0,
        UTMSource1 = 0, UTMMedium1 = 0, UTMCampaign1 = 0, UTMFilter = '';
    var isEmail = /^([\w-\.]+)(\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+)([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    $("#dvLoading").css("display", "block");
    var txtToEmailId = $("#txtmailId").val();
    endNo = $("#drp_RecordsPerPage").val() == "All" ? $("#drp_RecordsPerPage").val() : ($("#hdn_End").val() == undefined || $("#hdn_End").val() == '' ? 0 : $("#hdn_End").val());
    var hdnId = 0, hdnMailId = 0;
    hdnId = $("#hdnShare").val().split(",")[0];
    hdnMailId = $("#hdnShare").val().split(",")[1];
    if (txtToEmailId != '') {
        if (!isEmail.test(txtToEmailId)) {
            $("#dvLoading").css("display", "none");
            ShowErrorMessage("Please enter valid email id.");
            return false;
        } else if (hdnId == 0 || hdnMailId != txtToEmailId) {
            $("#dvLoading").css("display", "none");
            ShowErrorMessage("Please select the user email id from the suggestion.");
            return false;
        }
    }
    else {
        $("#dvLoading").css("display", "none");
        ShowErrorMessage("Please enter email id.");
        return false;
    }

    $('#dv_shareContent').toggle('slow');
    if (shareType == "Page") {

        if (window.location.href.toLowerCase().indexOf("channel=") > -1 && window.location.href.toLowerCase().indexOf("/content/allpopularpages") > -1)
            channel = $("#drp_Channel").val();

        srcpath = window.location.pathname.toString().substring(1);
        if (Sdur == 5 || (Sdur == 0 && window.location.pathname.toString().indexOf("/UniqueVisits") != -1)) {
            frmto = ";Fromdate:" + SFrom.replace(/\s/g, '~') + ";Todate:" + STo.replace(/\s/g, '~');
        } else {
            frmto = "NoCustomeDate";
        }

        /////// Records per page
        if (endNo != undefined || endNo != 0) {
            REnd = ";End:" + endNo + "";
        } else
            REnd = "NoEndNo";

        //////// Filter Start
        FilterEmail1 = $("#Email1").text().replace(" = ", ":");
        FilterCity1 = $("#City1").text().replace(" = ", ":");
        FilterSessions1 = $("#Sessions1").text().replace(" = ", ":");
        if (FilterEmail1 != 0 || FilterCity1 != 0 || FilterSessions1 != 0) {
            if (FilterEmail1 != 0)
                AdvancedFilter = ";Filter" + FilterEmail1;
            if (FilterCity1 != 0)
                AdvancedFilter += ";Filter" + FilterCity1;
            if (FilterSessions1 != 0)
                AdvancedFilter += ";Filter" + FilterSessions1;
        }
        else {
            AdvancedFilter = "NoAdvanceFilter"
        }
        ////// Filters End

        ////// UTM Filters
        UTMSource1 = $("#UTMSource1").text().replace(" ", "").replace(" = ", ":");
        UTMMedium1 = $("#UTMMedium1").text().replace(" ", "").replace(" = ", ":");
        UTMCampaign1 = $("#UTMCampaign1").text().replace(" ", "").replace(" = ", ":");
        if (UTMSource1 != 0 || UTMMedium1 != 0 || UTMCampaign1 != 0) {
            if (UTMSource1 != 0)
                UTMFilter = ";Filter" + UTMSource1;
            if (UTMMedium1 != 0)
                UTMFilter += ";Filter" + UTMMedium1;
            if (UTMCampaign1 != 0)
                UTMFilter += ";Filter" + UTMCampaign1;
        }
        else {
            UTMFilter = "NoUTMFilter"
        }

        ////// Unique Visits Start
        if (srcpath.toLowerCase().indexOf("/uniquevisits") > -1) {
            if (country != 0 && type != 0) // Country with new
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Country:" + country.replace(/\s/g, '~') + ";Type:" + type + AdvancedFilter + frmto;
            else if (country != 0) // only Country
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Country:" + country.replace(/\s/g, '~') + AdvancedFilter + frmto;
            else if (type != 0) //New Vs Return
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Type:" + type + AdvancedFilter + frmto;
            else if (frequency != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Frequency:" + frequency.replace(/\s/g, '~') + AdvancedFilter + frmto;
            else if (recency != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Recency:" + recency + AdvancedFilter + frmto;
            else if (time != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Time:" + time.replace(/\s/g, '~') + AdvancedFilter + frmto;
            else if (depth != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Depth:" + depth.replace(/\s/g, '~') + AdvancedFilter + frmto;
            ////// MobileApp Unique
            else if (device != 0 && deviceName != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Device:" + device.replace(/\s/g, '~') + ";Name:" + deviceName.replace(/\s/g, '~') + frmto;
            else if (os != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";OS:" + os.replace(/\s/g, '~') + frmto;
            else if (carrier != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Carrier:" + carrier.replace(/\s/g, '~') + frmto;
            else if (resolution != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Resolution:" + resolution + frmto;
            else if (geofence != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Geofence:" + geofence.replace(/\s/g, '~') + frmto;
            else if (beacon != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Beacon:" + beacon.replace(/\s/g, '~') + frmto;
            ////// MobileApp Unique
            else if (device != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Device:" + device.replace(/\s/g, '~') + AdvancedFilter + frmto;
            else if (network != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Network:" + network.replace(/\s/g, '~') + AdvancedFilter + frmto;
            else if (allsources != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";AllSource:" + allsources + AdvancedFilter + frmto;
            else if (refer != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Refer:" + refer + AdvancedFilter + frmto;
            else if (adwords != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";AdWords:" + adwords + AdvancedFilter + frmto;
            else if (adsense != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";AdSense:" + adsense + AdvancedFilter + frmto;
            else if (yahoo != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Yahoo:" + yahoo + AdvancedFilter + frmto;
            else if (utm != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";UTM:" + utm + AdvancedFilter + frmto;
            else if (search != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Search:" + search + AdvancedFilter + frmto;
            else if (social != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Social:" + social + AdvancedFilter + frmto;
            else if (source != 0)// Email/Sms
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Source:" + source + AdvancedFilter + frmto;
            else if (domain != 0 && key != 0 && page != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Domain:" + domain + ";Key:" + key.replace(/\s/g, '~') + ";PageName:" + page + AdvancedFilter + frmto;
            else if (domain != 0 && key != 0) //No search Key
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Domain:" + domain + ";Key:" + key.replace(/\s/g, '~') + AdvancedFilter + frmto;
            else if (city != 0 && url != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";City:" + city.replace(/\s/g, '~') + ";Url:" + url + AdvancedFilter + frmto;
            else if (city != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";City:" + city.replace(/\s/g, '~') + AdvancedFilter + frmto;
            else if (entry != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Entry:" + entry + AdvancedFilter + frmto;
            else if (exit != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Exit:" + exit + AdvancedFilter + frmto;
            else if (events != 0 && page != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Events:" + events + ";PageName:" + page + AdvancedFilter + frmto;
            else if (page != 0 && channel != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";PageName:" + page + ";Channel:" + channel + AdvancedFilter + frmto;
            else if (page != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";PageName:" + page + AdvancedFilter + frmto;
            else if (product != 0 && productid != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Product:" + product + ";ProductId:" + productid + AdvancedFilter + frmto;
            else if (product != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Product:" + product + AdvancedFilter + frmto;
            else if (cohortsMonth != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Month:" + cohortsMonth + ";Year:" + cohortsYear + AdvancedFilter + frmto;
            else if (fgoal != 0 && goalId != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";FGoal:" + fgoal + ";GoalId:" + goalId + AdvancedFilter + frmto;
            //else if (online != 0 && online == "true")
            //    querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";online:" + online;
            else
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + AdvancedFilter + frmto;
        }
        //// Unique Visits End
        else {
            var txtSearch2 = "";
            if (drpSearch == "Equalto")
                txtSearch2 = txtSearch == "0" ? "00" : txtSearch
            if (QryId != 0 && srcpath.indexOf("/MyReportsView") != -1)  //MyReportView Page
                querystringlink = srcpath + "?P5Value=CustomReportId:" + QryId;
            else if (srcpath.indexOf("/Recency") != -1)  //Recency Page
                querystringlink = srcpath + "?P5Value=Duration:0";
            else if (SCom != 0) //Compare 
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Compare:" + SCom + frmto;
            else if (AdwordOrSense != '' && AdwordOrSense != 0)  //PaidCampaign page 
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";PaidCmpMode:" + AdwordOrSense + UTMFilter + frmto;
            else if (type != 0 && type != -1 && domain != 0 && domain != -1)  //SourcePages 
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Type:" + type + ";Domain:" + domain + frmto;
            else if (page != 0 && type != 0 && type != -1) //AllpageAnalysis
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Type:" + type + ";PageName:" + page + frmto;
            else if (key != 0 && domain != 0 && domain != -1) //SearchKey Page
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Domain:" + domain + ";Key:" + key.replace(/\s/g, '~') + frmto;
            else if (domain != 0 && domain != -1)  //SearchKey Page
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Domain:" + domain + frmto;
            else if (url != 0 && srcpath.indexOf("/SearchKeysForPage") != -1)  /// Search keys for page
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Url:" + url + frmto;
            else if (goalId != 0 && srcpath.indexOf("/ForwardGoal") != -1)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";GoalId:" + goalId + frmto;
            else if (goalId != 0 && srcpath.indexOf("/ReverseGoal") != -1)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";GoalId:" + goalId + frmto;
            //else if (pagename != 0 && pagename != undefined && channel != 0)
            //    querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";PageSrc:" + pagename + frmto;
            else if (pagename != 0 && pagename != undefined)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";PageSrc:" + pagename + frmto;
            else if (productid != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";ProductId:" + productid.replace(/\s/g, '~') + frmto;
            else if (QryModelId != 0 && QryModelId != -1)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";AttributionId:" + QryModelId + frmto;
            else if (visitorflowKey != 0 && visitorflowKey != undefined)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";VisitorFlowKey:" + $('#drpsource').val() + frmto;
            else if (qryDashId != 0 && qryDashId != -1)
                querystringlink = srcpath + "?P5Value=Duration:0;DashId:" + qryDashId + frmto;
            else if (drpSearch != 0 && drpSearch != undefined && (txtSearch2 != "" || txtSearch != 0 && txtSearch != 'Enter Score') && txtSearch != undefined && srcpath.indexOf("/AllVisitors") != -1)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";DrpSearch:" + drpSearch + ";TxtSearch:" + txtSearch + frmto;
            else if (drpSearch == 'InBetween' && drpSearch != undefined && drpSearch != 0 && (StartScore != '' && EndScore != '') && srcpath.indexOf("/AllVisitors") != -1)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";DrpSearch:" + drpSearch + ";StartScore:" + StartScore + ";EndScore:" + EndScore + frmto;
            else if (drpSearch != 0 && drpSearch != undefined && txtSearch != 0 && srcpath.indexOf("/Visitors") != -1 && txtSearch != undefined)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";DrpSearch:" + drpSearch + ";TxtSearch:" + txtSearch + frmto;
            else if (drpSearch != 0 && drpSearch != undefined && txtSearch == '')
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";DrpSearch:" + drpSearch + frmto;
            else if (stage != 0 && srcpath.indexOf("/VisitorStages") != -1)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Stage:" + stage + frmto;
            else if (scores != 0 && srcpath.indexOf("Advanced/AllVisitors") != -1)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Score:" + scores + frmto;
            else if (channel != 0)
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + ";Channel:" + channel + frmto;
            else
                querystringlink = srcpath + "?P5Value=Duration:" + Sdur + REnd + frmto;
        }
        if (frmto == "NoCustomeDate" || frmto == "")
            querystringlink = querystringlink.replace("frmto", "").replace("NoCustomeDate", "");
        if (REnd == "NoEndNo" || REnd == "")
            querystringlink = querystringlink.replace("REnd", "").replace("NoEndNo", "");

        if (AdvancedFilter == "NoAdvanceFilter" || AdvancedFilter == "")
            querystringlink = querystringlink.replace("AdvancedFilter", "").replace("NoAdvanceFilter", "");

        if ($("#txtData").val() == "") {
            $("#dv_comments").hide();
        }

        if (UTMFilter == "NoUTMFilter" || UTMFilter == "")
            querystringlink = querystringlink.replace("UTMFilter", "").replace("NoUTMFilter", "");

    }
    else {
        querystringlink = "";
    }
    //alert(querystringlink);
    //window.console.log(querystringlink);
    //return false;
    $.ajax({
        url: "/Analytics/ShareReport/SharingReport",
        type: 'Post',
        data: "{'accountId':'" + parseInt($("#hdn_AccountId").val()) + "','userId':'" + hdnId + "','shareEmailId':'" + txtToEmailId + "','shareComments':'" + $("#txtData").val() + "','srcLink':'" + querystringlink + "', 'shareType' : '" + shareType + "', 'divHtml':'" + svgUrl + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null && response != -1)
                ShowErrorMessage("Shared your Report");
            else if (response == -1)
                ShowErrorMessage("Permission is not available to share!");
            else
                ShowErrorMessage("Something went wrong please check once again.");
            $("#dvLoading").css("display", "none");
        }
    });
}
////auto sugest
$(document).ready(function () {
    var sett = 0;
    $('#shareAsImg').click(function () {
        CallAutoSuggest();
    });
    $('#shareAsLnk').click(function () {
        CallAutoSuggest();
    });
    $('#btnShare').click(function () {
        if (window.location.href.toLowerCase().indexOf("createdashboard") > -1 || window.location.href.toLowerCase().indexOf("attributionmodelview") > -1 ||
            window.location.href.toLowerCase().indexOf("heatmaps") > -1 || window.location.href.toLowerCase().indexOf("reversegoal") > -1)
            CallAutoSuggest();
    });
    function CallAutoSuggest() {
        $("#hdnShare").val('');
        //if (sett == 0) {
        $('#txtmailId').bind("keydown", function (event) {
            if (event.keyCode === $.ui.keyCode.TAB &&
                $(this).autocomplete("instance").menu.active) {
                event.preventDefault();
            }
        }).autocomplete({
            minLength: 1,
            source: function (request, response) {
                $.ajax({
                    url: "/Analytics/ShareReport/AutoSuggestForShare",
                    data: "{ 'accountId':'" + $("#hdn_AccountId").val() + "','q': '" + request.term + "'}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        if (data.Table.length === 0) {
                            response({ label: 'No matches found' });
                        }
                        else {
                            response($.map(data.Table, function (item) {
                                return {
                                    label: item.EmailId,
                                    value: item.UserId + ""
                                }
                            }))
                        }
                    },
                    error: function (xmlHttpRequest) {
                        //alert(xmlHttpRequest.responseText);
                    }
                });
            },
            appendTo: "#dv_txtAuto",
            select: function (event, ui) {
                $("#hdnShare").val(ui.item.value + "," + ui.item.label);
                event.preventDefault();
                $(this).val(ui.item.label);
            },
            focus: function () {
                return false;
            },
        });
        //}
        //sett = 1;
    }
});
function convertAsImage() {
    var svgElements = $("#divcontent").find('svg');
    svgElements.each(function () {
        var canvas, xml;
        $.each($(this).find('[style*=em]'), function (index, el) {
            $(this).css('font-size', getStyle(el, 'font-size'));
        });
        canvas = document.createElement("canvas");
        canvas.className = "screenShotTempCanvas";
        //convert SVG into a XML string
        xml = (new XMLSerializer()).serializeToString(this);
        // Removing the name space as IE throws an error
        xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');
        //draw the SVG onto a canvas
        canvg(canvas, xml);
        $(canvas).insertAfter(this);
        //hide the SVG element
        $(this).attr('class', 'tempHide');
        $(this).hide();
    });
    $("#divcontent").css("background-color", "white");
    html2canvas($("#divcontent"), {
        useCORS: true,
        onrendered: function (canvas) {
            var image = canvas.toDataURL('image/png');
            //window.open(image);
            image = image.replace('data:image/png;base64,', '');
            $.ajax({
                type: 'POST',
                url: '/ShareReport/SaveImage',
                data: '{ "imageData" : "' + image + '" }',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (msg) {
                    svgUrl = msg;
                }
            });
            //var doc = new jsPDF('p', 'mm');
            //doc.addImage(imgData, 'PNG', 10, 10);
            //doc.save('sample-file.pdf');
        }
    });
    $("#divcontent").find('.tempHide').show().removeClass('tempHide');
}
function getStyle(el, styleProp) {
    var camelize = function (str) {
        return str.replace(/\-(\w)/g, function (str, letter) {
            return letter.toUpperCase();
        });
    };
    if (el.currentStyle) {
        return el.currentStyle[camelize(styleProp)];
    } else if (document.defaultView && document.defaultView.getComputedStyle) {
        return document.defaultView.getComputedStyle(el, null)
            .getPropertyValue(styleProp);
    } else {
        return el.style[camelize(styleProp)];
    }
}
