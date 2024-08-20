
$(document).ready(function () {
    GetUTCDateTimeRange(2);

});
function CallBackFunction() {
    ShowPageLoading();
    GetSmsBouncedRejectedData();
}
function GetSmsBouncedRejectedData() {
    $.ajax({
        url: "/Sms/SmsDashboard/GetSmsDashboardBouncedRejectedData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: BindPieChart,
        error: ShowAjaxError
    });
}
function BindPieChart(response) {
    var BouncedPercentage = 0, RejectedPercentage = 0;
    if (response != null && response.length > 0) {
        BouncedPercentage = Math.round((response[0].Bounced / response[0].TotalSent) * 100).toFixed(0);
        BouncedPercentage = isNaN(BouncedPercentage) ? 0 : BouncedPercentage;

        RejectedPercentage = Math.round((response[0].Rejected / response[0].TotalSent) * 100).toFixed(0);
        RejectedPercentage = isNaN(RejectedPercentage) ? 0 : RejectedPercentage;
        
        /* Doughnut */
        var leadChanWise = document.getElementById("bouncereject");
        new Chart(leadChanWise, {
            plugins: [ChartDataLabels],
            type: 'doughnut',
            data: {
                labels: ["Bounces", "Rejections"],
                datasets: [
                    {
                        backgroundColor: [cssvar('--PieChart-BackgroundColor-Item1'), cssvar('--PieChart-BackgroundColor-Item2')],
                        data: [response[0].Bounced, response[0].Rejected]
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    datalabels: {
                        color: '#fff',
                        font: {
                            size: 10
                        }
                    }
                },
                legend: {
                    display: false,
                    responsive: true,
                    position: 'bottom',
                    fullWidth: true,
                    labels: {
                        fontSize: 11
                    }
                },
                title: {
                    display: false
                    //text: 'Predicted world population (millions) in 2050'
                }
            }
        });
    }
    $('#PiechartBounced').text("("+BouncedPercentage+"%)");
    $('#PieChartRejected').text("("+RejectedPercentage+"%)");
    HidePageLoading();
}

