var workflowreport = { WorkFlowId: 0, NodeId: 0, NodeType: 0 };

var maxRowCount = 0, Offset = 0, rowIndex = 0;
var viewMoreDisable = false;
CustomFields = [];
$(document).ready(function () {
    $("#dvLoading").show();
    workflowreport.WorkFlowId = urlParam("WorkFlowId");
    workflowreport.NodeId = urlParam("NodeId");
    workflowreport.NodeType = urlParam("NodeType");
    GetExtraFiels();
    MaxCount();
});


function MaxCount() {

    $.ajax({
        url: "/WorkFlow/Report/MaxCount",
        type: 'POST',
        data: JSON.stringify({ 'workflowreport': workflowreport }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            maxRowCount = response;
            if (maxRowCount == 0) {
                $("#div_ViewMore, #dvLoading, #ui_dvContent,#dvTipsExport").hide();
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
        url: "/WorkFlow/Report/GetReport",
        type: 'Post',
        data: JSON.stringify({ 'workflowreport': workflowreport, 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindReportDetails,
        error: ShowAjaxError
    });
}

function BindReportDetails(response) {


    if (response != "Nodata") {

    
    rowIndex = response.length + rowIndex;
    $("#div_Records").html(rowIndex + " out of " + maxRowCount + " records");

    if (rowIndex == maxRowCount) {
        $("#ui_lnkViewMore").hide();
    }

    $("#ui_dvContent,#dvTipsExport").show();


    $.each(response, function () {
        var tdContent = "";
        if ($(this)[0].NodeType == "mail") {
            $("#ui_dvContentMail").show();
            var EmailId = $(this)[0].EmailId != null ? $(this)[0].EmailId : "NA";
            var MailTemplateName = $(this)[0].MailTemplateName != null ? $(this)[0].MailTemplateName.length > 20 ? $(this)[0].MailTemplateName.substring(0, 20) + ".." : $(this)[0].MailTemplateName : "NA";
            var MailOpened = $(this)[0].MailOpened != null ? $(this)[0].MailOpened : "NA";
            var MailClicked = $(this)[0].MailClicked != null ? $(this)[0].MailClicked : "NA";
            var MailForward = $(this)[0].MailForward != null ? $(this)[0].MailForward : "NA";
            var MailUnsubscribe = $(this)[0].MailUnsubscribe != null ? $(this)[0].MailUnsubscribe : "NA";
            var MailIsBounced = $(this)[0].MailIsBounced != null ? $(this)[0].MailIsBounced : "NA";
            var MailSentDate = $(this)[0].MailSentDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].MailSentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].MailSentDate)) : "NA";
            tdContent += "<div style='float:left;width:20%;text-align:left;'>" + EmailId + "</div>";
            tdContent += "<div style='float:left;width:20%;text-align:left;' title='" + $(this)[0].MailTemplateName + "'>" + MailTemplateName + "</div>";
            tdContent += "<div style='float:left;width:8%;text-align:right;'>" + MailOpened + "</div>";
            tdContent += "<div style='float:left;width:8%;text-align:right;'>" + MailClicked + "</div>";
            tdContent += "<div style='float:left;width:8%;text-align:right;'>" + MailForward + "</div>";
            tdContent += "<div style='float:left;width:8%;text-align:right;'>" + MailUnsubscribe + "</div>";
            tdContent += "<div style='float:left;width:8%;text-align:right;'>" + MailIsBounced + "</div>";
            tdContent += "<div style='float:right;width:20%;text-align:right;'>" + MailSentDate + "</div>";

        }
        else if ($(this)[0].NodeType == "sms") {
            $("#ui_dvContentSMS").show();
            var PhoneNumber = $(this)[0].PhoneNumber != null ? $(this)[0].PhoneNumber : "NA";
            var SmsTemplateName = $(this)[0].SmsTemplateName != null ? $(this)[0].SmsTemplateName.length > 20 ? $(this)[0].SmsTemplateName.substring(0, 20) + ".." : $(this)[0].SmsTemplateName : "NA";
            var SMSDelivered = $(this)[0].SMSDelivered != null ? $(this)[0].SMSDelivered : "NA";
            var SMSClicked = $(this)[0].SMSClicked != null ? $(this)[0].SMSClicked : "NA";
            var SMSOptOut = $(this)[0].SMSOptOut != null ? $(this)[0].SMSOptOut : "NA";
            var SMSBounced = $(this)[0].SMSBounced != null ? $(this)[0].SMSBounced : "NA";
            var MailIsBounced = $(this)[0].MailIsBounced != null ? $(this)[0].MailIsBounced : "NA";
            var SMSSentDate = $(this)[0].SMSSentDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].SMSSentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].SMSSentDate)) : "NA";

            tdContent += "<div style='float:left;width:20%;text-align:left;'>" + PhoneNumber + "</div>";
            tdContent += "<div style='float:left;width:20%;text-align:left;' title='" + $(this)[0].SmsTemplateName + "'>" + SmsTemplateName + "</div>";
            tdContent += "<div style='float:left;width:10%;text-align:right;'>" + SMSDelivered + "</div>";
            tdContent += "<div style='float:left;width:10%;text-align:right;'>" + SMSClicked + "</div>";
            tdContent += "<div style='float:left;width:10%;text-align:right;'>" + SMSOptOut + "</div>";
            tdContent += "<div style='float:left;width:10%;text-align:right;'>" + SMSBounced + "</div>";
            tdContent += "<div style='float:right;width:20%;text-align:right;'>" + SMSSentDate + "</div>";
        }
        else if ($(this)[0].NodeType == "form") {
            $("#ui_dvContentform").show();
            var EmailId = $(this)[0].EmailId != null ? $(this)[0].EmailId : "NA";
            var PhoneNumber = $(this)[0].PhoneNumber != null ? $(this)[0].PhoneNumber : "NA";
            var FormName = $(this)[0].FormName != null ? $(this)[0].FormName.length > 20 ? $(this)[0].FormName.substring(0, 20) + ".." : $(this)[0].FormName : "NA";
            var FormType = $(this)[0].FormType != null ? $(this)[0].FormType.length > 20 ? $(this)[0].FormType.substring(0, 20) + ".." : $(this)[0].FormType : "NA";
            var FormViewed = $(this)[0].FormViewed != null ? $(this)[0].FormViewed : "NA";
            var FormResponded = $(this)[0].FormResponded != null ? $(this)[0].FormResponded : "NA";
            var FormClosed = $(this)[0].FormClosed != null ? $(this)[0].FormClosed : "NA";
            var FormViewDate = $(this)[0].FormViewDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].FormViewDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].FormViewDate)) : "NA";

            tdContent += "<div style='float:left;width:15%;text-align:left;'>" + EmailId + "</div>";
            tdContent += "<div style='float:left;width:15%;text-align:left;'>" + PhoneNumber + "</div>";
            tdContent += "<div style='float:left;width:15%;text-align:left;' title='" + $(this)[0].FormName + "'>" + FormName + "</div>";
            tdContent += "<div style='float:left;width:15%;text-align:left;' title='" + $(this)[0].FormType + "'>" + FormType + "</div>";
            tdContent += "<div style='float:left;width:6%;text-align:right;'>" + FormViewed + "</div>";
            tdContent += "<div style='float:left;width:6%;text-align:right;'>" + FormResponded + "</div>";
            tdContent += "<div style='float:left;width:6%;text-align:right;'>" + FormClosed + "</div>";
            tdContent += "<div style='float:right;width:20%;text-align:right;'>" + FormViewDate + "</div>";
        }       
        else if ($(this)[0].NodeType == "chat") {
            $("#ui_dvContentchat").show();
            var EmailId = $(this)[0].EmailId != null ? $(this)[0].EmailId : "NA";
            var PhoneNumber = $(this)[0].PhoneNumber != null ? $(this)[0].PhoneNumber : "NA";
            var ChatName = $(this)[0].ChatName != null ? $(this)[0].ChatName.length > 20 ? $(this)[0].ChatName.substring(0, 20) + ".." : $(this)[0].ChatName : "NA";
            var ChatViewed = $(this)[0].ChatViewed != null ? $(this)[0].ChatViewed: "NA";
            var ChatResponded = $(this)[0].ChatResponded != null ? $(this)[0].ChatResponded : "NA";
            var ChatClosed = $(this)[0].ChatClosed != null ? $(this)[0].ChatClosed : "NA";
            var ChatViewDate = $(this)[0].ChatViewDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].ChatViewDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].ChatViewDate)) : "NA";
            var ChatUserId = $(this)[0].ChatUserId != null ? $(this)[0].ChatUserId : 0;
            if (ChatUserId==0) {
                tdContent += "<div style='float: left; width: 25%;text-align:left'>" + EmailId + "</div>";

            }
            else {
                tdContent += "<div style='float: left; width: 25%;text-align:left'><a href='javascript:void(0);' onclick=\"GetChatHistory(" + $(this)[0].ContactId + ",'" + ChatUserId + "');\"><img class='expandCollapseImg ExpandImage' id='imgLead-" + $(this)[0].ContactId + "_" + ChatUserId + "' src='/images/img_trans.gif' /> " + EmailId + "</a><a id='ui_lnkEvent_" + ChatUserId + "' style='display:none;' onclick=\"ShowUserEvents('" + ChatUserId + "');\"><img class='ShowEventList' alt='ShowEvent' title='Show Events' src='/images/img_trans.gif' /></a></div>";

            }
            tdContent += "<div style='float:left;width:15%;text-align:left;'>" + PhoneNumber + "</div>";
            tdContent += "<div style='float:left;width:20%;text-align:left;' title='" + $(this)[0].ChatName + "'>" + ChatName + "</div>";
            tdContent += "<div style='float:left;width:6%;text-align:right;'>" + ChatViewed + "</div>";
            tdContent += "<div style='float:left;width:8%;text-align:right;'>" + ChatResponded + "</div>";
            tdContent += "<div style='float:left;width:6%;text-align:right;'>" + ChatClosed + "</div>";
            tdContent += "<div style='float:right;width:20%;text-align:right;'>" + ChatViewDate + "</div>";

        }
        else if ($(this)[0].NodeType == "interval" || $(this)[0].NodeType == "rule" || $(this)[0].NodeType == "dateandtime" || $(this)[0].NodeType == "time") {
            $("#ui_dvContentall").show();
            var EmailId = $(this)[0].EmailId != null ? $(this)[0].EmailId : "NA";
            var PhoneNumber = $(this)[0].PhoneNumber != null ? $(this)[0].PhoneNumber : "NA";
            var Date = $(this)[0].CreatedDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].CreatedDate)) : "NA";
            tdContent += "<div style='float:left;width:30%;text-align:left;'>" + EmailId + "</div>";
            tdContent += "<div style='float:left;width:30%;text-align:left;'>" + PhoneNumber + "</div>";
            tdContent += "<div style='float:right;width:40%;text-align:right;'>" + Date + "</div>";


        }
        $("#ui_dvData").append("<div class='itemStyle'>" + tdContent + "</div>");
        if ($(this)[0].NodeType == "chat") {
            $("#ui_dvData").append("<div  id='tr_" + $(this)[0].ContactId + "_" + ChatUserId + "' class='itemStyle itemStyleSubContent' style='display:none;background-color:#fff;' emailid='" + EmailId + "' phonenumber='" + PhoneNumber + "' 'ContactId='" + $(this)[0].ContactId + "'></div>");

        }


    });

    $("#dvLoading").hide();
    viewMoreDisable = false;
    }
    else {
        $("#div_ViewMore, #dvLoading, #ui_dvContent,#dvTipsExport").hide();
        $("#dvDefault").show();
    }
}

function GetChatHistory(ContactId, ChatUserId) {
        if (document.getElementById("tr_" + ContactId + "_" + ChatUserId).style.display == "block") {
            $("#imgLead-" + ContactId + "_" + ChatUserId).removeClass("CollapseImg").addClass("ExpandImage");
            document.getElementById("tr_" + ContactId + "_" + ChatUserId).style.display = "none";
            document.getElementById("ui_lnkEvent_" + ChatUserId).style.display = "none";

        }
        else {
            $("#ui_lnkEvent_" + ChatUserId).show();
            if ($("#tr_" + ContactId + "_" + ChatUserId).html().length == 0) {
                SubTableChatDetails(ContactId, ChatUserId);
            }
            else {
                $("#imgLead-" + ContactId + "_" + ChatUserId).removeClass("ExpandImage").addClass("CollapseImg");
                document.getElementById("tr_" + ContactId + "_" + ChatUserId).style.display = "block";
            }
        }
}
//ChatId is not used in the sp bt its used in controller for that simply passed

function SubTableChatDetails(ContactId, ChatUserId) {
 
    $("#dvLoading").show();
    $.ajax({
        url: "/Chat/Responses/GetParticularData",
        type: 'POST',
        data: JSON.stringify({ 'ChatId': 0, 'userId': ChatUserId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
           
            if (!isOjectEmpty(response)) {
                var tdContent = "";
                if (response.length > 0) {
                    trRowContent = "";

                    var emailid = $("#tr_" + ContactId + "_" + ChatUserId).attr('emailid') != "null" ? $("#tr_" + ContactId + "_" + ChatUserId).attr('emailid') : "";
                    var phoneNumber = $("#tr_" + ContactId + "_" + ChatUserId).attr('phonenumber') != "null" ? $("#tr_" + ContactId + "_" + ChatUserId).attr('phonenumber') : "";
                    var ContactId = $("#tr_" + ContactId + "_" + ChatUserId).attr('ContactId') != "null" ? $("#tr_" + ContactId + "_" + ChatUserId).attr('ContactId') : "";
                  
                    if (emailid.length > 0 || phoneNumber.length > 0)
                        tdContent += "<div id=" + ContactId + " class='ResponseSeparator'><div><span class='contactData'>Email-ID : </span>" + emailid + "</div><div><span class='contactData'>Phone : </span>" + phoneNumber + "</div><a href='javascript:void(0);' id=" + ContactId + "," + ChatUserId + " onclick=GetContactDetails(this.id);><input type='button' class='inputee ContributePermission' style='padding-top: 3px;padding-right: 10px;cursor:pointer;' value='View More' id='ui_btnViewMore" + ContactId + "'></a></div>";

                    $.each(response, function (i) {
                        if (i == 0) {
                            tdContent += "<div class='ResponseSeparator'><div class='ResponseDateSeparator'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response[i].ChatDate)) + "</div>";
                        }
                        if (i > 0) {
                            var presentDate = $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response[i].ChatDate));
                            var pastDate = $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response[i - 1].ChatDate));
                            if (presentDate != pastDate) {
                                tdContent += "</div>";
                                if (i != response.length)
                                    tdContent += "<div class='ResponseSeparator'><div class='ResponseDateSeparator'>" + presentDate + "</div>";
                            }
                        }

                        if ($(this)[0].IsAdmin == "1") {
                            tdContent += "<div style='display:block;white-space: pre-wrap;'><span class='unknowMesgStyle'>" + $(this)[0].Name + "</span>: " + $(this)[0].ChatText + "   <span class='DateTimeStyle'> " + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].ChatDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].ChatDate)) + "</span></div>";
                        }
                        else {
                            tdContent += "<div style='display:block;white-space: pre-wrap;'><span class='AgentStyle'>" + $(this)[0].Name + "</span>: " + $(this)[0].ChatText + "  <span class='DateTimeStyle'> " + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].ChatDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj($(this)[0].ChatDate)) + "</span></div>";
                        }
                    });
                }
                $("#tr_" + ContactId + "_" + ChatUserId).html(tdContent).show();

                $("#imgLead-" + ContactId + "_" + ChatUserId).removeClass("ExpandImage").addClass("CollapseImg");

                document.getElementById("tr_" + ContactId + "_" + ChatUserId).style.display = "block";
            }
            
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
}

function GetContactDetails(id) {
    var ids = id.split(",");
    if ($(".subdata_" + ids[1]).text().length == 0) {
        $.ajax({
            url: "/Chat/Responses/GetContactDetails",
            type: 'POST',
            data: JSON.stringify({ 'ContactId': ids[0] }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function GetContactdata(response) {

                if (response != null) {

                    var tdSubContent = "", tdHideContent = "";
                    $("#ui_btnViewMore" + ids[1]).hide();
                    tdSubContent += "<div id=subdata_" + ids[1] + " class=subdata_" + ids[1] + ">";
                    if (response.AlternateEmailIds != null && response.AlternateEmailIds != "") {
                        tdSubContent += "<div><span class='contactData'>Alternate Email Id(s): </span>" + response.AlternateEmailIds + "</div>";
                    }
                    if (response.AlternatePhoneNumbers != null && response.AlternatePhoneNumbers != "") {
                        tdSubContent += "<div><span class='contactData'>Alternate Phonenumber(s): </span>" + response.AlternatePhoneNumbers + "</div>";
                    }
                    if (response.Age != null && response.Age != "") {
                        tdSubContent += "<div><span class='contactData'>Age: </span>" + response.Age + "</div>";
                    }
                    if (response.Gender != null && response.Gender != "") {
                        tdSubContent += "<div><span class='contactData'>Gender: </span>" + response.Gender + "</div>";
                    }
                    if (response.MaritalStatus != null) {
                        tdSubContent += "<div><span class='contactData'>MaritalStatus: </span>" + response.MaritalStatus + "</div>";
                    }
                    if (response.Education != null) {
                        tdSubContent += "<div><span class='contactData'>Education: </span>" + response.Education + "</div>";
                    }
                    if (response.Occupation != null) {
                        tdSubContent += "<div><span class='contactData'>Occupation: </span>" + response.Occupation + "</div>";
                    }
                    if (response.Interests != null) {
                        tdSubContent += "<div><span class='contactData'>Interests: </span>" + response.Interests + "</div>";
                    }
                    if (response.Location != null && response.Location != "") {
                        tdSubContent += "<div><span class='contactData'>Location: </span>" + response.Location + "</div>";
                    }
                    if (response.RecentOnlineVisit != null) {
                        tdSubContent += "<div><span class='contactData'>RecentOnlineVisit: </span>" + response.RecentOnlineVisit + "</div>";
                    }
                    if (response.OverAllTimeSpentInChatInSec != 0) {
                        tdSubContent += "<div><span class='contactData'>OverAllTimeSpentInChatInSec: </span>" + response.OverAllTimeSpentInChatInSec + "</div>";
                    }
                    if (response.NoOfSession != 0) {
                        tdSubContent += "<div><span class='contactData'>NoOfSession: </span>" + response.NoOfSession + "</div>";
                    }
                    if (response.PastChatCount != 0) {
                        tdSubContent += "<div><span class='contactData'>PastChatCount: </span>" + response.PastChatCount + "</div>";
                    }

                    if (response.TotalChatCountSessionWise != 0) {
                        tdSubContent += "<div><span class='contactData'>TotalChatCountSessionWise: </span>" + response.TotalChatCountSessionWise + "</div>";
                    }
                    if (response.ReferralSourceList != null) {
                        tdSubContent += "<div><span class='contactData'>ReferralSourceList: </span>" + response.ReferralSourceList + "</div>";
                    }
                    if (response.NumOfPageVisited != 0) {
                        tdSubContent += "<div><span class='contactData'>NumOfPageVisited: </span>" + response.NumOfPageVisited + "</div>";
                    }
                    if (response.OverAllScore != 0) {
                        tdSubContent += "<div><span class='contactData'>OverAllScore: </span>" + response.OverAllScore + "</div>";
                    }

                    if (CustomFields.length > 0) {
                        for (var i = 0; i < CustomFields.length; i++) {
                            if (response["CustomField" + (i + 1)] != null) {

                                tdSubContent += "<div><span class='contactData'>" + CustomFields[i] + ":</span><span>" + response["CustomField" + (i + 1)] + "</span></div>";

                            }
                        }
                    }
                    if ((response.Age == null || response.Age == "") && (response.Gender == null || response.Gender == "") && (response.Location == null || response.Location == "") && response.MaritalStatus == null && response.Education == null && response.Occupation == null && response.Interests == null && response.RecentOnlineVisit == null && response.OverAllTimeSpentInChatInSec == 0 && response.NoOfSession == 0 && response.PastChatCount == 0 && response.TotalChatCountSessionWise == 0 && response.ReferralSourceList == null && response.NumOfPageVisited == 0 && response.OverAllScore == 0) {
                        ShowErrorMessage("No other details for this user");
                        return false;
                    }
                    else {
                        tdSubContent += "<div><a href='javascript:void(0);' id=" + id + " onclick=GetViewLessDetails(this.id);><input type='button' class='inputee ContributePermission' style='padding-top: 3px;padding-right: 10px;cursor:pointer;' value='View Less' id=ui_btnViewLess" + id + "></a></div>";
                        tdSubContent += "</div>";
                        $("#ui_btnViewMore" + ids[0]).hide();
                    }

                    $("#" + response.ContactId).append(tdSubContent);
                }
            },
            error: ShowAjaxError
        });
    }
    else {
        $(".subdata_" + ids[1]).show();
        $("#ui_btnViewMore" + ids[0]).hide();
    }
}
function GetExtraFiels() {
    $.ajax({
        url: "/Chat/ChatRoom/GetContactExtraField",
        type: 'Post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            $.each(response, function () {
                CustomFields.push($(this)[0].FieldName);
            });
        },
        error: ShowAjaxError
    });
}
function ShowUserEvents(UserId) {
    $("#dvLoading").show();

    $.ajax({
        url: "/Chat/ChatRoom/GetPastEvent",
        type: 'POST',
        data: JSON.stringify({ 'ChatUserId': UserId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null) {
                BindUserEvents(response.EventData);
            }
        },
        error: ShowAjaxError
    });
}
function BindUserEvents(response) {
    $("#ui_divEventData").html('There is no data for this view.');

    var bannerEvent = response;
    if (bannerEvent != undefined && bannerEvent.length > 0) {
        bannerEvent.sort(function (a, b) {
            var key1 = b.CreatedDate;
            var key2 = a.CreatedDate;

            if (key1 < key2) {
                return -1;
            } else if (key1 == key2) {
                return 0;
            } else {
                return 1;
            }
        });
        $("#ui_divEventData").empty();
        for (var i = 0; i < bannerEvent.length; i++) {

            var datevalues = $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(bannerEvent[i].CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(bannerEvent[i].CreatedDate));
            if (bannerEvent[i].ActionType == 1) {

                var extension = bannerEvent[i].BannerContent.split('.').pop().split(/\#|\?/)[0].toLowerCase();
                var fileName = bannerEvent[i].BannerContent.substring(bannerEvent[i].BannerContent.lastIndexOf('/') + 1, bannerEvent[i].BannerContent.length);
                if (fileName.indexOf("?") > -1)
                    fileName = fileName.substring(0, fileName.indexOf("?"));

                if (extension == 'pdf' || extension == 'doc' || extension == 'docx' || extension == 'xls' || extension == 'xlsx' || extension == 'pptx' || extension == 'ppt' || extension == 'csv' || extension == 'txt') {
                    content = "<div><img src='/images/ico_transcript.gif' alt='Attachment' /><label style='position: relative;bottom: 10px;'> [ " + fileName + " ] visitor downloaded</label> <span class='chatmesgDate'>" + datevalues + "</span></div>";
                }
                else {
                    content = "<div><img class='eventBannerImg' src='" + bannerEvent[i].BannerContent + "' /'> Clicked on this banner <span class='chatmesgDate'>" + datevalues + "</span></div>";
                }
            }
            else if (bannerEvent[i].ActionType == -1) {
                content = "<div><img class='eventBannerImg' src='" + bannerEvent[i].BannerContent + " /'> Closed this banner <span class='chatmesgDate'>" + datevalues + "</span></div>";
            }
            else {
                var extension = bannerEvent[i].BannerContent.split('.').pop().split(/\#|\?/)[0].toLowerCase();
                var fileName = bannerEvent[i].BannerContent.substring(bannerEvent[i].BannerContent.lastIndexOf('/') + 1, bannerEvent[i].BannerContent.length);
                if (fileName.indexOf("?") > -1)
                    fileName = fileName.substring(0, fileName.indexOf("?"));

                if (bannerEvent[i].BannerContent.toLowerCase().indexOf("youtube.com") > 0) {
                    content = "<div><img class='eventBannerImg' src='/images/YouTubeimages.jpg' /'> Sent to Visitor <span class='chatmesgDate'>" + datevalues + "</span></div>";
                }
                else if (extension == 'pdf' || extension == 'doc' || extension == 'docx' || extension == 'xls' || extension == 'xlsx' || extension == 'pptx' || extension == 'ppt' || extension == 'csv' || extension == 'txt') {
                    content = "<div><img src='/images/ico_transcript.gif' alt='Attachment' /> <label style='position: relative;bottom: 10px;'>[ " + fileName + " ] Sent to visitor</label> <span class='chatmesgDate'>" + datevalues + "</span></div>";
                }
                else {
                    content = "<div><img class='eventBannerImg' src='" + bannerEvent[i].BannerContent + "' /'> Sent to Visitor <span class='chatmesgDate'>" + datevalues + "</span></div>";
                }
            }
            $("#ui_divEventData").append(content);
        }
    }
    $(".bgShadedDiv").show();
    $("#ui_divEventPopUp").show();
    $("#dvLoading").hide();
}
function GetViewLessDetails(id) {
    var ids = id.split(",");
    $(".subdata_" + ids[1]).hide();
    $("#ui_btnViewMore" + ids[0]).show();
}