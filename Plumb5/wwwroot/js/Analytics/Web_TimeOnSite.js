
var TimeOnSiteChart;

$(document).ready(function () {
    ExportFunctionName = "TimeOnSiteReportExport";
    RemoveExportDataRange();
    GetUTCDateTimeRange(2);
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    GetReport();
}

GetReport = function () {

    $.ajax({
        url: "/Analytics/Dashboard/TimeOnSiteReport",
        type: 'Post',
         
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
};

function BindReport(response) {

    var GraphItem = { optiondate: [],Time: [], AverageTime: [] };
    var GraphItemDate = [];
    var CompareFirstData = { SessionCount: 0, UniqueVisitCount: 0, TotalVisit:0, NewVisitorsCount: 0, };

    SetNoRecordContent('ui_tblReportData', 6, 'ui_tbodyReportData');
    if (TimeOnSiteChart) {
        TimeOnSiteChart.destroy();
    }
    if (response != undefined && response != null && response.timedata.Table1 != undefined && response.timedata.Table1 != null && response.timedata.Table1.length > 0
        && response.timedata.Table1[0].Session >0) {

        var reportTableTrs, DateShort, GraphDate, Datefrom, Dateto;

        $.each(response.timedata.Table1, function () {
            if (this.TrackerDate != null)
                var currentDateData = ConvertDateObjectToDateTime(this.TrackerDate);

            let AmorPm = currentDateData.getHours() >= 12 ? "PM" : "AM";
            var startdate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 00:00:00";
            var enddate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 23:59:59";

            var fromdate = ConvertDateTimeToUTC(startdate);
            Datefrom = fromdate.getFullYear() + '-' + PrefixZero((fromdate.getMonth() + 1)) + '-' + PrefixZero(fromdate.getDate()) + " " + PrefixZero(fromdate.getHours()) + ":" + PrefixZero(fromdate.getMinutes()) + ":" + PrefixZero(fromdate.getSeconds());

            var todate = ConvertDateTimeToUTC(enddate);
            Dateto = todate.getFullYear() + '-' + PrefixZero((todate.getMonth() + 1)) + '-' + PrefixZero(todate.getDate()) + " " + PrefixZero(todate.getHours()) + ":" + PrefixZero(todate.getMinutes()) + ":" + PrefixZero(todate.getSeconds());


            if (duration == 1) {
                DateShort = monthDetials[currentDateData.getMonth()] + " - " + currentDateData.getDate() + " " + currentDateData.getHours() + " " + AmorPm;
                GraphDate = currentDateData.getHours() + " " + AmorPm;
            }
            else {
                DateShort = monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate();
                GraphDate = monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate();
            }
            //**** For Output Cache ToDateTime *******
            if (duration == 1)
                ToDateTime = Dateto = response.CurrentUTCDateTimeForOutputCache;
                //ToDateTime = todate= GetCurrentToDateTimeForOutPutCache(); // To maintain Same Datetime for Export & Uniquevisitors link
            //**** For Output Cache ToDateTime *******
            reportTableTrs += "<tr>" +
                "<td>" + DateShort + "</td>" +
                "<td>" + fn_AverageTime(this.TotalTime) + "</td>" +
                "<td>" + this.Session + "</td>" +
                "<td>" + (this.UniqueVisit != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + Datefrom + "&To=" + Dateto + "&RedirectedFrom=TimeOnSite'>" + this.UniqueVisit + "</a>" : this.UniqueVisit) + "</td>" +
                "<td>" + this.TotalVisit + "</td>" +
                "<td>" + (this.NewVisitors != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + Datefrom + "&To=" + Dateto + "&Type=New&RedirectedFrom=TimeOnSite'>" + this.NewVisitors + "</a>" : this.NewVisitors) + "</td>" +
                "</tr > ";

            //GraphItem.optiondate.push(GraphDate);
            //GraphItem.getrepeatcount.push(this.TotalTime);

            GraphItemDate.push({ Date: currentDateData, Count: this.TotalTime, AverageTime: fn_AverageTime(this.TotalTime) });
            CompareFirstData.SessionCount += this.Session;
            CompareFirstData.UniqueVisitCount += this.UniqueVisit;
            CompareFirstData.TotalVisit += this.TotalVisit;
            CompareFirstData.NewVisitorsCount += this.NewVisitors;
            

        });

        GraphItem.optiondate.length = 0; GraphItem.AverageTime.length = 0;

        let datedata = GetDateCountForGraphData(GraphItemDate, FromDateTime, ToDateTime);
        if (datedata != undefined && datedata != null && datedata.length > 0) {
            for (let i = 0; i < datedata.length; i++) {
                GraphItem.optiondate.push(monthDetials[datedata[i].Date.getMonth()] + " " + datedata[i].Date.getDate());
                if (datedata[i].Count == 0) {
                    GraphItem.Time.push(0);
                } else {
                    GraphItem.Time.push(datedata[i].Count);
                }
            }
        }

        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        GetOverAllComparision(CompareFirstData);
        ShowExportDiv(true);
    } else {
        ShowExportDiv(false);
    }

    BindTimeOnSiteGraph(GraphItem);
    HidePageLoading();

};

function GetOverAllComparision(CompareFirstData) {

    var from_Date = CalculateDateDifference();

    $.ajax({
        url: "/Analytics/Dashboard/TimeOnSiteReport",
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
    var CompareSecondData = { SessionCount: 0, UniqueVisitCount: 0,TotalVisit:0, NewVisitorsCount: 0  };
    var PerCentValue = 0;
    if (response !== undefined && response !== null && response.timedata.Table1 !== undefined && response.timedata.Table1 !== null && response.timedata.Table1.length > 0) {
        $.each(response.timedata.Table1, function () {
            CompareSecondData.SessionCount += this.Session;
            CompareSecondData.UniqueVisitCount += this.UniqueVisit;
            CompareSecondData.TotalVisit += this.TotalVisit;
            CompareSecondData.NewVisitorsCount += this.NewVisitors;
            
            
        });
    }

    var reportTableTrs = "<tr class='isnotsortable'><td></td>";
    reportTableTrs += "<td></td>";
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

    PerCentValue = CalculatePercentage(CompareFirstData.TotalVisit, CompareSecondData.TotalVisit);
    if (CompareSecondData.TotalVisit == CompareFirstData.TotalVisit) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.TotalVisit + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.TotalVisit > CompareSecondData.TotalVisit) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.TotalVisit + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.TotalVisit < CompareSecondData.TotalVisit) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.TotalVisit + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropdown'></i><span>" + PerCentValue + "%</span></p></td>";
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

    reportTableTrs += "</tr>";

    $("#ui_tbodyReportData").prepend(reportTableTrs);
}




//Bind Data to Graph
BindTimeOnSiteGraph = function (GraphItemDate) {

    //Charts Start here

    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    // line chart start here
    TimeOnSiteChart = new Chart(document.getElementById("ui_canvas_TimeOnSiteData"), {
        type: 'line',
        data: {
            labels: GraphItemDate.optiondate,
            datasets: [{
                data: GraphItemDate.Time,
                label: "Average time on site",
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

