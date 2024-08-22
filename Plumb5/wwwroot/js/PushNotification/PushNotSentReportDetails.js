var maxRowCount = 0, Offset = 0, rowIndex = 0;
var viewMoreDisable = false;
var BrowserPushSendingSettingId = 0;
var GroupName = "";
var PushnotSent = new Array();
var sentContactDetails = {};
var ProductColumn = {};
$(document).ready(function () {

    if (urlParam("action") == "5") {
        $(".PageHeadingLabel").html("Blocked Message Report");
    }
    BrowserPushSendingSettingId = urlParam("BrowserPushSendingSettingId");
    GetStatusCount(BrowserPushSendingSettingId);
    GroupName = urlParam("GroupName").replace(/%20/g, " ");
    MaxCount();
    setInterval(function () { GetStatusCount(BrowserPushSendingSettingId) }, 10000);

});

function MaxCount() {
    sentContactDetails.BrowserPushSendingSettingId = BrowserPushSendingSettingId;
    sentContactDetails.SendStatus = 0;
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
    sentContactDetails.BrowserPushSendingSettingId = BrowserPushSendingSettingId;
    sentContactDetails.SendStatus = 0;
    sentContactDetails.MachineId = CleanText($("#ui_txtSearchMachineId").val());

    var OffSet = rowIndex;
    var FetchNext = numberRowsCount;

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

    $.each(response, function () {

        var ResponseId = $(this)[0].ResponseId == null || $(this)[0].ResponseId == "" ? "NA" : $(this)[0].ResponseId.length > 30 ? $(this)[0].ResponseId.substring(0, 30) : $(this)[0].ResponseId;
        var tdContent = "<div style='float: left; width: 5%; text-align: left;'><a id='lnkCustomer" + $(this)[0].ContactId + "' href=\"javascript:ContactInfo('" + $(this)[0].MachineId + "','" + $(this)[0].ContactId + "');\"><img class='UPC' alt='' src='/images/img_trans.gif' style='background-repeat:no-repeat;' /></a></div>";
        tdContent += "<div class='PhoneMasking' style='float: left; width: 25%; text-align: left;'><img alt='' src='/images/img_trans.gif' class='helpImageLead' title='RegId : " + $(this)[0].RegId + "\nTokenkey : " + $(this)[0].Tokenkey + "\nAuthkey : " + $(this)[0].Authkey + " ' data-html='true'>" + $(this)[0].MachineId + "</div>";
        tdContent += "<div style='float: left; width: 20%; text-align: left;' title='" + $(this)[0].ResponseId + "'>" + ResponseId + "</div>";
        tdContent += "<div style='float: left; width: 10%; text-align: left;'><a class='FullControlPermission' href='javascript:void(0);' onclick='GetReason(" + $(this)[0].Id + "," + $(this)[0].ContactId + ");'>Reason</a></div>";
        tdContent += "<div style='float: right; width: 40%; text-align: right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].SentDate)) + "</div>";
        $("#ui_dvData").append("<div id='ui_divContact_" + $(this)[0].ContactId + "' class='itemStyle'>" + tdContent + "</div>");
        PushnotSent.push($(this)[0]);
    });

    $("#dvLoading").hide();
    viewMoreDisable = false;
    $("#ui_txtSearchMachineId").prop('disabled', false);
}

function GetReason(PushNotsentId, ContactId) {
    $(".bgShadedDiv").show();
    var Details = JSLINQ(PushnotSent)
        .Where(function (item) { return item.Id == PushNotsentId; })
    var messagecontent = Details["items"][0].MessageContent;
    var ErrorMessage = Details["items"][0].ErrorMessage;

    var Ismatch = false;

    if (ContactId > 0) {

        $.ajax({
            url: "/Push/PushReport/GetContactDetails",
            type: 'Post',
            data: JSON.stringify({ 'contactId': ContactId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null) {

                    var contactmessage = " <b>Contact:</b><br /> The value of the fields '";
                    for (var key in response) {
                        if (key != "PhoneNumber") {
                            if (messagecontent.indexOf("<!--" + key + "-->") >= 0 || messagecontent.indexOf("[{*" + key + "*}]") >= 0) {
                                Ismatch = true;
                                contactmessage += key + ",";
                            }
                        }
                        else if (key == "PhoneNumber") {
                            if (messagecontent.indexOf("<!--" + key + "-->") >= 0 || messagecontent.indexOf("[{*" + key + "*}]") >= 0 || messagecontent.indexOf("[{*" + "ContactNumber" + "*}]") >= 0 || messagecontent.indexOf("<!--" + "ContactNumber" + "-->") >= 0) {
                                Ismatch = true;
                                contactmessage += key + ",";
                            }

                        }
                    }
                    contactmessage = contactmessage.slice(0, -1);
                    contactmessage = contactmessage + "' is Null/Empty in contact table at the time of campaign.Hence,the mention tags are not replaced with value.";

                }
                if (Ismatch == true) {
                    contactmessage = contactmessage + "<br>" + "<p>Last updated date: " + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response.CreatedDate)) + "</p>";
                    $('#contacttext').html(contactmessage);
                    $('#contacttext').show();
                }
                else {
                    $('#contacttext').html('');
                    $('#contacttext').hide();
                }
            },
            error: ShowAjaxError
        });

    }

    if (ErrorMessage != undefined && ErrorMessage != null) {
        $("#originalBouncedreasontext").text(ErrorMessage);
        $("#poriginalBouncedreasontext").show()
    }

    if (messagecontent != undefined && messagecontent != null) {
        var messagecontent = messagecontent.length > 0 ? messagecontent : "NA";
        $('#originaltext').text(messagecontent);
        $("#dvReson").show();
    }
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
