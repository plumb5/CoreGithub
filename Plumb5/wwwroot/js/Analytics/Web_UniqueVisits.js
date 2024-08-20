var xhr;
var KeyforCount = null, KeyforReport = null, ActionName = null, Parameter = null, Type = null;
var ExportFunction = null, SqlActionforCount = null, SqlActionforReport = null;
var online = $.urlParam("online").toString();
var TimeTrends = $.urlParam("TimeTrend").toString();
var country = decodeURIComponent($.urlParam("Country").toString().replace(/%20/g, " "));
var type = $.urlParam("Type").toString().replace(/%20/g, " ");
var domain = $.urlParam("domain").toString().replace(/%20/g, " ").replace('$', '?').replace(/~/g, '&');
var city = decodeURIComponent($.urlParam("City").toString().replace(/%20/g, " "));
var url = $.urlParam("Url").toString().replace(/%20/g, " ").replace('$', '?').replace(/~/g, '&').replace('^', '#');
var frequency = $.urlParam("Frequency").toString().replace(/%20/g, " ");
var recency = $.urlParam("Recency").toString().replace(/%20/g, " ");
var time = $.urlParam("Time").toString().replace(/%20/g, " ");
var depth = $.urlParam("Depth").toString().replace(/%20/g, " ");
var device = $.urlParam("Device").toString().replace(/%20/g, " ");
var network = decodeURIComponent($.urlParam("Network").toString().replace(/%20/g, " "));
var allsources = $.urlParam("AllSource").toString();
var refer = $.urlParam("Refer").toString().replace(/%20/g, " ").replace('$', '?').replace(/~/g, '&');
var adwords = $.urlParam("AdWords").toString().replace(/%20/g, " ").replace('$', '?').replace(/~/g, '&').replace('^', '#').replaceAll('@@@@', '&');
var adsense = $.urlParam("AdSense").toString().replace(/%20/g, " ").replace('$', '?').replace(/~/g, '&').replace('^', '#').replaceAll('@@@@', '&');;
var deviceid = $.urlParam("DeviceId").toString().replace(/%20/g, " ");
var utm = $.urlParam("UTM").toString().replace(/%20/g, " ").replace('$', '?').replace(/~/g, '&');
var search = $.urlParam("Search").toString().replace(/%20/g, " ").replace('$', '?').replace(/~/g, '&');
var social = $.urlParam("Social").toString().replace(/%20/g, " ").replace('$', '?').replace(/~/g, '&');
var source = $.urlParam("Source").toString();
var page = $.urlParam("PageName").toString().replace(/%20/g, " ").replace('$', '?').replace(/~/g, '&').replace('^', '#');
var entry = $.urlParam("Entry").toString().replace(/%20/g, " ").replace('$', '?').replace(/~/g, '&').replace('^', '#');
var exit = $.urlParam("Exit").toString().replace(/%20/g, " ").replace('$', '?').replace(/~/g, '&').replace('^', '#');
var pageanalysisdata = $.urlParam("pageanalysisdata").toString().replace(/%20/g, " ").replace('$', '?').replace(/~/g, '&').replace('^', '#').replaceAll('@@@@', '&');
var pageanalysisdevicetype = $.urlParam("pageanalysisdevicetype").toString();
var events = $.urlParam("Events").toString().replace(/%20/g, " ");
var product = $.urlParam("Product").toString() != 0 ? $.urlParam("Product").toString() : $.urlParam("Sales").toString();//For Product/Sales Performance
var productid = $.urlParam("ProductId").toString();
var key = $.urlParam("Key").toString().replace(/%20/g, " ").replace('$', '?').replace(/~/g, '&');

var fgoal = $.urlParam("FGoal").toString().replace(/%20/g, " ");
var goalId = $.urlParam("GoalId").toString();
var channel = $.urlParam("Channel").toString();
var Offline = $.urlParam("Offline").toString();
var FilterEmail = $.urlParam("FilterEmail").toString().replace(/%20/g, " ");
var FilterCity = $.urlParam("FilterCity").toString().replace(/%20/g, " ");
var FilterSessions = $.urlParam("FilterSessions").toString().replace(/%20/g, " ");
var duration = parseInt($.urlParam("dur"));
// *************Showing Data for Date Range Binding ********************
var From = $.urlParam("Frm").toString().replace(/%20/g, " ");
var To = $.urlParam("To").toString().replace(/%20/g, " ");


if (duration == 0) {
    $('#selectdateDropdown').text('Custom Date Range');
    $('.dateBoxWrap').addClass('showFlx');


    var dtFromDate = new Date(ConvertUTCDateTimeToLocal(From));
    var SelectedFromDate = ((dtFromDate.getMonth() + 1) < 10 ? '0' + (dtFromDate.getMonth() + 1) : (dtFromDate.getMonth() + 1)) + '/' + (dtFromDate.getDate() < 10 ? '0' + dtFromDate.getDate() : dtFromDate.getDate()) + '/' +
        dtFromDate.getFullYear();

    var dtToDate = new Date(ConvertUTCDateTimeToLocal(To));
    var SelectedToDate = ((dtToDate.getMonth() + 1) < 10 ? '0' + (dtToDate.getMonth() + 1) : (dtToDate.getMonth() + 1)) + '/' + (dtToDate.getDate() < 10 ? '0' + dtToDate.getDate() : dtToDate.getDate()) + '/' +
        dtToDate.getFullYear();

    $('#ui_txtStartDate').val(SelectedFromDate);
    $('#ui_txtEndDate').val(SelectedToDate);

}
else if (duration == 1) {
    $('#selectdateDropdown').text('Today');
}
else if (duration == 2) {
    $('#selectdateDropdown').text('This Week');
}
else if (duration == 3) {
    $('#selectdateDropdown').text('This Month');
}
if (duration == 5) {
    $('#selectdateDropdown').text('Custom Date Range');
    $('.dateBoxWrap').addClass('showFlx');

    var CustomFromDate = $.urlParam("Frm").toString().replace(/%20/g, " ");
    CustomFromDate = ConvertUTCDateTimeToLocal(CustomFromDate);
    var CustomdtFrom = new Date(CustomFromDate);
    CustomFromDate = (CustomdtFrom.getMonth() + 1 < 10 ? '0' + CustomdtFrom.getMonth() + 1 : CustomdtFrom.getMonth() + 1) + '/' + (CustomdtFrom.getDate() < 10 ? '0' + CustomdtFrom.getDate() : CustomdtFrom.getDate()) + '/' +
        CustomdtFrom.getFullYear();

    var CustomToDate = $.urlParam("To").toString().replace(/%20/g, " ");
    CustomToDate = ConvertUTCDateTimeToLocal(CustomToDate);
    var CustomdtTo = new Date(CustomToDate);
    CustomToDate = (CustomdtTo.getMonth() + 1 < 10 ? '0' + CustomdtTo.getMonth() + 1 : CustomdtTo.getMonth() + 1) + '/' + (CustomdtTo.getDate() < 10 ? '0' + CustomdtTo.getDate() : CustomdtTo.getDate()) + '/' +
        CustomdtTo.getFullYear();


    $('#ui_txtStartDate').val(CustomFromDate);
    $('#ui_txtEndDate').val(CustomToDate);

}


// *************Showing Data for Date Range Binding ********************


$(document).ready(function () {
    GetPageType();
    ExportFunctionName = ExportFunction; 
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    MaxUniqueVisitsCount();
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    GetReport();
}




function GetPageType() {
    ExportFunction = 'UniqueVisitsReportExport';
    if (type == 'new' && TimeTrends == 0) {//New Visitor
        $(".title").html("New Visitors");
        SqlActionforCount = 'NewVisitorCount';
        SqlActionforReport = 'NewVisitor';
    }
    else if (type == 'single') {//Single Visitor
        $(".title").html("Single Visitors");
        SqlActionforCount = 'SingleVisitorCount';
        SqlActionforReport = 'SingleVisitor';
    }
    else if (type == 'repeat') {//Repeat Visitor
        $(".title").html("Repeat Visitors");
        SqlActionforCount = 'RepeatVisitorCount';
        SqlActionforReport = 'RepeatVisitor';
    }
    else if (type == 'returning') {//Return Visitor
        $(".title").html("Returning Visitors");
        SqlActionforCount = 'ReturningVisitorCount';
        SqlActionforReport = 'ReturningVisitor';
    }
    else if (country != 0) {//Country
        country = country.charAt(0).toUpperCase() + country.slice(1);
        $("title").html('Unique Visitors - Country');
        $(".title").html("Unique Visitors - " + (country.length > 40 ? "<span title='" + country + "'>" + country.replace("^", "'").substring(0, 30) + "..</span>" : country.replace("^", "'")));
        Parameter = country;
        SqlActionforCount = 'CountryCount';
        SqlActionforReport = 'Country';
    }
    else if (city != 0) {//City
        city = city.charAt(0).toUpperCase() + city.slice(1);
        $("title").html('Unique Visitors - City');
        $(".title").html("Unique Visitors - " + (city.length > 40 ? "<span title='" + city + "'>" + city.replace("^", "'").substring(0, 30) + "..</span>" : city.replace("^", "'")));
        Parameter = city.replace("UNKNOWN", "");
        SqlActionforCount = 'CityCount';
        SqlActionforReport = 'City';
    }
    else if (time != 0) { //Time Spent
        $(".title").html("Unique Visitors - Time Spend(" + time + ")");
        Type = time.replace("secs", "").trim();
        SqlActionforCount = 'TimeCount';
        SqlActionforReport = 'Time';
    }
    else if (TimeTrends != 0) { //Time Trends
        Type = TimeTrends;
        if (TimeTrends == -1) {
            TimeTrendslbl = '12 AM';
            Type = 0;
        }
        else if (TimeTrends > 0 && TimeTrends <= 11) {
            TimeTrendslbl = TimeTrends + ' AM'
        }
        else if (TimeTrends == 12) {
            TimeTrendslbl = TimeTrends + ' PM'
        }
        else {
            TimeTrendslbl = (TimeTrends - 12) + ' PM'
        }
        if (type == 0) {
            $("title").html('Unique Visitors - Time Trends');
            $(".title").html("Unique Visitors - Time Trends (" + TimeTrendslbl + ")");
        }
        else {
            $("title").html('New Visitors - Time Trends');
            $(".title").html("New Visitors - Time Trends (" + TimeTrendslbl + ")");
            Parameter = type;

        }
        SqlActionforCount = 'TimeTrendsCount';
        SqlActionforReport = 'TimeTrends';
    }
    else if (frequency != 0) { //Frequency
        $(".title").html("Unique Visitors - Frequency(" + frequency + ")");
        Type = frequency;
        SqlActionforCount = 'FrequencyCount';
        SqlActionforReport = 'Frequency';
    }
    else if (recency != 0) { //Recency
        $(".title").html("Unique Visitors - Recency(" + (recency == -1 ? "Today" : (recency == 1 ? "1 day" : recency + " days")) + ")");
        Type = recency;
        SqlActionforCount = 'RecencyCount';
        SqlActionforReport = 'Recency';
    }
    else if (depth != 0) { //Page Depth
        $(".title").html("Unique Visitors - Page Depth(" + depth + ")");
        Type = depth;
        SqlActionforCount = 'DepthCount';
        SqlActionforReport = 'Depth';
    }
    else if (deviceid != 0) { //Device
        $(".title").html("Unique Visitors - Device(" + device + ")");
        Type = deviceid.trim();
        SqlActionforCount = 'DeviceCount';
        SqlActionforReport = 'Device';
    }
    else if (network != 0) { //Network
        network = network.charAt(0).toUpperCase() + network.slice(1);
        $(".title").html("Unique Visitors - Network(" + (network.length > 100 ? "<span title='" + network + "'>" + network.substring(0, 100) + "..</span>" : network) + ")");
        Type = network.trim();
        SqlActionforCount = 'NetworkCount';
        SqlActionforReport = 'Network';
    }
    else if (refer != 0 || search != 0 || social != 0) {
        var filter = (refer == 0 && search == 0 ? social : (refer == 0 && social == 0 ? search : (social == 0 && search == 0 ? refer : refer)));
        var filter1 = (refer == 0 && search == 0 ? "Social" : (refer == 0 && social == 0 ? "Search" : (social == 0 && search == 0 ? "Refer" : "Refer")));
        $(".title").html("Unique Visitors - " + filter1 + "(" + (filter.length > 100 ? "<span title='" + filter + "'>" + filter.substring(0, 100) + "..</span>" : filter) + ")")
        Type = filter;
        Parameter = page;
        SqlActionforCount = filter1 + "Count";
        SqlActionforReport = filter1;

    } else if (adwords != 0) {// Adwords
        adwords = adwords.charAt(0).toUpperCase() + adwords.slice(1);
        var m = adwords.length > 100 ? "<span title='" + adwords + "'>" + adwords.substring(0, 100) + "..</span>" : adwords;
        $(".title").html("Unique Visitors - AdWords(" + m + ")");
        Type = adwords;
        SqlActionforCount = "AdWordsCount";
        SqlActionforReport = "AdWords";
    }
    else if (adsense != 0) {//AdSense
        adsense = adsense.charAt(0).toUpperCase() + adsense.slice(1);
        var m = adsense.length > 100 ? "<span title='" + adsense + "'>" + adsense.substring(0, 100) + "..</span>" : adsense;
        $(".title").html("Unique Visitors - AdSense(" + m + ")");
        Type = adsense;
        SqlActionforCount = "AdSenseCount";
        SqlActionforReport = "AdSense";
    }
    else if (source != 0) {
        if (source == 'email')
            $(".title").html("Unique Visitors - Email Source");
        else if (source == 'sms')
            $(".title").html("Unique Visitors - SMS Source");
        else
            $(".title").html("Unique Visitors - " + source + "Source");
        Type = source;
        SqlActionforCount = source + "Count";
        SqlActionforReport = source;
    }
    else if (entry != 0) { //Top Entry Page
        entry = entry.charAt(0).toUpperCase() + entry.slice(1);
        $(".title").html("Unique Visitors - Entry Page(" + (entry.length > 100 ? "<span title='" + entry + "'>" + entry.substring(0, 100) + "..</span>" : entry) + ")");
        Type = entry.trim();
        SqlActionforCount = 'EntryCount';
        SqlActionforReport = 'Entry';
    }
    else if (exit != 0) { //Top Exit Page
        exit = exit.charAt(0).toUpperCase() + exit.slice(1);
        $(".title").html("Unique Visitors - Exit Page(" + (exit.length > 100 ? "<span title='" + exit + "'>" + exit.substring(0, 100) + "..</span>" : exit) + ")");
        Type = exit.trim();
        SqlActionforCount = 'ExitCount';
        SqlActionforReport = 'Exit';

    }
    else if (pageanalysisdata != 0) {// Page Analysis
        pageanalysisdata = pageanalysisdata.charAt(0).toUpperCase() + pageanalysisdata.slice(1);
        $(".title").html("Unique Visitors - Page Analysis(" + (pageanalysisdata.length > 100 ? "<span title='" + pageanalysisdata + "'>" + pageanalysisdata.substring(0, 100) + "..</span>" : pageanalysisdata) + ")");
        Type = pageanalysisdata.trim();
        Parameter = pageanalysisdevicetype;
        SqlActionforCount = 'PageAnalysisDataCount';
        SqlActionforReport = 'PageAnalysisData';
    }
    else if (events != 0) { // Event Tracking
        events = events.charAt(0).toUpperCase() + events.slice(1);
        $(".title").html("Unique Visitors - Events(" + (events.length > 100 ? "<span title='" + events + "'>" + events.substring(0, 100) + "..</span>" : events) + ")");
        Type = events.trim();
        Parameter = page.trim();
        SqlActionforCount = 'EventsCount';
        SqlActionforReport = 'Events';
    }
    else if (page != 0 && events == 0 && (key == 0 || key == undefined) && (channel != 0) && (refer == 0 && search == 0 && social == 0)) {//Popular Pages
        $(".title").html("Unique Visitors - Page(" + (page.length > 100 ? "<span title='" + page + "'>" + page.substring(0, 100) + "..</span>" : page) + ")");
        Type = page.trim();
        Parameter = channel;
        SqlActionforCount = 'PageNameCount';
        SqlActionforReport = 'PageName';

    }
    else if (type != 0 && page != 0) {
        $(".title").html("Returning Visitors - Page(" + (page.length > 22 ? "<span title='" + page + "'>" + page.substring(0, 22) + "..</span>" : page) + ")");
        Type = page.trim();
        Parameter = type;
        ExportFunction = 'UniqueVisitsReportPageFilterExport';
        ActionName = 'UniqueVisitsReportPageFilter';
        SqlActionforCount = 'PageNameCount';
        SqlActionforReport = 'PageName';

    }
  
    else if (allsources != 0) { //All Source
         if(allsources =='alldirect')
             $(".title").html("Unique Visitors - Direct Traffic");
         else if (allsources == 'allrefer')
            $(".title").html("Unique Visitors - Refer Traffic");
         else if (allsources == 'allsearch')
            $(".title").html("Unique Visitors - Search Traffic");
         else if (allsources == 'allsocial')
            $(".title").html("Unique Visitors - Social Traffic");
         else if (allsources == 'allemail')
            $(".title").html("Unique Visitors - Email Traffic");
         else if (allsources == 'allsms')
            $(".title").html("Unique Visitors - Sms Traffic");
         else if (allsources == 'allpaid')
             $(".title").html("Unique Visitors - Paid Traffic");
        Type = allsources;
        SqlActionforCount = allsources + "Count";
        SqlActionforReport = allsources;
    }
    else if (utm != 0) { //UTM Tags
        utm = utm.charAt(0).toUpperCase() + utm.slice(1);
        var m = utm.length > 100 ? "<span title='" + utm + "'>" + utm.substring(0, 100) + "..</span>" : utm;
        $(".title").html("Unique Visitors - UTM(" + m + ")");
        Type = utm;
        SqlActionforCount = "UTMCount";
        SqlActionforReport = "UTM";
    }
    
    else if (adsense != 0) {//AdSense
        adsense = adsense.charAt(0).toUpperCase() + adsense.slice(1);
        var m = adsense.length > 100 ? "<span title='" + adsense + "'>" + adsense.substring(0, 100) + "..</span>" : adsense;
        $(".title").html("Unique Visitors - AdSense(" + m + ")");
        Type = adsense;
        SqlActionforCount = "AdSenseCount";
        SqlActionforReport = "AdSense";
    }
    else if (domain != 0 && key != 0 && type != 0) {
        $(".title").html("Unique Visitors - Source");
        Type = domain;
        Parameter = key;
        ExportFunction = 'UniqueVisitsSourceWithPageExport';
        ActionName = 'UniqueVisitsSourceWithPage';
        SqlActionforCount = "SourceWithPageCount";
        SqlActionforReport = "SourceWithPage";
    }
    else if (domain != 0) {
        domain = domain.charAt(0).toUpperCase() + domain.slice(1);
        key = $.urlParam("Key").toString().replace(/%20/g, " ");
        $(".title").html("Unique Visitors - Source(" + (domain.length > 20 ? "<span title='" + domain + "'>" + domain.substring(0, 20) + "..</span>" : domain) + ") - Key(" + (key.length > 10 ? "<span title='" + key + "'>" + key.substring(0, 10) + "..</span>" : key) + ")");
        Type = domain;
        Parameter = key;
        ExportFunction = 'UniqueVisitsSearchKeyExport';
        ActionName = 'UniqueVisitsSearchKey';
        SqlActionforCount = "SearchKeyCount";
        SqlActionforReport = "SearchKey";

    }
    else if (url != 0 && city != 0) { //Page Analysis
        city = city.charAt(0).toUpperCase() + city.slice(1)
        $(".title").html("Unique Visitors - " + (city.length > 40 ? "<span title='" + city + "'>" + city.replace("^", "'").substring(0, 30) + "..</span>" : city.replace("^", "'")) + " (" + (url.length > 25 ? "<span title='" + url + "'>" + url.substring(0, 25) + "..</span>" : url) + ")");
        Type = url;
        Parameter = city.replace("UNKNOWN", "");
        SqlActionforCount = "PageAnalysisCount";
        SqlActionforReport = "PageAnalysis";
    }
    else { // Session
        $(".title").html("Unique Visitors");
        Type = null;
        Parameter = null;
        SqlActionforCount = null;
        SqlActionforReport = 'Others';
    }
    //var duration = parseInt($.urlParam("dur"));
    //if (duration == 0) {
    //    var fromdate = $.urlParam("Frm").toString().replace(/%20/g, " ");
    //    var todate = $.urlParam("To").toString().replace(/%20/g, " ");

    //    fromdate = ConvertDateTimeToUTC(fromdate);
    //    FromDateTime = fromdate.getFullYear() + '-' + PrefixZero((fromdate.getMonth() + 1)) + '-' + PrefixZero(fromdate.getDate()) + " " + PrefixZero(fromdate.getHours()) + ":" + PrefixZero(fromdate.getMinutes()) + ":" + PrefixZero(fromdate.getSeconds());

    //    todate = ConvertDateTimeToUTC(todate);
    //    ToDateTime = todate.getFullYear() + '-' + PrefixZero((todate.getMonth() + 1)) + '-' + PrefixZero(todate.getDate()) + " " + PrefixZero(todate.getHours()) + ":" + PrefixZero(todate.getMinutes()) + ":" + PrefixZero(todate.getSeconds());
    //}
    //else {
    //    FromDateTime = $.urlParam("Frm").toString().replace(/%20/g, " ");
    //    ToDateTime = $.urlParam("To").toString().replace(/%20/g, " ");

    //}
    FromDateTime = $.urlParam("Frm").toString().replace(/%20/g, " ");
    ToDateTime = $.urlParam("To").toString().replace(/%20/g, " ");
    MaxUniqueVisitsCount();
}

function ChangeDateFormat(dateString) {
    var JavaScriptDateTimeparam;
    if (dateString.indexOf("T") > -1) {
        var dbDateparam = dateString.split('T');
        var yearparam = dbDateparam[0].split('-');
        var timeparam = dbDateparam[1].split(':');
        var milSec = 0;
        if (timeparam[2].toString().indexOf(".") > 0) {
            milSec = timeparam[2].split('.');
        } else {
            milSec = timeparam[2].split('+');
        }
        JavaScriptDateTimeparam = new Date(yearparam[0], yearparam[1] - 1, yearparam[2], timeparam[0], timeparam[1], milSec[0]);
    }
    return JavaScriptDateTimeparam;
}

function MaxUniqueVisitsCount() {
    
    if (SqlActionforCount == 'DeviceCount')
        GetDeviceMaxUniqueVisitsCount();
    else
        GetMaxUniqueVisitsCount();
  
}
function GetMaxUniqueVisitsCount() {
    ShowPageLoading();
    xhr =$.ajax({
        url: "/Analytics/Uniques/UniqueVisitsReportMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'start': OffSet, 'end': FetchNext, 'type': Type, 'parameter': Parameter, 'action': SqlActionforCount }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
                $.each(response.Table1, function () {
                    TotalRowCount = this.TotalRows;
                });
            }

            if (TotalRowCount > 0) {
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}
function GetReport() {
    ShowPageLoading();
    FetchNext = GetNumberOfRecordsPerPage();
    var actionmethodforReport = '';
    if (SqlActionforReport == 'Device')
        actionmethodforReport = 'DeviceUniqueVisitsReport'
    else
        actionmethodforReport = 'UniqueVisitsReport';

    xhr =$.ajax({
        url: "/Analytics/Uniques/" + actionmethodforReport + "",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'start': OffSet, 'end': FetchNext, 'Type': Type, 'parameter': Parameter, 'action': SqlActionforReport }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (SqlActionforReport == 'Device') {
                ShowPageLoading();
                BindDeviceReport(response);
            }

            else {
                ShowPageLoading(); 
                BindReport(response);
            }
        },
        error: ShowAjaxError
    });

}
function BindReport(response) {
    ShowPageLoading();
    SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {

        CurrentRowCount = response.Table1.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);


        var reportTableTrs, dateparam;
        $.each(response.Table1, function () {
            if (TimeTrends == 0)
                dateparam = $.datepicker.formatDate("M dd yy", ConvertUTCDateTimeToLocal(this.Recency)) + " " + PlumbTimeFormat(ConvertUTCDateTimeToLocal(this.Recency));
            else if (TimeTrends != 0 && type == 0)
                dateparam = $.datepicker.formatDate("M dd yy", ChangeDateFormat(this.Recency)) + " " + PlumbTimeFormat(ChangeDateFormat(this.Recency));
            else if (TimeTrends != 0 && type == 'new')
                dateparam = $.datepicker.formatDate("M dd yy", ChangeDateFormat(this.Recency)) + " " + PlumbTimeFormat(ChangeDateFormat(this.Recency));

            reportTableTrs += "<tr>" +
                "<td><div class='nameWrap'><div class='nameAlpWrap'><span class='nameAlpha' onclick='ShowContactUCP(\"" + this.MachineId + "\",null,null)'>V</span></div><div class='nameTxtWrap'><span class='nameTxt'>" + this.Visitor + "</td>" +
                "<td>" + this.City + "</td>" +
                "<td>" + this.Session + "</td>" +
                "<td>" + dateparam + "</td>" +
                "<td>" + fn_AverageTime(this.AvgTime) + "</td>" +
                "</tr>";
        });

        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowPagingDiv(true);
        ShowExportDiv(true);
    }
    else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
}

function GetDeviceMaxUniqueVisitsCount() {
    if (Type == 'unknown')
        Type = '';
    xhr = $.ajax({
        url: "/Analytics/Uniques/DeviceUniqueVisitsReportMaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'start': OffSet, 'end': FetchNext, 'DeviceId': Type}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = 0;
            if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
                $.each(response.Table1, function () {
                    TotalRowCount = this.TotalRows;
                });
            }

            if (TotalRowCount > 0) {
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}
function BindDeviceReport(response) {
    SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
    if (response != undefined && response != null ) {

        CurrentRowCount = response.MLDeviceUniqueVisits.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);


        var reportTableTrs, dateparam;
        $.each(response.MLDeviceUniqueVisits, function () {
            if (TimeTrends == 0)
                dateparam = $.datepicker.formatDate("M dd yy", ConvertUTCDateTimeToLocal(this.Recency)) + " " + PlumbTimeFormat(ConvertUTCDateTimeToLocal(this.Recency));
            else if (TimeTrends != 0 && type == 0)
                dateparam = $.datepicker.formatDate("M dd yy", ChangeDateFormat(this.Recency)) + " " + PlumbTimeFormat(ChangeDateFormat(this.Recency));
            else if (TimeTrends != 0 && type == 'new')
                dateparam = $.datepicker.formatDate("M dd yy", ChangeDateFormat(this.Recency)) + " " + PlumbTimeFormat(ChangeDateFormat(this.Recency));

            reportTableTrs += "<tr>" +
                "<td><div class='nameWrap'><div class='nameAlpWrap'><span class='nameAlpha' onclick='ShowContactUCP(\"" + this.MachineId + "\",null,null)'>V</span></div><div class='nameTxtWrap'><span class='nameTxt'>" + this.Visitor + "</td>" +
                "<td>" + this.City + "</td>" +
                "<td>" + this.Session + "</td>" +
                "<td>" + dateparam + "</td>" +
                "<td>" + fn_AverageTime(this.AvgTime) + "</td>" +
                "</tr>";
        });

        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowPagingDiv(true);
        ShowExportDiv(true);
    }
    else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
}

$("#ui_GoBack").click(function () {
    window.location = document.referrer;
});