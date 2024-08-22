var CanvasChart, optiondate = '', Uniuqevistcount = [], getPageviewcount = [], getsessioncount = [];

$(document).ready(function () {
    ExportFunctionName = "PageDepthExport";
    RemoveExportDataRange();
    GetUTCDateTimeRange(2);
});

function CallBackFunction() {
    ShowPageLoading();
    GetReport();
}

function GetReport() {
    $.ajax({
        url: "/Analytics/Audience/GetPageDepth",
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

    if (response != undefined && response != null && response.PageDepthData.Table1 != undefined && response.PageDepthData.Table1 != null && response.PageDepthData.Table1.length > 0) {

        $.each(response.PageDepthData.Table1, function () {
            //**** For Output Cache ToDateTime *******
            if (duration == 1)
                ToDateTime = response.CurrentUTCDateTimeForOutputCache;
            //**** For Output Cache ToDateTime *******

            reportTableTrs += "<tr>" +
                "<td>" + this.Depth + "</td>" +
                "<td>" + this.Session + "</td>" +
                "<td>" + (this.UniqueVisits != "0" ? "<a class='ViewPermission' href='/Analytics/Uniques/UniqueVisits?dur=" + duration + "&Frm=" + FromDateTime + "&To=" + ToDateTime + "&Depth=" + this.Depth + "'>" + this.UniqueVisits + "</a>" : this.UniqueVisits) + "</td>" +
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
        type: 'bar',
        data: {
            labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            datasets: [{
                data: getsessioncount,
                label: "Sessions",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item1'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item1'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                fill: true
            },
            {
                data: Uniuqevistcount,
                label: "Unique Visitors",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item2'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item2'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item2'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item2'),
                fill: true
            },
            {
                data: getPageviewcount,
                label: "Page Views",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item3'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item3'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item3'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item3'),
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