//************************************************* WEB ENGAGEMENT STARTS ***********************************************************
// Form Submission Over time Chart ******************
function CreateFormSubmissionOverTimeChart(canvasid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    var FormSubmissionArray = { DateWise: [], ViewedCount: [], ResponseCount: [] };
    $.ajax({
        url: "/Dashboard/DashboardOverView/GetTotalFormSubmissions",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (FormSubmissions) {

            FormSubmissionArray.DateWise = []; FormSubmissionArray.ViewedCount = []; FormSubmissionArray.ResponseCount = [];
            if (FormSubmissions != undefined && FormSubmissions != null && FormSubmissions.length > 0) {
                for (let i = 0; i < FormSubmissions.length; i++) {
                    let date = $.datepicker.formatDate("M dd", GetJavaScriptDateObj(FormSubmissions[i].DateWise));
                    FormSubmissionArray.DateWise.push(date);
                    FormSubmissionArray.ViewedCount.push(FormSubmissions[i].ViewedCount);
                    FormSubmissionArray.ResponseCount.push(FormSubmissions[i].ResponseCount);
                }
            }
            BindFormSubmissionOverTimeChart(FormSubmissionArray, canvasid);

        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindFormSubmissionOverTimeChart(FormSubmissionArray, canvasid) {
    new Chart(document.getElementById(canvasid), {
        type: 'line',
        data: {
            labels: FormSubmissionArray.DateWise,
            datasets: [{
                data: FormSubmissionArray.ViewedCount,
                label: "Impressions",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item1'),
                backgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                fill: false
            },
            {
                data: FormSubmissionArray.ResponseCount,
                label: "Responses",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item2'),
                backgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                fill: false
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

// Aggregate form Data Widget Chart ************************
function CreateAggregateFormDataWidgetChart(divId) {
    var AggregateFormDataWidgetHtmlContent = "<div class='box-white h-100'>" +
        "<div class='engageWrap mt-2'>" +
        "<div class='card card-sales border-0'>" +
        "<h6 class='slim-card-title tx-success mb-4'>Aggregate Forms Data</h6>" +
        "<div class='row mb-4'>" +
        "<div class='col'>" +
        "<label class='tx-12'>Impressions</label>" +
        "<div class='countsWrap'>" +
        "<div class='countNumb' id='ui_divImpressions'>0</div>" +
        "<div class='countper' id='ui_Iconarrowviewed'><i class='icon ion-android-arrow-dropdown'></i><span>00.00%</span></div>" +
        "</div>" +
        "</div>" +
        "<div class='col'>" +
        "<label class='tx-12'>Responses</label>" +
        "<div class='countsWrap'>" +
        "<div class='countNumb' id='ui_divResponses'>0</div>" +
        "<div class='countper' id='ui_IconarrowResponse'><i class='icon ion-android-arrow-dropdown'></i><span>00.00%</span></div>" +
        "</div>" +
        "</div>" +
        "<div class='col'>" +
        "<label class='tx-12'>Closed</label>" +
        "<div class='countsWrap'>" +
        "<div class='countNumb' id='ui_divClosed'>0</div>" +
        "<div class='countper' id='ui_IconarrowClosed'><i class='icon ion-android-arrow-dropdown'></i><span>00.00%</span></div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "<div class='progress mg-b-5' id='ui_divProgressBarConversionRate'>" +
        "<div class='progress-bar bg-success wd-50p' role='progressbar' aria-valuenow='50' aria-valuemin='0' aria-valuemax='100'>0%</div>" +
        "</div>" +
        "<p class='tx-12 mg-b-0 mb-0'>Conversion Rate</p>" +
        "</div>" +
        "</div>" +
        "</div>";
    $('#' + divId).html(AggregateFormDataWidgetHtmlContent);
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    $.ajax({
        url: "/Dashboard/DashboardOverview/GetAggregateFormsData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (AggregateFormsData) {
            //IsLoadingShows.IsFirst = true;
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

                GetSecondAggregateFormsData(CompareFirstData);
            }
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function GetSecondAggregateFormsData(CompareFirstData) {
    let CompareSecondData = { ViewedCount: 0, ResponseCount: 0, ClosedCount: 0 };
    let fromDate = CalculateDateDifference();
    $.ajax({
        url: "/Dashboard/DashboardOverview/GetAggregateFormsData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': fromDate, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (AggregateFormsData) {
            // IsLoadingShows.IsSecond = true;
            if (AggregateFormsData != null) {
                CompareSecondData.ViewedCount = AggregateFormsData.ViewedCount;
                CompareSecondData.ResponseCount = AggregateFormsData.ResponseCount;
                CompareSecondData.ClosedCount = AggregateFormsData.ClosedCount;

            }
            BindAggregateFormDataWidgetChart(CompareFirstData, CompareSecondData);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindAggregateFormDataWidgetChart(CompareFirstData, CompareSecondData) {
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

    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();
}

// Form Platform Distribution Chart ****************
function CreatePlatformDistributionChart(canvasid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    $.ajax({
        url: "/Dashboard/DashboardOverview/GetPlatformDistribution",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (PlatformDistribution) {

            if (PlatformDistribution != undefined && PlatformDistribution != null) {
                BindPlatformDistributionChart(PlatformDistribution.MobileCount, PlatformDistribution.WebCount, canvasid);
            } else {
                BindPlatformDistributionChart(0, 0, canvasid);
            }
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindPlatformDistributionChart(MobileCount, WebCount, canvasid) {
    /* Doughnut */
    var leadChanWise = document.getElementById(canvasid);
    var chart_config = {
        plugins: [ChartDataLabels],
        type: 'doughnut',
        data: {
            labels: ["Web", "Mobile"],
            datasets: [
                {
                    backgroundColor: [cssvar('--PieChart-BackgroundColor-Item1'), cssvar('--PieChart-BackgroundColor-Item3')],
                    data: [WebCount, MobileCount]
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
            dataset.data.push(1);
        }
    })
    new Chart(leadChanWise, chart_config);


    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();
}

//Web Push EngagementRate *************************
function CreateWebPushEngagementRateChart(divId) {
    //***********************************************************
    var WebPushEngagementRateHtmlContent = "<div class='engageWrap'>" +
        "<div class='card card-sales border-0'>" +
        "<h6 class='slim-card-title tx-primary'>Engagement</h6>" +
        "<div class='row'>" +
        "<div class='col'>" +
        "<label class='tx-12'>Viewed</label>" +
        "<div class='bnoticountsWrap'>" +
        "<div class='countNumb' id='ui_divWebPushEngagementViewed'>0</div>" +
        "<div class='countper' id='ui_IconarrowWebPushViewed'><i class='icon ion-android-arrow-dropdown'></i> <span>0%</span></div>" +
        "</div>" +
        "</div>" +
        "<div class='col'>" +
        "<label class='tx-12'>Clicked</label>" +
        "<div class='bnoticountsWrap'>" +
        "<div class='countNumb' id='ui_divWebPushEngagementClicked'>0</div>" +
        "<div class='countper' id='ui_IconarrowWebPushClicked'><i class='icon ion-android-arrow-dropdown'></i><span>0%</span></div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "<div class='progress mg-b-5' id='ui_divProgressBarWebPushClickedRate'>" +
        "</div>" +
        "<p class='tx-12 mg-b-0 mb-0'>Click Rate</p>" +
        "</div>" +
        "</div>";


    $('#' + divId).html(WebPushEngagementRateHtmlContent);

    //**********************************************************88
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    let CompareFirstData = { TotalViewed: 0, TotalClicked: 0 };
    $.ajax({
        url: "/Dashboard/DashboardOverview/GetCampaignDetails",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (engagementDetails) {
            if (engagementDetails != null) {

                CompareFirstData.TotalViewed = engagementDetails.TotalViewed;
                CompareFirstData.TotalClicked = engagementDetails.TotalClicked;

                $("#ui_divWebPushEngagementViewed").html(CompareFirstData.TotalViewed);
                $("#ui_divWebPushEngagementClicked").html(CompareFirstData.TotalClicked);


                let TotalClickedRate = parseInt(CompareFirstData.TotalSent) > 0 ? parseInt(Math.round((CompareFirstData.TotalClicked / CompareFirstData.TotalSent) * 100).toFixed(2)) : 0;


                let ProgressBarWidthClickedRate = TotalClickedRate > 5 ? TotalClickedRate : 5;
                let clickRateContent = `<div class="progress-bar bg-primary" style="width: ${ProgressBarWidthClickedRate}%" role="progressbar" aria-valuenow="${TotalClickedRate}" aria-valuemin="0" aria-valuemax="100">${TotalClickedRate}%</div>`;
                $("#ui_divProgressBarWebPushClickedRate").html(clickRateContent);

                GetSecondEngagementDetails(CompareFirstData);
            }
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function GetSecondEngagementDetails(CompareFirstData) {
    let CompareSecondData = { TotalViewed: 0, TotalClicked: 0 };
    let fromDate = CalculateDateDifference();
    $.ajax({
        url: "/Dashboard/DashboardOverview/GetCampaignDetails",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': fromDate, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (engagementDetails) {
            //IsLoadingShows.IsSecond = true;
            if (engagementDetails != null) {

                CompareSecondData.TotalViewed = engagementDetails.TotalViewed;
                CompareSecondData.TotalClicked = engagementDetails.TotalClicked;

                BindWebPushEngagementRateChart(CompareFirstData, CompareSecondData);
            }
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindWebPushEngagementRateChart(CompareFirstData, CompareSecondData) {
    let ViewedPercent = 0, ClickedPercent = 0;


    ViewedPercent = CalculatePercentage(CompareFirstData.TotalViewed, CompareSecondData.TotalViewed);
    let viewedPer = `<i class="icon ion-android-arrow-dropdown"></i><span>${ViewedPercent}%</span>`;
    if (CompareFirstData.TotalViewed === CompareSecondData.TotalViewed || CompareFirstData.TotalViewed > CompareSecondData.TotalViewed)
        viewedPer = `<i class="icon ion-android-arrow-dropup"></i><span>${ViewedPercent}%</span>`;
    $("#ui_IconarrowWebPushViewed").html(viewedPer);

    ClickedPercent = CalculatePercentage(CompareFirstData.TotalClicked, CompareSecondData.TotalClicked);
    let clickedPer = `<i class="icon ion-android-arrow-dropdown"></i><span>${ClickedPercent}%</span>`;
    if (CompareFirstData.TotalClicked === CompareSecondData.TotalClicked || CompareFirstData.TotalClicked > CompareSecondData.TotalClicked)
        clickedPer = `<i class="icon ion-android-arrow-dropup"></i><span>${ClickedPercent}%</span>`;
    $("#ui_IconarrowWebPushClicked").html(clickedPer);

    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();

}

//Web Push Delivery Rate *************************
function CreateWebPushDeliveryRateChart(divId) {
    var WebPushDeliveryHtmlContent = "<div class='engageWrap'>" +
        "<div class='card card-sales border-0'>" +
        "<h6 class='slim-card-title tx-success mb-10'>Delivery</h6>" +
        "<div class='row'>" +
        "<div class='col'>" +
        "<label class='tx-12'>Sent</label>" +
        "<div class='bnoticountsWrap'>" +
        "<div class='countNumb' id='ui_divEngagementWebPushSent'>0</div>" +
        "<div class='countper' id='ui_IconarrowWebPushSent'><i class='icon ion-android-arrow-dropdown'></i> <span>0%</span></div>" +
        "</div>" +
        "</div>" +
        "<div class='col'>" +
        "<label class='tx-12'>Closed</label>" +
        "<div class='bnoticountsWrap'>" +
        "<div class='countNumb' id='ui_divEngagementWebPushClosed'>0</div>" +
        "<div class='countper' id='ui_IconarrowWebPushClosed'><i class='icon ion-android-arrow-dropdown'></i> <span>0%</span></div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "<div class='progress mg-b-5' id='ui_divProgressBarWebpushClosedRate'>" +
        "</div>" +
        "<p class='tx-12 mg-b-0 mb-0'>Closed Rate</p>" +
        "</div>" +
        "</div>";
    $('#' + divId).html(WebPushDeliveryHtmlContent);
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    let CompareFirstData = { TotalSent: 0, TotalClosed: 0 };
    $.ajax({
        url: "/Dashboard/DashboardOverview/GetCampaignDetails",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (engagementDetails) {
            //IsLoadingShows.IsFirst = true;
            if (engagementDetails != null) {
                CompareFirstData.TotalSent = engagementDetails.TotalSent;

                CompareFirstData.TotalClosed = engagementDetails.TotalClosed;

                $("#ui_divEngagementWebPushSent").html(CompareFirstData.TotalSent);

                $("#ui_divEngagementWebPushClosed").html(CompareFirstData.TotalClosed);


                let TotalCloseRate = parseInt(CompareFirstData.TotalSent) > 0 ? parseInt(Math.round((CompareFirstData.TotalClosed / CompareFirstData.TotalSent) * 100).toFixed(2)) : 0;
                let ProgressBarWidthCloseRate = TotalCloseRate > 5 ? TotalCloseRate : 5;


                let ClosedRateContent = `<div class="progress-bar bg-success" style="width: ${ProgressBarWidthCloseRate}%" role="progressbar" aria-valuenow="${TotalCloseRate}" aria-valuemin="0" aria-valuemax="100">${TotalCloseRate}%</div>`;
                $("#ui_divProgressBarWebpushClosedRate").html(ClosedRateContent);

                GetSecondEngagementDeliveryDetails(CompareFirstData);
            }
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function GetSecondEngagementDeliveryDetails(CompareFirstData) {
    let CompareSecondData = { TotalSent: 0, TotalClosed: 0 };
    let fromDate = CalculateDateDifference();
    $.ajax({
        url: "/Dashboard/DashboardOverview/GetCampaignDetails",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': fromDate, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (engagementDetails) {
            //IsLoadingShows.IsSecond = true;
            if (engagementDetails != null) {
                CompareSecondData.TotalSent = engagementDetails.TotalSent;
                CompareSecondData.TotalClosed = engagementDetails.TotalClosed;
                BindWebPushDeliveryRateChart(CompareFirstData, CompareSecondData);
            }
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindWebPushDeliveryRateChart(CompareFirstData, CompareSecondData) {
    let SentPercent = 0, ClosedPercent = 0;
    SentPercent = CalculatePercentage(CompareFirstData.TotalSent, CompareSecondData.TotalSent);
    let sentPer = `<i class="icon ion-android-arrow-dropdown"></i><span>${SentPercent}%</span>`;
    if (CompareFirstData.TotalSent === CompareSecondData.TotalSent || CompareFirstData.TotalSent > CompareSecondData.TotalSent)
        sentPer = `<i class="icon ion-android-arrow-dropup"></i><span>${SentPercent}%</span>`;
    $("#ui_IconarrowWebPushSent").html(sentPer);

    ClosedPercent = CalculatePercentage(CompareFirstData.TotalClosed, CompareSecondData.TotalClosed);
    let closedPer = `<i class="icon ion-android-arrow-dropdown"></i><span>${ClosedPercent}%</span>`;
    if (CompareFirstData.TotalClosed === CompareSecondData.TotalClosed || CompareFirstData.TotalClosed > CompareSecondData.TotalClosed)
        closedPer = `<i class="icon ion-android-arrow-dropup"></i><span>${ClosedPercent}%</span>`;
    $("#ui_IconarrowWebPushClosed").html(closedPer);

    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();

}

//Web Push Subscriber ***************************
function CreateWebPushSubscribers(divId) {
    var WebPushSubscriberHtmlContent = "<div class='box-white h-49'>" +
        "<div class='totalsubswrp h-100'>" +
        "<div class='totaltxticonwrp'>" +
        "<div class='totalnumb'>" +
        "<h1 class='mb-0' id='ui_h1TotalSubscribers'>0</h1>" +
        "<p>Total Subscribers</p>" +
        "</div>" +
        "<div class='peopleicon'>" +
        "<i class='icon ion-ios-people-outline'></i>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>";
    $('#' + divId).html(WebPushSubscriberHtmlContent);
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    $.ajax({
        url: "/Dashboard/DashboardOverview/GetSubcribersDetails",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (SubcribersDetails) {

            if (SubcribersDetails != null)
                $("#ui_h1TotalSubscribers").html(SubcribersDetails.TotalSubcribers);
            else
                $("#ui_h1TotalSubscribers").html(0);

            LoadingImageCount--;
            NumberOfWidgetsLoaded++; TotalWidget++;
            ShowLoadingImageBasedOnCount();

        },
        error: function (error) {
            LoadingImageCount--;
            ShowAjaxError(error);
            ShowLoadingImageBasedOnCount();
        }
    });

}
//************************************************* WEB ENGAGEMENT ENDS **************************************************************