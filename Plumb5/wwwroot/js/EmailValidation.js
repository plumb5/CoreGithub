var featureId = 0;
var maxRowCount = 0, rowIndex = 0, viewMoreDisable = false, Offset = 0;
$(document).ready(function () {
    $("#tab11").css('font-weight', 'bold');
    GetDateTimeRange(2);
});

var CallBackFunction = function () {
    GetTotalCount();
};

function GetTotalCount() {
    featureId = 18;
    $("#ui_dvData").empty();
    maxRowCount = 0, rowIndex = 0, viewMoreDisable = false, Offset = 0;
    $.ajax({
        url: "/Account/GetEmailValidationTotalCount",
        type: 'POST',
        data: JSON.stringify({ 'featureId': featureId, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response >= 0)
                $("#ui_spanTotalConsumeCount").html('Total Comsumption = ' + response);
            else
                $("#ui_spanTotalConsumeCount").html('Total Comsumption = 0');

            GetMaxCount();
        },
        error: ShowAjaxError
    });
}

function GetMaxCount() {
    $.ajax({
        url: "/Account/GetEmailValidationMaxCount",
        type: 'POST',
        data: JSON.stringify({ 'featureId': featureId, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            maxRowCount = response;
            if (maxRowCount === 0) {
                $("#div_ViewMore, #dvLoading, #ui_dvContent").hide();
                $("#dvDefault").show();
            }
            else if (maxRowCount > 0) {
                $("#dvDefault").hide();
                var numberOfRecords = GetNumberOfRecordsPerPage();
                CreateTable(numberOfRecords);
                $("#div_ViewMore").show();
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
        url: "/Account/GetEmailValidationData",
        type: 'Post',
        data: JSON.stringify({ 'featureId': featureId, 'OffSet': OffSet, 'FetchNext': FetchNext, 'fromdate': FromDateTime, 'todate': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindData,
        error: ShowAjaxError
    });
}

function BindData(response) {
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
            var tdContent = "";
            tdContent = "<div style='float: left; width: 30%; text-align: left;' title='Hubuco Email Validation'>Hubuco Email Validation</div>";
            tdContent += "<div style='float: left; width: 40%; text-align: center;' title='" + $(this)[0].DayDiffernce + "'>" + $(this)[0].DayDiffernce + "</div>";
            tdContent += " <div style='float: right; text-align: right;'> " + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].CreateDate));

            $("#ui_dvData").append("<div class='itemStyle'>" + tdContent + "</div>");
        });
    }
    viewMoreDisable = false;
    $("#dvLoading").hide();
}

function GetCounts() {
    $("#dvLoading").show();
    maxRowCount = 0, rowIndex = 0, viewMoreDisable = false, Offset = 0;
    $("#ui_dvData").empty();
    GetMaxCount();
}

function ExportValidationDetails() {
    $("#dvLoading").show();

    if (maxRowCount > 0) {
        $.ajax({
            url: "/Account/ExportValidation",
            type: 'Post',
            data: JSON.stringify({ 'featureId': featureId, 'OffSet': 0, 'FetchNext': maxRowCount, 'fromdate': FromDateTime, 'todate': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status) {
                    SaveToDisk(response.MainPath);
                    ShowErrorMessage("File downloaded successfully");
                }
                else
                    ShowErrorMessage("File not downloaded.Please try again after some time!!");
                $("#dvLoading").hide();
            },
            error: ShowAjaxError
        });
    }
    else {
        ShowErrorMessage("No data to export");
        $("#dvLoading").hide();
    }
}

function SaveToDisk(fileURL) {
    window.location.assign(fileURL);
}