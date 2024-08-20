
var WebFrequencyChart;

$(document).ready(function () {
    RemoveExportDataRange();
    ExportFunctionName = "FrequencyExport";
    GetUTCDateTimeRange(2);
});

function CallBackFunction() {
    ShowPageLoading();
    GetReport();
}

GetReport = function () {

    $.ajax({
        url: "/Analytics/Audience/GetFrequencyReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
};

function BindReport(response) {
    var GraphItem = { frequency: [], getuniquevisitcount: [], getpageviewscount: [] };
    SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
    if (WebFrequencyChart) {
        WebFrequencyChart.destroy();
    }
    if (response != undefined && response != null && response.FrequencyData.Table1 != undefined && response.FrequencyData.Table1 != null && response.FrequencyData.Table1.length > 0) {

        var reportTableTrs;

        $.each(response.FrequencyData.Table1, function () {
            let UniqueVisits = this.UniqueVisits != null || this.UniqueVisits != undefined ? this.UniqueVisits : 0;
            let TotalVisits = this.TotalVisits != null || this.TotalVisits != undefined ? this.TotalVisits : 0;
            let TotalTime = this.TotalTime != null || this.TotalTime != undefined ? fn_AverageTime(this.TotalTime) : "0d 0h 0m 0s";
            //**** For Output Cache ToDateTime *******
            if (duration == 1)
                ToDateTime = response.CurrentUTCDateTimeForOutputCache;
            //**** For Output Cache ToDateTime *******
            reportTableTrs += "<tr>" +
                "<td>" + this.Frequency + "</td>" +
                "<td>" + (UniqueVisits != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=" + duration + "&Frm=" + FromDateTime + "&To=" + ToDateTime + "&Frequency=" + this.Frequency + "'>" + UniqueVisits + "</a>" : UniqueVisits) + "</td>" +
                "<td>" + TotalVisits + "</td>" +
                "<td>" + TotalTime + "</td>" +
                "</tr>";

            GraphItem.frequency.push(this.Frequency);
            GraphItem.getuniquevisitcount.push(this.UniqueVisits);
            GraphItem.getpageviewscount.push(this.TotalVisits);

        });

        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
    } else {
        ShowExportDiv(false);
    }

    BindFrequencyGraph(GraphItem);
    HidePageLoading();
};



BindFrequencyGraph = function (GraphItem) {

    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    // line chart start here
    WebFrequencyChart = new Chart(document.getElementById("ui_canvas_WebFrequencyData"), {
        type: 'bar',
        data: {
            labels: GraphItem.frequency,
            datasets: [{
                data: GraphItem.getuniquevisitcount,
                label: "Unique Visitors",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item1'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item1'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                fill: true
            },
            {
                data: GraphItem.getpageviewscount,
                label: "Page Views",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item2'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item2'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item2'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item2'),
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

