var sessionVsUniqueGraph;

$(document).ready(function () {
    ExportFunctionName = "ExportEmailSmsReport";
    GetUTCDateTimeRange(2);
});

function CallBackFunction() {
    ShowPageLoading();
    GetReport();
}

function GetReport() {
    $.ajax({
        url: "/Analytics/Traffic/EmailSmsReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'key': 'Email' }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    var GraphItem = { ShortDate: [], Sessions: [], UniqueVisitors: [] };
    var GraphItemDate = [];
    SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');
    if (sessionVsUniqueGraph) {
        sessionVsUniqueGraph.destroy();
    }
    if (response !== undefined && response !== null && response.EmailSmsData.Table1 !== undefined && response.EmailSmsData.Table1 !== null && response.EmailSmsData.Table1.length > 0) {

        var reportTableTrs;

        $.each(response.EmailSmsData.Table1, function () {
            var currentDateData = ConvertDateObjectToDateTime(this.Date);
            var eachDate = monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate();

            var startdate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 00:00:00";
            var enddate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 23:59:59";

            var fromdate = ConvertDateTimeToUTC(startdate);
            fromdate = fromdate.getFullYear() + '-' + PrefixZero((fromdate.getMonth() + 1)) + '-' + PrefixZero(fromdate.getDate()) + " " + PrefixZero(fromdate.getHours()) + ":" + PrefixZero(fromdate.getMinutes()) + ":" + PrefixZero(fromdate.getSeconds());

            var todate = ConvertDateTimeToUTC(enddate);
            todate = todate.getFullYear() + '-' + PrefixZero((todate.getMonth() + 1)) + '-' + PrefixZero(todate.getDate()) + " " + PrefixZero(todate.getHours()) + ":" + PrefixZero(todate.getMinutes()) + ":" + PrefixZero(todate.getSeconds());
            //**** For Output Cache ToDateTime *******
            if (duration == 1)
                ToDateTime = todate = response.CurrentUTCDateTimeForOutputCache;
            //**** For Output Cache ToDateTime *******
            reportTableTrs += "<tr>" +
                "<td class='text-left'>" + eachDate + "</td>" +
                "<td>" + this.Session + "</td>" +
                "<td>" + (this.UniqueVisit != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + fromdate + "&To=" + todate + "&Source=Email'>" + this.UniqueVisit + "</a>" : this.UniqueVisit) + "</td> " +
                "<td>" + this.TotalVisit + "</td>" +
                "<td>" + fn_AverageTime(this.UniqueVisit) + "</td> " +
                "</tr> ";

            GraphItemDate.push({ Date: currentDateData, Count: this.Session, UniqueVisit: this.UniqueVisit });
        });
        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
    } else {
        ShowExportDiv(false);
    }

    GraphItem.ShortDate.length = 0; GraphItem.Sessions.length = 0; GraphItem.UniqueVisitors.length = 0;

    let datedata = GetDateCountForGraphData(GraphItemDate, FromDateTime, ToDateTime);
    if (datedata != undefined && datedata != null && datedata.length > 0) {
        for (let i = 0; i < datedata.length; i++) {
            GraphItem.ShortDate.push(monthDetials[datedata[i].Date.getMonth()] + " " + datedata[i].Date.getDate());
            if (datedata[i].Count == 0) {
                GraphItem.Sessions.push(0);
                GraphItem.UniqueVisitors.push(0);
            } else {
                GraphItem.Sessions.push(datedata[i].Count);
                GraphItem.UniqueVisitors.push(datedata[i].UniqueVisit);
            }
        }
    }


    BindGraph(GraphItem);
    HidePageLoading();
}

function BindGraph(GraphItem) {
    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;
    sessionVsUniqueGraph = new Chart(document.getElementById("ui_canvas_emailSources"), {
        type: 'line',
        data: {
            labels: GraphItem.ShortDate,
            datasets: [{
                data: GraphItem.UniqueVisitors,
                label: "Unique Visitors",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item1'),
                hoverBorderColor: cssvar('--LineChart-BorderColor-Item1'),
                backgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                fill: true
            },
            {
                data: GraphItem.Sessions,
                label: "Sessions",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item2'),
                hoverBorderColor: cssvar('--LineChart-BorderColor-Item2'),
                backgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
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
                    boxHeight: 0
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