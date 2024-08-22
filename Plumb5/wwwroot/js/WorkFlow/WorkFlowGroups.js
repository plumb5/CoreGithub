var Groupids = "";
var ContactIds = "";
var Isbelong = true;
var maxRowCount = 0, Offset = 0, rowIndex = 0;
var IndividualmaxRowCount = 0, IndividualOffset = 0, IndividualrowIndex = 0;
var viewMoreDisable = false;
$(document).ready(function () {

    if ($.urlParam("GroupIds") != "0" && $.urlParam("GroupIds").length > 0) {
        Groupids = $.urlParam("GroupIds");
        Isbelong = $.urlParam("belongs") == 0 ? false : true;
        $("#ui_dvContentIndividual").hide();
        $("#ui_dvContentGroups").show();
        document.title = "Groups";
        $("#uiHeaderName").html("Groups");
        GetMaxCountGroups();
     
    }
    else {
        ContactIds = $.urlParam("ContactIds");
        $("#ui_dvContentGroups").hide();
        $("#ui_dvContentIndividual").show();
        document.title = "Contacts";
        $("#uiHeaderName").html("Contacts");
        GetIndividualMaxCount();
  
    }

});

GetMaxCountGroups = function () {

    if (Groupids.length > 0) {
        $.ajax({
            url: "/WorkFlow/Groups/MaxCount",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ 'groupids': Groupids, 'Isbelong': Isbelong }),
            success: function (response) {
                maxRowCount = response;
                if (maxRowCount == 0) {
                    $("#ui_DataBind,#ui_divGroups").hide();
                    $("#ui_divNodata").show();
                }
                else if (maxRowCount > 0) {
                    $("#ui_divNodata").hide();
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
}

function ViewMore() {
    if (!viewMoreDisable) {
        $("#dvLoading").show();
        viewMoreDisable = true;
        var numberOfRecords = GetNumberOfRecordsPerPage();
        CreateTable(numberOfRecords);
    }
}



CreateTable = function (numberRowsCount) {
    var OffSet = rowIndex;
    var FetchNext = numberRowsCount;

    if (Groupids.length > 0) {
        $.ajax({
            url: "/WorkFlow/Groups/BindGropsDetails",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ 'groupids': Groupids, 'Isbelong': Isbelong, 'Offset': OffSet, 'FetchNext': FetchNext }),
            success: function (response) {
                var array = JSON.parse(response);
                BindResponsesDetails(array);
            },
            error: ShowAjaxError
        });
    }
}

BindResponsesDetails = function (responses) {

   
    rowIndex = responses.length + rowIndex;
    $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");
    if (rowIndex == maxRowCount) {
        $("#ui_lnkViewMore").hide();
        $("#div_Records").hide();
    }
 
    $("#ui_dvContentContact").show();

   

    if (responses != null) {
        if (responses.length > 0) {            

            $("#ui_DataBind").show();
            $("#ui_divNodata").hide();

            var divcontent = "";

            var ArrayGrp = [];

            var GroupName = responses[0].Name != null ? responses[0].Name.length > 15 ? responses[0].Name.substring(0, 15) + "..." : responses[0].Name : responses[0].Name;
            divcontent += "<div style='float:left;width:15%;text-align:left;' title=" + responses[0].Name + ">" + GroupName + "</div>";

            var MailCount = 0, SMSCount = 0, AppPushCount = 0, WePushCount = 0;

            var SMSOptOut = 0, SMSOptIn = 0;
            var MailOptOut = 0, MailOptIn = 0;
            var AppPushOptOut = 0, AppPushOptIn = 0;
            var WebPushOptOut = 0, WebPushOptIn = 0;


            for (var i = 0; i < responses.length; i++) {
                if (responses[i].ReportType == "Mail") {

                    MailOptOut = responses[i].OptOut;
                    MailOptIn = responses[i].OptIn;

                    MailCount = responses[i].Total;
                }
                if (responses[i].ReportType == "SMS") {

                    SMSOptOut = responses[i].OptOut;
                    SMSOptIn = responses[i].OptIn;

                    SMSCount = responses[i].Total;
                }
                if (responses[i].ReportType == "AppPush") {

                    AppPushOptOut = responses[i].OptOut;
                    AppPushOptIn = responses[i].OptIn;

                    AppPushCount = responses[i].TotalVisitor;
                }
                if (responses[i].ReportType == "WebPush") {

                    WebPushOptOut = responses[i].OptOut;
                    WebPushOptIn = responses[i].OptIn;

                    WePushCount = responses[i].TotalVisitor;
                }
            }

            
            divcontent += "<div style='float:left;width:20%;text-align:left;'>" + SMSCount + " [Optout-" + SMSOptOut + "]</div>";            
            divcontent += "<div style='float:left;width:20%;text-align:left;'>" + MailCount + " [Optout-" + MailOptOut + "]</div>";
            divcontent += "<div style='float:left;width:20%;text-align:left;'>" + AppPushCount + " [Optout-" + AppPushOptOut + "]</div>";            
            divcontent += "<div style='float:left;width:20%;text-align:left;'>" + WePushCount + " [Optout-" + WebPushOptOut + "]</div>";
            

            //divcontent += "<div style='float:left;width:15%;text-align:right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(responses[0].CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(responses[0].CreatedDate)) + "</div>";
            $("#ui_DataBind").append("<div class='itemStyle'>" + divcontent + "</div>");           
        }
        else {
            $("#ui_DataBind,#ui_divGroups").hide();
            $("#ui_divNodata").show();
        }
    }
    else {
        $("#ui_DataBind,#ui_divGroups").hide();
        $("#ui_divNodata").show();
    }
    $("#dvLoadingImg").hide();
    viewMoreDisable = false;
  
 
};

function GetIndividualMaxCount() {
    if (ContactIds.length > 0) {
        IndividualmaxRowCount = ContactIds.split(',').length;
        $("#ui_divNodataIndividual").hide();
        var numberOfRecords = GetNumberOfRecordsPerPage();
        CreateIndividualContactTable(numberOfRecords);
        if (IndividualmaxRowCount > numberOfRecords) {
            $("#ui_lnkIndividualViewMore").show();
        }
    }
    else {
        $("#ui_DataBindIndividual,#ui_divIndividaul,#div_ViewIndividualMore").hide();
        $("#ui_divNodataIndividual").show();
        $("#dvLoading").hide();
    }
}

function ViewIndividualMore() {
    if (!viewMoreDisable) {
        $("#dvLoading").show();
        viewMoreDisable = true;
        var numberOfRecords = GetNumberOfRecordsPerPage();
        CreateIndividualContactTable(numberOfRecords);
    }
}

CreateIndividualContactTable = function (numberRowsCount) {
    var OffSet = IndividualrowIndex;
    var FetchNext = numberRowsCount;
    var contactidsArray = [];
    var contacts = "";
    var contactss = ContactIds.split(',');
    if (ContactIds.length > 0) {
        if (ContactIds.split(',').length > 20) {
            for (var i = IndividualrowIndex; i < numberRowsCount + IndividualrowIndex; i++) {
                if (contactss[i] != null && contactss[i] != undefined)
                    contactidsArray.push(contactss[i]);
            }
            contacts = contactidsArray.toString();
        }
        else {
            contacts = ContactIds;
        }

        $.ajax({
            url: "/WorkFlow/Groups/BindContacts",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ 'contacts': contacts }),
            success: function (response) {
                BindContactDetails(response);
            },
            error: ShowAjaxError
        });
    }
};

BindContactDetails = function (response) {
    IndividualrowIndex = response.length + IndividualrowIndex;
    $("#div_IndividaulRecords").html(IndividualrowIndex + " out of " + IndividualmaxRowCount + " records");
    if (IndividualrowIndex >= IndividualmaxRowCount)
        $("#ui_lnkIndividualViewMore").hide();
    var array = response;
    if (array != null) {
        if (array.length > 0) {
            $("#ui_DataBindIndividual").show();
            $("#ui_divNodataIndividual").hide();
            $.each(array, function (i) {
                var Name = $(this)[0].Name != null ? $(this)[0].Name.length > 15 ? $(this)[0].Name.substring(0, 15) + "..." : $(this)[0].Name : "NA";
                var PhoneNumber = $(this)[0].PhoneNumber != null ? $(this)[0].PhoneNumber : "NA";
                var EmailId = $(this)[0].EmailId != null ? $(this)[0].EmailId : "NA";
                var Unsubscribe = $(this)[0].Unsubscribe == 1 ? "Yes" : "No";

                var divcontent = "";
                divcontent += "<div style='float:left;width:3%;text-align:left;'><a id='lnkCustomer" + $(this)[0].ContactId + "' href=\"javascript:ContactInfo('','" + $(this)[0].ContactId + "');\"><img title='Unified Customer Profile' border='0px' src='/images/img_trans.gif' class='UPC' /></a></div>";
                divcontent += "<div style='float:left;width:17%;text-align:left;' title=" + $(this)[0].Name + ">" + Name + "</div>";



                var verificationMailStatusImg = "";
                if ($(this)[0].IsVerifiedMailId == "-1") {
                    verificationMailStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Not yet verified' src='/images/img_trans.gif' class='NotVerifiedImg' style='float: left;padding-right: 5px;background-repeat:no-repeat;'/>";
                    exportVefified = "Not Verified";
                } else if ($(this)[0].IsVerifiedMailId == "0") {
                    verificationMailStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Its not a valid email id' src='/images/img_trans.gif' class='InactiveImg ContributePermission' style='float: left;padding-right: 5px;background-repeat:no-repeat;' />";
                    exportVefified = "Invalid";
                }
                else if ($(this)[0].IsVerifiedMailId == "1") {
                    verificationMailStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Its a valid email id' src='/images/img_trans.gif' class='ActiveImg' style='float: left;padding-right: 5px;background-repeat:no-repeat;' />";
                    exportVefified = "Valid";
                }

                if (EmailId != "NA")
                    divcontent += "<div style='float:left;width:35%;text-align:left;'>" + verificationMailStatusImg + "" + EmailId + "</div>";
                else
                    divcontent += "<div style='float:left;width:35%;text-align:left;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + EmailId + "</div>";
                //divcontent += "<div style='float:left;width:12%;text-align:left;'>" + verificationMailStatusImg + "</div>";


                var verificationPhoneStatusImg = "";
                if ($(this)[0].IsVerifiedContactNumber == "-1") {
                    verificationPhoneStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Not yet verified' src='/images/img_trans.gif' class='NotVerifiedImg' style='float: left;padding-right: 5px;background-repeat:no-repeat;'/>";
                    exportVefified = "Not Verified";
                } else if ($(this)[0].IsVerifiedContactNumber == "0") {
                    verificationPhoneStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Its a DND phone number,Click here to make it as not verfied so that u can send sms' src='/images/img_trans.gif' class='DndactiveImg ContributePermission' onclick='MakeItNotVerified(" + $(this)[0].ContactId + ");' style='float: left;padding-right: 5px;background-repeat:no-repeat;' />";
                    exportVefified = "DND Verified ";
                }
                else if ($(this)[0].IsVerifiedContactNumber == "1") {
                    verificationPhoneStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Its a valid phone number' src='/images/img_trans.gif' class='ActiveImg' style='float: left;padding-right: 5px;background-repeat:no-repeat;' />";
                    exportVefified = "Valid";
                }
                else if ($(this)[0].IsVerifiedContactNumber == "2") {
                    verificationPhoneStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Its not a valid phone number' src='/images/img_trans.gif' class='InactiveImg' style='float: left;padding-right: 5px;background-repeat:no-repeat;'/>";
                    exportVefified = "Invalid";
                }

                if (PhoneNumber != "NA")
                    divcontent += "<div style='float:left;width:15%;text-align:left;'>" + verificationPhoneStatusImg + "" + PhoneNumber + "</div>";
                else
                    divcontent += "<div style='float:left;width:15%;text-align:left;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + PhoneNumber + "</div>";
                //divcontent += "<div style='float:left;width:13%;text-align:left;'>" + verificationStatusImg + "</div>";
                divcontent += "<div style='float:left;width:10%;text-align:left;'>" + Unsubscribe + "</div>";

                divcontent += "<div style='float:left;width:20%;text-align:right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].CreatedDate)) + "</div>";

                $("#ui_DataBindIndividual").append("<div class='itemStyle'>" + divcontent + "</div>");

            });
        }
        else {
            $("#ui_DataBindIndividual,#ui_divIndividaul").hide();
            $("#ui_divNodataIndividual").show();
        }
    }
    else {
        $("#ui_DataBindIndividual").hide();
        $("#ui_divNodataIndividual,#ui_divIndividaul").show();
    }
    $("#dvLoadingImg").hide();
    viewMoreDisable = false;
};