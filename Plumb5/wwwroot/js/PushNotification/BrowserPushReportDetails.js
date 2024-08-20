var action = "sent";

var maxRowCount = 0, Offset = 0, rowIndex = 0;
var viewMoreDisable = false;

var sentContactDetails = { BrowserPushSendingSettingId: 0, PushSent: -1, PushView: -1, PushClick: -1, PushClose: -1, PushBounce: -1, SendStatus: null, MachineId: null };
var groupContacts = { Name: "", GroupDescription: "Group details" };
var contactDetails = { UserId: 0, ContactNameId: 0, ContactListId: 0, ContactNameIdList: [] };
var action = 0;

$(document).ready(function () {

    sentContactDetails.BrowserPushSendingSettingId = urlParam("BrowserPushSendingSettingId");
    action = urlParam("action")

    GetStatusCount(sentContactDetails.BrowserPushSendingSettingId);

    if (urlParam("action") == "0") {
        sentContactDetails.SendStatus = 1;
        sentContactDetails.PushSent = 1;
        document.title = "Push Sent Report";
        $(".PageHeadingLabel").html("Push Sent Report");
    }
    else if (urlParam("action") == "1") {
        sentContactDetails.PushView = 1;
        sentContactDetails.SendStatus = 1;
        document.title = "Push Viewed Report";
        $(".PageHeadingLabel").html("Push Viewed Report");
    }
    else if (urlParam("action") == "2") {
        sentContactDetails.PushClick = 1;
        sentContactDetails.SendStatus = 1;
        document.title = "Push Clicked Report";
        $(".PageHeadingLabel").html("Push Clicked Report");
    }
    else if (urlParam("action") == "3") {
        sentContactDetails.PushClose = 1;
        sentContactDetails.SendStatus = 1;
        document.title = "Push Closed Report";
        $(".PageHeadingLabel").html("Push Clicked Report");
    }
    else if (urlParam("action") == "4") {
        sentContactDetails.SendStatus = 1;
        sentContactDetails.PushBounce = 1;
        document.title = "Push Unsubscribe Report";
        $(".PageHeadingLabel").html("Push Unsubscribe Report");
        //UnsubscribeCount();
    }
    else if (urlParam("action") == "5") {
        sentContactDetails.SendStatus = 0;
        document.title = "Push Blocked Report";
        $(".PageHeadingLabel").html("Push Blocked Report");
    }

    MaxCount();
    setInterval(function () { GetStatusCount(sentContactDetails.BrowserPushSendingSettingId) }, 10000);
});


function MaxCount() {
    maxRowCount = 0, Offset = 0, rowIndex = 0;
    sentContactDetails.MachineId = CleanText($("#ui_txtSearchMachineId").val());

    $.ajax({
        url: "/Push/PushReport/MaxCount",
        type: 'POST',
        data: JSON.stringify({ 'sentContactDetails': sentContactDetails }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            maxRowCount = response;
            if (maxRowCount == 0) {
                $("#dvViewMore, #dvLoading, #ui_dvContent").hide();
                $("#dvDefault").show();
                $("#ui_txtSearchMachineId").prop('disabled', false);
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
    sentContactDetails.MachineId = CleanText($("#ui_txtSearchMachineId").val());

    $.ajax({
        url: "/Push/PushReport/GetReportDetails",
        type: 'Post',
        data: JSON.stringify({ 'sentContactDetails': sentContactDetails, 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReportDetails,
        error: ShowAjaxError
    });
}

function BindReportDetails(response) {

    rowIndex = response.length + rowIndex;
    $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");

    if (rowIndex == maxRowCount)
        $("#ui_lnkViewMore").hide();

    if (rowIndex >= 1 || maxRowCount >= 1)
        $("#dvTipsExport").show();

    $("#ui_dvContent").show();

    if (action == 4) {
        $(".headerstyle").empty().append('<div style="float: left; width: 5%; text-align: left;" title="Unified Customer Profile">UCP</div><div style="float: left; width: 25%; text-align: left;"><label id="ui_lblMachineId"> MachineId </label></div><div style="float: left; width: 15%; text-align: left;"><label id="ui_lblName"> Name </label></div><div style="float: left; width: 25%; text-align: left;"><label id="ui_lblEmailId"> EmailId </label></div><div style="float: left; width: 15%; text-align: left;"><label id="ui_lblPhone"> Unsubscribe Reason </label></div><div style="float: right; width: 15%; text-align: right;">Date</div>');
        $.each(response, function () {
            var tdContent = "<div style='float: left; width: 5%; text-align: left;'><a id='lnkCustomer" + $(this)[0].ContactId + "' href=\"javascript:ContactInfo('" + $(this)[0].MachineId + "','" + $(this)[0].ContactId + "');\"><img class='UPC' alt='' src='/images/img_trans.gif' style='background-repeat: no-repeat' /></a></div>";
            tdContent += "<div style='float: left; width: 25%; text-align: left;'> <img alt='' src='/images/img_trans.gif' class='helpImageLead' title='RegId : " + $(this)[0].RegId + "\nTokenkey : " + $(this)[0].Tokenkey + "\nAuthkey : " + $(this)[0].Authkey + " ' data-html='true'>" + $(this)[0].MachineId + "</div>";
            tdContent += "<div style='float: left; width: 15%; text-align: left;'> " + ($(this)[0].Name == "" || $(this)[0].Name == undefined ? "NA" : $(this)[0].Name) + "</div>";
            tdContent += "<div style='float: left; width: 25%; text-align: left;'> " + ($(this)[0].EmailId == "" || $(this)[0].EmailId == undefined ? "NA" : $(this)[0].EmailId) + "</div>";
            //tdContent += "<div style='float: left; width: 15%; text-align: left;'> " + $(this)[0].Phone + "</div>";
            var ResponseId = $(this)[0].ResponseId == null || $(this)[0].ResponseId == "" ? "NA" : $(this)[0].ResponseId.length > 20 ? $(this)[0].ResponseId.substring(0, 20) + ".." : $(this)[0].ResponseId;
            var ErrorMessage = $(this)[0].ErrorMessage == null || $(this)[0].ErrorMessage == "" ? "NA" : $(this)[0].ErrorMessage.length > 20 ? $(this)[0].ErrorMessage.substring(0, 20) + ".." : $(this)[0].ErrorMessage;
            //tdContent += "<div style='float: left; width: 25%; text-align: left;' title='" + $(this)[0].ResponseId + "'>" + ResponseId + "</div>";
            tdContent += "<div style='float: left; width: 15%; text-align: left;' title='" + $(this)[0].ErrorMessage + "'>" + $(this)[0].ErrorMessage + "</div>";
            tdContent += "<div style='float: right; width: 15%; text-align: right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].SentDate)) + "</div>";
            $("#ui_dvData").append("<div id='ui_divContact_" + $(this)[0].ContactId + "' class='itemStyle'>" + tdContent + "</div>");
        });
    }
    else {
        $.each(response, function () {
            var tdContent = "<div style='float: left; width: 5%; text-align: left;'><a id='lnkCustomer" + $(this)[0].ContactId + "' href=\"javascript:ContactInfo('" + $(this)[0].MachineId + "','" + $(this)[0].ContactId + "');\"><img class='UPC' alt='' src='/images/img_trans.gif' style='background-repeat: no-repeat' /></a></div>";
            tdContent += "<div style='float: left; width: 25%; text-align: left;'> <img alt='' src='/images/img_trans.gif' class='helpImageLead' title='RegId : " + $(this)[0].RegId + "\nTokenkey : " + $(this)[0].Tokenkey + "\nAuthkey : " + $(this)[0].Authkey + " ' data-html='true'>" + $(this)[0].MachineId + "</div>";
            tdContent += "<div style='float: left; width: 15%; text-align: left;'> " + ($(this)[0].Name == "" || $(this)[0].Name == undefined ? "NA" : $(this)[0].Name) + "</div>";
            tdContent += "<div style='float: left; width: 25%; text-align: left;'> " + ($(this)[0].EmailId == "" || $(this)[0].EmailId == undefined ? "NA" : $(this)[0].EmailId) + "</div>";
            tdContent += "<div style='float: left; width: 15%; text-align: left;'> " + ($(this)[0].Phone == "" || $(this)[0].Phone == undefined ? "NA" : $(this)[0].Phone) + "</div>";
            var ResponseId = $(this)[0].ResponseId == null || $(this)[0].ResponseId == "" ? "NA" : $(this)[0].ResponseId.length > 20 ? $(this)[0].ResponseId.substring(0, 20) + ".." : $(this)[0].ResponseId;
            //tdContent += "<div style='float: left; width: 30%; text-align: left;' title='" + $(this)[0].ResponseId + "'>" + ResponseId + "</div>";
            tdContent += "<div style='float: right; width: 15%; text-align: right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].SentDate)) + "</div>";
            $("#ui_dvData").append("<div id='ui_divContact_" + $(this)[0].ContactId + "' class='itemStyle'>" + tdContent + "</div>");
        });
    }

    $("#dvLoading").hide();
    viewMoreDisable = false;
    $("#ui_txtSearchMachineId").prop('disabled', false);
}

GetStatusCount = function (BrowserPushSendingSettingId) {
    $("#dvLoading").show();
    $.ajax({
        url: "/Push/PushReport/GetStatusCount",
        type: 'POST',
        data: JSON.stringify({ 'BrowserPushSendingSettingId': BrowserPushSendingSettingId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null && response != undefined) {
                $("#ui_spanTotal").html(response.Total);
                $("#ui_spanTotalSent").html(response.TotalSent);
                $("#ui_spanTotalNotSent").html(response.TotalNotSent);
                $("#ui_spanTotalYetToSend").html(response.TotalYetToSend);
                $("#ui_spanTotalReTry").html(response.TotalReTry);
                $("#ui_spanTotalFailed").html(response.TotalFailed);
            }

            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
};

$("#ui_txtSearchMachineId").keypress(function (e) {
    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
        if ($("#ui_txtSearchMachineId").val().length > 0) {
            $("#ui_dvData").empty();
            rowIndex = maxRowCount = 0;
            $("#ui_lnkViewMore").hide();
            $("#dv_BindingValue").html("There is no data available based on the searched status.Please click on the link <a style='cursor:pointer;color:red;' onclick='ClearValue();' href='javascript:void(0);'>back</a> to go back");
            $("#dv_BindingValue").attr("SearchId", 0);
            $("#ui_txtSearchMachineId").prop('disabled', 'disable');
            MaxCount();
            return false;
        }
    }
    return true;
});

var IsSearchLocked = false;
$("#ui_txtSearchMachineId").keyup(function (e) {
    if (e.which && e.which == 8 || e.keyCode && e.keyCode == 46)
        if ($("#ui_txtSearchMachineId").val().length == 0 && !IsSearchLocked) {
            IsSearchLocked = true;
            $("#ui_dvData").empty();
            rowIndex = maxRowCount = 0;
            $("#dv_BindingValue").html("There is no data available based on the searched status.Please click on the link <a style='cursor:pointer;color:red;' onclick='ClearValue();' href='javascript:void(0);'>back</a> to go back");
            $("#dv_BindingValue").attr("SearchId", 0);
            $("#ui_lnkViewMore").hide();
            MaxCount();
            setTimeout(function () { IsSearchLocked = false; }, 1000);
        }
});

function ClearValue() {
    $("#ui_txtSearchMachineId").val("").prop('disabled', false);
    maxRowCount = OffSet = rowIndex = 0;
    MaxCount();
}

function UnsubscribeCount() {

    var SMSSendingSettingId = urlParam("SMSSendingSettingId");

    $.ajax({
        url: "/Sms/SmsReport/GetUnsubscribeDetails",
        type: 'POST',
        data: JSON.stringify({ 'SMSSendingSettingId': SMSSendingSettingId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response, function () {
                var optlist = document.createElement('option');
                optlist.value = $(this)[0].UnsubscribeReason != null ? $(this)[0].UnsubscribeReason : "NA";
                optlist.text = ($(this)[0].UnsubscribeReason != null ? $(this)[0].UnsubscribeReason : "NA") + " - " + $(this)[0].Counts;
                document.getElementById("drp_UnsubscribeCount").options.add(optlist);
            });

        },
        error: ShowAjaxError
    });
}
