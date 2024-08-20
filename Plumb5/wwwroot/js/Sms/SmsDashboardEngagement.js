
$(document).ready(function () {
    GetUTCDateTimeRange(2);
    
});
function CallBackFunction() {
    ShowPageLoading();
    GetCurrentEngagementData();
}
function GetCurrentEngagementData() {
    $.ajax({
        url: "/Sms/SmsDashboard/GetSmsDashboardEngagementData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: GetPastEngagementData,
        error: ShowAjaxError
    });
}

function GetPastEngagementData(CurrentEngagementData) {
    var from_Date = CalculateDateDifference();
    $.ajax({
        url: "/Sms/SmsDashboard/GetSmsDashboardEngagementData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': from_Date, 'todate': FromDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (PastEngagementData) {
            
            var ClickedComparisonPercentage=0,OptedOutComparisonPercentage=0,ClickedRatePercentage=0;
            if (CurrentEngagementData != undefined && CurrentEngagementData != null) {
                ClickedRatePercentage = Math.round((CurrentEngagementData[0].TotalClicked / CurrentEngagementData[0].TotalSent) * 100).toFixed(0);
                ClickedRatePercentage = isNaN(ClickedRatePercentage) ? 0 : ClickedRatePercentage;
                $('#ClickedCount').text(CurrentEngagementData[0].TotalClicked);
                $('#OptedoutCount').text(CurrentEngagementData[0].OptedOut);
                $('#ClickRatePercentage').text(ClickedRatePercentage + '%');
                //$('#ClickRatePercentage').removeClass().addClass('progress-bar bg-primary wd-'+ClickedRatePercentage+'p');
            }
            if (CurrentEngagementData != undefined && CurrentEngagementData != null && PastEngagementData != undefined && PastEngagementData != null) {
                
                ClickedComparisonPercentage = Math.round(CalculatePercentage(CurrentEngagementData[0].TotalClicked, PastEngagementData[0].TotalClicked));
                OptedOutComparisonPercentage = Math.round(CalculatePercentage(CurrentEngagementData[0].OptedOut, PastEngagementData[0].OptedOut));
                $('#ClickedPercentage').text(ClickedComparisonPercentage + '%');
                $('#OptedoutPercentage').text(OptedOutComparisonPercentage + '%');
                
            }
        },
        error: ShowAjaxError
    });
}

