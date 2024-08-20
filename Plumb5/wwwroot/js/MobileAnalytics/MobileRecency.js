var MobileRecencyChart;

$(document).ready(function () {
    ExportFunctionName = "MobileRecencyExport";
    RemoveExportDataRange();
    CallBackFunction();
});

function CallBackFunction() {
    CurrentRowCount = 0;
    ShowPageLoading();
    GetReport();
}
function GetReport() {


    $.ajax({
        url: "/MobileAnalytics/MobileApp/GetRecency",
        type: 'Post',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}
function BindReport(response) {
    var GraphItem = { daycount: [], getuniquevisitcount: [], gettotalsessioncount: [],getpageviewscount :[] };
    SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');
    if (MobileRecencyChart) {
        MobileRecencyChart.destroy();
    }
    if (response !== undefined && response !== null  && response.Table !== undefined && response.Table !== null && response.Table.length > 0) {
        TotalRowCount = response.Table.length;
        var InnerDivhtml = "";
        $.each(response.Table, function () {
            InnerDivhtml += "<tr>" +
                "<td>" + this.DaySince + "</td>" +
                "<td>" + (this.UniqueVisits !== "0" ? "<a class='ViewPermission' href='/MobileAnalytics/MobileApp/UniqueVisits?dur=0&Frm=" + this.StartDate + "&To=" + this.EndDate + "&Recency=" + (this.DaySince === "0" ? "-1" : this.DaySince) + "'>" + this.UniqueVisits + "</a>" : this.UniqueVisits) + "</td>" +
                "<td>" + (this.Session === null ? "0" : this.Session) + "</td>" +
                "<td>" + (this.PageViews === null ? "0" : this.PageViews) + "</td>" +
                "<td>" + (this.AvgTime === null || this.AvgTime === "0" ? "0d 0h 0m 0s" : fn_AverageTime(this.AvgTime)) + "</td>" +
                "</tr>";
            GraphItem.daycount.push(this.DaySince);
            GraphItem.getuniquevisitcount.push(this.UniqueVisits);
            GraphItem.gettotalsessioncount.push(this.Session === null || this.Session === '' ? 0 : this.Session);
            GraphItem.getpageviewscount.push(this.PageViews);
        });
        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(InnerDivhtml);
        ShowExportDiv(true);
    } else {
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    BindGraph(GraphItem);
    HidePageLoading();
}
function BindGraph(GraphItem) {
    //Charts Start here

    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    // line chart start here
    MobileRecencyChart = new Chart(document.getElementById("ui_canvas_MobileRecencyChart"), {
        type: 'bar',
        data: {
            labels: GraphItem.daycount,
            datasets: [{
                data: GraphItem.getuniquevisitcount,
                label: "Unique Visitors",
                borderWidth: 1,
                borderColor: cssvar("--BarChart-BorderColor-Item1"),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item1'),
                backgroundColor: cssvar("--BarChart-BackgroundColor-Item1"),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                fill: true
            },
            {
                data: GraphItem.gettotalsessioncount,
                label: "Sessions",
                borderWidth: 1,
                borderColor: cssvar("--BarChart-BorderColor-Item2"),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item2'),
                backgroundColor: cssvar("--BarChart-BackgroundColor-Item2"),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item2'),
                fill: true
            },
            {
                data: GraphItem.getpageviewscount,
                 label: "Page Views",
                 borderWidth: 1,
                borderColor: cssvar("--BarChart-BorderColor-Item3"),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item3'),
                backgroundColor: cssvar("--BarChart-BackgroundColor-Item3"),
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