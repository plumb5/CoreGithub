var maxRowCount = 0, rowIndex = 0, WorkflowId = 0; viewMoreDisable = false; var count = 1;
var workflowConfig = { Status: -1, Title: '' };
$(document).ready(function () {
    $("#dvLoading").show();
    GetMaxCount();
});
$(function () {
    $("form").submit(function () {
        rowIndex = 0;
        count = 1;
        numberRowsCount = 0;
        $("#dvReport").empty();
        GetMaxCount();
        return false;
    });
});
function GetMaxCount() {
    workflowConfig.Status = $("#drp_onstatuschange").val();
    workflowConfig.Title = $("#txttitlename").val();
    $.ajax({
        url: "/WorkFlow/Dashboard/GetMaxCount",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ 'workflow': workflowConfig }),
        success: function (result) {
            maxRowCount = result;
            if (maxRowCount == 0) {
                $("#dvLoading, #ui_dvContent, #dvTipsExport").hide();
                if ($("#dv_BindingValue").attr("SearchId") == 0) {
                    //ClearValues();
                }
                else {
                    $("#dvDefault").show();
                    $("#divcontent").hide();

                }
            }
            else if (maxRowCount > 0) {
                $("#dvDefault").hide();
                $("#divcontent").show();
                var numberOfRecords = GetNumberOfRecordsPerPage();

                CreateTable(numberOfRecords);
                if (maxRowCount > numberOfRecords) {
                    $("#ui_lnkViewMore").show();
                }
            }
        },
        error: ShowAjaxError
    });
}

function ViewMore() {
    if (!viewMoreDisable) {
        $("#dvLoading").show();
        viewMoreDisable = true;
        var numberOfRecords = GetNumberOfRecordsPerPage();
        CreateTable(numberOfRecords);
    }
}
function fn_ChangeRecordsPerPage() {
    rowIndex = 0;
    count = 1;
    numberRowsCount = 0;
    $("#dvReport").empty();
    var numberOfRecords = GetNumberOfRecordsPerPage();
    CreateTable(numberOfRecords);
}

GetNumberOfRecordsPerPage = function () {
    if ($("#drp_RecordsPerPage").length > 0) {
        if ($("#drp_RecordsPerPage").val().toString().toLowerCase() == "all")
            return 5000;
        else
            return parseInt($("#drp_RecordsPerPage").val());
    }
    return 20;
};
function CreateTable(numberRowsCount) {

    workflowConfig.Status = $("#drp_onstatuschange").val();
    workflowConfig.Title = $("#txttitlename").val();
    var OffSet = rowIndex;
    var FetchNext = numberRowsCount;
    $.ajax({
        url: "/WorkFlow/Dashboard/GetDashboardData",
        type: 'POST',
        data: JSON.stringify({ 'workflow': workflowConfig, 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: onSuccess,
        error: ShowAjaxError
    });
}
$(function () {
    $('#drp_onstatuschange').change(function () {
        rowIndex = 0;
        count = 1;
        numberRowsCount = 0;
        $("#dvReport").empty();
        GetMaxCount();
    })
})

function onSuccess(responseData) {
    if (responseData != null && responseData.length > 0) {
        rowIndex = responseData.length + rowIndex;
        var TotalEnteredCount;
        $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");
        if (rowIndex == maxRowCount) {
            $("#ui_lnkViewMore").hide();
        }
        $("#ui_dvContent").show();
        $.each(responseData, function (i) {
            var workflowStatus = "", color = "#bdbaba";
            var manageImg = '/images/workflow-view.jpg'; var wfTitle = "View";
            if ($(this)[0].Status == 0) {
                workflowtype = "Stopped"; color = "rgba(207,63,63,.7);";
            }
            else if ($(this)[0].Status == 1) {
                workflowtype = "Running"; color = "rgba(13, 177, 78, 0.7);";
            }
            else if ($(this)[0].Status == 2) {
                workflowtype = "Draft";
                color = "#bdbaba";
                manageImg = '/images/configEdit.jpg'; wfTitle = "Edit";
            }
            var GetTitle = $(this)[0].Title;
            GetTitle = GetTitle.charAt(0).toUpperCase() + GetTitle.slice(1);

            var date1 = new Date();// for current date
            var date2 = new Date($(this)[0].LastUpdatedDate);
            var yearDiff = date1.getFullYear() - date2.getFullYear();// for year difference
            var y1 = date1.getFullYear();
            var y2 = date2.getFullYear();
            var monthDiff = (date1.getMonth() + y1 * 12) - (date2.getMonth() + y2 * 12);
            var day1 = parseInt(date1.getDate());
            var day2 = parseInt(date2.getDate());
            var dayDiff = (day1 - day2) + (monthDiff * 30);
            if (dayDiff === 1) {
                dayDiff = "Yesterday by ";
            }
            else if (dayDiff === 0) {
                dayDiff = "Today by ";
            }
            else {
                dayDiff = dayDiff + " days ago by ";
            }

            
            var tdContent = " <div style='float: left; width: 45%; text-align: left;'><a href='Dashboard/Report?WorkFlowId=" + $(this)[0].WorkFlowId + "'>" + GetTitle + "</a></div>";
            tdContent += "<div style='float: left; width: 10%;text-align: left;color:" + color + ";'>" + workflowtype + "</div>";
            tdContent += "<div style='float: left; width: 10%;text-align: left;' id='ui_txtWork" + $(this)[0].WorkFlowId + "'>" + getEnteredCount($(this)[0].WorkFlowId, rowIndex, $(this)[0].Status) + "</div>";
            tdContent += "<div class=\"hover\" style='float: left;cursor:pointer; width: 20%;text-align: left;'>" + dayDiff + " " + $(this)[0].UserName + "<div class=\"tooltip\">" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].LastUpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].LastUpdatedDate)) + "</div></div>";
            //   tdContent += "<div style='float: left; width: 20%;text-align: left;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].LastUpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].LastUpdatedDate)) + "</div>";
            tdContent += "<div style='float: left; width: 5%;text-align: right;'><a href='javascript:void(0)' onclick='CopyofWorkflow(" + $(this)[0].WorkFlowId + ");'><img src='/images/copy.jpg' border='0' alt='Copy' title='Copy' style='cursor:pointer;width: 20px;' /></a></div>";
            tdContent += " <div style='float: left; width:5%;text-align: right;'><a href='Create?WorkFlowId=" + $(this)[0].WorkFlowId + "'><img src='" + manageImg + "' border='0' alt='Edit' title='"+wfTitle+"' style='cursor:pointer;width: 20px;' /></a></div>";
            tdContent += "<div style='float: right; width:5%;text-align: right;'><a href='javascript:void(0);' onclick='DeleteWorkflow(" + $(this)[0].WorkFlowId + ");'><img src='/images/configdel.jpg' border='0' alt='Delete' title='Delete' style='cursor:pointer;width: 20px;' /></a></div>";
            $("#dvReport").append("<div id='tr_" + $(this)[0].WorkFlowId + "' class='itemStyle'>" + tdContent + "</div>");
        });
    }
    viewMoreDisable = false;
}

function getEnteredCount(wfid, maxRowCount, workflowstatuss) {

    var enter = 0;
    if (workflowstatuss != 2) {
        $.ajax({
            url: "/WorkFlow/Dashboard/GetConfigDetailByWorkFlowId",
            type: 'POST',
            data: JSON.stringify({ 'WorkflowId': wfid }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null) {
                    if (response > 0)
                    { animateNumber(response, "ui_txtWork" + wfid) } else { $("#ui_txtWork" + wfid).html("<b>0</b>"); }
                }
                else { $("#ui_txtWork" + wfid).html("<b>0</b>"); }
            },

            error: ShowAjaxError
        });
    }
    else { enter = "<b>0</b>"; }
    if (maxRowCount == count) {
        $("#dvLoading").hide();
    }
    count = count + 1;
    return enter;

}
DeleteWorkflow = function (WorkflowId) {

    $(function () {
        $("#dialog-confirm").dialog({
            resizable: false,
            height: 170,
            modal: true,
            buttons: {
                "Delete": function () {
                    Delete(WorkflowId);
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
    $("#ui-dialog- title").css({ 'font-size': "13px" });
};
function Delete(WorkflowId) {
    $("#dvLoading").show();
    $.ajax({
        url: "/WorkFlow/Dashboard/DeleteWorkflow",
        type: 'POST',
        data: JSON.stringify({ 'WorkflowId': WorkflowId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            $("#tr_" + WorkflowId).hide("slow");
            --rowIndex;
            --maxRowCount;
            $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");
            if (rowIndex <= 0 || maxRowCount <= 0) {
                $("#divcontent").hide();
                $("#dvDefault").show();
                $("#dvViewMore").hide();
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
}
function CopyofWorkflow(workflowid) {
    var color = "#bdbaba";
    $.ajax({
        url: "/WorkFlow/Dashboard/CopyOfWorkFlow",
        type: 'POST',
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ 'WorkflowId': workflowid }),
        success: function (response) {

            var date1 = new Date();// for current date
            var date2 = new Date(response.LastUpdatedDate);
            var yearDiff = date1.getFullYear() - date2.getFullYear();// for year difference
            var y1 = date1.getFullYear();
            var y2 = date2.getFullYear();
            var monthDiff = (date1.getMonth() + y1 * 12) - (date2.getMonth() + y2 * 12);
            var day1 = parseInt(date1.getDate());
            var day2 = parseInt(date2.getDate());
            var dayDiff = (day1 - day2) + (monthDiff * 30);
            if (dayDiff === 1) {
                dayDiff = "Yesterday by ";
            }
            else if (dayDiff === 0) {
                dayDiff = "Today by ";
            }
            else {
                dayDiff = dayDiff + " days ago by ";
            }
            var tdContent = "<div style='float: left; width: 45%; text-align: left;'><a href='Dashboard/Report?WorkFlowId=" + response.WorkFlowId + "'>" + response.Title + "</a></div>";
            tdContent += "<div style='float: left; width: 10%;text-align: left;color:" + color + ";'>Draft</div>";
            tdContent += "<div style='float: left; width: 10%;text-align: left;' ><b>0</b></div>";
            tdContent += "<div class=\"hover\" style='float: left; width: 20%;text-align: left;cursor:pointer;'>" + dayDiff + " " + response.UserName + "<div class=\"tooltip\">" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response.LastUpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(response.LastUpdatedDate)) + "</div></div>";

            //tdContent += "<div style='float: left; width: 20%;text-align: left;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(response.CreatedDate)) + "</div>";
            tdContent += "<div style='float: left; width: 5%;text-align: right;'><a href='javascript:void(0)' onclick='CopyofWorkflow(" + response.WorkFlowId + ");'><img src='/images/configEdit.jpg' border='0' alt='Copy' title='Copy' style='cursor:pointer;width: 20px;' /></a></div>";
            tdContent += "<div style='float: left; width:5%;text-align: right;'><a href='Create?WorkFlowId=" + response.WorkFlowId + "'><img src='/images/configEdit.jpg' border='0' alt='Edit' title='Edit' style='cursor:pointer;width: 20px;' /></a></div>";
            tdContent += "<div style='float: right; width:5%;text-align: right;'><a href='javascript:void(0);' onclick='DeleteWorkflow(" + response.WorkFlowId + ");'><img src='/images/configdel.jpg' border='0' alt='Delete' title='Delete' style='cursor:pointer;width: 20px;' /></a></div>";
            $("#dvReport").before("<div id='tr_" + response.WorkFlowId + "' class='itemStyle'>" + tdContent + "</div>");


        },
        error: ShowAjaxError
    });
}
$('#ui_btnCopyCancel').on('click', function () {
    $(".bgShadedDiv").hide();
    $(".CustomPopUp").hide("fast");
});
function animateNumber(val, counter) {

    var endVal = parseInt(val);
    if (endVal == 0) { return "<b>0<b/>"; }
    else {
        this.disabled = true;
        var currentVal = endVal > 8 ? endVal - 5 : 0;
        var i = setInterval(function () {
            if (currentVal === endVal) {
                $("#" + counter).html("<b>" + currentVal + "<b/>");
                clearInterval(i);
            }
            else {
                currentVal++;
                //console.log(currentVal);
                $("#" + counter).html(currentVal);
            }
        }, 500);
        return currentVal;
    }
}