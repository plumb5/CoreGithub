var bounceCategories = [], bounceTotal = [];
var hardMailBounceGraph, mailPerformanceOverTimeGraph;

$(document).ready(function () {
    GetUTCDateTimeRange(2);
});

function CallBackFunction() {
    ShowPageLoading();
    DestroyAllCharts();
    GetMailDashboardCampaignEffectivenessData();
}

function responsivefy(svg) {
    const container = d3.select(svg.node().parentNode),
        width = parseInt(container.style('width'), 10),
        height = parseInt(container.style('height'), 10),
        aspect = width / height;
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

function GetMailDashboardCampaignEffectivenessData() {
    var campaignEffectiveness = { campaignidentifier: "", campaignname: "", templatename: "", openrate: 0, clickrate: 0, campaignsize: 0 };
    var data = [];

    // set the dimensions and margins of the graph
    var chartWidth = d3.select("#ui_div_CampaignEffectiveness")
        .style('width')
        .slice(0, -2),
        chartHeight = d3.select("#ui_div_CampaignEffectiveness")
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
    d3.selectAll("#ui_div_CampaignEffectiveness > *").remove();
    // append the svg object to the body of the page
    var svg = d3.select("#ui_div_CampaignEffectiveness")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(responsivefy)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    $.ajax({
        url: "/Mail/MailDashboard/GetCampaignEffectiveness",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response !== null && response.length > 0) {
                $.each(response, function () {
                    campaignEffectiveness = { campaignidentifier: "", campaignname: "", templatename: "", openrate: 0, clickrate: 0, campaignsize: 0 };
                    campaignEffectiveness.campaignidentifier = this.CampaignIdentifier !== null ? this.CampaignIdentifier : "NA";
                    campaignEffectiveness.campaignname = this.CampaignName !== null ? this.CampaignName : "NA";
                    campaignEffectiveness.templatename = this.TemplateName !== null ? this.TemplateName : "NA";
                    campaignEffectiveness.openrate = parseInt(this.TotalSent) > 0 ? parseInt(Math.round((this.Opened / this.TotalSent) * 100).toFixed(2)) : 0;
                    campaignEffectiveness.clickrate = parseInt(this.Opened) > 0 ? parseInt(Math.round((this.Clicked / this.Opened) * 100).toFixed(2)) : 0;
                    campaignEffectiveness.campaignsize = this.TotalSent;
                    data.push(campaignEffectiveness);
                });

                //Read the data
                //Calculate Average Click & Open rate using d3.js//
                //----------------------------------//
                const avgClickRate = Math.round(d3.mean(data, function (d) {
                    return d.clickrate;
                }));
                const avgOpenRate = Math.round(d3.mean(data, function (d) {
                    return d.openrate;
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
                    .text("Click to Open Rate (CTOR) ");

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
                    .text("Open Rate")
                    .attr("text-anchor", "start")
                    .attr("dy", "-3.5em");
                // Add a scale for bubble size
                var z = d3.scaleSqrt()
                    .domain([1000, 10000000])
                    .range([5, 25]);

                // Add a scale for bubble color
                var myColor = d3.scaleOrdinal()
                    .domain(["Low Clicks & Low Opens", "Low Clicks & High Opens", "High Clicks & Low Opens", "High Clicks & High Opens"])
                    .range(["#ff6358", "#ffd246", "#2d73f5", "#78d237"]);


                // ---------------------------//
                //      TOOLTIP               //
                // ---------------------------//

                var tooltip = d3.select("#ui_div_CampaignEffectiveness")
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
                        .html("<p class='toolCampName mb-0 camptit'>Campaign Name: " + "<span class='d-block tooltempName tempnamtit'>" + d.campaignname + "</span>" + "</p><p class='toolCampName mb-0'>Campaign Identifier: " + "<span class='d-block tooltempName'>" + d.campaignidentifier + "</span>" + "</p><p class='toolCampName mb-0'>Template Name: " + "<span class='d-block tooltempName'>" + d.templatename + "</span>" + "</p><p class='toolCampName'>Open rate: " + "<span class='perctcolblu'>" + d.openrate + "%</span>" + "<br>Click Rate: " + "<span class='perctcolblu'>" + d.clickrate + "%</span>" + "</p><p class='toolCampName m-0 pt-0'>Total Sent: " + "<span class='tooltempName d-block'>" + d.campaignsize + "</span>" + "</p>")
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
                        return y(d.openrate);
                    })
                    .attr("r", function (d) {
                        return z(d.campaignsize);
                    })
                    .style("fill", function (d) {
                        var myColor = ["#d35e60", "#e1974c", "#7293cb", "#84ba5b"];
                        if (Math.round(d.openrate) < avgOpenRate && Math.round(d.clickrate) < avgClickRate) {
                            return myColor[0];
                        } else if (Math.round(d.openrate) > avgOpenRate && Math.round(d.clickrate) < avgClickRate) {
                            return myColor[1];
                        } else if (Math.round(d.openrate) < avgOpenRate && Math.round(d.clickrate) > avgClickRate) {
                            return myColor[2];
                        } else if (Math.round(d.openrate) > avgOpenRate && Math.round(d.clickrate) > avgClickRate) {
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
                var avglinedata_open = [{
                    x: 0,
                    y: avgOpenRate
                }, {
                    x: 100,
                    y: avgOpenRate
                }];

                //-----------------average Clickrate Line----------------------
                var fn_avgclickline = d3.line()
                    .x(function (d, i) {
                        return d.x * width / 100;
                    })
                    .y(function (d, i) {
                        return d.y * height / 100;
                    });

                svg.append("path")
                    .datum(avglinedata_click)
                    .attr("d", fn_avgclickline)
                    .attr("stroke", "lightgrey")
                    .attr("stroke-dasharray", "8,4")
                    .attr("stroke-width", 2);
                svg.append("text")
                    .attr("transform", "translate(" + avgClickRate * width / 100 + ",0) rotate(-90)")
                    .attr("dy", "-0.75em")
                    .attr("font-size", "10")
                    .attr("font-weight", "bolder")
                    .attr("text-anchor", "end")
                    .style("fill", "#a8acbf")
                    .html("Avg. CTOR: " + avgClickRate + "%");
                //-----------------average openrate Line----------------------
                var fn_avgopenline = d3.line()
                    .x(function (d, i) {
                        return d.x * width / 100;
                    })
                    .y(function (d, i) {
                        var tmpx = d.y * height / 100;
                        return height - tmpx;
                    });
                var _avgopnX = width;
                var _avgopnY = avgOpenRate * height / 100;
                _avgopnY = height - _avgopnY;

                svg.append("path")
                    .datum(avglinedata_open)
                    .attr("d", fn_avgopenline)
                    .attr("stroke", "lightgrey")
                    .attr("stroke-dasharray", "8,4")
                    .attr("stroke-width", 2);
                svg.append("text")
                    .attr("transform", "translate(" + _avgopnX + "," + _avgopnY + ")")
                    .attr("dy", "-0.75em")
                    .attr("font-size", "10")
                    .attr("font-weight", "bolder")
                    .attr("text-anchor", "end")
                    .style("fill", "#a8acbf")
                    .html("Avg. Open Rate: " + avgOpenRate + "%");
            }
            GetMailDashboardEngagementData();
        },
        error: ShowAjaxError
    });
}

function GetMailDashboardEngagementData() {
    var CompareFirstData = { TotalSent: 0, TotalOpened: 0, TotalClicked: 0 };
    $.ajax({
        url: "/Mail/MailDashboard/GetEngagementDetails",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response !== null) {
                CompareFirstData.TotalSent = response.TotalSent;
                CompareFirstData.TotalOpened = response.Opened;
                CompareFirstData.TotalClicked = response.Clicked;
            }
            GetOverAllComparisionEngagementData(CompareFirstData);
        },
        error: ShowAjaxError
    });
}

function GetOverAllComparisionEngagementData(CompareFirstData) {
    var CompareSecondData = { TotalSent: 0, TotalOpened: 0, TotalClicked: 0 };
    var from_Date = CalculateDateDifference();
    $.ajax({
        url: "/Mail/MailDashboard/GetEngagementDetails",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'fromDateTime': from_Date, 'toDateTime': FromDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response !== null) {
                CompareSecondData.TotalSent = response.TotalSent;
                CompareSecondData.TotalOpened = response.Opened;
                CompareSecondData.TotalClicked = response.Clicked;
            }
            BindOverAllComparisionEngagementData(CompareFirstData, CompareSecondData);
            GetMailDashboardDeliveryData();
        },
        error: ShowAjaxError
    });
}

function BindOverAllComparisionEngagementData(CompareFirstData, CompareSecondData) {
    var PerCentValue = 0;

    var reportTableTrs = "";
    $("#ui_div_TotalSent").html(reportTableTrs);
    $("#ui_div_TotalOpened").html(reportTableTrs);
    $("#ui_div_TotalClicked").html(reportTableTrs);
    $("#ui_div_OpenRate").html(reportTableTrs);

    PerCentValue = CalculatePercentage(CompareFirstData.TotalSent, CompareSecondData.TotalSent);
    if (CompareFirstData.TotalSent === CompareSecondData.TotalSent || CompareFirstData.TotalSent > CompareSecondData.TotalSent) {
        reportTableTrs = "<div class='countNumb'>" + CompareFirstData.TotalSent + "</div><div class='countper'><i class='icon ion-android-arrow-dropup'></i> <span>" + PerCentValue + "%</span></div>";
    }
    else if (CompareFirstData.TotalSent < CompareSecondData.TotalSent) {
        reportTableTrs = "<div class='countNumb'>" + CompareFirstData.TotalSent + "</div><div class='countper'><i class='icon ion-android-arrow-dropdown'></i> <span>" + PerCentValue + "%</span></div>";
    }
    $("#ui_div_TotalSent").append(reportTableTrs);

    PerCentValue = CalculatePercentage(CompareFirstData.TotalOpened, CompareSecondData.TotalOpened);
    if (CompareFirstData.TotalOpened === CompareSecondData.TotalOpened || CompareFirstData.TotalOpened > CompareSecondData.TotalOpened) {
        reportTableTrs = "<div class='countNumb'>" + CompareFirstData.TotalOpened + "</div><div class='countper'><i class='icon ion-android-arrow-dropup'></i> <span>" + PerCentValue + "%</span></div>";
    }
    else if (CompareFirstData.TotalOpened < CompareSecondData.TotalOpened) {
        reportTableTrs = "<div class='countNumb'>" + CompareFirstData.TotalOpened + "</div><div class='countper'><i class='icon ion-android-arrow-dropdown'></i> <span>" + PerCentValue + "%</span></div>";
    }
    $("#ui_div_TotalOpened").append(reportTableTrs);

    PerCentValue = CalculatePercentage(CompareFirstData.TotalClicked, CompareSecondData.TotalClicked);
    if (CompareFirstData.TotalClicked === CompareSecondData.TotalClicked || CompareFirstData.TotalClicked > CompareSecondData.TotalClicked) {
        reportTableTrs = "<div class='countNumb'>" + CompareFirstData.TotalClicked + "</div><div class='countper'><i class='icon ion-android-arrow-dropup'></i> <span>" + PerCentValue + "%</span></div>";
    }
    else if (CompareFirstData.TotalClicked < CompareSecondData.TotalClicked) {
        reportTableTrs = "<div class='countNumb'>" + CompareFirstData.TotalClicked + "</div><div class='countper'><i class='icon ion-android-arrow-dropdown'></i> <span>" + PerCentValue + "%</span></div>";
    }
    $("#ui_div_TotalClicked").append(reportTableTrs);

    var openRate = parseInt(CompareFirstData.TotalSent) > 0 ? Math.round(CompareFirstData.TotalOpened / CompareFirstData.TotalSent * 100).toFixed(2) : "0";
    if (parseInt(openRate) < 10)
        reportTableTrs = "<div class='progress-bar bg-primary' style='width: 10%;' role='progressbar' aria-valuenow='" + parseInt(openRate) + "' aria-valuemin='0' aria-valuemax='100'>" + parseInt(openRate) + "%</div>";
    else
        reportTableTrs = "<div class='progress-bar bg-primary' style='width: " + parseInt(openRate) + "%;' role='progressbar' aria-valuenow='" + parseInt(openRate) + "' aria-valuemin='0' aria-valuemax='100'>" + parseInt(openRate) + "%</div>";
    $("#ui_div_OpenRate").append(reportTableTrs);
}

function GetMailDashboardDeliveryData() {
    var CompareFirstData = { TotalSent: 0, TotalBounced: 0, TotalUnsubscribed: 0, TotalForwarded: 0 };
    $.ajax({
        url: "/Mail/MailDashboard/GetDeliveryDetails",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response !== null) {
                CompareFirstData.TotalSent = response.TotalSent;
                CompareFirstData.TotalBounced = response.Bounced;
                CompareFirstData.TotalUnsubscribed = response.Unsubscribed;
                CompareFirstData.TotalForwarded = response.Forwarded;
            }
            GetOverAllComparisionDeliveryData(CompareFirstData);
        },
        error: ShowAjaxError
    });
}

function GetOverAllComparisionDeliveryData(CompareFirstData) {
    var CompareSecondData = { TotalSent: 0, TotalBounced: 0, TotalUnsubscribed: 0, TotalForwarded: 0 };
    var from_Date = CalculateDateDifference();
    $.ajax({
        url: "/Mail/MailDashboard/GetDeliveryDetails",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'fromDateTime': from_Date, 'toDateTime': FromDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response !== null) {
                CompareSecondData.TotalSent = response.TotalSent;
                CompareSecondData.TotalBounced = response.Bounced;
                CompareSecondData.TotalUnsubscribed = response.Unsubscribed;
                CompareSecondData.TotalForwarded = response.Forwarded;
            }
            BindOverAllComparisionDeliveryData(CompareFirstData, CompareSecondData);
            GetMailPerformanceOverTime();
        },
        error: ShowAjaxError
    });
}

function BindOverAllComparisionDeliveryData(CompareFirstData, CompareSecondData) {
    var PerCentValue = 0;

    var reportTableTrs = "";
    $("#ui_div_TotalBounced").html(reportTableTrs);
    $("#ui_div_TotalUnsubcribed").html(reportTableTrs);
    $("#ui_div_TotalForwarded").html(reportTableTrs);
    $("#ui_div_DeliveryRate").html(reportTableTrs);
    $("#ui_span_NotDelivered").html("");

    PerCentValue = CalculatePercentage(CompareFirstData.TotalBounced, CompareSecondData.TotalBounced);
    if (CompareFirstData.TotalBounced === CompareSecondData.TotalBounced || CompareFirstData.TotalBounced > CompareSecondData.TotalBounced) {
        reportTableTrs = "<div class='countNumb'>" + CompareFirstData.TotalBounced + "</div><div class='countper'><i class='icon ion-android-arrow-dropup'></i> <span>" + PerCentValue + "%</span></div>";
    }
    else if (CompareFirstData.TotalBounced < CompareSecondData.TotalBounced) {
        reportTableTrs = "<div class='countNumb'>" + CompareFirstData.TotalBounced + "</div><div class='countper'><i class='icon ion-android-arrow-dropdown'></i> <span>" + PerCentValue + "%</span></div>";
    }
    $("#ui_div_TotalBounced").append(reportTableTrs);

    PerCentValue = CalculatePercentage(CompareFirstData.TotalUnsubscribed, CompareSecondData.TotalUnsubscribed);
    if (CompareFirstData.TotalUnsubscribed === CompareSecondData.TotalUnsubscribed || CompareFirstData.TotalUnsubscribed > CompareSecondData.TotalUnsubscribed) {
        reportTableTrs = "<div class='countNumb'>" + CompareFirstData.TotalUnsubscribed + "</div><div class='countper'><i class='icon ion-android-arrow-dropup'></i> <span>" + PerCentValue + "%</span></div>";
    }
    else if (CompareFirstData.TotalUnsubscribed < CompareSecondData.TotalUnsubscribed) {
        reportTableTrs = "<div class='countNumb'>" + CompareFirstData.TotalUnsubscribed + "</div><div class='countper'><i class='icon ion-android-arrow-dropdown'></i> <span>" + PerCentValue + "%</span></div>";
    }
    $("#ui_div_TotalUnsubcribed").append(reportTableTrs);

    PerCentValue = CalculatePercentage(CompareFirstData.TotalForwarded, CompareSecondData.TotalForwarded);
    if (CompareFirstData.TotalForwarded === CompareSecondData.TotalForwarded || CompareFirstData.TotalForwarded > CompareSecondData.TotalForwarded) {
        reportTableTrs = "<div class='countNumb'>" + CompareFirstData.TotalForwarded + "</div><div class='countper'><i class='icon ion-android-arrow-dropup'></i> <span>" + PerCentValue + "%</span></div>";
    }
    else if (CompareFirstData.TotalForwarded < CompareSecondData.TotalForwarded) {
        reportTableTrs = "<div class='countNumb'>" + CompareFirstData.TotalForwarded + "</div><div class='countper'><i class='icon ion-android-arrow-dropdown'></i> <span>" + PerCentValue + "%</span></div>";
    }
    $("#ui_div_TotalForwarded").append(reportTableTrs);

    var deliveryRate = parseInt(CompareFirstData.TotalSent) > 0 ? Math.round(((CompareFirstData.TotalSent - CompareFirstData.TotalBounced) / CompareFirstData.TotalSent) * 100).toFixed(2) : "0";
    if (parseInt(deliveryRate) < 10)
        reportTableTrs = "<div class='progress-bar bg-success' style='width: 10%;' role='progressbar' aria-valuenow='" + parseInt(deliveryRate) + "' aria-valuemin='0' aria-valuemax='100'>" + parseInt(deliveryRate) + "%</div>";
    else
        reportTableTrs = "<div class='progress-bar bg-success' style='width: " + parseInt(deliveryRate) + "%;' role='progressbar' aria-valuenow='" + parseInt(deliveryRate) + "' aria-valuemin='0' aria-valuemax='100'>" + parseInt(deliveryRate) + "%</div>";
    $("#ui_div_DeliveryRate").append(reportTableTrs);

    var bouncedRate = parseInt(CompareFirstData.TotalSent) > 0 ? Math.round((CompareFirstData.TotalBounced / CompareFirstData.TotalSent) * 100).toFixed(2) : "0";
    $("#ui_span_NotDelivered").html(parseInt(bouncedRate) + "% ");
}

function GetMailPerformanceOverTime() {
    $.ajax({
        url: "/Mail/MailDashboard/GetMailPerformanceOverTime",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var GraphItemDate = [];
            var GraphItem = { ShortDate: [], OpenRate: [], ClickRate: [] };
            if (response !== null && response.length > 0) {
                $.each(response, function () {
                    if (duration == 1) {
                        if (ToJavaScriptDateFromNumber(this.SentDate).getDate() == new Date().getDate()) {
                            GraphItemDate.push({ Date: this.SentDate, Count: parseInt((this.Opened / this.TotalSent) * 100), ClickRate: parseInt((this.Clicked / this.TotalSent) * 100) });
                        }
                    } else {
                        GraphItemDate.push({ Date: this.SentDate, Count: parseInt((this.Opened / this.TotalSent) * 100), ClickRate: parseInt((this.Clicked / this.TotalSent) * 100) });
                    }
                });

                GraphItem.ShortDate.length = 0; GraphItem.OpenRate.length = 0; GraphItem.ClickRate.length = 0;
                let datedata = GetDateCountForGraphData(GraphItemDate, FromDateTime, ToDateTime);
                if (datedata != undefined && datedata != null && datedata.length > 0) {
                    for (let i = 0; i < datedata.length; i++) {
                        GraphItem.ShortDate.push(monthDetials[datedata[i].Date.getMonth()] + " " + datedata[i].Date.getDate());
                        if (datedata[i].Count == 0) {
                            GraphItem.OpenRate.push(0);
                            GraphItem.ClickRate.push(0);
                        } else {
                            GraphItem.OpenRate.push(datedata[i].Count);
                            GraphItem.ClickRate.push(datedata[i].ClickRate);
                        }
                    }
                }
            }
            BindMailPerformanceOverTime(GraphItem);
            BindMailEmailsOpenHourOfDay();
            GetMailBouncedCategory();
        },
        error: ShowAjaxError
    });
}

function BindMailPerformanceOverTime(GraphItem) {
    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;
    mailPerformanceOverTimeGraph = new Chart(document.getElementById("ui_canvas_MailOpenRate"), {
        type: 'line',
        data: {
            labels: GraphItem.ShortDate,
            datasets: [{
                data: GraphItem.ClickRate,
                label: "Click Through Rate",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item1'),
                hoverBorderColor: cssvar('--LineChart-BorderColor-Item1'),
                backgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                fill: false
            },
            {
                data: GraphItem.OpenRate,
                label: "Open Rate",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item2'),
                hoverBorderColor: cssvar('--LineChart-BorderColor-Item2'),
                backgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
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
                        callback: function (value) { return value + "%"; }
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

function GetMailBouncedCategory() {
    $.ajax({
        url: "/Mail/MailDashboard/GetMailBouncedCategory",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            bounceCategories = [], bounceTotal = [];
            if (response !== null && response.length > 0) {
                $.each(response, function () {
                    bounceCategories.push(this.Category);
                    bounceTotal.push(this.Total);
                });
            } else {
                bounceCategories = ["Address Related Issues", "Content Related Issues", "Domain Related Issues", "Other Issues"];
                bounceTotal = [0, 0, 0, 0];
            }
            BindMailBouncedCategory();
        },
        error: ShowAjaxError
    });
}

function BindMailBouncedCategory() {
    $("#ui_divHardBounceNoData").addClass("hideDiv");
    $("#ui_canvas_hardBouncedMail").removeClass("hideDiv");

    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    var leadChanWise = document.getElementById("ui_canvas_hardBouncedMail");
    var chart_config = {
        plugins: [ChartDataLabels],
        type: 'doughnut',
        data: {
            labels: bounceCategories,
            datasets: [
                {
                    label: "Population (millions)",
                    //borderColor: [cssvar('--PieChart-BorderColor-Item1'), cssvar('--PieChart-BorderColor-Item2'), cssvar('--PieChart-BorderColor-Item3'), cssvar('--PieChart-BorderColor-Item4')],
                    //hoverBorderColor: [cssvar('--PieChart-BorderColor-Item1'), cssvar('--PieChart-BorderColor-Item2'), cssvar('--PieChart-BorderColor-Item3'), cssvar('--PieChart-BorderColor-Item4')],
                    backgroundColor: [cssvar('--PieChart-BackgroundColor-Item6'), cssvar('--PieChart-BorderColor-Item1'), cssvar('--PieChart-BorderColor-Item2'), cssvar('--PieChart-BorderColor-Item3')],
                    //hoverBackgroundColor: [cssvar('--PieChart-BackgroundColor-Item1'), cssvar('--PieChart-BorderColor-Item2'), cssvar('--PieChart-BorderColor-Item3'), cssvar('--PieChart-BorderColor-Item4')],
                    data: bounceTotal
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

            $("#ui_divHardBounceNoData").removeClass("hideDiv");
            $("#ui_canvas_hardBouncedMail").addClass("hideDiv");
        }
    })
    new Chart(leadChanWise, chart_config);
    HidePageLoading();
}

function BindMailEmailsOpenHourOfDay() {
    $.ajax({
        url: "/Mail/MailDashboard/GetMailEmailsOpenHourOfDay",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            let jsonData = JSON.parse(response);
            let hourdata = [];
            let totalcount = [];
            for (let i = 0; i < jsonData.Table1.length; i++) {
                hourdata.push(jsonData.Table1[i].Hours.toString());
                totalcount.push(jsonData.Table1[i].TotalOpened.toString());
            }

            if (hourdata.length > 0 && totalcount.length > 0) {
                BindGraphEmailsOpenHourOfDay(hourdata, totalcount);
            } else {
                BindGraphEmailsOpenHourOfDay(0, 0);
            }

        },
        error: ShowAjaxError
    });
}


let mailopenhourdaygraph;

function BindGraphEmailsOpenHourOfDay(hourdata, totalcount) {
    // line chart start here
    mailopenhourdaygraph = new Chart(document.getElementById("mailopenhourday"), {
        type: 'line',
        data: {
            labels: hourdata,
            datasets: [{
                data: totalcount,
                label: "By Hour of the day",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item6'),
                backgroundColor: cssvar('--LineChart-BackgroundColor-Item6'),
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
}


function DestroyAllCharts() {
    if (hardMailBounceGraph) {
        hardMailBounceGraph.destroy();
    }

    if (mailPerformanceOverTimeGraph) {
        mailPerformanceOverTimeGraph.destroy();
    }

    if (mailopenhourdaygraph) {
        mailopenhourdaygraph.destroy();
    }
}

$(".legendpop").popover({
    trigger: "hover",
    placement: "top",
});

$(".legendpop").click(function () {
    $(".legendpop").not(this).popover("hide");
});