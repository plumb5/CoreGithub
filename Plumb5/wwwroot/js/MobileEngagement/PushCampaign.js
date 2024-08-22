//Print and export..................
getPrintExport1 = function (getPageName1, print1, viewall1, recordsperPage1) {
    var record1 = "";
    var getPrint1 = "";
    if (print1 == 1) {
        getPrint1 = "<div id='dv_print1' style='float: left; margin-left: 160px; position: absolute;'>" +
            "<a href='javascript:void(0)' class='info' style='background-color: Transparent; float: left;position:relative;top:5px' rel='" + getPageName1 + "' id='btnPrint1'>" +
            "<img src='" + cdnpath + "Print.png' border='0' /><span style='width: 40px; left: -10px; top: 30px;'>Print</span></a>" +
            "</div>";
    }
    if (recordsperPage1 != null && recordsperPage1 == 1) {///Records per page
        record1 = "<div class='chk' id='dv_records1' style='float: left; margin-left: 0px;margin-top: 2px;width:79%'><span>Records Per Page&nbsp;&nbsp;</span><select style='position: relative;top: 1px; width:60px' class='dropdownSmallSize' id='drp_RecordsPerPage1' onchange='fn_ChangeRecordsPerPage1()'>" +
            "<option value='5' selected='selected'>5</option>" +
            "<option value='10'>10</option>" +
            "<option value='20'>20</option>" +
            "<option value='50'>50</option>" +
            "<option value='100'>100</option>" +
             "<option value='500'>500</option>" +
             "<option value='1000'>1000</option>" +
             "<option value='5000'>5000</option>" +
             "<option value='10000'>10000</option>" +
             //"<option value='All'>All</option>" +
        "</select></div>";
    }
    var PrintExport1 = "" + record1 +
                        getPrint1 + "<div id='dv_PntExp1' style='float: left; margin-left: 160px; position: absolute;'>" +
                        "<a href='javascript:void(0)' class='info' style='background-color: Transparent; float: left; position: relative; top: 4px;' rel='" + getPageName1 + "' id='btnExport1'>" +
                        "<img src='" + cdnpath + "excel.png' border='0' /><span style='width: 80px; left: -60px; top: 34px;'>Export as XLS</span></a>" +
                        "</div>";
    return PrintExport1;
};
//export to xls.............................
$(document).ready(function () {
    $("#btnExport1").click(function () {
        P5ExportData1(this);
    });
    $("#btnExportNew1").click(function () {
        $("#drp_ExportOption1").val("0");
        $("#dvexport_option1").toggle("slow");
    });
});
function P5ExportData1(value) {
    var FileName1 = $(value).attr('rel').replace(/ /g, '');
    var data1 = $("#dvExport").html();
    data1 = escape(data1);
    $('body').prepend("<form method='post' action='/ExportToXls/Export?File=" + FileName1 + "' style='top:-3333333333px;' id='tempForm1'><input type='hidden' name='data' value='" + data1 + "' ></form>");
    $('#tempForm1').submit();
    $("tempForm1").remove();
    return false;
}
var keyval = 0, keyval1 = 0, ExportDrpDwn = 0, LoadedData = 0;
var drpSearch = "", txtSearch = "";
$("#dvPrintExport").append(getPrintExport1('Mobile Push Campaign', 0, 0, 1));
GetCampaigns();

/// Campaigns Binding
function GetCampaigns() {
    $("#dvLoading").css("display", "block");
    if ($("#hdn_ViewMore").val() == "0" && ExportDrpDwn == 0 && LoadedData == 0) {
        $("#hdn_Start").val(1);
        if ($("#drp_RecordsPerPage1").val() == 'All' && keyval == 0) {//Day/Week/Month/Year Click with All Records
            keyval++;
            $("#hdn_End").val(1);
        }
        else {
            if (keyval > 0)
                keyval = 0;
            else
                $("#hdn_End").val($("#drp_RecordsPerPage1").val());
        }
    }
    $.ajax({
        url: "../MobileEngagement/GetCampaigns",
        type: 'Post',
        data: JSON.stringify({ 'Action': 'GetPushCampaign', 'Id': 0, 'status': 0, 'start': parseInt($("#hdn_Start").val()), 'end': parseInt($("#hdn_End").val()) }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if ($('#drp_RecordsPerPage1').val() == 'All' && keyval > 0) {
                $.each(response.Table1, function () {
                    $("#hdn_End").val(this.TotalRows);
                });
            }
            else {
                if (response.Table.length > 0) {
                    $("#dvDefault").css("display", "none");
                    $("#divcontent").css("display", "block");
                    $("#div_Searchboxes").css("display", "block");
                    OnSuccessReport(response);
                }
                else {
                    $("#dvDefault").css("display", "block"); $("#dvLoading").css("display", "none"); $("#dvReport").css("display", "none");
                    $("#div_Searchboxes").css("display", "none");
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
    if ($("#hdn_ViewMore").val() == "0") {
        $("#hdn_Start").val(1);
        if ($("#drp_RecordsPerPage1").val() == 'All' && keyval1 == 0) {//Day/Week/Month/Year Click with All Records
            keyval1++;
            $("#hdn_End").val(1);
        }
        else {
            if (keyval1 > 0)
                keyval1 = 0;
            else
                $("#hdn_End").val($("#drp_RecordsPerPage1").val());
        }
    }
    drpSearch = $("#drp_SearchBy").val();
    txtSearch = $('#txt_SearchBy').val();
    if ($("#drp_SearchBy").val() == "All" || $("#txt_SearchBy").val() == "Search Campaign Name") {
        drpSearch = "All";
        txtSearch = "All";
    }
    else if ($("#txt_SearchBy").val() == "Search Campaign Name") {
        txtSearch = "All";
    }
    $.ajax({
        type: "POST",
        url: "../MobileEngagement/GetCampaigns",
        data: "{'Action': 'GetPushCampaign', 'drpSearchBy':'" + drpSearch + "','txtSearchBy':'" + txtSearch.replace("(InApp)", "").replace("(Push)", "") + "', 'start': '" + parseInt($("#hdn_Start").val()) + "', 'end': '" + parseInt($("#hdn_End").val()) + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table.length > 0) {
                $("#dvDefault").css("display", "none");
                $("#divcontent").css("display", "block");
                $("#div_Searchboxes").css("display", "block");
                OnSuccessReport(response);
            } else {
                $("#dvDefault").css("display", "block"); $("#dvLoading").css("display", "none"); $("#divcontent").css("display", "none");
                if (del == 1 && drpSearch != 'All') {
                    $("#div_Searchboxes").css("display", "block"); $("#dvPrintExport").css("display", "block");
                } else {
                    $("#div_Searchboxes").css("display", "none"); $("#dvPrintExport").css("display", "none");
                }
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
};
/// Binding
function OnSuccessReport(response) {
    $("#dvPrintExport").css("display", "block");
    $("#dv_print1").hide();
    $("#dvReport").show();
    var InnerDivhtml = "", tabletd = "";

    if ($('#drp_RecordsPerPage1').val() == 'All' && (keyval > 0 || keyval1 > 0)) {
        $.each(response.Table1, function () {
            $("#hdn_End").val(this.TotalRows);
            return;
        });
        if (keyval1 > 0)
            fn_SearchByOnclick();
    } else {
        InnerDivhtml = "";
        tabletd = "<tr style='font-weight: bold;'><td>Campaign Name</td><td>Type</td><td>Title</td><td>Status</td><td>Date</td></tr>";
        //Reports
        if (ExportDrpDwn == 1) {
            $.each(response.Table, function () {
                tabletd += "<tr><td>" + this.CampaignName + "</td><td>" + this.CampaignType + "</td><td>" + this.Title + "</td><td>" + (this.Status == 1 ? "Active" : "Inactive") + "</td><td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObjNew(this.Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObjNew(this.Date)) + "</td></tr>";
            });
            $('#dvExport').html('<table><tbody>' + tabletd + '</tbody></table>');
            ExportDrpDwn = 0;
            $("#dv_SelectedData").hide();
            $("#dvexport_option").hide('slow');
            $("#hdn_Start").val(1);
            $("#hdn_End").val(($("#dvReport > div").length - 1) / 2);
            ExportCall();
        }
        else {
            $.each(response.Table, function () {
                var link = this.Diff == "InApp" ? ("<a href='InAppNativEditor?CampaignId=" + this.Id + "' alt='Edit/Send' title='Edit/Send'>Edit/Send</a>")
                                                : ("<a href='CreateCampaign?CampaignId=" + this.Id + "' alt='Edit/Send' title='Edit/Send'>Edit/Send</a>");
                var ImagePrv = (this.Type == 0 && this.Design != "") ? ("<a href='javascript:void(0)' onclick='InAppImgPreview(&#39;" + this.CampaignName + "&#39;,&#39;" + this.Design + "&#39;);' title='preview'>Preview</a>")
                                              : ("<a href='javascript:void(0)' onclick='ImagePreview(" + this.Type + ");' title='preview'>Preview</a>");
                var StatusReport = this.Status == 0 ?
                    "<img id='StatusImg_" + this.Diff + this.Id + "' onclick='StatusUpdate(&#39;" + this.Diff + this.Id + "&#39;," + this.Status + ",&#39;" + this.CampaignName + "&#39;,&#39;" + this.CampaignType + "&#39;)'; src='/images/MobileEngagement/blocked.png' border='0' alt='InActive' title='InActive' style='cursor: pointer;'>"
                    : "<img id='StatusImg_" + this.Diff + this.Id + "' onclick='StatusUpdate(&#39;" + this.Diff + this.Id + "&#39;," + this.Status + ",&#39;" + this.CampaignName + "&#39;,&#39;" + this.CampaignType + "&#39;)'; src='/images/MobileEngagement/Active.png' border='0' alt='Active' title='Active' style='cursor: pointer;'>"
                ////// Priority
                var prty = "";
                if ((drpSearch == "Push" || drpSearch == "InApp") && txtSearch != "All") {
                    prty = "<img style='height: 20px;' src='/images/MobileEngagement/green.png' border='0'>" +
                              "<img style='height: 19px;' src='/images/MobileEngagement/orange.png' border='0'>";
                }
                else {
                    prty = "<img style='height: 20px; cursor:pointer;' src='/images/MobileEngagement/green.png' border='0' alt='Move Up' title='Move Up' onclick='ChangePriority(&#39;Up&#39;,&#39;" + this.Diff + "&#39;," + this.Id + "," + this.Priority + ")'>" +
                              "<img style='height: 19px; cursor:pointer;' src='/images/MobileEngagement/orange.png' border='0' alt='Move Down' title='Move Down' onclick='ChangePriority(&#39;Down&#39;,&#39;" + this.Diff + "&#39;," + this.Id + "," + this.Priority + ")'>";
                }
                var FrmType = (this.CampaignType != 0 ? PushType(this.CampaignType) : '')
                tabletd += "<tr><td>" + this.CampaignName + "</td><td>" + FrmType + "</td><td>" + this.Title + "</td><td>" + (this.Status == 1 ? "Active" : "Inactive") + "</td><td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObjNew(this.Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObjNew(this.Date)) + "</td></tr>";
                InnerDivhtml += "<div id=" + this.Diff + this.Id + " style='text-align: left;' class='itemStyle'>" +
                                            "<div style='float: left; width: 16%;'>" +
                                            //"<a href='CampaignDetails?Id=" + this.Id + "&Type=" + this.Diff + "'>" + this.CampaignName + " (" + this.CampaignType + ")</a></div>" +
                                            "<a href='CampaignDetails?Id=" + this.Id + "&Type=" + this.Diff + "'>" + this.CampaignName + "</a></div>" +
                                            "<div style='float: left; width: 12%;'>" +
                                            FrmType + "</div>" +
                                            //(Type == "" ? "InAppNativ" : Type) + "</div>" +
                                            "<div style='float: left; width: 9%;'>" +
                                            "<a href='CampaignEffectiveness?CampaignId=" + this.Id + "&Type=" + this.Diff + "' alt='Effectiveness' title='Effectiveness'>Effectiveness</a></div>" +
                                            "<div style='float: left; width: 15%; title=" + this.Title + "'>" +
                                            this.Title + "</div>" +
                                            "<div style='float: left; width: 5%;'>" +
                                            StatusReport + "</div>" +
                                            "<div style='float: left; width: 8%;'>" +
                                            ImagePrv + "</div>" +
                                            "<div style='float: left; width: 7%;'>" +
                                            link + "</div>" +
                                            "<div style='float: left; width: 8%;'>" +
                                            prty + "</div>" +
                                            "<div style='float: left; width: 16%;'>" +
                                            $.datepicker.formatDate("M dd yy", GetJavaScriptDateObjNew(this.Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObjNew(this.Date)) + "</div>" +
                                            "<div style='float: left; width: 4%; text-align: right; cursor:pointer;'>" +
                                            "<a href='javascript:void(0)' onclick='DeleteConfirmation2(&#39;" + this.Diff + this.Id + "&#39;)'><img src='/images/TrashIcon.png' border='0' alt='Delete' title='Delete'></a></div>" +
                                            "</div>";
            });
            //View More Counts Display
            $.each(response.Table1, function () {
                if (parseInt($("#hdn_End").val()) < parseInt(this.TotalRows) && parseInt(this.TotalRows) > parseInt($("#drp_RecordsPerPage1").val()))
                    $("#div_ViewMore").show();
                else
                    $("#div_ViewMore").hide();
                if (parseInt($("#hdn_End").val()) < parseInt(this.TotalRows)) {
                    window.div_Records.innerHTML = $("#hdn_End").val() + " out of " + this.TotalRows + " records";
                    $("#txt_viewmore").show(); $("#div_ViewMore").show();
                }
                else {
                    window.div_Records.innerHTML = this.TotalRows + " out of " + this.TotalRows + " records";
                    $("#div_ViewMore").show();
                    $("#txt_viewmore").hide();
                }
                $("#hdn_Total").val(this.TotalRows);
            });
            LoadedData = 0;
            //$("#dv_SelectedData").hide();
            //$("#dvexport_option").hide('slow');
            //View More Data Append
            if ($("#hdn_ViewMore").val() == "1") {
                var newhtml = $('#dvExport').html().replace('</tbody></table>', tabletd + "</tbody></table>");
                window.dvExport.innerHTML = newhtml;
                $("#dvReport").append(InnerDivhtml);
                $("#hdn_ViewMore").val(0);
            } else {
                window.dvExport.innerHTML = "<table id='ExportTable'>" + tabletd + "</table>";
                dvReport.innerHTML = "<div style='text-align: left; white-space: nowrap;' class='headerstyle'>" +
                                                    "<div style='float: left; width: 16%;'>" +
                                                    "Campaign Name</div>" +
                                                    "<div style='float: left; width: 12%;'>" +
                                                    "Type</div>" +
                                                    "<div style='float: left; width: 9%;'>" +
                                                    "Effectiveness</div>" +
                                                    "<div style='float: left; width: 15%;'>" +
                                                    "Title</div>" +
                                                    "<div style='float: left; width: 5%;'>" +
                                                    "Status</div>" +
                                                    "<div style='float: left; width: 8%;'>" +
                                                    "Preview</div>" +
                                                    "<div style='float: left; width: 7%;'>" +
                                                    "Manage</div>" +
                                                     "<div style='float: left; width: 8%;'>" +
                                                    "Priority</div>" +
                                                    "<div style='float: left; width: 16%;'>" +
                                                    "Date</div>" +
                                                    "<div style='float: left; text-align: right; width: 4%;' >" +
                                                    "Delete</div>" +
                                                    "</div>" + InnerDivhtml;
            }
            $("#dvExpend").css({ 'height': (620 > $("#dvReport").height() + 160) ? '620px' : $("#dvReport").height() + 160 + 'px' });
            $("#dvLoading").css("display", "none");
        }
    }
}
function PushType(typeId) {
    var typ = "";
    switch (typeId) {
        case 1:
            typ = "Long Text Style";
            break;
        case 2:
            typ = "Inbox Style";
            break;
        case 3:
            typ = "Big Picture Style";
            break;
        case 4:
            typ = "Profile Style";
            break;
        default:
            typ = "";
            break;
    }
    return typ;
}
///Search By WaterMark
$(document).ready(function () {
    if ($('#drp_SearchBy').val() == 'Campaign') {
        if ($('#txt_SearchBy').val() == 'All' || $('#txt_SearchBy').val() == '')
            $('#txt_SearchBy').val('Search Campaign Name').addClass('watermark');
    }
    else if ($('#txt_SearchBy').val() == '')
        $('#txt_SearchBy').val('All').addClass('watermark');
});
///Search By Focus
$('#txt_SearchBy').focus(function () {
    if ($(this).val() == 'All' || $(this).val() == 'Search Campaign Name') {
        $(this).val('').removeClass('watermark');
    }
});
///Search By Blur
$('#txt_SearchBy').blur(function () {
    if ($(this).val() == '') {
        if ($('#drp_SearchBy').val() == 'Campaign') {
            $(this).val('Search Campaign Name').addClass('watermark');
        }
        else
            $(this).val('All').addClass('watermark');
    }
});
///Search By Watermark
$("#drp_SearchBy").change(function () {
    $("#txt_SearchBy").show();
    $("#div_Searchboxes").css("width", "395px");
    if ($('#drp_SearchBy').val() != "All") {
        if ($('#drp_SearchBy').val() == 'Campaign') {
            $('#txt_SearchBy').val('Search Campaign Name').addClass('watermark');
        }
        
        /// Auto Suggest
        $('#txt_SearchBy').autocomplete({
            minLength: 1,
            source: function (request, response) {
                window.stop();
                $.ajax({
                    url: "../MobileEngagement/GetAutosuggest",
                    data: "{ 'type': 'myCampaign','action':'Push','q': '" + request.term + "'}",
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
        $("#div_Searchboxes").css("width", "220px");
        $("#txt_SearchBy").hide();
    }
});
///SearchBy OnChange
function SearchByOnchange() {
    $("#dvLoading").css("display", "block");
    if ($('#drp_SearchBy').val() != "All") {
        $("#txt_SearchBy").show();
        if ($('#drp_SearchBy').val() == 'Campaign') {
            if ($('#txt_SearchBy').val() == '')
                $('#txt_SearchBy').val('Search Campaign Name').addClass('watermark');
        }
    } else {
        $("#txt_SearchBy").hide();
    }
}
//View More
function fn_ViewMoreOnClick() {
    $("#dvLoading").css("display", "block");
    $("#hdn_ViewMore").val(1);
    $("#hdn_End").val(parseInt($("#hdn_End").val()) + parseInt($("#drp_RecordsPerPage1").val()));
    $("#hdn_Start").val(parseInt($("#hdn_Start").val()) + parseInt($("#drp_RecordsPerPage1").val()));
    if (del == 1) {
        $("#hdn_Start").val($("#dvReport > div").length);
    }
    if (drpSearch == 'All')
        GetCampaigns();
    else
        fn_SearchByOnclick();
}
//On Change Records Per Page
function fn_ChangeRecordsPerPage1() {
    $("#dvLoading").css("display", "block");
    if ($('#drp_RecordsPerPage1').val() == 'All')
        $("#hdn_End").val(parseInt($("#hdn_Total").val()));
    else
        $("#hdn_End").val($("#drp_RecordsPerPage1").val());
    $("#hdn_Start").val(1);

    if (drpSearch == 'All')
        GetCampaigns();
    else
        fn_SearchByOnclick();
}