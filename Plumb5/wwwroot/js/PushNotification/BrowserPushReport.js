
var maxRowCount = 0, rowIndex = 0, viewMoreDisable = false, Offset = 0;

$(document).ready(function () {
    GetDateTimeRange(1);
});

var CallBackFunction = function () {
    maxRowCount = OffSet = rowIndex = 0;
    $("#ui_dvData").empty();
    GetMaxCount();
};

function GetMaxCount() {
    $.ajax({
        url: "/Push/BrowserPushReport/GetMaxCount",
        type: 'POST',
        data: JSON.stringify({ 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
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
        url: "/Push/BrowserPushReport/GetReportData",
        type: 'Post',
        data: JSON.stringify({ 'OffSet': OffSet, 'FetchNext': FetchNext, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: CampaignResponse,
        error: ShowAjaxError
    });
}

function CampaignResponse(response) {

    if (response.length > 0) {

        $("#dvDefault").hide();

        rowIndex = response.length + rowIndex;
        $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");

        if (rowIndex == maxRowCount) {
            $("#ui_lnkViewMore").hide();
        }

        if (rowIndex > 1 || maxRowCount > 1) {
            $("#dvTipsExport").show();
        }

        $("#ui_dvContent").show();

        $.each(response, function (i) {

            var TemplateName = $(this)[0].BrowserPushCampaignName == null ? "NA" : $(this)[0].BrowserPushCampaignName.length > 25 ? $(this)[0].BrowserPushCampaignName.substring(0, 25) + ".." : $(this)[0].BrowserPushCampaignName;
            var GroupName = $(this)[0].SentTo == null ? "NA" : $(this)[0].SentTo.length > 25 ? $(this)[0].SentTo.substring(0, 25) + ".." : $(this)[0].SentTo;

            var tdContent = "<div style='float: left; width: 20%;' title='" + $(this)[0].BrowserPushCampaignName + "'><label style='position: absolute;margin-top: -2px;padding-left: 5px;' title='" + $(this)[0].BrowserPushCampaignName + "'> " + TemplateName + "</label><img src='/images/img_trans.gif' border='0' onclick=\"ShowPushDetails(" + $(this)[0].Id + ")\" class='ExtraDetailsImage' alt='' title='Campaign Sent Details' /></div>";
            tdContent += "<div style='float: left; width: 15%;' title= '" + $(this)[0].SentTo + "'>" + GroupName + "</div>";
            tdContent += " <div style='float: left; width: 8%;text-align: right;'><a class='IsSMSContributor' href='../Push/PushReport?BrowserPushSendingSettingId=" + $(this)[0].Id + "&action=0&tab=Push'>&nbsp;" + $(this)[0].TotalSent + "&nbsp;</a></div>";
            tdContent += " <div style='float: left; width: 7%;text-align: right;'><a class='IsSMSContributor' href='../Push/PushReport?BrowserPushSendingSettingId=" + $(this)[0].Id + "&action=1&tab=Push'>&nbsp;" + $(this)[0].TotalViewed + "&nbsp;</a></div>";
            tdContent += " <div style='float: left; width: 7%;text-align: right;'><a class='IsSMSContributor' href='../Push/PushReport?BrowserPushSendingSettingId=" + $(this)[0].Id + "&action=2&tab=Push'>&nbsp;" + $(this)[0].TotalClicked + "&nbsp;</a></div>";
            tdContent += " <div style='float: left; width: 7%;text-align: right;'><a class='IsSMSContributor' href='../Push/PushReport?BrowserPushSendingSettingId=" + $(this)[0].Id + "&action=3&tab=Push'>&nbsp;" + $(this)[0].TotalClosed + " &nbsp;</a></div>";
            tdContent += " <div style='float: left; width: 7%;text-align: right;'><a class='IsSMSContributor' href='../Push/PushReport?BrowserPushSendingSettingId=" + $(this)[0].Id + "&action=4&tab=Push'>&nbsp;" + $(this)[0].TotalBounced + " &nbsp;</a></div>";
            tdContent += " <div style='float: left; width: 9%;text-align: right;'><a class='IsSMSContributor' href='../Push/PushReport/BlockPushReport?BrowserPushSendingSettingId=" + $(this)[0].Id + "&action=5&tab=Push&GroupName=" + $(this)[0].SentTo + "'>&nbsp;" + $(this)[0].TotalNotSent + "&nbsp;</a></div>";
            tdContent += " <div style='float: left; width: 20%;text-align: right;'> " + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].CreatedDate)) + "</div>";
            $("#ui_dvData").append("<div id='ui_div_" + $(this)[0].Id + "' class='itemStyle'>" + tdContent + "</div>");
        });
    }
    viewMoreDisable = false;
    $("#dvLoading").hide();    
}


function ShowPushDetails(Id) {

    $(".bgShadedDiv").show();
    $("#dvSentPushDetails").show();

    $("#lDLCampaignIdentifier").html("");
    $("#lblTemplateName").html("");
    $("#lblTemplateContent").html("");
    $("#lblCampaignName").html("");
    $("#lblCampaignType").html("");

    var BrowserPushSendingSettingId = Id;
    $.ajax({
        url: "/Push/BrowserPushReport/GetBrowserPushSentDetails",
        type: 'POST',
        data: JSON.stringify({ 'BrowserPushSendingSettingId': BrowserPushSendingSettingId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#lDLCampaignIdentifier").html(': ' + response.PushSendingSetting.Name);
            $("#lblTitle").html(': ' + response.BrowserPushTemplate.Title);
            $("#lblRedirectUrl").html(': ' + (response.BrowserPushTemplate.RedirectTo != undefined && response.BrowserPushTemplate.RedirectTo != null && response.BrowserPushTemplate.RedirectTo != "" ? response.BrowserPushTemplate.RedirectTo : "NA"));
            $("#lblTemplateContent").html(': ' + response.BrowserPushTemplate.Message);
        },
        error: ShowAjaxError
    });
}
