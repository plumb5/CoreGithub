var historyDetails = { ContactId: 0, FromDate: '', ToDate: '' };
var clearTimeIntervalofHistoryDetails;
var leadhistoryDetailsLoading = { IsLeadHistoryLoading: false, IsNotesLoading: false, IsCallsLoading: false, IsEmailsLoading: false, IsSmsLoading: false };
var LeadHistoryContactId = 0;
var LeadHistory = {
    History: function (contactId, Name) {
        LeadHistoryContactId = contactId;
        $(".lftpopuptabitem").removeClass("active");
        $(".lftpopupcontitem").addClass("hideDiv");
        $("#ui_div_" + contactId).addClass("activeBgRow");
        $(".dropdown-menu").removeClass("show");
        $("#ui_lmshistory").removeClass("hideDiv");
        $("#ui_LeadName").html(Name);
        clearTimeIntervalofHistoryDetails = setInterval(IsHistoryLoadingToHide, 1000);
        $("#ui_ShowLead").addClass("active");
        $('#leadhistory').removeClass("hideDiv");
        LeadHistory.GetHistoryCustomDateAndBind('leadhistory');
        LeadHistory.LoadCalender();
    },
    GetHistoryCustomDateAndBind: function (Module) {
        ShowPageLoading();
        historyDetails.ContactId = LeadHistoryContactId;
        $.ajax({
            url: "/ManageContact/UCP/GetFromAndToDate",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': historyDetails, 'Module': Module }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.Table != null && response.Table.length > 0) {
                    let DateTime = response.Table[0];
                    if (DateTime.FromDate != null && DateTime.ToDate != null) {
                        historyDetails.FromDate = `${DateTime.FromDate.split('T')[0]} 18:30:00`;
                        historyDetails.ToDate = `${DateTime.ToDate.split('T')[0]} 18:29:59`;

                        $('#selectdateDropdownLeadHistory').html("Custom Date Range");
                        $(".dateBoxWrapLeadHistory").addClass("showFlx");
                        let HistoryFromDay = DateTime.FromDate.split('T')[0].split('-')[2];
                        let HistoryFromMonth = DateTime.FromDate.split('T')[0].split('-')[1];
                        let HistoryFromYear = DateTime.FromDate.split('T')[0].split('-')[0];
                        $("#ui_txtStartDateHistory").val(`${HistoryFromMonth}/${HistoryFromDay}/${HistoryFromYear}`);
                        let HistoryToDay = DateTime.ToDate.split('T')[0].split('-')[2];
                        let HistoryToMonth = DateTime.ToDate.split('T')[0].split('-')[1];
                        let HistoryToYear = DateTime.ToDate.split('T')[0].split('-')[0];
                        $("#ui_txtEndDateHistory").val(`${HistoryToMonth}/${HistoryToDay}/${HistoryToYear}`);

                        LeadHistory.DecideAndBindDetails(Module);
                    } else {
                        $(".dateBoxWrapLeadHistory").removeClass("showFlx");
                        $('#selectdateDropdownLeadHistory').html("This Month");
                        let Date = LeadHistory.GetUTCDateTimeRangeForHistory(3);
                        historyDetails.FromDate = Date[0];
                        historyDetails.ToDate = Date[1];
                        let Module = $(".lftpopuptabitem.active").attr("data-popuptab");
                        LeadHistory.DecideAndBindDetails(Module);
                    }
                } else {
                    let Date = LeadHistory.GetUTCDateTimeRangeForHistory(3);
                    historyDetails.FromDate = Date[0];
                    historyDetails.ToDate = Date[1];
                    let Module = $(".lftpopuptabitem.active").attr("data-popuptab");
                    LeadHistory.DecideAndBindDetails(Module);
                }
            },
            error: ShowAjaxError
        });
    },
    DecideAndBindDetails: function (Module) {
        switch (Module.toLowerCase()) {
            case "leadhistory":
                leadhistoryDetailsLoading.IsNotesLoading = true;
                leadhistoryDetailsLoading.IsCallsLoading = true;
                leadhistoryDetailsLoading.IsEmailsLoading = true;
                leadhistoryDetailsLoading.IsSmsLoading = true;
                leadhistoryDetailsLoading.IsLeadHistoryLoading = false;
                LeadHistory.BindLeadHistory();
            case "emails":
                leadhistoryDetailsLoading.IsNotesLoading = true;
                leadhistoryDetailsLoading.IsCallsLoading = true;
                leadhistoryDetailsLoading.IsSmsLoading = true;
                leadhistoryDetailsLoading.IsLeadHistoryLoading = true;
                leadhistoryDetailsLoading.IsEmailsLoading = false;
                LeadHistory.BindEmail();
                break;
            case "sms":
                leadhistoryDetailsLoading.IsNotesLoading = true;
                leadhistoryDetailsLoading.IsCallsLoading = true;
                leadhistoryDetailsLoading.IsLeadHistoryLoading = true;
                leadhistoryDetailsLoading.IsEmailsLoading = true;
                leadhistoryDetailsLoading.IsSmsLoading = false;
                LeadHistory.BindSMS();
            case "calls":
                leadhistoryDetailsLoading.IsNotesLoading = true;
                leadhistoryDetailsLoading.IsLeadHistoryLoading = true;
                leadhistoryDetailsLoading.IsEmailsLoading = true;
                leadhistoryDetailsLoading.IsSmsLoading = true;
                leadhistoryDetailsLoading.IsCallsLoading = false;
                LeadHistory.BindCalls();
                break;
            case "notes":
                leadhistoryDetailsLoading.IsLeadHistoryLoading = true;
                leadhistoryDetailsLoading.IsEmailsLoading = true;
                leadhistoryDetailsLoading.IsSmsLoading = true;
                leadhistoryDetailsLoading.IsCallsLoading = true;
                leadhistoryDetailsLoading.IsNotesLoading = false;
                LeadHistory.BindNotes();
                break;
        }
    },

    BindLeadHistory: function () {
        $.ajax({
            url: "/ManageContact/UCP/GetLmsAuditDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': historyDetails }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (lmsHistory) => {
                if (lmsHistory.Status == true) {
                    if (lmsHistory.LeadsData != undefined && lmsHistory.LeadsData != null && lmsHistory.LeadsData.length > 1) {
                        $("#ui_Leadhistorytbody").empty();
                        let dataBinded = false;
                        for (let i = 1; i < lmsHistory.LeadsData.length; i++) {
                            for (let j = 0; j < leadHistoryFields.length; j++) {
                                if (lmsHistory.LeadsData[i - 1][leadHistoryFields[j]] != lmsHistory.LeadsData[i][leadHistoryFields[j]]) {
                                    dataBinded = true;

                                    let columnName = leadHistoryFields[j];
                                    let currentValue = lmsHistory.LeadsData[i - 1][leadHistoryFields[j]] != null && lmsHistory.LeadsData[i - 1][leadHistoryFields[j]] != undefined ? lmsHistory.LeadsData[i - 1][leadHistoryFields[j]] : "NA";
                                    let oldValue = lmsHistory.LeadsData[i][leadHistoryFields[j]] != null && lmsHistory.LeadsData[i][leadHistoryFields[j]] != undefined ? lmsHistory.LeadsData[i][leadHistoryFields[j]] : "NA";
                                    let updatedDate = lmsHistory.LeadsData[i - 1].UpdatedDate != null && lmsHistory.LeadsData[i - 1].UpdatedDate != undefined ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(lmsHistory.LeadsData[i - 1].UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(lmsHistory.LeadsData[i - 1].UpdatedDate)) : "NA";

                                    if (columnName.toLowerCase() == "username")
                                        columnName = "Handled By";
                                    else if (columnName.toLowerCase() == "score") {
                                        columnName = "Stage";

                                        let oldStage = oldValue;
                                        let oldSample = JSLINQ(allStageDetails).Where(function () {
                                            return (this.Score == oldStage);
                                        });
                                        oldValue = oldSample.items[0] != undefined && oldSample.items[0].Stage.length > 0 ? oldSample.items[0].Stage : "NA";

                                        let currentStage = currentValue;
                                        let currentSample = JSLINQ(allStageDetails).Where(function () {
                                            return (this.Score == currentStage);
                                        });
                                        currentValue = currentSample.items[0] != undefined && currentSample.items[0].Stage.length > 0 ? currentSample.items[0].Stage : "NA";
                                    }
                                    else if (columnName.toLowerCase() == "lmsgroupname")
                                        columnName = "Source";
                                    else if (columnName.toLowerCase().includes("customfield")) {
                                        if (ContactExtraFieldsForUCP != undefined && ContactExtraFieldsForUCP != null && ContactExtraFieldsForUCP.length > 0) {
                                            let cutomFieldIndex = columnName.length == 12 ? columnName.substring(columnName.length - 1, columnName.length) : columnName.substring(columnName.length - 2, columnName.length);
                                            columnName = ContactExtraFieldsForUCP[cutomFieldIndex - 1];
                                        }
                                    }
                                    else if (columnName.toLowerCase() == "reminderdate") {
                                        columnName = "Reminder Date";
                                        currentValue = currentValue != "NA" ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(currentValue)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(currentValue)) : "NA";
                                        oldValue = oldValue != "NA" ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(oldValue)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(oldValue)) : "NA";
                                    }
                                    else if (columnName.toLowerCase() == "followupdate") {
                                        columnName = "Follow-Up Date";
                                        currentValue = currentValue != "NA" ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(currentValue)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(currentValue)) : "NA";
                                        oldValue = oldValue != "NA" ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(oldValue)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(oldValue)) : "NA";
                                    }

                                    const HistoryData = `<tr>
                                                            <td class="text-left">
                                                                ${columnName}
                                                            </td>
                                                            <td class="text-left"><p class="text-color-blue mb-0">${currentValue}</p></td>
                                                            <td class="text-left">${oldValue}</td>
                                                            <td class="text-left">${updatedDate}</td>
                                                        </tr>`;
                                    $("#ui_Leadhistorytbody").append(HistoryData);
                                }
                            }
                        }
                        if (!dataBinded)
                            $("#ui_Leadhistorytbody").empty().append(LeadHistory.NoDataFound(4));
                    }
                    else {
                        $("#ui_Leadhistorytbody").empty().append(LeadHistory.NoDataFound(4));
                    }
                } else {
                    $("#ui_Leadhistorytbody").empty().append(LeadHistory.NoDataFound(4));
                }

                leadhistoryDetailsLoading.IsLeadHistoryLoading = true;
            },
            error: ShowAjaxError
        });
    },
    BindNotes: function () {
        $.ajax({
            url: "/ManageContact/UCP/GetNoteList",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': historyDetails }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (NoteList) => {

                if (NoteList != undefined && NoteList != null && NoteList.length > 0) {
                    $("#ui_HistoryNotes").empty();
                    $.each(NoteList, (key, value) => {
                        let Url = `${ClientImagePath}/ClientImages/${value.Attachment}`;
                        let attachment = value.Attachment != null && value.Attachment != undefined && value.Attachment.length > 0 ? `<a href="javascript:void(0)" onclick="forceDownload('${Url}','${value.Attachment}');">${value.Attachment}</a>` : "NA";
                        const NotesData = `<tr>
                                    <td class="text-left">${value.Content}</td>
                                    <td class="text-left">${attachment}</td>
                                    <td class="text-left">${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(value.Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.Date))}</td>
                                 </tr>`
                        $("#ui_HistoryNotes").append(NotesData);
                    });
                }
                else {
                    $("#ui_HistoryNotes").empty().append(LeadHistory.NoDataFound(3));
                }

                leadhistoryDetailsLoading.IsNotesLoading = true;
            },
            error: ShowAjaxError
        });
    },
    BindEmail: function () {
        $.ajax({
            url: "/ManageContact/UCP/GetMailDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': historyDetails }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (MailList) => {

                if (MailList != undefined && MailList != null && MailList.Table != undefined && MailList.Table != null && MailList.Table.length > 0) {
                    $("#ui_historyEmails").empty();
                    $.each(MailList.Table, (key, value) => {
                        let TemplatePaths = "";
                        if (value.TemplataId > 0)
                            TemplatePaths = `https://${TemplatePath}Campaign-${Plumb5AccountId}-${value.TemplataId}/TemplateContent.html`;
                        else
                            TemplatePaths = `${OnlineUrl}Template/no-template-available.html`;

                        const MailData = `<tr>
                                            <td class="text-center temppreveye">
                                                  <i class="icon ion-ios-eye-outline position-relative">
                                                        <div class="previewtabwrp">
                                                            <div class="thumbnail-container">
                                                                 <a href="${TemplatePaths}" target="_blank">
                                                                    <div class="thumbnail">
                                                                        <iframe src="${TemplatePaths}" frameborder="0" onload="this.style.opacity = 1"></iframe>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                        </div>
                                                  </i>
                                            </td>
                                            <td class="text-left">${(value.TemplateName != undefined && value.TemplateName != null && value.TemplateName != "") ? value.TemplateName : "NA"}</td>
                                            <td class="text-left">${(value.Subject != undefined && value.Subject != null && value.Subject != "") ? value.Subject : "NA"}</td>
                                            <td class="text-right">${value.Opened}</td>
                                            <td class="text-right">${value.Clicked}</td>
                                            <td class="text-right">${value.Forward}</td>
                                            <td class="text-left">${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(value.SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.SentDate))}</td>
                                     </tr>`
                        $("#ui_historyEmails").append(MailData);
                    });
                }
                else {
                    $("#ui_historyEmails").empty().append(LeadHistory.NoDataFound(7));
                }

                leadhistoryDetailsLoading.IsEmailsLoading = true;
                LeadHistory.SetPreview();
            },
            error: ShowAjaxError
        });
    },
    SetPreview: function () {
        let checktablerowlenth = $("table.temppreveye-tbl >tbody >tr").length;
        if (checktablerowlenth <= 4) {
            $("table.temppreveye-tbl >tbody >tr").addClass("prevpopupdefault");
        } else {
            $("table.temppreveye-tbl >tbody >tr").removeClass("prevpopupdefault");
        }
    },
    BindSMS: function () {
        $.ajax({
            url: "/ManageContact/UCP/GetSmsDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': historyDetails }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (SMSList) => {

                if (SMSList != undefined && SMSList != null && SMSList.Table != undefined && SMSList.Table != null && SMSList.Table.length > 0) {
                    $("#ui_SmsHistory").empty();
                    $.each(SMSList.Table, (key, value) => {
                        const SMSData = `<tr>
                                            <td class="text-center">
                                                  <div class="smsprevwrap"><i class="icon ion-ios-eye-outline"></i>
                                                    <div class="smsprevItemwrap bubbrep">
                                                      <div class="chat">
                                                        <div class="yours messages">
                                                          <div class="message last">
                                                           ${value.MessageContent}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                            </td>
                                            <td class="text-left">${(value.TemplateName != undefined && value.TemplateName != null && value.TemplateName != "") ? value.TemplateName : "NA"}</td>
                                            <td class="text-right">${(value.PhoneNumber != undefined && value.PhoneNumber != null && value.PhoneNumber != "") ? value.PhoneNumber : "NA"}</td>
                                            <td class="text-right">${value.IsDelivered}</td>
                                            <td class="text-right">${value.IsClicked}</td>
                                            <td class="text-left">${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(value.SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.SentDate))}</td>
                                        </tr>`;
                        $("#ui_SmsHistory").append(SMSData);
                    });
                }
                else {
                    $("#ui_SmsHistory").empty().append(UCPUtil.NoDataFound(6));
                }

                leadhistoryDetailsLoading.IsSmsLoading = true;
            },
            error: ShowAjaxError
        });
    },
    BindCalls: function () {
        $.ajax({
            url: "/ManageContact/UCP/GetCallDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': historyDetails }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (CallList) => {

                if (CallList != undefined && CallList != null && CallList.Table != undefined && CallList.Table != null && CallList.Table.length > 0) {
                    $("#ui_leadCallHistory").empty();
                    $.each(CallList.Table, (key, value) => {
                        let audiofile = `<audio controls><source src="${OnlineUrl}/TempFiles/VoiceCallRecorded/${value.Called_Sid}.mp3" type="audio/mpeg">Your browser does not support the audio element.</audio>`;
                        const CallData = `<tr>
                                        <td class="text-left">${value.PhoneNumber}</td>
                                        <td>${value.CalledStatus}</td>
                                        <td>${value.TotalCallDuration != null ? fn_AverageTime(value.TotalCallDuration) : "NA"}</td>
                                        <td>${value.Pickduration != null ? fn_AverageTime(value.Pickduration) : "NA"}</td>
                                        <td class="text-left">${audiofile}</td>                                         
                                        <td>${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(value.CalledDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.CalledDate))}</td>
                                     </tr>`
                        $("#ui_leadCallHistory").append(CallData);
                    });
                }
                else {
                    $("#ui_leadCallHistory").empty().append(LeadHistory.NoDataFound(6));
                }

                leadhistoryDetailsLoading.IsCallsLoading = true;
            },
            error: ShowAjaxError
        });
    },
    NoDataFound: function (columns) {
        return `<tr><td colspan="${columns}" class="border-bottom-0"><div class="no-data ">There is no data for this view.</div></td></tr>`;
    },
    BindNoData: function (Module) {
        if (Module == "leadhistory") {
            $("#ui_Leadhistorytbody").empty().append(LeadHistory.NoDataFound(4));
        } else if (Module == "notes") {
            $("#ui_HistoryNotes").empty().append(LeadHistory.NoDataFound(3));
        } else if (Module == "calls") {
            $("#ui_leadCallHistory").empty().append(LeadHistory.NoDataFound(6));
        } else if (Module == "emails") {
            $("#ui_historyEmails").empty().append(LeadHistory.NoDataFound(7));
        } else if (Module == "sms") {
            $("#ui_SmsHistory").empty().append(LeadHistory.NoDataFound(6));
        }

        HidePageLoading();
    },
    GetUTCDateTimeRangeForHistory: function (dateDuration) {
        let fromdate, todate;

        if (dateDuration == 1) {
            fromdate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));
            todate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));
        }
        else if (dateDuration == 2) {
            fromdate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));
            todate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));

            fromdate.setDate(todate.getDate() - 6);

        }
        else if (dateDuration == 3) {
            fromdate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));
            todate = new Date(new Date().toLocaleString("en-US", { timeZone: TimeZoneData[0] }));

            fromdate.setMonth(todate.getMonth() - 1);
            fromdate.setDate(fromdate.getDate() + 1);

        }
        else if (dateDuration == 5) {
            if ($("#ui_txtStartDateHistory").val().length == 0 && $("#ui_txtEndDateUCP").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.daterange_error);
                $("#ui_txtStartDateHistory").focus();
                return false;
            }

            if ($("#ui_txtStartDateHistory").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.from_date_range_error);
                $("#ui_txtStartDateHistory").focus();
                return false;
            }

            if ($("#ui_txtEndDateHistory").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.to_date_range_error);
                $("#ui_txtEndDateHistory").focus();
                return false;
            }

            let LocalFromdate = $("#ui_txtStartDateHistory").val();
            let LocalTodate = $("#ui_txtEndDateHistory").val();

            if (UCPUtil.IsGreaterThanTodayDate(LocalFromdate)) {
                ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.from_date_Exceeded_error);
                $("#ui_txtStartDateUCP").focus();
                return false;
            }

            if (UCPUtil.IsGreaterThanTodayDate(LocalTodate)) {
                ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.to_date_Exceeded_error);
                $("#ui_txtEndDateUCP").focus();
                return false;
            }

            if (UCPUtil.isFromBiggerThanTo(LocalFromdate, LocalTodate)) {
                ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.from_date_less_then_error);
                $("#ui_txtStartDateUCP").focus();
                return false;
            }

            fromdate = new Date(LocalFromdate);
            todate = new Date(LocalTodate);
        }
        else {
            ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.selection_error);
            return false;
        }

        let FromDateTime_JsDate = fromdate;
        let ToDateTime_JsDate = todate;

        let startdate = fromdate.getFullYear() + '-' + UCPUtil.AddingPrefixZeroDayMonth((fromdate.getMonth() + 1)) + '-' + UCPUtil.AddingPrefixZeroDayMonth(fromdate.getDate()) + " 00:00:00";
        let enddate = todate.getFullYear() + '-' + UCPUtil.AddingPrefixZeroDayMonth((todate.getMonth() + 1)) + '-' + UCPUtil.AddingPrefixZeroDayMonth(todate.getDate()) + " 23:59:59";


        fromdate = ConvertDateTimeToUTC(startdate);
        fromdate = fromdate.getFullYear() + '-' + UCPUtil.AddingPrefixZeroDayMonth((fromdate.getMonth() + 1)) + '-' + UCPUtil.AddingPrefixZeroDayMonth(fromdate.getDate()) + " " + UCPUtil.AddingPrefixZeroDayMonth(fromdate.getHours()) + ":" + UCPUtil.AddingPrefixZeroDayMonth(fromdate.getMinutes()) + ":" + UCPUtil.AddingPrefixZeroDayMonth(fromdate.getSeconds());

        todate = ConvertDateTimeToUTC(enddate);
        todate = todate.getFullYear() + '-' + UCPUtil.AddingPrefixZeroDayMonth((todate.getMonth() + 1)) + '-' + UCPUtil.AddingPrefixZeroDayMonth(todate.getDate()) + " " + UCPUtil.AddingPrefixZeroDayMonth(todate.getHours()) + ":" + UCPUtil.AddingPrefixZeroDayMonth(todate.getMinutes()) + ":" + UCPUtil.AddingPrefixZeroDayMonth(todate.getSeconds());

        FromDateTime = fromdate;
        ToDateTime = todate;
        return [FromDateTime, ToDateTime];
    },
    LoadCalender: function () {
        $(".addcalend").datepicker({
            prevText: "click for previous months",
            nextText: "click for next months",
            showOtherMonths: true,
            selectOtherMonths: false,
        });
    }
};

$(".lftpopuptabitem").click(function () {
    $(".lftpopuptabitem").removeClass("active");
    $(this).addClass("active");
    let getlftpopuptabcontId = $(this).attr("data-popuptab");
    $(".lftpopupcontitem").addClass("hideDiv");
    $(`#${getlftpopuptabcontId}`).removeClass("hideDiv");
    clearTimeIntervalofHistoryDetails = setInterval(IsHistoryLoadingToHide, 1000);
    LeadHistory.GetHistoryCustomDateAndBind(getlftpopuptabcontId.toLowerCase());
});

function IsHistoryLoadingToHide() {
    if (leadhistoryDetailsLoading.IsLeadHistoryLoading && leadhistoryDetailsLoading.IsNotesLoading && leadhistoryDetailsLoading.IsCallsLoading && leadhistoryDetailsLoading.IsEmailsLoading && leadhistoryDetailsLoading.IsSmsLoading) {
        clearInterval(clearTimeIntervalofHistoryDetails);
        HidePageLoading();
    }
}

$(".datedropdownHistory > .dropdown-menuHistory a").click(function () {
    let SelectedDateDropDownHistory = $(this).text();
    $('#selectdateDropdownLeadHistory').html(SelectedDateDropDownHistory);
    $(".dateBoxWrapLeadHistory").removeClass('showFlx');

    if (SelectedDateDropDownHistory == "Today") {
        ShowPageLoading();
        let Date = LeadHistory.GetUTCDateTimeRangeForHistory(1);
        historyDetails.FromDate = Date[0];
        historyDetails.ToDate = Date[1];
        let Module = $(".lftpopuptabitem.active").attr("data-popuptab");
        LeadHistory.DecideAndBindDetails(Module);
    }
    else if (SelectedDateDropDownHistory == "This Week") {
        ShowPageLoading();
        let Date = LeadHistory.GetUTCDateTimeRangeForHistory(2);
        historyDetails.FromDate = Date[0];
        historyDetails.ToDate = Date[1];
        let Module = $(".lftpopuptabitem.active").attr("data-popuptab");
        LeadHistory.DecideAndBindDetails(Module);
    }
    else if (SelectedDateDropDownHistory == "This Month") {
        ShowPageLoading();
        let Date = LeadHistory.GetUTCDateTimeRangeForHistory(3);
        historyDetails.FromDate = Date[0];
        historyDetails.ToDate = Date[1];
        let Module = $(".lftpopuptabitem.active").attr("data-popuptab");
        LeadHistory.DecideAndBindDetails(Module);
    }
    else if (SelectedDateDropDownHistory.includes("Custom")) {
        $("#ui_txtStartDateHistory,#ui_txtEndDateHistory").val('');
        $(".dateBoxWrapLeadHistory").addClass("showFlx");
    }
    clearTimeIntervalofHistoryDetails = setInterval(IsHistoryLoadingToHide, 1000);
});

$(".dateclseWrapHistory").on('click', function () {
    $(this).parents('.dateBoxWrapLeadHistory').removeClass('showFlx');
});

$("#ui_btnCustomDateApplyHistory").click(function () {
    let Date = LeadHistory.GetUTCDateTimeRangeForHistory(5);
    if (Date[0] != undefined && Date[1] != undefined) {
        historyDetails.FromDate = Date[0];
        historyDetails.ToDate = Date[1];
        let Module = $(".lftpopuptabitem.active").attr("data-popuptab");
        ShowPageLoading();
        LeadHistory.DecideAndBindDetails(Module);
        clearTimeIntervalofHistoryDetails = setInterval(IsHistoryLoadingToHide, 1000);
    }
});