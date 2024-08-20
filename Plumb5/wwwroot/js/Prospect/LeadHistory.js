var historyDetails = { ContactId: 0, FromDate: '', ToDate: '' };
var clearTimeIntervalofHistoryDetails;
var leadhistoryDetailsLoading = { IsLeadHistoryLoading: false, IsNotesLoading: false, IsCallsLoading: false, IsEmailsLoading: false, IsSmsLoading: false, IsScoreloading: false, IsWhatsapploading: false };
var LeadHistoryContactId = 0;
var LeadHistory = {
    History: function (contactId, Name, UserInfoUserId) {
        //if (Plumb5UserId == UserInfoUserId || LmsPermissionlevelSeniorUserID == 0) {
        LeadHistoryContactId = contactId;
        $('#ui_drpdwn_SelectHistoryFilters').selectpicker("deselectAll", true).selectpicker("refresh");
        $(".popuptitlwrp h6").html("HISTORY");
        $(".lftpopuptabitem").removeClass("active");
        $(".lftpopupcontitem").addClass("hideDiv");
        $("#ui_div_" + contactId).addClass("activeBgRow");
        $("#ui_drpdwn_DateRange, .dropdown-menu-right").removeClass("show");
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
        //historyDetails.FromDate = new Date(historyDetails.FromDate);
        //historyDetails.ToDate = new Date(historyDetails.ToDate);
        
        $.ajax({
            url: "/ManageContact/UCP/GetFromAndToDate",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': historyDetails, 'Module': Module }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.Table1 != null && response.Table1.length > 0) {
                    let DateTime = response.Table1[0];
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
                leadhistoryDetailsLoading.IsScoreloading = true;
                leadhistoryDetailsLoading.IsSmsLoading = true;
                leadhistoryDetailsLoading.IsWhatsapploading = true;
                leadhistoryDetailsLoading.IsLeadHistoryLoading = false;
                LeadHistory.BindLeadHistory();
            case "emails":
                leadhistoryDetailsLoading.IsNotesLoading = true;
                leadhistoryDetailsLoading.IsCallsLoading = true;
                leadhistoryDetailsLoading.IsSmsLoading = true;
                leadhistoryDetailsLoading.IsScoreloading = true;
                leadhistoryDetailsLoading.IsLeadHistoryLoading = true;
                leadhistoryDetailsLoading.IsWhatsapploading = true;
                leadhistoryDetailsLoading.IsEmailsLoading = false;
                LeadHistory.BindEmail();
                break;
            case "sms":
                leadhistoryDetailsLoading.IsNotesLoading = true;
                leadhistoryDetailsLoading.IsCallsLoading = true;
                leadhistoryDetailsLoading.IsLeadHistoryLoading = true;
                leadhistoryDetailsLoading.IsScoreloading = true;
                leadhistoryDetailsLoading.IsEmailsLoading = true;
                leadhistoryDetailsLoading.IsWhatsapploading = true;
                leadhistoryDetailsLoading.IsSmsLoading = false;
                LeadHistory.BindSMS();
            case "whatsapp":
                leadhistoryDetailsLoading.IsNotesLoading = true;
                leadhistoryDetailsLoading.IsCallsLoading = true;
                leadhistoryDetailsLoading.IsLeadHistoryLoading = true;
                leadhistoryDetailsLoading.IsScoreloading = true;
                leadhistoryDetailsLoading.IsEmailsLoading = true;
                leadhistoryDetailsLoading.IsSmsLoading = true;
                leadhistoryDetailsLoading.IsWhatsapploading = false;
                LeadHistory.BindWhatsapp();
            case "calls":
                leadhistoryDetailsLoading.IsNotesLoading = true;
                leadhistoryDetailsLoading.IsLeadHistoryLoading = true;
                leadhistoryDetailsLoading.IsEmailsLoading = true;
                leadhistoryDetailsLoading.IsScoreloading = true;
                leadhistoryDetailsLoading.IsSmsLoading = true;
                leadhistoryDetailsLoading.IsWhatsapploading = true;
                leadhistoryDetailsLoading.IsCallsLoading = false;
                LeadHistory.BindCalls();
                break;
            case "notes":
                leadhistoryDetailsLoading.IsLeadHistoryLoading = true;
                leadhistoryDetailsLoading.IsEmailsLoading = true;
                leadhistoryDetailsLoading.IsSmsLoading = true;
                leadhistoryDetailsLoading.IsCallsLoading = true;
                leadhistoryDetailsLoading.IsScoreloading = true;
                leadhistoryDetailsLoading.IsWhatsapploading = true;
                leadhistoryDetailsLoading.IsNotesLoading = false;

                LeadHistory.BindNotes();
                break;
            case "scroing":
                leadhistoryDetailsLoading.IsNotesLoading = true;
                leadhistoryDetailsLoading.IsCallsLoading = true;
                leadhistoryDetailsLoading.IsLeadHistoryLoading = true;
                leadhistoryDetailsLoading.IsEmailsLoading = true;
                leadhistoryDetailsLoading.IsSmsLoading = true;
                leadhistoryDetailsLoading.iss = true;
                leadhistoryDetailsLoading.IsWhatsapploading = true;
                leadhistoryDetailsLoading.IsScoreloading = false;

                LeadHistory.BindScroing();
        }
    },
    BindLeadHistory: function () {
        //historyDetails.FromDate = new Date(historyDetails.FromDate);
        //historyDetails.ToDate = new Date(historyDetails.ToDate)
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
                        let filterLeadHistory = $('.filter-option-inner-inner').text().toLowerCase().replaceAll('nothing selected', '') != '' ? $('.filter-option-inner-inner').text().toLowerCase().replaceAll('nothing selected', '') : '';
                        for (let i = 1; i < lmsHistory.LeadsData.length; i++) {
                            for (let j = 0; j < leadHistoryFields.length; j++) {
                                if (lmsHistory.LeadsData[i - 1][leadHistoryFields[j]] != lmsHistory.LeadsData[i][leadHistoryFields[j]]) {
                                    let columnName = leadHistoryFields[j];
                                    let currentValue = lmsHistory.LeadsData[i - 1][leadHistoryFields[j]] != null && lmsHistory.LeadsData[i - 1][leadHistoryFields[j]] != undefined ? lmsHistory.LeadsData[i - 1][leadHistoryFields[j]] : "NA";
                                    let oldValue = lmsHistory.LeadsData[i][leadHistoryFields[j]] != null && lmsHistory.LeadsData[i][leadHistoryFields[j]] != undefined ? lmsHistory.LeadsData[i][leadHistoryFields[j]] : "NA";
                                    let updatedDate = lmsHistory.LeadsData[i - 1].UpdatedDate != null && lmsHistory.LeadsData[i - 1].UpdatedDate != undefined ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(lmsHistory.LeadsData[i - 1].UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(lmsHistory.LeadsData[i - 1].UpdatedDate)) : "NA";

                                    if (columnName.toLowerCase() == "username")
                                        columnName = "Handled By";
                                    else if (columnName.toLowerCase() == "score") {
                                        columnName = "Stage";
                                        oldValue = oldValue != null ? LeadHistory.FindStageBasedOnScore(oldValue) : "NA";
                                        currentValue = currentValue != null ? LeadHistory.FindStageBasedOnScore(currentValue) : "NA";
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
                                    } else if (columnName.toLowerCase() == "age") {
                                        columnName = "Age";
                                        currentValue = currentValue != "NA" ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(currentValue)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(currentValue)) : "NA";
                                        oldValue = oldValue != "NA" ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(oldValue)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(oldValue)) : "NA";
                                    } else if (columnName.toLowerCase() == "repeatleadcount") {
                                        columnName = "Repeat Lead";
                                        currentValue = updatedDate;
                                        oldValue = lmsHistory.LeadsData[i]["UpdatedDate"] != null && lmsHistory.LeadsData[i]["UpdatedDate"] != undefined ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(lmsHistory.LeadsData[i]["UpdatedDate"])) + " " + PlumbTimeFormat(GetJavaScriptDateObj(lmsHistory.LeadsData[i]["UpdatedDate"])) : "NA";
                                    }

                                    let historyHandledBy = lmsHistory.LeadsData[i - 1]["UserName"] != null ? lmsHistory.LeadsData[i - 1]["UserName"] : "NA";
                                    let historyStage = lmsHistory.LeadsData[i - 1]["Score"] != null ? LeadHistory.FindStageBasedOnScore(lmsHistory.LeadsData[i - 1]["Score"]) : "NA";
                                    let historySource = lmsHistory.LeadsData[i - 1]["LmsGroupName"] != null ? lmsHistory.LeadsData[i - 1]["LmsGroupName"] : "NA";
                                    let historyNotes = lmsHistory.LeadsData[i - 1]["Remarks"] != null ? lmsHistory.LeadsData[i - 1]["Remarks"] : "NA";

                                    if (filterLeadHistory != '') {
                                        if (filterLeadHistory.includes(columnName.toLowerCase())) {
                                            dataBinded = true;
                                            LeadHistory.AppendLeadHistory(columnName, currentValue, oldValue, updatedDate, historyHandledBy, historyStage, historySource, historyNotes);
                                        }
                                        else {
                                            if (filterLeadHistory.includes('contact') && columnName != 'Source' && columnName != 'Stage' && columnName != 'Handled By' && columnName != 'Repeat Lead') {
                                                dataBinded = true;
                                                LeadHistory.AppendLeadHistory(columnName, currentValue, oldValue, updatedDate, historyHandledBy, historyStage, historySource, historyNotes);
                                            }
                                        }
                                    }
                                    else {
                                        dataBinded = true;
                                        LeadHistory.AppendLeadHistory(columnName, currentValue, oldValue, updatedDate, historyHandledBy, historyStage, historySource, historyNotes);
                                    }
                                    LeadHistory.BindHistoryInfo();
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
    BindHistoryInfo: function () {
        $('.inficon').popover({
            html: true,
            trigger: "hover",
            placement: "right",
            content: function () {
                $("#ui_small_HistoryHandledBy").html($(this).attr("data-handledBy"));
                $("#ui_small_HistoryStage").html($(this).attr("data-Stage"));
                $("#ui_small_HistorySource").html($(this).attr("data-Source"));
                $("#ui_small_HistoryNotes").html($(this).attr("data-Notes"));
                return $(".leadhistmore").html();
            }
        });
    },
    FindStageBasedOnScore: function (Score) {
        let currentSample = JSLINQ(allStageDetails).Where(function () {
            return (this.Score == Score);
        });
        let currentValue = currentSample.items[0] != undefined && currentSample.items[0].Stage.length > 0 ? currentSample.items[0].Stage : "NA";
        return currentValue;
    },
    AppendLeadHistory: function (columnName, currentValue, oldValue, updatedDate, historyHandledBy, historyStage, historySource, historyNotes) {
        const HistoryData = `<tr>
                                <td class="text-left">
                                    ${columnName}
                                    <i class="icon ion-ios-information inficon" data-toggle="popover" data-trigger="hover" data-handledBy="${historyHandledBy}" data-Stage="${historyStage}" data-Source="${historySource}" data-Notes="${historyNotes}"></i>
                                </td>
                                <td class="text-left"><p class="text-color-blue mb-0">${currentValue}</p></td>
                                <td class="text-left">${oldValue}</td>
                                <td class="text-left">${updatedDate}</td>
                            </tr>`;
        $("#ui_Leadhistorytbody").append(HistoryData);
    },
    BindNotes: function () {
        //historyDetails.FromDate = new Date(historyDetails.FromDate);
        //historyDetails.ToDate = new Date(historyDetails.ToDate)
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
                        let UserName = value.UserInfoUserId != null && value.UserInfoUserId > 0 ? LmsDefaultFunctionUtil.GetAgentNameByUserId(value.UserInfoUserId) : "NA";
                        const NotesData = `<tr>
                                    <td class="text-left">${value.Content}</td>
                                    <td class="text-left">${UserName}</td>
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
        //historyDetails.FromDate = new Date(historyDetails.FromDate);
        //historyDetails.ToDate = new Date(historyDetails.ToDate)
        $.ajax({
            url: "/ManageContact/UCP/GetMailDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': historyDetails }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (MailList) => {

                if (MailList != undefined && MailList != null && MailList.Table1 != undefined && MailList.Table1 != null && MailList.Table1.length > 0) {
                    $("#ui_historyEmails").empty();
                    $.each(MailList.Table1, (key, value) => {
                        let UserName = value.UserInfoUserId != null && value.UserInfoUserId > 0 ? LmsDefaultFunctionUtil.GetAgentNameByUserId(value.UserInfoUserId) : "NA";

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
                                            <td class="text-left">${UserName}</td>
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
        //historyDetails.FromDate = new Date(historyDetails.FromDate);
        //historyDetails.ToDate = new Date(historyDetails.ToDate)
        $.ajax({
            url: "/ManageContact/UCP/GetSmsDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': historyDetails }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (SMSList) => {

                if (SMSList != undefined && SMSList != null && SMSList.Table1 != undefined && SMSList.Table1 != null && SMSList.Table1.length > 0) {
                    $("#ui_SmsHistory").empty();
                    $.each(SMSList.Table1, (key, value) => {

                        let UserName = value.UserInfoUserId != null && value.UserInfoUserId > 0 ? LmsDefaultFunctionUtil.GetAgentNameByUserId(value.UserInfoUserId) : "NA";

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
                                            <td class="text-left">${UserName}</td>
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

    BindWhatsapp: function () {
        //historyDetails.FromDate = new Date(historyDetails.FromDate);
        //historyDetails.ToDate = new Date(historyDetails.ToDate)
        $.ajax({
            url: "/ManageContact/UCP/GetWhatsappDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': historyDetails }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (WhatsappList) => {

                if (WhatsappList != undefined && WhatsappList != null && WhatsappList.Table1 != undefined && WhatsappList.Table1 != null && WhatsappList.Table1.length > 0) {
                    $("#ui_WhatsappHistory").empty();
                    $.each(WhatsappList.Table1, (key, value) => {
                        let delivereddatetime = "";
                        let clickeddatetime = "";
                        let readdatetime = "";

                        let UserName = value.UserInfoUserId != null && value.UserInfoUserId > 0 ? LmsDefaultFunctionUtil.GetAgentNameByUserId(value.UserInfoUserId) : "NA";

                        if (value.IsDelivered > 0 && value.DeliveryTime != undefined && value.DeliveryTime != null) {
                            delivereddatetime = `<i class="icon ion-android-calendar" title="${$.datepicker.formatDate(" M dd yy", GetJavaScriptDateObj(value.DeliveryTime)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.DeliveryTime))}"></i>`;
                        }
                        else {
                            delivereddatetime = "";

                        }
                        if (value.IsClicked > 0 && value.ClickDate != undefined && value.ClickDate != null) {
                            clickeddatetime = `<i class="icon ion-android-calendar" title="${$.datepicker.formatDate(" M dd yy", GetJavaScriptDateObj(value.ClickDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.ClickDate))}"></i>`;
                        }
                        else {
                            clickeddatetime = "";

                        }

                        if (value.IsRead > 0 && value.ReadDate != undefined && value.ReadDate != null) {
                            readdatetime = `<i class="icon ion-android-calendar" title="${$.datepicker.formatDate(" M dd yy", GetJavaScriptDateObj(value.ReadDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.ReadDate))}"></i>`;
                        }
                        else {
                            readdatetime = "";

                        }
                        const WhatsappData = `<tr>
                                            <td class="text-center">
                                                <div class="smsprevwrap prevwhatsapp" onclick="LeadHistory.PreviewTemplate('${value.TemplateName}', '${value.MessageContent.replace(/\n/g, '~n~')}', '${value.ButtonOneText}', '${value.ButtonOneType}', '${value.ButtonTwoText}', '${value.ButtonTwoType}', '${value.MediaFileURL}', '${value.TemplateType}');">
                                                        <i class="icon ion-ios-eye-outline"></i>
                                                </div>
                                            </td>
                                            <td class="text-left">${(value.TemplateName != undefined && value.TemplateName != null && value.TemplateName != "") ? value.TemplateName : "NA"}</td>
                                            <td class="text-left">${UserName}</td>
                                            <td class="text-right">${(value.PhoneNumber != undefined && value.PhoneNumber != null && value.PhoneNumber != "") ? value.PhoneNumber : "NA"}</td>
                                            <td> <div class="df-ac-sbet openrep"> <span>${value.IsDelivered}</span> ${delivereddatetime}</div> </td>
                                            <td> <div class="df-ac-sbet openrep"> <span>${value.IsRead}</span> ${readdatetime}</div></td>
                                            <td> <div class="df-ac-sbet openrep"> <span>${value.IsClicked}</span>${clickeddatetime} </div> </td>
                                            <td class="text-left">${$.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(value.SentDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(value.SentDate))}</td>
                                        </tr>`;
                        $("#ui_WhatsappHistory").append(WhatsappData);
                    });
                }
                else {
                    $("#ui_WhatsappHistory").empty().append(UCPUtil.NoDataFound(7));
                }

                leadhistoryDetailsLoading.IsWhatsappLoading = true;
            },
            error: ShowAjaxError
        });
    },

    BindCalls: function () {
        //historyDetails.FromDate = new Date(historyDetails.FromDate);
        //historyDetails.ToDate = new Date(historyDetails.ToDate);
        $.ajax({
            url: "/ManageContact/UCP/GetCallDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': historyDetails }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (CallList) => {

                if (CallList != undefined && CallList != null && CallList.Table1 != undefined && CallList.Table1 != null && CallList.Table1.length > 0) {
                    $("#ui_leadCallHistory").empty();
                    $.each(CallList.Table1, (key, value) => {
                        var _callednumber = value.CalledNumber;
                        if (_callednumber.length == 11)
                            _callednumber = _callednumber.slice(1)
                        else if (_callednumber.length == 12)
                            _callednumber = _callednumber.slice(2)
                        else if (_callednumber.length == 13)
                            _callednumber = _callednumber.slice(3)
                        var UserName = "NA";
                        var _username = JSLINQ(UserList).Where(function () {
                            return (this.MobilePhone == _callednumber);
                        });

                        if (_username.items[0] != null && _username.items[0] != "" && _username.items[0] != undefined) {
                            UserName = `${_username.items[0].FirstName}`;
                        }
                        let audiofile = `<audio controls><source src="${value.RecordedFileUrl}" type="audio/mpeg">Your browser does not support the audio element.</audio>`;
                        if (value.DownLoadStatus == false)
                            audiofile = `<audio controls><source src="${OnlineUrl}/TempFiles/VoiceCallRecorded/${value.Called_Sid}.mp3" type="audio/mpeg">Your browser does not support the audio element.</audio>`;


                        //audiofile = `<audio controls>${value.RecordedFileUrl}</audio>`;


                        const CallData = `<tr>
                                         <td class="text-left">${UserName}</td> 
                                        <td>${value.CalledStatus == null ? "NA" : value.CalledStatus}</td>
                                        <td>${value.TotalCallDuration == null ? "NA" : value.TotalCallDuration}</td>
                                        <td>${value.Pickduration == null ? "NA" : value.Pickduration}</td>
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

    BindScroing: function () {
        //historyDetails.FromDate = new Date(historyDetails.FromDate);
        //historyDetails.ToDate = new Date(historyDetails.ToDate)
        $.ajax({
            url: "/ManageContact/UCP/GetScroingDetailss",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'mLUCPVisitor': historyDetails }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response.length > 0) {
                    var getscroedetails = response;
                    var preiviousscores = {};
                    $("#location-div").empty();

                    for (var i = 0; i < getscroedetails.length; i++) {
                        if (i == 0) {
                            preiviousscores[i] = parseInt(getscroedetails[i].LeadScore);
                            $("#location-div").append('<div class="actionitem"><small class="badge-small">' + getscroedetails[i].CreatedDate + '</small><div class="actiontxtwrp"><div class="df-ac border-bottom"> <h3 class="actiontitle">Action -</h3> <div class="">  <h3 class="actiontitle"> ' + getscroedetails[i].IdentifierName + ' </h3> </div></div> <div class="d-flex align-items-center border-bottom">   <h6 class="actvalutxt">Value -</h6> <div class=" text-truncate actvaltxtcont" title="True"> <h3 class="actiontitle"> ' + getscroedetails[i].scorevalue + ' </h3> </div></div><h2 class="actionvalnum">' + getscroedetails[i].Score + ' </h2></div><div class="actionline"></div><div class="scoretxt">' + preiviousscores[i] + ' </div></div></div></div></div>');
                        }
                        else {
                            preiviousscores[i] = parseInt(preiviousscores[i - 1]) - parseInt(getscroedetails[i - 1].Score);
                            $("#location-div").append('<div class="actionhorilinewrp"><div class="actionhoriline"></div></div><div class="actionitem"><small class="badge-small">' + getscroedetails[i].CreatedDate + '</small><div class="actiontxtwrp"><div class="df-ac border-bottom"> <h3 class="actiontitle">Action -</h3> <div class="">  <h3 class="actiontitle"> ' + getscroedetails[i].IdentifierName + ' </h3> </div></div> <div class="d-flex align-items-center border-bottom">   <h6 class="actvalutxt">Value -</h6> <div class="text-truncate actvaltxtcont" title="True"> <h3 class="actiontitle"> ' + getscroedetails[i].scorevalue + ' </h3> </div></div><h2 class="actionvalnum">' + getscroedetails[i].Score + ' </h2></div><div class="actionline"></div><div class="scoretxt">' + preiviousscores[i] + ' </div></div></div></div></div>');
                        }
                    }
                }

                else {
                    $("#location-div").empty();

                    $("#location-div").append("<div class='no-data w-100'>There is no data for this view.</div>");
                }
                leadhistoryDetailsLoading.IsCallsLoading = true;
            },
            error: ShowAjaxError
        })
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
    },
    PreviewTemplate: function (TempName, TemplateContent, ButtonOneText, ButtonOneType, ButtonTwoText, ButtonTwoType, MediaFileURL, templtypeItem) {
        LeadHistory.RefreshPreviewPopUp();
        $(".popupsubtitle").text(TempName);
        $("#addwhatsapptext, #addwhatsapptextios").text(TemplateContent.replace(/~n~/g, "\n"));

        if (ButtonOneText != null && ButtonOneText != '' && ButtonOneText != "null") {
            $("#spn_whatsvisitwebsite, #spn_whatsvisitwebsiteios").text(ButtonOneText);
            $("#ui_div_AndrButtn, #ui_div_IosButtn, #whatsvisitwebsite, #whatsvisitwebsiteios").removeClass("hideDiv");
            if (ButtonOneType != null && ButtonOneType != '' && ButtonOneType != "null") {
                if (ButtonOneType == "Website") {
                    $("#imgBtn1, #imgBtn1ios").addClass("fa fa-external-link");
                    if ($("#imgBtn1, #imgBtn1ios").hasClass("fa-phone"))
                        $("#imgBtn1, #imgBtn1ios").removeClass("fa-phone");
                } else if (ButtonOneType == "Call") {
                    $("#imgBtn1, #imgBtn1ios").addClass("fa fa-phone");
                    if ($("#imgBtn1, #imgBtn1ios").hasClass("fa-external-link"))
                        $("#imgBtn1, #imgBtn1ios").removeClass("fa-external-link");
                }
            }
        }

        if (ButtonTwoText != null && ButtonTwoText != '' && ButtonTwoText != "null") {
            $("#spn_whatscallphone, #spn_whatscallphoneios").text(ButtonTwoText);
            $("#whatscallphone, #whatscallphoneios").removeClass("hideDiv");
            if (ButtonTwoType != null && ButtonTwoType != '' && ButtonTwoType != "null") {
                if (ButtonTwoType == "Website") {
                    $("#imgBtn2, #imgBtn2ios").addClass("fa fa-external-link");
                    if ($("#imgBtn2, #imgBtn2ios").hasClass("fa-phone"))
                        $("#imgBtn2, #imgBtn2ios").removeClass("fa-phone");
                } else if (ButtonTwoType == "Call") {
                    $("#imgBtn2, #imgBtn2ios").addClass("fa fa-phone");
                    if ($("#imgBtn2, #imgBtn2ios").hasClass("fa-external-link"))
                        $("#imgBtn2, #imgBtn2ios").removeClass("fa-external-link");
                }
            }
        }

        if (MediaFileURL != null && MediaFileURL != '' && MediaFileURL != "null") {
            //$("#addwhatsappimage, #addwhatsappimageIos").attr("src", MediaFileURL);

            if (templtypeItem == "text") {
                $("#whatsappuploadtype, #mediaurlmain, #mediauploadfiles, .whatsappimgwrp").addClass("hideDiv");

            } else if (templtypeItem == "image") {
                $("#whatsappuploadtype, #mediaurlmain, .whatsappimgwrp").removeClass("hideDiv");
                $("#addwhatsappimage, #addwhatsappimageIos").attr(
                    "src",
                    "/Content/images/white_image.png"
                );
            } else if (templtypeItem == "video") {
                $("#whatsappuploadtype, #mediaurlmain, .whatsappimgwrp").removeClass(
                    "hideDiv"
                );
                $("#addwhatsappimage, #addwhatsappimageIos").attr(
                    "src",
                    "/Content/images/white_video.png"
                );
            } else if (templtypeItem == "document") {
                $("#whatsappuploadtype, #mediaurlmain, .whatsappimgwrp").removeClass(
                    "hideDiv"
                );
                $("#addwhatsappimage, #addwhatsappimageIos").attr(
                    "src",
                    "/Content/images/white_document.png"
                );
            } else {
                $("#whatsappuploadtype, #mediaurlmain, .whatsappimgwrp").removeClass(
                    "hideDiv"
                );
                $("#addwhatsappimage, #addwhatsappimageIos").attr(
                    "src",
                    "/Content/images/white_location.png"
                );
            }

            $(".whatsappimgwrp").removeClass("hideDiv");
        }

        $(".popuptitlwrp h6").text("Preview Template");

        $("#whatsappprevpopup").removeClass("hideDiv");
    },
    RefreshPreviewPopUp: function () {
        $("#ui_div_AndrButtn, #ui_div_IosButtn, #whatsvisitwebsite, #whatsvisitwebsiteios, #whatscallphone, #whatscallphoneios, .whatsappimgwrp").addClass("hideDiv");
    }
};

$(".lftpopuptabitem").click(function () {
    $(".lftpopuptabitem").removeClass("active");
    $(this).addClass("active");
    let getlftpopuptabcontId = $(this).attr("data-popuptab");
    if (getlftpopuptabcontId == "leadhistory") {
        $(".lmssourcefilterwrp").removeClass("hideDiv");
    } else {
        $(".lmssourcefilterwrp").addClass("hideDiv");
    }
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

$("#ui_txtStartDateHistory").datepicker({
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: true,
    maxDate: "0",
    changeMonth: true,
    changeYear: true
});

$("#ui_txtEndDateHistory").datepicker({
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: true,
    maxDate: "0",
    changeMonth: true,
    changeYear: true
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

$("#ui_drpdwn_SelectHistoryFilters").change(function () {
    ShowPageLoading();
    let Module = $(".lftpopuptabitem.active").attr("data-popuptab");
    clearTimeIntervalofHistoryDetails = setInterval(IsHistoryLoadingToHide, 1000);
    LeadHistory.DecideAndBindDetails(Module);
});