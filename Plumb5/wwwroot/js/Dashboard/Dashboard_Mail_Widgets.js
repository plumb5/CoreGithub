//************************************************* MAIL WIDGETS STARTS *************************************************************
// Mail Campaign Effectiveness ****************************
function CreateMailEffectivenessBubble(chart_divid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    var campaignEffectiveness = { campaignidentifier: "", campaignname: "", templatename: "", openrate: 0, clickrate: 0, campaignsize: 0 };
    var data = [];
    var chartWidth = d3version4.select("#" + chart_divid)
        .style('width')
        .slice(0, -2),
        chartHeight = d3version4.select("#" + chart_divid)
            .style('height')
            .slice(0, -2);

    var margin = {
        top: 70,
        right: 70,
        bottom: 85,
        left: 50
    },
        width = chartWidth - margin.left - margin.right,
        height = chartHeight - margin.top - margin.bottom;

    d3version4.selectAll("#" + chart_divid + " > *").remove();
    // append the svg object to the body of the page
    var svg = d3version4.select("#" + chart_divid)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(responsivefyv4)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    //Read the data
    $.ajax({
        url: "/Dashboard/DashboardOverview/GetCampaignEffectiveness",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
           // if (response !== null && response.length > 0) {
                $.each(response, function () {
                    campaignEffectiveness = { campaignidentifier: "", campaignname: "", templatename: "", openrate: 0, clickrate: 0, campaignsize: 0 };
                    campaignEffectiveness.campaignidentifier = this.CampaignIdentifier;
                    campaignEffectiveness.campaignname = this.CampaignName;
                    campaignEffectiveness.templatename = this.TemplateName;
                    campaignEffectiveness.openrate = parseInt(this.TotalSent) > 0 ? parseInt(Math.round((this.Opened / this.TotalSent) * 100).toFixed(2)) : 0;
                    campaignEffectiveness.clickrate = parseInt(this.Opened) > 0 ? parseInt(Math.round((this.Clicked / this.Opened) * 100).toFixed(2)) : 0;
                    campaignEffectiveness.campaignsize = this.TotalSent;
                    data.push(campaignEffectiveness);
                });

                //Calculate Average Click & Open rate using d3version4.js//
                //----------------------------------//
                const avgClickRate = Math.round(d3version4.mean(data, function (d) {
                    return d.clickrate
                }));
                const avgOpenRate = Math.round(d3version4.mean(data, function (d) {
                    return d.openrate
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
                    .text("")

                // ---------------------------//
                //       AXIS  AND SCALE      //
                // ---------------------------//

                // Add X axis
                var x = d3version4.scaleLinear()
                    .domain([0, 100])
                    .range([0, width]);
                svg.append("g")
                    .attr("transform", "translate(0," + (height + 10) + ")")
                    .call(d3version4.axisBottom(x)
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
                    .text("Click to Open Rate (CTOR) ")

                // Add Y axis
                var y = d3version4.scaleLinear()
                    .domain([0, 100])
                    .range([height, 0]);
                svg.append("g")
                    .attr("transform", "translate(-10,0)")
                    .call(d3version4.axisLeft(y)
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
                    .attr("text-anchor", "middle")//Recently changed from start to middle
                    .attr("dy", "-3.5em")
                // Add a scale for bubble size
                var z = d3version4.scaleSqrt()
                    .domain([1000, 10000000])
                    .range([5, 25]);

                // Add a scale for bubble color
                var myColor = d3version4.scaleOrdinal()
                    .domain(["Low Clicks & Low Opens", "Low Clicks & High Opens", "High Clicks & Low Opens", "High Clicks & High Opens"])
                    .range(["#ff6358", "#ffd246", "#2d73f5", "#78d237"]);


                // ---------------------------//
                //      TOOLTIP               //
                // ---------------------------//

                var tooltip = d3version4.select("div#" + chart_divid)
                    .append("div")
                    .style("opacity", 0)
                    .attr("id", "dv_tltp")
                    .attr("class", "tooltip")
                    .style("left", "0px")
                    .style("top", "0px")

                // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
                var showTooltip = function (d) {
                    var Mx = d3version4.mouse(this)[0] < 0 ? 0 : d3version4.mouse(this)[0];
                    var My = d3version4.mouse(this)[1] < 0 ? 0 : d3version4.mouse(this)[1];
                    tooltip
                        .transition()
                        .duration(2000)
                    tooltip
                        .style("opacity", 1)
                        .html("<p class='toolCampName mb-0 camptit'>Campaign Name: " + "<span class='d-block tooltempName tempnamtit'>" + d.campaignname + "</span>" + "</p><p class='toolCampName mb-0'>Template Name: " + "<span class='d-block tooltempName'>" + d.templatename + "</span>" + "</p><p class='toolCampName'>Open rate: " + "<span class='perctcolblu'>" + d.openrate + "%</span>" + "<br>Click Rate: " + "<span class='perctcolblu'>" + d.clickrate + "%</span>" + "</p><p class='toolCampName m-0 pt-0'>Total Sent: " + "<span class='tooltempName d-block'>" + d.campaignsize + "</span>" + "</p>");

                    let tooltipWid = $('#dv_tltp').width() / 2 + Mx;
                    let tooltipeHgt = $('#dv_tltp').height() / 2 + My;
                    if (tooltipWid > width) { Mx = width - ($('#dv_tltp').width() / 3); }
                    if (tooltipeHgt > height) { My = height - ($('#dv_tltp').height() / 3); }
                    tooltip.style("left", (Mx) + "px")
                        .style("top", (My) + "px");
                }

                var hideTooltip = function (d) {
                    tooltip
                        .transition()
                        .duration(200)
                        .style("opacity", 0)
                }


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
                        return "bubbles " + d.campaignname
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
                    .on("mouseleave", hideTooltip)

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
                var fn_avgclickline = d3version4.line()
                    .x(function (d, i) {
                        return d.x * width / 100;
                    })
                    .y(function (d, i) {
                        return d.y * height / 100;
                    })
            var clkrate = isNaN(avgClickRate) == true ? '' : "Avg. CTOR: " + avgClickRate + "%";
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
                    .html(clkrate);
                //-----------------average openrate Line----------------------
                var fn_avgopenline = d3version4.line()
                    .x(function (d, i) {
                        return d.x * width / 100;
                    })
                    .y(function (d, i) {
                        var tmpx = d.y * height / 100
                        return height - tmpx;
                    })
                var _avgopnX = width;
                var _avgopnY = avgOpenRate * height / 100;
               _avgopnY = height - _avgopnY;
            var openRate = isNaN(avgOpenRate) == true ? '' : "Avg. Open Rate: " + avgOpenRate + " %";
                svg.append("path")
                    .datum(avglinedata_open)
                    .attr("d", fn_avgopenline)
                    .attr("stroke", "lightgrey")
                    .attr("stroke-dasharray", "8,4")
                    .attr("stroke-width", 2)
                svg.append("text")
                    .attr("transform", "translate(" + _avgopnX + "," + _avgopnY + ")")
                    .attr("dy", "-0.75em")
                    .attr("font-size", "10")
                    .attr("font-weight", "bolder")
                    .attr("text-anchor", "end")
                    .style("fill", "#a8acbf")
                    .html(openRate);//" + avgOpenRate + "
            //}

            LoadingImageCount--;
            NumberOfWidgetsLoaded++; TotalWidget++;
            ShowLoadingImageBasedOnCount();
        },
        error: function (error) {
            LoadingImageCount--;
            ShowAjaxError(error);
            ShowLoadingImageBasedOnCount();
        }
    });

    
}
// Mail Engagement Rate Chart ****************************
function CreateMailEngagementRateChart(divId) {
    var MailEngagementHtmlContent = "<div class='engageWrap'>" +
        "<div class='card card-sales'>" +
        "<h6 class='slim-card-title tx-primary mb-3'>Engagement</h6>" +
        "<div class='row'>" +
        "<div class='col'>" +
        "<label class='tx-12'>Sent</label>" +
        "<div id='ui_div_TotalSent' class='countsWrap'></div>" +
        "</div>" +
        "<div class='col'>" +
        "<label class='tx-12'>Opened</label>" +
        "<div id='ui_div_TotalOpened' class='countsWrap'></div>" +
        "</div>" +
        "<div class='col'>" +
        "<label class='tx-12'>Clicked</label>" +
        "<div id='ui_div_TotalClicked' class='countsWrap'></div>" +
        "</div>" +
        "</div>" +
        "<div id='ui_div_OpenRate' class='progress mg-b-5 mt-2'></div>" +
        "<p class='tx-12 mg-b-0'>Open Rate</p>" +
        "</div>" +
        "</div>";
    $('#' + divId).html(MailEngagementHtmlContent);

    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    var CompareFirstData = { TotalSent: 0, TotalOpened: 0, TotalClicked: 0 };
    $.ajax({
        url: "/Dashboard/DashboardOverview/GetEngagementDetails",
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
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function GetOverAllComparisionEngagementData(CompareFirstData) {
    var CompareSecondData = { TotalSent: 0, TotalOpened: 0, TotalClicked: 0 };
    var from_Date = CalculateDateDifference();
    $.ajax({
        url: "/Dashboard/DashboardOverview/GetEngagementDetails",
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
            BindMailEngagementData(CompareFirstData, CompareSecondData);

        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindMailEngagementData(CompareFirstData, CompareSecondData) {
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

    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();
}
// Mail Performance Over Time Chart ***********************
function CreateMailPerformanceOverTimeChart(canvasid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    $.ajax({
        url: "/Dashboard/DashboardOverView/GetMailPerformanceOverTime",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var sentDate = [], openRate = [], clickRate = [];

            if (response !== null && response.length > 0) {
                $.each(response, function () {
                    sentDate.push($.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.SentDate)));
                    openRate.push(parseInt((this.Opened / this.TotalSent) * 100));
                    clickRate.push(parseInt((this.Clicked / this.TotalSent) * 100));
                });
            }
            BindMailPerformanceOverTimeChart(sentDate, openRate, clickRate, canvasid);

        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });

}
function BindMailPerformanceOverTimeChart(sentDate, openRate, clickRate, canvasid) {
    mailPerformanceOverTimeGraph = new Chart(document.getElementById(canvasid), {
        type: 'line',
        data: {
            labels: sentDate,
            datasets: [{
                data: clickRate,
                label: "Click Through Rate",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item1'),
                hoverBorderColor: cssvar('--LineChart-BorderColor-Item1'),
                backgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                fill: false
            },
            {
                data: openRate,
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
            plugins: {
                datalabels: {
                    display: false
                }
            },
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

    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();
}
// Mail Delivery Rate Chart *******************************
function CreateMailDeliveryRateChart(divId) {
    var MailDeliveryRateChartHtmlContent = "<div class='delivWrap mt-2'>" +
        "<div class='card card-sales'>" +
        "<h6 class='slim-card-title tx-success mb-10'>Delivery</h6>" +
        "<div class='row'>" +
        "<div class='col'>" +
        "<label class='tx-12'>Bounced</label>" +
        "<div id='ui_div_TotalBounced' class='countsWrap'></div>" +
        "</div>" +
        "<div class='col'>" +
        "<label class='tx-12'>Unsubscribed</label>" +
        "<div id='ui_div_TotalUnsubcribed' class='countsWrap'></div>" +
        "</div>" +
        "<div class='col'>" +
        "<label class='tx-12'>Forwarded</label>" +
        "<div id='ui_div_TotalForwarded' class='countsWrap'></div>" +
        "</div>" +
        "</div>" +
        "<div id='ui_div_DeliveryRate' class='progress mg-b-5 mt-2'></div>" +
        "<p class='tx-12 mg-b-0'>Delivery Rate</p>" +
        "</div>" +
        "</div>";
    $('#' + divId).html(MailDeliveryRateChartHtmlContent);

    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    var CompareFirstData = { TotalSent: 0, TotalBounced: 0, TotalUnsubscribed: 0, TotalForwarded: 0 };
    $.ajax({
        url: "/Dashboard/DashboardOverview/GetDeliveryDetails",
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
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function GetOverAllComparisionDeliveryData(CompareFirstData) {
    var CompareSecondData = { TotalSent: 0, TotalBounced: 0, TotalUnsubscribed: 0, TotalForwarded: 0 };
    var from_Date = CalculateDateDifference();
    $.ajax({
        url: "/Dashboard/DashboardOverview/GetDeliveryDetails",
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
            BindMailDeliveryRateChart(CompareFirstData, CompareSecondData);

        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindMailDeliveryRateChart(CompareFirstData, CompareSecondData) {
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

    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();
}
//************************************************ MAIL WIDGETS ENDS *****************************************************************