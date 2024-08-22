var minusOneDayOnPages = ["/analytics/content/popularpages", "/analytics/content/topentrypages", "/analytics/content/topexitpages", "/analytics/content/pageanalysis",
    "/analytics/dashboard/visits", "/analytics/audience/visitors", "/analytics/audience/cities", "/analytics/dashboard/countries",
    "/analytics/dashboard/newreturn", "/analytics/dashboard/timeonsite", "/analytics/audience/network", "/mobileanalytics/mobileapp/visits", "/mobileanalytics/mobileapp/cities",
    "/mobileanalytics/mobileapp/countries", "/mobileanalytics/mobileapp/newreturn", "/mobileanalytics/mobileapp/timeonmobile", "/mobileanalytics/mobileapp/frequency", "/mobileanalytics/mobileapp/recency",
    "/mobileanalytics/mobileapp/timespend", "/mobileanalytics/mobileapp/popularpages"];
$("#ui_txtStartDate").datepicker({
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: true,
    maxDate: "0",
    changeMonth: true,
    changeYear: true
});

$("#ui_txtEndDate").datepicker({
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: true,
    maxDate: "0",
    changeMonth: true,
    changeYear: true
});

$(".dateclseWrap").on('click', function () {
    $(this).parents('.dateBoxWrap').removeClass('showFlx');
});

$(".datedropdown > .dropdown-menu a").click(function () {
    var SelectedDateDropDown = $(this).text();
    $("#selectdateDropdown").html(SelectedDateDropDown);
    $(".dateBoxWrap").removeClass('showFlx');
    $("#selectdateDropdown").attr("title", "");

    if (SelectedDateDropDown == "Today") {
        GetUTCDateTimeRange(1, true);
    }
    else if (SelectedDateDropDown == "This Week" || SelectedDateDropDown == "Last Week") {
        GetUTCDateTimeRange(2, true);
    }
    else if (SelectedDateDropDown == "This Month" || SelectedDateDropDown == "Last Month") {
        GetUTCDateTimeRange(3, true);
    }
    else if (SelectedDateDropDown == "Custom Date Range") {
        $("#ui_txtStartDate").val('');
        $("#ui_txtEndDate").val('');
        $(".dateBoxWrap").addClass('showFlx');
    }
    else if (SelectedDateDropDown == "Last 3 Months") {
        GetUTCDateTimeRange(6, true);
    }
    else if (SelectedDateDropDown == "All Time") {
        GetUTCDateTimeRange(7);
    }
});

$("#ui_btnCustomDateApply").click(function () {
    GetUTCDateTimeRange(5, true); true
});

function GetUTCDateTimeRange(dateDuration, IsCookieeCheck) {

    if (!IsCookieeCheck) {
        let cookieevalue = getDateRangeCookie(p5daterangesetCookieeName + "_" + Plumb5AccountId);
        if (cookieevalue == "1") {
            dateDuration = 1;
            BindDateTitle("Today");
        } else if (cookieevalue == "2") {
            dateDuration = 2;
            BindDateTitle("This Week");
        } else if (cookieevalue == "3") {
            dateDuration = 3;
            BindDateTitle("This Month");
        } else if (cookieevalue.split("~")[0] == "5") {
            dateDuration = 5;
            BindDateTitle("Custom Date Range");
            $("#ui_txtStartDate").val(cookieevalue.split("~")[1]);
            $("#ui_txtEndDate").val(cookieevalue.split("~")[2]);
            $(".dateBoxWrap").addClass('showFlx');
        }
    }

    let currentUrlPage = window.location.pathname.toString().toLowerCase();
    var fromdate, todate;
    duration = dateDuration;


    if (dateDuration == 1) {
        fromdate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));
        todate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));
    }
    else if (dateDuration == 2) {
        fromdate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));
        todate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));

        fromdate.setDate(todate.getDate() - 6);
        if (minusOneDayOnPages.indexOf(currentUrlPage) > -1) {
            fromdate.setDate(fromdate.getDate() - 1);
            todate.setDate(todate.getDate() - 1);
        }
    }
    else if (dateDuration == 3) {
        fromdate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));
        todate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));

        fromdate.setMonth(todate.getMonth() - 1);
        fromdate.setDate(fromdate.getDate() + 1);
        if (minusOneDayOnPages.indexOf(currentUrlPage) > -1) {
            fromdate.setDate(fromdate.getDate() - 1);
            todate.setDate(todate.getDate() - 1);
        }
    }
    else if (dateDuration == 5) {
        if ($("#ui_txtStartDate").val().length == 0 && $("#ui_txtEndDate").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.daterange_error);
            $("#ui_txtStartDate").focus();
            return false;
        }

        if ($("#ui_txtStartDate").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.from_date_range_error);
            $("#ui_txtStartDate").focus();
            return false;
        }

        if ($("#ui_txtEndDate").val().length == 0) {
            ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.to_date_range_error);
            $("#ui_txtEndDate").focus();
            return false;
        }

        LocalFromdate = $("#ui_txtStartDate").val();
        LocalTodate = $("#ui_txtEndDate").val();

        if (!isGoodDate(LocalFromdate)) {
            ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.date_incorrect_format);
            $("#ui_txtStartDate").focus();
            return false;
        }

        if (!isGoodDate(LocalTodate)) {
            ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.date_incorrect_format);
            $("#ui_txtEndDate").focus();
            return false;
        }

        if (IsGreaterThanTodayDate(LocalFromdate)) {
            ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.from_date_Exceeded_error);
            $("#ui_txtStartDate").focus();
            return false;
        }

        if (IsGreaterThanTodayDate(LocalTodate)) {
            ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.to_date_Exceeded_error);
            $("#ui_txtEndDate").focus();
            return false;
        }

        if (isFromBiggerThanTo(LocalFromdate, LocalTodate)) {
            ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.from_date_less_then_error);
            $("#ui_txtStartDate").focus();
            return false;
        }

        fromdate = new Date(LocalFromdate);
        todate = new Date(LocalTodate);
    }
    else if (dateDuration == 6) {
        fromdate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));
        todate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));

        fromdate.setDate(todate.getDate() - 90);
        if (minusOneDayOnPages.indexOf(currentUrlPage) > -1) {
            fromdate.setDate(fromdate.getDate() - 1);
            todate.setDate(todate.getDate() - 1);
        }
    }
    else if (dateDuration == 7) {
        fromdate = new Date("Jan 01, 2020 00:00:00");
        todate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));
    }
    else {
        ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.selection_error);
        return false;
    }

    FromDateTime_JsDate = fromdate;
    ToDateTime_JsDate = todate;

    var startdate = fromdate.getFullYear() + '-' + AddingPrefixZeroDayMonth((fromdate.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(fromdate.getDate()) + " 00:00:00";
    var enddate = todate.getFullYear() + '-' + AddingPrefixZeroDayMonth((todate.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(todate.getDate()) + " 23:59:59";

    LocalFromDateTime = startdate;
    LocalToDateTime = enddate;

    fromdate = ConvertDateTimeToUTC(startdate);
    fromdate = fromdate.getFullYear() + '-' + AddingPrefixZeroDayMonth((fromdate.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(fromdate.getDate()) + " " + AddingPrefixZeroDayMonth(fromdate.getHours()) + ":" + AddingPrefixZeroDayMonth(fromdate.getMinutes()) + ":" + AddingPrefixZeroDayMonth(fromdate.getSeconds());

    todate = ConvertDateTimeToUTC(enddate);
    todate = todate.getFullYear() + '-' + AddingPrefixZeroDayMonth((todate.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(todate.getDate()) + " " + AddingPrefixZeroDayMonth(todate.getHours()) + ":" + AddingPrefixZeroDayMonth(todate.getMinutes()) + ":" + AddingPrefixZeroDayMonth(todate.getSeconds());

    FromDateTime = fromdate;
    ToDateTime = todate;

    $("#selectdateDropdown").attr("title", LocalFromDateTime + " to " + LocalToDateTime);

    if ($("#ui_divContactUCPScreen").is(":visible")) {
        try {
            CallBackUPCFunction();
        } catch { }
    } else {
        try {
            OffSet = 0;
            CallBackFunction();
        } catch (ex) {
            console.log(ex);
        }
    }
}

function CalculateDateDifference() {

    var CurrentFromDate = CurrentToDate = GivenDate = DateDifference = NewFromDate = "", Time = "";

    CurrentFromDate = FromDateTime.split(" ");
    CurrentToDate = ToDateTime.split(" ");
    Time = CurrentFromDate[1].toString();

    GivenDate = CurrentFromDate[0].split('-');
    CurrentFromDate = new Date(GivenDate[0], GivenDate[1] - 1, GivenDate[2]);

    GivenDate = CurrentToDate[0].split('-');
    CurrentToDate = new Date(GivenDate[0], GivenDate[1] - 1, GivenDate[2]);

    DateDifference = Math.abs((CurrentFromDate.getTime() - CurrentToDate.getTime()) / (24 * 60 * 60 * 1000));

    NewFromDate = new Date(CurrentFromDate);
    NewFromDate.setDate(NewFromDate.getDate() - (DateDifference));//C

    return NewFromDate.getFullYear() + "-" + AddingPrefixZeroDayMonth(NewFromDate.getMonth() + 1) + "-" + AddingPrefixZeroDayMonth(NewFromDate.getDate()) + " " + Time;
}

function IsGreaterThanTodayDate(chkdate) {
    var todayDate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] })).toISOString().slice(0, 10);
    var from = new Date(chkdate).getTime();
    var to = new Date(todayDate).getTime();
    return from > to;
}

function isFromBiggerThanTo(dtmfrom, dtmto) {
    var from = new Date(dtmfrom).getTime();
    var to = new Date(dtmto).getTime();
    return from > to;
}

function AddingPrefixZeroDayMonth(n) {
    return (n < 10) ? ("0" + n) : n;
}

function getDateRangeCookie(name) {
    var cookieValue = null;
    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();

        // Check if this cookie has the name we're looking for
        if (cookie.indexOf(name + '=') === 0) {
            // Get the value of the cookie
            cookieValue = cookie.substring(name.length + 1, cookie.length);
            break;
        }
    }

    return decodeURIComponent(cookieValue);
}

function BindDateTitle(SelectedDateDropDown) {
    $("#selectdateDropdown").html(SelectedDateDropDown);
    $(".dateBoxWrap").removeClass('showFlx');
    $("#selectdateDropdown").attr("title", "");
}