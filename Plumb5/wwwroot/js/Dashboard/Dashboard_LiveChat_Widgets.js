// Live Chat Performance ****************************88
var ChatId = 0;
var Responses = [], Impressions = [], Closed = [], DayWiseDate = [];
function CreateChatPerformanceChart(canvasid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    $.ajax({
        url: "/Dashboard/DashboardOverView/GetChatReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ChatId': ChatId, 'Duration': duration, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (ChatPerformance) {

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
                BindChatPerformanceGraph(DayWiseDate, Responses, Impressions, Closed, canvasid);
            } else {
                BindChatPerformanceGraph(DayWiseDate, Responses, Impressions, Closed, canvasid);
            }
        },
        error: function (error) {
            LoadingImageCount--;
            ShowAjaxError(error);
            ShowLoadingImageBasedOnCount();
        }
    });

}
function BindChatPerformanceGraph(DayDate, Responses, Impressions, Closed, canvasid) {

    new Chart(document.getElementById(canvasid), {
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

// Live Chat Conversations
function GetConversationsDetails(divId) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    var ChatConversationsHtmlContent = //"<div class='box-white h-100'>" +
        //"<h6 class='box-title'>Conversations</h6>" +
        "<p class='totalleads' id='ui_TotalNewLeads'>Total New Leads: 0</p>" +
        "<div class='chtdetdashwrp card-activities'>" +
        "    <div class='media-list'>" +
        "<div class='media'>" +
        "<div class='activity-icon bg-success'>" +
        "<h4 id='ui_TotalCompleted'>0</h4>" +
        "</div >" +
        "<div class='media-body'>" +
        "<h6 class='font-14'>Completed Chats</h6>" +
        "</div >" +
        "</div >" +
        " <div class='media'>" +
        "<div class='activity-icon bg-orange'>" +
        "<h4 id='ui_TotalInCompleted'>0</h4>" +
        "</div >" +
        "<div class='media-body'>" +
        "<h6 class='font-14'>Incomplete Chats</h6>" +
        "</div >" +
        "</div >" +
        "<div class='media'>" +
        "<div class='activity-icon bg-danger'>" +
        "<h4 id='ui_TotalMissed'>0</h4>" +
        "</div >" +
        "<div class='media-body'>" +
        "<h6 class='font-14'>Chat Missed</h6>" +
        "</div >" +
        "</div >" +
        "</div>" +
        "</div>" +
        "</div>";
    $('#' + divId).html(ChatConversationsHtmlContent);

    $.ajax({
        url: "/Dashboard/DashboardOverview/Conversations",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (Conversations) {
            if (Conversations != null) {
                $("#ui_TotalNewLeads").html(`Total New Leads: ${Conversations.TotalNewLead}`);
                $("#ui_TotalCompleted").html(Conversations.TotalCompleted);
                $("#ui_TotalInCompleted").html(Conversations.TotalIncomplete);
                $("#ui_TotalMissed").html(Conversations.TotalMissed);
            }
        },
        error: function (error) {
            LoadingImageCount--;
            ShowAjaxError(error);
            ShowLoadingImageBasedOnCount();
        }
    });
    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();

}

