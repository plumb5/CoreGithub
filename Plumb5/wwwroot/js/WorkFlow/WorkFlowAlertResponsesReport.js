
var WebHookTracker = { PostedUrl: "", Response: "", ResponseCode: "", ResponseFromServer: "", CallingSource: "WorkFlow" };
var workFlowAlertResponsesData = { ConfigureAlertId: 0, EmailId: "", PhoneNumber: "", ResponseCode: 0, PostedUrl: "", GroupName: "" };
var maxRowCount = 0, rowIndex = 0;
var viewMoreDisable = false;
var ConfigureAlertId = 0;
var Action = "";
var mailSMSResponse = [];
var responses = {
    "Alert": ['Mail', 'Sms', 'Web push', 'App push'],
    "Plugins": ['Web hook'],
    "Others": ['Auto assigned to group', 'Assigned sales person']
};


$(document).ready(function () {
    workFlowAlertResponsesData.ConfigureAlertId = urlParam("ConfigId");
    FromDateTime = urlParam("FromDate") == 0 ? null : urlParam("FromDate").replace('%20', ' ');
    ToDateTime = urlParam("ToDate") == 0 ? null : urlParam("ToDate").replace('%20', ' ');
    IsPlugin = urlParam("Import") == "1" ? 1 : 0;

    if (IsPlugin == 1) {
        $("#ui_dllResponsesReport").val("2").change();
        $("#ui_dllCategoryResponsesReport").val("Web hook").change();
        $("#ui_dllResponsesReport").prop("disabled", true);
        $("#ui_dllCategoryResponsesReport").prop("disabled", true);
    }
    else {
        $("#ui_dllResponsesReport").prop("disabled", false);
        $("#ui_dllCategoryResponsesReport").prop("disabled", false);
    }

    if ((FromDateTime != null && ToDateTime != null) && (FromDateTime != "" && ToDateTime != "") && (FromDateTime != undefined && ToDateTime != undefined)) {
        a = new Date(FromDateTime);
        b = new Date(ToDateTime);
        window.lblDate.innerHTML = a.getDate(FromDateTime) + ' ' + monthDetials[a.getMonth(FromDateTime)] + ' ' + a.getFullYear(FromDateTime) + ' - ' + b.getDate(ToDateTime) + ' ' + monthDetials[b.getMonth(ToDateTime)] + ' ' + b.getFullYear(ToDateTime);
        GetSelectedMaxCount();
    }
    else {
        GetDateTimeRange(2);
    }

});

var CallBackFunction = function () {
    maxRowCount = OffSet = rowIndex = 0;
    $("#ui_dvData").empty();
    GetSelectedMaxCount();
};

function GetSelectedMaxCount() {
    Action = GetSeletedAction();
    if ($("#ui_dllResponse").get(0).selectedIndex == 0)
        workFlowAlertResponsesData.ResponseCode = 0;
    else
        workFlowAlertResponsesData.ResponseCode = $("#ui_dllResponse").val();


    if ($.trim($("#txt_SearchBy").val()).length == 0) {
        workFlowAlertResponsesData.PostedUrl = "";
        workFlowAlertResponsesData.EmailId = "";
        workFlowAlertResponsesData.PhoneNumber = "";
        workFlowAlertResponsesData.GroupName = "";
    }
    else {
        if (Action.toLowerCase() == "web hook" || Action.toLowerCase() == "web push" || Action.toLowerCase() == "app push")
            workFlowAlertResponsesData.PostedUrl = $("#txt_SearchBy").val();
        else if (Action.toLowerCase() == "mail" || Action.toLowerCase() == "assigned sales person")
            workFlowAlertResponsesData.EmailId = $("#txt_SearchBy").val();
        else if (Action.toLowerCase() == "sms")
            workFlowAlertResponsesData.PhoneNumber = $("#txt_SearchBy").val();
        else if (Action.toLowerCase() == "auto assigned to group")
            workFlowAlertResponsesData.GroupName = $("#txt_SearchBy").val();
    }



    $.ajax({
        url: "/WorkFlow/AlertResponsesReport/GetMaxCount",
        type: 'POST',
        data: JSON.stringify({ 'workFlowAlertResponsesData': workFlowAlertResponsesData, 'Action': Action, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            maxRowCount = response;
            if (maxRowCount == 0) {
                $("#dvViewMore, #dvLoading, #ui_dvContent").hide();

                if (Action.toLowerCase() == "web hook" || Action.toLowerCase() == "web push" || Action.toLowerCase() == "app push") {
                    if ($("#ui_dllResponse").val() == "0") {
                        $("#dvTipsExport").hide();
                    }
                    else {
                        $("#dvTipsExport").show();
                    }
                }
                else if (Action.toLowerCase() == "mail" || Action.toLowerCase() == "sms") {
                    if ($("#txt_SearchBy").val() != null || $("#txt_SearchBy").val() != "") {
                        $("#dvTipsExport").show();
                    }
                    else {
                        $("#dvTipsExport").hide();
                    }
                }
                else {
                    $("#dvTipsExport").hide();
                }

                $("#dvDefault").show();
            }
            else if (maxRowCount > 0) {
                $("#dvDefault").hide();
                $("#dvTipsExport").show();
                rowIndex = 0;
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


function CreateTable(numberRowsCount) {
    var OffSet = rowIndex;
    var FetchNext = numberRowsCount;


    $.ajax({
        url: "/WorkFlow/AlertResponsesReport/GetList",
        type: 'Post',
        data: JSON.stringify({ 'workFlowAlertResponsesData': workFlowAlertResponsesData, 'Action': Action, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindDetails,
        error: ShowAjaxError
    });
}

BindDetails = function (response) {

    rowIndex = response.length + rowIndex;
    $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");

    if (rowIndex == maxRowCount) {
        $("#ui_lnkViewMore").hide();
    }


    Action = Action != "" ? Action.toLowerCase() : response[0].ActionType;

    if (Action == "web hook") {
        if (rowIndex >= 1 || maxRowCount >= 1) {
            $("#dvTipsExport").show();
        }
    }

    $("#ui_divHeaderWebhook,#ui_divHeaderMailSms,#ui_divHeaderAssigned,#ui_dllResponse").hide();
    $("#ui_dvContent").show();
    if (Action.toLowerCase() == "mail" || Action.toLowerCase() == "sms") {
        $("#ui_dllResponsesReport").val("1").change();
        if (Action.toLowerCase() == "mail") {
            $("#ui_dllCategoryResponsesReport").val("Mail");
            $("#ui_txtchangeEmailId").html("Email Id");
            $("#txt_SearchBy").removeAttr("placeholder").attr("placeholder", "Search by email id ");
        }
        else {
            $("#ui_txtchangeEmailId").html("Phone Number");
            $("#ui_dllCategoryResponsesReport").val("Sms");
            $("#txt_SearchBy").removeAttr("placeholder").attr("placeholder", "Search by phone number ");
        }


        $("#ui_divHeaderMailSms").show();
        mailSMSResponse = response;
        BindMailSMSDetails(response);
    }
    else if (Action.toLowerCase() == "web hook" || Action.toLowerCase() == "web push" || Action.toLowerCase() == "app push") {
        $("#txt_SearchBy").removeAttr("placeholder").attr("placeholder", "Search by text in posted URL");

        if (Action.toLowerCase() == "web hook") {
            $("#ui_dllResponsesReport").val("2").change();
            $("#ui_dllCategoryResponsesReport").val("Web hook");
        }
        else if (Action.toLowerCase() == "web push") {
            $("#ui_dllResponsesReport").val("1").change();
            $("#ui_dllCategoryResponsesReport").val("Web push");
        }
        else if (Action.toLowerCase() == "app push") {
            $("#ui_dllResponsesReport").val("1").change();
            $("#ui_dllCategoryResponsesReport").val("App push");
        }

        $("#ui_dllResponse").show();
        $("#ui_divHeaderWebhook").show();
        BindWebHookDetails(response, Action);
    }
    else if (Action.toLowerCase() == "auto assigned to group" || Action.toLowerCase() == "assigned sales person") {
        $("#ui_dllResponsesReport").val("3").change();
        if (Action.toLowerCase() == "auto assigned to group") {
            $("#ui_dllCategoryResponsesReport").val("Auto assigned to group");
            $("#txt_SearchBy").removeAttr("placeholder").attr("placeholder", "Search by group name ");
            $("#ui_txtchangeGroupName").html("Group Name");
        }
        else {
            $("#txt_SearchBy").removeAttr("placeholder").attr("placeholder", "Search by user email id ");
            $("#ui_dllCategoryResponsesReport").val("Assigned sales person");
            $("#ui_txtchangeGroupName").html("User EmailId");
        }

        $("#ui_divHeaderAssigned").show();
        BindAssignedDetails(response);
    }

};

var htmlstring = "";
BindMailSMSDetails = function (response) {
    $.each(response, function () {
        var Reason = $(this)[0].Reason != null ? $(this)[0].Reason.length > 20 ? $(this)[0].Reason.substring(0, 20) + "..." : $(this)[0].Reason : "NA";
        var SentStatus = $(this)[0].SentStatus == true ? "Yes" : "No";
        var Message = $(this)[0].Message != null ? $(this)[0].Message.length > 20 ? $(this)[0].Message.substring(0, 20) + "..." : $(this)[0].Message : "NA";
        var TitleMessage = $(this)[0].Message.replace("'", "&apos;").replace("\"", "&quot;");
        if (SentStatus == "Yes")
            Reason = "Sent";

        var divContent = "";

        if ($(this)[0].ActionType == "mail") {
            divContent += "<div style='float: left; width: 20%;'>" + $(this)[0].EmailId + "</div>";
        }
        else {
            divContent += "<div style='float: left; width: 20%;'>" + $(this)[0].PhoneNumber + "</div>";
        }
        divContent += "<div style='float: left; width: 15%;'>" + SentStatus + "</div>";
        divContent += "<div style='float: left; width: 25%;'>" + Reason + "</div>";

        if ($(this)[0].ActionType == "mail") {
            divContent += "<div style='float: left; width: 20%;'><a href='javascript:void(0);' onclick='GetHtmlBody(" + $(this)[0].Id + ")' title='Click here to Preview html content'>Click here</a></div>";
        }
        else {
            divContent += "<div style='float: left; width: 20%;' title='" + TitleMessage + "'>" + Message + "</div>";
        }

        divContent += "<div style='float: right; width: 15%;text-align: right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].CreatedDate)) + "</div>";
        $("#ui_dvData").append("<div class='itemStyle'>" + divContent + "</div>");
    });
    $("#dvLoading").hide();
    viewMoreDisable = false;
};

function GetHtmlBody(mailSMSId) {
    var htmlstring = "";
    var EachItem = JSLINQ(mailSMSResponse).Where(function () { return this.Id == parseInt(mailSMSId) });
    if (EachItem != null && EachItem.items.length > 0) {
        htmlstring = EachItem.items[0].Message;
    }
    htmlstring = htmlstring.replace("data:text/html;charset=utf-8,", "");
    var htmlcontent = "data:text/html;charset=utf-8," + "data:text/html;charset=utf-8," + htmlstring;
    $('#iframemail').attr('src', htmlcontent);
    $("#dvframemail").show();
}

BindAssignedDetails = function (response) {
    $.each(response, function () {
        var divContent = "";
        var Name = $(this)[0].Name != null ? $(this)[0].Name.length > 20 ? $(this)[0].Name.substring(0, 20) : $(this)[0].Name : "NA";
        var EmailId = $(this)[0].EmailId != null ? $(this)[0].EmailId.length > 20 ? $(this)[0].EmailId.substring(0, 20) : $(this)[0].EmailId : "NA";
        var PhoneNumber = $(this)[0].PhoneNumber != null ? $(this)[0].PhoneNumber : "NA";
        var GroupName = $(this)[0].GroupName != null ? $(this)[0].GroupName.length > 20 ? $(this)[0].GroupName.substring(0, 20) : $(this)[0].GroupName : "NA";
        var UserEmailId = $(this)[0].UserEmailId != null ? $(this)[0].UserEmailId.length > 20 ? $(this)[0].UserEmailId.substring(0, 20) : $(this)[0].UserEmailId : "NA";

        divContent += "<div style='float: left; width: 3%; text-align: left;'><a id='lnkCustomer" + $(this)[0].ContactId + "' href=\"javascript:ContactInfo('','" + $(this)[0].ContactId + "');\"><img class='UPC' alt='' src='/images/img_trans.gif' /></a></div>";

        divContent += "<div style='float: left; width: 17%;' title='" + $(this)[0].Name + "'>" + Name + "</div>";
        divContent += "<div style='float: left; width: 20%;' title='" + $(this)[0].EmailId + "'>" + EmailId + "</div>";
        divContent += "<div style='float: left; width: 20%;'>" + PhoneNumber + "</div>";
        if ($(this)[0].IsGroupIsUser == 1)
            divContent += "<div style='float: left; width: 20%;' title='" + $(this)[0].GroupName + "'>" + GroupName + "</div>";
        else
            divContent += "<div style='float: left; width: 20%;' title='" + $(this)[0].UserEmailId + "'>" + UserEmailId + "</div>";

        divContent += "<div style='float: right; width: 20%;text-align: right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].CreatedDate)) + "</div>";
        $("#ui_dvData").append("<div class='itemStyle'>" + divContent + "</div>");
    });
    $("#dvLoading").hide();
    viewMoreDisable = false;
}


GetSeletedAction = function () {
    var action = $("#ui_dllResponsesReport").val();
    switch (action) {
        case "1":
            return $("#ui_dllCategoryResponsesReport").val();
            break;
        case "2":
            return $("#ui_dllCategoryResponsesReport").val();
            break;
        case "3":
            return $("#ui_dllCategoryResponsesReport").val();
            break;
        default:
            return "";
            break;
    }
};



$("#ui_dllResponsesReport").change(function () {

    $("#ui_dllCategoryResponsesReport").find("option:gt(0)").remove();
    if ($(this).val() == "1") {
        BindDropDown(responses.Alert);
    }
    else if ($(this).val() == "2") {
        BindDropDown(responses.Plugins);
    } else {
        BindDropDown(responses.Others);
    }

});

function BindDropDown(Data) {
    $.each(Data, function (i) {
        var opt = document.createElement('option');
        opt.value = Data[i];
        opt.text = Data[i];
        document.getElementById("ui_dllCategoryResponsesReport").options.add(opt);
    });
}

$("#ui_dllCategoryResponsesReport").change(function () {
    $("#txt_SearchBy").val("");
    $("#ui_dllResponse").val("0");
    CallBackFunction();
});


BindWebHookDetails = function (response, Action) {
    $("#ui_divHeaderWebhook,#ui_divHeaderWebApp,#txt_SearchBy,#btn_SearchBy,#ui_dllResponse").hide();
    if (Action.toLowerCase() == "web push" || Action.toLowerCase() == "app push") {
        $("#ui_divHeaderWebApp").show();
        $.each(response, function (i) {
            var divContent = "";
            var Message = $(this)[0].PostedUrl != undefined && $(this)[0].PostedUrl != null && $(this)[0].PostedUrl != "" ? $(this)[0].PostedUrl.substring($(this)[0].PostedUrl.indexOf("Message=") + 8, $(this)[0].PostedUrl.indexOf("SubMessage") - 1) : "NA";
            var UserId = $(this)[0].PostedUrl != undefined && $(this)[0].PostedUrl != null && $(this)[0].PostedUrl != "" ? $(this)[0].PostedUrl.substring($(this)[0].PostedUrl.indexOf("&UsersId=") + 9) : "NA";
            var Sent = $(this)[0].ResponseCode == 200 ? "Yes" : "No";
            var Reason = $(this)[0].ResponseCode == 200 ? "Sent" : "Failed";

            if (Message.length > 20)
                divContent += "<div style='float: left; width: 30%;'><span title=\"" + Message + "\">" + Message.substring(0, 30) + "..." + "</span></div>";
            else {
                if (Message != "NA")
                    divContent += "<div style='float: left; width: 30%;'>" + Message + "</div>";
                else
                    divContent += "<div style='float: left; width: 30%;' title='Not Applicable' >" + Message + "</div>";
            }
            divContent += "<div style='float: left; width: 10%;'>" + Sent + "</div>";
            divContent += "<div style='float: left; width: 20%;'>" + Reason + "</div>";

            if (parseInt(UserId) > 0) {
                GetUserDetails(UserId, i);
                divContent += "<div style='float: left; width: 20%;' id='ui_getUserId" + i + "'>Loading...</div>";
            }
            else {
                divContent += "<div style='float: left; width: 20%;' title='Not Applicable'>NA</div>";
            }

            divContent += "<div style='float: right; width: 20%;text-align: right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].CreatedDate)) + "</div>";
            $("#ui_dvData").append("<div class='itemStyle'>" + divContent + "</div>");
        });
    }
    else {
        $("#ui_divHeaderWebhook,#txt_SearchBy,#btn_SearchBy,#ui_dllResponse").show();
        $.each(response, function (i) {
            var divContent = "";

            if ($(this)[0].PostedUrl.length > 55)
                divContent += "<div style='float: left; width: 35%;'><span title='" + $(this)[0].PostedUrl + "'>" + $(this)[0].PostedUrl.substring(0, 52) + "..." + "</span></div>";
            else
                divContent += "<div style='float: left; width: 35%;'>" + $(this)[0].PostedUrl + "</div>";

            divContent += "<div style='float: left; width: 15%;'>" + $(this)[0].Response + "</div>";
            divContent += "<div style='float: left; width: 10%;'>" + $(this)[0].ResponseCode + "</div>";

            var ResponseFromServer = "NA";
            if ($(this)[0].ResponseFromServer != null && $(this)[0].ResponseFromServer.length > 45) {
                ResponseFromServer = "<span title='" + $(this)[0].ResponseFromServer.replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&#39;').replace(/'/g, '&#39;') + "'>" + $(this)[0].ResponseFromServer.substring(0, 42).replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&#39;').replace(/'/g, '&#39;') + "..." + "</span>";
            }
            else if ($(this)[0].ResponseFromServer != null) {
                ResponseFromServer = $(this)[0].ResponseFromServer.replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&#39;').replace(/'/g, '&#39;');
            }

            divContent += "<div style='float: left; width: 25%;'>" + ResponseFromServer + "</div>";

            divContent += "<div style='float: right; width: 15%;text-align: right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].CreatedDate)) + "</div>";

            $("#ui_dvData").append("<div class='itemStyle'>" + divContent + "</div>");
        });
    }
    $("#dvLoading").hide();
    viewMoreDisable = false;
};




function SearchByName() {
    if ($.trim($("#txt_SearchBy").val()).length == 0) {
        ShowErrorMessage("Please enter search text");
        $("#txt_SearchBy").focus();
        return false;
    }
    maxRowCount = rowIndex = 0;
    $("#ui_dvData").empty();
    $("#ui_lnkViewMore").hide();
    GetSelectedMaxCount();
}

$("#txt_SearchBy").keyup(function (e) {
    if (e.which && e.which == 8 || e.keyCode && e.keyCode == 46)
        if ($.trim($("#txt_SearchBy").val()).length == 0) {
            maxRowCount = rowIndex = 0;
            $("#ui_dvData").empty();
            $("#ui_lnkViewMore").hide();
            GetSelectedMaxCount();
        }
});

$("#ui_dllResponse").change(function () {
    maxRowCount = rowIndex = 0;
    $("#ui_dvData").empty();
    $("#ui_lnkViewMore").hide();
    GetSelectedMaxCount();
});

function GetMaxCount() {
    if ($("#ui_dllResponse").get(0).selectedIndex == 0)
        WebHookTracker.ResponseCode = 0;
    else
        WebHookTracker.ResponseCode = $("#ui_dllResponse").val();

    if ($.trim($("#txt_SearchBy").val()).length == 0)
        WebHookTracker.PostedUrl = "";
    else
        WebHookTracker.PostedUrl = $("#txt_SearchBy").val();

    $.ajax({
        url: "/WorkFlow/AlertResponsesReport/GetMaxCount",
        type: 'POST',
        data: JSON.stringify({ 'webHookTracker': WebHookTracker, 'fromDateTime': FromDate, 'toDateTime': ToDate }),
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
                rowIndex = 0;
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

//function CreateTable(numberRowsCount) {

//    if ($("#ui_dllResponse").get(0).selectedIndex == 0)
//        WebHookTracker.ResponseCode = "";
//    else
//        WebHookTracker.ResponseCode = $("#ui_dllResponse").val();

//    var OffSet = rowIndex;
//    var FetchNext = numberRowsCount;

//    $.ajax({
//        url: "/WorkFlow/AlertResponsesReport/GetList",
//        type: 'Post',
//        data: JSON.stringify({ 'webHookTracker': WebHookTracker, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext }),
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: BindWebHookDetails,
//        error: ShowAjaxError
//    });
//}

function BindWebHookDetails(response) {

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
        var divContent = "";

        if ($(this)[0].PostedUrl.length > 55)
            divContent += "<div style='float: left; width: 35%;'><span title='" + $(this)[0].PostedUrl + "'>" + $(this)[0].PostedUrl.substring(0, 52) + "..." + "</span></div>";
        else
            divContent += "<div style='float: left; width: 35%;'>" + $(this)[0].PostedUrl + "</div>";

        divContent += "<div style='float: left; width: 15%;'>" + $(this)[0].Response + "</div>";
        divContent += "<div style='float: left; width: 10%;'>" + $(this)[0].ResponseCode + "</div>";

        var ResponseFromServer = "NA";
        if ($(this)[0].ResponseFromServer != null && $(this)[0].ResponseFromServer.length > 45) {
            ResponseFromServer = "<span title='" + $(this)[0].ResponseFromServer.replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&#39;').replace(/'/g, '&#39;') + "'>" + $(this)[0].ResponseFromServer.substring(0, 42).replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&#39;').replace(/'/g, '&#39;') + "..." + "</span>";
        }
        else if ($(this)[0].ResponseFromServer != null) {
            ResponseFromServer = $(this)[0].ResponseFromServer.replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&#39;').replace(/'/g, '&#39;');
        }

        divContent += "<div style='float: left; width: 25%;'>" + ResponseFromServer + "</div>";

        divContent += "<div style='float: right; width: 15%;text-align: right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].SentDate)) + "</div>";

        $("#ui_dvData").append("<div class='itemStyle'>" + divContent + "</div>");
    });

    $("#dvLoading").hide();
    viewMoreDisable = false;
}

//Export To Excel
function ExportDetails() {
    if ($('#dvExportFilter').is(":visible")) {
        $('#dvExportFilter').hide('slow');
    }
    else {
        $('#dvExportFilter').show('slow');
    }
    $("#ui_txtFromRange").val("");
    $("#ui_txToRange").val("");
    $("#drp_Export").val("1").change();
}

$('#drp_Export').change(function () {
    if ($("#drp_Export").val() == "3") {
        $("#ui_txtFromRange").show();
        $("#ui_txToRange").show();
    }
    else {
        $("#ui_txtFromRange").hide();
        $("#ui_txToRange").hide();
    }
});

$("#btnGo").click(function () {

    $("#dvLoading").show();

    if (rowIndex == 0) {
        ShowErrorMessage("There are no records to export");
        return;
    }

    if ($("#drp_Export").val() == "1") {
        OffSet = 0;
        FetchNext = rowIndex;
    }
    else if ($("#drp_Export").val() == "2") {
        OffSet = 0;
        if (maxRowCount && maxRowCount > 0)
            FetchNext = maxRowCount;
        else FetchNext = 0;
    }
    else if ($("#drp_Export").val() == "3") {
        if (!Validation()) {
            $("#dvLoading").hide();
            return;
        }

        OffSet = $("#ui_txtFromRange").val();
        FetchNext = $("#ui_txToRange").val();

        if (OffSet == 1)
            OffSet = OffSet - 1;

        if (FetchNext > OffSet)
            FetchNext = FetchNext - OffSet;
    }

    $.ajax({
        url: "/WorkFlow/AlertResponsesReport/Export",
        type: 'POST',
        data: JSON.stringify({ 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status) {
                SaveToDisk(response.MainPath, "WebHookTracker.xls");
            }
            else {
                ShowErrorMessage("Session has Expired.Please Login To Continue!!");
                setTimeout(function () { window.location.href = "/Account/register"; }, 3000);
            }

            if ($('#dvExportFilter').is(":visible")) {
                $('#dvExportFilter').hide('slow');
            }
            else {
                $('#dvExportFilter').show('slow');
            }
        },
        error: ShowAjaxError
    });
    $("#dvLoading").hide();
});

function SaveToDisk(fileURL, fileName) { // for non-IE

    window.location.assign(fileURL);
}



function Validation() {
    if ($.trim($("#ui_txtFromRange").val()).length == 0) {
        ShowErrorMessage("Please enter minimum value");
        $("#ui_txtFromRange").focus();
        return false;
    }

    if ($.trim($("#ui_txToRange").val()).length == 0) {
        ShowErrorMessage("Please enter maximum value");
        $("#ui_txToRange").focus();
        return false;
    }

    var FirstValue = parseInt($("#ui_txtFromRange").val());
    var SecondValue = parseInt($("#ui_txToRange").val());

    if (FirstValue > maxRowCount || SecondValue > maxRowCount) {
        ShowErrorMessage("Please enter minimum and maximum value within the records binded");
        return false;
    }

    if (FirstValue <= 0) {
        ShowErrorMessage("Please enter minimum value correctly");
        $("#ui_txtFromRange").focus();
        return false;
    }

    if (SecondValue <= 0) {
        ShowErrorMessage("Please enter maximum value correctly");
        $("#ui_txToRange").focus();
        return false;
    }

    if (FirstValue > SecondValue) {
        ShowErrorMessage("Please enter minimum value correctly");
        $("#ui_txtFromRange").focus();
        return false;
    }

    if (SecondValue < FirstValue) {
        ShowErrorMessage("Please enter maximum value correctly");
        $("#ui_txToRange").focus();
        return false;
    }

    return true;
}

function GetUserDetails(UserId, i) {
    if (parseInt(UserId) > 0) {
        $.ajax({
            url: "/WorkFlow/AlertResponsesReport/GetUserDetails",
            type: 'POST',
            data: JSON.stringify({ 'UserId': parseInt(UserId) }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null) {                    
                    $("#ui_getUserId" + i).html(response.FirstName);
                }
                else {
                    $("#ui_getUserId" + i).html("NA");
                }
            },
            error: ShowAjaxError
        });
    }
}