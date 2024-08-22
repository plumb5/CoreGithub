//New Code
var ExportDrpDwn = 0, AllData = 0, LoadedData = 0, range = 0, rangeandScoreUpdate = 0;
var exportkey = 0, Pagerefresh = 0, SearchClick = 0, drpSearch='', txtSearch='';
function fn_toggleControl2(flag) {
    $('#tbleditscore').toggle('slow')
    if (flag == 0) {
        $("#div_AddGroup").hide();
        $("#Button1").attr("onclick", "javascript:fn_toggleControl2(1);");
    }
    else {
        setTimeout(function () { $("#div_AddGroup").show() }, 800);
        $("#Button1").attr("onclick", "javascript:fn_toggleControl2(0);");
    }
}
function fn_SelectAll() {
    var inpt = document.getElementsByTagName("input");
    if (document.getElementById('hdn_SelectAll').value == 0) {
        for (var i = 0; i < inpt.length; i++) {
            inpt[i].checked = true;
        }

        document.getElementById('hdn_SelectAll').value = 1;
    }
    else if (document.getElementById('hdn_SelectAll').value == 1) {
        for (var j = 0; j < inpt.length; j++) {
            inpt[j].checked = false;
        }
        document.getElementById('hdn_SelectAll').value = 0;
    }
}
//Transaction Checking
$(document).ready(function () {
    $.ajax({
        url: "/Analytics/Audience/Transaction",
        type: 'Post',
        data: "{'accountId':'" + parseInt($("#hdn_AccountId").val()) + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.ds == 1) {
                var myOptions = {
                    'View': 'Product Viewed',
                    'Cart': 'Added to Cart',
                    'Purchase': 'Purchased'
                };
                $.each(myOptions, function (val, text) {
                    $("#drp_SearchBy").append(new Option(text, val));
                });
            }
        }
    });
});
var keyval = 0, keyval1 = 0;
///Main Report
var AllReports = function (duration, recordsperpageDrpDwnClick) {
    //$("#hdn_duration").val(duration);
    $('#dv_PntExp').find('span:first').css({ left: "-25px", top: "27px" });
    $('#dv_Share span').css({ left: "-8px", top: "26px" });
    $("#dvCustomFilter").css("display", "none");
    $("#dvLoading").css("display", "block");
    var getFilter = CheckFilter(duration);
    var fromdate = getFilter[0], todate = getFilter[1], maintain = getFilter[4];
    $("#div_SearchBy").show();
    if (maintain == 1) { duration = 5; } ///Maintain
    $("#hdn_duration").val(duration);
    $(".button").attr("class", "button1");
    $("#btn" + duration).attr("class", "button");
    if ($("#hdn_ViewMore").val() == "0" && ExportDrpDwn == 0 && LoadedData == 0) {
        $("#hdn_count").val(0);
        $("#hdn_Start").val(1);
        //if ($("#drp_RecordsPerPage").val() == 'All' && recordsperpageDrpDwnClick != undefined && recordsperpageDrpDwnClick == 1) { //All Records OnChange
        //    keyval++;
        //    $("#hdn_End").val(1);
        //}
        //else if ($("#drp_RecordsPerPage").val() == 'All' && recordsperpageDrpDwnClick == undefined && keyval == 0) {//Day/Week/Month/Year Click with All Records
        //    keyval++;
        //    $("#hdn_End").val(1);
        //}
        //else {
            if (keyval > 0)
                keyval = 0;
            else
                $("#hdn_End").val($("#drp_RecordsPerPage").val());
       // }
    }
    if (AllData == 1)
        $("#hdn_End").val($("#hdn_Total").val());
    $.ajax({
        url: "/Analytics/Audience/BindVisitors",
        type: 'Post',
        data: "{'accountId':'" + parseInt($("#hdn_AccountId").val()) + "','duration':'" + duration + "','fromdate':'" + fromdate + "','todate':'" + todate + "','start':'" + parseInt($("#hdn_Start").val()) + "','end':'" + parseInt($("#hdn_End").val()) + "','visitorSummary':'" + (keyval == 0 ? exportkey : 0) + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table.length > 0) {
                if (exportkey == 1 && keyval == 0) {
                    var tblHD = "<tr style='font-weight: bold;'><td>Visitor IP</td><td>Email</td><td>Avg Time Spent</td><td>Page Views</td><td>Sessions</td><td>Last Interaction</td><td>Most Visited Location</td><td>Network</td><td>Total Purchases</td><td>Bounce Rate</td><td>Total Score</td></tr>";
                    var tblTD = "";
                    $.each(response.Table, function () {
                        tblTD += "<tr><td>" + this.Mac_Id + "</td><td>" + (this.Email == 'null' || this.Email == null ? 'NA' : (this.Email.toString().indexOf("~") > -1 ? this.Email.toString().split("~")[1] : this.Email)) + "</td><td>" + fn_AverageTime(this.AvgTime) + "</td><td>" + this.PageViews + "</td><td>" + this.Session + "</td><td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.Recency)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.Recency)) + "</td><td>" + this.City + "</td><td>" + this.Network + "</td><td>" + this.Purchased + "</td><td>" + (parseFloat(this.OnePageSession) / parseFloat(this.Session) * 100) + "%</td><td>" + (this.Score == null || this.Score == "" ? "0" : this.Score) + "</td></tr>";
                    });
                    window.dvExport.innerHTML = "<table id='ExportTable'>" + tblHD + tblTD + "</table>";
                    exportkey = 0;
                }
                else {
                    $("#dvDefault").css("display", "none");
                    $("#divcontent").css("display", "block");
                    $("#dv_wdthchng").css("display", "block");
                    OnSuccessReport(response, duration);
                }
            } else {
                $("#dvDefault").css("display", "block"); $("#dvLoading").css("display", "none"); $("#divcontent").css("display", "none"); $("#dv_wdthchng").css("display", "none");
            }
            //New Code
        },
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
            exportkey = 0;
        }
    });
};
///Search By Go Button
var fn_SearchByOnclick = function (recordsperpageDrpDwnClick1) {
    $("#dvLoading").css("display", "block");
    var duration = $("#hdn_duration").val();
    var getFilter = CheckFilter(parseInt(duration));
    var fromdate = getFilter[0], todate = getFilter[1];
    //**********************Recency Fiter Date *************************************
    if ($('#drp_SearchBy').val() == 'Recency' && $('#txt_SearchBy').val().indexOf('-') > -1) {
        var daterange = $('#txt_SearchBy').val().replace('days', '').split('-');
        var endday = daterange[0], startday = daterange[1];
        endday = endday.trim();
        var to = new Date();
        to.setDate(to.getDate() - endday);
        var frm = new Date();
        frm.setDate(frm.getDate() - startday);
        a = new Date(frm);
        b = new Date(to);
        window.lblDate.innerHTML = a.getDate(frm) + ' ' + GetMonthName(a.getMonth(frm) + 1) + ' ' + a.getFullYear(frm) + ' - ' + b.getDate(to) + ' ' + GetMonthName(b.getMonth(to) + 1) + ' ' + b.getFullYear(to);
        fromdate = (a.getMonth(frm) + 1) + '/' + a.getDate(frm) + '/' + a.getFullYear(frm) + " 00:00:00.000";
        todate = (b.getMonth(to) + 1) + '/' + b.getDate(to) + '/' + b.getFullYear(to) + " 23:59:59.000";
        fromdate = ConvertDateTimeToUTC(fromdate);
        fromdate = AddingPrefixZero((fromdate.getMonth() + 1)) + '/' + AddingPrefixZero(fromdate.getDate()) + '/' + fromdate.getFullYear() + " " + AddingPrefixZero(fromdate.getHours()) + ":" + AddingPrefixZero(fromdate.getMinutes()) + ":" + AddingPrefixZero(fromdate.getSeconds()) + ".000";
        todate = ConvertDateTimeToUTC(todate);
        todate = AddingPrefixZero((todate.getMonth() + 1)) + '/' + AddingPrefixZero(todate.getDate()) + '/' + todate.getFullYear() + " " + AddingPrefixZero(todate.getHours()) + ":" + AddingPrefixZero(todate.getMinutes()) + ":" + AddingPrefixZero(todate.getSeconds()) + ".000";
    }
    else if ($('#drp_SearchBy').val() == 'Recency' && $('#txt_SearchBy').val().indexOf('-') == -1 && $('#txt_SearchBy').val() != 'More than 364 days') {
        var daydiff = $('#txt_SearchBy').val().replace('days', '').replace('day', '');
        a = new Date();
        a.setDate(a.getDate() - daydiff)
        fromdate = (a.getMonth() + 1) + '/' + a.getDate() + '/' + a.getFullYear() + " 00:00:00.000";
        todate = (a.getMonth() + 1) + '/' + a.getDate() + '/' + a.getFullYear() + " 23:59:59.000";
        fromdate = ConvertDateTimeToUTC(fromdate);
        fromdate = AddingPrefixZero((fromdate.getMonth() + 1)) + '/' + AddingPrefixZero(fromdate.getDate()) + '/' + fromdate.getFullYear() + " " + AddingPrefixZero(fromdate.getHours()) + ":" + AddingPrefixZero(fromdate.getMinutes()) + ":" + AddingPrefixZero(fromdate.getSeconds()) + ".000";
        todate = ConvertDateTimeToUTC(todate);
        todate = AddingPrefixZero((todate.getMonth() + 1)) + '/' + AddingPrefixZero(todate.getDate()) + '/' + todate.getFullYear() + " " + AddingPrefixZero(todate.getHours()) + ":" + AddingPrefixZero(todate.getMinutes()) + ":" + AddingPrefixZero(todate.getSeconds()) + ".000";
    }
    else if ($('#drp_SearchBy').val() == 'Recency' && $('#txt_SearchBy').val() == 'More than 364 days') {
        a = new Date();
        a.setDate(a.getDate() - 365)
        fromdate = (a.getMonth() + 1) + '/' + a.getDate() + '/' + a.getFullYear() + " 00:00:00.000";
        fromdate = ConvertDateTimeToUTC(fromdate);
        fromdate = AddingPrefixZero((fromdate.getMonth() + 1)) + '/' + AddingPrefixZero(fromdate.getDate()) + '/' + fromdate.getFullYear() + " " + AddingPrefixZero(fromdate.getHours()) + ":" + AddingPrefixZero(fromdate.getMinutes()) + ":" + AddingPrefixZero(fromdate.getSeconds()) + ".000";
        todate = (a.getMonth() + 1) + '/' + a.getDate() + '/' + a.getFullYear() + " 23:59:59.000";
        todate = ConvertDateTimeToUTC(todate);
        todate = AddingPrefixZero((todate.getMonth() + 1)) + '/' + AddingPrefixZero(todate.getDate()) + '/' + todate.getFullYear() + " " + AddingPrefixZero(todate.getHours()) + ":" + AddingPrefixZero(todate.getMinutes()) + ":" + AddingPrefixZero(todate.getSeconds()) + ".000";

    }
    //*******************************************************************
    $(".button").attr("class", "button1");
    $("#btn" + duration).attr("class", "button");
    if ($("#hdn_ViewMore").val() == "0" && ExportDrpDwn == 0 && LoadedData == 0) {
        $("#hdn_count").val(0);
        $("#hdn_Start").val(1);
        if ($("#drp_RecordsPerPage").val() == 'All' && recordsperpageDrpDwnClick1 != undefined && recordsperpageDrpDwnClick1 == 1) { //All Records OnChange
            $("#hdn_End").val(parseInt($("#hdn_Total").val()));
        }
        else if ($("#drp_RecordsPerPage").val() == 'All' && recordsperpageDrpDwnClick1 == undefined && keyval1 == 0) {//Day/Week/Month/Year Click with All Records
            keyval1++;
            $("#hdn_End").val(1);
        }
        else {
            if (keyval1 > 0)
                keyval1 = 0;
            else
                $("#hdn_End").val($("#drp_RecordsPerPage").val());
        }
    }
    if (AllData == 1)
        $("#hdn_End").val($("#hdn_Total").val());
     drpSearch = $("#drp_SearchBy").val();
    txtSearch = $('#txt_SearchBy').val();
    if ($("#drp_SearchBy").val() == "All" || $("#txt_SearchBy").val() == "Search Page" || $("#txt_SearchBy").val() == "Search City" || $("#txt_SearchBy").val() == "Search Device" || $("#txt_SearchBy").val() == "Enter Days" || $("#txt_SearchBy").val() == "Enter Visits" || $("#txt_SearchBy").val() == "Enter Score") {
        drpSearch = "All";
        txtSearch = "All";
    }
    else if ($("#drp_SearchBy").val() == "Recency") {
        $('#btn1').removeClass('button').addClass('button1');
        $('#btn2').removeClass('button').addClass('button1');
        $('#btn3').removeClass('button').addClass('button1');
        $('#btn4').removeClass('button').addClass('button1');
        txtSearch = $('#txt_SearchBy').val().toString().replace(' days', '').replace(' day', '');
    }
    else if ($("#txt_SearchBy").val() == "Enter Search Source" || $("#txt_SearchBy").val() == "Enter Referral Source" || $("#txt_SearchBy").val() == "Enter Social Source" || $("#txt_SearchBy").val() == "Search Product") {
        txtSearch = "All";
    }
    else if ($("#drp_SearchBy").val() == 'View' || $("#drp_SearchBy").val() == 'Cart' || $("#drp_SearchBy").val() == 'Purchase') {
        txtSearch = $("#hdn_ProductId").val();
    }
    $.ajax({
        type: "POST",
        url: "/Analytics/Audience/SearchByOnclick",
        data: "{'accountId':'" + $("#hdn_AccountId").val() + "','drpSearchBy':'" + drpSearch + "','txtSearchBy':'" + txtSearch + "','duration':'" + duration + "','fromdate':'" + fromdate + "','todate':'" + todate + "','start':'" + $("#hdn_Start").val() + "','end':'" + $("#hdn_End").val() + "','visitorSummary':'" + (keyval1 == 0 ? exportkey : 0) + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null) {
                if (exportkey == 1 && keyval1 == 0) {
                    exportkey = 0;
                    var tblHD = "<tr style='font-weight: bold;'><td>Visitor IP</td><td>Email</td><td>Avg Time Spent</td><td>Page Views</td><td>Sessions</td><td>Last Interaction</td><td>Most Visited Location</td><td>Network</td><td>Total Purchases</td><td>Bounce Rate</td><td>Total Score</td></tr>";
                    var tblTD = "";
                    $.each(response.Table, function () {
                        tblTD += "<tr><td>" + this.Mac_Id + "</td><td>" + (this.Email == 'null' || this.Email == null ? 'NA' : (this.Email.toString().indexOf("~") > -1 ? this.Email.toString().split("~")[1] : this.Email)) + "</td><td>" + fn_AverageTime(this.AvgTime) + "</td><td>" + this.PageViews + "</td><td>" + this.Session + "</td><td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.Recency)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.Recency)) + "</td><td>" + this.City + "</td><td>" + this.Network + "</td><td>" + this.Purchased + "</td><td>" + (parseFloat(this.OnePageSession) / parseFloat(this.Session) * 100) + "%</td><td>" + (this.Score == null || this.Score == "" ? "0" : this.Score) + "</td></tr>";
                    });
                    window.dvExport.innerHTML = "<table id='ExportTable'>" + tblHD + tblTD + "</table>";
                }
                else {
                    $("#dvDefault").css("display", "none");
                    $("#divcontent").css("display", "block");
                    $("#dv_wdthchng").css("display", "block");
                    OnSuccessReport(response, duration);
                }
            } else {
                $("#dvDefault").css("display", "block"); $("#dvLoading").css("display", "none"); $("#divcontent").css("display", "none");
            }
            if ($('#drp_SearchBy').val() == 'Recency' && $('#txt_SearchBy').val() != 'Enter Days' && $('#txt_SearchBy').val().indexOf('-') == -1) {
                var Days = $('#txt_SearchBy').val();
                if (Days == 'More than 364 days')
                    Days = 365
                else
                    Days = Days.replace('day', '').replace('s', '');
                var date = new Date(new Date() - 24 * Days * 60 * 60 * 1000)
                date = $.datepicker.formatDate('dd MM yy', date);
                $('#lblDate').text(date.toString());
                $('#lblDate').show();
                $('#lnkFilter').hide();
            }
            else {
                $('#lnkFilter').show();
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
};
///
dvCustomFilter.innerHTML = getCustomFilter();
dvDatetoYear.innerHTML = getDefaultDuration();
$("#dvPrintExport").append(getPrintExport('Visitors', 0, 0, 1));
$("#btnExport").attr("id", "btnExportNew");
if (p5keyValue != 0) {
    $("#hdn_duration").val(duration);
    $("#drp_SearchBy").val(drpSearch);
    if (drpSearch != "All" && txtSearch != '' && txtSearch != 0) {
        $("#div_SearchBy").css("width", "513px");
        $("#txt_SearchBy").show();
        $('#txt_SearchBy').val(txtSearch);
        if (txtSearch == "Frequency" || txtSearch == "Recency" || txtSearch == "Score")
            $('#txt_SearchBy').attr("onkeypress", "javascript:return isNumber(event)");
        else
            $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
    }
    if (drpSearch != '' && drpSearch != 0 && txtSearch != 0 && txtSearch != '')
        fn_SearchByOnclick();
    else
        AllReports(parseInt(duration));
}
else {
    drpSearch = $("#drp_SearchBy").val();
    txtSearch = $('#txt_SearchBy').val();
    AllReports(2);
}
///Intermediate fn for Search By filter or not checking
function Report(duration) {
    $("#hdn_duration").val(duration);
    var drpSearchBy = $("#drp_SearchBy").val();
    if (drpSearchBy == 'All' && $("#drp_RecordsPerPage").val() != "All")
        AllReports(duration);
    else
        fn_SearchByOnclick();
}
var mobile = '';
///Report Success Function
function OnSuccessReport(response, duration) {
    var count = parseInt($("#hdn_count").val());
    if ($('#drp_RecordsPerPage').val() == 'All' && (keyval > 0 || keyval1 > 0)) {
        $.each(response.Table1, function () {
            $("#hdn_End").val(this.TotalRows);
            return;
        });
        if (keyval > 0)
            AllReports(duration);
        else if (keyval1 > 0)
            fn_SearchByOnclick();
    } else {
        if (AllData != 1)
            var innerDivhtml = "";
        var tabletd = "";
        $.each(response.Table, function () {
            var PhoneNumber = (this.Email == 'null' || this.Email == null ? '' : (this.Email.toString().indexOf("~") > -1 ? this.Email.toString().split("~")[2] : this.Email));
            tabletd += "<tr><td>" + this.Mac_Id + "</td><td>" + (this.Email == 'null' || this.Email == null ? 'NA' : (this.Email.toString().indexOf("~") > -1 ? this.Email.toString().split("~")[1] : this.Email)) + "</td><td>" + (PhoneNumber == "" || PhoneNumber == undefined ? "NA" : PhoneNumber) + "</td><td>" + fn_AverageTime(this.AvgTime) + "</td><td>" + this.Session + "</td><td>" + $.datepicker.formatDate("M dd yy", ConvertUTCDateTimeToLocal(this.Recency)) + " " + PlumbTimeFormat(ConvertUTCDateTimeToLocal(this.Recency)) + "</td><td>" + this.City + "</td><td>" + this.TopPage + "</td><td>" + (this.Score == null || this.Score == "" ? "0" : this.Score) + "</td></tr>";
            if (AllData != 1) {
                var email = (this.Email == 'null' || this.Email == null ? '' : (this.Email.toString().indexOf("~") > -1 ? this.Email.toString().split("~")[1] : this.Email));

                var contactId = (this.Email == 'null' || this.Email == null ? '' : (this.Email.toString().indexOf("~") > -1 ? this.Email.toString().split("~")[0] : ''));
                innerDivhtml += "<div id='" + (this.RowNo - 1) + "' style='height: 17px; text-align: left;' class='itemStyle'>" +
                    "<div style='float: left; width: 16%;'><input type='checkbox' id='chk_AddToGroup' name='chk_AddToGroup' value='" + contactId + "%" + this.MachineId + "' style='left: -4px; position: relative; top: 2px;'/>" +
                    "<a href='javascript:void(0)' id='lnkCustomer" + this.MachineId + "' OnClick=ContactInfo('" + this.MachineId + "','" + contactId + "');>" + this.Loyalty + "&nbsp;&nbsp;" + this.Mac_Id + "</a></div>" +
                    "<div style='float: left; width: 16%;text-align:center' title='" + (email == "" ? "Contacts not found" : (PhoneNumber != "" && PhoneNumber != undefined ? "Email :" + (MaskEmailId(email) + "&#10;PhoneNumber :" + MaskPhoneNumber(PhoneNumber)) : MaskEmailId(email))) + "'>" +
                    "<img src='/images/noEmailId.png' alt='No EmailId found' /></div>" +
                    "<div style='float: left; width: 8%;'>" +
                    fn_AverageTime(this.AvgTime) + "</div>" +
                    "<div style='float: left; width: 5%;'>" +
                    this.Session + "</div>" +
                    "<div style='float: left; width: 14%;'>" +
                    $.datepicker.formatDate("M dd yy", ConvertUTCDateTimeToLocal(this.Recency)) + " " + PlumbTimeFormat(ConvertUTCDateTimeToLocal(this.Recency)) + "</div>" +
                    "<div style='float: left; width: 8%;'>" +
                    (this.City == "" ? "Unknown City" : (this.City.toString().length > 13 ? "<span title='" + this.City + "'>" + this.City.toString().substring(0, 13) + "..</span>" : this.City)) + "</div>" +
                    "<div style='float: left; width: 22%;'>" +
                    (this.TopPage != null && this.TopPage.toString().length > 36 ? "<span title='" + this.TopPage + "'>" + this.TopPage.toString().substring(0, 36) + "..</span>" : this.TopPage) + "</div>" +
                    "<div style='float: left; width: 10%; text-align: right;'>" +
                    "<div id='divid" + count + "' style='width: 100%; margin-left: -23px;'>" + (this.Score == null || this.Score == "" ? "0" : this.Score) + "</div></div>" +
                    "<div style='float: right; position: relative; top: -16px; left: 2px;'><img id='img_" + (this.RowNo - 1) + "' style='width: 16px;cursor:pointer;position: relative;' onclick='fnUpdateScore(&#39;" + this.MachineId + "&#39;,&#39;divid" + count + "&#39;)' title='Refresh Score' alt='Refresh Score' src='/images/RefreshScore1_gray.png'></div></div>";
                count++;
            }
        });
        //View More Counts Display
        if (AllData != 1) {
            $.each(response.Table1, function () {
                if (parseInt($("#hdn_End").val()) < parseInt(this.TotalRows) && parseInt(this.TotalRows) > parseInt($("#drp_RecordsPerPage").val())) {
                    $("#div_ViewMore").show();
                } else {
                    $("#div_ViewMore").hide();
                }
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
        }
        if (ExportDrpDwn == 1) {
            $("#txt_viewmore").hide();
            window.div_Records.innerHTML = $("#txt_start").val() + " to " + (parseInt($("#txt_end").val()) >= parseInt($("#hdn_Total").val()) ? $("#hdn_Total").val() : $("#txt_end").val()) + " out of " + $("#hdn_Total").val() + " records";
        }
        if (range == 1 && LoadedData == 1) {
            $("#txt_viewmore").hide();
            range = 0;
        }
        ExportDrpDwn = 0; LoadedData = 0;
        $("#dv_SelectedData").hide();
        $("#dvexport_option").hide('slow');
        $("#dvexport_txtorxlx").hide('slow');
        //View More Data Append
        if ($("#hdn_ViewMore").val() == "1") {
            var newhtml = $('div#dvExport').html().replace('</tbody></table>', tabletd + "</tbody></table>");
            $("#dvExport").html(newhtml);
            $("#dvReport").append(innerDivhtml);
            $("#hdn_ViewMore").val(0);
        } else {

            var tablehd = "<tr style='font-weight: bold;'><td>Visitor IP</td><td>Email</td><td>Phone Number</td><td>Avg Time Spent</td><td>Sessions</td><td>Last Interaction</td><td>City</td><td>Most Visited Page</td><td>Score</td></tr>";
            window.dvExport.innerHTML = "<table id='ExportTable'>" + tablehd + tabletd + "</table>";
            if (innerDivhtml == '') {
                $("#dvDefault").show();
                $("#divcontent").hide();
                $("#chk_SelectAll").hide();
                $("#dv_wdthchng").hide();
            } else {
                $("#chk_SelectAll").show();
            }
            if (AllData != 1) {
                window.dvReport.innerHTML = "<div style='text-align: left;' class='headerstyle'>" +
                    "<div style='float: left; width: 16%;'>" +
                    "<input type='checkbox' id='chk_SelectAll' name='chk_AddToGroup' class='chk' style='left: -4px; position: relative;top: 10%;' onclick='fn_SelectAll()' />&nbsp;Visitor IP</div>" +
                    "<div style='float: left; width: 16%;text-align:center'>" +
                    "Contact</div>" +
                    "<div style='float: left; width: 8%;'>" +
                    "Avg. Time Spent</div>" +
                    "<div style='float: left; width: 5%;'>" +
                    "Sessions</div>" +
                    "<div style='float: left; width: 14%;'>" +
                    "Last Interaction</div>" +
                    "<div style='float: left; width: 8%;'>" +
                    "City</div>" +
                    "<div style='float: left; width: 22%;'>" +
                    "Most Visited Page</div>" +
                    "<div id='dv_AllScore' style='float: left; text-align: right; width: 11%; position: relative; top: -4px; left: 2px;''>" +
                    "Score&nbsp;&nbsp;&nbsp;&nbsp;<img style='width: 16px; cursor:pointer; position: relative; top: 5px; margin-left: 5px;' onclick='fnUpdateAllScore()' title='Refresh Top 10 Score' alt='Refresh Top 10 Score' src='/images/RefreshScore1_Green.png'></div>" +
                    "<div style='float: right;'>" +
                    "</div></div>" + innerDivhtml;
            }
        }
        AllData = 0;
        $("#dvExpend").css({ 'height': (620 > $("#dvReport").height() + 160) ? '620px' : $("#dvReport").height() + 160 + 'px' });
        $("#iframe").css("margin", "0px");
        $("#dv_wdthchng").css("display", "block");
        $("#dvLoading").css("display", "none");

        if (Pagerefresh == 1 || SearchClick == 1) {
            hdnstartcount = 0;hdnendcount = 10;
        }
        else {
            for (var m = 0; m < incr; m++) {
                if (arSingle.length > 0) {
                    $("#img_" + arSingle[m]).attr('src', '/images/RefreshScore1_Green.png');
                    $("#img_" + arSingle[m]).addClass("Refreshed");
                }
                else {
                    $("#img_" + m).attr('src', '/images/RefreshScore1_Green.png');
                    $("#img_" + m).addClass("Refreshed");

                }
            }
        }
    }
}
///Updating the Score
function fnUpdateScore(macid, id) {
    var rowno = id.replace("divid", "");
    document.getElementById(id).innerHTML = "<img src='/images/al_loading.gif' alt='Loading' style='left: 1px;position: relative;width: 18px;height:14px'/>";
    $.ajax({
        type: "POST",
        url: "/Analytics/Audience/UpdateScore",
        data: "{'accountId':'" + $("#hdn_AccountId").val() + "','mac':'" + macid + "','key':'Single'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            document.getElementById(id).innerHTML = response.ds;
            $("#img_" + rowno).attr('src', '/images/RefreshScore1_Green.png');
            $("#img_" + rowno).addClass("Refreshed");
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
// score update checking 
function fnUpdateAllScore() {
    var vaIs = 0;
    for (var i = hdnstartcount; i < hdnendcount; i++) {
        if ($("#img_" + i).attr('src').indexOf("RefreshScore1_gray.png") > -1) {
            fnUpdateAllScoreAfterChecking();
            return false;
        }
        else
            vaIs = 1;
    }
    if (vaIs == 1) {
        hdnstartcount = hdnstartcount + 10;
        hdnendcount = hdnendcount + 10;
        fnUpdateAllScore();
    }
}
///Updating Top 10 Scores
var start = 1, end = 10, arMach = [], SCount = 0, hdnstartcount = 0, hdnendcount = 10, incr = 0, arSingle = [];
function fnUpdateAllScoreAfterChecking() {
    arMach = [];
    if ($("#dv_AllScore img").attr('src').indexOf("al_loading.gif") != -1) {
        return false;
    } else {
        $("#dv_AllScore img").attr('src', '/images/al_loading.gif');
        if ($("#" + hdnstartcount + " input").val() == '' || $("#" + hdnstartcount + " input").val() == undefined) {
            $("#dv_AllScore img").attr('src', '/images/RefreshScore1_Green.png');
            return false;
        }
        if (rangeandScoreUpdate == 1) {
            for (var m = hdnstartcount; m < $(".itemStyle").length; m++) {
                if (m < $("#hdn_Total").val())
                    arMach.push($("#" + m + " input").val().split('%')[1]);
            }
            rangeandScoreUpdate = 0;
        }
        else {
            for (var i = hdnstartcount; i < hdnendcount; i++) {
                if (i < $("#hdn_Total").val())
                    arMach.push($("#" + i + " input").val().split('%')[1]);
            }
        }
        $.ajax({
            type: "POST",
            url: "/Analytics/Audience/UpdateScore",
            data: "{'accountId':'" + $("#hdn_AccountId").val() + "','mac':'" + arMach + ",','key':'All'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                incr = hdnstartcount;
                $.each(response.Table, function () {
                    if (this.MachineId == $("#" + incr + " input").val().split('%')[1]) {
                        $("#divid" + incr).html(this.Score);
                        $("#img_" + incr).attr('src', '/images/RefreshScore1_Green.png');
                        $("#img_" + incr).addClass("Refreshed");
                        SCount = incr;
                        incr = incr + 1;
                    }
                });
                $("#dv_AllScore img").attr('src', '/images/RefreshScore1_Green.png');
                $('html, body').animate({
                    scrollTop: $('#' + hdnstartcount).position().top
                }, 1000
                );
                for (var j = hdnstartcount; j < hdnendcount; j++)
                    $("#" + j).addClass('refreshbackgroud');

                for (var k = hdnstartcount; k < hdnendcount; k++)
                    $("#" + k).removeClass("refreshbackgroud", 4000, "");

                ShowErrorMessage("Score updated for row " + (hdnstartcount + 1) + " to " + incr);
                hdnstartcount = SCount + 1;
                hdnendcount = hdnstartcount + 10;
            },
            failure: function (response) {
            },
            error: function (response) {
            }
        });
    }
}
///Bind Groups in DropDown
$(document).ready(function () {
    fn_BindGroupsDropDown();
});
function fn_BindGroupsDropDown() {
    $.ajax({
        type: "POST",
        url: "/Analytics/Audience/GetGroupNames",
        data: "{'accountId':'" + $("#hdn_AccountId").val() + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response.Table, function () {
                window.drp_AddToGroup.innerHTML += "<option value='" + this.GroupId + "'>" + this.GroupName + "</option>";
            });
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
///Add to Group
function fn_Addtogroup() {
    if ($("#drp_AddToGroup").val() == '--None--') {
        ShowErrorMessage("Please select the group");
        return;
    }
    var chkArrayMachine = new Array();
    var chkArrayContactId = new Array();

    $("input:checkbox:checked").each(function () {
        if (this.id != "chk_SelectAll" && this.id != "chk_Maintain") {
            chkArrayContactId.push($(this).val().split('%')[0]);
            chkArrayMachine.push($(this).val().split('%')[1]);
        }
    });

    if (chkArrayMachine != undefined && chkArrayMachine.length > 0) {
        $.ajax({
            type: "POST",
            url: "/Analytics/Audience/AddToGroup",
            data: "{'accountId':'" + $("#hdn_AccountId").val() + "','contact':'" + chkArrayContactId + "','machine':'" + chkArrayMachine + "','groupId':'" + $('#drp_AddToGroup').val() + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) { //OnSuccessMachine,
                addinbox(parseInt(response));
            },
            failure: function (response) {
                //alert(response.d+"abcd");
            },
            error: function (response) {
                //alert(response.d+"efgh");
            }
        });
    } else {
        ShowErrorMessage("Please select the visitors to add");
    }
}
function addinbox(val) {
    if (val > 0)
        ShowErrorMessage("Added successfully");
    else if (val == 0)
        ShowErrorMessage("Already added");
    else
        ShowErrorMessage("Something goes wrong, please login again and try");
    fn_toggleControl2(0);
}
///Search By WaterMark
$(document).ready(function () {
    if ($('#drp_SearchBy').val() == 'City') {
        if ($('#txt_SearchBy').val() == 'All' || $('#txt_SearchBy').val() == '')
            $('#txt_SearchBy').val('Search City').addClass('watermark');
        $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
    }
        //else if ($('#drp_SearchBy').val() == 'Device') {
        //    if ($('#txt_SearchBy').val() == 'All' || $('#txt_SearchBy').val() == '')
        //        $('#txt_SearchBy').val('Search Device').addClass('watermark');
        //    $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
        //}
    else if ($('#drp_SearchBy').val() == 'Page') {
        if ($('#txt_SearchBy').val() == 'All' || $('#txt_SearchBy').val() == '')
            $('#txt_SearchBy').val('Search Page').addClass('watermark');
        $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
    } else if ($('#drp_SearchBy').val() == 'Recency') {
        if ($('#txt_SearchBy').val() == 'All' || $('#txt_SearchBy').val() == '')
            $('#txt_SearchBy').val('Enter Days').addClass('watermark');
        $('#txt_SearchBy').attr("onkeypress", "javascript:return isNumber(event)");
    } else if ($('#drp_SearchBy').val() == 'Score') {
        if ($('#txt_SearchBy').val() == 'All' || $('#txt_SearchBy').val() == '')
            $('#txt_SearchBy').val('Enter Score').addClass('watermark');
        $('#txt_SearchBy').attr("onkeypress", "javascript:return isNumber(event)");
    } else if ($('#drp_SearchBy').val() == 'Frequency') {
        if ($('#txt_SearchBy').val() == 'All' || $('#txt_SearchBy').val() == '')
            $('#txt_SearchBy').val('Enter Visits').addClass('watermark');
        $('#txt_SearchBy').attr("onkeypress", "javascript:return isNumber(event)");
    } else if ($('#drp_SearchBy').val() == 'New' || $('#drp_SearchBy').val() == 'Single' || $('#drp_SearchBy').val() == 'Repeat' || $('#drp_SearchBy').val() == 'Returning' || $('#drp_SearchBy').val() == 'Direct' || $('#drp_SearchBy').val() == 'EmailSource' || $('#drp_SearchBy').val() == 'Sms' || $('#drp_SearchBy').val() == 'AdWords' || $('#drp_SearchBy').val() == 'AdSense') {
        $('#txt_SearchBy').val('All').addClass('watermark'); $("#txt_SearchBy").prop("disabled", true);
        $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
    } else if ($('#drp_SearchBy').val() == 'Search') {
        if ($('#txt_SearchBy').val() == 'All' || $('#txt_SearchBy').val() == '')
            $('#txt_SearchBy').val('Enter Search Source').addClass('watermark');
        $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
    } else if ($('#drp_SearchBy').val() == 'Refer') {
        if ($('#txt_SearchBy').val() == 'All' || $('#txt_SearchBy').val() == '')
            $('#txt_SearchBy').val('Enter Refferal Source').addClass('watermark');
        $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
    } else if ($('#drp_SearchBy').val() == 'Social') {
        if ($('#txt_SearchBy').val() == 'All' || $('#txt_SearchBy').val() == '')
            $('#txt_SearchBy').val('Enter Social Source').addClass('watermark');
        $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
    } else if ($('#drp_SearchBy').val() == 'View' || $('#drp_SearchBy').val() == 'Cart' || $('#drp_SearchBy').val() == 'Purchase') {
        if ($('#txt_SearchBy').val() == 'All' || $('#txt_SearchBy').val() == '')
            $('#txt_SearchBy').val('Search Product').addClass('watermark');
        $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
    } else if ($('#txt_SearchBy').val() == '') {
        $('#txt_SearchBy').val('All').addClass('watermark');
        $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
    }
});
///Search By Focus
$('#txt_SearchBy').focus(function () {
    if ($(this).val() == 'All' || $(this).val() == 'Search City' || $(this).val() == 'Search Device' || $(this).val() == 'Search Page' || $(this).val() == 'Enter Days' || $(this).val() == 'Enter Visits' || $(this).val() == 'Enter Score' || $(this).val() == 'Search Product' || $(this).val() == 'Enter Search Source' || $(this).val() == 'Enter Referral Source' || $(this).val() == 'Enter Social Source') {
        $(this).val('').removeClass('watermark');
    }
});
///Search By Blur
$('#txt_SearchBy').blur(function () {
    if ($(this).val() == '') {
        if ($('#drp_SearchBy').val() == 'City') {
            $(this).val('Search City').addClass('watermark');
        }
            //else if ($('#drp_SearchBy').val() == 'Device') {
            //    $(this).val('Search Device').addClass('watermark');
            //}
        else if ($('#drp_SearchBy').val() == 'Page') {
            $(this).val('Search Page').addClass('watermark');
        } else if ($('#drp_SearchBy').val() == 'Recency') {
            $(this).val('Enter Days').addClass('watermark');
        } else if ($('#drp_SearchBy').val() == 'Frequency') {
            $(this).val('Enter Visits').addClass('watermark');
        } else if ($('#drp_SearchBy').val() == 'Score') {
            $(this).val('Enter Score').addClass('watermark');
        } else if ($('#drp_SearchBy').val() == 'New' || $('#drp_SearchBy').val() == 'Single' || $('#drp_SearchBy').val() == 'Repeat' || $('#drp_SearchBy').val() == 'Returning' || $('#drp_SearchBy').val() == 'Direct' || $('#drp_SearchBy').val() == 'EmailSource' || $('#drp_SearchBy').val() == 'Sms' || $('#drp_SearchBy').val() == 'AdWords' || $('#drp_SearchBy').val() == 'AdSense') {
            $(this).val('All').addClass('watermark'); $("#txt_SearchBy").prop("disabled", true);
        } else if ($('#drp_SearchBy').val() == 'Search') {
            $(this).val('Enter Search Source').addClass('watermark');
        } else if ($('#drp_SearchBy').val() == 'Refer') {
            $(this).val('Enter Referral Source').addClass('watermark');
        } else if ($('#drp_SearchBy').val() == 'Social') {
            $(this).val('Enter Social Source').addClass('watermark');
        } else if ($('#drp_SearchBy').val() == 'View' || $('#drp_SearchBy').val() == 'Cart' || $('#drp_SearchBy').val() == 'Purchase') {
            $(this).val('Search Product').addClass('watermark');
        } else {
            $(this).val('All').addClass('watermark');
        }
    }
});
///Search By Watermark
$("#drp_SearchBy").change(function () {
    $("#div_SearchBy").css("width", "513px");
    if ($('#drp_SearchBy').val() != "All") {
        $("#txt_SearchBy").show();
        $("#txt_SearchBy").prop("disabled", false);
        $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
        if ($('#drp_SearchBy').val() == 'VisitorIP' || $('#drp_SearchBy').val() == 'Contact' || $('#drp_SearchBy').val() == 'Email' || $('#drp_SearchBy').val() == 'PhoneNumber' || $('#drp_SearchBy').val() == 'Device') {
            $('#txt_SearchBy').val('All').addClass('watermark');
            $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
        } else if ($('#drp_SearchBy').val() == 'City') {
            $('#txt_SearchBy').val('Search City').addClass('watermark');
            $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
        }
            //else if ($('#drp_SearchBy').val() == 'Device') {
            //    $('#txt_SearchBy').val('Search Device').addClass('watermark');
            //    $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
            //}
        else if ($('#drp_SearchBy').val() == 'Page') {
            $('#txt_SearchBy').val('Search Page').addClass('watermark');
            $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
        } else if ($('#drp_SearchBy').val() == 'Recency') {
            $('#txt_SearchBy').val('Enter Days').addClass('watermark');
            $('#txt_SearchBy').attr("onkeypress", "javascript:return isNumber(event)");
        } else if ($('#drp_SearchBy').val() == 'Frequency') {
            $('#txt_SearchBy').val('Enter Visits').addClass('watermark');
            $('#txt_SearchBy').attr("onkeypress", "javascript:return isNumber(event)");
        } else if ($('#drp_SearchBy').val() == 'Score') {
            $('#txt_SearchBy').val('Enter Score').addClass('watermark');
            $('#txt_SearchBy').attr("onkeypress", "javascript:return isNumber(event)");
        } else if ($('#drp_SearchBy').val() == 'New' || $('#drp_SearchBy').val() == 'Single' || $('#drp_SearchBy').val() == 'Repeat' || $('#drp_SearchBy').val() == 'Returning' || $('#drp_SearchBy').val() == 'Direct' || $('#drp_SearchBy').val() == 'EmailSource' || $('#drp_SearchBy').val() == 'Sms' || $('#drp_SearchBy').val() == 'AdWords' || $('#drp_SearchBy').val() == 'AdSense') {
            $('#txt_SearchBy').val('All').addClass('watermark');
            $("#txt_SearchBy").prop("disabled", true);
            $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
        } else if ($('#drp_SearchBy').val() == 'Search') {
            $('#txt_SearchBy').val('Enter Search Source').addClass('watermark');
            $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
        } else if ($('#drp_SearchBy').val() == 'Refer') {
            $('#txt_SearchBy').val('Enter Referral Source').addClass('watermark');
            $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
        } else if ($('#drp_SearchBy').val() == 'Social') {
            $('#txt_SearchBy').val('Enter Social Source').addClass('watermark');
            $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
        } else if ($('#drp_SearchBy').val() == 'View' || $('#drp_SearchBy').val() == 'Cart' || $('#drp_SearchBy').val() == 'Purchase') {
            $('#txt_SearchBy').val('Search Product').addClass('watermark');
            $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
        }
        var oo = $('#drp_SearchBy').val();
        $('#txt_SearchBy').autocomplete({
            minLength: 1,
            source: function (request, response) {
                $.ajax({
                    url: "/Analytics/Audience/AutoSuggest",
                    data: "{ 'accountId':'" + $("#hdn_AccountId").val() + "','type':'" + oo + "','q': '" + request.term + "', 'limit': '100' }",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    //dataFilter: function (data) { return data.Table; },
                    success: function (data) {
                        if (data.Table.length === 0) {
                            response({ label: 'No matches found' });
                        }
                        else {
                            response($.map(data.Table, function (item) {
                                if ($("#drp_SearchBy").val() == 'View' || $("#drp_SearchBy").val() == 'Cart' || $("#drp_SearchBy").val() == 'Purchase') {
                                    return {
                                        label: item.Value,
                                        value: item.label + ""
                                    }
                                }
                                else {
                                    return {
                                        label: item.Value,
                                        value: item.Value + ""
                                    }
                                }
                            }))
                        }
                    },
                    error: function (xmlHttpRequest) {
                        //alert(xmlHttpRequest.responseText);
                    }
                });
            },
            select: function (event, ui) {
                $("#hdn_ProductId").val(ui.item.value);
                event.preventDefault();
                $(this).val(ui.item.label);
            },
            focus: function () {
                return false;
            },
        });
    } else {
        $("#div_SearchBy").css("width", "353px");
        $("#txt_SearchBy").hide();
    }
});
///SearchBy OnChange
function SearchByOnchange() {
    $("#dvLoading").css("display", "block");
    if ($('#drp_SearchBy').val() != "All") {
        $("#txt_SearchBy").show();
        $("#txt_SearchBy").prop("disabled", false);
        $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
        if ($('#drp_SearchBy').val() == 'VisitorIP' || $('#drp_SearchBy').val() == 'Email' || $('#drp_SearchBy').val() == 'Contact' || $('#drp_SearchBy').val() == 'PhoneNumber' || $('#drp_SearchBy').val() == 'Device') {
            if ($('#txt_SearchBy').val() == '')
                $('#txt_SearchBy').val('All').addClass('watermark');
            $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
        } else if ($('#drp_SearchBy').val() == 'City') {
            if ($('#txt_SearchBy').val() == '')
                $('#txt_SearchBy').val('Search City').addClass('watermark');
            $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
        }
            //else if ($('#drp_SearchBy').val() == 'Device') {
            //    if ($('#txt_SearchBy').val() == '')
            //        $('#txt_SearchBy').val('Search Device').addClass('watermark');
            //    $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
            //}
        else if ($('#drp_SearchBy').val() == 'Page') {
            if ($('#txt_SearchBy').val() == '')
                $('#txt_SearchBy').val('Search Page').addClass('watermark');
            $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
        } else if ($('#drp_SearchBy').val() == 'Recency') {
            if ($('#txt_SearchBy').val() == '')
                $('#txt_SearchBy').val('Enter Days').addClass('watermark');
            $('#txt_SearchBy').attr("onkeypress", "javascript:return isNumber(event)");
        } else if ($('#drp_SearchBy').val() == 'Frequency') {
            if ($('#txt_SearchBy').val() == '')
                $('#txt_SearchBy').val('Enter Visits').addClass('watermark');
            $('#txt_SearchBy').attr("onkeypress", "javascript:return isNumber(event)");
        } else if ($('#drp_SearchBy').val() == 'Score') {
            if ($('#txt_SearchBy').val() == '')
                $('#txt_SearchBy').val('Enter Score').addClass('watermark');
            $('#txt_SearchBy').attr("onkeypress", "javascript:return isNumber(event)");
        } else if ($('#drp_SearchBy').val() == 'New' || $('#drp_SearchBy').val() == 'Single' || $('#drp_SearchBy').val() == 'Repeat' || $('#drp_SearchBy').val() == 'Returning' || $('#drp_SearchBy').val() == 'Direct' || $('#drp_SearchBy').val() == 'EmailSource' || $('#drp_SearchBy').val() == 'Sms') {
            if ($('#txt_SearchBy').val() == '')
                $("#txt_SearchBy").prop("disabled", true); $('#txt_SearchBy').val('All').addClass('watermark');
            $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
        } else if ($('#drp_SearchBy').val() == 'Search') {
            if ($('#txt_SearchBy').val() == '')
                $('#txt_SearchBy').val('Enter Search Source').addClass('watermark');
            $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
        } else if ($('#drp_SearchBy').val() == 'Refer') {
            if ($('#txt_SearchBy').val() == '')
                $('#txt_SearchBy').val('Enter Referral Source').addClass('watermark');
            $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
        } else if ($('#drp_SearchBy').val() == 'Social') {
            if ($('#txt_SearchBy').val() == '')
                $('#txt_SearchBy').val('Enter Social Source').addClass('watermark');
            $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
        } else if ($('#drp_SearchBy').val() == 'View' || $('#drp_SearchBy').val() == 'Cart' || $('#drp_SearchBy').val() == 'Purchase') {
            if ($('#txt_SearchBy').val() == '')
                $('#txt_SearchBy').val('Search Product').addClass('watermark');
            $('#txt_SearchBy').removeAttr("onkeypress", "javascript:return isNumber(event)");
        }
    } else {
        $("#txt_SearchBy").hide();
    }
}
///On Change Records Per Page
function fn_ChangeRecordsPerPage() {
    Pagerefresh = 0; SearchClick = 0; arSingle = []; incr = 0;
    if (incr == 0) {
        incr = $(".Refreshed").length;
        for (var m = 0; ($("#dvReport > div").length - 1) > m; m++)
            if ($("#img_" + m).attr('src').indexOf("RefreshScore1_Green.png") > -1)
                arSingle.push(m);
        //if (arSingle.length == incr)
           /// m = $("#dvReport > div").length;
    }
    $("#dvLoading").css("display", "block");
    // var recordsperpage;
    if ($('#drp_RecordsPerPage').val() == 'All' || AllData == 1) {
        $("#hdn_End").val(parseInt($("#hdn_Total").val()));
        //recordsperpage = parseInt($("#hdn_End").val());
    }
    else {
        $("#hdn_End").val($("#drp_RecordsPerPage").val());
        // recordsperpage = $("#drp_RecordsPerPage").val();
    }
    var drpSearchBy = $("#drp_SearchBy").val();
    $("#hdn_Start").val(1);
    //$("#hdn_End").val(recordsperpage);

    if (drpSearchBy == 'All')
        AllReports(parseInt($("#hdn_duration").val()), 1);
    else
        fn_SearchByOnclick(1);
}
///View More
function fn_ViewMoreOnClick() {
    Pagerefresh = 0; SearchClick = 0; arSingle = []; incr = 0;
    if (incr == 0) {
        incr = $(".Refreshed").length;
        for (var m = 0; ($("#dvReport > div").length - 1) > m; m++)
            if ($("#img_" + m).attr('src').indexOf("RefreshScore1_Green.png") > -1)
                arSingle.push(m);
       // if (arSingle.length == incr)
          //  m = $("#dvReport > div").length;
    }
    $("#dvLoading").css("display", "block");
    $("#hdn_ViewMore").val(1);
    var drpSearchBy = $("#drp_SearchBy").val();
    var start = parseInt(parseInt($("#hdn_Start").val()) + parseInt($("#drp_RecordsPerPage").val()));
    var end = parseInt(start + parseInt($("#drp_RecordsPerPage").val()) - 1);
    $("#hdn_Start").val(start);
    $("#hdn_End").val(end);
    $("#hdn_count").val(start - 1);
    if (drpSearchBy == 'All')
        AllReports(parseInt($("#hdn_duration").val()));
    else
        fn_SearchByOnclick();
}
// duration changing
$("#btn1").click(function () {
    Pagerefresh = 1;
});
$("#btn2").click(function () {
    Pagerefresh = 1;
});
$("#btn3").click(function () {
    Pagerefresh = 1;
});
$("#btn4").click(function () {
    Pagerefresh = 1;
});
///Search Go
$("#btn_SearchBy").click(function () {
    SearchClick = 1;
});
//New Code for Exporting data
$("#drp_ExportOption").change(function () {
    $("#dv_SelectedData").hide();
    $("#txt_start").val(1);
    $("#txt_end").val(20);
    if (this.value == "0")
        return false;
    else {
        $("#dvLoading").show();
        if (this.value == "1") {
            LoadedData = 1;
            $("#hdn_Start").val(1);
            //P5ExportData("#btnExportNew");
            //$("#dvLoading").hide();
            $("#hdn_End").val($("#dvReport > div").length - 1);
            $("#dvExport").html('');
            Report(parseInt($("#hdn_duration").val()));
            ExportCall();
        }
        else if (this.value == "2") {
            $("#dvExport").html('');
            //$('#drp_RecordsPerPage').val("All");
            AllData = 1;
            fn_ChangeRecordsPerPage();
            ExportCall();
        }
        else if (this.value == "3") {
            $("#dvExport").html('');
            exportkey = 1;
            Report(parseInt($("#hdn_duration").val()));
            ExportCall();
        }
        else if (this.value == "4") {
            $("#dv_SelectedData").show();
            ExportDrpDwn = 1;
            range = 1;
            rangeandScoreUpdate = 1;
            $("#dvExport").html('');
            $("#dvLoading").hide();
        }
    }
});
function ImportData() {
    if ($("#txt_start").val() != '' && $("#txt_end").val() != '') {
        if (parseInt($("#txt_start").val()) <= 0) {
            ShowErrorMessage('Please enter valid input!');
            $("#txt_start").focus();
            return false;
        }
        else if (parseInt($("#txt_start").val()) > parseInt($("#txt_end").val())) {
            ShowErrorMessage('Please enter valid range!');
            $("#txt_end").focus();
            return false;
        } else {
            var dif = parseInt($("#txt_end").val()) - parseInt($("#txt_start").val())
            if (dif > 5000) {
                ShowErrorMessage('Please select count of range up to 5000!');
                $("#txt_end").focus();
                return false;
            }
        }
    }
    else {
        $("#dvLoading").hide();
        if ($("#txt_start").val() == '')
            ShowErrorMessage('Please enter minimum value!');
        else if ($("#txt_end").val() == '')
            ShowErrorMessage('Please enter maximum value!');
        return false;
    }
    $("#hdn_Start").val($("#txt_start").val());
    $("#hdn_End").val($("#txt_end").val());
    Report(parseInt($("#hdn_duration").val()));
    ExportCall();
}
function ExportCall() {
    try {
        if ($("#dvExport").html().length > 0) {
            P5ExportCall();
            $("#dvLoading").hide();
        } else {
            window.setTimeout(ExportCall, 100);
        }
    } catch (error) {
    }
}
//// excel import
$(document).ready(function () {
    $('#dv_PntExp').click(function (event) {
        event.stopPropagation();
    });
});
$(document).click(function (e) {
    var targetbox = $('#dvexport_option'); var targetbox2 = $('#dvexport_txtorxlx');
    if (!targetbox.is(e.target) && targetbox.has(e.target).length === 0 && !targetbox2.is(e.target) && targetbox2.has(e.target).length === 0) {
        $('#dvexport_option').hide('slow');
        $("#dv_SelectedData").hide();
        $("#dvexport_txtorxlx").hide('slow');
    }
});
//// for add group div hiding
$(document).ready(function () {
    $('#lnkFilter').click(function () {
        $('#tbleditscore').hide('slow');
    });
    $('#lnkFilter').click(function () {
        $('#dv_shareContent').hide('slow');
    });
    $('#dv_Share').click(function () {
        $('#tbleditscore').hide('slow');
    });
    $('#Button1').click(function () {
        $('#dv_shareContent').hide('slow');
    });
});