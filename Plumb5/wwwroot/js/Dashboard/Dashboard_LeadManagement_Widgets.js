// Lms Lead Summary **************************************
function BindLeadSummary(divId) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    var LeadSummaryWidgetHtmlContent =
        //"<div class='box-white h-100 m-p-hite-350'>"+
        //"<h6 class='box-title pb-2'>Summary</h6>" +
        "<div class='lmssummwrp border-bottom border-top'>" +
        "<h2 id='ui_h2_LeadsIn' class='lmsnumcountblue'>0</h2>" +
        "<small class='lmsumcountname'>Leads In</small>" +
        "</div>" +
        "<div class='lmssummwrp border-bottom'>" +
        "<h2 id='ui_h2_UnStaged' class='lmsnumcountblue text-color-success'>0</h2>" +
        "<small class='lmsumcountname'>Un-Staged</small>" +
        "</div>" +
        "<div class='lmssummwrp'>" +
        "<div id='ui_div_Contacted' class='lmsnumcountpur'>0</div>" +
        "<div class='lmssumcontwrp'>" +
        "<small class='lmsumcountname'>Contacted</small>" +
        "</div>" +
        " </div>" +
        "</div>";
    $('#' + divId).html(LeadSummaryWidgetHtmlContent);

    $.ajax({
        url: "/Dashboard/DashboardOverview/GetLeadSummary",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'UserId': Plumb5UserId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            if (response != null && response != undefined && response.Table1.length > 0) {
                $("#ui_h2_LeadsIn").html(response.Table1[0].CurrentLeads);
                $("#ui_h2_UnStaged").html(response.Table1[0].CurrentUnstaged);
                $("#ui_div_Contacted").html(response.Table1[0].LeadsContacted);
            }

        },
        error: function (error) {
            LoadingImageCount--;
            ShowAjaxError(error);
            ShowLoadingImageBasedOnCount();
        }
    });
    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();
}
// LMS Top Stage *****************************************
function CreateLmsTopStageChart(canvasid) {
    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    $.ajax({
        url: "/Dashboard/DashboardOverview/GetTopStages",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'UserId': Plumb5UserId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindLmsTopStageGraph(response, canvasid);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowAjaxError(error);
            ShowLoadingImageBasedOnCount();
        }
    });

}
function BindLmsTopStageGraph(response, canvasid) {

    var stageName = [], leadCount = [], stageColor = [];
    if (response != null && response != undefined && response.Table1.length > 0) {
        $.each(response.Table1, function (i) {
            stageName.push(this.Stage);
            leadCount.push(this.NumberOfLead);
            stageColor.push(this.IdentificationColor);
        });
    }


    new Chart(document.getElementById(canvasid), {
        //plugins: [ChartDataLabels],

        type: 'bar',
        data: {
            labels: stageName,
            datasets: [{
                data: leadCount,
                label: "No. of Leads",
                borderWidth: 1,
                borderColor: stageColor,
                hoverBorderColor: stageColor,
                backgroundColor: stageColor,
                hoverBackgroundColor: stageColor,
                fill: true
            }
            ]
        },
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 90
                    }
                }]
            },
            plugins: {
                datalabels: {
                    display: false
                }
            },
            maintainAspectRatio: false,
            elements: {
                line: {
                    tension: 0
                },
                point: {
                    radius: 2
                }
            },
            //plugins: {
            //    datalabels: {
            //        color: '#7c7c7c',
            //        align: 'end',
            //        anchor: 'end',
            //        font: {
            //            size: 10,
            //        }
            //    }
            //},
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
            }
        }
    });

    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();

}


// LMS Top Source *****************************************
function CreateLmsTopSourceChart(canvasid) {

    LoadingImageCount++;
    ShowLoadingImageBasedOnCount();

    $.ajax({
        url: "/Dashboard/DashboardOverview/GetTopSources",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'UserId': Plumb5UserId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindLmsTopSourceGraph(response, canvasid);
        },
        error: function (error) {
            LoadingImageCount--;
            ShowAjaxError(error);
            ShowLoadingImageBasedOnCount();
        }
    });
}
function BindLmsTopSourceGraph(response, canvasid) {

    var sourceName = [], leadCount = [];
    if (response != null && response != undefined && response.Table1.length > 0) {
        for (var i = 0; i < response.Table1.length; i++) {

            sourceName.push(response.Table1[i].Name);
            leadCount.push(response.Table1[i].LeadCount);
        }
    }

    new Chart(document.getElementById(canvasid), {
        //plugins: [ChartDataLabels],
        type: 'bar',
        data: {
            labels: sourceName,
            datasets: [{
                data: leadCount,
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
            scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 90
                    }
                }]
            },
            plugins: {
                datalabels: {
                    display: false
                }
            },
            maintainAspectRatio: false,
            elements: {
                line: {
                    tension: 0
                },
                point: {
                    radius: 2
                }
            },
            //plugins: {
            //    datalabels: {
            //        color: '#7c7c7c',
            //        align: 'end',
            //        anchor: 'end',
            //        font: {
            //            size: 10,
            //        }
            //    }
            //},
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
            }
        }
    });


    LoadingImageCount--;
    NumberOfWidgetsLoaded++; TotalWidget++;
    ShowLoadingImageBasedOnCount();
}