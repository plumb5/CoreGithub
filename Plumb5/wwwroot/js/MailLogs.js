var maxRowCount = 0, rowIndex = 0, viewMoreDisable = false, Offset = 0;

$(document).ready(function () {
    GetDateTimeRange(2);
});

function SaveToDisk(fileURL) {
    window.location.assign(fileURL);
}

var CallBackFunction = function () {
    GetMailCount();
    GetReportForMail();
};

function GetMailCount() {
    $.ajax({
        url: "/MailLogs/GetOverAllCount",
        type: 'POST',
        data: JSON.stringify({ 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#ui_spanTotalMailCount").html('Total Mail Sent = ' + response);
        },
        error: ShowAjaxError
    });
}

function GetMaxCountIndividual() {
    $.ajax({
        url: "/MailLogs/GetMaxCountIndividual",
        type: 'POST',
        data: JSON.stringify({ 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            maxRowCount = response;
            $("#ui_spanMailCount").html('Individual Mail Sent = ' + response);
            if (maxRowCount === 0) {
                $("#div_IndividualViewMore, #dvLoading, #ui_dvIndividualContent").hide();
                $("#div_CampaignViewMore, #dvLoading, #ui_dvCampaignContent").hide();
                $("#dvDefault").show();
            }
            else if (maxRowCount > 0) {
                $("#dvDefault").hide();
                var numberOfRecords = GetNumberOfRecordsPerPage();
                CreateTableIndividual(numberOfRecords);
                $("#div_IndividualViewMore").show();
                if (maxRowCount > numberOfRecords) {
                    $("#ui_lnkIndividualViewMore").show();
                }
            }
        },
        error: ShowAjaxError
    });
}

function ViewMoreIndividual() {
    if (!viewMoreDisable) {
        $("#dvLoading").show();
        viewMoreDisable = true;
        var numberOfRecords = GetNumberOfRecordsPerPage();
        CreateTableIndividual(numberOfRecords);
    }
}

function CreateTableIndividual(numberRowsCount) {

    var OffSet = rowIndex;
    var FetchNext = numberRowsCount;

    $.ajax({
        url: "/MailLogs/GetIndividualData",
        type: 'Post',
        data: JSON.stringify({ 'OffSet': OffSet, 'FetchNext': FetchNext, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindIndividualData,
        error: ShowAjaxError
    });
}

function BindIndividualData(response) {

    if (response.length > 0) {

        $("#dvDefault").hide();

        rowIndex = response.length + rowIndex;
        $("#div_IndividualRecords").html(rowIndex + " out of " + maxRowCount + " records");

        if (rowIndex == maxRowCount) {
            $("#ui_lnkIndividualViewMore").hide();
        }

        if (rowIndex > 1 || maxRowCount > 1) {
            $("#dvTipsExport").show();
        }

        $("#ui_dvIndividualContent").show();

        $.each(response, function (i) {

            var tdContent = "";
            if ($(this)[0].ToEmailId !== null)
                tdContent = "<div style='float: left; width: 15%; text-align: left;' title= '" + $(this)[0].ToEmailId + "'>" + $(this)[0].ToEmailId + "</div>";
            else
                tdContent = "<div style='float: left; width: 15%; text-align: left;' title='NA'>NA</div>";

            if ($(this)[0].Name !== null)
                tdContent += "<div style='float: left; width: 15%; text-align: center;' title='" + $(this)[0].Name + "'>" + $(this)[0].Name + "</div>";
            else
                tdContent += "<div style='float: left; width: 15%; text-align: center;'>Mail Body</div>";

            tdContent += "<div style='float: left; width: 20%; text-align: center;' title='" + $(this)[0].MailCount + "'>" + $(this)[0].MailCount + "</div>";
            tdContent += "<div style='float: left; width: 15%; text-align: center;' title='" + $(this)[0].MailSource + "'>" + $(this)[0].MailSource + "</div>";
            tdContent += "<div style='float: left; width: 15%; text-align: center;' title='" + $(this)[0].MailVendor + "'>" + $(this)[0].MailVendor + "</div>";
            tdContent += " <div style='float: right; width: 20%;text-align: right;'> " + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].SentDate)) + "</div>";

            $("#ui_dvIndividualData").append("<div id='IndividualMailLog_" + $(this)[0].Id + "' class='itemStyle'>" + tdContent + "</div>");
        });
    }
    viewMoreDisable = false;
    $("#dvLoading").hide();
}

function GetReportForMail() {
    maxRowCount = OffSet = rowIndex = 0;
    $("#ui_dvIndividualData").empty();
    $("#ui_dvCampaignData").empty();
    $("#ui_dvIndividualContent").hide();
    $("#ui_dvCampaignContent").hide();
    $("#div_CampaignRecords").html('');
    $("#div_IndividualRecords").html('');

    var getReportFor = parseInt($("#drp_LogType").val());
    if (getReportFor == 1)
        GetMaxCountIndividual();
    else {
        GetCampaignMailCount();
        GetMaxCountCampaign();
    }
}

function GetMaxCountCampaign() {
    $.ajax({
        url: "/MailLogs/GetMaxCountCampaign",
        type: 'POST',
        data: JSON.stringify({ 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            maxRowCount = response;

            if (maxRowCount === 0) {
                $("#dvIndividualViewMore, #dvLoading, #ui_dvIndividualContent").hide();
                $("#div_CampaignViewMore, #dvLoading, #ui_dvCampaignContent").hide();
                $("#dvDefault").show();
            }
            else if (maxRowCount > 0) {
                $("#dvDefault").hide();
                var numberOfRecords = GetNumberOfRecordsPerPage();
                CreateTableCampaign(numberOfRecords);
                $("#div_CampaignViewMore").show();
                if (maxRowCount > numberOfRecords) {
                    $("#ui_lnkCampaignViewMore").show();
                }
            }
        },
        error: ShowAjaxError
    });
}

function ViewMoreCampaign() {
    if (!viewMoreDisable) {
        $("#dvLoading").show();
        viewMoreDisable = true;
        var numberOfRecords = GetNumberOfRecordsPerPage();
        CreateTableCampaign(numberOfRecords);
    }
}

function CreateTableCampaign(numberRowsCount) {

    var OffSet = rowIndex;
    var FetchNext = numberRowsCount;

    $.ajax({
        url: "/MailLogs/GetCampaignData",
        type: 'Post',
        data: JSON.stringify({ 'OffSet': OffSet, 'FetchNext': FetchNext, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindCampaignData,
        error: ShowAjaxError
    });
}

function BindCampaignData(response) {

    if (response.length > 0) {

        $("#dvDefault").hide();

        rowIndex = response.length + rowIndex;
        $("#div_CampaignRecords").html(rowIndex + " out of " + maxRowCount + " records");

        if (rowIndex == maxRowCount) {
            $("#ui_lnkCampaignViewMore").hide();
        }

        if (rowIndex > 1 || maxRowCount > 1) {
            $("#dvTipsExport").show();
        }

        $("#ui_dvCampaignContent").show();

        $.each(response, function (i) {
            var tdContent = "<div style='float: left; width: 15%; text-align: left;' title= '" + $(this)[0].Template + "'>" + $(this)[0].Template + "</div>";
            tdContent += "<div style='float: left; width: 14%; text-align: left;' title='" + $(this)[0].CampaignName + "'>" + $(this)[0].CampaignName + "</div>";
            tdContent += "<div style='float: left; width: 22%; text-align: left;' title='" + $(this)[0].CampaignIdentifier + "'>" + $(this)[0].CampaignIdentifier + "</div>";
            tdContent += "<div style='float: left; width: 13%; text-align: left;' title='" + $(this)[0].GroupName + "'>" + $(this)[0].GroupName + "</div>";
            tdContent += "<div style='float: left; width: 12%; text-align: left; cursor: pointer;'><label style='float: left; cursor: pointer; width: 70%;' title='" + $(this)[0].MailCount + "' onclick='GetMailSentDetails(" + $(this)[0].MailSendingSettingId + ");'>" + $(this)[0].MailCount + "</label><img title='Download Now' style='width: 15px;height: 15px;' onclick='DownloadMailSentDetails(" + $(this)[0].MailSendingSettingId + "," + $(this)[0].MailCount + ");' src='/images/download.png' /></div>";
            tdContent += "<div style='float: left; width: 9%; text-align: center;' title='" + $(this)[0].MailVendor + "'>" + $(this)[0].MailVendor + "</div>";
            tdContent += " <div style='float: right; width: 15%;text-align: right;'> " + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].SentDate)) + "</div>";

            $("#ui_dvCampaignData").append("<div id='CampaignMailLog_" + $(this)[0].Id + "' class='itemStyle'>" + tdContent + "</div>");
        });
    }
    viewMoreDisable = false;
    $("#dvLoading").hide();
}

function DecideViewMore() {
    var getReportFor = parseInt($("#drp_LogType").val());
    if (getReportFor == 1)
        ViewMoreIndividual();
    else
        ViewMoreCampaign();
}

function GetCampaignMailCount() {
    $.ajax({
        url: "/MailLogs/GetCampaignCount",
        type: 'POST',
        data: JSON.stringify({ 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#ui_spanMailCount").html('Campaign Mail Sent = ' + response);
        },
        error: ShowAjaxError
    });
}

function GetMailSentDetails(Id) {
    $("#dvLoading").show();
    $.ajax({
        url: "/MailLogs/GetMailSentDetails",
        type: 'POST',
        data: JSON.stringify({ 'mailSendingSettingId': Id, 'OffSet': 0, 'FetchNext': 100 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.length > 0) {
                $('#ui_dvData').empty();
                $.each(response, function (i) {
                    var tdContent = '';
                    if ($(this)[0].ToEmailId !== null)
                        tdContent = '<td style="width: 25%; text-align: left;" title= "' + $(this)[0].EmailId + '">' + $(this)[0].EmailId + '</td>';
                    else
                        tdContent = '<td style="width: 25%; text-align: left;" title= "NA">NA</td>';
                        
                    if ($(this)[0].Opened > 0)
                        tdContent += '<td style="width: 15%; text-align: center;"><img src="/images/verify.png" class="ContributePermission" /></td>';
                    else
                        tdContent += '<td style="width: 15%; text-align: center;"><img src="/images/DeleteColumn.png" class="ContributePermission" /></td>';

                    if ($(this)[0].Clicked > 0)
                        tdContent += '<td style="width: 15%; text-align: center;"><img src="/images/verify.png" class="ContributePermission" /></td>';
                    else
                        tdContent += '<td style="width: 15%; text-align: center;"><img src="/images/DeleteColumn.png" class="ContributePermission" /></td>';

                    if ($(this)[0].Forward > 0)
                        tdContent += '<td style="width: 15%; text-align: center;"><img src="/images/verify.png" class="ContributePermission" /></td>';
                    else
                        tdContent += '<td style="width: 15%; text-align: center;"><img src="/images/DeleteColumn.png" class="ContributePermission" /></td>';

                    if ($(this)[0].Unsubscribe > 0)
                        tdContent += '<td style="width: 15%; text-align: center;"><img src="/images/verify.png" class="ContributePermission" /></td>';
                    else
                        tdContent += '<td style="width: 15%; text-align: center;"><img src="/images/DeleteColumn.png" class="ContributePermission" /></td>';

                    if ($(this)[0].IsBounced == 1)
                        tdContent += '<td style="text-align: right;"><img src="/images/verify.png" class="ContributePermission" /></td>';
                    else
                        tdContent += '<td style="text-align: right;"><img src="/images/DeleteColumn.png" class="ContributePermission" /></td>';

                    $("#ui_dvData").append("<tr class='itemStyle'>" + tdContent + "</tr>");
                });
                $(".ShadedDiv").show();
                $('#ui_dvContent').show();
                $('#div_MailDetailsPopUp').show();
            }
            else {
                ShowErrorMessage('No data to show');
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
}

function divCancel() {
    $(".CustomPopUp").hide();
    $('#ui_dvContent').hide();
    $(".ShadedDiv").hide();
}

function DownloadMailSentDetails(Id, mailCount) {
    $("#dvLoading").show();
    $.ajax({
        url: "/MailLogs/DownloadMailSentDetails",
        type: 'POST',
        data: JSON.stringify({ 'mailSendingSettingId': Id, 'OffSet': 0, 'FetchNext': mailCount }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status) {
                SaveToDisk(response.MainPath);
                ShowErrorMessage('Campaign response have been downloaded successfully');
            }
            else {
                ShowErrorMessage('No data to download');
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
}

function ExportMailLogsDetails() {
    $("#dvLoading").show();

    if (maxRowCount > 0) {
        var reportType = parseInt($("#drp_LogType").val());
        $.ajax({
            url: "/MailLogs/Export",
            type: 'Post',
            data: JSON.stringify({ 'reportType': reportType, 'OffSet': 0, 'FetchNext': maxRowCount, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
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