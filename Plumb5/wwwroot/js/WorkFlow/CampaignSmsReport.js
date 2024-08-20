

var action = "0";

var maxRowCount = 0, Offset = 0, rowIndex = 0;
var viewMoreDisable = false;

var sentContactDetails = { WorkFlowDataId: 0, ConfigureSmsId: 0, IsDelivered: -1, IsClicked: -1, NotDeliverStatus: -1, Pending: -1, MobileNumber: "", Circle: "", Operator: "", SendStatus: 1, IsUnsubscribe: 0, IsSplitTested: 0 };
var groupContacts = { Name: "", GroupDescription: "Group details" };
var contactDetails = { UserId: 0, ContactNameId: 0, ContactListId: 0, ContactNameIdList: [] };

var FromDate, ToDate;
var SmsnotSent = [];

$(document).ready(function () {

    sentContactDetails.WorkFlowDataId = urlParam("WorkFlowDataId");
    sentContactDetails.ConfigureSmsId = urlParam("ConfigId");
    sentContactDetails.IsSplitTested = parseInt(urlParam("IsSplitTested")) > 0 ? parseInt(urlParam("IsSplitTested")) : 0;
    FromDate = urlParam("FromDate") == 0 || urlParam("FromDate") == 'null' ? null : urlParam("FromDate").replace('%20', ' ');
    ToDate = urlParam("ToDate") == 0 || urlParam("ToDate") == 'null' ? null : urlParam("ToDate").replace('%20', ' ');

    if (urlParam("action") == "0") {
        sentContactDetails.SendStatus = 1;
        document.title = "Sms Sent Report";
        $(".PageHeadingLabel").html("Sms Sent Report");
    }
    else if (urlParam("action") == "1") {
        sentContactDetails.IsDelivered = 1;
        document.title = "Sms Delivered Report";
        $(".PageHeadingLabel").html("Sms Delivered Report");
    }
    else if (urlParam("action") == "2") {
        sentContactDetails.IsClicked = 1;
        document.title = "Sms Clicked Report";
        $(".PageHeadingLabel").html("Sms Clicked Report");
    }
    else if (urlParam("action") == "7") {
        sentContactDetails.IsClicked = 0;
        sentContactDetails.IsDelivered = 1;
        document.title = "Sms Not Clicked Report";
        $(".PageHeadingLabel").html("Sms Not Clicked Report");
    }
    else if (urlParam("action") == "3") {
        sentContactDetails.NotDeliverStatus = 1;
        document.title = "Sms Bounced Report";
        $(".PageHeadingLabel").html("Sms Bounced Report");
    }
    else if (urlParam("action") == "4") {
        sentContactDetails.Pending = 1;
        document.title = "Sms Pending Report";
        $(".PageHeadingLabel").html("Sms Pending Report");
    }
    else if (urlParam("action") == "6") {
        sentContactDetails.IsUnsubscribe = 1;
        document.title = "Sms OptOut Report";
        $(".PageHeadingLabel").html("Sms OptOut Report");
    }
    else if (urlParam("action") == "8") {
        document.title = "Sms Report";
        $(".PageHeadingLabel").html("Sms Report");
    }
    else if (urlParam("action") == "9") {
        sentContactDetails.SendStatus = 0;
        document.title = "Sms Error Report";
        $(".PageHeadingLabel").html("Sms Error Report");
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


    //GetGroupName();

});

GetGroupName = function () {

    $.ajax({
        url: "/Sms/Groups/GetGroupList",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response, function () {
                optlist = document.createElement('option');
                optlist.value = $(this)[0].Id;
                optlist.text = $(this)[0].Name;
                document.getElementById("ui_ddlGroup").options.add(optlist);
            });
        },
        error: ShowAjaxError
    });
};

function MaxCount() {

    $.ajax({
        url: "/WorkFlow/CampaignSmsReport/MaxCount",
        type: 'POST',
        data: JSON.stringify({ 'sentContactDetails': sentContactDetails, 'FromDate': FromDate, 'ToDate': ToDate }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            maxRowCount = response;
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
        url: "/WorkFlow/CampaignSmsReport/GetReportDetails",
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

    if (rowIndex == maxRowCount)
        $("#ui_lnkViewMore").hide();

    if (rowIndex >= 1 || maxRowCount >= 1)
        $("#dvTipsExport").show();


    $("#ui_dvContent").show();
    SmsnotSent = response;
    if (urlParam("action") == "8") {
        $("#ui_divAllDeliveryreport").show();
        AllReport(response);
    }
    else {
        $("#ui_divDeliveryreport").show();
        Report(response);
    }


    $("#dvLoading").hide();
    viewMoreDisable = false;
}

function Report(response) {
    $.each(response, function () {

        var groupName = $(this)[0].GroupName == null || $(this)[0].GroupName == "" ? "NA" : $(this)[0].GroupName.length > 13 ? $(this)[0].GroupName.substring(0, 13) + ".." : $(this)[0].GroupName;
        var Name = $(this)[0].Name == null || $(this)[0].Name == "" ? "NA" : $(this)[0].Name.length > 13 ? $(this)[0].Name.substring(0, 13) + ".." : $(this)[0].Name;
        var EmailId = $(this)[0].EmailId == null || $(this)[0].EmailId == "" ? "&nbsp;NA" : $(this)[0].EmailId.length > 13 ? $(this)[0].EmailId.substring(0, 13) + ".." : $(this)[0].EmailId;
        var Circle = $(this)[0].Circle == null || $(this)[0].Circle == "" ? "NA" : $(this)[0].Circle.length > 13 ? $(this)[0].Circle.substring(0, 13) + ".." : $(this)[0].Circle;
        var Operator = $(this)[0].Operator == null || $(this)[0].Operator == "" ? "NA" : $(this)[0].Operator.length > 13 ? $(this)[0].Operator.substring(0, 13) + ".." : $(this)[0].Operator;
        var ReasonForNotDelivery = $(this)[0].ReasonForNotDelivery == null || $(this)[0].ReasonForNotDelivery == "" ? "NA" : $(this)[0].ReasonForNotDelivery.length > 13 ? $(this)[0].ReasonForNotDelivery.substring(0, 13) + ".." : $(this)[0].ReasonForNotDelivery;
        var Unsusbscribe = $(this)[0].Unsubscribe == 1 ? "Yes" : "No";
        var PhoneNumber = $(this)[0].PhoneNumber != null ? $(this)[0].PhoneNumber : "&nbsp;NA";

        var verificationEmailIdStatusImg = "";
        if ($(this)[0].IsVerifiedMailId == "-1") {
            verificationEmailIdStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Not yet verified' src='/images/img_trans.gif' class='NotVerifiedImg' style='float: left;padding-right: 5px;background-repeat:no-repeat;'/>";
            exportVefified = "Not Verified";
        } else if ($(this)[0].IsVerifiedMailId == "0") {
            verificationEmailIdStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Its not a valid email id' src='/images/img_trans.gif' class='InactiveImg ContributePermission' style='float: left;padding-right: 5px;background-repeat:no-repeat;'/>";
            exportVefified = "Invalid";
        }
        else if ($(this)[0].IsVerifiedMailId == "1") {
            verificationEmailIdStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Its a valid email id' src='/images/img_trans.gif' class='ActiveImg' style='float: left;padding-right: 5px;background-repeat:no-repeat;'/>";
            exportVefified = "Valid";
        }

        var verificationStatusImg = "";
        if ($(this)[0].IsVerifiedContactNumber == "-1") {
            verificationStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Not yet verified' src='/images/img_trans.gif' class='NotVerifiedImg' style='float: left;padding-right: 5px;background-repeat:no-repeat;'/>";
            exportVefified = "Not Verified";
        } else if ($(this)[0].IsVerifiedContactNumber == "0") {
            verificationStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Its a DND phone number,Click here to make it as not verfied so that u can send sms' src='/images/img_trans.gif' class='DndactiveImg ContributePermission' onclick='MakeItNotVerified(" + $(this)[0].ContactId + ");' style='float: left;padding-right: 5px;background-repeat:no-repeat;'/>";
            exportVefified = "DND Verified ";
        }
        else if ($(this)[0].IsVerifiedContactNumber == "1") {
            verificationStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Its a valid phone number' src='/images/img_trans.gif' class='ActiveImg' style='float: left;padding-right: 5px;background-repeat:no-repeat;'/>";
            exportVefified = "Valid";
        }
        else if ($(this)[0].IsVerifiedContactNumber == "2") {
            verificationStatusImg = "<img id='ui_imgVerificationStatus_" + $(this)[0].ContactId + "' alt='' title='Its not a valid phone number' src='/images/img_trans.gif' class='InactiveImg' style='float: left;padding-right: 5px;background-repeat:no-repeat;'/>";
            exportVefified = "Invalid";
        }



        var tdContent = "<div style='float: left; width: 3%; text-align: left;'><input id='chk_" + $(this)[0].ContactId + "' value='" + $(this)[0].ContactId + "' type='checkbox' autocomplete='off' class='chk' /></div>";
        tdContent += "<div style='float: left; width: 4%; text-align: left;'><a id='lnkCustomer" + $(this)[0].ContactId + "' href=\"javascript:ContactInfo('','" + $(this)[0].ContactId + "');\"><img class='UPC' alt='' src='/images/img_trans.gif' /></a></div>";

        if (Name != "NA")
            tdContent += "<div style='float: left; width: 10%; text-align: left;' title='" + $(this)[0].Name + "'>" + Name + "</div>";
        else
            tdContent += "<div style='float: left; width: 10%; text-align: left;' title='Not Applicable'>" + Name + "</div>";

        if (EmailId != "&nbsp;NA")
            tdContent += "<div style='float: left; width: 14%; text-align: left;' title='" + $(this)[0].EmailId + "'>" + verificationEmailIdStatusImg + "" + EmailId + "</div>";
        else
            tdContent += "<div style='float: left; width: 14%; text-align: left;' title='Not Applicable'>" + EmailId + "</div>";

        if (PhoneNumber != "&nbsp;NA")
            tdContent += "<div style='float: left; width: 14%; text-align: left;' >" + verificationStatusImg + "" + PhoneNumber + "</div>";
        else
            tdContent += "<div style='float: left; width: 14%; text-align: left;' >" + PhoneNumber + "</div>";

        if (groupName != "NA")
            tdContent += "<div style='float: left; width: 14%; text-align: left;' title='" + $(this)[0].GroupName + "'>" + groupName + "</div>";
        else
            tdContent += "<div style='float: left; width: 14%; text-align: left;' title='Not Applicable'>" + groupName + "</div>";

        tdContent += "<div style='float: left; width: 12%; text-align: left;' >" + Unsusbscribe + "</div>";

        //tdContent += "<div style='float: left; width: 11%; text-align: left;' title='" + $(this)[0].Circle + "'>" + Circle + "</div>";

        //tdContent += "<div style='float: left; width: 12%; text-align: left;' title='" + $(this)[0].Operator + "'>" + Operator + "</div>";
        if (ReasonForNotDelivery != "NA")
            tdContent += "<div style='float: left; width: 11%; text-align: left;' title='" + $(this)[0].ReasonForNotDelivery + "'>" + ReasonForNotDelivery + "</div>";
        else
            tdContent += "<div style='float: left; width: 11%; text-align: left;' title='Not Applicable'>" + ReasonForNotDelivery + "</div>";
        //tdContent += "<div style='float: right; width: 15%; text-align: right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].SentDate)) + "</div>";


        if (urlParam("action") == "0" || urlParam("action") == "4" || urlParam("action") == "7") {
            tdContent += "<div style='float: right; width: 18%; text-align: right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].SentDate)) + "</div>";
        }
        else if (urlParam("action") == "1") {
            $("#ui_responseDate").html("Delivery Time");
            var DeliveryTime = $(this)[0].DeliveryTime == null ? "NA" : $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].DeliveryTime)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].DeliveryTime));
            tdContent += "<div style='float: right; width: 18%; text-align: right;'> " + DeliveryTime + " </div>";
        }
        else if (urlParam("action") == "2") {
            $("#ui_responseDate").html("Clicked Date");
            var ClickDate = $(this)[0].ClickDate == null ? "NA" : $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].ClickDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].ClickDate));
            tdContent += "<div style='float: right; width: 18%; text-align: right;'> " + ClickDate + " </div>";
        }
        else if (urlParam("action") == "3") {
            $("#ui_responseDate").html("Bounced Date");
            var BouncedDate = $(this)[0].BouncedDate == null ? "NA" : $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].BouncedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].BouncedDate));
            tdContent += "<div style='float: right; width: 18%; text-align: right;'> " + BouncedDate + " </div>";
        }
        //if ($(this)[0].DeliveryTime == null) {
        //    tdContent += "<div style='float: left; width: 15%; text-align: right;'> NA </div>";
        //} else {
        //    tdContent += "<div style='float: right; width: 15%; text-align: right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].DeliveryTime)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].DeliveryTime)) + "</div>";
        //}

        $("#ui_dvData").append("<div id='ui_divContact_" + $(this)[0].ContactId + "' class='itemStyle'>" + tdContent + "</div>");
    });
}

function AllReport(response) {
    $.each(response, function () {

        var tdContent = "<div style='float: left; width: 3%; text-align: left;'><input id='chk_" + $(this)[0].ContactId + "' value='" + $(this)[0].ContactId + "' type='checkbox' autocomplete='off' class='chk' /></div>";
        tdContent += "<div style='float: left; width: 4%; text-align: left;'><a id='lnkCustomer" + $(this)[0].ContactId + "' href=\"javascript:ContactInfo('','" + $(this)[0].ContactId + "');\"><img class='UPC' alt='' src='/images/img_trans.gif' /></a></div>";
        tdContent += "<div style='float: left; width: 13%; text-align: left;'>" + $(this)[0].PhoneNumber + "</div>";

        var groupName = $(this)[0].GroupName == null || $(this)[0].GroupName == "" ? "NA" : $(this)[0].GroupName.length > 13 ? $(this)[0].GroupName.substring(0, 13) + ".." : $(this)[0].GroupName;



        var Sent = "No", NotSent = "No";
        if ($(this)[0].SendStatus != null) {
            if ($(this)[0].SendStatus == true)
                Sent = "Yes";
            else {
                NotSent = "Yes";
            }

        }

        var IsDelivered = $(this)[0].IsDelivered == 0 ? "No" : "Yes";
        var IsClicked = $(this)[0].IsClicked == 0 ? "No" : "Yes";
        var NotDeliverStatus = $(this)[0].NotDeliverStatus == 0 ? "No" : "Yes";


        tdContent += "<div style='float: left; width: 15%; text-align: left;' title='" + $(this)[0].GroupName + "'>" + groupName + "</div>";
        tdContent += "<div style='float: left; width: 10%; text-align: left;'>" + Sent + "</div>";
        tdContent += "<div style='float: left; width: 10%; text-align: left;'>" + IsDelivered + "</div>";
        tdContent += "<div style='float: left; width: 10%; text-align: left;'>" + IsClicked + "</div>";
        tdContent += "<div style='float: left; width: 10%; text-align: left;'>" + NotDeliverStatus + "</div>";
        if (NotSent == 1)
            tdContent += "<div style='float: left; width: 10%; text-align: right;'><a href='javascript:void(0);' onclick='GetReason(" + $(this)[0].WorkFlowSmsSentId + "," + $(this)[0].ContactId + ");' title='Please click here to see reason'>" + NotSent + "</a></div>";
        else
            tdContent += "<div style='float: left; width: 10%; text-align: left;'>" + NotSent + "</div>";

        tdContent += "<div style='float: right; width: 15%; text-align: right;'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].SentDate)) + "</div>";


        $("#ui_dvData").append("<div id='ui_divContact_" + $(this)[0].ContactId + "' class='itemStyle'>" + tdContent + "</div>");
    });
}


$("#chkAll").on("click", function () {
    $('.chk:input:checkbox').not(this).prop('checked', this.checked);
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

function GetReason(SmsNotsentId, ContactId) {
    $(".bgShadedDiv").show();
    var Details = JSLINQ(SmsnotSent)
                   .Where(function (item) { return item.WorkFlowSmsSentId == SmsNotsentId; })
    var messagecontent = Details["items"][0].MessageContent;
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
            if (Details["items"][0].ProductIds != '') {

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


    $('#originaltext').text(messagecontent);
    $("#dvReson").show();
}
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
