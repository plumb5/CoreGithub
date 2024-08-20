var RevenueGraph;
var Channel = "Direct";
var Currency = "";
var NoOfColumn = 3;
var CustomEventOverViewId = 0;
var EventName = "";
$(document).ready(() => {
    Reveune.GetEventName();
});


function CallBackFunction() {
    ShowPageLoading();
    Reveune.DestroyAllCharts();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    Reveune.GetChannelCount();
    Reveune.GetDayWiseRevenue();
}

function CallBackPaging() {
    CurrentRowCount = 0;
    Reveune.MaxCount();
}


var Reveune = {
    GetEventName: () => {
        ShowPageLoading();
        $.ajax({
            url: "/Revenue/RevenueChannels/GetEventnames",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (EventName) {
                if (EventName != null && EventName.length > 0) {
                    for (let i = 0; i < EventName.length; i++) {
                        if (i == 0) {
                            Currency = EventName[i].CurrencyType;
                            $("#ui_CustomEventsName").append(`<option value="${EventName[i].CustomEventOverViewId}" selected>${EventName[i].CustomEventName}</option>`);
                        }
                        else
                            $("#ui_CustomEventsName").append(`<option value="${EventName[i].CustomEventOverViewId}">${EventName[i].CustomEventName}</option>`);
                    }

                    GetUTCDateTimeRange(2);
                } else {
                    GetUTCDateTimeRange(2);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },

    GetChannelCount: () => {
        CustomEventOverViewId = $("#ui_CustomEventsName").val();
        EventName = $.trim($("#ui_CustomEventsName").text());
        $.ajax({
            url: "/Revenue/RevenueChannels/GetChannelCount",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'CustomEventOverViewId': CustomEventOverViewId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (ChannelCount) {
                let channelsData = JSON.parse(ChannelCount);
                if (channelsData != null) {
                    let channels = channelsData.Table1[0];

                    if ($("#ui_RevenueOrTransaction").val() == "Transaction") {
                        $("#ui_directchannelCount").empty().html(`<i class="fa"></i>${(channels.DirectTotalTransaction)}`);
                        $("#ui_PushchannelCount").empty().html(`<i class="fa"></i>${(channels.WebpushTotalTransaction)}`);
                        $("#ui_EmailchannelCount").empty().html(`<i class="fa"></i>${(channels.EmailTotalTransaction)}`);
                        $("#ui_SmschannelCount").empty().html(`<i class="fa"></i>${(channels.SmsTotalTransaction)}`);
                        $("#ui_WhatsappchannelCount").empty().html(`<i class="fa"></i>${(channels.WhatsappTotalTransaction)}`);
                    } else {
                        $("#ui_directchannelCount").empty().html(`<i class="fa fa-${Currency.toLocaleUpperCase()}"></i>${ToCurrency(channels.DirectRevenue)}`);
                        $("#ui_PushchannelCount").empty().html(`<i class="fa fa-${Currency.toLocaleUpperCase()}"></i>${ToCurrency(channels.WebpushRevenue)}`);
                        $("#ui_EmailchannelCount").empty().html(`<i class="fa fa-${Currency.toLocaleUpperCase()}"></i>${ToCurrency(channels.EmailRevenue)}`);
                        $("#ui_SmschannelCount").empty().html(`<i class="fa fa-${Currency.toLocaleUpperCase()}"></i>${ToCurrency(channels.SmsRevenue)}`);
                        $("#ui_WhatsappchannelCount").empty().html(`<i class="fa fa-${Currency.toLocaleUpperCase()}"></i>${ToCurrency(channels.WhatsappRevenue)}`);
                    }
                }
                Reveune.MaxCount();
            },
            error: ShowAjaxError
        });
    },

    MaxCount: () => {
        ShowPageLoading();
        CustomEventOverViewId = $("#ui_CustomEventsName").val();
        EventName = $.trim($("#ui_CustomEventsName :selected").text());
        $.ajax({
            url: "/Revenue/RevenueChannels/GetRevenueMaxCount",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'Channel': Channel, 'CustomEventOverViewId': CustomEventOverViewId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = response;
                if (TotalRowCount > 0) {
                    $("#ui_tbodyReportData").html('');
                    Reveune.GetRevenueData();
                }
                else {
                    SetNoRecordContent('ui_tableReport', NoOfColumn, 'ui_tbodyReportData');
                    ShowExportDiv(false);
                    ShowPagingDiv(false);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },

    GetRevenueData: () => {
        CustomEventOverViewId = $("#ui_CustomEventsName").val();
        EventName = $.trim($("#ui_CustomEventsName :selected").text());

        FetchNext = GetNumberOfRecordsPerPage();

        $.ajax({
            url: "/Revenue/RevenueChannels/GetRevenueData",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'Channel': Channel, 'CustomEventOverViewId': CustomEventOverViewId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'FetchNext': FetchNext, 'OffSet': OffSet }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: Reveune.BindDetails,
            error: ShowAjaxError
        });
    },

    BindDetails: (response) => {
        let jsonData = JSON.parse(response);

        if (jsonData.Table1 !== undefined && jsonData.Table1 !== null && jsonData.Table1.length > 0) {
            CurrentRowCount = jsonData.Table1.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

            ShowExportDiv(true);
            ShowPagingDiv(true);
            $("#ui_tableReport").removeClass('no-data-records');

            $("#ui_tbodyReportData").empty();
            GetCurrencySymbol();
            $.each(jsonData.Table1, function () {
                Reveune.BindEachReport(this);
            });
        }
        else {
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
    },

    BindEachReport: (eachData) => {
        let html = "";
        let workflowIcon = "";
        if (eachData.CampignType == 1) {
            workflowIcon = `<i class="fa fa-sitemap" style="color: #4662d4;float: right;"></i>`;
        }

        if ($("#ui_RevenueOrTransaction").val() == "Transaction") {
            html = `<tr>
                        <td>${eachData.Name} ${workflowIcon}</td>
                        <td><a href="/Revenue/RevenueCustomEventViewDetails?RevenuecustomEventOverViewId=${CustomEventOverViewId}&Ename=${EventName}&Frm=${FromDateTime}&To=${ToDateTime}&Tonum=${eachData.TotalTransaction}&channel=${Channel}&campaignid=${eachData.Id}&campigntype=${eachData.CampignType}">${eachData.TotalTransaction}</></td>
                   </tr>`
        } else {
            html = `<tr>
                        <td>${eachData.Name} ${workflowIcon}</td>
                        <td>${ToCurrency(eachData.Revenue)}</td>
                        <td>${ToCurrency(eachData.AveragerPerUser)}</td>
                   </tr>`
        }

        $("#ui_tbodyReportData").append(html);
    },

    GetDayWiseRevenue: () => {
        ShowPageLoading();
        CustomEventOverViewId = $("#ui_CustomEventsName").val();
        EventName = $.trim($("#ui_CustomEventsName :selected").text());

        $.ajax({
            url: "/Revenue/RevenueChannels/GetDayWiseRevenue",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'CustomEventOverViewId': CustomEventOverViewId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (EventName) {
                let jsondata = JSON.parse(EventName);
                if (jsondata != null && jsondata.Table1 != null && jsondata.Table1.length > 0) {
                    let data = jsondata.Table1;


                    let emailTranstion = JSLINQ(data).Where(function () { return (this.Channel == "Email"); }).toArray();
                    let dates = GetDateArrayData(emailTranstion, "Date");
                    let smsTranstion = JSLINQ(data).Where(function () { return (this.Channel == "Sms"); }).toArray();
                    let whatsappTranstion = JSLINQ(data).Where(function () { return (this.Channel == "Whatsapp"); }).toArray();
                    let webpushTranstion = JSLINQ(data).Where(function () { return (this.Channel == "WebPush"); }).toArray();
                    let directTranstion = JSLINQ(data).Where(function () { return (this.Channel == "Direct"); }).toArray();

                    if ($("#ui_RevenueOrTransaction").val() == "Transaction") {
                        emailTranstion = GetArrayData(emailTranstion, "TotalTransaction");
                        smsTranstion = GetArrayData(smsTranstion, "TotalTransaction");
                        whatsappTranstion = GetArrayData(whatsappTranstion, "TotalTransaction");
                        webpushTranstion = GetArrayData(webpushTranstion, "TotalTransaction");
                        directTranstion = GetArrayData(directTranstion, "TotalTransaction");
                    } else {
                        emailTranstion = GetArrayData(emailTranstion, "Revenue");
                        smsTranstion = GetArrayData(smsTranstion, "Revenue");
                        whatsappTranstion = GetArrayData(whatsappTranstion, "Revenue");
                        webpushTranstion = GetArrayData(webpushTranstion, "Revenue");
                        directTranstion = GetArrayData(directTranstion, "Revenue");
                    }

                    GetGraph(dates, emailTranstion, smsTranstion, whatsappTranstion, webpushTranstion, directTranstion);
                } else {
                    let dates = listDates(FromDateTime, ToDateTime);
                    let emailTranstion = [], smsTranstion = [], whatsappTranstion = [], webpushTranstion = [], directTranstion = [];
                    let date1 = [];
                    for (let i = 0; i < dates.length; i++) {
                        date1.push($.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(formatDatesBydate(dates[i]))));
                        emailTranstion.push(0);
                        smsTranstion.push(0);
                        whatsappTranstion.push(0);
                        webpushTranstion.push(0);
                        directTranstion.push(0);
                    }

                    GetGraph(date1, emailTranstion, smsTranstion, whatsappTranstion, webpushTranstion, directTranstion);
                }
            },
            error: ShowAjaxError
        });

    },

    DestroyAllCharts: () => {
        if (RevenueGraph) {
            RevenueGraph.destroy();
        }
    },

};

//$("#ui_channelDirect").click(function { });

function ToCurrency(number) {
    if (number != undefined && number != null) {
        return number.toLocaleString('en-IN', {
            style: 'currency',
            currency: Currency.toUpperCase()
        });
    } else {
        number = 0;
        return number.toLocaleString('en-IN', {
            style: 'currency',
            currency: Currency.toUpperCase()
        });
    }
}

function GetArrayData(data, column) {
    let array = [];
    for (let i = 0; i < data.length; i++) {
        array.push(data[i][column]);
    }
    return array;
}

function GetDateArrayData(data, column) {
    let array = [];
    for (let i = 0; i < data.length; i++) {
        array.push($.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(data[i][column])));
    }
    return array;
}

function GetCurrencySymbol() {
    if ($("#ui_RevenueOrTransaction").val() == "Transaction") {
        return "";
    } else {
        if (Currency.toLowerCase() == "inr") {
            $("#ui_BindRevenueRupees,#ui_BindUserRupees").html("(₹)");
            return "₹";
        }
        else {
            $("#ui_BindRevenueRupees,#ui_BindUserRupees").html("($)");
            return "$";
        }
    }
}



function GetGraph(dates, emailTranstion, smsTranstion, whatsappTranstion, webpushTranstion, directTranstion) {
    //Charts Start here
    let currency = GetCurrencySymbol() == "" ? "" : `(${GetCurrencySymbol()})`;
    Chart.plugins.unregister(ChartDataLabels);
    Chart.defaults.global.defaultFontSize = 10;
    Chart.defaults.global.legend.labels.boxWidth = 10;

    // line chart start here
    RevenueGraph = new Chart(document.getElementById("sessionsData"), {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                data: directTranstion,
                label: `Direct/Upload ${currency}`,
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item2'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item2'),
                fill: true
            },
            {
                data: webpushTranstion,
                label: `Push ${currency}`,
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item4'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item4'),
                fill: true
            },
            {
                data: emailTranstion,
                label: `Email ${currency}`,
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item6'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item6'),
                fill: true
            },
            {
                data: smsTranstion,
                label: `SMS ${currency}`,
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item1'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item1'),
                fill: true
            },
            {
                data: whatsappTranstion,
                label: `WhatsApp ${currency}`,
                borderWidth: 1,
                borderColor: cssvar('--BarChart-BorderColor-Item3'),
                backgroundColor: cssvar('--BarChart-BackgroundColor-Item3'),
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


$("#ui_channelDirect").click(() => {
    RemoveActive();
    $("#ui_channelDirect").addClass("active");
    ChangeHeader();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    Channel = "Direct";
    Reveune.MaxCount();
});

$("#ui_channelPush").click(() => {
    RemoveActive();
    $("#ui_channelPush").addClass("active");
    ChangeHeader();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    Channel = "WebPush";
    Reveune.MaxCount();
});

$("#ui_channelEmail").click(() => {
    RemoveActive();
    $("#ui_channelEmail").addClass("active");
    ChangeHeader();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    Channel = "Email";
    Reveune.MaxCount();
});

$("#ui_channelSms").click(() => {
    RemoveActive();
    $("#ui_channelSms").addClass("active");
    ChangeHeader();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    Channel = "Sms";
    Reveune.MaxCount();
});

$("#ui_channelWhatsapp").click(() => {
    RemoveActive();
    $("#ui_channelWhatsapp").addClass("active");
    ChangeHeader();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    Channel = "Whatsapp";
    Reveune.MaxCount();
});

function RemoveActive() {
    $("#ui_channelDirect,#ui_channelPush,#ui_channelEmail,#ui_channelSms,#ui_channelWhatsapp").removeClass("active");
}

function ChangeHeader() {
    if ($("#ui_RevenueOrTransaction").val() == "Transaction") {
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


$("#ui_CustomEventsName").change(() => {
    ChangeHeader();
    CallBackFunction();
});


$("#ui_RevenueOrTransaction").change(() => {
    ChangeHeader();
    CallBackFunction();
});

$('.addCampName').select2({
    placeholder: 'This is my placeholder',
    minimumResultsForSearch: '',
    dropdownAutoWidth: false,
    containerCssClass: 'dropdownactiv'
});

function listDates(fromDate, toDate) {
    var currentDate = new Date(fromDate);
    var endDate = new Date(toDate);
    var dates = [];

    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}

function formatDatesBydate(date) {
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);
    var seconds = ('0' + date.getSeconds()).slice(-2);

    return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds;
}