var style = getComputedStyle(document.body);
/* Bar chart background-color */
var BarChartbgColItem1 = style.getPropertyValue(
    "--BarChart-BackgroundColor-Item1"
);
var BarChartbgColItem2 = style.getPropertyValue(
    "--BarChart-BackgroundColor-Item2"
);
var BarChartbgColItem3 = style.getPropertyValue(
    "--BarChart-BackgroundColor-Item3"
);
var BarChartbgColItem4 = style.getPropertyValue(
    "--BarChart-BackgroundColor-Item4"
);
var BarChartbgColItem5 = style.getPropertyValue(
    "--BarChart-BackgroundColor-Item5"
);
var BarChartbgColItem6 = style.getPropertyValue(
    "--BarChart-BackgroundColor-Item6"
);
var BarChartbgColItem7 = style.getPropertyValue(
    "--BarChart-BackgroundColor-Item7"
);
var BarChartbgColItem8 = style.getPropertyValue(
    "--BarChart-BackgroundColor-Item8"
);

var AttrModellist;
var AttrModelId = 0;
var arrPageUrl = new Array();
var ModelGraphSelectedId = 0;

$(document).ready(function () {
    GetUTCDateTimeRange(2);
    //setTimeout(function () { GetUTCDateTimeRange(2); }, 1000);
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    AttrModelUtil.MaxCount();
    setTimeout(function () { LoadGraph(); }, 1000);

    //let getattribvaltitle = $("#attribmodbar option:selected").val();

    //if (getattribvaltitle.toLowerCase() == "first interaction attribution") 
    //    GetGraphPageDetails("FirstInteraction", ModelGraphSelectedId);
    //else if (getattribvaltitle.toLowerCase() == "last interaction attribution") 
    //    GetGraphPageDetails("LastInteraction", ModelGraphSelectedId);
    //else if (getattribvaltitle.toLowerCase() == "linear attribution") 
    //    GetGraphPageDetails("Linear", ModelGraphSelectedId);
    //else if (getattribvaltitle.toLowerCase() == "position based attribution") 
    //    GetGraphPageDetails("Position", ModelGraphSelectedId);
    //else if (getattribvaltitle.toLowerCase() == "time decay attribution") 
    //    GetGraphPageDetails("Time", ModelGraphSelectedId);
}

function LoadGraph() {
    let getattribvaltitle = $("#attribmodbar option:selected").val();

    if (getattribvaltitle.toLowerCase() == "first interaction attribution")
        GetGraphPageDetails("FirstInteraction", ModelGraphSelectedId);
    else if (getattribvaltitle.toLowerCase() == "last interaction attribution")
        GetGraphPageDetails("LastInteraction", ModelGraphSelectedId);
    else if (getattribvaltitle.toLowerCase() == "linear attribution")
        GetGraphPageDetails("Linear", ModelGraphSelectedId);
    else if (getattribvaltitle.toLowerCase() == "position based attribution")
        GetGraphPageDetails("Position", ModelGraphSelectedId);
    else if (getattribvaltitle.toLowerCase() == "time decay attribution")
        GetGraphPageDetails("Time", ModelGraphSelectedId);
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;
    AttrModelUtil.GetReport();
}

var AttrModelUtil = {
    MaxCount: function () {
        $.ajax({
            url: "/Analytics/Traffic/AttributionReportCount",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = 0;
                if (response !== undefined && response !== null && response.Table1 !== undefined && response.Table1 !== null && response.Table1.length > 0)
                    TotalRowCount = response.Table1[0].TotalRows;

                if (TotalRowCount > 0)
                    AttrModelUtil.GetReport();
                else {
                    $('#dvAttrModelReport').addClass('hideDiv');
                    $('.nodatadashwrp').removeClass('hideDiv');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetReport: function () {
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/Analytics/Traffic/AttributionReport",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'start': OffSet, 'end': FetchNext }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: AttrModelUtil.BindReport,
            error: ShowAjaxError
        });
    },
    BindReport: function (response) {
        if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
            AttrModellist = response.Table1;
            $('#dvAttrModelReport').removeClass('hideDiv');
            $('.nodatadashwrp').addClass('hideDiv');
            CurrentRowCount = response.Table1.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            $("#ui_tbodyReportData").html('');
            $("#ui_tableReport").removeClass('no-data-records');
            $('.goadNametit').html(response.Table1[0].GoalName);
            var reportTableTrs;

            $.each(response.Table1, function (i) {
                if (i == 0 && OffSet == 0) {
                    ModelGraphSelectedId = this.AttributionId;
                    reportTableTrs += "<tr data-attrmodelId=" + this.AttributionId + " class='active'>";
                    $(".goadNametit").html(this.ModelName);
                }
                else {
                    reportTableTrs += "<tr data-attrmodelId=" + this.AttributionId + ">";
                }

                reportTableTrs +=
                    "<td>" +
                    "<div class='groupnamewrap'>" +
                    "<div class='nameTxtWrap'>" + this.ModelName + "</div>" +
                    "<div class='tdcreatedraft'>" +
                    "<div class='dropdown'> " +
                    "<button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='icon ion-android-more-vertical mr-0'></i></button>" +
                    "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='filterbycontacts'>" +
                    "<a class='dropdown-item'  href='javascript:void(0)' onclick='AttrModelUtil.Edit(" + this.AttributionId + ");'>Edit</a> <div class='dropdown-divider'></div >" +
                    "<a data-toggle='modal' data-target='#deleterow' class='dropdown-item' data-actiontype='delete' href='javascript:void(0)' onclick=\"AttrModelUtil.DeleteGoalConfirm(" + this.AttributionId + ");\">Delete</a>" +
                    "</div></div></div></div>" +
                    "</td>" +
                    "<td class='td-wid-10 wordbreak'>" + $.datepicker.formatDate("M dd yy", ConvertUTCDateTimeToLocal(this.Date)) + " " + PlumbTimeFormat(ConvertUTCDateTimeToLocal(this.Date)) + "</td>" +
                    "</tr>";
            });
            $("#ui_tableReport").removeClass('no-data-records');
            $("#ui_tbodyReportData").html(reportTableTrs);
        }
        else {
            AttrModellist = "";
            $('#dvAttrModelReport').addClass('hideDiv');
            $('.nodatadashwrp').removeClass('hideDiv');
            ShowPagingDiv(false);
        }
        HidePageLoading();
    },
    ValidateAttrModelDetails: function () {
        if ($.trim($("#txt_ModelName").val()).length === 0) {
            ShowErrorMessage(GlobalErrorList.AttributionModel.ModelName_Error);
            HidePageLoading();
            return false;
        }

        if ($.trim($("#txt_PageName").val()).length === 0) {
            ShowErrorMessage(GlobalErrorList.AttributionModel.PageName_Error);
            HidePageLoading();
            return false;
        }

        if (!regExpUrl.test($.trim($("#txt_PageName").val()))) {
            $("#txt_PageName").focus();
            ShowErrorMessage(GlobalErrorList.AttributionModel.InValidPageUrl);
            return false;
        }

        var attrmodelname = $.trim($("#txt_ModelName").val());

        if (AttrModellist != null && AttrModellist.length > 0) {
            var attrmodelItem;

            if (AttrModelId == 0) {
                attrmodelItem = JSLINQ(AttrModellist).Where(function () {
                    return (this.ModelName.toLowerCase() == attrmodelname.toLowerCase());
                });
            }
            else {
                attrmodelItem = JSLINQ(AttrModellist).Where(function () {
                    return (this.ModelName.toLowerCase() == attrmodelname.toLowerCase() && this.AttributionId != AttrModelId);
                });
            }

            if (attrmodelItem != null && attrmodelItem != undefined && attrmodelItem.items[0] != null && attrmodelItem.items[0] != "" && attrmodelItem.items[0] != undefined) {
                ShowErrorMessage(GlobalErrorList.AttributionModel.ModelName_ExistMessage);
                return false;
            }
        }

        return true;
    },
    ClearFields: function () {
        AttrModelId = 0;
        $("#txt_ModelName,#txt_PageName").val("");
        $("#txt_ModelName").removeAttr("disabled");
        $(".popupcontainer").addClass("hideDiv");
    },
    Edit: function (Id) {
        AttrModelId = Id;

        $(".popupcontainer").removeClass("hideDiv");

        var AttrModelDetails = JSLINQ(AttrModellist).Where(function () { return (this.AttributionId == Id); });

        if (AttrModelDetails.items.length > 0) {
            $('#txt_ModelName').val(AttrModelDetails.items[0].ModelName).prop("disabled", true);
            $('#txt_PageName').val(AttrModelDetails.items[0].PageName);
        }
    },
    DeleteGoalConfirm: function (Id) {
        $("#deleteRowConfirmAttrModel").attr("onclick", "AttrModelUtil.DeleteGoal(" + Id + ");");
    },
    DeleteGoal: function (Id) {
        ShowPageLoading();
        $.ajax({
            url: "/Analytics/Traffic/AttributionDelete",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'attributionId': Id }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {

                    --CurrentRowCount;
                    --TotalRowCount;

                    PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

                    if (CurrentRowCount <= 0 && TotalRowCount <= 0) {
                        AttrModellist = "";
                        $('#dvAttrModelReport').addClass('hideDiv');
                        $('.nodatadashwrp').removeClass('hideDiv');
                        ShowPagingDiv(false);
                    }

                    ShowSuccessMessage(GlobalErrorList.AttributionModel.AttrModelDelete_Message);
                    AttrModelUtil.GetReport();
                    setTimeout(function () { LoadGraph(); }, 1000);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.AttributionModel.DeleteFailureStatus);
                }
            },
            error: ShowAjaxError
        });
    }
};

$(".attribmodelpop").click(function () {
    AttrModelUtil.ClearFields();
    $(".popupcontainer").removeClass("hideDiv");
    $(".popuptitle h6").html("Create Attribution Model");
    $(".popupsubtitle").addClass("hideDiv");
});

$(document).on("click", ".attribmodedit a", function () {
    $(".popupcontainer").removeClass("hideDiv");
    $(".popuptitle h6").html("Edit Attribution Model");
    $(".popupsubtitle").removeClass("hideDiv");
});

$("#close-popup, .clsepopup").click(function () {
    AttrModelUtil.ClearFields();
    $(this).parents(".popupcontainer").addClass("hideDiv");
    $("tr").removeClass("activeBgRow");
    $(".errmsgemlvalidwrp .ion-ios-information").popover("hide");
});

$("#btnAddAttrModel").click(function () {
    ShowPageLoading();

    if (!AttrModelUtil.ValidateAttrModelDetails()) {
        HidePageLoading();
        return false;
    }

    var modelname = CleanText($("#txt_ModelName").val());
    var pagename = CleanText($("#txt_PageName").val()).toString().replace("http://", "").replace("https://", "").replace("www.", "");

    $.ajax({
        url: "/Analytics/Traffic/SaveAttributionSetting",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'modelName': modelname, 'pageName': pagename }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            switch (parseInt(response)) {
                case 1:
                    ShowSuccessMessage(GlobalErrorList.AttributionModel.AttributionModelCreateSuccess);
                    break;
                case 2:
                    ShowSuccessMessage(GlobalErrorList.AttributionModel.AttributionModelUpdateSuccess);
                    break;
                case 3:
                    ShowErrorMessage(GlobalErrorList.AttributionModel.error);
                    break;
            }
            AttrModelUtil.ClearFields();
            HidePageLoading();
            AttrModelUtil.MaxCount();
            //setTimeout(function () { CallBackFunction(); }, 1000);
            setTimeout(function () { LoadGraph(); }, 1000);
        },
        error: ShowAjaxError
    });
});

$("#attribmodbar").change(function () {
    let getattribvaltitle = $("#attribmodbar option:selected").val();
    let getattribvaldescrpt = $("#attribmodbar option:selected").attr("data-attribmoddescpt");
    let getattribmodid = $("#attribmodbar option:selected").attr("data-attribcanid");
    $(".attrmodcanvas").addClass("hideDiv");
    $(".attrhead, .attrbarhead").html(getattribvaltitle);
    $(".attrmoddecrpt").html(getattribvaldescrpt);
    $("#" + getattribmodid).removeClass("hideDiv");

    if (getattribvaltitle.toLowerCase() == "first interaction attribution") {
        GetGraphPageDetails("FirstInteraction", ModelGraphSelectedId);
    }
    else if (getattribvaltitle.toLowerCase() == "last interaction attribution") {
        GetGraphPageDetails("LastInteraction", ModelGraphSelectedId);
    }
    else if (getattribvaltitle.toLowerCase() == "linear attribution") {
        GetGraphPageDetails("Linear", ModelGraphSelectedId);
    }
    else if (getattribvaltitle.toLowerCase() == "position based attribution") {
        GetGraphPageDetails("Position", ModelGraphSelectedId);
    }
    else if (getattribvaltitle.toLowerCase() == "time decay attribution") {
        GetGraphPageDetails("Time", ModelGraphSelectedId);
    }
});

function GetGraphPageDetails(Key, ModelId) {
    ShowPageLoading();
    $.ajax({
        url: "/Analytics/Traffic/BindModelViewReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'modelId': ModelId, 'key': Key }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (Key == "FirstInteraction") {
                BindFirstInteractionPageDetails(response);
            }
            else if (Key == "LastInteraction") {
                BindLastInteractionPageDetails(response);
            }
            else if (Key == "Linear") {
                BindLinearInteractionPageDetails(response);
            }
            else if (Key == "Position") {
                BindPositionInteractionPageDetails(response);
            }
            else if (Key == "Time") {
                BindTimeInteractionPageDetails(response);
            }
        },
        error: ShowAjaxError
    });
}

function BindFirstInteractionPageDetails(response) {
    var GraphItem = { FirstInteraction: [], Percentage: [] };
    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
        $.each(response.Table1, function () {
            var firstint = (this.FirstInteraction == "Null" ? "Direct" : this.FirstInteraction);
            GraphItem.FirstInteraction.push(firstint);
            GraphItem.Percentage.push(this.TotalNos);
        });
    }
    BindFirstInteractionGraph(GraphItem);
}

var FirstInteractionChart;

function BindFirstInteractionGraph(GraphItem) {

    if (FirstInteractionChart) {
        FirstInteractionChart.destroy();
    }

    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    FirstInteractionChart = new Chart(document.getElementById("attrmodelfirst"), {
        plugins: [ChartDataLabels],
        type: 'bar',
        data: {
            labels: GraphItem.FirstInteraction,
            datasets: [{
                data: GraphItem.Percentage,
                label: "Sources",
                borderWidth: 1,
                backgroundColor: [BarChartbgColItem1, BarChartbgColItem2, BarChartbgColItem3, BarChartbgColItem4],
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
    HidePageLoading();
}

//----------------------------------------------------Start Last Interaction------------------------------------------

function BindLastInteractionPageDetails(response) {
    var GraphItem = { LastInteraction: [], Percentage: [] };
    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
        $.each(response.Table1, function () {
            var firstint = (this.LastInteraction == "Null" ? "Direct" : this.LastInteraction);
            GraphItem.LastInteraction.push(firstint);
            GraphItem.Percentage.push(this.TotalNos);
        });
    }
    BindLastInteractionGraph(GraphItem);
}

var LastInteractionChart;

function BindLastInteractionGraph(GraphItem) {

    if (LastInteractionChart) {
        LastInteractionChart.destroy();
    }

    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    LastInteractionChart = new Chart(document.getElementById("attrmodellast"), {
        plugins: [ChartDataLabels],
        type: 'bar',
        data: {
            labels: GraphItem.LastInteraction,
            datasets: [{
                data: GraphItem.Percentage,
                label: "Sources",
                borderWidth: 1,
                backgroundColor: [BarChartbgColItem1, BarChartbgColItem2, BarChartbgColItem3, BarChartbgColItem4],
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
    HidePageLoading();
}

//----------------------------------------------------End Last Interaction--------------------------------------------

//----------------------------------------------------Start Linear Interaction----------------------------------------

function BindLinearInteractionPageDetails(response) {
    var GraphItem = { Referrer: [], Points: [] };
    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
        $.each(response.Table1, function () {
            var firstint = (this.Referrer == "Null" ? "Direct" : this.Referrer);
            GraphItem.Referrer.push(firstint);
            GraphItem.Points.push(this.TotalNos);
        });
    }
    BindLinearInteractionGraph(GraphItem);
}

var LinearInteractionChart;

function BindLinearInteractionGraph(GraphItem) {

    if (LinearInteractionChart) {
        LinearInteractionChart.destroy();
    }

    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    LinearInteractionChart = new Chart(document.getElementById("attrmodellinear"), {
        plugins: [ChartDataLabels],
        type: 'bar',
        data: {
            labels: GraphItem.Referrer,
            datasets: [{
                data: GraphItem.Points,
                label: "Sources",
                borderWidth: 1,
                backgroundColor: [BarChartbgColItem1, BarChartbgColItem2, BarChartbgColItem3, BarChartbgColItem4],
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
    HidePageLoading();
}

//----------------------------------------------------End Linear Interaction---------------------------------------------

//----------------------------------------------------Start Position Based Interaction-----------------------------------

function BindPositionInteractionPageDetails(response) {
    var GraphItem = { Referrer: [], Points: [] };
    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
        $.each(response.Table1, function () {
            var firstint = (this.FirstInteraction == "Null" ? "Direct" : this.FirstInteraction);
            GraphItem.Referrer.push(firstint);
            GraphItem.Points.push(this.TotalNos);
        });
    }
    BindPositionInteractionGraph(GraphItem);
}

var PositionInteractionChart;

function BindPositionInteractionGraph(GraphItem) {

    if (PositionInteractionChart) {
        PositionInteractionChart.destroy();
    }

    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    PositionInteractionChart = new Chart(document.getElementById("attrmodelpost"), {
        plugins: [ChartDataLabels],
        type: 'bar',
        data: {
            labels: GraphItem.Referrer,
            datasets: [{
                data: GraphItem.Points,
                label: "Sources",
                borderWidth: 1,
                backgroundColor: [BarChartbgColItem1, BarChartbgColItem2, BarChartbgColItem3, BarChartbgColItem4],
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
    HidePageLoading();
}

//----------------------------------------------------End Position Based Interaction-----------------------------


//----------------------------------------------------Start Time Based Interaction------------------------------

function BindTimeInteractionPageDetails(response) {
    var GraphItem = { Refer: [], Points: [] };
    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {
        $.each(response.Table1, function () {
            var firstint = (this.Refer == "Null" ? "Direct" : this.Refer) + "[" + (this.Points == null ? "0" : this.Points) + "]";
            var points = (this.Points == null ? "0" : this.Points)
            GraphItem.Refer.push(firstint);
            GraphItem.Points.push(points);
        });
    }
    BindTimeInteractionGraph(GraphItem);
}

var TimeInteractionChart;

function BindTimeInteractionGraph(GraphItem) {

    if (TimeInteractionChart) {
        TimeInteractionChart.destroy();
    }

    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    TimeInteractionChart = new Chart(document.getElementById("attrmodeltime"), {
        plugins: [ChartDataLabels],
        type: 'bar',
        data: {
            labels: GraphItem.Refer,
            datasets: [{
                data: GraphItem.Points,
                label: "Sources",
                borderWidth: 1,
                backgroundColor: [BarChartbgColItem1, BarChartbgColItem2, BarChartbgColItem3, BarChartbgColItem4],
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
    HidePageLoading();
}

//----------------------------------------------------End Time Based Interaction--------------------------


$(document).on("click", ".goalstble .table tr", function () {
    $(".goalstble .table tr").removeClass("active");
    $(this).addClass("active");
    var attrmodelname = $(this).find(".nameTxtWrap").text();
    ModelGraphSelectedId = $(this).attr("data-attrmodelid");
    $(".goadNametit").html(attrmodelname);
    //CallBackFunction();
    LoadGraph();
});