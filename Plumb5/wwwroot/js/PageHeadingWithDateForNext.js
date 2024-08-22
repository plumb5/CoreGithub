
$("#ui_txtStartDate").datepicker({
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: false,
    changeMonth: true,
    changeYear: true
});

$("#ui_txtEndDate").datepicker({
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: true,
    changeMonth: true,
    changeYear: true
});

$(".dateclseWrap").on('click', function () {
    $(this).parents('.dateBoxWrap').removeClass('showFlx');
});

$(".datedropdown > .dropdown-menu a").click(function () {
    var SelectedDateDropDown = $(this).text();
    $('#selectdateDropdown').html(SelectedDateDropDown);
    $(".dateBoxWrap").removeClass('showFlx');
    $("#selectdateDropdown").attr("title", "");

    if (SelectedDateDropDown == "Today") {
        GetUTCDateTimeRangeForNext(1);
    }
    else if (SelectedDateDropDown == "Next Week") {
        GetUTCDateTimeRangeForNext(2);
    }
    else if (SelectedDateDropDown == "Next Month") {
        GetUTCDateTimeRangeForNext(3);
    }
    else if (SelectedDateDropDown == "Custom Date Range") {
        $("#ui_txtStartDate").val('');
        $("#ui_txtEndDate").val('');
        $(".dateBoxWrap").addClass('showFlx');
    }
});

$("#ui_btnCustomDateApplyForNext").click(function () {
    GetUTCDateTimeRangeForNext(5);
});

function GetUTCDateTimeRangeForNext(dateDuration) {
    var fromdate, todate;
    duration = dateDuration;

    if (dateDuration == 1) {
        fromdate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));
        todate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));
    }
    else if (dateDuration == 2) {
        fromdate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));
        todate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));

        todate.setDate(todate.getDate() + 6);
    }
    else if (dateDuration == 3) {
        fromdate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));
        todate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));

        todate.setMonth(todate.getMonth() + 1);
        todate.setDate(todate.getDate() + 1);
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

        //if (IsGreaterThanTodayDate(LocalFromdate)) {
        //    ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.from_date_Exceeded_error);
        //    $("#ui_txtStartDate").focus();
        //    return false;
        //}

        //if (IsGreaterThanTodayDate(LocalTodate)) {
        //    ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.to_date_Exceeded_error);
        //    $("#ui_txtEndDate").focus();
        //    return false;
        //}

        if (isFromBiggerThanTo(LocalFromdate, LocalTodate)) {
            ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.from_date_less_then_error);
            $("#ui_txtStartDate").focus();
            return false;
        }

        fromdate = new Date(LocalFromdate);
        todate = new Date(LocalTodate);
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

    $("#selectdateDropdown").attr("title", LocalFromDateTime + " to " + LocalToDateTime);

    FromDateTime = fromdate;
    ToDateTime = todate;
    try {
        OffSet = 0;
        CallBackFunction();
    } catch (ex) {
        console.log(ex);
    }
}

function CalculateDateDifference() {

    var CurrentFromDate = CurrentToDate = GivenDate = DateDifference = NewFromDate = "";

    CurrentFromDate = FromDateTime.split(" ");
    CurrentToDate = ToDateTime.split(" ");

    GivenDate = CurrentFromDate[0].split('-');
    CurrentFromDate = new Date(GivenDate[0], GivenDate[1] - 1, GivenDate[2]);

    GivenDate = CurrentToDate[0].split('-');
    CurrentToDate = new Date(GivenDate[0], GivenDate[1] - 1, GivenDate[2]);

    DateDifference = Math.abs((CurrentFromDate.getTime() - CurrentToDate.getTime()) / (24 * 60 * 60 * 1000));

    NewFromDate = new Date(CurrentFromDate);
    NewFromDate.setDate(NewFromDate.getDate() - (DateDifference + 1));

    return NewFromDate.getFullYear() + "-" + AddingPrefixZeroDayMonth(NewFromDate.getMonth() + 1) + "-" + AddingPrefixZeroDayMonth(NewFromDate.getDate()) + " " + AddingPrefixZeroDayMonth(NewFromDate.getHours()) + ":" + AddingPrefixZeroDayMonth(NewFromDate.getMinutes()) + ":00";
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