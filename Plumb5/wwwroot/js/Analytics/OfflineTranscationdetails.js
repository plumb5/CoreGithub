InitialLoadOffline();
function InitialLoadOffline() {
    if (window.location.href.toLowerCase().indexOf("productdetails") > -1)
        ReportProductDetails(parseInt($("#hdn_duration").val()));
    else
        Reportoffline(parseInt($("#hdduration").val()));
}
function Reportoffline(duration) {
    duration = isNaN(duration) ? 2 : duration;
    $("#hdduration").val(duration);
    $("#dvCustomFilter").css("display", "none");
    $("#dvLoading").css("display", "block");
    var getFilter = CheckFilter(duration);
    var optiondate = '', ProductId = '', categories = '',series = '', fromdate = getFilter[0], todate = getFilter[1],maintain = getFilter[4];
    if (maintain == 1) { duration = 5; } ///Maintain
    $(".button").attr("class", "button1");
    $("#btn" + duration).attr("class", "button");
    var value = $("#hdndrpVlue").val();
    if (value != 0 && $("#txt_SearchBy").val() != 'Search Product Name') {
        ProductId = value;
    }
    else { ProductId = 0; }
    ProductId = (ProductId == "null" || ProductId == null) ? 0 : ProductId;
    var productid = $("#hdndrpdwnName").val() == "" ? $("#txt_SearchBy").val() : $("#hdndrpdwnName").val();
    $.ajax({
        url: "/Custom/TransactionProductReport",
        type: 'Post',
        data: "{'accountId':'" + $("#hdn_AccountId").val() + "','duration':'" + duration + "','fromdate':'" + fromdate + "','todate':'" + todate + "','productId':'" + ProductId + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table.length > 0) {
                $("#txt_SearchBy").css("display", "block");
                $("#dvDefault").css("display", "none");
                $("#divcontent").css("display", "block");
                $("#dvPrintExport").css("display", "block");
                $('#div_Searchboxes').css("display", "block");
                var InnerDivhtml = "";
                if (window.location.href.toLowerCase().indexOf("productperformance") > -1)
                    tabletd = "<tr style='font-weight: bold;'><td>Day</td><td>Product Views</td><td>Unique Views</td><td>Total Cart</td><td>Unique Cart</td><td>Drop Out</td><td>Order Complete</td><td>Unique Complete</td><td>Seccess Qty</td></tr>";
                else
                    tabletd = "<tr style='font-weight: bold;'><td>Day</td><td>Product Views</td><td>Shopping Cart Sold</td><td>Unique Cart</td><td>Net Sold</td><td>Drop Out</td><td>Unique Complete</td></tr>";
                $.each(response.Table, function () {
                    var arSuccess = this.Success == null ? 0 : this.Success.toString().split('~');
                    if (window.location.href.toLowerCase().indexOf("productperformance") > -1) {
                        tabletd += "<tr><td>" + this.DateShort + "</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>" + (arSuccess[0] == undefined ? "0" : arSuccess[0]) + "</td><td>" + arSuccess[1] + "</td><td>" + (arSuccess[2] == undefined ? "0" : arSuccess[2]) + "</td></tr>";
                        InnerDivhtml += "<div style='text-align: left;' class='itemStyle'>" +
                            "<div style='float: left; width: 13%;'>" +
                            this.DateShort + "</div>" +
                            "<div style='float: left; width: 12%;' class='short1'>" +
                              "0</div>" +
                            "<div style='float: left; width: 11%;' class='short2'>" +
                             "0</div>" +
                            "<div style='float: left; width: 10%;' class='short3'>" +
                             "0</div>" +
                            "<div style='float: left; width: 10%;' class='short4'>" +
                             "0</div>" +
                            "<div style='float: left; width: 10%;' class='short5'>" +
                             "0</div>" +
                            "<div style='float: left; width: 14%;' class='short6'>" +
                            (arSuccess[0] == undefined ? "0" : arSuccess[0]) + "</div>" +
                            "<div style='float: left; width: 14%;' class='short7'>" +
                            (arSuccess[1] == undefined ? "0" : "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + this.DateFrom + "&To=" + this.DateTo + "&Product=Purchase" + (ProductId != 0 ? "&ProductId=" + ProductId : "") + "&Offline=Offline'>" + arSuccess[1] + "[View]</a>") + "</div>" +
                            "<div style='float: left; text-align: right; width: 6%;' class='dummy'>" +
                            (arSuccess[2] == undefined ? "0" : arSuccess[2]) + "</div>" +
                            "</div>";

                    }
                    else {
                        tabletd += "<tr><td>" + this.DateShort + "</td><td>0</td><td>0</td><td>0</td><td>" + (arSuccess[3] == undefined ? "0" : arSuccess[3]) + "</td><td>0</td><td>" + arSuccess[1] + "</td></tr>";
                        InnerDivhtml += "<div style='text-align: left;' class='itemStyle'>" +
                                                "<div style='float: left; width: 15%;'>" +
                                                this.DateShort + "</div>" +
                                                "<div style='float: left; width: 15%;' class='short1'>" +
                                                "0</div>" +
                                                "<div style='float: left; width: 20%;' class='short2'>" +
                                                "0</div>" +
                                                "<div style='float: left; width: 13%;' class='short3'>" +
                                                "0</div>" +
                                                "<div style='float: left; width: 12%;' class='short4'>" +
                                                (arSuccess[3] == undefined ? "0" : arSuccess[3]) + "</div>" +
                                                "<div style='float: left; width: 9%;' class='short5'>" +
                                                 "0</div>" +
                                                "<div style='float: left; width: 16%; text-align: right; margin-left: -24px;' class='short6'>" +
                                                (arSuccess[1] == undefined ? "0" : "<a href='/Analytics/Uniques/UniqueVisits?dur=0&Frm=" + this.DateFrom + "&To=" + this.DateTo + "&Sales=Purchase" + (ProductId != 0 ? "&ProductId=" + ProductId : "") + "&Offline=Offline'>" + arSuccess[1] + "[View]</a>") + "</div>" +
                                                "</div>";
                    }
                    optiondate += ",'" + this.DateShort + "'";
                    categories += "," + 0;
                    series += "," + (arSuccess[0] == undefined ? "0" : arSuccess[0]);
                });
                optiondate = optiondate.slice(1);
                categories = categories.slice(1);
                //series = series.replace(/undefined/g, "0");
                series = series.slice(1);
                dvExport.innerHTML = "<table id='ExportTable'>" + tabletd + "</table>";
                if (window.location.href.toLowerCase().indexOf("productperformance") > -1) {
                    dvReport.innerHTML = "<div style='text-align: left;' class='headerstyle'>" +
                        "<div style='float: left; width: 13%;'>" +
                        "Day</div>" +
                        "<div style='float: left; width: 12%;' class='headerSort' id='short1'>" +
                        "Product Views</div>" +
                        "<div style='float: left; width: 11%;' class='headerSort' id='short2'>" +
                        "Unique Views</div>" +
                        "<div style='float: left; width: 10%;' class='headerSort' id='short3'>" +
                        "Total Cart</div>" +
                        "<div style='float: left; width: 10%;' class='headerSort' id='short4'>" +
                        "Unique Cart</div>" +
                        "<div style='float: left; width: 10%;' class='headerSort' id='short5'>" +
                        "Drop Out</div>" +
                        "<div style='float: left; width: 14%;' class='headerSort' id='short6'>" +
                        "Order Complete</div>" +
                        "<div style='float: left; width: 14%;' class='headerSort' id='short7'>" +
                        "Unique Complete</div>" +
                        "<div style='float: left; text-align: right; width: 6%;'>" +
                        "Success Qty</div>" +
                        "</div>" + InnerDivhtml;
                    lblViews.innerHTML = P5_SummationOfDivData("short1");
                    lblUniques.innerHTML = P5_SummationOfDivData("short2");
                    lblShoppingCart.innerHTML = P5_SummationOfDivData("short3");
                    lblOrderComplete.innerHTML = P5_SummationOfDivData("short6");
                    lblQty.innerHTML = P5_SummationOfDivData("dummy");
                }
                else {
                    dvReport.innerHTML = "<div style='text-align: left;' class='headerstyle'>" +
                                                    "<div style='float: left; width: 15%;'>" +
                                                    "Day</div>" +
                                                    "<div style='float: left; width: 15%;' class='headerSort' id='short1'>" +
                                                    "Product Views</div>" +
                                                    "<div style='float: left; width: 20%;' class='headerSort' id='short2'>" +
                                                    "Shopping Cart Sold</div>" +
                                                    "<div style='float: left; width: 13%;' class='headerSort' id='short3'>" +
                                                    "Unique Cart</div>" +
                                                    "<div style='float: left; width: 12%;' class='headerSort' id='short4'>" +
                                                    "Net Sold</div>" +
                                                    "<div style='float: left; width: 9%;' class='headerSort' id='short5'>" +
                                                    "Drop Out</div>" +
                                                    "<div style='float: left; width: 16%;text-align: right;' class='headerSort' id='short6'>" +
                                                    "Unique Complete</div>" +
                                                    "</div>" + InnerDivhtml;
                    lblViews.innerHTML = P5_SummationOfDivData("short1");
                    lblShoppingCartSold.innerHTML = P5_SummationOfDivData("short2");
                    var TotalNetSold = parseFloat(P5_SummationOfDivData("short4")).toFixed(2);
                    lblNetSold.innerHTML = TotalNetSold;
                    lblDropOut.innerHTML = P5_SummationOfDivData("short5");
                }
                $("#dvExpend").css({ 'height': (620 > $("#dvReport").height() + 510) ? '620px' : $("#dvReport").height() + 510 + 'px' });

                ///Sorting report
                CallSort();
                ///Report graph
                var graphscript = '';
                graphscript = " (function($){var chart;" +
                    "$(document).ready(function(){" +
                    "chart = new Plumbcharts.Chart({" +
                    "chart: {renderTo: 'iframe',type: 'spline'},title: {" +
                    "style: {color: '#5f5f5f',fontWeight: 'bold',fontSize: '14px',fontFamily:'tahoma'}," +
                    "text:'Product View  Vs Order Complete'},subtitle: {text: ''}," +
                    "xAxis: {categories: [" + optiondate + "]," +
                    "tickInterval: 2" +
                    " }," +
                    "yAxis: { min: 0, title : ''}," +
                    "tooltip: {" +
                    "formatter: function() {" +
                    " return '<b>'+ this.x + '<br />'+ this.series.name +'</b>: '+ this.y;}}," +
                    "series: [{color: '#0D8ECF',name: 'Product View', data: [" + categories + "]}," +
                    "{color: '#04D215',name: 'Order Complete'," +
                    " data:  [" + series + "]" +
                    " }]});});})(jQuery);";
                var script = document.createElement("script");
                script.type = "text/javascript";
                document.getElementsByTagName("head")[0].appendChild(script);
                script.innerHTML = graphscript;
                ///End Report Graph
                $("#iframe").css("margin", "0px");
                $("#dvLoading").css("display", "none");
            }
            else {
                $("#dvDefault").css("display", "block"); $("#dvPrintExport").css("display", "none"); $("#dvLoading").css("display", "none"); $("#divcontent").css("display", "none");
                //$('#div_Searchboxes').css("display", "none");
                if (ProductId == 0)
                    $("#txt_SearchBy").css("display", "none");
            }
        },
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }
    });
}

function ReportProductDetails(duration) {
    duration = isNaN(duration) ? 2 : duration;
    $("#hdn_duration").val(duration);
    $("#dvCustomFilter").css("display", "none");
    $("#dvPrintExport").css("display", "block");
    $("#dvLoading").css("display", "block");
    var getFilter = CheckFilter(duration);
    var fromdate = getFilter[0], todate = getFilter[1], maintain = getFilter[4];
    if (maintain == 1) { duration = 5; } ///Maintain
    $(".button").attr("class", "button1");
    $("#btn" + duration).attr("class", "button");
    if ($("#hdn_ViewMore").val() == "0") {
        $("#hdn_Start").val(1);
        if ($("#drp_RecordsPerPage").val() == 'All' && keyval == 0) {//Day/Week/Month/Year Click with All Records
            keyval++;
            $("#hdn_End").val(1);
        }
        else {
            if (keyval > 0)
                keyval = 0;
            else
                $("#hdn_End").val($("#drp_RecordsPerPage").val());
        }
    }
    $.ajax({
        url: "/Custom/TransactionProductDetails",
        type: 'Post',
        data: "{'accountId':'" + $("#hdn_AccountId").val() + "','duration':'" + duration + "','fromdate':'" + fromdate + "','todate':'" + todate + "','endcount':'" + parseInt($("#hdn_End").val()) + "','startcount':'" + parseInt($("#hdn_Start").val()) + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            //alert(response.Table);
            if ($('#drp_RecordsPerPage').val() == 'All' && keyval > 0) {
                $.each(response.Table1, function () {
                    $("#hdn_End").val(this.TotalRows);
                    if (keyval > 0)
                        Report(duration);
                });
            }
            else {
                if (response.Table.length > 0) {
                    $("#dvDefault").css("display", "none");
                    $("#divcontent").css("display", "block");
                    $("#dvPrintExport").css("display", "block");
                    $("#dv_PntExp").css("position", "absolute");
                    $("#dv_PntExp").css("margin-left", "200px");
                    $(".chk").css("display", "block");
                    $("#dv_PntExp").css("display", "block");
                    var innerDivhtml = "";
                    var tabletd = "<tr style='font-weight: bold;'><td>Product</td><td>Product Views</td><td>Unique Views</td><td>Total Cart</td><td>Unique Cart</td><td>Total Complete</td><td>Unique Complete</td><td>Success Qty</td><td>Recency</td></tr>";
                    //Reports
                    $.each(response.Table, function () {
                        var arSuccess = this.Success == null ? 0 : this.Success.toString().split('~');
                        tabletd += "<tr><td>" + this.ProductName + "</td><td>0</td><td>0</td><td>0</td><td>0</td><td>" + (arSuccess[0] == undefined ? "0" : arSuccess[0]) + "</td><td>" + (arSuccess[1] == undefined ? "0" : arSuccess[1]) + "</td><td>" + (arSuccess[2] == undefined ? "0" : arSuccess[2]) + "</td><td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObjNew(this.Recency)) + " " + PlumbTimeFormat(GetJavaScriptDateObjNew(this.Recency)) + "</td></tr>";
                        innerDivhtml += "<div style='text-align: left;' class='itemStyle'>" +
                                               "<div style='float: left; width: 16%;' title='" + this.ProductId + "'>" +
                                               (this.ProductName.length > 50 ? "<span title='" + this.ProductName + "'>" + this.ProductName.toString().substring(0, 50) + "..</span>" : (this.ProductName.length != 0 ? this.ProductName : "Unknown")) + "</div>" +
                                               "<div style='float: left; width: 11%;' class='short1'>" +
                                               "0</div>" +
                                               "<div style='float: left; width: 10%;' class='short2'>" +
                                               "0</div>" +
                                               "<div style='float: left; width: 8%;' class='short3'>" +
                                               "0</div>" +
                                               "<div style='float: left; width: 10%;' class='short4'>" +
                                               "0</div>" +
                                               "<div style='float: left; width: 11%;' class='short5'>" +
                                               (arSuccess[0] == undefined ? "0" : arSuccess[0]) + "</div>" +
                                               "<div style='float: left; width: 13%;' class='short6'>" +
                                               (arSuccess[1] == undefined ? "0" : "<a href='/Analytics/Uniques/UniqueVisits?ProductDetails=true&dur=0&Frm=" + fromdate + "&To=" + todate + "&Product=Purchase" + (this.ProductId != 0 ? "&ProductId=" + this.ProductId : "") + "&Offline=Offline'>" + arSuccess[1] + "[View]</a>") + "</div>" +
                                               "<div style='float: left; width: 4%;' class='dummy'>" +
                                               (arSuccess[2] == undefined ? "0" : arSuccess[2]) + "</div>" +
                                               "<div style='float: left; width: 17%; text-align: right;'>" +
                                               $.datepicker.formatDate("M dd yy", GetJavaScriptDateObjNew(this.Recency)) + " " + PlumbTimeFormat(GetJavaScriptDateObjNew(this.Recency)) + "</div>" +
                                               "</div>";
                    });
                    //View More Counts Display
                    $.each(response.Table1, function () {
                        if (parseInt($("#hdn_End").val()) < parseInt(this.TotalRows) && parseInt(this.TotalRows) > parseInt($("#drp_RecordsPerPage").val()))
                            $("#div_ViewMore").show();
                        else
                            $("#div_ViewMore").hide();
                        if (parseInt($("#hdn_End").val()) < parseInt(this.TotalRows)) {
                            window.div_Records.innerHTML = $("#hdn_End").val() + " out of " + this.TotalRows + " records";
                            $("#txt_viewmore").show();
                        }
                        else {
                            window.div_Records.innerHTML = this.TotalRows + " out of " + this.TotalRows + " records";
                            $("#div_ViewMore").show();
                            $("#txt_viewmore").hide();
                        }
                        $("#hdn_Total").val(this.TotalRows);
                    });
                    //View More Data Append
                    if ($("#hdn_ViewMore").val() == "1") {
                        var newhtml = $('#dvExport').html().replace('</tbody></table>', tabletd + "</tbody></table>");
                        window.dvExport.innerHTML = newhtml;
                        $("#dvReport").append(innerDivhtml);
                        $("#hdn_ViewMore").val(0);
                    } else {
                        window.dvExport.innerHTML = "<table id='ExportTable'>" + tabletd + "</table>";
                        window.dvReport.innerHTML = "<div style='text-align: left;' class='headerstyle'>" +
                                                            "<div style='float: left; width: 16%;'>" +
                                                            "Product</div>" +
                                                            "<div style='float: left; width: 11%;' class='headerSort' id='short1'>" +
                                                            "Product Views</div>" +
                                                            "<div style='float: left; width: 10%;' class='headerSort' id='short2'>" +
                                                            "Unique Views</div>" +
                                                            "<div style='float: left; width: 8%;' class='headerSort' id='short3'>" +
                                                            "Total Cart</div>" +
                                                            "<div style='float: left; width: 10%;' class='headerSort' id='short4'>" +
                                                            "Unique Cart</div>" +
                                                            "<div style='float: left; width: 11%;' class='headerSort' id='short5'>" +
                                                            "Total Complete</div>" +
                                                            "<div style='float: left; width: 13%;' class='headerSort' id='short6'>" +
                                                            "Unique Complete</div>" +
                                                            "<div style='float: left; width: 4%;'>" +
                                                            "Success Qty</div>" +
                                                            "<div style='float: left; text-align: right; width: 17%;'>" +
                                                            "Recency</div>" +
                                                            "</div>" + innerDivhtml;
                    }
                    ///Sorting report
                    CallSort();
                    $("#dvLoading").css("display", "none");
                }
                else if ($("#hdn_ViewMore").val() == "1") {
                    $("#dvLoading").css("display", "none");
                }
                else { $("#dvDefault").css("display", "block"); $("#dvLoading").css("display", "none"); $("#divcontent").css("display", "none"); $(".chk").css("display", "none");  $("#dv_PntExp").css("display", "none"); }//$("#dvPrintExport").css("display", "none"); 
            }
        },
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }
    });
}


