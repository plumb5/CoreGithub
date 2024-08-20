
var maxRowCount = 0, rowIndex = 0, viewMoreDisable = false, Offset = 0;
var logDetails = {};

$(document).ready(function () {
    GetDateTimeRange(2);
});

var CallBackFunction = function () {
    maxRowCount = OffSet = rowIndex = 0;
    $("#ui_dvData").empty();
    GetMaxCount();
};

function GetMaxCount() {
    $.ajax({
        url: "/Logs/GetMaxCount",
        type: 'POST',
        data: JSON.stringify({ 'logDetails': logDetails, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            maxRowCount = response;
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
        url: "/Logs/GetReportData",
        type: 'Post',
        data: JSON.stringify({ 'logDetails': logDetails, 'OffSet': OffSet, 'FetchNext': FetchNext, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
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
            var UserName = $(this)[0].UserName == null ? 'NA' : $(this)[0].UserName.length > 10 ? $(this)[0].UserName.substring(0, 15) + '..' : $(this)[0].UserName;
            var ChannelType = $(this)[0].ChannelType == null ? 'NA' : $(this)[0].ChannelType.length > 15 ? $(this)[0].ChannelType.substring(0, 15) + ".." : $(this)[0].ChannelType;       
            var Description = $(this)[0].ActionDescription == null ? 'NA' : $(this)[0].ActionDescription.length > 50 ? $(this)[0].ActionDescription.substring(0, 100) + ".." : $(this)[0].ActionDescription;
            var IpAddress = $(this)[0].IpAddress == null ? 'NA' : $(this)[0].IpAddress.length > 15 ? $(this)[0].IpAddress.substring(0, 15) + ".." : $(this)[0].IpAddress;

            var tdContent = "<div style='float: left; width: 10%;' title= '" + $(this)[0].UserName + "'>" + UserName + "</div>";
            tdContent += "<div style='float:left; width:10%;' title='" + $(this)[0].ChannelType + "'>" + ChannelType + "</div>";
            tdContent += "<div style='float:left; width:10%;' title='" + $(this)[0].IpAddress + "'>" + IpAddress + "</div>";
            tdContent += "<div style='float:left; width:50%;' title='" + $(this)[0].ActionDescription + "'>" + Description + "</div>";
            tdContent += " <div style='float: left; width: 20%;text-align: right;'> " + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].CreatedDate)) + "</div>";

            $("#ui_dvData").append("<div class='itemStyle'>" + tdContent + "</div>");
        });
    }
    viewMoreDisable = false;
    $("#dvLoading").hide();
}

