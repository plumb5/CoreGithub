$("#dvPrintExport").append(getPrintExport('Mobile Groups', 0, 0, 1));
$("#btnExport").attr("id", "btnExportNew");
var keyval = 0, ExportDrpDwn = 0, LoadedData = 0;
var group = "";
Report();
function Report() {
    $("#dvCustomFilter").css("display", "none");
    $("#dvLoading").css("display", "block");

    var value = $("#hdndrpVlue").val();
    if (value != 0 && $("#txt_SearchBy").val() != 'Search with Group Name') {
        group = value;
    }
    else { group = 0; }
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



    var inputs4 = { Action: 'GetGroups', Id: 0, start: parseInt($("#hdn_Start").val()), end: parseInt($("#hdn_End").val()), group: group };
    $.ajax({
        url: "../MobileEngagement/SaveGroups",
        type: 'Post',
        data: JSON.stringify({ 'inputs': inputs4 }),
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
                else { $("#dvDefault").css("display", "block"); $("#div_Searchboxes").css("display", "none"); $("#dvLoading").css("display", "none"); $("#divcontent").css("display", "none"); $("#dvPrintExport").css("display", "none"); }
            }
        },
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }
    });
}
////
function BindReport(response) {
    $("#txt_SearchBy").css("display", "block");
    $("#dvDefault").css("display", "none");
    $("#divcontent").css("display", "block");
    $("#dvPrintExport").css("display", "block");
    $("#dv_PntExp").css("position", "absolute");
    $("#dv_PntExp").css("margin-left", "160px");
    $("#div_Searchboxes").css("display", "block");
    $("#dvReport").show();
    var innerDivhtml = "";
    tabletd = "<tr style='font-weight: bold;'><td>GroupName</td><td>Description</td><td>Status</td><td>Date</td></tr>";
    //Reports
    if (ExportDrpDwn == 1) {
        $.each(response.Table, function () {
            tabletd += "<tr><td>" + this.Name + "</td><td>" + this.GroupDescription + "</td><td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObjNew(this.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObjNew(this.CreatedDate)) + "</td></tr>";
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
        $.each(response.Table, function () {
            tabletd += "<tr><td>" + this.Name + "(" + ((this.GrpCount == undefined || this.GrpCount == null) ? 0 : this.GrpCount) + ")</td><td>" + this.GroupDescription + "</td><td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObjNew(this.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObjNew(this.CreatedDate)) + "</td></tr>";
            //var StatusReport = this.DisplayInUnscubscribe == 0 ?
            //"<img style='cursor: pointer;' id='StatusImg_" + this.Id + "' onclick='StatusUpdate(" + this.Id + "," + this.DisplayInUnscubscribe + ",&#39;" + this.Name + "&#39;,&#39;" + this.GroupDescription + "&#39;)'; src='/images/MobileEngagement/blocked.png' border='0' alt='InActive' title='InActive' >"
            //: "<img style='cursor: pointer;' id='StatusImg_" + this.Id + "' onclick='StatusUpdate(" + this.Id + "," + this.DisplayInUnscubscribe + ",&#39;" + this.Name + "&#39;,&#39;" + this.GroupDescription + "&#39;)'; src='/images/MobileEngagement/Active.png' border='0' alt='Active' title='Active' >"


            var tdContent = "";
            if (this.GroupType == 2)
                tdContent += "<a class='ContributePermission' href='/Mobile/MobileGroupByFilter?GroupId=" + this.Id + "' id='ui_tdType_" + this.Id + "'>Dynamic</a>";
            else if (this.GroupType == 1)
                tdContent += "Static";


            innerDivhtml += "<div id=" + this.Id + " style='text-align: left;' class='itemStyle'>" +
                    "<div style='float: left; width: 23%;'>" +
                    "<a href='../MobileEngagement/Visitors?GroupId=" + this.Id + "'>" + this.Name + " </a><span style='cursor: default' title='Count of contacts added in this group'>(" + ((this.GrpCount == undefined || this.GrpCount == null) ? 0 : this.GrpCount) + ")</span></div>" +
                    "<div style='float: left; width: 25%;'>" +
                    this.GroupDescription + "</div>" +
                    //"<div style='float: left; width: 16%;'>" +
                    //StatusReport + "</div>" +
                    "<div style='float: left; width: 20%;'>" +
                    "<a id='manage_" + this.Id + "' href='javascript:void(0)' onclick='Manage(" + this.Id + ",&#39;" + this.Name + "&#39;,&#39;" + this.GroupDescription + "&#39;," + this.DisplayInUnscubscribe + ");' alt='Edit/View' title='Edit/View'>Edit/View</a></div>" +
                    "<div style='float: left; width: 14%;'>" +
                    $.datepicker.formatDate("M dd yy", GetJavaScriptDateObjNew(this.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObjNew(this.CreatedDate)) + "</div>" +
                    "<div style='float: left; width: 10%;text-align:right'>" + tdContent+ "</div>" +
                    "<div style='float: right; width:auto;'>" +
                    "<a href='javascript:void(0)' onclick='ConfirmedDelete(" + this.Id + ")'><img src='/images/TrashIcon.png' border='0' alt='Delete' title='Delete'></a></div></div>";
        });
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
                            "<div style='float: left; width: 23%;'>" +
                            "Group Name</div>" +
                            "<div style='float: left; width: 25%;'>" +
                            "Description</div>" +
                            //"<div style='float: left; width: 16%;'>" +
                            //"Status</div>" +
                            "<div style='float: left; width: 20%;'>" +
                            "Edit</div>" +
                            "<div style='float: left; width: 14%;'>" +
                            "Date</div>" +

                            "<div style='float: left; width: 10%;text-align:right;'>" +
                            "Type</div>" +
                            "<div style='float: right; text-align: right; width: auto;'>" +
                            "Delete</div>" +
                            "</div>" + innerDivhtml;
        }
    }
    $("#dvLoading").css("display", "none");
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
// Filter
//onclick
$('#txt_SearchBy').click(function () {
    $("#txt_SearchBy").css("color", "black");
});
///Search By WaterMark
$(document).ready(function () {
    if ($('#txt_SearchBy').val() == '') {
        $('#txt_SearchBy').val('Search with Group Name').addClass('watermark');
    }
    if ($('#txt_SearchBy').val() == "Search with Group Name")
        $("#txt_SearchBy").css("color", "darkgrey");
    else
        $("#txt_SearchBy").css("color", "black");
});
///Search By Focus
$('#txt_SearchBy').focus(function () {
    if ($('#txt_SearchBy').val() == "Search with Group Name")
        $(this).val('').removeClass('watermark');
});
///Search By Blur
$('#txt_SearchBy').blur(function () {
    if ($('#txt_SearchBy').val() == '') {
        $(this).val('Search with Group Name').addClass('watermark');
    }
    if ($('#txt_SearchBy').val() == "Search with Group Name")
        $("#txt_SearchBy").css("color", "darkgrey");
    else
        $("#txt_SearchBy").css("color", "black");
});
/// Auto Suggest
$('#txt_SearchBy').autocomplete({
    minLength: 1,
    source: function (request, response) {
        window.stop();
        $.ajax({
            url: "GetAutosuggest",
            data: "{  'action':'Groups','q': '" + request.term + "'}",
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
                            value: item.value + ""
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
        $("#hdndrpVlue").val(ui.item.label);
        event.preventDefault();
        $(this).val(ui.item.label);
        $("#txt_SearchBy").css("color", "black");
        Report(parseInt($("#hdn_Duration").val()));
    },
    focus: function () {
        return false;
    },
});

/// Create Group
$("#Add_Group").click(function () {
    $("#dvCreateGrp").show();
    $("#dvDurationPrint").hide();
    $("#dvDefault").css("display", "none");
    $("#Save_Group").val('CREATE GROUP');
    $("#ui_txtGrpName").val('');
    $("#ui_txtDiscription").val('');
});
//// Cancel
$("#Cancel_Group").click(function () {
    $("#dvCreateGrp").hide();
    $("#dvDurationPrint").show();
    if ($("#dvReport > div").length > 0)
        $("#dvDefault").css("display", "none");
    else
        $("#dvDefault").css("display", "block");
});
/// Edit
function Manage(id, Name, Dis, status) {
    $("#hdnUpdateId").val('');
    $("#dvCreateGrp").show();
    $("#dvDurationPrint").hide();
    $("#dvDefault").css("display", "none");
    $("#Save_Group").val('UPDATE GROUP');
    $("#hdnUpdateId").val(id);
    $("#ui_txtGrpName").val(Name);
    $("#ui_txtDiscription").val(Dis);
    if (status === 0)
        $("input[name^=Status][value='0']").attr("checked", true);
    else
        $("input[name^=Status][value='1']").attr("checked", true);
}
//// Save
$("#Save_Group").click(function () {
    if ($("#ui_txtGrpName").val() == "") {
        ShowErrorMessage("Please enter group name");
        return false;
    }
    else if ($("#ui_txtDiscription").val() == "") {
        ShowErrorMessage("Please enter group description");
        return false;
    } else {

        var GroupType = $('input[name=TypeStaticOrDynamic]:checked').val();


        var inputs = {};
        if (this.value == "CREATE GROUP")
            inputs = { Action: 'Create', Id: 0, GroupName: $("#ui_txtGrpName").val(), Discription: $("#ui_txtDiscription").val(), Status: $('input[name=Status]:checked').val(), GroupType: GroupType };
        else
            inputs = { Action: 'Update', Id: $("#hdnUpdateId").val(), GroupName: $("#ui_txtGrpName").val(), Discription: $("#ui_txtDiscription").val(), Status: $('input[name=Status]:checked').val(), GroupType: GroupType };
        $.ajax({
            url: "../MobileEngagement/SaveGroups",
            type: 'Post',
            data: JSON.stringify({ 'inputs': inputs }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Table.length > 0) {
                    if ($("#dvReport > div").length == 0) {
                        var Action = "";
                        $.each(response.Table, function () {
                            Action = this.Action;
                        });
                        if (Action == "Created") {
                            BindReport(response);
                            $("#dvCreateGrp").hide();
                            $("#dvDurationPrint").show();
                            ShowErrorMessage("Group created successfully");
                        }
                        else if (Action == "already exists") {
                            var AppType = "";
                            $.each(response.Table1, function () {
                                AppType = this.AppType;
                            });
                            var module = "";
                            if (AppType == 1)
                                module = "Web & Mobile Analytics"
                            else if (AppType == 2)
                                module = "Engagement";
                            else if (AppType == 3)
                                module = "Email Marketing";
                            else if (AppType == 4)
                                module = "SMS Marketing";
                            else if (AppType == 5)
                                module = "Mobile Engagement";
                            ShowErrorMessage("The group name is already created under '" + module + "'");
                        }
                    }
                    else {
                        $.each(response.Table, function () {
                            if (this.CreatedDate != undefined) {
                                //var StatusReport2 = this.DisplayInUnscubscribe == 0 ?
                                //        "<img style='cursor: pointer;' id='StatusImg_" + this.Id + "' onclick='StatusUpdate(" + this.Id + "," + this.DisplayInUnscubscribe + ",&#39;" + this.Name + "&#39;,&#39;" + this.GroupDescription + "&#39;)'; src='/images/MobileEngagement/blocked.png' border='0' alt='InActive' title='InActive' >"
                                //        : "<img style='cursor: pointer;' id='StatusImg_" + this.Id + "' onclick='StatusUpdate(" + this.Id + "," + this.DisplayInUnscubscribe + ",&#39;" + this.Name + "&#39;,&#39;" + this.GroupDescription + "&#39;)'; src='/images/MobileEngagement/Active.png' border='0' alt='Active' title='Active' >"



                                var tdContent = "";
                                if (this.GroupType == 2)
                                    tdContent += "<a class='ContributePermission' href='/Mobile/MobileGroupByFilter?GroupId=" + this.Id + "' id='ui_tdType_" + this.Id + "'>Dynamic</a>";
                                else if (this.GroupType == 1)
                                    tdContent += "Static";

                                var tbl = "<div id=" + this.Id + " style='text-align: left;' class='itemStyle'>" +
                                                "<div style='float: left; width: 23%;'>" +
                                                "<a href='../MobileEngagement/Visitors?GroupId=" + this.Id + "'>" + this.Name + " </a><span style='cursor: default' title='Count of contacts added in this group'>(" + ((this.GrpCount == undefined || this.GrpCount == null) ? 0 : this.GrpCount) + ")</span></div>" +
                                                "<div style='float: left; width: 25%;'>" +
                                                this.GroupDescription + "</div>" +
                                                //"<div style='float: left; width: 16%;'>" +
                                                //StatusReport2 + "</div>" +
                                                "<div style='float: left; width: 20%;'>" +
                                                "<a id='manage_" + this.Id + "' href='javascript:void(0)' onclick='Manage(" + this.Id + ",&#39;" + this.Name + "&#39;,&#39;" + this.GroupDescription + "&#39;," + this.DisplayInUnscubscribe + ");' alt='Edit/View' title='Edit/View'>Edit/View</a></div>" +
                                                 "<div style='float: left; width: 14%;'>" +
                                                $.datepicker.formatDate("M dd yy", GetJavaScriptDateObjNew(this.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObjNew(this.CreatedDate)) + "</div>" +
                                                "<div style='float: left; width: 10%;text-align:right'>" + tdContent + "</div>" +
                                                "<div style='float: right; width:auto;'>" +
                                                "<a href='javascript:void(0)' onclick='ConfirmedDelete(" + this.Id + ")'><img src='/images/TrashIcon.png' border='0' alt='Delete' title='Delete'></a></div></div>";
                            }
                            if (this.Action == "Updated") {
                                $("#" + $("#hdnUpdateId").val()).replaceWith(tbl.replace("undefined", ""));
                                $("#dvCreateGrp").hide();
                                $("#dvDurationPrint").show();
                                ShowErrorMessage("Group Updated successfully");
                            } else if (this.Action == "Created") {
                                $("#dvReport > div:nth-child(1)").after(tbl.replace("undefined", ""));
                                $("#dvCreateGrp").hide();
                                $("#dvDurationPrint").show();
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
                                ShowErrorMessage("Group created successfully");
                            }
                            else if (response.Table[0].Column1 == "already exists" || this.Action == "already exists") {
                                var AppType = "";
                                $.each(response.Table1, function () {
                                    AppType = this.AppType;
                                });
                                var module = "";
                                if (AppType == 1)
                                    module = "Web & Mobile Analytics"
                                else if (AppType == 2)
                                    module = "Engagement";
                                else if (AppType == 3)
                                    module = "Email Marketing";
                                else if (AppType == 4)
                                    module = "SMS Marketing";
                                else if (AppType == 5)
                                    module = "Mobile Engagement";
                                ShowErrorMessage("The group name is already created under '" + module + "'");
                            }
                        });
                    }
                }
            }
        });
    }
});
//// Status Update
function StatusUpdate(id, status, Name, dis) {
    if (status == 1 || status == true)
        status = 0;
    else
        status = 1
    var inputs2 = { Action: 'StatusUpdate', Id: id, status: status };
    $.ajax({
        url: "../MobileEngagement/SaveGroups",
        type: 'Post',
        data: JSON.stringify({ 'inputs': inputs2 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table[0].Column1 == "updated") {
                var ABC = "";
                if (status == 0 || status == false) {
                    ABC = "Inactivated";
                    $("#StatusImg_" + id).replaceWith("<img style='cursor: pointer;' id='StatusImg_" + id + "' onclick='StatusUpdate(" + id + "," + status + ",&#39;" + Name + "&#39;,&#39;" + dis + "&#39;)'; src='/images/MobileEngagement/blocked.png' border='0' alt='InActive' title='InActive'>");
                    $("#ui_StatusNo").prop("checked", true);
                } else {
                    ABC = "Activated";
                    $("#StatusImg_" + id).replaceWith("<img style='cursor: pointer;' id='StatusImg_" + id + "' onclick='StatusUpdate(" + id + "," + status + ",&#39;" + Name + "&#39;,&#39;" + dis + "&#39;)'; src='/images/MobileEngagement/Active.png' border='0' alt='Active' title='Active'>");
                    $("#ui_StatusYes").prop("checked", true);
                }
                $("#manage_" + id).replaceWith("<a id='manage_" + this.Id + "' href='javascript:void(0)' onclick='Manage(" + id + ",&#39;" + Name + "&#39;,&#39;" + dis + "&#39;," + status + ");' alt='Edit/View' title='Edit/View'>Edit/View</a>");
                ShowErrorMessage("Group '" + Name + "' " + ABC + "!");
            }
        }
    });
}



function ConfirmedDelete(Id) {
    $(function () {
      

        $("#dialog-confirm").dialog({
            resizable: false,
            height: 170,
            modal: true,
            buttons: {
                "Delete": function () {

                    DeleteGroup(Id);
                    $(this).dialog("close");
                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            }
        });
    });

    $("#dialog-confirm").css({ 'font-size': "13px" });
    $(".ui-button-text").css({ 'font-size': "13px" });
    $("#dialog-confirm").css({ 'height': "50px" });
}



DeleteGroup = function (Id) {

    var inputs3 = { Action: 'DeleteGroup', Id: Id };
    $.ajax({
        url: "../MobileEngagement/SaveGroups",
        type: 'Post',
        data: JSON.stringify({ 'inputs': inputs3 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table[0].Column1 == "deleted") {
                $("#" + Id).remove();
                if ($("#hdn_Total").val() > 20) {
                    window.div_Records.innerHTML = ($("#dvReport > div").length - 1) + " out of " + ($("#hdn_Total").val() - 1) + " records";
                    $("#hdn_Total").val($("#hdn_Total").val() - 1);
                }
                else
                    window.div_Records.innerHTML = ($("#dvReport > div").length - 1) + " out of " + ($("#dvReport > div").length - 1) + " records";
                var lngth = $("#dvReport > div").length - 1;
                if (lngth < 1) {
                    $("#dvDefault").show();
                    $("#dvReport").hide();
                    $("#div_ViewMore").hide();
                    $(".headerstyle").remove();
                    $("#dvAddNewGrp").show();
                    $("#dvDurationPrint").show();
                    $("#dvPrintExport").hide();
                    $("#div_Searchboxes").hide();
                    $("#dvCreateGrp").hide();
                }
                ShowErrorMessage("Deleted successfully!");
            }
        }
    });
    $("#dvDeletePanel").hide();
   
};

 