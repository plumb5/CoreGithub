
var action = "sent";

var maxRowCount = 0, Offset = 0, rowIndex = 0;
var viewMoreDisable = false;

var sentContactDetails = { MailSendingSettingId: 0, Sent: 0, Opened: -1, Clicked: -1, Forward: 0, Unsubscribe: 0, IsBounced: 2, NotSent: 0, IsSplitTested: 0 };

var groupContacts = { Name: "", GroupDescription: "Group details" };

var FromDate, ToDate;
var MailnotSent = [];

$(document).ready(function () {

    sentContactDetails.WorkFlowDataId = urlParam("WorkFlowDataId");
    sentContactDetails.ConfigureMailId = urlParam("ConfigId");
    sentContactDetails.IsSplitTested = parseInt(urlParam("IsSplitTested")) > 0 ? parseInt(urlParam("IsSplitTested")) : 0;
    FromDate = urlParam("FromDate") == 0 || urlParam("FromDate") == 'null' ? null : urlParam("FromDate").replace('%20', ' ');
    ToDate = urlParam("ToDate") == 0 || urlParam("ToDate") == 'null' ? null : urlParam("ToDate").replace('%20', ' ');

    if (urlParam("action") == "sent") {
        sentContactDetails.Sent = 1;
        sentContactDetails.IsBounced = 0;
        document.title = "Mail Sent Report";
        $(".PageHeadingLabel").html("Mail Sent Report");
    }
    else if (urlParam("action") == "open") {
        sentContactDetails.Opened = 1;
        document.title = "Mail Opened Report";
        $(".PageHeadingLabel").html("Mail Opened Report");

    }
    else if (urlParam("action") == "notopen") {
        sentContactDetails.Opened = 0;
        document.title = "Mail Not Opened Report";
        $(".PageHeadingLabel").html("Mail Not Opened Report");
    }

    else if (urlParam("action") == "clicked") {
        sentContactDetails.Clicked = 1;
        document.title = "Mail Clicked Report";
        $(".PageHeadingLabel").html("Mail Clicked Report");

    }
    else if (urlParam("action") == "notclicked") {
        sentContactDetails.Opened = 1;
        sentContactDetails.Clicked = 0;
        document.title = "Mail Not Clicked Report";
        $(".PageHeadingLabel").html("Mail Not Clicked Report");

    }
    else if (urlParam("action") == "optout") {
        sentContactDetails.Unsubscribe = 1;
        document.title = "Mail Optout Report";
        $(".PageHeadingLabel").html("Mail Optout Report");
    }

    else if (urlParam("action") == "forward") {
        sentContactDetails.Forward = 1;
        document.title = "Mail Forward Report";
        $(".PageHeadingLabel").html("Mail Forward Report");
    }

    else if (urlParam("action") == "bounced") {
        sentContactDetails.IsBounced = 1;
        document.title = "Mail Bounced Report";
        $(".PageHeadingLabel").html("Mail Bounced Report");
    }
    else if (urlParam("action") == "allsent") {
        sentContactDetails.IsBounced = 0;
        document.title = "Mail Report";
        $(".PageHeadingLabel").html("Mail Report");
    }
    else if (urlParam("action") == "deliver") {
        sentContactDetails.Sent = 1;
        document.title = "Mail Deliver";
        $(".PageHeadingLabel").html("Mail Delivered Report");
    }
    else if (urlParam("action") == "error") {
        sentContactDetails.NotSent = 1;
        sentContactDetails.IsBounced = 0;
        document.title = "Block Report";
        $(".PageHeadingLabel").html("Mail Block Report");
    }


    if ((FromDate != null && ToDate != null) && (FromDate != "" && ToDate != "") && (FromDate != undefined && ToDate != undefined)) {
        a = new Date(FromDate);
        b = new Date(ToDate);
        window.lblDate.innerHTML = a.getDate(FromDate) + ' ' + monthDetials[a.getMonth(FromDate)] + ' ' + a.getFullYear(FromDate) + ' - ' + b.getDate(ToDate) + ' ' + monthDetials[b.getMonth(ToDate)] + ' ' + b.getFullYear(ToDate);
        MaxCount();
    }
    else {
        GetDateTimeRange(2);
    }

});

function MaxCount() {

    $.ajax({
        url: "/WorkFlow/CampaignResponseReport/MaxCount",
        type: 'POST',
        data: JSON.stringify({ 'sentContactDetails': sentContactDetails, 'FromDate': FromDate, 'ToDate': ToDate }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            maxRowCount = response.returnVal;
            if (maxRowCount == 0) {
                $("#dvViewMore, #dvLoading, #ui_dvContent,#dvTipsExport").hide();
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
        url: "/WorkFlow/CampaignResponseReport/GetReportDetails",
        type: 'Post',
        data: JSON.stringify({ 'sentContactDetails': sentContactDetails, 'OffSet': OffSet, 'FetchNext': FetchNext, 'FromDate': FromDate, 'ToDate': ToDate }),
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

    MailnotSent = response;
    if (urlParam("action") == "allsent") {
        $("#ui_AllReportData").show();
        AllReportData(response);
    }
    else {
        if (sentContactDetails.IsBounced == 1)
            $(".headerstyle").empty().append("<div style='float: left; width: 3%; text-align: left;'><input id='chkAll' type='checkbox' autocomplete='off' class='chk' /></div><div style='float: left; width: 4%; text-align: left;' title='Unified Customer Profile'>UCP</div><div style='float: left; width: 12%; text-align: left;'>Name</div><div style='float: left; width: 15%; text-align: left;'>Email Id</div><div style='float: left; width: 15%; text-align: left;'>Phone Number</div><div style='float: left; width: 12%; text-align: left;'>Group Name</div><div style='float: left; width: 17%; text-align: left;'>ReasonForBounce</div><div style='float: left; width: 8%; text-align: left;'>Unsubscribed</div><div style='float: right; width: 14%; text-align: right;'>Date</div>");
        $("#ui_ReportData").show();
        
        ReportData(response);
    }

    $("#dvLoading").hide();
    viewMoreDisable = false;
}


function ReportData(response) {
    

    $.each(response, function () {

        var tdContent = "<div style='float: left; width: 3%; text-align: left;'><input id='chk_" + $(this)[0].ContactId + "' value='" + $(this)[0].ContactId + "' type='checkbox' autocomplete='off' class='chk' onclick='  UnCheckAll()'/></div>";

        var verificationEmailIdStatusImg = "";
        if ($(this)[0].IsVerifiedMailId == "-1") {
            verificationEmailIdStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Not yet verified' src='/images/img_trans.gif' class='NotVerifiedImg' style='float: left;padding-right: 5px;'/>";
            exportVefified = "Not Verified";
        } else if ($(this)[0].IsVerifiedMailId == "0") {
            verificationEmailIdStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Its not a valid email id' src='/images/img_trans.gif' class='InactiveImg ContributePermission' style='float: left;padding-right: 5px;'/>";
            exportVefified = "Invalid";
        }
        else if ($(this)[0].IsVerifiedMailId == "1") {
            verificationEmailIdStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Its a valid email id' src='/images/img_trans.gif' class='ActiveImg' style='float: left;padding-right: 5px;'/>";
            exportVefified = "Valid";
        }

        var verificationStatusImg = "";
        if ($(this)[0].IsVerifiedContactNumber == "-1") {
            verificationStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Not yet verified' src='/images/img_trans.gif' class='NotVerifiedImg' style='float: left;padding-right: 5px;'/>";
            exportVefified = "Not Verified";
        } else if ($(this)[0].IsVerifiedContactNumber == "0") {
            verificationStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Its a DND phone number,Click here to make it as not verfied so that u can send sms' src='/images/img_trans.gif' class='DndactiveImg ContributePermission' onclick='MakeItNotVerified(" + $(this)[0].ContactId + ");' style='float: left;padding-right: 5px;'/>";
            exportVefified = "DND Verified ";
        }
        else if ($(this)[0].IsVerifiedContactNumber == "1") {
            verificationStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Its a valid phone number' src='/images/img_trans.gif' class='ActiveImg' style='float: left;padding-right: 5px;' style='float: left;padding-right: 5px;'/>";
            exportVefified = "Valid";
        }
        else if ($(this)[0].IsVerifiedContactNumber == "2") {
            verificationStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Its not a valid phone number' src='/images/img_trans.gif' class='InactiveImg' style='float: left;padding-right: 5px;'/>";
            exportVefified = "Invalid";
        }


        var groupName = $(this)[0].GroupName == null ? "NA" : $(this)[0].GroupName.length > 20 ? $(this)[0].GroupName.substring(0, 20) + ".." : $(this)[0].GroupName;
       
        var ErrorMessage = $(this)[0].ErrorMessage == null ? "NA" : $(this)[0].ErrorMessage.length > 20 ? $(this)[0].ErrorMessage.substring(0, 20) + ".." : $(this)[0].ErrorMessage;
        

        var Name = $(this)[0].Name == null ? "NA" : $(this)[0].Name.length > 20 ? $(this)[0].Name.substring(0, 15) + ".." : $(this)[0].Name;
        var PhoneNumber = $(this)[0].PhoneNumber != null ? $(this)[0].PhoneNumber : "NA";
        var EmailId = $(this)[0].EmailId != null ? $(this)[0].EmailId.length > 15 ? $(this)[0].EmailId.substring(0, 15) + "..." : $(this)[0].EmailId : "NA";
        var Unsubscribe = $(this)[0].Unsubscribe == 0 ? "No" : "Yes";


        if (sentContactDetails.IsBounced == 1) {

            var Reason = $(this)[0].ReasonForBounce.length > 0 ? ($(this)[0].ReasonForBounce.length > 30 ? $(this)[0].ReasonForBounce.substring(0, 30) + "..." : $(this)[0].ReasonForBounce) : "NA";
            var Category = $(this)[0].Category.length > 0 ? $(this)[0].Category : "NA";
            var ErrorCode = $(this)[0].ErrorCode.length > 0 ? $(this)[0].ErrorCode : "NA";

            tdContent += "<div style='float: left; width: 4%; text-align: left;'><a id='lnkCustomer" + $(this)[0].ContactId + "' href=\"javascript:ContactInfo('','" + $(this)[0].ContactId + "');\"><img class='UPC' alt='' src='/images/img_trans.gif' /></a></div>";
            tdContent += "<div style='float: left; width: 12%; text-align: left;' >" + Name + "</div>";


            if (EmailId !== "NA")
                tdContent += "<div style='float: left; width: 15%; text-align: left;' title=\"" + $(this)[0].EmailId + "\">" + verificationEmailIdStatusImg + "" + EmailId + "</div>";
            else
                tdContent += "<div style='float: left; width: 15%; text-align: left;' title=\"" + $(this)[0].EmailId + "\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + EmailId + "</div>";

            if (PhoneNumber != "NA")
                tdContent += "<div style='float: left; width: 15%; text-align: left;' >" + verificationStatusImg + "" + PhoneNumber + "</div>";
            else
                tdContent += "<div style='float: left; width: 15%; text-align: left;' >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + PhoneNumber + "</div>";
            tdContent += "<div style='float: left; width: 12%; text-align: left;'  title=\"" + $(this)[0].ErrorMessage + "\">" + ErrorMessage + "</div>";
            tdContent += "<div style='float: left; width: 17%; text-align: left;' title=\"" + $(this)[0].ReasonForBounce + "\">" + Reason + "</div>";
            tdContent += "<div style='float: left; width: 8%; text-align: left;'>" + Unsubscribe + "</div>";


            if ($(this)[0].BouncedDate == null || $(this)[0].BouncedDate == undefined)
                tdContent += "<div style='float: right; width: 14%; text-align: right;'>NA</div>";
            else
                tdContent += "<div style='float: right; width: 14%; text-align: right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].BouncedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].BouncedDate)) + "</div>";

        }
        else {

            tdContent += "<div style='float: left; width: 4%; text-align: left;'><a id='lnkCustomer" + $(this)[0].ContactId + "' href=\"javascript:ContactInfo('','" + $(this)[0].ContactId + "');\"><img class='UPC' alt='' src='/images/img_trans.gif' /></a></div>";
            tdContent += "<div style='float: left; width: 13%; text-align: left;' title=\"" + $(this)[0].Name + "\">" + Name + "</div>";

            if (EmailId != "NA") {
                tdContent += "<div style='float: left; width: 25%; text-align: left;' title='" + $(this)[0].EmailId + "' >" + verificationEmailIdStatusImg + "" + $(this)[0].EmailId + "</div>";
            }
            else {
                tdContent += "<div style='float: left; width: 25%; text-align: left;' >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NA</div>";
            }
            if (PhoneNumber != "NA")
                tdContent += "<div style='float: left; width: 13%; text-align: left;' >" + verificationStatusImg + "" + PhoneNumber + "</div>";
            else
                tdContent += "<div style='float: left; width: 13%; text-align: left;' >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + PhoneNumber + "</div>";

            tdContent += "<div style='float: left; width: 17%; text-align: left;' title=\"" + $(this)[0].ErrorMessage + "\">" + ErrorMessage + "</div>";
            tdContent += "<div style='float: left; width: 10%; text-align: left;'>" + Unsubscribe + "</div>";

            if ($(this)[0].Date == null || $(this)[0].Date == undefined)
                tdContent += "<div style='float: right; width: 15%; text-align: right;'>NA</div>";
            else
                tdContent += "<div style='float: right; width: 15%; text-align: right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].Date)) + "</div>";
        }

        $("#ui_dvData").append("<div class='itemStyle'>" + tdContent + "</div>");
    });
}


function AllReportData(response) {
    $.each(response, function () {

        var tdContent = "<div style='float: left; width: 3%; text-align: left;'><input id='chk_" + $(this)[0].ContactId + "' value='" + $(this)[0].ContactId + "' type='checkbox' autocomplete='off' class='chk' /></div>";
        var groupName = $(this)[0].GroupName == null ? "NA" : $(this)[0].GroupName.length > 20 ? $(this)[0].GroupName.substring(0, 20) + ".." : $(this)[0].GroupName;
        var EmailId = $(this)[0].EmailId == null ? "NA" : $(this)[0].EmailId.length > 20 ? $(this)[0].EmailId.substring(0, 20) + ".." : $(this)[0].EmailId;


        tdContent += "<div style='float: left; width: 7%; text-align: left;'><a id='lnkCustomer" + $(this)[0].ContactId + "' href=\"javascript:ContactInfo('','" + $(this)[0].ContactId + "');\"><img class='UPC' alt='' src='/images/img_trans.gif' /></a></div>";
        tdContent += "<div style='float: left; width: 15%; text-align: left;' >" + EmailId + "</div>";
        tdContent += "<div style='float: left; width: 14%; text-align: left;' title=\"" + $(this)[0].GroupName + "\">" + groupName + "</div>";

        var IsBounced = $(this)[0].IsBounced == 1 ? "Yes" : "No";

        var sentStatus = 0; notSentStatus = "";
        var SentStatus = "", Opened = "", Clicked = "", Unsubscribe = "";
        if ($(this)[0].SendStatus != null) {
            if ($(this)[0].SendStatus == true) {
                SentStatus = "Yes";
                notSentStatus = "No";
            }
            else {
                notSentStatus = "Yes";
                SentStatus = "No";
            }
        }

        Opened = $(this)[0].Opened == 1 ? "Yes" : "No";
        Clicked = $(this)[0].Clicked == 1 ? "Yes" : "No";
        Unsubscribe = $(this)[0].Unsubscribe == 1 ? "Yes" : "No";


        tdContent += "<div style='float: left; width: 8%; text-align: left;'>" + SentStatus + "</div>";
        tdContent += "<div style='float: left; width: 8%; text-align: left;'>" + Opened + "</div>";
        tdContent += "<div style='float: left; width: 8%; text-align: left;'>" + Clicked + "</div>";
        tdContent += "<div style='float: left; width: 8%; text-align: left;'>" + Unsubscribe + "</div>";
        tdContent += "<div style='float: left; width: 8%; text-align: left;'>" + IsBounced + "</div>";

        if (notSentStatus == "Yes")
            tdContent += "<div style='float: left; width: 7%; text-align: left;'><a href='javascript:void(0);' onclick='GetReason(" + $(this)[0].WorkFlowMailSentId + "," + $(this)[0].ContactId + ");' title='Please click here to see reason'>" + notSentStatus + "</a></div>";
        else
            tdContent += "<div style='float: left; width: 7%; text-align: left;'>" + notSentStatus + "</div>";


        if ($(this)[0].Date == null || $(this)[0].Date == undefined)
            tdContent += "<div style='float: right; width: 14%; text-align: right;'>NA</div>";
        else
            tdContent += "<div style='float: right; width: 14%; text-align: right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].Date)) + "</div>";


        $("#ui_dvData").append("<div class='itemStyle'>" + tdContent + "</div>");
    });
}



$(document.body).on('click', '#chkAll', function (event) {
    if ($(this).is(":checked"))
        $("input:checkbox").prop('checked', true);
    else
        $("input:checkbox").prop('checked', false);
});



function filter() {
    if ($('#dvCustomFilter').is(':visible')) {
        $("#dvCustomFilter").hide();
        hideCalendarControl();
    }
    else {
        $("#dvCustomFilter").show();
    }
}


CallBackFunction = function () {
    FromDate = FromDateTime;
    ToDate = ToDateTime;
    maxRowCount = 0, rowIndex = 0;
    $("#ui_dvData").empty();
    MaxCount();
}


var htmlstring = "";
function GetReason(MailnotSentId, ContactId) {
    $(".bgShadedDiv").show();
    var Details = JSLINQ(MailnotSent)
                   .Where(function (item) { return item.WorkFlowMailSentId == MailnotSentId; })
    var messagecontent = Details["items"][0].MailContent;
    var Ismatch = false;
    $.ajax({
        url: "/Sms/SmsReport/GetContactDetails",
        type: 'Post',
        data: JSON.stringify({ 'contactId': ContactId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null) {

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
            //---PRODUCT REASON----//
            Ismatch = false;
            if (Details["items"][0].ProductIds != null && Details["items"][0].ProductIds != '') {

                $.ajax({
                    url: "/Sms/SmsReport/GetProductDetailsById",
                    type: 'Post',
                    data: JSON.stringify({ 'ProductIds': Details["items"][0].ProductIds }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        if (response != null) {
                            var Notsentprd = response;
                            var productobj = response[0];
                            var productmessage = "<b>Product:</b><br /> The value for the fields by product wise given below is Null/Empty in product table at the time of campaign.<br>";
                            var index = 0;

                            for (var i = 0; i < Notsentprd.length; i++) {
                                index = i + 1;
                                productmessage += "\n<span>ProductId (" + Notsentprd[i].Id + ")-Fields-";
                                for (var key in productobj) {
                                    if (messagecontent.indexOf("<!--" + key + "_" + index + "-->") >= 0 || messagecontent.indexOf("[{*" + key + "_" + index + "*}]") >= 0) {
                                        Ismatch = true;
                                        productmessage += " " + key + ",";
                                    }
                                }
                                productmessage = productmessage.slice(0, -1);
                                productmessage = productmessage + "-Last updated date - " + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(Notsentprd[i].UpdatedDate)) + "</span><br>";
                            }
                            productmessage += "<br><span>Hence,the above mentioned tags are not replaced with value.</span><br>";



                        }

                        if (Ismatch == true) {
                            $('#producttext').html(productmessage);
                            $('#producttext').show();
                        }
                        else {
                            $('#producttext').html('');
                            $('#producttext').hide();
                        }

                    },
                    error: ShowAjaxError
                });
            }
            else {

                var msg = "<b>Product:</b><br /> Product is not found based on the specified conditions for the tags used.<br>Hence,the below mention tags are not replaced with value.";
                var Pmsg = "";
                if (ProductColumn != null) {
                    for (var i = 1; i <= 8; i++) {
                        for (var j = 0; j < ProductColumn.length; j++) {
                            if (messagecontent.indexOf("<!--" + ProductColumn[j].Name + "_" + i + "-->") >= 0 || messagecontent.indexOf("[{*" + ProductColumn[j].Name + "_" + i + "*}]") >= 0) {
                                Ismatch = true;
                                Pmsg += "<span>" + ProductColumn[j].Name + "_" + i + "<span><br>";
                            }
                        }

                    }
                    if (Ismatch) {
                        msg += "<br>" + Pmsg;
                        $('#producttext').html(msg);
                        $('#producttext').show();
                    }
                    else {
                        $('#producttext').html('');
                        $('#producttext').hide();
                    }
                }
            }

            //---PRODUCT REASON----//
        },
        error: ShowAjaxError
    });
    htmlstring = "";
    htmlstring = messagecontent;
    $("#dvReson").show();
}
$("#lnkshowblockmail").click(function () {
    //avoid click count
    var nodeNames = [];
    htmlstring = htmlstring.replace(/<\/?a[^>]*>/g, "");
    //avoid open count
    var mailTrackImgTag = jQuery.parseHTML(htmlstring);
    $.each(mailTrackImgTag, function (i, el) {
        nodeNames[i] = el.nodeName.toLowerCase();
        if (nodeNames[i].includes("img")) {
            var openURL = mailTrackImgTag[i];
            if (openURL.outerHTML.toLowerCase().includes("/workflowmailtrack/index")) {
                var htmlimgtag = openURL.outerHTML.replace("&amp;", "&").replace("&amp;", "&").replace("&amp;", "&").replace(">", " />");
                if (htmlimgtag.indexOf("alt") > -1) {
                    var old = htmlimgtag.substring(htmlimgtag.indexOf("alt"));
                    var news = old.replace('"', "'").replace('"', "'");
                    htmlimgtag = htmlimgtag.replace(old, news)
                }
                htmlstring = htmlstring.replace(htmlimgtag, "");
            }
        }
    });
    htmlstring = htmlstring.replace("data:text/html;charset=utf-8,", "");
    var htmlcontent = "data:text/html;charset=utf-8," + "data:text/html;charset=utf-8," + htmlstring;
    $('#iframemail').attr('src', htmlcontent);
    $("#dvframemail").show();
    $("#dvReson").hide();
});
$("#closemailpopup").click(function () {
    $("#dvframemail").hide();
    $("#dvReson").show();
});
GetProductColumns = function () {
    $.ajax({
        url: "/Form/ProductGroup/GetProductColumns",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            ProductColumn = response;
        },
        error: ShowAjaxError
    });
}

function UnCheckAll() {
    if (!$(this).is(":checked")) {
        if ($("#chkAll").is(":checked"))
            $("#chkAll").prop('checked', false);
    }
}
