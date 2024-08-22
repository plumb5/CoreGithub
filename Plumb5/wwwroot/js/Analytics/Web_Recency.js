var CanvasChart, optiondate = '', getdayssincecount = [], Uniuqevistcount = [], getPageviewcount = [], getsessioncount = [];

$(document).ready(function () {
    OffSet = 0; FetchNext = 15;
    ExportFunctionName = "RecencyExport";
    RemoveExportDataRange();
    GetUTCDateTimeRange(2);
});

function CallBackFunction() {
    ShowPageLoading();
    GetReport();
}
function GetReport() {
    var fromdate = new Date();
    fromdate = (fromdate.getMonth() + 1) + '/' + fromdate.getDate() + '/' + fromdate.getFullYear() + " 00:00:00.000";
    $.ajax({
        url: "/Analytics/Audience/GetRecency",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    var reportTableTrs = ""; getdayssincecount = [], Uniuqevistcount = [], getPageviewcount = [], getsessioncount = [];
    SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');

    if (response != undefined && response != null && response.RecencyData.Table1 != undefined && response.RecencyData.Table1 != null && response.RecencyData.Table1.length > 0) {

        $.each(response.RecencyData.Table1, function () {
            var dtFromDate = new Date(this.StartDate);
            var fromDate = dtFromDate.getFullYear() + '-' + ((dtFromDate.getMonth()) + 1 < 10 ? '0' + (dtFromDate.getMonth() + 1) : (dtFromDate.getMonth() + 1)) + '-' + (dtFromDate.getDate() < 10 ? '0' + dtFromDate.getDate() : dtFromDate.getDate()) + ' 18:30:00';

            var dtToDate = new Date(this.EndDate);
            var toDate = dtToDate.getFullYear() + '-' + ((dtToDate.getMonth() + 1) < 10 ? '0' + (dtToDate.getMonth() + 1) : (dtToDate.getMonth() + 1)) + '-' + (dtToDate.getDate() < 10 ? '0' + dtToDate.getDate() : dtToDate.getDate()) + ' 18:29:59';
            //**** For Output Cache ToDateTime *******
            if (this.DaySince == "0")
                ToDateTime = toDate = response.CurrentUTCDateTimeForOutputCache;
            //**** For Output Cache ToDateTime *******
            reportTableTrs += "<tr>" +
                "<td>" + this.DaySince + "</td>" +
                "<td>" + (this.UniqueVisits != "0" ? "<a class='ViewPermission' href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + fromDate + "&To=" + toDate + "&Recency=" + (this.DaySince == "0" ? "-1" : this.DaySince) + "'>" + this.UniqueVisits + "</a>" : this.UniqueVisits) + "</td>" +
                "<td>" + (this.Session == null ? "0" : this.Session) + "</td>" +
                "<td>" + (this.PageViews == null ? "0" : this.PageViews) + "</td>" +
                "<td>" + (this.AvgTime == null || this.AvgTime == "0" ? "0d 0h 0m 0s" : fn_AverageTime(this.AvgTime)) + "</td>" +
                "</tr>";
            Uniuqevistcount.push(this.UniqueVisits);
            getPageviewcount.push(this.PageViews);
            getsessioncount.push(this.Session);
            getdayssincecount.push(this.DaySince);

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
            labels: getdayssincecount,
            //labels: ["0", "1", "2", "3", "4", "5", "6","7", "8-14", "15-30", "31-60", "61-120", "121-364", ['364 days','or More']],
            datasets: [{
                data: Uniuqevistcount,
                label: "Unique Visitors",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item1'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item1'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                fill: true
            },
            {
                data: getsessioncount,
                label: "Sessions",
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