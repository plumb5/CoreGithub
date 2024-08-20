var leadChanWise;
var LineChart = null;
var IsLoadingShows = { IsFormSubmissions: false, IsPerFormingForms: false, IsDistribution: false, IsFirst: false, IsSecond: false };
var clearTimeInterval = null;
var dashboardUtil = {
    GetTotalFormSubmissions: function () {
        $.ajax({
            url: "/MobileInApp/DashBoard/GetTotalInAppFormSubmissions",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (FormSubmissions) {
                IsLoadingShows.IsFormSubmissions = true;
                var GraphItemDate = [];
                var GraphItem = { ShortDate: [], ViewedCount: [], ResponseCount: [] };
                if (FormSubmissions != undefined && FormSubmissions != null && FormSubmissions.length > 0) {
                    for (let i = 0; i < FormSubmissions.length; i++) {
                        if (duration == 1) {
                            if (ToJavaScriptDateFromNumber(FormSubmissions[i].DateWise).getDate() == new Date().getDate()) {
                                GraphItemDate.push({ Date: FormSubmissions[i].DateWise, Count: FormSubmissions[i].ViewedCount, ResponseCount: FormSubmissions[i].ResponseCount });
                            }
                        } else {
                            GraphItemDate.push({ Date: FormSubmissions[i].DateWise, Count: FormSubmissions[i].ViewedCount, ResponseCount: FormSubmissions[i].ResponseCount });
                        }
                    }

                    GraphItem.ShortDate.length = 0; GraphItem.ViewedCount.length = 0; GraphItem.ResponseCount.length = 0;
                    let datedata = GetDateCountForGraphData(GraphItemDate, FromDateTime, ToDateTime);
                    if (datedata != undefined && datedata != null && datedata.length > 0) {
                        for (let i = 0; i < datedata.length; i++) {
                            GraphItem.ShortDate.push(monthDetials[datedata[i].Date.getMonth()] + " " + datedata[i].Date.getDate());
                            if (datedata[i].Count == 0) {
                                GraphItem.ViewedCount.push(0);
                                GraphItem.ResponseCount.push(0);
                            } else {
                                GraphItem.ViewedCount.push(datedata[i].Count);
                                GraphItem.ResponseCount.push(datedata[i].ResponseCount);
                            }
                        }
                    }

                    dashboardUtil.BindChartForTotalFormSubmissions(GraphItem);
                } else {
                    dashboardUtil.BindChartForTotalFormSubmissions(GraphItem);
                }
            },
            error: ShowAjaxError
        });
    },
    GetTopFivePerFormingForms: function () {
        $.ajax({
            url: "/MobileInApp/DashBoard/GetTopFivePerFormingInApp",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (FivePerFormingForms) {
                IsLoadingShows.IsPerFormingForms = true;
                if (FivePerFormingForms != undefined && FivePerFormingForms != null && FivePerFormingForms.length > 0) {
                    $("#ui_tdbodyPerformingforms").empty();
                    for (let i = 0; i < FivePerFormingForms.length; i++) {

                        let ConversionRate = parseInt(FivePerFormingForms[i].ViewedCount) > 0 ? parseInt(Math.round((FivePerFormingForms[i].ResponseCount / FivePerFormingForms[i].ViewedCount) * 100).toFixed(2)) : 0;
                        let ClosedRate = parseInt(FivePerFormingForms[i].ViewedCount) > 0 ? parseInt(Math.round((FivePerFormingForms[i].ClosedCount / FivePerFormingForms[i].ViewedCount) * 100).toFixed(2)) : 0;

                        let content = ` <tr>
                                            <td class="frmnantxtwrp">
                                                <p>${FivePerFormingForms[i].Name}</p>
                                                <p class="text-muted">${FivePerFormingForms[i].InAppCampaignType}</p>
                                            </td>
                                            <td>${FivePerFormingForms[i].ViewedCount}</td>
                                            <td>${FivePerFormingForms[i].ResponseCount}</td>
                                            <td>${ConversionRate}%</td>
                                            <td>${ClosedRate}%</td>
                                         </tr>
                                       `;

                        $("#ui_tdbodyPerformingforms").append(content);
                    }
                } else {
                    SetNoRecordContent('ui_tblPerformingData', 5, 'ui_tdbodyPerformingforms');
                }
            },
            error: ShowAjaxError
        });
    },
    GetPlatformDistribution: function () {
        $.ajax({
            url: "/MobileInApp/DashBoard/GetPlatformDistribution",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (PlatformDistribution) {
                IsLoadingShows.IsDistribution = true;
                if (PlatformDistribution != undefined && PlatformDistribution != null) {
                    dashboardUtil.BindChartForPlatformDistribution(PlatformDistribution.TotalAndroid, PlatformDistribution.TotalIOS);
                } else {
                    dashboardUtil.BindChartForPlatformDistribution(0, 0);
                }
            },
            error: ShowAjaxError
        });
    },
    BindChartForPlatformDistribution: function (TotalAndroid, TotalIOS) {
        $("#ui_divPlatformDistributionNoData").addClass("hideDiv");
        $("#platdistrib").removeClass("hideDiv");

        Chart.plugins.unregister(ChartDataLabels);
        Chart.defaults.global.defaultFontSize = 10;
        Chart.defaults.global.legend.labels.boxWidth = 10;
        /* Doughnut */
        var leadChanWise = document.getElementById("platdistrib");
        var chart_config = {
            plugins: [ChartDataLabels],
            type: 'doughnut',
            data: {
                labels: ["IOS", "Android"],
                datasets: [
                    {
                        backgroundColor: [cssvar('--PieChart-BackgroundColor-Item1'), cssvar('--PieChart-BackgroundColor-Item3')],
                        data: [TotalIOS, TotalAndroid]
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    datalabels: {
                        color: '#fff',
                        font: {
                            size: 10,
                        },
                    }
                },
                legend: {
                    display: true,
                    responsive: true,
                    position: 'bottom',
                    fullWidth: true,
                    labels: {
                        fontSize: 11,
                    }
                },
                title: {
                    display: false,
                    //text: 'Predicted world population (millions) in 2050'
                }
            }
        }

        // Check if data is all 0s; if it is, add dummy data to end with empty label
        chart_config.data.datasets.forEach(dataset => {
            if (dataset.data.every(el => el === 0)) {
                dataset.backgroundColor.push('rgba(192,192,192,0.3)');
                dataset.data.push(0);

                $("#ui_divPlatformDistributionNoData").removeClass("hideDiv");
                $("#platdistrib").addClass("hideDiv");
            }
        })
        new Chart(leadChanWise, chart_config);
    },
    BindChartForTotalFormSubmissions: function (GraphItem) {

        if (LineChart != null)
            LineChart.destroy();


        LineChart = new Chart(document.getElementById("sitesearch"), {
            type: 'line',
            data: {
                labels: GraphItem.ShortDate,
                datasets: [{
                    data: GraphItem.ViewedCount,
                    label: "Impressions",
                    borderWidth: 1.5,
                    borderColor: cssvar('--LineChart-BorderColor-Item1'),
                    backgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                    fill: false
                },
                {
                    data: GraphItem.ResponseCount,
                    label: "Responses",
                    borderWidth: 1.5,
                    borderColor: cssvar('--LineChart-BorderColor-Item2'),
                    backgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                    fill: false
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
    },
    GetFirstAggregateFormsData: function () {
        $.ajax({
            url: "/MobileInApp/DashBoard/GetAggregateInAppData",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (AggregateFormsData) {
                IsLoadingShows.IsFirst = true;
                let CompareFirstData = { ViewedCount: 0, ResponseCount: 0, ClosedCount: 0 };
                if (AggregateFormsData != undefined && AggregateFormsData != null) {
                    CompareFirstData.ViewedCount = AggregateFormsData.ViewedCount;
                    CompareFirstData.ResponseCount = AggregateFormsData.ResponseCount;
                    CompareFirstData.ClosedCount = AggregateFormsData.ClosedCount;
                    let ConversionRate = parseInt(CompareFirstData.ViewedCount) > 0 ? parseInt(Math.round((CompareFirstData.ResponseCount / CompareFirstData.ViewedCount) * 100).toFixed(2)) : 0;
                    $("#ui_divImpressions").html(CompareFirstData.ViewedCount);
                    $("#ui_divResponses").html(CompareFirstData.ResponseCount);
                    $("#ui_divClosed").html(CompareFirstData.ClosedCount);

                    let ConversionRateContent = `<div class="progress-bar bg-success" role="progressbar" style="width: ${ConversionRate}%" aria-valuenow="${ConversionRate}" aria-valuemin="0" aria-valuemax="100">${ConversionRate}%</div>`;
                    $("#ui_divProgressBarConversionRate").html(ConversionRateContent);

                    dashboardUtil.GetSecondAggregateFormsData(CompareFirstData);
                }
            },
            error: ShowAjaxError
        });
    },
    GetSecondAggregateFormsData: function (CompareFirstData) {
        let CompareSecondData = { ViewedCount: 0, ResponseCount: 0, ClosedCount: 0 };
        let fromDate = CalculateDateDifference();
        $.ajax({
            url: "/MobileInApp/DashBoard/GetAggregateInAppData",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': fromDate, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (AggregateFormsData) {
                IsLoadingShows.IsSecond = true;
                if (AggregateFormsData != null) {
                    CompareSecondData.ViewedCount = AggregateFormsData.ViewedCount;
                    CompareSecondData.ResponseCount = AggregateFormsData.ResponseCount;
                    CompareSecondData.ClosedCount = AggregateFormsData.ClosedCount;
                    dashboardUtil.BindOverAllAggregateFormsData(CompareFirstData, CompareSecondData);
                }
            },
            error: ShowAjaxError
        });
    },
    BindOverAllAggregateFormsData: function (CompareFirstData, CompareSecondData) {
        let ViewedPer = 0; ResponsePer = 0; ClosedPer = 0;
        ViewedPer = CalculatePercentage(CompareFirstData.ViewedCount, CompareSecondData.ViewedCount);
        let viewedDivPer = `<div class="countper"><i class="icon ion-android-arrow-dropdown"></i><span>${ViewedPer}%</span></div>`;
        if (CompareFirstData.ViewedCount === CompareSecondData.ViewedCount || CompareFirstData.ViewedCount > CompareSecondData.ViewedCount)
            viewedDivPer = `<div class="countper"><i class="icon ion-android-arrow-dropup"></i><span>${ViewedPer}%</span></div>`;
        $("#ui_Iconarrowviewed").html(viewedDivPer);

        ResponsePer = CalculatePercentage(CompareFirstData.ResponseCount, CompareSecondData.ResponseCount);
        let responseDivPer = `<i class="icon ion-android-arrow-dropdown"></i><span>${ResponsePer}%</span>`;
        if (CompareFirstData.ResponseCount === CompareSecondData.ResponseCount || CompareFirstData.ResponseCount > CompareSecondData.ResponseCount)
            responseDivPer = `<i class="icon ion-android-arrow-dropup"></i><span>${ResponsePer}%</span>`;
        $("#ui_IconarrowResponse").html(responseDivPer);


        ClosedPer = CalculatePercentage(CompareFirstData.ClosedCount, CompareSecondData.ClosedCount);
        let closedDivPer = `<i class="icon ion-android-arrow-dropdown"></i><span>${ClosedPer}%</span>`;
        if (CompareFirstData.ClosedCount === CompareSecondData.ClosedCount || CompareFirstData.ClosedCount > CompareSecondData.ClosedCount)
            closedDivPer = `<i class="icon ion-android-arrow-dropup"></i><span>${ClosedPer}%</span>`;
        $("#ui_IconarrowClosed").html(closedDivPer);
    }
};


$(document).ready(() => {
    GetUTCDateTimeRange(2);
});

function CallBackFunction() {
    ShowPageLoading();
    DestroyAllCharts();
    dashboardUtil.GetTotalFormSubmissions();
    dashboardUtil.GetTopFivePerFormingForms();
    dashboardUtil.GetPlatformDistribution();
    dashboardUtil.GetFirstAggregateFormsData();
    clearTimeInterval = setInterval(IsLoadingToHide, 1000);
}

function IsLoadingToHide() {
    if (IsLoadingShows.IsFormSubmissions && IsLoadingShows.IsPerFormingForms && IsLoadingShows.IsDistribution && IsLoadingShows.IsFirst && IsLoadingShows.IsSecond) {
        clearInterval(clearTimeInterval);
        HidePageLoading();
    } else {
        ShowPageLoading();
    }
}

function DestroyAllCharts() {
    if (leadChanWise) {
        leadChanWise.destroy();
    }
}
