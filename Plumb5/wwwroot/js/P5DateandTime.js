var monthDetials = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var FromDateTime, ToDateTime;
var duration = 0;
$(document).ready(function () {
    GetDateTimeRange(2);
});
function GetDateTimeRange(duration) {
    var fromdate = '', todate = '';
    if (duration == 2) {
        var startEndDates = BindDate(duration, fromdate, todate);
        fromdate = startEndDates[0];
        todate = startEndDates[1];
        duration = startEndDates[2];
    }
    FromDateTime = fromdate;
    ToDateTime = todate;
    duration = duration;
   
}
function BindDate(dur, frm, to) {
    var a = new Date(), b = new Date(), startdate = '', enddate = '';
    switch (dur) {        
        case 2:
            b.setDate(a.getDate() - 6);
            startdate = b.getFullYear() + '-' + AddingPrefixZero((b.getMonth() + 1)) + '-' + AddingPrefixZero(b.getDate());
            enddate = a.getFullYear() + '-' + AddingPrefixZero((a.getMonth() + 1)) + '-' + AddingPrefixZero(a.getDate());
            break;     
        default:
            break;
    }
   
    startdate = startdate + " " + "00:00:00";
    enddate = enddate + " " + "23:59:59";
    duration = dur;
    return [startdate, enddate, duration];
}
function AddingPrefixZero(n) {
    return (n < 10) ? ("0" + n) : n;
}
function CalculateDiffDays() {

    var fromdate = toDate = dates = diffDays = DiffDate = "";

    fromDate = FromDateTime.split(" ");
    toDate = ToDateTime.split(" ");

    dates = fromDate[0].split('-');
    fromDate = new Date(dates[0], dates[1] - 1, dates[2]);

    dates = toDate[0].split('-');
    toDate = new Date(dates[0], dates[1] - 1, dates[2]);

    diffDays = Math.abs((fromDate.getTime() - toDate.getTime()) / (24 * 60 * 60 * 1000));

    DiffDate = new Date(fromDate);
    DiffDate.setDate(DiffDate.getDate() - (diffDays + 1));

    fromDate = DiffDate.getFullYear() + "-" + AddingPrefixZero(DiffDate.getMonth() + 1) + "-" + AddingPrefixZero(DiffDate.getDate()) + " " + "00:00:00";

    return fromDate;
}