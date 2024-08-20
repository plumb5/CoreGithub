//Print and export..................
getPrintExport2 = function (getPageName2, print2, viewall2, recordsperPage2) {
    var record2 = "";
    var getPrint2 = "";
    if (print2 == 1) {
        getPrint2 = "<div id='dv_print2' style='float: left; margin-left: 160px; position: absolute;'>" +
            "<a href='javascript:void(0)' class='info' style='background-color: Transparent; float: left;position:relative;top:5px' rel='" + getPageName2 + "' id='btnPrint2'>" +
            "<img src='" + cdnpath + "Print.png' border='0' /><span style='width: 40px; left: -10px; top: 30px;'>Print</span></a>" +
            "</div>";
    }
    if (recordsperPage2 != null && recordsperPage2 == 1) {///Records per page
        record2 = "<div class='chk' id='dv_records2' style='float: left; margin-left: 0px;margin-top: 2px;width:79%'><span>Records Per Page&nbsp;&nbsp;</span><select style='position: relative;top: 1px; width:60px' class='dropdownSmallSize' id='drp_RecordsPerPage2' onchange='fn_ChangeRecordsPerPage2()'>" +
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
    var PrintExport2 = "" + record2 +
                        getPrint2 + "<div id='dv_PntExp2' style='float: left; margin-left: 160px; position: absolute;'>" +
                        "<a href='javascript:void(0)' class='info' style='background-color: Transparent; float: left; position: relative; top: 4px;' rel='" + getPageName2 + "' id='btnExport2'>" +
                        "<img src='" + cdnpath + "excel.png' border='0' /><span style='width: 80px; left: -60px; top: 34px;'>Export as XLS</span></a>" +
                        "</div>";
    return PrintExport2;
};
//export to xls.............................
$(document).ready(function () {
    $("#btnExport2").click(function () {
        P5ExportData(this);
    });
    $("#btnExportNew2").click(function () {
        $("#drp_ExportOption2").val("0");
        $("#dvexport_option2").toggle("slow");
    });
});
function P5ExportData(value) {
    var FileName2 = $(value).attr('rel').replace(/ /g, '');
    var data2 = $("#dvExport2").html();
    data2 = escape(data2);
    $('body').prepend("<form method='post' action='/ExportToXls/Export?File=" + FileName2 + "' style='top:-3333333333px;' id='tempForm2'><input type='hidden' name='data' value='" + data2 + "' ></form>");
    $('#tempForm2').submit();
    $("tempForm2").remove();
    return false;
}

var keyval2 = 0, keyval12 = 0, ExportDrpDwn2 = 0, LoadedData2 = 0;
var drpSearch2 = "", txtSearch2 = "";
$("#dvPrintExport2").append(getPrintExport2('Mobile In-App Campaign', 0, 0, 1));
GetInAppCampaigns();
/// Campaigns Binding
function GetInAppCampaigns() {
    $("#dvLoading").css("display", "block");
    if ($("#hdn_ViewMore2").val() == "0" && ExportDrpDwn2 == 0 && LoadedData2 == 0) {
        $("#hdn_Start").val(1);
        if ($("#drp_RecordsPerPage2").val() == 'All' && keyval2 == 0) {//Day/Week/Month/Year Click with All Records
            keyval2++;
            $("#hdn_End2").val(1);
        }
        else {
            if (keyval2 > 0)
                keyval2 = 0;
            else
                $("#hdn_End2").val($("#drp_RecordsPerPage2").val());
        }
    }
    $.ajax({
        url: "../MobileEngagement/GetCampaigns",
        type: 'Post',
        data: JSON.stringify({ 'Action': 'GetInAppCampaign', 'Id': 0, 'status': 0, 'start': parseInt($("#hdn_Start2").val()), 'end': parseInt($("#hdn_End2").val()) }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if ($('#drp_RecordsPerPage2').val() == 'All' && keyval2 > 0) {
                $.each(response.Table1, function () {
                    $("#hdn_End2").val(this.TotalRows);
                });
            }
            else {
                if (response.Table.length > 0) {
                    $("#dvDefault2").css("display", "none");
                    $("#divcontent2").css("display", "block");
                    $("#div_Searchboxes2").css("display", "block");
                    OnSuccessReport2(response);
                }
                else {
                    $("#dvDefault2").css("display", "block"); $("#dvLoading").css("display", "none"); $("#dvReport2").css("display", "none");
                    $("#div_Searchboxes2").css("display", "none");
                }
            }
        },
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }
    });
}
///Search By Go Button
fn_SearchByOnclick2 = function () {
    $("#dvLoading").css("display", "block");
    if ($("#hdn_ViewMore2").val() == "0") {
        $("#hdn_Start2").val(1);
        if ($("#drp_RecordsPerPage2").val() == 'All' && keyval1 == 0) {//Day/Week/Month/Year Click with All Records
            keyval1++;
            $("#hdn_End2").val(1);
        }
        else {
            if (keyval1 > 0)
                keyval1 = 0;
            else
                $("#hdn_End2").val($("#drp_RecordsPerPage2").val());
        }
    }
    drpSearch2 = $("#drp_SearchBy2").val();
    txtSearch2 = $('#txt_SearchBy2').val();
    if ($("#drp_SearchBy2").val() == "All" || $("#txt_SearchBy2").val() == "Search Campaign Name") {
        drpSearch2 = "All";
        txtSearch2 = "All";
    }
    else if ($("#txt_SearchBy2").val() == "Search Campaign Name") {
        txtSearch2 = "All";
    }
    $.ajax({
        type: "POST",
        url: "../MobileEngagement/GetCampaigns",
        data: "{'Action': 'GetInAppCampaign', 'drpSearchBy':'" + drpSearch2 + "','txtSearchBy':'" + txtSearch2.replace("(InApp)", "").replace("(Push)", "") + "','start': '" + parseInt($("#hdn_Start2").val()) + "', 'end': '" + parseInt($("#hdn_End2").val()) + "' }",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table.length > 0) {
                $("#dvDefault2").css("display", "none");
                $("#divcontent2").css("display", "block");
                $("#div_Searchboxes2").css("display", "block");
                OnSuccessReport2(response);
            } else {
                $("#dvDefault2").css("display", "block"); $("#dvLoading").css("display", "none"); $("#divcontent2").css("display", "none");
                if (del2 == 1 && drpSearch2 != 'All') {
                    $("#div_Searchboxes2").css("display", "block"); $("#dvPrintExport2").css("display", "block");
                }
                else {
                    $("#div_Searchboxes2").css("display", "none"); $("#dvPrintExport2").css("display", "none");
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
function OnSuccessReport2(response) {
    $("#dvPrintExport2").css("display", "block");
    $("#dv_print2").hide();
    $("#dvReport2").show();
    var InnerDivhtml2 = "", tabletd2 = "";

    if ($('#drp_RecordsPerPage2').val() == 'All' && (keyval2 > 0 || keyval12 > 0)) {
        $.each(response.Table1, function () {
            $("#hdn_End2").val(this.TotalRows);
            return;
        });
        if (keyval12 > 0)
            fn_SearchByOnclick2();
    } else {
        tabletd2 = "<tr style='font-weight: bold;'><td>Campaign Name</td><td>Type</td><td>Status</td><td>Date</td></tr>";
        //Reports
        if (ExportDrpDwn2 == 1) {
            $.each(response.Table, function () {
                tabletd2 += "<tr><td>" + this.CampaignName + "</td><td>" + this.CampaignType + "</td><td>" + (this.Status == 1 ? "Active" : "Inactive") + "</td><td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObjNew(this.Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObjNew(this.Date)) + "</td></tr>";
            });
            $('#dvExport2').html('<table><tbody>' + tabletd2 + '</tbody></table>');
            ExportDrpDwn2 = 0;
            $("#dv_SelectedData2").hide();
            $("#dvexport_option2").hide('slow');
            $("#hdn_Start2").val(1);
            $("#hdn_End2").val(($("#dvReport2 > div").length - 1) / 2);
            ExportCall2();
        }
        else {
            InnerDivhtml2 = "";
            $.each(response.Table, function () {
                var link = this.Diff == "InApp" ? ("<a href='InAppNativEditor?CampaignId=" + this.Id + "' alt='Edit/Send' title='Edit/Send'>Edit</a>")
                                                : ("<a href='CreateCampaign?CampaignId=" + this.Id + "' alt='Edit/Send' title='Edit/Send'>Edit</a>");
                var ImagePrv = (this.Type == 0 && this.Design != "") ? ("<a href='javascript:void(0)' onclick='InAppImgPreview(" + this.BannerType + ",&#39;" + this.Design + "&#39;);' title='preview'>Preview</a>")
                                              : ("<a href='javascript:void(0)' onclick='ImagePreview(" + this.Type + ");' title='preview'>Preview</a>");
                var StatusReport = this.Status == 0 ?
                    "<img id='StatusImg_" + this.Diff + this.Id + "' onclick='StatusUpdate(&#39;" + this.Diff + this.Id + "&#39;," + this.Status + ",&#39;" + this.CampaignName + "&#39;,&#39;" + this.CampaignType + "&#39;)'; src='/images/MobileEngagement/blocked.png' border='0' alt='InActive' title='InActive' style='cursor: pointer;'>"
                    : "<img id='StatusImg_" + this.Diff + this.Id + "' onclick='StatusUpdate(&#39;" + this.Diff + this.Id + "&#39;," + this.Status + ",&#39;" + this.CampaignName + "&#39;,&#39;" + this.CampaignType + "&#39;)'; src='/images/MobileEngagement/Active.png' border='0' alt='Active' title='Active' style='cursor: pointer;'>"
                ////// Priority
                var prty = "";
                if ((drpSearch2 == "Push" || drpSearch2 == "InApp") && txtSearch2 != "All") {
                    prty = "<img style='height: 20px;' src='/images/MobileEngagement/green.png' border='0'>" +
                              "<img style='height: 19px;' src='/images/MobileEngagement/orange.png' border='0'>";
                }
                else {
                    prty = "<img style='height: 20px; cursor:pointer;' src='/images/MobileEngagement/green.png' border='0' alt='Move Up' title='Move Up' onclick='ChangePriority(&#39;Up&#39;,&#39;" + this.Diff + "&#39;," + this.Id + "," + this.Priority + ")'>" +
                              "<img style='height: 19px; cursor:pointer;' src='/images/MobileEngagement/orange.png' border='0' alt='Move Down' title='Move Down' onclick='ChangePriority(&#39;Down&#39;,&#39;" + this.Diff + "&#39;," + this.Id + "," + this.Priority + ")'>";
                }
                tabletd2 += "<tr><td>" + this.CampaignName + "</td><td>" + this.CampaignType + "</td><td>" + (this.Status == 1 ? "Active" : "Inactive") + "</td><td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObjNew(this.Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObjNew(this.Date)) + "</td></tr>";
                InnerDivhtml2 += "<div id=" + this.Diff + this.Id + " style='text-align: left;' class='itemStyle'>" +
                                            "<div style='float: left; width: 17%;'>" +
                                            //"<a href='CampaignDetails?Id=" + this.Id + "&Type=" + this.Diff + "'>" + this.CampaignName + " (" + this.CampaignType + ")</a></div>" +
                                            "<a href='CampaignDetails?Id=" + this.Id + "&Type=" + this.Diff + "'>" + this.CampaignName + "</a></div>" +
                                            "<div style='float: left; width: 21%;'>" +
                                            this.CampaignType + "</div>" +
                                            //(Type == "" ? "InAppNativ" : Type) + "</div>" +
                                            "<div style='float: left; width: 11%;'>" +
                                            "<a href='CampaignEffectiveness?CampaignId=" + this.Id + "&Type=" + this.Diff + "' alt='Effectiveness' title='Effectiveness'>Effectiveness</a></div>" +                                            
                                            "<div style='float: left; width: 7%;'>" +
                                            StatusReport + "</div>" +
                                            "<div style='float: left; width: 7%;'>" +
                                            ImagePrv + "</div>" +
                                            "<div style='float: left; width: 7%;'>" +
                                            link + "</div>" +
                                            "<div style='float: left; width: 7%;'>" +
                                            prty + "</div>" +
                                            "<div style='float: left; width: 18%;'>" +
                                            $.datepicker.formatDate("M dd yy", GetJavaScriptDateObjNew(this.Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObjNew(this.Date)) + "</div>" +
                                            "<div style='float: left; width: 5%; text-align: right; cursor:pointer;'>" +
                                            "<a href='javascript:void(0)' onclick='DeleteConfirmation2(&#39;" + this.Diff + this.Id + "&#39;)'><img src='/images/TrashIcon.png' border='0' alt='Delete' title='Delete'></a></div>" +
                                            "</div>";
            });
            //View More Counts Display
            $.each(response.Table1, function () {
                if (parseInt($("#hdn_End2").val()) < parseInt(this.TotalRows) && parseInt(this.TotalRows) > parseInt($("#drp_RecordsPerPage2").val()))
                    $("#div_ViewMore2").show();
                else
                    $("#div_ViewMore2").hide();
                if (parseInt($("#hdn_End2").val()) < parseInt(this.TotalRows)) {
                    window.div_Records2.innerHTML = $("#hdn_End2").val() + " out of " + this.TotalRows + " records";
                    $("#txt_viewmore2").show(); $("#div_ViewMore2").show();
                }
                else {
                    window.div_Records2.innerHTML = this.TotalRows + " out of " + this.TotalRows + " records";
                    $("#div_ViewMore2").show();
                    $("#txt_viewmore2").hide();
                }
                $("#hdn_Total2").val(this.TotalRows);
            });
            LoadedData = 0;
            //$("#dv_SelectedData").hide();
            //$("#dvexport_option").hide('slow');
            //View More Data Append
            if ($("#hdn_ViewMore2").val() == "1") {
                var newhtml2 = $('#dvExport2').html().replace('</tbody></table>', tabletd2 + "</tbody></table>");
                window.dvExport2.innerHTML = newhtml2;
                $("#dvReport2").append(InnerDivhtml2);
                $("#hdn_ViewMore2").val(0);
            } else {
                window.dvExport2.innerHTML = "<table id='ExportTable'>" + tabletd2 + "</table>";
                dvReport2.innerHTML = "<div style='text-align: left; white-space: nowrap;' class='headerstyle'>" +
                                                    "<div style='float: left; width: 17%;'>" +
                                                    "Campaign Name</div>" +
                                                    "<div style='float: left; width: 21%;'>" +
                                                    "Type</div>" +
                                                    "<div style='float: left; width: 11%;'>" +
                                                    "Effectiveness</div>" +
                                                    "<div style='float: left; width: 7%;'>" +
                                                    "Status</div>" +
                                                    "<div style='float: left; width: 7%;'>" +
                                                    "Preview</div>" +
                                                    "<div style='float: left; width: 7%;'>" +
                                                    "Manage</div>" +
                                                     "<div style='float: left; width: 7%;'>" +
                                                    "Priority</div>" +
                                                    "<div style='float: left; width: 18%;'>" +
                                                    "Date</div>" +
                                                    "<div style='float: left; text-align: right; width: 5%;' >" +
                                                    "Delete</div>" +
                                                    "</div>" + InnerDivhtml2;
            }
            $("#dvExpend").css({ 'height': (620 > $("#dvReport2").height() + 160) ? '620px' : $("#dvReport2").height() + 160 + 'px' });
            $("#dvLoading").css("display", "none");
        }
    }
}
///Search By WaterMark
$(document).ready(function () {
    if ($('#drp_SearchBy2').val() == 'Campaign') {
        if ($('#txt_SearchBy2').val() == 'All' || $('#txt_SearchBy2').val() == '')
            $('#txt_SearchBy2').val('Search Campaign Name').addClass('watermark');
    }
    else if ($('#txt_SearchBy2').val() == '')
        $('#txt_SearchBy2').val('All').addClass('watermark');
});
///Search By Focus
$('#txt_SearchBy2').focus(function () {
    if ($(this).val() == 'All' || $(this).val() == 'Search Campaign Name') {
        $(this).val('').removeClass('watermark');
    }
});
///Search By Blur
$('#txt_SearchBy2').blur(function () {
    if ($(this).val() == '') {
        if ($('#drp_SearchBy2').val() == 'Campaign') {
            $(this).val('Search Campaign Name').addClass('watermark');
        }
        else
            $(this).val('All').addClass('watermark');
    }
});
///Search By Watermark
$("#drp_SearchBy2").change(function () {
    $("#txt_SearchBy2").show();
    $("#div_Searchboxes2").css("width", "395px");
    if ($('#drp_SearchBy2').val() != "All") {
        if ($('#drp_SearchBy2').val() == 'Campaign') {
            $('#txt_SearchBy2').val('Search Campaign Name').addClass('watermark');
        }

        /// Auto Suggest
        $('#txt_SearchBy2').autocomplete({
            minLength: 1,
            source: function (request, response) {
                window.stop();
                $.ajax({
                    url: "../MobileEngagement/GetAutosuggest",
                    data: "{ 'type': 'myCampaign','action':'InApp','q': '" + request.term + "'}",
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
        $("#div_Searchboxes2").css("width", "220px");
        $("#txt_SearchBy2").hide();
    }
});
///SearchBy OnChange
function SearchByOnchange() {
    $("#dvLoading").css("display", "block");
    if ($('#drp_SearchBy2').val() != "All") {
        $("#txt_SearchBy2").show();
        if ($('#drp_SearchBy2').val() == 'Campaign') {
            if ($('#txt_SearchBy2').val() == '')
                $('#txt_SearchBy2').val('Search Campaign Name').addClass('watermark');
        }
    } else {
        $("#txt_SearchBy2").hide();
    }
}
//View More
function fn_ViewMoreOnClick2() {
    $("#dvLoading").css("display", "block");
    $("#hdn_ViewMore2").val(1);
    $("#hdn_End2").val(parseInt($("#hdn_End2").val()) + parseInt($("#drp_RecordsPerPage2").val()));
    $("#hdn_Start2").val(parseInt($("#hdn_Start2").val()) + parseInt($("#drp_RecordsPerPage2").val()));
    if (del2 == 1) {
        $("#hdn_Start2").val($("#dvReport2 > div").length);
    }
    if (drpSearch == 'All')
        GetInAppCampaigns();
    else
        fn_SearchByOnclick2();
}
//On Change Records Per Page
function fn_ChangeRecordsPerPage2() {
    $("#dvLoading").css("display", "block");
    if ($('#drp_RecordsPerPage2').val() == 'All')
        $("#hdn_End2").val(parseInt($("#hdn_Total2").val()));
    else
        $("#hdn_End2").val($("#drp_RecordsPerPage2").val());
    $("#hdn_Start2").val(1);

    if (drpSearch == 'All')
        GetInAppCampaigns();
    else
        fn_SearchByOnclick2();
}