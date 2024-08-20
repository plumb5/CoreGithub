$(document).ready(function () {
    GetDateTimeRange(2);
});


function CallBackFunction() {
    DestroyAllCharts();
    GetTotalOverview();
    GetAudienceOverview();
    GetAudienceOverviewGraph();
    GetVisitorByDevice();
    GetTrafficOverview();
    GetChatOverview();
    GetNotificationOverview();
    GetPerformanceOverview();  
    GetLeadsByStageOverview();
    LeadsbySourceDetails();
}
var TrafficOverViewChart;
var AudianceChart;
var EmailPerFormChart;
var leadsWonLost;

function DestroyAllCharts() {

    if (TrafficOverViewChart) {
        TrafficOverViewChart.destroy();
    }

    if (AudianceChart) {
        AudianceChart.destroy();
    }

    if (EmailPerFormChart) {
        EmailPerFormChart.destroy();
    }
    if (leadsWonLost) {
        leadsWonLost.destroy();
    }

    
}

function GetTotalOverview() {
    var imgelement = "<img src='/images/al_loading.gif' alt='Loading' style='width:20px; height:20px; position:relative; top:3px; left:5px' />";
    $("#totalSmsSent").html(imgelement);
    $("#smsBounceRate").html(imgelement);
    $("#totalEmailSent").html(imgelement);
    $("#emailBounceRate").html(imgelement);
    $("#totalLeads").html(imgelement);
    $("#emailCredits").html(imgelement);
    $("#smsCredits").html(imgelement);
    $.ajax({
        url: "/Account/GetDashboardDetails",
        type: 'Post',
        data: JSON.stringify({ 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime , 'duration': duration}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            response = JSON.parse(response)
            BindTotalOverviewDetails(response.Table[0]);
        },
        error: ShowAjaxError
    });
}

function BindTotalOverviewDetails(response) {
    $("#totalSmsSent").html(response.TotalSms);
    $("#smsBounceRate").html(response.CampaignSMSBounceCount);
    $("#totalEmailSent").html(response.TotalMail);
    $("#emailBounceRate").html(response.TotalMailBounce);
    $("#totalLeads").html(response.TotalLeads);
    $("#emailCredits").html(response.TotalEmailCredit);
    $("#smsCredits").html(response.TotalSmsCredit);
}


function GetVisitorByDevice() {
    var imgelement = "<img src='/images/al_loading.gif' alt='Loading' style='width:20px; height:20px; position:relative; top:3px; left:5px' />";
    $("#desktopVisitorCount").html(imgelement);
    $("#mobileVisitorCount").html(imgelement);
    $("#desktopPercentage").html(imgelement);
    $("#mobilePercentage").html(imgelement);
    $.ajax({
        url: "/Account/GetDashboardDetails",
        type: 'Post',
        data: JSON.stringify({ 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            response = JSON.parse(response)
            BindVisitorByDeviceDetails(response.Table[0]);
        },
        error: ShowAjaxError
    });
}

function BindVisitorByDeviceDetails(response) {
   
    var desktopPercentage = ((response.TotalDesktopVisitors / response.TotalVisitors) * 100).toFixed(2);
    var mobilePercentage = ((response.TotalMobileVisitors / response.TotalVisitors) * 100).toFixed(2);
    if (response.TotalVisitors == 0) {
        desktopPercentage = 0;
        mobilePercentage = 0;
    }

    $("#desktopVisitorCount").html(response.TotalDesktopVisitors > 0 ? response.TotalDesktopVisitors : 0);
    $("#mobileVisitorCount").html(response.TotalMobileVisitors > 0 ? response.TotalMobileVisitors : 0);
    $("#desktopPercentage").html(desktopPercentage + "%");
    $("#mobilePercentage").html(mobilePercentage + "%");
}

// Chat overview
function GetChatOverview() {
    var imgelement = "<img src='/images/al_loading.gif' alt='Loading' style='width:20px; height:20px; position:relative; top:3px; left:5px' />";
    $("#chatResponsesCount").html(imgelement);
    $("#chatImpressionsCount").html(imgelement);
    $("#chatCloseCount").html(imgelement);
    $.ajax({
        url: "/Account/GetChatOverview",
        type: 'Post',
        data: JSON.stringify({ 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            response = JSON.parse(response)
            BindChatOverviewDetails(response.Table[0]);
        },
        error: ShowAjaxError
    });
}

function BindChatOverviewDetails(response) {
    $("#chatResponsesCount").html(response.ResponseCount > 0 ? response.ResponseCount : 0);
    $("#chatImpressionsCount").html(response.ViewedCount > 0 ? response.ViewedCount : 0);
    $("#chatCloseCount").html(response.ClosedCount > 0 ? response.ClosedCount : 0);
}

// Notification Overview
function GetNotificationOverview() {
    var imgelement = "<img src='/images/al_loading.gif' alt='Loading' style='width:20px; height:20px; position:relative; top:3px; left:5px' />";
    $("#notificationSent").html(imgelement);
    $("#notificationReceived").html(imgelement);
    $("#notificationClicked").html(imgelement);
    $.ajax({
        url: "/Account/GetNotificationOverview",
        type: 'Post',
        data: JSON.stringify({ 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            response = JSON.parse(response)
            BindNotificationOverviewDetails(response.Table[0]);
        },
        error: ShowAjaxError
    });
}

function BindNotificationOverviewDetails(response) {
    $("#notificationSent").html(response.PushSentCount > 0 ? response.PushSentCount : 0);
    $("#notificationReceived").html(response.PushViewCount > 0 ? response.PushViewCount : 0);
    $("#notificationClicked").html(response.PushClick > 0 ? response.PushClick : 0);
}

// Traffic  Overview
function GetTrafficOverview() {
    $("#trafficlegend").hide();
    $("#iframe_Traffic").show();
    $.ajax({
        url: "/Account/GetTrafficOverview",
        type: 'Post',
        data: JSON.stringify({ 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            response = JSON.parse(response)

            if ((response.Table[0].Direct == null || response.Table[0].Direct == 0) &&
                (response.Table[0].Refer == null || response.Table[0].Refer ==  0) &&
                (response.Table[0].Search == null || response.Table[0].Search ==  0) &&
                (response.Table[0].Social == null || response.Table[0].Social ==  0) &&
                (response.Table[0].Email == null || response.Table[0].Email ==  0) &&
                (response.Table[0].Sms == null || response.Table[0].Sms ==  0) &&
                (response.Table[0].Paid == null || response.Table[0].Paid ==  0)) {
                $("#iframe_Traffic").html("There is no data for this view.");
            }
            else {
                BindTrafficOverviewDetails(response.Table[0]);
                $("#iframe_Traffic").hide();
            }
        },
        error: ShowAjaxError
    });
}

function BindTrafficOverviewDetails(response) {

    Chart.defaults.pieLabels = Chart.helpers.clone(Chart.defaults.pie);

    var helpers = Chart.helpers;
    var defaults = Chart.defaults;

    Chart.controllers.pieLabels = Chart.controllers.pie.extend({
        updateElement: function (arc, index, reset) {
            var _this = this;
            var chart = _this.chart,
                chartArea = chart.chartArea,
                opts = chart.options,
                animationOpts = opts.animation,
                arcOpts = opts.elements.arc,
                centerX = (chartArea.left + chartArea.right) / 2,
                centerY = (chartArea.top + chartArea.bottom) / 2,
                startAngle = opts.rotation, // non reset case handled later
                endAngle = opts.rotation, // non reset case handled later
                dataset = _this.getDataset(),
                circumference = reset && animationOpts.animateRotate ? 0 : arc.hidden ? 0 : _this.calculateCircumference(dataset.data[index]) * (opts.circumference / (2.0 * Math.PI)),
                innerRadius = reset && animationOpts.animateScale ? 0 : _this.innerRadius,
                outerRadius = reset && animationOpts.animateScale ? 0 : _this.outerRadius,
                custom = arc.custom || {},
                valueAtIndexOrDefault = helpers.getValueAtIndexOrDefault;

            helpers.extend(arc, {
                // Utility
                _datasetIndex: _this.index,
                _index: index,

                // Desired view properties
                _model: {
                    x: centerX + chart.offsetX,
                    y: centerY + chart.offsetY,
                    startAngle: startAngle,
                    endAngle: endAngle,
                    circumference: circumference,
                    outerRadius: outerRadius,
                    innerRadius: innerRadius,
                    label: valueAtIndexOrDefault(dataset.label, index, chart.data.labels[index])
                },

                draw: function () {
                    var ctx = this._chart.ctx,
                                    vm = this._view,
                                    sA = vm.startAngle,
                                    eA = vm.endAngle,
                                    opts = this._chart.config.options;

                    var labelPos = this.tooltipPosition();
                    var segmentLabel = vm.circumference / opts.circumference * 100;

                    ctx.beginPath();

                    ctx.arc(vm.x, vm.y, vm.outerRadius, sA, eA);
                    ctx.arc(vm.x, vm.y, vm.innerRadius, eA, sA, true);

                    ctx.closePath();
                    ctx.strokeStyle = vm.borderColor;
                    ctx.lineWidth = vm.borderWidth;

                    ctx.fillStyle = vm.backgroundColor;

                    ctx.fill();
                    ctx.lineJoin = 'bevel';

                    if (vm.borderWidth) {
                        ctx.stroke();
                    }

                    if (vm.circumference > 0.15) { // Trying to hide label when it doesn't fit in segment
                        ctx.beginPath();
                        ctx.font = helpers.fontString(opts.defaultFontSize, opts.defaultFontStyle, opts.defaultFontFamily);
                        ctx.fillStyle = "#fff";
                        ctx.textBaseline = "top";
                        ctx.textAlign = "center";

                        // Round percentage in a way that it always adds up to 100%
                        ctx.fillText(segmentLabel.toFixed(0) + "%", labelPos.x, labelPos.y);
                    }
                }
            });

            var model = arc._model;
            model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : valueAtIndexOrDefault(dataset.backgroundColor, index, arcOpts.backgroundColor);
            model.hoverBackgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : valueAtIndexOrDefault(dataset.hoverBackgroundColor, index, arcOpts.hoverBackgroundColor);
            model.borderWidth = custom.borderWidth ? custom.borderWidth : valueAtIndexOrDefault(dataset.borderWidth, index, arcOpts.borderWidth);
            model.borderColor = custom.borderColor ? custom.borderColor : valueAtIndexOrDefault(dataset.borderColor, index, arcOpts.borderColor);

            // Set correct angles if not resetting
            if (!reset || !animationOpts.animateRotate) {
                if (index === 0) {
                    model.startAngle = opts.rotation;
                } else {
                    model.startAngle = _this.getMeta().data[index - 1]._model.endAngle;
                }

                model.endAngle = model.startAngle + model.circumference;
            }

            arc.pivot();
        }
    });

    var config = {
        type: 'pieLabels',
        data: {
            datasets: [{
                data: [response.Direct, response.Refer, response.Search, response.Social, response.Email, response.Sms, response.Paid],
                backgroundColor: [
                  "#5992d0",
                  "#77bddd",
                  "#324461",
                  "#5dbcf6",
                  "#78b893",
                  "#394786",
                  "#d84154"

                ],
                label: 'Dataset 1'
            }],
            labels: [
              "Direct",
              "Referral",
              "Search",
              "Social",
              "Email",
               "Sms",
               "Paid"
            ]
        },
        options: {
            responsive: true,
            legend: {
                display: false,
                position: 'bottom',
                labels: {
                    boxWidth: 8,
                    fontSize: 11
                }
            },
            title: {
                display: true,
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };
    $("#trafficlegend").show();
    var ctx = document.getElementById("dasTrafficOverView").getContext("2d");
    dasTrafficOverView.height = 180;
    TrafficOverViewChart= new Chart(ctx, config);
    
}

//Audience Overview

function GetAudienceOverview() {
    var imgelement = "<img src='/images/al_loading.gif' alt='Loading' style='width:20px; height:20px; position:relative; top:3px; left:5px' />";
    $("#pageViewsCount, #visitsCount, #sessionCount").html(imgelement);
    $("#pageViewsPer,#visitsper,#sessionPer").html('');
    
    $.ajax({
        url: "/Account/GetAudienceOverview",
        type: 'Post',
        data: JSON.stringify({ 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'Duration': Duration }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            response = JSON.parse(response)
            OverallPercentage(response.Table[0]);
        },
        error: ShowAjaxError
    });
}

function OverallPercentage(ReponseNew) {

    var fromDate = CalculateDiffDays();
    var to_date = new Date(FromDateTime);
    to_date.setDate(to_date.getDate() - 1);
    
    //toDate.setDate(toDate.getDate() - 1);
    //toDate = toDate.getFullYear() + "-" + AddingPrefixZero(toDate.getMonth() + 1) + "-" + AddingPrefixZero(toDate.getDate()) + " " + "23:59:59";


    $.ajax({
        url: "/Account/GetAudienceOverview",
        type: 'POST',
        data: JSON.stringify({ 'fromDateTime': fromDate, 'toDateTime': to_date, 'Duration': Duration }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            response = JSON.parse(response)
            BindImpresiionsPercentage(response.Table[0], ReponseNew);
        },
        error: ShowAjaxError
    });
}

function BindImpresiionsPercentage(ResponseOld, ReponseNew) {

    $("#pageViewsCount").html(ReponseNew.PageViews > 0 ? ReponseNew.PageViews : 0);
    $("#visitsCount").html(ReponseNew.UniqueVisit > 0 ? ReponseNew.UniqueVisit : 0);
    $("#sessionCount").html(ReponseNew.UniqueSession > 0 ? ReponseNew.UniqueSession : 0);

    var pageViewsPer = 0, visitsper = 0, sessionPer = 0;
 
    if (ReponseNew.PageViews > ResponseOld.PageViews)
        pageViewsPer = "<span class='dasCaretGreen'><i class='fa fa-caret-up' title='Up' alt='UP'></i></span>" + "<span class='dasRepPer'>" + CalculatePercentage(ReponseNew.PageViews, ResponseOld.PageViews) + "</span>";
    else if (ReponseNew.PageViews < ResponseOld.PageViews)
        pageViewsPer = "<span class='dasCaretRed'><i class='fa fa-caret-down' title='Down' alt='Down'></i></span>" + "<span class='dasRepPer'>" + CalculatePercentage(ReponseNew.PageViews, ResponseOld.PageViews) + "</span>";

    
    if (ReponseNew.UniqueVisit > ResponseOld.UniqueVisit)
        visitsper = "<span class='dasCaretGreen'><i class='fa fa-caret-up' title='Up' alt='UP'></i></span>" + "<span class='dasRepPerRed'>" + CalculatePercentage(ReponseNew.UniqueVisit, ResponseOld.UniqueVisit) + "</span>";
    else if (ReponseNew.UniqueVisit < ResponseOld.UniqueVisit)
        visitsper = "<span class='dasCaretRed'><i class='fa fa-caret-down' title='Down' alt='Down'></i></span>" + "<span class='dasRepPerRed'>" + CalculatePercentage(ReponseNew.UniqueVisit, ResponseOld.UniqueVisit) + "</span>";


    if (ReponseNew.UniqueSession > ResponseOld.UniqueSession)
        sessionPer = "<span class='dasCaretGreen'><i class='fa fa-caret-up' title='Up' alt='UP'></i></span>" + "<span class='dasRepPerVistor'>" + CalculatePercentage(ReponseNew.UniqueSession, ResponseOld.UniqueSession) + "</span>";
    else if (ReponseNew.UniqueSession < ResponseOld.UniqueSession)
        sessionPer = "<span class='dasCaretRed'><i class='fa fa-caret-down' title='Down' alt='Down'></i></span>" + "<span class='dasRepPerVistor'>" + CalculatePercentage(ReponseNew.UniqueSession, ResponseOld.UniqueSession) + "</span>";


    $("#pageViewsPer").html(pageViewsPer + "%");
    $("#visitsper").html(visitsper + "%");
    $("#sessionPer").html(sessionPer + "%");
}

//Audience Overview Graph
function GetAudienceOverviewGraph() {
    $("#iframe_Audience").show();
    $.ajax({
        url: "/Account/GetAudienceOverviewGraph",
        type: 'Post',
        data: JSON.stringify({ 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'Duration': Duration }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            response = JSON.parse(response)
            BindAudienceOverviewGraph(response.Table);
        },
        error: ShowAjaxError
    });
}


BindAudienceOverviewGraph = function (response) {

    var PageViews = new Array(), Visits = new Array(), Sessions = new Array(), dateList = new Array(), seriesListData = new Array();
    if (duration == 2 || duration == 3) {
        for (var i = 0; i < response.length; i++) {
            PageViews.push(response[i].PageViews);
            Visits.push(response[i].UniqueVisit);
            Sessions.push(response[i].UniqueSession);

            var datesplitvalue = response[i].GDate.split("-");
            dateList.push(monthDetials[datesplitvalue[1] - 1] + " " + datesplitvalue[2]);
        }

        tickInterval = 0;
    }

    else if (duration == 4 || duration == 5) {

        for (var i = 0; i < response.length; i++) {

            PageViews.push(response[i].PageViews);
            Visits.push(response[i].UniqueVisit);
            Sessions.push(response[i].UniqueSession);
            var datesplitvalue = response[i].GDate.split("-");
            dateList.push(monthDetials[datesplitvalue[1] - 1] + " " + datesplitvalue[0]);
        }

        tickInterval = 0;
    }

    seriesListData.push({ data: Sessions, label: "Sessions", borderWidth: 1.5, borderColor: "#98ccd3", backgroundColor: "rgba(152, 204, 211, 0.7)", fill: true });
    seriesListData.push({ data: PageViews, label: "PageViews", borderWidth: 1.5, borderColor: "#132238", backgroundColor: "rgba(19, 34, 56, 0.8)", fill: true });
    seriesListData.push({ data: Visits, label: "Visits", borderWidth: 1.5, borderColor: "#364e68", backgroundColor: "rgba(54, 78, 104, 0.9)", fill: true });

    AppendChart(dateList, seriesListData);
    $("#iframe_Audience").hide();
};

AppendChart = function (dateList, seriesListData) {

    AudianceChart = new Chart(document.getElementById("dasAudienceRep"), {
        type: 'line',
        data: {
            labels: dateList,
            datasets: seriesListData
        },
        options: {
            elements: {
                line: {
                    tension: 0
                },
                point: {
                    radius: 0
                }
            },
            legend: {
                display: false,
                position: 'top',
                responsive: true,
                maintainAspectRatio: true,
                fullWidth: true,
                labels: {
                    fontSize: 11,
                    boxHeight: 1,

                },

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

};

//Performance Overview Graph
function GetPerformanceOverview() {
    $("#performancelegend").hide();
    $("#iframe_Performance").show();
    $.ajax({
        url: "/Account/GetPerformanceOverview",
        type: 'Post',
        data: JSON.stringify({ 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'Duration': Duration }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            response = JSON.parse(response)
            BindPerformanceOverviewGraph(response.Table);
        },
        error: ShowAjaxError
    });
}


BindPerformanceOverviewGraph = function (response) {

    var UniqueVisitCount = new Array(), ResponseCount = new Array(), TotalMail = new Array(), TotalSms = new Array(), dateList = new Array(), seriesListData = new Array();

    if (duration == 2 || duration == 3) {
        for (var i = 0; i < response.length; i++) {
            UniqueVisitCount.push(response[i].UniqueVisitCount);
            ResponseCount.push(response[i].ResponseCount);
            TotalMail.push(response[i].TotalMail);
            TotalSms.push(response[i].TotalSms);

            var datesplitvalue = response[i].GDate.split("-");
            dateList.push(monthDetials[datesplitvalue[1] - 1] + " " + datesplitvalue[2]);
        }

        tickInterval = 0;
    }

    else if (duration == 4 || duration == 5) {

        for (var i = 0; i < response.length; i++) {

            UniqueVisitCount.push(response[i].UniqueVisitCount);
            ResponseCount.push(response[i].ResponseCount);
            TotalMail.push(response[i].TotalMail);
            TotalSms.push(response[i].TotalSms);

            var datesplitvalue = response[i].GDate.split("-");
            dateList.push(monthDetials[datesplitvalue[1] - 1] + " " + datesplitvalue[0]);
        }

        tickInterval = 0;
    }

    seriesListData.push({ label: "Sms", type: "line", borderColor: "#0b8457", backgroundColor: "#374789", data: TotalSms, fill: false });
    seriesListData.push({ label: "Email", type: "line", borderColor: "#eac100", backgroundColor: "4e7ac3", data: TotalMail, fill: false });
    seriesListData.push({ label: "Visits", type: "bar", backgroundColor: "#233142", data: UniqueVisitCount });
    seriesListData.push({ label: "FormResponse", type: "bar", backgroundColor: "#4f9da6", backgroundColorHover: "#5dbcf6", data: ResponseCount });

    AppendPerformanceOverviewChart(dateList, seriesListData);
    $("#iframe_Performance").hide();
    $("#performancelegend").show();
};

function AppendPerformanceOverviewChart(dateList, seriesListData) {
    EmailPerFormChart = new Chart(document.getElementById("dasEmailPerFormChart"), {
        type: 'bar',
        data: {
            labels: dateList,
            datasets: seriesListData
        },
        options: {
            responsive: true,
            title: {
                display: false,
            },
            legend: {
                display: false, position: 'bottom', labels: {
                    boxWidth: 6, fontSize: 8
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


//Leads by stage Overview Graph
function GetLeadsByStageOverview() {
    $("#leadslegend").hide();
    $("#iframe_Leads").show();
    $.ajax({
        url: "/Account/GetLeadsByStageOverview",
        type: 'Post',
        data: JSON.stringify({ 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'Duration': Duration }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            response = JSON.parse(response)
            BindLeadsOverviewGraph(response.Table);
        },
        error: ShowAjaxError
    });
}

BindLeadsOverviewGraph = function (response) {

    var ClosedLost = new Array(), ClosedWon = new Array(), dateList = new Array(), seriesListData = new Array();

    if (duration == 2 || duration == 3) {
        for (var i = 0; i < response.length; i++) {
            ClosedLost.push(response[i].ClosedLost);
            ClosedWon.push(response[i].ClosedWon);


            var datesplitvalue = response[i].GDate.split("-");
            dateList.push(monthDetials[datesplitvalue[1] - 1] + " " + datesplitvalue[2]);
        }

        tickInterval = 0;
    }

    else if (duration == 4 || duration == 5) {

        for (var i = 0; i < response.length; i++) {

            ClosedLost.push(response[i].ClosedLost);
            ClosedWon.push(response[i].ClosedWon);

            var datesplitvalue = response[i].GDate.split("-");
            dateList.push(monthDetials[datesplitvalue[1] - 1] + " " + datesplitvalue[0]);
        }

        tickInterval = 0;
    }

    seriesListData.push({ label: "Closed Lost", borderColor: "#345159", backgroundColor: "#345159", data: ClosedLost });
    seriesListData.push({ label: "Closed Won", borderColor: "#78b893", backgroundColor: "#78b893", data: ClosedWon });


    AppendLeadsOverviewChart(dateList, seriesListData);
    $("#iframe_Leads").hide();
    $("#leadslegend").show();
};

function AppendLeadsOverviewChart(dateList, seriesListData) {
 

    //var leadsWonLost = document.getElementById("dasLeadsWon").getContext("2d");
    //leadsWonLost.height = 200;
    var data = {
        labels: dateList,
        datasets: seriesListData
    };

    leadsWonLost = new Chart(document.getElementById("dasLeadsWon").getContext("2d"), {
        type: 'bar',
        data: data,
        options: {
            legend: {
                display: false,
                position: 'bottom',
                responsive: true,
                labels: {
                    boxWidth: 5,
                    fontSize: 11
                }
            },
            scales: {
                xAxes: [{ stacked: true, barPercentage: 0.4 }],
                yAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

//Leads by Source

function LeadsbySourceDetails() {
    $("#leadsBySource").html('');
    $("#iframe_Source").show();
    $.ajax({
        url: "/Account/GetLeadsbySourceOverview",
        type: 'POST',
        data: JSON.stringify({ 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            response = JSON.parse(response)
            BindLeadsbySourceDetails(response.Table);
        },
        error: ShowAjaxError
    });
}

function BindLeadsbySourceDetails(response) {
    if (response.length > 0) {
        var TotalLeads = 0;
        for (var i = 0; i < response.length; i++) {
            TotalLeads += response[i].LeadCount;
        }
        for (var i = 0; i < response.length; i++) {
            var LeadsPer = (response[i].LeadCount * 100) / TotalLeads;
            var responseData = '<div class="dasLeadSrcItem"><h4 class="dasLeadSrcHF">' + response[i].LeadCount + '<span>Leads</span></h4><div class="dasProgBar" style="width:' + LeadsPer + '% !important;"></div><p class="dasLeadSrcHed">' + response[i].Name + '</p></div>';
            $("#leadsBySource").append(responseData);
            $("#iframe_Source").hide();
        }
    }
    else {
        $("#iframe_Source").hide();
        $("#leadsBySource").append("There is no data for this view.");
    }  
}


var monthDetials = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var FromDateTime, ToDateTime;
var FromDateTime_JsDate, ToDateTime_JsDate;
var Duration;
function GetDateTimeRange(duration) {

    var fromdate = '', todate = '';
    if (duration == 1 || duration == 2 || duration == 3 || duration == 4) {
        $(".dasRepItem").removeClass("active");
        $("#ui_divDate" + duration).addClass("active")
        var startEndDates = BindDate(duration, fromdate, todate);
        fromdate = startEndDates[0];
        todate = startEndDates[1];
        duration = startEndDates[2];
    }

    FromDateTime = fromdate;
    ToDateTime = todate;
    Duration = duration;
    CallBackFunction();
}

function BindDate(dur, frm, to) {
    var a = new Date(), b = new Date(), startdate = '', enddate = '';
    switch (dur) {
        case 1:
            window.lblDate.innerHTML = a.getDate() + ' ' + monthDetials[a.getMonth()] + ' ' + a.getFullYear();
            startdate = a.getFullYear() + '-' + AddingPrefixZero((a.getMonth() + 1)) + '-' + AddingPrefixZero(a.getDate());
            enddate = a.getFullYear() + '-' + AddingPrefixZero((a.getMonth() + 1)) + '-' + AddingPrefixZero(a.getDate());
            break;
        case 2:
            b.setDate(a.getDate() - 6);
            window.lblDate.innerHTML = b.getDate() + ' ' + monthDetials[b.getMonth()] + ' ' + b.getFullYear() + ' - ' + a.getDate() + ' ' + monthDetials[a.getMonth()] + ' ' + a.getFullYear();
            startdate = b.getFullYear() + '-' + AddingPrefixZero((b.getMonth() + 1)) + '-' + AddingPrefixZero(b.getDate());
            enddate = a.getFullYear() + '-' + AddingPrefixZero((a.getMonth() + 1)) + '-' + AddingPrefixZero(a.getDate());
            break;
        case 3:
            b.setMonth(a.getMonth() - 1);
            b.setDate(b.getDate() + 1);
            window.lblDate.innerHTML = (b.getDate()) + ' ' + monthDetials[b.getMonth()] + ' ' + b.getFullYear() + ' - ' + a.getDate() + ' ' + monthDetials[a.getMonth()] + ' ' + a.getFullYear();
            startdate = b.getFullYear() + '-' + AddingPrefixZero((b.getMonth() + 1)) + '-' + AddingPrefixZero(b.getDate());
            enddate = a.getFullYear() + '-' + AddingPrefixZero((a.getMonth() + 1)) + '-' + AddingPrefixZero(a.getDate());
            break;
        case 4:
            b.setDate(a.getDate() - 365);
            window.lblDate.innerHTML = /*a.getDate() + ' ' +*/ monthDetials[a.getMonth()] + ' ' + b.getFullYear() + ' - ' /*+ a.getDate() + ' '*/ + monthDetials[a.getMonth()] + ' ' + a.getFullYear();
            startdate = b.getFullYear() + '-' + AddingPrefixZero((a.getMonth() + 1)) + '-' + AddingPrefixZero(a.getDate());
            enddate = a.getFullYear() + '-' + AddingPrefixZero((a.getMonth() + 1)) + '-' + AddingPrefixZero(a.getDate());
            break;
        case 5:
            a = new Date(frm);
            b = new Date(to);
            window.lblDate.innerHTML = a.getDate(frm) + ' ' + monthDetials[a.getMonth(frm)] + ' ' + a.getFullYear(frm) + ' - ' + b.getDate(to) + ' ' + monthDetials[b.getMonth(to)] + ' ' + b.getFullYear(to);
            startdate = a.getFullYear(frm) + '-' + AddingPrefixZero((a.getMonth(frm) + 1)) + '-' + AddingPrefixZero(a.getDate(frm));
            enddate = b.getFullYear(to) + '-' + AddingPrefixZero((b.getMonth(to) + 1)) + '-' + AddingPrefixZero(b.getDate(to));
            break;
        default:
            break;
    }
    FromDateTime_JsDate = a;
    ToDateTime_JsDate = b;
    startdate = startdate + " 00:00:00";
    enddate = enddate + " 23:59:59";
    duration = dur;
    return [startdate, enddate, duration];
}

function AddingPrefixZero(n) {
    return (n < 10) ? ("0" + n) : n;
}

function CalculateDiffDays() {

    var fromdate = toDate = dates = diffDays = DiffDate = "";

    if (duration == 5) {
        fromdate = $("#txtDateFrom").val();
        todate = $("#txtDateTo").val();
    }
    else {
        fromDate = FromDateTime.split(" ");
        toDate = ToDateTime.split(" ");
    }

    dates = fromDate[0].split('-');
    fromDate = new Date(dates[0], dates[1] - 1, dates[2]);

    dates = toDate[0].split('-');
    toDate = new Date(dates[0], dates[1] - 1, dates[2]);

    diffDays = Math.abs((fromDate.getTime() - toDate.getTime()) / (24 * 60 * 60 * 1000));

    DiffDate = new Date(fromDate);
    DiffDate.setDate(DiffDate.getDate() - (diffDays + 1));

    fromDate = DiffDate.getFullYear() + "-" + AddingPrefixZero(DiffDate.getMonth() + 1) + "-" + AddingPrefixZero(DiffDate.getDate()) + " " + "00:00:00";

    return fromDate;
}

$("#getScripts").click(function () {
    $(".bgShadedDiv").show();
    $("#dvScript").show();
});

$("#getIpfilters").click(function () {
    $(".bgShadedDiv").show();
    $("#dvIpFilter").show();
});

$("#reportBug").click(function () {
    $(".bgShadedDiv").show();
    $("#dvReportBug").show();
});


//Ip filter
var m = 0;
$("#dvLoading").css("display", "none");
$(document).ready(function () {
    $.ajax({
        url: "/Account/GetIncludedExcludedInfo",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null && response.Table != null) {
                $.each(response.Table, function () {
                    if (this.AllowSubDomain == true)
                        $("#chkAllowSubDomain").prop("checked", true);
                    else
                        $("#chkAllowSubDomain").prop("checked", false);
                    $("#txtExclude").val(this.ExcludeKeys);
                    $("#txtInclude").val(this.IncludeKeys);
                    if (this.TrackStartDate != null && this.TrackStartDate != 'null')
                        $("#span_ScriptNotAdded").hide();
                    else
                        $("#span_ScriptNotAdded").show();
                });
            }
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
        }
    });
});


$("#btnIncludeExclude").click(function () {
    if (!$("#chkAllowSubDomain").is(":checked") && $("#txtExclude").val() == "" && $("#txtInclude").val() == "")
        m++;
    else
        m = 0;
    if (m > 1) {
        ShowErrorMessage("You have already submitted");
        return false;
    }
    $.ajax({
        url: "/Account/SaveIncludeExclude",
        type: 'POST',
        data: "{'subAccount':'" + $("#chkAllowSubDomain").is(":checked") + "','exclude':'" + $("#txtExclude").val() + "','include':'" + $("#txtInclude").val() + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result != null && result > 0) {
                ShowErrorMessage("Successfully updated");
            }
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
        }
    });
});
function ShowErrorMessage(errMessage) {
    $(".MsgStyle").empty();
    divmsg.innerHTML = errMessage + '<span style="float:right;cursor:pointer;padding-right: 8px;" onclick=javascript:$("#divmsg").hide()>X</span>';
    messageDiv = $(".MsgStyle");
    messageDiv.fadeIn(500);
    setTimeout(function () { messageDiv.fadeOut(500); }, 5000);
}
function NoAccess() {
    ShowErrorMessage("Sorry! You don't have access.");

}
$(".scriptNav ul li").click(function () {
    var listNavId = $(this).attr("id");
    $(".scptWrap").hide();
    $(".scriptNav ul li").removeClass('activeCol');
    $(this).addClass('activeCol');
    $("#script-" + listNavId).fadeIn('slow');

    //alert();
});

$(document).ready(function () {
   
        $("#btn_copy1").click(function () {
            var aux = document.createElement("input");
            aux.setAttribute("value", document.getElementById("div_copy1").innerText);
            document.body.appendChild(aux);
            aux.select();
            document.execCommand("copy");
            document.body.removeChild(aux);
            $("#span_copy1").show().fadeOut(2000);
        });

        $("#btn_copy2").click(function () {
            var aux = document.createElement("input");
            aux.setAttribute("value", document.getElementById("div_copy2").innerText);
            document.body.appendChild(aux);
            aux.select();
            document.execCommand("copy");
            document.body.removeChild(aux);
            $("#span_copy2").show().fadeOut(2000);
        });
});

$("#multi").click(function () {
    $("#script-single").hide();
    $("#script-multi").show();
});

$("#single").click(function () {
    $("#script-multi").hide();
    $("#script-single").show();
});


$("#dvReportBug").click(function () {
    $("#dvReportBug").draggable();
});

