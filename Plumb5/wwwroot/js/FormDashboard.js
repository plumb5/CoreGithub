
var formType = 0, FormId = 0, rotationvalue = 0, tickInterval = 0, dt, graphInterval = 0, diffDays = 0, allFormFields = [];
var BannerOrForm = "";

$(document).ready(function () {
    $("#dvLoading").hide();
    GetDateTimeRange(2);

    if (formType == 1 || formType == 2 || formType == 3 || formType == 4 || formType == 5 || formType == 6 || formType == 7 || formType == 10 || formType == 17) {
        BindBannerResponses();
    }
    else if (formType == 12 || formType == 18 || formType == 16 || formType == 9 || formType == 20) {
        GetFieldsAndBindFormResponses();
    }
});

var CallBackFunction = function () {

    FormId = urlParam("FormId").toString().toLowerCase();
    formType = urlParam("FormType").toString().toLowerCase();


    if (formType == 1 || formType == 2 || formType == 3 || formType == 4 || formType == 5 || formType == 6 || formType == 7 || formType == 10 || formType == 17) {
        BannerOrForm="Banner";
    }
    else if (formType == 12 || formType == 18 || formType == 16 || formType == 9 || formType == 20) {
        BannerOrForm = "Form";
    }
    BindFormImpressionsCount();
    GetResponseResport();
};



function GetResponseResport() {

    if (duration == 5) {

        var fromdate = $("#txtDateFrom").val();
        var dates = fromdate.split('-');
        var fromDate = new Date(dates[2], dates[1] - 1, dates[0]);

        var todate = $("#txtDateTo").val();
        var dates = todate.split('-');
        var toDate = new Date(dates[2], dates[1] - 1, dates[0]);

        diffDays = Math.abs((fromDate.getTime() - toDate.getTime()) / (24 * 60 * 60 * 1000));

        if (diffDays == 0)
            duration = 1;
        else if (diffDays <= 6)
            duration = 2;
        else if (diffDays <= 28)
            duration = 3;
        else if (diffDays <= 365)
            duration = 4;
        else if (diffDays > 365)
            duration = 5;
    }
    $.ajax({
        url: "../Form/Dashboard/GetFormReport",
        type: 'Post',
        data: JSON.stringify({ 'FormId': FormId, 'Duration': duration, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'BannerOrForm': BannerOrForm }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: GraphDetails,
        error: ShowAjaxError
    });
}

GraphDetails = function (response) {

    var leadCount = new Array(), impressionCount = new Array(), closedCount = new Array(), dateList = new Array(), seriesListData = new Array();

    if (response.length == 0) {
        $("#dvLoading").hide();
        $("#dvDefault").show();
        $("#divcontent").hide();
        return;
    }
    else {
        $("#divcontent").show();
        $("#dvDefault").hide();
    }

    if (duration == 1) {

        dt = new Date();
        for (var i = 0; i < response.length; i++) {

            leadCount.push(response[i].ResponseCount);
            impressionCount.push(response[i].ViewedCount);
            closedCount.push(response[i].ClosedCount);

            var timevalue = response[i].Hour;

            if (timevalue <= 12) {
                var appendingvalue = response[i].Hour + ":00" + "AM";
                dateList.push(monthDetials[dt.getMonth()] + " " + dt.getDate() + " " + appendingvalue);
            }
            else if (timevalue > 12) {

                var Hourly = GetHourValue(response[i].Hour);
                var appendingvalue = Hourly + ":00" + "PM";
                dateList.push(monthDetials[dt.getMonth()] + " " + dt.getDate() + " " + appendingvalue);
            }
        }

        if (formType != 1 && formType != 2 && formType != 3 && formType != 4 && formType != 5 && formType != 6 && formType != 7 && formType != 10) {
            seriesListData.push({ color: '#8dc40f', name: 'Responses', data: leadCount });
        }
        seriesListData.push({ color: '#efc419', name: 'Impressions', data: impressionCount });
        seriesListData.push({ color: '#327cd8', name: 'Closed', data: closedCount });

        AppendChart(dateList, seriesListData);
    }

    else if (duration == 2 || duration == 3) {

        for (var i = 0; i < response.length; i++) {
            leadCount.push(response[i].ResponseCount);
            impressionCount.push(response[i].ViewedCount);
            closedCount.push(response[i].ClosedCount);

            var timevalue = response[i].GDate.split("-");
            dateList.push(monthDetials[timevalue[1] - 1] + " " + timevalue[2] + " " + timevalue[0]);
        }

        if (formType != 1 && formType != 2 && formType != 3 && formType != 4 && formType != 5 && formType != 6 && formType != 7 && formType != 10) {
            seriesListData.push({ color: '#8dc40f', name: 'Responses', data: leadCount });
        }
        seriesListData.push({ color: '#efc419', name: 'Impressions', data: impressionCount });
        seriesListData.push({ color: '#327cd8', name: 'Closed', data: closedCount });

        if (duration == 3) {
            if (response.length == 16 || response.length <= 20) {
                tickInterval = 2;
            }
            else if (response.length > 20 || response.length > 25) {
                tickInterval = 3;
            }
        }
        AppendChart(dateList, seriesListData);
    }

    else if (duration == 4 || duration == 5) {

        for (var i = 0; i < response.length; i++) {

            leadCount.push(response[i].ResponseCount);
            impressionCount.push(response[i].ViewedCount);
            closedCount.push(response[i].ClosedCount);

            dateList.push(monthDetials[response[i].Month - 1] + " " + response[i].Year);
        }

        if (formType != 1 && formType != 2 && formType != 3 && formType != 4 && formType != 5 && formType != 6 && formType != 7 && formType != 10) {
            seriesListData.push({ color: '#8dc40f', name: 'Responses', data: leadCount });
        }
        seriesListData.push({ color: '#efc419', name: 'Impressions', data: impressionCount });
        seriesListData.push({ color: '#327cd8', name: 'Closed', data: closedCount });

        if (duration == 4) {
            tickInterval = 0;
        }
        else if (duration == 5) {
            if (response.length > 20 && response.length <= 40)
                tickInterval = 2.5;
            else if (response.length > 40)
                tickInterval = 3;
            else
                tickInterval = 0;
        }
        AppendChart(dateList, seriesListData);
    }
};


AppendChart = function (dateList, seriesListData) {

    var chart;
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'dvFormResponseGraph',
            type: 'spline'
        },

        title: {
            text: 'Form Interaction details'
        },

        xAxis: {
            categories: dateList,
            tickInterval: tickInterval,
            labels: {
                rotation: rotationvalue,
                y: 20,
                style: {
                    fontSize: '12px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: { min: 0, title: '' },
        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br />' + this.series.name + '<b>: ' + this.y + '</b>';
            }
        },
        series: seriesListData
    });
    $("#dvLoading").hide();
};

function GetHourValue(Time) {

    if (Time == "13")
        return 1;
    if (Time == "14")
        return 2;
    if (Time == "15")
        return 3;
    if (Time == "16")
        return 4;
    if (Time == "17")
        return 5;
    if (Time == "18")
        return 6;
    if (Time == "19")
        return 7;
    if (Time == "20")
        return 8;
    if (Time == "21")
        return 9;
    if (Time == "22")
        return 10;
    if (Time == "23")
        return 11;
    if (Time == "24")
        return 12;
}

function BindFormImpressionsCount() {

    $.ajax({
        url: "../Form/Dashboard/BindFormImpressionsCount",
        type: 'POST',
        data: JSON.stringify({ 'FormId': FormId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {

            $("#lblResponses").html(response[0].TotalResponseCount);
            $("#lblImpressions").html(response[0].TotalViewedCount);
            $("#lblClose").html(response[0].TotalClosedCount);
        },
        error: ShowAjaxError
    });
}

GetFieldsAndBindFormResponses = function () {
    $.ajax({
        url: "/Response/GetFormFields",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            allFormFields = response;
            BindFormResponses();
        },
        error: ShowAjaxError
    });
};

function BindFormResponses() {

    OffSet = 0;
    var FetchNext = 5;

    $.ajax({
        url: "../Form/Response/GetResponses",
        type: 'Post',
        data: JSON.stringify({ 'FormId': FormId, 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: ResponseData,
        error: ShowAjaxError
    });
}

ResponseData = function (response) {

    $("#dvReport").append("<div class='headerstyle'><div style='float: left; width: 5%;text-align: left;'>UCP</div><div style='float: left; width: 25%;;text-align: left;'>Visitor</div><div style='float: left; width: 10%;text-align: right;'>Score</div><div style='float: left; width: 10%;text-align: right;'>Ip Address</div><div style='float: left; width: 15%;text-align: right;'>Date</div><div style='float: left; width: 10%;text-align: right;'>Group</div><div style='float: right; width: auto;text-align: right;'>Mail</div></div>");

    if (response.length > 0) {

        $.each(response, function (i) {

            var tdContent = "";

            tdContent = "<div style='float: left; width: 5%;text-align: left;'><a id='lnkCustomer" + $(this)[0].MachineId + "' href=\"javascript:ContactInfo('" + $(this)[0].MachineId + "','" + $(this)[0].ContactId + "');\"><img class='UPC' alt='' src='/images/img_trans.gif' /></a></div>";


            if ($(this)[0].FormType == "16") {
                var ratingTitle = $(this)[0].Heading;
                if (ratingTitle.length > 20)
                    ratingTitle = ratingTitle.substring(0, 20) + "..";
                tdContent += "<div style='float: left; width: 25%;'><a href='javascript:void(0);' onclick=\"DataShowLead(" + $(this)[0].FormResponseId + "," + $(this)[0].LeadSeen + ");\"><img class='expandCollapseImg ExpandImage' id='imgLead-" + $(this)[0].FormResponseId + "' alt='' src='/images/img_trans.gif' /><label title='" + $(this)[0].FormHeading + "'>" + ratingTitle + " - " + $(this)[0].Field1 + "</a></div>";
            }
            else {
                tdContent += "<div style='float: left; width: 25%;'><a href='javascript:void(0);' onclick=\"DataShowLead(" + $(this)[0].FormResponseId + "," + $(this)[0].LeadSeen + ");\"><img class='expandCollapseImg ExpandImage' id='imgLead-" + $(this)[0].FormResponseId + "' alt='' src='/images/img_trans.gif' /> " + $(this)[0].Field1 + "</a></div>";
            }

            tdContent += "<div style='float: left; width: 10%;text-align: right;'>0</div>";
            tdContent += "<div style='float: left; width: 10%;text-align: right;'>" + $(this)[0].TrackIp + "</div>";
            tdContent += "<div style='float: left; width: 15%;text-align: right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].TrackDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].TrackDate)) + "</div>";
            if ($(this)[0].EmailId != null && $(this)[0].EmailId.length > 0) {
                tdContent += "<div style='float: left; width: 10%;text-align: right;'><a href='javascript:void(0);' onclick=\"PushAddToContact(" + $(this)[0].ContactId + ");\"><img border='0px;' src='/images/img_trans.gif' class='AddToGroup' title='Add contact' /></a></div>";
                tdContent += "<div style='float: right; width: auto;text-align: right;'><a href='javascript:void(0);' onclick=\"showSendMail(this);\" emailid='" + $(this)[0].EmailId + "'><img border='0px;' src='/images/img_trans.gif' class='SendMailToIndividual' title='Send Mail' /></a></div>";
            }
            else {
                tdContent += "<div style='float: left; width: 10%;text-align: right;'><img border='0px;' src='/images/img_trans.gif' class='AddToGroupBlur' title='Add contact' /></div>";
                tdContent += "<div style='float: right; width: 10%;text-align: right;'><img border='0px;' src='/images/img_trans.gif' class='SendMailToIndividualBlur' title='Send Mail' /></div>";
            }

            $("#dvReport").append("<div class='itemStyle'>" + tdContent + "</div>");
            $("#dvReport").append("<div class='tdHide itemStyleSubContent' id='tr_" + $(this)[0].FormResponseId + "'>" + BindSubFieldsData($(this)[0]) + "</div>");
        });
    }
    else {
        $("#dvReport, #dvLoading").hide();
        $("#dvDefault").show();
    }
    $("#dvLoading").hide();
};

BindSubFieldsData = function (formData) {

    var tdContent = "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Form Heading</div><div style='float:left;width:auto;'>" + formData.Heading + "</div></div>";


    for (var i = 0; i < allFormFields.length; i++)
        if (allFormFields[i].length > 0 && allFormFields[i][0].FormId == formData.FormId)
        { formFields = allFormFields[i]; break; }


    if (formData.FormType == "9" || formData.FormType == "18" || formData.FormType == "16") {
        tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Ratted</div><div style='float:left;width:auto;'>" + formData.Field1 + "</div></div>"
    }
    else {
        for (var i = 0; i < formFields.length; i++) {
            tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>" + formFields[i].Name + "</div><div style='float:left;width:auto;'>" + formData["Field" + (i + 1)] + "</div></div>"
        }
    }

    var city = formData.City == null ? "" : formData.City;
    tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Place</div><div style='float:left;width:auto;'>" + city + "</div></div>";

    var PageUrl = formData.PageUrl == null ? "" : formData.PageUrl;
    tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Page Url</div><div style='float:left;width:auto;'>" + PageUrl + "</div></div>";

    var Referrer = formData.Referrer == null ? "" : formData.Referrer;
    tdContent += "<div class='itemStyle' style='background-color: #FFFEEA;'><div style='float:left;width:20%;'>Referrer Page</div><div style='float:left;width:auto;'>" + Referrer + "</div></div>";

    return tdContent;
};

function DataShowLead(formResponseId, LeadSeen) {

    if ($("#tr_" + formResponseId).is(":visible")) {
        $("#imgLead-" + formResponseId).removeClass("CollapseImg").addClass("ExpandImage");
        $("#tr_" + formResponseId).hide();
    }
    else {
        $("#imgLead-" + formResponseId).removeClass("ExpandImage").addClass("CollapseImg");

        $("#tr_" + formResponseId).show();
        if (!LeadSeen) {
            $("#newImgLead_" + formResponseId).hide();
            $("#dvLoading").hide();
        }
    }
}

BindBannerImpressionsCount = function () {

    $.ajax({
        url: "../Form/Dashboard/BindBannerImpressionsCount",
        type: 'POST',
        data: JSON.stringify({ 'FormBannerId': FormId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {

            $("#lblResponses").html(response[0].TotalResponseCount);
            $("#lblImpressions").html(response[0].TotalViewedCount);
            $("#lblClose").html(response[0].TotalClosedCount);
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
};

function BindBannerResponses() {

    OffSet = 0;
    var FetchNext = 5;

    $.ajax({
        url: "../Form/Dashboard/Top5BannerResponses",
        type: 'Post',
        data: JSON.stringify({ 'FormBannerId': FormId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: ResponsedBannerData,
        error: ShowAjaxError
    });
}

ResponsedBannerData = function (response) {

    if (response.length > 0) {
        
        $("#dvReport").append("<div class='headerstyle'><div style='float: left; width: 7%;text-align: left;'>UCP</div><div style='float: left; width: 27%; text-align: left;'>Banner Name</div><div style='float: left; width: 10%;text-align: right;'>Viewed</div><div style='float: left; width: 10%;'>Interacted</div><div style='float: left; width: 10%;'>Closed</div><div style='float: left; width: 10%;'>Score</div><div style='float: right; width: auto;text-align: right;'>Date</div></div>");

        $.each(response, function (i) {

            var tdContent = "";

                tdContent += "<div style='float: left; width: 7%;text-align: left;'><a id='lnkCustomer" + $(this)[0].MachineId + "' href=\"javascript:ContactInfo('" + $(this)[0].MachineId + "','');\"><img class='UPC' alt='' src='/images/img_trans.gif' /></a></div>";
                tdContent += "<div style='float: left; width: 27%; text-align: left;'> " + $(this)[0].Name + " </div>";
                tdContent += "<div style='float: left; width: 10%;text-align: right;'>" + $(this)[0].ViewedCount + "</div>";
                tdContent += "<div style='float: left; width: 10%;text-align: right;'>" + $(this)[0].ResponseCount + "</div>";
                tdContent += "<div style='float: left; width: 10%;text-align: right;'>" + $(this)[0].ClosedCount + "</div>";
                tdContent += "<div style='float: left; width: 10%;text-align: right;'>0</div>";
                tdContent += "<div style='float: right; width:auto;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].RecentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].RecentDate)) + "</div>";
                $("#dvReport").append("<div class='itemStyle'>" + tdContent + "</div>");
        });
    }
    else {
        $("#dvReport, #dvLoading").hide();
        $("#dvDefault").show();
    }
};


