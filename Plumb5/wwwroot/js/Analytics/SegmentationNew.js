dvCustomFilter.innerHTML = getCustomFilter();
dvDatetoYear.innerHTML = getDefaultDuration();
var loadingImg = '', loadingImg1 = '', defaultmessage = '';
var LI = 0, MI = 0, HI = 0,piegraph='';
$("#dvPrintExport").append(getPrintExport('Segmentation', 0, 0, 0));
if (p5keyValue != 0) {
    $("#hdn_duration").val(duration);
    Report(parseInt(duration));
}
else {
    Report(2);
}

function Report(duration) {
    if ($("#drp_SearchBy").val() == "0")
        ReportVisits(duration);
    else
        ReportLeadGroup(duration);
}
$("#drp_SearchBy").change(function () {
    if ($("#drp_SearchBy").val() == "0")
        ReportVisits($("#hdn_duration").val());
    else 
        ReportLeadGroup($("#hdn_duration").val());
});
//Bind Anonymous,Leads * Customer
function ReportVisits(duration) {
    $("#hdn_duration").val(duration);
    $('#divcontentLeadsGroup').hide();
    $('#dvVisitor').show();
    $('#dvDefault').hide();
    $("#dvCustomFilter").css("display", "none");
    loadingImg = '<img title="Loading..Please Wait.." style="position: relative; left: 1%; top: 43%; width: 20px;" src="/images/al_loading.gif">';
    loadingImg1 = '<img title="Loading..Please Wait.." style="float:left;position: relative; left: 45%; top: 43%; width: 20px;" src="/images/al_loading.gif">';
    defaultmessage = '<span style="float:left;position: relative; left: 35%; top: 50%;color: #878787;font-size: 14px">There is no data.</span>'
    window.dvAnonymous.innerHTML = loadingImg1;
    window.dvProspects.innerHTML = loadingImg1;
    window.dvCustomers.innerHTML = loadingImg1;
    window.anonymoushighintent.innerHTML = loadingImg;
    window.anonymousmediumintent.innerHTML = loadingImg;
    window.anonymouslowintent.innerHTML = loadingImg;
    window.Prospecthighintent.innerHTML = loadingImg;
    window.Prospectmediumintent.innerHTML = loadingImg;
    window.Prospectlowintent.innerHTML = loadingImg;
    window.Customerhighintent.innerHTML = loadingImg;
    window.Customermediumintent.innerHTML = loadingImg;
    window.Customerlowintent.innerHTML = loadingImg;
    $('#dvAnonymous').empty();
    $('#dvProspects').empty();
    $('#dvCustomers').empty();
    $("#dvLoading").css("display", "block");
    $("#dvPrintExport").css("display", "block");
    $("#dv_PntExp").hide();
    var getFilter = CheckFilter(duration);
    var fromdate = getFilter[0], todate = getFilter[1], maintain = getFilter[4];
    if (maintain == 1) { duration = 5; } ///Maintain
    $("#lnkViewall").attr("href", "AllBrowsers?dur=" + (duration == 5 ? 0 : duration) + "&Frm=" + fromdate + "&To=" + todate + "");
    $(".button").attr("class", "button1");
    $("#btn" + duration).attr("class", "button");
    $.ajax({
        url: "SelectSegmentsstage",
        type: 'Post',
        data: "{'accountId':'" + $("#hdn_AccountId").val() + "','Actions':'Visitor','fromdate':'" + fromdate + "','todate':'" + todate + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table.length > 0 || response.Table1.length > 0 || response.Table2.length > 0) {
                if (response.Table.length > 0) {
                    var AnonyappendVal = '';
                    //Anonymous
                    $.each(response.Table, function () {
                        AssignStatus(this);
                    })
                    AnonyappendVal += "['High Intent'," + HI + "],['Medium Intent'," + MI + "],['Low Intent'," + LI + "]";
                     piegraph = "$(function () {" +
                                    "Plumbcharts.setOptions({colors: ['#4f81bd','#c0504d','#9bbb59']});" +
                                    "$('#dvAnonymous').Plumbcharts({" +
                                    "chart: {plotBackgroundColor: null,plotBorderWidth: null,plotShadow: false},title: {style: {color: '#5f5f5f',fontWeight: 'bold',fontFamily:'tahoma'},text: ''},tooltip: {" +
                                    "formatter: function() { return '<b>'+ this.point.name +' :  </b>' + ' <b>'+ Plumbcharts.numberFormat(this.percentage)+' %</b>' }},plotOptions: {pie: {allowPointSelect: true,cursor: 'pointer', showInLegend: true," +
                                    "dataLabels: {distance:-40,enabled:true,color: 'white'," +
                                    "formatter: function () { if(Plumbcharts.numberFormat(this.percentage) > 2) return '<b>'+Plumbcharts.numberFormat(this.percentage)+'%</b>'; }}}}, legend: {itemStyle: {fontWeight:'normal'} },series: [{type:'pie',name:'Percentage',data: [" +
                                    AnonyappendVal + "]}]});});";
                    var Anonyscript = document.createElement("script");
                    Anonyscript.type = "text/javascript";
                    document.getElementsByTagName("head")[0].appendChild(Anonyscript);
                    Anonyscript.innerHTML = piegraph;
                    //var chart = new CanvasJS.Chart("dvAnonymous",label
                    //    {
                    //        title: {
                    //            text: "",
                    //            fontFamily: "arial black"
                    //        },
                    //        animationEnabled: true,
                    //        legend: {
                    //            verticalAlign: "bottom",
                    //            horizontalAlign: "center"
                    //        },
                    //        theme: "theme2",
                    //        data: [
                    //            {
                    //                type: "pie",
                    //                indexLabelFontFamily: "tahoma",
                    //                indexLabelFontSize: 12,
                    //                indexLabelFontWeight: "bold",
                    //                startAngle: 0,
                    //                indexLabelFontColor: "MistyRose",
                    //                indexLabelLineColor: "darkgrey",
                    //                indexLabelPlacement: "inside",
                    //                toolTipContent: "{name} : #percent%",
                    //                showInLegend: false,
                    //                indexLabel: "#percent%",
                    //                dataPoints: [
                    //                    { y: HI, name: "High Intent", legendMarkerType: "square" },
                    //                    { y: MI, name: "Medium Intent", legendMarkerType: "square" },
                    //                    { y: LI, name: "Low Intent", legendMarkerType: "square" }
                    //                ]
                    //            }
                    //        ]
                    //    });
                    //chart.render();
                    $('#anonymoushighintent').text(HI);
                    $('#anonymousmediumintent').text(MI);
                    $('#anonymouslowintent').text(LI);
                    $('#dvAnonylegend').show();
                }
                else {
                    $('#dvAnonylegend').hide();
                    window.anonymoushighintent.innerHTML = 0;
                    window.anonymousmediumintent.innerHTML = 0;
                    window.anonymouslowintent.innerHTML = 0;
                    window.dvAnonymous.innerHTML = defaultmessage;

                }
                //Prospect
                LI = 0; HI = 0; MI = 0;
                var ProspappendVal = '';
                if (response.Table1.length > 0) {
                    $.each(response.Table1, function () {
                        AssignStatus(this);
                    })
                    ProspappendVal += "['High Intent'," + HI + "],['Medium Intent'," + MI + "],['Low Intent'," + LI + "]";
                     piegraph = "$(function () {" +
                                   "Plumbcharts.setOptions({colors: ['#4f81bd','#c0504d','#9bbb59']});" +
                                    "$('#dvProspects').Plumbcharts({" +
                                    "chart: {plotBackgroundColor: null,plotBorderWidth: null,plotShadow: false},title: {style: {color: '#5f5f5f',fontWeight: 'bold',fontFamily:'tahoma'},text: ''},tooltip: {" +
                                    "formatter: function() { return '<b>'+ this.point.name +' :  </b>' + ' <b>'+ Plumbcharts.numberFormat(this.percentage)+' %</b>' }},plotOptions: {pie: {allowPointSelect: true,cursor: 'pointer',showInLegend: true," +
                                    "dataLabels: {enabled: true,distance: -30,color: 'white'," +
                                    "formatter: function () { if(Plumbcharts.numberFormat(this.percentage) > 2) return '<b>'+Plumbcharts.numberFormat(this.percentage)+'%</b>'; }}}},legend:{itemStyle: {fontWeight:'normal'}},series: [{type: 'pie',name: 'Percentage',data: [" +
                                    ProspappendVal + "]}]});});";
                    var Prospectscript = document.createElement("script");
                    Prospectscript.type = "text/javascript";
                    document.getElementsByTagName("head")[0].appendChild(Prospectscript);
                    Prospectscript.innerHTML = piegraph;

                //    var chart = new CanvasJS.Chart("dvProspects",
                //        {
                //            title: {
                //                text: "",
                //                fontFamily: "arial black"
                //            },
                //            animationEnabled: true,
                //            legend: {
                //                verticalAlign: "bottom",
                //                horizontalAlign: "center"
                //            },
                //            theme: "theme2",
                //            data: [
                //                {
                //                    type: "pie",
                //                    indexLabelFontFamily: "tahoma",
                //                    indexLabelFontSize: 12,
                //                    indexLabelFontWeight: "bold",
                //                    startAngle: 0,
                //                    indexLabelFontColor: "MistyRose",
                //                    indexLabelLineColor: "darkgrey",
                //                    indexLabelPlacement: "inside",
                //                    toolTipContent: "{name} : #percent%",
                //                    showInLegend: false,
                //                    indexLabel: "#percent%",
                //                    dataPoints: [
                //                        { y: HI, name: "High Intent", legendMarkerType: "square" },
                //                        { y: MI, name: "Medium Intent", legendMarkerType: "square" },
                //                        { y: LI, name: "Low Intent", legendMarkerType: "square" }
                //                    ]
                //                }
                //            ]
                //        });
                //    chart.render();
                    $('#Prospecthighintent').text(HI);
                    $('#Prospectmediumintent').text(MI);
                    $('#Prospectlowintent').text(LI);
                    $('#dvProspectlegend').show();
                }
                else {
                    $('#dvProspectlegend').hide();
                    window.Prospecthighintent.innerHTML = 0;
                    window.Prospectmediumintent.innerHTML = 0;
                    window.Prospectlowintent.innerHTML = 0;
                    window.dvProspects.innerHTML = defaultmessage;
                }
                //Customer
                LI = 0; HI = 0; MI = 0;
                 var CustappendVal = '';
                if (response.Table2.length > 0) {
                    $.each(response.Table2, function() {
                            AssignStatus(this);

                    });
                    CustappendVal += "['High Intent'," + HI + "],['Medium Intent'," + MI + "],['Low Intent'," + LI + "]";
                     piegraph = "$(function () {" +
                                    "Plumbcharts.setOptions({colors: ['#4f81bd','#c0504d','#9bbb59']});" +
                                    "$('#dvCustomers').Plumbcharts({" +
                                    "chart: {plotBackgroundColor: null,plotBorderWidth: null,plotShadow: false},title: {style: {color: '#5f5f5f',fontWeight: 'bold',fontFamily:'tahoma'},text: ''},tooltip: {" +
                                    "formatter: function() { return '<b>'+ this.point.name +' :  </b>' + ' <b>'+ Plumbcharts.numberFormat(this.percentage)+' %</b>' }},plotOptions: {pie: {allowPointSelect: true,cursor: 'pointer',showInLegend: true," +
                                    "dataLabels: {enabled: true, distance: -30,color: 'white'," +
                                    "formatter: function () { if(Plumbcharts.numberFormat(this.percentage) > 2) return '<b>'+Plumbcharts.numberFormat(this.percentage)+'%</b>'; }}}},legend:{itemStyle: {fontWeight:'normal'}},series: [{type: 'pie',name: 'Percentage',data: [" +
                                    CustappendVal + "]}]});});";
                    
                    var Custscript = document.createElement("script");
                    Custscript.type = "text/javascript";
                    document.getElementsByTagName("head")[0].appendChild(Custscript);
                    Custscript.innerHTML = piegraph;
                //    var chart = new CanvasJS.Chart("dvCustomers",
                //        {
                //            title: {
                //                text: "",
                //                fontFamily: "arial black"
                //            },
                //            animationEnabled: true,
                //            legend: {
                //                verticalAlign: "bottom",
                //                horizontalAlign: "center"
                //            },
                //            theme: "theme2",
                //            data: [
                //                {
                //                    type: "pie",
                //                    indexLabelFontFamily: "tahoma",
                //                    indexLabelFontSize: 12,
                //                    indexLabelFontWeight: "bold",
                //                    startAngle: 0,
                //                    indexLabelFontColor: "MistyRose",
                //                    indexLabelLineColor: "darkgrey",
                //                    indexLabelPlacement: "inside",
                //                    toolTipContent: "{name} : #percent%",
                //                    showInLegend: false,
                //                    indexLabel: "#percent%",
                //                    dataPoints: [
                //                        { y: HI, name: "High Intent", legendMarkerType: "square" },
                //                        { y: MI, name: "Medium Intent", legendMarkerType: "square" },
                //                        { y: LI, name: "Low Intent", legendMarkerType: "square" }
                //                    ]
                //                }
                //            ]
                //        });
                //    chart.render();
                    $('#Customerhighintent').text(HI);
                    $('#Customermediumintent').text(MI);
                    $('#Customerlowintent').text(LI);
                    $('#dvCustommerlegend').show();
                }
                else {
                    window.Customerhighintent.innerHTML = 0;
                    window.Customermediumintent.innerHTML = 0;
                    window.Customerlowintent.innerHTML = 0;
                    window.dvCustomers.innerHTML = defaultmessage;
                    $('#dvCustommerlegend').hide();
                }
            }
            else {
                $('#dvDefault').show();
                $('#divcontent').hide();
                $('#dvPrintExport').hide();
            }
            $('#dvLoading').hide();
            $('#divcontent').css('height','368px');
        },
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }
    });
   
}

//Bind Lms Stages & Groups 
function ReportLeadGroup(duration) {
    $("#hdn_duration").val(duration);
    $('#divcontentLeadsGroup').show();
    $('#dvVisitor').hide();
    $('#divcontentLeadsGroup').empty();
    $('#dvDefault').hide();
    $("#dvCustomFilter").css("display", "none");
    loadingImg = '<img title="Loading..Please Wait.." style="position: relative; left: 1%; top: 43%; width: 20px;" src="/images/al_loading.gif">';
    loadingImg1 = '<img title="Loading..Please Wait.." style="float:left;position: relative; left: 45%; top: 43%; width: 20px;" src="/images/al_loading.gif">';
    defaultmessage = '<span style="float:left;position: relative; left: 30%; top: 50%;color: #878787;font-size: 14px">There is no data.</span>'
    $("#dvLoading").css("display", "block");
    $("#dvPrintExport").css("display", "block");
    $("#dv_PntExp").hide();
    var getFilter = CheckFilter(duration);
    var fromdate = getFilter[0], todate = getFilter[1], maintain = getFilter[4];
    if (maintain == 1) { duration = 5; } ///Maintain
    $("#lnkViewall").attr("href", "AllBrowsers?dur=" + (duration == 5 ? 0 : duration) + "&Frm=" + fromdate + "&To=" + todate + "");
    $(".button").attr("class", "button1");
    $("#btn" + duration).attr("class", "button");
    var Actions = '';
    if ($("#drp_SearchBy").val() == "1")
        Actions = 'Leads'
    else
        Actions = 'Groups'
    $.ajax({
        url: "SelectSegmentsstage",
        type: 'Post',
        data: "{'accountId':'" + $("#hdn_AccountId").val() + "','Actions':'" + Actions + "','fromdate':'" + fromdate + "','todate':'" + todate + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var arrayStage = [];
          
            if (response.Table.length > 0) {
                
                var height = response.Table.length / 3;
                height = Math.ceil(height);
                for (var i = 1; i <= response.Table.length; i++) {
                    arrayStage.push(response);
                    arrayStage = $.map(response, function (value, index) {
                        return [value];
                    });
                    LI = 0; HI = 0; MI = 0;
                    var LeadGroupappendVal;
                    $.each(arrayStage[i], function () {
                        LeadGroupappendVal = '';
                        AssignStatus(this);
                        
                    });
                    
                    $("#divcontentLeadsGroup").append(
                        '<div class="anoyItemwrap" id=dvL' + i + '>' +
                        '<div class="title" style="white-space: nowrap;padding: 8px 0px 8px 0px;color:rgb(95, 95, 95);font-size:18px;">' +
                        (Actions == 'Leads' ? (response.Table[i - 1].Stage.length > 35 ? "<span title='" + (response.Table[i - 1].Stage + "'>" + (response.Table[i - 1].Stage.toString().substring(0, 35) + "..</span>")) : response.Table[i - 1].Stage) : (response.Table[i - 1].GroupName.length > 35 ? "<span title='" + (response.Table[i - 1].GroupName + "'>" + (response.Table[i - 1].GroupName.toString().substring(0, 35) + "..</span>")) : response.Table[i - 1].GroupName))  +
                        '</div>' +
                        '<div class="chartmainWrap">' +
                        '<div id="dvLeads' + i + '" style="height:300px;overflow:hidden;">' +
                        '</div>' +
                        //'<div class="higwrap">' +
                        //'<div class="higcol"></div>' +
                        //'<div class="higTxt">High</div>' +
                        //'<div class="medcol"></div>' +
                        //'<div class="higTxt">Med</div>' +
                        //'<div class="lowCol"></div>' +
                        //'<div class="higTxt">Low</div>' +
                        //'</div>' +
                        '<div class="highmedcolwrap">' +
                        '<div class="higtbl">' +
                        '<span class="higtbltext">High</span>' +

                        '</div>' +
                        '<div class="higtbl">' +
                        '<span class="higtbltext">Medium</span>' +

                        '</div>' +
                        '<div class="higtbl">' +
                        '<span class="higtbltext">Low</span>' +

                        '</div>' +
                        '</div>' +
                        '<div class="higScorewrap">' +
                        '<div class="higtblscore">' +
                        '<span class="higtblscoretxt" id="Leadshighintent' + i + '">' +
                        '</span>' +
                        '</div>' +
                        '<div class="higtblscore">' +
                        '<span class="higtblscoretxt" id="Leadsmediumintent' + i + '">' +
                        '</span>' +
                        '</div>' +
                        '<div class="higtblscore">' +
                        '<span class="higtblscoretxt" id="Leadslowintent' + i + '">' +
                        '</span>' +
                        '</div>' +
                        '</div>' +
                        '</div>');
                    $('#dvL' + response.Table.length + '').css('padding-bottom', '15px');
                    LeadGroupappendVal += "['High Intent'," + HI + "],['Medium Intent'," + MI + "],['Low Intent'," + LI + "]";
                     piegraph = "$(function () {" +
                                    "Plumbcharts.setOptions({colors: ['#4f81bd','#c0504d','#9bbb59']});" +
                                    "$('#dvLeads"+i+"').Plumbcharts({" +
                                    "chart: {plotBackgroundColor: null,plotBorderWidth: null,plotShadow: false},title: {style: {color: '#5f5f5f',fontWeight: 'bold',fontFamily:'tahoma'},text: ''},tooltip: {" +
                                    "formatter: function() { return '<b>'+ this.point.name +' :  </b>' + ' <b>'+ Plumbcharts.numberFormat(this.percentage)+' %</b>' }},plotOptions: {pie: {allowPointSelect: true,cursor: 'pointer',showInLegend: true," +
                                    "dataLabels: {enabled: true, distance: -30,color: 'white'," +
                                    "formatter: function () { if(Plumbcharts.numberFormat(this.percentage) > 2) return '<b>'+Plumbcharts.numberFormat(this.percentage)+'%</b>'; }}}},legend:{itemStyle: {fontWeight:'normal'}},series: [{type: 'pie',name: 'Percentage',data: [" +
                                    LeadGroupappendVal + "]}]});});";

                    var LeadGroupscript = document.createElement("script");
                    LeadGroupscript.type = "text/javascript";
                    document.getElementsByTagName("head")[0].appendChild(LeadGroupscript);
                    LeadGroupscript.innerHTML = piegraph;

                    //var chart = new CanvasJS.Chart(idname,
                    //    {
                    //        title: {
                    //            text: "",
                    //            fontFamily: "arial black"
                    //        },
                    //        animationEnabled: true,
                    //        legend: {
                    //            verticalAlign: "bottom",
                    //            horizontalAlign: "center"
                    //        },
                    //        theme: "theme2",
                    //        data: [
                    //            {
                    //                type: "pie",
                    //                indexLabelFontFamily: "tahoma",
                    //                indexLabelFontSize: 12,
                    //                indexLabelFontWeight: "bold",
                    //                startAngle: 0,
                    //                indexLabelFontColor: "MistyRose",
                    //                indexLabelLineColor: "darkgrey",
                    //                indexLabelPlacement: "inside",
                    //                toolTipContent: "{name} : #percent%",
                    //                showInLegend: false,
                    //                indexLabel: "#percent%",
                    //                dataPoints: [
                    //                    { y: HI, name: "High Intent", legendMarkerType: "square" },
                    //                    { y: MI, name: "Medium Intent", legendMarkerType: "square" },
                    //                    { y: LI, name: "Low Intent", legendMarkerType: "square" }
                    //                ]
                    //            },
                    //        ]
                    //    });
                    //chart.render();
                    $('#Leadshighintent' + i + '').text(HI);
                    $('#Leadsmediumintent' + i + '').text(MI);
                    $('#Leadslowintent' + i + '').text(LI);
                }

                $('#divcontent').css('height', (368 * height) + 'px');
               
            }
            else {
                $('#dvDefault').show();
                $('#divcontentLeadsGroup').hide();
                $('#dvPrintExport').hide();

            }
            $("#dvLoading").css("display", "none");
        }
    });
}

//High,Low & Medium Intent Calculation
function AssignStatus(response) {
    var tps = "", state = "";
    tps = response.TotalPages / response.TotalSessions;
    tps = Math.round(tps);
    switch (true) {
        case (tps < 2):
            state = "L";
            break;
        case (tps === 2):
        case (tps === 3):
            state = "M";
            break;
        case (tps > 3):
            state = "H";
            break;
    }
    if ((state === "M" || state === "H") && response.UniquePages < 2)
        state = "L";
    else if (state === "H" && (response.UniquePages === 2 || response.UniquePages === 3))
        state = "M";

    if (state === "M" && response.RecencyCount > 8)
        state = "L";
    else if (state === "H" && (response.RecencyCount > 8 && response.RecencyCount < 14))
        state = "M";
    else if (state === "H" && response.RecencyCount > 14)
        state = "L";

    switch (state) {
        case "L":
            LI++;
            break;
        case "M":
            MI++;
            break;
        case "H":
            HI++;
            break;
    }
}