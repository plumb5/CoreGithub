
// Left Menu Tab...........................

$(document).ready(function () {




    if (window.location.href.toLowerCase().indexOf("visituniques.aspx") > -1) {
        if (document.referrer.toLowerCase().indexOf("newrepeat.aspx") > -1) {
            $('#dash').css('display', 'block');
            $('#tabNewvsRepeat').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
        }
        else if (document.referrer.toLowerCase().indexOf("trendsvisittimeonsite.aspx") > -1) {
            $('#dash').css('display', 'block');
            $('#tabTimeonSite').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
        }
        else {
            $('#dash').css('display', 'block');
            $('#tabVisits').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
        }
    }

    if (window.location.href.toLowerCase().indexOf("visituniquesaudience.aspx") > -1) {


        if (window.location.href.toLowerCase().indexOf("count") > -1) {
            $('#Audi').css('display', 'block');
            $('#tabFrequency').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
        }
        else if (window.location.href.toLowerCase().indexOf("day") > -1) {
            $('#Audi').css('display', 'block');
            $('#tabRecency').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
        }
        else if (window.location.href.toLowerCase().indexOf("time") > -1) {
            $('#Audi').css('display', 'block');
            $('#tabTimeSpend').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
        }
        else if (window.location.href.toLowerCase().indexOf("depth") > -1) {
            $('#Audi').css('display', 'block');
            $('#tabPageDepth').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
        }

    }

    if (window.location.href.toLowerCase().indexOf("visituniquessource.aspx") > -1) {
        if (document.referrer.toLowerCase().indexOf("network.aspx") > -1) {
            $('#Audi').css('display', 'block');
            $('#tabNetwork').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
        }
        else if (document.referrer.toLowerCase().indexOf("viewsearchengine.aspx") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabAllSources').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
        }
        else if (document.referrer.toLowerCase().indexOf("sourceanalytics.aspx") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabAllSources').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
        }
        else if (document.referrer.toLowerCase().indexOf("searchreferringtraffic.aspx") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabReferral').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
        }
        else if (document.referrer.toLowerCase().indexOf("searchtraffic.aspx") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabSearch').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
        }
        else if (document.referrer.toLowerCase().indexOf("socialsources.aspx") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabSocialSources').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
        }
        else if (document.referrer.toLowerCase().indexOf("referringtraffic.aspx") > -1) {
            $('#Traff').css('display', 'block');
            $('#tabSocialSources').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
        }
    }





    // 1st Menu Tab...........................


    if (window.location.href.toLowerCase().indexOf("home") > -1) {
        $('#dash').css('display', 'block');
        $('#tabOverview').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("visits") > -1) {
        $('#dash').css('display', 'block');
        $('#tabVisits').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }

    else if (window.location.href.toLowerCase().indexOf("newrepeat.aspx") > -1) {
        $('#dash').css('display', 'block');
        $('#tabNewvsRepeat').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("newrepeatview.aspx") > -1) {
        $('#dash').css('display', 'block');
        $('#tabNewvsRepeat').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("trendsvisittimeonsite.aspx") > -1) {
        $('#dash').css('display', 'block');
        $('#tabTimeonSite').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("mapoverlay.aspx") > -1) {
        $('#dash').css('display', 'block');
        $('#tabCountries').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("visituniquescountry.aspx") > -1) {
        $('#dash').css('display', 'block');
        $('#tabCountries').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("locationviewall.aspx") > -1 && window.location.href.toLowerCase().indexOf("type=country") > -1) {
        $('#dash').css('display', 'block');
        $('#tabCountries').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("type=country") > -1) {
        $('#dash').css('display', 'block');
        $('#tabCountries').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("machineidactive.aspx") > -1) {
        $('#dash').css('display', 'block');
        $('#tabOverview').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }


    // 2st Menu Tab...........................
    alert(window.location.href.toLowerCase());
    if (window.location.href.toLowerCase().indexOf("visitorsloyalty.aspx") > -1) {
        $('#Audi').css('display', 'block');
        $('#tabVisitors').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("usertrackingdetails.aspx") > -1) {
        $('#Audi').css('display', 'block');
        $('#tabVisitors').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
        //    else if (window.location.href.toLowerCase().indexOf("visitorloyalty.aspx") > -1) {
        //        $('#Audi').css('display', 'block');
        //        $('#tabVisitors').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
        //    }
    else if (window.location.href.toLowerCase().indexOf("browsers") > -1) {
        $('#Audi').css('display', 'block');
        $('#tabBrowser').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("frequency.aspx") > -1) {
        $('#Audi').css('display', 'block');
        $('#tabFrequency').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("recency.aspx") > -1) {
        $('#Audi').css('display', 'block');
        $('#tabRecency').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("page=location") > -1) {
        $('#Audi').css('display', 'block');
    }
    else if (window.location.href.toLowerCase().indexOf("page=language") > -1) {
        $('#Audi').css('display', 'block');
    }
    else if (window.location.href.toLowerCase().indexOf("page=devices") > -1) {
        $('#Audi').css('display', 'block');
        $('#tabOverview').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("page=network") > -1) {
        $('#Audi').css('display', 'block');
        $('#tabOverview').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("location.aspx") > -1) {
        $('#Audi').css('display', 'block');
        $('#tabCities').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("visituniquescity.aspx") > -1) {
        $('#Audi').css('display', 'block');
        $('#tabCities').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("network.aspx") > -1) {
        $('#Audi').css('display', 'block');
        $('#tabNetwork').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }

    else if (window.location.href.toLowerCase().indexOf("locationviewall") > -1 && window.location.href.toLowerCase().indexOf("type=city") > -1) {
        $('#Audi').css('display', 'block');
        $('#tabCities').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }

    else if (window.location.href.toLowerCase().indexOf("devices.aspx") > -1) {
        $('#Audi').css('display', 'block');
        $('#tabDevices').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("devicesall.aspx") > -1) {
        $('#Audi').css('display', 'block');
        $('#tabDevices').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("visituniquedevices.aspx") > -1) {
        $('#Audi').css('display', 'block');
        $('#tabOverview').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }

    else if (window.location.href.toLowerCase().indexOf("type=time") > -1) {
        $('#Audi').css('display', 'block');
        $('#tabTimeSpend').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("type=depth") > -1) {
        pagetitle.innerHTML = "Page Depth";
        $('#Audi').css('display', 'block');
        $('#tabPageDepth').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("recencyrepeat.aspx") > -1) {
        $('#Audi').css('display', 'block');
        $('#tabRecencyReturning').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    // 3rd Menu Tab...........................

    if (window.location.href.toLowerCase().indexOf("sourceanalytics.aspx") > -1) {
        $('#Traff').css('display', 'block');
        $('#tabAllSources').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("viewsearchengine.aspx") > -1) {
        $('#Traff').css('display', 'block');
        $('#tabAllSources').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("searchkeys.aspx") > -1) {
        $('#Traff').css('display', 'block');
        $('#tabSearch').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (document.referrer.toLowerCase().indexOf("searchkeys.aspx") > -1 && window.location.href.toLowerCase().indexOf("viewsearchip.aspx") > -1) {
        $('#Traff').css('display', 'block');
        $('#tabSearch').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (document.referrer.toLowerCase().toLowerCase().indexOf("searchsourcepages.aspx") > -1) {
        $('#Traff').css('display', 'block');
        $('#tabAllSources').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("searchsourcepages.aspx") > -1) {
        $('#Traff').css('display', 'block');
        $('#tabSearch').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("searchreferringtraffic.aspx") > -1) {
        $('#Traff').css('display', 'block');
        $('#tabReferral').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("referencesourcepages.aspx") > -1) {
        $('#Traff').css('display', 'block');
        $('#tabReferral').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("viewsearchiprefer.aspx") > -1) {
        $('#Traff').css('display', 'block');
        $('#tabReferral').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("searchtraffic.aspx") > -1) {
        $('#Traff').css('display', 'block');
        $('#tabSearch').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("searchkeys.aspx") > -1) {
        $('#Traff').css('display', 'block');
        $('#tabSearch').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("referringtraffic.aspx") > -1) {
        $('#Traff').css('display', 'block');
        $('#tabAllSources').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("paidcampaigns.aspx") > -1 || window.location.href.toLowerCase().indexOf("paidcampaignsrepeat.aspx") > -1) {
        $('#Traff').css('display', 'block');
        $('#tabPaidCampaigns').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("visituniquestraffic.aspx") > -1) {
        $('#Traff').css('display', 'block');
        $('#tabPaidCampaigns').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("socialsources.aspx") > -1) {
        $('#Traff').css('display', 'block');
        $('#tabSocialSources').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("visitorsflow.aspx") > -1) {
        $('#Traff').css('display', 'block');
        $('#tabVisitorFlows').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("attributionalmodel.aspx") > -1) {
        $('#Traff').css('display', 'block');
        $('#tabAttributionModel').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("attributionalmodelview.aspx") > -1) {
        $('#Traff').css('display', 'block');
        $('#tabAttributionModel').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }




    // 4th Menu Tab...........................
    //need to change......
    if (window.location.href.toLowerCase().indexOf("toppagetest.aspx") > -1) {
        $('#Cont').css('display', 'block');
        $('#tabPopularPages').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("popularpage.aspx") > -1) {
        $('#Cont').css('display', 'block');
        $('#tabPopularPages').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("pageperformance.aspx") > -1 || window.location.href.toLowerCase().indexOf("pageperformanceviewall.aspx") > -1) {
        $('#Cont').css('display', 'block');
        $('#tabPageAnalysis').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("searchkeysforpage.aspx") > -1) {
        $('#Cont').css('display', 'block');
        $('#tabPageAnalysis').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("pageperformanceuniques.aspx") > -1) {
        $('#Cont').css('display', 'block');
        $('#tabPageAnalysis').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("contententrypages.aspx") > -1) {
        $('#Cont').css('display', 'block');
        $('#tabTopEntryPages').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("visituniquesentryexit.aspx") > -1 && window.location.href.toLowerCase().indexOf("type=entry") > -1) {
        $('#Cont').css('display', 'block');
        $('#tabTopEntryPages').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("contententryexitpagedetails.aspx") > -1 && window.location.href.toLowerCase().indexOf("type=entry") > -1) {
        $('#Cont').css('display', 'block');
        $('#tabTopEntryPages').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("contentexitpages.aspx") > -1) {
        $('#Cont').css('display', 'block');
        $('#tabTopExitPages').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("visituniquesentryexit.aspx") > -1 && window.location.href.toLowerCase().indexOf("type=exit") > -1) {
        $('#Cont').css('display', 'block');
        $('#tabTopExitPages').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("contententryexitpagedetails.aspx") > -1 && window.location.href.toLowerCase().indexOf("type=exit") > -1) {
        $('#Cont').css('display', 'block');
        $('#tabTopExitPages').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("eventtracking.aspx") > -1 || window.location.href.toLowerCase().indexOf("eventtrackinginput.aspx") > -1 || window.location.href.toLowerCase().indexOf("anchorclicktrack.aspx") > -1 || window.location.href.toLowerCase().indexOf("anchorclickuniqueip") > -1 || window.location.href.toLowerCase().indexOf("wheniflytrack.aspx") > -1 || window.location.href.toLowerCase().indexOf("wheniflyuniques.aspx") > -1) {
        $('#Cont').css('display', 'block');
        $('#tabEventTracking').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("eventtrackingip.aspx") > -1) {
        $('#Cont').css('display', 'block');
        $('#tabEventTracking').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("heatmap.aspx") > -1) {
        $('#Cont').css('display', 'block');
        $('#tabHeatMaps').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    // 5th Menu Tab...........................

    if (window.location.href.toLowerCase().indexOf("goal.aspx") > -1 || window.location.href.toLowerCase().indexOf("goalcreate.aspx") > -1 || window.location.href.toLowerCase().indexOf("goalview.aspx") > -1 || window.location.href.toLowerCase().indexOf("reversegoalview.aspx") > -1) {
        $('#Conv').css('display', 'block');
        $('#tabGoals').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("transactiondetails.aspx") > -1) {
        $('#Conv').css('display', 'block');
        $('#tabTransactions').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("transactionperformanceproductwise.aspx") > -1) {
        $('#Conv').css('display', 'block');
        $('#tabProductPerformance').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("visituniquestran.aspx") > -1 && document.referrer.toLowerCase().indexOf("transactionperformanceproductwise.aspx") > -1) {
        $('#Conv').css('display', 'block');
        $('#tabProductPerformance').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("visituniquestran.aspx") > -1 && document.referrer.toLowerCase().indexOf("transactionperformancesaleswise.aspx") > -1) {
        $('#Conv').css('display', 'block');
        $('#tabSalePerformance').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("transactionperformancesaleswise.aspx") > -1) {
        $('#Conv').css('display', 'block');
        $('#tabSalePerformance').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("cohortanalysisview.aspx") > -1 || window.location.href.toLowerCase().indexOf("cohortsmonthinfo.aspx") > -1) {
        $('#Conv').css('display', 'block');
        $('#tabCohortAnalysis').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    // 6th Menu Tab...........................

    if (window.location.href.toLowerCase().indexOf("managesources.aspx") > -1) {
        $('#Cust').css('display', 'block');
        $('#tabManageScores').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("createcustom.aspx") > -1) {
        $('#Cust').css('display', 'block');
        $('#tabCustomReporting').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }
    else if (window.location.href.toLowerCase().indexOf("customreportmanage.aspx") > -1 || window.location.href.toLowerCase().indexOf("customreportview.aspx") > -1) {
        $('#Cust').css('display', 'block');
        $('#tabMyReports').css('background-image', 'url(' + cdnpath + 'tbbg.png)');
    }

    $("#firstpane p.menu_head").click(function () {
        $(this).css({ backgroundImage: "url(down.png)" }).next("div.menu_body").slideToggle(300).siblings("div.menu_body").slideUp("slow");
    });


});


$.urlParam = function (name) {
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (!results) {
        return 0;
    }
    return results[1] || 0;
};

//show lead count on lead Tab..........
GetNewLeadCount();
function GetNewLeadCount() {

    var adsId = $("#hdn_AdsId").val();
    var url = "Handler/NewLeadNotification.ashx?AdsId=" + adsId + "";
    $.getJSON(url, function (json) {
        if (json != undefined && json != null)
            if (json > 0) {
                $("#spLeadNotification").html(json);
                $("#spLeadNotification").attr("class", "LeadNotificationAlert");
            } else {
                $("#spLeadNotification").html("");
                $("#spLeadNotification").attr("class", "");
            }
    });
}

//show and hide left menu..........

$(document).ready(function () {

    $("#dvExpend").toggle(
                function () {
                    $(this).css('left', '0px');
                    $('#dvMainMenu').hide('slow');
                },
                function () {
                    $(this).css('left', '190px');
                    $('#dvMainMenu').show('slow');
                }
            );

});

var moveMenu = function () {
    var windowPosition = $(window).scrollTop();
    var dvExpend = $("#dvExpend");
    if (windowPosition > 128) {
        dvExpend.css({ marginTop: "0px" });
    }
};
document.onscroll = function () {
    $("#dvExpend").css({ 'height': $("#dvControlPanel").height() + 10 + 'px' });
};

//...................
function OpenNewWindow(getvalue) {
    window.open(getvalue, 'newwindow')
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
    if (window.location.href.toLowerCase().indexOf("visits.aspx") > -1) {
        compare = "<div style='float: left'>" +
            "<input id='chk_Compare' type='checkbox' disabled='disabled'/>Compare</div>" +
            "<select id='drp_Compare' class='txtdate' style='margin-right: 10px; margin-left: 10px;float: left; width: 105px; height: 1.8em' disabled='disabled'>" +
            "<option selected='selected' value='Session'>Sessions</option>" +
            "<option value='Uniques'>Unique Visits</option>" +
            " </select>";
    }
    else if (window.location.href.toLowerCase().indexOf("newrepeat.aspx") > -1) {
        compare = "<div style='float: left'>" +
            "<input id='chk_Compare' type='checkbox' disabled='disabled'/>Compare</div>" +
            "<select id='drp_Compare' class='txtdate' style='margin-right: 10px; margin-left: 10px;float: left; width: 105px; height: 1.8em' disabled='disabled'>" +
            "<option selected='selected' value='New'>New Visitors</option>" +
            "<option value='Repeat'>Repeat Visitors</option>" +
            " </select>";
    }
    else if (window.location.href.toLowerCase().indexOf("sourceanalytics.aspx") > -1) {
        compare = "<div style='float: left'>" +
            "<input id='chk_Compare' type='checkbox' disabled='disabled'/>Compare</div>" +
            "<select id='drp_Compare' class='txtdate' style='margin-right: 10px; margin-left: 10px;float: left; width: 105px; height: 1.8em' disabled='disabled'>" +
            "<option selected='selected' value='Direct'>Direct Traffic</option>" +
            "<option value='Search'>Search Traffic</option>" +
            "<option value='Refer'>Refer Traffic</option>" +
            " </select>";
    }
    else if (window.location.href.toLowerCase().indexOf("transactionperformanceproductwise.aspx") > -1) {
        compare = "<div style='float: left'>" +

        "<select id='ddlpro'  class='txtdate' style='margin-right: 10px; margin-left: 10px;float: left; width: 105px; height: 1.8em'>" +
            "<option selected='selected' value='0'>Select Product</option>" +

            " </select>";
    }
    else if (window.location.href.toLowerCase().indexOf("transactionperformancesaleswise.aspx") > -1) {
        compare = "<div style='float: left'>" +
        "<select id='ddlpro'  class='txtdate' style='margin-right: 10px; margin-left: 10px;float: left; width: 105px; height: 1.8em'>" +
            "<option selected='selected' value='0'>Select Product</option>" +
            " </select>";
    }
    var filter = "<div style='float: left;height:30px;'><input type='text' onfocus='showCalendarControl(this);' placeholder='From Date' readonly='readonly' class='txtdate' id='txtDateFrom' style='float: left' /><div style='float: left; padding: 2px;'>-</div>" +
        "<input onfocus='showCalendarControl(this);' placeholder='To Date' readonly='readonly' style='float: left' type='text' class='txtdate' id='txtDateTo' /></div>" +
        "<div style='font-size: 12px;' class='chk'>" + compare + "" +
        "<div style='float: left;'>" +
        "<input type='checkbox' id='chk_Maintain'  disabled='disabled' />Maintain</div>" +
        "<div style='float: left; margin-left: 17px;'>" +
        "<input id='btnGo' type='button' class='inputeedate' style='width: 20px; height: 21px; padding: 0px'value='Go' onclick='Report(5);' disabled='disabled'/>" +
        "</div>";
    return filter;
};


//close custome filter out side the

$(document).click(function (e) {
    if (window.location.href.toLowerCase().indexOf("home.aspx") < 0 && window.location.href.toLowerCase().indexOf("visitorsloyalty.aspx") < 0 && window.location.href.toLowerCase().indexOf("/referringtraffic.aspx") < 0 && window.location.href.toLowerCase().indexOf("usertrackingdetails.aspx") < 0 && window.location.href.toLowerCase().indexOf("eventtrackinginput.aspx") < 0 && window.location.href.toLowerCase().indexOf("createcustom.aspx") < 0) {
        var container = $("#dvCustomFilter");
        var dateObject = $("#CalendarControl");
        if (!container.is(e.target) && container.has(e.target).length === 0 && !dateObject.is(e.target) && dateObject.has(e.target).length === 0) {
            container.hide();
            hideCalendarControl();
        }
    }
});
$(document).ready(function () {
    $("#lnkFilter").click(function (event) {
        event.stopPropagation();
    });
});

//Bind Time Duration..................

getDefaultDuration = function () {

    var Duration = "<div style='float: left;'>" +
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

getPrintExport = function (getPageName, print, viewall, recordsperPage) {
    var getViewAll = "", record = "", AddGroup = "";
    if (viewall == 1) {
        getViewAll = "<div style='float: left; margin-left: 5px;'>" +
            "<a href='#' class='info' id='lnkViewall'>" +
            "<img src='" + cdnpath + "viewall.png' border='0' /><span style='width: 60px; right: -0px;top: 13px;'>View All</span></a></div>";
    }
    var getPrint = "";
    if (print == 1) {
        getPrint = "<div style='float: left; margin-left: 5px;'>" +
            "<a href='javascript:void(0)' class='info' style='background-color: Transparent; float: left' rel='" + getPageName + "' id='btnPrint'>" +
            "<img src='" + cdnpath + "Print.png' border='0' /><span style='width: 40px; left: -10px; top: 30px;'>Print</span></a>" +
            "</div>";
    }


    if (recordsperPage != null && recordsperPage == 1) {///Records per page

        record = "<div class='chk' style='float: left; margin-left: 5px;margin-top: 6px;'>Records per Page</span><select class='chk' id='drp_RecordsPerPage' onchange='fn_ChangeRecordsPerPage()'>" +
            "<option value='20' selected='selected'>20</option>" +
            "<option value='30'>30</option>" +
            "<option value='40'>40</option>" +
            "<option value='50'>50</option>" +
            "<option value='100'>100</option>" +
             "<option value='All'>All</option>" +
        "</select></div>";
    }

    var PrintExport = "" + record + AddGroup + getPrint + "<div style='float: left; margin-left: 5px;'>" +
        "<a href='javascript:void(0)' class='info' style='background-color: Transparent; float: left' rel='" + getPageName + "' id='btnExport'>" +
        "<img src='" + cdnpath + "excel.png' border='0' /><span style='width: 80px; left: -60px; top: 30px;'>Export as XLS</span></a>" +
        "</div>" + getViewAll + "";

    return PrintExport;
};

//report a problem.............................
$(function () {
    $("#btnReportProb").click(function () {
        // Print the DIV.
        $("#dvReportList").css("display", "block");
       
    });
});



//print.............................


$(function () {
    $("#btnPrint").click(function () {
        // Print the DIV.
        $("#divcontent").print();
        return (false);
    });
});


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
    objDoc.write("</title><link href='http://localhost:50895/images/AllStyles.css' rel='stylesheet' type='text/css'>");
    objDoc.write(jStyleDiv.html() + "</head>" + this.html() + "</body></html>");
    objDoc.close();

    objFrame.focus();
    objFrame.print();

    setTimeout(function () { jFrame.remove(); }, (60 * 1000));
};

//mouse over on top menu(home,lead,engauge..)............................

function mouseover(obj) {
    obj.style.color = "#587915";
}
function mouseout(obj) {
    obj.style.color = "#fff";
}


//export to xls.............................

$(document).ready(function () {

    $("#btnExport").click(function () {

        var FileName = $(this).attr('rel').replace(/ /g, '');
        var data = $("#dvExport").html();
        data = escape(data);
        $('body').prepend("<form method='post' action='exporttoxls.aspx?File=" + FileName + "' style='top:-3333333333px;' id='tempForm'><input type='hidden' name='data' value='" + data + "' ></form>");
        $('#tempForm').submit();
        $("tempForm").remove();
        return false;

    });


});

//Check filter settings....................

function CheckFilter(duration) {

    var fromdate = '', todate = '', compare = 0, compareOption = '', maintain = 0;
    if (duration == 5) {
        fromdate = $('#txtDateFrom').val();
        todate = $('#txtDateTo').val();
        if ($('#chk_Maintain').attr('checked'))
            maintain = 1;
        else
            maintain = 0;

        if (fromdate == '' || fromdate == null || fromdate == 'From Date' || todate == '' || todate == null || todate == 'To Date')
            return;
        if ($('#chk_Compare').attr('checked')) {
            compare = 1;
            compareOption = $('#drp_Compare').val();
        }
    }
    else if (duration == 6) {///Maintain
        duration = 5;
        maintain = 1;
        fromdate = $("#hdFromDate").val().substring(0, 10);
        todate = $("#hdTodate").val().substring(0, 10);
        $('#txtDateFrom').val(fromdate);
        $('#txtDateTo').val(todate);
        $('#chk_Maintain').attr('checked', true);

    }
    var startEndDates = BindDate(duration, fromdate, todate);
    fromdate = startEndDates[0];
    todate = startEndDates[1];
    var result = [fromdate, todate, compare, compareOption, maintain];

    return (result);
}

//Bind selected date(@ 13-2-2014) duration in header........

function BindDate(dur, frm, to) {
    var a = new Date(), b = new Date(), startdate = '', enddate = '';
    switch (dur) {
        case 1:
            window.lblDate.innerHTML = a.getDate() + ' ' + GetMonthName(a.getMonth() + 1) + ' ' + a.getFullYear();
            startdate = (a.getMonth() + 1) + '/' + a.getDate() + '/' + a.getFullYear() + " 00:00:00.000";
            enddate = (a.getMonth() + 1) + '/' + a.getDate() + '/' + a.getFullYear() + " 23:59:59.000";
            break;
        case 2:
            b.setDate(a.getDate() - 6);
            window.lblDate.innerHTML = b.getDate() + ' ' + GetMonthName(b.getMonth() + 1) + ' ' + b.getFullYear() + ' - ' + a.getDate() + ' ' + GetMonthName(a.getMonth() + 1) + ' ' + a.getFullYear();
            startdate = (b.getMonth() + 1) + '/' + b.getDate() + '/' + b.getFullYear() + " 00:00:00.000";
            enddate = (a.getMonth() + 1) + '/' + a.getDate() + '/' + a.getFullYear() + " 23:59:59.000";
            break;
        case 3:
            b.setMonth(a.getMonth() - 1);
            b.setDate(b.getDate() + 1);
            window.lblDate.innerHTML = (b.getDate()) + ' ' + GetMonthName(b.getMonth() + 1) + ' ' + b.getFullYear() + ' - ' + a.getDate() + ' ' + GetMonthName(a.getMonth() + 1) + ' ' + a.getFullYear();
            startdate = (b.getMonth() + 1) + '/' + b.getDate() + '/' + b.getFullYear() + " 00:00:00.000";
            enddate = (a.getMonth() + 1) + '/' + a.getDate() + '/' + a.getFullYear() + " 23:59:59.000";
            break;
        case 4:
            b.setDate(a.getDate() - 365);
            window.lblDate.innerHTML = a.getDate() + ' ' + GetMonthName(a.getMonth() + 1) + ' ' + b.getFullYear() + ' - ' + a.getDate() + ' ' + GetMonthName(a.getMonth() + 1) + ' ' + a.getFullYear();
            startdate = (a.getMonth() + 1) + '/' + a.getDate() + '/' + b.getFullYear() + " 00:00:00.000";
            enddate = (a.getMonth() + 1) + '/' + a.getDate() + '/' + a.getFullYear() + " 23:59:59.000";
            break;
        case 5:
            a = new Date(frm);
            b = new Date(to);
            window.lblDate.innerHTML = a.getDate(frm) + ' ' + GetMonthName(a.getMonth(frm) + 1) + ' ' + a.getFullYear(frm) + ' - ' + b.getDate(to) + ' ' + GetMonthName(b.getMonth(to) + 1) + ' ' + b.getFullYear(to);
            startdate = (a.getMonth(frm) + 1) + '/' + a.getDate(frm) + '/' + a.getFullYear(frm) + " 00:00:00.000";
            enddate = (b.getMonth(to) + 1) + '/' + b.getDate(to) + '/' + b.getFullYear(to) + " 23:59:59.000";
            break;
        default:
            break;
    }
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


//Update from Admin...................

var AdsId = $.urlParam("AdsId");
var InnerDivhtml = "";
$(document).ready(function () {

    var url = 'Handler/GetMyNotifications.ashx?ProductName=Analytics&UserId=0&AdsId=' + AdsId + '&callback=?';
    $.getJSON(url, function (json) {
        $.each(json, function (i, p5) {
            var xmlDoc = $.parseXML(p5.GetUpdates);
            var xml = $(xmlDoc);
            var Table = xml.find("Table");

            $.each(Table, function () {
                var Getpagenames = $(this).find("P5ShowonUrl").text().split(",");
                if (Getpagenames != "") {
                    for (var i in Getpagenames) {
                        if (window.location.href.toLowerCase().indexOf(Getpagenames[i].toLowerCase()) > -1) {
                            InnerDivhtml += "<p>" + $(this).find("Updates").text() + "</p>";
                        }
                    }
                }
                else {
                    InnerDivhtml += "<p>" + $(this).find("Updates").text() + "</p>";
                }
            });


        });
        if (InnerDivhtml != "") {
            var dvUpdatePopUp = document.createElement("div");
            dvUpdatePopUp.innerHTML = "<div id='dvUpdateMain' class='dvUpdateMain'> <div class='dvUpdateheading' onclick=\"javascript:$('#dvUpdateContent').toggle();\">Update</div>" +
                                "<div id='dvUpdateContent' style='padding: 10px;padding-top: 0px;' >" +
                                "" + InnerDivhtml + "" +
                                "</div></div>";
            document.body.appendChild(dvUpdatePopUp);
        }
    });

});


function fn_AverageTime(Desc) {
    var secnew = 0;
    var seconds = 0, days = 0, hours = 0, minutes = 0;
    var total = '';
    if (Desc != "undefined" && Desc != "") {
        seconds = parseInt(Desc);
        days = Math.round(seconds / 86400);
        hours = Math.round((seconds / 3600) - (days * 24));
        minutes = Math.round((seconds / 60) - (days * 1440) - (hours * 60));
        secnew = Math.round(seconds - (days * 86400) - (hours * 3600) - (minutes * 60));
    }
    if (days == 0 && hours == 0 && minutes == 0 && secnew == 0)
        total = "less than a second";
    else
        total = Math.abs(days) + "d " + Math.abs(hours) + "h " + Math.abs(minutes) + "m " + Math.abs(secnew) + "s";
    return (total);
}

function ManageReport(action) {
    if (action == 0) {
        $("#dvReportList").hide();
    }
    else if (action == 1) {
        $("#dvReportList").show(1000);
    }
}