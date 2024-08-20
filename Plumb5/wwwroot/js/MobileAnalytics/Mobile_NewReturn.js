var NewReturnGraph;
var GraphItem = { ShortDate: [], Single: [], Repeat: [], Return: [] };
$(document).ready(function () {
    ShowPageLoading();
    ExportFunctionName = "ExportNewReturnVisitsReport";
    GetUTCDateTimeRange(2);
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    GetReport();
}

function GetReport() {
    $.ajax({
        url: "/MobileAnalytics/MobileApp/VisitsReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    var CompareFirstData = { SessionCount: 0, UniqueVisitCount: 0, NewVisitorsCount: 0, SingleVisitorsCount: 0, RepeatVisitorsCount: 0, ReturningVisitorsCount: 0 };

    GraphItem = { ShortDate: [], Single: [], Repeat: [], Return: [] };
    var GraphItemDate = [];
    SetNoRecordContent('ui_tableReport', 8, 'ui_trbodyReportData');

    if (NewReturnGraph) {
        NewReturnGraph.destroy();
    }

    if (response != undefined && response != null && response.Table != undefined && response.Table != null && response.Table.length > 0 && response.Table[0].NewVisitors > 0) {

        $("#ui_tableReport").removeClass('no-data-records');
        $("#ui_trbodyReportData").html('');
        ShowExportDiv(true);
        $.each(response.Table, function () {
            /** Template string literal has been implement */
            let DateShort = "NA";
            let currentDateData = "";
            if (this.TrackerDate != null) {
                currentDateData = ConvertDateObjectToDateTime(this.TrackerDate);
                DateShort = monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate();
                GraphItem.ShortDate.push(DateShort);
            }

            let Time = this.Session == "0" ? "0d 0h 0m 0s" : fn_AverageTime(this.TotalTime);


            var startdate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 00:00:00";
            var enddate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 23:59:59";

            var fromdate = ConvertDateTimeToUTC(startdate);
            fromdate = fromdate.getFullYear() + '-' + PrefixZero((fromdate.getMonth() + 1)) + '-' + PrefixZero(fromdate.getDate()) + " " + PrefixZero(fromdate.getHours()) + ":" + PrefixZero(fromdate.getMinutes()) + ":" + PrefixZero(fromdate.getSeconds());

            var todate = ConvertDateTimeToUTC(enddate);
            todate = todate.getFullYear() + '-' + PrefixZero((todate.getMonth() + 1)) + '-' + PrefixZero(todate.getDate()) + " " + PrefixZero(todate.getHours()) + ":" + PrefixZero(todate.getMinutes()) + ":" + PrefixZero(todate.getSeconds());


            let UniqueVisits = this.UniqueVisit != "0" ? "<a href='/MobileAnalytics/MobileApp/UniqueVisits?dur=0&Frm=" + fromdate + "&To=" + todate + "&Type=0'>" + this.UniqueVisit + "</a>" : this.UniqueVisit;

            let NewVisitors = this.NewVisitors != null ? this.NewVisitors : 0;
            let SingleVisitors = this.SingleVisitors != null ? this.SingleVisitors : 0;
            let RepeatVisitors = this.RepeatVisitors != null ? this.RepeatVisitors : 0;
            let ReturningVisitors = this.ReturningVisitors != null ? this.ReturningVisitors : 0;

            let reportTablerows = `<tr>
                                <td>${DateShort}</td>
                                <td>${this.Session}</td>
                                <td>${UniqueVisits}</td>
                                <td>${NewVisitors}</td>
                                <td>${SingleVisitors}</td>
                                <td>${RepeatVisitors}</td>
                                <td>${ReturningVisitors}</td>
                                <td>${Time}</td>
                           </tr>`;
            $("#ui_trbodyReportData").append(reportTablerows);

            GraphItemDate.push({ Date: currentDateData, Count: SingleVisitors, RepeatVisitors: RepeatVisitors, ReturningVisitors: ReturningVisitors });

            CompareFirstData.SessionCount += this.Session;
            CompareFirstData.UniqueVisitCount += this.UniqueVisit;
            CompareFirstData.NewVisitorsCount += this.NewVisitors != null ? this.NewVisitors : 0;
            CompareFirstData.SingleVisitorsCount += this.SingleVisitors != null ? this.SingleVisitors : 0;
            CompareFirstData.RepeatVisitorsCount += this.RepeatVisitors != null ? this.RepeatVisitors : 0;
            CompareFirstData.ReturningVisitorsCount += this.ReturningVisitors != null ? this.ReturningVisitors : 0;
        });

        GraphItem.ShortDate.length = 0; GraphItem.Single.length = 0; GraphItem.Repeat.length = 0; GraphItem.Return.length = 0;

        let datedata = GetDateCountForGraphData(GraphItemDate, FromDateTime, ToDateTime);
        if (datedata != undefined && datedata != null && datedata.length > 0) {
            for (let i = 0; i < datedata.length; i++) {
                GraphItem.ShortDate.push(monthDetials[datedata[i].Date.getMonth()] + " " + datedata[i].Date.getDate());
                if (datedata[i].Count == 0) {
                    GraphItem.Single.push(0);
                    GraphItem.Repeat.push(0);
                    GraphItem.Return.push(0);
                } else {
                    GraphItem.Single.push(datedata[i].Count);
                    GraphItem.Repeat.push(datedata[i].RepeatVisitors);
                    GraphItem.Return.push(datedata[i].ReturningVisitors);
                }
            }
        }


        GetOverAllComparision(CompareFirstData);
    } else {
        ShowExportDiv(false);
    }
    BindChartDetails(GraphItem);
    HidePageLoading();
}

function BindChartDetails(GraphItem) {
    //Charts Start here

    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    // line chart start here
    new Chart(document.getElementById("sessionsData"), {
        type: 'bar',
        data: {
            labels: GraphItem.ShortDate,
            datasets: [{
                data: GraphItem.Single,
                label: "Single Visitors",
                borderWidth: 1,
                borderColor: cssvar("--BarChart-BorderColor-Item1"),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item1'),
                backgroundColor: cssvar("--BarChart-BackgroundColor-Item1"),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                fill: true
            },
            {
                data: GraphItem.Repeat,
                label: "Repeat Visitor",
                borderWidth: 1,
                borderColor: cssvar("--BarChart-BorderColor-Item2"),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item2'),
                backgroundColor: cssvar("--BarChart-BackgroundColor-Item2"),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item2'),
                fill: true
            },
            {
                data: GraphItem.Return,
                label: "Returning Visitor",
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

function GetOverAllComparision(CompareFirstData) {

    var from_Date = CalculateDateDifference();

    $.ajax({
        url: "/MobileAnalytics/MobileApp/VisitsReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindOverAllComparision(response, CompareFirstData);
        },
        error: ShowAjaxError
    });
}

function BindOverAllComparision(response, CompareFirstData) {
    var CompareSecondData = { SessionCount: 0, UniqueVisitCount: 0, NewVisitorsCount: 0, SingleVisitorsCount: 0, RepeatVisitorsCount: 0, ReturningVisitorsCount: 0 };
    var PerCentValue = 0;
    if (response != undefined && response != null && response.Table != undefined && response.Table != null && response.Table.length > 0) {
        $.each(response.Table, function () {
            CompareSecondData.SessionCount += this.Session;
            CompareSecondData.UniqueVisitCount += this.UniqueVisit;
            CompareSecondData.NewVisitorsCount += this.NewVisitors;
            CompareSecondData.SingleVisitorsCount += this.SingleVisitors;
            CompareSecondData.RepeatVisitorsCount += this.RepeatVisitors;
            CompareSecondData.ReturningVisitorsCount += this.ReturningVisitors;
        });
    }

    var reportTableTrs = "<tr class='isnotsortable'><td></td>";

    PerCentValue = CalculatePercentage(CompareFirstData.SessionCount, CompareSecondData.SessionCount);
    if (CompareSecondData.SessionCount == CompareFirstData.SessionCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.SessionCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.SessionCount > CompareSecondData.SessionCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.SessionCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.SessionCount < CompareSecondData.SessionCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.SessionCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropdown'></i><span>" + PerCentValue + "%</span></p></td>";
    }

    PerCentValue = CalculatePercentage(CompareFirstData.UniqueVisitCount, CompareSecondData.UniqueVisitCount);
    if (CompareSecondData.UniqueVisitCount == CompareFirstData.UniqueVisitCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.UniqueVisitCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.UniqueVisitCount > CompareSecondData.UniqueVisitCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.UniqueVisitCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.UniqueVisitCount < CompareSecondData.UniqueVisitCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.UniqueVisitCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropdown'></i><span>" + PerCentValue + "%</span></p></td>";
    }

    PerCentValue = CalculatePercentage(CompareFirstData.NewVisitorsCount, CompareSecondData.NewVisitorsCount);
    if (CompareSecondData.NewVisitorsCount == CompareFirstData.NewVisitorsCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.NewVisitorsCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.NewVisitorsCount > CompareSecondData.NewVisitorsCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.NewVisitorsCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.NewVisitorsCount < CompareSecondData.NewVisitorsCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.NewVisitorsCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropdown'></i><span>" + PerCentValue + "%</span></p></td>";
    }

    PerCentValue = CalculatePercentage(CompareFirstData.SingleVisitorsCount, CompareSecondData.SingleVisitorsCount);
    if (CompareSecondData.SingleVisitorsCount == CompareFirstData.SingleVisitorsCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.SingleVisitorsCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.SingleVisitorsCount > CompareSecondData.SingleVisitorsCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.SingleVisitorsCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.SingleVisitorsCount < CompareSecondData.SingleVisitorsCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.SingleVisitorsCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropdown'></i><span>" + PerCentValue + "%</span></p></td>";
    }

    PerCentValue = CalculatePercentage(CompareFirstData.RepeatVisitorsCount, CompareSecondData.RepeatVisitorsCount);
    if (CompareSecondData.RepeatVisitorsCount == CompareFirstData.RepeatVisitorsCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.RepeatVisitorsCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.RepeatVisitorsCount > CompareSecondData.RepeatVisitorsCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.RepeatVisitorsCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.RepeatVisitorsCount < CompareSecondData.RepeatVisitorsCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.RepeatVisitorsCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropdown'></i><span>" + PerCentValue + "%</span></p></td>";
    }

    PerCentValue = CalculatePercentage(CompareFirstData.ReturningVisitorsCount, CompareSecondData.ReturningVisitorsCount);
    if (CompareSecondData.ReturningVisitorsCount == CompareFirstData.ReturningVisitorsCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.ReturningVisitorsCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.ReturningVisitorsCount > CompareSecondData.ReturningVisitorsCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.ReturningVisitorsCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.ReturningVisitorsCount < CompareSecondData.ReturningVisitorsCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.ReturningVisitorsCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropdown'></i><span>" + PerCentValue + "%</span></p></td>";
    }

    reportTableTrs += "<td></td></tr>";

    $("#ui_trbodyReportData").prepend(reportTableTrs);
}