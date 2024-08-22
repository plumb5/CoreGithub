var NotesAttachmentFileName = "";

var DeleteContactId = 0;
var ToReminderWhatsAppPhoneNumber = "";
var LeadsReportDetailsUtil = {
    //Update New tag
    UpdateLeadSeen: function (ContactId, Name) {
        $.ajax({
            url: "/Prospect/Leads/UpdateLeadSeen",
            type: 'POST',
            data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'ContactId': ContactId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    $("#ui_div_ContactName_" + ContactId).empty();
                    $("#ui_div_ContactName_" + ContactId).html("<span class='nameTxt'>" + Name + "</span>");
                }
                ShowContactUCP("", "", ContactId);
            },
            error: ShowAjaxError
        });
    },
    //Edit Leads
    EditLeadDetails: function (ContactId, LmsGroupId) {
        $("#ui_div_" + ContactId).addClass("activeBgRow");
        ShowPageLoading();
        $(".dropdown-menu").removeClass("show");
        $('#ui_btn_SubmitCreateContact').attr("BindType", "EDIT");
        ContactManageUtil.GetContactDetailsForUpdate(ContactId, '', '', LmsGroupId);
        $("#tabFollowup").addClass("hideDiv");
        //$('#ui_btn_SubmitCreateContact').attr('disabled', 'disabled');
        if (LmsGroupId != undefined) {
            createandupdatebuttondisable = false;
            if (Plumb5UserId == LmseEditFollowupNotesUserinfouserid || editfollowupnotespopup == 1) {
                $("#tabFollowup").removeClass("hideDiv");
                $('#ui_btn_SubmitCreateContact').removeAttr("disabled");
            }
        }
        else {
            createandupdatebuttondisable = true;
        }
    },
    //Show Add Follow Up Pop Up
    ShowAddFollowUpPopUp: function (ContactId, Name, EmailId, UserInfoUserId, score, LeadLabel) {
        $("#ui_div_" + ContactId).addClass("activeBgRow");
        $(".dropdown-menu").removeClass("show");
        //$(".popupcontainer").removeClass("hideDiv");
        //$(".popuptitle h6").html("ADD FOLLOW-UP");
        $("#dv_AddFollowUp").removeClass("hideDiv");
        var ContactDetails = Name != "null" && EmailId != "null" ? "" + Name + " - (" + EmailId + ")" : Name != "null" && EmailId == "null" ? "" + Name + "" : Name == "null" && EmailId != "null" ? "" + EmailId + "" : "";
        $(".popupsubtitle").html(ContactDetails);
        $("#btn_AddFollowUp").removeAttr("ContactId");
        $("#btn_AddFollowUp").attr("ContactId", ContactId);
        $("#btn_AddFollowUp").attr("Score", score);
        $("#btn_AddFollowUp").attr("LeadLabel", LeadLabel);
        $("#txtFollowUpSalesPerson").val(UserInfoUserId);
        $("#txtFollowUpDate,#txtFollowUpContent,#ui_setRemainderEmailId,#ui_setRemainderPhoneNumber,#ui_remainderdate").val("");
        $("#ui_setRemainderEmailId").val(LmsDefaultFunctionUtil.GetAgentEmailIdByUserId(UserInfoUserId));
        $("#ui_setRemainderPhoneNumber").val(LmsDefaultFunctionUtil.GetAgentPhoneNumberByUserId(UserInfoUserId));
        $("#ui_ddl_FollowUpTime,#ui_remainderdateTime").val("10:00");
        $("#lmsagntrememl,#lmsagntremsms,#lmsagntremboth").prop("checked", false);

        if ($("#ui_setremainderDiv").prop("checked")) {
            $("#ui_setremainderDiv").click();
        }
    },
    //Validate FollowUp Details
    ValidateFollowUpDetails: function () {
        if (parseInt($("#txtFollowUpSalesPerson").val()) === 0) {
            ShowErrorMessage(GlobalErrorList.Leads.FollowUpUserSelectionError);
            HidePageLoading();
            return false;
        }

        if ($("#txtFollowUpDate").val().length === 0) {
            ShowErrorMessage(GlobalErrorList.Leads.EnterFollowUpDateError);
            HidePageLoading();
            return false;
        }

        var today = new Date();
        var enteredDate = $("#txtFollowUpDate").val() + " " + $("#ui_ddl_FollowUpTime").val() + ":00";
        var currentDate = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        if (Date.parse(enteredDate) < Date.parse(currentDate)) {
            ShowErrorMessage(GlobalErrorList.Leads.FollowUpDateError);
            HidePageLoading();
            return false;
        }

        if ($("#txtFollowUpContent").val().length === 0) {
            ShowErrorMessage(GlobalErrorList.Leads.EnterFollowUpContentError);
            HidePageLoading();
            return false;
        }

        if ($("#ui_setremainderDiv").is(":checked")) {
            if ($("#lmsagntrememl").is(":checked")) {
                if (CleanText($.trim($("#ui_setRemainderEmailId").val())).length == 0) {
                    ShowErrorMessage(GlobalErrorList.Leads.SetRemainderEmailId);
                    HidePageLoading();
                    return false;
                }

                if (!regExpEmail.test(CleanText($.trim($("#ui_setRemainderEmailId").val())))) {
                    ShowErrorMessage(GlobalErrorList.Leads.SetRemainderEmailId);
                    HidePageLoading();
                    return false;
                }

            } else if ($("#lmsagntremsms").is(":checked")) {
                if (CleanText($.trim($("#ui_setRemainderPhoneNumber").val())).length == 0) {
                    ShowErrorMessage(GlobalErrorList.Leads.SetRemainderPhoneNumber);
                    HidePageLoading();
                    return false;
                }

            } else if ($("#lmsagntremwhatsapp").is(":checked")) {
                if (CleanText($.trim($("#ui_setRemainderPhoneNumber").val())).length == 0) {
                    ShowErrorMessage(GlobalErrorList.Leads.SetRemainderPhoneNumber);
                    HidePageLoading();
                    return false;
                }
            }
            else if ($("#lmsagntremboth").is(":checked")) {
                if (CleanText($.trim($("#ui_setRemainderEmailId").val())).length == 0) {
                    ShowErrorMessage(GlobalErrorList.Leads.SetRemainderEmailId);
                    HidePageLoading();
                    return false;
                }

                if (!regExpEmail.test(CleanText($.trim($("#ui_setRemainderEmailId").val())))) {
                    ShowErrorMessage(GlobalErrorList.Leads.SetRemainderEmailId);
                    HidePageLoading();
                    return false;
                }

                if (CleanText($.trim($("#ui_setRemainderPhoneNumber").val())).length == 0) {
                    ShowErrorMessage(GlobalErrorList.Leads.SetRemainderPhoneNumber);
                    HidePageLoading();
                    return false;
                }

            } else {
                ShowErrorMessage(GlobalErrorList.Leads.NoSetRemainderChecked);
                HidePageLoading();
                return false;
            }

            if (CleanText($.trim($("#ui_remainderdate").val())).length > 0) {
                let todayremainder = new Date();
                let enteredremainderDate = $("#ui_remainderdate").val() + " " + $("#ui_remainderdateTime").val() + ":00";
                let currentremainderDate = (todayremainder.getMonth() + 1) + '/' + todayremainder.getDate() + '/' + todayremainder.getFullYear() + " " + todayremainder.getHours() + ":" + todayremainder.getMinutes() + ":" + todayremainder.getSeconds();
                if (Date.parse(enteredremainderDate) < Date.parse(currentremainderDate)) {
                    ShowErrorMessage(GlobalErrorList.Leads.SetRemainderDateTime);
                    HidePageLoading();
                    return false;
                }
            } else {
                ShowErrorMessage(GlobalErrorList.Leads.SetRemainderDateTime);
                HidePageLoading();
                return false;
            }

            var enteredFollowDate = $("#txtFollowUpDate").val() + " " + $("#ui_ddl_FollowUpTime").val() + ":00";
            var enteredRemainderDate = $("#ui_remainderdate").val() + " " + $("#ui_remainderdateTime").val() + ":00";
            if (Date.parse(enteredFollowDate) < Date.parse(enteredRemainderDate)) {
                ShowErrorMessage(GlobalErrorList.Leads.SetRemainderDateTimeLesser);
                HidePageLoading();
                return false;
            }
        }

        return true;
    },
    //On submit of add follow up
    ButtonClickAddFollowUp: function () {
        ShowPageLoading();

        if (!LeadsReportDetailsUtil.ValidateFollowUpDetails()) {
            HidePageLoading();
            return false;
        }
        var LeadList = [], isReminderAdded = false; var LeadGroupIdList = []; var ContactIds = [];
        let followUpDateUTCFormat, remainderDateTimeUTCFormat, followUpDateInstantBind, reminderDateInstantBind;

        if ($("#btn_AddFollowUp").attr("ContactId") != 0) {
            ContactIds.push(parseInt($("#btn_AddFollowUp").attr("ContactId")));
            LeadList.push(LmseEditLmsGroupMemberId);
            LeadGroupIdList.push(LmseEditLmsGroupId);
        }
        else {
            ContactIds = LmsDefaultFunctionUtil.GetSelectedContactIds();
            LeadList = LmsDefaultFunctionUtil.GetSelectedLmsGroupMemberIds();
            LeadGroupIdList = LmsDefaultFunctionUtil.GetSelectedLmsGroupId();
        }

        var FollowUpContent = $("#txtFollowUpContent").val();
        var FollowUpUserId = parseInt($("#txtFollowUpSalesPerson").val());
        var followUpDate = LmsDefaultFunctionUtil.ReturnDateInFormat($("#txtFollowUpDate").val()) + " " + $("#ui_ddl_FollowUpTime").val().toString() + ":00";
        followUpDateUTCFormat = ConvertDateTimeToUTC(followUpDate);
        followUpDateInstantBind = ConvertDateObjectToDateTime(followUpDate);
        var FollowUpdate = followUpDateUTCFormat.getFullYear() + '-' + PrefixZero((followUpDateUTCFormat.getMonth() + 1)) + '-' + PrefixZero(followUpDateUTCFormat.getDate()) + " " + PrefixZero(followUpDateUTCFormat.getHours()) + ":" + PrefixZero(followUpDateUTCFormat.getMinutes()) + ":" + PrefixZero(followUpDateUTCFormat.getSeconds());
        var FollowUpStatus = 1;

        var remainder = new Object();
        if ($("#ui_setremainderDiv").is(":checked")) {
            ToReminderWhatsAppPhoneNumber = "";
            isReminderAdded = true;
            if ($("#lmsagntrememl").is(":checked") || $("#lmsagntremboth").is(":checked"))
                remainder.ToReminderEmailId = CleanText($.trim($("#ui_setRemainderEmailId").val()));
            if ($("#lmsagntremsms").is(":checked") || $("#lmsagntremboth").is(":checked"))
                remainder.ToReminderPhoneNumber = CleanText($.trim($("#ui_setRemainderPhoneNumber").val()));
            if ($("#lmsagntremwhatsapp").is(":checked") || $("#lmsagntremboth").is(":checked"))
                ToReminderWhatsAppPhoneNumber = CleanText($.trim($("#ui_setRemainderPhoneNumber").val()));
            remainder.Score = $("#btn_AddFollowUp").attr("Score") == undefined || $("#btn_AddFollowUp").attr("Score") == '' ? 0 :  parseInt($("#btn_AddFollowUp").attr("Score"));
            remainder.LeadLabel = CleanText($("#btn_AddFollowUp").attr("LeadLabel"));
            let remainderDateTime = LmsDefaultFunctionUtil.ReturnDateInFormat($("#ui_remainderdate").val()) + " " + $("#ui_remainderdateTime").val().toString() + ":00";
            remainderDateTimeUTCFormat = ConvertDateTimeToUTC(remainderDateTime);
            reminderDateInstantBind = ConvertDateObjectToDateTime(remainderDateTime);
            remainder.ReminderDate = new Date(remainderDateTimeUTCFormat.getFullYear() + '-' + PrefixZero((remainderDateTimeUTCFormat.getMonth() + 1)) + '-' + PrefixZero(remainderDateTimeUTCFormat.getDate()) + " " + PrefixZero(remainderDateTimeUTCFormat.getHours()) + ":" + PrefixZero(remainderDateTimeUTCFormat.getMinutes()) + ":" + PrefixZero(remainderDateTimeUTCFormat.getSeconds()));
        }

        if (LeadList.length > 0) {
            $.ajax({
                url: "/Prospect/Leads/SaveFollowUps",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'ContactIds': ContactIds, 'LmsGroupmembersIds': LeadList, 'FollowUpContent': FollowUpContent, 'FollowUpStatus': FollowUpStatus, 'FollowUpdate': FollowUpdate, 'FollowUpUserId': FollowUpUserId, 'LmsGroupIds': LeadGroupIdList, 'SetRemainder': remainder, 'ToReminderWhatsAppPhoneNumber': ToReminderWhatsAppPhoneNumber }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response != null) {
                        if (response.SuccessCount > 0 && response.SetRemainderStatus) {
                            ShowSuccessMessage((GlobalErrorList.Leads.FallowUpRemainder).replace("{*1*}", LeadList.length).replace("{*2*}", response.SuccessCount));
                        } else if (response.SuccessCount > 0 && response.SetRemainderStatus == false) {
                            ShowSuccessMessage((GlobalErrorList.Leads.FallowUpAdded).replace("{*1*}", LeadList.length).replace("{*2*}", response.SuccessCount));
                        } else if (response.SuccessCount == 0 && response.SetRemainderStatus) {
                            ShowSuccessMessage(GlobalErrorList.Leads.UnableToAddFollowRmainder);
                        } else {
                            ShowErrorMessage(GlobalErrorList.Leads.FollowUpFailureStatus);
                        }
                    }
                    else {
                        ShowErrorMessage(GlobalErrorList.Leads.SomethingWentWrong);
                    }

                    for (var i = 0; i < LeadList.length; i++) {
                        $("#ui_small_ViewDate_" + LeadList[i]).addClass("m-0 viewreminddate ");

                        $("#ui_div_" + LeadList[i]).removeClass("activeBgRow");
                        $("#ui_p_FollowUpDate_" + LeadList[i]).html("<b>Follow-Up: </b>" + $.datepicker.formatDate("M dd yy", followUpDateInstantBind) + " " + PlumbTimeFormat(followUpDateInstantBind));
                        if (isReminderAdded)
                            $("#ui_p_ReminderDate_" + LeadList[i]).html("<b>Reminder: </b>" + $.datepicker.formatDate("M dd yy", reminderDateInstantBind) + " " + PlumbTimeFormat(reminderDateInstantBind));
                        LmsDefaultFunctionUtil.RemoveFollowUpClass(LeadList[i]);
                    }

                    $("#txtFollowUpDate").val('')
                    $("#txtFollowUpContent").val('');
                    $("#ui_setRemainderDivPop").addClass("hideDiv");
                    $("#ui_setremainderDiv").prop('checked', false);

                    //LmsDefaultFunctionUtil.HideCustomPopUp("dv_AddFollowUp");
                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        }
        LmsDefaultFunctionUtil.ClearAllCheckboxDivValues();
    },
    //View Follow Up
    ViewFollowUp: function (ContactId, Name, EmailId, LmsGroupmemberId) {
        $("#ui_div_" + LmsGroupmemberId).addClass("activeBgRow");
        $(".dropdown-menu").removeClass("show");
        $.ajax({
            url: "/Prospect/Leads/GetLeadFollowUpData",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'LmsGroupmemberId': LmsGroupmemberId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status) {
                    $(".popuptitle h6").html("VIEW FOLLOW-UP");
                    var ContactDetails = Name != "null" && EmailId != "null" ? "" + Name + " - (" + EmailId + ")" : Name != "null" && EmailId == "null" ? "" + Name + "" : Name == "null" && EmailId != "null" ? "" + EmailId + "" : "";
                    $(".popupsubtitle").html(ContactDetails);
                    $("#lbl_FollowUpDate,#lbl_FollowUpUserId,#lbl_LeadHandledByUserId,#lbl_FollowUpContent,#lbl_FollowUpCreatedDate,#lbl_FollowUpStatus").html("");
                    LeadsReportDetailsUtil.BindFollowUpDetails(response.contactfollowUpsDetails, ContactId);
                    HidePageLoading();
                }
                else if (!response.Status) {
                    ShowErrorMessage(GlobalErrorList.Leads.NoFollowUpExists);
                    $("#ui_div_" + LmsGroupmemberId).removeClass("activeBgRow");
                    HidePageLoading();
                    return false;
                }
            },
            error: ShowAjaxError
        });
    },
    //Bind follow up details in pop up
    BindFollowUpDetails: function (response) {
        if (response != null) {
            $("#lbl_FollowUpDate").html($.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response.FollowUpDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(response.FollowUpDate)));

            var userinfouserid = response.UserInfoUserId;

            var sample = JSLINQ(UserList).Where(function () {
                return (this.UserInfoUserId == userinfouserid);
            });

            if (sample.items[0] != null && sample.items[0] != "" && sample.items[0] != undefined) {
                $("#lbl_LeadHandledByUserId").html(sample.items[0].EmailId);
            }

            var followupuserinfouserid = response.FollowUpUserId;

            var sample = JSLINQ(UserList).Where(function () {
                return (this.UserInfoUserId == followupuserinfouserid);
            });

            if (sample.items[0] != null && sample.items[0] != "" && sample.items[0] != undefined) {
                $("#lbl_FollowUpUserId").html(sample.items[0].EmailId);
            }

            var FollowUpStatusDetails = response.FollowUpStatus == 1 ? "Planned" : response.FollowUpStatus == 2 ? "Completed" : response.FollowUpStatus == 3 ? "Missed" : "";

            $("#lbl_FollowUpStatus").html(FollowUpStatusDetails);
            $("#lbl_FollowUpContent").html(response.FollowUpContent);

            if (response.FollowUpCreatedDate != null && response.FollowUpCreatedDate != undefined)
                $("#lbl_FollowUpCreatedDate").html($.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response.FollowUpCreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(response.FollowUpCreatedDate)));
            else
                $("#lbl_FollowUpCreatedDate").html("NA");

            $("#dv_ViewFollowUpDetails").removeClass("hideDiv");
        }
    },
    //Show confirmation box of update follow up
    ShowFollowUpCompletedConfirmationBox: function (ContactId, UserInfoUserId, LmsGroupmemberId) {
        //if (Plumb5UserId == UserInfoUserId || LmsPermissionlevelSeniorUserID == 0) {
        ShowPageLoading();
        if (window.location.href.toLowerCase().indexOf("/prospect/followups/completedfollowups") > 0) {
            HidePageLoading();
        }
        else {
            $.ajax({
                url: "/Prospect/Leads/GetLeadFollowUpData",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'LmsGroupmemberId': LmsGroupmemberId }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response.Status) {
                        $("#ui_div_" + LmsGroupmemberId).addClass("activeBgRow");
                        $("#confirmfollowupcomplete").modal("show");
                        $("#submitFollowupCompleted").attr("LmsGroupmemberId", LmsGroupmemberId);
                    }
                    else if (!response.Status) {
                        ShowErrorMessage(GlobalErrorList.Leads.NoFollowUpExists);
                    }
                    HidePageLoading();
                },
                error: ShowAjaxError
            });
        }

    },
    //On click update follow up to completed
    ConfirmUpdateFollowUpCompleted: function () {
        ShowPageLoading();

        var LmsGroupmemberId = $("#submitFollowupCompleted").attr("LmsGroupmemberId");
        $("#confirmfollowupcomplete").modal("hide");
        $(".dropdown-menu").removeClass("show");
        var LeadList = [];
        var LeadIds = LmsDefaultFunctionUtil.GetSelectedLmsGroupMemberIds();
        for (var i = 0; i < LeadIds.length; i++) {
            LeadList.push(LeadIds[i]);
        }
        if (LeadList.length == 0)
            LeadList.push(LmsGroupmemberId);
        $.ajax({
            url: "/Prospect/Leads/UpdateFollowUpCompleted",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'LmsGroupmemberIds': LeadList }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status)
                    ShowSuccessMessage(GlobalErrorList.Leads.FollowUpCompletedSuccess);
                else
                    ShowErrorMessage(GlobalErrorList.Leads.FollowUpCompletedError);

                $("#ui_div_" + LmsGroupmemberId).removeClass("activeBgRow");
                $("#submitFollowupCompleted").removeAttr("LmsGroupmemberId");
                HidePageLoading();
                if (window.location.href.indexOf("/Prospect/FollowUps") > 0)
                    setTimeout(function () { window.location.reload() }, 500);
                else {
                    LmsDefaultFunctionUtil.RemoveFollowUpClass(ContactId);
                    $("#ui_small_ViewDate_" + LmsGroupmemberId).addClass("text-success");
                }
            },
            error: ShowAjaxError
        });
    },
    //Show notes pop up
    ShowNotesPopUp: function (ContactId, Name, EmailId) {
        $("#ui_div_" + ContactId).addClass("activeBgRow");
        LeadsReportDetailsUtil.GetLastNotes(ContactId);
        $(".dropdown-menu").removeClass("show");
        //$(".popuptitle h6").html("ADD NOTES");
        $("#dv_LmsNotes").removeClass("hideDiv");
        var ContactDetails = Name != "null" && EmailId != "null" ? "" + Name + " - (" + EmailId + ")" : Name != "null" && EmailId == "null" ? "" + Name + "" : Name == "null" && EmailId != "null" ? "" + EmailId + "" : "";
        $(".popupsubtitle").html(ContactDetails);
        $("#btnSaveNotesDetails").removeAttr("ContactId");
        $("#btnSaveNotesDetails").attr("ContactId", ContactId);
        LeadsReportDetailsUtil.ClearNotesPopUpField();
        $("#btnSaveNotesDetailsLms").removeAttr("lmsnote");
    },
    //Show LMS notes pop up
    ShowLMSNotesPopUp: function (ContactId, Name, EmailId) {
        $("#ui_div_" + ContactId).addClass("activeBgRow");
        LeadsReportDetailsUtil.GetLastNotes(ContactId);
        $(".dropdown-menu").removeClass("show");
        //$(".popuptitle h6").html("ADD NOTES");
        $("#lmsaddnotesNew").removeClass("hideDiv");
        $("#dv_LmsNotesNew").removeClass("hideDiv");
        var ContactDetails = Name != "null" && EmailId != "null" ? "" + Name + " - (" + EmailId + ")" : Name != "null" && EmailId == "null" ? "" + Name + "" : Name == "null" && EmailId != "null" ? "" + EmailId + "" : "";
        $(".popupsubtitle").html(ContactDetails);
        $("#btnSaveNotesDetailsLms").removeAttr("ContactId");
        $("#btnSaveNotesDetailsLms").attr("ContactId", ContactId);
        $("#btnSaveNotesDetailsLms").attr("lmsnote", "true");
        LeadsReportDetailsUtil.ClearNotesPopUpField();
    },
    //Getting old notes
    GetLastNotes: function (ContactId) {
        $.ajax({
            url: "/Prospect/Leads/GetNoteList",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'contactId': ContactId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.length > 0) {
                    $("#ui_tbodyNotes,#ui_tbodyNotesLms").empty();
                    $("#ui_dvLastNotes,#ui_dvLastNotesLms").removeClass('hideDiv');
                    $.each(response, function (i) {
                        let attachment = this.Attachment != null && this.Attachment != undefined && this.Attachment.length > 0 ? '<a target="_blank" href="https://p5betapgemail-email-template-images.s3.ap-south-1.amazonaws.com/ClientImages/' + this.Attachment + '">' + this.Attachment + '</a>' : "";
                        let UserName = this.UserInfoUserId != null && this.UserInfoUserId > 0 ? LmsDefaultFunctionUtil.GetAgentNameByUserId(this.UserInfoUserId) : "NA";
                        $("#ui_tbodyNotes,#ui_tbodyNotesLms").append("<tr><td class='text-left'>" + this.Content + "<p class='lmsdateshow'>" + UserName + "</p>" + "<p class='lmsdateshow'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.Date)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.Date)) + "</p>" + attachment + "</td></tr>");
                    });
                }
                else
                    $("#ui_dvLastNotes,#ui_dvLastNotesLms").removeClass('hideDiv');
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    //Clear notes field
    ClearNotesPopUpField: function () {
        $("#txtRemarks,#txtRemarksLms").val("");
        $("#ui_NotesAttachmentfiles,#ui_NotesAttachmentfilesLms").val("");
        $("#ui_lbl_NotesAttachment,#ui_lbl_NotesAttachmentLms").html("Choose File");
        NotesAttachmentFileName = "";
    },
    //Attaching files in notes
    NotesFileAttachement: function () {
        ShowPageLoading();
        var files = $("#btnSaveNotesDetailsLms").attr("lmsnote") != undefined ? $("#ui_NotesAttachmentfilesLms").get(0).files : $("#ui_NotesAttachmentfiles").get(0).files;
        if (files.length > 0) {

            if ($("#btnSaveNotesDetailsLms").attr("lmsnote") != undefined)
                $("#ui_lbl_NotesAttachmentLms").html(files[0].name);
            else
                $("#ui_lbl_NotesAttachment").html(files[0].name);

            var data = new FormData();
            data.append("UploadedImage", files[0]);
            $.ajax({
                type: "POST",
                url: "/CaptureForm/Create/UploadFile",
                contentType: false,
                processData: false,
                data: data,
                success: function (response) {
                    if (response != undefined && response.filePath != undefined && response.filePath.length > 0) {
                        NotesAttachmentFileName = response.filePath.substring(response.filePath.lastIndexOf('/') + 1);
                        ShowSuccessMessage(GlobalErrorList.Leads.NotesFileUploadSuccess);
                    }
                    else
                        ShowErrorMessage(GlobalErrorList.Leads.NotesFileUploadError);

                    HidePageLoading();
                }
            });
        }
    },
    //Validation for notes
    ValidateNotesFields: function () {
        if ($("#btnSaveNotesDetailsLms").attr("lmsnote") != undefined) {
            if ($("#txtRemarksLms").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.Leads.NotesValidationError);
                $("#txtRemarksLms").focus();
                return false;
            }
        } else {
            if ($("#txtRemarks").val().length == 0) {
                ShowErrorMessage(GlobalErrorList.Leads.NotesValidationError);
                $("#txtRemarks").focus();
                return false;
            }
        }

        return true;
    },
    //Button click save notes 
    SaveNotes: function () {
        ShowPageLoading();
        if (!LeadsReportDetailsUtil.ValidateNotesFields()) {
            HidePageLoading();
            return false;
        }
        var leadNotes = { Content: "", ContactId: 0, Attachment: "", UserInfoUserId: 0 };

        leadNotes.ContactId = $("#btnSaveNotesDetailsLms").attr("lmsnote") != undefined ? $("#btnSaveNotesDetailsLms").attr("ContactId") : $("#btnSaveNotesDetails").attr("ContactId");
        leadNotes.Content = $("#btnSaveNotesDetailsLms").attr("lmsnote") != undefined ? $("#txtRemarksLms").val() : $("#txtRemarks").val();
        leadNotes.Attachment = NotesAttachmentFileName;
        leadNotes.UserInfoUserId = Plumb5UserId;

        $.ajax({
            url: "/Prospect/Leads/UpdateNotes",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'notes': leadNotes }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.Leads.NotesSuccessStatus);
                    LeadsReportDetailsUtil.GetLastNotes(leadNotes.ContactId);
                }
                else
                    ShowErrorMessage(GlobalErrorList.Leads.NotesValidationError);
                LeadsReportDetailsUtil.ClearNotesPopUpField();
            },
            error: ShowAjaxError
        });
    },
    //Delete modal show
    DeleteModalShow: function (LmsGroupmemberId, UserInfoUserId) {
        //if (Plumb5UserId == UserInfoUserId || LmsPermissionlevelSeniorUserID == 0) {
        $("#ui_div_" + LmsGroupmemberId).addClass("activeBgRow");
        DeleteLmsGroupmemberId = LmsGroupmemberId;
        $("#deletelmsleads").modal("show");

    },
    //Confirm delete leads
    DeleteLeads: function () {
        var LmsGroupmemberId = [];
        LmsGroupmemberId.push(DeleteLmsGroupmemberId);
        $.ajax({
            url: "/Prospect/Leads/DeleteSelectedLeads",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'LmsGroupMemberID': LmsGroupmemberId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    --CurrentRowCount;
                    --TotalRowCount;
                    $("#ui_div_" + DeleteLmsGroupmemberId).remove();
                    PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
                    ShowSuccessMessage(GlobalErrorList.Leads.DeleteSuccessStatus);
                    if (CurrentRowCount <= 0 && TotalRowCount <= 0) {
                        $('.searchCampWrap').hide();
                        ShowExportDiv(false);
                        ShowPagingDiv(false);
                        SetNoRecordContent('ui_tblReportData', noOfColumns, 'ui_tbodyReportData');
                    }
                }
                else {
                    ShowErrorMessage(GlobalErrorList.Leads.DeleteFailureStatus);
                    $("#ui_div_" + DeleteContactId).removeClass("activeBgRow");
                    HidePageLoading();
                    return false;
                }

                $("#deletelmsleads").modal("hide");
            },
            error: ShowAjaxError
        });
    },
    //Modal show for assign single lead label 
    AssignSingleLabelModalShow: function (ContactId, Label, LmsGroupId, LmsGroupMembersId, UserInfoUserId) {
        //if (Plumb5UserId == UserInfoUserId || LmsPermissionlevelSeniorUserID == 0) {
        $("#ui_div_" + ContactId).addClass("activeBgRow");
        $("#ui_drpdwn_AssignLabel").val(Label);
        $("#ui_btn_AssignSingleLabel").attr("ContactId", ContactId);
        $("#ui_btn_AssignSingleLabel").attr("LmsGroupId", LmsGroupId);
        $("#ui_btn_AssignSingleLabel").attr("LmsGroupMembersId", LmsGroupMembersId);
        $("#ui_btn_AssignSingleLabel").attr("UserInfoUserId", UserInfoUserId);
        $("#lmsAssignlabel").modal();

    },
    //Confirm for assign single lead label
    AssignSingleLabel: function () {
        if ($("#ui_drpdwn_AssignLabel").val() == 'Select') {
            $("#lmsAssignlabel").modal('hide');
            ShowErrorMessage(GlobalErrorList.Leads.AssignLabelSelectionError);
            return false;
        }
        ShowPageLoading();
        var contactId = $("#ui_btn_AssignSingleLabel").attr("ContactId");
        var LmsGroupId = $("#ui_btn_AssignSingleLabel").attr("LmsGroupId");
        var LmsGroupMembersId = $("#ui_btn_AssignSingleLabel").attr("LmsGroupMembersId");
        var _UserInfoUserId = $("#ui_btn_AssignSingleLabel").attr("UserInfoUserId");
        var LeadList = [];
        var LeadLmsgroupidlist = [];
        //LeadList.push(contactId);
        LeadLmsgroupidlist.push(LmsGroupMembersId);
        var LabelValue = $("#ui_drpdwn_AssignLabel").val();
        $.ajax({
            url: "/Prospect/Leads/UpdateLeadLabel",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'LeadLmsGroupMemberList': LeadLmsgroupidlist, 'LabelValue': LabelValue, "LmsGroupId": LmsGroupId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("#lmsAssignlabel").modal('hide');
                if (response.Status) {
                    ShowSuccessMessage(GlobalErrorList.Leads.AssignLabelSuccessStatus);
                    $("#ui_div_lblStatus_" + LmsGroupMembersId).empty();
                    var LabelStatusValue = "";
                    if (LabelValue.toLowerCase() == "hot")
                        LabelStatusValue = "<span class='lmslabelhot'>" + LabelValue + "</span><span onclick=\"LeadsReportDetailsUtil.AssignSingleLabelModalShow(" + contactId + ",'Hot'," + LmsGroupId + "," + LmsGroupMembersId + "," + _UserInfoUserId + ");;\" class='icon ion-android-more-vertical lmseditlabel'></span>";
                    else if (LabelValue.toLowerCase() == "warm")
                        LabelStatusValue = "<span class='lmslabelwarm'>" + LabelValue + "</span><span onclick=\"LeadsReportDetailsUtil.AssignSingleLabelModalShow(" + contactId + ",'Warm'," + LmsGroupId + "," + LmsGroupMembersId + "," + _UserInfoUserId + ");;\" class='icon ion-android-more-vertical lmseditlabel'></span>";
                    else if (LabelValue.toLowerCase() == "cold")
                        LabelStatusValue = "<span class='lmslabelcold'>" + LabelValue + "</span><span onclick=\"LeadsReportDetailsUtil.AssignSingleLabelModalShow(" + contactId + ",'Cold'," + LmsGroupId + "," + LmsGroupMembersId + "," + _UserInfoUserId + ");;\" class='icon ion-android-more-vertical lmseditlabel'></span>";
                    $("#ui_div_lblStatus_" + LmsGroupMembersId).html(LabelStatusValue);
                    LmsDefaultFunctionUtil.UpdateUpdatedDate(LmsGroupMembersId);
                }
                else
                    ShowErrorMessage(GlobalErrorList.Leads.AssignLabelFailureStatus);
                $("#ui_div_" + LmsGroupMembersId).removeClass("activeBgRow");
                $("#ui_btn_AssignSingleLabel").removeAttr("ContactId");
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    //Modal show for assign single lead handled by
    AssignSingleLeadModalShow: function (ContactId, UserId, LmsGroupMemberId, Lmsgroupid) {
        /*if (Plumb5UserId == UserId || LmsPermissionlevelSeniorUserID == 0) {*/
        $("#ui_div_" + ContactId).addClass("activeBgRow");
        $("#ui_drpdwn_AssignLead").val(UserId);
        $("#ui_btn_AssignSingleLead").attr("ContactId", ContactId);
        $("#ui_btn_AssignSingleLead").attr("LmsGroupMemberId", LmsGroupMemberId);
        $("#ui_btn_AssignSingleLead").attr("Lmsgroupid", Lmsgroupid);
        $("#ui_btn_AssignSingleLead").attr("presentuserid", UserId);
        $("#lmsAssignLead").modal();

    },
    //Confirm for assign single lead handled by
    AssignSingleLead: function () {
        if (parseInt($("#ui_drpdwn_AssignLead").val()) === 0) {
            $("#lmsAssignLead").modal('hide');
            ShowErrorMessage(GlobalErrorList.Leads.AssignLeadSelectionError);
            return false;
        }
        var contactId = $("#ui_btn_AssignSingleLead").attr("ContactId");
        var LmsGroupId = $("#ui_btn_AssignSingleLead").attr("Lmsgroupid");
        var LmsGroupMembersId = $("#ui_btn_AssignSingleLead").attr("LmsGroupMemberId");
        var _presentuserid = $("#ui_btn_AssignSingleLead").attr("presentuserid");

        if (leadswithsameagentandgroup.includes(contactId + "_" + LmsGroupId + "_" + $("#ui_drpdwn_AssignLead").val())) {
            $("#lmsAssignLead").modal('hide');
            ShowErrorMessage(GlobalErrorList.Leads.Alreadyleadassigned);
            return false;
        }

        ShowPageLoading();
        var LeadList = [];
        //LeadList.push(contactId);
        LeadList.push(LmsGroupMembersId);
        var UserInfoUserId = parseInt($("#ui_drpdwn_AssignLead").val());
        $.ajax({
            url: "/Prospect/Leads/BulkAssignSalesPerson",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'LmsGroupMemberId': LeadList, 'UserInfoUserId': UserInfoUserId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("#lmsAssignLead").modal('hide');
                if (response.Status) {
                    ShowSuccessMessage(response.TotalAssignmentDone + GlobalErrorList.Leads.AssignLeadSuccessStatus);
                    leadswithsameagentandgroup[leadswithsameagentandgroup.indexOf(contactId + "_" + LmsGroupId + "_" + _presentuserid)] = contactId + "_" + LmsGroupId + "_" + $("#ui_drpdwn_AssignLead").val();
                    $("#ui_div_LeadAgent_" + LmsGroupMembersId).empty();
                    var userName = LmsDefaultFunctionUtil.GetAgentNameByUserId(UserInfoUserId);
                    $("#ui_div_LeadAgent_" + LmsGroupMembersId).html(((userName == null) ? "" : (userName.length > 25) ? (userName.substring(0, 25) + "..") : userName));
                    $("#ui_i_LeadAgent_" + LmsGroupMembersId).attr("onclick", "LeadsReportDetailsUtil.AssignSingleLeadModalShow(" + contactId + "," + UserInfoUserId + "," + LmsGroupMembersId + "," + LmsGroupId + ")");
                    LmsDefaultFunctionUtil.UpdateUpdatedDate(contactId, LmsGroupId);
                }
                else
                    ShowErrorMessage(GlobalErrorList.Leads.AssignLeadFailureStatus);
                $("#ui_div_" + contactId).removeClass("activeBgRow");
                $("#ui_btn_AssignSingleLead").removeAttr("ContactId");
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    //Modal show for assign single lead stage
    AssignSingleStageModalShow: function (ContactId, Score, Revenue, ClouserDate, LmsGroupId, LmsGroupmemberId, LmsGroupName, UserInfoUserId, permissionstatus, EmailId, Phonenumber) {
        //if (Plumb5UserId == UserInfoUserId || LmsPermissionlevelSeniorUserID == 0) {
        $("#ui_div_" + ContactId).addClass("activeBgRow");
        $("#ui_drpdwn_AssignStage").val(Score);
        $("#txtlmsRevenue").val(Revenue);
        var _ClouserDate = "";
        if (!ClouserDate.toLowerCase().includes('na') && ClouserDate != "" && ClouserDate != 'null')
            _ClouserDate = LeadsReportDetailsUtil.GetDateValue(ClouserDate);
        $("#txtlmsclosuredate").val(_ClouserDate[0]);
        $("#ui_btn_AssignSingleStage").attr("ContactId", ContactId);
        $("#ui_btn_AssignSingleStage").attr("Score", Score);
        $("#ui_btn_AssignSingleStage").attr("LmsGroupId", LmsGroupId);
        $("#ui_btn_AssignSingleStage").attr("LmsGroupmemberId", LmsGroupmemberId);
        $("#ui_btn_AssignSingleStage").attr("LmsGroupName", LmsGroupName);
        $("#ui_btn_AssignSingleStage").attr("UserInfoUserId", UserInfoUserId);
        $("#lmsAssignStage").modal();
        $("#ui_btn_AssignSingleStage").attr("EmailId", EmailId);
        $("#ui_btn_AssignSingleStage").attr("Phonenumber", Phonenumber);

    },
    //Confirm for assign single lead stage
    AssignSingleStage: function () {
        var contactId = parseInt($("#ui_btn_AssignSingleStage").attr("ContactId"));
        var LmsGroupId = parseInt($("#ui_btn_AssignSingleStage").attr("LmsGroupId"));
        var LmsGroupmemberId = parseInt($("#ui_btn_AssignSingleStage").attr("LmsGroupmemberId"));
        var LmsGroupName = $("#ui_btn_AssignSingleStage").attr("LmsGroupName");
        var _UserInfoUserId = $("#ui_btn_AssignSingleStage").attr("UserInfoUserId");
        var _Permissionstatus = $("#ui_btn_AssignSingleStage").attr("Permissionstatus");
        var _EmailId = $("#ui_btn_AssignSingleStage").attr("EmailId");
        var _Phonenumber = $("#ui_btn_AssignSingleStage").attr("Phonenumber");
        if (parseInt($("#ui_drpdwn_AssignStage").val()) === -1) {
            ShowErrorMessage(GlobalErrorList.Leads.AssignStageSelectionError);
            return false;
        }

        if ($("#txtlmsclosuredate").val() == "" && $("#txtlmsRevenue").val() == "") {
            if (parseInt($("#ui_drpdwn_AssignStage").val()) === -1) {
                $("#lmsAssignStage").modal('hide');
                $("#ui_div_" + contactId).removeClass("activeBgRow");
                ShowErrorMessage(GlobalErrorList.Leads.AssignStageSelectionError);
                return false;
            }

        }

        var oldSCore = parseInt($("#ui_btn_AssignSingleStage").attr("Score"));
        var Score = parseInt($("#ui_drpdwn_AssignStage").val());
        var Revenue = $("#txtlmsRevenue").val() != "" ? parseInt($("#txtlmsRevenue").val()) : 0;
        var ClouserDate = "";
        var _SelectedDate = "";
        var _SelectedDate = "";
        if ($("#txtlmsclosuredate").val() != "") {
            if (!isGoodDate($("#txtlmsclosuredate").val())) {
                ShowErrorMessage(GlobalErrorList.PageHeadingWithDate.date_incorrect_format);
                $("#txtlmsclosuredate").focus();
                return false;
            }
            var SelectedDateString = $("#txtlmsclosuredate").val().split("/");
            var SelectedDate = new Date(SelectedDateString[2], parseInt(SelectedDateString[0]) - 1, SelectedDateString[1], 00, 00, 00);
            if (SelectedDate <= new Date()) {
                ShowErrorMessage(GlobalErrorList.Leads.NoSingleGreaterDate);
                HidePageLoading();
                return false;
            }


            _SelectedDate = SelectedDate.getFullYear() + '-' + LeadsReportDetailsUtil.AddingPrefixZero((SelectedDate.getMonth() + 1)) + '-' + LeadsReportDetailsUtil.AddingPrefixZero(SelectedDate.getDate()) + " " + LeadsReportDetailsUtil.AddingPrefixZero(01) + ":" + LeadsReportDetailsUtil.AddingPrefixZero(59) + ":" + LeadsReportDetailsUtil.AddingPrefixZero(59);

            ClouserDate = SelectedDate.getFullYear() + '-' + LeadsReportDetailsUtil.AddingPrefixZero((SelectedDate.getMonth() + 1)) + '-' + LeadsReportDetailsUtil.AddingPrefixZero(SelectedDate.getDate()) + " " + LeadsReportDetailsUtil.AddingPrefixZero(18) + ":" + LeadsReportDetailsUtil.AddingPrefixZero(59) + ":" + LeadsReportDetailsUtil.AddingPrefixZero(59);
            if (ClouserDate.toLowerCase().includes('na'))
                ShowErrorMessage(GlobalErrorList.Leads.LMSClouserDateError);
        }
        var selectedClouserDate = ClouserDate != "" ? $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(_SelectedDate)) : 'NA';

        //if (oldSCore == Score) {
        //    $("#lmsAssignStage").modal('hide');
        //    $("#ui_div_" + contactId).removeClass("activeBgRow");
        //    ShowErrorMessage(GlobalErrorList.Leads.AssignStageAlreadyExisting);
        //    return false;
        //}

        var UserInfoUserId = parseInt($("#ui_div_ContactName_" + contactId + "_" + LmsGroupId).attr('userid'));
        var leademailid = _EmailId;

        var stages = new Array();

        var sample = JSLINQ(allStageDetails).Where(function () {
            return (this.Score == oldSCore);
        });

        if (sample.items[0] != null && sample.items[0] != "" && sample.items[0] != undefined)
            stages.push(sample.items[0].Stage);

        stages.push($("#ui_drpdwn_AssignStage option:selected").text());

        ShowPageLoading();

        var lead = new Object();
        lead.ContactId = contactId;
        lead.Score = Score;  
        lead.Revenue = Revenue;
        lead.ClouserDate = new Date(ClouserDate)  ;
        lead.LmsGroupmemberId = LmsGroupmemberId;
        lead.EmailId = _EmailId;
        lead.Phonenumber = _Phonenumber;
        var _SeniorUserId = UserList
            .filter(x => x.UserInfoUserId === UserInfoUserId)

        $.ajax({
            url: "/Prospect/Leads/UpdateStage",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'mLContact': lead, 'stages': stages, 'leadEmailId': leademailid, 'UserInfoUserId': UserInfoUserId, 'ClouserDate': ClouserDate, 'LmsGroupName': LmsGroupName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $("#lmsAssignStage").modal('hide');
                if (response.Status) {

                    ShowSuccessMessage(GlobalErrorList.Leads.AssignStageSuccessStatus);

                    $("#ui_div_LeadStage_" + LmsGroupmemberId).empty();
                    $("#ui_div_LeadStagerevenue_" + LmsGroupmemberId).empty();
                    var sample = JSLINQ(allStageDetails).Where(function () {
                        return (this.Score == Score);
                    });
                    var stagestyle = "", StageName = "";
                    if (sample.items[0] != null && sample.items[0] != "" && sample.items[0] != undefined) {
                        StageName = sample.items[0].Stage;
                        stagestyle = "style='background-color:" + sample.items[0].IdentificationColor + "; color:" + getReadableForeColor(sample.items[0].IdentificationColor) + ";'";
                    }
                    $("#ui_div_LeadStage_" + LmsGroupmemberId).html("<span class='lmslblstage' " + stagestyle + " id = 'ui_txtStage_" + contactId + "' > " + StageName + "</span > <span onclick=\"LeadsReportDetailsUtil.AssignSingleStageModalShow(" + contactId + "," + Score + "," + Revenue + ",'" + _SelectedDate + "','" + LmsGroupId + "','" + LmsGroupmemberId + "','" + LmsGroupName + "','" + _UserInfoUserId + "','" + _EmailId + "','" + _Phonenumber + "');\" class='icon ion-android-more-vertical lmschangestage'></span>");
                    $("#ui_div_LeadStagerevenue_" + LmsGroupmemberId).html("<p class='m-0 viewreminddate text-secondary text-left'> Revenue : " + Revenue + "</p> <small class=' class='m - 0 viewreminddate text - secondary text - left'>Closure Date: " + selectedClouserDate + "</small>");


                    if (response.AssignedUserInfoUserId > 0) {
                        $("#ui_p_LeadAgent_" + LmsGroupmemberId).empty();
                        var userName = LmsDefaultFunctionUtil.GetAgentNameByUserId(response.AssignedUserInfoUserId);
                        if (userName == null || userName == "" || userName == "NA")
                            $("#ui_div_" + LmsGroupmemberId).empty();

                        $("#ui_p_LeadAgent_" + LmsGroupmemberId).html(((userName == null) ? "" : (userName.length > 25) ? (userName.substring(0, 25) + "..") : userName) + "<i onclick=\"LeadsReportDetailsUtil.AssignSingleLeadModalShow(" + contactId + "," + response.AssignedUserInfoUserId + "," + LmsGroupmemberId + "," + LmsGroupId + ");\" class='ion ion-ios-compose-outline lmshandlednamedrp'></i>");
                        $("#ui_div_LeadAgent_" + LmsGroupmemberId).html(((userName == null) ? "" : (userName.length > 25) ? (userName.substring(0, 25) + "..") : userName));

                    }
                    LmsDefaultFunctionUtil.UpdateUpdatedDate(contactId, LmsGroupmemberId);
                }
                else
                    ShowErrorMessage(GlobalErrorList.Leads.AssignStageFailureStatus);

                if (response.Status) {
                    var LmsNotificationDetails = JSLINQ(LmsStageNotificationList).Where(function () { return (this.LmsStageId == sample.items[0].Id); });
                    if ((LmsNotificationDetails) != undefined && LmsNotificationDetails.items.length > 0) {
                        //if (LmsNotificationDetails.items[0].IsOpenFollowUp)
                        //    LeadsReportDetailsUtil.ShowAddFollowUpPopUp(contactId, $("#ui_div_ContactName_" + contactId).text(), $("#ui_txtEmail_" + contactId).html(), UserInfoUserId);

                        if (LmsNotificationDetails.items[0].IsOpenNotes)
                            LeadReportBindingUtil.EditFollowUpNoteDetails(LmsGroupmemberId, contactId, $("#ui_div_ContactName_" + contactId + "_" + LmsGroupId).text(), _EmailId, UserInfoUserId, LmsGroupId, _Permissionstatus, Score);
                    }
                }

                $("#ui_div_" + contactId + "_" + LmsGroupId).removeClass("activeBgRow");
                if (_SeniorUserId[0].SeniorUserId == 0 && _SeniorUserId[0].UserInfoUserId != response.AssignedUserInfoUserId)
                    $("#ui_div_" + contactId + "_" + LmsGroupId).remove();
                if ($('#ui_tbodyReportData').find('tr').length == 0)
                    SetNoRecordContent('ui_tableReport', noOfColumns, 'ui_tbodyReportData');

                $("#ui_btn_AssignSingleStage").removeAttr("ContactId");
                $("#ui_btn_AssignSingleStage").removeAttr("Score");
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    GetDateValue: function (ClouserDate) {
        let date = GetJavaScriptDateObj(ClouserDate);
        let TimeFormate = "AM";
        if (date.getHours() > 11) {
            TimeFormate = "PM";
        }

        let time = date.getHours().toString().length == 1 ? "0" + date.getHours().toString() : date.getHours().toString();
        time = LeadsReportDetailsUtil.GetHoursFormate(TimeFormate, time);
        let minutes = date.getMinutes().toString().length == 1 ? "0" + date.getMinutes().toString() : date.getMinutes().toString();
        date = parseInt(date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
        return [date, time, minutes, TimeFormate];
    },
    GetHoursFormate: function (Formart, hour) {
        if (Formart.toLowerCase() == "pm") {
            switch (hour) {
                case "13":
                    hour = "01";
                    break;
                case "14":
                    hour = "02";
                    break;
                case "15":
                    hour = "03";
                    break;
                case "16":
                    hour = "04";
                    break;
                case "17":
                    hour = "05";
                    break;
                case "18":
                    hour = "06";
                    break;
                case "19":
                    hour = "07";
                    break;
                case "20":
                    hour = "08";
                    break;
                case "21":
                    hour = "09";
                    break;
                case "22":
                    hour = "10";
                    break;
                case "23":
                    hour = "11";
                    break;
                default: hour;
            }
        }

        return hour;
    },
    AddingPrefixZero: function (n) {
        return (n < 10) ? ("0" + n) : n;
    }

};

$("#btn_AddFollowUp").click(function (e) {
    LeadsReportDetailsUtil.ButtonClickAddFollowUp();
    e.stopImmediatePropagation();
});

$("#submitFollowupCompleted").click(function (e) {
    LeadsReportDetailsUtil.ConfirmUpdateFollowUpCompleted();
    e.stopImmediatePropagation();
});

$("#cancelFollowupCompleted").click(function (e) {
    $("#confirmfollowupcomplete").modal("hide");
    var LmsGroupmemberId = $("#submitFollowupCompleted").attr("LmsGroupmemberId");
    $("#ui_div_" + LmsGroupmemberId).removeClass("activeBgRow");
    $("#submitFollowupCompleted").removeAttr("LmsGroupmemberId");
    e.stopImmediatePropagation();
});

$("#ui_NotesAttachmentfiles").change(function () {
    LeadsReportDetailsUtil.NotesFileAttachement();
});
$("#ui_NotesAttachmentfilesLms").change(function () {
    LeadsReportDetailsUtil.NotesFileAttachement();
});

$("#btnSaveNotesDetails,#btnSaveNotesDetailsLms").click(function (e) {
    LeadsReportDetailsUtil.SaveNotes();
    e.stopImmediatePropagation();
});

$("#deleteRowConfirm").click(function (e) {
    LeadsReportDetailsUtil.DeleteLeads();
    e.stopImmediatePropagation();
});

$("#ui_btn_AssignSingleLabel").click(function (e) {
    LeadsReportDetailsUtil.AssignSingleLabel();
    e.stopImmediatePropagation();
});

$("#ui_btn_AssignSingleLead").click(function (e) {
    LeadsReportDetailsUtil.AssignSingleLead();
    e.stopImmediatePropagation();
});

$("#ui_btn_AssignSingleStage").click(function (e) {
    LeadsReportDetailsUtil.AssignSingleStage();
    e.stopImmediatePropagation();
});

//Set Remainder
$('input[name="lmsagntremindtype"]').click(function (e) {
    let getlmsremdval = $('input[name="lmsagntremindtype"]:checked').val();
    ReminderPopUpShowHide(getlmsremdval);
    e.stopImmediatePropagation();
});

function ReminderPopUpShowHide(getlmsremdval) {
    $(".lmsremindcontwrp").removeClass("hideDiv");
    if (getlmsremdval == "email") {
        $(".lmssmsremd,.lmswhatsappremd").addClass("hideDiv");
        $(".lmsemlremd").removeClass("hideDiv");
    } else if (getlmsremdval == "sms") {
        $(".lmsemlremd,.lmswhatsappremd").addClass("hideDiv");
        $(".lmssmsremd").removeClass("hideDiv");
    }
    else if (getlmsremdval == "whatsapp") {
        $(".lmsemlremd,.lmssmsremd").addClass("hideDiv");
        $(".lmssmsremd").removeClass("hideDiv");
    } else {
        $(".lmsemlremd, .lmssmsremd,.lmswhatsappremd").removeClass("hideDiv");
    }
}

$("#ui_setremainderDiv").click(function (e) {
    if (!$(".lmsremindcontwrp").hasClass("hideDiv"))
        $(".lmsremindcontwrp").addClass("hideDiv");

    if (!$("#ui_setRemainderDivPop").hasClass("hideDiv"))
        $("#ui_setRemainderDivPop").addClass("hideDiv");
    else {
        $("#ui_setRemainderDivPop").removeClass("hideDiv");

        $("#ui_remainderdate").val($("#txtFollowUpDate").val());
        $("#ui_remainderdate").val($("#txtFollowUpDate").val());

        let drpValue = $("#ui_ddl_FollowUpTime").val().split(":");
        if (parseInt(drpValue[1]) == 0)
            $("#ui_remainderdateTime").val(PrefixZero(parseInt(drpValue[0]) - 1) + ":45");
        else
            $("#ui_remainderdateTime").val(drpValue[0] + ":" + PrefixZero(parseInt(drpValue[1]) - 15));

        $("#lmsagntrememl").prop('checked', true);
        ReminderPopUpShowHide('email');
    }

    e.stopImmediatePropagation();
});

$("#ui_remainderdate,#txtFollowUpDate").datepicker({
    defaultDate: "+1d",
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: false,
    minDate: new Date()
});

$("#txtFollowUpSalesPerson").change(function () {
    $("#ui_setRemainderEmailId,#ui_setRemainderPhoneNumber").val('');
    let selectedId = this.value;
    if (selectedId != 0) {
        $("#ui_setRemainderEmailId").val(LmsDefaultFunctionUtil.GetAgentEmailIdByUserId(selectedId));
        $("#ui_setRemainderPhoneNumber").val(LmsDefaultFunctionUtil.GetAgentPhoneNumberByUserId(selectedId));
    }
});

