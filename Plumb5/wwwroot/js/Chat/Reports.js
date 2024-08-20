var chatResponse = { ChatId: 0, IpAddress: "", SearchContent: "", MinChatRepeatTime: -1, MaxChatRepeatTime: -1 };
var ChatInfo = { ChatId: 0, UserId: 0, PrimaryEmail: "", PrimaryContactNumber: "", EmailId: "", ContactNumber: "", City: "" };
var groupContacts = { Name: "", GroupDescription: "", GroupType: 1 };
var ChatContactIdList = [];

/**Banned */
var SearchFilter = { email: "", phone: "", ip: "" };

var chatReportUtil = {
    /* chat visitor*/
    ChatMaxCount: function () {
        if ($("#allvisitors").hasClass("active")) {
            ExportFunctionName = "Export";
            $(".frmresfunnwrp").removeClass("hideDiv");
            chatReportUtil.VisitorMaxCount();
        } else { //Banned
            $(".frmresfunnwrp").addClass("hideDiv");
            ExportFunctionName = "ExportBanned";
            ClearCustomReportFields();
            chatReportUtil.BannedMaxCount();
        }
    },
    VisitorMaxCount: function () {
        $.ajax({
            url: "/Chat/Responses/GetCountOfSelecCamp",
            type: 'Post',
            data: JSON.stringify({ 'ChatId': chatResponse.ChatId, 'IpAddress': chatResponse.IpAddress, 'SearchContent': chatResponse.SearchContent, 'MinChatRepeatTime': chatResponse.MinChatRepeatTime, 'MaxChatRepeatTime': chatResponse.MaxChatRepeatTime, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (ChatReportCount) {
                TotalRowCount = 0;
                if (ChatReportCount != undefined && ChatReportCount != null && ChatReportCount > 0) {
                    TotalRowCount = ChatReportCount;
                }

                if (TotalRowCount > 0) {
                    chatReportUtil.GetChatReport();
                }
                else {
                    ShowExportDiv(false);
                    ShowPagingDiv(false);
                    SetNoRecordContent('ui_tableReport', 6, 'ui_trbodyReportData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetChatReport: function () {
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/Chat/Responses/AllChat",
            type: 'Post',
            data: JSON.stringify({ 'ChatId': chatResponse.ChatId, 'IpAddress': chatResponse.IpAddress, 'SearchContent': chatResponse.SearchContent, 'MinChatRepeatTime': chatResponse.MinChatRepeatTime, 'MaxChatRepeatTime': chatResponse.MaxChatRepeatTime, 'OffSet': OffSet, 'FetchNext': FetchNext, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: chatReportUtil.BindChatReport,
            error: ShowAjaxError
        });
    },
    BindChatReport: function (response) {
        SetNoRecordContent('ui_tableReport', 6, 'ui_trbodyReportData');
        if (response != undefined && response != null && response.length > 0) {
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            $("#ui_trbodyReportData").html('');
            $("#ui_tableReport").removeClass('no-data-records');
            ShowExportDiv(true);
            ShowPagingDiv(true);

            $.each(response, function (i) {
                chatReportUtil.BindEachChatReport(this, i);
            });
        } else {
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
        CheckAccessPermission("Chat");
    },
    BindEachChatReport: function (ChatReport, Index) {

        let ChatUserTime = ChatReport.ChatUserTime != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(ChatReport.ChatUserTime)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(ChatReport.ChatUserTime)) : "NA";
        let htmlContent = `
                            <tr>
                                <td>
                                    <div class="custom-control custom-checkbox">
                                        <input  type="checkbox"
                                                class="custom-control-input selChkChat"
                                                id="ui_vi_${Index}" name="example1" value="${ChatReport.ContactId}">
                                        <label class="custom-control-label"
                                                for="ui_vi_${Index}"></label>
                                    </div>
                                </td>
                                <td class="frmresucp">
                                    <i class="fa fa-address-card-o" onclick=ShowContactUCP("${ChatReport.UserId}","",${ChatReport.ContactId})></i>
                                </td>
                                <td>
                                    <div class="groupnamewrap">
                                        <div class="nameTxtWrap">
                                            ${ChatReport.Name != null ? ChatReport.Name : "NA"}                                            
                                        </div>
                                        <div class="tdcreatedraft">
                                            <div class="dropdown">
                                                <button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>
                                                <div class="dropdown-menu dropdown-menu-right"
                                                        aria-labelledby="filterbycontacts">
                                                    <a data-chatpop="chattransdet" id="ui_ChatDetails"
                                                        class="dropdown-item chatrepvist"
                                                        href="javascript:void(0)" userid="${ChatReport.UserId}" chatid="${ChatReport.ChatId}" alternateemailids="${ChatReport.AlternateEmailIds}" alternatephonenumbers="${ChatReport.AlternatePhoneNumbers}" emailid="${ChatReport.EmailId}" contactnumber="${ChatReport.ContactNumber}" city="${ChatReport.City.replace(/^"(.*)"$/, '$1')}"> 
                                                        View
                                                        Details
                                                    </a>
                                                    <div class="dropdown-divider"></div>                                                    
                                                    <a data-toggle="modal" id="ui_MailTranscript"
                                                        data-target="#mailtranscript"
                                                        data-grouptype="groupDelete"
                                                        class="dropdown-item ContributePermission"
                                                        href="javascript:void(0)" UserId="${ChatReport.UserId}" ChatId="${ChatReport.ChatId}">
                                                        Mail
                                                        Transcript
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="text-color-blue">${ChatReport.IpAddress != null ? ChatReport.IpAddress : "NA"}</td>
                                <td>${ChatUserTime}</td>
                                <td>
                                    <span class="groupNameTxt">${ChatReport.City != null && ChatReport.City != "" ? ChatReport.City : "NA"}</span>
                                    <span class="templatenametxt">${ChatReport.Country != null && ChatReport.Country != "" ? ChatReport.Country : "NA"}</span>
                                </td>
                            </tr>
                          `;

        $("#ui_trbodyReportData").append(htmlContent);
    },
    ChatAdvancedFilter: function () {
        if ($("#ddlChatRepeatTime").val().length <= 1 && CleanText($("#txtIpAddress").val()).length == 0 && CleanText($("#txtSearchContent").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.ChatResponses.FilterNotFound);
            return false;
        }

        if ($("#ddlChatRepeatTime").val().length > 1) {
            chatResponse.MinChatRepeatTime = -1;
            chatResponse.MaxChatRepeatTime = -1;
            var selectedval = $("#ddlChatRepeatTime").val();
            if (selectedval == ">50") {
                chatResponse.MinChatRepeatTime = 51;
            }
            else if (selectedval.includes("-", 0)) {
                chatResponse.MinChatRepeatTime = selectedval.split("-")[0];
                chatResponse.MaxChatRepeatTime = selectedval.split("-")[1];
            }
        }
        if (CleanText($("#txtIpAddress").val()).length > 0)
            chatResponse.IpAddress = $("#txtIpAddress").val();
        if (CleanText($("#txtSearchContent").val()).length > 0)
            chatResponse.SearchContent = $("#txtSearchContent").val();

        ShowPageLoading();
        chatReportUtil.ChatMaxCount();
        $("#ui_filter_Dropdown").removeClass("show");
        $("#ui_clear_CustomReport").removeClass("hideDiv");
    },
    ClearFilter: function () {
        chatResponse.IpAddress = "";
        chatResponse.SearchContent = "";
        chatResponse.MinChatRepeatTime = -1;
        chatResponse.MaxChatRepeatTime = -1;
        ChatContactIdList = [];
        $(".selChkChat,.selChkChatBanned").prop("checked", false);
        $("#contacts_check,#contactsbanned_check").prop("checked", false);
        $(".subdivWrap").removeClass("showDiv");
        $("#ui_ddlGroup").val("Add to Group").change();
    },
    BindGroups: function () {
        $.ajax({
            url: "/ManageContact/Group/GetGroupsByStaticOrDynamic",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, GroupType: 1 }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.GroupDetails != null) {
                    $.each(response.GroupDetails, function () {
                        $("#ui_ddlGroup").append("<option value=" + $(this)[0].Id + ">" + $(this)[0].Name + "</option>");
                    });
                }
            },
            error: ShowAjaxError
        });
    },
    AddToGroup: function () {
        if ($("#ui_ddlGroup").get(0).selectedIndex == 0) {
            ShowErrorMessage(GlobalErrorList.ChatResponses.SelectGroup);
            return false;
        }
        ChatContactIdList = chatReportUtil.GetSelectedIds();

        if (ChatContactIdList.length == 0) {
            ShowErrorMessage(GlobalErrorList.ChatResponses.SelectContacts);
            return;
        }
        ShowPageLoading();
        let GroupId = $("#ui_ddlGroup").val();

        $.ajax({
            url: "/Chat/Responses/AddToGroup",
            type: 'POST',
            data: JSON.stringify({ 'contact': ChatContactIdList, 'Groups': GroupId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response>0) {
                    ShowSuccessMessage(GlobalErrorList.ChatResponses.addedtogroup);
                    ChatContactIdList = [];
                    chatReportUtil.ClearFilter();
                }
                else {
                    ShowErrorMessage(GlobalErrorList.ChatResponses.error);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    GetSelectedIds: function () {
        if (ChatContactIdList.length == 0) {
            if ($("#allvisitors").hasClass("active")) {
                $(".selChkChat:checked").each(function () {
                    ChatContactIdList.push(parseInt($(this).val()));
                });
            } else {
                $(".selChkChatBanned:checked").each(function () {
                    ChatContactIdList.push(parseInt($(this).val()));
                });
            }
        }
        return ChatContactIdList;
    },
    SendTranscriptMail: function (ChatInfo) {
        if ($.trim($("#txtSendEmailId").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.ChatResponses.EnterEmail);
            return false;
        }
        if (!regExpEmail.test($.trim($("#txtSendEmailId").val()))) {
            ShowErrorMessage(GlobalErrorList.ChatResponses.EnterCorrectEmail);
            return false;
        }

        if ($.trim($("#txtSendEmailId").val()).length > 0) {
            ShowPageLoading();
            $.ajax({
                url: "/Chat/ChatRoom/SendTranscriptMail",
                type: 'POST',
                data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'chatId': ChatInfo.ChatId, 'userId': ChatInfo.UserId, 'emailId': $.trim($("#txtSendEmailId").val()) }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (responce) {
                    $("#txtSendEmailId").val("");
                    if (responce != null && responce.Result) {
                        ShowSuccessMessage(GlobalErrorList.ChatResponses.MailSent);
                    } else {
                        ShowErrorMessage(responce.ErrorMessage);
                    }
                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        }
    },
    BindContactAndTranscript: function (ChatInfo) {
        ShowPageLoading();
        $("#ui_PrimaryEmail").html(ChatInfo.PrimaryEmail);
        $("#ui_PrimaryPhoneNumber").html(ChatInfo.PrimaryContactNumber);
        $("#ui_SecondaryEmail").html(ChatInfo.EmailId);
        $("#ui_SecondaryPhoneNumber").html(ChatInfo.ContactNumber);
        $("#ui_ChatCity").html(ChatInfo.City);

        $.ajax({
            url: "/Chat/ChatRoom/GetChatTranscript",
            type: 'POST',
            data: JSON.stringify({ 'chatId': ChatInfo.ChatId, 'userId': ChatInfo.UserId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (responce) {
                $("#ui_chattextdetailstransscript").empty();
                if (responce != null && responce.dates != null && responce.chatTranscript != null) {
                    let dates = responce.dates;
                    let transcript = responce.chatTranscript;
                    let chatArray = [];
                    for (let i = 0; i < dates.length; i++) {
                        chatArray.length = 0;
                        for (let j = 0; j < transcript.length; j++) {
                            if (transcript[j].ChatDateString == dates[i].ChatDate) {
                                chatArray.push(transcript[j]);
                            }
                        }
                        chatReportUtil.BindChatTranscript(chatArray);
                    }
                } else {
                    $("#ui_chattextdetailstransscript").append(`<div class="no-data">There is no data for this view.</div>`);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    BindChatTranscript: function (chatArray) {
        let textChat = ``;
        $.each(chatArray, function () {
            if ($(this)[0].IsAdmin == 1) {
                textChat += `
                            <div class="media mb-4">
                                <div class="agentimgwrp" title="chat agent"></div>
                                <div class="media-body">
                                    <div class="msgagent">
                                        <p>${$(this)[0].ChatText}</p>
                                    </div>                                    
                                </div>
                            </div>
                          `;
            } else {
                textChat += `
                         <div class="media mb-4">
                                <div class="media-body reverse">
                                    <div class="msgagent">
                                        <p>
                                            ${$(this)[0].ChatText}
                                        </p>
                                    </div>                                        
                                </div>
                             <div class="chatuserimgwrp" title="visitor"></div>
                        </div>
                       `;
            }
        });

        let mailContent = `<div class="chatmediawrp p-3">
                                 ${textChat}   
                                <div class="chatdatewrp text-center">
                                    <p class="chatdate">${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(chatArray[0].ChatDate))}</p>
                                </div>
                           </div>
                          `;

        $("#ui_chattextdetailstransscript").append(mailContent);
    },
    SendMailToVisitor: function () {
        if (CleanText($.trim($("#ui_ToEmailId").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.ChatResponses.EnterToEmailId);
            return false;
        }

        if (!regExpEmail.test($.trim($("#ui_ToEmailId").val()))) {
            ShowErrorMessage(GlobalErrorList.ChatResponses.EnterToEmailId);
            return false;
        }

        if (CleanText($.trim($("#ui_FromEmailId").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.ChatResponses.EnterFromEmailId);
            return false;
        }

        if (!regExpEmail.test($.trim($("#ui_FromEmailId").val()))) {
            ShowErrorMessage(GlobalErrorList.ChatResponses.EnterFromEmailId);
            return false;
        }

        if (CleanText($.trim($("#ui_Subject").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.ChatResponses.EnterSubject);
            return false;
        }

        if (CleanText($.trim($("#ui_MailBody").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.ChatResponses.EnterMailBody);
            return false;
        }

        ShowPageLoading();
        $.ajax({
            url: "/Chat/ChatRoom/SendTranscriptMail",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'ToEmailId': CleanText($.trim($("#ui_ToEmailId").val())), "FromEmailId": CleanText($.trim($("#ui_FromEmailId").val())), "Subject": CleanText($.trim($("#ui_Subject").val())), "MailBody": CleanText($.trim($("#ui_MailBody").val())) }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (responce) {
                $("#txtSendEmailId").val("");
                if (responce != null && responce.Result) {
                    ShowSuccessMessage(GlobalErrorList.ChatResponses.MailSent);
                } else {
                    ShowErrorMessage(responce.ErrorMessage);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    /* End chat visitor*/

    /**Banned Details */
    BannedMaxCount: function () {
        $.ajax({
            url: "/Chat/Responses/GetBanVisitorCount",
            type: 'POST',
            data: JSON.stringify({ 'ChatId': chatResponse.ChatId, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'email': SearchFilter.email, 'phone': SearchFilter.phone, 'ip': SearchFilter.ip }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (BannedCount) {
                TotalRowCount = 0;
                if (BannedCount != undefined && BannedCount != null && BannedCount > 0) {
                    TotalRowCount = BannedCount;
                }

                if (TotalRowCount > 0) {
                    chatReportUtil.GetBindBannedChatReport();
                }
                else {
                    ShowExportDiv(false);
                    ShowPagingDiv(false);
                    SetNoRecordContent('ui_tableReportBanned', 6, 'ui_trbodyReportDatabanned');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },
    GetBindBannedChatReport: function () {
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/Chat/Responses/GetBanVisitor",
            type: 'POST',
            data: JSON.stringify({ 'ChatId': chatResponse.ChatId, 'OffSet': OffSet, 'FetchNext': FetchNext, 'FromDateTime': FromDateTime, 'ToDateTime': ToDateTime, 'email': SearchFilter.email, 'phone': SearchFilter.phone, 'ip': SearchFilter.ip }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: chatReportUtil.BindBannedChatReport,
            error: ShowAjaxError
        });
    },
    BindBannedChatReport: function (response) {
        SetNoRecordContent('ui_tableReportBanned', 6, 'ui_trbodyReportDatabanned');
        if (response != undefined && response != null && response.length > 0) {
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
            $("#ui_trbodyReportDatabanned").html('');
            $("#ui_tableReportBanned").removeClass('no-data-records');
            ShowExportDiv(true);
            ShowPagingDiv(true);

            $.each(response, function (i) {
                chatReportUtil.BindBannedEachChatReport(this, i);
            });
        } else {
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
        CheckAccessPermission("Chat");
    },
    BindBannedEachChatReport: function (BannedReport, Index) {
        let BannedUpdateDate = BannedReport.UpdateDate != null ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(BannedReport.UpdateDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(BannedReport.UpdateDate)) : "NA";
        let htmlContent = `
                            <tr>
                                <td>
                                    <div class="custom-control custom-checkbox">
                                        <input  type="checkbox"
                                                class="custom-control-input selChkChatBanned"
                                                id="ui_ban_${Index}" name="example1" value="${BannedReport.ContactId}">
                                        <label class="custom-control-label"
                                                for="ui_ban_${Index}"></label>
                                    </div>
                                </td>
                                <td class="frmresucp">
                                    <i class="fa fa-address-card-o" onclick=ShowContactUCP("","",${BannedReport.ContactId})></i>
                                </td>
                                <td>
                                    <div class="groupnamewrap">
                                        <div class="nameTxtWrap">
                                            ${BannedReport.Name != null ? BannedReport.Name : "NA"}                                            
                                        </div>
                                        <div class="tdcreatedraft">
                                            <div class="dropdown">
                                                <button type="button" class="verticnwrp" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-android-more-vertical mr-0"></i></button>
                                                <div class="dropdown-menu dropdown-menu-right"
                                                        aria-labelledby="filterbycontacts">
                                                    <a data-chatpop="chattransdet" id="ui_ChatDetails"
                                                        class="dropdown-item chatrepvist"
                                                        href="javascript:void(0)" userid="${BannedReport.Id}" chatid="${BannedReport.ChatId}" alternateemailids="${BannedReport.AlternateEmailIds}" alternatephonenumbers="${BannedReport.AlternatePhoneNumbers}" emailid="${BannedReport.EmailId}" contactnumber="${BannedReport.ContactNumber}" city="${BannedReport.City}">
                                                        View
                                                        Details
                                                    </a>
                                                    <div class="dropdown-divider"></div>                                                    
                                                    <a data-toggle="modal" id="ui_MailTranscript"
                                                        data-target="#mailtranscript"
                                                        data-grouptype="groupDelete"
                                                        class="dropdown-item ContributePermission"
                                                        href="javascript:void(0)" UserId="${BannedReport.Id}" ChatId="${BannedReport.ChatId}">
                                                        Mail
                                                        Transcript
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="text-color-blue">${BannedReport.IpAddress != null ? BannedReport.IpAddress : "NA"}</td>
                                <td>${BannedUpdateDate}</td>
                                <td>
                                    <span class="groupNameTxt">${BannedReport.City != null && BannedReport.City !== "" ? BannedReport.City : "NA"}</span>
                                    <span class="templatenametxt">${BannedReport.Country != null && BannedReport.Country != "" ? BannedReport.Country : "NA"}</span>
                                </td>
                            </tr>
                          `;

        $("#ui_trbodyReportDatabanned").append(htmlContent);
    }
};

$(document).ready(() => {
    chatResponse.ChatId = $.urlParam("ChatId");
    $("#ui_span_ChatName").html('');
    var ChatName = decodeURIComponent(urlParam("ChatName"));
    if (ChatName != undefined && ChatName != null && ChatName != "0" && ChatName.length > 0) {
        $("#ui_span_ChatName").html(ChatName);
    }
    ExportFunctionName = "Export";
    chatReportUtil.BindGroups();
    GetUTCDateTimeRange(2);
});

$("#ui_txtSearchFilter").click(function () {
    chatReportUtil.ChatAdvancedFilter();
});

function CallBackFunction() {
    ShowPageLoading();
    chatReportUtil.ClearFilter();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    chatReportUtil.ChatMaxCount();
}

function CallBackPaging() {
    ShowPageLoading();
    CurrentRowCount = 0;

    if ($("#allvisitors").hasClass("active")) {
        chatReportUtil.GetChatReport();
    } else {
        chatReportUtil.GetBindBannedChatReport();
    }
}

$("body").click(function () {
    $(".selproviderwrap").removeClass("showDiv");
    let chkhiddiv = $(".frmresfunnwrp .ion-ios-close").hasClass("hideDiv");
    let chkdrpshw = $(".frmresfunnwrp.dropdown").hasClass("show");
    let checkdrpdwnshow = $(".filterWrap").hasClass("show");
    if (chkhiddiv == true || chkdrpshw == true || checkdrpdwnshow == true) {
        $(".frmresfunnwrp .ion-ios-close").addClass("hideDiv");
        $(".icnclsedrp").addClass("hideDiv");
    }
});

$("#contacts_check,#contactsbanned_check").click(function () {

    if ($("#allvisitors").hasClass("active")) {
        if ($(this).is(":checked")) {
            $(".selChkChat").prop("checked", true);
        } else {
            $(".selChkChat").prop("checked", false);
        }
    } else {
        if ($(this).is(":checked")) {
            $(".selChkChatBanned").prop("checked", true);
        } else {
            $(".selChkChatBanned").prop("checked", false);
        }
        ShowAddToGroup();
    }
});

var checkBoxClickCount = 0;
$(document).on('click', '.selChkChat,.selChkChatBanned', function () {

    if ($("#allvisitors").hasClass("active")) {
        checkBoxClickCount = $(".selChkChat").filter(":checked").length;
        //if (checkBoxClickCount == 0) {
        //    $("#contacts_check").prop("checked", false);
        //} else {
        //    $("#contacts_check").prop("checked", true);
        //}
    } else {
        checkBoxClickCount = $(".selChkChatBanned").filter(":checked").length;
        //if (checkBoxClickCount == 0) {
        //    $("#contactsbanned_check").prop("checked", false);
        //} else {
        //    $("#contactsbanned_check").prop("checked", true);
        //}
    }

    if (checkBoxClickCount > 0) {
        $(".subdivWrap").addClass("showDiv");
    } else {
        $(".subdivWrap").removeClass("showDiv");
    }
    $(".checkedCount").html(checkBoxClickCount);
});

function ShowAddToGroup() {
    if ($("#allvisitors").hasClass("active")) {
        checkBoxClickCount = $(".selChkChat").filter(":checked").length;
        //if (checkBoxClickCount == 0) {
        //    $("#contacts_check").prop("checked", false);
        //} else {
        //    $("#contacts_check").prop("checked", true);
        //}
    } else {
        checkBoxClickCount = $(".selChkChatBanned").filter(":checked").length;
        //if (checkBoxClickCount == 0) {
        //    $("#contactsbanned_check").prop("checked", false);
        //} else {
        //    $("#contactsbanned_check").prop("checked", true);
        //}
    }

    if (checkBoxClickCount > 0) {
        $(".subdivWrap").addClass("showDiv");
    } else {
        $(".subdivWrap").removeClass("showDiv");
    }
    $(".checkedCount").html(checkBoxClickCount);
}

$("#contacts_check").click(function () {
    checkBoxClickCount = $(".selChkChat").filter(":checked").length;
    if (checkBoxClickCount > 0) {
        $(".subdivWrap").addClass("showDiv");
    } else {
        $(".subdivWrap").removeClass("showDiv");
    }
    $(".checkedCount").html(checkBoxClickCount);
});


$(".addCampName").select2({
    minimumResultsForSearch: "",
    dropdownAutoWidth: false,
});

$(document).on("click", "#ui_MailTranscript", function () {
    ChatInfo.UserId = $(this).attr("UserId");
    ChatInfo.ChatId = $(this).attr("ChatId");
});

$("#ui_SendTranscriptMail").click(function () {
    chatReportUtil.SendTranscriptMail(ChatInfo);
});

$(document).on('click', '.dropdown-item.chatrepvist', function () {
    let checkchattabid = $(this).attr("data-chatpop");
    if (checkchattabid == "chatsendmailvis") {
        let EmailId = $("#ui_MailToVisitor").attr("emailid");
        if (EmailId != null && EmailId != "null") {
            $("#dv_responsedetails").removeClass("hideDiv");
            $("#chatsendmailvis, #chattransdet").addClass("hideDiv");
            $("#ui_ToEmailId").val(EmailId).attr("placeholder", EmailId);
            $(".popuptitle h6").html("Send Mail to Visitors");
            $(".popupfooter").removeClass("hideDiv");
            $("#" + checkchattabid).removeClass("hideDiv");
        } else {
            ShowErrorMessage(GlobalErrorList.ChatResponses.EmailIdNotFound);
        }

    } else {
        $("#dv_responsedetails").removeClass("hideDiv");
        $("#chatsendmailvis, #chattransdet").addClass("hideDiv");
        $(".popuptitle h6").html("Chat Details");
        $(".popupfooter").addClass("hideDiv");
        ChatInfo.ChatId = $(this).attr("chatid");
        ChatInfo.UserId = $(this).attr("userid");
        ChatInfo.PrimaryEmail = $(this).attr("emailid") != "" && $(this).attr("emailid") != "null" && $(this).attr("emailid") != null ? $(this).attr("emailid") : "NA";
        ChatInfo.PrimaryContactNumber = $(this).attr("contactnumber") != "" && $(this).attr("contactnumber") != "null" && $(this).attr("contactnumber") != null ? $(this).attr("contactnumber") : "NA";
        ChatInfo.EmailId = $(this).attr("alternateemailids") != "" && $(this).attr("alternateemailids") != "null" && $(this).attr("alternateemailids") != null ? $(this).attr("alternateemailids") : "NA";
        ChatInfo.ContactNumber = $(this).attr("alternatephonenumbers") != "" && $(this).attr("alternatephonenumbers") != "null" && $(this).attr("alternatephonenumbers") != null ? $(this).attr("alternatephonenumbers") : "NA";
        ChatInfo.City = $(this).attr("city") != "" && $(this).attr("city") != "null" && $(this).attr("city") != null ? $(this).attr("city") : "NA";

        $("#" + checkchattabid).removeClass("hideDiv");
        chatReportUtil.BindContactAndTranscript(ChatInfo);

    }
});

$("#close-popup, .clsepopup").click(function () {
    $(this).parents("#dv_responsedetails").addClass("hideDiv");
});


$("#ui_SendMail").click(function () {
    chatReportUtil.SendMailToVisitor();
});

$("#ui_ddlGroup").change(function () {
    let addChatGroupNameList = $("#ui_ddlGroup option:selected").text();
    if (addChatGroupNameList == "Add to Group") {
        event.preventDefault();
    } else {
        $(".visitorsCount").html(checkBoxClickCount);
        $(".addgroupname").html(addChatGroupNameList);
        $("#confirmDialog").modal("show");
    }
});

$("#addtoGroupdis").click(function () {
    chatReportUtil.AddToGroup();
});

$(".chatrepsubmenu").click(function () {
    let checktbltabid = $(this).attr("id");
    $(".chatrepsubmenu").removeClass("active");
    $(".tbl-frmrepresp").addClass("hideDiv");
    $(this).addClass("active");
    $("." + checktbltabid).removeClass("hideDiv");
    chatReportUtil.ClearFilter();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    OffSet = 0;
    ShowPageLoading();
    chatReportUtil.ChatMaxCount();
});

//clear custom Report

$("#ui_clear_CustomReport").click(function () {
    ClearCustomReportFields();
    CallBackFunction();
});

function ClearCustomReportFields() {
    $("#ddlChatRepeatTime").val("0").change();
    $('#txtIpAddress,#txtSearchContent').val('');
    $("#ui_clear_CustomReport").addClass("hideDiv");
}

$(document).on('change', '#ui_trbodyReportData input[type=checkbox]', function () {
    if (!this.checked)
        $("#contacts_check").prop("checked", false);
});
$(document).on('change', '#ui_trbodyReportDatabanned input[type=checkbox]', function () {
    if (!this.checked)
        $("#contactsbanned_check").prop("checked", false);
});

