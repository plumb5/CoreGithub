/* Css variables setPropertyValue */
var style = getComputedStyle(document.body);

/* Line Chart css Variables */

/* Line chart background-color */
var LineChartbgColItem1 = style.getPropertyValue(
    "--LineChart-BackgroundColor-Item1"
);
var LineChartbgColItem2 = style.getPropertyValue(
    "--LineChart-BackgroundColor-Item2"
);
var LineChartbgColItem3 = style.getPropertyValue(
    "--LineChart-BackgroundColor-Item3"
);
var LineChartbgColItem4 = style.getPropertyValue(
    "--LineChart-BackgroundColor-Item4"
);
var LineChartbgColItem5 = style.getPropertyValue(
    "--LineChart-BackgroundColor-Item5"
);
var LineChartbgColItem6 = style.getPropertyValue(
    "--LineChart-BackgroundColor-Item6"
);
var LineChartbgColItem7 = style.getPropertyValue(
    "--LineChart-BackgroundColor-Item7"
);
var LineChartbgColItem8 = style.getPropertyValue(
    "--LineChart-BackgroundColor-Item8"
);

/* Line chart border-color */
var LineChartbrdcolItem1 = style.getPropertyValue(
    "--LineChart-BorderColor-Item1"
);
var LineChartbrdcolItem2 = style.getPropertyValue(
    "--LineChart-BorderColor-Item2"
);
var LineChartbrdcolItem3 = style.getPropertyValue(
    "--LineChart-BorderColor-Item3"
);
var LineChartbrdcolItem4 = style.getPropertyValue(
    "--LineChart-BorderColor-Item4"
);
var LineChartbrdcolItem5 = style.getPropertyValue(
    "--LineChart-BorderColor-Item5"
);
var LineChartbrdcolItem6 = style.getPropertyValue(
    "--LineChart-BorderColor-Item6"
);
var LineChartbrdcolItem7 = style.getPropertyValue(
    "--LineChart-BorderColor-Item7"
);
var LineChartbrdcolItem8 = style.getPropertyValue(
    "--LineChart-BorderColor-Item8"
);

var TimeDuration = "this_week";
var AudienceLineChart = null;
var PageImpressionsLineChart = null;
var IsLoadingShows = { IsPageSummary: false, IsGenderPercentage: false, IsAudienceEngagement: false, IsFansByCountry: false, IsPageImpressions: false, IsGenderAgeBreakup: false };
var clearTimeInterval = null;
var FbPageIndex = 0;

var dashboardUtil = {
    GetFBPages: function () {
        $("#ddlPages").empty();
        $.ajax({
            url: "/FacebookPage/Dashboard/GetFacebookPages",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                let SelectedPageIndex = result.SelectedPageIndex != undefined && result.SelectedPageIndex != null ? result.SelectedPageIndex : 0;
                if (result.fbPages != undefined && result.fbPages != null) {

                    $.each(result.fbPages, function (i) {
                        if (i == SelectedPageIndex) {
                            FbPageIndex = SelectedPageIndex;
                            $("#dropdownMenuButton").html('<span  id="spnSelectPage" data-index=' + i + ' class="fbclntnametxt">' + $(this)[0].PageName + '</span> <i class="fbclientlogo" style="background-image: url(\'' + $(this)[0].ImageUrl + '\')"></i>');
                            dashboardUtil.SelectPage(i, $(this)[0].PageName, $(this)[0].ImageUrl);
                        }
                        $("#ddlPages").append('<a onclick="dashboardUtil.SelectPage(' + i + ',\'' + $(this)[0].PageName + '\',\'' + $(this)[0].ImageUrl + '\')" class="dropdown-item" data-fbclientname="Plumb5" data-fbclientlogo="https://www.plumb5.com/favicon.ico" href="#"><i class="fa fa-file-o mr-2"></i>' + $(this)[0].PageName + '</a>');
                    });
                }
            },
            error: ShowAjaxError
        });
    },
    SelectPage: function (index, page, image) {
        ShowPageLoading();
        FbPageIndex = index;
        $("#dropdownMenuButton").html('<span  id="spnSelectPage" data-index=' + index + ' class="fbclntnametxt">' + page + '</span> <i class="fbclientlogo" style="background-image: url(\'' + image + '\')"></i>');
        dashboardUtil.BindDashboardDetails();
    },
    BindDashboardDetails: function () {
        FbPageIndex = $("#spnSelectPage").attr("data-index");
        $.ajax({
            url: "/FacebookPage/Dashboard/GetDashboardDetails",
            type: 'POST',
            data: JSON.stringify({ 'TimeDuration': TimeDuration, 'PageIndex': FbPageIndex }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result != undefined && result.Status) {
                    if (result.dashboarddetails != undefined && result.dashboarddetails != null && result.dashboarddetails != "") {
                        var dashboardResponseDetails = JSON.parse(result.dashboarddetails);

                        if (dashboardResponseDetails.PageSummary != undefined && dashboardResponseDetails.PageSummary != null && dashboardResponseDetails.PageSummary.length > 0) {
                            IsLoadingShows.IsPageSummary = true;
                            dashboardUtil.BindPageSummary(dashboardResponseDetails.PageSummary);
                        }

                        if (dashboardResponseDetails.GenderPercentage != undefined && dashboardResponseDetails.GenderPercentage != null && dashboardResponseDetails.GenderPercentage.length > 0) {
                            IsLoadingShows.IsGenderPercentage = true;
                            dashboardUtil.BindGenderPercentage(dashboardResponseDetails.GenderPercentage);
                        }

                        //This method contains "Like": "1","Comment": "0","Share": "0"
                        var AudienceEngagementGraphItem = { ShortDate: [], LikesCount: [], CommentsCount: [], SharesCount: [] };
                        if (dashboardResponseDetails.AudienceEngagement != undefined && dashboardResponseDetails.AudienceEngagement != null && dashboardResponseDetails.AudienceEngagement.length > 0) {
                            IsLoadingShows.IsAudienceEngagement = true;

                            for (let i = 0; i < dashboardResponseDetails.AudienceEngagement.length; i++) {
                                var dateParts = dashboardResponseDetails.AudienceEngagement[i].Date.split(" ");
                                var actualdate = dateParts[0].split("/");
                                var dateObject = new Date(+actualdate[2], actualdate[1] - 1, +actualdate[0]);
                                AudienceEngagementGraphItem.ShortDate.push(monthDetials[dateObject.getMonth()] + " " + dateObject.getDate());
                                AudienceEngagementGraphItem.LikesCount.push(dashboardResponseDetails.AudienceEngagement[i].Like);
                                AudienceEngagementGraphItem.CommentsCount.push(dashboardResponseDetails.AudienceEngagement[i].Comment);
                                AudienceEngagementGraphItem.SharesCount.push(dashboardResponseDetails.AudienceEngagement[i].Share);
                            }

                            dashboardUtil.BindChartForAudienceEngagement(AudienceEngagementGraphItem);
                        }
                        else {
                            dashboardUtil.BindChartForAudienceEngagement(AudienceEngagementGraphItem);
                        }

                        //This method contains FansByCountry Page Insights
                        if (dashboardResponseDetails.FansByCountry != undefined && dashboardResponseDetails.FansByCountry != null && dashboardResponseDetails.FansByCountry.length > 0) {
                            IsLoadingShows.IsFansByCountry = true;

                            $("#ui_tdbodyFansByCountryData").empty();
                            var reportTableTrs = "";
                            for (let i = 0; i < dashboardResponseDetails.FansByCountry.length; i++) {

                                reportTableTrs += '<tr>' +
                                    '<td class="text-left">' +
                                    '<i class="flag flag-' + dashboardResponseDetails.FansByCountry[i].CountryCode.toLowerCase() + '"></i>' + dashboardResponseDetails.FansByCountry[i].CountryName + '' +
                                    '</td>' +
                                    '<td>' + dashboardResponseDetails.FansByCountry[i].Fans + '</td>' +
                                    '</tr>';
                            }
                            $("#ui_tdbodyFansByCountryData").append(reportTableTrs);
                        }
                        else {
                            SetNoRecordContent('ui_tblFansByCountryData', 2, 'ui_tdbodyFansByCountryData');
                        }

                        //This method contains  "Paid": "0", "Organic": "7","Viral": "2"
                        var PageImpressionsGraphItem = { ShortDate: [], PaidCount: [], OrganicCount: [], ViralCount: [] };
                        if (dashboardResponseDetails.PageImpressions != undefined && dashboardResponseDetails.PageImpressions != null && dashboardResponseDetails.PageImpressions.length > 0) {
                            IsLoadingShows.IsPageImpressions = true;

                            for (let i = 0; i < dashboardResponseDetails.PageImpressions.length; i++) {
                                var dateParts = dashboardResponseDetails.PageImpressions[i].Date.split(" ");
                                var actualdate = dateParts[0].split("/");
                                var dateObject = new Date(+actualdate[2], actualdate[1] - 1, +actualdate[0]);
                                PageImpressionsGraphItem.ShortDate.push(monthDetials[dateObject.getMonth()] + " " + dateObject.getDate());
                                PageImpressionsGraphItem.PaidCount.push(dashboardResponseDetails.PageImpressions[i].Paid);
                                PageImpressionsGraphItem.OrganicCount.push(dashboardResponseDetails.PageImpressions[i].Organic);
                                PageImpressionsGraphItem.ViralCount.push(dashboardResponseDetails.PageImpressions[i].Viral);
                            }
                            dashboardUtil.BindChartForPageImpressions(PageImpressionsGraphItem);
                        }
                        else {
                            dashboardUtil.BindChartForPageImpressions(PageImpressionsGraphItem);
                        }

                        //This method contains GenderAgeBreakup
                        var genderAgeBreakupGraphItems = [];
                        if (dashboardResponseDetails.GenderAgeBreakup != undefined && dashboardResponseDetails.GenderAgeBreakup != null && dashboardResponseDetails.GenderAgeBreakup.length > 0) {
                            $("#agepyramid").empty();
                            $("#agepyramidnodata").addClass("hideDiv");
                            IsLoadingShows.IsGenderAgeBreakup = true;

                            for (let i = 0; i < dashboardResponseDetails.GenderAgeBreakup.length; i++) {
                                genderAgeBreakupGraphItems.push({ age: dashboardResponseDetails.GenderAgeBreakup[i]["Age Range"], male: dashboardResponseDetails.GenderAgeBreakup[i].M, female: dashboardResponseDetails.GenderAgeBreakup[i].F });
                            }

                            dashboardUtil.BindGenderAgeBreakup(genderAgeBreakupGraphItems);
                        }
                        else {
                            $("#agepyramid").empty();
                            $("#agepyramidnodata").removeClass("hideDiv");
                            //genderAgeBreakupGraphItems.push({ age: '0-0', male: 0, female: 0 });
                            //dashboardUtil.BindGenderAgeBreakup(genderAgeBreakupGraphItems);
                        }
                    }
                    else {
                        ShowErrorMessage(GlobalErrorList.FacebookDashboard.ResponseError);
                    }
                }
                else if (!result.Status) {
                    ShowErrorMessage(GlobalErrorList.FacebookDashboard.Authentication_Error);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    BindPageContent: function () {
        $.ajax({
            url: "/FacebookPage/Dashboard/GetPageContent",
            type: 'POST',
            data: JSON.stringify({ 'TimeDuration': TimeDuration, 'PageIndex': FbPageIndex }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result != undefined && result.Status) {
                    if (result.fbpagecontent != undefined && result.fbpagecontent != null && result.fbpagecontent != "") {
                        $('#fbpreviewcontent').width($('#fbpreviewcontent').parent().width());
                        $('#fbpreviewcontent').height($('#fbpreviewcontent').parent().parent().height());
                        $("#fbpreviewcontent").attr("srcdoc", result.fbpagecontent);
                     }
                    else {
                        ShowErrorMessage(GlobalErrorList.FacebookDashboard.EmptyContent);
                    }
                }
                else if (!result.Status) {
                    ShowErrorMessage(GlobalErrorList.FacebookDashboard.Authentication_Error);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    //This method contains NO. OF FANS , PAGE VIEWS , PAGE VIEWS , TOTAL LIKES
    BindPageSummary: function (ResponseDetails) {

        var totalpageviews = JSLINQ(ResponseDetails).Where(function () { return (this.name == "page_views_total"); });

        if (totalpageviews.items[0] != undefined && totalpageviews.items[0].name != null && totalpageviews.items[0].name != "")
            $("#lbl_NumberOfPageViews").html(totalpageviews.items[0].values);

        var totalpagefans = JSLINQ(ResponseDetails).Where(function () { return (this.name == "page_fans"); });

        if (totalpagefans.items[0] != undefined && totalpagefans.items[0].name != null && totalpagefans.items[0].name != "")
            $("#lbl_NumberOfFansCount").html(totalpagefans.items[0].values);

        var totalpageactions = JSLINQ(ResponseDetails).Where(function () { return (this.name == "page_total_actions"); });

        if (totalpageactions.items[0] != undefined && totalpageactions.items[0].name != null && totalpageactions.items[0].name != "")
            $("#lbl_NumberOfTotalAction").html(totalpageactions.items[0].values);

        var totalpagelikeactions = JSLINQ(ResponseDetails).Where(function () { return (this.name == "page_actions_post_reactions_like_total"); });

        if (totalpagelikeactions.items[0] != undefined && totalpagelikeactions.items[0].name != null && totalpagelikeactions.items[0].name != "")
            $("#lbl_NumberOfTotalLikes").html(totalpagelikeactions.items[0].values);
    },
    //This method contains MALE and FEMALE Page Insights
    BindGenderPercentage: function (ResponseDetails) {
        $("#lbl_MalePercentage").html(ResponseDetails[0].Male + "%");
        $("#lbl_FemalePercentage").html(ResponseDetails[0].Female + "%");
    },

    //This method contains MALE and FEMALE By Age
    BindGenderAgeBreakup: function (genderAgeBreakupGraphItems) {
        var options = {
            height: 350, width: 360,
            style: {
                leftBarColor: "#23bf08",
                rightBarColor: "#6f42c1"
            }
        }
        pyramidBuilder(genderAgeBreakupGraphItems, '#agepyramid', options);
    },

    BindChartForAudienceEngagement: function (GraphItem) {

        Chart.plugins.unregister(ChartDataLabels);
        Chart.defaults.global.defaultFontSize = 10;
        Chart.defaults.global.legend.labels.boxWidth = 10;

        if (AudienceLineChart != null)
            AudienceLineChart.destroy();

        // line chart start here
        AudienceLineChart = new Chart(document.getElementById("audiencebyday"), {
            type: 'line',
            data: {
                labels: GraphItem.ShortDate,
                datasets: [{
                    data: GraphItem.LikesCount,
                    label: "Likes",
                    borderWidth: 1.5,
                    borderColor: LineChartbrdcolItem2,
                    backgroundColor: LineChartbgColItem2,
                    fill: false
                },
                {
                    data: GraphItem.CommentsCount,
                    label: "Comments",
                    borderWidth: 1.5,
                    borderColor: LineChartbrdcolItem1,
                    backgroundColor: LineChartbgColItem1,
                    fill: false
                },
                {
                    data: GraphItem.SharesCount,
                    label: "Shares",
                    borderWidth: 1.5,
                    borderColor: LineChartbrdcolItem3,
                    backgroundColor: LineChartbgColItem3,
                    fill: false
                }
                ]
            },
            options: {
                maintainAspectRatio: false,
                elements: {
                    point: {
                        radius: 2
                    }
                },
                scales: {
                    yAxes: [{}]
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    fullWidth: true,
                    labels: {
                        fontSize: 11,
                        boxHeight: 0

                    }
                }
            }
        });

        //Chart.plugins.unregister(ChartDataLabels);
        //Chart.defaults.global.defaultFontSize = 10;
        //Chart.defaults.global.legend.labels.boxWidth = 10;

        //if (AudienceLineChart != null)
        //    AudienceLineChart.destroy();

        //AudienceLineChart = new Chart(document.getElementById("audiencebyday"), {
        //    type: 'line',
        //    data: {
        //        labels: GraphItem.ShortDate,
        //        datasets: [{
        //            data: GraphItem.LikesCount,
        //            label: "Likes",
        //            borderWidth: 1.5,
        //            borderColor: cssvar('--LineChart-BorderColor-Item1'),
        //            backgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
        //            fill: false
        //        },
        //        {
        //            data: GraphItem.CommentsCount,
        //            label: "Comments",
        //            borderWidth: 1.5,
        //            borderColor: cssvar('--LineChart-BorderColor-Item2'),
        //            backgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
        //            fill: false
        //        },
        //        {
        //            data: GraphItem.SharesCount,
        //            label: "Shares",
        //            borderWidth: 1.5,
        //            borderColor: cssvar('--LineChart-BorderColor-Item3'),
        //            backgroundColor: cssvar('--LineChart-BackgroundColor-Item3'),
        //            fill: false
        //        }
        //        ]
        //    },
        //    options: {
        //        maintainAspectRatio: false,
        //        elements: {
        //            line: {
        //                tension: 0
        //            },
        //            point: {
        //                radius: 2
        //            }
        //        },
        //        legend: {
        //            display: true,
        //            position: 'bottom',
        //            fullWidth: true,
        //            labels: {
        //                fontSize: 11,
        //                boxHeight: 0,

        //            },
        //            responsive: true,
        //            scales: {
        //                xAxes: [{
        //                    stacked: true,
        //                    ticks: {
        //                        beginAtZero: true
        //                    }
        //                }],
        //                yAxes: [{
        //                    stacked: true,
        //                    ticks: {
        //                        beginAtZero: true
        //                    }
        //                }]
        //            }
        //        }
        //    }
        //});
    },
    BindChartForPageImpressions: function (GraphItem) {

        if (PageImpressionsLineChart != null)
            PageImpressionsLineChart.destroy();

        Chart.plugins.unregister(ChartDataLabels);
        Chart.defaults.global.defaultFontSize = 10;
        Chart.defaults.global.legend.labels.boxWidth = 10;

        PageImpressionsLineChart = new Chart(document.getElementById("fbpageimpress"), {
            type: 'line',
            data: {
                labels: GraphItem.ShortDate,
                datasets: [{
                    data: GraphItem.PaidCount,
                    label: "Paid",
                    borderWidth: 1.5,
                    borderColor: LineChartbrdcolItem6,
                    backgroundColor: LineChartbgColItem6,
                    fill: true
                },
                {
                    data: GraphItem.ViralCount,
                    label: "Viral",
                    borderWidth: 1.5,
                    borderColor: LineChartbrdcolItem1,
                    backgroundColor: LineChartbgColItem1,
                    fill: true
                },
                {
                    data: GraphItem.OrganicCount,
                    label: "Organic",
                    borderWidth: 1.5,
                    borderColor: LineChartbrdcolItem3,
                    backgroundColor: LineChartbgColItem3,
                    fill: true
                }
                ]
            },
            options: {
                maintainAspectRatio: false,
                elements: {
                    point: {
                        radius: 2
                    }
                },
                scales: {
                    yAxes: [{}]
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    fullWidth: true,
                    labels: {
                        fontSize: 11,
                        boxHeight: 0

                    }
                }
            }
        });

        //Chart.plugins.unregister(ChartDataLabels);
        //Chart.defaults.global.defaultFontSize = 10;
        //Chart.defaults.global.legend.labels.boxWidth = 10;

        //if (PageImpressionsLineChart != null)
        //    PageImpressionsLineChart.destroy();

        //PageImpressionsLineChart = new Chart(document.getElementById("fbpageimpress"), {
        //    type: 'line',
        //    data: {
        //        labels: GraphItem.ShortDate,
        //        datasets: [{
        //            data: GraphItem.PaidCount,
        //            label: "Paid",
        //            borderWidth: 1.5,
        //            borderColor: LineChartbrdcolItem6,
        //            backgroundColor: LineChartbgColItem6,
        //            fill: false
        //        },
        //        {
        //            data: GraphItem.OrganicCount,
        //            label: "Organic",
        //            borderWidth: 1.5,
        //            borderColor: LineChartbrdcolItem1,
        //            backgroundColor: LineChartbgColItem1,
        //            fill: false
        //        },
        //        {
        //            data: GraphItem.ViralCount,
        //            label: "Viral",
        //            borderWidth: 1.5,
        //            borderColor: LineChartbrdcolItem3,
        //            backgroundColor: LineChartbgColItem3,
        //            fill: false
        //        }
        //        ]
        //    },
        //    options: {
        //        maintainAspectRatio: false,
        //        elements: {
        //            line: {
        //                tension: 0
        //            },
        //            point: {
        //                radius: 2
        //            }
        //        },
        //        legend: {
        //            display: true,
        //            position: 'bottom',
        //            fullWidth: true,
        //            labels: {
        //                fontSize: 11,
        //                boxHeight: 0,

        //            },
        //            responsive: true,
        //            scales: {
        //                xAxes: [{
        //                    stacked: true,
        //                    ticks: {
        //                        beginAtZero: true
        //                    }
        //                }],
        //                yAxes: [{
        //                    stacked: true,
        //                    ticks: {
        //                        beginAtZero: true
        //                    }
        //                }]
        //            }
        //        }
        //    }
        //});
    },
};

$(document).ready(() => {
    ShowPageLoading();
    dashboardUtil.GetFBPages();
    //dashboardUtil.BindDashboardDetails();
    //clearTimeInterval = setInterval(IsLoadingToHide, 1000);
});

function IsLoadingToHide() {
    if (IsLoadingShows.IsPageSummary && IsLoadingShows.IsGenderPercentage && IsLoadingShows.IsAudienceEngagement && IsLoadingShows.IsFansByCountry && IsLoadingShows.IsPageImpressions && IsLoadingShows.IsGenderAgeBreakup) {
        clearInterval(clearTimeInterval);
        HidePageLoading();
    }
    else {
        ShowPageLoading();
    }
}

$(".datedropdown > .dropdown-menu a").click(function () {
    ShowPageLoading();
    var SelectedDateDropDown = $(this).text();
    $('#selectdateDropdown').html(SelectedDateDropDown);

    if (SelectedDateDropDown.toLowerCase() == "this week")
        TimeDuration = "this_week";
    else if (SelectedDateDropDown.toLowerCase() == "this month")
        TimeDuration = "this_month";
    else if (SelectedDateDropDown.toLowerCase() == "this quarter")
        TimeDuration = "this_quarter";
    else if (SelectedDateDropDown.toLowerCase() == "last week")
        TimeDuration = "last_week";
    else if (SelectedDateDropDown.toLowerCase() == "last month")
        TimeDuration = "last_month";
    else if (SelectedDateDropDown.toLowerCase() == "Last quarter")
        TimeDuration = "last_quarter";

    dashboardUtil.BindDashboardDetails();
});

$(".openfbpage").click(function () {
    $("#fbpostiframewrp").addClass("hideDiv");
    $(".popuptitle h6").html("Create Facebook Post");
    $(".popupcontainer, #fbcreateposttab, .createpostbtn").removeClass("hideDiv");
    dashboardUtil.BindPageContent();
});

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
});

