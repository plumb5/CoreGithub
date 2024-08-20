
var maxRowCount = 0, rowIndex = 0, viewMoreDisable = false;

var setRuledetails = { RuleId: 0, TriggerStatus: 0 };

$(document).ready(function () {
    GetMaxCount();
});

function GetMaxCount() {
    $.ajax({
        url: "/RuleDashBoard/GetMaxCount",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            maxRowCount = response.returnVal;
            if (maxRowCount == 0) {
                $("#dvViewMore, #dvLoading, #ui_dvContent").hide();
                $("#dvDefault").show();
            }
            else if (maxRowCount > 0) {
                $("#dvDefault").hide();
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

function CreateTable(numberRowsCount) {

    var OffSet = rowIndex;
    var FetchNext = numberRowsCount;

    $.ajax({
        url: "/RuleDashBoard/GetAllRules",
        type: 'Post',
        data: JSON.stringify({ 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: onSuccess,
        error: ShowAjaxError
    });
}

function onSuccess(response) {

    rowIndex = response.length + rowIndex;
    $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");

    if (rowIndex == maxRowCount) {
        $("#ui_lnkViewMore").hide();
    }
    if (rowIndex >= 1 || maxRowCount >= 1) {
        $("#dvTipsExport").show();
    }

    $("#ui_dvContent").show();

    $.each(response, function (i) {
        var tdContent = " <div style='float: left; width: 50%; text-align: left;'>" + $(this)[0].TriggerHeading + "</div>";

        if ($(this)[0].TriggerStatus == true) {
            tdContent += "<div style='float: left; width: 10%;text-align: left;cursor: pointer;'><img id='imgStatus_" + $(this)[0].RuleId + "' src='/images/img_trans.gif' class='ActiveImg ContributePermission' onclick='ToogleStatus(" + $(this)[0].RuleId + ");' border='0' alt='Active' title='Active' style='border:0px;cursor:pointer'/></div>";
        }
        else if ($(this)[0].TriggerStatus == false) {
            tdContent += "<div style='float: left; width: 10%;text-align: left;cursor: pointer;'><img id='imgStatus_" + $(this)[0].RuleId + "' src='/images/img_trans.gif' class='InactiveImg ContributePermission'  src='/images/img_trans.gif' onclick='ToogleStatus(" + $(this)[0].RuleId + ");' border='0' alt='Stoped' title='InActive' style='border:0px;cursor:pointer'/></div>";
        }

        var IsMailOrSMSTrigger = "";

        //if ($(this)[0].IsMailOrSMSTrigger == 1) {
        //    IsMailOrSMSTrigger = "Mail";
        //}
        //else if ($(this)[0].IsMailOrSMSTrigger == 0) {
        //    IsMailOrSMSTrigger = "SMS";
        //}

        //tdContent += " <div style='float: left; width: 15%;text-align:right;'>" + IsMailOrSMSTrigger + "</div>";
        tdContent += " <div style='float: left; width: 30%;text-align: left;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].TriggerCreateDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].TriggerCreateDate)) + "</div>";
        tdContent += " <div style='float: left; width: 5%;text-align:right;'><a class='IsTriggerContributor ContributePermission' href='/WorkFlow/Rules?RuleId=" + $(this)[0].RuleId + "'><img src='/images/configEdit.jpg' border='0' alt='Edit' title='Edit' style='cursor:pointer;width: 20px;' /></a></div>";
        tdContent += "<div style='float: right; width: 5%;text-align: right;'><a class='FullControlPermission' href='javascript:void(0);' onclick='DeleteConfirmation(" + $(this)[0].RuleId + ");'><img src='/images/configdel.jpg' border='0' alt='Delete' title='Delete' style='cursor:pointer;width: 20px;' /></a></div>";
        $("#ui_dvData").append("<div id='tr_" + $(this)[0].RuleId + "' class='itemStyle'>" + tdContent + "</div>");
    });
    viewMoreDisable = false;
    $("#dvLoading").hide();
    //CheckAccessPermission("Mail");
}

ConfirmedDelete = function (RuleId) {

    $("#dvDeletePanel").hide();
    $.ajax({
        url: "/RuleDashBoard/Delete",
        type: 'POST',
        data: JSON.stringify({ 'RuleId': RuleId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                --rowIndex;
                --maxRowCount;
                $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");
                $("#tr_" + RuleId).hide("slow");
                if (rowIndex <= 0 || maxRowCount <= 0) {
                    $("#ui_dvContent").hide();
                    $("#dvTipsExport").hide();
                    $("#dvDefault").show();
                }
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
};

function ToogleStatus(RuleId) {
    $("#dvLoading").show();

    setRuledetails.RuleId = RuleId;

    if ($("#imgStatus_" + RuleId).hasClass("InactiveImg"))
        setRuledetails.TriggerStatus = 1;
    else
        setRuledetails.TriggerStatus = 0;

    $.ajax({
        url: "/RuleDashBoard/ToogleStatus",
        type: 'POST',
        data: JSON.stringify({ 'setRuledetails': setRuledetails }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                if (setRuledetails.TriggerStatus == 1)
                    $("#imgStatus_" + RuleId).removeClass("InactiveImg").addClass("ActiveImg").attr("title", "Toogle to inactive");
                else
                    $("#imgStatus_" + RuleId).removeClass("ActiveImg").addClass("InactiveImg").attr("title", "Toogle to active");
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
}
