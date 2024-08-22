
var monthDetials = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var duration = 0;
var FromDateTime, ToDateTime;
var FromDateTime_JsDate, ToDateTime_JsDate;
$(".CustomDateProvider").click(function () {

    if ($('#dvCustomFilter').is(":visible")) {
        $('#dvCustomFilter').hide('slow');
    }
    else {
        $('#dvCustomFilter').show('slow');
    }
    hideCalendarControl();
});

function GetDateTimeRange(duration) {

    var fromdate = '', todate = '';
    $("#dvLoading").show();
    $("#dvCustomFilter").css("display", "none");

    if (duration == 5) {

        $(".button").attr("class", "button1");

        if ($("#txtDateFrom").val().length == 0) {
            ShowErrorMessage("Please enter From date range");
            $("#dvCustomFilter").show();
            $("#txtDateFrom").focus();
            $("#dvLoading").hide();
            return false;
        }

        if ($("#txtDateTo").val().length == 0) {
            ShowErrorMessage("Please enter To date range");
            $("#dvCustomFilter").show();
            $("#txtDateTo").focus();
            $("#dvLoading").hide();
            return false;
        }

        var fromdate = $("#txtDateFrom").val();
        var todate = $("#txtDateTo").val();

        $("#btn" + duration).attr("GraphBindingId", duration);
        var startEndDates = BindDate(duration, fromdate, todate);
        fromdate = startEndDates[0];
        todate = startEndDates[1];
    }
    else if (duration == 1 || duration == 2 || duration == 3 || duration == 4) {
        $(".button").attr("class", "button1");
        $("#btn" + duration).attr("class", "button buttonWithourCurve");
        $("#btn" + duration).attr("GraphBindingId", duration);

        var startEndDates = BindDate(duration, fromdate, todate);
        fromdate = startEndDates[0];
        todate = startEndDates[1];
        duration=startEndDates[2];
    }

    FromDateTime = fromdate;
    ToDateTime = todate;
    duration = duration;
    CallBackFunction();
}

function BindDate(dur, frm, to) {
    var a = new Date(), b = new Date(), startdate = '', enddate = '';
    switch (dur) {
        case 1:
            window.lblDate.innerHTML = a.getDate() + ' ' + monthDetials[a.getMonth()] + ' ' + a.getFullYear();
            startdate = a.getFullYear() + '-' + AddingPrefixZero((a.getMonth() + 1)) + '-' + AddingPrefixZero(a.getDate());
            enddate = a.getFullYear() + '-' + AddingPrefixZero((a.getMonth() + 1)) + '-' + AddingPrefixZero(a.getDate());
            break;
        case 2:
            b.setDate(a.getDate() - 6);
            window.lblDate.innerHTML = b.getDate() + ' ' + monthDetials[b.getMonth()] + ' ' + b.getFullYear() + ' - ' + a.getDate() + ' ' + monthDetials[a.getMonth()] + ' ' + a.getFullYear();
            startdate = b.getFullYear() + '-' + AddingPrefixZero((b.getMonth() + 1)) + '-' + AddingPrefixZero(b.getDate());
            enddate = a.getFullYear() + '-' + AddingPrefixZero((a.getMonth() + 1)) + '-' + AddingPrefixZero(a.getDate());
            break;
        case 3:
            b.setMonth(a.getMonth() - 1);
            b.setDate(b.getDate() + 1);
            window.lblDate.innerHTML = (b.getDate()) + ' ' + monthDetials[b.getMonth()] + ' ' + b.getFullYear() + ' - ' + a.getDate() + ' ' + monthDetials[a.getMonth()] + ' ' + a.getFullYear();
            startdate = b.getFullYear() + '-' + AddingPrefixZero((b.getMonth() + 1)) + '-' + AddingPrefixZero(b.getDate());
            enddate = a.getFullYear() + '-' + AddingPrefixZero((a.getMonth() + 1)) + '-' + AddingPrefixZero(a.getDate());
            break;
        case 4:
            b.setDate(a.getDate() - 365);
            window.lblDate.innerHTML = /*a.getDate() + ' ' +*/ monthDetials[a.getMonth()] + ' ' + b.getFullYear() + ' - ' /*+ a.getDate() + ' '*/ + monthDetials[a.getMonth()] + ' ' + a.getFullYear();
            startdate = b.getFullYear() + '-' + AddingPrefixZero((a.getMonth() + 1)) + '-' + AddingPrefixZero(a.getDate());
            enddate = a.getFullYear() + '-' + AddingPrefixZero((a.getMonth() + 1)) + '-' + AddingPrefixZero(a.getDate());
            break;
        case 5:
            a = new Date(frm);
            b = new Date(to);
            window.lblDate.innerHTML = a.getDate(frm) + ' ' + monthDetials[a.getMonth(frm)] + ' ' + a.getFullYear(frm) + ' - ' + b.getDate(to) + ' ' + monthDetials[b.getMonth(to)] + ' ' + b.getFullYear(to);
            startdate = a.getFullYear(frm) + '-' + AddingPrefixZero((a.getMonth(frm) + 1)) + '-' + AddingPrefixZero(a.getDate(frm));
            enddate = b.getFullYear(to) + '-' + AddingPrefixZero((b.getMonth(to) + 1)) + '-' + AddingPrefixZero(b.getDate(to));
            break;
        default:
            break;
    }
    FromDateTime_JsDate = a;
    ToDateTime_JsDate = b;
    startdate = startdate + " " + $("#ui_ddlFromTimeHour").val() + ":" + $("#ui_ddlFromTimeMin").val() + ":00";
    enddate = enddate + " " + $("#ui_ddlToTimeHour").val() + ":" + $("#ui_ddlToTimeMin").val() + ":59";
    duration = dur;
    return [startdate, enddate, duration];
}

function hideCalendarControl() {
    if (calendarControl.visible()) {
        calendarControl.hide();
    }
}
function showCalendarControl(textField) {
    calendarControl.show(textField);
}

function AddingPrefixZero(n) {
    return (n < 10) ? ("0" + n) : n;
}