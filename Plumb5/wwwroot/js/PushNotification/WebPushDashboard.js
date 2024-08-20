
var rotationvalue = 0, tickInterval = 0, dt, diffDays = 0;

$(document).ready(function () {
    GetDateTimeRange(1);
});

var CallBackFunction = function () {
    GetResponseResport();
    BindImpressionsCount();
};

function GetResponseResport() {

    if (duration == 5) {

        var fromdate = $("#txtDateFrom").val();
        var dates = fromdate.split('-');
        var fromDate = new Date(dates[0], dates[1] - 1, dates[2]);

        var todate = $("#txtDateTo").val();
        var dates = todate.split('-');
        var toDate = new Date(dates[0], dates[1] - 1, dates[2]);

        diffDays = Math.abs((fromDate.getTime() - toDate.getTime()) / (24 * 60 * 60 * 1000));

        if (diffDays == 0)
            duration = 1;
        else if (diffDays <= 6)
            duration = 2;
        else if (diffDays <= 28)
            duration = 3;
        else if (diffDays <= 365)
            duration = 4;
        else if (diffDays > 365)
            duration = 5;
    }

    $.ajax({
        url: "/Browser/GetReport",
        type: 'Post',
        data: JSON.stringify({ 'Duration': duration, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: GraphDetails,
        error: ShowAjaxError
    });
}

GraphDetails = function (response) {

    var sentpush = new Array(), delivered = new Array(), clicked = new Array(), dateList = new Array(), seriesListData = new Array();

    if (response.length == 0) {
        $("#dvLoading").hide();
        $("#dvDefault").show();
        $("#divcontent").hide();
        return;
    }
    else {
        $("#divcontent").show();
        $("#dvDefault").hide();
    }

    if (duration == 1) {

        for (var i = 0; i < response.length; i++) {

            var currentDateData = ConvertUTCDateTimeToLocal(response[i].GDate);
            var currentHour = currentDateData.getHours();

            sentpush.push(response[i].SentPush);
            delivered.push(response[i].Delivered);
            clicked.push(response[i].Clicked);

            if (currentHour < 12) {
                var appendingvalue = currentHour + ":00" + "AM";
                dateList.push(monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate() + " " + appendingvalue);
            }
            else if (currentHour >= 12) {

                var Hourly = parseInt(currentHour) > 12 ? parseInt(currentHour) - 12 : currentHour;
                var appendingvalue = Hourly + ":00" + "PM";
                dateList.push(monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate() + " " + appendingvalue);
            }
        }
        tickInterval = 2;
    }

    else if (duration == 2 || duration == 3) {

        for (var i = 1; i < response.length; i++) {

            var currentDateData = ConvertDateObjectToDateTime(response[i].GDate);

            sentpush.push(response[i].SentPush);
            delivered.push(response[i].Delivered);
            clicked.push(response[i].Clicked);

            dateList.push(monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate());
        }
        if (duration == 2)
            tickInterval = 0;
        else if (duration == 3)
            tickInterval = 2;
    }

    else if (duration == 4 || duration == 5) {

        for (var i = 0; i < response.length; i++) {

            sentpush.push(response[i].SentPush);
            delivered.push(response[i].Delivered);
            clicked.push(response[i].Clicked);

            dateList.push(monthDetials[response[i].Month - 1] + " " + response[i].Year);
        }


        tickInterval = 0;
    }

    seriesListData.push({ color: '#8dc40f', name: 'Sent', data: sentpush });
    seriesListData.push({ color: '#ED323E', name: 'Delivered', data: delivered });
    seriesListData.push({ color: '#efc419', name: 'Clicked', data: clicked });

    AppendChart(dateList, seriesListData);
};


AppendChart = function (dateList, seriesListData) {

    var chart;
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'dvSmsResponseGraph',
            type: 'spline'
        },

        title: {
            text: 'WebPush Responses'
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

function BindImpressionsCount() {

    $.ajax({
        url: "/Browser/FormImpressionData",
        type: 'POST',
        data: JSON.stringify({ 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: OverallPercentage,
        error: ShowAjaxError
    });
}

function OverallPercentage(ReponseNew) {

    var fromDate = CalculateDiffDays();

    $.ajax({
        url: "/Browser/FormImpressionData",
        type: 'POST',
        data: JSON.stringify({ 'FromDateTime': fromDate, 'ToDateTime': FromDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindImpresiionsPercentage(response, ReponseNew);
        },
        error: ShowAjaxError
    });
}

function BindImpresiionsPercentage(ResponseOld, ReponseNew) {

    var BindDelivered, BindClicked, BindSent = "";

    $("#lblDelivered").html("");
    $("#lblClicked").html("");
    $("#lblSent").html("");

    if (ReponseNew[0].TotalDelivered == ResponseOld[0].TotalDelivered)
        BindDelivered = ReponseNew[0].TotalDelivered;
    else if (ReponseNew[0].TotalDelivered > ResponseOld[0].TotalDelivered)
        BindDelivered = '' + ReponseNew[0].TotalDelivered + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='UpPercentageImage' title='Up' alt='UP'>" + CalculatePercentage(ReponseNew[0].TotalDelivered, ResponseOld[0].TotalDelivered) + "" + '%' + "</label>";
    else if (ReponseNew[0].TotalDelivered < ResponseOld[0].TotalDelivered)
        BindDelivered = ' ' + ReponseNew[0].TotalDelivered + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='DownPercentageImage' title='Down' alt='Down'>" + CalculatePercentage(ReponseNew[0].TotalDelivered, ResponseOld[0].TotalDelivered) + "" + '%' + "</label>";

    if (ReponseNew[0].TotalClicked == ResponseOld[0].TotalClicked)
        BindClicked = ReponseNew[0].TotalClicked;
    else if (ReponseNew[0].TotalClicked > ResponseOld[0].TotalClicked)
        BindClicked = ' ' + ReponseNew[0].TotalClicked + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='UpPercentageImage' title='Up' alt='UP'>" + CalculatePercentage(ReponseNew[0].TotalClicked, ResponseOld[0].TotalClicked) + "" + '%' + "</label>";
    else if (ReponseNew[0].TotalClicked < ResponseOld[0].TotalClicked)
        BindClicked = ' ' + ReponseNew[0].TotalClicked + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='DownPercentageImage' title='Down' alt='Down'>" + CalculatePercentage(ReponseNew[0].TotalClicked, ResponseOld[0].TotalClicked) + "" + '%' + "</label>";

    if (ReponseNew[0].TotalSent == ResponseOld[0].TotalSent)
        BindSent = ReponseNew[0].TotalSent;
    else if (ReponseNew[0].TotalSent > ResponseOld[0].TotalSent)
        BindSent = ' ' + ReponseNew[0].TotalSent + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='UpPercentageImage' title='Up' alt='UP'>" + CalculatePercentage(ReponseNew[0].TotalSent, ResponseOld[0].TotalSent) + " " + '%' + "</label>";
    else if (ReponseNew[0].TotalSent < ResponseOld[0].TotalSent)
        BindSent = ' ' + ReponseNew[0].TotalSent + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='DownPercentageImage' title='Down' alt='Down'>" + CalculatePercentage(ReponseNew[0].TotalSent, ResponseOld[0].TotalSent) + " " + '%' + "</label>";

    $("#lblDelivered").append(BindDelivered);
    $("#lblClicked").append(BindClicked);
    $("#lblSent").append(BindSent);
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




