var optiondate = '', gettotalcount = '', getuniquecount = '';
var gettotalcount1 = '', getuniquecount1 = '', prvsfrom_to = '', crtfrom_to = '', getTooltips = ''; compareOption = '';
var duration = 2;

$(document).ready(function () {
    VisitReport();
});

function VisitReport() {
    var getFilter = CheckFilter(duration);
    var optiondate = '', gettotalcount = '', getuniquecount = '', fromdate = getFilter[0], compare = getFilter[2], todate = getFilter[1], compareOption = getFilter[3], maintain = getFilter[4], optiondate1 = '', gettotalcount1 = '', getuniquecount1 = '', prvsfrom_to = '', crtfrom_to = '', getTooltips = '';


    $.ajax({
        url: "/Analytics/Dashboard/VisitsReport",
        type: 'Post',
        data: "{'accountId':'" + AccountId + "','duration':'" + duration + "','fromdate':'" + fromdate + "','todate':'" + todate + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var Tbllngth;
            if (compare == 1) {
                Tbllngth = response.Table1.length;
            } else { Tbllngth = response.Table.length; }
            if (Tbllngth > 0) {
                $("#dvDefault").css("display", "none");
                $("#divcontent").css("display", "block");
                $("#dvPrintExport").css("display", "block");
                var InnerDivhtml = "", tabletd = "<tr style='font-weight: bold;'><td>Day</td><td>Sessions</td><td>Unique Visitors</td><td>Page Views</td><td>New Visitors</td><td>Average Time</td></tr>";
                var m = "";
                if (duration == 1) {
                    var a = new Date();
                    m = GetMonthName(a.getMonth() + 1) + " - " + a.getDate();
                }
                if (compare == 1) {
                    $.each(curdate, function (i) {
                        var cd = '', ctc = '', cuc = '', pd = '', ptc = '', puc = ''; var condition = 0;
                        if (prvsdate.length > i) {
                            if (response.Table.length == response.Table1.length) {
                                if (response.Table[i].DateShort2 == response.Table1[i].DateShort2)
                                    condition = 1;
                            } else { condition = 0 }

                            if (condition == 0 && response.Table.length > i) {
                                tabletd += "<tr><td>" + (duration == 1 ? m + "&nbsp;&nbsp;" + response.Table[i].DateShort2 : response.Table[i].DateShort2) + "</td><td>" + response.Table[i].Session + "</td><td>" + response.Table[i].UniqueVisit + "</td><td>" + (response.Table[i].TotalVisit == '' ? "0" : response.Table[i].TotalVisit) + "</td><td>" + (response.Table[i].NewVisitors == '' ? "0" : response.Table[i].NewVisitors) + "</td><td>" + (response.Table[i].Session == "0" ? "0d 0h 0m 0s" : fn_AverageTime(response.Table[i].TotalTime)) + "</td></tr>";
                                InnerDivhtml += "<div style='text-align: left;' class='itemStyle'>" +
                                                        "<div style='float: left; width: 15%;'>" +
                                                        (duration == 1 ? m + "&nbsp;&nbsp;" + response.Table[i].DateShort2 : response.Table[i].DateShort2) + "</div>" +
                                                        "<div style='float: left; width: 15%;' class='short1'>" +
                                                        response.Table[i].Session + "</div>" +
                                                        "<div style='float: left; width: 20%;' class='short2'>" +
                                                        (response.Table[i].UniqueVisit != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + response.Table[i].DateFrom + "&To=" + response.Table[i].DateTo + "'>" + response.Table[i].UniqueVisit + "[View]</a>" : response.Table[i].UniqueVisit) + "</div>" +
                                                        "<div style='float: left; width: 17%;' class='short3'>" +
                                                        (response.Table[i].TotalVisit == null || response.Table[i].TotalVisit == '' ? "0" : response.Table[i].TotalVisit) + "</div>" +
                                                        "<div style='float: left; width: 19%;' class='short4'>" +
                                                        (response.Table[i].NewVisitors != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + response.Table[i].DateFrom + "&To=" + response.Table[i].DateTo + "&Type=New&RedirectedFrom=Visits'>" + response.Table[i].NewVisitors + "[View]</a>" : response.Table[i].NewVisitors) + "</div>" +
                                                        "<div style='float: left; text-align: right; width: 14%;'>" +
                                                        (response.Table[i].Session == "0" ? "0d 0h 0m 0s" : fn_AverageTime(response.Table[i].TotalTime)) + "</div>" +
                                                        "</div>";
                                optiondate1 += "'" + response.Table[i].DateShort2 + "',";
                                gettotalcount1 += response.Table[i].Session + ",";
                                getuniquecount1 += response.Table[i].UniqueVisit + ",";

                                pd = response.Table[i].DateShort2;
                                ptc = response.Table[i].Session;
                                puc = response.Table[i].UniqueVisit;
                            }
                        }
                        if (curdate.length > i) {
                            if (response.Table1.length > i) {
                                tabletd += "<tr><td>" + (duration == 1 ? m + "&nbsp;&nbsp;" + response.Table1[i].DateShort2 : response.Table1[i].DateShort2) + "</td><td>" + response.Table1[i].Session + "</td><td>" + response.Table1[i].UniqueVisit + "</td><td>" + (response.Table1[i].TotalVisit == '' ? "0" : response.Table1[i].TotalVisit) + "</td><td>" + (response.Table1[i].NewVisitors == '' ? "0" : response.Table1[i].NewVisitors) + "</td><td>" + (response.Table1[i].Session == "0" ? "0d 0h 0m 0s" : fn_AverageTime(response.Table1[i].TotalTime)) + "</td></tr>";
                                InnerDivhtml += "<div style='text-align: left;' class='itemStyle'>" +
                                                        "<div style='float: left; width: 15%;'>" +
                                                        (duration == 1 ? m + "&nbsp;&nbsp;" + response.Table1[i].DateShort2 : response.Table1[i].DateShort2) + "</div>" +
                                                        "<div style='float: left; width: 15%;' class='short1'>" +
                                                        response.Table1[i].Session + "</div>" +
                                                        "<div style='float: left; width: 20%;' class='short2'>" +
                                                        (response.Table1[i].UniqueVisit != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + response.Table1[i].DateFrom + "&To=" + response.Table1[i].DateTo + "'>" + response.Table1[i].UniqueVisit + "[View]</a>" : response.Table1[i].UniqueVisit) + "</div>" +
                                                        "<div style='float: left; width: 17%;' class='short3'>" +
                                                        (response.Table1[i].TotalVisit == null || response.Table1[i].TotalVisit == '' ? "0" : response.Table1[i].TotalVisit) + "</div>" +
                                                        "<div style='float: left; width: 19%;' class='short4'>" +
                                                        (response.Table1[i].NewVisitors != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + response.Table1[i].DateFrom + "&To=" + response.Table1[i].DateTo + "&Type=New&RedirectedFrom=Visits'>" + response.Table1[i].NewVisitors + "[View]</a>" : response.Table1[i].NewVisitors) + "</div>" +
                                                        "<div style='float: left; text-align: right;width: 14%;'>" +
                                                        (response.Table1[i].Session == "0" ? "0d 0h 0m 0s" : fn_AverageTime(response.Table1[i].TotalTime)) + "</div>" +
                                                        "</div>";
                                optiondate += "'" + response.Table1[i].DateShort2 + "',";
                                gettotalcount += response.Table1[i].Session + ",";
                                getuniquecount += response.Table1[i].UniqueVisit + ",";

                                cd = response.Table1[i].DateShort2;
                                ctc = response.Table1[i].Session;
                                cuc = response.Table1[i].UniqueVisit;
                            }
                        }
                        if (compareOption == 'Session') {
                            getTooltips += "," + "'<strong style=\"color:#0D8ECF;\">" + cd + "</strong>-<strong style=\"color:#0D8ECF;\">" + ctc + "</strong><br/><strong style=\"color:#ff8d11;\">" + pd + "</strong>-<strong style=\"color:#ff8d11;\">" + ptc + "</strong>'";
                        } else {
                            getTooltips += "," + "'<strong style=\"color:#0D8ECF;\">" + cd + "</strong>-<strong style=\"color:#0D8ECF;\">" + cuc + "</strong><br/><strong style=\"color:#ff8d11;\">" + pd + "</strong>-<strong style=\"color:#ff8d11;\">" + puc + "</strong>'";
                        }
                    });
                } else {
                    $.each(response.Table, function () {
                        tabletd += "<tr><td>" + (duration == 1 ? m + "&nbsp;&nbsp;" + this.DateShort : this.DateShort) + "</td><td>" + this.Session + "</td><td>" + this.UniqueVisit + "</td><td>" + (this.TotalVisit == '' ? "0" : this.TotalVisit) + "</td><td>" + (this.NewVisitors == '' ? "0" : this.NewVisitors) + "</td><td>" + (this.Session == "0" ? "0d 0h 0m 0s" : fn_AverageTime(this.TotalTime)) + "</td></tr>";
                        InnerDivhtml += "<div style='text-align: left;' class='itemStyle'>" +
                                                "<div style='float: left; width: 15%;'>" +
                                                (duration == 1 ? m + "&nbsp;&nbsp;" + this.DateShort : this.DateShort) + "</div>" +
                                                "<div style='float: left; width: 15%;' class='short1'>" +
                                                this.Session + "</div>" +
                                                "<div style='float: left; width: 20%;' class='short2'>" +
                                                (this.UniqueVisit != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + this.DateFrom + "&To=" + this.DateTo + "'>" + this.UniqueVisit + "[View]</a>" : this.UniqueVisit) + "</div>" +
                                                "<div style='float: left; width: 17%;' class='short3'>" +
                                                (this.TotalVisit == '' ? "0" : this.TotalVisit) + "</div>" +
                                                "<div style='float: left; width: 19%;' class='short4'>" +
                                                (this.NewVisitors != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + this.DateFrom + "&To=" + this.DateTo + "&Type=New&RedirectedFrom=Visits'>" + this.NewVisitors + "[View]</a>" : this.NewVisitors) + "</div>" +
                                                "<div style='float: left; text-align: right; width: 14%;'>" +
                                                (this.Session == "0" ? "0d 0h 0m 0s" : fn_AverageTime(this.TotalTime)) + "</div>" +
                                                "</div>";
                        optiondate += "'" + this.DateShort + "',";
                        gettotalcount += this.Session + ",";
                        getuniquecount += this.UniqueVisit + ",";
                    });
                }
                optiondate = optiondate.slice(0, -1);
                gettotalcount = gettotalcount.slice(0, -1);
                getuniquecount = getuniquecount.slice(0, -1);

                gettotalcount1 = gettotalcount1.slice(0, -1);
                getuniquecount1 = getuniquecount1.slice(0, -1);

                //dvExport.innerHTML = "<table id='ExportTable'>" + tabletd + "</table>";

                //dvReport.innerHTML = "<div style='text-align: left;' class='headerstyle'>" +
                //                                "<div style='float: left; width: 15%;'>" +
                //                                "Day</div>" +
                //                                "<div style='float: left; width: 15%;' class='headerSort' id='short1'>" +
                //                                "Sessions</div>" +
                //                                "<div style='float: left; width: 20%;' class='headerSort' id='short2'>" +
                //                                "Unique Visitors</div>" +
                //                                "<div style='float: left; width: 17%;' class='headerSort' id='short3'>" +
                //                                "Page Views</div>" +
                //                                "<div style='float: left; width: 19%;' class='headerSort' id='short4'>" +
                //                                "New Visitors</div>" +
                //                                "<div style='float: left; text-align: right; width: 14%;'>" +
                //                                "Average Time</div>" +
                //                                "</div>" + InnerDivhtml;
                //Alternate color while comparing
                if (compare == 1) {
                    if (compare == 1)
                        $(".itemStyle:odd").css("background-color", "#f2f2f2");//#E7FAD6
                    else
                        $(".itemStyle:odd").css("background-color", "#fffff");
                }
                ///Sorting report
                CallSort();
                ///Report graph
                var graphscript = '';
                if (compare != 1) {
                    var m = duration == "3" ? 3 : 2;
                    graphscript = "(function($){var chart;$(document).ready(function(){chart = new Plumbcharts.Chart({" +
                                        "chart: {renderTo: 'iframe_session',type: 'spline'},title: {" +
                                        "style: {color: '#5f5f5f',fontWeight: 'bold',fontSize: '14px',fontFamily:'tahoma'}," +
                                        "text:'Sessions Vs Unique Visitors'" +
                                        "},subtitle: {text: ''},xAxis: {" +
                                        "categories: [" + optiondate + "]," +
                                        "tickInterval: " + m +
                                        "},yAxis: { min: 0, title : ''},tooltip: {formatter: function() {return '<b>'+ this.x + '<br />'+ this.series.name +'</b>: '+ this.y;}}," +
                                        "series: [{color: '#0D8ECF',name: 'Sessions',data: [" + gettotalcount + "]}, {color: '#ff8d11',name: 'Unique Visitors',data:  [" + getuniquecount + "]}]});});" +
                                        "})(jQuery);";
                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    document.getElementsByTagName("head")[0].appendChild(script);
                    script.innerHTML = graphscript;
                } else {///Session or Unique Visits COmparison Graph
                    VisitorComparisonGraph(optiondate, gettotalcount, getuniquecount, gettotalcount1, getuniquecount1, compareOption, prvsfrom_to, crtfrom_to, getTooltips);
                }
                ///End Report Graph
                ///Percent Comparison
                VisitorOverallData(duration, fromdate, todate);
                ///

                $("#iframe_session").css("margin", "0px");
                //show print & export option once report loaded

                $("#dvLoading").css("display", "none");
            }
            else { $("#dvDefault").css("display", "block"); $("#dvLoading").css("display", "none"); $("#divcontent").css("display", "none"); $("#dvPrintExport").css("display", "none"); }
        },
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }
    });
}

function fn_AverageTime(Desc) {
    var secnew = 0;
    var seconds = 0, days = 0, hours = 0, minutes = 0;
    var total = '';
    if (Desc != "undefined" && Desc != "") {
        seconds = Desc % 60
        days = Math.floor(Desc / 60 / 60 / 24);
        hours = Math.floor(Desc / 60 / 60) % 24
        minutes = Math.floor(Desc / 60) % 60
        secnew = Math.round(seconds - (days * 86400) - (hours * 3600) - (minutes * 60));
    }
    if (days == 0 && hours == 0 && minutes == 0 && secnew == 0)
        total = "less than a second";
    else
        total = Math.abs(days) + "d " + Math.abs(hours) + "h " + Math.abs(minutes) + "m " + Math.abs(seconds) + "s";
    return (total);
}


function VisitorComparisonGraph(optiondate, gettotalcount, getuniquecount, gettotalcount1, getuniquecount1, compareOption, prvsfrom_to, crtfrom_to, getTooltips) {
    getTooltips = "var myArrary = new Array(" + getTooltips.slice(1) + ");";
    if (compareOption == 'Session') {
        graphscript = "(function($){var chart;" + getTooltips +
                            "$(document).ready(function(){chart = new Plumbcharts.Chart({chart: {renderTo: 'iframe_session'," +
                            "type: 'spline'},title: {style: {color: '#5f5f5f',fontWeight: 'bold',fontSize: '14px',fontFamily:'tahoma'},text:'Session Comparison'}," +
                            "subtitle: {text: ''},xAxis: {" +
                            "categories: [" + optiondate + "]," +
                            "tickinterval: 2},yAxis: { min: 0, title : ''},tooltip: {formatter: function() {" +
                            "var s='';$.each(this.points, function(i, point) {s = myArrary[this.series.data.indexOf(this.point)];});return s;},shared: true}," +
                            "series: [{color: '#ff8d11'," +
                            "name: 'Session : " + prvsfrom_to + "'," +
                            "data:  [" + gettotalcount1 + "]" +
                            "},{color: '#0d8ecf'," +
                            "name: 'Session : " + crtfrom_to + "'," +
                            "data: [" + gettotalcount + "]" +
                            "}]});});})(jQuery);";
    }
    else {
        graphscript = "(function($){var chart;" + getTooltips +
                            "$(document).ready(function(){chart = new Plumbcharts.Chart({chart: {renderTo: 'iframe_session'," +
                            "type: 'spline'},title: {style: {color: '#5f5f5f',fontWeight: 'bold',fontSize: '14px',fontFamily:'tahoma'},text:'Unique Visits Comparison'}," +
                            "subtitle: {text: ''},xAxis: {" +
                            "categories: [" + optiondate + "]," +
                            "tickInterval: 2},yAxis: { min: 0, title : ''},tooltip: {formatter: function() {" +
                            "var s='';$.each(this.points, function(i, point) {s = myArrary[this.series.data.indexOf(this.point)];});return s;},shared: true}," +
                            "series: [{color: '#ff8d11'," +
                            "name: 'Unique Visits : " + prvsfrom_to + "'," +
                            "data:  [" + getuniquecount1 + "]" +
                            "},{color: '#0D8ECF'," +
                            "name: 'Unique Visits : " + crtfrom_to + "'," +
                            "data: [" + getuniquecount + "]" +
                            "}]});});})(jQuery);";
    }
    var script = document.createElement("script");
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
    script.innerHTML = graphscript;
}

function VisitorOverallData(dur, frm, to) {
    var imgelement = "<img src='" + cdnpath + "al_loading.gif" + "' alt='Loading' style='width:20px; height:20px; position:relative; top:3px; left:5px' />";
    lblSessions.innerHTML = imgelement;
    lblUniques.innerHTML = imgelement;
    lblNewVisits.innerHTML = imgelement;
    lblPageViews.innerHTML = imgelement;
    $.ajax({
        url: "/Analytics/Dashboard/OverallData",
        type: 'Post',
        data: "{'accountId':'" + AccountId + "','duration':'" + dur + "','fromdate':'" + frm + "','todate':'" + to + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var uniques = 0, newVisits = 0;
            $.each(response.Table, function () {
                lblSessions.innerHTML = this.Session;
                lblUniques.innerHTML = this.UniqueVisits;
                uniques = this.UniqueVisits;
                lblPageViews.innerHTML = this.PageViews;
            });
            $.each(response.Table1, function () {
                newVisits = parseInt(this.NewVisitor);
            });
            lblNewVisits.innerHTML = uniques != 0 ? Math.round((newVisits / uniques) * 100) + '%' : 0 + '%';
            VisitorOverallPercentage(dur, frm, to);
        }
    });
}


function VisitorOverallPercentage(dur, frm, to) {
    var imgelement = "<img src='" + cdnpath + "al_loading.gif" + "' alt='Loading' style='width:20px; height:20px; position:relative; top:3px; left:5px' />";
    lblSessions1.innerHTML = imgelement;
    lblUniques1.innerHTML = imgelement;
    lblNewVisits1.innerHTML = imgelement;
    lblPageViews1.innerHTML = imgelement;
    $.ajax({
        url: "/Analytics/Dashboard/OverallPercentage",
        type: 'Post',
        data: "{'accountId':'" + AccountId + "','duration':'" + dur + "','fromdate':'" + frm + "','todate':'" + to + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response.Table, function () {
                lblSessions1.innerHTML = this.SessionRate;
                lblUniques1.innerHTML = this.UniquesRate;
                lblPageViews1.innerHTML = this.PageViewsRate;
                lblNewVisits1.innerHTML = this.NewRate;
            });
        }
    });
}


