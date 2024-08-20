var ChatId = 0;
var IsLoadingShows = { ChatPerformance: false, TopFiveConversion: false, TopFiveConversionUrl: false, Conversations: false, TopThreeAgents: false };
var Responses = [], Impressions = [], Closed = [], DayWiseDate = [];
var TopFiveChat = [], TopFiveResponseCount = [];
var TopFiveChatUrl = [], TopFiveResponseCountUrl = [];
var dashboardUtil = {
    GetChatPerformanceDetails: function () {
        $.ajax({
            url: "/Chat/Dashboard/GetChatReport",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ChatId': ChatId, 'Duration': duration, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (ChatPerformance) {
                IsLoadingShows.ChatPerformance = true;
                Responses.length = 0; Impressions.length = 0; Closed.length = 0; DayWiseDate.length = 0;
                if (ChatPerformance != null && ChatPerformance.length > 0) {
                    for (let i = 0; i < ChatPerformance.length; i++) {
                        if (duration == 1) {
                            if (i != 0) {
                                let d = new Date(ChatPerformance[i].GDate);
                                let date = $.datepicker.formatDate("M dd", d);
                                DayWiseDate.push(date);
                                Responses.push(ChatPerformance[i].ResponseCount);
                                Impressions.push(ChatPerformance[i].ViewedCount);
                                Closed.push(ChatPerformance[i].ClosedCount);
                            }
                        } if (duration == 2 || duration == 3) {
                            let d = new Date(ChatPerformance[i].GDate);
                            let date = $.datepicker.formatDate("M dd", d);
                            DayWiseDate.push(date);
                            Responses.push(ChatPerformance[i].ResponseCount);
                            Impressions.push(ChatPerformance[i].ViewedCount);
                            Closed.push(ChatPerformance[i].ClosedCount);
                        } else if (duration == 4 || duration == 5) {
                            let GDate = `${ChatPerformance[i].Year}-${ChatPerformance[i].Month.toString().length > 1 ? ChatPerformance[i].Month : "0" + ChatPerformance[i].Month}-01`;
                            let d = new Date(GDate);
                            let date = $.datepicker.formatDate("M yy", d);
                            DayWiseDate.push(date);
                            Responses.push(ChatPerformance[i].ResponseCount);
                            Impressions.push(ChatPerformance[i].ViewedCount);
                            Closed.push(ChatPerformance[i].ClosedCount);
                        }
                    }
                    dashboardUtil.BindChatPerformanceChart(DayWiseDate, Responses, Impressions, Closed);
                } else {
                    dashboardUtil.BindChatPerformanceChart(DayWiseDate, Responses, Impressions, Closed);
                }
            },
            error: ShowAjaxError
        });
    },
    BindChatPerformanceChart: function (DayDate, Responses, Impressions, Closed) {
        Chart.plugins.unregister(ChartDataLabels);
        Chart.defaults.global.defaultFontSize = 10;
        Chart.defaults.global.legend.labels.boxWidth = 10;

        // line chart start here
        new Chart(document.getElementById("ui_chatperformance"), {
            type: 'line',
            data: {
                labels: DayDate,
                datasets: [{
                    data: Responses,
                    label: "Responses",
                    borderWidth: 1.5,
                    borderColor: cssvar("--LineChart-BorderColor-Item1"),
                    backgroundColor: cssvar("--LineChart-BackgroundColor-Item1"),
                    fill: false
                },
                {
                    data: Impressions,
                    label: "Impressions",
                    borderWidth: 1.5,
                    borderColor: cssvar("--LineChart-BorderColor-Item2"),
                    backgroundColor: cssvar("--LineChart-BackgroundColor-Item2"),
                    fill: false
                },
                {
                    data: Closed,
                    label: "Closed",
                    borderWidth: 1.5,
                    borderColor: cssvar("--LineChart-BorderColor-Item4"),
                    backgroundColor: cssvar("--LineChart-BackgroundColor-Item4"),
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

    GetTopFiveConversion: function () {
        $.ajax({
            url: "/Chat/Dashboard/TopFiveConversion",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (TopFiveChatList) {
                IsLoadingShows.TopFiveConversion = true;
                TopFiveChat.length = 0; TopFiveResponseCount.length = 0;
                if (TopFiveChatList != null && TopFiveChatList.length > 0) {
                    for (let i = 0; i < TopFiveChatList.length; i++) {
                        TopFiveChat.push(TopFiveChatList[i].ChatName);
                        TopFiveResponseCount.push(TopFiveChatList[i].TotalResponseCount);
                    }

                    dashboardUtil.BindTopFiveChatRoomChart(TopFiveChat, TopFiveResponseCount);
                } else {
                    dashboardUtil.BindTopFiveChatRoomChart(TopFiveChat, TopFiveResponseCount);
                }
            },
            error: ShowAjaxError
        });
    },
    BindTopFiveChatRoomChart: function (TopFiveChats, TopFiveChatsCount) {
        Chart.plugins.unregister(ChartDataLabels);
        Chart.defaults.global.defaultFontSize = 10;
        Chart.defaults.global.legend.labels.boxWidth = 10;

        new Chart(document.getElementById("ui_topchatroom"), {
            plugins: [ChartDataLabels],
            type: 'horizontalBar',
            data: {
                labels: TopFiveChats,
                datasets: [{
                    data: TopFiveChatsCount,
                    label: "No. of Conversations",
                    borderWidth: 1,
                    //borderColor: BarChartbrdcolItem2,
                    backgroundColor: [cssvar("--BarChart-BackgroundColor-Item6"), cssvar("--BarChart-BackgroundColor-Item6"), cssvar("--BarChart-BackgroundColor-Item6"), cssvar("--BarChart-BackgroundColor-Item6"), cssvar("--BarChart-BackgroundColor-Item6")],
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
                plugins: {
                    datalabels: {
                        color: '#7c7c7c',
                        align: 'end',
                        anchor: 'end',
                        font: {
                            size: 10,
                        }
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

    GetTopFiveConversionUrl: function () {
        $.ajax({
            url: "/Chat/Dashboard/TopFiveConversionUrl",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (TopFiveChatUrlList) {
                IsLoadingShows.TopFiveConversionUrl = true;
                TopFiveChatUrl.length = 0; TopFiveResponseCountUrl.length = 0;
                if (TopFiveChatUrlList != null && TopFiveChatUrlList.length > 0) {
                    for (let i = 0; i < TopFiveChatUrlList.length; i++) {
                        TopFiveChatUrl.push(TopFiveChatUrlList[i].ChatInitiatedOnPageUrl);
                        TopFiveResponseCountUrl.push(TopFiveChatUrlList[i].TotalResponseCount);
                    }

                    dashboardUtil.BindTopFiveChatUrlChart(TopFiveChatUrl, TopFiveResponseCountUrl);
                } else {
                    dashboardUtil.BindTopFiveChatUrlChart(TopFiveChatUrl, TopFiveResponseCountUrl);
                }
            },
            error: ShowAjaxError
        });
    },
    BindTopFiveChatUrlChart: function (TopFiveChatUrl, TopFiveResponseCountUrl) {
        Chart.plugins.unregister(ChartDataLabels);
        Chart.defaults.global.defaultFontSize = 10;
        Chart.defaults.global.legend.labels.boxWidth = 10;

        new Chart(document.getElementById("ui_topchaturl"), {
            plugins: [ChartDataLabels],
            type: 'horizontalBar',
            data: {
                labels: TopFiveChatUrl,
                datasets: [{
                    data: TopFiveResponseCountUrl,
                    label: "No. of Conversations",
                    borderWidth: 1,
                    //borderColor: BarChartbrdcolItem2,
                    backgroundColor: [cssvar("--BarChart-BackgroundColor-Item1"), cssvar("--BarChart-BackgroundColor-Item1"), cssvar("--BarChart-BackgroundColor-Item1"), cssvar("--BarChart-BackgroundColor-Item1"), cssvar("--BarChart-BackgroundColor-Item1")],
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
                plugins: {
                    datalabels: {
                        color: '#7c7c7c',
                        align: 'end',
                        anchor: 'end',
                        font: {
                            size: 10,
                        }
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

    GetConversationsDetails: function () {
        $.ajax({
            url: "/Chat/Dashboard/Conversations",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Conversations) {
                IsLoadingShows.Conversations = true;
                if (Conversations != null) {
                    $("#ui_TotalNewLeads").html(`Total New Leads: ${Conversations.TotalNewLead}`);
                    $("#ui_TotalCompleted").html(Conversations.TotalCompleted);
                    $("#ui_TotalInCompleted").html(Conversations.TotalIncomplete);
                    $("#ui_TotalMissed").html(Conversations.TotalMissed);
                }
            },
            error: ShowAjaxError
        });
    },

    GetTopThreeAgents: function () {
        $.ajax({
            url: "/Chat/Dashboard/TopThreeAgents",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (ThreeAgents) {
                IsLoadingShows.TopThreeAgents = true;
                $("#ui_TopThreeAgents").empty();
                if (ThreeAgents != null && ThreeAgents.length > 0) {
                    for (let i = 0; i < ThreeAgents.length; i++) {

                        let className = i != 0 ? 'pt-3' : '';
                        let AgentName = ThreeAgents[i].AgentName != null ? ThreeAgents[i].AgentName : "NA";
                        let EmployeeCode = ThreeAgents[i].EmployeeCode != null ? ThreeAgents[i].EmployeeCode : "NA";
                        let Char = AgentName.charAt(0).toUpperCase();

                        let threeAgents = `<div class="media border-bottom pl-2 pr-2 ${className}">
                                                <div class="namealphawrp">
                                                    <h6>${Char}</h6>
                                                </div>
                                                <div class="media-body">
                                                    <h5 class="mt-0">${AgentName}</h5>
                                                    <p>Code: <span>${EmployeeCode}</span> | Conversation Rate: <span>${ThreeAgents[i].ConversionRate}%</span></p>
                                                </div>
                                           </div>`;
                        $("#ui_TopThreeAgents").append(threeAgents);
                    }
                } else {
                    const NoData = `<div class="no-data">There is no data for this view.</div>`;
                    $("#ui_TopThreeAgents").empty().append(NoData);
                }
            },
            error: ShowAjaxError
        });
    }
}


$(document).ready(() => {
    GetUTCDateTimeRange(2);
});

function CallBackFunction() {
    ShowPageLoading();
    dashboardUtil.GetChatPerformanceDetails();
    dashboardUtil.GetTopFiveConversion();
    dashboardUtil.GetTopFiveConversionUrl();
    dashboardUtil.GetConversationsDetails();
    dashboardUtil.GetTopThreeAgents();
    clearTimeInterval = setInterval(IsLoadingToHide, 1000);
}

function IsLoadingToHide() {
    if (IsLoadingShows.ChatPerformance && IsLoadingShows.TopFiveConversion && IsLoadingShows.TopFiveConversionUrl && IsLoadingShows.Conversations && IsLoadingShows.TopThreeAgents) {
        clearInterval(clearTimeInterval);
        HidePageLoading();
    } else {
        ShowPageLoading();
    }
}