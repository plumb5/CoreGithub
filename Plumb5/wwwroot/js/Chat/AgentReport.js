var agentReport = { AdsId: 0, ChatId: 0, FromDate: "", ToDate: "", P5ChatUserId: "", StartRowIndex: 0, EndRowIndex: 0 };
var chatOverView = { ChatUserId: "", LastAgentServedBy: 0, InitiatedByUser: false, IsMissed: false, IsCompleted: false, FeedBack: 0, FeedBackForAgentId: 0, IsTransferd: false, IsConvertedToLeadOrCustomer: 0, ChatInitiatedOnPageUrl: "", ResponseCount: 0, Date: null };
var AutoPingOverView = { URL: "", AutoPingCount: 0, ResponseCount: 0, CreatedDate: null };
var viewReportDataId = 'agentperform';

$(document).ready(function () {
    AgentReportUtil.GetAllAgentName();
    ExportFunctionName = "AgentPerformanceExport";
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    if (viewReportDataId.toLowerCase() === 'agentperform') {
        $("#ui_divAgentName").removeClass("hideDiv");
        ExportFunctionName = "AgentPerformanceExport";
        AgentReportUtil.GetAgentPerformanceData();
    }
    else if (viewReportDataId.toLowerCase() === 'pingchat') {
        $("#ui_divAgentName").addClass("hideDiv");
        ExportFunctionName = "PingToChatExport";
        AgentReportUtil.GetPingToChatData();
    }
    else if (viewReportDataId.toLowerCase() === 'inschats') {
        $("#ui_divAgentName").addClass("hideDiv");
        ExportFunctionName = "ChatInitiatedExport";
        AgentReportUtil.GetInitiatedChatData();
    }
    else {
        $("#ui_divAgentName").addClass("hideDiv");
        ExportFunctionName = "ChatCompletedExport";
        AgentReportUtil.GetCompletedChatData();
    }
}

//function CallBackPaging() {
//    CurrentRowCount = 0;
//    if (viewReportDataId.toLowerCase() === 'agentperform')
//        AgentReportUtil.GetAgentPerformanceData();
//    else if (viewReportDataId.toLowerCase() === 'pingchat')
//        AgentReportUtil.GetPingToChatData();
//    else if (viewReportDataId.toLowerCase() === 'inschats')
//        AgentReportUtil.GetInitiatedChatData();
//    else
//        AgentReportUtil.GetCompletedChatData();
//}

$(".chatrepsubmenu").click(function () {
    let checktbltabid = viewReportDataId = $(this).attr("id");
    $(".chatrepsubmenu").removeClass("active");
    $(".tbl-frmrepresp").addClass("hideDiv");
    $(this).addClass("active");
    $("#tbl-" + checktbltabid).removeClass("hideDiv");
    CallBackFunction();
});

var AgentReportUtil = {
    GetAllAgentName: function () {
        $.ajax({
            url: "/Chat/AgentReport/GetAllAgentsName",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'agentReport': agentReport }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function (i) {
                    var optlist = document.createElement('option');
                    optlist.value = $(this)[0].UserId;
                    optlist.text = $(this)[0].Name;
                    document.getElementById("ddlAgentName").options.add(optlist);
                });
                GetUTCDateTimeRange(2);
            },
            error: ShowAjaxError
        });
    },
    GetAgentPerformanceData: function () {
        $.ajax({
            url: "/Chat/AgentReport/GetAgentPerformance",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'chatOverView': chatOverView, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: AgentReportUtil.BindAgentPerformanceData,
            error: ShowAjaxError
        });
    },
    BindAgentPerformanceData: function (response) {
        SetNoRecordContent('tbl-agentperform', 10, 'ui_tblData_agentperform');
        if (response !== undefined && response !== null && response.length > 0) {
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            var reportTableTrs;
            $.each(response, function () {
                var ChatToLead = (($(this)[0].LeadCount / $(this)[0].ChatTakenCount) * 100).toFixed(2);
                var ChatToCustomer = (($(this)[0].CustomerCount / $(this)[0].ChatTakenCount) * 100).toFixed(2);
                var EmployeeCode = this.EmployeeCode != null && this.EmployeeCode != "" ? this.EmployeeCode : "NA";

                reportTableTrs += "<tr>" +
                    "<td class='text-left'><span class='groupNameTxt'>" + this.AgentName + "</span><span class='text-color-blue'>" + EmployeeCode + "</span></td>" +
                    "<td>" + this.ChatTakenCount + "</td>" +
                    "<td>" + this.ServedChatCount + "</td>" +
                    "<td>" + this.CompletedChatCount + "</td>" +
                    "<td>" + this.DroppedChatCount + "</td>" +
                    "<td>" + this.MissedChatCount + "</td>" +
                    "<td>" + this.LeadCount + "</td>" +
                    "<td>" + this.CustomerCount + "</td>" +
                    "<td>" + AgentReportUtil.CheckNumber(ChatToLead) + "%</td>" +
                    "<td>" + AgentReportUtil.CheckNumber(ChatToCustomer) + "%</td>" +
                    "</tr>";
            });
            ShowExportDiv(true);
            ShowPagingDiv(false);
            $("#tbl-agentperform").removeClass('no-data-records');
            $("#ui_tblData_agentperform").html(reportTableTrs);
        }
        else {
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
    },
    GetPingToChatData: function () {
        $.ajax({
            url: "/Chat/AgentReport/GetAutoPingOverViewList",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'AutoPingOverView': AutoPingOverView, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: AgentReportUtil.BindPingToChatData,
            error: ShowAjaxError
        });
    },
    BindPingToChatData: function (response) {
        SetNoRecordContent('tbl-pingchat', 4, 'ui_tblData_pingchat');
        if (response !== undefined && response !== null && response.length > 0) {
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            var reportTableTrs;
            $.each(response, function () {
                var pageUrl = this.URL == null || this.URL == "" ? "NA" : this.URL.length > 50 ? this.URL.substring(0, 50) + "..." : this.URL;
                var PingToChat = (($(this)[0].ResponseCount / $(this)[0].AutoPingCount) * 100).toFixed(2);
                reportTableTrs += "<tr>" +
                    "<td class='text-left'>" + pageUrl + "</td>" +
                    "<td>" + this.AutoPingCount + "</td>" +
                    "<td>" + this.ResponseCount + "</td>" +
                    "<td>" + AgentReportUtil.CheckNumber(PingToChat) + "%</td>" +
                    "</tr>";
            });
            ShowExportDiv(true);
            ShowPagingDiv(false);
            $("#tbl-pingchat").removeClass('no-data-records');
            $("#ui_tblData_pingchat").html(reportTableTrs);
        }
        else {
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
    },
    GetInitiatedChatData: function () {
        $.ajax({
            url: "/Chat/AgentReport/GetImpressionList",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'chatOverView': chatOverView, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: AgentReportUtil.BindInitiatedChatData,
            error: ShowAjaxError
        });
    },
    BindInitiatedChatData: function (response) {
        SetNoRecordContent('tbl-inschats', 2, 'ui_tblData_inschats');
        if (response !== undefined && response !== null && response.length > 0) {
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            var reportTableTrs;
            $.each(response, function () {
                var pageUrl = this.ChatInitiatedOnPageUrl == null || this.ChatInitiatedOnPageUrl == "" ? "NA" : this.ChatInitiatedOnPageUrl.length > 50 ? this.ChatInitiatedOnPageUrl.substring(0, 50) + "..." : this.ChatInitiatedOnPageUrl;
                reportTableTrs += "<tr>" +
                    "<td class='text-left'>" + pageUrl + "</td>" +
                    "<td>" + this.ResponseCount + "</td>" +
                    "</tr>";
            });
            ShowExportDiv(true);
            ShowPagingDiv(false);
            $("#tbl-inschats").removeClass('no-data-records');
            $("#ui_tblData_inschats").html(reportTableTrs);
        }
        else {
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
    },
    GetCompletedChatData: function () {
        $.ajax({
            url: "/Chat/AgentReport/GetChatCompletedList",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'chatOverView': chatOverView, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: AgentReportUtil.BindCompletedChatData,
            error: ShowAjaxError
        });
    },
    BindCompletedChatData: function (response) {
        SetNoRecordContent('tbl-complchats', 6, 'ui_tblData_complchats');
        if (response !== undefined && response !== null && response.length > 0) {
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            var reportTableTrs;
            $.each(response, function () {
                var CompletedChat = (($(this)[0].CompletedChatCount / $(this)[0].ChatTakenCount) * 100).toFixed(2);
                reportTableTrs += "<tr>" +
                    "<td class='text-left'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.Date)) + "</td>" +
                    "<td>" + this.ChatTakenCount + "</td>" +
                    "<td>" + this.AssignedChatCount + "</td>" +
                    "<td>" + this.UnAssignedChatCount + "</td>" +
                    "<td>" + this.CompletedChatCount + "</td>" +
                    "<td>" + AgentReportUtil.CheckNumber(CompletedChat) + "%</td>" +
                    "</tr>";
            });
            ShowExportDiv(true);
            ShowPagingDiv(false);
            $("#tbl-complchats").removeClass('no-data-records');
            $("#ui_tblData_complchats").html(reportTableTrs);
        }
        else {
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
    },
    CheckNumber: function (number) {
        if (isFinite(number)) {
            if (number > 0)
                return number;
            else
                return 0;
        }
        else
            return 0;
    }
}

$("#ddlAgentName").select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});

$("#ddlAgentName").on('change', function () {
    chatOverView = new Object();
    //chatOverView.ChatUserId = parseInt($("#ddlAgentName").val());
    chatOverView.LastAgentServedBy = parseInt($("#ddlAgentName").val());
    CallBackFunction();
});