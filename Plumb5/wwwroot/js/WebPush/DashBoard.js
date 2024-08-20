var leadChanWise;
var NotificationChart = null;
var IsLoadingShows = { IsSubcribers: false, IsFirst: false, IsSecond: false, IsNotification: false };
var clearTimeInterval = null;

var dashboardUtil = {

    GetSubcribersDetails: function () {
        $.ajax({
            url: "/WebPush/Dashboard/GetSubcribersDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (SubcribersDetails) {
                IsLoadingShows.IsSubcribers = true;
                if (SubcribersDetails != null) {
                    $("#ui_h1TotalSubscribers").html(SubcribersDetails.TotalSubcribers);
                    $("#ui_h1TotalWebPushSubscribers").html(SubcribersDetails.TotalWebPushSubcribers);
                    $("#ui_h1TotalWebPushUnSubscribers").html(SubcribersDetails.TotalWebPushUnsubcribers);
                    dashboardUtil.BindPlatformDistributionChart(SubcribersDetails.TotalDesktop, SubcribersDetails.TotalMobile);
                }
            },
            error: ShowAjaxError
        });
    },

    GetFirstEngagementDetails: function () {
        let CompareFirstData = { TotalSent: 0, TotalViewed: 0, TotalClicked: 0, TotalClosed: 0 };
        $.ajax({
            url: "/WebPush/Dashboard/GetCampaignDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (engagementDetails) {
                IsLoadingShows.IsFirst = true;
                if (engagementDetails != null) {
                    CompareFirstData.TotalSent = engagementDetails.TotalSent;
                    CompareFirstData.TotalViewed = engagementDetails.TotalViewed;
                    CompareFirstData.TotalClicked = engagementDetails.TotalClicked;
                    CompareFirstData.TotalClosed = engagementDetails.TotalClosed;

                    $("#ui_divEngagementSent").html(CompareFirstData.TotalSent);
                    $("#ui_divEngagementViewed").html(CompareFirstData.TotalViewed);
                    $("#ui_divEngagementClicked").html(CompareFirstData.TotalClicked);
                    $("#ui_divEngagementClosed").html(CompareFirstData.TotalClosed);

                    let TotalClickedRate = parseInt(CompareFirstData.TotalSent) > 0 ? parseInt(Math.round((CompareFirstData.TotalClicked / CompareFirstData.TotalSent) * 100).toFixed(2)) : 0;
                    let TotalCloseRate = parseInt(CompareFirstData.TotalSent) > 0 ? parseInt(Math.round((CompareFirstData.TotalClosed / CompareFirstData.TotalSent) * 100).toFixed(2)) : 0;
                    let ProgressBarWidthClickedRate = TotalClickedRate > 5 ? TotalClickedRate : 5;
                    let ProgressBarWidthCloseRate = TotalCloseRate > 5 ? TotalCloseRate : 5;

                    let clickRateContent = `<div class="progress-bar bg-primary" style="width: ${ProgressBarWidthClickedRate}%" role="progressbar" aria-valuenow="${TotalClickedRate}" aria-valuemin="0" aria-valuemax="100">${TotalClickedRate}%</div>`;
                    $("#ui_divProgressBarClickedRate").html(clickRateContent);

                    let ClosedRateContent = `<div class="progress-bar bg-success" style="width: ${ProgressBarWidthCloseRate}%" role="progressbar" aria-valuenow="${TotalCloseRate}" aria-valuemin="0" aria-valuemax="100">${TotalCloseRate}%</div>`;
                    $("#ui_divProgressBarClosedRate").html(ClosedRateContent);

                    dashboardUtil.GetSecondEngagementDetails(CompareFirstData);
                }
            },
            error: ShowAjaxError
        });
    },

    GetSecondEngagementDetails: function (CompareFirstData) {
        let CompareSecondData = { TotalSent: 0, TotalViewed: 0, TotalClicked: 0, TotalClosed: 0 };
        let fromDate = CalculateDateDifference();
        $.ajax({
            url: "/WebPush/Dashboard/GetCampaignDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': fromDate, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (engagementDetails) {
                IsLoadingShows.IsSecond = true;
                if (engagementDetails != null) {
                    CompareSecondData.TotalSent = engagementDetails.TotalSent;
                    CompareSecondData.TotalViewed = engagementDetails.TotalViewed;
                    CompareSecondData.TotalClicked = engagementDetails.TotalClicked;
                    CompareSecondData.TotalClosed = engagementDetails.TotalClosed;
                    dashboardUtil.BindOverAllComparisionEngagementData(CompareFirstData, CompareSecondData);
                }
            },
            error: ShowAjaxError
        });
    },

    BindOverAllComparisionEngagementData: function (CompareFirstData, CompareSecondData) {

        let SentPercent = 0, ViewedPercent = 0, ClickedPercent = 0, ClosedPercent = 0;
        SentPercent = CalculatePercentage(CompareFirstData.TotalSent, CompareSecondData.TotalSent);
        let sentPer = `<i class="icon ion-android-arrow-dropdown"></i><span>${SentPercent}%</span>`;
        if (CompareFirstData.TotalSent === CompareSecondData.TotalSent || CompareFirstData.TotalSent > CompareSecondData.TotalSent)
            sentPer = `<i class="icon ion-android-arrow-dropup"></i><span>${SentPercent}%</span>`;
        $("#ui_IconarrowSent").html(sentPer);

        ClosedPercent = CalculatePercentage(CompareFirstData.TotalClosed, CompareSecondData.TotalClosed);
        let closedPer = `<i class="icon ion-android-arrow-dropdown"></i><span>${ClosedPercent}%</span>`;
        if (CompareFirstData.TotalClosed === CompareSecondData.TotalClosed || CompareFirstData.TotalClosed > CompareSecondData.TotalClosed)
            closedPer = `<i class="icon ion-android-arrow-dropup"></i><span>${ClosedPercent}%</span>`;
        $("#ui_IconarrowClosed").html(closedPer);


        ViewedPercent = CalculatePercentage(CompareFirstData.TotalViewed, CompareSecondData.TotalViewed);
        let viewedPer = `<i class="icon ion-android-arrow-dropdown"></i><span>${ViewedPercent}%</span>`;
        if (CompareFirstData.TotalViewed === CompareSecondData.TotalViewed || CompareFirstData.TotalViewed > CompareSecondData.TotalViewed)
            viewedPer = `<i class="icon ion-android-arrow-dropup"></i><span>${ViewedPercent}%</span>`;
        $("#ui_IconarrowViewed").html(viewedPer);

        ClickedPercent = CalculatePercentage(CompareFirstData.TotalClicked, CompareSecondData.TotalClicked);
        let clickedPer = `<i class="icon ion-android-arrow-dropdown"></i><span>${ClickedPercent}%</span>`;
        if (CompareFirstData.TotalClicked === CompareSecondData.TotalClicked || CompareFirstData.TotalClicked > CompareSecondData.TotalClicked)
            clickedPer = `<i class="icon ion-android-arrow-dropup"></i><span>${ClickedPercent}%</span>`;
        $("#ui_IconarrowClicked").html(clickedPer);

    },

    BindPlatformDistributionChart: function (TotalDesktop, TotalMobile) {
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
                labels: ["Desktop", "Mobile"],
                datasets: [
                    {
                        backgroundColor: [cssvar('--PieChart-BackgroundColor-Item1'), cssvar('--PieChart-BackgroundColor-Item3')],
                        data: [TotalDesktop, TotalMobile]
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

    GetNotificationDetails: function () {
        $.ajax({
            url: "/WebPush/Dashboard/GetNotificationDetails",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (notificationDetails) {
                IsLoadingShows.IsNotification = true;
                var GraphItemDate = [];
                var GraphItem = { ShortDate: [], TotalSent: [], TotalClicked: [], TotalUnsubscribed: [] };
                if (notificationDetails != undefined && notificationDetails != null && notificationDetails.length > 0) {
                    for (let i = 0; i < notificationDetails.length; i++) {
                        if (duration == 1) {
                            if (ToJavaScriptDateFromNumber(notificationDetails[i].Date).getDate() == new Date().getDate()) {
                                GraphItemDate.push({ Date: notificationDetails[i].Date, Count: notificationDetails[i].TotalSent, TotalClicked: notificationDetails[i].TotalClicked, TotalUnsubscribed: notificationDetails[i].TotalUnsubscribed });
                            }
                        } else {
                            GraphItemDate.push({ Date: notificationDetails[i].Date, Count: notificationDetails[i].TotalSent, TotalClicked: notificationDetails[i].TotalClicked, TotalUnsubscribed: notificationDetails[i].TotalUnsubscribed });
                        }
                    }

                    GraphItem.ShortDate.length = 0; GraphItem.TotalSent.length = 0; GraphItem.TotalClicked.length = 0; GraphItem.TotalUnsubscribed.length = 0;
                    let datedata = GetDateCountForGraphData(GraphItemDate, FromDateTime, ToDateTime);
                    if (datedata != undefined && datedata != null && datedata.length > 0) {
                        for (let i = 0; i < datedata.length; i++) {
                            GraphItem.ShortDate.push(monthDetials[datedata[i].Date.getMonth()] + " " + datedata[i].Date.getDate());
                            if (datedata[i].Count == 0) {
                                GraphItem.TotalSent.push(0);
                                GraphItem.TotalClicked.push(0);
                                GraphItem.TotalUnsubscribed.push(0);
                            } else {
                                GraphItem.TotalSent.push(datedata[i].Count);
                                GraphItem.TotalClicked.push(datedata[i].TotalClicked);
                                GraphItem.TotalUnsubscribed.push(datedata[i].TotalUnsubscribed);
                            }
                        }
                    }

                    dashboardUtil.BindNotificationChart(GraphItem);
                } else {
                    dashboardUtil.BindNotificationChart(GraphItem);
                }
            },
            error: ShowAjaxError
        });
    },

    BindNotificationChart: function (GraphItem) {

        if (NotificationChart != null)
            NotificationChart.destroy();

        NotificationChart = new Chart(document.getElementById("notifdetails"), {
            type: 'bar',
            data: {
                labels: GraphItem.ShortDate,
                datasets: [{
                    label: "Clicks",
                    type: "line",
                    borderColor: cssvar('--PieChart- BackgroundColor - Item2'),
                    backgroundColor: cssvar('--PieChart-BackgroundColor-Item2'),
                    data: GraphItem.TotalClicked,
                    fill: false
                }, {
                    label: "Opt In",
                    type: "line",
                    borderColor: cssvar('--PieChart- BackgroundColor - Item3'),
                    backgroundColor: cssvar('--PieChart-BackgroundColor-Item3'),
                    data: GraphItem.TotalUnsubscribed,
                    fill: false
                }, {
                    label: "Sent",
                    type: "bar",
                    backgroundColor: cssvar('--PieChart-BackgroundColor-Item5'),
                    data: GraphItem.TotalSent,
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
                responsive: true,
                title: {
                    display: false,
                },
                legend: {
                    display: true, position: 'bottom', labels: {
                        boxWidth: 10, fontSize: 11
                    }
                },
                scales: {
                    xAxes: [{ stacked: false, barPercentage: 0.5, categoryPercentage: 1.0 }],
                    yAxes: [{
                        stacked: false,
                    }]
                }
            }
        });
    }
};

$(document).ready(() => {
    GetUTCDateTimeRange(2);
});

function CallBackFunction() {
    ShowPageLoading();
    DestroyAllCharts();
    dashboardUtil.GetSubcribersDetails();
    dashboardUtil.GetFirstEngagementDetails();
    dashboardUtil.GetNotificationDetails();
    clearTimeInterval = setInterval(IsLoadingToHide, 1000);
}

function IsLoadingToHide() {
    if (IsLoadingShows.IsSubcribers && IsLoadingShows.IsFirst && IsLoadingShows.IsSecond && IsLoadingShows.IsNotification) {
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