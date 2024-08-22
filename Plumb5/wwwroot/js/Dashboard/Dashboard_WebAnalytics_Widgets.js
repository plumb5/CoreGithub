//************************* WEB ANALYTICS STARTS ************************************************************************************************

//Sessions Vs UniqueVisitors Chart *****************
function CreateSessionsUniqueVisitorsChart(canvasid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    $.ajax({
        url: "/Dashboard/DashboardOverview/VisitsReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindSessionsUniqueVisitorsGraph(response, canvasid);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });



}
function BindSessionsUniqueVisitorsGraph(response, canvasid) {
    var GraphItem = { ShortDate: [], Session: [], Unique: [] };
    var GraphItemDate = [];
    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0 && response.Table1[0].TrackerDate != undefined) {
        $.each(response.Table1, function () {
            var currentDateData = ConvertDateObjectToDateTime(this.TrackerDate);

            var startdate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 00:00:00";
            var enddate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 23:59:59";

            var fromdate = ConvertDateTimeToUTC(startdate);
            fromdate = fromdate.getFullYear() + '-' + PrefixZero((fromdate.getMonth() + 1)) + '-' + PrefixZero(fromdate.getDate()) + " " + PrefixZero(fromdate.getHours()) + ":" + PrefixZero(fromdate.getMinutes()) + ":" + PrefixZero(fromdate.getSeconds());

            var todate = ConvertDateTimeToUTC(enddate);
            todate = todate.getFullYear() + '-' + PrefixZero((todate.getMonth() + 1)) + '-' + PrefixZero(todate.getDate()) + " " + PrefixZero(todate.getHours()) + ":" + PrefixZero(todate.getMinutes()) + ":" + PrefixZero(todate.getSeconds());

            GraphItemDate.push({ Date: currentDateData, Count: this.Session, UniqueVisit: this.UniqueVisit });

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

    }
    new Chart(document.getElementById(canvasid), {
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
                label: "Unique Visitor",
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
            plugins: {
                datalabels: {
                    display: false
                }
            },
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
    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();
}

//Frequency chart **********************************
function CreateFrequencyChart(canvasid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();
    $.ajax({
        url: "/Dashboard/DashboardOverview/GetFrequencyReport",
        type: 'Post',
        data: "{'accountId':'" + Plumb5AccountId + "','duration':'" + duration + "','fromdate':'" + FromDateTime + "','todate':'" + ToDateTime + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindFrequencyGraph(response, canvasid);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindFrequencyGraph(response, canvasid) {
    var GraphItem = { frequency: [], getuniquevisitcount: [], getpageviewscount: [] };
    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
        $.each(response.Table1, function () {
            GraphItem.frequency.push(this.Frequency);
            GraphItem.getuniquevisitcount.push(this.UniqueVisits);
            GraphItem.getpageviewscount.push(this.TotalVisits);
        });
    }
    new Chart(document.getElementById(canvasid), {
        type: 'bar',
        data: {
            labels: GraphItem.frequency,
            datasets: [{
                data: GraphItem.getpageviewscount,
                label: "Page Views",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item1'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item1'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                fill: true
            },
            {
                data: GraphItem.getuniquevisitcount,
                label: "Unique Visitor",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item2'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item2'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item2'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item2'),
                fill: true
            }
            ]
        },
        options: {
            plugins: {
                datalabels: {
                    display: false
                }
            },
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
    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();

    //WidgetCallBackfunction();
}

//Countries Table *********************************
function GetCountriesData(divId) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    var cachedFromDateTime = new Date(FromDateTime);
    cachedFromDateTime.setDate(cachedFromDateTime.getDate() - 1);
    cachedFromDateTime = cachedFromDateTime.getFullYear() + '-' + AddingPrefixZeroDayMonth((cachedFromDateTime.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(cachedFromDateTime.getDate()) + " 18:30:00";

    var cachedToDateTime = new Date(ToDateTime);
    cachedToDateTime.setDate(cachedToDateTime.getDate() - 1);
    cachedToDateTime = cachedToDateTime.getFullYear() + '-' + AddingPrefixZeroDayMonth((cachedToDateTime.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(cachedToDateTime.getDate()) + " 18:29:59";

    $.ajax({
        url: "/Dashboard/DashboardOverview/CountryReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': cachedFromDateTime, 'todate': cachedToDateTime, 'start': 0, 'end': 5 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindCountriesData(response, divId);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindCountriesData(response, divId) {

    var CountriesWidgetHtmlContent = //"<div class='tableWrapper mt-4'>"+
        "<div class='table-responsive min-h-300'>" +
        "<table id='ui_tblCountriesReportData' class='table'>" +
        "<thead>" +
        "<tr>" +
        "<th scope='col' class='m-p-w-170 text-left'>Countries</th>" +
        "<th class='m-p-w-120 text-left' scope='col'>Sessions</th>" +
        "<th class='helpIcon m-p-w-150 text-left' scope='col'>Unique Visitors</th>" +
        "<th class='helpIcon m-p-w-130 text-left' scope='col'>Page Views</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody id='ui_tbodyCountriesReportData'>" +
        "</tbody>" +
        "</table>" +
        "</div></div>";
    $('#' + divId).html(CountriesWidgetHtmlContent);

    //SetNoRecordContent('ui_tblCountriesReportData', 4, 'ui_tbodyCountriesReportData');
    if (response !== undefined && response !== null && response.CountryData.Table1 !== undefined && response.CountryData.Table1 !== null && response.CountryData.Table1.length > 0) {
        var reportCountryTableTrs, UniqueVisitorLink = "", CountryName = "";
        $.each(response.CountryData.Table1, function () {
            if (this.Country.toLowerCase() == 'unknown' || this.Country == '')
                CountryName = "<td class='text-left'><i class='unknown-flag'></i>unknown</td>";
            else
                CountryName = "<td class='text-left'><i class='flag flag-" + this.Flag.toLowerCase() + "'></i>" + this.Country + "</td>";

            UniqueVisitorLink = "<td>" + (this.UniqueVisits != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=" + duration + "&Frm=" + FromDateTime + "&To=" + ToDateTime + "&Country=" + (this.Country !== "" ? encodeURIComponent(this.Country.replace("'", "^")) : "UNKNOWN") + "'>" + this.UniqueVisits + "</a>" : this.UniqueVisits) + "</td>";

            reportCountryTableTrs += "<tr>" +
                "" + CountryName + "" +
                "<td>" + this.Session + "</td>" +
                "" + UniqueVisitorLink + "" +
                "<td>" + this.TotalVisits + "</td> " +
                "</tr> ";
        });
        // $("#ui_tblCountriesReportData").removeClass('no-data-records');
        $("#ui_tbodyCountriesReportData").html(reportCountryTableTrs);

    }
    else {
        $("#ui_tbodyCountriesReportData").append('<tr><td  colspan="4"><div class="no-data" style="height: 150px;">There is no data for this view</div></td></tr>');

    }

    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();
}

// Cities Chart  ***********************************
function GetCitiesData(divId) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    var cachedFromDateTime = new Date(FromDateTime);
    cachedFromDateTime.setDate(cachedFromDateTime.getDate() - 1);
    cachedFromDateTime = cachedFromDateTime.getFullYear() + '-' + AddingPrefixZeroDayMonth((cachedFromDateTime.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(cachedFromDateTime.getDate()) + " 18:30:00";

    var cachedToDateTime = new Date(ToDateTime);
    cachedToDateTime.setDate(cachedToDateTime.getDate() - 1);
    cachedToDateTime = cachedToDateTime.getFullYear() + '-' + AddingPrefixZeroDayMonth((cachedToDateTime.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(cachedToDateTime.getDate()) + " 18:29:59";


    $.ajax({
        url: "/Dashboard/DashboardOverview/CityReport",
        type: 'Post',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'fromdate': cachedFromDateTime, 'todate': cachedToDateTime, 'start': 0, 'end': 5, 'duration': duration }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindCitiesData(response, divId);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindCitiesData(response, divId) {

    var CitiesWidgetHtmlContent = //"<div class='tableWrapper mt-4'>"+
        "<div class='table-responsive min-h-300'>" +
        "<table id='ui_tblCitiesReportData' class='table'>" +
        "<thead>" +
        "<tr>" +
        "<th scope='col' class='m-p-w-170 text-left'>Countries</th>" +
        "<th class='m-p-w-120 text-left' scope='col'>Sessions</th>" +
        "<th class='helpIcon m-p-w-150 text-left' scope='col'>Unique Visitors</th>" +
        "<th class='helpIcon m-p-w-130 text-left' scope='col'>Page Views</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody id='ui_tbodyCitiesReportData'>" +
        "</tbody>" +
        "</table>" +
        "</div></div>";
    $('#' + divId).html(CitiesWidgetHtmlContent);

    //SetNoRecordContent('ui_tblCitiesReportData', 4, 'ui_tbodyCitiesReportData');
    if (response !== undefined && response !== null && response.CityData.Table1 !== undefined && response.CityData.Table1 !== null && response.CityData.Table1.length > 0) {
        var reportCityTableTrs, UniqueVisitorLink = "", CityName = "";
        $.each(response.CityData.Table1, function () {
            if (this.City.toLowerCase() == 'unknown')
                CityName = "<td class='text-left'><i class='unknown-flag'></i>" + this.City + "</td>";
            else
                CityName = "<td class='text-left'><i class='flag flag-" + this.Flag.toLowerCase() + "'></i>" + this.City + "</td>";

            UniqueVisitorLink = "<td>" + (this.UniqueVisits != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=" + duration + "&Frm=" + FromDateTime + "&To=" + ToDateTime + "&City=" + (this.City !== "" ? encodeURIComponent(this.City.replace("'", "^")) : "UNKNOWN") + "'>" + this.UniqueVisits + "</a>" : this.UniqueVisits) + "</td>";

            reportCityTableTrs += "<tr>" +
                "" + CityName + "" +
                "<td>" + this.Session + "</td>" +
                "" + UniqueVisitorLink + "" +
                "<td>" + this.TotalVisits + "</td> " +
                "</tr> ";
        });
        //$("#ui_tblCitiesReportData").removeClass('no-data-records');
        $("#ui_tbodyCitiesReportData").html(reportCityTableTrs);

    }
    else {
        $("#ui_tbodyCitiesReportData").append('<tr><td  colspan="4"><div class="no-data" style="height: 150px;">There is no data for this view</div></td></tr>');
    }
    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();


}

// Recency Chart **********************************
function CreateRecencyChart(canvasid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();
    $.ajax({
        url: "/Dashboard/DashboardOverview/GetRecency",
        type: 'Post',
        data: "{'accountId':'" + Plumb5AccountId + "','OffSet':0,'FetchNext':15}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindRecencyChart(response, canvasid);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindRecencyChart(response, canvasid) {
    var getdayssincecount = [], Uniuqevistcount = [], getPageviewcount = [], getsessioncount = [];
    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
        $.each(response.Table1, function () {
            Uniuqevistcount.push(this.UniqueVisits);
            getPageviewcount.push(this.PageViews);
            getsessioncount.push(this.Session);
            getdayssincecount.push(this.DaySince);
        });
    }
    new Chart(document.getElementById(canvasid), {
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
            plugins: {
                datalabels: {
                    display: false,
                },
            },
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
    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();
}



// Time Spent Chart ********************************
function CreateTimeSpentChart(canvasid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();
    $.ajax({
        url: "/Dashboard/DashboardOverview/GetTimeSpend",
        type: 'Post',
        data: "{'accountId':'" + Plumb5AccountId + "','fromdate':'" + FromDateTime + "','todate':'" + ToDateTime + "','duration':'" + duration + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindTimeSpentChart(response, canvasid);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindTimeSpentChart(response, canvasid) {
    var Uniuqevistcount = [], getPageviewcount = [], getsessioncount = [];
    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {

        $.each(response.Table1, function () {
            Uniuqevistcount.push(this.UniqueVisits);
            getPageviewcount.push(this.PageViews);
            getsessioncount.push(this.Session);

        });
    }
    new Chart(document.getElementById(canvasid), {
        type: 'line',
        data: {
            labels: ["0-10 Secs", "11-30 Secs", "31-60 Secs", "61-180 Secs", "181-300 Secs", "301-600 Secs"],
            datasets: [{
                data: Uniuqevistcount,
                label: "Unique Visitors",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item1'),
                pointBorderColor: cssvar('--LineChart-BorderColor-Item1'),
                hoverBorderColor: cssvar('--LineChart-BorderColor-Item1'),
                pointHoverBorderColor: cssvar('--LineChart-BorderColor-Item1'),

                backgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                pointBackgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                pointHoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                fill: true
            },
            {
                data: getsessioncount,
                label: "Sessions",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item2'),
                pointBorderColor: cssvar('--LineChart-BorderColor-Item2'),
                hoverBorderColor: cssvar('--LineChart-BorderColor-Item2'),
                pointHoverBorderColor: cssvar('--LineChart-BorderColor-Item2'),

                backgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                pointBackgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                pointHoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                fill: true
            },
            {
                data: getPageviewcount,
                label: "Page Views",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item3'),
                pointBorderColor: cssvar('--LineChart-BorderColor-Item3'),
                hoverBorderColor: cssvar('--LineChart-BorderColor-Item3'),
                pointHoverBorderColor: cssvar('--LineChart-BorderColor-Item3'),

                backgroundColor: cssvar('--LineChart-BackgroundColor-Item3'),
                hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item3'),
                pointBackgroundColor: cssvar('--LineChart-BackgroundColor-Item3'),
                pointHoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item3'),
                fill: true
            }
            ]
        },
        options: {
            plugins: {
                datalabels: {
                    display: false,
                },
            },
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
    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();


}

// Page Dapth Chart ********************************
function CreatePageDepthChart(canvasid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();
    $.ajax({
        url: "/Dashboard/DashboardOverview/GetPageDepth",
        type: 'Post',
        data: "{'accountId':'" + Plumb5AccountId + "','fromdate':'" + FromDateTime + "','todate':'" + ToDateTime + "','duration':'" + duration + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindPageDepthChart(response, canvasid);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindPageDepthChart(response, canvasid) {
    var Uniuqevistcount = [], getPageviewcount = [], getsessioncount = [];
    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {

        $.each(response.Table1, function (m) {
            Uniuqevistcount.push(this.UniqueVisits);
            getPageviewcount.push(this.PageViews);
            getsessioncount.push(this.Session);

        });
    }
    new Chart(document.getElementById(canvasid), {
        type: 'bar',
        data: {
            labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"],
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
            plugins: {
                datalabels: {
                    display: false,
                },
            },
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

    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();


}

//New Vs Return Chart *****************************
function CreateNewReturnChart(canvasid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    $.ajax({
        url: "/Dashboard/DashboardOverview/NewRepeatReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindNewReturnChart(response, canvasid);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindNewReturnChart(response, canvasid) {
    var GraphItem = { ShortDate: [], Single: [], Repeat: [], Return: [] };
    var GraphItemDate = [];
    if (response !== undefined && response !== null && response.Table1 !== undefined && response.Table1 !== null && response.Table1.length > 0 && response.Table1[0].TrackerDate != undefined) {
        $.each(response.Table1, function () {
            var currentDateData = ConvertDateObjectToDateTime(this.TrackerDate);

            var startdate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 00:00:00";
            var enddate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 23:59:59";

            var fromdate = ConvertDateTimeToUTC(startdate);
            fromdate = fromdate.getFullYear() + '-' + PrefixZero((fromdate.getMonth() + 1)) + '-' + PrefixZero(fromdate.getDate()) + " " + PrefixZero(fromdate.getHours()) + ":" + PrefixZero(fromdate.getMinutes()) + ":" + PrefixZero(fromdate.getSeconds());

            var todate = ConvertDateTimeToUTC(enddate);
            todate = todate.getFullYear() + '-' + PrefixZero((todate.getMonth() + 1)) + '-' + PrefixZero(todate.getDate()) + " " + PrefixZero(todate.getHours()) + ":" + PrefixZero(todate.getMinutes()) + ":" + PrefixZero(todate.getSeconds());
            GraphItemDate.push({ Date: currentDateData, Count: this.SingleVisitors, RepeatVisitors: this.RepeatVisitors, ReturningVisitors: this.ReturningVisitors });

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
    }
    new Chart(document.getElementById(canvasid), {
        type: 'bar',
        data: {
            labels: GraphItem.ShortDate,
            datasets: [{
                data: GraphItem.Single,
                label: "Single Visitors",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item1'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item1'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                fill: true
            },
            {
                data: GraphItem.Repeat,
                label: "Repeat Visitor",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item2'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item2'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item2'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item2'),
                fill: true
            },
            {
                data: GraphItem.Return,
                label: "Returning Visitor",
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
            plugins: {
                datalabels: {
                    display: false,
                },
            },
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
    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();


}

// All Traffic Source Chart ***********************
function CreateAllTrafficSourceChart(canvasid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    $.ajax({
        url: "/Dashboard/DashboardOverview/AllSourcesReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindAllTrafficSourceChart(response, canvasid);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindAllTrafficSourceChart(response, canvasid) {
    var GraphItemDate = [];
    var GraphItem = { optiondate: [], getdirectcount: [], getsearchcount: [], getrefercount: [], getSocialcount: [], getEmailcount: [], getSmscount: [], getPaidcount: [] };
    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
        $.each(response.Table1, function () {
            var currentDateData = ConvertDateObjectToDateTime(this.Date);
            var eachDate = monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate();
            GraphItemDate.push({ Date: currentDateData, Count: this.Direct, Search: this.Search, Refer: this.Refer, Social: this.Social, Email: this.Email, Sms: this.Sms, Paid: this.Paid });
        });
        GraphItem.optiondate.length = 0; GraphItem.getdirectcount.length = 0; GraphItem.getsearchcount.length = 0; GraphItem.getrefercount.length = 0; GraphItem.getrefercount.length = 0; GraphItem.getSocialcount.length = 0; GraphItem.getEmailcount.length = 0; GraphItem.getSmscount.length = 0; GraphItem.getPaidcount.length = 0;

        let datedata = GetDateCountForGraphData(GraphItemDate, FromDateTime, ToDateTime);
        if (datedata != undefined && datedata != null && datedata.length > 0) {
            for (let i = 0; i < datedata.length; i++) {
                GraphItem.optiondate.push(monthDetials[datedata[i].Date.getMonth()] + " " + datedata[i].Date.getDate());
                if (datedata[i].Count == 0) {
                    GraphItem.getdirectcount.push(0);
                    GraphItem.getsearchcount.push(0);
                    GraphItem.getrefercount.push(0);
                    GraphItem.getSocialcount.push(0);
                    GraphItem.getEmailcount.push(0);
                    GraphItem.getSmscount.push(0);
                    GraphItem.getPaidcount.push(0);
                } else {
                    GraphItem.getdirectcount.push(datedata[i].Count);
                    GraphItem.getsearchcount.push(datedata[i].Search);
                    GraphItem.getrefercount.push(datedata[i].Refer);
                    GraphItem.getSocialcount.push(datedata[i].Social);
                    GraphItem.getEmailcount.push(datedata[i].Email);
                    GraphItem.getSmscount.push(datedata[i].Sms);
                    GraphItem.getPaidcount.push(datedata[i].Paid);
                }
            }
        }
    }
    new Chart(document.getElementById(canvasid), {
        type: 'bar',
        data: {
            labels: GraphItem.optiondate,
            datasets: [{
                data: GraphItem.getdirectcount,
                label: "Direct Traffic",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item1'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item1'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                fill: true
            },
            {
                data: GraphItem.getsearchcount,
                label: "Search Traffic",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item2'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item2'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item2'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item2'),
                fill: true
            },
            {
                data: GraphItem.getrefercount,
                label: "Refer Traffic",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item3'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item3'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item3'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item3'),
                fill: true
            },
            {
                data: GraphItem.getSocialcount,
                label: "Social Traffic",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item4'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item4'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item4'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item4'),
                fill: true
            },
            {
                data: GraphItem.getEmailcount,
                label: "Email Traffic",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item5'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item5'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item5'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item5'),
                fill: true
            },
            {
                data: GraphItem.getSmscount,
                label: "SMS Traffic",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item6'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item6'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item6'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item6'),
                fill: true
            },
            {
                data: GraphItem.getPaidcount,
                label: "Paid Traffic",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item7'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item7'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item7'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item7'),
                fill: true
            }
            ]
        },
        options: {
            plugins: {
                datalabels: {
                    display: false,
                },
            },
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

    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();



}

// Time On Site Chart *****************************
function CreateTimeOnSiteChart(canvasid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    $.ajax({
        url: "/Dashboard/DashboardOverview/TimeOnSiteReport",
        type: 'Post',
        data: "{'accountId':'" + Plumb5AccountId + "','duration':'" + duration + "','fromdate':'" + FromDateTime + "','todate':'" + ToDateTime + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindTimeOnSiteChart(response, canvasid);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindTimeOnSiteChart(response, canvasid) {

    var GraphItem = { optiondate: [], getrepeatcount: [] };
    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0 && response.Table1[0].TrackerDate != undefined) {

        var DateShort, GraphDate, Datefrom, Dateto;

        $.each(response.Table1, function () {
            if (this.TrackerDate != null)
                var currentDateData = ConvertDateObjectToDateTime(this.TrackerDate);
            if (duration == 1)
                GraphDate = currentDateData.getHours() + " " + currentDateData.getHours() >= 12 ? "PM" : "AM";
            else
                GraphDate = monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate();
            GraphItem.optiondate.push(GraphDate);
            GraphItem.getrepeatcount.push(this.TotalTime);

        });
    }
    new Chart(document.getElementById(canvasid), {
        type: 'line',
        data: {
            labels: GraphItem.optiondate,
            datasets: [{
                data: GraphItem.getrepeatcount,
                label: "Average time on site",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item6'),
                backgroundColor: cssvar('--LineChart-BackgroundColor-Item6'),
                fill: true
            }
            ]
        },
        options: {
            plugins: {
                datalabels: {
                    display: false,
                },
            },
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

    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();


}

// Email Traffic Source Chart **********************
function CreateEmailTrafficSourceChart(canvasid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    $.ajax({
        url: "/Dashboard/DashboardOverview/EmailSmsReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'key': 'Email' }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindEmailTrafficSourceChart(response, canvasid);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindEmailTrafficSourceChart(response, canvasid) {
    var GraphItemDate = [];
    var GraphItem = { ShortDate: [], Sessions: [], UniqueVisitors: [] };
    if (response !== undefined && response !== null && response.Table1 !== undefined && response.Table1 !== null && response.Table1.length > 0) {
        $.each(response.Table1, function () {
            var currentDateData = ConvertDateObjectToDateTime(this.Date);
            var eachDate = monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate();
            GraphItemDate.push({ Date: currentDateData, Count: this.Session, UniqueVisit: this.UniqueVisit });
        });
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
    }
    new Chart(document.getElementById(canvasid), {
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
            plugins: {
                datalabels: {
                    display: false
                }
            },
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
    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();


}

// Time Trends chart *******************************
function CreateTimeTrendsChart(canvasid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    $.ajax({
        url: "/Dashboard/DashboardOverview/VisitorsTimeTrends",
        type: 'Post',
        data: "{'accountId':'" + Plumb5AccountId + "','duration':'" + duration + "','fromdate':'" + FromDateTime + "','todate':'" + ToDateTime + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindTimeTrendsChart(response, canvasid);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindTimeTrendsChart(response, canvasid) {
    var GraphItem = { optiondate: [], getuniquevisitcount: [], getsessioncount: [] };
    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
        $.each(response.Table1, function () {
            GraphItem.optiondate.push(this.DateShort);
            GraphItem.getuniquevisitcount.push(this.UniqueVisit);
            GraphItem.getsessioncount.push(this.Session);

        });
    }
    TimeTrendsChart = new Chart(document.getElementById(canvasid), {
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
            plugins: {
                datalabels: {
                    display: false,
                },
            },
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
    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();
}

// SMS Traffic Source Chart *************************
function CreateSmsTrafficSourceChart(canvasid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    $.ajax({
        url: "/Dashboard/DashboardOverview/EmailSmsReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'Key': 'Sms' }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindSmsTrafficSourceChart(response, canvasid);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindSmsTrafficSourceChart(response, canvasid) {

    var GraphItem = { ShortDate: [], Sessions: [], UniqueVisitors: [] };
    var GraphItemDate = [];
    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
        var SmsTrafficSourceEachDate, SmsTrafficcurrentDateData;
        $.each(response.Table1, function () {
            SmsTrafficcurrentDateData = ConvertDateObjectToDateTime(this.Date);
            SmsTrafficSourceEachDate = monthDetials[SmsTrafficcurrentDateData.getMonth()] + " " + SmsTrafficcurrentDateData.getDate();
            GraphItemDate.push({ Date: SmsTrafficcurrentDateData, Count: this.Session, UniqueVisit: this.UniqueVisit });
        });
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
    }
    new Chart(document.getElementById(canvasid), {
        type: 'line',
        data: {
            labels: GraphItem.ShortDate,
            datasets: [{
                data: GraphItem.UniqueVisitors,
                label: "Unique Visitors",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item4'),
                backgroundColor: cssvar('--LineChart-BackgroundColor-Item4'),
                fill: true
            },
            {
                data: GraphItem.Sessions,
                label: "Sessions",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item3'),
                backgroundColor: cssvar('--LineChart-BackgroundColor-Item3'),
                fill: true
            }
            ]
        },
        options: {
            plugins: {
                datalabels: {
                    display: false,
                },
            },
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

    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();

}

// Popular Page Table
function GetPopularPageData(divId) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    var cachedFromDateTime = new Date(FromDateTime);
    cachedFromDateTime.setDate(cachedFromDateTime.getDate() - 1);
    cachedFromDateTime = cachedFromDateTime.getFullYear() + '-' + AddingPrefixZeroDayMonth((cachedFromDateTime.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(cachedFromDateTime.getDate()) + " 18:30:00";

    var cachedToDateTime = new Date(ToDateTime);
    cachedToDateTime.setDate(cachedToDateTime.getDate() - 1);
    cachedToDateTime = cachedToDateTime.getFullYear() + '-' + AddingPrefixZeroDayMonth((cachedToDateTime.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(cachedToDateTime.getDate()) + " 18:29:59";


    $.ajax({
        url: "/Dashboard/DashboardOverview/GetPopularPages",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration,'fromdate':"" + cachedFromDateTime + "",'todate':"" + cachedToDateTime + "",'start':0,'end':5}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindPopularPageData(response, divId);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindPopularPageData(response, divId) {
    var PopularPageWidgetHtmlContent = //"<div class='tableWrapper mt-4'>"+
        "<div class='table-responsive min-h-300'>" +
        "<table id='ui_tblPopularPageReportData' class='table'>" +
        "<thead>" +
        "<tr>" +
        "<th scope='col' class='m-p-w-170 text-left'>PageName</th>" +
        "<th class='m-p-w-120 text-left' scope='col'>PageViews</th>" +
        "<th class='helpIcon m-p-w-150 text-left' scope='col'>Unique Visitors</th>" +
        "<th class='helpIcon m-p-w-130 text-left' scope='col'>City</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody id='ui_tbodyPopularPageReportData'>" +
        "</tbody>" +
        "</table>" +
        "</div></div>";
    $('#' + divId).html(PopularPageWidgetHtmlContent);

    //SetNoRecordContent('ui_tblPopularPageReportData', 4, 'ui_tbodyPopularPageReportData');
    if (response != undefined && response != null && response.PopularPageData.Table1 != undefined && response.PopularPageData.Table1 != null && response.PopularPageData.Table1.length > 0) {
        var reportPopularPageTableTrs;
        $.each(response.PopularPageData.Table1, function () {
            var url = this.PageName;
            var onlineUrlIndex, lastcontent;
            if (url.substring(url.length - 1) == "/")
                url = url.slice(0, -1);
            onlineUrlIndex = url.lastIndexOf("/");
            lastcontent = url.substring(onlineUrlIndex, url.length);
            if (lastcontent.length > 30)
                lastcontent = lastcontent.substring(0, 30) + "..";

            var page = (this.P.replace(/\plumb5email=/g, 'p5redirectemail=').replace(/\p5contactid=/g, 'p5redirectcontact='));

            //**** For Output Cache ToDateTime *******
            //if (duration == 1)
            //   ToDateTime = response.CurrentUTCDateTimeForOutputCache;
            //**** For Output Cache ToDateTime *******


            reportPopularPageTableTrs += "<tr>" +
                //"<td class='text-center'><a href='" + page + "' target='_blank' title='Click to open the page in a new tab'><i class='icon ion-android-open'></i></a></td>" +
                "<td class='text-left'><a title='" + this.PageName + "' href='/Analytics/Content/PageAnalysis?page=" + this.PageName + "&popular=1' target=\"_blank\">" + lastcontent + "</a></td>" +
                //"<td>" + fn_AverageTime(this.AvgTime) + "</td>" +
                "<td>" + this.PageViews + "</td>" +
                "<td>" + (this.UniqueVisits != "0" ? "<a class='ViewPermission' href='/Analytics/Uniques/UniqueVisits?dur=" + duration + "&Frm=" + FromDateTime + "&To=" + ToDateTime + "&PageName=" + this.PageName.toString().replace(/&/g, '~').replace('?', '$').replace('#', '^') + "&Channel=Web'>" + this.UniqueVisits + "</a>" : this.UniqueVisits) + "</td>" +
                "<td>" + (this.City == null || this.City == "" ? 'Unknown City' : this.City) + "</td></tr>";
        });
        //$("#ui_tblPopularPageReportData").removeClass('no-data-records');
        $("#ui_tbodyPopularPageReportData").html(reportPopularPageTableTrs);
    }
    else {
        $("#ui_tbodyPopularPageReportData").append('<tr><td  colspan="4"><div class="no-data" style="height: 150px;">There is no data for this view</div></td></tr>');
    }
    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();
}

//TopEntry Page Table
function GetTopEntryPagesData(divId) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    var cachedFromDateTime = new Date(FromDateTime);
    cachedFromDateTime.setDate(cachedFromDateTime.getDate() - 1);
    cachedFromDateTime = cachedFromDateTime.getFullYear() + '-' + AddingPrefixZeroDayMonth((cachedFromDateTime.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(cachedFromDateTime.getDate()) + " 18:30:00";

    var cachedToDateTime = new Date(ToDateTime);
    cachedToDateTime.setDate(cachedToDateTime.getDate() - 1);
    cachedToDateTime = cachedToDateTime.getFullYear() + '-' + AddingPrefixZeroDayMonth((cachedToDateTime.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(cachedToDateTime.getDate()) + " 18:29:59";

    $.ajax({
        url: "/Dashboard/DashboardOverview/GetTopEntryExitPages",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': cachedFromDateTime, 'todate': cachedToDateTime, 'key': 'Entry', 'start': 0, 'end': 5 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindTopEntryPageData(response, divId);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindTopEntryPageData(response, divId) {
    var TopEntryPageWidgetHtmlContent = //"<div class='tableWrapper mt-4'>"+
        "<div class='table-responsive min-h-300'>" +
        "<table id='ui_tblTopEntryPageReportData' class='table'>" +
        "<thead>" +
        "<tr>" +
        "<th scope='col' class='m-p-w-170 text-left'>PageName</th>" +
        "<th class='m-p-w-120 text-left' scope='col'>PageViews</th>" +
        "<th class='helpIcon m-p-w-150 text-left' scope='col'>Unique Visitors</th>" +
        "<th class='helpIcon m-p-w-130 text-left' scope='col'>City</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody id='ui_tbodyTopEntryPageReportData'>" +
        "<div class='no-data hideDiv' id='ui_canvas_ReferSourceDataNoData' style='height:150px'>There is no data to view</div>"+
        "</tbody>" +
        "</table>" +
        "</div></div>";
    $('#' + divId).html(TopEntryPageWidgetHtmlContent);
    
   // SetNoRecordContent('ui_tblTopEntryPageReportData', 4, 'ui_tbodyTopEntryPageReportData');
    if (response != undefined && response != null && response.TopEntryExitPageDate.Table1 != undefined && response.TopEntryExitPageDate.Table1 != null && response.TopEntryExitPageDate.Table1.length > 0) {


        var reportTopEntryTablerows = "", lastcontent = "", UniqueVisitorLink = "", UniqueVisits = "", pageName = "", PageName = "";
        $.each(response.TopEntryExitPageDate.Table1, function () {
            /** Template string literal has been implement */
            UniqueVisits = (this.UniqueVisits != "0" ? "<a class='ViewPermission' href='/Analytics/Uniques/UniqueVisits?dur=" + duration + "&Frm=" + FromDateTime + "&To=" + ToDateTime + "&Entry=" + this.PageName.toString().replace(/&/g, '~').replace('?', '$').replace('#', '^') + "'>" + this.UniqueVisits + "</a>" : this.UniqueVisits);


            if (this.PageName != undefined && this.PageName != null && this.PageName.length > 0)
                lastcontent = SubstringPageURL(this.PageName);


            pagName = (this.PageName.replace(/\plumb5email=/g, 'p5redirectemail=').replace(/\p5contactid=/g, 'p5redirectcontact='));
            PageName = "<a title='" + pagName + "' href='/Analytics/Content/PageAnalysis?page=" + pagName + "&entry=1' target=\"_blank\">" + lastcontent + "</a>";

            //if (duration == 1)
            UniqueVisitorLink = "<td>" + UniqueVisits + "</td>";
            //else
            //    UniqueVisitorLink = "<td class='tdiconwrap'><i class='icon ion-ios-information uniqueicon' onclick='LoadCachedUniqueVisits(\"TopEntry\",\"" + topEntyPage.PageName + "\", \"" + FromDateTime + "\",\"" + ToDateTime + "\");'></i>" + UniqueVisits + "</td>";

            reportTopEntryTablerows += "<tr>" +
                //"<td class='text-center'><a href='" + this.PageName + "' target='_blank' title='Click to open the page in a new tab'><i class='icon ion-android-open'></i></a></td>" +
                "<td class='text-left'>" + PageName + "</td>" +
                "<td>" + this.PageViews + "</td>" +
                "" + UniqueVisitorLink + "" +
                "<td>" + this.MaxVisitedCity + "</td>" +
                "</tr>";


        });
        $("#ui_tblTopEntryPageReportData").removeClass('no-data-records');
        $("#ui_tbodyTopEntryPageReportData").append(reportTopEntryTablerows);
    }
    else {
        //SetNoRecordContent('ui_tblTopEntryPageReportData', 4, 'ui_tbodyTopEntryPageReportData');
        $("#ui_tbodyTopEntryPageReportData").append('<tr><td  colspan="4"><div class="no-data" style="height: 150px;">There is no data for this view</div></td></tr>');
    }
    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();
}

//TopEntry Page Table
function GetTopExitPagesData(divId) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    var cachedFromDateTime = new Date(FromDateTime);
    cachedFromDateTime.setDate(cachedFromDateTime.getDate() - 1);
    cachedFromDateTime = cachedFromDateTime.getFullYear() + '-' + AddingPrefixZeroDayMonth((cachedFromDateTime.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(cachedFromDateTime.getDate()) + " 18:30:00";

    var cachedToDateTime = new Date(ToDateTime);
    cachedToDateTime.setDate(cachedToDateTime.getDate() - 1);
    cachedToDateTime = cachedToDateTime.getFullYear() + '-' + AddingPrefixZeroDayMonth((cachedToDateTime.getMonth() + 1)) + '-' + AddingPrefixZeroDayMonth(cachedToDateTime.getDate()) + " 18:29:59";

    $.ajax({
        url: "/Dashboard/DashboardOverview/GetTopEntryExitPages",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': cachedFromDateTime, 'todate': cachedToDateTime, 'key': 'Exit', 'start': 0, 'end': 5 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindTopExitPageData(response, divId);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindTopExitPageData(response, divId) {
    var TopExitPageWidgetHtmlContent = //"<div class='tableWrapper mt-4'>"+
        "<div class='table-responsive min-h-300'>" +
        "<table id='ui_tblTopExitPageReportData' class='table'>" +
        "<thead>" +
        "<tr>" +
        "<th scope='col' class='m-p-w-170 text-left'>PageName</th>" +
        "<th class='m-p-w-120 text-left' scope='col'>PageViews</th>" +
        "<th class='helpIcon m-p-w-150 text-left' scope='col'>Unique Visitors</th>" +
        "<th class='helpIcon m-p-w-130 text-left' scope='col'>City</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody id='ui_tbodyTopExitPageReportData'>" +
        "</tbody>" +
        "</table>" +
        "</div></div>";
    $('#' + divId).html(TopExitPageWidgetHtmlContent);

   // SetNoRecordContent('ui_tblTopExitPageReportData', 4, 'ui_tbodyTopExitPageReportData');
    if (response != undefined && response != null && response.TopEntryExitPageDate.Table1 != undefined && response.TopEntryExitPageDate.Table1 != null && response.TopEntryExitPageDate.Table1.length > 0) {


        var reportTopExitTablerows = "", lastcontent = "", UniqueVisitorLink = "", UniqueVisits = "", pageName = "";
        $.each(response.TopEntryExitPageDate.Table1, function () {
            /** Template string literal has been implement */
            UniqueVisits = (this.UniqueVisits != "0" ? "<a class='ViewPermission' href='/Analytics/Uniques/UniqueVisits?dur=" + duration + "&Frm=" + FromDateTime + "&To=" + ToDateTime + "&Exit=" + this.PageName.toString().replace(/&/g, '~').replace('?', '$').replace('#', '^') + "'>" + this.UniqueVisits + "</a>" : this.UniqueVisits);


            if (this.PageName != undefined && this.PageName != null && this.PageName.length > 0)
                lastcontent = SubstringPageURL(this.PageName);


            pagName = (this.PageName.replace(/\plumb5email=/g, 'p5redirectemail=').replace(/\p5contactid=/g, 'p5redirectcontact='));
            PageName = "<a title='" + pagName + "' href='/analytics/Content/PageAnalysis?page=" + pagName + "&topexit=1' target=\"_blank\">" + lastcontent + "</a>";

            //if (duration == 1)
            UniqueVisitorLink = "<td>" + UniqueVisits + "</td>";
            //else
            //    UniqueVisitorLink = "<td class='tdiconwrap'><i class='icon ion-ios-information uniqueicon' onclick='LoadCachedUniqueVisits(\"TopEntry\",\"" + topEntyPage.PageName + "\", \"" + FromDateTime + "\",\"" + ToDateTime + "\");'></i>" + UniqueVisits + "</td>";

            reportTopExitTablerows += "<tr>" +
                //"<td class='text-center'><a href='" + this.PageName + "' target='_blank' title='Click to open the page in a new tab'><i class='icon ion-android-open'></i></a></td>" +
                "<td class='text-left'>" + PageName + "</td>" +
                "<td>" + this.PageViews + "</td>" +
                "" + UniqueVisitorLink + "" +
                "<td>" + this.MaxVisitedCity + "</td>" +
                "</tr>";


        });
       // $("#ui_tblTopExitPageReportData").removeClass('no-data-records');
        $("#ui_tbodyTopExitPageReportData").append(reportTopExitTablerows);
    }
    else {
        $("#ui_tbodyTopExitPageReportData").append('<tr><td  colspan="4"><div class="no-data" style="height: 150px;">There is no data for this view</div></td></tr>');
    }
    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();
}
//************************************************* WEB ANALYTICS ENDS **************************************************************