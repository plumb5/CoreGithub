
var SmPerformanceOvertimeChart;
$(document).ready(function () {
    GetUTCDateTimeRange(2);

});
function CallBackFunction() {
    ShowPageLoading();
    GetPerformanceOverTimeData();
}
function GetPerformanceOverTimeData() {
    $.ajax({
        url: "/Sms/SmsDashboard/GetSmsPerformanceOverTimeData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: BindLineGraph,
        error: ShowAjaxError
    });
}
function BindLineGraph(response) {
    var GraphItem = { optiondate: [], deliverRate: [], clickedRate: []};
    if (SmPerformanceOvertimeChart) {
        SmPerformanceOvertimeChart.destroy();
    }
    $.each(response, function () {
        var currentDateData = ConvertDateObjectToDateTime(this.SentDate);
        var eachDate = monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate();
        var deliverRate = Math.round((this.TotalDelivered / this.TotalSent) * 100);
        var clickedRate = Math.round((this.TotalClicked / this.TotalSent) * 100);
        GraphItem.optiondate.push(eachDate);
        GraphItem.deliverRate.push(deliverRate);
        GraphItem.clickedRate.push(clickedRate);
    });
    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    // line chart start here
    SmPerformanceOvertimeChart =new Chart(document.getElementById("smsperformanceovertime"), {
        type: 'line',
        data: {
            labels: GraphItem.optiondate,
            datasets: [{
                data: GraphItem.deliverRate,
                label: "Delivery Rate",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item1'),
                backgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                fill: false
            },
            {
                data: GraphItem.clickedRate,
                label: "Click Rate",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item2'),
                backgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                fill: false
            }
            ]
        },
        options: {
            maintainAspectRatio: false,
            elements: {
                point: {
                    radius: 2
                }
            },
            scales: {
                yAxes: [{
                    ticks: {

                        min: 0,
                        max: 100,
                        callback: function (value) { return value + "%" }
                    }
                }]
            },
            legend: {
                display: true,
                position: 'bottom',
                fullWidth: true,
                labels: {
                    fontSize: 11,
                    boxHeight: 0

                }
            }
        }
    });
}

