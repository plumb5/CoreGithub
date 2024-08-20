//Mobile Push EngagementRate *************************
function CreateMobilePushEngagementRateChart(divId) {

    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    var MobilePushEngagementRateHtmlContent = "<div class='engageWrap'>" +
        "<div class='card card-sales border-0'>" +
        "<h6 class='slim-card-title tx-primary'>Engagement</h6>" +
        "<div class='row'>" +
        "<div class='col'>" +
        "<label class='tx-12'>Viewed</label>" +
        "<div class='bnoticountsWrap'>" +
        "<div class='countNumb' id='ui_divMobileEngagementViewed'>0</div>" +
        "<div class='countper' id='ui_IconarrowMobileViewed'><i class='icon ion-android-arrow-dropup'></i> <span>0%</span></div>" +
        "</div>" +
        "</div>" +
        "<div class='col'>" +
        "<label class='tx-12'>Clicked</label>" +
        "<div class='bnoticountsWrap'>" +
        "<div class='countNumb' id='ui_divMobileEngagementClicked'>0</div>" +
        "<div class='countper' id='ui_IconarrowMobileClicked'><i class='icon ion-android-arrow-dropup'></i><span>0%</span></div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "<div class='progress mg-b-5' id='ui_divProgressBarMobileClickedRate'>" +
        "<div class='progress-bar bg-primary' style='width: 5%' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100'>0%</div>"+
        "</div>" +
        "<p class='tx-12 mg-b-0 mb-0'>Click Rate</p>" +
        "</div>" +
        "</div>";
    $('#' + divId).html(MobilePushEngagementRateHtmlContent);

    let MobileCompareFirstData = { TotalSent: 0, TotalViewed: 0, TotalClicked: 0, TotalClosed: 0 };
    $.ajax({
        url: "/Dashboard/DashboardOverview/GetMobilePushCampaignDetails",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (engagementDetails) {
           
            if (engagementDetails != null) {
                MobileCompareFirstData.TotalSent = engagementDetails.TotalSent;
                MobileCompareFirstData.TotalViewed = engagementDetails.TotalViewed;
                MobileCompareFirstData.TotalClicked = engagementDetails.TotalClicked;
                MobileCompareFirstData.TotalClosed = engagementDetails.TotalClosed;

                
                $("#ui_divMobileEngagementViewed").html(MobileCompareFirstData.TotalViewed);
                $("#ui_divMobileEngagementClicked").html(MobileCompareFirstData.TotalClicked);
               

                let TotalClickedRate = parseInt(MobileCompareFirstData.TotalSent) > 0 ? parseInt(Math.round((MobileCompareFirstData.TotalClicked / MobileCompareFirstData.TotalSent) * 100).toFixed(2)) : 0;
                let ProgressBarWidthClickedRate = TotalClickedRate > 5 ? TotalClickedRate : 5;
                

                let clickRateContent = `<div class="progress-bar bg-primary" style="width: ${ProgressBarWidthClickedRate}%" role="progressbar" aria-valuenow="${TotalClickedRate}" aria-valuemin="0" aria-valuemax="100">${TotalClickedRate}%</div>`;
                $("#ui_divProgressBarMobileClickedRate").html(clickRateContent);

                GetSecondMobileEngagementDetails(MobileCompareFirstData);
            }
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function GetSecondMobileEngagementDetails(MobileCompareFirstData) {
    let MobileCompareSecondData = { TotalSent: 0, TotalViewed: 0, TotalClicked: 0, TotalClosed: 0 };
    let fromDate = CalculateDateDifference();
    $.ajax({
        url: "/Dashboard/DashboardOverview/GetMobilePushCampaignDetails",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': fromDate, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (engagementDetails) {
            
            if (engagementDetails != null) {
                MobileCompareSecondData.TotalSent = engagementDetails.TotalSent;
                MobileCompareSecondData.TotalViewed = engagementDetails.TotalViewed;
                MobileCompareSecondData.TotalClicked = engagementDetails.TotalClicked;
                MobileCompareSecondData.TotalClosed = engagementDetails.TotalClosed;
                BindOverAllComparisionMobileEngagementData(MobileCompareFirstData, MobileCompareSecondData);
            }
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindOverAllComparisionMobileEngagementData(MobileCompareFirstData, MobileCompareSecondData) {
    ViewedPercent = CalculatePercentage(MobileCompareFirstData.TotalViewed, MobileCompareSecondData.TotalViewed);
    let viewedPer = `<i class="icon ion-android-arrow-dropdown"></i><span>${ViewedPercent}%</span>`;
    if (MobileCompareFirstData.TotalViewed === MobileCompareSecondData.TotalViewed || MobileCompareFirstData.TotalViewed > MobileCompareSecondData.TotalViewed)
        viewedPer = `<i class="icon ion-android-arrow-dropup"></i><span>${ViewedPercent}%</span>`;
    $("#ui_IconarrowMobileViewed").html(viewedPer);

    ClickedPercent = CalculatePercentage(MobileCompareFirstData.TotalClicked, MobileCompareSecondData.TotalClicked);
    let clickedPer = `<i class="icon ion-android-arrow-dropdown"></i><span>${ClickedPercent}%</span>`;
    if (MobileCompareFirstData.TotalClicked === MobileCompareSecondData.TotalClicked || MobileCompareFirstData.TotalClicked > MobileCompareSecondData.TotalClicked)
        clickedPer = `<i class="icon ion-android-arrow-dropup"></i><span>${ClickedPercent}%</span>`;
    $("#ui_IconarrowMobileClicked").html(clickedPer);

    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();
}

//Mobile Push Delivery Rate **************************
function CreateMobilePushDeliveryRateChart(divId) {

    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    var MobilePushDeliveryRateHtmlContent = "<div class='engageWrap'>" +
        "<div class='card card-sales border-0'>" +
        "<h6 class='slim-card-title tx-success mb-10'>Delivery</h6>" +
        "<div class='row'>" +
        "<div class='col'>" +
        "<label class='tx-12'>Sent</label>" +
        "<div class='bnoticountsWrap'>" +
        "<div class='countNumb' id='ui_divEngagementMobileSent'>0</div>" +
        "<div class='countper' id='ui_IconarrowMobileSent'><i class='icon ion-android-arrow-dropdup'></i> <span>0%</span></div>" +
        "</div>" +
        "</div>" +
        "<div class='col'>" +
        "<label class='tx-12'>Closed</label>" +
        "<div class='bnoticountsWrap'>" +
        "<div class='countNumb' id='ui_divEngagementMobileClosed'>0</div>" +
        "<div class='countper' id='ui_IconarrowMobileClosed'><i class='icon ion-android-arrow-dropdup'></i> <span>0%</span></div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "<div class='progress mg-b-5' id='ui_divProgressBarMobileClosedRate'>" +
        "<div class='progress-bar bg-success' style='width: 5%' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100'>0%</div>"+
        "</div>" +
        "<p class='tx-12 mg-b-0 mb-0'>Closed Rate</p>" +
        "</div>" +
        "</div>";

    $('#' + divId).html(MobilePushDeliveryRateHtmlContent);
    let MobileCompareFirstData = { TotalSent: 0, TotalViewed: 0, TotalClicked: 0, TotalClosed: 0 };
    $.ajax({
        url: "/Dashboard/DashboardOverview/GetMobilePushCampaignDetails",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (engagementDetails) {
            
            if (engagementDetails != null) {
                MobileCompareFirstData.TotalSent = engagementDetails.TotalSent;
                MobileCompareFirstData.TotalViewed = engagementDetails.TotalViewed;
                MobileCompareFirstData.TotalClicked = engagementDetails.TotalClicked;
                MobileCompareFirstData.TotalClosed = engagementDetails.TotalClosed;


                $("#ui_divEngagementMobileSent").html(MobileCompareFirstData.TotalSent);
                $("#ui_divEngagementMobileClosed").html(MobileCompareFirstData.TotalClosed);

                let TotalCloseRate = parseInt(MobileCompareFirstData.TotalSent) > 0 ? parseInt(Math.round((MobileCompareFirstData.TotalClosed / MobileCompareFirstData.TotalSent) * 100).toFixed(2)) : 0;

                let ProgressBarWidthCloseRate = TotalCloseRate > 5 ? TotalCloseRate : 5;


                let ClosedRateContent = `<div class="progress-bar bg-success" style="width: ${ProgressBarWidthCloseRate}%" role="progressbar" aria-valuenow="${TotalCloseRate}" aria-valuemin="0" aria-valuemax="100">${TotalCloseRate}%</div>`;
                $("#ui_divProgressBarMobileClosedRate").html(ClosedRateContent);

                GetSecondMobileEngagementDeliveryDetails(MobileCompareFirstData);
            }
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function GetSecondMobileEngagementDeliveryDetails(MobileCompareFirstData) {
    let MobileCompareSecondData = { TotalSent: 0, TotalViewed: 0, TotalClicked: 0, TotalClosed: 0 };
    let fromDate = CalculateDateDifference();
    $.ajax({
        url: "/Dashboard/DashboardOverview/GetMobilePushCampaignDetails",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': fromDate, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (engagementDetails) {
            
            if (engagementDetails != null) {
                MobileCompareSecondData.TotalSent = engagementDetails.TotalSent;
                MobileCompareSecondData.TotalViewed = engagementDetails.TotalViewed;
                MobileCompareSecondData.TotalClicked = engagementDetails.TotalClicked;
                MobileCompareSecondData.TotalClosed = engagementDetails.TotalClosed;
                BindOverAllComparisionMobileEngagementDeliveryData(MobileCompareFirstData, MobileCompareSecondData);
            }
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindOverAllComparisionMobileEngagementDeliveryData(MobileCompareFirstData, MobileCompareSecondData) {
    let SentPercent = 0, ClosedPercent = 0;
    SentPercent = CalculatePercentage(MobileCompareFirstData.TotalSent, MobileCompareSecondData.TotalSent);
    let sentPer = `<i class="icon ion-android-arrow-dropdown"></i><span>${SentPercent}%</span>`;
    if (MobileCompareFirstData.TotalSent === MobileCompareSecondData.TotalSent || MobileCompareFirstData.TotalSent > MobileCompareSecondData.TotalSent)
        sentPer = `<i class="icon ion-android-arrow-dropup"></i><span>${SentPercent}%</span>`;
    $("#ui_IconarrowMobileSent").html(sentPer);

    ClosedPercent = CalculatePercentage(MobileCompareFirstData.TotalClosed, MobileCompareSecondData.TotalClosed);
    let closedPer = `<i class="icon ion-android-arrow-dropdown"></i><span>${ClosedPercent}%</span>`;
    if (MobileCompareFirstData.TotalClosed === MobileCompareSecondData.TotalClosed || MobileCompareFirstData.TotalClosed > MobileCompareSecondData.TotalClosed)
        closedPer = `<i class="icon ion-android-arrow-dropup"></i><span>${ClosedPercent}%</span>`;
    $("#ui_IconarrowMobileClosed").html(closedPer);

    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();
}

//Mobile Push Subscriber *************************
function CreateMobilePushSubscribers(divId) {

    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    var MobilePushSubscriberHtmlContent = "<div class='box-white h-49'>" +
        "<div class='totalsubswrp h-100'>" +
        "<div class='totaltxticonwrp'>" +
        "<div class='totalnumb'>" +
        "<h1 class='mb-0' id='ui_h1TotalMobileSubscribers'>0</h1>" +
        "<p>Total Subscribers</p>" +
        "</div>" +
        "<div class='peopleicon'>" +
        "<i class='icon ion-ios-people-outline'></i>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>";
    $('#' + divId).html(MobilePushSubscriberHtmlContent);

    $.ajax({
        url: "/Dashboard/DashboardOverview/GetMobileSubcribersDetails",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (SubcribersDetails) {
           
            if (SubcribersDetails != null) 
                $("#ui_h1TotalMobileSubscribers").html(SubcribersDetails.TotalSubcribers); 
            else
                $("#ui_h1TotalMobileSubscribers").html(0);



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