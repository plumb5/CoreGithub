
$(document).ready(function () {
    GetUTCDateTimeRange(2);

});
function CallBackFunction() {
    ShowPageLoading();
    GetSmsCurrentDeliveryData();
}
function GetSmsCurrentDeliveryData() {
    $.ajax({
        url: "/Sms/SmsDashboard/GetSmsDashboardDeliveryData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: GetSmsPastDeliverData,
        error: ShowAjaxError
    });
}
function GetSmsPastDeliverData(CurrentDeliverData) {
    var from_Date = CalculateDateDifference();
    $.ajax({
        url: "/Sms/SmsDashboard/GetSmsDashboardDeliveryData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': from_Date, 'todate': FromDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (PastDeliverData) {
            var SentComparisonPercentage = 0, DeliveredComparisonPercentage = 0,BouncedComparisonPercentage=0, DeliveryRatePercentage = 0;
            if (CurrentDeliverData != undefined && CurrentDeliverData != null) {
                DeliveryRatePercentage =  Math.round((CurrentDeliverData[0].TotalDelivered / CurrentDeliverData[0].TotalSent) * 100).toFixed(0);
                DeliveryRatePercentage = isNaN(DeliveryRatePercentage) ? 0 : DeliveryRatePercentage;
                $('#SendCount').text(CurrentDeliverData[0].TotalSent);
                $('#DeliveredCount').text(CurrentDeliverData[0].TotalDelivered);
                $('#BouncedCount').text(CurrentDeliverData[0].Bounced);
                $('#DeliverRatePercentage').text(DeliveryRatePercentage + '%');
                //$('#DeliverRatePercentage').removeClass().addClass('progress-bar bg-success wd-' + DeliveryRatePercentage + 'p');
            }
            if (CurrentDeliverData != undefined && CurrentDeliverData != null && PastDeliverData != undefined && PastDeliverData != null) {

                SentComparisonPercentage = Math.round(CalculatePercentage(CurrentDeliverData[0].TotalSent, PastDeliverData[0].TotalSent));
                DeliveredComparisonPercentage = Math.round(CalculatePercentage(CurrentDeliverData[0].TotalDelivered, PastDeliverData[0].TotalDelivered));
                BouncedComparisonPercentage = Math.round(CalculatePercentage(CurrentDeliverData[0].Bounced, PastDeliverData[0].Bounced));
                $('#SentPercentage').text(SentComparisonPercentage + '%');
                $('#DeliveredPercentage').text(DeliveredComparisonPercentage + '%');
                $('#BouncedPercentage').text(BouncedComparisonPercentage + '%');

            }
        },
        error: ShowAjaxError
    });
}

