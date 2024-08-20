var newReturnGraph;

$(document).ready(function () {
    ExportFunctionName = "WebNewReturnExport";
    GetUTCDateTimeRange(2);
});

function CallBackFunction() {
    ShowPageLoading();
    CurrentRowCount = 0;
    GetReport();
}

function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/Analytics/Dashboard/NewVsReturnReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    var GraphItem = { ShortDate: [], Single: [], NewVisitors: [], Repeat: [], Return: [] };
    var GraphItemDate = [];
    var CompareFirstData = { SessionCount: 0, UniqueVisitCount: 0, NewVisitorsCount: 0, SingleVisitorsCount: 0, RepeatVisitorsCount: 0, ReturningVisitorsCount: 0 };
    SetNoRecordContent('ui_tblReportData', 8, 'ui_tbodyReportData');
    if (newReturnGraph) {
        newReturnGraph.destroy();
    }
    if (response !== undefined && response !== null && response.NewVsReturnData.Table1 !== undefined && response.NewVsReturnData.Table1 !== null && response.NewVsReturnData.Table1.length > 0
        && response.NewVsReturnData.Table1[0].Session > 0) {
        var reportTableTrs;
        $.each(response.NewVsReturnData.Table1, function () {
            var currentDateData = ConvertDateObjectToDateTime(this.TrackerDate);

            var startdate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 00:00:00";
            var enddate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 23:59:59";

            var fromdate = ConvertDateTimeToUTC(startdate);
            fromdate = fromdate.getFullYear() + '-' + PrefixZero((fromdate.getMonth() + 1)) + '-' + PrefixZero(fromdate.getDate()) + " " + PrefixZero(fromdate.getHours()) + ":" + PrefixZero(fromdate.getMinutes()) + ":" + PrefixZero(fromdate.getSeconds());

            var todate = ConvertDateTimeToUTC(enddate);
            todate = todate.getFullYear() + '-' + PrefixZero((todate.getMonth() + 1)) + '-' + PrefixZero(todate.getDate()) + " " + PrefixZero(todate.getHours()) + ":" + PrefixZero(todate.getMinutes()) + ":" + PrefixZero(todate.getSeconds());

            //**** For Output Cache ToDateTime *******
            if (duration == 1)
                ToDateTime = todate = response.CurrentUTCDateTimeForOutputCache;
                //ToDateTime = todate= GetCurrentToDateTimeForOutPutCache(); // To maintain Same Datetime for Export & Uniquevisitors link
            //**** For Output Cache ToDateTime *******

            reportTableTrs += "<tr>" +
                "<td class='text-left'>" + monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate() + "</td>" +
                "<td>" + this.Session + "</td>" +
                "<td>" + (this.UniqueVisit != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + fromdate + "&To=" + todate + "&Type=0&From=NewReturn'>" + this.UniqueVisit + "</a>" : this.UniqueVisit) + "</td> " +
                "<td>" + (this.NewVisitors != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + fromdate + "&To=" + todate + "&Type=New&From=NewReturn'>" + this.NewVisitors + "</a>" : this.NewVisitors) + "</td> " +
                "<td>" + (this.SingleVisitors != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + fromdate + "&To=" + todate + "&Type=Single&From=NewReturn'>" + this.SingleVisitors + "</a>" : this.SingleVisitors) + "</td> " +
                "<td>" + (this.RepeatVisitors != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + fromdate + "&To=" + todate + "&Type=Repeat&From=NewReturn'>" + this.RepeatVisitors + "</a>" : this.RepeatVisitors) + "</td> " +
                "<td>" + (this.ReturningVisitors != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + fromdate + "&To=" + todate + "&Type=Returning&From=NewReturn'>" + this.ReturningVisitors + "</a>" : this.ReturningVisitors) + "</td> " +
                "<td>" + fn_AverageTime(this.TotalTime) + "</td> " +
                "</tr> ";

            GraphItemDate.push({ Date: currentDateData, Count: this.SingleVisitors, NewVisitors: this.NewVisitors, RepeatVisitors: this.RepeatVisitors, ReturningVisitors: this.ReturningVisitors });

            CompareFirstData.SessionCount += this.Session;
            CompareFirstData.UniqueVisitCount += this.UniqueVisit;
            CompareFirstData.NewVisitorsCount += this.NewVisitors;
            CompareFirstData.SingleVisitorsCount += this.SingleVisitors;
            CompareFirstData.RepeatVisitorsCount += this.RepeatVisitors;
            CompareFirstData.ReturningVisitorsCount += this.ReturningVisitors;
        });

        GraphItem.ShortDate.length = 0; GraphItem.NewVisitors.length = 0; GraphItem.Single.length = 0; GraphItem.Repeat.length = 0; GraphItem.Return.length = 0;

        let datedata = GetDateCountForGraphData(GraphItemDate, FromDateTime, ToDateTime);
        if (datedata != undefined && datedata != null && datedata.length > 0) {
            for (let i = 0; i < datedata.length; i++) {
                GraphItem.ShortDate.push(monthDetials[datedata[i].Date.getMonth()] + " " + datedata[i].Date.getDate());
                if (datedata[i].Count == 0) {
                    GraphItem.NewVisitors.push(0);
                    GraphItem.Single.push(0);
                    GraphItem.Repeat.push(0);
                    GraphItem.Return.push(0);
                } else {
                    GraphItem.NewVisitors.push(datedata[i].NewVisitors);
                    GraphItem.Single.push(datedata[i].Count);
                    GraphItem.Repeat.push(datedata[i].RepeatVisitors);
                    GraphItem.Return.push(datedata[i].ReturningVisitors);
                }
            }
        }


        GetOverAllComparision(CompareFirstData);

        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
    } else {
        ShowExportDiv(false);
    }

    BindGraph(GraphItem);
    HidePageLoading();
}

function GetOverAllComparision(CompareFirstData) {

    var from_Date = CalculateDateDifference();

    $.ajax({
        url: "/Analytics/Dashboard/NewVsReturnReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': from_Date, 'todate': FromDateTime }),
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
    if (response !== undefined && response !== null && response.NewVsReturnData.Table1 !== undefined && response.NewVsReturnData.Table1 !== null && response.NewVsReturnData.Table1.length > 0) {
        $.each(response.NewVsReturnData.Table1, function () {
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

    $("#ui_tbodyReportData").prepend(reportTableTrs);
}

function BindGraph(GraphItem) {
    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;
    newReturnGraph = new Chart(document.getElementById("ui_canvas_NewVsReturn"), {
        type: 'bar',
        data: {
            labels: GraphItem.ShortDate,
            datasets: [{
                data: GraphItem.NewVisitors,
                label: "New Visitors",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item1'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item1'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                fill: true
            },
            {
                data: GraphItem.Single,
                label: "Single Visitors",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item2'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item2'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item2'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item2'),
                fill: true
            },
            {
                data: GraphItem.Repeat,
                label: "Repeat Visitors",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item3'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item3'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item3'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item3'),
                fill: true
                },
                {
                    data: GraphItem.Return,
                    label: "Returning Visitors",
                    borderWidth: 1,
                    borderColor: cssvar('--BarChart-BorderColor-Item4'),
                    hoverBorderColor: cssvar('--BarChart-BorderColor-Item4'),
                    backgroundColor: cssvar('--BarChart-BackgroundColor-Item4'),
                    hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item4'),
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