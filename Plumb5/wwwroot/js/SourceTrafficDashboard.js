


$(document).ready(function () {
    SourceReport();
});

function SourceReport() {
    
   
    $("#dvLoading").css("display", "block");
    var getFilter = CheckFilter(duration);
    var getSocialcount = '', optiondate = '', getdirectcount = '', getrefercount = '', getsearchcount = '', getEmailcount = '', getSmscount = '', getPaidcount = '', fromdate = getFilter[0], todate = getFilter[1], compare = getFilter[2],
        compareOption = getFilter[3], maintain = getFilter[4], prvsfrom_to = '', crtfrom_to = '', getTooltips = '', optiondate1 = '',
        getSocialcount1 = '', getdirectcount1 = '', getrefercount1 = '', getsearchcount1 = '', getEmailcount1 = '', getSmscount1 = '', getPaidcount1 = '';

    $.ajax({
        url: "/Analytics/Traffic/AllSourcesReport",
        type: 'Post',
        data: "{'accountId':'" + AccountId + "','duration':'" + duration + "','fromdate':'" + fromdate + "','todate':'" + todate + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var innerDivhtml = "", tabletd = "<tr style='font-weight: bold;'><td>Day</td><td>Direct Traffic</td><td>Search Traffic</td><td>Refer Traffic</td><td>Social Traffic</td><td>Email Traffic</td><td>Sms Traffic</td><td>Paid Traffic</td></tr>";
            var Tbllngth;
            if (compare == 1) {
                Tbllngth = response.Table1.length;
            } else { Tbllngth = response.Table.length; }
            if (Tbllngth > 0) {
                $("#dvSourceDefault").css("display", "none");
                $("#divSourcecontent").css("display", "block");
                $("#dvPrintExport").css("display", "block");
                if (compare == 1) {
                    $.each(curdate, function (i) {
                        var cd = '', cdirectC = '', csearchC = '', creferC = '', csocialC = '', cEmailC = '', cSmsC = '', cPaidC = '',
                            pd = '', pdirectC = '', psearchC = '', preferC = '', psocialC = '', pEmailC = '', pSmsC = '', pPaidC = '', condition = 0;
                        if (prvsdate.length > i) {
                            if (response.Table.length == response.Table1.length) {
                                if (response.Table[i].DateShort2 == response.Table1[i].DateShort2)
                                    condition = 1;
                            } else { condition = 0 }
                            if (condition == 0 && response.Table.length > i) {
                                tabletd += "<tr><td>" + (duration == 1 ? m + "&nbsp;&nbsp;" + response.Table[i].DateShort2 : response.Table[i].DateShort2) + "</td><td>" + response.Table[i].Direct + "</td><td>" + response.Table[i].Search + "</td><td>" + response.Table[i].Refer + "</td><td>" + response.Table[i].Social + "</td><td>" + response.Table[i].Email + "</td><td>" + response.Table[i].Sms + "</td><td>" + response.Table[i].Paid + "</td></tr>";
                                var DirectViewAlllnk = response.Table[i].Direct;
                                var SearchviewallLnk = response.Table[i].Search;
                                var ReferalViewallLnk = response.Table[i].Refer;
                                innerDivhtml += "<div style='text-align: left;' class='itemStyle'>" +
                                                        "<div style='float: left; width: 12%;'>" +
                                                        (duration == 1 ? m + "&nbsp;&nbsp;" + response.Table[i].DateShort2 : response.Table[i].DateShort2) + "</div>" +
                                                        "<div style='float: left; width: 13%;' class='short1'>" +
                                                        (DirectViewAlllnk != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + response.Table[i].DateFrom + "&To=" + response.Table[i].DateTo + "&AllSource=AllDirect'>" + DirectViewAlllnk + "[View]</a>" : DirectViewAlllnk) + "</div>" +
                                                        "<div style='float: left; width: 14%;' class='short2'>" +
                                                        (SearchviewallLnk != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + response.Table[i].DateFrom + "&To=" + response.Table[i].DateTo + "&AllSource=AllSearch'>" + SearchviewallLnk + "[View]</a>" : SearchviewallLnk) + "</div>" +
                                                        "<div style='float: left; width: 13%;' class='short3'>" +
                                                        (ReferalViewallLnk != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + response.Table[i].DateFrom + "&To=" + response.Table[i].DateTo + "&AllSource=AllRefer'>" + ReferalViewallLnk + "[View]</a>" : ReferalViewallLnk) + "</div>" +
                                                        "<div style='float: left; width: 13%;' class='short4'>" +
                                                        (response.Table[i].Social != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + response.Table[i].DateFrom + "&To=" + response.Table[i].DateTo + "&AllSource=AllSocial'>" + response.Table[i].Social + "[View]</a>" : response.Table[i].Social) + "</div>" +
                                                        "<div style='float: left; width: 13%;' class='short5'>" +
                                                        (response.Table[i].Email != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + response.Table[i].DateFrom + "&To=" + response.Table[i].DateTo + "&AllSource=AllEmail'>" + response.Table[i].Email + "[View]</a>" : response.Table[i].Email) + "</div>" +
                                                        "<div style='float: left; width: 11%;' class='short6'>" +
                                                        (response.Table[i].Sms != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + response.Table[i].DateFrom + "&To=" + response.Table[i].DateTo + "&AllSource=AllSms'>" + response.Table[i].Sms + "[View]</a>" : response.Table[i].Sms) + "</div>" +
                                                        "<div style='float: left; text-align: right; width: 11%; margin-left:-24px;' class='short7'>" +
                                                        (response.Table[i].Paid != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + response.Table[i].DateFrom + "&To=" + response.Table[i].DateTo + "&AllSource=AllPaid'>" + response.Table[i].Paid + "[View]</a>" : response.Table[i].Paid) + "</div>" +
                                                        "</div>";
                                optiondate1 += "'" + response.Table[i].DateShort2 + "',";
                                getdirectcount1 += response.Table[i].Direct + ",";
                                getsearchcount1 += response.Table[i].Search + ",";
                                getrefercount1 += response.Table[i].Refer + ",";
                                getSocialcount1 += response.Table[i].Social + ",";
                                getEmailcount1 += response.Table[i].Email + ",";
                                getSmscount1 += response.Table[i].Sms + ",";
                                getPaidcount1 += response.Table[i].Paid + ",";

                                pd = response.Table[i].DateShort2;
                                pdirectC = response.Table[i].Direct;
                                psearchC = response.Table[i].Search;
                                preferC = response.Table[i].Refer;
                                psocialC = response.Table[i].Social;
                                pEmailC = response.Table[i].Email;
                                pSmsC = response.Table[i].Sms;
                                pPaidC = response.Table[i].Paid;
                            }
                        }
                        if (curdate.length > i) {
                            if (response.Table1.length > i) {
                                tabletd += "<tr><td>" + (duration == 1 ? m + "&nbsp;&nbsp;" + response.Table1[i].DateShort2 : response.Table1[i].DateShort2) + "</td><td>" + response.Table1[i].Direct + "</td><td>" + response.Table1[i].Search + "</td><td>" + response.Table1[i].Refer + "</td><td>" + response.Table1[i].Social + "</td><td>" + response.Table1[i].Email + "</td><td>" + response.Table1[i].Sms + "</td><td>" + response.Table1[i].Paid + "</td></tr>";
                                var DirectViewAlllnk = response.Table1[i].Direct;
                                var SearchviewallLnk = response.Table1[i].Search;
                                var ReferalViewallLnk = response.Table1[i].Refer;
                                innerDivhtml += "<div style='text-align: left;' class='itemStyle'>" +
                                                        "<div style='float: left; width: 12%;'>" +
                                                        (duration == 1 ? m + "&nbsp;&nbsp;" + response.Table1[i].DateShort2 : response.Table1[i].DateShort2) + "</div>" +
                                                        "<div style='float: left; width: 13%;' class='short1'>" +
                                                        (DirectViewAlllnk != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + response.Table1[i].DateFrom + "&To=" + response.Table1[i].DateTo + "&AllSource=AllDirect'>" + DirectViewAlllnk + "[View]</a>" : DirectViewAlllnk) + "</div>" +
                                                        "<div style='float: left; width: 14%;' class='short2'>" +
                                                        (SearchviewallLnk != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + response.Table1[i].DateFrom + "&To=" + response.Table1[i].DateTo + "&AllSource=AllSearch'>" + SearchviewallLnk + "[View]</a>" : SearchviewallLnk) + "</div>" +
                                                        "<div style='float: left; width: 13%;' class='short3'>" +
                                                        (ReferalViewallLnk != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + response.Table1[i].DateFrom + "&To=" + response.Table1[i].DateTo + "&AllSource=AllRefer'>" + ReferalViewallLnk + "[View]</a>" : ReferalViewallLnk) + "</div>" +
                                                        "<div style='float: left; width: 13%;' class='short4'>" +
                                                        (response.Table1[i].Social != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + response.Table1[i].DateFrom + "&To=" + response.Table1[i].DateTo + "&AllSource=AllSocial'>" + response.Table1[i].Social + "[View]</a>" : response.Table1[i].Social) + "</div>" +
                                                        "<div style='float: left; width: 13%;' class='short5'>" +
                                                        (response.Table1[i].Email != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + response.Table1[i].DateFrom + "&To=" + response.Table1[i].DateTo + "&AllSource=AllEmail'>" + response.Table1[i].Email + "[View]</a>" : response.Table1[i].Email) + "</div>" +
                                                        "<div style='float: left; width: 11%;' class='short6'>" +
                                                        (response.Table1[i].Sms != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + response.Table1[i].DateFrom + "&To=" + response.Table1[i].DateTo + "&AllSource=AllSms'>" + response.Table1[i].Sms + "[View]</a>" : response.Table1[i].Sms) + "</div>" +
                                                        "<div style='float: left; width: 11%; text-align: right; margin-left:-24px;' class='short7'>" +
                                                        (response.Table1[i].Paid != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + response.Table1[i].DateFrom + "&To=" + response.Table1[i].DateTo + "&AllSource=AllPaid'>" + response.Table1[i].Paid + "[View]</a>" : response.Table1[i].Paid) + "</div>" +
                                                        "</div>";
                                optiondate += "'" + response.Table1[i].DateShort2 + "',";
                                getdirectcount += response.Table1[i].Direct + ",";
                                getsearchcount += response.Table1[i].Search + ",";
                                getrefercount += response.Table1[i].Refer + ",";
                                getSocialcount += response.Table1[i].Social + ",";
                                getEmailcount += response.Table1[i].Email + ",";
                                getSmscount += response.Table1[i].Sms + ",";
                                getPaidcount += response.Table1[i].Paid + ",";

                                cd = response.Table1[i].DateShort2;
                                cdirectC = response.Table1[i].Direct;
                                csearchC = response.Table1[i].Search;
                                creferC = response.Table1[i].Refer;
                                csocialC = response.Table1[i].Social;
                                cEmailC = response.Table1[i].Email;
                                cSmsC = response.Table1[i].Sms;
                                cPaidC = response.Table1[i].Paid;
                            }
                        }
                        if (compareOption == 'Direct') {
                            getTooltips += "," + "'<strong style=\"color:#0D8ECF;\">" + cd + "</strong>-<strong style=\"color:#0D8ECF;\">" + cdirectC + "</strong><br/><strong style=\"color:#04D215;\">" + pd + "</strong>-<strong style=\"color:#04D215;\">" + pdirectC + "</strong>'";
                        } else if (compareOption == 'Search') {
                            getTooltips += "," + "'<strong style=\"color:#0D8ECF;\">" + cd + "</strong>-<strong style=\"color:#0D8ECF;\">" + csearchC + "</strong><br/><strong style=\"color:#04D215;\">" + pd + "</strong>-<strong style=\"color:#04D215;\">" + psearchC + "</strong>'";
                        } else if (compareOption == 'Refer') {
                            getTooltips += "," + "'<strong style=\"color:#0D8ECF;\">" + cd + "</strong>-<strong style=\"color:#0D8ECF;\">" + creferC + "</strong><br/><strong style=\"color:#04D215;\">" + pd + "</strong>-<strong style=\"color:#04D215;\">" + preferC + "</strong>'";
                        } else if (compareOption == 'Social') {
                            getTooltips += "," + "'<strong style=\"color:#0D8ECF;\">" + cd + "</strong>-<strong style=\"color:#0D8ECF;\">" + csocialC + "</strong><br/><strong style=\"color:#04D215;\">" + pd + "</strong>-<strong style=\"color:#04D215;\">" + psocialC + "</strong>'";
                        } else if (compareOption == 'Email') {
                            getTooltips += "," + "'<strong style=\"color:#0D8ECF;\">" + cd + "</strong>-<strong style=\"color:#0D8ECF;\">" + cEmailC + "</strong><br/><strong style=\"color:#04D215;\">" + pd + "</strong>-<strong style=\"color:#04D215;\">" + pEmailC + "</strong>'";
                        } else if (compareOption == 'Sms') {
                            getTooltips += "," + "'<strong style=\"color:#0D8ECF;\">" + cd + "</strong>-<strong style=\"color:#0D8ECF;\">" + cSmsC + "</strong><br/><strong style=\"color:#04D215;\">" + pd + "</strong>-<strong style=\"color:#04D215;\">" + pSmsC + "</strong>'";
                        } else if (compareOption == 'Paid') {
                            getTooltips += "," + "'<strong style=\"color:#0D8ECF;\">" + cd + "</strong>-<strong style=\"color:#0D8ECF;\">" + cPaidC + "</strong><br/><strong style=\"color:#04D215;\">" + pd + "</strong>-<strong style=\"color:#04D215;\">" + pPaidC + "</strong>'";
                        }
                    });
                }
                else {
                    $.each(response.Table, function () {
                        tabletd += "<tr><td>" + (duration == 1 ? m + "&nbsp;&nbsp;" + this.DateShort : this.DateShort) + "</td><td>" + this.Direct + "</td><td>" + this.Search + "</td><td>" + this.Refer + "</td><td>" + this.Social + "</td><td>" + this.Email + "</td><td>" + this.Sms + "</td><td>" + this.Paid + "</td></tr>";
                        var DirectViewAlllnk = this.Direct;
                        var SearchviewallLnk = this.Search;
                        var ReferalViewallLnk = this.Refer;
                        innerDivhtml += "<div style='text-align: left;' class='itemStyle'>" +
                                                "<div style='float: left; width: 12%;'>" +
                                                (duration == 1 ? m + "&nbsp;&nbsp;" + this.DateShort : this.DateShort) + "</div>" +
                                                "<div style='float: left; width: 13%;' class='short1'>" +
                                                (DirectViewAlllnk != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + this.DateFrom + "&To=" + this.DateTo + "&AllSource=AllDirect'>" + DirectViewAlllnk + "[View]</a>" : DirectViewAlllnk) + "</div>" +
                                                "<div style='float: left; width: 14%;' class='short2'>" +
                                                (SearchviewallLnk != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + this.DateFrom + "&To=" + this.DateTo + "&AllSource=AllSearch'>" + SearchviewallLnk + "[View]</a>" : SearchviewallLnk) + "</div>" +
                                                "<div style='float: left; width: 13%;' class='short3'>" +
                                                (ReferalViewallLnk != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + this.DateFrom + "&To=" + this.DateTo + "&AllSource=AllRefer'>" + ReferalViewallLnk + "[View]</a>" : ReferalViewallLnk) + "</div>" +
                                                "<div style='float: left; width: 13%;' class='short4'>" +
                                                (this.Social != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + this.DateFrom + "&To=" + this.DateTo + "&AllSource=AllSocial'>" + this.Social + "[View]</a>" : this.Social) + "</div>" +
                                                "<div style='float: left; width: 13%;' class='short5'>" +
                                                (this.Email != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + this.DateFrom + "&To=" + this.DateTo + "&AllSource=AllEmail'>" + this.Email + "[View]</a>" : this.Email) + "</div>" +
                                                "<div style='float: left; width: 11%;' class='short6'>" +
                                                (this.Sms != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + this.DateFrom + "&To=" + this.DateTo + "&AllSource=AllSms'>" + this.Sms + "[View]</a>" : this.Sms) + "</div>" +
                                                 "<div style='float: left; width: 11%; text-align: right; margin-left:-24px;' class='short7'>" +
                                                (this.Paid != "0" ? "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + this.DateFrom + "&To=" + this.DateTo + "&AllSource=AllPaid'>" + this.Paid + "[View]</a>" : this.Paid) + "</div>" +
                                                "</div>";
                        optiondate += "'" + this.DateShort + "',";
                        getdirectcount += this.Direct + ",";
                        getsearchcount += this.Search + ",";
                        getrefercount += this.Refer + ",";
                        getSocialcount += this.Social + ",";
                        getEmailcount += this.Email + ",";
                        getSmscount += this.Sms + ",";
                        getPaidcount += this.Paid + ",";
                    });
                }
                optiondate = optiondate.slice(0, -1);
                getdirectcount = getdirectcount.slice(0, -1);
                getsearchcount = getsearchcount.slice(0, -1);
                getrefercount = getrefercount.slice(0, -1);
                getSocialcount = getSocialcount.slice(0, -1);
                getEmailcount = getEmailcount.slice(0, -1);
                getSmscount = getSmscount.slice(0, -1);
                getPaidcount = getPaidcount.slice(0, -1);

                getdirectcount1 = getdirectcount1.slice(0, -1);
                getsearchcount1 = getsearchcount1.slice(0, -1);
                getrefercount1 = getrefercount1.slice(0, -1);
                getSocialcount1 = getSocialcount1.slice(0, -1);
                getEmailcount1 = getEmailcount1.slice(0, -1);
                getSmscount1 = getSmscount1.slice(0, -1);
                getPaidcount1 = getPaidcount1.slice(0, -1);

                //window.dvExport.innerHTML = "<table id='ExportTable'>" + tabletd + "</table>";
                window.dvReport.innerHTML = "<div style='text-align: left;' class='headerstyle'>" +
                                                    "<div style='float: left; width: 12%;'>" +
                                                    "Day</div>" +
                                                    "<div style='float: left; width: 13%;' class='headerSort' id='short1'>" +
                                                    "Direct Traffic</div>" +
                                                    "<div style='float: left; width: 14%;' class='headerSort' id='short2'>" +
                                                    "Search Traffic</div>" +
                                                    "<div style='float: left; width: 13%;' class='headerSort' id='short3'>" +
                                                    "Refer Traffic</div>" +
                                                    "<div style='float: left; width: 13%;' class='headerSort' id='short4'>" +
                                                    "Social Traffic</div>" +
                                                    "<div style='float: left; width: 13%;' class='headerSort' id='short5'>" +
                                                    "Email Traffic</div>" +
                                                     "<div style='float: left; width: 11%;' class='headerSort' id='short6'>" +
                                                    "Sms Traffic</div>" +
                                                    "<div style='float: left; text-align: right; width: 11%;' class='headerSort' id='short7'>" +
                                                    "Paid Traffic</div>" +
                                                    "</div>" + innerDivhtml;
                lblSourceDirectTraffic.innerHTML = P5_SummationOfDivData("short1");
                lblSearchTraffic.innerHTML = P5_SummationOfDivData("short2");
                lblReferTraffic.innerHTML = P5_SummationOfDivData("short3");
                lblSocialTraffic.innerHTML = P5_SummationOfDivData("short4");
                lblEmailTraffic.innerHTML = P5_SummationOfDivData("short5");
                lblSmsTraffic.innerHTML = P5_SummationOfDivData("short6");
                lblPaidTraffic.innerHTML = P5_SummationOfDivData("short7");

                $("#dvExpend").css({ 'height': (620 > $("#dvReport").height() + 510) ? '620px' : $("#dvReport").height() + 510 + 'px' });
                ///Alternate color while comparing
                if (compare == 1) {
                    if (compare == 1)
                        $(".itemStyle:odd").css("background-color", "#f2f2f2");
                    else
                        $(".itemStyle:odd").css("background-color", "#fffff");
                }
                ///Sorting report
                CallSort();
                ///Report graph
                var graphscript = '';
                if (compare != 1) {
                    graphscript = "(function($){var chart;$(document).ready(function()" +
                                        "{chart = new Plumbcharts.Chart({chart: {renderTo: 'iframe_source',type: 'spline'},title: {style: {color: '#5f5f5f', fontWeight: 'bold',fontSize: '14px', fontFamily:'tahoma'}," +
                                        "text: 'Traffic by source'" +
                                        "},subtitle: {text: ''}, xAxis: {" +
                                        "categories: [" + optiondate + "]," +
                                        "tickInterval: 2}, yAxis: { min: 0, title : ''},tooltip: {formatter: function() {return '<b>'+ this.x + '<br />'+ this.series.name +'</b>: '+ this.y;}}," +
                                        "series: [{        color: '#0D8ECF',name: 'Direct Traffic'," +
                                        "data: [" + getdirectcount + "]" +
                                        "},{color: '#efc419',name: 'Search Traffic'," +
                                        "data:  [" + getsearchcount + "]}," +
                                        "{color: '#ff8d11',name: 'Refer Traffic'," +
                                        "data:  [" + getrefercount + "]}," +
                                        "{color: '#B63426',name: 'Social Traffic'," +
                                        "data:  [" + getSocialcount + "]}," +
                                        "{color: '#076344',name: 'Email Traffic'," +//#f15c80
                                        "data:  [" + getEmailcount + "]}," +
                                        "{color: '#90ed7d',name: 'Sms Traffic'," +
                                        "data:  [" + getSmscount + "]}" +
                                        ",{color: '#F15C80',name: 'Paid Traffic'," +
                                        "data:  [" + getPaidcount + "]}," +
                                        "]});});})(jQuery);";
                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    document.getElementsByTagName("head")[0].appendChild(script);
                    script.innerHTML = graphscript;
                } else {
                    ///Direct, Search or Refer Traffic Comparison Graph
                    ComparisonGraph(optiondate, getdirectcount, getsearchcount, getrefercount, getSocialcount, getdirectcount1, getsearchcount1, getrefercount1, getSocialcount1, getEmailcount, getEmailcount1, getSmscount, getSmscount1, getPaidcount, getPaidcount1, compareOption, prvsfrom_to, crtfrom_to, getTooltips);
                }
                ///End Report Graph
                ///Percent Comparison
                //PercentageComparison(duration, fromdate, todate);
                ///
                $("#iframe_source").css("margin", "0px");
                //show print & export option once report loaded
                $("#dvPrintExport").css("display", "block");
                $("#dvLoading").css("display", "none");
            }
            else {
                $("#dvSourceDefault").css("display", "block");
                $("#dvLoading").css("display", "none");
                $("#divSourcecontent").css("display", "none");
                $("#dvPrintExport").css("display", "none");
            }
        },
        error: function (objxmlRequest) {
            window.console.log('oops');
        }
    });
    ///Percentage Comparison
    OverallPercentage(duration, fromdate, todate);
}

//Overall Percentage
function OverallPercentage(dur, frm, to) {
    var imgelement = "<img src='" + cdnpath + "al_loading.gif" + "' alt='Loading' style='width:20px; height:20px; position:relative; top:3px; left:5px' />";
    lblSourceDirectTraffic1.innerHTML = imgelement;
    lblSearchTraffic1.innerHTML = imgelement;
    lblReferTraffic1.innerHTML = imgelement;
    lblSocialTraffic1.innerHTML = imgelement;
    lblEmailTraffic1.innerHTML = imgelement;
    lblSmsTraffic1.innerHTML = imgelement;
    lblPaidTraffic1.innerHTML = imgelement;
    $.ajax({
        url: "/Analytics/Traffic/OverallPercentage",
        type: 'Post',
        data: "{'accountId':'" + AccountId + "','duration':'" + dur + "','fromdate':'" + frm + "','todate':'" + to + "','compare':'0'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response.Table, function () {
                lblSourceDirectTraffic1.innerHTML = this.DirectRate;
                lblSearchTraffic1.innerHTML = this.SearchRate;
                lblReferTraffic1.innerHTML = this.ReferRate;
                lblSocialTraffic1.innerHTML = this.SocialRate;
                lblEmailTraffic1.innerHTML = this.EmailRate;
                lblSmsTraffic1.innerHTML = this.SmsRate;
                lblPaidTraffic1.innerHTML = this.PaidRate;
            });
        }
    });
}
function P5_SummationOfDivData(classname) {
    var P5sum = 0;
    $('.' + classname).each(function () {
        P5sum += $(this).text() != '' || $(this).text() != undefined ? parseFloat($(this).text()) : 0;
    });
    return P5sum;
}
/// Comparision Graph
function ComparisonGraph(optiondate, getdirectcount, getsearchcount, getrefercount, getSocialcount, getdirectcount1, getsearchcount1, getrefercount1, getSocialcount1, getEmailcount, getEmailcount1, getSmscount, getSmscount1, getPaidcount, getPaidcount1, compareOption, prvsfrom_to, crtfrom_to, getTooltips) {
    getTooltips = "var myArrary = new Array(" + getTooltips.slice(1) + ");";
    if (compareOption == 'Direct') {
        graphscript = "(function($){var chart;" + getTooltips +
                            "$(document).ready(function(){chart = new Plumbcharts.Chart({chart: {renderTo: 'iframe_source'," +
                            "type: 'spline'},title: {style: {color: '#5f5f5f',fontWeight: 'bold',fontSize: '14px',fontFamily:'tahoma'},text:'Direct Traffic Comparison'}," +
                            "subtitle: {text: ''},xAxis: {" +
                            "categories: [" + optiondate + "]," +
                            "tickinterval: 2},yAxis: { min: 0, title : ''},tooltip: {formatter: function() {" +
                            "var s='';$.each(this.points, function(i, point) {s = myArrary[this.series.data.indexOf(this.point)];});return s;},shared: true}," +
                            "series: [{color: '#ff8d11'," +
                            "name: 'Direct : " + prvsfrom_to + "'," +
                            "data:  [" + getdirectcount1 + "]" +
                            "},{color: '#0d8ecf'," +
                            "name: 'Direct : " + crtfrom_to + "'," +
                            "data: [" + getdirectcount + "]" +
                            "}]});});})(jQuery);";
    } else if (compareOption == 'Search') {
        graphscript = "(function($){var chart;" + getTooltips +
                            "$(document).ready(function(){chart = new Plumbcharts.Chart({chart: {renderTo: 'iframe_source'," +
                            "type: 'spline'},title: {style: {color: '#5f5f5f',fontWeight: 'bold',fontSize: '14px',fontFamily:'tahoma'},text:'Search Traffic Comparison'}," +
                            "subtitle: {text: ''},xAxis: {" +
                            "categories: [" + optiondate + "]," +
                            "tickinterval: 2},yAxis: { min: 0, title : ''},tooltip: {formatter: function() {" +
                            "var s='';$.each(this.points, function(i, point) {s = myArrary[this.series.data.indexOf(this.point)];});return s;},shared: true}," +
                            "series: [{color: '#ff8d11'," +
                            "name: 'Search : " + prvsfrom_to + "'," +
                            "data:  [" + getsearchcount1 + "]" +
                            "},{color: '#0d8ecf'," +
                            "name: 'Search : " + crtfrom_to + "'," +
                            "data: [" + getsearchcount + "]" +
                            "}]});});})(jQuery);";
    } else if (compareOption == 'Refer') {
        graphscript = "(function($){var chart;" + getTooltips +
                           "$(document).ready(function(){chart = new Plumbcharts.Chart({chart: {renderTo: 'iframe_source'," +
                           "type: 'spline'},title: {style: {color: '#5f5f5f',fontWeight: 'bold',fontSize: '14px',fontFamily:'tahoma'},text:'Refer Traffic Comparison'}," +
                           "subtitle: {text: ''},xAxis: {" +
                           "categories: [" + optiondate + "]," +
                           "tickinterval: 2},yAxis: { min: 0, title : ''},tooltip: {formatter: function() {" +
                           "var s='';$.each(this.points, function(i, point) {s = myArrary[this.series.data.indexOf(this.point)];});return s;},shared: true}," +
                           "series: [{color: '#ff8d11'," +
                           "name: 'Refer : " + prvsfrom_to + "'," +
                           "data:  [" + getrefercount1 + "]" +
                           "},{color: '#0d8ecf'," +
                           "name: 'Refer : " + crtfrom_to + "'," +
                           "data: [" + getrefercount + "]" +
                           "}]});});})(jQuery);";
    } else if (compareOption == 'Social') {
        graphscript = "(function($){var chart;" + getTooltips +
                           "$(document).ready(function(){chart = new Plumbcharts.Chart({chart: {renderTo: 'iframe_source'," +
                           "type: 'spline'},title: {style: {color: '#5f5f5f',fontWeight: 'bold',fontSize: '14px',fontFamily:'tahoma'},text:'Social Traffic Comparison'}," +
                           "subtitle: {text: ''},xAxis: {" +
                           "categories: [" + optiondate + "]," +
                           "tickinterval: 2},yAxis: { min: 0, title : ''},tooltip: {formatter: function() {" +
                           "var s='';$.each(this.points, function(i, point) {s = myArrary[this.series.data.indexOf(this.point)];});return s;},shared: true}," +
                           "series: [{color: '#ff8d11'," +
                           "name: 'Social : " + prvsfrom_to + "'," +
                           "data:  [" + getSocialcount1 + "]" +
                           "},{color: '#0d8ecf'," +
                           "name: 'Social : " + crtfrom_to + "'," +
                           "data: [" + getSocialcount + "]" +
                           "}]});});})(jQuery);";
    } else if (compareOption == 'Email') {
        graphscript = "(function($){var chart;" + getTooltips +
                           "$(document).ready(function(){chart = new Plumbcharts.Chart({chart: {renderTo: 'iframe_source'," +
                           "type: 'spline'},title: {style: {color: '#5f5f5f',fontWeight: 'bold',fontSize: '14px',fontFamily:'tahoma'},text:'Email Traffic Comparison'}," +
                           "subtitle: {text: ''},xAxis: {" +
                           "categories: [" + optiondate + "]," +
                           "tickinterval: 2},yAxis: { min: 0, title : ''},tooltip: {formatter: function() {" +
                           "var s='';$.each(this.points, function(i, point) {s = myArrary[this.series.data.indexOf(this.point)];});return s;},shared: true}," +
                           "series: [{color: '#ff8d11'," +
                           "name: 'Email : " + prvsfrom_to + "'," +
                           "data:  [" + getEmailcount1 + "]" +
                           "},{color: '#0d8ecf'," +
                           "name: 'Email : " + crtfrom_to + "'," +
                           "data: [" + getEmailcount + "]" +
                           "}]});});})(jQuery);";
    } else if (compareOption == 'Sms') {
        graphscript = "(function($){var chart;" + getTooltips +
                           "$(document).ready(function(){chart = new Plumbcharts.Chart({chart: {renderTo: 'iframe_source'," +
                           "type: 'spline'},title: {style: {color: '#5f5f5f',fontWeight: 'bold',fontSize: '14px',fontFamily:'tahoma'},text:'Sms Traffic Comparison'}," +
                           "subtitle: {text: ''},xAxis: {" +
                           "categories: [" + optiondate + "]," +
                           "tickinterval: 2},yAxis: { min: 0, title : ''},tooltip: {formatter: function() {" +
                           "var s='';$.each(this.points, function(i, point) {s = myArrary[this.series.data.indexOf(this.point)];});return s;},shared: true}," +
                           "series: [{color: '#ff8d11'," +
                           "name: 'Sms : " + prvsfrom_to + "'," +
                           "data:  [" + getSmscount1 + "]" +
                           "},{color: '#0d8ecf'," +
                           "name: 'Sms : " + crtfrom_to + "'," +
                           "data: [" + getSmscount + "]" +
                           "}]});});})(jQuery);";
    }
    else if (compareOption == 'Paid') {
        graphscript = "(function($){var chart;" + getTooltips +
                           "$(document).ready(function(){chart = new Plumbcharts.Chart({chart: {renderTo: 'iframe_source'," +
                           "type: 'spline'},title: {style: {color: '#5f5f5f',fontWeight: 'bold',fontSize: '14px',fontFamily:'tahoma'},text:'Paid Traffic Comparison'}," +
                           "subtitle: {text: ''},xAxis: {" +
                           "categories: [" + optiondate + "]," +
                           "tickinterval: 2},yAxis: { min: 0, title : ''},tooltip: {formatter: function() {" +
                           "var s='';$.each(this.points, function(i, point) {s = myArrary[this.series.data.indexOf(this.point)];});return s;},shared: true}," +
                           "series: [{color: '#ff8d11'," +
                           "name: 'Paid : " + prvsfrom_to + "'," +
                           "data:  [" + getPaidcount1 + "]" +
                           "},{color: '#0d8ecf'," +
                           "name: 'Paid : " + crtfrom_to + "'," +
                           "data: [" + getPaidcount + "]" +
                           "}]});});})(jQuery);";
    }
    var script = document.createElement("script");
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
    script.innerHTML = graphscript;
}
