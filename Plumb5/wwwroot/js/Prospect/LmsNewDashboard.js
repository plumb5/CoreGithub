var UserId = 0, topStagesGraph, topSourcesGraph, leadChanWise, ctx;
var allstagedetails = "";

var OrderBy = 0;

var lmsstagelist;
var lmssourcelist;
var labellist = ["Unlabeled", "Hot", "Warm", "Cold"];
var StageList = ["Closed Won", "Closed Lost"];
var UserIdList = "";
var UserGroupList = [];
var UserHierarchy = "";

var IsLoadingShows = {
    IsLeadSummary: false, IsPlannedDetails: false, IsLabelWiseLeadsCount: false, IsStageWiseLeadsCount: false,
    IsSourceWiseLeadsCount: false, IsLeadLabelByUserPerformance: false, CampaignDetails: false, IsStageWiseVsLabel: false, IsSourceWiseVsLabel: false, IsStageWiseVsSourceWise: false
};

var clearTimeInterval = null;

$(document).ready(function () {
    LeadDashboardUtil.GetUserAndUserGrpList();
    setTimeout(function () { GetUTCDateTimeRange(2); }, 500);
});

$(".lmsorderbymenu").click(function () {
    $("#lmsallsources").val("select");
    let lmsorderbyval = $(this).attr("data-ordername");

    if (lmsorderbyval == "Created Date")
        OrderBy = 0;
    else if (lmsorderbyval == "Updated Date")
        OrderBy = 1;

    $(".filtwrpbar").removeClass("hideDiv");
    $(".lmssourcefilterwrp, .lmsstagefilterwrp, .lmshandledfilterwrp").addClass("hideDiv");
    $(".subdivWrap").addClass("showDiv");
    $(".filttypetext").html("Order By: " + lmsorderbyval);

    setTimeout(function () { CallBackFunction(); }, 500);
});

function CallBackFunction() {
    LeadDashboardUtil.DestroyCharts();

    IsLoadingShows.IsLeadSummary = false; IsLoadingShows.IsPlannedDetails = false; IsLoadingShows.IsLabelWiseLeadsCount = false;
    IsLoadingShows.IsStageWiseLeadsCount = false; IsLoadingShows.IsSourceWiseLeadsCount = false; IsLoadingShows.IsLeadLabelByUserPerformance = false;
    IsLoadingShows.CampaignDetails = false; IsLoadingShows.IsStageWiseVsLabel = false; IsLoadingShows.IsSourceWiseVsLabel = false;
    IsLoadingShows.RevenueDetails = false; IsLoadingShows.IsStageWiseVsSourceWise = false;
    IsLoadingShows.IsBindSummaryComparision = false; IsLoadingShows.IsRevenueComparision = false; IsLoadingShows.LeadWonComparision = false;

    ShowPageLoading();
    LeadDashboardUtil.GetSummary();
    LeadDashboardUtil.GetRevenueDetails();
    LeadDashboardUtil.GetPlannedDetails();
    LeadDashboardUtil.LeadsWonLost();
    LeadDashboardUtil.GetLabelWiseLeadsCount();
    LeadDashboardUtil.GetStageWiseLeadsCount();
    LeadDashboardUtil.GetSourceWiseLeadsCount();
    LeadDashboardUtil.GetLeadLabelByUserPerformance();
    LeadDashboardUtil.GetCampaignDetails();
    LeadDashboardUtil.GetStageWiseVsLabel();
    LeadDashboardUtil.GetSourceWiseVsLabel();
    LeadDashboardUtil.GetStageWiseVsSourceWise();
    clearTimeInterval = setInterval(IsLoadingToHide, 500);
}

function IsLoadingToHide() {
    if (IsLoadingShows.IsLeadSummary && IsLoadingShows.IsPlannedDetails && IsLoadingShows.IsLabelWiseLeadsCount && IsLoadingShows.IsStageWiseLeadsCount &&
        IsLoadingShows.IsSourceWiseLeadsCount && IsLoadingShows.IsLeadLabelByUserPerformance && IsLoadingShows.CampaignDetails && IsLoadingShows.IsStageWiseVsLabel
        && IsLoadingShows.IsSourceWiseVsLabel && IsLoadingShows.RevenueDetails && IsLoadingShows.IsStageWiseVsSourceWise &&
        IsLoadingShows.IsBindSummaryComparision && IsLoadingShows.IsRevenueComparision && IsLoadingShows.LeadWonComparision) {
        clearInterval(clearTimeInterval);
        HidePageLoading();
    }
    else {
        ShowPageLoading();
    }
}

var LeadDashboardUtil = {
    GetUserAndUserGrpList: function () {
        $.ajax({
            url: "/Prospect/Dashboard/GetUserHierarchy",
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'UserId': UserId }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (response) {
                if (response != undefined && response != null) {
                    UserIdList = response.UserIds;
                    UserGroupList = response.UserGrpList;
                    UserHierarchy = response.UserHierarchy;
                }
                LeadDashboardUtil.GetLmsStage();
            },
            error: ShowAjaxError
        });
    },
    GetLmsStage: function () {
        $.ajax({
            url: "/Prospect/Leads/GetStageScore",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (response) {
                if (response.AllStages != null && response.AllStages.length > 0) {
                    lmsstagelist = response.StagesList;
                }
                LeadDashboardUtil.GetLmssources();
            },
            error: ShowAjaxError
        });
    },
    GetLmssources: function () {
        $.ajax({
            url: "/Prospect/Leads/LmsGroupsList",
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    lmssourcelist = response;
                }
            },
            error: ShowAjaxError
        });
    },
    GetSummary: function () {
        $.ajax({
            url: "/Prospect/Dashboard/GetSummary",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'OrderBy': OrderBy, 'UserIds': UserIdList, 'userGroupslist': UserGroupList }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                IsLoadingShows.IsLeadSummary = true;
                $("#ui_h2_LeadsIn").html(0);

                if (response != null && response != undefined && response.Table1.length > 0) {
                    $("#ui_h2_LeadsIn").html(response.Table1[0].CurrentLeads);
                }
                LeadDashboardUtil.GetSummaryOldData(response.Table1[0].CurrentLeads);
            },
            error: ShowAjaxError
        });
    },
    GetSummaryOldData: function (CompareFirstData) {
        var from_Date = CalculateDateDifference();
        $.ajax({
            url: "/Prospect/Dashboard/GetSummary",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'FromDateTime': from_Date, 'ToDateTime': FromDateTime, 'OrderBy': OrderBy, 'UserIds': UserIdList, 'userGroupslist': UserGroupList }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                IsLoadingShows.IsBindSummaryComparision = true;
                LeadDashboardUtil.BindSummaryComparision(response, CompareFirstData);
            },
            error: ShowAjaxError
        });
    },
    BindSummaryComparision: function (response, CompareFirstData) {

        var CompareSecondData = 0;
        var PerCentValue = 0, comparisionContent = "";

        if (response != null && response != undefined && response.Table1.length > 0) {
            CompareSecondData = response.Table1[0].CurrentLeads;
        }

        PerCentValue = CalculatePercentage(CompareFirstData, CompareSecondData);

        if (CompareSecondData == CompareFirstData)
            comparisionContent += "<i class='fa fa-caret-up'></i><span>" + PerCentValue + "%</span></p>";
        else if (CompareFirstData > CompareSecondData)
            comparisionContent += "<i class='fa fa-caret-up'></i><span>" + PerCentValue + "%</span>";
        else if (CompareFirstData < CompareSecondData)
            comparisionContent += "<i class='fa fa-caret-down'></i><span>" + PerCentValue + "%</span>";

        $("#ui_p_leadspercent").html(comparisionContent);
    },
    GetRevenueDetails: function () {
        $.ajax({
            url: "/Prospect/Dashboard/GetRevenueDetails",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'OrderBy': OrderBy, 'UserIds': UserIdList, 'userGroupslist': UserGroupList }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                IsLoadingShows.RevenueDetails = true;

                if (response != null && response != undefined && response.Table1.length > 0) {
                    $("#ui_revenueCount").html(response.Table1[0].TotalRevenue);
                }
                else {
                    $("#ui_revenueCount").html(0);
                }

                LeadDashboardUtil.GetRevenueOldData(response.Table1[0].TotalRevenue);
            },
            error: ShowAjaxError
        });
    },
    GetPlannedDetails: function () {
        $.ajax({
            url: "/Prospect/Dashboard/GetFollowUpLeadsCount",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'OrderBy': OrderBy, 'UserIds': UserIdList, 'userGroupslist': UserGroupList }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                IsLoadingShows.IsPlannedDetails = true;
                $("#ui_h2_plannedleads,#ui_h2_completedleads,#ui_h2_missedleads").html(0);

                if (response != null && response != undefined && response.Table1.length > 0) {

                    for (var i = 0; i < response.Table1.length; i++) {
                        if (response.Table1[i].FollowUpStatus == 1)
                            $("#ui_h2_plannedleads").html(response.Table1[i].LeadCount);
                        else if (response.Table1[i].FollowUpStatus == 2)
                            $("#ui_h2_completedleads").html(response.Table1[i].LeadCount);
                        else if (response.Table1[i].FollowUpStatus == 3)
                            $("#ui_h2_missedleads").html(response.Table1[i].LeadCount);
                    }
                }
            },
            error: ShowAjaxError
        });
    },
    LeadsWonLost: function () {
        $.ajax({
            url: "/Prospect/Dashboard/LeadWonLostReport",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'Duration': duration, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'OrderBy': OrderBy, 'UserIds': UserIdList, 'userGroupslist': UserGroupList }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var CompareFirstData = { LeadWon: 0, LeadLost: 0 };
                $("#ui_h1_LeadWon").html(0);
                $("#ui_h1_LeadLost").html(0);

                if (response != null && response != undefined) {
                    var total = 0;

                    if (response.TotalWin.length > 0) {
                        total = 0;

                        for (var i = 0; i < response.TotalWin.length; i++) {
                            total += parseInt(response.TotalWin[i]);
                        }

                        CompareFirstData.LeadWon = total;
                        $("#ui_h1_LeadWon").html(total);
                    }

                    if (response.TotalLost.length > 0) {
                        total = 0;
                        for (var j = 0; j < response.TotalLost.length; j++) {
                            total += parseInt(response.TotalLost[j]);
                        }
                        CompareFirstData.LeadLost = total;
                        $("#ui_h1_LeadLost").html(total);
                    }
                }
                LeadDashboardUtil.GetOverAllComparision(CompareFirstData);
            },
            error: ShowAjaxError
        });
    },
    GetRevenueOldData: function (CompareFirstData) {
        var from_Date = CalculateDateDifference();
        $.ajax({
            url: "/Prospect/Dashboard/GetRevenueDetails",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'FromDateTime': from_Date, 'ToDateTime': FromDateTime, 'OrderBy': OrderBy, 'UserIds': UserIdList, 'userGroupslist': UserGroupList }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                IsLoadingShows.IsRevenueComparision = true;
                LeadDashboardUtil.BindRevenueComparision(response, CompareFirstData);
            },
            error: ShowAjaxError
        });
    },
    BindRevenueComparision: function (response, CompareFirstData) {
        var CompareSecondData = 0;
        var PerCentValue = 0, comparisionContent = "";

        if (response != null && response != undefined && response.Table1.length > 0) {
            CompareSecondData = response.Table1[0].TotalRevenue;
        }

        PerCentValue = CalculatePercentage(CompareFirstData, CompareSecondData);

        if (CompareSecondData == CompareFirstData)
            comparisionContent += "<i class='fa fa-caret-up'></i><span>" + PerCentValue + "%</span></p>";
        else if (CompareFirstData > CompareSecondData)
            comparisionContent += "<i class='fa fa-caret-up'></i><span>" + PerCentValue + "%</span>";
        else if (CompareFirstData < CompareSecondData)
            comparisionContent += "<i class='fa fa-caret-down'></i><span>" + PerCentValue + "%</span>";

        $("#ui_p_revenuepercent").html(comparisionContent);
    },
    GetOverAllComparision: function (CompareFirstData) {
        var from_Date = CalculateDateDifference();
        $.ajax({
            url: "/Prospect/Dashboard/LeadWonLostReport",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'Duration': duration, 'FromDateTime': from_Date, 'ToDateTime': FromDateTime, 'OrderBy': OrderBy, 'UserIds': UserIdList, 'userGroupslist': UserGroupList }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                IsLoadingShows.LeadWonComparision = true;
                LeadDashboardUtil.BindOverAllComparision(response, CompareFirstData);
            },
            error: ShowAjaxError
        });
    },
    BindOverAllComparision: function (response, CompareFirstData) {
        var CompareSecondData = { LeadWon: 0, LeadLost: 0 };
        var PerCentValue = 0, comparisionContent = "";

        if (response != null && response != undefined) {
            var total = 0;
            if (response.TotalWin.length > 0) {
                total = 0;
                for (var i = 0; i < response.TotalWin.length; i++) {
                    total += parseInt(response.TotalWin[i]);
                }
                CompareSecondData.LeadWon = total;
            }

            if (response.TotalLost.length > 0) {
                total = 0;
                for (var j = 0; j < response.TotalLost.length; j++) {
                    total += parseInt(response.TotalLost[j]);
                }
                CompareSecondData.LeadLost = total;
            }
        }

        PerCentValue = CalculatePercentage(CompareFirstData.LeadWon, CompareSecondData.LeadWon);

        if (CompareSecondData.LeadWon == CompareFirstData.LeadWon)
            comparisionContent += "<i class='fa fa-caret-up'></i><span>" + PerCentValue + "%</span></p>";
        else if (CompareFirstData.LeadWon > CompareSecondData.LeadWon)
            comparisionContent += "<i class='fa fa-caret-up'></i><span>" + PerCentValue + "%</span>";
        else if (CompareFirstData.LeadWon < CompareSecondData.LeadWon)
            comparisionContent += "<i class='fa fa-caret-down'></i><span>" + PerCentValue + "%</span>";

        $("#ui_p_LeadWon").html(comparisionContent);

        comparisionContent = "";
        PerCentValue = CalculatePercentage(CompareFirstData.LeadLost, CompareSecondData.LeadLost);

        if (CompareSecondData.LeadLost == CompareFirstData.LeadLost)
            comparisionContent += "<i class='fa fa-caret-up'></i><span>" + PerCentValue + "%</span>";
        else if (CompareFirstData.LeadLost > CompareSecondData.LeadLost)
            comparisionContent += "<i class='fa fa-caret-up'></i><span>" + PerCentValue + "%</span>";
        else if (CompareFirstData.LeadLost < CompareSecondData.LeadLost)
            comparisionContent += "<i class='fa fa-caret-down'></i><span>" + PerCentValue + "%</span>";

        $("#ui_p_LeadLost").html(comparisionContent);
    },

    DestroyCharts: function () {

        if (topStagesGraph) {
            topStagesGraph.destroy();
        }

        if (topSourcesGraph) {
            topSourcesGraph.destroy();
        }

        if (leadChanWise) {
            leadChanWise.destroy();
        }

        if (ctx) {
            ctx.destroy();
        }
    },
    GetLabelWiseLeadsCount: function () {
        $.ajax({
            url: "/Prospect/Dashboard/GetLabelWiseLeadsCount",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'OrderBy': OrderBy, 'UserIds': UserIdList, 'userGroupslist': UserGroupList }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LeadDashboardUtil.BindChartForLabelWiseLeadsCount,
            error: ShowAjaxError
        });
    },
    BindChartForLabelWiseLeadsCount: function (response) {
        IsLoadingShows.IsLabelWiseLeadsCount = true;
        $("#ui_divLeadFormsNoData").addClass("hideDiv");
        $("#labelwiseleads").removeClass("hideDiv");

        var labelName = [], leadCount = [];
        if (response != null && response != undefined && response.Table1.length > 0) {
            for (var i = 0; i < response.Table1.length; i++) {
                labelName.push(response.Table1[i].LeadLabel);
                leadCount.push(response.Table1[i].NumberOfLead);
            }
        }

        Chart.plugins.unregister(ChartDataLabels);
        Chart.defaults.global.defaultFontSize = 10;
        Chart.defaults.global.legend.labels.boxWidth = 10;
        /* Doughnut */
        var leadChanWise = document.getElementById("labelwiseleads");
        var chart_config = {
            plugins: [ChartDataLabels],
            type: 'doughnut',
            data: {
                labels: labelName,
                datasets: [
                    {
                        backgroundColor: [cssvar('--PieChart-BackgroundColor-Item1'), cssvar('--PieChart-BackgroundColor-Item3')],
                        data: leadCount
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

                }
            }
        }

        // Check if data is all 0s; if it is, add dummy data to end with empty label
        chart_config.data.datasets.forEach(dataset => {
            if (dataset.data.every(el => el === 0)) {
                dataset.backgroundColor.push('rgba(192,192,192,0.3)');
                dataset.data.push(0);

                $("#ui_divLeadFormsNoData").removeClass("hideDiv");
                $("#labelwiseleads").addClass("hideDiv");
            }
        })
        new Chart(leadChanWise, chart_config);
    },
    GetStageWiseLeadsCount: function () {
        $.ajax({
            url: "/Prospect/Dashboard/GetAllStageWiseLeadsCount",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'OrderBy': OrderBy, 'UserIds': UserIdList, 'userGroupslist': UserGroupList, 'userHierarchy': UserHierarchy }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LeadDashboardUtil.BindChartForStageWiseLeadsCount,
            error: ShowAjaxError
        });
    },
    BindChartForStageWiseLeadsCount: function (response) {
        IsLoadingShows.IsStageWiseLeadsCount = true;
        var finalarray = [];
        var userName = [];

        if (response != null && response != undefined && response.length > 0) {
            for (var i = 0; i < lmsstagelist.length; i++) {

                var eachdataset = { data: "", label: "", borderWidth: 1, backgroundColor: "", borderColor: "", fill: true };
                var arraydetails = new Array();

                for (var j = 0; j <= 4 && j < response.length; j++) {
                    var eachstagedetails = response[j].userwisestageleads;

                    var sample = JSLINQ(eachstagedetails).Where(function () { return (this.Stage == lmsstagelist[i].Stage); });

                    if (sample.items[0] != undefined)
                        arraydetails.push(sample.items[0].NumberOfLead);
                    else
                        arraydetails.push(0);
                }
                eachdataset.data = arraydetails;
                eachdataset.label = lmsstagelist[i].Stage;
                eachdataset.backgroundColor = lmsstagelist[i].IdentificationColor;
                eachdataset.borderColor = lmsstagelist[i].IdentificationColor;
                finalarray.push(eachdataset);
            }

            for (var i = 0; i <= 4 && i < response.length; i++) {
                userName.push(response[i].UserName);
            }
        }

        Chart.plugins.unregister(ChartDataLabels);
        Chart.defaults.global.defaultFontSize = 10;
        Chart.defaults.global.legend.labels.boxWidth = 10;

        // top stage wise and user wise
        topStagesGraph = new Chart(document.getElementById("ui_canvas_AllSourcesData"), {
            plugins: [ChartDataLabels],
            type: "bar",
            data: {
                labels: userName,
                datasets: finalarray,
            },
            options: {
                maintainAspectRatio: false,
                elements: {
                    line: {
                        tension: 0,
                    },
                    point: {
                        radius: 2,
                    },
                },
                plugins: {
                    datalabels: {
                        color: "#999",
                        align: "end",
                        anchor: "end",
                        font: {
                            size: 10,
                        },
                    },
                },
                legend: {
                    display: true,
                    position: "bottom",
                    fullWidth: true,
                    labels: {
                        fontSize: 11,
                        boxHeight: 0,
                    },
                    responsive: true,
                    scales: {
                        xAxes: [
                            {
                                stacked: true,
                                ticks: {
                                    beginAtZero: true,
                                },
                            },
                        ],
                        yAxes: [
                            {
                                stacked: true,
                                ticks: {
                                    beginAtZero: true,
                                },
                            },
                        ],
                    },
                },
            },
        });

        // line chart start here
        //topStagesGraph = new Chart(document.getElementById("ui_canvas_AllSourcesData"), {
        //    type: "bar",
        //    data: {
        //        labels: userName,
        //        datasets: finalarray,
        //    },
        //    options: {
        //        maintainAspectRatio: false,
        //        elements: {
        //            line: {
        //                tension: 0,
        //            },
        //            point: {
        //                radius: 2,
        //            },
        //        },
        //        legend: {
        //            display: true,
        //            position: "bottom",
        //            fullWidth: true,
        //            labels: {
        //                fontSize: 11,
        //                boxHeight: 0,
        //            },
        //            responsive: true,
        //            scales: {
        //                xAxes: [
        //                    {
        //                        stacked: true,
        //                        ticks: {
        //                            beginAtZero: true,
        //                        },
        //                    },
        //                ],
        //                yAxes: [
        //                    {
        //                        stacked: true,
        //                        ticks: {
        //                            beginAtZero: true,
        //                        },
        //                    },
        //                ],
        //            },
        //        },
        //    },
        //});
    },
    GetSourceWiseLeadsCount: function () {
        $.ajax({
            url: "/Prospect/Dashboard/GetAllSourceWiseLeadsCount",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'OrderBy': OrderBy, 'UserIds': UserIdList, 'userGroupslist': UserGroupList, 'userHierarchy': UserHierarchy }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LeadDashboardUtil.BindChartForSourceWiseLeadsCount,
            error: ShowAjaxError
        });
    },
    BindChartForSourceWiseLeadsCount: function (response) {
        IsLoadingShows.IsSourceWiseLeadsCount = true;
        var finalarray = [];
        var userName = [];

        if (response != null && response != undefined && response.length > 0) {
            for (var i = 0; i < lmssourcelist.length; i++) {

                var eachdataset = { data: "", label: "", borderWidth: 1, backgroundColor: "", borderColor: "", fill: true };
                var arraydetails = new Array();

                for (var j = 0; j <= 4 && j < response.length; j++) {
                    var eachsourcedetails = response[j].userwisesourceleads;

                    var sample = JSLINQ(eachsourcedetails).Where(function () { return (this.LmsGroupId == lmssourcelist[i].LmsGroupId); });

                    if (sample.items[0] != undefined)
                        arraydetails.push(sample.items[0].LeadCount);
                    else
                        arraydetails.push(0);
                }
                eachdataset.data = arraydetails;
                eachdataset.label = lmssourcelist[i].Name;

                eachdataset.backgroundColor = cssvar("--BarChart-BackgroundColor-Item" + i + "");
                eachdataset.borderColor = cssvar("--BarChart-BorderColor-Item" + i + "");
                eachdataset.hoverBorderColor = cssvar("--BarChart-BorderColor-Item" + i + "");
                eachdataset.hoverBackgroundColor = cssvar("--BarChart-BackgroundColor-Item" + i + "");
                finalarray.push(eachdataset);
            }

            for (var i = 0; i <= 4 && i < response.length; i++) {
                userName.push(response[i].UserName);
            }
        }

        Chart.plugins.unregister(ChartDataLabels);
        Chart.defaults.global.defaultFontSize = 10;
        Chart.defaults.global.legend.labels.boxWidth = 10;

        topSourcesGraph = new Chart(document.getElementById("top5sourcewiselms"), {
            plugins: [ChartDataLabels],
            type: "bar",
            data: {
                labels: userName,
                datasets: finalarray,
            },
            options: {
                maintainAspectRatio: false,
                elements: {
                    line: {
                        tension: 0,
                    },
                    point: {
                        radius: 2,
                    },
                },
                plugins: {
                    datalabels: {
                        color: "#999",
                        align: "end",
                        anchor: "end",
                        font: {
                            size: 10,
                        },
                    },
                },
                legend: {
                    display: true,
                    position: "bottom",
                    fullWidth: true,
                    labels: {
                        fontSize: 11,
                        boxHeight: 0,
                    },
                    responsive: true,
                    scales: {
                        xAxes: [
                            {
                                stacked: true,
                                ticks: {
                                    beginAtZero: true,
                                },
                            },
                        ],
                        yAxes: [
                            {
                                stacked: true,
                                ticks: {
                                    beginAtZero: true,
                                },
                            },
                        ],
                    },
                },
            },
        });

        // line chart start here
        //topSourcesGraph = new Chart(document.getElementById("top5sourcewiselms"), {
        //    type: "bar",
        //    data: {
        //        labels: userName,
        //        datasets: finalarray,
        //    },
        //    options: {
        //        maintainAspectRatio: false,
        //        elements: {
        //            line: {
        //                tension: 0,
        //            },
        //            point: {
        //                radius: 2,
        //            },
        //        },
        //        legend: {
        //            display: true,
        //            position: "bottom",
        //            fullWidth: true,
        //            labels: {
        //                fontSize: 11,
        //                boxHeight: 0,
        //            },
        //            responsive: true,
        //            scales: {
        //                xAxes: [
        //                    {
        //                        stacked: true,
        //                        ticks: {
        //                            beginAtZero: true,
        //                        },
        //                    },
        //                ],
        //                yAxes: [
        //                    {
        //                        stacked: true,
        //                        ticks: {
        //                            beginAtZero: true,
        //                        },
        //                    },
        //                ],
        //            },
        //        },
        //    },
        //});
    },
    GetLeadLabelByUserPerformance: function () {
        $.ajax({
            url: "/Prospect/Dashboard/GetAllStageWiseLeadsCount",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'OrderBy': OrderBy, 'UserIds': UserIdList, 'userGroupslist': UserGroupList, 'userHierarchy': UserHierarchy }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LeadDashboardUtil.BindChartForLeadLabelPerformance,
            error: ShowAjaxError
        });
    },
    BindChartForLeadLabelPerformance: function (response) {
        IsLoadingShows.IsLeadLabelByUserPerformance = true;

        var finalarray = [];
        var userName = [];

        if (response != null && response != undefined && response.length > 0) {
            for (var i = 0; i < response.length; i++) {
                userName.push(response[i].UserName);
            }
        }

        for (var i = 0; i < StageList.length; i++) {

            var eachdataset = { data: "", label: "", borderWidth: 1, backgroundColor: "", borderColor: "", fill: true };
            var arraydetails = new Array();

            for (var j = 0; j < response.length; j++) {
                var eachlabeldetails = response[j].userwisestageleads;

                var sample = JSLINQ(eachlabeldetails).Where(function () { return (this.Stage == StageList[i]); });

                if (sample.items[0] != undefined)
                    arraydetails.push(sample.items[0].NumberOfLead);
                else
                    arraydetails.push(0);
            }
            eachdataset.data = arraydetails;
            eachdataset.label = StageList[i];
            eachdataset.backgroundColor = cssvar("--BarChart-BackgroundColor-Item" + i + "");
            eachdataset.borderColor = cssvar("--BarChart-BorderColor-Item" + i + "");
            eachdataset.hoverBorderColor = cssvar("--BarChart-BorderColor-Item" + i + "");
            eachdataset.hoverBackgroundColor = cssvar("--BarChart-BackgroundColor-Item" + i + "");
            finalarray.push(eachdataset);
        }

        //Top performer
        const data = {
            labels: userName,
            datasets: finalarray,
        };

        // Configuration options
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                datalabels: {
                    color: "#fff",
                    align: "center",
                    anchor: "center",
                    font: {
                        size: 10,
                    },
                },
            },
            legend: {
                display: true,
                position: "bottom",
                fullWidth: true,
            },
            scales: {
                xAxes: [
                    {
                        stacked: true,
                    },
                ],
                yAxes: [
                    {
                        stacked: true,
                    },
                ],
            },
        };

        // Get the canvas element and create the chart
        const ctx = document.getElementById("topperformerlms").getContext("2d");
        const stackedBarChart = new Chart(ctx, {
            plugins: [ChartDataLabels],
            type: "horizontalBar",
            data: data,
            options: options,
        });
    },
    GetCampaignDetails: function () {
        $.ajax({
            url: "/Prospect/Dashboard/GetCampaignDetails",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'OrderBy': OrderBy, 'UserIds': UserIdList, 'userGroupslist': UserGroupList }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LeadDashboardUtil.BindChartForCampaignDetails,
            error: ShowAjaxError
        });
    },
    BindChartForCampaignDetails: function (response) {
        IsLoadingShows.CampaignDetails = true;
        $("#ui_divcampaignwiselms").addClass("hideDiv");
        $("#campaignwiselms").removeClass("hideDiv");

        var campName = [], leadCount = [];
        if (response != null && response != undefined && response.Table1.length > 0) {
            campName.push("Mail");
            leadCount.push(response.Table1[0].TotalMailSent);

            campName.push("SMS");
            leadCount.push(response.Table1[0].TotalSmsSent);

            campName.push("TotalCalls");
            leadCount.push(response.Table1[0].TotalCalls);

            campName.push("TotalWhatsApp");
            leadCount.push(response.Table1[0].TotalWhatsAppSent);
        }

        Chart.plugins.unregister(ChartDataLabels);
        Chart.defaults.global.defaultFontSize = 10;
        Chart.defaults.global.legend.labels.boxWidth = 10;
        /* Doughnut */
        var leadChanWise = document.getElementById("campaignwiselms");
        var chart_config = {
            plugins: [ChartDataLabels],
            type: 'doughnut',
            data: {
                labels: campName,
                datasets: [
                    {
                        backgroundColor: [cssvar('--PieChart-BackgroundColor-Item1'), cssvar('--PieChart-BackgroundColor-Item2'), cssvar('--PieChart-BackgroundColor-Item3'), cssvar('--PieChart-BackgroundColor-Item4')],
                        data: leadCount
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

                }
            }
        }

        // Check if data is all 0s; if it is, add dummy data to end with empty label
        chart_config.data.datasets.forEach(dataset => {
            if (dataset.data.every(el => el === 0)) {
                dataset.backgroundColor.push('rgba(192,192,192,0.3)');
                dataset.data.push(0);

                $("#ui_divcampaignwiselms").removeClass("hideDiv");
                $("#campaignwiselms").addClass("hideDiv");
            }
        })
        new Chart(leadChanWise, chart_config);
    },
    GetStageWiseVsLabel: function () {
        $.ajax({
            url: "/Prospect/Dashboard/GetStageWiseVsLabel",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'OrderBy': OrderBy, 'UserIds': UserIdList, 'userGroupslist': UserGroupList, 'AllStageList': lmsstagelist }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LeadDashboardUtil.BindStageWiseVsLabel,
            error: ShowAjaxError
        });
    },
    BindStageWiseVsLabel: function (response) {
        IsLoadingShows.IsStageWiseVsLabel = true;

        var finalarray = [];
        var stageName = [];

        if (response != null && response != undefined && response.length > 0) {
            for (var i = 0; i < response.length; i++) {
                stageName.push(response[i].stageName);
            }
        }

        for (var i = 0; i < labellist.length; i++) {

            var eachdataset = { data: "", label: "", borderWidth: 1, backgroundColor: "", borderColor: "", fill: true };
            var arraydetails = new Array();

            for (var j = 0; j < response.length; j++) {
                var eachlabeldetails = response[j].labeldetails;

                var sample = JSLINQ(eachlabeldetails).Where(function () { return (this.LeadLabel == labellist[i]); });

                if (sample.items[0] != undefined)
                    arraydetails.push(sample.items[0].LeadCount);
                else
                    arraydetails.push(0);
            }
            eachdataset.data = arraydetails;
            eachdataset.label = labellist[i];
            eachdataset.backgroundColor = cssvar("--BarChart-BackgroundColor-Item" + i + "");
            eachdataset.borderColor = cssvar("--BarChart-BorderColor-Item" + i + "");
            eachdataset.hoverBorderColor = cssvar("--BarChart-BorderColor-Item" + i + "");
            eachdataset.hoverBackgroundColor = cssvar("--BarChart-BackgroundColor-Item" + i + "");
            finalarray.push(eachdataset);
        }

        //Top performer
        const data = {
            labels: stageName,
            datasets: finalarray,
        };

        // Configuration options
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                datalabels: {
                    color: "#fff",
                    align: "center",
                    anchor: "center",
                    font: {
                        size: 10,
                    },
                },
            },
            legend: {
                display: true,
                position: "bottom",
                fullWidth: true,
            },
            scales: {
                xAxes: [
                    {
                        stacked: true,
                    },
                ],
                yAxes: [
                    {
                        stacked: true,
                    },
                ],
            },
        };

        // Get the canvas element and create the chart
        const ctx = document.getElementById("stagelabelwiselms").getContext("2d");
        const stackedBarChart = new Chart(ctx, {
            plugins: [ChartDataLabels],
            type: "horizontalBar",
            data: data,
            options: options,
        });
    },
    GetSourceWiseVsLabel: function () {
        $.ajax({
            url: "/Prospect/Dashboard/GetSourceWiseVsLabel",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'OrderBy': OrderBy, 'UserIds': UserIdList, 'userGroupslist': UserGroupList, 'lmsgrplist': lmssourcelist }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LeadDashboardUtil.BindSourceWiseVsLabel,
            error: ShowAjaxError
        });
    },
    BindSourceWiseVsLabel: function (response) {
        IsLoadingShows.IsSourceWiseVsLabel = true;

        var finalarray = [];
        var sourceName = [];

        if (response != null && response != undefined && response.length > 0) {
            for (var i = 0; i < response.length; i++) {
                sourceName.push(response[i].sourceName);
            }
        }

        for (var i = 0; i < labellist.length; i++) {

            var eachdataset = { data: "", label: "", borderWidth: 1, backgroundColor: "", borderColor: "", fill: true };
            var arraydetails = new Array();

            for (var j = 0; j < response.length; j++) {
                var eachlabeldetails = response[j].labeldetails;

                var sample = JSLINQ(eachlabeldetails).Where(function () { return (this.LeadLabel == labellist[i]); });

                if (sample.items[0] != undefined)
                    arraydetails.push(sample.items[0].LeadCount);
                else
                    arraydetails.push(0);
            }
            eachdataset.data = arraydetails;
            eachdataset.label = labellist[i];
            eachdataset.backgroundColor = cssvar("--BarChart-BackgroundColor-Item" + i + "");
            eachdataset.borderColor = cssvar("--BarChart-BorderColor-Item" + i + "");
            eachdataset.hoverBorderColor = cssvar("--BarChart-BorderColor-Item" + i + "");
            eachdataset.hoverBackgroundColor = cssvar("--BarChart-BackgroundColor-Item" + i + "");
            finalarray.push(eachdataset);
        }

        //Top performer
        const data = {
            labels: sourceName,
            datasets: finalarray,
        };

        // Configuration options
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                datalabels: {
                    color: "#fff",
                    align: "center",
                    anchor: "center",
                    font: {
                        size: 10,
                    },
                },
            },
            legend: {
                display: true,
                position: "bottom",
                fullWidth: true,
            },
            scales: {
                xAxes: [
                    {
                        stacked: true,
                    },
                ],
                yAxes: [
                    {
                        stacked: true,
                    },
                ],
            },
        };

        // Get the canvas element and create the chart
        const ctx = document.getElementById("sourcelabelwiselms").getContext("2d");
        const stackedBarChart = new Chart(ctx, {
            plugins: [ChartDataLabels],
            type: "horizontalBar",
            data: data,
            options: options,
        });
    },
    GetStageWiseVsSourceWise: function () {
        $.ajax({
            url: "/Prospect/Dashboard/GetStageWiseVsSourceWise",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'OrderBy': OrderBy, 'UserIds': UserIdList, 'userGroupslist': UserGroupList, 'AllStageList': lmsstagelist }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LeadDashboardUtil.BindStageWiseVsSourceWise,
            error: ShowAjaxError
        });
    },
    BindStageWiseVsSourceWise: function (response) {
        $("#ui_tbodyReportData").empty();
        IsLoadingShows.IsStageWiseVsSourceWise = true;

        var tableheading = "<th class='td-wid-150px m-p-w-170 text-left header-sticky'>Stages</th>";

        if (response != null && response != undefined && response.length > 0) {

            if (lmssourcelist != null && lmssourcelist.length > 0) {
                for (var i = 0; i < lmssourcelist.length; i++) {
                    tableheading += "<th class='td-wid-150px m-p-w-130 text-left'>" + lmssourcelist[i].Name + "</th>";
                }
            }

            $("#tblheading").html("<tr>" + tableheading + "</tr>");

            for (var i = 0; i < response.length; i++) {

                var eachrow = "<td class='text-left column-sticky'>" + response[i].stageName + "</td>";

                for (var j = 0; j < lmssourcelist.length; j++) {
                    var eachlabeldetails = response[i].eachsourcedetails;
                    var sample = JSLINQ(eachlabeldetails).Where(function () { return (this.LmsGroupId == lmssourcelist[j].LmsGroupId); });

                    if (sample.items[0] != undefined)
                        eachrow += "<td>" + sample.items[0].TotalCount + "</td>";
                    else
                        eachrow += "<td>0</td>";
                }

                $("#ui_tbodyReportData").append("<tr>" + eachrow + "</tr>");
            }
        }
        else {
            $("#ui_tbodyReportData").html("<tr><td colspan='4' class='border-bottom-none'><div class='no-data'>There is no data for this view</div></td></tr>");
        }

        $(".mainpanel").addClass("lmsreportwid");
    }
}
