var CanvasChart, optiondate = '', Uniuqevistcount = [], getPageviewcount = [], getsessioncount = [];

$(document).ready(function () {
    ExportFunctionName = "TimeSpendExport";
    RemoveExportDataRange();
    GetUTCDateTimeRange(2);
});
function CallBackFunction() {
    ShowPageLoading();
    GetReport();
}
function GetReport() {
    $.ajax({
        url: "/MobileAnalytics/MobileApp/GetTimeSpend",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'duration': duration }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    var reportTableTrs = ""; Uniuqevistcount = [], getPageviewcount = [], getsessioncount = [];
    SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');

    if (response != undefined && response != null && response.Table != undefined && response.Table != null && response.Table.length > 0) {

        $.each(response.Table, function (m) {

            reportTableTrs += "<tr>" +
                "<td>" + this.Time + "</td>" +
                "<td>" + this.Session + "</td>" +
                "<td>" + (this.UniqueVisits != "0" ? "<a class='ViewPermission' href='/MobileAnalytics/MobileApp/UniqueVisits?dur=0&Frm=" + FromDateTime + "&To=" + ToDateTime + "&Time=" + this.Time + "'>" + this.UniqueVisits + "</a>" : this.UniqueVisits) + "</td>" +
                "<td>" + (this.PageViews == null ? "0" : this.PageViews) + "</td>" +
                "<td>" + (this.AvgTime == null ? "0d 0h 0h 0s" : fn_AverageTime(this.AvgTime)) + "</td>" +
                "</tr>";
            Uniuqevistcount.push(this.UniqueVisits);
            getPageviewcount.push(this.PageViews);
            getsessioncount.push(this.Session);

        });

        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
    } else {
        ShowExportDiv(false);
    }

    BindGraph();
    HidePageLoading();
}


function BindGraph() {
    if (CanvasChart) {
        CanvasChart.destroy();
    }
    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    // line chart start here
    CanvasChart = new Chart(document.getElementById("graphData"), {
        type: 'line',
        data: {
            labels: ["0-10 Secs", "11-30 Secs", "31-60 Secs", "61-180 Secs", "181-300 Secs", "301-600 Secs"],
            datasets: [{
                data: Uniuqevistcount,
                label: "Unique Visitors",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item1'),
                pointBorderColor: cssvar('--LineChart-BorderColor-Item1'),
                hoverBorderColor: cssvar('--LineChart-BorderColor-Item1'),
                pointHoverBorderColor: cssvar('--LineChart-BorderColor-Item1'),

                backgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                pointBackgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                pointHoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                fill: true
            },
            {
                data: getsessioncount,
                label: "Sessions",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item2'),
                pointBorderColor: cssvar('--LineChart-BorderColor-Item2'),
                hoverBorderColor: cssvar('--LineChart-BorderColor-Item2'),
                pointHoverBorderColor: cssvar('--LineChart-BorderColor-Item2'),

                backgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                pointBackgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                pointHoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                fill: true
            },
            {
                data: getPageviewcount,
                label: "Page Views",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item3'),
                pointBorderColor: cssvar('--LineChart-BorderColor-Item3'),
                hoverBorderColor: cssvar('--LineChart-BorderColor-Item3'),
                pointHoverBorderColor: cssvar('--LineChart-BorderColor-Item3'),

                backgroundColor: cssvar('--LineChart-BackgroundColor-Item3'),
                hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item3'),
                pointBackgroundColor: cssvar('--LineChart-BackgroundColor-Item3'),
                pointHoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item3'),
                fill: true
            }
            ]
        },
        options: {
            maintainAspectRatio: false,
            elements: {
                line: {
                    tension: 0
                },
                point: {
                    radius: 2
                }
            },
            legend: {
                display: true,
                position: 'bottom',
                fullWidth: true,
                labels: {
                    fontSize: 11,
                    boxHeight: 0,

                },
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        }
    });
}