var HistoryDetailsParam = { ContactId: 0, Name: "", EmailId: "", PhoneNumber: "", WorkFlowId: 0, TemplateId: 0, MachineId: "" };
var graphType = 0, ChannelType = "";

$(".wrkflwtoptitle .fa-close").click(function () {
    $(this).parent().parent().parent().parent().removeClass("showFlx");
});

function ShowUserJourneyHistory(contactId, contact, EmailId, machineId) {
    ShowPageLoading();
    $("#tab-journey").removeClass("hideDiv");
    $("#tab-email, #tab-sms, #tab-webpush, #tab-apppush").addClass("hideDiv");
    $("#ui_div_WorkflowHistory").empty();
    $("#ui_span_UserDetails").html("[" + contact + "]");

    HistoryDetailsParam = new Object();
    HistoryDetailsParam.ContactId = contactId;
    HistoryDetailsParam.MachineId = machineId.indexOf("null") > -1 ? null : machineId;
    HistoryDetailsParam.EmailId = EmailId.indexOf("null") > -1 ? null : EmailId;

    $.ajax({
        url: "/Journey/History/GetWorkFlowChannels",
        type: 'Post',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'history': HistoryDetailsParam, 'FromDate': FromDateTime, 'ToDate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindUserJourneyHistory,
        error: ShowAjaxError
    });
}

function BindUserJourneyHistory(response) {
    var wfid = 0;
    var workflowdata = [];
    var wofid = 0, channel = "", woname = "Workflow";
    $.each(response, function (i) {
        var type = this.ChannelType;
        if (wfid == 0) {
            wofid = this.WorkFlowId; woname = this.WorkFlowName;
            channel = "," + type;
        }
        else if (wfid != 0 && wfid != this.WorkFlowId) {
            var ch = channel.indexOf(',') > -1 ? channel.substring(1).toString() : channel.toString()
            workflowdata.push({ "wfid": wofid, "wfname": woname, "wftype": ch.split(',') });

            wofid = this.WorkFlowId; woname = this.WorkFlowName;
            channel = "," + type.toString();
        }
        else { channel += "," + type.toString(); }

        if (response.length == 1 || response.length == i + 1) {
            var ch = channel.indexOf(',') > -1 ? channel.substring(1).toString() : channel.toString()
            workflowdata.push({ "wfid": wofid, "wfname": woname, "wftype": ch.split(',') });
        }
        wfid = this.WorkFlowId;
    });

    var reportTableTrs = "";
    $.each(workflowdata, function () {
        var innerReportTableTrs = "";
        var Id = this.wfid;
        $.each(this.wftype, function () {
            innerReportTableTrs += GetBindUserJourneyHistory(this, Id);
        });
        reportTableTrs += "<div class='box-white box-h-550 border-0 p-2'><div class='wrkflwnamewrp'>" +
            "<h6 id='ui_h6_" + Id + "' data-journeytab='journey' onclick=\"ShowWorkFlowChannels(" + Id + ");\"><span id='ui_span_h6_" + Id + "' class='fa fa-plus'></span>" + this.wfname + "</h6>" +
            "<div class='wrkflwchldwrp hideDiv'>" + innerReportTableTrs + "</div></div></div>";
    });
    $("#ui_div_WorkflowHistory").append(reportTableTrs);
    $(".wrkflwhispopupbg").addClass("showFlx");
    HidePageLoading();
}

function GetBindUserJourneyHistory(type, Id) {
    var result = "";
    if (type.toLowerCase() === "mail") {
        result += "<div class='wrkflwemailwrp'>" +
            "<div class='wrkflwemailicnwrp'>" +
            "<div class='wrkflwicnwrp bg-blue'><i class='fa fa-envelope'></i></div>" +
            "<h4 id='ui_h4_Mail_" + Id + "' data-journeytab='email' onclick=\"GetDataForIndiviualChannel(" + Id + ", 'Mail');\">Email</h4>" +
            "</div>" +
            "<div id='ui_div_Mail_" + Id + "' class='wrkflwemailchild hideDiv'></div>" +
            "</div>";
    }
    else if (type.toLowerCase() === "sms") {
        result += "<div class='wrkflwemailwrp'>" +
            "<div class='wrkflwemailicnwrp'>" +
            "<div class='wrkflwicnwrp bg-success'><i class='fa fa-commenting-o'></i></div>" +
            "<h4 id='ui_h4_Sms_" + Id + "' data-journeytab='sms' onclick=\"GetDataForIndiviualChannel(" + Id + ", 'Sms');\">SMS</h4>" +
            "</div>" +
            "<div id='ui_div_Sms_" + Id + "' class='wrkflwemailchild hideDiv'></div>" +
            "</div>";
    }
    else if (type.toLowerCase() === "webpush") {
        result += "<div class='wrkflwemailwrp>" +
            "<div class='wrkflwemailicnwrp'> " +
            "<div class='wrkflwicnwrp bg-purple'><i class='fa fa-bell-o'></i></div>" +
            "<h4 id='ui_h4_WebPush_" + Id + "' data-journeytab='webpush' onclick=\"GetDataForIndiviualChannel(" + Id + ", 'WebPush');\">Web Push</h4>" +
            "</div>" +
            "<div id='ui_div_WebPush_" + Id + "' class='wrkflwemailchild hideDiv'></div>" +
            "</div>";
    }
    else {
        result += "<div class='wrkflwemailwrp'>" +
            "<div class='wrkflwemailicnwrp'>" +
            "<div class='wrkflwicnwrp bg-danger'><i class='fa fa-mobile'></i></div>" +
            "<h4 id='ui_h4_AppPush_" + Id + "' data-journeytab='apppush' onclick=\"GetDataForIndiviualChannel(" + Id + ", 'AppPush');\">App Push</h4>" +
            "</div>" +
            "<div id='ui_div_AppPush_" + Id + "' class='wrkflwemailchild hideDiv'></div>" +
            "</div>";
    }
    return result;
}

function ShowWorkFlowChannels(Id) {
    //For getting workflow nodes
    //$.ajax({
    //    url: "/Journey/CreateWorkflow/GetWrokflowNodes",
    //    type: 'POST',
    //    dataType: 'json',
    //    data: JSON.stringify({ 'WorkflowId': WorkflowId }),
    //    contentType: "application/json; charset=utf-8",
    //    success: function (json) {
    //        $.each(json, function (i) {
    //            workflowUtil.SetNodeConfigArray(json[i].Channel, json[i].SegmentId, json[i].ConfigName, json[i].ChannelStatus);
    //        });

    //        workflowUtil.calldefaultworkflowdefaultload();
    //    },
    //    error: ShowAjaxError
    //});

    let checkplusicn = $("#ui_span_h6_" + Id).hasClass("fa-plus");
    let checkdatatab = $("#ui_h6_" + Id).attr("data-journeytab");
    $(".wrkflwdetconttabItem").addClass("hideDiv");
    $(".wrkflwemailchild li").removeClass("active");

    if (checkplusicn == true)
        $("#ui_h6_" + Id).find("span").removeClass("fa-plus").addClass("fa-minus");
    else
        $("#ui_h6_" + Id).find("span").removeClass("fa-minus").addClass("fa-plus");

    $("#ui_h6_" + Id).toggleClass("active");
    $("#ui_h6_" + Id).next().toggleClass("hideDiv");
    $("#tab-" + checkdatatab).removeClass("hideDiv");
}

function GetDataForIndiviualChannel(Id, channel) {
    ShowPageLoading();
    ChannelType = channel;
    BindIndividualChannelsTemplate(Id);
    var ReportParam = { 'WorkFlowId': Id, 'ChannelType': ChannelType, 'ContactId': HistoryDetailsParam.ContactId, 'MachineId': HistoryDetailsParam.MachineId };
    graphType = 0;
    $.ajax({
        url: "/Journey/History/GetCountbyIndividualChannel",
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'history': ReportParam, 'FromDate': FromDateTime, 'ToDate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        success: BindDataForIndiviualChannel,
        error: ShowAjaxError
    });
}

function BindDataForIndiviualChannel(response) {
    $.each(response, function () {
        var sent = this.TotalSent, deliver = this.TotalDelivered, open = this.TotalViewed, respons = this.TotalResponsed, bounce = this.TotalBounced;
        var deliverper = deliver / sent * 100, openper = open / deliver * 100, responsper = respons / deliver * 100, bounceper = bounce / sent * 100;
        deliverper = isNaN(deliverper) ? 0 : deliverper;
        openper = isNaN(openper) ? 0 : openper;
        responsper = isNaN(responsper) ? 0 : responsper;
        bounceper = isNaN(bounceper) ? 0 : bounceper;

        if (ChannelType.toLowerCase() === "mail") {
            $("#ui_h1_wrkflwDelivered_email").html(deliverper + "%");
            $("#ui_div_wrkflwDelivered_email").html(deliverper + "%");
            $("#ui_div_wrkflwDelivered_email").css("width", deliverper + "%").attr('aria-valuenow', deliverper);

            $("#ui_h1_wrkflwOpened_email").html(openper + "%");
            $("#ui_div_wrkflwOpened_email").html(openper + "%");
            $("#ui_div_wrkflwOpened_email").css("width", openper + "%").attr('aria-valuenow', openper);

            $("#ui_h1_wrkflwClicked_email").html(responsper + "%");
            $("#ui_div_wrkflwClicked_email").html(responsper + "%");
            $("#ui_div_wrkflwClicked_email").css("width", responsper + "%").attr('aria-valuenow', responsper);

            $("#ui_h1_wrkflwBounced_email").html(bounceper + "%");
            $("#ui_div_wrkflwBounced_email").html(bounceper + "%");
            $("#ui_div_wrkflwBounced_email").css("width", bounceper + "%").attr('aria-valuenow', bounceper);
        }
        else if (ChannelType.toLowerCase() === "sms") {
            $("#ui_h1_wrkflwDelivered_sms").html(deliverper + "%");
            $("#ui_div_wrkflwDelivered_sms").html(deliverper + "%");
            $("#ui_div_wrkflwDelivered_sms").css("width", deliverper + "%").attr('aria-valuenow', deliverper);

            $("#ui_h1_wrkflwClicked_sms").html(responsper + "%");
            $("#ui_div_wrkflwClicked_sms").html(responsper + "%");
            $("#ui_div_wrkflwClicked_sms").css("width", responsper + "%").attr('aria-valuenow', responsper);

            $("#ui_h1_wrkflwBounced_sms").html(bounceper + "%");
            $("#ui_div_wrkflwBounced_sms").html(bounceper + "%");
            $("#ui_div_wrkflwBounced_sms").css("width", bounceper + "%").attr('aria-valuenow', bounceper);
        }
        else if (ChannelType.toLowerCase() === "webpush") {
            $("#ui_h1_wrkflwViewed_webpush").html(openper + "%");
            $("#ui_div_wrkflwViewed_webpush").html(openper + "%");
            $("#ui_div_wrkflwViewed_webpush").css("width", openper + "%").attr('aria-valuenow', openper);

            $("#ui_h1_wrkflwClicked_webpush").html(responsper + "%");
            $("#ui_div_wrkflwClicked_webpush").html(responsper + "%");
            $("#ui_div_wrkflwClicked_webpush").css("width", responsper + "%").attr('aria-valuenow', responsper);

            var notresponseper = (deliver - respons) / deliver * 100;
            notresponseper = isNaN(notresponseper) ? 0 : notresponseper;
            $("#ui_h1_wrkflwNotClicked_webpush").html(notresponseper + "%");
            $("#ui_div_wrkflwNotClicked_webpush").html(notresponseper + "%");
            $("#ui_div_wrkflwNotClicked_webpush").css("width", notresponseper + "%").attr('aria-valuenow', notresponseper);

            var dismissper = (sent - deliver) / sent * 100;
            dismissper = isNaN(dismissper) ? 0 : dismissper;
            $("#ui_h1_wrkflwDismissed_webpush").html(dismissper + "%");
            $("#ui_div_wrkflwDismissed_webpush").html(dismissper + "%");
            $("#ui_div_wrkflwDismissed_webpush").css("width", dismissper + "%").attr('aria-valuenow', dismissper);

            $("#ui_h1_wrkflwBounced_webpush").html(bounceper);
            $("#ui_div_wrkflwBounced_webpush").html(bounceper);
            $("#ui_div_wrkflwBounced_webpush").css("width", bounceper + "%").attr('aria-valuenow', bounceper);
        }
        else {
            $("#ui_h1_wrkflwViewed_apppush").html(openper + "%");
            $("#ui_div_wrkflwViewed_apppush").html(openper + "%");
            $("#ui_div_wrkflwViewed_apppush").css("width", openper + "%").attr('aria-valuenow', openper);

            $("#ui_h1_wrkflwClicked_apppush").html(responsper + "%");
            $("#ui_div_wrkflwClicked_apppush").html(responsper + "%");
            $("#ui_div_wrkflwClicked_apppush").css("width", responsper + "%").attr('aria-valuenow', responsper);

            var notresponseper = (deliver - respons) / deliver * 100;
            notresponseper = isNaN(notresponseper) ? 0 : notresponseper;
            $("#ui_h1_wrkflwNotClicked_apppush").html(notresponseper + "%");
            $("#ui_div_wrkflwNotClicked_apppush").html(notresponseper + "%");
            $("#ui_div_wrkflwNotClicked_apppush").css("width", notresponseper + "%").attr('aria-valuenow', notresponseper);

            var dismissper = (sent - deliver) / sent * 100;
            dismissper = isNaN(dismissper) ? 0 : dismissper;
            $("#ui_h1_wrkflwDismissed_apppush").html(dismissper + "%");
            $("#ui_div_wrkflwDismissed_apppush").html(dismissper + "%");
            $("#ui_div_wrkflwDismissed_apppush").css("width", dismissper + "%").attr('aria-valuenow', dismissper);

            $("#ui_h1_wrkflwBounced_apppush").html(bounceper + "%");
            $("#ui_div_wrkflwBounced_apppush").html(bounceper + "%");
            $("#ui_div_wrkflwBounced_apppush").css("width", bounceper + "%").attr('aria-valuenow', bounceper);
        }
    });

    var callUrl = ["/Journey/History/GetCountbyIndividualDate", "/Journey/History/GetChannelsTemplateDate"];
    $.ajax({
        url: callUrl[graphType],
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'history': HistoryDetailsParam, 'Duration': duration, 'FromDate': FromDateTime, 'ToDate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        success: BindGraph,
        error: ShowAjaxError
    });
}

function BindGraph(response) {
    var categories = [], sentcount = [], delivercount = [], notdelivercount = [], opencount = [], responscount = [], noresponscount = [], bouncecount = [];
    if (response !== null && response !== undefined && response.length > 0) {
        var datalist = JSON.parse(response);
        for (var i = 0; i < datalist.length; i++) {
            if (datalist[0].SentDate != undefined) {
                var timevalue = datalist[i].SentDate.split("-");
                categories[i] = monthDetials[timevalue[1] - 1] + " " + timevalue[2];
            }
            else if (datalist[0].Year != undefined)
                categories[i] = monthDetials[parseInt(datalist[i].Month) - 1] + " " + datalist[i].Year;
            else if (datalist[0].Hour != undefined) {
                var type = parseInt(datalist[i].Hour) >= 12 ? "PM" : "AM";
                categories[i] = datalist[i].Hour + ":00" + type;
            }
            sentcount[i] = datalist[i].TotalSent;
            delivercount[i] = datalist[i].TotalDelivered;
            notdelivercount[i] = parseInt(datalist[i].TotalSent) - parseInt(datalist[i].TotalDelivered);
            opencount[i] = datalist[i].TotalViewed;
            responscount[i] = datalist[i].TotalResponsed;
            noresponscount[i] = parseInt(datalist[i].TotalDelivered) - parseInt(datalist[i].TotalResponsed);
            bouncecount[i] = datalist[i].TotalBounced;
        }
    }

    DestroyAllCharts();
    if (ChannelType.toLowerCase() === "mail") {
        GraphByEmail = new Chart(document.getElementById("wrkflwemailgraph").getContext("2d"), {
            type: 'line',
            data: {
                labels: categories,
                datasets: [{
                    data: delivercount,
                    label: "Delivered",
                    borderWidth: 1.5,
                    borderColor: cssvar('--LineChart-BorderColor-Item1'),
                    hoverBorderColor: cssvar('--LineChart-BorderColor-Item1'),
                    backgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                    hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                    fill: true
                },
                {
                    data: opencount,
                    label: "Opened",
                    borderWidth: 1.5,
                    borderColor: cssvar('--LineChart-BorderColor-Item2'),
                    hoverBorderColor: cssvar('--LineChart-BorderColor-Item2'),
                    backgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                    hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                    fill: true
                },
                {
                    data: responscount,
                    label: "Clicked",
                    borderWidth: 1.5,
                    borderColor: cssvar('--LineChart-BorderColor-Item3'),
                    hoverBorderColor: cssvar('--LineChart-BorderColor-Item3'),
                    backgroundColor: cssvar('--LineChart-BackgroundColor-Item3'),
                    hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item3'),
                    fill: true
                },
                {
                    data: bouncecount,
                    label: "Bounced",
                    borderWidth: 1.5,
                    borderColor: cssvar('--LineChart-BorderColor-Item4'),
                    hoverBorderColor: cssvar('--LineChart-BorderColor-Item4'),
                    backgroundColor: cssvar('--LineChart-BackgroundColor-Item4'),
                    hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item4'),
                    fill: true
                }]
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
    else if (ChannelType.toLowerCase() === "sms") {
        GraphBySms = new Chart(document.getElementById("wrkflwsmsgraph").getContext("2d"), {
            type: 'line',
            data: {
                labels: categories,
                datasets: [{
                    data: delivercount,
                    label: "Delivered",
                    borderWidth: 1.5,
                    borderColor: cssvar('--LineChart-BorderColor-Item1'),
                    hoverBorderColor: cssvar('--LineChart-BorderColor-Item1'),
                    backgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                    hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                    fill: true
                },
                {
                    data: responscount,
                    label: "Clicked",
                    borderWidth: 1.5,
                    borderColor: cssvar('--LineChart-BorderColor-Item2'),
                    hoverBorderColor: cssvar('--LineChart-BorderColor-Item2'),
                    backgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                    hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                    fill: true
                },
                {
                    data: bouncecount,
                    label: "Bounced",
                    borderWidth: 1.5,
                    borderColor: cssvar('--LineChart-BorderColor-Item3'),
                    hoverBorderColor: cssvar('--LineChart-BorderColor-Item3'),
                    backgroundColor: cssvar('--LineChart-BackgroundColor-Item3'),
                    hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item3'),
                    fill: true
                }]
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
    else if (ChannelType.toLowerCase() === "webpush") {
        GraphByWebPush = new Chart(document.getElementById("wrkflwwebpushgraph").getContext("2d"), {
            type: 'line',
            data: {
                labels: categories,
                datasets: [{
                    data: opencount,
                    label: "Viewed",
                    borderWidth: 1.5,
                    borderColor: cssvar('--LineChart-BorderColor-Item1'),
                    hoverBorderColor: cssvar('--LineChart-BorderColor-Item1'),
                    backgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                    hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                    fill: true
                },
                {
                    data: responscount,
                    label: "Clicked",
                    borderWidth: 1.5,
                    borderColor: cssvar('--LineChart-BorderColor-Item2'),
                    hoverBorderColor: cssvar('--LineChart-BorderColor-Item2'),
                    backgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                    hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                    fill: true
                },
                {
                    data: noresponscount,
                    label: "Not Clicked",
                    borderWidth: 1.5,
                    borderColor: cssvar('--LineChart-BorderColor-Item3'),
                    hoverBorderColor: cssvar('--LineChart-BorderColor-Item3'),
                    backgroundColor: cssvar('--LineChart-BackgroundColor-Item3'),
                    hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item3'),
                    fill: true
                },
                {
                    data: notdelivercount,
                    label: "Dismissed",
                    borderWidth: 1.5,
                    borderColor: cssvar('--LineChart-BorderColor-Item4'),
                    hoverBorderColor: cssvar('--LineChart-BorderColor-Item4'),
                    backgroundColor: cssvar('--LineChart-BackgroundColor-Item4'),
                    hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item4'),
                    fill: true
                },
                {
                    data: bouncecount,
                    label: "Bounced",
                    borderWidth: 1.5,
                    borderColor: cssvar('--LineChart-BorderColor-Item5'),
                    hoverBorderColor: cssvar('--LineChart-BorderColor-Item5'),
                    backgroundColor: cssvar('--LineChart-BackgroundColor-Item5'),
                    hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item5'),
                    fill: true
                }]
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
    else {
        GraphByAppPush = new Chart(document.getElementById("wrkflwapppushgraph").getContext("2d"), {
            type: 'line',
            data: {
                labels: categories,
                datasets: [{
                    data: opencount,
                    label: "Viewed",
                    borderWidth: 1.5,
                    borderColor: cssvar('--LineChart-BorderColor-Item1'),
                    hoverBorderColor: cssvar('--LineChart-BorderColor-Item1'),
                    backgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                    hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item1'),
                    fill: true
                },
                {
                    data: responscount,
                    label: "Clicked",
                    borderWidth: 1.5,
                    borderColor: cssvar('--LineChart-BorderColor-Item2'),
                    hoverBorderColor: cssvar('--LineChart-BorderColor-Item2'),
                    backgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                    hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item2'),
                    fill: true
                },
                {
                    data: noresponscount,
                    label: "Not Clicked",
                    borderWidth: 1.5,
                    borderColor: cssvar('--LineChart-BorderColor-Item3'),
                    hoverBorderColor: cssvar('--LineChart-BorderColor-Item3'),
                    backgroundColor: cssvar('--LineChart-BackgroundColor-Item3'),
                    hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item3'),
                    fill: true
                },
                {
                    data: notdelivercount,
                    label: "Dismissed",
                    borderWidth: 1.5,
                    borderColor: cssvar('--LineChart-BorderColor-Item4'),
                    hoverBorderColor: cssvar('--LineChart-BorderColor-Item4'),
                    backgroundColor: cssvar('--LineChart-BackgroundColor-Item4'),
                    hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item4'),
                    fill: true
                },
                {
                    data: bouncecount,
                    label: "Bounced",
                    borderWidth: 1.5,
                    borderColor: cssvar('--LineChart-BorderColor-Item5'),
                    hoverBorderColor: cssvar('--LineChart-BorderColor-Item5'),
                    backgroundColor: cssvar('--LineChart-BackgroundColor-Item5'),
                    hoverBackgroundColor: cssvar('--LineChart-BackgroundColor-Item5'),
                    fill: true
                }]
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
    HidePageLoading();
}

var GraphByEmail;
var GraphBySms;
var GraphByWebPush;
var GraphByAppPush;
function DestroyAllCharts() {
    if (GraphByEmail) {
        GraphByEmail.destroy();
    }

    if (GraphBySms) {
        GraphBySms.destroy();
    }

    if (GraphByWebPush) {
        GraphByWebPush.destroy();
    }

    if (GraphByAppPush) {
        GraphByAppPush.destroy();
    }
}

function BindIndividualChannelsTemplate(Id) {
    var ReportParam = { 'WorkFlowId': Id, 'ChannelType': ChannelType, 'ContactId': HistoryDetailsParam.ContactId, 'MachineId': HistoryDetailsParam.MachineId };
    var journeyTab = ChannelType.toLowerCase() === "mail" ? "email" : ChannelType.toLowerCase() === "sms" ? "sms" : ChannelType.toLowerCase() === "webpush" ? "webpush" : "apppush";
    $.ajax({
        url: "/Journey/History/GetChannelsTemplate",
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'history': ReportParam, 'FromDate': FromDateTime, 'ToDate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            var TemplateName = "";
            $.each(response, function () {
                var title = this.TemplateName.length > 25 ? this.TemplateName.substring(0, 25) + ".." : this.TemplateName;
                TemplateName += "<li id='ui_li_" + ChannelType + "_" + Id + "_" + this.TemplateId + "' onclick=\"ShowCampCount(" + Id + "," + this.TemplateId + ");\" data-journeytab='" + journeyTab + "'>" + title + "</li>";
            });
            $("#ui_div_" + ChannelType + "_" + Id).empty();
            $("#ui_div_" + ChannelType + "_" + Id).html("<ul>" + TemplateName + "</ul>");

            $("#ui_h4_" + ChannelType + "_" + Id).toggleClass("active");
            $("#ui_div_" + ChannelType + "_" + Id).toggleClass("hideDiv");
            let checkemaildatatab = $("#ui_h4_" + ChannelType + "_" + Id).attr("data-journeytab");
            $(".wrkflwdetconttabItem").addClass("hideDiv");
            $("#tab-" + checkemaildatatab).removeClass("hideDiv");
        },
        error: ShowAjaxError
    });
}

function ShowCampCount(Id, TemplateId) {
    ShowPageLoading();

    $(".wrkflwemailchild li").removeClass("active");
    $("#ui_li_" + ChannelType + "_" + Id + "_" + TemplateId).addClass("active");
    let checklisdatatab = $("#ui_li_" + ChannelType + "_" + Id + "_" + TemplateId).attr("data-journeytab");
    $(".wrkflwdetconttabItem").addClass("hideDiv");
    $("#tab-" + checklisdatatab).removeClass("hideDiv");

    graphType = 1;
    var ReportParam = { 'WorkFlowId': Id, 'TemplateId': TemplateId, 'ChannelType': ChannelType, 'ContactId': HistoryDetailsParam.ContactI, 'MachineId': HistoryDetailsParam.MachineId };
    $.ajax({
        url: "/Journey/History/GetCountByContactId",
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'history': ReportParam, 'FromDate': FromDateTime, 'ToDate': ToDateTime }), contentType: "application/json; charset=utf-8",
        success: BindDataForIndiviualChannel,
        error: ShowAjaxError
    });
}