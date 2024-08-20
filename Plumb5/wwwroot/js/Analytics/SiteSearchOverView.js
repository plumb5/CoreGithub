
$(document).ready(function () {
    //CheckConfiguration();
    GetUTCDateTimeRange(2);
});

function CheckConfiguration() {
    $.ajax({
        url: "/Analytics/SiteSearchOverView/IsDataExists",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != undefined && response != null && response.returnVal == 1) {
                $("#ui_sectionSiteSearchDefault").addClass('hideDiv');
                $("#ui_sectionSiteSearchOverView").removeClass('hideDiv');
                GetUTCDateTimeRange(2);
            } else {
                $("#ui_sectionSiteSearchOverView").addClass('hideDiv');
                $("#ui_sectionSiteSearchDefault").removeClass('hideDiv');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;

    GetOverViewGraphDetails();
}

function GetOverViewGraphDetails() {
    $.ajax({
        url: "/Analytics/SiteSearchOverView/GetOverViewGraphDetails",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindOverViewGraphDetails,
        error: ShowAjaxError
    });
}

function BindOverViewGraphDetails(response) {
    var GraphItem = { SearchedDate: [], UniqueSearch: [], SessionsWithSearch: [] };
    if (response != undefined && response != null && response.Table != undefined && response.Table != null && response.Table.length > 0) {
        $.each(response.Table, function () {
            var currentDateData = ConvertDateObjectToDateTime(this.SearchedDate);
            var eachDate = monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate();

            GraphItem.SearchedDate.push(eachDate);
            GraphItem.UniqueSearch.push(this.UniqueSearch);
            GraphItem.SessionsWithSearch.push(this.SessionsWithSearch);
        });
    }
    BindOverViewGraph(GraphItem);
    GetTopSearchedPageDetails();
}

var OverViewChart;

function BindOverViewGraph(GraphItem) {
    if (OverViewChart) {
        OverViewChart.destroy();
    }

    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    // line chart start here
    OverViewChart = new Chart(document.getElementById("sitesearch"), {
        type: 'line',
        data: {
            labels: GraphItem.SearchedDate,
            datasets: [{
                data: GraphItem.SessionsWithSearch,
                label: "Sessions with searches",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item1'),
                hoverBorderColor: cssvar('--LineChart-BorderColor-Item1'),
                backgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                fill: true
            },
            {
                data: GraphItem.UniqueSearch,
                label: "Unique Searches",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item2'),
                hoverBorderColor: cssvar('--LineChart-BorderColor-Item2'),
                backgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
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

function GetTopSearchedPageDetails() {
    $.ajax({
        url: "/Analytics/SiteSearchOverView/GetTopSearchedPage",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindTopSearchedPageDetails,
        error: ShowAjaxError
    });
}

function BindTopSearchedPageDetails(response) {
    var GraphItem = { PageUrl: [], SearchCount: [] };
    if (response != undefined && response != null && response.Table != undefined && response.Table != null && response.Table.length > 0) {
        $.each(response.Table, function () {
            GraphItem.PageUrl.push(this.PageUrl);
            GraphItem.SearchCount.push(this.SearchCount);
        });
    }
    BindTopSearchedPageGraph(GraphItem);
    GetTopSearchedTermDetails();
}

var TopSearchChart;

function BindTopSearchedPageGraph(GraphItem) {

    if (TopSearchChart) {
        TopSearchChart.destroy();
    }

    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    TopSearchChart = new Chart(document.getElementById("topfivesearch"), {
        plugins: [ChartDataLabels],
        type: 'horizontalBar',
        data: {
            labels: GraphItem.PageUrl,
            datasets: [{
                data: GraphItem.SearchCount,
                label: "No. of Searches",
                borderWidth: 1,
                borderColor: [cssvar('--BarChart-BorderColor-Item1'), cssvar('--BarChart-BorderColor-Item2'), cssvar('--BarChart-BorderColor-Item3'), cssvar('--BarChart-BorderColor-Item4'), cssvar('--BarChart-BorderColor-Item5')],
                hoverBorderColor: [cssvar('--BarChart-BorderColor-Item1'), cssvar('--BarChart-BorderColor-Item2'), cssvar('--BarChart-BorderColor-Item3'), cssvar('--BarChart-BorderColor-Item4'), cssvar('--BarChart-BorderColor-Item5')],
                backgroundColor: [cssvar('--BarChart-BackgroundColor-Item1'), cssvar('--BarChart-BackgroundColor-Item2'), cssvar('--BarChart-BackgroundColor-Item3'), cssvar('--BarChart-BackgroundColor-Item4'), cssvar('--BarChart-BackgroundColor-Item5')],
                hoverBackgroundColor: [cssvar('--BarChart-BackgroundColor-Item1'), cssvar('--BarChart-BackgroundColor-Item2'), cssvar('--BarChart-BackgroundColor-Item3'), cssvar('--BarChart-BackgroundColor-Item4'), cssvar('--BarChart-BackgroundColor-Item5')],
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
            plugins: {
                datalabels: {
                    color: '#7c7c7c',
                    align: 'end',
                    anchor: 'end',
                    font: {
                        size: 10,
                    }
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

function GetTopSearchedTermDetails() {
    $.ajax({
        url: "/Analytics/SiteSearchOverView/GetTopSearchedTerm",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindTopSearchedTermDetails,
        error: ShowAjaxError
    });
}

function BindTopSearchedTermDetails(response) {
    var GraphItem = {};
    if (response != undefined && response != null && response.Table != undefined && response.Table != null && response.Table.length > 0) {
        $.each(response.Table, function () {
            let tmpWrd = this.SearchedData.replaceAll("%20", " ");
            GraphItem[tmpWrd] = this.SearchCount;
        });
    }
    console.log(JSON.stringify(GraphItem));
    BindTopSearchedTermGraph(GraphItem);
    HidePageLoading();
}

var TopSearchTermChart;

function BindTopSearchedTermGraph(GraphItem) {
    // D3 word cloud

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

    var svg_location = "#wordcloud";
    var width = d3.select(svg_location)
        .style('width').slice(0, -2);

    var height = d3.select(svg_location)
        .style('height').slice(0, -2);

    var fill = d3.scale.category20c();

    data = GraphItem;
    //d3.json(GraphItem, function (data) {
    var word_entries = d3.entries(data);
    var xScale = d3.scale.linear()
        .domain([0, d3.max(word_entries, function (d) {
            return d.value;
        })
        ])
        .range([12, 24]);

    d3.layout.cloud().size([width, height])
        .timeInterval(20)
        .words(word_entries)
        .fontSize(function (d) { return xScale(+d.value); })
        .text(function (d) { return d.key; })
        .rotate(function () { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .on("end", draw)
        .start();

    function draw(words) {
        d3.select(svg_location).select("svg").remove();
        d3.select(svg_location).append("svg")
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMaxYMax')
            .call(responsivefy)
            .append("g")
            .attr("transform", "translate(" + [width >> 1, height >> 1] + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) { return xScale(d.value) + "px"; })
            .style("font-family", "Impact")
            .style("fill", function (d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.key; });
    }

    d3.layout.cloud().stop();

    //});
}