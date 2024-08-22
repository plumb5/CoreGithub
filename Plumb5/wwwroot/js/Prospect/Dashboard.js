var UserId = 0, topStagesGraph, topSourcesGraph;

$(document).ready(function () {
    LeadDashboardUtil.GetUsers();
    GetUTCDateTimeRange(2);

});

function CallBackFunction() {
    ShowPageLoading();
    LeadDashboardUtil.GetSummary();
}

var LeadDashboardUtil = {
    GetUsers: function () {
        $.ajax({
            url: "/Prospect/Dashboard/GetUsers",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    $.each(response, function (i) {
                        $("#lmsallusername").append("<option value='" + this.UserInfoUserId + "'>" + this.FirstName + " ( " + this.EmailId + ")</option > ");
                    });
                }
            },
            error: ShowAjaxError
        });
    },
    GetSummary: function () {
        $.ajax({
            url: "/Prospect/Dashboard/GetSummary",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'UserId': UserId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (response) {
                if (response != null && response != undefined && response.Table.length > 0) {
                    $("#ui_h2_LeadsIn").html(response.Table[0].CurrentLeads);
                    $("#ui_h2_UnStaged").html(response.Table[0].CurrentUnstaged);
                    $("#ui_div_Contacted").html(response.Table[0].LeadsContacted);
                    LeadDashboardUtil.BindOnclickForSummary();
                }
                LeadDashboardUtil.GetFollowUps();
            },
            error: ShowAjaxError
        });
    },
    BindOnclickForSummary: function () {
        $("#ui_h2_LeadsIn").attr('href', "/Prospect/Leads?dashboardType=1&Frm=" + LeadDashboardUtil.GetDateForBinding(LocalFromDateTime) + "&To=" + LeadDashboardUtil.GetDateForBinding(LocalToDateTime));
        $("#ui_h2_UnStaged").attr('href', "/Prospect/Leads?dashboardType=2&Frm=" + LeadDashboardUtil.GetDateForBinding(LocalFromDateTime) + "&To=" + LeadDashboardUtil.GetDateForBinding(LocalToDateTime));
        $("#ui_div_Contacted").attr('href', "/Prospect/Leads?dashboardType=3&Frm=" + LeadDashboardUtil.GetDateForBinding(LocalFromDateTime) + "&To=" + LeadDashboardUtil.GetDateForBinding(LocalToDateTime));
    },
    GetDateForBinding: function (date) {
        var returnDate = '';
        var splitDateTime = date.split(" ");
        var splitDate = splitDateTime[0].split("-");
        returnDate = splitDate[1] + "/" + splitDate[2] + "/" + splitDate[0];
        return returnDate;
    },
    GetFollowUps: function () {
        $.ajax({
            url: "/Prospect/Dashboard/GetFollowUpsData",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'UserId': UserId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: LeadDashboardUtil.BindFollowUps,
            error: ShowAjaxError
        });
    },
    BindFollowUps: function (response) {
        $("#ui_tbody_MyFollowUps").html("");
        if (response != null && response != undefined && response.Table.length > 0) {
            var reportTableTrs;
            $.each(response.Table, function () {
                var getFlatter = this.Name != null ? this.Name.substring(0, 1) : ``;
                var Name = this.Name != null ? this.Name : ``;
                var EmailId = this.EmailId != null ? this.EmailId : ``;
                var PhoneNumber = this.PhoneNumber != null ? this.PhoneNumber : ``;
                var stageStyle = `style='background-color:${this.IdentificationColor};'`;
                reportTableTrs += `<tr>
                    <td class='text-center addurl'><div class='namealphawrp' onclick="ShowContactUCP('','',${this.ContactId});"><h6>${getFlatter}</h6></div ></td>
                    <td><div class='lmstdclmnwrp'><span class='lmsleadname'>${Name}</span><span class='lmsleadem'>${EmailId}</span><span class='lmsleadph'>${PhoneNumber}</span></div></td>
                    <td><div class='lmssumstagewrp'><span class='lmsstagedot' ${stageStyle}></span><span class='lmsleadph'>${this.StageName}</span></div></td>
                    <td>${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.FollowUpDate))}<span class='d-block'>${PlumbTimeFormat(GetJavaScriptDateObj(this.FollowUpDate))}</span></td>
                    </tr>`;
            });
            $("#ui_tbl_MyFollowUps").removeClass('no-data-records');
            $("#ui_tbody_MyFollowUps").html(reportTableTrs);
        }
        else
            SetNoRecordContent('ui_tbl_MyFollowUps', 4, 'ui_tbody_MyFollowUps');
        LeadDashboardUtil.LeadsWonLost();
    },
    LeadsWonLost: function () {
        $.ajax({
            url: "/Prospect/Dashboard/LeadWonLostReport",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'Duration': duration, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'UserId': UserId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (response) {
                var CompareFirstData = { LeadWon: 0, LeadLost: 0 };
                if (response != null && response != undefined) {
                    var Content = "", total = 0;
                    if (response.TotalWin.length > 0) {
                        Content = "", total = 0;
                        for (var i = 0; i < response.TotalWin.length; i++) {
                            total += parseInt(response.TotalWin[i]);
                            if (parseInt(response.TotalWin[i]) > 0)
                                Content += "<div class='bargrp ht-" + LeadDashboardUtil.DecideLeadWonLostBarHeight(response.TotalWin[i]) + "' style='height:" + LeadDashboardUtil.DecideLeadWonLostBarHeight(response.TotalWin[i]) + "%;'></div>";
                        }
                        CompareFirstData.LeadWon = total;
                        $("#ui_h1_LeadWon").html(total);
                        $("#ui_div_LeadWonReport").empty();
                        $("#ui_div_LeadWonReport").html(Content);
                    }
                    if (response.TotalLost.length > 0) {
                        Content = "", total = 0;
                        for (var j = 0; j < response.TotalLost.length; j++) {
                            total += parseInt(response.TotalLost[j]);
                            if (parseInt(response.TotalLost[j]) > 0)
                                Content += "<div class='bargrplst ht-" + LeadDashboardUtil.DecideLeadWonLostBarHeight(response.TotalLost[j]) + "' style='height:" + LeadDashboardUtil.DecideLeadWonLostBarHeight(response.TotalLost[j]) + "%;'></div>";
                        }
                        CompareFirstData.LeadLost = total;
                        $("#ui_h1_LeadLost").html(total);
                        $("#ui_div_LeadLostReport").empty();
                        $("#ui_div_LeadLostReport").html(Content);
                    }
                }
                LeadDashboardUtil.GetOverAllComparision(CompareFirstData);
            },
            error: ShowAjaxError
        });
    },
    GetOverAllComparision: function (CompareFirstData) {
        var from_Date = CalculateDateDifference();
        $.ajax({
            url: "/Prospect/Dashboard/LeadWonLostReport",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'Duration': duration, 'FromDateTime': from_Date, 'ToDateTime': FromDateTime, 'UserId': UserId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                LeadDashboardUtil.BindOverAllComparision(response, CompareFirstData);
            },
            error: ShowAjaxError
        });
    },
    BindOverAllComparision: function (response, CompareFirstData) {
        var CompareSecondData = { LeadWon: 0, LeadLost: 0 };
        var PerCentValue = 0, comparisionContent = "";
        if (response != null && response != undefined) {
            var total = 0;
            if (response.TotalWin.length > 0) {
                total = 0;
                for (var i = 0; i < response.TotalWin.length; i++) {
                    total += parseInt(response.TotalWin[i]);
                }
                CompareSecondData.LeadWon = total;
            }
            if (response.TotalLost.length > 0) {
                total = 0;
                for (var j = 0; j < response.TotalLost.length; j++) {
                    total += parseInt(response.TotalLost[j]);
                }
                CompareSecondData.LeadLost = total;
            }
        }

        PerCentValue = CalculatePercentage(CompareFirstData.LeadWon, CompareSecondData.LeadWon);
        if (CompareSecondData.LeadWon == CompareFirstData.LeadWon) {
            comparisionContent += "<i class='fa fa-caret-up'></i><span>" + PerCentValue + "%</span></p>";
        }
        else if (CompareFirstData.LeadWon > CompareSecondData.LeadWon) {
            comparisionContent += "<i class='fa fa-caret-up'></i><span>" + PerCentValue + "%</span>";
        }
        else if (CompareFirstData.LeadWon < CompareSecondData.LeadWon) {
            comparisionContent += "<i class='fa fa-caret-down'></i><span>" + PerCentValue + "%</span>";
        }
        $("#ui_p_LeadWon").html(comparisionContent);

        comparisionContent = "";
        PerCentValue = CalculatePercentage(CompareFirstData.LeadLost, CompareSecondData.LeadLost);
        if (CompareSecondData.LeadLost == CompareFirstData.LeadLost) {
            comparisionContent += "<i class='fa fa-caret-up'></i><span>" + PerCentValue + "%</span>";
        }
        else if (CompareFirstData.LeadLost > CompareSecondData.LeadLost) {
            comparisionContent += "<i class='fa fa-caret-up'></i><span>" + PerCentValue + "%</span>";
        }
        else if (CompareFirstData.LeadLost < CompareSecondData.LeadLost) {
            comparisionContent += "<i class='fa fa-caret-down'></i><span>" + PerCentValue + "%</span>";
        }
        $("#ui_p_LeadLost").html(comparisionContent);
        LeadDashboardUtil.DestroyCharts();
    },
    DestroyCharts: function () {
        if (topStagesGraph) {
            topStagesGraph.destroy();
        }
        if (topSourcesGraph) {
            topSourcesGraph.destroy();
        }
        LeadDashboardUtil.TopStages();
    },
    TopStages: function () {
        $.ajax({
            url: "/Prospect/Dashboard/GetTopStages",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'UserId': UserId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: LeadDashboardUtil.BindStagesResponse,
            error: ShowAjaxError
        });
    },
    BindStagesResponse: function (response) {
        Chart.plugins.unregister(ChartDataLabels);
        Chart.defaults.global.defaultFontSize = 10;
        Chart.defaults.global.legend.labels.boxWidth = 10;


        var stageName = [], leadCount = [], stageColor = [];
        if (response != null && response != undefined && response.Table.length > 0) {
            $.each(response.Table, function (i) {
                stageName.push(this.Stage);
                leadCount.push(this.NumberOfLead);
                stageColor.push(this.IdentificationColor);
            });
        }

        topStagesGraph = new Chart(document.getElementById("ui_canvas_TopStages"), {
            plugins: [ChartDataLabels],
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
                }
            }
        });
        LeadDashboardUtil.TopSources();
    },
    TopSources: function () {
        $.ajax({
            url: "/Prospect/Dashboard/GetTopSources",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'UserId': UserId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: LeadDashboardUtil.BindSourcesResponse,
            error: ShowAjaxError
        });
    },
    BindSourcesResponse: function (response) {
        Chart.plugins.unregister(ChartDataLabels);
        Chart.defaults.global.defaultFontSize = 10;
        Chart.defaults.global.legend.labels.boxWidth = 10;

        var sourceName = [], leadCount = [];
        if (response != null && response != undefined && response.Table.length > 0) {
            for (var i = 0; i < response.Table.length; i++) {

                sourceName.push(response.Table[i].Name);
                leadCount.push(response.Table[i].LeadCount);
            }
        }

        topSourcesGraph = new Chart(document.getElementById("ui_canvas_TopSources"), {
            plugins: [ChartDataLabels],
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
                }
            }
        });
        HidePageLoading();
    },
    DecideLeadWonLostBarHeight: function (value) {
        if (value > 0 && value < 100) {
            if (value > 0 && value < 10)
                value = 10;
            else if (value > 90 && value < 100)
                value = 100;
            else {
                var str = value.toString().split("");
                value = (parseInt(str[0]) + 1) * 10;
            }
        }
        else if (value > 100)
            value = 100;
        return value;
    }
}

$("#lmsallusername").select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$("#lmsallusername").on('change', function () {
    UserId = parseInt($("#lmsallusername").val());
    CallBackFunction();
});

$('.strtimpinfo').popover({
    trigger: 'hover',
    placement: 'top'
})