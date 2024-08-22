var IsLoading = {
    IsReportGot: false,
    IsCurrentEngagementData: false,
    IsWhatsAppCurrentDeliveryData: false,
    IsPerformanceOverTimeData: false,
    IsWhatsAppDeliveredFailedData: false
};
var clearTimeInterval = null;
var WhatsAppPerformanceOvertimeChart;
$(document).ready(function () {
    GetUTCDateTimeRange(2);
});
function CallBackFunction() {
    ShowPageLoading();
    IsLoading.IsReportGot = false; IsLoading.IsCurrentEngagementData = false; IsLoading.IsWhatsAppCurrentDeliveryData = false; IsLoading.IsPerformanceOverTimeData = false; IsLoading.IsWhatsAppDeliveredFailedData = false;
    GetReport();
    GetCurrentEngagementData();
    GetWhatsAppCurrentDeliveryData();
    GetPerformanceOverTimeData();
    GetWhatsAppDeliveredFailedData();
    clearTimeInterval = setInterval(IsLoadingToHide, 1000);
}

function IsLoadingToHide() {
    if (IsLoading.IsReportGot && IsLoading.IsCurrentEngagementData && IsLoading.IsWhatsAppCurrentDeliveryData && IsLoading.IsPerformanceOverTimeData && IsLoading.IsWhatsAppDeliveredFailedData) {
        clearInterval(clearTimeInterval);
        HidePageLoading();
    } else {
        ShowPageLoading();
    }
}

function GetReport() {
    var campaignEffectiveness = { campaignname: "", templatename: "", deliveryrate: 0, ReadRate: 0, campaignsize: 0 };
    var data = [];
    var chartWidth = d3.select("#my_dataviz")
        .style('width')
        .slice(0, -2),
        chartHeight = d3.select("#my_dataviz")
            .style('height')
            .slice(0, -2);
    var margin = {
        top: 60,
        right: 60,
        bottom: 60,
        left: 60
    },
        width = chartWidth - margin.left - margin.right,
        height = chartHeight - margin.top - margin.bottom;
    d3.selectAll("#my_dataviz > *").remove();
    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(responsivefy)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    $.ajax({
        url: "/WhatsApp/WhatsAppDashboard/GetCampaignEffectivenessData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            $.each(response, function () {
                campaignEffectiveness = { campaignname: "", templatename: "", deliveryrate: 0, readrate: 0, campaignsize: 0 };

                campaignEffectiveness.campaignname = this.campaignname;
                campaignEffectiveness.templatename = this.templatename;
                campaignEffectiveness.deliveryrate = parseInt(this.TotalSent) > 0 ? parseInt(Math.round((this.TotalDelivered / this.TotalSent) * 100).toFixed(2)) : 0;
                campaignEffectiveness.readrate = parseInt(this.TotalSent) > 0 ? parseInt(Math.round((this.TotalRead / this.TotalSent) * 100).toFixed(2)) : 0;
                campaignEffectiveness.campaignsize = this.TotalSent;
                data.push(campaignEffectiveness);
            });
            IsLoading.IsReportGot = true;
            if (data != null && data.length > 0) {
                //Calculate Average Click & Delivery rate using d3.js//
                //----------------------------------//
                const avgReadRate = Math.round(d3.mean(data, function (d) {
                    return d.readrate;
                }));
                const avgDeliveryRate = Math.round(d3.mean(data, function (d) {
                    return d.deliveryrate;
                }));
                // ---------------------------//
                //      Chart Title          //
                // ---------------------------//

                svg.append("text")
                    .attr("x", 0)
                    .attr("y", 0 - (margin.top / 2))
                    .attr("text-anchor", "left")
                    .style("font-size", "14px")
                    .attr("font-weight", "bolder")
                    .text("");

                // ---------------------------//
                //       AXIS  AND SCALE      //
                // ---------------------------//

                // Add X axis
                var x = d3.scaleLinear()
                    .domain([0, 100])
                    .range([0, width]);
                svg.append("g")
                    .attr("transform", "translate(0," + (height + 10) + ")")
                    .call(d3.axisBottom(x)
                        .ticks(8)
                        .tickFormat(function (d) {
                            return d + "%";
                        }));

                // Add X axis label:
                svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("x", 0.6 * width)
                    .attr("y", height + 50)
                    .attr("font-weight", "bolder")
                    .attr("font-size", "12")
                    .text("Delivery to Read Rate (DTRR) ");

                // Add Y axis
                var y = d3.scaleLinear()
                    .domain([0, 100])
                    .range([height, 0]);
                svg.append("g")
                    .attr("transform", "translate(-10,0)")
                    .call(d3.axisLeft(y)
                        .tickFormat(function (d) {
                            return d + "%";
                        }));

                // Add Y axis label:
                svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("transform", "translate(0," + 0.45 * height + ") rotate(-90)")
                    .attr("font-size", "12")
                    .attr("font-weight", "bolder")
                    .text("Delivery Rate")
                    .attr("text-anchor", "middle")//recently changed from start to middle
                    .attr("dy", "-3.5em");
                // Add a scale for bubble size
                var z = d3.scaleSqrt()
                    .domain([1000, 10000000])
                    .range([5, 25]);

                // Add a scale for bubble color
                var myColor = d3.scaleOrdinal()
                    .domain(["Low Delivery & Low Clicks", "Low Clicks & High Delivery", "High Clicks & Low Delivery", "High Clicks & High Delivery"])
                    .range(["#ff6358", "#ffd246", "#2d73f5", "#78d237"]);


                // ---------------------------//
                //      TOOLTIP               //
                // ---------------------------//

                var tooltip = d3.select("#my_dataviz")
                    .append("div")
                    .style("opacity", 0)
                    .attr("class", "tooltip");



                // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
                var showTooltip = function (d) {
                    var Mx = d3.mouse(this)[0] + 80;
                    var My = d3.mouse(this)[1] + 100;
                    tooltip
                        .transition()
                        .duration(2000);
                    tooltip
                        .style("opacity", 1)
                        .html("<p class='toolCampName mb-0 camptit'>Campaign Name: " + "<span class='d-block tooltempName tempnamtit'>" + d.campaignname + "</span>" + "</p><p class='toolCampName mb-0'>Template Name: " + "<span class='d-block tooltempName'>" + d.templatename + "</span>" + "</p><p class='toolCampName'>Delivery rate: " + "<span class='perctcolblu'>" + d.deliveryrate + "%</span>" + "<br>Click Rate: " + "<span class='perctcolblu'>" + d.readrate + "%</span>" + "</p><p class='toolCampName m-0 pt-0'>Total Sent: " + "<span class='tooltempName d-block'>" + d.campaignsize + "</span>" + "</p>")
                        .style("left", (Mx) + "px")
                        .style("top", (My) + "px");
                };

                var hideTooltip = function (d) {
                    tooltip
                        .transition()
                        .duration(200)
                        .style("opacity", 0);
                };


                // ---------------------------//
                //       CIRCLES              //
                // ---------------------------//

                // Add dots
                svg.append('g')
                    .selectAll("dot")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("class", function (d) {
                        return "bubbles " + d.campaignname;
                    })
                    .attr("cx", function (d) {
                        return x(d.readrate);
                    })
                    .attr("cy", function (d) {
                        return y(d.deliveryrate);
                    })
                    .attr("r", function (d) {
                        return z(d.campaignsize);
                    })
                    .style("fill", function (d) {
                        var myColor = ["#d35e60", "#e1974c", "#7293cb", "#84ba5b"];
                        if (Math.round(d.deliveryrate) < avgDeliveryRate && Math.round(d.readrate) < avgReadRate) {
                            return myColor[0];
                        } else if (Math.round(d.deliveryrate) > avgDeliveryRate && Math.round(d.readrate) < avgReadRate) {
                            return myColor[1];
                        } else if (Math.round(d.deliveryrate) < avgDeliveryRate && Math.round(d.readrate) > avgReadRate) {
                            return myColor[2];
                        } else if (Math.round(d.deliveryrate) > avgDeliveryRate && Math.round(d.readrate) > avgReadRate) {
                            return myColor[3];
                        }
                    })
                    // -3- Trigger the functions for hover
                    .on("mouseover", showTooltip)
                    .on("mouseleave", hideTooltip);

                // ---------------------------//
                //       Average line         //
                // ---------------------------//
                var avglinedata_read = [{
                    x: avgReadRate,
                    y: 0
                }, {
                    x: avgReadRate,
                    y: 100
                }];
                var avglinedata_deliver = [{
                    x: 0,
                    y: avgDeliveryRate
                }, {
                    x: 100,
                    y: avgDeliveryRate
                }];

                //-----------------average avgReadRate Line----------------------
                var fn_avgreadline = d3.line()
                    .x(function (d, i) {
                        return d.x * width / 100;
                    })
                    .y(function (d, i) {
                        return d.y * height / 100;
                    })

                svg.append("path")
                    .datum(avglinedata_read)
                    .attr("d", fn_avgreadline)
                    .attr("stroke", "lightgrey")
                    .attr("stroke-dasharray", "8,4")
                    .attr("stroke-width", 2)
                svg.append("text")
                    .attr("transform", "translate(" + avgReadRate * width / 100 + ",0) rotate(-90)")
                    .attr("dy", "1.5em")// Recently changed from -0.75 to 1.5em
                    .attr("font-size", "10")
                    .attr("font-weight", "bolder")
                    .attr("text-anchor", "end")
                    .style("fill", "#a8acbf")
                    .html("Avg. DTCR: " + avgReadRate + "%");
                //-----------------average deliverrate Line----------------------
                var fn_avgdeliverline = d3.line()
                    .x(function (d, i) {
                        return d.x * width / 100;
                    })
                    .y(function (d, i) {
                        var tmpx = d.y * height / 100;
                        return height - tmpx;
                    });
                var _avgdelX = width;
                var _avgdelY = avgDeliveryRate * height / 100;
                _avgdelY = height - _avgdelY;

                svg.append("path")
                    .datum(avglinedata_deliver)
                    .attr("d", fn_avgdeliverline)
                    .attr("stroke", "lightgrey")
                    .attr("stroke-dasharray", "8,4")
                    .attr("stroke-width", 2);
                svg.append("text")
                    .attr("transform", "translate(" + _avgdelX + "," + _avgdelY + ")")
                    .attr("dy", "-0.75em")
                    .attr("font-size", "10")
                    .attr("font-weight", "bolder")
                    .attr("text-anchor", "end")
                    .style("fill", "#a8acbf")
                    .html("Avg. Delivery Rate: " + avgDeliveryRate + "%");
            }
        },
        error: ShowAjaxError
    });
}

function GetCurrentEngagementData() {
    $.ajax({
        url: "/WhatsApp/WhatsAppDashboard/GetWhatsAppDashboardSubcribersData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,

        success: function (response) {
            IsLoading.IsCurrentEngagementData = true;
            if (response != null) {
                $('#ui_h1TotalWhatsappSubscribers').text(response[0].TotalwhatsAppSubcribers);
                $('#ui_h1TotalWhatsappUnSubscribers').text(response[0].TotalwhatsAppUnSubcribers);

            }
        },
        error: ShowAjaxError
    });
}



function GetWhatsAppCurrentDeliveryData() {
    $.ajax({
        url: "/WhatsApp/WhatsAppDashboard/GetWhatsAppDashboardDeliveryData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: GetWhatsAppPastDeliverData,
        error: ShowAjaxError
    });
}
function GetWhatsAppPastDeliverData(CurrentDeliverData) {
    var from_Date = CalculateDateDifference();
    $.ajax({
        url: "/WhatsApp/WhatsAppDashboard/GetWhatsAppDashboardDeliveryData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': from_Date, 'todate': FromDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (PastDeliverData) {
            IsLoading.IsWhatsAppCurrentDeliveryData = true;
            var SentComparisonPercentage = 0, DeliveredComparisonPercentage = 0, TotalReadComparisonPercentage = 0, DeliveryRatePercentage = 0;
            if (CurrentDeliverData != undefined && CurrentDeliverData != null) {
                DeliveryRatePercentage = Math.round((CurrentDeliverData[0].TotalDelivered / CurrentDeliverData[0].TotalSent) * 100).toFixed(0);
                DeliveryRatePercentage = isNaN(DeliveryRatePercentage) ? 0 : DeliveryRatePercentage;
                $('#SendCount').text(CurrentDeliverData[0].TotalSent);
                $('#DeliveredCount').text(CurrentDeliverData[0].TotalDelivered);
                $('#TotalReadCount').text(CurrentDeliverData[0].TotalRead);

                $("#DeliverRatePercentage").attr('aria-valuenow', DeliveryRatePercentage);
                $('#DeliverRatePercentage').text(DeliveryRatePercentage + '%');
                var widthValue = parseInt(DeliveryRatePercentage) < 10 ? 10 : Math.round(DeliveryRatePercentage / 10) * 10;
                $('#DeliverRatePercentage').removeClass().addClass('progress-bar bg-primary wd-' + widthValue + 'p');
            }
            if (CurrentDeliverData != undefined && CurrentDeliverData != null && PastDeliverData != undefined && PastDeliverData != null) {

                SentComparisonPercentage = Math.round(CalculatePercentage(CurrentDeliverData[0].TotalSent, PastDeliverData[0].TotalSent));
                DeliveredComparisonPercentage = Math.round(CalculatePercentage(CurrentDeliverData[0].TotalDelivered, PastDeliverData[0].TotalDelivered));
                TotalReadComparisonPercentage = Math.round(CalculatePercentage(CurrentDeliverData[0].TotalRead, PastDeliverData[0].TotalRead));
                $('#SentPercentage').text(SentComparisonPercentage + '%');
                $('#DeliveredPercentage').text(DeliveredComparisonPercentage + '%');
                $('#ReadPercentage').text(TotalReadComparisonPercentage + '%');

            }
        },
        error: ShowAjaxError
    });
}

function GetPerformanceOverTimeData() {
    $.ajax({
        url: "/WhatsApp/WhatsAppDashboard/GetWhatsAppPerformanceOverTimeData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: BindLineGraph,
        error: ShowAjaxError
    });
}
function BindLineGraph(response) {
    IsLoading.IsPerformanceOverTimeData = true;
    if (WhatsAppPerformanceOvertimeChart) {
        WhatsAppPerformanceOvertimeChart.destroy();
    }

    var GraphItemDate = [];
    var GraphItem = { ShortDate: [], DeliverRate: [], ReadRate: [] };
    $.each(response, function () {
        var currentDateData = ConvertDateObjectToDateTime(this.SentDate);
        if (duration == 1) {
            if (currentDateData.getDate() == new Date().getDate()) {
                GraphItemDate.push({ Date: currentDateData, Count: Math.round((this.TotalDelivered / this.TotalSent) * 100), ReadRate: Math.round((this.TotalRead / this.TotalSent) * 100) });
            }
        } else {
            GraphItemDate.push({ Date: this.SentDate, Count: Math.round((this.TotalDelivered / this.TotalSent) * 100), ReadRate: Math.round((this.TotalRead / this.TotalSent) * 100) });
        }
    });

    GraphItem.ShortDate.length = 0; GraphItem.DeliverRate.length = 0; GraphItem.ReadRate.length = 0;
    let datedata = GetDateCountForGraphData(GraphItemDate, FromDateTime, ToDateTime);
    if (datedata != undefined && datedata != null && datedata.length > 0) {
        for (let i = 0; i < datedata.length; i++) {
            GraphItem.ShortDate.push(monthDetials[datedata[i].Date.getMonth()] + " " + datedata[i].Date.getDate());
            if (datedata[i].Count == 0) {
                GraphItem.DeliverRate.push(0);
                GraphItem.ReadRate.push(0);
            } else {
                GraphItem.DeliverRate.push(datedata[i].Count);
                GraphItem.ReadRate.push(datedata[i].ReadRate);
            }
        }
    }

    BindWhatsAppLineGraph(GraphItem);
}

function BindWhatsAppLineGraph(GraphItem) {
    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    // line chart start here
    WhatsAppPerformanceOvertimeChart = new Chart(document.getElementById("whatsappperformanceovertime"), {
        type: 'line',
        data: {
            labels: GraphItem.ShortDate,
            datasets: [{
                data: GraphItem.DeliverRate,
                label: "Delivery Rate",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item1'),
                backgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                fill: false
            },
            {
                data: GraphItem.ReadRate,
                label: "Read Rate",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item2'),
                backgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                fill: false
            }
            ]
        },
        options: {
            maintainAspectRatio: false,
            elements: {
                point: {
                    radius: 2
                }
            },
            scales: {
                yAxes: [{
                    ticks: {

                        min: 0,
                        max: 100,
                        callback: function (value) { return value + "%" }
                    }
                }]
            },
            legend: {
                display: true,
                position: 'bottom',
                fullWidth: true,
                labels: {
                    fontSize: 11,
                    boxHeight: 0

                }
            }
        }
    });
}


function GetWhatsAppDeliveredFailedData() {
    $.ajax({
        url: "/WhatsApp/WhatsAppDashboard/GetWhatsAppDashboardDeliveredFailedData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            IsLoading.IsWhatsAppDeliveredFailedData = true;
            var DeliveredPercentage = 0, FailedPercentage = 0;
            if (response != null && response.length > 0) {
                DeliveredPercentage = Math.round((response[0].Delivered / response[0].TotalSent) * 100).toFixed(0);
                DeliveredPercentage = isNaN(DeliveredPercentage) ? 0 : DeliveredPercentage;

                FailedPercentage = Math.round((response[0].Failed / response[0].TotalSent) * 100).toFixed(0);
                FailedPercentage = isNaN(FailedPercentage) ? 0 : FailedPercentage;
                BindPieChart(response[0].Delivered, response[0].Failed);
            } else {
                BindPieChart(0, 0);
            }

            $('#PiechartDelivered').text("(" + DeliveredPercentage + "%)");
            $('#PieChartFailed').text("(" + FailedPercentage + "%)");
        },
        error: ShowAjaxError
    });
}
function BindPieChart(Delivered, Failed) {
    $("#ui_divDeliveredNoData").addClass("hideDiv");
    $("#deliveredfailed").removeClass("hideDiv");

    /* Doughnut */
    var leadChanWise = document.getElementById("deliveredfailed");
    var chart_config = {
        plugins: [ChartDataLabels],
        type: 'doughnut',
        data: {
            labels: ["Delivered", "Failed"],
            datasets: [
                {
                    backgroundColor: [cssvar('--PieChart-BackgroundColor-Item5'), cssvar('--PieChart-BackgroundColor-Item6')],
                    data: [Delivered, Failed]
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
                display: false,
                responsive: true,
                position: 'bottom',
                fullWidth: true,
                labels: {
                    fontSize: 11,
                }
            },
            title: {
                display: false,
                //text: 'Predicted world population (millions) in 2050'
            }
        }
    }

    // Check if data is all 0s; if it is, add dummy data to end with empty label
    chart_config.data.datasets.forEach(dataset => {
        if (dataset.data.every(el => el === 0)) {
            dataset.backgroundColor.push('rgba(192,192,192,0.3)');
            dataset.data.push(0);

            $("#ui_divDeliveredNoData").removeClass("hideDiv");
            $("#deliveredfailed").addClass("hideDiv");
        }
    })
    new Chart(leadChanWise, chart_config);
}

function responsivefy(svg) {

    // Container is the DOM element, svg is appended.
    // Then we measure the container and find its
    // aspect ratio.

    const container = d3.select(svg.node().parentNode),
        width = parseInt(container.style('width'), 10),
        height = parseInt(container.style('height'), 10),
        aspect = width / height;

    // Add viewBox attribute to set the value to initial size
    // add preserveAspectRatio attribute to specify how to scale
    // and call resize so that svg resizes on page load
    svg.attr('viewBox', `0 0 ${width} ${height}`).
        attr('preserveAspectRatio', 'xMaxYMax').
        call(resize);

    d3.select(window).on('resize.' + container.attr('id'), resize);

    function resize() {
        const targetWidth = parseInt(container.style('width'));
        svg.attr('width', targetWidth);
        svg.attr('height', height);
    }
}

$(".legendpop").popover({
    trigger: "hover",
    placement: "top",
});

$(".legendpop").click(function () {
    $(".legendpop").not(this).popover("hide");
});