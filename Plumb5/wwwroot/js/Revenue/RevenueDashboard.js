var RevenuecustomEventOverViewId = '0';
var RevenueTransactionForGraph;
var RevenueTransactionForReport;

var currencytype = 'usd';
var Currency = "usd";
var NoOfColumn = 3;
var _currencyclass;
var RevenueGraph;
var RevenueTransactiondropdownvalue = 'Revenue';
var GraphItem = { ShortDate: [], Totalrevenue: [], Directrevenue: [], campaignrevenue: [] };
$(document).ready(function () {
    ExportFunctionName = "ExportDashboardReport";
    GetUTCDateTimeRange(2);

    DashboardReportUtil.Getrevenuesettingsfieldnames();
});
function CallBackFunction() {
    DestroyAllCharts();
    GraphItem.ShortDate.length = 0; GraphItem.Totalrevenue.length = 0; GraphItem.Directrevenue.length = 0; GraphItem.campaignrevenue.length = 0
    Bindchart(GraphItem, 'Revenue');
    RevenueTransactionForGraph = 0;
    RevenueTransactionForReport = 0;
    //$("#revenueortransactiontype").select2().val('Revenue').trigger('change');
    /*if (RevenuecustomEventOverViewId != '0')*/
    DashboardReportUtil.GetCstmaxcount(RevenuecustomEventOverViewId);
    ShowPageLoading();

    TotalRowCount = 0;
    CurrentRowCount = 0;

}
function CallBackPaging() {

    ShowPageLoading();
    CurrentRowCount = 0;
    DashboardReportUtil.revenuetransactiondetails(RevenuecustomEventOverViewId);
}
var TotalRowCount = 0;
var DashboardReportUtil = {
    Getrevenuesettingsfieldnames: function () {
        var triggerevalue = [];
        $.ajax({
            url: "/Revenue/RevenueDashboard/GetFieldsName",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && response != undefined && response.length != 0) {

                    $.each(response, function () {
                        Currency = $(this)[0].CurrencyType;
                        _currencyclass = 'class="fa fa-' + $(this)[0].CurrencyType + '"';
                        $('#revenueeventnames').append('<option value="' + this.CustomEventOverViewId + '">' + this.CustomEventName + '</option>');
                        triggerevalue.push(this.CustomEventOverViewId);
                    });
                    $("#revenueeventnames").select2().val(triggerevalue[0]).trigger('change');
                }

                HidePageLoading();
            },
            error: ShowAjaxError
        });


    },
    GetCstmaxcount: function (RevenuecustomEventOverViewId) {

        $.ajax({
            url: "/Revenue/RevenueDashboard/MaxCount",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'customeventoverviewid': RevenuecustomEventOverViewId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = 0;
                if (response != undefined && response != null && response.returnVal > 0) {
                    TotalRowCount = response.returnVal;
                }

                if (TotalRowCount > 0) {

                    DashboardReportUtil.revenuetransactiongraph(RevenuecustomEventOverViewId);
                    DashboardReportUtil.revenuetransactiondetails(RevenuecustomEventOverViewId);
                    ShowExportDiv(true);
                    ShowPagingDiv(true);
                }
                else {
                    $("#ui_tbodyReportData").empty();
                    SetNoRecordContent('ui_tableReport', NoOfColumn, 'ui_tbodyReportData');
                    $("#lbltotalrevenue").empty().html("<h2 class='revenuecur pb-2'>" + ToCurrency(0) + "</h2>")
                    $("#lbluploadedrevenue").empty().html("<h2 class='revenuecur pb-2'>" + ToCurrency(0) + "</h2>")
                    $("#lblcampaignsrevenue").empty().html("<h2 class='revenuecur pb-2'>" + ToCurrency(0) + "</h2>")
                    ShowExportDiv(false);
                    ShowPagingDiv(false);
                    HidePageLoading();
                }

            }
        })

    },
    revenuetransactiongraph: function (RevenuecustomEventOverViewId) {

        $.ajax({
            url: "/Revenue/RevenueDashboard/GetDetails",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'customEventOverViewId': RevenuecustomEventOverViewId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'OffSet': 0, 'FetchNext': 0, 'BindType': 'Report' }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: DashboardReportUtil.Bindgraph,
            error: ShowAjaxError
        });


    },
    Bindgraph: function (response) {

        var GraphItemDate = [];

        if (response !== undefined && response !== null && response.Table1 !== undefined && response.Table1 !== null && response.Table1.length > 0) {
            RevenueTransactionForGraph = response;
            $.each(response.Table1, function () {
                var currentDateData = ConvertDateObjectToDateTime(this.EventTime);
                GraphItemDate.push({ Date: currentDateData, overallrevenue: this.overall, directrevenue: this.direct });

            });

            GraphItem.ShortDate.length = 0; GraphItem.Totalrevenue.length = 0; GraphItem.Directrevenue.length = 0; GraphItem.campaignrevenue.length = 0
            let datedata = GetDateCountForGraphData(GraphItemDate, FromDateTime, ToDateTime);
            if (datedata != undefined && datedata != null && datedata.length > 0) {
                var _totalrevenue = 0;
                var _directrevenue = 0;


                for (let i = 0; i < datedata.length; i++) {
                    GraphItem.ShortDate.push(monthDetials[datedata[i].Date.getMonth()] + " " + datedata[i].Date.getDate());
                    if (datedata[i].Count == 0) {
                        GraphItem.Totalrevenue.push(0);
                        GraphItem.Directrevenue.push(0);
                    } else {
                        _totalrevenue += datedata[i].overallrevenue;
                        _directrevenue += datedata[i].directrevenue;
                        GraphItem.Totalrevenue.push(datedata[i].overallrevenue);
                        GraphItem.Directrevenue.push(datedata[i].directrevenue);
                    }
                }

                $("#lbltotalrevenue").empty().html("<h2 class='revenuecur pb-2'>" + ToCurrency(_totalrevenue) + "</h2>")
                $("#lbluploadedrevenue").empty().html("<h2 class='revenuecur pb-2'>" + ToCurrency(_directrevenue) + "</h2>")
                $("#lblcampaignsrevenue").empty().html("<h2 class='revenuecur pb-2'>" + ToCurrency((_totalrevenue - _directrevenue)) + "</h2>")

            }

        }
        DestroyAllCharts();
        if ($("#revenueortransactiontype").val() == 'Revenue')
            Bindchart(GraphItem, 'Revenue');
        if ($("#revenueortransactiontype").val() == 'Transaction')
            Bindtransactiondetails('Transaction');
        HidePageLoading();
    },
    revenuetransactiondetails: function (RevenuecustomEventOverViewId) {

        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/Revenue/RevenueDashboard/GetDetails",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'customEventOverViewId': RevenuecustomEventOverViewId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext, 'BindType': 'Report' }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: DashboardReportUtil.BindReport,
            error: ShowAjaxError
        });


    },
    BindReport: function (response) {
        CurrentRowCount = response.Table1.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        if (response !== undefined && response !== null && response.Table1 !== undefined && response.Table1 !== null && response.Table1.length > 0) {
            RevenueTransactionForReport = response;
            var reportTableTrs;
            if (RevenueTransactiondropdownvalue == 'Revenue') {
                $.each(response.Table1, function () {
                    var currentDateData = ConvertDateObjectToDateTime(this.EventTime);
                    reportTableTrs += "<tr>" +
                        "<td>" + monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate() + "</td>" +
                        "<td>" + ToCurrency(this.overall) + "</td>" +
                        "<td class='text-right'>" + ToCurrency(this.overall / this.TotalTransactioncount) + "</td> " +
                        "</tr> ";

                });
                $("#ui_tblReportData").removeClass('no-data-records');
                $("#ui_tbodyReportData").html(reportTableTrs);
            }
            else {
                $.each(response.Table1, function () {
                    var currentDateData = ConvertDateObjectToDateTime(this.EventTime);
                    var startdate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 00:00:00";
                    var enddate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 23:59:59";

                    var fromdate = ConvertDateTimeToUTC(startdate);
                    fromdate = fromdate.getFullYear() + '-' + PrefixZero((fromdate.getMonth() + 1)) + '-' + PrefixZero(fromdate.getDate()) + " " + PrefixZero(fromdate.getHours()) + ":" + PrefixZero(fromdate.getMinutes()) + ":" + PrefixZero(fromdate.getSeconds());

                    var todate = ConvertDateTimeToUTC(enddate);
                    todate = todate.getFullYear() + '-' + PrefixZero((todate.getMonth() + 1)) + '-' + PrefixZero(todate.getDate()) + " " + PrefixZero(todate.getHours()) + ":" + PrefixZero(todate.getMinutes()) + ":" + PrefixZero(todate.getSeconds());

                    reportTableTrs += "<tr>" +
                        "<td>" + monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate() + "</td>" +
                        "<td><a href='/Revenue/RevenueCustomEventViewDetails?dur=0&RevenuecustomEventOverViewId=" + RevenuecustomEventOverViewId + "&Frm=" + fromdate + "&To=" + todate + "&Tonum=" + this.TotalTransactioncount + "&Ename=" + $('#select2-revenueeventnames-container').attr("title") + "'>" + this.TotalTransactioncount + "</a></td>" +
                        "</tr> ";
                });
                $("#ui_tblReportData").removeClass('no-data-records');
                $("#ui_tbodyReportData").html(reportTableTrs);
            }
            HidePageLoading();
        }
    },
    GetTransactionReport: function (eventtime, transactioncount) {

        window.location.href = "/Revenue/RevenueCustomEventViewDetails?RevenuecustomEventOverViewId=" + RevenuecustomEventOverViewId + "&&EventTime=" + eventtime + "&&Tcount=" + transactioncount + "";
    }
}
function Bindchart(GraphItem, type) {

    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    RevenueGraph = new Chart(document.getElementById("sessionsData"), {
        type: 'bar',
        data: {
            labels: GraphItem.ShortDate,
            datasets: [{
                data: GraphItem.Totalrevenue,
                label: `Total ${type} ${GetCurrencySymbol()}`,
                borderWidth: 1,
                borderColor: 'rgba(195, 80, 83)',
                backgroundColor: 'rgba(211, 94, 96, 0.9)',
                fill: true
            },
            {
                data: GraphItem.Directrevenue,
                label: `Plumb5 Visitors ${GetCurrencySymbol()}`,
                borderWidth: 1,
                borderColor: ' rgba(98, 130, 183)',
                backgroundColor: ' rgba(114, 147, 203, 0.9)',
                fill: true
            },
            {

                data: Differenceofrevenue(GraphItem),
                label: `Campaigns ${GetCurrencySymbol()}`,
                borderWidth: 1,
                borderColor: ' rgba(118, 170, 79)',
                backgroundColor: ' rgba(132, 186, 91, 0.9)',
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
    })
}
function Differenceofrevenue(GraphItem) {
    var x = GraphItem.Totalrevenue.map(function (item, index) {
        return item - GraphItem.Directrevenue[index];
    })
    return x;
}
$('#revenueeventnames').on('change', function () {

    RevenuecustomEventOverViewId = this.value;

    CallBackFunction();

});
$('#revenueortransactiontype').on('change', function () {

    RevenueTransactiondropdownvalue = this.value;
    if (RevenueTransactiondropdownvalue != 'Select')
        Bindtransactiondetails(RevenueTransactiondropdownvalue);


});

function Bindtransactiondetails(dropdownselectedvalue) {
    PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
    var GraphItem = { ShortDate: [], Totalrevenue: [], Directrevenue: [], campaignrevenue: [] };
    var GraphItemDate = [];
    var lbltype = "";
    if (RevenueTransactionForGraph !== undefined && RevenueTransactionForGraph !== null && RevenueTransactionForGraph.Table1 !== undefined && RevenueTransactionForGraph.Table1 !== null && RevenueTransactionForGraph.Table1.length > 0) {
        //ShowExportDiv(true);
        //ShowPagingDiv(true);

        var reportTableTrs;
        if (dropdownselectedvalue == 'Transaction') {
            DestroyAllCharts();
            lbltype = 'Transaction';
            ChangeHeader()
            $("#lbltotaltype").text('Total Transaction Done');
            $("#lbldirecttype").text('Transaction Through Uploaded Data');
            $("#lblcampaigntype").text('Transaction Through Campaigns');

            $.each(RevenueTransactionForGraph.Table1, function () {
                var currentDateData = ConvertDateObjectToDateTime(this.EventTime);

                GraphItemDate.push({ Date: currentDateData, overallrevenue: this.TotalTransactioncount, directrevenue: this.DirectTransactioncount });

            });

            for (let i = 0; i < RevenueTransactionForGraph.Table1.length; i++) {

                var currentDateData = ConvertDateObjectToDateTime(RevenueTransactionForGraph.Table1[i].EventTime);
                var startdate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 00:00:00";
                var enddate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 23:59:59";

                var fromdate = ConvertDateTimeToUTC(startdate);
                fromdate = fromdate.getFullYear() + '-' + PrefixZero((fromdate.getMonth() + 1)) + '-' + PrefixZero(fromdate.getDate()) + " " + PrefixZero(fromdate.getHours()) + ":" + PrefixZero(fromdate.getMinutes()) + ":" + PrefixZero(fromdate.getSeconds());

                var todate = ConvertDateTimeToUTC(enddate);
                todate = todate.getFullYear() + '-' + PrefixZero((todate.getMonth() + 1)) + '-' + PrefixZero(todate.getDate()) + " " + PrefixZero(todate.getHours()) + ":" + PrefixZero(todate.getMinutes()) + ":" + PrefixZero(todate.getSeconds());

                reportTableTrs += "<tr>" +
                    "<td>" + monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate() + "</td>" +
                    "<td><a href='/Revenue/RevenueCustomEventViewDetails?dur=0&RevenuecustomEventOverViewId=" + RevenuecustomEventOverViewId + "&Frm=" + fromdate + "&To=" + todate + "&Tonum=" + RevenueTransactionForGraph.Table1[i].TotalTransactioncount + "&Ename=" + $('#select2-revenueeventnames-container').attr("title") + "'>" + RevenueTransactionForGraph.Table1[i].TotalTransactioncount + "</a></td>" +
                    "</tr> ";
                if (i == 9)
                    break;
            }


        }
        else if (dropdownselectedvalue == 'Revenue') {
            lbltype = 'Revenue';
            DestroyAllCharts();
            ChangeHeader()
            $("#lbltotaltype").text('Total Revenue Generated');
            $("#lbldirecttype").text('Revenue Through Uploaded Data');
            $("#lblcampaigntype").text('Revenue Through Campaigns');
            $.each(RevenueTransactionForGraph.Table1, function () {
                var currentDateData = ConvertDateObjectToDateTime(this.EventTime);

                GraphItemDate.push({ Date: currentDateData, overallrevenue: this.overall, directrevenue: this.direct });
            });
            for (let i = 0; i < RevenueTransactionForGraph.Table1.length; i++) {

                var currentDateData = ConvertDateObjectToDateTime(RevenueTransactionForGraph.Table1[i].EventTime);
                reportTableTrs += "<tr>" +
                    "<td>" + monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate() + "</td>" +
                    "<td>" + ToCurrency(RevenueTransactionForGraph.Table1[i].overall) + "</td>" +
                    "<td class='text-right'>" + ToCurrency(RevenueTransactionForGraph.Table1[i].overall / RevenueTransactionForGraph.Table1[i].TotalTransactioncount) + "</td> " +
                    "</tr> ";

                if (i == 9)
                    break;
            }
        }
        else {
            SetNoRecordContent('ui_tableReport', NoOfColumn, 'ui_tbodyReportData');

        }
    }
    GraphItem.ShortDate.length = 0; GraphItem.Totalrevenue.length = 0; GraphItem.Directrevenue.length = 0; GraphItem.campaignrevenue.length = 0
    let datedata = GetDateCountForGraphData(GraphItemDate, FromDateTime, ToDateTime);
    if (datedata != undefined && datedata != null && datedata.length > 0) {
        var _totalrevenue = 0;
        var _directrevenue = 0;

        for (let i = 0; i < datedata.length; i++) {
            GraphItem.ShortDate.push(monthDetials[datedata[i].Date.getMonth()] + " " + datedata[i].Date.getDate());
            if (datedata[i].Count == 0) {
                GraphItem.Totalrevenue.push(0);
                GraphItem.Directrevenue.push(0);
            } else {
                _totalrevenue += datedata[i].overallrevenue;
                _directrevenue += datedata[i].directrevenue;
                GraphItem.Totalrevenue.push(datedata[i].overallrevenue);
                GraphItem.Directrevenue.push(datedata[i].directrevenue);
            }
        }
        if (dropdownselectedvalue == 'Revenue') {

            $("#lbltotalrevenue").empty().html("<h2 class='revenuecur pb-2'>" + ToCurrency(_totalrevenue) + "</h2>")
            $("#lbluploadedrevenue").empty().html("<h2 class='revenuecur pb-2'>" + ToCurrency(_directrevenue) + "</h2>")
            $("#lblcampaignsrevenue").empty().html("<h2 class='revenuecur pb-2'></i>" + ToCurrency((_totalrevenue - _directrevenue)) + "</h2>")
        }
        else {
            $("#lbltotalrevenue").empty().html("<h2 class='revenuecur pb-2'> <i class='fa fa - 0'></i>" + _totalrevenue + "</h2>")
            $("#lbluploadedrevenue").empty().html("<h2 class='revenuecur pb-2'><i class='fa fa - 0'></i>" + _directrevenue + "</h2>")
            $("#lblcampaignsrevenue").empty().html("<h2 class='revenuecur pb-2'><i class='fa fa - 0'></i>" + (_totalrevenue - _directrevenue) + "</h2>")
        }


        $("#ui_tbodyReportData").empty();
        //SetNoRecordContent('ui_tableReport', NoOfColumn, 'ui_tbodyReportData');
        $("#ui_tbodyReportData").html(reportTableTrs);

    }
    else {
        if (dropdownselectedvalue == 'Transaction') {
            lbltype = 'Transaction';
            $("#lbltotalrevenue").empty().html("<h2 class='revenuecur pb-2'> <i class='fa fa - 0'></i>" + 0 + "</h2>")
            $("#lbluploadedrevenue").empty().html("<h2 class='revenuecur pb-2'><i class='fa fa - 0'></i>" + 0 + "</h2>")
            $("#lblcampaignsrevenue").empty().html("<h2 class='revenuecur pb-2'><i class='fa fa - 0'></i>" + 0 + "</h2>")
            $("#ui_tbodyReportData").empty();
            SetNoRecordContent('ui_tableReport', 2, 'ui_tbodyReportData');
            ChangeHeader()
        }
        else {
            lbltype = 'Revenue';
            $("#lbltotalrevenue").empty().html("<h2 class='revenuecur pb-2'>" + ToCurrency(0) + "</h2>")
            $("#lbluploadedrevenue").empty().html("<h2 class='revenuecur pb-2'>" + ToCurrency(0) + "</h2>")
            $("#lblcampaignsrevenue").empty().html("<h2 class='revenuecur pb-2'></i>" + ToCurrency(0) + "</h2>")

            $("#ui_tbodyReportData").empty();
            SetNoRecordContent('ui_tableReport', 3, 'ui_tbodyReportData');
            ChangeHeader()
        }
    }
    Bindchart(GraphItem, lbltype);
    HidePageLoading();
}
$("#ui_exportOrDownload").click(function () {
    ExportFunctionName = "ExportDashboardReport";
    $("#ui_ddl_ExportDataRange").attr("disabled", false);
});

function GetCurrencySymbol() {
    if ($("#revenueortransactiontype").val() == "Transaction") {
        return "";
    } else {
        if (Currency.toLowerCase() == "inr") {
            $("#ui_BindRevenueRupees,#ui_BindUserRupees").html("(₹)");
            return "(₹)";
        }
        else {
            $("#ui_BindRevenueRupees,#ui_BindUserRupees").html("($)");
            return "($)";
        }
    }
}
function ChangeHeader() {
    if ($("#revenueortransactiontype").val() == "Transaction") {
        NoOfColumn = 2;
        $("#ui_useraverage").addClass("hideDiv");
        $("#ui_BindRevenueRupees").empty();
        $("#ui_changetextRevenue,#ui_changetextRevenuetooltip").empty().html("Total Transaction");
    } else {
        NoOfColumn = 3;
        $("#ui_changetextRevenue,#ui_changetextRevenuetooltip").empty().html("Revenue Generated");
        $("#ui_useraverage").removeClass("hideDiv");
    }

}

function DestroyAllCharts() {
    if (RevenueGraph) {
        RevenueGraph.destroy();
    }
}
function ToCurrency(number) {
    return number.toLocaleString('en-IN', {
        style: 'currency',
        currency: Currency.toUpperCase()
    });
}