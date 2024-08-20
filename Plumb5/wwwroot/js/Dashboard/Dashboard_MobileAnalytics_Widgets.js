//************************************************* MOBILE ANALYTICS START **********************************************************
//Mobile Sessions Vs UniqueVisitors Chart *****************
function CreateMobileSessionsUniqueVisitorsChart(canvasid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    $.ajax({
        url: "/Dashboard/DashboardOverview/MobileVisitsReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindMobileSessionsUniqueVisitorsGraph(response, canvasid);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindMobileSessionsUniqueVisitorsGraph(response, canvasid) {
    var GraphItem = { optiondate: [], gettotalcount: [], getuniquecount: [] };

    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
        $.each(response.Table1, function () {
            var currentDateData = ConvertDateObjectToDateTime(this.TrackerDate);
            GraphItem.optiondate.push(monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate());
            GraphItem.gettotalcount.push(this.Session);
            GraphItem.getuniquecount.push(this.UniqueVisit);
        });
    }

    new Chart(document.getElementById(canvasid), {
        type: 'line',
        data: {
            labels: GraphItem.optiondate,
            datasets: [{
                data: GraphItem.gettotalcount,
                label: "Sessions",
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
                data: GraphItem.getuniquecount,
                label: "Unique Visitor",
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
            tooltips: {
                enabled: true,
                mode: 'label'
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
// Time on App Chart *************************************
function CreateMobileTimeOnAppChart(canvasid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    $.ajax({
        url: "/Dashboard/DashboardOverview/TimeOnMobileReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindMobileMobileTimeOnAppChart(response, canvasid);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindMobileMobileTimeOnAppChart(response, canvasid) {
    GraphItem = { optiondate: [], getrepeatcount: [] };
    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
        $.each(response.Table1, function () {
            var DateShort = 'NA';
            GraphItem.getrepeatcount.push(this.TotalTime);
            if (this.TrackerDate != null) {
                let currentDateData = ConvertDateObjectToDateTime(this.TrackerDate);
                DateShort = monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate();
                GraphItem.optiondate.push(DateShort);
            }
        });
    }
    new Chart(document.getElementById(canvasid), {
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
    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();
}
// Mobile Countries Map **********************************
function CreateMobileCountriesMap(canvasid) {

}
function BindMobileCountriesMap(response, canvasid) {
}
// Mobile Frequency Chart *********************************
function CreateMobileFrequencyChart(canvasid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    $.ajax({
        url: "/Dashboard/DashboardOverview/GetMobileFrequencyReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindMobileFrequencyChart(response, canvasid);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindMobileFrequencyChart(response, canvasid) {
    var GraphItem = { getuniquevisitcount: [], gettotalvisitcount: [] };
    if (response !== undefined && response !== null && response.Table1 !== undefined && response.Table1 !== null && response.Table1.length > 0) {
        $.each(response.Table1, function () {
            GraphItem.getuniquevisitcount.push(this.UniqueVisits);
            GraphItem.gettotalvisitcount.push(this.TotalVisits === null || this.TotalVisits === '' ? 0 : this.TotalVisits);
        });
    }
    new Chart(document.getElementById(canvasid), {
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

}
// Mobile Cities Map ************************************
function CreateMobileCitiesMap(canvasid) {

}
function BindMobileCitiesMap(response, canvasid) {

}
// Mobile Recency Chart **********************************
function CreateMobileRecencyChart(canvasid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    $.ajax({
        url: "/Dashboard/DashboardOverview/GetMobileRecency",
        type: 'Post',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindMobileRecencyChart(response, canvasid);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindMobileRecencyChart(response, canvasid) {
    var GraphItem = { daycount: [], getuniquevisitcount: [], gettotalsessioncount: [], getpageviewscount: [] };
    if (response !== undefined && response !== null && response.Table1 !== undefined && response.Table1 !== null && response.Table1.length > 0) {
        $.each(response.Table1, function () {
            GraphItem.daycount.push(this.DaySince);
            GraphItem.getuniquevisitcount.push(this.UniqueVisits);
            GraphItem.gettotalsessioncount.push(this.Session === null || this.Session === '' ? 0 : this.Session);
            GraphItem.getpageviewscount.push(this.PageViews);
        });
    }
    MobileRecencyChart = new Chart(document.getElementById(canvasid), {
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

}
// Mobile New Vs Return Chart *******************************
function CreateMobileNewVsReturnChart(canvasid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    $.ajax({
        url: "/Dashboard/DashboardOverview/MobileVisitsReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindMobileNewVsReturnChart(response, canvasid);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindMobileNewVsReturnChart(response, canvasid) {
    GraphItem = { ShortDate: [], Single: [], Repeat: [], Return: [] };
    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
        $.each(response.Table1, function () {
            let DateShort = "NA";
            if (this.TrackerDate != null) {
                let currentDateData = ConvertDateObjectToDateTime(this.TrackerDate);
                DateShort = monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate();
                GraphItem.ShortDate.push(DateShort);
            }
            let SingleVisitors = this.SingleVisitors != null ? this.SingleVisitors : 0;
            GraphItem.Single.push(SingleVisitors);
            let RepeatVisitors = this.RepeatVisitors != null ? this.RepeatVisitors : 0;
            GraphItem.Repeat.push(RepeatVisitors);
            let ReturningVisitors = this.ReturningVisitors != null ? this.ReturningVisitors : 0;
            GraphItem.Return.push(ReturningVisitors);
        });
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
}
//************************************************* MOBILE ANALYTICS END   **********************************************************