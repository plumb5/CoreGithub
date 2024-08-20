var sessionGraph;

$(document).ready(function () {
    ExportFunctionName = "WebSessionExport";
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
        url: "/Analytics/Dashboard/VisitsReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    var GraphItem = { ShortDate: [], Session: [], Unique: [] };
    var GraphItemDate = [];
    var CompareFirstData = { SessionCount: 0, UniqueVisitCount: 0, PageViewCount: 0, NewVisitorsCount: 0 };
    SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
    if (sessionGraph) {
        sessionGraph.destroy();
    }
    if (response !== undefined && response !== null && response.VisitorSessionData.Table1 !== undefined && response.VisitorSessionData.Table1 !== null && response.VisitorSessionData.Table1.length > 0
    && response.VisitorSessionData.Table1[0].Session >0) {       
        var reportTableTrs;
        $.each(response.VisitorSessionData.Table1, function () {
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
                "<td>" + (this.UniqueVisit != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + fromdate + "&To=" + todate + "&From=Session'>" + this.UniqueVisit + "</a>" : this.UniqueVisit) + "</td> " +
                "<td>" + (this.TotalVisit !== null ? this.TotalVisit : "0") + "</td> " +
                "<td>" + (this.NewVisitors != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + fromdate + "&To=" + todate + "&Type=New&&From=Session'>" + this.NewVisitors + "</a>" : this.NewVisitors) + "</td> " +
                "<td>" + fn_AverageTime(this.TotalTime) + "</td> " +
                "</tr> ";

            GraphItemDate.push({ Date: currentDateData, Count: this.Session, UniqueVisit: this.UniqueVisit });

            CompareFirstData.SessionCount += this.Session;
            CompareFirstData.UniqueVisitCount += this.UniqueVisit;
            CompareFirstData.PageViewCount += this.TotalVisit !== null ? this.TotalVisit : "0";
            CompareFirstData.NewVisitorsCount += this.NewVisitors;
        });

        GraphItem.ShortDate.length = 0; GraphItem.Session.length = 0; GraphItem.Unique.length = 0;

        let datedata = GetDateCountForGraphData(GraphItemDate, FromDateTime, ToDateTime);
        if (datedata != undefined && datedata != null && datedata.length > 0) {
            for (let i = 0; i < datedata.length; i++) {
                GraphItem.ShortDate.push(monthDetials[datedata[i].Date.getMonth()] + " " + datedata[i].Date.getDate());
                if (datedata[i].Count == 0) {
                    GraphItem.Session.push(0);
                    GraphItem.Unique.push(0);
                } else {
                    GraphItem.Session.push(datedata[i].Count);
                    GraphItem.Unique.push(datedata[i].UniqueVisit);
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
        url: "/Analytics/Dashboard/VisitsReport",
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
    var CompareSecondData = { SessionCount: 0, UniqueVisitCount: 0, PageViewCount: 0, NewVisitorsCount: 0 };
    var PerCentValue = 0;
    if (response !== undefined && response !== null && response.VisitorSessionData.Table1 !== undefined && response.VisitorSessionData.Table1 !== null && response.VisitorSessionData.Table1.length > 0) {
        $.each(response.VisitorSessionData.Table1, function () {
            CompareSecondData.SessionCount += this.Session;
            CompareSecondData.UniqueVisitCount += this.UniqueVisit;
            CompareSecondData.PageViewCount += this.TotalVisit !== null ? this.TotalVisit : "0";
            CompareSecondData.NewVisitorsCount += this.NewVisitors;
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

    PerCentValue = CalculatePercentage(CompareFirstData.PageViewCount, CompareSecondData.PageViewCount);
    if (CompareSecondData.PageViewCount == CompareFirstData.PageViewCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.PageViewCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.PageViewCount > CompareSecondData.PageViewCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.PageViewCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.PageViewCount < CompareSecondData.PageViewCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.PageViewCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropdown'></i><span>" + PerCentValue + "%</span></p></td>";
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

    reportTableTrs += "<td></td></tr>";

    $("#ui_tbodyReportData").prepend(reportTableTrs);
}

function BindGraph(GraphItem) {
    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;
    new Chart(document.getElementById("ui_canvas_sessionData"), {
        type: 'line',
        data: {
            labels: GraphItem.ShortDate,
            datasets: [{
                data: GraphItem.Session,
                label: "Sessions",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item1'),
                hoverBorderColor: cssvar('--LineChart-BorderColor-Item1'),
                backgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                fill: true
            },
            {
                data: GraphItem.Unique,
                label: "Unique Visitors",
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