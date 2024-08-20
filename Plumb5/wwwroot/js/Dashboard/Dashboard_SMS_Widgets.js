//************************************************ SMS WIDGETS STARTS *****************************************************************
//SMS Effectiveness chart *******************************
function CreateSMSEffectivenessBubble(chart_divid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();
    var campaignEffectiveness = { campaignname: "", templatename: "", deliveryrate: 0, clickrate: 0, campaignsize: 0 };
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
     //append the svg object to the body of the page
    var svg = d3version4.select("#" + chart_divid)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(responsivefyv4)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    $.ajax({
        url: "/Dashboard/DashboardOverview/GetCampaignEffectivenessData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            $.each(response, function () {
                campaignEffectiveness = { campaignname: "", templatename: "", deliveryrate: 0, clickrate: 0, campaignsize: 0 };
               
                campaignEffectiveness.campaignname = this.campaignname;
                campaignEffectiveness.templatename = this.templatename;
                campaignEffectiveness.deliveryrate = parseInt(this.TotalSent) > 0 ? parseInt(Math.round((this.TotalDelivered / this.TotalSent) * 100).toFixed(2)) : 0;
                campaignEffectiveness.clickrate = parseInt(this.TotalSent) > 0 ? parseInt(Math.round((this.TotalClicked / this.TotalSent) * 100).toFixed(2)) : 0;
                campaignEffectiveness.campaignsize = this.TotalSent;
                data.push(campaignEffectiveness);
            });
            //if (data != null && data.length > 0) {

                //Calculate Average Click & Delivery rate using d3version4.js//
                //----------------------------------//
                const avgClickRate = Math.round(d3version4.mean(data, function (d) {
                    return d.clickrate
                }));
                const avgDeliveryRate = Math.round(d3version4.mean(data, function (d) {
                    return d.deliveryrate
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
                    .text("Delivery to Click Rate (DTCR) ")

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
                    .text("Delivery Rate")
                    .attr("text-anchor", "middle") //recently changed from start to middle
                    .attr("dy", "-3.5em")
                // Add a scale for bubble size
                var z = d3version4.scaleSqrt()
                    .domain([1000, 10000000])
                    .range([5, 25]);

                // Add a scale for bubble color
                var myColor = d3version4.scaleOrdinal()
                    .domain(["Low Delivery & Low Clicks", "Low Clicks & High Delivery", "High Clicks & Low Delivery", "High Clicks & High Delivery"])
                    .range(["#ff6358", "#ffd246", "#2d73f5", "#78d237"]);


                // ---------------------------//
                //      TOOLTIP               //
                // ---------------------------//

                var tooltip = d3version4.select("#" + chart_divid)
                    .append("div")
                    .style("opacity", 0)
                    .attr("id", "dv_tltp")
                    .attr("class", "tooltip")
                    .style("left", "0px")
                    .style("top", "0px")



                // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
                var showTooltip = function (d) {
                    let contpos = $("#" + chart_divid).offset();

                    var Mx = d3version4.mouse(this)[0] < 0 ? 0 : d3version4.mouse(this)[0];
                    var My = d3version4.mouse(this)[1] < 0 ? 0 : d3version4.mouse(this)[1];
                    tooltip
                        .transition()
                        .duration(2000)
                    tooltip
                        .style("opacity", 1)
                        .html("<p class='toolCampName mb-0 camptit'>Campaign Name: " + "<span class='d-block tooltempName tempnamtit'>" + d.campaignname + "</span>" + "</p><p class='toolCampName mb-0'>Template Name: " + "<span class='d-block tooltempName'>" + d.templatename + "</span>" + "</p><p class='toolCampName'>Delivery rate: " + "<span class='perctcolblu'>" + d.deliveryrate + "%</span>" + "<br>Click Rate: " + "<span class='perctcolblu'>" + d.clickrate + "%</span>" + "</p><p class='toolCampName m-0 pt-0'>Total Sent: " + "<span class='tooltempName d-block'>" + d.campaignsize + "</span>" + "</p>");

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
                var avglinedata_deliver = [{
                    x: 0,
                    y: avgDeliveryRate
                }, {
                    x: 100,
                    y: avgDeliveryRate
                }];

                //-----------------average Clickrate Line----------------------
                var fn_avgclickline = d3version4.line()
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
                .attr("stroke-width", 2);
            var clkrate = isNaN(avgClickRate) == true ? '' : "Avg. DTCR: " + avgClickRate + "%";
                svg.append("text")
                    .attr("transform", "translate(" + avgClickRate * width / 100 + ",0) rotate(-90)")
                    .attr("dy", "1.5em") // Recently changed from -0.75 to 1.5em
                    .attr("font-size", "10")
                    .attr("font-weight", "bolder")
                    .attr("text-anchor", "end")
                    .style("fill", "#a8acbf")
                    .html(clkrate);
                //-----------------average deliverrate Line----------------------
                var fn_avgdeliverline = d3version4.line()
                    .x(function (d, i) {
                        return d.x * width / 100;
                    })
                    .y(function (d, i) {
                        var tmpx = d.y * height / 100
                        return height - tmpx;
                    })
                var _avgdelX = width;
                var _avgdelY = avgDeliveryRate * height / 100;
                _avgdelY = height - _avgdelY;

            svg.append("path")
                .datum(avglinedata_deliver)
                .attr("d", fn_avgdeliverline)
                .attr("stroke", "lightgrey")
                .attr("stroke-dasharray", "8,4")
                .attr("stroke-width", 2);
            var delvryrate = isNaN(avgDeliveryRate) == true ? '' : "Avg. Delivery Rate: " + avgDeliveryRate + "%";
                svg.append("text")
                    .attr("transform", "translate(" + _avgdelX + "," + _avgdelY + ")")
                    .attr("dy", "-0.75em")
                    .attr("font-size", "10")
                    .attr("font-weight", "bolder")
                    .attr("text-anchor", "end")
                    .style("fill", "#a8acbf")
                    .html(delvryrate);
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
// SMS Engagement Rate Chart ****************************
function CreateSmsEngagementRateChart(divId) {
    var SmsEngagementRateHtmlContent = "<div class='engageWrap'>" +
        "<div class='card card-sales'>" +
        "<h6 class='slim-card-title tx-primary mb-3'>Engagement</h6>" +
        "<div class='row'>" +
        "<div class='col'>" +
        "<label class='tx-12'>Clicked</label>" +
        "<div class='countsWrap'>" +
        "<div class='countNumb' id='SmsClickedCount'></div>" +
        "<div class='countper'><i class='icon ion-android-arrow-dropdown'></i> <span id='SmsClickedPercentage'></span></div>" +
        "</div>" +
        "</div>" +
        "<div class='col'>" +
        "<label class='tx-12'>Opted-out</label>" +
        "<div class='countsWrap'>" +
        "<div class='countNumb' id='SmsOptedoutCount'></div>" +
        "<div class='countper'><i class='icon ion-android-arrow-dropdown'></i> <span id='SmsOptedoutPercentage'></span></div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "<div class='progress mg-b-5 mt-2'>" +
        "<div class='progress-bar bg-primary wd-50p' role='progressbar' aria-valuenow='50' aria-valuemin='0' aria-valuemax='100' id='SmsClickRatePercentage'></div>" +
        "</div>" +
        "<p class='tx-12 mg-b-0'>Click Rate</p>" +
        "</div>" +
        "</div>";
    $('#' + divId).html(SmsEngagementRateHtmlContent);
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    $.ajax({
        url: "/Dashboard/DashboardOverview/GetSmsDashboardEngagementData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            GetPastSmsEngagementRateData(response);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function GetPastSmsEngagementRateData(CurrentEngagementData) {
    var from_Date = CalculateDateDifference();
    $.ajax({
        url: "/Dashboard/DashboardOverview/GetSmsDashboardEngagementData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': from_Date, 'todate': FromDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (PastEngagementData) {
            BindSmsEngagementRateChart(CurrentEngagementData, PastEngagementData);
            
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
    
}
function BindSmsEngagementRateChart(CurrentEngagementData, PastEngagementData) {
    var ClickedComparisonPercentage = 0, OptedOutComparisonPercentage = 0, ClickedRatePercentage = 0;
    if (CurrentEngagementData != undefined && CurrentEngagementData != null) {
        ClickedRatePercentage = Math.round((CurrentEngagementData[0].TotalClicked / CurrentEngagementData[0].TotalSent) * 100).toFixed(0);
        ClickedRatePercentage = isNaN(ClickedRatePercentage) ? 0 : ClickedRatePercentage;
        $('#SmsClickedCount').text(CurrentEngagementData[0].TotalClicked);
        $('#SmsOptedoutCount').text(CurrentEngagementData[0].OptedOut);
        $('#SmsClickRatePercentage').text(ClickedRatePercentage + '%');
        //$('#ClickRatePercentage').removeClass().addClass('progress-bar bg-primary wd-'+ClickedRatePercentage+'p');
    }
    if (CurrentEngagementData != undefined && CurrentEngagementData != null && PastEngagementData != undefined && PastEngagementData != null) {

        ClickedComparisonPercentage = Math.round(CalculatePercentage(CurrentEngagementData[0].TotalClicked, PastEngagementData[0].TotalClicked));
        OptedOutComparisonPercentage = Math.round(CalculatePercentage(CurrentEngagementData[0].OptedOut, PastEngagementData[0].OptedOut));
        $('#SmsClickedPercentage').text(ClickedComparisonPercentage + '%');
        $('#SmsOptedoutPercentage').text(OptedOutComparisonPercentage + '%');

    }
    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();
}
// SMS Delivery Rate Chart ******************************
function CreateSmsDeliveryRateChart(divId) {
    var SmsDeliveryHtmlContent = "<div class='delivWrap mt-2'>" +
        "<div class='card card-sales'>" +
        "<h6 class='slim-card-title tx-success mb-10'>Delivery</h6>" +
        "<div class='row'>" +
        "<div class='col'>" +
        "<label class='tx-12'>Sent</label>" +
        "<div class='countsWrap'>" +
        "<div class='countNumb' id='SmsSendCount'></div>" +
        "<div class='countper'><i class='icon ion-android-arrow-dropdown'></i> <span id='SmsSentPercentage'>%</span></div>" +
        "</div>" +
        "</div>" +
        "<div class='col'>" +
        "<label class='tx-12'>Delivered</label>" +
        "<div class='countsWrap'>" +
        "<div class='countNumb' id='SmsDeliveredCount'></div>" +
        "<div class='countper'><i class='icon ion-android-arrow-dropdown'></i> <span id='SmsDeliveredPercentage'>%</span></div>" +
        "</div>" +
        "</div>" +
        "<div class='col'>" +
        "<label class='tx-12'>Bounced</label>" +
        "<div class='countsWrap'>" +
        "<div class='countNumb' id='SmsBouncedCount'></div>" +
        "<div class='countper'><i class='icon ion-android-arrow-dropdown'></i> <span id='SmsBouncedPercentage'>%</span></div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "<div class='progress mg-b-5 mt-2'>" +
        "<div class='progress-bar bg-success wd-50p' role='progressbar' aria-valuenow='75' aria-valuemin='0' aria-valuemax='100' id='SmsDeliverRatePercentage'>%</div>" +
        "</div>" +
        "<p class='tx-12 mg-b-0'>Delivery Rate</p>" +
        "</div>" +
        "</div>";
    $('#' + divId).html(SmsDeliveryHtmlContent);
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    $.ajax({
        url: "/Dashboard/DashboardOverview/GetSmsDashboardDeliveryData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: BindSmsDeliverRateChart,
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindSmsDeliverRateChart(CurrentDeliverData) {
    var from_Date = CalculateDateDifference();
    $.ajax({
        url: "/Dashboard/DashboardOverview/GetSmsDashboardDeliveryData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': from_Date, 'todate': FromDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (PastDeliverData) {
            var SentComparisonPercentage = 0, DeliveredComparisonPercentage = 0, BouncedComparisonPercentage = 0, DeliveryRatePercentage = 0;
            if (CurrentDeliverData != undefined && CurrentDeliverData != null) {
                DeliveryRatePercentage = Math.round((CurrentDeliverData[0].TotalDelivered / CurrentDeliverData[0].TotalSent) * 100).toFixed(0);
                DeliveryRatePercentage = isNaN(DeliveryRatePercentage) ? 0 : DeliveryRatePercentage;
                $('#SmsSendCount').text(CurrentDeliverData[0].TotalSent);
                $('#SmsDeliveredCount').text(CurrentDeliverData[0].TotalDelivered);
                $('#SmsBouncedCount').text(CurrentDeliverData[0].Bounced);
                $('#SmsDeliverRatePercentage').text(DeliveryRatePercentage + '%');
                //$('#DeliverRatePercentage').removeClass().addClass('progress-bar bg-success wd-' + DeliveryRatePercentage + 'p');
            }
            if (CurrentDeliverData != undefined && CurrentDeliverData != null && PastDeliverData != undefined && PastDeliverData != null) {

                SentComparisonPercentage = Math.round(CalculatePercentage(CurrentDeliverData[0].TotalSent, PastDeliverData[0].TotalSent));
                DeliveredComparisonPercentage = Math.round(CalculatePercentage(CurrentDeliverData[0].TotalDelivered, PastDeliverData[0].TotalDelivered));
                BouncedComparisonPercentage = Math.round(CalculatePercentage(CurrentDeliverData[0].Bounced, PastDeliverData[0].Bounced));
                $('#SmsSentPercentage').text(SentComparisonPercentage + '%');
                $('#SmsDeliveredPercentage').text(DeliveredComparisonPercentage + '%');
                $('#SmsBouncedPercentage').text(BouncedComparisonPercentage + '%');

            }
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
//SMS Performance Over Time Chart ***********************
function CreateSmsPerformanceOverTimeChart(canvasid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    $.ajax({
        url: "/Dashboard/DashboardOverview/GetSmsPerformanceOverTimeData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            BindSMSPerformanceOverTimeChart(response, canvasid);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowLoadingImageBasedOnCount();
            ShowAjaxError(error);
        }
    });
}
function BindSMSPerformanceOverTimeChart(response, canvasid) {
    var GraphItemDate = [];
    var GraphItem = { ShortDate: [], DeliverRate: [], ClickRate: [] };
    $.each(response, function () {
        var currentDateData = ConvertDateObjectToDateTime(this.SentDate);
        if (duration == 1) {
            if (ToJavaScriptDateFromNumber(currentDateData).getDate() == new Date().getDate()) {
                GraphItemDate.push({ Date: currentDateData, Count: Math.round((this.TotalDelivered / this.TotalSent) * 100), ClickRate: Math.round((this.TotalClicked / this.TotalSent) * 100) });
            }
        } else {
            GraphItemDate.push({ Date: this.SentDate, Count: Math.round((this.TotalDelivered / this.TotalSent) * 100), ClickRate: Math.round((this.TotalClicked / this.TotalSent) * 100) });
        }
    });
    GraphItem.ShortDate.length = 0; GraphItem.DeliverRate.length = 0; GraphItem.ClickRate.length = 0;
    let datedata = GetDateCountForGraphData(GraphItemDate, FromDateTime, ToDateTime);
    if (datedata != undefined && datedata != null && datedata.length > 0) {
        for (let i = 0; i < datedata.length; i++) {
            GraphItem.ShortDate.push(monthDetials[datedata[i].Date.getMonth()] + " " + datedata[i].Date.getDate());
            if (datedata[i].Count == 0) {
                GraphItem.DeliverRate.push(0);
                GraphItem.ClickRate.push(0);
            } else {
                GraphItem.DeliverRate.push(datedata[i].Count);
                GraphItem.ClickRate.push(datedata[i].ClickRate);
            }
        }
    }
    new Chart(document.getElementById(canvasid), {
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
                data: GraphItem.ClickRate,
                label: "Click Rate",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item2'),
                backgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
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
    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();
}
//************************************************ SMS WIDGETS ENDS *****************************************************************