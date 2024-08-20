var TimeOnSiteChart;
var GraphItem = { optiondate: [], getrepeatcount: [] };

$(document).ready(function () {
    ShowPageLoading();
    ExportFunctionName = "ExportTimeOnMobileReport";
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
        url: "/MobileAnalytics/MobileApp/TimeOnMobileReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    var CompareFirstData = { SessionCount: 0, UniqueVisitCount: 0, TotalVisit: 0 };

    GraphItem = { optiondate: [], getrepeatcount: [] };
    var GraphItemDate = [];
    SetNoRecordContent('ui_tableReport', 6, 'ui_trbodyReportData');
    if (TimeOnSiteChart) {
        TimeOnSiteChart.destroy();
    }

    if (response != undefined && response != null && response.Table != undefined && response.Table != null && response.Table.length > 0) {
        $("#ui_tableReport").removeClass('no-data-records');
        $("#ui_trbodyReportData").html('');
        ShowExportDiv(true);
        $.each(response.Table, function () {
            GraphItem.getrepeatcount.push(this.TotalTime);

            /** Template string literal has been implement */
            let DateShort = "NA";
            let currentDateData = "";
            if (this.TrackerDate != null) {
                currentDateData = ConvertDateObjectToDateTime(this.TrackerDate);
                DateShort = monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate();
            }

            var startdate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 00:00:00";
            var enddate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 23:59:59";

            var fromdate = ConvertDateTimeToUTC(startdate);
            fromdate = fromdate.getFullYear() + '-' + PrefixZero((fromdate.getMonth() + 1)) + '-' + PrefixZero(fromdate.getDate()) + " " + PrefixZero(fromdate.getHours()) + ":" + PrefixZero(fromdate.getMinutes()) + ":" + PrefixZero(fromdate.getSeconds());

            var todate = ConvertDateTimeToUTC(enddate);
            todate = todate.getFullYear() + '-' + PrefixZero((todate.getMonth() + 1)) + '-' + PrefixZero(todate.getDate()) + " " + PrefixZero(todate.getHours()) + ":" + PrefixZero(todate.getMinutes()) + ":" + PrefixZero(todate.getSeconds());



            let Time = this.Session == "0" ? "0d 0h 0m 0s" : fn_AverageTime(this.TotalTime);
            let UniqueVisits = (this.UniqueVisit != "0" ? "<a href='/MobileAnalytics/MobileApp/UniqueVisits?dur=0&Frm=" + fromdate + "&To=" + todate + "&RedirectedFrom=TimeOnSite'>" + this.UniqueVisit + "</a>" : this.UniqueVisit);

            let reportTablerows = `<tr>
                              <td>${DateShort}</td>
                              <td>${Time}</td>
                              <td>${this.Session}</td>
                              <td>${UniqueVisits}</td>
                              <td>${this.TotalVisit}</td>
                              <td>${this.NewVisitors}</td>
                           </tr>`;
            $("#ui_trbodyReportData").append(reportTablerows);

            GraphItemDate.push({ Date: currentDateData, Count: this.TotalTime });

            CompareFirstData.SessionCount += this.Session;
            CompareFirstData.UniqueVisitCount += this.UniqueVisit;
            CompareFirstData.TotalVisit += this.TotalVisit != null ? this.TotalVisit : 0;
        });

        GraphItem.optiondate.length = 0; GraphItem.getrepeatcount.length = 0;

       
       

        let datedata = GetDateCountForGraphData(GraphItemDate, FromDateTime, ToDateTime);
        if (datedata != undefined && datedata != null && datedata.length > 0) {
            for (let i = 0; i < datedata.length; i++) {
                GraphItem.optiondate.push(monthDetials[datedata[i].Date.getMonth()] + " " + datedata[i].Date.getDate());
                if (datedata[i].Count == 0) {
                    GraphItem.getrepeatcount.push(0);
                } else {
                    GraphItem.getrepeatcount.push(datedata[i].Count);
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
        type: 'line',
        data: {
            labels: GraphItem.optiondate,
            datasets: [{
                data: GraphItem.getrepeatcount,
                label: "Average time on mobile",
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


function GetOverAllComparision(CompareFirstData) {

    var from_Date = CalculateDateDifference();

    $.ajax({
        url: "/MobileAnalytics/MobileApp/TimeOnMobileReport",
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
    var CompareSecondData = { SessionCount: 0, UniqueVisitCount: 0, TotalVisit: 0 };
    var PerCentValue = 0;
    if (response != undefined && response != null && response.Table != undefined && response.Table != null && response.Table.length > 0) {
        $.each(response.Table, function () {
            CompareSecondData.SessionCount += this.Session;
            CompareSecondData.UniqueVisitCount += this.UniqueVisit;
            CompareSecondData.TotalVisit += this.TotalVisit;
           
        });
    }

    var reportTableTrs = "<tr class='isnotsortable'><td></td><td></td>";

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

   

    reportTableTrs += "<td></td></tr>";

    $("#ui_trbodyReportData").prepend(reportTableTrs);
}