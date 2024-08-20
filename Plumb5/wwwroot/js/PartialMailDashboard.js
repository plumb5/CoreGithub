var rotationvalue = 0, tickInterval = 0, dt, graphInterval = 0, diffDays = 0;;
$(document).ready(function () {
    MailReport();
});
function MailReport() {
    GetMailResponseResport();
    BindMailImpressionsCount();
}

function GetMailResponseResport() {

    $.ajax({
        url: "/Mail/Dashboard/GetReport",
        type: 'Post',
        data: JSON.stringify({ 'Duration': duration, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: MailGraphDetails,
        error: ShowAjaxError
    });
}

MailGraphDetails = function (response) {

    var sentmail = new Array(), opened = new Array(), clicked = new Array(), forward = new Array(), unsubscribe = new Array(), bounced = new Array(), dateList = new Array(), seriesListData = new Array();

    if (response.length == 0) {
        $("#dvLoading").hide();
        $("#dvDefault").show();
        $("#divmailcontent").hide();
        return;
    }
    else {
        $("#divmailcontent").show();
        $("#dvDefault").hide();
    }

    if (duration == 1) {

        dt = new Date();
        for (var i = 0; i < response.length; i++) {

            sentmail.push(response[i].SentMail);
            opened.push(response[i].Opened);
            clicked.push(response[i].Clicked);
            forward.push(response[i].Forward);
            unsubscribe.push(response[i].Unsubscribe);
            bounced.push(response[i].Bounced);

            if (response[i].Hour <= 12) {
                dateList.push(monthDetials[dt.getMonth()] + " " + dt.getDate() + " " + response[i].Hour + ":00" + "AM");
            }
            else if (response[i].Hour > 12) {
                var Hourly = parseInt(response[i].Hour) > 12 ? parseInt(response[i].Hour) - 12 : response[i].Hour;
                dateList.push(monthDetials[dt.getMonth()] + " " + dt.getDate() + " " + Hourly + ":00" + "PM");
            }
        }

        tickInterval = 2;
    }

    else if (duration == 2 || duration == 3) {

        for (var i = 0; i < response.length; i++) {

            var currentDateData = ConvertUTCDateTimeToLocal(response[i].GDate);

            sentmail.push(response[i].SentMail);
            opened.push(response[i].Opened);
            clicked.push(response[i].Clicked);
            forward.push(response[i].Forward);
            unsubscribe.push(response[i].Unsubscribe);
            bounced.push(response[i].Bounced);

            dateList.push(monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate());
        }

        if (duration == 3) {
            tickInterval = 2;
        }
        else if (duration == 2) {
            tickInterval = 1;
        }
    }

    else if (duration == 4 || duration == 5) {

        for (var i = 0; i < response.length; i++) {

            sentmail.push(response[i].SentMail);
            opened.push(response[i].Opened);
            clicked.push(response[i].Clicked);
            forward.push(response[i].Forward);
            unsubscribe.push(response[i].Unsubscribe);
            bounced.push(response[i].Bounced);

            dateList.push(monthDetials[response[i].Month - 1] + " " + response[i].Year);
        }

        if (duration == 4) {
            tickInterval = 0;
        }
        else if (duration == 5) {
            tickInterval = 0;
        }
    }

    seriesListData.push({ color: '#8dc40f', name: 'Sent', data: sentmail });
    seriesListData.push({ color: '#ED323E', name: 'Opened', data: opened });
    seriesListData.push({ color: '#efc419', name: 'Clicked', data: clicked });
    seriesListData.push({ color: '#BC20E7', name: 'Forward', data: forward });
    seriesListData.push({ color: '#333', name: 'Unsubscribe', data: unsubscribe });
    seriesListData.push({ color: '#327cd8', name: 'Bounced', data: bounced });

    AppendMailChart(dateList, seriesListData);
};
AppendMailChart = function (dateList, seriesListData) {

    var chart;
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'dvMailResponseGraph',
            type: 'spline'
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

};
function BindMailImpressionsCount() {

    $.ajax({
        url: "/Mail/Dashboard/FormImpressionData",
        type: 'POST',
        data: JSON.stringify({ 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: MailOverallPercentage,
        error: ShowAjaxError
    });
}
function MailOverallPercentage(ReponseNew) {

    var fromDate = CalculateDiffDays();

    $.ajax({
        url: "/Mail/Dashboard/FormImpressionData",
        type: 'POST',
        data: JSON.stringify({ 'FromDateTime': fromDate, 'ToDateTime': FromDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindMailImpresiionsPercentage(response, ReponseNew);
        },
        error: ShowAjaxError
    });
}
function BindMailImpresiionsPercentage(ResponseOld, ReponseNew) {

    var BindOpened, BindClicked, BindSent, BindBounced, BindForward, BindUnsubscribe = "";

    $("#lblMailOpened").html("");
    $("#lblMailClicked").html("");
    $("#lblMailSent").html("");
    $("#lblMailBounced").html("");
    $("#lblMailForward").html("");
    $("#lblMailUnsubscribe").html("");

    if (ReponseNew[0].TotalOpened == ResponseOld[0].TotalOpened)
        BindOpened = ReponseNew[0].TotalOpened;
    else if (ReponseNew[0].TotalOpened > ResponseOld[0].TotalOpened)
        BindOpened = '' + ReponseNew[0].TotalOpened + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='UpPercentageImage' title='Up' alt='UP'>" + CalculatePercentage(ReponseNew[0].TotalOpened, ResponseOld[0].TotalOpened) + "" + '%' + "</label>";
    else if (ReponseNew[0].TotalOpened < ResponseOld[0].TotalOpened)
        BindOpened = ' ' + ReponseNew[0].TotalOpened + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='DownPercentageImage' title='Down' alt='Down'>" + CalculatePercentage(ReponseNew[0].TotalOpened, ResponseOld[0].TotalOpened) + "" + '%' + "</label>";

    if (ReponseNew[0].TotalClicked == ResponseOld[0].TotalClicked)
        BindClicked = ReponseNew[0].TotalClicked;
    else if (ReponseNew[0].TotalClicked > ResponseOld[0].TotalClicked)
        BindClicked = ' ' + ReponseNew[0].TotalClicked + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='UpPercentageImage' title='Up' alt='UP'>" + CalculatePercentage(ReponseNew[0].TotalClicked, ResponseOld[0].TotalClicked) + " " + '%' + "</label>";
    else if (ReponseNew[0].TotalClicked < ResponseOld[0].TotalClicked)
        BindClicked = ' ' + ReponseNew[0].TotalClicked + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='DownPercentageImage' title='Down' alt='Down'>" + CalculatePercentage(ReponseNew[0].TotalClicked, ResponseOld[0].TotalClicked) + "" + '%' + "</label>";

    if (ReponseNew[0].TotalSent == ResponseOld[0].TotalSent)
        BindSent = ReponseNew[0].TotalSent;
    else if (ReponseNew[0].TotalSent > ResponseOld[0].TotalSent)
        BindSent = ' ' + ReponseNew[0].TotalSent + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='UpPercentageImage' title='Up' alt='UP'>" + CalculatePercentage(ReponseNew[0].TotalSent, ResponseOld[0].TotalSent) + "" + '%' + "</label>";
    else if (ReponseNew[0].TotalSent < ResponseOld[0].TotalSent)
        BindSent = ' ' + ReponseNew[0].TotalSent + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='DownPercentageImage' title='Down' alt='Down'>" + CalculatePercentage(ReponseNew[0].TotalSent, ResponseOld[0].TotalSent) + "" + '%' + "</label>";

    if (ReponseNew[0].TotalBounced == ResponseOld[0].TotalBounced)
        BindBounced = ReponseNew[0].TotalBounced;
    else if (ReponseNew[0].TotalBounced > ResponseOld[0].TotalBounced)
        BindBounced = '' + ReponseNew[0].TotalBounced + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='UpPercentageImage' title='Up' alt='UP'>" + CalculatePercentage(ReponseNew[0].TotalBounced, ResponseOld[0].TotalBounced) + "" + '%' + "</label>";
    else if (ReponseNew[0].TotalBounced < ResponseOld[0].TotalBounced)
        BindBounced = ' ' + ReponseNew[0].TotalBounced + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='DownPercentageImage' title='Down' alt='Down'>" + CalculatePercentage(ReponseNew[0].TotalBounced, ResponseOld[0].TotalBounced) + "" + '%' + "</label>";

    if (ReponseNew[0].TotalForward == ResponseOld[0].TotalForward)
        BindForward = ReponseNew[0].TotalForward;
    else if (ReponseNew[0].TotalForward > ResponseOld[0].TotalForward)
        BindForward = ' ' + ReponseNew[0].TotalForward + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='UpPercentageImage' title='Up' alt='UP'>" + CalculatePercentage(ReponseNew[0].TotalForward, ResponseOld[0].TotalForward) + " " + '%' + "</label>";
    else if (ReponseNew[0].TotalForward < ResponseOld[0].TotalForward)
        BindForward = ' ' + ReponseNew[0].TotalForward + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='DownPercentageImage' title='Down' alt='Down'>" + CalculatePercentage(ReponseNew[0].TotalForward, ResponseOld[0].TotalForward) + "" + '%' + "</label>";

    if (ReponseNew[0].TotalUnsubscribe == ResponseOld[0].TotalUnsubscribe)
        BindUnsubscribe = ReponseNew[0].TotalUnsubscribe;
    else if (ReponseNew[0].TotalUnsubscribe > ResponseOld[0].TotalUnsubscribe)
        BindUnsubscribe = ' ' + ReponseNew[0].TotalUnsubscribe + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='UpPercentageImage' title='Up' alt='UP'>" + CalculatePercentage(ReponseNew[0].TotalUnsubscribe, ResponseOld[0].TotalUnsubscribe) + "" + '%' + "</label>";
    else if (ReponseNew[0].TotalUnsubscribe < ResponseOld[0].TotalUnsubscribe)
        BindUnsubscribe = ' ' + ReponseNew[0].TotalUnsubscribe + "<label class='updownpercentage'><img src='/images/img_trans.gif' class='DownPercentageImage' title='Down' alt='Down'>" + CalculatePercentage(ReponseNew[0].TotalUnsubscribe, ResponseOld[0].TotalUnsubscribe) + "" + '%' + "</label>";

    $("#lblMailOpened").html(BindOpened);
    $("#lblMailClicked").html(BindClicked);
    $("#lblMailSent").html(BindSent);
    $("#lblMailBounced").html(BindBounced);
    $("#lblMailForward").html(BindForward);
    $("#lblMailUnsubscribe").html(BindUnsubscribe);
}

