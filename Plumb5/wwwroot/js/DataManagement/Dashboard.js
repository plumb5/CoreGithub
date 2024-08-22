//var DashboardId = urlParam("DbId");

//var dashheader = 0;
//var Idval = "";
//var IdArr = new Array();

//var selectChart;
//var LabelText = "";
//var LabelName = "";
//var series = 0;
//var series1 = "";
//var categories = 0, Title = "", yTitle = "";
//var ddlsizeselected = 0;
//var updatedLabel = new Array;
//var ChartLabelArr = new Array();
//$(document).ready(function () {
//    $("#ddlReport").change(function () {
//      updatedLabel = [];
//    });

//    $("#ulDashh2").click(function () {
       
//        dashheader=2
//    });
//    $("#ulDashh1").click(function () {
       
//        dashheader=1
//    });
//    BindData();
//    BindDataSourceName();
//    BindReports();

//    //loop to bind all DashboardHeader.............
//    for (i = 1; i <= $("#hdTotalHeader").val() ; i++) {
//        getHeaderContent(i);
//    }

//    //loop to bind all DashboardChart
//    for (i = 1; i <= $("#hdTotalChart").val() ; i++) {
//        BindChartContent(i);
//    }

//});

////Bind Dashboard Name and DatasourceId.............
//function BindData() {
//    $.ajax({
//        url: "/DataManagement/Reports/BindDashboardById",
//        async: false,
//        type: 'Post',
//        data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'DashId':" + DashboardId + "}",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (response) {
//            if (response.Table.length > 0) {
//                $.each(response.Table, function () {
//                    $("#divDashTitle").html("Dashboard : " + this.DashboardName)
//                    $("#hdDataSourceId").val(this.DataSourceId);
//                });
//            }
//        },
//        error: function (objxmlRequest) {
//            $("#dvLoading").hide();
//            window.console.log(objxmlRequest.responseText);
//        }
//    });
//}
//function BindDataSourceName() {
//    $.ajax({
//        url: "/DataImport/GetDatatSourceName",
//        async: false,
//        type: 'Post',
//        data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'DataSourceId':" + $("#hdDataSourceId").val() + "}",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (response) {
//            if (response.Table.length > 0) {
//                $.each(response.Table, function () {
//                    $("#hdDataSourceName").val(this.DataSourceName);
//                });
//            }
//        },
//        error: function (objxmlRequest) {
//            $("#dvLoading").hide();
//            window.console.log(objxmlRequest.responseText);
//        }
//    });
//}
////Bind Reports....................
//function BindReports() {
//    $("#ddlReport").empty();
//    $.ajax({
//        url: "/DataManagement/Group/GetReportList",
//        type: 'Post',
//        data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'DataSourceId':" + $("#hdDataSourceId").val() + "}",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (response) {
//            var DefaultOption = document.createElement('option');
//            DefaultOption.value = "0";
//            DefaultOption.text = "Select Report";
//            document.getElementById("ddlReport").options.add(DefaultOption);
//            if (response.Table.length > 0) {
//                $.each(response.Table, function () {
//                    var opt = document.createElement('option');
//                    opt.value = this.Id;
//                    opt.text = this.GroupTitle;
//                    opt.id = this.DatasetQuery;
//                    document.getElementById("ddlReport").options.add(opt);
//                });
//                $("#dvLoading").hide();
//            }
//        },
//        error: function (objxmlRequest) {
//            $("#dvLoading").hide();
//            window.console.log(objxmlRequest.responseText);
//        }
//    });
//}

////To bind header details for all header
//function getHeaderContent(getPositon) {
//    $.ajax({
//        url: "/DataManagement/Reports/GetDashboardHeader",
//        type: 'Post',
//        data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'DashboardId':" + DashboardId + ",'HeaderPosition':'" + getPositon + "'}",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (response) {
//            if (response.Table.length > 0) {
//                $.each(response.Table, function () {
//                    var size = this.FontSize + "px";
                   
//                    $("#chartheader" + getPositon).html(this.HeaderTitle);
//                    $("#chartheader" + getPositon).css({ "font-size":size });
//                });
//            }
//        },
//        error: function (objxmlRequest, textStatus, errorThrown) {
//        }
//    });
//}
////Open DashboardHeader Divs
//function OpenChartSettings(action, getChartbox, chkheader) {
//    //To Bind,Edit and Update DashboardHeader 
  

//    if (chkheader == 'header') {
//        $("#txtHeader").val("");
//        $("#hdChartBox").val(getChartbox);
//        hideit("#dvChartLabelSettings");
//        hideit("#dvChartSettings");
//        hideit("#divmsgs");
//        divs("#dvChartHeaderSettings");

//        $.ajax({
//            url: "/DataManagement/Reports/GetDashboardHeader",
//            type: 'Post',
//            data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'DashboardId':" + DashboardId + ",'HeaderPosition':'" + getChartbox.replace('chartheader', '') + "'}",
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            success: function (response) {
//                if (response.Table.length > 0) {
//                    $.each(response.Table, function () {
//                        for (var i = 0; i < ddlSize.options.length; i++) {
//                            if (ddlSize.options[i].value == this.FontSize) {
//                                ddlSize.options[i].selected = true;
//                            }
//                        }
//                        $("#txtHeader").val(this.HeaderTitle)
//                    });
//                }
//            },
//            error: function (objxmlRequest, textStatus, errorThrown) {
//            }
//        });
//    } //To Bind,Edit and Update DashboardHeaderCharts...... 
//    else {
//        if (action == 1) {
//            $("#hdChartBox").val(getChartbox);
//            hideit("#dvChartLabelSettings");
//            hideit("#dvChartHeaderSettings");
//            hideit("#divmsgs");
//            divs("#dvChartSettings");
//            // $("#dvChartSettings").show("slow");
//            $("#txtChartName").val("");
//            ddlReport.options[0].selected = true;
//            ddlCharts.options[0].selected = true;
//            divs("#dvChartSettings");
//            $.ajax({
//                url: "/DataManagement/Reports/GetGroupFile",
//                type: 'Post',
//                data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'DashboardHeaderId':" + DashboardId + ",'ChartPosition':'" + getChartbox.replace('chartbox', '') + "'}",
//                contentType: "application/json; charset=utf-8",
//                dataType: "json",
//                success: function (response) {
//                    if (response.Table.length > 0) {
//                        // $.each(response.Table, function () {
//                        for (var i = 0; i < ddlReport.options.length; i++) {
//                            if (ddlReport.options[i].value == response.Table[0].GroupHeaderId) {
//                                ddlReport.options[i].selected = true;
//                            }
//                            else {
//                                $("#ddlReport").prop("disabled", true)
//                                // ddlReport.options[i].attr("disable","disable");
//                            }
//                        }
//                        for (var i = 0; i < ddlCharts.options.length; i++) {
//                            if (ddlCharts.options[i].value == response.Table[0].ChartType) {
//                                ddlCharts.options[i].selected = true;
//                            }
//                        }
//                        $("#txtChartName").val(response.Table[0].ChartText);
//                        // });
//                    }
//                    else {
//                        $("#ddlReport").prop("disabled", false)
//                    }
//                },
//                error: function (objxmlRequest) {
//                    $("#dvLoading").hide();
//                    window.console.log(objxmlRequest.responseText);
//                }
//            });
//        }
//    }
//}
//function run() {
//    //if (document.getElementById("srt").value != "") {
   
//    //}
    
//}
////Update DashboardHeader
//function UpdateHeaderContent() {
//    // run();

//    ddlsizeselected = document.getElementById("ddlSize").value;
//    var e = document.getElementById("ddlSize");
//    var selectddlsize = $("#ddlSize option:selected").text();
//    var selectSize = e.options[e.selectedIndex].value;
//    var getheadertext = $("#txtHeader").val().replace(/\+/g, "plus");
//    if ($("#txtHeader").val() == "") {
//        ShowErrorMessage("Please Enter Header Name!!");
//    }
//    else {
//        $.ajax({
//            url: "/DataManagement/Reports/SaveDashboardHeader",
//            type: 'Post',
//            data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'DashboardId':" + DashboardId + ",'HeaderPosition':'" + $("#hdChartBox").val().replace('chartheader', '') + "','HeaderTitle':'" + getheadertext + "','FontSize':'"+ ddlsizeselected + "' }",
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            success: function (response) {
            
//                if (response == 0) {
//                    getHeaderContent($("#hdChartBox").val().replace('chartheader', ''));
//                }
//                if (dashheader == 1) {
//                    $("#chartheader1").css("font-size", ddlsizeselected + "px");

//                }
//                else if (dashheader == 2) {
//                    $("#chartheader2").css("font-size", ddlsizeselected + "px");
//                }
              
                
//            },
//            error: function (objxmlRequest, textStatus, errorThrown) {
//            }
//        });
//    }
//}

////To bind all chart details
//function BindChartContent(getPositon) {
 
//    Title = "";
//    LabelName = "";
//    var Pos = "";
//    if (getPositon == 0) {
//        Pos = $("#hdChartBox").val();
//        Pos = Pos.replace('chartbox', '')
//    } else {
//        Pos = getPositon;
//    }
//    $.ajax({
//        url: "/DataManagement/Reports/GetGroupFile",
//        type: 'Post',
//        async: false,
//        data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'DashboardHeaderId':" + DashboardId + ",'ChartPosition':'" + Pos + "'}",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (response) {
       
//            if (response.Table.length > 0) {
//                LabelName = "";
//                updatedLabel = [];
//                $.each(response.Table, function () {
//                    LabelName += "'" + this.ChartLabel + "',";
//                    updatedLabel.push(this.ChartLabel);
//                });
               
              
//                LabelName = "[" + LabelName + "]";
//                //XaxisLabel += "'" + ds.Tables[0].Rows[k]["ChartLabel"].ToString().Trim() + "',";
                
//                GetGroupFile(response.Table[0].DatasetQuery, Pos, response.Table[0].ChartType, response.Table[0].ChartText);
//            }
//        },
//        error: function (objxmlRequest) {
//            $("#dvLoading").hide();
//            window.console.log(objxmlRequest.responseText);
//        }
//    });
//}
//function UpdateChart() {
  

//    if ($("#txtChartName").val() == "") {
//        ShowErrorMessage("Please enter the Chart Name !!!");
//    }
//    else if ($("#ddlReport").val() == 0 && $("#ddlCharts").val() == 0) {
//        ShowErrorMessage("Please select the Report and Chart !!!");
//    }
//    else {
//        var BoxPos = $("#hdChartBox").val();
//        $.ajax({
//            url: "/DataManagement/Reports/SaveDashboardChartDetails",
//            type: 'Post',
//            async: false,
//            data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'DashboardId':" + DashboardId + ",'GroupHeaderId':" + $("#ddlReport :selected").attr('value') + ",'ChartPosition':'" + BoxPos.replace('chartbox', '') + "','ChartName':'" + $("#ddlReport :selected").text() + "','ChartType':'" + $("#ddlCharts :selected").val() + "','ChartText':'" + $("#txtChartName").val() + "'}",
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            success: function (response) {
            
//                if (response == 0 || response > 0) {
//                    GetGroupFile($("#ddlReport :selected").attr('id'), BoxPos.replace('chartbox', ''), $("#ddlCharts :selected").val(), $("#txtChartName").val());
//                }
//                else if (response == null) {
//                    ShowErrorMessage("Data is not in the required format to view the chart !!!");
//                }
//            },
//            error: function (objxmlRequest) {
//                $("#dvLoading").hide();
//                window.console.log(objxmlRequest.responseText);
//            }
//        });
//    }
//}
////Here Collecting series and data for highcharts
//function GetGroupFile(GroupFile, Pos, ChartType, Ttl) {
    
//    Title = Ttl;
//    if (GroupFile == 0) {
//        GroupFile = $("#ddlReport :selected").attr('id');
//    }
//    else {
//        GroupFile = GroupFile;
//    }
//    $.ajax({
//        url: "/DataManagement/Group/BindChart",
//        type: 'Post',
//        async: false,
//        data: "{'GroupFile':'" + GroupFile + "','DataSourceName':'" + $("#hdDataSourceName").val() + "','ChartType':'" + ChartType + "','LabelName':'" + updatedLabel + "'}",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (response) {
        
//            if (response.length > 0) {
//                if (LabelName != "") {
                   
//                    categories = eval(LabelName);
//                }
//                else {
                   
//                   categories = eval(response[0]);
                   
//                }
              
//                series = eval(response[1]);
                
//                setTimeout('', 5000);
//                //  if (categories.length > 0 && series.length > 0) {
//                bindchart("chartbox" + Pos + "", ChartType);
//                //}
//                //else {
//                //    ShowErrorMessage("Sorry Chart can not be created!!");
//                //}
//            }
//        },
//        error: function (objxmlRequest) {
//            $("#dvLoading").hide();
//            window.console.log(objxmlRequest.responseText);
//        }
//    });
//}
////Bind chart from highcharts
//function bindchart(chatbox, selectChart) {
//    //chartbox1
  

//    if (selectChart == 1 || selectChart == 2)  //BAR CHART..........................
//    {
//        var chart;
//        chart = new Plumbcharts.Chart({
//            chart: {
//                renderTo: chatbox,
//                height: 250,
//                type: 'bar'
//            },

//            title: {
//                color: '#002d78',
//                font: '18px Arial, Helvetica, sans-serif',
//                text: Title
//            },
//            xAxis: {
//                categories: categories,
//                title: {
//                    text: null
//                }
//            },


//            yAxis: {
//                enabled: false,
//                gridLineWidth: 0,
//                lineWidth: 0,
//                min: 0,
//                title: {
//                    // text: null,
//                    //  align: 'high'
//                },
//                labels: {
//                    overflow: 'justify'
//                }
//            },
//            tooltip: {
//                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
//                shared: true
//                ////formatter: function () {
//                ////    return '' +
//                ////        this.series.name + ': ' + this.y + chkPercentage + '';
//                ////}
//            },
//            plotOptions: {
//                column: {
//                    stacking: 'percent'
//                }
//            },

//            legend: {
              
//                enabled: false
               
//            },
//            plotOptions: {
//                bar: {
//                    dataLabels: {
//                        enabled: false,
//                        style:
//                           {
//                               fontWeight: 'bold'
//                           },
//                        formatter: function () {
//                            if (this.y != '') {
//                                return this.y + chkPercentage;
//                            }
//                        }
//                    }
//                },
//                series: {
//                    stacking: selectChart == 2 ? 'normal' : ''
//                }
//            },
//            series: series
//        });
//    }
//    else if (selectChart == 3 || selectChart == 4 || selectChart == 5)  //PIE CHART..........................
//    {
//        alert("Hi");
//        var chart;

//        chart = new Plumbcharts.Chart({
//            chart: {
//                height: 250,
//                type: 'pie',
//                renderTo: chatbox,
//                marginLeft: 90,

//            },
//            title: {
//                color: '#002d78',
//                font: '18px Arial, Helvetica, sans-serif',
//                text: Title,
                
//            },
//            //tooltip: {
//            //    enabled: false,
//            //    percentageDecimals: 1
//            //},
//            tooltip: {
//                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
//                shared: true
//            },
//            plotOptions: {
//                pie: {
//                    innerSize: selectChart != 3 ? "50%" : "",
//                    size: '100%',
//                    stacking: 'normal',
//                    dataLabels:
//                    {
//                        enabled: false,
//                        LabelText:categories,
//                        distance: -25,
//                        color: 'black',
//                        style: {
//                            fontWeight: 'bold'
//                        },
//                        //formatter: function () {
//                        //    return this.y;
                           

//                        //},
                      
//                    },
//                    startAngle: selectChart == 5 ? -90 : 0,
//                    endAngle: selectChart == 5 ? 90 : 360,

//                    showInLegend: true
//                }
//            },
//            legend: {
//                enabled: true,
//                show: true,
//                container: $("#legend"),
//               showInLegend:true,
//                layout: 'vertical',
//                borderWidth: 0,
//                align: 'left',
//                verticalAlign: 'top',
//                y: 50,
//                floating: true,
                
              

                
//                //labelFormatter: function () {



//                    //$.each(categories, function (i, l) {
//                    //    alert(categories[i]);
//                    //    return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + categories[i] + "</div>";
//                    //});
                    
//                    //var linkHTML = '<a href="#" class="legendLabel" seriesIndex="' + seriesIndex + '">' + label + '</a>';
//                    //seriesIndex += 1;
//                    //return linkHTML;
                  
//                    //var linktext = "<text x='21' style='color:#333333;font-size:12px;font-weight:bold;cursor:pointer;fill:#333333;' text-anchor='start' zIndex='2' y='15' seriesIndex='" + seriesIndex + "'><tspan>'" + label + "'</tspan></text>"
//                    //seriesIndex += 1;
//                    //return linkHTML;


//                  //return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + LabelName + "</div>";
                  
                
                        
//             //  },
               
               
//            },
           
//           series: series
//           //series: [{ data: [['Firefox1', 45.0], ['IE1', 26.8], ['Safari5', 8.5], ['Opera6', 6.2], ['Others', 0.7]] }],
//        });
//    }
//    else if (selectChart == 6) //LINE CHART..........................
//    {
//        var chart = new Plumbcharts.Chart({
//            chart: {
//                height: 250,
//                renderTo: chatbox,
//                type: 'line'
//            },
//            title: {
//                color: '#002d78',
//                font: '18px Arial, Helvetica, sans-serif',
//                text: Title
//            },

//            xAxis: {
//                categories: categories
//            },
//            yAxis: {
//                title: {
//                    text: yTitle
//                },
//                plotLines: [{
//                    value: 0,
//                    width: 1,
//                    color: '#808080'
//                }]
//            },
//            tooltip: {
//                enabled: true,
//                valueSuffix: '°C'
//            },
//            legend: {
//                enabled: false,
//            },
//            plotOptions: {
//                line: {
//                    dataLabels: {
//                        enabled: false
//                    },
//                    enableMouseTracking: true
//                }
//            },
//            series: series
//        });
//    }
//    else if (selectChart == 7 || selectChart == 8) {
//        var chart;
//        chart = new Plumbcharts.Chart({
//            chart: {
//                renderTo: chatbox,
//                height: 250,
//                type: 'column'
//            },

//            title: {
//                color: '#002d78',
//                font: '18px Arial, Helvetica, sans-serif',
//                text: Title
//            },
//            xAxis: {
//                categories: categories,
//                title: {
//                    text: null
//                }
//            },


//            yAxis: {
//                enabled: false,
//                gridLineWidth: 0,
//                lineWidth: 0,
//                min: 0,
//                title: {
//                    // text: null,
//                    //  align: 'high'
//                },
//                labels: {
//                    overflow: 'justify'
//                }
//            },
//            tooltip: {
//                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
//                shared: true
//                ////formatter: function () {
//                ////    return '' +
//                ////        this.series.name + ': ' + this.y + chkPercentage + '';
//                ////}
//            },

//            legend: {
//                enabled: false
//            },
//            plotOptions: {
//                bar: {
//                    dataLabels: {
//                        enabled: false,
//                        style:
//                           {
//                               fontWeight: 'bold'
//                           },
//                        //formatter: function () {
//                        //    if (this.y != '') {
//                        //        return this.y + chkPercentage;
//                        //    }
//                        //}
//                    }
//                },
//                series: {
//                    stacking: selectChart == 8 ? 'normal' : ''
//                }
//            },
//            series: series
//        });
//    }
//    else if (selectChart == 9) //FUNNEL CHART..........................
//    {
//        $(function () {
//            var chart = new Plumbcharts.Chart({
//                chart: {
//                    height: 250,
//                    renderTo: chatbox,
//                    type: 'funnel',
//                    marginRight: 100
//                },
//                title: {
//                    text: Title,
//                    x: -50
//                },
//                plotOptions: {
//                    series: {
//                        dataLabels: {
//                            enabled: true,
//                            format: '<b>{point.name}</b> ({point.y:,.0f})',
//                            color: (Plumbcharts.theme && Plumbcharts.theme.contrastTextColor) || 'black',
//                            softConnector: true
//                        },
//                        neckWidth: '30%',
//                        neckHeight: '25%'

//                        //-- Other available options
//                        // height: pixels or percent
//                        // width: pixels or percent
//                    }
//                },
//                legend: {
//                    enabled: false
//                },
//                series: [{
//                    name: 'Unique users',
//                    data: [
//                        ['Website visits', 15654],
//                        ['Downloads', 4064],
//                        ['Requested price list', 1987],
//                        ['Invoice sent', 976],
//                        ['Finalized', 846]
//                    ]
//                }]
//            });
//        });
//    }
//}
//function ClearChart() {
//    var BoxPos = $("#hdChartBox").val();
   
//    $.ajax({
//        url: "/DataManagement/Group/ClearChart",
//        type: 'Post',
//        async: false,
//        data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'DashboardHeaderId':" + DashboardId + ",'ChartPosition':'" + BoxPos.replace('chartbox', '') + "'}",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (response) {
//            updatedLabel=[];
//            $("#txtChartName").val("");
//            location.reload();
//            ddlReport.options[0].selected = true;
//            ddlCharts.options[0].selected = true;
//            ShowErrorMessage("Reset!!");
//        },
//        error: function (objxmlRequest) {
//            $("#dvLoading").hide();
//            window.console.log(objxmlRequest.responseText);
//        }
//    });
//}

//function OpenChartLabel(LblPos) {
    
    
//    $("div#dvDashboardLabel").niceScroll({ cursorcolor: "#CCCCCC", cursorwidth: "8px" }).hide();
//    var BoxPos = $("#hdChartBox").val();
//    var chkbox = "";
//    var html = "";
//    $.ajax({
//        url: "/DataManagement/Group/GetChartLabels",
//        type: 'Post',
//        async: false,
//        data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'GroupFile':'" + $("#ddlReport :selected").attr('id') + "','DashboardHeaderId':" + DashboardId + ",'GroupHeaderId':" + $("#ddlReport :selected").attr('value') + ",'ChartPosition':'" + LblPos + "'}",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (response) {
//            if (response.length > 0) {
//                LabelText = eval(response[0]);
//                LabelName = eval(response[1]);
//                Idval = eval(response[2]);
//                if (LabelName.length == 0) {
//                    html = "<span class='error'>Please add chart and manage label.<br/><br/></span>";
//                    $("#dvDashboardLabel").html(html);
//                    hideit("#dvChartHeaderSettings");
//                    hideit("#dvChartSettings");
//                    hideit("#divmsgs");
//                    divs("#dvChartLabelSettings");
//                }
//                else {
//                    LabelTextHtml(LabelText, LabelName, Idval);
//                }
//            }
//            if (LabelName.length > 3) {
//                $("div#dvDashboardLabel").niceScroll({ cursorcolor: "#CCCCCC", cursorwidth: "8px" }).show();
//                $("div#dvDashboardLabel").niceScroll({ cursorcolor: "#CCCCCC", cursorwidth: "8px" }).resize();
//            }
//        },
//        error: function (objxmlRequest) {
//            $("#dvLoading").hide();
//            window.console.log(objxmlRequest.responseText);
//        }
//    });
//}

//function LabelTextHtml(LabelText, LabelName, Idval) {
//    var html = "";
//    for (var i = 0; i < LabelName.length; i++) {
//        if (i == LabelName.length - 1) {
//            html += "<span id='Chartlbl" + i + "'>" + LabelText[i] + "</span><input id='Charttxtlbl" + i + "' style='width: 90%;margin-bottom:0px;' class='TextBox' type='text' value='" + LabelName[i] + "'/>";
//        }
//        else {
//            html += "<span id='Chartlbl" + i + "'>" + LabelText[i] + "</span><input id='Charttxtlbl" + i + "' style='width: 90%;' class='TextBox' type='text' value='" + LabelName[i] + "'/>";
//        }
//        IdArr.push(Idval[i]);
//    }
//    html += "<input type='checkbox' id='ChangeAll' name='Change All' value='0' >Change for all<br/>";
//    $("#dvDashboardLabel").html(html);
//    hideit("#dvChartHeaderSettings");
//    hideit("#dvChartSettings");
//    hideit("#divmsgs");
//    divs("#dvChartLabelSettings");
//}
//function UpdateLabel() {
//    ChartLabelArr.length = [];
//    if (LabelName.length == 0) {
//        html = "<span class='error'>Please add chart and manage label.<br/><br/></span>";
//    }
//    for (var i = 0; i < LabelName.length; i++) {
//        var Check = false;
//        if ($("#ChangeAll").is(":checked")) {
//            Check = true;
//        }
//        else {
//            Check = false;
//        }
//        ChartLabelArr.push(LabelObj($("#Charttxtlbl" + i + "").val(), LabelText[i], Check, IdArr[i]));
//    }

//    var BoxPos = $("#hdChartBox").val();
//    $.ajax({
//        url: "/DataManagement/Reports/SaveDashboardChartLabel",
//        type: 'Post',
//        async: false,
//        data: JSON.stringify({ 'AccountId': $("#hdn_AdsId").val(), 'DashboardId': DashboardId, 'GroupHeaderId': $("#ddlReport :selected").attr('value'), 'ChartPosition': BoxPos.replace('chartbox', ''), 'ChartName': $("#ddlReport :selected").text(), 'ChartType': $("#ddlCharts :selected").val(), 'ChartText': $("#txtChartName").val(), 'ObjLabel': ChartLabelArr }),
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (response) {
//            if (response == 0 || response > 0) {
//                location.reload();
//                GetGroupFile($("#ddlReport :selected").attr('id'), BoxPos.replace('chartbox', ''), $("#ddlCharts :selected").val(), $("#txtChartName").val());
//            }
//        },
//        error: function (objxmlRequest) {
//            $("#dvLoading").hide();
//            window.console.log(objxmlRequest.responseText);
//        }
//    });

//}
////Push All Label details
//function LabelObj(ChartLabel, ChartLabelText, ChangeAll, IDval) {
//    var obj = new Object();
//    obj.ChartLabel = ChartLabel
//    obj.ChartLabelText = ChartLabelText
//    obj.ChangeAll = ChangeAll,
//    obj.Idval = IDval
//    return obj;
//}


////To hide and show Divs
//function hideit(Id) {
//    $(Id).hide("slow");
//}
//function divs(Id) {
//    $(Id).show(1000);
//}




var DashboardId = urlParam("DbId");

var dashheader = 0;
var Idval = "";
var IdArr = new Array();

var selectChart;
var LabelText = "";
var LabelName = "";
var series = 0;
var series1 = "";
var categories = 0, Title = "", yTitle = "";
var ddlsizeselected = 0;
var updatedLabel = new Array;
var ChartLabelArr = new Array();
$(document).ready(function () {
    $("#ddlReport").change(function () {
        updatedLabel = [];
    });

    $("#ulDashh2").click(function () {

        dashheader = 2
    });
    $("#ulDashh1").click(function () {

        dashheader = 1
    });
    BindData();
    BindDataSourceName();
    BindReports();

    //loop to bind all DashboardHeader.............
    for (i = 1; i <= $("#hdTotalHeader").val() ; i++) {
        getHeaderContent(i);
    }

    //loop to bind all DashboardChart
    for (i = 1; i <= $("#hdTotalChart").val() ; i++) {
        BindChartContent(i);
    }

});

//Bind Dashboard Name and DatasourceId.............
function BindData() {
    $.ajax({
        url: "/DataManagement/Reports/BindDashboardById",
        async: false,
        type: 'Post',
        data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'DashId':" + DashboardId + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table.length > 0) {
                $.each(response.Table, function () {
                    $("#divDashTitle").html("Dashboard : " + this.DashboardName)
                    $("#hdDataSourceId").val(this.DataSourceId);
                });
            }
        },
        error: function (objxmlRequest) {
            $("#dvLoading").hide();
            window.console.log(objxmlRequest.responseText);
        }
    });
}
function BindDataSourceName() {
    $.ajax({
        url: "/DataImport/GetDatatSourceName",
        async: false,
        type: 'Post',
        data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'DataSourceId':" + $("#hdDataSourceId").val() + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table.length > 0) {
                $.each(response.Table, function () {
                    $("#hdDataSourceName").val(this.DataSourceName);
                });
            }
        },
        error: function (objxmlRequest) {
            $("#dvLoading").hide();
            window.console.log(objxmlRequest.responseText);
        }
    });
}
//Bind Reports....................
function BindReports() {
    var intersectid = new Array();
    $("#ddlReport").empty();
    $.ajax({
        url: "/DataManagement/Group/GetReportList",
        type: 'Post',
        data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'DataSourceId':" + $("#hdDataSourceId").val() + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var DefaultOption = document.createElement('option');
            DefaultOption.value = "0";
            DefaultOption.text = "Select Report";
            document.getElementById("ddlReport").options.add(DefaultOption);
            //$.each(response.Table2, function () {
            //    if (response.Table2.length > 0) {
            //        intersectid.push(this.id);
            //    }

            //});
          
            if (response.Table.length > 0) {
                $.each(response.Table, function () {
                  
                   
                    //var Indexintersect = intersectid.indexOf(this.Id);
                  
                    //if (Indexintersect == -1) {                      
                        var opt = document.createElement('option');
                        opt.value = this.Id;
                        opt.text = this.GroupTitle;
                        opt.id = this.DatasetQuery;
                        document.getElementById("ddlReport").options.add(opt);
                    //}
                });
                $("#dvLoading").hide();
            }
        },
        error: function (objxmlRequest) {
            $("#dvLoading").hide();
            window.console.log(objxmlRequest.responseText);
        }
    });
}

//To bind header details for all header
function getHeaderContent(getPositon) {
    $.ajax({
        url: "/DataManagement/Reports/GetDashboardHeader",
        type: 'Post',
        data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'DashboardId':" + DashboardId + ",'HeaderPosition':'" + getPositon + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table.length > 0) {
                $.each(response.Table, function () {
                    var size = this.FontSize + "px";

                    $("#chartheader" + getPositon).html(this.HeaderTitle);
                    $("#chartheader" + getPositon).css({ "font-size": size });
                });
            }
        },
        error: function (objxmlRequest, textStatus, errorThrown) {
        }
    });
}
//Open DashboardHeader Divs
function OpenChartSettings(action, getChartbox, chkheader) {
    //To Bind,Edit and Update DashboardHeader 


    if (chkheader == 'header') {
        $("#txtHeader").val("");
        $("#hdChartBox").val(getChartbox);
        hideit("#dvChartLabelSettings");
        hideit("#dvChartSettings");
        hideit("#divmsgs");
        divs("#dvChartHeaderSettings");

        $.ajax({
            url: "/DataManagement/Reports/GetDashboardHeader",
            type: 'Post',
            data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'DashboardId':" + DashboardId + ",'HeaderPosition':'" + getChartbox.replace('chartheader', '') + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Table.length > 0) {
                    $.each(response.Table, function () {
                        for (var i = 0; i < ddlSize.options.length; i++) {
                            if (ddlSize.options[i].value == this.FontSize) {
                                ddlSize.options[i].selected = true;
                            }
                        }
                        $("#txtHeader").val(this.HeaderTitle)
                    });
                }
            },
            error: function (objxmlRequest, textStatus, errorThrown) {
            }
        });
    } //To Bind,Edit and Update DashboardHeaderCharts...... 
    else {
        if (action == 1) {
            $("#hdChartBox").val(getChartbox);
            hideit("#dvChartLabelSettings");
            hideit("#dvChartHeaderSettings");
            hideit("#divmsgs");
            divs("#dvChartSettings");
            // $("#dvChartSettings").show("slow");
            $("#txtChartName").val("");
            ddlReport.options[0].selected = true;
            ddlCharts.options[0].selected = true;
            divs("#dvChartSettings");
            $.ajax({
                url: "/DataManagement/Reports/GetGroupFile",
                type: 'Post',
                data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'DashboardHeaderId':" + DashboardId + ",'ChartPosition':'" + getChartbox.replace('chartbox', '') + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response.Table.length > 0) {
                        // $.each(response.Table, function () {
                        for (var i = 0; i < ddlReport.options.length; i++) {
                            if (ddlReport.options[i].value == response.Table[0].GroupHeaderId) {
                                ddlReport.options[i].selected = true;
                            }
                            else {
                                $("#ddlReport").prop("disabled", true)
                                // ddlReport.options[i].attr("disable","disable");
                            }
                        }
                        for (var i = 0; i < ddlCharts.options.length; i++) {
                            if (ddlCharts.options[i].value == response.Table[0].ChartType) {
                                ddlCharts.options[i].selected = true;
                            }
                        }
                        $("#txtChartName").val(response.Table[0].ChartText);
                        // });
                    }
                    else {
                        $("#ddlReport").prop("disabled", false)
                    }
                },
                error: function (objxmlRequest) {
                    $("#dvLoading").hide();
                    window.console.log(objxmlRequest.responseText);
                }
            });
        }
    }
}
function run() {
    //if (document.getElementById("srt").value != "") {

    //}

}
//Update DashboardHeader
function UpdateHeaderContent() {
    // run();

    ddlsizeselected = document.getElementById("ddlSize").value;
    var e = document.getElementById("ddlSize");
    var selectddlsize = $("#ddlSize option:selected").text();
    var selectSize = e.options[e.selectedIndex].value;
    var getheadertext = $("#txtHeader").val().replace(/\+/g, "plus");
    if ($("#txtHeader").val() == "") {
        ShowErrorMessage("Please Enter Header Name.");
    }
    else {
        $.ajax({
            url: "/DataManagement/Reports/SaveDashboardHeader",
            type: 'Post',
            data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'DashboardId':" + DashboardId + ",'HeaderPosition':'" + $("#hdChartBox").val().replace('chartheader', '') + "','HeaderTitle':'" + getheadertext + "','FontSize':'" + ddlsizeselected + "' }",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

                if (response == 0) {
                    getHeaderContent($("#hdChartBox").val().replace('chartheader', ''));
                }
                if (dashheader == 1) {
                    $("#chartheader1").css("font-size", ddlsizeselected + "px");

                }
                else if (dashheader == 2) {
                    $("#chartheader2").css("font-size", ddlsizeselected + "px");
                }


            },
            error: function (objxmlRequest, textStatus, errorThrown) {
            }
        });
    }
}

//To bind all chart details
function BindChartContent(getPositon) {

    Title = "";
    LabelName = "";
    var Pos = "";
    if (getPositon == 0) {
        Pos = $("#hdChartBox").val();
        Pos = Pos.replace('chartbox', '')
    } else {
        Pos = getPositon;
    }
    $.ajax({
        url: "/DataManagement/Reports/GetGroupFile",
        type: 'Post',
        async: false,
        data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'DashboardHeaderId':" + DashboardId + ",'ChartPosition':'" + Pos + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {

            if (response.Table.length > 0) {
                LabelName = "";
                updatedLabel = [];
                $.each(response.Table, function () {
                    LabelName += "'" + this.ChartLabel + "',";
                    updatedLabel.push(this.ChartLabel);
                });


                LabelName = "[" + LabelName + "]";
                //XaxisLabel += "'" + ds.Tables[0].Rows[k]["ChartLabel"].ToString().Trim() + "',";

                GetGroupFile(response.Table[0].DatasetQuery, Pos, response.Table[0].ChartType, response.Table[0].ChartText);
            }
        },
        error: function (objxmlRequest) {
            $("#dvLoading").hide();
            window.console.log(objxmlRequest.responseText);
        }
    });
}
function UpdateChart() {

  
  

    if ($("#txtChartName").val() == "") {
        ShowErrorMessage("Please enter the Chart Name.");
    }
    else if ($("#ddlReport").val() == 0 && $("#ddlCharts").val() == 0) {
        ShowErrorMessage("Please select the Report and Chart.");
    }
    else if($("#ddlCharts").val() == 0)
    {
        ShowErrorMessage("Please select the Chart.");
    }
    else {
        var BoxPos = $("#hdChartBox").val();
        $.ajax({
            url: "/DataManagement/Reports/SaveDashboardChartDetails",
            type: 'Post',
            async: false,
            data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'DashboardId':" + DashboardId + ",'GroupHeaderId':" + $("#ddlReport :selected").attr('value') + ",'ChartPosition':'" + BoxPos.replace('chartbox', '') + "','ChartName':'" + $("#ddlReport :selected").text() + "','ChartType':'" + $("#ddlCharts :selected").val() + "','ChartText':'" + $("#txtChartName").val() + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

                if (response == 0 || response > 0) {

                    GetGroupFile($("#ddlReport :selected").attr('id'), BoxPos.replace('chartbox', ''), $("#ddlCharts :selected").val(), $("#txtChartName").val());

                }
                else if (response == null) {
                    ShowErrorMessage("Data is not in the required format to view the chart.");
                }
                // location.reload();
            },
            error: function (objxmlRequest) {
                $("#dvLoading").hide();
                window.console.log(objxmlRequest.responseText);
            }
        });
    }
}
//Here Collecting series and data for highcharts
function GetGroupFile(GroupFile, Pos, ChartType, Ttl) {
    
    var Groupheaderidmaindashboard = 0;
    var valuesrt = "";
    Title = Ttl;
    if (GroupFile == 0) {
        GroupFile = $("#ddlReport :selected").attr('id');
    }
    else {
        GroupFile = GroupFile;
    }
    $.ajax({
        url: "/DataManagement/Group/BindChart",
        type: 'Post',
        async: false,
        data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'GroupFile':'" + GroupFile + "','DataSourceName':'" + $("#hdDataSourceName").val() + "','ChartType':'" + ChartType + "','LabelName':'" + updatedLabel + "','GroupheaderdashboardId':'" + Groupheaderidmaindashboard + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            
          
            var splittedarray="";
            var splittedarraypie="";
          
                splittedarray = response[1].split("},");
               
             
                 splittedarraypie = response[1].split("],");
               
            //alert(response[0])
            //alert(response[1])
            //alert(splittedarray.length)
            if (response.length > 0) {
                if (LabelName != "") {

                    categories = eval(LabelName);
                }
                else {

                    categories = eval(response[0]);

                }
                //if (categories.length == 0 || categories.length <= 1 )
                //{
                //    ShowErrorMessage("Data is not in the required format to view the chart !!!");
                //}
                if (ChartType == "1" || ChartType == "2" || ChartType == "6" || ChartType == "7" || ChartType == "8") {
                    if (categories.length == 0 || categories.length <= 1) {
                        ShowErrorMessage("Data is not in the required format to view the chart.");
                    }
                }
                else {
                    if (splittedarraypie.length <= 1 && categories.length <= 1) {

                        ShowErrorMessage("Data is not in the required format to view the chart.");
                    }
                }


                if (splittedarray.length >= 1 && ChartType == "1" || ChartType == "2" || ChartType == "6" || ChartType == "7" || ChartType == "8") {
                    series = eval(response[1]);


                    setTimeout('', 5000);
                    //  if (categories.length > 0 && series.length > 0) {
                    bindchart("chartbox" + Pos + "", ChartType);
                }
                else if (splittedarraypie.length >= 1) {
                    series = eval(response[1]);


                    setTimeout('', 5000);
                    //  if (categories.length > 0 && series.length > 0) {
                    bindchart("chartbox" + Pos + "", ChartType);
                }
                //}
                //else {
                //    ShowErrorMessage("Sorry Chart can not be created!!");
                //}
            }
        },
        error: function (objxmlRequest) {
            $("#dvLoading").hide();
            window.console.log(objxmlRequest.responseText);
        }
    });
}
//Bind chart from highcharts
function bindchart(chatbox, selectChart) {
    //chartbox1

   
    if (selectChart == 1 || selectChart == 2)  //BAR CHART..........................

    {
       
        var chart;
        chart = new Plumbcharts.Chart({
            chart: {
                renderTo: chatbox,
                height: 250,
                type: 'bar'
            },

            title: {
                color: '#002d78',
                font: '18px Arial, Helvetica, sans-serif',
                text: Title
            },
            xAxis: {
                categories: categories,
                title: {
                    text: null
                }
            },


            yAxis: {
                enabled: false,
                gridLineWidth: 0,
                lineWidth: 0,
                min: 0,
                title: {
                    // text: null,
                    //  align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                shared: true
                ////formatter: function () {
                ////    return '' +
                ////        this.series.name + ': ' + this.y + chkPercentage + '';
                ////}
            },
            plotOptions: {
                column: {
                    stacking: 'percent'
                }
            },

            legend: {

                enabled: false

            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: false,
                        style:
                           {
                               fontWeight: 'bold'
                           },
                        formatter: function () {
                            if (this.y != '') {
                                return this.y + chkPercentage;
                            }
                        }
                    }
                },
                series: {
                    stacking: selectChart == 2 ? 'normal' : ''
                }
            },
            series: series
        });
    }
  
    else if (selectChart == 3 || selectChart == 4 || selectChart == 5)  //PIE CHART..........................
    {
       
      
        var chart;

        chart = new Plumbcharts.Chart({
            chart: {
                height: 250,
                type: 'pie',
                renderTo: chatbox,
                marginLeft: 90,

            },
            title: {
                color: '#002d78',
                font: '18px Arial, Helvetica, sans-serif',
                text: Title,

            },
            //tooltip: {
            //    enabled: false,
            //    percentageDecimals: 1
            //},
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                shared: true
            },
            plotOptions: {
                pie: {
                    innerSize: selectChart != 3 ? "50%" : "",
                    size: '100%',
                    stacking: 'normal',
                    dataLabels:
                    {
                        enabled: false,
                        LabelText: categories,
                        distance: -25,
                        color: 'black',
                        style: {
                            fontWeight: 'bold'
                        },
                        //formatter: function () {
                        //    return this.y;


                        //},

                    },
                    startAngle: selectChart == 5 ? -90 : 0,
                    endAngle: selectChart == 5 ? 90 : 360,

                    showInLegend: true
                }
            },
            legend: {
                enabled: true,
                show: true,
                container: $("#legend"),
                showInLegend: true,
                layout: 'vertical',
                borderWidth: 0,
                align: 'left',
                verticalAlign: 'top',
                y: 50,
                floating: true,




                //labelFormatter: function () {



                //$.each(categories, function (i, l) {
                //    alert(categories[i]);
                //    return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + categories[i] + "</div>";
                //});

                //var linkHTML = '<a href="#" class="legendLabel" seriesIndex="' + seriesIndex + '">' + label + '</a>';
                //seriesIndex += 1;
                //return linkHTML;

                //var linktext = "<text x='21' style='color:#333333;font-size:12px;font-weight:bold;cursor:pointer;fill:#333333;' text-anchor='start' zIndex='2' y='15' seriesIndex='" + seriesIndex + "'><tspan>'" + label + "'</tspan></text>"
                //seriesIndex += 1;
                //return linkHTML;


                //return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + LabelName + "</div>";



                //  },


            },

            series: series
            //series: [{ data: [['Firefox1', 45.0], ['IE1', 26.8], ['Safari5', 8.5], ['Opera6', 6.2], ['Others', 0.7]] }],
        });
    }
    else if (selectChart == 6) //LINE CHART..........................
    {
       
        var chart = new Plumbcharts.Chart({
            chart: {
                height: 250,
                renderTo: chatbox,
                type: 'line'
            },
            title: {
                color: '#002d78',
                font: '18px Arial, Helvetica, sans-serif',
                text: Title
            },

            xAxis: {
                categories: categories
            },
            yAxis: {
                title: {
                    text: yTitle
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                enabled: true,
                valueSuffix: '°C'
            },
            legend: {
                enabled: false,
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: false
                    },
                    enableMouseTracking: true
                }
            },
            series: series
        });
    }
    else if (selectChart == 7 || selectChart == 8) {
        var chart;
        chart = new Plumbcharts.Chart({
            chart: {
                renderTo: chatbox,
                height: 250,
                type: 'column'
            },

            title: {
                color: '#002d78',
                font: '18px Arial, Helvetica, sans-serif',
                text: Title
            },
            xAxis: {
                categories: categories,
                title: {
                    text: null
                }
            },


            yAxis: {
                enabled: false,
                gridLineWidth: 0,
                lineWidth: 0,
                min: 0,
                title: {
                    // text: null,
                    //  align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                shared: true
                ////formatter: function () {
                ////    return '' +
                ////        this.series.name + ': ' + this.y + chkPercentage + '';
                ////}
            },

            legend: {
                enabled: false
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: false,
                        style:
                           {
                               fontWeight: 'bold'
                           },
                        //formatter: function () {
                        //    if (this.y != '') {
                        //        return this.y + chkPercentage;
                        //    }
                        //}
                    }
                },
                series: {
                    stacking: selectChart == 8 ? 'normal' : ''
                }
            },
            series: series
        });
    }
    else if (selectChart == 9) //FUNNEL CHART..........................
    {
        $(function () {
            var chart = new Plumbcharts.Chart({
                chart: {
                    height: 250,
                    renderTo: chatbox,
                    type: 'funnel',
                    marginRight: 100
                },
                title: {
                    text: Title,
                    x: -50
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b> ({point.y:,.0f})',
                            color: (Plumbcharts.theme && Plumbcharts.theme.contrastTextColor) || 'black',
                            softConnector: true
                        },
                        neckWidth: '30%',
                        neckHeight: '25%'

                        //-- Other available options
                        // height: pixels or percent
                        // width: pixels or percent
                    }
                },
                legend: {
                    enabled: false
                },
                series: [{
                    name: 'Unique users',
                    data: [
                        ['Website visits', 15654],
                        ['Downloads', 4064],
                        ['Requested price list', 1987],
                        ['Invoice sent', 976],
                        ['Finalized', 846]
                    ]
                }]
            });
        });
    }
}
function ClearChart() {
    var BoxPos = $("#hdChartBox").val();

    $.ajax({
        url: "/DataManagement/Group/ClearChart",
        type: 'Post',
        async: false,
        data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'DashboardHeaderId':" + DashboardId + ",'ChartPosition':'" + BoxPos.replace('chartbox', '') + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            updatedLabel = [];
            $("#txtChartName").val("");
            location.reload();
            ddlReport.options[0].selected = true;
            ddlCharts.options[0].selected = true;
            ShowErrorMessage("Reset.");
        },
        error: function (objxmlRequest) {
            $("#dvLoading").hide();
            window.console.log(objxmlRequest.responseText);
        }
    });
}

function OpenChartLabel(LblPos) {


    $("div#dvDashboardLabel").niceScroll({ cursorcolor: "#CCCCCC", cursorwidth: "8px" }).hide();
    var BoxPos = $("#hdChartBox").val();
    var chkbox = "";
    var html = "";
    $.ajax({
        url: "/DataManagement/Group/GetChartLabels",
        type: 'Post',
        async: false,
        data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'GroupFile':'" + $("#ddlReport :selected").attr('id') + "','DashboardHeaderId':" + DashboardId + ",'GroupHeaderId':" + $("#ddlReport :selected").attr('value') + ",'ChartPosition':'" + LblPos + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.length > 0) {
                LabelText = eval(response[0]);
                LabelName = eval(response[1]);
                Idval = eval(response[2]);
                if (LabelName.length == 0) {
                    html = "<span class='error'>Please add chart and manage label.<br/><br/></span>";
                    $("#dvDashboardLabel").html(html);
                    hideit("#dvChartHeaderSettings");
                    hideit("#dvChartSettings");
                    hideit("#divmsgs");
                    divs("#dvChartLabelSettings");
                }
                else {
                    LabelTextHtml(LabelText, LabelName, Idval);
                }
            }
            if (LabelName.length > 3) {
                $("div#dvDashboardLabel").niceScroll({ cursorcolor: "#CCCCCC", cursorwidth: "8px" }).show();
                $("div#dvDashboardLabel").niceScroll({ cursorcolor: "#CCCCCC", cursorwidth: "8px" }).resize();
            }
        },
        error: function (objxmlRequest) {
            $("#dvLoading").hide();
            window.console.log(objxmlRequest.responseText);
        }
    });
}

function LabelTextHtml(LabelText, LabelName, Idval) {
    var html = "";
    for (var i = 0; i < LabelName.length; i++) {
        if (i == LabelName.length - 1) {
            html += "<span id='Chartlbl" + i + "'>" + LabelText[i] + "</span><input id='Charttxtlbl" + i + "' style='width: 90%;margin-bottom:0px;' class='TextBox' type='text' value='" + LabelName[i] + "'/>";
        }
        else {
            html += "<span id='Chartlbl" + i + "'>" + LabelText[i] + "</span><input id='Charttxtlbl" + i + "' style='width: 90%;' class='TextBox' type='text' value='" + LabelName[i] + "'/>";
        }
        IdArr.push(Idval[i]);
    }
    html += "<input type='checkbox' id='ChangeAll' name='Change All' value='0' >Change for all<br/>";
    $("#dvDashboardLabel").html(html);
    hideit("#dvChartHeaderSettings");
    hideit("#dvChartSettings");
    hideit("#divmsgs");
    divs("#dvChartLabelSettings");
}
function UpdateLabel() {
    ChartLabelArr.length = [];
    if (LabelName.length == 0) {
        html = "<span class='error'>Please add chart and manage label.<br/><br/></span>";
    }
    for (var i = 0; i < LabelName.length; i++) {
        var Check = false;
        if ($("#ChangeAll").is(":checked")) {
            Check = true;
        }
        else {
            Check = false;
        }
        ChartLabelArr.push(LabelObj($("#Charttxtlbl" + i + "").val(), LabelText[i], Check, IdArr[i]));
    }

    var BoxPos = $("#hdChartBox").val();
    $.ajax({
        url: "/DataManagement/Reports/SaveDashboardChartLabel",
        type: 'Post',
        async: false,
        data: JSON.stringify({ 'AccountId': $("#hdn_AdsId").val(), 'DashboardId': DashboardId, 'GroupHeaderId': $("#ddlReport :selected").attr('value'), 'ChartPosition': BoxPos.replace('chartbox', ''), 'ChartName': $("#ddlReport :selected").text(), 'ChartType': $("#ddlCharts :selected").val(), 'ChartText': $("#txtChartName").val(), 'ObjLabel': ChartLabelArr }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response == 0 || response > 0) {
                location.reload();
                GetGroupFile($("#ddlReport :selected").attr('id'), BoxPos.replace('chartbox', ''), $("#ddlCharts :selected").val(), $("#txtChartName").val());
            }
        },
        error: function (objxmlRequest) {
            $("#dvLoading").hide();
            window.console.log(objxmlRequest.responseText);
        }
    });

}
//Push All Label details
function LabelObj(ChartLabel, ChartLabelText, ChangeAll, IDval) {
    var obj = new Object();
    obj.ChartLabel = ChartLabel
    obj.ChartLabelText = ChartLabelText
    obj.ChangeAll = ChangeAll,
    obj.Idval = IDval
    return obj;
}


//To hide and show Divs
function hideit(Id) {
    $(Id).hide("slow");
}
function divs(Id) {
    $(Id).show(1000);
}






