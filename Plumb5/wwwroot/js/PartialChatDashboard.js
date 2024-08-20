var chatrotationvalue = 0, chattickInterval = 0, dt, graphInterval = 0, diffDays = 0;
var chatId = 0;
var chatDetails = { ChatId: 0 };

$(document).ready(function () {
    $("#dvLoading").show();
    GetChatResponseResport();
    BindChatImpressionsCount();
});


function GetChatResponseResport() {

    $.ajax({
        url: "/Chat/Dashboard/GetChatReport",
        type: 'Post',
        data: JSON.stringify({ 'ChatId': chatId, 'Duration': duration, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: ChatGraphDetails,
        error: ShowAjaxError
    });
}

ChatGraphDetails = function (response) {
    var chatresponseCount = new Array(), impressionCount = new Array(), closedCount = new Array(), dateList = new Array(), seriesListData = new Array();
    if (response.length == 0) {
        $("#dvLoading").hide();
        $("#divchatcontent").hide();
        $("#dvDefault").show();
        return;
    }
    else {
        $("#divchatcontent").show();
        $("#dvDefault").hide();
    }

    if (duration == 1) {

        dt = new Date();
        for (var i = 0; i < response.length; i++) {

            chatresponseCount.push(response[i].ResponseCount);
            impressionCount.push(response[i].ViewedCount);
            closedCount.push(response[i].ClosedCount);

            var timevalue = response[i].GDate.split("-");
            dateList.push(monthDetials[timevalue[1] - 1] + " " + timevalue[2] + " " + timevalue[0]);
        }
        chattickInterval = 0;
    }

    else if (duration == 2 || duration == 3) {

        for (var i = 0; i < response.length; i++) {
            chatresponseCount.push(response[i].ResponseCount);
            impressionCount.push(response[i].ViewedCount);
            closedCount.push(response[i].ClosedCount);

            var timevalue = response[i].GDate.split("-");
            dateList.push(monthDetials[timevalue[1] - 1] + " " + timevalue[2] + " " + timevalue[0]);
        }

        if (duration == 2)
            chattickInterval = 0;
        else if (duration == 3)
            chattickInterval = 2;
    }

    else if (duration == 4 || duration == 5) {

        for (var i = 0; i < response.length; i++) {

            chatresponseCount.push(response[i].ResponseCount);
            impressionCount.push(response[i].ViewedCount);
            closedCount.push(response[i].ClosedCount);

            dateList.push(monthDetials[response[i].Month - 1] + " " + response[i].Year);
        }

        chattickInterval = 0;
    }

    seriesListData.push({ color: '#8dc40f', name: 'Responses', data: chatresponseCount });
    seriesListData.push({ color: '#efc419', name: 'Impressions', data: impressionCount });
    seriesListData.push({ color: '#327cd8', name: 'Closed', data: closedCount });

    AppendChart(dateList, seriesListData);
};


AppendChart = function (dateList, seriesListData) {
    var charType = 'spline';
    if (duration == 1)
        charType = 'column'
    var chart;
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'dvChatResponseGraph',
            type: charType
        },
        plotOptions: {
            column: {
                minPointLength: 5
            }
        },
        title: {
            text: 'Chat Response details'
        },

        xAxis: {
            categories: dateList,
            chattickInterval: chattickInterval,
            labels: {
                rotation: chatrotationvalue,
                y: 20,
                style: {
                    fontSize: '12px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: { min: 0, title: '' },
        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br />' + this.series.name + '<b>: ' + this.y + '</b>';
            }
        },
        series: seriesListData
    });
    $("#dvLoading").hide();
};

function BindChatImpressionsCount() {

    $.ajax({
        url: "/Chat/Dashboard/BindChatImpressionsCount",
        type: 'POST',
        data: JSON.stringify({ 'ChatId': chatId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: OverallChatPercentage,
        error: ShowAjaxError
    });
}

function OverallChatPercentage(ReponseNew) {

    var fromDate = CalculateDiffDays();
    var toDate = new Date(FromDateTime);
    toDate.setDate(toDate.getDate() - 1);
    toDate = toDate.getFullYear() + "-" + AddingPrefixZero(toDate.getMonth() + 1) + "-" + AddingPrefixZero(toDate.getDate()) + " " + "23:59:59";
    $.ajax({
        url: "/Chat/Dashboard/BindChatImpressionsCount",
        type: 'POST',
        data: JSON.stringify({ 'ChatId': chatId, 'FromDateTime': fromDate, 'ToDateTime': toDate }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            ChatBindImpresiionsPercentage(response, ReponseNew);
        },
        error: ShowAjaxError
    });
}

function ChatBindImpresiionsPercentage(ResponseOld, ReponseNew) {

    var BindResponseCount, BindViewedCount, BindClosedCount = "";

    $("#lblChatResponses").html("");
    $("#lblChatImpressions").html("");
    $("#lblClose").html("");

    if (ReponseNew[0].TotalResponseCount == ResponseOld[0].TotalResponseCount)
        BindResponseCount = ' ' + ReponseNew[0].TotalResponseCount + "<label class='updownpercentage'>&nbsp;&nbsp;0% </label>";
    else if (ReponseNew[0].TotalResponseCount > ResponseOld[0].TotalResponseCount)
        BindResponseCount = '' + ReponseNew[0].TotalResponseCount + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='UpPercentageImage' title='Up' alt='UP'>" + CalculatePercentage(ReponseNew[0].TotalResponseCount, ResponseOld[0].TotalResponseCount) + "" + '%' + "</label>";
    else if (ReponseNew[0].TotalResponseCount < ResponseOld[0].TotalResponseCount)
        BindResponseCount = ' ' + ReponseNew[0].TotalResponseCount + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='DownPercentageImage' title='Down' alt='Down'>" + CalculatePercentage(ReponseNew[0].TotalResponseCount, ResponseOld[0].TotalResponseCount) + "" + '%' + "</label>";

    if (ReponseNew[0].TotalViewedCount == ResponseOld[0].TotalViewedCount)
        BindViewedCount = ' ' + ReponseNew[0].TotalViewedCount + "<label class='updownpercentage'>&nbsp;&nbsp;0% </label>";
    else if (ReponseNew[0].TotalViewedCount > ResponseOld[0].TotalViewedCount)
        BindViewedCount = ' ' + ReponseNew[0].TotalViewedCount + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='UpPercentageImage' title='Up' alt='UP'>" + CalculatePercentage(ReponseNew[0].TotalViewedCount, ResponseOld[0].TotalViewedCount) + "" + '%' + "</label>";
    else if (ReponseNew[0].TotalViewedCount < ResponseOld[0].TotalViewedCount)
        BindViewedCount = ' ' + ReponseNew[0].TotalViewedCount + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='DownPercentageImage' title='Down' alt='Down'>" + CalculatePercentage(ReponseNew[0].TotalViewedCount, ResponseOld[0].TotalViewedCount) + "" + '%' + "</label>";

    if (ReponseNew[0].TotalClosedCount == ResponseOld[0].TotalClosedCount)
        BindClosedCount = ' ' + ReponseNew[0].TotalClosedCount + "<label class='updownpercentage'>&nbsp;&nbsp;0% </label>";
    else if (ReponseNew[0].TotalClosedCount > ResponseOld[0].TotalClosedCount)
        BindClosedCount = ' ' + ReponseNew[0].TotalClosedCount + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='UpPercentageImage' title='Up' alt='UP'>" + CalculatePercentage(ReponseNew[0].TotalClosedCount, ResponseOld[0].TotalClosedCount) + "" + '%' + "</label>";
    else if (ReponseNew[0].TotalClosedCount < ResponseOld[0].TotalClosedCount)
        BindClosedCount = ' ' + ReponseNew[0].TotalClosedCount + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='DownPercentageImage' title='Down' alt='Down'>" + CalculatePercentage(ReponseNew[0].TotalClosedCount, ResponseOld[0].TotalClosedCount) + "" + '%' + "</label>";

    $("#lblChatResponses").html(BindResponseCount);
    $("#lblChatImpressions").html(BindViewedCount);
    $("#lblChatClose").html(BindClosedCount);
}

