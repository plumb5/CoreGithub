
var formType = 0, FormId = 0, rotationvalue = 0, tickInterval = 0, dt, graphInterval = 0, diffDays = 0, allFormFields = [];
var BannerOrForm = false;
var ResponseList = [];
var formname = "";

$(document).ready(function () {
    FormReport();
});

function FormReport() {
    GetFormResponseResport();
    BindFormImpressionsCount();
}

function GetFormResponseResport() {

    $.ajax({
        url: "/Form/Dashboard/GetFormReport",
        type: 'Post',
        data: JSON.stringify({ 'FormId': FormId, 'Duration': duration, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'IsBannerOrForm': BannerOrForm }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: FormGraphDetails,
        error: ShowAjaxError
    });
}

FormGraphDetails = function (response) {

    var leadCount = new Array(), impressionCount = new Array(), closedCount = new Array(), dateList = new Array(), seriesListData = new Array();

    if (response.length == 0) {
        $("#dvLoading").hide();
        $("#dvDefault").show();
        return;
    }
    else {
        $("#divformcontent").show();
        $("#dvDefault").hide();
    }

    if (duration == 1) {

        dt = new Date();
        for (var i = 0; i < response.length; i++) {

            leadCount.push(response[i].ResponseCount);
            impressionCount.push(response[i].ViewedCount);
            closedCount.push(response[i].ClosedCount);

            var timevalue = response[i].GDate.split("-");
            dateList.push(monthDetials[timevalue[1] - 1] + " " + timevalue[2] + " " + timevalue[0]);
        }
        tickInterval = 0;
    }
    else if (duration == 2 || duration == 3) {

        for (var i = 0; i < response.length; i++) {

            var currentDateData = ConvertUTCDateTimeToLocal(response[i].GDate);

            leadCount.push(response[i].ResponseCount);
            impressionCount.push(response[i].ViewedCount);
            closedCount.push(response[i].ClosedCount);

            dateList.push(monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate());
        }

        if (duration == 3) {
            tickInterval = 2;
        }
        else if (duration == 2) {
            tickInterval = 0;
        }
    }

    else if (duration == 4 || duration == 5) {

        for (var i = 0; i < response.length; i++) {

            leadCount.push(response[i].ResponseCount);
            impressionCount.push(response[i].ViewedCount);
            closedCount.push(response[i].ClosedCount);

            dateList.push(monthDetials[response[i].Month - 1] + " " + response[i].Year);
        }

        if (duration == 4) {
            tickInterval = 0;
        }
        else if (duration == 5) {
            tickInterval = 0;
        }
    }

    if (formType != 1 && formType != 2 && formType != 3 && formType != 4 && formType != 5 && formType != 6 && formType != 7 && formType != 10) {
        seriesListData.push({ color: '#8dc40f', name: 'Responses', data: leadCount });
    }
    seriesListData.push({ color: '#efc419', name: 'Impressions', data: impressionCount });
    seriesListData.push({ color: '#327cd8', name: 'Closed', data: closedCount });

    AppendFormChart(dateList, seriesListData);
};


AppendFormChart = function (dateList, seriesListData) {

    var chartType = 'spline';
    if (duration == 1)
        chartType = 'column'
    var chart;
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'dvFormResponseGraph',
            type: chartType
        },
        plotOptions: {
            column: {
                minPointLength: 5
            }
        },
        title: {
            text: ''
        },

        xAxis: {
            categories: dateList,
            tickInterval: tickInterval,
            labels: {
                rotation: rotationvalue,
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

function BindFormImpressionsCount() {

    $.ajax({
        url: "/Form/Dashboard/BindFormImpressionsCount",
        type: 'POST',
        data: JSON.stringify({ 'FormId': FormId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: FormOverallPercentage,
        error: ShowAjaxError
    });
}

function FormOverallPercentage(ReponseNew) {

    var from_Date = CalculateDiffDays();
    var to_date = FromDateTime;
    toDate.setDate(toDate.getDate() - 1);
    toDate = toDate.getFullYear() + "-" + AddingPrefixZero(toDate.getMonth() + 1) + "-" + AddingPrefixZero(toDate.getDate()) + " " + "23:59:59";

    $.ajax({
        url: "/Form/Dashboard/BindFormImpressionsCount",
        type: 'POST',
        data: JSON.stringify({ 'FormId': FormId, 'FromDateTime': from_Date, 'ToDateTime': to_date }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindFormImpresiionsPercentage(response, ReponseNew);
        },
        error: ShowAjaxError
    });
}
function BindFormImpresiionsPercentage(ResponseOld, ReponseNew) {

    var BindResponseCount, BindViewedCount, BindClosedCount = "";

    $("#lblResponses").html("");
    $("#lblImpressions").html("");
    $("#lblClose").html("");

    if (ReponseNew[0].TotalResponseCount == ResponseOld[0].TotalResponseCount)
        // BindResponseCount = ReponseNew[0].TotalResponseCount;
        BindResponseCount = ' ' + ReponseNew[0].TotalResponseCount + "<label class='updownpercentage'>&nbsp;&nbsp;0% </label>";
    else if (ReponseNew[0].TotalResponseCount > ResponseOld[0].TotalResponseCount)
        BindResponseCount = ' ' + ReponseNew[0].TotalResponseCount + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='UpPercentageImage' title='Up' alt='UP'>" + CalculatePercentage(ReponseNew[0].TotalResponseCount, ResponseOld[0].TotalResponseCount) + "" + '%' + "</label>";
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

    $("#lblResponses").html(BindResponseCount);
    $("#lblImpressions").html(BindViewedCount);
    $("#lblClose").html(BindClosedCount);
}





