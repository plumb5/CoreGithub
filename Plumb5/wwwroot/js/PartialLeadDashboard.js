//Lead performance overview
var chartWonAndLostFlow;
$(document).ready(function () {
    $("#dvLoading").hide();


    BindLeadPerformaceByStage();
    BindWonAndLostReport((new Date).getFullYear());
});

BindLeadPerformaceByStage = function () {
    $.ajax({
        url: "/Prospect/Dashboard/GetTotalLeadBasedOnStage",
        type: 'POST',
        data: JSON.stringify({ 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: CreateDonutChart,
        error: ShowAjaxError
    });
}
CreateDonutChart = function (response) {
    response = JSON.parse(response);
    $('#donuctchart').empty();
    for (var i = 0; i < response.length; i++) {
        var div = "<div id=LmsStage_" + response[i].Id + " style='height: 120px; width: 120px;display:inline-block;'></div>";
        $('#donuctchart').append($(div));
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: "LmsStage_" + response[i].Id,
                type: 'pie',
                //height: auto,
                //width: auto,
                borderRadius: 0
            },
            credits: {
                enabled: false
            },
            subtitle: {
                enabled: true,
                //useHTML: true,
                text: [response[i].Stage],
                verticalAlign: 'bottom',
                y: -1,
                align: 'center',
                // width:100,

                style: {
                    color: '#666666',
                    fontSize: '12px'
                }
            },
            title: {
                enabled: true,
                //useHTML: true,
                text: [response[i].NumberOfLead],
                style: {
                    color: '#666666',
                    fontSize: '12px'


                },
                y: 5,
                verticalAlign: 'middle'
            },
            tooltip: false,
            plotOptions: {
                pie: {
                    borderWidth: 6,
                    startAngle: 90,
                    innerSize: '70%',
                    size: '100%',
                    shadow: true,
                    dataLabels: false,
                    stickyTracking: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    },

                }
            },

            series: [{
                data: [
                    { y: 50, color: response[i].IdentificationColor },
                    { y: 50, color: response[i].IdentificationColor }

                ]

            }]
        });

    }

}
function expandLeadWonAndLostBox() {
    if ($("#dv_wonorlost").hasClass("expand")) {
        $("#dv_wonorlost").addClass("divresize");
        $("#dv_wonorlost").removeClass("expand");


    } else {
        $("#dv_wonorlost").removeClass("divresize");
        $("#dv_wonorlost").addClass("expand");

    }
    chartWonAndLostFlow.reflow();

}
BindWonAndLostReport = function (Year) {
    $.ajax({
        url: "/Prospect/Dashboard/LeadWonLostAnnualPerformanceReport",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ 'Year': Year }),
        dataType: "json",
        success: WonAndLostReportChart,
        error: ShowAjaxError
    });
}
WonAndLostReportChart = function (response) {
    var options = {
        chart: {
            type: 'column',
            renderTo: 'dvwonorlostchart'
        },
        colors: response.IdentificationColor,
        title: false,
        xAxis: {
            categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: false
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Closed Won',
            data: response.TotalWin

        }, {
            name: 'Closed Lost',
            data: response.TotalLost

        }]
    };
    chartWonAndLostFlow = new Highcharts.Chart(options);
    $("#dvLoading").hide();
}

$("#ui_imgyearFilter").click(function () {

    if ($('#ui_spanyear').is(":visible")) {
        $('#ui_spanyear').hide();
    }
    else {
        $('#ui_spanyear').show();
        $("#txtyearfilter").val("");
    }

});

$(".CustomYearSubmitGo").click(function () {
    if (Validate()) {
        $("#dvLoading").show();
        BindWonAndLostReport($("#txtyearfilter").val())
    }
});

function Validate() {
    if ($("#txtyearfilter").val().length == 0) {
        ShowErrorMessage("Please enter year");
        return false;
    }

    if ($('#txtyearfilter').val().substr(0, 1) == "0" || $("#txtyearfilter").val().length > 4) {
        ShowErrorMessage("Please enter a valid year.");
        return false;
    }

    if ($("#txtyearfilter").val() > (new Date).getFullYear()) {
        ShowErrorMessage("Entered year is greater than current year.");
        return false;
    }
    if ($("#txtyearfilter").val() < 1900) {
        ShowErrorMessage("Year should less than 1900.");
        return false;
    }


    return true;
}