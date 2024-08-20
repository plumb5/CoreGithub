var Action = 0;
var GroupId = 0;
var maxRowCount = 0, Offset = 0, rowIndex = 0;
var viewMoreDisable = false;
$(document).ready(function () {
    if ($.urlParam("GroupId") != "0" && $.urlParam("Action") != "0") {
        GroupId = parseInt($.urlParam("GroupId"));
        Action = $.urlParam("Action").toString();
        maxRowCount = parseInt($.urlParam("Count"));
        GetContacts();
    }
});


GetContacts = function () {

    if (maxRowCount == 0) {
        $("#div_ViewMore, #dvLoading, #ui_dvContentContact").hide();
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
        url: "/WorkFlow/Groups/BindGroupsContact",
        type: 'Post',
        data: JSON.stringify({ 'GroupId': GroupId, 'Action': Action, 'FetchNext': numberRowsCount, 'OffSet': OffSet }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindContactDetails,
        error: ShowAjaxError
    });
}

BindContactDetails = function (response) {
    rowIndex = response.length + rowIndex;
    $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");
    if (rowIndex == maxRowCount)
        $("#ui_lnkViewMore").hide();

    $("#ui_dvContentContact").show();
    var array = response;
    if (array != null) {
        if (array.length > 0) {
            $.each(array, function (i) {
                var DeviceId = $(this)[0].DeviceId != null ? $(this)[0].DeviceId.length > 15 ? $(this)[0].DeviceId.substring(0, 15) + "..." : $(this)[0].DeviceId : "NA";
                var Name = $(this)[0].Name != null ? $(this)[0].Name.length > 15 ? $(this)[0].Name.substring(0, 15) + "..." : $(this)[0].Name : "NA";
                var PhoneNumber = $(this)[0].PhoneNumber != null ? $(this)[0].PhoneNumber : "NA";
                var EmailId = $(this)[0].EmailId != null ? $(this)[0].EmailId : "NA";

                var divcontent = "";
                divcontent += "<div style='float:left;width:3%;text-align:left;'><a id='lnkCustomer" + $(this)[0].ContactId + "' href=\"javascript:ContactInfo('','" + $(this)[0].ContactId + "');\"><img title='Unified Customer Profile' border='0px' src='/images/img_trans.gif' class='UPC' /></a></div>";
                divcontent += "<div style='float:left;width:15%;text-align:left;' title='" + $(this)[0].DeviceId + "'>" + DeviceId + "</div>";
                divcontent += "<div style='float:left;width:15%;text-align:left;' title='" + $(this)[0].Name + "'>" + Name + "</div>";
                //divcontent += "<div style='float:left;width:18%;text-align:left;'>" + $(this)[0].EmailId + "</div>";


                var verificationStatusImg = "";
                if ($(this)[0].IsVerifiedMailId != null && $(this)[0].IsVerifiedMailId != "" && $(this)[0].IsVerifiedMailId == "-1") {
                    verificationStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Not yet verified' src='/images/img_trans.gif' class='NotVerifiedImg' style='float: left;padding-right:5px;background-repeat:no-repeat;'/>";
                    exportVefified = "Not Verified";
                } else if ($(this)[0].IsVerifiedMailId != null && $(this)[0].IsVerifiedMailId != "" && $(this)[0].IsVerifiedMailId == "0") {
                    verificationStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Its not a valid email id' src='/images/img_trans.gif' class='InactiveImg ContributePermission' style='float: left;padding-right:5px;background-repeat:no-repeat;'/>";
                    exportVefified = "Invalid";
                }
                else if ($(this)[0].IsVerifiedMailId != null && $(this)[0].IsVerifiedMailId != "" && $(this)[0].IsVerifiedMailId == "1") {
                    verificationStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Its a valid email id' src='/images/img_trans.gif' class='ActiveImg' style='float: left;padding-right:5px;background-repeat:no-repeat;'/>";
                    exportVefified = "Valid";
                }
         
                if (EmailId != "NA")
                    divcontent += "<div style='float:left;width:15%;text-align:left;'>" + verificationStatusImg + " " + EmailId + "</div>";
                else
                    divcontent += "<div style='float:left;width:15%;text-align:left;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + EmailId + "</div>";

                var verificationStatusImg = "";
                if ($(this)[0].IsVerifiedContactNumber != null && $(this)[0].IsVerifiedContactNumber != "" && $(this)[0].IsVerifiedContactNumber == "-1") {
                    verificationStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Not yet verified' src='/images/img_trans.gif' class='NotVerifiedImg' style='float: left;padding-right: 5px;background-repeat:no-repeat;' />";
                    exportVefified = "Not Verified";
                } else if ($(this)[0].IsVerifiedContactNumber != null && $(this)[0].IsVerifiedContactNumber != "" && $(this)[0].IsVerifiedContactNumber == "0") {
                    verificationStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Its a DND phone number,Click here to make it as not verfied so that u can send sms' src='/images/img_trans.gif' class='DndactiveImg ContributePermission' onclick='MakeItNotVerified(" + $(this)[0].ContactId + ");' style='float: left;padding-right: 5px;background-repeat:no-repeat;'/>";
                    exportVefified = "DND Verified ";
                }
                else if ($(this)[0].IsVerifiedContactNumber != null && $(this)[0].IsVerifiedContactNumber != "" && $(this)[0].IsVerifiedContactNumber == "1") {
                    verificationStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Its a valid phone number' src='/images/img_trans.gif' class='ActiveImg'style='float: left;padding-right: 5px;background-repeat:no-repeat;' />";
                    exportVefified = "Valid";
                }
                else if ($(this)[0].IsVerifiedContactNumber != null && $(this)[0].IsVerifiedContactNumber != "" && $(this)[0].IsVerifiedContactNumber == "2") {
                    verificationStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Its not a valid phone number' src='/images/img_trans.gif' class='InactiveImg' style='float: left;padding-right: 5px;background-repeat:no-repeat;' />";
                    exportVefified = "Invalid";
                }

                if (PhoneNumber != "NA")
                    divcontent += "<div style='float:left;width:15%;text-align:left;'>" + verificationStatusImg + " " + PhoneNumber + "</div>";
                else
                    divcontent += "<div style='float:left;width:15%;text-align:left;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + PhoneNumber + "</div>";

                if ($(this)[0].Unsubscribe != null && $(this)[0].Unsubscribe != "" && $(this)[0].Unsubscribe == 1) 
                    divcontent += "<div style='float:left;width:10%;text-align:left;'>Yes</div>";
                else 
                    divcontent += "<div style='float:left;width:10%;text-align:left;'>No</div>";

                if ($(this)[0].CreatedDate != null && $(this)[0].CreatedDate != "") 
                    divcontent += "<div style='float:left;width:27%;text-align:right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].CreatedDate)) + "</div>";
                else 
                    divcontent += "<div style='float:left;width:27%;text-align:right;'>NA</div>";

                $("#ui_DataBindContact").append("<div class='itemStyle'>" + divcontent + "</div>");
            });
        }
        else {
            $("#div_ViewMore,#ui_dvContentContact").hide();
            $("#dvDefault").show();
        }
    }
    else {
        $("#div_ViewMore,#ui_dvContentContact").hide();
        $("#dvDefault").show();
    }
    $("#dvLoadingImg").hide();
    viewMoreDisable = false;
};