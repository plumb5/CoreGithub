var maxRowCount = 0, rowIndex = 0, viewMoreDisable = false, Offset = 0;

$(document).ready(function () {
    GetDateTimeRange(2);
});

var CallBackFunction = function () {
    GetSmsCount();
    GetReportForSms();
};

function GetSmsCount() {
    $.ajax({
        url: "/SmsLogs/GetOverAllCount",
        type: 'POST',
        data: JSON.stringify({ 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#ui_spanTotalSmsCount").html('Total Sms Sent = ' + response);
        },
        error: ShowAjaxError
    });
}

function GetMaxCountIndividual() {
    $.ajax({
        url: "/SmsLogs/GetMaxCountIndividual",
        type: 'POST',
        data: JSON.stringify({ 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            maxRowCount = response;
            $("#ui_spanSmsCount").html('Individual Sms Sent = ' + response);
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
        url: "/SmsLogs/GetIndividualData",
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
            var messageParts = 0;
            if (parseInt($(this)[0].MessageParts) > 0)
                messageParts = parseInt($(this)[0].SmsCount) * parseInt($(this)[0].MessageParts);
            else
                messageParts = parseInt($(this)[0].SmsCount) * 1;

            var isUnicode = false;
            if (parseInt($(this)[0].IsUnicode) > 0)
                isUnicode = true;

            var tdContent = "";
            if ($(this)[0].ToPhoneNumber !== null)
                tdContent = "<div style='float: left; width: 10%; text-align: left;' title= '" + $(this)[0].ToPhoneNumber + "'>" + $(this)[0].ToPhoneNumber + "</div>";
            else
                tdContent = "<div style='float: left; width: 10%; text-align: left;' title='NA'>NA</div>";

            if ($(this)[0].Name !== null)
                tdContent += "<div style='float: left; width: 15%; text-align: center;' title='" + $(this)[0].Name + "'>" + $(this)[0].Name + "</div>";
            else
                tdContent += "<div style='float: left; width: 15%; text-align: center;'>Sms Body</div>";

            tdContent += "<div style='float: left; width: 15%; text-align: center;' title='" + $(this)[0].SmsCount + "'>" + $(this)[0].SmsCount + "</div>";
            tdContent += "<div style='float: left; width: 10%; text-align: center;' title='" + messageParts + "'>" + messageParts + "</div>";
            tdContent += "<div style='float: left; width: 10%; text-align: center;' title='" + isUnicode + "'>" + isUnicode + "</div>";
            tdContent += "<div style='float: left; width: 10%; text-align: center;' title='" + $(this)[0].SmsSource + "'>" + $(this)[0].SmsSource + "</div>";
            tdContent += "<div style='float: left; width: 15%; text-align: center;' title='" + $(this)[0].SmsVendor + "'>" + $(this)[0].SmsVendor + "</div>";
            tdContent += " <div style='float: right; width: 15%;text-align: right;'> " + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].SentDate)) + "</div>";

            $("#ui_dvIndividualData").append("<div id='IndividualMailLog_" + $(this)[0].Id + "' class='itemStyle'>" + tdContent + "</div>");
        });
    }
    viewMoreDisable = false;
    $("#dvLoading").hide();
}

function GetReportForSms() {
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
        GetCampaignSmsCount();
        GetMaxCountCampaign();
    }
}

function GetMaxCountCampaign() {
    $.ajax({
        url: "/SmsLogs/GetMaxCountCampaign",
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
        url: "/SmsLogs/GetCampaignData",
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
            var messageParts = 0;
            if (parseInt($(this)[0].MessageParts) > 0)
                messageParts = parseInt($(this)[0].SmsCount) * parseInt($(this)[0].MessageParts);
            else
                messageParts = parseInt($(this)[0].SmsCount) * 1;

            var isUnicode = false;
            if (parseInt($(this)[0].IsUnicode) > 0)
                isUnicode = true;

            var tdContent = "<div style='float: left; width: 11%; text-align: left;' title= '" + $(this)[0].Template + "'>" + $(this)[0].Template + "</div>";
            tdContent += "<div style='float: left; width: 10%; text-align: left;' title='" + $(this)[0].CampaignName + "'>" + $(this)[0].CampaignName + "</div>";
            tdContent += "<div style='float: left; width: 18%; text-align: left;' title='" + $(this)[0].CampaignIdentifier + "'>" + $(this)[0].CampaignIdentifier + "</div>";
            tdContent += "<div style='float: left; width: 10%; text-align: center;' title='" + $(this)[0].GroupName + "'>" + $(this)[0].GroupName + "</div>";
            tdContent += "<div style='float: left; width: 13%; text-align: left; cursor: pointer;'><label style='float: left; cursor: pointer; width: 70%;' title='" + $(this)[0].SmsCount + "' onclick='GetSmsSentDetails(" + $(this)[0].SmsSendingSettingId + ");'>" + $(this)[0].SmsCount + "</label><img title='Download Now' style='width: 15px;height: 15px;' onclick='DownloadSmsSentDetails(" + $(this)[0].SmsSendingSettingId + "," + $(this)[0].SmsCount + ");' src='/images/download.png' /></div>";
            tdContent += "<div style='float: left; width: 10%; text-align: center;' title='" + messageParts + "'>" + messageParts + "</div>";
            tdContent += "<div style='float: left; width: 8%; text-align: center;' title='" + isUnicode + "'>" + isUnicode + "</div>";
            tdContent += "<div style='float: left; width: 7%; text-align: center;' title='" + $(this)[0].SmsVendor + "'>" + $(this)[0].SmsVendor + "</div>";
            tdContent += " <div style='float: right; width: 13%;text-align: right;'> " + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].SentDate)) + "</div>";

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

function GetCampaignSmsCount() {
    $.ajax({
        url: "/SmsLogs/GetCampaignCount",
        type: 'POST',
        data: JSON.stringify({ 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#ui_spanSmsCount").html('Campaign Sms Sent = ' + response);
        },
        error: ShowAjaxError
    });
}

function GetSmsSentDetails(Id) {
    $.ajax({
        url: "/SmsLogs/GetSmsSentDetails",
        type: 'POST',
        data: JSON.stringify({ 'smsSendingSettingId': Id, 'OffSet': 0, 'FetchNext': 100 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.length > 0) {
                $('#ui_dvData').empty();
                $.each(response, function (i) {
                    var tdContent = '';
                    if ($(this)[0].ToPhoneNumber !== null)
                        tdContent = '<td style="width: 25%; text-align: left;" title= "' + $(this)[0].PhoneNumber + '">' + $(this)[0].PhoneNumber + '</td>';
                    else
                        tdContent = '<td style="width: 25%; text-align: left;" title= "NA">NA</td>';

                    if ($(this)[0].SendStatus === 1)
                        tdContent += '<td style="width: 15%; text-align: center;"><img src="/images/verify.png" class="ContributePermission" /></td>';
                    else
                        tdContent += '<td style="width: 15%; text-align: center;"><img src="/images/DeleteColumn.png" class="ContributePermission" /></td>';

                    var delivered = 0, pending = 0, bounced = 0;

                    if ($(this)[0].IsDelivered > 0) {
                        delivered = 1, pending = 0, bounced = 0;
                    }
                    else if ($(this)[0].NotDeliverStatus > 0) {
                        delivered = 0, pending = 0, bounced = 1;
                    }
                    else if ($(this)[0].IsDelivered === 0 && $(this)[0].NotDeliverStatus === 0) {
                        delivered = 0, pending = 1, bounced = 0;
                    }

                    if (delivered > 0)
                        tdContent += '<td style="width: 15%; text-align: center;"><img src="/images/verify.png" class="ContributePermission" /></td>';
                    else
                        tdContent += '<td style="width: 15%; text-align: center;"><img src="/images/DeleteColumn.png" class="ContributePermission" /></td>';

                    if (pending > 0)
                        tdContent += '<td style="width: 15%; text-align: center;"><img src="/images/verify.png" class="ContributePermission" /></td>';
                    else
                        tdContent += '<td style="width: 15%; text-align: center;"><img src="/images/DeleteColumn.png" class="ContributePermission" /></td>';

                    if (bounced > 0)
                        tdContent += '<td style="width: 15%; text-align: center;"><img src="/images/verify.png" class="ContributePermission" /></td>';
                    else
                        tdContent += '<td style="width: 15%; text-align: center;"><img src="/images/DeleteColumn.png" class="ContributePermission" /></td>';

                    if ($(this)[0].IsClicked > 0)
                        tdContent += '<td style="text-align: right;"><img src="/images/verify.png" class="ContributePermission" /></td>';
                    else
                        tdContent += '<td style="text-align: right;"><img src="/images/DeleteColumn.png" class="ContributePermission" /></td>';

                    $("#ui_dvData").append("<tr class='itemStyle'>" + tdContent + "</tr>");
                });
                $(".ShadedDiv").show();
                $('#ui_dvContent').show();
                $('#div_SmsDetailsPopUp').show();
            }
            else {
                ShowErrorMessage('No data to show.');
            }
        },
        error: ShowAjaxError
    });
}

function divCancel() {
    $(".CustomPopUp").hide();
    $('#ui_dvContent').hide();
    $(".ShadedDiv").hide();
}

function DownloadSmsSentDetails(Id, smsCount) {
    $("#dvLoading").show();
    $.ajax({
        url: "/SmsLogs/DownloadSmsSentDetails",
        type: 'POST',
        data: JSON.stringify({ 'smsSendingSettingId': Id, 'OffSet': 0, 'FetchNext': smsCount }),
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

function SaveToDisk(fileURL) {
    window.location.assign(fileURL);
}

function ExportSmsLogsDetails() {
    $("#dvLoading").show();

    if (maxRowCount > 0) {
        var reportType = parseInt($("#drp_LogType").val());
        $.ajax({
            url: "/SmsLogs/Export",
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