var xhr;
var DomainName = "", pagename = "", frompage = "", CanvasChart, optiondate = [], getPageviewcount = [], getColors = [], deviceType = 0;
var LeadSource = "";
$(document).ready(function () {
    $('#txt_PageURL').val($.urlParam("page").replaceAll('@@@@', '&').replaceAll(/\p5redirectcontact=/g, 'p5contactid='));
    ExportFunctionName = "PageAnalysisExport";
    RemoveExportDataRange();
    GetUTCDateTimeRange(2);
    setTimeout(ShowPageLoading(), 30000);;
});
function CallBackInnerPaging() {
    CurrentInnerRowCount = 0;
    GetLeadsDetails();
}


function CallBackFunction() {
    pagename = $('#txt_PageURL').val();
    pagename = pagename == 0 ? null : pagename;
    frompage = window.location.href.split('&')[1];
    DomainName = $("#hdDomain").data("domain");
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    //deviceType = 0;
    GetReport();
    setTimeout(ShowPageLoading(), 30000);;
}
function GetReport() {
    GetPageViewUniqueVisitor();
    GetReferSources();
    GetLeadSource();
    GetFrequencyData();
    GetVisitorData();
    $("#timespentsecmain").addClass("hideDiv");
    $("#timetrendsmain").addClass("hideDiv");

}


$("#showtimespentdata").click(function () {

    $("#timespentsecmain").removeClass("hideDiv");
    GetTimeSpentData();
    $(document).scrollTop(500);
    $("#timespentsecmain .box-white").css("border-color", "#dc3545");
    setTimeout(function () {
        $("#timespentsecmain .box-white").css("border-color", "");
    }, 3000);



});
$("#showtimetrendsdata").click(function () {
    $("#timetrendsmain").removeClass("hideDiv");
    GetTimeTrendsData();
    $(document).scrollTop(500);
    $("#timetrendsmain .box-white").css("border-color", "#dc3545");
    setTimeout(function () {
        $("#timetrendsmain .box-white").css("border-color", "");
    }, 3000);


});

$("#overalltabledata").click(function () {
    $(".isnotsortable").empty();
    $(document).scrollTop(900);
    GetCurrentSummaryData();
    $(".isnotsortable").css(
        "background-color",
        "rgba(199, 44, 69, 0.2)"
    )

});






// To Bind Pageviews Vs UniqueVisitors Graphs and below Tables
function GetPageViewUniqueVisitor() {
    ClearGraph();
    xhr = $.ajax({
        url: "/Analytics/Content/BindPageViewUniqueVisitorData",
        type: 'Post', 
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'pagename': pagename, 'devicetype': deviceType }),

        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: BindUniqueVistorPageViewGraph,
        error: ShowAjaxError
    });
    // GetReferSources();

}
function BindUniqueVistorPageViewGraph(response) {
    ShowPageLoading();
    $('#txt_PageURL').val(pagename == null ? "" : pagename);

    $('#graphData').removeClass('hideDiv');
    $("#ui_canvas_PageViewsNoData").addClass("hideDiv");
    var GraphItem = { ShortDate: [], TotalVisit: [], UniquVisitors: [] };
    var GraphItemDate = [];
    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
        $.each(response.Table1, function (m) {
            var currentDateData = ConvertDateObjectToDateTime(this.Date);
            GraphItemDate.push({ Date: currentDateData, Count: this.TotalVisit, UniquVisitors: this.UniquVisitors });
        });

        GraphItem.ShortDate.length = 0; GraphItem.TotalVisit.length = 0; GraphItem.UniquVisitors.length = 0;

        let datedata = GetDateCountForGraphData(GraphItemDate, FromDateTime, ToDateTime);
        if (datedata != undefined && datedata != null && datedata.length > 0) {
            for (let i = 0; i < datedata.length; i++) {
                GraphItem.ShortDate.push(monthDetials[datedata[i].Date.getMonth()] + " " + datedata[i].Date.getDate());
                if (datedata[i].Count == 0) {
                    GraphItem.TotalVisit.push(0);
                    GraphItem.UniquVisitors.push(0);
                } else {
                    GraphItem.TotalVisit.push(datedata[i].Count);
                    GraphItem.UniquVisitors.push(datedata[i].UniquVisitors);
                }
            }
        }
        ShowExportDiv(true);
    } else {
        ShowExportDiv(false);
        setTimeout(ShowPageLoading(), 30000);;
        HidePageLoading();
    }


    if (CanvasChart) {
        CanvasChart.destroy();
    }


    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    // line chart start here
    CanvasChart = new Chart(document.getElementById("graphData"), {
        type: 'line',
        data: {
            labels: GraphItem.ShortDate,
            datasets: [
                {
                    data: GraphItem.UniquVisitors,
                    label: "Unique Visitors",
                    borderWidth: 1.5,
                    borderColor: cssvar('--LineChart-BorderColor-Item1'),
                    pointBorderColor: cssvar('--LineChart-BorderColor-Item1'),
                    hoverBorderColor: cssvar('--LineChart-BorderColor-Item1'),
                    pointHoverBorderColor: cssvar('--LineChart-BorderColor-Item1'),

                    backgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                    hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                    pointBackgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                    pointHoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                    fill: true
                },
                {
                    data: GraphItem.TotalVisit,
                    label: "Page Views",
                    borderWidth: 1.5,
                    borderColor: cssvar('--LineChart-BorderColor-Item2'),
                    pointBorderColor: cssvar('--LineChart-BorderColor-Item2'),
                    hoverBorderColor: cssvar('--LineChart-BorderColor-Item2'),
                    pointHoverBorderColor: cssvar('--LineChart-BorderColor-Item2'),

                    backgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                    hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                    pointBackgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                    pointHoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
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
    setTimeout(ShowPageLoading(), 30000);;
    HidePageLoading();
}



// To Bind Refer Source Graph
function GetReferSources() {
    ShowPageLoading();
    $('#ui_canvas_ReferSourceDataNoData').html('Loading..Please wait');
    xhr = $.ajax({
        url: "/Analytics/Content/BindPieCharts",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'pagename': pagename, 'devicetype': deviceType }),
        
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (response) {
            optiondate.length = 0; getPageviewcount.length = 0;
            $.each(response.Table1, function () {
                optiondate.push(this.Source.replace("Null", "Direct"));
                getPageviewcount.push(this.TotalVisits);
            });
            BindPieGraph();

        },
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }

    });
    setTimeout(ShowPageLoading(), 30000);;
    //GetLeadSource();
}
function BindPieGraph() {
    setTimeout(ShowPageLoading(), 30000);;
    getColors = [];
    $("#ui_canvas_ReferSourceDataNoData").addClass("hideDiv");
    $("#ui_canvas_ReferSourceData").removeClass("hideDiv");
    for (var k = 1; k <= getPageviewcount.length; k++) {
        getColors.push(cssvar("--PieChart-BackgroundColor-Item" + k + ""));
    }

    /* Doughnut */
    var leadChanWise = document.getElementById("ui_canvas_ReferSourceData");
    //new Chart(leadChanWise, {
    var chart_config = {
        plugins: [ChartDataLabels],
        type: 'doughnut',
        data: {
            labels: optiondate,
            datasets: [
                {
                    label: "Population (millions)",
                    backgroundColor: getColors,
                    data: getPageviewcount
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                datalabels: {
                    color: '#fff',
                    font: {
                        size: 10
                    }
                }
            },
            legend: {
                responsive: true,
                position: 'bottom',
                fullWidth: true,
                labels: {
                    fontSize: 11
                }
            },
            title: {
                display: false
                //text: 'Predicted world population (millions) in 2050'
            }
        }
    };
    // Check if data is all 0s; if it is, add dummy data to end with empty label
    chart_config.data.datasets.forEach(dataset => {
        if (dataset.data.every(el => el === 0)) {
            dataset.backgroundColor.push('rgba(192,192,192,0.3)');
            dataset.data.push(0);
            $('#ui_canvas_ReferSourceDataNoData').html('There is no data for this view');
            $("#ui_canvas_ReferSourceDataNoData").removeClass("hideDiv");
            $("#ui_canvas_ReferSourceData").addClass("hideDiv");
        }
    });
    new Chart(leadChanWise, chart_config);
    setTimeout(ShowPageLoading(), 30000);;
    HidePageLoading();
}

//To Bind LeadSource Graph
function GetLeadSource() {
    ShowPageLoading();
    xhr = $.ajax({
        url: "/Analytics/Content/GetLeadSource",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'pagename': pagename, 'devicetype': deviceType }),
         
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: BindLeadSourceGraph,
        error: ShowAjaxError
    });
    //GetTimeSpentData();
}
function BindLeadSourceGraph(response) {
    ShowPageLoading();
    $("#ui_canvas_LeadSourceNoData").addClass("hideDiv");
    $('#ui_canvas_LeadSourceData').removeClass('hideDiv');
    var LeadSourceCanvasChart, LeadSourceName = [], LeadSourceCount = []
    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
        $.each(response.Table1, function () {
            LeadSourceName.push(this.SourceName);
            LeadSourceCount.push(this.LeadsCount);
        });
    }
    if (LeadSourceCanvasChart) {
        LeadSourceCanvasChart.destroy();
    }
    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;



    LeadSourceCanvasChart = new Chart(document.getElementById("ui_canvas_LeadSourceData"), {
        type: 'bar',
        data: {
            labels: LeadSourceName,
            datasets: [{
                data: LeadSourceCount,
                label: "No. of Leads",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item1'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item1'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
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
                display: false,
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
            },
            onClick: event => {
                const datasetIndex = LeadSourceCanvasChart.getElementAtEvent(event)[0]._datasetIndex;
                const model = LeadSourceCanvasChart.getElementsAtEvent(event)[datasetIndex]._model;
                //window.location.href = "http://p5beta.plumb5.io/p5-newdesign/manage-leads.html?source=abcd" //+ model.label;
                LeadSource = model.label;
                GetLeadSourceMaxInnerCount();
            }
        }
    });
    setTimeout(ShowPageLoading(), 30000);;
    HidePageLoading();
}

//To Bin Leads Details side screen report
function GetLeadSourceMaxInnerCount() {
    TotalInnerRowCount = 0;
    ShowPageLoading();
    //ShowPageLoading();
    xhr = $.ajax({
        url: "/Analytics/Content/GetLeadSourceMaxInnerCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'pagename': pagename, 'devicetype': deviceType, 'LeadSource': LeadSource }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response !== undefined && response !== null && response.Table1 !== undefined && response.Table1 !== null && response.Table1.length > 0) {
                TotalInnerRowCount = response.Table1[0].TotalRows;

                GetLeadsDetails();
            }
            else {
                SetNoRecordContent('ui_tblLeadsSourceReportData', 3, 'ui_tbodyLeadSourceReportData');
                setTimeout(ShowPageLoading(), 30000);;
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}
function GetLeadsDetails() {
    ShowPageLoading();
    InnerFetchNext = GetInnerNumberOfRecordsPerPage();
    $('#dvTitle').html(LeadSource);
    xhr = $.ajax({
        url: "/Analytics/Content/GetLeadDetails",
        type: 'Post',
        data: "{'accountId':'" + Plumb5AccountId + "','fromdate':'" + FromDateTime + "','todate':'" + ToDateTime + "','pagename':'" + pagename + "','devicetype':" + deviceType + ",'LeadSource':'" + LeadSource + "','OffSet': " + InnerOffSet + ", 'FetchNext': " + InnerFetchNext + " }",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindLeadDetails,
        error: ShowAjaxError
    });
}
function BindLeadDetails(response) {
    ShowPageLoading();
    $('.popupcontainer').removeClass('hideDiv');

    var reportLeadSourceTableTrs = "";
    if (response !== undefined && response !== null && response.Table1 !== undefined && response.Table1 !== null && response.Table1.length > 0) {
        CurrentInnerRowCount = response.Table1.length;
        InnerPagingPrevNext(InnerOffSet, CurrentInnerRowCount, TotalInnerRowCount);
        var leadname = "", leademail = "", leadPhone = "";
        $.each(response.Table1, function () {
            leadname = this.Name == null || this.Name == "" ? "NA" : this.Name;
            leademail = this.EmailId == null || this.EmailId == "" ? "NA" : this.EmailId;
            leadPhone = this.PhoneNumber == null || this.PhoneNumber == "" ? "NA" : this.PhoneNumber;
            reportLeadSourceTableTrs += "<tr>" +
                "<td style='text-align:left'>" + leadname + "</td>" +
                "<td style='text-align:left'>" + leademail + "</td>" +
                "<td style='text-align:left'>" + leadPhone + "</td>" +
                "</tr>";
        });
        $("#ui_tbodyLeadSourceReportData").html(reportLeadSourceTableTrs);

    }
    else {
        SetNoRecordContent('ui_tblLeadsSourceReportData', 3, 'ui_tbodyLeadSourceReportData');

    }
    setTimeout(ShowPageLoading(), 30000);;
    HidePageLoading();

}


// To Bind TimeSpent graph
function GetTimeSpentData() {
    ShowPageLoading();
    xhr = $.ajax({
        url: "/Analytics/Content/GetTimeSpentData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'pagename': pagename, 'devicetype': deviceType, 'DomainName': DomainName }),
         
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindTimeSpentGraph,
        error: ShowAjaxError
    });
    //GetTimeTrendsData();
}
function BindTimeSpentGraph(response) {
    ShowPageLoading();
    $("#ui_canvas_timespendNoData").addClass("hideDiv");
    $('#ui_canvas_timespendData').removeClass('hideDiv');
    var TimeSpentCanvasChart, TimespentUniuqevisitcount = [], TimeSpentPageviewcount = [], TimeSpentsessioncount = []

    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {

        $.each(response.Table1, function () {

            TimespentUniuqevisitcount.push(this.UniqueVisits);
            TimeSpentPageviewcount.push(this.PageViews);
            TimeSpentsessioncount.push(this.Session);

        });
    }
    if (TimeSpentCanvasChart) {
        TimeSpentCanvasChart.destroy();
    }
    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    // line chart start here
    TimeSpentCanvasChart = new Chart(document.getElementById("ui_canvas_timespendData"), {
        type: 'line',
        data: {
            labels: ["0-10 Secs", "11-30 Secs", "31-60 Secs", "61-180 Secs", "181-300 Secs", "301-600 Secs", "600 or more Secs"],
            datasets: [{
                data: TimeSpentsessioncount,
                label: "Sessions",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item1'),
                pointBorderColor: cssvar('--LineChart-BorderColor-Item1'),
                hoverBorderColor: cssvar('--LineChart-BorderColor-Item1'),
                pointHoverBorderColor: cssvar('--LineChart-BorderColor-Item1'),

                backgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                pointBackgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                pointHoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                fill: true
            },
            {
                data: TimespentUniuqevisitcount,
                label: "Unique Visitors",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item2'),
                pointBorderColor: cssvar('--LineChart-BorderColor-Item2'),
                hoverBorderColor: cssvar('--LineChart-BorderColor-Item2'),
                pointHoverBorderColor: cssvar('--LineChart-BorderColor-Item2'),

                backgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                pointBackgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                pointHoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                fill: true
            },
            {
                data: TimeSpentPageviewcount,
                label: "Page Views",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item3'),
                pointBorderColor: cssvar('--LineChart-BorderColor-Item3'),
                hoverBorderColor: cssvar('--LineChart-BorderColor-Item3'),
                pointHoverBorderColor: cssvar('--LineChart-BorderColor-Item3'),

                backgroundColor: cssvar('--LineChart-BackgroundColor-Item3'),
                hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item3'),
                pointBackgroundColor: cssvar('--LineChart-BackgroundColor-Item3'),
                pointHoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item3'),
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
    setTimeout(ShowPageLoading(), 30000);;
    HidePageLoading();
}

// To Bind TimeTrends Graph
function GetTimeTrendsData() {
    ShowPageLoading();
    xhr = $.ajax({
        url: "/Analytics/Content/GetTimeTrendsData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'pagename': pagename, 'devicetype': deviceType, 'DomainName': DomainName }),
         
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindTimeTrendsGraph,
        error: ShowAjaxError
    });
    //GetFrequencyData();
}
function BindTimeTrendsGraph(response) {
    ShowPageLoading();
    $("#ui_canvas_TimeTrendsNoData").addClass("hideDiv");
    $('#ui_canvas_TimeTrendsData').removeClass('hideDiv');
    var TimeTrendsGraphItem = { TimeTrendsoptiondate: [], TimeTrendsUniquevisitcount: [], TimeTrendsSessioncount: [] }, TimeTrendsChart;
    if (TimeTrendsChart) {
        TimeTrendsChart.destroy();
    }
    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
        $.each(response.Table1, function () {
            TimeTrendsGraphItem.TimeTrendsoptiondate.push(this.DateShort);
            TimeTrendsGraphItem.TimeTrendsUniquevisitcount.push(this.UniqueVisit);
            TimeTrendsGraphItem.TimeTrendsSessioncount.push(this.Session);
        });
    }
    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    // line chart start here
    TimeTrendsChart = new Chart(document.getElementById("ui_canvas_TimeTrendsData"), {
        type: 'line',
        data: {
            labels: TimeTrendsGraphItem.TimeTrendsoptiondate,
            datasets: [{
                data: TimeTrendsGraphItem.TimeTrendsSessioncount,
                label: "Sessions",
                borderWidth: 1.5,
                borderColor: cssvar('--LineChart-BorderColor-Item1'),
                backgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                fill: true
            },
            {
                data: TimeTrendsGraphItem.TimeTrendsUniquevisitcount,
                label: "Unique Visitor",
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
    setTimeout(ShowPageLoading(), 30000);;
    HidePageLoading();

}

// To Bind Frequency Graph
function GetFrequencyData() {
    ShowPageLoading();
    xhr = $.ajax({
        url: "/Analytics/Content/GetFrequencyData",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'pagename': pagename, 'devicetype': deviceType, 'DomainName': DomainName }),

        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: BindFrequencyGraph,
        error: ShowAjaxError
    });
}
function BindFrequencyGraph(response) {
    ShowPageLoading();

    $("#ui_canvas_WebFrequencyNoData").addClass("hideDiv");
    $('#ui_canvas_WebFrequencyData').removeClass('hideDiv');
    var FrequencyGraphItem = { frequency: [], getuniquevisitcount: [], getpageviewscount: [] }, WebFrequencyChart;

    if (WebFrequencyChart) {
        WebFrequencyChart.destroy();
    }
    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
        $.each(response.Table1, function () {

            FrequencyGraphItem.frequency.push(this.Frequency);
            FrequencyGraphItem.getuniquevisitcount.push(this.UniqueVisits);
            FrequencyGraphItem.getpageviewscount.push(this.TotalVisits);
        });
    }
    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    // line chart start here
    WebFrequencyChart = new Chart(document.getElementById("ui_canvas_WebFrequencyData"), {
        type: 'bar',
        data: {
            labels: FrequencyGraphItem.frequency,
            datasets: [{
                data: FrequencyGraphItem.getuniquevisitcount,
                label: "Unique Visitors",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item1'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item1'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                fill: true
            },
            {
                data: FrequencyGraphItem.getpageviewscount,
                label: "Page Views",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item2'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item2'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item2'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item2'),
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
    setTimeout(ShowPageLoading(), 30000);;
    HidePageLoading();
    //GetVisitorData();

}
function GetVisitorData() {
    ShowPageLoading();
    xhr = $.ajax({
        url: "/Analytics/Content/BindGraph",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'pagename': pagename, 'devicetype': deviceType }),
         
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: BindReport,
        error: ShowAjaxError
    });
}
//To Bind VisitorTable Data

function BindReport(response) {
    ShowPageLoading();
    var reportTableTrs = "";
    SetNoRecordContent('ui_tblReportData', 10, 'ui_tbodyReportData');

    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {

        $.each(response.Table1, function (m) {

            var currentDateData = ConvertDateObjectToDateTime(this.Date);
            var eachDate = monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate();
            var startdate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 00:00:00";
            var enddate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 23:59:59";

            var fromdate = startdate; //ConvertDateTimeToUTC(startdate);
            //fromdate = fromdate.getFullYear() + '-' + PrefixZero((fromdate.getMonth() + 1)) + '-' + PrefixZero(fromdate.getDate()) + " " + PrefixZero(fromdate.getHours()) + ":" + PrefixZero(fromdate.getMinutes()) + ":" + PrefixZero(fromdate.getSeconds());

            var todate = enddate; //ConvertDateTimeToUTC(enddate);
            //todate = todate.getFullYear() + '-' + PrefixZero((todate.getMonth() + 1)) + '-' + PrefixZero(todate.getDate()) + " " + PrefixZero(todate.getHours()) + ":" + PrefixZero(todate.getMinutes()) + ":" + PrefixZero(todate.getSeconds());

            reportTableTrs += '<tr>' +
                '<td class="text-left">' + eachDate + '</td>' +
                '<td>' + this.TotalVisit + '</td>' +
                '<td>' + this.Sessions + '</td>' +
                //'<td>' + (this.UniquVisitors != "0" ? "<a class='ViewPermission' href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + fromdate + "&To=" + todate + "&PageName=" + pagename + "&pageanalysis=true&From=" + frompage + "'>" + this.UniquVisitors + "</a>" : this.UniquVisitors) + '</td>' +
                '<td>' + (this.UniquVisitors != "0" ? "<a class='ViewPermission' href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + fromdate + "&To=" + todate + "&pageanalysisdata=" + pagename.replaceAll('&', '@@@@') + "&From=" + frompage + "&pageanalysisdevicetype=" + deviceType + "'>" + this.UniquVisitors + "</a>" : this.UniquVisitors) + '</td>' +

                '<td><a class="popViewHref" href="javascript:void(0)" data-colheadtitle="Sources" date-month="' + eachDate + '" data-form="' + fromdate + '" data-to="' + todate + '">' + this.Source + '</a> </td>' +
                '<td><a class="popViewHref" href="javascript:void(0)" data-colheadtitle="cities"  date-month="' + eachDate + '" data-form="' + fromdate + '" data-to="' + todate + '">' + this.Cities + '</a> </td>' +
                '<td>' + this.SingleVisitors + '</td>' +
                '<td>' + this.RepeatVisitors + '</td>' +
                '<td>' + this.ReturningVisitors + '</td>' +
                '<td>' + fn_AverageTime(this.AvgTime) + '</td>' +
                '</tr>';

        });

        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        bindClick();
        setTimeout(ShowPageLoading(), 30000);;

        /* GetCurrentSummaryData();*/
        //BindOverAllComparision(response)
        ShowExportDiv(true);
    } else {
        ShowExportDiv(false);
    }
    setTimeout(ShowPageLoading(), 30000);;
    HidePageLoading();
}

function GetCurrentSummaryData() {
    ShowPageLoading();
    xhr = $.ajax({
        url: "/Analytics/Content/OverallPercentage",
        type: 'Post',
        data: JSON.stringify({
            'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'pagename': pagename, 'deviceType': deviceType
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            //GetPastSummaryData(response);
            BindOverAllComparision(response)
        },
        error: ShowAjaxError
    });
}
function GetPastSummaryData(CurrentSummaryData) {
    ShowPageLoading();
    var from_Date = CalculateDateDifference();
    xhr = $.ajax({
        url: "/Analytics/Content/OverallPercentage",
        type: 'Post',
        data: JSON.stringify({
            'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': from_Date, 'todate': FromDateTime, 'pagename': pagename, 'deviceType': deviceType
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindOverAllComparision(response, CurrentSummaryData);

        },
        error: ShowAjaxError
    });
}
//function BindOverAllComparision(PastSummaryData, CurrentSummaryData) {
//    var CompareFirstData = { TotalVisits: 0, Sessions: 0, UniquVisitors: 0, Source: 0, Cities: 0, AvgTime: 0, SearchKeys: 0 };
//    var CompareSecondData = { TotalVisits: 0, Sessions: 0, UniquVisitors: 0, Source: 0, Cities: 0, AvgTime: 0, SearchKeys: 0 };
//    var PerCentValue = 0;

//    if (CurrentSummaryData != undefined && CurrentSummaryData != null && CurrentSummaryData.Table1 != undefined && CurrentSummaryData.Table1 != null && CurrentSummaryData.Table1.length > 0) {
//        $.each(CurrentSummaryData.Table1, function () {
//            CompareFirstData.TotalVisits = this.TotalVisits;
//            CompareFirstData.Sessions = this.Sessions;
//            CompareFirstData.UniquVisitors = this.UniquVisitors;
//            CompareFirstData.Source = this.Source;
//            CompareFirstData.Cities = this.Cities;
//            CompareFirstData.AvgTime = this.AvgTime;
//            CompareFirstData.SearchKeys = this.SearchKeys;
//        });
//    }

//    if (PastSummaryData != undefined && PastSummaryData != null && PastSummaryData.Table1 != undefined && PastSummaryData.Table1 != null && PastSummaryData.Table1.length > 0) {
//        $.each(PastSummaryData.Table1, function () {
//            CompareSecondData.TotalVisits = this.TotalVisits;
//            CompareSecondData.Sessions = this.Sessions;
//            CompareSecondData.UniquVisitors = this.UniquVisitors;
//            CompareSecondData.Source = this.Source;
//            CompareSecondData.Cities = this.Cities;
//            CompareSecondData.AvgTime = this.AvgTime;
//            CompareSecondData.SearchKeys = this.SearchKeys;
//        });
//    }

//    var reportTableTrs = "<tr class='isnotsortable'><td></td>";
//    PerCentValue = CalculatePercentage(CompareFirstData.TotalVisits, CompareSecondData.TotalVisits);
//    if (CompareSecondData.TotalVisits == CompareFirstData.TotalVisits) {
//        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.TotalVisits + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
//    }
//    else if (CompareFirstData.TotalVisits > CompareSecondData.TotalVisits) {
//        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.TotalVisits + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
//    }
//    else if (CompareFirstData.TotalVisits < CompareSecondData.TotalVisits) {
//        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.TotalVisits + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropdown'></i><span>" + PerCentValue + "%</span></p></td>";
//    }

//    PerCentValue = CalculatePercentage(CompareFirstData.Sessions, CompareSecondData.Sessions);
//    if (CompareSecondData.Sessions == CompareFirstData.Sessions) {
//        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.Sessions + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
//    }
//    else if (CompareFirstData.Sessions > CompareSecondData.Sessions) {
//        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.Sessions + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
//    }
//    else if (CompareFirstData.Sessions < CompareSecondData.Sessions) {
//        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.Sessions + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropdown'></i><span>" + PerCentValue + "%</span></p></td>";
//    }

//    PerCentValue = CalculatePercentage(CompareFirstData.UniquVisitors, CompareSecondData.UniquVisitors);
//    if (CompareSecondData.UniquVisitors == CompareFirstData.UniquVisitors) {
//        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.UniquVisitors + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
//    }
//    else if (CompareFirstData.UniquVisitors > CompareSecondData.UniquVisitors) {
//        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.UniquVisitors + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
//    }
//    else if (CompareFirstData.UniquVisitors < CompareSecondData.UniquVisitors) {
//        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.UniquVisitors + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropdown'></i><span>" + PerCentValue + "%</span></p></td>";
//    }

//    PerCentValue = CalculatePercentage(CompareFirstData.Source, CompareSecondData.Source);
//    if (CompareSecondData.Source == CompareFirstData.Source) {
//        reportTableTrs += "<td><h3 class='td-h3'><a class='popViewHref' data-colheadtitle='Sources' data-form='" + FromDateTime + "' data-to='" + ToDateTime + "' href='javascript:void(0)'>" + CompareFirstData.Source + "</a></h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
//    }
//    else if (CompareFirstData.Source > CompareSecondData.Source) {
//        reportTableTrs += "<td><h3 class='td-h3'><a class='popViewHref' data-colheadtitle='Sources' data-form='" + FromDateTime + "' data-to='" + ToDateTime + "' href='javascript:void(0)'>" + CompareFirstData.Source + "</a></h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
//    }
//    else if (CompareFirstData.Source < CompareSecondData.Source) {
//        reportTableTrs += "<td><h3 class='td-h3'><a class='popViewHref' data-colheadtitle='Sources' data-form='" + FromDateTime + "' data-to='" + ToDateTime + "' href='javascript:void(0)'>" + CompareFirstData.Source + "</a></h3><p class='percnt'><i class='icon ion-android-arrow-dropdown'></i><span>" + PerCentValue + "%</span></p></td>";
//    }

//    PerCentValue = CalculatePercentage(CompareFirstData.Cities, CompareSecondData.Cities);
//    if (CompareSecondData.Cities == CompareFirstData.Cities) {
//        reportTableTrs += "<td><h3 class='td-h3'><a class='popViewHref' data-colheadtitle='cities' data-form='" + FromDateTime + "' data-to='" + ToDateTime + "' href='javascript:void(0)'>" + CompareFirstData.Cities + "</a></h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
//    }
//    else if (CompareFirstData.Cities > CompareSecondData.Cities) {
//        reportTableTrs += "<td><h3 class='td-h3'><a class='popViewHref' data-colheadtitle='cities' data-form='" + FromDateTime + "' data-to='" + ToDateTime + "' href='javascript:void(0)'>" + CompareFirstData.Cities + "</a></h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
//    }
//    else if (CompareFirstData.Cities < CompareSecondData.Cities) {
//        reportTableTrs += "<td><h3 class='td-h3'><a class='popViewHref' data-colheadtitle='cities' data-form='" + FromDateTime + "' data-to='" + ToDateTime + "' href='javascript:void(0)'>" + CompareFirstData.Cities + "</a></h3><p class='percnt'><i class='icon ion-android-arrow-dropdown'></i><span>" + PerCentValue + "%</span></p></td>";
//    }

//    reportTableTrs += "<td><h3 class='td-h3'>" + fn_AverageTime(CompareFirstData.AvgTime) + "</h3></td>";
//    reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.SearchKeys + "</h3></td>";



//    reportTableTrs += "</tr>";

//    $("#ui_tbodyReportData").prepend(reportTableTrs);
//    bindClick();
//}


function GetOverAllComparision(CompareFirstData) {
    ShowPageLoading();
    var from_Date = CalculateDateDifference();

    xhr = $.ajax({
        url: "/Analytics/Content/BindGraph",
        type: 'Post',
        data: "{'accountId':'" + Plumb5AccountId + "','fromdate':'" + from_Date + "','todate':'" + ToDateTime + "','pagename':'" + pagename + "','devicetype': " + deviceType + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindOverAllComparision(response, CompareFirstData);
            //GetCitySourceSummaryCount(response, CompareFirstData);
        },
        error: ShowAjaxError
    });
}
function GetCitySourceSummaryCount(PastSummaryData, CurrentSummaryData) {
    ShowPageLoading();
    xhr = $.ajax({
        url: "/Analytics/Content/OverallPercentage",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'pagename': pagename, 'deviceType': deviceType }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindOverAllComparision(PastSummaryData);
        },
        error: ShowAjaxError
    });

}
function BindOverAllComparision(CompareFirstData) {
    ShowPageLoading();
    //var PerCentValue = 0;
    var reportsummaryTableTrs = "";
    if (CompareFirstData.Table1[0].TotalVisits > 0) {
        reportsummaryTableTrs = "<tr class='isnotsortable'><td></td>";
        //PerCentValue = CalculatePercentage(CompareFirstData.Table1[0].TotalVisits, CompareSecondData.Table1[0].TotalVisits);
        //if (CompareSecondData.Table1[0].TotalVisits == CompareFirstData.Table1[0].TotalVisits) {
        //    reportsummaryTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.Table1[0].TotalVisits + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
        //}
        //else if (CompareFirstData.Table1[0].TotalVisits > CompareSecondData.Table1[0].TotalVisits) {
        //    reportsummaryTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.Table1[0].TotalVisits + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
        //}
        //else if (CompareFirstData.Table1[0].TotalVisits < CompareSecondData.Table1[0].TotalVisits) {
        reportsummaryTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.Table1[0].TotalVisits + "</h3></td>";
        //}

        //PerCentValue = CalculatePercentage(CompareFirstData.Table1[0].Sessions, CompareSecondData.Table1[0].Sessions);
        //if (CompareSecondData.Table1[0].Sessions == CompareFirstData.Table1[0].Sessions) {
        //    reportsummaryTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.Table1[0].Sessions + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
        //}
        //else if (CompareFirstData.Table1[0].Sessions > CompareSecondData.Table1[0].Sessions) {
        //    reportsummaryTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.Table1[0].Sessions + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
        //}
        //else if (CompareFirstData.Table1[0].Sessions < CompareSecondData.Table1[0].Sessions) {
        reportsummaryTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.Table1[0].Sessions + "</h3></td>";
        //}

        //PerCentValue = CalculatePercentage(CompareFirstData.Table1[0].UniquVisitors, CompareSecondData.Table1[0].UniquVisitors);
        //if (CompareSecondData.Table1[0].UniquVisitors == CompareFirstData.Table1[0].UniquVisitors) {
        //    reportsummaryTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.Table1[0].UniquVisitors + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
        //}
        //else if (CompareFirstData.Table1[0].UniquVisitors > CompareSecondData.Table1[0].UniquVisitors) {
        //    reportsummaryTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.Table1[0].UniquVisitors + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
        //}
        //else if (CompareFirstData.Table1[0].UniquVisitors < CompareSecondData.Table1[0].UniquVisitors) {
        reportsummaryTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.Table1[0].UniquVisitors + "</h3></td>";
        //}

        //PerCentValue = CalculatePercentage(CompareFirstData.Table1[0].Source, CompareSecondData.Table1[0].Source);
        //if (CompareSecondData.Table1[0].Source == CompareFirstData.Table1[0].Source) {
        //    reportsummaryTableTrs += "<td><h3 class='td-h3'><a class='popViewHref' data-colheadtitle='Sources' data-form='" + FromDateTime + "' data-to='" + ToDateTime + "' href='javascript:void(0)'>" + CompareFirstData.Table1[0].Source + "</a></h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
        //}
        //else if (CompareFirstData.Table1[0].Source > CompareSecondData.Table1[0].Source) {
        //    reportsummaryTableTrs += "<td><h3 class='td-h3'><a class='popViewHref' data-colheadtitle='Sources' data-form='" + FromDateTime + "' data-to='" + ToDateTime + "' href='javascript:void(0)'>" + CompareFirstData.Table1[0].Source + "</a></h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
        //}
        //else if (CompareFirstData.Table1[0].Source < CompareSecondData.Table1[0].Source) {
        reportsummaryTableTrs += "<td><h3 class='td-h3'><a class='popViewHref' data-colheadtitle='Sources' data-form='" + FromDateTime + "' data-to='" + ToDateTime + "' href='javascript:void(0)'>" + CompareFirstData.Table1[0].Source + "</a></h3></td>";
        //}

        //PerCentValue = CalculatePercentage(CompareFirstData.Table1[0].Cities, CompareSecondData.Table1[0].Cities);
        //if (CompareSecondData.Table1[0].Cities == CompareFirstData.Table1[0].Cities) {
        //    reportsummaryTableTrs += "<td><h3 class='td-h3'><a class='popViewHref' data-colheadtitle='cities' data-form='" + FromDateTime + "' data-to='" + ToDateTime + "' href='javascript:void(0)'>" + CompareFirstData.Table1[0].Cities + "</a></h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
        //}
        //else if (CompareFirstData.Table1[0].Cities > CompareSecondData.Table1[0].Cities) {
        //    reportsummaryTableTrs += "<td><h3 class='td-h3'><a class='popViewHref' data-colheadtitle='cities' data-form='" + FromDateTime + "' data-to='" + ToDateTime + "' href='javascript:void(0)'>" + CompareFirstData.Table1[0].Cities + "</a></h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
        //}
        //else if (CompareFirstData.Table1[0].Cities < CompareSecondData.Table1[0].Cities) {
        reportsummaryTableTrs += "<td><h3 class='td-h3'><a class='popViewHref' data-colheadtitle='cities' data-form='" + FromDateTime + "' data-to='" + ToDateTime + "' href='javascript:void(0)'>" + CompareFirstData.Table1[0].Cities + "</a></h3></td>";
        //}

        //PerCentValue = CalculatePercentage(CompareFirstData.Table1[0].SingleVisitor, CompareSecondData.Table1[0].SingleVisitor);
        //if (CompareSecondData.Table1[0].SingleVisitor == CompareFirstData.Table1[0].SingleVisitor) {
        //    reportsummaryTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.Table1[0].SingleVisitor + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
        //}
        //else if (CompareFirstData.Table1[0].SingleVisitor > CompareSecondData.Table1[0].SingleVisitor) {
        //    reportsummaryTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.Table1[0].SingleVisitor + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
        //}
        //else if (CompareFirstData.Table1[0].SingleVisitor < CompareSecondData.Table1[0].SingleVisitor) {
        reportsummaryTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.Table1[0].SingleVisitor + "</h3></td>";
        // }

        //PerCentValue = CalculatePercentage(CompareFirstData.Table1[0].RepeatVisitor, CompareSecondData.Table1[0].RepeatVisitor);
        //if (CompareSecondData.Table1[0].RepeatVisitor == CompareFirstData.Table1[0].RepeatVisitor) {
        //    reportsummaryTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.Table1[0].RepeatVisitor + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
        //}
        //else if (CompareFirstData.Table1[0].RepeatVisitor > CompareSecondData.Table1[0].RepeatVisitor) {
        //    reportsummaryTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.Table1[0].RepeatVisitor + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
        //}
        //else if (CompareFirstData.Table1[0].RepeatVisitor < CompareSecondData.Table1[0].RepeatVisitor) {
        reportsummaryTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.Table1[0].RepeatVisitor + "</h3></td>";
        //}

        //PerCentValue = CalculatePercentage(CompareFirstData.Table1[0].ReturnVisitor, CompareSecondData.Table1[0].ReturnVisitor);
        //if (CompareSecondData.Table1[0].ReturnVisitor == CompareFirstData.Table1[0].ReturnVisitor) {
        //    reportsummaryTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.Table1[0].ReturnVisitor + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
        //}
        //else if (CompareFirstData.Table1[0].ReturnVisitor > CompareSecondData.Table1[0].ReturnVisitor) {
        //    reportsummaryTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.Table1[0].ReturnVisitor + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
        //}
        //else if (CompareFirstData.Table1[0].ReturnVisitor < CompareSecondData.Table1[0].ReturnVisitor) {
        reportsummaryTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.Table1[0].ReturnVisitor + "</h3></td>";
        //}
        reportsummaryTableTrs += "<td><h3 class='td-h3'>" + fn_AverageTime(CompareFirstData.Table1[0].AvgTime) + "</h3></td>";
        // reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.SearchKeys + "</h3></td>";



        reportsummaryTableTrs += "</tr>";

        $("#ui_tbodyReportData").prepend(reportsummaryTableTrs);
    }
    bindClick();
    setTimeout(ShowPageLoading(), 30000);;

    HidePageLoading();
}

// To Bind Side Screen City Report
function GetBindCity(frmDate, toDate) {
    ShowPageLoading();
    $("#ui_tbodyCityReportData").html("");
    var reportTableTrs = "";
    xhr = $.ajax({
        url: "/Analytics/Content/BindCityGrid",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': frmDate, 'todate': toDate, 'pagename': pagename, 'devicetype': deviceType  }),
         
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {

            $.each(response.Table1, function () {


                reportTableTrs += "<tr>" +
                    "<td class='text-left td-icon'>" + (this.City == "" ? "UNKNOWN CITY" : this.City) + "</td>" +
                    "<td>" + this.TotalVisits + "</td>" +
                    "<td>" + this.UniqueVisits + "</td>" +
                    "</tr>";

            });

            $("#ui_tbodyCityReportData").html(reportTableTrs);
            setTimeout(ShowPageLoading(), 30000);;
            HidePageLoading();
        },
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }

    });

}

// To Bind Side Screen Source Report
function GetBindSource(frmDate, toDate) {
    ShowPageLoading();
    $("#ui_tbodySourceReportData").html("");
    var reportTableTrs = "";
    xhr = $.ajax({
        url: "/Analytics/Content/BindSourceGrid",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': frmDate, 'todate': toDate, 'pagename': pagename, 'devicetype': deviceType }),
         
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {

            $.each(response.Table1, function () {


                reportTableTrs += " <tr><td class='text-left'>" + this.Source + "</td>" +
                    "<td>" + this.TotalVisits + "</td></tr>";

            });

            $("#ui_tbodySourceReportData").html(reportTableTrs);
            setTimeout(ShowPageLoading(), 30000);;
            HidePageLoading();
        },
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }
    });

}

//Go btn Click
$("#btnSearch").click(function () {
    pagename = $('#txt_PageURL').val();

    if (pagename == '' || pagename == null || pagename == undefined) {
        ShowErrorMessage(GlobalErrorList.PageAnalysis.pageUrl_error);
        return false;
    }

    if (pagename.indexOf(DomainName.replace('www.', '').replace('https://', '').replace('http://', '')) == -1) {
        ShowErrorMessage(GlobalErrorList.PageAnalysis.domain_error + " - " + DomainName);
        return false;
    }
    //$("#spnPage").html('(' + pagename + ')');
    GetReport();

});

// Desktop Tab Click
$("#dvDesktop").click(function () {
    $('#dektopactivelink').addClass('active');
    $('#mobileactivelink').removeClass('active');
    deviceType = 0;
    ShowPageLoading();
    GetReport();
});

function ClearGraph() {
    $('#ui_canvas_PageViewsNoData,#ui_canvas_ReferSourceDataNoData,#ui_canvas_LeadSourceNoData,#ui_canvas_timespendNoData,#ui_canvas_TimeTrendsNoData,#ui_canvas_WebFrequencyNoData').removeClass('hideDiv');
    $('#graphData,#ui_canvas_ReferSourceData,#ui_canvas_LeadSourceData,#ui_canvas_timespendData,#ui_canvas_TimeTrendsData,#ui_canvas_WebFrequencyData').addClass('hideDiv');
    $('#ui_tbodyReportData').empty();
}

//Mobile Tab Click
$("#dvMobile").click(function () {
    $('#dektopactivelink').removeClass('active');
    $('#mobileactivelink').addClass('active');
    deviceType = 1;
    ShowPageLoading();
    GetReport();
});

//Close icon click for Lead Source Pop up
$("#close-popup").click(function () {
    InnerOffSet = 0;
    $(this).parents(".popupcontainer").addClass("hideDiv");

});









function bindClick() {



    $(".topbandWrap i.ion-android-close").click(function () {
        $(this).parents('.rightPopupwrap').removeClass('showFlx');
        $(rowactiveBg).removeClass("activeBgRow");
        if ($(".Table1Wrapper").hasClass("h-400")) {
            $(".Table1Wrapper").removeClass("h-400");
        }
    });

    var eventIdentName, eventnameVal, eventClassIdVal, rowactiveBg;
    $(".popViewHref").click(function () {

        var dataform = $(this).attr("data-form");
        var datato = $(this).attr("data-to");
        var colHeadVal = $(this).attr("data-colheadTitle");
        var checkTableName = $(this).closest('table').attr('id');
        var rowCount = $("#" + checkTableName + " tbody tr").length;
        var datemonth = $(this).attr("date-month");
        eventIdentName = $(this).parent().prev().text();
        eventnameVal = $(this).parents('td').next().text();
        eventClassIdVal = $(this).parents('td').next().next().next().text();
        rowactiveBg = $(this).parents('tr');
        if (datemonth != undefined)
            $(".topbandWrap h6").html(colHeadVal + " ( " + datemonth + " )");
        else
            $(".topbandWrap h6").html(colHeadVal);
        if (colHeadVal == "Sources") {
            GetBindSource(dataform, datato);
            if (rowCount <= 5) {

                $("#" + checkTableName).parents(".Table1Wrapper").addClass("h-400");
                $(".rightPopupwrap").addClass('showFlx');
                $(".popupslideItem").addClass('show');
                $(".tbl-pageVisits, .tbl-cities, .tbl-searchkey").addClass('hideDiv');
                $(".tbl-sources").removeClass('hideDiv');
            } else {

                $(".rightPopupwrap").addClass('showFlx');
                $(".popupslideItem").addClass('show');
                $(".tbl-pageVisits, .tbl-cities, .tbl-searchkey").addClass('hideDiv');
                $(".tbl-sources").removeClass('hideDiv');
            }

        } else if (colHeadVal == "cities") {
            GetBindCity(dataform, datato);
            if (rowCount <= 5) {
                $(".topbandWrap h6").html(colHeadVal + " ( " + datemonth + " )");
                $("#" + checkTableName).parents(".Table1Wrapper").addClass("h-400");
                $(".rightPopupwrap").addClass('showFlx');
                $(".popupslideItem").addClass('show');
                $(".tbl-pageVisits, .tbl-sources, .tbl-searchkey").addClass('hideDiv');
                $(".tbl-cities").removeClass('hideDiv');
            } else {
                $(".topbandWrap h6").html(colHeadVal + " ( " + datemonth + " )");
                $(".rightPopupwrap").addClass('showFlx');
                $(".popupslideItem").addClass('show');
                $(".tbl-pageVisits, .tbl-sources, .tbl-searchkey").addClass('hideDiv');
                $(".tbl-cities").removeClass('hideDiv');
            }
        }
    });
}

