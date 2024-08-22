
var AllSourcesChart;

$(document).ready(function () {
    ExportFunctionName = "AllSourcesExport";
    RemoveExportDataRange();
    GetUTCDateTimeRange(2);
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    GetReport();
}

function GetReport() {
    $.ajax({
        url: "/Analytics/Traffic/AllSourcesReport",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    var GraphItem = { optiondate: [], getdirectcount: [], getsearchcount: [], getrefercount: [], getSocialcount: [], getEmailcount: [], getSmscount: [], getPaidcount: [] };
    var GraphItemDate = [];
    SetNoRecordContent('ui_tblReportData', 8, 'ui_tbodyReportData');
    if (AllSourcesChart) {
        AllSourcesChart.destroy();
    }
    if (response != undefined && response != null && response.Table1 != undefined && response.Table1 != null && response.Table1.length > 0) {

        var reportTableTrs;

        $.each(response.Table1, function () {
            var currentDateData = ConvertDateObjectToDateTime(this.Date);
            var eachDate = monthDetials[currentDateData.getMonth()] + " " + currentDateData.getDate();

            var startdate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 00:00:00";
            var enddate = currentDateData.getFullYear() + '-' + PrefixZero((currentDateData.getMonth() + 1)) + '-' + PrefixZero(currentDateData.getDate()) + " 23:59:59";

            var fromdate = ConvertDateTimeToUTC(startdate);
            fromdate = fromdate.getFullYear() + '-' + PrefixZero((fromdate.getMonth() + 1)) + '-' + PrefixZero(fromdate.getDate()) + " " + PrefixZero(fromdate.getHours()) + ":" + PrefixZero(fromdate.getMinutes()) + ":" + PrefixZero(fromdate.getSeconds());

            var todate = ConvertDateTimeToUTC(enddate);
            todate = todate.getFullYear() + '-' + PrefixZero((todate.getMonth() + 1)) + '-' + PrefixZero(todate.getDate()) + " " + PrefixZero(todate.getHours()) + ":" + PrefixZero(todate.getMinutes()) + ":" + PrefixZero(todate.getSeconds());

            reportTableTrs += "<tr>" +
                "<td>" + eachDate + "</td>" +
                "<td>" + (this.Direct != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + fromdate + "&To=" + todate + "&AllSource=AllDirect'>" + this.Direct + "</a>" : this.Direct) + "</td>" +
                "<td>" + (this.Search != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + fromdate + "&To=" + todate + "&AllSource=AllSearch'>" + this.Search + "</a>" : this.Search) + "</td> " +
                "<td>" + (this.Refer != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + fromdate + "&To=" + todate + "&AllSource=AllRefer'>" + this.Refer + "</a>" : this.Refer) + "</td> " +
                "<td>" + (this.Social != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + fromdate + "&To=" + todate + "&AllSource=AllSocial'>" + this.Social + "</a>" : this.Social) + "</td> " +
                "<td>" + (this.Email != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + fromdate + "&To=" + todate + "&AllSource=AllEmail'>" + this.Email + "</a>" : this.Email) + "</td> " +
                "<td>" + (this.Sms != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + fromdate + "&To=" + todate + "&AllSource=AllSms'>" + this.Sms + "</a>" : this.Sms) + "</td> " +
                "<td>" + (this.Paid != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + fromdate + "&To=" + todate + "&AllSource=AllPaid'>" + this.Paid + "</a>" : this.Paid) + "</td> " +
                "</tr> ";

            GraphItemDate.push({ Date: currentDateData, Count: this.Direct, Search: this.Search, Refer: this.Refer, Social: this.Social, Email: this.Email, Sms: this.Sms, Paid: this.Paid });

        });

        GraphItem.optiondate.length = 0; GraphItem.getdirectcount.length = 0; GraphItem.getsearchcount.length = 0; GraphItem.getrefercount.length = 0; GraphItem.getrefercount.length = 0; GraphItem.getSocialcount.length = 0; GraphItem.getEmailcount.length = 0; GraphItem.getSmscount.length = 0; GraphItem.getPaidcount.length = 0;

        let datedata = GetDateCountForGraphData(GraphItemDate, FromDateTime, ToDateTime);
        if (datedata != undefined && datedata != null && datedata.length > 0) {
            for (let i = 0; i < datedata.length; i++) {
                GraphItem.optiondate.push(monthDetials[datedata[i].Date.getMonth()] + " " + datedata[i].Date.getDate());
                if (datedata[i].Count == 0) {
                    GraphItem.getdirectcount.push(0);
                    GraphItem.getsearchcount.push(0);
                    GraphItem.getrefercount.push(0);
                    GraphItem.getSocialcount.push(0);
                    GraphItem.getEmailcount.push(0);
                    GraphItem.getSmscount.push(0);
                    GraphItem.getPaidcount.push(0);
                } else {
                    GraphItem.getdirectcount.push(datedata[i].Count);
                    GraphItem.getsearchcount.push(datedata[i].Search);
                    GraphItem.getrefercount.push(datedata[i].Refer);
                    GraphItem.getSocialcount.push(datedata[i].Social);
                    GraphItem.getEmailcount.push(datedata[i].Email);
                    GraphItem.getSmscount.push(datedata[i].Sms);
                    GraphItem.getPaidcount.push(datedata[i].Paid);
                }
            }
        }

        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        GetCurrentSummaryData();

        ShowExportDiv(true);
    } else {
        ShowExportDiv(false);
    }
    BindGraph(GraphItem);
    HidePageLoading();
}

function GetCurrentSummaryData() {
    $.ajax({
        url: "/Analytics/Traffic/OverallPercentage",
        type: 'Post',
        data: JSON.stringify({
            'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': FromDateTime, 'todate': ToDateTime, 'compare': 0
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: GetPastSummaryData,
        error: ShowAjaxError
    });
}

function GetPastSummaryData(CurrentSummaryData) {

    var from_Date = CalculateDateDifference();

    $.ajax({
        url: "/Analytics/Traffic/OverallPercentage",
        type: 'Post',
        data: JSON.stringify({
            'accountId': Plumb5AccountId, 'duration': duration, 'fromdate': from_Date, 'todate': FromDateTime, 'compare': 0
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindOverAllComparision(response, CurrentSummaryData);
        },
        error: ShowAjaxError
    });
}

function BindOverAllComparision(PastSummaryData, CurrentSummaryData) {
    var CompareFirstData = { DirectCount: 0, SearchCount: 0, ReferCount: 0, SocialCount: 0, EmailCount: 0, SmsCount: 0, PaidCount: 0 };
    var CompareSecondData = { DirectCount: 0, SearchCount: 0, ReferCount: 0, SocialCount: 0, EmailCount: 0, SmsCount: 0, PaidCount: 0 };
    var PerCentValue = 0;

    if (CurrentSummaryData != undefined && CurrentSummaryData != null && CurrentSummaryData.Table1 != undefined && CurrentSummaryData.Table1 != null && CurrentSummaryData.Table1.length > 0) {
        $.each(CurrentSummaryData.Table1, function () {
            CompareFirstData.DirectCount = this.DirectSourcesCount;
            CompareFirstData.SearchCount = this.SearchSourcesCount;
            CompareFirstData.ReferCount = this.ReferSourcesCount;
            CompareFirstData.SocialCount = this.SocialSourcesCount;
            CompareFirstData.EmailCount = this.EmailSourcesCount;
            CompareFirstData.SmsCount = this.SmsSourcesCount;
            CompareFirstData.PaidCount = this.PaidSourcesCount;
        });
    }

    if (PastSummaryData != undefined && PastSummaryData != null && PastSummaryData.Table != undefined && PastSummaryData.Table != null && PastSummaryData.Table.length > 0) {
        $.each(PastSummaryData.Table, function () {
            CompareSecondData.DirectCount = this.DirectSourcesCount;
            CompareSecondData.SearchCount = this.SearchSourcesCount;
            CompareSecondData.ReferCount = this.ReferSourcesCount;
            CompareSecondData.SocialCount = this.SocialSourcesCount;
            CompareSecondData.EmailCount = this.EmailSourcesCount;
            CompareSecondData.SmsCount = this.SmsSourcesCount;
            CompareSecondData.PaidCount = this.PaidSourcesCount;
        });
    }

    var reportTableTrs = "<tr class='isnotsortable'><td></td>";
    PerCentValue = CalculatePercentage(CompareFirstData.DirectCount, CompareSecondData.DirectCount)
    if (CompareSecondData.DirectCount == CompareFirstData.DirectCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.DirectCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.DirectCount > CompareSecondData.DirectCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.DirectCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.DirectCount < CompareSecondData.DirectCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.DirectCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropdown'></i><span>" + PerCentValue + "%</span></p></td>";
    }

    PerCentValue = CalculatePercentage(CompareFirstData.SearchCount, CompareSecondData.SearchCount)
    if (CompareSecondData.SearchCount == CompareFirstData.SearchCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.SearchCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.SearchCount > CompareSecondData.SearchCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.SearchCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.SearchCount < CompareSecondData.SearchCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.SearchCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropdown'></i><span>" + PerCentValue + "%</span></p></td>";
    }

    PerCentValue = CalculatePercentage(CompareFirstData.ReferCount, CompareSecondData.ReferCount)
    if (CompareSecondData.ReferCount == CompareFirstData.ReferCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.ReferCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.ReferCount > CompareSecondData.ReferCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.ReferCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.ReferCount < CompareSecondData.ReferCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.ReferCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropdown'></i><span>" + PerCentValue + "%</span></p></td>";
    }

    PerCentValue = CalculatePercentage(CompareFirstData.SocialCount, CompareSecondData.SocialCount)
    if (CompareSecondData.SocialCount == CompareFirstData.SocialCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.SocialCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.SocialCount > CompareSecondData.SocialCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.SocialCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.SocialCount < CompareSecondData.SocialCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.SocialCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropdown'></i><span>" + PerCentValue + "%</span></p></td>";
    }

    PerCentValue = CalculatePercentage(CompareFirstData.EmailCount, CompareSecondData.EmailCount)
    if (CompareSecondData.EmailCount == CompareFirstData.EmailCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.EmailCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.EmailCount > CompareSecondData.EmailCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.EmailCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.EmailCount < CompareSecondData.EmailCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.EmailCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropdown'></i><span>" + PerCentValue + "%</span></p></td>";
    }

    PerCentValue = CalculatePercentage(CompareFirstData.SmsCount, CompareSecondData.SmsCount)
    if (CompareSecondData.SmsCount == CompareFirstData.SmsCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.SmsCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.SmsCount > CompareSecondData.SmsCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.SmsCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.SmsCount < CompareSecondData.SmsCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.SmsCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropdown'></i><span>" + PerCentValue + "%</span></p></td>";
    }

    PerCentValue = CalculatePercentage(CompareFirstData.PaidCount, CompareSecondData.PaidCount)
    if (CompareSecondData.PaidCount == CompareFirstData.PaidCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.PaidCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.PaidCount > CompareSecondData.PaidCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.PaidCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropup'></i><span>" + PerCentValue + "%</span></p></td>";
    }
    else if (CompareFirstData.PaidCount < CompareSecondData.PaidCount) {
        reportTableTrs += "<td><h3 class='td-h3'>" + CompareFirstData.PaidCount + "</h3><p class='percnt'><i class='icon ion-android-arrow-dropdown'></i><span>" + PerCentValue + "%</span></p></td>";
    }

    reportTableTrs += "</tr>";

    $("#ui_tbodyReportData").prepend(reportTableTrs);
}

function BindGraph(GraphItem) {
    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    AllSourcesChart = new Chart(document.getElementById("ui_canvas_AllSourcesData"), {
        type: 'bar',
        data: {
            labels: GraphItem.optiondate,
            datasets: [{
                data: GraphItem.getdirectcount,
                label: "Direct Traffic",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item1'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item1'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                fill: true
            },
            {
                data: GraphItem.getsearchcount,
                label: "Search Traffic",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item2'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item2'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item2'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item2'),
                fill: true
            },
            {
                data: GraphItem.getrefercount,
                label: "Refer Traffic",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item3'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item3'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item3'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item3'),
                fill: true
            },
            {
                data: GraphItem.getSocialcount,
                label: "Social Traffic",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item4'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item4'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item4'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item4'),
                fill: true
            },
            {
                data: GraphItem.getEmailcount,
                label: "Email Traffic",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item5'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item5'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item5'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item5'),
                fill: true
            },
            {
                data: GraphItem.getSmscount,
                label: "SMS Traffic",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item6'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item6'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item6'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item6'),
                fill: true
            },
            {
                data: GraphItem.getPaidcount,
                label: "Paid Traffic",
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item7'),
                hoverBorderColor: cssvar('--BarChart-BorderColor-Item7'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item7'),
                hoverBackgroundColor: cssvar('--BarChart-BackgroundColor-Item7'),
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