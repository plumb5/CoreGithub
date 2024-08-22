var MobileFrequencyChart;
$(document).ready(function () {
    ExportFunctionName = "MobileFrequencyExport";
    RemoveExportDataRange();
    GetUTCDateTimeRange(2);
});

function CallBackFunction() {
    ShowPageLoading();
    GetReport();
}
function GetReport() {
    $.ajax({
        url: "/MobileAnalytics/MobileApp/GetFrequencyReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}
function BindReport(response) {
    var GraphItem = { getuniquevisitcount: [], gettotalvisitcount: []};
    SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
    if (MobileFrequencyChart) {
        MobileFrequencyChart.destroy();
    }
    if (response !== undefined && response !== null && response.Table !== undefined && response.Table !== null && response.Table.length > 0) {
        TotalRowCount = response.Table.length;
        var InnerDivhtml = "",getuniquevisitcount=[],gettotalvisitcount=[];
        $.each(response.Table, function () {
            InnerDivhtml += "<tr>" +
                "<td>" + this.Frequency + "</td>" +
                "<td>" + (this.UniqueVisits !== "0" ? "<a class='ViewPermission' href='/MobileAnalytics/MobileApp/UniqueVisits?dur=0&Frm=" + FromDateTime + "&To=" + ToDateTime + "&Frequency=" + encodeURIComponent(this.Frequency) + "'>" + this.UniqueVisits + "</a>" : this.UniqueVisits) + "</td>" +
                "<td>" + (this.TotalVisits === null || this.TotalVisits ==='' ? 0 : this.TotalVisits) + "</td>" +
                "<td>" + fn_AverageTime(this.TotalTime) + "</td>" +
                "</tr>";
            GraphItem.getuniquevisitcount.push(this.UniqueVisits);
            GraphItem.gettotalvisitcount.push(this.TotalVisits===null || this.TotalVisits===''?0:this.TotalVisits);
        });
        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(InnerDivhtml);
        ShowExportDiv(true);
    } else {
        ShowExportDiv(false);
    }
    BindGraph(GraphItem);
    HidePageLoading();

}
function BindGraph(GraphItem) {
    // line chart start here
    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;
    MobileFrequencyChart = new Chart(document.getElementById("ui_canvas_MobileFrequencyChart"), {
        type: 'bar',
        data: {
            labels: ["1", "2", "3", "4", "5", "6-10", "11-25", "26-99", "100 or More"],
            datasets: [{
                data: GraphItem.gettotalvisitcount,
                label: "Page Views",
                borderWidth: 1,
                borderColor: cssvar("--BarChart-BorderColor-Item1"),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item1'),
                backgroundColor: cssvar("--BarChart-BackgroundColor-Item1"),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                fill: true
            },
            {
                data: GraphItem.getuniquevisitcount,
                label: "Unique Visitor",
                borderWidth: 1,
                borderColor: cssvar("--BarChart-BorderColor-Item2"),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item2'),
                backgroundColor: cssvar("--BarChart-BackgroundColor-Item2"),
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