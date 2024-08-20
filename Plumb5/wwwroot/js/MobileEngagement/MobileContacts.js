//dvCustomFilter.innerHTML = getCustomFilter();
//dvDatetoYear.innerHTML = getDefaultDuration();
$("#dvPrintExport").append(getPrintExport('Mobile Visitors', 0, 0, 1));
$("#btnExport").attr("id", "btnExportNew");
var keyval = 0, keyval1 = 0, ExportDrpDwn = 0, LoadedData = 0;
var name = "", action = "", GroupId = 0, fromdate = "", todate = "";
////
$(document).ready(function () {
    GroupId = $.urlParam("GroupId");
    if (GroupId != "" || GroupId != 0) {
        GroupId = GroupId;
        action = "GetGrpContacts";
    }
    else {
        GroupId = 0;
        action = "GetContacts";
    }
    AllReports(2);
});
function AllReports(duration) {
    $("#hdn_Duration").val(duration);
    $("#dvCustomFilter").css("display", "none");
    $("#dvLoading").css("display", "block");
    //var getFilter = GetDateTimeRange(duration);
    //if (FromDateTime.indexOf("null") == -1 || FromDateTime.indexOf("undefined") == -1)
    //    fromdate = FromDateTime.replace(/undefined/g, "00");
    //if (ToDateTime.indexOf("null") == -1 || ToDateTime.indexOf("undefined") == -1)
    //    todate = ToDateTime.replace("undefined", "23").replace("undefined", "59");

    if ($("#hdn_ViewMore").val() == "0" && ExportDrpDwn == 0 && LoadedData == 0) {
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
    var inputs = { Action: action, Id: 0, fromdate: fromdate, todate: todate, start: parseInt($("#hdn_Start").val()), end: parseInt($("#hdn_End").val()), groupId: GroupId };
    $.ajax({
        url: "../MobileEngagement/GetVisitors",
        type: 'Post',
        data: JSON.stringify({ 'inputs': inputs }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if ($('#drp_RecordsPerPage').val() == 'All' && keyval > 0) {
                $.each(response.Table1, function () {
                    $("#hdn_End").val(this.TotalRows);
                });
            }
            else {
                if (response.Table.length > 0) {
                    BindReport(response);
                }
                else if ($("#hdn_ViewMore").val() == "1") {
                    $("#dvLoading").css("display", "none");
                }
                else {
                    $("#dvDefault").css("display", "block");
                    $("#dvLoading").css("display", "none"); $("#divcontent").css("display", "none"); $("#dvPrintExport").css("display", "none");
                }
            }
        },
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }
    });
}

///Search By Go Button
fn_SearchByOnclick = function () {
    $("#dvLoading").css("display", "block");
    duration = $("#hdn_Duration").val();
    //var getFilter = GetDateTimeRange(parseInt(duration));
    //if (FromDateTime.indexOf("null") == -1 || FromDateTime.indexOf("undefined") == -1)
    //    fromdate = FromDateTime.replace(/undefined/g, "00");
    //if (ToDateTime.indexOf("null") == -1 || ToDateTime.indexOf("undefined") == -1)
    //    todate = ToDateTime.replace("undefined", "23").replace("undefined", "59");
    $(".button").attr("class", "button1");
    $("#btn" + duration).attr("class", "button");

    if ($("#hdn_ViewMore").val() == "0") {
        $("#hdn_Start").val(1);
        if ($("#drp_RecordsPerPage").val() == 'All' && keyval1 == 0) {//Day/Week/Month/Year Click with All Records
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
    drpSearch = $("#drp_SearchBy").val();
    txtSearch = $('#txt_SearchBy').val();
    if ($("#drp_SearchBy").val() == "All" || $("#txt_SearchBy").val() == "Search Name" || $("#txt_SearchBy").val() == "Search Email" || $("#txt_SearchBy").val() == "Enter Phone Number" || $("#txt_SearchBy").val() == "Enter Device Name" || $("#txt_SearchBy").val() == "Enter DeviceId" || $("#txt_SearchBy").val() == "Enter StoreId") {
        drpSearch = "All";
        txtSearch = "All";
    }
    else if ($("#txt_SearchBy").val() == "Search Name" || $("#txt_SearchBy").val() == "Search Email" || $("#txt_SearchBy").val() == "Enter Phone Number" || $("#txt_SearchBy").val() == "Enter Device Name" || $("#txt_SearchBy").val() == "Enter DeviceId" || $("#txt_SearchBy").val() == "Enter StoreId") {
        txtSearch = "All";
    }
    var inputs2 = { Action: action, Id: 0, fromdate: fromdate, todate: todate, start: parseInt($("#hdn_Start").val()), end: parseInt($("#hdn_End").val()), Type: drpSearch, SearchBy: txtSearch, groupId: GroupId };
    $.ajax({
        type: "POST",
        url: "../MobileEngagement/GetVisitors",
        data: JSON.stringify({ 'inputs': inputs2 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table.length > 0) {
                $("#dvDefault").css("display", "none");
                $("#divcontent").css("display", "block");
                BindReport(response, duration);
            } else {
                //$("#div_Searchboxes").css("display", "none");
                $("#dvDefault").css("display", "block"); $("#dvLoading").css("display", "none"); $("#divcontent").css("display", "none");
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
};

//// Binding
function BindReport(response) {
    $("#dvExportOthers").css("display", "block");
    //$("#txt_SearchBy").css("display", "block");
    $("#dvDefault").css("display", "none");
    $("#divcontent").css("display", "block");
    $("#dvPrintExport").css("display", "block");
    $("#dv_PntExp").css("position", "absolute");
    $("#dv_PntExp").css("margin-left", "160px");
    $("#dvReport").show();
    var innerDivhtml = "";
    tabletd = "<tr style='font-weight: bold;'><td>Visitor</td><td>Name</td><td>DeviceName</td><td>OS & Version</td><td>EmailId</td><td>Phone Number</td><td>Group Name</td><td>Date</td></tr>";
    //Reports
    if (ExportDrpDwn == 1) {
        $.each(response.Table, function () {
            var email = (this.Conatct == 'null' || this.Conatct == null ? '' : (this.Conatct.toString().indexOf("~") > -1 ? this.Conatct.toString().split("~")[1] : this.Conatct));
            var contactId = (this.Conatct == 'null' || this.Conatct == null ? '' : (this.Conatct.toString().indexOf("~") > -1 ? this.Conatct.toString().split("~")[0] : ''));
            tabletd += "<tr><td>" + (this.Name == null ? "NA" : this.Name) + "</td><td>" + this.DeviceId + "</td><td>" + this.DeviceName + " (" + (this.Manufacturer == null ? "NA" : this.Manufacturer) + ")</td><td>" + (this.OS == null ? "NA" : this.OS) + " (" + (this.OsVersion == null ? "NA" : this.OsVersion) + ")</td><td>" + (email == "" ? "NA" : email) + "</td><td>" + (this.Phone == "" ? "NA" : this.Phone) + "</td><td>" + this.GroupName + "</td><td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObjNew(this.Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObjNew(this.Date)) + "</td></tr>";
        });
        $('#dvExport').html('<table><tbody>' + tabletd + '</tbody></table>');
        ExportDrpDwn = 0;
        $("#dv_SelectedData").hide();
        $("#dvexport_option").hide('slow');
        $("#hdn_Start").val(1);
        $("#hdn_End").val($("#dvReport > div").length - 1);
        ExportCall();
    }
    else {
        var TtlGrpName = "";
        $.each(response.Table, function () {
            TtlGrpName = this.GroupName;
            var email = (this.Conatct == 'null' || this.Conatct == null ? '' : (this.Conatct.toString().indexOf("~") > -1 ? this.Conatct.toString().split("~")[1] : this.Conatct));
            var contactId = (this.Conatct == 'null' || this.Conatct == null ? '' : (this.Conatct.toString().indexOf("~") > -1 ? this.Conatct.toString().split("~")[0] : ''));
            tabletd += "<tr><td>" + (this.Visitor == null ? this.DeviceId : this.Visitor) + "</td><td>" + (this.Name == null ? "NA" : this.Name) + "</td><td>" + this.DeviceName + " (" + (this.Manufacturer == null ? "NA" : this.Manufacturer) + ")</td><td>" + (this.OS == null ? "NA" : this.OS) + " (" + (this.OsVersion == null ? "NA" : this.OsVersion) + ")</td><td>" + (email == "" ? "NA" : email) + "</td><td>" + (this.Phone == "" ? "NA" : this.Phone) + "</td><td>" + this.GroupName + "</td><td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObjNew(this.Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObjNew(this.Date)) + "</td></tr>";
            innerDivhtml += "<div id=" + this.Id + " style='text-align: left;' class='itemStyle'>" +
                "<div style='float: left; width: 17%;'>" +
                "<input type='checkbox' id='chk_AddToGrp' name='chk_AddToGrp' value='" + this.Id + "%" + contactId + "%" + this.DeviceId + "' class='chk' style='left: -4px; position: relative;top: 10%;'>" +
                "<a href='javascript:void(0)' id='lnkCustomer" + this.DeviceId + "' OnClick=ContactInfo('','" + contactId + "','" + this.DeviceId + "');>" + this.Loyalty + "&nbsp;" + this.DeviceId + "</a></div>" +
                "<div title='" + ((this.Name == null || this.Name == "") ? "NA" : this.Name) + "' style='float: left; width: 13%;'>" +
                ((this.Name == null || this.Name == "" || this.Name == " ") ? "NA" : this.Name) + "</div>" +
                //"<a href='javascript:void(0);' onclick='VisitorsExpand(" + this.Id + ",&#39;" + this.DeviceId + "&#39;);'><img class='expandCollapseImg ExpandImage' id='ui_img" + this.Id + "' src='/images/expand.jpg' title='expand' style='height: 13px; width: 13px; bottom: -2px;'> " + (this.Name == null ? "NA" : this.Name) + " </a></div>" +
                "<div style='float: left; width: 20%;' title='" + (this.DeviceName) + " - " + (this.Manufacturer == null ? "NA" : this.Manufacturer) + "(" + (this.OS == null ? "NA" : this.OS) + (this.OsVersion == null ? "NA" : this.OsVersion) + ")'>" +
                (this.DeviceName) + " - " + (this.Manufacturer == null ? "NA" : this.Manufacturer) + "(" + (this.OS == null ? "NA" : this.OS) + (this.OsVersion == null ? "NA" : this.OsVersion) + ")</div>" +
                "<div title='" + email + "' style='float: left; width: 16%;'>" +
                (email == "" ? "NA" : email) + "</div>" +
                "<div title='" + this.Phone + "' style='float: left; width: 8%;'>" +
                (this.Phone == "" ? "NA" : this.Phone) + "</div>" +
                "<div title='" + this.GroupName + "' id='ui_txtGrp" + this.Id + "' style='float: left; width: 9%;'>" +
                "<div id='ui_Grp" + this.Id + "' class='contactMoreGroup' style='display:none;margin-left: -4.5%; margin-top: 1%; padding: 10px 15px;'></div>" +
                (this.GroupName == "NA" ? this.GroupName : ("<img src='/images/Arrow.png' title='See all the groups' style='cursor:pointer;' onclick=GetGroupName(" + this.Id + ",'" + this.DeviceId + "');>&nbsp&nbsp" + this.GroupName + "")) + "</div>" +
                "<div style='float:right; text-align:right; width: 17%;'>" +
                $.datepicker.formatDate("M dd yy", GetJavaScriptDateObjNew(this.Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObjNew(this.Date)) + "</div></div>"; //+
            //"<div id='Sub_dv" + this.Id + "' style='display: none; border-bottom: 1px solid #CFCFCF;'></div>";
        });
        if (GroupId != 0) {
            $(".title").html("Visitors (" + TtlGrpName + ")");
        }
        LoadedData = 0;
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
                "<div style='float: left; width: 17%;'><input type='checkbox' id='chk_SelectAll' name='chk_AddToGroup' class='chk' style='left: -4px;' onclick='fn_SelectAll()'>&nbsp;Visitor</div>" +
                "<div style='float: left; width: 13%;'>" +
                "Name</div>" +
                "<div style='float: left; width: 20%;'>" +
                "Device Name & OS</div>" +
                "<div style='float: left; width: 16%;'>" +
                "Email Id</div>" +
                "<div style='float: left; width: 8%;'>" +
                "Phone No</div>" +
                "<div style='float: left; width: 9%;'>" +
                "Group Name</div>" +
                "<div style='float: right; text-align:right; width: 17%'>" +
                "Date</div>" +
                "</div>" + innerDivhtml;
        }
    }
    $("#dv_Group").hide();
    $("#dvLoading").css("display", "none");
}

///Intermediate fn for Search By filter or not checking
function Report(duration) {
    $("#hdn_Duration").val(duration);
    var drpSearchBy = $("#drp_SearchBy").val();
    if (drpSearchBy == 'All' && $("#drp_RecordsPerPage").val() != "All")
        AllReports(duration);
    else
        fn_SearchByOnclick();
}

////
function GetGroupName(id, deviceId) {
    $(".contactMoreGroup").hide();
    if ($("#ui_Grp" + id).html().length == 0) {
        BindGrpNames(id, deviceId);
    }
    $("#ui_Grp" + id).toggle();
}
function BindGrpNames(id, deviceId) {
    $("#ui_Grp" + id).empty();
    var inputs4 = { Action: 'GrpName', deviceId: deviceId };
    $.ajax({
        url: "../MobileEngagement/GetVisitors",
        type: 'Post',
        data: JSON.stringify({ 'inputs': inputs4 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table.length > 0) {
                var tbl = "";
                $.each(response.Table, function () {
                    tbl += "<div id='" + this.Id + "'>" + this.GroupName + "</div>";
                });
                var tbl2 = "<label style='position: absolute;top: -1px;right: 6px;cursor: pointer;font-weight: bold;font-family: Source Sans Pro, sans-serif;' onclick='CloseGrp(" + id + ");'>x</label>" + tbl;
                $("#ui_Grp" + id).append(tbl2);
                $("#ui_Grp" + id).show();
            }
        }
    });
}
///
function CloseGrp(id) {
    $("#ui_Grp" + id).hide('slow');
}
//// sub div
function VisitorsExpand(Id, FormId, DeviceId, SessionId) {
    if (document.getElementById("Sub_dv" + Id).style.display == "block") {
        document.getElementById("ui_img" + Id).src = "/images/expand.jpg";
        document.getElementById("Sub_dv" + Id).style.display = "none";
        document.getElementById('ui_img' + Id).style.bottom = "-2px";
    }
    else {
        if ($("#Sub_dv" + Id).html().length == 0) {
            SubDivData(Id, FormId, DeviceId, SessionId);
        }
        document.getElementById('ui_img' + Id).src = "/images/collapse.jpg";
        document.getElementById("Sub_dv" + Id).style.display = "block";
        document.getElementById('ui_img' + Id).style.bottom = "-2px";
    }
}
function SubDivData(Id, FormId, DeviceId, SessionId) {
    var tdelement = "";
    var inputs2 = { Action: 'ParticularContact', Id: FormId, deviceId: DeviceId, sessionId: SessionId };
    $.ajax({
        url: "../MobileEngagement/GetVisitors",
        type: 'Post',
        data: JSON.stringify({ 'inputs': inputs2 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table.length > 0) {
                $.each(response.Table, function () {
                    tdelement += "<div class='SubDiv' style='background-color: #FFFF;'><div style='float:left;width:20%;'>" + this.FieldName + "</div><div style='float:left;width: auto;'>: &nbsp;&nbsp;" + this.FieldValue + "</div></div>";
                });
                $("#Sub_dv" + Id).append(tdelement);
            }
            else {
                $("#Sub_dv" + Id).append("No response data!");
                $("#Sub_dv" + Id).addClass("itemStyle");
            }
        }
    });
}
//View More
function fn_ViewMoreOnClick() {
    $("#dvLoading").css("display", "block");
    $("#hdn_ViewMore").val(1);
    $("#hdn_End").val(parseInt($("#hdn_End").val()) + parseInt($("#drp_RecordsPerPage").val()));
    $("#hdn_Start").val(parseInt($("#hdn_Start").val()) + parseInt($("#drp_RecordsPerPage").val()));
    Report(parseInt($("#hdn_Duration").val()));
}
//On Change Records Per Page
function fn_ChangeRecordsPerPage() {
    $("#dvLoading").css("display", "block");
    if ($('#drp_RecordsPerPage').val() == 'All')
        $("#hdn_End").val(parseInt($("#hdn_Total").val()));
    else
        $("#hdn_End").val($("#drp_RecordsPerPage").val());
    $("#hdn_Start").val(1);
    Report(parseInt($("#hdn_Duration").val()));
}
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
            $("#hdn_End").val($("#dvReport > div").length - 1);
            $("#dvExport").html('');
            Report(parseInt($("#hdn_Duration").val()));
            ExportCall();
        }
        else if (this.value == "4") {
            $("#dv_SelectedData").show();
            ExportDrpDwn = 1;
            $("#dvExport").html('');
            $("#dvLoading").hide();
        }
    }
});
function ImportData() {
    var drpSearchBy = $("#drp_SearchBy").val();
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
    $("#hdn_Start").val($("#txt_start").val());
    $("#hdn_End").val($("#txt_end").val());
    Report(parseInt($("#hdn_Duration").val()));
}
//// excel import hiding
$(document).ready(function () {
    $('#dv_PntExp').click(function (event) {
        event.stopPropagation();
    });
});
$(document).click(function (e) {
    var targetbox = $('#dvexport_option');
    if (!targetbox.is(e.target) && targetbox.has(e.target).length === 0) {
        $('#dvexport_option').hide('slow');
        $("#dv_SelectedData").hide();
    }
});
function ExportCall() {
    try {
        if ($("#dvExport").html().length > 0) {
            P5ExportData("#btnExportNew");
            $("#dvLoading").hide();
        } else {
            window.setTimeout(ExportCall, 100);
        }
    } catch (error) {
    }
}
//// Onchanging
function ChangeAction(val) {
    if (val.value == "1") {
        $("#dv_Group").show();
        $("#lbl_title").html('Add to group');
        $("#btnGrp").val('ADD');
    } else if (val.value == "2") {
        $("#dv_Group").show();
        $("#lbl_title").html('Remove from group');
        $("#btnGrp").val('REMOVE');
    } else {

    }
}
////
function fn_toggleControl2(flag) {
    $('#dv_Group').toggle('slow')
    if (flag == 0) {
        $("#btnGrp").attr("onclick", "javascript:fn_toggleControl2(1);");
        $("#dv_Group").hide();
    }
    else {
        setTimeout(function () { $("#div_AddGroup").show() }, 800);
        $("#btnGrp").attr("onclick", "javascript:fn_toggleControl2(0);");
    }
}
// Filter
///Search By WaterMark
$(document).ready(function () {
    if ($('#drp_SearchBy').val() == 'Name') {
        if ($('#txt_SearchBy').val() == 'All' || $('#txt_SearchBy').val() == '')
            $('#txt_SearchBy').val('Search Name').addClass('watermark');
    }
    else if ($('#drp_SearchBy').val() == 'Emailid' || $('#drp_SearchBy').val() == 'Member') {
        if ($('#txt_SearchBy').val() == '')
            $('#txt_SearchBy').val('All').addClass('watermark');
    }
    else if ($('#drp_SearchBy').val() == 'Phone') {
        if ($('#txt_SearchBy').val() == 'All' || $('#txt_SearchBy').val() == '')
            $('#txt_SearchBy').val('Enter Phone Number').addClass('watermark');
    }
    else if ($('#drp_SearchBy').val() == 'Device') {
        if ($('#txt_SearchBy').val() == 'All' || $('#txt_SearchBy').val() == '')
            $('#txt_SearchBy').val('Enter Device Name').addClass('watermark');
    }
    else if ($('#drp_SearchBy').val() == 'DeviceId') {
        if ($('#txt_SearchBy').val() == 'All' || $('#txt_SearchBy').val() == '')
            $('#txt_SearchBy').val('Enter DeviceId').addClass('watermark');
    }
    else if ($('#drp_SearchBy').val() == 'StoreId') {
        if ($('#txt_SearchBy').val() == 'All' || $('#txt_SearchBy').val() == '')
            $('#txt_SearchBy').val('Enter StoreId').addClass('watermark');
    }
    else if ($('#txt_SearchBy').val() == '') {
        $('#txt_SearchBy').val('All').addClass('watermark');
    }
});
///Search By Focus
$('#txt_SearchBy').focus(function () {
    if ($(this).val() == 'All' || $(this).val() == 'Search Email' || $(this).val() == 'Search Name' || $(this).val() == 'Enter Phone Number' || $(this).val() == 'Enter Device Name' || $(this).val() == 'Enter DeviceId' || $(this).val() == "Enter StoreId") {
        $(this).val('').removeClass('watermark');
    }
});
///Search By Blur
$('#txt_SearchBy').blur(function () {
    if ($(this).val() == '') {
        if ($('#drp_SearchBy').val() == 'Name') {
            $(this).val('Search Name').addClass('watermark');
        }
        else if ($('#drp_SearchBy').val() == 'Emailid' || $('#drp_SearchBy').val() == 'Member') {
            $(this).val('All').addClass('watermark');
        }
        else if ($('#drp_SearchBy').val() == 'Phone') {
            $(this).val('Enter Phone Number').addClass('watermark');
        }
        else if ($('#drp_SearchBy').val() == 'Device') {
            $(this).val('Enter Device Name').addClass('watermark');
        }
        else if ($('#drp_SearchBy').val() == 'DeviceId') {
            $(this).val('Enter DeviceId').addClass('watermark');
        }
        else if ($('#drp_SearchBy').val() == 'StoreId') {
            $(this).val('Enter StoreId').addClass('watermark');
        }
        else {
            $(this).val('All').addClass('watermark');
        }
    }
});
///Search By Watermark
$("#drp_SearchBy").change(function () {
    $("#txt_SearchBy").show();
    $("#div_Searchboxes").css("width", "345px");
    if ($('#drp_SearchBy').val() != "All") {
        if ($('#drp_SearchBy').val() == 'Name') {
            $('#txt_SearchBy').val('Search Name').addClass('watermark');
        }
        else if ($('#drp_SearchBy').val() == 'Emailid' || $('#drp_SearchBy').val() == 'Member') {
            $('#txt_SearchBy').val('All').addClass('watermark');
        }
        else if ($('#drp_SearchBy').val() == 'Phone') {
            $('#txt_SearchBy').val('Enter Phone Number').addClass('watermark');
        }
        else if ($('#drp_SearchBy').val() == 'Device') {
            $('#txt_SearchBy').val('Enter Device Name').addClass('watermark');
        }
        else if ($('#drp_SearchBy').val() == 'DeviceId') {
            $('#txt_SearchBy').val('Enter DeviceId').addClass('watermark');
        }
        else if ($('#drp_SearchBy').val() == 'StoreId') {
            $('#txt_SearchBy').val('Enter StoreId').addClass('watermark');
        }
        /// Auto Suggest
        $('#txt_SearchBy').autocomplete({
            minLength: 1,
            source: function (request, response) {
                window.stop();
                $.ajax({
                    url: "GetAutosuggest",
                    data: "{ 'type': 'Visitors', 'action':'" + $('#drp_SearchBy').val() + "','q': '" + request.term + "'}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        if (data.Table.length === 0) {
                            response({ label: 'No matches found' });
                        }
                        else {
                            response($.map(data.Table, function (item) {
                                return {
                                    label: item.label.toString().trim(),
                                    value: item.Value + ""
                                }
                            }));
                        }
                    },
                    error: function (xmlHttpRequest) {
                        //alert(xmlHttpRequest.responseText);
                    }
                });
            },
            select: function (event, ui) {
                event.preventDefault();
                $(this).val(ui.item.label);
            },
            focus: function () {
                return false;
            },
        });
    } else {
        $("#div_Searchboxes").css("width", "180px");
        $("#txt_SearchBy").hide();
    }
});
///SearchBy OnChange
function SearchByOnchange() {
    $("#dvLoading").css("display", "block");
    if ($('#drp_SearchBy').val() != "All") {
        $("#txt_SearchBy").show();
        if ($('#drp_SearchBy').val() == 'Name') {
            if ($('#txt_SearchBy').val() == '')
                $('#txt_SearchBy').val('Search Name').addClass('watermark');
        }
        else if ($('#drp_SearchBy').val() == 'Emailid' || $('#drp_SearchBy').val() == 'Member') {
            if ($('#txt_SearchBy').val() == '')
                $('#txt_SearchBy').val('All').addClass('watermark');
        }
        else if ($('#drp_SearchBy').val() == 'Phone') {
            if ($('#txt_SearchBy').val() == '')
                $('#txt_SearchBy').val('Enter Phone Number').addClass('watermark');
        }
        else if ($('#drp_SearchBy').val() == 'Device') {
            if ($('#txt_SearchBy').val() == '')
                $('#txt_SearchBy').val('Enter Device Name').addClass('watermark');
        }
        else if ($('#drp_SearchBy').val() == 'DeviceId') {
            if ($('#txt_SearchBy').val() == '')
                $('#txt_SearchBy').val('Enter DeviceId').addClass('watermark');
        }
        else if ($('#drp_SearchBy').val() == 'StoreId') {
            if ($('#txt_SearchBy').val() == '')
                $('#txt_SearchBy').val('Enter StoreId').addClass('watermark');
        }
    }
    else {
        $("#txt_SearchBy").hide();
    }
}
/////
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
var chkArrayId = []; var chkArrayDevice = [];
/// saving and removing Groups
$("#btnGrp").click(function () {
    chkArrayId = []; chkArrayDevice = [];
    var action = "";
    if ($("#drp_AddToGroup").val() == 'None') {
        ShowErrorMessage("Please select the group");
        return;
    }
    var chkArrayContactId = new Array();
    $(document).ready(function () {
        $("input:checkbox:checked").each(function () {
            if (this.id != "chk_SelectAll") {
                chkArrayId.push($(this).val().split('%')[0]);
                chkArrayContactId.push($(this).val().split('%')[1]);
                chkArrayDevice.push($(this).val().split('%')[2]);
            }
        });
    });
    if ($("#btnGrp").val() == "ADD")
        action = 'ContactAddToGroup';
    else if ($("#btnGrp").val() == "REMOVE")
        action = 'RemoveFromGrp';

    //var inputs3 = { action: ''};
    if (chkArrayDevice != undefined && chkArrayDevice.length > 0) {
        if ($('#drp_AddToGroup').val() != 100000) {
            $("#dvLoading").css("display", "block");
            $.ajax({
                type: "POST",
                url: "../MobileEngagement/MobileContactsAddToGroup",
                data: "{'action':'" + action + "','contact':'" + chkArrayContactId + "','device':'" + chkArrayDevice + "','groupId':'" + $('#drp_AddToGroup').val() + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) { //OnSuccessMachine,
                    addinbox(response);
                },
                failure: function (response) {
                    //alert(response.d+"abcd");
                },
                error: function (response) {
                    //alert(response.d+"efgh");
                }
            });
        } else {
            ShowErrorMessage("Please select any group from the dropdownlist");
        }
    } else {
        if ($("#btnGrp").val() == "ADD")
            ShowErrorMessage("Please select the visitors to add");
        else if ($("#btnGrp").val() == "REMOVE")
            ShowErrorMessage("Please select the visitors to remove");
        else
            ShowErrorMessage("Please select the visitors");
    }
});
function addinbox(response) {
    $.each(response.Table, function () {
        if (this.Id == "-1") {
            $("#dvLoading").css("display", "none");
            ShowErrorMessage("Please select the group that contains this visitor!");
            return false;
        }
        else if (this.Id == "-2") {
            BindAddedGrps(chkArrayId, this.Name, 'removed');
            $("#dv_Group").hide();
            $("#hdn_SelectAll").val(1);
            fn_SelectAll();
            $("#ui_ddlActions").val(0);
            $("#drp_AddToGroup").val("None");
            $("#dv_Group").hide();
            $("#dvLoading").css("display", "none");
            ShowErrorMessage("Successfully removed");
        }
        else if (this.Id != 0) {
            BindAddedGrps(chkArrayId, this.Name, 'added');
            $("#dv_Group").hide();
            $("#hdn_SelectAll").val(1);
            fn_SelectAll();
            $("#ui_ddlActions").val(0);
            $("#drp_AddToGroup").val("None");
            $("#dv_Group").hide();
            $("#dvLoading").css("display", "none");
            ShowErrorMessage("Added successfully");
        }
        else if (this.Id == 0) {
            $("#dvLoading").css("display", "none");
            ShowErrorMessage("Already added");
        }
        else {
            $("#dvLoading").css("display", "none");
            ShowErrorMessage("Something goes wrong, please login again and try");
        }
    });
}
////
function BindAddedGrps(chkArrayId, Name, sts) {
    for (var i = 0; i < chkArrayId.length; i++) {
        if (sts == "added") {
            $("#ui_txtGrp" + chkArrayId[i]).html("<div id='ui_Grp" + chkArrayId[i] + "' class='contactMoreGroup' style='display:none;margin-left: -4.5%; margin-top: 1%;'></div><img src='/images/Arrow.png' title='See all the groups' style='cursor:pointer;' onclick=GetGroupName(" + chkArrayId[i] + ",'" + chkArrayDevice[i] + "');>&nbsp&nbsp" + Name);
            if ($("#ui_Grp" + chkArrayId[i]).html().length != 0) {
                $("#ui_Grp" + chkArrayId[i]).push("<div id='" + this.Id + "'>" + this.GroupName + "</div>");
            }
        }
        else if (sts == "removed") {
            Report();
        }
    }
}