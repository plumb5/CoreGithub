var barsGroup = null;
var margin = {}, width = 0, height = 0;
var Filtered = 1;
var visitorFlowUtil = {
    BindVisitorFlow: function (Key) {
        $("#ui_exportOrDownload").addClass('hideDiv');
        $.ajax({
            url: "/Analytics/Traffic/BindVisitorsFlow",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'key': Key }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("#userjourneydata").empty();
                if (response != null) {
                    let FirstInteraction = response.Item1;
                    let SecondInteraction = response.Item2;
                    let ThirdInteraction = response.Item3;
                    if ((FirstInteraction != null && FirstInteraction.length > 0) || (SecondInteraction != null && SecondInteraction.length > 0) || (ThirdInteraction != null && ThirdInteraction.length > 0))
                        visitorFlowUtil.BindVisitorFlowChart(FirstInteraction, SecondInteraction, ThirdInteraction);
                    else {
                        $("#userjourneydata").html(`<div class="no-data">There is no data for this view.</div>`);
                    }
                }
                else {
                    $("#userjourneydata").html(`<div class="no-data">There is no data for this view.</div>`);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    BindVisitorFlowChart: function (FirstInteraction, SecondInteraction, ThirdInteraction) {
        var units = "sessions";

        d3.selectAll("#userjourneydata > *").remove();

        var chartWidth = d3.select("#userjourneydata")
            .style('width')
            .slice(0, -2)
        chartWidth = Math.round(Number(chartWidth))

        margin = { top: 15, right: 5, bottom: 5, left: 5 },
            width = chartWidth - margin.left - margin.right,
            height = Math.round(Number(chartWidth * .5)) - margin.top - margin.bottom;

        var formatNumber = d3.format(",.0f"),    // zero decimal places
            format = function (d) { return formatNumber(d) + " " + units; },
            color = d3.scale.category20();

        // append the svg canvas to the page
        var svg = d3.select("#userjourneydata").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Set the sankey diagram properties
        var sankey = d3.sankey()
            .nodeWidth(36)
            .nodePadding(10)
            .size([width, height]);

        var path = sankey.link();
        // define the bars group
        barsGroup = svg.append("g");

        // load the data

        graph = { "nodes": [], "links": [] };
        let distinctNodes = [];

        let graphStep = 1;

        let sankeyJson = [];
        if (FirstInteraction != null && FirstInteraction.length > 0) {
            graphStep++;
            for (let i = 0; i < FirstInteraction.length; i++) {
                if (!(FirstInteraction[i].SourceName.toLowerCase() == FirstInteraction[i].PageName.toLowerCase()))
                    sankeyJson.push(FirstInteraction[i]);
            }
        }

        if (SecondInteraction != null && SecondInteraction.length > 0) {
            graphStep++;
            for (let i = 0; i < SecondInteraction.length; i++) {
                if (!(SecondInteraction[i].SourceName.toLowerCase() == SecondInteraction[i].PageName.toLowerCase()))
                    sankeyJson.push(SecondInteraction[i]);
            }
        }

        if (ThirdInteraction != null && ThirdInteraction.length > 0) {
            graphStep++;
            for (let i = 0; i < ThirdInteraction.length; i++) {
                if (!(ThirdInteraction[i].SourceName.toLowerCase() == ThirdInteraction[i].PageName.toLowerCase()))
                    sankeyJson.push(ThirdInteraction[i]);
            }
        }

        sankeyJson.forEach(function (node, i) {
            var source = { "name": node.SourceName },
                target = { "name": node.PageName };

            if (distinctNodes.indexOf(node.SourceName) == -1) {
                distinctNodes.push(node.SourceName);
                graph.nodes.push(source);
            }

            if (distinctNodes.indexOf(node.PageName) == -1) {
                distinctNodes.push(node.PageName);
                graph.nodes.push(target);
            }

            graph.links.push({
                "source": distinctNodes.indexOf(node.SourceName),
                "target": distinctNodes.indexOf(node.PageName),
                "value": node.Count
            });
        });


        sankey
            .nodes(graph.nodes)
            .links(graph.links)
            .layout(32);

        // add in the links
        var link = svg.append("g").selectAll(".link")
            .data(graph.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", path)
            .style("stroke-width", function (d) { return Math.max(1, d.dy); })
            .sort(function (a, b) { return b.dy - a.dy; });

        // add the link titles
        link.append("title")
            .text(function (d) {
                return d.source.name + " \u2192 " +
                    d.target.name + "\n" + format(d.value);
            });

        // add in the nodes
        var node = svg.append("g").selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .call(d3.behavior.drag()
                .origin(function (d) { return d; })
                .on("dragstart", function () {
                    this.parentNode.appendChild(this);
                })
                .on("drag", dragmove));

        // add the rectangles for the nodes
        node.append("rect")
            .attr("height", function (d) { return d.dy; })
            .attr("width", sankey.nodeWidth())
            .style("fill", function (d) {
                return d.color = color(d.name.replace(/ .*/, ""));
            })
            .style("stroke", function (d) {
                return d3.rgb(d.color).darker(2);
            })
            .append("title")
            .text(function (d) {
                return d.name + "\n" + format(d.value);
            });

        // add in the title for the nodes
        node.append("text")
            .attr("x", -6)
            .attr("y", function (d) { return d.dy / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function (d) { return d.name; })
            .filter(function (d) { return d.x < width / 2; })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");

        function dragmove(d) {
            d3.select(this).attr("transform",
                "translate(" + d.x + "," + (
                    d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
                ) + ")");
            sankey.relayout();
            link.attr("d", path);
        }

        visitorFlowUtil.renderLabels(graphStep);

    },
    renderLabels: function (graphStep) {
        let steps = [];
        switch (graphStep) {
            case 2:
                steps = [{ "name": "Origin", "label": "Origin" }, { "name": "Landing Page", "label": "Landing Page" }];
                break;
            case 3:
                steps = [{ "name": "Origin", "label": "Origin" }, { "name": "Landing Page", "label": "Landing Page" }, { "name": "First Interaction", "label": "First Interaction" }];
                break;
            case 4:
                steps = [{ "name": "Origin", "label": "Origin" }, { "name": "Landing Page", "label": "Landing Page" }, { "name": "First Interaction", "label": "First Interaction" }, { "name": "Second Interaction", "label": "Second Interaction" }];
                break;
        }

        // create rect elements to store category labels
        let bars = barsGroup.selectAll('.label')
            .data(steps);

        // Enter
        bars
            .enter()
            .append('g')
            .attr('class', 'label');
        bars
            .append('rect')
            .attr('class', 'bar')
            .attr('height', function (d) {
                return height;
            });
        bars
            .append("text")
            .attr("dy", ".35em")
            .attr("transform", null);
        bars
            .select('.bar')
            .style("stroke", "Silver")
            .style('fill', 'white')
            .style("stroke-width", 1)
            .transition()
            .duration(750)
            .attr('width', function (d, i) {
                return width / graphStep;
            })
            .attr('x', function (d, i) {
                return width / graphStep * i;
            })
        bars
            .select('text')
            .attr('y', -margin.top + 5) // 6 seems to be a good number for font size
            .attr('x', function (d, i) {
                return width / graphStep * i + (width / graphStep) / 2.;
            })
            .attr("text-anchor", "start")
            .style('fill', 'CornflowerBlue')
            .style('font-weight', 'bold')

            .text(function (d) {
                return d.label;
            });
        bars.exit().remove();
        return bars;
    }
};


function CallBackFunction() {
    ShowPageLoading();
    FilterBy(Filtered);
}

$(document).ready(() => {
    ShowPageLoading();
    $(".dropdown-item.m-p-h").addClass("hideDiv");
    GetUTCDateTimeRange(2);
});

function FilterBy(source) {
    ShowPageLoading();
    switch (source) {
        case 1:
            Filtered = 1;
            visitorFlowUtil.BindVisitorFlow("Source");
            break;
        case 2:
            Filtered = 2;
            visitorFlowUtil.BindVisitorFlow("Country");
            break;
        case 3:
            Filtered = 3;
            visitorFlowUtil.BindVisitorFlow("City");
            break;
    }
}
$(".startwith a.dropdown-item").click(function () {
    let flwstartwithval = $(this).text();
    $(".addstartfiltr span").html("Start with " + flwstartwithval);
    $(".addstartfiltr").addClass("active");
});