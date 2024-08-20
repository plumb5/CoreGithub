var maxRowCount = 0, Offset = 0, rowIndex = 0;
var viewMoreDisable = false;

var FromDate, ToDate;

$(document).ready(function () {
    $("#dvLoading").show();
    GetDateTimeRange(2);
});

CallBackFunction = function () {
    FromDate = FromDateTime;
    ToDate = ToDateTime;
    maxRowCount = Offset = rowIndex = 0;
    MaxCount();
};

function MaxCount() {
    $("#ui_dvData").empty();
    $.ajax({
        url: "/WorkFlow/AppPushRespose/MaxCount",
        type: 'POST',
        data: JSON.stringify({ 'FromDate': FromDate, 'ToDate': ToDate }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            maxRowCount = response.returnVal;
            if (maxRowCount == 0) {
                $("#div_ViewMore, #dvLoading, #ui_dvContent,#dvTipsExport").hide();
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
        url: "/WorkFlow/AppPushRespose/GetReportDetails",
        type: 'Post',
        data: JSON.stringify({ 'OffSet': OffSet, 'FetchNext': FetchNext, 'FromDate': FromDate, 'ToDate': ToDate }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReportDetails,
        error: ShowAjaxError
    });
}

function BindReportDetails(response) {

    rowIndex = response.length + rowIndex;
    $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");

    if (rowIndex == maxRowCount) {
        $("#ui_lnkViewMore").hide();
    }

    $("#ui_dvContent,#dvTipsExport").show();

    $.each(response, function () {
        EachDataBind($(this)[0]);
    });

    $("#dvLoading").hide();
    viewMoreDisable = false;
}

function EachDataBind(DataSet) {
    var Name = DataSet.Name == null ? "NA" : DataSet.Name.length > 20 ? DataSet.Name.substring(0, 20) + ".." : DataSet.Name;
    var tdContent = "<div style='float: left; width: 15%; text-align: left;' title=\"" + DataSet.Name + "\">" + Name + "</div>";
    tdContent += "<div style='float: left; width: 10%;text-align: right;'>" + DataSet.TotalAndroidSent + "</div>";
    tdContent += "<div style='float: left; width: 10%;text-align: right;'>" + DataSet.TotalAndroidFailed + "</div>";
    tdContent += "<div style='float: left; width: 10%;text-align: right;'>" + DataSet.TotalIOSSent + "</div>";
    tdContent += "<div style='float: left; width: 10%;text-align: right;'>" + DataSet.TotalIOSFailed + "</div>";

    var RequestTime = new Date();
    if (DataSet.RequestTime == null || DataSet.RequestTime == undefined)
        tdContent += "<div style='float: left; width: 15%;text-align: right;'>NA</div>";
    else {
        RequestTime = ConvertUTCDateTimeToLocal(DataSet.RequestTime);
        tdContent += "<div style='float: left; width: 15%;text-align: right;'>" + $.datepicker.formatDate("M dd yy", RequestTime) + " " + PlumbTimeFormat(RequestTime) + "</div>";
    }

    //var ResponseTime = new Date();
    //if (DataSet.ResponseTime == null || DataSet.ResponseTime == undefined)
    //    tdContent += "<div style='float: left; width: 15%;text-align: right;'>NA</div>";
    //else {
    //    ResponseTime = ConvertUTCDateTimeToLocal(DataSet.ResponseTime);
    //    tdContent += "<div style='float: left; width: 15%;text-align: right;'>" + $.datepicker.formatDate("M dd yy", ResponseTime) + " " + PlumbTimeFormat(ResponseTime) + "</div>";
    //}

    //var CreatedDate = new Date();
    //if (DataSet.CreatedDate == null || DataSet.CreatedDate == undefined)
    //    tdContent += "<div style='float: left; width: 15%;text-align: right;'>NA</div>";
    //else {
    //    CreatedDate = ConvertUTCDateTimeToLocal(DataSet.CreatedDate);
    //    tdContent += "<div style='float: left; width: 15%;text-align: right;'>" + $.datepicker.formatDate("M dd yy", CreatedDate) + " " + PlumbTimeFormat(CreatedDate) + "</div>";
    //}

    $("#ui_dvData").append("<div class='itemStyle'>" + tdContent + "</div>");
}