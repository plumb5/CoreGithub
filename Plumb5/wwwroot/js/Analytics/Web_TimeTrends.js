
var TimeTrendsChart;

$(document).ready(function () {
    RemoveExportDataRange();
    ExportFunctionName = "VisitorsTimeTrendsExport";
    GetUTCDateTimeRange(2);
});

function CallBackFunction() {
    ShowPageLoading();
    CurrentRowCount = 0;
    GetReport();
}

GetReport = function () {

    $.ajax({
        url: "/Analytics/Dashboard/VisitorsTimeTrends",
        type: 'Post', 
         data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
};

function BindReport(response) {
    var GraphItem = { optiondate: [], getuniquevisitcount: [], getsessioncount:[] };
    SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
    if (TimeTrendsChart) {
        TimeTrendsChart.destroy();
    }
    if (response != undefined && response != null && response.TimeTrendsData.Table1 != undefined && response.TimeTrendsData.Table1 != null && response.TimeTrendsData.Table1.length > 0) {
        var reportTableTrs;
        $.each(response.TimeTrendsData.Table1, function () {
             //**** For Output Cache ToDateTime *******
            //if (duration == 1)
            //ToDateTime = response.CurrentUTCDateTimeForOutputCache;
             //**** For Output Cache ToDateTime *******
            reportTableTrs += "<tr>" +
                "<td>" + this.DateShort + "</td>" +
                "<td>" + fn_AverageTime(this.TotalTime) + "</td>" +
                "<td>" + this.Session + "</td> <td> <a href='/Analytics/Uniques/UniqueVisits?dur="+duration+"&Frm=" + FromDateTime + "&To=" + ToDateTime + "&TimeTrend=" + (this.Hour1 == 0 ? -1 : this.Hour1) + "&RedirectedFrom=TimeTrends'>" + this.UniqueVisit + "</a></td >" +
                "<td>" + this.TotalVisit + "</td> <td> <a href='/Analytics/Uniques/UniqueVisits?dur=" + duration +"&Frm=" + FromDateTime + "&To=" + ToDateTime + "&TimeTrend=" + (this.Hour1 == 0 ? -1 : this.Hour1) + "&Type=New&RedirectedFrom=TimeTrends'>" + this.NewVisitors + "</a></td>" +
                "</tr> ";

            GraphItem.optiondate.push(this.DateShort);
            GraphItem.getuniquevisitcount.push(this.UniqueVisit);
            GraphItem.getsessioncount.push(this.Session);

        });

        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
    } else {
        ShowExportDiv(false);
    }

    BindTimeTrendsGraph(GraphItem);
    HidePageLoading();
};




BindTimeTrendsGraph = function (GraphItem) {


    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    // line chart start here
    TimeTrendsChart = new Chart(document.getElementById("ui_canvas_TimeTrendsData"), {
        type: 'line',
        data: {
            labels: GraphItem.optiondate,
            datasets: [{
                data: GraphItem.getsessioncount,
                label: "Sessions",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item1'),
                backgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                fill: true
            },
            {
                data: GraphItem.getuniquevisitcount,
                label: "Unique Visitor",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item6'),
                backgroundColor: cssvar('--LineChart-BackgroundColor-Item6'),
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

