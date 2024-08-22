
$(document).ready(function () {
    GetUTCDateTimeRange(2);

});
function CallBackFunction() {
    ShowPageLoading();
    GetReport();
}
function GetReport() {
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
        url: "/Sms/SmsDashboard/GetCampaignEffectivenessData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data != null && data.length > 0) {
                //Calculate Average Click & Delivery rate using d3.js//
                //----------------------------------//
                const avgClickRate = Math.round(d3.mean(data, function (d) {
                    return d.clickrate;
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
                    .text("Delivery to Click Rate (DTCR) ");

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
                    .attr("text-anchor", "start")
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
                        .html("<p class='toolCampName mb-0 camptit'>Campaign Name: " + "<span class='d-block tooltempName tempnamtit'>" + d.campaignname + "</span>" + "</p><p class='toolCampName mb-0'>Template Name: " + "<span class='d-block tooltempName'>" + d.templatename + "</span>" + "</p><p class='toolCampName'>Delivery rate: " + "<span class='perctcolblu'>" + d.deliveryrate + "%</span>" + "<br>Click Rate: " + "<span class='perctcolblu'>" + d.clickrate + "%</span>" + "</p><p class='toolCampName m-0 pt-0'>Total Sent: " + "<span class='tooltempName d-block'>" + d.campaignsize + "</span>" + "</p>")
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
                        return x(d.clickrate);
                    })
                    .attr("cy", function (d) {
                        return y(d.deliveryrate);
                    })
                    .attr("r", function (d) {
                        return z(d.campaignsize);
                    })
                    .style("fill", function (d) {
                        var myColor = ["#d35e60", "#e1974c", "#7293cb", "#84ba5b"];
                        if (Math.round(d.deliveryrate) < avgDeliveryRate && Math.round(d.clickrate) < avgClickRate) {
                            return myColor[0];
                        } else if (Math.round(d.deliveryrate) > avgDeliveryRate && Math.round(d.clickrate) < avgClickRate) {
                            return myColor[1];
                        } else if (Math.round(d.deliveryrate) < avgDeliveryRate && Math.round(d.clickrate) > avgClickRate) {
                            return myColor[2];
                        } else if (Math.round(d.deliveryrate) > avgDeliveryRate && Math.round(d.clickrate) > avgClickRate) {
                            return myColor[3];
                        }
                    })
                    // -3- Trigger the functions for hover
                    .on("mouseover", showTooltip)
                    .on("mouseleave", hideTooltip);

                // ---------------------------//
                //       Average line         //
                // ---------------------------//
                var avglinedata_click = [{
                    x: avgClickRate,
                    y: 0
                }, {
                    x: avgClickRate,
                    y: 100
                }];
                var avglinedata_deliver = [{
                    x: 0,
                    y: avgDeliveryRate
                }, {
                    x: 100,
                    y: avgDeliveryRate
                }];

                //-----------------average Clickrate Line----------------------
                var fn_avgclickline = d3.line()
                    .x(function (d, i) {
                        return d.x * width / 100;
                    })
                    .y(function (d, i) {
                        return d.y * height / 100;
                    })

                svg.append("path")
                    .datum(avglinedata_click)
                    .attr("d", fn_avgclickline)
                    .attr("stroke", "lightgrey")
                    .attr("stroke-dasharray", "8,4")
                    .attr("stroke-width", 2)
                svg.append("text")
                    .attr("transform", "translate(" + avgClickRate * width / 100 + ",0) rotate(-90)")
                    .attr("dy", "-0.75em")
                    .attr("font-size", "10")
                    .attr("font-weight", "bolder")
                    .attr("text-anchor", "end")
                    .style("fill", "#a8acbf")
                    .html("Avg. DTCR: " + avgClickRate + "%");
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


