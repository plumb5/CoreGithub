var rotationvalue = 0, tickInterval = 0, dt, diffDays = 0;;
$(document).ready(function () {
    SMSReport();
});
function SMSReport() {
    GetSMSResponseResport();
    BindSMSImpressionsCount();
}
function GetSMSResponseResport() {

    $.ajax({
        url: "/Sms/Dashboard/GetReport",
        type: 'Post',
        data: JSON.stringify({ 'Duration': duration, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: SMSGraphDetails,
        error: ShowAjaxError
    });
}
SMSGraphDetails = function (response) {

    var sentsms = new Array(), delivered = new Array(), clicked = new Array(), dateList = new Array(), seriesListData = new Array();

    if (response.length == 0) {
        $("#dvLoading").hide();
        $("#dvDefault").show();
        $("#divsmscontent").hide();
        return;
    }
    else {
        $("#divsmscontent").show();
        $("#dvDefault").hide();
    }

    if (duration == 1) {

        dt = new Date();
        for (var i = 0; i < response.length; i++) {

            sentsms.push(response[i].SentSms);
            delivered.push(response[i].Delivered);
            clicked.push(response[i].Clicked);

            var timevalue = response[i].Hour;

            if (timevalue <= 12) {
                var appendingvalue = response[i].Hour + ":00" + "AM";
                dateList.push(monthDetials[dt.getMonth()] + " " + dt.getDate() + " " + appendingvalue);
            }
            else if (timevalue > 12) {

                var Hourly = parseInt(response[i].Hour) > 12 ? parseInt(response[i].Hour) - 12 : response[i].Hour;
                var appendingvalue = Hourly + ":00" + "PM";
                dateList.push(monthDetials[dt.getMonth()] + " " + dt.getDate() + " " + appendingvalue);
            }
        }
        tickInterval = 2;
    }

    else if (duration == 2 || duration == 3) {

        for (var i = 0; i < response.length; i++) {

            var currentDateData = ConvertUTCDateTimeToLocal(response[i].GDate);

            sentsms.push(response[i].SentSms);
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

            sentsms.push(response[i].SentSms);
            delivered.push(response[i].Delivered);
            clicked.push(response[i].Clicked);

            dateList.push(monthDetials[response[i].Month - 1] + " " + response[i].Year);
        }


        tickInterval = 0;
    }

    seriesListData.push({ color: '#8dc40f', name: 'Sent', data: sentsms });
    seriesListData.push({ color: '#ED323E', name: 'Delivered', data: delivered });
    seriesListData.push({ color: '#efc419', name: 'Clicked', data: clicked });

    AppendSMSChart(dateList, seriesListData);
};
AppendSMSChart = function (dateList, seriesListData) {

    var chart;
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'dvSmsResponseGraph',
            type: 'spline'
        },

        //title: {
        //    text: 'Sms Responses'
        //},

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
function BindSMSImpressionsCount() {

    $.ajax({
        url: "/Sms/Dashboard/FormImpressionData",
        type: 'POST',
        data: JSON.stringify({ 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: SMSOverallPercentage,
        error: ShowAjaxError
    });
}
function SMSOverallPercentage(ReponseNew) {

    var fromDate = CalculateDiffDays();

    $.ajax({
        url: "/Sms/Dashboard/FormImpressionData",
        type: 'POST',
        data: JSON.stringify({ 'FromDateTime': fromDate, 'ToDateTime': FromDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindSMSImpresiionsPercentage(response, ReponseNew);
        },
        error: ShowAjaxError
    });
}
function BindSMSImpresiionsPercentage(ResponseOld, ReponseNew) {

    var BindDelivered, BindClicked, BindSent = "";

    $("#lblSMSDelivered").html("");
    $("#lblSMSClicked").html("");
    $("#lblSMSSent").html("");

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

    $("#lblSMSDelivered").append(BindDelivered);
    $("#lblSMSClicked").append(BindClicked);
    $("#lblSMSSent").append(BindSent);
}
